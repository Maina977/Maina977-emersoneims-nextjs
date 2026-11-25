// @vitest-environment jsdom
/**
 * Re-review of f89698e8, BLOCKING 2 (2026-11-25): a VALUE-DRIVEN scan. The engine's own modelled
 * depth and yield numbers for this site are collected from the result object (every numeric field
 * whose name is a depth, casing, screen, head, water level or yield, plus half the depth, which the
 * pump sizing used). Then EVERY customer and technical tab, and every screening export, is searched
 * for those numbers as metres or m³/h, including ranges ("0–72 m", "52 m – 72 m") and table cells
 * with no "depth" keyword nearby. Without field evidence: zero hits.
 * Regional records labelled as records, county or national context are not site figures.
 * Writes the hits to $AQUASCAN_FIGSCAN_OUT when set.
 */
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import fs from 'node:fs';
import { render, fireEvent, waitFor, screen, cleanup, configure } from '@testing-library/react';

vi.setConfig({ testTimeout: 600000 });
configure({ asyncUtilTimeout: 120000 });

const results: any[] = [];
const NEUTRAL = { metadata: {}, terrainType: 'unknown', vegetationDensity: 0.3, soilColor: 'brown', rockExposure: false, waterBodies: false, classifications: [], pixelAnalysis: {}, vegetationScore: 0.3, waterProbability: 0.3, isReliableTerrainImage: false, locationMethod: 'none', locationContext: {}, gpsSource: 'none', predictions: [] };
vi.mock('exifr', () => ({ default: { gps: async () => null } }));
vi.mock('@/external/borehole-ai-engine/src/boreholeAnalyzer', async (orig) => {
  const m: any = await orig();
  class Capturing extends m.BoreholeAnalyzer {
    constructor() { super(); const d = (this as any).imageDetector; d.analyzeImage = async () => JSON.parse(JSON.stringify(NEUTRAL)); d.reverseGeocode = async () => ({ source: 'none' }); }
    async analyzeImage(f: File, p: any, loc: any, fd: any) { const r = await super.analyzeImage(f, p, loc, fd); results.push(r); return r; }
  }
  return { ...m, BoreholeAnalyzer: Capturing };
});
beforeAll(() => {
  const f = async () => { throw new TypeError('network disabled (test)'); };
  (window as any).fetch = f; (globalThis as any).fetch = f;
  (HTMLCanvasElement.prototype as any).getContext = function () {
    return new Proxy({}, { get: (_t, k) => (k === 'measureText' ? () => ({ width: 0 }) : k === 'createLinearGradient' || k === 'createRadialGradient' ? () => ({ addColorStop() {} }) : k === 'getImageData' ? () => ({ data: new Uint8ClampedArray(4) }) : typeof k === 'string' && ['fillStyle', 'strokeStyle', 'font', 'lineWidth', 'textAlign', 'textBaseline', 'globalAlpha', 'lineCap', 'lineJoin', 'shadowBlur', 'shadowColor'].includes(k) ? '' : () => {}), set: () => true });
  };
  (HTMLCanvasElement.prototype as any).toBlob = function (cb: (b: Blob) => void) { cb(new Blob([new Uint8Array([1])], { type: 'image/jpeg' })); };
  (HTMLCanvasElement.prototype as any).toDataURL = () => 'data:image/png;base64,AA==';
  (URL as any).createObjectURL = () => 'blob:test'; (URL as any).revokeObjectURL = () => {};
  (Element.prototype as any).scrollIntoView = () => {}; (window as any).scrollTo = () => {};
});
afterEach(cleanup);

const DEPTH_KEY = /depth|casing|screen|head|waterlevel|water_level|swl|pwl|drawdown|aquifertop|aquiferbottom|bedrock/i;
const YIELD_KEY = /yield|discharge|pumprate|pumpingrate|flowrate|safeyield|sustainable/i;
const SKIP_KEY = /boreholeRecords|nearbyWells|countyIntelligence|records|regional|national|county|historical|weather|climate|grace|gldas|soil|elevation|dem|resolution|accuracy|confidence|probability|score|percent|cost|price|usd|kes/i;

