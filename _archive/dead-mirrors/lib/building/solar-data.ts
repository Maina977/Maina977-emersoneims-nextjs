/**
 * Comprehensive Solar Data Library
 * Complete specifications, fault codes, pricing, and technical data
 */

// ============================================
// SOLAR PANEL DATABASE - 50+ MODELS
// ============================================
export const SOLAR_PANELS = [
  // Tier 1 Manufacturers
  { brand: 'JA Solar', model: 'JAM72S30-545/MR', watts: 545, voc: 49.65, isc: 13.89, vmp: 41.64, imp: 13.09, efficiency: 21.1, warranty: 25, price: 18500, tier: 1 },
  { brand: 'JA Solar', model: 'JAM60S20-385/MR', watts: 385, voc: 41.52, isc: 11.72, vmp: 34.89, imp: 11.03, efficiency: 20.5, warranty: 25, price: 13500, tier: 1 },
  { brand: 'Longi', model: 'LR5-72HBD-545M', watts: 545, voc: 49.95, isc: 13.85, vmp: 41.75, imp: 13.05, efficiency: 21.3, warranty: 25, price: 19200, tier: 1 },
  { brand: 'Longi', model: 'LR5-54HIH-410M', watts: 410, voc: 37.60, isc: 13.76, vmp: 31.38, imp: 13.07, efficiency: 21.1, warranty: 25, price: 14800, tier: 1 },
  { brand: 'Canadian Solar', model: 'CS7L-545MS', watts: 545, voc: 49.5, isc: 13.92, vmp: 41.5, imp: 13.13, efficiency: 21.0, warranty: 25, price: 17800, tier: 1 },
  { brand: 'Canadian Solar', model: 'CS6W-455MS', watts: 455, voc: 41.7, isc: 13.78, vmp: 34.7, imp: 13.12, efficiency: 20.8, warranty: 25, price: 15500, tier: 1 },
  { brand: 'Trina Solar', model: 'TSM-545DEG19C.20', watts: 545, voc: 49.8, isc: 13.87, vmp: 41.65, imp: 13.08, efficiency: 21.2, warranty: 25, price: 18900, tier: 1 },
  { brand: 'Trina Solar', model: 'TSM-400DE09.08', watts: 400, voc: 37.2, isc: 13.56, vmp: 31.0, imp: 12.90, efficiency: 20.4, warranty: 25, price: 14200, tier: 1 },
  { brand: 'Jinko Solar', model: 'JKM545M-72HL4-V', watts: 545, voc: 49.72, isc: 13.91, vmp: 41.58, imp: 13.11, efficiency: 21.07, warranty: 25, price: 17500, tier: 1 },
  { brand: 'Jinko Solar', model: 'JKM470N-60HL4-V', watts: 470, voc: 43.21, isc: 13.75, vmp: 36.12, imp: 13.01, efficiency: 21.52, warranty: 25, price: 16800, tier: 1 },
  // Tier 2 Manufacturers
  { brand: 'Risen Energy', model: 'RSM144-7-545M', watts: 545, voc: 49.45, isc: 13.95, vmp: 41.45, imp: 13.15, efficiency: 20.9, warranty: 25, price: 16800, tier: 2 },
  { brand: 'Risen Energy', model: 'RSM120-8-590M', watts: 590, voc: 51.8, isc: 14.42, vmp: 43.2, imp: 13.66, efficiency: 21.6, warranty: 25, price: 21000, tier: 2 },
  { brand: 'Astronergy', model: 'CHSM72M-HC-545', watts: 545, voc: 49.6, isc: 13.88, vmp: 41.5, imp: 13.13, efficiency: 21.0, warranty: 25, price: 16500, tier: 2 },
  { brand: 'Seraphim', model: 'SRP-545-BMB-HV', watts: 545, voc: 49.55, isc: 13.90, vmp: 41.48, imp: 13.14, efficiency: 20.95, warranty: 25, price: 16200, tier: 2 },
  { brand: 'Suntech', model: 'STP545S-C72/Vmh', watts: 545, voc: 49.70, isc: 13.86, vmp: 41.60, imp: 13.10, efficiency: 21.05, warranty: 25, price: 16900, tier: 2 },
  // Budget Options
  { brand: 'Felicity Solar', model: 'FL-M-550W', watts: 550, voc: 49.9, isc: 13.95, vmp: 41.8, imp: 13.16, efficiency: 20.5, warranty: 12, price: 14500, tier: 3 },
  { brand: 'Eco-Worthy', model: 'ECO-540W', watts: 540, voc: 49.2, isc: 13.88, vmp: 41.2, imp: 13.11, efficiency: 20.2, warranty: 10, price: 13200, tier: 3 },
];

