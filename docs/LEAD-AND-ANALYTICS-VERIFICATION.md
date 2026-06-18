# Lead Delivery & Website Analytics — Verification & Bulletproofing

This is the single source of truth for (1) making sure **every website enquiry
reaches a human**, and (2) the **real-time visitor counter** (with country /
county / city) that feeds the EIMS CampaignPilot AI app. Read this end-to-end
once, set the Vercel env vars, deploy, then run the verification commands.

---

## PART 1 — Why leads were being lost (and how it's now sealed)

Every public form (homepage CTA, `/contact`, exit-intent popup, generator
calculator, spare-parts, quick callback) POSTs to **`/api/contact`**, which fans
the lead out to up to **7 delivery channels** in parallel:

| Channel | Env var(s) required | Notes |
|---|---|---|
| Postgres (durable store) | `DATABASE_URL` (or `POSTGRES_URL`) | **Without this, leads are never stored.** |
| Own mail server (SMTP) | `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD` | **Primary, recommended.** Sends to `LEAD_RECIPIENTS`. |
| Resend | `RESEND_API_KEY` | Optional backup email. |
| ERP PRO quote request | `ERP_QUOTE_ENDPOINT` | Forwards to ERP via the tunnel; creates a draft quote. |
| Generic webhook | `LEAD_WEBHOOK_URL` | Zero-cost (Google Apps Script / Zapier / Slack). |
| FormSubmit | _(none — always on)_ | **Needs a ONE-TIME "Activate Form" click** in `SALES_EMAIL`. |
| WhatsApp Business API | `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` | Optional. |
| SMS (Africa's Talking) | `AFRICASTALKING_API_KEY`, `AFRICASTALKING_USERNAME` | Optional. |

**The root cause of "enquiries never reached us":** if none of these env vars are
set in Vercel, the lead has nowhere to go — every channel returns `false` and the
lead is only logged to the server console. The browser still gets a one-tap
`wa.me` fallback link, but that depends on the visitor clicking it.

**What is now bulletproof:**

1. A new admin-gated diagnostics endpoint **`/api/contact/health`** actively
   probes every channel (logs into SMTP, validates the Resend key, pings the ERP
   tunnel, counts recent leads in the DB) and tells you exactly which are live.
2. The unused `QuickContactForm` that pointed at the weaker
   `/api/notifications/new-lead` path (no DB, no ERP) was repointed to
   `/api/contact`.

### Minimum to guarantee delivery
Set **`DATABASE_URL`** + **at least one human-reaching channel** (SMTP is the
recommended one). That alone makes `lead_is_safe: true`.

---

## PART 2 — Required Vercel environment variables

Set these in **Vercel → the website project → Settings → Environment Variables**
(Production), then **Redeploy**.

### Lead delivery (set the starred ones at minimum)
```
DATABASE_URL              = postgres://…            ★ (durable lead storage)
SMTP_HOST                 = mail.emersoneims.com    ★
SMTP_USER                 = info@emersoneims.com    ★
SMTP_PASSWORD             = <mailbox password>      ★
SMTP_PORT                 = 465
SMTP_FROM_EMAIL           = info@emersoneims.com
SMTP_FROM_NAME            = EmersonEIMS Website Leads
LEAD_RECIPIENTS           = info@emersoneims.com,sally@emersoneims.com
ERP_QUOTE_ENDPOINT        = https://<tunnel>.trycloudflare.com/api/public/quote-request
LEAD_WEBHOOK_URL          = <optional zero-cost webhook>
RESEND_API_KEY            = <optional>
ADMIN_API_KEY             = <long random string>    (protects /api/contact admin GET)
LEAD_DIAG_TOKEN           = <long random string>    ★ (unlocks /api/contact/health)
```

### Analytics (the real-time counter + geo)
```
DATABASE_URL              = postgres://…            (same DB; stores web_analytics_events)
ANALYTICS_READ_TOKEN      = 2b18c1d4c54198cb8b4e1f6c08ab6271b3a1c6d0548320f4
ANALYTICS_SALT            = <any stable random string>   (privacy hash salt)
```
The `ANALYTICS_READ_TOKEN` **must match** the one in the CampaignPilot app's
`.env` (`ANALYTICS_STATS_URL` / `ANALYTICS_READ_TOKEN`).

---

## PART 3 — Verify lead delivery (after deploy + env vars)

1. **Channel health (no lead created):**
   ```
   curl "https://www.emersoneims.com/api/contact/health?token=<LEAD_DIAG_TOKEN>"
   ```
   Look for `"lead_is_safe": true`. The `channels` object shows each channel's
   `configured` / `ok` / `detail`. The `actions` array lists anything to fix.

2. **Real end-to-end test (sends ONE clearly-marked test lead through the live
   pipeline):**
   ```
   curl "https://www.emersoneims.com/api/contact/health?token=<LEAD_DIAG_TOKEN>&send=1"
   ```
   Check `end_to_end_test.delivered: true`, then confirm the test alert actually
   arrived in `info@`/`sally@` inboxes and in ERP PRO (CRM & Sales → Quote
   Requests). The test lead is named **"EIMS DIAGNOSTIC TEST"** — safe to delete.

3. **Recent real leads:** `channels.database.leads` shows counts for the last
   24h / 7d / all-time, so you can confirm leads are landing.

---

## PART 4 — Verify the real-time analytics counter (+ geo)

The browser beacon (`AnalyticsTracker`) → `/api/analytics/collect` → Postgres
(`web_analytics_events`) → token-gated `/api/analytics/stats` → CampaignPilot
`analytics.py` (which caches to `analytics.db`, so it **works offline** showing
the last snapshot flagged `stale`).

1. **Stats endpoint returns JSON (not the homepage):**
   ```
   curl "https://www.emersoneims.com/api/analytics/stats?token=<ANALYTICS_READ_TOKEN>&days=7"
   ```
   Expect JSON with `totals`, `today`, `live_visitors`, `top_pages`, **and the new
   geo keys** `top_countries`, `top_regions` (county-level), `top_cities`.
   - A homepage HTML response or `404` = the routes are not deployed yet.
   - `401` = `ANALYTICS_READ_TOKEN` mismatch between Vercel and the URL.

2. **CampaignPilot consumer:** in `D:\EMERSONEIMSAPP\EIMS CampaignPilot AI`:
   ```
   python analytics.py            # "source: live" when working
   python poll_analytics.py       # continuous near-real-time refresh
   ```

**Geo source:** country/region/city are derived **server-side** from Vercel edge
headers (`x-vercel-ip-country`, `x-vercel-ip-country-region`, `x-vercel-ip-city`)
— never trusted from the client. For Kenya, `region` is the county. Local `curl`
requests have no geo headers, so geo only populates from real internet visitors.

**Honesty guarantee:** the system never fabricates numbers. Zero traffic shows as
zero. If the DB is unavailable, events are dropped (not faked) and stats return a
zeroed-but-valid shape.

---

## Quick triage

| Symptom | Likely cause | Fix |
|---|---|---|
| `/api/contact/health` → 404 | not deployed | deploy main |
| `/api/contact/health` → 401 | `LEAD_DIAG_TOKEN` not set / wrong | set it in Vercel, redeploy |
| `lead_is_safe: false` | no human channel live | set `SMTP_*` (or webhook/ERP) |
| Leads not in inbox but `delivered:true` | FormSubmit not activated / wrong recipient | activate FormSubmit, check `LEAD_RECIPIENTS` |
| ERP draft not created | tunnel down / `ERP_QUOTE_ENDPOINT` unset | restart tunnel, set endpoint |
| `/api/analytics/stats` → HTML | routes not deployed | deploy main |
| stats `401` | token mismatch | align `ANALYTICS_READ_TOKEN` |
| geo all empty | tested via curl / no real visitors yet | check with real traffic |
