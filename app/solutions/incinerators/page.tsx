'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import UnifiedCTA from "@/components/cta/UnifiedCTA";

const TABS = [
  { id: 'overview', label: 'Overview', color: 'orange' },
  { id: 'types', label: 'Incinerator Types', color: 'red' },
  { id: 'components', label: 'Components', color: 'slate' },
  { id: 'installation', label: 'Installation', color: 'blue' },
  { id: 'operation', label: 'Operation', color: 'green' },
  { id: 'maintenance', label: 'Maintenance', color: 'amber' },
  { id: 'emissions', label: 'Emissions & Compliance', color: 'purple' },
  { id: 'faults', label: 'Troubleshooting', color: 'red' },
  { id: 'pricing', label: 'Pricing', color: 'emerald' },
  { id: 'shipping', label: 'Delivery', color: 'indigo' },
  { id: 'warranty', label: 'Warranty', color: 'teal' },
];

// Comprehensive Incinerator Overview - 10 Detailed Paragraphs
const INCINERATOR_OVERVIEW = [
  {
    title: "Understanding Incineration Technology",
    content: `Incineration is a controlled thermal treatment process that converts waste materials into ash, flue gas, and heat at high temperatures. Modern incinerators are sophisticated systems designed to achieve complete combustion while minimizing environmental impact through emission control technologies. In Kenya and East Africa, incinerators serve critical roles in healthcare waste management, municipal waste reduction, and industrial waste treatment. Hospitals and clinics rely on incinerators to safely destroy infectious medical waste, sharps, and pharmaceutical residues that cannot be disposed of through conventional means. The technology has evolved significantly from simple burn pits to advanced systems with computerized controls, multiple combustion chambers, and air pollution control devices that meet international emission standards.`
  },
  {
    title: "The Science of Thermal Waste Treatment",
    content: `Effective incineration requires precise control of temperature, time, and turbulence - the three T's of combustion. The primary combustion chamber operates at 800-1000°C, breaking down solid waste into gases and ash. The secondary chamber, operating at 850-1200°C or higher, ensures complete destruction of organic compounds including dangerous dioxins and furans. Residence time in the secondary chamber of at least 2 seconds at high temperature is critical for destroying pathogens and organic pollutants. Turbulence, created by carefully designed airflow patterns, ensures thorough mixing of gases with oxygen for complete combustion. Modern incinerators automatically adjust these parameters based on waste type and loading, maintaining optimal conditions throughout the burn cycle.`
  },
  {
    title: "Medical Waste Incineration Requirements",
    content: `Healthcare facilities generate hazardous waste that requires specialized treatment before disposal. This includes infectious waste (cultures, swabs, blood-soaked materials), pathological waste (tissues, organs), sharps (needles, scalpels, broken glass), pharmaceutical waste (expired drugs, cytotoxic medications), and radioactive waste (certain diagnostic and therapeutic materials). Kenya's Public Health Act and NEMA regulations mandate proper treatment of healthcare waste, with incineration being the approved method for most categories. A properly operated medical waste incinerator must reach 850°C minimum in the secondary chamber to destroy pathogens and 1100°C for cytotoxic waste. The ash residue, being sterile, can then be disposed of in authorized landfills.`
  },
  {
    title: "Environmental Considerations and Emission Control",
    content: `While incineration significantly reduces waste volume (by 90% or more) and destroys pathogens, it must be operated correctly to minimize air pollution. Incomplete combustion produces black smoke containing particulates, carbon monoxide, and unburned organics. Burning chlorinated plastics (PVC) without proper controls releases hydrogen chloride. The most concerning pollutants are dioxins and furans, formed when chlorine-containing materials burn at temperatures between 250-400°C in the presence of metals. Modern incinerators prevent dioxin formation through high secondary chamber temperatures and rapid cooling of flue gases. Additional emission controls may include baghouse filters for particulates, wet scrubbers for acid gases, and activated carbon injection for dioxins and heavy metals.`
  },
  {
    title: "Choosing the Right Incinerator Size",
    content: `Incinerator sizing depends on waste generation rates, operating schedule, and waste characteristics. A typical Kenyan hospital generates 1-3 kg of hazardous waste per patient bed per day. For a 200-bed hospital generating 400 kg/day of infectious waste, a 50 kg/hour incinerator operating 8 hours would suffice. However, factors like batch versus continuous operation, peak generation rates, and future expansion must be considered. Oversized incinerators waste fuel trying to maintain temperature with light loads, while undersized units create backlogs and may force unsafe storage of hazardous waste. Our engineers conduct waste audits and generation studies to recommend the optimal incinerator capacity for each facility.`
  },
  {
    title: "Fuel Systems and Energy Efficiency",
    content: `Most incinerators use diesel fuel for startup heating and supplemental combustion when waste calorific value is low. A well-designed system minimizes fuel consumption by maximizing heat recovery from waste combustion. Typical fuel consumption ranges from 15-30 liters per 100 kg of medical waste, depending on moisture content and waste composition. Some facilities install waste heat boilers to generate steam for sterilization or laundry, offsetting fuel costs. For remote locations without reliable diesel supply, propane (LPG) or wood-fired options are available. Modern controls optimize fuel injection based on chamber temperature, reducing consumption while maintaining complete combustion. Insulation quality significantly affects fuel efficiency - well-insulated chambers retain heat better during loading cycles.`
  },
  {
    title: "Regulatory Compliance in Kenya",
    content: `Operating an incinerator in Kenya requires compliance with multiple regulations. NEMA (National Environment Management Authority) requires an Environmental Impact Assessment (EIA) for new installations and annual environmental audits for operating facilities. Emission limits follow guidelines similar to WHO recommendations and include particulates (<50 mg/Nm³), carbon monoxide (<100 mg/Nm³), and various other parameters. Stack emission testing must be conducted annually by NEMA-accredited laboratories. Ash disposal must follow hazardous waste protocols if the waste stream included hazardous materials. Healthcare facilities must also comply with Ministry of Health guidelines for healthcare waste management. We assist clients with all regulatory requirements, from EIA preparation to emission testing coordination.`
  },
  {
    title: "Installation and Site Requirements",
    content: `Proper installation is critical for incinerator safety and performance. The site must be located minimum 50 meters from residential areas, hospitals, and food handling facilities. A concrete foundation with appropriate drainage prevents contamination of soil and groundwater. The incinerator room (if enclosed) requires fire-rated construction, adequate ventilation for combustion air, and sufficient space for loading and ash removal. Electrical supply must include 3-phase power for controls and blowers, with backup power for emission control equipment. Fuel storage requires secondary containment to prevent spills. Stack height must comply with NEMA guidelines, typically calculated based on incinerator capacity and surrounding building heights. Professional installation includes commissioning, operator training, and documentation.`
  },
  {
    title: "Operator Training and Safety",
    content: `Safe incinerator operation requires trained personnel who understand the equipment, waste handling procedures, and emergency protocols. Operators must know proper startup and shutdown sequences to avoid thermal shock to refractory linings. Personal protective equipment including heat-resistant gloves, safety glasses, and respiratory protection is essential when loading waste or removing ash. Never open loading doors when under vacuum has been lost - backdraft of hot gases can cause severe burns. Never load aerosol cans, explosives, or large quantities of volatile materials. Ash handling must treat all residues as potentially hot and contaminated until cooled and tested. We provide comprehensive operator training as part of every installation and offer refresher courses for ongoing operations.`
  },
  {
    title: "Our Complete Incinerator Solutions",
    content: `Emerson Industrial Maintenance Services provides end-to-end incinerator solutions for healthcare facilities, industries, and municipalities across Kenya and East Africa. Our offerings include consultation and waste assessment to determine optimal incinerator type and capacity, supply of quality incinerators from reputable manufacturers, professional installation with all civil, mechanical, and electrical works, commissioning and performance testing, operator training and certification, preventive maintenance contracts, spare parts supply and emergency repairs, emission testing coordination, and regulatory compliance assistance. We service all incinerator brands and can retrofit older units with improved controls, refractory, and emission control systems. Contact us for a comprehensive assessment of your waste management needs.`
  }
];

