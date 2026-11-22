/**
 * Space reservation for the fixed cookie banner (components/compliance/CookieConsent.tsx).
 *
 * While the banner is visible it publishes its measured height as the CSS
 * variable `--consent-bar-h` on <html> and marks <html> with
 * `data-consent-bar="open"`. app/globals.css then:
 *   - pads <body> at the bottom by that height, so the last result or button on
 *     any page can always be scrolled fully above the banner;
 *   - sets `scroll-padding-bottom` on <html>, so keyboard focus and in-page
 *     scrolling stop above the banner instead of behind it.
 * Floating controls (accessibility button, WhatsApp bubble, install prompts,
 * tool-specific floating panels) add the same variable to their `bottom`, and
 * full-height tool frames subtract it from their height.
 *
 * Dismissing the banner (or unmounting it) removes both, so the space goes the
 * moment the bar does. The variable name is shared with the homepage hero,
 * which already reads it.
 */

export const CONSENT_BAR_VAR = '--consent-bar-h';
export const CONSENT_BAR_ATTR = 'data-consent-bar';

/**
 * Inline style for a fixed floating control that must sit `base` above the
 * bottom edge, and above the cookie banner while it is open.
 *
 * The control keeps a constant `bottom` and is lifted with the CSS `translate`
 * property instead (layout shift fix, 2026-11-22). Changing `bottom` when the
 * banner opened ~2 s after load moved the accessibility and Service Connect
 * buttons in layout, which Chrome counts as a layout shift on every page; a
 * translation is not a layout change, so it is not counted, and the controls
 * still end up in exactly the same place. `translate` is an independent
 * property, so it composes with any Tailwind `transform` utility (scale-75)
 * already on the element.
 */
export function floatAboveConsentBar(base: string): { bottom: string; translate: string } {
  return { bottom: base, translate: `0 calc(-1 * var(${CONSENT_BAR_VAR}, 0px))` };
}

/** Turn a measured height into a CSS length: whole pixels, never negative or NaN. */
export function consentBarLength(height: number): string {
  if (!Number.isFinite(height) || height <= 0) return '0px';
  return `${Math.ceil(height)}px`;
}

/** The minimal surface of <html> this module writes to (lets tests pass a stub). */
export interface ConsentBarRoot {
  style: {
    setProperty(name: string, value: string): void;
    removeProperty(name: string): string;
  };
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
}

/** Reserve `height` px at the bottom of the page for the visible banner. */
export function reserveConsentBarSpace(root: ConsentBarRoot, height: number): string {
  const length = consentBarLength(height);
  root.style.setProperty(CONSENT_BAR_VAR, length);
  root.setAttribute(CONSENT_BAR_ATTR, 'open');
  return length;
}

/** Give the space back once the banner is answered or unmounted. */
export function releaseConsentBarSpace(root: ConsentBarRoot): void {
  root.style.removeProperty(CONSENT_BAR_VAR);
  root.removeAttribute(CONSENT_BAR_ATTR);
}
