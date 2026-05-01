/**
 * Generator Oracle - Parameter Thresholds
 * Normal operating ranges for generator controller parameters
 */

export interface ParameterRange {
  min: number;
  max: number;
  warningLow: number;
  warningHigh: number;
  criticalLow: number;
  criticalHigh: number;
  unit: string;
  unitAlt?: string;  // Alternative unit (e.g., bar for PSI)
  conversionFactor?: number;  // To convert to alt unit
}

export interface ControllerThresholds {
  brand: string;
  model: string;
  parameters: {
    voltageL1N: ParameterRange;
    voltageL2N: ParameterRange;
    voltageL3N: ParameterRange;
    voltageLL: ParameterRange;
    frequency: ParameterRange;
    rpm: ParameterRange;
    oilPressure: ParameterRange;
    coolantTemp: ParameterRange;
    batteryVoltage: ParameterRange;
    loadPercent: ParameterRange;
    fuelLevel: ParameterRange;
    currentL1: ParameterRange;
    currentL2: ParameterRange;
    currentL3: ParameterRange;
    powerFactor: ParameterRange;
  };
}

// Default thresholds for 50Hz systems (common in Africa, Europe, Asia)
const DEFAULT_50HZ_THRESHOLDS: ControllerThresholds['parameters'] = {
  voltageL1N: {
    min: 200, max: 253, warningLow: 207, warningHigh: 247,
    criticalLow: 195, criticalHigh: 265, unit: 'V'
  },
  voltageL2N: {
    min: 200, max: 253, warningLow: 207, warningHigh: 247,
    criticalLow: 195, criticalHigh: 265, unit: 'V'
  },
  voltageL3N: {
    min: 200, max: 253, warningLow: 207, warningHigh: 247,
    criticalLow: 195, criticalHigh: 265, unit: 'V'
  },
  voltageLL: {
    min: 380, max: 420, warningLow: 360, warningHigh: 430,
    criticalLow: 340, criticalHigh: 460, unit: 'V'
  },
  frequency: {
    min: 49, max: 51, warningLow: 48.5, warningHigh: 51.5,
    criticalLow: 47, criticalHigh: 53, unit: 'Hz'
  },
  rpm: {
    min: 1480, max: 1520, warningLow: 1450, warningHigh: 1550,
    criticalLow: 1400, criticalHigh: 1650, unit: 'RPM'
  },
  oilPressure: {
    min: 30, max: 80, warningLow: 25, warningHigh: 85,
    criticalLow: 15, criticalHigh: 100, unit: 'PSI',
    unitAlt: 'bar', conversionFactor: 0.0689476
  },
  coolantTemp: {
    min: 70, max: 95, warningLow: 60, warningHigh: 100,
    criticalLow: 40, criticalHigh: 110, unit: 'C',
    unitAlt: 'F', conversionFactor: 1.8
  },
  batteryVoltage: {
    min: 12.4, max: 14.4, warningLow: 11.5, warningHigh: 15,
    criticalLow: 10.5, criticalHigh: 16, unit: 'V'
  },
  loadPercent: {
    min: 0, max: 100, warningLow: 0, warningHigh: 90,
    criticalLow: 0, criticalHigh: 110, unit: '%'
  },
  fuelLevel: {
    min: 0, max: 100, warningLow: 15, warningHigh: 100,
    criticalLow: 5, criticalHigh: 100, unit: '%'
  },
  currentL1: {
    min: 0, max: 100, warningLow: 0, warningHigh: 95,
    criticalLow: 0, criticalHigh: 110, unit: '%'
  },
  currentL2: {
    min: 0, max: 100, warningLow: 0, warningHigh: 95,
    criticalLow: 0, criticalHigh: 110, unit: '%'
  },
  currentL3: {
    min: 0, max: 100, warningLow: 0, warningHigh: 95,
    criticalLow: 0, criticalHigh: 110, unit: '%'
  },
  powerFactor: {
    min: 0.7, max: 1, warningLow: 0.75, warningHigh: 1,
    criticalLow: 0.6, criticalHigh: 1, unit: ''
  },
};

