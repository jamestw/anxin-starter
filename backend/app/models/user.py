import enum

from sqlalchemy import Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models._mixins import TimestampMixin
from app.models.carrier import Carrier


class UserRole(enum.StrEnum):
    platform_admin = "platform_admin"  # 平台管理，不屬於任何車行
    carrier_admin = "carrier_admin"
    dispatcher = "dispatcher"


class User(TimestampMixin, Base):
    """後台帳號（調度、車行管理員、平台管理）"""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    carrier_id: Mapped[int | None] = mapped_column(ForeignKey("carriers.id", ondelete="CASCADE"), index=True)
    username: Mapped[str] = mapped_column(String(60), unique=True)
    name: Mapped[str] = mapped_column(String(60))
    password_hash: Mapped[str] = mapped_column(String(100))
    role: Mapped[UserRole] = mapped_column(Enum(UserRole, native_enum=False, length=20))
    is_active: Mapped[bool] = mapped_column(default=True)

    carrier: Mapped[Carrier | None] = relationship(lazy="joined")
