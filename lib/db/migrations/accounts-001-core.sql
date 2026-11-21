-- Accounts, organisations and project storage (Phase 2, Management Priorities 4 and 5).
--
-- ADDITIVE ONLY: every statement is CREATE ... IF NOT EXISTS (or CREATE OR
-- REPLACE for trigger functions), so running this file twice is harmless and
-- it never alters or drops an existing table.
--
-- Applied ONLY by the explicit script scripts/db/migrate.cjs. The application
-- never runs migrations on start. Tests apply this same file to PGlite.
-- All application SQL that touches these tables is parameterised.

CREATE TABLE IF NOT EXISTS acct_schema_migrations (
  name        TEXT PRIMARY KEY,
  sha256      TEXT NOT NULL,
  applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------ users
CREATE TABLE IF NOT EXISTS acct_users (
  id                  UUID PRIMARY KEY,
  email               TEXT NOT NULL UNIQUE,          -- stored lower-case
  password_hash       TEXT NOT NULL,                 -- scrypt$N$r$p$salt$hash, or '!' (disabled, reset needed)
  display_name        TEXT NOT NULL DEFAULT '',
  email_verified_at   TIMESTAMPTZ,
  totp_secret_enc     TEXT,                          -- AES-256-GCM under ACCOUNTS_SECRET_KEY
  totp_enabled_at     TIMESTAMPTZ,
  totp_last_step      BIGINT NOT NULL DEFAULT 0,     -- replay protection
  failed_logins       INT NOT NULL DEFAULT 0,
  locked_until        TIMESTAMPTZ,
  -- Platform capability: may verify reviewer profiles. NEVER set by any route;
  -- granted only by a documented, manual SQL statement (docs/accounts/architecture.md).
  is_registry_admin   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sessions: only the SHA-256 of the 256-bit token is stored.
CREATE TABLE IF NOT EXISTS acct_sessions (
  token_hash      TEXT PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES acct_users(id) ON DELETE CASCADE,
  csrf_hash       TEXT NOT NULL,
  mfa_verified    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at      TIMESTAMPTZ NOT NULL               -- absolute expiry (12 h)
);
CREATE INDEX IF NOT EXISTS acct_sessions_user ON acct_sessions (user_id);

-- Database-backed rate limits (per hashed key per window), like geocode_visitor.
CREATE TABLE IF NOT EXISTS acct_rate (
  k    TEXT NOT NULL,
  win  TIMESTAMPTZ NOT NULL,
  n    INT NOT NULL,
  PRIMARY KEY (k, win)
);

-- Single-use, expiring tokens (email verification, password reset, invitation).
CREATE TABLE IF NOT EXISTS acct_tokens (
  token_hash  TEXT PRIMARY KEY,
  purpose     TEXT NOT NULL CHECK (purpose IN ('verify_email', 'reset_password', 'invite')),
  user_id     UUID REFERENCES acct_users(id) ON DELETE CASCADE,
  org_id      UUID,
  email       TEXT,
  role        TEXT,
  created_by  UUID,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ
);

-- ------------------------------------------------------------------ organisations
CREATE TABLE IF NOT EXISTS acct_orgs (
  id          UUID PRIMARY KEY,
  name        TEXT NOT NULL,
  created_by  UUID NOT NULL REFERENCES acct_users(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS acct_memberships (
  org_id      UUID NOT NULL REFERENCES acct_orgs(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES acct_users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'engineer', 'viewer')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (org_id, user_id)
);
CREATE INDEX IF NOT EXISTS acct_memberships_user ON acct_memberships (user_id);

-- ------------------------------------------------------------------ projects
CREATE TABLE IF NOT EXISTS acct_projects (
  id                   UUID PRIMARY KEY,
  org_id               UUID NOT NULL REFERENCES acct_orgs(id) ON DELETE CASCADE,
  tool                 TEXT NOT NULL CHECK (tool IN ('solar', 'oracle', 'building', 'aquascan')),
  name                 TEXT NOT NULL,
  source               TEXT NOT NULL CHECK (source IN ('account', 'browser-upload')),
  current_version      INT NOT NULL,
  current_revision_id  UUID,
  created_by           UUID NOT NULL REFERENCES acct_users(id),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at           TIMESTAMPTZ,
  deleted_by           UUID
);
CREATE INDEX IF NOT EXISTS acct_projects_org ON acct_projects (org_id, deleted_at);

-- Immutable revisions: content, SHA-256 of its canonical JSON, parent link.
CREATE TABLE IF NOT EXISTS acct_revisions (
  id                   UUID PRIMARY KEY,
  org_id               UUID NOT NULL,
  project_id           UUID NOT NULL REFERENCES acct_projects(id) ON DELETE CASCADE,
  version              INT NOT NULL,
  parent_revision_id   UUID REFERENCES acct_revisions(id),
  content              JSONB NOT NULL,
  content_sha256       TEXT NOT NULL,
  restored_from        UUID,
  note                 TEXT NOT NULL DEFAULT '',
  created_by           UUID NOT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (project_id, version)
);
CREATE INDEX IF NOT EXISTS acct_revisions_hash ON acct_revisions (org_id, content_sha256);

-- Attachments: bytes in the database, hashed, size-limited, type allow-listed.
CREATE TABLE IF NOT EXISTS acct_attachments (
  id           UUID PRIMARY KEY,
  org_id       UUID NOT NULL,
  project_id   UUID NOT NULL REFERENCES acct_projects(id) ON DELETE CASCADE,
  filename     TEXT NOT NULL,
  media_type   TEXT NOT NULL,
  size_bytes   INT NOT NULL,
  sha256       TEXT NOT NULL,
  status       TEXT NOT NULL CHECK (status IN ('uploading', 'complete')),
  data         BYTEA,
  created_by   UUID NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at   TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS acct_attachments_project ON acct_attachments (org_id, project_id);

-- Upload chunks (each request stays under the Vercel 4.5 MB body limit).
CREATE TABLE IF NOT EXISTS acct_attachment_chunks (
  attachment_id  UUID NOT NULL REFERENCES acct_attachments(id) ON DELETE CASCADE,
  idx            INT NOT NULL,
  data           BYTEA NOT NULL,
  PRIMARY KEY (attachment_id, idx)
);

-- ------------------------------------------------------------------ reviewers
-- Verified-professional registry. NO ROW IS EVER SEEDED. The application never
-- sets state='verified' except through the registry-admin verify action.
CREATE TABLE IF NOT EXISTS acct_reviewers (
  id                     UUID PRIMARY KEY,
  org_id                 UUID NOT NULL REFERENCES acct_orgs(id) ON DELETE CASCADE,
  user_id                UUID NOT NULL REFERENCES acct_users(id) ON DELETE CASCADE,
  legal_name             TEXT NOT NULL,
  identity_check_status  TEXT NOT NULL DEFAULT 'not_checked' CHECK (identity_check_status IN ('not_checked', 'checked', 'failed')),
  professional_body      TEXT NOT NULL,
  registration_number    TEXT NOT NULL,
  scope                  JSONB NOT NULL,               -- [{ "tool": "solar", "documentType": "proposal" }, ...]
  valid_from             DATE,
  valid_until            DATE,
  evidence_ref           TEXT,
  state                  TEXT NOT NULL DEFAULT 'pending' CHECK (state IN ('pending', 'verified', 'suspended', 'expired')),
  verified_by            UUID REFERENCES acct_users(id),
  verified_at            TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (org_id, user_id)
);

-- Approvals: bound to ONE revision id and its exact content hash, HMAC-signed by the server.
CREATE TABLE IF NOT EXISTS acct_approvals (
  id             UUID PRIMARY KEY,
  org_id         UUID NOT NULL,
  project_id     UUID NOT NULL REFERENCES acct_projects(id) ON DELETE CASCADE,
  revision_id    UUID NOT NULL REFERENCES acct_revisions(id) ON DELETE CASCADE,
  revision_hash  TEXT NOT NULL,
  tool           TEXT NOT NULL,
  document_type  TEXT NOT NULL,
  reviewer_id    UUID NOT NULL REFERENCES acct_reviewers(id),
  approval       JSONB NOT NULL,                       -- the signed VerifiedApproval
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at     TIMESTAMPTZ,
  UNIQUE (revision_id, reviewer_id, document_type)
);
CREATE INDEX IF NOT EXISTS acct_approvals_hash ON acct_approvals (revision_hash);

-- The approval chain of lib/solar/design/proposalApproval.ts (ApprovalAuditRecord), stored.
CREATE TABLE IF NOT EXISTS acct_approval_chain (
  sequence  INT PRIMARY KEY,
  record    JSONB NOT NULL
);

-- ------------------------------------------------------------------ audit log
-- Append-only, hash-chained. The head (last seq and hash) is kept in a
-- separate row with an HMAC under the server key, so a rewrite of the whole
-- table is also detected.
CREATE TABLE IF NOT EXISTS acct_audit (
  seq            BIGINT PRIMARY KEY,
  at             TIMESTAMPTZ NOT NULL,
  actor_user_id  UUID,
  org_id         UUID,
  action         TEXT NOT NULL,
  object_type    TEXT NOT NULL,
  object_id      TEXT NOT NULL,
  detail         JSONB NOT NULL,
  prev_hash      TEXT,
  record_hash    TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS acct_audit_org ON acct_audit (org_id, seq);

CREATE TABLE IF NOT EXISTS acct_audit_head (
  id         INT PRIMARY KEY CHECK (id = 1),
  seq        BIGINT NOT NULL,
  head_hash  TEXT,
  head_hmac  TEXT
);
INSERT INTO acct_audit_head (id, seq, head_hash, head_hmac) VALUES (1, -1, NULL, NULL) ON CONFLICT (id) DO NOTHING;

-- Audit records restored from a logical export (kept apart from the live chain).
CREATE TABLE IF NOT EXISTS acct_audit_archive (
  org_id       UUID NOT NULL,
  seq          BIGINT NOT NULL,
  record       JSONB NOT NULL,
  imported_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (org_id, seq)
);

-- ------------------------------------------------------------------ immutability
-- Revisions, the audit log and the approval chain can never be updated.
-- They can be deleted only inside the documented purge job, which sets
-- acct.purge = 'on' for its own transaction (SET LOCAL / set_config(..., true)).
CREATE OR REPLACE FUNCTION acct_block_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'DELETE' AND current_setting('acct.purge', true) = 'on' THEN
    RETURN OLD;
  END IF;
  RAISE EXCEPTION '% on % is not allowed (append-only)', TG_OP, TG_TABLE_NAME;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'acct_revisions_immutable') THEN
    CREATE TRIGGER acct_revisions_immutable BEFORE UPDATE OR DELETE ON acct_revisions
      FOR EACH ROW EXECUTE FUNCTION acct_block_mutation();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'acct_audit_immutable') THEN
    CREATE TRIGGER acct_audit_immutable BEFORE UPDATE OR DELETE ON acct_audit
      FOR EACH ROW EXECUTE FUNCTION acct_block_mutation();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'acct_approval_chain_immutable') THEN
    CREATE TRIGGER acct_approval_chain_immutable BEFORE UPDATE OR DELETE ON acct_approval_chain
      FOR EACH ROW EXECUTE FUNCTION acct_block_mutation();
  END IF;
END $$;
