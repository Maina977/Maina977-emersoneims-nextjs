// @vitest-environment jsdom
/**
 * Independent review of the integrated Guided Diagnosis (ORACLE-INTEGRATED-PANEL-REVIEW.md, 9ac4c650):
 * R-INT-1 .. R-INT-5, fixed by mechanism. Includes the reviewer's tests (latched-body, latched-body2,
 * l5-race, integrated I2-I4), with every "REMAINING" assertion inverted to the required behaviour.
 * I1 (production 7ab700ce rule-by-rule comparison) needs the production library and stays in the
 * reviewer's harness. TEST values only.
 */
import { describe, it, expect, afterEach, beforeEach, beforeAll, vi } from 'vitest';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { render, fireEvent, cleanup, act, screen } from '@testing-library/react';
import Panel, { GD_STORE } from '@/components/generator-oracle/panels/GuidedDiagnosisPanel';
import ServiceManagementPanel from '@/components/generator-oracle/panels/ServiceManagementPanel';
import { FAMILIES } from '@/lib/generator-oracle/diagnostics/families';
import { sessionRecord } from '@/lib/generator-oracle/diagnostics/jobCardRecord';
import {
  SAFETY_HOLD_TEXT, guardedCardUpdate, guardedSessionRecord, readStore, safetyStateOf, type SafetyState,
} from '@/lib/generator-oracle/diagnostics/stopLatch';
import { SCREEN_BUCKET, SCREEN_QUESTIONS } from '@/lib/generator-oracle/diagnostics/safetyScreen';
import {
  LATCHED_STOP_PREFIX, READINGS_NOT_TAKEN_STOP, jobCardReport, mergeGuidedSafety, recordHoldReassessment, openJobCard, transition, cardContentHash,
  type Asset, type JobCard,
} from '@/lib/generator-oracle/service/maintenance';
import { jobCardToPdf } from '@/lib/generator-oracle/service/jobCardPdf';
import { deserialise, emptyState, reduce, serialise, STORE_KEY, type ServiceAction } from '@/lib/generator-oracle/service/store';
import type { FaultFamily } from '@/lib/generator-oracle/diagnostics/types';

type Pdfjs = typeof import('pdfjs-dist/legacy/build/pdf.mjs');
let pdfjs: Pdfjs;
beforeAll(async () => {
  pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')).href;
});
const pdfText = async (card: JobCard) => {
  const doc = await pdfjs.getDocument({ data: jobCardToPdf(card, asset).slice() }).promise;
  let t = '';
  for (let p = 1; p <= doc.numPages; p++) t += (await (await doc.getPage(p)).getTextContent()).items.map((i) => ('str' in i ? i.str : '')).join(' ') + ' ';
  return t.replace(/\s+/g, ' ');
};

beforeEach(() => { localStorage.clear(); vi.restoreAllMocks(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); localStorage.clear(); });

const F = (id: string) => FAMILIES.find((f) => f.id === id)!;
const tab = (c: HTMLElement, f: FaultFamily) => fireEvent.click([...c.querySelectorAll('[role="tab"]')].find((b) => b.textContent === f.title)!);
const inputOf = (c: HTMLElement, id: string) => { const els = c.querySelectorAll(`[id="gd-${id.startsWith('screen.') ? 'screen' : 'all'}-${id.replace(/\./g, '-')}"]`); if (!els.length) throw new Error('no input ' + id); return els[els.length - 1]; };
const setA = (c: HTMLElement, id: string, v: string) => fireEvent.change(inputOf(c, id), { target: { value: v } });
const stopHold = (c: HTMLElement) => !!c.querySelector('[data-testid="gd-stop-hold"]');
const ALL_ACTIONS = FAMILIES.flatMap((f) => f.causes.flatMap((x) => x.actions));
const RUNNING = FAMILIES.flatMap((f) => f.causes.flatMap((x) => x.runningChecks ?? []));
const asset: Asset = { id: 'A1', make: 'X', model: 'Y', engine: 'E', controller: 'C', serial: 'S', ratedKva: 100 };
const T = '2026-11-26T08:00:00.000Z';