// Incinerator Types
const INCINERATOR_TYPES = [
  {
    type: 'Medical/Clinical Waste Incinerator',
    capacity: '10-500 kg/hr',
    temperature: '850-1200°C',
    fuelType: 'Diesel / LPG',
    chambers: 'Dual chamber (Primary + Secondary)',
    applications: ['Hospitals', 'Clinics', 'Laboratories', 'Veterinary facilities', 'Pharmaceutical companies'],
    features: ['Auto ignition system', 'Continuous temperature monitoring', 'Negative pressure operation', 'Automatic ash removal', 'Air pollution control ready'],
    wasteTypes: ['Infectious waste', 'Sharps', 'Pathological waste', 'Pharmaceutical waste', 'Cytotoxic waste'],
    standards: 'WHO Guidelines, NEMA Kenya, EU WID compliant',
    priceRange: 'KES 800,000 - 15,000,000'
  },
  {
    type: 'General/Municipal Waste Incinerator',
    capacity: '100-5000 kg/hr',
    temperature: '800-1000°C',
    fuelType: 'Diesel / Natural Gas / Waste Heat',
    chambers: 'Single or Dual chamber',
    applications: ['Municipalities', 'Hotels', 'Factories', 'Airports', 'Shopping malls'],
    features: ['Continuous feed option', 'Heat recovery boiler', 'Large loading door', 'Automated controls', 'Ash conveyor system'],
    wasteTypes: ['Domestic waste', 'Commercial waste', 'Non-hazardous industrial waste', 'Paper and cardboard', 'Food waste'],
    standards: 'NEMA Kenya guidelines',
    priceRange: 'KES 3,000,000 - 50,000,000'
  },
  {
    type: 'Animal/Pet Cremator',
    capacity: '20-300 kg/load',
    temperature: '800-1100°C',
    fuelType: 'Diesel / LPG / Natural Gas',
    chambers: 'Dual chamber',
    applications: ['Veterinary clinics', 'Pet crematoriums', 'Farms', 'Zoos', 'Abattoirs'],
    features: ['Batch operation', 'Clean ash production', 'Low smoke design', 'Optional afterburner', 'Easy ash collection'],
    wasteTypes: ['Deceased pets', 'Farm animals', 'Abattoir waste', 'Animal carcasses'],
    standards: 'Animal welfare regulations',
    priceRange: 'KES 500,000 - 8,000,000'
  },
  {
    type: 'Industrial Hazardous Waste Incinerator',
    capacity: '100-2000 kg/hr',
    temperature: '1100-1400°C',
    fuelType: 'Diesel / Natural Gas / Waste Oil',
    chambers: 'Multi-chamber with afterburner',
    applications: ['Chemical plants', 'Oil refineries', 'Paint manufacturers', 'Pesticide plants'],
    features: ['Rotary kiln design', 'High temperature capability', 'Advanced emission controls', 'Continuous emission monitoring', 'PLC automation'],
    wasteTypes: ['Chemical waste', 'Solvent waste', 'Oil sludge', 'Contaminated materials', 'Pesticides'],
    standards: 'Basel Convention, NEMA Special License',
    priceRange: 'KES 20,000,000 - 200,000,000'
  },
  {
    type: 'Mobile Incinerator',
    capacity: '20-100 kg/hr',
    temperature: '850-1000°C',
    fuelType: 'Diesel',
    chambers: 'Compact dual chamber',
    applications: ['Remote clinics', 'Disaster response', 'Field hospitals', 'Oil camps', 'Mining sites'],
    features: ['Trailer mounted', 'Quick setup', 'Generator powered option', 'Self-contained', 'Easy transport'],
    wasteTypes: ['Medical waste', 'Camp waste', 'Emergency waste'],
    standards: 'WHO emergency guidelines',
    priceRange: 'KES 2,000,000 - 10,000,000'
  }
];

