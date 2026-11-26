# AquaScan Pro: time-series pumping-test analysis

Branch `ws/aquascan-pumptest-timeseries`, 2026-11-25. Code: `external/borehole-ai-engine/src/pumpTestTimeSeries.ts`.
Tests: `tests/regression/aquascan-pumptest-timeseries.test.ts` and `tests/regression/aquascan-pumptest-timeseries-exports.test.tsx`.

This adds an analysis of a constant-rate pumping test entered as **timed readings**. The single-reading path is unchanged. One rate and one drawdown still give only the observed specific capacity, with INSUFFICIENT EVIDENCE for everything else (`buildFieldPumpTestAnalysis`, `aquascan-single-reading-safety.test.ts`).

**All benchmarks below are synthetic.** They test that the formulas and code are correct. They are **not field validation.** Field validation needs a real test-pumped borehole: see `aquascan-evidence-package.md`.

## 1. How to enter a time series (UI path)

1. Open AquaScan Pro, then **Field Data → Add field evidence → 2. Pumping test**.
2. Set **Test type** to *Constant-rate test with timed readings (time series)*.
3. Enter the source: contractor, test date, method or standard, and report number. All four are required.
4. Enter the static water level, in m below ground. Enter the **pumping rate at the start**, in m³/h.
5. Choose **Readings are**: *Drawdown* (m below the static level), or *Water level* (m below ground). Water levels are converted to drawdown as level minus static level. A level above the static level is rejected.
6. Optional fields:
   - **Observation-well distance** in m. Leave it empty for readings in the pumping well; storativity is then not reported.
   - **Pump intake depth.** It gives the available drawdown.
   - **Pump stopped at** in min. This is required if recovery readings are entered.
7. **Drawdown readings.** Paste two columns from a spreadsheet into the box, then press *Use pasted drawdown readings*. Tab, semicolon, comma and space separators all work, and a decimal comma is accepted with tab or semicolon. A header is allowed. A header that names another unit (h, s, ft, cm, …) is refused. You can also type rows directly, and *Add a row* or *Delete* them.
8. Optional: **Rate changes** (time of change, new rate) and **Recovery readings** (t′ since stop, residual drawdown or level).
9. Press **Add pumping test**.
   - If the entry is invalid, every reason is listed and nothing is added.
   - If it is valid, `fieldData.pumpTest` is set with `timeSeries`. The summary fields (tested rate, duration, end drawdown, recovery %) are derived from the readings. The recovery % is left out when there is no recovery data.
10. Run the analysis. The **Pump Test** tab shows the result table, a semi-log plot (measured readings, Theis fit, Cooper-Jacob line), the limitations, the assumptions and references, and the Theis residuals.

## 2. Methods and formulas

Symbols and units:

| Symbol | Meaning | Unit |
|---|---|---|
| s | drawdown | m |
| t | time since pumping started | min (input), day (internal) |
| Q | pumping rate | m³/h (input), m³/day (internal) |
| T | transmissivity | m²/day; also given in m²/s |
| S | storativity | – |
| r | distance from the pumping well | m |

### 2.1 Theis (1935): full-curve fit

$$s = \frac{Q}{4\pi T}\,W(u),\qquad u = \frac{r^2 S}{4 T t},\qquad W(u)=E_1(u)$$

- **W(u).** Exact series, from the existing `wellFunction`. It is benchmarked against `scipy.special.exp1` with error < 1e-6 (`aquascan-pumptest-benchmark.test.ts`).
- **Fit.** Least squares on (ln T, ln P), where P = r²S. Levenberg-Marquardt with a central-difference Jacobian, seeded from a coarse grid. The fit is deterministic.
  - Fitting P rather than S means a pumping-well test needs no assumed well radius.
  - S = P/r² is reported **only for an observation well**.
- **Quality reported.** R², RMS residual, the largest residual and every residual.
- **Uncertainty.** A linearised 95 % interval from σ²(JᵀJ)⁻¹. It is labelled "statistical only": it excludes model error.
- **Used only if** R² ≥ 0.98.

### 2.2 Cooper and Jacob (1946): straight line

