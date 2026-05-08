/**
 * Generator Oracle — Controller wiring data provenance registry.
 *
 * For every controller in the wiring panel catalog we record:
 *   - status:       'verified' | 'unsupported'
 *   - sources[]:    OEM document(s) the pinout was extracted from
 *                   (only present for 'verified' entries)
 *   - reason:       why an entry is 'unsupported'
 *                   (only present for 'unsupported' entries)
 *
 * The user-facing rule is strict, per the project data policy:
 *   - 'verified'    → pinout shipped in CONTROLLER_PINS, sourced from a
 *                     traceable OEM installation manual / wiring diagram.
 *   - 'unsupported' → no pinout shipped, the wiring panel must show the
 *                     WIRING_UNAVAILABLE warning, PDF export is blocked,
 *                     and DSE 7320 wiring must NEVER be substituted.
 *
 * Adding a new entry to this file does NOT itself make a pinout appear
 * in the UI. The pinout must also be added to CONTROLLER_PINS in
 * `components/generator-oracle/panels/WiringDiagramsPanel.tsx`. This
 * registry is the audit trail for what is and isn't safe to render.
 *
 * @copyright 2026 EmersonEIMS / Generator Oracle
 */

export interface ControllerSourceCitation {
  title: string;
  documentType:
    | 'OEM installation manual'
    | 'OEM operator manual'
    | 'OEM datasheet'
    | 'OEM wiring diagram'
    | 'OEM technical reference';
  publisher: string;
  /** Public OEM document hub URL or product-page URL where the source lives. */
  url?: string;
  /** Document revision / part number when present on the source. */
  revision?: string;
  notes?: string;
}

export interface VerifiedControllerSource {
  status: 'verified';
  sources: [ControllerSourceCitation, ...ControllerSourceCitation[]];
  /** Verification confidence as judged by the reviewer who installed the data. */
  verificationConfidence: 'high' | 'medium' | 'low';
}

export interface UnsupportedControllerSource {
  status: 'unsupported';
  /** Plain-language reason a verified pinout has not been shipped yet. */
  reason: string;
  /** Document hubs / product pages that were checked during the search. */
  searchedSources: string[];
}

export type ControllerSourceEntry =
  | VerifiedControllerSource
  | UnsupportedControllerSource;

/**
 * Why we mark every non-DSE-7320 / non-ComAp-InteliGen / non-SmartGen-HGM9320 /
 * non-Woodward-easYgen-3000 controller `unsupported` and not "verified":
 *
 *   The terminal/pin maps for these controllers vary by hardware revision,
 *   firmware version, and option board. A single pinout published without a
 *   revision/firmware anchor and without a traceable OEM source is the exact
 *   substitution failure mode (DSE 7320 → other brand) that the wiring guard
 *   was added to prevent. Per project data policy, "the user considers
 *   unlabelled estimates as 'sabotage' — treat data credibility as highest
 *   priority". Therefore unsupported controllers stay unsupported in the UI
 *   until an OEM document with a traceable revision is added to this registry
 *   AND the corresponding entry is added to CONTROLLER_PINS.
 *
 *   The `searchedSources` list below records the public OEM document hubs
 *   that were checked. Anyone with a verified PDF copy of the named manuals
 *   can extend coverage by adding the entry here and the pin map in the
 *   wiring panel — no other code change is required.
 */

