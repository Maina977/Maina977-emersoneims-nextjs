import numpy as np

def calculate_ui(swir1_band, nir_band):
    """Calculate Urban Index"""
    swir1 = np.array(swir1_band)
    nir = np.array(nir_band)
    
    denominator = swir1 + nir
    denominator[denominator == 0] = 0.001
    
    ui = (swir1 - nir) / denominator
    return np.clip(ui, -1, 1)