// Default thresholds for 60Hz systems (Americas, some Asian countries)
const DEFAULT_60HZ_THRESHOLDS: ControllerThresholds['parameters'] = {
  ...DEFAULT_50HZ_THRESHOLDS,
  voltageL1N: {
    min: 110, max: 125, warningLow: 108, warningHigh: 127,
    criticalLow: 100, criticalHigh: 135, unit: 'V'
  },
  voltageL2N: {
    min: 110, max: 125, warningLow: 108, warningHigh: 127,
    criticalLow: 100, criticalHigh: 135, unit: 'V'
  },
  voltageL3N: {
    min: 110, max: 125, warningLow: 108, warningHigh: 127,
    criticalLow: 100, criticalHigh: 135, unit: 'V'
  },
  voltageLL: {
    min: 440, max: 480, warningLow: 420, warningHigh: 500,
    criticalLow: 400, criticalHigh: 530, unit: 'V'
  },
  frequency: {
    min: 59, max: 61, warningLow: 58.5, warningHigh: 61.5,
    criticalLow: 57, criticalHigh: 63, unit: 'Hz'
  },
  rpm: {
    min: 1780, max: 1820, warningLow: 1750, warningHigh: 1850,
    criticalLow: 1700, criticalHigh: 1950, unit: 'RPM'
  },
};

