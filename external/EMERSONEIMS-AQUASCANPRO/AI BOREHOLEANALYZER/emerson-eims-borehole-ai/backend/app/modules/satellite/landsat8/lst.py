import numpy as np

def calculate_lst(thermal_band, ndvi):
    """Calculate Land Surface Temperature"""
    thermal = np.array(thermal_band)
    
    # Simplified LST calculation
    lst = thermal * 0.003 + 273.15
    return lst - 273.15  # Convert to Celsius

def classify_temperature(lst_celsius):
    if lst_celsius > 40:
        return "very_hot"
    elif lst_celsius > 30:
        return "hot"
    elif lst_celsius > 20:
        return "warm"
    elif lst_celsius > 10:
        return "cool"
    else:
        return "cold"