# AquaScan Pro: source register (pumping-test analysis and regional context)

Compiled 2026-11-25 on branch `ws/aquascan-pumptest-timeseries` from public sources. Each entry gives its status:

- **USED**: it underpins code or tests;
- **CITED**: a method reference stated in the output, not reproduced numerically;
- **CONTEXT**: regional background only. It never becomes a site value;
- **NOT REPRODUCED**: considered as an independent test, but its data and answers could not be verified verbatim.

Summaries are attributed, not quoted, unless marked.

## A. Pumping-test methods

| # | Source | Use in AquaScan | Status |
|---|---|---|---|
| A1 | Theis, C.V. (1935). The relation between the lowering of the piezometric surface and the rate and duration of discharge of a well using ground-water storage. *Trans. AGU* 16(2): 519–524. doi:10.1029/TR016i002p00519. USGS reprint (Ground Water Notes 5, 1952, notation slightly changed): https://water.usgs.gov/ogw/pubs/Theis-1935.pdf | The non-equilibrium equation s = Q W(u)/(4πT); the full-curve fit and recovery method | USED (formula) / CITED |
| A2 | Cooper, H.H. and Jacob, C.E. (1946). A generalized graphical method for evaluating formation constants and summarizing well-field history. *Trans. AGU* 27(4): 526–534. doi:10.1029/TR027i004p00526. USGS record: https://www.usgs.gov/publications/a-generalized-graphical-method-evaluating-formation-constants-and-summarizing-well | The straight-line method, T = 2.303Q/(4πΔs), S = 2.25Tt₀/r², with the u < 0.01 condition | USED (formula) / CITED |
| A3 | Kruseman, G.P. and de Ridder, N.A., with Verweij, J.M. (1990; often dated 1994). *Analysis and Evaluation of Pumping Test Data*, 2nd ed. ILRI Publication 47, Wageningen, 377 p. ISBN 9789070754204. WUR record: https://research.wur.nl/en/publications/analysis-and-evaluation-of-pumping-test-data-2/. Public scan (EU JRC AquaKnow): https://aquaknow.jrc.ec.europa.eu/sites/default/files/Kruseman%20-%201994%20-%20Analysis%20and%20evaluation%20of%20pumping%20test%20data.pdf | Standard practice for assumptions, validity conditions, recovery and segment selection (Ch. 3). The Oude Korendijk example would be the obvious published test | **USED (independent published reference):** the text layer of the AquaKnow copy (2nd ed., 1994 imprint, ISBN 90 70754 207) gives the Oude Korendijk data (Table 3.1, p. 59) and answers (pp. 65, 68, 70-71); reproduced in tests/regression/aquascan-pumptest-oude-korendijk.test.ts, see aquascan-pumping-test-analysis.md section 5a |
| A3a | timflow (MIT), Oude Korendijk notebook and data files, https://github.com/timflow-org/timflow (docs/transient/04pumpingtests/) | Machine-readable copy of Table 3.1 (H30, H90), checked value by value against the book | USED (data file; SHA-256 in the fixture) |
| A4 | Ferris, J.G., Knowles, D.B., Brown, R.H. and Stallman, R.W. (1962). *Theory of Aquifer Tests*. USGS Water-Supply Paper 1536-E, 105 p. https://pubs.usgs.gov/publication/wsp1536E | Background: limits of applicability, variable discharge and image-well theory (the barrier-boundary benchmark uses an image well) | CITED |
| A5 | Lohman, S.W. (1972). *Ground-Water Hydraulics*. USGS Professional Paper 708, 70 p. doi:10.3133/pp708. https://pubs.usgs.gov/publication/pp708 | A candidate for published worked examples | NOT REPRODUCED (not transcribed in this increment) |
| A6 | Abramowitz, M. and Stegun, I.A. (eds) (1964). *Handbook of Mathematical Functions*, NBS Applied Mathematics Series 55, §5.1, eqs 5.1.53 and 5.1.56 | The independent E₁(u) used to build the synthetic test data. The tests check it against scipy | USED (tests) |
| A7 | SciPy `scipy.special.exp1` | Reference W(u) values (`tests/fixtures/pumptest-benchmark.json`) | USED (tests) |
| A8 | Bakker, M. TTim 0.8, analytic-element transient model, MIT licence | Independent synthetic confined-aquifer tests with known T and S (`scripts/benchmarks/pumptest_benchmark.py`) | USED (tests) |
| A9 | Hantush, M.S. (1964). Hydraulics of wells. *Advances in Hydroscience* 1: 281–432. Bierschenk, W.H. (1963). Determining well efficiency by multiple step-drawdown tests. IASH Publ. 64: 493–507 | Step-drawdown well-loss analysis (s = BQ + CQ²). **Not implemented** in this increment (limitation L3) | CITED (future work) |
| A10 | ICRC (2011). *Technical Review: Practical Guidelines for Test Pumping in Water Wells* (R. Boak). https://www.icrc.org/en/doc/assets/files/publications/icrc-002-4033.pdf | Field practice for constant-rate and recovery tests and standard forms. Informs the evidence package | CITED |

