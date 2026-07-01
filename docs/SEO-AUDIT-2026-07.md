# EmersonEIMS — Comprehensive SEO Audit & Growth Report
**Date:** 2026-07-01 · **Site:** https://www.emersoneims.com · **Method:** 5-specialist audit (technical SEO, local-SEO architecture, content/E-E-A-T, market/keyword research, conversion) cross-verified against the **live site**.

> ⚠️ **Verification note.** Every "critical" raised by the audit was checked against the live site before being accepted. Several agent "P0" alarms turned out to be **already solved** (canonicals, schema, doorway protection). Those are listed under "Already strong" so we do not waste effort or create duplicates. Items are labelled **[VERIFIED]** (confirmed live/in-code by me) or **[REPORTED]** (agent finding, not yet independently confirmed).

---

## 1. Executive summary

EmersonEIMS is **not** a weak-SEO site that needs thousands of new pages. It is a **well-architected local-SEO system** that already:
- Publishes **1,673 indexable URLs** (1,475 under `/kenya`), covering **all 47 counties**, county+service combos, and constituency+service combos for priority counties.
- Ships **rich structured data** (LocalBusiness, Service, FAQPage, BreadcrumbList, GeoCoordinates) on geo pages — the markup that wins Google's local pack.
- Has **doorway-spam protection** (curated registries + `dynamicParams=false`) that deliberately avoids the 72,000 thin village pages that would get the domain penalized.

**The real levers are not "more pages" — they are:**
1. **Off-site:** Google Business Profile + directory citations (dominates the Kenyan mobile local pack).
2. **On-page quality:** tighter titles (done), per-county unique data, "cost 2026" pillar content.
3. **Fill existing routes** for tier-1 cities on high-intent *repair/hire/suppliers* terms.
4. **Own low-competition, high-ticket niches** where national players are weak.

**Biggest risk to avoid:** mass-generating service × village/constituency pages. That would convert a healthy domain into a doorway-penalty target. The current curation is a feature, not a limitation.

---

## 2. Current state — VERIFIED live metrics

| Metric | Value | Source |
|---|---|---|
| Total sitemap URLs | **1,673** | `curl /sitemap.xml` |
| `/kenya` geo URLs | **1,475** (47 county + 557 county-svc/constituency + 870 constituency-svc) | sitemap depth analysis |
| `/locations` URLs | 56 | sitemap |
| Services, industries, blog, hub, faults | ~90 combined | sitemap |
| Schema on `/kenya/mombasa` | LocalBusiness, Service, FAQPage, GeoCoordinates, AdministrativeArea, OpeningHours, ContactPoint, PostalAddress, Offer | live HTML |
| Canonicals | Present on System 2/3/4/5 (county, county-svc, constituency, locations) | live HTML |
| Robots / engines | All major engines allowed (Google, Bing, DuckDuckGo, Yandex, Baidu, social) | `app/robots.ts` |

### Geo page architecture (systems)
- **System 2** `/kenya/[county]` — 47 county hubs. Unique per-region engineering content via `CountyPowerContent` (altitude/climate/loads). **Lowest doorway risk.**
- **System 3** `/kenya/[county]/[...slug]` — county+service (all 47 × ~10 core services) + constituency & constituency+service (10 priority counties only). Curated via `lib/seo/kenyaIndexable.ts`, `dynamicParams=false`.
- **System 4/5** `/locations/[location]` + `/locations/[location]/[service]` — curated 8 top towns × 5 core services = 40 indexed combos.
- **System 6** `/sectors/[sector]/kenya/[location]` — industry × priority county.
- **`/counties/*`** — **301-redirects to `/kenya/*`** (dead static files; safe).

---

## 3. Already strong — DO NOT "fix" these (agents flagged, verified already handled)

| Agent alarm | Reality [VERIFIED] |
|---|---|
| "/counties are critical doorway pages" | They **301-redirect** to `/kenya/*` (next.config.ts:638,643). Not indexed. |
| "System 3 pages missing canonicals" | Canonical **is set** via `lib/seo/location-service-metadata.ts` helper + live HTML confirms it. |
| "/locations/*/* pages have NO schema" | They **do** ship LocalBusiness + Service + FAQ schema (live HTML confirms). |
| "Village pages will cause penalty" | Villages are **intentionally excluded** from the indexable set. |

**Lesson:** future SEO work must verify against live HTML before editing — the codebase already solves most textbook issues via shared components.

---

## 4. Issues & fixes

### ✅ FIXED 2026-07-01 (commit 73cff1d) — [VERIFIED]
**Title tags across all 1,475 geo URLs + 47 county pages.**
- **Before:** ~110 chars, brand **doubled** ("Emerson EiMS | EmersonEIMS"), generator-only framing. Root template appended `%s | EmersonEIMS — B2B Power & Engineering Solutions Kenya` (~55 chars) on top of already-descriptive titles → truncated in SERPs, brand + keywords lost.
- **After (live-verified):**
  - `/kenya/mombasa` → `Generators, Solar & Power Services in Mombasa County | EmersonEIMS Kenya`
  - `/kenya/nairobi/langata` → `Generators & Power Services in Langata, Nairobi | EmersonEIMS Kenya`
