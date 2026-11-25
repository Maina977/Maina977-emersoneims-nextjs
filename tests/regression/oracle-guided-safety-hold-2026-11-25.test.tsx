// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import GuidedDiagnosisPanel, { GD_STORE, SAFETY_HOLD_TEXT } from '@/components/generator-oracle/panels/GuidedDiagnosisPanel';

// Management decision (2026-11-25): when browser storage is blocked, Guided Diagnosis shows a
// SAFETY HOLD (not a mechanical STOP, not a normal screen) until an in-person reassessment is
// acknowledged for this page session. A genuine STOP from the answers still shows and wins.

const EXACT = "SAFETY HOLD — Previous diagnostic safety status cannot be verified. Do not continue guided operational checks until the machine's condition has been reassessed by a qualified technician.";

const origGet = Storage.prototype.getItem;
const origSet = Storage.prototype.setItem;
afterEach(() => {
  Storage.prototype.getItem = origGet;
  Storage.prototype.setItem = origSet;
  cleanup();
  localStorage.clear();
});
const block = (which: 'get' | 'set' | 'both') => {
  if (which !== 'set') Storage.prototype.getItem = () => { throw new Error('blocked'); };
  if (which !== 'get') Storage.prototype.setItem = () => { throw new Error('blocked'); };
};
const choose = (familyTitle: RegExp) => fireEvent.click(screen.getByRole('tab', { name: familyTitle }));
const answer = (questionText: RegExp, value: string) => fireEvent.change(screen.getAllByLabelText(questionText)[0], { target: { value } });
const hold = () => screen.queryByTestId('gd-safety-hold');
const acknowledge = (name: string) => {
  fireEvent.click(screen.getByLabelText("A qualified technician has reassessed the machine's condition in person"));
  fireEvent.change(screen.getByLabelText(/Name or initials of the qualified technician/), { target: { value: name } });
  fireEvent.click(screen.getByRole('button', { name: 'Record reassessment for this page session' }));
};