## B. Kenya regulatory and regional context (never a site value)

| # | Source | What it says (summarised, with attribution) | Use | Status |
|---|---|---|---|---|
| B1 | Barasa, M., Crane, E., Upton, K., Ó Dochartaigh, B. and Bellwood-Howard, I. (2018). *Hydrogeology of Kenya*. Africa Groundwater Atlas, British Geological Survey. https://earthwise.bgs.ac.uk/index.php/Hydrogeology_of_Kenya | Four aquifer settings: unconsolidated sedimentary, volcanic, mixed sedimentary and basement. It quotes transmissivity of 120–600 m²/d for the Tiwi aquifer, a median of 275 m²/d for Merti, about 7.5–7.6 m³/h average yield in volcanic rocks, and about 4.4 m³/h in basement | Context only. It must not be shown as a value for a site. The time-series analysis uses only the entered test record | CONTEXT |
| B2 | BGS Africa Groundwater Atlas country maps (aquifer type and productivity, 1:5 M; User Guide BGS OR/21/063). https://www2.bgs.ac.uk/africaGroundwaterAtlas/downloadGIS.html | Productivity classes based on borehole yields, from Very Low (< 0.1 l/s) to Very High (> 20 l/s). Described as largely qualitative at this map scale | Already shown as the "regional groundwater" card (`evidenceCards.ts`), labelled regional | CONTEXT |
| B3 | MacDonald, A.M. et al. (2012). Quantitative maps of groundwater resources in Africa. *Environ. Res. Lett.* 7 024009 | 5 km grid of depth to groundwater, storage and productivity | Existing regional card | CONTEXT |
| B4 | Kenya: The Water (Water Resources Management) Rules, 2021, L.N. 43 of 2021. https://new.kenyalaw.org/akn/ke/act/ln/2021/43/eng@2022-12-31 | Contains provisions on borehole and well test pumping, supervision of works, and the borehole or well completion record (section headings found; **the full text was not reviewed** in this increment) | The evidence package asks for the WRA completion record and the test-pumping record | CITED (headings only) |
| B5 | Mumma, A. et al. (2011). *Kenya Groundwater Governance Case Study*. World Bank (cited by B1) | Groundwater governance context | Background | CONTEXT (not opened) |
| B6 | Oord, A. et al. (2014). *Hydrogeological Assessment of the Merti Aquifer, Kenya* (cited by B1) | Regional aquifer study | Background | CONTEXT (not opened) |

## C. Rules for using these sources

1. **Regional information never becomes a site prediction.** No drilling depth, sustainable yield, aquifer parameter or water-quality value comes from B1–B6. The evidence gate (`evidenceGate.ts`) is unchanged.
2. **A published example is used as a test only after verbatim reproduction.** The stated data and answers must be transcribed from the source, with page and tolerance recorded. None is yet (A3, A5).
3. **Synthetic is labelled synthetic.** The TTim and A&S-built data test the code's correctness. They are not field validation.
4. **Each output row carries its evidence class:** [Measured], [Modelled estimate], [Planning estimate, assumptions stated], [Not supported] or [Reference].

## D. Site-photo workflow: setback and access distances (2026-11-25)

The rule is: **no distance is used as a number unless a verified source gives it.** None was verified for Kenya, so the workflow says "distance requirement per WRA guidance — NOT VERIFIED" and asks for a professional check. The customer's own estimated distance is reported as entered.

| # | Topic | Source checked | What it says | Use |
|---|---|---|---|---|
| D1 | Latrine to water-point distance, by country | Parker, A. and Carlier, I. (2009). *National regulations on the safe distance between latrines and waterpoints*. DEW Point Enquiry A0304, DFID. https://assets.publishing.service.gov.uk/media/57a08b3c40f0b652dd000ba6/DEWPoint_A0304_Nov2009_National_regulations_safe_distance_latrines.pdf (text extracted 2026-11-25) | Lists national figures, e.g. Burkina Faso 25 m, Ethiopia 30 m, Ghana 50 m. It stresses that "following these guidelines does not guarantee safe drinking water". **Kenya is not covered.** | Context only: no number used |
| D2 | The "30 m" rule of thumb | UNHCR WASH guidance (search result, wash.unhcr.org Excreta Management) | The 30 m figure "is often used", but "the required distance can vary greatly depending on ground conditions". Attributed to the Sphere Handbook by secondary sources; **the Sphere text itself was not verified** | Not used |
| D3 | Kenya borehole siting relative to latrines and septic tanks | Water Resources Regulations 2021 (L.N. 43/2021) and 2025 (L.N. 58/2025), Kenya Law; Water Services Regulations | Searched: **no distance found** in the text reviewed | "NOT VERIFIED" |
| D4 | Overhead power-line clearance | Kenya Power and KETRACO wayleave pages (kplc.co.ke, ketraco.co.ke) | Wayleave and building restrictions described; **no 11/33 kV clearance figure found** | "NOT VERIFIED" |
| D5 | Drilling-rig access width and working area | Not found in a manufacturer or drilling-practice source in this pass | — | "NOT VERIFIED" |
| D6 | Borehole spacing (interference) | WRA regulations (as D3) | Not found | "NOT VERIFIED" |

