import { describe, it, expect } from 'vitest';
import { reduce, apply, dueFor, emptyState, serialise, deserialise, loadState, saveState, nextId, STORE_KEY, type ServiceState, type ServiceAction } from '@/lib/generator-oracle/service/store';

// TEST values and TEST manual references only — never real OEM intervals.
const ref = { document: 'TEST O&M manual', edition: 'TEST ed. 1', page: '42' };
const run = (s: ServiceState, ...acts: ServiceAction[]) => acts.reduce(reduce, s);
const withAsset = () => run(emptyState(), { type: 'saveAsset', asset: { make: 'TEST', model: 'T-100', engine: 'TEST-ENG', controller: 'TEST-CTRL', serial: 'S-1', ratedKva: 100 } });
const withPlan = () => run(withAsset(), { type: 'addTask', assetId: 'A-1', task: { task: 'TEST oil and filter', intervalHours: 250, source: ref } });
const signedCard = () => run(withPlan(),
  { type: 'openCard', card: { assetId: 'A-1', opened: '2026-11-20', reportedFault: 'TEST fault', faultCodes: ['TEST-1', ' '], technician: ' TECH-A ' } },
  { type: 'transition', cardId: 'JC-1', to: 'IN PROGRESS', by: 'TECH-A', at: '2026-11-20T08:00' },
  { type: 'transition', cardId: 'JC-1', to: 'COMPLETED', by: 'TECH-A', at: '2026-11-20T12:00', update: {
    findings: 'TEST findings', tasks: ['TEST work', ''], engineHoursAtJob: 1500, labourHours: 2,
    parts: [{ partNo: 'TEST-123', description: 'TEST part', qty: 1, compatibility: { document: 'TEST parts book', edition: 'TEST ed.', page: '7' } }],
    readings: [{ name: 'TEST voltage', value: 405, unit: 'V', min: 380, max: 420, limitSource: 'TEST rating plate' }],
  } },
  { type: 'transition', cardId: 'JC-1', to: 'SIGNED OFF', by: 'SUPERVISOR-B', at: '2026-11-20T13:00' },
);

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
    expect(s.jobCards[0]).toMatchObject({ id: 'JC-1', status: 'OPEN' });
    expect(apply(s, { type: 'transition', cardId: 'JC-1', to: 'COMPLETED', by: 'TECH-A', at: '2026-11-20T09:00' }).error).toBe('A job card cannot go from OPEN to COMPLETED');
    expect(apply(s, { type: 'transition', cardId: 'JC-1', to: 'IN PROGRESS', by: '', at: '2026-11-20T09:00' }).error).toBe('Who and when are required for every status change');
    expect(apply(s, { type: 'openCard', card: { assetId: 'NOPE', opened: '2026-11-20', reportedFault: 'x', technician: 'x' } }).error).toMatch(/Asset NOPE not found/);
  });
  it('sign-off by the technician is refused; a half-filled parts reference is refused', () => {
    const s = run(withPlan(),
      { type: 'openCard', card: { assetId: 'A-1', opened: '2026-11-20', reportedFault: 'TEST fault', technician: 'TECH-A' } },
      { type: 'transition', cardId: 'JC-1', to: 'IN PROGRESS', by: 'TECH-A', at: '2026-11-20T08:00' });
    expect(apply(s, { type: 'updateCard', cardId: 'JC-1', update: { parts: [{ partNo: 'TEST-1', description: '', qty: 1, compatibility: { document: 'TEST', edition: '', page: '' } }] } }).error).toMatch(/or leave all three empty/);
    const unverified = reduce(s, { type: 'updateCard', cardId: 'JC-1', update: { parts: [{ partNo: 'TEST-1', description: '', qty: 1, compatibility: { document: '', edition: '', page: '' } }] } });
    expect(unverified.jobCards[0].parts[0].compatibility).toBeNull();
    const done = reduce(s, { type: 'transition', cardId: 'JC-1', to: 'COMPLETED', by: 'TECH-A', at: '2026-11-20T12:00', update: { findings: 'f', tasks: ['w'], engineHoursAtJob: 10, readings: [{ name: 'TEST r', value: 1, unit: 'V' }] } });
    expect(apply(done, { type: 'transition', cardId: 'JC-1', to: 'SIGNED OFF', by: 'TECH-A', at: '2026-11-20T13:00' }).error).toBe('Sign-off must be by a supervisor other than the technician');
    expect(apply(done, { type: 'updateCard', cardId: 'JC-1', update: { findings: '' } }).error).toMatch(/move it back to IN PROGRESS/);
  });
  it('a signed-off card becomes service history and updates the due list', () => {
    const s = signedCard();
    expect(s.jobCards[0]).toMatchObject({ status: 'SIGNED OFF', technician: 'TECH-A', faultCodes: ['TEST-1'], tasks: ['TEST work'] });
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
    expect(apply(s, { type: 'recordService', cardId: 'JC-1', planTaskIds: ['T-1'] }).error).toBe('Only a signed-off job card becomes service history');
  });
});

describe('service store: save, load, import', () => {
  it('round-trips through JSON and storage', () => {
    const s = reduce(signedCard(), { type: 'recordService', cardId: 'JC-1', planTaskIds: ['T-1'] });
    const r = deserialise(serialise(s));
    expect(r.ok && r.state).toEqual(s);
    const mem = new Map<string, string>();
    const store = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v) };
    expect(saveState(store, s)).toBeNull();
    expect(mem.has(STORE_KEY)).toBe(true);
    expect(loadState(store)).toEqual({ state: s, error: null });
  });
  it('rejects bad files with a message', () => {
    expect(deserialise('{not json')).toEqual({ ok: false, error: 'Not a valid JSON file' });
    expect(deserialise('[]')).toMatchObject({ ok: false, error: expect.stringMatching(/not a JSON object/) });
    expect(deserialise(JSON.stringify({ version: 2, assets: [], plans: {}, history: {}, jobCards: [] }))).toMatchObject({ ok: false, error: expect.stringMatching(/unsupported version 2/) });
    const good = JSON.parse(serialise(withPlan()));
    expect(deserialise(JSON.stringify({ ...good, assets: [{ id: 'A-1', make: 'x' }] }))).toMatchObject({ ok: false });
    const noRef = { ...good, plans: { 'A-1': [{ id: 'T-1', task: 'x', intervalHours: 1, source: { document: '', edition: '', page: '' } }] } };
    expect(deserialise(JSON.stringify(noRef))).toMatchObject({ ok: false, error: expect.stringMatching(/cite the OEM manual/) });
    expect(deserialise(JSON.stringify({ ...good, jobCards: [{ id: 'JC-1', assetId: 'GONE' }] }))).toMatchObject({ ok: false });
  });
  it('storage failures never throw', () => {
    const broken = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('full'); } };
    expect(loadState(broken).error).toMatch(/not available/);
    expect(saveState(broken, emptyState())).toMatch(/Could not save/);
    expect(loadState({ getItem: () => '{bad', setItem: () => {} }).error).toMatch(/could not be read/);
  });
});
