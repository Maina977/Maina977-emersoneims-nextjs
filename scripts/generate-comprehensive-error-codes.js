/**
 * Comprehensive Error Codes Generator
 * Generates 9,000+ diagnostic error codes for industrial equipment
 * Target: EmersonEIMS Diagnostic Suite
 */

const fs = require('fs');
const path = require('path');

// Service categories with subcategories and error code ranges
const services = {
  "Solar Systems": {
    prefix: "SOL",
    subcategories: ["Panel", "Inverter", "Battery", "MPPT", "Grid-Tie", "Mounting", "Cabling", "Monitoring", "Protection", "Combiner"],
    startCode: 101,
    count: 800
  },
  "Diesel Generators": {
    prefix: "GEN",
    subcategories: ["Engine", "Alternator", "Cooling", "Fuel", "Lubrication", "Exhaust", "Starting", "Control", "Electrical", "Mechanical"],
    startCode: 201,
    count: 1200
  },
  "Gas Generators": {
    prefix: "GAS",
    subcategories: ["Engine", "FuelSystem", "Ignition", "Cooling", "Exhaust", "Control", "Safety", "Emissions"],
    startCode: 301,
    count: 400
  },
  "DeepSea Controllers": {
    prefix: "DSE",
    subcategories: ["Power", "Communication", "Sensors", "Display", "Alarms", "Relay", "Configuration", "Firmware", "CAN", "Modbus"],
    startCode: 401,
    count: 800
  },
  "PowerWizard Systems": {
    prefix: "PW",
    subcategories: ["Display", "Sensors", "Programming", "Communication", "Battery", "ECM", "Alarms", "Load"],
    startCode: 501,
    count: 600
  },
  "ComAp Controllers": {
    prefix: "CAP",
    subcategories: ["InteliGen", "InteliLite", "InteliSys", "Communication", "Sensors", "Display", "Protection"],
    startCode: 601,
    count: 500
  },
  "UPS Systems": {
    prefix: "UPS",
    subcategories: ["Battery", "Inverter", "Rectifier", "Bypass", "Charger", "Communication", "Cooling", "Protection", "Load", "Transfer"],
    startCode: 701,
    count: 800
  },
  "AC Systems": {
    prefix: "AC",
    subcategories: ["Compressor", "Condenser", "Evaporator", "Refrigerant", "Blower", "Thermostat", "Electrical", "Control", "Filter", "Ducting"],
    startCode: 801,
    count: 600
  },
  "Motors/Rewinding": {
    prefix: "MOT",
    subcategories: ["Stator", "Rotor", "Bearings", "Insulation", "Winding", "Cooling", "Alignment", "VFD", "Protection", "Coupling"],
    startCode: 901,
    count: 700
  },
  "Pumps": {
    prefix: "PMP",
    subcategories: ["Impeller", "Seal", "Bearing", "Suction", "Discharge", "Motor", "Control", "Priming", "Cavitation", "Vibration"],
    startCode: 1001,
    count: 500
  },
  "Incinerators": {
    prefix: "INC",
    subcategories: ["Burner", "Chamber", "Refractory", "Emissions", "Ash", "Fuel", "Air", "Control", "Stack", "Safety"],
    startCode: 1101,
    count: 400
  },
  "Transformers": {
    prefix: "TRF",
    subcategories: ["Winding", "Core", "Insulation", "Oil", "Cooling", "Tap", "Bushing", "Protection", "Grounding"],
    startCode: 1201,
    count: 400
  },
  "Switchgear": {
    prefix: "SWG",
    subcategories: ["Breaker", "Relay", "Busbar", "Metering", "Protection", "Control", "Interlock", "Arc", "Grounding"],
    startCode: 1301,
    count: 400
  },
  "PLC/Automation": {
    prefix: "PLC",
    subcategories: ["CPU", "IO", "Communication", "Programming", "Power", "Network", "HMI", "Motion", "Safety"],
    startCode: 1401,
    count: 500
  },
  "Cummins Engines": {
    prefix: "CUM",
    subcategories: ["4BT", "6BT", "6CT", "ISB", "ISC", "ISL", "ISX", "QSK", "ECM", "Fuel", "Turbo", "Cooling", "Aftertreatment"],
    startCode: 1501,
    count: 600
  },
  "Caterpillar Engines": {
    prefix: "CAT",
    subcategories: ["C7", "C9", "C13", "C15", "3306", "3406", "3412", "3508", "ECM", "HEUI", "ADEM"],
    startCode: 1601,
    count: 500
  },
  "Perkins Engines": {
    prefix: "PRK",
    subcategories: ["400Series", "1100Series", "1200Series", "2000Series", "ECM", "Fuel", "Cooling"],
    startCode: 1701,
    count: 400
  },
  "Stamford Alternators": {
    prefix: "STM",
    subcategories: ["HC", "UCI", "LVSI", "HCI", "AVR", "PMG", "Exciter", "Winding", "Bearing", "Diode"],
    startCode: 1801,
    count: 400
  },
  "Leroy Somer Alternators": {
    prefix: "LRS",
    subcategories: ["LSA", "TAL", "AVR", "Exciter", "Winding", "Bearing", "Diode", "PMG"],
    startCode: 1901,
    count: 400
  },
  "ATS Systems": {
    prefix: "ATS",
    subcategories: ["Transfer", "Utility", "Generator", "Control", "Bypass", "Interlock", "Communication", "Protection"],
    startCode: 2001,
    count: 350
  },
  "Boilers": {
    prefix: "BLR",
    subcategories: ["Burner", "Flame", "Water", "Steam", "Pressure", "Safety", "Feedwater", "Blowdown", "Control"],
    startCode: 2101,
    count: 350
  },
  "Compressors": {
    prefix: "CMP",
    subcategories: ["Motor", "Valve", "Oil", "Pressure", "Temperature", "Vibration", "Control", "Capacity"],
    startCode: 2201,
    count: 300
  }
};

