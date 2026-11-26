// @vitest-environment jsdom
/**
 * Real-project test 2026-11-26, defect D1 (management decision A): with its data
 * sources down, AquaScan said "VERIFICATION PASSED, Grade A, 96% ... All figures
 * cross-validated ... cleared for publication". 4 of 5 re-queries were skipped and
 * the one "match" compared the GLDAS fallback with itself (54 vs 54 mm/yr).
 * Production bf2c7500 has the same preReportVerification.ts (no diff) and panel.
 *
 * Rules tested here:
 *  - a failed / timed-out source is recorded as "Not checked" (unavailable), never a pass;
 *  - null / undefined / NaN / empty on either side, or a fallback compared with itself,
 *    is "Not checked (no independent value)", never a match;
 *  - PASSED only when every check ran; otherwise INCOMPLETE with the exact headline
 *    "VERIFICATION INCOMPLETE — Required data sources unavailable. No accuracy grade or
 *    publication clearance issued.", the list of what was not checked, no grade/score;
 *  - FAILED as before (blocks the full report);
 *  - the screen data and the PDF, Word, Excel, CSV and JSON exports carry the identical
 *    status, coverage and grade lines, for (a) total outage, (b) empty responses,
 *    (c) partially missing data, (d) inconsistent values, (e) all ran and matched.
 * Network disabled (fetch throws). TEST values only.
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import JSZip from 'jszip';
import ExcelJS from 'exceljs';

vi.setConfig({ testTimeout: 600000, hookTimeout: 600000 });

// Controls the four re-query fetchers used by the verification engine. mode null =
// the real function (network disabled), so the engine run itself is unaffected.
const ctl = vi.hoisted(() => ({ mode: null as null | Record<string, (...a: any[]) => any> }));
vi.mock('@/external/borehole-ai-engine/src/remoteSensing', async (orig) => {
  const m: any = await orig();
  return {
    ...m,
    fetchElevation: (...a: any[]) => (ctl.mode?.elev ? ctl.mode.elev(...a) : m.fetchElevation(...a)),
    fetchSoilGrids: (...a: any[]) => (ctl.mode?.soil ? ctl.mode.soil(...a) : m.fetchSoilGrids(...a)),
  };
});
vi.mock('@/external/borehole-ai-engine/src/advancedHydroEngine', async (orig) => {
  const m: any = await orig();
  return {
    ...m,
    fetchNASAPowerMoisture: (...a: any[]) => (ctl.mode?.moisture ? ctl.mode.moisture(...a) : m.fetchNASAPowerMoisture(...a)),
    fetchNearbyBoreholeData: (...a: any[]) => (ctl.mode?.wells ? ctl.mode.wells(...a) : m.fetchNearbyBoreholeData(...a)),
  };
});
vi.mock('@/external/borehole-ai-engine/src/gldasGroundwater', async (orig) => {
  const m: any = await orig();
  return { ...m, fetchGLDASGroundwaterData: (...a: any[]) => (ctl.mode?.gldas ? ctl.mode.gldas(...a) : m.fetchGLDASGroundwaterData(...a)) };
});

// Every string the PDF writes (jsPDF text + autoTable cells via text()).
const pdfText: string[] = [];
vi.mock('jspdf', async (orig) => {
  const m: any = await orig();
  const J = m.default ?? m.jsPDF;
  class Recording extends J {
    constructor(...a: any[]) {
      super(...a);
      const t = (this as any).text.bind(this);
      (this as any).text = (s: any, ...rest: any[]) => { pdfText.push(Array.isArray(s) ? s.join(' ') : String(s)); return t(s, ...rest); };
      (this as any).save = () => {};
    }
  }
  return { ...m, default: Recording, jsPDF: Recording };
});
// The full Word and Excel exports hand a Blob to file-saver: keep it.
const saved: { blob: Blob; name: string }[] = [];
vi.mock('file-saver', () => ({ saveAs: (blob: Blob, name: string) => { saved.push({ blob, name }); } }));

import { BoreholeAnalyzer } from '@/external/borehole-ai-engine/src/boreholeAnalyzer';
import { validateSurvey, validatePumpingTest } from '@/external/borehole-ai-engine/src/fieldEvidence';
import {
  runPreReportVerification, buildVerificationReport, verificationDisplay, verificationRows, verificationStatus,
  normalizeVerificationReport, VERIFICATION_INCOMPLETE_HEADLINE, GRADE_NOT_ISSUED, trustScoreDisplay, type VerificationReport,
} from '@/external/borehole-ai-engine/src/preReportVerification';
import { generatePDFReport, generateWordReport, generateExcelReport, csvReportRows, jsonReportData, pdfSafeText, sanitizePdfText } from '@/external/borehole-ai-engine/src/reportGenerator';
import { generateScreeningPdf, generateScreeningDocx, generateScreeningXlsx } from '@/external/borehole-ai-engine/src/screeningReport';
import { VerificationBlockError, computeCanonicalEconomics, runPrePublishAudit } from '@/external/borehole-ai-engine/src/reportShared';
import { costSourcing, costLineText } from '@/external/borehole-ai-engine/src/costSources';
import { fmtKES } from '@/external/borehole-ai-engine/src/projectPricing';

const NEUTRAL = { metadata: {}, terrainType: 'unknown', vegetationDensity: 0.3, soilColor: 'brown', rockExposure: false, waterBodies: false, classifications: [], pixelAnalysis: {}, vegetationScore: 0.3, waterProbability: 0.3, isReliableTerrainImage: false, locationMethod: 'none', locationContext: {}, gpsSource: 'none', predictions: [] };
const NOW = new Date('2026-11-25T12:00:00Z');
const SURVEY = (validateSurvey as any)({ source: 'TEST Geophysics Ltd', date: '2026-10-01', method: 'Schlumberger array, IPI2Win inversion', reference: 'TEST-VES-01', surveyType: 'VES', aquiferTopM: 45, aquiferBottomM: 80 } as any, NOW).value;
const PUMP = (validatePumpingTest as any)({ source: 'TEST Drillers', date: '2026-11-10', method: 'constant-rate test', reference: 'TEST-PT-07', testType: 'constant-rate', durationHrs: 24, rateM3h: 2, staticLevelM: 18, dynamicLevelM: 41.5, recoveryLevelM: 19.2, recoveryHrs: 12 } as any, NOW).value;

const FORBIDDEN = [/cleared for publication/i, /cross-validated/i, /\bGrade A\b/, /VERIFICATION PASSED/, /\bVERIFIED\b/];
const noClaims = (text: string) => { for (const re of FORBIDDEN) expect(text, `must not contain ${re}`).not.toMatch(re); };

type Pdfjs = typeof import('pdfjs-dist/legacy/build/pdf.mjs');
let pdfjs: Pdfjs;
const pdfBytesText = async (b: Uint8Array) => {
  const doc = await pdfjs.getDocument({ data: b.slice() }).promise;
  let t = '';
  for (let p = 1; p <= doc.numPages; p++) t += (await (await doc.getPage(p)).getTextContent()).items.map((i) => ('str' in i ? i.str : '')).join(' ') + '\n';
  return t.replace(/\s+/g, ' ');
};
const blobBytes = (b: Blob) => new Promise<Uint8Array>((res, rej) => { const fr = new FileReader(); fr.onload = () => res(new Uint8Array(fr.result as ArrayBuffer)); fr.onerror = rej; fr.readAsArrayBuffer(b); });
const docxText = async (b: Uint8Array) => {
  const xml = await (await JSZip.loadAsync(b)).file('word/document.xml')!.async('string');
  return xml.replace(/<w:tab\/>/g, ' ').replace(/<\/w:p>/g, '\n').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
};
const xlsxText = async (b: Uint8Array) => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(b as unknown as ArrayBuffer);
  const out: string[] = [];
  wb.eachSheet((ws) => ws.eachRow((row) => out.push((row.values as unknown[]).slice(1).map((v) => String(v ?? '')).join(' | '))));
  return out.join('\n');
};
const squash = (s: string) => s.replace(/\s+/g, ' ');

let baseScreening: any; // no field evidence -> screening exports
let baseFull: any;      // survey + pumping test -> full exports

async function run(fd?: any) {
  const an = new BoreholeAnalyzer();
  const det = (an as any).imageDetector;
  det.analyzeImage = vi.fn(async () => JSON.parse(JSON.stringify(NEUTRAL)));
  det.reverseGeocode = vi.fn(async () => ({ source: 'none' }));
  const r: any = await an.analyzeImage(new File([new Uint8Array([1])], '__aquascan-no-photo__.jpg', { type: 'image/jpeg' }), undefined, { latitude: 1.0157, longitude: 35.0062 } as any, fd);
  r.gpsSource = 'manual';
  return r;
}

beforeAll(async () => {
  const fail = async () => { throw new TypeError('network disabled (test)'); };
  (window as any).fetch = fail; (globalThis as any).fetch = fail;
  (URL as any).createObjectURL = () => 'blob:test'; (URL as any).revokeObjectURL = () => {};
  (HTMLCanvasElement.prototype as any).getContext = function () {
    return new Proxy({}, { get: (_t, k) => (k === 'measureText' ? () => ({ width: 0 }) : k === 'getImageData' ? () => ({ data: new Uint8ClampedArray(4) }) : typeof k === 'string' && ['fillStyle', 'strokeStyle', 'font', 'lineWidth', 'textAlign', 'textBaseline', 'globalAlpha'].includes(k) ? '' : () => {}), set: () => true });
  };
  (HTMLCanvasElement.prototype as any).toDataURL = () => 'data:image/png;base64,AA==';
  pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')).href;
  baseScreening = await run();
  baseFull = await run({ ...SURVEY, ...PUMP });
});

// ─── Re-query fixtures ───
const LIVE_ELEV = 'Open-Meteo elevation API (Copernicus DEM 90m)';
const LIVE_WELLS = ['WPDx Water Point Data Exchange (12 points)', 'OpenStreetMap Overpass (water wells, boreholes, monitoring wells, springs)'];
const LIVE_BUDGET = 'NASA POWER (GLDAS/MERRA-2), 36 months — ActualET Budyko-constrained';
const LOCAL_SOIL = 'ISRIC SoilGrids 2.0, 1 km aggregate (kenya-soilgrids-2.0-1km-v1 v1); regional context, not a site measurement. CC BY 4.0';
const LIVE_SOIL = 'ISRIC SoilGrids v2.0 (250m resolution) (TEST independent source)';
const FALLBACK_BUDGET = '⚠️ Estimated (both APIs unavailable)';

/** A result whose cached values are live answers, so every check can run. */
function cachedLive(r: any, over: Record<string, any> = {}) {
  return {
    ...r,
    remoteSensing: { ...(r.remoteSensing ?? {}), elevation: { elevation: 1650, source: LIVE_ELEV }, soilGrids: { clay: 30, sand: 40, source: LOCAL_SOIL } },
    nasaPowerMoisture: { gwetprofMean: 0.45, dataSource: 'NASA POWER GWETPROF (profile soil moisture, 3yr monthly)' },
    nearbyWells: { ...(r.nearbyWells ?? {}), sampleSize: 12, averageDepth: r.recommendedDepth ?? 100, averageYield: r.estimatedYield ?? 2, dataSources: LIVE_WELLS },
    gldasGroundwater: { ...(r.gldasGroundwater ?? {}), waterBudget: { ...(r.gldasGroundwater?.waterBudget ?? {}), estimatedRecharge: 54, dataSource: LIVE_BUDGET } },
    ...over,
  };
}
const liveFetchers = (o: Partial<Record<'elev' | 'soil' | 'moisture' | 'wells' | 'gldas', any>> = {}) => ({
  elev: async () => ({ elevation: 1655, source: LIVE_ELEV }),
  moisture: async () => ({ gwetprofMean: 0.46, gwetprofTrend: 0, gwetprofMonthly: [], dataSource: 'NASA POWER GWETPROF (profile soil moisture, 3yr monthly)' }),
  soil: async () => ({ clay: 31, sand: 40, source: LIVE_SOIL }),
  wells: async () => ({ sampleSize: 12, averageDepth: null, averageYield: 2, dataSources: LIVE_WELLS, nearbyWells: [] }),
  gldas: async () => ({ waterBudget: { estimatedRecharge: 55, dataSource: LIVE_BUDGET } }),
  ...o,
});

