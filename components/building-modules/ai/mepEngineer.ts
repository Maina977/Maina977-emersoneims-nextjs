// @ts-nocheck
import { DesignData, ElectricalDesign, PlumbingDesign, HVACDesign } from '@/types/design';

export interface MEPInput {
  designData: DesignData;
  siteAnalysis: any;
  buildingType: string;
  includeSolar: boolean;
  includeBorehole: boolean;
  includeGenerator: boolean;
}

export interface MEPOutput {
  electrical: ElectricalDesign;
  plumbing: PlumbingDesign;
  hvac?: HVACDesign;
  recommendations: MEPRecommendation[];
  costEstimate: MEPCostEstimate;
}

export interface MEPRecommendation {
  category: 'electrical' | 'plumbing' | 'hvac';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedSavings?: number;
}

export interface MEPCostEstimate {
  electrical: number;
  plumbing: number;
  hvac: number;
  total: number;
}

export async function designMEP(input: MEPInput): Promise<MEPOutput> {
  const { designData, siteAnalysis, buildingType, includeSolar, includeBorehole, includeGenerator } = input;
  
  // Design electrical system
  const electrical = designElectricalSystem(designData, buildingType, includeSolar, includeGenerator);
  
  // Design plumbing system
  const plumbing = designPlumbingSystem(designData, buildingType, includeBorehole);
  
  // Design HVAC system based on climate
  const hvac = designHVACSystem(designData, siteAnalysis, buildingType);
  
  // Generate recommendations
  const recommendations = generateMEPRecommendations(siteAnalysis, includeSolar, includeBorehole);
  
  // Calculate cost estimates
  const costEstimate = calculateMEPCosts(electrical, plumbing, hvac);
  
  return {
    electrical,
    plumbing,
    hvac,
    recommendations,
    costEstimate,
  };
}

function designElectricalSystem(designData: DesignData, buildingType: string, includeSolar: boolean, includeGenerator: boolean): ElectricalDesign {
  const rooms = designData.rooms;
  const floors = designData.floors;
  const totalArea = designData.totalAreaSqm;
  
  // Calculate number of points based on room count
  const lightPointsPerRoom = buildingType === 'office' ? 4 : buildingType === 'school' ? 5 : 3;
  const socketPointsPerRoom = buildingType === 'office' ? 6 : buildingType === 'school' ? 4 : 3;
  
  const lightPoints = rooms.length * lightPointsPerRoom + 4;
  const powerSockets = rooms.length * socketPointsPerRoom + 6;
  
  // Determine distribution board size
  const boardWays = Math.ceil((lightPoints + powerSockets) / 6) + 2;
  
  // Calculate wire and conduit lengths
  const cableLengthM = (lightPoints + powerSockets) * 12;
  const conduitLengthM = (lightPoints + powerSockets) * 10;
  
  // Special installations based on building type
  const specialInstallations = [];
  
  if (buildingType === 'office') {
    specialInstallations.push({ type: 'internet', count: rooms.length * 2 });
    specialInstallations.push({ type: 'tv', count: rooms.length });
  } else if (buildingType === 'school') {
    specialInstallations.push({ type: 'internet', count: rooms.length });
    specialInstallations.push({ type: 'cctv', count: Math.ceil(rooms.length / 3) });
  } else {
    specialInstallations.push({ type: 'tv', count: rooms.filter(r => r.type === 'living').length * 2 + rooms.filter(r => r.type === 'bedroom').length });
    specialInstallations.push({ type: 'internet', count: rooms.length });
    specialInstallations.push({ type: 'ac', count: rooms.filter(r => r.type === 'bedroom').length });
    specialInstallations.push({ type: 'water_heater', count: rooms.filter(r => r.type === 'bathroom').length });
  }
  
  // Lighting fixtures
  const lightingFixtures = [
    { type: 'downlight', count: lightPoints, location: 'all_rooms' },
    { type: 'pendant', count: Math.floor(lightPoints * 0.1), location: 'living_dining' },
    { type: 'wall_light', count: Math.floor(lightPoints * 0.15), location: 'corridors' },
  ];
  
  // Solar system design
  let solarSystem = undefined;
  if (includeSolar) {
    solarSystem = {
      type: 'hybrid' as const,
      capacityKw: 5,
      panelCount: 12,
      panelWattage: 450,
      panelType: 'monocrystalline',
      inverterType: 'hybrid',
      inverterSizeKw: 5,
      batteryCapacityKwh: 10,
      mountingType: 'roof' as const,
      orientation: 'north',
      tilt: 15,
      estimatedGenerationKwhYear: 7200,
      estimatedSavingsMonth: 8500,
      paybackPeriodYears: 5.5,
      cost: 850000,
    };
  }
  
  // Generator design
  let backupGenerator = undefined;
  if (includeGenerator) {
    backupGenerator = {
      type: 'diesel' as const,
      capacityKva: 10,
      fuelConsumptionLhr: 2.5,
      runtimeHours: 8,
      cost: 420000,
    };
  }
  
  // Wire gauges calculation
  const wireGauges = [
    { gauge: '1.5mm', lengthM: lightPoints * 8 },
    { gauge: '2.5mm', lengthM: powerSockets * 10 },
    { gauge: '6mm', lengthM: 45 + (floors > 1 ? 30 * (floors - 1) : 0) },
  ];
  
  return {
    lightPoints,
    powerSockets,
    switchBoards: Math.ceil(rooms.length / 3),
    distributionBoard: {
      ways: boardWays,
      type: 'standard',
    },
    cableLengthM,
    conduitLengthM,
    wireGauges,
    specialInstallations,
    lightingFixtures,
    solarSystem,
    backupGenerator,
  };
}

