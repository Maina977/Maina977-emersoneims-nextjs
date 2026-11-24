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

## Incidents

1. **Suspected account compromise:** delete that user's sessions (`DELETE FROM acct_sessions WHERE user_id = …`), then reset their password. Suspend their reviewer profile if they have one.
2. **Suspected key exposure:** rotate the key (above). Rotating `PROPOSAL_APPROVAL_SIGNING_KEY` withdraws every approval.
3. **Turning the feature off:** set `ACCOUNTS_ENABLED` to anything other than `true`. Every accounts route and page then answers 404, and Solar proposals return to DRAFT. No data is lost.
4. **Data incident:** follow the Kenya Data Protection Act notification duties; the owner and legal advisers decide.

See also [backup-and-recovery.md](backup-and-recovery.md) and [data-handling-procedures.md](data-handling-procedures.md).
