// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SolarROICalculator, { ROI_DRAFT_FORM } from '@/components/solar/SolarROICalculator';
import QuoteCheckerPage, { QUOTE_DRAFT_FORM } from '@/components/solar-modules/crc/src/pages/QuoteCheckerPage';
import SolarToolTabs, { useHashTab, TAB_HASH_PREFIX } from '@/components/solar/SolarToolTabs';
import { DRAFT_PREFIX, readSessionDraft, writeSessionDraft } from '@/lib/loading/sessionDraft';

// The Quote Checker tool shows only once prices are verified; switch it on for its test.
const priceState = vi.hoisted(() => ({ verified: false }));
vi.mock('@/lib/solar/sizing', async (orig) => ({ ...(await orig<typeof import('@/lib/solar/sizing')>()), pricesVerified: () => priceState.verified }));

// Management priority 1 (2026-11-21): typed inputs survive a recovery reload,
// kept only in sessionStorage (cleared when the tab closes). A "reload" here is
// an unmount and a fresh mount with the same sessionStorage.

beforeEach(() => {
  sessionStorage.clear();
  // The Quote Checker asks the API for the equipment library; never answer.
  vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); window.history.replaceState(null, '', '/'); });

describe('ROI calculator inputs survive a reload', () => {
  it('bill, tariff, quoted cost and battery choice come back after a remount', () => {
    const first = render(<SolarROICalculator />);
    fireEvent.change(screen.getByLabelText(/Monthly Electricity Bill/), { target: { value: '23456' } });
    const tariff = document.getElementById('roi-tariff') as HTMLInputElement | null;
    if (tariff) fireEvent.change(tariff, { target: { value: '31.5' } });
    first.unmount();

    expect(sessionStorage.getItem(DRAFT_PREFIX + ROI_DRAFT_FORM)).toMatch(/23456/);
    render(<SolarROICalculator />);
    expect((screen.getByLabelText(/Monthly Electricity Bill/) as HTMLInputElement).value).toBe('23456');
    if (tariff) expect((document.getElementById('roi-tariff') as HTMLInputElement).value).toBe('31.5');
  });

  it('stores only the calculator fields, under one sessionStorage key, and never localStorage', () => {
    localStorage.clear();
    render(<SolarROICalculator />);
    fireEvent.change(screen.getByLabelText(/Monthly Electricity Bill/), { target: { value: '1000' } });
    const saved = JSON.parse(sessionStorage.getItem(DRAFT_PREFIX + ROI_DRAFT_FORM) as string);
    expect(Object.keys(saved).sort()).toEqual(['batteryCapacity', 'batteryReplacementInput', 'includesBattery', 'monthlyBill', 'quotedCostInput', 'systemSize', 'tariffInput']);
    expect(sessionStorage.length).toBe(1);
    expect(localStorage.length).toBe(0);
  });

  it('a corrupt or wrongly typed draft is ignored field by field', () => {
    sessionStorage.setItem(DRAFT_PREFIX + 'x', JSON.stringify({ a: 'not a number', b: 'ok' }));
    expect(readSessionDraft('x', { a: 1, b: '' })).toEqual({ a: 1, b: 'ok' });
    sessionStorage.setItem(DRAFT_PREFIX + 'y', '{broken');
    expect(readSessionDraft('y', { a: 1 })).toEqual({ a: 1 });
  });

  it('blocked storage: the form still works and nothing throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('blocked', 'SecurityError'); });
    expect(() => writeSessionDraft('z', { a: 1 })).not.toThrow();
    render(<SolarROICalculator />);
    fireEvent.change(screen.getByLabelText(/Monthly Electricity Bill/), { target: { value: '777' } });
    expect((screen.getByLabelText(/Monthly Electricity Bill/) as HTMLInputElement).value).toBe('777');
    spy.mockRestore();
  });
});

describe('Quote Checker text survives a reload', () => {
  it('the pasted quote comes back after a remount', () => {
    priceState.verified = true;
    const first = render(<QuoteCheckerPage />);
    const box = screen.getByLabelText('Quotation lines, one item per line');
    fireEvent.change(box, { target: { value: 'Inverter 5kW x 1 @ 150000' } });
    first.unmount();
    expect(JSON.parse(sessionStorage.getItem(DRAFT_PREFIX + QUOTE_DRAFT_FORM) as string)).toEqual({ text: 'Inverter 5kW x 1 @ 150000' });
    render(<QuoteCheckerPage />);
    expect((screen.getByLabelText('Quotation lines, one item per line') as HTMLTextAreaElement).value).toBe('Inverter 5kW x 1 @ 150000');
    priceState.verified = false;
  });
});

describe('/solar tool tabs respond to a click before hydration', () => {
  const tabs = [{ id: 'overview', label: 'Solar Overview', icon: '' }, { id: 'roi', label: 'Savings Calculator', icon: '' }] as const;
  const ids = ['overview', 'roi'] as const;
  function Harness() {
    const [active, select] = useHashTab<'overview' | 'roi'>('overview', ids);
    return <><SolarToolTabs tabs={tabs} active={active} onSelect={select} /><p>open: {active}</p></>;
  }

  it('the server HTML is a native link, so the browser acts on a click with no JavaScript', () => {
    const html = renderToString(<Harness />);
    expect(html).toMatch(new RegExp(`<a[^>]*href="${TAB_HASH_PREFIX}roi"`));
    expect(html).not.toMatch(/<button/);
  });

  it('a choice made before hydration (address already #solar-tool-roi) opens that tab on hydration', () => {
    window.history.replaceState(null, '', TAB_HASH_PREFIX + 'roi');
    render(<Harness />);
    expect(screen.getByText('open: roi')).toBeTruthy();
  });

  it('after hydration a click opens the tab and records it in the address', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('tab', { name: /Savings Calculator/ }));
    expect(screen.getByText('open: roi')).toBeTruthy();
    expect(window.location.hash).toBe(TAB_HASH_PREFIX + 'roi');
  });

  it('a hash change (back button, or a pre-hydration click landing late) follows', () => {
    render(<Harness />);
    act(() => { window.history.replaceState(null, '', TAB_HASH_PREFIX + 'roi'); window.dispatchEvent(new HashChangeEvent('hashchange')); });
    expect(screen.getByText('open: roi')).toBeTruthy();
  });

  it('/solar uses these tabs, and the ROI calculator is loaded resiliently', () => {
    const src = readFileSync(join(process.cwd(), 'app/solar/page.tsx'), 'utf8');
    expect(src).toMatch(/<SolarToolTabs /);
    expect(src).toMatch(/SolarROICalculator = resilient\(/);
  });
});
