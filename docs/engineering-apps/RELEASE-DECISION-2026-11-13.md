# Engineering apps P0: release decision report

13 Nov 2026 · branch `dev/p0-aquascan-pump-test-integrity` (local, uncommitted) · production unchanged at `079d0188` (`dpl_5SSpj75HqtUG7xjZYLtufj3uj6HB`).

## Decision

**Do not release to production yet. Proceed to a protected preview once the three blockers in §5 are cleared.**

The P0 corrections remove dangerous or false outputs and pass every automated check. Three things still stand in the way:

- a management decision on the two AI keys exposed to Preview;
- approval for two public API changes;
- the solar pricing policy, which is not yet met: the tools still show unsourced indicative prices (**FAILED**, already live in production, not introduced by this branch).

**None of this is professional certification.** 784 automated tests check that the code does what we intended. They do not show that the engineering is right for real sites, and no independent engineer has reviewed it (§4).

## 1. Status by finding

**VERIFIED** = tested against evidence stated. **FAILED** = does not meet a requirement. **UNTESTED** = not yet checked. **BLOCKED** = needs a decision or resource we do not have.

### Generator Oracle

| Finding | Status | Evidence |
|---|---|---|
| Stop-operation guidance for seizure, knocking, bearing noise, metal in oil, overheating, oil/coolant mixing, reverse power, post-overhaul faults (were missing) | VERIFIED | `oracle-critical-safety` 13 tests; 146 existing Oracle tests still pass |
| Cummins 111 = ECM critical internal failure (SPN 629 FMI 12), rated critical; never confused with J1939 SPN 111 (coolant level) | VERIFIED (code) | `oracle-cummins-111-severity` 3, `oracle-cummins-111-vs-spn-111` 4; test fails when the mapping is deliberately broken (mutation check). Two independent records (code map and curated database) agree |
| Cummins 111 engine/controller applicability (which ECMs, which manual edition) | BLOCKED | Needs the Cummins manual or INSITE reference held by the service team; database says "All Electronic", unverified |
| 8 calculators (power, current, load schedule, voltage drop, imbalance, motor-start dip, fuel, derating) | VERIFIED against hand calculations of the stated formulas (19); UNTESTED against independent published worked examples | Published voltage-drop (Schneider EIG) and unbalance (US DOE) examples could not be retrieved (HTTP 403/404); IEC 60364-5-52 and NEMA MG-1 not held |
| Calculators panel works in the browser and refuses bad input | VERIFIED | `oracle-calculators-panel` 3 |

### Solar

| Finding | Status | Evidence |
|---|---|---|
| IRR solved correctly | VERIFIED against an independent published example | Wikipedia "Internal rate of return" example −123,400 / 36,200 / 54,800 / 48,100 → 5.96 % (`independent-references`) |
| Battery sizing (discharge-path efficiency, DoD as inputs) | VERIFIED against the directive benchmark | 20 kWh, 80 %, 90 % → 27.78 kWh (`solar-battery-sizing-r7`, `independent-references`) |
| /solar 3D studio: no random values; losses shown = losses applied; no invented price or tariff; dead buttons removed | VERIFIED (code) | `solar-3d-engine-integrity` 9 |
| Optimiser and Monte Carlo reproducible | VERIFIED | `solar-genius-reproducible` 4 |
| String sizing cold-Voc formula; assumed values listed; minimum-temperature warning | VERIFIED against hand calculation; UNTESTED against a manufacturer-datasheet design | `solar-string-assumptions` 3 |
| **Pricing policy** (only verified, dated prices with source, currency, VAT; otherwise "Request a quotation") | **FAILED** | `lib/solar/sizing.ts` rates have date, KES and "before VAT" but **no source** ("typical"). Shown in 9 places: `/solar`, `api/solar/calculate`, ROI calculator, design studio pro, quote checker, report, calculator and designer pages, SEO tool content |
| Customer-entered rates labelled as user-provided assumptions | VERIFIED (studio) | `Solar3DDesignStudio.tsx` "Your costs (user-provided assumptions)" |

### AquaScan

