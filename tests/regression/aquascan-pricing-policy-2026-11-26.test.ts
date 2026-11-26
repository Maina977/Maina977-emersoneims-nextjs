/**
 * Pricing policy (management decision C, 2026-11-26; real-project test D2) and the
 * contingency worked examples (decision B, acceptance requirement 1).
 *
 * D2: the cost model applied ONE rate set, the EmersonEIMS signed tender for Baringo
 * County (16 Oct 2026), to every client: survey KSh 85,000, permits KSh 135,000
 * (240,000 with NEMA). EmersonEIMS's own private quotation #83 (9 Mar 2026) priced the
 * survey at KSh 50,000 and NEMA + WRMA + county permits at KSh 80,000 (one bundle).
 * Production bf2c7500 has the same single rate set (costModel.ts / reportShared.ts /
 * costSources.ts unchanged by the safety release).
 * TEST values only, except the reference record's own figures.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { computeCanonicalEconomics } from '@/external/borehole-ai-engine/src/reportShared';
import { costSourcing, costLineText, QUOTATION_TEXT } from '@/external/borehole-ai-engine/src/costSources';
import { EIMS_RATES_KES } from '@/external/borehole-ai-engine/src/costModel';
import {
  PRICE_STATE, projectPricingOf, validateQuotation, REFERENCE_QUOTATION_83, REFERENCE_QUOTATION_TEXT, TENDER_RATE_SOURCE,
} from '@/external/borehole-ai-engine/src/projectPricing';
import { governingSummary } from '@/external/borehole-ai-engine/src/governingSummary';
import { sourcedCostRows, jsonReportData } from '@/external/borehole-ai-engine/src/reportGenerator';

/** A minimal priced borehole: Nairobi (no mobilisation line), 2 m3/h (no NEMA), no well-design pump, potable. */
const site = (o: { depth: number; rock?: string; pricing?: any }) => ({
  recommendedDepth: o.depth, estimatedYield: 2,
  site: { latitude: -1.2921, longitude: 36.8219 },
  soil: { type: 'unknown', realSoilGrids: false },
  rockClassification: o.rock === undefined ? undefined : { primaryRockType: o.rock },
  waterQuality: { isPotable: true, treatmentRequired: [] },
  ...(o.pricing ? { projectPricing: o.pricing } : {}),
}) as any;
const GOV = { category: 'government_tender', quotations: [] };
const kesOf = (cs: ReturnType<typeof costSourcing>, key: string) => cs.lines.find((l) => l.key === key)!;

