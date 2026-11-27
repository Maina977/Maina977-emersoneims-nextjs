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
 *
 * 2026-11-27 (standards-access report, STANDARDS-ACCESS-REPORT.md): a clause number IS allowed
 * where an official contents list or preview showed that clause number and title. Such a
 * citation names the edition, the clause number and the title and carries VERIFIED_MARK; the
 * number must be one of VERIFIED_CLAUSES for that standard. The rule text was not read, so a
 * rule or threshold still says it is to be confirmed against the purchased standard.
 */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const ROOTS = ['lib/solar', 'lib/solar-genius', 'components/solar', 'components/solar-modules', 'components/hub', 'app/solar', 'app/solar-genius-pro', 'app/api/solar', 'external/EMERSONEIMS-SolarGeniusPro'];
const EXT = /\.(ts|tsx|js|jsx|cjs|mjs|json)$/;
// "IEC 6xxxx[-n…][:yyyy]" then, within the same citation (no ; or quote), a clause marker followed by a NUMBER.
const CLAUSE_NUMBER = /IEC\s?6\d{4}(?:-\d+)*(?::\d{4})?[^\n;'"`]{0,40}?(?:§\s?|\b[Cc]lause\s|\b[Cc]l\.\s?)\d+(?:\.\d+)*/g;
/** The only form under which a clause number may be cited (seen in an official contents list). */
const VERIFIED_MARK = '(clause number from the official contents list; clause text not reviewed)';
/** Clause numbers the standards-access report (2026-11-27) saw, with titles, in an official contents list. */
const VERIFIED_CLAUSES: Record<string, { edition: string; clauses: string[] }> = {
  '62446-1': { edition: 'IEC 62446-1:2016', clauses: ['4', '4.3', '5.2', '5.2.6', '5.2.10', '6', '6.1', '6.2', '6.4', '6.5.2', '6.6', '6.7', '9.2'] },
  '62548-1': { edition: 'IEC 62548-1:2023+AMD1:2025', clauses: ['6.5.2', '6.5.3', '6.6', '7.2.2', '7.2.5', '7.2.7', '7.2.8', '7.2.9', '7.3.1', '7.3.2', '10.4', '10.5', '10.7'] },
  '60364-7-712': { edition: 'IEC 60364-7-712:2017', clauses: ['712.43', '712.514', '712.52', '712.536'] },
  '62305-3': { edition: 'IEC 62305-3:2024', clauses: ['5.2.2'] },
};
/** A hit is allowed only with the mark, the stated edition, and a clause number the report saw. */
function isVerifiedCitation(hit: string, line: string): boolean {
  if (!line.includes(VERIFIED_MARK)) return false;
  // The citation is the LAST standard named in the hit ("IEC 60617 symbols / IEC 62446-1:2016 clause 4.3").
  const last = [...hit.matchAll(/IEC\s?(6\d{4}(?:-\d+)*)/g)].pop();
  if (!last) return false;
  const v = VERIFIED_CLAUSES[last[1]];
  if (!v || !hit.slice(last.index).startsWith(v.edition)) return false;
  const num = hit.match(/(\d+(?:\.\d+)*)$/)?.[1] ?? '';
  return v.clauses.includes(num);
}

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
      txt.split(/\r?\n/).forEach((l, i) => { for (const m of l.matchAll(CLAUSE_NUMBER)) if (!isVerifiedCitation(m[0], l)) hits.push(`${path.relative(process.cwd(), f)}:${i + 1}: ${m[0]}`); });
    }
    expect(hits).toEqual([]);
  });
  it('every line carrying the contents-list mark cites only clause numbers the report saw', () => {
    const all = new Set(Object.values(VERIFIED_CLAUSES).flatMap((v) => v.clauses));
    const bad: string[] = [];
    let marked = 0;
    for (const f of ROOTS.flatMap((r) => files(path.join(process.cwd(), r)))) {
      const txt = fs.readFileSync(f, 'utf8');
      if (!txt.includes(VERIFIED_MARK)) continue;
      txt.split(/\r?\n/).forEach((l, i) => {
        if (!l.includes(VERIFIED_MARK)) return;
        marked++;
        for (const m of l.matchAll(/\b[Cc]lause (\d+(?:\.\d+)*)/g)) if (!all.has(m[1])) bad.push(`${path.relative(process.cwd(), f)}:${i + 1}: clause ${m[1]}`);
      });
    }
    expect(marked).toBeGreaterThan(30);
    expect(bad).toEqual([]);
  });
  it('the replaced citations name the contents-list clause, and the unread rule stays "to be confirmed"', () => {
    const t = fs.readFileSync(path.join(process.cwd(), 'lib/solar/complianceCertificateGenerator.ts'), 'utf8');
    expect(t).toContain(`clause: 'IEC 62548-1:2023+AMD1:2025, clause 6.5.2 Requirement for overcurrent protection ${VERIFIED_MARK}; the more-than-2-strings-in-parallel condition is to be confirmed against the purchased standard'`);
    expect(t).not.toContain("clause: 'IEC 62548, overcurrent protection (clause to be confirmed against the purchased standard)'");
    const se = fs.readFileSync(path.join(process.cwd(), 'lib/solar-genius/server/solar-engineering.js'), 'utf8');
    expect(se).toContain(`IEC 62548-1:2023+AMD1:2025, clause 6.5.2 Requirement for overcurrent protection and clause 7.2.5 Fuses ${VERIFIED_MARK}; the 1.56 × Isc fuse rule is to be confirmed against the purchased standard`);
  });
  it('the allow-list accepts only the marked, edition-stated, seen clause numbers', () => {
    const ok = `IEC 62446-1:2016, clause 6.7 PV array insulation resistance test ${VERIFIED_MARK}`;
    expect(isVerifiedCitation(ok.match(CLAUSE_NUMBER)![0], ok)).toBe(true);
    for (const s of [
      'IEC 62446-1:2016, clause 6.7 PV array insulation resistance test', // no mark
      `IEC 62446-1, clause 6.7 PV array insulation resistance test ${VERIFIED_MARK}`, // no edition
      `IEC 62446-1:2016, clause 6.8 Something ${VERIFIED_MARK}`, // not seen
      `IEC 61727:2004, clause 4.7 Something ${VERIFIED_MARK}`, // standard not in the report's TOC list
    ]) expect(isVerifiedCitation(s.match(CLAUSE_NUMBER)![0], s), s).toBe(false);
  });
  it('the pattern catches the forms that were removed', () => {
    for (const s of ['IEC 62548 Clause 7.3', 'IEC 62548 §6.3.3', 'IEC 62446-1 §6.5.1', 'IEC 60364-7-712 §712.433', 'IEC 62548-1:2023 §7.2.2', 'IEC 61727 §4.7']) expect(s.match(CLAUSE_NUMBER), s).not.toBeNull();
    for (const s of ['IEC 62548, overcurrent protection (clause to be confirmed against the purchased standard)', 'IEC 62933-5-2:2020; IFC 2021 §1207', 'IEC 60364-5-52 Annex G']) expect(s.match(CLAUSE_NUMBER), s).toBeNull();
  });
});
