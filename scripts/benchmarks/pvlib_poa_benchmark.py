"""Independent benchmark of lib/solar/poa.ts and the NOCT cell model with
pvlib-python (BSD-3). Writes tests/fixtures/pvlib-benchmark.json; the vitest
suite compares the TypeScript results with it, so CI needs no Python.

Run: <python with pvlib 0.16.1> scripts/benchmarks/pvlib_poa_benchmark.py

Two references per case:
  A. Same method, independent implementation: hourly GHI from the monthly
     daily total spread by extraterrestrial horizontal irradiance (as poa.ts),
     monthly Erbs diffuse fraction (Duffie & Beckman eq. 2.12.1), but solar
     position (NREL SPA), extraterrestrial irradiance, angle of incidence and
     isotropic transposition all from pvlib. Checks geometry and transposition.
  B. pvlib's hourly Erbs decomposition instead of the monthly correlation:
     a different model, reported as model uncertainty, not pass/fail.
Monthly GHI values are test inputs, not measured data.
"""
import json, pathlib
import numpy as np, pandas as pd, pvlib

MEAN_DAY = [17, 47, 75, 105, 135, 162, 198, 228, 258, 288, 318, 344]
GHI = [6.2, 6.6, 6.4, 5.6, 5.0, 4.6, 4.4, 4.7, 5.6, 5.8, 5.4, 5.8]  # kWh/m²/day, TEST INPUT
CASES = [
    {"name": "Nairobi, 10° north-facing", "lat": -1.2921, "lon": 36.8219, "tilt": 10, "az": 0},
    {"name": "Nairobi, 10° south-facing", "lat": -1.2921, "lon": 36.8219, "tilt": 10, "az": 180},
    {"name": "Garissa, 15° east-facing", "lat": -0.4532, "lon": 39.6461, "tilt": 15, "az": 90},
    {"name": "Lodwar, 10° south-facing", "lat": 3.1191, "lon": 35.5973, "tilt": 10, "az": 180},
    {"name": "Mombasa, 20° north-facing", "lat": -4.0435, "lon": 39.6682, "tilt": 20, "az": 0},
    {"name": "Geometry check 30° N, 30° south-facing", "lat": 30.0, "lon": 31.0, "tilt": 30, "az": 180},
    {"name": "Flat panel (tilt 0)", "lat": -1.2921, "lon": 36.8219, "tilt": 0, "az": 180},
]

def erbs_monthly(kt, ws_deg):
    if ws_deg <= 81.4:
        return 1.391 - 3.560 * kt + 4.189 * kt**2 - 2.137 * kt**3
    return 1.311 - 3.022 * kt + 3.427 * kt**2 - 1.821 * kt**3

def month(case, m, H, method):
    day = pd.Timestamp(2026, 1, 1) + pd.Timedelta(days=MEAN_DAY[m] - 1)
    times = pd.date_range(day, day + pd.Timedelta(hours=23, minutes=55), freq="5min", tz="UTC") \
        - pd.Timedelta(hours=case["lon"] / 15)  # solar-time-centred day
    sp = pvlib.solarposition.get_solarposition(times, case["lat"], case["lon"], method="nrel_numpy")
    dni_extra = pvlib.irradiance.get_extra_radiation(times)
    cz = np.cos(np.radians(sp["apparent_zenith"].clip(upper=90)))
    g0h = (dni_extra * cz).where(sp["apparent_zenith"] < 90, 0.0)
    h0 = g0h.sum() * 5 / 60 / 1000  # kWh/m²/day
    ghi = g0h / g0h.sum() * H * 1000 * 60 / 5  # W/m² per 5-min step, sums to H
    if method == "A":
        ws = np.degrees(np.arccos(np.clip(-np.tan(np.radians(case["lat"])) * np.tan(np.radians(pvlib.solarposition.declination_cooper69(MEAN_DAY[m]) * 180 / np.pi)), -1, 1)))
        kt = min(0.8, max(0.3, H / h0))
        fd = min(1, max(0, erbs_monthly(kt, ws)))
        dhi = ghi * fd
        dni = ((ghi - dhi) / cz.clip(lower=0.087)).where(sp["apparent_zenith"] < 90, 0.0)
    else:
        e = pvlib.irradiance.erbs(ghi, sp["apparent_zenith"], times)
        dhi, dni = e["dhi"], e["dni"]
    tot = pvlib.irradiance.get_total_irradiance(case["tilt"], case["az"], sp["apparent_zenith"], sp["azimuth"],
                                                dni, ghi, dhi, albedo=0.2, model="isotropic")
    return float(tot["poa_global"].fillna(0).sum() * 5 / 60 / 1000)

out = {"pvlib": pvlib.__version__, "ghiMonthly": GHI, "cases": [], "ross": []}
days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
for c in CASES:
    A = [month(c, m, GHI[m], "A") for m in range(12)]
    B = [month(c, m, GHI[m], "B") for m in range(12)]
    ann = lambda v: sum(x * d for x, d in zip(v, days)) / 365
    out["cases"].append({**c, "methodA_monthly": [round(x, 4) for x in A], "methodA_annual": round(ann(A), 4),
                         "methodB_monthly": [round(x, 4) for x in B], "methodB_annual": round(ann(B), 4)})
    print(f"{c['name']}: A {ann(A):.3f}  B {ann(B):.3f} kWh/m²/day")
for poa, tamb, noct in [(1000, 35, 45), (1000, 42, 45), (800, 25, 47), (1000, 28, 43)]:
    out["ross"].append({"poa": poa, "tAmb": tamb, "noct": noct, "tCell": float(pvlib.temperature.ross(poa, tamb, noct))})
path = pathlib.Path(__file__).resolve().parents[2] / "tests" / "fixtures" / "pvlib-benchmark.json"
path.parent.mkdir(parents=True, exist_ok=True)
path.write_text(json.dumps(out, indent=1))
print("wrote", path)
