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
  /**
   * Where the copy we actually read was obtained, when that was NOT the OEM's
   * own site — a distributor or manual-mirror host.
   *
   * Several OEMs put their manuals behind a download form or dealer login, so
   * the copy consulted is often a mirror. Saying "source: deepseaelectronics.com"
   * when the PDF was pulled from a distributor overstates the provenance, and
   * overstated provenance is the exact failure this registry exists to prevent.
   * Name the mirror.
   */
  accessedVia?: string;
  /** Document revision / part number when present on the source. */
  revision?: string;
  notes?: string;
}

export interface VerifiedControllerSource {
  status: 'verified';
  sources: [ControllerSourceCitation, ...ControllerSourceCitation[]];
  /** Verification confidence as judged by the reviewer who installed the data. */
  verificationConfidence: 'high' | 'medium' | 'low';
  /**
   * Whether the shipped pin map covers the module's WHOLE published terminal
   * table, or only part of it.
   *
   * This exists because 'verified' on its own was being read as 'complete',
   * and a partial map presented as complete is its own hazard: a technician
   * who cannot find a terminal assumes the module does not have it. Where a
   * map is partial the panel says so and names what is missing.
   */
  completeness: 'complete' | 'partial';
  /** Required when completeness is 'partial': what the map does NOT cover. */
  coverageNote?: string;
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
  // ─────────────────────────────────────────────────────────────────────
  // Re-verified 2026-07-29. Every entry below was previously marked
  // 'verified / high confidence' while carrying FABRICATED pin data — the
  // same invented template (Red/Black/Purple/Orange wire colours, a
  // CRANK/FUEL/IDLE/STOP/PREHEAT output order) applied to four different
  // manufacturers. The citations were fabricated too: the DSE entry named
  // document "057-251, Sections 4.x" when the terminal tables are in
  // 057-253 section 3.2.
  //
  // Each entry below has now been read out of the manufacturer's own
  // terminal table and the pin map rebuilt from it. Do not mark anything
  // 'verified' here without opening the document and reading the table.
  // ─────────────────────────────────────────────────────────────────────
  'dse-7320': {
    status: 'verified',
    verificationConfidence: 'high',
    completeness: 'complete',
    sources: [
      {
        title: 'DSE7310 MKII & DSE7320 MKII Operator Manual',
        documentType: 'OEM operator manual',
        publisher: 'Deep Sea Electronics Ltd',
        url: 'https://www.deepseaelectronics.com/genset/auto-mains-utility-failure-control-modules/dse7320-mkii/downloads',
        revision: '057-253 Issue 7',
        accessedVia:
          'PDF copy mirrored by Bundu Power (bundupower.co.za), a DSE distributor. DSE serve the same document from their own downloads page.',
        notes:
          'All 58 terminals read from section 3.2 CONNECTION DESCRIPTIONS (pages 48-54): DC supply and E-stop, analogue sensors, MPU/ECU/DSENet, outputs C and D, generator and mains sensing, current transformers, digital inputs and RS485. Terminals 38-41 (mains sensing) are not fitted to the DSE7310 MKII.',
      },
    ],
  },
  'comap-inteligen': {
    status: 'verified',
    verificationConfidence: 'high',
    completeness: 'complete',
    sources: [
      {
        title: 'IGS-NT Installation Guide',
        documentType: 'OEM installation manual',
        publisher: 'ComAp a.s.',
        url: 'https://www.comap-control.com/products/controllers/paralleling-gen-set-controllers/inteligen/inteligen-nt-basebox/',
        accessedVia:
          'PDF copy mirrored by Alternative Energies (support.alternative-energies.fr), a ComAp distributor.',
        notes:
          'Terminal names and electrical limits read from section 7 "Terminals, Jumpers and I/O overview" and section 20 "Technical data". IG-NT has 12 binary inputs, 12 binary open-collector outputs (0.5 A, 36 V DC max) and 3 analog inputs. ComAp binary inputs and outputs are assigned in GenConfig, so they are listed as configurable rather than given fixed engine functions.',
      },
    ],
  },
  'smartgen-hgm9320': {
    status: 'verified',
    verificationConfidence: 'high',
    completeness: 'complete',
    sources: [
      {
        title:
          'HGM9310MPU/9320MPU/9310CAN/9320CAN Genset Controller User Manual',
        documentType: 'OEM operator manual',
        publisher: 'Zhengzhou SmartGen Technology Co., Ltd.',
        url: 'https://www.smartgen.com.cn/en/Pro_view/itemId/240/id/253.html',
        accessedVia: 'PDF copy mirrored by manuals.plus.',
        notes:
          'Terminals read from Table 12 "Description of Terminal Connection" (pages 28-30). Terminal 1 is B- and terminal 2 is B+; terminals 41-44 (mains sensing) are not fitted to the HGM9310 variants.',
      },
    ],
  },
  'woodward-easygen3000': {
    status: 'verified',
    verificationConfidence: 'medium',
    completeness: 'partial',
    coverageNote:
      'Only the power supply (terminals 61 PE, 63 supply +, 64 0 V) and relay outputs R1-R4 (terminals 30, 31, 32, 33, commoned on 35) have been read from Woodward documentation. The discrete inputs, analog inputs, generator and mains voltage measuring terminals, current transformer inputs, pickup input and serial interfaces are NOT yet covered — Woodward do not publish installation manual 37223 at a public URL. Use the Woodward manual for anything outside the terminals listed.',
    sources: [
      {
        title: 'easYgen-3000 Series Installation Manual',
        documentType: 'OEM installation manual',
        publisher: 'Woodward, Inc.',
        url: 'https://www.woodward.com/en/products/electrical-power-control/control-systems',
        accessedVia:
          'Woodward do not publish installation manual 37223 at a public URL. The power-supply and relay-output terminal figures were read from the ManualsLib mirror at https://www.manualslib.com/manual/1214275/Woodward-Easygen-3000.html. A third-party host is part of why this entry is medium confidence and partial coverage.',
        revision: '37223A',
        notes:
          'Power supply section (PE on terminal 61, 12/24 V DC supply on 63 with a 6 A protective device, 0 V on 64, wire 2.5 mm² / 14 AWG) and the relay output assignment R1 centralised alarm 30/35, R2 stopping alarm 31/35, R3 starter 32/35, R4 fuel solenoid or gas valve 33/35. Partial coverage — see coverageNote.',
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
  'powerwizard-20': {
    status: 'unsupported',
    reason:
      'CAT PowerWizard 2.0 previously shipped a 21-pin map in this panel. That ' +
      'map was fabricated — it followed the same invented template found in the ' +
      'DSE, SmartGen, ComAp and Woodward entries — and it was removed on ' +
      '2026-07-29. Caterpillar publish PowerWizard terminal data only through ' +
      'the paywalled Service Information System, so there was no verifiable ' +
      'source to replace it with. Use the Caterpillar wiring diagram supplied ' +
      'with the set. Do not repopulate CONTROLLER_PINS for this model without a ' +
      'traceable OEM document.',
    searchedSources: [
      'Caterpillar Service Information System (paywall)',
      'Cat dealer parts.cat.com (paywall)',
    ],
  },

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
