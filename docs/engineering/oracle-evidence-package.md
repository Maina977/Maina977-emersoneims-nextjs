# Generator Oracle — evidence package for a real-fault validation (2026-11-25)

Governing protocol: `C:\Users\User\Documents\EmersonEIMS-proposals\pilot-protocols-2026-11-25\PILOT-PROTOCOL-GENERATOR-ORACLE.md` (Pilot GO-P1). This file lists what to collect and how to run the new guided families inside that protocol. It does not change the protocol. **Binding from the protocol:** any S1 (equipment-damage) or S2 (personnel-safety) unsafe recommendation is an automatic FAIL; a STOP is credited only if it is shown before any hazardous action and nothing afterwards contradicts it.

Note for the protocol owner: the protocol text (Section 1) describes 6 families and engine 1.0.0. This branch has 10 families and engine `oracle-diagnostics 1.1.0 (2026-11-25)`. Record the engine version shown on screen at the run; if management wants the new families in scope, that is decided and signed before testing (protocol Section 5 step 2).

Data note for protocol Section 4: Guided Diagnosis now keeps its answers (and the selected engine/controller model) in browser local storage under `eims-oracle-guided-session-v1`, so a job card can pick them up. Use the separate pilot browser profile and clear it at close, as the protocol already requires for the job-card panel.

## 1. Status of validation

- Field validation: **none yet**. All worked examples (W1–W5) and benchmark cases (B01–B13, `oracle-benchmark-results.md`) are **synthetic**. They show the rules behave as specified; they are not evidence that the tool diagnoses real faults.

## 2. Records to collect (Pack A — known at the time of the fault)

| Record | Needed for families |
|---|---|
| Fault report / call log, symptom verbatim, date | all (routing) |
| Controller make and model **exactly as on the module label**, firmware if shown; engine model exactly as on the engine plate | all (published references are exact-model only) |
| Controller event log export or photo (alarm text, peak rpm, frequency, voltages) | overspeed, hunting, charging |
| Rating plate: kVA, rated rpm, rated frequency, battery system voltage | overspeed (rated rpm), hunting, charging |
| Controller / governor settings sheet or commissioning record: overspeed trip, frequency band, gain settings, flywheel teeth | overspeed, hunting |
| Alternator/engine manual page for regulated charging voltage (lowest / highest) | charging |
| Battery: rest voltage (engine and charger off ≥ 1 h), running voltage, condition, age, type (vented / VRLA) | charging |
| Exhaust: colour, when worst, load % at the time, coolant level trend, oil condition, air-filter indicator | smoke |
| Fuel: tank dip, separator water, filter dates | hunting, smoke |
| Service history ≥ 12 months (dates, hours, work, parts) | all |
| OEM manual references: title, number, revision, page for every limit entered | all |

**Pack B (sealed, after the fault):** strip-down findings, confirmed root cause, parts replaced, repair job card, test-run results.

## 3. Questions the operator answers (from Pack A only)

Use the family's own question list on screen (the review sheet `docs/engineering-apps/oracle-guided-diagnostics-review-sheet.csv` lists every question with its rule). For each answer record its Pack A source. If a value was not recorded, leave it blank or choose "Not checked" — never answer from hindsight. Enter OEM figures only from the manual or settings sheet, with the page; if none is held, leave the figure blank (the related rule then stays silent and the result says so).

## 4. Blind procedure (summary of protocol Section 5)

1. Management assigns the case and the four roles; customer consent signed (Kenya Data Protection Act 2019).
2. Criteria signed **before** testing.
3. Custodian splits records into Pack A / Pack B, seals Pack B as a ZIP and emails its SHA-256 only.
4. Reviewer writes the expected STOP/CAUTION list from Pack A and the OEM manual, dated and hashed.
5. Operator (has not seen Pack B) types the symptom verbatim, records the family it routes to, runs it and any other family whose symptom is in Pack A, answering only from Pack A. Selects the engine/controller model only if it exactly matches a listed model; otherwise "Not listed".
6. Preserve: print-to-PDF of each result screen, **Download this diagnosis (.txt)** for each family run, the answers sheet; hash all files with the expected-stops list.
7. Optional (observed only): record the diagnosis on a test job card (**Record a guided diagnosis**) and export the job-card .txt/PDF; check its text equals the downloaded .txt.
8. Unseal Pack B only after management confirms receipt of the hashes; reviewer re-computes the Pack B hash.
9. Reviewer scores C1–C5 and classifies every error S0/S1/S2.

## 5. Safety review checklist for the new families (reviewer)

For each result, check and record:

- [ ] Every STOP appears above every action and question (on screen and in the .txt).
- [ ] No action or "next check" after a STOP asks to run, crank, start, load, or work live (the tool should show "Withheld while a STOP is active: n check(s)" instead).
- [ ] Mandatory safety lines (lock-off, isolation, hot/pressurised parts, CO, hydrogen) are present.
- [ ] No published reference is shown for a model other than the one on the plate.
- [ ] No OEM figure appears that the operator did not enter (except published references, which must carry their source and "not entered as an answer").
- [ ] Overspeed: no restart or test run is suggested.
- [ ] Charging: no instruction to disconnect a hot/gassing battery before it cools.
- [ ] Smoke: no instruction to run the set to observe smoke in an enclosed space.

## 6. Roles and sign-off

| Role | Name | Signature | Date |
|---|---|---|---|
| Management | | | |
| Records custodian (second person, not the operator) | | | |
| Tool operator (has not seen Pack B) | | | |
| Reviewer (senior generator technician/engineer; conflicts declared) | | | |

Outcome (PASS / CONDITIONAL / FAIL / VOID) is recorded in the tracker as signed and never rewritten.
