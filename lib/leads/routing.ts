/**
 * Department routing for website leads (owner, 2026-11-06):
 *   generator enquiries -> generator@emersoneims.com
 *   solar enquiries     -> solar@emersoneims.com
 *   info@emersoneims.com receives ALL enquiries (it is already in
 *   LEAD_RECIPIENTS in /api/contact).
 *
 * The department address is ADDED to the existing recipients, never used
 * instead of them, so a routing mistake can only send an extra copy and can
 * never lose a lead.
 */
export const DEPARTMENT_EMAILS = {
  generators: 'generator@emersoneims.com',
  solar: 'solar@emersoneims.com',
} as const;

const GENERATOR = /generat|genset|\bkva\b|\d\s*kva|voltka|cummins|perkins|caterpillar|\bcat\b|fg ?wilson|changeover|\bats\b|\bamf\b|synchroni[sz]/i;
const SOLAR = /solar|\bpv\b|photovoltaic/i;

/** Department mailboxes for one lead, from its service, source and message. */
export function departmentRecipients(lead: { service?: string; source?: string; message?: string }): string[] {
  // Service and source are set by the page, so they decide first. The message
  // is only consulted for the general forms, where the customer types the need.
  const tagged = `${lead.service ?? ''} ${lead.source ?? ''}`;
  const general = !lead.service || /^general/i.test(lead.service);
  const text = general ? `${tagged} ${lead.message ?? ''}` : tagged;
  const out: string[] = [];
  if (GENERATOR.test(text)) out.push(DEPARTMENT_EMAILS.generators);
  if (SOLAR.test(text)) out.push(DEPARTMENT_EMAILS.solar);
  return out;
}

/** Existing recipients plus department mailboxes, without duplicates. */
export function routedRecipients(base: readonly string[], lead: { service?: string; source?: string; message?: string }): string[] {
  const seen = new Set(base.map((a) => a.toLowerCase()));
  const extra = departmentRecipients(lead).filter((a) => !seen.has(a.toLowerCase()));
  return [...base, ...extra];
}
