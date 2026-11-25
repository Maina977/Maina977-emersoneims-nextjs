/**
 * Safety hotfix 2026-11-25 (hotfix/aquascan-photo-gate, from production 03ea4c1d).
 *
 * Defects reproduced on the old code (03ea4c1d):
 *  A. "Compare Multiple Sites": cards printed the modelled depth and yield without the
 *     evidence gate; the ranking weighted them (computeSiteScore: 25 % yield, 10 % depth);
 *     the radar plotted them; the cost row priced them; the recommendation said "with an
 *     estimated yield of … m³/h at … m depth".
 *  B. A photo without GPS, with no coordinates or place typed, was analysed at a location
 *     guessed from its colours ('visual-estimate').
 *  C. The photo's pixels (vegetation, terrain, colours) fed the success probability and the
 *     soil result, even when coordinates were typed: the analysis received the photo.
 * Tests below show the old behaviour (OLD_*) and that the fix removes it.
 */
import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { siteScore, compareCardFigures, compareVerdictSentence, radarAxes, costRowAllowed } from '@/external/borehole-ai-engine/src/compareGate';
import { BoreholeAnalyzer } from '@/external/borehole-ai-engine/src/boreholeAnalyzer';
import type { AnalysisResult } from '@/external/borehole-ai-engine/src/types';

const engine = (f: string) => fs.readFileSync(path.join(process.cwd(), 'external', 'borehole-ai-engine', 'src', f), 'utf8');

// A comparison site: desktop analysis, no field evidence (as every compare-mode site).
const site = (yieldM3h: number, depthM: number, over: Partial<AnalysisResult> = {}) => ({
  probability: 0.6, estimatedYield: yieldM3h, recommendedDepth: depthM,
  risk: { overallRisk: 0.3, viability: 'moderate', categories: { geological: 0.3, financial: 0.3 } },
  confidenceMetrics: { overall: 55 }, siteEvidence: { depth: false, yield: false, methods: [] }, ...over,
}) as unknown as AnalysisResult;
const withEvidence = (r: AnalysisResult) => ({ ...r, siteEvidence: { depth: true, yield: true, methods: ['test'], citations: {} } }) as unknown as AnalysisResult;

// The production formula at 03ea4c1d (index.tsx computeSiteScore), kept here to show the defect.
function OLD_computeSiteScore(r: AnalysisResult) {
  const parts = [r.probability * 100 * 0.30, Math.min(r.estimatedYield / 5, 1) * 100 * 0.25, (1 - r.risk.overallRisk) * 100 * 0.20, (r.confidenceMetrics?.overall ?? 50) * 0.15, Math.max(0, 100 - r.recommendedDepth) * 0.10];
  return Math.min(100, parts.map(Math.round).reduce((a, b) => a + b, 0));
}

