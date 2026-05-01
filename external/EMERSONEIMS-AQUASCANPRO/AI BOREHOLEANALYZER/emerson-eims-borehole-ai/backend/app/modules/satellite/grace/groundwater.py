def calculate_groundwater_anomaly(grace_data):
    """Calculate groundwater anomaly from GRACE data"""
    # Simplified calculation
    anomaly = grace_data.get("twsa", 0) - grace_data.get("smc", 0) - grace_data.get("swc", 0)
    return anomaly

def classify_anomaly(anomaly):
    if anomaly > 50:
        return "extremely_wet"
    elif anomaly > 25:
        return "wet"
    elif anomaly > -25:
        return "normal"
    elif anomaly > -50:
        return "dry"
    else:
        return "extremely_dry"