/** Same steps as ServiceManagementPanel GuidedRecord: guarded record + structured safety (R-INT-1/2). */
function cardFromBrowser(famId: string, findings = '', session: Record<string, Record<string, string>> = {}, st: SafetyState = safetyStateOf(readStore())): JobCard {
  const g = guardedSessionRecord(F(famId), session, {}, st);
  const base = openJobCard({ id: 'JC1', assetId: 'A1', opened: '2026-11-26', reportedFault: 'x', technician: 'T' });
  return { ...base, ...guardedCardUpdate({ findings, readings: [] }, g), guidedSafety: mergeGuidedSafety(base.guidedSafety, g.safety, T) } as JobCard;
}
const complete = (card: JobCard, extra: Partial<JobCard> = {}) => {
  const p = transition(card, 'IN PROGRESS', 'T', T);
  return transition(p, 'COMPLETED', 'T', T, { tasks: ['inspected'], engineHoursAtJob: 10, readings: [], ...extra });
};
const latchKnockThenClear = () => { const { container: c } = render(<Panel />); tab(c, F('knock-seizure')); setA(c, 'where', 'engine'); setA(c, 'where', ''); return c; };
const nextQ = (f: FaultFamily, findings: string) => {
  const next = findings.split('\n').find((l) => l.startsWith('Next check'))!;
  return f.questions.find((x) => next.includes(x.text)) as { needsRunning?: boolean } | undefined;
};
const readings = [{ name: 'Oil pressure', value: 300, unit: 'kPa' }];

