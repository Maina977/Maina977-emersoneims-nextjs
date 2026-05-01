/**
 * GENERATOR ORACLE - SECURITY & INDEPENDENCE FRAMEWORK
 *
 * This module establishes legal protection, data ownership, and market positioning
 * for Generator Oracle as an INDEPENDENT diagnostic platform.
 *
 * COPYRIGHT 2024-2026 Generator Oracle. All Rights Reserved.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// 1. GLOBAL LEGAL DISCLAIMER
// ═══════════════════════════════════════════════════════════════════════════════

export const GLOBAL_DISCLAIMER = `Generator Oracle is an independent diagnostic and maintenance platform. Controller and ECM names are used solely for identification purposes. Generator Oracle is not affiliated with, endorsed by, or sponsored by Cummins, Caterpillar, Volvo Penta, Perkins, Honda, Doosan, Deutz, John Deere, Lister Petter, SDMO, MTU, MAN, Iveco, Yanmar, Weichai, Massey Ferguson, or any other OEM.`;

export const FULL_INDEPENDENCE_STATEMENT = `
INDEPENDENCE STATEMENT

Generator Oracle is a PROPRIETARY diagnostic platform developed independently.
All diagnostic content, fault code interpretations, and repair guidance are
ORIGINAL WORKS created by our team of field technicians and engineers.

We use OEM names (Cummins, Caterpillar, Volvo Penta, etc.) for IDENTIFICATION
PURPOSES ONLY - to help technicians match our guidance to their equipment.

NO CONTENT is copied from OEM manuals, software, or documentation.
`;

// ═══════════════════════════════════════════════════════════════════════════════
// 2. TECHNICIAN-STYLE LANGUAGE TRANSLATIONS
// Oracle's own phrasing - field-report style, NOT OEM language
// ═══════════════════════════════════════════════════════════════════════════════

export interface OracleLanguageMapping {
  oemPhrase: string;
  oraclePhrase: string;
  category: 'ecm' | 'controller' | 'sensor' | 'electrical' | 'fuel' | 'general';
}

export const TECHNICIAN_LANGUAGE: OracleLanguageMapping[] = [
  // ECM Communication
  {
    oemPhrase: "ECM firmware mismatch",
    oraclePhrase: "Controller cannot read ECM data — firmware not aligned",
    category: 'ecm'
  },
  {
    oemPhrase: "ECM offline",
    oraclePhrase: "ECM not responding — check power supply and CAN wiring",
    category: 'ecm'
  },
  {
    oemPhrase: "CANbus communication error",
    oraclePhrase: "Controller lost communication with engine — verify CAN termination and wiring",
    category: 'ecm'
  },
  {
    oemPhrase: "ECM authentication failed",
    oraclePhrase: "Security handshake unsuccessful — verify correct access level",
    category: 'ecm'
  },
  {
    oemPhrase: "Firmware update required",
    oraclePhrase: "ECM software outdated — reprogram with current firmware version",
    category: 'ecm'
  },
  {
    oemPhrase: "Calibration file error",
    oraclePhrase: "Engine parameters not matching ECM settings — recalibrate",
    category: 'ecm'
  },

  // Controller Faults
  {
    oemPhrase: "Controller watchdog timeout",
    oraclePhrase: "Controller reset due to internal fault — check for loose connections",
    category: 'controller'
  },
  {
    oemPhrase: "Invalid configuration",
    oraclePhrase: "Controller settings don't match connected equipment — reconfigure",
    category: 'controller'
  },
  {
    oemPhrase: "Memory corruption detected",
    oraclePhrase: "Controller memory error — factory reset may be required",
    category: 'controller'
  },

  // Sensor Faults
  {
    oemPhrase: "Sensor open circuit",
    oraclePhrase: "No signal from sensor — check wiring and connector",
    category: 'sensor'
  },
  {
    oemPhrase: "Sensor short to ground",
    oraclePhrase: "Sensor wire shorted to chassis — inspect harness for damage",
    category: 'sensor'
  },
  {
    oemPhrase: "Sensor out of range high",
    oraclePhrase: "Sensor reading too high — possible failed sensor or wiring issue",
    category: 'sensor'
  },
  {
    oemPhrase: "Sensor out of range low",
    oraclePhrase: "Sensor reading too low — check sensor connection and power supply",
    category: 'sensor'
  },

  // Electrical
  {
    oemPhrase: "Battery voltage low",
    oraclePhrase: "Starting batteries need charge — check charging system and battery condition",
    category: 'electrical'
  },
  {
    oemPhrase: "Overvoltage condition",
    oraclePhrase: "Voltage too high — check AVR settings and generator field",
    category: 'electrical'
  },
  {
    oemPhrase: "Ground fault detected",
    oraclePhrase: "Insulation breakdown — megger test windings and cables",
    category: 'electrical'
  },

  // Fuel System
  {
    oemPhrase: "Fuel pressure low",
    oraclePhrase: "Not enough fuel reaching injectors — check filters, lift pump, and tank level",
    category: 'fuel'
  },
  {
    oemPhrase: "Fuel pressure high",
    oraclePhrase: "Excess fuel pressure — check pressure regulator and return line",
    category: 'fuel'
  },
  {
    oemPhrase: "Injector circuit fault",
    oraclePhrase: "Injector not firing properly — check wiring and injector resistance",
    category: 'fuel'
  },

  // General
  {
    oemPhrase: "System shutdown",
    oraclePhrase: "Engine stopped by protection system — identify root cause before restart",
    category: 'general'
  },
  {
    oemPhrase: "Warning threshold exceeded",
    oraclePhrase: "Parameter approaching limit — monitor closely and investigate",
    category: 'general'
  },
  {
    oemPhrase: "Maintenance required",
    oraclePhrase: "Service interval reached — perform scheduled maintenance",
    category: 'general'
  }
];

/**
 * Converts OEM-style language to Oracle technician-style language
 */
