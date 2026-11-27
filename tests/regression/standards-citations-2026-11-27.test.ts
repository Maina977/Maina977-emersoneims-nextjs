/**
 * Standards citations corrected from the independent standards-access report of 2026-11-27
 * (EmersonEIMS-proposals/standards-access-2026-11-27/STANDARDS-ACCESS-REPORT.md). Only what the
 * report saw in an official source is cited. Reference strings, labels and comments only: no
 * calculation, threshold or verdict changed (proved separately by a comment/string-stripped
 * comparison with 8dd4be41).
 *
 *  - KS 1515:2000 is a road-vehicle inspection code (KEBS webstore): never cited for earthing.
 *    The Kenyan earthing code is KS 503-2:1990; its clauses were not seen.
 *  - BRE Digest 309 is the sky and externally-reflected components; the average daylight factor
 *    is in Digest 310 (1986).
 *  - IEC 62305-2:2010: probability PX of damage = Annex B, loss LX = Annex C, costs = Annex D;
 *    there is no Annex NB.
 *  - IEC 61643-31 is the PV SPD product/test standard; selection and application is IEC 61643-32.
 *  - IEC 60364-5-52: B.52.2 = PVC two loaded conductors, B.52.4 = PVC three, B.52.5 = XLPE/EPR
 *    three, B.52.14 = air temperature, B.52.15 = ground temperature.
 */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const EXT = /\.(ts|tsx|js|jsx|cjs|mjs|json|html)$/;
function files(dir: string, out: string[] = []): string[] {
  let ents: fs.Dirent[];
  try { ents = fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }); } catch { return out; }
  for (const e of ents) {
    const p = path.join(dir, e.name);
    if (/node_modules|[\\/]tests?[\\/]|^\.next/.test(p)) continue;
    if (e.isDirectory()) files(p, out);
    else if (EXT.test(e.name)) out.push(p);
  }
  return out;
}
const SOURCES = [
  ...['lib', 'components', 'app', 'external/EMERSONEIMS-SolarGeniusPro', 'external/EMERSONEIMS-BUILDING-SUITE-PRO'].flatMap((d) => files(d)),
  ...fs.readdirSync(path.join(ROOT, 'public')).filter((f) => f.endsWith('.html')).map((f) => path.join('public', f)),
];
const grepAll = (re: RegExp) => {
  const hits: string[] = [];
  for (const f of SOURCES) {
    const txt = read(f);
    txt.split(/\r?\n/).forEach((l, i) => { if (re.test(l)) hits.push(`${f}:${i + 1}`); });
  }
  return hits;
};

const SOLAR3 = (f: string) => [
  `lib/solar-genius/server/${f}`,
  `components/solar-modules/crc/server/${f}`,
  `external/EMERSONEIMS-SolarGeniusPro/SolarGeniusPro/crc/server/${f}`,
];

describe('scan coverage', () => {
  it('scans the solar, building and console sources', () => {
    expect(SOURCES.length).toBeGreaterThan(300);
    for (const f of ['lib/wizard-api/buildingCalcs.ts', 'public/eims-building-suite-v20261105.html', 'public/eims-pro-console.html', ...SOLAR3('engineering-pro.js')]) expect(SOURCES.map((s) => s.replace(/\\/g, '/'))).toContain(f);
  });
});

describe('KS 1515 (a road-vehicle inspection code) is not cited for earthing', () => {
  it('no "KS 1515" anywhere in the sources', () => {
    expect(grepAll(/KS\s?1515/)).toEqual([]);
  });
  it('the earthing references name KS 503-2:1990 and say the clause is to be confirmed', () => {
    for (const f of SOLAR3('engineering-pro.js')) {
      const s = read(f);
      expect(s).toContain("KS 503-2:1990 Code of practice for the protection of structures against lightning – Part 2: Code of practice for earthing (Kenyan earthing code; clause to be confirmed against the purchased standard; the ≤ 10 Ω target is not yet attributed to it)");
    }
    for (const f of SOLAR3('engineering-extras.js')) {
      expect(read(f)).toContain('≤ 10 Ω screening target (Kenyan earthing code KS 503-2:1990, clause to be confirmed against the purchased standard; the 10 Ω figure is not yet attributed to it)');
    }
  });
});

describe('average daylight factor: BRE Digest 310, not 309', () => {
  it('no "Digest 309" anywhere in the sources', () => {
    expect(grepAll(/Digest\s?309/)).toEqual([]);
  });
  it('the method and both consoles cite BRE Digest 310 (1986)', () => {
    expect(read('lib/wizard-api/buildingCalcs.ts')).toContain("method: 'Average daylight factor, BRE Digest 310 (1986) / BS 8206-2:2008 (superseded 2022-01-31) formula'");
    for (const f of ['public/eims-building-suite-v20261105.html', 'public/eims-pro-console.html']) expect(read(f)).toContain("refs:['BRE Digest 310 (1986)','BS 8206-2'],");
  });
});