async function verify(result: any, mode: Record<string, any> | null): Promise<VerificationReport> {
  ctl.mode = mode;
  try { return await runPreReportVerification(result); } finally { ctl.mode = null; }
}
const byId = (vr: VerificationReport, id: string) => vr.checks.filter((c) => c.id === id);

// ═══ Unit rules ═══
describe('D1: a skipped or empty comparison is never a pass or a match', () => {
  it('(a) total outage (network disabled, real fetchers): INCOMPLETE, the exact headline, the list, no grade, nothing "matched"', async () => {
    const vr = await verify(baseScreening, null);
    expect(vr.status).toBe('INCOMPLETE');
    expect(vr.verified).toBe(false);
    expect(vr.blocked).toBe(false);
    expect(vr.grade).toBeNull();
    expect(vr.score).toBeNull();
    expect(vr.apiRequeriesMatched).toBe(0);
    expect(vr.summary.startsWith(VERIFICATION_INCOMPLETE_HEADLINE)).toBe(true);
    noClaims(vr.summary);
    for (const id of ['API-ELEV', 'API-MOISTURE', 'API-WELLS', 'API-GLDAS']) {
      const c = byId(vr, id);
      expect(c, id).toHaveLength(1);
      expect(c[0].severity, id).toBe('SKIP');
      expect(c[0].message, id).toMatch(/^Not checked/);
      expect(vr.summary).toContain(c[0].name);
    }
    // The GLDAS "match" of the field report: the fallback compared with itself.
    expect(byId(vr, 'API-GLDAS')[0].message).toMatch(/no independent value/);
    const d = verificationDisplay(vr);
    expect(d.headline).toBe(VERIFICATION_INCOMPLETE_HEADLINE);
    expect(d.grade).toBe(GRADE_NOT_ISSUED);
    expect(d.coverage).toMatch(/^Coverage: \d+ of \d+ checks run$/);
    expect(d.notChecked.length).toBe(vr.skipped);
  });

  it('(b) empty responses: null-vs-null, NaN, 0-vs-0 wells and empty recharge are "no independent value", never matched', async () => {
    const empty = { ...baseScreening,
      remoteSensing: { elevation: { elevation: null, source: LIVE_ELEV } },
      nasaPowerMoisture: { gwetprofMean: null, dataSource: 'NASA POWER' },
      nearbyWells: { sampleSize: 0, averageDepth: null, averageYield: null, dataSources: [] },
      gldasGroundwater: { waterBudget: { estimatedRecharge: null, dataSource: LIVE_BUDGET } },
    };
    const vr = await verify(empty, {
      elev: async () => ({ elevation: null, source: LIVE_ELEV }),
      moisture: async () => ({ gwetprofMean: NaN, dataSource: 'NASA POWER' }),
      wells: async () => ({ sampleSize: 0, dataSources: [] }),
      gldas: async () => ({ waterBudget: { estimatedRecharge: undefined, dataSource: LIVE_BUDGET } }),
    });
    expect(vr.status).toBe('INCOMPLETE');
    expect(vr.apiRequeriesMatched).toBe(0);
    expect((vr as any).apiRequeriesRun).toBe(0);
    for (const id of ['API-ELEV', 'API-MOISTURE', 'API-WELLS', 'API-GLDAS']) expect(byId(vr, id)[0].severity, id).toBe('SKIP');
    expect(byId(vr, 'API-MOISTURE')[0].message).toMatch(/no independent value/);
    expect(byId(vr, 'API-WELLS')[0].message).toMatch(/no independent value/);
    expect(vr.checks.filter((c) => c.category === 'API_REQUERY' && c.severity === 'PASS')).toHaveLength(0);
    noClaims(vr.summary);
  });

  it('a fallback compared with the same fallback (GLDAS estimate, records shipped with the site) is not a match', async () => {
    const r = cachedLive(baseScreening, { gldasGroundwater: { waterBudget: { estimatedRecharge: 54, dataSource: FALLBACK_BUDGET } } });
    const vr = await verify(r, liveFetchers({
      gldas: async () => ({ waterBudget: { estimatedRecharge: 54, dataSource: FALLBACK_BUDGET } }),
      wells: async () => ({ sampleSize: 12, dataSources: ['Field completion records (12 within 50 km — depth/yield/outcome)'] }),
    }));
    expect(byId(vr, 'API-GLDAS')[0].severity).toBe('SKIP');
    expect(byId(vr, 'API-GLDAS')[0].message).toMatch(/no independent value/);
    expect(byId(vr, 'API-WELLS')[0].severity).toBe('SKIP');
    expect(byId(vr, 'API-WELLS')[0].message).toMatch(/shipped with the site/);
    expect(vr.status).toBe('INCOMPLETE');
    expect(vr.apiRequeriesMatched).toBe(3); // elevation, soil and moisture only
  });

  it('soil re-read from the same self-hosted dataset (SoilGrids REST disabled) is the value compared with itself: not a match', async () => {
    const vr = await verify(cachedLive(baseScreening), liveFetchers({ soil: async () => ({ clay: 30, sand: 40, source: LOCAL_SOIL }) }));
    expect(byId(vr, 'API-SOIL')[0].severity).toBe('SKIP');
    expect(byId(vr, 'API-SOIL')[0].message).toMatch(/^Not checked \(no independent value\): soil comes from one self-hosted dataset/);
    expect(vr.status).toBe('INCOMPLETE');
    expect(vr.verified).toBe(false);
  });

  it('(c) partially missing: one re-query unavailable -> INCOMPLETE, "1 of" listed, the others ran', async () => {
    const vr = await verify(cachedLive(baseScreening), liveFetchers({ moisture: async () => null }));
    expect(vr.status).toBe('INCOMPLETE');
    expect(byId(vr, 'API-MOISTURE')[0].severity).toBe('SKIP');
    expect(byId(vr, 'API-MOISTURE')[0].message).toMatch(/unavailable/);
    expect(vr.apiRequeriesPerformed).toBe(5);
    expect((vr as any).apiRequeriesRun).toBe(4);
    expect(vr.apiRequeriesMatched).toBe(4);
    expect(vr.summary).toMatch(/\d+ of \d+ checks could not be run: .*NASA POWER Moisture Re-query/);
    expect(vr.grade).toBeNull();
    noClaims(vr.summary);
  });

  it('no coordinates at all: nothing was re-queried, so INCOMPLETE, no grade, no claim (reviewer finding 1)', async () => {
    const r = { ...cachedLive(baseScreening) };
    delete r.clientLocation; delete r.site; delete r.geoEstimate; delete r.siteIdentity;
    const vr = await verify(r, liveFetchers());
    expect(vr.status).toBe('INCOMPLETE');
    expect(vr.verified).toBe(false);
    expect(vr.grade).toBeNull();
    expect(byId(vr, 'API-ALL')[0].message).toMatch(/^Not checked: no coordinates/);
    noClaims(vr.summary);
  });

  it('every re-query ran and matched but a cross-check had no second source: PASSED, no grade, no "all figures cross-validated"', () => {
    const checks = [
      { id: 'API-ELEV', category: 'API_REQUERY', name: 'Elevation Re-query', severity: 'PASS', message: 'ok' },
      { id: 'XV-YIELD', category: 'CROSS_VALIDATION', name: 'Yield Cross-Validation', severity: 'SKIP', message: 'Not checked: no nearby well yield data to compare' },
    ] as any;
    const vr = buildVerificationReport(checks, { attempted: 1, performed: 1, matched: 1 });
    expect(vr.status).toBe('PASSED');
    expect(vr.grade).toBeNull();
    expect(vr.summary).toContain('every independent re-query ran and matched');
    expect(vr.summary).toContain('Yield Cross-Validation');
    expect(vr.summary).not.toMatch(/cleared for publication|cross-validated against source data/);
    expect(verificationDisplay(vr).grade).toBe(GRADE_NOT_ISSUED);
  });

  it('a source that times out or throws is "Not checked", never a pass', async () => {
    const vr = await verify(cachedLive(baseScreening), liveFetchers({ elev: async () => { throw new Error('boom'); } }));
    expect(byId(vr, 'API-ELEV')[0].severity).toBe('SKIP');
    expect(byId(vr, 'API-ELEV')[0].message).toMatch(/^Not checked: elevation API error/);
    expect(vr.status).toBe('INCOMPLETE');
  });

  it('(e) every check ran with independent values and matched -> PASSED with grade and clearance', () => {
    const checks = [
      { id: 'API-ELEV', category: 'API_REQUERY', name: 'Elevation Re-query', severity: 'PASS', message: 'ok' },
      { id: 'XV-DEPTH-WELLS', category: 'CROSS_VALIDATION', name: 'Depth vs Nearby Wells', severity: 'PASS', message: 'ok' },
      { id: 'IC-PROB-RANGE', category: 'RANGE_BOUND', name: 'Probability Range', severity: 'PASS', message: 'ok' },
    ] as any;
    const vr = buildVerificationReport(checks, { attempted: 1, performed: 1, matched: 1 });
    expect(vr.status).toBe('PASSED');
    expect(vr.verified).toBe(true);
    expect(vr.grade).toBe('A');
    expect(vr.score).toBe(100);
    expect(vr.summary).toContain('VERIFICATION PASSED');
    expect(vr.summary).toContain('cleared for publication');
    expect(verificationDisplay(vr).grade).toBe('Grade A (100%), over all 3 checks');
  });

  it('(d) inconsistent values -> FAILED (blocked): a re-queried source that no longer agrees, and a physics contradiction', async () => {
    const r = cachedLive(baseScreening, { geophysicsFusion: { waterTableDepth_m: 80, bedrockDepth_m: 30 } });
    const vr = await verify(r, liveFetchers({ elev: async () => ({ elevation: 1900, source: LIVE_ELEV }) }));
    expect(vr.status).toBe('FAILED');
    expect(vr.blocked).toBe(true);
    expect(vr.verified).toBe(false);
    expect(vr.grade).toBeNull();
    expect(byId(vr, 'API-ELEV')[0].severity).toBe('FAIL');
    expect(vr.apiRequeriesMatched).toBeLessThan(vr.apiRequeriesPerformed);
    expect(byId(vr, 'PHY-WT-BEDROCK')[0].severity).toBe('FAIL');
    // Elevation drift (1650 vs 1900 m), water table 80 m below bedrock 30 m and so below the 40 m depth: 3 failures.
    expect(vr.summary).toMatch(/^❌ VERIFICATION FAILED — Report blocked\. 3 FAILURE\(s\) detected: \[Elevation Re-query\].*\[Water Table vs Bedrock\]/);
    expect(vr.summary).not.toMatch(/cleared for publication|cross-validated/);
  });

  it('a report stored before the fix (old shape, skipped checks, verified: true) is restated as INCOMPLETE', () => {
    const old: any = { verified: true, score: 96, grade: 'A', totalChecks: 2, passed: 1, warnings: 0, failures: 0, skipped: 1, apiRequeriesPerformed: 5, apiRequeriesMatched: 1,
      checks: [{ id: 'API-GLDAS', category: 'API_REQUERY', name: 'GLDAS Water Budget Re-query', severity: 'PASS', message: 'x' }, { id: 'API-ELEV', category: 'API_REQUERY', name: 'Elevation Re-query', severity: 'SKIP', message: 'Elevation API unavailable during re-query' }],
      summary: '✅ VERIFIED (Grade A, 96%) — All figures cross-validated against source data. Report is cleared for publication.', timestamp: 't', durationMs: 1 };
    expect(verificationStatus(old)).toBe('INCOMPLETE');
    const n = normalizeVerificationReport(old)!;
    expect(n.grade).toBeNull();
    expect(n.summary.startsWith(VERIFICATION_INCOMPLETE_HEADLINE)).toBe(true);
    noClaims(n.summary);
  });

  it('the verification engine failing is INCOMPLETE (was verified: true), and the screen panel uses the shared display', () => {
    const src = fs.readFileSync(path.resolve('external/borehole-ai-engine/src/boreholeAnalyzer.ts'), 'utf8');
    expect(src).not.toMatch(/verified: true, score: 0, grade: 'F'/);
    const ui = fs.readFileSync(path.resolve('external/borehole-ai-engine/src/index.tsx'), 'utf8').replace(/\r\n/g, '\n');
    const panel = ui.slice(ui.indexOf('VERIFICATION STATUS PANEL'), ui.indexOf("Export Reports — All Formats"));
    expect(panel).toContain('verificationDisplay(vr)');
    expect(panel).toContain('{vd.headline}');
    expect(panel).toContain('{vd.coverage}');
    expect(panel).not.toMatch(/'\\u2705 VERIFICATION PASSED'/);
  });
});

