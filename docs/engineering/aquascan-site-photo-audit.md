# AquaScan Pro: site-photo workflow audit (before and after)

Branch `ws/aquascan-site-photos`, created 2026-11-25 from `0c939dce`.

- "Before" line numbers refer to `external/borehole-ai-engine/src/index.tsx` at `0c939dce`, unless another file is named.
- "After" points to the new modules: `sitePhotoChecks.ts`, `siteConstraints.ts`, `siteProperty.ts`, `sitePhotoReport.ts`, `siteVision.ts`, `sitePhotoBrowser.ts`, `SitePhotoWorkflow.tsx` and `photoOnlyGate.ts`.
- Tests: `tests/regression/aquascan-site-photo-checks.test.ts` and `aquascan-site-photo-workflow.test.tsx`. Every image in them is synthetic.

## 1. What the existing code did (verified)

| Area | Evidence (before) | Finding |
|---|---|---|
| Main photo upload | `buildSitePhotos` (`MAX_PHOTOS = 6`, l.96); `handleImageSelect` (l.868–960); the primary is chosen by EXIF GPS (l.897) | Up to 6 photos for **one** site. Only the primary was analysed; the rest were thumbnails in the PDF. |
| Image "analysis" | `imageDetector.ts` l.16 ("Layer 5: Geological proxy from dominant colors (laterite=red, alluvial=grey…"), l.859; MobileNet ImageNet labels (l.35–48) | Colour heuristics and generic ImageNet labels. This is not a defensible way to detect power lines, latrines, access or geology. |
| Photo → groundwater | `boreholeAnalyzer.ts` l.861 (`determineSiteLocation(features.vegetationScore, features.terrainType, features.waterProbability…)`) and l.879 (`calculateProbability(site)`); soil from pixels (l.871); `vegetation_probability` from `features.vegetationScore` (l.1230) | **FAIL.** The photo's pixels fed the success probability and soil, even when coordinates were entered. |
| Location from a photo | `boreholeAnalyzer.ts` l.395 ("No client location provided — will rely on image GPS/analysis"); `imageDetector.ts` l.1161–1166 (`locationMethod = 'visual-estimate'`) | **FAIL.** A photo with no GPS was located by its colours, and the full desktop analysis ran there. |
| Compare mode | `handleCompSiteUpload` l.967–973 (`analyzer.analyzeImage(file)`, no location); cards l.8990–8992; verdict l.9126 | **FAIL.** One photo per site, with no location. The cards printed **Depth, Yield and Chance of success ungated**, and the verdict printed "an estimated yield of … m³/h at … m depth". |
| Main summary | l.2192 `probabilityBand(result.probability)` | **FAIL** for photo-only runs: a chance of success was shown for a location guessed from the photo. |
| Evidence gate | `evidenceGate.ts` l.67 `siteEvidenceFrom(fieldData)`; gated cards l.2200–2241 | **PASS.** In the main results, depth and yield appear only with field evidence. Photos never open the gate. |
| Exports, photo-only | `reportGenerator.ts` `screeningOnly()`; `screeningReport.ts` | **PASS.** Without field evidence every export is the screening report: no depth, yield, cost or probability. Tested in `aquascan-site-photo-workflow.test.tsx` ("screening and JSON exports of a photo-only result"). |
| `app/api/ml/analyze-image` | l.67 `OPENAI_API`, l.125 `OPENAI_API_KEY` | Paid OpenAI Vision. Used only by `lib/solar/apiService.ts` l.267 (solar roof analysis), **not by AquaScan**. Left unchanged. |

## 2. Fixes to the existing flow (photos never feed groundwater figures)

- **Main upload** (`handleImageSelect`):
  - The groundwater analysis now always receives the neutral placeholder (`placeholderPhoto()`), never the photo.
  - The location comes from the typed coordinates, the place search or the photo's camera GPS (`exifGpsOf`).
  - With none of these, the run is refused with `PHOTO_NEEDS_LOCATION`. There is no colour-based "visual estimate" any more.
  - Photos are kept for the report. The results page says "Kept for the report only: photos are not used for any groundwater figure."
- **Re-analysis at corrected coordinates:** always the placeholder.
- **Compare mode** (`handleCompSiteUpload`):
  - The camera GPS gives the location and the analysis runs on the placeholder.
  - Without GPS the site is not analysed, with the reason shown.
  - The cards and the verdict use `compareCardFigures` and `compareVerdictSentence`: depth and yield only through the evidence gate, and no chance of success for a photo-only location.
  - The success-score rows are dropped when any compared location is photo-only.
- **Main summary and probability tab:** `chanceText(result)` withholds the chance of success for a photo-only location.
- **Where colour-based geology remains:** `imageDetector.ts` still computes it, but it no longer reaches any groundwater figure, because the analysis receives only the placeholder. It is not used in the new workflow.
- **Tests:**
  - `aquascan-site-photo-workflow.test.tsx` → "no data path from photos into groundwater figures" (import-graph test and source tests);
  - the same file → "photo-only analyses … never show depth, yield or a chance of success".

## 3. The 12 requirements: before and after

