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

/**
 * Phones and tablets (below the xl breakpoint): one short line.
 *
 * Below xl the notice is ONE text block, and it competes for LCP with
 * /hub/solar-ups' own caption (11,022 px² at 390 px). Measured on a local
 * build on 28 Nov 2026 by swapping the line in before first paint:
 *   "Essential cookies; Google Analytics & Ads only if you accept."   11,520 px², notice became LCP
 *   "Essential cookies only. Google Analytics & Ads if you accept."   page caption stays LCP (as with the 6a38dffa line)
 * Wording changes here must be re-measured the same way
 * (scratchpad privacy-lcp-oldnew.cjs method). Full detail: /privacy#cookies.
 */
// PENDING management/legal approval (privacy correction 2026-11-27)
export const COOKIE_NOTICE_SHORT = 'Essential cookies only. Google Analytics & Ads if you accept. ';

/**
 * Wide screens (xl and up), as SHORT PHRASES. CookieConsent renders each one
 * as its own flex item (HUB-03): Chrome scores LCP per block, so no phrase
 * may be long. Keep each phrase to about 35 characters or fewer (about 5,100 px²
 * at text-sm). Joined with spaces, they read as the sentence below.
 */
// PENDING management/legal approval (privacy correction 2026-11-27)
export const COOKIE_NOTICE_FULL_PHRASES: readonly string[] = [
  'We use essential cookies',
  'to run this site',
  'and remember your choice.',
  'If you accept, we also use',
  'Google Analytics',
  'to measure how the site is used',
  'and Google Ads',
  'to measure our advertising;',
  'Google then receives data',
  'such as your IP address',
  'and device information',
  'and may process it outside Kenya.',
  // Management, 27 Nov 2026: disclose Google's own cookies (IDE, test_cookie
  // on doubleclick.net), which this site cannot delete.
  'Google Ads may also set cookies',
  // Split in two: as one phrase it measured 5,336 px² at 1280-1920 px, over
  // the HUB-03 limit of about 5,100 (largest phrase is now 4,530).
  "on Google's own domains",
  '(such as IDE),',
  'which we cannot delete.',
  'Nothing is sent to Google',
  'unless you accept.',
  'You can withdraw at any time',
  'in Cookie settings',
  'at the foot of every page:',
  'this stops future collection,',
  'but data already sent',
  "is handled under Google's terms.",
];

/** The wide-screen notice as one string (tests, the wording file). */
export const COOKIE_NOTICE_FULL = `${COOKIE_NOTICE_FULL_PHRASES.join(' ')} `;

/** Label of the control that re-opens the notice (footer, privacy page). */
export const COOKIE_SETTINGS_LABEL = 'Cookie settings';
