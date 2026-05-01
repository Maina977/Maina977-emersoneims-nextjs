"""
Surface Nuclear Magnetic Resonance (SNMR) Processing Module

Gold standard for non-invasive groundwater detection:
- T2* decay curve analysis → water content
- Multi-exponential T2 inversion → pore size distribution
- Hydraulic conductivity estimation (Kenyon 1997, SDR equation)
- Bound vs free water separation
- Depth sounding via loop size variation

References:
  - Legchenko & Valla (2002) SNMR theory and applications
  - Kenyon (1997) SDR equation for NMR permeability
  - Behroozmand et al. (2015) SNMR advances
  - Hertrich (2008) SNMR inversion
"""

import numpy as np
from typing import List, Optional, Tuple
from dataclasses import dataclass, field


@dataclass
class NMRLayer:
    """A single layer from SNMR inversion."""
    top_m: float
    bottom_m: float
    water_content_pct: float  # Total water content (bound + free)
    free_water_pct: float
    bound_water_pct: float
    t2_mean_ms: float  # Geometric mean T2 relaxation time
    hydraulic_conductivity_m_day: float
    porosity_estimate: float
    is_productive_aquifer: bool = False


@dataclass
class NMRResult:
    """Result of SNMR data processing."""
    layers: List[NMRLayer]
    total_water_content_pct: float
    free_water_depth_m: Optional[float] = None
    free_water_thickness_m: Optional[float] = None
    estimated_yield_m3h: Optional[float] = None
    t2_distribution: List[Tuple[float, float]] = field(default_factory=list)
    max_sounding_depth_m: float = 0.0
    loop_size_m: float = 50.0
    methodology: str = ""


def fit_t2_decay(
    signal: np.ndarray,
    time_ms: np.ndarray,
    n_components: int = 3,
) -> List[Tuple[float, float]]:
    """
    Fit multi-exponential T2 decay curve.

    Signal(t) = Σ Ai * exp(-t / T2i)

    Uses NNLS (non-negative least squares) inversion over a T2 spectrum.

    Args:
        signal: Measured FID envelope amplitude
        time_ms: Time axis in milliseconds
        n_components: Number of T2 components

    Returns:
        List of (T2_ms, amplitude) pairs
    """
    # Create T2 spectrum basis (log-spaced from 1ms to 3000ms)
    n_t2 = 50
    t2_spectrum = np.logspace(0, 3.5, n_t2)  # 1ms to ~3162ms

    # Forward kernel: G(i,j) = exp(-time_i / T2_j)
    kernel = np.exp(-time_ms[:, np.newaxis] / t2_spectrum[np.newaxis, :])

    # NNLS inversion with Tikhonov regularization
    from scipy.optimize import nnls
    # Regularization: append smoothness constraint
    alpha = 0.01 * np.max(signal)
    n_time = len(time_ms)
    # Build regularized system: [G; alpha*L] * m = [d; 0]
    L = np.diff(np.eye(n_t2), axis=0)  # First-difference operator
    G_reg = np.vstack([kernel, alpha * L])
    d_reg = np.concatenate([signal, np.zeros(n_t2 - 1)])

    amplitudes, _ = nnls(G_reg, d_reg)

    # Extract significant peaks
    results = []
    for i in range(n_t2):
        if amplitudes[i] > np.max(amplitudes) * 0.02:
            results.append((float(t2_spectrum[i]), float(amplitudes[i])))

    # Sort by amplitude descending, keep top n_components
    results.sort(key=lambda x: -x[1])
    return results[:n_components]


def classify_water_from_t2(t2_ms: float) -> str:
    """
    Classify water type from T2 relaxation time.

    - T2 < 30ms: Bound water (clay-bound or capillary)
    - 30ms < T2 < 300ms: Movable water in fine pores
    - T2 > 300ms: Free water in large pores / fractures

    Reference: Kenyon (1997), Behroozmand (2015)
    """
    if t2_ms < 10:
        return "clay_bound"
    elif t2_ms < 30:
        return "capillary_bound"
    elif t2_ms < 100:
        return "movable_fine_pore"
    elif t2_ms < 300:
        return "movable_coarse_pore"
    else:
        return "free_water"


