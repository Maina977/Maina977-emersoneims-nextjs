/**
 * Generator Oracle - Comprehensive Spare Parts Database
 * OEM part numbers, cross-references, costs, and supplier information
 *
 * OUTSMART COMPETITORS BY BEING THOROUGH
 */

import type { SparePart, RequiredTool, ManualReference, ControllerNavigation, VerificationStep } from '../controllerFaultCodes';

// ==================== ENGINE SPARE PARTS ====================

export const ENGINE_SPARE_PARTS: Record<string, SparePart[]> = {
  // Oil System Parts
  'oil_pressure_sensor': [
    {
      name: 'Oil Pressure Sensor',
      partNumber: 'VDO-360-081-030-014K',
      alternatePartNumbers: ['0-10 BAR VDO', 'Perkins 2848A013', 'CAT 2747-3013'],
      manufacturer: 'VDO/Continental',
      category: 'sensor',
      estimatedCost: { min: 35, max: 85, currency: 'USD' },
      leadTime: '2-5 days',
      criticalSpare: true,
      quantity: 1,
      specifications: '0-10 Bar, 1/8 NPT, M10x1 thread',
      compatibleModels: ['Perkins 400 Series', 'CAT C4.4', 'Cummins QSB', 'Deutz TCD'],
      suppliers: [
        { name: 'Perkins Kenya', location: 'Nairobi', contact: '+254 20 123456' },
        { name: 'CAT Mantrac', location: 'Nairobi Industrial Area', contact: '+254 20 654321' }
      ]
    },
    {
      name: 'Oil Pressure Switch',
      partNumber: 'Murphy-EZT-1/4NPT-20PSI',
      alternatePartNumbers: ['FW Murphy 518APH-3/4-60', 'Cummins 3967251'],
      manufacturer: 'FW Murphy',
      category: 'sensor',
      estimatedCost: { min: 45, max: 120, currency: 'USD' },
      leadTime: '3-7 days',
      criticalSpare: true,
      quantity: 1,
      specifications: 'Adjustable 15-60 PSI, Normally Closed',
      suppliers: [
        { name: 'Generator Parts Africa', location: 'Mombasa', contact: '+254 41 123456' }
      ]
    }
  ],

  'oil_filter': [
    {
      name: 'Oil Filter - Perkins 400 Series',
      partNumber: 'Perkins 2654403',
      alternatePartNumbers: ['Fleetguard LF3345', 'Baldwin B7299', 'Donaldson P550162'],
      manufacturer: 'Perkins',
      category: 'filter',
      estimatedCost: { min: 15, max: 35, currency: 'USD' },
      leadTime: '1-3 days',
      criticalSpare: true,
      quantity: 1,
      specifications: 'Spin-on, 98mm height, M20x1.5 thread',
      compatibleModels: ['403D-15', '404D-22', '404D-22T']
    },
    {
      name: 'Oil Filter - Cummins QSB',
      partNumber: 'Cummins 3937743',
      alternatePartNumbers: ['Fleetguard LF3970', 'Baldwin B7125', 'Donaldson P550520'],
      manufacturer: 'Cummins',
      category: 'filter',
      estimatedCost: { min: 25, max: 55, currency: 'USD' },
      leadTime: '2-4 days',
      criticalSpare: true,
      quantity: 1,
      specifications: 'Full-flow, efficiency 98.7%'
    },
    {
      name: 'Oil Filter - CAT C Series',
      partNumber: 'CAT 1R-0739',
      alternatePartNumbers: ['Fleetguard LF691A', 'Baldwin B7299-MPG'],
      manufacturer: 'Caterpillar',
      category: 'filter',
      estimatedCost: { min: 35, max: 75, currency: 'USD' },
      leadTime: '2-5 days',
      criticalSpare: true,
      quantity: 1,
      specifications: 'Ultra High Efficiency'
    }
  ],

  // Coolant System Parts
  'thermostat': [
    {
      name: 'Thermostat - Perkins',
      partNumber: 'Perkins 2485C041',
      alternatePartNumbers: ['Gates 33008', 'Mahle TX 1 82D'],
      manufacturer: 'Perkins',
      category: 'mechanical',
      estimatedCost: { min: 25, max: 60, currency: 'USD' },
      leadTime: '2-4 days',
      criticalSpare: true,
      quantity: 1,
      specifications: 'Opening temp 82°C (180°F), Full open 96°C'
    },
    {
      name: 'Thermostat - Cummins',
      partNumber: 'Cummins 3928639',
      alternatePartNumbers: ['Gates 33008S', 'Stant 45359'],
      manufacturer: 'Cummins',
      category: 'mechanical',
      estimatedCost: { min: 30, max: 70, currency: 'USD' },
      leadTime: '2-5 days',
      criticalSpare: true,
      quantity: 1,
      specifications: 'Opening temp 82°C, Fully open 95°C'
    }
  ],

  'water_pump': [
    {
      name: 'Water Pump Assembly - Perkins 400',
      partNumber: 'Perkins U5MW0208',
      alternatePartNumbers: ['Graf PA1092'],
      manufacturer: 'Perkins',
      category: 'mechanical',
      estimatedCost: { min: 180, max: 350, currency: 'USD' },
      leadTime: '5-10 days',
      criticalSpare: false,
      quantity: 1,
      specifications: 'Includes gasket, impeller, bearings'
    },
    {
      name: 'Water Pump - CAT C4.4',
      partNumber: 'CAT 352-2139',
      manufacturer: 'Caterpillar',
      category: 'mechanical',
      estimatedCost: { min: 280, max: 450, currency: 'USD' },
      leadTime: '5-14 days',
      criticalSpare: false,
      quantity: 1
    }
  ],

  'coolant_temp_sensor': [
    {
      name: 'Coolant Temperature Sensor - VDO',
      partNumber: 'VDO-323-801-001-009K',
      alternatePartNumbers: ['Bosch 0280130039', 'Perkins 2848A117'],
      manufacturer: 'VDO',
      category: 'sensor',
      estimatedCost: { min: 25, max: 65, currency: 'USD' },
      leadTime: '2-5 days',
      criticalSpare: true,
      quantity: 1,
      specifications: 'NTC type, 1/2 NPT, -40 to 150°C range'
    }
  ],

  'radiator_hose': [
    {
      name: 'Upper Radiator Hose - Universal',
      partNumber: 'Gates 20691',
      alternatePartNumbers: ['Continental 64042', 'Dayco 70652'],
      manufacturer: 'Gates',
      category: 'mechanical',
      estimatedCost: { min: 15, max: 45, currency: 'USD' },
      leadTime: '1-3 days',
      criticalSpare: true,
      quantity: 1,
      specifications: 'Flexible molded, EPDM rubber'
    },
    {
      name: 'Lower Radiator Hose - Universal',
      partNumber: 'Gates 20692',
      alternatePartNumbers: ['Continental 64043'],
      manufacturer: 'Gates',
      category: 'mechanical',
      estimatedCost: { min: 15, max: 45, currency: 'USD' },
      leadTime: '1-3 days',
      criticalSpare: true,
      quantity: 1
    }
  ],

  // Fuel System Parts
  'fuel_filter': [
    {
      name: 'Fuel Filter Primary - Perkins',
      partNumber: 'Perkins 26560145',
      alternatePartNumbers: ['Fleetguard FF5135', 'Baldwin BF7632', 'Donaldson P550588'],
      manufacturer: 'Perkins',
      category: 'filter',
      estimatedCost: { min: 12, max: 30, currency: 'USD' },
      leadTime: '1-3 days',
      criticalSpare: true,
      quantity: 1,
      specifications: 'Primary fuel water separator'
    },
    {
      name: 'Fuel Filter Secondary - Perkins',
      partNumber: 'Perkins 26560143',
      alternatePartNumbers: ['Fleetguard FF5127', 'Baldwin BF7608'],
      manufacturer: 'Perkins',
      category: 'filter',
      estimatedCost: { min: 15, max: 35, currency: 'USD' },
      leadTime: '1-3 days',
      criticalSpare: true,
      quantity: 1,
      specifications: 'Secondary fine filter, 2 micron'
    },
    {
      name: 'Fuel Filter - Cummins',
      partNumber: 'Cummins 3931063',
      alternatePartNumbers: ['Fleetguard FS1212', 'Baldwin BF1212'],
      manufacturer: 'Cummins',
      category: 'filter',
      estimatedCost: { min: 18, max: 42, currency: 'USD' },
      leadTime: '2-4 days',
      criticalSpare: true,
      quantity: 1
    }
  ],

  'fuel_pump': [
    {
      name: 'Fuel Lift Pump - Perkins',
      partNumber: 'Perkins ULPK0040',
      alternatePartNumbers: ['Delphi 9440A165A'],
      manufacturer: 'Perkins',
      category: 'mechanical',
      estimatedCost: { min: 85, max: 180, currency: 'USD' },
      leadTime: '3-7 days',
      criticalSpare: false,
      quantity: 1,
      specifications: 'Diaphragm type, camshaft driven'
    }
  ],

  // Air System Parts
  'air_filter': [
    {
      name: 'Air Filter Primary - Perkins 400',
      partNumber: 'Perkins 26510337',
      alternatePartNumbers: ['Fleetguard AF25551', 'Baldwin PA4979', 'Donaldson P821575'],
      manufacturer: 'Perkins',
      category: 'filter',
      estimatedCost: { min: 25, max: 55, currency: 'USD' },
      leadTime: '1-3 days',
      criticalSpare: true,
      quantity: 1,
      specifications: 'Radial seal, outer element'
    },
    {
      name: 'Air Filter Safety - Perkins 400',
      partNumber: 'Perkins 26510338',
      alternatePartNumbers: ['Fleetguard AF25552', 'Baldwin PA4980'],
      manufacturer: 'Perkins',
      category: 'filter',
      estimatedCost: { min: 18, max: 40, currency: 'USD' },
      leadTime: '1-3 days',
      criticalSpare: true,
      quantity: 1,
      specifications: 'Inner safety element'
    }
  ],

  // Starting System Parts
  'starter_motor': [
    {
      name: 'Starter Motor - Perkins 400',
      partNumber: 'Perkins 2873K621',
      alternatePartNumbers: ['Denso 428000-1000', 'Bosch 0001223016'],
      manufacturer: 'Perkins',
      category: 'electrical',
      estimatedCost: { min: 250, max: 450, currency: 'USD' },
      leadTime: '5-10 days',
      criticalSpare: false,
      quantity: 1,
      specifications: '12V, 2.8kW, 10 tooth pinion'
    },
    {
      name: 'Starter Solenoid',
      partNumber: 'Denso 053400-4400',
      alternatePartNumbers: ['Bosch 0331303002'],
      manufacturer: 'Denso',
      category: 'electrical',
      estimatedCost: { min: 45, max: 95, currency: 'USD' },
      leadTime: '3-5 days',
      criticalSpare: true,
      quantity: 1
    }
  ],

  'battery': [
    {
      name: 'Battery 12V 100Ah',
      partNumber: 'Chloride-EXIDE-N100',
      alternatePartNumbers: ['Varta H3', 'Bosch S5013'],
      manufacturer: 'Chloride Exide',
      category: 'electrical',
      estimatedCost: { min: 120, max: 200, currency: 'USD' },
      leadTime: '1-2 days',
      criticalSpare: true,
      quantity: 1,
      specifications: '12V, 100Ah, 850 CCA',
      suppliers: [
        { name: 'Chloride Kenya', location: 'Nairobi', contact: '+254 20 555555' }
      ]
    }
  ],

  // Belts
  'drive_belt': [
    {
      name: 'Fan Belt - Perkins 400',
      partNumber: 'Perkins 2614B656',
      alternatePartNumbers: ['Gates 11A1475', 'Continental 11A1475'],
      manufacturer: 'Perkins',
      category: 'belt',
      estimatedCost: { min: 15, max: 35, currency: 'USD' },
      leadTime: '1-3 days',
      criticalSpare: true,
      quantity: 1,
      specifications: 'V-belt, 11x1475mm'
    },
    {
      name: 'Serpentine Belt - CAT',
      partNumber: 'CAT 6V-5043',
      alternatePartNumbers: ['Gates K061031', 'Dayco 5061035'],
      manufacturer: 'Caterpillar',
      category: 'belt',
      estimatedCost: { min: 25, max: 55, currency: 'USD' },
      leadTime: '2-4 days',
      criticalSpare: true,
      quantity: 1
    }
  ]
};

