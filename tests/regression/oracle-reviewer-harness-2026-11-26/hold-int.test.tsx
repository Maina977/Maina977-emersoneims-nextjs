/**
 * Re-review of the Guided Diagnosis SAFETY HOLD, 04f2aa0f (delta 4c2a6ee5..04f2aa0f; baseline still 5ea296ee).
 * NEW = worktree panel (4c2a6ee5). BASE = verbatim 5ea296ee panel (../../prod/GuidedDiagnosisPanel.5ea296ee.tsx).
 * "REMAINING:" tests assert a demonstrated gap.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, fireEvent, cleanup, act } from '@testing-library/react';
import { Profiler } from 'react';
import NewPanel, { GD_STORE, SAFETY_HOLD_TEXT, SAFETY_HOLD_WHY } from '@/components/generator-oracle/panels/GuidedDiagnosisPanel';
import { FAMILIES } from '@/lib/generator-oracle/diagnostics/families';
import type { FaultFamily } from '@/lib/generator-oracle/diagnostics/types';

const SPEC = "SAFETY HOLD — Previous diagnostic safety status cannot be verified. Do not continue guided operational checks until the machine's condition has been reassessed by a qualified technician.";
beforeEach(() => { localStorage.clear(); vi.restoreAllMocks(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); localStorage.clear(); });

const F = (id: string) => FAMILIES.find((f) => f.id === id)!;
const knock = F('knock-seizure'), oh = F('overheating'), lop = F('low-oil-pressure');
const tab = (c: HTMLElement, f: FaultFamily) => fireEvent.click([...c.querySelectorAll('[role="tab"]')].find((b) => b.textContent === f.title)!);
const setA = (c: HTMLElement, id: string, v: string) => { const els = c.querySelectorAll(`[id="gd-${id.startsWith('screen.') ? 'screen' : 'all'}-${id.replace(/\./g, '-')}"]`); if (!els.length) throw new Error('no input for ' + id); fireEvent.change(els[els.length - 1], { target: { value: v } }); };
const hold = (c: HTMLElement) => !!c.querySelector('[data-testid="gd-safety-hold"]');
const stopHold = (c: HTMLElement) => !!c.querySelector('[data-testid="gd-stop-hold"]');
const nextShown = (c: HTMLElement) => (c.textContent ?? '').includes('Next check');
const ALL_ACTIONS = FAMILIES.flatMap((f) => f.causes.flatMap((x) => x.actions));
const actionsShown = (c: HTMLElement) => ALL_ACTIONS.filter((a) => (c.textContent ?? '').includes(a));
function ack(c: HTMLElement, by: string, tick: boolean) {
  const box = c.querySelector('[data-testid="gd-safety-hold-ack"]') as HTMLElement;
  const cb = box.querySelector('input[type="checkbox"]') as HTMLInputElement;
  if (cb.checked !== tick) fireEvent.click(cb);
  fireEvent.change(box.querySelector('input:not([type="checkbox"])')!, { target: { value: by } });
  fireEvent.click([...box.querySelectorAll('button')].find((b) => /Record reassessment/.test(b.textContent ?? ''))!);
  return box.textContent ?? '';
}
const blockGet = () => vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new DOMException('blocked', 'SecurityError'); });
const blockSet = () => vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('full', 'QuotaExceededError'); });
/** Puts the set in a state where the base panel would show actions: overheating radiator blocked + overload. */
const answerNonStop = (c: HTMLElement) => { tab(c, oh); setA(c, 'radiator', 'blocked'); setA(c, 'loadPct', '120'); };

describe('H1 wording and behaviour when storage is blocked', () => {
  for (const [name, block] of [['getItem+setItem throw', () => { blockGet(); blockSet(); }], ['getItem throws only', blockGet], ['setItem throws only (quota)', blockSet]] as const) {
    it(`${name}: exact SAFETY HOLD text + why; no Next check, no actions; not a STOP`, () => {
      block();
      const { container: c } = render(<NewPanel />);
      answerNonStop(c);
      expect(hold(c)).toBe(true);
      expect(SAFETY_HOLD_TEXT).toBe(SPEC);
      expect(c.querySelector('[data-testid="gd-safety-hold"]')!.textContent).toContain(SPEC);
      expect(c.textContent).toContain(SAFETY_HOLD_WHY);
      expect(nextShown(c)).toBe(false);
      expect(actionsShown(c)).toEqual([]);
      expect(stopHold(c)).toBe(false);
      expect(c.querySelector('[data-testid="gd-latched-stop"]')).toBeNull();
      // Not worded as a STOP or a machine fault: no STOP heading/label; the only mention of STOP is the explanation
      // that an EARLIER STOP cannot be ruled out, and the text says it is not a fault found on the machine.
      const t = c.querySelector('[data-testid="gd-safety-hold"]')!.textContent ?? '';
      expect(t).not.toMatch(/STOP:|STOP —|STOP THE|^STOP/);
      expect(t).toContain('not a fault found on the machine');
      expect([...t.matchAll(/STOP/g)].length).toBe(1);
      expect(c.querySelector('[data-testid="gd-hold-questions-warning"]')).not.toBeNull();
    });
  }
});

