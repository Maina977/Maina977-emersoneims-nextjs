/**
 * Generator Oracle: state for the Service & Job Cards screen (P1, 2026-11-20).
 *
 * Pure functions only. Every rule about plans, due status and job cards stays in
 * ./maintenance (the engine); this module just keeps assets, plans, history and
 * job cards together, applies actions, and reads/writes the saved JSON.
 * Errors are the engine's own messages, passed through unchanged.
 */
import {
  dueList, openJobCard, transition, toServiceRecord, validatePlan, JOB_STATUSES,
  type Asset, type DueItem, type JobCard, type JobStatus, type ManualRef, type PartLine, type PlanTask, type Reading, type ServiceRecord,
} from './maintenance';

export const STORE_KEY = 'eims-oracle-service-v1';
export const STORE_VERSION = 1;

export interface ServiceState {
  version: 1;
  assets: Asset[];
  plans: Record<string, PlanTask[]>;
  history: Record<string, ServiceRecord[]>;
  jobCards: JobCard[];
}

export const emptyState = (): ServiceState => ({ version: 1, assets: [], plans: {}, history: {}, jobCards: [] });

export type CardUpdate = Partial<Pick<JobCard, 'tasks' | 'parts' | 'labourHours' | 'engineHoursAtJob' | 'readings' | 'findings'>>;

export type ServiceAction =
  | { type: 'saveAsset'; asset: Omit<Asset, 'id'> & { id?: string } }
  | { type: 'removeAsset'; assetId: string }
  | { type: 'addTask'; assetId: string; task: Omit<PlanTask, 'id'> & { id?: string } }
  | { type: 'removeTask'; assetId: string; taskId: string }
  | { type: 'openCard'; card: { assetId: string; opened: string; reportedFault: string; faultCodes?: string[]; technician: string; id?: string } }
  | { type: 'updateCard'; cardId: string; update: CardUpdate }
  | { type: 'transition'; cardId: string; to: JobStatus; by: string; at: string; note?: string; update?: CardUpdate }
  | { type: 'recordService'; cardId: string; planTaskIds: string[] };

/** Next free id like "JC-3" for a prefix. */
export function nextId(prefix: string, existing: string[]): string {
  let n = 0;
  for (const id of existing) {
    if (!id.startsWith(`${prefix}-`)) continue;
    const k = Number(id.slice(prefix.length + 1));
    if (Number.isInteger(k) && k > n) n = k;
  }
  return `${prefix}-${n + 1}`;
}

const EDITABLE: JobStatus[] = ['OPEN', 'IN PROGRESS', 'AWAITING PARTS'];
export const isEditable = (c: JobCard) => EDITABLE.includes(c.status);

function findCard(s: ServiceState, id: string): JobCard {
  const c = s.jobCards.find((x) => x.id === id);
  if (!c) throw new Error(`Job card ${id} not found`);
  return c;
}
function findAsset(s: ServiceState, id: string): Asset {
  const a = s.assets.find((x) => x.id === id);
  if (!a) throw new Error(`Asset ${id} not found`);
  return a;
}

function checkUpdate(u: CardUpdate): CardUpdate {
  const out: CardUpdate = { ...u };
  if (u.tasks) out.tasks = u.tasks.map((t) => t.trim()).filter(Boolean);
  if (u.findings !== undefined) out.findings = u.findings.trim();
  if (u.labourHours !== undefined && !(Number.isFinite(u.labourHours) && u.labourHours >= 0)) throw new Error('Labour hours must be a number of 0 or more');
  if (u.engineHoursAtJob !== undefined && u.engineHoursAtJob !== null && !(Number.isFinite(u.engineHoursAtJob) && u.engineHoursAtJob >= 0)) throw new Error('Engine hours must be a number of 0 or more');
  if (u.parts) {
    out.parts = u.parts.map((p): PartLine => {
      const partNo = p.partNo.trim();
      if (!partNo) throw new Error('Each part needs a part number');
      if (!(Number.isFinite(p.qty) && p.qty > 0)) throw new Error(`Part ${partNo}: quantity must be more than 0`);
      let compatibility: ManualRef | null = null;
      if (p.compatibility) {
        const c = { document: p.compatibility.document.trim(), edition: p.compatibility.edition.trim(), page: p.compatibility.page.trim() };
        const filled = [c.document, c.edition, c.page].filter(Boolean).length;
        if (filled > 0 && filled < 3) throw new Error(`Part ${partNo}: give the parts book document, edition and page, or leave all three empty (compatibility unverified)`);
        compatibility = filled === 3 ? c : null;
      }
      return { partNo, description: p.description.trim(), qty: p.qty, compatibility };
    });
  }
  if (u.readings) {
    out.readings = u.readings.map((r): Reading => {
      const name = r.name.trim();
      if (!name) throw new Error('Each test reading needs a name');
      if (!Number.isFinite(r.value)) throw new Error(`${name}: enter the measured value`);
      if (!r.unit.trim()) throw new Error(`${name}: enter the unit`);
      const x: Reading = { name, value: r.value, unit: r.unit.trim() };
      if (r.min !== undefined) { if (!Number.isFinite(r.min)) throw new Error(`${name}: minimum is not a number`); x.min = r.min; }
      if (r.max !== undefined) { if (!Number.isFinite(r.max)) throw new Error(`${name}: maximum is not a number`); x.max = r.max; }
      if (r.limitSource?.trim()) x.limitSource = r.limitSource.trim();
      return x;
    });
  }
  return out;
}