// Controller-specific thresholds
export const CONTROLLER_THRESHOLDS: ControllerThresholds[] = [
  // DeepSea Electronics Controllers
  {
    brand: 'DeepSea Electronics',
    model: 'DSE 4510',
    parameters: DEFAULT_50HZ_THRESHOLDS
  },
  {
    brand: 'DeepSea Electronics',
    model: 'DSE 4610',
    parameters: DEFAULT_50HZ_THRESHOLDS
  },
  {
    brand: 'DeepSea Electronics',
    model: 'DSE 4410',
    parameters: DEFAULT_50HZ_THRESHOLDS
  },
  {
    brand: 'DeepSea Electronics',
    model: 'DSE 5110',
    parameters: DEFAULT_50HZ_THRESHOLDS
  },
  {
    brand: 'DeepSea Electronics',
    model: 'DSE 5210',
    parameters: DEFAULT_50HZ_THRESHOLDS
  },
  {
    brand: 'DeepSea Electronics',
    model: 'DSE 7320',
    parameters: {
      ...DEFAULT_50HZ_THRESHOLDS,
      // 7320 has tighter voltage control
      voltageL1N: {
        min: 218, max: 242, warningLow: 215, warningHigh: 245,
        criticalLow: 200, criticalHigh: 260, unit: 'V'
      },
    }
  },
  {
    brand: 'DeepSea Electronics',
    model: 'DSE 7510',
    parameters: DEFAULT_50HZ_THRESHOLDS
  },
  {
    brand: 'DeepSea Electronics',
    model: 'DSE 7560',
    parameters: DEFAULT_50HZ_THRESHOLDS
  },
  {
    brand: 'DeepSea Electronics',
    model: 'DSE 8610',
    parameters: DEFAULT_50HZ_THRESHOLDS
  },
  {
    brand: 'DeepSea Electronics',
    model: 'DSE 8660',
    parameters: {
      ...DEFAULT_50HZ_THRESHOLDS,
      // 8660 multi-set controller - tighter sync requirements
      frequency: {
        min: 49.5, max: 50.5, warningLow: 49, warningHigh: 51,
        criticalLow: 48, criticalHigh: 52, unit: 'Hz'
      },
    }
  },

  // ComAp Controllers
  {
    brand: 'ComAp',
    model: 'InteliLite IL-NT AMF25',
    parameters: DEFAULT_50HZ_THRESHOLDS
  },
  {
    brand: 'ComAp',
    model: 'InteliGen NTC BaseBox',
    parameters: DEFAULT_50HZ_THRESHOLDS
  },
  {
    brand: 'ComAp',
    model: 'InteliSys NTC',
    parameters: {
      ...DEFAULT_50HZ_THRESHOLDS,
      // InteliSys has extended ranges for industrial applications
      oilPressure: {
        min: 25, max: 90, warningLow: 20, warningHigh: 95,
        criticalLow: 12, criticalHigh: 110, unit: 'PSI',
        unitAlt: 'bar', conversionFactor: 0.0689476
      },
    }
  },
  {
    brand: 'ComAp',
    model: 'InteliDrive',
    parameters: DEFAULT_50HZ_THRESHOLDS
  },

  // Woodward Controllers
  {
    brand: 'Woodward',
    model: 'EasyGen 3000',
    parameters: DEFAULT_50HZ_THRESHOLDS
  },
  {
    brand: 'Woodward',
    model: 'EasyGen 3500',
    parameters: {
      ...DEFAULT_50HZ_THRESHOLDS,
      // EasyGen 3500 has enhanced load sharing capabilities
      loadPercent: {
        min: 0, max: 100, warningLow: 0, warningHigh: 85,
        criticalLow: 0, criticalHigh: 105, unit: '%'
      },
    }
  },
  {
    brand: 'Woodward',
    model: 'LS-5 Load Share',
    parameters: {
      ...DEFAULT_50HZ_THRESHOLDS,
      // LS-5 is specifically for load sharing
      frequency: {
        min: 49.8, max: 50.2, warningLow: 49.5, warningHigh: 50.5,
        criticalLow: 49, criticalHigh: 51, unit: 'Hz'
      },
    }
  },
  {
    brand: 'Woodward',
    model: 'GCP-30',
    parameters: DEFAULT_50HZ_THRESHOLDS
  },

  // SmartGen Controllers
  {
    brand: 'SmartGen',
    model: 'HGM6100',
    parameters: DEFAULT_50HZ_THRESHOLDS
  },
  {
    brand: 'SmartGen',
    model: 'HGM9500',
    parameters: {
      ...DEFAULT_50HZ_THRESHOLDS,
      // HGM9500 is an advanced multi-unit controller
      frequency: {
        min: 49.5, max: 50.5, warningLow: 49, warningHigh: 51,
        criticalLow: 48, criticalHigh: 52, unit: 'Hz'
      },
    }
  },
  {
    brand: 'SmartGen',
    model: 'HGM420',
    parameters: DEFAULT_50HZ_THRESHOLDS
  },
  {
    brand: 'SmartGen',
    model: 'HGM5310',
    parameters: DEFAULT_50HZ_THRESHOLDS
  },

  // CAT PowerWizard Controllers
  {
    brand: 'CAT PowerWizard',
    model: 'PowerWizard 1.0',
    parameters: DEFAULT_60HZ_THRESHOLDS  // CAT typically uses 60Hz
  },
  {
    brand: 'CAT PowerWizard',
    model: 'PowerWizard 2.0',
    parameters: DEFAULT_60HZ_THRESHOLDS
  },
  {
    brand: 'CAT PowerWizard',
    model: 'PowerWizard 4.1',
    parameters: {
      ...DEFAULT_60HZ_THRESHOLDS,
      // PowerWizard 4.1 has extended diagnostic capabilities
      oilPressure: {
        min: 35, max: 85, warningLow: 30, warningHigh: 90,
        criticalLow: 20, criticalHigh: 100, unit: 'PSI',
        unitAlt: 'bar', conversionFactor: 0.0689476
      },
    }
  },
];

// Live parameters interface for user input
export interface LiveParameters {
  voltageL1N: number | null;
  voltageL2N: number | null;
  voltageL3N: number | null;
  frequency: number | null;
  rpm: number | null;
  oilPressure: number | null;
  coolantTemp: number | null;
  batteryVoltage: number | null;
  loadPercent: number | null;
  fuelLevel: number | null;
}

export const DEFAULT_LIVE_PARAMETERS: LiveParameters = {
  voltageL1N: null,
  voltageL2N: null,
  voltageL3N: null,
  frequency: null,
  rpm: null,
  oilPressure: null,
  coolantTemp: null,
  batteryVoltage: null,
  loadPercent: null,
  fuelLevel: null,
};

