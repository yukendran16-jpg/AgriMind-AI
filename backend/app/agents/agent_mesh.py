from typing import List, Dict, Any
import math

class MultiAgentMesh:
    """
    Coordinates specialized autonomous AI agents (Disease, Weather, Source, Yield, Treatment, Economy).
    """
    def execute_agents_workflow(self, disease_info: Dict[str, Any], crop: str, acreage: float = 2.5) -> Dict[str, Any]:
        severity = disease_info["severity_percentage"]
        
        # 1. Weather Agent
        weather_analysis = {
            "agent": "Weather Agent",
            "current_temp": "27.4°C",
            "humidity": "84%",
            "forecast": "Heavy localized precipitation expected in 48 hours.",
            "impact_assessment": "High humidity (>80%) accelerates fungal spore germination by 3.2x."
        }
        
        # 2. Source Agent
        source_analysis = [
            {"source": "High Ambient Humidity & Spore Drift", "probability": 0.45},
            {"source": "Over-canopy Irrigation", "probability": 0.30},
            {"source": "Infected Soil Debris from Prior Season", "probability": 0.15},
            {"source": "Nearby Unmanaged Farm Vectors", "probability": 0.10}
        ]
        
        # 3. Yield & Financial Loss Agent
        loss_without = round(min(severity * 1.6, 75.0), 1)
        loss_with = round(loss_without * 0.2, 1)
        est_revenue_loss = round(loss_without * 420 * acreage, 2)
        
        yield_projection = {
            "without_treatment_loss_pct": loss_without,
            "with_treatment_loss_pct": loss_with,
            "financial_risk_usd": est_revenue_loss,
            "recovery_chance_pct": 88.5
        }
        
        # 4. Precision Treatment Agent
        chemical_spray_qty = round(0.4 * acreage, 2) # Liters
        water_mixing_qty = round(200 * acreage, 0) # Liters
        
        treatment_plan = {
            "organic_treatment": [
                "Apply Neem Oil Extract (10,000 PPM) at 5ml/L concentration every 5 days.",
                "Foliar spray of Trichoderma viride biopesticide."
            ],
            "chemical_treatment": [
                "Mancozeb 75% WP @ 2.5g/L water spray.",
                "Azoxystrobin 23% SC @ 1ml/L for systemic infection control."
            ],
            "precision_spray": {
                "spray_quantity_liters": chemical_spray_qty,
                "dilution_water_liters": water_mixing_qty,
                "timing": "Apply between 06:00 AM - 09:00 AM before foliage dew dries.",
                "nozzle_recommendation": "Hollow Cone Nozzle (0.3 GPM)"
            },
            "ipm_practices": [
                "Prune lower infected leaves 10cm above ground level.",
                "Switch to drip irrigation to keep canopy dry."
            ]
        }
        
        # 5. Progression Forecasting Model (1 to 30 days)
        progression_data = []
        days = [1, 3, 5, 10, 15, 30]
        for d in days:
            # Logistic growth curve calculation
            r = 0.18 # growth rate
            prog_sev = severity / (severity + (100 - severity) * math.exp(-r * d)) * 100
            prog_loss = min(prog_sev * 1.4, 85.0)
            progression_data.append({
                "day": d,
                "severity": round(prog_sev, 1),
                "expected_yield_loss": round(prog_loss, 1)
            })

        return {
            "weather_agent": weather_analysis,
            "source_analysis": source_analysis,
            "yield_projection": yield_projection,
            "treatment_plan": treatment_plan,
            "progression": progression_data
        }

agent_mesh = MultiAgentMesh()