// Incinerator Components
const INCINERATOR_COMPONENTS = [
  {
    name: 'Primary Combustion Chamber',
    description: 'Main chamber where solid waste is loaded and initially burned at 800-1000°C.',
    function: 'Waste gasification, initial combustion, ash collection',
    diagram: `
┌─────────────────────────────┐
│  PRIMARY COMBUSTION CHAMBER │
├─────────────────────────────┤
│                             │
│    LOADING DOOR             │
│    ══════════════           │
│         ↓                   │
│    ┌───────────────────┐    │
│    │  REFRACTORY       │    │
│    │  LINING           │    │
│    │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │    │
│    │  ▓ WASTE ▓▓▓▓▓▓▓ │    │
│    │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │    │
│    │                   │    │
│    │  ← COMBUSTION AIR │    │
│    │                   │    │
│    └───────────────────┘    │
│         ↓ ASH               │
│    ASH COLLECTION           │
│    ═══════════════          │
│                             │
│    TEMP: 800-1000°C         │
└─────────────────────────────┘
    `,
    maintenance: ['Remove ash daily', 'Inspect refractory weekly', 'Check door seals']
  },
  {
    name: 'Secondary Combustion Chamber (Afterburner)',
    description: 'Second chamber where gases from primary chamber are burned at higher temperature for complete destruction.',
    function: 'Gas phase combustion, pathogen destruction, dioxin prevention',
    diagram: `
┌─────────────────────────────┐
│  SECONDARY CHAMBER          │
│  (AFTERBURNER)              │
├─────────────────────────────┤
│                             │
│    GASES FROM PRIMARY       │
│         ↓                   │
│    ┌───────────────────┐    │
│    │  HIGH TEMP ZONE   │    │
│    │                   │    │
│    │    BURNER →       │    │
│    │  ════════════     │    │
│    │  FLAME ~~~≈≈≈     │    │
│    │  ~~~~~~~~≈≈≈≈     │    │
│    │  ~~~~~~~~~≈≈≈≈    │    │
│    │                   │    │
│    │  RESIDENCE >2 sec │    │
│    └───────────────────┘    │
│         ↓                   │
│    TO STACK / SCRUBBER      │
│                             │
│    TEMP: 850-1200°C         │
└─────────────────────────────┘
    `,
    maintenance: ['Burner service monthly', 'Thermocouple calibration', 'Refractory inspection']
  },
  {
    name: 'Diesel Burner System',
    description: 'Provides heat for startup and supplemental combustion when waste calorific value is insufficient.',
    function: 'Preheat chambers, maintain temperature, ensure complete combustion',
    diagram: `
┌─────────────────────────────┐
│     BURNER SYSTEM           │
├─────────────────────────────┤
│                             │
│  FUEL TANK                  │
│  ┌────────┐                 │
│  │ DIESEL │                 │
│  └────┬───┘                 │
│       │                     │
│       ↓                     │
│  FUEL PUMP ── FILTER        │
│       │                     │
│       ↓                     │
│  ┌────────────────┐         │
│  │   BURNER       │         │
│  │  ┌──────────┐  │         │
│  │  │ NOZZLE   │  │ ← AIR   │
│  │  │ ~~~~≈≈   │  │         │
│  │  │  FLAME   │  │         │
│  │  └──────────┘  │         │
│  └────────────────┘         │
│       ↓                     │
│  → TO CHAMBER               │
└─────────────────────────────┘
    `,
    maintenance: ['Clean nozzle weekly', 'Replace filters monthly', 'Check ignition electrode']
  },
  {
    name: 'Combustion Air System',
    description: 'Blowers that supply primary and secondary air for combustion process.',
    function: 'Supply oxygen for combustion, create turbulence, maintain negative pressure',
    diagram: `
┌─────────────────────────────┐
│    AIR SUPPLY SYSTEM        │
├─────────────────────────────┤
│                             │
│  PRIMARY AIR BLOWER         │
│  ┌────────────┐             │
│  │  ◉ FAN     │ → UNDER-    │
│  └────────────┘   GRATE     │
│                             │
│  SECONDARY AIR BLOWER       │
│  ┌────────────┐             │
│  │  ◉ FAN     │ → OVER-     │
│  └────────────┘   FIRE      │
│                             │
│  AFTERBURNER AIR            │
│  ┌────────────┐             │
│  │  ◉ FAN     │ → SECONDARY │
│  └────────────┘   CHAMBER   │
│                             │
│  INDUCED DRAFT FAN          │
│  ┌────────────┐             │
│  │  ◉ FAN     │ ← STACK     │
│  └────────────┘              │
│                             │
│  Creates negative pressure  │
└─────────────────────────────┘
    `,
    maintenance: ['Clean filters monthly', 'Check belts/bearings', 'Lubricate motors']
  },
  {
    name: 'Control Panel (PLC)',
    description: 'Programmable Logic Controller manages all incinerator functions automatically.',
    function: 'Temperature control, sequencing, safety interlocks, data logging',
    diagram: `
┌─────────────────────────────┐
│     CONTROL SYSTEM          │
├─────────────────────────────┤
│  ┌─────────────────────┐    │
│  │   HMI DISPLAY       │    │
│  │  ┌───────────────┐  │    │
│  │  │ TEMP: 950°C   │  │    │
│  │  │ STATUS: RUN   │  │    │
│  │  │ ALARMS: NONE  │  │    │
│  │  └───────────────┘  │    │
│  └─────────────────────┘    │
│                             │
│  INPUTS:                    │
│  • Temperature sensors      │
│  • Door switches            │
│  • Pressure sensors         │
│  • Flame detectors          │
│                             │
│  OUTPUTS:                   │
│  • Burner control           │
│  • Blower control           │
│  • Door locks               │
│  • Alarms                   │
└─────────────────────────────┘
    `,
    maintenance: ['Backup settings monthly', 'Check sensor calibration', 'Update firmware']
  },
  {
    name: 'Emission Stack',
    description: 'Chimney that disperses flue gases at height for atmospheric dilution.',
    function: 'Gas dispersion, emission monitoring point, draft creation',
    diagram: `
┌─────────────────────────────┐
│      EMISSION STACK         │
├─────────────────────────────┤
│                             │
│         ↑↑↑                 │
│      EMISSIONS              │
│         │                   │
│    ┌────┴────┐              │
│    │         │              │
│    │  STACK  │ ← Sampling   │
│    │         │   Port       │
│    │    │    │              │
│    │    │    │              │
│    │    │    │              │
│    │    │    │              │
│    │    │    │              │
│    └────┬────┘              │
│         │                   │
│    RAIN CAP                 │
│    ═══════                  │
│                             │
│  Height per NEMA guidelines │
│  Typically 10-30 meters     │
└─────────────────────────────┘
    `,
    maintenance: ['Inspect annually', 'Clean sampling ports', 'Check for corrosion']
  }
];

