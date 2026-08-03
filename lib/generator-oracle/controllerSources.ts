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
  'dse-8610': conflictingReads(
    'DSE 8610 MKII',
    'The DSE 8610 MKII Operator\'s Manual (188 pages) was located and its terminal subsections identified: DC supply/E-stop/DC outputs/charge fail on page 48, analogue sensors and CAN on 49, MPU/ECU/MSC/DSENet on 50, generator and bus sensing on 51, current transformers on 52-53, digital inputs on 53, RS485 on 54, RS232 on 55.',
    'Page 48 was read twice and the two readings conflicted. The charge fail / excite terminal came back as terminal 6 (labelled D+) on one pass and terminal 7 (labelled W/L) on the other; the DC output block came back as outputs E to J on one pass and E to L on the other, and the second reading assigned eight named outputs across only seven terminal numbers, which cannot be right.',
    [
      'Deep Sea Electronics document depot',
      "DSE 8610 MKII Operator's Manual, pages 48-56, via ManualsLib page-level rendering",
    ],
  ),
  'dse-8660': unsupported('DSE 8660 MKII', ['Deep Sea Electronics document depot']),

  // ComAp
  // ───────────────────────────────────────────────────────────────────────
  // ComAp NT platform — investigated 2026-08-03 and found to be a different
  // KIND of controller from every other entry in this registry, not merely one
  // whose manual is hard to obtain.
  //
  // The InteliLite NT reference manual states: "Any Binary input or output can
  // be configured to any IL-NT controller terminal or changed to different
  // function by LiteEdit software." The larger InteliSys NT and InteliMains NT
  // are the same architecture, configured with GenConfig. So the published
  // BI1 = GCB Feedback, BI2 = MCB Feedback, BI3 = Emergency Stop list is a
  // FACTORY DEFAULT, not a terminal fact.
  //
  // Note the contrast with the already-verified 'comap-inteligen' entry, whose
  // pinout came from a numbered terminal table. Same manufacturer, different
  // documentation model — which is exactly why each entry is judged on its own
  // source rather than by brand.
  // ───────────────────────────────────────────────────────────────────────
  'comap-intelilite': configurableIoMapping('ComAp InteliLite NT', 'LiteEdit', [
    'ComAp Resource Hub',
    'InteliLite NT AMF Series Reference Manual (sections "IL-NT Terminals" and "Inputs and Outputs")',
  ]),
  'comap-intelisys': configurableIoMapping('ComAp InteliSys NT', 'GenConfig', [
    'ComAp Resource Hub',
    'IGS-NT Installation Guide (09-2019)',
  ]),
  'comap-intelimains': configurableIoMapping('ComAp InteliMains NT', 'GenConfig', [
    'ComAp Resource Hub',
    'InteliMains NT IM-NT-BB Reference Manual',
  ]),

  // Woodward
  'woodward-easygen2000': unsupported('Woodward easYgen-2000', ['Woodward Manuals']),
  'woodward-dtsc200': unsupported('Woodward DTSC-200', ['Woodward Manuals']),

  // SmartGen
  'smartgen-hgm6120': {
    status: 'verified',
    verificationConfidence: 'high',
    completeness: 'partial',
    coverageNote:
      'The terminal table itself is complete (all 44 terminals), but it is VARIANT-SPECIFIC. ' +
      'It was read from the manual for the HGM6110N-4G / HGM6120N-4G / HGM6110CAN-4G / HGM6120CAN-4G. ' +
      'The base HGM6110N/6120N series is wired differently and this map must NOT be used for it: on the base series ' +
      'the fuel and start outputs (terminals 4 and 5) are 1.5 mm² rather than 2.5 mm², and Auxiliary Relay Outputs 2, 3 and 4 ' +
      'sit at terminals 8, 11 and 13 instead of 7, 10 and 12. The HGM6120 U, T and K series variants were not consulted ' +
      'and are not covered. Confirm the exact model suffix on the controller label before wiring.',
    sources: [
      {
        title: 'HGM6100N-4G Series Genset Controller User Manual (HGM6110N-4G / HGM6120N-4G / HGM6110CAN-4G / HGM6120CAN-4G)',
        documentType: 'OEM operator manual',
        publisher: 'SmartGen Technology',
        url: 'https://www.smartgen.cn/data/download/HGM6110N-4G_6120N-4G_6110CAN-4G_6120CAN-4G_en.pdf',
        accessedVia:
          "Downloaded directly from SmartGen's own site (smartgen.cn) — no mirror involved. Unlike the DSE manuals, this PDF is text-extractable, so Table 6 was read from the document itself.",
        notes:
          'Table 6, "Terminal Connection Description", terminals 1-44. Terminal numbers and cable sizes are facts read from the manufacturer table; each description is our own wording. Terminal 44 is printed as NULL (present but unassigned) and is carried through as such. The manual uses merged cells for the auxiliary relay groups; our entries state the grouping explicitly (7/8/9 = relay 2 NC/common/NO, 10+11 and 12+13 = the volt-free pairs for relays 3 and 4). The base HGM6100N series table was cross-checked against the SmartGen HGM6100N series manual and genuinely differs — see coverageNote.',
      },
    ],
  },
  'smartgen-hgm7220': {
    status: 'verified',
    verificationConfidence: 'high',
    completeness: 'complete',
    sources: [
      {
        title: 'HGM7200 Series Genset Controller User Manual',
        documentType: 'OEM operator manual',
        publisher: 'SmartGen Technology',
        url: 'https://www.smartgen.cn/data/download/HGM7200_en.pdf',
        accessedVia:
          "Downloaded directly from SmartGen's own site (smartgen.cn) — no mirror involved. The PDF is text-extractable, so Table 13 was read from the document itself.",
        notes:
          'Table 13, "Terminal Connection Description", terminals 1-52, complete. This is the correct base document for the HGM7220: the manual marks the mains sensing terminals 40-43 "HGM7X10 without", i.e. absent on the HGM7210 and present on the HGM7220. Terminal numbers and cable sizes are facts read from the manufacturer table; each description is our own wording. TWO THINGS TO KNOW: (1) the manual prints 1.5 mm² for terminal 36 (genset A phase) while giving 1.0 mm² for the other two genset phases at 37 and 38 — that asymmetry appears to be an error in SmartGen\'s own table, and is reproduced as printed rather than silently corrected; a technician sizing all three phases alike should use the larger figure. (2) Suffixed variants (N, -4G) were not consulted — SmartGen suffixes can shift terminal assignments, as documented on the HGM6120 entry.',
      },
    ],
  },
  'smartgen-hgm9510': {
    status: 'verified',
    verificationConfidence: 'high',
    completeness: 'complete',
    sources: [
      {
        title: 'HGM9510 Parallel Controller User Manual',
        documentType: 'OEM operator manual',
        publisher: 'SmartGen Technology',
        url: 'https://www.smartgen.cn/data/download/HGM9510_en.pdf',
        accessedVia:
          "Downloaded directly from SmartGen's own site (smartgen.cn) — no mirror involved. The PDF is text-extractable, so Table 12 was read from the document itself.",
        notes:
          'Table 12, "Terminal Connection Description", transcribed in full: terminals 1-52 and 56-61. TERMINALS 53, 54 AND 55 DO NOT APPEAR in the manufacturer\'s table — it runs 49-52 then resumes at 56 — so they are absent here rather than invented; the gap is SmartGen\'s, not a transcription loss. This is a paralleling controller, hence separate bus sensing (41-44) alongside genset sensing (45-48), and an MSC CAN link between paralleled sets (26-28) alongside the engine ECU CAN (23-25). Relay contact ORDER is not uniform in this table and is reproduced exactly as printed rather than normalised: Aux. output 4 is NC/common/NO at 20/21/22, but Aux. output 5 is NC/NO/common at 36/37/38. RS485 polarity is 34 = "+" and 35 = "-", which is the opposite order from the HGM7220 — each table was read on its own and polarity is never carried across models. Where the Cable Size column prints "/" the gauge is recorded as not stated. Terminal numbers and cable sizes are facts from the manufacturer table; each description is our own wording.',
      },
    ],
  },

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
  'datakom-d500': {
    status: 'verified',
    verificationConfidence: 'high',
    completeness: 'partial',
    coverageNote:
      'Terminals 52, 54 and 56 — the GENERATOR PHASE VOLTAGE INPUTS — are not published here. ' +
      'Two independent reads of the source page disagreed on which phase sits on which terminal (one gave ' +
      'L1/L2/L3 ascending, the other L2/L3/L3, which contradicts itself). Generator phase sensing is a ' +
      'high-consequence connection, so those three are withheld rather than guessed — confirm them against the ' +
      'manual before wiring. Everything else in the table is published and read identically on both passes. ' +
      'Separately, terminals 32-50 are NOT missing data: they do not exist on this module, and neither do ' +
      '53, 55, 57, 66, 68 and 70 — the manufacturer\'s numbering genuinely jumps. This entry is for the base ' +
      'D-500; the MK2 and MK3 revisions were not consulted and may differ.',
    sources: [
      {
        title: 'Datakom D-500 Advanced Genset Controller User Manual',
        documentType: 'OEM operator manual',
        publisher: 'Datakom',
        url: 'https://www.datakom.com.tr',
        accessedVia:
          'Page-level HTML rendering of the manual on ManualsLib (manualslib.com), pages 48-50 (the "Terminal Description" table). Datakom serve their manuals through a site section that did not resolve directly, so the copy consulted is a mirror — named here rather than overstated as an OEM download.',
        notes:
          'Terminal numbers, voltage and current ratings are facts read from the manufacturer table; each description is our own wording. Datakom print NO cable sizes anywhere in this table, so every gauge is recorded as "not stated by OEM" rather than inferred from the current rating. The table ending at 72 was confirmed by checking the following manual page, which is Technical Specifications. Terminal 2 is carried through deliberately: the manual instructs that it must be left unconnected, and listing it prevents it being mistaken for a spare. The six digital outputs and eight digital inputs are all programmable; the factory default function is named because that is what an untouched unit will do. Mains phases run in DESCENDING order across the block (67 = L3, 69 = L2, 71 = L1), which was consistent across both reads.',
      },
    ],
  },
  'datakom-d700': {
    status: 'verified',
    verificationConfidence: 'high',
    completeness: 'partial',
    coverageNote:
      'This map is for the D-700 MK3 (Firmware V-16.8) and must NOT be used for the earlier D-700. ' +
      'Both revisions were obtained from Datakom: the base D-700 (Rev_03, Firmware V-5.8) specifies TWELVE digital ' +
      'inputs and SEVEN analog sender inputs, while this MK3 table lists five analog senders — so the two do not ' +
      'share a terminal layout. The base revision\'s own numbered table is published only as a page image and could ' +
      'not be read, so it is not covered here. Check the revision on the controller label before wiring. ' +
      'Separately, the gaps are the manufacturer\'s and not missing data: terminals 32-43 are not listed, the AC ' +
      'terminals run in gapped odd/even sequences, and there is no "Digital Input 11" — terminal 23 is Digital ' +
      'Input 10 and terminal 24 is labelled Digital Input 12 in Datakom\'s own table.',
    sources: [
      {
        title: 'Datakom D-700 MK3 User Manual, Firmware V-16.8 — section 8, Terminal Description',
        documentType: 'OEM operator manual',
        publisher: 'Datakom',
        url: 'https://datakom.com.tr/upload/Files/700_MK3_USER.pdf',
        accessedVia:
          "Downloaded directly from Datakom's own site (datakom.com.tr) — no mirror involved. This PDF is text-extractable, so the terminal table was read from the document itself, unlike the D-500 whose table had to be read through ManualsLib.",
        notes:
          'Terminal numbers, voltage and current ratings are facts read from the manufacturer table; each description is our own wording. Datakom print NO cable sizes, so every gauge is recorded as "not stated by OEM" rather than inferred from the current rating. THE OPTIONAL DC PLUG-IN MODULE IS DELIBERATELY EXCLUDED: the same manual documents a plug-in module whose terminals are numbered 01-06 (I-, I+, *, V-, V2+, V1+), which would collide head-on with the main block\'s terminals 1-6 (battery supply and the crank/fuel outputs) if merged. It is a separate connector and is not part of this pinout. Phase order is reproduced as printed rather than tidied: generator phases descend against terminal number (63 = L1, 61 = L2, 59 = L3) and so do mains phases (66 = L3, 68 = L2, 70 = L1). Datakom state the CAN 120 ohm terminating resistors are internal and instruct that no external resistors be fitted.',
      },
    ],
  },
  'datakom-dkg309': {
    status: 'verified',
    verificationConfidence: 'high',
    completeness: 'partial',
    coverageNote:
      'All 37 terminals are published, but TERMINALS 36 AND 37 DEPEND ON WHICH HARDWARE VERSION OF THE DKG-309 ' +
      'YOU HAVE. Datakom print two sub-headings against the same two numbers: on CANBUS versions 36 is CANBUS-L ' +
      'and 37 is CANBUS-H, while on MPU input versions 36 is MPU- and 37 is MPU+. Both readings are carried in the ' +
      'terminal name because choosing one would land a speed-pickup pair on a CAN port, or the reverse. Identify ' +
      'your version before connecting those two.',
    sources: [
      {
        title: 'Datakom DKG-309 User Manual V-29 (23.08.2013) — section 2, Inputs and Outputs',
        documentType: 'OEM operator manual',
        publisher: 'Datakom',
        url: 'https://datakom.com.tr/upload/Files/309_USER.pdf',
        accessedVia:
          "Downloaded directly from Datakom's own site (datakom.com.tr) — no mirror involved. Text-extractable, so the terminal table was read from the document itself.",
        notes:
          'Terminal numbers and ratings are facts read from the manufacturer table; each description is our own wording. Datakom give no per-terminal cable sizes in this manual, so every gauge is recorded as not stated. PHASE ORDER IS MIXED ON THIS UNIT and is reproduced as printed rather than normalised: generator phases ASCEND (2 = L1, 3 = L2, 4 = L3) while mains phases DESCEND (7 = L3, 8 = L2, 9 = L1) — the descending mains run matches the D-500 and D-700 house style. Datakom advise interlocking the two contactor outputs: wire the mains contactor NC contact in series with terminal 1, and the generator contactor NC contact in series with terminal 10.',
      },
    ],
  },
  'datakom-dkg517': {
    status: 'verified',
    verificationConfidence: 'high',
    completeness: 'complete',
    sources: [
      {
        title: 'Datakom DKG-517 User Manual V-01.13 (08.04.2008) — section 2, Inputs and Outputs',
        documentType: 'OEM operator manual',
        publisher: 'Datakom',
        url: 'https://datakom.com.tr/upload/Files/517_USER.pdf',
        accessedVia:
          "Downloaded directly from Datakom's own site (datakom.com.tr) — no mirror involved. Text-extractable, so the terminal table was read from the document itself.",
        notes:
          'Terminals 1-34, complete. THIS UNIT HAS NO MAINS SENSING AND NO MAINS CONTACTOR — unlike the DKG-309 it is not an auto mains failure unit. That is why terminals 1 and 6-10 are printed with an asterisk and the instruction "No connection to these terminals"; they are carried here as explicit no-connect entries rather than dropped, so nobody assumes the numbering merely skipped and lands a mains phase on a dead pin. Do NOT read this pinout against the DKG-309: the relays here are rated 10 A where the 309\'s are 1 A, the generator phases are named U/V/W rather than L1/L2/L3, and the CT terminals are CURR_U/V/W rather than CURR_1/2/3. Cable size: the manual gives no per-terminal figure but states a blanket rule of at least 0.75 mm² with adequate current carrying capacity, and that general minimum is what appears in the gauge column, labelled as such. Terminal 20 is internally tied to terminal 16 to supply the charge alternator excitation current.',
      },
    ],
  },

  // Lovato
  // Investigated 2026-08-03. The RGK900 and ATL800 below were NOT individually
  // opened and keep the generic reason — Lovato may well document them the same
  // way, but "probably the same as its sibling" is precisely the reasoning this
  // registry exists to refuse.
  'lovato-rgk800': diagramOnlyLayout(
    'Lovato RGK800',
    'Both the RGK800 instruction manual (section "Terminal Arrangement", page 40) and the separate installation manual (section "Terminal Position", page 6) were opened; both present the layout as labelled drawings.',
    'What could be made out was only coarse grouping — terminals running 1 to 60, mains on 1-3, battery on 27-30, and RS-485 A/B/SG — with no legible per-terminal function list.',
    [
      'Lovato Electric documentation portal',
      'RGK800 Instruction Manual, "Terminal Arrangement" (page 40)',
      'RGK800 Installation Manual, "Terminal Position" (page 6)',
    ],
  ),
  'lovato-rgk900': unsupported('Lovato RGK900', ['Lovato Electric documentation portal']),
  'lovato-atl800': unsupported('Lovato ATL800', ['Lovato Electric documentation portal']),

  // ───────────────────────────────────────────────────────────────────────
  // Siemens — REAL Siemens products, but none of them is a genset controller.
  // They appear in and around generator switchgear, which is presumably how
  // they entered this catalog, but none has a genset control terminal block,
  // so none can ever gain a pinout here. Entries retained, reason corrected.
  // Triaged 2026-08-03.
  // ───────────────────────────────────────────────────────────────────────
  'siemens-sicam': notAGensetController(
    'Siemens SICAM A8000',
    'a substation automation and remote-terminal-unit (RTU) platform',
    ['Siemens Industry Online Support'],
  ),
  'siemens-sentron': notAGensetController(
    'Siemens SENTRON PAC',
    'a power monitoring device (panel-mounted energy meter)',
    ['Siemens Industry Online Support'],
  ),
  'siemens-siprotec': notAGensetController(
    'Siemens SIPROTEC 7SJ',
    'a digital overcurrent protection relay',
    ['Siemens Industry Online Support'],
  ),

  // ───────────────────────────────────────────────────────────────────────
  // ENKO — the manufacturer is real (ENKO Elektronik, Turkey, genset
  // controllers) but these three MODEL NUMBERS are not in their range.
  // ENKO name their genset modules in the AMF and MSU series. Flagged for the
  // owner rather than deleted. Triaged 2026-08-03.
  // ───────────────────────────────────────────────────────────────────────
  'enko-gcu300': modelNotFoundInOemRange(
    'ENKO GCU-300',
    'ENKO Elektronik',
    'ENKO designate their genset modules in the AMF series (AMF 2.0, 3.1, 3.2, 3.4, 3.4L, 4.0, 5.1, 5.2, AMF-L, AMF-M) and the MSU manual-start series (MSU 3.1, 3.4L, 5.1, 5.2). No "GCU" series appears in their catalog.',
    ['ENKO product documents', 'enkoelektronik.com product range'],
  ),
  'enko-gcu500': modelNotFoundInOemRange(
    'ENKO GCU-500',
    'ENKO Elektronik',
    'ENKO designate their genset modules in the AMF and MSU series; no "GCU" series appears in their catalog.',
    ['ENKO product documents', 'enkoelektronik.com product range'],
  ),
  'enko-sync200': modelNotFoundInOemRange(
    'ENKO SYNC-200',
    'ENKO Elektronik',
    'ENKO designate their genset modules in the AMF and MSU series; no "SYNC" series appears in their catalog.',
    ['ENKO product documents', 'enkoelektronik.com product range'],
  ),

  // ───────────────────────────────────────────────────────────────────────
  // Volvo Penta — VODIA is Volvo Penta's DIAGNOSTIC SOFTWARE, run on a PC
  // through a VOCOM interface. It is not a controller and has no terminals at
  // all, so a "wiring diagram" for it is a category error. The D13 ECU is real
  // hardware but is an engine ECU, not a genset controller, and its pinout is
  // released only through the dealer channel. Entries retained, reasons
  // corrected. Triaged 2026-08-03.
  // ───────────────────────────────────────────────────────────────────────
  'vodia-vodia5': notAGensetController(
    'Volvo Penta VODIA5',
    'PC diagnostic software for Volvo Penta marine and industrial engines, used with a VOCOM interface',
    ['Volvo Penta dealer technical portal (dealer-only)'],
  ),
  'vodia-vodia6': notAGensetController(
    'Volvo Penta VODIA6',
    'a release of Volvo Penta\'s PC diagnostic software, used with a VOCOM interface',
    ['Volvo Penta dealer technical portal (dealer-only)'],
  ),
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

