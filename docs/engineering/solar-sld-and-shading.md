# Solar Genius Pro: single-line diagram and horizon shading

Branch `ws/solar-genius-design`, 2026-11-25. Engines: `solar-sld 1.0.0`, `solar-horizon-shading 1.0.0`, `solar-proposal 1.2.0`.
Code: `lib/solar/design/sld.ts`, `lib/solar/design/shading.ts`, `lib/solar/design/sunPosition.ts`, `lib/solar/design/hourly.ts` (horizon hook), `lib/solar/design/proposal.ts`, `lib/solar/design/proposalExport.ts`, `lib/solar/design/proposalForm.ts`, `components/solar-modules/crc/src/pages/ProposalPage.tsx`.
Tests: `tests/regression/solar-sld-shading.test.ts` (31), `tests/regression/solar-sld-shading-ui.test.tsx` (2), `tests/regression/solar-benchmark-cases.test.ts` (17).

Evidence classes used in this document: **MS** manufacturer specification, **PR** published reference, **UA** user assumption, **ME** modelled estimate, **SYN** synthetic test case, **MEAS** measured (none exists yet), **UNSUPPORTED** a conclusion the tool must not draw.

## 1. Where to see it

Route `/solar-genius-pro`, hash `#/proposal` (Proposal page).

1. Click **Load worked example (test values, not a recommendation)**. The **Single-line diagram (preview)** section draws the diagram at once. No finance input is needed for the preview.
2. Optional: answer **Connections (for the single-line diagram)**: grid yes/no, generator yes/no. Unanswered items are drawn dashed and labelled "to be specified by the engineer".
3. **Horizon shading (optional)**: type sectors (`from,to,elevation`, one per line) and/or obstacles (`name,height above array m,distance m,azimuth °,width m`), and the source of the survey. Invalid lines are refused with the reason, and a valid profile is drawn as an elevation-against-azimuth chart.
4. Click **Fetch hourly weather**. The worked example includes the TEST tilt 10°, azimuth 0° and inverter efficiency 0.96, the same values as `solar-proposal-form.test.ts`, so it simulates straight through. Under **Weather and production** the simulated energy now includes the horizon loss, with the monthly table: unshaded beam on the plane, blocked beam, beam loss, plane-of-array loss and AC energy loss.
5. Click **Build proposal**. The proposal view shows the same diagram and the same shading table. **Download PDF** puts the shading table before the disclosures and the diagram on its own A4 landscape page at the end. **Download Excel** adds the sheets "Single-line diagram" and "Horizon shading" (the second only when a horizon was entered).

The status rules are unchanged: any REFUSE gives REFUSED; FOR ISSUE needs a server-verified approval, which does not exist yet, so every proposal is DRAFT (`proposalApproval.ts`; tested in `solar-sld-shading.test.ts` › "shading flows into the proposal…" and the existing approval tests).

## 2. Single-line diagram

### 2.1 What is drawn, and where each value comes from

The diagram is built by `buildSld()` from the same inputs as the proposal. It reruns `validateStrings`, `checkCable` and `checkBattery` (deterministic), so the labels are the check results themselves.

| Element | Value shown | Source / formula | Class |
|---|---|---|---|
| PV array, per MPPT | strings × modules, kWp | design; Pmax | design input, MS |
| String Voc (STC) | N × Voc | module datasheet | MS |
| String Voc at record low | Voc × (1 + β_Voc/100 × (T_min − 25)) × N | check `cold-voc` (IEC 62548-1 practice) | ME from MS + site record |
| String current | 1.25 × Isc × strings | check `isc-mpptN` | ME |
| String fuses | required / not required; rating window 1.5 × Isc < I_n ≤ min(2.4 × Isc, module max series fuse) | check `fusing-mpptN`, `fuse-window-mpptN` | ME |
| DC switch-disconnector | rated ≥ cold string Voc and ≥ 1.25 × Isc × strings | checks `cold-voc`, `isc-mpptN` | ME (minimum ratings only) |
| DC SPD | "need, type and rating to be specified by the engineer; if fitted, maximum continuous voltage ≥ cold Voc" | | TBS |
| Inverter | model, kW AC, max DC V, MPPT range, MPPTs used, current limits | datasheet | MS |
| AC protection | "to be specified by the engineer" (the design holds no inverter AC current, supply voltage or phases) | | TBS |
| Grid | connected / not connected / to be specified | user answer | UA |
| Generator | rating from the hybrid data if entered; the inverter manufacturer's compatibility statement or "not confirmed" | user answer, MS | UA / MS |
| Battery | units × model, kWh, DoD, C-rates, energy check verdict; DC voltage and protection TBS | datasheet, `checkBattery` | MS, ME |
| Cables | CSA, length, current, ampacity and voltage-drop verdicts | `checkCable` (IEC 60364-5-52 inputs typed by the designer) | ME |
| Earthing and bonding | TBS | | TBS |

