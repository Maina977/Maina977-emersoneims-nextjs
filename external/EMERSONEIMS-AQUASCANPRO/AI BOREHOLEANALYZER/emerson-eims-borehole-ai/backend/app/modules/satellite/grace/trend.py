import numpy as np
from scipy import stats

def calculate_trend(time_series, values):
    """Calculate long-term trend"""
    slope, intercept, r_value, p_value, std_err = stats.linregress(time_series, values)
    return {
        "slope": slope,
        "intercept": intercept,
        "r_squared": r_value ** 2,
        "p_value": p_value,
        "trend_direction": "increasing" if slope > 0 else "decreasing"
    }