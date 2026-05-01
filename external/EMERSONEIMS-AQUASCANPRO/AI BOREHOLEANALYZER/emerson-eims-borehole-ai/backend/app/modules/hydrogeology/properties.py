"""
Hydrogeological Hydraulic Properties Calculator
Calculates transmissivity, hydraulic conductivity, specific capacity, storage coefficient
Core module for groundwater availability assessment
"""

import numpy as np
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)


class HydraulicPropertiesCalculator:
    """
    Calculates hydrogeological properties from geology and DEM data
    T = K × b (Transmissivity = Conductivity × thickness)
    S = specific storage × aquifer thickness (storativity)
    """
    
    # Hydraulic conductivity lookup by rock type (m/day)
    # Based on: Fetter (2018), USGS water science
    HYDRAULIC_CONDUCTIVITY = {
        'ALLUVIUM': {'min': 50, 'max': 200, 'typical': 100},
        'SANDSTONE': {'min': 0.5, 'max': 50, 'typical': 5},
        'LIMESTONE': {'min': 1, 'max': 100, 'typical': 10},
        'SHALE': {'min': 0.0001, 'max': 0.1, 'typical': 0.001},
        'GRANITE': {'min': 0.001, 'max': 0.1, 'typical': 0.01},
        'BASALT': {'min': 1, 'max': 100, 'typical': 10},
        'GNEISS': {'min': 0.01, 'max': 1, 'typical': 0.1},
        'LATERITE': {'min': 0.1, 'max': 10, 'typical': 1},
        'CONGLOMERATE': {'min': 1, 'max': 50, 'typical': 10},
        'DOLOMITE': {'min': 5, 'max': 100, 'typical': 20},
    }
    
    # Specific yield (dimensionless) - for unconfined aquifers
    # Fraction of water released per unit volume
    SPECIFIC_YIELD = {
        'ALLUVIUM': 0.25,
        'SANDSTONE': 0.15,
        'LIMESTONE': 0.08,
        'SHALE': 0.02,
        'GRANITE': 0.01,
        'BASALT': 0.08,
        'LATERITE': 0.15,
        'CONGLOMERATE': 0.20,
    }
    
    # Specific storage (1/m) - for confined aquifers
    # Water released per unit volume per unit head change
    SPECIFIC_STORAGE = {
        'ALLUVIUM': 1e-5,
        'SANDSTONE': 1e-6,
        'LIMESTONE': 1e-7,
        'SHALE': 1e-5,
        'GRANITE': 1e-8,
        'BASALT': 1e-7,
    }
    
    # Porosity (dimensionless) - total void fraction
    POROSITY = {
        'ALLUVIUM': 0.35,
        'SANDSTONE': 0.25,
        'LIMESTONE': 0.12,
        'SHALE': 0.05,
        'GRANITE': 0.01,
        'BASALT': 0.05,
        'LATERITE': 0.30,
        'CONGLOMERATE': 0.20,
        'DOLOMITE': 0.15,
    }
    
    def __init__(self):
        self.initialized = True
        logger.info("Hydraulic Properties Calculator initialized")
    
    def calculate_transmissivity(
        self,
        geology: str,
        aquifer_thickness_m: float,
        confinement_state: str = 'unconfined',
        fracture_factor: float = 1.0
    ) -> Dict:
        """
        Calculate transmissivity (T = K × b)
        
        Args:
            geology: Rock formation type
            aquifer_thickness_m: Aquifer thickness in meters
            confinement_state: 'confined', 'unconfined', or 'karst'
            fracture_factor: Multiplier for fractured rock (1.0-10.0)
        
        Returns:
            Dict with T (m²/day), K (m/day), and confidence
        """
        # Get hydraulic conductivity
        k_data = self.HYDRAULIC_CONDUCTIVITY.get(geology, {'typical': 5})
        k_typical = k_data['typical']
        
        # Apply confinement adjustment
        if confinement_state == 'confined':
            # Confined → less secondary porosity, use lower K
            k_adjusted = k_typical * 0.6
        elif confinement_state == 'karst':
            # Karst → high conductivity from solution channels
            k_adjusted = k_typical * 3.0
        else:
            # Unconfined → typical value
            k_adjusted = k_typical
        
        # Apply fracturing enhancement
        k_adjusted = k_adjusted * max(1.0, fracture_factor)
        
        # Transmissivity = K × b
        transmissivity = k_adjusted * aquifer_thickness_m
        
        return {
            "transmissivity_m2_day": float(transmissivity),
            "hydraulic_conductivity_m_day": float(k_adjusted),
            "aquifer_thickness_m": float(aquifer_thickness_m),
            "geology": geology,
            "confinement": confinement_state,
            "fracture_factor": fracture_factor,
            "confidence": "MEDIUM" if transmissivity > 1 else "LOW",
            "interpretation": self._interpret_transmissivity(transmissivity)
        }
    
    def calculate_storativity(
        self,
        geology: str,
        aquifer_thickness_m: float,
        confinement_state: str = 'unconfined'
    ) -> Dict:
        """
        Calculate storativity (S = specific storage × b)
        
        Args:
            geology: Rock formation
            aquifer_thickness_m: Aquifer thickness
            confinement_state: 'confined' or 'unconfined'
        
        Returns:
            Dict with S (dimensionless) and components
        """
        if confinement_state == 'confined':
            # Use specific storage for confined aquifers
            ss_data = self.SPECIFIC_STORAGE.get(geology, 1e-6)
            storativity = ss_data * aquifer_thickness_m
            storage_type = "Specific Storage"
        else:
            # Use specific yield for unconfined
            sy_data = self.SPECIFIC_YIELD.get(geology, 0.15)
            storativity = sy_data
            storage_type = "Specific Yield"
        
        return {
            "storativity": float(storativity),
            "storage_type": storage_type,
            "geology": geology,
            "confinement": confinement_state,
            "interpretation": self._interpret_storativity(storativity, confinement_state)
        }
    
    def calculate_specific_capacity(
        self,
        transmissivity: float,
        well_radius_m: float = 0.1,
        screen_length_m: float = 5
    ) -> Dict:
        """
        Calculate specific capacity (Q/drawdown)
        
        Specific capacity = (yield) / (drawdown)
        Units: m³/h/m
        
        Typical range: 0.5 - 10 m³/h/m (can exceed 100 for excellent wells)
        """
        # Theis equation approximation for specific capacity
        # Specific capacity ≈ T / (264 × ln(R/r))
        # where R = 300m (typical radius of influence)
        # r = well radius
        
        R_m = 300  # Radius of influence
        ln_ratio = np.log(R_m / well_radius_m) if well_radius_m > 0 else 1
        
        # Specific capacity in m²/day / m = m/day
        specific_capacity_m_day = transmissivity / (264 * ln_ratio)
        
        # Convert to m³/h/m
        specific_capacity_m3_h_m = specific_capacity_m_day * screen_length_m / 24
        
        return {
            "specific_capacity_m3_h_m": float(specific_capacity_m3_h_m),
            "transmissivity_m2_day": transmissivity,
            "well_radius_m": well_radius_m,
            "screen_length_m": screen_length_m,
            "radius_of_influence_m": R_m,
            "interpretation": self._interpret_specific_capacity(specific_capacity_m3_h_m)
        }
    
    def predict_sustainable_yield(
        self,
        transmissivity: float,
        storativity: float,
        depth_to_water_m: float,
        maximum_drawdown_m: float = 5,
        aquifer_type: str = 'unconfined',
        recharge_mm_year: float = 100
    ) -> Dict:
        """
        Predict sustainable well yield
        
        Uses:
        1. Theis transmissivity equation for drawdown
        2. Aquifer storativity for recovery time
        3. Recharge rate for long-term sustainability
        
        Q = T × s / (264 × ln(R/r))
        where s = drawdown (m)
        """
        
        # Calculate potential yield from drawdown
        # Q = specific_capacity × drawdown
        specific_capacity_m_day = transmissivity / (264 * np.log(300 / 0.1))
        
        # For typical well (5m screen)
        potential_yield_m3_day = specific_capacity_m_day * maximum_drawdown_m * 5
        
        # Convert to m³/h
        potential_yield_m3_h = potential_yield_m3_day / 24
        
        # Long-term sustainability check
        # Recharge rate limits what can be extracted
        recharge_m_year = recharge_mm_year / 1000
        
        # Assume 50 hectare capture zone
        capture_zone_m2 = 500000  # 50 hectares
        annual_recharge_m3 = recharge_m_year * capture_zone_m2
        
        # Sustainable yield (daily average from recharge)
        sustainable_yield_m3_day = annual_recharge_m3 / 365
        sustainable_yield_m3_h = sustainable_yield_m3_day / 24
        
        # Practical yield = min(potential, sustainable, ~20% aquifer extraction)
        practical_yield = min(
            potential_yield_m3_h,
            sustainable_yield_m3_h * 0.5,  # Conservative
            20  # Max typical well ~20 m³/h
        )
        
        return {
            "potential_yield_m3_h": float(potential_yield_m3_h),
            "sustainable_yield_m3_h": float(sustainable_yield_m3_h),
            "practical_yield_m3_h": float(np.clip(practical_yield, 0.1, 25)),
            "limiting_factor": self._identify_limiting_factor(
                potential_yield_m3_h,
                sustainable_yield_m3_h
            ),
            "maximum_drawdown_m": maximum_drawdown_m,
            "recharge_mm_year": recharge_mm_year,
            "risk_level": self._assess_yield_risk(practical_yield, sustainable_yield_m3_h),
            "yield_interpretation": self._interpret_yield(np.clip(practical_yield, 0.1, 25))
        }
    
    def calculate_time_to_stabilize(
        self,
        transmissivity: float,
        storativity: float,
        distance_m: float = 100
    ) -> Dict:
        """
        Calculate time for water level to stabilize (reach 90%)
        Using diffusivity approach: t = (1000 × s² × S) / (4 × T)
        """
        # Diffusivity = T / S
        diffusivity = transmissivity / max(storativity, 1e-6)
        
        # Time to 90% stabilization (Cooper-Jacob)
        time_days = (distance_m ** 2 * storativity) / (2.25 * transmissivity)
        
        return {
            "diffusivity_m2_day": float(diffusivity),
            "time_to_stabilize_days": float(time_days),
            "time_to_stabilize_hours": float(time_days * 24),
            "interpretation": self._interpret_response_time(time_days)
        }
    
    def _interpret_transmissivity(self, t: float) -> str:
        """Interpret transmissivity value"""
        if t < 1:
            return "Very poor aquifer (< 1 m²/day)"
        elif t < 10:
            return "Poor aquifer (1-10 m²/day)"
        elif t < 100:
            return "Moderate aquifer (10-100 m²/day)"
        elif t < 1000:
            return "Good aquifer (100-1000 m²/day)"
        else:
            return "Excellent aquifer (>1000 m²/day)"
    
    def _interpret_storativity(self, s: float, confinement: str) -> str:
        """Interpret storativity value"""
        if confinement == 'confined':
            if s < 1e-5:
                return "Low storage (typical confined)"
            else:
                return "Moderate storage"
        else:
            if s < 0.05:
                return "Low porosity"
            elif s < 0.20:
                return "Moderate porosity"
            else:
                return "High porosity"
    
    def _interpret_specific_capacity(self, sc: float) -> str:
        """Interpret specific capacity"""
        if sc < 0.5:
            return "Poor well (< 0.5 m³/h/m)"
        elif sc < 2:
            return "Fair well (0.5-2 m³/h/m)"
        elif sc < 5:
            return "Good well (2-5 m³/h/m)"
        elif sc < 20:
            return "Excellent well (5-20 m³/h/m)"
        else:
            return "Outstanding well (>20 m³/h/m)"
    
    def _identify_limiting_factor(self, potential: float, sustainable: float) -> str:
        """Identify what limits yield"""
        if sustainable < potential * 0.5:
            return "RECHARGE" 
        elif potential < 5:
            return "TRANSMISSIVITY"
        else:
            return "DRAWDOWN"
    
    def _assess_yield_risk(self, practical: float, sustainable: float) -> str:
        """Assess sustainability risk"""
        if practical > sustainable:
            return "HIGH (over-extraction risk)"
        elif practical > sustainable * 0.8:
            return "MEDIUM (limited buffer)"
        else:
            return "LOW (good sustainability)"
    
    def _interpret_response_time(self, days: float) -> str:
        """Interpret aquifer response time"""
        if days < 1:
            return "Quick response (< 1 day)"
        elif days < 7:
            return "Moderate response (1-7 days)"
        elif days < 30:
            return "Slow response (1-4 weeks)"
        else:
            return "Very slow response (> 1 month)"
    
    def _interpret_yield(self, yield_m3_h: float) -> str:
        """Interpret sustainable yield"""
        if yield_m3_h > 20:
            return "Very high capacity well (>20 m³/h) - excellent for community/commercial use"
        elif yield_m3_h > 10:
            return "High capacity well (10-20 m³/h) - suitable for community supply"
        elif yield_m3_h > 5:
            return "Medium capacity well (5-10 m³/h) - suitable for agriculture/small community"
        elif yield_m3_h > 2:
            return "Low capacity well (2-5 m³/h) - suitable for domestic use"
        elif yield_m3_h > 1:
            return "Very low capacity well (1-2 m³/h) - marginal for productive use"
        else:
            return "Minimal capacity (<1 m³/h) - limited or emergency use only"
