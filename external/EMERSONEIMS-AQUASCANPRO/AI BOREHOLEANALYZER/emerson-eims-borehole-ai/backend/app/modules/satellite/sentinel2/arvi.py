import numpy as np

def calculate_arvi(nir_band, red_band, blue_band):
    """Calculate Atmospherically Resistant Vegetation Index"""
    nir = np.array(nir_band)
    red = np.array(red_band)
    blue = np.array(blue_band)
    
    gamma = 1.0
    rb = red - gamma * (blue - red)
    
    denominator = nir + rb
    denominator[denominator == 0] = 0.001
    
    arvi = (nir - rb) / denominator
    return np.clip(arvi, -1, 1)