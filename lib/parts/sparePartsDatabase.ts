/**
 * COMPREHENSIVE SPARE PARTS DATABASE - AMAZON/ALIBABA STYLE
 *
 * Complete parts catalog with:
 * - Real part numbers
 * - Detailed specifications
 * - Compatibility matrices
 * - Pricing tiers
 * - Image references
 * - Stock status
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export interface SparePart {
  id: string;
  partNumber: string;
  name: string;
  brand: string;
  category: PartCategory;
  subcategory: string;
  description: string;
  images: PartImage[];
  specifications: Record<string, string>;
  compatibility: Compatibility[];
  pricing: PartPricing;
  inventory: InventoryStatus;
  shipping: ShippingInfo;
  warranty: string;
  tags: string[];
  related: string[];
  reviews: PartReview[];
  documents: PartDocument[];
}

export type PartCategory =
  | 'filters'
  | 'belts'
  | 'electrical'
  | 'fuel-system'
  | 'cooling'
  | 'engine'
  | 'alternator'
  | 'controls'
  | 'solar'
  | 'battery'
  | 'inverter'
  | 'tools';

export interface PartImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  type: 'product' | 'diagram' | 'installation' | 'dimension';
}

export interface Compatibility {
  machineType: 'Generator' | 'Solar' | 'Inverter' | 'Battery' | 'UPS' | 'Motor' | 'Controller';
  brand: string;
  model: string;
  years?: string;
  notes?: string;
}

export interface PartPricing {
  currency: string;
  retailPrice: number;
  bulkPrice?: number;
  bulkMinQty?: number;
  wholesalePrice?: number;
  wholesaleMinQty?: number;
  discount?: number;
  discountEndDate?: string;
}

export interface InventoryStatus {
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'pre-order' | 'discontinued';
  quantity: number;
  location: string;
  leadTime?: string;
  nextArrival?: string;
}

export interface ShippingInfo {
  weight: number;
  dimensions: { length: number; width: number; height: number };
  freeShipping: boolean;
  shippingCost?: number;
  deliveryDays: { min: number; max: number };
}

export interface PartReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
}

export interface PartDocument {
  name: string;
  type: 'datasheet' | 'manual' | 'schematic' | 'certificate';
  url: string;
  size: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FILTERS - COMPLETE CATALOG
// ═══════════════════════════════════════════════════════════════════════════════

export const FILTER_PARTS: SparePart[] = [
  {
    id: 'lf9009',
    partNumber: 'LF9009',
    name: 'Cummins Oil Filter LF9009',
    brand: 'Cummins',
    category: 'filters',
    subcategory: 'oil-filters',
    description: 'Premium oil filter for Cummins QSK, QSX, QST, and QSL series engines. Full-flow lube filter with premium filtration media for extended drain intervals.',
    images: [
      { url: '/images/parts/filters/lf9009-main.jpg', alt: 'Cummins LF9009 Oil Filter', isPrimary: true, type: 'product' },
      { url: '/images/parts/filters/lf9009-cutaway.jpg', alt: 'LF9009 Cutaway View', isPrimary: false, type: 'diagram' },
      { url: '/images/parts/filters/lf9009-dimensions.jpg', alt: 'LF9009 Dimensions', isPrimary: false, type: 'dimension' }
    ],
    specifications: {
      'Filter Type': 'Full-flow, spin-on',
      'Thread Size': '1 3/8-16 UN',
      'Outer Diameter': '131mm',
      'Length': '262mm',
      'Bypass Valve': 'Yes - 25 psi',
      'Anti-Drainback Valve': 'Yes',
      'Filtration Rating': '10 micron',
      'Efficiency': '98.7% at 10 micron',
      'Service Interval': '500 hours or per OEM'
    },
    compatibility: [
      { machineType: 'Generator', brand: 'Cummins', model: 'QSK23', years: '2010-2024', notes: 'All variants' },
      { machineType: 'Generator', brand: 'Cummins', model: 'QSK38', years: '2008-2024', notes: 'All variants' },
      { machineType: 'Generator', brand: 'Cummins', model: 'QSK50', years: '2005-2024', notes: 'All variants' },
      { machineType: 'Generator', brand: 'Cummins', model: 'QSK60', years: '2005-2024', notes: 'All variants' },
      { machineType: 'Generator', brand: 'Cummins', model: 'QSX15', years: '2008-2024', notes: 'All variants' },
      { machineType: 'Generator', brand: 'Cummins', model: 'QST30', years: '2010-2024', notes: 'All variants' }
    ],
    pricing: {
      currency: 'KES',
      retailPrice: 8500,
      bulkPrice: 7200,
      bulkMinQty: 5,
      wholesalePrice: 6500,
      wholesaleMinQty: 20
    },
    inventory: {
      status: 'in-stock',
      quantity: 85,
      location: 'Nairobi Warehouse',
      leadTime: 'Same day dispatch'
    },
    shipping: {
      weight: 2.1,
      dimensions: { length: 15, width: 15, height: 28 },
      freeShipping: true,
      deliveryDays: { min: 1, max: 3 }
    },
    warranty: '12 months from purchase',
    tags: ['oil filter', 'cummins', 'qsk', 'qsx', 'genuine', 'lube filter'],
    related: ['lf9001', 'lf14000', 'af25708', 'ff5485'],
    reviews: [
      {
        id: 'r1',
        author: 'John M.',
        rating: 5,
        title: 'Genuine quality',
        comment: 'Installed on our QSK23 genset. Fit perfectly and oil pressure remained stable.',
        date: '2024-02-15',
        verified: true,
        helpful: 12
      },
      {
        id: 'r2',
        author: 'Peter K.',
        rating: 5,
        title: 'Fast delivery',
        comment: 'Ordered and received within 24 hours in Nairobi. Great service.',
        date: '2024-01-28',
        verified: true,
        helpful: 8
      }
    ],
    documents: [
      { name: 'LF9009 Data Sheet', type: 'datasheet', url: '/docs/lf9009-datasheet.pdf', size: '245 KB' },
      { name: 'Filtration Product Bulletin', type: 'manual', url: '/docs/cummins-filtration-bulletin.pdf', size: '1.2 MB' }
    ]
  },
  {
    id: 'ff5485',
    partNumber: 'FF5485',
    name: 'Cummins Fuel Filter FF5485',
    brand: 'Cummins',
    category: 'filters',
    subcategory: 'fuel-filters',
    description: 'High-efficiency fuel filter for Cummins ISB, ISC, ISL, ISM, and ISX engines. Features Stratapore media technology for superior water separation and contaminant removal.',
    images: [
      { url: '/images/parts/filters/ff5485-main.jpg', alt: 'Cummins FF5485 Fuel Filter', isPrimary: true, type: 'product' },
      { url: '/images/parts/filters/ff5485-cross-section.jpg', alt: 'FF5485 Cross Section', isPrimary: false, type: 'diagram' }
    ],
    specifications: {
      'Filter Type': 'Primary fuel filter',
      'Thread Size': '1-14 UNS',
      'Outer Diameter': '93mm',
      'Length': '176mm',
      'Filtration Rating': '5 micron',
      'Efficiency': '98.7% at 5 micron',
      'Water Separation': '95%',
      'Flow Rate': '450 liters/hour',
      'Service Interval': '250 hours or per OEM'
    },
    compatibility: [
      { machineType: 'Generator', brand: 'Cummins', model: 'ISB6.7', years: '2007-2024' },
      { machineType: 'Generator', brand: 'Cummins', model: 'ISL9', years: '2010-2024' },
      { machineType: 'Generator', brand: 'Cummins', model: 'ISX12', years: '2010-2024' },
      { machineType: 'Generator', brand: 'Cummins', model: 'ISX15', years: '2010-2024' },
      { machineType: 'Generator', brand: 'Cummins', model: 'QSB6.7', years: '2007-2024' }
    ],
    pricing: {
      currency: 'KES',
      retailPrice: 4500,
      bulkPrice: 3800,
      bulkMinQty: 10,
      wholesalePrice: 3200,
      wholesaleMinQty: 50
    },
    inventory: {
      status: 'in-stock',
      quantity: 150,
      location: 'Nairobi Warehouse',
      leadTime: 'Same day dispatch'
    },
    shipping: {
      weight: 0.8,
      dimensions: { length: 10, width: 10, height: 20 },
      freeShipping: true,
      deliveryDays: { min: 1, max: 3 }
    },
    warranty: '12 months from purchase',
    tags: ['fuel filter', 'cummins', 'isx', 'isb', 'primary filter', 'stratapore'],
    related: ['fs1000', 'fs19732', 'lf9009', 'af25708'],
    reviews: [],
    documents: [
      { name: 'FF5485 Specifications', type: 'datasheet', url: '/docs/ff5485-spec.pdf', size: '180 KB' }
    ]
  },
  {
    id: 'af25708',
    partNumber: 'AF25708',
    name: 'Cummins Air Filter AF25708',
    brand: 'Cummins',
    category: 'filters',
    subcategory: 'air-filters',
    description: 'Primary air filter element for Cummins high-horsepower engines. OptiAir technology provides superior dust holding capacity and consistent restriction.',
    images: [
      { url: '/images/parts/filters/af25708-main.jpg', alt: 'Cummins AF25708 Air Filter', isPrimary: true, type: 'product' },
      { url: '/images/parts/filters/af25708-installation.jpg', alt: 'AF25708 Installation', isPrimary: false, type: 'installation' }
    ],
    specifications: {
      'Filter Type': 'Primary radial seal',
      'Outer Diameter': '350mm',
      'Inner Diameter': '215mm',
      'Length': '600mm',
      'Filtration Rating': '2.5 micron',
      'Efficiency': '99.9% at 2.5 micron',
      'Dust Holding Capacity': '1200g',
      'Service Interval': '500 hours or per restriction indicator'
    },
    compatibility: [
      { machineType: 'Generator', brand: 'Cummins', model: 'QSK38', years: '2010-2024' },
      { machineType: 'Generator', brand: 'Cummins', model: 'QSK50', years: '2010-2024' },
      { machineType: 'Generator', brand: 'Cummins', model: 'QSK60', years: '2010-2024' },
      { machineType: 'Generator', brand: 'Cummins', model: 'KTA50', years: '2000-2024' }
    ],
    pricing: {
      currency: 'KES',
      retailPrice: 18500,
      bulkPrice: 15800,
      bulkMinQty: 3,
      wholesalePrice: 14000,
      wholesaleMinQty: 10
    },
    inventory: {
      status: 'in-stock',
      quantity: 25,
      location: 'Nairobi Warehouse',
      leadTime: 'Same day dispatch'
    },
    shipping: {
      weight: 5.5,
      dimensions: { length: 40, width: 40, height: 65 },
      freeShipping: false,
      shippingCost: 1500,
      deliveryDays: { min: 1, max: 3 }
    },
    warranty: '12 months from purchase',
    tags: ['air filter', 'cummins', 'primary', 'qsk', 'heavy duty', 'optiair'],
    related: ['af25714', 'lf9009', 'ff5485'],
    reviews: [],
    documents: []
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// ELECTRICAL PARTS
// ═══════════════════════════════════════════════════════════════════════════════

export const ELECTRICAL_PARTS: SparePart[] = [
  {
    id: 'sx460',
    partNumber: 'SX460',
    name: 'Stamford SX460 AVR',
    brand: 'Stamford',
    category: 'electrical',
    subcategory: 'avr',
    description: 'Industry-standard automatic voltage regulator for brushless generators. Provides stable voltage regulation with ±1% accuracy. Used in Stamford, Newage, Leroy Somer, and other alternators.',
    images: [
      { url: '/images/parts/electrical/sx460-main.jpg', alt: 'Stamford SX460 AVR', isPrimary: true, type: 'product' },
      { url: '/images/parts/electrical/sx460-wiring.jpg', alt: 'SX460 Wiring Diagram', isPrimary: false, type: 'diagram' },
      { url: '/images/parts/electrical/sx460-pcb.jpg', alt: 'SX460 PCB View', isPrimary: false, type: 'product' }
    ],
    specifications: {
      'Input Voltage': '95-132V AC or 190-264V AC',
      'Frequency': '50/60 Hz',
      'Output': '0-80V DC at 3A max',
      'Voltage Regulation': '±1%',
      'Build-up Voltage': '4V residual',
      'Sensing': 'Single phase',
      'Under Frequency Roll-off': 'Yes, adjustable',
      'Dimensions': '150mm x 100mm x 45mm',
      'Operating Temp': '-40°C to +70°C'
    },
    compatibility: [
      { machineType: 'Generator', brand: 'Stamford', model: 'UCI/UCM Series', notes: 'All models' },
      { machineType: 'Generator', brand: 'Stamford', model: 'HCI/HCM Series', notes: 'All models' },
      { machineType: 'Generator', brand: 'Newage', model: 'STA Series', notes: 'Replacement' },
      { machineType: 'Generator', brand: 'Leroy Somer', model: 'LSA Series', notes: 'Alternative to R449' },
      { machineType: 'Generator', brand: 'Mecc Alte', model: 'ECO Series', notes: 'Replacement option' }
    ],
    pricing: {
      currency: 'KES',
      retailPrice: 28500,
      bulkPrice: 24000,
      bulkMinQty: 3,
      wholesalePrice: 21000,
      wholesaleMinQty: 10
    },
    inventory: {
      status: 'in-stock',
      quantity: 35,
      location: 'Nairobi Warehouse',
      leadTime: 'Same day dispatch'
    },
    shipping: {
      weight: 0.5,
      dimensions: { length: 18, width: 12, height: 6 },
      freeShipping: true,
      deliveryDays: { min: 1, max: 2 }
    },
    warranty: '6 months from purchase',
    tags: ['avr', 'voltage regulator', 'stamford', 'sx460', 'alternator', 'generator'],
    related: ['sx440', 'mx321', 'r449', 'carbon-brush-set'],
    reviews: [
      {
        id: 'r1',
        author: 'Technical Engineer',
        rating: 5,
        title: 'Perfect replacement',
        comment: 'Direct replacement for failed unit on our Stamford HCM534. Voltage stable within spec.',
        date: '2024-03-01',
        verified: true,
        helpful: 15
      }
    ],
    documents: [
      { name: 'SX460 Data Sheet', type: 'datasheet', url: '/docs/sx460-datasheet.pdf', size: '450 KB' },
      { name: 'SX460 Wiring Manual', type: 'manual', url: '/docs/sx460-wiring-manual.pdf', size: '1.1 MB' },
      { name: 'SX460 Schematic', type: 'schematic', url: '/docs/sx460-schematic.pdf', size: '280 KB' }
    ]
  },
  {
    id: 'as440',
    partNumber: 'AS440',
    name: 'Stamford AS440 AVR',
    brand: 'Stamford',
    category: 'electrical',
    subcategory: 'avr',
    description: 'Advanced AVR with enhanced protection features including adjustable soft start, over-excitation limit, and under frequency protection. For Stamford and compatible alternators.',
    images: [
      { url: '/images/parts/electrical/as440-main.jpg', alt: 'Stamford AS440 AVR', isPrimary: true, type: 'product' },
      { url: '/images/parts/electrical/as440-wiring.jpg', alt: 'AS440 Wiring Diagram', isPrimary: false, type: 'diagram' }
    ],
    specifications: {
      'Input Voltage': '95-132V AC or 190-264V AC',
      'Frequency': '50/60 Hz',
      'Output': '0-90V DC at 4A max',
      'Voltage Regulation': '±0.5%',
      'Soft Start': 'Adjustable 0-30 seconds',
      'Over Excitation': 'Built-in protection',
      'Sensing': 'Single or three phase',
      'Communication': 'Optional USB/RS485',
      'Dimensions': '165mm x 110mm x 50mm'
    },
    compatibility: [
      { machineType: 'Generator', brand: 'Stamford', model: 'All Series', notes: 'Premium replacement' },
      { machineType: 'Generator', brand: 'Leroy Somer', model: 'LSA Series', notes: 'Alternative' },
      { machineType: 'Generator', brand: 'Marathon', model: 'DVR Series', notes: 'Compatible' }
    ],
    pricing: {
      currency: 'KES',
      retailPrice: 45000,
      bulkPrice: 38000,
      bulkMinQty: 3,
      wholesalePrice: 33000,
      wholesaleMinQty: 10
    },
    inventory: {
      status: 'in-stock',
      quantity: 15,
      location: 'Nairobi Warehouse',
      leadTime: 'Same day dispatch'
    },
    shipping: {
      weight: 0.6,
      dimensions: { length: 20, width: 15, height: 7 },
      freeShipping: true,
      deliveryDays: { min: 1, max: 2 }
    },
    warranty: '12 months from purchase',
    tags: ['avr', 'voltage regulator', 'stamford', 'as440', 'advanced avr'],
    related: ['sx460', 'mx321', 'r449'],
    reviews: [],
    documents: [
      { name: 'AS440 Data Sheet', type: 'datasheet', url: '/docs/as440-datasheet.pdf', size: '520 KB' },
      { name: 'AS440 Installation Manual', type: 'manual', url: '/docs/as440-manual.pdf', size: '2.3 MB' }
    ]
  },
  {
    id: 'carbon-brush-6x16x25',
    partNumber: 'CB-6X16X25-CU',
    name: 'Carbon Brush Set (6x16x25mm) with Copper',
    brand: 'Generic OEM Quality',
    category: 'electrical',
    subcategory: 'carbon-brushes',
    description: 'High-quality carbon brushes with copper content for improved conductivity. Common size fitting many generators and motors. Sold as set of 2.',
    images: [
      { url: '/images/parts/electrical/carbon-brush-6x16x25-main.jpg', alt: 'Carbon Brush 6x16x25mm', isPrimary: true, type: 'product' },
      { url: '/images/parts/electrical/carbon-brush-measurement.jpg', alt: 'Brush Measurement Guide', isPrimary: false, type: 'diagram' }
    ],
    specifications: {
      'Dimensions': '6mm x 16mm x 25mm',
      'Material': 'Carbon graphite with copper',
      'Grade': 'EG89',
      'Current Capacity': '15A per brush',
      'Wear Rate': 'Low',
      'Quantity': '2 pieces per set',
      'Terminal': 'Copper pigtail wire',
      'Wire Length': '35mm'
    },
    compatibility: [
      { machineType: 'Generator', brand: 'Stamford', model: 'UCI224', notes: 'Check brush holder' },
      { machineType: 'Generator', brand: 'Leroy Somer', model: 'LSA42.2', notes: 'Verify dimensions' },
      { machineType: 'Motor', brand: 'Various', model: 'Universal fit', notes: 'Check exact dimensions' }
    ],
    pricing: {
      currency: 'KES',
      retailPrice: 3500,
      bulkPrice: 2800,
      bulkMinQty: 10,
      wholesalePrice: 2200,
      wholesaleMinQty: 50
    },
    inventory: {
      status: 'in-stock',
      quantity: 200,
      location: 'Nairobi Warehouse',
      leadTime: 'Same day dispatch'
    },
    shipping: {
      weight: 0.1,
      dimensions: { length: 5, width: 3, height: 3 },
      freeShipping: true,
      deliveryDays: { min: 1, max: 2 }
    },
    warranty: '6 months from purchase',
    tags: ['carbon brush', 'generator', 'motor', 'exciter', 'brush set'],
    related: ['sx460', 'brush-holder'],
    reviews: [],
    documents: []
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// CONTROLLER PARTS
// ═══════════════════════════════════════════════════════════════════════════════

export const CONTROLLER_PARTS: SparePart[] = [
  {
    id: 'dse-7320',
    partNumber: 'DSE7320',
    name: 'DeepSea DSE7320 Auto Mains Failure Controller',
    brand: 'DeepSea Electronics',
    category: 'controls',
    subcategory: 'controllers',
    description: 'Advanced AMF controller with color display, Ethernet, CAN bus, and comprehensive protection. Industry standard for commercial and industrial generators.',
    images: [
      { url: '/images/parts/controllers/dse7320-main.jpg', alt: 'DSE7320 Controller', isPrimary: true, type: 'product' },
      { url: '/images/parts/controllers/dse7320-wiring.jpg', alt: 'DSE7320 Wiring Diagram', isPrimary: false, type: 'diagram' },
      { url: '/images/parts/controllers/dse7320-dimensions.jpg', alt: 'DSE7320 Dimensions', isPrimary: false, type: 'dimension' }
    ],
    specifications: {
      'Supply Voltage': '8-35V DC',
      'Display': '4.3" TFT Color LCD',
      'Inputs': '16 configurable',
      'Outputs': '10 configurable',
      'Communication': 'Ethernet, RS232, RS485, CAN J1939, USB',
      'Protection Functions': '32+',
      'Event Log': '200+ events',
      'Operating Temp': '-30°C to +70°C',
      'Protection Rating': 'IP65 (front)',
      'Cutout Size': '220mm x 160mm'
    },
    compatibility: [
      { machineType: 'Generator', brand: 'Cummins', model: 'All electronic engines', notes: 'Via CAN J1939' },
      { machineType: 'Generator', brand: 'Perkins', model: 'All electronic engines', notes: 'Via CAN J1939' },
      { machineType: 'Generator', brand: 'Volvo Penta', model: 'All TAD series', notes: 'Via CAN J1939' },
      { machineType: 'Generator', brand: 'John Deere', model: 'PowerTech', notes: 'Via CAN J1939' },
      { machineType: 'Generator', brand: 'Caterpillar', model: 'All electronic', notes: 'Via CAN J1939' }
    ],
    pricing: {
      currency: 'KES',
      retailPrice: 145000,
      bulkPrice: 125000,
      bulkMinQty: 3,
      wholesalePrice: 110000,
      wholesaleMinQty: 10
    },
    inventory: {
      status: 'in-stock',
      quantity: 8,
      location: 'Nairobi Warehouse',
      leadTime: 'Same day dispatch'
    },
    shipping: {
      weight: 1.1,
      dimensions: { length: 28, width: 22, height: 8 },
      freeShipping: true,
      deliveryDays: { min: 1, max: 2 }
    },
    warranty: '24 months from purchase',
    tags: ['controller', 'dse', 'amf', 'generator controller', 'deep sea'],
    related: ['dse-4520', 'dse-8610', 'dse-battery-charger'],
    reviews: [
      {
        id: 'r1',
        author: 'Power Systems Ltd',
        rating: 5,
        title: 'Industry standard for good reason',
        comment: 'We use DSE7320 on all our genset installations. Reliable, easy to configure, excellent support.',
        date: '2024-02-20',
        verified: true,
        helpful: 28
      }
    ],
    documents: [
      { name: 'DSE7320 Data Sheet', type: 'datasheet', url: '/docs/dse7320-datasheet.pdf', size: '1.8 MB' },
      { name: 'DSE7320 Installation Manual', type: 'manual', url: '/docs/dse7320-manual.pdf', size: '8.5 MB' },
      { name: 'DSE7320 Wiring Diagram', type: 'schematic', url: '/docs/dse7320-wiring.pdf', size: '2.1 MB' }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// SOLAR PARTS
// ═══════════════════════════════════════════════════════════════════════════════

export const SOLAR_PARTS: SparePart[] = [
  {
    id: 'mppt-150-35',
    partNumber: 'SCC115110310',
    name: 'Victron SmartSolar MPPT 150/35',
    brand: 'Victron Energy',
    category: 'solar',
    subcategory: 'mppt-controller',
    description: 'Premium MPPT solar charge controller with 150V input and 35A output. Features Bluetooth built-in, VE.Direct communication, and advanced tracking for maximum solar harvest.',
    images: [
      { url: '/images/parts/solar/victron-mppt-150-35-main.jpg', alt: 'Victron MPPT 150/35', isPrimary: true, type: 'product' },
      { url: '/images/parts/solar/victron-mppt-wiring.jpg', alt: 'MPPT Wiring Diagram', isPrimary: false, type: 'diagram' }
    ],
    specifications: {
      'PV Voltage Max': '150V',
      'Charge Current': '35A',
      'Battery Voltage': '12/24/48V auto-detect',
      'Max PV Power (48V)': '2000W',
      'Efficiency': '98%',
      'Communication': 'Bluetooth, VE.Direct',
      'Display': 'Via app',
      'Operating Temp': '-30°C to +60°C',
      'Protection Rating': 'IP43'
    },
    compatibility: [
      { machineType: 'Solar', brand: 'Any', model: 'PV panels up to 150Voc', notes: 'Check Voc at low temperature' },
      { machineType: 'Battery', brand: 'Pylontech', model: 'All models', notes: 'Via CAN' },
      { machineType: 'Battery', brand: 'BYD', model: 'All B-Box', notes: 'Via CAN' },
      { machineType: 'Inverter', brand: 'Victron', model: 'All MultiPlus/Quattro', notes: 'Via VE.Direct' }
    ],
    pricing: {
      currency: 'KES',
      retailPrice: 52000,
      bulkPrice: 45000,
      bulkMinQty: 3,
      wholesalePrice: 40000,
      wholesaleMinQty: 10
    },
    inventory: {
      status: 'in-stock',
      quantity: 22,
      location: 'Nairobi Warehouse',
      leadTime: 'Same day dispatch'
    },
    shipping: {
      weight: 1.3,
      dimensions: { length: 22, width: 10, height: 7 },
      freeShipping: true,
      deliveryDays: { min: 1, max: 2 }
    },
    warranty: '5 years',
    tags: ['mppt', 'solar charger', 'victron', 'smartsolar', 'charge controller'],
    related: ['mppt-250-70', 've-direct-cable', 'battery-temp-sensor'],
    reviews: [],
    documents: [
      { name: 'SmartSolar MPPT Manual', type: 'manual', url: '/docs/victron-mppt-manual.pdf', size: '3.2 MB' },
      { name: 'MPPT Calculator', type: 'datasheet', url: '/docs/mppt-calculator.xlsx', size: '45 KB' }
    ]
  },
  {
    id: 'pylontech-us3000c',
    partNumber: 'US3000C',
    name: 'Pylontech US3000C 3.5kWh Battery',
    brand: 'Pylontech',
    category: 'battery',
    subcategory: 'lithium-battery',
    description: 'Premium LiFePO4 battery module with integrated BMS. 3.5kWh capacity, stackable up to 8 units in parallel. Industry-leading 6000+ cycle life.',
    images: [
      { url: '/images/parts/battery/pylontech-us3000c-main.jpg', alt: 'Pylontech US3000C', isPrimary: true, type: 'product' },
      { url: '/images/parts/battery/pylontech-stack.jpg', alt: 'Battery Stack Configuration', isPrimary: false, type: 'installation' }
    ],
    specifications: {
      'Nominal Capacity': '3.5kWh',
      'Nominal Voltage': '48V (51.2V)',
      'Usable Capacity': '90% DoD',
      'Cycle Life': '6000+ cycles at 90% DoD',
      'Chemistry': 'LiFePO4',
      'Max Charge/Discharge': '37A continuous, 74A peak',
      'Communication': 'CAN, RS485',
      'Parallel Units': 'Up to 8 (28kWh)',
      'Weight': '36kg',
      'Dimensions': '442 x 420 x 132mm'
    },
    compatibility: [
      { machineType: 'Inverter', brand: 'Victron', model: 'MultiPlus II, Quattro', notes: 'CAN integration' },
      { machineType: 'Inverter', brand: 'Growatt', model: 'SPF/SPH/MIN', notes: 'RS485/CAN' },
      { machineType: 'Inverter', brand: 'Deye', model: 'All hybrid models', notes: 'CAN BMS' },
      { machineType: 'Inverter', brand: 'Sunsynk', model: 'All models', notes: 'CAN BMS' }
    ],
    pricing: {
      currency: 'KES',
      retailPrice: 185000,
      bulkPrice: 165000,
      bulkMinQty: 4,
      wholesalePrice: 150000,
      wholesaleMinQty: 10
    },
    inventory: {
      status: 'in-stock',
      quantity: 45,
      location: 'Nairobi Warehouse',
      leadTime: 'Same day dispatch'
    },
    shipping: {
      weight: 36,
      dimensions: { length: 45, width: 43, height: 15 },
      freeShipping: false,
      shippingCost: 2500,
      deliveryDays: { min: 1, max: 3 }
    },
    warranty: '10 years',
    tags: ['battery', 'pylontech', 'lithium', 'lifepo4', '48v', 'solar storage'],
    related: ['pylontech-us5000', 'pylontech-bracket', 'can-cable'],
    reviews: [
      {
        id: 'r1',
        author: 'Solar Kenya Ltd',
        rating: 5,
        title: 'Best value lithium battery',
        comment: 'We have installed over 100 US3000C units. Zero failures after 2+ years. Great communication with inverters.',
        date: '2024-03-10',
        verified: true,
        helpful: 45
      }
    ],
    documents: [
      { name: 'US3000C Data Sheet', type: 'datasheet', url: '/docs/pylontech-us3000c-datasheet.pdf', size: '850 KB' },
      { name: 'Installation Manual', type: 'manual', url: '/docs/pylontech-installation.pdf', size: '2.8 MB' }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const getAllParts = (): SparePart[] => [
  ...FILTER_PARTS,
  ...ELECTRICAL_PARTS,
  ...CONTROLLER_PARTS,
  ...SOLAR_PARTS
];

export const getPartById = (id: string): SparePart | undefined =>
  getAllParts().find(p => p.id === id);

export const getPartsByCategory = (category: PartCategory): SparePart[] =>
  getAllParts().filter(p => p.category === category);

export const searchParts = (query: string): SparePart[] => {
  const q = query.toLowerCase();
  return getAllParts().filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.partNumber.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q)) ||
    p.brand.toLowerCase().includes(q)
  );
};

export const getCompatibleParts = (machineType: string, brand: string, model: string): SparePart[] =>
  getAllParts().filter(p =>
    p.compatibility.some(c =>
      c.machineType.toLowerCase() === machineType.toLowerCase() &&
      (c.brand.toLowerCase() === brand.toLowerCase() || c.brand === 'Any') &&
      (c.model.toLowerCase().includes(model.toLowerCase()) || c.model.includes('All'))
    )
  );

export const getRelatedParts = (partId: string): SparePart[] => {
  const part = getPartById(partId);
  if (!part) return [];
  return part.related.map(id => getPartById(id)).filter((p): p is SparePart => p !== undefined);
};

// Categories with counts
export const getCategories = (): { category: PartCategory; count: number; name: string }[] => {
  const allParts = getAllParts();
  const categories: { category: PartCategory; name: string }[] = [
    { category: 'filters', name: 'Filters' },
    { category: 'electrical', name: 'Electrical' },
    { category: 'fuel-system', name: 'Fuel System' },
    { category: 'cooling', name: 'Cooling' },
    { category: 'engine', name: 'Engine Parts' },
    { category: 'alternator', name: 'Alternator' },
    { category: 'controls', name: 'Controllers' },
    { category: 'solar', name: 'Solar' },
    { category: 'battery', name: 'Batteries' },
    { category: 'inverter', name: 'Inverters' },
    { category: 'tools', name: 'Tools' }
  ];

  return categories.map(c => ({
    ...c,
    count: allParts.filter(p => p.category === c.category).length
  }));
};
