// @vitest-environment jsdom
/**
 * AquaScan site-photo workflow (branch ws/aquascan-site-photos, 2026-11-25): the demo path
 * Location A → four photos → assessment → alternative requested → Location B → comparison →
 * PDF / Word / Excel report; refusal of a fifth photo; insufficient and misleading photos;
 * failure-safe vision; forbidden phrasings and figures; no data path into groundwater figures;
 * no POST to /api/contact. Every image is SYNTHETIC.
 */
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import JSZip from 'jszip';
import ExcelJS from 'exceljs';
import { render, screen, fireEvent, cleanup, waitFor, within } from '@testing-library/react';
import { SitePhotoWorkflow } from '@/external/borehole-ai-engine/src/SitePhotoWorkflow';
import { readExif, measurePixels, type RgbaImage } from '@/external/borehole-ai-engine/src/sitePhotoChecks';
import type { Decoder } from '@/external/borehole-ai-engine/src/sitePhotoBrowser';
import { addLocation, addPhoto, assess, comparison, newProperty, updateLocation, recordRevision, save, load, type Property, type KV } from '@/external/borehole-ai-engine/src/siteProperty';
import { emptyChecklist, FORBIDDEN_IN_PHOTO_OUTPUTS, GROUNDWATER_DISCLAIMER, VISION_HINTS_AFFECT_OUTCOME, assessLocation, type Checklist } from '@/external/borehole-ai-engine/src/siteConstraints';
import { buildSitePhotoReport, reportLines, sitePhotoPdf, sitePhotoDocx, sitePhotoXlsx, surveyEnquiryHref } from '@/external/borehole-ai-engine/src/sitePhotoReport';
import { runVisionSafely, featureStatements, DISABLED_PROVIDER, VISION_UNAVAILABLE, PROMOTED_CLASSES, evaluateClass, type VisionProvider } from '@/external/borehole-ai-engine/src/siteVision';
import { photoOnlyLocation, compareCardFigures, compareVerdictSentence, chanceText, PHOTO_ONLY_NO_CHANCE } from '@/external/borehole-ai-engine/src/photoOnlyGate';
import { screeningContent, screeningRows } from '@/external/borehole-ai-engine/src/screeningReport';
import { jsonReportData } from '@/external/borehole-ai-engine/src/reportGenerator';
import { governingSummary } from '@/external/borehole-ai-engine/src/governingSummary';
import type { AnalysisResult } from '@/external/borehole-ai-engine/src/types';
import { sharpImage, blurred, jpegWithExif, pngDataUrl } from './aquascan-site-photo-fixtures';

afterEach(cleanup);
// The UI flow and report generation are slow when the whole AquaScan suite runs.
vi.setConfig({ testTimeout: 60000 });
const NOW = new Date('2026-11-25T12:00:00Z');
const SITE = { latitude: 1.0157, longitude: 35.0062 };
const engine = (f: string) => fs.readFileSync(path.join(process.cwd(), 'external', 'borehole-ai-engine', 'src', f), 'utf8');

const goodChecklist = (over: Partial<Checklist> = {}): Checklist => ({
  ...emptyChecklist(), powerLines: { value: 'none' }, structures: { value: 'none' }, contaminationNoneSeen: true,
  slope: { value: 'flat' }, flooding: { value: 'none' }, access: { value: 'truck-to-spot' }, existingWells: { value: 'none' }, ...over,
});
const photo = (seed: number, gps = SITE, img: RgbaImage = sharpImage(1200, 900, seed)) => ({
  facts: { fileName: `syn-${seed}.jpg`, type: 'image/jpeg', bytes: 2_000_000, width: 4000, height: 3000, metrics: measurePixels(img), exif: readExif(jpegWithExif({ lat: gps.latitude + seed * 1e-5, lon: gps.longitude })) },
  dataUrl: pngDataUrl(16, 12, [40 * seed, 120, 60]),
});
function propertyAB(): Property {
  let p: Property = { ...addLocation(addLocation({ ...newProperty(), name: 'TEST Farm (synthetic)', county: 'Trans Nzoia', gps: SITE }, NOW), NOW) };
  const [A, B] = p.locations;
  for (const s of [1, 2, 3, 4]) { const r = addPhoto(p, A.id, photo(s), NOW); if (!r.ok) throw new Error(r.reason); p = r.property; }
  for (const s of [5, 6, 7]) { const r = addPhoto(p, B.id, photo(s), NOW); if (!r.ok) throw new Error(r.reason); p = r.property; }
  p = updateLocation(p, A.id, { description: 'beside the house', checklist: goodChecklist({ powerLines: { value: 'over-working-area', photo: 2 }, contaminationNoneSeen: false, contamination: [{ kind: 'pit-latrine', distanceM: 12, photo: 3 }] }) }, NOW);
  p = updateLocation(p, B.id, { description: 'lower field by the gate', checklist: goodChecklist() }, NOW);
  return recordRevision(recordRevision(p, A.id, NOW), B.id, NOW);
}

