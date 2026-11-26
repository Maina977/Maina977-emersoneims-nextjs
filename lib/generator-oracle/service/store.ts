/**
 * Generator Oracle: state for the Service & Job Cards screen (P1, 2026-11-20).
 *
 * Pure functions only. Every rule about plans, due status and job cards stays in
 * ./maintenance (the engine); this module just keeps assets, plans, history and
 * job cards together, applies actions, and reads/writes the saved JSON.
 * Errors are the engine's own messages, passed through unchanged.
 */
import {
  cardIntegrityProblems, dueList, mergeGuidedSafety, recordHoldReassessment, openJobCard, reopenJobCard, transition, toServiceRecord, validatePlan, voidUncheckedSignOff,
  JOB_STATUSES, SIGNOFF, TYPED_SIGNOFF_NOTICE, V1_UNCHECKED_SIGNOFF_NOTE,
  type Asset, type DueItem, type GuidedSafetyAdd, type JobCard, type JobStatus, type ManualRef, type PartLine, type PlanTask, type Reading, type ServiceRecord,
} from './maintenance';

/** Storage key is unchanged since version 1 so existing saved data is found and upgraded. */
export const STORE_KEY = 'eims-oracle-service-v1';
/** Where unreadable saved data is copied before this screen starts empty, so it is never overwritten. */
export const BACKUP_KEY = 'eims-oracle-service-unreadable-backup';
/** Where version-1 saved data is copied before it is upgraded and saved as version 2. */
export const V1_BACKUP_KEY = 'eims-oracle-service-v1-original';
/** 1 = first release (2026-11-20); 2 = sign-off content hash + reopen (2026-11-21). */
export const STORE_VERSION = 2;
export const STORE_FORMAT = 'eims-oracle-service';

export interface ServiceState {
  version: 2;
  assets: Asset[];
  plans: Record<string, PlanTask[]>;
  history: Record<string, ServiceRecord[]>;
  jobCards: JobCard[];
}

export const emptyState = (): ServiceState => ({ version: 2, assets: [], plans: {}, history: {}, jobCards: [] });

export type CardUpdate = Partial<Pick<JobCard, 'tasks' | 'parts' | 'labourHours' | 'engineHoursAtJob' | 'readings' | 'findings'>>;