- Shortened the global template to `%s | EmersonEIMS Kenya`, removed the duplicate `| Emerson EiMS`, normalized brand spelling, broadened county pages beyond generators.

### 🔧 Open verified/likely gaps (prioritized)

| # | Priority | Item | Fix | Status |
|---|---|---|---|---|
| 1 | P1 | Contact form ignores `?service=` / `?topic=` (industry pages link with them) | Add `useSearchParams()` prefill in the contact form | [REPORTED] verify + do |
| 2 | P1 | Per-county LocalBusiness geo uses generic coordinates | Add `geo{lat,lng}` per county to `lib/data/kenya-locations.ts`, use in `LocationServiceSchema` | [REPORTED] |
| 3 | P2 | `/analytics` may be indexable dupe of `/admin/analytics` | Add `robots:{index:false}` or redirect | [REPORTED] verify |
| 4 | P2 | `/alltools` vs `/all-tools` possible duplicate | Add 301 in next.config.ts | [REPORTED] verify |
| 5 | P2 | Tool pages (solar-genius-pro, aquascan-pro-v3, generator-oracle) lack Product/SoftwareApplication schema | Add per-page JSON-LD | [REPORTED] |
| 6 | P0 (owner) | **Bing verification = placeholder token**; IndexNow key weak | Owner supplies real Bing token + IndexNow GUID; I wire them | [VERIFIED] placeholder in `public/BingSiteAuth.xml` |
| 7 | — | Sticky/floating CTA removed (deliberate, "annoying") | Leave unless owner wants a subtle location-aware bar | [VERIFIED] intentional |

---

## 5. Keyword & market landscape (Kenya, B2B power/engineering)

Intent: 🔴 buyer-ready · 🟠 research-with-budget · 🟢 top-funnel.

### Generators (deepest demand — your #1 category)
| Keyword | Intent | Competition |
|---|---|---|
| generator prices in kenya / for sale nairobi | 🔴 | Very high (generators.co.ke, Jiji, Jumia own SKU terms) |
| generator repair / service / hire nairobi / [town] | 🔴 | **Medium — beatable on service intent** |
| generator suppliers in nairobi / kenya | 🔴 | High |
| 20/50/100 kVA generator price kenya | 🔴 | Medium (long-tail) |
| AMF / ATS panel kenya | 🟠 | **Low — under-served** |
| generator spare parts nairobi | 🔴 | Medium (you already rank at Kamukunji) |

### Solar
| commercial solar / solar for business kenya | 🔴 | Medium — your B2B lane |
| solar for hospitals/factories/schools | 🔴 | **Low — high value, under-served** |
| solar water pump price kenya | 🔴 | Medium |

### Water/Borehole (strong intent, content-heavy SERP)
| borehole drilling cost kenya | 🟠 | Very high → win with a "cost 2026" guide |
| borehole drilling [county] (Kajiado, Machakos, Kiambu, Nakuru) | 🔴 | Medium — **county pages win here** |
| hydrogeological survey kenya cost | 🟠 | Low-medium |

### Other
- **UPS:** industrial/online UPS (data centre, 10kVA+) = 🔴 **low competition**.
- **Motor rewinding:** you already rank page 1 — defend + expand (3-phase, pump motor).
- **HVAC:** commercial HVAC / cold room = 🔴 B2B lane.
- **Incinerators:** medical-waste / NEMA-approved = 🔴 **low competition, high ticket — easy authority win.**
- **Transformers / HV:** distribution transformer kenya = 🔴 low competition (local presence beats importers).

### Geo priority (where B2B search + budget live)
1. **Nairobi (~60–70% of opportunity)** + sub-areas (Industrial Area, Westlands, Karen, Ruaraka, Embakasi).
2. **Mombasa** (port, hotels, coastal borehole niche).
3. **Nakuru** (Rift Valley agri/commercial).
4. **Kiambu / Thika / Ruiru** (Nairobi metro + Thika industry).
5. **Eldoret (Uasin-Gishu)**, **Kisumu**, **Machakos/Kajiado** (borehole hotspots), then Coast (Kilifi/Kwale), Mt Kenya (Nyeri/Meru/Embu).
Concentrate human-written depth on tiers 1–7; keep 8–47 as templated-but-unique county pages for long-tail.

---

## 6. Competitors & why they rank

