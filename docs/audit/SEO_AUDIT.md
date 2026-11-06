# SEO audit (2026-11-05)

## Evidence used
Owner's Search Console exports (performance 2026-07-12 to 2026-10-10; Pages export used for the keep-list), the built sitemap, Googlebot and browser fetches of the live site (slow, spaced), and the release gate's site audit.

## State
- Organic search is small and recovering from the 2026-08-21 demotion (scaled near-duplicate location pages): about 2 clicks and 20 to 200 impressions a day in the export.
- Sitemap: 479 URLs; every one is 200, self-canonical, indexable, one h1, unique title (gate site audit: 0 errors across 479 pages).
- Googlebot receives the same content as a browser (gate Googlebot audit) and 200 on key pages live.

## Done in this project (2026-11-05)
| Change | Why | Evidence |
|---|---|---|
| 1,152 self-canonical near-duplicate location pages set to `noindex, follow`; ~1,890 alias pages keep only their cross-page canonical; 686 paths with clicks or >20 impressions stay indexable | Doorway/scaled-content risk; Google advises against mixing noindex with a cross-page canonical | Live check: trimmed page `noindex, follow`, earned page `index, follow`; no sitemap URL carries noindex |
| Copyright year current, garbage glyphs removed from PDFs | Quality signals | Built pages |

## Not changed, deliberately
- No new location or keyword pages: the brief's keyword list maps onto existing pages (`/generators`, `/generators/used`, `/solar`, `/services/*`, `/kenya/<county>`). Creating near-identical pages per keyword or town would repeat the pattern that caused the demotion.
- No review/rating schema: no real review corpus exists.

## Keyword-to-page map (existing pages)
| Search intent | Page |
|---|---|
| generators for sale Kenya; Cummins generators Kenya | `/generators`, `/voltka`, `/services/cummins-generators` (new = VOLTKA, Cummins engine) |
| used generators Kenya | `/generators/used`, `/specs/used/<brand>` |
| generator maintenance / repair Nairobi | `/services/generator-repairs`, `/generator-services` |
| solar installation / panels / inverters Kenya | `/solar`, `/services/solar-energy`, `/services/solar-inverters`, `/solar-genius-pro` |
| UPS systems Kenya | `/services/ups-systems` |
| borehole drilling / submersible pumps Kenya | `/services/borehole-drilling`, `/services/borehole-pumps`, `/aquascan-pro-v3` |
| motor rewinding Nairobi | `/services/motor-rewinding` |
| hospital incinerators Kenya | `/services/hospital-incinerators` |
| ATS panels Kenya | `/services/ats-changeover` |
| AC / HVAC | `/services/ac-installation`, `/services/air-conditioning` |
| plumbing | `/services/plumbing` |
All slugs confirmed in `lib/services/allServices.ts` / `app/services` on 2026-11-05.

## Next steps
1. In 3 to 4 weeks, export Search Console Pages again; re-run `keep_list` so pages that start earning are re-indexed.
2. Add `Product` schema only when the catalogue has verified data.
3. Request indexing for `/generators`, `/solar`, `/services/borehole-drilling` after the next content update.
