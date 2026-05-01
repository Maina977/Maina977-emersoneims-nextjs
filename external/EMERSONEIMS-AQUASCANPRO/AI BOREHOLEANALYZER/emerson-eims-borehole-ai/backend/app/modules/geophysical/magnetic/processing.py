"""
Magnetic & Gravity Processing Module

Processes potential field data for structural interpretation:
- Total field magnetic anomaly computation
- Reduction to pole
- Analytic signal for contact/fault detection
- Euler deconvolution for source depth estimation
- Bouguer gravity anomaly for basement depth
- Tilt derivative for lineament mapping

References:
  - Blakely (1996) Potential Theory in Gravity & Magnetic Applications
  - Nabighian (1972) Analytic signal for 2D magnetic bodies
  - Thompson (1982) Euler deconvolution
  - Salem et al. (2007) Tilt-depth method
"""

import numpy as np
from typing import List, Optional, Tuple
from dataclasses import dataclass, field


@dataclass
class MagneticAnomaly:
    """A detected magnetic anomaly feature."""
    x_m: float
    amplitude_nT: float
    estimated_depth_m: float
    feature_type: str  # "fault", "dyke", "contact", "intrusion"
    azimuth_deg: Optional[float] = None
    confidence: float = 0.5


@dataclass
class MagneticResult:
    """Result of magnetic data processing."""
    anomalies: List[MagneticAnomaly]
    total_field_nT: float
    residual_anomaly_nT: float
    fault_lines: List[dict] = field(default_factory=list)
    dyke_detected: bool = False
    basement_depth_m: Optional[float] = None
    tilt_derivative_lineaments: List[dict] = field(default_factory=list)
    methodology: str = ""


@dataclass
class GravityResult:
    """Result of gravity data processing."""
    bouguer_anomaly_mGal: float
    residual_anomaly_mGal: float
    basement_depth_m: Optional[float] = None
    structural_features: List[dict] = field(default_factory=list)
    sediment_thickness_m: Optional[float] = None
    methodology: str = ""


def compute_analytic_signal_2d(
    data: np.ndarray,
    dx: float,
) -> np.ndarray:
    """
    Compute 2D analytic signal amplitude.

    AS = sqrt((dT/dx)² + (dT/dz)²)

    Where dT/dz is computed via Hilbert transform in the frequency domain.
    The analytic signal peaks directly over contacts/faults regardless of
    magnetization direction.

    Args:
        data: 1D array of total magnetic field along profile
        dx: Station spacing in meters
    """
    n = len(data)
    # Horizontal derivative
    dhdx = np.gradient(data, dx)

    # Vertical derivative via frequency domain
    freq = np.fft.fftfreq(n, d=dx)
    spectrum = np.fft.fft(data)
    # |k| filter for vertical derivative
    k = 2 * np.pi * freq
    vertical_filter = np.abs(k)
    dhdz_spectrum = spectrum * vertical_filter
    dhdz = np.real(np.fft.ifft(dhdz_spectrum))

    analytic_signal = np.sqrt(dhdx ** 2 + dhdz ** 2)
    return analytic_signal


def euler_deconvolution(
    data: np.ndarray,
    x: np.ndarray,
    structural_index: float = 1.0,
    window_size: int = 7,
) -> List[Tuple[float, float]]:
    """
    Euler deconvolution for source depth estimation (Thompson 1982).

    Euler's homogeneity equation:
        (x - x0) * dT/dx + (z - z0) * dT/dz = -N * T

    Where N = structural index (0=contact, 1=fault/dyke, 2=sphere/pipe)

    Args:
        data: 1D total field anomaly
        x: Station positions in meters
        structural_index: N (0=contact, 1=thin dyke, 2=sphere)
        window_size: Number of points per window

    Returns:
        List of (x_position, depth) estimates in meters
    """
    dx = x[1] - x[0] if len(x) > 1 else 1.0
    dhdx = np.gradient(data, dx)
    dhdz_spectrum = np.fft.fft(data) * np.abs(2 * np.pi * np.fft.fftfreq(len(data), d=dx))
    dhdz = np.real(np.fft.ifft(dhdz_spectrum))

    solutions = []
    half_win = window_size // 2

    for i in range(half_win, len(data) - half_win):
        idx = slice(i - half_win, i + half_win + 1)
        xi = x[idx]
        Ti = data[idx]
        dTdx = dhdx[idx]
        dTdz = dhdz[idx]

        n_pts = len(xi)
        if n_pts < 3:
            continue

        # Set up overdetermined system: A * [x0, z0] = b
        A = np.column_stack([dTdx, dTdz])
        b = -(structural_index * Ti + xi * dTdx)

        try:
            result, residuals, _, _ = np.linalg.lstsq(A, b, rcond=None)
            x0, z0 = result
            depth = abs(z0)
            if 1 < depth < 500:  # Reasonable depth range
                solutions.append((float(x0), float(depth)))
        except (np.linalg.LinAlgError, ValueError):
            continue

    return solutions


