# AquaScan Pro — Comprehensive System Report
**All parameters, modules, data sources, accuracy tiers & integrity status**
**Date:** 2026-07-08 · **Engine:** v4 (~75 modules, `external/borehole-ai-engine/src/`) · **Status of this document:** master reference, kept alongside [AQUASCAN-ACCURACY-AUDIT-2026-07.md](AQUASCAN-ACCURACY-AUDIT-2026-07.md)

---

## 1. What AquaScan Pro is (and is honestly allowed to claim)

A **pre-feasibility borehole screening platform**: it fuses satellite data, physics models, regional statistics and image analysis into a screening report that *filters sites before money is spent*. It reduces failed drilling an estimated 40–60% **before any fieldwork** — it does not replace ERT, pump test or lab analysis, and after the 2026-07 integrity fixes it can no longer accidentally claim that it does.

**Confidence tier ladder (printed on every report):**
| Tier | Range | Meaning |
|---|---|---|
| PRELIMINARY | <50% | Awareness only |
| STANDARD SCREENING | 50–69% | Good filter; pre-fieldwork triage |
| PRE-FEASIBILITY | 70–79% | Strong filter, expert-level screening |
| ENGINEERING GRADE | 80–89% | ERT + pump test are the remaining steps |
| BANKABLE | ≥90% | Field-validated; IDA/AfDB/World Bank submissible |

**Upgrade path to bankable:** ERT + seismic ($3,000–5,000, +15–20%) → 24-hr pump test ($2,000–3,500, +10–15%) → WHO lab panel ($500–1,200, +5–10%) → local borehole records (+5–10%) → re-run model. Total ≈ $5,500–10,000.

---

## 2. Location resolution chain (why some photos read "Unknown Location")

| Layer | Source | Accuracy | Grade |
|---|---|---|---|
| 1 | EXIF GPS from photo | ±10 m | A |
| 2 | Device/browser GPS (user grants) | ±50 m | A–B |
| 3 | Manual entry (Country/County/Town/Village) | place-level | B–C |
| 4 | Filename / IPTC text → Nominatim geocode | ±5–30 km | C–D |
| 5 | Visual terrain estimation (fallback) | **±50 km** | D |

**Key facts:** WhatsApp/Facebook/email forwards **strip EXIF GPS** — a forwarded photo can never geolocate itself. Generic filename hints ("church compound") are correctly rejected. At Grade D/F the report now labels coordinates "AI ESTIMATE — NOT measured", maps print "NO GPS — LOCATION NOT MEASURED" instead of 0,0, and the site-identity page is titled **UNVERIFIED**. *Customer guidance: type the location manually or upload original camera files.*

---

## 3. Full parameter catalogue

### 3.1 Headline decision parameters (Executive Summary — the reconciled, authoritative values)
| Parameter | Method | Typical accuracy (desktop) | Tier |
|---|---|---|---|
| Success Probability | Bayesian ensemble of 6 sources (image+SoilGrids, GLDAS/ERA5 water budget, nearby wells, GRACE-FO, vegetation-GW proxy, 6-factor model), reliability-weighted | ±6–15 pts | CALIBRATED (ensemble) |
| Recommended Depth | IDW nearby-well anchor + geological layering + weathering model; ±15% band | ±30–50% | ESTIMATED |
| Estimated Yield | min(T-limited, recharge-limited, storage-limited) × 0.7 safety | ±30–50% (pump test required) | ESTIMATED |
| Overall Risk | 5-dimension fusion (geological, contamination, depth, financial, technical) | probabilistic | ESTIMATED |
| Overall Confidence | weighted: Geo 30% + Terrain 20% + Veg 15% + Data 15% + WQ 20% | self-assessed | — |
| Final Verdict | ONE verdict (exec summary); risk-engine + hybrid-pipeline outputs are labelled sub-verdicts/conditional projections | — | — |

### 3.2 Image analysis (9 layers, runs on every uploaded photo)
| # | Layer | Output |
|---|---|---|
| 1 | EXIF GPS extraction (3 strategies incl. DMS arrays, thumbnail IFD) | coordinates ±10 m |
| 2 | IPTC/XMP location text | city/country hints |
| 3 | MobileNet scene classification (TensorFlow.js; CSP unblocked 2026-06) | terrain/vegetation/water labels |
| 4 | Pixel spectral decomposition (256×256 two-pass) | R/G/B ratios, ExG vegetation index, water index, soil-exposure, rock-exposure, texture variance, edge density, histogram |
| 5 | Geological color proxy | laterite / alluvial / sandstone / basalt / limestone / fractured-rocky class |
| 6 | Outdoor-scene detection | scene confidence (rejects selfies/documents) |
| 7 | Visual geo-estimation | ranked region candidates with confidence |
| 8 | Perceptual fingerprint (pHash 64-bit) | duplicate detection |
| 9 | Forensic identity (camera serial, doc IDs, composite ID) | provenance & tamper context |

