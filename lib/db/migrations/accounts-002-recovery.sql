-- Authenticator recovery (Report B preview authorisation, item 4).
--
-- ADDITIVE ONLY (CREATE ... IF NOT EXISTS). Applied only by scripts/db/migrate.cjs.
--
-- Single-use recovery codes. Only an HMAC of each code (keyed by
-- ACCOUNTS_SECRET_KEY) is stored, so a copy of the database alone cannot be
-- used to guess them. A used code keeps its row (used_at) for the audit trail.
CREATE TABLE IF NOT EXISTS acct_recovery_codes (
  user_id     UUID NOT NULL REFERENCES acct_users(id) ON DELETE CASCADE,
  code_hmac   TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ,
  PRIMARY KEY (user_id, code_hmac)
);
CREATE INDEX IF NOT EXISTS acct_recovery_codes_unused ON acct_recovery_codes (user_id) WHERE used_at IS NULL;
