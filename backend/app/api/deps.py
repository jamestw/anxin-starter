from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User, UserRole

DB = Annotated[AsyncSession, Depends(get_db)]

_bearer = HTTPBearer(auto_error=False)


async def get_current_user(db: DB, cred: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)]) -> User:
    # 錯誤一律 HTTPException + 中文 detail，前端直接顯示
    if cred is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "未登入")
    try:
        payload = decode_access_token(cred.credentials)
    except jwt.PyJWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "登入已過期，請重新登入") from None
    user = await db.get(User, int(payload["sub"]))
    if user is None or not user.is_active:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "帳號不存在或已停用")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


async def get_current_carrier_id(user: CurrentUser) -> int:
    """多租戶：業務 API 一律依賴這個，拿到的 carrier_id 放進每個查詢的 WHERE。"""
    if user.carrier_id is None:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "此功能需要車行帳號")
    return user.carrier_id


CurrentCarrier = Annotated[int, Depends(get_current_carrier_id)]


def require_roles(*roles: UserRole):
    async def checker(user: CurrentUser) -> User:
        if user.role not in roles:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "權限不足")
        return user

    return Depends(checker)
