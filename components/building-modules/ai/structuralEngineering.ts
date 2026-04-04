import { DesignData, FoundationDesign, StructuralDesign } from '@/types/design';

export interface StructuralInput {
  designData: DesignData;
  siteAnalysis: any;
  buildingType: string;
  seismicZone?: string;
  windZone?: string;
}

export interface StructuralOutput {
  foundation: FoundationDesign;
  structural: StructuralDesign;
  loadCalculations: LoadCalculations;
  materialQuantities: StructuralMaterials;
  safetyFactors: SafetyFactors;
}

export interface LoadCalculations {
  deadLoad: number; // kN
  liveLoad: number; // kN
  windLoad: number; // kN
  seismicLoad: number; // kN
  totalLoad: number; // kN
  loadPerSqm: number; // kN/m²
}

export interface StructuralMaterials {
  concrete: {
    grade: string;
    volumeM3: number;
  };
  steel: {
    grade: string;
    weightKg: number;
    y8Kg: number;
    y10Kg: number;
    y12Kg: number;
    y16Kg: number;
    y20Kg: number;
    y25Kg: number;
    bindingWireKg: number;
  };
  formwork: {
    areaM2: number;
    material: string;
  };
}

export interface SafetyFactors {
  deadLoadFactor: number;
  liveLoadFactor: number;
  windLoadFactor: number;
  seismicLoadFactor: number;
  materialStrengthFactor: number;
}

export async function performStructuralAnalysis(input: StructuralInput): Promise<StructuralOutput> {
  const { designData, siteAnalysis, buildingType, seismicZone = 'low', windZone = 'moderate' } = input;
  
  // Calculate loads
  const loadCalculations = calculateLoads(designData, buildingType, seismicZone, windZone);
  
  // Design foundation based on soil conditions
  const foundation = designFoundation(loadCalculations, siteAnalysis);
  
  // Design structural elements
  const structural = designStructuralElements(designData, loadCalculations);
  
  // Calculate material quantities
  const materialQuantities = calculateStructuralMaterials(foundation, structural);
  
  // Determine safety factors based on building type and location
  const safetyFactors = determineSafetyFactors(buildingType, seismicZone, windZone);
  
  return {
    foundation,
    structural,
    loadCalculations,
    materialQuantities,
    safetyFactors,
  };
}

function calculateLoads(designData: DesignData, buildingType: string, seismicZone: string, windZone: string): LoadCalculations {
  const area = designData.totalAreaSqm;
  const floors = designData.floors;
  
  // Dead load (self weight) - approximately 3-4 kN/m² per floor
  const deadLoadPerSqm = 3.5;
  const deadLoad = deadLoadPerSqm * area * floors;
  
  // Live load (people, furniture) - varies by building type
  let liveLoadPerSqm = 2.0; // Residential default
  if (buildingType === 'office') liveLoadPerSqm = 2.5;
  else if (buildingType === 'school') liveLoadPerSqm = 3.0;
  else if (buildingType === 'mall') liveLoadPerSqm = 4.0;
  else if (buildingType === 'church') liveLoadPerSqm = 3.5;
  
  const liveLoad = liveLoadPerSqm * area * floors;
  
  // Wind load based on wind zone and building height
  let windLoadPerSqm = 0.5;
  if (windZone === 'moderate') windLoadPerSqm = 0.8;
  else if (windZone === 'high') windLoadPerSqm = 1.2;
  
  const windLoad = windLoadPerSqm * area * (floors > 1 ? floors * 0.5 : 1);
  
  // Seismic load based on seismic zone and building weight
  let seismicCoefficient = 0.05;
  if (seismicZone === 'moderate') seismicCoefficient = 0.1;
  else if (seismicZone === 'high') seismicCoefficient = 0.2;
  
  const seismicLoad = (deadLoad + liveLoad) * seismicCoefficient;
  
  const totalLoad = deadLoad + liveLoad + windLoad + seismicLoad;
  const loadPerSqm = totalLoad / area;
  
  return {
    deadLoad,
    liveLoad,
    windLoad,
    seismicLoad,
    totalLoad,
    loadPerSqm,
  };
}