Nothing the design does not determine is given a value. The phrase "to be specified by the engineer" is the exported constant `TBS`, and the tests check that it appears for the AC breaker and the grid connection.

### 2.2 One model, three outputs

`SldModel` holds the boxes (position, title, wrapped text lines) and the wires. `sldToSvg()` draws it on screen, `drawSldPage()` in `proposalExport.ts` draws the same boxes and text in the PDF, and `sldRows()` lists the same text in the Excel sheet. All text is XML-escaped in the SVG; the test feeds `a&b <x>` as a model name. jsPDF's built-in font covers only WinAnsi, and a character outside it (≥, ≤, −, Greek letters) corrupted the rest of that text run. Every PDF string therefore goes through `pdfSafe()`, which keeps the words and uses ASCII stand-ins (">=" for "≥"; anything unknown becomes "?"). The fix covers the existing PDF tables too. Test: "pdfSafe keeps WinAnsi text…", and the PDF read-back now asserts "rated >= 824.08 V DC and >= 17.38 A".

### 2.3 Safety behaviour

* When the design checks refuse the design (for example cold Voc above the inverter maximum), `designValid` is false and the notes box reads "DESIGN CHECKS REFUSE THIS DESIGN: this diagram is for review only". The proposal itself is REFUSED by the existing rule. Test: "SAFETY: cold Voc above the inverter maximum…".
* When a generator is said to be connected but the inverter has no manufacturer compatibility statement, the diagram says "connection not confirmed". It does not draw a confirmed connection. Test: "generator stated without a manufacturer compatibility statement…".

## 3. Horizon shading

### 3.1 Inputs, units, validation

* Azimuth φ in degrees, clockwise from north (0 = N, 90 = E, 180 = S, 270 = W). Elevation in degrees above the horizontal. Lengths in metres.
* **Sector**: from φ1 to φ2 clockwise (wraps through north when φ1 > φ2; `0,360` is the full circle), elevation 0 ≤ e < 90°.
* **Obstacle**: a vertical rectangle facing the array. Inputs are the height above the reference point h (0 < h ≤ 1000 m), the perpendicular distance d (0 < d ≤ 100 000 m), the centre azimuth a (0–360°) and the width w (0 < w ≤ 10 000 m).
* A source is required: who surveyed, how and when. At most 72 sectors and 50 obstacles.
* Every rule above has a refusal message. Tests: "invalid horizon inputs are refused with a reason" (9 cases) and the UI test.

### 3.2 Formulas

1. **Obstacle elevation.** Along a bearing at θ = φ − a from the obstacle centre, the wall is d / cos θ away. For |θ| ≤ atan(w / 2d):
   e(θ) = atan(h · cos θ / d)
2. **Horizon.** H(φ) = the maximum over every sector and obstacle that covers φ (0 where none does).
3. **Sun position.** Zenith θz and azimuth from `sunPosition.ts`: the NOAA solar-calculator equations, which follow the low-accuracy method of J. Meeus, *Astronomical Algorithms*, 2nd ed. (1998), ch. 25 and ch. 28. This is the same code the hourly engine already used, moved unchanged. Sun altitude α = 90° − θz, with no refraction.
4. **Blocking.** The beam is blocked when α < H(φ_sun). For each hour, six sub-instants are taken at the centres of six 10-minute slices (−25, −15, −5, +5, +15, +25 min from the middle of the hour):
   f = (number with 0 < α < H) / (number with α > 0), and f = 0 when the sun is down at all six.
   Night is therefore never counted as shading.