// ==================== CONTROLLER SPARE PARTS ====================

export const CONTROLLER_SPARE_PARTS: Record<string, SparePart[]> = {
  'dse_controller': [
    {
      name: 'DSE 7320 MKII Controller',
      partNumber: 'DSE-7320-03',
      manufacturer: 'DeepSea Electronics',
      category: 'controller',
      estimatedCost: { min: 850, max: 1200, currency: 'USD' },
      leadTime: '7-14 days',
      criticalSpare: false,
      quantity: 1,
      specifications: 'AMF controller, 100 event log, USB/Ethernet'
    },
    {
      name: 'DSE Display Ribbon Cable',
      partNumber: 'DSE-016-018',
      manufacturer: 'DeepSea Electronics',
      category: 'electrical',
      estimatedCost: { min: 25, max: 45, currency: 'USD' },
      leadTime: '5-10 days',
      criticalSpare: false,
      quantity: 1
    },
    {
      name: 'DSE Configuration Cable',
      partNumber: 'DSE-810-003',
      manufacturer: 'DeepSea Electronics',
      category: 'electrical',
      estimatedCost: { min: 45, max: 75, currency: 'USD' },
      leadTime: '3-7 days',
      criticalSpare: false,
      quantity: 1,
      specifications: 'USB to Controller interface'
    }
  ],

  'comap_controller': [
    {
      name: 'InteliLite NT AMF25',
      partNumber: 'IL-NT-AMF25',
      manufacturer: 'ComAp',
      category: 'controller',
      estimatedCost: { min: 750, max: 1100, currency: 'USD' },
      leadTime: '7-14 days',
      criticalSpare: false,
      quantity: 1
    }
  ],

  'smartgen_controller': [
    {
      name: 'SmartGen HGM9510',
      partNumber: 'HGM9510N',
      manufacturer: 'SmartGen',
      category: 'controller',
      estimatedCost: { min: 450, max: 650, currency: 'USD' },
      leadTime: '10-21 days',
      criticalSpare: false,
      quantity: 1
    }
  ]
};

