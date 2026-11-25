# Generator Oracle — guided diagnostics expansion 1 (2026-11-25)

Branch `ws/oracle-diagnostics`. Engine `oracle-diagnostics 1.2.0 (2026-11-25)` (1.1.0 = expansion; 1.2.0 = exact-threshold rule, increment 2). Content status of every family: **technician review pending**.

## 00. Engine 1.3.0 (2026-11-25): fixes from the independent safety review of 40195d6f

Review: `C:\Users\User\Documents\EmersonEIMS-proposals\oracle-safety-review-2026-11-25\ORACLE-INDEPENDENT-SAFETY-REVIEW.md`. Every reproduction is now a regression test asserting the required behaviour: `tests/regression/oracle-safety-review-2026-11-25.test.ts`.

| # | Fix |
|---|---|
| F1 | **Running steps.** Every step in all 10 families that needs the engine running, cranking or live circuits was moved from `actions` into `runningChecks`, prefixed "Only when no STOP is active". This covers cut-out tests, cranking voltage drop, the mechanical gauge, flashing the field, reducing load, the core temperature drop, oil consumption, compression tests and cold-start procedures. `actions` are now only steps that are safe with the set stopped and isolated, checked by a lexicon test over every action of every family. Running-only questions were tagged (Knock: loudest-when, oil pressure, exhaust). A guard test covers every STOP rule and every protective limit of all 10 families, with every choice-option variation (>100 STOP states). Each must show STOP first and no running step, check or question after it. |
| F2 | **Cautions after a STOP.** While any STOP is active, no CAUTION that implies continued running is shown. Limit CAUTIONs become "Also recorded for the investigation (the STOP above applies): …". Rule CAUTIONs carry a stopped-engine `underStop` wording: fuel spray, lethal terminals, parallel breaker, load above rating. Mandatory texts were reworded so they are safe in either state. |
| F3 | **Shared safety screen.** A cross-family safety screen (`lib/generator-oracle/diagnostics/safetyScreen.ts`) is asked first in every family and answered once per session. It covers: controller shutdown/protective alarm; knocking/bearing noise; metal in oil; milky oil; white smoke with coolant loss or coolant loss with sweet smell; overspeed/runaway; seized/tight engine; hot/swollen/gassing battery; burning smell/smoke/arcing; fuel leak. Any "yes" (or a shutdown alarm) is a STOP in every family. A STOP raised by any family's own rules or limits is carried into every other family's result, shown as "STOP (raised in "<family>")", and into every job-card record (`sessionSafety.ts`). Overheating also STOPs on coolant low with the temperature at the limit entered. |
| F8 | **Coolant into the cylinders.** Coolant loss with a sweet exhaust smell gives STOP whatever the smoke colour. A leading cause marked `doNotRun` withholds running checks even without a STOP, so "Do not run" and "a supervised run" never appear together. The causes marked `doNotRun` are: seized engine, bearings, head gasket, coolant into cylinders. |
| F4 | **Tolerance.** A reading within the measurement tolerance of a shutdown limit, or of an unclassified protective limit, is treated as reached: STOP. Within tolerance of a warning value gives CAUTION, and never "re-measure while running". |
| F5 | **Card wording.** The card, the .txt and the reading limit sources say "classification NOT STATED — treated as STOP (conservative software safeguard)" for protective limits. "Treated as CAUTION" appears only for non-protective limits. |
| F6 | **STOP first in exports.** STOP lines are the first lines of the record. A record with a STOP goes to the top of the card's findings. The .txt and the PDF open with a "SAFETY — STOP" section before ASSET, red and bold in the PDF; STOP lines are highlighted wherever they appear. |
| F7 | **Published limits.** A limit entered with "Use published value" names its dataset entry. It is refused, and becomes NOT VERIFIED, when that model is no longer selected or the typed plate (manufacturer, model) disagrees. The panel also clears it when the equipment changes. The button is offered only when the typed plate agrees. |
| F9 | **Alarms and zero readings.** The screen's "controller shutdown / protective alarm" answer gives STOP until verified, even if a gauge reads normal. Zero oil pressure and zero insulation give a STOP labelled "This is a conservative software safeguard, not an OEM limit." No number other than zero is used. |
| F10 | **Number input.** Every numeric field shows its units. Numbers must be plain decimals: hexadecimal, exponents, Infinity and units in the field are refused with the reason. A decimal comma is accepted ("1,5" = 1.5). "1,500" is refused as ambiguous. Unit mix-ups inside the accepted range (psi typed as kPa) cannot be detected and remain a limitation (L14). |
| F11 | **Management decision.** Charging over-voltage stays non-protective: unclassified gives CAUTION, as documented. The hot, swollen or gassing battery STOPs (family and screen) still stop immediately. |

