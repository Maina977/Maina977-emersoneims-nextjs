// @vitest-environment jsdom
/**
 * Safety hotfix (review of f736e0b0, 2026-11-25): the REAL AquaScan page component, engine mocked
 * (records exactly what reaches analyzer.analyzeImage, then throws so no network is used).
 * Adapted from the reviewer's scratch page-flow test; asserts the REQUIRED behaviour:
 *  B2  a country / town name alone is never analysed; a place search must give a village or locality;
 *  M1  the refusal is shown as the real reason, not as a network failure;
 *  m6  a valid camera GPS is used even when a typed place name would not be accepted (with a note);
 *  (c) photo + coordinates sends exactly the same input as a coordinates-only run.
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, waitFor, screen, cleanup, configure } from '@testing-library/react';

// The full page component mounts slowly when the whole AquaScan suite runs in parallel.
vi.setConfig({ testTimeout: 90000 });
configure({ asyncUtilTimeout: 20000 });

const calls: Array<{ file: File; bytes: string; loc: any; field: any }> = [];
const GPS: Record<string, { latitude: number; longitude: number } | null> = {};

vi.mock('exifr', () => ({ default: { gps: async (f: File) => GPS[f.name] ?? null } }));
vi.mock('@/external/borehole-ai-engine/src/boreholeAnalyzer', () => ({
  BoreholeAnalyzer: class {
    async initialize() {}
    async reverseGeocode() { return { source: 'none' }; }
    async analyzeImage(file: File, _p: unknown, loc: unknown, field: unknown) {
      const ab: ArrayBuffer = await new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result as ArrayBuffer); fr.onerror = rej; fr.readAsArrayBuffer(file); });
      calls.push({ file, bytes: Array.from(new Uint8Array(ab)).join(','), loc: loc ? JSON.parse(JSON.stringify(loc)) : loc, field });
      throw new Error('Location problem: TEST-STOP (mock engine)');
    }
  },
}));

beforeAll(() => {
  (HTMLCanvasElement.prototype as any).getContext = function () {
    return { fillStyle: '', fillRect() {}, drawImage() {}, clearRect() {}, beginPath() {}, moveTo() {}, lineTo() {}, stroke() {}, fill() {}, arc() {}, closePath() {}, fillText() {}, measureText: () => ({ width: 0 }) };
  };
  (HTMLCanvasElement.prototype as any).toBlob = function (cb: (b: Blob) => void) { cb(new Blob([new Uint8Array([0xff, 0xd8, 0x80, 0x80, 0xff, 0xd9])], { type: 'image/jpeg' })); };
  (HTMLCanvasElement.prototype as any).toDataURL = () => 'data:image/jpeg;base64,AA==';
  (URL as any).createObjectURL = () => 'blob:test';
  (URL as any).revokeObjectURL = () => {};
  (window as any).scrollTo = () => {};
  (Element.prototype as any).scrollIntoView = () => {};
});
beforeEach(() => { calls.length = 0; for (const k of Object.keys(GPS)) delete GPS[k]; });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

async function mount() {
  const App = (await import('@/external/borehole-ai-engine/src/index')).default;
  const r = render(<App />);
  await waitFor(() => expect(r.container.querySelector('input[type="file"][accept="image/*"][multiple]')).toBeTruthy());
  await new Promise((res) => setTimeout(res, 20));
  return r;
}
const photo = (name: string, bytes: number[]) => new File([new Uint8Array(bytes)], name, { type: 'image/jpeg' });
const upload = (c: HTMLElement, files: File[]) => fireEvent.change(c.querySelector('input[type="file"][accept="image/*"][multiple]') as HTMLInputElement, { target: { files } });
const typeCoords = (lat: string, lon: string) => {
  fireEvent.change(screen.getByPlaceholderText(/^Latitude \(e\.g\. 0\.026677\) — or paste both/), { target: { value: lat } });
  fireEvent.change(screen.getByPlaceholderText(/^Longitude \(e\.g\. 34\.647174\)/), { target: { value: lon } });
};

describe('location: site-specific only (review B2, M1, m6)', () => {
  it('photo without GPS, nothing typed: refused before the engine, and the REAL reason is shown (not a network failure)', async () => {
    const { container } = await mount();
    upload(container, [photo('noexif.jpg', [1, 2, 3])]);
    await waitFor(() => expect(container.textContent).toMatch(/could not finish/));
    expect(calls).toHaveLength(0);
    const visible = container.querySelector('.analyzing-view')!.querySelector('p')!.textContent!;
    expect(visible).toMatch(/^Location problem: AquaScan needs a site-specific location/);
    expect(visible).not.toMatch(/public data services did not answer/);
  });

  it('only "Kenya" typed in the place-name form + photo without GPS: refused, no engine call (was: analysed at the country centre)', async () => {
    const { container } = await mount();
    fireEvent.change(screen.getByPlaceholderText('e.g. Kenya'), { target: { value: 'Kenya' } });
    upload(container, [photo('noexif.jpg', [1, 2, 3])]);
    await waitFor(() => expect(container.textContent).toMatch(/could not finish/));
    expect(calls).toHaveLength(0);
    expect(container.textContent).toMatch(/A country, county or town name alone is not analysed/);
  });

  it('"Kenya" typed + a photo WITH camera GPS: the camera GPS is used (was: GPS ignored, run refused)', async () => {
    const { container } = await mount();
    fireEvent.change(screen.getByPlaceholderText('e.g. Kenya'), { target: { value: 'Kenya' } });
    GPS['cam.jpg'] = { latitude: -0.9026, longitude: 37.1875 };
    upload(container, [photo('cam.jpg', [5, 5, 5])]);
    await waitFor(() => expect(calls).toHaveLength(1));
    expect(calls[0].file.name).toBe('__aquascan-no-photo__.jpg');
    expect(calls[0].loc).toMatchObject({ latitude: -0.9026, longitude: 37.1875 });
  });

  it('place search: a country result is refused with the reason and pins nothing; a village result pins with its precision', async () => {
    await mount();
    const answers: unknown[] = [
      [{ lat: '0.5', lon: '37.9', display_name: 'Kenya', addresstype: 'country', boundingbox: ['-4.9', '5.0', '33.9', '41.9'] }],
      [{ lat: '0.0567', lon: '34.6912', display_name: 'Emabungo, Vihiga, Kenya', addresstype: 'village', boundingbox: ['0.0467', '0.0667', '34.6812', '34.7012'] }],
    ];
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(answers.shift()), { status: 200 })));
    const q = screen.getByPlaceholderText('Search place name — e.g. "Emabungo, Vihiga"');
    fireEvent.change(q, { target: { value: 'Kenya' } });
    fireEvent.keyDown(q, { key: 'Enter' });
    await waitFor(() => expect(document.body.textContent).toMatch(/"Kenya" is a country, not a site/), { timeout: 5000 });
    expect((screen.getByPlaceholderText(/^Latitude \(e\.g\. 0\.026677\)/) as HTMLInputElement).value).toBe('');
    fireEvent.change(q, { target: { value: 'Emabungo' } });
    fireEvent.keyDown(q, { key: 'Enter' });
    await waitFor(() => expect((screen.getByPlaceholderText(/^Latitude \(e\.g\. 0\.026677\)/) as HTMLInputElement).value).toBe('0.056700'), { timeout: 5000 });
    expect(document.body.textContent).toMatch(/Pinned at the centre of Emabungo, Vihiga, Kenya \(village\)/);
    // review R2/R7: the pin note is information (role=status), not the red error box
    expect(screen.getAllByRole('status').some((el) => /Pinned at the centre of Emabungo/.test(el.textContent || ''))).toBe(true);
  });

  it('an approximate pin must be confirmed before the run; after confirming, the engine gets the pin (review R2)', async () => {
    const { container } = await mount();
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify([{ lat: '-0.9005840', lon: '37.1865230', class: 'place', type: 'village', addresstype: 'village', display_name: 'Makuyu, Makuyu ward, Murang`a South, Murang`a, Kenya', boundingbox: ['-0.9205840', '-0.8805840', '37.1665230', '37.2065230'] }]), { status: 200 })));
    const q = screen.getByPlaceholderText('Search place name — e.g. "Emabungo, Vihiga"');
    fireEvent.change(q, { target: { value: 'Makuyu' } });
    fireEvent.keyDown(q, { key: 'Enter' });
    await waitFor(() => expect((screen.getByPlaceholderText(/^Latitude \(e\.g\. 0\.026677\)/) as HTMLInputElement).value).toBe('-0.900584'));
    vi.unstubAllGlobals();
    GPS['noexif.jpg'] = null;
    upload(container, [photo('noexif.jpg', [1, 2, 3])]);
    await waitFor(() => expect(container.textContent).toMatch(/Confirm the pin is at the drilling site/));
    expect(calls).toHaveLength(0);
    await waitFor(() => screen.getByText('Back and try again')); fireEvent.click(screen.getByText('Back and try again'));
    fireEvent.click(screen.getByLabelText(/I confirm this pin is at the drilling site/));
    upload(container, [photo('noexif.jpg', [1, 2, 3])]);
    await waitFor(() => expect(calls).toHaveLength(1));
    expect(calls[0].loc).toMatchObject({ latitude: -0.900584, longitude: 37.186523 });
  });
});

describe('photos never reach the engine (c)', () => {
  it('photo + typed coordinates sends exactly the same input as a coordinates-only run', async () => {
    const { container } = await mount();
    typeCoords('-1.2921', '36.8219');
    upload(container, [photo('lush-green.jpg', [9, 9, 9, 9])]);
    await waitFor(() => expect(calls).toHaveLength(1));
    await waitFor(() => screen.getByText('Back and try again')); fireEvent.click(screen.getByText('Back and try again'));
    typeCoords('-1.2921', '36.8219');
    upload(container, [photo('dry-red.jpg', [7, 7])]);
    await waitFor(() => expect(calls).toHaveLength(2));
    await waitFor(() => screen.getByText('Back and try again')); fireEvent.click(screen.getByText('Back and try again'));
    typeCoords('-1.2921', '36.8219');
    fireEvent.click(screen.getAllByRole('button').find((b) => /Analyse these coordinates \(no photo\)/.test(b.textContent || ''))!);
    await waitFor(() => expect(calls).toHaveLength(3));
    const [a, b, c] = calls;
    for (const x of [a, b, c]) expect(x.file.name).toBe('__aquascan-no-photo__.jpg');
    expect(a.bytes).toBe(c.bytes); expect(b.bytes).toBe(c.bytes);
    expect(a.loc).toEqual(c.loc); expect(b.loc).toEqual(c.loc);
    expect(c.loc).toMatchObject({ latitude: -1.2921, longitude: 36.8219 });
  });
  it('no "Upload Video — Terrain Analysis" button (a video is not analysed)', async () => {
    const { container } = await mount();
    expect(container.textContent).not.toMatch(/Upload Video — Terrain Analysis/);
  });
});
