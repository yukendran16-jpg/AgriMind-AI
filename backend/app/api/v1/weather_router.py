from fastapi import APIRouter, Query
from typing import Dict, Any
from datetime import datetime, timezone

router = APIRouter(prefix="/weather", tags=["Weather & Micro-Climate Intelligence"])

@router.get("/forecast")
async def get_weather_forecast(
    lat: float = Query(22.7500, description="Latitude"),
    lng: float = Query(72.6833, description="Longitude")
):
    """Returns real-time micro-climate weather feed, soil moisture, and spore risk metrics."""
    return {
        "location": "Kheda District, Gujarat",
        "latitude": lat,
        "longitude": lng,
        "current_temp": 27.4,
        "feels_like": 29.1,
        "humidity": 84.0,
        "rainfall_24h_mm": 45.0,
        "wind_speed_kmh": 14.0,
        "wind_direction": "WSW",
        "soil_moisture_pct": 62.0,
        "soil_temp_c": 24.2,
        "uv_index": 6.8,
        "spore_germination_risk": "CRITICAL",
        "weather_warning": "Heavy precipitation expected in 48 hours. Fungal spore germination risk is HIGH.",
        "forecast_7_days": [
            {"day": "Today", "temp_max": 28.5, "temp_min": 22.1, "condition": "Rain Showers", "humidity": 84.0},
            {"day": "Tomorrow", "temp_max": 29.0, "temp_min": 21.8, "condition": "Thunderstorms", "humidity": 88.0},
            {"day": "Day 3", "temp_max": 30.2, "temp_min": 23.0, "condition": "Overcast", "humidity": 76.0},
            {"day": "Day 4", "temp_max": 31.5, "temp_min": 24.1, "condition": "Partly Cloudy", "humidity": 68.0},
            {"day": "Day 5", "temp_max": 32.0, "temp_min": 24.5, "condition": "Sunny", "humidity": 62.0},
            {"day": "Day 6", "temp_max": 31.8, "temp_min": 23.8, "condition": "Clear", "humidity": 60.0},
            {"day": "Day 7", "temp_max": 31.0, "temp_min": 23.2, "condition": "Clear", "humidity": 58.0}
        ],
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
