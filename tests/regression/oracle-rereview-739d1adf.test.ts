/**
 * Regression tests from the independent re-review of 739d1adf (2026-11-25,
 * ORACLE-BRANCH-739d1adf-REREVIEW.md + scratch/rereview-739d1adf/). The
 * reviewer's reproductions are kept with their inputs and assert the REQUIRED
 * behaviour. TEST values only.
 */
import { describe, it, expect } from 'vitest';
import { FAMILIES, NO_START, EXHAUST_SMOKE, NO_VOLTAGE, LOW_OIL_PRESSURE, OVERHEATING, CHARGING } from '@/lib/generator-oracle/diagnostics/families';
import { diagnose, UNCLASSIFIED_PROTECTIVE, SAFEGUARD_LABEL } from '@/lib/generator-oracle/diagnostics/engine';
import { answersFromRaw, type RawAnswers } from '@/lib/generator-oracle/diagnostics/session';
import { recordToCardUpdate, sessionRecord } from '@/lib/generator-oracle/diagnostics/jobCardRecord';
import { publishedLimitFor } from '@/lib/generator-oracle/diagnostics/oemReferences';
import { SCREEN_BUCKET, SCREEN_QUESTIONS } from '@/lib/generator-oracle/diagnostics/safetyScreen';
import { openJobCard, jobCardReport, jobCardReportParts, type Asset } from '@/lib/generator-oracle/service/maintenance';
import { jobCardToPdf } from '@/lib/generator-oracle/service/jobCardPdf';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import type { FaultFamily } from '@/lib/generator-oracle/diagnostics/types';

const screenAll = (over: Record<string, string> = {}) => ({ ...Object.fromEntries(SCREEN_QUESTIONS.map((q) => [q.id, 'no'])), ...over });
const one = (f: FaultFamily, own: Record<string, string>, screen: Record<string, string> = screenAll()) => sessionRecord(f, { [SCREEN_BUCKET]: screen, [f.id]: own });
const KEEP_RUNNING = /reduce the load|re-?measure|watch the battery|governor checks|shed sensitive loads|before further diagnosis|measure live|duty cycle|returns? to (normal duty|service)|if it rises/i;
const asset: Asset = { id: 'A1', make: 'X', model: 'Y', engine: 'E', controller: 'C', serial: 'S', ratedKva: 100 };

