"""
Ground Penetrating Radar (GPR) Processing Module

Processes GPR radargram data for subsurface characterization:
- Time-to-depth conversion using dielectric properties
- Water table reflection detection
- Clay layer identification from signal attenuation
- Void/cavity detection from hyperbolic reflections
- Shallow aquifer delineation

References:
  - Annan (2005) GPR: Principles, Procedures & Applications
  - Daniels (2004) Ground Penetrating Radar (IEE)
  - Bano (2006) Dielectric permittivity in near-surface GPR
"""

import numpy as np
from typing import List, Optional, Tuple
from dataclasses import dataclass, field


@dataclass
class GPRReflector:
    """A detected subsurface reflector."""
    depth_m: float
    twt_ns: float  # Two-way travel time
    amplitude: float
    continuity: float  # 0-1, how continuous across profile
    interpretation: str = ""
    is_water_table: bool = False
    is_clay_boundary: bool = False


@dataclass
class GPRResult:
    """Result of GPR data processing."""
    reflectors: List[GPRReflector]
    water_table_depth_m: Optional[float] = None
    clay_layer_depth_m: Optional[float] = None
    void_detected: bool = False
    void_depth_m: Optional[float] = None
    max_penetration_m: float = 0.0
    dielectric_constant: float = 9.0
    velocity_m_ns: float = 0.1
    antenna_freq_mhz: float = 100.0
    profile_length_m: float = 0.0
    methodology: str = ""


def estimate_dielectric(soil_type: str, moisture_pct: float = 15) -> Tuple[float, float]:
    """
    Estimate dielectric constant and EM velocity from soil type.

    Uses Topp equation (1980) for moisture dependence:
        ε = 3.03 + 9.3θ + 146θ² - 76.7θ³

    Args:
        soil_type: Soil classification string
        moisture_pct: Volumetric water content (%)

    Returns:
        (dielectric_constant, velocity_m_ns)
    """
    theta = moisture_pct / 100.0
    # Topp equation
    epsilon_topp = 3.03 + 9.3 * theta + 146.0 * theta ** 2 - 76.7 * theta ** 3

    # Base dielectric by material (Daniels 2004)
    base_epsilon = {
        "sand": 4.0, "dry_sand": 3.5, "wet_sand": 25.0,
        "clay": 8.0, "wet_clay": 30.0,
        "silt": 6.0, "loam": 8.0,
        "gravel": 5.0, "rock": 6.0,
        "fresh_water": 81.0, "ice": 3.2,
        "air": 1.0, "concrete": 8.0,
    }.get(soil_type.lower(), epsilon_topp)

    # Blend base with Topp estimate
    epsilon = (base_epsilon + epsilon_topp) / 2

    # Velocity: v = c / sqrt(ε)
    c_m_ns = 0.2998  # Speed of light in m/ns
    velocity = c_m_ns / np.sqrt(epsilon)

    return float(epsilon), float(velocity)


def time_to_depth(twt_ns: float, velocity_m_ns: float) -> float:
    """Convert two-way travel time (ns) to depth (m)."""
    return twt_ns * velocity_m_ns / 2.0