describe('Guided Diagnosis: SAFETY HOLD when browser storage is blocked', () => {
  it('the hold text is exact', () => expect(SAFETY_HOLD_TEXT).toBe(EXACT));

  for (const which of ['get', 'set', 'both'] as const) {
    it(`storage ${which === 'get' ? 'getItem' : which === 'set' ? 'setItem' : 'getItem and setItem'} throwing: hold shown, no checks, not a STOP`, () => {
      block(which);
      render(<GuidedDiagnosisPanel />);
      const h = hold();
      expect(h).not.toBeNull();
      expect(h!.textContent).toContain(EXACT);
      expect(screen.getByTestId('gd-safety-hold-why').textContent).toMatch(/does not allow the safety record to be read or saved, so an earlier unresolved STOP .* cannot be ruled out/);
      // No running-engine / live instruction and no Next-check prompt.
      expect(screen.queryByText('Next check')).toBeNull();
      expect(document.body.textContent).toMatch(/Do not take any reading that needs the engine running, cranking or live circuits/i);
      // Not worded or recorded as a mechanical STOP of the machine.
      expect(screen.queryByTestId('gd-stop-hold')).toBeNull();
      expect(screen.queryByTestId('gd-latched-stop')).toBeNull();
      expect(h!.textContent).not.toMatch(/\bSTOP THE SET\b|treat the set as stopped/i);
    });
  }

  it('no suggested actions under the hold, even with answers that rank causes', () => {
    block('both');
    render(<GuidedDiagnosisPanel />);
    choose(/Cranks but will not start|will not start/i);
    expect(hold()).not.toBeNull();
    expect(screen.queryByText('Next check')).toBeNull();
    expect(document.body.textContent).toMatch(/no checks are suggested while the safety hold applies/);
  });

  it('release needs BOTH the in-person checkbox and a name; it lasts for this page session only and is never stored', () => {
    block('set');
    const writes: string[] = [];
    Storage.prototype.setItem = function (k: string, v: string) { writes.push(`${k}=${v}`); throw new Error('blocked'); };
    render(<GuidedDiagnosisPanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Record reassessment for this page session' }));
    expect(hold()).not.toBeNull();
    expect(document.body.textContent).toMatch(/Not released: confirm that a qualified technician has reassessed the machine in person/);
    fireEvent.click(screen.getByLabelText("A qualified technician has reassessed the machine's condition in person"));
    fireEvent.click(screen.getByRole('button', { name: 'Record reassessment for this page session' }));
    expect(hold()).not.toBeNull();
    expect(document.body.textContent).toMatch(/Not released: enter the name or initials/);
    fireEvent.change(screen.getByLabelText(/Name or initials of the qualified technician/), { target: { value: 'TECH-Q' } });
    fireEvent.click(screen.getByRole('button', { name: 'Record reassessment for this page session' }));
    expect(hold()).toBeNull();
    expect(screen.getByText('Next check')).not.toBeNull();
    expect(screen.getByTestId('gd-safety-hold-released').textContent).toMatch(/page session only.*TECH-Q.*UNVERIFIED, not stored/);
    expect(screen.getByTestId('gd-storage-blocked')).not.toBeNull();
    // Nothing about the acknowledgement was ever written to storage.
    expect(writes.some((w) => /TECH-Q|reassess/i.test(w))).toBe(false);
    // A reload (fresh mount) brings the hold back.
    cleanup();
    render(<GuidedDiagnosisPanel />);
    expect(hold()).not.toBeNull();
  });

  it('a genuine STOP from the answers still shows as STOP and overrides the hold', () => {
    block('both');
    render(<GuidedDiagnosisPanel />);
    choose(/Knocking, bearing noise or seizure/);
    answer(/Where is the noise\?/, 'engine');
    expect(screen.getByRole('alert').textContent).toMatch(/STOP THE SET/);
    expect(screen.queryByTestId('gd-stop-hold')).not.toBeNull();
    expect(hold()).toBeNull();
    expect(screen.queryByText('Next check')).toBeNull();
    expect(screen.getByTestId('gd-storage-warning').textContent).toMatch(/cannot keep the STOP after a reload/);
  });

  it('a STOP still overrides after the hold was released for the session', () => {
    block('both');
    render(<GuidedDiagnosisPanel />);
    acknowledge('TECH-Q');
    expect(hold()).toBeNull();
    choose(/Knocking, bearing noise or seizure/);
    answer(/Where is the noise\?/, 'engine');
    expect(screen.queryByTestId('gd-stop-hold')).not.toBeNull();
    expect(screen.queryByText('Next check')).toBeNull();
  });

  // Independent review of 4c2a6ee5 (MAJOR): the first read fails, later reads succeed, and an
  // unresolved STOP is stored. The STOP must be shown and win, also after an acknowledgement.
  const STORED_STOP = { key: 'knock-seizure|TEST stored STOP', message: 'TEST stored STOP: STOP THE SET.', from: 'Knocking, bearing noise or seizure', since: '2026-11-25T10:00:00.000Z' };
  const storeStop = () => origSet.call(localStorage, GD_STORE, JSON.stringify({ v: 2, raw: {}, latched: [STORED_STOP], cleared: [] }));
  /** getItem throws for the first `n` calls, then works. */
  const failFirstReads = (n: number) => {
    let left = n;
    Storage.prototype.getItem = function (this: Storage, k: string) { if (left-- > 0) throw new Error('blocked'); return origGet.call(this, k); };
  };
  const stopShown = () => {
    expect(screen.queryByTestId('gd-latched-stop')?.textContent).toMatch(/TEST stored STOP/);
    expect(screen.queryByTestId('gd-stop-hold')).not.toBeNull();
    expect(hold()).toBeNull();
    expect(screen.queryByText('Next check')).toBeNull();
    expect(document.body.textContent).toMatch(/no checks are suggested while a STOP applies/);
  };

  it('first read fails once, the next read works: the stored latched STOP is shown at once and wins', () => {
    storeStop();
    failFirstReads(1);
    render(<GuidedDiagnosisPanel />);
    stopShown();
    // It stays in storage too.
    expect(JSON.parse(origGet.call(localStorage, GD_STORE) || '{}').latched.map((l: { key: string }) => l.key)).toContain(STORED_STOP.key);
  });

  it('reads fail at load and on the first save, then work: the acknowledgement re-reads first and the STOP wins (no actions)', () => {
    storeStop();
    failFirstReads(2);
    render(<GuidedDiagnosisPanel />);
    expect(hold()).not.toBeNull();
    // A save made while the record could not be read must not overwrite (drop) the stored STOP.
    expect(JSON.parse(origGet.call(localStorage, GD_STORE) || '{}').latched.map((l: { key: string }) => l.key)).toContain(STORED_STOP.key);
    acknowledge('TECH-Q');
    stopShown();
    expect(screen.queryByTestId('gd-safety-hold-released')?.textContent ?? '').not.toMatch(/Next check/);
  });

  it('while in the hold, a retry merges the stored STOP as soon as it can be read (no acknowledgement needed)', () => {
    vi.useFakeTimers();
    try {
      storeStop();
      failFirstReads(2);
      render(<GuidedDiagnosisPanel />);
      expect(hold()).not.toBeNull();
      act(() => { vi.advanceTimersByTime(2100); });
      stopShown();
    } finally { vi.useRealTimers(); }
  });

  it('while in the hold, a focus event merges the stored STOP', () => {
    storeStop();
    failFirstReads(2);
    render(<GuidedDiagnosisPanel />);
    expect(hold()).not.toBeNull();
    act(() => { window.dispatchEvent(new Event('focus')); });
    stopShown();
  });

  it('storage stays blocked: a retry or focus changes nothing and never raises a STOP', () => {
    vi.useFakeTimers();
    try {
      block('both');
      render(<GuidedDiagnosisPanel />);
      act(() => { vi.advanceTimersByTime(6100); window.dispatchEvent(new Event('focus')); });
      expect(hold()).not.toBeNull();
      expect(screen.queryByTestId('gd-latched-stop')).toBeNull();
      expect(screen.queryByTestId('gd-stop-hold')).toBeNull();
    } finally { vi.useRealTimers(); }
  });

  it('storage available: no hold, normal screen (unchanged)', () => {
    render(<GuidedDiagnosisPanel />);
    expect(hold()).toBeNull();
    expect(screen.queryByTestId('gd-storage-blocked')).toBeNull();
    expect(screen.getByText('Next check')).not.toBeNull();
  });

  it('an unreadable or altered stored record is still a STOP, not a safety hold (unchanged)', () => {
    localStorage.setItem(GD_STORE, '{not json');
    render(<GuidedDiagnosisPanel />);
    expect(screen.queryByTestId('gd-latched-stop')?.textContent).toMatch(/could not be read or was altered/);
    expect(screen.queryByTestId('gd-stop-hold')).not.toBeNull();
    expect(hold()).toBeNull();
  });
});
