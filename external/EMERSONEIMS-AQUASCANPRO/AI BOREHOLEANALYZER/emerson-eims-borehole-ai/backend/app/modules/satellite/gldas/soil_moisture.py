def get_soil_moisture_profile(depth_levels):
    """Get soil moisture at different depths"""
    profiles = {
        "surface": 0.25,
        "10cm": 0.22,
        "40cm": 0.18,
        "100cm": 0.15,
        "200cm": 0.12
    }
    return {level: profiles.get(level, 0.2) for level in depth_levels}