| # | Requirement | Before | After | Evidence (after) |
|---|---|---|---|---|
| 1 | Up to four photos per proposed location | FAIL: 6 photos for one site, 1 analysed | **PASS** | `siteProperty.addPhoto` refuses the 5th photo with a reason (test "a fifth photo is refused"; UI test "a5.jpg not added") |
| 2 | Photo validation and image-quality checks | FAIL: none | **PASS** (measured only) | `sitePhotoChecks.checkPhoto` / `checkPhotoSet`: type, size, resolution, Laplacian sharpness, exposure, dHash duplicates, EXIF GPS and time, GPS spread, distance from the entered location, age. Each check reports its measured value and threshold. |
| 3 | Real image-content analysis, never fabricated | FAIL: colour "geology", ImageNet labels | **PARTIAL** (honest) | No content claim is made. `siteVision.ts`: provider disabled, `VISION_STATUS`, three certainty levels (every feature NOT ASSESSED), failure-safe `runVisionSafely`, evaluation gate `evaluateClass`/`PROMOTION_THRESHOLD`. Model evaluation is pending: `aquascan-vision-model-evaluation.md`. |
| 4 | Visible access restrictions, hazards, contamination indicators | FAIL | **PASS** (customer checklist + rules) | `siteConstraints.constraintsFrom`: power lines, structures, contamination sources with estimated distance, slope, flooding, rig access, existing wells, each optionally linked to a photo; plain-language reasons; distances "NOT VERIFIED" |
| 5 | Record property and proposed location | PARTIAL: one site's coordinates | **PASS** | `Property` (name, county, optional GPS) and `CandidateLocation` (label, description, optional GPS) |
| 6 | Distinguish photos of different candidate locations | FAIL | **PASS** | Photos belong to their location; the GPS-spread and distance checks flag photos taken elsewhere |
| 7 | Request alternative-location photos where appropriate | FAIL | **PASS** | `assessLocation.requestAlternative` plus the "Add another location" button |
| 8 | Compare multiple locations on one property | FAIL: compare mode ranked photo-only groundwater figures | **PASS** | `compareLocations`: observable access and hazard ranking, labelled "not a groundwater ranking"; summary wording limited to "a better candidate for a field hydrogeological survey…" |
| 9 | History of each candidate location | FAIL | **PASS** | `recordRevision` (timestamp, outcome, reasons, photos, checklist), stored in browser storage (`save`/`load`, quota fallback) |
| 10 | Explain why a location is flagged | FAIL | **PASS** | Each finding has an explanation and a basis; INSUFFICIENT PHOTO EVIDENCE lists its reasons |
| 11 | Comparative PDF / Word / Excel report | FAIL | **PASS** | `sitePhotoReport.ts`: one content model; photos embedded with location labels; checked with pdfjs, JSZip and ExcelJS |
| 12 | Refer for hydrogeological / geophysical investigation | PARTIAL: generic | **PASS** | `GROUNDWATER_DISCLAIMER` and `REFERRAL` in every output; "Request an EmersonEIMS hydrogeological survey" opens `/contact?type=survey&detail=…`, pre-filled. Nothing is posted (tested). |

## 4. Safety rules for the independent review

- **No data path into groundwater figures.**
  - The photo modules import nothing from the analysis (`boreholeAnalyzer`, `imageDetector`, `evidenceGate`, `governingSummary`, `reportGenerator`, `pumpTestAnalyzer`, `pumpTestTimeSeries`, `types`), and the analysis imports none of them. This is enforced by a test.
  - The legacy upload and compare mode pass only the placeholder to the analysis. This is enforced by source tests.
- **Outcomes:** OBSERVABLE CONSTRAINTS FOUND, NO BLOCKING CONSTRAINT OBSERVED, or INSUFFICIENT PHOTO EVIDENCE. A test forbids "suitable for drilling", "better for water", any depth or yield figure, probabilities, aquifer properties and mg/L (`FORBIDDEN_IN_PHOTO_OUTPUTS`), on screen and in all three reports.
- **The customer's checklist governs.** `VISION_HINTS_AFFECT_OUTCOME = false` and `PROMOTED_CLASSES = []`. A generic detection never becomes a specific hazard: the septic tank and latrine features have no detector mapping, which is tested.
- **No setback number is used.** None was verified for Kenya (source register, section D).
- **Photos stay in the browser.** They are not uploaded (`PRIVACY_NOTE`).
- **Pumping-test protections are unchanged.** The single-reading and time-series tests all pass.

## 5. Limitations

- **Thresholds:** blur 60, exposure 40–220, duplicate ≤ 6 of 64 bits, distance 250/1,000 m and spread 150 m are AquaScan engineering choices tuned on synthetic images. They are not standards, and they have not been calibrated on real site photos.
- **Indoor and screenshot detection** relies on the absence of camera metadata. Many phones strip EXIF when sharing, so genuine photos can be flagged INSUFFICIENT. The screen explains how to send the original files.
- **The checklist is self-reported.** AquaScan cannot verify the answers.
- **Automated detection is not available** (evaluation pending; see the vision evaluation record).
- **Contact page:** `app/contact/page.tsx` gained a minimal `type=survey&detail=` pre-fill. It is a shared file, so the change is noted here.
