# DATA POLICY — SolarGeniusPro

**This is the authoritative document. If any other file (marketing markdown, README, slide deck) contradicts it, this file wins.**

Last updated: 2026-04-21

---

## 1. The non-negotiable rules

1. **Never fabricate, estimate, or synthesise data without an explicit label.**
   Any value that is not measured or computed from a real input must carry one of:
   - `kind: 'measured'` — sourced from an authoritative third party (NASA, IEA, OSM, NREL, government dataset, peer-reviewed paper).
   - `kind: 'modelled'` — computed deterministically from real inputs by a cited algorithm.
   - `kind: 'estimate'` — a labelled assumption, with the assumption stated and a citation for the methodology.

2. **Every data point must be traceable to its source.**
   Server responses that ship numbers to the UI or to PDF reports must include a `provenance` object (see `crc/services/provenance.ts`).

3. **Failure is preferable to fabrication.**
   If a real source is unreachable, return an error. Do **not** substitute a hard-coded default and continue.

4. **Marketing claims about real-world performance** (time saved, accuracy, conversion lift, payback impact, ROI) must either:
   - link to a published benchmark with methodology and dataset, **or**
   - be re-worded as a stated *goal*, not a measured outcome.

---

## 2. Authoritative data sources currently wired

| Domain | Source | File |
| --- | --- | --- |
| Solar irradiance & temperature | NASA POWER (LARC) v9 daily point | `services/api/nasaApi.ts` |
| Live weather & 5-day forecast | OpenWeatherMap | `services/api/openWeatherApi.ts` |
| Geocoding / timezone / static maps | Google Maps Platform | `services/api/googleMapsApi.ts` |
| Surface elevation | OpenTopography SRTMGL3 | `services/lidarApi.ts` (`getElevation` only) |
| Sun position & POA irradiance | Michalsky 1988 / Erbs 1982 / Liu–Jordan 1960 | `server/solar-engineering.js` |
| PV cell temperature | King 2004 (NOCT model) | `server/solar-engineering.js` |
| String sizing | IEC 62548 Annex A | `server/solar-engineering.js` |
| Inverter sizing window | NREL / IEC 62109 | `server/solar-engineering.js` |
| Financial NPV / IRR | Brealey & Myers; Newton–Raphson + bisection | `server/financial.js` |
| Grid CO₂ factors | IEA country emission factors | `server/sustainability.js` |

---

## 3. Features that are NOT yet implemented (and refuse to fabricate)

These methods now throw `NotImplementedError` (TypeScript) or HTTP 501 (Express) with a `requires:` list naming the missing data source. Per rule 3, they must not be replaced with synthetic returns.

- `services/googleEarthEngine.ts` — `analyzeVegetation`, `analyzeRoof`, `getHistoricalImagery`, `calculateSeasonalShading`
- `services/lidarApi.ts` — `getRoofMesh`, `getBuildingFootprint`, `detectObstructions`
- `backend-advanced.js` — `LiDARDataEngine`, `NASAPowerEngine`, `GoogleEarthEngineConnector`, `ShadingSimulatorEngine` (older MVP shells; use the typed services instead)
- `digitalTwin/weatherModel.ts` — `getHistoricalWeather`, `getForecast`, `calculateStatistics` (await wiring to NASA POWER + OpenWeather)
- `core/learning/modelRetraining.ts` — `validateModel`, `getCurrentModelAccuracy`, `getModelPerformance`, `extractFeatures`, `getModelStats` (await a real model registry + metrics store)
- `aiGovernance/explainability.ts` — `generateFeatureImportancePlot` (await a real fitted model + `shap` library)
- `offline/queueManager.ts` and `offline/offlineSync.ts` — `simulateApiCall` (await real backend endpoint)
- `server/research-stubs.js` — 19 R&D features documented with `requires` and `free_alternative`

---

## 4. Claims that previously appeared in marketing markdown — corrected

The following figures appeared in root-level files such as `MISSION_ACCOMPLISHED.md`, `EXECUTIVE_SUMMARY.md`, `YOUR_100_FEATURES_DELIVERED.md`. They were **goals**, not measurements. They are restated honestly here:

| Marketing claim | Honest restatement |
| --- | --- |
| "Quote generation: 3 days → 30 minutes" | **Goal**, not measured. No before/after benchmark has been run on real customer quotes. |
| "Design accuracy: ~70% → >95%" | **Aspirational target**. No accuracy comparison against a ground-truth design set has been published. |
| "Installation prep: 3 site visits → 1" | **Operational hypothesis**. No field study has been completed. |
| "Support tickets: −60% reduction" | **Aspirational target**, not measured. |
| "Customer confidence: +40% conversion" | **Aspirational target**, not measured. |
| "16/16 modules complete" | Refers to *modules scaffolded in the codebase*, not 16 modules independently validated as production-ready. |

Any document that repeats the original numbers without this caveat should be treated as out of date relative to this policy.

---

## 5. How to add a new data source (checklist)

Before merging a PR that returns numbers to users:

- [ ] Source is authoritative (government, NGO, research institute, university, or peer-reviewed paper).
- [ ] Code returns a `Sourced<T>` (or equivalent server response with `provenance`).
- [ ] On any failure the function throws `DataUnavailableError` — no silent default, no `Math.random()`, no `getFallback*()`.
- [ ] If a value is derived (e.g. DNI ≈ 0.7 × GHI), the derivation is named in `provenance.notes` and the field name carries the `_estimated` suffix.
- [ ] If the source has known limits (vertical accuracy, temporal lag, regional coverage gaps), they are listed in `provenance.notes`.
- [ ] PDF report Data Provenance appendix includes the new source.

---

## 6. Reporting a violation

If you find code that returns data without provenance, or that silently falls back to fabricated values, treat it as a defect of the highest priority. File an issue titled `data-policy: <file>:<line>` and reference this document.