/**
 * For catalog entries where NO amount of sourcing will ever produce a pinout,
 * because the named product is not a genset controller with a terminal block.
 *
 * The generic `unsupported()` reason says the data "has not been added yet",
 * which implies a document exists and merely needs to be found. For these
 * entries that is false and would send a technician looking for a manual that
 * cannot exist. Status stays 'unsupported' so UI behaviour is identical — no
 * diagram, no export — but the stated reason is now true.
 *
 * Entries are kept, not removed: the catalog is the owner's, and a wrong reason
 * is fixed by correcting the reason.
 */
function notAGensetController(
  displayName: string,
  whatItActuallyIs: string,
  searchedSources: string[],
): UnsupportedControllerSource {
  return {
    status: 'unsupported',
    reason:
      `${displayName} is ${whatItActuallyIs}. It is not a genset control module ` +
      `with a terminal block, so there is no controller pinout to publish and no ` +
      `OEM wiring table to source. This entry is retained in the catalog for ` +
      `search and reference purposes only; the wiring panel will never render a ` +
      `diagram for it.`,
    searchedSources,
  };
}

/**
 * For controllers whose terminals are identified by FUNCTION LABEL rather than
 * by number, AND whose label-to-function mapping is configured per unit in
 * software.
 *
 * ComAp's NT platform is the case this was written for. Its terminals are
 * printed BI1-BI16, BO1-BO16, AI1-AI4 and so on, and the manual states plainly
 * that any binary input or output can be reassigned to any terminal using
 * LiteEdit (InteliLite NT) or GenConfig (InteliSys NT, InteliMains NT). The
 * "defaults" published in the reference manual are therefore a factory
 * configuration, not a wiring fact — a commissioned machine may legitimately
 * have BI3 doing something entirely different from the book.
 *
 * Publishing that as a pinout would produce the most dangerous kind of wrong:
 * a table that is right on an untouched unit and wrong on a configured one,
 * with nothing on the page to tell them apart. Status stays 'unsupported'.
 */
