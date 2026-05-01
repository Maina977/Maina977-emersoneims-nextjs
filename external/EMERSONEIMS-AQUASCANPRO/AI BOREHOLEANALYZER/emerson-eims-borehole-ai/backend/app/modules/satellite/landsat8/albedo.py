import numpy as np

def calculate_albedo(bands):
    """Calculate surface albedo from multiple bands"""
    weights = {
        "B2": 0.1, "B3": 0.2, "B4": 0.3, "B5": 0.2, "B6": 0.1, "B7": 0.1
    }
    
    albedo = 0
    for band, weight in weights.items():
        if band in bands:
            albedo += bands[band] * weight
    
    return np.clip(albedo, 0, 1)