# Rollback: restore power.emersoneims.com to Netlify

If the consolidation needs undoing, this single command puts it back exactly as
it was on 2026-08-26:

```bash
npx vercel dns add emersoneims.com power CNAME emersoneims-power.netlify.app.
```

## What was there before

| | |
|---|---|
| Record id | `rec_31b5969885ce7798e4de2596` |
| Name | `power` |
| Type | `CNAME` |
| Value | `emersoneims-power.netlify.app.` |
| Created | 82 days before 2026-08-26 |

## What replaced it

An `A` record pointing at Vercel (`76.76.21.21`), so the hostname is served by
this project and middleware guard `0-HOST` 301s every path to its matching page
on www. `power.emersoneims.com` was also added as a domain on the `my-app`
Vercel project — removing that is `vercel domains rm power.emersoneims.com`.

## Why it was changed

The subdomain served 1,157 crawlable, self-canonical URLs selling the same
generators in the same market as www, splitting every ranking signal and
backlink between two domains the business owns. Owner instruction, twice:
remove it.

Note that only ~41% of those URLs still returned 200 — the other ~59% were
already 404 while remaining in its sitemap.
