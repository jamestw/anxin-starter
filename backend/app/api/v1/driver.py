from fastapi import APIRouter

from app.api.deps import DB, require_roles
from app.models.user import User, UserRole
from app.schemas.driver import LocationAck, LocationBatch, StatusUpdate
from app.schemas.trip import TripOut
from app.services import driver_service

# 司機 App 專用：/api/v1/driver/...，只接受 driver 角色
router = APIRouter(prefix="/driver", tags=["driver"])
Driver = require_roles(UserRole.driver)


@router.get("/trips", response_model=list[TripOut])
async def my_trips(db: DB, driver: User = Driver) -> list[TripOut]:
    return [TripOut.model_validate(t) for t in await driver_service.my_trips(db, driver)]


@router.post("/trips/{trip_id}/status", response_model=TripOut)
async def update_status(trip_id: int, body: StatusUpdate, db: DB, driver: User = Driver) -> TripOut:
    return TripOut.model_validate(await driver_service.update_status(db, driver, trip_id, body.status))


@router.post("/trips/{trip_id}/locations", response_model=LocationAck)
async def add_locations(trip_id: int, body: LocationBatch, db: DB, driver: User = Driver) -> LocationAck:
    trip = await driver_service.add_locations(db, driver, trip_id, body.points)
    return LocationAck(accepted=len(body.points), trip_status=trip.status)
