from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "farmer" # farmer, researcher, officer, admin

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ProgressionData(BaseModel):
    day: int
    severity: float
    expected_yield_loss: float

class DiagnosisResult(BaseModel):
    scan_id: str
    crop: str
    disease_detected: str
    confidence: float
    severity_percentage: float
    severity_level: str # Low, Medium, High, Critical
    infected_area_sq_cm: float
    gradcam_heatmap_url: str
    symptoms: List[str]
    probable_sources: List[Dict[str, Any]]
    yield_loss_projection: Dict[str, Any]
    treatment_recommendations: Dict[str, Any]
    progression: List[ProgressionData]
    timestamp: datetime

class AgentChatMessage(BaseModel):
    sender: str
    content: str
    agent_type: Optional[str] = None
    data_payload: Optional[Dict[str, Any]] = None

class OutbreakAlert(BaseModel):
    id: str
    region: str
    disease: str
    severity: str
    affected_farms: int
    lat: float
    lng: float
    radius_km: float
    timestamp: datetime
