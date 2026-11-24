import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { runPilot, checkFileMeta, PilotFileError, CARDS, CARD_ORDER } from '@/lib/validation/pilots/cards';
import { buildReport, reportJson, reportPdf, sha256Hex, PILOT_STAMP, REVIEWER_FIELDS } from '@/lib/validation/pilots/report';
import { anonymiseTable, letters } from '@/lib/validation/pilots/anonymise';
import { splitCsv } from '@/lib/validation/pilots/csv';
import { SOLAR_TEMPLATE, BOREHOLES_TEMPLATE, QS_TEMPLATE } from '@/lib/validation/pilots/templates';
import { oracleAlarmPackCsv, oracleGuidedSheetCsv } from '@/lib/validation/pilots/oracleTemplates';
import { ingestReviewPack } from '@/lib/generator-oracle/reviewIngest';
import { ORACLE_CSV, SOLAR_CSV, BOREHOLES_CSV, QS_CSV } from './fixtures';

const FILE = { name: 'TEST-ClientCo-records.csv', bytes: 100, sha256: 'a'.repeat(64) };
const NOW = new Date('2026-11-22T10:00:00Z');
const latin1 = (b: Uint8Array) => Buffer.from(b).toString('latin1');
const reason = (r: ReturnType<typeof runPilot>, ref: RegExp) => r.excluded.find((x) => ref.test(x.ref))?.reason ?? '';

describe('Oracle card: parse -> ingestReviewPack -> report', () => {
  const r = runPilot('oracle', ORACLE_CSV, { anonymise: true });
  it('counts only evidenced verdicts and lists the rest with the engine reason', () => {
    expect(r.status).toBe('PARTIAL');
    expect(r.rows.map((x) => [x.ref, x.verdict])).toEqual([['TEST-A1', 'correct'], ['TEST-A4', 'remove']]);
    expect(r.rows[0].evidence).toBe('TEST-MANUAL, edition TEST-ED, page 12; reviewer TEST-REVIEWER [high-risk]');
    expect(reason(r, /TEST-A2/)).toMatch(/without edition; not counted/);
    expect(reason(r, /TEST-A3/)).toMatch(/needs a comment/);
    expect(r.summary).toContainEqual(['Rows not yet reviewed (blank verdict)', '1']);
    expect(r.summary).toContainEqual(['High-risk rows reviewed', '1 of 3']);
    expect(r.notes.join(' ')).toMatch(/no client or site columns/);
  });
  it('the guided-diagnostics pilot sheet is read with reviewer and comment in the right columns', () => {
    const t = splitCsv(oracleGuidedSheetCsv());
    expect(t.header.slice(-4)).toEqual(['reviewerComment', 'edition', 'page', 'reviewer']);
    const row = [...t.rows[0]];
    const set = (c: string, v: string) => { row[t.header.indexOf(c)] = v; };
    set('oemReference', 'TEST-MANUAL'); set('edition', 'TEST-ED'); set('page', '7'); set('reviewer', 'TEST-REVIEWER');
    set('verdict (correct / change / remove)', 'change'); set('reviewerComment', 'TEST: wording');
    const csv = [t.header.join(','), row.map((x) => `"${x}"`).join(',')].join('\n');
    const g = runPilot('oracle', csv, { anonymise: false });
    expect(g.rows).toHaveLength(1);
    expect(g.rows[0].evidence).toMatch(/TEST-MANUAL, edition TEST-ED, page 7; reviewer TEST-REVIEWER; comment: TEST: wording/);
  });
  it('the committed guided sheet (no edition/page/reviewer columns) is refused with a reason', () => {
    const committed = fs.readFileSync(path.resolve('docs/engineering-apps/oracle-guided-diagnostics-review-sheet.csv'), 'utf8');
    expect(() => runPilot('oracle', committed, { anonymise: true })).toThrow(/lacks a "edition" column, a "page" column, a "reviewer" column/);
  });
  it('the exact-header fix leaves the alarm pack ingest unchanged', () => {
    expect(ingestReviewPack(fs.readFileSync(path.resolve('docs/engineering-apps/oracle-alarm-review-pack.csv'), 'utf8')).rowsRead).toBe(375);
  });
});

