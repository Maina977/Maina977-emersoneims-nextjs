/**
 * Generator Oracle: maintenance planning and workshop job cards (P1, 2026-11-20).
 *
 * - Intervals are never built in. Each plan task cites the OEM manual
 *   (document, edition, page) it comes from.
 * - Due status uses engine hours or calendar months, whichever comes first.
 *   A task with no recorded history is DUE (status unknown), never "OK".
 * - Job cards follow a fixed status flow. Completion needs test-run readings,
 *   and sign-off needs a named supervisor other than the technician.
 * - Parts list their compatibility source (OEM parts book / page). Without one
 *   a part is flagged "compatibility unverified" and blocks sign-off.
 * - Readings outside the limits given for that set (from its rating plate or
 *   manual) are flagged. The engine does not invent limits.
 */
export const SERVICE_ENGINE_VERSION = 'oracle-service 1.0.0 (2026-11-20)';

export interface ManualRef { document: string; edition: string; page: string }
export interface Asset { id: string; make: string; model: string; engine: string; controller: string; serial: string; ratedKva: number }
export interface PlanTask { id: string; task: string; intervalHours?: number; intervalMonths?: number; source: ManualRef }
export interface ServiceRecord { date: string; engineHours: number; taskIds: string[]; jobCardId: string; technician: string }

export type DueStatus = 'OVERDUE' | 'DUE SOON' | 'OK' | 'DUE (NO HISTORY)';
export interface DueItem { taskId: string; task: string; status: DueStatus; lastDone: { date: string; engineHours: number } | null; nextDueHours: number | null; nextDueDate: string | null; reason: string; source: string }

const refText = (r: ManualRef) => `${r.document}, ${r.edition}, p. ${r.page}`;
function checkRef(where: string, r: ManualRef | undefined) {
  if (!r || !r.document?.trim() || !r.edition?.trim() || !r.page?.trim()) throw new Error(`${where}: cite the OEM manual (document, edition, page)`);
}
const addMonths = (iso: string, m: number) => { const d = new Date(iso); d.setUTCMonth(d.getUTCMonth() + m); return d.toISOString().slice(0, 10); };

export function validatePlan(plan: PlanTask[]): void {
  const ids = new Set<string>();
  for (const t of plan) {
    if (ids.has(t.id)) throw new Error(`Plan task ${t.id} repeated`);
    ids.add(t.id);
    checkRef(`Plan task ${t.id}`, t.source);
    if (!(t.intervalHours! > 0) && !(t.intervalMonths! > 0)) throw new Error(`Plan task ${t.id}: give an hours and/or months interval from the manual`);
  }
}

/**
 * What is due now. "Soon" means within `soon.hours` engine hours or
 * `soon.days` days, both set by the workshop.
 */