function configurableIoMapping(
  displayName: string,
  configTool: string,
  searchedSources: string[],
): UnsupportedControllerSource {
  return {
    status: 'unsupported',
    reason:
      `${displayName} does not have a fixed terminal-to-function pinout to publish. ` +
      `Its terminals are identified by function label (BI1-BI16, BO1-BO16, AI1-AI4 and ` +
      `similar) rather than by number, and the manufacturer states that any binary input ` +
      `or output can be reassigned to any terminal using ${configTool}. The assignments ` +
      `printed in the reference manual are a factory default, not a wiring fact: a ` +
      `commissioned machine may legitimately differ. A published map would be correct on ` +
      `an untouched unit and wrong on a configured one, with nothing to distinguish them, ` +
      `so none is shipped. Read the unit's own configuration with ${configTool} instead. ` +
      `The physical connector layout is published by the manufacturer as a face and ` +
      `wiring diagram rather than as a machine-readable terminal table.`,
    searchedSources,
  };
}

/**
 * For controllers whose terminal layout the manufacturer publishes ONLY as a
 * drawing, with no machine-readable terminal table anywhere in the document.
 *
 * This is a real and common case, and it is worth distinguishing from "we have
 * not looked yet". The document was obtained and read; what it contains is a
 * labelled picture. Coarse groupings can sometimes be made out from the
 * surrounding text — enough to tempt a reconstruction, and nowhere near enough
 * to be sure of it. A pinout assembled that way would be a guess wearing the
 * clothes of a citation.
 *
 * These stay 'unsupported' until a numbered table, or a legible copy of the
 * drawing, can be read terminal by terminal.
 */
