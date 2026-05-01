import numpy as np
from scipy.optimize import minimize

class VESInversion:
    def invert(self, apparent_resistivities, ab_distances, n_layers=3):
        """Perform VES inversion"""
        initial_model = [100, 50, 10]  # Initial resistivities
        bounds = [(10, 1000), (1, 200), (1, 100)]
        
        result = minimize(
            self._objective,
            initial_model,
            args=(apparent_resistivities, ab_distances),
            bounds=bounds,
            method='L-BFGS-B'
        )
        
        return {
            "resistivities": result.x.tolist(),
            "error": result.fun,
            "converged": result.success
        }
    
    def _objective(self, model, observed, ab_distances):
        # Calculate misfit
        calculated = self._forward_calculate(model, ab_distances)
        return np.sum((observed - calculated) ** 2)
    
    def _forward_calculate(self, model, ab_distances):
        # Forward calculation
        return [model[0] + (model[1] - model[0]) * (1 - np.exp(-ab / 10)) for ab in ab_distances]