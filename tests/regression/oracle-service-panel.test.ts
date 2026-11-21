import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createElement } from 'react';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import axe from 'axe-core';
import ServiceManagementPanel from '@/components/generator-oracle/panels/ServiceManagementPanel';
import { reduce, emptyState, serialise, STORE_KEY, type ServiceAction, type ServiceState } from '@/lib/generator-oracle/service/store';
import { SIGNOFF } from '@/lib/generator-oracle/service/maintenance';

// TEST values only — never real OEM intervals, names or part numbers.
const run = (s: ServiceState, ...acts: ServiceAction[]) => acts.reduce(reduce, s);
const signed = () => run(emptyState(),
  { type: 'saveAsset', asset: { make: 'TEST', model: 'T-100', engine: 'TEST-ENG', controller: 'TEST-CTRL', serial: 'S-1', ratedKva: 100 } },
  { type: 'addTask', assetId: 'A-1', task: { task: 'TEST oil and filter', intervalHours: 250, source: { document: 'TEST manual', edition: 'TEST ed.', page: '1' } } },
  { type: 'openCard', card: { assetId: 'A-1', opened: '2026-11-20', reportedFault: 'TEST fault', technician: 'TECH-A' } },
  { type: 'transition', cardId: 'JC-1', to: 'IN PROGRESS', by: 'TECH-A', at: '2026-11-20T08:00' },
  { type: 'transition', cardId: 'JC-1', to: 'COMPLETED', by: 'TECH-A', at: '2026-11-20T12:00', update: {
    findings: 'TEST findings', tasks: ['TEST work'], engineHoursAtJob: 1500, labourHours: 2,
    parts: [{ partNo: 'TEST-123', description: 'TEST part', qty: 1, compatibility: { document: 'TEST parts book', edition: 'TEST ed.', page: '7' } }],
    readings: [{ name: 'TEST voltage', value: 405, unit: 'V', min: 380, max: 420, limitSource: 'TEST rating plate' }],
  } },
  { type: 'transition', cardId: 'JC-1', to: SIGNOFF, by: 'SUPERVISOR-B', at: '2026-11-20T13:00' },
);

async function openCard(seed: string) {
  window.localStorage.setItem(STORE_KEY, seed);
  const view = render(createElement(ServiceManagementPanel));
  await act(async () => {});
  fireEvent.click(screen.getByRole('button', { name: 'Job cards' }));
  fireEvent.click(screen.getByRole('button', { name: /JC-1/ }));
  return view;
}

/** Every form control has a programmatic label; every button an accessible name. */
function checkNames(root: HTMLElement) {
  const problems: string[] = [];
  root.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea').forEach((el) => {
    const labelled = (el.labels && el.labels.length > 0 && el.labels[0].textContent!.trim() !== '') || el.getAttribute('aria-label')?.trim() || el.getAttribute('aria-labelledby');
    if (!labelled) problems.push(`unlabelled ${el.tagName} ${el.outerHTML.slice(0, 80)}`);
  });
  root.querySelectorAll('button').forEach((b) => { if (!(b.textContent?.trim() || b.getAttribute('aria-label')?.trim())) problems.push(`unnamed button ${b.outerHTML.slice(0, 80)}`); });
  root.querySelectorAll('table').forEach((t) => {
    if (!t.querySelector('thead th')) problems.push('table without headers');
    t.querySelectorAll('th').forEach((th) => { if (!th.textContent?.trim()) problems.push('empty header cell'); });
    if (!t.parentElement?.classList.contains('overflow-x-auto')) problems.push('table not in an overflow-x-auto wrapper (390 px)');
  });
  return problems;
}

async function axeViolations(root: HTMLElement) {
  const r = await axe.run(root, { rules: { 'color-contrast': { enabled: false } } }); // jsdom cannot compute colours
  return r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
}