describe('model: Location A constrained → alternative requested → Location B → comparison', () => {
  const p = propertyAB();
  const [A, B] = p.locations;
  const a = assess(p, A).assessment, b = assess(p, B).assessment;
  it('A: OBSERVABLE CONSTRAINTS FOUND, each explained, distance requirement NOT VERIFIED, alternative requested', () => {
    expect(a.outcome).toBe('OBSERVABLE CONSTRAINTS FOUND');
    expect(a.findings.map((f) => f.id)).toEqual(['power-over', 'contamination-pit-latrine']);
    expect(a.findings[0].explanation).toMatch(/\(photo 2\)/);
    expect(a.findings[1].explanation).toMatch(/about 12 m away, as estimated by you \(photo 3\).*distance requirement per WRA guidance — NOT VERIFIED/);
    expect(a.requestAlternative).toMatch(/up to 4 photos of another possible location on the same property/);
  });
  it('B: NO BLOCKING CONSTRAINT OBSERVED, never "suitable"', () => {
    expect(b.outcome).toBe('NO BLOCKING CONSTRAINT OBSERVED');
    expect(b.reasons.join(' ')).toMatch(/says nothing about groundwater/);
  });
  it('comparison: B first, labelled observable-only, survey-candidate wording only', () => {
    const c = comparison(p);
    expect(c.order.map((x) => x.label)).toEqual(['Location B', 'Location A']);
    expect(c.summary).toBe('Location B is a better candidate for a field hydrogeological survey based on observable access and hazards.');
    expect(c.note).toContain('This is not a groundwater ranking.');
    expect(c.note).toContain(GROUNDWATER_DISCLAIMER);
  });
  it('history: one revision per assessment, with outcome and photos', () => {
    expect(A.history).toHaveLength(1);
    expect(A.history[0]).toMatchObject({ outcome: 'OBSERVABLE CONSTRAINTS FOUND', photos: ['syn-1.jpg', 'syn-2.jpg', 'syn-3.jpg', 'syn-4.jpg'] });
  });
  it('a fifth photo is refused with the reason', () => {
    const r = addPhoto(p, A.id, photo(9), NOW);
    expect(r.ok).toBe(false);
    expect(!r.ok && r.reason).toBe('Location A already has 4 photos (the maximum). Remove one first, or add photos to another location.');
  });
  it('an unfinished checklist cannot give NO BLOCKING CONSTRAINT', () => {
    const q = updateLocation(p, B.id, { checklist: { ...goodChecklist(), access: { value: '' } } }, NOW);
    const r = assess(q, q.locations[1]).assessment;
    expect(r.outcome).toBe('INSUFFICIENT PHOTO EVIDENCE');
    expect(r.reasons.join(' ')).toMatch(/Checklist not finished: Access route/);
  });
  it('browser storage: saved and restored; a full store keeps the record without the images', () => {
    const mem: Record<string, string> = {};
    const kv: KV = { getItem: (k) => mem[k] ?? null, setItem: (k, v) => { mem[k] = v; } };
    expect(save(p, kv).saved).toBe(true);
    expect(load(kv)!.locations[0].history).toHaveLength(1);
    let first = true;
    const full: KV = { getItem: () => null, setItem: (_k, v) => { if (first) { first = false; throw new Error('QuotaExceeded'); } mem.lite = v; } };
    const r = save(p, full);
    expect(r).toMatchObject({ saved: true, photosSaved: false });
    expect(JSON.parse(mem.lite).locations[0].photos[0].dataUrl).toBeNull();
  });
});

