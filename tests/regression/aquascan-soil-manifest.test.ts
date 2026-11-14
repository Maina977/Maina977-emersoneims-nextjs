import { describe, it, expect } from 'vitest';
import { checkManifest, verifyFiles, scaled, soilCitation, REQUIRED_LAYERS, type SoilManifest, type SoilLayer } from '@/lib/aquascan-validation/soilManifest';

const sha = async (b: Uint8Array) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new Uint8Array(b)))].map((x) => x.toString(16).padStart(2, '0')).join('');
// SYNTHETIC manifest: shape only, no real soil files.
const files = new Map<string, Uint8Array>();
async function manifest(): Promise<SoilManifest> {
  const layers: SoilLayer[] = [];
  for (const r of REQUIRED_LAYERS) {
    const [property, depth] = r.split('|');
    const file = `${property}/${property}_${depth}_mean.tif`;
    const bytes = new TextEncoder().encode(`synthetic ${file}`);
    files.set(file, bytes);
    layers.push({ property, depth, statistic: 'mean', file, sha256: await sha(bytes), bytes: bytes.length, divisor: property === 'phh2o' ? 10 : property === 'bdod' ? 100 : 10, unit: property === 'phh2o' ? 'pH' : property === 'bdod' ? 'kg/dm³' : property === 'soc' ? 'g/kg' : '%', noData: -32768 });
  }
  return {
    datasetId: 'kenya-soilgrids-2.0-1km-test', version: '1',
    source: { name: 'SoilGrids 2.0', publisher: 'ISRIC – World Soil Information', release: '2.0', url: 'https://files.isric.org/soilgrids/latest/data/', retrievedOn: '2026-11-14' },
    licence: { id: 'CC-BY-4.0', url: 'https://creativecommons.org/licenses/by/4.0/', attribution: 'Soil data: SoilGrids 2.0, ISRIC – World Soil Information.', changesMade: 'Clipped to Kenya and aggregated to 1 km by EmersonEIMS.' },
    grid: { crs: 'ESRI:54052', resolutionM: 1000, bbox: [33.9, -4.72, 41.91, 5.03], note: 'regional context, not a site measurement' },
    layers, createdBy: 'test', createdOn: '2026-11-14',
  };
}

describe('soil dataset manifest', () => {
  it('a complete CC BY 4.0 manifest passes', async () => {
    expect(checkManifest(await manifest())).toEqual({ ok: true, errors: [] });
  });
  it('licence terms are mandatory: attribution to ISRIC, licence link, changes made', async () => {
    const m = await manifest();
    const r = checkManifest({ ...m, licence: { ...m.licence, attribution: 'Soil data', url: 'https://example.com', changesMade: '' } });
    expect(r.errors.join(' ')).toMatch(/credit ISRIC/);
    expect(r.errors.join(' ')).toMatch(/link to the CC BY 4.0/);
    expect(r.errors.join(' ')).toMatch(/changesMade/);
  });
  it('a missing required layer, bad hash or path escape is refused', async () => {
    const m = await manifest();
    const layers = m.layers.slice(1);
    layers[0] = { ...layers[0], sha256: 'abc', file: '../etc/x.tif' };
    const r = checkManifest({ ...m, layers });
    expect(r.errors.join(' ')).toMatch(/missing required layer clay 0-5cm mean/);
    expect(r.errors.join(' ')).toMatch(/sha256/);
    expect(r.errors.join(' ')).toMatch(/relative path/);
  });
  it('files are checked against their hashes before use', async () => {
    const m = await manifest();
    expect(await verifyFiles(m, async (f) => files.get(f)!)).toEqual({ ok: true, mismatched: [] });
    const tampered = await verifyFiles(m, async (f) => (f.startsWith('clay/clay_0-5cm') ? new TextEncoder().encode('changed') : files.get(f)!));
    expect(tampered.ok).toBe(false);
    expect(tampered.mismatched).toEqual(['clay/clay_0-5cm_mean.tif']);
  });
  it('integer scaling and no-data', async () => {
    const m = await manifest();
    const ph = m.layers.find((l) => l.property === 'phh2o')!;
    expect(scaled(ph, 65)).toBe(6.5);
    expect(scaled(ph, -32768)).toBeNull();
  });
  it('every soil result carries the citation with dataset version', async () => {
    expect(soilCitation(await manifest())).toMatch(/ISRIC.*CC BY 4\.0.*Clipped to Kenya.*kenya-soilgrids-2\.0-1km-test version 1, retrieved 2026-11-14/);
  });
});