### 3.3 Soil & geology
| Parameter | Source | Accuracy |
|---|---|---|
| Soil type, texture (clay/sand/silt), pH, SOC, bulk density, CEC | ISRIC SoilGrids v2.0 (250 m) + USDA texture triangle | 45–60% desktop; >85% with Sentinel-2 fusion |
| Porosity, permeability, hydraulic conductivity Ksat | Saxton & Rawls (2006) pedotransfer | ±; temperate-soil bias disclosed |
| Rock type / lithology | Macrostrat API + texture mapping (Taylor & Eggleton 2001) + 8-classifier ensemble | ~60%, ESTIMATED |
| Weathering profile depth | Bazilevskaya et al. (2013) regression (MAP+MAT+rock) | ±50% |
| Subsurface layered model (10 layers: topsoil→saprolite→fractured→basement) | SoilGrids 0–200 cm + regional geology + Macrostrat stratigraphy | modelled; ERT upgrades |
| Aquifer classification (unconfined/confined/fractured/karst) | Bayesian classifier | ~60–90% |
| Fracture & lineament analysis | DEM morphometry + tectonic pattern library (density, orientation, intersections, connectivity, stress field, drilling azimuth) | MODELLED; self-penalises 30% on internal contradiction |

### 3.4 Vegetation & climate
| Parameter | Source |
|---|---|
| NDVI mean/dry-season/seasonal amplitude, phreatophyte indicator | MODIS MOD13A2/Q1 (ORNL DAAC), 250 m 16-day |
| Land-surface temperature, ET (FAO Penman-Monteith), LAI | MODIS MOD11A2 + ERA5-Land |
| Precipitation (20-yr), temperature, aridity | Open-Meteo ERA5 + NASA POWER cross-validation, ±5–10% |
| Drought/SPI, cycles, yield reliability under drought, 2050 projections | 20-yr NASA POWER series (trend extrapolation, not GCM) |

