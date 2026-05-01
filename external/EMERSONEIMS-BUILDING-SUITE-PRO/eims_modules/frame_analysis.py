"""2D plane-frame analysis by direct stiffness method.

A genuine matrix solver -- not a formula lookup. Each member has axial,
shear and bending stiffness; nodes have 3 DOF (u, v, theta). Supports
nodal point loads, member point loads (single, anywhere along span),
and uniformly distributed loads (UDL).

Validation references:
  * MacGuire, Gallagher, Ziemian -- Matrix Structural Analysis (2nd ed.)
  * BS EN 1993-1-1 §5 (general method); EN 1992-1-1 §5
  * Cook, Malkus, Plesha, Witt -- "Concepts and Applications of FEA" (4th ed.)

Endpoints:
  POST /api/eng/frame/analyze   -> nodal displacements + member forces
"""

from __future__ import annotations

import logging
import math
from typing import Any, Dict, List, Tuple

logger = logging.getLogger('eims.frame')

# ----------------------------------------------------------------------
# Tiny numpy-free linear algebra (Gauss elimination with partial pivot)
# ----------------------------------------------------------------------

def _solve(A: List[List[float]], b: List[float]) -> List[float]:
    n = len(b)
    # augmented
    M = [row[:] + [b[i]] for i, row in enumerate(A)]
    for k in range(n):
        # pivot
        pivot = max(range(k, n), key=lambda r: abs(M[r][k]))
        if abs(M[pivot][k]) < 1e-12:
            raise ValueError('singular stiffness matrix '
                              '(structure under-restrained or mechanism)')
        M[k], M[pivot] = M[pivot], M[k]
        for i in range(k + 1, n):
            f = M[i][k] / M[k][k]
            for j in range(k, n + 1):
                M[i][j] -= f * M[k][j]
    x = [0.0] * n
    for i in range(n - 1, -1, -1):
        s = M[i][n] - sum(M[i][j] * x[j] for j in range(i + 1, n))
        x[i] = s / M[i][i]
    return x


# ----------------------------------------------------------------------
# Element stiffness (frame: axial + bending), local frame
# ----------------------------------------------------------------------

def _local_k(E: float, A: float, I: float, L: float) -> List[List[float]]:
    """Local 6x6 stiffness for a 2D frame element (3 DOF per node)."""
    EA_L  = E * A / L
    EI_L  = E * I / L
    EI_L2 = EI_L / L
    EI_L3 = EI_L2 / L
    return [
        [ EA_L,        0,            0,         -EA_L,       0,            0          ],
        [ 0,          12*EI_L3,     6*EI_L2,    0,         -12*EI_L3,     6*EI_L2     ],
        [ 0,           6*EI_L2,     4*EI_L,     0,          -6*EI_L2,     2*EI_L      ],
        [-EA_L,        0,            0,          EA_L,        0,            0          ],
        [ 0,         -12*EI_L3,    -6*EI_L2,    0,          12*EI_L3,    -6*EI_L2     ],
        [ 0,           6*EI_L2,     2*EI_L,     0,          -6*EI_L2,     4*EI_L      ],
    ]


def _transform(angle_rad: float) -> List[List[float]]:
    c, s = math.cos(angle_rad), math.sin(angle_rad)
    T = [[0.0]*6 for _ in range(6)]
    T[0][0] =  c; T[0][1] =  s
    T[1][0] = -s; T[1][1] =  c
    T[2][2] =  1
    T[3][3] =  c; T[3][4] =  s
    T[4][3] = -s; T[4][4] =  c
    T[5][5] =  1
    return T


def _matmul(A: List[List[float]], B: List[List[float]]) -> List[List[float]]:
    n, m, p = len(A), len(B[0]), len(B)
    R = [[0.0]*m for _ in range(n)]
    for i in range(n):
        for j in range(m):
            R[i][j] = sum(A[i][k] * B[k][j] for k in range(p))
    return R


def _matvec(A: List[List[float]], x: List[float]) -> List[float]:
    return [sum(A[i][j] * x[j] for j in range(len(x))) for i in range(len(A))]


def _transpose(A: List[List[float]]) -> List[List[float]]:
    return [list(r) for r in zip(*A)]


# ----------------------------------------------------------------------
# Fixed-end forces for member loads (UDL only -- the common case)
# ----------------------------------------------------------------------

