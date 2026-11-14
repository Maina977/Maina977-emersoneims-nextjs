"""Independent benchmark for external/borehole-ai-engine/src/pumpTestAnalyzer.ts.
Writes tests/fixtures/pumptest-benchmark.json (CI needs no Python).

1. Theis well function W(u) = E1(u): scipy.special.exp1 (exact) on a grid.
2. Synthetic confined-aquifer pumping tests from TTim 0.8 (MIT, Bakker;
   Laplace-transform analytic elements), with KNOWN T and S, observed at a
   piezometer: the analyser must recover T and S.
Synthetic data are test inputs, not field measurements.
"""
import json, pathlib
import numpy as np
from scipy.special import exp1
import ttim

out = {"ttim": ttim.__version__, "wellFunction": [], "tests": []}
for u in [1e-6, 1e-4, 1e-3, 5e-3, 0.0099, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 3, 4, 5, 6]:
    out["wellFunction"].append({"u": u, "W": float(exp1(u))})

CASES = [
    {"name": "Basement aquifer, T 25 m²/d, S 1e-4", "T": 25.0, "S": 1e-4, "Q_m3h": 5.0, "r": 20.0},
    {"name": "Volcanic aquifer, T 150 m²/d, S 5e-4", "T": 150.0, "S": 5e-4, "Q_m3h": 15.0, "r": 40.0},
    {"name": "Sedimentary aquifer, T 400 m²/d, S 2e-4", "T": 400.0, "S": 2e-4, "Q_m3h": 30.0, "r": 60.0},
]
times_min = np.round(np.geomspace(1, 1440, 30), 3)
for c in CASES:
    H = 20.0  # aquifer thickness used only to express T and S as k and Ss
    ml = ttim.ModelMaq(kaq=[c["T"] / H], z=[H, 0], Saq=[c["S"] / H], tmin=1e-4, tmax=2, M=10)
    Q = c["Q_m3h"] * 24  # m³/day
    ttim.Well(ml, xw=0, yw=0, rw=0.1, tsandQ=[(0, Q)])
    ml.solve(silent=True)
    h = ml.head(c["r"], 0, times_min / 1440)[0]
    s = (-h).tolist()
    out["tests"].append({**c, "times_min": times_min.tolist(), "drawdown_m": [round(x, 5) for x in s]})
    print(c["name"], "s(1 d) =", round(s[-1], 3), "m")

p = pathlib.Path(__file__).resolve().parents[2] / "tests" / "fixtures" / "pumptest-benchmark.json"
p.parent.mkdir(parents=True, exist_ok=True)
p.write_text(json.dumps(out, indent=1))
print("wrote", p)
