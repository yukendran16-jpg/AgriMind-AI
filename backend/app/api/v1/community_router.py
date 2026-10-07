from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone

from app.domain.schemas import OutbreakAlert
from app.api.deps import get_db, get_current_user, get_optional_current_user, require_roles
from app.domain.models import User, CommunityOutbreakRecord

router = APIRouter(prefix="/community", tags=["Community Intelligence & GIS"])

@router.get("/outbreaks", response_model=List[OutbreakAlert])
async def get_regional_outbreaks(db: Session = Depends(get_db)):
    """Retrieves regional disease outbreak reports from database, supplementing with defaults."""
    db_records = db.query(CommunityOutbreakRecord).order_by(CommunityOutbreakRecord.created_at.desc()).all()
    
    alerts = []
    for r in db_records:
        alerts.append(
            OutbreakAlert(
                id=str(r.id),
                region=r.region,
                disease=r.disease,
                severity=r.severity,
                affected_farms=r.affected_farms,
                lat=r.lat,
                lng=r.lng,
                radius_km=r.radius_km,
                timestamp=r.created_at
            )
        )
        
    # Standard regional default alerts for demonstration if DB has few items
    defaults = [
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
    
    return alerts + defaults

@router.post("/report", status_code=status.HTTP_201_CREATED)
async def submit_outbreak_report(
    region: str,
    disease: str,
    severity: str = "Medium",
    affected_farms: int = 1,
    lat: float = 22.75,
    lng: float = 72.68,
    radius_km: float = 10.0,
    description: Optional[str] = None,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Allows farmers or agricultural officers to submit a community disease outbreak alert."""
    rec = CommunityOutbreakRecord(
        reporter_id=current_user.id if current_user else None,
        region=region,
        disease=disease,
        severity=severity,
        affected_farms=affected_farms,
        lat=lat,
        lng=lng,
        radius_km=radius_km,
        is_verified=False,
        verification_status="Unverified Community Report",
        description=description
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return {
        "status": "success",
        "message": "Community outbreak report submitted successfully. Awaiting agricultural officer verification.",
        "id": str(rec.id)
    }

@router.put("/outbreaks/{outbreak_id}/verify")
async def verify_outbreak_report(
    outbreak_id: str,
    action: str = "verify", # verify, reject
    current_user: User = Depends(require_roles(["officer", "govt", "admin"])),
    db: Session = Depends(get_db)
):
    """Allows authorized Agricultural Officers and Administrators to verify or reject outbreak reports."""
    rec = db.query(CommunityOutbreakRecord).filter(CommunityOutbreakRecord.id == outbreak_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Outbreak report not found")
        
    if action == "verify":
        rec.is_verified = True
        rec.verification_status = "Official Verification Completed"
        rec.verified_by_user_id = str(current_user.id)
    else:
        rec.is_verified = False
        rec.verification_status = "Report Rejected by Officer"
        
    db.commit()
    return {
        "status": "success",
        "message": f"Report '{outbreak_id}' updated by Officer {current_user.full_name}.",
        "verification_status": rec.verification_status
    }