// Installation Steps
const INSTALLATION_STEPS = [
  { phase: 'Site Assessment', tasks: ['Evaluate proposed location', 'Check distance from buildings', 'Assess ground conditions', 'Review access for delivery', 'Verify utility availability', 'Review NEMA requirements'], time: '1-2 days', icon: '📋' },
  { phase: 'Permits & EIA', tasks: ['Prepare Environmental Impact Assessment', 'Submit to NEMA', 'Public participation if required', 'Obtain construction permits', 'Fire department approval'], time: '2-6 months', icon: '📄' },
  { phase: 'Civil Works', tasks: ['Excavate foundation', 'Install drainage system', 'Pour reinforced concrete pad', 'Construct incinerator room if enclosed', 'Build ash storage area', 'Install fuel containment'], time: '2-4 weeks', icon: '🏗️' },
  { phase: 'Equipment Delivery', tasks: ['Receive incinerator unit', 'Inspect for shipping damage', 'Receive control panel', 'Receive stack sections', 'Store properly', 'Position with crane/forklift'], time: '1-2 days', icon: '🚚' },
  { phase: 'Mechanical Installation', tasks: ['Set incinerator on foundation', 'Install refractory if required', 'Connect fuel lines', 'Install combustion air ducting', 'Erect emission stack', 'Install ash handling system'], time: '1-2 weeks', icon: '🔧' },
  { phase: 'Electrical Installation', tasks: ['Install control panel', 'Wire all sensors and actuators', 'Connect power supply', 'Install emergency stop systems', 'Ground all equipment', 'Install lighting'], time: '1 week', icon: '⚡' },
  { phase: 'Commissioning', tasks: ['Cure refractory (slow heat-up)', 'Test all interlocks', 'Calibrate temperature sensors', 'Verify burner operation', 'Test at full temperature', 'Run performance test'], time: '1 week', icon: '✅' },
  { phase: 'Training & Handover', tasks: ['Train operators', 'Provide O&M manuals', 'Establish maintenance schedule', 'Register warranty', 'Coordinate emission testing', 'Issue completion certificate'], time: '2-3 days', icon: '📚' },
];

// Operation Guide
const OPERATION_GUIDE = [
  { phase: 'Pre-Start Checks', steps: ['Verify fuel level adequate', 'Check ash level in chamber', 'Ensure all doors closed', 'Verify power supply stable', 'Check control panel for alarms', 'Inspect stack and dampers'], time: '10 min' },
  { phase: 'Pre-Heat (Startup)', steps: ['Start induced draft fan', 'Start combustion air blowers', 'Ignite primary burner', 'Heat primary chamber to 600°C', 'Start secondary chamber burner', 'Heat secondary chamber to 850°C+', 'Wait for ready indicator'], time: '30-60 min' },
  { phase: 'Loading Waste', steps: ['Verify chambers at temperature', 'Open loading door slowly', 'Load waste evenly', 'Do not exceed rated capacity', 'Close and latch door securely', 'Verify negative pressure restored'], time: '5-10 min/load' },
  { phase: 'Burn Cycle', steps: ['Monitor primary temp 800-1000°C', 'Monitor secondary temp >850°C', 'Verify residence time >2 seconds', 'Observe stack for smoke', 'Adjust air flow if needed', 'Log temperatures hourly'], time: '1-4 hours' },
  { phase: 'Ash Removal', steps: ['Wait for chamber to cool', 'Wear PPE (heat gloves, mask)', 'Open ash door carefully', 'Remove ash to metal container', 'Allow ash to cool completely', 'Dispose per regulations'], time: '15-30 min' },
  { phase: 'Shutdown', steps: ['Stop waste loading', 'Continue burning until complete', 'Turn off primary burner', 'Run blowers for cool-down', 'Allow gradual temperature drop', 'Turn off all systems when <100°C'], time: '2-4 hours' },
];

// Maintenance Schedule
const MAINTENANCE_SCHEDULE = [
  { interval: 'Daily (Every Use)', tasks: ['Remove ash from primary chamber', 'Check burner ignition', 'Inspect loading door seal', 'Log operating temperatures', 'Visual smoke check', 'Record fuel consumption'], responsible: 'Operator', tools: 'Ash rake, logbook' },
  { interval: 'Weekly', tasks: ['Clean air intake filters', 'Inspect refractory for cracks', 'Check stack condition', 'Clean fuel filters', 'Test door interlocks', 'Check all sensor readings'], responsible: 'Technician', tools: 'Filter cleaner, inspection mirror' },
  { interval: 'Monthly', tasks: ['Service combustion burners', 'Clean burner nozzles', 'Calibrate thermocouples', 'Test all safety interlocks', 'Lubricate door hinges', 'Check electrical connections'], responsible: 'Technician', tools: 'Burner service kit' },
  { interval: 'Quarterly', tasks: ['Full refractory inspection', 'Check all gaskets', 'Inspect blower bearings', 'Clean control panel', 'Verify PLC programs', 'Check fuel system for leaks'], responsible: 'Specialist', tools: 'Inspection equipment' },
  { interval: 'Annually', tasks: ['Complete burner overhaul', 'Stack emission test', 'Replace worn refractory', 'Calibrate all instruments', 'Full electrical inspection', 'NEMA compliance audit'], responsible: 'Service company', tools: 'Full service kit, calibrators' },
  { interval: 'Every 3-5 Years', tasks: ['Major refractory reline', 'Control system upgrade', 'Replace blower motors', 'Stack replacement if corroded', 'Full system recommissioning'], responsible: 'Manufacturer/Service', tools: 'Major overhaul parts' },
];

// Emission Standards
const EMISSION_STANDARDS = [
  { parameter: 'Particulate Matter (PM)', limit: '<50 mg/Nm³', nemaLimit: '50 mg/Nm³', whoLimit: '30 mg/Nm³', testMethod: 'Gravimetric (stack test)', frequency: 'Annual' },
  { parameter: 'Carbon Monoxide (CO)', limit: '<100 mg/Nm³', nemaLimit: '100 mg/Nm³', whoLimit: '50 mg/Nm³', testMethod: 'NDIR analyzer', frequency: 'Continuous or annual' },
  { parameter: 'Sulfur Dioxide (SO₂)', limit: '<200 mg/Nm³', nemaLimit: '200 mg/Nm³', whoLimit: '50 mg/Nm³', testMethod: 'UV fluorescence', frequency: 'Annual' },
  { parameter: 'Nitrogen Oxides (NOx)', limit: '<400 mg/Nm³', nemaLimit: '400 mg/Nm³', whoLimit: '200 mg/Nm³', testMethod: 'Chemiluminescence', frequency: 'Annual' },
  { parameter: 'Hydrogen Chloride (HCl)', limit: '<100 mg/Nm³', nemaLimit: '100 mg/Nm³', whoLimit: '10 mg/Nm³', testMethod: 'Titration/IC', frequency: 'When burning PVC' },
  { parameter: 'Dioxins/Furans (PCDD/F)', limit: '<0.1 ng TEQ/Nm³', nemaLimit: 'Not specified', whoLimit: '0.1 ng TEQ/Nm³', testMethod: 'HRGC/HRMS', frequency: 'Annual (if required)' },
  { parameter: 'Opacity (Smoke)', limit: '<20% (Ringelmann 1)', nemaLimit: '20%', whoLimit: '10%', testMethod: 'Visual/Opacity meter', frequency: 'Continuous' },
  { parameter: 'Temperature (Secondary)', limit: '>850°C', nemaLimit: '850°C min', whoLimit: '850°C min', testMethod: 'Thermocouple', frequency: 'Continuous' },
];