export function dueList(plan: PlanTask[], history: ServiceRecord[], now: { date: string; engineHours: number }, soon: { hours: number; days: number }): DueItem[] {
  validatePlan(plan);
  if (!(now.engineHours >= 0) || Number.isNaN(Date.parse(now.date))) throw new Error('Current date and engine-hour reading are required');
  const sorted = [...history].sort((a, b) => a.engineHours - b.engineHours || Date.parse(a.date) - Date.parse(b.date));
  for (let k = 1; k < sorted.length; k++) if (Date.parse(sorted[k].date) < Date.parse(sorted[k - 1].date)) throw new Error(`Service history inconsistent: hours rise while dates go back (${sorted[k].jobCardId})`);
  if (sorted.length && now.engineHours < sorted[sorted.length - 1].engineHours) throw new Error('Current engine hours are below the last recorded service: check the hour meter (replaced?)');
  const nowMs = Date.parse(now.date);
  return plan.map((t) => {
    const last = [...sorted].reverse().find((r) => r.taskIds.includes(t.id)) ?? null;
    const src = refText(t.source);
    if (!last) return { taskId: t.id, task: t.task, status: 'DUE (NO HISTORY)' as const, lastDone: null, nextDueHours: null, nextDueDate: null, reason: 'No record of this task: treat as due until a record is found', source: src };
    const nextH = t.intervalHours ? last.engineHours + t.intervalHours : null;
    const nextD = t.intervalMonths ? addMonths(last.date, t.intervalMonths) : null;
    const overH = nextH !== null && now.engineHours >= nextH;
    const overD = nextD !== null && nowMs >= Date.parse(nextD);
    const soonH = nextH !== null && now.engineHours >= nextH - soon.hours;
    const soonD = nextD !== null && nowMs >= Date.parse(nextD) - soon.days * 86400e3;
    const status: DueStatus = overH || overD ? 'OVERDUE' : soonH || soonD ? 'DUE SOON' : 'OK';
    const parts = [nextH !== null ? `${nextH} h (now ${now.engineHours} h)` : null, nextD ? `${nextD}` : null].filter(Boolean).join(' or ');
    return { taskId: t.id, task: t.task, status, lastDone: { date: last.date, engineHours: last.engineHours }, nextDueHours: nextH, nextDueDate: nextD, reason: `Next due at ${parts}, whichever comes first`, source: src };
  });
}

// ---------------------------------------------------------------- job cards
export type JobStatus = 'OPEN' | 'IN PROGRESS' | 'AWAITING PARTS' | 'COMPLETED' | 'SIGNED OFF';
const FLOW: Record<JobStatus, JobStatus[]> = {
  OPEN: ['IN PROGRESS'], 'IN PROGRESS': ['AWAITING PARTS', 'COMPLETED'], 'AWAITING PARTS': ['IN PROGRESS'], COMPLETED: ['SIGNED OFF', 'IN PROGRESS'], 'SIGNED OFF': [],
};
export interface PartLine { partNo: string; description: string; qty: number; compatibility: ManualRef | null }
export interface Reading { name: string; value: number; unit: string; min?: number; max?: number; limitSource?: string }
export interface JobCard {
  id: string; assetId: string; opened: string; reportedFault: string; faultCodes: string[];
  technician: string; status: JobStatus; tasks: string[]; parts: PartLine[]; labourHours: number;
  engineHoursAtJob: number | null; readings: Reading[]; findings: string;
  completedOn: string | null; signedOffBy: string | null; signedOffOn: string | null;
  log: Array<{ at: string; from: JobStatus; to: JobStatus; by: string; note?: string }>;
}

export function openJobCard(j: { id: string; assetId: string; opened: string; reportedFault: string; faultCodes?: string[]; technician: string }): JobCard {
  if (!j.id?.trim() || !j.assetId?.trim() || !j.technician?.trim() || !j.reportedFault?.trim()) throw new Error('Job card needs an id, asset, technician and the reported fault');
  if (Number.isNaN(Date.parse(j.opened))) throw new Error('Job card needs the date opened');
  return { id: j.id, assetId: j.assetId, opened: j.opened, reportedFault: j.reportedFault.trim(), faultCodes: j.faultCodes ?? [], technician: j.technician, status: 'OPEN', tasks: [], parts: [], labourHours: 0, engineHoursAtJob: null, readings: [], findings: '', completedOn: null, signedOffBy: null, signedOffOn: null, log: [] };
}

/** Readings outside the limits supplied for this set; a reading with no limit is not judged. */
export function readingFlags(r: Reading[]): string[] {
  const f: string[] = [];
  for (const x of r) {
    if (!Number.isFinite(x.value)) { f.push(`${x.name}: no value`); continue; }
    if ((x.min !== undefined || x.max !== undefined) && !x.limitSource?.trim()) f.push(`${x.name}: limit given without its source`);
    if (x.min !== undefined && x.value < x.min) f.push(`${x.name} ${x.value} ${x.unit} is below ${x.min} ${x.unit} (${x.limitSource})`);
    if (x.max !== undefined && x.value > x.max) f.push(`${x.name} ${x.value} ${x.unit} is above ${x.max} ${x.unit} (${x.limitSource})`);
  }
  return f;
}

