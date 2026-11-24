-- READ-ONLY schema check for the accounts preview database and the empty
-- disaster-recovery test database (Report B). Paste into the database
-- provider's SQL editor AFTER running accounts-001 … accounts-005.
-- It changes nothing and returns only names and OK / MISSING (no data).
-- Every row must say OK, and the last row must say "SCHEMA OK".
-- (Not applied by migrate.cjs: it is not named accounts-NNN-*.sql.)
WITH expected(kind, name) AS (
  VALUES
    ('migration', 'accounts-001-core.sql'), ('migration', 'accounts-002-recovery.sql'),
    ('migration', 'accounts-003-test-outbox.sql'), ('migration', 'accounts-004-review-decisions.sql'),
    ('migration', 'accounts-005-database-identity.sql'),
    ('table', 'acct_schema_migrations'), ('table', 'acct_users'), ('table', 'acct_sessions'), ('table', 'acct_rate'),
    ('table', 'acct_tokens'), ('table', 'acct_orgs'), ('table', 'acct_memberships'), ('table', 'acct_projects'),
    ('table', 'acct_revisions'), ('table', 'acct_attachments'), ('table', 'acct_attachment_chunks'), ('table', 'acct_reviewers'),
    ('table', 'acct_approvals'), ('table', 'acct_approval_chain'), ('table', 'acct_audit'), ('table', 'acct_audit_head'),
    ('table', 'acct_audit_archive'), ('table', 'acct_recovery_codes'), ('table', 'acct_test_outbox'), ('table', 'acct_review_decisions'),
    ('table', 'acct_database_identity'),
    ('trigger', 'acct_revisions_immutable'), ('trigger', 'acct_audit_immutable'), ('trigger', 'acct_approval_chain_immutable')
),
present AS (
  SELECT 'table' AS kind, table_name::text AS name FROM information_schema.tables WHERE table_schema = 'public'
  UNION ALL SELECT 'trigger', tgname::text FROM pg_trigger WHERE NOT tgisinternal
  UNION ALL SELECT 'migration', name FROM acct_schema_migrations
),
checked AS (
  SELECT e.kind, e.name, CASE WHEN EXISTS (SELECT 1 FROM present p WHERE p.kind = e.kind AND p.name = e.name) THEN 'OK' ELSE 'MISSING' END AS status
  FROM expected e
)
SELECT kind, name, status FROM checked
UNION ALL
SELECT 'organisations', 'count (the disaster-recovery test database must show 0)', (SELECT count(*)::text FROM acct_orgs)
UNION ALL
SELECT 'identity', 'database role (preview database: preview; recovery test database: dr-test)', COALESCE((SELECT role FROM acct_database_identity), 'NOT SET')
UNION ALL
SELECT 'RESULT', '', CASE WHEN EXISTS (SELECT 1 FROM checked WHERE status = 'MISSING') THEN 'SCHEMA INCOMPLETE' ELSE 'SCHEMA OK' END;
