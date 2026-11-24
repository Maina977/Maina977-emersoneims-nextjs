# Owner setup: the free, isolated preview database

The accounts feature needs **its own** Postgres database for the protected preview. It must never be the production database. Nothing here touches production: accounts stay off there whatever is set.

**Never paste a connection string, key or password into a chat, an email or a ticket.** Enter them only in Vercel and in your own terminal.

## Requirements

| Need | Detail |
|---|---|
| Engine | PostgreSQL 14 or later, reachable over TLS (`sslmode=require`) |
| Size | Small. A preview with test users and projects is well under 100 MB; attachments are limited to 15 MB each. |
| Cost | **A free plan only.** Management has not authorised any spending. Before signing up, confirm on the provider's site that the plan is free, needs no card or does not charge it, and pauses rather than bills at its limits. |
| Examples | Neon or Supabase free plans, or another provider's free Postgres. Check their current terms; they change. |
| Data | **Fictitious test accounts only.** No customer data, ever. Test-email mode (below) enforces this. |
| Location | Prefer a region acceptable under the Kenya Data Protection Act 2019, even for test data. |
| Separation | A new project or database at the provider, not a schema inside the production database |

## Steps (about 30 minutes)

### 1. Create the database
Create it on the free plan and copy its connection string (it starts `postgres://` or `postgresql://`). Make sure it ends with `sslmode=require`.

### 2. Generate two keys
On any computer with Node.js, run this twice and keep the two outputs separate:
```
node -e "console.log(require('crypto').randomBytes(36).toString('base64url'))"
```

### 3. Apply the tables yourself
From a computer with this repository:
```
ACCOUNTS_DATABASE_URL="<the string from step 1>" node scripts/db/migrate.cjs --yes
```
It applies `accounts-001-core`, `accounts-002-recovery` and `accounts-003-test-outbox`. It refuses to run without `--yes`, and refuses if the URL equals the production `DATABASE_URL`.

### 4. Add the settings in Vercel
Go to Project → Settings → Environment Variables. Tick **Preview only**, never Production.

**The four required settings.** Values are never written here.

| Name | Value | What it does |
|---|---|---|
| `ACCOUNTS_DATABASE_URL` | the connection string from step 1 | The isolated accounts database. The code never falls back to the production database. |
| `ACCOUNTS_SECRET_KEY` | the first key from step 2 | Encrypts authenticator seeds, keys the recovery-code hashes, anchors the audit log |
| `PROPOSAL_APPROVAL_SIGNING_KEY` | the second key from step 2 | Signs approvals. Approvals stay unused until management authorises reviewers. |
| `ACCOUNTS_ENABLED` | `true` | **The on switch. Add it last** (step 6). |

**The test-email settings.** No message can reach a real person:

| Name | Value | What it does |
|---|---|---|
| `ACCOUNTS_MAIL_MODE` | `outbox` | Account emails are kept in the preview's "Test email outbox" screen; nothing is sent |
| `ACCOUNTS_TEST_EMAIL_DOMAINS` | `emersoneims-preview.test` | The only addresses that can sign up or be invited. Recommended: a `.test` domain, which by internet standard (RFC 2606) can never receive real mail. |

**Optional, only if you want real delivery tested:** use `ACCOUNTS_MAIL_MODE` = `smtp` with a **dedicated test sender**, never the site's own mail account:
- `ACCOUNTS_SMTP_URL`: for example `smtps://user:password@smtp.provider:465` from a free test-mail service;
- `ACCOUNTS_MAIL_FROM`: the sender address;
- `ACCOUNTS_TEST_EMAIL_DOMAINS`: a domain whose inboxes you control and use only for testing.

Messages are marked `[TEST]`, and any other recipient is refused.

### 5. Do not grant administrator rights yet
A registry administrator is granted only by the SQL in [operations.md](operations.md), and only for people management names.

### 6. Turn it on, then tell the developer
1. Add `ACCOUNTS_ENABLED` = `true` (Preview only) last.
2. Tell the developer **only** that the preview database is ready. Do not send any value.

They will redeploy the preview and run the real-database test script. Every test account uses `@emersoneims-preview.test` addresses, and every email is read from the test outbox, so the real verification links are used.

## Why the developer cannot do this

- Creating an account with a database provider is a sign-up in the owner's name and accepts the provider's terms.
- Setting Vercel variables through Vercel's API is currently blocked until two-step login is enabled on the Vercel account.
- The developer must not create infrastructure that could later carry costs, nor handle the secrets, without management approval.
