/**
 * Service Connect — the six customer actions (owner-approved Phase 1,
 * 2026-10-18). One list, used by the floating launcher
 * (components/chat/WhatsAppButton.tsx), the mobile menu and /service-connect,
 * so they can never disagree.
 *
 * Phase 1 builds on what already works: /booking and /contact both deliver to
 * the /api/contact lead pipeline. There is no ticket database yet, so "Track
 * my job" opens WhatsApp honestly instead of pretending to track anything.
 */
export const COMPANY_PHONE_TEL = '+254768860665';
export const COMPANY_PHONE_DISPLAY = '0768 860 665';
export const WHATSAPP_NUMBER = '254768860665';

export const waLink = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export interface ServiceAction {
  id: 'request-service' | 'talk-engineer' | 'book-technician' | 'request-quote' | 'emergency' | 'track-job';
  icon: string;
  label: string;
  hint: string;
  href: string;
  /** opens WhatsApp / the dialler rather than a page on this site */
  external?: boolean;
  urgent?: boolean;
}

export const SERVICE_ACTIONS: ServiceAction[] = [
  { id: 'emergency', icon: '🚨', label: 'Emergency Assistance', hint: `Call ${COMPANY_PHONE_DISPLAY} now`, href: `tel:${COMPANY_PHONE_TEL}`, external: true, urgent: true },
  { id: 'request-service', icon: '🔧', label: 'Request a Service', hint: 'Repairs and maintenance', href: '/booking?type=generator-service' },
  { id: 'book-technician', icon: '📍', label: 'Book a Technician', hint: 'Schedule a site visit', href: '/booking?type=site-survey' },
  { id: 'talk-engineer', icon: '👷', label: 'Talk to an Engineer', hint: 'Technical consultation', href: '/contact?type=engineer' },
  { id: 'request-quote', icon: '📋', label: 'Request a Quote', hint: 'Equipment and spare parts', href: '/contact?type=quote' },
  { id: 'track-job', icon: '📦', label: 'Track My Job', hint: 'Ask for an update on WhatsApp', href: waLink('Hello EmersonEIMS, I would like an update on my job. My name / reference is: '), external: true },
];
