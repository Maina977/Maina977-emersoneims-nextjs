"""High-rise dynamics — areas where Revit needs Robot/ETABS to compete.

Implements the analyses that distinguish tall-building design from
low-rise residential work:

1. **P-Delta amplification** (ASCE 7-22 §12.8.7).
2. **Modal Response Spectrum analysis** of a lumped-mass shear building
   — generalised Jacobi eigensolver, no SciPy dependency.
3. **Along-wind dynamic response** — gust effect factor G_f
   (ASCE 7-22 §26.11) for flexible structures (n1 < 1 Hz).
4. **Across-wind / vortex-shedding** — Strouhal-based critical wind
   speed and resonance check (EN 1991-1-4 Annex E).
5. **Occupant comfort accelerations** — peak across-wind acceleration vs
   ISO 10137 Annex D residential / office criteria.

References
----------
- ASCE 7-22 Minimum Design Loads and Associated Criteria for Buildings
- EN 1991-1-4:2005 + A1 — Wind actions, esp. Annex B & E
- ISO 10137:2007 — Bases for design of structures — Serviceability against
  vibrations
- Smith & Coull (1991), Tall Building Structures: Analysis & Design

This module is pure Python: standard library only.
"""

from __future__ import annotations

import math
from typing import Any

from eims_modules import logger


# ============================================================================
# 1. P-Delta amplification (ASCE 7-22 §12.8.7)
# ============================================================================

def p_delta_amplifier(*, P_x_kN: float, delta_x_m: float, V_x_kN: float,
                      h_sx_m: float, Cd: float, Ie: float = 1.0,
                      theta_max: float = 0.25) -> dict[str, Any]:
    """Compute the P-Delta stability coefficient θ and amplification factor.

    θ = P_x · δ_x · I_e / (V_x · h_sx · C_d)              (Eq. 12.8-16)

    If θ > θ_max → structure unstable, redesign required.
    If θ ≤ 0.10 → P-Δ effects may be neglected.
    Else        → multiply storey forces, drifts, and member forces by
                  amplifier a_d = 1 / (1 - θ).
    """
    if min(P_x_kN, delta_x_m, V_x_kN, h_sx_m, Cd, Ie) <= 0:
        return {'success': False, 'error': 'all inputs must be positive'}
    theta = (P_x_kN * delta_x_m * Ie) / (V_x_kN * h_sx_m * Cd)
    unstable = theta > theta_max
    negligible = theta <= 0.10
    amplifier = 1.0 / (1.0 - theta) if (theta < 1.0 and not unstable) else float('inf')
    return {
        'success': True,
        'code': 'ASCE 7-22 §12.8.7',
        'theta': round(theta, 4),
        'theta_max_allowed': theta_max,
        'amplifier_ad': round(amplifier, 4) if math.isfinite(amplifier) else None,
        'p_delta_negligible': negligible,
        'p_delta_required': not negligible and not unstable,
        'structure_unstable': unstable,
        'note': ('Negligible — ignore P-Δ' if negligible else
                 ('UNSTABLE — redesign / increase stiffness' if unstable else
                  'Amplify storey forces and drifts by a_d')),
    }


# ============================================================================
# 2. Modal eigensolution for lumped-mass shear building
# ============================================================================

