def get_vertical_moisture_profile(depth_meters):
    """Get vertical moisture profile"""
    profile = []
    for d in range(0, depth_meters + 1, 10):
        moisture = 0.3 * np.exp(-d / 50)
        profile.append({"depth": d, "moisture": moisture})
    return profile