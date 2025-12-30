export const allControllerErrorCodes = [
  { 
    code: 'E001', 
    model: 'DSE7320', 
    service: 'Engine Protection',
    category: 'Engine',
    issue: 'Low Oil Pressure',
    symptoms: 'Oil pressure below minimum threshold',
    causes: ['Low oil level', 'Oil pump failure', 'Sensor malfunction'],
    solution: 'Check oil level and pressure sensor. Inspect oil pump.'
  },
  { 
    code: 'E002', 
    model: 'DSE7320', 
    service: 'Cooling System',
    category: 'Engine',
    issue: 'High Coolant Temperature',
    symptoms: 'Coolant temperature exceeds limit',
    causes: ['Low coolant level', 'Thermostat stuck', 'Radiator blockage'],
    solution: 'Check coolant level. Inspect radiator and thermostat.'
  },
  { 
    code: 'E003', 
    model: 'DSE7320', 
    service: 'Engine Control',
    category: 'Engine',
    issue: 'Engine Overspeed',
    symptoms: 'Engine RPM above maximum',
    causes: ['Governor failure', 'Load rejection', 'Control system fault'],
    solution: 'Check governor settings. Inspect speed control system.'
  },
  { 
    code: 'E004', 
    model: 'DSE7320', 
    service: 'Generator Protection',
    category: 'Generator',
    issue: 'Generator Overcurrent',
    symptoms: 'Current exceeds rated capacity',
    causes: ['Overload condition', 'Short circuit', 'Phase imbalance'],
    solution: 'Reduce load. Check for short circuits and phase balance.'
  },
  { 
    code: 'E005', 
    model: 'DSE7320', 
    service: 'Mains Supply',
    category: 'Mains',
    issue: 'Mains Failure',
    symptoms: 'Utility power lost',
    causes: ['Power outage', 'Breaker trip', 'Supply line fault'],
    solution: 'Check mains supply. Inspect incoming breaker and wiring.'
  },
];