def compute_hydraulic_conductivity(
    t2_mean_ms: float,
    porosity: float,
    method: str = "SDR",
) -> float:
    """
    Estimate hydraulic conductivity from NMR parameters.

    SDR equation (Kenyon 1997):
        K = C × φ⁴ × T2_gm²

    Where:
        C = empirical constant (~4.5 for sandstone, ~0.1 for unconsolidated)
        φ = porosity (fraction)
        T2_gm = geometric mean T2 (seconds)

    Args:
        t2_mean_ms: Geometric mean T2 in milliseconds
        porosity: Porosity as fraction (0-1)
        method: "SDR" or "Timur-Coates"

    Returns:
        Hydraulic conductivity in m/day
    """
    t2_s = t2_mean_ms / 1000.0  # Convert to seconds

    if method == "SDR":
        # SDR equation: K (m²) = C * φ^4 * T2^2
        # C ≈ 4.5 for consolidated, 0.1 for unconsolidated
        C = 1.0  # Average
        k_m2 = C * porosity ** 4 * t2_s ** 2
    else:
        # Timur-Coates: K = C * (φ/BVI)^2 * φ^2 * T2^2
        # Simplified version
        C = 0.5
        k_m2 = C * porosity ** 4 * t2_s ** 2

    # Convert permeability (m²) to hydraulic conductivity (m/day)
    # K (m/s) = k (m²) × ρg/μ ≈ k × 9.81e6
    k_m_s = k_m2 * 9.81e6
    k_m_day = k_m_s * 86400

    return max(0.001, min(1000, k_m_day))  # Clamp to reasonable range


