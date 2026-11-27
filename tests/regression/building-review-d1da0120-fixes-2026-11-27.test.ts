/**
 * Review of d1da0120 (BUILDING-d1da0120-REVIEW.md): N1-N5, D1-D2 must-fix;
 * A1, A4, A6, E1 and the build-up engine version. The reviewer's FINDING
 * tests (zz-review-building-d1da0120) are inverted here: each asserts the
 * finding is gone.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BUILDUP_ENGINE_VERSION } from '@/lib/qs/rateBuildUp';

const root = join(__dirname, '..', '..');
const html = readFileSync(join(root, 'public', 'eims-building-suite-v20261105.html'), 'utf8');
const calcSrc = readFileSync(join(root, 'lib', 'wizard-api', 'buildingCalcs.ts'), 'utf8');
const after = (anchor: string, n = 700) => { const i = html.indexOf(anchor); expect(i, anchor).toBeGreaterThan(-1); return html.slice(i, i + n); };

describe('inverted FINDING tests: the findings are gone', () => {
  it('D1: Describe mode no longer defaults storeys and units to 1, nor coordinates to Nairobi; blanks stop the request', () => {
    expect(html).not.toContain("num('dgStories', ext.stories || 1)");
    expect(html).not.toContain("num('dgUnits', ext.units || 1)");
    expect(html).toContain("num('dgStories', ext.stories ?? NaN)");
    expect(html).not.toContain('gps_lat: -1.29, gps_lng: 36.82');
    expect(after('dgState.params = params;', 300)).toMatch(/if\(wizStop\(\{area:params\.area, bedrooms:params\.bedrooms, stories:params\.stories, units:params\.units\}\)\)/);
  });
  it("D2: BIM quick build no longer hard-codes building_type 'BUNGALOW' or prefills 180 / 3 / 1", () => {
    expect(after('async function bimQuickBuild(', 1500)).not.toContain("building_type: 'BUNGALOW'");
    for (const id of ['bimQArea', 'bimQBeds', 'bimQStories']) expect(html).toContain(`id="${id}" value=""`);
  });
  it('N1: the daylight card labels its assumed glazing and gives no compliance verdict', () => {
    const card = after("arch += card('6.1 Daylight Study");
    expect(card).toMatch(/Illustrative, with ASSUMED glazing and surfaces/);
    expect(card).toContain('window area = floor area × 0.15, internal surfaces = floor area × 5');
    expect(html).not.toContain('✅ Compliant (BS 8206-2');
  });
  it('N2: the accessibility card no longer says "All measured items compliant"; its typical dimensions are labelled assumed', () => {
    expect(html).not.toContain('All measured items compliant');
    expect(after("arch += card('6.5 Accessibility Audit")).toMatch(/Illustrative check of ASSUMED typical dimensions .*not measured/);
  });
  it('N3: no "sprinklered:true" and no "Sprinklered: yes" as a fact', () => {
    expect(html).not.toContain('sprinklered:true');
    expect(html).not.toContain('Sprinklered: yes');
    expect(html).toContain('Sprinkler protection: not stated, so the unsprinklered (larger) egress widths are used');
  });
  it('N4: no hard-coded FX table and no "indicative CBK rate"; totals stay in their own currency', () => {
    expect(html).not.toMatch(/_fxToKES\s*=/);
    expect(html).not.toContain('indicative CBK rate');
    expect(html).toContain("(rcs.currency||p.currency||'KES')");
  });
  it('N5: the shadow study is not run at Nairobi; it uses the site coordinates, or is not run', () => {
    expect(html).not.toContain('lat:-1.286, lng:36.817');
    expect(html).not.toContain('6.6 Solar / Shadow Study (NOAA SPA, lat -1.29°)');
    const fnSrc = after('function repSiteCoords(', 300).split('\n')[0];
    const repSiteCoords = new Function(`${fnSrc}; return repSiteCoords;`)();
    expect([repSiteCoords(''), repSiteCoords('abc'), repSiteCoords('-1.286, 36.817'), repSiteCoords('95,10')]).toEqual([null, null, { lat: -1.286, lng: 36.817 }, null]);
  });
  it('E1: ASHRAE 62.1 and BRE Digest 309 say their edition is not stated; BS 8206-2:2008 is marked superseded', () => {
    const methods = [...calcSrc.matchAll(/method: ['"`]([^'"`]*)['"`]/g)].map((m) => m[1]);
    expect(methods.find((m) => m.startsWith('ASHRAE 62.1'))).toBe('ASHRAE 62.1 (edition not stated) Ventilation Rate Procedure, Eq. 6.2.2.1 and 6.2.2.2');
    expect(methods.find((m) => m.includes('BRE Digest 309'))).toMatch(/BRE Digest 309 \(edition not stated\).*BS 8206-2:2008 \(superseded 2022-01-31\)/);
  });
});

describe('A1, A4, A6 factual errors and the engine version', () => {
  it('A1: the wall U-value reference is the AD L 2021 limiting value 0.26 (notional 0.18); no unsourced tropical target; the build-up is labelled assumed', () => {
    const card = after("arch += card('6.2 Envelope Thermal Performance", 900);
    expect(card).toContain('limiting wall U-value 0.26 W/m²K (its notional dwelling uses 0.18)');
    expect(card).toMatch(/ASSUMED build-up/);
    expect(html).not.toContain('Part L1A 2021');
    expect(html).not.toContain('Tropical climate target');
  });
  it('A4: no "Kenya UBC seismic zones III–IV"', () => {
    expect(html).not.toMatch(/UBC seismic zones/);
  });
  it('A6: the Steel/Rebar screen shows no default bolt, utilisation, bars or links when the server returns none', () => {
    const conn = after('async function srConnection(', 1600);
    expect(conn).toMatch(/if\(!d\|\|d\.success===false\|\|!\(d\.connection\|\|d\.bolts\)\)\{el\.innerHTML=srNoResult\(d\);return;\}/);
    expect(conn).not.toMatch(/\|\|20\} Grade|\|\|'8\.8'|:'OK'\}/);
    const rebar = after('async function srDesignRebar(', 6000);
    expect(rebar).toMatch(/if\(!data\|\|data\.success===false\)\{el\.innerHTML=srNoResult\(data\);draw\.innerHTML='';return;\}/);
    expect(rebar).not.toMatch(/rec\.quantity\|\|4|rec\.diameter_mm\|\|16|spacing_mm\|\|200|diameter_mm\|\|8\b/);
    expect(rebar).toContain('No section drawing: the design did not return the bars and links.');
    // Run srNoResult on a 501 reply.
    const helper = after('function srNoResult(', 400).split('\n')[0];
    const srNoResult = new Function(`${helper}; return srNoResult;`)();
    expect(srNoResult({ success: false, message: 'This calculation is not available online yet.' })).toContain('This calculation is not available online yet. No figures are shown.');
  });
  it('the build-up engine version is bumped for the transport component', () => {
    expect(BUILDUP_ENGINE_VERSION).toBe('qs-buildup 1.2.0 (2026-11-27: transport component)');
  });
  it('both inline wizard scripts still parse', () => {
    const scripts = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
    expect(scripts.length).toBe(2);
    for (const s of scripts) expect(() => new Function(s)).not.toThrow();
  });
});