// ==================== ELECTRICAL SPARE PARTS ====================

export const ELECTRICAL_SPARE_PARTS: Record<string, SparePart[]> = {
  'avr': [
    {
      name: 'AVR AS440 - Stamford',
      partNumber: 'Stamford-AS440',
      alternatePartNumbers: ['AVR-AS440', 'Leroy Somer R449'],
      manufacturer: 'Cummins/Stamford',
      category: 'electrical',
      estimatedCost: { min: 180, max: 320, currency: 'USD' },
      leadTime: '5-10 days',
      criticalSpare: true,
      quantity: 1,
      specifications: 'Input 170-280V, Output 0-90V DC',
      compatibleModels: ['UCI224', 'UCI274', 'UCM224']
    },
    {
      name: 'AVR SX460 - Stamford',
      partNumber: 'Stamford-SX460',
      manufacturer: 'Cummins/Stamford',
      category: 'electrical',
      estimatedCost: { min: 150, max: 280, currency: 'USD' },
      leadTime: '5-10 days',
      criticalSpare: true,
      quantity: 1,
      specifications: 'Basic AVR, no external adj'
    },
    {
      name: 'AVR R448 - Leroy Somer',
      partNumber: 'Leroy-R448',
      manufacturer: 'Leroy Somer',
      category: 'electrical',
      estimatedCost: { min: 200, max: 380, currency: 'USD' },
      leadTime: '7-14 days',
      criticalSpare: true,
      quantity: 1
    }
  ],

  'circuit_breaker': [
    {
      name: 'MCCB 100A 3P',
      partNumber: 'ABB-A1C-100A',
      alternatePartNumbers: ['Schneider NSX100F', 'Siemens 3VA1'],
      manufacturer: 'ABB',
      category: 'electrical',
      estimatedCost: { min: 150, max: 280, currency: 'USD' },
      leadTime: '3-7 days',
      criticalSpare: false,
      quantity: 1,
      specifications: '100A, 3 pole, 25kA breaking capacity'
    }
  ],

  'contactor': [
    {
      name: 'Contactor 100A 3P',
      partNumber: 'Schneider-LC1D115',
      alternatePartNumbers: ['ABB A110-30', 'Siemens 3RT2046'],
      manufacturer: 'Schneider Electric',
      category: 'electrical',
      estimatedCost: { min: 120, max: 220, currency: 'USD' },
      leadTime: '3-5 days',
      criticalSpare: false,
      quantity: 1,
      specifications: 'AC-3: 55kW at 400V'
    }
  ],

  'fuses': [
    {
      name: 'DC Fuse 200A',
      partNumber: 'Bussmann-FWH-200A',
      manufacturer: 'Eaton/Bussmann',
      category: 'electrical',
      estimatedCost: { min: 35, max: 65, currency: 'USD' },
      leadTime: '2-5 days',
      criticalSpare: true,
      quantity: 2,
      specifications: '200A, 500V DC, fast acting'
    }
  ],

  'current_transformer': [
    {
      name: 'CT 400/5A Class 0.5',
      partNumber: 'Hobut-CT105-400',
      alternatePartNumbers: ['CIRCUTOR TA-series'],
      manufacturer: 'Hobut',
      category: 'sensor',
      estimatedCost: { min: 45, max: 85, currency: 'USD' },
      leadTime: '3-7 days',
      criticalSpare: false,
      quantity: 3,
      specifications: '400/5A, Class 0.5, 5VA burden'
    }
  ]
};

// ==================== REQUIRED TOOLS DATABASE ====================