// Fault Database
const FAULT_DATABASE = [
  { fault: 'Black smoke from stack', causes: ['Incomplete combustion', 'Overloaded chamber', 'Wet waste', 'Insufficient air', 'Low secondary temp'], diagnostics: ['Check waste moisture', 'Verify air flow', 'Check secondary temp'], solution: 'Reduce loading rate, ensure secondary chamber >850°C, increase combustion air, dry waste if possible.', urgency: 'high' },
  { fault: 'Burner fails to ignite', causes: ['No fuel', 'Clogged nozzle', 'Failed ignition electrode', 'Air in fuel line', 'Flame detector fault'], diagnostics: ['Check fuel level', 'Inspect nozzle', 'Check spark', 'Bleed fuel line'], solution: 'Clean or replace nozzle, replace ignition electrode, bleed fuel system, check flame detector.', urgency: 'high' },
  { fault: 'Temperature won\'t reach setpoint', causes: ['Burner fault', 'Excessive air', 'Wet waste', 'Refractory damage', 'Thermocouple fault'], diagnostics: ['Check burner output', 'Verify air settings', 'Inspect refractory'], solution: 'Service burner, reduce excess air, repair refractory, calibrate thermocouple.', urgency: 'medium' },
  { fault: 'Excessive fuel consumption', causes: ['Low calorific waste', 'Air leaks in chamber', 'Poor refractory insulation', 'Running too hot', 'Burner out of adjustment'], diagnostics: ['Analyze waste composition', 'Check for air leaks', 'Inspect insulation'], solution: 'Improve waste segregation, seal air leaks, repair insulation, adjust temperature setpoint, tune burner.', urgency: 'medium' },
  { fault: 'Loading door won\'t open', causes: ['Interlock engaged', 'Chamber pressure wrong', 'Mechanical jam', 'Limit switch fault', 'PLC fault'], diagnostics: ['Check interlock status', 'Verify pressure', 'Check limit switches'], solution: 'Verify chamber temperature safe, check draft, reset interlocks, repair mechanism.', urgency: 'medium' },
  { fault: 'High stack temperature alarm', causes: ['Secondary burner stuck on', 'Control fault', 'Thermocouple misplaced', 'Afterburning in stack'], diagnostics: ['Check burner operation', 'Verify temperature readings', 'Inspect stack'], solution: 'Check control system, verify thermocouple location, reduce waste loading, check for burning in stack.', urgency: 'high' },
  { fault: 'Low draft / positive pressure', causes: ['ID fan failure', 'Stack blocked', 'Damper closed', 'Air leak in system'], diagnostics: ['Check fan operation', 'Inspect stack', 'Check dampers'], solution: 'Repair or replace ID fan, clear stack obstruction, open dampers, seal air leaks.', urgency: 'high' },
  { fault: 'Ash removal door stuck', causes: ['Ash buildup', 'Warped door', 'Latch failure', 'Refractory bulging'], diagnostics: ['Check for obstruction', 'Inspect door condition'], solution: 'Clear ash buildup, repair or replace door, fix latch mechanism.', urgency: 'low' },
];

// Pricing
const INCINERATOR_PRICING = [
  { capacity: '10-20 kg/hr', type: 'Medical', chambers: 'Dual', price: 'KES 800,000 - 1,500,000', installation: 'KES 200,000 - 400,000', application: 'Small clinic, vet clinic' },
  { capacity: '30-50 kg/hr', type: 'Medical', chambers: 'Dual', price: 'KES 1,500,000 - 2,500,000', installation: 'KES 400,000 - 700,000', application: 'Medium clinic, laboratory' },
  { capacity: '50-100 kg/hr', type: 'Medical', chambers: 'Dual', price: 'KES 2,500,000 - 4,500,000', installation: 'KES 600,000 - 1,000,000', application: 'District hospital' },
  { capacity: '100-200 kg/hr', type: 'Medical', chambers: 'Dual', price: 'KES 4,500,000 - 8,000,000', installation: 'KES 1,000,000 - 1,500,000', application: 'Regional hospital' },
  { capacity: '200-500 kg/hr', type: 'Medical', chambers: 'Dual', price: 'KES 8,000,000 - 15,000,000', installation: 'KES 1,500,000 - 3,000,000', application: 'Teaching hospital, waste company' },
  { capacity: '50-100 kg/load', type: 'Pet Cremator', chambers: 'Dual', price: 'KES 500,000 - 1,200,000', installation: 'KES 150,000 - 300,000', application: 'Vet clinic' },
  { capacity: '100-200 kg/load', type: 'Pet Cremator', chambers: 'Dual', price: 'KES 1,200,000 - 2,500,000', installation: 'KES 300,000 - 500,000', application: 'Pet crematorium, farm' },
  { capacity: '200-500 kg/hr', type: 'General Waste', chambers: 'Single/Dual', price: 'KES 3,000,000 - 8,000,000', installation: 'KES 800,000 - 1,500,000', application: 'Hotel, factory, camp' },
  { capacity: '500-1000 kg/hr', type: 'General Waste', chambers: 'Dual', price: 'KES 8,000,000 - 20,000,000', installation: 'KES 2,000,000 - 4,000,000', application: 'Municipality, large factory' },
  { capacity: '1000-2000 kg/hr', type: 'Industrial', chambers: 'Multi', price: 'KES 20,000,000 - 50,000,000', installation: 'KES 5,000,000 - 10,000,000', application: 'Industrial complex' },
];