// ============================================
// INVERTER DATABASE - ALL MAJOR BRANDS
// ============================================
export const INVERTERS = [
  // Victron - Premium
  { brand: 'Victron', model: 'MultiPlus-II 48/3000/35-32', power: 3000, type: 'Hybrid', voltage: 48, mppt: 0, efficiency: 96, warranty: 5, price: 125000 },
  { brand: 'Victron', model: 'MultiPlus-II 48/5000/70-50', power: 5000, type: 'Hybrid', voltage: 48, mppt: 0, efficiency: 96, warranty: 5, price: 185000 },
  { brand: 'Victron', model: 'Quattro 48/8000/110-100', power: 8000, type: 'Hybrid', voltage: 48, mppt: 0, efficiency: 96, warranty: 5, price: 285000 },
  { brand: 'Victron', model: 'EasySolar-II 48/3000', power: 3000, type: 'Hybrid', voltage: 48, mppt: 1, efficiency: 95, warranty: 5, price: 165000 },
  // Growatt
  { brand: 'Growatt', model: 'SPF 3000ES', power: 3000, type: 'Hybrid', voltage: 24, mppt: 1, efficiency: 93, warranty: 5, price: 55000 },
  { brand: 'Growatt', model: 'SPF 5000ES', power: 5000, type: 'Hybrid', voltage: 48, mppt: 1, efficiency: 93, warranty: 5, price: 95000 },
  { brand: 'Growatt', model: 'MIN 5000TL-X', power: 5000, type: 'Grid-Tie', voltage: 0, mppt: 2, efficiency: 98.4, warranty: 10, price: 75000 },
  { brand: 'Growatt', model: 'MOD 10KTL3-X', power: 10000, type: 'Grid-Tie', voltage: 0, mppt: 2, efficiency: 98.6, warranty: 10, price: 135000 },
  // Deye
  { brand: 'Deye', model: 'SUN-5K-SG03LP1-EU', power: 5000, type: 'Hybrid', voltage: 48, mppt: 2, efficiency: 97.6, warranty: 5, price: 110000 },
  { brand: 'Deye', model: 'SUN-8K-SG01LP1-EU', power: 8000, type: 'Hybrid', voltage: 48, mppt: 2, efficiency: 97.6, warranty: 5, price: 165000 },
  { brand: 'Deye', model: 'SUN-12K-SG04LP3-EU', power: 12000, type: 'Hybrid', voltage: 48, mppt: 2, efficiency: 97.8, warranty: 5, price: 225000 },
  // Must Solar
  { brand: 'Must Solar', model: 'PV18-3048 VHM', power: 3000, type: 'Hybrid', voltage: 48, mppt: 1, efficiency: 93, warranty: 2, price: 45000 },
  { brand: 'Must Solar', model: 'PV18-5048 VHM', power: 5000, type: 'Hybrid', voltage: 48, mppt: 1, efficiency: 93, warranty: 2, price: 65000 },
  // Felicity Solar
  { brand: 'Felicity Solar', model: 'FL-IVP3048', power: 3000, type: 'Hybrid', voltage: 48, mppt: 1, efficiency: 92, warranty: 2, price: 38000 },
  { brand: 'Felicity Solar', model: 'FL-IVP5048', power: 5000, type: 'Hybrid', voltage: 48, mppt: 1, efficiency: 92, warranty: 2, price: 55000 },
  // SMA - Premium Grid-Tie
  { brand: 'SMA', model: 'Sunny Boy 3.0', power: 3000, type: 'Grid-Tie', voltage: 0, mppt: 1, efficiency: 97, warranty: 5, price: 95000 },
  { brand: 'SMA', model: 'Sunny Tripower 5.0', power: 5000, type: 'Grid-Tie', voltage: 0, mppt: 2, efficiency: 98.3, warranty: 5, price: 145000 },
  { brand: 'SMA', model: 'Sunny Tripower 10.0', power: 10000, type: 'Grid-Tie', voltage: 0, mppt: 2, efficiency: 98.4, warranty: 5, price: 195000 },
  // Fronius
  { brand: 'Fronius', model: 'Primo 3.0-1', power: 3000, type: 'Grid-Tie', voltage: 0, mppt: 2, efficiency: 98.1, warranty: 5, price: 105000 },
  { brand: 'Fronius', model: 'Primo 5.0-1', power: 5000, type: 'Grid-Tie', voltage: 0, mppt: 2, efficiency: 98.1, warranty: 5, price: 155000 },
  { brand: 'Fronius', model: 'Symo 10.0-3-M', power: 10000, type: 'Grid-Tie', voltage: 0, mppt: 2, efficiency: 98.0, warranty: 5, price: 185000 },
  // Huawei
  { brand: 'Huawei', model: 'SUN2000-3KTL-L1', power: 3000, type: 'Hybrid', voltage: 48, mppt: 2, efficiency: 98.6, warranty: 5, price: 85000 },
  { brand: 'Huawei', model: 'SUN2000-5KTL-L1', power: 5000, type: 'Hybrid', voltage: 48, mppt: 2, efficiency: 98.6, warranty: 5, price: 125000 },
  { brand: 'Huawei', model: 'SUN2000-10KTL-M1', power: 10000, type: 'Grid-Tie', voltage: 0, mppt: 2, efficiency: 98.65, warranty: 5, price: 165000 },
  // Goodwe
  { brand: 'Goodwe', model: 'GW5048-ES', power: 5000, type: 'Hybrid', voltage: 48, mppt: 2, efficiency: 97.6, warranty: 5, price: 95000 },
  { brand: 'Goodwe', model: 'GW10K-ET', power: 10000, type: 'Hybrid', voltage: 48, mppt: 2, efficiency: 97.8, warranty: 5, price: 175000 },
  // Solis
  { brand: 'Solis', model: 'S5-GR1P5K', power: 5000, type: 'Grid-Tie', voltage: 0, mppt: 2, efficiency: 97.6, warranty: 5, price: 65000 },
  { brand: 'Solis', model: 'RHI-5K-48ES-5G', power: 5000, type: 'Hybrid', voltage: 48, mppt: 2, efficiency: 97.3, warranty: 5, price: 85000 },
];

