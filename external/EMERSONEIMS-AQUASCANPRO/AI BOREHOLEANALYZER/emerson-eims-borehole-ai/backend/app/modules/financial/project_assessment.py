"""
Integration module combining hydraulic properties and financial analysis
For comprehensive borehole project assessment
"""

from typing import Dict, List, Optional
from ..hydrogeology.properties import HydraulicPropertiesCalculator
from .analyzer import FinancialAnalyzer
import logging

logger = logging.getLogger(__name__)


class ProjectViabilityAssessment:
    """
    Complete project viability analysis combining:
    - Hydrogeological potential (transmissivity, yield)
    - Financial metrics (NPV, IRR, ROI, payback)
    - Risk factors
    """
    
    def __init__(self):
        self.hydraulic = HydraulicPropertiesCalculator()
        self.financial = FinancialAnalyzer()
    
    def assess_project_viability(
        self,
        site_name: str,
        depth_m: float,
        geology: str,
        latitude: float,
        longitude: float,
        probability: float,
        expected_users: int = 250,
        annual_maintenance_usd: float = None,
        project_years: int = 20,
        remoteness_factor: float = 1.0
    ) -> Dict:
        """
        Comprehensive project assessment
        
        Args:
            site_name: Site identifier
            depth_m: Proposed drilling depth
            geology: Primary rock formation (e.g., 'LIMESTONE')
            latitude/longitude: Site coordinates
            probability: Success probability (0.1-0.95)
            expected_users: Number of beneficiaries
            annual_maintenance_usd: Annual OpEx (if None, calculated)
            project_years: Project lifetime
            remoteness_factor: Access difficulty multiplier
        
        Returns:
            Comprehensive viability report
        """
        
        # 1. COST ESTIMATION
        cost_analysis = self.financial.estimate_drilling_cost(
            depth_m, geology, remoteness_factor
        )
        initial_investment = cost_analysis['total_cost_usd']
        
        # 2. HYDRAULIC PROPERTIES
        hydraulic_props = self.hydraulic.calculate_transmissivity(
            geology=geology,
            aquifer_thickness_m=depth_m
        )
        transmissivity = hydraulic_props['transmissivity_m2_day']
        
        storativity_result = self.hydraulic.calculate_storativity(
            geology=geology,
            aquifer_thickness_m=depth_m,
            confinement_state='unconfined'
        )
        storativity = storativity_result['storativity']
        
        sustainable_yield = self.hydraulic.predict_sustainable_yield(
            transmissivity=transmissivity,
            storativity=storativity,
            depth_to_water_m=15,       # Typical depth to water table
            maximum_drawdown_m=3.0,    # Sustainable drawdown
            aquifer_type='unconfined',
            recharge_mm_year=300       # Regional average for typical African aquifer
        )
        
        yield_m3_per_day = sustainable_yield['practical_yield_m3_h'] * 24
        
        # 3. REVENUE PROJECTIONS
        # Water sales model: Assume $0.30/m³ for rural areas
        price_per_m3 = 0.30
        annual_revenue = yield_m3_per_day * 365 * price_per_m3
        
        # Adjust for seasonality (60% of days productive in dry season)
        adjusted_annual_revenue = annual_revenue * 0.75
        
        # Account for system losses (30% typical)
        available_annual_revenue = adjusted_annual_revenue * 0.70
        
        # 4. OPERATING COSTS
        if annual_maintenance_usd is None:
            # Rule of thumb: 2-3% of capital cost annually
            annual_maintenance = initial_investment * 0.025
        else:
            annual_maintenance = annual_maintenance_usd
        
        # Add fuel/electricity for pumping (~$1000/year for typical setup)
        annual_energy = 1000
        annual_operator_salary = 1200 if expected_users > 200 else 600
        
        total_annual_opex = annual_maintenance + annual_energy + annual_operator_salary
        
        # 5. FINANCIAL ANALYSIS
        npv_analysis = self.financial.calculate_npv(
            initial_cost=initial_investment,
            annual_revenues=[available_annual_revenue] * project_years,
            annual_costs=[total_annual_opex] * project_years,
            project_years=project_years
        )
        
        irr_analysis = self.financial.calculate_irr(
            initial_cost=initial_investment,
            annual_revenues=[available_annual_revenue] * project_years,
            annual_costs=[total_annual_opex] * project_years,
            project_years=project_years
        )
        
        payback_analysis = self.financial.calculate_payback_period(
            initial_cost=initial_investment,
            annual_net_cash_flow=available_annual_revenue - total_annual_opex
        )
        
        # 6. CASH FLOW PROJECTION
        cash_flow = self.financial.project_cash_flow(
            initial_investment=initial_investment,
            annual_revenue=available_annual_revenue,
            annual_operating_cost=total_annual_opex,
            project_years=project_years,
            escalation_rate=0.02
        )
        
        # 7. RISK ASSESSMENT
        risk_factors = self._assess_risk_factors(
            depth_m, geology, probability, transmissivity, yield_m3_per_day
        )
        
        # 8. RECOMMENDATIONS
        recommendations = self._generate_recommendations(
            npv_analysis, irr_analysis, payback_analysis, yield_m3_per_day,
            hydrogeological_risk=risk_factors['hydrogeological']['score']
        )
        
        # Compile comprehensive report
        return {
            "project_metadata": {
                "site_name": site_name,
                "latitude": latitude,
                "longitude": longitude,
                "depth_m": depth_m,
                "geology": geology,
                "expected_users": expected_users,
                "probability": probability,
                "project_years": project_years
            },
            "cost_analysis": cost_analysis,
            "hydrogeological_assessment": {
                "transmissivity_m2_per_day": transmissivity,
                "storativity": storativity,
                "sustainable_yield_m3_per_day": yield_m3_per_day,
                "sustainable_yield_m3_per_hour": yield_m3_per_day / 24,
                "yield_interpretation": sustainable_yield.get('yield_interpretation', 'Unknown yield capacity')
            },
            "financial_analysis": {
                "initial_investment_usd": initial_investment,
                "annual_revenue_usd": available_annual_revenue,
                "annual_opex_usd": total_annual_opex,
                "annual_net_cashflow_usd": available_annual_revenue - total_annual_opex,
                "npv": npv_analysis,
                "irr": irr_analysis,
                "payback": payback_analysis,
                "cash_flow_projection": cash_flow
            },
            "risk_assessment": risk_factors,
            "recommendations": recommendations,
            "viability_summary": self._generate_viability_summary(
                npv_analysis, irr_analysis, yield_m3_per_day, risk_factors
            )
        }
    
    def _assess_risk_factors(
        self,
        depth_m: float,
        geology: str,
        probability: float,
        transmissivity: float,
        yield_m3_per_day: float
    ) -> Dict:
        """Assess technical and financial risks"""
        
        risks = {
            "hydrogeological": {
                "score": 0,
                "factors": [],
                "recommendations": []
            },
            "financial": {
                "score": 0,
                "factors": [],
                "recommendations": []
            },
            "operational": {
                "score": 0,
                "factors": [],
                "recommendations": []
            },
            "overall_risk": "MEDIUM"
        }
        
        # Hydrogeological risks
        if probability < 0.4:
            risks["hydrogeological"]["score"] += 30
            risks["hydrogeological"]["factors"].append("Low success probability (<40%)")
            risks["hydrogeological"]["recommendations"].append("Conduct additional exploratory surveys")
        
        if transmissivity < 1.0:
            risks["hydrogeological"]["score"] += 25
            risks["hydrogeological"]["factors"].append("Very low transmissivity (<1 m²/day)")
            risks["hydrogeological"]["recommendations"].append("Well may struggle to achieve target yield")
        
        if depth_m > 80:
            risks["hydrogeological"]["score"] += 20
            risks["hydrogeological"]["factors"].append("Drilling depth >80m")
            risks["hydrogeological"]["recommendations"].append("Higher drilling costs and technical risk")
        
        if yield_m3_per_day < 5:
            risks["hydrogeological"]["score"] += 20
            risks["hydrogeological"]["factors"].append("Low sustainable yield (<5 m³/day)")
            risks["hydrogeological"]["recommendations"].append("Limited to domestic/small-scale use")
        
        # Financial risks
        if yield_m3_per_day < 2:
            risks["financial"]["score"] += 40
            risks["financial"]["factors"].append("Insufficient yield for productive use")
            risks["financial"]["recommendations"].append("Project may not generate revenue")
        
        # Operational risks
        if geology in ['BASALT', 'GRANITE']:
            risks["operational"]["score"] += 20
            risks["operational"]["factors"].append("Difficult geology affects drilling and maintenance")
            risks["operational"]["recommendations"].append("Plan for specialized drilling contractors")
        
        # Calculate overall risk
        avg_risk = (risks["hydrogeological"]["score"] + 
                   risks["financial"]["score"] + 
                   risks["operational"]["score"]) / 3
        
        if avg_risk > 60:
            risks["overall_risk"] = "HIGH"
        elif avg_risk > 35:
            risks["overall_risk"] = "MEDIUM"
        else:
            risks["overall_risk"] = "LOW"
        
        risks["average_risk_score"] = avg_risk
        
        return risks
    
    def _generate_recommendations(
        self,
        npv_analysis: Dict,
        irr_analysis: Dict,
        payback_analysis: Dict,
        yield_m3_per_day: float,
        hydrogeological_risk: float
    ) -> List[str]:
        """Generate project recommendations"""
        
        recommendations = []
        
        # NPV-based
        if npv_analysis["npv_usd"] > 50000:
            recommendations.append("✓ Excellent NPV: Proceed with project planning")
        elif npv_analysis["npv_usd"] > 0:
            recommendations.append("✓ Positive NPV: Project is financially viable")
        else:
            recommendations.append("✗ Negative NPV: Requires cost reduction or revenue improvement")
        
        # IRR-based
        irr_pct = irr_analysis["irr_percent"]
        if irr_pct > 30:
            recommendations.append("✓ Strong IRR (>30%): Excellent return on investment")
        elif irr_pct > 15:
            recommendations.append("✓ Good IRR (15-30%): Acceptable returns")
        else:
            recommendations.append("⚠ Low IRR (<15%): Consider alternative projects")
        
        # Payback-based
        if payback_analysis.get("payback_period_years"):
            years = payback_analysis["payback_period_years"]
            if years < 5:
                recommendations.append(f"✓ Quick payback ({years:.1f} years): Low financial risk")
            elif years < 15:
                recommendations.append(f"⚠ Moderate payback ({years:.1f} years): Acceptable for development projects")
            else:
                recommendations.append(f"✗ Long payback ({years:.1f} years): Requires careful fiscal planning")
        
        # Yield-based
        if yield_m3_per_day > 15:
            recommendations.append("✓ High yield: Suitable for community/commercial use")
        elif yield_m3_per_day > 5:
            recommendations.append("✓ Medium yield: Adequate for agricultural or small community")
        else:
            recommendations.append("⚠ Low yield: Limited to domestic use; consider alternative approaches")
        
        # Risk-based
        if hydrogeological_risk > 50:
            recommendations.append("⚠ High hydrogeological risk: Additional surveys recommended before drilling")
        elif hydrogeological_risk > 30:
            recommendations.append("~ Moderate risk: Standard mitigation measures apply")
        else:
            recommendations.append("✓ Low hydrogeological risk: Favorable for implementation")
        
        return recommendations
    
    def _generate_viability_summary(
        self,
        npv_analysis: Dict,
        irr_analysis: Dict,
        yield_m3_per_day: float,
        risk_factors: Dict
    ) -> Dict:
        """Generate Executive Summary viability assessment"""
        
        # Score key metrics (0-100)
        npv_score = min(100, max(0, (npv_analysis["npv_usd"] / 100000) * 100))
        irr_score = min(100, irr_analysis["irr_percent"] * 2)  # 50% IRR = 100 score
        yield_score = min(100, (yield_m3_per_day / 15) * 100)
        risk_score = 100 - risk_factors['average_risk_score']
        
        overall_viability = (npv_score + irr_score + yield_score + risk_score) / 4
        
        return {
            "overall_viability_score": round(overall_viability),
            "recommendation": "PROCEED" if overall_viability > 70 else "EVALUATE" if overall_viability > 50 else "REJECT",
            "confidence_level": "HIGH" if overall_viability > 80 else "MEDIUM" if overall_viability > 60 else "LOW",
            "key_metrics": {
                "financial_viability_score": round(npv_score),
                "return_potential_score": round(irr_score),
                "production_potential_score": round(yield_score),
                "risk_mitigation_score": round(risk_score)
            },
            "summary_narrative": self._generate_narrative(overall_viability, risk_factors["overall_risk"])
        }
    
    def _generate_narrative(self, viability_score: float, risk_level: str) -> str:
        """Generate executive summary narrative"""
        
        narrative = ""
        
        if viability_score > 80:
            narrative = f"Project shows EXCELLENT viability. Financial metrics are strong and {risk_level.lower()} risk profile supports implementation. Recommend proceeding to detailed design phase."
        elif viability_score > 70:
            narrative = f"Project shows GOOD viability with manageable risks ({risk_level.lower()}). Proceed with standard feasibility study and community engagement."
        elif viability_score > 60:
            narrative = f"Project shows MODERATE viability. Address identified risks and explore cost optimization strategies. {risk_level.lower()} risk profile requires careful planning."
        elif viability_score > 50:
            narrative = f"Project shows UNCERTAIN viability. Significant risks ({risk_level.lower()}) require mitigation. Additional investigation or cost reduction needed."
        else:
            narrative = f"Project does NOT demonstrate viability at this time. {risk_level.lower()} risks and poor financial metrics suggest alternative approaches."
        
        return narrative
