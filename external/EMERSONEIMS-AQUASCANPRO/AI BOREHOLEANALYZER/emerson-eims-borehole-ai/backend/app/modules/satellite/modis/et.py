import numpy as np

def calculate_evapotranspiration(ndvi, lst, albedo):
    """Calculate Evapotranspiration using MOD16 algorithm"""
    # Simplified ET calculation
    et = ndvi * 0.5 + (1 - albedo) * 0.3 - (lst - 20) * 0.01
    return np.clip(et, 0, 10)