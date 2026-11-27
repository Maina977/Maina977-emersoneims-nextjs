import { describe, it, expect } from 'vitest';
import { costSourcing, QUOTATION_TEXT } from '@/external/borehole-ai-engine/src/costSources';

// Management priority 6 (2026-11-22): a project cost appears only from sourced
// rates; lines without a published rate are never priced.
// Updated 2026-11-26 (pricing policy, management decision C): the unpriced
// wording is "Request a quotation" (was "by quotation"); completion is split into
// gravel pack, development, test pumping, lab test and cap; lines are priced in
// KSh to the shilling; the tender's figures apply under "government tender" only,
// and a private project's survey and permits are "Request a quotation".
// TEST economics only (shape of computeCanonicalEconomics).
const eco = (o: Record<string, unknown> = {}) => ({
  surveyCost: 700, permitCost: 300, permitNote: 'WRA permit fee schedule (TEST) (source)', permitKES: 135000, needsNema: false,
  depthVal: 120, drillMethod: 'DTH', drillingCost: 9000, rockType: 'basalt', isHardRock: true, rockTypeUnknown: false,
  mobilisationCost: 0, casingCost: 2000, blindCasingLen: 100, screenCost: 800, gravelTons: 14,
  completionCost: 1500, completionNote: 'tender completion items (TEST)',
  pumpCost: 2500, installCost: 1500, solarCost: 0, solarKW: 0,
  wqTreatmentCost: 0, needsRO: false, defluoridationCost: 0,
  contingencyRate: 0.1, pricing: { category: 'government_tender', quotations: [] }, ...o,
}) as never;

describe('AquaScan cost lines: only sourced rates are priced', () => {
  it('unsourced lines (screen, pump, installation) are not priced and left out of the total', () => {
    const c = costSourcing(eco());
    expect(c.quotationItems).toEqual(['Well screen', 'Pump and motor', 'Installation and rising main']);
    // Government tender (TEST): survey 85,000 + permits 135,000 + drilling 120 x 10,500 = 1,260,000
    // + casing 100 x 4,200 = 420,000 + gravel 14 x 6,500 = 91,000 + development 150,000
    // + test pumping 228,000 + lab 28,000 + cap 85,000 = 2,482,000; +10% = 248,200 -> 2,730,200
    expect(c.sourcedSubtotalKES).toBe(2482000);
    expect(c.sourcedContingencyKES).toBe(248200);
    expect(c.sourcedTotalKES).toBe(2730200);
    expect(QUOTATION_TEXT).toBe('Request a quotation');
  });
  it('a private project: no line uses the tender rates; every item is "Request a quotation"', () => {
    const c = costSourcing(eco({ pricing: { category: 'private', quotations: [] } }));
    expect(c.quotationItems.slice(0, 2)).toEqual([expect.stringMatching(/^Hydrogeological survey/), expect.stringMatching(/^Permits and approvals/)]);
    // No tender rate on any line of a private project (management 2026-11-26), and no solar here: nothing priced.
    expect(c.sourcedSubtotalKES).toBe(0);
    expect(c.totalLabel).toBe('Total: request a quotation');
    expect(c.lines.every((l) => l.kes == null && l.priceText === 'Request a quotation')).toBe(true);
  });
  it('every priced line names its source; treatment from a measurement is still unpriced', () => {
    const c = costSourcing(eco({ wqTreatmentCost: 900, defluoridationCost: 400, solarCost: 3000, solarKW: 2 }));
    for (const l of c.lines.filter((x) => x.source)) expect(l.source!.length).toBeGreaterThan(5);
    expect(c.quotationItems).toEqual(expect.arrayContaining(['Water treatment', 'Defluoridation (on measured fluoride)']));
    expect(c.lines.find((l) => l.item.startsWith('Solar pump'))!.source).toMatch(/IRENA/);
  });
});