describe('insufficient and misleading photos → INSUFFICIENT PHOTO EVIDENCE (with the reason)', () => {
  const base = () => addLocation({ ...newProperty(), gps: SITE }, NOW);
  const withPhotos = (ps: ReturnType<typeof photo>[]) => { let p = base(); for (const x of ps) { const r = addPhoto(p, p.locations[0].id, x, NOW); if (r.ok) p = r.property; } p = updateLocation(p, p.locations[0].id, { checklist: goodChecklist() }, NOW); return assess(p, p.locations[0]).assessment; };
  it('four identical photos', () => { const a = withPhotos([photo(1), photo(1), photo(1), photo(1)]); expect(a.outcome).toBe('INSUFFICIENT PHOTO EVIDENCE'); expect(a.reasons.join(' ')).toMatch(/Duplicate photos/); });
  it('blurred photos say "too blurred to assess"', () => {
    const bl = (s: number) => photo(s, SITE, blurred(sharpImage(600, 450, s), 10));
    const a = withPhotos([bl(1), bl(2)]);
    expect(a.outcome).toBe('INSUFFICIENT PHOTO EVIDENCE');
    let p = base(); const r = addPhoto(p, p.locations[0].id, bl(1), NOW); p = (r as { property: Property }).property;
    expect(p.locations[0].photos[0].checks.find((c) => c.id === 'blur')!.note).toMatch(/^Photo too blurred to assess/);
  });
  it('photos without EXIF (screenshots) say so', () => {
    const noExif = (s: number) => ({ ...photo(s), facts: { ...photo(s).facts, type: 'image/png', exif: { gps: null, capturedAt: null, make: null, model: null } } });
    const a = withPhotos([noExif(1), noExif(2)]);
    expect(a.outcome).toBe('INSUFFICIENT PHOTO EVIDENCE');
    expect(a.reasons.join(' ')).toMatch(/No photo has camera metadata/);
  });
  it('a photo taken 5 km away', () => {
    const a = withPhotos([photo(1), photo(2, { latitude: SITE.latitude + 0.045, longitude: SITE.longitude })]);
    expect(a.outcome).toBe('INSUFFICIENT PHOTO EVIDENCE');
    expect(a.reasons.join(' ')).toMatch(/more than 1000 m from the location entered/);
  });
});

