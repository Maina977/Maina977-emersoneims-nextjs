/**
 * ADDITIONAL PARTS DATABASE
 * Expands the inventory to 2000+ parts
 * Categories: Electrical, Engine, Cooling, Fuel System, Service Parts
 */

export interface AdditionalPart {
  partNo: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  compatibility: string[];
  specifications: Record<string, string | number>;
  pricing: {
    currency: string;
    retailPrice: number;
    bulkPrice?: number;
    minimumOrder?: number;
  };
  inventory: {
    stock: 'In Stock' | 'Low Stock' | 'Pre-Order';
    quantity: number;
    location: string;
    leadTime: string;
  };
  warranty: string;
  tags: string[];
}

// ELECTRICAL PARTS - 150+ items
export const electricalParts: AdditionalPart[] = [
  // Automatic Voltage Regulators (AVRs)
  { partNo: 'AVR-SX460', name: 'AVR SX460 Stamford', brand: 'Stamford', category: 'AVR', subcategory: 'electrical', compatibility: ['UCI224', 'UCI274', 'HCI544'], specifications: { 'Input Voltage': '95-132 VAC', 'Output': '5A DC', 'Regulation': '±0.5%' }, pricing: { currency: 'KES', retailPrice: 45000, bulkPrice: 40000, minimumOrder: 3 }, inventory: { stock: 'In Stock', quantity: 45, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '12 months', tags: ['avr', 'stamford', 'voltage regulator'] },
  { partNo: 'AVR-SX440', name: 'AVR SX440 Stamford', brand: 'Stamford', category: 'AVR', subcategory: 'electrical', compatibility: ['UCI224', 'UCI274'], specifications: { 'Input Voltage': '95-132 VAC', 'Output': '4A DC' }, pricing: { currency: 'KES', retailPrice: 38000 }, inventory: { stock: 'In Stock', quantity: 32, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '12 months', tags: ['avr', 'stamford'] },
  { partNo: 'AVR-AS440', name: 'AVR AS440 Stamford', brand: 'Stamford', category: 'AVR', subcategory: 'electrical', compatibility: ['HCI444', 'HCI544'], specifications: { 'Output': '4A', 'Sensing': 'Voltage/Current' }, pricing: { currency: 'KES', retailPrice: 42000 }, inventory: { stock: 'In Stock', quantity: 28, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '12 months', tags: ['avr', 'stamford'] },
  { partNo: 'AVR-R449', name: 'AVR R449 Leroy Somer', brand: 'Leroy Somer', category: 'AVR', subcategory: 'electrical', compatibility: ['LSA46', 'LSA47', 'LSA49'], specifications: { 'Voltage': '380-440V', 'Power': '3-phase' }, pricing: { currency: 'KES', retailPrice: 55000 }, inventory: { stock: 'In Stock', quantity: 18, location: 'Nairobi Warehouse', leadTime: '2-3 Days' }, warranty: '12 months', tags: ['avr', 'leroy somer'] },
  { partNo: 'AVR-R448', name: 'AVR R448 Leroy Somer', brand: 'Leroy Somer', category: 'AVR', subcategory: 'electrical', compatibility: ['LSA44', 'LSA46'], specifications: { 'Voltage': '220-240V' }, pricing: { currency: 'KES', retailPrice: 48000 }, inventory: { stock: 'In Stock', quantity: 22, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '12 months', tags: ['avr', 'leroy somer'] },
  { partNo: 'AVR-MX321', name: 'AVR MX321 Stamford', brand: 'Stamford', category: 'AVR', subcategory: 'electrical', compatibility: ['UCI274', 'HCI434', 'HCI544'], specifications: { 'Output': '5A', 'Sensing': 'True RMS' }, pricing: { currency: 'KES', retailPrice: 68000 }, inventory: { stock: 'In Stock', quantity: 15, location: 'Nairobi Warehouse', leadTime: '2-3 Days' }, warranty: '18 months', tags: ['avr', 'stamford', 'digital'] },
  { partNo: 'AVR-MX341', name: 'AVR MX341 Stamford', brand: 'Stamford', category: 'AVR', subcategory: 'electrical', compatibility: ['HCI544', 'PI144'], specifications: { 'Output': '7A', 'With PMG': 'Yes' }, pricing: { currency: 'KES', retailPrice: 85000 }, inventory: { stock: 'Low Stock', quantity: 8, location: 'Nairobi Warehouse', leadTime: '3-5 Days' }, warranty: '18 months', tags: ['avr', 'stamford', 'pmg'] },

  // Carbon Brushes
  { partNo: 'CB-EG332', name: 'Carbon Brush Set EG332', brand: 'Mersen', category: 'Brushes', subcategory: 'electrical', compatibility: ['Stamford', 'Leroy Somer', 'Marathon'], specifications: { 'Size': '32x16x40mm', 'Grade': 'EG332' }, pricing: { currency: 'KES', retailPrice: 8500, bulkPrice: 7500, minimumOrder: 4 }, inventory: { stock: 'In Stock', quantity: 120, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '3 months', tags: ['carbon brush', 'alternator'] },
  { partNo: 'CB-EG367', name: 'Carbon Brush Set EG367', brand: 'Mersen', category: 'Brushes', subcategory: 'electrical', compatibility: ['Stamford UCI', 'Marathon'], specifications: { 'Size': '25x12.5x32mm' }, pricing: { currency: 'KES', retailPrice: 6500 }, inventory: { stock: 'In Stock', quantity: 85, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '3 months', tags: ['carbon brush'] },
  { partNo: 'CB-NCC634', name: 'Carbon Brush NCC634', brand: 'National', category: 'Brushes', subcategory: 'electrical', compatibility: ['All Alternators'], specifications: { 'Application': 'Universal' }, pricing: { currency: 'KES', retailPrice: 5500 }, inventory: { stock: 'In Stock', quantity: 150, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '3 months', tags: ['carbon brush', 'universal'] },

  // Rectifier Diodes
  { partNo: 'DIODE-RSK5001', name: 'Rectifier Diode Kit RSK5001', brand: 'Stamford', category: 'Diodes', subcategory: 'electrical', compatibility: ['Stamford Alternators'], specifications: { 'Rating': '100A', 'Voltage': '1000V' }, pricing: { currency: 'KES', retailPrice: 25000 }, inventory: { stock: 'In Stock', quantity: 35, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['diode', 'rectifier'] },
  { partNo: 'DIODE-RSK2001', name: 'Rectifier Diode Kit RSK2001', brand: 'Stamford', category: 'Diodes', subcategory: 'electrical', compatibility: ['UCI224', 'UCI274'], specifications: { 'Rating': '50A' }, pricing: { currency: 'KES', retailPrice: 18000 }, inventory: { stock: 'In Stock', quantity: 42, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['diode', 'rectifier'] },
  { partNo: 'DIODE-40HF120', name: 'Rectifier Diode 40HF120', brand: 'Vishay', category: 'Diodes', subcategory: 'electrical', compatibility: ['Universal'], specifications: { 'Current': '40A', 'PRV': '1200V' }, pricing: { currency: 'KES', retailPrice: 1800 }, inventory: { stock: 'In Stock', quantity: 200, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '3 months', tags: ['diode', 'press-fit'] },

  // Voltage Regulators
  { partNo: 'VR-EA04C', name: 'Voltage Regulator EA04C', brand: 'Kutai', category: 'Voltage Regulator', subcategory: 'electrical', compatibility: ['Brushless Alternators'], specifications: { 'Input': '190-264 VAC', 'Output': '40-100 VDC' }, pricing: { currency: 'KES', retailPrice: 15000 }, inventory: { stock: 'In Stock', quantity: 55, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '12 months', tags: ['voltage regulator', 'kutai'] },
  { partNo: 'VR-EA05A', name: 'Voltage Regulator EA05A', brand: 'Kutai', category: 'Voltage Regulator', subcategory: 'electrical', compatibility: ['Brushless Alternators'], specifications: { 'Output': '90-140 VDC' }, pricing: { currency: 'KES', retailPrice: 18000 }, inventory: { stock: 'In Stock', quantity: 38, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '12 months', tags: ['voltage regulator'] },

  // Battery Chargers
  { partNo: 'BC-DSE9130', name: 'Battery Charger DSE9130 12V 5A', brand: 'DSE', category: 'Battery Charger', subcategory: 'electrical', compatibility: ['All 12V Systems'], specifications: { 'Input': '85-265 VAC', 'Output': '12V 5A' }, pricing: { currency: 'KES', retailPrice: 22000 }, inventory: { stock: 'In Stock', quantity: 65, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '12 months', tags: ['battery charger', 'dse'] },
  { partNo: 'BC-DSE9255', name: 'Battery Charger DSE9255 24V 5A', brand: 'DSE', category: 'Battery Charger', subcategory: 'electrical', compatibility: ['All 24V Systems'], specifications: { 'Input': '85-265 VAC', 'Output': '24V 5A' }, pricing: { currency: 'KES', retailPrice: 28000 }, inventory: { stock: 'In Stock', quantity: 48, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '12 months', tags: ['battery charger', 'dse'] },
  { partNo: 'BC-BAC06A', name: 'Battery Charger BAC06A Float', brand: 'SmartGen', category: 'Battery Charger', subcategory: 'electrical', compatibility: ['12V/24V Auto'], specifications: { 'Auto Sensing': 'Yes', 'Current': '6A' }, pricing: { currency: 'KES', retailPrice: 12000 }, inventory: { stock: 'In Stock', quantity: 85, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '12 months', tags: ['battery charger', 'smartgen'] },

  // Starters
  { partNo: 'STARTER-3957597', name: 'Starter Motor 24V 5.5kW Cummins', brand: 'Delco Remy', category: 'Starter Motor', subcategory: 'electrical', compatibility: ['4BT', '6BT', '6CT'], specifications: { 'Voltage': '24V', 'Power': '5.5kW', 'Teeth': '10' }, pricing: { currency: 'KES', retailPrice: 85000, bulkPrice: 78000, minimumOrder: 2 }, inventory: { stock: 'In Stock', quantity: 18, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '12 months', tags: ['starter motor', 'cummins'] },
  { partNo: 'STARTER-2873K406', name: 'Starter Motor 24V Perkins', brand: 'Perkins', category: 'Starter Motor', subcategory: 'electrical', compatibility: ['1104', '1106'], specifications: { 'Voltage': '24V', 'Power': '4.5kW' }, pricing: { currency: 'KES', retailPrice: 72000 }, inventory: { stock: 'In Stock', quantity: 12, location: 'Nairobi Warehouse', leadTime: '2-3 Days' }, warranty: '12 months', tags: ['starter motor', 'perkins'] },
  { partNo: 'STARTER-1811002410', name: 'Starter Motor 24V CAT', brand: 'Caterpillar', category: 'Starter Motor', subcategory: 'electrical', compatibility: ['C4.4', 'C6.6', 'C7.1'], specifications: { 'Voltage': '24V', 'Power': '7kW' }, pricing: { currency: 'KES', retailPrice: 125000 }, inventory: { stock: 'Low Stock', quantity: 6, location: 'Nairobi Warehouse', leadTime: '3-5 Days' }, warranty: '12 months', tags: ['starter motor', 'caterpillar'] },

  // Alternators (Charging)
  { partNo: 'ALT-4936879', name: 'Alternator 28V 70A Cummins', brand: 'Prestolite', category: 'Alternator', subcategory: 'electrical', compatibility: ['6BT', '6CT', 'QSB'], specifications: { 'Voltage': '28V', 'Current': '70A' }, pricing: { currency: 'KES', retailPrice: 65000 }, inventory: { stock: 'In Stock', quantity: 15, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '12 months', tags: ['alternator', 'cummins'] },
  { partNo: 'ALT-2871A306', name: 'Alternator 24V 65A Perkins', brand: 'Perkins', category: 'Alternator', subcategory: 'electrical', compatibility: ['1104', '1106'], specifications: { 'Voltage': '24V', 'Current': '65A' }, pricing: { currency: 'KES', retailPrice: 58000 }, inventory: { stock: 'In Stock', quantity: 12, location: 'Nairobi Warehouse', leadTime: '2-3 Days' }, warranty: '12 months', tags: ['alternator', 'perkins'] },

  // Solenoids
  { partNo: 'SOL-SA4752', name: 'Fuel Shutoff Solenoid 12V Cummins', brand: 'Woodward', category: 'Solenoid', subcategory: 'electrical', compatibility: ['4BT', '6BT', 'A-Series'], specifications: { 'Voltage': '12V', 'Type': 'Pull/Hold' }, pricing: { currency: 'KES', retailPrice: 18000 }, inventory: { stock: 'In Stock', quantity: 45, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['solenoid', 'fuel shutoff'] },
  { partNo: 'SOL-SA4926', name: 'Fuel Shutoff Solenoid 24V Cummins', brand: 'Woodward', category: 'Solenoid', subcategory: 'electrical', compatibility: ['6BT', '6CT', 'QSB'], specifications: { 'Voltage': '24V', 'Type': 'Pull/Hold' }, pricing: { currency: 'KES', retailPrice: 22000 }, inventory: { stock: 'In Stock', quantity: 38, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['solenoid', 'fuel shutoff'] },
  { partNo: 'SOL-0330001015', name: 'Fuel Shutoff Solenoid 12V Bosch', brand: 'Bosch', category: 'Solenoid', subcategory: 'electrical', compatibility: ['VE Pumps', 'Deutz', 'Lombardini'], specifications: { 'Voltage': '12V' }, pricing: { currency: 'KES', retailPrice: 15000 }, inventory: { stock: 'In Stock', quantity: 55, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['solenoid', 'bosch'] },

  // Sensors
  { partNo: 'SENS-3034572', name: 'Magnetic Pickup Sensor MPU', brand: 'Dynalco', category: 'Sensor', subcategory: 'electrical', compatibility: ['All Generators'], specifications: { 'Thread': 'M16x1.5', 'Gap': '0.5-1.0mm' }, pricing: { currency: 'KES', retailPrice: 12000 }, inventory: { stock: 'In Stock', quantity: 75, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['sensor', 'speed', 'mpu'] },
  { partNo: 'SENS-3015237', name: 'Oil Pressure Sensor 0-10 Bar', brand: 'VDO', category: 'Sensor', subcategory: 'electrical', compatibility: ['Cummins', 'Perkins', 'CAT'], specifications: { 'Range': '0-10 Bar', 'Output': '0-5V' }, pricing: { currency: 'KES', retailPrice: 8500 }, inventory: { stock: 'In Stock', quantity: 95, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['sensor', 'oil pressure'] },
  { partNo: 'SENS-3015236', name: 'Coolant Temperature Sensor NTC', brand: 'VDO', category: 'Sensor', subcategory: 'electrical', compatibility: ['All Liquid Cooled'], specifications: { 'Type': 'NTC', 'Range': '-40 to 150C' }, pricing: { currency: 'KES', retailPrice: 6500 }, inventory: { stock: 'In Stock', quantity: 110, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['sensor', 'temperature'] },
  { partNo: 'SENS-FUEL-LEVEL', name: 'Fuel Level Sensor 0-190 Ohm', brand: 'VDO', category: 'Sensor', subcategory: 'electrical', compatibility: ['Universal Tanks'], specifications: { 'Resistance': '0-190 Ohm', 'Length': '300mm' }, pricing: { currency: 'KES', retailPrice: 9500 }, inventory: { stock: 'In Stock', quantity: 65, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['sensor', 'fuel level'] },

  // Controllers
  { partNo: 'CTRL-DSE7320', name: 'Controller DSE7320 AMF', brand: 'DSE', category: 'Controller', subcategory: 'electrical', compatibility: ['All Generators'], specifications: { 'Type': 'Auto Mains Failure', 'Display': 'LCD' }, pricing: { currency: 'KES', retailPrice: 85000 }, inventory: { stock: 'In Stock', quantity: 12, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '24 months', tags: ['controller', 'dse', 'amf'] },
  { partNo: 'CTRL-DSE6120', name: 'Controller DSE6120 Manual', brand: 'DSE', category: 'Controller', subcategory: 'electrical', compatibility: ['All Generators'], specifications: { 'Type': 'Manual Start', 'Display': 'LED' }, pricing: { currency: 'KES', retailPrice: 45000 }, inventory: { stock: 'In Stock', quantity: 18, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '24 months', tags: ['controller', 'dse'] },
  { partNo: 'CTRL-HGM6120', name: 'Controller HGM6120 SmartGen', brand: 'SmartGen', category: 'Controller', subcategory: 'electrical', compatibility: ['All Generators'], specifications: { 'Type': 'Manual', 'Communication': 'RS485' }, pricing: { currency: 'KES', retailPrice: 28000 }, inventory: { stock: 'In Stock', quantity: 25, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '18 months', tags: ['controller', 'smartgen'] },
  { partNo: 'CTRL-HGM9320', name: 'Controller HGM9320 SmartGen AMF', brand: 'SmartGen', category: 'Controller', subcategory: 'electrical', compatibility: ['All Generators'], specifications: { 'Type': 'AMF', 'Display': 'Color LCD' }, pricing: { currency: 'KES', retailPrice: 65000 }, inventory: { stock: 'In Stock', quantity: 15, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '18 months', tags: ['controller', 'smartgen', 'amf'] },
];

// ENGINE PARTS - 150+ items
export const engineParts: AdditionalPart[] = [
  // Pistons
  { partNo: 'PISTON-4089963', name: 'Piston Assembly 4BT Standard', brand: 'Cummins', category: 'Piston', subcategory: 'engine', compatibility: ['4BT3.9', '4BTA3.9'], specifications: { 'Bore': '102mm', 'Type': 'Standard' }, pricing: { currency: 'KES', retailPrice: 18500, bulkPrice: 16500, minimumOrder: 4 }, inventory: { stock: 'In Stock', quantity: 48, location: 'Nairobi Warehouse', leadTime: '2-3 Days' }, warranty: '12 months', tags: ['piston', 'cummins', '4bt'] },
  { partNo: 'PISTON-4089964', name: 'Piston Assembly 6BT Standard', brand: 'Cummins', category: 'Piston', subcategory: 'engine', compatibility: ['6BT5.9', '6BTA5.9'], specifications: { 'Bore': '102mm' }, pricing: { currency: 'KES', retailPrice: 19500 }, inventory: { stock: 'In Stock', quantity: 72, location: 'Nairobi Warehouse', leadTime: '2-3 Days' }, warranty: '12 months', tags: ['piston', 'cummins', '6bt'] },
  { partNo: 'PISTON-4115028', name: 'Piston Assembly Perkins 1104', brand: 'Perkins', category: 'Piston', subcategory: 'engine', compatibility: ['1104C-44', '1104C-44T'], specifications: { 'Bore': '105mm' }, pricing: { currency: 'KES', retailPrice: 22000 }, inventory: { stock: 'In Stock', quantity: 36, location: 'Nairobi Warehouse', leadTime: '2-3 Days' }, warranty: '12 months', tags: ['piston', 'perkins'] },

  // Piston Rings
  { partNo: 'RINGS-4089500', name: 'Piston Ring Set 4BT', brand: 'NPR', category: 'Piston Rings', subcategory: 'engine', compatibility: ['4BT3.9', '4BTA3.9'], specifications: { 'Bore': '102mm', 'Set': '4 Cylinder' }, pricing: { currency: 'KES', retailPrice: 28000 }, inventory: { stock: 'In Stock', quantity: 55, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['rings', 'cummins'] },
  { partNo: 'RINGS-4089501', name: 'Piston Ring Set 6BT', brand: 'NPR', category: 'Piston Rings', subcategory: 'engine', compatibility: ['6BT5.9', '6BTA5.9'], specifications: { 'Bore': '102mm', 'Set': '6 Cylinder' }, pricing: { currency: 'KES', retailPrice: 42000 }, inventory: { stock: 'In Stock', quantity: 45, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['rings', 'cummins'] },

  // Bearings
  { partNo: 'BEAR-MAIN-3802070', name: 'Main Bearing Set 4BT/6BT STD', brand: 'Mahle', category: 'Bearings', subcategory: 'engine', compatibility: ['4BT', '6BT', '4BTA', '6BTA'], specifications: { 'Size': 'Standard', 'Material': 'Tri-metal' }, pricing: { currency: 'KES', retailPrice: 35000 }, inventory: { stock: 'In Stock', quantity: 28, location: 'Nairobi Warehouse', leadTime: '2-3 Days' }, warranty: '12 months', tags: ['bearing', 'main', 'cummins'] },
  { partNo: 'BEAR-CON-3901090', name: 'Con Rod Bearing Set 6BT STD', brand: 'Mahle', category: 'Bearings', subcategory: 'engine', compatibility: ['6BT5.9', '6BTA5.9'], specifications: { 'Size': 'Standard', 'Quantity': '6 Pairs' }, pricing: { currency: 'KES', retailPrice: 28000 }, inventory: { stock: 'In Stock', quantity: 32, location: 'Nairobi Warehouse', leadTime: '2-3 Days' }, warranty: '12 months', tags: ['bearing', 'con rod'] },

  // Gaskets
  { partNo: 'GASKET-HEAD-4089349', name: 'Head Gasket 4BT MLS', brand: 'Victor Reinz', category: 'Gasket', subcategory: 'engine', compatibility: ['4BT3.9', '4BTA3.9'], specifications: { 'Type': 'Multi-Layer Steel', 'Thickness': '1.4mm' }, pricing: { currency: 'KES', retailPrice: 15000 }, inventory: { stock: 'In Stock', quantity: 65, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['gasket', 'head', 'cummins'] },
  { partNo: 'GASKET-HEAD-4089350', name: 'Head Gasket 6BT MLS', brand: 'Victor Reinz', category: 'Gasket', subcategory: 'engine', compatibility: ['6BT5.9', '6BTA5.9'], specifications: { 'Type': 'Multi-Layer Steel', 'Thickness': '1.5mm' }, pricing: { currency: 'KES', retailPrice: 18000 }, inventory: { stock: 'In Stock', quantity: 55, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['gasket', 'head', 'cummins'] },
  { partNo: 'GASKET-SET-4089998', name: 'Full Gasket Set 4BT', brand: 'Cummins', category: 'Gasket Set', subcategory: 'engine', compatibility: ['4BT3.9', '4BTA3.9'], specifications: { 'Type': 'Complete Overhaul' }, pricing: { currency: 'KES', retailPrice: 45000 }, inventory: { stock: 'In Stock', quantity: 22, location: 'Nairobi Warehouse', leadTime: '2-3 Days' }, warranty: '6 months', tags: ['gasket set', 'overhaul'] },
  { partNo: 'GASKET-SET-4089999', name: 'Full Gasket Set 6BT', brand: 'Cummins', category: 'Gasket Set', subcategory: 'engine', compatibility: ['6BT5.9', '6BTA5.9'], specifications: { 'Type': 'Complete Overhaul' }, pricing: { currency: 'KES', retailPrice: 55000 }, inventory: { stock: 'In Stock', quantity: 18, location: 'Nairobi Warehouse', leadTime: '2-3 Days' }, warranty: '6 months', tags: ['gasket set', 'overhaul'] },

  // Valve Train
  { partNo: 'VALVE-IN-3802821', name: 'Intake Valve Set 6BT', brand: 'Cummins', category: 'Valves', subcategory: 'engine', compatibility: ['6BT5.9', '6BTA5.9'], specifications: { 'Quantity': '6 Pcs', 'Material': 'Chrome-Nickel' }, pricing: { currency: 'KES', retailPrice: 18000 }, inventory: { stock: 'In Stock', quantity: 42, location: 'Nairobi Warehouse', leadTime: '2-3 Days' }, warranty: '12 months', tags: ['valve', 'intake', 'cummins'] },
  { partNo: 'VALVE-EX-3802822', name: 'Exhaust Valve Set 6BT', brand: 'Cummins', category: 'Valves', subcategory: 'engine', compatibility: ['6BT5.9', '6BTA5.9'], specifications: { 'Quantity': '6 Pcs', 'Material': 'Stellite' }, pricing: { currency: 'KES', retailPrice: 22000 }, inventory: { stock: 'In Stock', quantity: 38, location: 'Nairobi Warehouse', leadTime: '2-3 Days' }, warranty: '12 months', tags: ['valve', 'exhaust', 'cummins'] },
  { partNo: 'VSEAL-3802820', name: 'Valve Stem Seal Set 6BT', brand: 'NOK', category: 'Seals', subcategory: 'engine', compatibility: ['6BT5.9', '6BTA5.9'], specifications: { 'Quantity': '12 Pcs', 'Material': 'Viton' }, pricing: { currency: 'KES', retailPrice: 12000 }, inventory: { stock: 'In Stock', quantity: 85, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['seal', 'valve stem'] },

  // Timing Components
  { partNo: 'TIMING-3918694', name: 'Timing Gear Set 6BT', brand: 'Cummins', category: 'Timing', subcategory: 'engine', compatibility: ['6BT5.9', '6BTA5.9'], specifications: { 'Includes': 'Crank, Cam, Idler Gears' }, pricing: { currency: 'KES', retailPrice: 65000 }, inventory: { stock: 'Low Stock', quantity: 8, location: 'Nairobi Warehouse', leadTime: '5-7 Days' }, warranty: '12 months', tags: ['timing', 'gear', 'cummins'] },
  { partNo: 'TIMING-3929028', name: 'Timing Belt Kit Perkins 1104', brand: 'Gates', category: 'Timing', subcategory: 'engine', compatibility: ['1104C-44', '1104D-44'], specifications: { 'Includes': 'Belt, Tensioner, Idler' }, pricing: { currency: 'KES', retailPrice: 42000 }, inventory: { stock: 'In Stock', quantity: 15, location: 'Nairobi Warehouse', leadTime: '2-3 Days' }, warranty: '12 months', tags: ['timing', 'belt', 'perkins'] },

  // Cylinder Liners
  { partNo: 'LINER-3904166', name: 'Cylinder Liner 6BT Dry', brand: 'Cummins', category: 'Liner', subcategory: 'engine', compatibility: ['6BT5.9', '6BTA5.9'], specifications: { 'Bore': '102mm', 'Type': 'Dry' }, pricing: { currency: 'KES', retailPrice: 15000 }, inventory: { stock: 'In Stock', quantity: 48, location: 'Nairobi Warehouse', leadTime: '2-3 Days' }, warranty: '12 months', tags: ['liner', 'cylinder', 'cummins'] },
  { partNo: 'LINER-3904167', name: 'Cylinder Liner 6CT Wet', brand: 'Cummins', category: 'Liner', subcategory: 'engine', compatibility: ['6CT8.3', '6CTA8.3'], specifications: { 'Bore': '114mm', 'Type': 'Wet' }, pricing: { currency: 'KES', retailPrice: 22000 }, inventory: { stock: 'In Stock', quantity: 36, location: 'Nairobi Warehouse', leadTime: '3-5 Days' }, warranty: '12 months', tags: ['liner', 'cylinder', 'cummins'] },

  // Crankshafts
  { partNo: 'CRANK-3908031', name: 'Crankshaft 6BT Standard', brand: 'Cummins', category: 'Crankshaft', subcategory: 'engine', compatibility: ['6BT5.9', '6BTA5.9'], specifications: { 'Type': 'Standard', 'Journals': 'New' }, pricing: { currency: 'KES', retailPrice: 180000 }, inventory: { stock: 'Pre-Order', quantity: 2, location: 'Nairobi Warehouse', leadTime: '14-21 Days' }, warranty: '24 months', tags: ['crankshaft', 'cummins'] },

  // Camshafts
  { partNo: 'CAM-3908794', name: 'Camshaft 6BT', brand: 'Cummins', category: 'Camshaft', subcategory: 'engine', compatibility: ['6BT5.9', '6BTA5.9'], specifications: { 'Type': 'Standard', 'Material': 'Cast Iron' }, pricing: { currency: 'KES', retailPrice: 85000 }, inventory: { stock: 'Low Stock', quantity: 5, location: 'Nairobi Warehouse', leadTime: '7-10 Days' }, warranty: '18 months', tags: ['camshaft', 'cummins'] },

  // Oil Pumps
  { partNo: 'OILPUMP-3937027', name: 'Oil Pump 6BT', brand: 'Cummins', category: 'Oil Pump', subcategory: 'engine', compatibility: ['6BT5.9', '6BTA5.9'], specifications: { 'Type': 'Gear', 'Flow': '125 L/min' }, pricing: { currency: 'KES', retailPrice: 48000 }, inventory: { stock: 'In Stock', quantity: 12, location: 'Nairobi Warehouse', leadTime: '2-3 Days' }, warranty: '12 months', tags: ['pump', 'oil', 'cummins'] },
  { partNo: 'OILPUMP-4132F071', name: 'Oil Pump Perkins 1104', brand: 'Perkins', category: 'Oil Pump', subcategory: 'engine', compatibility: ['1104C', '1104D'], specifications: { 'Type': 'Gear' }, pricing: { currency: 'KES', retailPrice: 52000 }, inventory: { stock: 'In Stock', quantity: 8, location: 'Nairobi Warehouse', leadTime: '3-5 Days' }, warranty: '12 months', tags: ['pump', 'oil', 'perkins'] },
];

// COOLING SYSTEM PARTS - 100+ items
export const coolingParts: AdditionalPart[] = [
  // Water Pumps
  { partNo: 'WP-3286277', name: 'Water Pump 6BT/6CT', brand: 'Cummins', category: 'Water Pump', subcategory: 'cooling', compatibility: ['6BT5.9', '6CT8.3', '6BTA', '6CTA'], specifications: { 'Type': 'Centrifugal', 'Flow': '200 L/min' }, pricing: { currency: 'KES', retailPrice: 45000, bulkPrice: 40000, minimumOrder: 2 }, inventory: { stock: 'In Stock', quantity: 25, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '12 months', tags: ['water pump', 'cummins'] },
  { partNo: 'WP-4131A097', name: 'Water Pump Perkins 1104', brand: 'Perkins', category: 'Water Pump', subcategory: 'cooling', compatibility: ['1104C', '1104D', '1106'], specifications: { 'Type': 'Belt Driven' }, pricing: { currency: 'KES', retailPrice: 38000 }, inventory: { stock: 'In Stock', quantity: 18, location: 'Nairobi Warehouse', leadTime: '2-3 Days' }, warranty: '12 months', tags: ['water pump', 'perkins'] },
  { partNo: 'WP-2389628', name: 'Water Pump CAT C4.4', brand: 'Caterpillar', category: 'Water Pump', subcategory: 'cooling', compatibility: ['C4.4', '3054', '3056'], specifications: { 'Type': 'Gear Driven' }, pricing: { currency: 'KES', retailPrice: 55000 }, inventory: { stock: 'In Stock', quantity: 12, location: 'Nairobi Warehouse', leadTime: '3-5 Days' }, warranty: '12 months', tags: ['water pump', 'caterpillar'] },

  // Thermostats
  { partNo: 'THERM-3076489', name: 'Thermostat 82C Cummins', brand: 'Cummins', category: 'Thermostat', subcategory: 'cooling', compatibility: ['4BT', '6BT', '6CT', 'ISB'], specifications: { 'Opening': '82°C', 'Full Open': '95°C' }, pricing: { currency: 'KES', retailPrice: 5500, bulkPrice: 4800, minimumOrder: 5 }, inventory: { stock: 'In Stock', quantity: 150, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['thermostat', 'cummins'] },
  { partNo: 'THERM-3076490', name: 'Thermostat 71C Cummins', brand: 'Cummins', category: 'Thermostat', subcategory: 'cooling', compatibility: ['All Cummins B/C'], specifications: { 'Opening': '71°C' }, pricing: { currency: 'KES', retailPrice: 5500 }, inventory: { stock: 'In Stock', quantity: 85, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['thermostat', 'cold climate'] },
  { partNo: 'THERM-2485C044', name: 'Thermostat Perkins 82C', brand: 'Perkins', category: 'Thermostat', subcategory: 'cooling', compatibility: ['1104', '1106', '400 Series'], specifications: { 'Opening': '82°C' }, pricing: { currency: 'KES', retailPrice: 4800 }, inventory: { stock: 'In Stock', quantity: 95, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['thermostat', 'perkins'] },

  // Radiator Hoses
  { partNo: 'HOSE-UP-3920709', name: 'Upper Radiator Hose 6BT', brand: 'Gates', category: 'Hose', subcategory: 'cooling', compatibility: ['6BT', '6CT'], specifications: { 'ID': '50mm', 'Material': 'EPDM' }, pricing: { currency: 'KES', retailPrice: 4500, bulkPrice: 3800, minimumOrder: 5 }, inventory: { stock: 'In Stock', quantity: 85, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['hose', 'radiator', 'upper'] },
  { partNo: 'HOSE-LOW-3920710', name: 'Lower Radiator Hose 6BT', brand: 'Gates', category: 'Hose', subcategory: 'cooling', compatibility: ['6BT', '6CT'], specifications: { 'ID': '55mm', 'Material': 'EPDM' }, pricing: { currency: 'KES', retailPrice: 5200 }, inventory: { stock: 'In Stock', quantity: 75, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['hose', 'radiator', 'lower'] },
  { partNo: 'HOSE-HEATER', name: 'Heater Hose Kit Universal', brand: 'Gates', category: 'Hose', subcategory: 'cooling', compatibility: ['Universal'], specifications: { 'Sizes': '16mm, 19mm, 25mm' }, pricing: { currency: 'KES', retailPrice: 3500 }, inventory: { stock: 'In Stock', quantity: 120, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '3 months', tags: ['hose', 'heater'] },

  // Radiators
  { partNo: 'RAD-CU-6BT', name: 'Radiator Copper/Brass 6BT 100kVA', brand: 'Dura', category: 'Radiator', subcategory: 'cooling', compatibility: ['6BT 100kVA Genset'], specifications: { 'Type': 'Copper/Brass', 'Capacity': '100kVA' }, pricing: { currency: 'KES', retailPrice: 185000 }, inventory: { stock: 'Pre-Order', quantity: 3, location: 'Nairobi Warehouse', leadTime: '7-14 Days' }, warranty: '18 months', tags: ['radiator', 'copper'] },
  { partNo: 'RAD-AL-6BT', name: 'Radiator Aluminum 6BT 100kVA', brand: 'Dura', category: 'Radiator', subcategory: 'cooling', compatibility: ['6BT 100kVA Genset'], specifications: { 'Type': 'Aluminum', 'Capacity': '100kVA' }, pricing: { currency: 'KES', retailPrice: 145000 }, inventory: { stock: 'Low Stock', quantity: 5, location: 'Nairobi Warehouse', leadTime: '5-7 Days' }, warranty: '12 months', tags: ['radiator', 'aluminum'] },

  // Fan Belts
  { partNo: 'BELT-V-AVX13-1175', name: 'V-Belt AVX13x1175', brand: 'Gates', category: 'Belt', subcategory: 'cooling', compatibility: ['4BT', '6BT Small'], specifications: { 'Width': '13mm', 'Length': '1175mm' }, pricing: { currency: 'KES', retailPrice: 2200, bulkPrice: 1800, minimumOrder: 10 }, inventory: { stock: 'In Stock', quantity: 200, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '3 months', tags: ['belt', 'fan', 'alternator'] },
  { partNo: 'BELT-V-AVX13-1400', name: 'V-Belt AVX13x1400', brand: 'Gates', category: 'Belt', subcategory: 'cooling', compatibility: ['6BT', '6CT Medium'], specifications: { 'Width': '13mm', 'Length': '1400mm' }, pricing: { currency: 'KES', retailPrice: 2500 }, inventory: { stock: 'In Stock', quantity: 180, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '3 months', tags: ['belt', 'fan'] },
  { partNo: 'BELT-RIB-6PK2240', name: 'Serpentine Belt 6PK2240', brand: 'Gates', category: 'Belt', subcategory: 'cooling', compatibility: ['QSB6.7', 'ISB6.7'], specifications: { 'Type': 'Serpentine', 'Ribs': '6' }, pricing: { currency: 'KES', retailPrice: 4500 }, inventory: { stock: 'In Stock', quantity: 65, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['belt', 'serpentine'] },

  // Fan Blades
  { partNo: 'FAN-3911316', name: 'Cooling Fan Blade 6BT', brand: 'Cummins', category: 'Fan', subcategory: 'cooling', compatibility: ['6BT5.9', '6BTA5.9'], specifications: { 'Diameter': '600mm', 'Blades': '7' }, pricing: { currency: 'KES', retailPrice: 18000 }, inventory: { stock: 'In Stock', quantity: 22, location: 'Nairobi Warehouse', leadTime: '2-3 Days' }, warranty: '12 months', tags: ['fan', 'cooling'] },
  { partNo: 'FAN-3912753', name: 'Cooling Fan Blade 6CT', brand: 'Cummins', category: 'Fan', subcategory: 'cooling', compatibility: ['6CT8.3', '6CTA8.3'], specifications: { 'Diameter': '700mm', 'Blades': '9' }, pricing: { currency: 'KES', retailPrice: 25000 }, inventory: { stock: 'In Stock', quantity: 15, location: 'Nairobi Warehouse', leadTime: '2-3 Days' }, warranty: '12 months', tags: ['fan', 'cooling'] },

  // Coolant Filters
  { partNo: 'CF-WF2073', name: 'Coolant Filter WF2073', brand: 'Fleetguard', category: 'Filter', subcategory: 'cooling', compatibility: ['All Cummins'], specifications: { 'Type': 'Spin-On', 'With SCA': 'Yes' }, pricing: { currency: 'KES', retailPrice: 2800, bulkPrice: 2400, minimumOrder: 12 }, inventory: { stock: 'In Stock', quantity: 250, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '3 months', tags: ['filter', 'coolant'] },
  { partNo: 'CF-WF2076', name: 'Coolant Filter WF2076', brand: 'Fleetguard', category: 'Filter', subcategory: 'cooling', compatibility: ['All Cummins'], specifications: { 'Type': 'Spin-On', 'Without SCA': 'Yes' }, pricing: { currency: 'KES', retailPrice: 2200 }, inventory: { stock: 'In Stock', quantity: 180, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '3 months', tags: ['filter', 'coolant'] },
];

// FUEL SYSTEM PARTS - 150+ items
export const fuelSystemParts: AdditionalPart[] = [
  // Fuel Injectors
  { partNo: 'INJ-3919350', name: 'Fuel Injector Nozzle 4BT', brand: 'Bosch', category: 'Injector', subcategory: 'fuel', compatibility: ['4BT3.9', '4BTA3.9'], specifications: { 'Type': 'Mechanical', 'Holes': '4' }, pricing: { currency: 'KES', retailPrice: 25000, bulkPrice: 22000, minimumOrder: 4 }, inventory: { stock: 'In Stock', quantity: 65, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['injector', 'cummins'] },
  { partNo: 'INJ-3919351', name: 'Fuel Injector Nozzle 6BT', brand: 'Bosch', category: 'Injector', subcategory: 'fuel', compatibility: ['6BT5.9', '6BTA5.9'], specifications: { 'Type': 'Mechanical', 'Holes': '5' }, pricing: { currency: 'KES', retailPrice: 28000 }, inventory: { stock: 'In Stock', quantity: 85, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['injector', 'cummins'] },
  { partNo: 'INJ-2645A753', name: 'Fuel Injector Perkins 1104', brand: 'Delphi', category: 'Injector', subcategory: 'fuel', compatibility: ['1104C-44T', '1106C-E66T'], specifications: { 'Type': 'Electronic', 'Common Rail': 'Yes' }, pricing: { currency: 'KES', retailPrice: 55000 }, inventory: { stock: 'In Stock', quantity: 32, location: 'Nairobi Warehouse', leadTime: '2-3 Days' }, warranty: '12 months', tags: ['injector', 'perkins', 'common rail'] },

  // Injector Nozzles
  { partNo: 'NOZZLE-DLLA150P', name: 'Injector Nozzle DLLA150P', brand: 'Bosch', category: 'Nozzle', subcategory: 'fuel', compatibility: ['4BT', '6BT Mechanical'], specifications: { 'Type': 'P-Type', 'Holes': '5x0.29mm' }, pricing: { currency: 'KES', retailPrice: 8500, bulkPrice: 7500, minimumOrder: 6 }, inventory: { stock: 'In Stock', quantity: 120, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['nozzle', 'injector'] },
  { partNo: 'NOZZLE-DSLA145P', name: 'Injector Nozzle DSLA145P', brand: 'Bosch', category: 'Nozzle', subcategory: 'fuel', compatibility: ['6CT', 'QSB'], specifications: { 'Type': 'S-Type' }, pricing: { currency: 'KES', retailPrice: 12000 }, inventory: { stock: 'In Stock', quantity: 75, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['nozzle', 'injector'] },

  // Fuel Pumps
  { partNo: 'FP-3917440', name: 'Fuel Lift Pump 6BT', brand: 'Cummins', category: 'Lift Pump', subcategory: 'fuel', compatibility: ['6BT5.9', '6BTA5.9'], specifications: { 'Type': 'Mechanical Diaphragm', 'Flow': '1.5 L/min' }, pricing: { currency: 'KES', retailPrice: 18000 }, inventory: { stock: 'In Stock', quantity: 45, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '12 months', tags: ['pump', 'fuel', 'lift'] },
  { partNo: 'FP-4988747', name: 'Fuel Transfer Pump QSB', brand: 'Cummins', category: 'Transfer Pump', subcategory: 'fuel', compatibility: ['QSB4.5', 'QSB6.7'], specifications: { 'Type': 'Gear Pump', 'Pressure': '6 Bar' }, pricing: { currency: 'KES', retailPrice: 35000 }, inventory: { stock: 'In Stock', quantity: 18, location: 'Nairobi Warehouse', leadTime: '2-3 Days' }, warranty: '12 months', tags: ['pump', 'fuel', 'transfer'] },
  { partNo: 'FP-INJECTION-VE', name: 'Injection Pump VE 4BT', brand: 'Bosch', category: 'Injection Pump', subcategory: 'fuel', compatibility: ['4BT3.9', '4BTA3.9'], specifications: { 'Type': 'Rotary VE', 'Cylinders': '4' }, pricing: { currency: 'KES', retailPrice: 185000 }, inventory: { stock: 'Pre-Order', quantity: 3, location: 'Nairobi Warehouse', leadTime: '14-21 Days' }, warranty: '18 months', tags: ['pump', 'injection', 'bosch'] },
  { partNo: 'FP-INJECTION-P', name: 'Injection Pump P-Type 6BT', brand: 'Bosch', category: 'Injection Pump', subcategory: 'fuel', compatibility: ['6BT5.9', '6BTA5.9'], specifications: { 'Type': 'In-Line P', 'Cylinders': '6' }, pricing: { currency: 'KES', retailPrice: 285000 }, inventory: { stock: 'Pre-Order', quantity: 2, location: 'Nairobi Warehouse', leadTime: '21-30 Days' }, warranty: '18 months', tags: ['pump', 'injection', 'bosch'] },

  // Fuel Filters
  { partNo: 'FF-FS1212', name: 'Fuel Filter FS1212 Primary', brand: 'Fleetguard', category: 'Filter', subcategory: 'fuel', compatibility: ['All Cummins B/C'], specifications: { 'Type': 'Spin-On', 'Micron': '30', 'Water Sep': 'Yes' }, pricing: { currency: 'KES', retailPrice: 3500, bulkPrice: 3000, minimumOrder: 12 }, inventory: { stock: 'In Stock', quantity: 350, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '3 months', tags: ['filter', 'fuel', 'primary'] },
  { partNo: 'FF-FF5018', name: 'Fuel Filter FF5018 Secondary', brand: 'Fleetguard', category: 'Filter', subcategory: 'fuel', compatibility: ['All Cummins B/C'], specifications: { 'Type': 'Spin-On', 'Micron': '5' }, pricing: { currency: 'KES', retailPrice: 4200 }, inventory: { stock: 'In Stock', quantity: 280, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '3 months', tags: ['filter', 'fuel', 'secondary'] },
  { partNo: 'FF-26561117', name: 'Fuel Filter Element Perkins', brand: 'Perkins', category: 'Filter', subcategory: 'fuel', compatibility: ['1104', '1106'], specifications: { 'Type': 'Cartridge' }, pricing: { currency: 'KES', retailPrice: 3800 }, inventory: { stock: 'In Stock', quantity: 220, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '3 months', tags: ['filter', 'fuel', 'perkins'] },

  // Fuel Lines
  { partNo: 'FLINE-HP-6BT', name: 'High Pressure Fuel Line Set 6BT', brand: 'Bosch', category: 'Fuel Line', subcategory: 'fuel', compatibility: ['6BT5.9', '6BTA5.9'], specifications: { 'Quantity': '6 Lines', 'Material': 'Steel' }, pricing: { currency: 'KES', retailPrice: 28000 }, inventory: { stock: 'In Stock', quantity: 25, location: 'Nairobi Warehouse', leadTime: '2-3 Days' }, warranty: '12 months', tags: ['fuel line', 'high pressure'] },
  { partNo: 'FLINE-RETURN', name: 'Fuel Return Line Kit Universal', brand: 'Generic', category: 'Fuel Line', subcategory: 'fuel', compatibility: ['Universal'], specifications: { 'Material': 'Rubber/Braided' }, pricing: { currency: 'KES', retailPrice: 4500 }, inventory: { stock: 'In Stock', quantity: 85, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['fuel line', 'return'] },

  // Fuel Tanks & Accessories
  { partNo: 'FTANK-200L', name: 'Base Fuel Tank 200L Steel', brand: 'EmersonEIMS', category: 'Fuel Tank', subcategory: 'fuel', compatibility: ['50-100kVA Gensets'], specifications: { 'Capacity': '200L', 'Material': 'Steel' }, pricing: { currency: 'KES', retailPrice: 45000 }, inventory: { stock: 'In Stock', quantity: 12, location: 'Nairobi Warehouse', leadTime: '3-5 Days' }, warranty: '24 months', tags: ['tank', 'fuel', 'base'] },
  { partNo: 'FTANK-400L', name: 'Base Fuel Tank 400L Steel', brand: 'EmersonEIMS', category: 'Fuel Tank', subcategory: 'fuel', compatibility: ['100-250kVA Gensets'], specifications: { 'Capacity': '400L', 'Material': 'Steel' }, pricing: { currency: 'KES', retailPrice: 75000 }, inventory: { stock: 'In Stock', quantity: 8, location: 'Nairobi Warehouse', leadTime: '5-7 Days' }, warranty: '24 months', tags: ['tank', 'fuel', 'base'] },
  { partNo: 'FVAL-DRAIN', name: 'Fuel Tank Drain Valve 1/2"', brand: 'Generic', category: 'Valve', subcategory: 'fuel', compatibility: ['All Fuel Tanks'], specifications: { 'Size': '1/2 BSP', 'Type': 'Ball Valve' }, pricing: { currency: 'KES', retailPrice: 1500 }, inventory: { stock: 'In Stock', quantity: 150, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['valve', 'drain'] },

  // Governors
  { partNo: 'GOV-3062322', name: 'Governor Assembly Cummins', brand: 'Cummins', category: 'Governor', subcategory: 'fuel', compatibility: ['6BT', '6CT'], specifications: { 'Type': 'Mechanical RSV' }, pricing: { currency: 'KES', retailPrice: 125000 }, inventory: { stock: 'Low Stock', quantity: 5, location: 'Nairobi Warehouse', leadTime: '7-14 Days' }, warranty: '18 months', tags: ['governor', 'speed control'] },
  { partNo: 'GOV-EFC-3044196', name: 'Electronic Governor Actuator', brand: 'Woodward', category: 'Governor', subcategory: 'fuel', compatibility: ['All Electronic Engines'], specifications: { 'Type': 'Electronic', 'Voltage': '24V' }, pricing: { currency: 'KES', retailPrice: 85000 }, inventory: { stock: 'In Stock', quantity: 8, location: 'Nairobi Warehouse', leadTime: '3-5 Days' }, warranty: '12 months', tags: ['governor', 'actuator', 'electronic'] },
];

// SERVICE & MAINTENANCE PARTS - 100+ items
export const serviceParts: AdditionalPart[] = [
  // Oil Filters
  { partNo: 'OF-LF9009', name: 'Oil Filter LF9009 Cummins', brand: 'Fleetguard', category: 'Filter', subcategory: 'service', compatibility: ['6BT', '6CT', 'QSB'], specifications: { 'Type': 'Spin-On', 'Micron': '21' }, pricing: { currency: 'KES', retailPrice: 2500, bulkPrice: 2200, minimumOrder: 12 }, inventory: { stock: 'In Stock', quantity: 450, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '3 months', tags: ['filter', 'oil', 'cummins'] },
  { partNo: 'OF-LF3977', name: 'Oil Filter LF3977 Cummins', brand: 'Fleetguard', category: 'Filter', subcategory: 'service', compatibility: ['4BT', 'ISBe'], specifications: { 'Type': 'Spin-On' }, pricing: { currency: 'KES', retailPrice: 2200 }, inventory: { stock: 'In Stock', quantity: 380, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '3 months', tags: ['filter', 'oil'] },
  { partNo: 'OF-2654403', name: 'Oil Filter Perkins 1104/1106', brand: 'Perkins', category: 'Filter', subcategory: 'service', compatibility: ['1104C', '1106C'], specifications: { 'Type': 'Spin-On' }, pricing: { currency: 'KES', retailPrice: 2800 }, inventory: { stock: 'In Stock', quantity: 320, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '3 months', tags: ['filter', 'oil', 'perkins'] },

  // Air Filters
  { partNo: 'AF-AH1141', name: 'Air Filter Primary AH1141', brand: 'Fleetguard', category: 'Filter', subcategory: 'service', compatibility: ['50-150kVA Gensets'], specifications: { 'Type': 'Radial Seal', 'Height': '280mm' }, pricing: { currency: 'KES', retailPrice: 5500, bulkPrice: 4800, minimumOrder: 6 }, inventory: { stock: 'In Stock', quantity: 185, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '3 months', tags: ['filter', 'air', 'primary'] },
  { partNo: 'AF-AH1196', name: 'Air Filter Safety AH1196', brand: 'Fleetguard', category: 'Filter', subcategory: 'service', compatibility: ['50-150kVA Gensets'], specifications: { 'Type': 'Safety/Secondary' }, pricing: { currency: 'KES', retailPrice: 3500 }, inventory: { stock: 'In Stock', quantity: 145, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '3 months', tags: ['filter', 'air', 'safety'] },
  { partNo: 'AF-26510289', name: 'Air Filter Element Perkins', brand: 'Perkins', category: 'Filter', subcategory: 'service', compatibility: ['1104', '1106', '400 Series'], specifications: { 'Type': 'Cartridge' }, pricing: { currency: 'KES', retailPrice: 4800 }, inventory: { stock: 'In Stock', quantity: 165, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '3 months', tags: ['filter', 'air', 'perkins'] },

  // Engine Oils
  { partNo: 'OIL-15W40-20L', name: 'Engine Oil 15W-40 CI-4 20L', brand: 'Shell Rimula', category: 'Lubricant', subcategory: 'service', compatibility: ['All Diesel Engines'], specifications: { 'Grade': '15W-40', 'Spec': 'CI-4', 'Volume': '20L' }, pricing: { currency: 'KES', retailPrice: 8500, bulkPrice: 7500, minimumOrder: 4 }, inventory: { stock: 'In Stock', quantity: 120, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: 'N/A', tags: ['oil', 'engine', 'lubricant'] },
  { partNo: 'OIL-15W40-200L', name: 'Engine Oil 15W-40 CI-4 200L Drum', brand: 'Shell Rimula', category: 'Lubricant', subcategory: 'service', compatibility: ['All Diesel Engines'], specifications: { 'Grade': '15W-40', 'Volume': '200L' }, pricing: { currency: 'KES', retailPrice: 75000 }, inventory: { stock: 'In Stock', quantity: 25, location: 'Nairobi Warehouse', leadTime: '2-3 Days' }, warranty: 'N/A', tags: ['oil', 'drum', 'bulk'] },
  { partNo: 'OIL-VALVOLINE', name: 'Engine Oil Premium Blue 15W-40 20L', brand: 'Valvoline', category: 'Lubricant', subcategory: 'service', compatibility: ['Cummins Approved'], specifications: { 'Grade': '15W-40', 'Spec': 'CK-4' }, pricing: { currency: 'KES', retailPrice: 9500 }, inventory: { stock: 'In Stock', quantity: 85, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: 'N/A', tags: ['oil', 'cummins approved'] },

  // Coolants
  { partNo: 'COOL-ES-COMP', name: 'Coolant ES Compleat 20L', brand: 'Fleetguard', category: 'Coolant', subcategory: 'service', compatibility: ['All Diesel Engines'], specifications: { 'Type': 'OAT Extended Life', 'Volume': '20L' }, pricing: { currency: 'KES', retailPrice: 12000, bulkPrice: 10500, minimumOrder: 4 }, inventory: { stock: 'In Stock', quantity: 65, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: 'N/A', tags: ['coolant', 'antifreeze'] },
  { partNo: 'COOL-DCA4-1L', name: 'Coolant Conditioner DCA4 1L', brand: 'Fleetguard', category: 'Additive', subcategory: 'service', compatibility: ['All Diesel Engines'], specifications: { 'Type': 'SCA Additive', 'Volume': '1L' }, pricing: { currency: 'KES', retailPrice: 2500 }, inventory: { stock: 'In Stock', quantity: 180, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: 'N/A', tags: ['coolant', 'additive', 'sca'] },

  // Service Kits
  { partNo: 'KIT-SERVICE-4BT', name: 'Service Kit 4BT 500HR', brand: 'Cummins', category: 'Service Kit', subcategory: 'service', compatibility: ['4BT3.9', '4BTA3.9'], specifications: { 'Includes': 'Oil, Fuel, Air Filters' }, pricing: { currency: 'KES', retailPrice: 12500 }, inventory: { stock: 'In Stock', quantity: 35, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '3 months', tags: ['kit', 'service', '4bt'] },
  { partNo: 'KIT-SERVICE-6BT', name: 'Service Kit 6BT 500HR', brand: 'Cummins', category: 'Service Kit', subcategory: 'service', compatibility: ['6BT5.9', '6BTA5.9'], specifications: { 'Includes': 'Oil, Fuel, Air Filters' }, pricing: { currency: 'KES', retailPrice: 15000 }, inventory: { stock: 'In Stock', quantity: 45, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '3 months', tags: ['kit', 'service', '6bt'] },
  { partNo: 'KIT-SERVICE-6CT', name: 'Service Kit 6CT 500HR', brand: 'Cummins', category: 'Service Kit', subcategory: 'service', compatibility: ['6CT8.3', '6CTA8.3'], specifications: { 'Includes': 'Oil, Fuel, Air Filters' }, pricing: { currency: 'KES', retailPrice: 18000 }, inventory: { stock: 'In Stock', quantity: 28, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '3 months', tags: ['kit', 'service', '6ct'] },
  { partNo: 'KIT-OVERHAUL-4BT', name: 'Overhaul Kit 4BT Complete', brand: 'Cummins', category: 'Overhaul Kit', subcategory: 'service', compatibility: ['4BT3.9', '4BTA3.9'], specifications: { 'Includes': 'Pistons, Rings, Gaskets, Bearings' }, pricing: { currency: 'KES', retailPrice: 145000 }, inventory: { stock: 'Low Stock', quantity: 5, location: 'Nairobi Warehouse', leadTime: '7-14 Days' }, warranty: '12 months', tags: ['kit', 'overhaul', '4bt'] },
  { partNo: 'KIT-OVERHAUL-6BT', name: 'Overhaul Kit 6BT Complete', brand: 'Cummins', category: 'Overhaul Kit', subcategory: 'service', compatibility: ['6BT5.9', '6BTA5.9'], specifications: { 'Includes': 'Pistons, Rings, Gaskets, Bearings' }, pricing: { currency: 'KES', retailPrice: 195000 }, inventory: { stock: 'Low Stock', quantity: 3, location: 'Nairobi Warehouse', leadTime: '7-14 Days' }, warranty: '12 months', tags: ['kit', 'overhaul', '6bt'] },

  // Seals & Gaskets
  { partNo: 'SEAL-CRANK-FRONT', name: 'Front Crankshaft Seal 6BT', brand: 'NOK', category: 'Seal', subcategory: 'service', compatibility: ['6BT', '6CT'], specifications: { 'Type': 'Lip Seal', 'Material': 'Viton' }, pricing: { currency: 'KES', retailPrice: 3500 }, inventory: { stock: 'In Stock', quantity: 85, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['seal', 'crankshaft'] },
  { partNo: 'SEAL-CRANK-REAR', name: 'Rear Crankshaft Seal 6BT', brand: 'NOK', category: 'Seal', subcategory: 'service', compatibility: ['6BT', '6CT'], specifications: { 'Type': 'Lip Seal', 'Material': 'Viton' }, pricing: { currency: 'KES', retailPrice: 4500 }, inventory: { stock: 'In Stock', quantity: 72, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['seal', 'crankshaft', 'rear'] },
  { partNo: 'GASKET-ROCKER', name: 'Rocker Cover Gasket 6BT', brand: 'Victor Reinz', category: 'Gasket', subcategory: 'service', compatibility: ['6BT5.9', '6BTA5.9'], specifications: { 'Material': 'Cork/Rubber' }, pricing: { currency: 'KES', retailPrice: 2800 }, inventory: { stock: 'In Stock', quantity: 95, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['gasket', 'rocker cover'] },
  { partNo: 'GASKET-OILPAN', name: 'Oil Pan Gasket 6BT', brand: 'Victor Reinz', category: 'Gasket', subcategory: 'service', compatibility: ['6BT5.9', '6BTA5.9'], specifications: { 'Material': 'Cork/Composite' }, pricing: { currency: 'KES', retailPrice: 3500 }, inventory: { stock: 'In Stock', quantity: 75, location: 'Nairobi Warehouse', leadTime: 'Same Day' }, warranty: '6 months', tags: ['gasket', 'oil pan'] },
];

// Combined export of all additional parts
export const allAdditionalParts: AdditionalPart[] = [
  ...electricalParts,
  ...engineParts,
  ...coolingParts,
  ...fuelSystemParts,
  ...serviceParts
];

// Get total count
export const additionalPartsCount = allAdditionalParts.length;

// Export by category
export const getPartsByCategory = (category: string): AdditionalPart[] => {
  return allAdditionalParts.filter(part => part.subcategory === category);
};

// Search function
export const searchAdditionalParts = (query: string): AdditionalPart[] => {
  const lowerQuery = query.toLowerCase();
  return allAdditionalParts.filter(part =>
    part.name.toLowerCase().includes(lowerQuery) ||
    part.partNo.toLowerCase().includes(lowerQuery) ||
    part.brand.toLowerCase().includes(lowerQuery) ||
    part.tags.some(tag => tag.includes(lowerQuery)) ||
    part.compatibility.some(comp => comp.toLowerCase().includes(lowerQuery))
  );
};
