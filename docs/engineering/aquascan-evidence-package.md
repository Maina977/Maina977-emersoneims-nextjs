# AquaScan Pro: real-borehole evidence package (field validation)

Branch `ws/aquascan-pumptest-timeseries`, 2026-11-25.
Governing protocol: `C:\Users\User\Documents\EmersonEIMS-proposals\pilot-protocols-2026-11-25\PILOT-PROTOCOL-AQUASCAN-PRO.md` (Pilot 3). Its stages, roles, blinding rules and criteria C1 to C6 govern this pilot. This document lists **what evidence must be collected** to validate the time-series pumping-test analysis on a real borehole. It also lists **how each item is compared** with the tool.

**No real borehole has yet been validated.** Every benchmark in `aquascan-pumping-test-analysis.md` is synthetic. Synthetic benchmarks show that the code solves the equations correctly. They are never field validation.

## 1. Records required (collected and sealed by the custodian at Stage 0)

Record a SHA-256 hash of every file before any stage starts.

| # | Record | Minimum content | Why |
|---|---|---|---|
| R1 | Pre-drilling geophysical survey (VES/ERT) report | Contractor, date, method (array, inversion software), interpreted aquifer depth range, report number | Stage 2 entry; depth gate |
| R2 | WRA authorisation and the **borehole completion record** (Water Resources Management Rules 2021, completion-record provision) | Drilled depth, lithology log, water strikes, casing and screen intervals, static water level, well diameter, coordinates | Geometry; checks the entered static level and intake depth |
| R3 | **Constant-rate pumping-test field sheet**, the original timed record | Date, pump intake depth, rate measurement method (meter or bucket-and-stopwatch) with every rate check, **time-drawdown readings from the first minute** (at least 1, 2, 3, 5, 7, 10, 15, 20, 30, 45, 60 min, then hourly) to the end, ideally ≥ 24 h, any rate change with its time, any stoppage | The time-series input; Theis and Cooper-Jacob |
| R4 | **Recovery record** | Pump stop time; residual drawdown from t′ = 1 min to near full recovery, or as long as was recorded | Theis recovery check |
| R5 | Observation-well data, if any | Measured distance to the pumping well, construction, timed levels | The only basis for storativity |
| R6 | Step-drawdown test, if done | Each step's rate, duration and timed levels | Context; well losses (step analysis not yet implemented, L3) |
| R7 | Laboratory water-quality certificate | Laboratory, accreditation (e.g. KENAS ISO/IEC 17025), sample point and date, parameters with units | Lab entry; water-quality checks in the protocol |
| R8 | **Registered hydrogeologist's interpretation** (independent of EmersonEIMS) | Method(s) used, aquifer model and assumptions, T, S (if determinable), the recommended abstraction rate and its basis | Independent reference for comparison |
| R9 | Custody log | Who held which record, when it was released, and the hash on release | Blinding |

## 2. Roles

| Role | Duty | Independence |
|---|---|---|
| Custodian | Holds R1 to R9 sealed; releases each stage's records only after the previous stage's outputs are hashed and emailed | Not the operator |
| Operator | Runs AquaScan and enters the records through *Add field evidence* exactly as written | Sees only the released records |
| Reviewer (registered hydrogeologist) | Interprets R3 to R5 independently (Stage 3a); runs the same-input checks (Stage 4); signs | No involvement in AquaScan development |
| Management | Signs the criteria before Stage 1 and the assessment after Stage 4 | — |

## 3. Blind stages (as in the protocol, section 6)

1. **Stage 1: screening.** Location only. The tool must show **no depth, yield, cost or payback** (E1).
2. **Stage 2: survey.** R1 is entered. Depth is shown with its citation. Yield and cost stay withheld (E2).
3. **Stage 3a: reviewer interpretation.** R2 to R5 go to the reviewer only. The reviewer records T, S, the method, the aquifer model and a recommended rate. These are hashed and emailed before Stage 3b.
4. **Stage 3b: operator entry.** The operator enters R3 and R4 as a **time series**: the test type is *Constant-rate test with timed readings*, and the readings are pasted from the transcribed field sheet. The operator also enters R7. All downloads are exported: PDF, XLSX, DOCX, CSV and JSON.
5. **Stage 4: checks**, as below. The reviewer signs.

If blinding is broken, the pilot is **VOID** (protocol, section 6).

## 4. Comparisons and checks for the time-series feature

| ID | Check | Method | Pass | Decides pilot? |
|---|---|---|---|---|
| T1 | Transcription | Every reading in the JSON `fieldData.pumpTest.timeSeries` equals the field sheet R3/R4 (time in min, drawdown in m) | Exact | Yes (protocol C2) |
| T2 | Same-input Theis check | The reviewer substitutes the tool's reported T (and S for an observation well) into s = Q W(u)/(4πT), with exact W(u), at each entered time. They compare with the tool's fitted drawdowns (`theis.residuals[].fitted_m`) | Agreement within 5 % at every reading | Yes (protocol C5) |
| T3 | Cooper-Jacob same-input check | The reviewer fits a line over the tool's stated segment and recomputes T = 2.303Q/(4πΔs) and the u < 0.01 time | Within 5 % | Yes (C5) |
| T4 | Tool T vs reviewer's professional T | Recorded ratio. Expect a difference where the reviewer uses a leaky, unconfined or bounded model the tool does not fit | Recorded with the explanation | No: exploratory |
| T5 | Storativity | Pumping-well-only test: the tool must state "not reliably determinable". Observation-well test: record the tool's S against the reviewer's S | Statement present / recorded | Statement: yes (C6) |
| T6 | No unsupported conclusions | No sustainable yield, no "good aquifer"-type wording. The planning estimate must be labelled and assumption-stated, or withheld with a reason | None found | Yes (C6) |
| T7 | Consistency across outputs | The Pump Test tab and every export show identical rows | Identical | Yes |
| T8 | Single reading unchanged | Entering only the summary constant-rate form (one rate, one drawdown) still gives the specific capacity only, with INSUFFICIENT EVIDENCE | Unchanged | Yes |

## 5. Results template (to be completed at Stage 4)

| Item | Field / reviewer value | Tool value | Difference | Tolerance | Pass/fail | Note |
|---|---|---|---|---|---|---|
| Readings transcribed (n) | | | | exact | | |
| Theis T (same inputs) | | | | 5 % | | |
| Cooper-Jacob T (same segment) | | | | 5 % | | |
| u < 0.01 time | | | | 5 % | | |
| Recovery T | | | | recorded | | |
| Reviewer's professional T | | | | recorded | | |
| Storativity statement / value | | | | statement | | |
| Planning estimate status and reason | | | | labelled | | |
| Unsupported wording found | | | | none | | |

## 6. Sign-off

| Role | Name | Signature | Date |
|---|---|---|---|
| Reviewer (registered hydrogeologist) | | | |
| Custodian | | | |
| Management | | | |

## 7. Status and next action

- **Status:** no project assigned, no reviewer appointed, no records collected.
- **Next action (management):** select a borehole with a complete timed constant-rate and recovery record (R3/R4) and a completion record (R2). Appoint the custodian and the reviewer, then sign the protocol's section 12 before Stage 1.
