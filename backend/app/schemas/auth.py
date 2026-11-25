from pydantic import BaseModel, ConfigDict

from app.models.user import UserRole


class LoginRequest(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    role: UserRole
    carrier_id: int | None
    carrier_name: str | None = None


class LoginResponse(BaseModel):
    access_token: str
    user: UserOut
