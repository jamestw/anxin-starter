from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """所有設定從環境變數／.env 讀；新增設定一律加在這裡，不要在程式裡直接讀 os.environ。"""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "安心行 車行後台"
    environment: str = "development"
    database_url: str = "postgresql+asyncpg://anxin:anxin@localhost:5432/anxin"
    redis_url: str = "redis://localhost:6379/0"
    jwt_secret: str = "change-me-in-production"
    jwt_expire_minutes: int = 60 * 12
    timezone: str = "Asia/Taipei"
    cors_origins: list[str] = ["http://localhost:5173"]


@lru_cache
def get_settings() -> Settings:
    return Settings()