function designFoundation(loadCalculations: LoadCalculations, siteAnalysis: any): FoundationDesign {
  const soilType = siteAnalysis?.soil?.type || 'clay_loam';
  const bearingCapacity = siteAnalysis?.soil?.bearingCapacityKpa || 120;
  const requiredFootingArea = loadCalculations.totalLoad / bearingCapacity;
  
  let foundationType: 'strip' | 'raft' | 'pile' | 'reinforced_raft' | 'pad' = 'strip';
  let depthM = 0.6;
  let widthM = 0.6;
  
  if (requiredFootingArea > 200) {
    foundationType = 'raft';
    depthM = 0.8;
    widthM = 0.8;
  } else if (bearingCapacity < 100) {
    foundationType = 'reinforced_raft';
    depthM = 1.0;
    widthM = 1.0;
  } else if (soilType === 'silty_clay') {
    foundationType = 'pile';
    depthM = 1.5;
    widthM = 0.6;
  }
  
  const areaSqm = requiredFootingArea;
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

function designStructuralElements(designData: DesignData, loadCalculations: LoadCalculations): StructuralDesign {
  const { columns, beams, slabs } = designData.structural;
  const floors = designData.floors;
  const area = designData.totalAreaSqm;
  
  // Determine column spacing based on load
  const columnLoad = loadCalculations.loadPerSqm * 20; // Approximate load per column
  let columnSize = 0.3;
  if (columnLoad > 500) columnSize = 0.35;
  if (columnLoad > 800) columnSize = 0.4;
  
  // Determine beam depth based on span
  const maxSpan = 6.0;
  let beamDepth = 0.45;
  if (maxSpan > 5) beamDepth = 0.5;
  if (maxSpan > 6) beamDepth = 0.6;
  
  // Determine slab thickness based on span
  let slabThickness = 0.15;
  if (maxSpan > 5) slabThickness = 0.18;
  if (maxSpan > 6) slabThickness = 0.2;
  
  // Calculate number of columns needed
  const columnSpacing = 4.5;
  const columnsPerRow = Math.ceil(Math.sqrt(area) / columnSpacing) + 1;
  const columnCount = columnsPerRow * columnsPerRow;
  
  const updatedColumns = columns.map((col, idx) => ({
    ...col,
    widthM: columnSize,
    depthM: columnSize,
    concreteVolumeM3: columnSize * columnSize * 3.0 * floors,
    reinforcementKg: columnSize * columnSize * 3.0 * floors * 80,
  }));
  
  const updatedBeams = beams.map((beam, idx) => ({
    ...beam,
    depthM: beamDepth,
    concreteVolumeM3: beam.widthM * beamDepth * beam.lengthM,
    reinforcementKg: beam.widthM * beamDepth * beam.lengthM * 100,
  }));
  
  const updatedSlabs = slabs.map((slab, idx) => ({
    ...slab,
    thicknessM: slabThickness,
    concreteVolumeM3: slab.areaSqm * slabThickness,
    reinforcementKg: slab.areaSqm * slabThickness * 80,
  }));
  
  return {
    columns: updatedColumns,
    beams: updatedBeams,
    slabs: updatedSlabs,
  };
}

function calculateStructuralMaterials(foundation: FoundationDesign, structural: StructuralDesign): StructuralMaterials {
  let totalConcreteM3 = foundation.concreteVolumeM3;
  let totalSteelKg = foundation.reinforcement.totalKg;
  let totalFormworkM2 = foundation.areaSqm;
  
  structural.columns.forEach(col => {
    totalConcreteM3 += col.concreteVolumeM3;
    totalSteelKg += col.reinforcementKg;
    totalFormworkM2 += (col.widthM + col.depthM) * 2 * col.heightM * col.count;
  });
  
  structural.beams.forEach(beam => {
    totalConcreteM3 += beam.concreteVolumeM3;
    totalSteelKg += beam.reinforcementKg;
    totalFormworkM2 += (beam.widthM + beam.depthM) * 2 * beam.lengthM * beam.count;
  });
  
  structural.slabs.forEach(slab => {
    totalConcreteM3 += slab.concreteVolumeM3;
    totalSteelKg += slab.reinforcementKg;
    totalFormworkM2 += slab.areaSqm;
  });
  
  return {
    concrete: {
      grade: 'C25/30',
      volumeM3: totalConcreteM3,
    },
    steel: {
      grade: 'B500',
      weightKg: totalSteelKg,
      y8Kg: totalSteelKg * 0.1,
      y10Kg: totalSteelKg * 0.15,
      y12Kg: totalSteelKg * 0.3,
      y16Kg: totalSteelKg * 0.25,
      y20Kg: totalSteelKg * 0.15,
      y25Kg: totalSteelKg * 0.05,
      bindingWireKg: totalConcreteM3 * 0.5,
    },
    formwork: {
      areaM2: totalFormworkM2,
      material: 'timber',
    },
  };
}

function determineSafetyFactors(buildingType: string, seismicZone: string, windZone: string): SafetyFactors {
  let deadLoadFactor = 1.35;
  let liveLoadFactor = 1.5;
  let windLoadFactor = 1.5;
  let seismicLoadFactor = 1.0;
  let materialStrengthFactor = 1.15;
  
  if (buildingType === 'school' || buildingType === 'hospital' || buildingType === 'church') {
    liveLoadFactor = 1.6;
    seismicLoadFactor = 1.2;
  }
  
  if (seismicZone === 'high') {
    seismicLoadFactor = 1.5;
    deadLoadFactor = 1.4;
  }
  
  if (windZone === 'high') {
    windLoadFactor = 1.6;
  }
  
  return {
    deadLoadFactor,
    liveLoadFactor,
    windLoadFactor,
    seismicLoadFactor,
    materialStrengthFactor,
  };
}