// ═══ Screen = every export ═══
type Scenario = { name: string; make: () => Promise<VerificationReport> };
const SCENARIOS: Scenario[] = [
  { name: '(a) all sources unavailable', make: () => verify(baseScreening, null) },
  { name: '(b) empty responses', make: () => verify({ ...cachedLive(baseScreening), nasaPowerMoisture: { gwetprofMean: null }, nearbyWells: { sampleSize: 0, dataSources: [] } }, liveFetchers({ elev: async () => ({ elevation: null, source: LIVE_ELEV }), wells: async () => ({ sampleSize: 0, dataSources: [] }) })) },
  { name: '(c) partially missing data', make: () => verify(cachedLive(baseScreening), liveFetchers({ moisture: async () => null })) },
  { name: '(d) inconsistent values', make: () => verify(cachedLive(baseScreening, { geophysicsFusion: { waterTableDepth_m: 80, bedrockDepth_m: 30 } }), liveFetchers({ elev: async () => ({ elevation: 1900, source: LIVE_ELEV }) })) },
  { name: '(e) all checks ran and matched (mocked)', make: () => verify(cachedLive(baseScreening), liveFetchers()) },
];

async function exportsText(r: any): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  const screening = !(r.siteEvidence?.depth && r.siteEvidence?.yield);
  if (screening) {
    out.PDF = await pdfBytesText(generateScreeningPdf(r, false));
    out.Word = await docxText(await generateScreeningDocx(r, false));
    out.Excel = await xlsxText(await generateScreeningXlsx(r, false));
  } else {
    pdfText.length = 0; saved.length = 0;
    await generatePDFReport(r, 'professional');
    out.PDF = pdfText.join('\n');
    await generateWordReport(r, 'professional');
    out.Word = await docxText(await blobBytes(saved.find((s) => s.name.endsWith('.docx'))!.blob));
    await generateExcelReport(r, 'professional');
    out.Excel = await xlsxText(await blobBytes(saved.find((s) => s.name.endsWith('.xlsx'))!.blob));
  }
  out.CSV = csvReportRows(r).map((x) => x.join(' | ')).join('\n');
  out.JSON = JSON.stringify(jsonReportData(r));
  return out;
}

