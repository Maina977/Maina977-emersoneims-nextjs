# AquaScan Pro — Accuracy & Integrity Audit
**Date:** 2026-07-08 · **Trigger:** 104-page expert report generated from a church-compound photo ("Unknown Location") · **Method:** page-by-page engineering review of the PDF cross-referenced against the engine source code.

---

## Part 1 — Why the location could not be read

The tool worked as designed; **the photo simply carries no location**. The pipeline (`imageDetector.ts`) tries, in order:

1. **EXIF GPS** — the image has no GPS metadata. This is the norm, not the exception: WhatsApp, Facebook and most messaging apps **strip EXIF including GPS** on upload, and many cameras never record it. (The report's forensic section shows only a perceptual hash — no camera serial, no GPS tags — consistent with a stripped/forwarded image.)
2. **IPTC/XMP location text** — none present.
3. **Filename hint** — the filename reduced to *"church compound"*. Nominatim geocoding rejects amenity/building matches by design (a "church" match would be some arbitrary church anywhere on Earth), so this correctly returned nothing.
4. **Visual terrain estimation (fallback)** — pixel/vegetation analysis matched "Kenya Central Highlands (Murang'a/Kiambu/Nyeri)" at 61% confidence and auto-applied the regional centroid **-0.90, 37.19 (±50 km)** — which is why deep report sections show those coordinates while the cover says "Unknown Location", **Grade D**.

**What to tell customers:** for a usable location, either (a) type the location manually in the tool (Country/County/Town/Village fields — this is the most reliable), (b) allow browser GPS when prompted on-site, or (c) upload the **original camera file** (not a WhatsApp forward). A photo alone, stripped of metadata, can only ever produce a regional guess.

---

## Part 2 — Report integrity audit (as a water engineer)

### FIXED in code this session (commit references in git)

| # | Severity | Defect (as seen in the customer PDF) | Root cause | Fix |
|---|---|---|---|---|
| 1 | **CRITICAL** | Page 65 "Path to 97%" claims **ERT survey COMPLETED, pump test COMPLETED, lithology COMPLETED** on a report whose cover says "NO FIELD DATA COLLECTED". A customer could believe field work was done. | `pathTo97Engine.ts:83-86` tested whether analysis objects *exist* — but the engine always attaches modelled/synthetic versions of them. | Flags now require actual field data (`fieldData`/`fieldValidation`) or `dataSource === 'field_ert'`. |
| 2 | **CRITICAL** | Page 95 Data Provenance Matrix labels yield "**CALIBRATED 92% — pump test analysis**" and static water level "**98% — field measurement (dipper reading)**" when no pump test was ever conducted. | `engineerConfidenceEngine.ts:241` counted the always-present `pumpTestAnalysis` object as a field pump test. | Provenance tiers now driven by field data only. |
| 3 | **HIGH** | Page 98 methodology table: "Aquifer Simulation — **MEASURED**", "ERT Interpretation — **CALIBRATED**" on a desktop-only run. | Same loose existence checks in `generateMethodologyReport`. | Strict field checks. |
| 4 | **HIGH** | Page 94 "**TRUST SCORE 80/100 — GRADE A — ENGINEERING GRADE READY**" with 0 measured parameters, validated against **3 synthetic wells** the model generated itself (page 96 admits "CIRCULAR VALIDATION"). | Validation scoring and certification gates counted synthetic SYN-* wells as validation wells. | Added `fieldWellCount`; full validation credit requires real wells; synthetic-only earns token credit; certification messages now say "model-generated wells don't count". |
| 5 | **HIGH** | Monte Carlo confidence intervals artificially narrow: synthetic ERT + synthetic wells were shrinking the uncertainty (CV 0.12 vs honest 0.35). | Loose checks in `runMonteCarloAnalysis`. | Only field ERT / real wells tighten the spread. |
| 6 | **CRITICAL (health)** | Section 3 says **fluoride 2.10 mg/L — FAILS WHO** (needs $2,500 defluoridation); Section 32 says **fluoride 0.40 mg/L — PASSES, water GOOD**. Both printed with no reconciliation — a customer wanting good news reads Section 32 and skips treatment. | Two independent water models (`waterQualityAnalyzer` with Rift-Valley regional adjustment vs `hydrochemPredictor` without it) both render. | Section 32 now prints a red **MODEL DISAGREEMENT** banner naming each health-critical conflict (F, Fe, As, NO₃) and instructing: design for the worse value, confirm by ISO 17025 lab before commissioning. |
| 7 | **HIGH** | Page 69 "**VERIFIED SITE IDENTITY** — Latitude -0.900000 — WGS84 (6 decimal places)" for a ±50 km visual guess. 6-decimal precision implies ~10 cm accuracy. | Section title hardcoded. | Title becomes "SITE IDENTITY — UNVERIFIED (AI-ESTIMATED LOCATION)" with an explicit ±tens-of-km warning whenever coordinates are not from EXIF/device/manual GPS (grade D/F). |

### FIXED in second pass (2026-07-08, full-module rescan)

| # | Severity | Defect | Fix |
|---|---|---|---|
| 8 | HIGH | **Economics contradicted wildly between pages** — the Investor Summary assumed **24 h/day pumping at flat $75/m** (payback 0.9 yrs) while Section 5.1 assumed 6 h/day solar at soil-based rates (payback 5.7 yrs), in the same report. | Extracted `computeCanonicalEconomics()` — ONE model (solar 6 h/day × 300 d/yr, utilization ramp, soil-based drilling rates, IRR/NPV). Both the Investor page and Section 5.1 now consume it; the investor cost table itemizes the same components and states "Same model as Section 5.1". |
| 9 | HIGH | **Three verdicts in one report** — "INVESTIGATE FURTHER" (exec), "RELOCATE" (risk engine), "DRILL WITH MONITORING" (hybrid pipeline). | Risk-engine output retitled "Risk-engine **sub-verdict**" with an explicit "FINAL verdict is in the Executive Summary" note; hybrid pipeline step 5 retitled "**Projected Decision IF ERT Confirms** (conditional — ERT not yet done)". One governing verdict: the Executive Summary. |
| 11 | MED | ERT derived **11.68 m³/hr "EXCELLENT"** from an aquifer whose feature extraction measured **0.00 m thickness** (impossibility warning printed 3 tables later, yield kept). | Yield table now cross-checks feature thickness: when <0.5 m it prints an UNRELIABLE warning, marks yield/sustainable-yield rows UNRELIABLE and the category "UNCONFIRMED (feature/model conflict)". |
| 14 | LOW | Setback table "Actual (m)" column echoed the minimum setback (the actual distance was never stored), contradicting its own risk text. | Added `estimatedDistance_m` to `SetbackSource` (engineeringCalcs.ts); column renamed "Assumed Dist. (m)" and shows the real assumed distance; non-compliance summary now says distances are ASSUMED and must be verified on site. |
| 15 | LOW | Maps printed `0.00000°, 0.00000°` (null island) as the site when no GPS existed. | `coordLabel()` helper in reportMapGenerator — all three map coordinate badges print "NO GPS — LOCATION NOT MEASURED" for (0,0)/non-finite coordinates. |

### STILL OPEN (need pipeline plumbing, not report-level fixes)

| # | Severity | Defect | Where |
|---|---|---|---|
| 10 | MED | Water-table depth stated as 30 m, 13 m, 13.2 m, 15.4 m, 4.4 m and 44 m in different sections — each engine estimates its own. Needs a reconciled `result.waterTable_m` that every section cites. | multiple engines |
| 12 | MED | Elevation/climate queried at fallback centroid coordinates then used for derating (450 m printed for a ~1,800 m highlands site). Should suppress or caveat elevation-dependent conclusions at location grade D/F. | pipeline gating |
| 13 | MED | Rainfall printed as 700 / 800 / 1,400 mm/yr in one report — API fallback and live values mixed between modules. Needs one canonical precipitation value on the result. | water-budget vs recharge modules |
| 16 | PRODUCT | Grade D/F location reports should auto-downgrade to a "REGIONAL PRE-SCREENING" template (suppress drill coordinates, micro-siting, per-site economics). | report pipeline |

### What the tool already does WELL (credit where due)
- The cover page honestly declares "NO FIELD DATA COLLECTED — ALL PARAMETERS ARE MODELLED", lists the 4 missing critical items, and calls the report "a filter, not a final decision-maker".
- Synthetic wells and synthetic ERT are individually labelled at the point of display.
- Appendix B discloses every heuristic; the provenance registry lists real sources.
- The core numbers a customer acts on (57% probability / 44 m / 2.9 m³/hr / "investigate further") are **defensible for a pre-feasibility screen** — the problem was never the estimates, it was the *confidence theatre* around them (fixed items 1–7).

---

## Part 3 — Policy recommendation (product)
For **Grade D/F location reports** (no GPS): the report should automatically downgrade to a "REGIONAL PRE-SCREENING" template — suppress drill-point coordinates, fracture-intersection targets, micro-siting, and per-site economics, and lead with "provide GPS coordinates or a manual location to unlock site-specific analysis." A customer should never receive a 104-page site report for a site the tool cannot place on a map.
