# Stopping power.emersoneims.com competing with www.emersoneims.com

## What the problem actually is

Measured on 2026-08-26:

| | www.emersoneims.com | power.emersoneims.com |
|---|---|---|
| URLs in sitemap | 1,407 | 1,157 |
| robots.txt | crawlable | `Allow: /` — fully crawlable |
| canonical | self | **self** |
| Sells | Cummins generators, solar, UPS, Kenya | **the same** |
| Hosting | Vercel | Netlify (`emersoneims-power.netlify.app`) |

Two sites, one market, same keywords, each telling Google it is the canonical
version. Google must choose one for every query, and any backlink either site
earns counts for that site alone. The subdomain even carries
`/blog/generator-price-kenya`, competing head-on with `/pricing/generator-prices-kenya`.

This is almost certainly costing more ranking than any on-page work gains.

## What the subdomain is

A flat `.html` doorway grid:

- **20 service families × 55 towns = ~1,100 pages** — `generator-sales-bomet.html`,
  `borehole-pumps-eldoret.html`, `motor-rewinding-kisumu.html` and so on
- **~54 blog articles** — genuine content, some of it useful
- a handful of index and one-off pages

The service×town pages are the same doorway pattern that damaged the main site
and had to be undone there. They should not be preserved as they are.

## Two ways to fix it — pick one

### Option A (recommended): move the subdomain onto Vercel

The redirect map is **already implemented and tested** in `middleware.ts`
(guard `0-HOST`). It is inert — it only fires for `power.emersoneims.com` — so
it is already deployed and waiting.

To activate:

1. In the Vercel project, add `power.emersoneims.com` as a domain.
2. Update the DNS record for `power` to the value Vercel gives you
   (it currently CNAMEs to `emersoneims-power.netlify.app`).
3. Wait for the certificate to issue.
4. Verify: `curl -sI https://power.emersoneims.com/generator-sales-bomet.html`
   should return `301` to `https://www.emersoneims.com/generators` with the
   header `X-Loc-Guard: subdomain-consolidation`.

**Why this is better:** the map lives in this repo, so it is version-controlled,
reviewable, and testable from here. No dependency on access to the Netlify site
or whoever set it up.

### Option B: keep it on Netlify

Copy `_redirects` from this folder to the **publish root** of the Netlify site
(next to `index.html`) and redeploy. Same map, Netlify syntax.

If you do not have access to that site's source, Option A avoids the problem
entirely — DNS is under your control regardless.

## What the map does

1,157 URLs were tested against it. **1,156 land on a specific, topical page**;
only the homepage falls back to the homepage. All 28 destinations were verified
to return HTTP 200 on www — no redirect lands on a 404 and none chains through
another redirect.

| Subdomain pattern | Destination |
|---|---|
| `/generator-sales-*` | `/generators` |
| `/generator-repair-*` | `/services/generator-repairs` |
| `/generator-installation-*` | `/generators/installation` |
| `/generator-hire-*` | `/generators/rental` |
| `/generator-spare-parts-*` | `/generators/spare-parts` |
| `/engine-overhaul-*` | `/generators/workshop-services` |
| `/amf-ats-installation-*`, `/diesel-automation-*` | `/solutions/diesel-automation` |
| `/distribution-boards-*` | `/services/distribution-boards` |
| `/hv-systems-*` | `/solutions/high-voltage` |
| `/motor-rewinding-*`, `/motors-drives-*` | `/services/motor-rewinding` |
| `/steel-fabrication-*` | `/solutions/fabrication` |
| `/hospital-incinerators-*` | `/services/hospital-incinerators` |
| `/hvac-installation-*` | `/services/ac-installation` |
| `/borehole-pumps-*` | `/services/borehole-pumps` |
| `/ups-systems-*` | `/services/ups-systems` |
| `/solar-installation-*` | `/services/solar-energy` |
| `/commercial-solar-*` | `/solar` |
| `/solar-sizing-*` | `/solutions/solar-sizing` |
| `/blog/generator-price*` | `/pricing/generator-prices-kenya` |
| `/blog/*` (rest) | `/blog` |

### Two deliberate decisions

**The town is dropped.** `generator-sales-bomet.html` goes to `/generators`, not
to a Bomet page. www already has a real, differentiated `/kenya` structure;
pointing 55 near-identical doorway pages into it would import the duplication
this consolidation is removing.

**Nothing redirects to the homepage wholesale.** Google reads "everything → `/`"
as a soft 404 — the destination does not answer what the URL promised — which
discards the authority the consolidation exists to preserve.

## Worth doing afterwards

The ~54 blog articles are real content. Right now the unmatched ones land on
`/blog`, which preserves far less than a genuine one-to-one move. Migrating the
good ones to `www.emersoneims.com/blog/...` and pointing each rule at its
migrated URL would recover more. That is a content job, not a redirect job.

## How to confirm it worked

After activation, and again a few weeks later:

```bash
# every family should 301 to a real page
curl -sI https://power.emersoneims.com/generator-sales-bomet.html | head -3
curl -sI https://power.emersoneims.com/blog/generator-price-kenya  | head -3
```

In Search Console, the subdomain property should show its indexed count falling
as www absorbs the queries. That takes weeks, not days — Google has to recrawl
1,157 URLs to see the redirects.
