/**
 * GOOGLE MEASUREMENT IDS.
 *
 * These are deliberately in source rather than in an environment variable, and
 * that is safe: a GA4 Measurement ID and a Google Ads conversion ID are PUBLIC
 * by design. Both are emitted into the HTML of every page for the browser to
 * read, so anyone can see them with View Source on any site that uses
 * analytics. They identify which property receives the data; they grant no
 * access to it. Reading the ID lets you send data TO the property, not read
 * anything FROM it.
 *
 * The conversion LABEL is treated the same way for the same reason — gtag
 * sends it in the clear.
 *
 * WHY NOT ONLY AN ENV VAR. The environment route was built first and works
 * (see the override below), but it requires someone with Vercel access to set
 * three values and redeploy. Keeping the known-good defaults here means the
 * site measures itself the moment this ships, and the env var still wins if it
 * is ever set — so moving to per-environment IDs later needs no code change.
 *
 * SOURCE OF THESE VALUES: GA.txt at the repository root, an untracked scratch
 * file holding two GA4 properties. Neither had ever been wired into the site —
 * verified against production on 2026-09-24, zero occurrences of either ID.
 *
 * BOTH ARE CONFIGURED, DELIBERATELY. gtag supports several config calls and
 * will report to each property independently. Which of the two is the current
 * one is not recorded anywhere in this repository, and guessing wrong means
 * collecting into a property nobody opens. Sending to both costs one extra
 * config call and guarantees the live one receives the data. Delete whichever
 * turns out to be stale from the array below — that is the whole change.
 */

/** Every GA4 property to report to. */
export const GA4_IDS: string[] = (
  process.env.NEXT_PUBLIC_GA_ID
    ? process.env.NEXT_PUBLIC_GA_ID.split(',')
    : ['G-1YQPD7PN51', 'G-ZHLF2TQH7N']
)
  .map((s) => s.trim())
  .filter((s) => /^G-[A-Z0-9]{6,}$/i.test(s));

/**
 * Google Ads conversion ID, e.g. AW-123456789.
 *
 * Not yet issued. It is created alongside a conversion action inside the Ads
 * account, and until one exists there is nothing to send. With this empty, no
 * Ads config is emitted and no conversion is reported — everything else still
 * works.
 */
export const GOOGLE_ADS_ID: string = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || '';

/**
 * The conversion action's label — the part after the slash in
 * send_to: "AW-123456789/AbC-D_efGh".
 *
 * The conversion ID alone sends nothing; this is the half people miss.
 */
export const GOOGLE_ADS_CONTACT_LABEL: string =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONTACT_LABEL || '';

/** True when at least one Google tag should load. */
export const HAS_GOOGLE_TAGS = GA4_IDS.length > 0 || GOOGLE_ADS_ID !== '';
