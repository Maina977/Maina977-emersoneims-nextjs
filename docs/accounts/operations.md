# Accounts operations

## Settings (Vercel → Project → Settings → Environment Variables → **Preview** only)

| Variable | Value | Required |
|---|---|---|
| `ACCOUNTS_ENABLED` | exactly `true` | Yes. Ignored in production: accounts stay off there. |
| `ACCOUNTS_DATABASE_URL` | `postgres://…?sslmode=require` for a **separate** database | Yes. Never the production `DATABASE_URL`. |
| `ACCOUNTS_SECRET_KEY` | 32+ random characters | Yes. Encrypts TOTP seeds and anchors the audit log. |
| `PROPOSAL_APPROVAL_SIGNING_KEY` | 32+ random characters, different from the above | Only for approvals. Without it approvals are refused (fail closed). |
| `ACCOUNTS_PUBLIC_ORIGIN` | e.g. `https://<preview-host>` | Optional. Used for Origin checks and emailed links; defaults to the request's origin. |

**Generate a key:**
```
node -e "console.log(require('crypto').randomBytes(36).toString('base64url'))"
```
Generate a separate key for each variable.

## Migrations

These are applied **only** by script, never on app start. They are additive and safe to re-run:
```
ACCOUNTS_DATABASE_URL=postgres://... node scripts/db/migrate.cjs --yes
node scripts/db/migrate.cjs --list     # prints the files; no connection
```
Before connecting, the script refuses to run without `--yes`, and refuses if the URL equals `DATABASE_URL`.

## Granting registry administration (manual, audited outside the app)

```sql
UPDATE acct_users SET is_registry_admin = TRUE WHERE email = '<registry admin email>';
```
Grant it only to people management has named. They must enrol the second factor before they can use it. Record who granted it, to whom and when.

## Key rotation

| Key | How to rotate | Effect |
|---|---|---|
| `ACCOUNTS_SECRET_KEY` | Replace the value | Existing TOTP seeds can no longer be decrypted, so every user re-enrols, and the audit head must be re-anchored. Plan a maintenance window. Rotate only if the key is suspected exposed. |
| `PROPOSAL_APPROVAL_SIGNING_KEY` | Replace the value | Every existing approval stops verifying, and all documents return to DRAFT until re-approved. This is the intended response to a suspected compromise. |

## Monitoring

- **Logs:** server errors are logged as `[accounts] internal error <type>`, with no tokens or bodies. Watch the Vercel logs for spikes in 401, 403 or 429 responses on `/api/accounts/*`.
- **Integrity:** periodically verify the audit log (`verifyAuditLog`) and the approval chain (`verifyApprovalChain`). Any failure is an incident.

## Test email on the preview

| `ACCOUNTS_MAIL_MODE` | Behaviour |
|---|---|
| unset or `none` | Account emails are withheld (logged only as "email not sent"). Nobody can verify an address. |
| `outbox` | Emails to addresses in `ACCOUNTS_TEST_EMAIL_DOMAINS` are kept in `acct_test_outbox` and shown on the "Test email outbox" screen of `/accounts`. Nothing is sent. |
| `smtp` | Emails go through a **dedicated test sender** (`ACCOUNTS_SMTP_URL`, `ACCOUNTS_MAIL_FROM`), marked `[TEST]`, and only to the test domains |

In `outbox` and `smtp` modes, sign-up and invitations to any other address are refused (400). Without a domain list they are refused entirely (503). Never verify addresses directly in the database: testing must use the emailed link. Clear the outbox when a test round ends:
```sql
DELETE FROM acct_test_outbox WHERE created_at < now() - interval '7 days';
```

## Review decisions

A verified reviewer can **approve** or **reject** the exact current revision; rejection needs a reason. Both need a second-factor session and a fresh code. A rejection keeps the document DRAFT and shows who, when and why. A reviewer revokes their own approval before rejecting. A revoked approval is never revived on the same revision: the corrected revision is approved again instead.

## Preview verification tools (registry administrators; booleans and counts only)

- `POST /api/accounts/registry/isolation-report`: is this the preview? Is the accounts database separate from production? Are production database, mail or payment settings present here? Is paid mode on? Which identity (`preview` / `dr-test` / `unmarked`) does the accounts database carry?
- `POST /api/accounts/registry/dr-drill`: see [backup-and-recovery.md](backup-and-recovery.md).
- `ACCOUNTS_BOOTSTRAP_REGISTRY_ADMIN` (preview validation only): a one-time grant to a named **test** address when it verifies its email, only while no registry administrator exists. Audited as `registry_admin.bootstrapped`. Remove the setting after use.
- `POST /api/accounts/registry/self/relinquish` (second-factor session, fresh code): a registry administrator gives up the role; audited as `registry_admin.relinquished`. The live-validation run calls it at the end for the test administrator.
- Database identity (migration 005): accounts answer 503 unless their database is marked `preview`, or if `ACCOUNTS_DATABASE_URL` equals `DATABASE_URL` / `POSTGRES_URL`. See [preview-setup.md](preview-setup.md), step 3.

## A lost authenticator

1. **The person still has a recovery code:** they sign in with it ("Lost your authenticator?"), then use "Replace my authenticator" and set up the new phone. Afterwards they make new recovery codes.
2. **The person has no codes left:** a registry administrator, after checking the person's identity outside the system (in person, or a video call against their ID), uses "Reset a person's second factor". They record the reason and the identity-check reference. The person is signed out everywhere, and any reviewer profile is suspended until the registry re-verifies it.
3. **A registry administrator loses theirs:** another registry administrator resets it. If there is none, the database owner removes the second factor by SQL and records it, then management re-confirms the administrator:
   ```sql
   UPDATE acct_users SET totp_secret_enc = NULL, totp_enabled_at = NULL, totp_last_step = 0 WHERE email = '<address>';
   DELETE FROM acct_recovery_codes WHERE user_id = (SELECT id FROM acct_users WHERE email = '<address>');
   DELETE FROM acct_sessions WHERE user_id = (SELECT id FROM acct_users WHERE email = '<address>');
   ```

## Incidents

1. **Suspected account compromise:** delete that user's sessions (`DELETE FROM acct_sessions WHERE user_id = …`), then reset their password. Suspend their reviewer profile if they have one.
2. **Suspected key exposure:** rotate the key (above). Rotating `PROPOSAL_APPROVAL_SIGNING_KEY` withdraws every approval.
3. **Turning the feature off:** set `ACCOUNTS_ENABLED` to anything other than `true`. Every accounts route and page then answers 404, and Solar proposals return to DRAFT. No data is lost.
4. **Data incident:** follow the Kenya Data Protection Act notification duties; the owner and legal advisers decide.

See also [backup-and-recovery.md](backup-and-recovery.md) and [data-handling-procedures.md](data-handling-procedures.md).
