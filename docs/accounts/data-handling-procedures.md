# Data handling procedures

## What is stored

| Kind | Where |
|---|---|
| Personal data | Email address and display name; reviewers' legal name and registration number |
| Customer project data | Project content, revisions, attachments |
| Security data | Password hashes; encrypted TOTP seeds; hashed tokens; audit records, which include who did what and when |

## Deletion

- **Projects:** soft-deleted from the screens, and restorable for 30 days (`SOFT_DELETE_RESTORE_DAYS`).
- **Purge job (manual; never scheduled automatically):** hard-deletes projects soft-deleted more than 30 days ago, with their revisions, attachments and approvals. An administrator runs:
  ```
  ACCOUNTS_DATABASE_URL=postgres://... ACCOUNTS_SECRET_KEY=... node scripts/db/purge-deleted.cjs --yes [--days=30]
  ```
  The audit log keeps a `project.purged` record.
- **Audit records** are append-only and are not deleted by the purge.

## Requests from individuals (access, correction, deletion)

There is no self-service screen yet. An administrator handles a request manually and records it. Deleting a person who appears in audit records needs a decision on pseudonymisation versus retention, an **owner and legal decision**.

## Decisions pending (owner and legal)

- Hosting location of the accounts database, and any cross-border transfer, under the Kenya Data Protection Act 2019.
- Retention periods for accounts, projects, backups and audit records.
- A privacy notice for account holders before any real users are invited.
