# /solar hub: source register (2026-11-25)

Dataset: `data/solar-hub/references/solar-hub-references-2026-11-25.json` (version 1.0.0).
Benchmarks: `data/solar-hub/test-cases/roi-benchmarks-2026-11-25.json` (SYNTHETIC).
Tests: `tests/regression/solar-hub-benchmarks.test.tsx`.

**No calculator result changed.** The references are used to *check* the calculator's own
assumptions. They are not fed into any result, and no value is shown to customers as a price or a
guarantee.

## Status vocabulary

* **manufacturer specification**: printed on that model's datasheet; applies to that model only.
* **published reference**: a regulator's figure for a stated period. Here it reaches us through a
  dated news report of the notice.
* **user-provided assumption**: entered by the customer (tariff, quoted cost, battery replacement
  quote).
* **modelled estimate**: a planning assumption in the code.

## Sources

| ID | Title | Date | URL | Permitted use |
|---|---|---|---|---|
| jinko-tiger-neo-f8 | JinkoSolar Tiger Neo 72HL4-(V) 580-605 W datasheet, F8-EN | © 2024 | https://jinkosolar.com/uploads/JKM580-605N-72HL4-(V)-F8-EN.pdf | Module spec for that model; compare with the calculator's degradation |
| deye-sg04lp1-2026-09 | Deye SUN-3/3.6/5/6K-SG04LP1-EU datasheet | 2026-09-11 (file name) | https://www.deyeinverter.com/deyeinverter/2026/09/14/BDatasheetSUN-3-6K-SG04LP120260911en.pdf | Inverter spec for that model |
| pylontech-us5000-py21us05-1 | Pylontech US5000 datasheet PY21US05-1 (distributor-hosted copy) | not printed; 2021 series, uploaded 2024-01 | https://fvcomponentes.com/wp-content/uploads/2024/01/Pylontech-US5000-48KWh-48V.pdf | Battery spec for that model; re-check against pylontech.com.cn before quoting |
| apc-srt5kxli-se-page | APC Smart-UPS SRT 5000VA 230V product page | no date | https://www.se.com/il/en/product/SRT5KXLI/apc-smartups-srt-5000va-230v | Rating and topology only |
| epra-pass-through-2026-09 | "EPRA Adjusts Electricity Charges as Ksh4.16 Per kWh Pass-Through Costs Apply", Kenyans.co.ke (reports the EPRA notice of 2026-09-18) | 2026-09-20 | https://www.kenyans.co.ke/news/127216-epra-adjusts-electricity-charges-ksh416-kwh-pass-through-costs-apply | Context for a sensible tariff; never a substitute for the customer's own tariff |
| epra-fuel-2026-11 | "EPRA Maintains Fuel Prices Unchanged, Super Petrol to Retail at Ksh226.96", Kenyans.co.ke | 2026-11-14 | https://kenyans.co.ke/news/129383-epra-maintains-fuel-prices-unchanged-super-petrol-retail-ksh22696 | Nairobi pump prices, 15 Nov to 14 Dec 2026, for a generator-fuel comparison |

## Values (summary; full list in the dataset)

| Value | Status | Source |
|---|---|---|
| Module 580 Wp, 22.45% STC, −0.29 %/°C, 1% year 1, then 0.40 %/yr (30-yr linear warranty), 12-yr product warranty | manufacturer spec | Jinko F8 |
| Inverter 5,000 W rated; max 97.6%, Euro 96.5%, MPPT >99%; battery 40-60 V, 140 A; warranty 5 yrs (up to 10, by country) | manufacturer spec | Deye 2026-09 |
| LFP battery 4,800 Wh nominal / 4,560 Wh usable, 95% DoD, >6,000 cycles at 25 °C, 15+ yr design life, 50 A recommended | manufacturer spec | Pylontech PY21US05-1 |
| UPS 5 kVA / 4.5 kW double-conversion on-line | manufacturer spec | APC/SE page |
| Pass-through charges KES 4.16/kWh (fuel 3.00 + forex 1.14 + WRMA 0.0148), September 2026 readings | published reference (news report of an EPRA notice) | Kenyans.co.ke 2026-09-20 |
| Nairobi diesel KES 227.76/L, petrol 226.96, kerosene 219.87, incl. 8% VAT, 15 Nov to 14 Dec 2026 | published reference (news report quoting EPRA) | Kenyans.co.ke 2026-11-14 |

