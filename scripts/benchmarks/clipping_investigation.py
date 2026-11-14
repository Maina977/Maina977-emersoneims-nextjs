"""How much does the monthly mean-day method underestimate inverter clipping?
Compares, with pvlib 0.16.1 only, the same PVWatts chain on
  (a) each month's mean day (the method in lib/solar/design/production.ts), and
  (b) an hourly year: Ineichen clear-sky irradiance scaled so each month's
      total equals the same monthly GHI, with day-to-day variability from a
      fixed, seeded clearness sequence (a synthetic test year, not measured).
Reports annual AC and clipped energy at DC/AC 1.0-1.6. Test inputs only."""
import json, pathlib
import numpy as np, pandas as pd, pvlib

LAT, LON, TILT, AZ = -1.2921, 36.8219, 10, 0
GHI = [6.2, 6.6, 6.4, 5.6, 5.0, 4.6, 4.4, 4.7, 5.6, 5.8, 5.4, 5.8]
TAMB = [24, 25, 25, 23, 22, 21, 20, 21, 23, 24, 23, 23]
GAMMA, NOCT, ETA = -0.35, 45, 0.96
LOSS = pvlib.pvsystem.pvwatts_losses() / 100
MEAN_DAY = [17, 47, 75, 105, 135, 162, 198, 228, 258, 288, 318, 344]
DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
loc = pvlib.location.Location(LAT, LON, tz="Africa/Nairobi", altitude=1660)

def chain(times, ghi, tamb, dc_kw, ac_kw):
    sp = loc.get_solarposition(times)
    erbs = pvlib.irradiance.erbs(ghi, sp["apparent_zenith"], times)
    poa = pvlib.irradiance.get_total_irradiance(TILT, AZ, sp["apparent_zenith"], sp["azimuth"], erbs["dni"], ghi, erbs["dhi"], albedo=0.2, model="isotropic")["poa_global"].fillna(0)
    tc = pvlib.temperature.ross(poa, tamb, NOCT)
    pdc = pvlib.pvsystem.pvwatts_dc(poa, tc, dc_kw * 1000, GAMMA / 100) * (1 - LOSS)
    pdc0 = ac_kw * 1000 / ETA
    zeta = (pdc / pdc0).clip(lower=1e-9)
    raw = ((ETA / 0.9637) * (-0.0162 * zeta - 0.0059 / zeta + 0.9858) * pdc).clip(lower=0)
    ac = raw.clip(upper=pdc0 * ETA)
    return ac, raw - ac

rng = np.random.default_rng(20261114)
def hourly_year():
    times = pd.date_range("2026-01-01", "2026-12-31 23:00", freq="1h", tz="Africa/Nairobi")
    cs = loc.get_clearsky(times)["ghi"]
    # Day-to-day clearness 0.35-1.05 (seeded), then scale each month to its GHI total.
    daily = pd.Series(rng.uniform(0.35, 1.05, len(pd.unique(times.date))), index=pd.unique(times.date))
    g = cs * np.array([daily[t.date()] for t in times])
    for m in range(12):
        sel = times.month == m + 1
        g[sel] *= (GHI[m] * DAYS[m] * 1000) / g[sel].sum()
    tamb = pd.Series([TAMB[t.month - 1] for t in times], index=times)
    return times, g, tamb

def mean_day(dc, ac):
    tot_ac = tot_clip = 0.0
    for m in range(12):
        day = pd.Timestamp(2026, m + 1, 1) + pd.Timedelta(days=MEAN_DAY[m] - sum(DAYS[:m]) - 1)
        t = pd.date_range(day, day + pd.Timedelta(hours=23, minutes=50), freq="10min", tz="Africa/Nairobi")
        cs = loc.get_clearsky(t)["ghi"]
        g = cs * (GHI[m] * 1000 * 6) / cs.sum()  # mean day: shape of the clear day, monthly mean total
        a, c = chain(t, g, pd.Series(TAMB[m], index=t), dc, ac)
        tot_ac += a.sum() / 6 / 1000 * DAYS[m]; tot_clip += c.sum() / 6 / 1000 * DAYS[m]
    return tot_ac, tot_clip

times, g, tamb = hourly_year()
rows = []
for ratio in [1.0, 1.2, 1.33, 1.5, 1.6]:
    dc, ac = 10 * ratio, 10.0
    a_h, c_h = chain(times, g, tamb, dc, ac)
    A_h, C_h = a_h.sum() / 1000, c_h.sum() / 1000
    A_m, C_m = mean_day(dc, ac)
    rows.append({"dcAc": ratio, "hourlyAcKwh": round(A_h), "meanDayAcKwh": round(A_m), "acDiffPct": round((A_m - A_h) / A_h * 100, 2),
                 "hourlyClipKwh": round(C_h), "meanDayClipKwh": round(C_m)})
    print(rows[-1])
p = pathlib.Path(__file__).resolve().parents[2] / "docs" / "solar-validation" / "clipping-investigation.json"
p.write_text(json.dumps({"pvlib": pvlib.__version__, "site": [LAT, LON, TILT, AZ], "note": "synthetic test year, not measured data", "rows": rows}, indent=1))
print("wrote", p)
