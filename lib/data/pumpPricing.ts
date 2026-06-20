// ═══════════════════════════════════════════════════════════════════════════════
// Borehole submersible pump pricing — canonical source.
// Used by the /solutions/borehole-pumps page (display) and lib/pricing (catalog).
// Indicative ballpark ranges; the binding figure comes from the ERP quotation.
// ═══════════════════════════════════════════════════════════════════════════════

export interface PumpPriceRow {
  size: string;
  depth: string;
  flow: string;
  pumpPrice: string;
  installPrice: string;
  totalEstimate: string;
}

export const PUMP_PRICING: PumpPriceRow[] = [
  { size: '0.5 HP (0.37kW)', depth: '30-50m', flow: '0.5-1 m³/hr', pumpPrice: 'KES 25,000 - 35,000', installPrice: 'KES 15,000 - 25,000', totalEstimate: 'KES 80,000 - 120,000' },
  { size: '1 HP (0.75kW)', depth: '40-80m', flow: '1-2 m³/hr', pumpPrice: 'KES 35,000 - 50,000', installPrice: 'KES 20,000 - 35,000', totalEstimate: 'KES 100,000 - 180,000' },
  { size: '1.5 HP (1.1kW)', depth: '50-100m', flow: '1.5-3 m³/hr', pumpPrice: 'KES 45,000 - 65,000', installPrice: 'KES 25,000 - 45,000', totalEstimate: 'KES 150,000 - 250,000' },
  { size: '2 HP (1.5kW)', depth: '60-120m', flow: '2-4 m³/hr', pumpPrice: 'KES 55,000 - 80,000', installPrice: 'KES 35,000 - 55,000', totalEstimate: 'KES 180,000 - 300,000' },
  { size: '3 HP (2.2kW)', depth: '80-150m', flow: '3-6 m³/hr', pumpPrice: 'KES 75,000 - 110,000', installPrice: 'KES 45,000 - 70,000', totalEstimate: 'KES 250,000 - 400,000' },
  { size: '5 HP (3.7kW)', depth: '100-200m', flow: '5-10 m³/hr', pumpPrice: 'KES 120,000 - 180,000', installPrice: 'KES 60,000 - 90,000', totalEstimate: 'KES 350,000 - 550,000' },
  { size: '7.5 HP (5.5kW)', depth: '120-250m', flow: '7-15 m³/hr', pumpPrice: 'KES 180,000 - 280,000', installPrice: 'KES 80,000 - 120,000', totalEstimate: 'KES 500,000 - 750,000' },
  { size: '10 HP (7.5kW)', depth: '150-300m', flow: '10-20 m³/hr', pumpPrice: 'KES 250,000 - 380,000', installPrice: 'KES 100,000 - 150,000', totalEstimate: 'KES 650,000 - 1,000,000' },
  { size: '15 HP (11kW)', depth: '180-350m', flow: '15-30 m³/hr', pumpPrice: 'KES 380,000 - 550,000', installPrice: 'KES 130,000 - 200,000', totalEstimate: 'KES 900,000 - 1,400,000' },
  { size: '20 HP (15kW)', depth: '200-400m', flow: '20-40 m³/hr', pumpPrice: 'KES 500,000 - 750,000', installPrice: 'KES 180,000 - 280,000', totalEstimate: 'KES 1,200,000 - 1,800,000' },
  { size: '25 HP (18.5kW)', depth: '250-450m', flow: '25-50 m³/hr', pumpPrice: 'KES 650,000 - 950,000', installPrice: 'KES 220,000 - 350,000', totalEstimate: 'KES 1,500,000 - 2,200,000' },
  { size: '30 HP (22kW)', depth: '300-500m', flow: '30-60 m³/hr', pumpPrice: 'KES 800,000 - 1,200,000', installPrice: 'KES 280,000 - 420,000', totalEstimate: 'KES 1,800,000 - 2,800,000' },
  { size: '40 HP (30kW)', depth: '350-500m+', flow: '40-80 m³/hr', pumpPrice: 'KES 1,100,000 - 1,600,000', installPrice: 'KES 350,000 - 500,000', totalEstimate: 'KES 2,400,000 - 3,500,000' },
  { size: '50 HP (37kW)', depth: '400-500m+', flow: '50-100 m³/hr', pumpPrice: 'KES 1,400,000 - 2,000,000', installPrice: 'KES 420,000 - 600,000', totalEstimate: 'KES 3,000,000 - 4,500,000' },
  { size: '75 HP (55kW)', depth: '400-500m+', flow: '75-150 m³/hr', pumpPrice: 'KES 2,000,000 - 3,000,000', installPrice: 'KES 550,000 - 800,000', totalEstimate: 'KES 4,500,000 - 6,500,000' },
];