export const DIAGNOSTIC_TOOLS: Record<string, RequiredTool[]> = {
  'oil_pressure': [
    { name: 'Mechanical Oil Pressure Gauge', specification: '0-100 PSI / 0-7 Bar', category: 'diagnostic', essential: true, estimatedCost: { min: 35, max: 80, currency: 'USD' } },
    { name: 'Digital Multimeter', specification: 'True RMS, min CAT III', category: 'diagnostic', essential: true, alternativeTools: ['Analog Multimeter'], estimatedCost: { min: 50, max: 200, currency: 'USD' } },
    { name: '1/8 NPT Adapter', specification: 'Brass or steel', category: 'special', essential: true },
    { name: 'PTFE Thread Tape', specification: 'Yellow gas grade', category: 'consumable', essential: true },
    { name: 'Socket Set', specification: 'Metric 8-24mm', category: 'hand', essential: true },
    { name: 'Oil Drain Pan', specification: '15L capacity', category: 'hand', essential: true },
    { name: 'Clean Rags', category: 'consumable', essential: true },
    { name: 'Safety Glasses', category: 'safety', essential: true }
  ],

  'coolant_system': [
    { name: 'Cooling System Pressure Tester', specification: '0-25 PSI', category: 'diagnostic', essential: true, estimatedCost: { min: 80, max: 200, currency: 'USD' } },
    { name: 'Infrared Thermometer', specification: '-50 to 550°C', category: 'diagnostic', essential: true, estimatedCost: { min: 30, max: 100, currency: 'USD' } },
    { name: 'Coolant Test Strips', specification: 'pH and glycol test', category: 'diagnostic', essential: false },
    { name: 'Refractometer', specification: 'Coolant concentration', category: 'calibration', essential: false, estimatedCost: { min: 25, max: 75, currency: 'USD' } },
    { name: 'Combustion Leak Tester', specification: 'With test fluid', category: 'diagnostic', essential: false, estimatedCost: { min: 40, max: 90, currency: 'USD' } },
    { name: 'Hose Clamp Pliers', category: 'hand', essential: true },
    { name: 'Drain Pan', specification: '20L capacity', category: 'hand', essential: true },
    { name: 'Funnel', specification: 'Long neck', category: 'hand', essential: true },
    { name: 'Heat Resistant Gloves', category: 'safety', essential: true }
  ],

  'electrical_system': [
    { name: 'Clamp Meter', specification: '0-1000A AC/DC', category: 'diagnostic', essential: true, estimatedCost: { min: 100, max: 350, currency: 'USD' } },
    { name: 'Insulation Tester (Megger)', specification: '500V/1000V', category: 'diagnostic', essential: true, estimatedCost: { min: 200, max: 600, currency: 'USD' } },
    { name: 'Phase Rotation Meter', category: 'diagnostic', essential: true, estimatedCost: { min: 80, max: 200, currency: 'USD' } },
    { name: 'Power Quality Analyzer', specification: 'THD, harmonics', category: 'diagnostic', essential: false, rentalAvailable: true, estimatedCost: { min: 1500, max: 5000, currency: 'USD' } },
    { name: 'Digital Multimeter', specification: 'True RMS CAT IV', category: 'diagnostic', essential: true },
    { name: 'Voltage Test Probes', specification: 'CAT IV rated', category: 'safety', essential: true },
    { name: 'Insulated Tools Set', specification: '1000V rated', category: 'hand', essential: true },
    { name: 'PPE - Arc Flash Kit', specification: 'CAT 2 minimum', category: 'safety', essential: true }
  ],

  'controller_diagnostic': [
    { name: 'Laptop with DSE Config', specification: 'Windows 10+', category: 'diagnostic', essential: true },
    { name: 'USB Configuration Cable', specification: 'DSE-810-003 or equiv', category: 'special', essential: true },
    { name: 'CAN Bus Analyzer', specification: 'J1939 compatible', category: 'diagnostic', essential: false, rentalAvailable: true },
    { name: 'Oscilloscope', specification: '100MHz, 2 channel min', category: 'diagnostic', essential: false, rentalAvailable: true },
    { name: 'Multimeter', specification: 'Auto-ranging', category: 'diagnostic', essential: true },
    { name: 'Terminal Tool Set', specification: 'Molex, AMP, Deutsch', category: 'special', essential: true }
  ]
};

// ==================== MANUAL REFERENCES ====================

export const MANUAL_REFERENCES: Record<string, ManualReference[]> = {
  'perkins_400': [
    {
      type: 'parts',
      title: 'Perkins 400 Series Parts Manual',
      documentNumber: 'TPD1647E',
      manufacturer: 'Perkins',
      section: 'Section 2 - Lubrication System',
      page: '2-15 to 2-28',
      edition: 'Issue 4'
    },
    {
      type: 'service',
      title: 'Perkins 400 Series Workshop Manual',
      documentNumber: 'TPD1562E',
      manufacturer: 'Perkins',
      section: 'Chapter 4 - Lubrication System',
      page: '4-1 to 4-22',
      edition: 'Issue 6'
    },
    {
      type: 'troubleshooting',
      title: 'Perkins EST Troubleshooting Guide',
      documentNumber: 'TPD1705E',
      manufacturer: 'Perkins',
      section: 'Diagnostic Fault Codes',
      page: '25-78'
    }
  ],

  'cummins_qsb': [
    {
      type: 'parts',
      title: 'Cummins QSB Parts Catalog',
      documentNumber: 'Bulletin 4021374',
      manufacturer: 'Cummins',
      section: 'Group 7 - Lubrication',
      figureNumber: '7-1 to 7-8'
    },
    {
      type: 'service',
      title: 'QSB Troubleshooting & Repair Manual',
      documentNumber: 'Bulletin 4021575',
      manufacturer: 'Cummins',
      section: 'Section 7 - Lubrication System',
      page: '7-1 to 7-48'
    },
    {
      type: 'troubleshooting',
      title: 'INSITE Pro Fault Code Manual',
      documentNumber: 'Bulletin 4021680',
      manufacturer: 'Cummins',
      section: 'Engine Fault Codes',
      notes: 'Requires Cummins INSITE software'
    }
  ],

  'cat_c4': [
    {
      type: 'parts',
      title: 'C4.4 ACERT Parts Manual',
      documentNumber: 'SEBP4238',
      manufacturer: 'Caterpillar',
      section: 'Lubrication System',
      figureNumber: '0101-0115'
    },
    {
      type: 'service',
      title: 'C4.4 ACERT Service Manual',
      documentNumber: 'SENR9834',
      manufacturer: 'Caterpillar',
      section: 'Lubrication System - Test & Adjust',
      page: '125-148'
    },
    {
      type: 'troubleshooting',
      title: 'CAT ET Diagnostic Codes',
      documentNumber: 'RENR2427',
      manufacturer: 'Caterpillar',
      section: 'Active Diagnostic Codes'
    }
  ],

  'dse_controller': [
    {
      type: 'operation',
      title: 'DSE 7320 MKII Operator Manual',
      documentNumber: 'DSE-057-034',
      manufacturer: 'DeepSea Electronics',
      section: 'Front Panel Operations',
      downloadUrl: 'https://deepseaelectronics.com/downloads'
    },
    {
      type: 'service',
      title: 'DSE 7320 MKII Installation Instructions',
      documentNumber: 'DSE-057-035',
      manufacturer: 'DeepSea Electronics',
      section: 'Wiring & Configuration'
    },
    {
      type: 'troubleshooting',
      title: 'DSE Fault Codes Guide',
      documentNumber: 'DSE-057-036',
      manufacturer: 'DeepSea Electronics',
      section: 'Alarm Descriptions & Troubleshooting'
    }
  ],

  'comap_controller': [
    {
      type: 'operation',
      title: 'InteliLite NT AMF25 Reference Guide',
      documentNumber: 'IL-NT AMF25-1.0',
      manufacturer: 'ComAp',
      section: 'Operation & Monitoring'
    },
    {
      type: 'service',
      title: 'InteliLite NT Installation Guide',
      documentNumber: 'IGS-NT-1.0',
      manufacturer: 'ComAp',
      section: 'Wiring Diagrams'
    }
  ]
};

