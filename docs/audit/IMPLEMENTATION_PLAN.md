# Implementation plan (2026-11-05)

| Pri | Item | Files | Blocked on | State |
|---|---|---|---|---|
| P0 | Critical Next.js/DOMPurify advisories | `package.json`, lockfile | — | Done (8f8882c7), gated |
| P0 | Generator prices match the owner's confirmed list | `lib/pricing/voltkaConfirmedPrices.ts` and 22 consumers | — | Done (9b8a1ff3, 722ecaf5), live 2026-11-06; size pages 125/312/375/750 kVA (eff89b73) |
| P0 | Near-duplicate location pages | `lib/seo/locationIndexPolicy.ts` | — | Done, live |
| P0 | Enquiry delivery proven | `/api/contact` | — | Done: test enquiry #34 received (owner, 2026-11-06) |
| P0 | Crawler 403s | Vercel Firewall | owner (dashboard) | Diagnosed; watch Traffic for Googlebot |
| P1 | Lead conversion event | `components/AnalyticsTracker.tsx` | — | Done (8f8882c7) |
| P1 | Ads conversion labels | `lib/analytics/ids.ts` | owner labels | Waiting |
| P1 | Lead reference shown to customer | `lib/leads/reference.ts`, `app/api/contact/route.ts`, 5 live forms | — | Done (78a1067b): EIMS-000034 on contact, quick enquiry, booking, exit popup, sizing calculator, and in the lead email |
| P0 | Unconfirmed response promises and offers | live forms, EmergencyCTA, solar booking, /services, /pricing, nav | — | Done (78a1067b): only owner-confirmed wording; exit popup and calculator no longer report failed sends as success |
| P1 | Department routing | `lib/leads/routing.ts` | — | Done (3d8bee57): generators@, solar@ added; info@ gets all |
| P1 | External audit P4 menu, §3 directory, §4 category forms, §5 Oracle escalation, §6.4 article links, §7 lead stages | see CHANGELOG | — | Done (8620b328–8ef96972) |
| P2 | Core Web Vitals | homepage, /contact, /generators | — | Measured (Lighthouse lab, mobile); three render blockers fixed (9fd41d50); re-measure after deploy; field data needs PageSpeed quota or Search Console |
| P1 | Lead pipeline live | Vercel env | owner sets ADMIN_API_KEY | Waiting |
| P1 | Product catalogue | `lib/pricing/catalog.ts`, new `app/products/*` | verified product data | Spec ready |
| P1 | Founding date consistency | site-wide | — | Done (3d8bee57): 2011 |
| P2 | Remove dead ERP webhook | Vercel env | owner OK | Waiting |
| P2 | nodemailer 10 | `package.json`, `/api/contact` | delivery test | Planned |
| P2 | xlsx replacement | Solar quote parser | — | Planned |
| P2 | Household borehole tier | `external/borehole-ai-engine/src/costModel.ts` | owner rates | Waiting |
| P2 | Building costing, fire travel distance | `lib/wizard-api/buildingCalcs.ts` | owner rates; code text | Waiting |
| P3 | Re-audit the tools for final scores | — | — | Optional, ~40 min |
| P3 | AquaScan validation against drilled records | AquaScan | — | Project |