export type ServiceAction =
  | { type: 'saveAsset'; asset: Omit<Asset, 'id'> & { id?: string } }
  | { type: 'removeAsset'; assetId: string }
  | { type: 'addTask'; assetId: string; task: Omit<PlanTask, 'id'> & { id?: string } }
  | { type: 'removeTask'; assetId: string; taskId: string }
  | { type: 'openCard'; card: { assetId: string; opened: string; reportedFault: string; faultCodes?: string[]; technician: string; id?: string } }
  | { type: 'updateCard'; cardId: string; update: CardUpdate }
  | { type: 'transition'; cardId: string; to: JobStatus; by: string; at: string; note?: string; update?: CardUpdate }
  | { type: 'reopen'; cardId: string; by: string; at: string; reason: string }
  /** R-INT-2: adds the Guided Diagnosis safety state to the card (merge-only; nothing is removed). */
  | { type: 'recordGuidedSafety'; cardId: string; at: string; safety: GuidedSafetyAdd }
  /** R-INT-7: an in-person reassessment recorded on the card releases its SAFETY HOLD (append-only). */
  | { type: 'recordHoldReassessment'; cardId: string; at: string; by: string; reason: string; confirmed: boolean }
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
  // R-INT-2: the guided safety record is never set or changed through a card edit.
  delete (out as Record<string, unknown>).guidedSafety;
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
      if (!isEditable(c)) throw new Error(`A ${c.status} job card cannot be edited${c.status === 'COMPLETED' ? '; move it back to IN PROGRESS first' : '; reopen it first (who, when and the reason are kept in its history)'}`);
      return replaceCard(s, { ...c, ...checkUpdate(a.update) });
    }
    case 'transition': {
      const c = findCard(s, a.cardId);
      const update = a.update && isEditable(c) ? checkUpdate(a.update) : {};
      return replaceCard(s, transition(c, a.to, a.by.trim(), a.at, update, a.note?.trim() || undefined));
    }
    case 'recordGuidedSafety': {
      const c = findCard(s, a.cardId);
      if (!isEditable(c)) throw new Error(`A ${c.status} job card cannot be edited`);
      if (Number.isNaN(Date.parse(a.at))) throw new Error('When is required to record the guided safety state');
      return replaceCard(s, { ...c, guidedSafety: mergeGuidedSafety(c.guidedSafety, a.safety, a.at) });
    }
    case 'recordHoldReassessment': {
      const c = findCard(s, a.cardId);
      if (!isEditable(c)) throw new Error(`A ${c.status} job card cannot be edited`);
      return replaceCard(s, { ...c, guidedSafety: recordHoldReassessment(c.guidedSafety, a) });
    }
    case 'reopen':
      return replaceCard(s, reopenJobCard(findCard(s, a.cardId), a.by, a.at, a.reason));
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
/** Exported JSON. `notice` is for people reading the file; it is ignored on import. */
export function serialise(s: ServiceState): string {
  const { assets, plans, history, jobCards } = s;
  return JSON.stringify({ format: STORE_FORMAT, version: STORE_VERSION, notice: TYPED_SIGNOFF_NOTICE, assets, plans, history, jobCards }, null, 2);
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string';
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const optNum = (v: unknown) => v === undefined || isNum(v);
const isRef = (v: unknown) => isObj(v) && isStr(v.document) && isStr(v.edition) && isStr(v.page);
const isGStop = (v: unknown) => isObj(v) && isStr(v.key) && isStr(v.from) && isStr(v.since) && isStr(v.message) && (v.label === undefined || isStr(v.label)) && (v.fromRecord === undefined || v.fromRecord === true);
const isGuidedSafety = (v: unknown) => isObj(v) && Array.isArray(v.stops) && v.stops.every(isGStop)
  && Array.isArray(v.clearances) && v.clearances.every((c) => isGStop(c) && isStr((c as Record<string, unknown>).clearedAt) && isStr((c as Record<string, unknown>).by) && isStr((c as Record<string, unknown>).reason))
  && Array.isArray(v.holds) && v.holds.every((h) => isObj(h) && isStr(h.since) && isStr(h.text) && isStr(h.why) && (h.resolvedAt === undefined || isStr(h.resolvedAt)))
  && (v.reassessments === undefined || (Array.isArray(v.reassessments) && v.reassessments.every((r) => isObj(r) && isStr(r.at) && isStr(r.by) && isStr(r.reason) && r.confirmed === true)));
const isHash = (v: unknown) => isStr(v) && /^[0-9a-f]{64}$/.test(v);
const isRev = (v: unknown) => Number.isInteger(v) && (v as number) >= 1;

/** Version 1 (2026-11-20) used the plain status "SIGNED OFF" and signedOffBy/signedOffOn. */
const V1_SIGNED = 'SIGNED OFF';
function upgradeV1(d: Record<string, unknown>): Record<string, unknown> {
  const st = (v: unknown) => (v === V1_SIGNED ? SIGNOFF : v);
  const cards = d.jobCards;
  return {
    ...d, format: STORE_FORMAT, version: 2,
    jobCards: Array.isArray(cards) ? cards.map((c) => {
      if (!isObj(c)) return c;
      const { signedOffBy, signedOffOn, ...rest } = c;
      return {
        ...rest, status: st(c.status), revision: 1, signOffTypedName: signedOffBy ?? null, signOffRecordedOn: signedOffOn ?? null, signOffHash: null,
        log: Array.isArray(c.log) ? c.log.map((l) => (isObj(l) ? { ...l, from: st(l.from), to: st(l.to) } : l)) : c.log,
      };
    }) : cards,
  };
}

/** Which version this is, or why it cannot be read. */
function checkVersion(d: Record<string, unknown>): { version: number } | { error: string } {
  if (d.format !== undefined && d.format !== STORE_FORMAT) return { error: `this is a different kind of file (format "${String(d.format)}"), not a Generator Oracle service file` };
  if (d.version === undefined) return { error: 'the file has no version number, so it was not saved by this screen' };
  if (d.version === 1) return { version: 1 };
  if (d.version === STORE_VERSION) return d.format === STORE_FORMAT ? { version: STORE_VERSION } : { error: 'the file has no format marker, so it was not saved by this screen' };
  return { error: `the file is version ${JSON.stringify(d.version)}, which this screen does not know (it reads versions 1 and ${STORE_VERSION}). It may come from a newer release: update the page, or export again from the release that saved it` };
}

function checkShape(d: Record<string, unknown>): string | null {
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
    if (!JOB_STATUSES.includes(c.status as JobStatus)) return `job card ${id} has unknown status ${JSON.stringify(c.status)}`;
    if (!Array.isArray(c.faultCodes) || !c.faultCodes.every(isStr) || !Array.isArray(c.tasks) || !c.tasks.every(isStr)) return `job card ${id} is malformed`;
    if (!isNum(c.labourHours) || !(c.engineHoursAtJob === null || isNum(c.engineHoursAtJob))) return `job card ${id} hours are malformed`;
    if (!Array.isArray(c.parts) || !c.parts.every((p) => isObj(p) && isStr(p.partNo) && isStr(p.description) && isNum(p.qty) && (p.compatibility === null || isRef(p.compatibility)))) return `job card ${id} parts are malformed`;
    if (!Array.isArray(c.readings) || !c.readings.every((r) => isObj(r) && isStr(r.name) && isNum(r.value) && isStr(r.unit) && optNum(r.min) && optNum(r.max) && (r.limitSource === undefined || isStr(r.limitSource)))) return `job card ${id} readings are malformed`;
    for (const k of ['completedOn', 'signOffTypedName', 'signOffRecordedOn']) if (!(c[k] === null || isStr(c[k]))) return `job card ${id} is malformed`;
    if (!isRev(c.revision)) return `job card ${id} revision is malformed`;
    if (!(c.signOffHash === null || isHash(c.signOffHash))) return `job card ${id} sign-off hash is malformed`;
    if (!Array.isArray(c.log) || !c.log.every((l) => isObj(l) && isStr(l.at) && isStr(l.by) && JOB_STATUSES.includes(l.from as JobStatus) && JOB_STATUSES.includes(l.to as JobStatus)
      && (l.note === undefined || isStr(l.note)) && (l.hash === undefined || isHash(l.hash)) && (l.revision === undefined || isRev(l.revision)))) return `job card ${id} log is malformed`;
    const last = c.log.length ? (c.log[c.log.length - 1] as Record<string, unknown>).to : 'OPEN';
    if (last !== c.status) return `job card ${id}: its status does not match its history`;
    if (c.guidedSafety !== undefined && !isGuidedSafety(c.guidedSafety)) return `job card ${id} guided safety record is malformed`;
    if (c.status !== SIGNOFF && (c.signOffTypedName !== null || c.signOffRecordedOn !== null || c.signOffHash !== null)) return `job card ${id} carries sign-off details but is not at the sign-off step`;
  }
  return null;
}

