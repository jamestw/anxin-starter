from datetime import UTC, datetime, timedelta

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.location import LocationPing
from app.models.trip import Trip, TripStatus
from app.models.user import User
from app.schemas.driver import LocationPoint

# 車趟只能往前走；任何未完成的狀態都可以回報異常，異常後可回到原流程
NEXT: dict[TripStatus, set[TripStatus]] = {
    TripStatus.assigned: {TripStatus.departed, TripStatus.alert},
    TripStatus.departed: {TripStatus.onboard, TripStatus.alert},
    TripStatus.onboard: {TripStatus.done, TripStatus.alert},
    TripStatus.alert: {TripStatus.departed, TripStatus.onboard, TripStatus.done},
    TripStatus.done: set(),
}


async def my_trips(db: AsyncSession, driver: User) -> list[Trip]:
    """司機今天前後的車趟（前 12 小時到後 36 小時），依上車時間排序。"""
    now = datetime.now(UTC)
    rows = await db.scalars(
        select(Trip)
        .where(
            Trip.carrier_id == driver.carrier_id,
            Trip.driver_id == driver.id,
            Trip.pickup_at >= now - timedelta(hours=12),
            Trip.pickup_at <= now + timedelta(hours=36),
        )
        .order_by(Trip.pickup_at)
    )
    return list(rows)


async def _own_trip(db: AsyncSession, driver: User, trip_id: int) -> Trip:
    trip = await db.get(Trip, trip_id)
    if trip is None or trip.carrier_id != driver.carrier_id or trip.driver_id != driver.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "找不到這趟車，可能已改派")
    return trip


async def update_status(db: AsyncSession, driver: User, trip_id: int, new: TripStatus) -> Trip:
    trip = await _own_trip(db, driver, trip_id)
    if new == trip.status:
        return trip  # 重送（網路重試）不算錯
    if new not in NEXT[trip.status]:
        raise HTTPException(status.HTTP_409_CONFLICT, "這趟車目前不能改成這個狀態，請重新整理")
    trip.status = new
    await db.commit()
    await db.refresh(trip)
    return trip


async def add_locations(db: AsyncSession, driver: User, trip_id: int, points: list[LocationPoint]) -> Trip:
    trip = await _own_trip(db, driver, trip_id)
    if trip.status != TripStatus.done:
        db.add_all(
            LocationPing(carrier_id=trip.carrier_id, trip_id=trip.id, driver_id=driver.id, **p.model_dump())
            for p in points
        )
        await db.commit()
    return trip
