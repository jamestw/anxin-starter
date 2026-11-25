from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.trip import Trip


async def list_trips(
    db: AsyncSession, carrier_id: int, *, q: str | None, limit: int, offset: int
) -> tuple[list[Trip], int]:
    """商業邏輯放 services/，router 只負責收參數與回傳。第一個條件永遠是車行範圍。"""
    stmt = select(Trip).where(Trip.carrier_id == carrier_id)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(
            or_(
                Trip.trip_no.ilike(like),
                Trip.pickup_address.ilike(like),
                Trip.dropoff_address.ilike(like),
                Trip.driver_name.ilike(like),
            )
        )
    total = await db.scalar(select(func.count()).select_from(stmt.subquery()))
    rows = await db.scalars(stmt.order_by(Trip.pickup_at.desc()).limit(limit).offset(offset))
    return list(rows), total or 0