// Shipping Info
const SHIPPING_INFO = {
  nairobi: { cost: 'Included in installation', note: 'Installation includes delivery within Nairobi', time: '1-2 days' },
  centralKenya: { regions: ['Kiambu', 'Muranga', 'Nyeri', 'Thika'], cost: 'KES 30,000 - 80,000', time: '1-2 days' },
  riftValley: { regions: ['Nakuru', 'Eldoret', 'Naivasha', 'Kericho'], cost: 'KES 50,000 - 120,000', time: '2-3 days' },
  western: { regions: ['Kisumu', 'Kakamega', 'Bungoma'], cost: 'KES 80,000 - 150,000', time: '2-4 days' },
  coast: { regions: ['Mombasa', 'Malindi', 'Lamu'], cost: 'KES 100,000 - 200,000', time: '3-5 days' },
  eastAfrica: {
    countries: [
      { country: 'Uganda', cities: 'Kampala, Jinja', cost: 'KES 150,000 - 300,000', time: '5-7 days' },
      { country: 'Tanzania', cities: 'Arusha, Dar es Salaam', cost: 'KES 200,000 - 400,000', time: '5-10 days' },
      { country: 'Rwanda', cities: 'Kigali', cost: 'KES 180,000 - 350,000', time: '5-8 days' },
      { country: 'South Sudan', cities: 'Juba', cost: 'KES 300,000 - 600,000', time: '7-14 days' },
    ]
  }
};

// Warranty Info
const WARRANTY_INFO = {
  standard: { duration: '12 Months', coverage: ['Manufacturing defects', 'Burner system', 'Control panel', 'Blower motors', 'Structural components'], conditions: ['Operated per manual', 'Regular maintenance performed', 'Original fuel used', 'Not overloaded'] },
  extended: { duration: '24-36 Months', coverage: ['All standard coverage', 'Refractory (limited)', 'Annual service included', 'Emergency response'], conditions: ['Maintenance contract active', 'Annual emission test done', 'NEMA compliance maintained', 'Operator training current'] },
  exclusions: ['Refractory wear from normal use', 'Consumables (filters, gaskets)', 'Damage from improper waste', 'Damage from power surges', 'Cosmetic damage', 'Modifications by others']
};

