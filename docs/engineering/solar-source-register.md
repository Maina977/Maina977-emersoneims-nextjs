# Solar Genius Pro: source register

Compiled 2026-11-25 on branch `ws/solar-genius-design`. Public sources only. Each entry gives its title, version or date, URL and retrieval date, its evidence class, and what the code uses it for. Content is summarised here with attribution, not copied. IEC standards are paid documents, so they are cited by name only, and only for rules that are already implemented and stated in the code.

Evidence classes:
- **MS**: manufacturer specification.
- **PR**: published reference (a method, equation or dataset description).
- **UA**: user assumption.
- **ME**: modelled estimate.
- **MEAS**: measured.

## 1. Methods and benchmarks (PR)

| ID | Source | Version / date | URL (retrieved 2026-11-25) | Used for | Verified how |
|---|---|---|---|---|---|
| R1 | A. P. Dobos, *PVWatts Version 5 Manual*, NREL Technical Report NREL/TP-6A20-62641 | September 2014 | https://docs.nlr.gov/docs/fy14osti/62641.pdf (reached from the OSTI record https://www.osti.gov/biblio/1158421) | §11, Table 6 default losses and Eqn 9 total loss; §12, Eqns 10–11 inverter efficiency curve (η_ref = 0.9637, η_nom default 0.96) and clipping; Eqn 8 DC power; statement that the 3 % shading default represents far-horizon blocking | Text extracted from the PDF with pdfjs and read for this register. Benchmarks B1–B3 in `tests/regression/solar-benchmark-cases.test.ts` |
| R2 | NREL Developer Network, *PVWatts V8 API* | page as retrieved | https://developer.nlr.gov/docs/solar/pvwatts/v8/ | Weather-dataset options: default `nsrdb` includes "NSRDB PSM V3 GOES tmy-2020 3.2.0", "NSRDB PSM V3 Himawari tmy-2020 3.2.0", "NSRDB PSM V4 Meteosat Prime Meridian tmy-2022 1.0.0" and "NSRDB PSM V4 Polar tmy-2023 1.0.0"; also `tmy2`, `tmy3` and `intl`. Default `inv_eff` 96; `losses` has no default | Page read 2026-11-25 |
| R3 | NREL NSRDB presentation (PVPMC 2024) and NREL news, reported in web search results | 2024 | https://www.sandia.gov/app/uploads/sites/243/dlm_uploads/2024/05/PVPMC-2024-NSRDB-presentation-screen.pdf | Statement that the Meteosat-based NSRDB covers Africa, Europe and the Middle East (2005–2022, 15-minute imagery), so Kenya falls inside it | Search-result summary only. The PDF itself was **not** read; confirm it before relying on the period |
| R4 | J. Meeus, *Astronomical Algorithms*, 2nd ed., Willmann-Bell | 1998 | (book) | Example 25.a (δ = −7.78507°, 1992 Oct 13.0 TD) and Example 28.b (E = 13.7094 min) as the independent check of `sunPosition.ts` | Values as published in the book; the test computes the zenith from them by hand |
| R5 | pvlib-python 0.16.1 | as in `tests/fixtures/pvlib-hourly.json` | https://pvlib-python.readthedocs.io | Existing benchmark of the hourly chain (annual within 1 %, monthly within 2 %) on identical synthetic inputs | Existing test `solar-hourly-benchmark.test.ts` |
| R6 | IEC 62548-1, *Photovoltaic (PV) arrays – Part 1: Design requirements* | by name | (paid) | Cold-Voc, 1.25 × Isc and string-fusing rules already implemented in `validate.ts` | Not re-read; no new clause cited |
| R7 | IEC 60364-5-52, *Low-voltage electrical installations – Selection and erection of electrical equipment – Wiring systems* | by name | (paid) | Iz = It × Ca × Cg and the copper resistivity used in `validate.ts` | Not re-read; tabulated values are entered by the designer |

### Applicability of PVWatts to Kenya (R1, R2)

- **Weather.** For Kenya, PVWatts V8 would use the NSRDB Meteosat Prime Meridian TMY (tmy-2022), which is a typical year. Solar Genius Pro uses NASA POWER hourly data for an actual past year.
  - The two are different datasets and different periods, so an energy comparison would not isolate the model.
  - **No PVWatts site run was made:** the PVWatts hosts did not resolve from this machine, and the API needs a key.
- **Models.**
  - PVWatts v5 uses Perez transposition and the Fuentes thermal model. Solar Genius Pro uses isotropic transposition and the NOCT cell temperature. These parts are benchmarked against pvlib (R5), not against PVWatts.
  - The parts that are identical by construction (losses, inverter curve, clipping) are benchmarked with matched inputs (B1–B3).
