/**
 * CORRECTIVE ACTION (2026-11-25): take-off page scrolled sideways on a phone.
 *
 * Problem: at 390 px, /solutions/building/takeoff had scrollWidth − innerWidth = 757 px
 *   with the BOQ and a rate build-up open (preview check of c629d817), although no
 *   visible pixel extends past 400 px in the full-page screenshot.
 * Root cause: Tailwind `sr-only` is position:absolute. The wide tables sit in
 *   `overflow-x-auto` boxes that were not positioned, so an absolute descendant's
 *   containing block lay OUTSIDE the scroll box: it was not clipped and stretched the
 *   page to the table's right edge (the build-up editor's sr-only "Remove" header,
 *   at about 1147 px). Earlier runs had no sr-only cell in a wide table.
 * Correction: every horizontal scroll box in components/qs is `relative overflow-x-auto`
 *   (absolute descendants are now contained and clipped) and is a named, focusable
 *   region (role="region", aria-label, tabIndex=0) so keyboard users can scroll it.
 * Verification: jsdom has no layout, so this pins the container contract; the page
 *   overflow itself is re-measured in a real browser by building-mep-preview-check.cjs.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { createElement } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TradesPanel from '@/components/qs/TradesPanel';
import BuildUpEditor from '@/components/qs/BuildUpEditor';
import type { Quantity } from '@/lib/qs/takeoff';

const FILES = ['components/qs/TakeoffWorkbench.tsx', 'components/qs/TradesPanel.tsx', 'components/qs/BuildUpEditor.tsx'];

/** Every element whose class has overflow-x-auto (or overflow-auto / overflow-x-scroll). */
const scrollBoxes = (root: Element) => [...root.querySelectorAll('[class*="overflow-x-auto"], [class*="overflow-auto"], [class*="overflow-x-scroll"]')];
function contract(root: Element) {
  const problems: string[] = [];
  for (const box of scrollBoxes(root)) {
    const cls = box.getAttribute('class') ?? '';
    if (!/\brelative\b/.test(cls)) problems.push(`scroll box without "relative": ${cls}`);
    if (box.getAttribute('role') !== 'region') problems.push(`scroll box without role=region: ${box.getAttribute('aria-label') ?? cls}`);
    if (!box.getAttribute('aria-label')) problems.push(`scroll box without aria-label: ${cls}`);
    if (box.getAttribute('tabindex') !== '0') problems.push(`scroll box not focusable: ${box.getAttribute('aria-label') ?? cls}`);
  }
  // Every absolutely positioned helper (sr-only) inside a scroll box has a positioned scroll box between it and the page.
  for (const el of root.querySelectorAll('.sr-only')) {
    for (let n = el.parentElement; n && n !== root; n = n.parentElement) {
      const cls = n.getAttribute('class') ?? '';
      if (/\boverflow-(x-)?(auto|scroll)\b/.test(cls)) { if (!/\brelative\b/.test(cls)) problems.push(`sr-only "${el.textContent}" escapes an unpositioned scroll box`); break; }
    }
  }
  return problems;
}

describe('take-off scroll containers keep wide tables inside (page never scrolls sideways)', () => {
  it('source: every horizontal scroll box in components/qs is relative and a named, focusable region', () => {
    for (const f of FILES) {
      const src = fs.readFileSync(f, 'utf8');
      const tags = [...src.matchAll(/<div[^>]*overflow-x-auto[^>]*>/g)].map((m) => m[0]);
      expect(tags.length, f).toBeGreaterThan(0);
      for (const t of tags) {
        expect(t, `${f}: ${t}`).toMatch(/className="relative overflow-x-auto"/);
        expect(t, `${f}: ${t}`).toMatch(/role="region"/);
        expect(t, `${f}: ${t}`).toMatch(/aria-label=/);
        expect(t, `${f}: ${t}`).toMatch(/tabIndex=\{0\}/);
      }
    }
  });
  it('rendered: Trades panel openings table and calculated-lines table', () => {
    const Q = new Map<string, Quantity>([['M1', { id: 'M1', kind: 'linear', unit: 'm', gross: 20, deductions: 0, net: 20, holes: [] }]]);
    const { container } = render(createElement(TradesPanel, { quantities: Q, measurements: [], existingCodes: [], onAdd: () => {} }));
    fireEvent.change(screen.getByLabelText('Trade'), { target: { value: 'openings' } });
    fireEvent.change(screen.getByLabelText('Trade item code'), { target: { value: 'DW' } });
    const set = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
    set('opening 1 mark', 'D1'); set('opening 1 width', '0.9'); set('opening 1 width source', 'TEST'); set('opening 1 height', '2.1'); set('opening 1 height source', 'TEST'); set('opening 1 count', '2');
    fireEvent.click(screen.getByRole('button', { name: 'Calculate' }));
    expect(scrollBoxes(container)).toHaveLength(2);
    expect(container.querySelectorAll('.sr-only').length).toBeGreaterThan(0);
    expect(contract(container)).toEqual([]);
    expect(screen.getByRole('region', { name: 'Openings table, scrolls sideways' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Calculated trade quantities table, scrolls sideways' })).toBeInTheDocument();
  });
  it('rendered: rate build-up editor (its sr-only "Remove" header was the element that widened the page)', () => {
    const draft = { resources: [{ kind: 'material' as const, description: 'TEST', unit: 'm', quantity: '1', price: '1', tier: 'verified' as const, waste: '', source: 'TEST', date: '2026-01-01' }], ohp: '0', ohpSource: 'TEST', location: '' };
    const { container } = render(createElement(BuildUpEditor, { item: 'Item 5 (E.5)', unit: 'm', draft, result: undefined, rates: null, onChange: () => {} }));
    const srRemove = [...container.querySelectorAll('.sr-only')].find((e) => e.textContent === 'Remove');
    expect(srRemove).toBeTruthy();
    expect(contract(container)).toEqual([]);
    expect(screen.getByRole('region', { name: 'Rate build-up lines for Item 5 (E.5), scrolls sideways' })).toBeInTheDocument();
  });
});
