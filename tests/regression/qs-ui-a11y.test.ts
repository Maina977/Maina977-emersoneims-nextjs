/**
 * Building Suite Pro take-off UI (P1 building QA, 2026-11-21): the "not saved"
 * notice, accessible names in the Trades panel, and announced errors.
 * Written with createElement so the file is .ts (covered by qs*.test.ts).
 */
import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axe from 'axe-core';
import TakeoffWorkbench from '@/components/qs/TakeoffWorkbench';
import TradesPanel from '@/components/qs/TradesPanel';
import type { Quantity } from '@/lib/qs/takeoff';

const A11Y_RULES = ['label', 'button-name', 'select-name', 'empty-table-header', 'th-has-data-cells', 'aria-allowed-role', 'aria-valid-attr-value'];
async function violations(el: Element) {
  const r = await axe.run(el, { runOnly: { type: 'rule', values: A11Y_RULES } });
  return r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html).join(' | ')}`);
}
const Q = new Map<string, Quantity>([['M1', { id: 'M1', kind: 'linear', unit: 'm', gross: 20, deductions: 0, net: 20, holes: [] }]]);
const panel = () => render(createElement(TradesPanel, { quantities: Q, measurements: [], existingCodes: [], onAdd: () => {} }));

describe('take-off workbench: saved-project status', { timeout: 30_000 }, () => {
  it('nothing is saved, and the page says so', () => {
    render(createElement(TakeoffWorkbench));
    expect(screen.getByRole('note')).toHaveTextContent('Not saved — export Excel/PDF to keep your work.');
  });
  it('the workbench does not use browser storage (so it must not imply saving)', async () => {
    const src = (await import('node:fs')).readFileSync('components/qs/TakeoffWorkbench.tsx', 'utf8') + (await import('node:fs')).readFileSync('components/qs/TradesPanel.tsx', 'utf8');
    expect(src).not.toMatch(/localStorage|sessionStorage|indexedDB/);
  });
});

describe('Trades panel accessibility', { timeout: 30_000 }, () => {
  it('every input, select and button has a name (masonry form)', async () => {
    const { container } = panel();
    expect(await violations(container)).toEqual([]);
  });
  it('an error is announced through role="alert"', () => {
    panel();
    fireEvent.click(screen.getByRole('button', { name: 'Calculate' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Item code is required');
  });
  it('openings table and the calculated lines table have named headers', async () => {
    const { container } = panel();
    fireEvent.change(screen.getByLabelText('Trade'), { target: { value: 'openings' } });
    fireEvent.change(screen.getByLabelText('Trade item code'), { target: { value: 'DW' } });
    const set = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
    set('opening 1 mark', 'D1'); set('opening 1 width', '0.9'); set('opening 1 width source', 'TEST schedule');
    set('opening 1 height', '2.1'); set('opening 1 height source', 'TEST schedule'); set('opening 1 count', '2');
    fireEvent.click(screen.getByRole('button', { name: 'Calculate' }));
    expect(screen.getByRole('table', { name: 'Calculated trade quantities' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader', { name: 'Remove' }).length).toBe(1);
    expect(await violations(container)).toEqual([]);
  });
});