function designPlumbingSystem(designData: DesignData, buildingType: string, includeBorehole: boolean): PlumbingDesign {
  const rooms = designData.rooms;
  const bathroomCount = rooms.filter(r => r.type === 'bathroom').length;
  const floors = designData.floors;
  
  // Calculate pipe lengths based on building size
  const mainLineM = 45 + (floors > 1 ? 20 * (floors - 1) : 0);
  const distributionPipesM = 85 + (floors > 1 ? 40 * (floors - 1) : 0);
  
  // Water tanks sizing
  const waterDemand = (bathroomCount * 150) + 200; // Liters per day
  const overheadTankCapacity = Math.max(1000, Math.ceil(waterDemand * 0.5 / 500) * 500);
  const undergroundTankCapacity = Math.max(3000, Math.ceil(waterDemand * 1.5 / 1000) * 1000);
  
  // Sanitary fixtures based on bathroom count and building type
  const wcCount = bathroomCount;
  const showerCount = bathroomCount;
  const bathtubCount = buildingType === 'hotel' ? bathroomCount : (bathroomCount > 1 ? 1 : 0);
  const washBasinCount = bathroomCount + (buildingType === 'office' ? rooms.length : 1);
  const kitchenSinkCount = buildingType !== 'office' ? 1 : 0;
  
  // Drainage design
  const soilPipeM = 35 + (bathroomCount * 5);
  const wastePipeM = 42 + (bathroomCount * 4);
  const ventPipeM = 18 + (bathroomCount * 2);
  const inspectionChambers = Math.ceil(bathroomCount / 2) + 2;
  
  // Septic tank sizing
  const septicCapacity = bathroomCount * 1.5 + 3;
  
  // Borehole design
  let borehole = undefined;
  if (includeBorehole) {
    borehole = {
      depthM: 25,
      pumpHp: 1.5,
      tankCapacityL: 5000,
      waterTreatment: 'filtration',
      estimatedCost: 350000,
      estimatedYieldLhr: 2000,
    };
  }
  
  // Water heating
  const waterHeating = {
    type: 'solar' as const,
    capacityL: 200,
    panels: 2,
    cost: 120000,
  };
  
  return {
    waterSupply: {
      mainLineM,
      distributionPipesM,
      pipeMaterial: 'pvc_class_c',
      pipeSizes: [
        { size: '25mm', lengthM: mainLineM },
        { size: '20mm', lengthM: distributionPipesM * 0.6 },
        { size: '15mm', lengthM: distributionPipesM * 0.4 },
      ],
      tanks: [
        { type: 'overhead', capacityL: overheadTankCapacity, quantity: 1, material: 'plastic' },
        { type: 'underground', capacityL: undergroundTankCapacity, quantity: 1, material: 'concrete' },
      ],
      pump: { type: 'submersible', hp: 1.5, quantity: 1 },
    },
    sanitaryFixtures: {
      wc: wcCount,
      shower: showerCount,
      bathtub: bathtubCount,
      washBasin: washBasinCount,
      kitchenSink: kitchenSinkCount,
      laundrySink: 1,
      mixerTaps: bathroomCount * 2 + (kitchenSinkCount > 0 ? 2 : 0),
      angleValves: (bathroomCount * 3) + (kitchenSinkCount > 0 ? 2 : 0),
      pTraps: bathroomCount * 2 + (kitchenSinkCount > 0 ? 1 : 0),
      floorDrains: bathroomCount,
    },
    drainage: {
      soilPipeM,
      wastePipeM,
      ventPipeM,
      inspectionChambers,
      septicTank: { capacityM3: septicCapacity, quantity: 1 },
      soakaway: { depthM: 2.5, quantity: 1 },
    },
    waterHeating,
    borehole,
  };
}

