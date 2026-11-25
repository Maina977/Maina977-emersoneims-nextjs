/**
 * BOQ panel: every control has its own accessible name (2026-11-25).
 *
 * Found by the preview browser check: the bill-level "Overheads & profit %" and
 * a rate build-up's O&P field were both labelled "Overheads & profit %", so a
 * label lookup (screen reader or test) found two controls. They are now
 * "Bill-level overheads & profit %" and "Build-up overheads & profit % (Item N (code))".
 *
 * Harness as qs-measure-error-clears: PNG drawing via a stubbed Image, 1000 × 800 box.
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { createElement } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axe from 'axe-core';
import TakeoffWorkbench from '@/components/qs/TakeoffWorkbench';

class FakeImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  naturalWidth = 1000;
  naturalHeight = 800;
  set src(_v: string) { setTimeout(() => this.onload?.(), 0); }
}
const origCreate = URL.createObjectURL, origRevoke = URL.revokeObjectURL;
beforeAll(() => { vi.stubGlobal('Image', FakeImage); URL.createObjectURL = () => 'blob:test-drawing'; URL.revokeObjectURL = () => {}; });
afterAll(() => { vi.unstubAllGlobals(); URL.createObjectURL = origCreate; URL.revokeObjectURL = origRevoke; });
beforeEach(() => { try { localStorage.clear(); } catch { /* storage blocked */ } });

async function boqWithBuildUp() {
  const { container } = render(createElement(TakeoffWorkbench));
  fireEvent.change(screen.getByLabelText(/Drawing \(PDF, PNG or JPG\)/), { target: { files: [new File(['TEST png bytes'], 'TEST-plan.png', { type: 'image/png' })] } });
  const svg = await waitFor(() => { const s = container.querySelector('svg.cursor-crosshair'); if (!s) throw new Error('drawing not shown'); return s as SVGSVGElement; });
  svg.getBoundingClientRect = () => ({ left: 0, top: 0, right: 1000, bottom: 800, width: 1000, height: 800, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
  const at = (x: number, y: number) => fireEvent.click(svg, { clientX: x, clientY: y });
  at(0, 0); at(100, 0);
  fireEvent.change(screen.getByLabelText('Known length in metres'), { target: { value: '10' } });
  fireEvent.click(screen.getByRole('button', { name: 'Add reference' }));
  at(0, 0); at(0, 50);
  fireEvent.change(screen.getByLabelText('Known length in metres'), { target: { value: '5' } });
  fireEvent.click(screen.getByRole('button', { name: 'Add reference' }));
  await waitFor(() => expect(screen.getByText(/Calibrated:/)).toBeInTheDocument());
  at(10, 10); at(60, 10);
  fireEvent.click(screen.getByRole('button', { name: /^Finish \(/ }));
  await waitFor(() => expect(screen.getByText('5.000 m')).toBeInTheDocument());
  fireEvent.click(screen.getByRole('button', { name: 'Add item' }));
  fireEvent.click(screen.getByRole('button', { name: 'Item 1 build up the rate' }));
  await waitFor(() => expect(screen.getByText(/Rate build-up for Item 1 \(1\)/)).toBeInTheDocument());
  const boq = [...container.querySelectorAll('div.rounded.border')].find((d) => d.querySelector('caption')?.textContent === 'Bill of quantities items') as HTMLElement;
  return { container, boq };
}

describe('BOQ panel control names', { timeout: 30_000 }, () => {
  it('bill-level and build-up O&P have distinct names, one control each', async () => {
    await boqWithBuildUp();
    expect(screen.getAllByLabelText('Bill-level overheads & profit %')).toHaveLength(1);
    expect(screen.getAllByLabelText('Build-up overheads & profit % (Item 1 (1))')).toHaveLength(1);
    expect(screen.queryAllByLabelText('Overheads & profit %')).toHaveLength(0);
    // The two fields act independently: typing in one does not fill the other.
    fireEvent.change(screen.getByLabelText('Bill-level overheads & profit %'), { target: { value: '10' } });
    expect((screen.getByLabelText('Build-up overheads & profit % (Item 1 (1))') as HTMLInputElement).value).toBe('');
  });
  it('every input and select in the BOQ panel has a name, and no two share one', async () => {
    const { boq } = await boqWithBuildUp();
    expect(boq).toBeTruthy();
    const names = [...boq.querySelectorAll('input, select')].map((el) => (el.getAttribute('aria-label') ?? el.closest('label')?.textContent ?? '').replace(/\s+/g, ' ').trim());
    expect(names.filter((n) => !n)).toEqual([]);
    const dup = names.filter((n, i) => names.indexOf(n) !== i);
    expect(dup).toEqual([]);
    const r = await axe.run(boq, { runOnly: { type: 'rule', values: ['label', 'select-name', 'button-name'] } });
    expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html).join(' | ')}`)).toEqual([]);
  });
});
