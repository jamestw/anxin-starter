from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column


class TimestampMixin:
    """時間一律存 UTC（timestamptz），顯示時才轉台北時區。"""

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class CarrierScopedMixin:
    """多租戶：業務表都掛 carrier_id，查詢一律帶車行範圍（見 api/deps.py 的 CurrentCarrier）。"""

    carrier_id: Mapped[int] = mapped_column(ForeignKey("carriers.id", ondelete="CASCADE"), index=True)
