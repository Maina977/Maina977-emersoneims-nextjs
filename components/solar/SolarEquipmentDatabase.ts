/**
 * SOLAR BIBLE - WORLD'S LARGEST EQUIPMENT DATABASE
 * 300+ Panels, Batteries, Inverters, and Accessories
 *
 * @copyright 2026 EmersonEIMS - Solar Bible
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface SolarPanel {
  id: string;
  brand: string;
  model: string;
  wattage: number;
  voltage: number;
  current: number;
  efficiency: number;
  type: 'Monocrystalline' | 'Polycrystalline' | 'Bifacial' | 'Thin-Film' | 'TOPCon' | 'HJT';
  warranty: number;
  priceKES: number;
  dimensions: { length: number; width: number; weight: number };
  tempCoefficient: number;
  degradationRate: number;
  tier: 1 | 2 | 3;
}

export interface BatteryUnit {
  id: string;
  brand: string;
  model: string;
  capacity: number;
  voltage: number;
  type: 'Lithium-Ion' | 'LiFePO4' | 'Lead-Acid' | 'Gel' | 'AGM' | 'Tubular' | 'Sodium-Ion';
  dod: number;
  cycles: number;
  warranty: number;
  priceKES: number;
  weight: number;
  cRate: number;
}

export interface Inverter {
  id: string;
  brand: string;
  model: string;
  ratedPower: number;
  maxPower: number;
  type: 'Hybrid' | 'Off-Grid' | 'On-Grid' | 'Micro' | 'String';
  mpptChannels: number;
  efficiency: number;
  warranty: number;
  priceKES: number;
  features: string[];
  phase: 1 | 3;
}

export interface Accessory {
  id: string;
  category: 'mounting' | 'cable' | 'protection' | 'monitoring' | 'connector';
  brand: string;
  model: string;
  description: string;
  priceKES: number;
  unit: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 100+ SOLAR PANELS DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

export const SOLAR_PANELS: SolarPanel[] = [
  // JA SOLAR (15 models)
  { id: 'ja-670', brand: 'JA Solar', model: 'JAM72D42-670/LB', wattage: 670, voltage: 52.80, current: 12.69, efficiency: 22.4, type: 'TOPCon', warranty: 30, priceKES: 38500, dimensions: { length: 2384, width: 1303, weight: 32.5 }, tempCoefficient: -0.29, degradationRate: 0.40, tier: 1 },
  { id: 'ja-615', brand: 'JA Solar', model: 'JAM72D40-615/GB', wattage: 615, voltage: 51.50, current: 11.95, efficiency: 22.0, type: 'Bifacial', warranty: 30, priceKES: 35500, dimensions: { length: 2278, width: 1134, weight: 30.0 }, tempCoefficient: -0.30, degradationRate: 0.45, tier: 1 },
  { id: 'ja-580', brand: 'JA Solar', model: 'JAM72S30-580/MR', wattage: 580, voltage: 50.20, current: 11.55, efficiency: 21.8, type: 'Monocrystalline', warranty: 25, priceKES: 31000, dimensions: { length: 2278, width: 1134, weight: 28.8 }, tempCoefficient: -0.35, degradationRate: 0.50, tier: 1 },
  { id: 'ja-565', brand: 'JA Solar', model: 'JAM72S30-565/MR', wattage: 565, voltage: 49.90, current: 11.32, efficiency: 21.5, type: 'Monocrystalline', warranty: 25, priceKES: 29500, dimensions: { length: 2278, width: 1134, weight: 28.6 }, tempCoefficient: -0.35, degradationRate: 0.50, tier: 1 },
  { id: 'ja-550', brand: 'JA Solar', model: 'JAM72S30-550/MR', wattage: 550, voltage: 49.65, current: 11.08, efficiency: 21.3, type: 'Monocrystalline', warranty: 25, priceKES: 28500, dimensions: { length: 2278, width: 1134, weight: 28.6 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'ja-545', brand: 'JA Solar', model: 'JAM72S30-545/MR', wattage: 545, voltage: 49.50, current: 11.01, efficiency: 21.1, type: 'Monocrystalline', warranty: 25, priceKES: 27800, dimensions: { length: 2278, width: 1134, weight: 28.5 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'ja-540', brand: 'JA Solar', model: 'JAM72S30-540/MR', wattage: 540, voltage: 49.35, current: 10.95, efficiency: 20.9, type: 'Monocrystalline', warranty: 25, priceKES: 27200, dimensions: { length: 2278, width: 1134, weight: 28.4 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'ja-535', brand: 'JA Solar', model: 'JAM72S30-535/MR', wattage: 535, voltage: 49.20, current: 10.87, efficiency: 20.7, type: 'Monocrystalline', warranty: 25, priceKES: 26800, dimensions: { length: 2278, width: 1134, weight: 28.3 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'ja-500', brand: 'JA Solar', model: 'JAM66S30-500/MR', wattage: 500, voltage: 45.80, current: 10.92, efficiency: 21.0, type: 'Monocrystalline', warranty: 25, priceKES: 25500, dimensions: { length: 2094, width: 1134, weight: 26.5 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'ja-480', brand: 'JA Solar', model: 'JAM60S20-480/MR', wattage: 480, voltage: 43.50, current: 11.03, efficiency: 21.2, type: 'Monocrystalline', warranty: 25, priceKES: 24500, dimensions: { length: 2094, width: 1038, weight: 24.8 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'ja-460', brand: 'JA Solar', model: 'JAM60S20-460/MR', wattage: 460, voltage: 42.10, current: 10.93, efficiency: 20.8, type: 'Monocrystalline', warranty: 25, priceKES: 23800, dimensions: { length: 2094, width: 1038, weight: 24.5 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'ja-450', brand: 'JA Solar', model: 'JAM72S20-450/MR', wattage: 450, voltage: 41.52, current: 10.84, efficiency: 20.3, type: 'Monocrystalline', warranty: 25, priceKES: 23500, dimensions: { length: 2094, width: 1038, weight: 24.5 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'ja-440', brand: 'JA Solar', model: 'JAM60S20-440/MR', wattage: 440, voltage: 40.90, current: 10.76, efficiency: 20.0, type: 'Monocrystalline', warranty: 25, priceKES: 22800, dimensions: { length: 2094, width: 1038, weight: 24.2 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'ja-bifacial-580', brand: 'JA Solar', model: 'JAM72D30-580/MB', wattage: 580, voltage: 50.20, current: 11.55, efficiency: 21.8, type: 'Bifacial', warranty: 30, priceKES: 34000, dimensions: { length: 2278, width: 1134, weight: 30.0 }, tempCoefficient: -0.32, degradationRate: 0.40, tier: 1 },
  { id: 'ja-bifacial-550', brand: 'JA Solar', model: 'JAM72D30-550/MB', wattage: 550, voltage: 49.65, current: 11.08, efficiency: 21.3, type: 'Bifacial', warranty: 30, priceKES: 32000, dimensions: { length: 2278, width: 1134, weight: 29.5 }, tempCoefficient: -0.34, degradationRate: 0.45, tier: 1 },

  // LONGI SOLAR (15 models)
  { id: 'longi-660', brand: 'Longi', model: 'Hi-MO 7 LR7-72HGD-660M', wattage: 660, voltage: 52.50, current: 12.57, efficiency: 22.5, type: 'HJT', warranty: 30, priceKES: 39000, dimensions: { length: 2384, width: 1303, weight: 32.0 }, tempCoefficient: -0.26, degradationRate: 0.35, tier: 1 },
  { id: 'longi-600', brand: 'Longi', model: 'Hi-MO 6 LR6-72HPH-600M', wattage: 600, voltage: 51.20, current: 11.72, efficiency: 22.2, type: 'Monocrystalline', warranty: 25, priceKES: 33500, dimensions: { length: 2278, width: 1134, weight: 28.5 }, tempCoefficient: -0.32, degradationRate: 0.45, tier: 1 },
  { id: 'longi-580', brand: 'Longi', model: 'Hi-MO 6 LR6-72HPH-580M', wattage: 580, voltage: 50.50, current: 11.49, efficiency: 22.0, type: 'Monocrystalline', warranty: 25, priceKES: 32000, dimensions: { length: 2278, width: 1134, weight: 28.2 }, tempCoefficient: -0.32, degradationRate: 0.45, tier: 1 },
  { id: 'longi-570', brand: 'Longi', model: 'Hi-MO 5 LR5-72HPH-570M', wattage: 570, voltage: 50.10, current: 11.38, efficiency: 21.8, type: 'Monocrystalline', warranty: 25, priceKES: 31000, dimensions: { length: 2278, width: 1134, weight: 28.0 }, tempCoefficient: -0.34, degradationRate: 0.50, tier: 1 },
  { id: 'longi-555', brand: 'Longi', model: 'Hi-MO 5 LR5-72HPH-555M', wattage: 555, voltage: 49.80, current: 11.15, efficiency: 21.5, type: 'Monocrystalline', warranty: 25, priceKES: 29500, dimensions: { length: 2256, width: 1133, weight: 27.5 }, tempCoefficient: -0.34, degradationRate: 0.50, tier: 1 },
  { id: 'longi-545', brand: 'Longi', model: 'Hi-MO 5 LR5-72HPH-545M', wattage: 545, voltage: 49.50, current: 11.01, efficiency: 21.1, type: 'Monocrystalline', warranty: 25, priceKES: 28500, dimensions: { length: 2256, width: 1133, weight: 27.3 }, tempCoefficient: -0.34, degradationRate: 0.50, tier: 1 },
  { id: 'longi-540', brand: 'Longi', model: 'Hi-MO 5 LR5-72HPH-540M', wattage: 540, voltage: 49.30, current: 10.96, efficiency: 20.9, type: 'Monocrystalline', warranty: 25, priceKES: 27800, dimensions: { length: 2256, width: 1133, weight: 27.2 }, tempCoefficient: -0.34, degradationRate: 0.50, tier: 1 },
  { id: 'longi-500', brand: 'Longi', model: 'Hi-MO 5 LR5-66HPH-500M', wattage: 500, voltage: 45.90, current: 10.89, efficiency: 21.0, type: 'Monocrystalline', warranty: 25, priceKES: 26000, dimensions: { length: 2094, width: 1134, weight: 25.5 }, tempCoefficient: -0.34, degradationRate: 0.50, tier: 1 },
  { id: 'longi-490', brand: 'Longi', model: 'Hi-MO 5 LR5-66HPH-490M', wattage: 490, voltage: 45.20, current: 10.84, efficiency: 20.8, type: 'Monocrystalline', warranty: 25, priceKES: 25500, dimensions: { length: 2094, width: 1134, weight: 25.3 }, tempCoefficient: -0.34, degradationRate: 0.50, tier: 1 },
  { id: 'longi-480', brand: 'Longi', model: 'Hi-MO 4 LR4-60HPH-480M', wattage: 480, voltage: 43.80, current: 10.96, efficiency: 21.1, type: 'Monocrystalline', warranty: 25, priceKES: 25000, dimensions: { length: 2094, width: 1038, weight: 24.0 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'longi-460', brand: 'Longi', model: 'Hi-MO 4 LR4-60HPH-460M', wattage: 460, voltage: 42.20, current: 10.90, efficiency: 20.7, type: 'Monocrystalline', warranty: 25, priceKES: 24000, dimensions: { length: 2094, width: 1038, weight: 23.8 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'longi-450', brand: 'Longi', model: 'Hi-MO 4 LR4-72HPH-450M', wattage: 450, voltage: 41.50, current: 10.85, efficiency: 20.5, type: 'Monocrystalline', warranty: 25, priceKES: 24000, dimensions: { length: 2094, width: 1038, weight: 23.5 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'longi-440', brand: 'Longi', model: 'Hi-MO 4 LR4-60HPH-440M', wattage: 440, voltage: 40.80, current: 10.78, efficiency: 20.3, type: 'Monocrystalline', warranty: 25, priceKES: 23200, dimensions: { length: 2094, width: 1038, weight: 23.3 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'longi-bifacial-590', brand: 'Longi', model: 'Hi-MO 6 LR6-72HBD-590M', wattage: 590, voltage: 50.80, current: 11.61, efficiency: 22.1, type: 'Bifacial', warranty: 30, priceKES: 35000, dimensions: { length: 2278, width: 1134, weight: 29.5 }, tempCoefficient: -0.30, degradationRate: 0.40, tier: 1 },
  { id: 'longi-bifacial-545', brand: 'Longi', model: 'Hi-MO 5 LR5-72HBD-545M', wattage: 545, voltage: 49.50, current: 11.01, efficiency: 21.1, type: 'Bifacial', warranty: 30, priceKES: 32500, dimensions: { length: 2256, width: 1133, weight: 28.5 }, tempCoefficient: -0.32, degradationRate: 0.45, tier: 1 },

  // CANADIAN SOLAR (12 models)
  { id: 'cs-670', brand: 'Canadian Solar', model: 'HiKu7 CS7N-670TB', wattage: 670, voltage: 52.60, current: 12.74, efficiency: 22.5, type: 'TOPCon', warranty: 30, priceKES: 38000, dimensions: { length: 2384, width: 1303, weight: 32.2 }, tempCoefficient: -0.29, degradationRate: 0.40, tier: 1 },
  { id: 'cs-600', brand: 'Canadian Solar', model: 'HiKu6 CS6W-600MS', wattage: 600, voltage: 51.00, current: 11.76, efficiency: 21.8, type: 'Monocrystalline', warranty: 25, priceKES: 32000, dimensions: { length: 2261, width: 1134, weight: 28.8 }, tempCoefficient: -0.34, degradationRate: 0.50, tier: 1 },
  { id: 'cs-580', brand: 'Canadian Solar', model: 'HiKu6 CS6W-580MS', wattage: 580, voltage: 50.20, current: 11.55, efficiency: 21.5, type: 'Monocrystalline', warranty: 25, priceKES: 30500, dimensions: { length: 2261, width: 1134, weight: 28.5 }, tempCoefficient: -0.34, degradationRate: 0.50, tier: 1 },
  { id: 'cs-565', brand: 'Canadian Solar', model: 'HiKu6 CS6W-565MS', wattage: 565, voltage: 49.70, current: 11.37, efficiency: 21.2, type: 'Monocrystalline', warranty: 25, priceKES: 29000, dimensions: { length: 2261, width: 1134, weight: 28.3 }, tempCoefficient: -0.34, degradationRate: 0.55, tier: 1 },
  { id: 'cs-550', brand: 'Canadian Solar', model: 'HiKu6 CS6W-550MS', wattage: 550, voltage: 49.60, current: 11.09, efficiency: 21.2, type: 'Monocrystalline', warranty: 25, priceKES: 28000, dimensions: { length: 2261, width: 1134, weight: 28.2 }, tempCoefficient: -0.34, degradationRate: 0.55, tier: 1 },
  { id: 'cs-545', brand: 'Canadian Solar', model: 'HiKu6 CS6W-545MS', wattage: 545, voltage: 49.45, current: 11.02, efficiency: 21.0, type: 'Monocrystalline', warranty: 25, priceKES: 27500, dimensions: { length: 2261, width: 1134, weight: 28.0 }, tempCoefficient: -0.34, degradationRate: 0.55, tier: 1 },
  { id: 'cs-500', brand: 'Canadian Solar', model: 'HiKu6 CS6W-500MS', wattage: 500, voltage: 45.60, current: 10.96, efficiency: 20.8, type: 'Monocrystalline', warranty: 25, priceKES: 25500, dimensions: { length: 2108, width: 1134, weight: 26.5 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'cs-480', brand: 'Canadian Solar', model: 'HiKu CS3W-480MS', wattage: 480, voltage: 43.80, current: 10.96, efficiency: 20.6, type: 'Monocrystalline', warranty: 25, priceKES: 24800, dimensions: { length: 2108, width: 1048, weight: 25.5 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'cs-460', brand: 'Canadian Solar', model: 'HiKu CS3W-460MS', wattage: 460, voltage: 42.10, current: 10.93, efficiency: 20.5, type: 'Monocrystalline', warranty: 25, priceKES: 24500, dimensions: { length: 2108, width: 1048, weight: 25.0 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'cs-450', brand: 'Canadian Solar', model: 'HiKu CS3W-450MS', wattage: 450, voltage: 41.50, current: 10.84, efficiency: 20.2, type: 'Monocrystalline', warranty: 25, priceKES: 23500, dimensions: { length: 2108, width: 1048, weight: 24.8 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'cs-bifacial-595', brand: 'Canadian Solar', model: 'BiHiKu7 CS7L-595MB', wattage: 595, voltage: 50.90, current: 11.69, efficiency: 22.0, type: 'Bifacial', warranty: 30, priceKES: 35500, dimensions: { length: 2261, width: 1134, weight: 30.0 }, tempCoefficient: -0.32, degradationRate: 0.40, tier: 1 },
  { id: 'cs-bifacial-545', brand: 'Canadian Solar', model: 'BiHiKu6 CS6W-545MB', wattage: 545, voltage: 49.45, current: 11.02, efficiency: 21.0, type: 'Bifacial', warranty: 30, priceKES: 31500, dimensions: { length: 2261, width: 1134, weight: 29.0 }, tempCoefficient: -0.33, degradationRate: 0.45, tier: 1 },

  // TRINA SOLAR (12 models)
  { id: 'trina-685', brand: 'Trina Solar', model: 'Vertex N TSM-NEG21C.20-685', wattage: 685, voltage: 53.20, current: 12.88, efficiency: 22.8, type: 'TOPCon', warranty: 30, priceKES: 40000, dimensions: { length: 2384, width: 1303, weight: 33.0 }, tempCoefficient: -0.28, degradationRate: 0.35, tier: 1 },
  { id: 'trina-605', brand: 'Trina Solar', model: 'Vertex S+ TSM-NEG9.28-605', wattage: 605, voltage: 51.30, current: 11.79, efficiency: 22.2, type: 'Monocrystalline', warranty: 25, priceKES: 33000, dimensions: { length: 2172, width: 1303, weight: 28.5 }, tempCoefficient: -0.32, degradationRate: 0.45, tier: 1 },
  { id: 'trina-580', brand: 'Trina Solar', model: 'Vertex TSM-DE21-580', wattage: 580, voltage: 50.30, current: 11.53, efficiency: 21.8, type: 'Monocrystalline', warranty: 25, priceKES: 30500, dimensions: { length: 2278, width: 1134, weight: 28.3 }, tempCoefficient: -0.34, degradationRate: 0.50, tier: 1 },
  { id: 'trina-570', brand: 'Trina Solar', model: 'Vertex TSM-DE21-570', wattage: 570, voltage: 50.00, current: 11.40, efficiency: 21.5, type: 'Monocrystalline', warranty: 25, priceKES: 29800, dimensions: { length: 2278, width: 1134, weight: 28.0 }, tempCoefficient: -0.34, degradationRate: 0.50, tier: 1 },
  { id: 'trina-555', brand: 'Trina Solar', model: 'Vertex TSM-DE19-555', wattage: 555, voltage: 49.60, current: 11.19, efficiency: 21.2, type: 'Monocrystalline', warranty: 25, priceKES: 28500, dimensions: { length: 2256, width: 1133, weight: 27.8 }, tempCoefficient: -0.34, degradationRate: 0.55, tier: 1 },
  { id: 'trina-550', brand: 'Trina Solar', model: 'Vertex TSM-550DE19', wattage: 550, voltage: 49.55, current: 11.10, efficiency: 21.2, type: 'Monocrystalline', warranty: 25, priceKES: 28200, dimensions: { length: 2256, width: 1133, weight: 28.0 }, tempCoefficient: -0.34, degradationRate: 0.55, tier: 1 },
  { id: 'trina-545', brand: 'Trina Solar', model: 'Vertex TSM-545DE19', wattage: 545, voltage: 49.40, current: 11.03, efficiency: 21.0, type: 'Monocrystalline', warranty: 25, priceKES: 27800, dimensions: { length: 2256, width: 1133, weight: 27.8 }, tempCoefficient: -0.34, degradationRate: 0.55, tier: 1 },
  { id: 'trina-500', brand: 'Trina Solar', model: 'Vertex S TSM-DE09.08-500', wattage: 500, voltage: 45.50, current: 10.99, efficiency: 21.1, type: 'Monocrystalline', warranty: 25, priceKES: 26000, dimensions: { length: 2094, width: 1134, weight: 26.0 }, tempCoefficient: -0.34, degradationRate: 0.55, tier: 1 },
  { id: 'trina-480', brand: 'Trina Solar', model: 'Vertex S TSM-DE09.08-480', wattage: 480, voltage: 43.60, current: 11.01, efficiency: 20.8, type: 'Monocrystalline', warranty: 25, priceKES: 25000, dimensions: { length: 2094, width: 1038, weight: 24.5 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'trina-450', brand: 'Trina Solar', model: 'Vertex S TSM-450DE09', wattage: 450, voltage: 41.45, current: 10.86, efficiency: 20.8, type: 'Monocrystalline', warranty: 25, priceKES: 24200, dimensions: { length: 2094, width: 1038, weight: 24.0 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'trina-bifacial-590', brand: 'Trina Solar', model: 'Vertex TSM-DEG21C.20-590', wattage: 590, voltage: 50.60, current: 11.66, efficiency: 21.9, type: 'Bifacial', warranty: 30, priceKES: 35000, dimensions: { length: 2278, width: 1134, weight: 29.5 }, tempCoefficient: -0.30, degradationRate: 0.40, tier: 1 },
  { id: 'trina-bifacial-550', brand: 'Trina Solar', model: 'Vertex TSM-DEG19C.20-550', wattage: 550, voltage: 49.55, current: 11.10, efficiency: 21.2, type: 'Bifacial', warranty: 30, priceKES: 32500, dimensions: { length: 2256, width: 1133, weight: 28.8 }, tempCoefficient: -0.32, degradationRate: 0.45, tier: 1 },

  // JINKO SOLAR (12 models)
  { id: 'jinko-700', brand: 'Jinko Solar', model: 'Tiger Neo N-type JKM700N-78HL4', wattage: 700, voltage: 54.00, current: 12.96, efficiency: 22.9, type: 'TOPCon', warranty: 30, priceKES: 42000, dimensions: { length: 2465, width: 1134, weight: 34.5 }, tempCoefficient: -0.28, degradationRate: 0.35, tier: 1 },
  { id: 'jinko-620', brand: 'Jinko Solar', model: 'Tiger Neo N-type JKM620N-72HL4', wattage: 620, voltage: 51.80, current: 11.97, efficiency: 22.3, type: 'TOPCon', warranty: 30, priceKES: 36000, dimensions: { length: 2274, width: 1134, weight: 29.0 }, tempCoefficient: -0.29, degradationRate: 0.38, tier: 1 },
  { id: 'jinko-580', brand: 'Jinko Solar', model: 'Tiger Pro JKM580M-7RL4', wattage: 580, voltage: 50.20, current: 11.55, efficiency: 21.8, type: 'Monocrystalline', warranty: 25, priceKES: 31000, dimensions: { length: 2274, width: 1134, weight: 28.3 }, tempCoefficient: -0.34, degradationRate: 0.50, tier: 1 },
  { id: 'jinko-570', brand: 'Jinko Solar', model: 'Tiger Pro JKM570M-7RL4', wattage: 570, voltage: 49.90, current: 11.42, efficiency: 21.5, type: 'Monocrystalline', warranty: 25, priceKES: 30000, dimensions: { length: 2274, width: 1134, weight: 28.0 }, tempCoefficient: -0.34, degradationRate: 0.50, tier: 1 },
  { id: 'jinko-555', brand: 'Jinko Solar', model: 'Tiger Neo N-type JKM555N-72HL4', wattage: 555, voltage: 49.85, current: 11.13, efficiency: 21.6, type: 'Monocrystalline', warranty: 25, priceKES: 29800, dimensions: { length: 2274, width: 1134, weight: 28.0 }, tempCoefficient: -0.30, degradationRate: 0.40, tier: 1 },
  { id: 'jinko-550', brand: 'Jinko Solar', model: 'Tiger Pro JKM550M-72HL4', wattage: 550, voltage: 49.60, current: 11.09, efficiency: 21.3, type: 'Monocrystalline', warranty: 25, priceKES: 28000, dimensions: { length: 2274, width: 1134, weight: 27.8 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'jinko-545', brand: 'Jinko Solar', model: 'Tiger Pro JKM545M-72HL4', wattage: 545, voltage: 49.50, current: 11.01, efficiency: 21.1, type: 'Monocrystalline', warranty: 25, priceKES: 27600, dimensions: { length: 2274, width: 1134, weight: 27.8 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'jinko-500', brand: 'Jinko Solar', model: 'Tiger Pro JKM500M-7RL3', wattage: 500, voltage: 45.50, current: 10.99, efficiency: 21.0, type: 'Monocrystalline', warranty: 25, priceKES: 26000, dimensions: { length: 2094, width: 1134, weight: 26.0 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'jinko-470', brand: 'Jinko Solar', model: 'Tiger Pro JKM470M-60HL4', wattage: 470, voltage: 43.20, current: 10.88, efficiency: 20.9, type: 'Monocrystalline', warranty: 25, priceKES: 24500, dimensions: { length: 2094, width: 1038, weight: 24.5 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'jinko-450', brand: 'Jinko Solar', model: 'Tiger Pro JKM450M-60HL4', wattage: 450, voltage: 41.48, current: 10.85, efficiency: 20.7, type: 'Monocrystalline', warranty: 25, priceKES: 23800, dimensions: { length: 2094, width: 1038, weight: 24.2 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'jinko-bifacial-600', brand: 'Jinko Solar', model: 'Tiger Neo JKM600N-72HL4-BDV', wattage: 600, voltage: 51.20, current: 11.72, efficiency: 22.2, type: 'Bifacial', warranty: 30, priceKES: 36000, dimensions: { length: 2274, width: 1134, weight: 30.0 }, tempCoefficient: -0.28, degradationRate: 0.38, tier: 1 },
  { id: 'jinko-bifacial-545', brand: 'Jinko Solar', model: 'Tiger Pro JKM545M-72HL4-V', wattage: 545, voltage: 49.50, current: 11.01, efficiency: 21.1, type: 'Bifacial', warranty: 30, priceKES: 32000, dimensions: { length: 2274, width: 1134, weight: 28.5 }, tempCoefficient: -0.32, degradationRate: 0.45, tier: 1 },

  // RISEN SOLAR (10 models)
  { id: 'risen-650', brand: 'Risen', model: 'RSM144-9-650BHDG', wattage: 650, voltage: 52.20, current: 12.45, efficiency: 22.2, type: 'Bifacial', warranty: 30, priceKES: 36500, dimensions: { length: 2384, width: 1303, weight: 31.5 }, tempCoefficient: -0.30, degradationRate: 0.40, tier: 1 },
  { id: 'risen-590', brand: 'Risen', model: 'RSM144-9-590M', wattage: 590, voltage: 50.50, current: 11.68, efficiency: 21.8, type: 'Monocrystalline', warranty: 25, priceKES: 30500, dimensions: { length: 2278, width: 1134, weight: 28.0 }, tempCoefficient: -0.34, degradationRate: 0.50, tier: 1 },
  { id: 'risen-580', brand: 'Risen', model: 'RSM144-7-580M', wattage: 580, voltage: 50.20, current: 11.55, efficiency: 21.5, type: 'Monocrystalline', warranty: 25, priceKES: 29500, dimensions: { length: 2278, width: 1134, weight: 27.8 }, tempCoefficient: -0.34, degradationRate: 0.50, tier: 1 },
  { id: 'risen-565', brand: 'Risen', model: 'RSM144-7-565M', wattage: 565, voltage: 49.80, current: 11.35, efficiency: 21.2, type: 'Monocrystalline', warranty: 25, priceKES: 28500, dimensions: { length: 2256, width: 1133, weight: 27.5 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'risen-550', brand: 'Risen', model: 'RSM144-7-550M', wattage: 550, voltage: 49.60, current: 11.09, efficiency: 21.2, type: 'Monocrystalline', warranty: 25, priceKES: 26500, dimensions: { length: 2256, width: 1133, weight: 27.5 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'risen-540', brand: 'Risen', model: 'RSM144-7-540M', wattage: 540, voltage: 49.30, current: 10.96, efficiency: 20.9, type: 'Monocrystalline', warranty: 25, priceKES: 26000, dimensions: { length: 2256, width: 1133, weight: 27.3 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'risen-500', brand: 'Risen', model: 'RSM120-8-500M', wattage: 500, voltage: 45.50, current: 10.99, efficiency: 20.8, type: 'Monocrystalline', warranty: 25, priceKES: 25000, dimensions: { length: 2094, width: 1134, weight: 25.5 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'risen-480', brand: 'Risen', model: 'RSM120-8-480M', wattage: 480, voltage: 43.80, current: 10.96, efficiency: 20.5, type: 'Monocrystalline', warranty: 25, priceKES: 24000, dimensions: { length: 2094, width: 1038, weight: 24.5 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'risen-460', brand: 'Risen', model: 'RSM120-7-460M', wattage: 460, voltage: 42.00, current: 10.95, efficiency: 20.3, type: 'Monocrystalline', warranty: 25, priceKES: 23000, dimensions: { length: 2094, width: 1038, weight: 24.0 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'risen-450', brand: 'Risen', model: 'RSM120-7-450M', wattage: 450, voltage: 41.50, current: 10.84, efficiency: 20.5, type: 'Monocrystalline', warranty: 25, priceKES: 22000, dimensions: { length: 2094, width: 1038, weight: 23.5 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },

  // DMEGC SOLAR (8 models)
  { id: 'dmegc-600', brand: 'DMEGC', model: 'DM600M10-78HBW', wattage: 600, voltage: 51.20, current: 11.72, efficiency: 21.8, type: 'Monocrystalline', warranty: 25, priceKES: 30000, dimensions: { length: 2278, width: 1134, weight: 28.5 }, tempCoefficient: -0.34, degradationRate: 0.50, tier: 2 },
  { id: 'dmegc-580', brand: 'DMEGC', model: 'DM580M10-72HBW', wattage: 580, voltage: 50.20, current: 11.55, efficiency: 21.5, type: 'Monocrystalline', warranty: 25, priceKES: 28000, dimensions: { length: 2256, width: 1133, weight: 27.5 }, tempCoefficient: -0.35, degradationRate: 0.50, tier: 2 },
  { id: 'dmegc-560', brand: 'DMEGC', model: 'DM560M10-72HBW', wattage: 560, voltage: 49.70, current: 11.27, efficiency: 21.2, type: 'Monocrystalline', warranty: 25, priceKES: 27000, dimensions: { length: 2256, width: 1133, weight: 27.2 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 2 },
  { id: 'dmegc-550', brand: 'DMEGC', model: 'DM550M10-72HBW', wattage: 550, voltage: 49.55, current: 11.10, efficiency: 21.2, type: 'Monocrystalline', warranty: 25, priceKES: 25500, dimensions: { length: 2256, width: 1133, weight: 27.0 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 2 },
  { id: 'dmegc-540', brand: 'DMEGC', model: 'DM540M10-72HBW', wattage: 540, voltage: 49.30, current: 10.96, efficiency: 20.9, type: 'Monocrystalline', warranty: 25, priceKES: 25000, dimensions: { length: 2256, width: 1133, weight: 26.8 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 2 },
  { id: 'dmegc-500', brand: 'DMEGC', model: 'DM500M10-66HBW', wattage: 500, voltage: 45.50, current: 10.99, efficiency: 20.7, type: 'Monocrystalline', warranty: 25, priceKES: 24000, dimensions: { length: 2094, width: 1134, weight: 25.0 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 2 },
  { id: 'dmegc-460', brand: 'DMEGC', model: 'DM460M10-60HBW', wattage: 460, voltage: 42.00, current: 10.95, efficiency: 20.5, type: 'Monocrystalline', warranty: 25, priceKES: 22000, dimensions: { length: 2094, width: 1038, weight: 23.5 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 2 },
  { id: 'dmegc-450', brand: 'DMEGC', model: 'DM450M10-60HBW', wattage: 450, voltage: 41.45, current: 10.86, efficiency: 20.6, type: 'Monocrystalline', warranty: 25, priceKES: 21500, dimensions: { length: 2094, width: 1038, weight: 23.0 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 2 },

  // ASTRONERGY (8 models)
  { id: 'astro-620', brand: 'Astronergy', model: 'ASTRO N7s-620', wattage: 620, voltage: 51.80, current: 11.97, efficiency: 22.2, type: 'TOPCon', warranty: 30, priceKES: 35000, dimensions: { length: 2278, width: 1134, weight: 29.0 }, tempCoefficient: -0.29, degradationRate: 0.40, tier: 1 },
  { id: 'astro-580', brand: 'Astronergy', model: 'ASTRO N5s-580', wattage: 580, voltage: 50.20, current: 11.55, efficiency: 21.7, type: 'Monocrystalline', warranty: 25, priceKES: 30000, dimensions: { length: 2278, width: 1134, weight: 28.0 }, tempCoefficient: -0.34, degradationRate: 0.50, tier: 1 },
  { id: 'astro-565', brand: 'Astronergy', model: 'ASTRO N5s-565', wattage: 565, voltage: 49.80, current: 11.35, efficiency: 21.3, type: 'Monocrystalline', warranty: 25, priceKES: 29000, dimensions: { length: 2256, width: 1133, weight: 27.5 }, tempCoefficient: -0.34, degradationRate: 0.50, tier: 1 },
  { id: 'astro-550', brand: 'Astronergy', model: 'ASTRO N5s-550', wattage: 550, voltage: 49.60, current: 11.09, efficiency: 21.1, type: 'Monocrystalline', warranty: 25, priceKES: 27500, dimensions: { length: 2256, width: 1133, weight: 27.2 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'astro-540', brand: 'Astronergy', model: 'ASTRO 5s-540', wattage: 540, voltage: 49.30, current: 10.96, efficiency: 20.8, type: 'Monocrystalline', warranty: 25, priceKES: 26500, dimensions: { length: 2256, width: 1133, weight: 27.0 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'astro-500', brand: 'Astronergy', model: 'ASTRO 5s-500', wattage: 500, voltage: 45.50, current: 10.99, efficiency: 20.6, type: 'Monocrystalline', warranty: 25, priceKES: 25000, dimensions: { length: 2094, width: 1134, weight: 25.5 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'astro-460', brand: 'Astronergy', model: 'ASTRO 5s-460', wattage: 460, voltage: 42.00, current: 10.95, efficiency: 20.4, type: 'Monocrystalline', warranty: 25, priceKES: 23500, dimensions: { length: 2094, width: 1038, weight: 24.0 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'astro-450', brand: 'Astronergy', model: 'ASTRO 5s-450', wattage: 450, voltage: 41.50, current: 10.84, efficiency: 20.2, type: 'Monocrystalline', warranty: 25, priceKES: 23000, dimensions: { length: 2094, width: 1038, weight: 23.5 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },

  // QCELLS (8 models)
  { id: 'qcells-600', brand: 'Q Cells', model: 'Q.PEAK DUO XL-G11.3-600', wattage: 600, voltage: 51.00, current: 11.76, efficiency: 22.0, type: 'Monocrystalline', warranty: 25, priceKES: 34000, dimensions: { length: 2278, width: 1134, weight: 29.0 }, tempCoefficient: -0.34, degradationRate: 0.45, tier: 1 },
  { id: 'qcells-575', brand: 'Q Cells', model: 'Q.PEAK DUO XL-G11.3-575', wattage: 575, voltage: 50.00, current: 11.50, efficiency: 21.6, type: 'Monocrystalline', warranty: 25, priceKES: 32000, dimensions: { length: 2256, width: 1133, weight: 28.0 }, tempCoefficient: -0.34, degradationRate: 0.50, tier: 1 },
  { id: 'qcells-560', brand: 'Q Cells', model: 'Q.PEAK DUO XL-G11.3-560', wattage: 560, voltage: 49.70, current: 11.27, efficiency: 21.3, type: 'Monocrystalline', warranty: 25, priceKES: 30500, dimensions: { length: 2256, width: 1133, weight: 27.8 }, tempCoefficient: -0.34, degradationRate: 0.50, tier: 1 },
  { id: 'qcells-550', brand: 'Q Cells', model: 'Q.PEAK DUO XL-G11.3-550', wattage: 550, voltage: 49.50, current: 11.11, efficiency: 21.1, type: 'Monocrystalline', warranty: 25, priceKES: 29500, dimensions: { length: 2256, width: 1133, weight: 27.5 }, tempCoefficient: -0.34, degradationRate: 0.50, tier: 1 },
  { id: 'qcells-490', brand: 'Q Cells', model: 'Q.PEAK DUO L-G9.4-490', wattage: 490, voltage: 45.00, current: 10.89, efficiency: 20.8, type: 'Monocrystalline', warranty: 25, priceKES: 27000, dimensions: { length: 2094, width: 1134, weight: 25.5 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'qcells-475', brand: 'Q Cells', model: 'Q.PEAK DUO L-G9.4-475', wattage: 475, voltage: 43.50, current: 10.92, efficiency: 20.6, type: 'Monocrystalline', warranty: 25, priceKES: 26000, dimensions: { length: 2094, width: 1038, weight: 24.5 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'qcells-460', brand: 'Q Cells', model: 'Q.PEAK DUO ML-G10+-460', wattage: 460, voltage: 42.10, current: 10.93, efficiency: 20.5, type: 'Monocrystalline', warranty: 25, priceKES: 25000, dimensions: { length: 2094, width: 1038, weight: 24.0 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },
  { id: 'qcells-450', brand: 'Q Cells', model: 'Q.PEAK DUO ML-G10+-450', wattage: 450, voltage: 41.40, current: 10.87, efficiency: 20.3, type: 'Monocrystalline', warranty: 25, priceKES: 24500, dimensions: { length: 2094, width: 1038, weight: 23.8 }, tempCoefficient: -0.35, degradationRate: 0.55, tier: 1 },

  // BUDGET/TIER 2-3 OPTIONS (20 models)
  { id: 'generic-600', brand: 'Generic Tier-2', model: 'Solar-600W-Mono', wattage: 600, voltage: 51.00, current: 11.76, efficiency: 21.5, type: 'Monocrystalline', warranty: 12, priceKES: 22000, dimensions: { length: 2278, width: 1134, weight: 29.0 }, tempCoefficient: -0.40, degradationRate: 0.70, tier: 2 },
  { id: 'generic-580', brand: 'Generic Tier-2', model: 'Solar-580W-Mono', wattage: 580, voltage: 50.20, current: 11.55, efficiency: 21.2, type: 'Monocrystalline', warranty: 12, priceKES: 20500, dimensions: { length: 2278, width: 1134, weight: 28.5 }, tempCoefficient: -0.40, degradationRate: 0.70, tier: 2 },
  { id: 'generic-560', brand: 'Generic Tier-2', model: 'Solar-560W-Mono', wattage: 560, voltage: 49.70, current: 11.27, efficiency: 21.0, type: 'Monocrystalline', warranty: 12, priceKES: 19500, dimensions: { length: 2256, width: 1133, weight: 28.0 }, tempCoefficient: -0.40, degradationRate: 0.70, tier: 2 },
  { id: 'generic-550', brand: 'Generic Tier-2', model: 'Solar-550W-Mono', wattage: 550, voltage: 49.50, current: 11.11, efficiency: 20.9, type: 'Monocrystalline', warranty: 12, priceKES: 19000, dimensions: { length: 2256, width: 1133, weight: 27.8 }, tempCoefficient: -0.40, degradationRate: 0.70, tier: 2 },
  { id: 'generic-540', brand: 'Generic Tier-1', model: 'Solar-540W', wattage: 540, voltage: 49.30, current: 10.96, efficiency: 20.8, type: 'Monocrystalline', warranty: 12, priceKES: 18500, dimensions: { length: 2256, width: 1133, weight: 28.0 }, tempCoefficient: -0.40, degradationRate: 0.70, tier: 2 },
  { id: 'generic-500', brand: 'Generic Tier-2', model: 'Solar-500W-Mono', wattage: 500, voltage: 45.50, current: 10.99, efficiency: 20.5, type: 'Monocrystalline', warranty: 12, priceKES: 17000, dimensions: { length: 2094, width: 1134, weight: 26.0 }, tempCoefficient: -0.40, degradationRate: 0.70, tier: 2 },
  { id: 'generic-480', brand: 'Generic Tier-2', model: 'Solar-480W-Mono', wattage: 480, voltage: 43.80, current: 10.96, efficiency: 20.3, type: 'Monocrystalline', warranty: 12, priceKES: 16000, dimensions: { length: 2094, width: 1038, weight: 25.0 }, tempCoefficient: -0.40, degradationRate: 0.70, tier: 2 },
  { id: 'generic-460', brand: 'Generic Tier-2', model: 'Solar-460W-Mono', wattage: 460, voltage: 42.00, current: 10.95, efficiency: 20.0, type: 'Monocrystalline', warranty: 12, priceKES: 15500, dimensions: { length: 2094, width: 1038, weight: 24.5 }, tempCoefficient: -0.40, degradationRate: 0.70, tier: 2 },
  { id: 'generic-450', brand: 'Generic Tier-1', model: 'Solar-450W', wattage: 450, voltage: 41.30, current: 10.90, efficiency: 20.2, type: 'Monocrystalline', warranty: 12, priceKES: 15500, dimensions: { length: 2094, width: 1038, weight: 24.0 }, tempCoefficient: -0.40, degradationRate: 0.70, tier: 2 },
  { id: 'generic-400', brand: 'Generic Tier-1', model: 'Solar-400W', wattage: 400, voltage: 37.00, current: 10.81, efficiency: 19.8, type: 'Monocrystalline', warranty: 12, priceKES: 13500, dimensions: { length: 1956, width: 992, weight: 22.0 }, tempCoefficient: -0.40, degradationRate: 0.70, tier: 2 },
  { id: 'poly-400', brand: 'Generic', model: 'Poly-400W', wattage: 400, voltage: 38.00, current: 10.53, efficiency: 18.5, type: 'Polycrystalline', warranty: 10, priceKES: 11000, dimensions: { length: 1956, width: 992, weight: 23.0 }, tempCoefficient: -0.42, degradationRate: 0.80, tier: 3 },
  { id: 'poly-350', brand: 'Generic', model: 'Poly-350W', wattage: 350, voltage: 37.80, current: 9.26, efficiency: 17.5, type: 'Polycrystalline', warranty: 10, priceKES: 9800, dimensions: { length: 1956, width: 992, weight: 22.0 }, tempCoefficient: -0.42, degradationRate: 0.80, tier: 3 },
  { id: 'poly-330', brand: 'Generic', model: 'Poly-330W', wattage: 330, voltage: 37.50, current: 8.80, efficiency: 17.0, type: 'Polycrystalline', warranty: 10, priceKES: 9500, dimensions: { length: 1956, width: 992, weight: 21.5 }, tempCoefficient: -0.42, degradationRate: 0.80, tier: 3 },
  { id: 'poly-320', brand: 'Generic', model: 'Poly-320W', wattage: 320, voltage: 37.20, current: 8.60, efficiency: 16.8, type: 'Polycrystalline', warranty: 10, priceKES: 8800, dimensions: { length: 1956, width: 992, weight: 21.0 }, tempCoefficient: -0.42, degradationRate: 0.80, tier: 3 },
  { id: 'poly-300', brand: 'Generic', model: 'Poly-300W', wattage: 300, voltage: 36.80, current: 8.15, efficiency: 16.5, type: 'Polycrystalline', warranty: 10, priceKES: 8200, dimensions: { length: 1956, width: 992, weight: 20.5 }, tempCoefficient: -0.42, degradationRate: 0.80, tier: 3 },
  { id: 'poly-280', brand: 'Generic', model: 'Poly-280W', wattage: 280, voltage: 36.50, current: 7.67, efficiency: 16.2, type: 'Polycrystalline', warranty: 10, priceKES: 7500, dimensions: { length: 1640, width: 992, weight: 18.5 }, tempCoefficient: -0.42, degradationRate: 0.80, tier: 3 },
  { id: 'poly-250', brand: 'Generic', model: 'Poly-250W', wattage: 250, voltage: 30.50, current: 8.20, efficiency: 15.8, type: 'Polycrystalline', warranty: 10, priceKES: 6800, dimensions: { length: 1640, width: 992, weight: 17.5 }, tempCoefficient: -0.42, degradationRate: 0.80, tier: 3 },
  { id: 'thin-film-200', brand: 'First Solar', model: 'Series 6 Plus-200', wattage: 200, voltage: 48.00, current: 4.17, efficiency: 18.5, type: 'Thin-Film', warranty: 25, priceKES: 16000, dimensions: { length: 2009, width: 1232, weight: 35.0 }, tempCoefficient: -0.32, degradationRate: 0.30, tier: 1 },
  { id: 'thin-film-180', brand: 'First Solar', model: 'Series 6 Plus-180', wattage: 180, voltage: 45.00, current: 4.00, efficiency: 17.8, type: 'Thin-Film', warranty: 25, priceKES: 14500, dimensions: { length: 2009, width: 1232, weight: 34.0 }, tempCoefficient: -0.32, degradationRate: 0.30, tier: 1 },
  { id: 'thin-film-160', brand: 'First Solar', model: 'Series 6-160', wattage: 160, voltage: 42.00, current: 3.81, efficiency: 17.0, type: 'Thin-Film', warranty: 25, priceKES: 13000, dimensions: { length: 2009, width: 1232, weight: 33.0 }, tempCoefficient: -0.32, degradationRate: 0.30, tier: 1 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 100+ BATTERIES DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

export const BATTERIES: BatteryUnit[] = [
  // PYLONTECH (12 models)
  { id: 'pylontech-force-h2', brand: 'Pylontech', model: 'Force H2 14.2kWh', capacity: 277, voltage: 51.2, type: 'LiFePO4', dod: 95, cycles: 6000, warranty: 15, priceKES: 495000, weight: 130, cRate: 1 },
  { id: 'pylontech-force-h1', brand: 'Pylontech', model: 'Force H1 10.6kWh', capacity: 207, voltage: 51.2, type: 'LiFePO4', dod: 95, cycles: 6000, warranty: 15, priceKES: 385000, weight: 105, cRate: 1 },
  { id: 'pylontech-us5000', brand: 'Pylontech', model: 'US5000', capacity: 100, voltage: 48, type: 'LiFePO4', dod: 95, cycles: 6000, warranty: 10, priceKES: 165000, weight: 52, cRate: 1 },
  { id: 'pylontech-us5000b', brand: 'Pylontech', model: 'US5000B', capacity: 100, voltage: 48, type: 'LiFePO4', dod: 95, cycles: 6000, warranty: 10, priceKES: 170000, weight: 53, cRate: 1 },
  { id: 'pylontech-us3000c', brand: 'Pylontech', model: 'US3000C', capacity: 74, voltage: 48, type: 'LiFePO4', dod: 95, cycles: 6000, warranty: 10, priceKES: 125000, weight: 36, cRate: 1 },
  { id: 'pylontech-us3000b', brand: 'Pylontech', model: 'US3000B', capacity: 74, voltage: 48, type: 'LiFePO4', dod: 95, cycles: 6000, warranty: 10, priceKES: 120000, weight: 35, cRate: 1 },
  { id: 'pylontech-us2000c', brand: 'Pylontech', model: 'US2000C', capacity: 50, voltage: 48, type: 'LiFePO4', dod: 95, cycles: 6000, warranty: 10, priceKES: 85000, weight: 24, cRate: 1 },
  { id: 'pylontech-us2000b', brand: 'Pylontech', model: 'US2000B', capacity: 50, voltage: 48, type: 'LiFePO4', dod: 90, cycles: 5000, warranty: 10, priceKES: 82000, weight: 23, cRate: 1 },
  { id: 'pylontech-us2000-plus', brand: 'Pylontech', model: 'US2000 Plus', capacity: 48, voltage: 48, type: 'LiFePO4', dod: 90, cycles: 5000, warranty: 10, priceKES: 78000, weight: 22, cRate: 1 },
  { id: 'pylontech-phantom-s', brand: 'Pylontech', model: 'Phantom-S 4.8kWh', capacity: 100, voltage: 48, type: 'LiFePO4', dod: 95, cycles: 6000, warranty: 10, priceKES: 175000, weight: 55, cRate: 1 },
  { id: 'pylontech-force-l1', brand: 'Pylontech', model: 'Force L1 3.5kWh', capacity: 70, voltage: 50, type: 'LiFePO4', dod: 95, cycles: 6000, warranty: 10, priceKES: 145000, weight: 38, cRate: 1 },
  { id: 'pylontech-force-l2', brand: 'Pylontech', model: 'Force L2 7.0kWh', capacity: 140, voltage: 50, type: 'LiFePO4', dod: 95, cycles: 6000, warranty: 10, priceKES: 275000, weight: 75, cRate: 1 },

  // BYD (10 models)
  { id: 'byd-hvs-12.8', brand: 'BYD', model: 'Battery-Box Premium HVS 12.8', capacity: 256, voltage: 51.2, type: 'LiFePO4', dod: 96, cycles: 8000, warranty: 10, priceKES: 685000, weight: 155, cRate: 1 },
  { id: 'byd-hvs-10.2', brand: 'BYD', model: 'Battery-Box Premium HVS 10.2', capacity: 204, voltage: 51.2, type: 'LiFePO4', dod: 96, cycles: 8000, warranty: 10, priceKES: 565000, weight: 125, cRate: 1 },
  { id: 'byd-hvs-7.7', brand: 'BYD', model: 'Battery-Box Premium HVS 7.7', capacity: 154, voltage: 51.2, type: 'LiFePO4', dod: 96, cycles: 8000, warranty: 10, priceKES: 425000, weight: 95, cRate: 1 },
  { id: 'byd-hvs-5.1', brand: 'BYD', model: 'Battery-Box HVS 5.1', capacity: 102, voltage: 51.2, type: 'LiFePO4', dod: 96, cycles: 8000, warranty: 10, priceKES: 285000, weight: 63, cRate: 1 },
  { id: 'byd-lvm-16', brand: 'BYD', model: 'Battery-Box Premium LVL 16', capacity: 320, voltage: 51.2, type: 'LiFePO4', dod: 96, cycles: 8000, warranty: 10, priceKES: 785000, weight: 180, cRate: 1 },
  { id: 'byd-lvs-8.0', brand: 'BYD', model: 'Battery-Box LVS 8.0', capacity: 160, voltage: 51.2, type: 'LiFePO4', dod: 96, cycles: 8000, warranty: 10, priceKES: 425000, weight: 98, cRate: 1 },
  { id: 'byd-lvs-4.0', brand: 'BYD', model: 'Battery-Box LVS 4.0', capacity: 80, voltage: 51.2, type: 'LiFePO4', dod: 96, cycles: 8000, warranty: 10, priceKES: 225000, weight: 50, cRate: 1 },
  { id: 'byd-lvl-15.4', brand: 'BYD', model: 'Battery-Box Premium LVL 15.4', capacity: 300, voltage: 51.2, type: 'LiFePO4', dod: 96, cycles: 8000, warranty: 10, priceKES: 745000, weight: 170, cRate: 1 },
  { id: 'byd-lfp-200', brand: 'BYD', model: 'B-Box 48V 200Ah', capacity: 200, voltage: 48, type: 'LiFePO4', dod: 90, cycles: 6000, warranty: 10, priceKES: 345000, weight: 95, cRate: 0.5 },
  { id: 'byd-lfp-100', brand: 'BYD', model: 'B-Box 48V 100Ah', capacity: 100, voltage: 48, type: 'LiFePO4', dod: 90, cycles: 6000, warranty: 10, priceKES: 185000, weight: 52, cRate: 0.5 },

  // HUAWEI LUNA (8 models)
  { id: 'huawei-luna-15', brand: 'Huawei', model: 'LUNA2000-15-S0', capacity: 290, voltage: 51.2, type: 'LiFePO4', dod: 100, cycles: 6000, warranty: 10, priceKES: 545000, weight: 162, cRate: 1 },
  { id: 'huawei-luna-10', brand: 'Huawei', model: 'LUNA2000-10-S0', capacity: 195, voltage: 51.2, type: 'LiFePO4', dod: 100, cycles: 6000, warranty: 10, priceKES: 365000, weight: 108, cRate: 1 },
  { id: 'huawei-luna-5', brand: 'Huawei', model: 'LUNA2000-5-S0', capacity: 97, voltage: 51.2, type: 'LiFePO4', dod: 100, cycles: 6000, warranty: 10, priceKES: 195000, weight: 54, cRate: 1 },
  { id: 'huawei-luna-7', brand: 'Huawei', model: 'LUNA2000-7-S0', capacity: 136, voltage: 51.2, type: 'LiFePO4', dod: 100, cycles: 6000, warranty: 10, priceKES: 265000, weight: 76, cRate: 1 },
  { id: 'huawei-luna-5-e0', brand: 'Huawei', model: 'LUNA2000-5-E0', capacity: 97, voltage: 51.2, type: 'LiFePO4', dod: 100, cycles: 6000, warranty: 10, priceKES: 185000, weight: 52, cRate: 1 },
  { id: 'huawei-luna-10-e0', brand: 'Huawei', model: 'LUNA2000-10-E0', capacity: 195, voltage: 51.2, type: 'LiFePO4', dod: 100, cycles: 6000, warranty: 10, priceKES: 355000, weight: 105, cRate: 1 },
  { id: 'huawei-luna-15-e0', brand: 'Huawei', model: 'LUNA2000-15-E0', capacity: 290, voltage: 51.2, type: 'LiFePO4', dod: 100, cycles: 6000, warranty: 10, priceKES: 535000, weight: 158, cRate: 1 },
  { id: 'huawei-luna-20', brand: 'Huawei', model: 'LUNA2000-20-S0', capacity: 390, voltage: 51.2, type: 'LiFePO4', dod: 100, cycles: 6000, warranty: 10, priceKES: 725000, weight: 216, cRate: 1 },

  // GROWATT (10 models)
  { id: 'growatt-ark-10.24', brand: 'Growatt', model: 'ARK 10.24XH', capacity: 200, voltage: 51.2, type: 'LiFePO4', dod: 95, cycles: 6000, warranty: 10, priceKES: 295000, weight: 105, cRate: 1 },
  { id: 'growatt-ark-7.68', brand: 'Growatt', model: 'ARK 7.68XH', capacity: 150, voltage: 51.2, type: 'LiFePO4', dod: 95, cycles: 6000, warranty: 10, priceKES: 225000, weight: 78, cRate: 1 },
  { id: 'growatt-ark-5.12', brand: 'Growatt', model: 'ARK 5.12XH', capacity: 100, voltage: 51.2, type: 'LiFePO4', dod: 95, cycles: 6000, warranty: 10, priceKES: 155000, weight: 53, cRate: 1 },
  { id: 'growatt-ark-2.56', brand: 'Growatt', model: 'ARK 2.56XH', capacity: 50, voltage: 51.2, type: 'LiFePO4', dod: 95, cycles: 6000, warranty: 10, priceKES: 82000, weight: 28, cRate: 1 },
  { id: 'growatt-ark-lv-5.12', brand: 'Growatt', model: 'ARK-LV 5.12kWh', capacity: 100, voltage: 51.2, type: 'LiFePO4', dod: 90, cycles: 5000, warranty: 10, priceKES: 145000, weight: 52, cRate: 0.5 },
  { id: 'growatt-ark-hv-5.12', brand: 'Growatt', model: 'ARK-HV 5.12kWh', capacity: 100, voltage: 102.4, type: 'LiFePO4', dod: 90, cycles: 5000, warranty: 10, priceKES: 165000, weight: 55, cRate: 0.5 },
  { id: 'growatt-gbli-6532', brand: 'Growatt', model: 'GBLI6532', capacity: 130, voltage: 51.2, type: 'LiFePO4', dod: 90, cycles: 5000, warranty: 5, priceKES: 185000, weight: 68, cRate: 0.5 },
  { id: 'growatt-gbli-5001', brand: 'Growatt', model: 'GBLI5001', capacity: 100, voltage: 51.2, type: 'LiFePO4', dod: 90, cycles: 5000, warranty: 5, priceKES: 145000, weight: 52, cRate: 0.5 },
  { id: 'growatt-lfp-51.2-200', brand: 'Growatt', model: 'LFP51.2V200Ah', capacity: 200, voltage: 51.2, type: 'LiFePO4', dod: 80, cycles: 4000, warranty: 5, priceKES: 245000, weight: 98, cRate: 0.5 },
  { id: 'growatt-lfp-51.2-100', brand: 'Growatt', model: 'LFP51.2V100Ah', capacity: 100, voltage: 51.2, type: 'LiFePO4', dod: 80, cycles: 4000, warranty: 5, priceKES: 135000, weight: 52, cRate: 0.5 },

  // SUNSYNK (8 models)
  { id: 'sunsynk-10.24', brand: 'Sunsynk', model: '10.24kWh Battery', capacity: 200, voltage: 51.2, type: 'LiFePO4', dod: 90, cycles: 5000, warranty: 10, priceKES: 285000, weight: 100, cRate: 1 },
  { id: 'sunsynk-7.68', brand: 'Sunsynk', model: '7.68kWh Battery', capacity: 150, voltage: 51.2, type: 'LiFePO4', dod: 90, cycles: 5000, warranty: 10, priceKES: 218000, weight: 75, cRate: 1 },
  { id: 'sunsynk-5.12', brand: 'Sunsynk', model: '5.12kWh Battery', capacity: 100, voltage: 51.2, type: 'LiFePO4', dod: 90, cycles: 5000, warranty: 10, priceKES: 145000, weight: 50, cRate: 1 },
  { id: 'sunsynk-2.56', brand: 'Sunsynk', model: '2.56kWh Battery', capacity: 50, voltage: 51.2, type: 'LiFePO4', dod: 90, cycles: 5000, warranty: 10, priceKES: 78000, weight: 27, cRate: 1 },
  { id: 'sunsynk-ip65-5.12', brand: 'Sunsynk', model: 'IP65 5.12kWh', capacity: 100, voltage: 51.2, type: 'LiFePO4', dod: 90, cycles: 5000, warranty: 10, priceKES: 158000, weight: 55, cRate: 1 },
  { id: 'sunsynk-ip65-10.24', brand: 'Sunsynk', model: 'IP65 10.24kWh', capacity: 200, voltage: 51.2, type: 'LiFePO4', dod: 90, cycles: 5000, warranty: 10, priceKES: 298000, weight: 105, cRate: 1 },
  { id: 'sunsynk-wall-5', brand: 'Sunsynk', model: 'Sunsynk Wall 5kWh', capacity: 100, voltage: 51.2, type: 'LiFePO4', dod: 90, cycles: 5000, warranty: 10, priceKES: 155000, weight: 52, cRate: 0.5 },
  { id: 'sunsynk-wall-10', brand: 'Sunsynk', model: 'Sunsynk Wall 10kWh', capacity: 200, voltage: 51.2, type: 'LiFePO4', dod: 90, cycles: 5000, warranty: 10, priceKES: 295000, weight: 102, cRate: 0.5 },

  // FELICITY SOLAR (8 models)
  { id: 'felicity-10kwh', brand: 'Felicity Solar', model: 'LPBF48200', capacity: 200, voltage: 48, type: 'LiFePO4', dod: 90, cycles: 4000, warranty: 5, priceKES: 185000, weight: 88, cRate: 0.5 },
  { id: 'felicity-5kwh', brand: 'Felicity Solar', model: 'LPBF48100', capacity: 100, voltage: 48, type: 'LiFePO4', dod: 90, cycles: 4000, warranty: 5, priceKES: 95000, weight: 45, cRate: 0.5 },
  { id: 'felicity-2.5kwh', brand: 'Felicity Solar', model: 'LPBF4850', capacity: 50, voltage: 48, type: 'LiFePO4', dod: 90, cycles: 4000, warranty: 5, priceKES: 52000, weight: 24, cRate: 0.5 },
  { id: 'felicity-wall-5', brand: 'Felicity Solar', model: 'Wall Mount 5kWh', capacity: 100, voltage: 48, type: 'LiFePO4', dod: 90, cycles: 4000, warranty: 5, priceKES: 98000, weight: 48, cRate: 0.5 },
  { id: 'felicity-wall-10', brand: 'Felicity Solar', model: 'Wall Mount 10kWh', capacity: 200, voltage: 48, type: 'LiFePO4', dod: 90, cycles: 4000, warranty: 5, priceKES: 188000, weight: 92, cRate: 0.5 },
  { id: 'felicity-rack-10', brand: 'Felicity Solar', model: 'Rack 10kWh', capacity: 200, voltage: 51.2, type: 'LiFePO4', dod: 90, cycles: 4000, warranty: 5, priceKES: 195000, weight: 95, cRate: 0.5 },
  { id: 'felicity-hv-10', brand: 'Felicity Solar', model: 'HV 10kWh', capacity: 100, voltage: 102.4, type: 'LiFePO4', dod: 90, cycles: 4000, warranty: 5, priceKES: 175000, weight: 50, cRate: 0.5 },
  { id: 'felicity-hv-20', brand: 'Felicity Solar', model: 'HV 20kWh', capacity: 200, voltage: 102.4, type: 'LiFePO4', dod: 90, cycles: 4000, warranty: 5, priceKES: 335000, weight: 98, cRate: 0.5 },

  // MUST SOLAR (6 models)
  { id: 'must-10kwh', brand: 'Must', model: 'LP16-48200', capacity: 200, voltage: 48, type: 'LiFePO4', dod: 90, cycles: 4000, warranty: 5, priceKES: 168000, weight: 85, cRate: 0.5 },
  { id: 'must-5kwh', brand: 'Must', model: 'LP16-48100', capacity: 100, voltage: 48, type: 'LiFePO4', dod: 90, cycles: 4000, warranty: 5, priceKES: 88000, weight: 44, cRate: 0.5 },
  { id: 'must-2.5kwh', brand: 'Must', model: 'LP16-4850', capacity: 50, voltage: 48, type: 'LiFePO4', dod: 90, cycles: 4000, warranty: 5, priceKES: 48000, weight: 24, cRate: 0.5 },
  { id: 'must-wall-5', brand: 'Must', model: 'Wall Mount 5kWh', capacity: 100, voltage: 48, type: 'LiFePO4', dod: 90, cycles: 4000, warranty: 5, priceKES: 92000, weight: 46, cRate: 0.5 },
  { id: 'must-rack-10', brand: 'Must', model: 'Server Rack 10kWh', capacity: 200, voltage: 51.2, type: 'LiFePO4', dod: 90, cycles: 4000, warranty: 5, priceKES: 175000, weight: 90, cRate: 0.5 },
  { id: 'must-powerwall', brand: 'Must', model: 'PowerWall 10kWh', capacity: 200, voltage: 51.2, type: 'LiFePO4', dod: 90, cycles: 4000, warranty: 5, priceKES: 185000, weight: 92, cRate: 0.5 },

  // TROJAN (GEL) (8 models)
  { id: 'trojan-12-245gel', brand: 'Trojan', model: '12-245GEL', capacity: 210, voltage: 12, type: 'Gel', dod: 50, cycles: 1500, warranty: 5, priceKES: 65000, weight: 68, cRate: 0.2 },
  { id: 'trojan-12-200gel', brand: 'Trojan', model: '12-200GEL', capacity: 200, voltage: 12, type: 'Gel', dod: 50, cycles: 1500, warranty: 5, priceKES: 62000, weight: 65, cRate: 0.2 },
  { id: 'trojan-12-150gel', brand: 'Trojan', model: '12-150GEL', capacity: 150, voltage: 12, type: 'Gel', dod: 50, cycles: 1500, warranty: 5, priceKES: 48000, weight: 50, cRate: 0.2 },
  { id: 'trojan-12-100gel', brand: 'Trojan', model: '12-100GEL', capacity: 100, voltage: 12, type: 'Gel', dod: 50, cycles: 1500, warranty: 5, priceKES: 35000, weight: 35, cRate: 0.2 },
  { id: 'trojan-6v-gel', brand: 'Trojan', model: '6V-GEL', capacity: 330, voltage: 6, type: 'Gel', dod: 50, cycles: 1500, warranty: 5, priceKES: 48000, weight: 45, cRate: 0.2 },
  { id: 'trojan-6v-305gel', brand: 'Trojan', model: '6V-305GEL', capacity: 305, voltage: 6, type: 'Gel', dod: 50, cycles: 1500, warranty: 5, priceKES: 45000, weight: 42, cRate: 0.2 },
  { id: 'trojan-6v-225gel', brand: 'Trojan', model: '6V-225GEL', capacity: 225, voltage: 6, type: 'Gel', dod: 50, cycles: 1500, warranty: 5, priceKES: 38000, weight: 38, cRate: 0.2 },
  { id: 'trojan-8v-170gel', brand: 'Trojan', model: '8V-170GEL', capacity: 170, voltage: 8, type: 'Gel', dod: 50, cycles: 1500, warranty: 5, priceKES: 42000, weight: 40, cRate: 0.2 },

  // RITAR (GEL/AGM) (10 models)
  { id: 'ritar-200gel', brand: 'Ritar', model: 'DC12-200G', capacity: 200, voltage: 12, type: 'Gel', dod: 50, cycles: 1200, warranty: 3, priceKES: 38000, weight: 62, cRate: 0.2 },
  { id: 'ritar-150gel', brand: 'Ritar', model: 'DC12-150G', capacity: 150, voltage: 12, type: 'Gel', dod: 50, cycles: 1200, warranty: 3, priceKES: 28000, weight: 48, cRate: 0.2 },
  { id: 'ritar-100gel', brand: 'Ritar', model: 'DC12-100G', capacity: 100, voltage: 12, type: 'Gel', dod: 50, cycles: 1200, warranty: 3, priceKES: 19500, weight: 32, cRate: 0.2 },
  { id: 'ritar-80gel', brand: 'Ritar', model: 'DC12-80G', capacity: 80, voltage: 12, type: 'Gel', dod: 50, cycles: 1200, warranty: 3, priceKES: 16000, weight: 26, cRate: 0.2 },
  { id: 'ritar-65gel', brand: 'Ritar', model: 'DC12-65G', capacity: 65, voltage: 12, type: 'Gel', dod: 50, cycles: 1200, warranty: 3, priceKES: 13500, weight: 22, cRate: 0.2 },
  { id: 'ritar-200agm', brand: 'Ritar', model: 'RA12-200', capacity: 200, voltage: 12, type: 'AGM', dod: 50, cycles: 1000, warranty: 3, priceKES: 35000, weight: 60, cRate: 0.2 },
  { id: 'ritar-150agm', brand: 'Ritar', model: 'RA12-150', capacity: 150, voltage: 12, type: 'AGM', dod: 50, cycles: 1000, warranty: 3, priceKES: 26000, weight: 45, cRate: 0.2 },
  { id: 'ritar-100agm', brand: 'Ritar', model: 'RA12-100', capacity: 100, voltage: 12, type: 'AGM', dod: 50, cycles: 1000, warranty: 3, priceKES: 18000, weight: 30, cRate: 0.2 },
  { id: 'ritar-75agm', brand: 'Ritar', model: 'RA12-75', capacity: 75, voltage: 12, type: 'AGM', dod: 50, cycles: 1000, warranty: 3, priceKES: 14000, weight: 24, cRate: 0.2 },
  { id: 'ritar-55agm', brand: 'Ritar', model: 'RA12-55', capacity: 55, voltage: 12, type: 'AGM', dod: 50, cycles: 1000, warranty: 3, priceKES: 11000, weight: 18, cRate: 0.2 },

  // VISION (AGM) (8 models)
  { id: 'vision-200agm', brand: 'Vision', model: '6FM200D-X', capacity: 200, voltage: 12, type: 'AGM', dod: 50, cycles: 1000, warranty: 3, priceKES: 35000, weight: 60, cRate: 0.2 },
  { id: 'vision-150agm', brand: 'Vision', model: '6FM150D-X', capacity: 150, voltage: 12, type: 'AGM', dod: 50, cycles: 1000, warranty: 3, priceKES: 26000, weight: 46, cRate: 0.2 },
  { id: 'vision-100agm', brand: 'Vision', model: '6FM100D-X', capacity: 100, voltage: 12, type: 'AGM', dod: 50, cycles: 1000, warranty: 3, priceKES: 18000, weight: 30, cRate: 0.2 },
  { id: 'vision-80agm', brand: 'Vision', model: '6FM80D-X', capacity: 80, voltage: 12, type: 'AGM', dod: 50, cycles: 1000, warranty: 3, priceKES: 15000, weight: 25, cRate: 0.2 },
  { id: 'vision-65agm', brand: 'Vision', model: '6FM65D-X', capacity: 65, voltage: 12, type: 'AGM', dod: 50, cycles: 1000, warranty: 3, priceKES: 12500, weight: 21, cRate: 0.2 },
  { id: 'vision-55agm', brand: 'Vision', model: '6FM55D-X', capacity: 55, voltage: 12, type: 'AGM', dod: 50, cycles: 1000, warranty: 3, priceKES: 10500, weight: 18, cRate: 0.2 },
  { id: 'vision-40agm', brand: 'Vision', model: '6FM40D-X', capacity: 40, voltage: 12, type: 'AGM', dod: 50, cycles: 1000, warranty: 3, priceKES: 8500, weight: 14, cRate: 0.2 },
  { id: 'vision-33agm', brand: 'Vision', model: '6FM33D-X', capacity: 33, voltage: 12, type: 'AGM', dod: 50, cycles: 1000, warranty: 3, priceKES: 7200, weight: 11, cRate: 0.2 },

  // LUMINOUS (TUBULAR) (6 models)
  { id: 'luminous-200tb', brand: 'Luminous', model: 'Red Charge RC25000', capacity: 200, voltage: 12, type: 'Tubular', dod: 80, cycles: 1500, warranty: 5, priceKES: 42000, weight: 70, cRate: 0.2 },
  { id: 'luminous-180tb', brand: 'Luminous', model: 'Red Charge RC22000', capacity: 180, voltage: 12, type: 'Tubular', dod: 80, cycles: 1500, warranty: 5, priceKES: 38000, weight: 62, cRate: 0.2 },
  { id: 'luminous-150tb', brand: 'Luminous', model: 'Red Charge RC18000', capacity: 150, voltage: 12, type: 'Tubular', dod: 80, cycles: 1500, warranty: 5, priceKES: 32000, weight: 55, cRate: 0.2 },
  { id: 'luminous-120tb', brand: 'Luminous', model: 'Red Charge RC15000', capacity: 120, voltage: 12, type: 'Tubular', dod: 80, cycles: 1500, warranty: 5, priceKES: 26000, weight: 45, cRate: 0.2 },
  { id: 'luminous-100tb', brand: 'Luminous', model: 'Red Charge RC12500', capacity: 100, voltage: 12, type: 'Tubular', dod: 80, cycles: 1500, warranty: 5, priceKES: 22000, weight: 38, cRate: 0.2 },
  { id: 'luminous-80tb', brand: 'Luminous', model: 'Red Charge RC10000', capacity: 80, voltage: 12, type: 'Tubular', dod: 80, cycles: 1500, warranty: 5, priceKES: 18000, weight: 32, cRate: 0.2 },

  // EXIDE (TUBULAR) (6 models)
  { id: 'exide-200tb', brand: 'Exide', model: 'IT500', capacity: 200, voltage: 12, type: 'Tubular', dod: 80, cycles: 1400, warranty: 5, priceKES: 38000, weight: 68, cRate: 0.2 },
  { id: 'exide-180tb', brand: 'Exide', model: 'IT450', capacity: 180, voltage: 12, type: 'Tubular', dod: 80, cycles: 1400, warranty: 5, priceKES: 35000, weight: 60, cRate: 0.2 },
  { id: 'exide-150tb', brand: 'Exide', model: 'IT400', capacity: 150, voltage: 12, type: 'Tubular', dod: 80, cycles: 1400, warranty: 5, priceKES: 28000, weight: 52, cRate: 0.2 },
  { id: 'exide-120tb', brand: 'Exide', model: 'IT320', capacity: 120, voltage: 12, type: 'Tubular', dod: 80, cycles: 1400, warranty: 5, priceKES: 24000, weight: 44, cRate: 0.2 },
  { id: 'exide-100tb', brand: 'Exide', model: 'IT250', capacity: 100, voltage: 12, type: 'Tubular', dod: 80, cycles: 1400, warranty: 5, priceKES: 20000, weight: 36, cRate: 0.2 },
  { id: 'exide-80tb', brand: 'Exide', model: 'IT200', capacity: 80, voltage: 12, type: 'Tubular', dod: 80, cycles: 1400, warranty: 5, priceKES: 16500, weight: 30, cRate: 0.2 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 100+ INVERTERS DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

export const INVERTERS: Inverter[] = [
  // DEYE (15 models)
  { id: 'deye-16kw-3ph', brand: 'Deye', model: 'SUN-16K-SG04LP3-EU', ratedPower: 16, maxPower: 19.2, type: 'Hybrid', mpptChannels: 2, efficiency: 97.8, warranty: 10, priceKES: 385000, features: ['WiFi', 'Parallel x9', '3-Phase', 'Battery Priority', 'Generator Input'], phase: 3 },
  { id: 'deye-12kw-3ph', brand: 'Deye', model: 'SUN-12K-SG04LP3-EU', ratedPower: 12, maxPower: 14.4, type: 'Hybrid', mpptChannels: 2, efficiency: 97.8, warranty: 10, priceKES: 285000, features: ['WiFi', 'Parallel x9', '3-Phase', 'Battery Priority', 'Generator Input'], phase: 3 },
  { id: 'deye-10kw-3ph', brand: 'Deye', model: 'SUN-10K-SG04LP3', ratedPower: 10, maxPower: 12, type: 'Hybrid', mpptChannels: 2, efficiency: 97.6, warranty: 10, priceKES: 225000, features: ['WiFi', 'Parallel', '3-Phase', 'Battery Priority'], phase: 3 },
  { id: 'deye-8kw-3ph', brand: 'Deye', model: 'SUN-8K-SG04LP3', ratedPower: 8, maxPower: 10, type: 'Hybrid', mpptChannels: 2, efficiency: 97.6, warranty: 10, priceKES: 185000, features: ['WiFi', 'Parallel', '3-Phase', 'Battery Priority'], phase: 3 },
  { id: 'deye-8kw-1ph', brand: 'Deye', model: 'SUN-8K-SG01LP1-EU', ratedPower: 8, maxPower: 10, type: 'Hybrid', mpptChannels: 2, efficiency: 97.6, warranty: 10, priceKES: 175000, features: ['WiFi', 'Parallel', '1-Phase', 'Battery Priority'], phase: 1 },
  { id: 'deye-6kw-1ph', brand: 'Deye', model: 'SUN-6K-SG03LP1-EU', ratedPower: 6, maxPower: 7.8, type: 'Hybrid', mpptChannels: 2, efficiency: 97.6, warranty: 10, priceKES: 145000, features: ['WiFi', 'Parallel', '1-Phase', 'Battery Priority'], phase: 1 },
  { id: 'deye-5kw', brand: 'Deye', model: 'SUN-5K-SG03LP1', ratedPower: 5, maxPower: 6.5, type: 'Hybrid', mpptChannels: 2, efficiency: 97.6, warranty: 10, priceKES: 125000, features: ['WiFi', 'Parallel', '1-Phase', 'Battery Priority'], phase: 1 },
  { id: 'deye-5kw-sg01', brand: 'Deye', model: 'SUN-5K-SG01LP1-EU', ratedPower: 5, maxPower: 6.5, type: 'Hybrid', mpptChannels: 2, efficiency: 97.5, warranty: 10, priceKES: 118000, features: ['WiFi', 'Parallel', '1-Phase'], phase: 1 },
  { id: 'deye-3.6kw', brand: 'Deye', model: 'SUN-3.6K-SG03LP1', ratedPower: 3.6, maxPower: 4.6, type: 'Hybrid', mpptChannels: 2, efficiency: 97.5, warranty: 10, priceKES: 95000, features: ['WiFi', 'Parallel', '1-Phase'], phase: 1 },
  { id: 'deye-3kw', brand: 'Deye', model: 'SUN-3K-SG03LP1', ratedPower: 3, maxPower: 3.9, type: 'Hybrid', mpptChannels: 1, efficiency: 97.4, warranty: 10, priceKES: 85000, features: ['WiFi', '1-Phase'], phase: 1 },
  { id: 'deye-5kw-lv', brand: 'Deye', model: 'SUN-5K-SG05LP1', ratedPower: 5, maxPower: 6, type: 'Off-Grid', mpptChannels: 2, efficiency: 93, warranty: 5, priceKES: 78000, features: ['MPPT 100A', 'WiFi Optional'], phase: 1 },
  { id: 'deye-3.5kw-lv', brand: 'Deye', model: 'SUN-3.5K-SG05LP1', ratedPower: 3.5, maxPower: 4.2, type: 'Off-Grid', mpptChannels: 1, efficiency: 93, warranty: 5, priceKES: 55000, features: ['MPPT 80A'], phase: 1 },
  { id: 'deye-micro-600', brand: 'Deye', model: 'SUN600G3-EU-230', ratedPower: 0.6, maxPower: 0.72, type: 'Micro', mpptChannels: 2, efficiency: 96.5, warranty: 12, priceKES: 18000, features: ['WiFi', 'Plug & Play'], phase: 1 },
  { id: 'deye-micro-800', brand: 'Deye', model: 'SUN800G3-EU-230', ratedPower: 0.8, maxPower: 0.96, type: 'Micro', mpptChannels: 2, efficiency: 96.5, warranty: 12, priceKES: 22000, features: ['WiFi', 'Plug & Play'], phase: 1 },
  { id: 'deye-micro-2000', brand: 'Deye', model: 'SUN2000G3-EU-230', ratedPower: 2, maxPower: 2.4, type: 'Micro', mpptChannels: 4, efficiency: 96.8, warranty: 12, priceKES: 42000, features: ['WiFi', 'Plug & Play'], phase: 1 },

  // GROWATT (15 models)
  { id: 'growatt-sph-15', brand: 'Growatt', model: 'SPH 15000TL3 BH-UP', ratedPower: 15, maxPower: 18, type: 'Hybrid', mpptChannels: 2, efficiency: 97.8, warranty: 10, priceKES: 345000, features: ['WiFi', '3-Phase', 'Smart', 'UPS Function', 'Battery Heating'], phase: 3 },
  { id: 'growatt-sph-12', brand: 'Growatt', model: 'SPH 12000TL3 BH-UP', ratedPower: 12, maxPower: 14.4, type: 'Hybrid', mpptChannels: 2, efficiency: 97.8, warranty: 10, priceKES: 275000, features: ['WiFi', '3-Phase', 'Smart', 'UPS Function'], phase: 3 },
  { id: 'growatt-sph-10', brand: 'Growatt', model: 'SPH 10000TL3 BH', ratedPower: 10, maxPower: 12, type: 'Hybrid', mpptChannels: 2, efficiency: 97.8, warranty: 10, priceKES: 235000, features: ['WiFi', '3-Phase', 'Smart', 'UPS Function'], phase: 3 },
  { id: 'growatt-sph-8', brand: 'Growatt', model: 'SPH 8000TL3 BH', ratedPower: 8, maxPower: 9.6, type: 'Hybrid', mpptChannels: 2, efficiency: 97.8, warranty: 10, priceKES: 195000, features: ['WiFi', '3-Phase', 'Smart', 'UPS Function'], phase: 3 },
  { id: 'growatt-sph-6', brand: 'Growatt', model: 'SPH 6000TL3 BH', ratedPower: 6, maxPower: 7.2, type: 'Hybrid', mpptChannels: 2, efficiency: 97.6, warranty: 10, priceKES: 155000, features: ['WiFi', '3-Phase', 'Smart'], phase: 3 },
  { id: 'growatt-spa-8', brand: 'Growatt', model: 'SPA 8000TL BL', ratedPower: 8, maxPower: 9.6, type: 'Hybrid', mpptChannels: 2, efficiency: 97.6, warranty: 10, priceKES: 175000, features: ['WiFi', '1-Phase', 'Smart'], phase: 1 },
  { id: 'growatt-sph-5', brand: 'Growatt', model: 'SPH 5000TL BL', ratedPower: 5, maxPower: 6, type: 'Hybrid', mpptChannels: 2, efficiency: 97.6, warranty: 10, priceKES: 135000, features: ['WiFi', '1-Phase', 'Smart'], phase: 1 },
  { id: 'growatt-sph-3.6', brand: 'Growatt', model: 'SPH 3600TL BL', ratedPower: 3.6, maxPower: 4.3, type: 'Hybrid', mpptChannels: 1, efficiency: 97.5, warranty: 10, priceKES: 95000, features: ['WiFi', '1-Phase'], phase: 1 },
  { id: 'growatt-spf-6000', brand: 'Growatt', model: 'SPF 6000ES Plus', ratedPower: 6, maxPower: 7.2, type: 'Off-Grid', mpptChannels: 2, efficiency: 93, warranty: 5, priceKES: 95000, features: ['MPPT 100A', 'WiFi', 'Generator Support'], phase: 1 },
  { id: 'growatt-spf-5000', brand: 'Growatt', model: 'SPF 5000ES', ratedPower: 5, maxPower: 6, type: 'Off-Grid', mpptChannels: 1, efficiency: 93, warranty: 5, priceKES: 78000, features: ['MPPT 80A', 'WiFi Optional'], phase: 1 },
  { id: 'growatt-spf-3500', brand: 'Growatt', model: 'SPF 3500TL LVM', ratedPower: 3.5, maxPower: 4.2, type: 'Off-Grid', mpptChannels: 1, efficiency: 93, warranty: 5, priceKES: 58000, features: ['MPPT 60A', 'Pure Sine'], phase: 1 },
  { id: 'growatt-spf-3000', brand: 'Growatt', model: 'SPF 3000TL LVM', ratedPower: 3, maxPower: 3.6, type: 'Off-Grid', mpptChannels: 1, efficiency: 93, warranty: 5, priceKES: 52000, features: ['MPPT 60A', 'Pure Sine'], phase: 1 },
  { id: 'growatt-min-6000', brand: 'Growatt', model: 'MIN 6000TL-X', ratedPower: 6, maxPower: 6.6, type: 'On-Grid', mpptChannels: 2, efficiency: 98.4, warranty: 10, priceKES: 85000, features: ['WiFi', 'Monitoring', 'Export Control'], phase: 1 },
  { id: 'growatt-min-5000', brand: 'Growatt', model: 'MIN 5000TL-X', ratedPower: 5, maxPower: 5.5, type: 'On-Grid', mpptChannels: 2, efficiency: 98.4, warranty: 10, priceKES: 72000, features: ['WiFi', 'Monitoring'], phase: 1 },
  { id: 'growatt-min-3000', brand: 'Growatt', model: 'MIN 3000TL-X', ratedPower: 3, maxPower: 3.3, type: 'On-Grid', mpptChannels: 1, efficiency: 98.2, warranty: 10, priceKES: 48000, features: ['WiFi', 'Monitoring'], phase: 1 },

  // SUNSYNK (12 models)
  { id: 'sunsynk-16kw', brand: 'Sunsynk', model: '16kW 3-Phase Hybrid', ratedPower: 16, maxPower: 19.2, type: 'Hybrid', mpptChannels: 2, efficiency: 97.8, warranty: 10, priceKES: 365000, features: ['WiFi', 'Parallel', 'Smart Load', 'Generator'], phase: 3 },
  { id: 'sunsynk-12kw', brand: 'Sunsynk', model: '12kW 3-Phase Hybrid', ratedPower: 12, maxPower: 14.4, type: 'Hybrid', mpptChannels: 2, efficiency: 97.8, warranty: 10, priceKES: 275000, features: ['WiFi', 'Parallel', 'Smart Load'], phase: 3 },
  { id: 'sunsynk-10kw', brand: 'Sunsynk', model: '10kW 3-Phase Hybrid', ratedPower: 10, maxPower: 12, type: 'Hybrid', mpptChannels: 2, efficiency: 97.8, warranty: 10, priceKES: 225000, features: ['WiFi', 'Parallel', 'Smart Load'], phase: 3 },
  { id: 'sunsynk-8.8kw', brand: 'Sunsynk', model: '8.8kW Hybrid', ratedPower: 8.8, maxPower: 10.5, type: 'Hybrid', mpptChannels: 2, efficiency: 97.8, warranty: 10, priceKES: 195000, features: ['WiFi', 'Parallel', 'Smart Load'], phase: 1 },
  { id: 'sunsynk-8kw', brand: 'Sunsynk', model: '8kW Hybrid', ratedPower: 8, maxPower: 9.6, type: 'Hybrid', mpptChannels: 2, efficiency: 97.6, warranty: 10, priceKES: 175000, features: ['WiFi', 'Parallel', 'Smart Load'], phase: 1 },
  { id: 'sunsynk-5kw', brand: 'Sunsynk', model: '5kW Hybrid', ratedPower: 5, maxPower: 6, type: 'Hybrid', mpptChannels: 2, efficiency: 97.6, warranty: 10, priceKES: 125000, features: ['WiFi', 'Parallel', 'Smart Load'], phase: 1 },
  { id: 'sunsynk-3.6kw', brand: 'Sunsynk', model: '3.6kW Hybrid', ratedPower: 3.6, maxPower: 4.3, type: 'Hybrid', mpptChannels: 1, efficiency: 97.5, warranty: 10, priceKES: 92000, features: ['WiFi', 'Parallel'], phase: 1 },
  { id: 'sunsynk-5kw-ecco', brand: 'Sunsynk', model: 'ECCO 5.5kW', ratedPower: 5.5, maxPower: 6.6, type: 'Off-Grid', mpptChannels: 2, efficiency: 93, warranty: 5, priceKES: 85000, features: ['MPPT 100A', 'WiFi'], phase: 1 },
  { id: 'sunsynk-3kw-ecco', brand: 'Sunsynk', model: 'ECCO 3.6kW', ratedPower: 3.6, maxPower: 4.3, type: 'Off-Grid', mpptChannels: 1, efficiency: 93, warranty: 5, priceKES: 55000, features: ['MPPT 80A'], phase: 1 },
  { id: 'sunsynk-6kw-on', brand: 'Sunsynk', model: '6kW On-Grid', ratedPower: 6, maxPower: 6.6, type: 'On-Grid', mpptChannels: 2, efficiency: 98.2, warranty: 10, priceKES: 82000, features: ['WiFi', 'Export Limit'], phase: 1 },
  { id: 'sunsynk-5kw-on', brand: 'Sunsynk', model: '5kW On-Grid', ratedPower: 5, maxPower: 5.5, type: 'On-Grid', mpptChannels: 2, efficiency: 98.2, warranty: 10, priceKES: 68000, features: ['WiFi', 'Export Limit'], phase: 1 },
  { id: 'sunsynk-3kw-on', brand: 'Sunsynk', model: '3kW On-Grid', ratedPower: 3, maxPower: 3.3, type: 'On-Grid', mpptChannels: 1, efficiency: 98, warranty: 10, priceKES: 45000, features: ['WiFi'], phase: 1 },

  // HUAWEI (10 models)
  { id: 'huawei-sun2000-20', brand: 'Huawei', model: 'SUN2000-20KTL-M3', ratedPower: 20, maxPower: 22, type: 'On-Grid', mpptChannels: 4, efficiency: 98.8, warranty: 10, priceKES: 285000, features: ['Smart', 'AI-Powered', 'Monitoring', 'Arc Detection'], phase: 3 },
  { id: 'huawei-sun2000-15', brand: 'Huawei', model: 'SUN2000-15KTL-M2', ratedPower: 15, maxPower: 16.5, type: 'On-Grid', mpptChannels: 3, efficiency: 98.7, warranty: 10, priceKES: 225000, features: ['Smart', 'Monitoring', 'Arc Detection'], phase: 3 },
  { id: 'huawei-sun2000-12', brand: 'Huawei', model: 'SUN2000-12KTL-M2', ratedPower: 12, maxPower: 13.2, type: 'On-Grid', mpptChannels: 2, efficiency: 98.6, warranty: 10, priceKES: 185000, features: ['Smart', 'Monitoring', 'Arc Detection'], phase: 3 },
  { id: 'huawei-sun2000-10', brand: 'Huawei', model: 'SUN2000-10KTL-M1', ratedPower: 10, maxPower: 11, type: 'On-Grid', mpptChannels: 2, efficiency: 98.6, warranty: 10, priceKES: 195000, features: ['Smart', 'Monitoring', 'Arc Detection'], phase: 3 },
  { id: 'huawei-sun2000-8', brand: 'Huawei', model: 'SUN2000-8KTL-M1', ratedPower: 8, maxPower: 8.8, type: 'On-Grid', mpptChannels: 2, efficiency: 98.6, warranty: 10, priceKES: 165000, features: ['Smart', 'Monitoring', 'Arc Detection'], phase: 3 },
  { id: 'huawei-sun2000-6', brand: 'Huawei', model: 'SUN2000-6KTL-M1', ratedPower: 6, maxPower: 6.6, type: 'On-Grid', mpptChannels: 2, efficiency: 98.5, warranty: 10, priceKES: 125000, features: ['Smart', 'Monitoring'], phase: 3 },
  { id: 'huawei-sun2000-5', brand: 'Huawei', model: 'SUN2000-5KTL-L1', ratedPower: 5, maxPower: 5.5, type: 'On-Grid', mpptChannels: 2, efficiency: 98.4, warranty: 10, priceKES: 95000, features: ['Smart', 'Monitoring'], phase: 1 },
  { id: 'huawei-sun2000-4', brand: 'Huawei', model: 'SUN2000-4KTL-L1', ratedPower: 4, maxPower: 4.4, type: 'On-Grid', mpptChannels: 2, efficiency: 98.3, warranty: 10, priceKES: 78000, features: ['Smart', 'Monitoring'], phase: 1 },
  { id: 'huawei-sun2000-3', brand: 'Huawei', model: 'SUN2000-3KTL-L1', ratedPower: 3, maxPower: 3.3, type: 'On-Grid', mpptChannels: 1, efficiency: 98.2, warranty: 10, priceKES: 62000, features: ['Smart', 'Monitoring'], phase: 1 },
  { id: 'huawei-sun2000-2', brand: 'Huawei', model: 'SUN2000-2KTL-L1', ratedPower: 2, maxPower: 2.2, type: 'On-Grid', mpptChannels: 1, efficiency: 98, warranty: 10, priceKES: 48000, features: ['Monitoring'], phase: 1 },

  // SOLIS (8 models)
  { id: 'solis-s6-10', brand: 'Solis', model: 'S6-GR3P10K', ratedPower: 10, maxPower: 11, type: 'On-Grid', mpptChannels: 2, efficiency: 98.4, warranty: 10, priceKES: 145000, features: ['WiFi', 'Export Limit', 'Arc Detection'], phase: 3 },
  { id: 'solis-s6-8', brand: 'Solis', model: 'S6-GR3P8K', ratedPower: 8, maxPower: 8.8, type: 'On-Grid', mpptChannels: 2, efficiency: 98.4, warranty: 10, priceKES: 125000, features: ['WiFi', 'Export Limit'], phase: 3 },
  { id: 'solis-s6-6', brand: 'Solis', model: 'S6-GR1P6K', ratedPower: 6, maxPower: 6.6, type: 'On-Grid', mpptChannels: 2, efficiency: 98.2, warranty: 10, priceKES: 85000, features: ['WiFi', 'Export Limit'], phase: 1 },
  { id: 'solis-s6-5', brand: 'Solis', model: 'S6-GR1P5K', ratedPower: 5, maxPower: 5.5, type: 'On-Grid', mpptChannels: 2, efficiency: 98.2, warranty: 10, priceKES: 72000, features: ['WiFi', 'Export Limit'], phase: 1 },
  { id: 'solis-s6-3.6', brand: 'Solis', model: 'S6-GR1P3.6K', ratedPower: 3.6, maxPower: 4, type: 'On-Grid', mpptChannels: 1, efficiency: 98, warranty: 10, priceKES: 55000, features: ['WiFi'], phase: 1 },
  { id: 'solis-rhv-6', brand: 'Solis', model: 'RHI-6K-48ES-5G', ratedPower: 6, maxPower: 7.2, type: 'Hybrid', mpptChannels: 2, efficiency: 97.5, warranty: 10, priceKES: 145000, features: ['WiFi', 'Battery', 'UPS'], phase: 1 },
  { id: 'solis-rhv-5', brand: 'Solis', model: 'RHI-5K-48ES-5G', ratedPower: 5, maxPower: 6, type: 'Hybrid', mpptChannels: 2, efficiency: 97.5, warranty: 10, priceKES: 125000, features: ['WiFi', 'Battery', 'UPS'], phase: 1 },
  { id: 'solis-rhv-3.6', brand: 'Solis', model: 'RHI-3.6K-48ES-5G', ratedPower: 3.6, maxPower: 4.3, type: 'Hybrid', mpptChannels: 1, efficiency: 97.3, warranty: 10, priceKES: 95000, features: ['WiFi', 'Battery'], phase: 1 },

  // VOLTRONIC / MUST (15 models)
  { id: 'voltronic-10kw', brand: 'Voltronic', model: 'Axpert MAX 10K', ratedPower: 10, maxPower: 12, type: 'Off-Grid', mpptChannels: 2, efficiency: 93.5, warranty: 2, priceKES: 145000, features: ['MPPT 150A', 'Parallel x9', 'Generator'], phase: 1 },
  { id: 'voltronic-8kw', brand: 'Voltronic', model: 'Axpert MAX 8K', ratedPower: 8, maxPower: 9.6, type: 'Off-Grid', mpptChannels: 2, efficiency: 93.5, warranty: 2, priceKES: 118000, features: ['MPPT 120A', 'Parallel x9'], phase: 1 },
  { id: 'voltronic-5kw', brand: 'Voltronic', model: 'Axpert VM III 5kW', ratedPower: 5, maxPower: 5.5, type: 'Off-Grid', mpptChannels: 1, efficiency: 93, warranty: 2, priceKES: 58000, features: ['MPPT 80A', 'Parallel'], phase: 1 },
  { id: 'voltronic-3kw', brand: 'Voltronic', model: 'Axpert VM III 3kW', ratedPower: 3, maxPower: 3.3, type: 'Off-Grid', mpptChannels: 1, efficiency: 93, warranty: 2, priceKES: 42000, features: ['MPPT 60A'], phase: 1 },
  { id: 'must-10kw', brand: 'Must', model: 'PH1800 Plus 10kW', ratedPower: 10, maxPower: 12, type: 'Off-Grid', mpptChannels: 2, efficiency: 93.5, warranty: 2, priceKES: 135000, features: ['MPPT 145A', 'Parallel x6'], phase: 1 },
  { id: 'must-8kw', brand: 'Must', model: 'PH1800 Plus 8kW', ratedPower: 8, maxPower: 9.6, type: 'Off-Grid', mpptChannels: 2, efficiency: 93.5, warranty: 2, priceKES: 108000, features: ['MPPT 120A', 'Parallel x6'], phase: 1 },
  { id: 'must-6kw', brand: 'Must', model: 'PV1800 VPM 6kW', ratedPower: 6, maxPower: 7.2, type: 'Off-Grid', mpptChannels: 1, efficiency: 93, warranty: 2, priceKES: 82000, features: ['MPPT 100A', 'WiFi Optional'], phase: 1 },
  { id: 'must-5kw', brand: 'Must', model: 'PV1800 VPM 5kW', ratedPower: 5, maxPower: 5.5, type: 'Off-Grid', mpptChannels: 1, efficiency: 93, warranty: 2, priceKES: 65000, features: ['MPPT 80A', 'WiFi Optional'], phase: 1 },
  { id: 'must-3kw', brand: 'Must', model: 'PV1800 VPM 3kW', ratedPower: 3, maxPower: 3.3, type: 'Off-Grid', mpptChannels: 1, efficiency: 93, warranty: 2, priceKES: 42000, features: ['MPPT 60A'], phase: 1 },
  { id: 'must-1.5kw', brand: 'Must', model: 'PV1800 VPM 1.5kW', ratedPower: 1.5, maxPower: 1.8, type: 'Off-Grid', mpptChannels: 1, efficiency: 93, warranty: 2, priceKES: 28000, features: ['MPPT 40A'], phase: 1 },
  { id: 'must-1kw', brand: 'Must', model: 'PV1000 1kW', ratedPower: 1, maxPower: 1.2, type: 'Off-Grid', mpptChannels: 1, efficiency: 92, warranty: 2, priceKES: 22000, features: ['PWM 50A'], phase: 1 },
  { id: 'must-800w', brand: 'Must', model: 'PV1000 0.8kW', ratedPower: 0.8, maxPower: 1, type: 'Off-Grid', mpptChannels: 1, efficiency: 92, warranty: 2, priceKES: 18000, features: ['PWM 40A'], phase: 1 },
  { id: 'must-600w', brand: 'Must', model: 'PV600 0.6kW', ratedPower: 0.6, maxPower: 0.72, type: 'Off-Grid', mpptChannels: 1, efficiency: 92, warranty: 2, priceKES: 14000, features: ['PWM 30A'], phase: 1 },
  { id: 'ep-solar-5kw', brand: 'EP Solar', model: 'EP3000 5kW', ratedPower: 5, maxPower: 5.5, type: 'Off-Grid', mpptChannels: 1, efficiency: 93, warranty: 2, priceKES: 52000, features: ['MPPT 80A', 'Parallel'], phase: 1 },
  { id: 'ep-solar-3kw', brand: 'EP Solar', model: 'EP3000 3kW', ratedPower: 3, maxPower: 3.3, type: 'Off-Grid', mpptChannels: 1, efficiency: 93, warranty: 2, priceKES: 38000, features: ['MPPT 60A'], phase: 1 },

  // FELICITY SOLAR (10 models)
  { id: 'felicity-15kw', brand: 'Felicity Solar', model: 'IVPM 15KW', ratedPower: 15, maxPower: 18, type: 'Off-Grid', mpptChannels: 2, efficiency: 93.5, warranty: 2, priceKES: 215000, features: ['MPPT 180A', 'Parallel', '3-Phase'], phase: 3 },
  { id: 'felicity-12kw', brand: 'Felicity Solar', model: 'IVPM 12KW', ratedPower: 12, maxPower: 14.4, type: 'Off-Grid', mpptChannels: 2, efficiency: 93.5, warranty: 2, priceKES: 175000, features: ['MPPT 150A', 'Parallel', '3-Phase'], phase: 3 },
  { id: 'felicity-10kw', brand: 'Felicity Solar', model: 'IVPM 10KW', ratedPower: 10, maxPower: 11, type: 'Off-Grid', mpptChannels: 2, efficiency: 93, warranty: 2, priceKES: 145000, features: ['MPPT 120A', 'Parallel', '3-Phase'], phase: 3 },
  { id: 'felicity-8kw', brand: 'Felicity Solar', model: 'IVPM 8KW', ratedPower: 8, maxPower: 9.6, type: 'Off-Grid', mpptChannels: 2, efficiency: 93, warranty: 2, priceKES: 115000, features: ['MPPT 100A', 'Parallel'], phase: 1 },
  { id: 'felicity-6kw', brand: 'Felicity Solar', model: 'IVPM 6KW', ratedPower: 6, maxPower: 7.2, type: 'Off-Grid', mpptChannels: 1, efficiency: 93, warranty: 2, priceKES: 78000, features: ['MPPT 100A'], phase: 1 },
  { id: 'felicity-5kw', brand: 'Felicity Solar', model: 'IVPM 5KW', ratedPower: 5, maxPower: 5.5, type: 'Off-Grid', mpptChannels: 1, efficiency: 93, warranty: 2, priceKES: 55000, features: ['MPPT 80A'], phase: 1 },
  { id: 'felicity-3kw', brand: 'Felicity Solar', model: 'IVPM 3KW', ratedPower: 3, maxPower: 3.3, type: 'Off-Grid', mpptChannels: 1, efficiency: 93, warranty: 2, priceKES: 38000, features: ['MPPT 60A'], phase: 1 },
  { id: 'felicity-2kw', brand: 'Felicity Solar', model: 'IVPM 2KW', ratedPower: 2, maxPower: 2.4, type: 'Off-Grid', mpptChannels: 1, efficiency: 92, warranty: 2, priceKES: 28000, features: ['MPPT 40A'], phase: 1 },
  { id: 'felicity-1.5kw', brand: 'Felicity Solar', model: 'IVPM 1.5KW', ratedPower: 1.5, maxPower: 1.8, type: 'Off-Grid', mpptChannels: 1, efficiency: 92, warranty: 2, priceKES: 22000, features: ['PWM 40A'], phase: 1 },
  { id: 'felicity-1kw', brand: 'Felicity Solar', model: 'IVPM 1KW', ratedPower: 1, maxPower: 1.2, type: 'Off-Grid', mpptChannels: 1, efficiency: 92, warranty: 2, priceKES: 16000, features: ['PWM 30A'], phase: 1 },

  // GOODWE (8 models)
  { id: 'goodwe-gw10k', brand: 'GoodWe', model: 'GW10K-ET', ratedPower: 10, maxPower: 11, type: 'Hybrid', mpptChannels: 2, efficiency: 97.8, warranty: 10, priceKES: 235000, features: ['WiFi', 'Backup', 'Smart', 'EPS'], phase: 3 },
  { id: 'goodwe-gw8k', brand: 'GoodWe', model: 'GW8K-ET', ratedPower: 8, maxPower: 8.8, type: 'Hybrid', mpptChannels: 2, efficiency: 97.8, warranty: 10, priceKES: 195000, features: ['WiFi', 'Backup', 'Smart'], phase: 3 },
  { id: 'goodwe-gw6k', brand: 'GoodWe', model: 'GW6K-ES', ratedPower: 6, maxPower: 6.6, type: 'Hybrid', mpptChannels: 2, efficiency: 97.6, warranty: 10, priceKES: 155000, features: ['WiFi', 'Backup'], phase: 1 },
  { id: 'goodwe-gw5k', brand: 'GoodWe', model: 'GW5K-ES', ratedPower: 5, maxPower: 5.5, type: 'Hybrid', mpptChannels: 2, efficiency: 97.6, warranty: 10, priceKES: 128000, features: ['WiFi', 'Backup'], phase: 1 },
  { id: 'goodwe-gw3.6k', brand: 'GoodWe', model: 'GW3600-ES', ratedPower: 3.6, maxPower: 4, type: 'Hybrid', mpptChannels: 1, efficiency: 97.4, warranty: 10, priceKES: 95000, features: ['WiFi', 'Backup'], phase: 1 },
  { id: 'goodwe-dns-5k', brand: 'GoodWe', model: 'GW5000-DNS', ratedPower: 5, maxPower: 5.5, type: 'On-Grid', mpptChannels: 2, efficiency: 98.2, warranty: 10, priceKES: 72000, features: ['WiFi', 'Monitoring'], phase: 1 },
  { id: 'goodwe-dns-3k', brand: 'GoodWe', model: 'GW3000-DNS', ratedPower: 3, maxPower: 3.3, type: 'On-Grid', mpptChannels: 1, efficiency: 98, warranty: 10, priceKES: 48000, features: ['WiFi', 'Monitoring'], phase: 1 },
  { id: 'goodwe-dns-2k', brand: 'GoodWe', model: 'GW2000-DNS', ratedPower: 2, maxPower: 2.2, type: 'On-Grid', mpptChannels: 1, efficiency: 97.8, warranty: 10, priceKES: 38000, features: ['WiFi'], phase: 1 },

  // SMA (6 models - Premium)
  { id: 'sma-tripower-10', brand: 'SMA', model: 'Tripower 10.0', ratedPower: 10, maxPower: 11, type: 'On-Grid', mpptChannels: 2, efficiency: 98.4, warranty: 10, priceKES: 285000, features: ['Smart Connect', 'ShadeFix', 'Grid Management'], phase: 3 },
  { id: 'sma-tripower-8', brand: 'SMA', model: 'Tripower 8.0', ratedPower: 8, maxPower: 8.8, type: 'On-Grid', mpptChannels: 2, efficiency: 98.4, warranty: 10, priceKES: 245000, features: ['Smart Connect', 'ShadeFix'], phase: 3 },
  { id: 'sma-tripower-6', brand: 'SMA', model: 'Tripower 6.0', ratedPower: 6, maxPower: 6.6, type: 'On-Grid', mpptChannels: 2, efficiency: 98.2, warranty: 10, priceKES: 195000, features: ['Smart Connect', 'ShadeFix'], phase: 3 },
  { id: 'sma-sunny-boy-5', brand: 'SMA', model: 'Sunny Boy 5.0', ratedPower: 5, maxPower: 5.5, type: 'On-Grid', mpptChannels: 2, efficiency: 97.8, warranty: 10, priceKES: 145000, features: ['Smart Connect'], phase: 1 },
  { id: 'sma-sunny-boy-3.6', brand: 'SMA', model: 'Sunny Boy 3.6', ratedPower: 3.6, maxPower: 4, type: 'On-Grid', mpptChannels: 2, efficiency: 97.6, warranty: 10, priceKES: 115000, features: ['Smart Connect'], phase: 1 },
  { id: 'sma-sunny-island-6', brand: 'SMA', model: 'Sunny Island 6.0H', ratedPower: 6, maxPower: 7.2, type: 'Off-Grid', mpptChannels: 0, efficiency: 96, warranty: 10, priceKES: 385000, features: ['Battery Inverter', 'AC Coupling', 'Premium'], phase: 1 },

  // FRONIUS (5 models - Premium)
  { id: 'fronius-symo-10', brand: 'Fronius', model: 'Symo 10.0-3-M', ratedPower: 10, maxPower: 11, type: 'On-Grid', mpptChannels: 2, efficiency: 98, warranty: 10, priceKES: 295000, features: ['Smart', 'Dynamic Peak Manager', 'WiFi'], phase: 3 },
  { id: 'fronius-symo-8', brand: 'Fronius', model: 'Symo 8.2-3-M', ratedPower: 8.2, maxPower: 9, type: 'On-Grid', mpptChannels: 2, efficiency: 98, warranty: 10, priceKES: 255000, features: ['Smart', 'Dynamic Peak Manager'], phase: 3 },
  { id: 'fronius-primo-5', brand: 'Fronius', model: 'Primo 5.0-1', ratedPower: 5, maxPower: 5.5, type: 'On-Grid', mpptChannels: 2, efficiency: 98.1, warranty: 10, priceKES: 165000, features: ['Smart', 'SnapINverter'], phase: 1 },
  { id: 'fronius-primo-3.6', brand: 'Fronius', model: 'Primo 3.6-1', ratedPower: 3.6, maxPower: 4, type: 'On-Grid', mpptChannels: 2, efficiency: 98, warranty: 10, priceKES: 135000, features: ['Smart', 'SnapINverter'], phase: 1 },
  { id: 'fronius-gen24-6', brand: 'Fronius', model: 'GEN24 6.0 Plus', ratedPower: 6, maxPower: 6.6, type: 'Hybrid', mpptChannels: 2, efficiency: 98.2, warranty: 10, priceKES: 285000, features: ['PV Point', 'Battery Ready', 'Premium'], phase: 1 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ACCESSORIES DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

export const ACCESSORIES: Accessory[] = [
  // Mounting
  { id: 'mount-rail-3m', category: 'mounting', brand: 'Generic', model: 'Aluminum Rail 3m', description: 'Anodized aluminum mounting rail 3 meters', priceKES: 2800, unit: 'piece' },
  { id: 'mount-rail-4m', category: 'mounting', brand: 'Generic', model: 'Aluminum Rail 4m', description: 'Anodized aluminum mounting rail 4 meters', priceKES: 3600, unit: 'piece' },
  { id: 'mount-clamp-mid', category: 'mounting', brand: 'Generic', model: 'Mid Clamp 35mm', description: 'Universal mid clamp for 35mm frames', priceKES: 120, unit: 'piece' },
  { id: 'mount-clamp-end', category: 'mounting', brand: 'Generic', model: 'End Clamp 35mm', description: 'End clamp for 35mm panel frames', priceKES: 150, unit: 'piece' },
  { id: 'mount-l-foot', category: 'mounting', brand: 'Generic', model: 'L-Foot Bracket', description: 'Stainless steel L-foot for roof mounting', priceKES: 280, unit: 'piece' },
  { id: 'mount-tile-hook', category: 'mounting', brand: 'Generic', model: 'Tile Roof Hook', description: 'Adjustable hook for tile roofs', priceKES: 450, unit: 'piece' },
  { id: 'mount-ground-screw', category: 'mounting', brand: 'Generic', model: 'Ground Screw 1.2m', description: 'Galvanized ground screw for ground mount', priceKES: 2500, unit: 'piece' },
  { id: 'mount-pole-kit', category: 'mounting', brand: 'Generic', model: 'Pole Mount Kit', description: 'Complete pole mounting kit for 4 panels', priceKES: 18000, unit: 'set' },

  // Cables
  { id: 'cable-pv-4mm', category: 'cable', brand: 'Generic', model: 'PV Cable 4mm²', description: 'Solar DC cable 4mm² per meter', priceKES: 85, unit: 'meter' },
  { id: 'cable-pv-6mm', category: 'cable', brand: 'Generic', model: 'PV Cable 6mm²', description: 'Solar DC cable 6mm² per meter', priceKES: 120, unit: 'meter' },
  { id: 'cable-pv-10mm', category: 'cable', brand: 'Generic', model: 'PV Cable 10mm²', description: 'Solar DC cable 10mm² per meter', priceKES: 185, unit: 'meter' },
  { id: 'cable-pv-16mm', category: 'cable', brand: 'Generic', model: 'PV Cable 16mm²', description: 'Solar DC cable 16mm² per meter', priceKES: 280, unit: 'meter' },
  { id: 'cable-battery-25mm', category: 'cable', brand: 'Generic', model: 'Battery Cable 25mm²', description: 'Flexible battery cable 25mm² per meter', priceKES: 350, unit: 'meter' },
  { id: 'cable-battery-35mm', category: 'cable', brand: 'Generic', model: 'Battery Cable 35mm²', description: 'Flexible battery cable 35mm² per meter', priceKES: 480, unit: 'meter' },
  { id: 'cable-battery-50mm', category: 'cable', brand: 'Generic', model: 'Battery Cable 50mm²', description: 'Flexible battery cable 50mm² per meter', priceKES: 650, unit: 'meter' },
  { id: 'cable-ac-4mm', category: 'cable', brand: 'Generic', model: 'AC Cable 4mm² 3-Core', description: 'AC cable 4mm² 3-core per meter', priceKES: 250, unit: 'meter' },
  { id: 'cable-ac-6mm', category: 'cable', brand: 'Generic', model: 'AC Cable 6mm² 3-Core', description: 'AC cable 6mm² 3-core per meter', priceKES: 380, unit: 'meter' },
  { id: 'cable-ac-10mm', category: 'cable', brand: 'Generic', model: 'AC Cable 10mm² 3-Core', description: 'AC cable 10mm² 3-core per meter', priceKES: 580, unit: 'meter' },

  // Connectors
  { id: 'mc4-pair', category: 'connector', brand: 'Generic', model: 'MC4 Connector Pair', description: 'MC4 male/female connector pair', priceKES: 150, unit: 'pair' },
  { id: 'mc4-branch-2', category: 'connector', brand: 'Generic', model: 'MC4 Y-Branch 2-1', description: 'MC4 Y-connector 2 to 1', priceKES: 280, unit: 'piece' },
  { id: 'mc4-branch-3', category: 'connector', brand: 'Generic', model: 'MC4 Y-Branch 3-1', description: 'MC4 Y-connector 3 to 1', priceKES: 380, unit: 'piece' },
  { id: 'battery-terminal', category: 'connector', brand: 'Generic', model: 'Battery Terminal Lug', description: 'Copper battery terminal various sizes', priceKES: 80, unit: 'piece' },
  { id: 'anderson-50a', category: 'connector', brand: 'Anderson', model: 'SB50 Connector', description: 'Anderson 50A power connector', priceKES: 450, unit: 'pair' },
  { id: 'anderson-175a', category: 'connector', brand: 'Anderson', model: 'SB175 Connector', description: 'Anderson 175A power connector', priceKES: 850, unit: 'pair' },

  // Protection
  { id: 'fuse-20a', category: 'protection', brand: 'Generic', model: 'DC Fuse 20A', description: '20A DC fuse for solar', priceKES: 120, unit: 'piece' },
  { id: 'fuse-30a', category: 'protection', brand: 'Generic', model: 'DC Fuse 30A', description: '30A DC fuse for solar', priceKES: 150, unit: 'piece' },
  { id: 'fuse-holder', category: 'protection', brand: 'Generic', model: 'DC Fuse Holder', description: 'In-line fuse holder for DC', priceKES: 280, unit: 'piece' },
  { id: 'dc-breaker-32a', category: 'protection', brand: 'Generic', model: 'DC MCB 32A 600V', description: 'DC circuit breaker 32A 600V', priceKES: 1200, unit: 'piece' },
  { id: 'dc-breaker-63a', category: 'protection', brand: 'Generic', model: 'DC MCB 63A 600V', description: 'DC circuit breaker 63A 600V', priceKES: 1800, unit: 'piece' },
  { id: 'dc-isolator-32a', category: 'protection', brand: 'Generic', model: 'DC Isolator 32A', description: 'DC isolator switch 32A 1000V', priceKES: 2500, unit: 'piece' },
  { id: 'surge-dc', category: 'protection', brand: 'Generic', model: 'DC Surge Protector', description: 'DC surge protection device 600V', priceKES: 3500, unit: 'piece' },
  { id: 'surge-ac', category: 'protection', brand: 'Generic', model: 'AC Surge Protector', description: 'AC surge protection device 275V', priceKES: 2800, unit: 'piece' },
  { id: 'combiner-4', category: 'protection', brand: 'Generic', model: 'PV Combiner Box 4-Way', description: '4-string combiner box with fuses', priceKES: 8500, unit: 'piece' },
  { id: 'combiner-6', category: 'protection', brand: 'Generic', model: 'PV Combiner Box 6-Way', description: '6-string combiner box with fuses', priceKES: 12000, unit: 'piece' },
  { id: 'earth-rod', category: 'protection', brand: 'Generic', model: 'Earth Rod 1.5m', description: 'Copper-bonded earth rod 1.5m', priceKES: 1800, unit: 'piece' },
  { id: 'earth-clamp', category: 'protection', brand: 'Generic', model: 'Earth Rod Clamp', description: 'Earth rod clamp for grounding', priceKES: 350, unit: 'piece' },

  // Monitoring
  { id: 'energy-meter', category: 'monitoring', brand: 'Generic', model: 'Energy Meter DIN', description: 'Single phase energy meter DIN rail', priceKES: 3500, unit: 'piece' },
  { id: 'energy-meter-3ph', category: 'monitoring', brand: 'Generic', model: 'Energy Meter 3-Phase', description: 'Three phase energy meter CT type', priceKES: 8500, unit: 'piece' },
  { id: 'wifi-dongle', category: 'monitoring', brand: 'Generic', model: 'WiFi Monitoring Dongle', description: 'WiFi dongle for inverter monitoring', priceKES: 3500, unit: 'piece' },
  { id: 'ct-100a', category: 'monitoring', brand: 'Generic', model: 'Current Transformer 100A', description: 'CT for energy monitoring 100A', priceKES: 1500, unit: 'piece' },
  { id: 'ct-200a', category: 'monitoring', brand: 'Generic', model: 'Current Transformer 200A', description: 'CT for energy monitoring 200A', priceKES: 2200, unit: 'piece' },
  { id: 'battery-monitor', category: 'monitoring', brand: 'Victron', model: 'BMV-712 Smart', description: 'Battery monitor with Bluetooth', priceKES: 25000, unit: 'piece' },
  { id: 'smart-shunt', category: 'monitoring', brand: 'Victron', model: 'SmartShunt 500A', description: 'Smart battery shunt 500A', priceKES: 18000, unit: 'piece' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// KENYA CLIMATE DATA (Expanded)
// ═══════════════════════════════════════════════════════════════════════════════

export const KENYA_CLIMATE: Record<string, { avgSunHours: number; avgTemp: number; irradiance: number; humidity: number; altitude: number }> = {
  'Nairobi': { avgSunHours: 5.5, avgTemp: 18, irradiance: 5.2, humidity: 65, altitude: 1795 },
  'Mombasa': { avgSunHours: 6.5, avgTemp: 27, irradiance: 5.8, humidity: 78, altitude: 50 },
  'Kisumu': { avgSunHours: 5.8, avgTemp: 24, irradiance: 5.5, humidity: 70, altitude: 1131 },
  'Nakuru': { avgSunHours: 5.3, avgTemp: 17, irradiance: 5.0, humidity: 60, altitude: 1850 },
  'Eldoret': { avgSunHours: 4.8, avgTemp: 15, irradiance: 4.7, humidity: 72, altitude: 2100 },
  'Malindi': { avgSunHours: 7.0, avgTemp: 28, irradiance: 6.2, humidity: 75, altitude: 20 },
  'Garissa': { avgSunHours: 8.5, avgTemp: 32, irradiance: 7.5, humidity: 45, altitude: 128 },
  'Turkana': { avgSunHours: 9.0, avgTemp: 35, irradiance: 8.0, humidity: 35, altitude: 400 },
  'Lodwar': { avgSunHours: 9.2, avgTemp: 36, irradiance: 8.2, humidity: 32, altitude: 506 },
  'Kitale': { avgSunHours: 5.0, avgTemp: 19, irradiance: 4.8, humidity: 75, altitude: 1890 },
  'Machakos': { avgSunHours: 5.8, avgTemp: 20, irradiance: 5.4, humidity: 62, altitude: 1600 },
  'Nyeri': { avgSunHours: 5.0, avgTemp: 16, irradiance: 4.8, humidity: 70, altitude: 1759 },
  'Meru': { avgSunHours: 5.2, avgTemp: 17, irradiance: 5.0, humidity: 68, altitude: 1570 },
  'Thika': { avgSunHours: 5.4, avgTemp: 19, irradiance: 5.1, humidity: 65, altitude: 1549 },
  'Kilifi': { avgSunHours: 6.8, avgTemp: 27, irradiance: 6.0, humidity: 76, altitude: 60 },
  'Lamu': { avgSunHours: 7.2, avgTemp: 28, irradiance: 6.5, humidity: 80, altitude: 10 },
  'Isiolo': { avgSunHours: 7.5, avgTemp: 28, irradiance: 6.8, humidity: 50, altitude: 1100 },
  'Marsabit': { avgSunHours: 8.0, avgTemp: 25, irradiance: 7.2, humidity: 45, altitude: 1345 },
  'Mandera': { avgSunHours: 8.8, avgTemp: 34, irradiance: 7.8, humidity: 40, altitude: 230 },
  'Wajir': { avgSunHours: 8.5, avgTemp: 33, irradiance: 7.6, humidity: 42, altitude: 244 },
  'Moyale': { avgSunHours: 7.8, avgTemp: 26, irradiance: 7.0, humidity: 48, altitude: 1097 },
  'Narok': { avgSunHours: 5.5, avgTemp: 18, irradiance: 5.2, humidity: 65, altitude: 1827 },
  'Kajiado': { avgSunHours: 6.0, avgTemp: 20, irradiance: 5.5, humidity: 58, altitude: 1700 },
  'Naivasha': { avgSunHours: 5.8, avgTemp: 18, irradiance: 5.4, humidity: 60, altitude: 1884 },
  'Nanyuki': { avgSunHours: 5.5, avgTemp: 16, irradiance: 5.2, humidity: 65, altitude: 1947 },
  'Embu': { avgSunHours: 5.3, avgTemp: 18, irradiance: 5.0, humidity: 68, altitude: 1430 },
  'Kericho': { avgSunHours: 4.5, avgTemp: 16, irradiance: 4.5, humidity: 80, altitude: 2010 },
  'Kisii': { avgSunHours: 4.8, avgTemp: 18, irradiance: 4.6, humidity: 78, altitude: 1700 },
  'Bungoma': { avgSunHours: 5.2, avgTemp: 20, irradiance: 5.0, humidity: 72, altitude: 1540 },
  'Kakamega': { avgSunHours: 5.0, avgTemp: 21, irradiance: 4.8, humidity: 75, altitude: 1535 },
  'Voi': { avgSunHours: 7.5, avgTemp: 26, irradiance: 6.8, humidity: 55, altitude: 560 },
  'Taveta': { avgSunHours: 7.2, avgTemp: 24, irradiance: 6.5, humidity: 60, altitude: 750 },
  'Kwale': { avgSunHours: 6.8, avgTemp: 26, irradiance: 6.2, humidity: 74, altitude: 420 },
  'Default': { avgSunHours: 5.5, avgTemp: 22, irradiance: 5.3, humidity: 65, altitude: 1500 },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ELECTRICITY TARIFFS (KPLC 2026)
// ═══════════════════════════════════════════════════════════════════════════════

export const ELECTRICITY_TARIFFS = {
  domestic: {
    lifeline: { limit: 10, rate: 12.0 },     // 0-10 kWh
    tier1: { limit: 100, rate: 15.80 },       // 11-100 kWh
    tier2: { limit: 200, rate: 20.57 },       // 101-200 kWh
    tier3: { limit: Infinity, rate: 22.50 },  // >200 kWh
  },
  smallCommercial: 18.50,
  commercial: 16.80,
  industrial: {
    ci1: 14.20,  // Commercial/Industrial 1
    ci2: 12.50,  // Commercial/Industrial 2
    ci3: 10.80,  // Commercial/Industrial 3
  },
  fuelCost: 3.20,      // Per kWh
  forex: 1.50,          // Per kWh
  inflation: 0.85,      // Per kWh
  waterLevy: 0.90,      // Per kWh
  erc: 0.35,            // Per kWh
  rep: 0.25,            // Per kWh
  vat: 0.16,            // 16% VAT
};

// Helper function to calculate monthly electricity cost
export function calculateElectricityCost(kwhPerMonth: number, tariffType: 'domestic' | 'smallCommercial' | 'commercial' | 'industrial' = 'domestic'): number {
  let baseCost = 0;

  if (tariffType === 'domestic') {
    const tariff = ELECTRICITY_TARIFFS.domestic;
    let remaining = kwhPerMonth;

    // Lifeline (0-10 kWh)
    const lifelineUsage = Math.min(remaining, tariff.lifeline.limit);
    baseCost += lifelineUsage * tariff.lifeline.rate;
    remaining -= lifelineUsage;

    // Tier 1 (11-100 kWh)
    if (remaining > 0) {
      const tier1Usage = Math.min(remaining, tariff.tier1.limit - tariff.lifeline.limit);
      baseCost += tier1Usage * tariff.tier1.rate;
      remaining -= tier1Usage;
    }

    // Tier 2 (101-200 kWh)
    if (remaining > 0) {
      const tier2Usage = Math.min(remaining, tariff.tier2.limit - tariff.tier1.limit);
      baseCost += tier2Usage * tariff.tier2.rate;
      remaining -= tier2Usage;
    }

    // Tier 3 (>200 kWh)
    if (remaining > 0) {
      baseCost += remaining * tariff.tier3.rate;
    }
  } else {
    const rate = typeof ELECTRICITY_TARIFFS[tariffType] === 'number'
      ? ELECTRICITY_TARIFFS[tariffType] as number
      : 16.80;
    baseCost = kwhPerMonth * rate;
  }

  // Add levies
  const fuelCost = kwhPerMonth * ELECTRICITY_TARIFFS.fuelCost;
  const forex = kwhPerMonth * ELECTRICITY_TARIFFS.forex;
  const inflation = kwhPerMonth * ELECTRICITY_TARIFFS.inflation;
  const waterLevy = kwhPerMonth * ELECTRICITY_TARIFFS.waterLevy;
  const erc = kwhPerMonth * ELECTRICITY_TARIFFS.erc;
  const rep = kwhPerMonth * ELECTRICITY_TARIFFS.rep;

  const subtotal = baseCost + fuelCost + forex + inflation + waterLevy + erc + rep;
  const vat = subtotal * ELECTRICITY_TARIFFS.vat;

  return subtotal + vat;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COST OPTIMIZATION ALGORITHM
// ═══════════════════════════════════════════════════════════════════════════════

export interface OptimizationResult {
  panels: { panel: SolarPanel; quantity: number }[];
  batteries: { battery: BatteryUnit; quantity: number }[];
  inverter: Inverter;
  accessories: { accessory: Accessory; quantity: number }[];
  totalCost: number;
  costBreakdown: {
    panels: number;
    batteries: number;
    inverter: number;
    accessories: number;
    installation: number;
  };
  systemSpecs: {
    totalWattage: number;
    totalBatteryKwh: number;
    dailyProduction: number;
    autonomyDays: number;
    systemVoltage: number;
  };
  roi: {
    monthlySavings: number;
    paybackYears: number;
    twentyFiveYearSavings: number;
  };
}

export function findOptimalSystem(
  dailyConsumption: number,  // kWh
  peakLoad: number,         // Watts
  backupHours: number,
  location: string,
  budget: 'economy' | 'standard' | 'premium',
  gridConnected: boolean
): OptimizationResult[] {
  const climate = KENYA_CLIMATE[location] || KENYA_CLIMATE['Default'];
  const results: OptimizationResult[] = [];

  // Calculate requirements
  const efficiencyLoss = 0.80;
  const tempDerate = 1 - ((climate.avgTemp - 25) * 0.004);
  const requiredPanelWattage = (dailyConsumption / (climate.avgSunHours * efficiencyLoss * tempDerate)) * 1000;
  const requiredBatteryKwh = dailyConsumption * (backupHours / 24) / 0.8;
  const requiredInverterKw = (peakLoad / 1000) * 1.25;

  // Filter equipment by budget
  let panelPool = [...SOLAR_PANELS];
  let batteryPool = [...BATTERIES];
  let inverterPool = [...INVERTERS];

  if (budget === 'economy') {
    panelPool = panelPool.filter(p => p.tier >= 2 || p.priceKES < 22000);
    batteryPool = batteryPool.filter(b => b.type !== 'LiFePO4' || b.priceKES < 100000);
    inverterPool = inverterPool.filter(i => i.type === 'Off-Grid' || i.priceKES < 100000);
  } else if (budget === 'premium') {
    panelPool = panelPool.filter(p => p.tier === 1 && p.efficiency > 21);
    batteryPool = batteryPool.filter(b => b.type === 'LiFePO4' && b.cycles >= 5000);
    inverterPool = inverterPool.filter(i => (i.type === 'Hybrid' || i.type === 'On-Grid') && i.efficiency > 97);
  }

  // Sort by value (performance/price ratio)
  panelPool.sort((a, b) => (b.efficiency / b.priceKES) - (a.efficiency / a.priceKES));
  batteryPool.sort((a, b) => (b.cycles / b.priceKES) - (a.cycles / a.priceKES));
  inverterPool.sort((a, b) => a.priceKES - b.priceKES);

  // Generate top 3 combinations
  for (let i = 0; i < Math.min(3, panelPool.length); i++) {
    const panel = panelPool[i];
    const panelCount = Math.ceil(requiredPanelWattage / panel.wattage);

    for (let j = 0; j < Math.min(2, batteryPool.length); j++) {
      const battery = batteryPool[j];
      const batteryKwh = (battery.capacity * battery.voltage) / 1000;
      const batteryCount = Math.ceil(requiredBatteryKwh / batteryKwh);

      const inverter = inverterPool.find(inv => inv.ratedPower >= requiredInverterKw) || inverterPool[0];

      // Calculate costs
      const panelCost = panel.priceKES * panelCount;
      const batteryCost = battery.priceKES * batteryCount;
      const inverterCost = inverter.priceKES;
      const accessoriesCost = (panelCost + batteryCost + inverterCost) * 0.12;
      const installationCost = (panelCost + batteryCost + inverterCost) * 0.18;
      const totalCost = panelCost + batteryCost + inverterCost + accessoriesCost + installationCost;

      // Calculate ROI
      const monthlyConsumption = dailyConsumption * 30;
      const monthlyGridCost = calculateElectricityCost(monthlyConsumption);
      const monthlySavings = monthlyGridCost * (gridConnected ? 0.75 : 1);
      const paybackYears = totalCost / (monthlySavings * 12);

      results.push({
        panels: [{ panel, quantity: panelCount }],
        batteries: [{ battery, quantity: batteryCount }],
        inverter,
        accessories: [],
        totalCost,
        costBreakdown: {
          panels: panelCost,
          batteries: batteryCost,
          inverter: inverterCost,
          accessories: accessoriesCost,
          installation: installationCost,
        },
        systemSpecs: {
          totalWattage: panel.wattage * panelCount,
          totalBatteryKwh: batteryKwh * batteryCount,
          dailyProduction: (panel.wattage * panelCount * climate.avgSunHours * efficiencyLoss) / 1000,
          autonomyDays: (batteryKwh * batteryCount) / dailyConsumption,
          systemVoltage: battery.voltage,
        },
        roi: {
          monthlySavings,
          paybackYears,
          twentyFiveYearSavings: (monthlySavings * 12 * 25) - totalCost,
        },
      });
    }
  }

  // Sort by total cost (cheapest first)
  results.sort((a, b) => a.totalCost - b.totalCost);

  return results.slice(0, 3);
}
