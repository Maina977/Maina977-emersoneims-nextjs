import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { sha256Hex } from '@/lib/generator-oracle/service/sha256';
import {
  cardContentHash, jobCardReport, openJobCard, signOffCheck, signOffSummary, transition, SIGNOFF, TYPED_SIGNOFF_NOTICE,
  V1_UNCHECKED_SIGNOFF_NOTE, V1_UPGRADE_BY, type Asset, type JobCard,
} from '@/lib/generator-oracle/service/maintenance';
import { apply, deserialise, emptyState, loadState, reduce, saveState, serialise, BACKUP_KEY, STORE_KEY, V1_BACKUP_KEY, type KeyValueStore, type ServiceAction, type ServiceState } from '@/lib/generator-oracle/service/store';

// TEST values and TEST references only — never real OEM intervals, names or part numbers.
const NOW = '2026-11-21T09:00:00.000Z';
const ref = { document: 'TEST O&M manual', edition: 'TEST ed. 1', page: '42' };
const book = { document: 'TEST parts book', edition: 'TEST ed.', page: '7' };
const run = (s: ServiceState, ...acts: ServiceAction[]) => acts.reduce(reduce, s);
const completed = () => run(emptyState(),
  { type: 'saveAsset', asset: { make: 'TEST', model: 'T-100', engine: 'TEST-ENG', controller: 'TEST-CTRL', serial: 'S-1', ratedKva: 100 } },
  { type: 'addTask', assetId: 'A-1', task: { task: 'TEST oil and filter', intervalHours: 250, source: ref } },
  { type: 'openCard', card: { assetId: 'A-1', opened: '2026-11-20', reportedFault: 'TEST low oil pressure shutdown', faultCodes: ['TEST-LOP'], technician: 'TECH-A' } },
  { type: 'transition', cardId: 'JC-1', to: 'IN PROGRESS', by: 'TECH-A', at: '2026-11-20T08:00', note: 'TEST started' },
  { type: 'transition', cardId: 'JC-1', to: 'COMPLETED', by: 'TECH-A', at: '2026-11-20T12:00', update: {
    findings: 'TEST sender faulty', tasks: ['TEST replace sender', 'TEST test run'], engineHoursAtJob: 1500, labourHours: 2,
    parts: [{ partNo: 'TEST-123', description: 'TEST sender', qty: 1, compatibility: book }],
    readings: [{ name: 'TEST voltage', value: 405, unit: 'V', min: 380, max: 420, limitSource: 'TEST rating plate', checklistId: 'voltage' }, { name: 'TEST frequency', value: 50, unit: 'Hz', checklistId: 'frequency' }, { name: 'TEST oil pressure', value: 300, unit: 'kPa', checklistId: 'oilPressure' }, { name: 'TEST coolant temperature', value: 80, unit: '°C', checklistId: 'coolantTemp' }],
  } },
);
const signed = () => run(completed(), { type: 'transition', cardId: 'JC-1', to: SIGNOFF, by: 'SUPERVISOR-B', at: '2026-11-20T13:00' });
const card = (s: ServiceState, id = 'JC-1') => s.jobCards.find((c) => c.id === id)!;
const asset = (s: ServiceState): Asset => s.assets[0];
/** Exported JSON as a plain object an attacker can edit. */
const exported = (s: ServiceState) => JSON.parse(serialise(s));
const memoryStore = (mem = new Map<string, string>()): KeyValueStore & { mem: Map<string, string> } => ({ mem, getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => void mem.set(k, v) });

