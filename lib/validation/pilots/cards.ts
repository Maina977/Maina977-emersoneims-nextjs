/**
 * Pilot comparison cards (Phase 2, 2026-11-22): one real project per
 * application, compared entirely in the browser.
 *
 * Every verdict printed here is the existing, tested engine's own output:
 *   Oracle      lib/generator-oracle/reviewIngest.ts        ingestReviewPack
 *   Solar       lib/solar/design/comparison.ts              compareRealSystems
 *   AquaScan    lib/aquascan-validation/importCsv.ts        importBoreholesCsv (+ checkRecords)
 *   Building    lib/qs/referenceComparison.ts               compareWithReference
 * Where an engine reports only a summary, each row is passed through the
 * same engine on its own to obtain that row's verdict; nothing is
 * recalculated here. Excluded or invalid rows are listed with the engine's
 * reason and are never filled in. Nothing is marked verified.
 */
import { ingestReviewPack } from '@/lib/generator-oracle/reviewIngest';
import { compareRealSystems } from '@/lib/solar/design/comparison';
import { importBoreholesCsv, BOREHOLE_CSV_COLUMNS } from '@/lib/aquascan-validation/importCsv';
import { VALIDATION_FRAMEWORK_VERSION, type BoreholeRecord } from '@/lib/aquascan-validation/records';
import { compareWithReference } from '@/lib/qs/referenceComparison';
import { splitCsv, joinCsv, singleRowCsv, type CsvTable } from './csv';
import { anonymiseTable, coarseCoord, type AnonymiseColumn } from './anonymise';

export const PILOT_TOOL_VERSION = 'pilot-comparison 1.0.0 (2026-11-22)';
export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const QS_ITEM_TOL_PCT = 2;
export const QS_TOTAL_TOL_PCT = 1;
export const SOLAR_MONTH_REASON_PCT = 15;

export type CardId = 'oracle' | 'solar' | 'boreholes' | 'qs';
export type RowTone = 'ok' | 'warn' | 'fail';
export interface PilotRow { ref: string; verdict: string; evidence: string; tone: RowTone }
export interface PilotExcluded { ref: string; reason: string }
export interface PilotResult {
  card: CardId;
  title: string;
  engine: string;
  status: string;
  summary: Array<[string, string]>;
  tolerances: string[];
  rows: PilotRow[];
  excluded: PilotExcluded[];
  notes: string[];
  anonymised: boolean;
  anonymisedColumns: Record<string, number>;
  engineReport: unknown;
}

export interface CardDef {
  id: CardId;
  title: string;
  engine: string;
  records: string[];
  anonymise: AnonymiseColumn[];
  /** Header problems that make the file unusable for this card, or [] when it is fine. */
  headerProblems: (header: string[]) => string[];
}

export class PilotFileError extends Error {
  constructor(message: string) { super(message); this.name = 'PilotFileError'; }
}

const missing = (header: string[], cols: readonly string[]) => cols.filter((c) => !header.includes(c));
const hasPrefix = (header: string[], p: string) => header.some((h) => h.toLowerCase().startsWith(p.toLowerCase()));