describe('A. Compare Multiple Sites: depth, yield and cost only through the evidence gate', () => {
  const a = site(1.2, 95), b = site(6.5, 40); // same desktop evidence, different model guesses
  it('OLD: the ranking was decided by the modelled yield and depth (B beat A by the guesses alone)', () => {
    expect(OLD_computeSiteScore(b)).toBeGreaterThan(OLD_computeSiteScore(a));
  });
  it('NEW: without field evidence, yield and depth do not count: equal evidence, equal score', () => {
    expect(siteScore(a).total).toBe(siteScore(b).total);
    expect(Object.keys(siteScore(a).breakdown)).toEqual(['Modelled Success Score', 'Low Risk', 'Data Confidence']);
  });
  it('NEW: with a field survey and pumping test, yield and depth count again (weights as before)', () => {
    expect(Object.keys(siteScore(withEvidence(a)).breakdown)).toEqual(['Modelled Success Score', 'Yield Potential', 'Low Risk', 'Data Confidence', 'Cost Efficiency']);
    expect(siteScore(withEvidence(b)).total).toBe(OLD_computeSiteScore(b));
  });
  it('cards: no depth or yield figure without evidence', () => {
    const c = compareCardFigures(b);
    expect(c.depth).not.toMatch(/40/);
    expect(c.yield).not.toMatch(/6\.5/);
    expect(c.depth).toMatch(/survey/i);
    expect(compareCardFigures(withEvidence(b))).toMatchObject({ depth: '40m', yield: '6.5 m³/h' });
  });
  it('recommendation: no yield or depth figure without evidence', () => {
    const v = compareVerdictSentence(b, 'Site 2', 60);
    expect(v).not.toMatch(/6\.5|\b40\s?m|m³\/h/);
    expect(v).toMatch(/Depth and yield need a geophysical survey and a pumping test/);
  });
  it('radar and cost row: no yield/depth axes, no cost row without evidence at every site', () => {
    expect(radarAxes([a, b]).labels).toEqual(['Success %', 'Low Risk', 'Confidence']);
    expect(radarAxes([withEvidence(a), withEvidence(b)]).labels).toEqual(['Success %', 'Yield', 'Low Risk', 'Confidence', 'Shallow Depth']);
    expect(costRowAllowed([a, b])).toBe(false);
  });
  it('source: the compare view uses the gate; the old ungated lines are gone', () => {
    const ui = engine('index.tsx');
    expect(ui).not.toMatch(/<span>Depth<\/span><span>\{site\.result\.recommendedDepth/);
    expect(ui).not.toMatch(/<span>Yield<\/span><span>\{site\.result\.estimatedYield/);
    expect(ui).not.toMatch(/with an estimated yield of \{best\.result!\.estimatedYield/);
    expect(ui).not.toMatch(/const axes = \['Success %', 'Yield', 'Low Risk', 'Confidence', 'Shallow Depth'\]/);
    expect(ui).toMatch(/\.\.\.\(costRowAllowed\(analyzed\.map\(s => s\.result!\)\) \? \[\{ label: 'Est\. Drilling Cost'/);
    expect(ui).toMatch(/return siteScore\(r\);/);
  });
});

describe('B. no analysis at a location guessed from a photo', () => {
  const run = async (locationMethod: string, gps: { latitude: number; longitude: number } | null) => {
    const an = new BoreholeAnalyzer();
    const stub = vi.fn(async () => ({ metadata: gps ? { gps } : {}, terrainType: 'valley', vegetationDensity: 0.9, vegetationScore: 0.9, waterProbability: 0.9, soilColor: 'red', rockExposure: false, waterBodies: true, classifications: [], pixelAnalysis: {}, isReliableTerrainImage: true, locationMethod, locationContext: {}, gpsSource: 'none', predictions: [] }));
    (an as unknown as { imageDetector: { analyzeImage: typeof stub } }).imageDetector.analyzeImage = stub;
    return an.analyzeImage(new File([new Uint8Array([1, 2, 3])], 'site.jpg', { type: 'image/jpeg' }));
  };
  it('OLD behaviour (03ea4c1d): the pipeline went on with a colour-guessed position; NOW refused with a reason', async () => {
    await expect(run('visual-estimate', { latitude: 0.5, longitude: 37.5 })).rejects.toThrow(/^Location problem: AquaScan needs the site’s coordinates/);
  });
  it('no position at all: refused', async () => {
    await expect(run('none', null)).rejects.toThrow(/Location problem/);
  });
  it('page: a photo with no camera GPS and nothing typed is refused before any analysis', () => {
    const ui = engine('index.tsx');
    const sel = ui.slice(ui.indexOf('const handleImageSelect = async'), ui.indexOf('const handleCompSiteUpload'));
    expect(sel).toMatch(/if \(!photoGps\) \{ setAnalysisError\(PHOTO_NEEDS_LOCATION\)/);
    const cmp = ui.slice(ui.indexOf('const handleCompSiteUpload'), ui.indexOf('const parseManualCoordinates'));
    expect(cmp).toMatch(/if \(!gps \|\| !ph\) \{/);
  });
});

describe('C. photo pixels never reach the groundwater analysis', () => {
  it('OLD (03ea4c1d): the analysis received the photo itself; NOW only the neutral placeholder', () => {
    const ui = engine('index.tsx');
    const sel = ui.slice(ui.indexOf('const handleImageSelect = async'), ui.indexOf('const handleCompSiteUpload'));
    expect(sel).not.toMatch(/await analyzer\.analyzeImage\(\s*primary,/);
    expect(sel).toMatch(/analysisFile = ph;/);
    expect(sel).toMatch(/await analyzer\.analyzeImage\(\s*analysisFile,/);
    const cmp = ui.slice(ui.indexOf('const handleCompSiteUpload'), ui.indexOf('const parseManualCoordinates'));
    expect(cmp).not.toMatch(/analyzer\.analyzeImage\(file\)/);
    expect(cmp).toMatch(/analyzer\.analyzeImage\(ph, undefined, \{ latitude: gps\.lat, longitude: gps\.lon \}\)/);
    const re = ui.slice(ui.indexOf('Safety hotfix 2026-11-25: always the placeholder'));
    expect(re.slice(0, 600)).toMatch(/let file: File \| undefined;/);
  });
  it('the placeholder is the one the analyser treats as "no photo" (its pixels do not vote)', () => {
    expect(engine('index.tsx')).toMatch(/return blob \? new File\(\[blob\], NO_PHOTO_NAME/);
    expect(engine('boreholeAnalyzer.ts')).toMatch(/const noPhoto = imageFile\?\.name === '__aquascan-no-photo__\.jpg';/);
  });
  it('same coordinates, two different photos: the analyser receives identical input (the placeholder) both times', async () => {
    // The page code path: both uploads become the same placeholder file name and bytes.
    const ui = engine('index.tsx');
    const ph = ui.slice(ui.indexOf('async function placeholderPhoto'), ui.indexOf('async function exifGpsOf'));
    expect(ph).toMatch(/ctx\.fillStyle = '#808080'; ctx\.fillRect\(0, 0, 64, 64\)/);
    expect(ph).not.toMatch(/drawImage/);
  });
});
