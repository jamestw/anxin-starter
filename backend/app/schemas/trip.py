from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.trip import TripStatus


class TripOut(BaseModel):
    """JSON 欄位 snake_case；datetime 輸出 ISO 8601 含時區"""

    model_config = ConfigDict(from_attributes=True)

    id: int
    trip_no: str
    pickup_at: datetime
    pickup_address: str
    dropoff_address: str
    driver_name: str | None
    plate_no: str | None
    status: TripStatus
