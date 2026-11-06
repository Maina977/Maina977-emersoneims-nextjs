/**
 * Lead stages (master brief §10, external audit §7): the pipeline a website
 * enquiry moves through. Stored in leads.status (VARCHAR(20)); every value here
 * fits. New leads are written as 'new' by /api/contact.
 */
export const LEAD_STAGES = [
  { id: 'new', label: 'New' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'site_survey', label: 'Site survey required' },
  { id: 'quoting', label: 'Quotation in preparation' },
  { id: 'quoted', label: 'Quotation sent' },
  { id: 'follow_up', label: 'Follow-up due' },
  { id: 'negotiating', label: 'Negotiating' },
  { id: 'won', label: 'Won' },
  { id: 'lost', label: 'Lost' },
] as const;

export type LeadStage = (typeof LEAD_STAGES)[number]['id'];

const IDS = new Set<string>(LEAD_STAGES.map((s) => s.id));

export function isLeadStage(v: unknown): v is LeadStage {
  return typeof v === 'string' && IDS.has(v);
}

/** Older rows may carry statuses written before this list existed. */
export function stageLabel(v: string): string {
  return LEAD_STAGES.find((s) => s.id === v)?.label ?? v;
}

export interface LeadUpdate {
  status?: LeadStage;
  notes?: string;
  assignedTo?: string;
  estimatedValue?: number | null;
  actualValue?: number | null;
}

/**
 * Validate a PATCH body. Returns the cleaned update or an error message.
 * Strings are trimmed and capped; values must be finite and non-negative.
 */
export function parseLeadUpdate(body: unknown): { ok: true; id: number; update: LeadUpdate } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Body must be a JSON object' };
  const b = body as Record<string, unknown>;
  const id = Number(b.id);
  if (!Number.isInteger(id) || id <= 0) return { ok: false, error: 'id must be a positive integer' };
  const update: LeadUpdate = {};
  if (b.status !== undefined) {
    if (!isLeadStage(b.status)) return { ok: false, error: 'Unknown stage' };
    update.status = b.status;
  }
  if (b.notes !== undefined) {
    if (typeof b.notes !== 'string') return { ok: false, error: 'notes must be text' };
    update.notes = b.notes.trim().slice(0, 4000);
  }
  if (b.assignedTo !== undefined) {
    if (typeof b.assignedTo !== 'string') return { ok: false, error: 'assignedTo must be text' };
    update.assignedTo = b.assignedTo.trim().slice(0, 255);
  }
  for (const k of ['estimatedValue', 'actualValue'] as const) {
    if (b[k] === undefined) continue;
    if (b[k] === null || b[k] === '') { update[k] = null; continue; }
    const n = Number(b[k]);
    if (!Number.isFinite(n) || n < 0 || n > 1e12) return { ok: false, error: `${k} must be a non-negative number` };
    update[k] = Math.round(n * 100) / 100;
  }
  if (Object.keys(update).length === 0) return { ok: false, error: 'Nothing to update' };
  return { ok: true, id, update };
}

/**
 * The SQL for one update: plain parameters, plus the timestamps the leads
 * table already has (first/last contacted, converted). Never deletes.
 */
export function buildLeadUpdateSql(id: number, u: LeadUpdate): { text: string; values: unknown[] } {
  const sets: string[] = [];
  const values: unknown[] = [];
  const add = (col: string, v: unknown) => { values.push(v); sets.push(`${col} = $${values.length}`); };
  if (u.status !== undefined) {
    add('status', u.status);
    if (u.status !== 'new') {
      sets.push('first_contacted_at = COALESCE(first_contacted_at, NOW())');
      sets.push('last_contacted_at = NOW()');
    }
    if (u.status === 'won') sets.push('converted_at = COALESCE(converted_at, NOW())');
  }
  if (u.notes !== undefined) add('notes', u.notes);
  if (u.assignedTo !== undefined) add('assigned_to', u.assignedTo || null);
  if (u.estimatedValue !== undefined) add('estimated_value', u.estimatedValue);
  if (u.actualValue !== undefined) add('actual_value', u.actualValue);
  sets.push('updated_at = NOW()');
  values.push(id);
  return { text: `UPDATE leads SET ${sets.join(', ')} WHERE id = $${values.length} RETURNING id, status`, values };
}
