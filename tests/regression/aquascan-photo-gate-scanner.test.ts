/**
 * Safety hotfix (review of f736e0b0) B1 + m8: the "Photo Colour Check" (ai-scanner) tab analysed
 * the customer's real photo and showed a groundwater likelihood, "Est. Water Table 23 m", a depth
 * range, soil and subsurface layers from the photo's colours, with the ungated modelled depth.
 * Required: the tab is hidden, nothing on the page can run the scanner, and no photo pixel
 * analysis is reported (screen or PDF).
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const src = (f: string) => fs.readFileSync(path.join(process.cwd(), 'external', 'borehole-ai-engine', 'src', f), 'utf8');

describe('B1: photo colour check removed', () => {
  const ui = src('index.tsx');
  it('the ai-scanner tab is hidden', () => {
    const hidden = ui.match(/const HIDDEN_TABS = new Set\(\[([^\]]*)\]\)/)![1];
    expect(hidden).toMatch(/'ai-scanner'/);
  });
  it('the page cannot run the scanner on the photo and shows none of its figures', () => {
    expect(ui).not.toMatch(/runAIScanner\(/);
    expect(ui).not.toMatch(/img\.src=selectedImage;/);
    expect(ui).not.toMatch(/estimatedDepth_m: result\.recommendedDepth,/);
    expect(ui).not.toMatch(/scannerResult\.waterTableDepth_m/);
    expect(ui).not.toMatch(/scannerResult\.groundwaterSynthesis/);
    expect(ui).toMatch(/Photographs cannot show groundwater, soil, depth or geology/);
  });
});

describe('m8: no photo pixel analysis is reported', () => {
  it('the engine reports no pixel analysis, so the PDF "Image Pixel Analysis" section is skipped', () => {
    const eng = src('boreholeAnalyzer.ts');
    expect(eng).toMatch(/pixelAnalysis: undefined, \/\/ no photo pixel analysis is reported/);
    expect(eng).toMatch(/fractureAI, lineamentAnalysis, pixelAnalysis: undefined,/);
    expect(src('reportGenerator.ts')).toMatch(/if \(result\.pixelAnalysis\) \{\s*\n\s*addPage\(\);/);
  });
  it('the engine never lets pixels vote: every run is photo-free, the classifier is skipped', () => {
    const eng = src('boreholeAnalyzer.ts');
    expect(eng).toMatch(/const noPhoto = true;/);
    expect(eng).toMatch(/features = \{ \.\.\.features, \.\.\.NEUTRAL_PIXEL_FEATURES \};/);
    expect(eng).toMatch(/\{ skipModel: true \}\), 60000\)/);
  });
});

describe('management 2026-11-25 (1): the placeholder or a default is never described as the customer\'s photo', () => {
  it('no photo-colour location candidates are reported; the PDF module list says the pixel analysis was not run', () => {
    expect(src('boreholeAnalyzer.ts')).toMatch(/geoEstimate: features\.geoEstimate \? \{ \.\.\.features\.geoEstimate, estimates: \[\] \} : undefined,/);
    const rg = src('reportGenerator.ts');
    expect(rg).toMatch(/'Not run: photos are not analysed for groundwater; they are kept for the report only'/);
    expect(rg).toMatch(/\['3', 'Visual Geo-Estimation', result\.geoEstimate\?\.estimates\?\.length \? 'COMPLETED' : 'SKIPPED'/);
    // the PDF candidate table prints only when estimates exist
    expect(rg).toMatch(/if \(result\.geoEstimate && result\.geoEstimate\.estimates\?\.length > 0\) \{/);
  });
  it('the results page labels uploaded photos as kept for the report, never as analysed', () => {
    const ui = src('index.tsx');
    expect(ui).toMatch(/Kept for the report only: photos are not used for any groundwater figure\./);
    expect(ui).toMatch(/kept for the report; photos are not used for any groundwater figure/);
    expect(ui).not.toMatch(/primary photo analyzed in full/);
  });
});