/** The modelled depth / yield numbers of this run, from the engine result. */
export function modelledNumbers(result: any): { depth: Set<number>; yield: Set<number> } {
  const depth = new Set<number>(), yld = new Set<number>();
  const walk = (o: any, path: string, depthN: number) => {
    if (o == null || depthN > 7) return;
    if (typeof o === 'number') {
      const leaf = path.split('.').slice(-2).join('.');
      if (SKIP_KEY.test(path)) return;
      if (DEPTH_KEY.test(leaf) && o >= 5 && o <= 400) depth.add(Math.round(o));
      else if (YIELD_KEY.test(leaf) && o >= 0.2 && o <= 100) yld.add(Math.round(o * 10) / 10);
      return;
    }
    if (Array.isArray(o)) { o.slice(0, 50).forEach((v, i) => walk(v, `${path}.${i}`, depthN + 1)); return; }
    if (typeof o === 'object') for (const [k, v] of Object.entries(o)) walk(v, path ? `${path}.${k}` : k, depthN + 1);
  };
  walk(result, '', 0);
  const d = Number(result?.recommendedDepth);
  if (d > 0) { depth.add(Math.round(d)); depth.add(Math.round(d / 2)); }
  for (const v of result?.uncertainty?.depthRange ?? []) depth.add(Math.round(Number(v)));
  for (const v of result?.uncertainty?.yieldRange ?? []) yld.add(Math.round(Number(v) * 10) / 10);
  const y = Number(result?.estimatedYield); if (y > 0) yld.add(Math.round(y * 10) / 10);
  return { depth, yield: yld };
}

/** Context that marks a regional record, not a figure for this site (as accepted by the reviewer). */
const ALLOWED = /(boreholes? (on record|recorded)|recorded boreholes|nearby (records|boreholes)|of recorded|records within|records nearby|records? (show|in|for)|typical depth|county|national|kenya average|registry|wra records|per m\b|\/m\b|per metre|investigation depth|method depth range|resolution|accuracy|±|elevation|altitude|above sea|km\b)/i;

/** Visible text with a space between text nodes (textContent glues "42 m" to the next cell). */
export function textOf(el: Element | null): string {
  if (!el) return '';
  const parts: string[] = [];
  const w = el.ownerDocument!.createTreeWalker(el, 4 /* SHOW_TEXT */);
  for (let n = w.nextNode(); n; n = w.nextNode()) parts.push(n.nodeValue || '');
  return parts.join(' ').replace(/\s+/g, ' ');
}
/** Immediately before the number: a sensor or map resolution ("SRTM 30m DEM"), not a site figure. */
const RESOLUTION_BEFORE = /(SRTM|ASTER|GDEM|\bDEM\b|Sentinel|Landsat|MODIS|LiCSAR|EGMS|TIRS?\b|resolution|pixel|grid)/i;

export function scanText(t: string, nums: { depth: Set<number>; yield: Set<number> }) {
  const hits: { kind: string; n: number; ctx: string }[] = [];
  const M = String.raw`\s?(?:m\b(?![³3\/a-z])|metres?\b)`;
  for (const n of nums.depth) {
    const N = String(n);
    const re = new RegExp(String.raw`(?<![\d.,])${N}(?:\.\d+)?${M}|(?<![\d.,])${N}(?:\.\d+)?\s?(?:–|-|to)\s?\d+(?:\.\d+)?${M}|\d+(?:\.\d+)?\s?m?\s?(?:–|-|to)\s?${N}(?:\.\d+)?${M}`, 'g');
    let m: RegExpExecArray | null;
    while ((m = re.exec(t))) {
      const ctx = t.slice(Math.max(0, m.index - 110), m.index + m[0].length + 50);
      if (RESOLUTION_BEFORE.test(t.slice(Math.max(0, m.index - 45), m.index))) continue;
      if (!ALLOWED.test(ctx)) hits.push({ kind: 'depth', n, ctx });
    }
  }
  for (const n of nums.yield) {
    const N = String(n).replace('.', String.raw`\.`);
    const re = new RegExp(String.raw`(?<![\d.,])${N}\d*\s?m(?:³|3)\/h`, 'g');
    let m: RegExpExecArray | null;
    while ((m = re.exec(t))) {
      const ctx = t.slice(Math.max(0, m.index - 110), m.index + m[0].length + 50);
      if (!ALLOWED.test(ctx)) hits.push({ kind: 'yield', n, ctx });
    }
  }
  return hits;
}

