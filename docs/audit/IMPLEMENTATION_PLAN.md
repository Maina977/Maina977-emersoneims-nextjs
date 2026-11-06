# Implementation plan (2026-11-05)

| Pri | Item | Files | Blocked on | State |
|---|---|---|---|---|
| P0 | Critical Next.js/DOMPurify advisories | `package.json`, lockfile | — | Done (8f8882c7), gated |
| P0 | Generator prices match the owner's confirmed list | `lib/pricing/voltkaConfirmedPrices.ts` and 22 consumers | — | Done (9b8a1ff3, 722ecaf5), gated |
| P0 | Near-duplicate location pages | `lib/seo/locationIndexPolicy.ts` | — | Done, live |
| P0 | Enquiry delivery proven | `/api/contact` | owner inbox check | Sent; awaiting owner |
| P0 | Crawler 403s | Vercel Firewall | owner (dashboard) | Diagnosed; watch Traffic for Googlebot |
| P1 | Lead conversion event | `components/AnalyticsTracker.tsx` | — | Done (8f8882c7) |
| P1 | Ads conversion labels | `lib/analytics/ids.ts` | owner labels | Waiting |
| P1 | Lead reference shown to customer | `app/api/contact/route.ts`, forms | — | Next |
| P1 | Department routing | `app/api/contact/route.ts` | owner routing list | Waiting |
| P1 | Product catalogue | `lib/pricing/catalog.ts`, new `app/products/*` | verified product data | Spec ready |
| P1 | Founding date consistency | site-wide | owner: 2011 or 2013 | Waiting |
| P2 | Remove dead ERP webhook | Vercel env | owner OK | Waiting |
| P2 | nodemailer 10 | `package.json`, `/api/contact` | delivery test | Planned |
| P2 | xlsx replacement | Solar quote parser | — | Planned |
| P2 | Household borehole tier | `external/borehole-ai-engine/src/costModel.ts` | owner rates | Waiting |
| P2 | Building costing, fire travel distance | `lib/wizard-api/buildingCalcs.ts` | owner rates; code text | Waiting |
| P3 | Re-audit the tools for final scores | — | — | Optional, ~40 min |
| P3 | AquaScan validation against drilled records | AquaScan | — | Project |