def process_magnetic_profile(
    total_field: np.ndarray,
    x_positions: np.ndarray,
    inclination_deg: float = -60,
    declination_deg: float = 0,
    regional_field_nT: float = 30000,
) -> MagneticResult:
    """
    Process a magnetic field profile for structural interpretation.

    Pipeline:
    1. Remove regional field (polynomial detrend)
    2. Compute analytic signal for contact detection
    3. Euler deconvolution for depth estimates
    4. Tilt derivative for lineament mapping
    5. Classify detected anomalies

    Args:
        total_field: 1D array of total magnetic field readings (nT)
        x_positions: Station positions along profile (meters)
        inclination_deg: Geomagnetic inclination
        declination_deg: Geomagnetic declination
        regional_field_nT: Expected regional field value
    """
    dx = x_positions[1] - x_positions[0] if len(x_positions) > 1 else 5.0

    # 1. Remove regional field (2nd order polynomial)
    coeffs = np.polyfit(x_positions, total_field, 2)
    regional = np.polyval(coeffs, x_positions)
    residual = total_field - regional

    # 2. Analytic signal for fault/contact detection
    analytic_sig = compute_analytic_signal_2d(residual, dx)

    # 3. Euler deconvolution — try SI=1 (dyke/fault)
    euler_solutions_si1 = euler_deconvolution(residual, x_positions, structural_index=1.0)
    euler_solutions_si0 = euler_deconvolution(residual, x_positions, structural_index=0.0)

    # 4. Tilt derivative: θ = atan(dT/dz / |dT/dx|)
    dhdx = np.gradient(residual, dx)
    dhdz_spec = np.fft.fft(residual) * np.abs(2 * np.pi * np.fft.fftfreq(len(residual), d=dx))
    dhdz = np.real(np.fft.ifft(dhdz_spec))
    horiz_grad = np.abs(dhdx)
    horiz_grad[horiz_grad < 1e-6] = 1e-6
    tilt = np.arctan2(dhdz, horiz_grad) * 180 / np.pi

    # Find zero-crossings of tilt (these mark contacts/faults)
    from scipy.signal import find_peaks
    tilt_lineaments = []
    zero_crossings = np.where(np.diff(np.sign(tilt)))[0]
    for zc in zero_crossings:
        tilt_lineaments.append({
            "x_m": float(x_positions[zc]),
            "tilt_gradient": float(np.abs(np.gradient(tilt)[zc])),
            "interpretation": "Contact/fault trace (tilt zero-crossing)",
        })

    # 5. Detect and classify anomalies from analytic signal peaks
    as_peaks, _ = find_peaks(analytic_sig, height=np.mean(analytic_sig) + np.std(analytic_sig), distance=5)
    anomalies: List[MagneticAnomaly] = []
    dyke_detected = False

    for pk in as_peaks:
        # Find closest Euler solution for depth estimate
        pk_x = x_positions[pk]
        closest_depth = None
        for ex, ed in euler_solutions_si1:
            if abs(ex - pk_x) < dx * 5:
                closest_depth = ed
                break

        if closest_depth is None:
            for ex, ed in euler_solutions_si0:
                if abs(ex - pk_x) < dx * 5:
                    closest_depth = ed
                    break

        # Classify: check anomaly shape
        amplitude = float(residual[pk])
        half_width = 0
        for j in range(pk, min(pk + 50, len(residual))):
            if abs(residual[j]) < abs(amplitude) * 0.5:
                half_width = j - pk
                break

        if abs(amplitude) > 200:
            feature_type = "dyke"
            dyke_detected = True
        elif half_width > 0 and half_width * dx > 50:
            feature_type = "contact"
        else:
            feature_type = "fault"

        anomalies.append(MagneticAnomaly(
            x_m=float(pk_x),
            amplitude_nT=round(amplitude, 1),
            estimated_depth_m=round(closest_depth, 1) if closest_depth else 0,
            feature_type=feature_type,
            confidence=min(0.9, 0.5 + abs(amplitude) / 500),
        ))

    # Basement depth: deepest reliable Euler solution
    all_depths = [s[1] for s in euler_solutions_si1 + euler_solutions_si0 if 5 < s[1] < 300]
    basement_depth = round(np.median(all_depths), 1) if all_depths else None

    return MagneticResult(
        anomalies=anomalies,
        total_field_nT=round(float(np.mean(total_field)), 1),
        residual_anomaly_nT=round(float(np.max(np.abs(residual))), 1),
        fault_lines=[{"x_m": a.x_m, "depth_m": a.estimated_depth_m} for a in anomalies if a.feature_type == "fault"],
        dyke_detected=dyke_detected,
        basement_depth_m=basement_depth,
        tilt_derivative_lineaments=tilt_lineaments,
        methodology="Regional removal (2nd-order polynomial) → Analytic signal → Euler deconvolution (SI=0,1) → Tilt derivative zero-crossings.",
    )


