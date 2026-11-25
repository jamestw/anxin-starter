from datetime import UTC, datetime

from httpx import AsyncClient
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.models import Carrier, LocationPing, Trip, TripStatus, User, UserRole


async def _setup(db: AsyncSession) -> tuple[str, int, int]:
    carrier = Carrier(code="drv", name="司機測試車行")
    db.add(carrier)
    await db.flush()
    me = User(
        carrier_id=carrier.id, username="d1", name="司機一", password_hash=hash_password("pw"), role=UserRole.driver
    )
    other = User(
        carrier_id=carrier.id, username="d2", name="司機二", password_hash=hash_password("pw"), role=UserRole.driver
    )
    db.add_all([me, other])
    await db.flush()
    now = datetime.now(UTC)
    mine = Trip(
        carrier_id=carrier.id, trip_no="M1", pickup_at=now, pickup_address="甲", dropoff_address="乙", driver_id=me.id
    )
    theirs = Trip(
        carrier_id=carrier.id,
        trip_no="O1",
        pickup_at=now,
        pickup_address="甲",
        dropoff_address="乙",
        driver_id=other.id,
    )
    db.add_all([mine, theirs])
    await db.commit()
    return me.username, mine.id, theirs.id


async def _token(client: AsyncClient, username: str) -> dict[str, str]:
    r = await client.post("/api/v1/auth/login", json={"username": username, "password": "pw"})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


async def test_driver_flow(client: AsyncClient, db: AsyncSession) -> None:
    username, mine, theirs = await _setup(db)
    h = await _token(client, username)

    r = await client.get("/api/v1/driver/trips", headers=h)
    assert [t["trip_no"] for t in r.json()] == ["M1"]

    # 不能跳關：已指派 → 已上車
    r = await client.post(f"/api/v1/driver/trips/{mine}/status", json={"status": "onboard"}, headers=h)
    assert r.status_code == 409

    for st in ["departed", "onboard"]:
        r = await client.post(f"/api/v1/driver/trips/{mine}/status", json={"status": st}, headers=h)
        assert r.json()["status"] == st

    point = {"ts": datetime.now(UTC).isoformat(), "lat": 25.03, "lng": 121.56}
    r = await client.post(f"/api/v1/driver/trips/{mine}/locations", json={"points": [point, point]}, headers=h)
    assert r.json() == {"accepted": 2, "trip_status": "onboard"}
    assert await db.scalar(select(func.count()).select_from(LocationPing).where(LocationPing.trip_id == mine)) == 2

    # 別人的車趟看不到
    r = await client.post(f"/api/v1/driver/trips/{theirs}/status", json={"status": "departed"}, headers=h)
    assert r.status_code == 404


async def test_dispatcher_cannot_use_driver_api(client: AsyncClient, db: AsyncSession) -> None:
    carrier = Carrier(code="disp", name="調度車行")
    db.add(carrier)
    await db.flush()
    db.add(
        User(
            carrier_id=carrier.id,
            username="disp1",
            name="調度",
            password_hash=hash_password("pw"),
            role=UserRole.dispatcher,
        )
    )
    await db.commit()
    r = await client.get("/api/v1/driver/trips", headers=await _token(client, "disp1"))
    assert r.status_code == 403
    assert TripStatus.done == "done"
