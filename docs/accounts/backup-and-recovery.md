# Backup and recovery

## Two layers

1. **Provider backups:** the database provider's own point-in-time recovery. Its availability and retention depend on the plan, so check the free plan's terms; on free plans it may be short or absent.
2. **Logical, per-organisation backups (this repository):** a JSON file holding one organisation's members, projects, every revision, attachments, reviewers, approvals and audit records, with an overall SHA-256.

## Back up one organisation

```
ACCOUNTS_DATABASE_URL=postgres://... node scripts/db/export-org.cjs --org=<organisation id> --out=org.json --yes
```
The file contains **personal data and customer project records**. Store it encrypted, with the same access controls as the database, and delete it by the retention schedule ([data-handling-procedures.md](data-handling-procedures.md)).

## Restore into a database

```
ACCOUNTS_DATABASE_URL=postgres://... ACCOUNTS_SECRET_KEY=... node scripts/db/import-org.cjs --in=org.json --yes
```
Apply the migrations to the target database first. The restore:
- **verifies every hash** before writing anything: the file, each revision, each attachment and each audit record. An altered file is refused;
- refuses an organisation that already exists in the target;
- restores users **disabled** (no usable password; address unverified). Each regains access through the password-reset email, and a completed reset also verifies the address;
- restores reviewers **suspended**, so no approval holds until a registry admin of the target re-verifies them. The original signed approvals then verify again, **provided the target uses the same `PROPOSAL_APPROVAL_SIGNING_KEY`**;
- moves the old audit records to `acct_audit_archive` and appends an `org.imported` record to the live chain.

## Recovery drill (automated)

`tests/regression/accounts-recovery.test.ts` runs the whole sequence on every test run, against a fresh database:
1. export;
2. restore;
3. byte-for-byte comparison of the revisions and the attachment;
4. audit verification;
5. old credentials refused, and access regained via reset;
6. approval withheld until re-verification, then valid again;
7. an altered backup and a re-import refused;
8. another organisation untouched.

The drill found and fixed one defect: restored users could never sign in, because their address stayed unverified.

## Full fidelity: disaster recovery that keeps sign-in and the second factor

The default export is **portable**. It has no credentials, and restored users reset their password.

For disaster recovery into the **same environment**, `--full-fidelity` also exports:
- each member's scrypt password hash and verification time;
- the encrypted second-factor seed;
- the recovery-code HMACs.

A restore then **preserves sign-in, the authenticator and the recovery codes**. These are covered by the file's SHA-256, so an altered credential is refused. Restoring needs the **same `ACCOUNTS_SECRET_KEY`**: the seeds are encrypted under it and the codes keyed by it. Reviewer profiles still come back **suspended** until re-verified. A full-fidelity file holds password hashes, so protect it like the database itself.

```
ACCOUNTS_DATABASE_URL=postgres://... node scripts/db/export-org.cjs --org=<id> --out=org.json --yes --full-fidelity
```

## The in-preview drill (credentials never leave the preview)

A registry administrator (second-factor session, fresh code) can run `POST /api/accounts/registry/dr-drill`. It:
1. exports one organisation in full fidelity from the preview database;
2. restores it into the **separate, empty** `ACCOUNTS_DR_DATABASE_URL`;
3. reports only booleans and counts.

The checks:
- backup verified;
- projects restored;
- every revision hash and attachment intact;
- audit records archived, and the restored audit chain verifies;
- stored credentials identical, and recovery codes preserved;
- optionally, a fictitious test user's real password and authenticator code accepted against the restored copy;
- reviewers suspended.

The automated test (`accounts-live-readiness`) also **signs in on the restored copy** with the original password, the authenticator, and a recovery code.

## Not yet done (owner decisions)

- Choose a backup schedule (for example weekly per organisation), a storage location (encrypted) and a retention period.
- Run a restore drill against the **real preview database** once it exists, not only the test database.
