// @vitest-environment jsdom
import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, act, within } from '@testing-library/react';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import GuidedDiagnosisPanel, { GD_STORE, SAFETY_HOLD_TEXT } from '@/components/generator-oracle/panels/GuidedDiagnosisPanel';
import ServiceManagementPanel from '@/components/generator-oracle/panels/ServiceManagementPanel';
import { reduce, emptyState, serialise, STORE_KEY, type ServiceAction } from '@/lib/generator-oracle/service/store';
import {
  CLEARANCE_RECORD_PREFIX, LATCHED_STOP_PREFIX, READINGS_NOT_TAKEN_STOP, clearanceLine, jobCardReport, latchedStopLine,
  openJobCard, recordNotTaken, transition, unresolvedLatchedStops, type Asset, type JobCard,
} from '@/lib/generator-oracle/service/maintenance';
import { jobCardToPdf } from '@/lib/generator-oracle/service/jobCardPdf';
import { latchRecordLines } from '@/lib/generator-oracle/diagnostics/stopLatch';
import { UNCLASSIFIED_PROTECTIVE, SAFEGUARD_LABEL } from '@/lib/generator-oracle/diagnostics/engine';

// Integration 2026-11-26: "Record a guided diagnosis" carries EVERY latched STOP (also those
// whose answers were cleared, and safety-screen STOPs) and every recorded clearance onto the
// job card, first, in its SAFETY section (.txt and PDF). TEST values only.

type Pdfjs = typeof import('pdfjs-dist/legacy/build/pdf.mjs');
let pdfjs: Pdfjs;
beforeAll(async () => {
  pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')).href;
});
const pdfText = async (bytes: Uint8Array) => {
  const doc = await pdfjs.getDocument({ data: bytes.slice() }).promise;
  const out: string[] = [];
  for (let p = 1; p <= doc.numPages; p++) out.push((await (await doc.getPage(p)).getTextContent()).items.map((i) => ('str' in i ? i.str : '')).join(' '));
  return out.join(' ').replace(/\s+/g, ' ');
};

beforeEach(() => { localStorage.clear(); vi.spyOn(window, 'confirm').mockReturnValue(true); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); localStorage.clear(); });

const KNOCK = 'Knocking, bearing noise or seizure';

/** Guided Diagnosis: latch a knock STOP and clear its answers; latch a safety-screen STOP and record its clearance. */
const latchOnGuidedDiagnosis = () => {
  render(<GuidedDiagnosisPanel />);
  fireEvent.click(screen.getByRole('tab', { name: KNOCK }));
  fireEvent.change(screen.getAllByLabelText(/Where is the noise\?/)[0], { target: { value: 'engine' } });
  fireEvent.click(screen.getByRole('button', { name: 'Clear answers' }));
  fireEvent.change(screen.getByLabelText(/Safety screen: fuel leaking/), { target: { value: 'yes' } });
  fireEvent.click(screen.getByRole('button', { name: 'Clear safety screen' }));
  const form = screen.getAllByTestId('gd-clearance').find((f) => /Record STOP clearance: Safety screen/.test(f.textContent ?? ''))!;
  fireEvent.change(within(form).getByLabelText(/Name or initials/), { target: { value: 'TEST-JK' } });
  fireEvent.change(within(form).getByLabelText(/Clearance reason/), { target: { value: 'TEST: fuel leak repaired, area cleaned' } });
  fireEvent.click(within(form).getByLabelText(/The required checks for this STOP were completed/));
  fireEvent.click(within(form).getByRole('button', { name: 'Record STOP clearance' }));
  // The knock STOP is still latched, the screen STOP is cleared.
  expect(screen.getByTestId('gd-latched-stop').textContent).toMatch(/STOP THE SET/);
  expect(screen.getByTestId('gd-clearance-record').textContent).toMatch(/recorded by TEST-JK/);
  cleanup();
};

const seedCard = () => {
  const acts: ServiceAction[] = [
    { type: 'saveAsset', asset: { make: 'TEST', model: 'T-1', engine: 'TEST-ENG', controller: 'TEST-CTRL', serial: 'S-1', ratedKva: 100 } },
    { type: 'openCard', card: { assetId: 'A-1', opened: '2026-11-26', reportedFault: 'TEST knocking', technician: 'TECH-A' } },
  ];
  localStorage.setItem(STORE_KEY, serialise(acts.reduce(reduce, emptyState())));
};
const openCard = async () => {
  render(<ServiceManagementPanel />);
  await act(async () => {});
  fireEvent.click(screen.getByRole('button', { name: 'Job cards' }));
  fireEvent.click(screen.getByRole('button', { name: /JC-1/ }));
};
const storedCard = () => {
  const s = JSON.parse(localStorage.getItem(STORE_KEY)!);
  return { card: s.jobCards[0] as JobCard, asset: s.assets[0] as Asset };
};