5. **Plane of array.** The hourly chain is unchanged (Erbs decomposition, isotropic sky, albedo). Only the beam term changes: B′_poa = B_poa · (1 − f).
6. **Monthly and annual factors**, with Σ over the hours of the month or year:
   * beam loss = Σ B_poa·f / Σ B_poa
   * plane-of-array loss = Σ B_poa·f / Σ G_poa,unshaded
   * AC energy loss = 1 − E_AC,shaded / E_AC,unshaded. Both energies come from the same hourly chain, including the temperature, DC losses, inverter curve and clipping.
7. **Sky-view factor (information only).** For isotropic sky radiance L, a horizontal surface receives ∫ L cos θ dΩ = πL from the open sky. The part below elevation H over dφ is L dφ ∫ cos θ sin θ dθ from θ = 90° − H to 90°, which equals L dφ sin²H / 2. Hence
   SVF = 1 − (1 / 2π) ∫₀^2π sin²H(φ) dφ (evaluated on 0.1° steps).
   Check: a uniform 30° horizon gives cos²30° = 0.75.
   The indicative diffuse loss Σ D_sky,poa · (1 − SVF) / Σ G_poa is **reported but not applied**.

### 3.3 Assumptions (stated in the output)

* **Diffuse unchanged.** Sky-diffuse and ground-reflected irradiance are not reduced by the horizon, which understates the loss. The indicative diffuse loss gives its size; for the synthetic case in §4.3 it is 2.11 % of POA.
* **One reference point.** The horizon is seen from one point. Use the lowest module row so the estimate is conservative.
* **Beam blocking is all-or-nothing** at each sub-instant. There is no partial-module or bypass-diode electrical model.
* **No double counting.** With a horizon, the PVWatts v5 3 % shading allowance is set to 0 (`LOSSES_WITH_HORIZON`, labelled `LOSSES_SOURCE_WITH_HORIZON`). The PVWatts v5 manual (§11) says that default "represents blocking of the horizon due to faraway features", which is what the profile now models. If a caller keeps a shading allowance as well, the engine adds a warning to the assumptions (test: "flags a double-counted general shading allowance").
* **Reporting.** Energy and specific yield are shaded. POA irradiation and the performance-ratio reference stay unshaded, so the PR includes the shading.

### 3.4 Consistency and tamper checks (server)

`buildProposal` re-validates the horizon. It refuses loss percentages outside 0–100 %, and it refuses a shading result whose shaded annual energy differs from the production energy by more than 1 kWh (test: "a tampered shading result…"). The shading result is part of the input, so it changes the revision hash. A new approval would be needed, as for any edit.

## 4. Worked examples and the tests that check them

### 4.1 Beam loss behind a uniform 30° horizon (hand calculation) — SYN

Test: `solar-sld-shading.test.ts` › "WORKED EXAMPLE … beam loss behind a uniform 30° horizon".

* **Site:** latitude 0°, longitude 1.85° E, horizontal plane. Date 20 March 2026 (equinox, δ ≈ 0). The longitude cancels the equation of time, about −7.4 min, so solar time ≈ UTC. DNI = 800 W/m² in every hour from 06:00 to 18:00.
* **Sun altitude at the middle of each hour:** α = 90° − 15° × |t − 12 h| = 7.5°, 22.5°, 37.5°, 52.5°, 67.5° and 82.5°, mirrored in the afternoon. The engine gives 7.475°, 22.478°, 37.481° and 82.507°.
* **Beam on the horizontal:** DNI × sin α.
  * Half-day sum of sin α = 0.130526 + 0.382683 + 0.608761 + 0.793353 + 0.923880 + 0.991445 = 3.830649.
  * Daily beam = 2 × 800 × 3.830649 = 6129.04 Wh/m².
* **Blocked hours (α < 30°):** 06:30, 07:30, 16:30 and 17:30. Blocked beam = 2 × 800 × (0.130526 + 0.382683) = 821.13 Wh/m².
* **Beam loss** = 821.13 / 6129.04 = **0.133975 (13.40 %)**, which equals 1 − cos 30°.
* **Engine:** beam 6127.78 Wh/m², blocked 820.31 Wh/m², loss **0.133867**, which is 0.0001 from the hand value (tolerance 0.002). The blocked hours are exactly 6, 7, 16 and 17, each fully blocked.
* **Sky-view factor:** 0.75 (hand value cos²30° = 0.75, tolerance 1e-6).

