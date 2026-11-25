from datetime import UTC, datetime

from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.models import Carrier, Trip, TripStatus, User, UserRole


async def test_health(client: AsyncClient) -> None:
    r = await client.get("/health")
    assert r.json() == {"status": "ok"}


async def test_trips_requires_login(client: AsyncClient) -> None:
    r = await client.get("/api/v1/trips")
    assert r.status_code == 401
    assert r.json()["detail"] == "未登入"


async def test_login_and_trips_are_carrier_scoped(client: AsyncClient, db: AsyncSession) -> None:
    mine, other = Carrier(code="a", name="甲車行"), Carrier(code="b", name="乙車行")
    db.add_all([mine, other])
    await db.flush()
    db.add(
        User(
            carrier_id=mine.id,
            username="u1",
            name="調度一",
            password_hash=hash_password("pw123456"),
            role=UserRole.dispatcher,
        )
    )
    now = datetime.now(UTC)
    for carrier, no in [(mine, "A001"), (other, "B001")]:
        db.add(
            Trip(
                carrier_id=carrier.id,
                trip_no=no,
                pickup_at=now,
                pickup_address="起點",
                dropoff_address="終點",
                status=TripStatus.departed,
            )
        )
    await db.commit()

    bad = await client.post("/api/v1/auth/login", json={"username": "u1", "password": "wrong"})
    assert bad.status_code == 401
    assert bad.json()["detail"] == "帳號或密碼錯誤"

    r = await client.post("/api/v1/auth/login", json={"username": "u1", "password": "pw123456"})
    assert r.status_code == 200
    body = r.json()
    assert body["user"]["carrier_name"] == "甲車行"

    r = await client.get("/api/v1/trips", headers={"Authorization": f"Bearer {body['access_token']}"})
    assert r.status_code == 200
    page = r.json()
    assert page["total"] == 1
    assert page["items"][0]["trip_no"] == "A001"
    assert page["items"][0]["status"] == "departed"