export const CARDS: Record<CardId, CardDef> = {
  oracle: {
    id: 'oracle',
    title: 'Generator Oracle: alarm review pack / guided-diagnostics sheet',
    engine: 'lib/generator-oracle/reviewIngest.ts ingestReviewPack (P1 2026-11-15; exact-header fix 2026-11-22)',
    records: [
      'The alarm review pack or the guided-diagnostics sheet downloaded from this card, filled by the technician for one real controller or one real fault-finding job.',
      'For every verdict (correct / change / remove): the OEM manual title from the manual register, its edition, the page, and the reviewer\'s name.',
      'For "change" or "remove": a comment saying what is wrong.',
      'Only manuals the company holds. Leave a row blank when it was not checked.',
    ],
    anonymise: [],
    headerProblems: (h) => {
      const p: string[] = [];
      if (!h.includes('id')) p.push('an "id" column');
      if (!hasPrefix(h, 'verdict')) p.push('a "verdict" column');
      const manual = hasPrefix(h, 'oemManual') || hasPrefix(h, 'manual') || h.includes('oemReference');
      if (!manual) p.push('an OEM manual column (oemManual or oemReference)');
      for (const c of ['edition', 'page', 'reviewer']) if (!h.includes(c)) p.push(`a "${c}" column`);
      return p;
    },
  },
  solar: {
    id: 'solar',
    title: 'Solar: measured versus predicted production',
    engine: 'lib/solar/design/comparison.ts compareRealSystems (P1-B)',
    records: [
      'One installed system: the design file and tool version used for the prediction, kWp, inverter and battery.',
      'For each month: the predicted kWh from the design, and the measured kWh from the inverter or meter export.',
      'For each measured month: the data source (e.g. inverter portal) and the exported file\'s reference, and the number of days with missing data.',
      'For any month more than 15 % off: the reason, in notes.',
    ],
    anonymise: [
      { column: 'systemId', label: 'Site', style: 'number' },
      { column: 'designFile', label: 'Design file', style: 'number' },
      { column: 'measuredFileRef', label: 'Meter file', style: 'number' },
    ],
    headerProblems: (h) => missing(h, ['systemId', 'month', 'predicted_kWh', 'measured_kWh', 'measuredSource', 'measuredFileRef', 'dataGap_days', 'notes']),
  },
  boreholes: {
    id: 'boreholes',
    title: 'AquaScan: drilled borehole records',
    engine: `lib/aquascan-validation/importCsv.ts importBoreholesCsv + checkRecords, ${VALIDATION_FRAMEWORK_VERSION}`,
    records: [
      'One row per drilled borehole, from its completion record.',
      'GPS position, drilling date, depth, static water level, water strikes, pumping test (rate, duration, drawdown), outcome and the yield threshold used.',
      'Water quality where tested (EC, fluoride, iron, nitrate).',
      'The source document and the licence or consent to use the record.',
    ],
    anonymise: [
      { column: 'id', label: 'Site', style: 'number' },
      { column: 'sourceDocument', label: 'Document', style: 'number' },
      { column: 'licence', label: 'Consent record', style: 'number' },
    ],
    headerProblems: (h) => missing(h, BOREHOLE_CSV_COLUMNS),
  },
  qs: {
    id: 'qs',
    title: 'Building: drawing take-off versus independent BOQ',
    engine: 'lib/qs/referenceComparison.ts compareWithReference (P1-D)',
    records: [
      'One project\'s drawing set.',
      'A bill of quantities prepared by hand by a quantity surveyor from those drawings, independently of the tool.',
      'For each item: code, unit, the reference quantity from the manual BOQ, and the tool\'s quantity for the same drawings.',
      'Rates (KES, dated source in notes) on every item if the total is to be checked.',
    ],
    anonymise: [
      { column: 'project', label: 'Client', style: 'letter' },
      { column: 'drawingSet', label: 'Drawing set', style: 'number' },
      { column: 'referenceSource', label: 'Reference BOQ', style: 'number' },
    ],
    headerProblems: (h) => missing(h, ['project', 'drawingSet', 'itemCode', 'unit', 'referenceQty', 'toolQty', 'rate', 'referenceSource', 'notes']),
  },
};

export const CARD_ORDER: CardId[] = ['oracle', 'solar', 'boreholes', 'qs'];

/** Checks that happen before the file is read: name and size. */
export function checkFileMeta(name: string, bytes: number): void {
  if (!/\.csv$/i.test(name)) throw new PilotFileError(`"${name}" is not a .csv file. Save the filled template as CSV (comma separated) and load that.`);
  if (bytes === 0) throw new PilotFileError(`"${name}" is empty.`);
  if (bytes > MAX_FILE_BYTES) throw new PilotFileError(`"${name}" is larger than 5 MB; a single pilot project should be far smaller. Check that this is the right file.`);
}

/** Parses and checks the text; throws PilotFileError with a reason the user can act on. */
export function readTable(card: CardId, text: string): CsvTable {
  if (/\u0000/.test(text) || /^PK\u0003\u0004/.test(text)) throw new PilotFileError('This is not a CSV text file (it looks like a spreadsheet or other binary file). In Excel use File > Save As > CSV, then load the .csv file.');
  const table = splitCsv(text);
  if (!table.header.length || table.header.every((h) => !h)) throw new PilotFileError('The file has no header row. Start from the blank template on this card.');
  const problems = CARDS[card].headerProblems(table.header);
  if (problems.length) throw new PilotFileError(`This file is not the ${CARDS[card].title} template: it lacks ${problems.join(', ')}. Download the blank template from this card and fill that.`);
  return table;
}

