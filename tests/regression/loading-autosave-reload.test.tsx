// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import ProposalPage from '@/components/solar-modules/crc/src/pages/ProposalPage';
import ServiceManagementPanel from '@/components/generator-oracle/panels/ServiceManagementPanel';
import { DRAFT_STORAGE_KEY } from '@/lib/solar/design/proposalSave';
import { STORE_KEY, serialise, emptyState, reduce } from '@/lib/generator-oracle/service/store';
import { recoveryReload } from '@/lib/loading/resilientImport';

// Management priority 1 (2026-11-21): project information already saved in
// this browser survives a recovery reload. A "reload" is an unmount and a
// fresh mount with the same localStorage. (The take-off workbench autosave is
// covered by qs-project-save.test.ts; its flush uses the same registry.)

beforeEach(() => { localStorage.clear(); sessionStorage.clear(); vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {}))); });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('Solar proposal draft', () => {
  it('an edit made just before "Reload page" (inside the 400 ms autosave delay) is written and restored', async () => {
    const first = render(<ProposalPage />);
    await act(async () => {});
    fireEvent.change(screen.getByLabelText('Proposal reference'), { target: { value: 'RELOAD-7' } });
    const reload = vi.fn();
    recoveryReload(reload); // no timers advanced: only the flush can have saved it
    expect(reload).toHaveBeenCalledTimes(1);
    expect(JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) as string).form.ref).toBe('RELOAD-7');
    first.unmount();

    render(<ProposalPage />);
    await act(async () => {});
    expect((screen.getByLabelText('Proposal reference') as HTMLInputElement).value).toBe('RELOAD-7');
  });

  it('after unmount the flush is unregistered (a reload elsewhere writes nothing)', async () => {
    const first = render(<ProposalPage />);
    await act(async () => {});
    first.unmount();
    localStorage.clear();
    recoveryReload(() => {});
    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull();
  });
});

describe('Generator Oracle service records', () => {
  it('records stored in localStorage are shown again after a remount', async () => {
    // TEST values only.
    const state = reduce(emptyState(), { type: 'saveAsset', asset: { make: 'TEST', model: 'T-RELOAD', engine: 'TEST-ENG', controller: 'TEST-CTRL', serial: 'S-RELOAD', ratedKva: 100 } });
    localStorage.setItem(STORE_KEY, serialise(state));
    const first = render(<ServiceManagementPanel />);
    await act(async () => {});
    const before = document.body.textContent ?? '';
    first.unmount();
    render(<ServiceManagementPanel />);
    await act(async () => {});
    expect(before).toMatch(/T-RELOAD/);
    expect(document.body.textContent).toBe(before);
    expect(localStorage.getItem(STORE_KEY)).toBe(serialise(state));
  });
});
