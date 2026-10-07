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
    REFRESH_SECRET_KEY: str = "AGRIMIND_REFRESH_SECRET_KEY_SUPER_SECURE_PRODUCTION_GRADE_67890"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 # 1 hour
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30 # 30 days
    OTP_EXPIRE_MINUTES: int = 10
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Google OAuth
    GOOGLE_CLIENT_ID: Optional[str] = "google-client-id-placeholder"
    GOOGLE_CLIENT_SECRET: Optional[str] = "google-client-secret-placeholder"
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/agrimind_db"
    
    # AI & ML Engine
    MODEL_WEIGHTS_PATH: str = "app/ai_engine/weights/tomato_v8.pt"
    KERAS_MODEL_PATH: str = "ml/models/crop_disease_model.keras"
    CLASS_MAPPING_PATH: str = "ml/models/class_names.json"
    MODEL_METADATA_PATH: str = "ml/models/model_metadata.json"
    CONFIDENCE_THRESHOLD: float = 0.60
    DEVICE: str = "cpu"
    
    class Config:
        case_sensitive = True

settings = Settings()

