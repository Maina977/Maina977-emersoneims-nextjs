/**
 * COOKIE NOTICE WORDING, kept out of CookieConsent.tsx so the component's
 * layout can change independently of the text (and the reverse).
 *
 * PENDING management/legal approval (privacy correction 2026-11-27).
 * The exact proposed text, with the reasons for each sentence, is in
 * EmersonEIMS-proposals/privacy-consent-2026-11-27/PROPOSED-NOTICE-WORDING.md.
 * Change it there first, then here, so the two never disagree.
 *
 * WHAT IT REPLACES: "Your data is processed securely and never shared with
 * third parties." That was inaccurate: with consent, Google Analytics and
 * Google Ads run and Google receives the data; before 27 Nov 2026 Google also
 * received cookieless pings before any choice.
 *
 * WHAT IT MUST KEEP SAYING TRUE (checked against the code on 27 Nov 2026):
 *   - nothing is sent to Google unless the visitor accepts
 *     (components/analytics/GoogleTags.tsx loads the library only then);
 *   - withdrawal stops future collection at once, in the same page
 *     (haltGoogleTransmission in lib/compliance/googleConsent.ts), and it does
 *     NOT undo or delete what Google already received.
 */

/** Phones and tablets (below the xl breakpoint): one short line. */
// PENDING management/legal approval (privacy correction 2026-11-27)
export const COOKIE_NOTICE_SHORT =
  'Essential cookies only, unless you accept Google Analytics and Google Ads (data then goes to Google). Change any time in Cookie settings. ';

/** Wide screens (xl and up). */
// PENDING management/legal approval (privacy correction 2026-11-27)
export const COOKIE_NOTICE_FULL =
  'We use essential cookies to run this site and remember your choice. ' +
  'If you accept, we also use Google Analytics to measure how the site is used and Google Ads to measure our advertising; ' +
  'Google then receives data such as your IP address and device information and may process it outside Kenya. ' +
  'Nothing is sent to Google unless you accept. ' +
  "You can withdraw at any time in Cookie settings at the foot of every page: this stops future collection, but data already sent is handled under Google's terms. ";

/** Label of the control that re-opens the notice (footer, privacy page). */
export const COOKIE_SETTINGS_LABEL = 'Cookie settings';
