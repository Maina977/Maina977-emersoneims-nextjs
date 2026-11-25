import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Browser acceptance 2026-11-25 (coordinator, solar-perf-bench roi/mobile):
 * the per-panel reservation alone left CLS at 0.28. The shift came from the
 * FOOTER: the "Savings Calculator" link was tapped before hydration, the
 * tools area in the server HTML was short, so the footer was in view, and
 * the ROI panel inserted after hydration pushed it down. The fix must be in
 * the SERVER-RENDERED HTML: the container around the tab panels is at least
 * one screen tall. This test renders the real /solar page on the server.
 */

// Any motion.<tag> renders as the plain tag (the shared mock lacks motion.tr).
vi.mock('framer-motion', () => {
  const strip = ({ children, initial, animate, exit, whileHover, whileTap, whileInView, viewport, transition, layout, ...rest }: Record<string, unknown> & { children?: React.ReactNode }) => {
    void initial; void animate; void exit; void whileHover; void whileTap; void whileInView; void viewport; void transition; void layout;
    return { children, rest };
  };
  const motion = new Proxy({}, {
    get: (_t, tag: string) => (props: Record<string, unknown>) => {
      const { children, rest } = strip(props);
      return React.createElement(tag, rest, children as React.ReactNode);
    },
  });
  return {
    motion,
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => React.createElement(React.Fragment, null, children),
    useScroll: () => ({ scrollYProgress: 0 }),
    useTransform: () => 1,
    useSpring: () => 0,
    useMotionValue: () => ({ set: () => {}, get: () => 0 }),
    useInView: () => true,
    useReducedMotion: () => false,
    useAnimation: () => ({ start: () => {} }),
  };
});

describe('/solar server HTML reserves the tool area before hydration', () => {
  it('the container around the tab panels is in the server HTML with min-height one screen, wrapping the panels and before the footer', async () => {
    const { default: SolarPage } = await import('@/app/solar/page');
    const html = renderToString(<SolarPage />);
    const m = html.match(/<div data-tool-panels="" class="([^"]*)"/);
    expect(m, 'tool panel container missing from server HTML').toBeTruthy();
    expect(m![1].split(/\s+/)).toContain('min-h-screen');
    const at = html.indexOf('data-tool-panels');
    // the tab bar comes before it, the footer after it
    expect(html.lastIndexOf('role="tablist"', at)).toBeGreaterThan(-1);
    expect(html.indexOf('<footer', at)).toBeGreaterThan(at);
    // the server-rendered (overview) panel is inside the container
    expect(html.slice(at, html.indexOf('<footer', at))).toContain('Our Solar Installations');
  }, 60000);

  it('the source keeps every tab panel inside the container', () => {
    const src = readFileSync(join(process.cwd(), 'app/solar/page.tsx'), 'utf8');
    const open = src.indexOf('<ToolPanelArea>');
    const close = src.indexOf('</ToolPanelArea>');
    expect(open).toBeGreaterThan(-1);
    const inside = src.slice(open, close);
    for (const id of ['overview', 'shop', 'calculator', 'roi', 'booking', 'faults', 'maintenance', 'education', 'equipment', 'wiring', 'repair', 'design3d', 'webgl3d']) {
      expect(inside).toContain(`activeTab === '${id}'`);
    }
    expect(src.slice(close)).not.toMatch(/activeTab === '/);
  });
});
