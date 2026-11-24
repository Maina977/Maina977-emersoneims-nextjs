-- Review decisions other than approval: REJECTION of an exact revision
-- (Report B live-database authorisation, item 7: approval, rejection,
-- revocation and re-approval).
--
-- ADDITIVE ONLY (CREATE ... IF NOT EXISTS). Applied only by scripts/db/migrate.cjs.
--
-- A rejection is a recorded professional decision by a verified, in-date,
-- in-scope reviewer, with a reason, against ONE revision and its content
-- hash. It never makes a document approved; the document stays DRAFT and
-- shows who rejected it, when and why. A later revision can be approved.
CREATE TABLE IF NOT EXISTS acct_review_decisions (
  id             UUID PRIMARY KEY,
  org_id         UUID NOT NULL,
  project_id     UUID NOT NULL REFERENCES acct_projects(id) ON DELETE CASCADE,
  revision_id    UUID NOT NULL REFERENCES acct_revisions(id) ON DELETE CASCADE,
  revision_hash  TEXT NOT NULL,
  tool           TEXT NOT NULL,
  document_type  TEXT NOT NULL,
  reviewer_id    UUID NOT NULL REFERENCES acct_reviewers(id),
  decision       TEXT NOT NULL CHECK (decision IN ('rejected')),
  reason         TEXT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS acct_review_decisions_rev ON acct_review_decisions (revision_id, document_type, created_at DESC);
