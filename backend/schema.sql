-- ============================================================================
-- AGRIMIND AI ENTERPRISE POSTGRESQL DDL SYSTEM SCHEMA
-- ============================================================================

-- Step 1: Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Step 2: Custom ENUM Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('farmer', 'researcher', 'officer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE severity_level AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE agent_status AS ENUM ('idle', 'running', 'failed', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE deployment_status AS ENUM ('staged', 'active', 'deprecated', 'rolled_back');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- MODULE 1: AUTHENTICATION & SECURITY
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) UNIQUE,
    role user_role NOT NULL DEFAULT 'farmer',
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    mfa_secret VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);

-- ============================================================================
-- MODULE 2 & 3: FARMER & FARM MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS farmers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    preferred_language VARCHAR(10) DEFAULT 'en',
    experience_years INT CHECK (experience_years >= 0),
    education_level VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    farm_name VARCHAR(100) NOT NULL,
    total_area_hectares NUMERIC(10, 2) CHECK (total_area_hectares > 0),
    boundary GEOMETRY(Polygon, 4326),
    location GEOMETRY(Point, 4326) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_farms_location ON farms USING GIST(location);

CREATE TABLE IF NOT EXISTS plots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    plot_name VARCHAR(50) NOT NULL,
    area_hectares NUMERIC(10, 2) CHECK (area_hectares > 0),
    soil_type VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS plant_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plot_id UUID NOT NULL REFERENCES plots(id) ON DELETE CASCADE,
    crop_type VARCHAR(50) NOT NULL,
    variety VARCHAR(50),
    planting_date DATE NOT NULL,
    expected_harvest_date DATE,
    current_stage VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_plant_batches_crop ON plant_batches(crop_type);

-- ============================================================================
-- MODULE 4 & 5: CROP MONITORING & AI PREDICTION MODULE
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_model_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(100) NOT NULL,
    version VARCHAR(20) NOT NULL UNIQUE,
    framework VARCHAR(50) NOT NULL,
    accuracy_score NUMERIC(5, 4) CHECK (accuracy_score BETWEEN 0 AND 1),
    status deployment_status NOT NULL DEFAULT 'staged',
    artifact_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plant_batch_id UUID NOT NULL REFERENCES plant_batches(id) ON DELETE CASCADE,
    model_version_id UUID NOT NULL REFERENCES ai_model_registry(id),
    image_url TEXT NOT NULL,
    crop_type VARCHAR(50) NOT NULL,
    disease_detected VARCHAR(100) NOT NULL,
    confidence_score NUMERIC(5, 4) NOT NULL CHECK (confidence_score BETWEEN 0 AND 1),
    severity_percentage NUMERIC(5, 2) NOT NULL CHECK (severity_percentage BETWEEN 0 AND 100),
    severity_rating severity_level NOT NULL,
    infected_area_sq_cm NUMERIC(10, 2),
    gradcam_heatmap_url TEXT NOT NULL,
    explainability_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    inference_time_ms INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_batch ON ai_predictions(plant_batch_id);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_disease ON ai_predictions(disease_detected);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_created ON ai_predictions(created_at DESC);

-- ============================================================================
-- MODULE 6, 7 & 9: PROGRESSION, SOURCE & TREATMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS progression_forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prediction_id UUID NOT NULL REFERENCES ai_predictions(id) ON DELETE CASCADE,
    forecast_day INT NOT NULL CHECK (forecast_day IN (1, 3, 5, 10, 15, 30)),
    projected_severity_pct NUMERIC(5, 2) NOT NULL CHECK (projected_severity_pct BETWEEN 0 AND 100),
    projected_yield_loss_pct NUMERIC(5, 2) NOT NULL CHECK (projected_yield_loss_pct BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS treatment_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prediction_id UUID NOT NULL REFERENCES ai_predictions(id) ON DELETE CASCADE,
    chemical_spray_quantity_liters NUMERIC(8, 2) NOT NULL,
    water_dilution_liters NUMERIC(8, 2) NOT NULL,
    application_timing VARCHAR(100) NOT NULL,
    organic_recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
    chemical_recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
    estimated_cost_usd NUMERIC(10, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS outbreak_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_name VARCHAR(100) NOT NULL,
    disease_name VARCHAR(100) NOT NULL,
    severity severity_level NOT NULL,
    affected_farms_count INT DEFAULT 1,
    center_location GEOMETRY(Point, 4326) NOT NULL,
    radius_km NUMERIC(6, 2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_outbreaks_location ON outbreak_events USING GIST(center_location);
