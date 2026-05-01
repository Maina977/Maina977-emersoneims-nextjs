import numpy as np

def calculate_savi(nir_band, red_band, L=0.5):
    """Calculate Soil Adjusted Vegetation Index"""
    nir = np.array(nir_band)
    red = np.array(red_band)
    
    denominator = nir + red + L
    denominator[denominator == 0] = 0.001
    
    savi = ((nir - red) / denominator) * (1 + L)
    return np.clip(savi, -1, 1)