def process_gravity_profile(
    bouguer_anomaly: np.ndarray,
    x_positions: np.ndarray,
    density_contrast: float = 500,  # kg/m³ (sediment vs basement)
) -> GravityResult:
    """
    Process Bouguer gravity anomaly for basement depth estimation.

    Uses the infinite slab approximation for sediment thickness:
        Δg = 2πGΔρh → h = Δg / (2πGΔρ)

    Args:
        bouguer_anomaly: 1D Bouguer gravity anomaly in mGal
        x_positions: Station positions in meters
        density_contrast: Density difference (kg/m³) between basement and sediment
    """
    G = 6.674e-11  # Gravitational constant

    # Remove regional (1st order)
    coeffs = np.polyfit(x_positions, bouguer_anomaly, 1)
    regional = np.polyval(coeffs, x_positions)
    residual = bouguer_anomaly - regional

    # Sediment thickness from Bouguer slab formula
    # Δg (mGal) → Δg (m/s²) = Δg * 1e-5
    mean_anomaly = float(np.mean(residual))
    # h = Δg / (2π G Δρ)
    sediment_h = abs(mean_anomaly * 1e-5) / (2 * np.pi * G * density_contrast)

    # Structural features from residual gradient
    gradient = np.gradient(residual, x_positions[1] - x_positions[0])
    features = []
    from scipy.signal import find_peaks
    grad_peaks, _ = find_peaks(np.abs(gradient), height=np.std(gradient))

    for gp in grad_peaks:
        feature_type = "graben" if residual[gp] < 0 else "horst"
        features.append({
            "x_m": float(x_positions[gp]),
            "residual_mGal": round(float(residual[gp]), 3),
            "type": feature_type,
            "interpretation": f"{'Graben/basin (favorable for groundwater)' if feature_type == 'graben' else 'Horst/uplift (may limit aquifer extent)'}",
        })

    return GravityResult(
        bouguer_anomaly_mGal=round(float(np.mean(bouguer_anomaly)), 3),
        residual_anomaly_mGal=round(float(np.max(np.abs(residual))), 3),
        basement_depth_m=round(sediment_h, 1) if sediment_h > 0 else None,
        structural_features=features,
        sediment_thickness_m=round(sediment_h, 1) if sediment_h > 0 else None,
        methodology="Regional removal (1st-order) → Bouguer slab inversion (h = Δg/2πGΔρ) → Gradient analysis for structural features.",
    )