describe('sha256 (sync) matches the standard', () => {
  it('known vectors and node:crypto on awkward lengths and non-ASCII text', () => {
    expect(sha256Hex('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    expect(sha256Hex('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    expect(sha256Hex('abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq')).toBe('248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1');
    for (const n of [1, 55, 56, 57, 63, 64, 65, 119, 120, 1000]) {
      const t = 'x—é✓'.repeat(n).slice(0, n * 2);
      expect(sha256Hex(t)).toBe(createHash('sha256').update(t, 'utf8').digest('hex'));
    }
  });
});

describe('typed sign-off: label, hash, lock', () => {
  it('the step reads SIGN-OFF RECORDED — NOT VERIFIED (typed name) and records a content hash', () => {
    const c = card(signed());
    expect(SIGNOFF).toBe('SIGN-OFF RECORDED — NOT VERIFIED (typed name)');
    expect(c.status).toBe(SIGNOFF);
    expect(c.signOffHash).toMatch(/^[0-9a-f]{64}$/);
    expect(c.signOffHash).toBe(cardContentHash(c, 'SUPERVISOR-B', '2026-11-20T13:00'));
    expect(c.log[c.log.length - 1]).toMatchObject({ to: SIGNOFF, by: 'SUPERVISOR-B', hash: c.signOffHash, revision: 1 });
    expect(signOffCheck(c).kind).toBe('unchanged');
    expect(signOffSummary(c).join('\n')).toMatch(/not an approval/);
  });
  it('a card at the sign-off step is locked: no edits, no status change, until it is reopened', () => {
    const s = signed();
    expect(apply(s, { type: 'updateCard', cardId: 'JC-1', update: { findings: 'TEST edited' } }).error).toMatch(/cannot be edited; reopen it first/);
    for (const to of ['OPEN', 'IN PROGRESS', 'AWAITING PARTS', 'COMPLETED', SIGNOFF] as const) {
      expect(apply(s, { type: 'transition', cardId: 'JC-1', to, by: 'SUPERVISOR-B', at: '2026-11-21T08:00', update: { findings: 'TEST sneaky' } }).error).toMatch(/cannot go from/);
    }
    expect(card(s).findings).toBe('TEST sender faulty');
  });
  it('reopen needs who, when and a reason; it starts a new revision and keeps the earlier sign-off traceable', () => {
    const s = signed();
    const firstHash = card(s).signOffHash!;
    expect(apply(s, { type: 'reopen', cardId: 'JC-1', by: 'SUPERVISOR-B', at: '2026-11-21T08:00', reason: ' ' }).error).toMatch(/reason/);
    expect(apply(s, { type: 'reopen', cardId: 'JC-1', by: '', at: '2026-11-21T08:00', reason: 'TEST' }).error).toMatch(/Who and when/);
    expect(apply(completed(), { type: 'reopen', cardId: 'JC-1', by: 'X', at: '2026-11-21T08:00', reason: 'TEST' }).error).toMatch(/Only a card at/);
    const r = reduce(s, { type: 'reopen', cardId: 'JC-1', by: 'SUPERVISOR-B', at: '2026-11-21T08:00', reason: 'TEST wrong reading recorded' });
    const c = card(r);
    expect(c).toMatchObject({ status: 'IN PROGRESS', revision: 2, signOffTypedName: null, signOffRecordedOn: null, signOffHash: null });
    const reopen = c.log[c.log.length - 1];
    expect(reopen).toMatchObject({ from: SIGNOFF, to: 'IN PROGRESS', by: 'SUPERVISOR-B', at: '2026-11-21T08:00' });
    expect(reopen.note).toContain('REOPENED. Reason: TEST wrong reading recorded');
    expect(reopen.note).toContain(firstHash);
    expect(reopen.note).toContain('Revision 2 needs a fresh sign-off');
    // Edit, complete and sign again: a second sign-off for revision 2, the first one still in the history.
    const again = run(r,
      { type: 'updateCard', cardId: 'JC-1', update: { findings: 'TEST sender faulty; reading corrected' } },
      { type: 'transition', cardId: 'JC-1', to: 'COMPLETED', by: 'TECH-A', at: '2026-11-21T09:00' },
      { type: 'transition', cardId: 'JC-1', to: SIGNOFF, by: 'SUPERVISOR-D', at: '2026-11-21T10:00' });
    const c2 = card(again);
    const signOffs = c2.log.filter((l) => l.to === SIGNOFF);
    expect(signOffs.map((l) => [l.by, l.revision, l.hash])).toEqual([['SUPERVISOR-B', 1, firstHash], ['SUPERVISOR-D', 2, c2.signOffHash]]);
    expect(c2.signOffHash).not.toBe(firstHash);
    expect(signOffCheck(c2).kind).toBe('unchanged');
    const report = jobCardReport(c2, asset(again));
    expect(report).toContain(`[content hash ${firstHash}]`);
    expect(report).toContain('JOB CARD JC-1 (revision 2)');
  });
  it('reopened and edited: the report says CHANGED AFTER SIGN-OFF against the cancelled sign-off', () => {
    const r = run(signed(),
      { type: 'reopen', cardId: 'JC-1', by: 'SUPERVISOR-B', at: '2026-11-21T08:00', reason: 'TEST' },
      { type: 'updateCard', cardId: 'JC-1', update: { labourHours: 3 } });
    const rep = jobCardReport(card(r), asset(r));
    expect(rep).toMatch(/No current sign-off \(revision 2\)/);
    expect(rep).toContain('CHANGED AFTER SIGN-OFF');
  });
});

describe('job-card report .txt', () => {
  it('has asset, fault, work, parts (compatibility unverified), readings, history with who/when, and the notice', () => {
    const s = run(completed(), { type: 'transition', cardId: 'JC-1', to: 'IN PROGRESS', by: 'TECH-A', at: '2026-11-20T12:30', note: 'TEST add part' });
    const s2 = reduce(s, { type: 'updateCard', cardId: 'JC-1', update: { parts: [...card(s).parts, { partNo: 'TEST-456', description: 'TEST washer', qty: 2, compatibility: null }] } });
    const rep = jobCardReport(card(s2), asset(s2));
    expect(rep).toContain(`NOTICE: ${TYPED_SIGNOFF_NOTICE}`);
    expect(rep).toContain('Sign-off recorded by typed name — not an authenticated signature. Not valid as a certified record until reviewer accounts exist.');
    expect(rep).toContain('A-1: TEST T-100 (100 kVA), engine TEST-ENG, controller TEST-CTRL, serial S-1');
    expect(rep).toContain('Reported fault: TEST low oil pressure shutdown');
    expect(rep).toContain('Fault codes: TEST-LOP');
    expect(rep).toMatch(/WORK DONE\n {2}- TEST replace sender\n {2}- TEST test run/);
    expect(rep).toContain('1 × TEST-123 TEST sender — parts book: TEST parts book, TEST ed., p. 7');
    expect(rep).toContain('2 × TEST-456 TEST washer — compatibility unverified (no parts-book reference)');
    expect(rep).toContain('TEST voltage: 405 V (limits 380–420 V, source: TEST rating plate)');
    expect(rep).toContain('TEST frequency: 50 Hz (no limit given — NOT VERIFIED, not a pass)');
    expect(rep).toContain('2026-11-20T08:00  OPEN → IN PROGRESS  by TECH-A — TEST started');
    expect(rep).toContain('2026-11-20T12:00  IN PROGRESS → COMPLETED  by TECH-A');
    expect(rep).toContain('2026-11-20T12:30  COMPLETED → IN PROGRESS  by TECH-A — TEST add part');
    expect(rep).toContain('STATUS HISTORY (who = typed name, not verified)');
  });
  it('never presents a typed sign-off as plain SIGNED OFF, approved or certified (report and export)', () => {
    const s = reduce(signed(), { type: 'recordService', cardId: 'JC-1', planTaskIds: ['T-1'] });
    for (const text of [jobCardReport(card(s), asset(s)), serialise(s)]) {
      expect(text).toContain(SIGNOFF);
      expect(text).not.toMatch(/\bSIGNED OFF\b/i);
      expect(text.replace(/not an approval/gi, '')).not.toMatch(/approv/i); // only ever negated
      expect(text.replace(/Not valid as a certified record/g, '')).not.toMatch(/certif/i);
      // "authenticated" only ever appears negated
      expect(text.replace(/not an authenticated signature/gi, '')).not.toMatch(/authenticat/i);
    }
    expect(jobCardReport(card(s), asset(s))).toContain('SIGN-OFF RECORDED — NOT VERIFIED (typed name): typed name SUPERVISOR-B, recorded 2026-11-20T13:00, revision 1. Not an authenticated signature, not an approval.');
  });
});

describe('import attacks: nothing that claims a sign-off is shown as clean', () => {
  /** Must be refused with a message naming the card; returns the message. */
  const refused = (text: string, why: RegExp) => {
    const r = deserialise(text);
    expect(r.ok).toBe(false);
    if (r.ok) throw new Error('accepted');
    expect(r.error).toMatch(/^Refused: job card JC-1 fails the job-card checks/);
    expect(r.error).toMatch(why);
    return r.error;
  };

  it('forged sign-off without a hash (status and name typed into the file) is refused', () => {
    const j = exported(completed());
    const c = j.jobCards[0];
    Object.assign(c, { status: SIGNOFF, signOffTypedName: 'FORGED-REVIEWER', signOffRecordedOn: '2026-11-20T13:00' });
    c.log.push({ at: '2026-11-20T13:00', from: 'COMPLETED', to: SIGNOFF, by: 'FORGED-REVIEWER' });
    expect(refused(JSON.stringify(j), /no content hash was recorded at sign-off/)).toMatch(/CHANGED AFTER SIGN-OFF \/ NOT VERIFIED/);
  });
  it('forged sign-off with a made-up hash is refused', () => {
    const j = exported(completed());
    const c = j.jobCards[0];
    const fake = 'a'.repeat(64);
    Object.assign(c, { status: SIGNOFF, signOffTypedName: 'FORGED-REVIEWER', signOffRecordedOn: '2026-11-20T13:00', signOffHash: fake });
    c.log.push({ at: '2026-11-20T13:00', from: 'COMPLETED', to: SIGNOFF, by: 'FORGED-REVIEWER', hash: fake, revision: 1 });
    refused(JSON.stringify(j), /does not match the hash recorded at sign-off/);
  });
  it('a plain "SIGNED OFF" status, or sign-off details on a card not at that step, is rejected', () => {
    const j = exported(signed());
    j.jobCards[0].status = 'SIGNED OFF';
    expect(deserialise(JSON.stringify(j))).toMatchObject({ ok: false, error: expect.stringMatching(/unknown status "SIGNED OFF"/) });
    const k = exported(completed());
    k.jobCards[0].signOffTypedName = 'FORGED-REVIEWER';
    expect(deserialise(JSON.stringify(k))).toMatchObject({ ok: false, error: expect.stringMatching(/carries sign-off details but is not at the sign-off step/) });
    const m = exported(completed());
    m.jobCards[0].status = SIGNOFF; // status without the history step
    expect(deserialise(JSON.stringify(m))).toMatchObject({ ok: false, error: expect.stringMatching(/status does not match its history/) });
  });
  it('content changed after sign-off (work, findings, parts, readings, hours, technician) is refused', () => {
    const edits: Array<(c: Record<string, unknown> & { readings: Array<Record<string, unknown>>; parts: Array<Record<string, unknown>> }) => void> = [
      (c) => { c.findings = 'TEST rewritten later'; },
      (c) => { c.tasks = ['TEST different work']; },
      (c) => { c.readings[0].value = 410; },
      (c) => { c.parts[0].qty = 5; },
      (c) => { c.engineHoursAtJob = 1600; },
      (c) => { c.technician = 'TECH-Z'; },
      (c) => { c.revision = 2; },
    ];
    for (const edit of edits) {
      const j = exported(signed());
      edit(j.jobCards[0]);
      refused(JSON.stringify(j), /CHANGED AFTER SIGN-OFF|revision/);
    }
  });
  it('the typed sign-off name or time changed after sign-off (impersonation) is refused', () => {
    for (const patch of [{ signOffTypedName: 'OTHER-REVIEWER' }, { signOffRecordedOn: '2026-11-25T09:00' }]) {
      const j = exported(signed());
      Object.assign(j.jobCards[0], patch);
      refused(JSON.stringify(j), /CHANGED AFTER SIGN-OFF/);
    }
    const j = exported(signed());
    j.jobCards[0].log[j.jobCards[0].log.length - 1].by = 'OTHER-REVIEWER';
    refused(JSON.stringify(j), /CHANGED AFTER SIGN-OFF/);
  });
  it('a history that skips steps, or a forged reopen, is refused (status re-derived from the log)', () => {
    const j = exported(signed());
    j.jobCards[0].log = j.jobCards[0].log.filter((l: { to: string }) => l.to !== 'COMPLETED');
    refused(JSON.stringify(j), /not an allowed step|starts from/);
    const k = exported(completed());
    k.jobCards[0].log.push({ at: '2026-11-21T08:00', from: SIGNOFF, to: 'IN PROGRESS', by: 'X' });
    expect(deserialise(JSON.stringify(k))).toMatchObject({ ok: false, error: expect.stringMatching(/status does not match its history/) });
    k.jobCards[0].status = 'IN PROGRESS'; // make the status agree: the replay still catches the forged reopen
    refused(JSON.stringify(k), /history step 3 starts from .* but the card was at COMPLETED/);
  });
  it('a forged sign-off with a correctly recomputed hash still has to pass every sign-off rule', () => {
    const forge = (s: ServiceState, by: string) => {
      const j = exported(s);
      const c = j.jobCards[0] as JobCard;
      const at = '2026-11-20T13:00';
      const hash = cardContentHash(c, by, at);
      Object.assign(c, { status: SIGNOFF, signOffTypedName: by, signOffRecordedOn: at, signOffHash: hash });
      c.log.push({ at, from: 'COMPLETED', to: SIGNOFF, by, hash, revision: c.revision });
      return JSON.stringify(j);
    };
    refused(forge(completed(), 'TECH-A'), /sign-off by the technician/);
    refused(forge(completed(), 'tech-a '), /sign-off by the technician/);
    const unverified = run(completed(),
      { type: 'transition', cardId: 'JC-1', to: 'IN PROGRESS', by: 'TECH-A', at: '2026-11-20T12:10' },
      { type: 'updateCard', cardId: 'JC-1', update: { parts: [{ partNo: 'TEST-9', description: '', qty: 1, compatibility: null }] } },
      { type: 'transition', cardId: 'JC-1', to: 'COMPLETED', by: 'TECH-A', at: '2026-11-20T12:20' });
    refused(forge(unverified, 'SUPERVISOR-B'), /Compatibility unverified for: TEST-9/);
    // Limitation (no accounts): a self-consistent forgery that follows every rule cannot be told apart from a
    // typed sign-off — so it is still shown only as NOT VERIFIED (typed name), never as an approval.
    const r = deserialise(forge(completed(), 'SUPERVISOR-X'));
    expect(r.ok && card(r.state).status).toBe(SIGNOFF);
    if (r.ok) expect(jobCardReport(card(r.state), asset(r.state))).toContain(`${SIGNOFF}: typed name SUPERVISOR-X`);
  });
  it('service history with no signed job card behind it is refused', () => {
    const j = exported(signed());
    j.history = { 'A-1': [{ date: '2026-11-01', engineHours: 500, taskIds: ['T-1'], jobCardId: 'JC-404', technician: 'nobody' }] };
    expect(deserialise(JSON.stringify(j))).toMatchObject({ ok: false, error: expect.stringMatching(/points at job card JC-404, which is not in the file/) });
    const k = exported(completed());
    k.history = { 'A-1': [{ date: '2026-11-20', engineHours: 1500, taskIds: ['T-1'], jobCardId: 'JC-1', technician: 'TECH-A' }] };
    expect(deserialise(JSON.stringify(k))).toMatchObject({ ok: false, error: expect.stringMatching(/does not match job card JC-1/) });
  });
  it('localStorage edited directly: refused on load, the data is backed up, nothing loads as signed', () => {
    const st = memoryStore();
    expect(saveState(st, signed())).toBeNull();
    const j = JSON.parse(st.mem.get(STORE_KEY)!);
    j.jobCards[0].findings = 'TEST edited in storage after sign-off';
    const raw = JSON.stringify(j);
    st.mem.set(STORE_KEY, raw);
    const r = loadState(st, NOW);
    expect(r.state).toEqual(emptyState());
    expect(r.error).toMatch(/CHANGED AFTER SIGN-OFF/);
    expect(st.mem.get(`${BACKUP_KEY}:${NOW}`)).toBe(raw);
  });
  it('a clean export imports unchanged (no notice)', () => {
    const s = reduce(signed(), { type: 'recordService', cardId: 'JC-1', planTaskIds: ['T-1'] });
    expect(deserialise(serialise(s))).toEqual({ ok: true, state: s, notice: null });
    const reopened = run(s, { type: 'reopen', cardId: 'JC-1', by: 'SUPERVISOR-B', at: '2026-11-21T08:00', reason: 'TEST' }, { type: 'updateCard', cardId: 'JC-1', update: { labourHours: 3 } });
    expect(deserialise(serialise(reopened))).toEqual({ ok: true, state: reopened, notice: null });
  });
  it('a version 1 file with a plain "SIGNED OFF" card loads: the card goes back to COMPLETED, everything else is kept', () => {
    const v1 = v1File(signed());
    const r = deserialise(JSON.stringify(v1), NOW);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.upgradedFrom).toBe(1);
    expect(r.state.assets).toEqual(v1.assets);
    expect(r.state.plans).toEqual(v1.plans);
    const c = card(r.state);
    expect(c).toMatchObject({ status: 'COMPLETED', revision: 2, signOffTypedName: null, signOffRecordedOn: null, signOffHash: null });
    expect(c.findings).toBe('TEST sender faulty');
    const last = c.log[c.log.length - 1];
    expect(last).toMatchObject({ at: NOW, from: SIGNOFF, to: 'COMPLETED', by: V1_UPGRADE_BY });
    expect(last.note).toContain('Sign-off from a version-1 file could not be checked (no content hash); sign-off must be recorded again');
    expect(last.note).toContain('recorded by typed name SUPERVISOR-B on 2026-11-20T13:00');
    // the old sign-off step stays in the history
    expect(c.log[c.log.length - 2]).toMatchObject({ from: 'COMPLETED', to: SIGNOFF, by: 'SUPERVISOR-B' });
    expect(r.notice).toMatch(/saved by version 1 .* upgraded to version 2/);
    expect(r.notice).toContain(`${V1_UNCHECKED_SIGNOFF_NOTE}. Moved back to COMPLETED: job card JC-1.`);
    // nothing is shown as signed: the report says no current sign-off and not verified
    const rep = jobCardReport(c, asset(r.state));
    expect(rep).toContain('No current sign-off (revision 2)');
    expect(rep).toContain('CHANGED AFTER SIGN-OFF / NOT VERIFIED');
  });
});

/** A version-1 file of a state: plain "SIGNED OFF", signedOffBy/On, no hash, no revision, no format marker. */
function v1File(s: ServiceState) {
  const j = exported(s);
  const jobCards = j.jobCards.map((c: Record<string, unknown> & { log: Array<Record<string, unknown>> }) => {
    const v1Card: Record<string, unknown> = { ...c, status: c.status === SIGNOFF ? 'SIGNED OFF' : c.status, signedOffBy: c.signOffTypedName, signedOffOn: c.signOffRecordedOn,
      log: c.log.map((l) => ({ at: l.at, from: l.from === SIGNOFF ? 'SIGNED OFF' : l.from, to: l.to === SIGNOFF ? 'SIGNED OFF' : l.to, by: l.by, ...(l.note ? { note: l.note } : {}) })) };
    delete v1Card.signOffTypedName; delete v1Card.signOffRecordedOn; delete v1Card.signOffHash; delete v1Card.revision;
    return v1Card;
  });
  return { version: 1, assets: j.assets, plans: j.plans, history: j.history, jobCards };
}

describe('version-1 upgrade: unhashed sign-offs are moved back, not the whole file refused (auditor LOW 1)', () => {
  /** Two assets, plans, a signed card recorded as service history, a second signed card and an open one. */
  const project = () => {
    let s = reduce(signed(), { type: 'recordService', cardId: 'JC-1', planTaskIds: ['T-1'] });
    s = run(s,
      { type: 'saveAsset', asset: { make: 'TEST', model: 'T-200', engine: 'TEST-ENG2', controller: 'TEST-CTRL2', serial: 'S-2', ratedKva: 200 } },
      { type: 'addTask', assetId: 'A-2', task: { task: 'TEST air filter', intervalMonths: 6, source: ref } },
      { type: 'openCard', card: { assetId: 'A-2', opened: '2026-11-19', reportedFault: 'TEST no start', technician: 'TECH-C' } },
      { type: 'transition', cardId: 'JC-2', to: 'IN PROGRESS', by: 'TECH-C', at: '2026-11-19T08:00' },
      { type: 'transition', cardId: 'JC-2', to: 'COMPLETED', by: 'TECH-C', at: '2026-11-19T10:00', update: { findings: 'TEST battery flat', tasks: ['TEST charge battery'], engineHoursAtJob: 300, readings: [{ name: 'TEST voltage', value: 400, unit: 'V', checklistId: 'voltage' }, { name: 'TEST frequency', value: 50, unit: 'Hz', checklistId: 'frequency' }, { name: 'TEST oil pressure', value: 300, unit: 'kPa', checklistId: 'oilPressure' }, { name: 'TEST coolant temperature', value: 80, unit: '°C', checklistId: 'coolantTemp' }] } },
      { type: 'transition', cardId: 'JC-2', to: SIGNOFF, by: 'SUPERVISOR-D', at: '2026-11-19T11:00' },
      { type: 'openCard', card: { assetId: 'A-2', opened: '2026-11-21', reportedFault: 'TEST oil leak', technician: 'TECH-C' } });
    return s;
  };

  it('loads assets, plans and unsigned cards; lists every affected card; takes their service records out of the due list', () => {
    const r = deserialise(JSON.stringify(v1File(project())), NOW);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.state.assets.map((a) => a.id)).toEqual(['A-1', 'A-2']);
    expect(Object.keys(r.state.plans)).toEqual(['A-1', 'A-2']);
    expect(r.state.jobCards.map((c) => [c.id, c.status, c.revision])).toEqual([['JC-1', 'COMPLETED', 2], ['JC-2', 'COMPLETED', 2], ['JC-3', 'OPEN', 1]]);
    expect(r.notice).toContain('Moved back to COMPLETED: job cards JC-1, JC-2.');
    expect(r.notice).toContain('Service records taken out of the due list until each card is signed off and recorded again: JC-1 (A-1, 2026-11-20, 1500 h, plan tasks T-1).');
    expect(r.state.history['A-1']).toEqual([]);
    expect(card(r.state).log[card(r.state).log.length - 1].note).toContain('Its service record was taken out of the due list until then: JC-1 (A-1, 2026-11-20, 1500 h, plan tasks T-1).');
    // No card loads at the sign-off step, and nothing in the report or export reads as plain SIGNED OFF
    expect(r.state.jobCards.some((c) => c.status === SIGNOFF)).toBe(false);
    for (const text of [serialise(r.state), ...r.state.jobCards.map((c) => jobCardReport(c, r.state.assets.find((a) => a.id === c.assetId)!))]) expect(text).not.toMatch(/\bSIGNED OFF\b/);
  });
  it('the moved-back card can be signed off again (revision 2), recorded as service, exported and re-imported unchanged', () => {
    const r = deserialise(JSON.stringify(v1File(project())), NOW);
    if (!r.ok) throw new Error(r.error);
    const s = run(r.state,
      { type: 'transition', cardId: 'JC-1', to: SIGNOFF, by: 'SUPERVISOR-B', at: '2026-11-21T10:00' },
      { type: 'recordService', cardId: 'JC-1', planTaskIds: ['T-1'] });
    const c = card(s);
    expect(c).toMatchObject({ status: SIGNOFF, revision: 2 });
    expect(c.log[c.log.length - 1]).toMatchObject({ revision: 2, hash: c.signOffHash });
    expect(signOffCheck(c).kind).toBe('unchanged');
    expect(deserialise(serialise(s))).toEqual({ ok: true, state: s, notice: null });
  });
  it('localStorage version-1 data: loads, the original is backed up first, and the message lists the cards', () => {
    const st = memoryStore();
    const raw = JSON.stringify(v1File(project()));
    st.mem.set(STORE_KEY, raw);
    const r = loadState(st, NOW);
    expect(r.error).toBeNull();
    expect(r.protectSaved).toBe(false);
    expect(r.state.assets).toHaveLength(2);
    expect(r.notice).toContain('Moved back to COMPLETED: job cards JC-1, JC-2.');
    expect(r.notice).toContain(`"${V1_BACKUP_KEY}:${NOW}"`);
    expect(st.mem.get(`${V1_BACKUP_KEY}:${NOW}`)).toBe(raw);
    expect(st.mem.get(STORE_KEY)).toBe(raw); // not overwritten by loading
  });
  it('localStorage version-1 data that cannot be backed up: loads but protects the saved original', () => {
    const raw = JSON.stringify(v1File(project()));
    const st: KeyValueStore = { getItem: (k) => (k === STORE_KEY ? raw : null), setItem: () => { throw new Error('quota'); } };
    const r = loadState(st, NOW);
    expect(r.state.jobCards).toHaveLength(3);
    expect(r.protectSaved).toBe(true);
    expect(r.notice).toMatch(/could not be backed up; it is left in place/);
  });
  it('a version-1 card with other problems is still refused (whole file), and a tampered version-2 file is still refused and backed up', () => {
    const v1 = v1File(signed());
    (v1.jobCards[0] as Record<string, unknown>).readings = []; // completed without test-run readings
    expect(deserialise(JSON.stringify(v1), NOW)).toMatchObject({ ok: false, error: expect.stringMatching(/completed without: test-run readings/) });
    const st = memoryStore();
    const j = exported(signed());
    j.jobCards[0].findings = 'TEST edited after sign-off';
    const raw = JSON.stringify(j);
    st.mem.set(STORE_KEY, raw);
    const r = loadState(st, NOW);
    expect(r.state).toEqual(emptyState());
    expect(r.error).toMatch(/CHANGED AFTER SIGN-OFF/);
    expect(st.mem.get(`${BACKUP_KEY}:${NOW}`)).toBe(raw);
  });
  it('the version-1 move-back step cannot be used to forge anything in a version-2 file', () => {
    // An unhashed sign-off plus a move-back step makes only a COMPLETED card, never a signed one...
    const j = exported(completed());
    const c = j.jobCards[0];
    c.log.push({ at: '2026-11-20T13:00', from: 'COMPLETED', to: SIGNOFF, by: 'FORGED-REVIEWER' });
    c.log.push({ at: NOW, from: SIGNOFF, to: 'COMPLETED', by: V1_UPGRADE_BY, note: `${V1_UNCHECKED_SIGNOFF_NOTE}.` });
    c.revision = 2;
    const r = deserialise(JSON.stringify(j));
    expect(r.ok && card(r.state).status).toBe('COMPLETED');
    // ...and it cannot carry service history (that needs a hashed sign-off)
    j.history = { 'A-1': [{ date: '2026-11-20', engineHours: 1500, taskIds: ['T-1'], jobCardId: 'JC-1', technician: 'TECH-A' }] };
    expect(deserialise(JSON.stringify(j))).toMatchObject({ ok: false, error: expect.stringMatching(/does not match job card JC-1/) });
    // a move-back step after a hashed (current) sign-off is not allowed
    const k = exported(signed());
    k.jobCards[0].log.push({ at: NOW, from: SIGNOFF, to: 'COMPLETED', by: V1_UPGRADE_BY, note: `${V1_UNCHECKED_SIGNOFF_NOTE}.` });
    Object.assign(k.jobCards[0], { status: 'COMPLETED', revision: 2, signOffTypedName: null, signOffRecordedOn: null, signOffHash: null });
    expect(deserialise(JSON.stringify(k))).toMatchObject({ ok: false, error: expect.stringMatching(/not an allowed step/) });
  });
});