describe('D1: screen and every export carry the identical verification status, coverage and grade', () => {
  for (const sc of SCENARIOS) {
    it(`${sc.name}: screening exports (no field evidence) and full exports (survey + pumping test)`, async () => {
      const vr = await sc.make();
      const screen = verificationDisplay(vr); // what the panel renders
      const expected = { '(a)': 'INCOMPLETE', '(b)': 'INCOMPLETE', '(c)': 'INCOMPLETE', '(d)': 'FAILED', '(e)': 'PASSED' }[sc.name.slice(0, 3)];
      expect(screen.status).toBe(expected);
      if (vr.skipped > 0) expect(screen.grade).toBe(GRADE_NOT_ISSUED);
      if (expected === 'PASSED') expect(screen.grade).toMatch(/^Grade [A-F] \(\d+%\), over all \d+ checks$/);
      // Every line of the status block: status, coverage, grade, and the verified / not checked / cannot-be-concluded lists.
      const lines = [screen.headline, screen.coverage, screen.grade, ...screen.verified, ...screen.notChecked, ...screen.cannotConclude];
      for (const base of [baseScreening, baseFull]) {
        const r = { ...base, verificationReport: vr };
        expect(verificationRows(r).map((x) => x[1])).toEqual(lines);
        const isFull = base === baseFull;
        if (isFull && expected === 'FAILED') {
          // A FAILED check blocks the full report, with the screen's own summary.
          await expect(generatePDFReport(r, 'professional')).rejects.toBeInstanceOf(VerificationBlockError);
          await expect(generatePDFReport(r, 'professional')).rejects.toThrow(/VERIFICATION FAILED — Report blocked/);
          const j = JSON.stringify(jsonReportData(r));
          for (const l of lines) expect(j).toContain(JSON.stringify(l).slice(1, -1));
          continue;
        }
        const ex = await exportsText(r);
        for (const [fmt, text] of Object.entries(ex)) {
          const t = fmt === 'JSON' ? text : squash(text);
          for (const l of lines) expect(t, `${sc.name} ${isFull ? 'full' : 'screening'} ${fmt}: "${l}"`).toContain(fmt === 'JSON' ? JSON.stringify(l).slice(1, -1)
            // The full PDF prints through its WinAnsi mapping (an em dash prints as "--").
            : isFull && fmt === 'PDF' ? squash(pdfSafeText(sanitizePdfText(l))) : squash(l));
          if (expected !== 'PASSED') {
            // No claim of cross-validation or clearance anywhere in the export.
            expect(t, `${fmt} must not claim publication clearance`).not.toMatch(/cleared for publication/i);
            expect(t, `${fmt} must not claim a pass`).not.toMatch(/VERIFICATION PASSED/);
          }
        }
      }
    });
  }
});