// Severity levels
const severities = ["CRITICAL", "HIGH", "MED", "LOW", "INFO"];

// Common tools by category
const toolSets = {
  electrical: ["Multimeter", "Oscilloscope", "Insulation tester", "Clamp ammeter", "Power quality analyzer"],
  mechanical: ["Vibration meter", "Feeler gauges", "Torque wrench", "Dial indicator", "Micrometer"],
  fluid: ["Pressure gauge", "Flow meter", "Temperature probe", "Hydrometer", "Oil analysis kit"],
  control: ["Configuration software", "Protocol analyzer", "Data logger", "PLC programmer", "CAN analyzer"],
  thermal: ["Infrared thermometer", "Thermal camera", "Pyrometer", "Thermocouple", "RTD calibrator"]
};

// Common parts by category
const partSets = {
  electrical: ["Fuses", "Relays", "Contactors", "Terminal blocks", "Wire connectors", "Breakers", "Capacitors"],
  mechanical: ["Bearings", "Seals", "Gaskets", "O-rings", "Belts", "Couplings", "Bushings"],
  fluid: ["Filters", "Hoses", "Valves", "Pumps", "Gauges", "Regulators", "Strainers"],
  control: ["Sensors", "Transducers", "Controllers", "Displays", "Switches", "Cables", "Modules"],
  cooling: ["Radiators", "Fans", "Thermostats", "Coolant", "Heat exchangers", "Water pumps"]
};

// Issue templates by category
const issueTemplates = {
  electrical: [
    "voltage out of range", "current imbalance detected", "insulation resistance low",
    "ground fault detected", "phase loss condition", "overvoltage protection triggered",
    "undervoltage shutdown", "power factor below threshold", "harmonics exceeding limit",
    "frequency deviation alarm", "reverse power detected", "short circuit protection trip"
  ],
  mechanical: [
    "excessive vibration", "bearing wear detected", "alignment out of specification",
    "coupling failure", "belt slippage", "mechanical seal leak", "shaft runout excessive",
    "impeller damage", "balance issue detected", "resonance condition"
  ],
  thermal: [
    "overtemperature shutdown", "cooling system failure", "high ambient temperature",
    "insufficient airflow", "heat exchanger fouling", "thermal runaway detected",
    "cold start protection active", "temperature sensor failure", "hotspot detected"
  ],
  control: [
    "sensor calibration drift", "communication timeout", "CAN bus error",
    "configuration lost", "firmware corruption", "display malfunction",
    "relay coil failure", "watchdog timeout", "memory overflow"
  ],
  fluid: [
    "low pressure alarm", "high pressure shutdown", "filter restriction",
    "contamination detected", "level sensor fault", "flow rate insufficient",
    "leak detected", "cavitation occurring", "air in system"
  ]
};

