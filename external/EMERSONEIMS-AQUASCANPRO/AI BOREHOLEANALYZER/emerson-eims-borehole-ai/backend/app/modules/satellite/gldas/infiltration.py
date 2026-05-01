def calculate_infiltration_capacity(soil_type, moisture):
    """Calculate infiltration capacity"""
    capacities = {
        "sandy": 0.8,
        "loamy": 0.5,
        "clay": 0.2,
        "rocky": 0.05
    }
    
    base_capacity = capacities.get(soil_type, 0.4)
    infiltration = base_capacity * (1 - moisture)
    return max(0, min(infiltration, 1))