$$s = \frac{2.303\,Q}{4\pi T}\log_{10}\frac{2.25\,T t}{r^2 S}\quad\Rightarrow\quad T = \frac{2.303\,Q}{4\pi\,\Delta s},\qquad S = \frac{2.25\,T t_0}{r^2}$$

Here Δs is the drawdown per log cycle, and t₀ is the time where the line meets s = 0.

- **Segment selection.** Start with the second half of the readings, fit the line, compute T and P, and then keep only the readings with t > P/(0.04 T). Repeat until the segment is stable.
- **Validity check: u < 0.01.** The time after which u < 0.01 holds is reported, and so is whether every reading in the segment satisfies it ("met" or "NOT met").
  - If fewer than 3 readings satisfy it, the line is fitted to the last 3 readings and Cooper-Jacob is marked **not valid**.
  - For a pumping well, r²S is apparent (it absorbs well losses), so the check is indicative. This is stated in the output.
- **Segment sensitivity.** T is recomputed for every window of 3 or more readings that starts or ends inside the chosen segment. The minimum and maximum are reported.
- **Used only if** u < 0.01 is met and R² ≥ 0.95.

### 2.3 Theis recovery

$$s' = \frac{2.303\,Q}{4\pi T}\log_{10}\frac{t}{t'},\qquad t = t_p + t'$$

- **Fit.** A line through the late-recovery readings, where u′ < 0.01 by the pumping-phase estimate (otherwise the later two-thirds of the readings).
- **Reported.** T, R², and the extrapolated s′ at t/t′ = 1. The ideal value is 0; any other value is reported, not interpreted.
- **Storativity is not determined** from recovery.
- **Constant rate only.** Recovery is not analysed if the rate changed, because superposition is not implemented.
- **Used only if** R² ≥ 0.95.

### 2.3a Leakage diagnosis: Hantush and Jacob (1955) (S40 / CA-11, 2026-11-26)

- **Mechanism.** In a leaky aquifer, water leaks through the aquitard, so the late drawdown rises more slowly than Theis and approaches a steady state (Kruseman & de Ridder 1994, section 4.2.1). A confined-model fit then sees a flatter curve and **overstates T**.
- **Model.** s = Q/(4πT) · W(u, r/L), with W(u, β) = ∫_u^∞ (1/y)·exp(−y − β²/(4y)) dy and L the leakage factor. β = 0 is Theis exactly. W is computed by Simpson's rule in ln y (`hantushW`); it is tested against Theis W(u) as β → 0, the steady state 2·K₀(β) and the identity W(u, β) + W(β²/4u, β) = 2·K₀(β).
- **Fit.** Least squares on (ln T, ln r²S, ln β), seeded from the Theis fit, with a linearised 95 % fit interval on T.
- **Diagnosis: both conditions must hold.**
  1. The leaky model fits significantly better: extra-sum-of-squares F test for one added parameter, at the 1 % level. The critical value is F(0.01; 1, n−3).
  2. The last quarter of the readings (at least 3) lie on average **below** the Theis curve. That is the late-time flattening. A barrier boundary steepens the curve instead, so it cannot pass.
- **When leakage is diagnosed:**
  - Theis, Cooper-Jacob and Theis recovery are marked "Not used". Their values stay on screen for comparison.
  - T (and S with an observation well) come from the leaky fit **only if its 95 % fit interval is within ±10 % of the fitted value** (`LEAKY_T_TOLERANCE`, the same ±10 % agreement tolerance used in section 5a).
  - Otherwise the result is INSUFFICIENT EVIDENCE and **no T is given**. The screen says why.
  - The planning projection is withheld, because the straight line does not describe a leaky aquifer.
  - The statement is shown as a Warning row and a "Leakage (Hantush-Jacob)" row, and the plot shows the leaky fit.
- **Not modelled:** aquitard storage (Hantush 1960).

### 2.4 Reported transmissivity and uncertainty

- **Primary method.**
  - Pumping-well test: **Cooper-Jacob**. It uses the slope only, so a constant well loss does not affect it.
  - Observation-well test: the **Theis fit**, because it uses every reading.
  - Each falls back to the next valid method.
  - When leakage is diagnosed (section 2.3a), only the leaky fit is used, within the ±10 % tolerance, or no T is given.
