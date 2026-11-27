// @vitest-environment jsdom
/**
 * REQ-27 (RS20 P5), 2026-11-27: address → site → design check → proposal,
 * joined across the screens. The site the user confirms on the Dashboard
 * (address and coordinates of the chosen place-search result, and the
 * looked-up elevation only when ticked) pre-fills the Proposal page's blank
 * fields, each labelled with its source. Nothing else is carried, and nothing
 * the designer typed is overwritten.
 *
 * TEST place, coordinates and elevation; every network answer is stubbed.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, act, within } from '@testing-library/react';
import DashboardPage from '@/components/solar-modules/crc/src/pages/DashboardPage';
import ProposalPage from '@/components/solar-modules/crc/src/pages/ProposalPage';
import { useSolarStore } from '@/components/solar-modules/crc/src/services/store';
import { parseElevationAnswer } from '@/components/solar-modules/crc/src/services/siteAssessment';
import {
  applySiteHandoff, buildSiteHandoff, prefillSource, readSiteHandoff, replaceWithHandoff, siteHandoffPrefill, storeSiteHandoff, takeSiteHandoff,
  HANDOFF_FORM_KEY, PLACE_SEARCH_SOURCE, SITE_HANDOFF_KEY, type SiteHandoff,
} from '@/lib/solar/design/siteHandoff';
import { formToProposalInput, WORKED_EXAMPLE_FORM, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION } from '@/lib/solar/design/proposalForm';
import { proposalRevisionHash } from '@/lib/solar/design/proposalApproval';

const NOW = new Date('2026-11-27T09:30:00Z');
const SITE = { lat: -1.2921, lon: 36.8219, displayName: 'TEST place, Nairobi, Kenya', elevationM: 1661, elevationSource: 'OpenTopoData SRTM 30 m lookup at the coordinates', elevationRetrievedAt: '2026-11-27T09:29:00.000Z' };
const H: SiteHandoff = { v: 1, confirmedAt: NOW.toISOString(), address: SITE.displayName, lat: SITE.lat, lon: SITE.lon, coordinatesSource: PLACE_SEARCH_SOURCE, elevationM: 1661, elevationSource: SITE.elevationSource, elevationRetrievedAt: SITE.elevationRetrievedAt };

const mem = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => { m.set(k, v); }, removeItem: (k: string) => { m.delete(k); }, m }; };

describe('building the hand-off: only what the user confirmed', () => {
  it('address and coordinates of the chosen result; the elevation only when ticked', () => {
    const without = buildSiteHandoff(SITE, false, NOW);
    expect(without.handoff).toEqual({ v: 1, confirmedAt: '2026-11-27T09:30:00.000Z', address: SITE.displayName, lat: SITE.lat, lon: SITE.lon, coordinatesSource: PLACE_SEARCH_SOURCE });
    expect(buildSiteHandoff(SITE, true, NOW).handoff).toEqual(H);
  });
  it('no coordinates, no address, or a ticked elevation with no value or no source: refused with the reason', () => {
    expect(buildSiteHandoff({ ...SITE, lat: null }, false, NOW).error).toMatch(/no coordinates/);
    expect(buildSiteHandoff({ ...SITE, lat: 95 }, false, NOW).error).toMatch(/no coordinates/);
    expect(buildSiteHandoff({ ...SITE, displayName: ' ' }, false, NOW).error).toMatch(/no address/);
    expect(buildSiteHandoff({ ...SITE, elevationM: null }, true, NOW).error).toMatch(/No elevation/);
    expect(buildSiteHandoff({ ...SITE, elevationSource: '' }, true, NOW).error).toMatch(/No elevation/);
    expect(buildSiteHandoff({ ...SITE, elevationM: 9000 }, true, NOW).error).toMatch(/No elevation/);
  });
  it('a stored hand-off is read strictly: anything malformed is not used at all', () => {
    expect(readSiteHandoff(JSON.stringify(H))).toEqual(H);
    for (const bad of [null, '', 'not json', '[]', JSON.stringify({ ...H, v: 2 }), JSON.stringify({ ...H, lat: '1' }), JSON.stringify({ ...H, address: '' }), JSON.stringify({ ...H, confirmedAt: 'someday' }), JSON.stringify({ ...H, elevationSource: undefined }), JSON.stringify({ ...H, elevationM: -900 })]) {
      expect(readSiteHandoff(bad as string | null)).toBeNull();
    }
  });
  it('the hand-off is taken once: reading it removes it, so it never overwrites later edits', () => {
    const st = mem();
    expect(storeSiteHandoff(st, H)).toEqual({ ok: true });
    expect(takeSiteHandoff(st)).toEqual(H);
    expect(st.m.has(SITE_HANDOFF_KEY)).toBe(false);
    expect(takeSiteHandoff(st)).toBeNull();
    expect(storeSiteHandoff(null, H).ok).toBe(false);
  });
});

describe('pre-filling the Proposal form', () => {
  it('fills only blank fields, each with its source; never irradiance, temperature or roof area', () => {
    const a = applySiteHandoff({}, H);
    // Review M2: the general site source (s.source) is never pre-filled.
    expect(a.applied.map((x) => x.key)).toEqual(['c.address', 'c.lat', 'c.lon', 's.elevationM']);
    expect(a.form['s.source']).toBeUndefined();
    expect(a.form['c.address']).toBe(SITE.displayName);
    expect(a.form['c.lat']).toBe('-1.2921');
    expect(a.form['s.elevationM']).toBe('1661');
    expect(prefillSource(a.form, 'c.lat')).toBe(`${PLACE_SEARCH_SOURCE}, confirmed 2026-11-27`);
    expect(prefillSource(a.form, 's.elevationM')).toBe('automatically obtained: OpenTopoData SRTM 30 m lookup at the coordinates, retrieved 2026-11-27');
    for (const k of ['t.recordLowC', 't.maxAmbientC', 's.usableAreaM2', 's.mounting', 'd.azimuth', 'd.tilt']) expect(a.form[k]).toBeUndefined();
  });
  it('without the ticked elevation, no elevation and no site-details source are filled', () => {
    const a = applySiteHandoff({}, buildSiteHandoff(SITE, false, NOW).handoff!);
    expect(a.applied.map((x) => x.key)).toEqual(['c.address', 'c.lat', 'c.lon']);
    expect(a.form['s.elevationM']).toBeUndefined();
    expect(a.form['s.source']).toBeUndefined();
  });
  it('a field the designer typed is not overwritten; the difference is listed and can be replaced on request', () => {
    const a = applySiteHandoff({ 'c.address': 'Plot 12, survey drawing', 'c.lat': '-1.2921' }, H);
    expect(a.form['c.address']).toBe('Plot 12, survey drawing');
    expect(a.differences.map((x) => [x.key, x.current, x.value])).toEqual([['c.address', 'Plot 12, survey drawing', SITE.displayName]]);
    expect(a.applied.map((x) => x.key)).toEqual(['c.lon', 's.elevationM']);
    expect(prefillSource(a.form, 'c.address')).toBeNull();
    const r = replaceWithHandoff(a.form, a.differences);
    expect(r['c.address']).toBe(SITE.displayName);
    expect(prefillSource(r, 'c.address')).toMatch(/place search/);
  });
  it('the source label disappears once the value is edited', () => {
    const a = applySiteHandoff({}, H);
    expect(prefillSource({ ...a.form, 's.elevationM': '1650' }, 's.elevationM')).toBeNull();
  });
  it('the pre-fill record is not part of the proposal input or its revision', () => {
    const base = formToProposalInput({ ...WORKED_EXAMPLE_FORM, 's.elevationM': '1661', 's.elevationSource': 'x' }, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION, null).input!;
    const withRec = formToProposalInput({ ...WORKED_EXAMPLE_FORM, 's.elevationM': '1661', 's.elevationSource': 'x', [HANDOFF_FORM_KEY]: '{"s.elevationM":{"value":"1661","source":"y"}}' }, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION, null).input!;
    expect(proposalRevisionHash(withRec)).toBe(proposalRevisionHash(base));
  });
  it('the elevation answer is used only with the service that gave it, and only inside −500 to 6,000 m', () => {
    expect(parseElevationAnswer({ success: true, data: { location: { elevation: 1661, source: SITE.elevationSource } } })).toEqual({ elevationM: 1661, source: SITE.elevationSource });
    expect(parseElevationAnswer({ success: true, data: { location: { elevation: 1661 } } })).toBeNull();
    expect(parseElevationAnswer({ success: true, data: { location: { elevation: 7000, source: 'x' } } })).toBeNull();
    expect(parseElevationAnswer({ success: false, error: 'All elevation services unavailable.' })).toBeNull();
    expect(parseElevationAnswer({ error: 'HTTP 503' })).toBeNull();
    expect(siteHandoffPrefill(H).every((p) => p.source.trim() !== '')).toBe(true);
  });
});

// ------------------------------------------------------------------ the screens, end to end
const json = (x: unknown, status = 200) => Promise.resolve({ ok: status < 400, status, headers: { get: () => 'application/json' }, json: async () => x, text: async () => JSON.stringify(x), blob: async () => new Blob() });
function stubNetwork(elevation: unknown) {
  const calls: string[] = [];
  vi.stubGlobal('fetch', vi.fn((url: string, init?: RequestInit) => {
    calls.push(`${init?.method ?? 'GET'} ${url}`);
    if (url.startsWith('/api/geocode')) return json([{ displayName: SITE.displayName, lat: SITE.lat, lon: SITE.lon }]);
    if (url.startsWith('/api/solar/elevation')) return json(elevation, (elevation as { success?: boolean }).success ? 200 : 503);
    if (url.startsWith('/api/solar/roof-autofill')) return json({ found: false, roofAreaM2: null, note: 'TEST: no footprint' });
    if (url.startsWith('/api/nasa/solar')) return json({ summary: { averageDailyGHI: 5.6 } });
    if (url.startsWith('/api/weather')) return json({ current: { temperature: 23 } });
    return new Promise(() => {}); // anything else never answers
  }));
  return calls;
}
async function confirmOnDashboard(tickElevation: boolean) {
  render(<DashboardPage />);
  await act(async () => {});
  fireEvent.change(screen.getByPlaceholderText(/Address/), { target: { value: 'TEST place' } });
  fireEvent.click(screen.getByText('Find site'));
  await act(async () => {});
  fireEvent.click(screen.getByText(/TEST place, Nairobi, Kenya/));
  await act(async () => {});
  const panel = screen.getByRole('region', { name: 'Use this site in the Proposal' });
  if (tickElevation) fireEvent.click(within(panel).getByRole('checkbox'));
  fireEvent.click(within(panel).getByText(/Use this site in the Proposal →/));
  await act(async () => {});
  return panel;
}
const fieldInput = (label: RegExp) => screen.getByLabelText(label) as HTMLInputElement;

beforeEach(() => { localStorage.clear(); window.location.hash = ''; useSolarStore.getState().resetProject(); });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('Dashboard → Proposal hand-off (both screens rendered)', () => {
  it('the confirmed site pre-fills address, coordinates and the ticked elevation, each labelled; the current temperature and irradiance are not carried', async () => {
    const calls = stubNetwork({ success: true, data: { location: { latitude: SITE.lat, longitude: SITE.lon, elevation: 1661, source: SITE.elevationSource } } });
    const panel = await confirmOnDashboard(true);
    expect(within(panel).getByText(/Include the elevation: 1661 m \(automatically obtained: OpenTopoData SRTM 30 m lookup at the coordinates, retrieved \d{4}-\d{2}-\d{2}\)/)).toBeTruthy();
    expect(within(panel).getByText(/Not carried: irradiance/)).toBeTruthy();
    expect(calls).toContain('POST /api/solar/elevation');
    expect(window.location.hash).toBe('#/proposal');
    expect(readSiteHandoff(localStorage.getItem(SITE_HANDOFF_KEY))).toMatchObject({ address: SITE.displayName, lat: SITE.lat, lon: SITE.lon, elevationM: 1661 });
    cleanup();

    render(<ProposalPage />);
    await act(async () => {});
    expect(fieldInput(/^Site address/).value).toBe(SITE.displayName);
    expect(fieldInput(/^Latitude/).value).toBe('-1.2921');
    expect(fieldInput(/^Longitude/).value).toBe('36.8219');
    expect(fieldInput(/^Site elevation/).value).toBe('1661');
    expect(document.querySelector('[data-prefill-source="c.lat"]')!.textContent).toBe(`Pre-filled from the Dashboard: ${PLACE_SEARCH_SOURCE}, confirmed 2026-11-27`.replace('2026-11-27', new Date().toISOString().slice(0, 10)));
    expect(document.querySelector('[data-prefill-source="s.elevationM"]')!.textContent).toMatch(/automatically obtained: OpenTopoData SRTM 30 m lookup at the coordinates, retrieved \d{4}-\d{2}-\d{2}/);
    const note = screen.getByRole('status', { name: 'Site from the Dashboard' });
    expect(note.textContent).toMatch(/Pre-filled: Site address TEST place, Nairobi, Kenya · Latitude -1.2921 · Longitude 36.8219 · Site elevation 1661/);
    // Not carried: the 23 °C current temperature and 5.6 kWh/m²/day are not design values.
    expect(fieldInput(/^Site record low/).value).toBe('');
    expect(fieldInput(/^Max ambient while generating/).value).toBe('');
    expect(fieldInput(/^Usable area/).value).toBe('');
    // Taken once.
    expect(localStorage.getItem(SITE_HANDOFF_KEY)).toBeNull();
    // Editing a pre-filled value removes its source label.
    fireEvent.change(fieldInput(/^Site elevation/), { target: { value: '1650' } });
    expect(document.querySelector('[data-prefill-source="s.elevationM"]')).toBeNull();
  });

  it('an unticked elevation is not carried; a failed elevation lookup offers none', async () => {
    stubNetwork({ success: true, data: { location: { elevation: 1661, source: SITE.elevationSource } } });
    await confirmOnDashboard(false);
    cleanup();
    render(<ProposalPage />);
    await act(async () => {});
    expect(fieldInput(/^Site address/).value).toBe(SITE.displayName);
    expect(fieldInput(/^Site elevation/).value).toBe('');
    cleanup();
    localStorage.clear();
    useSolarStore.getState().resetProject();

    stubNetwork({ success: false, error: 'Unable to fetch elevation data. All elevation services unavailable.' });
    render(<DashboardPage />);
    await act(async () => {});
    fireEvent.change(screen.getByPlaceholderText(/Address/), { target: { value: 'TEST place' } });
    fireEvent.click(screen.getByText('Find site'));
    await act(async () => {});
    fireEvent.click(screen.getByText(/TEST place, Nairobi, Kenya/));
    await act(async () => {});
    const panel = screen.getByRole('region', { name: 'Use this site in the Proposal' });
    expect(within(panel).queryByRole('checkbox')).toBeNull();
    expect(within(panel).getByText(/Elevation: not available/)).toBeTruthy();
  });

  it('a field already typed in the Proposal draft is kept; the Dashboard value is offered, and used only on request', async () => {
    // A draft with a surveyed address, then a Dashboard confirmation.
    render(<ProposalPage />);
    await act(async () => {});
    fireEvent.change(fieldInput(/^Site address/), { target: { value: 'Plot 12 (survey drawing)' } });
    await act(async () => { await new Promise((r) => setTimeout(r, 450)); }); // autosave
    cleanup();
    localStorage.setItem(SITE_HANDOFF_KEY, JSON.stringify(H));
    render(<ProposalPage />);
    await act(async () => {});
    expect(fieldInput(/^Site address/).value).toBe('Plot 12 (survey drawing)');
    expect(fieldInput(/^Latitude/).value).toBe('-1.2921');
    const note = screen.getByRole('status', { name: 'Site from the Dashboard' });
    expect(note.textContent).toMatch(/Already filled here, so not changed: Site address: "Plot 12 \(survey drawing\)" here, "TEST place, Nairobi, Kenya" on the Dashboard/);
    fireEvent.click(within(note).getByText('Use the Dashboard values instead'));
    expect(fieldInput(/^Site address/).value).toBe(SITE.displayName);
    expect(document.querySelector('[data-prefill-source="c.address"]')).toBeTruthy();
  });
});