export function toOracleLanguage(oemPhrase: string): string {
  const mapping = TECHNICIAN_LANGUAGE.find(
    m => m.oemPhrase.toLowerCase() === oemPhrase.toLowerCase()
  );
  return mapping ? mapping.oraclePhrase : oemPhrase;
}

/**
 * Generates a technician field report format for a diagnostic finding
 */
export function generateFieldReport(
  technicianInput: string,
  oracleGuidance: string,
  nextSteps: string[]
): string {
  return `
TECHNICIAN FIELD REPORT
═══════════════════════════════════════════════════════════════

Technician Input: ${technicianInput}

Oracle Guidance: ${oracleGuidance}

Recommended Actions:
${nextSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

───────────────────────────────────────────────────────────────
Note: This guidance is independently developed by Generator Oracle
based on general industry practices and field experience.
`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. SECURITY LAYER
// ═══════════════════════════════════════════════════════════════════════════════

export interface SecurityConfig {
  dataOwnership: 'oracle';
  encryptionEnabled: boolean;
  auditTrailEnabled: boolean;
  accessLevels: AccessLevel[];
}

export interface AccessLevel {
  level: number;
  name: string;
  permissions: string[];
  requiresAuth: boolean;
}

export const SECURITY_CONFIG: SecurityConfig = {
  dataOwnership: 'oracle',
  encryptionEnabled: true,
  auditTrailEnabled: true,
  accessLevels: [
    {
      level: 0,
      name: 'Basic User',
      permissions: ['view_fault_codes', 'view_diagnostics', 'view_manuals'],
      requiresAuth: false
    },
    {
      level: 1,
      name: 'Field Technician',
      permissions: ['view_fault_codes', 'view_diagnostics', 'view_manuals', 'clear_faults', 'view_parameters'],
      requiresAuth: true
    },
    {
      level: 2,
      name: 'Senior Technician',
      permissions: ['view_fault_codes', 'view_diagnostics', 'view_manuals', 'clear_faults', 'view_parameters', 'modify_parameters'],
      requiresAuth: true
    },
    {
      level: 3,
      name: 'Fleet Manager',
      permissions: ['view_fault_codes', 'view_diagnostics', 'view_manuals', 'clear_faults', 'view_parameters', 'modify_parameters', 'view_fleet', 'manage_fleet'],
      requiresAuth: true
    },
    {
      level: 4,
      name: 'Master Technician',
      permissions: ['all'],
      requiresAuth: true
    }
  ]
};

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: 'view' | 'modify' | 'program' | 'clear' | 'reset' | 'export';
  target: string;
  targetType: 'ecm' | 'controller' | 'fault' | 'parameter' | 'firmware' | 'calibration';
  previousValue?: string;
  newValue?: string;
  ipAddress?: string;
  deviceId?: string;
  success: boolean;
  errorMessage?: string;
}

// In-memory audit log (would be database in production)
const auditLog: AuditLogEntry[] = [];

/**
 * Logs an action to the Oracle audit trail
 */
