from fastapi import APIRouter
from app.domain.schemas import OutbreakAlert
from typing import List
from datetime import datetime, timezone

router = APIRouter(prefix="/community", tags=["Community Intelligence & GIS"])

@router.get("/outbreaks", response_model=List[OutbreakAlert])
async def get_regional_outbreaks():
    return [
        OutbreakAlert(
            id="outbreak_101",
            region="Kheda District, Gujarat",
            disease="Tomato Early Blight",
            severity="High",
            affected_farms=42,
            lat=22.7500,
            lng=72.6833,
            radius_km=15.0,
            timestamp=datetime.now(timezone.utc)
        ),
        OutbreakAlert(
            id="outbreak_102",
            region="Nashik Region, Maharashtra",
            disease="Grape Downy Mildew",
            severity="Critical",
            affected_farms=89,
            lat=19.9975,
            lng=73.7898,
            radius_km=28.0,
            timestamp=datetime.now(timezone.utc)
        ),
        OutbreakAlert(
            id="outbreak_103",
            region="Guntur District, Andhra Pradesh",
            disease="Chilli Leaf Curl Virus",
            severity="Medium",
            affected_farms=18,
            lat=16.3067,
            lng=80.4365,
            radius_km=8.5,
            timestamp=datetime.now(timezone.utc)
        )
    ]