// ═══ Trust score: same rule as the verification grade ═══
describe('D1: the engineer trust score and grade follow the verification coverage', () => {
  it('not issued unless every check ran (screen data, PDF, JSON); issued when PASSED', async () => {
    for (const sc of SCENARIOS) {
      const vr = await sc.make();
      const r = { ...baseFull, verificationReport: vr };
      const t = trustScoreDisplay(r);
      expect(t.issued, sc.name).toBe(vr.status === 'PASSED' && !!baseFull.engineerConfidence);
      if (!t.issued) {
        const trustCheck = runPrePublishAudit(r).checks.find((c: any) => c.id === 16)!;
        expect(trustCheck.severity, sc.name).toBe('WARN');
        expect(trustCheck.details, sc.name).not.toMatch(/Grade [A-F]\b|\d+\/100/);
        expect(t.text, sc.name).toMatch(/^Trust score and grade not issued \(verification (incomplete|failed); \d+ of \d+ checks run\)$/);
        const j: any = jsonReportData(r);
        if (j.engineerConfidence) { expect(j.engineerConfidence.trustGrade, sc.name).toBeNull(); expect(j.engineerConfidence.engineerTrustScore, sc.name).toBeNull(); }
        if (vr.status !== 'FAILED') {
          pdfText.length = 0;
          await generatePDFReport(r, 'professional');
          expect(pdfText.join('\n'), sc.name).not.toMatch(/TRUST SCORE: \d/);
        }
      }
    }
  });
});

