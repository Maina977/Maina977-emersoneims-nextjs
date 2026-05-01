import numpy as np

def calculate_gcvi(nir_band, green_band):
    """Calculate Green Chlorophyll Vegetation Index"""
    nir = np.array(nir_band)
    green = np.array(green_band)
    
    denominator = nir
    denominator[denominator == 0] = 0.001
    
    gcvi = (nir / green) - 1
    return np.clip(gcvi, 0, 10)