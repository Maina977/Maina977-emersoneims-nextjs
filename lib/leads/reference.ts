/**
 * Customer-facing enquiry reference, e.g. "EIMS-000034".
 *
 * Built from the database lead id /api/contact already creates, so the number
 * a customer quotes on the phone is the same one in the lead email and in the
 * database. Null when the lead was not stored (no id), so no form ever shows a
 * reference that cannot be found.
 */
export function leadReference(leadId: unknown): string | null {
  const n = typeof leadId === 'number' ? leadId : Number(leadId);
  if (!Number.isInteger(n) || n <= 0) return null;
  return `EIMS-${String(n).padStart(6, '0')}`;
}

/** Read the reference from an /api/contact JSON response, tolerating older shapes. */
export function referenceFromResponse(json: unknown): string | null {
  if (!json || typeof json !== 'object') return null;
  const o = json as { reference?: unknown; leadId?: unknown };
  if (typeof o.reference === 'string' && /^EIMS-\d{6,}$/.test(o.reference)) return o.reference;
  return leadReference(o.leadId);
}