export function logAuditEntry(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
  const fullEntry: AuditLogEntry = {
    ...entry,
    id: `AUDIT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date()
  };
  auditLog.push(fullEntry);
  return fullEntry;
}

/**
 * Retrieves audit log entries
 */
export function getAuditLog(filters?: {
  userId?: string;
  action?: AuditLogEntry['action'];
  targetType?: AuditLogEntry['targetType'];
  startDate?: Date;
  endDate?: Date;
}): AuditLogEntry[] {
  let entries = [...auditLog];

  if (filters) {
    if (filters.userId) {
      entries = entries.filter(e => e.userId === filters.userId);
    }
    if (filters.action) {
      entries = entries.filter(e => e.action === filters.action);
    }
    if (filters.targetType) {
      entries = entries.filter(e => e.targetType === filters.targetType);
    }
    if (filters.startDate) {
      entries = entries.filter(e => e.timestamp >= filters.startDate!);
    }
    if (filters.endDate) {
      entries = entries.filter(e => e.timestamp <= filters.endDate!);
    }
  }

  return entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * Checks if user has permission for an action
 */
export function hasPermission(userLevel: number, permission: string): boolean {
  const level = SECURITY_CONFIG.accessLevels.find(l => l.level === userLevel);
  if (!level) return false;
  return level.permissions.includes('all') || level.permissions.includes(permission);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. DATA OWNERSHIP DECLARATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const DATA_OWNERSHIP = {
  faultCodes: {
    owner: 'Generator Oracle',
    description: 'All fault code descriptions are independently written interpretations',
    copyrightYear: 2024
  },
  ecmMappings: {
    owner: 'Generator Oracle',
    description: 'ECM compatibility mappings are proprietary Oracle datasets',
    copyrightYear: 2024
  },
  diagnosticFlows: {
    owner: 'Generator Oracle',
    description: 'Diagnostic procedures are independently developed guidance',
    copyrightYear: 2024
  },
  technicianInputs: {
    owner: 'Generator Oracle',
    description: 'User-submitted diagnostics become part of Oracle\'s knowledge base',
    copyrightYear: 2024
  },
  firmwareData: {
    owner: 'Generator Oracle (metadata only)',
    description: 'Firmware file metadata and checksums - actual firmware files are OEM property',
    copyrightYear: 2024
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 5. MARKET POSITIONING
// ═══════════════════════════════════════════════════════════════════════════════

export const MARKET_POSITIONING = {
  taglines: [
    "One tool for all brands",
    "Technician-driven, not OEM-restricted",
    "Independent language, independent guidance",
    "Your universal diagnostic companion",
    "No OEM subscription required"
  ],
  differentiators: [
    {
      feature: "Universal Compatibility",
      description: "Works with ALL major generator brands - no need for multiple OEM tools"
    },
    {
      feature: "Independent Content",
      description: "All guidance is original - not copied from OEM manuals"
    },
    {
      feature: "Technician Language",
      description: "Practical field-report style guidance, not engineering jargon"
    },
    {
      feature: "No Hardware Lock-in",
      description: "AI-powered diagnostics work without expensive proprietary adapters"
    },
    {
      feature: "Offline Capable",
      description: "Full functionality in remote locations without internet"
    },
    {
      feature: "Cost Effective",
      description: "One subscription covers all brands - no per-brand licensing"
    }
  ],
  targetUsers: [
    "Independent generator technicians",
    "Fleet maintenance managers",
    "Rental company service teams",
    "Industrial maintenance departments",
    "Hospital/data center facility managers",
    "Agricultural operations",
    "Marine and offshore operators"
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// 6. CONTENT VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Validates that content follows Oracle's independence guidelines
 */
export function validateContentIndependence(content: string): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  // Check for potential OEM-specific language patterns
  const oemPatterns = [
    /per\s+service\s+manual/i,
    /refer\s+to\s+oem/i,
    /manufacturer\s+recommends/i,
    /as\s+per\s+caterpillar/i,
    /according\s+to\s+cummins/i,
    /volvo\s+penta\s+specification/i,
    /official\s+procedure/i
  ];

  oemPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      warnings.push(`Content may reference OEM documentation - rephrase in Oracle language`);
    }
  });

  // Check for copied text indicators
  if (content.includes('©') || content.includes('®') || content.includes('™')) {
    warnings.push('Content contains trademark symbols - ensure proper usage');
  }

  return {
    isValid: warnings.length === 0,
    warnings
  };
}

/**
 * Generates the standard Oracle disclaimer for a specific context
 */
export function getContextualDisclaimer(context: 'ecm' | 'controller' | 'fault' | 'procedure' | 'report'): string {
  const disclaimers = {
    ecm: "ECM names used for identification only. Generator Oracle is not affiliated with any ECM manufacturer.",
    controller: "Controller names used for identification only. Generator Oracle is an independent diagnostic tool.",
    fault: "Independent interpretation - rephrased for clarity based on industry knowledge.",
    procedure: "Independent guidance based on general industry practice - verify for your specific equipment.",
    report: "This report is generated by Generator Oracle, an independent diagnostic platform."
  };
  return disclaimers[context];
}

// Export all OEM brands we reference (for disclaimer generation)
export const REFERENCED_BRANDS = [
  'Cummins', 'Caterpillar', 'Volvo Penta', 'Perkins', 'John Deere',
  'Deutz', 'MTU', 'Lister Petter', 'Honda', 'Doosan', 'MAN',
  'Iveco', 'SDMO', 'Massey Ferguson', 'Yanmar', 'Weichai',
  'Deep Sea Electronics', 'ComAp', 'Woodward', 'SmartGen',
  'Datakom', 'Lovato', 'Siemens', 'ENKO'
];
