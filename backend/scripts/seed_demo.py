"""建立示範車行、帳號與車趟（只給開發環境用）。

用法：uv run python -m scripts.seed_demo
帳號：demo / demo1234（後台）、driver / demo1234（司機 App）
"""

import asyncio
from datetime import UTC, datetime, timedelta

from sqlalchemy import select

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models import Carrier, Trip, TripStatus, User, UserRole


async def main() -> None:
    async with SessionLocal() as db:
        if await db.scalar(select(User).where(User.username == "demo")):
            print("示範資料已存在，略過")
            return
        carrier = Carrier(code="demo", name="示範車行")
        db.add(carrier)
        await db.flush()
        db.add(
            User(
                carrier_id=carrier.id,
                username="demo",
                name="示範調度",
                password_hash=hash_password("demo1234"),
                role=UserRole.carrier_admin,
            )
        )
        driver_user = User(
            carrier_id=carrier.id,
            username="driver",
            name="王大明",
            password_hash=hash_password("demo1234"),
            role=UserRole.driver,
        )
        db.add(driver_user)
        await db.flush()
        now = datetime.now(UTC)
        samples = [
            ("桃園機場第一航廈", "台北市信義區市府路 1 號", "王大明", "RAA-1001", TripStatus.assigned),
            ("台中高鐵站", "台中市西屯區台灣大道三段 99 號", "王大明", "RAB-2002", TripStatus.departed),
            ("新竹科學園區", "桃園機場第二航廈", "陳志強", "RAC-3003", TripStatus.onboard),
            ("台北車站", "基隆港", "林美玲", "RAD-4004", TripStatus.done),
            ("高雄小港機場", "高雄市前鎮區成功二路 11 號", None, None, TripStatus.alert),
        ]
        for i, (src, dst, name, plate, st) in enumerate(samples, start=1):
            db.add(
                Trip(
                    carrier_id=carrier.id,
                    trip_no=f"T{i:04d}",
                    pickup_at=now + timedelta(hours=i),
                    pickup_address=src,
                    dropoff_address=dst,
                    driver_id=driver_user.id if name == "王大明" else None,
                    driver_name=name,
                    plate_no=plate,
                    status=st,
                )
            )
        await db.commit()
        print("已建立示範資料：後台 demo / demo1234，司機 driver / demo1234")


if __name__ == "__main__":
    asyncio.run(main())
