// @vitest-environment jsdom
/**
 * REQ-05 on the Proposal page (2026-11-27): several cable runs can be added and
 * removed, the AC protection fieldset lists the runs by name, and the SLD
 * preview draws the entered breaker. No network: fetch never resolves.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, act, within } from '@testing-library/react';
import ProposalPage from '@/components/solar-modules/crc/src/pages/ProposalPage';

beforeEach(() => { localStorage.clear(); vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {}))); });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

const inRun = (n: number, label: RegExp) => within(screen.getByRole('group', { name: `Cable run ${n}` })).getByLabelText(label) as HTMLInputElement;
const type = (el: HTMLElement, value: string) => fireEvent.change(el, { target: { value } });

describe('Proposal page: cable runs and AC protection', () => {
  it('adds a second and third run, lists the runs in the AC protection select, and removes run 2 (run 3 moves up)', async () => {
    render(<ProposalPage />);
    await act(async () => {});
    expect(screen.queryByRole('group', { name: 'Cable run 2' })).toBeNull();
    type(inRun(1, /^Name/), 'PV 1');
    fireEvent.click(screen.getByText('Add cable run'));
    type(inRun(2, /^Name/), 'PV 2');
    fireEvent.click(screen.getByText('Add cable run'));
    type(inRun(3, /^Name/), 'AC 1');
    type(inRun(3, /^Carries/), 'ac');
    const ap = screen.getByRole('group', { name: 'AC protection (each inverter)' });
    const opts = [...(within(ap).getByLabelText(/^AC cable run it protects/) as HTMLSelectElement).options].map((o) => o.value);
    expect(opts).toEqual(['', 'PV 1', 'PV 2', 'AC 1']);
    fireEvent.click(screen.getByLabelText('Remove cable run 2'));
    expect(inRun(2, /^Name/).value).toBe('AC 1');
    expect(inRun(2, /^Carries/).value).toBe('ac');
    expect(screen.queryByRole('group', { name: 'Cable run 3' })).toBeNull();
  });

  it('an incomplete run is listed as missing; the breaker entered appears in the diagram preview', async () => {
    render(<ProposalPage />);
    await act(async () => {});
    fireEvent.click(screen.getByText(/Load worked example/));
    await act(async () => {});
    type(inRun(1, /^Name/), 'AC 1');
    const list = screen.getByRole('region', { name: 'Proposal' });
    expect(list.textContent).toContain('Cable run AC 1: method is required (or clear the run)');
    expect(list.textContent).toContain('Cable run AC 1: conductor is required (or clear the run)');
    const ap = screen.getByRole('group', { name: 'AC protection (each inverter)' });
    type(within(ap).getByLabelText(/^AC breaker \/ MCB rating/), '32');
    await act(async () => {});
    const svg = screen.getByRole('region', { name: 'Single-line diagram' }).querySelector('svg')!;
    expect(svg.textContent).toContain('AC circuit breaker: 32 A');
    expect(svg.textContent).toMatch(/\(check ?ac-breaker-current: NOT CHECKED\)/); // the SVG wraps lines without spaces
  });
});
