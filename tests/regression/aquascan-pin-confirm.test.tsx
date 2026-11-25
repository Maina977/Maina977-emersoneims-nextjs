// @vitest-environment jsdom
/**
 * Re-review of f17f80a7 (2026-11-25), N1/N2/N4 on the REAL page with the REAL engine (adapted from
 * the reviewer's scratch pin-confirm test). Network mocked: /api/geocode answers with real Nominatim
 * answers for Makuyu; every other source is down (the open-water check is offline since M-2).
 * Required:
 *  N1  no engine call at an unconfirmed searched pin on any path (dashboard run, dashboard after a
 *      refused later search, results-view "Find & Re-analyze"); a confirmed pin is labelled
 *      "Searched place, confirmed by the customer";
 *  N2  report downloads are disabled (not only CSS-held) until the water check is confirmed
 *      (since M-2 of the 126efdbc re-review the check is offline; a near-shore pin needs confirmation);
 *  N4  "I'm at the site" clears a pending searched pin.
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, waitFor, screen, cleanup, configure } from '@testing-library/react';

vi.setConfig({ testTimeout: 240000 });
configure({ asyncUtilTimeout: 90000 });

const calls: Array<{ name: string; loc: any }> = [];
const NEUTRAL = { metadata: {}, terrainType: 'unknown', vegetationDensity: 0.3, soilColor: 'brown', rockExposure: false, waterBodies: false, classifications: [], pixelAnalysis: {}, vegetationScore: 0.3, waterProbability: 0.3, isReliableTerrainImage: false, locationMethod: 'none', locationContext: {}, gpsSource: 'none', predictions: [] };

vi.mock('exifr', () => ({ default: { gps: async () => null } }));
vi.mock('@/external/borehole-ai-engine/src/boreholeAnalyzer', async (orig) => {
  const m: any = await orig();
  class Recording extends m.BoreholeAnalyzer {
    constructor() { super(); const d = (this as any).imageDetector; d.analyzeImage = async () => JSON.parse(JSON.stringify(NEUTRAL)); d.reverseGeocode = async () => ({ source: 'none' }); }
    async analyzeImage(f: File, p: any, loc: any, fd: any) { calls.push({ name: f.name, loc: loc ? { latitude: loc.latitude, longitude: loc.longitude } : loc }); return super.analyzeImage(f, p, loc, fd); }
  }
  return { ...m, BoreholeAnalyzer: Recording };
});

const MAKUYU_VILLAGE = { lat: '-0.9005840', lon: '37.1865230', class: 'place', type: 'village', place_rank: 19, addresstype: 'village', name: 'Makuyu', display_name: 'Makuyu, Makuyu ward, Murang`a South, Murang`a, Kenya', boundingbox: ['-0.9205840', '-0.8805840', '37.1665230', '37.2065230'] };
const MAKUYU_WARD = { lat: '-0.9074463', lon: '37.2434046', class: 'boundary', type: 'administrative', place_rank: 16, addresstype: 'city', name: 'Makuyu ward', display_name: 'Makuyu ward, Murang`a South, Murang`a, Kenya', boundingbox: ['-0.9701955', '-0.8448274', '37.1759042', '37.3189139'] };
let geoAnswer: any[] = [MAKUYU_VILLAGE];

beforeAll(() => {
  const f = async (input: any) => {
    const u = decodeURIComponent(typeof input === 'string' ? input : input?.url ?? String(input));
    if (u.includes('/api/geocode') && u.includes('q=')) return new Response(JSON.stringify(geoAnswer), { status: 200, headers: { 'content-type': 'application/json' } });
    throw new TypeError('network disabled (test)');
  };
  (window as any).fetch = f; (globalThis as any).fetch = f;
  (HTMLCanvasElement.prototype as any).getContext = function () {
    return new Proxy({}, { get: (_t, k) => (k === 'measureText' ? () => ({ width: 0 }) : k === 'createLinearGradient' || k === 'createRadialGradient' ? () => ({ addColorStop() {} }) : k === 'getImageData' ? () => ({ data: new Uint8ClampedArray(4) }) : typeof k === 'string' && ['fillStyle', 'strokeStyle', 'font', 'lineWidth', 'textAlign', 'textBaseline', 'globalAlpha', 'lineCap', 'lineJoin', 'shadowBlur', 'shadowColor'].includes(k) ? '' : () => {}), set: () => true });
  };
  (HTMLCanvasElement.prototype as any).toBlob = function (cb: (b: Blob) => void) { cb(new Blob([new Uint8Array([1])], { type: 'image/jpeg' })); };
  (HTMLCanvasElement.prototype as any).toDataURL = () => 'data:image/png;base64,AA==';
  (URL as any).createObjectURL = () => 'blob:test'; (URL as any).revokeObjectURL = () => {};
  (Element.prototype as any).scrollIntoView = () => {}; (window as any).scrollTo = () => {};
});
beforeEach(() => { calls.length = 0; geoAnswer = [MAKUYU_VILLAGE]; });
afterEach(cleanup);

async function mount() {
  const App = (await import('@/external/borehole-ai-engine/src/index')).default;
  const r = render(<App />);
  await waitFor(() => expect(screen.getAllByRole('button').some((b) => /Analyse these coordinates \(no photo\)/.test(b.textContent || ''))).toBe(true));
  await new Promise((res) => setTimeout(res, 20));
  return r;
}
const latBox = () => screen.getByPlaceholderText(/^Latitude \(e\.g\. 0\.026677\) — or paste both/) as HTMLInputElement;
const lonBox = () => screen.getByPlaceholderText(/^Longitude \(e\.g\. 34\.647174\)/) as HTMLInputElement;
const runNoPhoto = () => fireEvent.click(screen.getAllByRole('button').find((b) => /Analyse these coordinates \(no photo\)/.test(b.textContent || ''))!);
async function dashSearch(q: string) {
  fireEvent.change(screen.getByPlaceholderText(/Search place name/), { target: { value: q } });
  fireEvent.click(screen.getAllByRole('button').find((b) => /Find Place/.test(b.textContent || ''))!);
  await new Promise((r) => setTimeout(r, 1400));
}

describe('N1: no run at an unconfirmed searched pin (dashboard)', () => {
  it('unconfirmed village pin: refused, no engine call; after confirming it runs there', async () => {
    const { container } = await mount();
    await dashSearch('Makuyu');
    await waitFor(() => expect(latBox().value).toBe('-0.900584'));
    runNoPhoto();
    await waitFor(() => expect(container.textContent).toMatch(/Confirm the pin is at the drilling site/));
    expect(calls).toHaveLength(0);
    fireEvent.click(screen.getByText('Back and try again'));
    fireEvent.click(screen.getByRole('checkbox', { name: /I confirm this pin/ }));
    runNoPhoto();
    await waitFor(() => expect(calls).toHaveLength(1));
    expect(calls[0].loc).toEqual({ latitude: -0.900584, longitude: 37.186523 });
    await waitFor(() => expect(container.querySelector('.results-view')).toBeTruthy());
    expect(container.textContent).toMatch(/Searched place, confirmed by the customer — centre of Makuyu/);
    expect(container.textContent).not.toMatch(/Manual Entry — Coordinates entered by user/);
  });

  it('village pinned, then a coarse search is refused: the unconfirmed pin AND its coordinates are cleared; nothing runs', async () => {
    const { container } = await mount();
    await dashSearch('Makuyu');
    await waitFor(() => expect(latBox().value).toBe('-0.900584'));
    geoAnswer = [MAKUYU_WARD];
    await dashSearch('Makuyu ward');
    await waitFor(() => expect(container.textContent).toMatch(/is a city, not a site/));
    expect(latBox().value).toBe('');
    expect(lonBox().value).toBe('');
    runNoPhoto();
    await new Promise((r) => setTimeout(r, 500));
    expect(calls).toHaveLength(0);
  });

  it('N4: "I\'m at the site" clears a pending searched pin', async () => {
    const { container } = await mount();
    await dashSearch('Makuyu');
    await waitFor(() => expect(container.textContent).toMatch(/I confirm this pin is at the drilling site/));
    (navigator as any).geolocation = { getCurrentPosition: (ok: (p: any) => void) => ok({ coords: { latitude: -1.2921, longitude: 36.8219, accuracy: 8 } }) };
    fireEvent.click(screen.getAllByRole('button').find((b) => /I.m at the site/.test(b.textContent || ''))!);
    await waitFor(() => expect(latBox().value).toBe('-1.2921'));
    expect(container.textContent).not.toMatch(/I confirm this pin is at the drilling site/);
  });
});

describe('N1 results view + N2 downloads', () => {
  it('"Find & Re-analyze" with a village does NOT re-run until confirmed; "Re-analyse at this pin" then runs; downloads disabled until the water check is confirmed', async () => {
    const { container } = await mount();
    // A recorded shoreline borehole at Kalokol (Lake Turkana, WRA registry): within the 300 m
    // shoreline margin, so the offline water check is inconclusive (re-review of 126efdbc, M-2).
    fireEvent.change(latBox(), { target: { value: '3.31944' } });
    fireEvent.change(lonBox(), { target: { value: '35.96444' } });
    runNoPhoto();
    await waitFor(() => expect(container.querySelector('.results-view')).toBeTruthy());
    expect(calls).toHaveLength(1);
    // N2: the water check is inconclusive: every download button is disabled until confirmed
    expect(container.textContent).toMatch(/Water-body check inconclusive: the pin is within 0\.1 km of the mapped shore of Lake Turkana/);
    // ODbL attribution where the water-check result is shown
    expect(container.textContent).toMatch(/Lake and reservoir maps © OpenStreetMap contributors \(ODbL\)/);
    expect(container.textContent).toMatch(/Water-body check: Water-body check inconclusive.*waiting for your confirmation/);
    fireEvent.click(screen.getAllByRole('button').find((b) => /^Report$/.test(b.textContent || '') )!);
    const pdf = await waitFor(() => screen.getAllByRole('button').find((b) => /PDF Report/.test(b.textContent || ''))!);
    expect((pdf as HTMLButtonElement).disabled).toBe(true);
    fireEvent.keyDown(pdf, { key: 'Enter' }); fireEvent.click(pdf);
    expect(container.textContent).not.toMatch(/PDF report downloaded!/);
    fireEvent.click(screen.getByRole('checkbox', { name: /I have checked: the site is on land/ }));
    await waitFor(() => expect((screen.getAllByRole('button').find((b) => /PDF Report/.test(b.textContent || '')) as HTMLButtonElement).disabled).toBe(false));
    // N1 results view
    fireEvent.click(screen.getAllByRole('button').find((b) => /^Summary$/.test(b.textContent || '') ) ?? screen.getAllByRole('button')[0]);
    const input = screen.getByPlaceholderText(/Esikangu Church of God/);
    fireEvent.change(input, { target: { value: 'Makuyu' } });
    fireEvent.click(screen.getAllByRole('button').find((b) => /Find & Re-analyze/.test(b.textContent || ''))!);
    await waitFor(() => expect(screen.getByRole('checkbox', { name: /I confirm this pin/ })).toBeTruthy());
    await new Promise((r) => setTimeout(r, 500));
    expect(calls).toHaveLength(1);
    const re = screen.getByRole('button', { name: 'Re-analyse at this pin' }) as HTMLButtonElement;
    expect(re.disabled).toBe(true);
    fireEvent.click(screen.getByRole('checkbox', { name: /I confirm this pin/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Re-analyse at this pin' }));
    await waitFor(() => expect(calls).toHaveLength(2));
    expect(calls[1].loc).toEqual({ latitude: -0.900584, longitude: 37.186523 });
  });
});
