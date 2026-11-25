// @vitest-environment jsdom
/**
 * Re-review of f89698e8, BLOCKING 1 (2026-11-25): PROPERTY test of the searched-pin run gate on the
 * REAL page with the REAL engine. Seeded random sequences of keystroke-level edits: typing, Backspace,
 * clearing, pasting a pair, retyping, spaces, extra zeros. Any sequence that ENDS at the unconfirmed
 * pin's coordinates gives zero engine calls, on the dashboard and in the results view ("Apply &
 * Re-analyze"). A sequence that ends elsewhere runs at the typed point, labelled as a manual entry.
 * Includes the reviewer's reproductions (End + Backspace + "4"; clear both and retype).
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, waitFor, screen, cleanup, configure } from '@testing-library/react';
import { atPin, pinBlocksRun, pinAfterRun, boxesToPoint, PIN_MATCH_DEG } from '@/external/borehole-ai-engine/src/pinGate';

vi.setConfig({ testTimeout: 600000 });
configure({ asyncUtilTimeout: 120000 });

const calls: Array<{ loc: any }> = [];
const NEUTRAL = { metadata: {}, terrainType: 'unknown', vegetationDensity: 0.3, soilColor: 'brown', rockExposure: false, waterBodies: false, classifications: [], pixelAnalysis: {}, vegetationScore: 0.3, waterProbability: 0.3, isReliableTerrainImage: false, locationMethod: 'none', locationContext: {}, gpsSource: 'none', predictions: [] };
vi.mock('exifr', () => ({ default: { gps: async () => null } }));
vi.mock('@/external/borehole-ai-engine/src/boreholeAnalyzer', async (orig) => {
  const m: any = await orig();
  class Recording extends m.BoreholeAnalyzer {
    constructor() { super(); const d = (this as any).imageDetector; d.analyzeImage = async () => JSON.parse(JSON.stringify(NEUTRAL)); d.reverseGeocode = async () => ({ source: 'none' }); }
    async analyzeImage(f: File, p: any, loc: any, fd: any) { calls.push({ loc: loc ? { latitude: loc.latitude, longitude: loc.longitude } : loc }); return super.analyzeImage(f, p, loc, fd); }
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
});
beforeEach(() => { calls.length = 0; });
afterEach(cleanup);

/** mulberry32: a seeded PRNG, so a failing sequence can be replayed from its seed. */
function rng(seed: number) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const PIN = { lat: '-0.900584', lon: '37.186523' };

type Box = 'lat' | 'lon';
/** A random edit sequence as successive box values (each one is a keystroke-level change event). */
function sequence(r: () => number, endLat: string, endLon: string): [Box, string][] {
  const out: [Box, string][] = [];
  const cur: Record<Box, string> = { lat: PIN.lat, lon: PIN.lon };
  const set = (b: Box, v: string) => { cur[b] = v; out.push([b, v]); };
  const typeOut = (b: Box, text: string) => { for (const ch of text) set(b, cur[b] + ch); };
  const noise = 1 + Math.floor(r() * 6);
  for (let k = 0; k < noise; k++) {
    const b: Box = r() < 0.6 ? 'lat' : 'lon';
    const op = Math.floor(r() * 6);
    if (op === 0) { const n = 1 + Math.floor(r() * 4); for (let i = 0; i < n && cur[b]; i++) set(b, cur[b].slice(0, -1)); }  // Backspace x n
    else if (op === 1) set(b, '');                                                                                          // clear
    else if (op === 2) typeOut(b, String(Math.floor(r() * 10)));                                                             // stray digit
    else if (op === 3) set(b, cur[b] + ' ');                                                                                 // space
    else if (op === 4) set(b, cur[b] + '0');                                                                                 // extra zero
    else { set('lat', `${PIN.lat}, ${PIN.lon}`); set('lon', ''); }                                                           // paste the pair
  }
  // Finish: reach the end values by retyping (clear + type, or Backspace to a common prefix + type)
  for (const [b, target] of [['lat', endLat], ['lon', endLon]] as [Box, string][]) {
    const style = Math.floor(r() * 3);
    if (style === 0) { set(b, ''); typeOut(b, target); }
    else if (style === 1) { let p = 0; while (p < cur[b].length && p < target.length && cur[b][p] === target[p]) p++; while (cur[b].length > p) set(b, cur[b].slice(0, -1)); typeOut(b, target.slice(p)); }
    else set(b, target);
  }
  return out;
}