const replaceCard = (s: ServiceState, c: JobCard): ServiceState => ({ ...s, jobCards: s.jobCards.map((x) => (x.id === c.id ? c : x)) });

/** Apply one action. Throws with the engine's (or this module's) message when refused. */
export function reduce(s: ServiceState, a: ServiceAction): ServiceState {
  switch (a.type) {
    case 'saveAsset': {
      const x = a.asset;
      const asset: Asset = {
        id: x.id?.trim() || nextId('A', s.assets.map((v) => v.id)),
        make: x.make.trim(), model: x.model.trim(), engine: x.engine.trim(), controller: x.controller.trim(), serial: x.serial.trim(), ratedKva: x.ratedKva,
      };
      if (!asset.make || !asset.model || !asset.serial) throw new Error('Asset needs make, model and serial number');
      if (!(Number.isFinite(asset.ratedKva) && asset.ratedKva > 0)) throw new Error('Rated kVA must be a number above 0 (from the rating plate)');
      const exists = s.assets.some((v) => v.id === asset.id);
      return { ...s, assets: exists ? s.assets.map((v) => (v.id === asset.id ? asset : v)) : [...s.assets, asset] };
    }
    case 'removeAsset': {
      findAsset(s, a.assetId);
      if (s.jobCards.some((c) => c.assetId === a.assetId)) throw new Error('This asset has job cards; it cannot be removed');
      const plans = { ...s.plans }; delete plans[a.assetId];
      const history = { ...s.history }; delete history[a.assetId];
      return { ...s, assets: s.assets.filter((v) => v.id !== a.assetId), plans, history };
    }
    case 'addTask': {
      findAsset(s, a.assetId);
      const plan = s.plans[a.assetId] ?? [];
      const t = a.task;
      const task: PlanTask = {
        id: t.id?.trim() || nextId('T', plan.map((p) => p.id)),
        task: t.task.trim(),
        source: { document: t.source?.document?.trim() ?? '', edition: t.source?.edition?.trim() ?? '', page: t.source?.page?.trim() ?? '' },
      };
      if (t.intervalHours !== undefined) task.intervalHours = t.intervalHours;
      if (t.intervalMonths !== undefined) task.intervalMonths = t.intervalMonths;
      if (!task.task) throw new Error('Describe the task');
      const next = [...plan, task];
      validatePlan(next); // engine messages: manual reference, interval, repeated id
      return { ...s, plans: { ...s.plans, [a.assetId]: next } };
    }
    case 'removeTask': {
      const plan = s.plans[a.assetId] ?? [];
      return { ...s, plans: { ...s.plans, [a.assetId]: plan.filter((t) => t.id !== a.taskId) } };
    }
    case 'openCard': {
      findAsset(s, a.card.assetId);
      const id = a.card.id?.trim() || nextId('JC', s.jobCards.map((c) => c.id));
      if (s.jobCards.some((c) => c.id === id)) throw new Error(`Job card ${id} already exists`);
      const card = openJobCard({
        ...a.card, id, technician: a.card.technician.trim(),
        faultCodes: (a.card.faultCodes ?? []).map((f) => f.trim()).filter(Boolean),
      });
      return { ...s, jobCards: [...s.jobCards, card] };
    }
    case 'updateCard': {
      const c = findCard(s, a.cardId);
      if (!isEditable(c)) throw new Error(`A ${c.status} job card cannot be edited${c.status === 'COMPLETED' ? '; move it back to IN PROGRESS first' : ''}`);
      return replaceCard(s, { ...c, ...checkUpdate(a.update) });
    }
    case 'transition': {
      const c = findCard(s, a.cardId);
      const update = a.update && isEditable(c) ? checkUpdate(a.update) : {};
      return replaceCard(s, transition(c, a.to, a.by.trim(), a.at, update, a.note?.trim() || undefined));
    }
    case 'recordService': {
      const c = findCard(s, a.cardId);
      const hist = s.history[c.assetId] ?? [];
      if (hist.some((r) => r.jobCardId === c.id)) throw new Error(`Job card ${c.id} is already in the service history`);
      const plan = s.plans[c.assetId] ?? [];
      if (!a.planTaskIds.length) throw new Error('Tick at least one plan task this job covered');
      for (const id of a.planTaskIds) if (!plan.some((t) => t.id === id)) throw new Error(`Plan task ${id} is not in this asset's plan`);
      const rec = toServiceRecord(c, a.planTaskIds);
      const next = [...hist, rec];
      // Let the engine check the history is consistent (hours and dates rise together).
      const latest = next.reduce((m, r) => (r.engineHours > m.engineHours ? r : m), next[0]);
      const latestDate = next.reduce((m, r) => (Date.parse(r.date) > Date.parse(m) ? r.date : m), next[0].date);
      dueList(plan, next, { date: latestDate, engineHours: latest.engineHours }, { hours: 0, days: 0 });
      return { ...s, history: { ...s.history, [c.assetId]: next } };
    }
  }
}

