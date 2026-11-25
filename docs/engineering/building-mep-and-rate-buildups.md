# Building Suite Pro: electrical and plumbing trades, rate build-ups and price status

Increment of 2026-11-25 on branch `ws/building-mep-rates`. Engines: `qs-mep 1.0.0`, `qs-buildup 1.1.0`, `qs-boq 1.1.0`. Project file schema 2 (schema 1 files still open).

Every output is a **DRAFT, not certified**. Any bill with an indicative or unpriced line also carries **"PRELIMINARY BUDGET — not a quotation"**.

## 1. Where it is in the UI

Go to `/solutions/building/takeoff` (the take-off workbench used by Building Suite Pro). Load a drawing and calibrate the sheet.

1. **Measure.**
   - **Count** tool: lighting points, socket outlets, switches, WCs, basins, sinks, showers, and the supply/waste points each pipe serves.
   - **Length** tool: each circuit run and pipe run, measured along the run as drawn.
2. **Trades panel.**
   - Choose **Electrical installation** or **Plumbing & sanitary**.
   - Add rows: points / circuit runs / enumerated items, or fixtures / pipe runs.
   - Pick the measurements and enter each parameter with its source.
   - Press **Calculate**, then **Add to BOQ**.
3. **Bill of quantities.** Each item gets either:
   - a **single rate** (value, where from, **price status**, source, date, location); or
   - a **build-up**: press **Build up**, then add material, labour and plant lines. You can type them, or use **Use indicative rates (PPRA June 2026)** / **Rates file** and pick **Add from rates file**.
4. The **price status** box shows measured works split into verified / indicative / unpriced.
5. **Export Excel** writes the BOQ sheet plus a "Rate build-ups" sheet with live formulas. **Export PDF** prints the BOQ, every build-up and the status split.

## 2. Method of measurement (convention reference only)

- **Enumerated (No):** points, accessories, sanitary fixtures, boards, circuit devices and fittings.
- **Linear (m):** cable, conduit and pipe.

This follows the general approach of the RICS *New Rules of Measurement: NRM 2* and the earlier *SMM7*: services measured by length, components enumerated. It also follows the "per point" practice common in East African building BOQs.

These are cited **by name as conventions only**. No clause numbers are claimed. The project's own method of measurement, stated in its preliminaries, governs.

**Double counting.** An East African "point" rate is often deemed to include the wiring back to the board. If you price such a point rate, do not also price the cable and conduit runs. The panel warns about this.

## 3. Measurement rules and formulas

| Item | Unit | Rule |
|---|---|---|
| Point / fixture | No | Count measurement on the drawing (`counted on the drawing`) |
| Run length (conduit, or pipe) | m | `L = (plan run + drop × points served) × (1 + allowance/100)` |
| Cable | m | `L × conductors per run` (conductors: whole number 1–12, from the circuit schedule) |
| Enumerated item (DB, MCB, isolator) | No | Count with its source (board or circuit schedule). No source → refused |
| Fittings | No | `ceil(L × fittings per metre)`, a **stated allowance, not counted fittings** |

**Run inputs**
- Plan run: a linear take-off.
- Drop/rise per point: 0–10 m, from a section.
- Allowance: 0–25 %, optional, needs its source.
- Pipe diameter: DN 10–300 mm, from the specification.

**Assumptions stated on every line**
- Drainage runs are measured on plan. The gradient is not added; at 1:40 it adds 0.03 % to the length.
- No drop is applied unless a count measurement of the points served is chosen.

**Refused, with the reason**
- A row with no measurement.
- An enumerated item without a count and source ("no measurable basis … not guessed").
- A drop without points served, or points without a drop.
- Values out of range.
- Non-integer conductors.
- The same measurement used twice in the same role (double counting).

Each line keeps its formula and inputs. They become the BOQ quantity source and are recomputed when a saved project is opened.

## 4. Rate build-up

```
material = qty per BOQ unit × price × (1 + waste % / 100)     (waste 0–50 %, materials only)
labour   = hours per BOQ unit × rate per hour
plant    = hours per BOQ unit × rate per hour
net      = Σ material + Σ labour + Σ plant
O&P      = net × O&P % / 100                                  (0–100 %, basis required)
rate     = net + O&P
```