describe('automated visual review: failure-safe, hints only, three certainty levels', () => {
  const img = { image: sharpImage(64, 48, 1), usable: true };
  it('disabled (the shipped state): no hints, explicit status; every feature NOT ASSESSED', async () => {
    const r = await runVisionSafely(DISABLED_PROVIDER, [img]);
    expect(r.hints).toEqual([]);
    expect(r.status).toMatch(/^Automated visual review not enabled/);
    expect(featureStatements([]).every((s) => s.certainty === 'NOT ASSESSED')).toBe(true);
    expect(PROMOTED_CLASSES).toEqual([]);
  });
  it('a model that fails to load or times out: "Automated photo review unavailable — checklist only"', async () => {
    const failing: VisionProvider = { id: 'test-model', licence: 'test', enabled: true, detect: async () => { throw new Error('model failed to load'); } };
    expect((await runVisionSafely(failing, [img])).status).toBe(`${VISION_UNAVAILABLE} (model failed to load)`);
    const slow: VisionProvider = { id: 'slow', licence: 'test', enabled: true, detect: () => new Promise(() => {}) };
    const r = await runVisionSafely(slow, [img], 20);
    expect(r).toEqual({ hints: [], status: `${VISION_UNAVAILABLE} (the model did not answer within 0.02 s)` });
  });
  it('a detection is only POSSIBLE, never changes the outcome, and a generic "building" never becomes a septic tank', async () => {
    const fake: VisionProvider = { id: 'fake', licence: 'test', enabled: true, detect: async (_i, n) => [{ photo: n, label: 'building', score: 0.9 }, { photo: n, label: 'utility pole', score: 0.95 }] };
    const r = await runVisionSafely(fake, [img, { image: img.image, usable: false }]);
    expect(r.hints.map((h) => h.photo)).toEqual([1, 1]); // the unusable photo was not sent
    const st = featureStatements(r.hints);
    expect(st.find((s) => s.feature === 'buildings or structures')).toMatchObject({ certainty: 'POSSIBLE', text: 'Possible buildings or structures in photo 1 — please confirm in the checklist.' });
    expect(st.find((s) => s.feature === 'septic tank')!.certainty).toBe('NOT ASSESSED');
    expect(st.find((s) => s.feature === 'pit latrine')!.certainty).toBe('NOT ASSESSED');
    expect(VISION_HINTS_AFFECT_OUTCOME).toBe(false);
    const p = propertyAB();
    const set = assess(p, p.locations[1]).set;
    expect(assessLocation(set, p.locations[1].checklist, r.hints).outcome).toBe(assessLocation(set, p.locations[1].checklist, []).outcome);
  });
  it('VALIDATED DETECTION only for a promoted class; promotion needs the documented threshold on ≥ 30 positives', () => {
    const hints = [{ photo: 2, label: 'utility pole or power line', source: 'x' }];
    expect(featureStatements(hints, ['overhead power lines or poles'])[0].certainty).toBe('VALIDATED DETECTION');
    const set = Array.from({ length: 40 }, (_, i) => ({ id: String(i), source: 's', licence: 'CC0', attribution: '-', truth: i < 30 ? ['pole'] : [] }));
    expect(evaluateClass('pole', set, set.map((s) => ({ id: s.id, predicted: s.truth }))).meetsThreshold).toBe(true);
    expect(evaluateClass('pole', set.slice(0, 20), set.slice(0, 20).map((s) => ({ id: s.id, predicted: s.truth }))).meetsThreshold).toBe(false);
  });
});

type Pdfjs = typeof import('pdfjs-dist/legacy/build/pdf.mjs');
let pdfjs: Pdfjs;
beforeAll(async () => {
  pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')).href;
});

describe('report: PDF, Word, Excel carry the screen text and the photos', () => {
  const p = propertyAB();
  const rep = buildSitePhotoReport(p, NOW);
  const lines = reportLines(rep);
  const keep = (n: string, b: Uint8Array) => { const d = process.env.AQUASCAN_EXPORT_DIR; if (d) { fs.mkdirSync(d, { recursive: true }); fs.writeFileSync(path.join(d, n), b); } };
  const KEY = ['OBSERVABLE CONSTRAINTS FOUND', 'NO BLOCKING CONSTRAINT OBSERVED', 'Location B is a better candidate for a field hydrogeological survey based on observable access and hazards.', 'This is not a groundwater ranking.', 'NOT VERIFIED', 'Automated visual review'];
  const squash = (s: string) => s.replace(/\s+/g, '');
  it('content: disclaimer, referral, privacy, every key statement; no forbidden phrasing or figure', () => {
    const all = lines.join('\n');
    expect(rep.banner).toBe(GROUNDWATER_DISCLAIMER);
    for (const k of KEY) expect(all).toContain(k);
    for (const re of FORBIDDEN_IN_PHOTO_OUTPUTS) expect(all).not.toMatch(re);
  });
  it('PDF (pdfjs): same statements; photos embedded', async () => {
    const b = sitePhotoPdf(rep); keep('AquaScan_site_photos.pdf', b);
    const doc = await pdfjs.getDocument({ data: b.slice() }).promise;
    let t = ''; for (let i = 1; i <= doc.numPages; i++) t += (await (await doc.getPage(i)).getTextContent()).items.map((x) => ('str' in x ? x.str : '')).join(' ') + ' ';
    for (const k of KEY) expect(squash(t)).toContain(squash(k.replace(/—/g, '-')));
    expect(squash(t)).toContain(squash(GROUNDWATER_DISCLAIMER));
    expect(squash(t)).toContain(squash('Location A, photo 4'));
    expect(Buffer.from(b).toString('latin1')).toMatch(/\/Subtype\s*\/Image/);
    for (const re of FORBIDDEN_IN_PHOTO_OUTPUTS) expect(t).not.toMatch(re);
  });
  it('Word (JSZip): same statements; 7 images embedded', async () => {
    const b = await sitePhotoDocx(rep); keep('AquaScan_site_photos.docx', b);
    const zip = await JSZip.loadAsync(b);
    const xml = (await zip.file('word/document.xml')!.async('string')).replace(/<[^>]+>/g, '').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
    for (const k of [...KEY, GROUNDWATER_DISCLAIMER]) expect(xml).toContain(k);
    expect(Object.keys(zip.files).filter((f) => f.startsWith('word/media/') && !f.endsWith('/'))).toHaveLength(7);
  });
  it('Excel (ExcelJS): same statements; images on the location sheets', async () => {
    const b = await sitePhotoXlsx(rep); keep('AquaScan_site_photos.xlsx', b);
    const wb = new ExcelJS.Workbook(); await wb.xlsx.load(b as unknown as ArrayBuffer);
    const cells: string[] = []; wb.eachSheet((ws) => ws.eachRow((r) => (r.values as unknown[]).forEach((v) => cells.push(String(v ?? '')))));
    const all = cells.join('\n');
    for (const k of [...KEY, GROUNDWATER_DISCLAIMER]) expect(all).toContain(k);
    expect(wb.worksheets.map((w) => w.name)).toEqual(['Comparison', 'Location A', 'Location B']);
    expect(wb.getWorksheet('Location A')!.getImages()).toHaveLength(4);
  });
  it('survey request: the contact page, pre-filled, nothing posted', () => {
    const href = surveyEnquiryHref(p);
    expect(href.startsWith('/contact?type=survey&detail=')).toBe(true);
    expect(decodeURIComponent(href)).toMatch(/Location A \(beside the house\): OBSERVABLE CONSTRAINTS FOUND/);
  });
});

