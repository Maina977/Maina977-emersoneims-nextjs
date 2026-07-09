# AquaScan Pro — Full-Tool Review & Feature Roadmap
**Date:** 2026-07-09 · Reviewed as geologist / water engineer / product owner after 5 audit-and-hardening passes. Current state: no synthetic data anywhere; 3 national databases bundled; 13 integrity fixes live.

## A. Adjustments still owed (accuracy debt — small, known)
| # | Item | Why | Effort |
|---|---|---|---|
| A1 | **One canonical water table** — `result.waterTable_m` computed once (field > ERT > fusion > model) and cited by every section | Engines still print 4.4–44 m in one report | ~½ session |
| A2 | **One canonical rainfall** — baseline/live value reconciled once | 700/800/1,400 mm mixing between modules | small |
| A3 | **Grade-D/F gating of elevation-derived derating** | derating still computed at estimate centroid | small |
| A4 | **Re-run baseline builder for soil** when ISRIC API returns (script resumes automatically) | soil columns empty in v1 | 10 min |
| A5 | **Probe ICPAC GeoNode WFS** (`ken_waterpoints1`) — possible extra wells layer | untested lead from user's list | small |
| A6 | **Baseline Level 2** — constituencies (290) then towns via units CSV through the builder | "own database" expansion | batch runs |

## B. New features — ranked by value to EmersonEIMS
### B1. Two-page Executive Decision Brief (HIGHEST — sales)
104 pages overwhelms the exact person who pays. Auto-generate a 2-page brief: verdict, the 5 headline numbers, wells nearby, economics table, field-validation plan + price. The long report becomes the technical annex. *Effort: 1 session.*

### B2. Backtest & Calibration Console (HIGHEST — credibility)
Upload historical drilled-borehole outcomes (CSV) → blind re-run → accuracy scorecard (hit rate, depth/yield error) → feeds the self-learning calibration. Settles "can it replace surveys" with data; marketing gold if scores are good. Machinery already exists (Prediction-vs-Reality, calibration loop). *Effort: 1–2 sessions + user's outcome data.*

### B3. Registry wells drawn on the site maps (visual credibility) — ✅ SHIPPED 2026-07-09 (731572f)
Plot the 22,820 bundled wells + WPDx hits as dots (green=functional/red=failed) on the drill-site and water-table maps. A customer seeing 14 real wells around their plot trusts the analysis instantly. *Shipped: all 10 registry loaders carry true lat/lon; drill-site map plots up to 60 nearest wells at real coordinates with count box + name/depth labels; water-table map lists wells as a data panel (its rings are conceptual, so no positional dots); import-time sanity scrub (depth 0–500 m, yield ≤100 m³/h).*

### B4. Lead-capture hook → ERP (business)
On every report generation: push {location, county, verdict, yield, contact} to `/api/contact` → ERP as a qualified borehole lead. Every free report becomes a tracked sales opportunity for the drilling/ERT services. *Effort: small.*

### B5. Guided "Upgrade to Bankable" wizard
The upgrade path (ERT → pump test → lab) exists as tables; make it a stepper in the UI with EmersonEIMS quote buttons per step — converts report readers into ERT customers. *Effort: 1 session.*

### B6. Field mode (PWA): on-site GPS capture
Tech opens tool on phone at the plot → browser GPS (±10 m, Grade A) → photo + analysis in one flow. Kills the no-GPS problem operationally. *Effort: 1 session (geolocation flow exists, needs UX).*

### B7. Seasonal drilling-window callout — ✅ SHIPPED 2026-07-09 (731572f)
`historicalData.bestDrillingSeason` is already computed but buried — surface it in the exec summary ("drill Aug–Oct after long rains recharge"). *Shipped: exec-summary table row + green callout box, cited to the measured multi-year rainfall record.*

### B8. Regression guard in reportAuditor — ✅ SHIPPED 2026-07-09 (731572f)
Encode the 13 fixed integrity rules (no COMPLETED without field data, one economics model, one verdict, no synthetic wells…) as automated pre-export assertions so they can never regress. *Shipped: audit CHECK 17 blocks export on synthetic wells, fabricated well statistics, field-validation claims without field data, estimated GPS wearing grade A/B, out-of-bounds records, mislabelled Kenya prior. 12/12 behavioural tests pass. (Report-layer rules — one economics model, one verdict, regional locks — are enforced in reportGenerator itself.)*

## C. Recommended order
1. **B3 + B7 + B8** (one session: visible wins + regression protection)
2. **B1** Decision Brief (sales impact)
3. **B4** lead hook (revenue plumbing)
4. **A1–A3** accuracy debt
5. **B2** backtest — the moment outcome data arrives
6. **B5/B6** conversion + field UX
7. **A6** national database Level 2/3
