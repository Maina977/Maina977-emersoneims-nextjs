-- Preview test-email outbox (Report B preview authorisation, item 5).
--
-- ADDITIVE ONLY (CREATE ... IF NOT EXISTS). Applied only by scripts/db/migrate.cjs.
--
-- Used only when ACCOUNTS_MAIL_MODE is exactly "outbox" on the protected
-- preview: account emails (verification, reset, invitation) to allow-listed
-- TEST addresses are stored here instead of being sent, so testers can open
-- the real links without any message leaving the system. Messages to any
-- other address are refused and never stored.
CREATE TABLE IF NOT EXISTS acct_test_outbox (
  id          UUID PRIMARY KEY,
  to_addr     TEXT NOT NULL,
  kind        TEXT NOT NULL CHECK (kind IN ('verify_email', 'reset_password', 'invite')),
  subject     TEXT NOT NULL,
  body        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS acct_test_outbox_to ON acct_test_outbox (to_addr, created_at DESC);
