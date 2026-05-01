"""
Sentinel-2 NDWI Water Body Detection
Normalized Difference Water Index with Otsu's automatic thresholding

Scientific Method:
  - NDWI = (Green - NIR) / (Green + NIR)  [McFeeters, 1996]
  - Otsu's method for automatic threshold selection (bimodal histogram)
  - Validated against Sentinel-2 10 m resolution imagery

Accuracy Target: >90% water body detection (Otsu vs fixed threshold)
"""

import numpy as np
from typing import Dict, Tuple, Union


def calculate_ndwi(green_band, nir_band):
    """
    Calculate Normalized Difference Water Index.

    NDWI = (Green - NIR) / (Green + NIR)
    Range: -1 to +1 (positive = water, negative = vegetation/soil)
    """
    green = np.array(green_band, dtype=np.float64)
    nir = np.array(nir_band, dtype=np.float64)

    denominator = green + nir
    denominator[denominator == 0] = 0.001

    ndwi = (green - nir) / denominator
    return np.clip(ndwi, -1, 1)


def otsu_threshold(values: np.ndarray, bins: int = 256) -> float:
    """
    Otsu's method for automatic optimal threshold selection.

    Finds the threshold that minimizes intra-class variance
    (equivalently, maximizes inter-class variance) for a bimodal
    distribution of NDWI values (water vs non-water).

    Algorithm:
    1. Compute histogram of NDWI values
    2. For each candidate threshold t:
       - Class 0 (non-water): values <= t
       - Class 1 (water): values > t
       - Compute inter-class variance: σ²_B = w0 * w1 * (μ0 - μ1)²
    3. Select t that maximizes σ²_B

    Args:
        values: 1D or 2D array of NDWI values
        bins: Number of histogram bins

    Returns:
        Optimal threshold value
    """
    values_flat = np.array(values, dtype=np.float64).ravel()

    # Remove NaN/Inf
    values_flat = values_flat[np.isfinite(values_flat)]
    if len(values_flat) < 2:
        return 0.3  # Fallback to fixed threshold

    # Compute histogram over NDWI range [-1, 1]
    hist, bin_edges = np.histogram(values_flat, bins=bins, range=(-1.0, 1.0))
    bin_centers = (bin_edges[:-1] + bin_edges[1:]) / 2

    # Normalize histogram to probability distribution
    hist = hist.astype(np.float64)
    total = hist.sum()
    if total == 0:
        return 0.3

    hist_norm = hist / total

    # Cumulative sums
    cumulative_sum = np.cumsum(hist_norm)
    cumulative_mean = np.cumsum(hist_norm * bin_centers)
    global_mean = cumulative_mean[-1]

    # Inter-class variance for each threshold
    best_threshold = 0.3
    max_variance = 0.0

    for i in range(1, bins - 1):
        w0 = cumulative_sum[i]
        w1 = 1.0 - w0

        if w0 < 1e-10 or w1 < 1e-10:
            continue

        mu0 = cumulative_mean[i] / w0
        mu1 = (global_mean - cumulative_mean[i]) / w1

        inter_class_variance = w0 * w1 * (mu0 - mu1) ** 2

        if inter_class_variance > max_variance:
            max_variance = inter_class_variance
            best_threshold = bin_centers[i]

    return float(best_threshold)


def detect_water_bodies(
    ndwi_values: Union[np.ndarray, float],
    threshold: Union[float, str] = "otsu",
) -> Union[np.ndarray, bool, Dict]:
    """
    Detect water bodies from NDWI values using Otsu's automatic thresholding.

    Args:
        ndwi_values: NDWI array or scalar value
        threshold: "otsu" for automatic Otsu threshold, or float for fixed

    Returns:
        If array input: Dict with water mask, threshold used, and statistics
        If scalar input: bool (is water or not)
    """
    values = np.array(ndwi_values, dtype=np.float64)

    # Determine threshold
    if isinstance(threshold, str) and threshold.lower() == "otsu":
        if values.ndim == 0 or values.size < 10:
            # Not enough data for Otsu — use standard threshold
            computed_threshold = 0.3
            method = "fixed (insufficient data for Otsu)"
        else:
            computed_threshold = otsu_threshold(values)
            method = "otsu"
    else:
        computed_threshold = float(threshold)
        method = "fixed"

    # Apply threshold
    water_mask = values > computed_threshold

    # For scalar input, return simple bool
    if values.ndim == 0:
        return bool(water_mask)

    # For array input, return detailed result
    total_pixels = int(values.size)
    water_pixels = int(np.sum(water_mask))
    water_fraction = water_pixels / total_pixels if total_pixels > 0 else 0.0

    return {
        "water_mask": water_mask,
        "threshold": round(computed_threshold, 4),
        "threshold_method": method,
        "statistics": {
            "total_pixels": total_pixels,
            "water_pixels": water_pixels,
            "non_water_pixels": total_pixels - water_pixels,
            "water_fraction": round(water_fraction, 4),
            "ndwi_mean": round(float(np.nanmean(values)), 4),
            "ndwi_std": round(float(np.nanstd(values)), 4),
            "ndwi_min": round(float(np.nanmin(values)), 4),
            "ndwi_max": round(float(np.nanmax(values)), 4),
        },
    }


def classify_water_body(ndwi_value: float, threshold: float = 0.3) -> Dict:
    """
    Classify water body type from NDWI intensity.

    Classes:
      - Deep water: NDWI > 0.5
      - Shallow water: threshold < NDWI <= 0.5
      - Wetland/saturated: 0.0 < NDWI <= threshold
      - Moist soil: -0.2 < NDWI <= 0.0
      - Dry surface: NDWI <= -0.2
    """
    if ndwi_value > 0.5:
        return {"class": "deep_water", "confidence": "HIGH"}
    elif ndwi_value > threshold:
        return {"class": "shallow_water", "confidence": "HIGH"}
    elif ndwi_value > 0.0:
        return {"class": "wetland_saturated", "confidence": "MEDIUM"}
    elif ndwi_value > -0.2:
        return {"class": "moist_soil", "confidence": "MEDIUM"}
    else:
        return {"class": "dry_surface", "confidence": "HIGH"}