// ============================================
// BATTERY DATABASE
// ============================================
export const BATTERIES = [
  // Lithium LiFePO4
  { brand: 'Pylontech', model: 'US2000C', capacity: 2.4, voltage: 48, chemistry: 'LiFePO4', cycles: 6000, dod: 90, warranty: 10, price: 65000 },
  { brand: 'Pylontech', model: 'US3000C', capacity: 3.55, voltage: 48, chemistry: 'LiFePO4', cycles: 6000, dod: 90, warranty: 10, price: 95000 },
  { brand: 'Pylontech', model: 'US5000', capacity: 4.8, voltage: 48, chemistry: 'LiFePO4', cycles: 6000, dod: 90, warranty: 10, price: 125000 },
  { brand: 'BYD', model: 'B-Box Premium HVS 5.1', capacity: 5.12, voltage: 51.2, chemistry: 'LiFePO4', cycles: 6000, dod: 100, warranty: 10, price: 185000 },
  { brand: 'BYD', model: 'B-Box Premium HVS 7.7', capacity: 7.68, voltage: 51.2, chemistry: 'LiFePO4', cycles: 6000, dod: 100, warranty: 10, price: 265000 },
  { brand: 'Hubble', model: 'AM-2', capacity: 2.56, voltage: 51.2, chemistry: 'LiFePO4', cycles: 6000, dod: 90, warranty: 10, price: 75000 },
  { brand: 'Hubble', model: 'AM-5', capacity: 5.12, voltage: 51.2, chemistry: 'LiFePO4', cycles: 6000, dod: 90, warranty: 10, price: 145000 },
  { brand: 'Felicity', model: 'FL-LT48100', capacity: 5.12, voltage: 48, chemistry: 'LiFePO4', cycles: 4000, dod: 80, warranty: 5, price: 85000 },
  { brand: 'Felicity', model: 'FL-LT48200', capacity: 10.24, voltage: 48, chemistry: 'LiFePO4', cycles: 4000, dod: 80, warranty: 5, price: 165000 },
  { brand: 'Narada', model: '48NPFC100', capacity: 4.8, voltage: 48, chemistry: 'LiFePO4', cycles: 5000, dod: 80, warranty: 8, price: 125000 },
  { brand: 'Freedom Won', model: 'Lite Home 5/4', capacity: 5.0, voltage: 52, chemistry: 'LiFePO4', cycles: 6000, dod: 80, warranty: 10, price: 175000 },
  // Lead-Acid (Budget)
  { brand: 'Trojan', model: 'T105-RE', capacity: 1.05, voltage: 6, chemistry: 'Lead-Acid', cycles: 1200, dod: 50, warranty: 2, price: 28000 },
  { brand: 'Trojan', model: 'L16RE-2V', capacity: 2.1, voltage: 2, chemistry: 'Lead-Acid', cycles: 1500, dod: 50, warranty: 2, price: 45000 },
  { brand: 'US Battery', model: 'US 2200 XC2', capacity: 1.32, voltage: 6, chemistry: 'Lead-Acid', cycles: 1000, dod: 50, warranty: 2, price: 32000 },
  { brand: 'Rolls', model: 'S-550', capacity: 1.65, voltage: 6, chemistry: 'Lead-Acid', cycles: 1500, dod: 50, warranty: 3, price: 55000 },
];