def process_radargram(
    data: np.ndarray,
    dt_ns: float,
    antenna_freq_mhz: float,
    soil_type: str = "loam",
    moisture_pct: float = 15,
    profile_length_m: float = 100,
) -> GPRResult:
    """
    Process GPR radargram to extract subsurface features.

    Pipeline:
    1. DC removal (dewow)
    2. Time gain (AGC or SEC)
    3. Background subtraction
    4. Envelope detection (Hilbert transform)
    5. Reflector picking
    6. Water table + clay boundary identification

    Args:
        data: 2D array (n_traces, n_samples) of radargram amplitudes
        dt_ns: Time sample interval in nanoseconds
        antenna_freq_mhz: Antenna center frequency in MHz
        soil_type: Surface soil type
        moisture_pct: Estimated volumetric moisture (%)
        profile_length_m: GPR line length in meters
    """
    n_traces, n_samples = data.shape
    epsilon, velocity = estimate_dielectric(soil_type, moisture_pct)

    # 1. DC removal (dewow) — subtract running mean
    window = max(3, int(n_samples * 0.1))
    processed = np.zeros_like(data, dtype=float)
    for i in range(n_traces):
        running_mean = np.convolve(data[i], np.ones(window) / window, mode="same")
        processed[i] = data[i].astype(float) - running_mean

    # 2. Time gain — compensate for geometric spreading and attenuation
    time_axis = np.arange(n_samples) * dt_ns
    gain = 1.0 + 0.5 * (time_axis / max(time_axis[-1], 1)) ** 1.5
    processed *= gain[np.newaxis, :]

    # 3. Background subtraction — remove horizontal noise
    mean_trace = np.mean(processed, axis=0)
    processed -= mean_trace[np.newaxis, :]

    # 4. Envelope detection using Hilbert transform
    from scipy.signal import hilbert
    envelope = np.abs(hilbert(processed, axis=1))

    # 5. Pick reflectors — find strong horizontal events
    # Average amplitude at each time sample across all traces
    avg_amplitude = np.mean(envelope, axis=0)
    max_amp = np.max(avg_amplitude) if np.max(avg_amplitude) > 0 else 1

    # Find peaks in average amplitude
    from scipy.signal import find_peaks
    peaks, properties = find_peaks(
        avg_amplitude / max_amp,
        height=0.15,
        distance=int(5 / dt_ns),  # Minimum 5ns separation
        prominence=0.1,
    )

    reflectors: List[GPRReflector] = []
    for pk in peaks:
        twt = pk * dt_ns
        depth = time_to_depth(twt, velocity)

        # Measure continuity: fraction of traces where this reflector appears
        time_window = max(1, int(2 / dt_ns))
        peak_amplitudes = envelope[:, max(0, pk - time_window):min(n_samples, pk + time_window + 1)].max(axis=1)
        continuity = float(np.mean(peak_amplitudes > 0.3 * max_amp))

        reflectors.append(GPRReflector(
            depth_m=round(depth, 2),
            twt_ns=round(twt, 1),
            amplitude=round(float(avg_amplitude[pk] / max_amp), 3),
            continuity=round(continuity, 2),
        ))

    # Sort by depth
    reflectors.sort(key=lambda r: r.depth_m)

    # 6. Identify water table: strongest continuous shallow reflector
    water_table_depth = None
    for r in reflectors:
        if r.continuity > 0.5 and r.amplitude > 0.3 and 1 < r.depth_m < 30:
            r.is_water_table = True
            r.interpretation = "Water table reflection"
            water_table_depth = r.depth_m
            break

    # 7. Identify clay boundary: strong reflector with high signal attenuation below
    clay_depth = None
    for r in reflectors:
        if r.is_water_table:
            continue
        if r.continuity > 0.4 and r.amplitude > 0.25:
            # Check if signal attenuates strongly below this reflector
            pk_sample = int(r.twt_ns / dt_ns)
            below_energy = np.mean(envelope[:, pk_sample:]) if pk_sample < n_samples else 0
            above_energy = np.mean(envelope[:, :pk_sample]) if pk_sample > 0 else 1
            if above_energy > 0 and below_energy / above_energy < 0.3:
                r.is_clay_boundary = True
                r.interpretation = "Clay layer boundary (high attenuation below)"
                clay_depth = r.depth_m
                break

    # 8. Detect voids: hyperbolic reflections (high amplitude, low continuity)
    void_detected = False
    void_depth = None
    for r in reflectors:
        if r.continuity < 0.3 and r.amplitude > 0.5:
            r.interpretation = "Possible void/cavity (hyperbolic reflection)"
            void_detected = True
            void_depth = r.depth_m
            break

    # Maximum penetration depth
    # Find depth where signal drops below noise floor
    noise_floor = np.percentile(envelope, 10)
    last_signal_sample = n_samples - 1
    for s in range(n_samples - 1, 0, -1):
        if np.mean(envelope[:, s]) > noise_floor * 2:
            last_signal_sample = s
            break
    max_penetration = time_to_depth(last_signal_sample * dt_ns, velocity)

    # Label remaining reflectors
    for r in reflectors:
        if not r.interpretation:
            if r.depth_m < 3:
                r.interpretation = "Shallow soil interface"
            elif r.depth_m > max_penetration * 0.8:
                r.interpretation = "Deep reflector (near penetration limit)"
            else:
                r.interpretation = "Subsurface interface"

    return GPRResult(
        reflectors=reflectors,
        water_table_depth_m=round(water_table_depth, 2) if water_table_depth else None,
        clay_layer_depth_m=round(clay_depth, 2) if clay_depth else None,
        void_detected=void_detected,
        void_depth_m=round(void_depth, 2) if void_depth else None,
        max_penetration_m=round(max_penetration, 1),
        dielectric_constant=round(epsilon, 1),
        velocity_m_ns=round(velocity, 4),
        antenna_freq_mhz=antenna_freq_mhz,
        profile_length_m=profile_length_m,
        methodology="Dewow → Time gain → Background subtraction → Hilbert envelope → Peak picking → Classification. Dielectric from Topp (1980).",
    )