async function mount() {
  const App = (await import('@/external/borehole-ai-engine/src/index')).default;
  const r = render(<App />);
  await waitFor(() => expect(screen.getAllByRole('button').some((b) => /Analyse these coordinates \(no photo\)/.test(b.textContent || ''))).toBe(true));
  return r;
}
const latBox = () => screen.getByPlaceholderText(/^Latitude \(e\.g\. 0\.026677\) — or paste both/) as HTMLInputElement;
const lonBox = () => screen.getByPlaceholderText(/^Longitude \(e\.g\. 34\.647174\)/) as HTMLInputElement;
const noPhotoBtn = () => screen.getAllByRole('button').find((b) => /Analyse these coordinates \(no photo\)/.test(b.textContent || ''))!;
async function dashSearch() {
  fireEvent.change(screen.getByPlaceholderText(/Search place name/), { target: { value: 'Makuyu' } });
  fireEvent.click(screen.getAllByRole('button').find((b) => /Find Place/.test(b.textContent || ''))!);
  await waitFor(() => expect(latBox().value).toBe(PIN.lat));
}

describe('pinGate (pure): the decision depends on the coordinates only', () => {
  it('property: 2,000 random points around the pin; blocked exactly within ~1 m; a run elsewhere replaces only an unconfirmed pin', () => {
    const r = rng(20261125);
    const pin = { lat: PIN.lat, lon: PIN.lon, name: 'Makuyu', needsConfirm: true, confirmed: false };
    for (let i = 0; i < 2000; i++) {
      const dLat = (r() - 0.5) * 4e-5, dLon = (r() - 0.5) * 4e-5;
      const la = Number(PIN.lat) + dLat, lo = Number(PIN.lon) + dLon;
      const near = Math.abs(dLat) <= PIN_MATCH_DEG && Math.abs(dLon) <= PIN_MATCH_DEG;
      expect(pinBlocksRun(pin, la, lo)).toBe(near);
      expect(pinBlocksRun({ ...pin, confirmed: true }, la, lo)).toBe(false);
      expect(pinAfterRun(pin, la, lo)).toBe(near ? pin : null);
    }
    for (const v of ['-0.900584 ', ' -0.9005840', '-0.90058400']) expect(atPin(pin, boxesToPoint(v, PIN.lon)!.lat, Number(PIN.lon))).toBe(true);
    expect(boxesToPoint(`${PIN.lat}, ${PIN.lon}`, '')).toEqual({ lat: -0.900584, lon: 37.186523 });
  });
});

