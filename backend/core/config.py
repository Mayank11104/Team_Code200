
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # --- Database Settings ---
    DATABASE_URL: str = "postgresql://postgres:Ritesh%40123@localhost/gearguard"

    # --- JWT Settings ---
    SECRET_KEY: str = os.environ.get("SECRET_KEY", "a_very_secret_key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # --- Cookie Settings ---
    # Set to True in production over HTTPS
    SECURE_COOKIES: bool = False

    class Config:
        case_sensitive = True

settings = Settings()