describe('IEC 62305-2: probability is Annex B; there is no Annex NB', () => {
  it('no 62305-2 citation of Annex D for probabilities, and no Annex NB', () => {
    expect(grepAll(/Annex NB/)).toEqual([]);
    expect(grepAll(/62305-2[^\n]*Annex D \(probab/)).toEqual([]);
  });
  it('all three engineering-pro copies cite Annex B (probability) and Annex C (loss) with the contents-list caveat', () => {
    for (const f of SOLAR3('engineering-pro.js')) {
      expect(read(f)).toContain(`reference: 'IEC 62305-2:2010 Annex B "Assessment of probability PX of damage" (probabilities), Annex C "Assessment of amount of loss LX" (loss factors) (annex titles from the official contents list; annex text not reviewed); risk evaluation against the tolerable risk: clause to be confirmed against the purchased standard',`);
    }
  });
});

describe('SPD selection is cited to IEC 61643-32; 61643-31 only for product requirements', () => {
  it('every line naming IEC 61643-31 calls it the product standard and names 61643-32 for selection', () => {
    const lines: string[] = [];
    for (const f of SOURCES) read(f).split(/\r?\n/).forEach((l, i) => { if (l.includes('61643-31')) lines.push(`${f}:${i + 1}: ${l.trim()}`); });
    expect(lines.length).toBeGreaterThanOrEqual(12);
    for (const l of lines) {
      expect(l, l).toMatch(/product/);
      expect(l, l).toMatch(/61643-32/);
    }
  });
  it('the surge-protector selection rule cites 61643-32 with the clause to be confirmed', () => {
    for (const f of SOLAR3('engineering-pro.js')) {
      expect(read(f)).toContain("surgeProtector: 'Per IEC 61643-32 (selection and application principles, SPDs connected to PV installations), SPD selection: coordinate with Up < 80 % equipment Uw (clause to be confirmed against the purchased standard); SPD product requirements per IEC 61643-31',");
    }
    for (const f of SOLAR3('engineering-extras.js')) expect(read(f)).toContain('// SPD selection per IEC 61643-32 for PV systems (clause to be confirmed against the purchased standard)');
  });
});

describe('crc IEC 60364-5-52 table labels match the corrected lib/solar-genius version', () => {
  const PREFIX = "method: 'Base ampacity from IEC 60364-5-52 Table B.52.2 (PVC, two loaded conductors";
  it('lib and both crc copies cite Table B.52.2 for the base ampacity', () => {
    for (const f of SOLAR3('engineering-approval.js')) expect(read(f)).toContain(PREFIX);
  });
  it('the stale crc labels are gone', () => {
    for (const f of SOLAR3('engineering-approval.js').slice(1)) {
      const s = read(f);
      for (const stale of ['B.52.4 (copper', 'B.52.5 (aluminium)', 'B.52.15 (XLPE)', 'two-core PVC', 'Table B.52.14 (PVC)']) expect(s, `${f}: ${stale}`).not.toContain(stale);
      // B.52.14 is the AIR table and B.52.15 the GROUND table, as in lib.
      expect(s).toContain('ambient-air correction Table B.52.14');
      expect(s).toContain('ground temperature, Table B.52.15');
    }
    expect(read('components/solar-modules/crc/core/calculator/SolarCalculatorEngine.ts')).toContain('/** Copper, PVC, two loaded conductors, IEC 60364-5-52 Table B.52.2 method C (A).');
    for (const f of ['components/solar-modules/crc/components/AdvancedFeaturesDashboard.tsx', 'external/EMERSONEIMS-SolarGeniusPro/SolarGeniusPro/crc/components/AdvancedFeaturesDashboard.tsx']) {
      const s = read(f);
      expect(s).not.toContain('Table B.52.14/15');
      expect(s).toContain('(air: Table B.52.14; ground: Table B.52.15)');
    }
  });
  it('B1 ratings name B.52.2 (single phase, two loaded) and B.52.4 (three phase, three loaded)', () => {
    expect(read('components/solar/SolarDesignStudioPro.tsx')).toMatch(/Table B\.52\.2 \(two\s+\/\/ loaded conductors\) for single phase, Table B\.52\.4 \(three loaded conductors\) for three phase/);
  });
});

describe('IEC 60364-7-712:2017 is stated as withdrawn', () => {
  it('every 712 clause citation in the approval engines says the 2017 edition was withdrawn on 21 Oct 2025', () => {
    for (const f of SOLAR3('engineering-approval.js')) {
      const lines = read(f).split(/\r?\n/).filter((l) => /IEC 60364-7-712:2017, clause 712\./.test(l));
      expect(lines.length).toBe(5);
      for (const l of lines) expect(l).toContain('withdrawn on 21 Oct 2025 and is superseded by IEC 60364-7-712:2025');
    }
  });
});

describe('ASHRAE 62.1: 2022 edition, Table 6-1', () => {
  it('the Rp/Ra assumption cites ASHRAE 62.1-2022 Table 6-1 against Addendum w; no 2016 table numbering remains', () => {
    const s = read('lib/wizard-api/buildingCalcs.ts');
    expect(s).toContain('ASHRAE 62.1-2022, Table 6-1, SI; the Rp and Ra values were checked against the free Addendum w reprint');
    expect(s).not.toContain('values checked against the free Addendum w reprint)');
    // The one line that records the old numbering as history is excluded.
    const live = s.split(/\r?\n/).filter((l) => !l.includes('(used here before) is the 2016-and-earlier numbering')).join('\n');
    expect(live).not.toMatch(/Table 6\.2\.2\.[12]\b|Eq\. 6\.2\.2|edition not stated/);
    for (const f of ['public/eims-building-suite-v20261105.html', 'public/eims-pro-console.html']) expect(read(f)).not.toMatch(/ASHRAE 62\.1 Table 6\.2\.2/);
  });
  it('the default densities are unchanged (restaurant 70, health club 40 per 100 m²); Addendum w lowers them, which is flagged, not applied', async () => {
    const c = await import('@/lib/wizard-api/buildingCalcs');
    const occ = (space_type: string) => (c.ventilation({ space_type, floor_area_m2: 100 }) as { occupants_used: number }).occupants_used;
    expect(occ('restaurant')).toBe(70);
    expect(occ('gym')).toBe(40);
    expect(occ('office')).toBe(5);
  });
});
