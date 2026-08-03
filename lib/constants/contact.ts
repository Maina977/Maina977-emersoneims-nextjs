/**
 * OFFICIAL EMERSON EIMS CONTACT INFORMATION
 *
 * This is the SINGLE SOURCE OF TRUTH for all contact details.
 * Import these constants throughout the website to ensure consistency.
 */

export const CONTACT = {
  // Primary contact numbers
  PRIMARY_PHONE: '0768860665',
  SECONDARY_PHONE: '0782914717',

  // International format
  PRIMARY_PHONE_INTL: '+254768860665',
  SECONDARY_PHONE_INTL: '+254782914717',

  // WhatsApp (using international format without +)
  PRIMARY_WHATSAPP: '254768860665',
  SECONDARY_WHATSAPP: '254782914717',

  // Email
  PRIMARY_EMAIL: 'info@emersoneims.com',
  SALES_EMAIL: 'sales@emersoneims.com',
  SUPPORT_EMAIL: 'support@emersoneims.com',

  // Physical address
  /*
   * VERIFIED PHYSICAL ADDRESS.
   *
   * This constant said "Industrial Area" until 2026-08-03, which
   * components/seo/LocalBusinessSchema.tsx has explicitly flagged as WRONG since
   * 2026-07-18: "Correct location: Embakasi, off Airport North Road — near KEMSA
   * Head Office, behind Coca-Cola, close to Pride Centre. NOT Industrial Area /
   * Commercial Street (that was wrong)."
   *
   * The corrected address was already in ~30 places across the site (footers,
   * LocalBusiness schema, og:street-address, the QR generator and the map) while
   * this constant still carried the old one — so the site contradicted itself.
   * Aligned here. Nothing was invented; this is the address the codebase already
   * treats as authoritative.
   *
   * Postal code 00519 comes from that same verified schema block. Note
   * lib/seo/seoConfig.ts separately carries a P.O. Box (387-00521) — that is a
   * postal box, not the physical location, and the two are not interchangeable
   * for LocalBusiness schema.
   */
  ADDRESS: {
    street: 'Embakasi, off Airport North Road',
    landmark: 'Near KEMSA Head Office, behind Coca-Cola, close to Pride Centre',
    city: 'Nairobi',
    region: 'Nairobi',
    postalCode: '00519',
    country: 'Kenya',
    full: 'Embakasi, off Airport North Road, Nairobi 00519, Kenya'
  },

  // Business hours
  HOURS: {
    weekday: 'Mon-Fri: 8:00 AM - 6:00 PM',
    saturday: 'Sat: 9:00 AM - 4:00 PM',
    emergency: '24/7 Emergency Service Available'
  }
} as const;

// Helper functions for generating contact URLs
export const getWhatsAppUrl = (
  phone: string = CONTACT.PRIMARY_WHATSAPP,
  message?: string
): string => {
  const baseUrl = `https://wa.me/${phone}`;
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
};

export const getTelUrl = (phone: string = CONTACT.PRIMARY_PHONE_INTL): string => {
  return `tel:${phone}`;
};

export const getEmailUrl = (
  email: string = CONTACT.PRIMARY_EMAIL,
  subject?: string,
  body?: string
): string => {
  const params = new URLSearchParams();
  if (subject) params.append('subject', subject);
  if (body) params.append('body', body);
  const query = params.toString();
  return `mailto:${email}${query ? `?${query}` : ''}`;
};

// Formatted display numbers
export const formatPhone = (phone: string): string => {
  // Format: 0768 860 665
  if (phone.startsWith('0') && phone.length === 10) {
    return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;
  }
  // Format: +254 768 860 665
  if (phone.startsWith('+254') && phone.length === 13) {
    return `+254 ${phone.slice(4, 7)} ${phone.slice(7, 10)} ${phone.slice(10)}`;
  }
  return phone;
};
