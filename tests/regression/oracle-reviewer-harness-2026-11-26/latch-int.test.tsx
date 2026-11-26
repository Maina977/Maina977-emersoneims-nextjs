/**
 * INTEGRATED 9ac4c650: latch harness v3.1 re-run (ids adapted to the 1.3.0 inputs; L8 byte comparison dropped: different UI) (delta be50ecd5..fa565ab1). L3d/L3f/L4 now assert the REQUIRED behaviour.
 * V3 = worktree panel at fa565ab1. V2 baseline = verbatim be50ecd5 panel (../../prod/GuidedDiagnosisPanel.v2.tsx);
 * the diagnostics library is unchanged between the two commits.
 * "REMAINING:" tests assert an actual gap (pass = gap demonstrated).
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, fireEvent, cleanup, act } from '@testing-library/react';
import V3Panel, { GD_STORE, CLEARANCE_NOT_RESTART } from '@/components/generator-oracle/panels/GuidedDiagnosisPanel';
import { FAMILIES } from '@/lib/generator-oracle/diagnostics/families';
import type { FaultFamily } from '@/lib/generator-oracle/diagnostics/types';

beforeEach(() => { localStorage.clear(); vi.restoreAllMocks(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); localStorage.clear(); });

const F = (id: string) => FAMILIES.find((f) => f.id === id)!;
const knock = F('knock-seizure'), lop = F('low-oil-pressure'), oh = F('overheating');
const tab = (c: HTMLElement, f: FaultFamily) => fireEvent.click([...c.querySelectorAll('[role="tab"]')].find((b) => b.textContent === f.title)!);
const setA = (c: HTMLElement, id: string, v: string) => { const els = c.querySelectorAll(`[id="gd-${id.startsWith('screen.') ? 'screen' : 'all'}-${id.replace(/\./g, '-')}"]`); if (!els.length) throw new Error('no input for ' + id); fireEvent.change(els[els.length - 1], { target: { value: v } }); };
const hold = (c: HTMLElement) => !!c.querySelector('[data-testid="gd-stop-hold"]');
const latchedShown = (c: HTMLElement) => c.querySelectorAll('[data-testid="gd-latched-stop"]').length;
const clearAnswers = (c: HTMLElement) => fireEvent.click([...c.querySelectorAll('button')].find((b) => b.textContent === 'Clear answers')!);
const stored = () => JSON.parse(localStorage.getItem(GD_STORE) ?? 'null');
function clearance(c: HTMLElement, idx: number, by: string, why: string, tick: boolean) {
  const box = c.querySelectorAll('[data-testid="gd-clearance"]')[idx] as HTMLElement;
  fireEvent.change(box.querySelector('input:not([type="checkbox"])')!, { target: { value: by } });
  fireEvent.change(box.querySelector('textarea')!, { target: { value: why } });
  const cb = box.querySelector('input[type="checkbox"]') as HTMLInputElement;
  if (tick !== cb.checked) fireEvent.click(cb);
  fireEvent.click([...box.querySelectorAll('button')].find((b) => b.textContent === 'Record STOP clearance')!);
  return box.textContent ?? '';
}
const knockStop = () => { const r = render(<V3Panel />); tab(r.container, knock); setA(r.container, 'where', 'engine'); return r; };

describe('L1 latch survives navigation, reload, clearing answers, other families, a less severe fault', () => {
  it('reload (remount), tab switch, clear answers, answering another family, changing answer to "no fault"', () => {
    const a = knockStop();
    expect(hold(a.container)).toBe(true);
    setA(a.container, 'where', ''); // answer removed
    expect(hold(a.container)).toBe(true);
    expect(latchedShown(a.container)).toBe(1);
    clearAnswers(a.container);
    tab(a.container, oh); setA(a.container, 'coolantLevel', 'low'); // a less severe CAUTION elsewhere
    expect(hold(a.container)).toBe(true);
    cleanup();
    const b = render(<V3Panel />); // reload
    expect(hold(b.container)).toBe(true);
    expect(b.container.textContent).toContain('STOP (still active until a clearance is recorded)');
    for (const f of FAMILIES) { tab(b.container, f); expect(hold(b.container), f.id).toBe(true); }
  });
});

describe('L2 clearance', () => {
  it('refused while the condition is still entered; refused without name / reason ≥10 / confirmation; accepted otherwise; UNVERIFIED + not-restart text shown', () => {
    const { container: c } = knockStop();
    expect(clearance(c, 0, 'JK', 'Bearing replaced and checked', true)).toMatch(/still show this condition/);
    expect(hold(c)).toBe(true);
    setA(c, 'where', '');
    expect(clearance(c, 0, '', 'Bearing replaced and checked', true)).toMatch(/enter the name or initials/);
    expect(clearance(c, 0, 'JK', 'short', true)).toMatch(/at least 10 characters/);
    expect(clearance(c, 0, 'JK', 'Bearing replaced and checked', false)).toMatch(/confirm that the required checks/);
    expect(c.textContent).toContain(CLEARANCE_NOT_RESTART);
    clearance(c, 0, 'JK', 'Bearing replaced and checked', true);
    expect(hold(c)).toBe(false);
    expect(c.textContent).toMatch(/UNVERIFIED · .* recorded by JK \(not authenticated\)/);
    cleanup();
    const b = render(<V3Panel />);
    expect(hold(b.container)).toBe(false); // clearance persists
    tab(b.container, knock); setA(b.container, 'where', 'top'); // condition re-entered
    expect(hold(b.container)).toBe(true);
  });
  it('a clearance for one STOP does not clear another STOP of the same family raised later', () => {
    const { container: c } = render(<V3Panel />);
    tab(c, lop); setA(c, 'knock', 'yes'); setA(c, 'knock', ''); clearance(c, 0, 'JK', 'Checked bearings, fine', true);
    expect(hold(c)).toBe(false);
    setA(c, 'oilLevel', 'low');
    expect(hold(c)).toBe(true);
  });
});

describe('L3 tampering / corruption of the stored record', () => {
  const seed = () => { const r = knockStop(); cleanup(); return stored(); };
  it('a: "latched" deleted → UNREADABLE STOP', () => {
    const s = seed(); delete s.latched; localStorage.setItem(GD_STORE, JSON.stringify(s));
    const { container: c } = render(<V3Panel />);
    expect(hold(c)).toBe(true);
    expect(c.textContent).toContain('could not be read or was altered');
  });
  it('b: garbage JSON, v:3, latched not an array, latched entry missing "since" → UNREADABLE STOP', () => {
    for (const bad of ['{not json', JSON.stringify({ v: 3, raw: {}, latched: [], cleared: [] }), JSON.stringify({ v: 2, raw: {}, latched: {}, cleared: [] }), JSON.stringify({ v: 2, raw: {}, latched: [{ key: 'k', message: 'm', from: 'f' }], cleared: [] })]) {
      localStorage.setItem(GD_STORE, bad);
      const { container: c } = render(<V3Panel />);
      expect(hold(c), bad).toBe(true);
      cleanup();
    }
  });
  it('c: injected clearance for the STOP with a DIFFERENT since → STOP stays', () => {
    const s = seed(); const l = s.latched[0];
    s.cleared = [{ ...l, since: '2000-01-01T00:00:00.000Z', clearedAt: '2026-11-25T10:00:00.000Z', by: 'X', reason: 'fake clearance text' }];
    localStorage.setItem(GD_STORE, JSON.stringify(s));
    const { container: c } = render(<V3Panel />);
    expect(hold(c)).toBe(true);
  });
  it('d: v:1 with a fake cleared entry matching key+since but no clearedAt → REQUIRED: unreadable → STOP shown, no crash', () => {
    const s = seed(); const l = s.latched[0];
    localStorage.setItem(GD_STORE, JSON.stringify({ v: 1, raw: s.raw, latched: s.latched, cleared: [{ ...l }] }));
    let threw: unknown = null; let c: HTMLElement | null = null;
    try { c = render(<V3Panel />).container; } catch (e) { threw = e; }
    expect(threw).toBeNull();
    expect(hold(c!)).toBe(true);
    expect(c!.textContent).toContain('could not be read or was altered');
  });
  it('d1: legitimate 4048a634-era v:1 record (clearance with clearedAt + by, no reason) still reads; clearance honoured', () => {
    const s = seed(); const l = s.latched[0];
    localStorage.setItem(GD_STORE, JSON.stringify({ v: 1, raw: {}, latched: [], cleared: [{ ...l, clearedAt: '2026-11-25T10:00:00.000Z', by: 'JK' }] }));
    const { container: c } = render(<V3Panel />);
    expect(hold(c)).toBe(false);
    expect(c.textContent).toContain('reason: (not recorded)');
  });
  it('d3: other malformed clearance / raw shapes → unreadable STOP, never a crash', () => {
    const s = seed(); const l = s.latched[0];
    const bad = [
      { v: 2, raw: s.raw, latched: s.latched, cleared: [{ ...l, clearedAt: '2026-11-25T10:00:00.000Z', by: 'X', reason: 5 }] },
      { v: 2, raw: s.raw, latched: s.latched, cleared: [{ ...l, clearedAt: '', by: 'X', reason: 'r' }] },
      { v: 2, raw: s.raw, latched: s.latched, cleared: [null] },
      { v: 2, raw: { 'knock-seizure': null }, latched: [], cleared: [] },
      { v: 2, raw: { 'knock-seizure': 'engine' }, latched: [], cleared: [] },
      { v: 2, raw: { 'knock-seizure': ['engine'] }, latched: [], cleared: [] },
      { v: 2, raw: [], latched: [], cleared: [] },
      { v: 2, raw: { 'knock-seizure': { where: null } }, latched: [], cleared: [] },
      { v: 2, raw: { 'knock-seizure': { where: { x: 1 } } }, latched: [], cleared: [] },
      { v: 2, raw: {}, latched: [{ ...l, since: 5 }], cleared: [] },
      { v: 2, raw: {}, latched: [{ ...l, message: '' }], cleared: [] },
    ];
    for (const b of bad) {
      localStorage.setItem(GD_STORE, JSON.stringify(b));
      let threw: unknown = null; let c: HTMLElement | null = null;
      try { c = render(<V3Panel />).container; } catch (e) { threw = e; }
      expect(threw, JSON.stringify(b)).toBeNull();
      expect(hold(c!), JSON.stringify(b)).toBe(true);
      cleanup();
    }
  });
  it('d2: v:1 fake clearance WITH clearedAt matching key+since → latch dropped, but raw still holds the answer → re-latched (new since)', () => {
    const s = seed(); const l = s.latched[0];
    localStorage.setItem(GD_STORE, JSON.stringify({ v: 1, raw: s.raw, latched: s.latched, cleared: [{ ...l, clearedAt: '2026-11-25T10:00:00.000Z', by: 'X' }] }));
    const { container: c } = render(<V3Panel />);
    expect(hold(c)).toBe(true);
  });
  it('e: REMAINING inherent: a forged VALID empty record (or removeItem / cleared site data) → no STOP and no notice', () => {
    seed();
    localStorage.setItem(GD_STORE, JSON.stringify({ v: 2, raw: {}, latched: [], cleared: [] }));
    let r = render(<V3Panel />); expect(hold(r.container)).toBe(false); cleanup();
    localStorage.removeItem(GD_STORE);
    r = render(<V3Panel />); expect(hold(r.container)).toBe(false);
  });
  it('f: non-string answer value in raw (e.g. where: 5) → REQUIRED: unreadable → STOP shown, no crash', () => {
    const s = seed(); s.raw['knock-seizure'] = { where: 5 };
    localStorage.setItem(GD_STORE, JSON.stringify(s));
    let threw: unknown = null; let c: HTMLElement | null = null;
    try { c = render(<V3Panel />).container; } catch (e) { threw = e; }
    expect(threw).toBeNull();
    expect(hold(c!)).toBe(true);
    expect(c!.textContent).toContain('could not be read or was altered');
  });
});

describe('L4 storage unavailable / throwing', () => {
  it('getItem throws (superseded by the SAFETY HOLD since 04f2aa0f): hold shown with no STOP; under a STOP the in-hold storage notice is shown', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    const { container: c } = render(<V3Panel />);
    expect(hold(c)).toBe(false);
    expect(c.querySelector('[data-testid="gd-safety-hold"]')).not.toBeNull();
    tab(c, knock); setA(c, 'where', 'engine');
    expect(hold(c)).toBe(true);
    expect(c.querySelector('[data-testid="gd-storage-warning"]')).not.toBeNull();
  });
  it('setItem only throws, no STOP yet: SAFETY HOLD after the first failed write', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('full', 'QuotaExceededError'); });
    const { container: c } = render(<V3Panel />);
    tab(c, oh); setA(c, 'coolantLevel', 'ok');
    expect(hold(c)).toBe(false);
    expect(c.querySelector('[data-testid="gd-safety-hold"]')).not.toBeNull();
  });
  it('setItem only throws (quota): notice shown under a STOP; after reload the STOP is gone (cannot be kept) — the notice said so', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('full', 'QuotaExceededError'); });
    const a = knockStop();
    expect(a.container.querySelector('[data-testid="gd-storage-warning"]')).not.toBeNull();
    cleanup();
    const b = render(<V3Panel />);
    expect(hold(b.container)).toBe(false);
  });
});

describe('L5 two windows of the same page (shared localStorage + storage events)', () => {
  const fire = () => act(() => { window.dispatchEvent(new StorageEvent('storage', { key: GD_STORE })); });
  it('STOP in A reaches B; B writing its own answers never drops A\'s STOP; clearance in A releases B', () => {
    const A = render(<V3Panel />); const B = render(<V3Panel />);
    tab(A.container, knock); setA(A.container, 'where', 'engine');
    fire();
    expect(hold(B.container)).toBe(true);
    tab(B.container, oh); setA(B.container, 'coolantLevel', 'ok');
    expect(stored().latched.length).toBeGreaterThan(0);
    setA(A.container, 'where', ''); clearance(A.container, 0, 'JK', 'Inspected bearings OK', true);
    fire();
    expect(hold(A.container)).toBe(false);
    // Actual: B still holds its stale copy of A's answer (in-memory answers win over storage on read),
    // so B re-raises the STOP with a new 'since' and writes it; A then re-latches it too. Fails SAFE.
    expect(hold(B.container)).toBe(true);
    fire();
    expect(hold(A.container)).toBe(true);
    console.log('L5 stale-window re-latch: A held again after B write =', hold(A.container));
  });
  it('race without a storage event and A closed before re-writing → REMAINING: STOP lost from storage (A already closed)', () => {
    const A = render(<V3Panel />);
    tab(A.container, knock); setA(A.container, 'where', 'engine');
    const s = stored();
    A.unmount();
    localStorage.setItem(GD_STORE, JSON.stringify({ ...s, latched: [], raw: {} })); // B's stale write lands after A closed
    expect(hold(render(<V3Panel />).container)).toBe(false);
  });
});

describe('L6 many STOPs; L7 back/forward', () => {
  it('30 latched STOPs in storage are all shown, each with its own clearance form', () => {
    const latched = Array.from({ length: 30 }, (_, i) => ({ key: `knock-seizure|STOP ${i}`, message: `STOP ${i}`, from: 'Knocking', since: `2026-11-25T08:${String(i).padStart(2, '0')}:00.000Z` }));
    localStorage.setItem(GD_STORE, JSON.stringify({ v: 2, raw: {}, latched, cleared: [] }));
    const { container: c } = render(<V3Panel />);
    expect(latchedShown(c)).toBe(30);
    expect(c.querySelectorAll('[data-testid="gd-clearance"]').length).toBe(30);
  });
  it('back/forward = unmount + remount with the same storage: STOP kept', () => {
    knockStop(); cleanup();
    expect(hold(render(<V3Panel />).container)).toBe(true);
  });
});