### 4.2 Sun position against Meeus — PR

Test: "matches Example 25.a … and Example 28.b".

* **Published values (Meeus 1998):** Example 25.a gives apparent declination δ = −7.78507° for 1992 Oct 13.0 TD; Example 28.b gives the equation of time E = +13.7094 min.
* **Hand calculation:** at 1992-10-12 23:59:01 UT (TD − ΔT, with ΔT ≈ 59 s), latitude 0°, longitude 180° E:
  * TST = 1439.017 + 13.709 + 720 = 2172.73 min, so H = 3.1816°.
  * cos θz = cos δ · cos H, which gives θz = 8.4066°.
* **Engine:** θz = 8.4063°, a difference of 0.0003°. The tolerance is 0.02°.

### 4.3 Hourly chain with a horizon — SYN (consistency, not accuracy)

* **Inputs:** a 28-day synthetic series from 1 March, Nairobi coordinates, 17.6 kWp / 15 kW AC, horizon sector 225–315° at 25°.
* **Results:**
  * Unshaded 2621 kWh, shaded 2304 kWh, so the AC energy loss is 12.10 %.
  * Beam loss 23.16 %, POA loss 12.18 %.
  * Sky-view factor 0.9553; indicative diffuse loss 2.11 %, not applied.
* **What the tests assert:** the reported loss equals 1 − shaded/unshaded, a month without data reports null, and with no horizon the result is unchanged (no `shading` member, so revision hashes of existing inputs are unchanged).

### 4.4 Single-line diagram labels (hand calculation) — SYN components

* **Inputs:** test module Voc 49.5 V, β_Voc −0.27 %/°C, 16 in series, record low 10 °C.
* **Hand:** 49.5 × (1 + 0.0027 × 15) × 16 = **824.08 V**, and 1.25 × 13.9 = **17.38 A**.
* **Diagram:** both values appear in the PV box and in the isolator box, which reads "rated ≥ 824.08 V DC and ≥ 17.38 A".
* **Three strings on one MPPT:** fuses are required, with a rating above 1.5 × 13.9 = 20.85 A and at most min(2.4 × 13.9 = 33.36, 25) = **25 A**.
* The same values appear in the Excel sheet and in the PDF text, which is read back with pdfjs ("Excel and PDF").

## 5. PVWatts benchmark: what applies to Kenya and what does not

Source: A. P. Dobos, *PVWatts Version 5 Manual*, NREL/TP-6A20-62641, September 2014 (retrieved 2026-11-25 from docs.nlr.gov/docs/fy14osti/62641.pdf). PVWatts V8 API documentation (developer.nlr.gov/docs/solar/pvwatts/v8, retrieved 2026-11-25). Details are in `solar-source-register.md`.

* **Weather data.** PVWatts v5 offered TMY2, TMY3 (US) and 360 international stations. The V8 API default `nsrdb` includes "NSRDB PSM V4 Meteosat Prime Meridian tmy-2022 1.0.0". NREL describes that dataset as Meteosat imagery covering Africa, Europe and the Middle East, so Kenya falls inside it. Solar Genius Pro uses **NASA POWER hourly** for one actual past year (about 0.5° × 0.625°), not a TMY.
  * The two weather sources differ, so a PVWatts-to-tool energy comparison for a Kenyan site would mix weather differences with model differences.
  * No such comparison was run: nrel.gov/pvwatts.nrel.gov did not resolve from this machine, and the API needs a key. Site agreement with PVWatts is therefore **UNSUPPORTED**.
* **Models that differ:**
  * PVWatts v5 uses the Perez transposition and the Fuentes thermal model (INOCT 45 °C open rack, 49 °C roof).
  * The tool uses isotropic transposition and the NOCT (Ross) cell temperature.
  * These are not benchmarked against PVWatts. The transposition and the whole hourly chain are benchmarked against **pvlib** on identical inputs (`solar-hourly-benchmark.test.ts`, annual within 1 %, monthly within 2 %).