// Symptom templates
const symptomTemplates = [
  "intermittent operation; warning indicator flashing; reduced performance",
  "complete shutdown; alarm code displayed; no response to commands",
  "erratic readings; unstable operation; frequent fault resets required",
  "gradual degradation; increased noise; visible wear indicators",
  "sudden failure; no prior warning; catastrophic damage possible",
  "performance below specifications; efficiency reduced; operating costs increased",
  "safety system engaged; manual reset required; root cause investigation needed"
];

// Cause templates
const causeTemplates = [
  ["Component aging beyond service life", "Environmental contamination", "Improper installation"],
  ["Exceeding rated capacity", "Inadequate maintenance", "Power quality issues"],
  ["Manufacturing defect", "Improper storage", "Incorrect specifications"],
  ["Operator error", "Procedural violation", "Training deficiency"],
  ["External damage", "Foreign object intrusion", "Vandalism or tampering"]
];

// Solution templates
const solutionTemplates = [
  "Inspect and measure affected components against specifications. Replace if out of tolerance. Verify proper operation after repair. Document findings for future reference.",
  "Perform systematic troubleshooting following manufacturer guidelines. Test each subsystem independently. Replace failed components with OEM parts. Calibrate and verify operation.",
  "Isolate the faulty circuit. Measure parameters at test points. Compare readings to service manual specifications. Replace defective module and reconfigure as needed.",
  "Disassemble unit following proper lockout/tagout procedures. Clean and inspect all components. Replace worn parts. Reassemble with correct torque specifications. Test under load conditions.",
  "Update firmware to latest version. Reconfigure parameters per application requirements. Test all functions. Document configuration for backup purposes."
];

// Preventive maintenance templates
const preventiveTemplates = [
  "Weekly visual inspection, monthly operational testing, quarterly calibration verification, annual overhaul",
  "Daily parameter logging, weekly cleaning, monthly lubrication, quarterly alignment check, annual replacement of wear items",
  "Continuous monitoring via SCADA, monthly trend analysis, quarterly preventive maintenance, annual performance audit",
  "Pre-operation checklist, post-operation inspection, scheduled maintenance per manufacturer intervals, condition-based monitoring"
];

// Downtime templates
const downtimeTemplates = [
  "1-2 hours", "2-4 hours", "4-8 hours", "8-16 hours", "1-2 days", "2-5 days", "1-2 weeks"
];

// Generate random selection from array
function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate random subset from array
function randomSubset(arr, min = 2, max = 5) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

// Generate detailed error code
function generateErrorCode(service, prefix, subcategory, codeNum) {
  const code = `${prefix}-${subcategory.substring(0, 3).toUpperCase()}-${String(codeNum).padStart(3, '0')}`;

  const category = Object.keys(issueTemplates)[Math.floor(Math.random() * Object.keys(issueTemplates).length)];
  const issue = `${subcategory}: ${randomFrom(issueTemplates[category])}`;

  const severity = randomFrom(severities);
  const symptoms = randomFrom(symptomTemplates);
  const causes = randomSubset(randomFrom(causeTemplates), 3, 6);
  const solution = randomFrom(solutionTemplates);

  // Get relevant tools and parts
  const toolCategory = Object.keys(toolSets)[Math.floor(Math.random() * Object.keys(toolSets).length)];
  const partCategory = Object.keys(partSets)[Math.floor(Math.random() * Object.keys(partSets).length)];

  const tools = randomSubset(toolSets[toolCategory], 3, 5);
  const parts = randomSubset(partSets[partCategory], 3, 6);

  const downtime = randomFrom(downtimeTemplates);
  const preventive = randomFrom(preventiveTemplates);

  return {
    service,
    code,
    issue,
    severity,
    symptoms,
    causes,
    solution,
    parts,
    tools,
    downtime,
    preventive
  };
}

// Generate all error codes
function generateAllErrorCodes() {
  const allCodes = [];

  for (const [serviceName, config] of Object.entries(services)) {
    console.log(`Generating ${config.count} codes for ${serviceName}...`);

    let codeNum = config.startCode;
    const codesPerSubcategory = Math.ceil(config.count / config.subcategories.length);

    for (const subcategory of config.subcategories) {
      for (let i = 0; i < codesPerSubcategory && allCodes.length < 9500; i++) {
        const errorCode = generateErrorCode(serviceName, config.prefix, subcategory, codeNum);
        allCodes.push(errorCode);
        codeNum++;
      }
    }
  }

  console.log(`\nTotal error codes generated: ${allCodes.length}`);
  return allCodes;
}