def _eigh_jacobi(K: list[list[float]], M: list[list[float]],
                 max_iter: int = 200, tol: float = 1e-9) -> tuple[list[float], list[list[float]]]:
    """Generalised eigenproblem K·φ = ω² M·φ for symmetric K and diagonal M.

    Solves M⁻¹·K via the cyclic Jacobi method; returns (eigenvalues_sorted,
    eigenvectors_columns). For the shear-building model M is diagonal so
    M⁻¹·K is straightforward.
    """
    n = len(K)
    # A = M^{-1/2} K M^{-1/2}  to keep it symmetric
    inv_sqrt_m = [1.0 / math.sqrt(M[i][i]) for i in range(n)]
    A = [[K[i][j] * inv_sqrt_m[i] * inv_sqrt_m[j] for j in range(n)] for i in range(n)]
    V = [[1.0 if i == j else 0.0 for j in range(n)] for i in range(n)]
    for _ in range(max_iter):
        # find largest off-diagonal
        p = q = 0; maxv = 0.0
        for i in range(n):
            for j in range(i + 1, n):
                if abs(A[i][j]) > maxv:
                    maxv = abs(A[i][j]); p, q = i, j
        if maxv < tol:
            break
        if abs(A[p][p] - A[q][q]) < 1e-30:
            theta = math.pi / 4
        else:
            theta = 0.5 * math.atan2(2 * A[p][q], A[p][p] - A[q][q])
        c = math.cos(theta); s = math.sin(theta)
        # Rotate
        for i in range(n):
            aip, aiq = A[i][p], A[i][q]
            A[i][p] = c * aip + s * aiq
            A[i][q] = -s * aip + c * aiq
        for j in range(n):
            apj, aqj = A[p][j], A[q][j]
            A[p][j] = c * apj + s * aqj
            A[q][j] = -s * apj + c * aqj
        for i in range(n):
            vip, viq = V[i][p], V[i][q]
            V[i][p] = c * vip + s * viq
            V[i][q] = -s * vip + c * viq
    eigvals = [A[i][i] for i in range(n)]
    # Convert eigenvectors back: φ = M^{-1/2} y
    eigvecs = [[V[i][j] * inv_sqrt_m[i] for j in range(n)] for i in range(n)]
    # Sort ascending
    order = sorted(range(n), key=lambda i: eigvals[i])
    eigvals = [eigvals[i] for i in order]
    eigvecs = [[eigvecs[r][order[c]] for c in range(n)] for r in range(n)]
    return eigvals, eigvecs