describe('H2 acknowledgement', () => {
  it('refused without the checkbox or without a name; accepted with both; releases checks for this page session only; never written', () => {
    const setSpy = blockSet();
    const { container: c } = render(<NewPanel />);
    answerNonStop(c);
    expect(ack(c, 'JK', false)).toMatch(/confirm that a qualified technician/);
    expect(hold(c)).toBe(true);
    expect(ack(c, '   ', true)).toMatch(/enter the name or initials/);
    expect(hold(c)).toBe(true);
    ack(c, 'JK', true);
    expect(hold(c)).toBe(false);
    expect(nextShown(c) || actionsShown(c).length > 0).toBe(true);
    expect(c.querySelector('[data-testid="gd-safety-hold-released"]')!.textContent).toMatch(/UNVERIFIED, not stored/);
    const written = setSpy.mock.calls.map((x) => String(x[1])).join(' ');
    expect(written).not.toMatch(/JK|reassess|holdAck/);
    cleanup();
    expect(hold(render(<NewPanel />).container)).toBe(true); // reload: acknowledgement gone
  });
  it('acknowledgement, then a new STOP: the STOP wins (STOP hold, no actions)', () => {
    blockSet();
    const { container: c } = render(<NewPanel />);
    ack(c, 'JK', true);
    tab(c, knock); setA(c, 'where', 'engine');
    expect(stopHold(c)).toBe(true);
    expect(actionsShown(c)).toEqual([]);
    expect(nextShown(c)).toBe(false);
  });
  it('a real STOP before acknowledgement: STOP hold shown (not the safety hold), STOP text first', () => {
    blockSet();
    const { container: c } = render(<NewPanel />);
    tab(c, knock); setA(c, 'where', 'engine');
    expect(stopHold(c)).toBe(true);
    expect(hold(c)).toBe(false);
    expect(c.querySelector('[data-testid="gd-storage-warning"]')).not.toBeNull();
  });
});

describe('H3 partial and intermittent failures', () => {
  it('storage works at load, setItem starts failing mid-session (quota) → hold appears at once, checks withdrawn', () => {
    const { container: c } = render(<NewPanel />);
    answerNonStop(c);
    expect(hold(c)).toBe(false);
    expect(actionsShown(c).length).toBeGreaterThan(0);
    blockSet();
    setA(c, 'airflow', 'ok');
    expect(hold(c)).toBe(true);
    expect(actionsShown(c)).toEqual([]);
  });
  it('setItem fails then recovers: hold stays until acknowledged (no silent release)', () => {
    const spy = blockSet();
    const { container: c } = render(<NewPanel />);
    expect(hold(c)).toBe(true);
    spy.mockRestore();
    answerNonStop(c);
    expect(hold(c)).toBe(true);
  });
  it('REQUIRED: getItem fails ONCE at load (then works) with an unresolved STOP stored → the stored STOP is shown, not the hold; no checks', () => {
    let r = render(<NewPanel />); tab(r.container, knock); setA(r.container, 'where', 'engine'); setA(r.container, 'where', '');
    expect(stopHold(r.container)).toBe(true); cleanup();
    const real = Storage.prototype.getItem;
    let first = true;
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, k: string) { if (first) { first = false; throw new DOMException('transient', 'UnknownError'); } return real.call(this, k); });
    r = render(<NewPanel />);
    const c = r.container;
    console.log('H3-intermittent: safety hold =', hold(c), '| STOP hold =', stopHold(c), '| latched STOP shown =', !!c.querySelector('[data-testid="gd-latched-stop"]'));
    expect(stopHold(c)).toBe(true);
    expect(c.querySelector('[data-testid="gd-latched-stop"]')).not.toBeNull();
    answerNonStop(c);
    expect(actionsShown(c)).toEqual([]);
    expect(nextShown(c)).toBe(false);
  });
  it('getItem permanently blocked: a storage event cannot be read → hold stays (nothing readable)', () => {
    blockGet();
    const { container: c } = render(<NewPanel />);
    act(() => { window.dispatchEvent(new StorageEvent('storage', { key: GD_STORE })); });
    expect(hold(c)).toBe(true);
  });
});

