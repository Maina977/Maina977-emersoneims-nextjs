import numpy as np

def calculate_ndre(red_edge_band, nir_band):
    """Calculate Normalized Difference Red Edge"""
    red_edge = np.array(red_edge_band)
    nir = np.array(nir_band)
    
    denominator = red_edge + nir
    denominator[denominator == 0] = 0.001
    
    ndre = (nir - red_edge) / denominator
    return np.clip(ndre, -1, 1)