// ═══ Pricing lines and contingency: screen = every export ═══
describe('C: the price state of each line and the contingency are identical on screen and in every export', () => {
  const variants: { name: string; pricing: any }[] = [
    { name: 'private project (default)', pricing: undefined },
    { name: 'private project with a verified survey quotation', pricing: { category: 'private', quotations: [{ item: 'survey', amountKES: 60000, reference: 'TEST-Q-17', date: '2026-11-20', label: 'verified project quotation' }] } },
    { name: 'government tender', pricing: { category: 'government_tender', quotations: [] } },
  ];
  for (const v of variants) {
    it(`${v.name}: full exports (survey + pumping test), all-sources-unavailable verification`, async () => {
      const vr = await verify(baseScreening, null);
      const r = { ...baseFull, verificationReport: vr, ...(v.pricing ? { projectPricing: v.pricing } : {}) };
      const cs = costSourcing(computeCanonicalEconomics(r)); // what the cost tab renders
      const survey = cs.lines.find((l) => l.key === 'survey')!;
      const drilling = cs.lines.find((l) => l.key === 'drilling')!;
      const expected: string[] = [
        `${survey.item}`, costLineText(survey).usd, costLineText(drilling).basis,
        cs.contingencyLabel, fmtKES(cs.sourcedContingencyKES), cs.totalLabel, fmtKES(cs.sourcedTotalKES),
        cs.notes.find((n) => n.startsWith('Ground conditions'))!,
      ];
      // The economics carry the same contingency (rate, base, amount) as the screen and exports.
      const e: any = computeCanonicalEconomics(r);
      expect(e.contingency).toBe(cs.sourcedContingency);
      expect(e.contingencyKES).toBe(cs.sourcedContingencyKES);
      expect(e.totalKES).toBe(cs.sourcedTotalKES);
      expect(e.subtotalCost).toBe(cs.sourcedSubtotal);
      if (!v.pricing) { expect(costLineText(survey).usd).toBe('Request a quotation'); expect(costLineText(drilling).usd).toBe('Request a quotation'); }
      if (v.pricing?.quotations?.length) { expect(survey.state).toBe('verified'); expect(costLineText(survey).basis).toBe('verified project quotation: TEST-Q-17, dated 2026-11-20. Applies to this project only'); expected.push(fmtKES(60000), costLineText(survey).basis); }
      if (v.pricing?.category === 'government_tender') { expect(survey.state).toBe('tender'); expect(costLineText(survey).basis).toMatch(/^government tender rate: /); }
      const ex = await exportsText(r);
      for (const [fmt, text] of Object.entries(ex)) {
        const t = fmt === 'JSON' ? text : squash(text);
        for (const l of expected) {
          const want = fmt === 'JSON' ? JSON.stringify(l).slice(1, -1) : fmt === 'PDF' ? squash(pdfSafeText(sanitizePdfText(l))) : squash(l);
          expect(t, `${v.name} ${fmt}: "${l}"`).toContain(want);
        }
        // Quotation #83 appears only as the dated historical reference, never as a price line.
        const refHead = 'one verified 2026 private-project quotation (Project quotation #83 (private client), dated 2026-03-09)';
        // The reference sentence names #83 twice (its heading and its permits bundle); no other "#83" anywhere.
        expect(t.split('#83').length - 1, `${fmt}: every "#83" is in the dated reference sentence`).toBe(2 * (t.split(refHead).length - 1));
        if (!v.pricing) expect(t, `${fmt}: the reference is shown for a private project`).toContain(refHead);
        for (const l of cs.lines) { expect(l.kes, l.key).not.toBe(50000); expect(l.kes, l.key).not.toBe(80000); }
      }
    });
  }
});