- **Defaults.**
  - The PVWatts 14.08 % loss set is applied on the Proposal page and labelled.
  - With a surveyed horizon, its 3 % shading item is replaced by the computed horizon loss (R1 §11 describes that default as far-horizon blocking).
  - The other PVWatts default losses are US-derived surveys. Their applicability to Kenyan soiling and availability is **not verified**.

## 2. Weather and solar resource

| ID | Source | Use | Note |
|---|---|---|---|
| W1 | NASA POWER hourly API (ALLSKY_SFC_SW_DWN, T2M) | Hourly weather for the proposal simulation (`nasaPowerHourly.ts`, `/api/solar/hourly-weather`) | Existing integration. Grid about 0.5° × 0.625° (as stated in the pilot protocol), so the result is a regional estimate. Gaps are not filled |
| W2 | NSRDB PSM V4 Meteosat Prime Meridian TMY (via PVWatts V8) | Benchmark candidate only | Not used by the tool; see R2/R3 |

## 3. Equipment datasheets (MS): `data/solar/equipment/`

Every record has `evidenceClass: "manufacturer specification"` and `verification.status: "unverified"`. The values were extracted from the PDF text by an automated research pass. **A second person must check each value against the rendered PDF before use in a quoted design.** A value that is not printed is `null`, with a note.

| File | Item | Datasheet (title, revision/date) | URL | Copy | Known gaps / doubts |
|---|---|---|---|---|---|
| `jinko-jkm590n-72hl4-v-f8-en.json` | PV module, Jinko Tiger Neo JKM590N-72HL4-V | "Tiger Neo N-type 72HL4-(V) 580-605 Watt Mono-facial Module", JKM580-605N-72HL4-(V)-F8-EN (© 2024, no date) | https://jinkosolar.com/uploads/JKM580-605N-72HL4-(V)-F8-EN.pdf | manufacturer | NOCT/NMOT and β_Vmp not printed (the module cannot pass the full string check without them: test C6). Max system voltage printed "1000/1500 VDC": confirm the supplied version |
| `deye-sun-8k-sg01lp1-eu-20260911.json` | Hybrid inverter, Deye SUN-8K-SG01LP1-EU | "Single Phase Hybrid Inverter SUN-7.6/8K-SG01LP1-EU", date from file name 2026-09-11 | https://www.deyeinverter.com/deyeinverter/2026/09/15/BDatasheetSUN-76-8KK-SG01LP1-EU20260911en.pdf | manufacturer | AC currents printed as pairs; generator is a feature line only, with no port rating |
| `sma-stp10-0-3av-40-ds-en-40.json` | String inverter, SMA Sunny Tripower 10.0 | "Sunny Tripower 8.0 / 10.0", STP8-10-3AV-40-DS-en-40, 04/2023 | https://files.sma.de/downloads/STP8-10-3AV-40-DS-en-40.pdf | manufacturer | Inputs A/B have different limits (20/12 A, 30/18 A). Minimum operating temperature not read (a minus sign was lost in extraction) |
| `pylontech-us5000-py21us05-1.json` | LFP battery, Pylontech US5000 | "US5000 – Specification", PY21US05-1, undated | https://portal.segen.co.uk/reseller/docs/US5000%20spec.pdf | **distributor (Segen)** | Manufacturer copy not reachable. Cycle-life conditions not printed |
| `victron-smartsolar-mppt-150-45-undated.json` | MPPT charge controller, Victron SmartSolar 150/45 | "SmartSolar Charge Controller MPPT 150/35 & 150/45", undated | https://www.victronenergy.com/upload/documents/Datasheet-SmartSolar-charge-controller-MPPT-150-35-&-150-45-EN.pdf | manufacturer | Undated; updated in place at the same URL. The tool has no charge-controller check yet (only inverter string checks) |

These models were chosen as **representative examples of equipment types sold in Kenya**. No market-share or Kenyan-availability claim is made, and no price is recorded. Validation code is in `lib/solar/design/equipmentData.ts`:
- `recordErrors` checks the schema and provenance, refuses a null value without a reason, and refuses a "verified" record that names no second person.
- `recordWarnings` flags undated sheets, distributor copies and records not yet verified.
- `moduleFromRecord` and `inverterFromRecord` never fill a gap.

## 4. Protection and cable practice

The tool contains no ampacity tables and no SPD or isolator selection tables. Everything it does not determine is labelled "to be specified by the engineer" on the single-line diagram (`sld.ts`). No other protection source was used. A public, verifiable source for Kenyan practice (for example the EPRA solar PV regulations named in the Design Check page) has **not** been reviewed in this increment. That review is a listed next action, not a claim.
