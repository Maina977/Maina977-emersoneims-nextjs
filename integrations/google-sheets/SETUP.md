# Connect Your Website to a Google Sheet (10-minute setup)

This guide wires your live website (on Vercel) to a **Google Sheet** so that:

- every **lead / enquiry** lands in a "Leads" tab, and
- every **page view & click** lands in an "Events" tab (which powers your visitor counter).

The Google Sheet is your free, always-on datastore. It keeps working even when your
laptop is off, and Google's free quotas are far more than enough for this traffic.

You only need two accounts open: your **Google account** (emersoneimservices@gmail.com)
and your **Vercel dashboard**.

> Technical detail (for reference only): the exact data format is defined in
> [`CONTRACT.md`](./CONTRACT.md). The script you'll paste lives at
> [`Code.gs`](./Code.gs).

---

## What you'll end up with

```
  Visitor's browser
        │  (page view / click / form submit)
        ▼
  Your website on Vercel  ───────────────►  Google Apps Script (/exec URL)
   (www.emersoneims.com)    token-protected            │
        ▲                                              ▼
        │                                       Google Sheet
        │  GET stats (token)                 ┌────────────────┐
        └───────────────────────────────────│ Events  │ Leads │
                                             └────────────────┘
        ▲
        │  reads /api/analytics/stats
  CampaignPilot AI app (on your laptop)
   └─ caches the last snapshot to SQLite, so it still shows numbers offline
```

Two secrets must **match on both sides**:

| Secret | Where it lives | Purpose |
|---|---|---|
| `SHEET_TOKEN` | Apps Script **Script Property** + Vercel **env var** | Password between website and Sheet |
| `SHEET_WEBAPP_URL` | Vercel **env var** only | The address of your Apps Script (ends in `/exec`) |

---

## Step 1 — Create the Google Sheet

1. Sign in to Google as **emersoneimservices@gmail.com**.
2. Go to **https://sheets.new** (creates a blank sheet).
3. Click the title (top-left) and rename it to:

   ```
   EmersonEIMS Website Data
   ```

That's it — you don't need to add tabs or columns by hand. The script will create
the **Events** and **Leads** tabs and their headers automatically the first time
data arrives.

---

## Step 2 — Add the script

1. In that same Sheet, open the menu: **Extensions → Apps Script**.
2. A new tab opens with a small default code block (`function myFunction() {}`).
   **Select all of it and delete it** so the editor is empty.
3. Open the file [`integrations/google-sheets/Code.gs`](./Code.gs) from this repo,
   copy **everything** in it, and paste it into the empty Apps Script editor.
4. Click the **Save** icon (or press `Ctrl+S`). Give the project a name if asked,
   e.g. `EmersonEIMS Sheet API`.

---

## Step 3 — Set the secret password (`SHEET_TOKEN`)

The script needs a secret so that only your website can write to the Sheet.

1. First, **generate a long random secret**. Use any of these:
   - run this in a terminal: `openssl rand -hex 24`
   - or in PowerShell: `[guid]::NewGuid().ToString('N') + [guid]::NewGuid().ToString('N')`
   - or just mash 40+ random letters and numbers.

   Example (do **not** reuse this one — make your own):

   ```
   7f3a9c1e8b6d40a2f5e7c9b1d3a5e7f90c2b4d6a8e0f1c3b
   ```

2. **Copy it and keep it somewhere safe** — you'll paste the *exact same value*
   into Vercel in Step 5.
3. In the Apps Script editor, click the **gear icon** on the left
   (**Project Settings**).
4. Scroll to **Script Properties** → click **Add script property**.
5. Enter:
   - **Property:** `SHEET_TOKEN`
   - **Value:** *(paste your secret)*
6. Click **Save script properties**.

---

## Step 4 — Publish the script as a web app