- **Uncertainty reported.** The range between all valid methods, as a spread in % of the reported value, plus the segment sensitivity and the Theis 95 % fit interval.
  - A spread over 30 % gives a warning: "treat T as an order of magnitude".
- **No valid method.** The result is INSUFFICIENT EVIDENCE, with no T, no S and no projection.

### 2.5 Storativity

Storativity is reported only with an observation well at an entered distance. For a test in the pumping well alone the output says: "Storativity is not reliably determinable from readings in the pumping well alone (well losses, the effective well radius and well-bore storage control the early drawdown). An observation well at a measured distance is needed."

### 2.6 Variable rate

Superposition is **not implemented**. The output says: "Variable-rate analysis not supported: constant-rate segment analysed (0 to t₁ min at Q₁ m³/h)". Only the readings before the first change are used. If fewer than 6 remain, the result is INSUFFICIENT EVIDENCE.

### 2.7 Yield: no sustainable yield

The analysis states no sustainable or safe yield. It states:
- the tested rate and drawdown, which are measured;
- the observed specific capacity Q/s at the end of the constant-rate segment;
- a **planning estimate**, when it is not withheld.

The planning estimate is the drawdown projected by the Cooper-Jacob line after 365 days of continuous pumping at the tested rate. It is compared with the available drawdown (pump intake depth minus static level) when that is entered. It is labelled "PLANNING ESTIMATE (extrapolation, not a measured or sustainable yield)", tagged *[Planning estimate: modelled, assumptions stated]*, and carries three stated assumptions.

**The 365-day planning estimate is a modelled projection, not a sustainable-yield determination; the abstraction rate must be determined by a registered hydrogeologist.** The output repeats this sentence with every presented estimate.

It is **withheld** when any of these holds:
- there is no valid T;
- the rate changed;
- Cooper-Jacob is not valid;
- the test lasted less than 24 h;
- fewer than 3 valid readings come before the last log cycle, so the trend cannot be checked;
- drawdown **accelerates** in the last log cycle (slope more than 1.25 × the earlier slope: a possible barrier boundary).

A flattening late slope (less than 0.75 × the earlier slope) gives a warning that the projection may overstate drawdown.

The output never uses verdict words such as "good aquifer" or "excellent". A test checks this.

### 2.8 Validation of inputs (rejected with reasons, nothing clipped)

| Input | Rule |
|---|---|
| Readings | At least 6; times > 0 and strictly increasing; times ≤ 2,000 h |
| Drawdown | Numeric, 0 to 500 m; not all zero |
| Rate | 0 < Q ≤ 500 m³/h |
| Rate changes | Times increasing and before the last reading; new rate > 0 and different from the previous rate |
| Recovery | At least 3 readings; the pump stop time is required and must be ≥ the last pumping reading; t′ > 0 and increasing; 0 ≤ s′ ≤ 1.05 × the largest drawdown + 0.05 m |
| Observation distance | 0 to 5,000 m |
| Intake depth | Deeper than the static level; pumping-well drawdown may not exceed intake depth minus static level |
| Paste | Two numeric columns per line; minutes and metres only |

Non-blocking warnings are kept with the result:
- no reading within 10 min;
- a test shorter than 24 h;
- drawdown falling by more than 2 cm while pumping;
- fewer than 10 readings.

## 3. Evidence classes in the output

Every row's basis column starts with one of these classes:
- **[Measured]**: tested rate, drawdown, specific capacity, test geometry;
- **[Modelled estimate]**: T, S and the fit statistics;
- **[Planning estimate, assumptions stated]**: the drawdown projection;
- **[Not supported]**: INSUFFICIENT EVIDENCE, withheld values, sustainable yield, unsupported methods;
- **[Reference]**: the methods and references.

The single-reading path keeps its own wording, unchanged.

## 4. Screen and exports: same rows everywhere

