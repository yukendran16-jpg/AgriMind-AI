from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.domain.schemas import DiagnosisResult
from app.ai_engine.inference import cv_engine
from app.ai_engine.gradcam import gradcam_engine
from app.agents.agent_mesh import agent_mesh
from datetime import datetime, timezone

router = APIRouter(prefix="/disease", tags=["Disease Intelligence"])

@router.post("/predict", response_model=DiagnosisResult)
async def predict_crop_disease(
    file: UploadFile = File(...),
    crop: str = Form("Tomato"),
    acreage: float = Form(2.5)
):
    try:
        image_bytes = await file.read()
        
        # 1. Execute Computer Vision Disease Detection
        cv_res = cv_engine.predict_disease(image_bytes=image_bytes, crop=crop)
        
        # 2. Generate GradCAM Visual Heatmap
        gradcam_url = gradcam_engine.generate_heatmap_overlay(image_bytes=image_bytes)
        
        # 3. Coordinate Multi-Agent Reasoning Engine
        agent_res = agent_mesh.execute_agents_workflow(
            disease_info=cv_res,
            crop=crop,
            acreage=acreage
        )
        
        return DiagnosisResult(
            scan_id=cv_res["scan_id"],
            crop=cv_res["crop"],
            disease_detected=cv_res["disease_detected"],
            confidence=cv_res["confidence"],
            probabilities=cv_res.get("probabilities", {}),
            severity_percentage=cv_res["severity_percentage"],
            severity_level=cv_res["severity_level"],
            infected_area_sq_cm=cv_res["infected_area_sq_cm"],
            gradcam_heatmap_url=gradcam_url,
            symptoms=cv_res["symptoms"],
            probable_sources=[s["source"] for s in agent_res["source_analysis"]],
            yield_loss_projection=f"Projected Loss Without Treatment: {agent_res['yield_projection']['without_treatment_loss_pct']}%, Financial Risk: ${agent_res['yield_projection']['financial_risk_usd']}",
            treatment_recommendations=agent_res["treatment_plan"]["chemical_treatment"],
            progression=agent_res["progression"],
            model_version=cv_res.get("model_version", "1.0.0"),
            is_low_confidence=cv_res.get("is_low_confidence", False),
            confidence_warning=cv_res.get("confidence_warning", None),
            timestamp=datetime.now(timezone.utc)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Pipeline Execution Error: {str(e)}")
