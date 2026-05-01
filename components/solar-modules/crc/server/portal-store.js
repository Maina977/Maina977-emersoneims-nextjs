// =====================================================================
// portal-store.js — durable persistence for portal JWTs
//
// Auto-selects backend at boot:
//   • If process.env.DATABASE_URL set AND `pg` package installed → Postgres
//     (multi-node HA cluster ready)
//   • Otherwise → atomic JSON-file (single-node, dev/SME default)
//
// Public API is sync (compat with existing callers); Postgres mode keeps
// an in-memory mirror of the revocation set, write-through to DB.
// =====================================================================
const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const STORE    = path.join(DATA_DIR, 'portal-store.json');

let pgPool = null;
let mode   = 'json';
const inMem = { issued: {}, revoked: {} };

function tryInitPostgres() {
  if (!process.env.DATABASE_URL) return false;
  let pg;
  try { pg = require('pg'); } catch { return false; }
  try {
    pgPool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
    pgPool.query(`
      CREATE TABLE IF NOT EXISTS portal_issued (
        jti TEXT PRIMARY KEY,
        project_id TEXT, client_name TEXT,
        exp BIGINT, issued_at BIGINT
      );
      CREATE TABLE IF NOT EXISTS portal_revoked (
        jti TEXT PRIMARY KEY, revoked_at BIGINT
      );
    `).then(async () => {
      const { rows } = await pgPool.query('SELECT jti, revoked_at FROM portal_revoked');
      for (const r of rows) inMem.revoked[r.jti] = +r.revoked_at;
      const issued = await pgPool.query('SELECT * FROM portal_issued');
      for (const r of issued.rows) inMem.issued[r.jti] = { projectId: r.project_id, clientName: r.client_name, exp: +r.exp, issuedAt: +r.issued_at };
      console.log(`[portal-store] Postgres mode online; ${rows.length} revoked, ${issued.rows.length} issued cached.`);
    }).catch((e) => {
      console.warn('[portal-store] Postgres bootstrap failed, falling back to JSON:', e.message);
      pgPool = null; mode = 'json';
    });
    mode = 'postgres';
    return true;
  } catch (e) {
    console.warn('[portal-store] pg pool init failed:', e.message);
    return false;
  }
}

function ensureDir() { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); }
function loadJson() {
  ensureDir();
  try {
    if (!fs.existsSync(STORE)) return { issued: {}, revoked: {} };
    return JSON.parse(fs.readFileSync(STORE, 'utf8'));
  } catch { return { issued: {}, revoked: {} }; }
}
function saveJson(state) {
  ensureDir();
  const tmp = STORE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2));
  fs.renameSync(tmp, STORE);
}

tryInitPostgres();
if (mode === 'json') {
  const s = loadJson();
  inMem.issued = s.issued || {};
  inMem.revoked = s.revoked || {};
}

function recordIssue(jti, payload) {
  const rec = { ...payload, issuedAt: Date.now() };
  inMem.issued[jti] = rec;
  if (mode === 'postgres' && pgPool) {
    pgPool.query(
      'INSERT INTO portal_issued(jti, project_id, client_name, exp, issued_at) VALUES($1,$2,$3,$4,$5) ON CONFLICT(jti) DO NOTHING',
      [jti, payload.projectId || null, payload.clientName || null, payload.exp || 0, rec.issuedAt]
    ).catch(e => console.warn('[portal-store] insert issued failed:', e.message));
  } else {
    saveJson({ issued: inMem.issued, revoked: inMem.revoked });
  }
}
function recordRevoke(jti) {
  inMem.revoked[jti] = Date.now();
  if (mode === 'postgres' && pgPool) {
    pgPool.query(
      'INSERT INTO portal_revoked(jti, revoked_at) VALUES($1,$2) ON CONFLICT(jti) DO NOTHING',
      [jti, inMem.revoked[jti]]
    ).catch(e => console.warn('[portal-store] insert revoked failed:', e.message));
  } else {
    saveJson({ issued: inMem.issued, revoked: inMem.revoked });
  }
}
function isRevoked(jti) { return !!inMem.revoked[jti]; }
function listIssued()   { return inMem.issued; }
function listRevoked()  { return inMem.revoked; }
function backendMode()  { return mode; }

module.exports = {
  recordIssue, recordRevoke, isRevoked, listIssued, listRevoked,
  backendMode,
  _path: STORE,
};