export default function IncineratorsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedFault, setExpandedFault] = useState<string | null>(null);
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <main className="bg-black min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[90vh] min-h-[600px] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <Image src="/images/5.png" alt="Incinerator Systems" fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 mix-blend-color" style={{ background: 'linear-gradient(135deg, rgba(255, 100, 0, 0.3) 0%, rgba(180, 50, 0, 0.25) 100%)' }} />
          <div className="absolute inset-0 mix-blend-overlay" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.7) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)' }} />
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/90 to-transparent" />
        </motion.div>

        <motion.div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6" style={{ opacity: heroOpacity, y: textY }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="max-w-5xl">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-white/90 tracking-wider uppercase">Thermal Waste Treatment Experts</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">Incinerator</span>
              <span className="block bg-gradient-to-r from-orange-400 via-red-500 to-red-600 bg-clip-text text-transparent">Solutions</span>
            </h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="text-lg md:text-xl lg:text-2xl text-gray-200/90 max-w-3xl mx-auto leading-relaxed">
              Complete incinerator solutions. Medical waste, general waste, pet cremation. NEMA compliant. Installation, maintenance, emission testing. 12-24 months warranty.
            </motion.p>

            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 1 }} className="mt-8 h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-8 flex flex-wrap gap-4 justify-center">
              <UnifiedCTA action="custom" href="https://wa.me/254722274914?text=Incinerator%20Inquiry" label="WhatsApp Quote" />
              <UnifiedCTA action="custom" href="tel:+254722274914" variant="secondary" label="Call Now" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Tab Navigation */}
      <section className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3 py-2 rounded-full text-xs md:text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-orange-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Complete Guide to Incineration Systems</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Everything you need to know about thermal waste treatment.</p>
              </div>
              <div className="grid gap-8">
                {INCINERATOR_OVERVIEW.map((section, index) => (
                  <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-orange-500/20">
                    <h3 className="text-xl font-bold text-orange-400 mb-4">{section.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{section.content}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'types' && (
            <motion.div key="types" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Types of Incinerators</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Complete range for medical, industrial, and general waste.</p>
              </div>
              <div className="space-y-6">
                {INCINERATOR_TYPES.map((inc) => (
                  <div key={inc.type} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-red-500/30 overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                      <div className="flex justify-between items-start flex-wrap gap-4">
                        <div><h3 className="text-xl font-bold text-red-400 mb-2">{inc.type}</h3><span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">{inc.chambers}</span></div>
                        <div className="text-right"><p className="text-green-400 font-bold">{inc.priceRange}</p><p className="text-gray-500 text-sm">{inc.capacity}</p></div>
                      </div>
                    </div>
                    <div className="p-6 grid md:grid-cols-4 gap-4 text-sm">
                      <div><span className="text-gray-400">Temperature:</span> <span className="text-white">{inc.temperature}</span></div>
                      <div><span className="text-gray-400">Fuel:</span> <span className="text-white">{inc.fuelType}</span></div>
                      <div className="col-span-2"><span className="text-gray-400">Standards:</span> <span className="text-white">{inc.standards}</span></div>
                    </div>
                    <div className="p-6 border-t border-white/10 grid md:grid-cols-2 gap-6">
                      <div><h4 className="text-amber-400 text-sm font-bold mb-2">Applications</h4><div className="flex flex-wrap gap-2">{inc.applications.map((app, i) => (<span key={i} className="px-2 py-1 bg-amber-500/10 text-amber-300 text-xs rounded">{app}</span>))}</div></div>
                      <div><h4 className="text-green-400 text-sm font-bold mb-2">Waste Types</h4><div className="flex flex-wrap gap-2">{inc.wasteTypes.map((wt, i) => (<span key={i} className="px-2 py-1 bg-green-500/10 text-green-300 text-xs rounded">{wt}</span>))}</div></div>
                    </div>
                    <div className="p-6 border-t border-white/10 bg-white/5">
                      <h4 className="text-cyan-400 text-sm font-bold mb-2">Features</h4>
                      <div className="flex flex-wrap gap-2">{inc.features.map((f, i) => (<span key={i} className="px-2 py-1 bg-cyan-500/10 text-cyan-300 text-xs rounded">{f}</span>))}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'components' && (
            <motion.div key="components" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Incinerator Components</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Detailed breakdown of all major incinerator components.</p>
              </div>
              <div className="space-y-4">
                {INCINERATOR_COMPONENTS.map((comp) => (
                  <div key={comp.name} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-white/10 overflow-hidden">
                    <button onClick={() => setExpandedComponent(expandedComponent === comp.name ? null : comp.name)} className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5">
                      <div><h3 className="text-lg font-bold text-white">{comp.name}</h3><p className="text-gray-400 text-sm mt-1">{comp.function}</p></div>
                      <span className={`text-orange-400 transition-transform ${expandedComponent === comp.name ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    <AnimatePresence>
                      {expandedComponent === comp.name && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-white/10">
                          <div className="p-6 grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-orange-400 font-bold mb-2">Description</h4>
                              <p className="text-gray-300 text-sm mb-4">{comp.description}</p>
                              <h4 className="text-green-400 font-bold mb-2">Maintenance Tips</h4>
                              <ul className="space-y-1">{comp.maintenance.map((tip, i) => (<li key={i} className="text-gray-300 text-sm flex items-start gap-2"><span className="text-green-400">•</span>{tip}</li>))}</ul>
                            </div>
                            <div className="bg-black/30 rounded-lg p-4">
                              <h4 className="text-amber-400 font-bold mb-2">Diagram</h4>
                              <pre className="text-orange-400 text-xs font-mono whitespace-pre overflow-x-auto">{comp.diagram}</pre>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'installation' && (
            <motion.div key="installation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Incinerator Installation Process</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Professional installation from EIA to commissioning.</p>
              </div>
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-red-500 to-green-500" />
                <div className="space-y-6">
                  {INSTALLATION_STEPS.map((step, index) => (
                    <motion.div key={step.phase} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="relative pl-20">
                      <div className="absolute left-4 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-lg">{step.icon}</div>
                      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-orange-500/30 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-bold text-white">{step.phase}</h3>
                          <span className="px-3 py-1 bg-orange-500/10 text-orange-400 text-sm rounded-full">{step.time}</span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-2">{step.tasks.map((task, i) => (<div key={i} className="flex items-start gap-2 text-gray-300 text-sm"><span className="text-green-400">✓</span>{task}</div>))}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'operation' && (
            <motion.div key="operation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Incinerator Operation Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Step-by-step operating procedures for safe and effective operation.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {OPERATION_GUIDE.map((phase) => (
                  <div key={phase.phase} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-green-500/30 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-green-400">{phase.phase}</h3>
                      <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded">{phase.time}</span>
                    </div>
                    <ol className="space-y-2">
                      {phase.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                          <span className="w-5 h-5 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center justify-center flex-shrink-0">{i + 1}</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'maintenance' && (
            <motion.div key="maintenance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Maintenance Schedule</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Regular maintenance ensures safe operation and compliance.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MAINTENANCE_SCHEDULE.map((schedule) => (
                  <div key={schedule.interval} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-amber-500/30 p-6">
                    <h3 className="text-xl font-bold text-amber-400 mb-2">{schedule.interval}</h3>
                    <p className="text-gray-500 text-sm mb-4">By: {schedule.responsible}</p>
                    <ul className="space-y-2 mb-4">{schedule.tasks.map((task, i) => (<li key={i} className="flex items-start gap-2 text-gray-300 text-sm"><span className="text-green-400">✓</span>{task}</li>))}</ul>
                    <p className="text-gray-500 text-xs border-t border-white/10 pt-4">Tools: {schedule.tools}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'emissions' && (
            <motion.div key="emissions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Emission Standards & Compliance</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">NEMA Kenya and WHO emission limits for incinerators.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left bg-gray-800/50">
                      <th className="py-4 px-4 text-gray-400 rounded-tl-lg">Parameter</th>
                      <th className="py-4 px-4 text-gray-400">NEMA Limit</th>
                      <th className="py-4 px-4 text-gray-400">WHO Guideline</th>
                      <th className="py-4 px-4 text-gray-400">Test Method</th>
                      <th className="py-4 px-4 text-gray-400 rounded-tr-lg">Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {EMISSION_STANDARDS.map((std, index) => (
                      <tr key={std.parameter} className={`border-b border-white/10 ${index % 2 === 0 ? 'bg-gray-900/30' : ''}`}>
                        <td className="py-4 px-4 text-white font-bold">{std.parameter}</td>
                        <td className="py-4 px-4 text-amber-400">{std.nemaLimit}</td>
                        <td className="py-4 px-4 text-green-400">{std.whoLimit}</td>
                        <td className="py-4 px-4 text-gray-300">{std.testMethod}</td>
                        <td className="py-4 px-4 text-gray-400">{std.frequency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-2xl p-8 border border-purple-500/30">
                <h3 className="text-xl font-bold text-purple-400 mb-4">Compliance Requirements</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-bold mb-2">Required Documentation</h4>
                    <ul className="space-y-2">{['Environmental Impact Assessment', 'NEMA Operating License', 'Annual Emission Test Certificate', 'Waste Management Plan', 'Operator Training Records'].map((doc, i) => (<li key={i} className="flex items-center gap-2 text-gray-300 text-sm"><span className="text-green-400">✓</span>{doc}</li>))}</ul>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-2">We Provide</h4>
                    <ul className="space-y-2">{['EIA preparation assistance', 'NEMA license application', 'Annual emission testing coordination', 'Compliance documentation', 'Regulatory updates'].map((svc, i) => (<li key={i} className="flex items-center gap-2 text-gray-300 text-sm"><span className="text-purple-400">→</span>{svc}</li>))}</ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'faults' && (
            <motion.div key="faults" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Troubleshooting Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Diagnose and solve common incinerator problems.</p>
              </div>
              <div className="space-y-4">
                {FAULT_DATABASE.map((fault) => (
                  <div key={fault.fault} className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border ${fault.urgency === 'high' ? 'border-red-500/30' : fault.urgency === 'medium' ? 'border-amber-500/30' : 'border-blue-500/30'} overflow-hidden`}>
                    <button onClick={() => setExpandedFault(expandedFault === fault.fault ? null : fault.fault)} className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5">
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 text-xs rounded ${fault.urgency === 'high' ? 'bg-red-500/20 text-red-400' : fault.urgency === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>{fault.urgency.toUpperCase()}</span>
                        <span className="text-white font-medium">{fault.fault}</span>
                      </div>
                      <span className="text-gray-400">▼</span>
                    </button>
                    <AnimatePresence>
                      {expandedFault === fault.fault && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-white/10 overflow-hidden">
                          <div className="p-6 space-y-4">
                            <div><h4 className="text-amber-400 font-bold mb-2">Possible Causes</h4><div className="flex flex-wrap gap-2">{fault.causes.map((c, i) => (<span key={i} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">{c}</span>))}</div></div>
                            <div><h4 className="text-blue-400 font-bold mb-2">Diagnostics</h4><ul className="space-y-1">{fault.diagnostics.map((d, i) => (<li key={i} className="text-gray-300 text-sm flex items-start gap-2"><span className="text-blue-400">•</span>{d}</li>))}</ul></div>
                            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"><h4 className="text-green-400 font-bold mb-2">Solution</h4><p className="text-gray-300 text-sm">{fault.solution}</p></div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'pricing' && (
            <motion.div key="pricing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Incinerator Pricing Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Estimated prices for incinerator supply and installation.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left bg-gray-800/50"><th className="py-4 px-4 text-gray-400 rounded-tl-lg">Capacity</th><th className="py-4 px-4 text-gray-400">Type</th><th className="py-4 px-4 text-gray-400">Chambers</th><th className="py-4 px-4 text-gray-400">Equipment</th><th className="py-4 px-4 text-gray-400">Installation</th><th className="py-4 px-4 text-gray-400 rounded-tr-lg">Application</th></tr></thead>
                  <tbody>{INCINERATOR_PRICING.map((row, index) => (<tr key={index} className={`border-b border-white/10 ${index % 2 === 0 ? 'bg-gray-900/30' : ''}`}><td className="py-4 px-4 text-white font-bold">{row.capacity}</td><td className="py-4 px-4 text-orange-400">{row.type}</td><td className="py-4 px-4 text-gray-300">{row.chambers}</td><td className="py-4 px-4 text-green-400">{row.price}</td><td className="py-4 px-4 text-amber-400">{row.installation}</td><td className="py-4 px-4 text-gray-400 text-xs">{row.application}</td></tr>))}</tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'shipping' && (
            <motion.div key="shipping" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Delivery & Installation</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">We deliver and install incinerators across Kenya and East Africa.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[{ name: 'Nairobi', ...SHIPPING_INFO.nairobi, regions: ['Nairobi Metro'] }, { name: 'Central Kenya', ...SHIPPING_INFO.centralKenya }, { name: 'Rift Valley', ...SHIPPING_INFO.riftValley }, { name: 'Western Kenya', ...SHIPPING_INFO.western }, { name: 'Coast Region', ...SHIPPING_INFO.coast }].map((region) => (
                  <div key={region.name} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-indigo-500/30 p-6">
                    <h3 className="text-lg font-bold text-indigo-400 mb-2">{region.name}</h3>
                    <p className="text-2xl font-bold text-white mb-3">{region.cost}</p>
                    <p className="text-gray-500 text-sm mb-3">Transit: {region.time}</p>
                    <div className="flex flex-wrap gap-2">{region.regions.map((r, i) => (<span key={i} className="px-2 py-1 bg-white/5 text-gray-400 text-xs rounded">{r}</span>))}</div>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-2xl p-8 border border-indigo-500/30">
                <h3 className="text-2xl font-bold text-indigo-400 mb-6">East Africa Delivery</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {SHIPPING_INFO.eastAfrica.countries.map((country) => (
                    <div key={country.country} className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-white font-bold">{country.country}</h4>
                      <p className="text-gray-400 text-sm">{country.cities}</p>
                      <div className="flex justify-between mt-2">
                        <span className="text-green-400">{country.cost}</span>
                        <span className="text-gray-500 text-sm">{country.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'warranty' && (
            <motion.div key="warranty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Warranty Information</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Comprehensive warranty coverage for your investment.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-teal-500/30 p-8">
                  <div className="text-center mb-6"><h3 className="text-2xl font-bold text-teal-400 mb-2">Standard Warranty</h3><p className="text-4xl font-bold text-white">{WARRANTY_INFO.standard.duration}</p></div>
                  <h4 className="text-gray-400 text-sm mb-3">Coverage:</h4>
                  <ul className="space-y-2 mb-6">{WARRANTY_INFO.standard.coverage.map((item, i) => (<li key={i} className="flex items-center gap-2 text-gray-300 text-sm"><span className="text-green-400">✓</span>{item}</li>))}</ul>
                  <h4 className="text-gray-400 text-sm mb-3">Conditions:</h4>
                  <ul className="space-y-2">{WARRANTY_INFO.standard.conditions.map((item, i) => (<li key={i} className="flex items-center gap-2 text-gray-400 text-sm"><span className="text-teal-400">•</span>{item}</li>))}</ul>
                </div>
                <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-2xl border border-emerald-500/30 p-8">
                  <div className="text-center mb-6"><span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">RECOMMENDED</span><h3 className="text-2xl font-bold text-emerald-400 mt-4 mb-2">Extended Warranty</h3><p className="text-4xl font-bold text-white">{WARRANTY_INFO.extended.duration}</p></div>
                  <h4 className="text-gray-400 text-sm mb-3">Coverage:</h4>
                  <ul className="space-y-2 mb-6">{WARRANTY_INFO.extended.coverage.map((item, i) => (<li key={i} className="flex items-center gap-2 text-gray-300 text-sm"><span className="text-green-400">✓</span>{item}</li>))}</ul>
                  <h4 className="text-gray-400 text-sm mb-3">Conditions:</h4>
                  <ul className="space-y-2">{WARRANTY_INFO.extended.conditions.map((item, i) => (<li key={i} className="flex items-center gap-2 text-gray-400 text-sm"><span className="text-emerald-400">•</span>{item}</li>))}</ul>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-2xl p-8 border border-red-500/30">
                <h3 className="text-xl font-bold text-red-400 mb-4">Warranty Exclusions</h3>
                <div className="grid md:grid-cols-2 gap-4">{WARRANTY_INFO.exclusions.map((item, i) => (<div key={i} className="flex items-center gap-2 text-gray-300 text-sm"><span className="text-red-400">✗</span>{item}</div>))}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-3xl p-8 md:p-12 border border-orange-500/30 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Incinerator Solutions?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">Complete incinerator supply, installation, and maintenance. Medical, industrial, and general waste. NEMA compliant. 12-24 months warranty.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <UnifiedCTA action="custom" href="https://wa.me/254722274914?text=Incinerator%20Quote%20Request" size="lg" label="Get Free Quote" />
            <UnifiedCTA action="custom" href="tel:+254722274914" variant="secondary" size="lg" label="Call Us Now" />
            <UnifiedCTA action="site-survey" variant="secondary" size="lg" label="Request Site Survey" />
          </div>
        </div>
      </section>
    </main>
  );
}
