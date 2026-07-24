# CRITICAL: Vercel Environment Variables for Lead Delivery

**STATUS**: Code is production-ready. Leads will silently fail if these env vars are NOT set in Vercel.

## CRITICAL (Must-Have)

### Database
- `DATABASE_URL` or `POSTGRES_URL` - PostgreSQL connection string
  - Stores all leads durably
  - Required for `/api/contact/health` to report safe delivery

### Lead Delivery Channels (At Least ONE Required)

Choose at least one:

#### Option 1: SMTP (Own Mail Server) - RECOMMENDED
```
SMTP_HOST=mail.emersoneims.com
SMTP_USER=info@emersoneims.com
SMTP_PASSWORD=<password>
SMTP_PORT=465
SMTP_FROM_EMAIL=info@emersoneims.com
SMTP_FROM_NAME=EmersonEIMS Website Leads
LEAD_RECIPIENTS=info@emersoneims.com,sally@emersoneims.com
SALES_EMAIL=emersoneimservices@gmail.com
```

#### Option 2: Resend Email API
```
RESEND_API_KEY=re_xxxxxxxxxx
SALES_EMAIL=emersoneimservices@gmail.com
```

#### Option 3: ERP PRO Quote Forwarding
```
ERP_QUOTE_ENDPOINT=https://erp.emersoneims.local:8088/api/quotes
```

#### Option 4: Webhook
```
LEAD_WEBHOOK_URL=https://your-crm.com/webhooks/leads
```

## OPTIONAL (Recommended Add-ons)

### Emergency WhatsApp (Free via CallMeBot)
Sends instant WhatsApp to sales team when lead arrives.

**ONE-TIME SETUP:**
1. From phone (0768860665), send "I allow callmebot to send me messages" to +34 644 84 71 89 on WhatsApp
2. CallMeBot replies with API key
3. Set env vars:

```
CALLMEBOT_PHONE=254768860665
CALLMEBOT_APIKEY=<from step 2>
```

### SMS Alerts (Africa's Talking)
```
AFRICASTALKING_API_KEY=xxxx
AFRICASTALKING_USERNAME=xxxx
SALES_PHONE=+254768860665
```

### WhatsApp Business API (Meta)
```
WHATSAPP_ACCESS_TOKEN=xxxxx
WHATSAPP_PHONE_NUMBER_ID=xxxxx
NEXT_PUBLIC_WHATSAPP_NUMBER=254768860665
```

## Diagnostics

### Test Lead Delivery
```bash
curl -X GET "https://www.emersoneims.com/api/contact/health?token=<LEAD_DIAG_TOKEN>&send=1"
```

Response shows:
- `lead_is_safe: true` → leads are being delivered
- `lead_is_safe: false` → **ACTION REQUIRED** — set env vars above

### Required Diagnostic Token
```
LEAD_DIAG_TOKEN=<any-secret-string>
```
Or fall back to `ADMIN_API_KEY`

## Current Status

### ✅ Code is Ready
- `/api/contact` endpoint: LIVE
- 9 delivery channels configured: LIVE
- `/api/contact/health` diagnostics: LIVE
- Contact form UI: LIVE

### ❌ MISSING: Vercel Env Vars
**This is why leads may be silently lost.**

## What Happens Without Env Vars

| Channel | Configured | Result |
|---------|-----------|--------|
| Database | ❌ | Leads not stored |
| SMTP | ❌ | Email not sent |
| Resend | ❌ | Email not sent |
| ERP | ❌ | Quotes not forwarded |
| Webhook | ❌ | External CRM not notified |
| CallMeBot | ❌ | No WhatsApp alert |
| SMS | ❌ | No SMS alert |

**Lead is "safe" if:** `(Database OK) AND (At least 1 delivery channel working)`

Without this, the site returns `delivered: false` and tells visitor to use WhatsApp fallback (which works, but doesn't close the loop automatically).

## Next Steps

1. **TODAY**: Set at least `DATABASE_URL` + one delivery channel env var in Vercel
2. **Test**: Run `/api/contact/health?token=...` to verify
3. **Send test lead**: Add `&send=1` to see real-time delivery status
4. **Monitor**: Check logs for "LEAD NOT DELIVERED" messages

## File References

- Contact form code: `/app/api/contact/route.ts`
- Health diagnostics: `/app/api/contact/health/route.ts`
- Form UI: `/app/contact/page.tsx`

---
**Last Updated**: 2026-07-24
**Status**: Production-Ready, Env Vars Required for Full Functionality
