/**
 * CA-32 third review, item 3: no unverified IEC clause numbers in the solar
 * sources. Nobody has read the clauses of IEC 62548 / 60364 / 62446 / 61215 /
 * 61730 (and the other IEC standards the solar engines cite), so a citation
 * names the standard and the topic and says "clause to be confirmed against
 * the purchased standard" (the STRING_CABLE_BASIS pattern) — never a § or
 * clause number, so no two places can contradict each other (they did: IEC
 * 62548 "Clause 7.3" and "§6.3" both for overcurrent protection).
 *
 * Left, with reasons (not clause numbers of an IEC standard):
 *  - "IEC 60364-5-52 … §G / Annex G": an annex letter (the voltage-drop annex), cited consistently;
 *  - "IFC 2021 §1207", "IEEE 1547-2018 §10", "Engineering Council … §1.4", "NEC 690.x": not IEC;
 *  - IEC 60364-5-52 table numbers (B.52.x): checked against BS 7671 Tables 4D1A/4D2A in the CA-28 review.
 */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const ROOTS = ['lib/solar', 'lib/solar-genius', 'components/solar', 'components/solar-modules', 'components/hub', 'app/solar', 'app/solar-genius-pro', 'app/api/solar', 'external/EMERSONEIMS-SolarGeniusPro'];
const EXT = /\.(ts|tsx|js|jsx|cjs|mjs|json)$/;
// "IEC 6xxxx[-n…][:yyyy]" then, within the same citation (no ; or quote), a clause marker followed by a NUMBER.
const CLAUSE_NUMBER = /IEC\s?6\d{4}(?:-\d+)*(?::\d{4})?[^\n;'"`]{0,40}?(?:§\s?|\b[Cc]lause\s|\b[Cc]l\.\s?)\d+(?:\.\d+)*/g;

function files(dir: string, out: string[] = []): string[] {
  let ents: fs.Dirent[];
  try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of ents) {
    const p = path.join(dir, e.name);
    if (/node_modules|[\\/]tests?[\\/]/.test(p)) continue;
    if (e.isDirectory()) files(p, out);
    else if (EXT.test(e.name)) out.push(p);
  }
  return out;
}

describe('no unverified IEC clause numbers in the solar sources', () => {
  it('scans a non-trivial set of files', () => {
    expect(ROOTS.flatMap((r) => files(path.join(process.cwd(), r))).length).toBeGreaterThan(100);
  });
  it('no "IEC 6xxxx … §n / Clause n / cl. n" remains', () => {
    const hits: string[] = [];
    for (const f of ROOTS.flatMap((r) => files(path.join(process.cwd(), r)))) {
      const txt = fs.readFileSync(f, 'utf8');
      if (!/IEC\s?6/.test(txt)) continue;
      txt.split(/\r?\n/).forEach((l, i) => { for (const m of l.matchAll(CLAUSE_NUMBER)) hits.push(`${path.relative(process.cwd(), f)}:${i + 1}: ${m[0]}`); });
    }
    expect(hits).toEqual([]);
  });
  it('the replaced citations say the clause is to be confirmed', () => {
    const t = fs.readFileSync(path.join(process.cwd(), 'lib/solar/complianceCertificateGenerator.ts'), 'utf8');
    expect(t).toContain("clause: 'IEC 62548, overcurrent protection (clause to be confirmed against the purchased standard)'");
    const se = fs.readFileSync(path.join(process.cwd(), 'lib/solar-genius/server/solar-engineering.js'), 'utf8');
    expect(se).toContain('IEC 62548, overcurrent protection (clause to be confirmed against the purchased standard)');
  });
  it('the pattern catches the forms that were removed', () => {
    for (const s of ['IEC 62548 Clause 7.3', 'IEC 62548 §6.3.3', 'IEC 62446-1 §6.5.1', 'IEC 60364-7-712 §712.433', 'IEC 62548-1:2023 §7.2.2', 'IEC 61727 §4.7']) expect(s.match(CLAUSE_NUMBER), s).not.toBeNull();
    for (const s of ['IEC 62548, overcurrent protection (clause to be confirmed against the purchased standard)', 'IEC 62933-5-2:2020; IFC 2021 §1207', 'IEC 60364-5-52 Annex G']) expect(s.match(CLAUSE_NUMBER), s).toBeNull();
  });
});