def modal_response_spectrum(*, story_masses_t: list[float],
                            story_stiffness_kNpm: list[float],
                            spectrum: list[tuple[float, float]],
                            damping_pct: float = 5.0,
                            num_modes: int | None = None) -> dict[str, Any]:
    """Modal Response Spectrum Analysis of a lumped-mass shear building.

    Each story has mass m_i (tonnes) and lateral stiffness k_i (kN/m) connecting
    it to the story below. The base is fixed.

    `spectrum` is a list of (period_s, Sa_g) pairs from ASCE 7 / EN 1998
    design response spectrum. Sa is interpolated linearly (clamped at ends).

    Combines modal responses with SRSS — appropriate when modal periods
    differ by ≥10 %.
    """
    n = len(story_masses_t)
    if n < 1 or len(story_stiffness_kNpm) != n:
        return {'success': False,
                'error': 'story_masses_t and story_stiffness_kNpm must be same non-zero length'}
    if any(m <= 0 for m in story_masses_t) or any(k <= 0 for k in story_stiffness_kNpm):
        return {'success': False, 'error': 'all masses and stiffnesses must be positive'}

    g = 9.81
    # Mass matrix (diagonal, tonnes -> kg by *1000 not needed if k in kN/m and Sa in g — keep tonnes & kN consistent)
    M = [[(story_masses_t[i] if i == j else 0.0) for j in range(n)] for i in range(n)]
    # Tridiagonal stiffness: K[i,i]=k_i+k_{i+1}, K[i,i+1]=K[i+1,i]=-k_{i+1}
    k = list(story_stiffness_kNpm)
    K = [[0.0] * n for _ in range(n)]
    for i in range(n):
        K[i][i] = k[i] + (k[i + 1] if i + 1 < n else 0.0)
        if i + 1 < n:
            K[i][i + 1] = -k[i + 1]
            K[i + 1][i] = -k[i + 1]

    eigvals, eigvecs = _eigh_jacobi(K, M)
    # ω² = eigval (rad²/s²); k in kN/m, M in tonnes → k/M units = kN/(m·t) = (kN·s²)/(t·m) = m/s²·... → check
    # 1 kN / 1 t = 1000 N / 1000 kg = 1 m/s². So k(kN/m)/M(t) has units 1/s². ✓
    omegas = [math.sqrt(max(ev, 0.0)) for ev in eigvals]
    periods = [(2 * math.pi / w) if w > 0 else float('inf') for w in omegas]

    # Modal participation factors and masses
    one = [1.0] * n
    modes = []
    nmodes = num_modes or n
    nmodes = max(1, min(nmodes, n))

    # Pre-compute Sa interpolator
    spec = sorted(spectrum, key=lambda t: t[0])

    def Sa_g(T):
        if not spec: return 0.0
        if T <= spec[0][0]: return spec[0][1]
        if T >= spec[-1][0]: return spec[-1][1]
        for i in range(len(spec) - 1):
            t0, s0 = spec[i]; t1, s1 = spec[i + 1]
            if t0 <= T <= t1:
                frac = (T - t0) / (t1 - t0) if t1 > t0 else 0
                return s0 + frac * (s1 - s0)
        return spec[-1][1]

    cumulative_mass_pct = 0.0
    total_mass = sum(story_masses_t)

    story_shears = [0.0] * n  # SRSS shear envelope per story
    story_forces_modes: list[list[float]] = []

    for mi in range(nmodes):
        phi = [eigvecs[i][mi] for i in range(n)]
        # Normalise so phi^T M phi = 1
        norm = math.sqrt(sum(M[i][i] * phi[i] ** 2 for i in range(n)))
        if norm == 0: continue
        phi = [p / norm for p in phi]
        Gamma = sum(M[i][i] * phi[i] * 1.0 for i in range(n))   # phi^T M one (since normalised)
        M_eff = Gamma ** 2     # effective modal mass (tonnes)
        cumulative_mass_pct += 100 * M_eff / total_mass

        Sa = Sa_g(periods[mi]) * g  # m/s²
        # Modal response: storey displacement uᵢ = Γ φᵢ (Sa/ω²) ... here we want forces
        # Modal storey force: f_i = Γ · M_i · φᵢ · Sa
        f_modal = [Gamma * M[i][i] * phi[i] * Sa for i in range(n)]
        story_forces_modes.append(f_modal)
        # Storey shear at level i = sum of forces above i (including i)
        v_modal = [sum(f_modal[j] for j in range(i, n)) for i in range(n)]
        for i in range(n):
            story_shears[i] = math.hypot(story_shears[i], v_modal[i])  # SRSS

        modes.append({
            'mode': mi + 1,
            'period_s': round(periods[mi], 4),
            'frequency_hz': round(1 / periods[mi] if periods[mi] > 0 else 0, 4),
            'participation_factor': round(Gamma, 4),
            'effective_modal_mass_t': round(M_eff, 4),
            'effective_mass_pct': round(100 * M_eff / total_mass, 2),
            'cumulative_mass_pct': round(cumulative_mass_pct, 2),
            'Sa_g': round(Sa / g, 4),
            'shape': [round(p, 4) for p in phi],
        })

    base_shear_kN = story_shears[0]  # total at ground level
    return {
        'success': True,
        'method': 'Modal Response Spectrum (SRSS)',
        'standards': ['ASCE 7-22 §12.9', 'EN 1998-1 §4.3.3.3'],
        'damping_pct': damping_pct,
        'modes_returned': len(modes),
        'cumulative_mass_pct': round(cumulative_mass_pct, 2),
        'modes': modes,
        'base_shear_kN_srss': round(base_shear_kN, 2),
        'story_shear_envelope_kN': [round(s, 2) for s in story_shears],
        'note': ('Cumulative modal mass < 90 % — include more modes' if cumulative_mass_pct < 90
                 else 'Modal mass ≥ 90 % — adequate per ASCE 7 §12.9.1.1'),
    }


# ============================================================================
# 3. Along-wind dynamic response — gust effect factor G_f
#    ASCE 7-22 §26.11.5 (flexible structures)
# ============================================================================

