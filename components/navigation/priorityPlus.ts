/**
 * Priority+ for the desktop nav bar (components/navigation/TeslaStyleNavigation.tsx).
 *
 * The bar measures itself after hydration and moves whatever does not fit into
 * a MORE menu. Until 2026-11-22 the server rendered ALL items, so at common
 * laptop widths the row first overflowed to the left and then, about a second
 * after load, the trailing items collapsed and the rest jumped ~150 px to the
 * right: a layout shift on every page (Priority 3, layout shifts).
 *
 * Now the server HTML already hides the items that the measurement will hide,
 * using viewport breakpoints (PREDICTED_ITEM_CLASS / PREDICTED_MORE_CLASS), so
 * the measurement normally confirms what is on screen and nothing moves. The
 * measurement stays authoritative: at zoom levels, other fonts or a future
 * label change it simply corrects the bar, as before.
 *
 * The breakpoints are not guesses. They are where fitNavItems() changes its
 * answer for the bar's measured item widths (REFERENCE_WIDTHS, Inter at
 * 12 px / 0.08em, measured on a local production build); the unit test
 * recomputes them, so changing a label or the arithmetic without updating
 * them fails the test.
 */

/** Width reserved for the MORE control while items remain after the current one. */
export const MORE_WIDTH = 92;

/**
 * How many leading items fit on the bar. `widths` are the items' own widths in
 * order; `gap` is the row's column gap; the pinned tail (GET QUOTE) is always
 * kept. Returns null while any width is still unknown (0), so the caller can
 * measure again on the next frame instead of guessing.
 */
export function fitNavItems(widths: readonly number[], rowWidth: number, tailWidth: number, gap: number, moreWidth = MORE_WIDTH): number | null {
  let used = 0;
  let fit = 0;
  for (let i = 0; i < widths.length; i++) {
    const w = widths[i] ?? 0;
    if (!w) return null;
    // Reserve room for MORE, and for the gap before it, only while items remain.
    const reserve = i < widths.length - 1 ? moreWidth + gap : 0;
    // Every item after the first is preceded by a gap.
    const candidate = used + (fit > 0 ? gap : 0) + w;
    if (candidate + tailWidth + reserve > rowWidth) break;
    used = candidate;
    fit++;
  }
  return fit;
}

/**
 * Item widths (px, offsetWidth) as measured on 2026-11-22: below 1280 px the
 * items use px-3 and gap-1, from 1280 px (Tailwind xl) px-4 and gap-2.
 * Order: HOME, PRODUCTS, SERVICES, REPAIR CENTRE, ENGINEERING TOOLS,
 * INDUSTRIES, RESOURCES, CONTACT.
 */
export const REFERENCE_WIDTHS = {
  lg: { items: [82, 117, 108, 160, 196, 105, 123, 90], gap: 4, tail: 123 },
  xl: { items: [90, 125, 116, 168, 204, 113, 131, 98], gap: 8, tail: 123 },
} as const;

/** The nav row is the viewport minus logo, paddings and gaps (measured: 154 px), capped by the 1440 px container. */
export function navRowWidth(viewportWidth: number): number {
  return Math.min(viewportWidth, 1440) - 154;
}

/** Smallest viewport width (px) at which item i is shown; 0 = from lg (1024 px) up. */
export const PREDICTED_MIN_VIEWPORT = [0, 0, 0, 0, 1052, 1161, 1372, 1378] as const;

/*
 * Literal class names (Tailwind only generates classes it can find written out
 * in full in a scanned file; components/** is scanned). Keep in step with
 * PREDICTED_MIN_VIEWPORT; the unit test checks they agree.
 */
export const PREDICTED_ITEM_CLASS = [
  '',
  '',
  '',
  '',
  'hidden min-[1052px]:block',
  'hidden min-[1161px]:block',
  'hidden min-[1372px]:block',
  'hidden min-[1378px]:block',
] as const;

/** MORE is shown until the last item fits. */
export const PREDICTED_MORE_CLASS = 'min-[1378px]:hidden';

/** The count the server-rendered breakpoints show at a given viewport width. */
export function predictedVisibleCount(viewportWidth: number): number {
  return PREDICTED_MIN_VIEWPORT.filter((min) => viewportWidth >= min).length;
}
