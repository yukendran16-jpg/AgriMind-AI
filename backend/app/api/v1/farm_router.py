from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any

from app.api.deps import get_db, get_current_user, get_optional_current_user
from app.domain.models import User, FarmRecord, UserProfile

router = APIRouter(prefix="/farm", tags=["Farm Management"])

@router.get("/profile")
async def get_farm_profile(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Returns detailed farm profile for the current user."""
    if not current_user:
        return {
            "farm_name": "Kheda Demo Field Plot B",
            "farm_size_acres": 2.5,
            "address": "Kheda District, Near NH-8",
            "state": "Gujarat",
            "district": "Kheda",
            "village": "Nadiad",
            "crop_types": ["Tomato", "Potato"],
            "latitude": 22.7500,
            "longitude": 72.6833,
            "soil_type": "Clay Loam",
            "irrigation_method": "Drip Irrigation"
        }

    farm = db.query(FarmRecord).filter(FarmRecord.user_id == current_user.id).first()
    if farm:
        return {
            "id": str(farm.id),
            "farm_name": farm.farm_name,
            "farm_size_acres": farm.farm_size_acres,
            "address": farm.address,
            "state": farm.state,
            "district": farm.district,
            "village": farm.village,
            "crop_types": farm.crop_types,
            "latitude": farm.latitude,
            "longitude": farm.longitude,
            "soil_type": farm.soil_type,
            "irrigation_method": farm.irrigation_method
        }

    # Fallback to UserProfile if FarmRecord not created yet
    prof = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if prof:
        return {
            "farm_name": prof.farm_name or "My Farm Plot",
            "farm_size_acres": prof.farm_size_acres or 2.5,
            "address": prof.address or "Kheda District",
            "state": prof.state or "Gujarat",
            "district": prof.district or "Kheda",
            "village": prof.village or "Nadiad",
            "crop_types": prof.crop_types or ["Tomato"],
            "latitude": prof.latitude or 22.7500,
            "longitude": prof.longitude or 72.6833,
            "soil_type": "Clay Loam",
            "irrigation_method": "Drip Irrigation"
        }

    return {
        "farm_name": "My Farm Plot",
        "farm_size_acres": 2.5,
        "crop_types": ["Tomato"]
    }

@router.post("/profile")
async def update_farm_profile(
    farm_name: str,
    farm_size_acres: float = 2.5,
    state: str = "Gujarat",
    district: str = "Kheda",
    village: Optional[str] = None,
    crop_types: List[str] = ["Tomato"],
    latitude: Optional[float] = 22.75,
    longitude: Optional[float] = 72.68,
    soil_type: str = "Clay Loam",
    irrigation_method: str = "Drip Irrigation",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Creates or updates the user's farm profile."""
    farm = db.query(FarmRecord).filter(FarmRecord.user_id == current_user.id).first()
    if not farm:
        farm = FarmRecord(user_id=current_user.id, farm_name=farm_name)

    farm.farm_name = farm_name
    farm.farm_size_acres = farm_size_acres
    farm.state = state
    farm.district = district
    farm.village = village
    farm.crop_types = crop_types
    farm.latitude = latitude
    farm.longitude = longitude
    farm.soil_type = soil_type
    farm.irrigation_method = irrigation_method

    db.add(farm)
    db.commit()
    db.refresh(farm)

    return {
        "status": "success",
        "message": "Farm profile updated successfully.",
        "farm_id": str(farm.id)
    }
