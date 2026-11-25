from datetime import datetime

from pydantic import BaseModel, Field

from app.models.trip import TripStatus


class StatusUpdate(BaseModel):
    status: TripStatus


class LocationPoint(BaseModel):
    ts: datetime
    lat: float = Field(ge=-90, le=90)
    lng: float = Field(ge=-180, le=180)
    speed: float | None = None
    heading: float | None = None
    accuracy: float | None = None


class LocationBatch(BaseModel):
    points: list[LocationPoint] = Field(max_length=500)


class LocationAck(BaseModel):
    accepted: int
    trip_status: TripStatus