`analysis.rows` is built once. The same rows are used by:
- the Pump Test tab (`PumpTestTimeSeriesView.tsx`);
- `governingSummary` (the full CSV, Excel and Word);
- the full PDF (executive brief page 2, *PUMPING TEST ANALYSIS (TIME SERIES)*);
- the screening PDF, Word, Excel and CSV (one line per row, via `timeSeriesRowText`);
- JSON: the full result spreads `pumpTestTimeSeries`, and the screening JSON adds it.

The exports test generates real files and reopens them with independent readers: PDF with pdfjs, DOCX with JSZip, XLSX with ExcelJS, and JSON. It checks that the same strings are there. Set `AQUASCAN_EXPORT_DIR` to keep the files.

## 5. Worked examples (synthetic: correctness of the code, not field validation)

The synthetic data are built in the test with an **independent** E₁(u): Abramowitz & Stegun (1964), eq. 5.1.53 (|ε| < 2e-7, u ≤ 1) and eq. 5.1.56 (u ≥ 1). The test checks this E₁ against the scipy values in the fixture. Drawdowns are rounded to 0.01 mm, the TTim fixture's precision.

| Case | Inputs | Independent expectation | Output (this code) | Tolerance | Result |
|---|---|---|---|---|---|
| **A** observation well | T 120 m²/d, S 2e-4, Q 20 m³/h, r 30 m; 40 readings 1–2,880 min; 25 recovery readings to 1,440 min | Δs = 2.303·480/(4π·120) = **0.733 m**; u<0.01 after r²S/(0.04T) = **54 min**; s(365 d) by exact Theis | Theis T **120.00**, S **2.000e-4** (R² 1.0000); Cooper-Jacob T **120.25**, S 1.98e-4, Δs 0.7315 m, valid after 53.3 min, segment 59.4–2,880 min (20 readings), segment sensitivity 120.05–120.92; recovery T **120.33**, s′(t/t′=1) 0.001 m; spread 0.27 %; projection **4.20 m** at 365 d | Theis T 0.5 %, S 1 %; CJ T 1 %, S 5 %; recovery T 2 %; projection 1 % of exact Theis | pass |
| **B** pumping well | T 40, S 1e-3, rw 0.1 m, Q 6 m³/h, constant well loss 1.5 m; intake 40 m below the static level | T from the slope only | Reported T (Cooper-Jacob) **40.01**; S **not reported** (statement); projection 7.78 m vs 40 m available | T 1 % | pass |
| Noise | A with ±1 cm deterministic noise | T = 120 | T within 5 %; 95 % interval brackets the fit | 5 % | pass |
| Variable rate | A with the rate raised to 30 m³/h at 600 min (superposed) | T = 120 from the first segment | "Variable-rate analysis not supported…"; T within 1 %; recovery not analysed; projection withheld | 1 % | pass |
| Barrier boundary | A plus an image well at 600 m | Projection must be withheld | Late slope 1.3 m vs 0.93 m per log cycle, so withheld; spread 32 %, warning | — | pass |
| Low yield | T 0.5, Q 0.5 m³/h, pumping well; 30 m available | Projection > 30 m | T 0.500; projection 33.5 m: "exceeds the available drawdown … cannot be pumped continuously" | T 1 % | pass |
| Dry well | Drawdown beyond the intake depth | Reject | Rejected with the reason | — | pass |
| Flat record | Constant 3 m | No T | INSUFFICIENT EVIDENCE; no fixed 250/500 | — | pass |
| Short | A cut at 6 h | Parameters yes, projection no | Projection withheld (< 24 h) | — | pass |
| Too few at the rate | Rate change after 4 readings | No parameters | INSUFFICIENT EVIDENCE | — | pass |
| TTim 0.8 basement | T 25, S 1e-4, Q 5, r 20 (TTim, independent model) | Known T, S | T 25.00, S 1.000e-4; CJ 25.06 | Theis 1 %, CJ 3 % | pass |
| TTim volcanic | T 150, S 5e-4, Q 15, r 40 | Known | T 150.00, S 5.00e-4; CJ 150.64; projection withheld (valid line < 1 cycle before the last) | as above | pass |
| TTim sedimentary | T 400, S 2e-4, Q 30, r 60 | Known | T 400.00, S 2.000e-4; CJ 401.1 | as above | pass |