* **Benchmarked with matched inputs** (`solar-benchmark-cases.test.ts`, PR):
  * B1, Eqn 9 / Table 6: total default loss 14.0757 %. The tool matches within 1e-9; the manual prints it rounded as "14 %".
  * B2, Eqn 10: inverter efficiency at ζ = 1, 0.5 and 0.1 is 0.960000, 0.962192 and 0.921628 by hand. The tool matches within 1e-9 at five load points.
  * B3, Eqn 11: clipping to P_ac0 at and above P_dc0, and 0 at P_dc = 0.
* **Shading.** PVWatts has no horizon model: it uses a flat 3 % loss (§11) and recommends external software or a survey for nearby obstructions. The horizon calculation therefore has no PVWatts benchmark. It is checked by hand calculation (§4.1) and by the Meeus sun position (§4.2).

## 6. Uncertainty and limitations register

| # | Limitation | Effect | Next action |
|---|---|---|---|
| L1 | Diffuse not reduced by the horizon | Loss understated by roughly the indicative diffuse loss (reported) | Add the Perez/isotropic diffuse sky-view treatment for tilted planes, then benchmark it against pvlib `pvlib.shading` / SAM |
| L2 | Single reference point; no near shading (row-to-row, parapets, vents, cables) and no electrical mismatch/bypass-diode model | Losses on partially shaded strings understated | Survey-based near-shading or 3D model; until then the engineer adds a near-shading allowance and states it |
| L3 | Hour split into 6 sub-instants | Error of up to about 1/12 h at each horizon crossing | Acceptable for planning; finer steps if needed |
| L4 | Weather: NASA POWER regional grid (about 0.5° × 0.625°), one past year | Year-to-year variation of several per cent; terrain shading in the satellite product is not site-specific | Several years; site pyranometer data in the pilot |
| L5 | Horizon accuracy depends on the survey (inclinometer ±1–2° typical for hand instruments: a planning figure, not a measured one) | At low sun, 1° of elevation can move monthly beam loss materially | Record the instrument and uncertainty in the source field; repeat the survey |
| L6 | No MEASURED comparison exists | Nothing here is field validation | Pilot protocol (`solar-evidence-package.md`) |
| L7 | SLD gives minimum ratings only; it does not select devices, does not size AC protection, and has no earthing design | The engineer must complete every TBS item | Add inverter AC current, supply voltage and phases to the datasheet entry, then size AC protection with a cited method |
| L8 | `validate.ts` applies one current limit to every MPPT; some inverters (e.g. SMA STP10.0 inputs A/B: 20/12 A, 30/18 A) differ per input | A per-input limit could be missed | Use the most restrictive input (as in benchmark C4) until per-MPPT limits are added |
| L9 | Production and shading are computed in the browser; the server re-checks the consistency of shading but cannot recompute without the weather | A modified client could send a different (internally consistent) result | Server-side weather fetch and recomputation (also needed for approval) |
| L10 | Monthly mean-day estimate on the Design Check page has no horizon input | Only the proposal's hourly estimate includes horizon shading | Reuse `hourBlockedFraction` in `production.ts` steps |

**UNSUPPORTED conclusions** (the tool must not claim them): agreement with real installed output; agreement with PVWatts at a Kenyan site; device selection or compliance certification from the diagram.

## 7. References (verifiable)

* IEC 62548-1 (PV arrays, design requirements): by name. The cold-Voc, 1.25 × Isc and string-fuse rules are those already implemented in `validate.ts`. No new clauses are cited here.
* IEC 60364-5-52 (selection and erection, wiring systems): by name, as in `validate.ts`.
* J. Meeus, *Astronomical Algorithms*, 2nd ed., Willmann-Bell, 1998: ch. 25 (Example 25.a), ch. 28 (Example 28.b).
* A. P. Dobos, *PVWatts Version 5 Manual*, NREL/TP-6A20-62641, Sept. 2014: §11 (Table 6, Eqn 9), §12 (Eqns 10–11).
* D. G. Erbs, S. A. Klein, J. A. Duffie (1982), and the isotropic sky (Liu & Jordan): as already used in `hourly.ts`.
* The sky-view factor formula is derived in §3.2 from the isotropic-radiance integral. No external source is claimed for it.

