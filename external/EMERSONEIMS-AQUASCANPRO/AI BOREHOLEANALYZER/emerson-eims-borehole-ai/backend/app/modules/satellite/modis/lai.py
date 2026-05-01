import numpy as np

def calculate_lai(ndvi):
    """Calculate Leaf Area Index"""
    # Simplified LAI calculation
    lai = ndvi * 6
    return np.clip(lai, 0, 7)