function designHVACSystem(designData: DesignData, siteAnalysis: any, buildingType: string): HVACDesign | undefined {
  const totalArea = designData.totalAreaSqm;
  const avgTemp = siteAnalysis?.climate?.avgTemperatureC || 22;
  const isHotClimate = avgTemp > 25;
  
  // Only design HVAC for hot climates or specific building types
  if (!isHotClimate && buildingType !== 'office' && buildingType !== 'hospital') {
    return undefined;
  }
  
  // Calculate cooling capacity needed (approx 100 BTU per sqm)
  const requiredBTU = totalArea * 100;
  const tonsOfRefrigeration = requiredBTU / 12000;
  
  let hvacType: 'split' | 'central' | 'vrv' = 'split';
  let units = Math.ceil(totalArea / 30); // One unit per 30 sqm
  
  if (totalArea > 500) {
    hvacType = 'central';
    units = 1;
  } else if (totalArea > 200) {
    hvacType = 'vrv';
    units = Math.ceil(totalArea / 40);
  }
  
  let efficiency = 3.5; // EER rating
  if (hvacType === 'central') efficiency = 4.0;
  if (hvacType === 'vrv') efficiency = 4.5;
  
  let cost = 0;
  if (hvacType === 'split') cost = units * 80000;
  else if (hvacType === 'vrv') cost = units * 150000 + 100000;
  else cost = 500000 + totalArea * 1000;
  
  return {
    type: hvacType,
    capacityBtus: requiredBTU,
    units,
    efficiency,
    cost,
  };
}

function generateMEPRecommendations(siteAnalysis: any, includeSolar: boolean, includeBorehole: boolean): MEPRecommendation[] {
  const recommendations: MEPRecommendation[] = [];
  
  // Electrical recommendations
  if (siteAnalysis?.climate?.sunHoursDay > 6 && !includeSolar) {
    recommendations.push({
      category: 'electrical',
      title: 'Solar System Installation',
      description: 'High solar potential detected. Installing solar panels could reduce electricity bills by up to 70%.',
      priority: 'high',
      estimatedSavings: 100000,
    });
  }
  
  if (siteAnalysis?.utilities?.gridDistanceM > 300 && !includeSolar) {
    recommendations.push({
      category: 'electrical',
      title: 'Grid Connection vs Solar',
      description: `Grid distance is ${siteAnalysis.utilities.gridDistanceM}m. Consider off-grid solar as a cost-effective alternative.`,
      priority: 'high',
    });
  }
  
  // Plumbing recommendations
  if (siteAnalysis?.waterTable?.boreholeFeasibility === 'excellent' && !includeBorehole) {
    recommendations.push({
      category: 'plumbing',
      title: 'Borehole Installation',
      description: 'Excellent groundwater potential. Installing a borehole can provide water self-sufficiency.',
      priority: 'high',
      estimatedSavings: 50000,
    });
  }
  
  if (!siteAnalysis?.utilities?.sewerAvailable) {
    recommendations.push({
      category: 'plumbing',
      title: 'Septic System Design',
      description: 'No municipal sewer available. Proper septic tank and soakaway design is essential.',
      priority: 'high',
    });
  }
  
  // Water heating recommendation
  if (siteAnalysis?.climate?.sunHoursDay > 5) {
    recommendations.push({
      category: 'plumbing',
      title: 'Solar Water Heating',
      description: 'Install solar water heaters to reduce water heating costs.',
      priority: 'medium',
      estimatedSavings: 25000,
    });
  }
  
  // HVAC recommendations
  if (siteAnalysis?.climate?.avgTemperatureC > 28) {
    recommendations.push({
      category: 'hvac',
      title: 'Energy Efficient Cooling',
      description: 'Consider inverter AC units or central cooling for better energy efficiency.',
      priority: 'high',
      estimatedSavings: 30000,
    });
  }
  
  return recommendations;
}

function calculateMEPCosts(electrical: ElectricalDesign, plumbing: PlumbingDesign, hvac?: HVACDesign): MEPCostEstimate {
  // Calculate electrical cost
  let electricalCost = 0;
  electricalCost += electrical.cableLengthM * 50; // Wire cost
  electricalCost += electrical.conduitLengthM * 30; // Conduit cost
  electricalCost += (electrical.lightPoints + electrical.powerSockets) * 250; // Switches and sockets
  electricalCost += electrical.distributionBoard.ways * 1000; // Distribution board
  electricalCost += electrical.lightingFixtures.reduce((sum, f) => sum + f.count * (f.type === 'downlight' ? 1500 : 800), 0);
  
  if (electrical.solarSystem) electricalCost += electrical.solarSystem.cost;
  if (electrical.backupGenerator) electricalCost += electrical.backupGenerator.cost;
  
  // Calculate plumbing cost
  let plumbingCost = 0;
  plumbingCost += (plumbing.waterSupply.mainLineM + plumbing.waterSupply.distributionPipesM) * 150; // Pipes
  plumbingCost += plumbing.sanitaryFixtures.wc * 15000;
  plumbingCost += plumbing.sanitaryFixtures.shower * 12000;
  plumbingCost += plumbing.sanitaryFixtures.washBasin * 5000;
  plumbingCost += plumbing.sanitaryFixtures.mixerTaps * 4000;
  plumbingCost += plumbing.drainage.soilPipeM * 200;
  plumbingCost += plumbing.drainage.wastePipeM * 150;
  
  if (plumbing.waterHeating) plumbingCost += plumbing.waterHeating.cost;
  if (plumbing.borehole) plumbingCost += plumbing.borehole.estimatedCost;
  
  // Calculate HVAC cost
  const hvacCost = hvac?.cost || 0;
  
  return {
    electrical: electricalCost,
    plumbing: plumbingCost,
    hvac: hvacCost,
    total: electricalCost + plumbingCost + hvacCost,
  };
}