// Words that mean the answer or the step needs cranking, running or live circuits (reviewer's list).
const RUNNING_WORDS = /\b(crank|cranks|cranking|cranked|running|while running|under load|live|energised|energized|supply present|cut-out|start the engine|run the set|load test)\b/i;
// Negated or prohibiting forms are instructions not to do it.
const stripNegations = (s: string) => s.replace(/\b(do not|don't|never|not)\s+(\w+)(\s+(or|and)\s+\w+)?/gi, '');

describe('R1 (BLOCKING) / R2: no cranking, running or live question or step can follow a STOP', () => {
  it('X1: seized engine on the safety screen → "Exhaust while cranking" is not the next check', () => {
    const r = one(NO_START, { fuelLevel: 'ok', fuelAtFilter: 'yes', ecmCode: 'no', cold: 'warm', oemMinCrankRpm: '100' }, screenAll({ 'screen.seized': 'yes' }));
    expect(r.result.stopActive).toBe(true);
    expect(r.result.nextQuestion?.id).not.toBe('smoke');
    expect(r.result.nextQuestion?.needsRunning).toBeFalsy();
    expect(r.lines.find((l) => l.startsWith('Next check'))).not.toMatch(/cranking/i);
  });
  it('X2: milky-oil STOP in exhaust smoke → no next check mentions a cylinder cut-out', () => {
    for (const own of [{ oilCondition: 'milky' }, { oilCondition: 'milky', colour: 'black' }, { oilCondition: 'milky', colour: 'black', airFilter: 'ok' }, { oilCondition: 'milky', colour: 'black', airFilter: 'ok', smell: 'raw-fuel' }]) {
      const r = one(EXHAUST_SMOKE, own as Record<string, string>);
      expect(r.result.stopActive).toBe(true);
      expect(`${r.result.nextQuestion?.text ?? ''} ${r.result.nextQuestion?.kind === 'choice' ? r.result.nextQuestion.options.map((o) => o.label).join(' ') : ''}`).not.toMatch(/cut-out/i);
    }
  });
  it('R2: the AVR "supply present" question needs live circuits and is flagged', () => {
    expect(NO_VOLTAGE.questions.find((q) => q.id === 'avrFuse')!.needsRunning).toBe(true);
    const r = one(NO_VOLTAGE, { insulation: '0' });
    expect(r.result.stopActive).toBe(true);
    expect(r.result.nextQuestion?.id).not.toBe('avrFuse');
  });
  it('AUDIT: every question in all 10 families whose text, help or options use running/cranking/live wording is flagged needs-running', () => {
    const unflagged: string[] = [];
    for (const f of FAMILIES) for (const q of f.questions) {
      // OEM figures are typed from the manual or settings sheet, not measured: answering needs no running.
      if (q.kind === 'number' && q.oemLimit) continue;
      const words = [q.text, q.help ?? '', ...(q.kind === 'choice' ? q.options.map((o) => o.label) : [])].map(stripNegations);
      if (words.some((w) => RUNNING_WORDS.test(w)) && !q.needsRunning) unflagged.push(`${f.id}.${q.id}: ${q.text}`);
    }
    expect(unflagged).toEqual([]);
  });
  it('AUDIT: no always-shown step in any family uses running/cranking/live wording (negated prohibitions excepted)', () => {
    const bad: string[] = [];
    for (const f of FAMILIES) for (const c of f.causes) for (const a of c.actions) if (RUNNING_WORDS.test(stripNegations(a))) bad.push(`${f.id}.${c.id}: ${a}`);
    expect(bad).toEqual([]);
  });
});

describe('R3: a leading "do not run" cause suppresses running-implying cautions, as a STOP does', () => {
  it.each([
    ['N10a: recent overhaul + oil temperature at a warning maximum', LOW_OIL_PRESSURE, { recentWork: 'overhaul', oilTemp: '130', oemMaxOilTemp: '130', 'oemMaxOilTemp.class': 'warning' }],
    ['N10b: white smoke at 120 % load', EXHAUST_SMOKE, { colour: 'white', loadPct: '120' }],
  ] as const)('%s', (_n, f, own) => {
    const r = one(f as FaultFamily, own as Record<string, string>).result;
    expect(r.runningWithheld).toBe(true);
    for (const s of r.stops.filter((x) => x.level === 'CAUTION')) expect(s.message).not.toMatch(KEEP_RUNNING);
    for (const c of r.ranked) for (const a of c.actions) expect(a).not.toMatch(/\bOnly when no STOP is active/);
  });
  it('the record-only wording says why running is withheld', () => {
    const r = one(LOW_OIL_PRESSURE, { recentWork: 'overhaul', oilTemp: '130', oemMaxOilTemp: '130', 'oemMaxOilTemp.class': 'warning' }).result;
    expect(r.stops.some((s) => /^Also recorded for the investigation \(running is withheld: a leading cause says do not run\)/.test(s.message))).toBe(true);
  });
});

describe('R4: "Use published value" requires an exact plate match', () => {
  const sel = { engine: '1104D (Mech) Industrial Engine NK' };
  const offered = (eq: object) => publishedLimitFor({ ...sel, ...eq }, 'overheating', 'oemAlarmCoolantTemp') !== null;
  it.each([
    [{ manufacturer: 'Perkins', model: '1104D-E44TA' }], [{ manufacturer: 'Perkins', model: '1104D-44TA' }], [{ manufacturer: 'Perkins', model: '1' }],
    [{ manufacturer: 'Perkins', model: 'd' }], [{ manufacturer: 'Perkins', model: 'engine' }], [{ manufacturer: 'P', model: '1104D (Mech) Industrial Engine NK' }],
    [{ manufacturer: 'Perkins', model: '1104C-44' }], [{ manufacturer: 'Perkins', model: 'C4.4' }], [{ manufacturer: 'Caterpillar', model: '1104D (Mech) Industrial Engine NK' }],
    [{ manufacturer: 'Perkins', model: '1104D (Mech) Industrial Engine NL' }], [{ manufacturer: 'Perkins', model: '1104D Electronic Industrial Engine NK' }], [{}], [{ manufacturer: 'Perkins' }],
  ])('refused: %o', (eq) => expect(offered(eq)).toBe(false));
  it('offered only for the exact manufacturer and full model designation (case, spaces, hyphens ignored)', () => {
    expect(offered({ manufacturer: 'Perkins', model: '1104D (Mech) Industrial Engine NK' })).toBe(true);
    expect(offered({ manufacturer: ' perkins ', model: '1104D (MECH) Industrial-Engine  NK' })).toBe(true);
    expect(publishedLimitFor({ engine: '1104D (Mech) Industrial Engine NL', manufacturer: 'Perkins', model: '1104D (Mech) Industrial Engine NL' }, 'overheating', 'oemAlarmCoolantTemp')).not.toBeNull();
  });
});

describe('R5: a "Not checked" safety screen is acknowledged', () => {
  it('all items "Not checked" → CAUTION that safety is not confirmed', () => {
    const nc = Object.fromEntries(SCREEN_QUESTIONS.map((q) => [q.id, 'not-checked']));
    const r = one(OVERHEATING, {}, nc).result;
    expect(r.stops.some((s) => s.level === 'CAUTION' && /Safety screen not completed.*safety is NOT confirmed/.test(s.message))).toBe(true);
    expect(one(OVERHEATING, {}).result.stops.some((s) => /Safety screen not completed/.test(s.message))).toBe(false);
  });
});

describe('R6: near-zero readings — only when the technician confirms the instrument reads zero', () => {
  it('0.5 kPa alone is not judged (no invented threshold); confirmed "at or near zero" → labelled safeguard STOP', () => {
    const alone = one(LOW_OIL_PRESSURE, { oilPressure: '0.5' }).result;
    expect(alone.stopActive).toBe(false);
    expect(alone.nextQuestion?.id).toBe('oilPressureAtZero'); // the confirmation is asked next
    const confirmed = one(LOW_OIL_PRESSURE, { oilPressure: '0.5', oilPressureAtZero: 'yes' }).result;
    expect(confirmed.stops[0]).toMatchObject({ level: 'STOP', label: 'This is a conservative software safeguard, not an OEM limit.' });
    expect(one(NO_VOLTAGE, { insulation: '0.01', insulationAtZero: 'yes' }).result.stopActive).toBe(true);
    expect(one(NO_VOLTAGE, { insulation: '0.01' }).result.stopActive).toBe(false);
  });
});

describe('R7: the exact protective wording on other tabs', () => {
  it('N9: verbatim management text, label kept, the source family on its own line', () => {
    const rec = sessionRecord(CHARGING, { 'low-oil-pressure': { oilPressure: '140', oemMinOilPressure: '150' } });
    const s = rec.result.stops.find((x) => x.origin === 'other-family')!;
    expect(s.message).toBe(UNCLASSIFIED_PROTECTIVE);
    expect(s.label).toBe(SAFEGUARD_LABEL);
    expect(s.from).toBe('Low oil pressure / oil starvation');
    const i = rec.lines.indexOf(`STOP: ${UNCLASSIFIED_PROTECTIVE}`);
    expect(rec.lines.slice(i, i + 3)).toEqual([`STOP: ${UNCLASSIFIED_PROTECTIVE}`, SAFEGUARD_LABEL, '(Raised in the "Low oil pressure / oil starvation" diagnosis of this session.)']);
  });
});

describe('Final re-review MINOR: the SAFETY section at the top of the .txt and PDF carries the "(Raised in …)" line', () => {
  it('a STOP from another family is repeated at the top with its label and its source line, in the .txt and the PDF', async () => {
    const rec = sessionRecord(CHARGING, { 'low-oil-pressure': { oilPressure: '140', oemMinOilPressure: '150' } });
    const card = { ...openJobCard({ id: 'J', assetId: 'A1', opened: '2026-11-25', reportedFault: 'x', technician: 'T' }), ...recordToCardUpdate({ findings: '', readings: [] }, rec) } as ReturnType<typeof openJobCard>;
    const raised = '(Raised in the "Low oil pressure / oil starvation" diagnosis of this session.)';
    const parts = jobCardReportParts(card, asset);
    expect(parts.sections[0].heading).toMatch(/^SAFETY — STOP/);
    const top = parts.sections[0].lines;
    const i = top.indexOf(`  STOP: ${UNCLASSIFIED_PROTECTIVE}`);
    expect(top.slice(i, i + 3)).toEqual([`  STOP: ${UNCLASSIFIED_PROTECTIVE}`, `  ${SAFEGUARD_LABEL}`, `  ${raised}`]);
    const txt = jobCardReport(card, asset);
    expect(txt.indexOf(raised)).toBeLessThan(txt.indexOf('\nASSET\n'));
    // PDF: the same line appears before ASSET (pdfjs text extraction).
    const LIBS = path.resolve('node_modules');
    const pdfjs = await import(pathToFileURL(path.join(LIBS, 'pdfjs-dist/legacy/build/pdf.mjs')).href);
    pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(path.join(LIBS, 'pdfjs-dist/legacy/build/pdf.worker.mjs')).href;
    const doc = await pdfjs.getDocument({ data: jobCardToPdf(card, asset).slice() }).promise;
    let text = '';
    for (let p = 1; p <= doc.numPages; p++) text += (await (await doc.getPage(p)).getTextContent()).items.map((x: { str?: string }) => x.str ?? '').join(' ') + ' ';
    const norm = text.replace(/\s+/g, ' ');
    const iRaised = norm.indexOf('Raised in the "Low oil pressure / oil starvation" diagnosis of this session.');
    expect(iRaised).toBeGreaterThan(-1);
    expect(iRaised).toBeLessThan(norm.indexOf('ASSET'));
  }, 60000);
});

describe('R8: earlier job-card records stay below a later STOP record, marked as made before it', () => {
  it('N4', () => {
    const s1: RawAnswers = { overheating: { radiator: 'blocked', loadPct: '120' } };
    const before = sessionRecord(OVERHEATING, s1);
    expect(before.result.stopActive).toBe(false);
    let card = { ...openJobCard({ id: 'J', assetId: 'A1', opened: '2026-11-25', reportedFault: 'x', technician: 'T' }), ...recordToCardUpdate({ findings: '', readings: [] }, before) } as ReturnType<typeof openJobCard>;
    const after = sessionRecord(OVERHEATING, { ...s1, 'knock-seizure': { where: 'engine' } });
    card = { ...card, ...recordToCardUpdate(card, after) };
    expect(card.findings.indexOf('STOP')).toBe(0);
    const iNote = card.findings.indexOf('NOTE: The findings below were recorded before this STOP. None of their running checks may be done while the STOP stands.');
    expect(iNote).toBeGreaterThan(card.findings.indexOf(after.lines[0]));
    expect(iNote).toBeLessThan(card.findings.indexOf('Only when no STOP is active'));
    const txt = jobCardReport(card, asset);
    expect(txt.indexOf('SAFETY — STOP')).toBeLessThan(txt.indexOf('Only when no STOP is active'));
  });
});

describe('the re-review random-session invariant still holds for the new questions', () => {
  it('3000 seeded random sessions: under any STOP, no running-only next question and no running check', () => {
    let seed = 7;
    const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
    let stops = 0;
    for (let i = 0; i < 3000; i++) {
      const f = FAMILIES[Math.floor(rnd() * FAMILIES.length)];
      const raw: Record<string, string> = {};
      for (const q of f.questions) {
        if (rnd() < 0.5) continue;
        raw[q.id] = q.kind === 'choice' ? q.options[Math.floor(rnd() * q.options.length)].value : String(Math.round((q.min + rnd() * (q.max - q.min)) * 10) / 10);
      }
      const r = diagnose(f, answersFromRaw(f, raw));
      if (!r.runningWithheld) continue;
      if (r.stopActive) stops++;
      if (r.nextQuestion) expect(r.nextQuestion.needsRunning, `${f.id} ${JSON.stringify(raw)}`).toBeFalsy();
      for (const c of r.ranked) for (const rc of f.causes.find((x) => x.id === c.id)!.runningChecks ?? []) expect(c.actions).not.toContain(rc);
      for (const s of r.stops.filter((x) => x.level === 'CAUTION')) expect(s.message).not.toMatch(KEEP_RUNNING);
    }
    expect(stops).toBeGreaterThan(500);
  });
});