describe('R-INT-1: a record made under a latched STOP or the SAFETY HOLD carries no running step', () => {
  it('reviewer latched-body: charging record under a latched (answers-cleared) knock STOP has no running check and no running-only Next check', () => {
    const c = latchKnockThenClear();
    const ch = { chargeAlarm: 'yes', source: 'alternator', belt: 'ok', excitation: 'ok', terminals: 'clean' };
    tab(c, F('charging')); for (const [k, v] of Object.entries(ch)) setA(c, k, v);
    expect(stopHold(c)).toBe(true);
    cleanup();
    const card = cardFromBrowser('charging', '', { charging: ch });
    expect(card.findings.startsWith(LATCHED_STOP_PREFIX)).toBe(true);
    expect(RUNNING.filter((r) => card.findings.includes(r))).toEqual([]);
    expect(nextQ(F('charging'), card.findings)?.needsRunning).toBeFalsy();
    const txt = jobCardReport(card, asset);
    expect(RUNNING.filter((r) => txt.includes(r))).toEqual([]);
  });

  it('reviewer latched-body2: with the safety screen answered "No", every family\'s card under a latched knock STOP has no running-only Next check', () => {
    const { container: c } = render(<Panel />);
    const scr = Object.fromEntries(SCREEN_QUESTIONS.map((q) => [q.id, 'no']));
    for (const [k, v] of Object.entries(scr)) setA(c, k, v);
    tab(c, F('knock-seizure')); setA(c, 'where', 'engine'); setA(c, 'where', '');
    const st = safetyStateOf(readStore());
    for (const f of FAMILIES) {
      const card = cardFromBrowser(f.id, '', { [SCREEN_BUCKET]: scr }, st);
      expect(nextQ(f, card.findings)?.needsRunning, f.id).toBeFalsy();
      expect(card.findings, f.id).not.toMatch(/Next check: (Oil pressure measured|Frequency)/);
      for (const r of RUNNING) expect(card.findings, `${f.id}: ${r}`).not.toContain(r);
    }
  });

  it('the job-card screen (GuidedRecord) and the .txt download use the guarded record', async () => {
    latchKnockThenClear(); cleanup();
    const acts: ServiceAction[] = [
      { type: 'saveAsset', asset: { make: 'TEST', model: 'T-1', engine: 'E', controller: 'C', serial: 'S-1', ratedKva: 100 } },
      { type: 'openCard', card: { assetId: 'A-1', opened: '2026-11-26', reportedFault: 'TEST', technician: 'TECH-A' } },
    ];
    localStorage.setItem(STORE_KEY, serialise(acts.reduce(reduce, emptyState())));
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<ServiceManagementPanel />);
    await act(async () => {});
    fireEvent.click(screen.getByRole('button', { name: 'Job cards' }));
    fireEvent.click(screen.getByRole('button', { name: /JC-1/ }));
    fireEvent.change(screen.getByLabelText('Fault family'), { target: { value: 'low-oil-pressure' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add this diagnosis to the card' }));
    const findings = (screen.getByLabelText('Findings') as HTMLTextAreaElement).value;
    expect(findings).not.toMatch(/Next check: Oil pressure measured/);
    const stored = JSON.parse(localStorage.getItem(STORE_KEY)!).jobCards[0] as JobCard;
    expect(stored.guidedSafety?.stops.some((s) => s.key.startsWith('knock-seizure|'))).toBe(true);
    // Panel .txt download: same mechanism.
    cleanup();
    let blobText = '';
    const origBlob = globalThis.Blob;
    const origCreate = URL.createObjectURL;
    const origRevoke = URL.revokeObjectURL;
    // Capture the text the panel puts in the download.
    globalThis.Blob = class extends origBlob { constructor(parts: BlobPart[], o?: BlobPropertyBag) { super(parts, o); blobText = parts.map(String).join(''); } } as typeof Blob;
    URL.createObjectURL = (() => 'blob:x') as typeof URL.createObjectURL;
    URL.revokeObjectURL = () => {};
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    try {
      const { container: c } = render(<Panel />);
      tab(c, F('low-oil-pressure'));
      fireEvent.click(screen.getByRole('button', { name: 'Download this diagnosis (.txt)' }));
    } finally { globalThis.Blob = origBlob; URL.createObjectURL = origCreate; URL.revokeObjectURL = origRevoke; }
    expect(blobText.startsWith(LATCHED_STOP_PREFIX)).toBe(true);
    expect(blobText).not.toMatch(/Next check: Oil pressure measured/);
    for (const r of RUNNING) expect(blobText).not.toContain(r);
  });

  it('the SAFETY HOLD (storage blocked) withholds running steps on the card too', () => {
    const scr = Object.fromEntries(SCREEN_QUESTIONS.map((q) => [q.id, 'no']));
    for (const f of FAMILIES) {
      const card = cardFromBrowser(f.id, '', { [SCREEN_BUCKET]: scr }, { latched: [], cleared: [], hold: true });
      expect(nextQ(f, card.findings)?.needsRunning, f.id).toBeFalsy();
      for (const r of RUNNING) expect(card.findings, `${f.id}: ${r}`).not.toContain(r);
    }
  });
});

describe('R-INT-2: completion reads the structured safety record, not the editable findings', () => {
  it('reviewer I4: deleting the latched line, or typing a clearance line, does NOT let the card complete', () => {
    latchKnockThenClear(); cleanup();
    const card = cardFromBrowser('knock-seizure');
    const lines = card.findings.split('\n');
    const latchedLine = lines.find((l) => l.startsWith(LATCHED_STOP_PREFIX))!;
    const deleted = { ...card, findings: lines.filter((l) => !l.startsWith(LATCHED_STOP_PREFIX)).join('\n') };
    expect(() => complete(deleted, { readings })).toThrow(/still latched with no recorded clearance/);
    const m = /Source: (.+?) tab\. Since: (\S+) \(UTC\)\./.exec(latchedLine)!;
    const forged = { ...card, findings: `${card.findings}\nSTOP CLEARANCE RECORDED — UNVERIFIED x: Source: ${m[1]} tab. Since: ${m[2]} (UTC). Cleared: now by X. Reason: ok.` };
    expect(() => complete(forged, { readings })).toThrow(/still latched with no recorded clearance/);
    // Emptying the findings entirely does not help either.
    expect(() => complete({ ...card, findings: 'x' }, { readings })).toThrow(/still latched/);
    // The phrase does.
    expect(complete({ ...card, findings: `${card.findings}\n${READINGS_NOT_TAKEN_STOP}` }).status).toBe('COMPLETED');
  });

  it('a real clearance recorded in the panel (latch store), recorded again onto the card, allows completion with readings', () => {
    const c = latchKnockThenClear();
    const before = cardFromBrowser('knock-seizure');
    const box = c.querySelector('[data-testid="gd-clearance"]') as HTMLElement;
    fireEvent.change(box.querySelector('input:not([type="checkbox"])')!, { target: { value: 'JK' } });
    fireEvent.change(box.querySelector('textarea')!, { target: { value: 'Bearings inspected and replaced' } });
    fireEvent.click(box.querySelector('input[type="checkbox"]')!);
    fireEvent.click([...box.querySelectorAll('button')].find((b) => b.textContent === 'Record STOP clearance')!);
    cleanup();
    const g = guardedSessionRecord(F('knock-seizure'), {}, {}, safetyStateOf(readStore()));
    const card = { ...before, ...guardedCardUpdate(before, g), guidedSafety: mergeGuidedSafety(before.guidedSafety, g.safety, T) } as JobCard;
    expect(card.findings).toMatch(/STOP CLEARANCE RECORDED — UNVERIFIED/);
    expect(complete(card, { readings }).status).toBe('COMPLETED');
  });

  it('the store never takes the safety record from a card edit, only merges it; it is validated on read and signed', () => {
    let s = [
      { type: 'saveAsset', asset: { make: 'T', model: 'T', engine: 'E', controller: 'C', serial: 'S', ratedKva: 1 } },
      { type: 'openCard', card: { assetId: 'A-1', opened: '2026-11-26', reportedFault: 'x', technician: 'T' } },
    ].reduce((a, x) => reduce(a, x as ServiceAction), emptyState());
    const stop = { key: 'knock-seizure|m', from: 'Knocking', since: T, message: 'm' };
    s = reduce(s, { type: 'recordGuidedSafety', cardId: 'JC-1', at: T, safety: { stops: [stop], clearances: [], hold: null } });
    s = reduce(s, { type: 'updateCard', cardId: 'JC-1', update: { findings: 'edited', guidedSafety: { stops: [], clearances: [], holds: [] } } as never });
    expect(s.jobCards[0].guidedSafety?.stops).toHaveLength(1);
    s = reduce(s, { type: 'recordGuidedSafety', cardId: 'JC-1', at: T, safety: { stops: [], clearances: [], hold: null } });
    expect(s.jobCards[0].guidedSafety?.stops).toHaveLength(1);
    const back = deserialise(serialise(s));
    expect(back.ok && back.state.jobCards[0].guidedSafety?.stops[0].key).toBe('knock-seizure|m');
    const bad = JSON.parse(serialise(s)); bad.jobCards[0].guidedSafety = { stops: 'x' };
    expect(deserialise(JSON.stringify(bad)).ok).toBe(false);
    const c = s.jobCards[0];
    expect(cardContentHash(c, 'S', T)).not.toBe(cardContentHash({ ...c, guidedSafety: undefined }, 'S', T));
  });
});

describe('R-INT-3: the SAFETY HOLD is recorded as a hold, and blocks completion', () => {
  it('reviewer I4 (wording): storage blocked → "SAFETY HOLD" heading, "before this SAFETY HOLD", never "SAFETY — STOP"; completion blocked', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new DOMException('blocked', 'SecurityError'); });
    const card = cardFromBrowser('overheating', 'Earlier note.');
    vi.restoreAllMocks();
    const txt = jobCardReport(card, asset);
    expect(txt).toMatch(/SAFETY HOLD — previous diagnostic safety status could not be verified/);
    expect(txt.indexOf(SAFETY_HOLD_TEXT)).toBeLessThan(txt.indexOf('\nASSET\n'));
    expect(txt).not.toContain('SAFETY — STOP');
    expect(card.findings).toMatch(/NOTE: The findings below were recorded before this SAFETY HOLD/);
    expect(card.findings).not.toMatch(/recorded before this STOP/);
    expect(card.findings).not.toContain(`STOP: ${SAFETY_HOLD_TEXT}`);
    expect(() => complete(card, { readings: [{ name: 'Coolant', value: 80, unit: '°C' }] })).toThrow(/SAFETY HOLD is recorded on this card/);
    expect(complete({ ...card, findings: `${card.findings}\n${READINGS_NOT_TAKEN_STOP}` }).status).toBe('COMPLETED');
    // R-INT-7: a later record made with a readable safety record does NOT resolve the hold.
    const later = { ...card, guidedSafety: mergeGuidedSafety(card.guidedSafety, { stops: [], clearances: [], hold: null }, '2026-11-26T09:00:00.000Z') };
    expect(() => complete(later, { readings: [{ name: 'Coolant', value: 80, unit: '°C' }] })).toThrow(/SAFETY HOLD is recorded on this card/);
    // Only an in-person reassessment recorded on the card (name, reason >= 10 characters, confirmation) does.
    expect(() => recordHoldReassessment(card.guidedSafety, { at: T, by: 'JK', reason: 'short', confirmed: true })).toThrow(/at least 10 characters/);
    expect(() => recordHoldReassessment(card.guidedSafety, { at: T, by: '', reason: 'Inspected the set in person', confirmed: true })).toThrow(/name or initials/);
    expect(() => recordHoldReassessment(card.guidedSafety, { at: T, by: 'JK', reason: 'Inspected the set in person', confirmed: false })).toThrow(/confirm/);
    const reassessed = { ...card, guidedSafety: recordHoldReassessment(card.guidedSafety, { at: T, by: 'JK', reason: 'Inspected the set in person', confirmed: true }) };
    expect(reassessed.guidedSafety.holds[0].resolvedAt).toBe(T);
    expect(reassessed.guidedSafety.holds).toHaveLength(1);
    expect(jobCardReport(reassessed, asset)).toMatch(/Reassessment recorded .* by JK \(typed name, UNVERIFIED\): Inspected the set in person/);
    expect(complete(reassessed, { readings: [{ name: 'Coolant', value: 80, unit: '°C' }] }).status).toBe('COMPLETED');
    expect(cardContentHash(reassessed, 'S', T)).not.toBe(cardContentHash(card, 'S', T));
    expect((await pdfText(card)).indexOf('SAFETY HOLD')).toBeLessThan((await pdfText(card)).indexOf('ASSET'));
  });
});

