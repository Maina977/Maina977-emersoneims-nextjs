/**
 * Metadata copy and JSON-LD for /faults/[code] (app/faults/[code]/page.tsx).
 *
 * Pulled out of the page on 2026-11-25 (content-safety withdrawal) so the
 * structured data can be tested against the data that renders the page: the
 * HowTo is built from `troubleshootingSteps` and the FAQPage from
 * `faqQuestions`, exactly as the page shows them. An empty step list emits NO
 * HowTo (an empty HowTo is invalid and would describe steps the page does not
 * show); an empty FAQ list emits no FAQPage.
 */
import type { FaultCode } from '@/lib/data/faultCodes';

/**
 * Codes whose content was partly or wholly withdrawn by the content-safety
 * withdrawal of 2026-11-25 (CONTENT-SAFETY-CLASSIFICATION.md, F-W1). The page
 * shows SafetyChecksWithdrawnNotice where the withdrawn block was.
 */
export const FAULT_CONTENT_WITHDRAWN: Record<string, { steps?: boolean; faq?: boolean }> = {
  'SPN-190': { steps: true },
  'SPN-100': { steps: true, faq: true },
  'SPN-110': { steps: true },
  'SPN-157': { steps: true, faq: true },
  'DSE-FAIL-TO-START': { steps: true, faq: true },
  'DSE-UNDERSPEED': { faq: true },
  'DSE-LOW-OIL-PRESSURE': { steps: true, faq: true },
  'DSE-LOW-FUEL-LEVEL': { steps: true, faq: true },
  'DSE-HIGH-COOLANT-TEMPERATURE': { steps: true, faq: true },
  'DSE-EMERGENCY-STOP': { steps: true, faq: true },
  'DSE-GENERATOR-OVER-VOLTAGE': { faq: true },
  'COMAP-LOW-OIL-PRESSURE': { steps: true, faq: true },
  'COMAP-OVERSPEED': { steps: true, faq: true },
  'COMAP-HIGH-COOLANT-TEMPERATURE': { faq: true },
  'COMAP-START-FAIL': { faq: true },
  'COMAP-GENERATOR-OVER-FREQUENCY': { faq: true },
  'PERKINS-110': { faq: true },
  'PERKINS-100': { steps: true, faq: true },
  'DSE-REVERSE-POWER': { faq: true },
  'DSE-EARTH-FAULT': { steps: true, faq: true },
  'COMAP-LOW-BATTERY-VOLTAGE': { faq: true },
  'COMAP-SPEED-SIGNAL-LOST': { faq: true },
  'PERKINS-190': { steps: true },
};

/** "Cummins 111" for "CUMMINS-111"; "J1939 SPN-100" otherwise. */
export function faultCodeLabel(fault: FaultCode): string {
  const brandPrefix = fault.brand.toUpperCase() + '-';
  return fault.code.toUpperCase().startsWith(brandPrefix)
    ? `${fault.brand} ${fault.code.slice(brandPrefix.length)}`
    : `${fault.brand} ${fault.code}`;
}

/**
 * Meta description. Identification wording only: since 2026-11-25 the pages no
 * longer promise steps that clear the fault (those steps were withdrawn on
 * STOP-type alarms, and a promise to clear an alarm invites a reset).
 */
export function faultMetaDescription(fault: FaultCode): string {
  const codeLabel = faultCodeLabel(fault);
  const fullDescription = fault.alarm
    ? `What the ${fault.brand} "${fault.title}" alarm means, its likely causes and the parts involved. Generator support across Kenya.`
    : `${codeLabel} means ${fault.title}. Its likely causes and the parts involved. Generator support across Kenya.`;
  // Under ~155 characters so search results show it whole (2026-10-25 audit:
  // 172 characters on /faults/cummins-111): drop the closing line first.
  if (fullDescription.length <= 155) return fullDescription;
  const trimmed = fullDescription.replace(/ Generator support across Kenya\.$/, '');
  // Cut at a word boundary only when the text is actually too long (the old
  // inline version always dropped the last word, e.g. "…to clear the").
  if (trimmed.length <= 155) return trimmed;
  return trimmed.slice(0, 155).replace(/\s+\S*$/, '').replace(/[,;:]$/, '') + '…';
}

/** HowTo for the steps the page shows, or null when there are none. */
export function buildFaultHowTo(fault: FaultCode): Record<string, unknown> | null {
  if (fault.troubleshootingSteps.length === 0) return null;
  const codeLabel = faultCodeLabel(fault);
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: fault.alarm
      ? `Checks for the ${fault.brand} ${fault.title} Alarm`
      : `Checks for ${codeLabel} - ${fault.title}`,
    description: fault.description,
    step: fault.troubleshootingSteps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: step,
    })),
    tool: fault.relatedParts.map((part) => ({
      '@type': 'HowToTool',
      name: part,
    })),
  };
}

/** FAQPage for the questions the page shows, or null when there are none. */
export function buildFaultFaqPage(fault: FaultCode): Record<string, unknown> | null {
  if (!fault.faqQuestions || fault.faqQuestions.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: fault.faqQuestions.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
