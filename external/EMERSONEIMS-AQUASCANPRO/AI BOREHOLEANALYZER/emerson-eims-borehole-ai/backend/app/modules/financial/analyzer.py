"""
Financial Analysis Module
NPV, IRR, ROI, Payback Period Calculations
Critical for investment decision-making and project viability
"""

import numpy as np
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)


class FinancialAnalyzer:
    """
    Comprehensive financial modeling for borehole projects
    Calculates NPV, IRR, ROI, payback period, cash flow analysis
    """
    
    # Cost coefficients by geology ($/meter drilling)
    DRILLING_RATES = {
        'ALLUVIUM': 45,      # Easiest to drill
        'SANDSTONE': 60,
        'LATERITE': 50,
        'CONGLOMERATE': 65,
        'LIMESTONE': 75,
        'SHALE': 55,
        'GRANITE': 120,      # Hardest
        'GNEISS': 110,
        'BASALT': 150,       # Hardest
        'DOLOMITE': 85
    }
    
    # Default equipment costs (USD)
    EQUIPMENT_COSTS = {
        'casing_pvc_per_meter': 25,      # 6" PVC pipe
        'casing_steel_per_meter': 75,    # Steel for deep wells
        'screen_per_meter': 25,           # Well screen 0.020" slot
        'pump_small': 800,                # 2 HP submersible
        'pump_medium': 1500,              # 5 HP
        'pump_large': 3000,               # 10 HP
        'filter_pack_material': 5,        # Per meter of screen
        'gravel_seal': 2,                 # Per meter
        'bentonite_seal': 80,             # Per drilling job
        'development': 200,               # Well development
        'water_testing': 250,             # Lab analysis
        'permits': 200,                   # County permits
        'mobilization': 1000,             # Fixed mobilization
    }
    
    def __init__(self, inflation_rate: float = 0.03, discount_rate: float = 0.10):
        """
        Initialize financial analyzer
        
        Args:
            inflation_rate: Annual inflation (0.03 = 3%)
            discount_rate: Discount rate for NPV (0.10 = 10%)
        """
        self.inflation_rate = inflation_rate
        self.discount_rate = discount_rate
        self.initialized = True
    
    def estimate_drilling_cost(
        self,
        depth_m: float,
        geology: str,
        remoteness_factor: float = 1.0,
        drill_method: str = 'rotary'
    ) -> Dict:
        """
        Estimate total drilling cost
        
        Args:
            depth_m: Drilling depth (meters)
            geology: Primary rock formation
            remoteness_factor: 1.0 (accessible) - 3.0 (very remote)
            drill_method: 'rotary', 'percussion', or 'auger'
        
        Returns:
            Itemized cost breakdown
        """
        # Base drilling rate
        rate_per_meter = self.DRILLING_RATES.get(geology, 60)
        
        # Drilling method adjustment
        if drill_method == 'percussion':
            rate_per_meter = rate_per_meter * 1.5  # Slower
        elif drill_method == 'auger':
            rate_per_meter = rate_per_meter * 0.7  # Faster, shallower
        
        # Core drilling costs
        drilling_cost = depth_m * rate_per_meter * remoteness_factor
        
        # Casing (assume 100mm PVC for shallow wells, steel for deeper)
        if depth_m > 50:
            casing_cost = depth_m * self.EQUIPMENT_COSTS['casing_steel_per_meter']
        else:
            casing_cost = depth_m * self.EQUIPMENT_COSTS['casing_pvc_per_meter']
        
        # Screen (assume bottom 10m for small wells, 20m for large)
        screen_length = min(10, depth_m * 0.2)
        screen_cost = screen_length * self.EQUIPMENT_COSTS['screen_per_meter']
        
        # Filter pack and seals
        filter_pack_cost = screen_length * self.EQUIPMENT_COSTS['filter_pack_material']
        gravel_cost = (depth_m - screen_length) * self.EQUIPMENT_COSTS['gravel_seal']
        seal_cost = self.EQUIPMENT_COSTS['bentonite_seal']
        
        # Pump selection (based on depth and expected yield)
        if depth_m < 20:
            pump_cost = self.EQUIPMENT_COSTS['pump_small']
        elif depth_m < 60:
            pump_cost = self.EQUIPMENT_COSTS['pump_medium']
        else:
            pump_cost = self.EQUIPMENT_COSTS['pump_large']
        
        # Well development and testing
        development_cost = self.EQUIPMENT_COSTS['development']
        testing_cost = self.EQUIPMENT_COSTS['water_testing']
        permits_cost = self.EQUIPMENT_COSTS['permits']
        mobilization_cost = self.EQUIPMENT_COSTS['mobilization']
        
        # Contingency (20% for normal, 30% for difficult geology)
        subtotal = (
            drilling_cost + casing_cost + screen_cost +
            filter_pack_cost + gravel_cost + seal_cost +
            pump_cost + development_cost + testing_cost +
            permits_cost + mobilization_cost
        )
        
        contingency_pct = 0.30 if geology in ['BASALT', 'GRANITE', 'GNEISS'] else 0.20
        contingency = subtotal * contingency_pct
        
        total_cost = subtotal + contingency
        
        return {
            "drilling_cost": float(drilling_cost),
            "casing_cost": float(casing_cost),
            "screen_cost": float(screen_cost),
            "filter_pack_cost": float(filter_pack_cost),
            "gravel_cost": float(gravel_cost),
            "seal_cost": float(seal_cost),
            "pump_cost": float(pump_cost),
            "development_cost": float(development_cost),
            "testing_cost": float(testing_cost),
            "permits_cost": float(permits_cost),
            "mobilization_cost": float(mobilization_cost),
            "subtotal": float(subtotal),
            "contingency": float(contingency),
            "contingency_percent": contingency_pct * 100,
            "total_cost_usd": float(total_cost),
            "cost_per_meter": float(total_cost / depth_m),
            "breakdown_percent": {
                "drilling": (drilling_cost / subtotal) * 100,
                "casing": (casing_cost / subtotal) * 100,
                "equipment": (pump_cost / subtotal) * 100,
                "other": ((subtotal - drilling_cost - casing_cost - pump_cost) / subtotal) * 100
            }
        }
    
    def calculate_npv(
        self,
        initial_cost: float,
        annual_revenues: List[float],
        annual_costs: List[float],
        project_years: int = 20
    ) -> Dict:
        """
        Calculate Net Present Value
        NPV = Σ[(Revenue_t - Cost_t) / (1 + r)^t] - Initial_Cost
        where r = discount rate
        
        Args:
            initial_cost: Capital expenditure
            annual_revenues: List of annual revenues
            annual_costs: List of annual costs/maintenance
            project_years: Project lifetime (years)
        
        Returns:
            NPV analysis with sensitivity
        """
        # Ensure arrays are same length
        years = project_years
        revenues = annual_revenues if len(annual_revenues) >= years else \
                   annual_revenues + [annual_revenues[-1]] * (years - len(annual_revenues))
        revenues = revenues[:years]
        
        costs = annual_costs if len(annual_costs) >= years else \
                annual_costs + [annual_costs[-1]] * (years - len(annual_costs))
        costs = costs[:years]
        
        # Calculate discounted cash flows
        cash_flows = []
        for t in range(years):
            net_cf = revenues[t] - costs[t]
            discount_factor = (1 + self.discount_rate) ** (t + 1)
            discounted_cf = net_cf / discount_factor
            cash_flows.append(discounted_cf)
        
        npv = sum(cash_flows) - initial_cost
        
        return {
            "npv_usd": float(npv),
            "initial_investment": float(initial_cost),
            "total_discounted_revenue": float(sum([revenues[i] / ((1 + self.discount_rate) ** (i + 1)) for i in range(years)])),
            "total_discounted_cost": float(sum([costs[i] / ((1 + self.discount_rate) ** (i + 1)) for i in range(years)])),
            "discount_rate": self.discount_rate,
            "project_years": years,
            "decision": "ACCEPT" if npv > 0 else "REJECT",
            "npv_interpretation": self._interpret_npv(npv),
            "yearly_cash_flows": [float(cf) for cf in cash_flows]
        }
    
    def calculate_irr(
        self,
        initial_cost: float,
        annual_revenues: List[float],
        annual_costs: List[float],
        project_years: int = 20
    ) -> Dict:
        """
        Calculate Internal Rate of Return
        IRR = discount rate where NPV = 0
        Solved iteratively using bisection method
        
        Args:
            initial_cost: Capital expenditure
            annual_revenues: Annual revenues
            annual_costs: Annual costs
            project_years: Project lifetime
        
        Returns:
            IRR with interpretation
        """
        # Ensure arrays
        revenues = (annual_revenues + [annual_revenues[-1]] * (project_years - len(annual_revenues)))[:project_years]
        costs = (annual_costs + [annual_costs[-1]] * (project_years - len(annual_costs)))[:project_years]
        
        # Bisection method to find IRR
        low_rate = -0.5
        high_rate = 2.0
        tolerance = 0.0001
        
        for _ in range(100):  # Max iterations
            mid_rate = (low_rate + high_rate) / 2
            
            # Calculate NPV at mid_rate
            npv_mid = -initial_cost
            for t in range(project_years):
                cf = revenues[t] - costs[t]
                npv_mid += cf / ((1 + mid_rate) ** (t + 1))
            
            if abs(npv_mid) < tolerance:
                break
            elif npv_mid > 0:
                low_rate = mid_rate
            else:
                high_rate = mid_rate
        
        irr = mid_rate
        
        return {
            "irr": float(irr),
            "irr_percent": float(irr * 100),
            "decision": "ACCEPT" if irr > self.discount_rate else "REJECT",
            "comparison_to_discount_rate": f"{irr * 100:.1f}% vs {self.discount_rate * 100:.1f}%",
            "irr_interpretation": self._interpret_irr(irr),
            "spread_over_discount": float((irr - self.discount_rate) * 100)
        }
    
    def calculate_roi(
        self,
        total_investment: float,
        total_profit: float,
        project_years: int = 1
    ) -> Dict:
        """
        Calculate Return on Investment
        ROI = (Profit / Investment) × 100%
        
        Args:
            total_investment: Total capital invested
            total_profit: Total profit earned
            project_years: Period over which profit earned
        
        Returns:
            ROI analysis
        """
        if total_investment == 0:
            return {"error": "Investment is zero"}
        
        roi_percent = (total_profit / total_investment) * 100
        roi_annual = roi_percent / project_years if project_years > 0 else 0
        
        return {
            "roi_percent": float(roi_percent),
            "roi_annual_percent": float(roi_annual),
            "total_investment": float(total_investment),
            "total_profit": float(total_profit),
            "project_years": project_years,
            "decision": "ACCEPT" if roi_percent > 20 else "MARGINAL" if roi_percent > 10 else "REJECT"
        }
    
    def calculate_payback_period(
        self,
        initial_cost: float,
        annual_net_cash_flow: float
    ) -> Dict:
        """
        Calculate simple payback period
        Payback = Initial Cost / Annual Cash Flow
        
        Args:
            initial_cost: Capital expenditure
            annual_net_cash_flow: Annual revenue - annual costs
        
        Returns:
            Payback period in years/months
        """
        if annual_net_cash_flow <= 0:
            return {"payback_period": "NEGATIVE (project not viable)"}
        
        payback_years = initial_cost / annual_net_cash_flow
        payback_months = payback_years * 12
        
        return {
            "payback_period_years": float(payback_years),
            "payback_period_months": float(payback_months),
            "payback_interpretation": self._interpret_payback(payback_years)
        }
    
    def project_cash_flow(
        self,
        initial_investment: float,
        annual_revenue: float,
        annual_operating_cost: float,
        project_years: int = 20,
        escalation_rate: float = 0.02
    ) -> Dict:
        """
        Project multi-year cash flow with escalation
        
        Args:
            initial_investment: Upfront cost
            annual_revenue: Year 1 revenue (escalates)
            annual_operating_cost: Year 1 OpEx (escalates)
            project_years: Project lifetime
            escalation_rate: Annual escalation (2-3% typical)
        
        Returns:
            Year-by-year projection
        """
        cash_flows = []
        cumulative = -initial_investment
        
        for year in range(1, project_years + 1):
            # Escalate revenue and costs
            revenue = annual_revenue * ((1 + escalation_rate) ** year)
            opex = annual_operating_cost * ((1 + escalation_rate) ** year)
            
            net_cf = revenue - opex
            cumulative += net_cf
            
            cash_flows.append({
                "year": year,
                "revenue": float(revenue),
                "opex": float(opex),
                "net_cash_flow": float(net_cf),
                "cumulative": float(cumulative)
            })
        
        # Find breakeven year
        breakeven_year = next((cf['year'] for cf in cash_flows if cf['cumulative'] > 0), None)
        
        return {
            "cash_flows": cash_flows,
            "breakeven_year": breakeven_year,
            "total_project_value": float(cumulative),
            "escalation_rate": escalation_rate
        }
    
    def _interpret_npv(self, npv: float) -> str:
        """Interpret NPV result"""
        if npv > 100000:
            return "Excellent project (NPV >$100k)"
        elif npv > 10000:
            return "Good project (NPV $10-100k)"
        elif npv > 0:
            return "Acceptable project (NPV >$0)"
        else:
            return "Unacceptable project (NPV <$0)"
    
    def _interpret_irr(self, irr: float) -> str:
        """Interpret IRR result"""
        irr_pct = irr * 100
        if irr_pct > 50:
            return "Outstanding return (>50%)"
        elif irr_pct > 25:
            return "Excellent return (25-50%)"
        elif irr_pct > 15:
            return "Good return (15-25%)"
        elif irr_pct > 10:
            return "Acceptable return (10-15%)"
        else:
            return "Below-target return (<10%)"
    
    def _interpret_payback(self, years: float) -> str:
        """Interpret payback period"""
        if years < 3:
            return "Excellent (breaks even quickly)"
        elif years < 5:
            return "Good (typical for water projects)"
        elif years < 10:
            return "Acceptable (long-term project)"
        else:
            return "Poor (very long recovery)"