export type ReadResult =
  | { ok: true; state: ServiceState; notice: string | null; /** Present only for version-1 data: keep the original before saving over it. */ upgradedFrom?: 1 }
  | { ok: false; error: string };

/**
 * Version 1 had no content hash, so its sign-offs cannot be checked. Each such
 * card goes back to COMPLETED with a history note (voidUncheckedSignOff), and a
 * service record that rested on it is taken out of the due list until the card
 * is signed and recorded again. Everything else in the file is kept.
 */
function voidV1SignOffs(o: ServiceState, now: string): { state: ServiceState; message: string | null } {
  const affected: string[] = [];
  const removed: string[] = [];
  const history: Record<string, ServiceRecord[]> = {};
  const voidedIds = new Set(o.jobCards.filter((c) => c.status === SIGNOFF && !c.log[c.log.length - 1]?.hash).map((c) => c.id));
  for (const [assetId, hist] of Object.entries(o.history)) {
    history[assetId] = hist.filter((r) => {
      if (!voidedIds.has(r.jobCardId)) return true;
      removed.push(`${r.jobCardId} (${assetId}, ${r.date}, ${r.engineHours} h, plan tasks ${r.taskIds.join(', ') || 'none'})`);
      return false;
    });
  }
  const jobCards = o.jobCards.map((c) => {
    if (!voidedIds.has(c.id)) return c;
    affected.push(c.id);
    const recs = removed.filter((r) => r.startsWith(`${c.id} (`));
    return voidUncheckedSignOff(c, now, recs.length ? `Its service record was taken out of the due list until then: ${recs.join('; ')}.` : undefined);
  });
  if (!affected.length) return { state: o, message: null };
  const message = `${V1_UNCHECKED_SIGNOFF_NOTE}. Moved back to COMPLETED: job card${affected.length > 1 ? 's' : ''} ${affected.join(', ')}.`
    + (removed.length ? ` Service records taken out of the due list until each card is signed off and recorded again: ${removed.join('; ')}.` : '');
  return { state: { ...o, history, jobCards }, message };
}

