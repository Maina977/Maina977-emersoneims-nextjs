# Analytics tracking plan (2026-11-05)

## Tags in place (verified in `components/analytics/GoogleTags.tsx`, `lib/analytics/ids.ts`)
- GA4: `G-1YQPD7PN51`, `G-ZHLF2TQH7N` (both configured; delete the stale one when known).
- Google Ads: `AW-16547857525`, loaded behind consent mode. Live on every page (checked 2026-11-05).
- First-party beacon to `/api/analytics/collect` (Postgres), no third party.

## Events (all in `components/AnalyticsTracker.tsx`)
| Event | Fires when | Parameters | Ads conversion |
|---|---|---|---|
| `generate_lead` | the server accepts a POST to `/api/contact` (any of the 11 forms) | `lead_service`, `lead_source`, `page_path` | yes, once the label is set |
| `contact_phone` | click on a `tel:` link | `event_label`, `page_path` | yes, once the label is set |
| `contact_whatsapp` | click on a `wa.me` / WhatsApp link | same | yes, once the label is set |
| `contact_email` | click on a `mailto:` link | same | yes, once the label is set |
| `cta_click` | any other tracked call-to-action | same | no |

Rules: no names, phone numbers, emails or messages are ever sent to Google (Kenya Data Protection Act, GA4 policy). A click is engagement; only an accepted form is a lead.

## Still needed
- The two Ads conversion labels (`GOOGLE_ADS_CONTACT_LABEL`); with separate labels for form and call, split the variable.
- Optional later: `request_quote` and `product_enquiry` once the product catalogue exists; `datasheet_download` once datasheets are published.

## Verification
After the label is set: submit one labelled test enquiry, then check GA4 DebugView and the Ads conversion "Recent conversions" column within 24 h.
