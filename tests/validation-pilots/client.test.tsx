// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import PilotsClient, { PRIVACY_NOTICE } from '@/app/validation/pilots/PilotsClient';
import { QS_CSV, SOLAR_CSV } from './fixtures';

/**
 * The page reads files in the browser only: no fetch, no XHR, no beacon, no
 * storage. Downloads are made from in-memory Blobs (object URLs).
 */
const fetchSpy = vi.fn();
const xhrOpen = vi.fn();
const beacon = vi.fn();
const blobs: Blob[] = [];

beforeEach(() => {
  fetchSpy.mockReset(); xhrOpen.mockReset(); beacon.mockReset(); blobs.length = 0;
  vi.stubGlobal('fetch', fetchSpy);
  vi.spyOn(XMLHttpRequest.prototype, 'open').mockImplementation(xhrOpen);
  Object.defineProperty(navigator, 'sendBeacon', { value: beacon, configurable: true });
  URL.createObjectURL = vi.fn((b: Blob) => { blobs.push(b); return 'blob:test'; });
  URL.revokeObjectURL = vi.fn();
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  vi.spyOn(Storage.prototype, 'setItem');
});
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

// jsdom's Blob has no .text(); FileReader reads it the same way a browser would.
const blobText = (b: Blob) => new Promise<string>((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(String(r.result));
  r.onerror = () => reject(r.error);
  r.readAsText(b);
});
const card = (id: string) => document.querySelector(`[data-card="${id}"]`) as HTMLElement;
const load = (id: string, name: string, text: string) => {
  const input = within(card(id)).getByLabelText(/Load filled file for/) as HTMLInputElement;
  fireEvent.change(input, { target: { files: [new File([text], name, { type: 'text/csv' })] } });
};
const noNetwork = () => {
  expect(fetchSpy).not.toHaveBeenCalled();
  expect(xhrOpen).not.toHaveBeenCalled();
  expect(beacon).not.toHaveBeenCalled();
  expect(Storage.prototype.setItem).not.toHaveBeenCalled();
};

describe('pilot comparison page (browser only)', () => {
  it('shows four cards, the privacy notice on each, and anonymising on by default', () => {
    render(<PilotsClient />);
    for (const id of ['oracle', 'solar', 'boreholes', 'qs']) {
      expect(card(id)).toBeTruthy();
      expect(within(card(id)).getByText(PRIVACY_NOTICE)).toBeTruthy();
      expect(within(card(id)).getAllByText(/Download blank/).length).toBeGreaterThan(0);
    }
    expect((screen.getByLabelText('Anonymise client names in the report') as HTMLInputElement).checked).toBe(true);
  });

  it('loads, compares and downloads PDF and JSON with no network call', async () => {
    render(<PilotsClient />);
    load('qs', 'TEST-ClientCo.csv', QS_CSV);
    const res = await screen.findByTestId('result-qs');
    expect(within(res).getByText('5 % : OUTSIDE +/-2 %')).toBeTruthy();
    expect(within(res).getByText(/row 2 \(Client A A1\)/)).toBeTruthy();
    expect(res.textContent).not.toContain('ClientCo');
    expect(res.textContent).toMatch(/File SHA-256 [0-9a-f]{64}/);

    fireEvent.click(within(res).getByText('Download report (JSON)'));
    await waitFor(() => expect(blobs).toHaveLength(1));
    const json = JSON.parse(await blobText(blobs[0]));
    expect(json.stamp).toBe('PILOT COMPARISON — for reviewer assessment, not a certification');
    expect(json.file.sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(json.reviewer.name).toBe('');
    expect(JSON.stringify(json)).not.toContain('ClientCo');

    fireEvent.click(within(res).getByText('Download report (PDF)'));
    await waitFor(() => expect(blobs).toHaveLength(2));
    expect(blobs[1].type).toBe('application/pdf');

    fireEvent.click(within(card('solar')).getByText('Download blank template'));
    await waitFor(() => expect(blobs).toHaveLength(3));
    expect(await blobText(blobs[2])).toMatch(/^# TEMPLATE ONLY/);
    noNetwork();
  });

  it('turning anonymising off re-compares from memory and shows the names', async () => {
    render(<PilotsClient />);
    load('solar', 'TEST.csv', SOLAR_CSV);
    expect((await screen.findByTestId('result-solar')).textContent).toContain('Site 1');
    fireEvent.click(screen.getByLabelText('Anonymise client names in the report'));
    await waitFor(() => expect(screen.getByTestId('result-solar').textContent).toContain('TEST-ClientCo-SYS'));
    noNetwork();
  });

  it('refuses a bad file with a message', async () => {
    render(<PilotsClient />);
    load('solar', 'TEST.csv', QS_CSV);
    expect((await within(card('solar')).findByRole('alert')).textContent).toMatch(/File refused: This file is not the Solar/);
    load('qs', 'TEST.xlsx', 'x');
    expect((await within(card('qs')).findByRole('alert')).textContent).toMatch(/not a .csv file/);
    expect(screen.queryByTestId('result-solar')).toBeNull();
    noNetwork();
  });
});
