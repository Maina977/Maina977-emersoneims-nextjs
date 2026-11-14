import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { compareWithReference } from '@/lib/qs/referenceComparison';

const HEAD = 'project,drawingSet,itemCode,description,unit,referenceQty,toolQty,rate,referenceSource,notes';
// SYNTHETIC rows for the comparison logic only.
const row = (p: string, code: string, ref: number | string, tool: number | string, rate: number | string = 1000, src = 'Manual BOQ by QS (synthetic)') => `${p},A-100 set,${code},item,m²,${ref},${tool},${rate},${src},`;

describe('drawing/BOQ reference comparison', () => {
  it('the template has no data and reports INSUFFICIENT', () => {
    expect(compareWithReference(fs.readFileSync('docs/qs-validation/drawing-boq-comparison-template.csv', 'utf8')).status).toMatch(/INSUFFICIENT: 0 of the 10/);
  });
  it('item 101 vs 100 (+1 %) passes ±2 %; total +0.5 % passes ±1 %', () => {
    const r = compareWithReference([HEAD, row('P1', 'A', 100, 101), row('P1', 'B', 100, 100)].join('\n'));
    expect(r.projects[0]).toMatchObject({ refAmount: 200000, toolAmount: 201000, totalDiffPct: 0.5, pass: true });
  });
  it('an item off by 3 % fails even if the total is close', () => {
    const r = compareWithReference([HEAD, row('P1', 'A', 100, 103), row('P1', 'B', 1000, 1000)].join('\n'));
    expect(r.projects[0].pass).toBe(false);
    expect(r.projects[0].outside.map((x) => x.code)).toEqual(['A']);
  });
  it('unpriced items: no total verdict', () => {
    expect(compareWithReference([HEAD, row('P1', 'A', 100, 100, '')].join('\n')).projects[0].pass).toBeNull();
  });
  it('rows without a reference source are rejected', () => {
    expect(compareWithReference([HEAD, row('P1', 'A', 100, 100, 1000, '')].join('\n')).rowErrors[0]).toMatch(/referenceSource/);
  });
});
