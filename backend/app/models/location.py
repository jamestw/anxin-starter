from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models._mixins import CarrierScopedMixin


class LocationPing(CarrierScopedMixin, Base):
    """司機 App 回報的定位點（行程中每幾秒一筆，離線時批次補傳）"""

    __tablename__ = "location_pings"
    __table_args__ = (Index("ix_location_pings_trip_ts", "trip_id", "ts"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    trip_id: Mapped[int] = mapped_column(ForeignKey("trips.id", ondelete="CASCADE"))
    driver_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    ts: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    lat: Mapped[float] = mapped_column(Float)
    lng: Mapped[float] = mapped_column(Float)
    speed: Mapped[float | None] = mapped_column(Float)
    heading: Mapped[float | None] = mapped_column(Float)
    accuracy: Mapped[float | None] = mapped_column(Float)