function diagramOnlyLayout(
  displayName: string,
  documentDescription: string,
  whatWasLegible: string,
  searchedSources: string[],
): UnsupportedControllerSource {
  return {
    status: 'unsupported',
    reason:
      `The manufacturer publishes the ${displayName} terminal layout only as a wiring ` +
      `drawing, not as a terminal table. ${documentDescription} ${whatWasLegible} ` +
      `That is enough to hint at a layout and not enough to be certain of any single ` +
      `terminal, so no pinout is published — a map reconstructed from a partly legible ` +
      `drawing would be a guess presented as a citation. This entry will be filled in ` +
      `when a numbered terminal table, or a legible copy of the drawing, can be read ` +
      `terminal by terminal.`,
    searchedSources,
  };
}

/**
 * For controllers where the OEM document WAS located and read, but repeated
 * reads of the terminal table disagreed with each other.
 *
 * This is the most dangerous near-miss in the whole exercise, because the data
 * looks obtainable. It is recorded loudly so nobody "finishes the job" later by
 * picking whichever read looked tidier.
 *
 * The DSE 6020 MKII went the same way on one terminal range and that range is
 * still withheld from its otherwise-shipped map. Where a conflict is confined
 * to part of a table, ship the rest and withhold the conflicting terminals via
 * completeness: 'partial'. Where it lands on the power and starting block, as
 * here, there is no safe remainder worth shipping.
 */