describe('BLOCKING 2: no modelled depth/yield number (by value) on any tab or screening export without field evidence', () => {
  it('scans every customer + technical tab and the screening exports', async () => {
    const App = (await import('@/external/borehole-ai-engine/src/index')).default;
    const { container } = render(<App />);
    await waitFor(() => expect(screen.getAllByRole('button').some((b) => /Analyse these coordinates \(no photo\)/.test(b.textContent || ''))).toBe(true));
    fireEvent.change(screen.getByPlaceholderText(/^Latitude \(e\.g\. 0\.026677\) — or paste both/), { target: { value: '-0.900584' } });
    fireEvent.change(screen.getByPlaceholderText(/^Longitude \(e\.g\. 34\.647174\)/), { target: { value: '37.186523' } });
    fireEvent.click(screen.getAllByRole('button').find((b) => /Analyse these coordinates \(no photo\)/.test(b.textContent || ''))!);
    await waitFor(() => expect(container.querySelector('.results-view')).toBeTruthy());
    const result = results[results.length - 1];
    const nums = modelledNumbers(result);
    // the run really has modelled figures to leak (otherwise the scan would prove nothing)
    expect(Number(result.recommendedDepth)).toBeGreaterThan(10);
    expect(nums.depth.size).toBeGreaterThan(3);
    const hits: { where: string; kind: string; n: number; ctx: string }[] = [];
    const tabs: string[] = [];
    const scanAll = async (group: string) => {
      const labels = Array.from(container.querySelectorAll('.result-tabs button')).map((b) => (b.textContent || '').trim()).filter((l) => l && !/Technical appendix|Back to the summary/.test(l));
      for (const label of labels) {
        const b = Array.from(container.querySelectorAll('.result-tabs button')).find((x) => (x.textContent || '').trim() === label) as HTMLElement | undefined;
        if (!b) continue;
        fireEvent.click(b);
        await new Promise((r) => setTimeout(r, 30));
        tabs.push(`${group}:${label}`);
        const t = textOf(container.querySelector('.results-view'));
        for (const h of scanText(t, nums)) hits.push({ where: `${group}:${label}`, ...h });
      }
    };
    await scanAll('customer');
    fireEvent.click(Array.from(container.querySelectorAll('.result-tabs button')).find((b) => /Technical appendix/.test(b.textContent || '')) as HTMLElement);
    await new Promise((r) => setTimeout(r, 30));
    await scanAll('technical');
    // exports (screening: no field evidence)
    const { screeningRows, screeningContent } = await import('@/external/borehole-ai-engine/src/screeningReport');
    const { jsonReportData, csvReportRows: generateCSVRows } = (await import('@/external/borehole-ai-engine/src/reportGenerator')) as any;
    const exportTexts: [string, string][] = [
      ['screening content (PDF/Word)', JSON.stringify(screeningContent(result))],
      ['screening rows (Excel/CSV)', screeningRows(result).map((r: string[]) => r.join(' | ')).join('\n')],
      ['JSON', JSON.stringify(jsonReportData(result))],
    ];
    if (typeof generateCSVRows === 'function') exportTexts.push(['CSV', generateCSVRows(result).map((r: any[]) => r.join(' | ')).join('\n')]);
    for (const [where, t] of exportTexts) for (const h of scanText(t.replace(/\\u2013/g, '–'), nums)) hits.push({ where: `export:${where}`, ...h });
    if (process.env.AQUASCAN_FIGSCAN_OUT) fs.writeFileSync(process.env.AQUASCAN_FIGSCAN_OUT, JSON.stringify({ depth: [...nums.depth], yield: [...nums.yield], tabs, hits }, null, 1));
    expect(tabs.length).toBeGreaterThan(20);
    expect(hits.map((h) => `${h.where} [${h.kind} ${h.n}] ${h.ctx}`)).toEqual([]);
  });
});