// ═══ Partial outage: a useful partial assessment, not a blank refusal ═══
describe('D1: partial outage lists what was verified, what is unavailable, and what cannot be concluded', () => {
  it('NASA POWER and the borehole registries down, the rest live: INCOMPLETE with all three lists, identical in every export', async () => {
    const vr = await verify(cachedLive(baseScreening), liveFetchers({ moisture: async () => null, wells: async () => { throw new TypeError('network down'); } }));
    const d = verificationDisplay(vr);
    expect(d.status).toBe('INCOMPLETE');
    expect(d.headline).toBe(VERIFICATION_INCOMPLETE_HEADLINE);
    expect(d.grade).toBe(GRADE_NOT_ISSUED);
    // (a) what WAS verified, with its source
    expect(d.verified).toContain('Elevation Re-query: ran and matched (source: Open-Elevation API (SRTM 30m))');
    expect(d.verified).toContain('SoilGrids Re-query: ran and matched (source: ISRIC SoilGrids v2.0)');
    expect(d.verified).toContain('GLDAS Water Budget Re-query: ran and matched (source: NASA GLDAS / ERA5-Land)');
    // (b) what remains unavailable, and why
    expect(d.notChecked).toContain('NASA POWER Moisture Re-query: Not checked: NASA POWER data unavailable or timed out for comparison');
    expect(d.notChecked).toContain('Nearby Wells Re-query: Not checked: Borehole database error during re-query');
    // (c) the conclusions that cannot be drawn because of it
    expect(d.cannotConclude).toContain('Soil-moisture context is unverified against NASA POWER');
    expect(d.cannotConclude).toContain('Nearby-borehole evidence (counts and depths) is unverified against the live registries');
    expect(d.cannotConclude.some((x) => /Elevation|Recharge/.test(x))).toBe(false); // those were verified
    const lines = verificationRows({ verificationReport: vr });
    for (const base of [baseScreening, baseFull]) {
      const ex = await exportsText({ ...base, verificationReport: vr });
      const isFull = base === baseFull;
      for (const [fmt, text] of Object.entries(ex)) {
        const t = fmt === 'JSON' ? text : squash(text);
        for (const [, l] of lines) {
          const want = fmt === 'JSON' ? JSON.stringify(l).slice(1, -1) : isFull && fmt === 'PDF' ? squash(pdfSafeText(sanitizePdfText(l))) : squash(l);
          expect(t, `${isFull ? 'full' : 'screening'} ${fmt}: "${l}"`).toContain(want);
        }
      }
    }
  });
});