// Independent audit cases O1–O6 (2026-11-21), ported to the current data model: the plain
// "SIGNED OFF" status and signedOffBy/signedOffOn fields no longer exist (version 1 files use them).
describe('audit O1–O6: job-card sign-off cannot be forged or granted by a typed name', () => {
  const auditAsset = { id: 'A-1', make: 'TEST', model: 'T1', engine: 'E', controller: 'C', serial: 'S1', ratedKva: 100 };
  const v1Signed = (over: Record<string, unknown> = {}) => ({
    id: 'JC-1', assetId: 'A-1', opened: '2026-11-01', reportedFault: 'f', faultCodes: [], technician: 'Peter',
    status: 'SIGNED OFF', tasks: ['x'], parts: [{ partNo: 'P1', description: 'unverified part', qty: 1, compatibility: null }], labourHours: 1,
    engineHoursAtJob: 100, readings: [], findings: 'ok', completedOn: '2026-11-02', signedOffBy: 'Peter', signedOffOn: '2026-11-02', log: [], ...over,
  });
  const fileWith = (cards: unknown[], extra: Record<string, unknown> = {}) => JSON.stringify({ version: 1, assets: [auditAsset], plans: {}, history: {}, jobCards: cards, ...extra });

  it('O1 import: altered JSON signed off by the technician himself, unverified part, empty log', () => {
    expect(deserialise(fileWith([v1Signed()])).ok).toBe(false);
  });
  it('O2 import: card content changed after sign-off (findings rewritten, no new log entry)', () => {
    const legit = v1Signed({ signedOffBy: 'Supervisor', parts: [], readings: [{ name: 'V', value: 400, unit: 'V' }, { name: 'TEST output voltage', value: 400, unit: 'V', checklistId: 'voltage' }, { name: 'TEST frequency', value: 50, unit: 'Hz', checklistId: 'frequency' }, { name: 'TEST oil pressure', value: 300, unit: 'kPa', checklistId: 'oilPressure' }, { name: 'TEST coolant temperature', value: 80, unit: '°C', checklistId: 'coolantTemp' }], log: [{ at: '2026-11-02', from: 'COMPLETED', to: 'SIGNED OFF', by: 'Supervisor' }] });
    const tampered = { ...legit, findings: 'rewritten after sign-off', tasks: ['different work'] };
    expect(deserialise(fileWith([tampered])).ok).toBe(false);
    // and the same attack on a current (version 2) file with a real sign-off hash
    const j = exported(signed());
    j.jobCards[0].findings = 'rewritten after sign-off'; j.jobCards[0].tasks = ['different work'];
    expect(deserialise(JSON.stringify(j)).ok).toBe(false);
  });
  it('O3 localStorage: the same forged state written to storage does not load as signed off', () => {
    const store = { getItem: (k: string) => (k === STORE_KEY ? fileWith([v1Signed()]) : null), setItem: () => {} };
    const { state } = loadState(store);
    expect(state.jobCards.some((c) => c.status === SIGNOFF || (c.status as string) === 'SIGNED OFF')).toBe(false);
  });
  it('O4 import: service history with no job card behind it', () => {
    const r = deserialise(fileWith([], { history: { 'A-1': [{ date: '2026-11-01', engineHours: 500, taskIds: ['T1'], jobCardId: 'JC-404', technician: 'nobody' }] } }));
    expect(r.ok).toBe(false);
  });
  it('O5 workflow: technician signs off his own card by changing the case of his name', () => {
    let c = openJobCard({ id: 'JC-2', assetId: 'A-1', opened: '2026-11-01', reportedFault: 'f', technician: 'Peter' });
    c = transition(c, 'IN PROGRESS', 'Peter', '2026-11-01');
    c = transition(c, 'COMPLETED', 'Peter', '2026-11-01', { tasks: ['x'], findings: 'ok', engineHoursAtJob: 1, readings: [{ name: 'V', value: 400, unit: 'V' }, { name: 'TEST output voltage', value: 400, unit: 'V', checklistId: 'voltage' }, { name: 'TEST frequency', value: 50, unit: 'Hz', checklistId: 'frequency' }, { name: 'TEST oil pressure', value: 300, unit: 'kPa', checklistId: 'oilPressure' }, { name: 'TEST coolant temperature', value: 80, unit: '°C', checklistId: 'coolantTemp' }] });
    expect(() => transition(c, SIGNOFF, 'peter', '2026-11-02')).toThrow(/supervisor other than the technician/);
    expect(() => transition(c, SIGNOFF, ' PETER ', '2026-11-02')).toThrow(/supervisor other than the technician/);
  });
  it('O6 workflow: with no accounts, a typed sign-off is never a sign-off/approval — only "NOT VERIFIED (typed name)"', () => {
    let s0 = apply({ ...emptyState(), assets: [auditAsset] }, { type: 'openCard', card: { assetId: 'A-1', opened: '2026-11-01', reportedFault: 'f', technician: 'Peter' } }).state;
    const id = s0.jobCards[0].id;
    s0 = apply(s0, { type: 'transition', cardId: id, to: 'IN PROGRESS', by: 'Peter', at: '2026-11-01' }).state;
    s0 = apply(s0, { type: 'transition', cardId: id, to: 'COMPLETED', by: 'Peter', at: '2026-11-01', update: { tasks: ['x'], findings: 'ok', engineHoursAtJob: 1, readings: [{ name: 'V', value: 400, unit: 'V' }, { name: 'TEST output voltage', value: 400, unit: 'V', checklistId: 'voltage' }, { name: 'TEST frequency', value: 50, unit: 'Hz', checklistId: 'frequency' }, { name: 'TEST oil pressure', value: 300, unit: 'kPa', checklistId: 'oilPressure' }, { name: 'TEST coolant temperature', value: 80, unit: '°C', checklistId: 'coolantTemp' }] } }).state;
    // the old status name is not a step at all
    const old = apply(s0, { type: 'transition', cardId: id, to: 'SIGNED OFF' as never, by: 'Made Up Supervisor', at: '2026-11-02' });
    expect(old.error).toMatch(/cannot go from COMPLETED to SIGNED OFF/);
    const r = apply(s0, { type: 'transition', cardId: id, to: SIGNOFF, by: 'Made Up Supervisor', at: '2026-11-02' });
    expect(r.state.jobCards[0].status).not.toBe('SIGNED OFF');
    expect(r.state.jobCards[0].status).toBe('SIGN-OFF RECORDED — NOT VERIFIED (typed name)');
    const out = serialise(r.state);
    expect(out).not.toMatch(/"signedOffBy": "Made Up Supervisor"/);
    expect(out).not.toMatch(/\bSIGNED OFF\b|approv|"verified"/i);
    expect(out).toContain(TYPED_SIGNOFF_NOTICE);
  });
});
