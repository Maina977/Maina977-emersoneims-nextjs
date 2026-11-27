// @vitest-environment jsdom
/**
 * CA-52 review of cc4a1668 (2026-11-27). The saved-report list trusted whatever was in the
 * browser's "aquascan_report_history": [null] or an object format crashed it, [5] / ["x"]
 * showed an "Invalid Date" row as a saved report, and a forged "Nairobi Site Analysis 78%"
 * city was shown as the visitor's own report. Only entries of the shape recordReport()
 * writes are now listed; anything else is skipped and the empty state stays honest.
 * Advisory: the /compare demo sites are labelled "Example sites (not real analyses)".
 * TEST values only.
 */
import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import ReportsHub from '@/components/aquascan-modules/reports/ReportsHub';
import { NO_REPORTS_TEXT, validSavedReports, HISTORY_DISPLAY_LIMIT } from '@/components/aquascan-modules/reports/ReportHistory';
import CompareHub from '@/components/aquascan-modules/compare/CompareHub';

afterEach(cleanup);
beforeEach(() => { localStorage.clear(); });

const record = (o: Record<string, unknown> = {}) => ({
  id: 7, timestamp: '2026-11-20T09:30:00.000Z', customerName: 'TEST', customerEmail: '', customerOrg: '',
  country: 'Kenya', countryCode: 'KE', region: 'TEST County', city: 'TEST Town', coordinates: '-1.00000, 37.00000',
  format: 'PDF', tier: 'basic', probability: 0.5, recommendedDepth: 100, estimatedYield: 1, riskLevel: 'Moderate',
  auditScore: 90, auditPassed: true, isSuccessStory: false, ...o,
});
const store = (v: unknown) => localStorage.setItem('aquascan_report_history', JSON.stringify(v));
const mount = async () => { await act(async () => { render(<ReportsHub />); }); };
const rows = () => document.querySelectorAll('[data-testid="report-history"] tbody tr').length;

describe('CA-52 review: stored entries are validated before display', () => {
  const junk: Array<[string, unknown]> = [
    ['[null]', [null]],
    ['a number', [5]],
    ['a string', ['x']],
    ['an array', [[1, 2]]],
    ['format is an object', [record({ format: { toString: 1 } })]],
    ['unknown format', [record({ format: 'EXE' })]],
    ['id not a number', [record({ id: '7' })]],
    ['unparseable timestamp', [record({ timestamp: 'yesterday' })]],
    ['timestamp is a number', [record({ timestamp: 1 })]],
    ['city is an object', [record({ city: { a: 1 } })]],
    ['forged analysis as city', [record({ city: 'Nairobi Site Analysis 78%' })]],
    ['percentage in region', [record({ region: 'success 65%' })]],
    ['oversized place', [record({ city: 'A'.repeat(500) })]],
  ];
  for (const [label, value] of junk) {
    it(`${label}: no crash, no row, honest empty state`, async () => {
      store(value);
      await mount();
      expect(screen.getByText(NO_REPORTS_TEXT)).toBeTruthy();
      expect(rows()).toBe(0);
      expect(document.body.textContent).not.toMatch(/Invalid Date|78%|Site Analysis/);
    });
  }

  it('a good record next to junk: only the good one is listed', async () => {
    store([null, 5, 'x', record({ city: 'Nairobi Site Analysis 78%' }), record({ id: 9 })]);
    await mount();
    expect(rows()).toBe(1);
    expect(document.body.textContent).toContain('TEST Town, TEST County, Kenya');
  });

  it('genuine place names are never hidden (re-review advisory: "Success", "Analysis Point", long regions)', () => {
    const real = [
      record({ id: 1, city: 'Success', region: 'Arkansas', country: 'United States' }),
      record({ id: 2, city: 'Analysis Point', region: 'Probability Ridge' }),
      record({ id: 3, city: "Murang'a", region: "Murang'a County" }),
      record({ id: 4, city: 'Saint-Étienne', region: 'Auvergne-Rhône-Alpes', country: 'France' }),
      record({ id: 5, region: 'R'.repeat(150), coordinates: 'N/A', city: 'Unknown', country: 'Unknown' }),
    ];
    expect(validSavedReports(real)).toHaveLength(real.length);
  });

  it('HTML in a place name is shown as text, never run', async () => {
    store([record({ city: '<img src=x onerror="window.__x=1">' })]);
    await mount();
    expect(document.querySelector('[data-testid="report-history"] img')).toBeNull();
    expect((window as unknown as { __x?: number }).__x).toBeUndefined();
  });

  it('the list is capped at the history limit (validator only, no large render)', () => {
    const many = Array.from({ length: HISTORY_DISPLAY_LIMIT + 50 }, (_, i) => record({ id: i }));
    const out = validSavedReports(many);
    expect(out).toHaveLength(HISTORY_DISPLAY_LIMIT);
    expect(out[out.length - 1].id).toBe(HISTORY_DISPLAY_LIMIT + 49);
    expect(validSavedReports('nope')).toEqual([]);
    expect(validSavedReports({ length: 3 })).toEqual([]);
  });

  it('newest first, by real time', async () => {
    store([record({ id: 1, timestamp: '2026-11-01T00:00:00.000Z', city: 'Older' }), record({ id: 2, timestamp: '2026-11-25T00:00:00.000Z', city: 'Newer' })]);
    await mount();
    const cells = Array.from(document.querySelectorAll('[data-testid="report-history"] tbody tr td:nth-child(2)')).map((c) => c.textContent);
    expect(cells[0]).toMatch(/^Newer/);
    expect(cells[1]).toMatch(/^Older/);
  });
});

describe('CA-52 advisory: comparison demo sites are labelled as examples', () => {
  it('the /compare page states that its sites are examples, not real analyses', async () => {
    await act(async () => { render(<CompareHub />); });
    const note = screen.getByTestId('compare-example-notice');
    expect(note.textContent).toMatch(/Example sites \(not real analyses\)/);
    expect(note.textContent).toMatch(/not survey results or quotations/);
  });
});