### 3.5 Water (hydrology & hydrogeology)
| Parameter | Source / method |
|---|---|
| Soil moisture 4 depths (0–255 cm) | GLDAS/ERA5-Land (9 km), ±15% |
| Water budget: R = P − ET − Runoff − ΔS (Budyko ET) | NASA POWER, ±25% |
| Recharge rate & fraction, monthly balance | dynamic recharge model |
| GRACE-FO storage anomaly, 5-yr trend, aquifer stress | ERA5-Land deep-moisture proxy, R²≈0.85 trend-level |
| Transmissivity T=K·b, storativity, specific capacity | rock lookup + Theis/Cooper-Jacob analytics — **ESTIMATED until pump test** |
| Drawdown, cone of depression, radius of influence | Theis W(u) series |
| Safe/sustainable yield | Darcy + recharge + storage constraints, min() × 0.7 |
| Water table depth | ⚠ engines still disagree (open defect #10) — treat exec value as governing |
| InSAR ground deformation / subsidence risk | Sentinel-1 / GRACE proxy |
| JRC surface water occurrence, flood risk | JRC Global Surface Water (30 m) |
| Nearby wells (25 km) | USGS NWIS + OSM Overpass + WPDx; synthetic infills **labelled and excluded from validation credit** |

### 3.6 Water quality (8 WHO parameters)
pH, TDS, hardness, fluoride, iron, arsenic, nitrate, turbidity — pedotransfer + regional hydrogeochemistry (e.g. East African Rift fluoride adjustment 1.5–15 mg/L, Edmunds & Smedley 2013).
**Integrity rules now enforced:** Section 3 (regional-adjusted) is authoritative; if the independent hydrochemistry model disagrees on any health-critical parameter, a red **MODEL DISAGREEMENT** banner instructs designing for the worse value and ISO 17025 lab confirmation. Potability is binary vs WHO limits; the 0–100 "score" is explicitly labelled proprietary, not WHO-endorsed. Corrosion/scaling indices (Langelier, Ryznar, Aggressive) drive casing material selection.

### 3.7 Satellite remote sensing (10-method fusion → Groundwater Potential Index)
Multispectral optical (Landsat 8/9) · SAR/InSAR (Sentinel-1) · GRACE-FO gravity · thermal IR (MODIS) · hyperspectral proxy · DEM (SRTM 30 m) · NDVI · SMAP/microwave soil moisture · integrated GIS weighted overlay (Saaty AHP weights) · LiDAR proxy. Each scored 0–100 with per-method confidence and platform/resolution disclosed; fused GPI 0–100.

### 3.8 Surface geophysics catalogue (30 non-invasive methods, site-ranked)
Scored per site for applicability, depth range, cost and time; grouped Essential/Recommended/Optional/Situational with a 3-phase survey plan. Headline methods: MRS/Surface NMR (only direct water detector), TDEM, MASW, seismic refraction, ERT (2D/3D specs incl. array, spacing, inversion software), FDEM, magnetics, GPR. Equipment catalogue (ABEM, AGI, Geometrics, GSSI, Geonics, GEM) included. **All projections labelled "PROJECTED — no field survey conducted" until real data is ingested.**

### 3.9 Drill-site targeting (with map graphics)
| Output | Detail |
|---|---|
| Primary drill point + crosshair map | callout boxes (depth target, est. yield, water table, success %), north arrow, scale bar, potential-zone rings; coordinates honestly labelled at grade D/F |
| Probabilistic success heat-map | 30×30 grid over 1 km radius; top-5 ranked points |
| Smart site selection (wider area) | 73 candidates over 2 km radius, 8-layer feature fusion, ranked with reasons |
| Micro-siting optimizer | 400 m grid, 317 candidates, GPS-precise best point + confidence radius |
| Fracture-intersection targets | ranked drilling targets with azimuth |
| Water-table contour map, hydrology map, soil map, NDVI map | canvas-generated with source attributions |

### 3.10 Engineering design (well design module)
Borehole diameter/method (DTH vs mud rotary), casing design (incl. corrosion-driven HDPE/SS316L selection from LSI), screen design (slot from D10 — flagged PROVISIONAL until sieve lab), gravel pack, sanitary seal (API RP 65 grout spec), pump selection (TDH, NPSH cavitation check, solar array sizing), well development plan, drilling timeline & BoQ, drilling-log field template, pump-test protocol (USGS standard), monitoring & O&M schedule, decommissioning protocol (ASTM D5299), setback/contamination travel-time analysis (GOD vulnerability; distances now honestly labelled ASSUMED), demand & 20-yr sustainability, regulatory/EIA pre-screening (KE/ZA/NG/TZ/UG/IN/US/UK thresholds), World Bank bankability indicators (cost/beneficiary, DALYs, EIRR).

### 3.11 Economics — ONE canonical model (`computeCanonicalEconomics`)
Assumptions: soil-based drilling rates ($45–95/m, UNICEF/RWSN 2020), corrosion-aware casing, screen from aquifer zone, pump+solar sizing from physics, water-quality treatment + defluoridation when triggered, 15% contingency (25% hard rock), O&M 4.5% capex, **solar 6 h/day × 300 days/yr, $0.80/m³ rural tariff, 60/75/85% utilization ramp**, 20-yr IRR (bisection), NPV@10/12.5/15%, ramped-cash-flow payback. **Rule: every section showing money consumes this function — no section may recompute.** (Investor Summary and §5.1 verified consistent.)

### 3.12 Confidence, trust & certification framework
- **Data Provenance Matrix:** every prediction tagged MEASURED / CALIBRATED / ESTIMATED / INFERRED / DEFAULT — tiers driven by **real field data only** (modelled ERT/pump-test objects no longer count).
- **Trust Score (0–100, A–F):** data quality + physics rigor + validation + transparency; validation credit only from **real** wells (synthetic SYN-* excluded).
- **Certification readiness:** Pre-feasibility / Engineering / Bankable / Regulatory gates with explicit missing-item lists.
- **Monte Carlo (5,000 iter, seeded):** P5–P95 bands for depth/yield/probability; CIs only narrowed by field data.
- **Cross-validation:** RMSE/MAE/MAPE/R² vs nearby wells with real-vs-synthetic counts and CIRCULAR VALIDATION warning.
- **Appendix B:** every heuristic constant disclosed with peer-reviewed/heuristic status.
- **Prediction-vs-Reality template:** post-drilling actuals feed the self-learning calibration loop (localStorage, ≥3 outcomes per 0.5° cell).

---

## 4. Integrity fixes ledger (2026-07-08, commits `f35cdad` + `50f6a69`, live)

| # | Fixed defect |
|---|---|
| 1 | "ERT/pump test/lithology COMPLETED" claims on desktop-only reports (Path-to-97) |
| 2 | Provenance matrix claiming "CALIBRATED 92% — pump test" / "98% field dipper" with no pump test |
| 3 | Methodology table "Aquifer Simulation: MEASURED" on desktop runs |
| 4 | Trust Score Grade-A via circular validation against the model's own synthetic wells |
| 5 | Monte Carlo confidence intervals tightened by synthetic data |
| 6 | Fluoride 0.40 PASS printed beside 2.10 FAIL with no reconciliation (now red conflict banner) |
| 7 | "VERIFIED SITE IDENTITY" at 6-decimal precision for ±50 km visual guesses |
| 8 | Investor page 24 h/day-pumping economics vs §5.1 solar economics (0.9 yr vs 5.7 yr payback) → one canonical model |
| 9 | Three verdicts per report (INVESTIGATE + RELOCATE + DRILL) → one governing verdict |
| 10 | ERT "11.68 m³/hr EXCELLENT" from 0.00 m-thick aquifer → marked UNRELIABLE on conflict |
| 11 | Setback "Actual (m)" column echoing the minimum setback → real assumed distance + verify-on-site note |
| 12 | Maps printing 0.00000°,0.00000° (null island) → "NO GPS — LOCATION NOT MEASURED" |

## 5. Open items (next engineering pass)
1. **Water-table reconciliation** — one `result.waterTable_m` consumed by all sections (engines currently print 4.4–44 m).
2. **Canonical rainfall** — one precipitation value (fallback vs live currently mixes 700/800/1,400 mm).
3. **Grade-D/F gating of climate/elevation conclusions** — elevation-derived derating still computed at fallback centroid coordinates.

### 5.1 ✅ Regional Pre-Screening mode (SHIPPED 2026-07-09, item #13 in fixes ledger)
When location is Grade D/F (no GPS, no manual entry — coordinates from visual terrain estimation):
- Cover carries a **"REGIONAL PRE-SCREENING — THIS IS NOT A SITE REPORT"** banner with the uncertainty (tens of km) and the three ways to unlock the full report (site GPS / manual location / original camera photo).
- Report title becomes "REGIONAL PRE-SCREENING Report"; cover location line is tagged "(AI regional estimate — Grade D/F)".
- **Withheld and replaced by locked notices:** drill-site location map (crosshair), fracture-intersection drilling targets, probabilistic top drilling points, micro-siting optimizer, smart-site-selection ranked points, alternative drilling points, and the primary-recommendation coordinates ("WITHHELD — provide GPS to obtain a drill point").
- **Retained:** regional hydrogeology, water budget, soil/vegetation/rock analysis, water-quality modelling, risk, economics (labelled desktop), geophysics survey plan and the upgrade path — everything that is genuinely regional-scale.
- **Verifiable gate:** `gpsSource ∈ {exif, manual, device}` OR grade ≤ C ⇒ full site report; unit-tested 8/8 cases.

## 6. Data source registry (all free, no-auth, real-time)
ISRIC SoilGrids v2.0 · ERA5-Land/Open-Meteo (ECMWF) · NASA POWER (GLDAS/MERRA-2) · MODIS ORNL DAAC · GloFAS · JRC Global Surface Water · SRTM/Open-Elevation · COMET LiCSAR/ESA · ASF DAAC Sentinel-1 · Macrostrat · USGS NWIS/MRData/Spectral Library · OneGeology · WPDx/WPDx+ · BGS GeoIndex & Africa Atlas · OSM Overpass · IGRAC GGIS · DWS SA · GEMStat · mWater · WoSIS · Nominatim. Standards: WHO 2011, ISO 14688/14689/22475/5667/6709, BS 5930, ASTM D4043/4044/4050/4106/5922/6431/D5299, API RP 65, ANSI/HI 9.6.1.

---

*This document is the parameter-complete reference for AquaScan Pro. Pair it with the accuracy audit for defect history. A qualified hydrogeologist must review any report before drilling capital is committed — the tool enforces that language on every export.*