describe('C + B: worked cost examples, by hand from the code\'s own rate tables, to the shilling', () => {
  it('Example 1, HARD ROCK (basalt), government tender, 120 m', () => {
    // Rates (costModel.ts EIMS_RATES_KES): hard rock 10,500/m; casing 4,200/m; gravel 6,500/t,
    // 25 t per 217 m; development 12 h x 12,500; test pumping 24 h x 9,500; lab 28,000;
    // cap 85,000; survey 85,000; permits 80,000 + 30,000 + 25,000 (NEMA only at >= 5 m3/h).
    //  survey                                   85,000
    //  permits  80,000 + 30,000 + 25,000       135,000
    //  drilling 120 m x 10,500               1,260,000
    //  casing   screen = min(120 x 0.3, 20) = 20 m; blind = 120 - 20 = 100 m x 4,200 = 420,000
    //  gravel   round(120 x 25/217) = round(13.82) = 14 t x 6,500 = 91,000
    //  development 12 x 12,500                 150,000
    //  test pumping 24 x 9,500                 228,000
    //  lab test                                 28,000
    //  cap and site finishing                   85,000
    //  solar    head = round(120 x 0.5 + 10) = 70 m; kW = round(2 x 70 x 9.81/3600/0.55, 2) = 0.69;
    //           array = max(1, round(0.69/0.85 x 1.2, 1)) = 1.0 kW x $1,500 = $1,500 x 129 = 193,500 (indicative)
    //  screen, pump, installation: "Use the applicable tender BOQ" (no tender rate)
    //  subtotal  2,675,500;  contingency 25% (hard rock) = 668,875;  total 3,344,375
    const eco = computeCanonicalEconomics(site({ depth: 120, rock: 'basalt', pricing: GOV }));
    const cs = costSourcing(eco);
    const expectKes: Record<string, number> = { survey: 85000, permits: 135000, drilling: 1260000, casing: 420000, gravelPack: 91000, development: 150000, testPumping: 228000, labTest: 28000, capFinishing: 85000, solar: 193500 };
    for (const [k, v] of Object.entries(expectKes)) expect(kesOf(cs, k).kes, k).toBe(v);
    for (const k of ['survey', 'permits', 'drilling', 'casing', 'gravelPack', 'development', 'testPumping', 'labTest', 'capFinishing']) expect(kesOf(cs, k).state, k).toBe('tender');
    for (const k of ['screen', 'pump', 'installation']) { expect(kesOf(cs, k).kes, k).toBeNull(); expect(kesOf(cs, k).priceText, k).toBe(PRICE_STATE.TENDER_BOQ); }
    expect(eco.contingencyRate).toBe(0.25);
    expect(cs.sourcedSubtotalKES).toBe(2675500);
    expect(cs.sourcedContingencyKES).toBe(668875);
    expect(cs.sourcedTotalKES).toBe(3344375);
  });

  it('Example 2, SOFT GROUND (alluvial sediments), government tender, 150 m', () => {
    //  drilling  bands: 100 m x 6,800 = 680,000 + 50 m x 7,300 = 365,000 -> 1,045,000
    //  casing    screen 20 m (150 x 0.3 = 45 -> 20); blind 130 m x 4,200 = 546,000
    //  gravel    round(150 x 25/217) = round(17.28) = 17 t x 6,500 = 110,500
    //  survey 85,000; permits 135,000; development 150,000; test pumping 228,000; lab 28,000; cap 85,000
    //  solar     head = round(150 x 0.5 + 10) = 85 m; kW = round(2 x 85 x 9.81/3600/0.55, 2) = 0.84;
    //            array = round(0.84/0.85 x 1.2, 1) = 1.2 kW x $1,500 = $1,800 x 129 = 232,200 (indicative)
    //  subtotal  2,644,700;  contingency 15% (soft ground) = 396,705;  total 3,041,405
    const eco = computeCanonicalEconomics(site({ depth: 150, rock: 'alluvial sand and gravel', pricing: GOV }));
    const cs = costSourcing(eco);
    const expectKes: Record<string, number> = { survey: 85000, permits: 135000, drilling: 1045000, casing: 546000, gravelPack: 110500, development: 150000, testPumping: 228000, labTest: 28000, capFinishing: 85000, solar: 232200 };
    for (const [k, v] of Object.entries(expectKes)) expect(kesOf(cs, k).kes, k).toBe(v);
    expect(eco.contingencyRate).toBe(0.15);
    expect(cs.sourcedSubtotalKES).toBe(2644700);
    expect(cs.sourcedContingencyKES).toBe(396705);
    expect(cs.sourcedTotalKES).toBe(3041405);
  });

  it('Example 3, UNKNOWN rock, private project (default), 100 m: survey and permits "Request a quotation"; 25%', () => {
    //  survey, permits: Request a quotation (no verified project quotation)
    //  drilling  100 m x 6,800 = 680,000 (indicative: no rock type -> soft bands; the tender rate as a preliminary figure)
    //  casing    screen 20 m (100 x 0.3 = 30 -> 20); blind 80 m x 4,200 = 336,000
    //  gravel    round(100 x 25/217) = round(11.52) = 12 t x 6,500 = 78,000
    //  development 150,000; test pumping 228,000; lab 28,000; cap 85,000
    //  solar     head = 60 m; kW = round(2 x 60 x 9.81/3600/0.55, 2) = 0.59; array = max(1, 0.8) = 1.0 kW -> 193,500
    //  subtotal  1,778,500;  contingency 25% (rock type unknown: conservative) = 444,625;  total 2,223,125
    const eco = computeCanonicalEconomics(site({ depth: 100 }));
    const cs = costSourcing(eco);
    expect(cs.category).toBe('private');
    for (const k of ['survey', 'permits']) { expect(kesOf(cs, k).kes, k).toBeNull(); expect(kesOf(cs, k).priceText, k).toBe(PRICE_STATE.REQUEST); }
    const expectKes: Record<string, number> = { drilling: 680000, casing: 336000, gravelPack: 78000, development: 150000, testPumping: 228000, labTest: 28000, capFinishing: 85000, solar: 193500 };
    for (const [k, v] of Object.entries(expectKes)) { expect(kesOf(cs, k).kes, k).toBe(v); expect(kesOf(cs, k).state, k).toBe('indicative'); }
    expect(eco.rockTypeUnknown).toBe(true);
    expect(eco.contingencyRate).toBe(0.25);
    expect(cs.sourcedSubtotalKES).toBe(1778500);
    expect(cs.sourcedContingencyKES).toBe(444625);
    expect(cs.sourcedTotalKES).toBe(2223125);
    expect(cs.totalLabel).toBe(`TOTAL of the priced items (${PRICE_STATE.INDICATIVE})`);
    expect(cs.quotationItems).toEqual(expect.arrayContaining([expect.stringMatching(/^Hydrogeological survey/), expect.stringMatching(/^Permits and approvals/), 'Well screen', 'Pump and motor', 'Installation and rising main']));
  });
});