const rowRef = (msg: string): PilotExcluded => {
  const m = /^(row \d+(?: \([^)]*\))?): ([\s\S]*)$/.exec(msg);
  return m ? { ref: m[1], reason: m[2] } : { ref: '', reason: msg };
};
const stripRow = (msg: string) => msg.replace(/^row \d+(?: \([^)]*\))?: /, '');
const cellOf = (header: string[], row: string[]) => (c: string) => (row[header.indexOf(c)] ?? '').trim();

function runOracle(csv: string): Omit<PilotResult, 'card' | 'title' | 'engine' | 'anonymised' | 'anonymisedColumns'> {
  const r = ingestReviewPack(csv);
  const notReviewed = r.rowsRead - r.reviewed - r.errors.length;
  return {
    status: r.status,
    summary: [
      ['Status', r.status],
      ['Rows read', String(r.rowsRead)],
      ['Verdicts counted', String(r.reviewed)],
      ['correct / change / remove', `${r.byVerdict.correct} / ${r.byVerdict.change} / ${r.byVerdict.remove}`],
      ['High-risk rows reviewed', `${r.highRiskReviewed} of ${r.highRiskTotal}`],
      ['Verdicts NOT counted (evidence missing)', String(r.errors.length)],
      ['Rows not yet reviewed (blank verdict)', String(Math.max(0, notReviewed))],
      ['Reviewers named', String(r.reviewers.length)],
    ],
    tolerances: [
      'A verdict counts only with the OEM manual title, edition, page and the reviewer\'s name.',
      '"change" and "remove" count only with a comment saying what is wrong.',
      'Rows without a verdict are not reviewed and are not counted.',
      'This comparison never marks an alarm or rule verified in the library; that is a separate engineering change after management accepts the review.',
    ],
    rows: r.accepted.map((a) => ({
      ref: a.id,
      verdict: a.verdict,
      evidence: `${a.manual}, edition ${a.edition}, page ${a.page}; reviewer ${a.reviewer}${a.comment ? `; comment: ${a.comment}` : ''}${a.highRisk ? ' [high-risk]' : ''}`,
      tone: a.verdict === 'correct' ? 'ok' : 'warn',
    })),
    excluded: r.errors.map(rowRef),
    notes: [],
    engineReport: r,
  };
}

function runSolar(csv: string, table: CsvTable): ReturnType<typeof runOracle> {
  const whole = compareRealSystems(csv);
  const rows: PilotRow[] = [];
  const excluded: PilotExcluded[] = [];
  table.rows.forEach((row, i) => {
    const c = cellOf(table.header, row);
    const one = compareRealSystems(singleRowCsv(table.header, row));
    const ref = `row ${i + 2} (${c('systemId')}${c('month') ? ` ${c('month')}` : ''})`;
    if (one.rowErrors.length) { excluded.push({ ref, reason: `invalid: ${one.rowErrors.map(stripRow).join('; ')}` }); return; }
    const s = one.systems[0];
    if (!s) return; // empty template row
    if (s.excluded.length) { excluded.push({ ref, reason: `excluded, not filled: ${s.excluded.map((e) => e.why).join('; ')}` }); return; }
    const over = s.monthsOver15[0];
    const pct = s.errorPct;
    const verdict = pct === null ? 'error not computable (measured 0 kWh)'
      : over ? `${pct} % : over ${SOLAR_MONTH_REASON_PCT} %, ${over.reasonGiven ? 'reason given' : 'REASON REQUIRED'}`
        : `${pct} % : within ${SOLAR_MONTH_REASON_PCT} %`;
    rows.push({
      ref,
      verdict,
      evidence: `predicted ${c('predicted_kWh')} kWh, measured ${c('measured_kWh')} kWh; source ${c('measuredSource')}, file ${c('measuredFileRef')}${c('notes') ? `; notes: ${c('notes')}` : ''}`,
      tone: pct === null || (over && !over.reasonGiven) ? 'fail' : over ? 'warn' : 'ok',
    });
  });
  return {
    status: whole.status,
    summary: [
      ['Status (full validation needs 10 systems)', whole.status],
      ['Systems with usable measured data', String(whole.systemsWithData)],
      ['Overall error (predicted vs measured)', whole.overallErrorPct === null ? 'not computable' : `${whole.overallErrorPct} %`],
      ...whole.systems.map((s): [string, string] => [
        `System ${s.systemId}`,
        `${s.months} month(s) used, ${s.excluded.length} excluded; predicted ${s.predictedKwh} kWh, measured ${s.measuredKwh} kWh; error ${s.errorPct === null ? 'n/a' : `${s.errorPct} %`}; ${s.monthsOver15.length} month(s) over ${SOLAR_MONTH_REASON_PCT} % (${s.monthsOver15.filter((m) => !m.reasonGiven).length} without a reason)`,
      ]),
      ['Invalid rows', String(whole.rowErrors.length)],
    ],
    tolerances: [
      'Error % = (predicted - measured) / measured, per month and per system.',
      `Months more than ${SOLAR_MONTH_REASON_PCT} % off must carry a stated reason (notes); without one the system is INCOMPLETE.`,
      'Months with missing data days, no measured value, or a measured value without its source file are excluded, never filled.',
    ],
    rows,
    excluded,
    notes: ['The engine status counts toward the 10-system validation; a pilot is one system, so INSUFFICIENT is expected here.'],
    engineReport: whole,
  };
}

