# Pricing architecture & how to feed prices from the ERP

**Goal:** every price on the website comes from one place, and that place can be your ERP PRO — so when you update a price in the ERP, the website updates itself.

## How it works now

```
            ┌─────────────────────────────┐
            │  ERP PRO  (all your prices)  │   ← office LAN, port 8088
            └──────────────┬──────────────┘
                           │  (optional) read-only JSON over a tunnel
                           ▼
   ERP_PRICE_ENDPOINT ──► lib/pricing/source.ts ──► /api/pricing ──► website pages
                           │  (cached 15 min)
                           │  if endpoint unset/unreachable ↓
                           └──► lib/pricing/catalog.ts  (committed seed/fallback)
```

- **`lib/pricing/types.ts`** — the `PriceItem` shape (the contract).
- **`lib/pricing/catalog.ts`** — committed **seed/fallback** prices (VOLTKA from KES 500k → 5M, used from KES 200k, indicative pump & Deye/Felicity solar). Always marked *indicative*.
- **`lib/pricing/source.ts`** — `getPriceCatalog()`: fetches the ERP feed when configured, else uses the seed. ERP items override seed items with the same `id`.
- **`app/api/pricing/route.ts`** — public read-only feed: `GET /api/pricing` (or `?category=pump`).

Today, with no ERP endpoint set, the site serves the **seed** catalog. Nothing is fabricated — the seed uses your confirmed anchors and numbers already in the site.

## To make the website show LIVE ERP prices — pick ONE

### Option A (best): expose a read-only price endpoint from ERP PRO
1. In ERP PRO, publish a read-only JSON endpoint over your tunnel, e.g.
   `https://eims-erp.trycloudflare.com/api/public/price-list`
2. It must return either `PriceItem[]` or `{ "items": PriceItem[] }`. Example item:
   ```json
   {
     "id": "VKA-VKS20",
     "category": "generator-new",
     "brand": "VOLTKA",
     "name": "VOLTKA 20 kVA diesel generator",
     "spec": "20 kVA",
     "priceFromKes": 500000,
     "unit": "each",
     "indicative": true,
     "asOf": "2026-06",
     "source": "erp"
   }
   ```
   `category` is one of: `generator-new`, `generator-used`, `generator-rental`,
   `generator-lease`, `pump`, `solar`, `inverter`, `battery`, `spare-part`,
   `service`, `other`.
3. In Vercel, set env vars:
   - `ERP_PRICE_ENDPOINT` = the URL above
   - `ERP_PRICE_TOKEN` = (optional) a secret; the site sends it as `Authorization: Bearer …`
4. Redeploy. Done — prices refresh automatically every 15 minutes.

### Option B (fastest): give me an export
1. Export your product/price list from ERP PRO as **CSV or JSON**.
2. Hand it over (paste or drop the file in the repo).
3. I convert it into `lib/pricing/catalog.ts` so the seed itself is your real ERP data.

## Next step after prices flow in
Once the feed is live (or the export is in), I migrate each price display to read from
`/api/pricing` / `getPriceCatalog()` instead of its own hardcoded list. Consumers to migrate
(in priority order):

1. `components/generators/GeneratorPriceList.tsx` (add a real **VOLTKA** brand)
2. `app/solutions/borehole-pumps/page.tsx` (`PUMP_PRICING`, `VFD_SIZING`)
3. `app/solar/page.tsx` (`SOLAR_PRICING`) + `lib/solar-data.ts`
4. `components/hub/ProductIntelligenceClient.tsx` (catalogue)
5. `app/generators/rental/page.tsx`, `app/generators/leasing/page.tsx`
6. `app/data/spare-parts-database-COMPLETE.json` (2,080 SKUs)

Each migration is small and verified one at a time so nothing breaks.

## Why prices stay "indicative" on the site
The binding figure is always the **ERP quotation** (the site already forwards every
enquiry to ERP PRO via `ERP_QUOTE_ENDPOINT`). Showing indicative ranges + "exact quote
from our ERP" keeps the site honest and lets customers self-serve a ballpark while your
team issues the real, warranty-backed quote.
