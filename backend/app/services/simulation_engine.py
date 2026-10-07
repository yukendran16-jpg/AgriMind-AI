import math
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

from app.domain.schemas import (
    WhatIfParameters, ScenarioInput, SimulationRunRequest,
    DayTimelinePoint, ScenarioSimulationResult, DecisionRankingOutput,
    SimulationEngineResponse
)

class SimulationEngineService:
    @staticmethod
    def get_preset_scenarios() -> List[ScenarioInput]:
        return [
            ScenarioInput(
                id="scen_no_treatment",
                name="Scenario A: No Treatment",
                treatment_type="No Treatment",
                treatment_delay_days=0,
                weather_modifier="Normal",
                irrigation_level="Normal Irrigation",
                fertilizer_type="None",
                crop_management="None"
            ),
            ScenarioInput(
                id="scen_organic",
                name="Scenario B: Organic Spray",
                treatment_type="Organic Spray",
                treatment_delay_days=1,
                weather_modifier="Normal",
                irrigation_level="Normal Irrigation",
                fertilizer_type="Organic",
                crop_management="Remove Infected Leaves"
            ),
            ScenarioInput(
                id="scen_chemical",
                name="Scenario C: Chemical Spray",
                treatment_type="Chemical Spray",
                treatment_delay_days=0,
                weather_modifier="Normal",
                irrigation_level="Normal Irrigation",
                fertilizer_type="Chemical",
                crop_management="None"
            ),
            ScenarioInput(
                id="scen_ipm",
                name="Scenario D: Integrated Pest Management (IPM)",
                treatment_type="IPM",
                treatment_delay_days=0,
                weather_modifier="Normal",
                irrigation_level="Reduce Water",
                fertilizer_type="Organic",
                crop_management="Pruning"
            ),
            ScenarioInput(
                id="scen_biocontrol",
                name="Scenario E: Biological Control",
                treatment_type="Biological Control",
                treatment_delay_days=2,
                weather_modifier="Normal",
                irrigation_level="Normal Irrigation",
                fertilizer_type="Organic",
                crop_management="Pruning"
            )
        ]

    @staticmethod
    def simulate_scenario(
        scenario: ScenarioInput,
        crop: str,
        acreage: float,
        initial_severity: float,
        what_if: WhatIfParameters
    ) -> ScenarioSimulationResult:
        # Base environmental multiplier from What-If sliders
        humidity_factor = 1.0 + (what_if.humidity - 70.0) * 0.015
        temp_factor = 1.0 + (what_if.temperature - 25.0) * 0.01
        rain_factor = 1.0 + (what_if.rainfall_mm - 20.0) * 0.008
        environmental_risk_mod = max(0.5, min(2.5, humidity_factor * temp_factor * rain_factor))

        # Weather modifier impact
        w_mod = scenario.weather_modifier.lower()
        if "heavy rain" in w_mod or "high humidity" in w_mod:
            environmental_risk_mod *= 1.35
        elif "drought" in w_mod or "low humidity" in w_mod:
            environmental_risk_mod *= 0.75
        elif "heat wave" in w_mod:
            environmental_risk_mod *= 1.15

        # Treatment efficacy & cost matrix per acre
        t_type = scenario.treatment_type.lower()
        if "no treatment" in t_type:
            efficacy = 0.0
            cost_per_acre = 0.0
            chem_per_acre = 0.0
            carbon_per_acre = 2.0
        elif "organic" in t_type:
            efficacy = 0.75
            cost_per_acre = 42.0
            chem_per_acre = 0.0
            carbon_per_acre = 8.5
        elif "chemical" in t_type:
            efficacy = 0.92
            cost_per_acre = 78.0
            chem_per_acre = 2.5 * what_if.spray_amount_liters
            carbon_per_acre = 28.0
        elif "ipm" in t_type:
            efficacy = 0.88
            cost_per_acre = 58.0
            chem_per_acre = 0.8 * what_if.spray_amount_liters
            carbon_per_acre = 12.0
        elif "biological" in t_type:
            efficacy = 0.81
            cost_per_acre = 52.0
            chem_per_acre = 0.0
            carbon_per_acre = 6.0
        else:
            efficacy = 0.70
            cost_per_acre = 45.0
            chem_per_acre = 1.0
            carbon_per_acre = 15.0

        # Irrigation impact on water usage (liters/acre)
        irr = scenario.irrigation_level.lower()
        if "increase" in irr:
            water_per_acre = 14000.0
            environmental_risk_mod *= 1.12
        elif "reduce" in irr:
            water_per_acre = 8500.0
            environmental_risk_mod *= 0.92
        else:
            water_per_acre = 11000.0

        # Fertilizer impact
        fert = scenario.fertilizer_type.lower()
        if "chemical" in fert:
            carbon_per_acre += 18.0
        elif "organic" in fert:
            carbon_per_acre += 4.0

        # Crop management action impact
        cm = (scenario.crop_management or "").lower()
        if "pruning" in cm or "remove" in cm:
            efficacy += 0.06

        # Account for treatment delay
        effective_delay = scenario.treatment_delay_days + what_if.treatment_delay_days
        delay_penalty = min(0.40, effective_delay * 0.04)
        net_efficacy = max(0.0, min(0.98, efficacy - delay_penalty))

        # Baseline expected revenue per acre ($1200 for healthy plot)
        base_revenue = 1250.0 * acreage

        # Timeline generation for Day 0, 5, 10, 15, 20, 25, 30
        timeline: List[DayTimelinePoint] = []
        days = [0, 5, 10, 15, 20, 25, 30]

        for d in days:
            if d < effective_delay:
                # Disease spreads freely before treatment starts
                growth_rate = 0.14 * environmental_risk_mod
                sev = initial_severity * math.exp(growth_rate * d)
            else:
                # Treatment is active
                active_days = d - effective_delay
                decay_rate = 0.12 * net_efficacy
                sev = (initial_severity * math.exp(0.14 * environmental_risk_mod * effective_delay)) * math.exp(-decay_rate * active_days)

            sev = max(1.0, min(99.0, sev))
            spread_prob = max(0.05, min(0.98, (sev / 100.0) * environmental_risk_mod))
            yield_loss_pct = max(0.0, min(85.0, sev * 0.95))
            health_index = max(5.0, min(99.0, 100.0 - sev))
            day_rev = round(base_revenue * (1.0 - (yield_loss_pct / 100.0)), 2)

            timeline.append(DayTimelinePoint(
                day=d,
                severity=round(sev, 1),
                spread_probability=round(spread_prob * 100.0, 1),
                yield_loss_pct=round(yield_loss_pct, 1),
                projected_revenue=day_rev,
                health_index=round(health_index, 1)
            ))

        final_day = timeline[-1]
        final_sev = final_day.severity
        spread_prob_final = final_day.spread_probability
        yield_pred_pct = round(max(15.0, 100.0 - final_day.yield_loss_pct), 1)

        total_treatment_cost = round(cost_per_acre * acreage, 2)
        total_revenue = final_day.projected_revenue
        total_profit = round(total_revenue - total_treatment_cost, 2)

        total_chem = round(chem_per_acre * acreage, 1)
        total_water = round(water_per_acre * acreage, 0)
        total_carbon = round(carbon_per_acre * acreage, 1)

        recovery_prob = round(max(5.0, min(98.0, (100.0 - final_sev) * 1.05 * (1.0 - delay_penalty))), 1)

        if final_sev > 50.0:
            risk_level = "CRITICAL"
            time_to_rec = 30
        elif final_sev > 30.0:
            risk_level = "HIGH"
            time_to_rec = 20
        elif final_sev > 15.0:
            risk_level = "MEDIUM"
            time_to_rec = 10
        else:
            risk_level = "LOW"
            time_to_rec = 5

        # Composite AI score formula (Weighted Yield 35%, Profit 25%, Sustainability 20%, Recovery 20%)
        profit_score = min(100.0, max(0.0, (total_profit / (base_revenue * 0.9)) * 100.0))
        sustainability_score = max(0.0, 100.0 - (total_carbon * 1.5) - (total_chem * 5.0))
        overall_score = round(
            (yield_pred_pct * 0.35) +
            (profit_score * 0.25) +
            (sustainability_score * 0.20) +
            (recovery_prob * 0.20),
            1
        )

        rec_action = f"Apply {scenario.treatment_type} on Day {effective_delay} with {scenario.irrigation_level}."

        return ScenarioSimulationResult(
            id=scenario.id or f"scen_{uuid.uuid4().hex[:6]}",
            name=scenario.name,
            treatment_type=scenario.treatment_type,
            final_severity=final_sev,
            spread_probability=spread_prob_final,
            yield_prediction_pct=yield_pred_pct,
            projected_revenue_usd=total_revenue,
            projected_profit_usd=total_profit,
            treatment_cost_usd=total_treatment_cost,
            chemical_usage_liters=total_chem,
            water_usage_liters=total_water,
            carbon_footprint_kg=total_carbon,
            recovery_probability=recovery_prob,
            risk_level=risk_level,
            time_to_recovery_days=time_to_rec,
            recommended_action=rec_action,
            confidence_score=0.935,
            overall_score=overall_score,
            timeline=timeline
        )

    @staticmethod
    def run_multi_scenario_simulation(req: SimulationRunRequest) -> SimulationEngineResponse:
        what_if = req.what_if_parameters or WhatIfParameters()
        scenarios_in = req.scenarios if req.scenarios else SimulationEngineService.get_preset_scenarios()

        results: List[ScenarioSimulationResult] = []
        for s in scenarios_in:
            res = SimulationEngineService.simulate_scenario(
                scenario=s,
                crop=req.crop,
                acreage=req.acreage,
                initial_severity=req.initial_severity,
                what_if=what_if
            )
            results.append(res)

        # Multi-criteria Decision Ranking Engine
        sorted_overall = sorted(results, key=lambda x: x.overall_score, reverse=True)
        sorted_risk = sorted(results, key=lambda x: x.final_severity)
        sorted_profit = sorted(results, key=lambda x: x.projected_profit_usd, reverse=True)
        sorted_sust = sorted(results, key=lambda x: (x.carbon_footprint_kg + x.chemical_usage_liters))
        sorted_rec = sorted(results, key=lambda x: x.recovery_probability, reverse=True)
        sorted_water = sorted(results, key=lambda x: x.water_usage_liters)
        sorted_carbon = sorted(results, key=lambda x: x.carbon_footprint_kg)
        sorted_cost = sorted(results, key=lambda x: x.treatment_cost_usd)

        best_overall = sorted_overall[0]

        rankings_json = []
        for rank_idx, r in enumerate(sorted_overall):
            rankings_json.append({
                "rank": rank_idx + 1,
                "scenario_name": r.name,
                "overall_score": r.overall_score,
                "yield_pct": r.yield_prediction_pct,
                "profit_usd": r.projected_profit_usd,
                "risk_level": r.risk_level,
                "carbon_kg": r.carbon_footprint_kg
            })

        reasoning = (
            f"Strategy '{best_overall.name}' is ranked #1 (Overall Score: {best_overall.overall_score}/100). "
            f"It achieves a {best_overall.yield_prediction_pct}% protected crop yield with projected net profit of ${best_overall.projected_profit_usd:.2f}. "
            f"Environmental impact is optimized with {best_overall.carbon_footprint_kg}kg carbon emissions and {best_overall.chemical_usage_liters}L chemical usage."
        )

        decision = DecisionRankingOutput(
            best_strategy=best_overall.name,
            lowest_risk_strategy=sorted_risk[0].name,
            highest_profit_strategy=sorted_profit[0].name,
            most_sustainable_strategy=sorted_sust[0].name,
            fastest_recovery_strategy=sorted_rec[0].name,
            lowest_water_usage_strategy=sorted_water[0].name,
            lowest_carbon_strategy=sorted_carbon[0].name,
            best_cost_efficiency_strategy=sorted_cost[0].name,
            rankings=rankings_json,
            reasoning_summary=reasoning
        )

        return SimulationEngineResponse(
            simulation_id=f"sim_{uuid.uuid4().hex[:8]}",
            crop=req.crop,
            disease_detected=req.disease_detected,
            initial_severity=req.initial_severity,
            acreage=req.acreage,
            what_if_parameters=what_if,
            scenarios_results=results,
            decision_ranking=decision,
            timestamp=datetime.now(timezone.utc)
        )