function conflictingReads(
  displayName: string,
  documentDescription: string,
  theConflict: string,
  searchedSources: string[],
): UnsupportedControllerSource {
  return {
    status: 'unsupported',
    reason:
      `The OEM manual for the ${displayName} was located and its terminal pages were ` +
      `read, but the readings did not agree with each other, so nothing is published. ` +
      `${documentDescription} ${theConflict} Because the disagreement falls on the DC ` +
      `supply and starting terminals — the ones where an error does the most harm — no ` +
      `partial map is shipped either. DO NOT resolve this by choosing the more ` +
      `plausible-looking reading: that is exactly the failure this registry exists to ` +
      `prevent. It needs a clean read of the printed table.`,
    searchedSources,
  };
}

/**
 * For catalog entries whose MODEL NUMBER could not be found in the
 * manufacturer's published range at all.
 *
 * Recorded rather than deleted so the discrepancy stays visible and the owner
 * can decide: correct the model number to a real one, or drop the entry.
 */
function modelNotFoundInOemRange(
  displayName: string,
  manufacturer: string,
  actualRange: string,
  searchedSources: string[],
): UnsupportedControllerSource {
  return {
    status: 'unsupported',
    reason:
      `No product called "${displayName}" could be located in ${manufacturer}'s ` +
      `published range. ${actualRange} Because the model itself is unconfirmed, ` +
      `no pinout can be sourced or published. Flagged for the owner to correct ` +
      `the model designation or retire the entry — it has NOT been removed.`,
    searchedSources,
  };
}

export function getControllerSource(controllerId: string): ControllerSourceEntry | undefined {
  return CONTROLLER_SOURCES[controllerId];
}

export function isControllerVerified(controllerId: string): boolean {
  return CONTROLLER_SOURCES[controllerId]?.status === 'verified';
}
