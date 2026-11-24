# Accounts security

## Threats and controls

| Threat | Control | Tested by |
|---|---|---|
| Password guessing | scrypt (N = 2^15, per-user salt). Lockout after 5 failures for 15 min. Per-IP rate limit. Identical error whether or not the email exists. | `accounts-storage`, `accounts-http` |
| Stolen database: passwords and seeds | Passwords stored only as scrypt hashes. TOTP seeds AES-GCM encrypted under `ACCOUNTS_SECRET_KEY`. Session, CSRF and email tokens stored only as SHA-256. | `accounts-storage` (crypto) |
| Session theft or fixation | `__Host-` cookie: HttpOnly, Secure, SameSite=Lax, Path=/, no Domain. New token at every sign-in. Logout deletes the session on the server. Idle 2 h, absolute 12 h. | `accounts-http` |
| Cross-site request forgery | State-changing requests need Origin = this site, and are refused for `Sec-Fetch-Site: cross-site`; this covers sign-in too. In a session, `x-csrf-token` must match the session's stored hash (constant-time). | `accounts-http` |
| Account takeover of privileged roles | Second factor (TOTP) required for owners, admins, reviewers and registry admins. Approve, revoke and verify need a **fresh** code; each code works once. | `accounts-reviewers`, `accounts-http`, `accounts-ui` |
| Cross-organisation access | Every service checks membership. Another organisation's resources answer 404, so nothing is revealed. | `accounts-storage`, `accounts-http`, `accounts-recovery` |
| Forged or replayed approvals | Approvals are signed by the server (HMAC) and bound to tool, document, organisation, project and revision. Every check runs from scratch: signature, registry, validity, scope and the re-hashed content. Client-sent approvals are refused (400). | `accounts-reviewers`, `accounts-solar-proposal` |
| Self-verification or fake reviewers | Profiles start pending. Only a registry admin (granted by manual SQL) with a fresh code who is not the applicant can verify. The identity check, evidence reference and validity dates are recorded. | `accounts-reviewers`, `accounts-ui` |
| Tampering with history | Revisions and audit records are append-only (database triggers). The audit log is hash-chained with an HMAC-anchored head. Altered content is detected even if a superuser bypasses the triggers. | `accounts-reviewers`, `accounts-storage` |
| Malicious uploads | Type allow-list, content sniffing, size limits, chunk hashing. Downloads are octet-stream attachments with a sandbox CSP and a sanitised filename. | `accounts-storage`, `accounts-http` |
| Oversized or malformed requests | JSON only. Size limits (413). Type check (415). Objects only (400). | `accounts-http` |
| Leaking internals | Generic 500 message. The server log records only the error type, never tokens or bodies. Every response is no-store and noindex. | `accounts-http` |
| Feature reaching production | `accountsEnabled()` is false whenever `VERCEL_ENV=production`. There is no fallback to the production database, and the scripts refuse if the two URLs are equal. | `accounts-storage`, `accounts-http`, `accounts-ui`, `accounts-solar-proposal` |
| Backup tampering | Every hash is verified before a restore. A restore refuses altered files and existing organisations. Restored users come back disabled and reviewers suspended. | `accounts-recovery` |

## Test map

| File | Tests |
|---|---|
| `tests/regression/accounts-storage.test.ts` | 25: crypto, auth, organisations, storage, attachments, audit, purge |
| `tests/regression/accounts-reviewers.test.ts` | 18: registry and approvals |
| `tests/regression/accounts-http.test.ts` | 12: the HTTP guard under attack |
| `tests/regression/accounts-recovery.test.ts` | 4: the disaster-recovery drill |
| `tests/regression/accounts-solar-proposal.test.ts` | 7: Solar FOR ISSUE versus DRAFT |
| `tests/regression/accounts-ui.test.tsx` | 3: the screens end to end |

All tests run on PGlite. They never touch a real database.

## Residual risks and limits (not solvable by software alone)

1. **Reviewer verification is a human process.** The system records that a registry admin checked an identity and a registration; it cannot check them itself. The professional bodies accepted (`PROFESSIONAL_BODIES` in `config.ts`) are a **pending business decision**.
2. **No independent security audit yet.** These controls were reviewed by the developer. Commission an external penetration test before any production release.
3. **Email is not wired.** The default mailer sends nothing. A real sender, its domain authentication (SPF, DKIM, DMARC) and deliverability are an owner decision.
4. **TOTP only.** There are no recovery codes and no WebAuthn. A user who loses their authenticator needs an administrator-assisted reset, which is not yet built.
5. **Key custody.** Whoever holds `ACCOUNTS_SECRET_KEY` and `PROPOSAL_APPROVAL_SIGNING_KEY` can decrypt TOTP seeds and sign approvals. Store both only in Vercel's encrypted environment and rotate them per [operations.md](operations.md).
6. **The rate limits are database-backed**, which is adequate for a preview. Distributed attacks at scale need edge protection (Vercel Firewall).
7. **Personal data.** Accounts hold names and emails. Hosting location and retention must meet the Kenya Data Protection Act 2019; that is an owner and legal decision (see [data-handling-procedures.md](data-handling-procedures.md)).