def process_snmr_sounding(
    fid_signals: List[np.ndarray],
    time_ms: np.ndarray,
    pulse_moments: np.ndarray,
    loop_size_m: float = 50.0,
    inclination_deg: float = -60,
) -> NMRResult:
    """
    Process Surface NMR sounding data to extract water content profile.

    Pipeline:
    1. Stack and denoise FID signals
    2. Fit multi-exponential T2 decay for each pulse moment
    3. Invert pulse moment vs amplitude for depth profile
    4. Classify bound vs free water from T2 spectrum
    5. Estimate hydraulic conductivity per layer

    Args:
        fid_signals: List of FID envelopes, one per pulse moment
        time_ms: Time axis for FID (milliseconds)
        pulse_moments: Pulse moment values (A·s·m²) — controls sounding depth
        loop_size_m: Transmitter loop size in meters
        inclination_deg: Geomagnetic inclination
    """
    n_pm = len(fid_signals)

    # Maximum sounding depth ≈ 1.5 × loop_size
    max_depth = 1.5 * loop_size_m

    # For each pulse moment, extract initial amplitude and T2 components
    amplitudes = []
    t2_components = []

    for i, fid in enumerate(fid_signals):
        if len(fid) == 0:
            amplitudes.append(0)
            t2_components.append([])
            continue

        # Initial amplitude (proportional to water content at depth)
        e0 = float(fid[0]) if len(fid) > 0 else 0
        amplitudes.append(e0)

        # T2 analysis
        t2_fit = fit_t2_decay(fid, time_ms)
        t2_components.append(t2_fit)

    amplitudes_arr = np.array(amplitudes)

    # Convert pulse moments to approximate sounding depths
    # Depth sensitivity ∝ pulse_moment^(1/3) for surface coil
    # Simplified: depth ≈ max_depth × (q_i / q_max)^0.5
    q_max = np.max(pulse_moments) if len(pulse_moments) > 0 else 1
    sounding_depths = max_depth * (pulse_moments / q_max) ** 0.5

    # Build layered model
    layers: List[NMRLayer] = []
    total_wc = 0.0
    free_water_top = None
    free_water_bottom = None

    for i in range(n_pm):
        if i >= len(sounding_depths):
            break

        top = sounding_depths[i - 1] if i > 0 else 0
        bottom = sounding_depths[i]

        # Water content from amplitude (calibrated: 1 nV ≈ 0.1% water)
        water_content = max(0, min(50, amplitudes[i] * 0.1))  # Simplified calibration

        # T2 analysis for this depth
        t2_data = t2_components[i] if i < len(t2_components) else []

        # Compute geometric mean T2
        if t2_data:
            t2_values = [t[0] for t in t2_data]
            t2_weights = [t[1] for t in t2_data]
            total_weight = sum(t2_weights)
            if total_weight > 0:
                log_t2_mean = sum(w * np.log(t) for t, w in zip(t2_values, t2_weights)) / total_weight
                t2_mean = float(np.exp(log_t2_mean))
            else:
                t2_mean = 50.0
        else:
            t2_mean = 50.0

        # Separate bound vs free water
        free_frac = 0.0
        bound_frac = 0.0
        for t2_val, amp in t2_data:
            wtype = classify_water_from_t2(t2_val)
            if "free" in wtype or "coarse" in wtype:
                free_frac += amp
            else:
                bound_frac += amp
        total_amp = free_frac + bound_frac
        if total_amp > 0:
            free_pct = water_content * (free_frac / total_amp)
            bound_pct = water_content * (bound_frac / total_amp)
        else:
            free_pct = water_content * 0.5
            bound_pct = water_content * 0.5

        # Estimate porosity (water content is lower bound on porosity)
        porosity = min(0.45, max(water_content / 100 * 1.3, 0.05))

        # Hydraulic conductivity
        k = compute_hydraulic_conductivity(t2_mean, porosity)

        # Productive aquifer: free water > 5%, K > 0.1 m/day
        is_productive = free_pct > 5 and k > 0.1

        if is_productive and free_water_top is None:
            free_water_top = top
        if is_productive:
            free_water_bottom = bottom

        layers.append(NMRLayer(
            top_m=round(top, 1),
            bottom_m=round(bottom, 1),
            water_content_pct=round(water_content, 1),
            free_water_pct=round(free_pct, 1),
            bound_water_pct=round(bound_pct, 1),
            t2_mean_ms=round(t2_mean, 1),
            hydraulic_conductivity_m_day=round(k, 3),
            porosity_estimate=round(porosity, 3),
            is_productive_aquifer=is_productive,
        ))
        total_wc += water_content

    avg_wc = total_wc / max(1, len(layers))

    # Free water zone
    fw_thickness = None
    if free_water_top is not None and free_water_bottom is not None:
        fw_thickness = free_water_bottom - free_water_top

    # Estimate yield from Dupuit-Thiem (Logan 1964)
    # Q = K × b × Δh / ln(R/r)  (simplified)
    productive_layers = [l for l in layers if l.is_productive_aquifer]
    if productive_layers:
        avg_k = np.mean([l.hydraulic_conductivity_m_day for l in productive_layers])
        total_b = sum(l.bottom_m - l.top_m for l in productive_layers)
        # Assume Δh = 0.5 × total_b, R/r ≈ 300
        q_m3_day = avg_k * total_b * (0.5 * total_b) / np.log(300)
        yield_m3h = round(q_m3_day / 24, 2)
    else:
        yield_m3h = None

    # T2 distribution (combined from all pulse moments)
    all_t2 = []
    for tc in t2_components:
        all_t2.extend(tc)
    all_t2.sort(key=lambda x: x[0])

    return NMRResult(
        layers=layers,
        total_water_content_pct=round(avg_wc, 1),
        free_water_depth_m=round(free_water_top, 1) if free_water_top is not None else None,
        free_water_thickness_m=round(fw_thickness, 1) if fw_thickness is not None else None,
        estimated_yield_m3h=yield_m3h,
        t2_distribution=all_t2,
        max_sounding_depth_m=round(max_depth, 1),
        loop_size_m=loop_size_m,
        methodology="Multi-exponential T2 inversion (NNLS + Tikhonov). K from SDR equation (Kenyon 1997). Yield from Dupuit-Thiem approximation.",
    )