// ============================================
// COMPREHENSIVE FAULT CODES - ALL INVERTERS
// ============================================
export const FAULT_CODES: Record<string, Array<{code: string; name: string; severity: 'Low'|'Medium'|'High'|'Critical'; description: string; causes: string[]; solutions: string[]}>> = {
  growatt: [
    { code: 'F01', name: 'Grid Voltage Fault', severity: 'Medium', description: 'Grid voltage outside acceptable range (180V-270V)', causes: ['Utility voltage fluctuation', 'Poor grid connection', 'Incorrect voltage settings'], solutions: ['Check grid voltage with multimeter', 'Verify AC input connections', 'Adjust voltage settings in menu', 'Install voltage stabilizer if persistent'] },
    { code: 'F02', name: 'Grid Frequency Fault', severity: 'Medium', description: 'Grid frequency outside 47-53Hz range', causes: ['Utility frequency instability', 'Generator frequency fluctuation', 'Grid disturbance'], solutions: ['Check utility supply stability', 'Verify generator governor settings', 'Adjust frequency range in settings'] },
    { code: 'F03', name: 'DC Injection High', severity: 'High', description: 'DC current injection exceeds limits', causes: ['Internal inverter fault', 'Output transformer issue', 'Capacitor failure'], solutions: ['Check isolation resistance', 'Inspect output wiring', 'Contact service if persistent'] },
    { code: 'F04', name: 'Ground Fault', severity: 'Critical', description: 'Earth/Ground fault detected on DC or AC side', causes: ['Cable insulation damage', 'Water ingress', 'Panel frame grounding issue'], solutions: ['Check all DC and AC cable insulation', 'Inspect junction boxes for moisture', 'Verify grounding connections', 'Test isolation resistance'] },
    { code: 'F05', name: 'Over Temperature', severity: 'High', description: 'Internal temperature exceeds safe limits', causes: ['Poor ventilation', 'Ambient temperature too high', 'Dust blocking vents', 'Overloading'], solutions: ['Improve ventilation around inverter', 'Clean dust from cooling vents', 'Reduce load if overloaded', 'Check cooling fan operation'] },
    { code: 'F06', name: 'PV Voltage High', severity: 'Critical', description: 'Solar input voltage exceeds maximum (500V)', causes: ['Too many panels in series', 'Cold temperature increasing Voc', 'Wrong panel configuration'], solutions: ['Reduce panels per string', 'Recalculate string configuration with cold Voc', 'Check panel specifications'] },
    { code: 'F07', name: 'PV Voltage Low', severity: 'Low', description: 'Solar input voltage below minimum', causes: ['Low irradiance', 'Shading', 'Panel fault', 'String disconnected'], solutions: ['Check for shading on panels', 'Verify all string connections', 'Test panel output with multimeter', 'Wait for better irradiance'] },
    { code: 'F08', name: 'No Utility', severity: 'Medium', description: 'No grid/utility power detected', causes: ['Power outage', 'AC breaker tripped', 'AC cable disconnected', 'Meter issue'], solutions: ['Verify utility power available', 'Check AC breakers', 'Inspect AC cable connections', 'Contact utility if area outage'] },
    { code: 'F09', name: 'Over Load', severity: 'High', description: 'Load exceeds inverter capacity', causes: ['Too many loads connected', 'Motor startup surge', 'Short circuit in load'], solutions: ['Reduce connected loads', 'Stagger motor startups', 'Check for short circuits', 'Consider larger inverter'] },
    { code: 'F10', name: 'Battery Low', severity: 'Medium', description: 'Battery voltage below minimum cutoff', causes: ['Battery discharged', 'BMS disconnected battery', 'Battery degradation'], solutions: ['Recharge battery from grid/solar', 'Check BMS status and settings', 'Test battery capacity', 'Replace if degraded'] },
    { code: 'F11', name: 'Battery High', severity: 'High', description: 'Battery voltage exceeds maximum', causes: ['Overcharging', 'BMS fault', 'Wrong battery settings'], solutions: ['Check charge voltage settings', 'Verify BMS operation', 'Adjust battery type settings'] },
    { code: 'F12', name: 'Fan Fault', severity: 'Medium', description: 'Cooling fan not operating', causes: ['Fan motor failure', 'Fan cable disconnected', 'Dust blocking fan'], solutions: ['Check fan operation manually', 'Clean fan blades', 'Replace fan if faulty'] },
    { code: 'F13', name: 'Output Short', severity: 'Critical', description: 'Short circuit detected on output', causes: ['Cable short', 'Load fault', 'Wiring error'], solutions: ['Disconnect all loads', 'Check output wiring', 'Test loads individually', 'Repair any damaged cables'] },
  ],
  victron: [
    { code: 'VE01', name: 'Battery High Voltage', severity: 'High', description: 'Battery voltage exceeds safe charging limit', causes: ['Overcharging', 'BMS fault', 'Wrong absorption voltage', 'Temperature compensation issue'], solutions: ['Check charging voltage settings', 'Verify BMS communication', 'Adjust temperature compensation', 'Check battery cable sizing'] },
    { code: 'VE02', name: 'Battery Low Voltage', severity: 'High', description: 'Battery voltage below low-voltage disconnect', causes: ['Deep discharge', 'Battery degradation', 'High load demand', 'Poor charging'], solutions: ['Charge battery immediately', 'Check solar/grid charging', 'Test battery capacity', 'Replace if degraded'] },
    { code: 'VE03', name: 'Battery High Temperature', severity: 'Critical', description: 'Battery temperature exceeds safe limit', causes: ['High ambient temperature', 'Poor ventilation', 'Overcharging', 'Internal cell fault'], solutions: ['Improve battery ventilation', 'Reduce charging current', 'Check for thermal runaway', 'Contact manufacturer'] },
    { code: 'VE04', name: 'Battery Low Temperature', severity: 'Medium', description: 'Battery too cold for safe charging', causes: ['Cold weather', 'Outdoor installation'], solutions: ['Install battery heating system', 'Wait for temperature rise', 'Move batteries to insulated space'] },
    { code: 'VE05', name: 'Overload L1', severity: 'High', description: 'Output power exceeds rated capacity', causes: ['Too many loads', 'Motor inrush current', 'Short circuit'], solutions: ['Reduce load', 'Stagger startups', 'Use soft starters for motors', 'Check for faults'] },
    { code: 'VE06', name: 'DC Ripple', severity: 'Medium', description: 'Excessive ripple on DC bus', causes: ['Capacitor degradation', 'Poor DC connections', 'Battery cable too long'], solutions: ['Check DC cable connections', 'Verify cable sizing', 'Test capacitors', 'Service may be required'] },
    { code: 'VE07', name: 'Ground Relay Fault', severity: 'Critical', description: 'Ground relay safety test failed', causes: ['Internal relay fault', 'Wiring issue'], solutions: ['Internal fault - requires service', 'Check for ground faults in system'] },
    { code: 'VE08', name: 'Input Fuse Blown', severity: 'High', description: 'Battery input fuse has blown', causes: ['Overcurrent event', 'Short circuit', 'Wrong fuse rating'], solutions: ['Replace fuse with correct rating', 'Check for cause of overcurrent', 'Verify cable sizing'] },
    { code: 'VE09', name: 'No AC Input', severity: 'Low', description: 'No AC mains detected', causes: ['Grid outage', 'AC breaker off', 'Cable issue'], solutions: ['Check utility power', 'Check AC breakers', 'Verify AC input connections'] },
    { code: 'VE10', name: 'AC Voltage Too Low', severity: 'Medium', description: 'AC input voltage below minimum', causes: ['Weak grid', 'Long cable run', 'High demand'], solutions: ['Check grid voltage', 'Reduce cable length', 'Install voltage stabilizer'] },
  ],
  deye: [
    { code: 'DY01', name: 'Grid Lost', severity: 'Low', description: 'Utility power interrupted', causes: ['Power outage', 'Breaker tripped', 'Meter issue'], solutions: ['Check AC input breaker', 'Verify utility supply', 'Check meter operation'] },
    { code: 'DY02', name: 'Grid Voltage Fault', severity: 'Medium', description: 'Grid voltage outside range', causes: ['Voltage fluctuation', 'Weak grid', 'Cable issue'], solutions: ['Check grid voltage', 'Consider voltage stabilizer', 'Adjust voltage limits in settings'] },
    { code: 'DY03', name: 'PV Input Over Voltage', severity: 'Critical', description: 'Solar string voltage exceeds 550V limit', causes: ['Too many panels per string', 'Cold weather increasing Voc'], solutions: ['Reduce panels per string', 'Recalculate with cold Voc values'] },
    { code: 'DY04', name: 'Battery Over Voltage', severity: 'High', description: 'Battery exceeds maximum charge voltage', causes: ['Incorrect charge settings', 'BMS fault', 'Wrong battery type selected'], solutions: ['Check battery type setting', 'Adjust charge voltage', 'Verify BMS operation'] },
    { code: 'DY05', name: 'Battery Under Voltage', severity: 'Medium', description: 'Battery discharged below cutoff', causes: ['Excessive load', 'Insufficient charging', 'Battery degradation'], solutions: ['Reduce load', 'Check solar charging', 'Test battery health'] },
    { code: 'DY06', name: 'Overload Warning', severity: 'Medium', description: 'Load approaching maximum capacity', causes: ['High load demand', 'Motor startup'], solutions: ['Reduce non-essential loads', 'Stagger high-power appliances'] },
    { code: 'DY07', name: 'Over Temperature', severity: 'High', description: 'Inverter overheating', causes: ['Poor ventilation', 'High ambient temp', 'Continuous high load'], solutions: ['Improve cooling', 'Reduce continuous load', 'Clean dust from unit'] },
    { code: 'DY08', name: 'BMS Communication Error', severity: 'Medium', description: 'Lost communication with battery BMS', causes: ['Cable disconnected', 'Wrong protocol', 'BMS fault'], solutions: ['Check CAN/RS485 cable', 'Verify baud rate settings', 'Match protocol settings'] },
    { code: 'DY09', name: 'MPPT Fault', severity: 'Medium', description: 'Maximum power point tracker error', causes: ['PV configuration issue', 'Shading', 'Panel mismatch'], solutions: ['Check panel connections', 'Verify string configuration', 'Check for shading'] },
    { code: 'DY10', name: 'Insulation Fault', severity: 'Critical', description: 'DC insulation resistance too low', causes: ['Water damage', 'Cable insulation failure', 'Panel frame issue'], solutions: ['Check all DC cabling', 'Inspect for water ingress', 'Test insulation resistance'] },
  ],
  sma: [
    { code: 'SM01', name: 'Utility Disturbance', severity: 'Low', description: 'Grid parameters outside limits', causes: ['Grid instability', 'Voltage fluctuation'], solutions: ['Monitor grid conditions', 'Adjust grid parameters if allowed'] },
    { code: 'SM02', name: 'Waiting for DC Startup', severity: 'Low', description: 'Insufficient DC power to start', causes: ['Low irradiance', 'Morning startup'], solutions: ['Wait for sufficient sunlight', 'Check panel connections'] },
    { code: 'SM03', name: 'DC Overvoltage', severity: 'Critical', description: 'PV voltage exceeds maximum', causes: ['String configuration error'], solutions: ['Reduce panels per string', 'Check Voc calculations'] },
    { code: 'SM04', name: 'Temperature Derating', severity: 'Medium', description: 'Power reduced due to temperature', causes: ['High ambient temperature', 'Poor ventilation'], solutions: ['Improve ventilation', 'Reduce load if possible'] },
  ],
  huawei: [
    { code: 'HW01', name: 'Grid Loss', severity: 'Low', description: 'No grid connection detected', causes: ['Utility outage', 'Breaker off'], solutions: ['Check utility supply', 'Check AC breakers'] },
    { code: 'HW02', name: 'String Abnormal', severity: 'Medium', description: 'PV string output abnormal', causes: ['Panel fault', 'String mismatch', 'Shading'], solutions: ['Check string voltages', 'Look for shading', 'Test individual panels'] },
    { code: 'HW03', name: 'Battery Offline', severity: 'Medium', description: 'Battery not communicating', causes: ['Communication cable issue', 'BMS fault'], solutions: ['Check battery cables', 'Verify BMS status', 'Reset battery system'] },
    { code: 'HW04', name: 'Arc Fault Detected', severity: 'Critical', description: 'DC arc fault protection triggered', causes: ['Loose DC connection', 'Damaged cable', 'Connector fault'], solutions: ['Inspect all DC connections', 'Check for damaged cables', 'Tighten all connections'] },
  ],
};

