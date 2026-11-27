/**
 * Register SOLAR-UPS-HUB HUB-02: the serious axe finding left on /solar at
 * 390 px was "scrollable-region-focusable" on figure:nth-child(8): a spec
 * table (SpecTable, components/content/EngineeringDeepDive.tsx, rendered by
 * SolarEngineeringDeepDive) that scrolls sideways on a phone with nothing
 * focusable inside, so a keyboard user cannot scroll it (WCAG 2.1.1).
 *
 * jsdom has no layout, so axe cannot see the overflow here; the fix is
 * checked structurally (focusable, named), and the browser axe run on the
 * preview is the acceptance (hub-roi-check). The 1280 px colour-contrast node
 * is the sizing-header brand colour (L6), an owner decision, and is not changed.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import * as React from 'react';
import { SpecTable } from '@/components/content/EngineeringDeepDive';
import SolarEngineeringDeepDive from '@/components/solar/SolarEngineeringDeepDive';

afterEach(() => cleanup());

describe('HUB-02: a sideways-scrolling spec table can be reached and scrolled from the keyboard', () => {
  it('SpecTable is focusable (tabindex 0) and named by its caption', () => {
    const { container } = render(React.createElement(SpecTable, { caption: 'Panel comparison', headers: ['A', 'B'], rows: [['1', '2']] }));
    const fig = container.querySelector('figure')!;
    expect(fig.className).toContain('overflow-x-auto');
    expect(fig.getAttribute('tabindex')).toBe('0');
    expect(fig.getAttribute('aria-label')).toBe('Panel comparison');
  });
  it('without a caption the name comes from the column headers', () => {
    const { container } = render(React.createElement(SpecTable, { headers: ['Size', 'Rating'], rows: [['1', '2']] }));
    expect(container.querySelector('figure')!.getAttribute('aria-label')).toBe('Size, Rating');
  });
  it('every scrolling figure on the /solar deep-dive is focusable', () => {
    const { container } = render(React.createElement(SolarEngineeringDeepDive));
    const scrolling = Array.from(container.querySelectorAll('figure')).filter((f) => /overflow-x-auto/.test(f.className));
    expect(scrolling.length).toBeGreaterThan(0);
    for (const f of scrolling) expect(f.getAttribute('tabindex')).toBe('0');
  });
});
