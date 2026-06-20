# EmersonEIMS — SEO, Search-Engine Reach & Product-Visibility Audit

**Date:** 2026-06-20
**Scope:** Is our SEO as strong as it should be? Are we *selling* everything (incl. the 6 AI tools, generator spare parts, AquaScan Pro, borehole services)? Are we in "all 15 search engines" across Kenya, East Africa, Africa and beyond?
**Method:** Read the live SEO infrastructure in the repo (`app/sitemap.ts`, `app/robots.ts`, `app/layout.tsx`, `scripts/submit-to-search-engines.ts`) plus the AI-tool pages. Findings are grounded in code, not assumptions.

---

## TL;DR (the honest headline)

1. **The technical SEO foundation is genuinely strong** — comprehensive sitemap, all crawlers allowed, per-page canonicals, LocalBusiness + FAQ structured data, county/service pages. This is better than most Kenyan competitors.
2. **BUT being *in the sitemap* is not the same as *ranking* or *being verified everywhere*.** Three concrete gaps are hurting reach: (a) a **fake/placeholder Bing verification code**, (b) **search-engine "ping" submission that Google and Bing switched off in 2023**, and (c) **thin structured data for the AI tools and spare parts** so they don't earn rich results.
3. **The single most likely reason "no one asks for spare parts / AquaScan / boreholes" may NOT be SEO at all — it may be that inquiries are being silently dropped.** The Diagnostic Suite booking form is UI-only (doesn't send), and prior notes flag the contact form can drop leads if env vars are unset. **Fix lead-delivery first** — otherwise more traffic just leaks away.
4. "15 search engines" is achievable, but you don't *force* your way in — you **verify ownership, submit sitemaps, and earn ranking**. Realistic plan below.

---

## Part A — What's already good (verified)

- **Sitemap (`app/sitemap.ts`)** lists everything that matters, including all 6 AI tools, `/generators/spare-parts`, `/aquascan-pro-v3`, `/solutions/borehole-pumps`, every `/services/<slug>`, industries, blog, fault codes, and curated `/kenya/<county>` pages. ✅ So the pages *are* discoverable.
- **Robots (`app/robots.ts`)** explicitly welcomes Googlebot, Bingbot, Slurp (Yahoo), DuckDuckBot, YandexBot, Baiduspider, plus social crawlers (Facebook, Twitter/X, LinkedIn, WhatsApp, Pinterest, Telegram). ✅
- **Per-page canonical URLs** derived from the real path (fixes the old "everything canonicalised to homepage" bug). ✅
- **Structured data**: LocalBusiness schema + FAQ schema in the root layout. ✅
- **Geo signals**: `geo.region=KE`, coordinates, `og:locale=en_KE`, phone/area-served Kenya. ✅
- **IndexNow** key + script (`scripts/submit-to-search-engines.ts`) which *does* still propagate to Bing, Yandex, Seznam and Naver. ✅

> Conclusion: the **plumbing** is in place. The problem is **verification gaps, deprecated submission methods, and depth of content/links — plus a possible lead-capture leak.**

---

## Part B — Concrete problems found (with fixes)

### B1. Bing verification is a fake placeholder ⚠️ HIGH
`app/layout.tsx` hardcodes:
```html
<meta name="msvalidate.01" content="8F9B2C3D4E5F6A7B8C9D0E1F2A3B4C5D" />
```
That is a dummy string, not a real Bing token. **Bing Webmaster Tools is likely NOT verified**, which weakens Bing — and therefore **Yahoo and (partly) DuckDuckGo and Ecosia**, which all draw from Bing. Bing also feeds **ChatGPT/Copilot** answers.
**Fix:** create a Bing Webmaster Tools account, get the real `msvalidate.01` value (or import directly from Google Search Console), and replace the placeholder.

### B2. Search-engine "ping" submission is obsolete ⚠️ MEDIUM
`scripts/submit-to-search-engines.ts` pings `google.com/ping?sitemap=` and `bing.com/ping?sitemap=`. **Google retired sitemap ping in 2023 and Bing did too** — those calls now effectively do nothing.
**Fix:** rely on (1) **Google Search Console** sitemap submission, (2) **Bing Webmaster Tools** sitemap submission, and (3) **IndexNow** (still live — keep it). Drop or rewrite the Google/Bing ping functions so the script isn't giving a false sense of success.

### B3. Verification env vars must actually be set in Vercel ⚠️ MEDIUM
Google + Yandex verification only render **if** `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` / `NEXT_PUBLIC_YANDEX_VERIFICATION` are set (see `app/layout.tsx`). 
**Fix:** confirm both are present in Vercel production env. If blank, those engines aren't verified.

### B4. AI tools & spare parts have weak structured data ⚠️ MEDIUM
The 6 AI tools are world-class differentiators but appear to search engines as ordinary pages. There's no `SoftwareApplication`/`Product` schema for the tools, and no `Product`/`Offer` schema for spare parts.
**Fix:** add per-page JSON-LD: `SoftwareApplication` for each AI tool, `Service` for borehole/AquaScan services, `Product`+`Offer` (with `availability`, `brand`) for spare parts. This is what unlocks rich results and "Generator spare parts in Nairobi" visibility.

### B5. Discoverability inside the site (the real "customers don't know" cause) ⚠️ HIGH
Customers don't ask for spare parts / AquaScan / boreholes largely because these aren't **surfaced** where buyers look — top navigation, homepage, and internal links — and because the pages may not yet rank for buyer-intent queries. SEO is downstream of (a) content depth on each money page and (b) internal links from high-authority pages (homepage, services).
**Fix:** see the action plan (C).

### B6. ⚠️⚠️ Lead capture may be leaking (check FIRST)
- The **Diagnostic Suite `/booking` form is UI-only** — it shows a confirmation but does **not** send or store the booking (confirmed in code: "In production, this would send to your backend/email service").
- Prior project notes flag that the main contact form can **silently drop leads if email/Resend/ERP env vars are unset**, and `/api/notifications/new-lead` fakes `success:true` without delivering.
**This means inquiries may already be coming and being lost — which looks exactly like "no one ever asks."**
**Fix:** run `/api/contact/health` (and `?send=1` end-to-end test), point the booking form at `/api/contact`, and verify a real test lead arrives in inbox/ERP before spending on more SEO.

---

## Part C — Action plan (priority order)

### Priority 0 — Stop the leak (do this week)
- [ ] Hit `/api/contact/health?send=1` and confirm a test lead actually arrives (email + ERP/Sheet).
- [ ] Wire the `/booking` form to the real `/api/contact` delivery path.
- [ ] Set/confirm all lead env vars in Vercel (SMTP/Resend/ERP/Sheet webhook).

### Priority 1 — Fix verification & submission (this week)
- [ ] Verify the site in **Google Search Console** and submit `sitemap.xml`.
- [ ] Verify the site in **Bing Webmaster Tools**; replace the fake `msvalidate.01` with the real token.
- [ ] Verify in **Yandex Webmaster**; confirm `NEXT_PUBLIC_YANDEX_VERIFICATION` is set.
- [ ] Keep **IndexNow**; retire the dead Google/Bing ping calls.

### Priority 2 — Make every product sell (2–4 weeks)
- [ ] Add **SoftwareApplication** JSON-LD to each of the 6 AI tool pages (name, description, offers/free, screenshots).
- [ ] Add **Product + Offer** JSON-LD to `/generators/spare-parts` (brands, availability, price-on-request).
- [ ] Add **Service** JSON-LD to borehole/AquaScan and other service pages.
- [ ] Surface spare parts, boreholes/AquaScan, and the **AI Tools hub** in the **main navigation** and on the **homepage**, with buyer-intent anchor text.
- [ ] Add an internal-linking band on high-traffic pages → spare parts, borehole, AI tools (you already do this for the 6 AI tools via `AIToolsPromo` — extend the pattern to spare parts & boreholes).
- [ ] Write buyer-intent landing copy: "generator spare parts in Kenya/Nairobi/Mombasa", "borehole drilling site survey Kenya", "AquaScan Pro borehole water detection".

### Priority 3 — Earn ranking & wider reach (ongoing)
- [ ] **Google Business Profile** (Maps) fully optimised — this drives most local Kenyan leads and is separate from the website.
- [ ] Build a few quality backlinks (directories, industry bodies, supplier pages).
- [ ] Keep publishing the county × service pages and blog (long-tail is already strong).
- [ ] For East Africa/Africa reach: create country/region intent pages only where you genuinely serve, and localise (don't fake coverage — thin doorway pages get penalised).

---

## Part D — The "15 search engines" question, realistically

You can't pay or force your way into search engines; you **verify ownership, submit your sitemap, and then rank by relevance + authority.** Here's a realistic, high-coverage target list and how each is reached:

| # | Engine | How you get in | Covers / notes |
|---|---|---|---|
| 1 | **Google** | Search Console + sitemap | ~90%+ of Kenya & Africa traffic. The priority. |
| 2 | **Bing** | Bing Webmaster + real `msvalidate.01` | Also powers #3–#6 + Copilot/ChatGPT |
| 3 | Yahoo | (via Bing) | No separate submission |
| 4 | DuckDuckGo | (via Bing) | No separate submission |
| 5 | Ecosia | (via Bing/Google) | Popular eco-search |
| 6 | Brave Search | own index + crawl | Allow its crawler (robots already `*`) |
| 7 | **Yandex** | Yandex Webmaster + verification | Strong outside Africa |
| 8 | **Baidu** | Baidu Ziyuan (needs China presence) | Optional; hard without a China ICP |
| 9 | Seznam (CZ) | via **IndexNow** | Already covered by your script |
| 10 | Naver (KR) | via **IndexNow** | Already covered |
| 11 | Mojeek | independent crawler | Allow crawler |
| 12 | Startpage | (Google results) | No submission |
| 13 | Swisscows | (Bing results) | Via Bing |
| 14 | **ChatGPT / Perplexity / Copilot (AI search)** | strong content + Bing index + structured data | **The fastest-growing channel — your AI tools are perfect bait for it.** |
| 15 | **Google Business Profile / Maps** | claim & optimise listing | Where most local "near me" leads actually come from |

**Reality check:** verifying Google + Bing + Yandex + IndexNow already gets you into ~12 of these. Baidu is the only genuinely hard one (needs a China footprint) and is low-value for a Kenyan B2B engineering firm — don't over-invest there. **Put the freed-up effort into Google Business Profile and AI-search-friendly content instead.**

---

## Part E — Bottom line answers to your questions

- **"Is our SEO as powerful as it should be?"** — The foundation is strong; the *execution gaps* (fake Bing token, dead ping script, thin tool/parts schema, and possible lead leak) are what's capping results. Fix those and you'll see more than from any redesign.
- **"Are we selling all products incl. the 6 AI tools?"** — They're all in the sitemap and the 6 AI tools are linked from the homepage promo. But spare parts, boreholes/AquaScan, and the AI tools need **stronger navigation placement, internal links, and product/service schema** to actually convert searchers.
- **"Why does no one ask for spare parts / AquaScan / boreholes?"** — Most likely a combination of (1) **leads being dropped before you see them** (check this first), and (2) those pages not yet ranking for buyer-intent queries / not surfaced in nav. Less likely to be a crawling problem — those pages are already crawlable.
- **"Must we appear in all 15 engines worldwide?"** — You can reach ~12–14 of them by verifying Google/Bing/Yandex + IndexNow (mostly done), but **80–95% of your real leads will come from Google + Google Maps + AI search.** Prioritise accordingly.

> See the companion file **`docs/AI-TOOLS-OPERATING-GUIDE.md`** for the step-by-step operating guide for each of the 6 AI tools (what to enter, what result/report/quote to expect, and what is real vs marketing).
