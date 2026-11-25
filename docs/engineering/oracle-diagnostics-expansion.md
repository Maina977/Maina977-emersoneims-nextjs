# Generator Oracle — guided diagnostics expansion 1 (2026-11-25)

Branch `ws/oracle-diagnostics`. Engine `oracle-diagnostics 1.1.0 (2026-11-25)`. Content status of every family: **technician review pending**.

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
Hand derivation: linkage = +3 (sticking) +1 (no load) = **4**; gain = +1 (no load) −1 (no change) = **0**; fuel = −1 (fuel OK) = **−1**; sensor excluded (OK); load excluded (no load); AVR excluded (voltage steady); parallel excluded (single); within-band excluded (1.2 > 0.5). Stops: 2 mandatory CAUTIONs + swing CAUTION; no STOP.
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
Derivation: governor-response = +3 (load rejection) +1 (1720 > 1700) = **4**; sensor-false = −1 (sensor OK; 1720 < 1700 false) = **−1**; settings = −1 (no change; 1700 < 1500 false) = **−1**; start-fuel = −1 (not at start); linkage and oil-fuel excluded. Stops: STOP (overspeed shutdown) then 2 mandatory CAUTIONs. Next question: none (STOP active, remaining questions answered).

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
Derivation: alt-under = +3 (24.6 < 27) +1 (alarm) = **4**; battery = **0** (rest < 24.8 but running not in band → rule not true); connections −1; charger-supply −1 (alternator only); charger −1; belt, alt-over (24.6 < 29), excitation excluded. Stops: 2 mandatory CAUTIONs. The voltage-drop running check is shown (no STOP).

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
| L4 | Strict comparisons | A reading exactly at a limit gives no STOP and no conclusion (B06, B07) | Reviewer to decide whether "at the limit" should be CAUTION |
| L5 | Weights (+3/+1/−1) are judgement, not statistics | Rank order is a check-list order, not a probability | Calibrate after real pilot cases |
| L6 | Overspeed family never offers a test run | Diagnosis may stop short of confirming governor response | Supervised test by procedure outside the tool, authorised by a senior technician |
| L7 | Running-only questions are tagged by judgement (12 existing + 5 new) | An untagged question could still be offered after a STOP | Reviewer checks the `[needs the engine running…]` marks on the sheet |
| L8 | 18 V plausibility split for 12/24 V systems | Unusual systems (e.g. 32 V, 36 V) are not modelled | Add system voltages if a customer has them |
| L9 | Job-card hand-off uses this browser's storage | A diagnosis made on another device is not visible | Accounts/server storage (out of scope) |
| L10 | All worked examples and benchmarks are synthetic | No field validation yet | Pilot GO-P1 (`oracle-evidence-package.md`) |
| L11 | Reference datasets cover 3 public documents only | Most engines/controllers show NOT VERIFIED | Extend the register (gaps listed there) |
