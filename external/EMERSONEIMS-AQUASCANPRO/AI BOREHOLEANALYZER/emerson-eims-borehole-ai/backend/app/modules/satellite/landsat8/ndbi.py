import numpy as np

def calculate_ndbi(swir_band, nir_band):
    """Calculate Normalized Difference Built-up Index"""
    swir = np.array(swir_band)
    nir = np.array(nir_band)
    
    denominator = swir + nir
    denominator[denominator == 0] = 0.001
    
    ndbi = (swir - nir) / denominator
    return np.clip(ndbi, -1, 1)

def classify_urban(ndbi_value):
    if ndbi_value > 0.2:
        return "urban_area"
    elif ndbi_value > 0:
        return "suburban"
    else:
        return "non_urban"