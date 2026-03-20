/**
 * CUMMINS GENERATORS - Technical Documentation
 * Complete reference for Cummins diesel generator sets
 */

import type {
  Schematic,
  WiringDiagram,
  TroubleshootingTree,
  RepairProcedure,
  Part,
  MaintenanceSchedule
} from '../technicalBible';

// ==================== SCHEMATICS ====================

export const CUMMINS_SCHEMATICS: Schematic[] = [
  {
    id: 'cummins-system-overview',
    serviceId: 'diesel-generators',
    name: 'Cummins Generator System Overview',
    description: 'Complete system layout showing engine, alternator, control panel, and auxiliary systems',
    category: 'System Overview',
    difficulty: 'intermediate',
    viewBox: { x: 0, y: 0, width: 1200, height: 800 },
    layers: [
      { id: 'mechanical', name: 'Mechanical', color: '#6B7280', visible: true },
      { id: 'electrical', name: 'Electrical', color: '#3B82F6', visible: true },
      { id: 'fuel', name: 'Fuel System', color: '#F59E0B', visible: true },
      { id: 'cooling', name: 'Cooling System', color: '#06B6D4', visible: true },
    ],
    components: [
      {
        id: 'diesel-engine',
        name: 'Cummins Diesel Engine',
        type: 'component',
        x: 100, y: 200, width: 200, height: 150,
        properties: { model: 'QSB7-G5', displacement: '6.7L', cylinders: '6 in-line' },
        connectedTo: ['alternator', 'fuel-system', 'cooling-system'],
        layer: 'mechanical',
        details: 'Turbocharged & aftercooled diesel engine. 1500RPM for 50Hz.',
        partNumber: 'QSB7-G5',
        specifications: {
          'Displacement': '6.7 Liters',
          'Cylinders': '6 in-line',
          'Aspiration': 'Turbocharged & Aftercooled',
          'Rated Speed': '1500 RPM (50Hz)',
          'Governor': 'Electronic',
          'Cooling': 'Liquid Cooled',
          'Fuel System': 'High Pressure Common Rail',
          'Emission': 'Tier 3 / Stage IIIA'
        }
      },
      {
        id: 'alternator',
        name: 'Stamford Alternator',
        type: 'component',
        x: 350, y: 200, width: 150, height: 150,
        properties: { model: 'UCI274H', output: '200kVA', voltage: '400/230V' },
        connectedTo: ['diesel-engine', 'control-panel', 'main-breaker'],
        layer: 'electrical',
        details: '4-pole brushless alternator with PMG excitation option.',
        partNumber: 'UCI274H',
        specifications: {
          'Output': '200kVA / 160kW',
          'Voltage': '400V (380-440V)',
          'Frequency': '50Hz',
          'Power Factor': '0.8 lagging',
          'Insulation': 'Class H (180°C)',
          'Protection': 'IP23',
          'Winding': '2/3 pitch',
          'AVR': 'SX460 / AS440'
        }
      },
      {
        id: 'control-panel',
        name: 'PowerCommand Controller',
        type: 'component',
        x: 550, y: 150, width: 120, height: 100,
        properties: { model: 'PCC3300', display: '7" Touchscreen' },
        connectedTo: ['alternator', 'engine-sensors', 'ats-interface'],
        layer: 'electrical',
        details: 'Full-featured generator controller with data logging.',
        partNumber: 'PCC3300',
        specifications: {
          'Display': '7" Color Touchscreen',
          'Communication': 'Modbus RTU/TCP, CAN J1939, Ethernet',
          'Protection': 'Full Engine & Generator',
          'Metering': 'True RMS, 0.5% accuracy',
          'Data Logging': '500+ parameters',
          'Languages': 'Multi-language support'
        }
      },
      {
        id: 'fuel-tank',
        name: 'Base Fuel Tank',
        type: 'component',
        x: 100, y: 450, width: 300, height: 80,
        properties: { capacity: '500L', material: 'Steel' },
        connectedTo: ['fuel-pump', 'fuel-gauge'],
        layer: 'fuel',
        details: 'Double-wall base tank with leak detection.',
        specifications: {
          'Capacity': '500 Liters',
          'Runtime': '8+ hours at full load',
          'Material': 'Powder-coated steel',
          'Features': 'Fuel level gauge, drain valve, fill cap with lock'
        }
      },
      {
        id: 'radiator',
        name: 'Cooling Radiator',
        type: 'component',
        x: 100, y: 50, width: 150, height: 100,
        properties: { type: 'Aluminum core', fan: 'Engine-driven pusher' },
        connectedTo: ['diesel-engine', 'coolant-pump'],
        layer: 'cooling',
        details: 'Sized for 50°C ambient operation.',
        specifications: {
          'Core': 'Aluminum fins, copper tubes',
          'Fan': 'Engine-driven, pusher type',
          'Ambient': 'Rated for 50°C',
          'Coolant Capacity': '45 Liters total system'
        }
      },
      {
        id: 'battery-bank',
        name: 'Starting Batteries',
        type: 'component',
        x: 550, y: 300, width: 100, height: 60,
        properties: { voltage: '24V', capacity: '200Ah' },
        connectedTo: ['starter-motor', 'battery-charger', 'control-panel'],
        layer: 'electrical',
        details: '2 x 12V batteries in series for 24V system.',
        specifications: {
          'Configuration': '2 x 12V in series',
          'Capacity': '200Ah each',
          'Type': 'Heavy-duty lead-acid',
          'CCA': '1200A combined',
          'Maintenance': 'Low maintenance / sealed'
        }
      },
      {
        id: 'main-breaker',
        name: 'Main Circuit Breaker',
        type: 'component',
        x: 550, y: 400, width: 80, height: 60,
        properties: { rating: '400A', poles: '4P' },
        connectedTo: ['alternator', 'output-terminals'],
        layer: 'electrical',
        details: 'Molded case circuit breaker with adjustable trip.',
        partNumber: 'MCCB-400A-4P',
        specifications: {
          'Rating': '400A',
          'Poles': '4 (3P+N)',
          'Breaking Capacity': '36kA at 400V',
          'Trip Unit': 'Electronic adjustable',
          'Mounting': 'Fixed or withdrawable'
        }
      }
    ],
    notes: [
      'Always verify engine is at complete stop before service',
      'Lethal voltages present when generator is running',
      'Hot surfaces - allow cooling before maintenance',
      'Rotating parts - keep guards in place'
    ],
    relatedDiagrams: ['cummins-electrical-schematic', 'cummins-fuel-system', 'cummins-cooling-system'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'cummins-starting-circuit',
    serviceId: 'diesel-generators',
    name: 'Cummins Starting Circuit Schematic',
    description: 'Complete starting system including batteries, starter motor, and control logic',
    category: 'Electrical',
    difficulty: 'intermediate',
    viewBox: { x: 0, y: 0, width: 1000, height: 600 },
    layers: [
      { id: 'power', name: 'Power Circuit', color: '#EF4444', visible: true },
      { id: 'control', name: 'Control Circuit', color: '#3B82F6', visible: true },
      { id: 'ground', name: 'Ground', color: '#22C55E', visible: true },
    ],
    components: [
      {
        id: 'battery-1',
        name: 'Battery 1',
        type: 'component',
        x: 50, y: 250, width: 60, height: 80,
        properties: { voltage: '12V', capacity: '200Ah' },
        connectedTo: ['battery-2', 'neg-bus'],
        layer: 'power',
        details: 'First battery in series. Negative to chassis ground.',
        specifications: { 'Voltage': '12V', 'Capacity': '200Ah', 'CCA': '600A' }
      },
      {
        id: 'battery-2',
        name: 'Battery 2',
        type: 'component',
        x: 50, y: 150, width: 60, height: 80,
        properties: { voltage: '12V', capacity: '200Ah' },
        connectedTo: ['battery-1', 'isolator'],
        layer: 'power',
        details: 'Second battery. Positive goes to isolator switch.',
        specifications: { 'Voltage': '12V', 'Capacity': '200Ah', 'CCA': '600A' }
      },
      {
        id: 'isolator',
        name: 'Battery Isolator',
        type: 'component',
        x: 150, y: 170, width: 50, height: 40,
        properties: { rating: '300A', poles: '1P' },
        connectedTo: ['battery-2', 'starter-solenoid'],
        layer: 'power',
        details: 'Main battery disconnect switch.',
        partNumber: 'ISO-300A'
      },
      {
        id: 'starter-solenoid',
        name: 'Starter Solenoid',
        type: 'component',
        x: 300, y: 150, width: 60, height: 50,
        properties: { coilVoltage: '24V', contactRating: '400A' },
        connectedTo: ['isolator', 'starter-motor', 'controller'],
        layer: 'power',
        details: 'Engages starter motor when activated by controller.',
        partNumber: 'SOL-24V-400A'
      },
      {
        id: 'starter-motor',
        name: 'Starter Motor',
        type: 'component',
        x: 450, y: 130, width: 100, height: 80,
        properties: { power: '7kW', voltage: '24V' },
        connectedTo: ['starter-solenoid', 'engine-flywheel'],
        layer: 'power',
        details: 'Gear reduction starter for reliable cranking.',
        partNumber: '3957544',
        specifications: {
          'Power': '7kW',
          'Voltage': '24V DC',
          'Type': 'Gear reduction',
          'Rotation': 'CW from drive end',
          'Teeth': '10',
          'Max Crank Time': '30 sec'
        }
      },
      {
        id: 'controller-start',
        name: 'Start Output (Controller)',
        type: 'terminal',
        x: 300, y: 80, width: 30, height: 20,
        properties: { terminal: 'K1', function: 'Start command' },
        connectedTo: ['starter-solenoid'],
        layer: 'control',
        details: 'Controller output activates starter solenoid.'
      },
      {
        id: 'fuel-solenoid',
        name: 'Fuel Shutoff Solenoid',
        type: 'component',
        x: 450, y: 280, width: 50, height: 40,
        properties: { voltage: '24V', type: 'Energize to run' },
        connectedTo: ['controller-fuel', 'fuel-pump'],
        layer: 'control',
        details: 'Opens fuel supply when energized. Shuts off fuel when de-energized.',
        partNumber: '3935649'
      },
      {
        id: 'preheat-relay',
        name: 'Intake Air Heater Relay',
        type: 'component',
        x: 600, y: 150, width: 50, height: 40,
        properties: { coilVoltage: '24V', contactRating: '40A' },
        connectedTo: ['controller-preheat', 'intake-heater'],
        layer: 'control',
        details: 'Controls intake manifold heater for cold starting.',
        partNumber: 'REL-40A-24V'
      }
    ],
    notes: [
      'Maximum cranking time: 10 seconds on, 60 seconds off',
      'Battery voltage must be above 22V for reliable starting',
      'Check battery connections if cranking speed is slow',
      'Fuel solenoid must be energized during cranking and running'
    ],
    relatedDiagrams: ['cummins-charging-circuit', 'cummins-controller-wiring'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'cummins-fuel-system',
    serviceId: 'diesel-generators',
    name: 'Cummins Fuel System Schematic',
    description: 'Complete fuel system from tank to injectors including filtration',
    category: 'Fuel System',
    difficulty: 'intermediate',
    viewBox: { x: 0, y: 0, width: 1000, height: 500 },
    layers: [
      { id: 'supply', name: 'Fuel Supply', color: '#F59E0B', visible: true },
      { id: 'return', name: 'Fuel Return', color: '#10B981', visible: true },
      { id: 'highpressure', name: 'High Pressure', color: '#EF4444', visible: true },
    ],
    components: [
      {
        id: 'fuel-tank',
        name: 'Fuel Tank',
        type: 'component',
        x: 50, y: 200, width: 100, height: 100,
        properties: { capacity: '500L', outlet: '1" BSP' },
        connectedTo: ['shutoff-valve', 'return-line'],
        layer: 'supply',
        details: 'Main fuel storage. Check for water contamination weekly.',
        specifications: {
          'Capacity': '500 Liters',
          'Material': 'Steel with epoxy lining',
          'Outlet': '1" BSP at bottom',
          'Return': '3/4" BSP at top',
          'Vent': 'Breather cap with filter'
        }
      },
      {
        id: 'shutoff-valve',
        name: 'Manual Shutoff Valve',
        type: 'component',
        x: 180, y: 230, width: 30, height: 30,
        properties: { size: '1" BSP', type: 'Ball valve' },
        connectedTo: ['fuel-tank', 'primary-filter'],
        layer: 'supply',
        details: 'Manual isolation valve. Close for filter service.'
      },
      {
        id: 'primary-filter',
        name: 'Fuel Water Separator',
        type: 'component',
        x: 250, y: 200, width: 60, height: 80,
        properties: { partNumber: 'FS1000', micron: '30' },
        connectedTo: ['shutoff-valve', 'transfer-pump'],
        layer: 'supply',
        details: 'Primary filter with water separator bowl. Drain water weekly.',
        partNumber: 'FS1000',
        specifications: {
          'Micron Rating': '30 micron',
          'Water Capacity': '500ml',
          'Drain': 'Manual valve at bottom',
          'Change Interval': '500 hours or 6 months'
        }
      },
      {
        id: 'transfer-pump',
        name: 'Fuel Transfer Pump',
        type: 'component',
        x: 350, y: 220, width: 60, height: 50,
        properties: { type: 'Gear pump', pressure: '0.3-0.5 bar' },
        connectedTo: ['primary-filter', 'secondary-filter'],
        layer: 'supply',
        details: 'Engine-driven gear pump. Has hand primer for bleeding.',
        specifications: {
          'Type': 'Gear pump',
          'Drive': 'Engine gear train',
          'Output Pressure': '0.3-0.5 bar',
          'Flow Rate': '200 L/hr',
          'Priming': 'Hand primer lever'
        }
      },
      {
        id: 'secondary-filter',
        name: 'Secondary Fuel Filter',
        type: 'component',
        x: 450, y: 200, width: 50, height: 70,
        properties: { partNumber: 'FF5052', micron: '5' },
        connectedTo: ['transfer-pump', 'hp-pump'],
        layer: 'supply',
        details: 'Fine filter before high-pressure pump.',
        partNumber: 'FF5052',
        specifications: {
          'Micron Rating': '5 micron',
          'Type': 'Spin-on',
          'Change Interval': '500 hours or 6 months',
          'Bypass': '1 bar internal'
        }
      },
      {
        id: 'hp-pump',
        name: 'High Pressure Fuel Pump',
        type: 'component',
        x: 550, y: 180, width: 80, height: 80,
        properties: { type: 'CP3', pressure: '1800 bar' },
        connectedTo: ['secondary-filter', 'common-rail', 'return-line'],
        layer: 'highpressure',
        details: 'Bosch CP3 common rail pump. Generates injection pressure.',
        specifications: {
          'Type': 'Radial piston (CP3)',
          'Max Pressure': '1800 bar',
          'Drive': 'Engine gear train',
          'Lubrication': 'Fuel lubricated'
        }
      },
      {
        id: 'common-rail',
        name: 'Common Rail',
        type: 'component',
        x: 680, y: 150, width: 150, height: 30,
        properties: { pressure: '1400-1800 bar', volume: '20ml' },
        connectedTo: ['hp-pump', 'injectors', 'rail-sensor'],
        layer: 'highpressure',
        details: 'Accumulator for stable injection pressure.',
        specifications: {
          'Operating Pressure': '1400-1800 bar',
          'Material': 'Forged steel',
          'Sensor': 'Rail pressure sensor',
          'Relief Valve': 'Pressure limiting valve'
        }
      },
      {
        id: 'injectors',
        name: 'Fuel Injectors (x6)',
        type: 'component',
        x: 700, y: 250, width: 100, height: 60,
        properties: { type: 'Solenoid', partNumber: '4903472' },
        connectedTo: ['common-rail', 'return-line'],
        layer: 'highpressure',
        details: 'Electronic solenoid injectors. One per cylinder.',
        partNumber: '4903472',
        specifications: {
          'Type': 'Solenoid actuated',
          'Nozzle': 'Multi-hole',
          'Control': 'ECM controlled',
          'Return': 'Internal leak-off'
        }
      }
    ],
    notes: [
      'Use only clean, filtered diesel fuel meeting EN590',
      'Never run fuel system dry - causes air lock and pump damage',
      'Check for water in separator bowl daily in humid climates',
      'High-pressure fittings require special tools - do not improvise'
    ],
    relatedDiagrams: ['cummins-hp-fuel-detail', 'cummins-ecm-fuel-control'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'cummins-cooling-system',
    serviceId: 'diesel-generators',
    name: 'Cummins Cooling System Schematic',
    description: 'Engine cooling circuit including radiator, thermostat, and coolant flow',
    category: 'Cooling System',
    difficulty: 'basic',
    viewBox: { x: 0, y: 0, width: 800, height: 600 },
    layers: [
      { id: 'flow', name: 'Coolant Flow', color: '#06B6D4', visible: true },
      { id: 'components', name: 'Components', color: '#6B7280', visible: true },
    ],
    components: [
      {
        id: 'radiator',
        name: 'Radiator',
        type: 'component',
        x: 50, y: 150, width: 150, height: 200,
        properties: { type: 'Cross-flow', material: 'Aluminum/Copper' },
        connectedTo: ['upper-hose', 'lower-hose', 'fan'],
        layer: 'components',
        details: 'Cross-flow radiator sized for 50°C ambient.',
        specifications: {
          'Type': 'Cross-flow',
          'Core': 'Aluminum fins, copper tubes',
          'Rows': '3',
          'Pressure Cap': '103 kPa (15 PSI)'
        }
      },
      {
        id: 'water-pump',
        name: 'Water Pump',
        type: 'component',
        x: 350, y: 300, width: 70, height: 70,
        properties: { type: 'Centrifugal', drive: 'Belt driven' },
        connectedTo: ['lower-hose', 'engine-block'],
        layer: 'components',
        details: 'Centrifugal pump driven by accessory belt.',
        partNumber: '3920779',
        specifications: {
          'Type': 'Centrifugal impeller',
          'Drive': 'Belt driven',
          'Flow Rate': '300 L/min',
          'Seal': 'Mechanical face seal'
        }
      },
      {
        id: 'thermostat',
        name: 'Thermostat',
        type: 'component',
        x: 500, y: 200, width: 50, height: 50,
        properties: { opening: '82°C', full: '95°C' },
        connectedTo: ['engine-block', 'upper-hose'],
        layer: 'components',
        details: 'Wax pellet thermostat controls coolant flow to radiator.',
        specifications: {
          'Start Opening': '82°C',
          'Fully Open': '95°C',
          'Lift': '10mm',
          'Type': 'Wax pellet'
        }
      },
      {
        id: 'expansion-tank',
        name: 'Expansion Tank',
        type: 'component',
        x: 250, y: 80, width: 60, height: 50,
        properties: { capacity: '5L', material: 'Plastic' },
        connectedTo: ['radiator-overflow', 'level-sensor'],
        layer: 'components',
        details: 'Pressurized expansion tank with level sensor.',
        specifications: {
          'Capacity': '5 Liters',
          'Marks': 'HOT and COLD level marks',
          'Cap': 'Pressure/vacuum cap',
          'Sensor': 'Low level switch'
        }
      },
      {
        id: 'coolant-filter',
        name: 'Coolant Filter',
        type: 'component',
        x: 450, y: 400, width: 50, height: 60,
        properties: { partNumber: 'WF2076', type: 'SCA filter' },
        connectedTo: ['water-pump', 'bypass-line'],
        layer: 'components',
        details: 'Coolant filter with supplemental coolant additive.',
        partNumber: 'WF2076',
        specifications: {
          'Function': 'Filtration + SCA addition',
          'SCA': 'DCA4 additive',
          'Change Interval': '500 hours',
          'Bypass': 'Integral bypass valve'
        }
      },
      {
        id: 'fan',
        name: 'Cooling Fan',
        type: 'component',
        x: 80, y: 400, width: 100, height: 40,
        properties: { type: 'Pusher', blades: '7' },
        connectedTo: ['radiator', 'fan-drive'],
        layer: 'components',
        details: 'Engine-driven pusher fan.',
        specifications: {
          'Type': 'Pusher (blowing through radiator)',
          'Blades': '7 blade plastic',
          'Drive': 'Direct engine drive',
          'Guard': 'Wire mesh guard required'
        }
      }
    ],
    notes: [
      'Use only Cummins-approved coolant (50% glycol mix)',
      'Never open pressure cap when engine is hot',
      'Check SCA levels with test strips every 250 hours',
      'Inspect hoses for cracks, soft spots, or swelling'
    ],
    relatedDiagrams: ['cummins-coolant-flow', 'cummins-thermostat-detail'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'cummins-electrical-overview',
    serviceId: 'diesel-generators',
    name: 'Cummins Generator Electrical Overview',
    description: 'Main electrical system including alternator, AVR, and output',
    category: 'Electrical',
    difficulty: 'advanced',
    viewBox: { x: 0, y: 0, width: 1200, height: 800 },
    layers: [
      { id: 'main-power', name: 'Main Power', color: '#EF4444', visible: true },
      { id: 'excitation', name: 'Excitation', color: '#F59E0B', visible: true },
      { id: 'sensing', name: 'Sensing', color: '#8B5CF6', visible: true },
      { id: 'protection', name: 'Protection', color: '#22C55E', visible: true },
    ],
    components: [
      {
        id: 'main-stator',
        name: 'Main Stator',
        type: 'component',
        x: 100, y: 200, width: 150, height: 150,
        properties: { winding: 'Star (Y)', voltage: '400V' },
        connectedTo: ['main-rotor', 'output-terminals'],
        layer: 'main-power',
        details: 'Main power stator winding. Star connected for 400/230V.',
        specifications: {
          'Connection': 'Star (Y) - 4 wire',
          'Voltage': '400V L-L, 230V L-N',
          'Insulation': 'Class H (180°C)',
          'Winding Pitch': '2/3'
        }
      },
      {
        id: 'main-rotor',
        name: 'Main Rotor',
        type: 'component',
        x: 130, y: 230, width: 90, height: 90,
        properties: { poles: '4', type: 'Salient pole' },
        connectedTo: ['main-stator', 'rotating-rectifier'],
        layer: 'excitation',
        details: 'Main rotor field. Fed by rotating rectifier.',
        specifications: {
          'Poles': '4',
          'Type': 'Salient pole',
          'Excitation': 'Brushless via rotating rectifier'
        }
      },
      {
        id: 'exciter-stator',
        name: 'Exciter Stator',
        type: 'component',
        x: 350, y: 200, width: 100, height: 100,
        properties: { type: 'DC field', source: 'AVR' },
        connectedTo: ['avr', 'exciter-rotor'],
        layer: 'excitation',
        details: 'Exciter field. DC from AVR creates rotating AC in exciter rotor.',
        specifications: {
          'Winding': 'DC field winding',
          'Resistance': '15-25 ohms typical',
          'Source': 'AVR output'
        }
      },
      {
        id: 'exciter-rotor',
        name: 'Exciter Rotor (Armature)',
        type: 'component',
        x: 370, y: 220, width: 60, height: 60,
        properties: { type: '3-phase AC', output: 'To rectifier' },
        connectedTo: ['exciter-stator', 'rotating-rectifier'],
        layer: 'excitation',
        details: 'Rotating armature generates AC for rectification.',
        specifications: {
          'Winding': '3-phase AC armature',
          'Output': 'AC to rotating rectifier'
        }
      },
      {
        id: 'rotating-rectifier',
        name: 'Rotating Rectifier',
        type: 'component',
        x: 500, y: 200, width: 80, height: 80,
        properties: { type: '3-phase bridge', diodes: '6' },
        connectedTo: ['exciter-rotor', 'main-rotor'],
        layer: 'excitation',
        details: 'Converts exciter AC to DC for main rotor field.',
        specifications: {
          'Configuration': '3-phase full bridge',
          'Diodes': '6 (plus 3 surge suppression)',
          'Output': 'DC to main rotor field'
        }
      },
      {
        id: 'avr',
        name: 'Automatic Voltage Regulator',
        type: 'component',
        x: 350, y: 400, width: 100, height: 60,
        properties: { model: 'SX460', regulation: '±0.5%' },
        connectedTo: ['sensing-input', 'exciter-stator', 'pmg'],
        layer: 'excitation',
        details: 'Controls excitation to maintain output voltage.',
        partNumber: 'SX460',
        specifications: {
          'Model': 'SX460 (or AS440 with PMG)',
          'Regulation': '±0.5% static',
          'Adjustments': 'Voltage, Stability, UFRO',
          'Power Source': 'Shunt or PMG'
        }
      },
      {
        id: 'pmg',
        name: 'Permanent Magnet Generator',
        type: 'component',
        x: 550, y: 350, width: 80, height: 60,
        properties: { output: '3-phase AC', voltage: '180V' },
        connectedTo: ['avr'],
        layer: 'excitation',
        details: 'Optional PMG provides independent AVR power source.',
        specifications: {
          'Type': 'Permanent magnet alternator',
          'Output': '3-phase AC, ~180V',
          'Purpose': 'Independent AVR power for motor starting',
          'Location': 'Mounted on alternator shaft'
        }
      },
      {
        id: 'output-terminals',
        name: 'Output Terminals',
        type: 'terminal',
        x: 100, y: 450, width: 150, height: 40,
        properties: { terminals: 'U, V, W, N' },
        connectedTo: ['main-stator', 'main-breaker'],
        layer: 'main-power',
        details: 'Main power output terminals.',
        specifications: {
          'U (L1)': 'Brown',
          'V (L2)': 'Black',
          'W (L3)': 'Grey',
          'N': 'Blue',
          'PE': 'Green/Yellow'
        }
      },
      {
        id: 'cts',
        name: 'Current Transformers',
        type: 'component',
        x: 100, y: 520, width: 100, height: 40,
        properties: { ratio: '400/5A', accuracy: 'Class 1' },
        connectedTo: ['output-terminals', 'controller'],
        layer: 'sensing',
        details: 'CTs for metering and protection.',
        specifications: {
          'Ratio': '400/5A (typical)',
          'Accuracy': 'Class 1 for metering',
          'Burden': '5VA',
          'Mounting': 'On output cables'
        }
      }
    ],
    notes: [
      'Never disconnect AVR sensing while generator is running',
      'PMG equipped units can handle 300% motor starting',
      'Check exciter field resistance: typical 15-25 ohms',
      'Rotating rectifier diodes fail shorted - check with ohmmeter'
    ],
    relatedDiagrams: ['cummins-avr-wiring', 'cummins-protection-scheme'],
    lastUpdated: '2024-03-15'
  }
];

// ==================== WIRING DIAGRAMS ====================

export const CUMMINS_WIRING_DIAGRAMS: WiringDiagram[] = [
  {
    id: 'cummins-starting-wiring',
    serviceId: 'diesel-generators',
    name: 'Cummins Starting Circuit Wiring',
    description: 'Complete wiring for battery, starter, and starting control circuit',
    category: 'Starting System',
    wires: [
      {
        id: 'w-bat-pos',
        from: 'battery-positive',
        to: 'isolator-in',
        color: 'RD',
        colorName: 'Red',
        gauge: '50mm²',
        type: 'Battery cable - flexible',
        function: 'Main battery positive',
        maxCurrent: '400A',
        voltage: '24V DC'
      },
      {
        id: 'w-iso-out',
        from: 'isolator-out',
        to: 'starter-solenoid-bat',
        color: 'RD',
        colorName: 'Red',
        gauge: '50mm²',
        type: 'Battery cable - flexible',
        function: 'Starter power feed',
        maxCurrent: '400A',
        voltage: '24V DC'
      },
      {
        id: 'w-bat-neg',
        from: 'battery-negative',
        to: 'engine-ground',
        color: 'BK',
        colorName: 'Black',
        gauge: '50mm²',
        type: 'Battery cable - flexible',
        function: 'Battery ground',
        maxCurrent: '400A',
        voltage: '0V (Ground)'
      },
      {
        id: 'w-start-signal',
        from: 'controller-k1',
        to: 'starter-solenoid-s',
        color: 'YE',
        colorName: 'Yellow',
        gauge: '2.5mm²',
        type: 'Stranded copper',
        function: 'Start command signal',
        maxCurrent: '15A',
        voltage: '24V DC'
      },
      {
        id: 'w-fuel-sol',
        from: 'controller-fuel',
        to: 'fuel-solenoid-pos',
        color: 'BN',
        colorName: 'Brown',
        gauge: '2.5mm²',
        type: 'Stranded copper',
        function: 'Fuel solenoid supply',
        maxCurrent: '10A',
        voltage: '24V DC'
      },
      {
        id: 'w-preheat',
        from: 'controller-preheat',
        to: 'preheat-relay-coil',
        color: 'OG',
        colorName: 'Orange',
        gauge: '1.5mm²',
        type: 'Stranded copper',
        function: 'Preheat relay control',
        maxCurrent: '2A',
        voltage: '24V DC'
      },
      {
        id: 'w-earth-bond',
        from: 'engine-block',
        to: 'frame-ground',
        color: 'GNYE',
        colorName: 'Green/Yellow',
        gauge: '16mm²',
        type: 'Stranded copper',
        function: 'Safety earth bond',
        maxCurrent: 'Fault current',
        voltage: 'Earth'
      },
      {
        id: 'w-series-link',
        from: 'battery1-positive',
        to: 'battery2-negative',
        color: 'RD',
        colorName: 'Red',
        gauge: '50mm²',
        type: 'Battery cable - flexible',
        function: 'Series connection (12V+12V=24V)',
        maxCurrent: '400A',
        voltage: '12V DC'
      }
    ],
    terminals: [
      { id: 'battery-positive', name: 'Battery Bank +24V', x: 50, y: 100, type: 'stud-M10' },
      { id: 'battery-negative', name: 'Battery Bank 0V', x: 50, y: 200, type: 'stud-M10' },
      { id: 'isolator-in', name: 'Isolator Input', x: 150, y: 100, type: 'stud-M8' },
      { id: 'isolator-out', name: 'Isolator Output', x: 200, y: 100, type: 'stud-M8' },
      { id: 'starter-solenoid-bat', name: 'Starter Solenoid B+', x: 300, y: 100, type: 'stud-M10' },
      { id: 'starter-solenoid-s', name: 'Starter Solenoid S', x: 300, y: 150, type: 'spade-6.3mm' },
      { id: 'engine-ground', name: 'Engine Ground Point', x: 400, y: 200, type: 'stud-M10' },
      { id: 'controller-k1', name: 'Controller Start Output', x: 500, y: 150, type: 'screw-M4' },
      { id: 'controller-fuel', name: 'Controller Fuel Output', x: 500, y: 180, type: 'screw-M4' }
    ],
    annotations: [
      { x: 100, y: 50, text: 'Torque M10 studs to 15Nm' },
      { x: 300, y: 80, text: 'Install 400A ANL fuse inline' },
      { x: 400, y: 220, text: 'Clean to bare metal before connecting' }
    ],
    safetyNotes: [
      'DANGER: Disconnect battery negative first, reconnect last',
      'WARNING: Batteries produce explosive hydrogen gas',
      'CAUTION: Use insulated tools rated for 1000V',
      'Wear safety glasses and acid-resistant gloves',
      'Never create sparks near batteries',
      'Route cables away from hot exhaust components'
    ],
    testPoints: [
      { id: 'tp1', name: 'Battery voltage', expectedValue: '24-28V DC', procedure: 'Measure across battery terminals with engine off' },
      { id: 'tp2', name: 'Crank voltage', expectedValue: '>20V during crank', procedure: 'Measure battery voltage while cranking' },
      { id: 'tp3', name: 'Start signal', expectedValue: '24V when starting', procedure: 'Measure at solenoid S terminal during start' },
      { id: 'tp4', name: 'Fuel solenoid', expectedValue: '24V when running', procedure: 'Measure at fuel solenoid positive' }
    ]
  },
  {
    id: 'cummins-output-wiring',
    serviceId: 'diesel-generators',
    name: 'Generator 3-Phase Output Wiring',
    description: 'Main power output connections from alternator to distribution',
    category: 'Power Output',
    wires: [
      {
        id: 'w-l1',
        from: 'alternator-u1',
        to: 'mcb-l1',
        color: 'BN',
        colorName: 'Brown',
        gauge: '95mm²',
        type: 'Single core XLPE',
        function: 'Phase L1',
        maxCurrent: '289A',
        voltage: '400V AC'
      },
      {
        id: 'w-l2',
        from: 'alternator-v1',
        to: 'mcb-l2',
        color: 'BK',
        colorName: 'Black',
        gauge: '95mm²',
        type: 'Single core XLPE',
        function: 'Phase L2',
        maxCurrent: '289A',
        voltage: '400V AC'
      },
      {
        id: 'w-l3',
        from: 'alternator-w1',
        to: 'mcb-l3',
        color: 'GY',
        colorName: 'Grey',
        gauge: '95mm²',
        type: 'Single core XLPE',
        function: 'Phase L3',
        maxCurrent: '289A',
        voltage: '400V AC'
      },
      {
        id: 'w-neutral',
        from: 'alternator-n',
        to: 'neutral-bar',
        color: 'BU',
        colorName: 'Blue',
        gauge: '50mm²',
        type: 'Single core XLPE',
        function: 'Neutral',
        maxCurrent: '200A',
        voltage: '0V (Neutral)'
      },
      {
        id: 'w-earth',
        from: 'alternator-frame',
        to: 'earth-bar',
        color: 'GNYE',
        colorName: 'Green/Yellow',
        gauge: '50mm²',
        type: 'Single core XLPE',
        function: 'Protective Earth',
        maxCurrent: 'Fault current',
        voltage: 'Earth'
      }
    ],
    terminals: [
      { id: 'alternator-u1', name: 'Alternator U1 (L1)', x: 100, y: 100, type: 'stud-M12' },
      { id: 'alternator-v1', name: 'Alternator V1 (L2)', x: 100, y: 150, type: 'stud-M12' },
      { id: 'alternator-w1', name: 'Alternator W1 (L3)', x: 100, y: 200, type: 'stud-M12' },
      { id: 'alternator-n', name: 'Alternator Neutral', x: 100, y: 250, type: 'stud-M10' },
      { id: 'mcb-l1', name: 'MCB L1 Input', x: 400, y: 100, type: 'lug-M10' },
      { id: 'mcb-l2', name: 'MCB L2 Input', x: 400, y: 150, type: 'lug-M10' },
      { id: 'mcb-l3', name: 'MCB L3 Input', x: 400, y: 200, type: 'lug-M10' }
    ],
    annotations: [
      { x: 250, y: 80, text: 'Phase rotation: L1-L2-L3 clockwise' },
      { x: 100, y: 280, text: 'Torque M12 terminals to 40Nm' },
      { x: 400, y: 250, text: 'Verify phase sequence before connecting loads' }
    ],
    safetyNotes: [
      'DANGER: 400V can cause instant death',
      'LOCKOUT/TAGOUT required before any work',
      'Verify zero voltage with rated tester',
      'Minimum bend radius: 8x cable diameter',
      'Use properly rated crimped lugs only',
      'Check phase rotation before connecting motors'
    ],
    testPoints: [
      { id: 'tp1', name: 'Voltage L1-L2', expectedValue: '400V ±5%', procedure: 'Measure with calibrated meter, no load' },
      { id: 'tp2', name: 'Voltage L2-L3', expectedValue: '400V ±5%', procedure: 'Measure with calibrated meter, no load' },
      { id: 'tp3', name: 'Voltage L3-L1', expectedValue: '400V ±5%', procedure: 'Measure with calibrated meter, no load' },
      { id: 'tp4', name: 'Voltage L1-N', expectedValue: '230V ±5%', procedure: 'Measure phase to neutral' },
      { id: 'tp5', name: 'Frequency', expectedValue: '50Hz ±0.5Hz', procedure: 'Measure with frequency meter' },
      { id: 'tp6', name: 'Earth continuity', expectedValue: '<1 ohm', procedure: 'Measure frame to external earth' }
    ]
  },
  {
    id: 'cummins-avr-wiring',
    serviceId: 'diesel-generators',
    name: 'AVR Wiring Diagram - SX460',
    description: 'Automatic Voltage Regulator connections for Stamford alternator',
    category: 'Excitation System',
    wires: [
      {
        id: 'w-sensing-1',
        from: 'alternator-u1',
        to: 'avr-s1',
        color: 'RD',
        colorName: 'Red',
        gauge: '1.0mm²',
        type: 'Stranded copper',
        function: 'Voltage sensing L1',
        maxCurrent: '100mA',
        voltage: '230V AC'
      },
      {
        id: 'w-sensing-2',
        from: 'alternator-v1',
        to: 'avr-s2',
        color: 'YE',
        colorName: 'Yellow',
        gauge: '1.0mm²',
        type: 'Stranded copper',
        function: 'Voltage sensing L2',
        maxCurrent: '100mA',
        voltage: '230V AC'
      },
      {
        id: 'w-sensing-3',
        from: 'alternator-w1',
        to: 'avr-s3',
        color: 'BU',
        colorName: 'Blue',
        gauge: '1.0mm²',
        type: 'Stranded copper',
        function: 'Voltage sensing L3',
        maxCurrent: '100mA',
        voltage: '230V AC'
      },
      {
        id: 'w-field-pos',
        from: 'avr-f+',
        to: 'exciter-f+',
        color: 'RD',
        colorName: 'Red',
        gauge: '2.5mm²',
        type: 'Stranded copper',
        function: 'Exciter field positive',
        maxCurrent: '5A',
        voltage: 'DC (variable)'
      },
      {
        id: 'w-field-neg',
        from: 'avr-f-',
        to: 'exciter-f-',
        color: 'BK',
        colorName: 'Black',
        gauge: '2.5mm²',
        type: 'Stranded copper',
        function: 'Exciter field negative',
        maxCurrent: '5A',
        voltage: 'DC (variable)'
      },
      {
        id: 'w-aux-supply',
        from: 'aux-winding',
        to: 'avr-aux',
        color: 'WH',
        colorName: 'White',
        gauge: '1.5mm²',
        type: 'Stranded copper',
        function: 'AVR power supply (auxiliary winding)',
        maxCurrent: '2A',
        voltage: '40-60V AC'
      }
    ],
    terminals: [
      { id: 'avr-s1', name: 'AVR Sensing S1', x: 200, y: 50, type: 'screw-M3' },
      { id: 'avr-s2', name: 'AVR Sensing S2', x: 200, y: 80, type: 'screw-M3' },
      { id: 'avr-s3', name: 'AVR Sensing S3', x: 200, y: 110, type: 'screw-M3' },
      { id: 'avr-f+', name: 'AVR Field F+', x: 200, y: 160, type: 'screw-M4' },
      { id: 'avr-f-', name: 'AVR Field F-', x: 200, y: 190, type: 'screw-M4' },
      { id: 'avr-aux', name: 'AVR Aux Input', x: 200, y: 240, type: 'screw-M3' }
    ],
    annotations: [
      { x: 100, y: 30, text: 'Fuse sensing inputs: 2A each' },
      { x: 250, y: 160, text: 'Field resistance: 15-25Ω typical' },
      { x: 100, y: 260, text: 'Set VOLTS pot to mid-position initially' }
    ],
    safetyNotes: [
      'Never disconnect sensing wires while running',
      'Do not short field terminals - damage to AVR',
      'Install varistors for surge protection',
      'Check all connections before starting',
      'AVR produces DC output - polarity matters'
    ],
    testPoints: [
      { id: 'tp1', name: 'Sensing voltage', expectedValue: '230V AC per phase', procedure: 'Measure at AVR sensing terminals' },
      { id: 'tp2', name: 'Field voltage', expectedValue: '5-15V DC', procedure: 'Measure at F+ to F- while running' },
      { id: 'tp3', name: 'Field resistance', expectedValue: '15-25Ω', procedure: 'Measure exciter field with ohmmeter (engine stopped)' },
      { id: 'tp4', name: 'Aux supply', expectedValue: '40-60V AC', procedure: 'Measure auxiliary winding output' }
    ]
  },
  {
    id: 'cummins-controller-wiring',
    serviceId: 'diesel-generators',
    name: 'PCC3300 Controller Wiring',
    description: 'Complete wiring for PowerCommand 3300 controller',
    category: 'Control System',
    wires: [
      {
        id: 'w-dc-pos',
        from: 'battery-bus',
        to: 'pcc-b+',
        color: 'RD',
        colorName: 'Red',
        gauge: '4mm²',
        type: 'Stranded copper',
        function: 'Controller DC supply +',
        maxCurrent: '20A',
        voltage: '24V DC'
      },
      {
        id: 'w-dc-neg',
        from: 'dc-ground',
        to: 'pcc-b-',
        color: 'BK',
        colorName: 'Black',
        gauge: '4mm²',
        type: 'Stranded copper',
        function: 'Controller DC supply -',
        maxCurrent: '20A',
        voltage: '0V (Ground)'
      },
      {
        id: 'w-oil-press',
        from: 'oil-pressure-sensor',
        to: 'pcc-j2-5',
        color: 'WH',
        colorName: 'White',
        gauge: '0.75mm²',
        type: 'Shielded',
        function: 'Oil pressure signal',
        maxCurrent: '100mA',
        voltage: '0-5V signal'
      },
      {
        id: 'w-coolant-temp',
        from: 'coolant-temp-sensor',
        to: 'pcc-j2-7',
        color: 'GN',
        colorName: 'Green',
        gauge: '0.75mm²',
        type: 'Shielded',
        function: 'Coolant temperature signal',
        maxCurrent: '100mA',
        voltage: 'Resistance signal'
      },
      {
        id: 'w-mpu',
        from: 'magnetic-pickup',
        to: 'pcc-j3-1',
        color: 'OG',
        colorName: 'Orange',
        gauge: '1.0mm²',
        type: 'Shielded twisted pair',
        function: 'Engine speed signal',
        maxCurrent: '50mA',
        voltage: 'AC signal 1-50V'
      },
      {
        id: 'w-estop',
        from: 'estop-nc',
        to: 'pcc-j4-3',
        color: 'VT',
        colorName: 'Violet',
        gauge: '1.5mm²',
        type: 'Stranded copper',
        function: 'Emergency stop input (NC)',
        maxCurrent: '100mA',
        voltage: '24V DC'
      },
      {
        id: 'w-ct-phase',
        from: 'ct-secondary',
        to: 'pcc-ct-input',
        color: 'BK',
        colorName: 'Black',
        gauge: '2.5mm²',
        type: 'Stranded copper',
        function: 'Current transformer secondary',
        maxCurrent: '5A',
        voltage: 'CT secondary'
      }
    ],
    terminals: [
      { id: 'pcc-b+', name: 'Controller B+', x: 300, y: 50, type: 'screw-M4' },
      { id: 'pcc-b-', name: 'Controller B-', x: 300, y: 80, type: 'screw-M4' },
      { id: 'pcc-j2-5', name: 'J2 Pin 5 (Oil Press)', x: 300, y: 130, type: 'screw-M3' },
      { id: 'pcc-j2-7', name: 'J2 Pin 7 (Coolant Temp)', x: 300, y: 160, type: 'screw-M3' },
      { id: 'pcc-j3-1', name: 'J3 Pin 1 (MPU+)', x: 300, y: 210, type: 'screw-M3' },
      { id: 'pcc-j4-3', name: 'J4 Pin 3 (E-Stop)', x: 300, y: 260, type: 'screw-M3' }
    ],
    annotations: [
      { x: 150, y: 40, text: 'Install 25A fuse in B+ line' },
      { x: 350, y: 130, text: 'Use shielded cable - ground shield at controller end only' },
      { x: 350, y: 210, text: 'MPU air gap: 0.5-1.0mm' }
    ],
    safetyNotes: [
      'Disconnect battery before controller wiring',
      'Use ferrules on all stranded wire terminations',
      'Ground cable shields at one end only',
      'Never short CT secondary while primary is energized',
      'Verify E-stop circuit is normally closed'
    ],
    testPoints: [
      { id: 'tp1', name: 'Supply voltage', expectedValue: '24-28V DC', procedure: 'Measure at B+ to B-' },
      { id: 'tp2', name: 'Oil pressure sensor', expectedValue: '0.5V idle, 2-4V running', procedure: 'Measure at J2-5 to ground' },
      { id: 'tp3', name: 'MPU signal', expectedValue: '1-50V AC while cranking', procedure: 'Measure at J3-1 to J3-2' },
      { id: 'tp4', name: 'E-stop circuit', expectedValue: '24V when released', procedure: 'Measure at J4-3 to ground' }
    ]
  }
];

// Continue in next part...
export default {
  schematics: CUMMINS_SCHEMATICS,
  wiringDiagrams: CUMMINS_WIRING_DIAGRAMS
};
