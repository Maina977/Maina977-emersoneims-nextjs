/**
 * LEGAL DISCLAIMERS FOR GENERATOR ORACLE
 *
 * These disclaimers protect against copyright and trademark claims.
 * All content is independently developed and rephrased in original language.
 * Fault code NUMBERS are freely used, but all DESCRIPTIONS are independently written.
 */

export const MAIN_DISCLAIMER = `
IMPORTANT DISCLAIMER

Generator Oracle is an INDEPENDENT diagnostic reference tool created for educational
and troubleshooting purposes. This software is NOT affiliated with, endorsed by,
licensed by, or officially associated with any equipment manufacturer.

All brand names, model numbers, product names, and trademarks mentioned are the
property of their respective owners and are used solely for IDENTIFICATION and
COMPATIBILITY REFERENCE purposes.

FAULT CODE INTERPRETATIONS: All fault code descriptions, diagnostic procedures, and
repair guidance are INDEPENDENTLY DEVELOPED based on general diesel generator
diagnostic principles and field technician experience. These descriptions are
REPHRASED in our own language and may differ from official manufacturer documentation.
Fault code numbers are industry-standard identifiers - only the accompanying
descriptions are our independent interpretations.

For warranty service, official documentation, or certified repairs, always consult
the manufacturer's authorized service centers and technical manuals.

USE OF THIS TOOL IS AT YOUR OWN RISK.
`;

export const ECM_DISCLAIMER = `
ECM/ECU COMPATIBILITY NOTICE

ECM and ECU model names (including but not limited to Caterpillar ADEM, Cummins CM,
Volvo Penta EMS, Perkins ADEM, John Deere PowerTech, MTU ADEC, and others) are used
for IDENTIFICATION PURPOSES ONLY.

Generator Oracle is NOT affiliated with, endorsed by, or licensed by any ECM/ECU
manufacturer. All diagnostic guidance, fault code interpretations, and reprogramming
procedures are INDEPENDENTLY DEVELOPED based on general industry knowledge, J1939/CAN
protocol standards, and field technician experience.

Procedures described are INDEPENDENT INTERPRETATIONS that may differ from official
manufacturer service procedures. Always verify critical procedures against official
documentation when available.

Generator Oracle assumes no liability for any damages resulting from the use of
information provided. For warranty-covered repairs, consult authorized service centers.
`;

export const CONTROLLER_DISCLAIMER = `
CONTROLLER COMPATIBILITY NOTICE

Controller model references (including Deep Sea Electronics DSE, ComAp InteliLite/
InteliGen, Woodward EasyGen, SmartGen HGM, Caterpillar PowerWizard, Datakom DKG,
Lovato RGK, Siemens SICAM, ENKO GCU, and others) are used for IDENTIFICATION
PURPOSES ONLY.

Generator Oracle is an INDEPENDENT diagnostic assistant. Fault codes are rephrased
for clarity and may differ from official manufacturer documentation. We are NOT
affiliated with, endorsed by, or licensed by Deep Sea Electronics, ComAp, Woodward,
SmartGen, Caterpillar, Datakom, Lovato, Siemens, ENKO, or any other controller
manufacturer.

All fault code descriptions are INDEPENDENTLY WRITTEN interpretations - we use the
fault code numbers (which are safe to reference) but rephrase all descriptions in
our own language based on general diesel generator diagnostic principles.
`;

export const FAULT_CODE_DISCLAIMER = `
FAULT CODE INTERPRETATION NOTICE

Fault code NUMBERS referenced in Generator Oracle are industry-standard diagnostic
codes that are safe to use and reference. However, all fault code DESCRIPTIONS,
troubleshooting procedures, and repair guidance are INDEPENDENTLY WRITTEN
interpretations - NOT copied from manufacturer documentation.

EXAMPLE OF OUR APPROACH:
- OEM manual might say: "Fault 123: ECM offline due to CANbus error"
- Our interpretation: "Controller cannot communicate with ECM - check wiring,
  termination resistors, and firmware compatibility"

This rephrasing ensures our content is original while providing equivalent
diagnostic value. All descriptions are based on general diesel generator
diagnostic principles and field technician experience.

For official descriptions, consult manufacturer service manuals and authorized
service centers.
`;

