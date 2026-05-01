import numpy as np

def calculate_ndvi(nir_band, red_band):
    """Calculate Normalized Difference Vegetation Index"""
    nir = np.array(nir_band)
    red = np.array(red_band)
    
    denominator = nir + red
    denominator[denominator == 0] = 0.001
    
    ndvi = (nir - red) / denominator
    return np.clip(ndvi, -1, 1)

def classify_vegetation(ndvi_value):
    if ndvi_value > 0.6:
        return "dense_vegetation"
    elif ndvi_value > 0.3:
        return "moderate_vegetation"
    elif ndvi_value > 0:
        return "sparse_vegetation"
    else:
        return "no_vegetation"