# Google Sheets backend — CANONICAL CONTRACT (single source of truth)

This file defines the exact contract every component must implement so the
website (Vercel), the Google Apps Script, and the CampaignPilot consumer all
agree. **Do not change a key name or shape without updating this file.**

The Google Sheet (owned by emersoneimservices@gmail.com) is the free, durable,
laptop-independent datastore that replaces a cloud Postgres. A Google Apps Script
web app is the read/write API in front of the Sheet.

---

## 1. Environment variables (website, set in Vercel)

```
SHEET_WEBAPP_URL = https://script.google.com/macros/s/XXXXX/exec   # Apps Script web app /exec URL
SHEET_TOKEN      = <long random shared secret>                     # gates writes + stats reads
```

Backend selection in `lib/analytics/store.ts`:
1. If `getPostgresPool()` returns a pool → use Postgres (existing behaviour, unchanged).
2. ELSE if `SHEET_WEBAPP_URL` && `SHEET_TOKEN` are set → use the **Sheet backend**.
3. ELSE → drop events / return zeroed stats (existing no-DB behaviour).

The CampaignPilot app keeps reading the website's `/api/analytics/stats` (which
now sources from the Sheet) — no consumer change. Its SQLite cache still provides
offline/stale viewing.

---

## 2. Apps Script web app — endpoints

The web app is deployed "Execute as: me", "Who has access: Anyone". It receives
JSON. (Apps Script may deliver the body as `text/plain`; parse `e.postData.contents`.)

### doPost — writes (server-to-server only; token in body)

A) Analytics event (one row per beacon):
```json
{ "kind": "event", "token": "<SHEET_TOKEN>",
  "event": { "ts": 1718700000, "day": "2026-06-18", "site": "www",
             "host": "www.emersoneims.com", "path": "/solar", "type": "pageview",
             "ref": "google.com", "label": "", "visitor": "a1b2c3d4e5f60718",
             "country": "KE", "region": "Mombasa", "city": "Mombasa" } }
```
→ append a row to the **Events** tab. Respond `{"ok":true}` (always 200; drops silent).
`type` ∈ {pageview, click, ping}. `region` is the county for Kenya.

B) Lead (one row per enquiry):
```json
{ "kind": "lead", "token": "<SHEET_TOKEN>",
  "lead": { "name": "...", "email": "...", "phone": "...", "company": "...",
            "service": "generators", "message": "...", "source": "cta_form",
            "location": "/generators", "country": "KE", "region": "Nairobi",
            "city": "Nairobi", "received_at": "2026-06-18T08:00:00Z" } }
```
→ append a row to the **Leads** tab. Respond `{"ok":true}`.

**Auth:** every doPost MUST compare `token` to the script's stored `SHEET_TOKEN`
(Script Properties). Mismatch → `{"ok":false,"error":"unauthorized"}`, write nothing.

### doGet — reads

`GET <exec>?action=stats&token=<SHEET_TOKEN>&days=N`
→ token-gated. Returns the **AnalyticsStats** JSON (section 3), aggregated from the
Events tab over the last N days (clamp N to [1,365], default 30). Mismatch token →
`{"error":"unauthorized"}`.

`GET <exec>?action=leads&token=<SHEET_TOKEN>&limit=N` (optional convenience)
→ returns `{ "leads": [ {…most recent lead rows…} ] }`. Token-gated.

---

## 3. AnalyticsStats JSON shape (MUST match the website's existing /stats exactly)

```json
{
  "generated_at": "2026-06-18T08:00:00.000Z",
  "window_days": 30,
  "totals":  { "views": 0, "clicks": 0, "visitors": 0 },
  "today":   { "views": 0, "visitors": 0 },
  "live_visitors": 0,
  "series":       [ { "day": "2026-06-18", "site": "www", "views": 0, "visitors": 0 } ],
  "top_pages":    [ { "site": "www", "path": "/", "views": 0, "visitors": 0 } ],
  "per_site":     [ { "site": "www", "views": 0, "visitors": 0 } ],
  "top_clicks":   [ { "label": "WhatsApp", "site": "www", "clicks": 0 } ],
  "top_countries":[ { "country": "KE", "views": 0, "visitors": 0 } ],
  "top_regions":  [ { "country": "KE", "region": "Nairobi", "views": 0, "visitors": 0 } ],
  "top_cities":   [ { "country": "KE", "region": "Nairobi", "city": "Nairobi", "views": 0, "visitors": 0 } ]
}
```

Aggregation rules (from the Events tab):
- `views` = count of rows with type='pageview'; `clicks` = type='click'.
- `visitors` = distinct `visitor` values. `pings` count ONLY toward `live_visitors`,
  never toward views/visitors.
- `today` uses the UTC day = the `day` column equal to today's UTC date.
- `live_visitors` = distinct visitors with `ts` within the last 300 seconds.
- geo aggregations exclude empty country/region/city; group + order by views desc; limit 50.
- `site` is derived already by the website ('www' | 'power' | 'other').

The website never fabricates numbers. Empty Sheet → all zeros. This MUST hold in
the Apps Script too: zeros mean zero, never sample data.

---

## 4. Google Sheet tabs & columns

**Events** (header row 1): `ts | day | site | host | path | type | ref | label | visitor | country | region | city`

**Leads** (header row 1): `received_at | name | email | phone | company | service | message | source | location | country | region | city | status`

Optional **Meta** tab for notes. Visitor hashing already happens on the website
(salted SHA-256, 16 hex) — the Sheet stores the hash, never raw IP/UA.

---

## 5. Website wiring summary (what changes)

- `lib/analytics/store.ts`: add Sheet backend (recordEvent → POST event; getStats →
  GET stats), selected per section 1. Keep Postgres path intact.
- `app/api/contact/route.ts`: add a `sendSheetLead()` channel that POSTs the lead
  (section 2B, with geo derived from x-vercel-ip-* headers) to `SHEET_WEBAPP_URL`
  when set. It is one more parallel channel; never throws.
- `/api/analytics/collect` and `/api/analytics/stats`: unchanged contracts.