describe('R-INT-4: a reading latches from the committed value, not each keystroke', () => {
  it('typing 160 against a 150 kPa minimum latches nothing; the STOP shows live while "16" is typed', () => {
    const { container: c } = render(<Panel />);
    tab(c, F('low-oil-pressure')); setA(c, 'oemMinOilPressure', '150'); fireEvent.blur(inputOf(c, 'oemMinOilPressure'));
    setA(c, 'oilPressure', '1');
    expect(stopHold(c)).toBe(true); // shown live
    setA(c, 'oilPressure', '16');
    setA(c, 'oilPressure', '160');
    fireEvent.blur(inputOf(c, 'oilPressure'));
    expect(JSON.parse(localStorage.getItem(GD_STORE)!).latched).toEqual([]);
    expect(stopHold(c)).toBe(false);
  });
  it('a committed value at the limit (equality) latches exactly as before: blur, Enter, or a pause', () => {
    vi.useFakeTimers();
    try {
      for (const how of ['blur', 'enter', 'pause'] as const) {
        localStorage.clear();
        const { container: c } = render(<Panel />);
        tab(c, F('low-oil-pressure')); setA(c, 'oemMinOilPressure', '150'); fireEvent.blur(inputOf(c, 'oemMinOilPressure'));
        setA(c, 'oilPressure', '150');
        if (how === 'blur') fireEvent.blur(inputOf(c, 'oilPressure'));
        if (how === 'enter') fireEvent.keyDown(inputOf(c, 'oilPressure'), { key: 'Enter' });
        if (how === 'pause') act(() => { vi.advanceTimersByTime(900); });
        setA(c, 'oilPressure', '300');
        fireEvent.blur(inputOf(c, 'oilPressure'));
        expect(stopHold(c), how).toBe(true);
        expect(c.querySelector('[data-testid="gd-latched-stop"]'), how).not.toBeNull();
        cleanup();
      }
    } finally { vi.useRealTimers(); }
  });
  it('reviewer I2: coolant = limit → STOP hold on every tab; answer cleared → still latched (a tab change commits)', () => {
    const { container: c } = render(<Panel />);
    tab(c, F('overheating')); setA(c, 'oemAlarmCoolantTemp', '100'); setA(c, 'coolantTemp', '100');
    expect(stopHold(c)).toBe(true);
    for (const f of FAMILIES) { tab(c, f); expect(stopHold(c), f.id).toBe(true); expect(c.textContent).not.toContain('Next check'); }
    tab(c, F('overheating')); setA(c, 'coolantTemp', '');
    expect(stopHold(c)).toBe(true);
    expect(c.querySelector('[data-testid="gd-latched-stop"]')).not.toBeNull();
  });
});

