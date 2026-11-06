# Sales conversion plan (2026-11-05)

## Enquiry routes today (verified)
- 11 forms post to `/api/contact` (contact page, booking, quick inquiry, exit intent, generator sizing, spare parts, faults, Oracle product page, others). Each lead is stored, emailed by SMTP, and now counted as `generate_lead`.
- Phone and WhatsApp links on every page (+254 768 860 665; Oracle support +254 782 914 717), tracked as `contact_phone` / `contact_whatsapp`.
- Tool to enquiry links: AquaScan results have survey and contact actions; Oracle faults link to WhatsApp an engineer; SolarGenius produces a proposal PDF.

## Gaps and order of work
| # | Gap | Fix | Needs |
|---|---|---|---|
| 1 | Ads cannot count enquiries | set `GOOGLE_ADS_CONTACT_LABEL` | owner labels |
| 2 | No product pages to advertise | catalogue (`PRODUCT_CATALOGUE_SPEC.md`) | verified product data |
| 3 | One inbox for every enquiry | route by `service` to department emails in `/api/contact` | owner routing list |
| 4 | No lead reference shown to the customer | return and show `EIMS-<leadId>` in the confirmation | none (next batch) |
| 5 | Lead status tracking | `leads.status` column exists (new/spam/duplicate); add the brief's states and a simple admin view | owner decision on who uses it |
| 6 | Category forms (generator, solar, parts, service, borehole) | extend the existing form with category fields; keep one API | none for the build; owner review of fields |

## Principles
A click is not a lead; only an accepted form is. No promises the business cannot keep: response time from `lib/business/responseTime.ts` only.