**Rounding**
- Each line is rounded to 0.01 KES (decimal half away from zero, as Excel `ROUND`), then the sums.
- Excel uses the identical `ROUND(E*F*(1+G/100),2)`, `SUMIF` and `SUM` formulas, so screen, Excel and PDF show the same figures.
- The BOQ rate cell is a formula referring to the unit-rate cell on the "Rate build-ups" sheet.

**Every priced line needs**
- a price status;
- a source;
- a date (YYYY-MM-DD).

A line with no price makes the item **"rate required (quotation required)"**. The bill then has no grand total.

**O&P counted once.** O&P in a build-up *and* at bill level is refused as charged twice.

## 5. Price status (management rule, 2026-11-25)

| Status | Meaning | Use |
|---|---|---|
| **Verified** | An EmersonEIMS company rate or a current supplier quotation, **declared by the user**. The tool cannot check an approval. No verified rates exist in the product today | May be priced |
| **Indicative** | A dated, identifiable public source, e.g. the PPRA Market Price Reference Guide | Preliminary budgets only. Never shown as an EmersonEIMS selling price or as a quotation |
| **Unverified** | No defensible source | No value is used. The line stays unpriced: "quotation required" |

**How status is applied**
- A build-up takes the **weakest** status of its priced inputs. One indicative input makes the rate indicative.
- A single rate with no status stated is treated as **indicative**, never as verified, and the note says so.
- "Verified" from "other source" is refused.

**The BOQ reports**
- measured works at verified rates (KES and items);
- measured works at indicative rates (KES and items);
- the count and codes of unpriced items.

These figures are taken before preliminaries, contingency, O&P and VAT, which apply to the whole bill.

**Preliminary marking.** If any line is indicative or unpriced, the screen, the Excel workbook (top row and summary) and the PDF (header and summary) all carry the PRELIMINARY BUDGET notice.

### Rates dataset

`data/building/rates/ppra-mprg-2026-06.json` uses format `building-suite-pro/rates` v2. Each record has:
- code, kind, description, specification, unit, currency (KES), value;
- source title and URL;
- publication date and retrieval date;
- geography;
- VAT treatment, delivery assumption;
- basis (materials-only / installed / labour / plant);
- confidence and status.

`unverified` records carry `value: null`. Sources, the checks made and the gaps are listed in `building-source-register.md`. A user can also load their own dataset in the same format, for example a supplier quotation marked `verified`.

## 6. Worked example (tests/regression/qs-mep-buildup.test.ts)

One house, drawn at 0.1 m per PDF point. All prices in this example are TEST values, not Kenyan prices.

**Electrical**

| Item | Calculation | Result |
|---|---|---|
| Lighting points | counted | 6 |
| Socket outlets | counted | 8 |
| Switches | counted | 4 |
| L1 conduit | (24.5 + 6 × 0.5) × 1.04 | **28.6 m** |
| L1 cable | 28.6 × 3 | **85.8 m** |
| S1 conduit | 32 + 8 × 1.2 | **41.6 m** |
| S1 cable | 41.6 × 3 | **124.8 m** |
| Distribution board | from schedule | 1 No |
| MCBs | from schedule | 4 No |

**Plumbing**

| Item | Calculation | Result |
|---|---|---|
| WC, basin, sink, shower | counted | 1 each |
| DN20 PPR supply | 18.4 + 4 × 0.8 | **21.6 m** |
| DN20 fittings | ceil(21.6 × 0.5) | **11 No** |
| DN110 soil | plan run | **9.2 m** |
| DN110 fittings | ceil(9.2 × 0.3) = ceil(2.76) | **3 No** |
| DN50 waste | 6.5 + 3 × 0.4 | **7.7 m** |

**Build-up for E.5 (cable, per m)**

| Line | Calculation | Amount (KES) |
|---|---|---|
| Material: cable | 1 × 45 × 1.05 | 47.25 |
| Labour: electrician | 0.05 × 400 | 20.00 |
| Labour: mate | 0.05 × 250 | 12.50 |
| Plant | 0.01 × 100 | 1.00 |
| Net | | **80.75** |
| O&P 12 % | | **9.69** |
| Rate | | **90.44 KES/m** |

The item amount is 85.8 × 90.44 = 7 759.752, shown as **7 759.75 KES**.

With TEST rates of 100, 110, 120 … on the other lines, the electrical subtotal is 600 + 880 + 480 + 3 718 + 7 759.75 + 6 240 + 19 968 + 170 + 720 = **40 535.75 KES**. This equals the sum of the item amounts and the engine's subtotal.

