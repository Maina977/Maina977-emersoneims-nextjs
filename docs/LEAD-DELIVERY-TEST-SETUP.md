# Turn ON lead delivery + test it (email → githehusalome@gmail.com, WhatsApp/SMS → 0784432938)

> **Live status confirmed 2026-06-14:** `POST /api/contact` returns
> `{ "delivered": false, "leadId": 0 }`. NO channel is configured in Vercel, so
> every website enquiry is currently being **dropped** (only logged on the
> server). This doc turns delivery on and routes a one-time test to your test
> targets.

The contact route (`app/api/contact/route.ts`) fires **all** configured channels
in parallel. You only need **one** for leads to arrive — but you asked for all
four, so they're all below in priority order (fastest/free first).

---

## STEP 0 — Route the test to your test targets (do this once, in Vercel)

The route alerts the **sales** address/line, not arbitrary recipients. To make
this test land on the numbers you gave, set these in
**Vercel → Settings → Environment Variables (Production)**:

| Name | Value | Effect |
|---|---|---|
| `SALES_EMAIL` | `githehusalome@gmail.com` | Resend email alert goes here |
| `SALES_PHONE` | `+254784432938` | WhatsApp-API + SMS alerts go here |

> ⚠️ After the test passes, change these back to
> `emersoneimservices@gmail.com` / `+254768860665` so **real** leads reach the
> business. (The free webhook in Channel 1 emails a fixed address and ignores
> `SALES_EMAIL`, so it's unaffected.)

Redeploy after any env change (Deployments → ⋯ → Redeploy).

---

## CHANNEL 1 — Free email webhook  ✅ fastest, no paid account (~5 min)

Emails every lead to your inbox via a Google Apps Script.

1. <https://script.google.com> → **New project**, delete the sample, paste:

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents || '{}');
    var lead = data.lead || {};
    var subject = '🔥 NEW WEBSITE LEAD: ' + (lead.name || 'Unknown') +
                  ' — ' + (lead.service || 'general');
    var body = (data.text || JSON.stringify(data, null, 2)) +
               '\n\n— Sent automatically from emersoneims.com';
    // TEST target. After verifying, change to emersoneimservices@gmail.com
    MailApp.sendEmail({ to: 'githehusalome@gmail.com', subject: subject, body: body });
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

2. **Deploy → New deployment → Web app**: *Execute as* **Me**, *Who has access*
   **Anyone**. Authorise, copy the `…/exec` URL.
3. Vercel env var: `LEAD_WEBHOOK_URL` = that URL. Redeploy.

This alone gets the **email test** to githehusalome@gmail.com working.

---

## CHANNEL 2 — Real WhatsApp alert to 0784432938 (Meta Cloud API)

Most involved. Proactively messaging a number requires either an approved
template **or** adding the number as a test recipient (free, instant — best for
this test).

1. <https://developers.facebook.com> → create/Select a **Business app** → add
   **WhatsApp** product.
2. In **WhatsApp → API Setup**: copy the **Phone number ID** and a
   **temporary access token** (or generate a permanent one via a System User).
3. **Add `+254784432938` under "To" → Manage phone number list** as a recipient
   and verify it with the code WhatsApp sends — this lets you message it without
   a template.
4. Vercel env vars:
   - `WHATSAPP_PHONE_NUMBER_ID` = the Phone number ID
   - `WHATSAPP_ACCESS_TOKEN` = the token
   - (`SALES_PHONE` already set to `+254784432938` in Step 0)
5. Redeploy.

> Note: temporary tokens expire in 24h — fine for the test; create a permanent
> System-User token for production. To message numbers that haven't messaged you
> first (without test-listing them), you'll later need an approved template.

---

## CHANNEL 3 — Branded email via Resend

1. <https://resend.com> → add & **verify the domain** `emersoneims.com` (DNS
   records). The route sends `from: leads@emersoneims.com`, so the domain must be
   verified or Resend rejects it.
2. Create an API key.
3. Vercel: `RESEND_API_KEY` = the key. Redeploy.
   (Goes to `SALES_EMAIL` = githehusalome@gmail.com per Step 0.)

---

## CHANNEL 4 — SMS via Africa's Talking

1. <https://africastalking.com> → create app, fund it, get a **Sender ID/short
   code** (live username, not `sandbox`, to reach a real Kenyan number).
2. Vercel env vars:
   - `AFRICASTALKING_API_KEY`
   - `AFRICASTALKING_USERNAME` (your live username)
   - `AFRICASTALKING_SENDER_ID` (optional)
3. Redeploy. (SMS goes to `SALES_PHONE` = +254784432938 per Step 0.)

---

## STEP FINAL — Verify (I do this)

Once **any** channel above is live and redeployed, tell me and I'll re-run the
exact live test:

```
curl -X POST https://www.emersoneims.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Delivery Test","email":"test@example.com","phone":"0712345678","service":"generators","message":"Verifying delivery"}'
```

We want the response to flip to **`"delivered": true`**, and the matching
email/WhatsApp/SMS to actually arrive on your test devices. Then revert the
Step 0 overrides to the real business contacts.
```
