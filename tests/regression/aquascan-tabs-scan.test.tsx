// @vitest-environment jsdom
/**
 * Re-review of 126efdbc, B-2 / B-3 (2026-11-25): render the REAL result view (real engine, network
 * mocked down) for a desktop-only run (no survey, no pumping test, no laboratory test), open EVERY
 * customer tab and EVERY technical-appendix tab, and assert that no tab shows a site depth, a yield,
 * a cost/ROI/payback figure, or a potability / treatment conclusion. Adapted from the reviewer's
 * browser tab scan (tabs-scan-126efdbc.cjs, same patterns). Writes the hits to
 * $AQUASCAN_TABSCAN_OUT when set.
 */
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import fs from 'node:fs';
import { render, fireEvent, waitFor, screen, cleanup, configure } from '@testing-library/react';

vi.setConfig({ testTimeout: 300000 });
configure({ asyncUtilTimeout: 120000 });

const NEUTRAL = { metadata: {}, terrainType: 'unknown', vegetationDensity: 0.3, soilColor: 'brown', rockExposure: false, waterBodies: false, classifications: [], pixelAnalysis: {}, vegetationScore: 0.3, waterProbability: 0.3, isReliableTerrainImage: false, locationMethod: 'none', locationContext: {}, gpsSource: 'none', predictions: [] };
vi.mock('exifr', () => ({ default: { gps: async () => null } }));
vi.mock('@/external/borehole-ai-engine/src/boreholeAnalyzer', async (orig) => {
  const m: any = await orig();
  class Stubbed extends m.BoreholeAnalyzer {
    constructor() { super(); const d = (this as any).imageDetector; d.analyzeImage = async () => JSON.parse(JSON.stringify(NEUTRAL)); d.reverseGeocode = async () => ({ source: 'none' }); }
  }
  return { ...m, BoreholeAnalyzer: Stubbed };
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

// The reviewer's patterns (tabs-scan-126efdbc.cjs), plus ROI and payback.
const PATTERNS: [string, RegExp][] = [
  ['depth in metres', /(depth|drill(ing)? to|target)[^\n]{0,40}?\b\d{2,3}(\.\d)?\s?m\b(?!³|3)/i],
  ['yield m³/h', /\b\d+(\.\d+)?\s?m(³|3)\/h(?! per m)/i],
  ['money', /(\$|USD|KSh|KES)\s?\d[\d,]*/],
  ['ROI / payback', /\b(ROI|payback)\b[^\n]{0,30}?\d/i],
  ['potable / safe to drink', /\b(Potable|Safe to drink|Disinfection only)\b/],
];
/**
 * Context that is NOT a figure for this site, and allowed: statistics of recorded boreholes nearby
 * (labelled as records), the generic method catalogue and published unit rates.
 */
const ALLOWED_CONTEXT = /(boreholes? (on record|recorded)|recorded boreholes|nearby (records|boreholes)|of recorded|records within|records nearby|per kW|investigation depth|method depth range)/i;

describe('B-2/B-3: no modelled depth, yield, cost, ROI, payback or potability on ANY tab without field evidence', () => {
  it('scans every customer and technical tab', async () => {
    const App = (await import('@/external/borehole-ai-engine/src/index')).default;
    const { container } = render(<App />);
    await waitFor(() => expect(screen.getAllByRole('button').some((b) => /Analyse these coordinates \(no photo\)/.test(b.textContent || ''))).toBe(true));
    fireEvent.change(screen.getByPlaceholderText(/^Latitude \(e\.g\. 0\.026677\) — or paste both/), { target: { value: '1.0157' } });
    fireEvent.change(screen.getByPlaceholderText(/^Longitude \(e\.g\. 34\.647174\)/), { target: { value: '35.0062' } });
    fireEvent.click(screen.getAllByRole('button').find((b) => /Analyse these coordinates \(no photo\)/.test(b.textContent || ''))!);
    await waitFor(() => expect(container.querySelector('.results-view')).toBeTruthy());
    const hits: { tab: string; kind: string; text: string }[] = [];
    const tabs: string[] = [];
    const scanAll = async (group: string) => {
      const labels = Array.from(container.querySelectorAll('.result-tabs button')).map((b) => (b.textContent || '').trim()).filter((l) => l && !/Technical appendix|Back to the summary/.test(l));
      for (const label of labels) {
        const b = Array.from(container.querySelectorAll('.result-tabs button')).find((x) => (x.textContent || '').trim() === label) as HTMLElement | undefined;
        if (!b) continue;
        fireEvent.click(b);
        await new Promise((r) => setTimeout(r, 30));
        const t = (container.querySelector('.results-view')?.textContent || '').replace(/\s+/g, ' ');
        tabs.push(`${group}:${label}`);
        for (const [kind, re] of PATTERNS) {
          const g = new RegExp(re.source, re.flags + 'g');
          let m: RegExpExecArray | null;
          while ((m = g.exec(t))) {
            const ctx = t.slice(Math.max(0, m.index - 120), m.index + m[0].length + 60);
            if (!ALLOWED_CONTEXT.test(ctx)) hits.push({ tab: `${group}:${label}`, kind, text: ctx });
          }
        }
      }
    };
    await scanAll('customer');
    fireEvent.click(Array.from(container.querySelectorAll('.result-tabs button')).find((b) => /Technical appendix/.test(b.textContent || '')) as HTMLElement);
    await new Promise((r) => setTimeout(r, 30));
    await scanAll('technical');
    if (process.env.AQUASCAN_TABSCAN_OUT) fs.writeFileSync(process.env.AQUASCAN_TABSCAN_OUT, JSON.stringify({ tabs, hits }, null, 1));
    expect(tabs.length).toBeGreaterThan(20);
    expect(hits.map((h) => `${h.tab} [${h.kind}] ${h.text}`)).toEqual([]);
  });
});
