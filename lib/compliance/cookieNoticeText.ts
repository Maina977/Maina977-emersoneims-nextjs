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
 * Kept to the length of the line it replaces (62 characters against 60) on
 * purpose. Below xl the notice is ONE text block, and HUB-03 (2026-11-27)
 * measured it at 10,081 px² on a phone, just under /hub/solar-ups' own caption
 * (10,982 px²). A longer line would make the consent notice that page's LCP
 * element again. The full detail is one tap away on /privacy#cookies.
 */
// PENDING management/legal approval (privacy correction 2026-11-27)
export const COOKIE_NOTICE_SHORT = 'Essential cookies; Google Analytics & Ads only if you accept. ';

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
  "on Google's own domains (such as IDE),",
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