Next action: obtain the WRA borehole siting guideline and the Kenya Power wayleave specification. Record each figure here with the clause, then reference it in `siteConstraints.ts`.

## E. Vision models

See `aquascan-vision-model-evaluation.md`, which gives the licence evidence per layer.

## F. Water-body check: offline lake, reservoir and coastline maps (2026-11-25)

Re-review of 126efdbc, M-2. The Open-Meteo elevation check was removed: Open-Meteo's free tier is for non-commercial use only (commercial use needs a paid plan), and it was unavailable on every run. The replacement is bundled in the page (`kenyaWater.ts`, ~76 KB, generated by a build script; rebuild from the sources, never edit by hand) and makes no network call.

| # | Layer | Source | Licence | Use |
|---|---|---|---|---|
| F1 | Lakes and reservoirs | OpenStreetMap `natural=water` polygons (`water=lake`/`reservoir`, or named "Lake …"), named, perennial (`intermittent=yes` dropped), bounding box over ~3 km²; queried via the Overpass API on 2026-11-25. 30 water-body entries, including Victoria (clipped to the Kenyan part), Turkana, Naivasha, Baringo, Nakuru, Bogoria, Elmenteita, Magadi, Jipe, Chala, and the Masinga, Kiambere, Gitaru, Kindaruma and Sasumua reservoirs. Added 2026-11-25 (re-review of f89698e8, MINOR), same source and licence: **Ndakaini Dam** (way 1119327511, tagged `landuse=reservoir`), and the **Turkwel Gorge reservoir**. OSM maps Turkwel Gorge as part of the Turkwel river area polygons (`water=river`), so those polygons are clipped to the impoundment at 1.795–1.918 N, 35.20–35.49 E, where the water is 16–29 km across against 0.2–2 km for the river channel. Simplified to ~130 m; islands and holes under ~0.3 km² dropped | © OpenStreetMap contributors, ODbL 1.0 (https://www.openstreetmap.org/copyright). Attribution is carried in the data file header | USED: refusal on open water |
| F2 | Coast | Natural Earth 10 m land polygons, clipped to 38.9–41.9 E, 4.85–1.45 S, simplified to ~220 m. Kenyan islands are taken from the existing geoBoundaries outline (`kenyaOutline.ts`) | Public domain (https://www.naturalearthdata.com/about/terms-of-use/) | USED: refusal in the sea |
| F3 | Kenyan islands (Lamu archipelago, Mombasa Island, Lake Victoria islands as land) | The existing Kenya outline `kenyaOutline.ts`: geoBoundaries gbOpen KEN ADM0 (Runfola et al. 2020, PLoS ONE 15(4): e0231866) | CC BY 4.0 (attribution required) | USED: a point on a Kenyan island is never 'sea' |

**Attribution shown to the customer.** ODbL requires attribution where the data is used. Every water-check outcome carries `WATER_MAP_ATTRIBUTION` ("Lake and reservoir maps © OpenStreetMap contributors (ODbL); coast: Natural Earth; islands: geoBoundaries (CC BY 4.0)"):

- the passed-check note;
- the near-shore note;
- the lake and sea refusals.

It is shown on the result page ("Water-body check:" line and the near-shore banner) and in every export (screening PDF, Word, Excel and CSV rows, JSON, and the full-PDF coordinates row).

Rules:

1. **Refusal.** A pin inside a water body and more than 300 m from its mapped shore is refused. For the sea the margin is 1 km.
2. **Near the shore.** A pin closer to the shore than the margin is not refused. The page shows "Water-body check inconclusive …" and holds reports until the customer confirms on a map that the site is on land.
3. **Rivers.** Rivers are not checked: Kenyan river channels are narrower than the pin and map accuracy.
4. **Checked against the records (2026-11-25).**
   - WRA/KenyaRAPID+ field records: 0 of 3,445 refused; 4 Lake Turkana shoreline boreholes are "inconclusive".
   - Measured groundwater records: 0 of 2,177 refused.
   - National registry: 2 of 22,820 refused, both geocoded 2.5 km and 8.9 km into Lake Victoria and Lake Turkana.
