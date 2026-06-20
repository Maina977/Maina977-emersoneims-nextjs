# Go-Live checklist — ERP lead bridge + SEO verification

Tested 2026-06-20. These are the **infrastructure/config steps only you can do** (Vercel env + your PC tunnel). The website code is already in place and waiting for them.

---

## 1. Make website inquiries reach the ERP (currently NOT connected)

**Tested result:**
- ✅ ERP is running locally and accepts inquiries — a test POST to `http://localhost:8088/api/public/quote-request` returned `{"ok":true,"ref":"…"}`.
- ❌ **No tunnel is running** and `cloudflared` isn't installed → the live Vercel site **cannot reach** your local ERP. Website inquiries are **not** flowing to the ERP right now.

**Why:** the website runs in the cloud (Vercel); the ERP runs on your PC (`localhost:8088`). The cloud can only reach it through a public tunnel.

### ✅ RECOMMENDED FIX — the PULL bridge (no tunnel, can't break)
The website now exposes a token-protected lead feed (`/api/leads/export`), and a small
script on your PC pulls new leads and pushes them into the ERP. Your PC reaches **out**
to the cloud, so there's **no tunnel, no inbound config, no ephemeral URL** to manage.

1. **In Vercel → Settings → Environment Variables**, set a secret token:
   ```
   LEAD_DIAG_TOKEN = <pick any long random string>
   ```
   (Also make sure a lead store is configured so there are leads to pull — e.g.
   `DATABASE_URL`/Postgres, or the Google Sheet via `SHEET_WEBAPP_URL`+`SHEET_TOKEN`.)
   Redeploy.
2. **On the office PC** (PowerShell), with ERP PRO running:
   ```powershell
   $env:SITE_URL   = "https://www.emersoneims.com"
   $env:LEAD_TOKEN = "<the same token>"
   node scripts/erp-pull-leads.mjs --watch
   ```
   It pulls every 2 minutes and pushes new leads into ERP PRO. Leave it running, or
   schedule the one-pass command (`node scripts/erp-pull-leads.mjs`) in Task Scheduler.

### Alternative — the PUSH tunnel method
If you prefer the website to push directly:
1. **Install cloudflared:** https://developers.cloudflare.com/cloudflare-tunnel/downloads/
2. Run `scripts/start-erp-tunnel.ps1` (or `cloudflared tunnel --url http://localhost:8088`).
3. Set in Vercel: `ERP_QUOTE_ENDPOINT = https://<tunnel-url>/api/public/quote-request`.
4. Keep PC + ERP + tunnel running. ⚠️ Quick-tunnel URLs change on restart — use a *named* tunnel for a permanent URL.

### Important: leads are NOT lost even when the tunnel is down
`/api/contact` sends every enquiry to **multiple** channels in parallel (email, Resend, SMS/WhatsApp, Google Sheet, Postgres, and the ERP). As long as **at least one** of email or Google Sheet is configured in Vercel, the lead is captured even if the ERP/tunnel is offline — and can be entered/synced to the ERP later. **Don't rely on the ERP tunnel as the only capture path.**

### Verify lead capture safely
- Set `LEAD_DIAG_TOKEN` in Vercel, then open:
  `https://www.emersoneims.com/api/contact/health?token=<token>` (shows every channel's status), and
  `…/api/contact/health?token=<token>&send=1` (fires a labelled end-to-end test lead).
- Or just submit a test enquiry on `/contact` and confirm it arrives.

---

## 2. SEO — what's working vs the one gap

**Tested live:**
- ✅ `robots.txt` live, includes the AI-tool paths.
- ✅ `sitemap.xml` live — **1,673 URLs**.
- ✅ Structured data live — LocalBusiness + FAQ on the homepage, `SoftwareApplication` on the AI-tool pages.
- ❌ **Search-engine ownership verification meta tags are absent** (Google / Bing / Yandex). The env vars aren't set, so the site isn't verified by meta tag.

### Fix
In **Vercel → Environment Variables**, set the tokens from each Webmaster tool, then redeploy:
```
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION = <token from Google Search Console>
NEXT_PUBLIC_BING_SITE_VERIFICATION   = <token from Bing Webmaster Tools>
NEXT_PUBLIC_YANDEX_VERIFICATION      = <token from Yandex Webmaster>
```
Then in each console: **verify ownership → submit `https://www.emersoneims.com/sitemap.xml`**. (Bing can import directly from Google Search Console.)

> Verifying Google + Bing + Yandex covers ~12–14 search engines (Yahoo, DuckDuckGo, Ecosia, etc. ride on Bing; Seznam/Naver via IndexNow). Also claim your **Google Business Profile** — that drives most local "near me" leads.

---

## Quick status board
| Item | Status | Owner action |
|---|---|---|
| ERP accepts inquiries | ✅ works | — |
| Website → ERP live | ❌ down | install cloudflared + tunnel + set `ERP_QUOTE_ENDPOINT` |
| Lead capture backup (email/Sheet) | ❓ unverified | set `LEAD_DIAG_TOKEN`, run health probe |
| robots / sitemap / schema | ✅ live | — |
| Google/Bing/Yandex verification | ❌ not set | set 3 env vars + verify + submit sitemap |
| AI tools free / prices live | ✅ live | — |