// ==================== CONTROLLER NAVIGATION PATHS ====================

export const CONTROLLER_NAVIGATION: Record<string, ControllerNavigation> = {
  'dse_7320_view_alarms': {
    brand: 'DSE',
    model: 'DSE 7320 MKII',
    accessPath: [
      { step: 1, button: 'Press ▼ (Down)', display: 'Main Menu appears', notes: 'From any screen' },
      { step: 2, button: 'Navigate to ALARMS', display: 'ALARMS highlighted' },
      { step: 3, button: 'Press ✓ (Enter)', display: 'Alarm submenu' },
      { step: 4, button: 'Select ACTIVE or HISTORY', display: 'Alarm list displayed' },
      { step: 5, button: 'Press ✓ to view details', display: 'Full alarm information' }
    ],
    menuPath: ['MAIN MENU', 'ALARMS', 'ACTIVE ALARMS'],
    passwordRequired: false,
    alternativeMethod: 'Connect via USB and use DSE Configuration Suite software'
  },

  'dse_7320_reset_alarm': {
    brand: 'DSE',
    model: 'DSE 7320 MKII',
    accessPath: [
      { step: 1, button: 'Ensure fault condition is resolved', display: 'Verify fix before reset' },
      { step: 2, button: 'Set mode to OFF/STOP', display: 'Module stopped' },
      { step: 3, button: 'Press and HOLD RESET (■)', display: 'Alarm icon flashes', holdTime: 3, notes: 'Hold for 3 seconds' },
      { step: 4, button: 'Release when beep sounds', display: 'Alarm cleared if condition resolved' }
    ],
    menuPath: ['MODE: OFF', 'RESET (hold 3 sec)'],
    passwordRequired: false,
    firmwareNotes: 'Process same for firmware 5.0+'
  },

  'dse_7320_clear_maintenance': {
    brand: 'DSE',
    model: 'DSE 7320 MKII',
    accessPath: [
      { step: 1, button: 'Press ▼ to enter menu', display: 'Main Menu' },
      { step: 2, button: 'Navigate to MAINTENANCE', display: 'MAINTENANCE highlighted' },
      { step: 3, button: 'Press ✓ Enter', display: 'Maintenance submenu' },
      { step: 4, button: 'Select RESET COUNTERS', display: 'Counter list' },
      { step: 5, button: 'Select counter to reset', display: 'Confirm prompt' },
      { step: 6, button: 'Enter PIN: 1000', display: 'Counter reset', notes: 'Default PIN is 1000' },
      { step: 7, button: 'Press ✓ to confirm', display: 'RESET COMPLETE' }
    ],
    menuPath: ['MAIN MENU', 'MAINTENANCE', 'RESET COUNTERS'],
    passwordRequired: true,
    defaultPassword: '1000',
    firmwareNotes: 'PIN can be changed in configuration'
  },

  'comap_intelilite_view_alarms': {
    brand: 'ComAp',
    model: 'InteliLite NT AMF25',
    accessPath: [
      { step: 1, button: 'Press FAULT LIST button', display: 'Active faults shown', notes: 'Dedicated button on front panel' },
      { step: 2, button: 'Use ▲▼ to scroll', display: 'Navigate through faults' },
      { step: 3, button: 'Press → for details', display: 'Fault details, timestamp' }
    ],
    menuPath: ['FAULT LIST'],
    passwordRequired: false,
    alternativeMethod: 'Use InteliMonitor software via PC'
  },

  'comap_intelilite_reset_alarm': {
    brand: 'ComAp',
    model: 'InteliLite NT AMF25',
    accessPath: [
      { step: 1, button: 'Resolve underlying fault', display: 'Fix before attempting reset' },
      { step: 2, button: 'Press STOP/RESET button', display: 'Engine stops if running' },
      { step: 3, button: 'Press FAULT RESET button', display: 'Faults clear if condition resolved', holdTime: 2 }
    ],
    menuPath: ['STOP/RESET', 'FAULT RESET'],
    passwordRequired: false
  },

  'smartgen_hgm9500_view_alarms': {
    brand: 'SmartGen',
    model: 'HGM9510',
    accessPath: [
      { step: 1, button: 'Press MENU', display: 'Main menu shown' },
      { step: 2, button: 'Navigate to 3. ALARM', display: 'Alarm menu' },
      { step: 3, button: 'Press ENTER', display: 'Current alarms listed' },
      { step: 4, button: 'Use ▲▼ for history', display: 'Alarm history' }
    ],
    menuPath: ['MENU', 'ALARM', 'CURRENT ALARMS'],
    passwordRequired: false
  },

  'smartgen_hgm9500_reset_alarm': {
    brand: 'SmartGen',
    model: 'HGM9510',
    accessPath: [
      { step: 1, button: 'Turn mode to OFF', display: 'Module stopped' },
      { step: 2, button: 'Press RESET button', display: 'Reset initiated', holdTime: 2 },
      { step: 3, button: 'If password required: 0000', display: 'Default password', notes: 'Some setups require PIN' }
    ],
    menuPath: ['MODE: OFF', 'RESET'],
    passwordRequired: false,
    defaultPassword: '0000'
  },

  'powerwizard_view_alarms': {
    brand: 'CAT PowerWizard',
    model: 'PowerWizard 2.0',
    accessPath: [
      { step: 1, button: 'Press EVENTS button', display: 'Event list shown' },
      { step: 2, button: 'Active tab shows current', display: 'Active alarms/events' },
      { step: 3, button: 'History tab shows past', display: 'Historical events' },
      { step: 4, button: 'Press INFO for details', display: 'Full event description' }
    ],
    menuPath: ['EVENTS', 'ACTIVE / HISTORY'],
    passwordRequired: false,
    alternativeMethod: 'CAT ET (Electronic Technician) software'
  },

  'datakom_d500_view_alarms': {
    brand: 'DATAKOM',
    model: 'D-500',
    accessPath: [
      { step: 1, button: 'Press MENU', display: 'Main menu' },
      { step: 2, button: 'Navigate to ALARMS', display: 'Alarm submenu' },
      { step: 3, button: 'Select ACTIVE ALARMS', display: 'Current alarm list' },
      { step: 4, button: 'Select ALARM HISTORY', display: 'Past alarms with timestamps' }
    ],
    menuPath: ['MENU', 'ALARMS', 'ACTIVE ALARMS'],
    passwordRequired: false
  },

  'datakom_d500_reset_alarm': {
    brand: 'DATAKOM',
    model: 'D-500',
    accessPath: [
      { step: 1, button: 'Set mode to STOP', display: 'Engine/Gen stopped' },
      { step: 2, button: 'Press RESET button', display: 'Alarm reset prompt', holdTime: 3 },
      { step: 3, button: 'If PIN required: 0000', display: 'Default PIN' }
    ],
    menuPath: ['MODE: STOP', 'RESET (hold 3s)'],
    passwordRequired: false,
    defaultPassword: '0000'
  }
};