## 0. Increment 2 (2026-11-25): exact-threshold rule and provenance

Management decision: **equality with a limit counts as reaching it**, unless the OEM document defines a different comparison (recorded where it does).

| Situation | Result |
|---|---|
| Reading strictly inside the limit entered | "INSIDE LIMIT", no limit alarm (never described as safe) |
| Reading within the measurement tolerance entered (`± units`) but not at the limit | CAUTION "AT OR NEAR THE LIMIT — re-measure"; for a shutdown value it adds the conditional STOP instruction |
| Reached, classified **shutdown** | STOP (the family's shutdown message) |
| Reached, classified **warning** | CAUTION — a shutdown is never derived from a warning value, however far it is exceeded |
| Reached, classification **not stated**, **protective** parameter | Conservative software **STOP**, wording management-confirmed 2026-11-25 and identical on screen, in job-card findings, .txt and PDF: "STOP — Protective threshold classification not verified. Do not continue operating until the applicable manufacturer limits have been confirmed by a qualified technician." followed on a separate line by "This is a conservative software safeguard, not a manufacturer instruction." It never states or implies a manufacturer shutdown at the unverified value. The classification is still the next question asked |
| Reached, classification **not stated**, non-protective parameter | CAUTION "LIMIT REACHED — NOT CLASSIFIED … not a confirmed shutdown; this does not clear any STOP … If it is the shutdown value: STOP …"; the classification is the next question asked |
| No limit entered | "NOT VERIFIED", no threshold applied |

**Protective parameters** (management correction 2026-11-25: conservative under uncertainty means stopping the engine). A protective parameter is one whose limit violation risks immediate engine damage or personal hazard. Unclassified at or beyond the limit → STOP. An explicit "warning" classification still gives CAUTION only.

| Limit rule | Protective? | Why |
|---|---|---|
| Oil pressure at/below the minimum entered (`oil-pressure-min`) | **Yes** | Bearing damage within minutes |
| Oil temperature at/above the maximum entered (`oil-temp-max`) | **Yes** | Thin oil starves the bearings |
| Coolant temperature at/above the maximum entered (`coolant-temp-max`) | **Yes** | Head warp, piston seizure; scald hazard |
| Logged speed at/above the overspeed trip entered (`overspeed-trip`) | **Yes** | Mechanical failure, flying parts |
| Insulation at/below the minimum entered (`insulation-min`) | **Yes** (judgement) | Measured off-line, but running below it risks live metalwork (personal hazard) and winding failure; the 1.0 rule was already a STOP |
| Charging voltage at/above the highest entered (`charge-max`) | No (judgement) | Overcharge damage develops over time; the hot/swollen and gassing battery STOP rules still stop immediately |
| Charging voltage at/below the lowest entered (`charge-min`) | No | Battery not charged; no immediate hazard |
| Frequency at/below the lowest steady-state value (`frequency-min`) | No | Load protection; the breaker/load CAUTION applies |
| Frequency swing at/above the band (`swing-band`) | No | Performance band; load CAUTION |

Implementation: `NumberQuestion.oemLimit {direction, parameter}` marks every OEM figure (11 questions); each has companion answers `<id>.class` (shutdown / warning / not stated) and `<id>.source` (manual ID, revision, page; ≤ 300 characters). `FaultFamily.limits` (9 limit rules in 6 families) compare a reading with an OEM limit at equality (`≤` min, `≥` max). The former strict STOP rules on oil pressure, coolant, insulation and charging voltage became limit rules. Evidence that means "limit reached" now uses the new `leRef`/`geRef` operators; "strictly inside" keeps `ltRef`/`gtRef`. Rating-plate values (rated voltage, rated rpm) are marked `ratingPlate` and are never classified.

Provenance in the export: the job-card findings / .txt / PDF list every OEM figure with parameter, value and units, minimum or maximum, classification, the typed source, and "applies only to: manufacturer …; model …; variant/configuration …". The technician types these three fields on the Guided Diagnosis tab. Test readings carry the same text as `limitSource`. The job-card reading check now also flags a reading equal to its min or max ("is AT the maximum … equality counts as reaching the limit"). The Perkins 1104D coolant maximum (110 °C, shutdown, 48 kPa system) can be entered for that exact model with **Use published value**. That fills value, classification and source; nothing is entered automatically.

Tests: `tests/regression/oracle-exact-threshold.test.ts` covers:
- just inside / at / beyond, for min and max, for shutdown, warning, not-stated and unanswered;
- tolerance cases;
- a warning value never becoming a STOP;
- unclassified never clearing a STOP;
- no limit → NOT VERIFIED;
- export provenance;
- reference-record provenance completeness.

The safety harness in `oracle-diagnostics-expansion.test.ts` now also covers every limit rule at equality with a shutdown classification.

## 1. What changed

| Item | Where |
|---|---|
| Four new fault families: frequency hunting, overspeed shutdown/runaway, charging faults, exhaust smoke | `lib/generator-oracle/diagnostics/familiesExpansion.ts` |
| Engine 1.1.0: mandatory safety shown first; running checks withheld under any STOP; running-only questions never offered as the next check under a STOP; cross-checks between answers | `lib/generator-oracle/diagnostics/engine.ts`, `types.ts` |
| Existing families: 12 questions tagged `needsRunning` (cranking voltage, oil pressure, frequency, voltage, …); two action wordings made unambiguous (battery "load tester"; AVR fuse "before the set returns to service") | `lib/generator-oracle/diagnostics/families.ts` |
| Diagnosis → job card (all ten families) | `lib/generator-oracle/diagnostics/jobCardRecord.ts`, `session.ts`, `components/generator-oracle/panels/ServiceManagementPanel.tsx` |
| Published OEM references, exact-model only | `data/generator-oracle/references/*.json`, `lib/generator-oracle/diagnostics/oemReferences.ts` |
| Review sheet now lists mandatory safety, cross-checks, help text and withheld running checks | `reviewSheet.ts`, `docs/engineering-apps/oracle-guided-diagnostics-review-sheet.csv` (regenerated) |
| Job-card report prints a multi-line finding line by line (.txt and PDF share it) | `lib/generator-oracle/service/maintenance.ts` (FINDINGS section only) |

The families already present (no-crank, no-start, low oil pressure, overheating, knock/seizure, no/low voltage) were not duplicated; "overheating" and "no/low voltage" were candidates in the brief but already existed.

## 2. How to reach each workflow (UI)

`/generator-oracle` → **Fault Center** → **Guided Diagnosis** tab → choose the family tab:

- *Frequency unstable / governor hunting (speed surging)*
- *Overspeed shutdown or runaway*
- *Battery not charging, or overcharging (engine alternator or mains charger)*
- *Excessive exhaust smoke (black, blue or white)*

Or type the symptom ("engine surging", "tripped on overspeed", "battery not charging", "black smoke") and press **Find fault family**. Optional: pick the **Engine model** / **Controller model** to see published references (Section 6).

Record on a job card: **Service & Job Cards** → **Job cards** → open an OPEN / IN PROGRESS / AWAITING PARTS card → **Record a guided diagnosis** → choose the family → check the preview → **Add this diagnosis to the card**. The text is appended to Findings and the measured values to Test readings; the job-card .txt and PDF then carry it. **Download this diagnosis (.txt)** on the Guided Diagnosis tab gives the same text.

## 3. Engine logic and assumptions (applies to every family)

- Score per cause = Σ evidence weights that are true: strongly **+3**, supports **+1**, contradicts **−1**; *excludes* removes the cause with its reason. Ties keep the family's order. Deterministic: same family, answers and engine version → identical result (tested 100× per family).
- Conditions are three-valued: a rule that needs an unanswered question is *unknown* and does nothing. A rule comparing with an OEM figure (`ltRef`, `gtRef`) stays silent until the technician enters that figure. Comparisons are **strict** (`<`, `>`): a reading equal to the limit neither fires a STOP nor supports a conclusion (benchmark B06, B07).
- Validation: number outside the question's physical range, non-numeric text, or an unknown option → refused with the reason, never clipped. Cross-checks refuse implausible combinations (charging band max < min; a band > 18 V for a 12 V system or < 18 V for a 24 V system — a plausibility split between system voltages, **not** an OEM limit).
- Result order: STOPs fired → family mandatory safety (always) → CAUTIONs fired. The UI shows them as alerts above everything else.
- **STOP active ⇒** every cause's `runningChecks` (supervised runs, live measurements, load banks, re-tuning) are withheld and counted; no question marked `needsRunning` is offered as the next check (the field shows a red note instead). `actions` are written to be done with the set stopped and isolated, and are lexically tested never to say run/start/crank/on load/live.
- Units: kPa, °C, V (DC battery, AC line-to-line), Hz, rpm, % of rating, MΩ — stated on every number question.

## 4. The four families

### 4.1 Frequency unstable / governor hunting (`frequency-hunting`)

Questions (safety first): overspeed trip caused? → linkage by hand (stopped, isolated) → in parallel? → swing p-p (Hz, *needs running*) → allowed band (Hz, **per OEM manual — NOT VERIFIED**) → when, governor type, fuel supply, speed sensor, recent gain change, load type, voltage swinging too (*needs running*).

| Rule | Level |
|---|---|
| Hunting caused an overspeed shutdown | STOP — use the Overspeed workflow; do not reset and restart |
| Linkage disconnected / broken / seized | STOP |
| Running in parallel | CAUTION — open the generator breaker, do not re-synchronise until stable (sync limits NOT VERIFIED) |
| Swing > band entered | CAUTION — transfer or shed sensitive loads |
| Mandatory (always) | Lock-off before touching actuator/linkage/sensor; readings on a running set only from panel or fixed test points |

Causes: linkage sticking/worn; gain/stability setting (running check: re-tune — withheld under STOP); fuel air/restriction (running check: sight glass); speed sensor (excluded for mechanical governors; running check: pickup signal); cyclic/non-linear load (excluded at no load); AVR–governor interaction; load sharing in parallel; swing within the band entered (no fault shown — never a pass against ISO 8528-5 unless the band is the agreed one).

**Worked example W1 (synthetic).** Single set, electronic governor, swing 1.2 Hz, band entered 0.5 Hz, hunts at no load, linkage sticking, fuel OK, sensor OK, no gain change, no load, voltage steady.
Hand derivation: linkage = +3 (sticking) +1 (no load) = **4**; gain = +1 (no load) −1 (no change) = **0**; fuel = −1 (fuel OK) = **−1**; sensor excluded (OK); load excluded (no load); AVR excluded (voltage steady); parallel excluded (single); within-band excluded (1.2 > 0.5). Stops: 2 mandatory CAUTIONs + "LIMIT REACHED — NOT CLASSIFIED" CAUTION for the band (1.2 ≥ 0.5, no classification entered); no STOP.
Application output: identical (test `W1`, benchmark B01).

### 4.2 Overspeed shutdown or runaway (`overspeed`)

Questions: what shut it down → runaway? → oil in intake / sump overfull (stopped, cooled) → linkage → when tripped → logged peak rpm → trip setting (rpm, **NOT VERIFIED**) → rated rpm (rating plate) → speed sensor → settings changed.

| Rule | Level |
|---|---|
| Runaway | STOP — keep clear; no restart until uncontrolled fuel source found and a senior technician authorises a supervised test |
| Any overspeed shutdown answered | STOP — no restart until linkage, speed-sensor path and trip setting checked stopped & isolated; a test run is not part of this guide |
| Oil in intake / sump overfull | STOP |
| Linkage disconnected | STOP |
| Mandatory (always) | Do not reset-and-restart; lock off; runaway: keep out of the plane of fan/flywheel/coupling, use E-stop/fuel shut-off/air shut-off if fitted, never block the intake by hand |

Causes: governor/actuator too slow on load rejection; linkage; false trip from speed signal (supported when the logged peak is *below* the trip entered); wrong setpoint / flywheel-teeth / pole setting (strongly supported when the trip entered is below rated speed); engine running on its own oil; over-fuelling at start. No running checks exist in this family by design: after an overspeed trip the guide never directs a run.

**Worked example W2 (synthetic).** Controller overspeed shutdown when the breaker opened; log 1720 rpm; trip entered 1700 rpm (TEST); rated 1500 rpm; linkage OK, sensor OK, no settings change, no oil.
Derivation: governor-response = +3 (load rejection) +1 (1720 > 1700) = **4**; sensor-false = −1 (sensor OK; 1720 < 1700 false) = **−1**; settings = −1 (no change; 1700 < 1500 false) = **−1**; start-fuel = −1 (not at start); linkage and oil-fuel excluded. Stops: STOP (overspeed shutdown), a second STOP (1720 ≥ trip 1700: overspeed is protective, so the unclassified trip setting is treated as a shutdown limit), then 2 mandatory CAUTIONs. Next question: the trip setting, to get its classification (benchmark B02 enters "shutdown"; same stops, no question remains).

### 4.3 Battery not charging / overcharging (`charging`)

Questions: battery condition (look/smell) → belt (stopped) → system voltage → source in question → running battery voltage (*needs running*) → lowest and highest regulated charging voltage (**NOT VERIFIED**) → rest voltage → charge-fail alarm (*needs running*) → D+ / excitation wire → terminals → charger supply → charger output.

| Rule | Level |
|---|---|
| Battery hot or swollen | STOP — stop engine, isolate charger, ventilate, no sparks, do not move until cool |
| Strong gassing / rotten-egg smell | STOP charging |
| Running voltage > highest charging voltage entered | STOP the engine (overcharge) |
| Belt broken/missing | STOP (same belt often drives water pump and fan) |
| Mains charger in question | CAUTION — mains inside the charger; electrician only, isolated |
| Mandatory (always) | Hydrogen: no sparks; negative off first; belt/alternator checks only locked off |

Cross-checks: band max < min refused; band > 18 V on a 12 V system or < 18 V on a 24 V system refused. BCI rest-voltage figure (12.4 V / 24.8 V ≈ 75 % charge) is the same published guide the existing no-crank family uses.

Causes: belt; alternator/regulator undercharge (running check: voltage-drop test — withheld under STOP); regulator overcharge; D+ excitation circuit; connections; battery will not hold charge (strongly when charging voltage is in band but rest voltage below 75 %); no charger supply; charger fault.

**Worked example W3 (synthetic).** 24 V, alternator in question, battery normal, belt OK, rest 24.2 V, running 24.6 V, band entered 27.0–29.0 V (TEST), charge-fail alarm, D+ OK, terminals clean.
Derivation: alt-under = +3 (24.6 < 27) +1 (alarm) = **4**; battery = **0** (rest < 24.8 but running not in band → rule not true); connections −1; charger-supply −1 (alternator only); charger −1; belt, alt-over (24.6 < 29), excitation excluded. Stops: 2 mandatory CAUTIONs + a CAUTION for 24.6 ≤ lowest 27 (not classified; B03 classifies it as a warning value). The voltage-drop running check is shown (no STOP).

### 4.4 Excessive exhaust smoke (`exhaust-smoke`)

Questions (STOP inputs first): coolant loss (cold) → oil on dipstick → oil in intake / turbo outlet (stopped, cooled) → colour (*needs running*) → smell → load % → when → air filter → injectors → oil use → breather fumes → light-load history → water in fuel.

| Rule | Level |
|---|---|
| White smoke with coolant loss or sweet smell | STOP — do not run or crank (hydraulic lock) |
| Milky oil | STOP |
| Oil thinned by fuel | STOP (bearing starvation) |
| Oil in intake / turbo outlet | STOP (runaway, turbo failure) |
| Coolant loss | CAUTION — never open a hot cap |
| Load > 100 % of rating | CAUTION — reduce to rating or stop the set |
| Mandatory (always) | CO: never run enclosed to watch smoke; hot exhaust/turbo; checks only locked off and cooled |

Causes: air restriction (black); overload (black; excluded for blue/white); injectors; turbo seal (blue); ring/liner/guide wear (blue); wet stacking / light load (running check: supervised higher-load run — withheld under STOP); coolant into cylinders (white); unburnt fuel after cold start; water in fuel.

**Worked example W4 (synthetic).** Black smoke at high load, load 115 %, air filter clean, injectors not tested, no coolant loss, oil normal, no turbo oil, smell normal.
Derivation: overload = +3 (black and > 100 %) = **3**; injectors = +1 (black) = **1**; wet-stacking **0**; water-fuel **0**; wear −1 (black); cold-unburnt −1 (full load); air excluded (filter OK), turbo-seal excluded (no oil), coolant excluded (black). Stops: 2 mandatory CAUTIONs, then the overload CAUTION. No STOP.

**Worked example W5 (synthetic, safety-critical).** White smoke, coolant losing, sweet smell, light-load history. STOP first ("Do not run or crank"); coolant = 3+3+1 = **7**; wet-stacking = **3** but its load-bank check is **withheld** (counted, not shown).

## 5. Safety tests (binding)

`tests/regression/oracle-diagnostics-expansion.test.ts`, for **all ten** families and every STOP rule: answers are generated that make the STOP true, then every option of every other choice question is tried. Each run must show: STOP first and all CAUTIONs after STOPs; `stopActive`; no cause's running check among its actions, all counted in `withheld`; no action matching *restart / start the / run the / running / on load / under load / apply load / load bank / live / energise / crank the*; next question never `needsRunning`; and in the job-card record, the STOP lines precede the cause list and no running check text appears. Separately: no text anywhere says keep/continue/carry on running (negated forms only); every running check starts "Only when no STOP is active".

## 6. Published OEM references (exact model only)

See `oracle-source-register.md`. The Guided Diagnosis tab has optional Engine / Controller model selectors listing only models named in the datasets. A dataset entry is shown only for the exact model string selected — never by make or similarity — beside the related OEM-figure question and in a "Published references" box, and is written into the job-card record. It is **never entered as an answer and never used by a rule**: the STOPs still compare against the figure the technician types. Any other model shows "per OEM manual — NOT VERIFIED". Tested: Perkins 1104D NK coolant maximum (110 °C, SEBU8325-01 p. 22) is shown for that model and not for "1106D Industrial Engine", "Perkins 1104D", a lower-case copy or the controller slot; DSE7200/7300 entries are not shown for DSE7310 MKII.

## 7. References cited by the new families

By title only; clauses and values **not verified against a held copy and not used as limits**: ISO 8528-1 (ratings), ISO 8528-5 (generating-set performance classes), ISO 3046-4 (speed governing), NFPA 110 (emergency and standby power systems), IEEE Std 450 (vented lead-acid batteries), IEEE Std 1188 (VRLA batteries), BCI load-test guide (as in the existing families). Every cause also carries "General diesel generator service practice (EmersonEIMS); confirm limits and procedure in the OEM service manual".

## 8. Limitations register

| # | Limitation | Consequence | Next action |
|---|---|---|---|
| L1 | Content is general practice, not reviewed by a senior technician | All four families "technician review pending" | Reviewer fills `oracle-guided-diagnostics-review-sheet.csv` (pilot copy with edition/page/reviewer) |
| L2 | No OEM thresholds are built in | Comparison rules (band, trip, charging voltages) do nothing until figures are entered | Technician enters from the manual; datasets add context for exact models only |
| L3 | Standards cited by title only | No clause-level claim can be made | Obtain copies of ISO 8528-5, ISO 3046-4, IEEE 450/1188, NFPA 110 and cite clauses |
| L4 | (Closed 2026-11-25) Strict comparisons | Replaced by the exact-threshold rule: equality reaches the limit (B06, B07, B14, B15) | — |
| L5 | Weights (+3/+1/−1) are judgement, not statistics | Rank order is a check-list order, not a probability | Calibrate after real pilot cases |
| L6 | Overspeed family never offers a test run | Diagnosis may stop short of confirming governor response | Supervised test by procedure outside the tool, authorised by a senior technician |
| L7 | Running-only questions are tagged by judgement (12 existing + 5 new) | An untagged question could still be offered after a STOP | Reviewer checks the `[needs the engine running…]` marks on the sheet |
| L8 | 18 V plausibility split for 12/24 V systems | Unusual systems (e.g. 32 V, 36 V) are not modelled | Add system voltages if a customer has them |
| L9 | Job-card hand-off uses this browser's storage | A diagnosis made on another device is not visible | Accounts/server storage (out of scope) |
| L10 | All worked examples and benchmarks are synthetic | No field validation yet | Pilot GO-P1 (`oracle-evidence-package.md`) |
| L11 | Reference datasets cover 3 public documents only | Most engines/controllers show NOT VERIFIED | Extend the register (gaps listed there) |
| L12 | Rule management-confirmed 2026-11-25: an unclassified limit on a **protective** parameter gives the conservative software STOP (wording above); on a non-protective parameter it gives CAUTION. Protective list (insulation in, charging voltage out): implemented, management to confirm list | A STOP may appear for a limit the manual actually calls a warning value, until the classification is entered (conservative) | Operators classify from the manual; management confirms the list (Addendum A §A3) |
| L13 | Equipment make/model/variant are typed, not checked against a register | Applicability is only as good as what was typed | Asset register link (out of scope) |
| L14 | Unit mix-ups inside the accepted range (e.g. 30 psi typed into a kPa field) cannot be detected | A limit may be judged on the wrong number | Operator training; the units are shown beside every field |
| L15 | F11 — charging over-voltage is non-protective by management decision | An unclassified over-voltage gives CAUTION, not STOP | Management to confirm the protective list |
| L16 | The cross-family STOP is carried only within one browser session | Answers made on another device are not seen | Accounts/server storage (out of scope) |
