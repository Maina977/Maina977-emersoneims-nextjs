/**
 * Independent review of 8dd4be41..328c44aa (REVIEW-STANDARDS-CITATIONS-328c44aa.md): the
 * citation must-fixes M1-M3 (text only; numbers asserted unchanged below). M4 (the live cable
 * sizers) is a separate commit with its own test.
 */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { ventilation } from '@/lib/wizard-api/buildingCalcs';

const ROOT = process.cwd();
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const DENS = 'ASHRAE 62.1-2022 default density, before Addendum w (2025); not verified, so enter the design occupancy';
const RULE = '(rule to be confirmed against the purchased standard)';
const SOLAR3 = (f: string) => [`lib/solar-genius/server/${f}`, `components/solar-modules/crc/server/${f}`, `external/EMERSONEIMS-SolarGeniusPro/SolarGeniusPro/crc/server/${f}`];

describe('M1: the restaurant and health-club default densities are not called checked', () => {
  type V = { occupants_used: number; assumptions: string[]; method: string };
  it('restaurant (70) and health club (40) say "not verified, so enter the design occupancy"; the numbers are unchanged', () => {
    const r = ventilation({ space_type: 'restaurant', floor_area_m2: 100 }) as V;
    const g = ventilation({ space_type: 'gym', floor_area_m2: 100 }) as V;
    expect(r.occupants_used).toBe(70);
    expect(g.occupants_used).toBe(40);
    expect(r.assumptions.join(' ')).toContain(`default 70 per 100 m²: ${DENS}`);
    expect(g.assumptions.join(' ')).toContain(`default 40 per 100 m²: ${DENS}`);
    for (const o of [r, g]) expect(o.method).toContain('the restaurant and health-club defaults not verified (Addendum w (2025) lowers them)');
  });
  it('the other spaces carry no density caveat, and nothing says "values checked"', () => {
    const o = ventilation({ space_type: 'office', floor_area_m2: 100 }) as V;
    expect(o.occupants_used).toBe(5);
    expect(o.assumptions.join(' ')).not.toContain('not verified');
    expect(o.assumptions[0]).toContain('the Rp and Ra values were checked against the free Addendum w reprint');
    for (const f of ['lib/wizard-api/buildingCalcs.ts', 'public/eims-building-suite-v20261105.html', 'public/eims-pro-console.html']) {
      expect(read(f), f).not.toContain('values checked');
    }
    for (const f of ['public/eims-building-suite-v20261105.html', 'public/eims-pro-console.html']) {
      expect(read(f)).toContain('ASHRAE 62.1-2022 Table 6-1 (Rp, Ra checked against the free Addendum w reprint; restaurant and health-club default densities not verified, before Addendum w (2025))');
    }
  });
});

describe('M2: no wrong IEC 60364-5-52 edition remains', () => {
  it('no "AMD1:2011" and no "60364-5-52:2020"', () => {
    for (const f of [...SOLAR3('engineering-approval.js'), ...SOLAR3('solar-engineering.js')]) {
      const s = read(f);
      expect(s, f).not.toMatch(/60364-5-52:2009\+AMD1:2011|60364-5-52:2020/);
    }
    for (const f of SOLAR3('engineering-approval.js')) expect(read(f)).toContain("reference: 'IEC 60364-5-52:2009+AMD1:2024 (consolidated edition 3.1, 2024-11; tabulated values to be confirmed against the purchased standard)");
    for (const f of SOLAR3('solar-engineering.js')) expect(read(f)).toContain(" * Source: IEC 60364-5-52:2009 Annex G (informative), voltage drop in consumers' installations;");
  });
});

describe('M3: unread IEC 62548-1 rules say they are to be confirmed', () => {
  it('every IEC 62548 reference in the design checks carries the caveat', () => {
    const lines = read('lib/solar/design/validate.ts').split(/\r?\n/).filter((l) => /(reference:|const IEC62548 =)[^\n]*IEC 62548/.test(l));
    expect(lines.length).toBeGreaterThanOrEqual(6);
    for (const l of lines) expect(l, l).toMatch(/to be confirmed against the purchased standard/);
    for (const id of ["'IEC 62548-1 (1.25 × Isc for irradiance above STC) ", "'IEC 62548-1 overcurrent protection of PV strings ", "reference: 'IEC 62548-1 (rule", "'IEC 62548-1 string overcurrent protection ", "'IEC 62548-1 (PV cable current 1.25 × Isc per string) "]) {
      expect(read('lib/solar/design/validate.ts')).toContain(id);
    }
  });
  it('the string-sizing source in every solar-engineering copy carries the caveat', () => {
    for (const f of SOLAR3('solar-engineering.js')) expect(read(f)).toContain(`source: 'IEC 62548 string sizing rules ${RULE}; manufacturer datasheet temperature coefficients'`);
    expect(read('lib/solar-genius/server/solar-engineering.js')).toContain(`IEC 60364-4-43; IEC 62548 ${RULE}; NEC 690.8`);
  });
});
