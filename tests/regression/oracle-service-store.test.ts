import { describe, it, expect } from 'vitest';
import {
  reduce, apply, dueFor, emptyState, serialise, deserialise, loadState, saveState, nextId,
  STORE_KEY, BACKUP_KEY, STORE_VERSION, STORE_FORMAT, type ServiceState, type ServiceAction, type KeyValueStore,
} from '@/lib/generator-oracle/service/store';
import { SIGNOFF } from '@/lib/generator-oracle/service/maintenance';

// TEST values and TEST manual references only — never real OEM intervals.
const ref = { document: 'TEST O&M manual', edition: 'TEST ed. 1', page: '42' };
const NOW = '2026-11-21T09:00:00.000Z';
const run = (s: ServiceState, ...acts: ServiceAction[]) => acts.reduce(reduce, s);
const withAsset = () => run(emptyState(), { type: 'saveAsset', asset: { make: 'TEST', model: 'T-100', engine: 'TEST-ENG', controller: 'TEST-CTRL', serial: 'S-1', ratedKva: 100 } });
const withPlan = () => run(withAsset(), { type: 'addTask', assetId: 'A-1', task: { task: 'TEST oil and filter', intervalHours: 250, source: ref } });
const signedCard = () => run(withPlan(),
  { type: 'openCard', card: { assetId: 'A-1', opened: '2026-11-20', reportedFault: 'TEST fault', faultCodes: ['TEST-1', ' '], technician: ' TECH-A ' } },
  { type: 'transition', cardId: 'JC-1', to: 'IN PROGRESS', by: 'TECH-A', at: '2026-11-20T08:00' },
  { type: 'transition', cardId: 'JC-1', to: 'COMPLETED', by: 'TECH-A', at: '2026-11-20T12:00', update: {
    findings: 'TEST findings', tasks: ['TEST work', ''], engineHoursAtJob: 1500, labourHours: 2,
    parts: [{ partNo: 'TEST-123', description: 'TEST part', qty: 1, compatibility: { document: 'TEST parts book', edition: 'TEST ed.', page: '7' } }],
    readings: [{ name: 'TEST voltage', value: 405, unit: 'V', min: 380, max: 420, limitSource: 'TEST rating plate', checklistId: 'voltage' }, { name: 'TEST frequency', value: 50, unit: 'Hz', checklistId: 'frequency' }, { name: 'TEST oil pressure', value: 300, unit: 'kPa', checklistId: 'oilPressure' }, { name: 'TEST coolant temperature', value: 80, unit: '°C', checklistId: 'coolantTemp' }],
  } },
  { type: 'transition', cardId: 'JC-1', to: SIGNOFF, by: 'SUPERVISOR-B', at: '2026-11-20T13:00' },
);
/** A full project: asset, plan, a signed card recorded as history, and a second open card. */
const project = () => run(signedCard(),
  { type: 'recordService', cardId: 'JC-1', planTaskIds: ['T-1'] },
  { type: 'openCard', card: { assetId: 'A-1', opened: '2026-11-21', reportedFault: 'TEST second fault', technician: 'TECH-C' } },
);

/** localStorage stand-in. Several instances can share one backing map, like tabs/reloads sharing a browser. */
function memoryStore(mem = new Map<string, string>()): KeyValueStore & { mem: Map<string, string> } {
  return { mem, getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => void mem.set(k, v) };
}

describe('service store: assets and plans', () => {
  it('adds and edits an asset; refuses one without make/model/serial or kVA', () => {
    const s = withAsset();
    expect(s.assets).toHaveLength(1);
    expect(s.assets[0]).toMatchObject({ id: 'A-1', make: 'TEST', ratedKva: 100 });
    const edited = reduce(s, { type: 'saveAsset', asset: { ...s.assets[0], model: 'T-200' } });
    expect(edited.assets).toHaveLength(1);
    expect(edited.assets[0].model).toBe('T-200');
    expect(apply(s, { type: 'saveAsset', asset: { make: '', model: 'x', engine: '', controller: '', serial: 'y', ratedKva: 1 } }).error).toMatch(/make, model and serial/);
    expect(apply(s, { type: 'saveAsset', asset: { make: 'x', model: 'x', engine: '', controller: '', serial: 'y', ratedKva: NaN } }).error).toMatch(/Rated kVA/);
    expect(nextId('A', ['A-1', 'A-7', 'B-9'])).toBe('A-8');
  });
  it('a plan task needs the manual reference and an interval; the engine message is passed through', () => {
    const s = withPlan();
    expect(s.plans['A-1'][0]).toMatchObject({ id: 'T-1', intervalHours: 250, source: ref });
    const noRef = apply(s, { type: 'addTask', assetId: 'A-1', task: { task: 'TEST x', intervalHours: 100, source: { document: 'TEST', edition: '', page: '1' } } });
    expect(noRef.error).toBe('Plan task T-2: cite the OEM manual (document, edition, page)');
    expect(noRef.state).toBe(s);
    const noInterval = apply(s, { type: 'addTask', assetId: 'A-1', task: { task: 'TEST x', source: ref } });
    expect(noInterval.error).toBe('Plan task T-2: give an hours and/or months interval from the manual');
  });
});

