# Owner setup: the free, separate preview database

The accounts feature needs **its own** Postgres database for the protected preview. It must never be the production database. Nothing here touches production: accounts stay off in production whatever is set.

## Requirements

| Need | Detail |
|---|---|
| Engine | PostgreSQL 14 or later, reachable over TLS (`sslmode=require`) |
| Size | Small. A preview with test users and projects is well under 100 MB; attachments are limited to 15 MB each. |
| Cost | A **free plan only**. Management has not authorised any spending. Before signing up, confirm on the provider's site that the plan is free, needs no card or does not charge it, and what happens at its limits (pause, not bill). |
| Examples | Neon or Supabase free plans, or another provider's free Postgres. Check their current terms; they change. |
| Location | Prefer a region acceptable under the Kenya Data Protection Act 2019 for test data. Use **TEST data only** in the preview: no real customers. |
| Separation | A new project or database at the provider, not a schema inside the production database |

## Steps (about 20 minutes)

1. **Create the database** on the free plan. Copy its connection string (it starts `postgres://` or `postgresql://`) and make sure it includes `sslmode=require`.
2. **Generate two keys** on any computer with Node.js. Run this twice and keep the two outputs separate:
   ```
   node -e "console.log(require('crypto').randomBytes(36).toString('base64url'))"
   ```
3. **In Vercel** (Project → Settings → Environment Variables), add the following to **Preview only**. Do not tick Production.

   | Name | Value |
   |---|---|
   | `ACCOUNTS_ENABLED` | `true` |
   | `ACCOUNTS_DATABASE_URL` | the connection string from step 1 |
   | `ACCOUNTS_SECRET_KEY` | the first key |
   | `PROPOSAL_APPROVAL_SIGNING_KEY` | the second key |

   Leave approvals unused until real reviewers exist. The key only makes the mechanism testable in the preview.
4. **Apply the tables** from a computer with this repository:
   ```
   ACCOUNTS_DATABASE_URL="<the string from step 1>" node scripts/db/migrate.cjs --yes
   ```
   (or ask the developer to run it once you have shared the string through a secure channel).
5. **Tell the developer.** They will redeploy the preview and run the preview checks. The first account created becomes an ordinary user. A registry administrator is granted only by the SQL in [operations.md](operations.md), and only for people management names.

## Why the developer cannot do this

- Creating an account with a database provider is a sign-up in the owner's name and accepts the provider's terms.
- Setting Vercel variables through Vercel's API is currently blocked until two-step login is enabled on the Vercel account.
- The developer must not create infrastructure that could later carry costs without management approval.

## Email (separate decision)

Accounts send verification, reset and invitation emails, but **no sender is wired**: messages are withheld (logged only as "email not sent"). For preview testing the developer can read tokens in tests only. Real email needs a sender service and domain records (SPF, DKIM, DMARC), and is a separate owner decision.