## 5a. Independent published reference: "Oude Korendijk" (Kruseman & de Ridder)

**Source.** Kruseman, G.P. and de Ridder, N.A., with J.M. Verweij (1994). *Analysis and Evaluation of Pumping Test Data*, Second Edition (Completely Revised). ILRI Publication 47, Wageningen. ISBN 90 70754 207. Public copy at EU JRC AquaKnow; it has a text layer.

| Item | Where in the book |
|---|---|
| Site and test: confined aquifer 18–25 m; Q = 9.12 l/s = 788 m³/d for nearly 14 h; piezometers at 0.8, 30, 90 and 215 m | p. 56 |
| Data: Table 3.1, piezometers H30 and H90 | p. 59 |
| Theis answer (Example 3.3) | p. 65 |
| Jacob answer (Example 3.4) | p. 68 |
| Summary (Table 3.3) and conclusion | pp. 70–71 |

The original data are from Wit (1963).

**Machine-readable data.** timflow (MIT licence), `docs/transient/04pumpingtests/data/piezometer_h30.txt` and `piezometer_h90.txt`:
- H30 SHA-256 `a705d2fc…eb3edb5`;
- H90 SHA-256 `3d31d0f7…eda4eaa5`.

Every value in both files was compared with the text layer of the book's Table 3.1: they are identical. Fixture: `tests/fixtures/oude-korendijk.json`. Test: `tests/regression/aquascan-pumptest-oude-korendijk.test.ts`.

**Published answers:**
- **Jacob, H30** (p. 68): Δs = 0.375 m per log cycle, t₀ = 0.25 min, so **KD = 385 m²/d, S = 1.7e-4**. Validity is stated as u < 0.1 for t > 1.4 min.
- **Jacob, H90** (p. 68): KD = 450 m²/d, S = 1.7e-4. The book calls this "less reliable".
- **Theis** (p. 65): type-curve match of s against t/r² for H30 and H90 together, giving **KD = 392 m²/d, S = 1.6e-4**.
- **Table 3.3:** the methods give 370–431 m²/d. The text of Example 3.6 gives 437 for "Jacob 3", where Table 3.3 gives 431.
- **Conclusion** (p. 71): **KD = 390 m²/d, S = 1.7e-4**.
- **Caveat** (p. 70): the book states that the late-time data are probably influenced by leakage and that graphical methods are never accurate.

**Result 1: the book's arithmetic is reproduced exactly from its stated inputs.**
- Jacob: 2.303·788/(4π·0.375) = 385.1, which rounds to **385**. S = 2.25·385·(0.25/1440)/30² = 1.67e-4, which rounds to **1.7e-4**.
- Theis match point: 788·1/(4π·0.16) = **392**, and S = 4·392·(1.5e-3/1440)·0.1 = **1.6e-4**.
- Tolerance: the book's rounding. **Pass.**

**Result 2: the tool's least-squares analysis on the same readings, compared with the book's graphical answers. Recorded as found; the code was not tuned to match.**

| Quantity | AquaScan | Published | Difference | RMS misfit to the readings (book's T, S / AquaScan's) |
|---|---|---|---|---|
| H30 Theis T, S | **480 m²/d, 1.13e-4** (R² 0.990; 95 % fit interval 461–500) | 392, 1.6e-4 (Theis); conclusion 390, 1.7e-4 | **+23 %** T; −34 % S | 0.093 m (book Theis) / **0.032 m** |
| H30 Cooper-Jacob T | **542 m²/d** (u < 0.01 segment 4–830 min); segment-choice range 370–897 | 385 (u < 0.1, graphical line) | +41 % | 0.097 m (book Jacob) |
| H90 Theis T, S | **501 m²/d, 2.04e-4** | 450, 1.7e-4 (Jacob H90) | +11 % | 0.063 m (book Jacob H90) / **0.023 m** |
| H90 Cooper-Jacob T | 601 m²/d | 450 | +34 % | — |