describe('Record a guided diagnosis carries every latched STOP and clearance onto the job card', () => {
  it('a knock STOP whose answers were cleared is at the top of the findings, the .txt and the PDF; the clearance is UNVERIFIED; same after a reload', async () => {
    latchOnGuidedDiagnosis();
    seedCard();
    await openCard();
    // Offered although the knock answers were cleared.
    expect(screen.getAllByRole('alert').some((a) => /1 STOP\(s\) still latched/.test(a.textContent ?? ''))).toBe(true);
    fireEvent.change(screen.getByLabelText('Fault family'), { target: { value: 'overheating' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add this diagnosis to the card' }));

    const findings = (screen.getByLabelText('Findings') as HTMLTextAreaElement).value;
    const lines = findings.split('\n');
    expect(lines[0].startsWith(LATCHED_STOP_PREFIX)).toBe(true);
    expect(lines[0]).toMatch(new RegExp(`Source: ${KNOCK} tab\\. Since: \\d{4}-\\d\\d-\\d\\dT[^ ]+ \\(UTC\\)\\. STOP THE SET`));
    const clr = lines.find((l) => l.startsWith(CLEARANCE_RECORD_PREFIX))!;
    expect(clr).toMatch(/UNVERIFIED \(typed name, not authenticated; NOT authorisation to restart the generator\): Source: Safety screen tab/);
    expect(clr).toMatch(/by TEST-JK\. Reason: TEST: fuel leak repaired, area cleaned\. STOP was: STOP: leaking or spraying fuel/);
    // The cleared screen STOP is not listed as still latched.
    expect(lines.filter((l) => l.startsWith(LATCHED_STOP_PREFIX))).toHaveLength(1);

    const { card, asset } = storedCard();
    expect(card.findings).toBe(findings);
    const txt = jobCardReport(card, asset);
    const safety = txt.indexOf('SAFETY — STOP');
    expect(safety).toBeGreaterThan(-1);
    expect(safety).toBeLessThan(txt.indexOf('ASSET'));
    expect(txt.slice(safety, txt.indexOf('ASSET'))).toContain(lines[0]);
    expect(txt.slice(safety, txt.indexOf('ASSET'))).toContain('STOP CLEARANCE RECORDED — UNVERIFIED');
    const pdf = await pdfText(jobCardToPdf(card, asset));
    const p0 = pdf.indexOf('still latched — no recorded clearance');
    expect(p0).toBeGreaterThan(-1);
    expect(p0).toBeLessThan(pdf.indexOf('ASSET'));
    expect(pdf.indexOf('STOP CLEARANCE RECORDED — UNVERIFIED')).toBeLessThan(pdf.indexOf('ASSET'));

    // Reload: the card keeps it, and a new record still carries the latched STOP.
    cleanup();
    await openCard();
    expect((screen.getByLabelText('Findings') as HTMLTextAreaElement).value.split('\n')[0]).toBe(lines[0]);
    fireEvent.change(screen.getByLabelText('Fault family'), { target: { value: 'low-oil-pressure' } });
    expect(document.body.textContent).toContain(lines[0]);
  });

  it('blocked storage puts the SAFETY HOLD on the card; an unreadable record puts its STOP', () => {
    expect(latchRecordLines({ unreadable: true, blocked: true, latched: [], cleared: [] })[0]).toBe(SAFETY_HOLD_TEXT);
    localStorage.setItem(GD_STORE, '{not json');
    expect(latchRecordLines()[0]).toMatch(/^STOP — still latched — no recorded clearance\. Source: stored safety record tab\./);
  });

  it('the safeguard label goes with its STOP (stored label, or the rule label for older records)', () => {
    const lines = latchRecordLines({ unreadable: false, latched: [{ key: 'low-oil-pressure|x', from: 'Low oil pressure', since: '2026-11-26T08:00:00.000Z', message: UNCLASSIFIED_PROTECTIVE }], cleared: [] });
    expect(lines).toEqual([latchedStopLine({ from: 'Low oil pressure', since: '2026-11-26T08:00:00.000Z', message: UNCLASSIFIED_PROTECTIVE }), SAFEGUARD_LABEL]);
  });
});

describe('completion and sign-off while a STOP is latched', () => {
  const L = { from: KNOCK, since: '2026-11-26T08:00:00.000Z', message: 'STOP THE SET: TEST' };
  const base = (findings: string): JobCard => ({
    ...openJobCard({ id: 'JC-9', assetId: 'A-1', opened: '2026-11-26', reportedFault: 'TEST', technician: 'TECH-A' }),
    status: 'IN PROGRESS', findings, tasks: ['TEST inspect'], engineHoursAtJob: 10,
    readings: [{ name: 'TEST voltage', value: 400, unit: 'V' }, { name: 'TEST frequency', value: 50, unit: 'Hz' }, { name: 'TEST oil pressure', value: 300, unit: 'kPa' }, { name: 'TEST coolant temperature', value: 80, unit: '°C' }],
  });
  const complete = (c: JobCard) => transition(c, 'COMPLETED', 'TECH-A', '2026-11-26T12:00');

  it('readings alone do not complete a card with a latched STOP and no clearance', () => {
    expect(unresolvedLatchedStops(base(latchedStopLine(L)))).toHaveLength(1);
    expect(() => complete(base(latchedStopLine(L)))).toThrow(/readings not taken — STOP in force.*still latched with no recorded clearance/);
  });
  // F10-R3: the structured action, not the phrase in the findings.
  it('the recorded "readings not taken — STOP in force" action completes it; the phrase in the findings does not', () => {
    expect(() => complete(base(`${latchedStopLine(L)}\n${READINGS_NOT_TAKEN_STOP}`))).toThrow(/still latched/);
    expect(complete({ ...base(latchedStopLine(L)), readings: [], guidedSafety: recordNotTaken(undefined, { at: '2026-11-26T11:00:00.000Z', by: 'TECH-A', confirmed: true }) }).status).toBe('COMPLETED');
  });
  it('a recorded clearance for that STOP (same source and since) completes it; one for another STOP does not', () => {
    const clr = (since: string) => clearanceLine({ ...L, since, clearedAt: '2026-11-26T11:00:00.000Z', by: 'TEST-JK', reason: 'TEST repaired' });
    expect(complete(base(`${latchedStopLine(L)}\n${clr(L.since)}`)).status).toBe('COMPLETED');
    expect(() => complete(base(`${latchedStopLine(L)}\n${clr('2026-11-26T09:00:00.000Z')}`))).toThrow(/still latched/);
  });
});