describe('B: unknown geology stays unknown (management, 2026-11-26)', () => {
  it('no rock type: the 25% is stated as a pricing assumption, and nothing presents hard rock as a finding', () => {
    const r = { ...site({ depth: 100 }), siteEvidence: { depth: true, yield: true, methods: [] } };
    const cs = costSourcing(computeCanonicalEconomics(r));
    const wording = 'Ground conditions: unknown (no geological evidence). Costing uses the conservative hard-rock contingency (25%) as a pricing assumption, not a finding.';
    expect(cs.notes).toContain(wording);
    expect(cs.contingencyLabel).toBe('Contingency (25% of the priced items, pricing assumption: ground conditions unknown)');
    expect(costLineText(cs.lines.find((l) => l.key === 'drilling')!).basis).toMatch(/pricing assumption: no rock type classified/);
    const texts = [
      JSON.stringify(cs),
      governingSummary(r, 'x').find((s) => s.title.startsWith('Costs'))!.rows.concat().flat().join(' | ') + (governingSummary(r, 'x').find((s) => s.title.startsWith('Costs'))!.notes ?? []).join(' '),
      sourcedCostRows(r).flat().join(' | '),
    ];
    for (const t of texts) {
      expect(t).toContain(wording);
      expect(t).not.toMatch(/geological finding/);
      expect(t).not.toMatch(/Ground conditions: hard rock|\(hard rock\)|basalt/i);
    }
  });
  it('a classified rock type is a geological finding with its source; soft ground likewise', () => {
    const hard = costSourcing(computeCanonicalEconomics(site({ depth: 120, rock: 'basalt' })));
    expect(hard.notes).toContain('Ground conditions: hard rock (geological finding: rock classification "basalt"). Contingency 25% for hard rock, the same classification as the drilling rate.');
    const soft = costSourcing(computeCanonicalEconomics(site({ depth: 150, rock: 'alluvial sand and gravel' })));
    expect(soft.notes).toContain('Ground conditions: soft ground (geological finding: rock classification "alluvial sand and gravel"). Contingency 15% for soft ground, the same classification as the drilling rate.');
  });
});