export const CONTROLLER_SOURCES: Record<string, ControllerSourceEntry> = {
  // ─────────── Verified entries ───────────
  'dse-7320': {
    status: 'verified',
    verificationConfidence: 'high',
    sources: [
      {
        title: 'DSE 7320 MKII Operator Manual',
        documentType: 'OEM operator manual',
        publisher: 'Deep Sea Electronics plc',
        url: 'https://www.deepseaelectronics.com/depot/documents/manuals/057-251',
        revision: '057-251',
        notes:
          'Pin/terminal mapping for DSE 7320 MKII genset controller. Wiring panel data extracted from connector tables (Sections 4.x).',
      },
    ],
  },
  'comap-inteligen': {
    status: 'verified',
    verificationConfidence: 'high',
    sources: [
      {
        title: 'InteliGen NT — Reference Guide (Hardware)',
        documentType: 'OEM technical reference',
        publisher: 'ComAp a.s.',
        url: 'https://www.comap-control.com/products/detail/inteligen-nt',
        notes:
          'Pin/terminal mapping for InteliGen NT BaseBox. Wiring panel data extracted from controller hardware reference.',
      },
    ],
  },
  'smartgen-hgm9320': {
    status: 'verified',
    verificationConfidence: 'high',
    sources: [
      {
        title: 'SmartGen HGM9320 User Manual',
        documentType: 'OEM operator manual',
        publisher: 'Zhengzhou SmartGen Technology Co., Ltd.',
        url: 'https://www.smartgen.com.cn/en/Pro_view/itemId/240/id/253.html',
        notes:
          'Pin/terminal mapping for HGM9320 AMF + load-share controller.',
      },
    ],
  },
  'woodward-easygen3000': {
    status: 'verified',
    verificationConfidence: 'high',
    sources: [
      {
        title: 'Woodward easYgen-3000 Series Installation Manual',
        documentType: 'OEM installation manual',
        publisher: 'Woodward, Inc.',
        url: 'https://www.woodward.com/en/products/electrical-power-control/control-systems/easygen-3000xt',
        notes:
          'Pin/terminal mapping for easYgen-3000 base hardware. Wiring panel data extracted from terminal assignment tables.',
      },
    ],
  },

  // ─────────── Unsupported entries (17) ───────────
  // DSE — additional models. Keep separate per-model entries; do NOT collapse.
  'dse-7310': unsupported('DSE 7310 MKII', ['Deep Sea Electronics document depot']),
  'dse-6020': unsupported('DSE 6020 MKII', ['Deep Sea Electronics document depot']),
  'dse-6120': unsupported('DSE 6120 MKII', ['Deep Sea Electronics document depot']),
  'dse-4520': unsupported('DSE 4520', ['Deep Sea Electronics document depot']),
  'dse-8610': unsupported('DSE 8610 MKII', ['Deep Sea Electronics document depot']),
  'dse-8660': unsupported('DSE 8660 MKII', ['Deep Sea Electronics document depot']),

  // ComAp
  'comap-intelilite': unsupported('ComAp InteliLite NT', ['ComAp Resource Hub']),
  'comap-intelisys': unsupported('ComAp InteliSys NT', ['ComAp Resource Hub']),
  'comap-intelimains': unsupported('ComAp InteliMains NT', ['ComAp Resource Hub']),

  // Woodward
  'woodward-easygen2000': unsupported('Woodward easYgen-2000', ['Woodward Manuals']),
  'woodward-dtsc200': unsupported('Woodward DTSC-200', ['Woodward Manuals']),

  // SmartGen
  'smartgen-hgm6120': unsupported('SmartGen HGM6120', ['SmartGen Document Center']),
  'smartgen-hgm7220': unsupported('SmartGen HGM7220', ['SmartGen Document Center']),
  'smartgen-hgm9510': unsupported('SmartGen HGM9510', ['SmartGen Document Center']),

  // PowerWizard (Caterpillar)
  'powerwizard-10': unsupported('CAT PowerWizard 1.0', [
    'Caterpillar Service Information System (paywall)',
    'Cat dealer parts.cat.com (paywall)',
  ]),
  'powerwizard-11': unsupported('CAT PowerWizard 1.1', [
    'Caterpillar Service Information System (paywall)',
    'Cat dealer parts.cat.com (paywall)',
  ]),
  'powerwizard-20': unsupported('CAT PowerWizard 2.0', [
    'Caterpillar Service Information System (paywall)',
    'Cat dealer parts.cat.com (paywall)',
  ]),

  // Datakom
  'datakom-d500': unsupported('Datakom D-500', ['Datakom Documents']),
  'datakom-d700': unsupported('Datakom D-700', ['Datakom Documents']),
  'datakom-dkg309': unsupported('Datakom DKG-309', ['Datakom Documents']),
  'datakom-dkg517': unsupported('Datakom DKG-517', ['Datakom Documents']),

  // Lovato
  'lovato-rgk800': unsupported('Lovato RGK800', ['Lovato Electric documentation portal']),
  'lovato-rgk900': unsupported('Lovato RGK900', ['Lovato Electric documentation portal']),
  'lovato-atl800': unsupported('Lovato ATL800', ['Lovato Electric documentation portal']),

  // Siemens
  'siemens-sicam': unsupported('Siemens SICAM A8000', ['Siemens Industry Online Support']),
  'siemens-sentron': unsupported('Siemens SENTRON PAC', ['Siemens Industry Online Support']),
  'siemens-siprotec': unsupported('Siemens SIPROTEC 7SJ', ['Siemens Industry Online Support']),

  // ENKO
  'enko-gcu300': unsupported('ENKO GCU-300', ['ENKO product documents']),
  'enko-gcu500': unsupported('ENKO GCU-500', ['ENKO product documents']),
  'enko-sync200': unsupported('ENKO SYNC-200', ['ENKO product documents']),

  // Volvo Penta VODIA
  'vodia-vodia5': unsupported('Volvo Penta VODIA5', [
    'Volvo Penta dealer technical portal (dealer-only)',
  ]),
  'vodia-vodia6': unsupported('Volvo Penta VODIA6', [
    'Volvo Penta dealer technical portal (dealer-only)',
  ]),
  'vodia-ecu': unsupported('Volvo Penta D13 ECU', [
    'Volvo Penta dealer technical portal (dealer-only)',
  ]),
};

function unsupported(
  displayName: string,
  searchedSources: string[],
): UnsupportedControllerSource {
  return {
    status: 'unsupported',
    reason:
      `Verified OEM pin/terminal data for ${displayName} has not been added to ` +
      `the wiring registry. Per project data policy the wiring panel will not ` +
      `synthesise or substitute (e.g. DSE 7320) pinouts. Add an entry to this ` +
      `file AND the corresponding pin map to CONTROLLER_PINS in ` +
      `WiringDiagramsPanel.tsx once an OEM document is obtained.`,
    searchedSources,
  };
}

export function getControllerSource(controllerId: string): ControllerSourceEntry | undefined {
  return CONTROLLER_SOURCES[controllerId];
}

export function isControllerVerified(controllerId: string): boolean {
  return CONTROLLER_SOURCES[controllerId]?.status === 'verified';
}
