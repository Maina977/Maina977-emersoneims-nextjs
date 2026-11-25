// @vitest-environment jsdom
/**
 * Re-review of 126efdbc (2026-11-25) on the REAL page with the REAL engine (network mocked down;
 * /api/geocode answers with the real Nominatim answer for Makuyu village).
 *  B-1  a no-op edit of a pending searched pin (trailing space, "-0.9005840") keeps it pending: no
 *       engine call, no "Manual Entry"; a no-op edit of a confirmed pin keeps its searched-place
 *       label; only a different coordinate replaces the pin. Dashboard and results view.
 *  +    results view: "Re-analyse at this pin" after confirming is labelled as the searched place.
 *  +    double click: one engine call per run, on both run paths.
 *  4e   a photo whose camera GPS disagrees with the typed site is disclosed; the typed site is used.
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, waitFor, screen, cleanup, configure } from '@testing-library/react';

vi.setConfig({ testTimeout: 300000 });
configure({ asyncUtilTimeout: 120000 });

const calls: Array<{ name: string; loc: any }> = [];
const NEUTRAL = { metadata: {}, terrainType: 'unknown', vegetationDensity: 0.3, soilColor: 'brown', rockExposure: false, waterBodies: false, classifications: [], pixelAnalysis: {}, vegetationScore: 0.3, waterProbability: 0.3, isReliableTerrainImage: false, locationMethod: 'none', locationContext: {}, gpsSource: 'none', predictions: [] };

// Camera GPS by file name: "thika-*.jpg" carries Thika's position, every other file none.
vi.mock('exifr', () => ({ default: { gps: async (f: any) => (String(f?.name ?? '').startsWith('thika-') ? { latitude: -1.0388, longitude: 37.0834 } : null) } }));
vi.mock('@/external/borehole-ai-engine/src/boreholeAnalyzer', async (orig) => {
  const m: any = await orig();
  class Recording extends m.BoreholeAnalyzer {
    constructor() { super(); const d = (this as any).imageDetector; d.analyzeImage = async () => JSON.parse(JSON.stringify(NEUTRAL)); d.reverseGeocode = async () => ({ source: 'none' }); }
    async analyzeImage(f: File, p: any, loc: any, fd: any) { calls.push({ name: f.name, loc: loc ? { latitude: loc.latitude, longitude: loc.longitude } : loc }); return super.analyzeImage(f, p, loc, fd); }
  }
  return { ...m, BoreholeAnalyzer: Recording };
});

const MAKUYU_VILLAGE = { lat: '-0.9005840', lon: '37.1865230', class: 'place', type: 'village', place_rank: 19, addresstype: 'village', name: 'Makuyu', display_name: 'Makuyu, Makuyu ward, Murang`a South, Murang`a, Kenya', boundingbox: ['-0.9205840', '-0.8805840', '37.1665230', '37.2065230'] };

beforeAll(() => {
  const f = async (input: any) => {
    const u = decodeURIComponent(typeof input === 'string' ? input : input?.url ?? String(input));
    if (u.includes('/api/geocode') && u.includes('q=')) return new Response(JSON.stringify([MAKUYU_VILLAGE]), { status: 200, headers: { 'content-type': 'application/json' } });
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
  // jsdom loads no images: a photo "loads" at 64 x 64 so the site-photo step completes.
  (window as any).Image = class { onload: any = null; onerror: any = null; naturalWidth = 64; naturalHeight = 64; set src(_v: string) { setTimeout(() => this.onload?.(), 0); } };
});
beforeEach(() => { calls.length = 0; });
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
const noPhotoBtn = () => screen.getAllByRole('button').find((b) => /Analyse these coordinates \(no photo\)/.test(b.textContent || ''))!;
const confirmBox = () => screen.queryByRole('checkbox', { name: /I confirm this pin/ });
async function dashSearch(q: string) {
  fireEvent.change(screen.getByPlaceholderText(/Search place name/), { target: { value: q } });
  fireEvent.click(screen.getAllByRole('button').find((b) => /Find Place/.test(b.textContent || ''))!);
  await waitFor(() => expect(latBox().value).toBe('-0.900584'));
}
const MANUAL = /Manual Entry/;
const SEARCHED = /Searched place, confirmed by the customer — centre of Makuyu/;

describe('B-1: a no-op edit never releases a pending searched pin (dashboard)', () => {
  it('trailing space / equal value in latitude or longitude: still pending, run refused, no engine call', async () => {
    const { container } = await mount();
    await dashSearch('Makuyu');
    for (const [box, value] of [[latBox, '-0.900584 '], [latBox, '-0.9005840'], [lonBox, ' 37.186523'], [latBox, '-0.900584, 37.186523']] as [() => HTMLInputElement, string][]) {
      fireEvent.change(box(), { target: { value } });
      expect(confirmBox(), `after "${value}"`).toBeTruthy();
      expect((confirmBox() as HTMLInputElement).checked).toBe(false);
      fireEvent.click(noPhotoBtn());
      await waitFor(() => expect(container.textContent).toMatch(/Confirm the pin is at the drilling site/));
      await new Promise((r) => setTimeout(r, 300));
      expect(calls, `after "${value}"`).toHaveLength(0);
      expect(container.querySelector('.results-view')).toBeNull();
      const back = screen.queryByText('Back and try again'); if (back) fireEvent.click(back);
      fireEvent.change(latBox(), { target: { value: '-0.900584' } });
      fireEvent.change(lonBox(), { target: { value: '37.186523' } });
    }
  });

  it('confirmed pin + no-op edit: runs at the pin, labelled as the searched place (not Manual Entry)', async () => {
    const { container } = await mount();
    await dashSearch('Makuyu');
    fireEvent.click(confirmBox()!);
    fireEvent.change(latBox(), { target: { value: '-0.900584  ' } });
    expect((confirmBox() as HTMLInputElement).checked).toBe(true);
    fireEvent.click(noPhotoBtn());
    await waitFor(() => expect(container.querySelector('.results-view')).toBeTruthy());
    expect(calls).toHaveLength(1);
    expect(calls[0].loc).toEqual({ latitude: -0.900584, longitude: 37.186523 });
    await waitFor(() => expect(container.textContent).toMatch(SEARCHED));
    expect(container.textContent).not.toMatch(MANUAL);
  });

  it('a DIFFERENT coordinate replaces the pin: the run is a manual entry at the typed point', async () => {
    const { container } = await mount();
    await dashSearch('Makuyu');
    fireEvent.change(latBox(), { target: { value: '-0.9105' } });
    expect(confirmBox()).toBeNull();
    fireEvent.click(noPhotoBtn());
    await waitFor(() => expect(container.querySelector('.results-view')).toBeTruthy());
    expect(calls[0].loc).toEqual({ latitude: -0.9105, longitude: 37.186523 });
    await waitFor(() => expect(container.textContent).toMatch(MANUAL));
    expect(container.textContent).not.toMatch(SEARCHED);
  });
});

describe('results view: confirmed-pin re-analysis label, B-1 no-op edit, double click', () => {
  it('Find & Re-analyze → no-op edit keeps the pin pending → confirm → double-click "Re-analyse at this pin": ONE run, labelled as the searched place', async () => {
    const { container } = await mount();
    fireEvent.change(latBox(), { target: { value: '-1.2921' } });
    fireEvent.change(lonBox(), { target: { value: '36.8219' } });
    // double click on the dashboard run: one engine call
    fireEvent.click(noPhotoBtn()); fireEvent.click(noPhotoBtn());
    await waitFor(() => expect(container.querySelector('.results-view')).toBeTruthy());
    await new Promise((r) => setTimeout(r, 800));
    expect(calls).toHaveLength(1);
    fireEvent.change(screen.getByPlaceholderText(/Esikangu Church of God/), { target: { value: 'Makuyu' } });
    fireEvent.click(screen.getAllByRole('button').find((b) => /Find & Re-analyze/.test(b.textContent || ''))!);
    await waitFor(() => expect(confirmBox()).toBeTruthy());
    // B-1 in the results view: a no-op edit keeps the pin pending
    const rLat = screen.getByPlaceholderText(/^Latitude \(e\.g\. 0\.026677\)$/) as HTMLInputElement;
    fireEvent.change(rLat, { target: { value: `${rLat.value} ` } });
    expect(confirmBox()).toBeTruthy();
    expect((screen.getByRole('button', { name: 'Re-analyse at this pin' }) as HTMLButtonElement).disabled).toBe(true);
    expect(calls).toHaveLength(1);
    fireEvent.click(confirmBox()!);
    const re = screen.getByRole('button', { name: 'Re-analyse at this pin' });
    fireEvent.click(re); fireEvent.click(re);
    await waitFor(() => expect(calls).toHaveLength(2));
    await waitFor(() => expect(container.querySelector('.results-view')).toBeTruthy());
    await new Promise((r) => setTimeout(r, 800));
    expect(calls).toHaveLength(2);
    expect(calls[1].loc).toEqual({ latitude: -0.900584, longitude: 37.186523 });
    await waitFor(() => expect(container.textContent).toMatch(SEARCHED));
    expect(container.textContent).not.toMatch(MANUAL);
    // the re-run of a coordinates-only analysis has no photo (the placeholder is never kept as one)
    expect(container.textContent).toMatch(/Photo: None supplied \(coordinates-only run\)/);
  });
});

describe('4e: the photo GPS disagrees with the typed site', () => {
  it('discloses the distance; the typed site is used', async () => {
    const { container } = await mount();
    fireEvent.change(latBox(), { target: { value: '-1.2921' } });
    fireEvent.change(lonBox(), { target: { value: '36.8219' } });
    const input = container.querySelector('input[type="file"][accept="image/*"][multiple]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [new File([new Uint8Array([1, 2, 3])], 'thika-site.jpg', { type: 'image/jpeg' })] } });
    await waitFor(() => expect(container.querySelector('.results-view')).toBeTruthy());
    expect(calls).toHaveLength(1);
    expect(calls[0].loc).toEqual({ latitude: -1.2921, longitude: 36.8219 });
    // Thika is ~40 km from central Nairobi
    expect(container.textContent).toMatch(/Photo GPS: Photo GPS is \d+ km from the confirmed site; the confirmed site was used\./);
  });

  it('a photo without GPS, or within 0.5 km, adds no note', async () => {
    const { container } = await mount();
    fireEvent.change(latBox(), { target: { value: '-1.2921' } });
    fireEvent.change(lonBox(), { target: { value: '36.8219' } });
    const input = container.querySelector('input[type="file"][accept="image/*"][multiple]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [new File([new Uint8Array([1, 2, 3])], 'plain.jpg', { type: 'image/jpeg' })] } });
    await waitFor(() => expect(container.querySelector('.results-view')).toBeTruthy());
    expect(container.textContent).not.toMatch(/Photo GPS is/);
  });
});