describe('Solar card: parse -> compareRealSystems -> report', () => {
  const r = runPilot('solar', SOLAR_CSV, { anonymise: false });
  it('gives every month its verdict and evidence, and excludes (never fills) the rest', () => {
    expect(r.rows.map((x) => x.verdict)).toEqual(['5.3 % : within 15 %', '25 % : over 15 %, REASON REQUIRED', '25 % : over 15 %, reason given']);
    expect(r.rows[0].ref).toBe('row 2 (TEST-ClientCo-SYS 2026-01)');
    expect(r.rows[0].evidence).toMatch(/predicted 1000 kWh, measured 950 kWh; source TEST portal, file TEST-ClientCo-export.csv/);
    expect(r.rows.map((x) => x.tone)).toEqual(['ok', 'fail', 'warn']);
    expect(reason(r, /^row 5/)).toBe('excluded, not filled: no measured value');
    expect(reason(r, /^row 6/)).toBe('excluded, not filled: 3 day(s) of missing data');
    expect(reason(r, /^row 7/)).toMatch(/invalid: month must be YYYY-MM/);
    expect(r.excluded).toHaveLength(3);
    expect(r.status).toMatch(/^INSUFFICIENT: 1 of the 10/);
    expect(r.tolerances.join(' ')).toMatch(/more than 15 % off must carry a stated reason/);
  });
});

describe('AquaScan card: parse -> importBoreholesCsv/checkRecords -> report', () => {
  it('accepts, flags, rejects and refuses with the engine reasons', () => {
    const r = runPilot('boreholes', BOREHOLES_CSV, { anonymise: false });
    expect(r.rows.map((x) => [x.ref, x.verdict])).toEqual([['TEST-BH-1', 'accepted'], ['TEST-BH-4', 'accepted, 2 flag(s)']]);
    expect(r.rows[0].evidence).toMatch(/^-1.2921, 36.8219 \(gps\)/);
    expect(reason(r, /TEST-BH-2/)).toMatch(/rejected: Coordinates outside Kenya/);
    expect(reason(r, /TEST-BH-3/)).toMatch(/refused at import: drilledDepthM: "deep" is not a plain number/);
    expect(r.status).toBe('2 of 4 record(s) accepted for validation');
  });
  it('anonymised: site, document and consent labels, coordinates to 0.1 degree, also in the engine report', () => {
    const r = runPilot('boreholes', BOREHOLES_CSV, { anonymise: true });
    expect(r.rows.map((x) => x.ref)).toEqual(['Site 1', 'Site 4']);
    expect(r.rows[0].evidence).toMatch(/^-1.3, 36.8 \(gps\).*source Document 1/);
    const json = reportJson(buildReport(r, FILE, NOW));
    expect(json).not.toMatch(/ClientCo|36\.8219|-1\.2921|TEST-BH-/);
  });
});

describe('Building card: parse -> compareWithReference -> report', () => {
  const r = runPilot('qs', QS_CSV, { anonymise: true });
  it('applies +/-2 % per item and reports the +/-1 % total check', () => {
    expect(r.rows.map((x) => [x.ref, x.verdict])).toEqual([
      ['row 2 (Client A A1)', '1 % : within +/-2 %'],
      ['row 3 (Client A A2)', '5 % : OUTSIDE +/-2 %'],
      ['row 4 (Client A A3)', '0 % : within +/-2 %'],
      ['row 5 (Client A A4)', 'not comparable: reference quantity 0, tool quantity not 0'],
    ]);
    expect(reason(r, /^row 6/)).toMatch(/invalid: referenceQty must be a number/);
    const p = r.summary.find(([k]) => k === 'Project Client A')?.[1] ?? '';
    expect(p).toMatch(/4 item\(s\), 1 outside \+\/-2 %/);
    expect(p).toMatch(/FAIL$/);
    expect(r.tolerances[0]).toMatch(/\+\/-2 %/);
    expect(r.tolerances[1]).toMatch(/\+\/-1 %/);
    expect(r.anonymisedColumns).toEqual({ project: 1, drawingSet: 1, referenceSource: 1 });
  });
});

