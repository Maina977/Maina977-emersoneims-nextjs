# EmersonEIMS website audit (2026-11-05)

Scope: the `my-app` repository (deployed from `main` to Vercel as www.emersoneims.com) and the live site. Everything below was measured in this repository or on the live site on the date stated; nothing is assumed. Where a figure needs the owner, it is marked **PENDING OWNER**.

## 1. Repository inventory

| Item | Measured |
|---|---|
| Framework | Next.js 16.3 (App Router), React 18.3, TypeScript |
| Pages (`app/**/page.tsx`) | 312 |
| API routes (`app/api/**/route.ts`) | 141 |
| Components folders / lib modules | 97 / 71 |
| Regression and unit tests | 47 files, 538 tests, all passing (2026-11-05) |
| Hosting | Vercel (project `my-app`, team emerson-industrial-maintenance-ss-projects); production deploys on push to `main` |
| Database | Neon Postgres (env `DATABASE_URL`): leads table and first-party analytics |
| Enquiry delivery | `/api/contact`: stores the lead, then SMTP email to `LEAD_RECIPIENTS`; FormSubmit and ERP webhooks are secondary |
| Analytics | GA4 (two properties), Google Ads tag AW-16547857525 behind consent mode, first-party beacon |
| Engineering tools | AquaScan Pro, Generator Oracle, SolarGenius Pro, Building Suite + Pro Console |
| Release gate | `scripts/verify/run-local-verify.cjs --gate`: lint, production build, step-2 checks, AquaScan repeatability, route audit, 479-page site audit, Googlebot audit, SEO comparison |

## 2. Findings register

Severity: P0 blocks sales or trust; P1 high commercial impact; P2 SEO/marketing; P3 later.

| # | Issue | Where | Sev | Status | Evidence |
|---|---|---|---|---|---|
| 1 | Google Ads/crawler 403s | Vercel Firewall (DDoS mitigation, not middleware) | P0 | Diagnosed; owner-controlled | 697 denied / 6 challenged in the owner's firewall screenshot; Googlebot fetches of `/`, the tools and `/sitemap.xml` return 200 (live check 2026-11-05). Remedy: watch Firewall > Traffic for denied Googlebot/AdsBot; add a narrow bypass only if one appears |
| 2 | ~3,000 near-duplicate location pages diluting the domain | `/kenya/*`, `/locations/*/*` | P0 | **Fixed** (06108bb2, c71a3791) | 1,152 self-canonical pages now `noindex, follow`; pages with search traffic and all 479 sitemap URLs stay indexable; no sitemap URL carries noindex |
| 3 | Enquiry delivery unverified | `/api/contact` | P0 | **Verified** | Test lead #34 (2026-11-05 13:24): stored, SMTP sent, no "nobody was told" alarm. Owner to confirm inbox receipt **PENDING OWNER** |
| 4 | Dead ERP webhook on every enquiry | env `ERP_QUOTE_ENDPOINT` (expired trycloudflare tunnel) | P1 | Open, owner decision | Runtime log 10:24:32 ENOTFOUND |
| 5 | No form-completion conversion | `components/AnalyticsTracker.tsx` | P1 | **Fixed** (this batch) | `generate_lead` fired on every accepted `/api/contact` POST, service and page only, no personal data |
| 6 | Google Ads conversions not counted | `lib/analytics/ids.ts` `GOOGLE_ADS_CONTACT_LABEL` empty | P1 | **PENDING OWNER** | Needs the conversion labels from the Ads account |
| 7 | Generator prices inconsistent (250/500 kVA) | site-wide | P1 | Checked: consistent | One catalogue (`lib/pricing/catalog.ts`): VOLTKA from KES 500k at 20 kVA to 5M at 500 kVA, used from KES 200k, all marked indicative; `/solutions/generators/nairobi` quotes installation bands, not equipment |
| 8 | Unconfirmed testimonials (Greenheart, NTSA, Sanergy) | `app/generators/page.tsx` `ClientTestimonials` | P1 | Not rendered (component commented out); keep out | Only clients in `data/confirmedClients.ts` may be shown |
| 9 | Warranty drift | site-wide | P1 | Guarded | 2 years workmanship, motor rewinding 6 months (owner-confirmed); `scripts/check-claims.mjs` blocks other terms |
| 10 | Response-time claims | site-wide | P1 | Guarded | Single source `lib/business/responseTime.ts`: <4 h Nairobi metro, other counties by mobile workshop |
| 11 | Founding year conflict | brief says 2013 (formerly Sanjays Diesel); site says 1 March 2011 per Google Business Profile | P1 | **PENDING OWNER** | Not changed until the owner decides |
| 12 | No product catalogue / shop | none exists (`app/products` holds only the Oracle page) | P1 | Spec written (`PRODUCT_CATALOGUE_SPEC.md`); build blocked on verified product data | |
| 13 | Building Suite costing, fire travel distance, 3D | `lib/wizard-api/dispatcher.ts` 501 stubs | P2 | Open | No verified source reachable (IBC text blocked, no building cost rates) |
| 14 | AquaScan household pricing | uses institutional tender rates for every site | P2 | **PENDING OWNER** rates | KSh 2.39M for an 80 m household borehole |
| 15 | Open-Meteo free tier | no `OPEN_METEO_API_KEY` | P2 | Owner decision (paid) | Falls back to stored ERA5 rainfall, disclosed |

## 3. Strengths to preserve
- Release gate with 538 tests; claims guard (`check-claims.mjs`); duplication guard (sitemap ceiling 1,200).
- Engineering tools independently scored 7.5 to 8.5 / 10 on 2026-11-05 (AquaScan 8, Oracle 8.5, Solar 8.5, Building 7.5) before the final fixes, which addressed every major finding.
- Honest data policies: no invented clients, staff, reviews or certifications; modelled values labelled.

## 4. Not audited in this pass (stated, not implied)
Real-device Safari/iOS testing, field Core Web Vitals (no CrUX access), Google Search Console live index status (only the owner's CSV exports), legal pages review by a lawyer.