/** reduce() without throwing, for the UI. */
export function apply(s: ServiceState, a: ServiceAction): { state: ServiceState; error: string | null } {
  try { return { state: reduce(s, a), error: null }; } catch (e) { return { state: s, error: e instanceof Error ? e.message : String(e) }; }
}

export function dueFor(s: ServiceState, assetId: string, now: { date: string; engineHours: number }, soon: { hours: number; days: number }): { items: DueItem[]; error: string | null } {
  try { return { items: dueList(s.plans[assetId] ?? [], s.history[assetId] ?? [], now, soon), error: null }; } catch (e) { return { items: [], error: e instanceof Error ? e.message : String(e) }; }
}

// ------------------------------------------------------------ save / load
export function serialise(s: ServiceState): string {
  return JSON.stringify({ ...s, version: STORE_VERSION }, null, 2);
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string';
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const optNum = (v: unknown) => v === undefined || isNum(v);
const isRef = (v: unknown) => isObj(v) && isStr(v.document) && isStr(v.edition) && isStr(v.page);

function checkShape(d: unknown): string | null {
  if (!isObj(d)) return 'not a JSON object';
  if (d.version !== STORE_VERSION) return `unsupported version ${String(d.version)} (expected ${STORE_VERSION})`;
  if (!Array.isArray(d.assets) || !isObj(d.plans) || !isObj(d.history) || !Array.isArray(d.jobCards)) return 'missing assets, plans, history or jobCards';
  const ids = new Set<string>();
  for (const a of d.assets) {
    if (!isObj(a) || !['id', 'make', 'model', 'engine', 'controller', 'serial'].every((k) => isStr(a[k])) || !isNum(a.ratedKva)) return 'an asset is malformed';
    if (ids.has(a.id as string)) return `asset ${String(a.id)} repeated`;
    ids.add(a.id as string);
  }
  for (const [k, plan] of Object.entries(d.plans)) {
    if (!ids.has(k)) return `plan for unknown asset ${k}`;
    if (!Array.isArray(plan)) return `plan for ${k} is not a list`;
    for (const t of plan) if (!isObj(t) || !isStr(t.id) || !isStr(t.task) || !optNum(t.intervalHours) || !optNum(t.intervalMonths) || !isRef(t.source)) return `a plan task for ${k} is malformed`;
    try { validatePlan(plan as PlanTask[]); } catch (e) { return (e as Error).message; }
  }
  for (const [k, hist] of Object.entries(d.history)) {
    if (!ids.has(k)) return `history for unknown asset ${k}`;
    if (!Array.isArray(hist)) return `history for ${k} is not a list`;
    for (const r of hist) if (!isObj(r) || !isStr(r.date) || Number.isNaN(Date.parse(r.date)) || !isNum(r.engineHours) || !Array.isArray(r.taskIds) || !r.taskIds.every(isStr) || !isStr(r.jobCardId) || !isStr(r.technician)) return `a service record for ${k} is malformed`;
  }
  const cardIds = new Set<string>();
  for (const c of d.jobCards) {
    if (!isObj(c)) return 'a job card is malformed';
    const id = String(c.id);
    if (!isStr(c.id) || !isStr(c.assetId) || !isStr(c.opened) || !isStr(c.reportedFault) || !isStr(c.technician) || !isStr(c.findings)) return `job card ${id} is malformed`;
    if (cardIds.has(c.id)) return `job card ${id} repeated`;
    cardIds.add(c.id);
    if (!ids.has(c.assetId)) return `job card ${id} refers to unknown asset ${c.assetId}`;
    if (!JOB_STATUSES.includes(c.status as JobStatus)) return `job card ${id} has unknown status`;
    if (!Array.isArray(c.faultCodes) || !c.faultCodes.every(isStr) || !Array.isArray(c.tasks) || !c.tasks.every(isStr)) return `job card ${id} is malformed`;
    if (!isNum(c.labourHours) || !(c.engineHoursAtJob === null || isNum(c.engineHoursAtJob))) return `job card ${id} hours are malformed`;
    if (!Array.isArray(c.parts) || !c.parts.every((p) => isObj(p) && isStr(p.partNo) && isStr(p.description) && isNum(p.qty) && (p.compatibility === null || isRef(p.compatibility)))) return `job card ${id} parts are malformed`;
    if (!Array.isArray(c.readings) || !c.readings.every((r) => isObj(r) && isStr(r.name) && isNum(r.value) && isStr(r.unit) && optNum(r.min) && optNum(r.max) && (r.limitSource === undefined || isStr(r.limitSource)))) return `job card ${id} readings are malformed`;
    for (const k of ['completedOn', 'signedOffBy', 'signedOffOn']) if (!(c[k] === null || isStr(c[k]))) return `job card ${id} is malformed`;
    if (!Array.isArray(c.log) || !c.log.every((l) => isObj(l) && isStr(l.at) && isStr(l.by) && JOB_STATUSES.includes(l.from as JobStatus) && JOB_STATUSES.includes(l.to as JobStatus) && (l.note === undefined || isStr(l.note)))) return `job card ${id} log is malformed`;
  }
  return null;
}

/** Parse saved or imported JSON. Never throws. */
export function deserialise(text: string): { ok: true; state: ServiceState } | { ok: false; error: string } {
  let d: unknown;
  try { d = JSON.parse(text); } catch { return { ok: false, error: 'Not a valid JSON file' }; }
  const problem = checkShape(d);
  if (problem) return { ok: false, error: `Not a Generator Oracle service file: ${problem}` };
  const o = d as ServiceState;
  return { ok: true, state: { version: 1, assets: o.assets, plans: o.plans, history: o.history, jobCards: o.jobCards } };
}

/** Minimal Storage interface so tests can pass a stub. */
export interface KeyValueStore { getItem(k: string): string | null; setItem(k: string, v: string): void }

export function loadState(store: KeyValueStore | null | undefined): { state: ServiceState; error: string | null } {
  try {
    const raw = store?.getItem(STORE_KEY);
    if (!raw) return { state: emptyState(), error: null };
    const r = deserialise(raw);
    return r.ok ? { state: r.state, error: null } : { state: emptyState(), error: `Saved data could not be read (${r.error}); starting empty` };
  } catch {
    return { state: emptyState(), error: 'Browser storage is not available; nothing will be saved' };
  }
}

export function saveState(store: KeyValueStore | null | undefined, s: ServiceState): string | null {
  try {
    if (!store) return 'Browser storage is not available; nothing will be saved';
    store.setItem(STORE_KEY, serialise(s));
    return null;
  } catch {
    return 'Could not save in this browser (storage full or blocked)';
  }
}
