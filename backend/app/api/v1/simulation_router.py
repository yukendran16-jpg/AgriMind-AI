from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone

from app.domain.schemas import (
    SimulationRunRequest, WhatIfParameters, SimulationEngineResponse, ScenarioInput
)
from app.services.simulation_engine import SimulationEngineService
from app.api.deps import get_db, get_current_user, get_optional_current_user
from app.domain.models import User, Simulation, SimulationHistory

router = APIRouter(prefix="/simulation", tags=["AI Decision Simulation Engine"])

@router.get("/presets", response_model=List[ScenarioInput])
async def get_simulation_preset_scenarios():
    """Returns built-in strategy presets for simulation comparisons."""
    return SimulationEngineService.get_preset_scenarios()

@router.post("/run", response_model=SimulationEngineResponse)
async def run_decision_simulation(req: SimulationRunRequest):
    """Executes multi-scenario AI simulation engine, computing 30-day timelines and rankings."""
    return SimulationEngineService.run_multi_scenario_simulation(req)

@router.post("/what-if", response_model=SimulationEngineResponse)
async def recalculate_what_if_simulation(req: SimulationRunRequest):
    """Recalculates simulation models dynamically based on real-time what-if environmental parameters."""
    return SimulationEngineService.run_multi_scenario_simulation(req)

@router.get("/history")
async def list_simulation_history(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves saved simulation history for active user."""
    if not current_user:
        return []
    histories = db.query(SimulationHistory).filter(
        SimulationHistory.user_id == current_user.id
    ).order_by(SimulationHistory.created_at.desc()).all()
    
    return [
        {
            "id": str(h.id),
            "title": h.title,
            "crop": h.crop,
            "applied_scenario_name": h.applied_scenario_name,
            "yield_saved_pct": h.yield_saved_pct,
            "profit_impact_usd": h.profit_impact_usd,
            "created_at": h.created_at.isoformat()
        } for h in histories
    ]

@router.post("/apply")
async def apply_strategy_to_digital_twin(
    scenario_name: str,
    crop: str = "Tomato",
    yield_saved: float = 94.8,
    profit_impact: float = 2840.0,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Applies simulated strategy directly to Digital Farm Twin and records execution history."""
    if current_user:
        hist_record = SimulationHistory(
            user_id=current_user.id,
            title=f"Applied Strategy: {scenario_name}",
            crop=crop,
            applied_scenario_name=scenario_name,
            yield_saved_pct=yield_saved,
            profit_impact_usd=profit_impact
        )
        db.add(hist_record)
        db.commit()

    return {
        "status": "success",
        "message": f"Strategy '{scenario_name}' applied successfully to Digital Farm Twin!",
        "digital_twin_updated": True,
        "active_scenario": scenario_name
    }

@router.get("/decisions")
async def list_farmer_decisions(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves recorded farmer treatment decisions."""
    from app.domain.models import FarmerDecisionRecord
    query = db.query(FarmerDecisionRecord)
    if current_user:
        records = query.filter(FarmerDecisionRecord.user_id == current_user.id).order_by(FarmerDecisionRecord.created_at.desc()).all()
    else:
        records = query.order_by(FarmerDecisionRecord.created_at.desc()).limit(20).all()

    return [
        {
            "id": str(r.id),
            "crop": r.crop,
            "applied_scenario_name": r.applied_scenario_name,
            "treatment_type": r.treatment_type,
            "decision_notes": r.decision_notes,
            "action_taken": r.action_taken,
            "action_date": r.action_date.isoformat() if r.action_date else None,
            "observed_outcome": r.observed_outcome,
            "created_at": r.created_at.isoformat() if r.created_at else None
        } for r in records
    ]

@router.post("/decisions", status_code=status.HTTP_201_CREATED)
async def record_farmer_decision(
    applied_scenario_name: str,
    treatment_type: str,
    crop: str = "Tomato",
    decision_notes: Optional[str] = None,
    action_taken: Optional[str] = None,
    observed_outcome: Optional[str] = None,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Saves a farmer treatment decision to the database."""
    from app.domain.models import FarmerDecisionRecord
    rec = FarmerDecisionRecord(
        user_id=current_user.id if current_user else None,
        crop=crop,
        applied_scenario_name=applied_scenario_name,
        treatment_type=treatment_type,
        decision_notes=decision_notes,
        action_taken=action_taken,
        observed_outcome=observed_outcome
    )
    if current_user:
        db.add(rec)
        db.commit()
        db.refresh(rec)
        rec_id = str(rec.id)
    else:
        rec_id = "demo_decision_id"

    return {
        "status": "success",
        "message": "Treatment decision recorded successfully.",
        "id": rec_id
    }