function runBoreholes(csv: string, anonymised: boolean): ReturnType<typeof runOracle> {
  const r = importBoreholesCsv(csv);
  const coord = (x: number) => (anonymised ? coarseCoord(x) : x);
  const flagsFor = (id: string) => r.issues.filter((x) => x.id === id && x.level === 'flag').map((x) => x.message);
  const rejected = r.parsed.filter((p) => !r.accepted.includes(p));
  const excluded: PilotExcluded[] = [
    ...r.rowErrors.map((e) => ({ ref: `row ${e.row}${e.id ? ` (${e.id})` : ''}`, reason: `refused at import: ${e.errors.join('; ')}` })),
    ...rejected.map((p) => ({ ref: p.id || '(no id)', reason: `rejected: ${r.issues.filter((x) => x.id === p.id && x.level === 'reject').map((x) => x.message).join('; ')}` })),
  ];
  const rows: PilotRow[] = r.accepted.map((b) => {
    const flags = flagsFor(b.id);
    return {
      ref: b.id,
      verdict: flags.length ? `accepted, ${flags.length} flag(s)` : 'accepted',
      evidence: `${coord(b.lat)}, ${coord(b.lon)} (${b.positionSource}); ${b.county || 'county not given'}; ${b.setting}; drilled ${b.drilledOn}, ${b.drilledDepthM} m; yield ${b.testedYieldM3h === null ? 'not tested' : `${b.testedYieldM3h} m3/h`}; outcome ${b.outcome} (threshold ${b.productiveThresholdM3h} m3/h); source ${b.sourceDocument}; ${b.verification}${flags.length ? `; flags: ${flags.join('; ')}` : ''}`,
      tone: flags.length ? 'warn' : 'ok',
    };
  });
  const strip = (b: BoreholeRecord): BoreholeRecord => ({ ...b, lat: coord(b.lat), lon: coord(b.lon) });
  return {
    status: r.rows === 0 ? 'NO RECORDS' : `${r.accepted.length} of ${r.rows} record(s) accepted for validation`,
    summary: [
      ['Rows read', String(r.rows)],
      ['Refused at import (format)', String(r.rowErrors.length)],
      ['Rejected by the checks', String(rejected.length)],
      ['Accepted', String(r.accepted.length)],
      ['Accepted with flags', String(rows.filter((x) => x.tone === 'warn').length)],
    ],
    tolerances: [
      'Coordinates must fall inside Kenya; drilled depth 0 to 1500 m; tested yield 0 to 500 m3/h.',
      'Static water level and water strikes must lie within the drilled depth; outcome must agree with the tested yield and its threshold.',
      'Source document, licence or consent, and a valid drilling date are required.',
      'Duplicates (under 50 m apart, same depth and date) keep the first record.',
      'Flags (not rejections): position not from GPS, record unverified, setting unknown, no pumping test.',
      ...(anonymised ? ['Coordinates in this report are rounded to 0.1 degree (anonymised).'] : []),
    ],
    rows,
    excluded,
    notes: [],
    engineReport: anonymised ? { ...r, parsed: r.parsed.map(strip), accepted: r.accepted.map(strip) } : r,
  };
}

