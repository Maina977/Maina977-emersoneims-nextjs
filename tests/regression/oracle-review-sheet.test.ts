import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { FAMILIES } from '@/lib/generator-oracle/diagnostics/families';
import { reviewRows, reviewCsv, describeCondition } from '@/lib/generator-oracle/diagnostics/reviewSheet';
import { SCREEN_QUESTIONS, SCREEN_RULES, isScreenKey } from '@/lib/generator-oracle/diagnostics/safetyScreen';

describe('technician review sheet', () => {
  const rows = reviewRows(FAMILIES);
  it('covers every question, stop rule, cause and evidence rule', () => {
    // The shared safety screen is listed once, not in every family.
    const screen = SCREEN_QUESTIONS.length + SCREEN_RULES.length;
    const expected = screen + FAMILIES.reduce((n, f) => n + (f.mandatorySafety?.length ?? 0) + f.questions.filter((q) => !isScreenKey(q.id)).length + f.stopRules.filter((s) => !s.screen).length + (f.limits?.length ?? 0) + (f.crossChecks?.length ?? 0) + f.causes.length + f.causes.reduce((m, c) => m + c.evidence.length, 0), 0);
    expect(rows.length).toBe(expected);
    expect(rows.filter((r) => r.kind === 'safety').length).toBe(FAMILIES.reduce((n, f) => n + (f.mandatorySafety?.length ?? 0), 0));
    // Running checks are on the sheet so the reviewer sees what is withheld after a STOP.
    expect(rows.filter((r) => r.kind === 'cause' && /withheld while any STOP is active/.test(r.text)).length).toBe(FAMILIES.reduce((n, f) => n + f.causes.filter((c) => c.runningChecks?.length).length, 0));
    expect(rows.filter((r) => r.kind === 'stop').length).toBe(SCREEN_RULES.length + FAMILIES.reduce((n, f) => n + f.stopRules.filter((s) => !s.screen).length, 0));
  });
  it('rules read in plain terms', () => {
    expect(describeCondition({ q: 'oilPressure', op: 'ltRef', ref: 'oemMinOilPressure' })).toBe('oilPressure < oemMinOilPressure');
    expect(describeCondition({ all: [{ q: 'a', op: 'is', value: ['x', 'y'] }, { q: 'b', op: 'ge', value: 3 }] })).toBe('(a is x/y AND b ≥ 3)');
  });
  it('the committed review sheet matches the live definitions', () => {
    const file = path.resolve('docs/engineering-apps/oracle-guided-diagnostics-review-sheet.csv');
    const csv = reviewCsv(FAMILIES);
    if (process.env.WRITE_REVIEW_SHEET) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, csv); }
    // Line endings may be converted on checkout (core.autocrlf).
    expect(fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n')).toBe(csv);
  });
});
