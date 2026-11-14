"""Independent benchmark for lib/solar/design/production.ts with pvlib 0.16.1:
the same mean-day 10-minute POA steps (computed here independently, as in
pvlib_poa_benchmark method A), then pvlib.temperature.ross,
pvlib.pvsystem.pvwatts_dc, pvlib.pvsystem.pvwatts_losses and
pvlib.inverter.pvwatts. Writes tests/fixtures/pvlib-production.json.
Inputs are test values, not measured site data."""
import json, pathlib
import numpy as np, pandas as pd, pvlib

MEAN_DAY = [17, 47, 75, 105, 135, 162, 198, 228, 258, 288, 318, 344]
DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
GHI = [6.2, 6.6, 6.4, 5.6, 5.0, 4.6, 4.4, 4.7, 5.6, 5.8, 5.4, 5.8]
TAMB = [24, 25, 25, 23, 22, 21, 20, 21, 23, 24, 23, 23]
LOSSES = dict(soiling=2, shading=3, snow=0, mismatch=2, wiring=2, connections=0.5, lid=1.5, nameplate_rating=1, age=0, availability=3)

def erbs_monthly(kt, ws):
    return (1.391 - 3.560*kt + 4.189*kt**2 - 2.137*kt**3) if ws <= 81.4 else (1.311 - 3.022*kt + 3.427*kt**2 - 1.821*kt**3)

def poa_steps(lat, lon, tilt, az, H, m):
    day = pd.Timestamp(2026, 1, 1) + pd.Timedelta(days=MEAN_DAY[m] - 1)
    times = pd.date_range(day, day + pd.Timedelta(hours=23, minutes=50), freq="10min", tz="UTC") - pd.Timedelta(hours=lon / 15)
    sp = pvlib.solarposition.get_solarposition(times, lat, lon, method="nrel_numpy")
    cz = np.cos(np.radians(sp["apparent_zenith"].clip(upper=90)))
    g0h = (pvlib.irradiance.get_extra_radiation(times) * cz).where(sp["apparent_zenith"] < 90, 0.0)
    h0 = g0h.sum() / 6 / 1000
    ghi = g0h / g0h.sum() * H * 1000 * 6
    dec = pvlib.solarposition.declination_cooper69(MEAN_DAY[m])
    ws = np.degrees(np.arccos(np.clip(-np.tan(np.radians(lat)) * np.tan(dec), -1, 1)))
    fd = min(1, max(0, erbs_monthly(min(0.8, max(0.3, H / h0)), ws)))
    dhi = ghi * fd
    dni = ((ghi - dhi) / cz.clip(lower=0.087)).where(sp["apparent_zenith"] < 90, 0.0)
    tot = pvlib.irradiance.get_total_irradiance(tilt, az, sp["apparent_zenith"], sp["azimuth"], dni, ghi, dhi, albedo=0.2, model="isotropic")
    return tot["poa_global"].fillna(0)

CASES = [
    {"name": "Nairobi 10 kWp on 8 kW (DC/AC 1.25)", "lat": -1.2921, "lon": 36.8219, "tilt": 10, "az": 0, "dcKw": 10, "acKw": 8, "gamma": -0.35, "noct": 45, "eta": 0.96},
    {"name": "Garissa 20 kWp on 15 kW (DC/AC 1.33, clipping)", "lat": -0.4532, "lon": 39.6461, "tilt": 10, "az": 180, "dcKw": 20, "acKw": 15, "gamma": -0.29, "noct": 43, "eta": 0.975},
    {"name": "Lodwar 5 kWp on 6 kW (DC/AC 0.83)", "lat": 3.1191, "lon": 35.5973, "tilt": 10, "az": 180, "dcKw": 5, "acKw": 6, "gamma": -0.40, "noct": 46, "eta": 0.95},
]
loss_frac = pvlib.pvsystem.pvwatts_losses(**LOSSES) / 100
out = {"pvlib": pvlib.__version__, "ghi": GHI, "tamb": TAMB, "lossesPct": LOSSES, "pvwattsTotalLossPct": float(loss_frac * 100), "cases": []}
for c in CASES:
    monthly = []
    for m in range(12):
        poa = poa_steps(c["lat"], c["lon"], c["tilt"], c["az"], GHI[m], m)
        tcell = pvlib.temperature.ross(poa, TAMB[m], c["noct"])
        pdc = pvlib.pvsystem.pvwatts_dc(poa, tcell, c["dcKw"] * 1000, c["gamma"] / 100) * (1 - loss_frac)
        pac = pvlib.inverter.pvwatts(pdc, c["acKw"] * 1000 / c["eta"], eta_inv_nom=c["eta"])
        monthly.append(float(pac.clip(lower=0).sum() / 6 / 1000 * DAYS[m]))
    out["cases"].append({**c, "monthlyKwh": [round(x, 2) for x in monthly], "annualKwh": round(sum(monthly), 1)})
    print(c["name"], round(sum(monthly)), "kWh/yr")
p = pathlib.Path(__file__).resolve().parents[2] / "tests" / "fixtures" / "pvlib-production.json"
p.write_text(json.dumps(out, indent=1))
print("wrote", p, "pvwatts total loss", round(float(loss_frac * 100), 2), "%")