describe('BLOCKING 1 property (page): any edit sequence ending at the unconfirmed pin runs nothing', () => {
  it('reviewer reproductions + 24 seeded random sequences on the dashboard: 0 engine calls', async () => {
    const { container } = await mount();
    await dashSearch();
    const seqs: [string, [Box, string][]][] = [
      ['End + Backspace + "4"', [['lat', '-0.90058'], ['lat', '-0.900584']]],
      ['clear both, retype', [['lat', ''], ['lon', ''], ...[...PIN.lat].map((_, i) => ['lat', PIN.lat.slice(0, i + 1)] as [Box, string]), ...[...PIN.lon].map((_, i) => ['lon', PIN.lon.slice(0, i + 1)] as [Box, string])]],
    ];
    for (let seed = 1; seed <= 24; seed++) {
      const r = rng(seed);
      const endLat = [PIN.lat, `${PIN.lat}0`, ` ${PIN.lat} `][Math.floor(r() * 3)];
      const endLon = [PIN.lon, `${PIN.lon}00`, `${PIN.lon} `][Math.floor(r() * 3)];
      seqs.push([`seed ${seed}`, sequence(r, endLat, endLon)]);
    }
    for (const [label, seq] of seqs) {
      for (const [b, v] of seq) fireEvent.change(b === 'lat' ? latBox() : lonBox(), { target: { value: v } });
      fireEvent.click(noPhotoBtn());
      await waitFor(() => expect(container.textContent, label).toMatch(/Confirm the pin is at the drilling site/));
      await new Promise((res) => setTimeout(res, 60));
      expect(calls, `${label}: ${JSON.stringify(seq)}`).toHaveLength(0);
      expect(container.querySelector('.results-view'), label).toBeNull();
      const back = screen.queryByText('Back and try again'); if (back) fireEvent.click(back);
      // the pending pin and its confirm box are still there for the next sequence
      await waitFor(() => expect(screen.queryByRole('checkbox', { name: /I confirm this pin/ }), label).toBeTruthy());
    }
  });

  it('a sequence ending ELSEWHERE runs there, labelled as a manual entry; a later retype of the old pin is free (the run replaced it)', async () => {
    const { container } = await mount();
    await dashSearch();
    const seq = sequence(rng(99), '-0.9105', '37.1765');
    for (const [b, v] of seq) fireEvent.change(b === 'lat' ? latBox() : lonBox(), { target: { value: v } });
    expect(screen.queryByRole('checkbox', { name: /I confirm this pin/ })).toBeNull();
    fireEvent.click(noPhotoBtn());
    await waitFor(() => expect(container.querySelector('.results-view')).toBeTruthy());
    expect(calls).toEqual([{ loc: { latitude: -0.9105, longitude: 37.1765 } }]);
    expect(container.textContent).toMatch(/Manual Entry — Coordinates entered by user/);
    expect(container.textContent).not.toMatch(/Searched place, confirmed by the customer/);
  });

  it('results view: Find & Re-analyze leaves a pending pin; Backspace/retype and clear/retype + "Apply & Re-analyze" run nothing', async () => {
    const { container } = await mount();
    fireEvent.change(latBox(), { target: { value: '-1.2921' } });
    fireEvent.change(lonBox(), { target: { value: '36.8219' } });
    fireEvent.click(noPhotoBtn());
    await waitFor(() => expect(container.querySelector('.results-view')).toBeTruthy());
    expect(calls).toHaveLength(1);
    fireEvent.change(screen.getByPlaceholderText(/Esikangu Church of God/), { target: { value: 'Makuyu' } });
    fireEvent.click(screen.getAllByRole('button').find((b) => /Find & Re-analyze/.test(b.textContent || ''))!);
    await waitFor(() => expect(screen.getByRole('checkbox', { name: /I confirm this pin/ })).toBeTruthy());
    const rLat = () => screen.getByPlaceholderText(/^Latitude \(e\.g\. 0\.026677\)$/) as HTMLInputElement;
    const rLon = () => screen.getByPlaceholderText(/^Longitude \(e\.g\. 34\.647174\)$/) as HTMLInputElement;
    for (const seed of [7, 8, 9, 10]) {
      for (const [b, v] of sequence(rng(seed), PIN.lat, PIN.lon)) fireEvent.change(b === 'lat' ? rLat() : rLon(), { target: { value: v } });
      fireEvent.click(screen.getAllByRole('button').find((b) => /Apply & Re-analyze/.test(b.textContent || ''))!);
      await new Promise((res) => setTimeout(res, 400));
      expect(calls, `seed ${seed}`).toHaveLength(1);
    }
    fireEvent.change(rLat(), { target: { value: '-0.90058' } }); fireEvent.change(rLat(), { target: { value: '-0.900584' } });
    fireEvent.click(screen.getAllByRole('button').find((b) => /Apply & Re-analyze/.test(b.textContent || ''))!);
    await new Promise((res) => setTimeout(res, 400));
    expect(calls).toHaveLength(1);
    expect(container.textContent).toMatch(/Confirm the pin is at the drilling site/);
  });
});