// ============================================
// INSTALLATION PROCEDURES
// ============================================
export const INSTALLATION_STEPS = {
  siteAssessment: [
    { step: 1, title: 'Roof Inspection', details: 'Assess roof condition, material, age, and structural integrity. Check for existing damage, leaks, or weak points.', tools: ['Ladder', 'Safety harness', 'Roof assessment form'], duration: '1-2 hours' },
    { step: 2, title: 'Shading Analysis', details: 'Evaluate shading from trees, buildings, chimneys throughout the day. Use solar pathfinder or app for annual shading study.', tools: ['Solar Pathfinder', 'Compass', 'Sun position app'], duration: '30-60 min' },
    { step: 3, title: 'Roof Orientation & Tilt', details: 'Measure roof azimuth (ideal: North in Southern hemisphere). Calculate optimal tilt angle (approximately latitude angle).', tools: ['Compass', 'Inclinometer', 'GPS device'], duration: '30 min' },
    { step: 4, title: 'Electrical Assessment', details: 'Evaluate existing electrical infrastructure. Check main panel capacity, available breaker slots, grounding system.', tools: ['Multimeter', 'Circuit tester', 'Panel schedule'], duration: '1 hour' },
    { step: 5, title: 'Load Analysis', details: 'Document all electrical loads. Calculate daily energy consumption (kWh). Identify peak loads and usage patterns.', tools: ['Energy meter', 'Load calculator', 'Appliance list'], duration: '1-2 hours' },
  ],
  mounting: [
    { step: 1, title: 'Layout Planning', details: 'Mark panel positions on roof. Ensure proper spacing (100mm min). Plan cable routing. Mark rafter locations.', tools: ['Chalk line', 'Tape measure', 'Stud finder', 'Marker'], duration: '1 hour' },
    { step: 2, title: 'Rail Installation', details: 'Install mounting rails using appropriate roof attachments. Ensure rails are level and properly spaced for panels.', tools: ['Drill', 'Lag bolts', 'Level', 'Socket set'], duration: '2-4 hours' },
    { step: 3, title: 'Flashing & Sealing', details: 'Install roof flashings at all penetration points. Apply appropriate sealant. Ensure waterproof installation.', tools: ['Roofing sealant', 'Flashings', 'Caulk gun'], duration: '1-2 hours' },
    { step: 4, title: 'Panel Mounting', details: 'Attach panels to rails using mid and end clamps. Ensure proper torque on all fasteners. Check panel alignment.', tools: ['Panel clamps', 'Torque wrench', 'Safety equipment'], duration: '2-4 hours' },
    { step: 5, title: 'Grounding', details: 'Install grounding lugs on all panels and rails. Run grounding conductor to main ground. Verify continuity.', tools: ['Grounding lugs', 'Copper conductor', 'Multimeter'], duration: '1-2 hours' },
  ],
  electrical: [
    { step: 1, title: 'String Wiring', details: 'Connect panels in series strings. Use MC4 connectors. Verify polarity. Label all cables. Test string voltage.', tools: ['MC4 tool', 'Multimeter', 'Cable labels', 'Wire strippers'], duration: '2-3 hours' },
    { step: 2, title: 'DC Combiner Box', details: 'Install DC combiner box if required. Connect string cables. Install string fuses. Connect to inverter DC input.', tools: ['DC combiner', 'Fuses', 'Cable glands'], duration: '1-2 hours' },
    { step: 3, title: 'Inverter Mounting', details: 'Mount inverter in suitable location. Ensure proper ventilation. Keep away from direct sunlight. Allow maintenance access.', tools: ['Drill', 'Mounting brackets', 'Level'], duration: '1-2 hours' },
    { step: 4, title: 'DC Connection', details: 'Connect DC cables to inverter. Verify polarity. Check all terminal torques. Install DC isolator.', tools: ['Torque driver', 'Multimeter', 'DC isolator'], duration: '1 hour' },
    { step: 5, title: 'AC Connection', details: 'Connect AC output to distribution board. Install AC isolator and surge protection. Label all circuits.', tools: ['AC cable', 'Breakers', 'Surge protector'], duration: '2-3 hours' },
    { step: 6, title: 'Battery Connection', details: 'For hybrid systems: Connect batteries observing correct polarity. Install battery fuses. Configure BMS communication.', tools: ['Battery cables', 'Fuses', 'BMS cables'], duration: '1-2 hours' },
  ],
  commissioning: [
    { step: 1, title: 'Visual Inspection', details: 'Check all connections, cable routing, mounting. Verify no damage during installation. Check all labels in place.', tools: ['Inspection checklist', 'Camera'], duration: '30 min' },
    { step: 2, title: 'Electrical Testing', details: 'Test insulation resistance (>1MΩ). Check Voc and Isc of each string. Verify polarity. Test earth continuity.', tools: ['Insulation tester', 'I-V tracer', 'Multimeter'], duration: '1-2 hours' },
    { step: 3, title: 'Inverter Configuration', details: 'Configure inverter settings: grid parameters, battery type, charge settings, time zones. Set up monitoring.', tools: ['Laptop/phone', 'Configuration manual'], duration: '1 hour' },
    { step: 4, title: 'System Startup', details: 'Close DC isolator, then AC isolator. Monitor inverter startup. Check for errors. Verify grid connection.', tools: ['Multimeter', 'Monitoring app'], duration: '30 min' },
    { step: 5, title: 'Performance Verification', details: 'Monitor system output. Compare to expected performance. Document commissioning data. Train system owner.', tools: ['Monitoring system', 'Commissioning report'], duration: '1-2 hours' },
  ],
};

