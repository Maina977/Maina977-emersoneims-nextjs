import numpy as np

class VESForwardModel:
    def __init__(self):
        self.air_resistivity = 1e12
    
    def calculate_apparent_resistivity(self, resistivities, thicknesses, ab_distances):
        """Calculate apparent resistivity for given model"""
        apparent = []
        for ab in ab_distances:
            rho_a = self._calculate_for_spacing(resistivities, thicknesses, ab)
            apparent.append(rho_a)
        return apparent
    
    def _calculate_for_spacing(self, resistivities, thicknesses, ab):
        # Simplified Schlumberger array calculation
        return resistivities[0] + (resistivities[1] - resistivities[0]) * (1 - np.exp(-ab / thicknesses[0]))