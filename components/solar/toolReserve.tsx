/**
 * SPACE RESERVED FOR A /solar TOOL WHILE ITS CODE DOWNLOADS (2026-11-25).
 *
 * Measured defect: the Savings (ROI) Calculator tab showed a 384 px pulse box
 * (h-96) while its module downloaded; on a slow connection the calculator then
 * arrived about 2,200 px tall on a 390 px phone and pushed everything below it
 * down: CLS 0.28 (poor), above 1.0 on some slow loads.
 *
 * Now each tool tab reserves its final height while it loads:
 *  - the tab panel (TOOL_SLOT) holds that height for as long as it contains the
 *    placeholder or the "Still downloading" note shown under it (CSS :has, so
 *    the note appears inside the reserved space instead of adding to it);
 *  - the placeholder itself (ToolPlaceholder) is 160 px shorter, which leaves
 *    room for that note; in a browser without :has (Firefox before 121) the
 *    placeholder alone still reserves all but those 160 px.
 * Once the tool has arrived the reservation is gone, so the panel is exactly
 * the tool's own height (it changes with the inputs, e.g. battery on/off).
 *
 * Heights: ROI and sizing calculator are worked out from their markup in their
 * default state (Inter, Tailwind sizes, the mobile rules in app/globals.css),
 * per breakpoint — see docs/engineering/solar-hub-roi-layout-and-a11y.md. The
 * other tools are taller than a phone or laptop screen, so they reserve one
 * screen height: when a tab is clicked the panel starts below the tab bar, so
 * everything under a one-screen reservation is out of view when the tool
 * arrives, and moving content out of view is not a layout shift.
 *
 * Class strings are written out in full so Tailwind finds them.
 */

import type { ReactNode } from 'react';

export type ReservedTool = 'roi' | 'sizing' | 'screen';

/** Tab panel: holds the final height while it contains a placeholder (or the slow note under it). */
export const TOOL_SLOT: Record<ReservedTool, string> = {
  roi: 'has-[[data-tool-reserve]]:min-h-[2230px] sm:has-[[data-tool-reserve]]:min-h-[1820px] lg:has-[[data-tool-reserve]]:min-h-[1100px] xl:has-[[data-tool-reserve]]:min-h-[1050px]',
  sizing: 'has-[[data-tool-reserve]]:min-h-[1140px] sm:has-[[data-tool-reserve]]:min-h-[900px] lg:has-[[data-tool-reserve]]:min-h-[670px]',
  screen: 'has-[[data-tool-reserve]]:min-h-[100svh]',
};

/** Placeholder: the same height less 160 px for the "Still downloading" note. */
export const TOOL_PLACEHOLDER: Record<ReservedTool, string> = {
  roi: 'min-h-[2070px] sm:min-h-[1660px] lg:min-h-[940px] xl:min-h-[890px]',
  sizing: 'min-h-[980px] sm:min-h-[740px] lg:min-h-[510px]',
  screen: 'min-h-[calc(100svh-160px)]',
};

/** Pulse box shown while a tool downloads; announces what is loading to screen readers. */
export function ToolPlaceholder({ tool, name }: { tool: ReservedTool; name: string }) {
  return (
    <div data-tool-reserve="" role="status" aria-label={`Loading ${name}`} className={`animate-pulse bg-slate-800 rounded-xl ${TOOL_PLACEHOLDER[tool]}`} />
  );
}

/**
 * The always-rendered area that holds the tab panels (browser acceptance, 2026-11-25).
 *
 * The per-panel reservation above exists only after hydration. On a slow phone
 * the visitor tapped the "Savings Calculator" link before hydration; the tools
 * area in the server HTML was short, so the footer was in view; after hydration
 * the ROI panel was inserted and pushed the footer down (CLS 0.28, measured,
 * source: the footer). This container is in the server HTML and is at least
 * one screen tall (100vh, which on phones is the large viewport, so the footer
 * stays out of view even with the address bar hidden). With the tab bar above
 * it, the footer starts below the screen, and a panel arriving later moves
 * nothing that is in view. Every tab is taller than one screen on a phone, so
 * no tab is left with an empty gap there; on a large desktop a short tab can
 * leave space up to one screen tall.
 */
export const TOOL_PANELS_CLASS = 'min-h-screen';

export function ToolPanelArea({ children }: { children: ReactNode }) {
  return <div data-tool-panels="" className={TOOL_PANELS_CLASS}>{children}</div>;
}

/** A `loading` function for resilient() / next/dynamic. */
export const toolPlaceholder = (tool: ReservedTool, name: string) => () => <ToolPlaceholder tool={tool} name={name} />;
