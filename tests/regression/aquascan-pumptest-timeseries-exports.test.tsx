// @vitest-environment jsdom
/**
 * Time-series pumping test, end to end (2026-11-25): guided entry (panel) → stored
 * pumpTest.timeSeries → analysis → Pump Test tab view → the real downloads (JSON, PDF,
 * XLSX, DOCX, CSV rows) opened with independent readers. Every export carries the same
 * rows as the screen. SYNTHETIC test values only (worked example A of
 * aquascan-pumptest-timeseries.test.ts); not field data.
 *
 * Set AQUASCAN_EXPORT_DIR to keep the generated files for inspection.
 */
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import JSZip from 'jszip';
import ExcelJS from 'exceljs';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { FieldEvidencePanel } from '@/external/borehole-ai-engine/src/FieldEvidencePanel';
import { PumpTestTimeSeriesView } from '@/external/borehole-ai-engine/src/PumpTestTimeSeriesView';
import { buildFieldTimeSeriesAnalysis, timeSeriesRowText } from '@/external/borehole-ai-engine/src/pumpTestTimeSeries';
import { validatePumpingTest } from '@/external/borehole-ai-engine/src/fieldEvidence';
import { siteEvidenceFrom } from '@/external/borehole-ai-engine/src/evidenceGate';
import { generateScreeningPdf, generateScreeningDocx, generateScreeningXlsx, screeningRows } from '@/external/borehole-ai-engine/src/screeningReport';
import { jsonReportData } from '@/external/borehole-ai-engine/src/reportGenerator';
import { governingSummary } from '@/external/borehole-ai-engine/src/governingSummary';
import type { AnalysisResult, FieldValidationData } from '@/external/borehole-ai-engine/src/types';

afterEach(cleanup);

// Synthetic Theis data: T = 120 m²/day, S = 2e-4, Q = 20 m³/h, r = 30 m (see the analysis test for the derivation).
function E1(u: number): number {
  if (u <= 1) return -Math.log(u) - 0.57721566 + 0.99999193 * u - 0.24991055 * u ** 2 + 0.05519968 * u ** 3 - 0.00976004 * u ** 4 + 0.00107857 * u ** 5;
  const num = u ** 4 + 8.5733287401 * u ** 3 + 18.059016973 * u ** 2 + 8.6347608925 * u + 0.2677737343;
  const den = u ** 4 + 9.5733223454 * u ** 3 + 25.6329561486 * u ** 2 + 21.0996530827 * u + 3.9584969228;
  return (num / den) / (u * Math.exp(u));
}
const s = (t: number) => ((20 * 24) / (4 * Math.PI * 120)) * E1((900 * 2e-4) / (4 * 120 * (t / 1440)));
const times = Array.from({ length: 40 }, (_, i) => Number((2880 ** (i / 39)).toFixed(3)));
const SWL = 12;
const series = times.map((t) => [t, Math.round(s(t) * 1e5) / 1e5] as const);
const recov = Array.from({ length: 25 }, (_, i) => Number((1440 ** (i / 24)).toFixed(3))).map((tp) => [tp, Math.round((s(2880 + tp) - s(tp)) * 1e5) / 1e5] as const);
const src = { source: 'TEST Pumping Ltd', date: '2026-11-01', method: 'constant-rate test (TEST)', reference: 'TEST-TS-1' };

function storedPumpTest() {
  const r = validatePumpingTest({
    ...src, testType: 'time-series', staticLevelM: SWL,
    timeSeries: {
      rateM3h: 20, valuesAre: 'drawdown', readings: series.map(([t, v]) => ({ tMin: t, value: v })), rateChanges: [],
      pumpingStoppedMin: 2880, recovery: recov.map(([t, v]) => ({ tPrimeMin: t, value: v })), observationDistanceM: 30, pumpIntakeDepthM: null,
    },
  }, new Date('2026-11-25'));
  if (!r.ok) throw new Error(r.errors.join(' '));
  return r.value.pumpTest!;
}
function resultWith(fd: Partial<FieldValidationData>): AnalysisResult {
  return {
    site: { latitude: -1.2921, longitude: 36.8219 }, dataSources: ['TEST'],
    fieldData: fd, siteEvidence: siteEvidenceFrom(fd as FieldValidationData),
    pumpTestTimeSeries: buildFieldTimeSeriesAnalysis(fd.pumpTest),
  } as unknown as AnalysisResult;
}

