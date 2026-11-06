/**
 * Category-specific enquiry forms (master brief §10, external audit §4).
 * Each config lists the fields the brief asks for; RfqForm renders them and
 * posts labelled lines to /api/contact. File uploads are deliberately absent:
 * they need paid storage the owner has not approved, so the forms point to
 * WhatsApp for photos instead.
 */

export type RfqField =
  | { kind: 'text' | 'number'; id: string; label: string; required?: boolean; placeholder?: string; max?: number }
  | { kind: 'textarea'; id: string; label: string; required?: boolean; placeholder?: string }
  | { kind: 'select'; id: string; label: string; options: readonly string[] };

export interface RfqConfig {
  id: 'service-request' | 'spare-parts' | 'borehole-assessment' | 'ups-sizing';
  title: string;
  intro: string;
  /** Sent as `service`; also drives lead routing (lib/leads/routing.ts). */
  service: string;
  submitLabel: string;
  successTitle: string;
  photoHint?: string;
  fields: readonly RfqField[];
}

export const RFQ_CONFIGS: Record<RfqConfig['id'], RfqConfig> = {
  'service-request': {
    id: 'service-request',
    title: 'Request a service or repair',
    intro: 'Tell us what is wrong and where. An engineer calls you to confirm the visit.',
    service: 'Service request',
    submitLabel: 'Request a technician',
    successTitle: 'Service request received',
    photoHint: 'Photos or a short video of the fault help. Send them on WhatsApp after submitting, quoting your reference.',
    fields: [
      { kind: 'select', id: 'equipment', label: 'Equipment', options: ['Generator', 'UPS', 'Solar system', 'Electric motor', 'Pump', 'Air conditioning', 'Electrical panel', 'Other'] },
      { kind: 'text', id: 'brand', label: 'Brand and model', placeholder: 'e.g. Perkins 100 kVA' },
      { kind: 'textarea', id: 'fault', label: 'What is the fault?', required: true, placeholder: 'What happens, any alarm or code shown, when it started' },
      { kind: 'select', id: 'urgency', label: 'How urgent', options: ['Emergency: equipment down now', 'This week', 'Planning ahead'] },
    ],
  },
  'spare-parts': {
    id: 'spare-parts',
    title: 'Ask for a spare part',
    intro: 'Give us what you have: a part number, or the engine model and what the part does.',
    service: 'Generator spare parts',
    submitLabel: 'Check availability',
    successTitle: 'Parts enquiry received',
    photoHint: 'A photo of the old part or its label speeds things up. Send it on WhatsApp after submitting, quoting your reference.',
    fields: [
      { kind: 'text', id: 'partNumber', label: 'Part number (if known)', placeholder: 'e.g. LF9009' },
      { kind: 'text', id: 'brand', label: 'Equipment brand', required: true, placeholder: 'e.g. Cummins, Perkins, Deep Sea' },
      { kind: 'text', id: 'model', label: 'Engine or equipment model', placeholder: 'e.g. 6BTA5.9' },
      { kind: 'text', id: 'serial', label: 'Serial number (optional)' },
      { kind: 'number', id: 'quantity', label: 'Quantity', max: 1000 },
    ],
  },
  'borehole-assessment': {
    id: 'borehole-assessment',
    title: 'Request a borehole site assessment',
    intro: 'A desktop assessment is preliminary. Siting, depth and yield are confirmed only by a field survey and test pumping.',
    service: 'Borehole site assessment',
    submitLabel: 'Request an assessment',
    successTitle: 'Assessment request received',
    photoHint: 'If you already have a survey report or permit, send it on WhatsApp after submitting, quoting your reference.',
    fields: [
      { kind: 'text', id: 'site', label: 'Site location (village, landmark or GPS)', required: true },
      { kind: 'select', id: 'use', label: 'Water for', options: ['Household', 'Livestock', 'Irrigation', 'School or institution', 'Commercial or industrial', 'Not sure'] },
      { kind: 'text', id: 'demand', label: 'Water needed per day', placeholder: 'e.g. 5,000 litres' },
      { kind: 'select', id: 'survey', label: 'Existing hydrogeological survey', options: ['No', 'Yes', 'Not sure'] },
      { kind: 'select', id: 'power', label: 'Pump power available', options: ['Grid (KPLC)', 'Solar', 'Generator', 'Not sure'] },
    ],
  },
  'ups-sizing': {
    id: 'ups-sizing',
    title: 'Get a UPS sized',
    intro: 'Tell us what must stay on and for how long. We size the UPS and batteries to it.',
    service: 'UPS sizing',
    submitLabel: 'Size my UPS',
    successTitle: 'UPS sizing request received',
    fields: [
      { kind: 'text', id: 'load', label: 'Load to protect', required: true, placeholder: 'e.g. 6 kW, or 12 PCs and 2 servers' },
      { kind: 'text', id: 'runtime', label: 'Backup time needed', placeholder: 'e.g. 30 minutes' },
      { kind: 'select', id: 'phase', label: 'Supply', options: ['Single phase', 'Three phase', 'Not sure'] },
      { kind: 'select', id: 'application', label: 'Used for', options: ['Office', 'Servers / data', 'Medical equipment', 'Industrial process', 'Home', 'Other'] },
      { kind: 'select', id: 'generator', label: 'Generator on site', options: ['Yes', 'No', 'Not sure'] },
    ],
  },
};
