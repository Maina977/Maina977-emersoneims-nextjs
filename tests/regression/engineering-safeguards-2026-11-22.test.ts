import { describe, it, expect } from 'vitest';
import { buildBoq, type BoqItem } from '@/lib/qs/boq';
import { draftAdjustments } from '@/lib/qs/project';
import { buildProposal, type ProposalInput } from '@/lib/solar/design/proposal';
import { formToProposalInput, WORKED_EXAMPLE_FORM, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION } from '@/lib/solar/design/proposalForm';
import { FAMILIES } from '@/lib/generator-oracle/diagnostics/families';
import { diagnose } from '@/lib/generator-oracle/diagnostics/engine';

// Management priority 6 (2026-11-22): the other tools' safeguards must still hold.
describe('cross-tool engineering safeguards', () => {
  it('Generator Oracle: safety STOP warnings are still present in the guided families', () => {
    const stops = FAMILIES.flatMap((f) => f.stopRules.map((r) => r.message));
    expect(stops.some((m) => /STOP/.test(m))).toBe(true);
    expect(stops.filter((m) => /^STOP|STOP the engine|STOP:/.test(m)).length).toBeGreaterThan(2);
  });
  it('Solar: an unsafe string (cold Voc over the inverter limit) still refuses the proposal', () => {
    const r = formToProposalInput(WORKED_EXAMPLE_FORM, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION, null);
    const base = r.input as ProposalInput;
    const p = buildProposal({ ...base, design: { ...base.design, modulesPerString: 20, stringsPerMppt: [1] } });
    expect(p.status).toBe('REFUSED');
  });
  it('Solar: without a verified reviewer a proposal is DRAFT', () => {
    const r = formToProposalInput(WORKED_EXAMPLE_FORM, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION, null);
    expect(buildProposal(r.input as ProposalInput).status).toBe('DRAFT');
  });
  it('Building: an unpriced BOQ line leaves the bill INCOMPLETE with no total', () => {
    const Q = new Map([['M1', { id: 'M1', kind: 'area', unit: 'm²', gross: 10, deductions: 0, net: 10, holes: [] }]]) as never;
    const item = { code: '1', section: 'TEST', description: 'TEST', unit: 'm²', links: [{ measurementId: 'M1', factor: 1 }], rate: null } as unknown as BoqItem;
    const b = buildBoq([item], Q, draftAdjustments({ prelims: '5', contingency: '5', ohp: '10', vat: '16', vatFrom: '2026-11-22' }), 'A');
    expect(b.grandTotal).toBeNull();
    expect(b.unpricedItems).toEqual(['1']);
  });
  it('Oracle diagnose still runs for every family (no crash)', () => {
    for (const f of FAMILIES) expect(() => diagnose(f, {})).not.toThrow();
  });
});
