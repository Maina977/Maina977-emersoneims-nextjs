# Removing power.emersoneims.com

**Decision (owner, 2026-08-26): remove it. It is not needed and it is competing
with www.emersoneims.com.**

This document is the removal plan. It exists because *how* it is removed changes
whether the domain's accumulated value comes back to www or is thrown away.

---

## Do not just delete it

Deleting the Netlify site or dropping the DNS record removes the competition —
and destroys everything those URLs have earned. Redirecting removes the
competition **just as completely** and hands the value to www instead.

| | Delete outright | 301 redirect, then delete |
|---|---|---|
| Stops competing with www | yes | yes |
| Existing backlinks | wasted — point at nothing | passed to www |
| Anyone with a bookmark | dead page | lands on the right page |
| Ranking signals | discarded | transferred |
| Effort | same | same |

**Redirect first, delete later. Removal happens either way.**

---

## What is actually there (measured 2026-08-26)

| | |
|---|---|
| URLs in its sitemap | 1,157 |
| Actually returning 200 | **~471 (41%)** — these are what compete |
| Already returning 404 | **~686 (59%)** — advertised in its own sitemap |
| Hosting | Netlify (`emersoneims-power.netlify.app`) |
| robots.txt | `Allow: /` — fully crawlable |
| canonical | self-referential, so it competes rather than defers |
| Links to www | yes (`/hub`, `/generator-oracle`, `/aquascan-pro-v3`) |
| Linked from www | **no** — checked across six page types |

It is a flat `.html` doorway grid — 20 service families across 55 towns — plus
about 54 blog articles. It also carries `/blog/generator-price-kenya`, competing
head-on with our own `/pricing/generator-prices-kenya`.

Two things follow from the 59% that already 404. First, less value is at stake
than 1,157 URLs suggested — much of it is already lost. Second, the site is
publishing a sitemap of broken URLs, which is its own quality problem.

**Redirecting is still worth doing**, because an external backlink pointing at a
404 is wasted, and a redirect rescues it. That is free value with no downside.

---

## The removal, in order

### Step 1 — put the redirects live (do this first)

**Option A — recommended. Move the hostname onto Vercel.**

The map is already implemented, tested and deployed in `middleware.ts` (guard
`0-HOST`). It is inert until DNS points here.

1. Vercel project → Settings → Domains → add `power.emersoneims.com`
2. Change the `power` DNS record from `emersoneims-power.netlify.app` to the
   value Vercel provides
3. Wait for the certificate to issue
4. Verify:
   ```bash
   curl -sI https://power.emersoneims.com/generator-sales-bomet.html
   # expect: 301 -> https://www.emersoneims.com/generators
   #         x-loc-guard: subdomain-consolidation
   ```

This needs no access to the Netlify site or to whoever built it. DNS is enough.

**Option B — keep it on Netlify.** Copy `_redirects` from this folder to that
site's publish root and redeploy. Identical map, Netlify syntax.

### Step 2 — confirm nothing is left competing

```bash
node docs/subdomain-consolidation/verify-redirects.mjs      # samples 120
SAMPLE=0 node docs/subdomain-consolidation/verify-redirects.mjs   # all 1,157
```

It walks the subdomain's sitemap and fails if any URL still answers directly or
redirects somewhere broken. **Exit code 0 is the gate for Step 4.**

### Step 3 — tell Google, then wait

- Keep the subdomain's Search Console property. Watch its indexed count fall.
- Do **not** use the Removals tool: that hides URLs temporarily without passing
  any signal, and it works against the redirect.
- Allow **6–12 months**. Google must recrawl every URL to see the redirect, and
  consolidation is gradual. This is the slow part and it cannot be rushed.

### Step 4 — delete it for good

Only once Step 2 passes clean and the subdomain's indexed count in Search
Console has fallen to near zero:

1. Delete the Netlify site (or unlink the custom domain)
2. Remove the `power` DNS record
3. Remove guard `0-HOST` from `middleware.ts` and delete this folder

Deleting earlier discards whatever had not yet transferred.

---

## The redirect map

1,157 URLs were tested against it: **1,156 resolve to a specific topical page**,
and only the homepage falls back to the homepage. All 28 destinations were
verified live to return HTTP 200 — nothing redirects into a 404, nothing chains.

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
| `/blog/*` (remainder) | `/blog` |

### Two deliberate choices

**The town is dropped.** `generator-sales-bomet.html` goes to `/generators`, not
to a Bomet page. www already has a real, differentiated `/kenya` structure, and
feeding 55 near-identical doorway pages into it would import the duplication
this removal exists to eliminate.

**Nothing redirects wholesale to the homepage.** Google reads "everything → `/`"
as a soft 404 — the destination does not answer what the URL promised — which
discards the value the redirect is there to capture.

---

## Worth salvaging first

The ~54 blog articles are genuine content. Right now the unmatched ones land on
`/blog`, which preserves far less than a real one-to-one move. If any are worth
keeping, copy them to `www.emersoneims.com/blog/...` **before** Step 4 and point
their rules at the migrated URLs. That is a content decision, not a redirect one.