describe('R-INT-5: another window\'s out-of-date write cannot drop a STOP', () => {
  it('reviewer l5-race: A latches, B writes a record without it, A writes it back; a reload still shows the STOP', () => {
    const A = render(<Panel />);
    tab(A.container, F('knock-seizure'));
    setA(A.container, 'where', 'engine');
    const s = JSON.parse(localStorage.getItem(GD_STORE)!);
    localStorage.setItem(GD_STORE, JSON.stringify({ ...s, latched: [], raw: {} }));
    act(() => { window.dispatchEvent(new StorageEvent('storage', { key: GD_STORE })); });
    expect(stopHold(A.container)).toBe(true);
    expect(JSON.parse(localStorage.getItem(GD_STORE)!).latched.length).toBeGreaterThan(0);
    cleanup();
    expect(stopHold(render(<Panel />).container)).toBe(true);
  });
  it('a dropped clearance is written back too', () => {
    const c = latchKnockThenClear();
    const box = c.querySelector('[data-testid="gd-clearance"]') as HTMLElement;
    fireEvent.change(box.querySelector('input:not([type="checkbox"])')!, { target: { value: 'JK' } });
    fireEvent.change(box.querySelector('textarea')!, { target: { value: 'Bearings inspected and replaced' } });
    fireEvent.click(box.querySelector('input[type="checkbox"]')!);
    fireEvent.click([...box.querySelectorAll('button')].find((b) => b.textContent === 'Record STOP clearance')!);
    const s = JSON.parse(localStorage.getItem(GD_STORE)!);
    localStorage.setItem(GD_STORE, JSON.stringify({ ...s, cleared: [] }));
    act(() => { window.dispatchEvent(new StorageEvent('storage', { key: GD_STORE })); });
    expect(JSON.parse(localStorage.getItem(GD_STORE)!).cleared.length).toBe(1);
  });
});

