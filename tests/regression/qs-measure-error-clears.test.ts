/**
 * Take-off workbench: a refused measurement's message must not outlive it (2026-11-25).
 *
 * Found while writing the MEP preview check: after a refused measurement the red
 * message stayed on screen through a mode change and while a new measurement was
 * being drawn. It must clear on a later successful Finish, on a mode change, and
 * as soon as a new point is placed.
 *
 * jsdom cannot decode images or lay out SVG, so the test loads a PNG through a
 * stubbed Image (1000 × 800 px) and gives the drawing a 1000 × 800 box, so that
 * a click at (x, y) is sheet pixel (x, y). Calibration: 100 px = 10 m, 50 px = 5 m.
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { createElement } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TakeoffWorkbench from '@/components/qs/TakeoffWorkbench';

class FakeImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  naturalWidth = 1000;
  naturalHeight = 800;
  set src(_v: string) { setTimeout(() => this.onload?.(), 0); }
}
const origCreate = URL.createObjectURL, origRevoke = URL.revokeObjectURL;
beforeAll(() => {
  vi.stubGlobal('Image', FakeImage);
  URL.createObjectURL = () => 'blob:test-drawing';
  URL.revokeObjectURL = () => {};
});
afterAll(() => { vi.unstubAllGlobals(); URL.createObjectURL = origCreate; URL.revokeObjectURL = origRevoke; });
beforeEach(() => { try { localStorage.clear(); } catch { /* storage blocked: nothing to clear */ } });

const REFUSED = /a length needs at least two points/;
const shown = () => screen.getAllByRole('alert').some((a) => REFUSED.test(a.textContent ?? ''));

async function calibratedWorkbench() {
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
  const finish = () => fireEvent.click(screen.getByRole('button', { name: /^Finish \(/ }));
  return { at, finish };
}

describe('a refused measurement message does not outlive the measurement', { timeout: 30_000 }, () => {
  it('refused → message shown → successful measurement → message gone, and the measurement is kept', async () => {
    const { at, finish } = await calibratedWorkbench();
    finish(); // Length mode, no points: refused
    await waitFor(() => expect(shown()).toBe(true));
    at(10, 10); at(60, 10); // 50 px = 5 m
    finish();
    await waitFor(() => expect(shown()).toBe(false));
    expect(screen.getByText('5.000 m')).toBeInTheDocument();
  });
  it('a mode change clears the message', async () => {
    const { finish } = await calibratedWorkbench();
    finish();
    await waitFor(() => expect(shown()).toBe(true));
    fireEvent.click(screen.getByRole('button', { name: 'Area' }));
    await waitFor(() => expect(shown()).toBe(false));
  });
  it('placing the first point of a new measurement clears the message', async () => {
    const { at, finish } = await calibratedWorkbench();
    finish();
    await waitFor(() => expect(shown()).toBe(true));
    at(10, 10);
    await waitFor(() => expect(shown()).toBe(false));
    expect(screen.getByRole('button', { name: 'Finish (1 pts)' })).toBeInTheDocument();
  });
});
