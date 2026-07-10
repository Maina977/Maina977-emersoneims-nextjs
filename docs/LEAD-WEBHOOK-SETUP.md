# Receive website leads in your inbox in 5 minutes (free)

The contact form (`app/api/contact/route.ts`) sends every enquiry to a generic
webhook URL set in the environment variable **`LEAD_WEBHOOK_URL`**. The easiest,
zero-cost option is a **Google Apps Script** that emails each lead to
`emersoneimservices@gmail.com`. No paid API, no server.

> Until at least one channel (`LEAD_WEBHOOK_URL`, `RESEND_API_KEY`,
> `AFRICASTALKING_*` or `WHATSAPP_*`) is set in Vercel **production**, leads are
> only logged on the server and the visitor is pushed to the WhatsApp fallback.
> This is the single most important switch to flip for getting leads.

---

## Step 1 — Create the Google Apps Script (2 min)

1. Go to <https://script.google.com> → **New project**.
2. Delete the sample code and paste this:



```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents || '{}');
    var lead = data.lead || {};
    var subject = '🔥 NEW WEBSITE LEAD: ' + (lead.name || 'Unknown') +
                  ' — ' + (lead.service || 'general');
    var body = (data.text || JSON.stringify(data, null, 2)) +
               '\n\n— Sent automatically from emersoneims.com';
    MailApp.sendEmail({
      to: 'emersoneimservices@gmail.com',
      subject: subject,
      body: body
    });
    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **Deploy** → **New deployment** → type **Web app**.
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**
4. Click **Deploy**, authorise the Google permission prompt, and **copy the Web
   app URL** (it looks like `https://script.google.com/macros/s/AKfy.../exec`).

## Step 2 — Add the URL to Vercel (1 min)

1. Vercel dashboard → your project → **Settings → Environment Variables**.
2. Add:
   - **Name:** `LEAD_WEBHOOK_URL`
   - **Value:** the Web app URL from Step 1
   - **Environment:** Production (and Preview if you want)
3. **Redeploy** (Deployments → ⋯ → Redeploy) so the variable takes effect.

## Step 3 — Test it (1 min)

1. Open <https://www.emersoneims.com/contact> and submit a test enquiry.
2. Within seconds you should get the email at `emersoneimservices@gmail.com`.
3. The visitor also sees a **“Continue on WhatsApp”** button as a backup.

---

## Other channels (optional, can run alongside the webhook)

| Variable | What it enables | Where to get it |
|---|---|---|
| `RESEND_API_KEY` | Branded HTML lead emails | resend.com (needs a verified domain) |
| `WHATSAPP_ACCESS_TOKEN` + `WHATSAPP_PHONE_NUMBER_ID` | Auto WhatsApp alert to sales | Meta WhatsApp Business Cloud API |
| `AFRICASTALKING_API_KEY` + `AFRICASTALKING_USERNAME` | SMS alert to sales | africastalking.com |
| `SALES_EMAIL` / `SALES_PHONE` | Override default recipients | defaults: emersoneimservices@gmail.com / +254768860665 |

All configured channels fire in parallel; you only need **one** for leads to
arrive. The webhook above is the fastest and free.

> Tip: a Slack or Discord **incoming webhook** URL also works as
> `LEAD_WEBHOOK_URL` — leads then drop straight into a channel.
