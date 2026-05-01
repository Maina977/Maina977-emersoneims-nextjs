import numpy as np

def decompose_seasonal(time_series, values, period=12):
    """Seasonal decomposition"""
    n = len(values)
    seasonal = np.zeros(n)
    
    for i in range(n):
        seasonal[i] = np.mean(values[i::period])
    
    trend = np.polyval(np.polyfit(time_series, values - seasonal, 1), time_series)
    residual = values - seasonal - trend
    
    return {
        "seasonal": seasonal.tolist(),
        "trend": trend.tolist(),
        "residual": residual.tolist()
    }