// Reviewer I3, unchanged: random sessions through the integrated panel.
let seed = 2611;
const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
const pick = <X,>(xs: X[]) => xs[Math.floor(rnd() * xs.length)];
const SPECIAL: Record<string, string[]> = { oilPressure: ['0', '149', '150', '151', '300'], oemMinOilPressure: ['150'], coolantTemp: ['99', '100', '101'], oemAlarmCoolantTemp: ['100'], insulation: ['0.9', '1', '1.1', '50'], oemMinInsulation: ['1'] };
describe('reviewer I3: random sessions through the integrated panel (with the safety screen)', () => {
  it('120 sessions: under any STOP → hold, no action, no running check, no Next check; otherwise the engine\'s actions and next question', () => {
    let stops = 0, free = 0;
    for (let n = 0; n < 120; n++) {
      localStorage.clear();
      const fams = [...FAMILIES].sort(() => rnd() - 0.5).slice(0, 1 + Math.floor(rnd() * 3));
      const session: Record<string, Record<string, string>> = { [SCREEN_BUCKET]: {} };
      for (const q of SCREEN_QUESTIONS) if (rnd() < 0.3) session[SCREEN_BUCKET][q.id] = rnd() < 0.9 ? 'no' : pick(q.options).value;
      for (const f of fams) { const o: Record<string, string> = {}; for (const q of f.questions) { if (q.id.startsWith('screen.') || rnd() > 0.3) continue; o[q.id] = q.kind === 'choice' ? pick(q.options).value : pick(SPECIAL[q.id] ?? [String((q.min + q.max) / 2)]); } session[f.id] = o; }
      const { container: c } = render(<Panel />);
      for (const [k, v] of Object.entries(session[SCREEN_BUCKET])) setA(c, k, v);
      for (const f of fams) { tab(c, f); const ks = Object.keys(session[f.id]).sort((a, b) => (a.startsWith('oem') ? -1 : 0) - (b.startsWith('oem') ? -1 : 0)); for (const k of ks) setA(c, k, session[f.id][k]); }
      const finalStop = FAMILIES.some((f) => sessionRecord(f, session).result.stopActive);
      for (const f of FAMILIES) {
        tab(c, f);
        const t = c.textContent ?? '';
        const ctx = `${f.id} ${JSON.stringify(session)}`;
        if (finalStop) expect(stopHold(c), ctx).toBe(true);
        if (stopHold(c)) {
          for (const a of ALL_ACTIONS) expect(t, `${ctx} :: ${a}`).not.toContain(a);
          for (const a of RUNNING) expect(t, `${ctx} :: ${a}`).not.toContain(a);
          expect(c.querySelector('[data-testid="next-check"]'), ctx).toBeNull();
        } else {
          const r = sessionRecord(f, session).result;
          for (const cz of r.ranked.slice(0, 3).filter((x) => x.score > 0)) for (const a of cz.actions) expect(t, `${ctx} :: missing ${a}`).toContain(a);
          if (r.nextQuestion) expect(c.querySelector('[data-testid="next-check"]')!.textContent, ctx).toContain(r.nextQuestion.text);
        }
      }
      if (finalStop) stops++; else free++;
      cleanup();
    }
    expect(stops).toBeGreaterThan(20); expect(free).toBeGreaterThan(10);
  }, 300_000);
});