describe('H4 initial "Checking this browser\'s safety record…" state', () => {
  it('server render (no effects): checks withheld, the checking text shown, no actions, no Next check', async () => {
    const { renderToString } = await import('react-dom/server');
    const html = renderToString(<NewPanel />);
    expect(html).toContain('Checking this browser');
    expect(html).not.toContain('Next check');
  });
});

// ── 04f2aa0f additional cases ────────────────────────────────────────────────
const seedStop = () => { const r = render(<NewPanel />); tab(r.container, knock); setA(r.container, 'where', 'engine'); setA(r.container, 'where', ''); cleanup(); return localStorage.getItem(GD_STORE)!; };
const failFirst = (n: number) => { const real = Storage.prototype.getItem; let k = 0; return vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, key: string) { if (k++ < n) throw new DOMException('transient', 'UnknownError'); return real.call(this, key); }); };

describe('N1 intermittent storage: read fails, write attempted, read succeeds later', () => {
  it('reads fail at mount AND at the first saves (write skipped), later retry read succeeds → stored STOP appears; stored record never overwritten', () => {
    vi.useFakeTimers();
    try {
      const before = seedStop();
      const real = Storage.prototype.getItem;
      let failing = true;
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, key: string) { if (failing) throw new DOMException('transient', 'UnknownError'); return real.call(this, key); });
      const setSpy = vi.spyOn(Storage.prototype, 'setItem');
      const { container: c } = render(<NewPanel />);
      answerNonStop(c);
      expect(hold(c)).toBe(true);
      expect(setSpy.mock.calls.filter((x) => x[0] === GD_STORE).length).toBe(0); // the safety record is never written while unreadable
      failing = false;
      act(() => { vi.advanceTimersByTime(2100); });
      console.log('N1: after retry → STOP hold =', stopHold(c), '| safety hold =', hold(c));
      expect(stopHold(c)).toBe(true);
      expect(actionsShown(c)).toEqual([]);
      const after = JSON.parse(real.call(localStorage, GD_STORE)!);
      expect(after.latched.length).toBeGreaterThanOrEqual(JSON.parse(before).latched.length);
    } finally { vi.useRealTimers(); }
  });
  it('reads refused but saves working (developer-found defect): answering never writes an empty STOP list over the stored STOP', () => {
    seedStop();
    const real = Storage.prototype.getItem;
    blockGet();
    const { container: c } = render(<NewPanel />);
    answerNonStop(c); tab(c, lop); setA(c, 'oilLevel', 'ok');
    const stored = JSON.parse(real.call(localStorage, GD_STORE)!);
    expect(stored.latched.length).toBe(1);
  });
  it('acknowledgement re-reads first: read recovers just before the acknowledgement → stored STOP shown instead of releasing checks', () => {
    seedStop();
    const real = Storage.prototype.getItem;
    let failing = true;
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, key: string) { if (failing) throw new DOMException('t', 'UnknownError'); return real.call(this, key); });
    const { container: c } = render(<NewPanel />);
    expect(hold(c)).toBe(true);
    failing = false;
    ack(c, 'JK', true);
    expect(stopHold(c)).toBe(true);
    answerNonStop(c);
    expect(actionsShown(c)).toEqual([]);
  });
  it('storage.clear() in another window (storage event with key null) never removes the STOP on this page', () => {
    const { container: c } = render(<NewPanel />);
    tab(c, knock); setA(c, 'where', 'engine'); setA(c, 'where', '');
    localStorage.clear();
    act(() => { window.dispatchEvent(new StorageEvent('storage', { key: null })); });
    expect(stopHold(c)).toBe(true);
  });
});

describe('N2 quota error on setItem only', () => {
  it('stored STOP is still read and shown (the STOP wins over the hold)', () => {
    seedStop();
    blockSet();
    const { container: c } = render(<NewPanel />);
    expect(stopHold(c)).toBe(true);
    expect(c.querySelector('[data-testid="gd-storage-warning"]')).not.toBeNull();
  });
  it('no stored STOP: hold; acknowledgement releases; acknowledgement never written', () => {
    const setSpy = blockSet();
    const { container: c } = render(<NewPanel />);
    expect(hold(c)).toBe(true);
    ack(c, 'JK', true);
    expect(hold(c)).toBe(false);
    expect(setSpy.mock.calls.map((x) => String(x[1])).join(' ')).not.toMatch(/JK/);
  });
});