def gust_effect_factor_flexible(*, V_mps: float, height_m: float,
                                width_m: float, depth_m: float,
                                n1_hz: float, beta_damping: float = 0.01,
                                exposure: str = 'B',
                                I_z_bar: float | None = None) -> dict[str, Any]:
    """Compute G_f for a slender / flexible building (n1 < 1 Hz).

    Implements the simplified version of ASCE 7-22 Eq. 26.11-10. For full
    rigour the user should supply turbulence intensity I_z̄; otherwise it
    is estimated from exposure category.
    """
    if min(V_mps, height_m, width_m, depth_m, n1_hz) <= 0:
        return {'success': False, 'error': 'all dimensional inputs must be positive'}
    if not 0 < beta_damping < 0.2:
        return {'success': False, 'error': 'beta_damping must be 0 < β < 0.2'}

    # Equivalent height z̄ = 0.6 h, but ≥ z_min
    z_min = {'B': 9.14, 'C': 4.57, 'D': 2.13}.get(exposure, 9.14)  # m
    z_bar = max(0.6 * height_m, z_min)

    # Turbulence intensity (Eq. 26.11-7)
    c_table = {'B': 0.30, 'C': 0.20, 'D': 0.15}
    c = c_table.get(exposure, 0.30)
    Iz = float(I_z_bar) if I_z_bar else c * (10.0 / z_bar) ** (1 / 6)

    # Integral length scale L_z̄ (Eq. 26.11-9)
    l_table = {'B': 97.54, 'C': 152.4, 'D': 198.12}
    epsilon_table = {'B': 1/3.0, 'C': 1/5.0, 'D': 1/8.0}
    l_z = l_table.get(exposure, 97.54)
    eps = epsilon_table.get(exposure, 1/3.0)
    Lz = l_z * (z_bar / 10.0) ** eps

    # Background response factor Q
    Q = math.sqrt(1.0 / (1.0 + 0.63 * ((width_m + height_m) / Lz) ** 0.63))

    # Reduced frequency N1 = n1 · L_z / V_z̄
    # V_z̄ = b̄ (z̄/10)^ᾱ V — use simplified V_z̄ = V·(z̄/10)^(1/α_table)
    alpha_table = {'B': 1/4.0, 'C': 1/6.5, 'D': 1/9.0}
    a = alpha_table.get(exposure, 1/4.0)
    V_z = V_mps * (z_bar / 10.0) ** a
    N1 = n1_hz * Lz / V_z if V_z > 0 else 0
    Rn = (7.47 * N1) / ((1 + 10.3 * N1) ** (5/3))

    # Aerodynamic admittance functions (Eq. 26.11-13 to -16)
    def Rl(eta):
        if eta == 0: return 1.0
        return (1.0 / eta) - (1 - math.exp(-2 * eta)) / (2 * eta * eta)

    eta_h = 4.6 * n1_hz * height_m / V_z if V_z > 0 else 0
    eta_b = 4.6 * n1_hz * width_m / V_z if V_z > 0 else 0
    eta_d = 15.4 * n1_hz * depth_m / V_z if V_z > 0 else 0
    Rh = Rl(eta_h); Rb = Rl(eta_b); Rd = Rl(eta_d)
    R = math.sqrt((1 / beta_damping) * Rn * Rh * Rb * (0.53 + 0.47 * Rd))

    # Peak factors gQ, gv
    gQ = gv = 3.4
    gR = math.sqrt(2 * math.log(3600 * n1_hz)) + 0.5772 / math.sqrt(2 * math.log(3600 * n1_hz)) if n1_hz > 0 else 3.4

    Gf = 0.925 * (1 + 1.7 * Iz * math.sqrt(gQ ** 2 * Q ** 2 + gR ** 2 * R ** 2)) / (1 + 1.7 * gv * Iz)

    flexible = n1_hz < 1.0
    return {
        'success': True,
        'code': 'ASCE 7-22 §26.11',
        'flexible_per_code': flexible,
        'inputs': {'V_mps': V_mps, 'height_m': height_m, 'width_m': width_m,
                   'depth_m': depth_m, 'n1_hz': n1_hz, 'beta_damping': beta_damping,
                   'exposure': exposure},
        'intermediate': {
            'z_bar_m': round(z_bar, 2), 'I_zbar': round(Iz, 4),
            'L_zbar_m': round(Lz, 2), 'V_zbar_mps': round(V_z, 3),
            'Q': round(Q, 4), 'Rn': round(Rn, 4),
            'Rh': round(Rh, 4), 'Rb': round(Rb, 4), 'Rd': round(Rd, 4),
            'R': round(R, 4), 'gQ': gQ, 'gv': gv, 'gR': round(gR, 4),
        },
        'gust_effect_factor_Gf': round(Gf, 4),
        'note': ('Use Gf in main wind-force-resisting design' if flexible else
                 'Building rigid (n1 ≥ 1 Hz) — use G = 0.85 simplified'),
    }


