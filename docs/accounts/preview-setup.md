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

### 1. Create two databases
Create both on the free plan, as separate projects or databases. Copy each connection string (they start `postgres://` or `postgresql://`) and make sure each ends with `sslmode=require`.

| Database | Purpose |
|---|---|
| **Preview database** | Accounts for the protected preview |
| **Disaster-recovery test database** | Separate and **empty**. The recovery drill restores a copy into it. It is disposable: delete and recreate it to repeat the drill. |

### 2. Generate two keys
On any computer with Node.js, run this twice and keep the two outputs separate:
```
node -e "console.log(require('crypto').randomBytes(36).toString('base64url'))"
```

### 3. Apply the tables yourself, on BOTH databases, and check them

**Option A (recommended, no code): the provider's web SQL editor.** Do this for **each** database:
1. Open the database in the provider's dashboard, then its **SQL editor**.
2. Copy the whole of `lib/db/migrations/preview-setup.sql` (on GitHub, branch `dev/phase2-report-b`) into the editor and run it once. It creates every table and records the same fingerprints as the scripts. Running it again is harmless.
3. Clear the editor, copy the whole of `lib/db/migrations/check-schema.sql`, and run it. It is read-only.
4. Every row must say **OK**, and the last row must say **SCHEMA OK**. On the disaster-recovery test database, the `organisations` row must say **0**.
5. **Mark the database** (one line, once per database), then run `check-schema.sql` again. The `identity` row must show the role:

   | Database | Run this line | `identity` row shows |
   |---|---|---|
   | Preview database | `INSERT INTO acct_database_identity (role) VALUES ('preview');` | `preview` |
   | Disaster-recovery test database | `INSERT INTO acct_database_identity (role) VALUES ('dr-test');` | `dr-test` |

   Each database accepts one mark only. Accounts refuse to run ("not marked as the preview database") unless their database says `preview`. The recovery drill refuses to restore anything unless the source says `preview` **and** the target says `dr-test`. The production database has no such mark, so it can never be used, even if a connection string were mixed up.

**Option B: from a computer with this repository.**
```
ACCOUNTS_DATABASE_URL="<connection string>" node scripts/db/migrate.cjs --yes
ACCOUNTS_DATABASE_URL="<connection string>" node scripts/db/check-schema.cjs --yes
```
`migrate.cjs` refuses to run without `--yes`, and refuses if the URL equals the production `DATABASE_URL`. `check-schema.cjs` must end with **`SCHEMA OK`**. Then mark each database as in Option A, step 5.

**Do not continue until both databases show `SCHEMA OK` and the right `identity` (preview / dr-test).**

### 4. Add the settings in Vercel
Go to Project → Settings → Environment Variables. For every setting below, tick **Preview only**: untick Production and Development. Vercel gives a Preview-only setting to preview deployments only; production deployments never receive it. Independently of that, the code keeps accounts off in production (`VERCEL_ENV=production`) whatever is set.

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

**The live-validation settings** (management authorisation of 24 Nov 2026):

| Name | Value | What it does |
|---|---|---|
| `ACCOUNTS_DR_DATABASE_URL` | the **disaster-recovery test** connection string | The empty database that the recovery drill restores into. It must not be the preview or the production database. |
| `ACCOUNTS_BOOTSTRAP_REGISTRY_ADMIN` | `registry-admin@emersoneims-preview.test` | One time only: this **fictitious** test address becomes the registry administrator when it verifies its email, so the developer can verify one clearly labelled fictitious test reviewer. It works only for a test address, only in test-email mode, and only while no registry administrator exists. Every registry action also needs an authenticator-verified session and a fresh code. At the end of the run, the test gives the role up itself (audited). **Remove the setting after the validation run.** |

### 5. No real administrator or reviewer
Real registry administrators and real reviewers are granted only later, by the SQL in [operations.md](operations.md), and only for people management names. The validation uses a fictitious reviewer, **"TEST REVIEWER (PREVIEW ONLY)"**, which the test suspends again at the end, so approvals stay inactive.

### 6. Owner checks before switching on (answer yes or no, never a value)

| # | Check | Where |
|---|---|---|
| 1 | Both databases are on the provider's **free** plan, and the account has no payment card, or a spending limit of 0 so it pauses rather than bills | Provider dashboard → Billing |
| 2 | Vercel's plan and usage are unchanged: these settings add no paid feature | Vercel → Settings → Billing |
| 3 | Both databases show `SCHEMA OK`; the preview shows identity `preview`, the recovery test database `dr-test` and organisations `0` | `check-schema.sql` |
| 4 | Every setting in step 4 is ticked **Preview** only | Vercel → Environment Variables |
| 5 | Preview deployments are protected (Vercel Authentication on for previews) | Vercel → Settings → Deployment Protection |
| 6 | The two connection strings are kept only in Vercel and nowhere else | |

The developer cannot see your billing pages, so items 1 and 2 rely on your confirmation.

### 7. Turn it on, then tell the developer
1. Add `ACCOUNTS_ENABLED` = `true` (Preview only) last.
2. Tell the developer **only** that the preview database is ready and the six checks in step 6 are yes. Do not send any value.

They will redeploy the preview and run the live-database validation. It has five phases:
1. the core checks;
2. attacks over HTTP;
3. the review lifecycle with the fictitious reviewer;
4. the isolation report;
5. the recovery drill.

Every test account uses `@emersoneims-preview.test` addresses, and every email is read from the test outbox, so the real verification links are used. Afterwards, remove `ACCOUNTS_BOOTSTRAP_REGISTRY_ADMIN` (the test administrator will already have given up the role). To finish with the preview, delete both databases.

## Why the developer cannot do this

- Creating an account with a database provider is a sign-up in the owner's name and accepts the provider's terms.
- Setting Vercel variables through Vercel's API is currently blocked until two-step login is enabled on the Vercel account.
- The developer must not create infrastructure that could later carry costs, nor handle the secrets, without management approval.