## How the calculator's assumptions compare (tested)

| Calculator assumption (modelled) | Reference | Finding |
|---|---|---|
| Degradation 0.5 %/yr | Jinko warranty limit 0.40 %/yr | Calculator more conservative |
| Battery DoD 90% | Pylontech 95% | Calculator more conservative |
| Battery replaced in year 12 (only if the customer enters a quote) | Pylontech 15+ yrs design life; >6,000 cycles ≈ 16.4 yrs at one cycle a day | Calculator more conservative |
| Performance ratio 0.78 | Deye Euro efficiency 96.5% (inverter loss only) | Consistent: the ratio also covers temperature, wiring and soiling |
| Battery round-trip efficiency 95% | none found | Gap G3 |

No correction was needed, so no calculation changed.

## Test-case programme

All cases are **synthetic**. The inputs were chosen by hand and the expected values worked out
from the formula written in the JSON. They prove the arithmetic and its display. They are **not
field validation**: no metered installation was compared.

| Case | Inputs | Hand result | Tolerance |
|---|---|---|---|
| B1 | 15,000 KES bill, 25 KES/kWh, 5 kW + 10 kWh, 600,000 KES | 12,375 KES/month; payback 5 yrs; ROI 458%; net 2.7M | ±1 KES, 0 yrs, ±1 pt |
| B2 | 8,000, 30, 3 kW grid-tied, 450,000 | 3,000/month; 15 yrs; 63%; 0.3M | same |
| B3 | 40,000, 28, 10 kW + 20 kWh, 1.5M, battery quote 400,000 in yr 12 | 30,120/month; 5 yrs; 416%; 6.2M | same |
| B4 | B1 with a 5 kWh battery (battery-limited) | 9,000/month; 6 yrs | same |
| B5 | 2,000, 25, 1 kW, 2M (boundary) | 750/month; "Not within 25 years" | ±1 KES |
| I1-I6 | tariff 0 / −5, cost 0 / −100,000, bill −500, corrupt saved draft | rejected or clamped; no figure invented | exact |

## Gaps (with reasons)

| # | Gap | Reason | Next action |
|---|---|---|---|
| G1 | EPRA base energy charges (DC1-DC3, SC) | The EPRA tariff PDF (epra.go.ke/wp-content/uploads/2023/01/ABRIDGED-KPLC-TARIFF-2023.pdf) returned 404, and one news page returned 403. Unverified search snippets were not used. | Get the current Schedule of Tariffs or gazette notice from epra.go.ke |
| G2 | Primary EPRA notices for pass-through and fuel | Only news reports were read, not the gazette notices themselves | Fetch the EPRA notices and replace the status source |
| G3 | LFP round-trip efficiency | The Pylontech sheet text has no efficiency figure; the higher numbers on retailer sites are not manufacturer statements | Ask Pylontech or use the full datasheet |
| G4 | UPS efficiency and battery life | The SE product page states neither. The mouser datasheet link returned HTML, not the PDF. | Get the SRT5KXLI datasheet from apc.com |
| G5 | Pylontech primary source | The copy is hosted by a distributor | Download it from pylontech.com.cn |
| G6 | Grid CO2 factor 0.213 kg/kWh | Cited in the code (Climate Watch / KPLC 2023), not re-verified in this pass | Verify against the source |
| G7 | Field validation | No metered Kenyan installation data in the repository | Compare with one real site's bills before and after installation |


## Independent second-person check (2026-11-25)

All values in this register were re-opened at their cited public sources by an independent checker (report: `EmersonEIMS-proposals/source-verification-2026-11-25/INDEPENDENT-SOURCE-CHECK.md`, held outside the repo).
- Hub: 24/25 values match. Corrected: Deye maximum battery charge/discharge current is per model (datasheet p. 2): SUN-5K-SG04LP1-EU = 120 A (the dataset had 140 A, which is the range maximum for the 24 V SUN-3K model only). Not used by any calculation, so no result changes.
- Pylontech US5000: two different third-party copies both carry the code PY21US05-1 and disagree on weight (38 vs 40 kg), depth (161 vs 162 mm) and peak current (101~120 vs 100~120 A @15 min). This dataset uses the fvcomponentes copy. Neither copy is from Pylontech's own site.
- EPRA pass-through and Nairobi fuel prices match the cited Kenyans.co.ke reports; the EPRA notices themselves were not opened (secondary source).