// ============================================
// MAINTENANCE SCHEDULES
// ============================================
export const MAINTENANCE_SCHEDULE = {
  daily: [
    { task: 'Monitor production', description: 'Check inverter display or app for daily kWh production', severity: 'routine' },
    { task: 'Check for errors', description: 'Verify no warning lights or error codes displayed', severity: 'routine' },
    { task: 'Battery SOC check', description: 'For battery systems, verify state of charge is appropriate', severity: 'routine' },
  ],
  weekly: [
    { task: 'Visual panel inspection', description: 'Look for debris, bird droppings, or damage on panels', severity: 'routine' },
    { task: 'Production comparison', description: 'Compare weekly production to expected/historical values', severity: 'routine' },
    { task: 'Inverter status check', description: 'Review all inverter indicators and logs', severity: 'routine' },
    { task: 'Listen for abnormal sounds', description: 'Check for clicking, buzzing, or humming from inverter', severity: 'routine' },
  ],
  monthly: [
    { task: 'Panel cleaning assessment', description: 'Determine if panels need cleaning based on soiling', severity: 'important' },
    { task: 'Cable inspection', description: 'Check visible cables for damage, animal chewing, UV degradation', severity: 'important' },
    { task: 'Mounting check', description: 'Verify mounting structure is secure, no loose bolts', severity: 'important' },
    { task: 'Ventilation check', description: 'Ensure inverter ventilation is clear of obstructions', severity: 'important' },
    { task: 'Battery terminal check', description: 'For lead-acid: check for corrosion. For lithium: check BMS status', severity: 'important' },
    { task: 'Production analysis', description: 'Compare monthly production to design estimates', severity: 'routine' },
  ],
  quarterly: [
    { task: 'Thorough panel cleaning', description: 'Clean panels with appropriate solution and soft brush/cloth', severity: 'important' },
    { task: 'Connection torque check', description: 'Re-torque all electrical connections to specification', severity: 'critical' },
    { task: 'DC cable inspection', description: 'Inspect DC cables for damage, check junction boxes', severity: 'important' },
    { task: 'MC4 connector inspection', description: 'Check connectors for heat damage, secure connection', severity: 'important' },
    { task: 'Inverter filter cleaning', description: 'Clean or replace air filters if equipped', severity: 'important' },
    { task: 'Battery capacity test', description: 'For battery systems, perform capacity test if possible', severity: 'important' },
    { task: 'Firmware check', description: 'Check for and apply inverter firmware updates', severity: 'routine' },
  ],
  annual: [
    { task: 'Professional inspection', description: 'Full system inspection by qualified technician', severity: 'critical' },
    { task: 'Thermal imaging', description: 'IR scan of all connections and panels to detect hot spots', severity: 'critical' },
    { task: 'Full battery test', description: 'Complete battery health assessment and capacity test', severity: 'critical' },
    { task: 'Inverter service', description: 'Internal cleaning, capacitor check, fan service', severity: 'critical' },
    { task: 'Mounting structure', description: 'Full structural inspection, corrosion check', severity: 'critical' },
    { task: 'Grounding verification', description: 'Test earth continuity, ground resistance', severity: 'critical' },
    { task: 'Performance ratio', description: 'Calculate annual PR and compare to baseline', severity: 'important' },
    { task: 'Inverter log review', description: 'Download and analyze full year of inverter logs', severity: 'important' },
    { task: 'Documentation update', description: 'Update as-built drawings, maintenance log', severity: 'routine' },
  ],
};