| Finding | Status | Evidence |
|---|---|---|
| No invented pump-test analysis; specific capacity 12/8 = 1.5 | VERIFIED against the directive benchmark | `aquascan-pump-test-integrity` 9 (mutation-checked) |
| Analysis time 241 s → 81 s; outages handled; repeatable results | VERIFIED | `aquascan-source-outage` 11; release-check AquaScan stage passed 3 runs in a row |
| No false surface-water result | VERIFIED | same file |
| No unsupported accuracy percentages; "success probability" now "Modelled success score, uncalibrated"; fixed outcome removed | VERIFIED (code) | `aquascan-unsupported-claims` 5 |
| Modelled predictions (depth, yield, success score) are correct for real sites | UNTESTED | No historical borehole validation set (directive: 50+) |
| Soil data | BLOCKED | ISRIC server drops ~1 in 3 connections; soil "not known" in all gate runs (stated honestly). Needs a site-hosted Kenya soil layer |
| Pump-test methods (Theis / Cooper-Jacob weighting) | BLOCKED | Needs a registered hydrogeologist |

### Building Suite Pro

| Finding | Status | Evidence |
|---|---|---|
| Slab take-off, openings, invalid input; no invented reinforcement or formwork | VERIFIED against the directive benchmark | 12 × 8 × 0.15 = 14.40 m³ (`building-suite-benchmarks`, `independent-references`) |
| RC beam, EC2 shear, U-value, rational method | VERIFIED against hand calculations; UNTESTED against published worked examples | `building-suite-benchmarks` |
| Description-only report API with invented BOQ withdrawn (501) | VERIFIED (code) | same file; **public API change, see §5** |
| QS/BOQ, quotation, comprehensive report, BIM, frame analysis | FAILED (not implemented: stubs answering "not available") | `lib/wizard-api/dispatcher.ts`; wizard now shows the honest message |

## 2. Reconciliation of P0-AUDIT-2026-11-13.md

All 21 risks were checked against the changed files and tests.

| Risks | Recorded status | Reconciled |
|---|---|---|
| R1, R2, R5, R6, R7, R8, R11, R12, R14–R19 | Fixed | Confirmed: each has a changed file and a passing test (§1). R8 fix is code-verified; applicability BLOCKED (§1) |
| R3 | No longer called | Confirmed: `quickPumpEstimate` exported, unused |
| R4, R13 | Open | Confirmed BLOCKED (hydrogeologist; soil data) |
| R9 | Open | Confirmed open (lint/type coverage of `external/**`) |
| R10 | Partly | Confirmed |
| R20 | Partly | Confirmed: honest message added; QS/BOQ not built |
| R21 | Open | Now decided by management; implementation outstanding (**FAILED** above) |

One correction to the audit: R8 is recorded as needing "owner/engineer to confirm against the Cummins manual". Management has confirmed the mapping. The remaining open item is engine and controller applicability.

## 3. Change inventory and checks

- **Change:** 28 modified + 18 new files (574 lines in, 401 out). No dependency, database, firewall, robots, sitemap or canonical changes.
- **Release check** (lint, build incl. engine type check, STEP2, AquaScan repeatability, route audit 18/18, site audit 0 errors on 433 pages, Googlebot audit, SEO compare): **PASSED**, 13 Nov 19:27–19:56. Since then only tests and two label strings in the /solar studio have changed. The type check on the final state is clean.
- **Unit tests:** 784 total, 102 of them new. All pass. The one exception is a WhatsApp-number scan that times out at 5 s under full-suite load and passes alone; this is a known, pre-existing issue that also occurs on production code.
- **Secret scan of the full change:** 0 findings. No `eval` or raw HTML injection added. The wizard error text is sanitised.
- **New or changed public surfaces:**
  - `/api/qs/takeoff/slab` (new, input-validated, bounded);
  - `/api/building/comprehensive-report` (now 501);
  - `/api/solar/calculate` (two optional inputs, range-checked);
  - data relay (per-host 2-minute pause after a failed source; bounded by its 6 allowed hosts).
