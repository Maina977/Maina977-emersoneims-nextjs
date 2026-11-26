/**
 * Payment reference checks for the public verify routes (security hotfix 2,
 * 2026-11-26, independent review of 5b2eb01d).
 *
 * The Paystack and Flutterwave verify routes put the caller's reference into
 * the provider URL, unencoded, on a request that carries the site's secret
 * key, so `../../transaction/<id>` reached other provider endpoints. Every
 * reference is now checked against a strict pattern before any fetch and
 * encoded where it is used.
 *
 * Site references look like SGP-<ms>-<hex>, pay_<ms> or a report/analysis id;
 * M-Pesa checkout ids look like ws_CO_<digits>. "/", "%", "?", "#", "&" and
 * whitespace are never allowed, and a reference made only of dots ("." or
 * "..", which URL parsing treats as path steps) is refused.
 */
const REFERENCE = /^[A-Za-z0-9_.=-]{1,100}$/;
const TRANSACTION_ID = /^\d{1,20}$/;

export function isPaymentReference(v: unknown): v is string {
  return typeof v === 'string' && REFERENCE.test(v) && !/^\.+$/.test(v);
}

export function isProviderTransactionId(v: unknown): v is string {
  return typeof v === 'string' && TRANSACTION_ID.test(v);
}
