from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

# User Roles
class UserRole(str):
    FARMER = "farmer"
    OFFICER = "officer"
    GOVT = "govt"
    RESEARCHER = "researcher"
    ADMIN = "admin"

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=2)
    phone_number: Optional[str] = None
    role: str = "farmer"

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "farmer"

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: str
    created_at: Optional[datetime] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False

class GoogleOAuthLogin(BaseModel):
    id_token: str
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 3600
    user: Dict[str, Any]

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp_code: str
    new_password: str = Field(..., min_length=8)

class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp_code: str

# First Login Wizard Step Schemas
class WizardStep1BasicInfo(BaseModel):
    full_name: str
    phone_number: Optional[str] = None
    language: str = "en"

class WizardStep2FarmRegistration(BaseModel):
    farm_name: str
    farm_size_acres: float = Field(..., ge=0)
    address: str
    state: str
    district: str
    village: Optional[str] = None

class WizardStep3CropSelection(BaseModel):
    crop_types: List[str] = []

class WizardStep4Location(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class WizardStep5NotificationPreferences(BaseModel):
    email_alerts: bool = True
    sms_alerts: bool = False
    pest_warnings: bool = True
    weather_updates: bool = True
    market_prices: bool = True

class WizardCompleteRequest(BaseModel):
    step1: WizardStep1BasicInfo
    step2: WizardStep2FarmRegistration
    step3: WizardStep3CropSelection
    step4: WizardStep4Location
    step5: WizardStep5NotificationPreferences

class UserProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: uuid.UUID
    email: EmailStr
    full_name: str
    phone_number: Optional[str] = None
    role: str
    is_active: bool
    is_verified: bool
    is_wizard_completed: bool
    avatar_url: Optional[str] = None
    language: str
    address: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    village: Optional[str] = None
    farm_name: Optional[str] = None
    farm_size_acres: Optional[float] = None
    crop_types: List[str] = []
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    notification_preferences: Dict[str, Any] = {}
    created_at: datetime

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    avatar_url: Optional[str] = None
    language: Optional[str] = None
    address: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    village: Optional[str] = None
    farm_name: Optional[str] = None
    farm_size_acres: Optional[float] = None
    crop_types: Optional[List[str]] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    notification_preferences: Optional[Dict[str, Any]] = None

class DeviceResponse(BaseModel):
    id: str
    device_name: str
    browser: Optional[str] = None
    os: Optional[str] = None
    ip_address: Optional[str] = None
    country: Optional[str] = None
    login_time: datetime
    last_active: datetime
    is_current: bool = False

# AI & Disease Scanner Schemas
class DiagnosisResult(BaseModel):
    scan_id: str
    crop: str
    disease_detected: str
    confidence: float
    severity_percentage: float
    severity_level: str
    infected_area_sq_cm: float
    gradcam_heatmap_url: str
    symptoms: List[str]
    probable_sources: List[str]
    yield_loss_projection: str
    treatment_recommendations: List[str]
    progression: List[Dict[str, Any]]
    timestamp: datetime

# Multi-Agent Mesh Schemas
class AgentChatMessage(BaseModel):
    sender: str
    content: str
    agent_type: Optional[str] = None
    timestamp: Optional[datetime] = None

# Community & Outbreak Schemas
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

# Simulation Engine Schemas
class WhatIfParameters(BaseModel):
    humidity: float = 84.0
    temperature: float = 27.4
    rainfall_mm: float = 45.0
    soil_moisture_pct: float = 62.0
    nitrogen_level: float = 120.0
    potassium_level: float = 80.0
    plant_age_days: int = 45
    disease_severity_pct: float = 34.2
    treatment_delay_days: int = 0
    spray_amount_liters: float = 1.0
    plant_density_per_sqm: float = 4.5
    wind_speed_kmh: float = 14.0

class ScenarioInput(BaseModel):
    id: Optional[str] = None
    name: str
    treatment_type: str  # No Treatment, Organic Spray, Chemical Spray, IPM, Biological Control, Custom Treatment
    treatment_delay_days: int = 0
    weather_modifier: str = "Normal"  # Normal, Heavy Rain, Light Rain, High Humidity, Low Humidity, Heat Wave, Cold Wave, Strong Wind, Drought
    irrigation_level: str = "Normal Irrigation"  # Increase Water, Reduce Water, Normal Irrigation
    fertilizer_type: str = "Organic"  # Organic, Chemical, None
    crop_management: str = "Pruning"  # Pruning, Remove Infected Leaves, Crop Rotation, None

class SimulationRunRequest(BaseModel):
    crop: str = "Tomato"
    disease_detected: str = "Tomato Early Blight"
    initial_severity: float = 34.2
    acreage: float = 2.5
    what_if_parameters: Optional[WhatIfParameters] = None
    scenarios: List[ScenarioInput] = []

class DayTimelinePoint(BaseModel):
    day: int
    severity: float
    spread_probability: float
    yield_loss_pct: float
    projected_revenue: float
    health_index: float

class ScenarioSimulationResult(BaseModel):
    id: str
    name: str
    treatment_type: str
    final_severity: float
    spread_probability: float
    yield_prediction_pct: float
    projected_revenue_usd: float
    projected_profit_usd: float
    treatment_cost_usd: float
    chemical_usage_liters: float
    water_usage_liters: float
    carbon_footprint_kg: float
    recovery_probability: float
    risk_level: str
    time_to_recovery_days: int
    recommended_action: str
    confidence_score: float
    overall_score: float
    timeline: List[DayTimelinePoint]

class DecisionRankingOutput(BaseModel):
    best_strategy: str
    lowest_risk_strategy: str
    highest_profit_strategy: str
    most_sustainable_strategy: str
    fastest_recovery_strategy: str
    lowest_water_usage_strategy: str
    lowest_carbon_strategy: str
    best_cost_efficiency_strategy: str
    rankings: List[Dict[str, Any]]
    reasoning_summary: str

class SimulationEngineResponse(BaseModel):
    simulation_id: str
    crop: str
    disease_detected: str
    initial_severity: float
    acreage: float
    what_if_parameters: WhatIfParameters
    scenarios_results: List[ScenarioSimulationResult]
    decision_ranking: DecisionRankingOutput
    timestamp: datetime

