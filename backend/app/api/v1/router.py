from fastapi import APIRouter

from app.api.v1 import auth, driver, trips

# 每個資源一個檔，在這裡註冊；路徑 /api/v1/<複數資源>
api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth.router)
api_router.include_router(trips.router)
api_router.include_router(driver.router)