type Pdfjs = typeof import('pdfjs-dist/legacy/build/pdf.mjs');
let pdfjs: Pdfjs;
beforeAll(async () => {
  pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')).href;
});
const pdfText = async (b: Uint8Array) => {
  const doc = await pdfjs.getDocument({ data: b.slice() }).promise;
  let t = '';
  for (let p = 1; p <= doc.numPages; p++) t += (await (await doc.getPage(p)).getTextContent()).items.map((i) => ('str' in i ? i.str : '')).join(' ') + '\n';
  return t.replace(/\s+/g, ' ');
};
const keep = (name: string, data: Uint8Array | string) => {
  const dir = process.env.AQUASCAN_EXPORT_DIR;
  if (dir) { fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(path.join(dir, name), data); }
};

describe('guided entry: time series in the field-evidence panel', () => {
  const fill = (label: RegExp, value: string, nth = 0) => fireEvent.change(screen.getAllByLabelText(label)[nth], { target: { value } });
  const enterSource = () => {
    fireEvent.change(screen.getAllByLabelText(/^Test type/)[0], { target: { value: 'time-series' } });
    fill(/^Test contractor/, src.source); fill(/^Test date/, src.date); fill(/^Method \/ standard/, src.method, 0); fill(/^Report \/ reference no\./, src.reference, 1);
    fill(/^Static water level/, String(SWL)); fill(/^Pumping rate at start/, '20');
  };

  it('pasted readings (TSV with header) are stored as pumpTest.timeSeries with the summary fields derived from them', () => {
    const onApply = vi.fn();
    render(<FieldEvidencePanel fieldData={{}} onApply={onApply} onRemove={vi.fn()} />);
    enterSource();
    fill(/^Observation-well distance/, '30');
    fill(/^Paste drawdown readings/, `Time (min)\tDrawdown (m)\n${series.map(([t, v]) => `${t}\t${v}`).join('\n')}`);
    fireEvent.click(screen.getByText('Use pasted drawdown readings'));
    expect(screen.getByText('40 row(s) entered')).toBeTruthy();
    fireEvent.click(screen.getByText('Add pumping test'));
    expect(onApply).toHaveBeenCalledTimes(1);
    const pt = (onApply.mock.calls[0][0] as Partial<FieldValidationData>).pumpTest!;
    expect(pt.timeSeries!.readings).toHaveLength(40);
    expect(pt.timeSeries!.observationDistance_m).toBe(30);
    expect(pt.sustainableYieldM3Hr).toBe(20);
    expect(pt.testDurationHrs).toBe(48);
    expect(pt.drawdownM).toBeCloseTo(series[39][1], 2);
    expect(pt).not.toHaveProperty('recoveryPercent'); // no recovery entered: nothing defaulted
    expect(pt.provenance?.reference).toBe('TEST-TS-1');
  });

  it('a paste in feet or with non-monotonic times is refused with reasons; nothing is added', () => {
    const onApply = vi.fn();
    render(<FieldEvidencePanel fieldData={{}} onApply={onApply} onRemove={vi.fn()} />);
    enterSource();
    fill(/^Paste drawdown readings/, 'Time (min)\tDrawdown (ft)\n1\t2');
    fireEvent.click(screen.getByText('Use pasted drawdown readings'));
    expect(screen.getByRole('alert').textContent).toMatch(/unit other than minutes and metres/);
    const rows = [[1, 0.2], [2, 0.3], [3, 0.4], [2.5, 0.5], [10, 0.6], [20, 0.7]];
    rows.forEach(([t, v], i) => { fill(new RegExp(`^Drawdown readings row ${i + 1} Time`), String(t)); fill(new RegExp(`^Drawdown readings row ${i + 1} Drawdown`), String(v)); });
    fireEvent.click(screen.getByText('Add pumping test'));
    expect(onApply).not.toHaveBeenCalled();
    expect(document.body.textContent).toMatch(/Drawdown reading 4: time 2.5 min is not after the previous reading/);
  });

  it('water levels below ground are converted with the static level; a level above it is refused', () => {
    const lv = validatePumpingTest({ ...src, testType: 'time-series', staticLevelM: 12, timeSeries: {
      rateM3h: 5, valuesAre: 'water-level', readings: [1, 2, 5, 10, 30, 60].map((t, i) => ({ tMin: t, value: 12.5 + i * 0.4 })), rateChanges: [], pumpingStoppedMin: null, recovery: [], observationDistanceM: null, pumpIntakeDepthM: null,
    } }, new Date('2026-11-25'));
    expect(lv.ok && lv.value.pumpTest!.timeSeries!.readings[0].s_m).toBeCloseTo(0.5, 9);
    const bad = validatePumpingTest({ ...src, testType: 'time-series', staticLevelM: 12, timeSeries: {
      rateM3h: 5, valuesAre: 'water-level', readings: [1, 2, 5, 10, 30, 60].map((t, i) => ({ tMin: t, value: i === 2 ? 11 : 12.5 + i * 0.4 })), rateChanges: [], pumpingStoppedMin: null, recovery: [], observationDistanceM: null, pumpIntakeDepthM: null,
    } }, new Date('2026-11-25'));
    expect(bad.ok).toBe(false);
    expect(!bad.ok && bad.errors.join(' ')).toMatch(/Drawdown reading 3: drawdown -1 m is negative/);
  });
});