describe('report: stamp, hash, date, engine version, blank reviewer section', () => {
  it('JSON is stamped and the reviewer fields are blank', () => {
    for (const id of CARD_ORDER) {
      const csv = { oracle: ORACLE_CSV, solar: SOLAR_CSV, boreholes: BOREHOLES_CSV, qs: QS_CSV }[id];
      const rep = buildReport(runPilot(id, csv, { anonymise: true }), FILE, NOW);
      expect(rep.stamp).toBe(PILOT_STAMP);
      expect(PILOT_STAMP).toBe('PILOT COMPARISON — for reviewer assessment, not a certification');
      expect(rep.file.sha256).toBe(FILE.sha256);
      expect(rep.generatedAt).toBe('2026-11-22T10:00:00.000Z');
      expect(rep.engine).toBe(CARDS[id].engine);
      expect(rep.tool).toMatch(/^pilot-comparison \d/);
      expect(rep.file.name).toMatch(/withheld/);
      expect([rep.reviewer.name, rep.reviewer.registration, rep.reviewer.date, rep.reviewer.signature, rep.reviewer.conclusion].every((x) => x === '')).toBe(true);
      expect(reportJson(rep)).not.toMatch(/"verified": ?true|\bcertified\b/i);
    }
  });
  it('PDF carries the stamp, hash, engine and the blank reviewer fields; anonymised PDF holds no client name', () => {
    const rep = buildReport(runPilot('qs', QS_CSV, { anonymise: true }), FILE, NOW);
    const pdf = latin1(reportPdf(rep));
    expect(pdf.startsWith('%PDF')).toBe(true);
    expect(pdf).toContain('PILOT COMPARISON');
    expect(pdf).toContain('for reviewer assessment, not a certification');
    expect(pdf).toContain(FILE.sha256);
    expect(pdf).toContain('compareWithReference');
    // PDF string syntax escapes parentheses.
    for (const f of REVIEWER_FIELDS) expect(pdf).toContain(f.replace(/[()]/g, (m) => `\\${m}`));
    expect(pdf).not.toContain('ClientCo');
  });
  it('without anonymising, names and the file name are shown as in the file', () => {
    const rep = buildReport(runPilot('qs', QS_CSV, { anonymise: false }), FILE, NOW);
    expect(rep.file.name).toBe(FILE.name);
    expect(reportJson(rep)).toContain('TEST ClientCo House');
  });
  it('sha256Hex matches the FIPS 180-2 test vector', async () => {
    expect(await sha256Hex(new TextEncoder().encode('abc'))).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });
});

describe('anonymisation', () => {
  it('same value, same label; blanks stay blank; letters run A..Z, AA', () => {
    const t = splitCsv('project,x\nAcme,1\nBeta,2\nAcme,3\n,4\n');
    const a = anonymiseTable(t, [{ column: 'project', label: 'Client', style: 'letter' }]);
    expect(a.table.rows.map((r) => r[0])).toEqual(['Client A', 'Client B', 'Client A', '']);
    expect(a.replaced).toEqual({ project: 2 });
    expect([letters(0), letters(25), letters(26), letters(27)]).toEqual(['A', 'Z', 'AA', 'AB']);
  });
  it('solar sites become "Site 1" and no client name survives in rows, summary or engine report', () => {
    const r = runPilot('solar', SOLAR_CSV, { anonymise: true });
    expect(r.rows[0].ref).toBe('row 2 (Site 1 2026-01)');
    expect(r.rows[0].evidence).toMatch(/file Meter file 1/);
    expect(JSON.stringify(r)).not.toContain('ClientCo');
  });
  it('anonymising does not change any verdict', () => {
    for (const [id, csv] of [['solar', SOLAR_CSV], ['qs', QS_CSV], ['boreholes', BOREHOLES_CSV]] as const) {
      const a = runPilot(id, csv, { anonymise: true }), b = runPilot(id, csv, { anonymise: false });
      expect(a.rows.map((x) => x.verdict)).toEqual(b.rows.map((x) => x.verdict));
      expect(a.status).toBe(b.status);
      expect(a.excluded.length).toBe(b.excluded.length);
    }
  });
});

