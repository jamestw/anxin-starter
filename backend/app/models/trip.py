import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models._mixins import CarrierScopedMixin, TimestampMixin


class TripStatus(enum.StrEnum):
    """車趟狀態：名稱與前端 lib/trip.ts、司機 App 一致，顏色對應 trip-* token。"""

    assigned = "assigned"  # 已指派
    departed = "departed"  # 已出發
    onboard = "onboard"  # 已上車
    done = "done"  # 完成
    alert = "alert"  # 異常


class Trip(CarrierScopedMixin, TimestampMixin, Base):
    """範例業務表：示範多租戶、狀態、時間欄位的寫法。新專案改名或刪掉。"""

    __tablename__ = "trips"

    id: Mapped[int] = mapped_column(primary_key=True)
    trip_no: Mapped[str] = mapped_column(String(30), index=True)
    pickup_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    pickup_address: Mapped[str] = mapped_column(String(200))
    dropoff_address: Mapped[str] = mapped_column(String(200))
    driver_name: Mapped[str | None] = mapped_column(String(60))
    plate_no: Mapped[str | None] = mapped_column(String(20))
    status: Mapped[TripStatus] = mapped_column(
        Enum(TripStatus, native_enum=False, length=20), default=TripStatus.assigned
    )