// Get thresholds for a specific controller
export function getControllerThresholds(brand: string, model: string): ControllerThresholds | undefined {
  return CONTROLLER_THRESHOLDS.find(
    t => t.brand.toLowerCase() === brand.toLowerCase() &&
         t.model.toLowerCase() === model.toLowerCase()
  );
}

// Get default thresholds based on frequency
export function getDefaultThresholds(frequency: 50 | 60 = 50): ControllerThresholds['parameters'] {
  return frequency === 60 ? DEFAULT_60HZ_THRESHOLDS : DEFAULT_50HZ_THRESHOLDS;
}

// Check parameter status
export type ParameterStatus = 'normal' | 'warning' | 'critical' | 'unknown';

export function checkParameterStatus(
  value: number | null,
  range: ParameterRange
): ParameterStatus {
  if (value === null) return 'unknown';

  if (value <= range.criticalLow || value >= range.criticalHigh) return 'critical';
  if (value <= range.warningLow || value >= range.warningHigh) return 'warning';
  if (value >= range.min && value <= range.max) return 'normal';

  return 'warning';  // Between warning and normal
}

// Analyze all parameters and return status report
export interface ParameterAnalysis {
  parameter: string;
  value: number | null;
  status: ParameterStatus;
  message: string;
  unit: string;
}

export function analyzeParameters(
  params: LiveParameters,
  thresholds: ControllerThresholds['parameters']
): ParameterAnalysis[] {
  const analyses: ParameterAnalysis[] = [];

  const paramMapping: { key: keyof LiveParameters; label: string; thresholdKey: keyof typeof thresholds }[] = [
    { key: 'voltageL1N', label: 'Voltage L1-N', thresholdKey: 'voltageL1N' },
    { key: 'voltageL2N', label: 'Voltage L2-N', thresholdKey: 'voltageL2N' },
    { key: 'voltageL3N', label: 'Voltage L3-N', thresholdKey: 'voltageL3N' },
    { key: 'frequency', label: 'Frequency', thresholdKey: 'frequency' },
    { key: 'rpm', label: 'Engine RPM', thresholdKey: 'rpm' },
    { key: 'oilPressure', label: 'Oil Pressure', thresholdKey: 'oilPressure' },
    { key: 'coolantTemp', label: 'Coolant Temperature', thresholdKey: 'coolantTemp' },
    { key: 'batteryVoltage', label: 'Battery Voltage', thresholdKey: 'batteryVoltage' },
    { key: 'loadPercent', label: 'Load Percentage', thresholdKey: 'loadPercent' },
    { key: 'fuelLevel', label: 'Fuel Level', thresholdKey: 'fuelLevel' },
  ];

  paramMapping.forEach(({ key, label, thresholdKey }) => {
    const value = params[key];
    const range = thresholds[thresholdKey];
    const status = checkParameterStatus(value, range);

    let message = '';
    if (value === null) {
      message = 'No data entered';
    } else if (status === 'critical') {
      message = value < range.criticalLow
        ? `Critically low (min: ${range.criticalLow}${range.unit})`
        : `Critically high (max: ${range.criticalHigh}${range.unit})`;
    } else if (status === 'warning') {
      message = value < range.warningLow
        ? `Below normal (expected: ${range.min}-${range.max}${range.unit})`
        : `Above normal (expected: ${range.min}-${range.max}${range.unit})`;
    } else {
      message = `Normal (${range.min}-${range.max}${range.unit})`;
    }

    analyses.push({
      parameter: label,
      value,
      status,
      message,
      unit: range.unit,
    });
  });

  return analyses;
}

// Convert between units
export function convertUnit(
  value: number,
  fromUnit: string,
  toUnit: string
): number {
  const conversions: Record<string, Record<string, (v: number) => number>> = {
    PSI: {
      bar: (v) => v * 0.0689476,
    },
    bar: {
      PSI: (v) => v / 0.0689476,
    },
    C: {
      F: (v) => (v * 9/5) + 32,
    },
    F: {
      C: (v) => (v - 32) * 5/9,
    },
  };

  if (conversions[fromUnit]?.[toUnit]) {
    return conversions[fromUnit][toUnit](value);
  }
  return value;  // No conversion available
}