/**
 * Parse saved or imported JSON. Never throws. Nothing in the file is trusted:
 * every job card is replayed against the job-card rules (cardIntegrityProblems)
 * and a card claiming a sign-off must match the content hash recorded at it.
 * Any failure, and any service record without a hashed sign-off behind it,
 * refuses the whole file with a message; nothing is shown as clean.
 * Version-1 sign-offs (no hash) are moved back to COMPLETED, not refused.
 */
export function deserialise(text: string, now: string = new Date().toISOString()): ReadResult {
  let d: unknown;
  try { d = JSON.parse(text); } catch { return { ok: false, error: 'Not a valid JSON file' }; }
  if (!isObj(d)) return { ok: false, error: 'Not a Generator Oracle service file: not a JSON object' };
  const v = checkVersion(d);
  if ('error' in v) return { ok: false, error: `Not a Generator Oracle service file: ${v.error}` };
  const data = v.version === 1 ? upgradeV1(d) : d;
  const problem = checkShape(data);
  if (problem) return { ok: false, error: `Not a Generator Oracle service file: ${problem}` };
  const voided = v.version === 1 ? voidV1SignOffs(data as unknown as ServiceState, now) : { state: data as unknown as ServiceState, message: null };
  const o = voided.state;
  for (const c of o.jobCards) {
    const p = cardIntegrityProblems(c);
    if (p.length) {
      const claim = c.status === SIGNOFF || c.log.some((l) => l.to === SIGNOFF) ? ' Its sign-off is CHANGED AFTER SIGN-OFF / NOT VERIFIED.' : '';
      return { ok: false, error: `Refused: job card ${c.id} fails the job-card checks (${p.join('; ')}).${claim} Nothing was loaded.` };
    }
  }
  for (const [assetId, hist] of Object.entries(o.history)) {
    for (const r of hist) {
      const c = o.jobCards.find((x) => x.id === r.jobCardId);
      if (!c) return { ok: false, error: `Refused: service history for ${assetId} points at job card ${r.jobCardId}, which is not in the file. Nothing was loaded.` };
      if (c.assetId !== assetId || c.technician !== r.technician || !c.log.some((l) => l.to === SIGNOFF && l.hash)) return { ok: false, error: `Refused: service history for ${assetId} does not match job card ${r.jobCardId} (asset, technician or sign-off). Nothing was loaded.` };
    }
  }
  const state: ServiceState = { version: 2, assets: o.assets, plans: o.plans, history: o.history, jobCards: o.jobCards };
  if (v.version !== 1) return { ok: true, state, notice: null };
  const notice = `This data was saved by version 1 of this screen and has been upgraded to version ${STORE_VERSION}.${voided.message ? ` ${voided.message}` : ''}`;
  return { ok: true, state, notice, upgradedFrom: 1 };
}