| Competitor | Ranks for | Why |
|---|---|---|
| generators.co.ke, generatorskenya.co.ke | generator sales/service/parts | Per-kVA + per-service URLs, price in title, aged domain |
| Jiji / Jumia / Machineryline | "for sale" product terms | Marketplace authority — **don't fight these** |
| powerpro.co.ke | repair + `/location/mombasa` | Service+location model = same as your `/kenya/[county]/[...slug]` — study it |
| Repelectric, Sprintex | motor rewinding | Aged domains, trade-body credibility |
| Solar City, Ecolink | solar cost | Long "cost 2026" guide pages (snippet bait) |
| Menengai, KNH Contractors | borehole cost | "Cost per meter" guides refreshed yearly |
| Essential Apparatus, Plenser | incinerators | NEMA-approval trust signals, niche near-monopoly |

**Cross-cutting rank drivers to match:** per-service AND per-capacity URLs; "cost/price 2026" guides; **Google Business Profile + directory citations**; free-quote CTA above the fold.

---

## 7. SERP features to target
- **Google Map Pack / Local Pack — HIGHEST ROI.** ~30–44% of clicks, 80%+ mobile. A fully optimized **Google Business Profile** (complete NAP, 10+ photos, 50+ reviews with replies, price-range service list, 2 posts/month) lets an SME outrank national players. Do Nairobi HQ (+ Mombasa if there's presence).
- **People-Also-Ask / FAQ** — "cost / how much / how long / what size kVA" — answer as FAQ blocks with schema (you already have FAQPage markup).
- **Featured snippets** — the "cost 2026" table format owns borehole/solar/generator-sizing queries.
- **Image pack** — original project photos (VOLTKA shots) help image results + GBP.
- **Product rich results** — spare parts / generator SKUs with price schema.

---

## 8. Content / E-E-A-T assessment
- **Strongest:** `/kenya/[county]` hubs — genuinely unique per-region engineering narrative. Keep and deepen.
- **To improve (differentiate templated pages without manual writing per page):** inject real per-county data — altitude/derating, dominant industries, sample project references, nearest-branch/turnaround, local challenges (coast salt corrosion, arid dust, highland derating). Data can be a single `lib/data/county-specifics.ts` map consumed at build time.
- **Add real proof** where possible: project names + capacity + year, testimonials, photos with alt text — the E-E-A-T signals aged competitors win on.

---

## 9. Conversion (SEO traffic → leads)
Lead pipeline (`/api/contact`) is **confirmed working** (DB + ERP + email). On geo pages:
- Present: tel:, WhatsApp deep link, "Get a Free Quote" (links to /contact), trust signals, LocalBusiness schema with telephone (enables call button in local pack).
- Improve: read `?service=`/`?topic=` to prefill the form; capture parsed county/service into the lead (currently raw pathname — still useful, parsing is nicer); consider one subtle location-aware CTA (avoid the old "annoying" floating widgets).

---

## 10. Prioritized action roadmap

### Quick wins (0–4 weeks)
1. **[OWNER] Google Business Profile optimization** (Nairobi + Mombasa) + list on BusinessList.co.ke, Yellow.co.ke — highest ROI, mostly free.
2. **[OWNER] Provide real Bing + IndexNow tokens** → I wire them (10 min).
3. ✅ Title tags — **DONE**.
4. Contact form `?service=` prefill + `/analytics` noindex + `/alltools` redirect — small code fixes.
5. Fill `/kenya/[county]/[...slug]` for Nairobi/Mombasa/Nakuru/Thika/Kisumu/Eldoret on repair/hire/suppliers terms (route already supports it — needs curated params + content).

### Mid-term (1–3 months)
6. **"Cost 2026" pillar guides**: borehole drilling, commercial solar, generator kVA sizing → featured snippets.
7. Per-county unique data injection (`county-specifics.ts`) to strengthen all 47 county pages.
8. Product/SoftwareApplication schema on the AI tool pages.
9. Expand curated towns (Meru, Nyeri, Kericho, Bungoma, Kitale) + promote ~5–10 more counties to priority — **unique content per page only**.

### Long-term (3–9 months)
10. Own low-competition niches with dedicated depth: incinerators (NEMA), AMF/ATS, industrial UPS, transformers, 3-phase motor rewinding.
11. Industry authority hubs (hospitals, hotels, factories, banks, county govt) cross-selling the full stack, with case studies.
12. Reviews + citations + backlink flywheel to close the domain-age gap on aged competitors.

### Do NOT do
- ❌ Generate `/locations/{village}/{service}` (≈72,000 thin pages) — doorway penalty.
- ❌ All 9 services × all 1,300+ locations.
- ❌ All 290 constituencies × services without unique per-page content.
- ❌ Chase product-SKU terms owned by Jiji/Jumia/Machineryline.

---

## 11. Owner-only actions (I cannot do these from code)
1. **Google Business Profile** setup/optimization + review campaign.
2. **Real Bing Webmaster verification token** and **IndexNow API key** (currently placeholders).
3. Directory listings (BusinessList.co.ke, Yellow.co.ke) for NAP citations.
4. Real project photos + client testimonials/consent for E-E-A-T proof.

---

*Prepared by the SEO audit run (5 specialists + live verification). All code changes are committed to `main`; title-tag fix is live. Next code actions await go-ahead per section 10.*
