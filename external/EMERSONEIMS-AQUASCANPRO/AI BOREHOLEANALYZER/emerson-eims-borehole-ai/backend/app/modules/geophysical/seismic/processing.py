"""
Seismic Refraction & MASW Processing Module

Processes seismic data for borehole site characterization:
- First-break picking for refraction analysis
- Velocity model inversion (time-distance curves → layer depths)
- MASW: Multi-channel Analysis of Surface Waves (Vs profiling)
- Bedrock depth and weathered zone thickness estimation

References:
  - Palmer (1981) Generalized Reciprocal Method
  - Park et al. (1999) MASW method
  - Haeni (1988) USGS seismic refraction for groundwater
"""

import numpy as np
from typing import List, Optional, Tuple
from dataclasses import dataclass, field


@dataclass
class SeismicLayer:
    """A single velocity layer from refraction interpretation."""
    top_m: float
    bottom_m: float
    vp_ms: float  # P-wave velocity (m/s)
    vs_ms: Optional[float] = None  # S-wave velocity (if MASW)
    poissons_ratio: Optional[float] = None
    lithology_estimate: str = ""
    is_aquifer_candidate: bool = False


@dataclass
class RefractionResult:
    """Result of seismic refraction inversion."""
    layers: List[SeismicLayer]
    bedrock_depth_m: float
    weathered_zone_thickness_m: float
    fracture_zone: Optional[dict] = None
    profile_length_m: float = 0.0
    methodology: str = ""


@dataclass
class MASWResult:
    """Result of MASW (surface wave) analysis."""
    vs_profile: List[Tuple[float, float]]  # (depth_m, vs_m_s)
    vs30: float  # Average Vs in top 30m
    site_class: str  # NEHRP A-E
    low_velocity_zones: List[dict] = field(default_factory=list)


def pick_first_breaks(traces: np.ndarray, dt_s: float, method: str = "sta_lta") -> np.ndarray:
    """
    Automatic first-break picking using STA/LTA ratio.

    Args:
        traces: 2D array (n_traces, n_samples) of seismic amplitudes
        dt_s: Sample interval in seconds
        method: 'sta_lta' or 'threshold'

    Returns:
        Array of first-break times (seconds) for each trace
    """
    n_traces, n_samples = traces.shape
    fb_times = np.zeros(n_traces)

    sta_len = max(3, int(0.005 / dt_s))  # 5ms short-term window
    lta_len = max(10, int(0.050 / dt_s))  # 50ms long-term window
    threshold = 3.0  # STA/LTA trigger ratio

    for i in range(n_traces):
        trace = np.abs(traces[i])
        # Compute running STA/LTA
        for j in range(lta_len, n_samples - sta_len):
            lta = np.mean(trace[j - lta_len:j])
            sta = np.mean(trace[j:j + sta_len])
            if lta > 0 and sta / lta > threshold:
                fb_times[i] = j * dt_s
                break
        else:
            # Fallback: use maximum energy onset
            envelope = np.cumsum(trace ** 2)
            envelope /= envelope[-1] if envelope[-1] > 0 else 1
            idx = np.searchsorted(envelope, 0.05)
            fb_times[i] = idx * dt_s

    return fb_times


