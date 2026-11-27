/**
 * Review of 63d3c0bc (BUILDING-63d3c0bc-REVIEW.md), not cleared on R1-R3 in
 * the offline Reports / Costing mode, plus the silent defaults it listed in the
 * other wizard modes (Drawings, BIM/IFC, Describe, save payload, render prompt).
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const html = readFileSync(join(__dirname, '..', '..', 'public', 'eims-building-suite-v20261105.html'), 'utf8');

describe('R1-R3: no invented source, no unlabelled assumed geometry', () => {
  it('R1: no "KQS 2025" price benchmark; the cost section asks for a quotation', () => {
    expect(html).not.toMatch(/KQS[ -]?2025\)?:?\s*KES/);
    expect(html).not.toMatch(/KES 35,000\\u201355,000|KES 55,000\\u201380,000/);
    expect(html).toContain('No cost-per-m\\u00b2 benchmark is given');
  });
  it('R2: the reset prompt claims no source', () => {
    expect(html).not.toMatch(/KQS-2025 values/);
    expect(html).toContain('Remove all your rate overrides?');
  });
  it('R3: the acoustics result is labelled as an assumed room, with every assumption stated', () => {
    const i = html.indexOf("arch += card('6.3 Room Acoustics");
    const card = html.slice(i, html.indexOf('// 6.4 Egress', i));
    expect(card).toMatch(/Illustrative, with ASSUMED room geometry and finishes/);
    for (const s of ['floor area × 3 m', 'walls = floor area × 2', 'glazing = floor area × 0.15', 'soft furnishings = floor area × 0.5']) expect(card).toContain(s);
    expect(card).not.toMatch(/Reverberation Time RT<sub>60<\/sub>: <strong>/);
  });
});

describe('no silent defaults in Drawings, BIM/IFC, Describe, save payload or the render prompt', () => {
  it('no numeric fallback on a wizard input (450 m², 3 units, 3 bedrooms, 2 storeys, lat/lon 0, 5.2 m water table …)', () => {
    const gvDefaults = [...html.matchAll(/\+\(?gv\('([A-Za-z0-9_]+)'\)\)?\s*\|\|\s*[0-9]/g)].map((m) => m[0]);
    // The one left is the online Floor Plan editor's number of floor tabs (a view, not an engineering input).
    expect(gvDefaults).toEqual(["+(gv('p2_stories'))||2"]);
    expect(html).not.toMatch(/\+D\.[A-Za-z0-9_]+\s*\|\|\s*[0-9]/);
    expect(html).not.toMatch(/\+document\.getElementById\('bimQ[A-Za-z]+'\)\.value\s*\|\|\s*[0-9]/);
  });
  it('no hard-coded foundation type, Describe location / type / area / bedrooms, or render-prompt defaults', () => {
    expect(html).not.toContain("foundation_type:'strip'");
    expect(html).not.toContain(": 'Nairobi, Kenya',");
    expect(html).not.toContain("ext.building_type || 'BUNGALOW'");
    expect(html).not.toContain('ext.area_m2 || 180');
    expect(html).not.toContain('ext.bedrooms || 3');
    expect(html).not.toContain('(p.bedrooms||4)');
    expect(html).not.toContain('(p.levels||2)');
    expect(html).not.toContain("p.setting||'Mediterranean coast'");
  });
  const fns = () => {
    const a = html.indexOf('function wizNumOf('), b = html.indexOf('\n', html.indexOf('function wizStop(', a));
    return html.slice(a, b);
  };
  it('wizNumOf: blank or text is NaN (sent as null), a number is itself', () => {
    const wizNumOf = new Function('D', 'gv', `${fns()}; return wizNumOf;`)({}, () => '');
    expect([wizNumOf(''), wizNumOf('  '), wizNumOf(undefined), wizNumOf('abc'), wizNumOf('12'), wizNumOf(' 0.5 ')]).toEqual([NaN, NaN, NaN, NaN, 12, 0.5]);
    expect(JSON.stringify({ area: wizNumOf('') })).toBe('{"area":null}');
  });
  it('wizStop names the blank inputs and stops the request', () => {
    const alert = vi.fn();
    const wizStop = new Function('D', 'gv', 'alert', `${fns()}; return wizStop;`)({}, () => '', alert);
    expect(wizStop({ units: NaN, stories: 2, area: NaN, style: 'modern' })).toBe(true);
    expect(alert).toHaveBeenCalledWith('Enter units, area in the wizard first. Nothing is assumed.');
    expect(wizStop({ units: 1, stories: 2, area: 220 })).toBe(false);
  });
  it('the Drawings, all-drawings and IFC requests are stopped when inputs are blank', () => {
    for (const anchor of ["foundation_type:null},params||{});", "location:gv('p1_location')||''};", "units:wizNum('p4_units')};"]) {
      const i = html.indexOf(anchor);
      expect(i, anchor).toBeGreaterThan(-1);
      expect(html.slice(i, i + 200)).toMatch(/if\(wizStop\(body\)\)/);
    }
  });
});
