import numpy as np
from scipy.optimize import minimize
from scipy.sparse import diags
from .forward_2d import ERTForward2D

class ERTInversion:
    def __init__(self, nx=50, nz=20):
        self.forward = ERTForward2D(nx, nz)
        self.nx = nx
        self.nz = nz
        self.n_params = nx * nz
        
    def objective_function(self, model, observed_data, electrode_configs, regularization_weight=0.01):
        """Calculate objective function value"""
        # Forward modeling
        predicted_data = self.forward.forward_model(model, electrode_configs)
        
        # Data misfit
        data_misfit = np.sum(((observed_data - predicted_data) / observed_data) ** 2)
        
        # Regularization (smoothness constraint)
        reg = self.smoothness_regularization(model)
        
        # Total objective
        objective = data_misfit + regularization_weight * reg
        
        return objective
    
    def smoothness_regularization(self, model):
        """Calculate smoothness regularization term"""
        model_2d = model.reshape(self.nx, self.nz)
        
        # Horizontal gradient
        horz_grad = np.diff(model_2d, axis=0)
        
        # Vertical gradient
        vert_grad = np.diff(model_2d, axis=1)
        
        # Total variation
        reg = np.sum(horz_grad ** 2) + np.sum(vert_grad ** 2)
        
        return reg
    
    def gradient(self, model, observed_data, electrode_configs):
        """Calculate gradient of objective function"""
        # Simplified gradient calculation using finite differences
        grad = np.zeros_like(model)
        epsilon = 1e-6
        
        for i in range(len(model)):
            model_plus = model.copy()
            model_plus[i] += epsilon
            model_minus = model.copy()
            model_minus[i] -= epsilon
            
            f_plus = self.objective_function(model_plus, observed_data, electrode_configs, 0)
            f_minus = self.objective_function(model_minus, observed_data, electrode_configs, 0)
            
            grad[i] = (f_plus - f_minus) / (2 * epsilon)
        
        return grad
    
    def invert(self, observed_data, electrode_configs, initial_model=None):
        """Perform ERT inversion"""
        if initial_model is None:
            initial_model = np.ones(self.n_params) * 100  # Default 100 ohm-m
        
        # Bounds for resistivity (1 to 10000 ohm-m)
        bounds = [(1, 10000) for _ in range(self.n_params)]
        
        # Run optimization
        result = minimize(
            lambda x: self.objective_function(x, observed_data, electrode_configs),
            initial_model,
            method='L-BFGS-B',
            bounds=bounds,
            options={'maxiter': 100, 'disp': True}
        )
        
        return {
            'resistivity_model': result.x.reshape(self.nx, self.nz),
            'final_objective': result.fun,
            'success': result.success,
            'iterations': result.nit
        }
    
    def calculate_resolution_matrix(self, model, electrode_configs):
        """Calculate model resolution matrix"""
        n = len(model)
        R = np.zeros((n, n))
        
        for i in range(n):
            perturbed_model = model.copy()
            perturbed_model[i] *= 1.01
            
            data_original = self.forward.forward_model(model, electrode_configs)
            data_perturbed = self.forward.forward_model(perturbed_model, electrode_configs)
            
            sensitivity = (data_perturbed - data_original) / (0.01 * model[i])
            
            # Simplified resolution calculation
            R[i, i] = 1.0 / (1.0 + np.std(sensitivity))
        
        return R
    
    def estimate_depth_of_investigation(self, model, electrode_configs, threshold=0.1):
        """Estimate depth of investigation"""
        sensitivities = []
        
        for config in electrode_configs:
            # Calculate sensitivity for each configuration
            sensitivity = self.calculate_sensitivity(model, config)
            sensitivities.append(sensitivity)
        
        # Combine sensitivities
        total_sensitivity = np.sum(sensitivities, axis=0)
        total_sensitivity = total_sensitivity.reshape(self.nx, self.nz)
        
        # Find depth where sensitivity falls below threshold
        doi = np.zeros(self.nx)
        for i in range(self.nx):
            for j in range(self.nz):
                if total_sensitivity[i, j] < threshold:
                    doi[i] = j * self.forward.dz
                    break
        
        return doi
    
    def calculate_sensitivity(self, model, config):
        """Calculate sensitivity for a single electrode configuration"""
        # Simplified sensitivity calculation using perturbation
        sensitivity = np.zeros(self.n_params)
        
        for i in range(self.n_params):
            model_perturbed = model.copy()
            model_perturbed[i] *= 1.01
            
            data_original = self.forward.forward_model(model, [config])
            data_perturbed = self.forward.forward_model(model_perturbed, [config])
            
            sensitivity[i] = (data_perturbed[0] - data_original[0]) / (0.01 * model[i])
        
        return sensitivity