1. Top-right of the Apps Script editor: **Deploy → New deployment**.
2. Click the gear next to "Select type" → choose **Web app**.
3. Fill in:
   - **Description:** anything, e.g. `v1`
   - **Execute as:** **Me (emersoneimservices@gmail.com)**
   - **Who has access:** **Anyone**

   > "Anyone" is required so your website can reach it. It's still safe — every
   > write and the stats read are protected by your `SHEET_TOKEN`, and Google
   > never lets "Anyone" see your Sheet, only call your script.

4. Click **Deploy**.

### The scary "Google hasn't verified this app" screen

Because this is your own brand-new script, Google shows a warning. This is normal
for personal scripts. To continue:

1. Click **Authorize access** → choose the **emersoneimservices@gmail.com** account.
2. On the warning screen, click **Advanced** (small link, bottom-left).
3. Click **Go to EmersonEIMS Sheet API (unsafe)**.
4. Click **Allow**.

(You're only granting your own script permission to edit your own Sheet.)

5. After it deploys, **copy the Web app URL**. It ends in **`/exec`** and looks like:

   ```
   https://script.google.com/macros/s/AKfy...long...string/exec
   ```

   Keep this handy for the next step.

> Later, if you edit `Code.gs`, you must **Deploy → Manage deployments → Edit
> (pencil) → New version → Deploy** for changes to go live. The `/exec` URL stays
> the same.

---

## Step 5 — Add the variables in Vercel

1. Open **https://vercel.com** → your project **`my-app`** → **Settings →
   Environment Variables**.
2. Make sure the environment is set to **Production**, then add:

   | Name | Value |
   |---|---|
   | `SHEET_WEBAPP_URL` | the `/exec` URL from Step 4 |
   | `SHEET_TOKEN` | the **same** secret you set in Step 3 |

   > These two must be perfect copies. A single extra space or a different token
   > and nothing will save to the Sheet.

3. **Also set the lead-delivery and analytics variables** (`LEAD_RECIPIENTS`,
   `SMTP_*` for Gmail, `ANALYTICS_READ_TOKEN`, `LEAD_DIAG_TOKEN`, etc.) exactly as
   listed in
   [`docs/LEAD-AND-ANALYTICS-VERIFICATION.md`](../../docs/LEAD-AND-ANALYTICS-VERIFICATION.md)
   (see "PART 2 — Required Vercel environment variables"). Don't retype the whole
   list from memory — that doc is the source of truth.

4. Go to the **Deployments** tab → on the latest deployment click the **⋯** menu →
   **Redeploy**. New env vars only take effect after a redeploy.

---

## Step 6 — Point the CampaignPilot app at the live stats

This app runs on your laptop and shows your visitor numbers. It already reads from
the website — you only need to confirm two lines match.

1. Open the file: **`D:/EMERSONEIMSAPP/EIMS CampaignPilot AI/.env`**
2. Confirm these two lines:

   ```
   ANALYTICS_STATS_URL = https://www.emersoneims.com/api/analytics/stats
   ANALYTICS_READ_TOKEN = <same value as ANALYTICS_READ_TOKEN in Vercel>
   ```

   - `ANALYTICS_STATS_URL` must be exactly the URL above.
   - `ANALYTICS_READ_TOKEN` must equal the one you set in Vercel.

No other change is needed. The website now serves its numbers straight from the
Google Sheet, so the app just keeps working.

---

## Step 7 — Check that it works

**A. Watch the Sheet fill up (most convincing).**

1. Keep the Google Sheet open.
2. Visit **https://www.emersoneims.com** in a normal browser and click around.
   Within a few seconds, rows should appear in the **Events** tab.
3. Submit a test enquiry through any contact form. A row should appear in the
   **Leads** tab.

**B. Run the automated checker (from this repo):**

```
node scripts/verify-leads-analytics.mjs
```

It confirms the lead pipeline and the analytics/stats endpoint are healthy.

**Good to know:**

- Going through Apps Script adds about **1–2 seconds** of latency per write —
  that's expected and harmless; the website never waits on it to respond to the
  visitor.
- Google's **free quotas are ample** for this level of traffic. You won't hit
  limits under normal small-business volume.

---

## How your data flows

```
   ┌──────────────┐   page views / clicks   ┌─────────────────────┐
   │  Visitor's   │ ──────────────────────► │  Website on Vercel  │
   │   browser    │   form enquiries        │ (www.emersoneims.com)│
   └──────────────┘                         └──────────┬──────────┘
                                                       │ POST event / lead   (SHEET_TOKEN)
                                                       │ GET  stats
                                                       ▼
                                          ┌────────────────────────┐
                                          │  Google Apps Script     │
                                          │      (/exec URL)        │
                                          └───────────┬─────────────┘
                                                      ▼
                                       ┌───────────────────────────┐
                                       │  Google Sheet              │
                                       │  ┌────────┐  ┌──────────┐  │
                                       │  │ Events │  │  Leads   │  │
                                       │  └────────┘  └──────────┘  │
                                       └───────────────────────────┘
                                                      ▲
                                                      │ reads /api/analytics/stats
                                          ┌───────────┴─────────────┐
                                          │  CampaignPilot AI app   │
                                          │  (your laptop)          │
                                          │  caches → SQLite        │
                                          └─────────────────────────┘
```

### What still works when your laptop is off

- **The website and the Sheet are independent of your laptop.** Leads and visitor
  events are saved into the Google Sheet by Vercel directly — your computer doesn't
  need to be on. Nothing is lost overnight.
- **The CampaignPilot app** is the only piece that runs on your laptop. While it's
  off it simply isn't collecting; when you reopen it, it reads the latest numbers
  from the website again.
- Even with **no internet on your laptop**, CampaignPilot shows the **last snapshot
  it cached to SQLite** (flagged as "stale"), so you're never staring at a blank
  screen.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Stats request returns **401 unauthorized** | Token mismatch | Make `SHEET_TOKEN` (Vercel) and the Script Property identical; and `ANALYTICS_READ_TOKEN` identical in Vercel + CampaignPilot `.env`. Redeploy. |
| **Events not appearing** in the Sheet | `SHEET_WEBAPP_URL` wrong, or deployment access isn't "Anyone", or you redeployed code without a new version | Re-copy the `/exec` URL into Vercel; in Apps Script set **Who has access: Anyone**; **Deploy → Manage deployments → New version**. |
| **Leads missing** from the Leads tab | `SHEET_TOKEN` mismatch between Vercel and the Script Property | Re-paste the exact same secret in both places, redeploy the website. |
| Stats request returns the **homepage HTML / 404** | Website routes not deployed | Redeploy `main` in Vercel. |
| Events appear but **stats stay zero** | Looking at the wrong day, or `pings` only (pings don't count as views) | Check a wider window (`&days=7`), generate a real page view. |
| **Geo columns empty** (country/region/city) | Tested via `curl` or no real internet visitors yet | Real visitors fill these; local/`curl` traffic has no geo headers. |
| Apps Script error email about **authorization** | Permissions prompt wasn't completed | Re-run **Deploy** and finish **Advanced → Go to project → Allow** (Step 4). |
| Forgot the `SHEET_TOKEN` | It's only stored, not shown | Generate a new one, update **both** the Script Property and Vercel, redeploy. |

---

## Quick reference

| Item | Value / location |
|---|---|
| Sheet name | `EmersonEIMS Website Data` |
| Sheet owner | emersoneimservices@gmail.com |
| Script code | [`integrations/google-sheets/Code.gs`](./Code.gs) |
| Data contract | [`integrations/google-sheets/CONTRACT.md`](./CONTRACT.md) |
| `SHEET_WEBAPP_URL` | Apps Script `/exec` URL → Vercel env var |
| `SHEET_TOKEN` | random secret → Apps Script Script Property **and** Vercel env var (must match) |
| Other env vars | [`docs/LEAD-AND-ANALYTICS-VERIFICATION.md`](../../docs/LEAD-AND-ANALYTICS-VERIFICATION.md) |
| CampaignPilot `.env` | `D:/EMERSONEIMSAPP/EIMS CampaignPilot AI/.env` |
| Verify command | `node scripts/verify-leads-analytics.mjs` |
</content>
</invoke>
