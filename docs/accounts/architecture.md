# Accounts architecture

## Components

| Layer | Files | Role |
|---|---|---|
| Screens | `app/accounts/page.tsx`, `components/accounts/AccountsApp.tsx` | One preview-only page (404 when off; noindex). Shows what the server decides; decides nothing. |
| HTTP entry | `app/api/accounts/[...path]/route.ts` | One route for every accounts call |
| Guard | `lib/accounts/http.ts` | Flag → configuration → cross-site → session → CSRF → body limits → errors |
| Route table | `lib/accounts/routes.ts` | Method + path → service function |
| Services | `lib/accounts/auth.ts`, `orgs.ts`, `projects.ts`, `reviewers.ts`, `audit.ts` | Business rules. Each re-checks membership, role, second factor and fresh codes itself. |
| Solar integration | `lib/accounts/solarApproval.ts`, `app/api/solar/proposal/route.ts` | Server-side lookup of a verified approval of the exact proposal input |
| Crypto | `lib/accounts/crypto.ts` | scrypt, SHA-256, HMAC, AES-GCM, RFC 6238 TOTP, constant-time compares |
| Database | `lib/accounts/db.ts`, `lib/db/migrations/accounts-001-core.sql` | `ACCOUNTS_DATABASE_URL` only (never `DATABASE_URL`). Migrations only by script. |
| Scripts | `scripts/db/migrate.cjs`, `export-org.cjs`, `import-org.cjs`, `purge-deleted.cjs`, `accounts-lib.cjs` | Migrations, backup, restore, purge |

## Data model (tables prefixed `acct_`)

| Table | Holds | Notes |
|---|---|---|
| `users` | Email, scrypt password hash, TOTP seed (AES-GCM encrypted), lockout counters, `is_registry_admin` | Registry admin is granted only by manual SQL |
| `sessions` | SHA-256 of the session token and of its CSRF token, `mfa_verified`, idle and absolute expiry | |
| `tokens` | SHA-256 of single-use email tokens (verify, reset, invite) with expiry | |
| `rate` | Database-backed rate-limit counters | |
| `orgs`, `memberships` | Organisations; roles owner, admin, engineer, viewer | |
| `projects` | Per-organisation project metadata, current revision, soft delete | |
| `revisions` | Immutable content and its SHA-256. A database trigger refuses UPDATE and DELETE. | |
| `attachments`, `attachment_chunks` | Chunked uploads, SHA-256 checked, type allow-list, content sniffing | |
| `reviewers` | Reviewer profiles: pending, verified, suspended or expired; identity check; validity; scope | |
| `approvals` | Server-signed (HMAC) approval of ONE revision hash, bound to tool, document, organisation, project and revision | |
| `approval_chain` | Hash-chained record of approvals and revocations. Append-only trigger. | |
| `audit`, `audit_head`, `audit_archive` | Hash-chained, append-only audit log; HMAC-anchored head; archive of imported records | |

## Request flow (example: approve a revision)

1. The browser sends `POST /api/accounts/orgs/:org/projects/:p/revisions/:r/approve` with the session cookie and `x-csrf-token`.
2. The guard checks the flag, configuration and Origin, then validates the session (hashed lookup, expiry) and the CSRF token (constant-time).
3. `approveRevision` refuses unless every condition holds:
   - the signing key is configured;
   - the session used the second factor, and the request carries a fresh code;
   - the caller is a member of the organisation and has a reviewer profile there that is verified, identity-checked, in date and in scope;
   - the revision is current, and its stored content still matches its hash;
   - the hash the reviewer saw is that hash.
4. The server signs the approval and writes the approval, an approval-chain record and an audit record, all in one transaction.

## Approvals and documents

- **Labels without a verified approval of the exact current revision:** Solar **DRAFT**; Generator Oracle sign-off **NOT VERIFIED**; Building BOQ **DRAFT, not certified**. AquaScan has nothing approvable.
- **Solar:** `/api/solar/proposal` still refuses any client-sent approval. FOR ISSUE comes only from the server-side lookup, which fails closed to DRAFT.
- **Revocation and suspension:** any later change, revocation, suspension or expiry withdraws the approval when it is next checked, because every check runs from scratch.