describe('N3 storage event from another window while this page is on hold', () => {
  it('setItem blocked here (hold); another window writes a STOP → event → STOP shown here', () => {
    blockSet();
    const { container: c } = render(<NewPanel />);
    expect(hold(c)).toBe(true);
    vi.restoreAllMocks();
    const other = { v: 2, raw: { 'knock-seizure': { where: 'engine' } }, latched: [{ key: 'knock-seizure|X', message: 'STOP from the other window', from: 'Knocking, bearing noise or seizure', since: '2026-11-25T10:00:00.000Z' }], cleared: [] };
    localStorage.setItem(GD_STORE, JSON.stringify(other));
    act(() => { window.dispatchEvent(new StorageEvent('storage', { key: GD_STORE })); });
    expect(stopHold(c)).toBe(true);
    expect(c.textContent).toContain('STOP from the other window');
  });
  it('first read refused, then another window writes a STOP → event → STOP shown (listener registered after a refused first read)', () => {
    failFirst(1);
    const { container: c } = render(<NewPanel />);
    const other = { v: 2, raw: {}, latched: [{ key: 'overheating|Y', message: 'STOP Y from the other window', from: 'Overheating', since: '2026-11-25T10:00:00.000Z' }], cleared: [] };
    Storage.prototype.setItem.call(localStorage, GD_STORE, JSON.stringify(other));
    act(() => { window.dispatchEvent(new StorageEvent('storage', { key: GD_STORE })); });
    expect(c.textContent).toContain('STOP Y from the other window');
  });
});

describe('N4 2 s retry: no re-render loop, no CPU spin', () => {
  for (const [name, setup] of [['getItem blocked permanently', () => blockGet()], ['setItem quota only', () => blockSet()]] as const) {
    it(`${name}: 60 s of retries → a read every 2 s, zero React commits after settling, one interval only`, () => {
      vi.useFakeTimers();
      try {
        setup();
        const getSpy = vi.isMockFunction(Storage.prototype.getItem) ? (Storage.prototype.getItem as unknown as ReturnType<typeof vi.fn>) : vi.spyOn(Storage.prototype, 'getItem');
        const intervalSpy = vi.spyOn(globalThis, 'setInterval');
        let commits = 0;
        const { container: c } = render(<Profiler id="p" onRender={() => { commits++; }}><NewPanel /></Profiler>);
        answerNonStop(c);
        act(() => { vi.advanceTimersByTime(1000); });
        const commitsBefore = commits;
        const readsBefore = getSpy.mock.calls.length;
        act(() => { vi.advanceTimersByTime(60000); });
        const reads = getSpy.mock.calls.length - readsBefore;
        const intervals = intervalSpy.mock.calls.filter((x) => x[1] === 2000).length;
        console.log(`N4 ${name}: commits during 60 s = ${commits - commitsBefore}; reads = ${reads}; 2 s intervals started = ${intervals}; timers = ${vi.getTimerCount()}`);
        expect(commits - commitsBefore).toBe(0);
        expect(reads).toBeGreaterThanOrEqual(29);
        expect(reads).toBeLessThanOrEqual(31);
        expect(intervals).toBeLessThanOrEqual(1);
        expect(vi.getTimerCount()).toBeLessThanOrEqual(2);
      } finally { vi.useRealTimers(); }
    });
  }
  it('working storage: no 2 s interval at all', () => {
    vi.useFakeTimers();
    try {
      const intervalSpy = vi.spyOn(globalThis, 'setInterval');
      render(<NewPanel />);
      act(() => { vi.advanceTimersByTime(10000); });
      expect(intervalSpy.mock.calls.filter((x) => x[1] === 2000).length).toBe(0);
    } finally { vi.useRealTimers(); }
  });
  it('unmount clears the interval and the listeners', () => {
    vi.useFakeTimers();
    try {
      blockGet();
      const remSpy = vi.spyOn(window, 'removeEventListener');
      const r = render(<NewPanel />);
      expect(vi.getTimerCount()).toBeGreaterThanOrEqual(1);
      r.unmount();
      expect(remSpy.mock.calls.map((x) => x[0])).toEqual(expect.arrayContaining(['storage', 'focus']));
      expect(vi.getTimerCount()).toBe(0);
    } finally { vi.useRealTimers(); }
  });
});
