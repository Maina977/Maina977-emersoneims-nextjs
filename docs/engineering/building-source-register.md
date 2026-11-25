# Building Suite Pro: research source register (price data)

Retrieved 2026-11-25. Values are cited with attribution; no whole document is copied.

**How the work was done**
- A research agent searched the sources below and transcribed values from the PDF text layer (`pdftotext -raw`).
- The engineer then independently re-extracted the PPRA June 2026 PDF and checked each value that went into the dataset. The retailer cable page was fetched again to confirm its price.
- Only values that passed both reads are in `data/building/rates/ppra-mprg-2026-06.json`.

## Sources used

| # | Source | Date | What was used | Licence / permitted use |
|---|---|---|---|---|
| S1 | **PPRA, *The Market Price Reference Guide — June 2026*.** Download: https://ppra.go.ke/download/market-price-reference-guide-june-2026/?wpdmdl=15169 · Listing: https://ppra.go.ke/market-price-index/ | Edition June 2026; survey 25 May – 6 June 2026 (survey end date used as the price date); retrieved 2026-11-25 | 14 records, all national "All" values (geometric mean of Nairobi, Mombasa, Kisumu, Nakuru, Eldoret), status **indicative**: cement 50 kg (868.09); D10/D12/D16 bars 12 m (608.87 / 1,320.65 / 2,317.15); G30 3 m sheet (1,384.40); roofing nails 1 kg (259.50); PPR 20 mm × 4 m pipe (234.46); PPR tee / socket / elbow 20 mm (24.28 / 31.52 / 36.87); PVC waste pipe 110 mm × 6 m (1,497.19); ball valve 20 mm (849.86); gate valve 15 mm (707.48); PVC glue 250 g (178.32). VAT and delivery are not stated anywhere in the guide. The guide says the prices are "indicative" reference points for procurement planning | Kenyan government publication (PPADA 2015 s.54(3)); site footer reads "All Rights Reserved". Individual values cited with attribution for reference |
| S2 | **Tronic Kenya**, "Twin With Earth PVC Insulated Electrical Cable 1.5mm". https://www.tronic.co.ke/products/twin-with-earth-pvc-insulated-electrical-cable-1-5mm | No price date (footer "© 2026"); retrieved 2026-11-25 | KSh 133 per metre, status **indicative**, confidence **low** (single retailer, no date, conflicting voltage ratings) | Retail web page, cited with attribution |
| S3 | **KNBS, *Construction Input Price Indices, Third Quarter 2026*.** https://www.knbs.or.ke/reports/construction-input-price-indices-third-quarter-2026/ | Reference period Q3 2026 (September 2026) | Context only, no prices: CIPI 126.36 → 125.45 (−0.72 % quarter on quarter), annual 3.45 %. Not used to adjust any rate | Official statistics, "All Rights Reserved"; cited |

## Values seen but not used

| Value | Reason |
|---|---|
| PPRA June 2026 circuit breakers 12/15/20/30 A; patress boxes single/double | Reported by the research agent, but the engineer's own extraction did not find these rows. They are left out until they are re-read from the PDF |
| PPRA June 2026 R6 bar (≈30,152) and BRC mesh (≈918 per 48 m roll) | Implausible as printed (the table looks misaligned). Excluded |
| PPRA galvanised and black steel pipes | Internally inconsistent (heavy grade cheaper than light; 40 mm black cheaper than 25 mm). Excluded |
| PPRA uPVC pipe 20 mm × 6 m (1,316.71) | Implausibly high for 20 mm. Excluded pending a check |
| Tronic 2.5 mm² (202/m) and 4 mm² (300/m) | Reported by the research agent, not re-fetched by the engineer. Excluded until verified |
| TDK Kenya cable roll prices | The site refuses automated fetches (HTTP 403). Only a search snippet was seen, so nothing was used |

## Gaps (stay "quotation required")

| Category | Precise reason it is unresolved |
|---|---|
| Sand, ballast/aggregate, concrete blocks, machine-cut stone | Not in PPRA June or April 2026. KNBS gives indices only. No dated supplier page found |
| Ready-mix concrete, structural steel sections | Not searched in this pass; not in the PPRA building list read here |
| PVC conduit 20/25 mm, sockets, switches, DBs/consumer units, MCBs by type and poles | Not in PPRA June 2026 (circuit breakers by amperage only, unconfirmed). No citable dated page found |
| Cable 2.5 / 4 / 6 mm² | One retailer only, not re-verified; the 6 mm² page returned 404 |
| WC, basin, sink, shower | Not in PPRA June 2026. KNBS gives a "sanitary fittings" index only |
| Water pumps | Not found in PPRA June 2026 Waterworks |
| Labour (daily or hourly rates), plant hire, transport | Not in PPRA guides; KNBS gives indices only. The KeNHA *Price Reference Guide May 2026* (https://kenha.co.ke/wp-content/uploads/2026/06/Price-Reference-Guide-May-2026-v1.pdf) is a likely source for road-works plant and labour, but it has not been extracted or checked yet |
| VAT treatment of any public price | Not stated by any source used. Records say "not stated" |
| Verified EmersonEIMS rates | None provided. The data type is supported (`status: "verified"`) |
| PPRA September 2026 guide | The newest edition contains no building, electrical or waterworks categories, so June 2026 is the latest applicable one |
