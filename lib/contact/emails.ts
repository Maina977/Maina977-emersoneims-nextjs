/**
 * Central contact / email registry for EmersonEIMS.
 *
 * Use these helpers anywhere CTA/contact UI is rendered so that
 * department emails are presented consistently and never scattered.
 */

export type EmailEntry = {
  /** Department / purpose label shown in UI. */
  label: string;
  /** Address. */
  address: string;
  /** One-line plain description of when to use it. */
  use: string;
  /** Optional contextual icon hint. */
  icon?: string;
};

export const COMPANY = {
  phonePrimary: '+254768860665',
  phoneEmergency: '+254782914717',
  whatsapp: 'https://wa.me/254768860665',
  websiteUrl: 'https://www.emersoneims.com',
} as const;

/** Master ordered list — used by footer, contact page and structured data. */
export const TEAM_EMAILS: ReadonlyArray<EmailEntry> = [
  {
    label: 'General Inquiries',
    address: 'info@emersoneims.com',
    use: 'Quotes, partnerships and general business questions.',
    icon: 'mail',
  },
  {
    label: 'Service Coordination',
    address: 'emersoneimservices@emersoneims.com',
    use: 'Site visits, scheduled maintenance and engineer dispatch.',
    icon: 'wrench',
  },
  {
    label: 'Generator Desk',
    address: 'generators@emersoneims.com',
    use: 'Generator sales, parts, ATS, controllers, fault diagnosis.',
    icon: 'zap',
  },
  {
    label: 'Solar & UPS Desk',
    address: 'solar@emersoneims.com',
    use: 'Solar PV, hybrid, batteries, UPS sizing and verification.',
    icon: 'sun',
  },
  {
    label: 'Sally — Direct Account',
    address: 'sally@emersoneims.com',
    use: 'Named account management, key clients and tender follow-up.',
    icon: 'user',
  },
];

/** Subset of email addresses used in OG / Person / ContactPoint schema. */
export const ALL_EMAILS = TEAM_EMAILS.map((e) => e.address);

/** Pick a department email from a topic keyword. Falls back to info@. */
export function emailForTopic(topic?: string): string {
  if (!topic) return 'info@emersoneims.com';
  const t = topic.toLowerCase();
  if (/(generator|gen-|ats|controller|cummins|voltka|power-?interruption)/.test(t)) return 'generators@emersoneims.com';
  if (/(solar|ups|battery|hybrid|inverter|pv|aquascan|borehole)/.test(t)) return 'solar@emersoneims.com';
  if (/(service|maintenance|pm|sla|repair|site-visit|site-audit)/.test(t)) return 'emersoneimservices@emersoneims.com';
  if (/(sally|account|tender|key-client)/.test(t)) return 'sally@emersoneims.com';
  return 'info@emersoneims.com';
}

/** Schema.org ContactPoint[] entries derived from the team emails. */
export const CONTACT_POINTS_SCHEMA = [
  {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'info@emersoneims.com',
    telephone: COMPANY.phonePrimary,
    areaServed: 'KE',
    availableLanguage: ['English', 'Swahili'],
  },
  {
    '@type': 'ContactPoint',
    contactType: 'technical support',
    email: 'emersoneimservices@emersoneims.com',
    telephone: COMPANY.phonePrimary,
    areaServed: 'KE',
    availableLanguage: ['English', 'Swahili'],
  },
  {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: 'generators@emersoneims.com',
    telephone: COMPANY.phonePrimary,
    productSupported: 'Generators, ATS, Controllers',
    areaServed: 'KE',
  },
  {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: 'solar@emersoneims.com',
    telephone: COMPANY.phonePrimary,
    productSupported: 'Solar PV, UPS, Batteries',
    areaServed: 'KE',
  },
  {
    '@type': 'ContactPoint',
    contactType: 'account management',
    email: 'sally@emersoneims.com',
    telephone: COMPANY.phonePrimary,
    areaServed: 'KE',
  },
  {
    '@type': 'ContactPoint',
    contactType: 'emergency service',
    telephone: COMPANY.phoneEmergency,
    hoursAvailable: '24/7',
    areaServed: 'KE',
  },
] as const;
