"""Hourly benchmark for lib/solar/design/hourly.ts with pvlib 0.16.1.
Synthetic test year (Ineichen clear sky x seeded day-to-day clearness, scaled
to the monthly GHI totals): a TEST INPUT, not measured data. Timestamps are the
middle of each hour (UTC). pvlib chain: NREL SPA sun position, Erbs
decomposition, isotropic transposition, Ross cell temperature, PVWatts DC,
PVWatts losses, PVWatts inverter with clipping.
Writes tests/fixtures/pvlib-hourly.json."""
import json, pathlib
import numpy as np, pandas as pd, pvlib

LAT, LON, ALT, TILT, AZ = -1.2921, 36.8219, 1660, 10, 0
GHI_M = [6.2, 6.6, 6.4, 5.6, 5.0, 4.6, 4.4, 4.7, 5.6, 5.8, 5.4, 5.8]
TAMB = [24, 25, 25, 23, 22, 21, 20, 21, 23, 24, 23, 23]
DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
GAMMA, NOCT, ETA = -0.35, 45, 0.96
LOSSES = pvlib.pvsystem.pvwatts_losses() / 100
loc = pvlib.location.Location(LAT, LON, tz="UTC", altitude=ALT)
times = pd.date_range("2026-01-01 00:30", "2026-12-31 23:30", freq="1h", tz="UTC")
rng = np.random.default_rng(20261114)
cs = loc.get_clearsky(times, model="ineichen")["ghi"]
dates = pd.Index(times.tz_convert("Africa/Nairobi").date)
clear = pd.Series(rng.uniform(0.35, 1.0, len(dates.unique())), index=dates.unique())
ghi = cs * clear.reindex(dates).to_numpy()
for m in range(12):
    sel = times.month == m + 1
    ghi[sel] *= (GHI_M[m] * DAYS[m] * 1000) / ghi[sel].sum()
ghi = ghi.round(2)
tamb = pd.Series([TAMB[t.month - 1] for t in times], index=times)

sp = loc.get_solarposition(times)
erbs = pvlib.irradiance.erbs(ghi, sp["zenith"], times)
poa = pvlib.irradiance.get_total_irradiance(TILT, AZ, sp["zenith"], sp["azimuth"], erbs["dni"], ghi, erbs["dhi"], albedo=0.2, model="isotropic")["poa_global"].fillna(0)
tc = pvlib.temperature.ross(poa, tamb, NOCT)
out = {"pvlib": pvlib.__version__, "site": {"lat": LAT, "lon": LON, "elevation": ALT, "tilt": TILT, "az": AZ},
       "start": "2026-01-01T00:30:00Z", "ghi": ghi.tolist(), "tamb": tamb.tolist(), "gamma": GAMMA, "noct": NOCT, "eta": ETA,
       "lossFraction": float(LOSSES), "cases": []}
for ratio in [1.0, 1.33, 1.6]:
    dc, ac = 10 * ratio, 10.0
    pdc = pvlib.pvsystem.pvwatts_dc(poa, tc, dc * 1000, GAMMA / 100) * (1 - LOSSES)
    pdc0 = ac * 1000 / ETA
    pac = pvlib.inverter.pvwatts(pdc, pdc0, eta_inv_nom=ETA).clip(lower=0)
    zeta = (pdc / pdc0).clip(lower=1e-9)
    raw = ((ETA / 0.9637) * (-0.0162 * zeta - 0.0059 / zeta + 0.9858) * pdc).clip(lower=0)
    clip_kwh = float((raw - pac).clip(lower=0).sum() / 1000)
    monthly = [float(pac[times.month == m + 1].sum() / 1000) for m in range(12)]
    out["cases"].append({"dcKw": dc, "acKw": ac, "annualKwh": round(sum(monthly), 1), "monthlyKwh": [round(x, 2) for x in monthly], "clippedKwh": round(clip_kwh, 1),
                         "poaKwhM2": round(float(poa.sum() / 1000), 2)})
    print(ratio, out["cases"][-1]["annualKwh"], "clip", out["cases"][-1]["clippedKwh"])
p = pathlib.Path(__file__).resolve().parents[2] / "tests" / "fixtures" / "pvlib-hourly.json"
p.write_text(json.dumps(out))
print("wrote", p)
