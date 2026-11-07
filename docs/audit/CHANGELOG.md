# Changelog (updated 2026-11-07)

| Commit | Change |
|---|---|
| 85a140fc | Re-audit 7 Nov: one generator price source with VAT, ATS, delivery, installation and commissioning exclusions named; conflicting prices removed (industry packages, service bible, blog, FAQ install costs, ROI calculator at KES 200,000/kVA); sitewide FAQ schema warranty corrected; delivery and installation-time promises replaced by `lib/business/deliveryTime.ts`; `/generators/used` rebuilt on `lib/inventory/usedGeneratorStock.ts` (no invented prices, hours, models or photos), `/specs/used/*` 301 to it; marketplace undertakings removed, partner profiles 301; brand star ratings replaced with engine, parent company and ISO 8528 datasheet checks; founding year 2011 everywhere (About said 2013, four pages 2012), unmeasured experience numbers removed; solar inverter and AC temperature and standards errors corrected; constituency pages withdrawn from the sitemap |
| c9958d5f | Unconfirmed emergency response times replaced on 10 live pages; `generate_lead` test |
| 5467b629 | Re-audit 6 Nov: /generators FAQ price inclusions, booking AI-tool claim, Cummins D5 phase, used-unit figures |
| 9fd41d50 | Speed: homepage hero no longer content-visibility:auto; /contact h1 visible on first paint; /generators hero mounts only current and next slide |
| 8ef96972 | Lead stages: /admin/leads pipeline, /admin/login (rate-limited, HttpOnly cookie), /api/admin/leads (admin only, never deletes). Needs ADMIN_API_KEY in Vercel |
| 4acad138 | Articles link to their product and service pages (template + 17 hand-written articles) |
| 1224f3b2 | Menu: HOME, PRODUCTS, SERVICES, REPAIR CENTRE, ENGINEERING TOOLS, INDUSTRIES, RESOURCES, CONTACT; no link lost |
| 62dc6984 | Category forms: service request, spare parts, borehole site assessment, UPS sizing; removed stock and reply-time claims and borehole guarantees |
| 379ff212 | Generator Oracle: "Need an engineer for this fault?" with booking pre-filled |
| 8620b328 | Homepage "What are you looking for?" directory |
| 91694808, 99ed0281 | Installation warranty 1 year (solar, plumbing, AC, incinerators, UPS, borehole pumps, distribution boards) |
| 3d8bee57 | Founding year 2011; generators@ routing; 2-year warranty on all generators sold (new and used) |
| 81ac1973 | External audit fixes: banner prices, 3-year warranty bug, 6-month servicing, overnight promise, "this month", tripled CONTACT h1, NEMA wording |
| 27ab64e1 | Generator quotation form on /generators and size pages |
| 78a1067b | Enquiry reference (EIMS-000034) shown to customers and in lead emails; unconfirmed promises removed (2-hour/30-minute/24-hour response, KES 15,000 free assessment, fake 24-hour offer deadline, 98.7% uptime guarantee, "Booking Confirmed!", "50+ vetted partners", "Branch finder"); exit popup and sizing calculator report failures |
| eff89b73, fdce94e5 | Size pages for 125, 312, 375, 750 kVA with confirmed prices; 150 kVA page no longer opens with a 165 kVA photo |
| 722ecaf5 | /generators JSON-LD on that page only (was inherited by every child route) |
| 9b8a1ff3 | Generator prices: owner-confirmed VOLTKA list only (100–750 kVA, open/silent, prime, ex-warehouse, excl. VAT), one source file; "from KES 280,000", unconfirmed brand ranges and size bands, "prices include delivery/installation", "Free Delivery" and invented PDF sizes removed; other sizes "Request current price" |
| 8f8882c7 | Next.js 16.4.2, DOMPurify 3.4.17 (critical advisories cleared); `generate_lead` on accepted enquiries |
| 34f598cb, 151660ab, 5f142625 | Final scoring fixes: Building egress/ventilation/accessibility runnable in Suite and Console, per-door egress width, stair "not checked", gentle slopes not ramps, ADA ramp width; Solar single-phase homes and inverter count; Oracle hot-alternator line, near-duplicate steps, ignored readings named; AquaScan tender wording, honest cost range labels, Kisumu fluoride note |
| 9d5c6c13 | AquaScan priced at the EmersonEIMS signed Baringo tender rates (16 Oct 2026) |
| 964880d2, 59285d52 | Building Suite accessibility (ADA 2010, AD M 2024), egress (IBC 2021), ventilation (ASHRAE 62.1) |
| e2c73328 | Deye single-phase hybrids; relay quota handling; GRACE steps; Oracle alternator/crankcase/controller faults; Building single-lap and grade checks |
| 276d6f57 | AquaScan outage handling, chemistry rules, aquifer type, depth options; Oracle 50/60 Hz, step families, J1939 causes; Building UI fixes; Solar designer pricing and proposal; retired old public endpoints (410) |
| c71a3791, 06108bb2 | Location pages: noindex for near-duplicates without search traffic; canonical-aware; Oracle search fixes |
| b4d597b5 | Google Ads tag AW-16547857525 behind consent mode |

Full history: `git log`.