# ============================================================================
# 4. Vortex shedding / across-wind — EN 1991-1-4 Annex E (simplified)
# ============================================================================

def vortex_shedding_check(*, V_mean_mps: float, b_m: float,
                          n1_hz: float, shape: str = 'rectangular',
                          height_m: float = 0.0) -> dict[str, Any]:
    """Critical wind velocity v_crit for vortex resonance and lock-in check.

    St (Strouhal) defaults: 0.12 rectangular, 0.18 circular cylinder.
    v_crit = b · n1 / St          (Eq. E.1)
    Resonance considered when 0.83·v_mean ≤ v_crit ≤ 1.25·v_mean (§E.1.3.2).
    """
    if min(V_mean_mps, b_m, n1_hz) <= 0:
        return {'success': False, 'error': 'V_mean_mps, b_m, n1_hz must all be > 0'}
    St = {'rectangular': 0.12, 'circular': 0.18, 'square': 0.12}.get(shape, 0.12)
    v_crit = b_m * n1_hz / St
    in_lockin = 0.83 * V_mean_mps <= v_crit <= 1.25 * V_mean_mps
    Re = (V_mean_mps * b_m) / 1.5e-5  # ν_air ~1.5e-5 m²/s at 20 °C
    return {
        'success': True,
        'code': 'EN 1991-1-4 Annex E',
        'inputs': {'V_mean_mps': V_mean_mps, 'b_m': b_m, 'n1_hz': n1_hz,
                   'shape': shape, 'height_m': height_m},
        'St': St,
        'v_crit_mps': round(v_crit, 3),
        'reynolds_number': round(Re, 0),
        'lock_in_likely': in_lockin,
        'note': ('LOCK-IN RISK — provide damping or aerodynamic modification'
                 if in_lockin else 'No resonance — vortex shedding controlled'),
    }


# ============================================================================
# 5. Occupant comfort — peak across-wind acceleration vs ISO 10137
# ============================================================================

# ISO 10137 Annex D limits (10-year return) — peak acceleration in milli-g
ISO_10137_LIMITS_MILLIG = {
    'office':       18.0,   # ~0.018 g
    'residential':  10.0,   # ~0.010 g
    'hotel':        12.0,
}