describe('service store: job cards', () => {
  it('opens a card and refuses a skipped step with the engine message', () => {
    const s = run(withPlan(), { type: 'openCard', card: { assetId: 'A-1', opened: '2026-11-20', reportedFault: 'TEST fault', technician: 'TECH-A' } });
    expect(s.jobCards[0]).toMatchObject({ id: 'JC-1', status: 'OPEN', revision: 1 });
    expect(apply(s, { type: 'transition', cardId: 'JC-1', to: 'COMPLETED', by: 'TECH-A', at: '2026-11-20T09:00' }).error).toBe('A job card cannot go from OPEN to COMPLETED');
    expect(apply(s, { type: 'transition', cardId: 'JC-1', to: 'IN PROGRESS', by: '', at: '2026-11-20T09:00' }).error).toBe('Who and when are required for every status change');
    expect(apply(s, { type: 'openCard', card: { assetId: 'NOPE', opened: '2026-11-20', reportedFault: 'x', technician: 'x' } }).error).toMatch(/Asset NOPE not found/);
  });
  it('sign-off by the technician is refused (any case); a half-filled parts reference is refused', () => {
    const s = run(withPlan(),
      { type: 'openCard', card: { assetId: 'A-1', opened: '2026-11-20', reportedFault: 'TEST fault', technician: 'TECH-A' } },
      { type: 'transition', cardId: 'JC-1', to: 'IN PROGRESS', by: 'TECH-A', at: '2026-11-20T08:00' });
    expect(apply(s, { type: 'updateCard', cardId: 'JC-1', update: { parts: [{ partNo: 'TEST-1', description: '', qty: 1, compatibility: { document: 'TEST', edition: '', page: '' } }] } }).error).toMatch(/or leave all three empty/);
    const unverified = reduce(s, { type: 'updateCard', cardId: 'JC-1', update: { parts: [{ partNo: 'TEST-1', description: '', qty: 1, compatibility: { document: '', edition: '', page: '' } }] } });
    expect(unverified.jobCards[0].parts[0].compatibility).toBeNull();
    const done = reduce(s, { type: 'transition', cardId: 'JC-1', to: 'COMPLETED', by: 'TECH-A', at: '2026-11-20T12:00', update: { findings: 'f', tasks: ['w'], engineHoursAtJob: 10, readings: [{ name: 'TEST r', value: 1, unit: 'V' }, { name: 'TEST oil pressure', value: 300, unit: 'kPa', checklistId: 'oilPressure' }, { name: 'TEST coolant temperature', value: 80, unit: '°C', checklistId: 'coolantTemp' }, { name: 'TEST output voltage', value: 400, unit: 'V', checklistId: 'voltage' }, { name: 'TEST frequency', value: 50, unit: 'Hz', checklistId: 'frequency' }] } });
    expect(apply(done, { type: 'transition', cardId: 'JC-1', to: SIGNOFF, by: 'TECH-A', at: '2026-11-20T13:00' }).error).toBe('Sign-off must be by a supervisor other than the technician');
    expect(apply(done, { type: 'transition', cardId: 'JC-1', to: SIGNOFF, by: ' tech-a ', at: '2026-11-20T13:00' }).error).toBe('Sign-off must be by a supervisor other than the technician');
    expect(apply(done, { type: 'updateCard', cardId: 'JC-1', update: { findings: '' } }).error).toMatch(/move it back to IN PROGRESS/);
  });
  it('a card with a recorded sign-off becomes service history and updates the due list', () => {
    const s = signedCard();
    expect(s.jobCards[0]).toMatchObject({ status: SIGNOFF, technician: 'TECH-A', faultCodes: ['TEST-1'], tasks: ['TEST work'] });
    expect(dueFor(s, 'A-1', { date: '2026-11-21', engineHours: 1510 }, { hours: 10, days: 0 }).items[0].status).toBe('DUE (NO HISTORY)');
    expect(apply(s, { type: 'recordService', cardId: 'JC-1', planTaskIds: [] }).error).toMatch(/Tick at least one/);
    const h = reduce(s, { type: 'recordService', cardId: 'JC-1', planTaskIds: ['T-1'] });
    expect(h.history['A-1']).toEqual([{ date: '2026-11-20', engineHours: 1500, taskIds: ['T-1'], jobCardId: 'JC-1', technician: 'TECH-A' }]);
    const due = dueFor(h, 'A-1', { date: '2026-11-21', engineHours: 1745 }, { hours: 10, days: 0 }).items[0];
    expect(due).toMatchObject({ status: 'DUE SOON', nextDueHours: 1750 });
    expect(apply(h, { type: 'recordService', cardId: 'JC-1', planTaskIds: ['T-1'] }).error).toMatch(/already in the service history/);
    expect(dueFor(h, 'A-1', { date: '2026-11-21', engineHours: 100 }, { hours: 0, days: 0 }).error).toMatch(/hour meter/);
  });
  it('an open card cannot become service history', () => {
    const s = run(withPlan(), { type: 'openCard', card: { assetId: 'A-1', opened: '2026-11-20', reportedFault: 'x', technician: 'T' } });
    expect(apply(s, { type: 'recordService', cardId: 'JC-1', planTaskIds: ['T-1'] }).error).toBe(`Only a job card at ${SIGNOFF} becomes service history`);
  });
});

