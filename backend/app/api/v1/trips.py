from typing import Annotated

from fastapi import APIRouter, Query

from app.api.deps import DB, CurrentCarrier
from app.schemas.common import Page
from app.schemas.trip import TripOut
from app.services import trip_service

router = APIRouter(prefix="/trips", tags=["trips"])


@router.get("", response_model=Page[TripOut])
async def list_trips(
    db: DB,
    carrier_id: CurrentCarrier,
    q: str | None = None,
    limit: Annotated[int, Query(ge=1, le=200)] = 50,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> Page[TripOut]:
    rows, total = await trip_service.list_trips(db, carrier_id, q=q, limit=limit, offset=offset)
    return Page[TripOut](items=[TripOut.model_validate(r) for r in rows], total=total)
