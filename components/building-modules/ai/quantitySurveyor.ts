// lib/ai/quantitySurveyor.ts

import { DesignData } from '@/types/design';
import { BOQ, BOQCategory, BOQItem } from '@/types/boq';
import { DEFAULT_PRICES } from '@/lib/utils/constants';

export async function generateBOQ(designData: DesignData, location: any): Promise<BOQ> {
  const categories: BOQCategory[] = [];
  
  // 1. Site Works
  categories.push(calculateSiteWorks(designData));
  
  // 2. Foundation & Structure
  categories.push(calculateFoundationStructure(designData));
  
  // 3. Masonry
  categories.push(calculateMasonry(designData));
  
  // 4. Roofing
  categories.push(calculateRoofing(designData));
  
  // 5. Finishes
  categories.push(calculateFinishes(designData));
  
  // 6. Doors & Windows
  categories.push(calculateDoorsWindows(designData));
  
  // 7. Joinery & Woodwork
  categories.push(calculateJoinery(designData));
  
  // 8. Electrical
  categories.push(calculateElectrical(designData));
  
  // 9. Plumbing
  categories.push(calculatePlumbing(designData));
  
  // 10. External Works
  categories.push(calculateExternalWorks(designData));
  
  // 11. Amenities
  if (designData.amenities) {
    categories.push(calculateAmenities(designData));
  }
  
  // Calculate totals
  let totalCost = 0;
  let materialCost = 0;
  let laborCost = 0;
  
  for (const category of categories) {
    totalCost += category.subtotal;
    for (const item of category.items) {
      materialCost += item.totalPrice;
    }
  }
  
  // Labor is typically 25-35% of material cost
  laborCost = materialCost * (DEFAULT_PRICES.labor_rate as number);
  
  // Transport (estimated 5% of material cost)
  const transportCost = materialCost * 0.05;
  
  // Equipment hire (estimated 3% of material cost)
  const equipmentCost = materialCost * 0.03;
  
  // Contingency (10% of material + labor)
  const contingency = (materialCost + laborCost) * (DEFAULT_PRICES.contingency_rate as number);
  
  // Overhead & Profit (15% of material + labor)
  const overhead = (materialCost + laborCost) * (DEFAULT_PRICES.overhead_rate as number);
  
  const grandTotal = materialCost + laborCost + transportCost + equipmentCost + contingency + overhead;
  
  return {
    id: '',
    projectId: '',
    totalAreaSqm: designData.totalAreaSqm,
    categories,
    totalCost: grandTotal,
    materialCost,
    laborCost,
    transportCost,
    equipmentCost,
    contingency,
    overhead,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function calculateSiteWorks(designData: DesignData): BOQCategory {
  const items: BOQItem[] = [];
  const area = designData.totalAreaSqm * 1.5; // Approximate site area
  
  items.push({
    id: crypto.randomUUID(),
    material: 'Site Clearing',
    description: 'Clearing vegetation and debris',
    unit: 'sqm',
    quantity: area,
    unitPrice: DEFAULT_PRICES.site_clearing || 100,
    totalPrice: area * (DEFAULT_PRICES.site_clearing || 100),
  });
  
  items.push({
    id: crypto.randomUUID(),
    material: 'Excavation',
    description: 'Excavation for foundation',
    unit: 'm3',
    quantity: designData.foundation.excavationVolumeM3 || designData.foundation.areaSqm * 0.6,
    unitPrice: DEFAULT_PRICES.excavation || 800,
    totalPrice: (designData.foundation.excavationVolumeM3 || designData.foundation.areaSqm * 0.6) * (DEFAULT_PRICES.excavation || 800),
  });
  
  items.push({
    id: crypto.randomUUID(),
    material: 'Hardcore Filling',
    description: 'Hardcore for foundation bed',
    unit: 'm3',
    quantity: designData.foundation.areaSqm * 0.3,
    unitPrice: DEFAULT_PRICES.hardcore || 2500,
    totalPrice: designData.foundation.areaSqm * 0.3 * (DEFAULT_PRICES.hardcore || 2500),
  });
  
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  return {
    name: 'Site Works',
    items,
    subtotal,
  };
}

function calculateFoundationStructure(designData: DesignData): BOQCategory {
  const items: BOQItem[] = [];
  
  // Concrete
  const concreteVolume = designData.foundation.concreteVolumeM3;
  const cementBags = concreteVolume * 7; // Approx 7 bags per m3
  const sandTons = concreteVolume * 0.6;
  const ballastTons = concreteVolume * 0.8;
  
  items.push({
    id: crypto.randomUUID(),
    material: 'Cement',
    description: 'Ordinary Portland Cement',
    unit: 'bags',
    quantity: cementBags,
    unitPrice: DEFAULT_PRICES.cement || 650,
    totalPrice: cementBags * (DEFAULT_PRICES.cement || 650),
  });
  
  items.push({
    id: crypto.randomUUID(),
    material: 'Sand',
    description: 'Sharp sand for concrete',
    unit: 'tons',
    quantity: sandTons,
    unitPrice: DEFAULT_PRICES.sand || 2500,
    totalPrice: sandTons * (DEFAULT_PRICES.sand || 2500),
  });
  
  items.push({
    id: crypto.randomUUID(),
    material: 'Ballast',
    description: 'Crushed stone ballast',
    unit: 'tons',
    quantity: ballastTons,
    unitPrice: DEFAULT_PRICES.ballast || 3000,
    totalPrice: ballastTons * (DEFAULT_PRICES.ballast || 3000),
  });
  
  // Steel reinforcement
  const steelKg = designData.foundation.reinforcement.totalKg;
  items.push({
    id: crypto.randomUUID(),
    material: 'Steel Reinforcement',
    description: 'High tensile steel bars',
    unit: 'kg',
    quantity: steelKg,
    unitPrice: DEFAULT_PRICES.steel || 120,
    totalPrice: steelKg * (DEFAULT_PRICES.steel || 120),
  });
  
  // Formwork
  const formworkM2 = designData.foundation.areaSqm * 1.2;
  items.push({
    id: crypto.randomUUID(),
    material: 'Formwork',
    description: 'Timber formwork',
    unit: 'sqm',
    quantity: formworkM2,
    unitPrice: DEFAULT_PRICES.formwork || 350,
    totalPrice: formworkM2 * (DEFAULT_PRICES.formwork || 350),
  });
  
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  return {
    name: 'Foundation & Structure',
    items,
    subtotal,
  };
}

function calculateMasonry(designData: DesignData): BOQCategory {
  const items: BOQItem[] = [];
  
  const wallLength = designData.walls.externalLengthM + designData.walls.internalLengthM;
  const wallArea = wallLength * designData.walls.heightM;
  const bricksPerSqm = 50; // Approx 50 bricks per sqm for 6" wall
  
  const brickCount = wallArea * bricksPerSqm;
  
  items.push({
    id: crypto.randomUUID(),
    material: 'Bricks',
    description: '6" concrete bricks',
    unit: 'pieces',
    quantity: brickCount,
    unitPrice: DEFAULT_PRICES.bricks || 50,
    totalPrice: brickCount * (DEFAULT_PRICES.bricks || 50),
  });
  
  const mortarCementBags = wallArea * 0.15;
  const mortarSandTons = wallArea * 0.03;
  
  items.push({
    id: crypto.randomUUID(),
    material: 'Cement (Mortar)',
    description: 'Cement for mortar',
    unit: 'bags',
    quantity: mortarCementBags,
    unitPrice: DEFAULT_PRICES.cement || 650,
    totalPrice: mortarCementBags * (DEFAULT_PRICES.cement || 650),
  });
  
  items.push({
    id: crypto.randomUUID(),
    material: 'Sand (Mortar)',
    description: 'Sand for mortar',
    unit: 'tons',
    quantity: mortarSandTons,
    unitPrice: DEFAULT_PRICES.sand || 2500,
    totalPrice: mortarSandTons * (DEFAULT_PRICES.sand || 2500),
  });
  
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  return {
    name: 'Masonry',
    items,
    subtotal,
  };
}

function calculateRoofing(designData: DesignData): BOQCategory {
  const items: BOQItem[] = [];
  
  const roofArea = designData.roof.areaSqm;
  const ironSheets = Math.ceil(roofArea / 2.5); // Approx 2.5 sqm per sheet
  
  items.push({
    id: crypto.randomUUID(),
    material: 'Iron Sheets',
    description: 'Gauge 30 iron sheets',
    unit: 'sheets',
    quantity: ironSheets,
    unitPrice: DEFAULT_PRICES.iron_sheets || 700,
    totalPrice: ironSheets * (DEFAULT_PRICES.iron_sheets || 700),
  });
  
  // Timber for trusses and purlins
  const timberM3 = roofArea * 0.02;
  items.push({
    id: crypto.randomUUID(),
    material: 'Timber',
    description: 'Structural timber for roof',
    unit: 'm3',
    quantity: timberM3,
    unitPrice: DEFAULT_PRICES.timber || 45000,
    totalPrice: timberM3 * (DEFAULT_PRICES.timber || 45000),
  });
  
  // Gutters
  const gutterLength = (designData.walls.externalLengthM + designData.walls.internalLengthM) * 0.5;
  items.push({
    id: crypto.randomUUID(),
    material: 'Gutters',
    description: 'PVC gutters',
    unit: 'meters',
    quantity: gutterLength,
    unitPrice: DEFAULT_PRICES.gutters || 400,
    totalPrice: gutterLength * (DEFAULT_PRICES.gutters || 400),
  });
  
  // Roof features
  if (designData.roof.features.skylights > 0) {
    items.push({
      id: crypto.randomUUID(),
      material: 'Skylights',
      description: 'Roof skylights',
      unit: 'units',
      quantity: designData.roof.features.skylights,
      unitPrice: DEFAULT_PRICES.skylight || 8000,
      totalPrice: designData.roof.features.skylights * (DEFAULT_PRICES.skylight || 8000),
    });
  }
  
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  return {
    name: 'Roofing',
    items,
    subtotal,
  };
}

function calculateFinishes(designData: DesignData): BOQCategory {
  const items: BOQItem[] = [];
  
  const wallArea = (designData.walls.externalLengthM + designData.walls.internalLengthM) * designData.walls.heightM;
  
  // Plaster
  const plasterArea = wallArea * 2; // Both sides
  const plasterCementBags = plasterArea * 0.1;
  const plasterSandTons = plasterArea * 0.02;
  
  items.push({
    id: crypto.randomUUID(),
    material: 'Plaster Cement',
    description: 'Cement for plaster',
    unit: 'bags',
    quantity: plasterCementBags,
    unitPrice: DEFAULT_PRICES.cement || 650,
    totalPrice: plasterCementBags * (DEFAULT_PRICES.cement || 650),
  });
  
  items.push({
    id: crypto.randomUUID(),
    material: 'Plaster Sand',
    description: 'Sand for plaster',
    unit: 'tons',
    quantity: plasterSandTons,
    unitPrice: DEFAULT_PRICES.sand || 2500,
    totalPrice: plasterSandTons * (DEFAULT_PRICES.sand || 2500),
  });
  
  // Paint
  const paintLiters = wallArea * 0.2;
  items.push({
    id: crypto.randomUUID(),
    material: 'Paint',
    description: 'Interior emulsion paint',
    unit: 'liters',
    quantity: paintLiters,
    unitPrice: DEFAULT_PRICES.paint || 500,
    totalPrice: paintLiters * (DEFAULT_PRICES.paint || 500),
  });
  
  // Tiles
  const floorArea = designData.totalAreaSqm;
  const wallTilesArea = designData.rooms.filter(r => r.type === 'bathroom' || r.type === 'kitchen')
    .reduce((sum, r) => sum + (r.perimeter * 2.1), 0);
  
  items.push({
    id: crypto.randomUUID(),
    material: 'Floor Tiles',
    description: 'Ceramic floor tiles',
    unit: 'sqm',
    quantity: floorArea,
    unitPrice: DEFAULT_PRICES.floor_tiles || 800,
    totalPrice: floorArea * (DEFAULT_PRICES.floor_tiles || 800),
  });
  
  items.push({
    id: crypto.randomUUID(),
    material: 'Wall Tiles',
    description: 'Ceramic wall tiles',
    unit: 'sqm',
    quantity: wallTilesArea,
    unitPrice: DEFAULT_PRICES.wall_tiles || 1000,
    totalPrice: wallTilesArea * (DEFAULT_PRICES.wall_tiles || 1000),
  });
  
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  return {
    name: 'Finishes',
    items,
    subtotal,
  };
}

function calculateDoorsWindows(designData: DesignData): BOQCategory {
  const items: BOQItem[] = [];
  
  // Doors
  for (const door of designData.doors) {
    let unitPrice = 0;
    switch (door.type) {
      case 'main': unitPrice = 45000; break;
      case 'bedroom': unitPrice = 12000; break;
      case 'bathroom': unitPrice = 10000; break;
      case 'kitchen': unitPrice = 15000; break;
      case 'sliding': unitPrice = 35000; break;
      default: unitPrice = 15000;
    }
    
    items.push({
      id: crypto.randomUUID(),
      material: `${door.type.charAt(0).toUpperCase() + door.type.slice(1)} Door`,
      description: `${door.material} door ${door.widthM}x${door.heightM}m`,
      unit: 'units',
      quantity: door.count,
      unitPrice,
      totalPrice: door.count * unitPrice,
    });
  }
  
  // Windows
  for (const window of designData.windows) {
    let unitPrice = 0;
    switch (window.type) {
      case 'casement': unitPrice = 8000; break;
      case 'sliding': unitPrice = 12000; break;
      case 'fixed': unitPrice = 6000; break;
      default: unitPrice = 7000;
    }
    
    items.push({
      id: crypto.randomUUID(),
      material: `${window.type.charAt(0).toUpperCase() + window.type.slice(1)} Window`,
      description: `${window.material} window ${window.widthM}x${window.heightM}m`,
      unit: 'units',
      quantity: window.count,
      unitPrice,
      totalPrice: window.count * unitPrice,
    });
  }
  
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  return {
    name: 'Doors & Windows',
    items,
    subtotal,
  };
}

function calculateJoinery(designData: DesignData): BOQCategory {
  const items: BOQItem[] = [];
  
  // Kitchen cabinets
  const kitchenRoom = designData.rooms.find(r => r.type === 'kitchen');
  const cabinetLength = kitchenRoom ? Math.min(kitchenRoom.lengthM * 0.7, 6) : 5;
  
  items.push({
    id: crypto.randomUUID(),
    material: 'Kitchen Cabinets',
    description: 'Marine board kitchen cabinets',
    unit: 'linear_m',
    quantity: cabinetLength,
    unitPrice: 15000,
    totalPrice: cabinetLength * 15000,
  });
  
  // Wardrobes
  const bedroomCount = designData.rooms.filter(r => r.type === 'bedroom').length;
  const wardrobeLength = bedroomCount * 2.5;
  
  items.push({
    id: crypto.randomUUID(),
    material: 'Wardrobes',
    description: 'Chip board wardrobes',
    unit: 'linear_m',
    quantity: wardrobeLength,
    unitPrice: 10000,
    totalPrice: wardrobeLength * 10000,
  });
  
  // Marine board sheets
  items.push({
    id: crypto.randomUUID(),
    material: 'Marine Board Sheets',
    description: 'Waterproof marine board',
    unit: 'sheets',
    quantity: cabinetLength * 2,
    unitPrice: 3000,
    totalPrice: cabinetLength * 2 * 3000,
  });
  
  // Chip board sheets
  items.push({
    id: crypto.randomUUID(),
    material: 'Chip Board Sheets',
    description: 'Standard chip board',
    unit: 'sheets',
    quantity: wardrobeLength * 2.5,
    unitPrice: 1500,
    totalPrice: wardrobeLength * 2.5 * 1500,
  });
  
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  return {
    name: 'Joinery & Woodwork',
    items,
    subtotal,
  };
}

function calculateElectrical(designData: DesignData): BOQCategory {
  const items: BOQItem[] = [];
  
  const points = designData.electrical.lightPoints + designData.electrical.powerSockets;
  
  // Wiring
  const wireLength = points * 15;
  items.push({
    id: crypto.randomUUID(),
    material: 'Electrical Wire',
    description: 'Copper electrical wire',
    unit: 'meters',
    quantity: wireLength,
    unitPrice: 50,
    totalPrice: wireLength * 50,
  });
  
  // Conduit
  const conduitLength = points * 12;
  items.push({
    id: crypto.randomUUID(),
    material: 'PVC Conduit',
    description: 'PVC electrical conduit',
    unit: 'meters',
    quantity: conduitLength,
    unitPrice: 30,
    totalPrice: conduitLength * 30,
  });
  
  // Switches and sockets
  items.push({
    id: crypto.randomUUID(),
    material: 'Switches & Sockets',
    description: 'Light switches and power sockets',
    unit: 'units',
    quantity: points,
    unitPrice: 250,
    totalPrice: points * 250,
  });
  
  // Distribution board
  items.push({
    id: crypto.randomUUID(),
    material: 'Distribution Board',
    description: 'Main distribution board',
    unit: 'units',
    quantity: 1,
    unitPrice: 12000,
    totalPrice: 12000,
  });
  
  // Lighting fixtures
  items.push({
    id: crypto.randomUUID(),
    material: 'LED Downlights',
    description: 'LED recessed downlights',
    unit: 'units',
    quantity: designData.electrical.lightPoints,
    unitPrice: 1500,
    totalPrice: designData.electrical.lightPoints * 1500,
  });
  
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  return {
    name: 'Electrical',
    items,
    subtotal,
  };
}

function calculatePlumbing(designData: DesignData): BOQCategory {
  const items: BOQItem[] = [];
  
  const pipeLength = designData.plumbing.waterSupply.distributionPipesM + designData.plumbing.waterSupply.mainLineM;
  
  // Pipes
  items.push({
    id: crypto.randomUUID(),
    material: 'PVC Pipes',
    description: 'Class C PVC pipes',
    unit: 'meters',
    quantity: pipeLength,
    unitPrice: 150,
    totalPrice: pipeLength * 150,
  });
  
  // Sanitary fixtures
  const fixtureCount = designData.plumbing.sanitaryFixtures.wc + 
                       designData.plumbing.sanitaryFixtures.shower +
                       designData.plumbing.sanitaryFixtures.washBasin +
                       designData.plumbing.sanitaryFixtures.kitchenSink;
  
  items.push({
    id: crypto.randomUUID(),
    material: 'Sanitary Fixtures',
    description: 'WC, showers, basins',
    unit: 'units',
    quantity: fixtureCount,
    unitPrice: 5000,
    totalPrice: fixtureCount * 5000,
  });
  
  // Mixer taps
  items.push({
    id: crypto.randomUUID(),
    material: 'Mixer Taps',
    description: 'Chrome mixer taps',
    unit: 'units',
    quantity: designData.plumbing.sanitaryFixtures.mixerTaps,
    unitPrice: 4000,
    totalPrice: designData.plumbing.sanitaryFixtures.mixerTaps * 4000,
  });
  
  // Water tank
  items.push({
    id: crypto.randomUUID(),
    material: 'Water Tank',
    description: '2000L overhead water tank',
    unit: 'units',
    quantity: 1,
    unitPrice: 45000,
    totalPrice: 45000,
  });
  
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  return {
    name: 'Plumbing',
    items,
    subtotal,
  };
}

function calculateExternalWorks(designData: DesignData): BOQCategory {
  const items: BOQItem[] = [];
  
  // Driveway
  const drivewayArea = 45; // sqm average
  items.push({
    id: crypto.randomUUID(),
    material: 'Driveway',
    description: 'Concrete driveway',
    unit: 'sqm',
    quantity: drivewayArea,
    unitPrice: 1500,
    totalPrice: drivewayArea * 1500,
  });
  
  // Fencing
  const fenceLength = 85; // meters average
  items.push({
    id: crypto.randomUUID(),
    material: 'Chain Link Fence',
    description: 'Chain link fencing',
    unit: 'meters',
    quantity: fenceLength,
    unitPrice: 800,
    totalPrice: fenceLength * 800,
  });
  
  // Gate
  items.push({
    id: crypto.randomUUID(),
    material: 'Steel Gate',
    description: 'Automated steel gate',
    unit: 'units',
    quantity: 1,
    unitPrice: 85000,
    totalPrice: 85000,
  });
  
  // Landscaping
  items.push({
    id: crypto.randomUUID(),
    material: 'Landscaping',
    description: 'Lawn, trees, and plants',
    unit: 'lot',
    quantity: 1,
    unitPrice: 50000,
    totalPrice: 50000,
  });
  
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  return {
    name: 'External Works',
    items,
    subtotal,
  };
}

function calculateAmenities(designData: DesignData): BOQCategory {
  const items: BOQItem[] = [];
  
  if (designData.amenities.swimmingPool) {
    const pool = designData.amenities.swimmingPool;
    const poolArea = pool.lengthM * pool.widthM;
    items.push({
      id: crypto.randomUUID(),
      material: 'Swimming Pool',
      description: `${pool.lengthM}x${pool.widthM}m ${pool.shape} pool`,
      unit: 'sqm',
      quantity: poolArea,
      unitPrice: 15000,
      totalPrice: poolArea * 15000,
    });
  }
  
  if (designData.amenities.gazebo) {
    items.push({
      id: crypto.randomUUID(),
      material: 'Gazebo',
      description: 'Wooden gazebo with thatch roof',
      unit: 'units',
      quantity: 1,
      unitPrice: 125000,
      totalPrice: 125000,
    });
  }
  
  if (designData.amenities.elevator) {
    items.push({
      id: crypto.randomUUID(),
      material: 'Elevator',
      description: 'Passenger elevator',
      unit: 'units',
      quantity: 1,
      unitPrice: 850000,
      totalPrice: 850000,
    });
  }
  
  if (designData.amenities.homeTheater) {
    items.push({
      id: crypto.randomUUID(),
      material: 'Home Theater',
      description: 'Complete home theater system',
      unit: 'units',
      quantity: 1,
      unitPrice: 320000,
      totalPrice: 320000,
    });
  }
  
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  return {
    name: 'Amenities',
    items,
    subtotal,
  };
}