def invert_refraction(
    offsets_m: np.ndarray,
    fb_times_s: np.ndarray,
    max_layers: int = 4,
) -> RefractionResult:
    """
    Invert first-break travel times to layered velocity model.

    Uses intercept-time method (Haeni 1988):
      - Fit piecewise linear segments to time-distance curve
      - Each slope change indicates a new velocity layer
      - Layer thickness: h_i = (t_intercept / 2) * (V_i * V_{i+1}) / sqrt(V_{i+1}^2 - V_i^2)

    Args:
        offsets_m: Source-receiver offsets in meters
        fb_times_s: First-break arrival times in seconds
        max_layers: Maximum number of layers to fit
    """
    # Sort by offset
    sort_idx = np.argsort(offsets_m)
    x = offsets_m[sort_idx]
    t = fb_times_s[sort_idx]

    # Remove zero/negative offsets
    mask = x > 0
    x, t = x[mask], t[mask]

    if len(x) < 4:
        return RefractionResult(
            layers=[SeismicLayer(0, 30, 500, lithology_estimate="Unknown")],
            bedrock_depth_m=30,
            weathered_zone_thickness_m=30,
            methodology="Insufficient data for inversion",
        )

    # Piecewise linear regression — find breakpoints
    layers = []
    velocities = []
    intercepts = []

    # Start with full dataset linear fit (Layer 1)
    # Use iterative breakpoint detection
    remaining_x = x.copy()
    remaining_t = t.copy()

    for layer_idx in range(max_layers):
        if len(remaining_x) < 3:
            break

        # Fit linear to current segment
        # Find optimal breakpoint by minimizing total residual
        best_bp = len(remaining_x)
        best_residual = float("inf")

        for bp in range(3, len(remaining_x)):
            # Fit two segments
            seg1_x, seg1_t = remaining_x[:bp], remaining_t[:bp]
            seg2_x, seg2_t = remaining_x[bp - 1:], remaining_t[bp - 1:]

            if len(seg1_x) < 2 or len(seg2_x) < 2:
                continue

            c1 = np.polyfit(seg1_x, seg1_t, 1)
            c2 = np.polyfit(seg2_x, seg2_t, 1)

            res1 = np.sum((np.polyval(c1, seg1_x) - seg1_t) ** 2)
            res2 = np.sum((np.polyval(c2, seg2_x) - seg2_t) ** 2)

            total_res = res1 + res2
            if total_res < best_residual:
                best_residual = total_res
                best_bp = bp

        # Fit current layer segment
        seg_x = remaining_x[:best_bp]
        seg_t = remaining_t[:best_bp]
        coeffs = np.polyfit(seg_x, seg_t, 1)
        slope = coeffs[0]
        intercept = coeffs[1]

        velocity = 1.0 / max(slope, 1e-6)  # m/s
        velocities.append(velocity)
        intercepts.append(intercept)

        # Move to next segment
        remaining_x = remaining_x[best_bp - 1:]
        remaining_t = remaining_t[best_bp - 1:]

        if best_bp >= len(x) - 2:
            break

    # Compute layer thicknesses from intercept times
    # h_n = (ti_n / 2) * (V_n * V_{n+1}) / sqrt(V_{n+1}^2 - V_n^2)
    depth = 0.0
    for i in range(len(velocities)):
        v = velocities[i]
        if i < len(velocities) - 1:
            v_next = velocities[i + 1]
            if v_next > v:
                ti = intercepts[i + 1] if i + 1 < len(intercepts) else 0
                h = abs(ti) / 2 * (v * v_next) / max(1, np.sqrt(abs(v_next ** 2 - v ** 2)))
                h = max(1, min(100, h))
            else:
                h = 10  # Default if velocity inversion
        else:
            h = 50  # Half-space

        lithology = _estimate_lithology_from_vp(v)
        is_aquifer = 1500 <= v <= 3000  # Saturated but not solid rock

        layers.append(SeismicLayer(
            top_m=round(depth, 1),
            bottom_m=round(depth + h, 1),
            vp_ms=round(v, 0),
            lithology_estimate=lithology,
            is_aquifer_candidate=is_aquifer,
        ))
        depth += h

    # Identify bedrock (first layer with Vp > 3000 m/s)
    bedrock_depth = depth
    weathered_thickness = depth
    for layer in layers:
        if layer.vp_ms > 3000:
            bedrock_depth = layer.top_m
            weathered_thickness = layer.top_m
            break

    # Detect fracture zone: velocity decrease within otherwise increasing profile
    fracture_zone = None
    for i in range(1, len(layers) - 1):
        if layers[i].vp_ms < layers[i - 1].vp_ms * 0.85:
            fracture_zone = {
                "depth_m": layers[i].top_m,
                "thickness_m": layers[i].bottom_m - layers[i].top_m,
                "velocity_drop_pct": round((1 - layers[i].vp_ms / layers[i - 1].vp_ms) * 100, 1),
                "aquifer_potential": "HIGH — fracture zone detected",
            }
            break

    return RefractionResult(
        layers=layers,
        bedrock_depth_m=round(bedrock_depth, 1),
        weathered_zone_thickness_m=round(weathered_thickness, 1),
        fracture_zone=fracture_zone,
        profile_length_m=float(x[-1] - x[0]) if len(x) > 0 else 0,
        methodology="Intercept-time method (Haeni 1988). Breakpoints by minimum residual piecewise fit.",
    )


