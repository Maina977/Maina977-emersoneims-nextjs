import numpy as np

def calculate_evi(nir_band, red_band, blue_band):
    """Calculate Enhanced Vegetation Index"""
    nir = np.array(nir_band)
    red = np.array(red_band)
    blue = np.array(blue_band)
    
    G = 2.5
    C1 = 6.0
    C2 = 7.5
    L = 1.0
    
    denominator = nir + C1 * red - C2 * blue + L
    denominator[denominator == 0] = 0.001
    
    evi = G * (nir - red) / denominator
    return np.clip(evi, -1, 1)