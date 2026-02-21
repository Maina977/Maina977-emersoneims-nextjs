'use client';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * THE GENERAL SERVICES BIBLE - KENYA'S MOST COMPREHENSIVE MAINTENANCE GUIDE
 * Complete A-Z Guide for All Maintenance Services in Kenya
 * Borehole, Motors, AC, Electrical, Welding, Plumbing & More
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════════════════════
// COMPREHENSIVE SERVICE CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════
const SERVICE_CATEGORIES = {
  borehole: {
    id: 'borehole',
    name: 'Borehole & Water Pump Services',
    icon: '💧',
    color: 'blue',
    description: 'Complete borehole drilling, pump installation, repair, and maintenance services across Kenya. We handle submersible pumps, surface pumps, and jet pumps for depths from 10m to 500m+.',
    stats: { projects: '2,500+', depth: '500m Max', brands: '25+' },
    services: [
      {
        name: 'Borehole Drilling',
        description: 'Professional borehole drilling using modern rotary and DTH (Down-The-Hole) hammer techniques. We conduct geological surveys, hydro-geological assessments, and yield testing to ensure optimal water production.',
        priceRange: 'KES 3,500 - 8,000 per meter',
        duration: '3-14 days depending on depth',
        includes: ['Site survey', 'Geological assessment', 'Drilling', 'Casing installation', 'Gravel packing', 'Test pumping', '1-year warranty'],
        process: [
          'Initial site assessment and geological survey',
          'Hydro-geological mapping to identify aquifers',
          'Drilling rig mobilization and setup',
          'Rotary or DTH drilling to target depth',
          'Casing installation (PVC or steel)',
          'Gravel pack installation',
          'Well development and cleaning',
          '24-72 hour pump test',
          'Water quality testing',
          'Final commissioning and handover'
        ]
      },
      {
        name: 'Submersible Pump Installation',
        description: 'Installation of submersible pumps for boreholes. We supply and install pumps from leading brands including Grundfos, DAB, Pedrollo, Franklin Electric, and Wilo.',
        priceRange: 'KES 45,000 - 350,000',
        duration: '1-2 days',
        includes: ['Pump supply', 'Drop pipes', 'Safety rope', 'Control panel', 'Cables', 'Installation', 'Testing', '1-year warranty'],
        brands: ['Grundfos SP', 'DAB S4', 'Pedrollo 4SR', 'Franklin Electric', 'Wilo Sub-TWU', 'Saer MS', 'Ebara', 'Lowara']
      },
      {
        name: 'Pump Repair & Overhaul',
        description: 'Complete repair and overhaul of all pump types. We diagnose issues using vibration analysis, motor testing, and performance curves.',
        priceRange: 'KES 8,000 - 65,000',
        duration: '1-5 days',
        includes: ['Diagnosis', 'Parts replacement', 'Impeller repair', 'Motor overhaul', 'Bearing replacement', 'Testing'],
        commonIssues: ['Low yield', 'Motor burnout', 'Impeller wear', 'Sand damage', 'Cable fault', 'Control panel failure']
      },
      {
        name: 'Solar-Powered Pumping Systems',
        description: 'Complete solar water pumping solutions for areas without grid power. Includes solar panels, inverter, pump, and storage tank.',
        priceRange: 'KES 180,000 - 1,200,000',
        duration: '3-7 days',
        includes: ['Solar panels', 'Mounting structure', 'VFD/Inverter', 'Submersible pump', 'Storage tank', 'Piping', 'Installation', '5-year warranty']
      }
    ],
    faq: [
      { q: 'How deep can you drill?', a: 'We can drill up to 500 meters using DTH hammer technology. Most boreholes in Kenya are between 80-200 meters deep.' },
      { q: 'How long does a borehole last?', a: 'A well-constructed borehole lasts 30-50 years. The pump typically needs replacement every 8-15 years depending on usage and water quality.' },
      { q: 'What affects drilling cost?', a: 'Depth, rock formation, accessibility, casing type (PVC vs steel), and location. Rocky areas cost more than sandy soils.' },
      { q: 'How do I know if there is water?', a: 'We conduct geophysical surveys using resistivity methods to map underground water. Success rate in Kenya is above 85%.' }
    ],
    troubleshooting: [
      { problem: 'Pump not starting', causes: ['Power supply issue', 'Tripped overload', 'Burnt motor', 'Control panel fault'], solutions: ['Check power supply', 'Reset overload', 'Test motor windings', 'Inspect control panel'] },
      { problem: 'Low water yield', causes: ['Dropping water table', 'Blocked screen', 'Worn impeller', 'Air lock'], solutions: ['Lower pump setting', 'Clean screen', 'Replace impeller', 'Bleed air'] },
      { problem: 'Pump cycling on/off', causes: ['Pressure switch issue', 'Small pressure tank', 'Leak in system', 'Check valve failure'], solutions: ['Adjust pressure switch', 'Install larger tank', 'Fix leaks', 'Replace check valve'] },
      { problem: 'Dirty/sandy water', causes: ['Screen damage', 'Over-pumping', 'Borehole collapse', 'New borehole settling'], solutions: ['Inspect screen', 'Reduce pumping rate', 'Re-develop borehole', 'Allow settling'] }
    ]
  },
  motors: {
    id: 'motors',
    name: 'Electric Motor Rewinding & Repair',
    icon: '⚙️',
    color: 'green',
    description: 'Professional electric motor rewinding and repair services for industrial, commercial, and residential motors. We handle single-phase, three-phase, AC and DC motors from 0.25 HP to 500 HP.',
    stats: { motors: '5,000+', capacity: '500HP Max', brands: '40+' },
    services: [
      {
        name: 'Motor Rewinding',
        description: 'Complete stator and rotor rewinding using high-quality copper wire and Class F/H insulation. We maintain original specifications for optimal performance.',
        priceRange: 'KES 3,500 - 250,000',
        duration: '1-7 days',
        includes: ['Winding removal', 'Core inspection', 'New copper winding', 'Insulation', 'VPI treatment', 'Balancing', 'Testing'],
        process: [
          'Motor disassembly and inspection',
          'Winding data recording (turns, gauge, connection)',
          'Old winding removal (burnout or chemical strip)',
          'Core testing (loss test, insulation resistance)',
          'Coil winding on forms',
          'Coil insertion into slots',
          'Connection and lacing',
          'VPI (Vacuum Pressure Impregnation)',
          'Baking/curing',
          'Final testing (resistance, insulation, no-load, full-load)'
        ]
      },
      {
        name: 'Bearing Replacement',
        description: 'Replacement of motor bearings with OEM-quality parts from SKF, FAG, NSK, NTN, and Timken.',
        priceRange: 'KES 2,500 - 45,000',
        duration: '4-24 hours',
        includes: ['Bearing removal', 'Shaft inspection', 'New bearings', 'Greasing', 'Assembly', 'Testing']
      },
      {
        name: 'Motor Shaft Repair',
        description: 'Repair of worn, damaged, or broken motor shafts using metal spray, welding, or sleeve installation.',
        priceRange: 'KES 8,000 - 85,000',
        duration: '2-5 days',
        includes: ['Shaft removal', 'Machining', 'Metal spray/welding', 'Grinding', 'Polishing', 'Balancing']
      },
      {
        name: 'VFD/Inverter Installation',
        description: 'Variable Frequency Drive installation for motor speed control, soft starting, and energy savings.',
        priceRange: 'KES 25,000 - 500,000',
        duration: '1-3 days',
        includes: ['VFD supply', 'Panel fabrication', 'Wiring', 'Programming', 'Testing', 'Training'],
        brands: ['ABB', 'Siemens', 'Danfoss', 'Schneider Altivar', 'WEG', 'Fuji', 'Mitsubishi', 'Delta']
      }
    ],
    motorTypes: [
      { type: 'Induction Motors (AC)', description: 'Squirrel cage and wound rotor types', sizes: '0.5 HP - 500 HP' },
      { type: 'Synchronous Motors', description: 'For high-efficiency applications', sizes: '50 HP - 1000 HP' },
      { type: 'DC Motors', description: 'Shunt, series, and compound wound', sizes: '0.5 HP - 200 HP' },
      { type: 'Servo Motors', description: 'For precise positioning applications', sizes: '100W - 50 kW' },
      { type: 'Submersible Motors', description: 'Water-filled and oil-filled designs', sizes: '0.5 HP - 150 HP' },
      { type: 'Explosion-Proof Motors', description: 'ATEX/IECEx certified for hazardous areas', sizes: '1 HP - 300 HP' }
    ],
    troubleshooting: [
      { problem: 'Motor overheating', causes: ['Overload', 'Poor ventilation', 'Voltage imbalance', 'Bearing failure', 'Winding fault'], solutions: ['Reduce load', 'Clean cooling fins', 'Check voltage', 'Replace bearings', 'Rewind motor'] },
      { problem: 'Motor vibrating', causes: ['Unbalanced rotor', 'Misalignment', 'Loose foundation', 'Bearing wear', 'Bent shaft'], solutions: ['Balance rotor', 'Realign coupling', 'Tighten bolts', 'Replace bearings', 'Repair/replace shaft'] },
      { problem: 'Motor not starting', causes: ['No power', 'Blown fuse', 'Overload tripped', 'Open winding', 'Jammed rotor'], solutions: ['Check power supply', 'Replace fuse', 'Reset overload', 'Rewind motor', 'Free rotor'] },
      { problem: 'Motor humming but not running', causes: ['Single phasing', 'Stuck rotor', 'Low voltage', 'Capacitor fault (single-phase)'], solutions: ['Check all phases', 'Free rotor', 'Check voltage', 'Replace capacitor'] },
      { problem: 'Excessive noise', causes: ['Bearing wear', 'Loose parts', 'Electrical noise', 'Coupling misalignment'], solutions: ['Replace bearings', 'Tighten components', 'Check windings', 'Realign coupling'] }
    ],
    faq: [
      { q: 'How long does motor rewinding take?', a: 'Small motors (under 10 HP) take 1-2 days. Large motors (over 50 HP) take 5-7 days including VPI treatment and testing.' },
      { q: 'Is rewinding better than buying new?', a: 'For motors over 5 HP, rewinding is typically 40-60% the cost of new. Well-rewound motors perform as good as new.' },
      { q: 'What causes motor failure?', a: 'Main causes are: Overheating (35%), Bearing failure (30%), Contamination (20%), Electrical faults (15%).' },
      { q: 'How often should motors be serviced?', a: 'Light duty: annually. Heavy duty: every 6 months. Critical applications: quarterly with vibration analysis.' }
    ]
  },
  ac: {
    id: 'ac',
    name: 'Air Conditioning & Refrigeration',
    icon: '❄️',
    color: 'cyan',
    description: 'Complete air conditioning installation, repair, and maintenance services. We handle split ACs, cassette units, ducted systems, VRF/VRV systems, chillers, and cold rooms.',
    stats: { installations: '3,500+', brands: '30+', capacity: '1000 TR' },
    services: [
      {
        name: 'Split AC Installation',
        description: 'Professional installation of wall-mounted, floor-standing, and ceiling-mounted split air conditioners.',
        priceRange: 'KES 8,000 - 25,000',
        duration: '4-8 hours',
        includes: ['Mounting brackets', 'Piping (up to 5m)', 'Drainage', 'Electrical connection', 'Gas charging', 'Testing'],
        brands: ['LG', 'Samsung', 'Daikin', 'Carrier', 'Midea', 'Hisense', 'TCL', 'Panasonic', 'Haier', 'General']
      },
      {
        name: 'Ducted AC Systems',
        description: 'Design and installation of centralized ducted air conditioning for offices, hotels, and large residences.',
        priceRange: 'KES 350,000 - 5,000,000',
        duration: '5-30 days',
        includes: ['System design', 'Ductwork fabrication', 'Unit installation', 'Grille installation', 'Insulation', 'Commissioning'],
        applications: ['Office buildings', 'Hotels', 'Hospitals', 'Shopping malls', 'Factories']
      },
      {
        name: 'VRF/VRV Systems',
        description: 'Variable Refrigerant Flow systems for large buildings with multiple indoor units.',
        priceRange: 'KES 1,500,000 - 25,000,000',
        duration: '2-8 weeks',
        brands: ['Daikin VRV', 'Mitsubishi City Multi', 'LG Multi V', 'Samsung DVM', 'Carrier XCT'],
        includes: ['System design', 'Outdoor units', 'Indoor units', 'Piping', 'Controls', 'Commissioning']
      },
      {
        name: 'AC Repair & Maintenance',
        description: 'Comprehensive repair services including compressor replacement, gas charging, PCB repair, and preventive maintenance.',
        priceRange: 'KES 2,500 - 150,000',
        duration: '2-48 hours',
        commonRepairs: ['Gas recharging', 'Compressor replacement', 'PCB/Control board repair', 'Fan motor replacement', 'Capacitor replacement', 'Coil cleaning']
      },
      {
        name: 'Cold Room Installation',
        description: 'Design and installation of walk-in coolers and freezers for commercial and industrial applications.',
        priceRange: 'KES 450,000 - 8,000,000',
        duration: '2-6 weeks',
        includes: ['Room design', 'Panel installation', 'Refrigeration unit', 'Shelving', 'Temperature controls', 'Commissioning'],
        applications: ['Supermarkets', 'Restaurants', 'Hotels', 'Hospitals', 'Pharmaceutical', 'Meat processing']
      }
    ],
    refrigerantTypes: [
      { type: 'R-410A', description: 'Standard for modern residential ACs', gwp: '2088', status: 'Current standard' },
      { type: 'R-32', description: 'Lower GWP alternative to R-410A', gwp: '675', status: 'Growing adoption' },
      { type: 'R-22', description: 'Legacy refrigerant, being phased out', gwp: '1810', status: 'Phase-out by 2030' },
      { type: 'R-134a', description: 'Automotive and small refrigeration', gwp: '1430', status: 'Being replaced' },
      { type: 'R-404A', description: 'Commercial refrigeration', gwp: '3922', status: 'Being replaced by R-448A' },
      { type: 'R-290 (Propane)', description: 'Natural refrigerant, low GWP', gwp: '3', status: 'Growing adoption' }
    ],
    troubleshooting: [
      { problem: 'AC not cooling', causes: ['Low gas', 'Dirty filters', 'Blocked condenser', 'Faulty compressor', 'Thermostat issue'], solutions: ['Recharge gas', 'Clean/replace filters', 'Clean condenser coils', 'Replace compressor', 'Calibrate/replace thermostat'] },
      { problem: 'AC leaking water', causes: ['Blocked drain', 'Frozen coils', 'Improper installation', 'Cracked drain pan'], solutions: ['Clear drain line', 'Check refrigerant level', 'Re-level unit', 'Replace drain pan'] },
      { problem: 'Compressor not starting', causes: ['Capacitor failure', 'Compressor burnout', 'Overload tripped', 'Low voltage'], solutions: ['Replace capacitor', 'Replace compressor', 'Reset/replace overload', 'Check power supply'] },
      { problem: 'AC making noise', causes: ['Loose fan blade', 'Worn bearing', 'Compressor issue', 'Debris in unit'], solutions: ['Tighten/replace blade', 'Replace bearing', 'Check compressor', 'Clean unit'] },
      { problem: 'Remote not working', causes: ['Dead batteries', 'IR sensor blocked', 'Faulty remote', 'PCB issue'], solutions: ['Replace batteries', 'Clean sensor', 'Replace remote', 'Check PCB'] }
    ],
    maintenanceSchedule: [
      { task: 'Filter cleaning/replacement', frequency: 'Monthly', importance: 'High' },
      { task: 'Coil cleaning (indoor)', frequency: 'Quarterly', importance: 'High' },
      { task: 'Coil cleaning (outdoor)', frequency: 'Quarterly', importance: 'High' },
      { task: 'Drain line cleaning', frequency: 'Quarterly', importance: 'Medium' },
      { task: 'Refrigerant level check', frequency: 'Annually', importance: 'High' },
      { task: 'Electrical connections check', frequency: 'Annually', importance: 'High' },
      { task: 'Compressor performance test', frequency: 'Annually', importance: 'Medium' },
      { task: 'Thermostat calibration', frequency: 'Annually', importance: 'Low' }
    ],
    faq: [
      { q: 'What size AC do I need?', a: 'Calculate based on room size: 1 ton per 150-200 sq ft in Kenya climate. Factor in sun exposure, number of occupants, and heat-generating equipment.' },
      { q: 'How often should I service my AC?', a: 'Residential: every 3-6 months. Commercial: monthly. Filter cleaning should be done monthly.' },
      { q: 'Which brand is best in Kenya?', a: 'LG, Samsung, and Daikin are most reliable with readily available parts. Carrier is excellent for commercial applications.' },
      { q: 'How long does an AC last?', a: 'With proper maintenance, 10-15 years. Compressors typically last 8-12 years.' }
    ]
  },
  electrical: {
    id: 'electrical',
    name: 'Electrical Installation & Repair',
    icon: '⚡',
    color: 'yellow',
    description: 'Complete electrical services for residential, commercial, and industrial applications. From house wiring to industrial power distribution, earthing systems to lightning protection.',
    stats: { projects: '4,000+', capacity: '11kV Max', certified: 'ERC Licensed' },
    services: [
      {
        name: 'House Wiring & Rewiring',
        description: 'New electrical installations and rewiring for residential properties following KEBS and IEE standards.',
        priceRange: 'KES 1,500 - 3,500 per point',
        duration: '2-7 days',
        includes: ['Conduit/trunking', 'Cables', 'Switches', 'Sockets', 'Distribution board', 'Testing', 'Compliance certificate'],
        standards: ['BS 7671', 'KEBS KS IEC 60364', 'Kenya Electrical Installation Regulations']
      },
      {
        name: 'Industrial Power Distribution',
        description: 'Design and installation of industrial power systems including HV/LV switchgear, transformers, and motor control centers.',
        priceRange: 'KES 500,000 - 50,000,000',
        duration: '2-12 weeks',
        includes: ['System design', 'Switchgear supply', 'Installation', 'Cabling', 'Testing', 'Commissioning'],
        components: ['Main switchboard', 'Distribution boards', 'Motor control centers', 'Capacitor banks', 'UPS systems', 'Standby generators']
      },
      {
        name: 'Power Factor Correction',
        description: 'Installation of capacitor banks to improve power factor and reduce electricity bills.',
        priceRange: 'KES 150,000 - 2,500,000',
        duration: '3-10 days',
        includes: ['Power quality analysis', 'Capacitor bank design', 'Supply and installation', 'APFC controller', 'Commissioning'],
        benefits: ['Up to 30% bill reduction', 'Reduced KPLC penalties', 'Improved voltage', 'Reduced losses']
      },
      {
        name: 'Earthing & Lightning Protection',
        description: 'Design and installation of earthing systems and lightning protection for buildings and equipment.',
        priceRange: 'KES 25,000 - 500,000',
        duration: '2-7 days',
        includes: ['Soil resistivity testing', 'Earth electrode installation', 'Lightning arresters', 'SPD installation', 'Testing & certification'],
        types: ['Conventional rods', 'Chemical earthing', 'Plate earthing', 'ESE lightning protection', 'Faraday cage']
      },
      {
        name: 'Solar Power Installation',
        description: 'Grid-tie, off-grid, and hybrid solar power systems for homes and businesses.',
        priceRange: 'KES 150,000 - 25,000,000',
        duration: '3-21 days',
        includes: ['Site assessment', 'System design', 'Panels', 'Inverter', 'Batteries (if applicable)', 'Installation', 'EPRA licensing'],
        sizes: ['1-5 kW (Residential)', '10-50 kW (Commercial)', '100+ kW (Industrial)']
      }
    ],
    safetyTips: [
      'Never work on live circuits - always isolate power before any work',
      'Use appropriate PPE - insulated gloves, safety shoes, eye protection',
      'Test before touch - always verify circuits are de-energized',
      'Maintain proper clearances around electrical equipment',
      'Never overload circuits or bypass safety devices',
      'Regular inspection of electrical installations (annually)',
      'Keep electrical panels accessible and labeled',
      'Report any electrical faults immediately to qualified electricians'
    ],
    troubleshooting: [
      { problem: 'Frequent tripping', causes: ['Overloaded circuit', 'Short circuit', 'Earth fault', 'Faulty breaker'], solutions: ['Reduce load', 'Check for shorts', 'Test insulation', 'Replace breaker'] },
      { problem: 'Flickering lights', causes: ['Loose connection', 'Voltage fluctuation', 'Faulty switch', 'Overloaded circuit'], solutions: ['Tighten connections', 'Install stabilizer', 'Replace switch', 'Balance loads'] },
      { problem: 'High electricity bills', causes: ['Old appliances', 'Poor power factor', 'Faulty meter', 'Earth leakage'], solutions: ['Replace with efficient appliances', 'Install capacitors', 'Request meter test', 'Fix insulation'] },
      { problem: 'Electric shock from appliances', causes: ['Faulty earthing', 'Damaged insulation', 'Water contact', 'Phase-earth fault'], solutions: ['Check earthing', 'Repair insulation', 'Install ELCB/RCCB', 'Call electrician immediately'] }
    ],
    faq: [
      { q: 'Do I need an ERC license for home wiring?', a: 'No, but you need a licensed electrical contractor. After completion, request an Electrical Installation Certificate for KPLC connection.' },
      { q: 'What wire size for AC units?', a: '1 ton AC: 2.5mm². 2 ton AC: 4mm². Always use dedicated circuit with proper breaker rating.' },
      { q: 'How often should I test my earthing?', a: 'Annually for residential, bi-annually for industrial. Target resistance: <5 ohms for general, <2 ohms for sensitive equipment.' },
      { q: 'What causes high KPLC bills?', a: 'Common causes: Poor power factor (penalties), old appliances, earth leakage, heating elements, and faulty meters.' }
    ]
  },
  welding: {
    id: 'welding',
    name: 'Welding & Steel Fabrication',
    icon: '🔥',
    color: 'red',
    description: 'Professional welding and metal fabrication services. We handle structural steel, gates, grills, tanks, machinery repairs, and custom fabrication projects.',
    stats: { projects: '3,000+', capacity: '50mm Steel', certified: 'AWS Certified' },
    services: [
      {
        name: 'Structural Steel Fabrication',
        description: 'Fabrication and erection of steel structures including warehouses, factories, roofing, and mezzanines.',
        priceRange: 'KES 15,000 - 25,000 per ton',
        duration: '1-12 weeks',
        includes: ['Design/detailing', 'Material supply', 'Fabrication', 'Surface treatment', 'Erection', 'Bolting/welding'],
        applications: ['Warehouses', 'Factories', 'Sheds', 'Canopies', 'Mezzanine floors', 'Bridges']
      },
      {
        name: 'Gates & Grills',
        description: 'Custom design and fabrication of security gates, grills, burglar proofing, and decorative metalwork.',
        priceRange: 'KES 3,500 - 25,000 per m²',
        duration: '3-14 days',
        includes: ['Design', 'Material', 'Fabrication', 'Finishing', 'Installation'],
        types: ['Sliding gates', 'Swing gates', 'Roller shutters', 'Burglar bars', 'Balcony rails', 'Staircases']
      },
      {
        name: 'Tank Fabrication',
        description: 'Fabrication of water tanks, fuel tanks, pressure vessels, and storage tanks.',
        priceRange: 'KES 85,000 - 5,000,000',
        duration: '1-8 weeks',
        includes: ['Design', 'Material procurement', 'Fabrication', 'Testing', 'Coating', 'Installation'],
        types: ['Water storage tanks', 'Fuel tanks', 'Chemical tanks', 'Pressure vessels', 'Process tanks']
      },
      {
        name: 'Repair & Maintenance Welding',
        description: 'On-site and workshop repair welding for machinery, vehicles, equipment, and structures.',
        priceRange: 'KES 1,500 - 150,000',
        duration: '2 hours - 5 days',
        includes: ['Assessment', 'Welding', 'Grinding', 'Testing', 'Surface treatment'],
        capabilities: ['Crack repair', 'Build-up welding', 'Hard facing', 'Stainless steel', 'Aluminum', 'Cast iron']
      }
    ],
    weldingProcesses: [
      { process: 'SMAW (Stick/Arc)', description: 'Most versatile, good for field work and repairs', materials: 'Carbon steel, stainless, cast iron', thickness: '3-50mm' },
      { process: 'MIG/GMAW', description: 'High productivity, clean welds, easy to learn', materials: 'Carbon steel, stainless, aluminum', thickness: '0.6-25mm' },
      { process: 'TIG/GTAW', description: 'Highest quality welds, good for thin materials', materials: 'All metals including titanium', thickness: '0.5-6mm' },
      { process: 'Flux-Cored (FCAW)', description: 'High deposition rate, good for outdoor work', materials: 'Carbon steel, stainless', thickness: '3-40mm' },
      { process: 'Oxy-Acetylene', description: 'Cutting, brazing, and heating', materials: 'Carbon steel, copper, brass', thickness: '0.5-25mm' }
    ],
    troubleshooting: [
      { problem: 'Porosity in welds', causes: ['Contaminated base metal', 'Wet electrodes', 'Improper gas coverage', 'Wrong technique'], solutions: ['Clean metal properly', 'Dry electrodes', 'Check gas flow', 'Adjust technique'] },
      { problem: 'Cracking', causes: ['High carbon content', 'Rapid cooling', 'Hydrogen embrittlement', 'Wrong electrode'], solutions: ['Preheat', 'Slow cooling', 'Use low-H electrodes', 'Select proper filler'] },
      { problem: 'Lack of fusion', causes: ['Low heat input', 'Wrong angle', 'Travel too fast', 'Oxide layer'], solutions: ['Increase current', 'Correct angle', 'Slow down', 'Clean thoroughly'] },
      { problem: 'Spatter', causes: ['Current too high', 'Arc too long', 'Wrong polarity', 'Moisture'], solutions: ['Reduce current', 'Shorten arc', 'Check polarity', 'Dry materials'] }
    ],
    faq: [
      { q: 'What type of welding is strongest?', a: 'When done correctly, TIG produces the highest quality welds. For structural work, properly executed SMAW or MIG/FCAW is more than adequate.' },
      { q: 'Can you weld aluminum?', a: 'Yes, we use TIG or specialized MIG for aluminum. It requires special techniques and filler metals.' },
      { q: 'How long do welds last?', a: 'Quality structural welds can last the lifetime of the structure (50+ years) with proper corrosion protection.' },
      { q: 'Do you offer on-site welding?', a: 'Yes, we have mobile welding units with generators for on-site repairs across Kenya.' }
    ]
  },
  plumbing: {
    id: 'plumbing',
    name: 'Plumbing & Water Systems',
    icon: '🚿',
    color: 'teal',
    description: 'Complete plumbing solutions for residential, commercial, and industrial applications. From pipe installation to water treatment, drainage systems to hot water systems.',
    stats: { projects: '2,800+', capacity: '8" Pipes', certified: 'NWWDA Licensed' },
    services: [
      {
        name: 'Water Supply Installation',
        description: 'Complete water supply systems including pipe installation, tank installation, and pressure boosting.',
        priceRange: 'KES 15,000 - 500,000',
        duration: '1-14 days',
        includes: ['Design', 'Materials', 'Pipe installation', 'Tank installation', 'Pump installation', 'Testing'],
        materials: ['PPR pipes', 'HDPE pipes', 'GI pipes', 'PVC pipes', 'Copper pipes']
      },
      {
        name: 'Drainage & Sewerage',
        description: 'Installation and repair of drainage systems, septic tanks, and sewer connections.',
        priceRange: 'KES 25,000 - 800,000',
        duration: '3-21 days',
        includes: ['Design', 'Excavation', 'Pipe laying', 'Manhole construction', 'Backfilling', 'Testing'],
        types: ['Gravity drainage', 'Pump-based systems', 'Septic tanks', 'Bio-digesters', 'Soak pits']
      },
      {
        name: 'Hot Water Systems',
        description: 'Installation of solar water heaters, electric geysers, heat pumps, and instant water heaters.',
        priceRange: 'KES 35,000 - 350,000',
        duration: '1-5 days',
        includes: ['Unit supply', 'Mounting', 'Piping', 'Insulation', 'Electrical connection', 'Testing'],
        types: ['Solar water heaters', 'Electric geysers', 'Heat pump water heaters', 'Instant heaters', 'Central hot water systems']
      },
      {
        name: 'Water Treatment',
        description: 'Installation of water treatment systems for borehole water, harvested rainwater, and municipal supply.',
        priceRange: 'KES 25,000 - 2,500,000',
        duration: '2-14 days',
        includes: ['Water testing', 'System design', 'Equipment supply', 'Installation', 'Commissioning'],
        technologies: ['Sediment filtration', 'Activated carbon', 'UV sterilization', 'Reverse osmosis', 'Water softening', 'Iron removal']
      }
    ],
    pipeTypes: [
      { type: 'PPR (Polypropylene Random)', use: 'Hot and cold water supply', lifespan: '50+ years', advantages: 'Heat-fusible joints, no leaks, food-grade' },
      { type: 'HDPE', use: 'Underground water mains, irrigation', lifespan: '50+ years', advantages: 'Flexible, corrosion resistant, large diameters' },
      { type: 'PVC', use: 'Drainage, cold water, conduits', lifespan: '25-40 years', advantages: 'Affordable, easy to install, chemical resistant' },
      { type: 'GI (Galvanized Iron)', use: 'Water supply, structural', lifespan: '20-30 years', advantages: 'Strong, fire resistant, code compliant' },
      { type: 'Copper', use: 'Hot water, medical gas, premium installations', lifespan: '50+ years', advantages: 'Antimicrobial, premium quality, recyclable' }
    ],
    troubleshooting: [
      { problem: 'Low water pressure', causes: ['Blocked pipes', 'Undersized pipes', 'Valve not fully open', 'Water main issue'], solutions: ['Clean/replace pipes', 'Upgrade pipe size', 'Check all valves', 'Contact utility'] },
      { problem: 'Water hammer', causes: ['Quick-closing valves', 'High pressure', 'Air in pipes', 'Loose pipes'], solutions: ['Install arrestors', 'Install PRV', 'Bleed air', 'Secure pipes'] },
      { problem: 'Blocked drain', causes: ['Grease buildup', 'Hair/debris', 'Foreign objects', 'Tree roots'], solutions: ['Use drain cleaner', 'Snake the drain', 'Remove objects', 'Cut roots, repair pipe'] },
      { problem: 'Leaking tap', causes: ['Worn washer', 'Damaged seat', 'O-ring failure', 'Cartridge damage'], solutions: ['Replace washer', 'Resurface seat', 'Replace O-ring', 'Replace cartridge'] },
      { problem: 'No hot water', causes: ['Heating element failure', 'Thermostat fault', 'No power', 'Scale buildup'], solutions: ['Replace element', 'Replace thermostat', 'Check power', 'Descale tank'] }
    ],
    faq: [
      { q: 'What pipe is best for hot water?', a: 'PPR is best for hot water - rated to 95°C, no corrosion, fusion-welded joints. Copper is premium alternative.' },
      { q: 'How often should septic tanks be emptied?', a: 'Every 2-3 years for average household. More frequently for larger families or smaller tanks.' },
      { q: 'Can you install rainwater harvesting?', a: 'Yes, we design and install complete systems including gutters, first-flush diverters, filters, storage tanks, and pumps.' },
      { q: 'What causes pipes to burst?', a: 'Main causes: Freezing (in cold areas), water hammer, corrosion, ground movement, and poor installation.' }
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// KENYA SERVICE AREAS - ALL 47 COUNTIES
// ═══════════════════════════════════════════════════════════════════════════════
const KENYA_SERVICE_AREAS = [
  { county: 'Nairobi', towns: ['Westlands', 'Karen', 'Kilimani', 'Industrial Area', 'Kasarani', 'Eastleigh', 'Embakasi', 'Langata'], response: '2-4 hours' },
  { county: 'Mombasa', towns: ['Nyali', 'Bamburi', 'Likoni', 'Port Reitz', 'Changamwe', 'Kisauni'], response: '2-6 hours' },
  { county: 'Kisumu', towns: ['Milimani', 'Kondele', 'Nyalenda', 'Mamboleo', 'Ahero'], response: '4-8 hours' },
  { county: 'Nakuru', towns: ['Nakuru Town', 'Naivasha', 'Gilgil', 'Molo', 'Njoro'], response: '3-6 hours' },
  { county: 'Kiambu', towns: ['Thika', 'Ruiru', 'Juja', 'Limuru', 'Kikuyu', 'Gatundu'], response: '2-4 hours' },
  { county: 'Machakos', towns: ['Machakos Town', 'Athi River', 'Mlolongo', 'Kangundo', 'Tala'], response: '2-4 hours' },
  { county: 'Kajiado', towns: ['Kitengela', 'Ongata Rongai', 'Ngong', 'Kiserian', 'Namanga'], response: '2-4 hours' },
  { county: 'Uasin Gishu', towns: ['Eldoret', 'Burnt Forest', 'Turbo', 'Ziwa', 'Moiben'], response: '6-12 hours' },
  { county: 'Meru', towns: ['Meru Town', 'Nkubu', 'Maua', 'Chogoria'], response: '4-8 hours' },
  { county: 'Kilifi', towns: ['Kilifi Town', 'Malindi', 'Watamu', 'Mtwapa', 'Mariakani'], response: '4-8 hours' },
  { county: 'Nyeri', towns: ['Nyeri Town', 'Karatina', 'Othaya', 'Mukurweini'], response: '3-6 hours' },
  { county: 'Kakamega', towns: ['Kakamega Town', 'Mumias', 'Butere', 'Malava'], response: '8-12 hours' },
  { county: 'Embu', towns: ['Embu Town', 'Runyenjes', 'Siakago'], response: '3-6 hours' },
  { county: 'Kisii', towns: ['Kisii Town', 'Keroka', 'Ogembo', 'Suneka'], response: '6-10 hours' },
  { county: 'Nyandarua', towns: ['Ol Kalou', 'Engineer', 'Njabini', 'Nyahururu'], response: '4-6 hours' },
  { county: 'Laikipia', towns: ['Nanyuki', 'Rumuruti', 'Nyahururu'], response: '4-8 hours' },
  { county: 'Trans Nzoia', towns: ['Kitale', 'Endebess', 'Saboti'], response: '8-12 hours' },
  { county: 'Bungoma', towns: ['Bungoma Town', 'Webuye', 'Kimilili', 'Chwele'], response: '8-12 hours' },
  { county: 'Kericho', towns: ['Kericho Town', 'Litein', 'Londiani'], response: '5-8 hours' },
  { county: 'Bomet', towns: ['Bomet Town', 'Sotik', 'Mulot'], response: '6-10 hours' },
  { county: 'Narok', towns: ['Narok Town', 'Kilgoris', 'Maasai Mara'], response: '5-8 hours' },
  { county: 'Migori', towns: ['Migori Town', 'Rongo', 'Awendo', 'Isebania'], response: '8-12 hours' },
  { county: 'Homa Bay', towns: ['Homa Bay Town', 'Oyugis', 'Kendu Bay', 'Mbita'], response: '8-12 hours' },
  { county: 'Siaya', towns: ['Siaya Town', 'Bondo', 'Ugunja', 'Usenge'], response: '8-12 hours' },
  { county: 'Vihiga', towns: ['Mbale', 'Luanda', 'Majengo'], response: '8-12 hours' },
  { county: 'Nandi', towns: ['Kapsabet', 'Nandi Hills', 'Mosoriot'], response: '6-10 hours' },
  { county: 'Baringo', towns: ['Kabarnet', 'Eldama Ravine', 'Marigat'], response: '6-10 hours' },
  { county: 'Elgeyo Marakwet', towns: ['Iten', 'Kapsowar', 'Tambach'], response: '8-12 hours' },
  { county: 'West Pokot', towns: ['Kapenguria', 'Makutano', 'Chepareria'], response: '10-16 hours' },
  { county: 'Turkana', towns: ['Lodwar', 'Kakuma', 'Lokichoggio'], response: '24-48 hours' },
  { county: 'Samburu', towns: ['Maralal', 'Archer\'s Post', 'Wamba'], response: '12-24 hours' },
  { county: 'Isiolo', towns: ['Isiolo Town', 'Garbatulla', 'Merti'], response: '6-12 hours' },
  { county: 'Marsabit', towns: ['Marsabit Town', 'Moyale', 'Laisamis'], response: '24-48 hours' },
  { county: 'Mandera', towns: ['Mandera Town', 'Elwak', 'Takaba'], response: '48+ hours' },
  { county: 'Wajir', towns: ['Wajir Town', 'Habaswein', 'Bute'], response: '36-48 hours' },
  { county: 'Garissa', towns: ['Garissa Town', 'Dadaab', 'Ijara'], response: '12-24 hours' },
  { county: 'Tana River', towns: ['Hola', 'Garsen', 'Bura'], response: '12-24 hours' },
  { county: 'Lamu', towns: ['Lamu Town', 'Mpeketoni', 'Witu'], response: '12-24 hours' },
  { county: 'Taita Taveta', towns: ['Voi', 'Wundanyi', 'Taveta', 'Mwatate'], response: '6-12 hours' },
  { county: 'Kwale', towns: ['Kwale Town', 'Ukunda', 'Diani', 'Msambweni'], response: '4-8 hours' },
  { county: 'Tharaka Nithi', towns: ['Chuka', 'Marimanti', 'Chiakariga'], response: '4-8 hours' },
  { county: 'Kirinyaga', towns: ['Kerugoya', 'Kutus', 'Sagana', 'Wanguru'], response: '3-6 hours' },
  { county: 'Murang\'a', towns: ['Murang\'a Town', 'Kangema', 'Maragua', 'Kigumo'], response: '3-5 hours' },
  { county: 'Kitui', towns: ['Kitui Town', 'Mwingi', 'Mutomo'], response: '4-8 hours' },
  { county: 'Makueni', towns: ['Wote', 'Sultan Hamud', 'Emali', 'Mtito Andei'], response: '4-8 hours' },
  { county: 'Nyamira', towns: ['Nyamira Town', 'Keroka', 'Ekerenyo'], response: '6-10 hours' }
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPREHENSIVE FAQ
// ═══════════════════════════════════════════════════════════════════════════════
const COMPREHENSIVE_FAQ = [
  { category: 'General', q: 'Do you offer emergency services?', a: 'Yes, we provide 24/7 emergency services for critical equipment failures. Call our emergency line for immediate response.' },
  { category: 'General', q: 'What areas do you cover?', a: 'We serve all 47 counties in Kenya, with fastest response times in Nairobi, Mombasa, Kisumu, and Nakuru.' },
  { category: 'General', q: 'Do you provide warranties?', a: 'Yes, all our work comes with warranty: 1 year for repairs, 2 years for new installations, and varies by product for equipment.' },
  { category: 'General', q: 'Can I get a quotation before committing?', a: 'Absolutely. We provide free quotations for all jobs. Site visits are free within Nairobi; transport charges apply elsewhere.' },
  { category: 'Payments', q: 'What payment methods do you accept?', a: 'We accept M-Pesa, bank transfer, cheque, and cash. For large projects, we offer payment plans.' },
  { category: 'Payments', q: 'Do you require deposits?', a: 'For equipment purchases, 50% deposit is required. For service work, payment is on completion.' },
  { category: 'Payments', q: 'Do you offer financing?', a: 'Yes, we partner with financial institutions to offer equipment financing with up to 24-month terms.' },
  { category: 'Scheduling', q: 'How do I book a service?', a: 'Call us, WhatsApp, or fill the online form. We\'ll confirm availability and schedule at your convenience.' },
  { category: 'Scheduling', q: 'What are your working hours?', a: 'Monday-Friday: 8am-6pm, Saturday: 8am-4pm. Emergency services available 24/7.' },
  { category: 'Technical', q: 'Are your technicians certified?', a: 'Yes, all our technicians are trained, certified, and regularly updated. Electricians are ERC licensed.' }
];

// ═══════════════════════════════════════════════════════════════════════════════
// PRICING TABLE
// ═══════════════════════════════════════════════════════════════════════════════
const PRICING_GUIDE = [
  { service: 'Borehole drilling', unit: 'per meter', priceMin: 3500, priceMax: 8000 },
  { service: 'Submersible pump installation', unit: 'complete', priceMin: 45000, priceMax: 350000 },
  { service: 'Pump repair (minor)', unit: 'per job', priceMin: 5000, priceMax: 15000 },
  { service: 'Pump repair (major/overhaul)', unit: 'per job', priceMin: 25000, priceMax: 85000 },
  { service: 'Motor rewinding (<5HP)', unit: 'per motor', priceMin: 3500, priceMax: 15000 },
  { service: 'Motor rewinding (5-20HP)', unit: 'per motor', priceMin: 15000, priceMax: 45000 },
  { service: 'Motor rewinding (20-100HP)', unit: 'per motor', priceMin: 45000, priceMax: 150000 },
  { service: 'AC installation (split)', unit: 'per unit', priceMin: 8000, priceMax: 25000 },
  { service: 'AC gas refilling', unit: 'per unit', priceMin: 3500, priceMax: 8000 },
  { service: 'AC general service', unit: 'per unit', priceMin: 2500, priceMax: 5000 },
  { service: 'House wiring', unit: 'per point', priceMin: 1500, priceMax: 3500 },
  { service: 'Power factor correction', unit: 'complete', priceMin: 150000, priceMax: 2500000 },
  { service: 'Earthing installation', unit: 'per rod', priceMin: 8000, priceMax: 25000 },
  { service: 'Gate fabrication', unit: 'per m²', priceMin: 5000, priceMax: 15000 },
  { service: 'Tank fabrication', unit: 'per 1000L', priceMin: 25000, priceMax: 45000 },
  { service: 'Plumbing (per point)', unit: 'per point', priceMin: 1500, priceMax: 4000 },
  { service: 'Water heater installation', unit: 'complete', priceMin: 5000, priceMax: 15000 },
  { service: 'Emergency callout', unit: 'per visit', priceMin: 3500, priceMax: 8000 }
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function GeneralServicesBible() {
  const [activeCategory, setActiveCategory] = useState<string>('borehole');
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPricing, setShowPricing] = useState(false);
  const [showAreas, setShowAreas] = useState(false);
  const [faqSearch, setFaqSearch] = useState('');

  const activeData = SERVICE_CATEGORIES[activeCategory as keyof typeof SERVICE_CATEGORIES];

  const filteredFAQ = useMemo(() => {
    if (!faqSearch) return COMPREHENSIVE_FAQ;
    return COMPREHENSIVE_FAQ.filter(f =>
      f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.a.toLowerCase().includes(faqSearch.toLowerCase())
    );
  }, [faqSearch]);

  const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', glow: 'shadow-green-500/20' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
    yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', glow: 'shadow-yellow-500/20' },
    red: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', glow: 'shadow-red-500/20' },
    teal: { bg: 'bg-teal-500/10', border: 'border-teal-500/30', text: 'text-teal-400', glow: 'shadow-teal-500/20' },
  };

  const colors = colorMap[activeData?.color || 'blue'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/maintenance-hub" className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-2 mb-1">
                ← Back to Command Bridge
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold">
                <span className="text-white">THE</span>
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"> SERVICES BIBLE</span>
              </h1>
              <p className="text-slate-400 text-sm">Kenya's Most Comprehensive Maintenance & Services Guide</p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <a href="tel:+254782914717" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                📞 0782 914 717
              </a>
              <a href="https://wa.me/254782914717" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-slate-900/50 border-b border-slate-800 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-amber-400">6</div>
              <div className="text-slate-400 text-xs">Service Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">47</div>
              <div className="text-slate-400 text-xs">Counties Served</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">15,000+</div>
              <div className="text-slate-400 text-xs">Projects Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">24/7</div>
              <div className="text-slate-400 text-xs">Emergency Support</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">50+</div>
              <div className="text-slate-400 text-xs">Expert Technicians</div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {Object.values(SERVICE_CATEGORIES).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-black'
                  : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="hidden sm:inline">{cat.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Active Category Header */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-6 mb-8`}
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-5xl">{activeData.icon}</span>
                <div>
                  <h2 className={`text-2xl md:text-3xl font-bold ${colors.text}`}>{activeData.name}</h2>
                  <p className="text-slate-400 max-w-2xl">{activeData.description}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              {Object.entries(activeData.stats).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className={`text-2xl font-bold ${colors.text}`}>{value}</div>
                  <div className="text-slate-500 text-xs capitalize">{key}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Services Grid */}
        <section className="mb-12">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className={colors.text}>◆</span> Services Offered
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {activeData.services.map((service, idx) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`${colors.bg} ${colors.border} border rounded-xl overflow-hidden`}
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedService(expandedService === service.name ? null : service.name)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-1">{service.name}</h4>
                      <p className="text-slate-400 text-sm">{service.description}</p>
                    </div>
                    <span className={`${colors.text} text-2xl`}>
                      {expandedService === service.name ? '−' : '+'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <span className={`${colors.text} font-bold`}>{service.priceRange}</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-400">{service.duration}</span>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedService === service.name && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-700 p-4 bg-slate-900/50"
                    >
                      {service.includes && (
                        <div className="mb-4">
                          <h5 className="text-sm font-semibold text-slate-300 mb-2">What's Included:</h5>
                          <div className="flex flex-wrap gap-2">
                            {service.includes.map((item, i) => (
                              <span key={i} className={`px-2 py-1 ${colors.bg} ${colors.border} border rounded text-xs ${colors.text}`}>
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {'process' in service && service.process && (
                        <div className="mb-4">
                          <h5 className="text-sm font-semibold text-slate-300 mb-2">Process:</h5>
                          <ol className="space-y-1">
                            {(service.process as string[]).map((step, i) => (
                              <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                                <span className={`${colors.text} font-bold`}>{i + 1}.</span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                      {'brands' in service && service.brands && (
                        <div className="mb-4">
                          <h5 className="text-sm font-semibold text-slate-300 mb-2">Brands:</h5>
                          <div className="flex flex-wrap gap-2">
                            {(service.brands as string[]).map((brand, i) => (
                              <span key={i} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-slate-300">
                                {brand}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <a
                        href={`https://wa.me/254782914717?text=Hi, I need ${service.name} service`}
                        className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded-lg font-medium mt-4"
                      >
                        💬 Enquire on WhatsApp
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Troubleshooting Section */}
        {activeData.troubleshooting && (
          <section className="mb-12">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-red-400">⚠️</span> Common Problems & Solutions
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {activeData.troubleshooting.map((item, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <h4 className="text-lg font-bold text-red-400 mb-3">{item.problem}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-semibold text-slate-400 mb-2">Possible Causes:</h5>
                      <ul className="space-y-1">
                        {item.causes.map((cause, i) => (
                          <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-red-400">•</span>
                            {cause}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-slate-400 mb-2">Solutions:</h5>
                      <ul className="space-y-1">
                        {item.solutions.map((solution, i) => (
                          <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-green-400">✓</span>
                            {solution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Category-specific FAQ */}
        {activeData.faq && (
          <section className="mb-12">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-amber-400">❓</span> Frequently Asked Questions - {activeData.name.split(' ')[0]}
            </h3>
            <div className="space-y-3">
              {activeData.faq.map((item, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <h4 className="font-semibold text-white mb-2">{item.q}</h4>
                  <p className="text-slate-400 text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pricing Guide Toggle */}
        <section className="mb-12">
          <button
            onClick={() => setShowPricing(!showPricing)}
            className="w-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between hover:border-amber-500/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">💰</span>
              <div className="text-left">
                <h3 className="text-xl font-bold text-amber-400">Complete Pricing Guide</h3>
                <p className="text-slate-400 text-sm">View all our service prices at a glance</p>
              </div>
            </div>
            <span className="text-amber-400 text-2xl">{showPricing ? '−' : '+'}</span>
          </button>

          <AnimatePresence>
            {showPricing && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-slate-800/50 border border-slate-700 rounded-b-xl p-4 mt-2">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-3 text-slate-400">Service</th>
                          <th className="text-left py-3 text-slate-400">Unit</th>
                          <th className="text-right py-3 text-slate-400">Min (KES)</th>
                          <th className="text-right py-3 text-slate-400">Max (KES)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {PRICING_GUIDE.map((item, idx) => (
                          <tr key={idx} className="border-b border-slate-700/50">
                            <td className="py-3 text-white">{item.service}</td>
                            <td className="py-3 text-slate-400">{item.unit}</td>
                            <td className="py-3 text-right text-green-400 font-mono">{item.priceMin.toLocaleString()}</td>
                            <td className="py-3 text-right text-amber-400 font-mono">{item.priceMax.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-slate-500 text-xs mt-4">
                    * Prices are indicative and may vary based on specific requirements, location, and market conditions.
                    Contact us for accurate quotation.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Service Areas Toggle */}
        <section className="mb-12">
          <button
            onClick={() => setShowAreas(!showAreas)}
            className="w-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 flex items-center justify-between hover:border-green-500/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">📍</span>
              <div className="text-left">
                <h3 className="text-xl font-bold text-green-400">Service Areas - All 47 Counties</h3>
                <p className="text-slate-400 text-sm">View response times for each county</p>
              </div>
            </div>
            <span className="text-green-400 text-2xl">{showAreas ? '−' : '+'}</span>
          </button>

          <AnimatePresence>
            {showAreas && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-slate-800/50 border border-slate-700 rounded-b-xl p-4 mt-2">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {KENYA_SERVICE_AREAS.map((area, idx) => (
                      <div key={idx} className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">{area.county}</h4>
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                            {area.response}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {area.towns.slice(0, 4).map((town, i) => (
                            <span key={i} className="text-xs text-slate-400">{town}{i < Math.min(3, area.towns.length - 1) ? ',' : ''}</span>
                          ))}
                          {area.towns.length > 4 && <span className="text-xs text-slate-500">+{area.towns.length - 4} more</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* General FAQ */}
        <section className="mb-12">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-cyan-400">❓</span> General FAQ
          </h3>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search FAQ..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {filteredFAQ.map((item, idx) => (
              <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded mb-2 inline-block">{item.category}</span>
                <h4 className="font-semibold text-white mb-2">{item.q}</h4>
                <p className="text-slate-400 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency CTA */}
        <section className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-2">🚨 24/7 Emergency Services</h3>
          <p className="text-white/90 mb-6 text-lg">Equipment failure? Generator down? Pump not working? We're here to help!</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="tel:+254782914717" className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform">
              📞 Call Now: 0782 914 717
            </a>
            <a href="https://wa.me/254782914717?text=EMERGENCY: I need urgent help with..." className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform">
              💬 WhatsApp Emergency
            </a>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-12">
          <h3 className="text-xl font-bold text-white mb-6 text-center">Why Choose Emerson EIMS?</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '🏆', title: 'Expert Technicians', desc: 'Certified professionals with 10+ years experience' },
              { icon: '⚡', title: 'Fast Response', desc: '2-4 hour response in Nairobi, same-day across Kenya' },
              { icon: '🛡️', title: 'Guaranteed Work', desc: 'All work comes with warranty and after-service support' },
              { icon: '💰', title: 'Fair Pricing', desc: 'Transparent pricing with no hidden charges' }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h4 className="font-bold text-white mb-2">{item.title}</h4>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">© 2026 Emerson Industrial Maintenance Services Limited</p>
          <p className="text-slate-600 text-xs mt-2">Kenya's Most Comprehensive Maintenance Services Provider</p>
        </div>
      </footer>
    </div>
  );
}