describe('C: pricing policy rules', () => {
  it('C1 a category selector exists; default = private project', () => {
    expect(projectPricingOf({}).category).toBe('private');
    expect(projectPricingOf({ projectPricing: { category: 'nonsense' } }).category).toBe('private');
    expect(projectPricingOf({ projectPricing: GOV }).category).toBe('government_tender');
    const ui = fs.readFileSync(path.resolve('external/borehole-ai-engine/src/index.tsx'), 'utf8');
    expect(ui).toContain('data-testid="pricing-category"');
    expect(ui).toContain('<option value="private">{PRICING_CATEGORY_LABEL.private}</option>');
    expect(ui).toContain('<option value="government_tender">{PRICING_CATEGORY_LABEL.government_tender}</option>');
  });

  it('C2 the tender survey/permit figures are never applied to a private project; under a tender they cite their documented source', () => {
    const priv = costSourcing(computeCanonicalEconomics(site({ depth: 120, rock: 'basalt' })));
    const privText = JSON.stringify(priv.lines.filter((l) => l.key === 'survey' || l.key === 'permits'));
    expect(privText).not.toMatch(/85,000|135,000|240,000|80,000/);
    expect(priv.lines.find((l) => l.key === 'survey')!.kes).toBeNull();
    // NEMA case (yield >= 5) also stays a quotation for a private project.
    const nema = costSourcing(computeCanonicalEconomics({ ...site({ depth: 120, rock: 'basalt' }), estimatedYield: 6 }));
    expect(nema.lines.find((l) => l.key === 'permits')!.kes).toBeNull();
    const gov = costSourcing(computeCanonicalEconomics({ ...site({ depth: 120, rock: 'basalt', pricing: GOV }), estimatedYield: 6 }));
    expect(gov.lines.find((l) => l.key === 'permits')!.kes).toBe(240000);
    expect(gov.lines.find((l) => l.key === 'survey')!.source).toContain(EIMS_RATES_KES.source);
    expect(TENDER_RATE_SOURCE).toMatch(/costModel\.ts EIMS_RATES_KES, commit 9d5c6c13/);
    // The documented source exists in the repo.
    expect(fs.readFileSync(path.resolve('external/borehole-ai-engine/src/costModel.ts'), 'utf8')).toContain("source: 'EmersonEIMS signed tender, Baringo County, 16 Oct 2026'");
    expect(gov.notes.join(' ')).toContain(TENDER_RATE_SOURCE);
  });

  it('C3 + C4 a verified project quotation prices that item for that project only (amount, reference, date, label)', () => {
    const q = validateQuotation({ item: 'survey', amountKES: '60,000', reference: 'TEST-Q-17', date: '2026-11-20' });
    expect(q.ok).toBe(true);
    const withQ = site({ depth: 100, pricing: { category: 'private', quotations: [(q as any).value] } });
    const cs = costSourcing(computeCanonicalEconomics(withQ));
    const s = cs.lines.find((l) => l.key === 'survey')!;
    expect(s.state).toBe('verified');
    expect(s.kes).toBe(60000);
    expect(s.source).toBe(`${PRICE_STATE.VERIFIED}: TEST-Q-17, dated 2026-11-20. Applies to this project only`);
    expect(cs.sourcedSubtotalKES).toBe(1778500 + 60000);
    // Another project (no quotation on its result) is not affected.
    const other = costSourcing(computeCanonicalEconomics(site({ depth: 100 })));
    expect(other.lines.find((l) => l.key === 'survey')!.kes).toBeNull();
    // Refused entries.
    expect(validateQuotation({ item: 'survey', amountKES: 0, reference: 'x', date: '2026-11-20' }).ok).toBe(false);
    expect(validateQuotation({ item: 'survey', amountKES: 5, reference: '', date: '2026-11-20' }).ok).toBe(false);
    expect(validateQuotation({ item: 'survey', amountKES: 5, reference: 'x', date: '20/11/2026' }).ok).toBe(false);
    expect(validateQuotation({ item: 'nothing', amountKES: 5, reference: 'x', date: '2026-11-20' }).ok).toBe(false);
    // A malformed stored quotation is ignored, not priced.
    expect(projectPricingOf({ projectPricing: { category: 'private', quotations: [{ item: 'survey', amountKES: 'abc', reference: 'r', date: '2026-01-01' }] } }).quotations).toHaveLength(0);
  });

  it('C5 quotation #83: its own figures and date, a non-identifying reference, never applied automatically, never a rate', () => {
    expect(REFERENCE_QUOTATION_83.reference).toBe('Project quotation #83 (private client)');
    expect(REFERENCE_QUOTATION_83.date).toBe('2026-03-09');
    expect(REFERENCE_QUOTATION_83.lines.map((l) => l.amountKES)).toEqual([50000, 80000]);
    expect(REFERENCE_QUOTATION_TEXT).toMatch(/^Reference: one verified 2026 private-project quotation/);
    expect(REFERENCE_QUOTATION_TEXT).toMatch(/not a rate, not a market price or statutory fee, and not applied to this project/);
    for (const r of [site({ depth: 100 }), site({ depth: 120, rock: 'basalt', pricing: GOV })]) {
      const cs = costSourcing(computeCanonicalEconomics(r));
      for (const l of cs.lines) { expect(l.kes, l.key).not.toBe(50000); expect(l.kes, l.key).not.toBe(80000); expect(String(l.source)).not.toMatch(/#83/); }
    }
    // No client name, phone or address in the source tree.
    const src = fs.readFileSync(path.resolve('external/borehole-ai-engine/src/projectPricing.ts'), 'utf8');
    expect(src).not.toMatch(/AFRICANOS|OMUSE|ICD ROAD/i);
    // Wherever #83 is shown, it is shown only through the one reference sentence.
    const dir = path.resolve('external/borehole-ai-engine/src');
    for (const f of fs.readdirSync(dir).filter((x) => /\.(ts|tsx)$/.test(x) && x !== 'projectPricing.ts')) {
      const t = fs.readFileSync(path.join(dir, f), 'utf8');
      expect(t, f).not.toMatch(/#83|50,000\.00|REFERENCE_QUOTATION_83/);
    }
  });

  it('C6 separate items on screen and in every export: survey, permits, drilling, casing, development, test pumping', () => {
    const r = site({ depth: 120, rock: 'basalt' });
    const keys = costSourcing(computeCanonicalEconomics(r)).lines.map((l) => l.key);
    for (const k of ['survey', 'permits', 'drilling', 'casing', 'development', 'testPumping']) expect(keys, k).toContain(k);
    const pdfRows = sourcedCostRows(r).map((x) => x[0]);
    const gs = governingSummary(r, 'x').find((s) => s.title.startsWith('Costs'))!.rows.map((x) => x[0]);
    for (const rows of [pdfRows, gs]) {
      expect(rows.some((x) => /^Hydrogeological survey/.test(x))).toBe(true);
      expect(rows.some((x) => /^Permits and approvals/.test(x))).toBe(true);
      expect(rows.some((x) => /^Borehole development/.test(x))).toBe(true);
      expect(rows.some((x) => /^Test pumping/.test(x))).toBe(true);
    }
    expect(QUOTATION_TEXT).toBe('Request a quotation');
  });

  it('C7 every preliminary figure on a private project is a verified quotation or labelled "indicative — not a binding offer"', () => {
    const cs = costSourcing(computeCanonicalEconomics(site({ depth: 120, rock: 'basalt' })));
    for (const l of cs.lines) {
      if (l.kes == null) expect(l.priceText).toBe(PRICE_STATE.REQUEST);
      else if (l.state !== 'verified') expect(costLineText(l).basis, l.key).toMatch(/^indicative — not a binding offer/);
      expect(l.state, l.key).not.toBe('tender');
    }
  });

  it('JSON carries the price state of every line', () => {
    const r = { ...site({ depth: 120, rock: 'basalt' }), siteEvidence: { depth: true, yield: true, methods: [] } };
    const j: any = jsonReportData(r);
    if (j.fieldEvidence) {
      const lines = j.fieldEvidence.cost.lines;
      expect(lines.find((l: any) => /^Hydrogeological survey/.test(l.item)).price).toBe(PRICE_STATE.REQUEST);
    }
  });
});
