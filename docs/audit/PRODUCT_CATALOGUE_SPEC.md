# Product catalogue specification (2026-11-05)

Status: specification only. Building it now would publish invented data, so it waits for the owner's verified product list (`BUSINESS_INFORMATION_REQUIRED.md` item 4).

## Source of truth
Extend `lib/pricing/catalog.ts` (already the seed catalogue, with ERP override via `ERP_PRICE_ENDPOINT`, see `docs/PRICING-AND-ERP.md`). No new database or CMS is needed for a few hundred items.

## Fields
`id`, `name`, `category` (generator-new, generator-used, generator-parts, solar-panel, solar-inverter, solar-battery, ups, ats-amf, pump, motor, hvac, incinerator, fabrication), `brand`, `model`, `sku`, `condition` (new | used | refurbished), `ratings` (generators: `primeKva`, `standbyKva`, `kw`, `voltage`, `frequencyHz`, `phases`, `powerFactor`, `engine`, `alternator`, `controller`, `fuelLph` at 25/50/75/100%, `tankL`, `noiseDbA@7m`, `dimensionsMm`, `weightKg`, `enclosure`), `description`, `images[]` (genuine photographs only), `price` (`kes` | null), `vatIncluded`, `priceIncludes` (delivery, installation, commissioning), `stock` (in-stock | on-order | null = unknown), `warranty` (text, owner-confirmed), `datasheetUrl`, `related[]`, `featured`, `lastVerified` (date), `seo` (title, description).

## Rules
- `price: null` shows **Request Current Price**; never a guessed figure.
- `stock: null` shows nothing about availability.
- Prime and standby ratings are stored separately and labelled; never one "kVA".
- `lastVerified` older than 90 days hides the price and shows "Request Current Price".
- New generators: VOLTKA only; used: the brands in `voltka-only-make-sold`; all makes serviced.

## Pages
`/products` (category grid), `/products/<category>` (filters: brand, condition, kVA range; sort), `/products/<category>/<id>` (specs, price or request, warranty, WhatsApp enquiry prefilled with model, enquiry form posting to `/api/contact` with `service` = category). `Product` schema only with real price/availability.

## Effort
About 2 to 3 days once data exists, including tests and the gate.
