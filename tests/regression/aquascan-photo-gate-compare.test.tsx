// @vitest-environment jsdom
/**
 * Safety hotfix (review of f736e0b0): "Compare Multiple Sites" in the real page component, engine
 * mocked (desktop-only results, or a Kenya refusal). Adapted from the reviewer's scratch test;
 * asserts the REQUIRED behaviour: no depth / yield / cost / photo figures; refusals shown (M2);
 * coordinates per site (m7); weights copy true (m1); ties are not wins (m2); soil gated and
 * success as a band (m3); no export that always refuses (m9).
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, waitFor, screen, cleanup, configure } from '@testing-library/react';

// The full page component mounts slowly when the whole AquaScan suite runs in parallel.
vi.setConfig({ testTimeout: 90000 });
configure({ asyncUtilTimeout: 20000 });

const calls: Array<{ name: string; loc: any }> = [];
const GPS: Record<string, { latitude: number; longitude: number } | null> = {};
let mode: 'ok' | 'refuse' | 'tie' | 'water' = 'ok';
const desk = (y: number, d: number, p = 0.62) => ({
  probability: p, estimatedYield: y, recommendedDepth: d,
  risk: { overallRisk: 0.3, viability: 'moderate', categories: { geological: 0.3, financial: 0.3, contamination: 0.2 } },
  confidenceMetrics: { overall: 55 }, siteEvidence: { depth: false, yield: false, methods: [], citations: {} },
  soil: { type: 'clay loam', porosity: 0.3 }, waterQuality: { score: 0.7, isPotable: true },
});

vi.mock('exifr', () => ({ default: { gps: async (f: File) => GPS[f.name] ?? null } }));
vi.mock('@/external/borehole-ai-engine/src/boreholeAnalyzer', () => ({
  BoreholeAnalyzer: class {
    async initialize() {}
    async reverseGeocode() { return { source: 'none' }; }
    async analyzeImage(file: File, _p: unknown, loc: any) {
      calls.push({ name: file.name, loc });
      if (mode === 'refuse') throw new Error('Location problem: -6.8000, 39.2800 is outside Kenya\'s land area');
      if (mode === 'tie') return desk(6.5, 40);
      if (mode === 'water') return { ...desk(6.5, 40), waterBodyCheckUnavailable: true };
      return calls.length % 2 ? desk(6.5, 40, 0.71) : desk(1.2, 95, 0.52);
    }
  },
}));

beforeAll(() => {
  (HTMLCanvasElement.prototype as any).getContext = function () {
    return new Proxy({}, { get: (_t, k) => (k === 'measureText' ? () => ({ width: 0 }) : typeof k === 'string' && ['fillStyle', 'strokeStyle', 'font', 'lineWidth', 'textAlign', 'textBaseline', 'globalAlpha'].includes(k) ? '' : () => {}), set: () => true });
  };
  (HTMLCanvasElement.prototype as any).toBlob = function (cb: (b: Blob) => void) { cb(new Blob([new Uint8Array([1])], { type: 'image/jpeg' })); };
  (URL as any).createObjectURL = () => 'blob:test';
  (Element.prototype as any).scrollIntoView = () => {};
});
beforeEach(() => { calls.length = 0; mode = 'ok'; for (const k of Object.keys(GPS)) delete GPS[k]; });
afterEach(cleanup);

async function mountCompare() {
  const App = (await import('@/external/borehole-ai-engine/src/index')).default;
  const r = render(<App />);
  await waitFor(() => expect(screen.getByText(/Compare Multiple Sites/)).toBeTruthy());
  await new Promise((res) => setTimeout(res, 20));
  fireEvent.click(screen.getByText(/Compare Multiple Sites/));
  await waitFor(() => expect(r.container.querySelector('.compare-view')).toBeTruthy());
  return r;
}
const inputs = (c: HTMLElement) => Array.from(c.querySelectorAll('.compare-card input[type="file"]')) as HTMLInputElement[];
const up = (el: HTMLInputElement, name: string) => fireEvent.change(el, { target: { files: [new File([new Uint8Array([1, 2])], name, { type: 'image/jpeg' })] } });
const view = (c: HTMLElement) => c.querySelector('.compare-view')!.textContent!;

describe('compare flow (required behaviour)', () => {
  it('photo without GPS: not analysed; the note says how to proceed (enter this site\'s coordinates)', async () => {
    const { container } = await mountCompare();
    up(inputs(container)[0], 'a.jpg');
    await waitFor(() => expect(container.textContent).toMatch(/Not analysed: this photo has no camera GPS position/));
    expect(container.textContent).toMatch(/Enter this site’s latitude and longitude below/);
    expect(calls).toHaveLength(0);
  });

  it('coordinates typed for a site: analysed there (placeholder), without needing a photo', async () => {
    const { container } = await mountCompare();
    fireEvent.change(screen.getByLabelText('Site A latitude'), { target: { value: '-1.29' } });
    fireEvent.change(screen.getByLabelText('Site A longitude'), { target: { value: '36.82' } });
    fireEvent.click(screen.getAllByText('Analyse at these coordinates')[0]);
    await waitFor(() => expect(calls).toHaveLength(1));
    expect(calls[0]).toEqual({ name: '__aquascan-no-photo__.jpg', loc: { latitude: -1.29, longitude: 36.82 } });
    void container;
  });

  it('two GPS sites: no depth, yield, cost figure; true weights copy; soil gated; success as a band; no dead-end export', async () => {
    const { container } = await mountCompare();
    GPS['a.jpg'] = { latitude: -1.29, longitude: 36.82 };
    GPS['b.jpg'] = { latitude: -0.30, longitude: 36.08 };
    up(inputs(container)[0], 'a.jpg');
    await waitFor(() => expect(calls).toHaveLength(1));
    up(inputs(container)[1], 'b.jpg');
    await waitFor(() => expect(container.textContent).toMatch(/Engineering Recommendation/));
    const t = view(container);
    expect(t).not.toMatch(/6\.5|\b95\s?m|\b40\s?m|m³\/h \(|USD|\$/);
    expect(t).not.toMatch(/Yield Potential|Cost Efficiency|Est\. Drilling Cost|Recommended Depth|Estimated Yield/);
    expect(t).not.toMatch(/success 30%, yield 25%, risk 20%, confidence 15%, cost 10%/);
    expect(t).toMatch(/Yield \(25\) and depth \(10\) count only for a site with a field survey and a pumping test/);
    expect(t).not.toMatch(/CLAY LOAM/);
    expect(t).toMatch(/Unknown until drilled/);
    expect(t).toMatch(/Chance of success \(planning estimate\)/);
    expect(t).not.toMatch(/Export Comparison PDF/);
    expect(t).toMatch(/A comparison report needs a field survey and a pumping test at every site/);
  });

  it('a tie is not a win: no BEST SITE badge, no "highest composite score", the tie is stated', async () => {
    const { container } = await mountCompare();
    mode = 'tie';
    GPS['a.jpg'] = { latitude: -1.29, longitude: 36.82 };
    GPS['b.jpg'] = { latitude: -0.30, longitude: 36.08 };
    up(inputs(container)[0], 'a.jpg');
    await waitFor(() => expect(calls).toHaveLength(1));
    up(inputs(container)[1], 'b.jpg');
    await waitFor(() => expect(container.textContent).toMatch(/No site is ahead/));
    const t = view(container);
    expect(t).not.toMatch(/BEST SITE/);
    expect(t).not.toMatch(/has the highest composite score/);
    expect(container.querySelectorAll('.matrix-best')).toHaveLength(0);
  });

  it('an engine refusal (GPS outside Kenya) is shown on the card (was: blank card)', async () => {
    const { container } = await mountCompare();
    mode = 'refuse';
    GPS['tz.jpg'] = { latitude: -6.8, longitude: 39.28 };
    up(inputs(container)[0], 'tz.jpg');
    await waitFor(() => expect(calls).toHaveLength(1));
    const card = container.querySelectorAll('.compare-card')[0];
    await waitFor(() => expect(card.querySelector('[role="alert"]')?.textContent).toMatch(/Not analysed: -6\.8000, 39\.2800 is outside Kenya's land area/));
  });

  it('N3: a site whose water-body check was unavailable is not shown or ranked until the customer confirms it is on land', async () => {
    const { container } = await mountCompare();
    mode = 'water';
    GPS['w.jpg'] = { latitude: -1.29, longitude: 36.82 };
    up(inputs(container)[0], 'w.jpg');
    await waitFor(() => expect(calls).toHaveLength(1));
    const card = () => container.querySelectorAll('.compare-card')[0];
    await waitFor(() => expect(card().textContent).toMatch(/confirm on a map that this site is on land before it is shown or ranked/));
    expect(card().textContent).not.toMatch(/Score:/);
    expect(card().textContent).not.toMatch(/Chance of success/);
    fireEvent.click(screen.getByLabelText('Site A: I have checked the site is on land'));
    await waitFor(() => expect(card().textContent).toMatch(/Score:/));
  });
});
