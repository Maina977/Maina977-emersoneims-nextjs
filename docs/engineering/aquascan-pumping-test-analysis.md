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

### 2.4 Reported transmissivity and uncertainty

- **Primary method.**
  - Pumping-well test: **Cooper-Jacob**. It uses the slope only, so a constant well loss does not affect it.
  - Observation-well test: the **Theis fit**, because it uses every reading.
  - Each falls back to the next valid method.
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

The planning estimate is the drawdown projected by the Cooper-Jacob line after 365 days of continuous pumping at the tested rate. It is compared with the available drawdown (pump intake depth minus static level) when that is entered. It is labelled "PLANNING ESTIMATE (extrapolation, not a measured or sustainable yield)", with three stated assumptions.

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

**Published textbook example.** None is reproduced. The Kruseman & de Ridder "Oude Korendijk" example is the natural candidate, but the public PDF is a scanned image. Its data and stated answers could not be extracted verbatim in this environment: there are no OCR or PDF-render tools, and a summarising web reader is not a verbatim source. So no published-example test is claimed. Next action: transcribe Table 3.2 and the stated KD and S from the printed book, record the page, and add a test with the book's stated tolerance.

## 6. Limitations register

| # | Limitation | Consequence | Next action |
|---|---|---|---|
| L1 | Confined Theis model only; no Hantush (leaky), Neuman (delayed yield), partial-penetration, well-bore-storage or boundary fits | Leaky or unconfined tests are flagged (poor fit, method spread, late slope), not modelled | Add Hantush-Jacob and Neuman type curves with TTim fixtures |
| L2 | No variable-rate superposition | Only the first constant-rate segment is used; recovery after a rate change is not analysed | Implement superposition with an independent TTim multi-rate fixture before enabling it |
| L3 | Step-drawdown (Hantush-Bierschenk well-loss B, C) not analysed in this increment | Step tests still give only the highest tested rate | Separate increment |
| L4 | S only with an observation well; no well-radius-based S | A pumping-well-only test gives T only, by design | — |
| L5 | No hydraulic conductivity (thickness not measured) | — | Add once a measured screened or saturated thickness is entered |
| L6 | Planning estimate: one horizon (365 d), straight-line extrapolation, no recharge, interference or seasonal decline | Labelled planning figure; not a yield | The hydrogeologist sets the permit yield |
| L7 | No published worked example reproduced (section 5) | Correctness rests on synthetic Theis data and TTim | Transcribe Kruseman & de Ridder from the printed book |
| L8 | Synthetic benchmarks only; no field validation | No claim of field accuracy | Pilot per `aquascan-evidence-package.md` |
| L9 | Dry or suction-break readings (drawdown below the intake) are rejected rather than truncated | A record with a pump failure must be cut to its valid part before entry | — |
| L10 | Units fixed to minutes and metres; no conversion | Data in hours or feet must be converted first | — |
| L11 | The full engineering PDF is forced to the basic tier; section 27 is unreachable | The time-series table is printed on brief page 2 instead (checked by a source test, not by rendering the full PDF) | Render the full PDF in a test once a fixture result passes the audit gate |

## 7. References

- Theis, C.V. (1935). The relation between the lowering of the piezometric surface and the rate and duration of discharge of a well using ground-water storage. *Trans. AGU* 16(2): 519–524. doi:10.1029/TR016i002p00519. USGS reprint: https://water.usgs.gov/ogw/pubs/Theis-1935.pdf
- Cooper, H.H. and Jacob, C.E. (1946). A generalized graphical method for evaluating formation constants and summarizing well-field history. *Trans. AGU* 27(4): 526–534. doi:10.1029/TR027i004p00526
- Kruseman, G.P. and de Ridder, N.A. (1990/1994). *Analysis and Evaluation of Pumping Test Data*, 2nd ed. ILRI Publication 47, Wageningen. Ch. 3: Theis 3.2.1, Jacob 3.2.2, Theis recovery 3.2.3. https://research.wur.nl/en/publications/analysis-and-evaluation-of-pumping-test-data-2/
- Abramowitz, M. and Stegun, I.A. (1964). *Handbook of Mathematical Functions*, NBS AMS 55, eqs 5.1.53 and 5.1.56. This is the independent E₁ in the tests.
- Bakker, M. TTim 0.8 (MIT licence): the synthetic fixtures, via `scripts/benchmarks/pumptest_benchmark.py`.

See `aquascan-source-register.md` for the full source register.