def occupant_comfort(*, peak_accel_mps2: float, occupancy: str = 'office',
                     return_period_yr: int = 10) -> dict[str, Any]:
    """Compare peak across-wind acceleration to ISO 10137 perception threshold."""
    if peak_accel_mps2 < 0:
        return {'success': False, 'error': 'peak_accel must be non-negative'}
    occ = occupancy.lower().strip()
    limit_milli_g = ISO_10137_LIMITS_MILLIG.get(occ, 18.0)
    accel_milli_g = peak_accel_mps2 / 9.81 * 1000
    return {
        'success': True,
        'code': 'ISO 10137:2007 Annex D',
        'inputs': {'peak_accel_mps2': peak_accel_mps2,
                   'occupancy': occ, 'return_period_yr': return_period_yr},
        'peak_accel_milli_g': round(accel_milli_g, 2),
        'limit_milli_g': limit_milli_g,
        'pass': accel_milli_g <= limit_milli_g,
        'utilisation': round(accel_milli_g / limit_milli_g, 3),
        'note': ('Within comfort limit' if accel_milli_g <= limit_milli_g
                 else 'EXCEEDS comfort limit — consider TMD / increase damping'),
    }


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/highrise/p-delta', methods=['POST'])
    def _p_delta():
        d = request.get_json(silent=True) or {}
        try:
            r = p_delta_amplifier(
                P_x_kN=float(d.get('P_x_kN', 0)),
                delta_x_m=float(d.get('delta_x_m', 0)),
                V_x_kN=float(d.get('V_x_kN', 0)),
                h_sx_m=float(d.get('h_sx_m', 0)),
                Cd=float(d.get('Cd', 0)),
                Ie=float(d.get('Ie', 1.0)),
                theta_max=float(d.get('theta_max', 0.25)),
            )
        except (TypeError, ValueError) as ve:
            return jsonify({'success': False, 'error': str(ve)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    @app.route('/api/highrise/modal-rsa', methods=['POST'])
    def _modal_rsa():
        d = request.get_json(silent=True) or {}
        try:
            r = modal_response_spectrum(
                story_masses_t=[float(x) for x in (d.get('story_masses_t') or [])],
                story_stiffness_kNpm=[float(x) for x in (d.get('story_stiffness_kNpm') or [])],
                spectrum=[(float(t), float(s)) for t, s in (d.get('spectrum') or [])],
                damping_pct=float(d.get('damping_pct', 5.0)),
                num_modes=(int(d['num_modes']) if d.get('num_modes') else None),
            )
        except (TypeError, ValueError) as ve:
            return jsonify({'success': False, 'error': str(ve)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    @app.route('/api/highrise/wind/gust-flexible', methods=['POST'])
    def _gust_flex():
        d = request.get_json(silent=True) or {}
        try:
            r = gust_effect_factor_flexible(
                V_mps=float(d.get('V_mps', 0)),
                height_m=float(d.get('height_m', 0)),
                width_m=float(d.get('width_m', 0)),
                depth_m=float(d.get('depth_m', 0)),
                n1_hz=float(d.get('n1_hz', 0)),
                beta_damping=float(d.get('beta_damping', 0.01)),
                exposure=str(d.get('exposure', 'B')),
                I_z_bar=(float(d['I_z_bar']) if d.get('I_z_bar') else None),
            )
        except (TypeError, ValueError) as ve:
            return jsonify({'success': False, 'error': str(ve)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    @app.route('/api/highrise/wind/vortex', methods=['POST'])
    def _vortex():
        d = request.get_json(silent=True) or {}
        try:
            r = vortex_shedding_check(
                V_mean_mps=float(d.get('V_mean_mps', 0)),
                b_m=float(d.get('b_m', 0)),
                n1_hz=float(d.get('n1_hz', 0)),
                shape=str(d.get('shape', 'rectangular')),
                height_m=float(d.get('height_m', 0.0)),
            )
        except (TypeError, ValueError) as ve:
            return jsonify({'success': False, 'error': str(ve)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    @app.route('/api/highrise/comfort', methods=['POST'])
    def _comfort():
        d = request.get_json(silent=True) or {}
        try:
            r = occupant_comfort(
                peak_accel_mps2=float(d.get('peak_accel_mps2', 0)),
                occupancy=str(d.get('occupancy', 'office')),
                return_period_yr=int(d.get('return_period_yr', 10)),
            )
        except (TypeError, ValueError) as ve:
            return jsonify({'success': False, 'error': str(ve)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    logger.info('highrise module registered: /api/highrise/{p-delta,modal-rsa,wind/gust-flexible,wind/vortex,comfort}')
