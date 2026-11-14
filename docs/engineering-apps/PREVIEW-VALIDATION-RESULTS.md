# Preview validation results

13 Nov 2026 · management authorisation "Protected preview only".

| | |
|---|---|
| Preview URL | https://my-8edm6xja9-emerson-industrial-maintenance-ss-projects.vercel.app (branch alias `my-app-git-de-ec5b99-…vercel.app`) |
| Deployment | `dpl_2JXqU7nwxWHytoBaBL4JH8e7wKsv`, target **preview**, READY 18:39:30 UTC |
| Commit | `66582d45` on `dev/p0-aquascan-pump-test-integrity` (parent `079d0188`); 79 files, +3,271 / −793 lines |
| Production | Unchanged: `079d0188`, `vercelEnv: production` (live `/api/health`, 13 Nov 22:0x); remote `main` = `079d0188` |
| Logs | `C:\Users\User\Documents\EmersonEIMS-proposals\preview-validation-2026-11-13\gate-2137\` |

## Headline

- The protected preview exists and is locked.
- Production is unchanged, and production secrets are excluded from Preview.
- The local release check on the committed code passed every stage except **AquaScan repeatability** (FAIL, cause measured).
- **Most live checks are BLOCKED.** Testing inside the protected preview needs a temporary Vercel protection-bypass token. Claude Code's permission system refused to create it, so those checks were not run and nothing was worked around.

## Results

### Live preview (item 8)

| Check | Status | Evidence |
|---|---|---|
| Authentication | **PASS** | Anonymous requests to `/`, `/api/health`, `/robots.txt` and `/api/contact` on the deployment URL, and `/` on the branch alias: all **HTTP 302 → vercel.com/sso-api**, no site content returned |
| Production secrets excluded | **PASS** | Preview environment: 0 variables (GROQ/GEMINI preview copies deleted earlier). Production: 40, unchanged |
| Noindex headers, robots.txt | **BLOCKED** (live) · PASS (code) | Needs access inside the preview. Code-level: 3 tests (preview build sends `X-Robots-Tag: noindex, nofollow`; robots.txt `Disallow: /`) |
| Form isolation | **BLOCKED** (live) · PASS (code) | Needs access inside the preview. Code-level: 6 tests (nothing sent or stored outside production) |
| API compatibility | **BLOCKED** (live) · PASS (code) | 13 route-level tests locally |
| Calculations | **BLOCKED** (live) · PASS (code) | Benchmarks pass locally (slab 14.40 m³, RC beam 284.4 kNm, IRR 5.96 %, battery 27.78 kWh) |
| Reports | **BLOCKED** (live) | Demonstration PDF labelling covered by local tests |
| Mobile usability | **BLOCKED** (live) · PASS (local) | STEP2 checks phone and desktop widths and overflow on the local build: passed |
| External service failures | **BLOCKED** (live) · PASS (code) | Source-outage tests (11) locally |
| Complete workflows | **BLOCKED** (live) | Script ready (`live-check.cjs`): solar ROI, quote checker, demonstration PDF, Oracle answers, AI-unavailable message |
| Screenshots | **BLOCKED** | Taken by the same script once access is allowed |

### Lighthouse A/B (item 9)

**BLOCKED.** It needs the same access to the preview. A script is ready: 3 pages (`/`, `/solar`, `/generator-oracle`), 3 mobile runs per environment, alternating, cache cleared, medians reported. The bypass cookie is limited to the preview host, and the Chrome profile is deleted afterwards.

### Full release check on the commit (item 10)

Run locally on `66582d45`, 13 Nov 21:37–22:02.

| Stage | Status |
|---|---|
| Lint | PASS (0 errors) |
| Build (incl. engine type check) | PASS |
| STEP2 browser checks (incl. the 5 new pricing checks, phone and desktop) | PASS |
| **AquaScan repeatability** | **FAIL**: Kitale gave 70 m vs 61 m. Soil arrived in run 2 ("clay, ISRIC SoilGrids") and not in run 1 ("not known"). ISRIC's server drops about 1 in 3 connections (R13). AquaScan code is unchanged since the passing runs at 18:21 and 19:49, so this is not a regression, but it is a real repeatability defect whenever SoilGrids is intermittent. Root fix: serve Kenya soil data from our own site (P1, not authorised on this candidate) |
| Route audit | PASS (18/18) |
| Site audit | PASS (0 errors, 433 pages) |
| Googlebot audit | PASS |
| SEO compare vs production | PASS (structure; the approved /solar and FAQ wording changes are content) |
| Unit tests | **823 / 823** (the 816 from before plus 7 new: approved pricing and demonstration content, and the licence fix) |
| Type check | Clean |

### Approved changes made before the preview

| Item | Status | Evidence |
|---|---|---|
| 3. AI without keys | PASS (code) | AI clients raise "not configured"; the expert chat returns `AI_UNAVAILABLE`. Live wording BLOCKED |
| 4. /solar pricing wording | Done | Approved for preview testing |
| 5. Demonstration proposal | PASS | Every BOM line reads "(illustrative price, not an EmersonEIMS offer)"; DEMONSTRATION banner, file name and sheet names; own constants; never reads or writes the project store; cash-flow tools start blank |
| 6. Service price ranges | PASS | Borehole survey, diagnostic visit and AMC ranges removed from `ToolSeoContent` and the borehole hub; "Request a quotation" with the pricing factors |
| 7. Cummins 111 | PASS | 7 tests; applicability still pending the manual edition |

## Security finding (reported immediately)

**Built-in demo licence accepted on production.**
- **Where:** `app/api/generator-oracle/activate/route.ts`.
- **Defect:** when a key is not in the database, the route falls back to a hard-coded demo licence (`EIMS-TEST-0001-DEMO`) and returns a working "pro" licence. This happens on production too.
- **Why the device limit doesn't help:** the "one device" limit is held in each server instance's memory.
- **Impact:** the paid Oracle tier can be unlocked without paying.
- **Status:** **fixed on this branch.** Demo licences are refused when `VERCEL_ENV` is `production`. A test proves it, and fails against the old code.
- **Not tested on production:** probing production would itself activate a licence.
- **Production still has the defect** until a release is approved.

## Rollback

- **Production:** nothing to roll back; it was not changed.
- **Preview:** delete deployment `dpl_2JXqU7nwxWHytoBaBL4JH8e7wKsv` (or leave it; it is locked).
- **Branch:** `dev/p0-aquascan-pump-test-integrity` can be deleted from GitHub without affecting `main`.
- **Future release:** if a release of this branch were approved and failed, promote `dpl_5SSpj75HqtUG7xjZYLtufj3uj6HB` (Vercel instant rollback). No data migrations.
- **Preview AI keys:** deleted by management instruction. Restoring them is not recommended.

## Changed files

See commit `66582d45` (`git show --stat 66582d45`): 79 files.

- **Generator Oracle:** safety rules, Cummins 111, calculators.
- **Solar:** 3D engine, battery sizing, reproducibility, string assumptions, price policy across 13 places, demonstration labels.
- **AquaScan:** pump test, outages, surface water, claims.
- **Building Suite:** withdrawn report endpoint, slab take-off.
- **Preview safety:** delivery guard, noindex, robots, demo-licence fix.
- **Service price ranges** removed.
- **Docs and tests.**

## Recommendation

**NO-GO for production consideration at this time.**

1. **Live validation is incomplete.** Every live item except authentication is BLOCKED pending access to the protected preview: noindex, forms, APIs, workflows, mobile, external failures, reports and the Lighthouse A/B.
2. **AquaScan repeatability FAILS** when SoilGrids is intermittent (R13). Results stay honest ("not known" when absent), but the same site can still give different depths.
3. **No independent engineering review.** Independent published references cover only the IRR and the directive benchmarks. Real-project validation and external professional review remain outstanding. This is not certification and not commercial market readiness.

## Remaining limitations

| Area | Limitation |
|---|---|
| Engineering: Oracle | Guided diagnostics not built; OEM fault records lack per-code source and manual version; calculators checked only against hand calculations |
| Engineering: Solar | No real-project comparisons; component datasheet library and cable/protection checks incomplete |
| Engineering: AquaScan | Success score uncalibrated (no drilled-borehole validation set); soil data unreliable (R13); pump-test methods need a hydrogeologist (R4) |
| Engineering: Building | QS/BOQ, quotation, report and BIM endpoints are not built (501) |
| Security | Demo-licence defect live on production until released; preview AI keys not provisioned (AI unavailable on the preview); `npm audit` and a penetration test not done |
| Commercial | Unsourced prices remain elsewhere on the site (AC, UPS, generator rental, blog and fault-guide costs, `/pricing`): needs a site-wide price audit and owner decisions. Solar shows "Request a quotation" until a price source is recorded |
| SEO | /solar and FAQ wording approved for preview only; production SEO approval still needed |
| Process | `external/**` not linted (R9); independent reviewers not engaged |

## To finish validation

Allow a **temporary Vercel protection-bypass token** for this preview, or a permission rule for it. Safeguards: never printed, sent only to the preview host, revoked and verified revoked afterwards. Then:

1. run `live-check.cjs` (about 10 minutes, with screenshots);
2. run `lighthouse-ab.cjs` (about 15 minutes);
3. complete this report.

Alternatively, a logged-in person can run the checklist by hand, in which case Lighthouse stays BLOCKED.