describe('screen: the demo flow in the real component (injected decoder, no canvas)', () => {
  const pixels: Record<string, RgbaImage> = {};
  const decoder: Decoder = async (f) => ({ width: 4000, height: 3000, pixels: pixels[f.name], dataUrl: pngDataUrl() });
  const file = (name: string, seed: number, img?: RgbaImage) => { pixels[name] = img ?? sharpImage(1200, 900, seed); return new File([jpegWithExif({ lat: SITE.latitude, lon: SITE.longitude }) as BlobPart], name, { type: 'image/jpeg' }); };
  const choose = (label: RegExp, value: string, nth = 0) => fireEvent.change(screen.getAllByLabelText(label)[nth], { target: { value } });

  it('A: four photos, constraints, alternative requested → B → comparison; fifth photo refused; nothing posted', async () => {
    const fetchSpy = vi.fn(async () => new Response('{}'));
    const origFetch = globalThis.fetch;
    globalThis.fetch = fetchSpy as unknown as typeof fetch;
    const mem: Record<string, string> = {};
    render(<SitePhotoWorkflow decode={decoder} storage={{ getItem: (k) => mem[k] ?? null, setItem: (k, v) => { mem[k] = v; } }} now={() => NOW} />);
    expect(screen.getByRole('note').textContent).toBe(GROUNDWATER_DISCLAIMER);
    expect(document.body.textContent).toMatch(/Your photos stay in this browser/);
    const input = () => screen.getByLabelText(/^Location A photos/) as HTMLInputElement;
    fireEvent.change(input(), { target: { files: [file('a1.jpg', 1), file('a2.jpg', 2), file('a3.jpg', 3), file('a4.jpg', 4), file('a5.jpg', 5)] } });
    await waitFor(() => expect(screen.getByLabelText(/^Location A photos \(4 of 4\)/)).toBeTruthy());
    expect(screen.getByRole('alert').textContent).toMatch(/a5\.jpg not added: Location A already has 4 photos/);
    choose(/^Location A Overhead power lines(?! photo)/, 'over-working-area');
    choose(/^Location A Overhead power lines photo$/, '2');
    choose(/^Location A Buildings or structures/, 'none');
    choose(/^Location A Ground slope(?! photo)/, 'flat');
    choose(/^Location A Signs of flooding/, 'none');
    choose(/^Location A Access route/, 'truck-to-spot');
    choose(/^Location A Existing boreholes/, 'none');
    fireEvent.click(screen.getByLabelText(/^Location A: none seen/));
    fireEvent.click(screen.getByText('Assess Location A'));
    const aBox = screen.getByTestId('Location A-assessment');
    expect(aBox.textContent).toMatch(/OBSERVABLE CONSTRAINTS FOUND/);
    expect(aBox.textContent).toMatch(/Overhead power line at the drilling spot.*\(photo 2\)/);
    expect(aBox.textContent).toMatch(/Please add up to 4 photos of another possible location on the same property/);
    expect(aBox.textContent).toMatch(/Automated visual review: NOT ASSESSED/);
    fireEvent.click(within(aBox).getByText('Add another location'));

    const inputB = screen.getByLabelText(/^Location B photos/) as HTMLInputElement;
    fireEvent.change(inputB, { target: { files: [file('b1.jpg', 6), file('b2.jpg', 7)] } });
    await waitFor(() => expect(screen.getByLabelText(/^Location B photos \(2 of 4\)/)).toBeTruthy());
    for (const [re, v] of [[/^Location B Overhead power lines(?! photo)/, 'none'], [/^Location B Buildings or structures/, 'none'], [/^Location B Ground slope(?! photo)/, 'gentle'], [/^Location B Signs of flooding/, 'none'], [/^Location B Access route/, 'truck-to-spot'], [/^Location B Existing boreholes/, 'none']] as const) choose(re, v);
    fireEvent.click(screen.getByLabelText(/^Location B: none seen/));
    fireEvent.click(screen.getByText('Assess Location B'));
    expect(screen.getByTestId('Location B-assessment').textContent).toMatch(/NO BLOCKING CONSTRAINT OBSERVED/);
    const cmp = screen.getByTestId('site-photo-comparison').textContent ?? '';
    expect(cmp).toMatch(/Location B is a better candidate for a field hydrogeological survey based on observable access and hazards\./);
    expect(cmp).toMatch(/This is not a groundwater ranking\./);
    const page = document.body.textContent ?? '';
    for (const re of FORBIDDEN_IN_PHOTO_OUTPUTS) expect(page).not.toMatch(re);
    expect(screen.getByText('Request an EmersonEIMS hydrogeological survey').getAttribute('href')).toMatch(/^\/contact\?type=survey&detail=/);
    expect(JSON.parse(mem['aquascan.sitePhotos.v1']).locations[0].history).toHaveLength(1);
    const posts = (fetchSpy.mock.calls as unknown[][]).filter((c) => /\/api\/contact/.test(String(c[0])));
    expect(posts).toHaveLength(0);
    globalThis.fetch = origFetch;
  });
});

