// @vitest-environment jsdom
/**
 * Re-review of 126efdbc, M-1 / 4e (2026-11-25): the screening exports (CSV/Excel rows, PDF, Word,
 * JSON) carry the location status and the water-body check in the screen's wording:
 * "Searched place, confirmed by the customer — centre of …" and "… — confirmed on land by the
 * customer" when the check needed the customer's confirmation, plus the photo-GPS conflict note.
 * Real engine, network down; the near-shore point is a recorded Kalokol borehole (Lake Turkana).
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { BoreholeAnalyzer } from '@/external/borehole-ai-engine/src/boreholeAnalyzer';
import { screeningRows, screeningContent } from '@/external/borehole-ai-engine/src/screeningReport';
import { jsonReportData } from '@/external/borehole-ai-engine/src/reportGenerator';
import { locationStatusText, waterCheckStatusText } from '@/external/borehole-ai-engine/src/locationStatus';

vi.setConfig({ testTimeout: 200000 });
const NEUTRAL = { metadata: {}, terrainType: 'unknown', vegetationDensity: 0.3, soilColor: 'brown', rockExposure: false, waterBodies: false, classifications: [], pixelAnalysis: {}, vegetationScore: 0.3, waterProbability: 0.3, isReliableTerrainImage: false, locationMethod: 'none', locationContext: {}, gpsSource: 'none', predictions: [] };
const src = (f: string) => fs.readFileSync(path.join(process.cwd(), 'external', 'borehole-ai-engine', 'src', f), 'utf8');

beforeAll(() => {
  const fail = async () => { throw new TypeError('network disabled (test)'); };
  (window as any).fetch = fail; (globalThis as any).fetch = fail;
});
async function run(lat: number, lon: number) {
  const an = new BoreholeAnalyzer();
  const det = (an as any).imageDetector;
  det.analyzeImage = vi.fn(async () => JSON.parse(JSON.stringify(NEUTRAL)));
  det.reverseGeocode = vi.fn(async () => ({ source: 'none' }));
  return an.analyzeImage(new File([new Uint8Array([1])], '__aquascan-no-photo__.jpg', { type: 'image/jpeg' }), undefined, { latitude: lat, longitude: lon }) as Promise<any>;
}
const flat = (rows: string[][]) => rows.map((r) => r.join(' | ')).join('\n');

describe('M-1: exports carry the location status and the water-body check', () => {
  it('confirmed searched pin + near-shore water check + photo-GPS conflict: rows and JSON say so', async () => {
    const r = await run(3.31944, 35.96444);
    expect(r.waterBodyCheckUnavailable).toBe(true);
    r.locationFromSearchedPin = 'Kalokol';
    r.photoGpsConflictNote = 'Photo GPS is 12 km from the confirmed site; the confirmed site was used.';
    const rows = flat(screeningRows(r));
    expect(rows).toMatch(/Location source \| Searched place, confirmed by the customer — centre of Kalokol/);
    expect(rows).toMatch(/Water-body check \| Water-body check inconclusive: the pin is within 0\.1 km of the mapped shore of Lake Turkana — confirmed on land by the customer/);
    expect(rows).toMatch(/Photo GPS \| Photo GPS is 12 km from the confirmed site; the confirmed site was used\./);
    const j: any = jsonReportData(r);
    expect(j.report.locationStatus).toBe('Searched place, confirmed by the customer — centre of Kalokol');
    expect(j.report.waterCheck).toMatch(/— confirmed on land by the customer$/);
    expect(j.report.photoGpsNote).toMatch(/^Photo GPS is 12 km/);
    expect(j.screening.locationStatus).toBe(j.report.locationStatus);
  });

  it('typed coordinates on land: manual entry, the offline check passed', async () => {
    const r = await run(-1.2921, 36.8219);
    r.gpsSource = 'manual';
    const c = screeningContent(r);
    expect(c.locationStatus).toBe('Manual entry — coordinates typed by the customer');
    expect(c.waterCheck).toMatch(/^Not on a mapped lake, reservoir or the sea/);
    expect(c.photoGpsNote).toBeNull();
    expect(flat(screeningRows(r))).not.toMatch(/Photo GPS \|/);
  });

  it('camera GPS wording matches the screen; PDF and Word print the same three lines; the full PDF too', () => {
    expect(locationStatusText({ locationFromPhotoGps: true })).toBe('Camera GPS — position read from the photo’s EXIF data');
    expect(waterCheckStatusText({ waterBodyCheckUnavailable: true })).toBe('Water-body check unavailable — confirmed on land by the customer');
    const s = src('screeningReport.ts');
    expect(s).toMatch(/`Location source: \$\{c\.locationStatus\}`, `Water-body check: \$\{c\.waterCheck\}`/);
    expect(s).toMatch(/p\(`Location source: \$\{c\.locationStatus\}`\),\n\s+p\(`Water-body check: \$\{c\.waterCheck\}`\)/);
    expect(src('reportGenerator.ts')).toMatch(/\['Coordinates', getCoords\(result\), `\$\{locationStatusText\(result\)\}\. Water-body check: \$\{waterCheckStatusText\(result\)\}/);
  });
});
