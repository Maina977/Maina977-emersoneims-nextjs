/**
 * Borehole records from a CSV (one row per borehole) into BoreholeRecord,
 * then through checkRecords. Template: docs/aquascan-validation/boreholes-template.csv.
 * Units are fixed by the column names; text in numeric columns is refused, not guessed.
 */
import { checkRecords, type BoreholeRecord, type Outcome, type Setting } from './records';

export const BOREHOLE_CSV_COLUMNS = [
  'id', 'lat', 'lon', 'positionSource', 'elevationM', 'drilledOn', 'county', 'setting', 'drilledDepthM', 'staticWaterLevelM',
  'waterStrikesM', 'testedYieldM3h', 'pumpTestRateM3h', 'pumpTestDurationH', 'pumpTestDrawdownM', 'outcome', 'productiveThresholdM3h',
  'ecUsCm', 'fluorideMgL', 'ironMgL', 'nitrateMgL', 'contractor', 'sourceDocument', 'verification', 'licence',
] as const;

function parseLine(line: string): string[] {
  const out: string[] = []; let cur = ''; let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
    else if (c === '"') q = true; else if (c === ',') { out.push(cur); cur = ''; } else cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

export interface ImportReport {
  rows: number;
  parsed: BoreholeRecord[];
  rowErrors: Array<{ row: number; id: string; errors: string[] }>;
  accepted: BoreholeRecord[];
  issues: ReturnType<typeof checkRecords>['issues'];
}

export function importBoreholesCsv(text: string): ImportReport {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith('#'));
  if (!lines.length) return { rows: 0, parsed: [], rowErrors: [], accepted: [], issues: [] };
  const head = parseLine(lines[0]);
  const missingCols = BOREHOLE_CSV_COLUMNS.filter((c) => !head.includes(c));
  if (missingCols.length) return { rows: 0, parsed: [], rowErrors: [{ row: 1, id: '', errors: [`Missing columns: ${missingCols.join(', ')}`] }], accepted: [], issues: [] };
  const parsed: BoreholeRecord[] = [];
  const rowErrors: ImportReport['rowErrors'] = [];
  lines.slice(1).forEach((line, i) => {
    const v = Object.fromEntries(head.map((h, k) => [h, parseLine(line)[k] ?? '']));
    const e: string[] = [];
    const num = (k: string, required = false): number | undefined => {
      const s = v[k];
      if (s === '' || s === undefined) { if (required) e.push(`${k} is required`); return undefined; }
      if (!/^-?\d+(\.\d+)?$/.test(s)) { e.push(`${k}: "${s}" is not a plain number in the column's unit`); return undefined; }
      return Number(s);
    };
    const oneOf = <T extends string>(k: string, allowed: readonly T[]): T | undefined => {
      if (!allowed.includes(v[k] as T)) { e.push(`${k}: "${v[k]}" must be one of ${allowed.join(', ')}`); return undefined; }
      return v[k] as T;
    };
    const rec = {
      id: v.id, lat: num('lat', true)!, lon: num('lon', true)!,
      positionSource: oneOf('positionSource', ['gps', 'address', 'map'] as const)!,
      elevationM: num('elevationM'), drilledOn: v.drilledOn, county: v.county,
      setting: oneOf('setting', ['basement', 'volcanic', 'sedimentary', 'alluvial', 'unknown'] as const) as Setting,
      drilledDepthM: num('drilledDepthM', true)!, staticWaterLevelM: num('staticWaterLevelM'),
      waterStrikesM: v.waterStrikesM ? v.waterStrikesM.split(/[;|]/).map((x) => Number(x.trim())) : undefined,
      testedYieldM3h: v.testedYieldM3h === '' ? null : (num('testedYieldM3h') ?? null),
      pumpTest: v.pumpTestRateM3h ? { rateM3h: num('pumpTestRateM3h')!, durationH: num('pumpTestDurationH', true)!, drawdownM: num('pumpTestDrawdownM', true)! } : undefined,
      outcome: oneOf('outcome', ['productive', 'low-yield', 'dry'] as const) as Outcome,
      productiveThresholdM3h: num('productiveThresholdM3h', true)!,
      quality: { ecUsCm: num('ecUsCm'), fluorideMgL: num('fluorideMgL'), ironMgL: num('ironMgL'), nitrateMgL: num('nitrateMgL') },
      contractor: v.contractor || undefined, sourceDocument: v.sourceDocument,
      verification: oneOf('verification', ['verified', 'unverified'] as const)!, licence: v.licence,
    } as BoreholeRecord;
    if (rec.waterStrikesM?.some((x) => !Number.isFinite(x))) e.push('waterStrikesM: separate depths with ";" (metres)');
    if (e.length) rowErrors.push({ row: i + 2, id: v.id, errors: e }); else parsed.push(rec);
  });
  const { accepted, issues } = checkRecords(parsed);
  return { rows: lines.length - 1, parsed, rowErrors, accepted, issues };
}