// ==================== VERIFICATION STEPS ====================

export const VERIFICATION_STEPS: Record<string, VerificationStep[]> = {
  'oil_pressure_repair': [
    {
      step: 1,
      action: 'Verify oil level on dipstick is between MIN and MAX marks',
      expectedResult: 'Oil level visible and correct',
      measurement: { parameter: 'Oil Level', expectedValue: 'Between MIN-MAX', unit: 'marks', tolerance: 'Within operating range' },
      waitTime: 300,
      tools: ['Dipstick', 'Clean rag'],
      failureAction: 'Add oil if low. If overfilled, drain excess to prevent damage',
      passIndicator: 'Oil on dipstick at correct level after 5 min rest'
    },
    {
      step: 2,
      action: 'Start engine and immediately observe oil pressure gauge',
      expectedResult: 'Pressure rises within 10 seconds of starting',
      measurement: { parameter: 'Oil Pressure', expectedValue: '25-65', unit: 'PSI', tolerance: '±5 PSI' },
      waitTime: 10,
      tools: ['Controller display', 'Mechanical gauge if installed'],
      failureAction: 'STOP ENGINE IMMEDIATELY if no pressure within 10 seconds. Recheck oil level and sensor',
      passIndicator: 'Oil pressure light goes out, gauge shows normal pressure'
    },
    {
      step: 3,
      action: 'Allow engine to reach operating temperature (80-90°C)',
      expectedResult: 'Oil pressure stabilizes within normal range',
      measurement: { parameter: 'Oil Pressure', expectedValue: '35-55', unit: 'PSI', tolerance: '±10 PSI at idle' },
      waitTime: 600,
      failureAction: 'If pressure drops below 20 PSI when hot, stop engine. Check for dilution or bearing wear',
      passIndicator: 'Pressure stable at idle and when revved'
    },
    {
      step: 4,
      action: 'Check controller alarm status - no oil pressure alarms active',
      expectedResult: 'No active oil-related alarms',
      tools: ['Controller display'],
      failureAction: 'If alarm persists despite normal pressure, check sensor wiring and setpoints',
      passIndicator: 'Alarm history shows alarm cleared, no active warnings'
    },
    {
      step: 5,
      action: 'Inspect underneath engine for any new oil leaks',
      expectedResult: 'No visible oil drips or weeping',
      waitTime: 300,
      tools: ['Flashlight', 'Clean cardboard underneath'],
      failureAction: 'If leak found, identify source and repair before releasing generator to service',
      passIndicator: 'Clean cardboard, no fresh oil spots after 5 minutes running'
    },
    {
      step: 6,
      action: 'Run generator under load for 15 minutes and recheck',
      expectedResult: 'Stable operation, no alarms, normal pressure',
      measurement: { parameter: 'Oil Pressure', expectedValue: '40-60', unit: 'PSI', tolerance: 'Under load' },
      waitTime: 900,
      failureAction: 'Any anomaly under load indicates incomplete repair or secondary issue',
      passIndicator: 'Generator runs smoothly under load, all parameters normal'
    }
  ],

  'coolant_system_repair': [
    {
      step: 1,
      action: 'Verify coolant level in radiator and expansion tank (COLD)',
      expectedResult: 'Radiator full to neck, expansion tank at COLD mark',
      tools: ['Rag for cap removal'],
      failureAction: 'Top up with correct coolant mixture if low',
      passIndicator: 'Coolant visible at radiator neck, expansion tank at correct level'
    },
    {
      step: 2,
      action: 'Start engine and observe temperature rise pattern',
      expectedResult: 'Gradual temperature rise, no sudden spikes',
      measurement: { parameter: 'Coolant Temp', expectedValue: '0-95', unit: '°C', tolerance: 'Steady rise' },
      waitTime: 600,
      failureAction: 'If temp rises rapidly or erratically, stop and check for airlock or thermostat issue',
      passIndicator: 'Temperature rises smoothly to operating range in 10-15 min'
    },
    {
      step: 3,
      action: 'Verify thermostat opens - both radiator hoses should be hot',
      expectedResult: 'Top and bottom hoses both hot to touch when at operating temp',
      waitTime: 60,
      tools: ['Infrared thermometer'],
      failureAction: 'If bottom hose stays cold, thermostat is stuck closed - replace',
      passIndicator: 'Both hoses within 10°C of each other'
    },
    {
      step: 4,
      action: 'Verify cooling fan operation at temperature threshold',
      expectedResult: 'Fan starts when temp reaches fan-on setpoint (~95°C)',
      measurement: { parameter: 'Fan On Temp', expectedValue: '90-98', unit: '°C' },
      failureAction: 'If fan doesn\'t start, check relay, fuse, and fan motor',
      passIndicator: 'Fan runs and temperature stabilizes or drops slightly'
    },
    {
      step: 5,
      action: 'Check for coolant leaks around hoses, radiator, and water pump',
      expectedResult: 'No visible leaks or dampness',
      tools: ['Flashlight', 'Inspection mirror'],
      failureAction: 'Tighten connections or replace leaking components',
      passIndicator: 'All connections dry, no drips'
    },
    {
      step: 6,
      action: 'Monitor temperature under load for 15+ minutes',
      expectedResult: 'Temperature stable at 80-95°C under load',
      measurement: { parameter: 'Coolant Temp', expectedValue: '80-95', unit: '°C', tolerance: '±5°C' },
      waitTime: 900,
      failureAction: 'If overheating under load, check radiator restriction, fan belt, or airflow',
      passIndicator: 'Temp stable, no alarm, no overheating'
    },
    {
      step: 7,
      action: 'Recheck coolant level after engine cools (next day if possible)',
      expectedResult: 'Level remains stable, no significant drop',
      waitTime: 28800,
      failureAction: 'If level dropped, there is still a leak - pressure test system',
      passIndicator: 'Level unchanged, system holds'
    }
  ],

  'controller_alarm_reset': [
    {
      step: 1,
      action: 'Verify the underlying fault has been fully resolved',
      expectedResult: 'Root cause addressed - e.g., oil level correct, leak fixed',
      failureAction: 'Do not proceed with reset until cause is fixed - alarm will return immediately',
      passIndicator: 'Physical inspection confirms repair complete'
    },
    {
      step: 2,
      action: 'Navigate to controller alarm/event screen and note the alarm code',
      expectedResult: 'Alarm code visible and documented for records',
      tools: ['Controller display', 'Notepad for records'],
      failureAction: 'If multiple alarms, address each one - they may be related',
      passIndicator: 'Alarm code recorded, understand what triggered it'
    },
    {
      step: 3,
      action: 'Set controller mode to OFF or STOP',
      expectedResult: 'Engine stopped, controller in idle state',
      failureAction: 'Wait for engine to fully stop before reset attempt',
      passIndicator: 'Controller shows STOPPED or OFF status'
    },
    {
      step: 4,
      action: 'Press and hold RESET button for required duration (typically 3 sec)',
      expectedResult: 'Audible beep or visual indication of reset accepted',
      waitTime: 3,
      failureAction: 'If reset rejected, alarm condition still present or lockout requires PIN',
      passIndicator: 'Beep sounds, alarm icon disappears'
    },
    {
      step: 5,
      action: 'Check active alarm list - should be empty',
      expectedResult: 'No active alarms displayed',
      failureAction: 'If alarm persists, condition is still present or wrong reset procedure',
      passIndicator: 'Active alarm count shows 0'
    },
    {
      step: 6,
      action: 'Switch to AUTO mode and verify ready-to-start status',
      expectedResult: 'Controller shows READY or AUTO - STANDBY',
      failureAction: 'If not ready, check for other alarms or pre-start conditions not met',
      passIndicator: 'Ready to start indicator on'
    },
    {
      step: 7,
      action: 'Initiate test start and verify successful operation',
      expectedResult: 'Engine starts and runs normally, no alarms',
      waitTime: 60,
      failureAction: 'If alarm returns on start, repair was incomplete - re-diagnose',
      passIndicator: 'Generator running smoothly, all parameters normal'
    }
  ],

  'electrical_repair': [
    {
      step: 1,
      action: 'Verify all connections are tight and properly torqued',
      expectedResult: 'All terminals secure, no loose connections',
      tools: ['Torque wrench', 'Insulated tools'],
      failureAction: 'Re-torque any loose connections to specification',
      passIndicator: 'All connections pass tug test, properly torqued'
    },
    {
      step: 2,
      action: 'Measure insulation resistance of repaired circuits',
      expectedResult: 'Insulation resistance > 1 MΩ (or per spec)',
      measurement: { parameter: 'Insulation Resistance', expectedValue: '>1', unit: 'MΩ', tolerance: 'Minimum value' },
      tools: ['Insulation tester (Megger)'],
      failureAction: 'If < 1 MΩ, there is still insulation damage or moisture present',
      passIndicator: 'Reading stable above 1 MΩ'
    },
    {
      step: 3,
      action: 'Verify correct phase rotation (if 3-phase)',
      expectedResult: 'Phase rotation matches load requirement (usually ABC/RYB)',
      tools: ['Phase rotation meter'],
      failureAction: 'Swap any two phases at source or load to correct rotation',
      passIndicator: 'Phase rotation meter shows correct sequence'
    },
    {
      step: 4,
      action: 'Start generator and measure output voltage on all phases',
      expectedResult: 'Voltage within ±5% of nominal (e.g., 380-420V for 400V system)',
      measurement: { parameter: 'Output Voltage', expectedValue: '380-420', unit: 'V', tolerance: '±5% of nominal' },
      tools: ['True RMS multimeter', 'Clamp meter'],
      failureAction: 'If out of spec, check AVR adjustment and excitation circuit',
      passIndicator: 'All three phases balanced within 2-3%'
    },
    {
      step: 5,
      action: 'Apply load and monitor for any abnormalities',
      expectedResult: 'Stable voltage and frequency under load',
      measurement: { parameter: 'Frequency', expectedValue: '50', unit: 'Hz', tolerance: '±0.5 Hz' },
      waitTime: 300,
      failureAction: 'Voltage drop > 10% or frequency instability indicates further issue',
      passIndicator: 'Voltage stable, frequency within 49.5-50.5 Hz under load'
    }
  ]
};