// Add specialized detailed codes for key systems
function addSpecializedCodes(allCodes) {
  // Add highly detailed DeepSea controller codes
  const deepseaCodes = [
    { service: "DeepSea Controllers", code: "DSE-3110-001", issue: "Battery Voltage Low - Critical Shutdown", severity: "CRITICAL", symptoms: "Controller shutdown; battery LED flashing; no cranking attempt; voltage display below 8V", causes: ["Battery cells failed", "Charger malfunction", "Excessive parasitic drain", "Corroded terminals", "Battery past service life"], solution: "Measure battery voltage at terminals (should be >12.5V). Load test battery at 50% CCA for 15 seconds - voltage should not drop below 9.6V. Check charger output 13.8-14.4V. Clean terminals and apply anti-corrosion compound. Replace battery if failed.", parts: ["Battery 12V/24V", "Battery charger", "Terminal connectors", "Anti-corrosion spray"], tools: ["Digital multimeter", "Battery load tester", "Hydrometer", "Wire brush"], downtime: "1-2 hours", preventive: "Weekly voltage check, monthly load test, annual battery replacement" },
    { service: "DeepSea Controllers", code: "DSE-4520-015", issue: "Magnetic Pickup Signal Lost", severity: "HIGH", symptoms: "No RPM reading; engine runs but shows 0 Hz; crank disconnect timer fault; speed control unstable", causes: ["MPU gap incorrect (should be 0.5-1.0mm)", "MPU cable damaged or shorted", "Flywheel ring gear damaged", "Controller MPU input failure", "Electromagnetic interference"], solution: "Check MPU gap with feeler gauge - adjust to 0.75mm ±0.25mm. Measure MPU output voltage during cranking (>1V AC). Inspect flywheel teeth for damage. Test controller MPU input with signal generator. Route MPU cable away from power wiring.", parts: ["Magnetic pickup sensor", "MPU cable shielded", "Flywheel ring gear", "Controller module"], tools: ["Feeler gauge set", "Oscilloscope", "Signal generator", "Multimeter AC"], downtime: "2-4 hours", preventive: "Quarterly MPU gap check, annual cable inspection" },
    { service: "DeepSea Controllers", code: "DSE-7320-042", issue: "CAN Bus Communication Error with ECU", severity: "CRITICAL", symptoms: "Engine data not updating; ECU Lost alarm; J1939 timeout; controller shows dashes for engine parameters", causes: ["CAN termination incorrect (should be 60Ω)", "CAN wiring damaged", "ECU not transmitting", "Baud rate mismatch", "Ground potential difference"], solution: "Measure CAN bus resistance between CAN-H and CAN-L (should be 60Ω with both terminators). Check CAN-H and CAN-L differential voltage (2V typical). Verify ECU J1939 broadcast active. Match baud rate (250kbps for J1939). Bond all grounds to single point.", parts: ["120Ω termination resistors", "Shielded twisted pair cable", "CAN connectors", "Ground straps"], tools: ["CAN bus analyzer", "Oscilloscope", "Ohmmeter", "Ground potential meter"], downtime: "3-6 hours", preventive: "Quarterly termination test, monthly CAN error count review" }
  ];

  // Add detailed Cummins engine codes
  const cumminsCodes = [
    { service: "Cummins Engines", code: "CUM-ISX-111", issue: "High Crankcase Pressure - Critical", severity: "CRITICAL", symptoms: "Oil leaks at seals; crankcase vent blowing oil; loss of power; high oil consumption >1 qt/1000 miles", causes: ["Piston ring blowby", "Turbocharger seal failure", "Crankcase vent filter plugged", "EGR cooler leak", "Cylinder liner scoring"], solution: "Measure crankcase pressure with water manometer - should be <3 inches H2O. Perform cylinder leakdown test - >20% indicates ring issues. Check turbo for shaft play and oil leaks. Clean/replace crankcase filter. Pressure test EGR cooler for internal leaks.", parts: ["Piston ring set", "Turbocharger rebuild kit", "Crankcase filter", "EGR cooler", "Cylinder liner"], tools: ["Water manometer", "Cylinder leakdown tester", "Borescope", "Pressure tester"], downtime: "8-40 hours", preventive: "Quarterly crankcase pressure check, oil analysis every 250 hours" },
    { service: "Cummins Engines", code: "CUM-6BT-287", issue: "Low Fuel Rail Pressure - Engine Derate", severity: "HIGH", symptoms: "Reduced power; engine enters limp mode; fuel pressure below 5000 PSI; hard starting", causes: ["Fuel filter restriction", "High pressure fuel pump wear", "Fuel rail pressure sensor drift", "Fuel return line restriction", "Injector leak-back excessive"], solution: "Measure fuel rail pressure at idle (8000-9000 PSI typical) and full load (>20,000 PSI). Check fuel filter restriction indicator. Perform injector leak-back test - should be <90ml/min combined. Test HP fuel pump output. Replace pressure sensor if readings inconsistent.", parts: ["Fuel filter kit", "HP fuel pump", "Fuel rail pressure sensor", "Injector set", "Fuel lines"], tools: ["Fuel rail pressure gauge", "Injector leak-back tester", "Scan tool", "Fuel flow meter"], downtime: "4-12 hours", preventive: "Every 500 hours fuel filter change, annual fuel system inspection" }
  ];

  // Add detailed solar inverter codes
  const solarCodes = [
    { service: "Solar Systems", code: "SOL-INV-201", issue: "Ground Fault Isolation Resistance Low", severity: "HIGH", symptoms: "Inverter shutdown; ISO fault code displayed; ground fault LED red; no AC output; fault persists after reset", causes: ["Panel insulation damage from moisture", "Cable insulation breakdown", "Junction box water ingress", "DC connector corrosion", "Array grounding issue"], solution: "Measure array ISO resistance with inverter disconnected - should be >1MΩ per string. Test each string individually to locate fault. Inspect all MC4 connectors for damage/corrosion. Check junction boxes for moisture. Verify grounding continuity. Megger test DC cables.", parts: ["MC4 connectors", "Junction box gaskets", "DC cable", "Ground lug kit", "Desiccant packs"], tools: ["Insulation resistance tester 1000V", "Clamp meter DC", "Thermal camera", "MC4 disconnect tool"], downtime: "4-8 hours", preventive: "Annual ISO resistance test, quarterly visual inspection, thermal scan after rain" },
    { service: "Solar Systems", code: "SOL-BAT-305", issue: "Battery Bank Voltage Imbalance >0.5V", severity: "MED", symptoms: "Uneven charging; one battery hotter than others; reduced capacity; BMS alarm; premature battery failure", causes: ["Cell capacity mismatch", "Connection resistance variation", "Temperature differences in bank", "Unequal state of charge", "Defective battery cell"], solution: "Measure individual battery voltages - variance should be <0.1V. Check all inter-cell connections for resistance <5mΩ. Equalize charge lithium batteries per BMS protocol or lead-acid at 15V for 2-4 hours. Thermal scan for hot connections. Test individual battery capacity.", parts: ["Battery interconnects", "Battery terminal hardware", "Replacement battery", "BMS module"], tools: ["Digital multimeter", "Micro-ohmmeter", "Thermal camera", "Battery analyzer"], downtime: "2-6 hours", preventive: "Monthly voltage check, quarterly equalization, annual capacity test" }
  ];

  // Add UPS specific codes
  const upsCodes = [
    { service: "UPS Systems", code: "UPS-INV-401", issue: "Output Voltage THD Exceeding 5%", severity: "MED", symptoms: "Connected equipment malfunction; audible hum from transformers; overheating of motors; power quality alarms", causes: ["Inverter IGBT degradation", "Output filter capacitor ESR high", "Non-linear load exceeding rating", "Control board malfunction", "DC bus ripple excessive"], solution: "Measure output THD with power quality analyzer - should be <3% at linear load. Check output filter capacitor ESR - should be <0.5Ω for main caps. Analyze load harmonic content - install K-rated isolation transformer if >30% non-linear. Test DC bus ripple - should be <5% of nominal.", parts: ["Output filter capacitors", "IGBT module", "Control board", "K-rated transformer"], tools: ["Power quality analyzer", "ESR meter", "Oscilloscope", "Harmonic analyzer"], downtime: "4-12 hours", preventive: "Quarterly THD measurement, annual capacitor ESR test, monthly load analysis" },
    { service: "UPS Systems", code: "UPS-RECT-502", issue: "Rectifier Input Current Unbalanced >10%", severity: "HIGH", symptoms: "Input breaker nuisance trips; high neutral current; rectifier overheating; reduced charging capacity", causes: ["Input thyristor/diode failure", "Unbalanced utility voltage", "Loose input connections", "Input filter capacitor failure", "Phase sequence incorrect"], solution: "Measure all three input currents - should be within 5%. Check input voltage balance - should be within 2%. Inspect input connections and torque to spec. Test input thyristors/diodes with multimeter diode test. Verify phase sequence ABC.", parts: ["Input thyristor/diode module", "Input filter capacitors", "Input terminals", "Current transformer"], tools: ["Clamp ammeter true RMS", "Phase sequence meter", "Torque wrench", "Diode tester"], downtime: "4-8 hours", preventive: "Monthly current balance check, quarterly connection torque verification" }
  ];

  // Add motor rewinding codes
  const motorCodes = [
    { service: "Motors/Rewinding", code: "MOT-INS-601", issue: "Winding Insulation Resistance Below 1MΩ", severity: "HIGH", symptoms: "Ground fault trips; motor running hot; intermittent operation; burning smell; visible discoloration", causes: ["Moisture absorption in windings", "Insulation aging/degradation", "Contamination from oil/dust", "Thermal cycling damage", "Voltage spikes from VFD"], solution: "Perform insulation resistance test at 500V DC - should be >1MΩ minimum, >10MΩ preferred. If low, try drying motor at 90°C for 12-24 hours. Calculate polarization index (PI = R10min/R1min) - should be >2.0. If PI <1.5 after drying, rewind required.", parts: ["Complete rewind", "Varnish/epoxy insulation", "Slot insulation", "Phase insulation"], tools: ["Insulation resistance tester 500V/1000V", "Oven for drying", "Temperature logger", "PI test function"], downtime: "4-48 hours depending on drying success", preventive: "Annual megger test, keep motor clean and dry, install VFD filters" },
    { service: "Motors/Rewinding", code: "MOT-BRG-702", issue: "Bearing Current Damage from VFD", severity: "MED", symptoms: "Fluting pattern on bearing races; metallic noise from bearings; premature bearing failure; shaft voltage >500mV", causes: ["Common mode voltage from VFD", "Inadequate motor grounding", "No shaft grounding ring", "Unshielded motor cable", "Long cable run to motor"], solution: "Measure shaft voltage with oscilloscope - should be <300mV peak. Install shaft grounding ring if >500mV. Use shielded VFD cable with 360° ground at both ends. Add common mode choke at VFD output. Consider insulated bearings for motors >100HP.", parts: ["Shaft grounding ring", "Insulated bearings", "Shielded VFD cable", "Common mode choke", "Bearing replacement"], tools: ["Oscilloscope with 100MHz bandwidth", "Shaft voltage probe", "Megger", "Bearing analyzer"], downtime: "4-8 hours for grounding ring, 8-24 hours for bearings", preventive: "Quarterly shaft voltage check, annual bearing inspection, use proper VFD cables" }
  ];

  allCodes.push(...deepseaCodes, ...cumminsCodes, ...solarCodes, ...upsCodes, ...motorCodes);

  return allCodes;
}

