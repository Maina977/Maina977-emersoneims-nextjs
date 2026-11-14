/**
 * Technician review sheet for the guided fault-finding content (P1-A).
 * One row per question, stop rule, cause and evidence rule, generated from
 * the live definitions so the reviewer checks exactly what the tool runs.
 */
import type { Condition, FaultFamily } from './types';
import { DIAGNOSTIC_ENGINE_VERSION } from './engine';

export interface ReviewRow {
  family: string; kind: 'question' | 'stop' | 'cause' | 'evidence'; id: string;
  text: string; rule: string;
  oemReference: string; verdict: '' ; reviewerComment: string;
}

export function describeCondition(c: Condition): string {
  if ('all' in c) return `(${c.all.map(describeCondition).join(' AND ')})`;
  if ('any' in c) return `(${c.any.map(describeCondition).join(' OR ')})`;
  switch (c.op) {
    case 'is': return `${c.q} is ${Array.isArray(c.value) ? c.value.join('/') : c.value}`;
    case 'lt': return `${c.q} < ${c.value}`;
    case 'le': return `${c.q} ≤ ${c.value}`;
    case 'gt': return `${c.q} > ${c.value}`;
    case 'ge': return `${c.q} ≥ ${c.value}`;
    case 'ltRef': return `${c.q} < ${c.factor && c.factor !== 1 ? `${c.factor} × ` : ''}${c.ref}`;
    case 'gtRef': return `${c.q} > ${c.factor && c.factor !== 1 ? `${c.factor} × ` : ''}${c.ref}`;
  }
}

export function reviewRows(families: FaultFamily[]): ReviewRow[] {
  const rows: ReviewRow[] = [];
  const blank = { oemReference: '', verdict: '' as const, reviewerComment: '' };
  for (const f of families) {
    for (const q of f.questions) rows.push({ family: f.id, kind: 'question', id: q.id, text: q.text, rule: q.kind === 'number' ? `number ${q.min}–${q.max} ${q.unit}` : q.options.map((o) => o.label).join(' | '), ...blank });
    f.stopRules.forEach((s, i) => rows.push({ family: f.id, kind: 'stop', id: `stop-${i + 1}`, text: `${s.level}: ${s.message}`, rule: describeCondition(s.when), ...blank }));
    for (const c of f.causes) {
      rows.push({ family: f.id, kind: 'cause', id: c.id, text: `${c.title}. Actions: ${c.actions.join(' / ')}`, rule: c.reference, ...blank });
      c.evidence.forEach((e, i) => rows.push({ family: f.id, kind: 'evidence', id: `${c.id}.${i + 1}`, text: `${e.effect}: ${e.because}`, rule: describeCondition(e.when), ...blank }));
    }
  }
  return rows;
}

export function reviewCsv(families: FaultFamily[]): string {
  const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const head = ['family', 'kind', 'id', 'text', 'rule', 'oemReference', 'verdict (correct / change / remove)', 'reviewerComment'];
  return [`# Generator Oracle guided diagnostics: technician review sheet. ${DIAGNOSTIC_ENGINE_VERSION}`, head.join(','), ...reviewRows(families).map((r) => [r.family, r.kind, r.id, r.text, r.rule, r.oemReference, r.verdict, r.reviewerComment].map(esc).join(','))].join('\n') + '\n';
}
