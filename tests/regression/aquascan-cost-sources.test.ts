import { describe, it, expect } from 'vitest';
import { costSourcing, QUOTATION_TEXT } from '@/external/borehole-ai-engine/src/costSources';

// Management priority 6 (2026-11-22): a project cost appears only from sourced
// rates; lines without a published rate are "by quotation" and never priced.
// TEST economics only (shape of computeCanonicalEconomics).
const eco = (o: Record<string, unknown> = {}) => ({
  surveyCost: 700, permitCost: 300, permitNote: 'WRA permit fee schedule (TEST)',
  depthVal: 120, drillMethod: 'DTH', drillingCost: 9000,
  mobilisationCost: 0, casingCost: 2000, screenCost: 800,
  completionCost: 1500, completionNote: 'tender completion items (TEST)',
  pumpCost: 2500, installCost: 1500, solarCost: 0, solarKW: 0,
  wqTreatmentCost: 0, needsRO: false, defluoridationCost: 0,
  contingencyRate: 0.1, ...o,
}) as never;

describe('AquaScan cost lines: only sourced rates are priced', () => {
  it('unsourced lines (screen, pump, installation) are listed "by quotation" and left out of the total', () => {
    const c = costSourcing(eco());
    expect(c.quotationItems).toEqual(['Well screen', 'Pump and motor', 'Installation and rising main']);
    // Sourced: survey+permit 1000, drilling 9000, casing 2000, completion 1500 = 13,500; +10 % = 14,850
    expect(c.sourcedSubtotal).toBe(13500);
    expect(c.sourcedContingency).toBe(1350);
    expect(c.sourcedTotal).toBe(14850);
    expect(QUOTATION_TEXT).toBe('by quotation');
  });
  it('every priced line names its source; treatment from a measurement is still by quotation', () => {
    const c = costSourcing(eco({ wqTreatmentCost: 900, defluoridationCost: 400, solarCost: 3000, solarKW: 2 }));
    for (const l of c.lines.filter((x) => x.source)) expect(l.source!.length).toBeGreaterThan(5);
    expect(c.quotationItems).toEqual(expect.arrayContaining(['Water treatment', 'Defluoridation (on measured fluoride)']));
    expect(c.lines.find((l) => l.item.startsWith('Solar pump'))!.source).toMatch(/IRENA/);
  });
});
