/**
 * ORACLE DIAGNOSTIC INTERFACE (ODI) - ECM DATABASE LAYER
 *
 * Complete database for ECM models, firmware versions, calibrations,
 * compatibility matrices, and programming event tracking.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ECMModel {
  id: string;
  manufacturer: string;
  family: string;
  model: string;
  variants: string[];
  productionYears: { start: number; end: number | null };
  engineApplications: EngineApplication[];
  protocols: string[];
  connectorType: string;
  features: ECMFeature[];
  firmwareVersions: FirmwareVersion[];
  calibrations: Calibration[];
  compatibleControllers: ControllerCompatibility[];
  schematicUrl?: string;
  serviceManualUrl?: string;
}

export interface EngineApplication {
  engineModel: string;
  displacement: number;
  cylinders: number;
  powerRatings: PowerRating[];
  emissionStandards: string[];
}

export interface PowerRating {
  kw: number;
  hp: number;
  rpm: number;
  application: 'prime' | 'standby' | 'continuous' | 'marine' | 'industrial';
}

export interface ECMFeature {
  name: string;
  description: string;
  category: 'engine_control' | 'aftertreatment' | 'diagnostics' | 'communication' | 'safety';
}

export interface FirmwareVersion {
  version: string;
  releaseDate: string;
  status: 'current' | 'superseded' | 'recalled';
  releaseNotes: string[];
  bugFixes: string[];
  newFeatures: string[];
  knownIssues: string[];
  minimumHardwareRevision: string;
  maximumHardwareRevision?: string;
  compatibleCalibrations: string[];
  fileSize: number;
  checksum: string;
  signature?: string;
  downloadUrl?: string;
}

export interface Calibration {
  id: string;
  name: string;
  engineModel: string;
  powerRating: PowerRating;
  emissionStandard: string;
  governorType: 'isochronous' | 'droop' | 'variable';
  application: string;
  version: string;
  releaseDate: string;
  requiredFirmware: string[];
  parameters: CalibrationParameter[];
  checksum: string;
}

export interface CalibrationParameter {
  id: string;
  name: string;
  category: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  editable: boolean;
  requiresAuth: number; // Security level required
  affectsEmissions: boolean;
  description: string;
}

export interface ControllerCompatibility {
  controllerModel: string;
  manufacturer: string;
  firmwareRange: { min: string; max?: string };
  canConfiguration: CANConfiguration;
  notes?: string;
}

export interface CANConfiguration {
  baudRate: number;
  sourceAddress: number;
  requiredPGNs: number[];
  optionalPGNs: number[];
  terminationRequired: boolean;
}

export interface ProgrammingEvent {
  id: string;
  timestamp: Date;
  ecmSerial: string;
  ecmModel: string;
  eventType: 'firmware_update' | 'calibration_change' | 'parameter_write' | 'fault_clear' | 'reset';
  previousVersion?: string;
  newVersion?: string;
  technicianId: string;
  technicianName: string;
  location?: { lat: number; lng: number };
  result: 'success' | 'failure' | 'partial';
  duration: number; // milliseconds
  details: Record<string, unknown>;
  notes?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ECM DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

export const ECM_MODELS: ECMModel[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // CUMMINS ECMs
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'CUMMINS_CM2350',
    manufacturer: 'Cummins',
    family: 'CM2350',
    model: 'CM2350',
    variants: ['CM2350A', 'CM2350B', 'CM2350C'],
    productionYears: { start: 2013, end: null },
    engineApplications: [
      {
        engineModel: 'QSB6.7',
        displacement: 6.7,
        cylinders: 6,
        powerRatings: [
          { kw: 149, hp: 200, rpm: 1500, application: 'prime' },
          { kw: 186, hp: 250, rpm: 1800, application: 'prime' },
          { kw: 224, hp: 300, rpm: 2100, application: 'standby' }
        ],
        emissionStandards: ['EPA Tier 4 Final', 'EU Stage V']
      },
      {
        engineModel: 'QSL9',
        displacement: 8.9,
        cylinders: 6,
        powerRatings: [
          { kw: 261, hp: 350, rpm: 1800, application: 'prime' },
          { kw: 298, hp: 400, rpm: 2100, application: 'standby' }
        ],
        emissionStandards: ['EPA Tier 4 Final', 'EU Stage V']
      },
      {
        engineModel: 'QSX15',
        displacement: 15,
        cylinders: 6,
        powerRatings: [
          { kw: 447, hp: 600, rpm: 1800, application: 'prime' },
          { kw: 522, hp: 700, rpm: 2100, application: 'standby' }
        ],
        emissionStandards: ['EPA Tier 4 Final', 'EU Stage V']
      }
    ],
    protocols: ['J1939', 'J1708', 'Cummins_Datalink'],
    connectorType: 'Deutsch 9-Pin',
    features: [
      { name: 'Aftertreatment Control', description: 'Integrated SCR and DPF management', category: 'aftertreatment' },
      { name: 'Prognostics', description: 'Predictive maintenance alerts', category: 'diagnostics' },
      { name: 'Remote Tuning', description: 'Over-the-air calibration updates', category: 'communication' }
    ],
    firmwareVersions: [
      {
        version: '6.32.0',
        releaseDate: '2024-01-15',
        status: 'current',
        releaseNotes: ['Improved cold start performance', 'Enhanced DPF regeneration algorithm'],
        bugFixes: ['Fixed intermittent SPN 3719 fault', 'Corrected boost pressure calculation at altitude'],
        newFeatures: ['OBD compliance update for 2024', 'New aftertreatment monitoring'],
        knownIssues: [],
        minimumHardwareRevision: 'REV-B',
        compatibleCalibrations: ['QSB67_*', 'QSL9_*', 'QSX15_*'],
        fileSize: 4194304,
        checksum: 'A1B2C3D4E5F6G7H8',
        signature: 'CUMMINS_SIGNED_2024'
      },
      {
        version: '6.30.0',
        releaseDate: '2023-06-20',
        status: 'superseded',
        releaseNotes: ['Stage V compliance updates'],
        bugFixes: ['Fixed fuel rail pressure sensor fault'],
        newFeatures: [],
        knownIssues: ['SPN 3719 may appear intermittently - fixed in 6.32.0'],
        minimumHardwareRevision: 'REV-B',
        compatibleCalibrations: ['QSB67_*', 'QSL9_*'],
        fileSize: 4096000,
        checksum: 'B2C3D4E5F6G7H8I9',
        signature: 'CUMMINS_SIGNED_2023'
      }
    ],
    calibrations: [
      {
        id: 'QSB67_250HP_1800_PRIME',
        name: 'QSB6.7 250HP @ 1800RPM Prime Power',
        engineModel: 'QSB6.7',
        powerRating: { kw: 186, hp: 250, rpm: 1800, application: 'prime' },
        emissionStandard: 'EPA Tier 4 Final',
        governorType: 'isochronous',
        application: 'Generator Prime Power',
        version: '3.2.1',
        releaseDate: '2024-01-10',
        requiredFirmware: ['6.30.0', '6.32.0'],
        parameters: [
          {
            id: 'HIGH_IDLE',
            name: 'High Idle Speed',
            category: 'Governor',
            value: 1850,
            unit: 'rpm',
            min: 1800,
            max: 1900,
            step: 10,
            editable: true,
            requiresAuth: 2,
            affectsEmissions: false,
            description: 'Maximum engine speed at no load'
          },
          {
            id: 'LOW_IDLE',
            name: 'Low Idle Speed',
            category: 'Governor',
            value: 700,
            unit: 'rpm',
            min: 600,
            max: 800,
            step: 10,
            editable: true,
            requiresAuth: 2,
            affectsEmissions: true,
            description: 'Minimum engine speed at no load'
          },
          {
            id: 'DROOP',
            name: 'Governor Droop',
            category: 'Governor',
            value: 0,
            unit: '%',
            min: 0,
            max: 10,
            step: 0.5,
            editable: true,
            requiresAuth: 2,
            affectsEmissions: false,
            description: 'Speed droop from no load to full load'
          },
          {
            id: 'RATED_POWER',
            name: 'Rated Power Limit',
            category: 'Power',
            value: 186,
            unit: 'kW',
            min: 100,
            max: 224,
            step: 1,
            editable: true,
            requiresAuth: 3,
            affectsEmissions: true,
            description: 'Maximum engine power output'
          }
        ],
        checksum: 'CAL_QSB67_3.2.1'
      }
    ],
    compatibleControllers: [
      {
        controllerModel: 'DSE 7320',
        manufacturer: 'Deep Sea Electronics',
        firmwareRange: { min: '5.0.0' },
        canConfiguration: {
          baudRate: 250000,
          sourceAddress: 0x00,
          requiredPGNs: [61444, 65262, 65263, 65226],
          optionalPGNs: [65266, 65270],
          terminationRequired: true
        }
      },
      {
        controllerModel: 'InteliGen NT',
        manufacturer: 'ComAp',
        firmwareRange: { min: '3.0.0' },
        canConfiguration: {
          baudRate: 250000,
          sourceAddress: 0x00,
          requiredPGNs: [61444, 65262, 65263, 65226],
          optionalPGNs: [65266, 65270, 65271],
          terminationRequired: true
        }
      }
    ],
    schematicUrl: '/schematics/cummins_cm2350_wiring.pdf',
    serviceManualUrl: '/manuals/cummins_cm2350_service.pdf'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CATERPILLAR ECMs
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'CAT_A5E2',
    manufacturer: 'Caterpillar',
    family: 'A5',
    model: 'A5E2',
    variants: ['A5E2', 'A5E2:31', 'A5E2:34'],
    productionYears: { start: 2017, end: null },
    engineApplications: [
      {
        engineModel: 'C9.3',
        displacement: 9.3,
        cylinders: 6,
        powerRatings: [
          { kw: 261, hp: 350, rpm: 1800, application: 'prime' },
          { kw: 280, hp: 375, rpm: 1800, application: 'standby' }
        ],
        emissionStandards: ['EPA Tier 4 Final', 'EU Stage V']
      },
      {
        engineModel: 'C13',
        displacement: 12.5,
        cylinders: 6,
        powerRatings: [
          { kw: 298, hp: 400, rpm: 1800, application: 'prime' },
          { kw: 354, hp: 475, rpm: 1800, application: 'standby' }
        ],
        emissionStandards: ['EPA Tier 4 Final', 'EU Stage V']
      },
      {
        engineModel: 'C15',
        displacement: 15.2,
        cylinders: 6,
        powerRatings: [
          { kw: 403, hp: 540, rpm: 1800, application: 'prime' },
          { kw: 448, hp: 600, rpm: 1800, application: 'standby' }
        ],
        emissionStandards: ['EPA Tier 4 Final', 'EU Stage V']
      },
      {
        engineModel: 'C18',
        displacement: 18.1,
        cylinders: 6,
        powerRatings: [
          { kw: 522, hp: 700, rpm: 1800, application: 'prime' },
          { kw: 597, hp: 800, rpm: 1800, application: 'standby' }
        ],
        emissionStandards: ['EPA Tier 4 Final', 'EU Stage V']
      }
    ],
    protocols: ['J1939', 'CAT_Datalink'],
    connectorType: 'CAT 14-Pin Service Port',
    features: [
      { name: 'ACERT Technology', description: 'Advanced combustion emissions reduction', category: 'engine_control' },
      { name: 'Adaptive Fuel System', description: 'Self-learning fuel injection timing', category: 'engine_control' },
      { name: 'Product Link', description: 'Telematics and remote monitoring', category: 'communication' }
    ],
    firmwareVersions: [
      {
        version: '9.21.0',
        releaseDate: '2024-02-20',
        status: 'current',
        releaseNotes: ['Enhanced Tier 4 Final compliance', 'Improved fuel economy maps'],
        bugFixes: ['Fixed SPN 168 intermittent fault', 'Corrected turbo boost calculation'],
        newFeatures: ['New idle shutdown timer options', 'Extended diagnostic coverage'],
        knownIssues: [],
        minimumHardwareRevision: 'REV-A',
        compatibleCalibrations: ['C9_*', 'C13_*', 'C15_*', 'C18_*'],
        fileSize: 8388608,
        checksum: 'CAT921A5E2',
        signature: 'CAT_SIGNED_2024'
      }
    ],
    calibrations: [
      {
        id: 'C13_400HP_1800_PRIME',
        name: 'C13 400HP @ 1800RPM Prime Power',
        engineModel: 'C13',
        powerRating: { kw: 298, hp: 400, rpm: 1800, application: 'prime' },
        emissionStandard: 'EPA Tier 4 Final',
        governorType: 'isochronous',
        application: 'Generator Prime Power',
        version: '2.1.0',
        releaseDate: '2024-01-15',
        requiredFirmware: ['9.21.0'],
        parameters: [],
        checksum: 'CAL_C13_2.1.0'
      }
    ],
    compatibleControllers: [
      {
        controllerModel: 'EMCP 4.4',
        manufacturer: 'Caterpillar',
        firmwareRange: { min: '3.0.0' },
        canConfiguration: {
          baudRate: 250000,
          sourceAddress: 0x00,
          requiredPGNs: [61444, 65262, 65263, 65226],
          optionalPGNs: [],
          terminationRequired: true
        }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // VOLVO PENTA ECMs
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'VOLVO_EMS2',
    manufacturer: 'Volvo Penta',
    family: 'EMS2',
    model: 'EMS2',
    variants: ['EMS2', 'EMS2.3'],
    productionYears: { start: 2015, end: null },
    engineApplications: [
      {
        engineModel: 'TAD530GE',
        displacement: 5.1,
        cylinders: 4,
        powerRatings: [
          { kw: 100, hp: 134, rpm: 1500, application: 'prime' },
          { kw: 110, hp: 148, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['EU Stage V']
      },
      {
        engineModel: 'TAD734GE',
        displacement: 7.1,
        cylinders: 6,
        powerRatings: [
          { kw: 160, hp: 215, rpm: 1500, application: 'prime' },
          { kw: 176, hp: 236, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['EU Stage V']
      },
      {
        engineModel: 'TAD1344GE',
        displacement: 12.8,
        cylinders: 6,
        powerRatings: [
          { kw: 320, hp: 429, rpm: 1500, application: 'prime' },
          { kw: 350, hp: 469, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['EU Stage V']
      }
    ],
    protocols: ['J1939', 'Volvo_VOCOM'],
    connectorType: 'Volvo 8-Pin Diagnostic',
    features: [
      { name: 'V-ACT', description: 'Volvo Advanced Combustion Technology', category: 'engine_control' },
      { name: 'I-SAM', description: 'Intelligent Support Aftertreatment Management', category: 'aftertreatment' }
    ],
    firmwareVersions: [
      {
        version: '4.15.0',
        releaseDate: '2024-01-10',
        status: 'current',
        releaseNotes: ['Stage V compliance', 'Improved SCR efficiency'],
        bugFixes: ['Fixed aftertreatment temperature sensor fault'],
        newFeatures: ['Remote diagnostics support'],
        knownIssues: [],
        minimumHardwareRevision: 'REV-A',
        compatibleCalibrations: ['TAD*'],
        fileSize: 6291456,
        checksum: 'VOLVO415EMS2',
        signature: 'VOLVO_SIGNED_2024'
      }
    ],
    calibrations: [],
    compatibleControllers: [
      {
        controllerModel: 'DSE 8610',
        manufacturer: 'Deep Sea Electronics',
        firmwareRange: { min: '4.0.0' },
        canConfiguration: {
          baudRate: 250000,
          sourceAddress: 0x00,
          requiredPGNs: [61444, 65262],
          optionalPGNs: [],
          terminationRequired: true
        }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PERKINS ECMs
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'PERKINS_1300EDi',
    manufacturer: 'Perkins',
    family: '1300 Series',
    model: '1300EDi',
    variants: ['1306C-E87TAG', '1306A-E87TAG'],
    productionYears: { start: 2012, end: null },
    engineApplications: [
      {
        engineModel: '1306C-E87TAG6',
        displacement: 8.7,
        cylinders: 6,
        powerRatings: [
          { kw: 230, hp: 308, rpm: 1500, application: 'prime' },
          { kw: 250, hp: 335, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['EU Stage IIIA', 'EPA Tier 3']
      }
    ],
    protocols: ['J1939', 'Perkins_EST'],
    connectorType: 'Perkins 9-Pin',
    features: [],
    firmwareVersions: [
      {
        version: '2.45.0',
        releaseDate: '2023-11-01',
        status: 'current',
        releaseNotes: ['Improved transient response'],
        bugFixes: [],
        newFeatures: [],
        knownIssues: [],
        minimumHardwareRevision: 'REV-A',
        compatibleCalibrations: ['1306*'],
        fileSize: 3145728,
        checksum: 'PERK245EDI',
        signature: 'PERKINS_SIGNED_2023'
      }
    ],
    calibrations: [],
    compatibleControllers: []
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // JOHN DEERE ECMs
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'DEERE_ECU12',
    manufacturer: 'John Deere',
    family: 'PowerTech',
    model: 'ECU12',
    variants: ['ECU12', 'ECU12B'],
    productionYears: { start: 2014, end: null },
    engineApplications: [
      {
        engineModel: '6068HF485',
        displacement: 6.8,
        cylinders: 6,
        powerRatings: [
          { kw: 187, hp: 250, rpm: 1800, application: 'prime' }
        ],
        emissionStandards: ['EPA Tier 4 Final']
      }
    ],
    protocols: ['J1939', 'Deere_ServiceAdvisor'],
    connectorType: 'Deere 9-Pin',
    features: [],
    firmwareVersions: [],
    calibrations: [],
    compatibleControllers: []
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEUTZ ECMs
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'DEUTZ_EMR4',
    manufacturer: 'Deutz',
    family: 'EMR4',
    model: 'EMR4',
    variants: ['EMR4', 'EMR4.1'],
    productionYears: { start: 2016, end: null },
    engineApplications: [
      {
        engineModel: 'TCD 6.1 L6',
        displacement: 6.1,
        cylinders: 6,
        powerRatings: [
          { kw: 160, hp: 215, rpm: 1500, application: 'prime' }
        ],
        emissionStandards: ['EU Stage V']
      },
      {
        engineModel: 'TCD 7.8 L6',
        displacement: 7.8,
        cylinders: 6,
        powerRatings: [
          { kw: 240, hp: 322, rpm: 1500, application: 'prime' }
        ],
        emissionStandards: ['EU Stage V']
      }
    ],
    protocols: ['J1939'],
    connectorType: 'Deutsch 12-Pin',
    features: [],
    firmwareVersions: [],
    calibrations: [],
    compatibleControllers: []
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MTU ECMs
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'MTU_MDEC',
    manufacturer: 'MTU',
    family: 'MDEC',
    model: 'MDEC',
    variants: ['MDEC', 'MDEC II'],
    productionYears: { start: 2010, end: null },
    engineApplications: [
      {
        engineModel: '12V2000',
        displacement: 26.8,
        cylinders: 12,
        powerRatings: [
          { kw: 900, hp: 1207, rpm: 1500, application: 'prime' }
        ],
        emissionStandards: ['IMO Tier II']
      },
      {
        engineModel: '16V2000',
        displacement: 35.7,
        cylinders: 16,
        powerRatings: [
          { kw: 1200, hp: 1609, rpm: 1500, application: 'prime' }
        ],
        emissionStandards: ['IMO Tier II']
      }
    ],
    protocols: ['J1939'],
    connectorType: 'MTU 14-Pin',
    features: [],
    firmwareVersions: [],
    calibrations: [],
    compatibleControllers: []
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LISTER PETTER ECMs
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'LISTER_LPWG',
    manufacturer: 'Lister Petter',
    family: 'LPW/S Series',
    model: 'LPWG ECU',
    variants: ['LPWG2', 'LPWG3', 'LPWG4', 'LPW2', 'LPW3', 'LPW4'],
    productionYears: { start: 2005, end: null },
    engineApplications: [
      {
        engineModel: 'LPW2',
        displacement: 0.93,
        cylinders: 2,
        powerRatings: [
          { kw: 9, hp: 12, rpm: 1500, application: 'prime' },
          { kw: 10, hp: 13, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['EPA Tier 3']
      },
      {
        engineModel: 'LPW3',
        displacement: 1.4,
        cylinders: 3,
        powerRatings: [
          { kw: 14, hp: 19, rpm: 1500, application: 'prime' },
          { kw: 16, hp: 21, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['EPA Tier 3']
      },
      {
        engineModel: 'LPW4',
        displacement: 1.86,
        cylinders: 4,
        powerRatings: [
          { kw: 24, hp: 32, rpm: 1500, application: 'prime' },
          { kw: 27, hp: 36, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['EPA Tier 3']
      },
      {
        engineModel: 'LPWS4',
        displacement: 1.86,
        cylinders: 4,
        powerRatings: [
          { kw: 30, hp: 40, rpm: 1800, application: 'prime' }
        ],
        emissionStandards: ['EPA Tier 4']
      }
    ],
    protocols: ['J1939', 'Modbus_RTU'],
    connectorType: 'Deutsch 6-Pin',
    features: [
      { name: 'Mechanical Simplicity', description: 'Simple robust design for harsh environments', category: 'engine_control' },
      { name: 'Low Maintenance', description: 'Extended service intervals', category: 'diagnostics' }
    ],
    firmwareVersions: [
      {
        version: '2.15.0',
        releaseDate: '2023-08-15',
        status: 'current',
        releaseNotes: ['Improved cold start', 'Enhanced governor response'],
        bugFixes: ['Fixed speed hunting at low load'],
        newFeatures: ['Remote monitoring support'],
        knownIssues: [],
        minimumHardwareRevision: 'REV-A',
        compatibleCalibrations: ['LPW*', 'LPWS*'],
        fileSize: 1048576,
        checksum: 'LP215ECU',
        signature: 'LISTER_SIGNED_2023'
      }
    ],
    calibrations: [
      {
        id: 'LPW4_24KW_1500_PRIME',
        name: 'LPW4 24kW @ 1500RPM Prime Power',
        engineModel: 'LPW4',
        powerRating: { kw: 24, hp: 32, rpm: 1500, application: 'prime' },
        emissionStandard: 'EPA Tier 3',
        governorType: 'isochronous',
        application: 'Generator Prime Power',
        version: '1.5.0',
        releaseDate: '2023-06-01',
        requiredFirmware: ['2.15.0'],
        parameters: [
          {
            id: 'HIGH_IDLE',
            name: 'High Idle Speed',
            category: 'Governor',
            value: 1550,
            unit: 'rpm',
            min: 1500,
            max: 1600,
            step: 10,
            editable: true,
            requiresAuth: 2,
            affectsEmissions: false,
            description: 'Maximum engine speed at no load'
          }
        ],
        checksum: 'CAL_LPW4_1.5.0'
      }
    ],
    compatibleControllers: [
      {
        controllerModel: 'DSE 4520',
        manufacturer: 'Deep Sea Electronics',
        firmwareRange: { min: '3.0.0' },
        canConfiguration: {
          baudRate: 250000,
          sourceAddress: 0x00,
          requiredPGNs: [61444, 65262],
          optionalPGNs: [],
          terminationRequired: true
        }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HONDA ECMs
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'HONDA_GX_EFI',
    manufacturer: 'Honda',
    family: 'GX Series EFI',
    model: 'GX EFI ECU',
    variants: ['GX390', 'GX630', 'GX690', 'iGX440', 'iGX700', 'iGX800'],
    productionYears: { start: 2012, end: null },
    engineApplications: [
      {
        engineModel: 'GX390',
        displacement: 0.389,
        cylinders: 1,
        powerRatings: [
          { kw: 8.7, hp: 11.7, rpm: 3600, application: 'prime' }
        ],
        emissionStandards: ['EPA', 'CARB']
      },
      {
        engineModel: 'GX630',
        displacement: 0.688,
        cylinders: 2,
        powerRatings: [
          { kw: 15.5, hp: 20.8, rpm: 3600, application: 'prime' }
        ],
        emissionStandards: ['EPA', 'CARB']
      },
      {
        engineModel: 'GX690',
        displacement: 0.688,
        cylinders: 2,
        powerRatings: [
          { kw: 16.5, hp: 22.1, rpm: 3600, application: 'prime' }
        ],
        emissionStandards: ['EPA', 'CARB']
      },
      {
        engineModel: 'iGX700',
        displacement: 0.688,
        cylinders: 2,
        powerRatings: [
          { kw: 17, hp: 22.8, rpm: 3600, application: 'prime' }
        ],
        emissionStandards: ['EPA', 'CARB', 'EU Stage V']
      },
      {
        engineModel: 'iGX800',
        displacement: 0.779,
        cylinders: 2,
        powerRatings: [
          { kw: 19, hp: 25.5, rpm: 3600, application: 'prime' }
        ],
        emissionStandards: ['EPA', 'CARB', 'EU Stage V']
      }
    ],
    protocols: ['Honda_HDS', 'J1939'],
    connectorType: 'Honda 4-Pin DLC',
    features: [
      { name: 'Fuel Injection', description: 'Electronic fuel injection for clean starts', category: 'engine_control' },
      { name: 'STR System', description: 'Self-Tuning Regulator for stable output', category: 'engine_control' },
      { name: 'Oil Alert', description: 'Low oil shutdown protection', category: 'safety' }
    ],
    firmwareVersions: [
      {
        version: '3.20.0',
        releaseDate: '2024-01-20',
        status: 'current',
        releaseNotes: ['Improved fuel economy', 'Enhanced cold weather starting'],
        bugFixes: ['Fixed idle instability at altitude'],
        newFeatures: ['Bluetooth diagnostics support'],
        knownIssues: [],
        minimumHardwareRevision: 'REV-B',
        compatibleCalibrations: ['GX*', 'iGX*'],
        fileSize: 524288,
        checksum: 'HONDA320EFI',
        signature: 'HONDA_SIGNED_2024'
      }
    ],
    calibrations: [],
    compatibleControllers: [
      {
        controllerModel: 'DSE 3110',
        manufacturer: 'Deep Sea Electronics',
        firmwareRange: { min: '2.0.0' },
        canConfiguration: {
          baudRate: 250000,
          sourceAddress: 0x00,
          requiredPGNs: [61444],
          optionalPGNs: [],
          terminationRequired: false
        }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DOOSAN ECMs
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'DOOSAN_DL_ECU',
    manufacturer: 'Doosan',
    family: 'DL Series',
    model: 'DL ECU',
    variants: ['DL06', 'DL08', 'DP086', 'DP126', 'DP158', 'DP180', 'DP222'],
    productionYears: { start: 2010, end: null },
    engineApplications: [
      {
        engineModel: 'DL06',
        displacement: 5.9,
        cylinders: 6,
        powerRatings: [
          { kw: 140, hp: 188, rpm: 1500, application: 'prime' },
          { kw: 155, hp: 208, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['EPA Tier 4 Final', 'EU Stage V']
      },
      {
        engineModel: 'DL08',
        displacement: 7.6,
        cylinders: 6,
        powerRatings: [
          { kw: 225, hp: 302, rpm: 1500, application: 'prime' },
          { kw: 250, hp: 335, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['EPA Tier 4 Final', 'EU Stage V']
      },
      {
        engineModel: 'DP158',
        displacement: 15.0,
        cylinders: 6,
        powerRatings: [
          { kw: 400, hp: 536, rpm: 1500, application: 'prime' },
          { kw: 450, hp: 603, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['EPA Tier 2']
      },
      {
        engineModel: 'DP180',
        displacement: 18.0,
        cylinders: 6,
        powerRatings: [
          { kw: 500, hp: 670, rpm: 1500, application: 'prime' },
          { kw: 550, hp: 737, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['EPA Tier 2']
      },
      {
        engineModel: 'DP222',
        displacement: 22.0,
        cylinders: 8,
        powerRatings: [
          { kw: 600, hp: 804, rpm: 1500, application: 'prime' },
          { kw: 660, hp: 885, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['EPA Tier 2']
      }
    ],
    protocols: ['J1939', 'Doosan_Datalink'],
    connectorType: 'Doosan 12-Pin',
    features: [
      { name: 'Common Rail', description: 'High pressure common rail fuel system', category: 'engine_control' },
      { name: 'EGR Control', description: 'Exhaust gas recirculation management', category: 'aftertreatment' },
      { name: 'DoosanCONNECT', description: 'Telematics and remote monitoring', category: 'communication' }
    ],
    firmwareVersions: [
      {
        version: '4.10.0',
        releaseDate: '2024-02-01',
        status: 'current',
        releaseNotes: ['Stage V emissions compliance', 'Improved transient response'],
        bugFixes: ['Fixed turbo boost overshoot'],
        newFeatures: ['Enhanced diagnostics depth'],
        knownIssues: [],
        minimumHardwareRevision: 'REV-A',
        compatibleCalibrations: ['DL*', 'DP*'],
        fileSize: 4194304,
        checksum: 'DOOSAN410ECU',
        signature: 'DOOSAN_SIGNED_2024'
      }
    ],
    calibrations: [
      {
        id: 'DL08_225KW_1500_PRIME',
        name: 'DL08 225kW @ 1500RPM Prime Power',
        engineModel: 'DL08',
        powerRating: { kw: 225, hp: 302, rpm: 1500, application: 'prime' },
        emissionStandard: 'EPA Tier 4 Final',
        governorType: 'isochronous',
        application: 'Generator Prime Power',
        version: '2.0.0',
        releaseDate: '2024-01-15',
        requiredFirmware: ['4.10.0'],
        parameters: [
          {
            id: 'HIGH_IDLE',
            name: 'High Idle Speed',
            category: 'Governor',
            value: 1550,
            unit: 'rpm',
            min: 1500,
            max: 1600,
            step: 10,
            editable: true,
            requiresAuth: 2,
            affectsEmissions: false,
            description: 'Maximum engine speed at no load'
          }
        ],
        checksum: 'CAL_DL08_2.0.0'
      }
    ],
    compatibleControllers: [
      {
        controllerModel: 'DSE 7320',
        manufacturer: 'Deep Sea Electronics',
        firmwareRange: { min: '5.0.0' },
        canConfiguration: {
          baudRate: 250000,
          sourceAddress: 0x00,
          requiredPGNs: [61444, 65262, 65263],
          optionalPGNs: [65266],
          terminationRequired: true
        }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MAN ECMs
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'MAN_EDC7',
    manufacturer: 'MAN',
    family: 'D Series',
    model: 'EDC7',
    variants: ['D0834', 'D0836', 'D2066', 'D2676', 'D2862', 'D2868'],
    productionYears: { start: 2008, end: null },
    engineApplications: [
      {
        engineModel: 'D0834',
        displacement: 4.6,
        cylinders: 4,
        powerRatings: [
          { kw: 110, hp: 148, rpm: 1500, application: 'prime' },
          { kw: 125, hp: 168, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['EU Stage V']
      },
      {
        engineModel: 'D0836',
        displacement: 6.9,
        cylinders: 6,
        powerRatings: [
          { kw: 185, hp: 248, rpm: 1500, application: 'prime' },
          { kw: 200, hp: 268, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['EU Stage V']
      },
      {
        engineModel: 'D2676',
        displacement: 12.4,
        cylinders: 6,
        powerRatings: [
          { kw: 360, hp: 483, rpm: 1500, application: 'prime' },
          { kw: 400, hp: 536, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['EU Stage V']
      },
      {
        engineModel: 'D2862',
        displacement: 24.2,
        cylinders: 12,
        powerRatings: [
          { kw: 735, hp: 986, rpm: 1500, application: 'prime' },
          { kw: 800, hp: 1073, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['IMO Tier III']
      },
      {
        engineModel: 'D2868',
        displacement: 16.2,
        cylinders: 8,
        powerRatings: [
          { kw: 500, hp: 670, rpm: 1500, application: 'prime' },
          { kw: 550, hp: 737, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['EU Stage V']
      }
    ],
    protocols: ['J1939', 'MAN_CATS'],
    connectorType: 'MAN 16-Pin OBD',
    features: [
      { name: 'Common Rail', description: 'High pressure common rail injection', category: 'engine_control' },
      { name: 'SCR System', description: 'Selective catalytic reduction', category: 'aftertreatment' },
      { name: 'MAN TeleMatics', description: 'Fleet management system', category: 'communication' }
    ],
    firmwareVersions: [
      {
        version: '5.25.0',
        releaseDate: '2024-01-10',
        status: 'current',
        releaseNotes: ['Stage V compliance', 'Improved SCR efficiency'],
        bugFixes: ['Fixed AdBlue dosing calculation'],
        newFeatures: ['Remote parameter adjustment'],
        knownIssues: [],
        minimumHardwareRevision: 'REV-C',
        compatibleCalibrations: ['D08*', 'D26*', 'D28*'],
        fileSize: 6291456,
        checksum: 'MAN525EDC7',
        signature: 'MAN_SIGNED_2024'
      }
    ],
    calibrations: [],
    compatibleControllers: [
      {
        controllerModel: 'DSE 8610',
        manufacturer: 'Deep Sea Electronics',
        firmwareRange: { min: '4.0.0' },
        canConfiguration: {
          baudRate: 250000,
          sourceAddress: 0x00,
          requiredPGNs: [61444, 65262, 65263, 65226],
          optionalPGNs: [65266, 65271],
          terminationRequired: true
        }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // IVECO ECMs
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'IVECO_EDC17',
    manufacturer: 'Iveco',
    family: 'NEF/Cursor Series',
    model: 'EDC17',
    variants: ['NEF45', 'NEF67', 'Cursor8', 'Cursor10', 'Cursor13', 'Cursor16'],
    productionYears: { start: 2012, end: null },
    engineApplications: [
      {
        engineModel: 'NEF45',
        displacement: 4.5,
        cylinders: 4,
        powerRatings: [
          { kw: 95, hp: 127, rpm: 1500, application: 'prime' },
          { kw: 105, hp: 141, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['EU Stage V']
      },
      {
        engineModel: 'NEF67',
        displacement: 6.7,
        cylinders: 6,
        powerRatings: [
          { kw: 160, hp: 215, rpm: 1500, application: 'prime' },
          { kw: 180, hp: 241, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['EU Stage V']
      },
      {
        engineModel: 'Cursor8',
        displacement: 7.8,
        cylinders: 6,
        powerRatings: [
          { kw: 220, hp: 295, rpm: 1500, application: 'prime' },
          { kw: 250, hp: 335, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['EU Stage V']
      },
      {
        engineModel: 'Cursor13',
        displacement: 12.9,
        cylinders: 6,
        powerRatings: [
          { kw: 400, hp: 536, rpm: 1500, application: 'prime' },
          { kw: 440, hp: 590, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['EU Stage V']
      },
      {
        engineModel: 'Cursor16',
        displacement: 15.9,
        cylinders: 6,
        powerRatings: [
          { kw: 500, hp: 670, rpm: 1500, application: 'prime' },
          { kw: 550, hp: 737, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['EU Stage V']
      }
    ],
    protocols: ['J1939', 'Iveco_MODUS'],
    connectorType: 'Iveco 16-Pin OBD',
    features: [
      { name: 'HI-eSCR', description: 'High efficiency SCR without EGR', category: 'aftertreatment' },
      { name: 'Smart EGR', description: 'Intelligent exhaust gas recirculation', category: 'aftertreatment' }
    ],
    firmwareVersions: [
      {
        version: '4.18.0',
        releaseDate: '2024-02-15',
        status: 'current',
        releaseNotes: ['Improved fuel efficiency', 'Enhanced cold start'],
        bugFixes: ['Fixed DPF regeneration timing'],
        newFeatures: ['Extended diagnostics'],
        knownIssues: [],
        minimumHardwareRevision: 'REV-B',
        compatibleCalibrations: ['NEF*', 'Cursor*'],
        fileSize: 5242880,
        checksum: 'IVECO418EDC',
        signature: 'IVECO_SIGNED_2024'
      }
    ],
    calibrations: [],
    compatibleControllers: [
      {
        controllerModel: 'DSE 7320',
        manufacturer: 'Deep Sea Electronics',
        firmwareRange: { min: '5.0.0' },
        canConfiguration: {
          baudRate: 250000,
          sourceAddress: 0x00,
          requiredPGNs: [61444, 65262, 65263],
          optionalPGNs: [],
          terminationRequired: true
        }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SDMO / KOHLER ECMs
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'SDMO_APM',
    manufacturer: 'SDMO',
    family: 'APM Series',
    model: 'APM802',
    variants: ['APM303', 'APM403', 'APM802'],
    productionYears: { start: 2015, end: null },
    engineApplications: [
      {
        engineModel: 'J33',
        displacement: 3.3,
        cylinders: 4,
        powerRatings: [
          { kw: 30, hp: 40, rpm: 1500, application: 'prime' }
        ],
        emissionStandards: ['EU Stage IIIA']
      },
      {
        engineModel: 'J66',
        displacement: 6.6,
        cylinders: 6,
        powerRatings: [
          { kw: 110, hp: 148, rpm: 1500, application: 'prime' }
        ],
        emissionStandards: ['EU Stage IIIA']
      },
      {
        engineModel: 'J130',
        displacement: 6.7,
        cylinders: 6,
        powerRatings: [
          { kw: 130, hp: 174, rpm: 1500, application: 'prime' }
        ],
        emissionStandards: ['EU Stage V']
      },
      {
        engineModel: 'J220',
        displacement: 9.0,
        cylinders: 6,
        powerRatings: [
          { kw: 220, hp: 295, rpm: 1500, application: 'prime' }
        ],
        emissionStandards: ['EU Stage V']
      },
      {
        engineModel: 'J440',
        displacement: 13.0,
        cylinders: 6,
        powerRatings: [
          { kw: 440, hp: 590, rpm: 1500, application: 'prime' }
        ],
        emissionStandards: ['EU Stage V']
      }
    ],
    protocols: ['J1939', 'Modbus_RTU', 'SDMO_Link'],
    connectorType: 'SDMO 9-Pin',
    features: [
      { name: 'APM Controller', description: 'Integrated genset control and protection', category: 'engine_control' },
      { name: 'KOHLER Connect', description: 'Remote monitoring and control', category: 'communication' },
      { name: 'Decision-Maker', description: 'Advanced paralleling capability', category: 'engine_control' }
    ],
    firmwareVersions: [
      {
        version: '3.50.0',
        releaseDate: '2024-01-25',
        status: 'current',
        releaseNotes: ['Enhanced paralleling algorithms', 'Improved load sharing'],
        bugFixes: ['Fixed communication timeout issues'],
        newFeatures: ['Cloud connectivity'],
        knownIssues: [],
        minimumHardwareRevision: 'REV-A',
        compatibleCalibrations: ['J*'],
        fileSize: 2097152,
        checksum: 'SDMO350APM',
        signature: 'SDMO_SIGNED_2024'
      }
    ],
    calibrations: [],
    compatibleControllers: [
      {
        controllerModel: 'APM802',
        manufacturer: 'SDMO/Kohler',
        firmwareRange: { min: '3.0.0' },
        canConfiguration: {
          baudRate: 250000,
          sourceAddress: 0x00,
          requiredPGNs: [61444, 65262],
          optionalPGNs: [],
          terminationRequired: true
        }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MASSEY FERGUSON / AGCO ECMs
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'FERGUSON_SISU',
    manufacturer: 'Massey Ferguson',
    family: 'AGCO SISU Power',
    model: 'SISU ECU',
    variants: ['33AWI', '44AWI', '49AWI', '66AWI', '74AWI', '84AWI', '98AWI'],
    productionYears: { start: 2010, end: null },
    engineApplications: [
      {
        engineModel: '33AWI',
        displacement: 3.3,
        cylinders: 3,
        powerRatings: [
          { kw: 50, hp: 67, rpm: 1500, application: 'prime' }
        ],
        emissionStandards: ['EU Stage V']
      },
      {
        engineModel: '44AWI',
        displacement: 4.4,
        cylinders: 4,
        powerRatings: [
          { kw: 75, hp: 101, rpm: 1500, application: 'prime' },
          { kw: 85, hp: 114, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['EU Stage V']
      },
      {
        engineModel: '66AWI',
        displacement: 6.6,
        cylinders: 6,
        powerRatings: [
          { kw: 145, hp: 194, rpm: 1500, application: 'prime' },
          { kw: 160, hp: 215, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['EU Stage V']
      },
      {
        engineModel: '84AWI',
        displacement: 8.4,
        cylinders: 6,
        powerRatings: [
          { kw: 225, hp: 302, rpm: 1500, application: 'prime' },
          { kw: 250, hp: 335, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['EU Stage V']
      },
      {
        engineModel: '98AWI',
        displacement: 9.8,
        cylinders: 6,
        powerRatings: [
          { kw: 300, hp: 402, rpm: 1500, application: 'prime' },
          { kw: 330, hp: 442, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['EU Stage V']
      }
    ],
    protocols: ['J1939', 'AGCO_EDT'],
    connectorType: 'Deutsch 9-Pin',
    features: [
      { name: 'SCR Only', description: 'No DPF required for Stage V', category: 'aftertreatment' },
      { name: 'AGCO Power', description: 'Optimized for power generation', category: 'engine_control' }
    ],
    firmwareVersions: [
      {
        version: '2.80.0',
        releaseDate: '2024-01-05',
        status: 'current',
        releaseNotes: ['Stage V certification', 'Improved cold start'],
        bugFixes: ['Fixed SCR dosing at low temps'],
        newFeatures: ['Remote diagnostics'],
        knownIssues: [],
        minimumHardwareRevision: 'REV-A',
        compatibleCalibrations: ['*AWI*'],
        fileSize: 3145728,
        checksum: 'SISU280ECU',
        signature: 'AGCO_SIGNED_2024'
      }
    ],
    calibrations: [],
    compatibleControllers: [
      {
        controllerModel: 'DSE 7320',
        manufacturer: 'Deep Sea Electronics',
        firmwareRange: { min: '5.0.0' },
        canConfiguration: {
          baudRate: 250000,
          sourceAddress: 0x00,
          requiredPGNs: [61444, 65262, 65263],
          optionalPGNs: [],
          terminationRequired: true
        }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // YANMAR ECMs
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'YANMAR_TNV',
    manufacturer: 'Yanmar',
    family: 'TNV Series',
    model: 'TNV ECU',
    variants: ['3TNV82A', '3TNV88', '4TNV84T', '4TNV86CT', '4TNV88', '4TNV94L', '4TNV98', '4TNV106T'],
    productionYears: { start: 2008, end: null },
    engineApplications: [
      {
        engineModel: '3TNV88',
        displacement: 1.6,
        cylinders: 3,
        powerRatings: [
          { kw: 18, hp: 24, rpm: 1500, application: 'prime' }
        ],
        emissionStandards: ['EPA Tier 4 Final', 'EU Stage V']
      },
      {
        engineModel: '4TNV88',
        displacement: 2.2,
        cylinders: 4,
        powerRatings: [
          { kw: 30, hp: 40, rpm: 1500, application: 'prime' },
          { kw: 35, hp: 47, rpm: 1800, application: 'standby' }
        ],
        emissionStandards: ['EPA Tier 4 Final', 'EU Stage V']
      },
      {
        engineModel: '4TNV98',
        displacement: 3.3,
        cylinders: 4,
        powerRatings: [
          { kw: 55, hp: 74, rpm: 1500, application: 'prime' },
          { kw: 60, hp: 80, rpm: 1800, application: 'standby' }
        ],
        emissionStandards: ['EPA Tier 4 Final', 'EU Stage V']
      },
      {
        engineModel: '4TNV106T',
        displacement: 4.6,
        cylinders: 4,
        powerRatings: [
          { kw: 90, hp: 121, rpm: 1500, application: 'prime' },
          { kw: 100, hp: 134, rpm: 1800, application: 'standby' }
        ],
        emissionStandards: ['EPA Tier 4 Final', 'EU Stage V']
      }
    ],
    protocols: ['J1939', 'Yanmar_Diag'],
    connectorType: 'Yanmar 6-Pin',
    features: [
      { name: 'Common Rail', description: 'Direct injection common rail', category: 'engine_control' },
      { name: 'DPF-free', description: 'No DPF required for Tier 4 Final', category: 'aftertreatment' },
      { name: 'SmartAssist', description: 'Remote diagnostics support', category: 'communication' }
    ],
    firmwareVersions: [
      {
        version: '3.45.0',
        releaseDate: '2024-02-10',
        status: 'current',
        releaseNotes: ['Enhanced fuel injection timing', 'Improved noise reduction'],
        bugFixes: ['Fixed intermittent speed sensor fault'],
        newFeatures: ['Extended self-diagnostics'],
        knownIssues: [],
        minimumHardwareRevision: 'REV-A',
        compatibleCalibrations: ['*TNV*'],
        fileSize: 2097152,
        checksum: 'YANMAR345TNV',
        signature: 'YANMAR_SIGNED_2024'
      }
    ],
    calibrations: [
      {
        id: '4TNV98_55KW_1500_PRIME',
        name: '4TNV98 55kW @ 1500RPM Prime Power',
        engineModel: '4TNV98',
        powerRating: { kw: 55, hp: 74, rpm: 1500, application: 'prime' },
        emissionStandard: 'EPA Tier 4 Final',
        governorType: 'isochronous',
        application: 'Generator Prime Power',
        version: '1.8.0',
        releaseDate: '2024-01-20',
        requiredFirmware: ['3.45.0'],
        parameters: [
          {
            id: 'HIGH_IDLE',
            name: 'High Idle Speed',
            category: 'Governor',
            value: 1550,
            unit: 'rpm',
            min: 1500,
            max: 1600,
            step: 10,
            editable: true,
            requiresAuth: 2,
            affectsEmissions: false,
            description: 'Maximum engine speed at no load'
          }
        ],
        checksum: 'CAL_4TNV98_1.8.0'
      }
    ],
    compatibleControllers: [
      {
        controllerModel: 'DSE 4520',
        manufacturer: 'Deep Sea Electronics',
        firmwareRange: { min: '3.0.0' },
        canConfiguration: {
          baudRate: 250000,
          sourceAddress: 0x00,
          requiredPGNs: [61444, 65262],
          optionalPGNs: [],
          terminationRequired: true
        }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WEICHAI ECMs
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'WEICHAI_ECU',
    manufacturer: 'Weichai',
    family: 'WP Series',
    model: 'Weichai ECU',
    variants: ['WP2.3', 'WP3.2', 'WP4.1', 'WP6', 'WP7', 'WP10', 'WP12', 'WP13', 'WP17'],
    productionYears: { start: 2012, end: null },
    engineApplications: [
      {
        engineModel: 'WP2.3',
        displacement: 2.3,
        cylinders: 4,
        powerRatings: [
          { kw: 36, hp: 48, rpm: 1500, application: 'prime' }
        ],
        emissionStandards: ['China IV', 'EU Stage IIIB']
      },
      {
        engineModel: 'WP4.1',
        displacement: 4.1,
        cylinders: 4,
        powerRatings: [
          { kw: 75, hp: 101, rpm: 1500, application: 'prime' },
          { kw: 85, hp: 114, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['China IV', 'EU Stage V']
      },
      {
        engineModel: 'WP6',
        displacement: 6.2,
        cylinders: 6,
        powerRatings: [
          { kw: 150, hp: 201, rpm: 1500, application: 'prime' },
          { kw: 165, hp: 221, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['China IV', 'EU Stage V']
      },
      {
        engineModel: 'WP10',
        displacement: 9.7,
        cylinders: 6,
        powerRatings: [
          { kw: 260, hp: 349, rpm: 1500, application: 'prime' },
          { kw: 290, hp: 389, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['China IV', 'EU Stage V']
      },
      {
        engineModel: 'WP12',
        displacement: 11.6,
        cylinders: 6,
        powerRatings: [
          { kw: 330, hp: 443, rpm: 1500, application: 'prime' },
          { kw: 365, hp: 489, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['China IV', 'EU Stage V']
      },
      {
        engineModel: 'WP13',
        displacement: 12.9,
        cylinders: 6,
        powerRatings: [
          { kw: 400, hp: 536, rpm: 1500, application: 'prime' },
          { kw: 440, hp: 590, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['China IV', 'EU Stage V']
      },
      {
        engineModel: 'WP17',
        displacement: 16.6,
        cylinders: 6,
        powerRatings: [
          { kw: 500, hp: 670, rpm: 1500, application: 'prime' },
          { kw: 550, hp: 737, rpm: 1500, application: 'standby' }
        ],
        emissionStandards: ['China IV']
      }
    ],
    protocols: ['J1939', 'Weichai_WOS'],
    connectorType: 'Weichai 12-Pin',
    features: [
      { name: 'WEECU', description: 'Weichai proprietary engine control', category: 'engine_control' },
      { name: 'Common Rail', description: 'Bosch common rail system', category: 'engine_control' },
      { name: 'WOS System', description: 'Weichai Operating System for diagnostics', category: 'diagnostics' },
      { name: 'Smart Power', description: 'Intelligent power management', category: 'engine_control' }
    ],
    firmwareVersions: [
      {
        version: '5.30.0',
        releaseDate: '2024-02-20',
        status: 'current',
        releaseNotes: ['Stage V compliance', 'Improved fuel maps'],
        bugFixes: ['Fixed boost pressure oscillation'],
        newFeatures: ['Remote firmware update support'],
        knownIssues: [],
        minimumHardwareRevision: 'REV-B',
        compatibleCalibrations: ['WP*'],
        fileSize: 4194304,
        checksum: 'WEICHAI530ECU',
        signature: 'WEICHAI_SIGNED_2024'
      }
    ],
    calibrations: [
      {
        id: 'WP10_260KW_1500_PRIME',
        name: 'WP10 260kW @ 1500RPM Prime Power',
        engineModel: 'WP10',
        powerRating: { kw: 260, hp: 349, rpm: 1500, application: 'prime' },
        emissionStandard: 'EU Stage V',
        governorType: 'isochronous',
        application: 'Generator Prime Power',
        version: '2.2.0',
        releaseDate: '2024-02-01',
        requiredFirmware: ['5.30.0'],
        parameters: [
          {
            id: 'HIGH_IDLE',
            name: 'High Idle Speed',
            category: 'Governor',
            value: 1550,
            unit: 'rpm',
            min: 1500,
            max: 1600,
            step: 10,
            editable: true,
            requiresAuth: 2,
            affectsEmissions: false,
            description: 'Maximum engine speed at no load'
          },
          {
            id: 'RATED_POWER',
            name: 'Rated Power Limit',
            category: 'Power',
            value: 260,
            unit: 'kW',
            min: 200,
            max: 290,
            step: 5,
            editable: true,
            requiresAuth: 3,
            affectsEmissions: true,
            description: 'Maximum engine power output'
          }
        ],
        checksum: 'CAL_WP10_2.2.0'
      }
    ],
    compatibleControllers: [
      {
        controllerModel: 'DSE 7320',
        manufacturer: 'Deep Sea Electronics',
        firmwareRange: { min: '5.0.0' },
        canConfiguration: {
          baudRate: 250000,
          sourceAddress: 0x00,
          requiredPGNs: [61444, 65262, 65263],
          optionalPGNs: [65266, 65270],
          terminationRequired: true
        }
      },
      {
        controllerModel: 'ComAp InteliGen',
        manufacturer: 'ComAp',
        firmwareRange: { min: '3.0.0' },
        canConfiguration: {
          baudRate: 250000,
          sourceAddress: 0x00,
          requiredPGNs: [61444, 65262, 65263],
          optionalPGNs: [],
          terminationRequired: true
        }
      }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPATIBILITY MATRIX
// ═══════════════════════════════════════════════════════════════════════════════

export interface CompatibilityEntry {
  ecmId: string;
  controllerId: string;
  status: 'fully_compatible' | 'compatible_with_limitations' | 'incompatible' | 'untested';
  limitations?: string[];
  requiredConfiguration?: string[];
  notes?: string;
}

export const COMPATIBILITY_MATRIX: CompatibilityEntry[] = [
  // Cummins CM2350 Compatibility
  {
    ecmId: 'CUMMINS_CM2350',
    controllerId: 'DSE_7320',
    status: 'fully_compatible',
    requiredConfiguration: ['CAN baud rate: 250kbps', 'Termination: Enabled', 'ECM Address: 0x00']
  },
  {
    ecmId: 'CUMMINS_CM2350',
    controllerId: 'DSE_8610',
    status: 'fully_compatible',
    requiredConfiguration: ['CAN baud rate: 250kbps', 'Termination: Enabled', 'ECM Address: 0x00']
  },
  {
    ecmId: 'CUMMINS_CM2350',
    controllerId: 'COMAP_INTELIGEN',
    status: 'fully_compatible',
    requiredConfiguration: ['J1939 Mode: Enabled', 'ECM Type: Cummins']
  },
  {
    ecmId: 'CUMMINS_CM2350',
    controllerId: 'WOODWARD_EASYGEN',
    status: 'fully_compatible'
  },

  // CAT A5E2 Compatibility
  {
    ecmId: 'CAT_A5E2',
    controllerId: 'CAT_EMCP44',
    status: 'fully_compatible',
    notes: 'Native CAT controller - optimal compatibility'
  },
  {
    ecmId: 'CAT_A5E2',
    controllerId: 'DSE_7320',
    status: 'compatible_with_limitations',
    limitations: ['Some CAT-specific parameters not available', 'Limited diagnostic depth'],
    requiredConfiguration: ['CAN baud rate: 250kbps', 'ECM Type: J1939 Generic']
  },

  // Volvo EMS2 Compatibility
  {
    ecmId: 'VOLVO_EMS2',
    controllerId: 'DSE_8610',
    status: 'fully_compatible',
    requiredConfiguration: ['CAN baud rate: 250kbps', 'ECM Type: Volvo']
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// DATABASE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function getECMById(id: string): ECMModel | undefined {
  return ECM_MODELS.find(ecm => ecm.id === id);
}

export function getECMsByManufacturer(manufacturer: string): ECMModel[] {
  return ECM_MODELS.filter(ecm =>
    ecm.manufacturer.toLowerCase() === manufacturer.toLowerCase()
  );
}

export function getECMBySerialPrefix(prefix: string): ECMModel | undefined {
  // Map serial number prefixes to ECM models
  const prefixMap: Record<string, string> = {
    // Cummins
    'CPL': 'CUMMINS_CM2350',
    'QSB': 'CUMMINS_CM2350',
    'QSL': 'CUMMINS_CM2350',
    'QSX': 'CUMMINS_CM2350',
    // Caterpillar
    'CAT': 'CAT_A5E2',
    'C9': 'CAT_A5E2',
    'C13': 'CAT_A5E2',
    'C15': 'CAT_A5E2',
    'C18': 'CAT_A5E2',
    // Volvo Penta
    'TAD': 'VOLVO_EMS2',
    'TWD': 'VOLVO_EMS2',
    // Perkins
    '130': 'PERKINS_1300EDi',
    // John Deere
    '606': 'DEERE_ECU12',
    // Deutz
    'TCD': 'DEUTZ_EMR4',
    // MTU
    '12V': 'MTU_MDEC',
    '16V': 'MTU_MDEC',
    // Lister Petter
    'LPW': 'LISTER_LPWG',
    'LPS': 'LISTER_LPWG',
    // Honda
    'GX': 'HONDA_GX_EFI',
    'iGX': 'HONDA_GX_EFI',
    // Doosan
    'DL0': 'DOOSAN_DL_ECU',
    'DP': 'DOOSAN_DL_ECU',
    // MAN
    'D08': 'MAN_EDC7',
    'D26': 'MAN_EDC7',
    'D28': 'MAN_EDC7',
    // Iveco
    'NEF': 'IVECO_EDC17',
    'Cursor': 'IVECO_EDC17',
    // SDMO
    'J33': 'SDMO_APM',
    'J66': 'SDMO_APM',
    'J130': 'SDMO_APM',
    'APM': 'SDMO_APM',
    // Massey Ferguson / AGCO
    'AWI': 'FERGUSON_SISU',
    'SISU': 'FERGUSON_SISU',
    // Yanmar
    'TNV': 'YANMAR_TNV',
    '3TNV': 'YANMAR_TNV',
    '4TNV': 'YANMAR_TNV',
    // Weichai
    'WP': 'WEICHAI_ECU'
  };

  const ecmId = Object.entries(prefixMap).find(([p]) =>
    prefix.toUpperCase().startsWith(p)
  )?.[1];

  return ecmId ? getECMById(ecmId) : undefined;
}

export function getFirmwareForECM(ecmId: string, version?: string): FirmwareVersion | undefined {
  const ecm = getECMById(ecmId);
  if (!ecm) return undefined;

  if (version) {
    return ecm.firmwareVersions.find(fw => fw.version === version);
  }

  // Return current version
  return ecm.firmwareVersions.find(fw => fw.status === 'current');
}

export function getCalibrationForECM(ecmId: string, calibrationId: string): Calibration | undefined {
  const ecm = getECMById(ecmId);
  if (!ecm) return undefined;

  return ecm.calibrations.find(cal => cal.id === calibrationId);
}

export function getCompatibleControllers(ecmId: string): ControllerCompatibility[] {
  const ecm = getECMById(ecmId);
  return ecm?.compatibleControllers || [];
}

export function checkCompatibility(ecmId: string, controllerId: string): CompatibilityEntry | undefined {
  return COMPATIBILITY_MATRIX.find(
    entry => entry.ecmId === ecmId && entry.controllerId === controllerId
  );
}

export function getAllManufacturers(): string[] {
  return [...new Set(ECM_MODELS.map(ecm => ecm.manufacturer))];
}

export function searchECMs(query: string): ECMModel[] {
  const lowerQuery = query.toLowerCase();
  return ECM_MODELS.filter(ecm =>
    ecm.manufacturer.toLowerCase().includes(lowerQuery) ||
    ecm.model.toLowerCase().includes(lowerQuery) ||
    ecm.variants.some(v => v.toLowerCase().includes(lowerQuery)) ||
    ecm.engineApplications.some(app =>
      app.engineModel.toLowerCase().includes(lowerQuery)
    )
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROGRAMMING EVENT TRACKING
// ═══════════════════════════════════════════════════════════════════════════════

// In-memory store for demo (would be database in production)
const programmingEvents: ProgrammingEvent[] = [];

export function logProgrammingEvent(event: Omit<ProgrammingEvent, 'id'>): ProgrammingEvent {
  const newEvent: ProgrammingEvent = {
    ...event,
    id: `EVT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
  programmingEvents.push(newEvent);
  return newEvent;
}

export function getProgrammingHistory(ecmSerial: string): ProgrammingEvent[] {
  return programmingEvents.filter(evt => evt.ecmSerial === ecmSerial);
}

export function getAllProgrammingEvents(
  filters?: {
    ecmModel?: string;
    eventType?: ProgrammingEvent['eventType'];
    technicianId?: string;
    startDate?: Date;
    endDate?: Date;
  }
): ProgrammingEvent[] {
  let events = [...programmingEvents];

  if (filters) {
    if (filters.ecmModel) {
      events = events.filter(evt => evt.ecmModel === filters.ecmModel);
    }
    if (filters.eventType) {
      events = events.filter(evt => evt.eventType === filters.eventType);
    }
    if (filters.technicianId) {
      events = events.filter(evt => evt.technicianId === filters.technicianId);
    }
    if (filters.startDate) {
      events = events.filter(evt => evt.timestamp >= filters.startDate!);
    }
    if (filters.endDate) {
      events = events.filter(evt => evt.timestamp <= filters.endDate!);
    }
  }

  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function getRepeatedFirmwareMismatches(): {
  ecmModel: string;
  controllerModel: string;
  count: number;
  lastOccurrence: Date;
}[] {
  // Analyze events to find repeated firmware mismatch cases
  const mismatches = programmingEvents.filter(
    evt => evt.eventType === 'firmware_update' && evt.result === 'failure'
  );

  const grouped: Record<string, { count: number; lastOccurrence: Date }> = {};

  mismatches.forEach(evt => {
    const key = `${evt.ecmModel}_${evt.details.controllerModel || 'unknown'}`;
    if (!grouped[key]) {
      grouped[key] = { count: 0, lastOccurrence: evt.timestamp };
    }
    grouped[key].count++;
    if (evt.timestamp > grouped[key].lastOccurrence) {
      grouped[key].lastOccurrence = evt.timestamp;
    }
  });

  return Object.entries(grouped)
    .map(([key, data]) => {
      const [ecmModel, controllerModel] = key.split('_');
      return { ecmModel, controllerModel, ...data };
    })
    .filter(item => item.count > 1)
    .sort((a, b) => b.count - a.count);
}
