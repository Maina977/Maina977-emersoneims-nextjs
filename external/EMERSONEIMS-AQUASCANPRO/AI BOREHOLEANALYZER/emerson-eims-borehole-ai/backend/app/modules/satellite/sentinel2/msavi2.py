import numpy as np

def calculate_msavi2(nir_band, red_band):
    """Calculate Modified Soil Adjusted Vegetation Index 2"""
    nir = np.array(nir_band)
    red = np.array(red_band)
    
    msavi2 = (2 * nir + 1 - np.sqrt((2 * nir + 1)**2 - 8 * (nir - red))) / 2
    return np.clip(msavi2, -1, 1)