describe('bad files are refused with a message', () => {
  it('wrong template for the card', () => {
    expect(() => runPilot('solar', QS_CSV, { anonymise: true })).toThrow(PilotFileError);
    expect(() => runPilot('solar', QS_CSV, { anonymise: true })).toThrow(/not the Solar: measured versus predicted production template: it lacks systemId/);
    expect(() => runPilot('boreholes', SOLAR_CSV, { anonymise: true })).toThrow(/lacks id, lat, lon/);
  });
  it('binary, empty or header-less content', () => {
    expect(() => runPilot('qs', 'PK\u0003\u0004binary', { anonymise: true })).toThrow(/not a CSV text file/);
    expect(() => runPilot('qs', 'a\u0000b', { anonymise: true })).toThrow(/not a CSV text file/);
    expect(() => runPilot('qs', '# only a comment\n', { anonymise: true })).toThrow(/no header row/);
  });
  it('wrong extension, empty or oversized file', () => {
    expect(() => checkFileMeta('records.xlsx', 10)).toThrow(/not a .csv file/);
    expect(() => checkFileMeta('records.csv', 0)).toThrow(/is empty/);
    expect(() => checkFileMeta('records.csv', 6 * 1024 * 1024)).toThrow(/larger than 5 MB/);
    expect(() => checkFileMeta('records.CSV', 10)).not.toThrow();
  });
});

describe('blank templates', () => {
  const doc = (p: string) => fs.readFileSync(path.resolve(p), 'utf8').replace(/\r\n/g, '\n');
  it('the short templates are exact copies of the committed files', () => {
    expect(SOLAR_TEMPLATE).toBe(doc('docs/solar-validation/real-system-comparison-template.csv'));
    expect(BOREHOLES_TEMPLATE).toBe(doc('docs/aquascan-validation/boreholes-template.csv'));
    expect(QS_TEMPLATE).toBe(doc('docs/qs-validation/drawing-boq-comparison-template.csv'));
  });
  it('the generated alarm pack is the committed pack; the guided sheet is the committed sheet plus three columns', () => {
    expect(oracleAlarmPackCsv()).toBe(doc('docs/engineering-apps/oracle-alarm-review-pack.csv'));
    const committed = splitCsv(doc('docs/engineering-apps/oracle-guided-diagnostics-review-sheet.csv'));
    const pilot = splitCsv(oracleGuidedSheetCsv());
    expect(pilot.header).toEqual([...committed.header, 'edition', 'page', 'reviewer']);
    expect(pilot.rows.map((r) => r.slice(0, committed.header.length))).toEqual(committed.rows);
  });
  it('every blank template loads in its own card without refusal and without invented results', () => {
    expect(runPilot('solar', SOLAR_TEMPLATE, { anonymise: true }).rows).toEqual([]);
    expect(runPilot('boreholes', BOREHOLES_TEMPLATE, { anonymise: true }).rows).toEqual([]);
    expect(runPilot('qs', QS_TEMPLATE, { anonymise: true }).rows).toEqual([]);
    expect(runPilot('oracle', oracleAlarmPackCsv(), { anonymise: true }).status).toBe('NO REVIEW YET');
    expect(runPilot('oracle', oracleGuidedSheetCsv(), { anonymise: true }).status).toBe('NO REVIEW YET');
  });
});