export function transition(card: JobCard, to: JobStatus, by: string, at: string, update: Partial<Pick<JobCard, 'tasks' | 'parts' | 'labourHours' | 'engineHoursAtJob' | 'readings' | 'findings'>> = {}, note?: string): JobCard {
  if (!FLOW[card.status].includes(to)) throw new Error(`A job card cannot go from ${card.status} to ${to}`);
  if (!by?.trim() || Number.isNaN(Date.parse(at))) throw new Error('Who and when are required for every status change');
  const next: JobCard = { ...card, ...update, log: [...card.log, { at, from: card.status, to, by, note }], status: to };
  if (to === 'COMPLETED') {
    const e: string[] = [];
    if (!next.findings.trim()) e.push('findings');
    if (!next.tasks.length) e.push('work done');
    if (!(next.engineHoursAtJob !== null && next.engineHoursAtJob >= 0)) e.push('engine-hour reading');
    if (!next.readings.length) e.push('test-run readings');
    if (e.length) throw new Error(`To complete, record: ${e.join(', ')}`);
    next.completedOn = at;
  }
  if (to === 'SIGNED OFF') {
    if (by === card.technician) throw new Error('Sign-off must be by a supervisor other than the technician');
    const unverified = next.parts.filter((p) => !p.compatibility || !p.compatibility.document?.trim());
    if (unverified.length) throw new Error(`Compatibility unverified for: ${unverified.map((p) => p.partNo).join(', ')}; cite the OEM parts book`);
    const flags = readingFlags(next.readings);
    if (flags.length) throw new Error(`Readings need attention before sign-off: ${flags.join('; ')}`);
    next.signedOffBy = by; next.signedOffOn = at;
  }
  return next;
}

/** Service record from a signed-off job card (feeds dueList). */
export function toServiceRecord(card: JobCard, planTaskIds: string[]): ServiceRecord {
  if (card.status !== 'SIGNED OFF') throw new Error('Only a signed-off job card becomes service history');
  return { date: card.completedOn!.slice(0, 10), engineHours: card.engineHoursAtJob!, taskIds: planTaskIds, jobCardId: card.id, technician: card.technician };
}

/** Plain-text job card report for the customer file. */
export function jobCardReport(card: JobCard, asset: Asset): string {
  const lines = [
    `JOB CARD ${card.id} — ${card.status}`,
    `${asset.make} ${asset.model} (${asset.ratedKva} kVA), engine ${asset.engine}, controller ${asset.controller}, serial ${asset.serial}`,
    `Opened ${card.opened} by ${card.technician}. Reported fault: ${card.reportedFault}${card.faultCodes.length ? ` (codes: ${card.faultCodes.join(', ')})` : ''}`,
    `Engine hours: ${card.engineHoursAtJob ?? '—'}. Labour: ${card.labourHours} h.`,
    `Work done: ${card.tasks.join('; ') || '—'}`,
    `Parts: ${card.parts.map((p) => `${p.qty} × ${p.partNo} ${p.description}${p.compatibility ? ` [${refText(p.compatibility)}]` : ' [compatibility unverified]'}`).join('; ') || 'none'}`,
    `Test readings: ${card.readings.map((r) => `${r.name} ${r.value} ${r.unit}`).join('; ') || '—'}`,
    `Findings: ${card.findings || '—'}`,
    card.signedOffBy ? `Signed off by ${card.signedOffBy} on ${card.signedOffOn}` : 'Not signed off.',
    `History: ${card.log.map((l) => `${l.at} ${l.from}→${l.to} (${l.by})`).join('; ')}`,
    `[${SERVICE_ENGINE_VERSION}]`,
  ];
  return lines.join('\n');
}
