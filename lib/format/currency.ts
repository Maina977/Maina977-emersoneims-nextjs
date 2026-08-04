/**
 * Deterministic money formatting.
 *
 * WHY THIS EXISTS — a recurring hydration bug.
 *
 * `Number.prototype.toLocaleString()` with no locale argument uses whatever
 * locale the runtime happens to have. The Node process rendering on the server
 * and the browser rendering on the client frequently disagree, so the same
 * number becomes "600,000" in the server HTML and "600.000" in the client tree.
 * React sees the two trees differ, throws a hydration mismatch, and can discard
 * the server markup and re-render — which on a price table means the prices
 * visibly flicker or vanish.
 *
 * The bug is invisible until a component is server-rendered. It bit this
 * codebase once already, and again the moment GeneratorPriceList had its
 * `ssr: false` removed so Google could finally see the prices: 20 price strings
 * went from client-only to rendered on both sides, and every one of them was
 * built with a bare toLocaleString().
 *
 * Use these helpers anywhere a number is rendered. They produce byte-identical
 * output on every runtime because they do not consult a locale at all.
 */

/** 600000 -> "600,000". Always commas, every runtime, no locale lookup. */
export function formatKES(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** 600000 -> "KES 600,000". */
export function formatKESWithUnit(n: number): string {
  return `KES ${formatKES(n)}`;
}

/**
 * A price range, collapsing to a single figure when both ends match.
 * 500000, 500000 -> "KES 500,000"
 * 500000, 850000 -> "KES 500,000 - KES 850,000"
 */
export function formatKESRange(min: number, max: number): string {
  return min === max
    ? formatKESWithUnit(min)
    : `${formatKESWithUnit(min)} - ${formatKESWithUnit(max)}`;
}
