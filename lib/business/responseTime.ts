/**
 * Emergency response-time wording — the ONLY source for it. Owner-confirmed
 * 2026-10-18: "<4 h in the Nairobi metro; other counties by mobile workshop,
 * time depends on distance."
 *
 * Before this file existed the site gave at least a dozen different answers:
 * "2 hours", "<2 hrs", "2-4 hours nationwide", "30 mins Nairobi / 45 mins
 * Mombasa", "4-7 h urban / 8-14 regional", "<2 minutes" and several
 * "guaranteed" SLAs. Import these strings; do not write a response time into
 * a page by hand. Times outside Kenya are not confirmed — use RESPONSE_ABROAD.
 */
export const RESPONSE_NAIROBI = 'Under 4 hours in the Nairobi metro';
export const RESPONSE_NAIROBI_SHORT = '<4 h Nairobi metro';
export const RESPONSE_ELSEWHERE = 'Other counties by mobile workshop — response time depends on distance';
export const RESPONSE_ELSEWHERE_SHORT = 'By mobile workshop — depends on distance';
export const RESPONSE_SUMMARY = `${RESPONSE_NAIROBI}; other counties by mobile workshop, time depends on distance.`;
export const RESPONSE_ABROAD = 'Confirmed when you call — depends on location';
/** What a visitor is told after sending a form. No promised hour count. */
export const CALLBACK_PROMISE = 'Our team will contact you shortly.';