describe('R-INT-6: a STOP on a card always has a structured STOP; a pending value is flushed, not dropped', () => {
  it('the record\'s own STOP (nothing latched in the browser) goes into guidedSafety and blocks completion; a later clearance of that STOP resolves it', () => {
    const session = { 'low-oil-pressure': { oemMinOilPressure: '150', oilPressure: '100' } };
    const g = guardedSessionRecord(F('low-oil-pressure'), session, {}, { latched: [], cleared: [], hold: false });
    expect(g.record.findings.split('\n')[0]).toMatch(/^STOP/);
    const own = g.safety.stops.filter((s) => s.fromRecord);
    expect(own.length).toBeGreaterThan(0);
    expect(own[0].key.startsWith('low-oil-pressure|')).toBe(true);
    const base = openJobCard({ id: 'JC1', assetId: 'A1', opened: '2026-11-26', reportedFault: 'x', technician: 'T' });
    const card = { ...base, ...guardedCardUpdate({ findings: '', readings: [] }, g), guidedSafety: mergeGuidedSafety(undefined, g.safety, T) } as JobCard;
    expect(() => complete(card, { readings })).toThrow(/still latched/);
    const later = '2026-11-26T09:00:00.000Z';
    const cleared = { ...card, guidedSafety: mergeGuidedSafety(card.guidedSafety, { stops: [], clearances: [{ ...own[0], since: later, clearedAt: later, by: 'JK', reason: 'TEST pressure restored' }], hold: null }, later) };
    expect(complete(cleared, { readings }).status).toBe('COMPLETED');
  });
  it('page hidden with an uncommitted out-of-limit reading: the STOP is latched and stored at once', () => {
    const { container: c } = render(<Panel />);
    tab(c, F('low-oil-pressure')); setA(c, 'oemMinOilPressure', '150'); fireEvent.blur(inputOf(c, 'oemMinOilPressure'));
    setA(c, 'oilPressure', '100');
    expect(JSON.parse(localStorage.getItem(GD_STORE)!).latched).toEqual([]);
    const vis = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState');
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    try { act(() => { document.dispatchEvent(new Event('visibilitychange')); }); } finally { if (vis) Object.defineProperty(document, 'visibilityState', vis); else delete (document as unknown as Record<string, unknown>).visibilityState; }
    expect(JSON.parse(localStorage.getItem(GD_STORE)!).latched.some((l: { key: string }) => l.key.startsWith('low-oil-pressure|'))).toBe(true);
  });
});
