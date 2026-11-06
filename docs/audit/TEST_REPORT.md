# Test report (2026-11-06)

Build tested: commit `722ecaf5` (includes `8f8882c7` security and `generate_lead`, `9b8a1ff3` confirmed generator prices). Not yet deployed.

## Step 1: build and tests
| Check | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npx vitest run` | 48 files, 544 tests passed |
| `npx eslint` | 0 errors (warnings only, pre-existing) |

## Step 2: release gate on the built site (`run-local-verify.cjs --gate`, 08:40–09:12)
| Stage | Result |
|---|---|
| Lint | 0 errors |
| Production build | passed |
| Step-2 checks (pages, retired endpoints return 410, sitemap 479, robots tags) | all passed |
| AquaScan repeatability (same site, same answer) | passed |
| Route audit | 18 of 18 routes pass |
| Site audit | 0 errors across 479 pages |
| Googlebot audit | Googlebot gets the same content as a browser |
| SEO compare against the live baseline | passed |
| **Result** | **PASSED** |

## Step 3: independent price check on the built pages (62 checks, all passed)
Pages: `/`, `/generators`, `/voltka`, size pages for 10, 100, 300 and 500 kVA, `/pricing/generator-prices-kenya`, `/pricing`, `/brands/cummins`, `/brands/perkins`, `/faq`.
- Every page returns 200; none shows "280,000" (generator) or "Free Delivery".
- Every open-frame or silent figure shown is in the owner's list of 2026-11-05.
- Every JSON-LD `lowPrice`/`highPrice` is a confirmed figure (2,100,000 and 9,100,000).
- 10 kVA page: shows "Request current price", is titled "Sizing and Quotation", carries no price offer.
- 100 kVA page: shows open frame KES 2,100,000 and silent KES 2,500,000 with the price basis.
- Perkins brand page: no price offer.
- `/generators`: full VOLTKA list to 9,100,000; no "prices include delivery".

## Found and fixed during testing
- The `/generators` layout schema (with the price offer) was inherited by every `/generators/*` page, so the 10 kVA page told Google it offered 2.1M–9.1M. Moved to the `/generators` page only (`722ecaf5`), with a test.
- The site's rate limiter answers 403 to request bursts and to curl's user agent; the checks space requests 2.5 s apart. Not a site fault.

## Not tested here
- Live production (nothing pushed yet). After the push: the spaced live check (9 s between requests).
- Inbox delivery of the test enquiry (owner to confirm).
