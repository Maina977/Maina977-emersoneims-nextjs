// lib/diagnostics/mock-data.ts
export interface GeneratorTelemetry {
  id: string;
  model: string;
  location: string;
  status: 'online' | 'maintenance' | 'offline' | 'critical';
  uptime: number; // hours
  lastMaintenance: string;
  fuelLevel: number; // percentage
  batteryHealth: number; // percentage
  oilPressure: number; // PSI
  coolantTemp: number; // Celsius
  voltage: number; // Volts
  current: number; // Amps
  powerOutput: number; // kW
  efficiency: number; // percentage
  alerts: Alert[];
  predictiveFailures: PredictiveFailure[];
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface PredictiveFailure {
  component: string;
  probability: number; // 0-100
  estimatedDays: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
}

export const mockGeneratorData: GeneratorTelemetry[] = [
  {
    id: 'GEN-001',
    model: 'Cummins X15',
    location: 'Nairobi Data Center',
    status: 'online',
    uptime: 1247,
    lastMaintenance: '2025-11-15',
    fuelLevel: 85,
    batteryHealth: 92,
    oilPressure: 45,
    coolantTemp: 78,
    voltage: 415,
    current: 125,
    powerOutput: 75,
    efficiency: 94,
    alerts: [
      {
        id: 'ALT-001',
        type: 'warning',
        message: 'Fuel filter requires cleaning',
        timestamp: '2025-12-20T10:30:00Z',
        resolved: false,
      },
    ],
    predictiveFailures: [
      {
        component: 'Battery',
        probability: 87,
        estimatedDays: 90,
        severity: 'high',
        recommendation: 'Schedule battery replacement within 3 months',
      },
      {
        component: 'Fuel Pump',
        probability: 23,
        estimatedDays: 180,
        severity: 'medium',
        recommendation: 'Monitor fuel pressure weekly',
      },
    ],
  },
  {
    id: 'GEN-002',
    model: 'CAT C32',
    location: 'Kisumu Hospital',
    status: 'maintenance',
    uptime: 892,
    lastMaintenance: '2025-12-01',
    fuelLevel: 45,
    batteryHealth: 78,
    oilPressure: 42,
    coolantTemp: 82,
    voltage: 400,
    current: 98,
    powerOutput: 55,
    efficiency: 89,
    alerts: [
      {
        id: 'ALT-002',
        type: 'error',
        message: 'Coolant temperature high',
        timestamp: '2025-12-25T14:15:00Z',
        resolved: false,
      },
    ],
    predictiveFailures: [
      {
        component: 'Cooling System',
        probability: 95,
        estimatedDays: 7,
        severity: 'critical',
        recommendation: 'Immediate radiator flush required',
      },
    ],
  },
  // Add more mock data as needed
];

export const getMockTelemetry = (id?: string): GeneratorTelemetry | GeneratorTelemetry[] => {
  if (id) {
    return mockGeneratorData.find(gen => gen.id === id) || mockGeneratorData[0];
  }
  return mockGeneratorData;
};