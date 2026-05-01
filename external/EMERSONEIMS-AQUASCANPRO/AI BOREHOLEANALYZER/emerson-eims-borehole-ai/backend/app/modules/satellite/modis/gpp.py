def calculate_gpp(lai, fpar, par=500):
    """Calculate Gross Primary Production"""
    # Simplified GPP calculation
    gpp = lai * fpar * par * 0.001
    return gpp