describe('no data path from photos into groundwater figures', () => {
  it('the photo modules import nothing from the groundwater analysis, and the analysis imports none of them', () => {
    const photoMods = ['sitePhotoChecks.ts', 'siteConstraints.ts', 'siteProperty.ts', 'sitePhotoReport.ts', 'siteVision.ts', 'sitePhotoBrowser.ts', 'SitePhotoWorkflow.tsx'];
    const banned = /from '\.\/(boreholeAnalyzer|imageDetector|aiScanner|geoEstimator|siteLocator|evidenceGate|governingSummary|reportGenerator|pumpTestAnalyzer|pumpTestTimeSeries|types)'/;
    for (const m of photoMods) expect(engine(m)).not.toMatch(banned);
    for (const g of ['boreholeAnalyzer.ts', 'reportGenerator.ts', 'governingSummary.ts', 'evidenceGate.ts', 'screeningReport.ts', 'pumpTestAnalyzer.ts', 'pumpTestTimeSeries.ts']) {
      expect(engine(g)).not.toMatch(/sitePhotoChecks|siteConstraints|siteProperty|sitePhotoReport|siteVision|SitePhotoWorkflow/);
    }
  });
  it('legacy photo upload and compare mode: the groundwater analysis always receives the neutral placeholder, never the photo', () => {
    const ui = engine('index.tsx');
    const sel = ui.slice(ui.indexOf('const handleImageSelect = async'), ui.indexOf('const handleCompSiteUpload'));
    expect(sel).toMatch(/analysisFile = ph;/);
    expect(sel).toMatch(/await analyzer\.analyzeImage\(\s*analysisFile,/);
    expect(sel).not.toMatch(/await analyzer\.analyzeImage\(\s*primary,/);
    expect(sel).toMatch(/if \(!photoGps\) \{ setAnalysisError\(PHOTO_NEEDS_LOCATION\)/);
    const cmp = ui.slice(ui.indexOf('const handleCompSiteUpload'), ui.indexOf('const parseManualCoordinates'));
    expect(cmp).toMatch(/analyzer\.analyzeImage\(ph, undefined, \{ latitude: gps\.lat, longitude: gps\.lon \}\)/);
    expect(cmp).not.toMatch(/analyzer\.analyzeImage\(file\)/);
    const re = ui.slice(ui.indexOf('Safety hotfix 2026-11-25: always the placeholder'));
    expect(re.slice(0, 1200)).toMatch(/let file: File \| undefined;/);
  });
  it('the same analysis result gives identical groundwater outputs with and without site-photo records stored', () => {
    const r = { site: { latitude: SITE.latitude, longitude: SITE.longitude }, locationMethod: 'manual-entry', probability: 0.62, recommendedDepth: 80, estimatedYield: 3, siteEvidence: { depth: false, yield: false, methods: [] }, dataSources: ['TEST'] } as unknown as AnalysisResult;
    const snap = () => JSON.stringify({ s: screeningContent(r, NOW), rows: screeningRows(r, NOW), j: { ...jsonReportData(r), report: null } });
    const before = snap();
    const mem: Record<string, string> = {};
    save(propertyAB(), { getItem: (k) => mem[k] ?? null, setItem: (k, v) => { mem[k] = v; } });
    try { window.localStorage.setItem('aquascan.sitePhotos.v1', mem['aquascan.sitePhotos.v1']); } catch { /* jsdom */ }
    expect(snap()).toBe(before);
    window.localStorage.removeItem('aquascan.sitePhotos.v1');
  });
});

describe('photo-only analyses (location guessed from the photo) never show depth, yield or a chance of success', () => {
  const photoOnly = { locationMethod: 'visual-estimate', probability: 0.81, recommendedDepth: 65, estimatedYield: 4.2, siteEvidence: { depth: false, yield: false, methods: [] }, site: {}, risk: { overallRisk: 0.3, viability: 'moderate' } } as unknown as AnalysisResult;
  it('compare-mode card and recommendation sentence', () => {
    expect(photoOnlyLocation(photoOnly)).toBe(true);
    const c = compareCardFigures(photoOnly);
    expect(c.chance).toBe(PHOTO_ONLY_NO_CHANCE);
    expect(c.depth).not.toMatch(/65/);
    expect(c.yield).not.toMatch(/4\.2/);
    const v = compareVerdictSentence(photoOnly, 'Site A', 71);
    expect(v).not.toMatch(/65|4\.2|in 10|chance/i);
    expect(chanceText({ ...photoOnly, locationMethod: 'manual-entry' } as AnalysisResult)).toBe('about 8 in 10');
  });
  it('screening and JSON exports of a photo-only result carry no depth, yield or probability', () => {
    const txt = JSON.stringify({ s: screeningContent(photoOnly, NOW), rows: screeningRows(photoOnly, NOW), j: jsonReportData(photoOnly) });
    expect(txt).not.toMatch(/\b65\s?m\b|4\.2\s?m|0\.81|8 in 10/);
  });
  it('source: the dashboard compare cards, recommendation and summary use the gate', () => {
    const ui = engine('index.tsx');
    expect(ui).toMatch(/<span>Depth<\/span><span>\{compareCardFigures\(site\.result\)\.depth\}/);
    expect(ui).toMatch(/\{compareVerdictSentence\(best\.result!, best\.name, scored\[0\]\.score\.total\)\}/);
    expect(ui).toMatch(/<div className="summary-value">\{chanceText\(result\)\}<\/div>/);
    expect(ui).not.toMatch(/with an estimated yield of \{best\.result!\.estimatedYield/);
    void governingSummary;
  });
});