describe('saved-project workflow: storage', () => {
  it('save, then reload in a new store instance over the same storage: identical data', () => {
    const s = project();
    const mem = new Map<string, string>();
    expect(saveState(memoryStore(mem), s)).toBeNull();
    expect(mem.has(STORE_KEY)).toBe(true);
    const reloaded = loadState(memoryStore(mem), NOW);
    expect(reloaded).toEqual({ state: s, error: null, notice: null, protectSaved: false });
    // and again: save the reloaded state, reload once more, still identical
    expect(saveState(memoryStore(mem), reloaded.state)).toBeNull();
    expect(loadState(memoryStore(mem), NOW).state).toEqual(s);
  });
  it('empty storage starts empty without an error', () => {
    expect(loadState(memoryStore(), NOW)).toEqual({ state: emptyState(), error: null, notice: null, protectSaved: false });
  });
  it('storage that is missing, blocked or full gives a message and never throws', () => {
    expect(loadState(null, NOW).error).toMatch(/not available/);
    expect(saveState(null, emptyState())).toMatch(/not available/);
    const blocked: KeyValueStore = { getItem: () => { throw new DOMException('denied', 'SecurityError'); }, setItem: () => { throw new DOMException('denied', 'SecurityError'); } };
    expect(() => loadState(blocked, NOW)).not.toThrow();
    expect(loadState(blocked, NOW)).toMatchObject({ state: emptyState(), error: expect.stringMatching(/not available/) });
    expect(saveState(blocked, project())).toMatch(/storage is blocked/);
    const full: KeyValueStore = { getItem: () => null, setItem: () => { throw new DOMException('quota', 'QuotaExceededError'); } };
    expect(() => saveState(full, project())).not.toThrow();
    expect(saveState(full, project())).toMatch(/storage is full.*Export JSON/);
  });
  it('unreadable saved data is backed up before starting empty (never silently overwritten)', () => {
    const st = memoryStore();
    st.mem.set(STORE_KEY, '{bad');
    const r = loadState(st, NOW);
    expect(r.state).toEqual(emptyState());
    expect(r.error).toMatch(/could not be read/);
    expect(st.mem.get(`${BACKUP_KEY}:${NOW}`)).toBe('{bad');
    expect(r.protectSaved).toBe(false);
    // backup impossible (storage full): keep the data in place and say so
    const noRoom: KeyValueStore = { getItem: () => '{bad', setItem: () => { throw new DOMException('quota', 'QuotaExceededError'); } };
    expect(loadState(noRoom, NOW)).toMatchObject({ protectSaved: true, error: expect.stringMatching(/could not be backed up/) });
  });
});

