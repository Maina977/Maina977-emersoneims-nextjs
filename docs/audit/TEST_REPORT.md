# Test report (2026-11-07, re-audit)

Build tested: `38d6b46f` (re-audit `85a140fc` + guard fixes); deployed as `5e50bcb8` (adds only the e2e browser setting).

| Check | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npx vitest run` | 65 files, 649 tests passed |
| Pre-build guards (14) | all pass (division-link guard now knows `/brands/<slug>`; segment guard updated for removed `/specs`, `/marketplace/partners`) |
| Gate: lint, build, step 2, route audit (18/18), site audit (0 errors, 433 pages), Googlebot audit, SEO compare | passed |
| Gate: AquaScan | first run timed out: ISRIC SoilGrids answering in 44-66 s and 502 (direct request 31 s); no AquaScan file changed since the 6 Nov pass. Re-run per site: Nairobi, Garissa, Kitale all passed, two identical runs each |
| Playwright `e2e/reaudit-2026-11-07.spec.ts` (local build, installed Chrome, contact API and Google tags stubbed) | 6/6 passed |
| Live after deploy: `live-smoke.cjs`; `/generators/used`, `/specs/used/cummins` (301), `/about-us` (Est. 2011), `/marketplace` (In Formation) | passed |
| Live crawler sample (Googlebot, AdsBot UAs, 8 requests spaced 3 s) | 200 with self canonical; `/counties/*` 308; marketplace noindex |
| Vercel firewall, last 24 h | Googlebot 291 requests, the 35 denied/challenged were all WordPress probe paths (`/cms/`, `/wp-json/`); no AdsBot traffic yet |

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

## Speed (Lighthouse 12.6, mobile, simulated 4G), 2026-11-06
Method: previous and new Vercel deployments tested back-to-back, alternating, median of 3, so the test machine's state applies to both.

| Page | Before | After (live 06e4509a) |
|---|---|---|
| /generators | score 59, LCP 4.6 s, TBT 879 ms | score 65, LCP 4.3 s, TBT 888 ms |
| /contact (run A) | score 73, LCP 2.6 s, TBT 882 ms | score 73, LCP 3.5 s, TBT 639 ms |
| /contact (run B, busier machine) | score 54, LCP 3.8 s, TBT 2,697 ms | score 60, LCP 3.7 s, TBT 1,374 ms |
| / | score 77, LCP 3.3 s, TBT 485 ms | score 76, LCP 3.7 s, TBT 446 ms |

CLS passes everywhere (0.007-0.027). LCP is still above 2.5 s on all three pages; the remaining cost is React hydration of the large client pages and Google's two tags (~0.6 s, not changed: removing either tag would lose Ads or Analytics data). A 2.5 s delay on the /contact CSS loops was tested on a preview deployment, showed no gain, and was reverted unshipped.

