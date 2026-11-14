/**
 * Independent drawing/BOQ comparison (P1-D): quantities from the take-off tool
 * against a manually prepared reference BOQ for the same drawings.
 * Template: docs/qs-validation/drawing-boq-comparison-template.csv.
 * Tolerances are the proposed acceptance values (±2 % per item, ±1 % on the
 * measured total, by amount); the QS reviewer may set others.
 */
export interface CompareOptions { itemTolPct?: number; totalTolPct?: number }
export interface ItemResult { project: string; code: string; unit: string; reference: number; tool: number; diffPct: number | null; withinTolerance: boolean | null; note: string }
export interface ProjectResult { project: string; items: number; outside: ItemResult[]; refAmount: number | null; toolAmount: number | null; totalDiffPct: number | null; pass: boolean | null }
export interface ReferenceReport { projects: ProjectResult[]; rowErrors: string[]; status: string }

function parseLine(line: string): string[] {
  const out: string[] = []; let cur = ''; let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
    else if (c === '"') q = true; else if (c === ',') { out.push(cur); cur = ''; } else cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

export function compareWithReference(csv: string, opt: CompareOptions = {}): ReferenceReport {
  const itemTol = opt.itemTolPct ?? 2, totalTol = opt.totalTolPct ?? 1;
  const lines = csv.split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith('#'));
  const rowErrors: string[] = [];
  if (!lines.length) return { projects: [], rowErrors, status: 'INSUFFICIENT: 0 of the 10 required reference projects' };
  const head = parseLine(lines[0]);
  const items: Array<ItemResult & { rate: number | null }> = [];
  lines.slice(1).forEach((l, i) => {
    const v = Object.fromEntries(head.map((h, k) => [h, parseLine(l)[k] ?? '']));
    if (!v.project && !v.itemCode) return; // empty template row
    const ref = Number(v.referenceQty), tool = Number(v.toolQty), rate = v.rate === '' ? null : Number(v.rate);
    const e: string[] = [];
    if (!v.project || !v.itemCode || !v.unit) e.push('project, itemCode and unit are required');
    if (!(ref >= 0) || v.referenceQty === '') e.push('referenceQty must be a number');
    if (!(tool >= 0) || v.toolQty === '') e.push('toolQty must be a number');
    if (rate !== null && !(rate >= 0)) e.push('rate must be a number when given');
    if (!v.referenceSource) e.push('referenceSource is required (who prepared the manual BOQ, document)');
    if (e.length) { rowErrors.push(`row ${i + 2}: ${e.join('; ')}`); return; }
    const diffPct = ref > 0 ? Math.round(((tool - ref) / ref) * 10000) / 100 : (tool === 0 ? 0 : null);
    items.push({ project: v.project, code: v.itemCode, unit: v.unit, reference: ref, tool, diffPct, withinTolerance: diffPct === null ? null : Math.abs(diffPct) <= itemTol, note: v.notes ?? '', rate });
  });
  const projects: ProjectResult[] = [...new Set(items.map((x) => x.project))].map((p) => {
    const its = items.filter((x) => x.project === p);
    const priced = its.every((x) => x.rate !== null);
    const refAmount = priced ? its.reduce((a, x) => a + x.reference * x.rate!, 0) : null;
    const toolAmount = priced ? its.reduce((a, x) => a + x.tool * x.rate!, 0) : null;
    const totalDiffPct = refAmount ? Math.round(((toolAmount! - refAmount) / refAmount) * 10000) / 100 : null;
    const outside = its.filter((x) => x.withinTolerance === false);
    const pass = totalDiffPct === null ? null : outside.length === 0 && Math.abs(totalDiffPct) <= totalTol;
    return { project: p, items: its.length, outside: outside.map(({ rate: _r, ...x }) => x), refAmount: refAmount === null ? null : Math.round(refAmount * 100) / 100, toolAmount: toolAmount === null ? null : Math.round(toolAmount * 100) / 100, totalDiffPct, pass };
  });
  const status = projects.length < 10 ? `INSUFFICIENT: ${projects.length} of the 10 required reference projects`
    : projects.some((p) => p.pass !== true) ? 'NOT ACCEPTED: at least one project outside tolerance or unpriced' : 'READY FOR QS REVIEW';
  return { projects, rowErrors, status };
}
