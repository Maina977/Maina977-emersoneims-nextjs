# Solar Genius Pro: pvlib benchmark record

14 November 2026. Reference: **pvlib-python 0.16.1** (BSD-3), run offline. Fixtures are committed, so the CI tests need no Python.

> Simulation-to-simulation agreement shows that the code implements the stated methods correctly. **It is not evidence of measured energy accuracy.** That requires the 10 real-installation comparisons (`real-system-comparison-template.csv`).

## 1. Plane-of-array irradiation: seven scenarios

**Inputs (test values, not measured data):**
- Monthly GHI, Jan–Dec: 6.2, 6.6, 6.4, 5.6, 5.0, 4.6, 4.4, 4.7, 5.6, 5.8, 5.4, 5.8 kWh/m²/day.
- Albedo 0.2.

**Two pvlib references:**
- **Method A:** same method, independent implementation. NREL SPA sun position, pvlib extraterrestrial irradiance and isotropic transposition, 5-minute steps.
- **Method B:** pvlib's hourly Erbs decomposition, a different model, shown as model uncertainty.

| # | Scenario (lat, tilt, azimuth) | Ours (kWh/m²/day) | pvlib A | Diff vs A | pvlib B | Diff vs B | Worst month vs A |
|---|---|---|---|---|---|---|---|
| 1 | Nairobi −1.29°, 10°, north | 5.42 | 5.423 | −0.06 % | 5.418 | +0.04 % | 0.28 % |
| 2 | Nairobi −1.29°, 10°, south | 5.46 | 5.452 | +0.14 % | 5.480 | −0.37 % | 0.33 % |
| 3 | Garissa −0.45°, 15°, east | 5.40 | 5.405 | −0.10 % | 5.411 | −0.20 % | 0.10 % |
| 4 | Lodwar 3.12°, 10°, south | 5.52 | 5.511 | +0.17 % | 5.535 | −0.27 % | 0.26 % |
| 5 | Mombasa −4.04°, 20°, north | 5.29 | 5.308 | −0.34 % | 5.301 | −0.20 % | 0.62 % |
| 6 | Geometry check 30° N, 30°, south | 6.62 | 6.570 | +0.77 % | 6.559 | +0.94 % | 1.87 % |
| 7 | Flat panel, Nairobi | 5.50 | 5.497 | +0.06 % | 5.502 | −0.03 % | 0.09 % |

**Test tolerances:**
- annual within 1.5 % of A, every month within 3 % of A;
- annual within 3 % of B.

The values above are the actual differences (all far inside the tolerances).

## 2. Cell temperature

The NOCT model matches `pvlib.temperature.ross` exactly in four cases (1000 W/m² at 35 °C and 42 °C, NOCT 45; 800 W/m² at 25 °C, NOCT 47; 1000 W/m² at 28 °C, NOCT 43). Tolerance 10⁻⁹ °C.

## 3. AC production (PVWatts v5 chain)

**Inputs:**
- Same GHI as §1.
- Monthly ambient temperature: 24, 25, 25, 23, 22, 21, 20, 21, 23, 24, 23, 23 °C.
- PVWatts default losses: 14.08 %, reproduced by `pvlib.pvsystem.pvwatts_losses`.

| Design | Ours (kWh/yr) | pvlib | Difference | PR |
|---|---|---|---|---|
| Nairobi 10 kWp / 8 kW (DC/AC 1.25), γ −0.35 %/°C, NOCT 45 °C, η 0.96 | 15,419 | 15,437 | −0.12 % | 0.780 |
| Garissa 20 kWp / 15 kW (DC/AC 1.33), γ −0.29, NOCT 43, η 0.975 | 32,059 | 32,008 | +0.16 % | 0.803 |
| Lodwar 5 kWp / 6 kW (DC/AC 0.83), γ −0.40, NOCT 46, η 0.95 | 7,635 | 7,623 | +0.16 % | 0.758 |

**Test tolerances:** annual within 1.5 %, each month within 3 %.

## 4. Known limitation: clipping under the mean-day method (investigated)

`scripts/benchmarks/clipping_investigation.py` compares the mean-day method with an hourly synthetic year. The year is clear-sky shape with seeded day-to-day variability, scaled to the same monthly totals; it is not measured data. Nairobi, 10 kW AC:

| DC/AC | Hourly AC (kWh) | Mean-day AC (kWh) | Mean-day over hourly | Hourly clipping | Mean-day clipping |
|---|---|---|---|---|---|
| 1.00 | 15,262 | 15,356 | +0.61 % | 0 | 0 |
| 1.20 | 18,319 | 18,450 | +0.72 % | 20 | 0 |
| 1.33 | 20,219 | 20,457 | +1.17 % | 113 | 0 |
| 1.50 | 22,482 | 23,075 | +2.64 % | 452 | 0 |
| 1.60 | 23,675 | 24,572 | +3.79 % | 786 | 40 |

**Findings:**
- The mean-day method misses most of the clipping and slightly overestimates energy, more so at high DC/AC.
- The production result now states this quantified caveat whenever DC/AC > 1.15.

**Improvement path:** an hourly simulation using free hourly data. Two candidates:
- PVGIS TMY (EU JRC; licence to confirm);
- NASA POWER hourly.

Either would be benchmarked against pvlib on the same hourly series.