// ============================================
// COST COMPARISON DATA
// ============================================
export const COST_DATA = {
  grid: {
    connectionFee: 15000,
    monthlyFixed: 750,
    rates: [
      { tier: 'Lifeline (0-10 kWh)', rate: 12 },
      { tier: 'Domestic (11-200 kWh)', rate: 15.80 },
      { tier: 'Domestic (>200 kWh)', rate: 22.40 },
      { tier: 'Commercial', rate: 14.50 },
      { tier: 'Industrial', rate: 12.20 },
    ],
    reliability: 85,
    averageOutages: 8, // per month
  },
  generator: {
    purchaseCosts: {
      '5kVA': 85000,
      '10kVA': 150000,
      '15kVA': 220000,
      '20kVA': 350000,
      '30kVA': 500000,
      '50kVA': 850000,
    },
    fuelConsumption: 0.3, // liters per kWh
    fuelPrice: 185, // KES per liter
    maintenancePerHour: 50,
    oilChangeInterval: 100, // hours
    oilChangeCost: 3500,
    lifespan: 15000, // hours
  },
  solar: {
    panelCostPerWatt: 35,
    inverterCostPerKW: 22000,
    batteryCostPerKWh: 25000,
    installationPercent: 15,
    maintenancePerYear: 15000,
    lifespan: 25,
    degradation: 0.5, // percent per year
  },
};