/** Minimal Storage interface so tests can pass a stub. */
export interface KeyValueStore { getItem(k: string): string | null; setItem(k: string, v: string): void }

export const STORAGE_UNAVAILABLE = 'Browser storage is not available (blocked or private mode); nothing will be saved. Use Export JSON to keep a copy.';

export interface LoadResult {
  state: ServiceState;
  /** Something went wrong; shown as an error. */
  error: string | null;
  /** Data was read but changed on the way in (upgrade, failed sign-off check); shown as a notice. */
  notice: string | null;
  /** True when unreadable saved data could not be backed up: do not save over it until the user changes something. */
  protectSaved: boolean;
}

export function loadState(store: KeyValueStore | null | undefined, now: string = new Date().toISOString()): LoadResult {
  if (!store) return { state: emptyState(), error: STORAGE_UNAVAILABLE, notice: null, protectSaved: false };
  let raw: string | null;
  try { raw = store.getItem(STORE_KEY); } catch { return { state: emptyState(), error: STORAGE_UNAVAILABLE, notice: null, protectSaved: false }; }
  if (!raw) return { state: emptyState(), error: null, notice: null, protectSaved: false };
  const r = deserialise(raw, now);
  if (r.ok && r.upgradedFrom === 1) {
    // The next save writes version 2 over it: keep the version-1 original first.
    const key = `${V1_BACKUP_KEY}:${now}`;
    try {
      store.setItem(key, raw);
      return { state: r.state, error: null, notice: `${r.notice} The original version-1 data was kept in browser storage under "${key}".`, protectSaved: false };
    } catch {
      return { state: r.state, error: null, notice: `${r.notice} The original version-1 data could not be backed up; it is left in place and will be replaced only when you make a change here.`, protectSaved: true };
    }
  }
  if (r.ok) return { state: r.state, error: null, notice: r.notice, protectSaved: false };
  const backupKey = `${BACKUP_KEY}:${now}`;
  try {
    store.setItem(backupKey, raw);
    return { state: emptyState(), error: `Saved data could not be read (${r.error}). A copy was kept in browser storage under "${backupKey}"; starting empty.`, notice: null, protectSaved: false };
  } catch {
    return { state: emptyState(), error: `Saved data could not be read (${r.error}) and could not be backed up. It is left in place and will be replaced only when you make a change here.`, notice: null, protectSaved: true };
  }
}

// DOMException is not always an Error subclass (jsdom, older engines): read name/code directly.
const isQuota = (e: unknown) => {
  const x = (e ?? {}) as { name?: unknown; code?: unknown };
  return x.name === 'QuotaExceededError' || x.name === 'NS_ERROR_DOM_QUOTA_REACHED' || x.code === 22 || x.code === 1014;
};

export function saveState(store: KeyValueStore | null | undefined, s: ServiceState): string | null {
  if (!store) return STORAGE_UNAVAILABLE;
  try {
    store.setItem(STORE_KEY, serialise(s));
    return null;
  } catch (e) {
    return isQuota(e)
      ? 'Could not save: browser storage is full. Your latest change is on screen only; use Export JSON to keep a copy.'
      : 'Could not save: browser storage is blocked. Your latest change is on screen only; use Export JSON to keep a copy.';
  }
}