function runQs(csv: string, table: CsvTable): ReturnType<typeof runOracle> {
  const whole = compareWithReference(csv, { itemTolPct: QS_ITEM_TOL_PCT, totalTolPct: QS_TOTAL_TOL_PCT });
  const rows: PilotRow[] = [];
  const excluded: PilotExcluded[] = [];
  table.rows.forEach((row, i) => {
    const c = cellOf(table.header, row);
    // One row through the engine with a negative item tolerance, so the engine
    // lists the item (with its diffPct) among those "outside"; the verdict below
    // then applies the real tolerance to the engine's own diffPct.
    const one = compareWithReference(singleRowCsv(table.header, row), { itemTolPct: -1 });
    const label = [c('project'), c('itemCode')].filter(Boolean).join(' ');
    const ref = label ? `row ${i + 2} (${label})` : `row ${i + 2}`;
    if (one.rowErrors.length) { excluded.push({ ref, reason: `invalid: ${one.rowErrors.map(stripRow).join('; ')}` }); return; }
    const p = one.projects[0];
    if (!p) return; // empty template row
    const it = p.outside[0];
    const evidence = `${c('unit')}: reference ${c('referenceQty')}, tool ${c('toolQty')}${c('rate') ? `, rate ${c('rate')} KES` : ''}; reference source ${c('referenceSource')}${c('notes') ? `; notes: ${c('notes')}` : ''}`;
    if (!it || it.diffPct === null) { rows.push({ ref, verdict: 'not comparable: reference quantity 0, tool quantity not 0', evidence, tone: 'fail' }); return; }
    const within = Math.abs(it.diffPct) <= QS_ITEM_TOL_PCT;
    rows.push({ ref, verdict: `${it.diffPct} % : ${within ? 'within' : 'OUTSIDE'} +/-${QS_ITEM_TOL_PCT} %`, evidence, tone: within ? 'ok' : 'fail' });
  });
  return {
    status: whole.status,
    summary: [
      ['Status (full validation needs 10 projects)', whole.status],
      ...whole.projects.map((p): [string, string] => [
        `Project ${p.project}`,
        `${p.items} item(s), ${p.outside.length} outside +/-${QS_ITEM_TOL_PCT} %; total ${p.totalDiffPct === null ? 'not checked (an item has no rate)' : `${p.totalDiffPct} % (reference ${p.refAmount} KES, tool ${p.toolAmount} KES)`}; ${p.pass === null ? 'no pass/fail without rates' : p.pass ? 'PASS' : 'FAIL'}`,
      ]),
      ['Invalid rows', String(whole.rowErrors.length)],
    ],
    tolerances: [
      `Each item: tool quantity within +/-${QS_ITEM_TOL_PCT} % of the independent reference quantity.`,
      `Measured total: within +/-${QS_TOTAL_TOL_PCT} % by amount (needs a rate on every item).`,
      'These are the proposed acceptance values; the QS reviewer may set others.',
    ],
    rows,
    excluded,
    notes: ['The engine status counts toward the 10-project validation; a pilot is one project, so INSUFFICIENT is expected here.'],
    engineReport: whole,
  };
}

/** Parse, (optionally) anonymise and compare. Throws PilotFileError for an unusable file. */
export function runPilot(card: CardId, text: string, opts: { anonymise: boolean }): PilotResult {
  const def = CARDS[card];
  const raw = readTable(card, text);
  let table = raw;
  let anonymisedColumns: Record<string, number> = {};
  if (opts.anonymise && def.anonymise.length) {
    const a = anonymiseTable(raw, def.anonymise);
    table = a.table;
    anonymisedColumns = a.replaced;
  }
  const csv = joinCsv(table);
  const body = card === 'oracle' ? runOracle(csv)
    : card === 'solar' ? runSolar(csv, table)
      : card === 'boreholes' ? runBoreholes(csv, opts.anonymise)
        : runQs(csv, table);
  const notes = [...body.notes];
  if (opts.anonymise && !def.anonymise.length) notes.push('This file has no client or site columns; nothing needed anonymising.');
  if (opts.anonymise && def.anonymise.length) notes.push('Free-text notes and comments are printed as written; check them for client names before sharing.');
  return { card, title: def.title, engine: def.engine, ...body, notes, anonymised: opts.anonymise, anonymisedColumns };
}