**Why they differ, and why the code was not changed.**
1. **Leakage.** The aquifer is leaky, so late drawdowns rise more slowly than Theis (book pp. 65, 68, 70). A least-squares fit over the whole record, or a Cooper-Jacob line restricted to u < 0.01 (the late part), gives a flatter slope and therefore a higher T. The book's graphical lines favour the early and middle data.
2. **Criterion.** The book applies Jacob with u < 0.1, after 1.4 min. AquaScan applies the stricter u < 0.01 (Cooper & Jacob 1946; Kruseman p. 65 gives the errors: < 1 % at u < 0.03 … 10 % at u < 0.15). Even a least-squares line over the book's window (t ≥ 1.4 min) gives 503 m²/d, not 385. The book's line is a graphical judgement.
3. **Pooled data.** The book's Theis match pools H30 and H90 on one s against t/r² plot. AquaScan analyses one piezometer at a time.
4. **Misfit.** The book's parameters fit the H30 readings three times worse (RMS 0.09 m against 0.03 m). They are not wrong; they are a leakage-aware graphical judgement that the confined Theis model cannot represent over the whole record.

**Conclusion.**
- The formulas are verified: the book's arithmetic is reproduced exactly.
- On a leaky field test, the confined-model T is 11–41 % above the book's, depending on method and piezometer. That is outside a 10 % agreement tolerance, so this case does **not** pass as agreement.
- The tool's Cooper-Jacob segment-sensitivity range (370–897 m²/d) contains the published 385.

**Result 3 (S40 / CA-11, 2026-11-26): leakage diagnosed, leaky T matches the book within ±10 %.** Test: `tests/regression/aquascan-pumptest-leakage-s40-2026-11-26.test.ts`. The method (section 2.3a) was not tuned to this case; the tolerance is the ±10 % stated above.

| Quantity | H30 (r = 30 m) | H90 (r = 90 m) | Published |
|---|---|---|---|
| Leakage diagnosed | yes: F = 77.6 (1 % critical 7.53); last 9 readings 0.023 m below Theis | yes: F = 53.0 (critical 7.50); 0.016 m below Theis | "late-time data influenced by leakage" (p. 70) |
| T, leaky fit | **416 m²/d** (95 % fit interval 400–433; R² 0.997) | **421 m²/d** (397–445; R² 0.997) | conclusion 390; methods range 370–431 |
| Difference from 390 | **+6.6 %** (within ±10 %) | **+7.9 %** (within ±10 %) | — |
| S | 1.56e-4 | 2.38e-4 | 1.7e-4 |
| Leakage factor L | 931 m | 907 m | — |

The two piezometers give the same T (1 %) and the same L (3 %), as one aquifer should. The confined-model values (Theis 480, Cooper-Jacob 542 for H30) are no longer reported as T on this record. Results 1 and 2 above are unchanged and kept as the record of the confined-model comparison.

**Known gap (as found before S40; resolved by Result 3): leakage was not flagged.** The tool did not warn about leakage on this record. Its methods spread is 13 %, below the 30 % warning level. The flattening check (late slope 0.23 against 0.30 m per log cycle, ratio 0.77) is just above its 0.75 threshold and runs only for the planning estimate. The threshold was deliberately not lowered to fit this case. Recorded as limitation L12. Resolved by mechanism, not by the threshold: the Hantush-Jacob diagnosis (section 2.3a). The flattening check on the planning path is unchanged.

**Code fix found by this case.** The Cooper-Jacob segment iteration oscillated on H30 and ended on a segment that failed its own u < 0.01 check. It now falls back to the earliest self-consistent segment (start 4 min). All earlier tests are unchanged.

**Other sources checked for text-form published examples:**
- USGS WSP 1536-E (Ferris et al. 1962) and USGS PP 708 (Lohman 1972): found, but no example was transcribed.
- Holzbecher (COMSOL paper on Oude Korendijk): the PDF has no text layer.
- timflow notebook: it lists K&dR k = 55.71 m/d (×7 m = 390 m²/d) and "Ss 1.7e-4". The book shows that 1.7e-4 is S, not Ss, so the book itself is used as the reference.

## 6. Limitations register

