# Changelog (2026-11-05)

| Commit | Change |
|---|---|
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