## 8. Test-case programme

| ID | Problem | Inputs (class) | Principle | Independent calculation | Expected | Tolerance | Test | Result |
|---|---|---|---|---|---|---|---|---|
| WE1 | Beam loss, uniform 30° horizon | SYN | α < H blocks beam | §4.1 | 0.133975 | 0.002 | solar-sld-shading › WORKED EXAMPLE | 0.133867 PASS |
| WE2 | Sun position | PR (Meeus) | NOAA/Meeus | §4.2 | θz 8.4066° | 0.02° | solar-sld-shading › Meeus | 8.4063° PASS |
| G1 | Obstacle elevation | SYN | e = atan(h cos θ/d) | atan(0.5) = 26.565°, atan(0.5 cos30°) = 23.413° | as stated | 1e-9 | › obstacle | PASS |
| G2 | Sky-view factor | SYN | isotropic integral | cos²30° = 0.75; 1 − ¼·¼ = 0.9375 | as stated | 1e-6 | › sky-view factor | PASS |
| I1–I9 | Invalid horizon (empty, no source, az < 0, e ≥ 90, e < 0, zero width, h < 0, d = 0, no name) | SYN | refuse with reason | — | refusal text | — | › invalid horizon inputs | PASS |
| S1 | SLD labels | SYN components | IEC 62548-1 checks | 824.08 V, 17.38 A | in SVG/XLSX/PDF | exact text | › labels come from the design; › Excel and PDF | PASS |
| S2 | String fuse window | SYN | 1.5 Isc < I_n ≤ min(2.4 Isc, fuse max) | 20.85 A / 25 A | as stated | exact text | › three strings | PASS |
| S3 | SAFETY: refused design on SLD | SYN | cold Voc > max | 21 × 51.50 V > 1000 V | marked refused | — | › SAFETY: cold Voc | PASS |
| P1 | Shading tamper | SYN | server consistency | — | refused | — | › tampered shading | PASS |
| B1 | PVWatts total loss | PR | Eqn 9 | 14.0757 % | equal | 1e-9 | solar-benchmark-cases › B1 | PASS |
| B2 | PVWatts inverter curve | PR | Eqn 10 | 0.96 / 0.962192 / 0.921628 | equal | 1e-9 | › B2 | PASS |
| B3 | PVWatts clipping | PR | Eqn 11 | P_ac0 = 10 kW | equal | 1e-9 | › B3 | PASS |
| C1 | 18 × Jinko JKM590N on SMA STP10.0 | MS + UA (T_min 5 °C) | cold Voc ≤ 1000 V | 18 × 52.63 × 1.05 = 994.71 V | PASS | 0.01 V | › C1 | PASS |
| C2 | SAFETY: 19 modules on SMA | MS + UA | cold Voc ≤ 1000 V | 1049.97 V | REFUSE | 0.01 V | › C2 | PASS |
| C3 | SAFETY: Deye SUN-8K 500 V | MS + UA | cold Voc ≤ 500 V | 9: 497.35 V PASS; 10: 552.62 V REFUSE | as stated | 0.01 V | › C3 | PASS |
| C4 | Boundary: SMA input B max Isc 18 A | MS | 1.25 Isc ≤ max Isc | 17.66 A | PASS, margin 1.9 % | 0.01 A | › C4 | PASS |
| C5 | SAFETY: 2 strings on SMA input A (30 A) | MS | 1.25 Isc × 2 | 35.33 A | REFUSE | 0.05 A | › C5 | PASS |
| C6 | Missing evidence: Jinko F8 prints no NOCT, no β_Vmp | MS | refuse to build, name gaps | — | module null, gaps listed | — | › C6 | PASS |
| D1 | Dataset records well-formed, evidence class kept | MS | schema/provenance | — | no errors | — | › MS records (5 files) | PASS |

In C1–C5, β_Vmp −0.30 %/°C and NOCT 45 °C are **user assumptions**, because the Jinko sheet prints neither. They do not enter the asserted cold-Voc and Isc values. The site temperatures 5 °C and 30 °C are user assumptions standing in for a station record.
