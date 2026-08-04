from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AgriMind AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000", "*"]
    
    # Auth & JWT
    SECRET_KEY: str = "AGRIMIND_SECRET_KEY_SUPER_SECURE_PRODUCTION_GRADE_12345"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/agrimind_db"
    
    # AI Engine
    MODEL_WEIGHTS_PATH: str = "app/ai_engine/weights/tomato_v8.pt"
    DEVICE: str = "cpu"
    
    class Config:
        case_sensitive = True

settings = Settings()