describe('Service & Job Cards panel', () => {
  beforeEach(() => { window.localStorage.clear(); vi.spyOn(window, 'confirm').mockReturnValue(true); });
  afterEach(() => { vi.restoreAllMocks(); window.localStorage.clear(); });

  it('shows the sign-off only as NOT VERIFIED (typed name), with the notice, and never as plain SIGNED OFF / approved', async () => {
    const { container } = await openCard(serialise(signed()));
    const text = container.textContent ?? '';
    expect(text).toContain(SIGNOFF);
    expect(text).toContain('Sign-off recorded by typed name — not an authenticated signature. Not valid as a certified record until reviewer accounts exist.');
    expect(text).not.toMatch(/\bSIGNED OFF\b/i);
    expect(text.replace(/not an approval/gi, '')).not.toMatch(/approv/i); // only ever negated
    expect(text.replace(/Not valid as a certified record/g, '').replace(/\(not a certified record\)/g, '')).not.toMatch(/certif/i);
    // the status pill carries its text (not colour only)
    expect(screen.getAllByText(SIGNOFF, { selector: 'span' }).length).toBeGreaterThan(0);
    // locked: no edit fields for the work
    expect(screen.queryByLabelText('Findings')).toBeNull();
    expect(screen.getByRole('button', { name: 'Reopen job card JC-1' })).toBeInTheDocument();
  });

  it('a card edited in localStorage after sign-off is refused with a message, never shown as clean', async () => {
    const j = JSON.parse(serialise(signed()));
    j.jobCards[0].findings = 'TEST edited in storage';
    const raw = JSON.stringify(j);
    window.localStorage.setItem(STORE_KEY, raw);
    const { container } = render(createElement(ServiceManagementPanel));
    await act(async () => {});
    const alerts = screen.getAllByRole('alert').map((n) => n.textContent).join(' ');
    expect(alerts).toMatch(/CHANGED AFTER SIGN-OFF/);
    expect(alerts).toMatch(/A copy was kept in browser storage/);
    expect(container.textContent).not.toContain('TEST edited in storage');
    fireEvent.click(screen.getByRole('button', { name: 'Job cards' }));
    expect(screen.queryByRole('button', { name: /JC-1/ })).toBeNull();
    // the tampered data is kept (backup) and not overwritten by the load
    const backups = Object.keys(window.localStorage).filter((k) => k.startsWith('eims-oracle-service-unreadable-backup'));
    expect(backups.map((k) => window.localStorage.getItem(k))).toContain(raw);
    expect(window.localStorage.getItem(STORE_KEY)).toBe(raw);
  });

  it('reopen from the screen records who, when and why, and starts revision 2', async () => {
    await openCard(serialise(signed()));
    const reopenBox = screen.getByRole('button', { name: 'Reopen job card JC-1' }).parentElement!;
    fireEvent.change(within(reopenBox).getByLabelText(/Who \*/), { target: { value: 'SUPERVISOR-B' } });
    fireEvent.change(within(reopenBox).getByLabelText('When *'), { target: { value: '2026-11-21T08:00' } });
    fireEvent.change(within(reopenBox).getByLabelText('Reason for reopening *'), { target: { value: 'TEST correction' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reopen job card JC-1' }));
    expect(screen.getByRole('heading', { name: /Job card JC-1 \(revision 2\)/ })).toBeInTheDocument();
    expect(screen.getByLabelText('Findings')).toBeInTheDocument();
    const report = document.querySelector('pre')!.textContent!;
    expect(report).toMatch(/SIGN-OFF RECORDED — NOT VERIFIED \(typed name\) → IN PROGRESS {2}by SUPERVISOR-B — REOPENED. Reason: TEST correction/);
    const saved = JSON.parse(window.localStorage.getItem(STORE_KEY)!);
    expect(saved.jobCards[0]).toMatchObject({ status: 'IN PROGRESS', revision: 2 });
  });

  it('accessibility: labels, button names, table headers, overflow wrappers; axe finds no violations', async () => {
    const { container } = await openCard(serialise(signed()));
    expect(checkNames(container)).toEqual([]);
    expect(await axeViolations(container)).toEqual([]);
    // an editable card (after reopen) with part and reading rows
    const reopenBox = screen.getByRole('button', { name: 'Reopen job card JC-1' }).parentElement!;
    fireEvent.change(within(reopenBox).getByLabelText(/Who \*/), { target: { value: 'SUPERVISOR-B' } });
    fireEvent.change(within(reopenBox).getByLabelText('Reason for reopening *'), { target: { value: 'TEST' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reopen job card JC-1' }));
    expect(checkNames(container)).toEqual([]);
    expect(await axeViolations(container)).toEqual([]);
    for (const tab of ['Assets & plan', 'Due list']) {
      fireEvent.click(screen.getByRole('button', { name: tab }));
      if (tab === 'Due list') fireEvent.change(screen.getByLabelText('Hour-meter reading now (h)'), { target: { value: '1600' } });
      expect(checkNames(container)).toEqual([]);
      expect(await axeViolations(container)).toEqual([]);
    }
    expect(container.querySelectorAll('table').length).toBeGreaterThan(0);
  }, 60000); // axe-core in jsdom is slow

  it('blocked or full storage shows a message and does not crash', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('quota', 'QuotaExceededError'); });
    render(createElement(ServiceManagementPanel));
    await act(async () => {});
    fireEvent.change(screen.getByLabelText('Make *'), { target: { value: 'TEST' } });
    fireEvent.change(screen.getByLabelText('Model *'), { target: { value: 'T-1' } });
    fireEvent.change(screen.getByLabelText('Serial number *'), { target: { value: 'S-9' } });
    fireEvent.change(screen.getByLabelText('Rated kVA * (rating plate)'), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add asset' }));
    expect(screen.getByText(/Could not save: browser storage is full/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit asset A-1' })).toBeInTheDocument();
  });

  it('unreadable saved data is not overwritten on load', async () => {
    const getSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('{bad');
    const setSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('quota', 'QuotaExceededError'); });
    render(createElement(ServiceManagementPanel));
    await act(async () => {});
    expect(screen.getByText(/could not be backed up/)).toBeInTheDocument();
    expect(setSpy.mock.calls.filter(([k]) => k === STORE_KEY)).toHaveLength(0);
    getSpy.mockRestore();
  });
});
