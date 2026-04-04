import { DesignData, Room, WallDesign, FoundationDesign, RoofDesign, Door, Window, ElectricalDesign, PlumbingDesign, StructuralDesign, FinishesDesign, AmenitiesDesign, LandscapingDesign, EnergySystems } from '@/types/design';

export interface DesignInput {
  siteAnalysis: any;
  buildingType: string;
  architecturalStyle: string;
  totalAreaSqm: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  roof: any;
  amenities: any;
  landscaping: any;
}

export interface DesignOutput extends DesignData {
  recommendations: string[];
  warnings: string[];
}

export async function generateDesign(input: DesignInput): Promise<DesignOutput> {
  // Calculate dimensions based on area
  const aspectRatio = 1.2; // width to depth ratio
  const width = Math.sqrt(input.totalAreaSqm / aspectRatio);
  const depth = input.totalAreaSqm / width;
  
  // Generate rooms based on bedroom count
  const rooms = generateRooms(input, width, depth);
  
  // Generate walls
  const walls = generateWalls(width, depth, input.floors);
  
  // Generate foundation based on soil analysis
  const foundation = generateFoundation(input.siteAnalysis, input.totalAreaSqm);
  
  // Generate structural design
  const structural = generateStructuralDesign(input, width, depth, input.floors);
  
  // Generate roof design
  const roof = generateRoofDesign(input.roof, width, depth);
  
  // Generate doors and windows
  const doors = generateDoors(rooms, input.architecturalStyle);
  const windows = generateWindows(rooms, input.architecturalStyle);
  
  // Generate finishes
  const finishes = generateFinishes(input.architecturalStyle);
  
  // Generate electrical design
  const electrical = generateElectricalDesign(rooms, input.floors);
  
  // Generate plumbing design
  const plumbing = generatePlumbingDesign(rooms, input.bathrooms, input.floors);
  
  // Generate amenities design
  const amenities = generateAmenitiesDesign(input.amenities);
  
  // Generate landscaping design
  const landscaping = generateLandscapingDesign(input.landscaping, input.totalAreaSqm);
  
  // Generate energy systems
  const energySystems = generateEnergySystems(input.siteAnalysis);
  
  // Generate recommendations based on site analysis
  const recommendations = generateRecommendations(input.siteAnalysis, input.buildingType);
  const warnings = generateWarnings(input.siteAnalysis);
  
  return {
    id: '',
    projectId: '',
    buildingType: input.buildingType as any,
    architecturalStyle: input.architecturalStyle as any,
    totalAreaSqm: input.totalAreaSqm,
    floors: input.floors,
    rooms,
    walls,
    foundation,
    roof,
    structural,
    doors,
    windows,
    finishes,
    electrical,
    plumbing,
    amenities,
    landscaping,
    energySystems,
    recommendations,
    warnings,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function generateRooms(input: DesignInput, width: number, depth: number): Room[] {
  const rooms: Room[] = [];
  const roomHeight = 3.0;
  
  // Living Room (30% of ground floor)
  const livingArea = input.totalAreaSqm * 0.3;
  const livingWidth = Math.sqrt(livingArea * 0.8);
  const livingDepth = livingArea / livingWidth;
  
  rooms.push({
    id: 'living',
    name: 'Living Room',
    areaSqm: livingArea,
    lengthM: livingWidth,
    widthM: livingDepth,
    heightM: roomHeight,
    type: 'living',
    flooring: 'porcelain_tiles',
    wallFinish: 'paint',
    ceilingFinish: 'gypsum',
  });
  
  // Kitchen (12% of total area)
  const kitchenArea = input.totalAreaSqm * 0.12;
  const kitchenWidth = Math.sqrt(kitchenArea * 0.7);
  const kitchenDepth = kitchenArea / kitchenWidth;
  
  rooms.push({
    id: 'kitchen',
    name: 'Kitchen',
    areaSqm: kitchenArea,
    lengthM: kitchenWidth,
    widthM: kitchenDepth,
    heightM: roomHeight,
    type: 'kitchen',
    flooring: 'ceramic_tiles',
    wallFinish: 'ceramic_tiles',
    ceilingFinish: 'gypsum',
  });
  
  // Dining Area (8% of total area)
  const diningArea = input.totalAreaSqm * 0.08;
  const diningWidth = Math.sqrt(diningArea * 0.9);
  const diningDepth = diningArea / diningWidth;
  
  rooms.push({
    id: 'dining',
    name: 'Dining Area',
    areaSqm: diningArea,
    lengthM: diningWidth,
    widthM: diningDepth,
    heightM: roomHeight,
    type: 'dining',
    flooring: 'porcelain_tiles',
    wallFinish: 'paint',
    ceilingFinish: 'gypsum',
  });
  
  // Bedrooms
  const bedroomsTotalArea = input.totalAreaSqm * 0.35;
  const masterArea = bedroomsTotalArea * 0.4;
  const standardArea = (bedroomsTotalArea - masterArea) / (input.bedrooms - 1);
  
  for (let i = 1; i <= input.bedrooms; i++) {
    const isMaster = i === 1;
    const area = isMaster ? masterArea : standardArea;
    const width = Math.sqrt(area * 0.9);
    const depth = area / width;
    
    rooms.push({
      id: `bedroom_${i}`,
      name: isMaster ? 'Master Bedroom' : `Bedroom ${i}`,
      areaSqm: area,
      lengthM: width,
      widthM: depth,
      heightM: roomHeight,
      type: 'bedroom',
      flooring: 'laminate',
      wallFinish: 'paint',
      ceilingFinish: 'gypsum',
    });
  }
  
  // Bathrooms
  const bathroomArea = 6; // sqm per bathroom
  for (let i = 1; i <= input.bathrooms; i++) {
    rooms.push({
      id: `bathroom_${i}`,
      name: `Bathroom ${i}`,
      areaSqm: bathroomArea,
      lengthM: 2.5,
      widthM: 2.4,
      heightM: 2.4,
      type: 'bathroom',
      flooring: 'non_slip_ceramic',
      wallFinish: 'ceramic_tiles',
      ceilingFinish: 'waterproof_gypsum',
    });
  }
  
  // Corridor (5% of total area)
  const corridorArea = input.totalAreaSqm * 0.05;
  rooms.push({
    id: 'corridor',
    name: 'Corridor',
    areaSqm: corridorArea,
    lengthM: corridorArea / 1.5,
    widthM: 1.5,
    heightM: roomHeight,
    type: 'corridor',
    flooring: 'ceramic_tiles',
    wallFinish: 'paint',
    ceilingFinish: 'gypsum',
  });
  
  // Storage (3% of total area)
  const storageArea = input.totalAreaSqm * 0.03;
  rooms.push({
    id: 'store',
    name: 'Store',
    areaSqm: storageArea,
    lengthM: 2.5,
    widthM: storageArea / 2.5,
    heightM: roomHeight,
    type: 'store',
    flooring: 'concrete',
    wallFinish: 'paint',
    ceilingFinish: 'none',
  });
  
  return rooms;
}

function generateWalls(width: number, depth: number, floors: number): WallDesign {
  const externalLength = (width + depth) * 2;
  const internalLength = externalLength * 0.6;
  
  return {
    externalLengthM: externalLength,
    internalLengthM: internalLength,
    wallThicknessM: 0.23,
    heightM: 3.0 * floors,
    material: 'brick',
    insulationType: floors > 1 ? 'cavity' : 'none',
    insulationThickness: floors > 1 ? 0.05 : 0,
  };
}

function generateFoundation(siteAnalysis: any, areaSqm: number): FoundationDesign {
  const soilType = siteAnalysis?.soil?.type || 'clay_loam';
  const bearingCapacity = siteAnalysis?.soil?.bearingCapacityKpa || 120;
  
  let foundationType: 'strip' | 'raft' | 'pile' | 'reinforced_raft' | 'pad' = 'strip';
  let depthM = 0.6;
  let widthM = 0.6;
  
  if (soilType === 'clay_loam' && bearingCapacity < 100) {
    foundationType = 'reinforced_raft';
    depthM = 0.8;
    widthM = 0.8;
  } else if (soilType === 'silty_clay') {
    foundationType = 'pile';
    depthM = 1.2;
    widthM = 0.6;
  } else if (soilType === 'rocky') {
    foundationType = 'raft';
    depthM = 0.4;
    widthM = 0.4;
  }
  
  const concreteVolumeM3 = areaSqm * depthM;
  const steelKg = concreteVolumeM3 * 60;
  
  return {
    type: foundationType,
    depthM,
    widthM,
    areaSqm,
    concreteVolumeM3,
    reinforcement: {
      totalKg: steelKg,
      y12Kg: steelKg * 0.4,
      y16Kg: steelKg * 0.35,
      y20Kg: steelKg * 0.25,
      bindingWireKg: concreteVolumeM3 * 0.5,
    },
    excavationVolumeM3: areaSqm * (depthM + 0.3),
  };
}

function generateStructuralDesign(input: DesignInput, width: number, depth: number, floors: number): StructuralDesign {
  const columns: any[] = [];
  const beams: any[] = [];
  const slabs: any[] = [];
  
  // Generate columns (spaced every 4-5 meters)
  const columnSpacing = 4.5;
  const columnsPerRow = Math.ceil(width / columnSpacing) + 1;
  const columnsPerCol = Math.ceil(depth / columnSpacing) + 1;
  const columnCount = columnsPerRow * columnsPerCol;
  
  for (let i = 0; i < columnCount; i++) {
    columns.push({
      id: `col_${i}`,
      widthM: 0.3,
      depthM: 0.3,
      heightM: 3.0 * floors,
      count: 1,
      concreteVolumeM3: 0.3 * 0.3 * 3.0 * floors,
      reinforcementKg: 0.3 * 0.3 * 3.0 * floors * 80,
    });
  }
  
  // Generate beams
  const beamCount = columnsPerRow * 2 + columnsPerCol * 2;
  for (let i = 0; i < beamCount; i++) {
    beams.push({
      id: `beam_${i}`,
      widthM: 0.23,
      depthM: 0.45,
      lengthM: columnSpacing,
      count: 1,
      concreteVolumeM3: 0.23 * 0.45 * columnSpacing,
      reinforcementKg: 0.23 * 0.45 * columnSpacing * 100,
    });
  }
  
  // Generate slabs
  for (let floor = 1; floor <= floors; floor++) {
    slabs.push({
      id: `slab_floor_${floor}`,
      areaSqm: width * depth,
      thicknessM: 0.15,
      concreteVolumeM3: width * depth * 0.15,
      reinforcementKg: width * depth * 0.15 * 80,
    });
  }
  
  return { columns, beams, slabs };
}

function generateRoofDesign(roofInput: any, width: number, depth: number): RoofDesign {
  const roofArea = width * depth * 1.2;
  const overhang = 0.6;
  
  return {
    type: roofInput?.type || 'pitched',
    pitchDegrees: roofInput?.pitchDegrees || 25,
    areaSqm: roofArea,
    material: roofInput?.material || 'iron_sheets',
    insulation: roofInput?.insulation || 'none',
    features: {
      skylights: roofInput?.features?.skylights || 0,
      skylightSize: roofInput?.features?.skylightSize || { width: 1, height: 1 },
      solarPanels: roofInput?.features?.solarPanels || false,
      solarAreaSqm: roofInput?.features?.solarAreaSqm || 0,
      solarPanelType: roofInput?.features?.solarPanelType || 'monocrystalline',
      chimney: roofInput?.features?.chimney || false,
      chimneyCount: roofInput?.features?.chimneyCount || 0,
      chimneyMaterial: roofInput?.features?.chimneyMaterial || 'brick',
      roofGarden: roofInput?.features?.roofGarden || false,
      roofGardenAreaSqm: roofInput?.features?.roofGardenAreaSqm || 0,
      rooftopDeck: roofInput?.features?.rooftopDeck || false,
      rooftopDeckAreaSqm: roofInput?.features?.rooftopDeckAreaSqm || 0,
      dormers: roofInput?.features?.dormers || 0,
      gutters: roofInput?.features?.gutters !== false,
      gutterMaterial: roofInput?.features?.gutterMaterial || 'aluminum',
      downspouts: roofInput?.features?.downspouts || 4,
      ventilation: roofInput?.features?.ventilation || true,
    },
  };
}

function generateDoors(rooms: Room[], style: string): Door[] {
  const doors: Door[] = [];
  
  // Main Door
  doors.push({
    id: 'main_door',
    type: 'main',
    material: style === 'modern' ? 'aluminum_glass' : 'mahogany',
    widthM: 1.2,
    heightM: 2.1,
    thicknessM: 0.045,
    count: 1,
    location: 'front',
    frameMaterial: 'aluminum',
    hardware: {
      handles: 1,
      hinges: 3,
      locks: 1,
      closer: true,
    },
  });
  
  // Bedroom Doors
  const bedroomCount = rooms.filter(r => r.type === 'bedroom').length;
  doors.push({
    id: 'bedroom_doors',
    type: 'bedroom',
    material: 'flush',
    widthM: 0.9,
    heightM: 2.1,
    thicknessM: 0.04,
    count: bedroomCount,
    location: 'bedrooms',
    hardware: {
      handles: bedroomCount,
      hinges: bedroomCount * 3,
      locks: bedroomCount,
    },
  });
  
  // Bathroom Doors
  const bathroomCount = rooms.filter(r => r.type === 'bathroom').length;
  doors.push({
    id: 'bathroom_doors',
    type: 'bathroom',
    material: 'waterproof',
    widthM: 0.75,
    heightM: 2.1,
    thicknessM: 0.04,
    count: bathroomCount,
    location: 'bathrooms',
    hardware: {
      handles: bathroomCount,
      hinges: bathroomCount * 3,
      locks: bathroomCount,
    },
  });
  
  // Kitchen Door
  doors.push({
    id: 'kitchen_door',
    type: 'kitchen',
    material: 'flush',
    widthM: 0.9,
    heightM: 2.1,
    thicknessM: 0.04,
    count: 1,
    location: 'kitchen',
    hardware: {
      handles: 1,
      hinges: 3,
      locks: 1,
    },
  });
  
  // Sliding Door to backyard (if modern style)
  if (style === 'modern') {
    doors.push({
      id: 'sliding_door',
      type: 'sliding',
      material: 'aluminum_glass',
      widthM: 2.4,
      heightM: 2.4,
      thicknessM: 0.05,
      count: 1,
      location: 'living_to_backyard',
      hardware: {
        handles: 2,
        hinges: 0,
        locks: 1,
      },
    });
  }
  
  return doors;
}

function generateWindows(rooms: Room[], style: string): Window[] {
  const windows: Window[] = [];
  
  const bedroomCount = rooms.filter(r => r.type === 'bedroom').length;
  const livingRoom = rooms.find(r => r.type === 'living');
  const kitchen = rooms.find(r => r.type === 'kitchen');
  const bathrooms = rooms.filter(r => r.type === 'bathroom');
  
  // Bedroom Windows (2 per bedroom)
  windows.push({
    id: 'bedroom_windows',
    type: style === 'modern' ? 'sliding' : 'casement',
    material: 'aluminum',
    widthM: 1.2,
    heightM: 1.2,
    glassType: 'double',
    count: bedroomCount * 2,
    location: 'bedrooms',
  });
  
  // Living Room Windows
  if (livingRoom) {
    windows.push({
      id: 'living_windows',
      type: style === 'modern' ? 'sliding' : 'casement',
      material: 'aluminum',
      widthM: 1.8,
      heightM: 1.2,
      glassType: 'double',
      count: 3,
      location: 'living_room',
    });
  }
  
  // Kitchen Window
  if (kitchen) {
    windows.push({
      id: 'kitchen_window',
      type: 'casement',
      material: 'aluminum',
      widthM: 1.2,
      heightM: 1.2,
      glassType: 'single',
      count: 1,
      location: 'kitchen',
    });
  }
  
  // Bathroom Windows (louver for ventilation)
  bathrooms.forEach((bathroom, idx) => {
    windows.push({
      id: `bathroom_window_${idx}`,
      type: 'louver',
      material: 'aluminum',
      widthM: 0.6,
      heightM: 0.9,
      glassType: 'frosted',
      count: 1,
      location: bathroom.name,
    });
  });
  
  return windows;
}

function generateFinishes(style: string): FinishesDesign {
  const finishes: FinishesDesign = {
    flooring: {},
    wallFinish: {},
    ceilingFinish: {},
    painting: {
      interiorLiters: 0,
      exteriorLiters: 0,
      primerLiters: 0,
    },
  };
  
  // Flooring based on style
  if (style === 'modern') {
    finishes.flooring = {
      living: 'polished_concrete',
      bedrooms: 'engineered_wood',
      kitchen: 'porcelain_tiles',
      bathrooms: 'non_slip_ceramic',
      corridor: 'porcelain_tiles',
    };
  } else if (style === 'traditional') {
    finishes.flooring = {
      living: 'ceramic_tiles',
      bedrooms: 'laminate',
      kitchen: 'ceramic_tiles',
      bathrooms: 'ceramic_tiles',
      corridor: 'ceramic_tiles',
    };
  } else {
    finishes.flooring = {
      living: 'porcelain_tiles',
      bedrooms: 'laminate',
      kitchen: 'ceramic_tiles',
      bathrooms: 'non_slip_ceramic',
      corridor: 'ceramic_tiles',
    };
  }
  
  // Wall finishes
  finishes.wallFinish = {
    interior: 'paint',
    exterior: 'texture_paint',
    bathrooms: 'ceramic_tiles',
    kitchen: 'ceramic_tiles',
  };
  
  // Ceiling finishes
  finishes.ceilingFinish = {
    standard: 'gypsum_board',
    bathrooms: 'waterproof_gypsum',
    kitchen: 'gypsum_board',
  };
  
  // Paint quantities (approximate: 0.2 liters per sqm)
  const totalWallArea = 300; // Approximate
  finishes.painting = {
    interiorLiters: totalWallArea * 0.2,
    exteriorLiters: totalWallArea * 0.15,
    primerLiters: totalWallArea * 0.1,
  };
  
  return finishes;
}

function generateElectricalDesign(rooms: Room[], floors: number): ElectricalDesign {
  const totalPoints = rooms.length * 3 + 4;
  const lightPoints = Math.ceil(totalPoints * 0.6);
  const powerSockets = Math.ceil(totalPoints * 0.4);
  
  return {
    lightPoints,
    powerSockets,
    switchBoards: Math.ceil(rooms.length / 3),
    distributionBoard: {
      ways: 12,
      type: 'standard',
    },
    cableLengthM: lightPoints * 10 + powerSockets * 12,
    conduitLengthM: lightPoints * 8 + powerSockets * 10,
    wireGauges: [
      { gauge: '1.5mm', lengthM: lightPoints * 8 },
      { gauge: '2.5mm', lengthM: powerSockets * 10 },
      { gauge: '6mm', lengthM: 45 },
    ],
    specialInstallations: [
      { type: 'tv', count: rooms.filter(r => r.type === 'living').length * 2 + rooms.filter(r => r.type === 'bedroom').length },
      { type: 'internet', count: rooms.length },
      { type: 'ac', count: rooms.filter(r => r.type === 'bedroom').length },
      { type: 'water_heater', count: rooms.filter(r => r.type === 'bathroom').length },
    ],
    lightingFixtures: [
      { type: 'downlight', count: lightPoints, location: 'all_rooms' },
      { type: 'pendant', count: Math.floor(lightPoints * 0.1), location: 'living_dining' },
      { type: 'wall_light', count: Math.floor(lightPoints * 0.15), location: 'corridors' },
    ],
  };
}

function generatePlumbingDesign(rooms: Room[], bathroomCount: number, floors: number): PlumbingDesign {
  const totalWaterPoints = bathroomCount * 3 + 3; // WC, shower, basin per bathroom + kitchen + laundry
  
  return {
    waterSupply: {
      mainLineM: 45,
      distributionPipesM: 85,
      pipeMaterial: 'pvc_class_c',
      pipeSizes: [
        { size: '25mm', lengthM: 45 },
        { size: '20mm', lengthM: 65 },
        { size: '15mm', lengthM: 20 },
      ],
      tanks: [
        { type: 'overhead', capacityL: 2000, quantity: 1, material: 'plastic' },
        { type: 'underground', capacityL: 5000, quantity: 1, material: 'concrete' },
      ],
      pump: { type: 'submersible', hp: 1.5, quantity: 1 },
    },
    sanitaryFixtures: {
      wc: bathroomCount,
      shower: bathroomCount,
      bathtub: bathroomCount > 1 ? 1 : 0,
      washBasin: bathroomCount + 1,
      kitchenSink: 1,
      laundrySink: 1,
      mixerTaps: bathroomCount * 2 + 2,
      angleValves: (bathroomCount * 3) + 4,
      pTraps: bathroomCount * 2 + 2,
      floorDrains: bathroomCount,
    },
    drainage: {
      soilPipeM: 35,
      wastePipeM: 42,
      ventPipeM: 18,
      inspectionChambers: Math.ceil(bathroomCount / 2) + 2,
      septicTank: { capacityM3: bathroomCount * 1.5 + 2, quantity: 1 },
      soakaway: { depthM: 2.5, quantity: 1 },
    },
    waterHeating: {
      type: 'solar',
      capacityL: 200,
      panels: 2,
      cost: 120000,
    },
  };
}

function generateAmenitiesDesign(amenitiesInput: any): AmenitiesDesign {
  const amenities: AmenitiesDesign = {};
  
  if (amenitiesInput?.swimmingPool?.enabled) {
    amenities.swimmingPool = {
      shape: amenitiesInput.swimmingPool.shape || 'rectangle',
      lengthM: amenitiesInput.swimmingPool.length || 8,
      widthM: amenitiesInput.swimmingPool.width || 4,
      shallowDepthM: amenitiesInput.swimmingPool.shallowDepth || 1.2,
      deepDepthM: amenitiesInput.swimmingPool.deepDepth || 1.8,
      heated: amenitiesInput.swimmingPool.heated || false,
      lighting: true,
      waterfall: false,
      jacuzzi: false,
      infinityEdge: false,
      saltWater: false,
      poolCover: false,
      filtrationSystem: 'sand_filter',
      cost: 650000,
    };
  }
  
  if (amenitiesInput?.gazebo?.enabled) {
    amenities.gazebo = {
      size: amenitiesInput.gazebo.size || 9,
      type: amenitiesInput.gazebo.type || 'wooden',
      roof: 'thatch',
      flooring: 'wood',
      lighting: true,
      seating: true,
      cost: 125000,
    };
  }
  
  if (amenitiesInput?.pagoda?.enabled) {
    amenities.pagoda = {
      style: amenitiesInput.pagoda.style || 'japanese',
      size: 9,
      material: 'wood',
      cost: 80000,
    };
  }
  
  if (amenitiesInput?.outdoorKitchen?.enabled) {
    amenities.outdoorKitchen = {
      grill: amenitiesInput.outdoorKitchen.grill || true,
      sink: amenitiesInput.outdoorKitchen.sink || true,
      fridge: amenitiesInput.outdoorKitchen.fridge || false,
      countertop: true,
      storage: true,
      pizzaOven: false,
      smoker: false,
      cost: 180000,
    };
  }
  
  if (amenitiesInput?.elevator?.enabled) {
    amenities.elevator = {
      capacity: amenitiesInput.elevator.capacity || 4,
      floors: amenitiesInput.elevator.floors || 2,
      speed: 1.0,
      type: 'hydraulic',
      cost: 850000,
    };
  }
  
  if (amenitiesInput?.homeTheater?.enabled) {
    amenities.homeTheater = {
      size: amenitiesInput.homeTheater.size || 20,
      seating: amenitiesInput.homeTheater.seating || 6,
      screen: amenitiesInput.homeTheater.screen || '120"',
      audio: '7.1 surround',
      acousticTreatment: true,
      cost: 320000,
    };
  }
  
  if (amenitiesInput?.garage?.enabled) {
    amenities.garage = {
      cars: amenitiesInput.garage.cars || 2,
      type: amenitiesInput.garage.type || 'attached',
      automatic: true,
      evCharging: false,
      cost: 150000,
    };
  }
  
  if (amenitiesInput?.guestSuite?.enabled) {
    amenities.guestSuite = {
      bedrooms: amenitiesInput.guestSuite.bedrooms || 1,
      ensuite: amenitiesInput.guestSuite.ensuite || true,
      kitchenette: false,
      livingArea: false,
      cost: 250000,
    };
  }
  
  if (amenitiesInput?.servantQuarters?.enabled) {
    amenities.servantQuarters = {
      bedrooms: amenitiesInput.servantQuarters.bedrooms || 1,
      kitchen: amenitiesInput.servantQuarters.kitchen || true,
      bathroom: true,
      separateEntrance: true,
      cost: 200000,
    };
  }
  
  return amenities;
}

function generateLandscapingDesign(landscapingInput: any, totalAreaSqm: number): LandscapingDesign {
  const gardenArea = totalAreaSqm * 0.3; // 30% of land for landscaping
  
  return {
    lawn: {
      areaSqm: landscapingInput?.lawn?.enabled ? (landscapingInput.lawn.areaSqm || gardenArea * 0.6) : 0,
      grassType: landscapingInput?.lawn?.grassType || 'Bermuda',
      sprinklerSystem: landscapingInput?.lawn?.sprinklerSystem || false,
      cost: 0,
    },
    trees: landscapingInput?.trees?.enabled ? [{
      species: landscapingInput.trees.species || 'Indigenous',
      count: landscapingInput.trees.count || 8,
      location: 'perimeter',
      cost: 0,
    }] : [],
    shrubs: [],
    flowerBeds: landscapingInput?.flowers?.enabled ? [{
      areaSqm: landscapingInput.flowers.areaSqm || gardenArea * 0.15,
      type: landscapingInput.flowers.type || 'Mixed',
      colors: ['red', 'yellow', 'purple'],
      cost: 0,
    }] : [],
    hardscaping: {
      driveway: {
        areaSqm: landscapingInput?.hardscaping?.drivewayArea || 45,
        material: 'pavers',
        cost: 0,
      },
      pathways: {
        areaSqm: landscapingInput?.hardscaping?.pathwaysLength ? landscapingInput.hardscaping.pathwaysLength * 1.2 : 78,
        material: 'stone',
        cost: 0,
      },
      patio: {
        areaSqm: 35,
        material: 'decking',
        cost: 0,
      },
    },
    waterFeatures: [],
    irrigation: {
      type: landscapingInput?.irrigation?.enabled ? (landscapingInput.irrigation.type || 'sprinkler') : 'manual',
      coverage: gardenArea,
      timer: landscapingInput?.irrigation?.enabled || false,
      cost: 0,
    },
    lighting: landscapingInput?.lighting?.enabled ? [{
      count: landscapingInput.lighting.count || 12,
      type: 'pathway',
      location: 'garden',
      cost: 0,
    }] : [],
    fencing: {
      lengthM: 85,
      type: 'chain_link',
      heightM: 1.8,
      gate: true,
      cost: 0,
    },
    driveway: {
      areaSqm: landscapingInput?.hardscaping?.drivewayArea || 45,
      material: 'concrete',
      cost: 0,
    },
    pathways: landscapingInput?.hardscaping?.pathwaysLength ? [{
      lengthM: landscapingInput.hardscaping.pathwaysLength,
      widthM: 1.2,
      material: 'stone',
      cost: 0,
    }] : [],
  };
}

function generateEnergySystems(siteAnalysis: any): EnergySystems {
  const solarHours = siteAnalysis?.climate?.sunHoursDay || 6;
  const gridDistance = siteAnalysis?.utilities?.gridDistanceM || 350;
  
  return {
    solarPV: solarHours > 5 ? {
      capacityKw: 5,
      panelCount: 12,
      panelWattage: 450,
      panelType: 'monocrystalline',
      inverterType: 'hybrid',
      inverterSizeKw: 5,
      mountingType: 'roof',
      orientation: 'north',
      tilt: 15,
      estimatedGenerationKwhYear: 7200,
      estimatedSavingsMonth: 8500,
      paybackPeriodYears: 5.5,
      cost: 850000,
    } : undefined,
    gridConnection: {
      distanceM: gridDistance,
      transformerRequired: gridDistance > 500,
      trenchingCost: gridDistance * 150,
      cablingCost: gridDistance * 80,
      meterCost: 15000,
      totalCost: 25000 + gridDistance * 230,
    },
  };
}

function generateRecommendations(siteAnalysis: any, buildingType: string): string[] {
  const recommendations: string[] = [];
  
  if (siteAnalysis?.soil?.shrinkSwellRisk === 'high') {
    recommendations.push('Use reinforced raft foundation to accommodate soil movement');
  }
  
  if (siteAnalysis?.floodRisk?.riskLevel !== 'low') {
    recommendations.push('Elevate ground floor by 0.5m to mitigate flood risk');
  }
  
  if (siteAnalysis?.climate?.sunHoursDay > 6) {
    recommendations.push('Install solar panels to reduce electricity costs');
  }
  
  if (siteAnalysis?.utilities?.gridDistanceM > 500) {
    recommendations.push('Consider off-grid solar system due to grid distance');
  }
  
  if (buildingType === 'school' || buildingType === 'church') {
    recommendations.push('Ensure adequate emergency exits and fire safety measures');
  }
  
  if (buildingType === 'apartment' || buildingType === 'condo') {
    recommendations.push('Include sound insulation between units');
  }
  
  return recommendations;
}

function generateWarnings(siteAnalysis: any): string[] {
  const warnings: string[] = [];
  
  if (siteAnalysis?.soil?.shrinkSwellRisk === 'high') {
    warnings.push('High shrink-swell soil - foundation design critical');
  }
  
  if (siteAnalysis?.floodRisk?.riskLevel === 'high') {
    warnings.push('High flood risk area - building elevation required');
  }
  
  if (siteAnalysis?.terrain?.slopePercent > 15) {
    warnings.push('Steep slope - retaining walls and specialized foundation required');
  }
  
  return warnings;
}