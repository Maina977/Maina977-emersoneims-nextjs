-- Database identity marker (Report B database setup approval, safeguards 2, 4 and 8).
--
-- ADDITIVE ONLY (CREATE ... IF NOT EXISTS). Applied by scripts/db/migrate.cjs or
-- lib/db/migrations/preview-setup.sql.
--
-- One row, set BY THE OWNER, separately in each database:
--   preview database:            INSERT INTO acct_database_identity (role) VALUES ('preview');
--   disaster-recovery test DB:   INSERT INTO acct_database_identity (role) VALUES ('dr-test');
-- The accounts feature refuses to run unless its database says 'preview'; the
-- recovery drill refuses unless the source says 'preview' and the target says
-- 'dr-test'. A production database has no such table, so it can never qualify.
CREATE TABLE IF NOT EXISTS acct_database_identity (
  singleton  BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton),
  role       TEXT NOT NULL CHECK (role IN ('preview', 'dr-test')),
  set_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