// ==================== INTERNAL SPARE PARTS PAGES ====================
// All parts link to our internal spare parts catalog for SEO

export const SPARE_PARTS_PAGES = {
  // Engine Parts
  oilSystem: {
    name: 'Oil System Parts',
    url: '/spare-parts/engine/oil-system',
    description: 'Oil filters, pressure sensors, pumps'
  },
  coolingSystem: {
    name: 'Cooling System Parts',
    url: '/spare-parts/engine/cooling',
    description: 'Thermostats, water pumps, radiator hoses, coolant'
  },
  fuelSystem: {
    name: 'Fuel System Parts',
    url: '/spare-parts/engine/fuel',
    description: 'Fuel filters, pumps, injectors, solenoids'
  },
  airIntake: {
    name: 'Air System Parts',
    url: '/spare-parts/engine/air-intake',
    description: 'Air filters, turbo parts, intake manifolds'
  },
  startingSystem: {
    name: 'Starting System Parts',
    url: '/spare-parts/engine/starting',
    description: 'Starter motors, solenoids, batteries, glow plugs'
  },
  belts: {
    name: 'Belts & Pulleys',
    url: '/spare-parts/engine/belts',
    description: 'Drive belts, serpentine belts, tensioners'
  },

  // Electrical Parts
  avr: {
    name: 'AVR & Voltage Regulators',
    url: '/spare-parts/electrical/avr',
    description: 'Automatic voltage regulators, excitation parts'
  },
  controllers: {
    name: 'Generator Controllers',
    url: '/spare-parts/electrical/controllers',
    description: 'DSE, ComAp, SmartGen, DATAKOM controllers'
  },
  breakers: {
    name: 'Circuit Breakers & Contactors',
    url: '/spare-parts/electrical/breakers',
    description: 'MCCBs, contactors, relays, fuses'
  },
  sensors: {
    name: 'Sensors & Transducers',
    url: '/spare-parts/electrical/sensors',
    description: 'Pressure, temperature, speed, current sensors'
  },

  // By Brand
  perkins: {
    name: 'Perkins Parts',
    url: '/spare-parts/brands/perkins',
    description: 'Genuine and aftermarket Perkins parts'
  },
  cummins: {
    name: 'Cummins Parts',
    url: '/spare-parts/brands/cummins',
    description: 'Genuine and aftermarket Cummins parts'
  },
  caterpillar: {
    name: 'Caterpillar Parts',
    url: '/spare-parts/brands/caterpillar',
    description: 'CAT engine and generator parts'
  },
  stamford: {
    name: 'Stamford/Newage Parts',
    url: '/spare-parts/brands/stamford',
    description: 'Alternator parts, AVRs, brushes'
  },

  // General
  all: {
    name: 'All Spare Parts',
    url: '/spare-parts',
    description: 'Complete spare parts catalog'
  },
  contact: {
    name: 'Request Parts Quote',
    url: '/spare-parts/quote',
    description: 'Get a quote for parts you need'
  }
};