| # | Limitation | Consequence | Next action |
|---|---|---|---|
| L1 | Confined Theis model plus the Hantush-Jacob leaky model (2026-11-26, section 2.3a); no aquitard-storage (Hantush 1960), Neuman (delayed yield), partial-penetration, well-bore-storage or boundary fits | Leakage is diagnosed and modelled; unconfined tests are flagged (poor fit, method spread, late slope), not modelled | Add Neuman type curves with TTim fixtures |
| L2 | No variable-rate superposition | Only the first constant-rate segment is used; recovery after a rate change is not analysed | Implement superposition with an independent TTim multi-rate fixture before enabling it |
| L3 | Step-drawdown (Hantush-Bierschenk well-loss B, C) not analysed in this increment | Step tests still give only the highest tested rate | Separate increment |
| L4 | S only with an observation well; no well-radius-based S | A pumping-well-only test gives T only, by design | — |
| L5 | No hydraulic conductivity (thickness not measured) | — | Add once a measured screened or saturated thickness is entered |
| L6 | Planning estimate: one horizon (365 d), straight-line extrapolation, no recharge, interference or seasonal decline | Labelled planning figure; not a yield | The hydrogeologist sets the permit yield |
| L7 | One published example (Oude Korendijk, section 5a). The confined-model T is 11-41 % above the book's values; since 2026-11-26 the leaky fit is used there instead and is +6.6 % (H30) and +7.9 % (H90) from the book's 390 m²/d | Agreement on leaky data rests on one published case | Add a second published leaky case and a non-leaky published case |
| L12 | RESOLVED 2026-11-26 (S40 / CA-11). It was: leakage not flagged on the Oude Korendijk record (flattening ratio 0.77 vs threshold 0.75; checked only on the planning path). Now the Hantush-Jacob diagnosis (F test at 1 % plus late-time flattening) flags it on both piezometers | A leaky test is flagged; T comes from the leaky fit within ±10 %, or no T is given | Test the diagnosis on more published leaky tests (see L7) |
| L8 | Synthetic benchmarks only; no field validation | No claim of field accuracy | Pilot per `aquascan-evidence-package.md` |
| L9 | Dry or suction-break readings (drawdown below the intake) are rejected rather than truncated | A record with a pump failure must be cut to its valid part before entry | — |
| L10 | Units fixed to minutes and metres; no conversion | Data in hours or feet must be converted first | — |
| L11 | The full engineering PDF is forced to the basic tier; section 27 is unreachable | The time-series table is printed on brief page 2 instead (checked by a source test, not by rendering the full PDF) | Render the full PDF in a test once a fixture result passes the audit gate |

## 7. References

- Theis, C.V. (1935). The relation between the lowering of the piezometric surface and the rate and duration of discharge of a well using ground-water storage. *Trans. AGU* 16(2): 519–524. doi:10.1029/TR016i002p00519. USGS reprint: https://water.usgs.gov/ogw/pubs/Theis-1935.pdf
- Cooper, H.H. and Jacob, C.E. (1946). A generalized graphical method for evaluating formation constants and summarizing well-field history. *Trans. AGU* 27(4): 526–534. doi:10.1029/TR027i004p00526
- Kruseman, G.P. and de Ridder, N.A. (1990/1994). *Analysis and Evaluation of Pumping Test Data*, 2nd ed. ILRI Publication 47, Wageningen. Ch. 3: Theis 3.2.1, Jacob 3.2.2, Theis recovery 3.2.3. https://research.wur.nl/en/publications/analysis-and-evaluation-of-pumping-test-data-2/
- Hantush, M.S. and Jacob, C.E. (1955). Non-steady radial flow in an infinite leaky aquifer. *Trans. AGU* 36(1): 95–100. Leaky model, section 2.3a; Kruseman & de Ridder section 4.2.1.
- Abramowitz, M. and Stegun, I.A. (1964). *Handbook of Mathematical Functions*, NBS AMS 55, eqs 5.1.53 and 5.1.56 (the independent E₁ in the tests) and 26.7.5 (Student t quantile for the leakage F test).
- Bakker, M. TTim 0.8 (MIT licence): the synthetic fixtures, via `scripts/benchmarks/pumptest_benchmark.py`.

See `aquascan-source-register.md` for the full source register.
