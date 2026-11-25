"""每張表一個檔；這裡集中 import，Alembic autogenerate 才看得到所有表。"""

from app.models.carrier import Carrier
from app.models.location import LocationPing
from app.models.trip import Trip, TripStatus
from app.models.user import User, UserRole

__all__ = ["Carrier", "LocationPing", "Trip", "TripStatus", "User", "UserRole"]