- **SEO:** SEO compare and Googlebot audit passed against production. No page route, metadata, canonical, robots or sitemap change.
- **Rollback:**
  - Production stays at `dpl_5SSpj75HqtUG7xjZYLtufj3uj6HB` until a release is approved. If a future release fails, promote that deployment again (Vercel instant rollback); `dpl_6dz9cCRxBqyqNDX3eDnF3fA2pgwE` remains the older fallback.
  - No data migration, so rollback is code-only.

## 4. Test-coverage gaps (what 784 tests do not show)

| Area | Directive requires | Have | Gap |
|---|---|---|---|
| Generator Oracle | 150 OEM, 50 mechanical, 40 electrical/ATS, 40 calculation, 40 safety/invalid, 20 reporting | ~19 calculation, 13 safety, 7 Cummins, plus 146 earlier mapping/ranking tests | OEM cases against manufacturer manuals; mechanical and ATS cases; reports |
| Solar | 80+ calculations, 20 full designs, 10 real-project comparisons | ~40 calculation | Full designs; **0 real-project comparisons** |
| AquaScan | 50+ (then 200+) historical boreholes | 0 | **Entire validation set**; calibration of the success score |
| Building Suite | 60 structural, 40 services, 30 take-off, 40 BOQ, 20 revision, 10 full projects, 30 invalid-input | 5 benchmarks + earlier calc tests | Take-off beyond slabs; BOQ (not built); full projects |
| Independent published references | All calculators | IRR + 3 directive benchmarks | Voltage drop, unbalance, motor start, EC2 beam/shear, U-value worked examples |
| Independent reviewers | Generator/electrical, solar, hydrogeologist, architect, QS, building engineers | **None** | All reviews |

## 5. Blockers before a protected preview

1. **Preview secrets.** Two production secrets reach Preview deployments: `GROQ_API_KEY` and `GEMINI_API_KEY`. Nothing else does; 40 of the 44 variables are production-only, and there are no database, email or payment credentials in Preview. **Decision needed:** remove both from Preview (the AI features then say "unavailable"), or issue preview-only keys with a spending cap.
2. **Public API changes need approval.** `/api/building/comprehensive-report` changes to 501, and `/api/qs/takeoff/slab` is new.
3. **Testers must not submit the contact or enquiry forms on the preview.** The FormSubmit fallback emails the real sales inbox.

The static wizard file keeps its name (`eims-building-suite-v20261105.html`), so browsers may hold the old copy. At release it needs a new versioned file name, which is a new public static URL and therefore needs approval.

## 6. Exact remaining requirements before production

1. Clear §5 blockers, push the branch to a protected preview, and repeat the release check and an end-to-end click-through of the four tools there.
2. **Solar pricing (FAILED):** for each rate in `lib/solar/sizing.ts`, either attach a verified source (supplier quotation or price list with date, currency and VAT status), or replace the cost output with "Request a quotation" in the 9 places listed. The quote checker cannot work without sourced reference prices: keep it only with sourced prices, or withdraw it. SEO tool content changes need approval during the monitoring period.
3. Cummins 111 applicability: the service team names the engines/ECMs and the manual edition.
4. Separate production approval after preview verification.

## 7. P1 priorities (after the release decision)

1. **Generator Oracle guided diagnostics:** the directive's fault families (starting, oil pressure, overheating, smoke, post-overhaul, AVR/excitation, ATS/synchronisation). Measurements in, ranked causes and discriminating tests out, stop rules first. OEM records carry their source and manual version.
2. **Solar Genius design-to-proposal:** one data object from site, load, datasheet-driven string/MPPT/cable/protection checks to a BOQ and a financial proposal on sourced or customer-entered prices.
3. **AquaScan validation and soil data:** collect 50+ drilled boreholes (successful and dry) with depths and yields, and measure error, bias and calibration before any probability is shown. Serve a pre-extracted Kenya SoilGrids layer (CC BY 4.0) from the site.
4. **Building Suite measured take-off and BOQ:** drawing-linked take-off for walls, columns, beams, excavation and finishes; BOQ with codes, units, a dated rate library, preliminaries, contingency and VAT; reports built on that data.

Each P1 item needs its matching independent reviewer before it is offered as a paid professional service.