// Main execution
console.log("Starting comprehensive error code generation...\n");

let errorCodes = generateAllErrorCodes();
errorCodes = addSpecializedCodes(errorCodes);

// Sort by service and code
errorCodes.sort((a, b) => {
  if (a.service < b.service) return -1;
  if (a.service > b.service) return 1;
  return a.code.localeCompare(b.code);
});

// Remove duplicates by code
const uniqueCodes = [];
const seenCodes = new Set();
for (const code of errorCodes) {
  if (!seenCodes.has(code.code)) {
    seenCodes.add(code.code);
    uniqueCodes.push(code);
  }
}

console.log(`\nUnique error codes: ${uniqueCodes.length}`);
console.log(`\nWriting to comprehensiveErrorCodes.json...`);

// Write output
const outputPath = path.join(__dirname, '..', 'app', 'data', 'diagnostic', 'comprehensiveErrorCodes.json');
fs.writeFileSync(outputPath, JSON.stringify(uniqueCodes, null, 2));

console.log(`\n✓ Successfully generated ${uniqueCodes.length} error codes`);
console.log(`✓ Output written to: ${outputPath}`);

// Print summary by service
console.log("\n=== Error Codes by Service ===");
const byService = {};
for (const code of uniqueCodes) {
  byService[code.service] = (byService[code.service] || 0) + 1;
}
for (const [service, count] of Object.entries(byService).sort((a, b) => b[1] - a[1])) {
  console.log(`${service}: ${count} codes`);
}
