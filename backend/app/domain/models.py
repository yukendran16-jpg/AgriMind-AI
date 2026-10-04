from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, Float, Enum as SQLEnum, Text, JSON
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.types import TypeDecorator, CHAR
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from datetime import datetime, timezone
import uuid
import enum

Base = declarative_base()

class GUID(TypeDecorator):
    """Platform-independent GUID type.
    Uses PostgreSQL's UUID type, otherwise uses CHAR(36), storing as stringified hex values.
    """
    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(PG_UUID(as_uuid=True))
        else:
            return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == 'postgresql':
            return str(value)
        else:
            if isinstance(value, uuid.UUID):
                return str(value)
            else:
                return str(uuid.UUID(value))

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        else:
            if isinstance(value, uuid.UUID):
                return value
            else:
                return uuid.UUID(value)

class UserRoleEnum(str, enum.Enum):
    FARMER = "farmer"
    OFFICER = "officer"
    GOVT = "govt"
    RESEARCHER = "researcher"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    phone_number = Column(String(20), nullable=True)
    role = Column(SQLEnum(UserRoleEnum), default=UserRoleEnum.FARMER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    is_wizard_completed = Column(Boolean, default=False, nullable=False)
    avatar_url = Column(Text, nullable=True)
    language = Column(String(10), default="en", nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    sessions = relationship("UserSession", back_populates="user", cascade="all, delete-orphan")
    tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    address = Column(String(255), nullable=True)
    state = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)
    village = Column(String(100), nullable=True)
    farm_name = Column(String(100), nullable=True)
    farm_size_acres = Column(Float, nullable=True)
    crop_types = Column(JSON, default=list, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    notification_preferences = Column(JSON, default=dict, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="profile")

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token_hash = Column(String(255), unique=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    revoked = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="tokens")

class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    device_name = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    last_active = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="sessions")

class OTPVerification(Base):
    __tablename__ = "otp_verifications"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    email = Column(String(255), nullable=False, index=True)
    otp_code = Column(String(10), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

# ==========================================
# AI DECISION SIMULATION ENGINE MODELS
# ==========================================

class Simulation(Base):
    __tablename__ = "simulations"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    crop = Column(String(100), nullable=False, default="Tomato")
    disease_detected = Column(String(150), nullable=False, default="Tomato Early Blight")
    initial_severity = Column(Float, nullable=False, default=34.2)
    acreage = Column(Float, nullable=False, default=2.5)
    what_if_parameters = Column(JSON, default=dict, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    scenarios = relationship("SimulationScenario", back_populates="simulation", cascade="all, delete-orphan")
    recommendations = relationship("DecisionRecommendation", back_populates="simulation", cascade="all, delete-orphan")

class SimulationScenario(Base):
    __tablename__ = "simulation_scenarios"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    simulation_id = Column(GUID, ForeignKey("simulations.id", ondelete="CASCADE"), nullable=False)
    scenario_name = Column(String(150), nullable=False)
    treatment_type = Column(String(100), nullable=False)
    treatment_delay_days = Column(Integer, nullable=False, default=0)
    weather_modifier = Column(String(50), nullable=False, default="Normal")
    irrigation_level = Column(String(50), nullable=False, default="Normal Irrigation")
    fertilizer_type = Column(String(50), nullable=False, default="Organic")
    crop_management_action = Column(String(100), nullable=True)

    simulation = relationship("Simulation", back_populates="scenarios")
    results = relationship("SimulationResult", back_populates="scenario", cascade="all, delete-orphan")

class SimulationResult(Base):
    __tablename__ = "simulation_results"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    scenario_id = Column(GUID, ForeignKey("simulation_scenarios.id", ondelete="CASCADE"), nullable=False)
    final_severity = Column(Float, nullable=False)
    spread_probability = Column(Float, nullable=False)
    yield_prediction_pct = Column(Float, nullable=False)
    projected_revenue_usd = Column(Float, nullable=False)
    projected_profit_usd = Column(Float, nullable=False)
    treatment_cost_usd = Column(Float, nullable=False)
    chemical_usage_liters = Column(Float, nullable=False)
    water_usage_liters = Column(Float, nullable=False)
    carbon_footprint_kg = Column(Float, nullable=False)
    recovery_probability = Column(Float, nullable=False)
    risk_level = Column(String(50), nullable=False)
    time_to_recovery_days = Column(Integer, nullable=False)
    confidence_score = Column(Float, nullable=False)
    overall_score = Column(Float, nullable=False)
    timeline_data = Column(JSON, default=list, nullable=False)

    scenario = relationship("SimulationScenario", back_populates="results")

class ScenarioComparison(Base):
    __tablename__ = "scenario_comparisons"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    simulation_id = Column(GUID, ForeignKey("simulations.id", ondelete="CASCADE"), nullable=False)
    scenario_ids = Column(JSON, default=list, nullable=False)
    best_overall_scenario_id = Column(String(100), nullable=True)
    comparison_matrix = Column(JSON, default=dict, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

class SimulationHistory(Base):
    __tablename__ = "simulation_histories"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    crop = Column(String(100), nullable=False)
    applied_scenario_name = Column(String(100), nullable=False)
    yield_saved_pct = Column(Float, nullable=False)
    profit_impact_usd = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

class DecisionRecommendation(Base):
    __tablename__ = "decision_recommendations"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    simulation_id = Column(GUID, ForeignKey("simulations.id", ondelete="CASCADE"), nullable=False)
    ranking_json = Column(JSON, default=list, nullable=False)
    best_strategy = Column(String(150), nullable=False)
    lowest_risk_strategy = Column(String(150), nullable=False)
    highest_profit_strategy = Column(String(150), nullable=False)
    most_sustainable_strategy = Column(String(150), nullable=False)
    fastest_recovery_strategy = Column(String(150), nullable=False)
    lowest_water_usage_strategy = Column(String(150), nullable=False)
    lowest_carbon_strategy = Column(String(150), nullable=False)
    best_cost_efficiency_strategy = Column(String(150), nullable=False)
    reasoning_summary = Column(Text, nullable=False)

    simulation = relationship("Simulation", back_populates="recommendations")

class SimulationMetrics(Base):
    __tablename__ = "simulation_metrics"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    metric_name = Column(String(100), nullable=False)
    metric_value = Column(Float, nullable=False)
    unit = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

# ==========================================
# FARM MANAGEMENT, DIAGNOSIS & DECISION MODELS
# ==========================================

class FarmRecord(Base):
    __tablename__ = "farms_registry"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    farm_name = Column(String(150), nullable=False)
    farm_size_acres = Column(Float, nullable=False, default=1.0)
    address = Column(String(255), nullable=True)
    state = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)
    village = Column(String(100), nullable=True)
    crop_types = Column(JSON, default=list, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    soil_type = Column(String(50), nullable=True, default="Loamy Soil")
    irrigation_method = Column(String(50), nullable=True, default="Drip Irrigation")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

class DiseasePredictionRecord(Base):
    __tablename__ = "disease_predictions_history"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    scan_id = Column(String(100), nullable=False, index=True)
    crop = Column(String(100), nullable=False)
    disease_detected = Column(String(150), nullable=False)
    confidence = Column(Float, nullable=False)
    probabilities = Column(JSON, default=dict, nullable=False)
    severity_percentage = Column(Float, nullable=False)
    severity_level = Column(String(50), nullable=False)
    infected_area_sq_cm = Column(Float, nullable=False, default=0.0)
    gradcam_heatmap_url = Column(Text, nullable=True)
    symptoms = Column(JSON, default=list, nullable=False)
    treatment_recommendations = Column(JSON, default=list, nullable=False)
    model_version = Column(String(50), nullable=False, default="1.0.0")
    is_low_confidence = Column(Boolean, default=False, nullable=False)
    confidence_warning = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

class FarmerDecisionRecord(Base):
    __tablename__ = "farmer_decisions_history"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    simulation_id = Column(String(100), nullable=True)
    scan_id = Column(String(100), nullable=True)
    crop = Column(String(100), nullable=False, default="Tomato")
    applied_scenario_name = Column(String(150), nullable=False)
    treatment_type = Column(String(100), nullable=False)
    decision_notes = Column(Text, nullable=True)
    action_taken = Column(String(200), nullable=True)
    action_date = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    observed_outcome = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

class CommunityOutbreakRecord(Base):
    __tablename__ = "community_outbreaks_registry"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    reporter_id = Column(GUID, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    region = Column(String(150), nullable=False)
    disease = Column(String(150), nullable=False)
    severity = Column(String(50), nullable=False, default="Medium")
    affected_farms = Column(Integer, nullable=False, default=1)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    radius_km = Column(Float, nullable=False, default=10.0)
    is_verified = Column(Boolean, default=False, nullable=False)
    verification_status = Column(String(50), nullable=False, default="Unverified Report")
    verified_by_user_id = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

class NotificationRecord(Base):
    __tablename__ = "notifications_registry"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), nullable=False, default="info") # info, warning, alert, success
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)