// Internal links for parts ordering
export const PARTS_ORDER_INFO = {
  mainPage: '/spare-parts',
  quotePage: '/spare-parts/quote',
  contactPage: '/contact',
  phone: '+254 XXX XXX XXX',  // Your company phone
  whatsapp: '+254 XXX XXX XXX',  // Your WhatsApp
  email: 'parts@emersoneims.co.ke'  // Your parts email
};

// ==================== HELPER FUNCTIONS ====================

export function getSparePartsForFault(category: string, subcategory: string): SparePart[] {
  const parts: SparePart[] = [];

  // Map fault categories to relevant spare parts
  const mappings: Record<string, string[]> = {
    'Oil Pressure': ['oil_pressure_sensor', 'oil_filter'],
    'Coolant': ['thermostat', 'water_pump', 'coolant_temp_sensor', 'radiator_hose'],
    'Starting': ['starter_motor', 'battery'],
    'Fuel': ['fuel_filter', 'fuel_pump'],
    'Speed': ['drive_belt'],
    'Temperature': ['thermostat', 'coolant_temp_sensor'],
    'Air Intake': ['air_filter'],
    'Charging': ['battery']
  };

  const partKeys = mappings[subcategory] || [];
  partKeys.forEach(key => {
    if (ENGINE_SPARE_PARTS[key]) {
      parts.push(...ENGINE_SPARE_PARTS[key]);
    }
  });

  return parts;
}

export function getToolsForRepair(repairType: string): RequiredTool[] {
  return DIAGNOSTIC_TOOLS[repairType] || DIAGNOSTIC_TOOLS['oil_pressure'];
}

export function getManualReferences(engineType: string): ManualReference[] {
  return MANUAL_REFERENCES[engineType] || [];
}

export function getControllerNavigation(action: string): ControllerNavigation | undefined {
  return CONTROLLER_NAVIGATION[action];
}

export function getVerificationSteps(repairType: string): VerificationStep[] {
  return VERIFICATION_STEPS[repairType] || [];
}

export function getPartsPageForCategory(category: string): typeof SPARE_PARTS_PAGES.all {
  const lowerCategory = category.toLowerCase();

  // Map categories to internal spare parts pages
  if (lowerCategory.includes('oil') || lowerCategory.includes('lubrication')) {
    return SPARE_PARTS_PAGES.oilSystem;
  }
  if (lowerCategory.includes('coolant') || lowerCategory.includes('temperature') || lowerCategory.includes('radiator')) {
    return SPARE_PARTS_PAGES.coolingSystem;
  }
  if (lowerCategory.includes('fuel') || lowerCategory.includes('injection')) {
    return SPARE_PARTS_PAGES.fuelSystem;
  }
  if (lowerCategory.includes('air') || lowerCategory.includes('turbo') || lowerCategory.includes('filter')) {
    return SPARE_PARTS_PAGES.airIntake;
  }
  if (lowerCategory.includes('start') || lowerCategory.includes('battery') || lowerCategory.includes('crank')) {
    return SPARE_PARTS_PAGES.startingSystem;
  }
  if (lowerCategory.includes('belt') || lowerCategory.includes('drive')) {
    return SPARE_PARTS_PAGES.belts;
  }
  if (lowerCategory.includes('avr') || lowerCategory.includes('voltage') || lowerCategory.includes('excit')) {
    return SPARE_PARTS_PAGES.avr;
  }
  if (lowerCategory.includes('controller') || lowerCategory.includes('dse') || lowerCategory.includes('comap')) {
    return SPARE_PARTS_PAGES.controllers;
  }
  if (lowerCategory.includes('breaker') || lowerCategory.includes('contactor') || lowerCategory.includes('relay')) {
    return SPARE_PARTS_PAGES.breakers;
  }
  if (lowerCategory.includes('sensor') || lowerCategory.includes('transducer')) {
    return SPARE_PARTS_PAGES.sensors;
  }
  if (lowerCategory.includes('perkins')) {
    return SPARE_PARTS_PAGES.perkins;
  }
  if (lowerCategory.includes('cummins')) {
    return SPARE_PARTS_PAGES.cummins;
  }
  if (lowerCategory.includes('cat') || lowerCategory.includes('caterpillar')) {
    return SPARE_PARTS_PAGES.caterpillar;
  }
  if (lowerCategory.includes('stamford') || lowerCategory.includes('newage')) {
    return SPARE_PARTS_PAGES.stamford;
  }

  // Default to all parts page
  return SPARE_PARTS_PAGES.all;
}