**The tests also check that:**
- Excel formulas, evaluated independently, reproduce 47.25 / 32.5 / 1 / 80.75 / 9.69 / 90.44 / 7 759.75;
- the PDF prints the same figures;
- the build-up editor shows the same figures;
- a saved project recomputes them unchanged.

**Indicative example (benchmark B2):** a PPR DN20 supply pipe per m, materials only, from PPRA June 2026 national averages.

| Line | Calculation | Amount (KES) |
|---|---|---|
| Pipe | 0.25 length × 234.46 × 1.05 | 61.55 |
| Tee | 0.5 × 24.28 | 12.14 |
| Elbow | 0.5 × 36.87 = 18.435 | **18.44** |
| Rate | | **92.13 KES/m, INDICATIVE** |

This case exposed a rounding defect. `Math.round(x*100)/100` gives 18.43, because 1843.4999… is how binary floating point stores 18.435 × 100. Excel's `ROUND` gives 18.44, so a recalculated workbook would have disagreed with the screen.

All BOQ and build-up money is now rounded by `roundMoney` (decimal half away from zero, like Excel). The test checks 18.435→18.44, 1.005→1.01, 2.675→2.68, −18.435→−18.44.

## 7. Benchmark programme (tests/regression/qs-mep-benchmarks.test.ts)

All cases are **SYNTHETIC**. None is a customer project and none is field validation.

| Id | Kind | Problem | Hand result | Tolerance |
|---|---|---|---|---|
| B1 | simple | 10 m run, 4 points, 0.3 m drop, 3 conductors | conduit 11.2 m, cable 33.6 m | 0.001 |
| B2 | complex | PPR DN20, 21.6 m, PPRA indicative materials | rate 92.13 KES/m, amount 21.6 × 92.13 = 1 990.01 KES, indicative, preliminary | 0.005 KES |
| B3 | boundary | allowance 25 %, 12 conductors, DN300, exact-integer fittings | 12.5 m, 150 m, 10 m, 5 No | 0.001 |
| B4 | invalid | 25.01 %, DN301, 0 conductors, −0.1 m drop, 2.5 conductors | all refused | — |
| B5 | missing evidence | DB with no source; unmeasured run; labour with no public price | refused, refused, no rate, line unpriced, PRELIMINARY notice | — |

Each case's pass/fail is the test assertion. The test name prints the expected value and the tolerance.

## 8. Limitations register

| # | Limitation | Next action |
|---|---|---|
| L1 | **Tenders, bid comparison and variations (valuation, instructions, final account) are NOT DONE.** This is the next increment. `compareRevisions` gives only an item-by-item revision difference | Next increment |
| L2 | "Verified" is declared by the user. No authenticated approval exists, so a verified rate is still not a certified price | Add accounts and approval workflow, then reviewer sign-off |
| L3 | No verified EmersonEIMS rates exist. The bundled dataset is indicative (PPRA June 2026 plus one retailer). VAT and delivery are not stated by the source | Obtain the company rate list and dated supplier quotations; load them as `verified` datasets |
| L4 | Gaps with no defensible public price: sand, ballast, blocks/stone, PVC conduit, sockets/switches, DBs, sanitary fixtures, pumps, labour, plant, transport. They stay "quotation required" (see the source register) | Supplier quotations; KeNHA guide for plant/labour (not yet extracted) |
| L5 | Fittings are an allowance per metre, not counted from an isometric | Add counted fittings by type from an isometric take-off |
| L6 | Drainage measured on plan (gradient ignored, ≤ 0.1 % at usual falls); no manholes, trenching, below-ground drainage, tanks, pumps, hot-water systems | Add below-ground drainage and plant items |
| L7 | Not measured: earthing, lightning protection, testing and commissioning, builder's work, incoming supply (also shown in the panel) | Add as enumerated/itemised items with sources |
| L8 | Point rates versus measured runs are not reconciled automatically; the user must avoid pricing wiring twice | Add a "point rate includes wiring" flag that blocks pricing the runs |
| L9 | Indicative prices are retail averages from a June 2026 survey; they are not escalated (KNBS CIPI Q3 2026 index fell 0.72 % against Q2) | Optional index adjustment with KNBS CIPI, stated as such |
| L10 | Synthetic benchmarks only. MEP is excluded from the current pilot protocol | See `building-evidence-package.md` |
| L11 | The UI was tested with jsdom (component rendering, axe rules), not in a real browser | Browser run on a preview before release |
