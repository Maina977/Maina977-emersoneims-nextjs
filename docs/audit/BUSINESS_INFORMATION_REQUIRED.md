# Business information required from EmersonEIMS (2026-11-05)

Nothing below is published until the owner supplies it. Each item says what it unlocks.

| # | Needed | Unlocks | Notes |
|---|---|---|---|
| 1 | Confirm the test enquiry (13:24, "TEST - website check") reached the inbox, including Spam | Proof enquiries reach sales | SMTP sent it; receipt is the last step |
| 2 | Google Ads conversion labels: "Website form / contact" and "Phone call clicks" | Ads can count enquiries | Set `NEXT_PUBLIC_GOOGLE_ADS_CONTACT_LABEL` or tell us the label |
| 3 | Founding date: 1 March 2011 (Google Business Profile, on the site now) or 2013 (formerly Sanjays Diesel, per the brief) | Consistent "about" and schema | Site unchanged until decided |
| 4 | Product list with verified data: model, rating (prime/standby), condition, price or "request price", stock, warranty, photos | Product catalogue and product pages | Prices must be current; old quotations are not used. **VOLTKA prices received 2026-11-05** (100–750 kVA, open/silent, prime, ex-warehouse, excl. VAT) and live in `lib/pricing/voltkaConfirmedPrices.ts`; still needed: model names, standby ratings, stock, photos per model, and prices for 10–80 kVA, 300 kVA and above 750 kVA if they are to be published |
| 5 | Household borehole rates (test pumping hours, development, gravel, mobilisation) | Second AquaScan price tier | Today every site uses the Baringo tender rates |
| 6 | Building cost per m² by type (residential, office, warehouse, school, hospital) or a priced building BOQ with floor area | Building Suite costing tool | |
| 7 | IBC 2021 or Kenya Building Code 2024 fire section (travel distance tables) | Fire travel-distance check | The code publisher blocks automated reading |
| 8 | Real shop prices for panels, inverters, batteries | SolarGenius shop | Shown today as "indicative" |
| 9 | Decide `ERP_QUOTE_ENDPOINT` (dead tunnel) — remove or replace | Clean enquiry logs | |
| 10 | Optional: Open-Meteo API key (paid) as `OPEN_METEO_API_KEY` | Live rainfall at busy times | |
| 11 | Verified project portfolio entries: title, county, equipment, capacity, scope, date, photos, permission to name | Projects section | Only owner-confirmed clients appear today |
| 12 | Lead routing: which email/WhatsApp per department (generators, solar, water, HVAC) | Department routing | Today all enquiries go to `LEAD_RECIPIENTS` |
| 13 | Legal pages approval: privacy, terms, sales terms, returns | Legal set | Drafts need owner and legal approval |
| 14 | Incinerator, HVAC, fabrication and plumbing: what is sold vs serviced, any certifications | Those service pages | |

## Status 2026-11-06
- ADMIN_API_KEY: set in Vercel production (secret) and verified live; the key is in a private file on the owner's Desktop.
- Certificates: searched IAF CertSearch, KEBS and the web for 'Emerson Industrial Maintenance Service' / 'EmersonEIMS'; no public record found. Numbers must come from the owner's certificates.
- Product data, unconfirmed generator prices and Google Ads conversion labels cannot be taken from the internet: they are the company's own stock, prices and Ads account.