def compute_masw_dispersion(
    traces: np.ndarray,
    offsets_m: np.ndarray,
    dt_s: float,
    freq_range: Tuple[float, float] = (5, 50),
) -> MASWResult:
    """
    MASW dispersion curve extraction and Vs inversion.

    Computes phase velocity vs frequency from multi-channel surface wave data,
    then inverts for 1D shear-wave velocity profile using the Park et al. (1999) method.

    Args:
        traces: 2D array (n_traces, n_samples)
        offsets_m: Receiver offsets from source (meters)
        dt_s: Time sample interval (seconds)
        freq_range: Frequency range for analysis (Hz)
    """
    n_traces, n_samples = traces.shape
    fs = 1.0 / dt_s
    n_fft = 2 ** int(np.ceil(np.log2(n_samples)))

    # FFT of all traces
    spectra = np.fft.rfft(traces, n=n_fft, axis=1)
    freqs = np.fft.rfftfreq(n_fft, d=dt_s)

    # Frequency mask
    f_mask = (freqs >= freq_range[0]) & (freqs <= freq_range[1])
    target_freqs = freqs[f_mask]

    # Phase-shift method (Park et al. 1999)
    # For each frequency, scan phase velocities and find max energy
    c_min, c_max, c_step = 100, 2000, 10
    c_scan = np.arange(c_min, c_max + c_step, c_step)

    dispersion = []
    for fi, f in enumerate(target_freqs):
        if f <= 0:
            continue
        f_idx = np.argmin(np.abs(freqs - f))
        energy = np.zeros(len(c_scan))

        for ci, c in enumerate(c_scan):
            # Phase shift and stack
            phase_shifts = np.exp(1j * 2 * np.pi * f * offsets_m / c)
            stacked = np.abs(np.sum(spectra[:, f_idx] * phase_shifts))
            energy[ci] = stacked

        # Pick maximum energy
        best_idx = np.argmax(energy)
        dispersion.append((float(f), float(c_scan[best_idx])))

    # Invert dispersion curve to Vs profile (simplified 1D)
    # Use the approximation: Vs ≈ phase_velocity / 1.1 at depth ≈ wavelength / 3
    vs_profile = []
    for f, c_phase in dispersion:
        if f > 0:
            wavelength = c_phase / f
            depth = wavelength / 3
            vs = c_phase / 1.1
            vs_profile.append((round(depth, 1), round(vs, 0)))

    # Sort by depth and remove duplicates
    vs_profile.sort(key=lambda x: x[0])

    # Vs30 computation
    if vs_profile:
        depths = [v[0] for v in vs_profile]
        vels = [v[1] for v in vs_profile]
        mask_30 = [d for d, v in vs_profile if d <= 30]
        vs30 = float(np.mean([v for d, v in vs_profile if d <= 30])) if mask_30 else 300
    else:
        vs30 = 300  # Default

    # NEHRP site class
    if vs30 > 1500:
        site_class = "A"
    elif vs30 > 760:
        site_class = "B"
    elif vs30 > 360:
        site_class = "C"
    elif vs30 > 180:
        site_class = "D"
    else:
        site_class = "E"

    # Detect low-velocity zones (potential aquifer/fracture targets)
    low_vel_zones = []
    for i in range(1, len(vs_profile) - 1):
        d, v = vs_profile[i]
        _, v_above = vs_profile[i - 1]
        if v < v_above * 0.75 and d > 5:
            low_vel_zones.append({
                "depth_m": d,
                "vs_ms": v,
                "velocity_contrast": round(v / v_above, 2),
                "aquifer_indicator": "Possible saturated/fractured zone",
            })

    return MASWResult(
        vs_profile=vs_profile,
        vs30=round(vs30, 0),
        site_class=site_class,
        low_velocity_zones=low_vel_zones,
    )


def _estimate_lithology_from_vp(vp: float) -> str:
    """Estimate lithology from P-wave velocity (Telford et al. 1990)."""
    if vp < 300:
        return "Dry loose soil/fill"
    elif vp < 600:
        return "Weathered soil/clay"
    elif vp < 1200:
        return "Weathered/fractured rock or saturated sand"
    elif vp < 2000:
        return "Saturated alluvium or soft rock"
    elif vp < 3500:
        return "Competent sedimentary rock"
    elif vp < 5000:
        return "Metamorphic/igneous rock"
    else:
        return "Fresh crystalline basement"
