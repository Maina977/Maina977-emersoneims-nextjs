/**
 * Independent reviewer, re-review at 1e396fa2: the d1da0120 FINDING tests inverted.
 * Copied into fix/building with T1 and W2 (BRE Digest 309) inverted: they now assert the fix
 * (each finding must be gone), A1/A4/A6/E1, engine version, and R-27 tenders (04bfeb24).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BUILDUP_ENGINE_VERSION } from '@/lib/qs/rateBuildUp';
import { compareTenders, parseTenderCsv, type BillLine } from '@/lib/qs/tenders';

const ROOT = join(__dirname, '..', '..');
const html = readFileSync(join(ROOT, 'public', 'eims-building-suite-v20261105.html'), 'utf8');
const calcSrc = readFileSync(join(ROOT, 'lib', 'wizard-api', 'buildingCalcs.ts'), 'utf8');
const seg = (a: string, b: string) => { const i = html.indexOf(a); expect(i, a).toBeGreaterThan(-1); return html.slice(i, html.indexOf(b, i)); };

describe('inverted FINDING tests (d1da0120): gone', () => {
  it('D1: Describe mode has no storeys/units 1 default and no Nairobi coordinates', () => {
    expect(html).not.toMatch(/ext\.stories \|\| 1|ext\.units \|\| 1|gps_lat: -1\.29/);
  });
  it("D2: no hard-coded 'BUNGALOW' in bimQuickBuild and no 180/3/1 prefill", () => {
    expect(seg('async function bimQuickBuild(', '\n}')).not.toContain("'BUNGALOW'");
    expect(html).not.toMatch(/id="bimQ(Area|Beds|Stories)" value="[0-9]/);
  });
  it('N1: daylight card labelled ASSUMED before the ADF figure, no Compliant verdict', () => {
    const card = seg("arch += card('6.1 Daylight Study", '// 6.2 U-value');
    expect(card.indexOf('ASSUMED')).toBeGreaterThan(-1);
    expect(card.indexOf('ASSUMED')).toBeLessThan(card.indexOf('${fmt(adf)}'));
    expect(card).not.toMatch(/Compliant/);
  });
  it('N2: no "All measured items compliant"; dimensions labelled assumed, not measured', () => {
    expect(html).not.toContain('All measured items compliant');
    expect(seg("arch += card('6.5 Accessibility", '// 6.6 Shadow')).toMatch(/ASSUMED typical dimensions[\s\S]*not measured/);
  });
  it('N3: no "Sprinklered: yes" and no sprinklered:true assumption', () => {
    expect(html).not.toContain('Sprinklered: yes');
    expect(html).not.toContain('sprinklered:true');
  });
  it('N4: no built-in FX table and no "CBK rate" conversion of totals', () => {
    expect(html).not.toMatch(/_fxToKES\s*=|indicative CBK rate|USD: 130/);
  });
  it('N5: no fixed Nairobi shadow study; no study without site coordinates', () => {
    expect(html).not.toContain('lat:-1.286, lng:36.817');
    const fn = seg('function repSiteCoords(', '\n');
    const repSiteCoords = new Function(`${fn}; return repSiteCoords;`)();
    expect(repSiteCoords('')).toBeNull();
    expect(repSiteCoords('abc')).toBeNull();
    expect(repSiteCoords('95, 36')).toBeNull();
    expect(repSiteCoords('-0.0917, 34.768')).toEqual({ lat: -0.0917, lng: 34.768 });
  });
});

describe('advisories A1 / A4 / A6 / E1 and version', () => {
  it('A1: AD L 2021 limiting wall 0.26 (notional 0.18); no tropical 0.50; build-up labelled assumed', () => {
    const card = seg("arch += card('6.2 Envelope", '// 6.3 Acoustics');
    expect(card).toMatch(/limiting wall U-value 0\.26/);
    expect(card).toMatch(/notional dwelling uses 0\.18/);
    expect(card).not.toMatch(/0\.50 W|Tropical/i);
    expect(card).toMatch(/ASSUMED build-up/);
    expect(card).not.toMatch(/L1A/);
  });
  it('A4: no "Kenya UBC seismic zones"', () => { expect(html).not.toMatch(/UBC seismic zones/); });
  it('A6: steel/rebar screens show no default M20 / 8.8 / OK / 4T16 / T8@200', () => {
    const s = seg('async function srConnection(', '/* ============ CONSTRUCTION MANAGEMENT');
    expect(s).not.toMatch(/\|\|20\}|\|\|'8\.8'|:'OK'|\|\|4;|\|\|16;|\|\|8\b|\|\|200/);
    expect(s).toMatch(/srNoResult/);
  });
  it('E1 (updated 2026-11-27, standards-access report): ASHRAE 62.1-2022 Table 6-1 and BRE Digest 310 (1986)', () => {
    expect(calcSrc).toContain('ASHRAE 62.1-2022, Table 6-1 (values checked against the free Addendum w reprint)');
    expect(calcSrc).toContain('BRE Digest 310 (1986)'); // W2: the edition used is recorded (Digest 310 holds the ADF; 309 does not)
    expect(calcSrc).toContain('BS 8206-2:2008 (superseded 2022-01-31)');
  });
  it('build-up engine version bumped', () => { expect(BUILDUP_ENGINE_VERSION).toMatch(/^qs-buildup 1\.2\.0/); });
});

describe('R-27 tender comparison (04bfeb24), reviewer hand-worked', () => {
  const BILL: BillLine[] = [
    { code: 'A1', description: 'REV excavation', unit: 'm³', quantity: 42.5 },
    { code: 'A2', description: 'REV hardcore', unit: 'm²', quantity: 120 },
    { code: 'A3', description: 'REV blinding', unit: 'm²', quantity: 118.4 },
  ];
  it('X: 42.5×640 + 120×385 + 118.4×410 = 27,200 + 46,200 + 48,544 = 121,944; Y: 42.5×700 + 120×350 + 118.4×395 = 29,750 + 42,000 + 46,768 = 118,518 (lowest); X is 2.89 % above', () => {
    const X = parseTenderCsv('REV X', 'code,rate\nA1,640\nA2,385\nA3,410');
    const Y = parseTenderCsv('REV Y', 'code,rate\nA1,700\nA2,350\nA3,395');
    const c = compareTenders(BILL, [X, Y]);
    expect(c.tenders.map((t) => [t.total, t.rank])).toEqual([[121944, 2], [118518, 1]]);
    // (121,944 − 118,518) / 118,518 = 2.8907 % → 2.89
    expect(c.tenders[0].overLowestPct).toBe(2.89);
  });
  it('never invents a rate: an unpriced item stays null, the tender is unranked, and the other is ranked alone', () => {
    const X = parseTenderCsv('REV X', 'code,rate\nA1,640\nA2,385');
    const Y = parseTenderCsv('REV Y', 'code,rate\nA1,700\nA2,350\nA3,395');
    const c = compareTenders(BILL, [X, Y]);
    expect(c.rows[2].cells[0]).toEqual({ rate: null, amount: null, tenderedAmount: null, arithmeticError: false });
    expect(c.tenders[0].rank).toBeNull();
    expect(c.tenders[0].notPriced).toEqual(['A3']);
    expect(c.tenders[1].rank).toBe(1);
  });
  it('FIXED T1: a quoted rate with a thousands separator ("1,250.00") is refused with its row, never read as 1', () => {
    // Excel writes 1,250.00 as "1,250.00" in CSV. It is one field after unquoting, and the comma is refused, not guessed.
    expect(() => parseTenderCsv('REV Q', 'code,rate,amount\nA1,"1,250.00"')).toThrow(/REV Q, row 2: 2 field\(s\), the header has 3/);
    expect(() => parseTenderCsv('REV Q2', 'code,rate\nA1,"1,250.00"')).toThrow(/REV Q2, row 2: the rate for A1 "1,250\.00" has a thousands separator/);
  });
});