describe('Pump Test tab and every download show the same values', () => {
  const pt = storedPumpTest();
  const a = buildFieldTimeSeriesAnalysis(pt)!;
  const T = a.rows.find((r) => r[0] === 'Transmissivity (reported)')!;
  const S = a.rows.find((r) => r[0] === 'Storativity')!;
  const P = a.rows.find((r) => r[0] === 'Planning estimate')!;

  it('the worked example numbers (synthetic): T 120 m²/day, S 2.00e-4, projection 4.2 m at 365 days', () => {
    expect(T[1]).toBe('120 m²/day (1.39e-3 m²/s)');
    expect(S[1]).toBe('2.00e-4');
    expect(P[1]).toBe('4.2 m drawdown at 365 days');
    expect(pt.recoveryPercent).toBe(Math.round(((series[39][1] - recov[24][1]) / series[39][1]) * 100));
  });

  it('screen: the Pump Test tab view renders the rows, the plot and the residuals', () => {
    render(<PumpTestTimeSeriesView a={a} />);
    const text = screen.getByTestId('pumptest-timeseries').textContent ?? '';
    for (const r of a.rows) { expect(text).toContain(r[0]); expect(text).toContain(r[1]); }
    expect(screen.getByRole('img', { name: /Semi-log plot/ })).toBeTruthy();
  });

  it('JSON (screening, no survey): carries the analysis object with identical rows', () => {
    const r = resultWith({ pumpTest: pt });
    const j = jsonReportData(r) as Record<string, unknown>;
    const out = JSON.stringify(j, null, 2);
    keep('AquaScan_timeseries_screening.json', out);
    const back = JSON.parse(out);
    expect(back.pumpTestTimeSeries.rows).toEqual(a.rows);
    expect(back.pumpTestTimeSeries.transmissivity.value_m2d).toBe(a.transmissivity!.value_m2d);
  });

  it('JSON (full, survey + test): the spread result carries the same analysis', () => {
    const r = resultWith({ pumpTest: pt, ertSurvey: { aquiferDepthM: 40, aquiferThicknessM: 15, surveyDate: '2026-10-01', contractor: 'TEST Geo', method: 'VES', provenance: { ...src, reference: 'TEST-VES-1' } } } as Partial<FieldValidationData>);
    let j: Record<string, unknown>;
    try { j = jsonReportData(r); } catch (e) { throw new Error(`full JSON failed on a minimal result: ${(e as Error).message}`); }
    expect((j.pumpTestTimeSeries as { rows: unknown }).rows).toEqual(a.rows);
    keep('AquaScan_timeseries_full.json', JSON.stringify(j, null, 2));
  });

  it('governing summary (full CSV / Excel / Word): a "Pumping test analysis (time series)" section with the same rows', () => {
    const r = resultWith({ pumpTest: pt });
    const secs = governingSummary(r, 'TEST');
    const sec = secs.find((x) => x.title === 'Pumping test analysis (time series)');
    expect(sec!.rows).toEqual(a.rows);
  });

  it('screening CSV rows, PDF, DOCX and XLSX: each row text appears (opened with pdfjs, JSZip, ExcelJS)', async () => {
    const r = resultWith({ pumpTest: pt });
    const lines = a.rows.map(timeSeriesRowText);
    const csv = screeningRows(r).map((x) => x.join(' | ')).join('\n');
    for (const l of lines) expect(csv).toContain(l);

    const pdf = generateScreeningPdf(r, false);
    keep('AquaScan_timeseries_screening.pdf', pdf);
    const pt_ = await pdfText(pdf);
    for (const key of ['Transmissivity (reported): 120 m²/day', 'Storativity: 2.00e-4', 'Planning estimate: 4.2 m drawdown at 365 days', 'Theis recovery: T: 120 m²/day']) expect(pt_).toContain(key);

    const docx = await generateScreeningDocx(r, false);
    keep('AquaScan_timeseries_screening.docx', docx);
    const xml = await (await JSZip.loadAsync(docx)).file('word/document.xml')!.async('string');
    const dtext = xml.replace(/<[^>]+>/g, '').replace(/&apos;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    for (const l of lines) expect(dtext).toContain(l);

    const xlsx = await generateScreeningXlsx(r, false);
    keep('AquaScan_timeseries_screening.xlsx', xlsx);
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(xlsx as unknown as ArrayBuffer);
    const cells: string[] = [];
    wb.eachSheet((ws) => ws.eachRow((row) => (row.values as unknown[]).forEach((v) => cells.push(String(v ?? '')))));
    for (const l of lines) expect(cells).toContain(l);
  });
});

describe('wiring (source): the full PDF brief, the analyser and the tab use the analysis rows', () => {
  const eng = (f: string) => fs.readFileSync(path.join(process.cwd(), 'external', 'borehole-ai-engine', 'src', f), 'utf8');
  it('full PDF: brief page 2 prints result.pumpTestTimeSeries.rows after the field-evidence table', () => {
    const src = eng('reportGenerator.ts');
    const i = src.indexOf("'PUMPING TEST ANALYSIS (TIME SERIES)'");
    expect(i).toBeGreaterThan(src.indexOf('body: fieldEvidenceRows(result)'));
    expect(src.slice(i, i + 600)).toMatch(/body: result\.pumpTestTimeSeries\.rows\.map/);
  });
  it('analyser: time series analysed from fieldData.pumpTest; the single-reading observation is cleared only then', () => {
    const src = eng('boreholeAnalyzer.ts');
    expect(src).toMatch(/pumpTestTimeSeries = buildFieldTimeSeriesAnalysis\(fieldData\?\.pumpTest\);\s*\n\s*if \(pumpTestTimeSeries\) \{ pumpTestObservation = undefined;/);
  });
  it('Pump Test tab: the time-series branch precedes the single-reading branch', () => {
    const ui = eng('index.tsx');
    const tab = ui.slice(ui.indexOf("activeResultTab==='pump-test'"), ui.indexOf('LITHOLOGY LOG'));
    expect(tab.indexOf('result.pumpTestTimeSeries ?')).toBeGreaterThan(-1);
    expect(tab.indexOf('result.pumpTestTimeSeries ?')).toBeLessThan(tab.indexOf('result.pumpTestObservation ?'));
  });
});
