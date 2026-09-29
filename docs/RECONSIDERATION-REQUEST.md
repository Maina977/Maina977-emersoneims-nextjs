# Reconsideration request — emersoneims.com

**Status: ready to send if Search Console → Security & Manual Actions shows a manual action.**
If that screen says "No issues detected", do not send this. There is nothing to
reconsider, the demotion is algorithmic, and the same remediation below is the
remedy — it simply recovers through re-crawling rather than review.

Paste the section marked **REQUEST TEXT** into the reconsideration form. Keep it
factual and short; reviewers read many of these. Everything in it is verifiable
on the live site.

---

## Why this exists

Organic impressions fell 97% in a single day on 2026-08-21, from 1,373/day to
29/day, and have stayed flat since. Search Console's coverage export of
2026-09-29 rules out every technical cause: Googlebot receives HTTP 200
sitewide, robots.txt allows full crawling, no indexable page carries `noindex`,
and the sitemap is clean and self-canonical. Roughly 51,000 pages were still
indexed on the day impressions collapsed, so the drop was not caused by
deindexing — the deindexing followed over the next four weeks.

What the domain carried at that moment was approximately 59,000 near-duplicate
programmatic location pages. That is the condition Google's scaled-content and
doorway-page policies address.

## What was actually wrong

Stated plainly, because a reconsideration request that minimises the problem
gets rejected:

1. **Scaled near-duplicate location pages.** Tens of thousands of
   county/constituency/village × service permutations generated from templates,
   differing mainly by a substituted place name. Measured in August at 60–68%
   identical on 8-word phrase overlap between unrelated locations.
2. **Fabricated trust signals.** Review and rating schema (7 ratings, 4 reviews)
   with no review corpus behind it; invented testimonials attributed to named
   individuals; a fabricated client list; invented competitor comparison data.
3. **Unsupported claims.** An authorised-dealer claim that was not true,
   unevidenced certification claims, and warranty figures that varied between
   1, 2, 3 and 5 years across the site.
4. **One template's engineering content served across unrelated trades** — solar
   and motor-rewinding pages carried generator derating calculations.

## What has been done

Every item is a dated commit in the repository and verifiable on the live site.

**The duplicate sprawl is gone.**
- Village-tier pages removed from the index; ~40,000 now correctly excluded
- 567 near-duplicate town pages consolidated onto county canonicals
- 1,200+ near-duplicate URLs withdrawn from the sitemap (`529943cd`, 15 Aug)
- Sitemap reduced to 929 curated, self-canonical URLs
- Remaining pages rewritten so each carries sourced, location-specific
  engineering — measured 2026-09-29 at **50–53%** overlap for the same service
  across counties and **39–43%** for different services in one county, against
  60–68% in August

**Fabricated content is removed, and the build now blocks its return.**
- Review and rating schema removed (`fe97060a`, `e9db33b0`)
- Fabricated testimonials and client names removed (`c9b5f708`); the component
  holding four invented named testimonials was deleted outright
- Fabricated competitor data removed (`495c6af0`)
- `scripts/check-claims.mjs` fails the build on false-claim patterns, including
  authorised-dealer wording, invented ratings, unsupported warranty terms,
  free-survey contradictions, absolute uptime guarantees and company-age claims

**Claims are now accurate.**
- The authorised-dealer claim is gone and guarded (`73bb075c`)
- Warranty standardised: two years on workmanship, six months on motor
  rewinding, each labelled as ours and separated from manufacturer terms
- Brand position stated correctly: one make sold new, others sold used and
  serviced — not a dealership claim
- Pages where no project has been published in that discipline say so
  explicitly rather than showing unrelated work as proof

**Technical hygiene.**
- Soft-404s eliminated; unknown URLs return real 404s (`dd89e63d`)
- Canonical conflicts resolved (`fe70e285`, `4565047a`)
- Over-long titles reduced from 28.3% of pages to 2.6%
- 1,239 unreachable files deleted after proving unreachability by import graph

## What the site is now

4,970 pages, of which 929 are submitted for indexing. Mobile Lighthouse:
Accessibility 100, SEO 100, Best Practices 96. Every page in the sitemap is
self-canonical. Fourteen build guards block the classes of error above from
returning.

---

## REQUEST TEXT

> We have removed the scaled, low-value content that this site was previously
> publishing and rebuilt what remains.
>
> The site previously generated tens of thousands of near-duplicate location
> pages — county, constituency and village permutations of the same service
> templates, differing largely by a substituted place name. It also carried
> fabricated trust signals: review and rating structured data with no reviews
> behind it, invented testimonials attributed to named individuals, a
> fabricated client list, and an inaccurate claim of authorised dealership.
>
> All of it has been removed.
>
> The village tier is no longer indexable. 567 near-duplicate town pages now
> canonicalise to their county page. The sitemap has been reduced from several
> thousand URLs to 929 curated, self-canonical pages. The location pages that
> remain were rebuilt around sourced per-location data — elevation and
> temperature from Open-Meteo and GeoNames — so each carries engineering
> specific to that place and trade. Measured on 8-word phrase overlap, pages
> that were 60–68% identical are now 39–53%.
>
> All fabricated review and rating markup, testimonials and client claims have
> been deleted. The dealership claim is gone. Warranty terms are now stated
> consistently and separated from manufacturer terms. Where we have not
> completed a project in a given discipline, the page says so plainly instead
> of showing unrelated work as evidence.
>
> We have also added automated checks that fail our build if any of these
> patterns reappear, so this cannot regress silently.
>
> We understand why the site was actioned. The content that caused it no longer
> exists, and the pages that remain are ones we can stand behind.

---

## After sending

Do not resubmit. Reviews typically take days to a few weeks. Do not make large
structural changes while under review — the reviewer is assessing the state
described above.

If the response is a rejection, it will name what is still wrong; that is
actionable information and should be fixed before a second request.