def _fef_udl(w: float, L: float) -> List[float]:
    """Fixed-end forces (acting ON the member from the supports) for a
    transverse UDL of intensity w (force/length, +y local) on a
    fixed-fixed beam, in LOCAL coordinates [Fxi, Fyi, Mi, Fxj, Fyj, Mj].

    For downward UDL (w < 0 in our +y-up convention), the fixed ends push
    the member UPWARD with magnitude |w|L/2, hence the leading minus sign.
    See McGuire, Gallagher & Ziemian (2nd ed.) Table 7.1.
    """
    return [0.0, -w*L/2.0, -w*L*L/12.0,
              0.0, -w*L/2.0,  w*L*L/12.0]


def analyze(*, nodes: List[Dict[str, Any]],
              members: List[Dict[str, Any]],
              supports: List[Dict[str, Any]],
              loads: List[Dict[str, Any]] = (),
              member_loads: List[Dict[str, Any]] = ()) -> Dict[str, Any]:
    """Solve a 2D frame by direct stiffness.

    nodes        : [{id, x, y}]                                (m)
    members      : [{id, i, j, E, A, I}]                       (Pa, m^2, m^4)
    supports     : [{node, ux, uy, rz}]   bools True=fixed
    loads        : [{node, Fx, Fy, Mz}]                        (N, N, N.m)
    member_loads : [{member, type:'UDL', w}]                   w in N/m (transverse, +y local)
    """
    # ---- index -----------------------------------------------------
    if not nodes or not members:
        return {'success': False, 'error': 'nodes and members required'}
    nid = {str(n['id']): k for k, n in enumerate(nodes)}
    nN, nDOF = len(nodes), 3 * len(nodes)
    coords = {str(n['id']): (float(n['x']), float(n['y'])) for n in nodes}

    K = [[0.0] * nDOF for _ in range(nDOF)]
    F = [0.0] * nDOF
    member_data = []

    # ---- assemble K and equivalent nodal loads ---------------------
    udls_by_member = {}
    for ml in (member_loads or []):
        if ml.get('type', 'UDL').upper() != 'UDL':
            return {'success': False,
                     'error': f'unsupported member load type: {ml.get("type")}'}
        udls_by_member[str(ml['member'])] = float(ml['w'])

    for m in members:
        i, j = str(m['i']), str(m['j'])
        if i not in nid or j not in nid:
            return {'success': False, 'error': f'member {m.get("id")} references unknown node'}
        xi, yi = coords[i]; xj, yj = coords[j]
        L = math.hypot(xj - xi, yj - yi)
        if L < 1e-9:
            return {'success': False, 'error': f'member {m.get("id")} has zero length'}
        ang = math.atan2(yj - yi, xj - xi)
        E, A, I = float(m['E']), float(m['A']), float(m['I'])
        kL = _local_k(E, A, I, L)
        T  = _transform(ang)
        Tt = _transpose(T)
        kG = _matmul(_matmul(Tt, kL), T)

        # DOF map
        dofs = [3*nid[i], 3*nid[i]+1, 3*nid[i]+2,
                 3*nid[j], 3*nid[j]+1, 3*nid[j]+2]
        for a in range(6):
            for b in range(6):
                K[dofs[a]][dofs[b]] += kG[a][b]

        # Member loads -> equivalent nodal forces
        w = udls_by_member.get(str(m['id']), 0.0)
        feL = _fef_udl(w, L) if w != 0.0 else [0.0]*6
        # Note: convention: applied loads = -fef on the structure
        feG = _matvec(Tt, feL)
        for a in range(6):
            F[dofs[a]] -= feG[a]

        member_data.append({'id': str(m['id']), 'i': i, 'j': j,
                              'L_m': L, 'angle_rad': ang,
                              'E': E, 'A': A, 'I': I,
                              'kL': kL, 'T': T, 'fef_local': feL,
                              'dofs': dofs})

    # ---- nodal loads ----------------------------------------------
    for ld in (loads or []):
        n = str(ld['node'])
        if n not in nid:
            return {'success': False, 'error': f'load on unknown node {n!r}'}
        b = 3 * nid[n]
        F[b]   += float(ld.get('Fx', 0.0))
        F[b+1] += float(ld.get('Fy', 0.0))
        F[b+2] += float(ld.get('Mz', 0.0))

    # ---- supports: penalty-free reduction ---------------------------
    fixed_dofs = set()
    for s in (supports or []):
        n = str(s['node'])
        if n not in nid:
            return {'success': False, 'error': f'support on unknown node {n!r}'}
        b = 3 * nid[n]
        if s.get('ux'): fixed_dofs.add(b)
        if s.get('uy'): fixed_dofs.add(b+1)
        if s.get('rz'): fixed_dofs.add(b+2)
    if not fixed_dofs:
        return {'success': False, 'error': 'no supports defined -- structure is a mechanism'}

    free = [d for d in range(nDOF) if d not in fixed_dofs]
    Kff = [[K[i][j] for j in free] for i in free]
    Ff  = [F[i] for i in free]

    try:
        Uf = _solve(Kff, Ff)
    except ValueError as e:
        return {'success': False, 'error': str(e)}

    U = [0.0] * nDOF
    for k, d in enumerate(free):
        U[d] = Uf[k]

    # ---- reactions = K @ U - F (for fixed DOFs) -------------------
    R: Dict[str, Dict[str, float]] = {}
    KU = _matvec(K, U)
    for n_id, idx in nid.items():
        b = 3 * idx
        if (b in fixed_dofs) or (b+1 in fixed_dofs) or (b+2 in fixed_dofs):
            R[n_id] = {
                'Rx_kN': round((KU[b]   - F[b])   / 1e3, 4) if b   in fixed_dofs else None,
                'Ry_kN': round((KU[b+1] - F[b+1]) / 1e3, 4) if b+1 in fixed_dofs else None,
                'Mz_kNm': round((KU[b+2] - F[b+2]) / 1e3, 4) if b+2 in fixed_dofs else None,
            }

    # ---- nodal displacements --------------------------------------
    disp_out = {}
    for n_id, idx in nid.items():
        b = 3 * idx
        disp_out[n_id] = {'ux_mm':  round(U[b]   * 1e3, 4),
                            'uy_mm':  round(U[b+1] * 1e3, 4),
                            'rz_rad': round(U[b+2],          6)}

    # ---- member end forces: fL = kL * T * uG - fefL ---------------
    member_out = []
    for md in member_data:
        uG = [U[d] for d in md['dofs']]
        uL = _matvec(md['T'], uG)
        fL = _matvec(md['kL'], uL)
        # subtract fixed-end forces -> residual member end forces from loads
        fL = [fL[k] - md['fef_local'][k] for k in range(6)]
        member_out.append({
            'id': md['id'], 'L_m': round(md['L_m'], 4),
            'angle_deg': round(math.degrees(md['angle_rad']), 3),
            'end_i': {'N_kN': round( fL[0]/1e3, 4),
                       'V_kN': round( fL[1]/1e3, 4),
                       'M_kNm': round( fL[2]/1e3, 4)},
            'end_j': {'N_kN': round( fL[3]/1e3, 4),
                       'V_kN': round( fL[4]/1e3, 4),
                       'M_kNm': round( fL[5]/1e3, 4)},
        })

    return {
        'success': True,
        'standard': '2D plane frame, direct stiffness (matrix) method',
        'reference': 'McGuire, Gallagher, Ziemian (2000); Cook et al. (2002)',
        'sign_convention': {
            'global':   '+x right, +y up, +Mz CCW, +ve rotation CCW',
            'member':   '+N tension, +V follows local +y, +M sags local +y up',
        },
        'dof_count': nDOF,
        'fixed_dof_count': len(fixed_dofs),
        'displacements': disp_out,
        'reactions':     R,
        'members':       member_out,
        'disclaimer':    'Linear elastic small-displacement analysis. '
                          'No P-delta, plastic hinge, dynamic or buckling '
                          'effects. Verify against an independent FEA package '
                          'for production design. Inputs in SI (Pa, m, N).',
    }


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/eng/frame/analyze', methods=['POST'])
    def _frame():
        d = request.get_json(silent=True) or {}
        try:
            r = analyze(
                nodes=d.get('nodes') or [],
                members=d.get('members') or [],
                supports=d.get('supports') or [],
                loads=d.get('loads') or [],
                member_loads=d.get('member_loads') or [],
            )
        except (TypeError, ValueError, KeyError) as e:
            return jsonify({'success': False, 'error': str(e)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    logger.info('2D frame analysis module registered (/api/eng/frame/analyze)')