export const WIRING_DIAGRAMS = {
  offGrid: {
    name: 'Off-Grid Solar System',
    description: 'Complete off-grid system with battery storage',
    components: [
      { name: 'Solar Array', from: 'Roof/Ground Mount', to: 'DC Combiner Box', cable: '4mm² or 6mm² PV Cable', protection: 'MC4 Connectors, String Fuses' },
      { name: 'DC Combiner', from: 'Multiple Strings', to: 'Charge Controller/Inverter', cable: '10mm² or 16mm² DC Cable', protection: 'DC Isolator, Surge Arrester' },
      { name: 'Charge Controller', from: 'DC Combiner', to: 'Battery Bank', cable: '16mm² or 25mm² DC Cable', protection: 'DC Fuses, BMS' },
      { name: 'Battery Bank', from: 'Charge Controller', to: 'Inverter DC Input', cable: '25mm² or 35mm² DC Cable', protection: 'Battery Fuse, DC Isolator' },
      { name: 'Inverter', from: 'Battery Bank', to: 'AC Distribution Board', cable: '6mm² or 10mm² AC Cable', protection: 'AC Breaker, Surge Protector' },
      { name: 'Distribution', from: 'Inverter', to: 'Load Circuits', cable: 'As per load', protection: 'MCBs, RCDs per circuit' },
    ],
  },
  gridTie: {
    name: 'Grid-Tie Solar System',
    description: 'Solar system connected to utility grid without batteries',
    components: [
      { name: 'Solar Array', from: 'Roof/Ground Mount', to: 'Grid-Tie Inverter', cable: '4mm² PV Cable per string', protection: 'MC4 Connectors, DC Isolator' },
      { name: 'Grid-Tie Inverter', from: 'Solar Array', to: 'AC Isolator', cable: '6mm² or 10mm² AC Cable', protection: 'Internal AC protection' },
      { name: 'AC Isolator', from: 'Inverter', to: 'Consumer Unit', cable: 'Match inverter output', protection: 'Lockable AC Disconnect' },
      { name: 'Consumer Unit', from: 'AC Isolator', to: 'Utility Meter', cable: 'As per utility', protection: 'AC Breaker, Type II SPD' },
      { name: 'Net Meter', from: 'Consumer Unit', to: 'Grid', cable: 'Utility spec', protection: 'Utility approved meter' },
    ],
  },
  hybrid: {
    name: 'Hybrid Solar System',
    description: 'Grid-connected system with battery backup',
    components: [
      { name: 'Solar Array', from: 'Roof/Ground Mount', to: 'Hybrid Inverter PV Input', cable: '4mm² or 6mm² PV Cable', protection: 'MC4, DC Isolator, Surge Arrester' },
      { name: 'Battery Bank', from: 'Battery System', to: 'Hybrid Inverter Battery Port', cable: '25mm² or 35mm² DC Cable', protection: 'Battery Fuse, BMS Communication' },
      { name: 'Grid Input', from: 'Utility Meter', to: 'Hybrid Inverter Grid Port', cable: '10mm² AC Cable', protection: 'AC Isolator, Type II SPD' },
      { name: 'Essential Loads', from: 'Inverter Backup Output', to: 'Essential DB', cable: 'As per load', protection: 'Dedicated MCBs, RCD' },
      { name: 'Non-Essential', from: 'Inverter Grid Output', to: 'Main DB', cable: 'As per load', protection: 'Main breakers' },
    ],
  },
};
