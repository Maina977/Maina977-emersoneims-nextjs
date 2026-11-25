// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, act, within } from '@testing-library/react';
import ProposalPage from '@/components/solar-modules/crc/src/pages/ProposalPage';

// The Proposal page (#/proposal) shows the single-line diagram preview and the
// horizon input. No network: fetch never resolves.
beforeEach(() => { localStorage.clear(); vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {}))); });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('Proposal page: SLD preview and horizon input', () => {
  it('SLD preview appears from the worked example with design-derived labels', async () => {
    render(<ProposalPage />);
    await act(async () => {});
    const sld = screen.getByRole('region', { name: 'Single-line diagram' });
    expect(within(sld).getByText(/Shown once the module/)).toBeTruthy();
    fireEvent.click(screen.getByText(/Load worked example/));
    await act(async () => {});
    const svg = sld.querySelector('svg')!;
    expect(svg).toBeTruthy();
    expect(svg.textContent).toContain('824.08 V'); // 49.5 × (1 + 0.0027 × 15) × 16
    expect(svg.textContent).toContain('to be specified by the engineer');
  });
  it('horizon: an invalid line is refused with its reason; a valid profile draws the horizon chart', async () => {
    render(<ProposalPage />);
    await act(async () => {});
    const sec = screen.getByRole('region', { name: 'Horizon shading' });
    fireEvent.change(within(sec).getByLabelText('Horizon sectors'), { target: { value: '60,120,95' } });
    fireEvent.change(within(sec).getByLabelText(/Source of the horizon/), { target: { value: 'site survey (test)' } });
    expect(within(sec).getByRole('alert').textContent).toMatch(/below 90/);
    fireEvent.change(within(sec).getByLabelText('Horizon sectors'), { target: { value: '60,120,15' } });
    expect(within(sec).queryByRole('alert')).toBeNull();
    expect(within(sec).getByRole('img', { name: 'Horizon elevation by azimuth' })).toBeTruthy();
  });
});