export const PROCEDURE_DISCLAIMER = `
PROCEDURE DISCLAIMER

All diagnostic and repair procedures in Generator Oracle are independently developed
based on general industry practices and field experience. They are NOT copied from
any manufacturer's official documentation.

Procedures are provided as general guidance only. Actual procedures may vary by
equipment model, configuration, and condition. Always exercise appropriate caution
and follow safety protocols.
`;

// Short inline disclaimers for UI components
export const SHORT_DISCLAIMERS = {
  faultCode: "Independent interpretation - rephrased from general industry knowledge, not OEM text",
  ecm: "ECM names used for identification only - Generator Oracle is not affiliated with any ECM manufacturer",
  controller: "Controller names used for identification only - Generator Oracle is not affiliated with or endorsed by any controller manufacturer",
  procedure: "Independent guidance based on general industry practice - verify for your specific equipment",
  reprogramming: "Independent procedure guide - always verify critical steps against official documentation",
  general: "Generator Oracle is an independent diagnostic assistant providing rephrased interpretations"
};

// Compatibility statement for display
export const COMPATIBILITY_STATEMENT = `
Generator Oracle is an independent diagnostic assistant. Controller names such as
DeepSea, PowerWizard, SmartGen, ComAp, Woodward, Datakom, Lovato, Siemens, and ENKO
are used for identification purposes only. ECM names such as Caterpillar ADEM,
Cummins CM, Volvo Penta, Perkins, John Deere, and MTU are similarly used for
identification. Generator Oracle is not affiliated with or endorsed by these
manufacturers.
`;

// Trademark acknowledgments
export const TRADEMARK_ACKNOWLEDGMENTS = [
  "Deep Sea Electronics® and DSE® are registered trademarks of Deep Sea Electronics Ltd.",
  "ComAp®, InteliLite®, InteliGen®, and InteliSys® are trademarks of ComAp a.s.",
  "Caterpillar®, CAT®, and PowerWizard® are trademarks of Caterpillar Inc.",
  "Cummins® and INSITE® are trademarks of Cummins Inc.",
  "Perkins® is a trademark of Perkins Engines Company Limited.",
  "Volvo Penta® is a trademark of Volvo Group.",
  "Woodward® and EasyGen® are trademarks of Woodward, Inc.",
  "SmartGen® is a trademark of Zhengzhou SmartGen Technology Co., Ltd.",
  "John Deere® and PowerTech® are trademarks of Deere & Company.",
  "MTU® and ADEC® are trademarks of Rolls-Royce Power Systems AG.",
  "Datakom® is a trademark of Datakom Elektronik Ltd.",
  "Lovato® is a trademark of Lovato Electric S.p.A.",
  "Siemens® and SICAM® are trademarks of Siemens AG.",
  "ENKO® is a trademark of ENKO Electronic Control Ltd.",
  "All other trademarks are property of their respective owners.",
  "Use of these names is for IDENTIFICATION PURPOSES ONLY - no endorsement or affiliation is implied."
];

// Safe practices for content development
export const SAFE_PRACTICES = {
  faultCodes: {
    safe: "Use fault code numbers freely (e.g., 'Code 123', 'Alarm 456')",
    caution: "Always rewrite descriptions in your own language",
    avoid: "Never copy verbatim text from OEM manuals or documentation"
  },
  procedures: {
    safe: "Develop independent diagnostic flows based on general principles",
    caution: "May reference industry-standard protocols (J1939, CANbus)",
    avoid: "Never copy step-by-step procedures directly from OEM manuals"
  },
  brandNames: {
    safe: "Reference brand/model names for identification and compatibility",
    caution: "Always include disclaimer stating no affiliation",
    avoid: "Never style UI to mimic OEM branding or manuals"
  }
};

// Content origin statement
export const CONTENT_ORIGIN_STATEMENT = `
All diagnostic content in Generator Oracle is INDEPENDENTLY DEVELOPED by our team
based on:
• General diesel generator diagnostic principles
• Industry-standard communication protocols (J1939, CANbus, Modbus)
• Field technician experience and best practices
• Public technical specifications and standards

NO content is copied verbatim from any manufacturer's documentation. All fault code
descriptions, troubleshooting procedures, and repair guidance are original
interpretations written in our own language.
`;
