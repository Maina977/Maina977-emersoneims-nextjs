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
  /*
   * DSE7310 MKII — same OEM manual as the DSE7320 MKII, one documented delta.
   *
   * DSE publish a single document for both modules (057-253). Their own
   * Installation Instructions record that terminals 38 to 41 are absent on the
   * 7310 MKII. In the verified 7320 data those four are the Mains (utility)
   * L1/L2/L3/Neutral sensing inputs — which is exactly why DSE categorise the
   * 7310 as Manual & Auto Start and the 7320 as Auto Mains Failure.
   *
   * The 7310 therefore carries 54 of the 7320's 58 terminals. The terminal
   * NUMBERS and the signal each carries are facts read from the manufacturer's
   * table; the descriptive text is our own wording, already reviewed for the
   * 7320. Nothing is transcribed from the manual and nothing is invented.
   */
  'dse-7310': {
    status: 'verified',
    verificationConfidence: 'high',
    completeness: 'complete',
    coverageNote:
      '54 terminals. Terminals 38-41 (Mains L1/L2/L3/N) are absent on this model per DSE 053-181.',
    sources: [
      {
        title: 'DSE7310 MKII & DSE7320 MKII Installation Instructions',
        documentType: 'OEM installation manual',
        publisher: 'Deep Sea Electronics Ltd',
        url: 'https://www.deepseaelectronics.com/genset/manual-auto-start-control-modules/dse7310-mkii/downloads/installation-instructions',
        revision: '053-181 Issue 7',
        accessedVia:
          'Served directly by Deep Sea Electronics from deepseaelectronics.com — not a distributor mirror.',
        notes:
          'States that terminals 38 to 41 are absent on the 7310 MKII, and directs the reader to DSE Publication 057-253 for the full wiring diagram. That single sentence is the only terminal-level difference between the two modules.',
      },
      {
        title: 'DSE7310 MKII & DSE7320 MKII Operator Manual',
        documentType: 'OEM operator manual',
        publisher: 'Deep Sea Electronics Ltd',
        url: 'https://www.deepseaelectronics.com/genset/manual-auto-start-control-modules/dse7310-mkii/downloads',
        revision: '057-253 Issue 7',
        accessedVia:
          'Same document as the DSE7320 MKII entry below — DSE publish one manual covering both modules.',
        notes:
          'Section 3.2 CONNECTION DESCRIPTIONS is the source for all 54 retained terminals.',
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
  // 'dse-7310' is no longer listed here — it is VERIFIED above, sourced from the
  // DSE7310/DSE7320 shared manual (057-253) plus DSE's own Installation
  // Instructions (053-181 Issue 7). Leaving the stub here as well produced a
  // duplicate object key, which TypeScript rejects.
  /*
   * DSE6020 MKII — PARTIAL. Terminals 1-15 only.
   *
   * Read from the DSE6010 MKII & DSE6020 MKII Operator Manual (DSE Publication
   * 057-230), page 29 (DC supply, emergency stop, DC outputs, charge fail) and
   * page 30 (analogue sensors). Terminals 1-15 are common to both modules.
   *
   * WHY IT STOPS AT 15, and why that is deliberate:
   *   - terminals 16-17 did not render in the source consulted, and
   *   - terminals 18-21 came back ambiguous: the same numbers were returned for
   *     BOTH the magnetic pickup and the CAN port, which cannot both be right.
   * Putting a technician on a CAN terminal when they are wiring a magnetic
   * pickup is precisely the hazard this registry exists to prevent, so the
   * ambiguous range is omitted rather than guessed. The panel shows the
   * coverageNote below so nobody reads the short list as the whole module.
   *
   * To complete: read pages 30-32 of 057-230 and add terminals 16 onward,
   * including the mains sensing terminals 29-32 (fitted to the 6020, absent on
   * the 6010).
   */
  'dse-6020': {
    status: 'verified',
    verificationConfidence: 'medium',
    completeness: 'partial',
    coverageNote:
      '33 of the module terminals are shown: 1-15 (DC supply, emergency stop, fuel and start outputs, charge fail, configurable outputs C-F, analogue sensors), 25-32 (generator and mains voltage sensing), 33-36 (current transformers) and 38-43 (configurable digital inputs). Terminals 16-24 and 37 are NOT shown — two readings of the manual disagreed on where the magnetic pickup group ends and the CAN group begins, so that range is withheld rather than guessed. Use the manufacturer documentation for those terminals.',
    sources: [
      {
        title: 'DSE6010 MKII & DSE6020 MKII Operator Manual',
        documentType: 'OEM operator manual',
        publisher: 'Deep Sea Electronics Ltd',
        url: 'https://www.deepseaelectronics.com/genset/auto-mains-utility-failure-control-modules/dse6020-mkii/downloads',
        revision: '057-230 Issue 1',
        accessedVia:
          'Page-level HTML rendering of the manual on ManualsLib (manualslib.com), pages 29-30. The PDF DSE serve, and the distributor mirrors of it, are subset-font encoded and decode to control characters.',
        notes:
          'Terminal numbers and cable sizes are facts read from the manufacturer table; the description text against each terminal is our own wording. Terminals 29-32 are mains sensing and are noted in the manual as not fitted to the DSE6010 MKII.',
      },
    ],
  },
  'dse-6120': {
    status: 'verified',
    verificationConfidence: 'high',
    completeness: 'complete',
    sources: [
      {
        title: 'DSE6110 MKII & DSE6120 MKII Operator Manual',
        documentType: 'OEM operator manual',
        publisher: 'Deep Sea Electronics Ltd',
        url: 'https://www.deepseaelectronics.com/genset/auto-mains-utility-failure-control-modules/dse6120-mkii/downloads',
        revision: '057-236 Issue 1',
        accessedVia:
          'Page-level HTML rendering of the manual on ManualsLib (manualslib.com), pages 29-33. The PDF is subset-font encoded and decodes to control characters, as with every other DSE operator manual tried.',
        notes:
          'Terminal numbers and cable sizes are facts read from the manufacturer tables; the description against each terminal is our own wording. Terminal 37 is deliberately absent from our data because the manual prints no description or cable size against it. Model difference recorded in the same manual: terminals 29-32 (mains sensing) are not fitted to the DSE6110 MKII. Despite the similar name this module is NOT the DSE6020 MKII — the magnetic pickup and CAN terminal numbers differ between the two, which is why numbers are never carried across DSE families.',
      },
    ],
  },
  /*
   * DSE4520 — complete, all 32 terminals.
   *
   * Every table on pages 26-29 of 057-171 came back unambiguous with no
   * overlapping terminal numbers, which is why this one is 'complete' where the
   * DSE6020 is 'partial'.
   *
   * This module numbers differently from the 6000/7000 series — no separate
   * emergency stop terminal, so fuel sits at 3 and start at 4. Terminal numbers
   * must never be pattern-matched across DSE families.
   */
  'dse-4520': {
    status: 'verified',
    verificationConfidence: 'high',
    completeness: 'complete',
    sources: [
      {
        title: 'DSE4510 & DSE4520 Operator Manual',
        documentType: 'OEM operator manual',
        publisher: 'Deep Sea Electronics Ltd',
        url: 'https://www.deepseaelectronics.com/genset/auto-mains-utility-failure-control-modules/dse4520/downloads',
        revision: '057-171 Issue 4',
        accessedVia:
          'Page-level HTML rendering of the manual on ManualsLib (manualslib.com), pages 26-29. The PDF is subset-font encoded and decodes to control characters, as with every other DSE operator manual tried.',
        notes:
          'Terminal numbers and cable sizes are facts read from the manufacturer tables; the description against each terminal is our own wording. Model differences recorded in the same manual: terminals 8 and 9 are not fitted to the DSE4510, terminals 25-28 (mains sensing) are not fitted to the DSE4510, and terminals 29-32 (current sensing) are not available on the DSE45xx-01 variant.',
      },
    ],
  },
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