describe('saved-project workflow: export / import JSON', () => {
  it('export then import is a round trip with identical data', () => {
    const s = project();
    const text = serialise(s);
    const json = JSON.parse(text);
    expect(json).toMatchObject({ format: STORE_FORMAT, version: STORE_VERSION });
    expect(json.notice).toMatch(/not an authenticated signature/);
    const r = deserialise(text);
    expect(r).toEqual({ ok: true, state: s, notice: null });
    if (r.ok) expect(serialise(r.state)).toBe(text);
  });
  it('a corrupted or foreign file is rejected with a message', () => {
    const good = JSON.parse(serialise(project()));
    expect(deserialise('{not json')).toEqual({ ok: false, error: 'Not a valid JSON file' });
    expect(deserialise(serialise(project()).slice(0, 200))).toEqual({ ok: false, error: 'Not a valid JSON file' });
    expect(deserialise('[]')).toMatchObject({ ok: false, error: expect.stringMatching(/not a JSON object/) });
    expect(deserialise('"text"')).toMatchObject({ ok: false, error: expect.stringMatching(/not a JSON object/) });
    expect(deserialise(JSON.stringify({ name: 'TEST solar project', panels: [] }))).toMatchObject({ ok: false, error: expect.stringMatching(/no version number/) });
    expect(deserialise(JSON.stringify({ ...good, format: 'eims-solar-project' }))).toMatchObject({ ok: false, error: expect.stringMatching(/different kind of file/) });
    expect(deserialise(JSON.stringify({ ...good, format: undefined }))).toMatchObject({ ok: false, error: expect.stringMatching(/no format marker/) });
    expect(deserialise(JSON.stringify({ ...good, assets: [{ id: 'A-1', make: 'x' }] }))).toMatchObject({ ok: false, error: expect.stringMatching(/asset is malformed/) });
    const noRef = { ...good, plans: { 'A-1': [{ id: 'T-1', task: 'x', intervalHours: 1, source: { document: '', edition: '', page: '' } }] } };
    expect(deserialise(JSON.stringify(noRef))).toMatchObject({ ok: false, error: expect.stringMatching(/cite the OEM manual/) });
    expect(deserialise(JSON.stringify({ ...good, jobCards: [{ id: 'JC-1', assetId: 'GONE' }] }))).toMatchObject({ ok: false });
    const badStatus = { ...good, jobCards: [{ ...good.jobCards[1], status: 'APPROVED' }] };
    expect(deserialise(JSON.stringify(badStatus))).toMatchObject({ ok: false, error: expect.stringMatching(/unknown status "APPROVED"/) });
  });
  it('schema versions: an older version is upgraded with a message; an unknown one is refused clearly', () => {
    const good = JSON.parse(serialise(project()));
    for (const v of [3, 99, 0, '2', null]) {
      const r = deserialise(JSON.stringify({ ...good, version: v }));
      expect(r).toMatchObject({ ok: false, error: expect.stringMatching(/does not know \(it reads versions 1 and 2\)/) });
    }
    // version 1 (first release): no format marker, plain status names, signedOffBy/On
    const v1 = {
      version: 1, assets: good.assets, plans: good.plans, history: {},
      jobCards: [{
        id: 'JC-1', assetId: 'A-1', opened: '2026-11-20', reportedFault: 'TEST fault', faultCodes: [], technician: 'TECH-A', status: 'IN PROGRESS',
        tasks: [], parts: [], labourHours: 0, engineHoursAtJob: null, readings: [], findings: '', completedOn: null, signedOffBy: null, signedOffOn: null,
        log: [{ at: '2026-11-20T08:00', from: 'OPEN', to: 'IN PROGRESS', by: 'TECH-A' }],
      }],
    };
    const r = deserialise(JSON.stringify(v1));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.notice).toMatch(/saved by version 1 .* upgraded to version 2/);
    expect(r.state.version).toBe(2);
    expect(r.state.jobCards[0]).toMatchObject({ status: 'IN PROGRESS', revision: 1, signOffTypedName: null, signOffHash: null });
    expect(r.state.jobCards[0]).not.toHaveProperty('signedOffBy');
  });
});
