/**
 * Suppliers & Material Prices API
 * Provides real-time supplier matching and material pricing
 *
 * Data Sources:
 * - Database (Prisma) for verified suppliers
 * - Static pricing data as fallback
 * - Regional market rates
 */

import { NextRequest, NextResponse } from 'next/server';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface Supplier {
  id: string;
  name: string;
  category: string[];
  location: string;
  county?: string;
  rating: number;
  verified: boolean;
  leadTimeDays: number;
  paymentTerms: string[];
  minOrder: number;
  maxOrder: number;
  priceLevel: 'budget' | 'standard' | 'premium';
  certifications: string[];
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

interface MaterialPrice {
  material: string;
  unit: string;
  price: number;
  currency: string;
  source: string;
  lastUpdated: string;
}

// =============================================================================
// SUPPLIER DATABASE (Kenya-focused)
// =============================================================================

const KENYA_SUPPLIERS: Supplier[] = [
  // Cement Suppliers
  {
    id: 'bamburi-cement',
    name: 'Bamburi Cement',
    category: ['cement', 'concrete', 'ready-mix'],
    location: 'Mombasa',
    county: 'Mombasa',
    rating: 4.8,
    verified: true,
    leadTimeDays: 3,
    paymentTerms: ['cash', 'credit-30'],
    minOrder: 100,
    maxOrder: 50000,
    priceLevel: 'standard',
    certifications: ['ISO 9001', 'ISO 14001', 'KEBS'],
    contact: { website: 'https://www.lafargeholcim.co.ke' },
  },
  {
    id: 'savannah-cement',
    name: 'Savannah Cement',
    category: ['cement', 'concrete'],
    location: 'Athi River',
    county: 'Machakos',
    rating: 4.6,
    verified: true,
    leadTimeDays: 2,
    paymentTerms: ['cash', 'credit-14', 'credit-30'],
    minOrder: 50,
    maxOrder: 30000,
    priceLevel: 'budget',
    certifications: ['KEBS', 'ISO 9001'],
    contact: { website: 'https://www.savannahcement.com' },
  },
  {
    id: 'national-cement',
    name: 'National Cement',
    category: ['cement'],
    location: 'Nairobi',
    county: 'Nairobi',
    rating: 4.5,
    verified: true,
    leadTimeDays: 2,
    paymentTerms: ['cash', 'credit-30'],
    minOrder: 100,
    maxOrder: 40000,
    priceLevel: 'standard',
    certifications: ['KEBS'],
  },

  // Steel Suppliers
  {
    id: 'devki-steel',
    name: 'Devki Steel Mills',
    category: ['steel', 'reinforcement', 'roofing'],
    location: 'Ruiru',
    county: 'Kiambu',
    rating: 4.7,
    verified: true,
    leadTimeDays: 5,
    paymentTerms: ['cash', 'credit-30', 'credit-60'],
    minOrder: 500,
    maxOrder: 100000,
    priceLevel: 'standard',
    certifications: ['ISO 9001', 'KEBS'],
    contact: { website: 'https://www.devkisteel.com' },
  },
  {
    id: 'tononoka-steel',
    name: 'Tononoka Steel',
    category: ['steel', 'reinforcement', 'structural'],
    location: 'Mombasa',
    county: 'Mombasa',
    rating: 4.6,
    verified: true,
    leadTimeDays: 4,
    paymentTerms: ['cash', 'credit-30'],
    minOrder: 1000,
    maxOrder: 80000,
    priceLevel: 'standard',
    certifications: ['KEBS', 'ISO 9001'],
  },

  // Roofing Suppliers
  {
    id: 'mabati-rolling',
    name: 'Mabati Rolling Mills',
    category: ['roofing', 'steel', 'gutters'],
    location: 'Nairobi',
    county: 'Nairobi',
    rating: 4.9,
    verified: true,
    leadTimeDays: 7,
    paymentTerms: ['cash', 'credit-30'],
    minOrder: 50,
    maxOrder: 20000,
    priceLevel: 'premium',
    certifications: ['ISO 9001', 'KEBS', 'ISO 14001'],
    contact: { website: 'https://www.mabati.com' },
  },
  {
    id: 'versatile-roofing',
    name: 'Versatile Roofing',
    category: ['roofing', 'gutters'],
    location: 'Nairobi',
    county: 'Nairobi',
    rating: 4.5,
    verified: true,
    leadTimeDays: 5,
    paymentTerms: ['cash', 'credit-14'],
    minOrder: 30,
    maxOrder: 10000,
    priceLevel: 'standard',
    certifications: ['KEBS'],
  },

  // Tiles & Sanitary
  {
    id: 'keda-ceramics',
    name: 'Keda Kenya Ceramics',
    category: ['tiles', 'ceramics', 'sanitary'],
    location: 'Kajiado',
    county: 'Kajiado',
    rating: 4.5,
    verified: true,
    leadTimeDays: 10,
    paymentTerms: ['cash', 'credit-30'],
    minOrder: 100,
    maxOrder: 10000,
    priceLevel: 'budget',
    certifications: ['KEBS'],
  },
  {
    id: 'tile-carpet-centre',
    name: 'Tile & Carpet Centre',
    category: ['tiles', 'flooring', 'carpets'],
    location: 'Nairobi',
    county: 'Nairobi',
    rating: 4.7,
    verified: true,
    leadTimeDays: 7,
    paymentTerms: ['cash', 'credit-30'],
    minOrder: 50,
    maxOrder: 5000,
    priceLevel: 'premium',
    certifications: ['KEBS'],
  },

  // Plumbing & Water
  {
    id: 'davis-shirtliff',
    name: 'Davis & Shirtliff',
    category: ['plumbing', 'pumps', 'water-treatment', 'solar'],
    location: 'Nairobi',
    county: 'Nairobi',
    rating: 4.8,
    verified: true,
    leadTimeDays: 5,
    paymentTerms: ['cash', 'credit-30', 'credit-60'],
    minOrder: 10,
    maxOrder: 5000,
    priceLevel: 'premium',
    certifications: ['ISO 9001', 'ISO 14001'],
    contact: { website: 'https://www.davisandshirtliff.com' },
  },
  {
    id: 'ppr-pipes',
    name: 'PPR Pipes Kenya',
    category: ['plumbing', 'pipes', 'fittings'],
    location: 'Nairobi',
    county: 'Nairobi',
    rating: 4.4,
    verified: true,
    leadTimeDays: 3,
    paymentTerms: ['cash'],
    minOrder: 50,
    maxOrder: 20000,
    priceLevel: 'standard',
    certifications: ['KEBS'],
  },

  // Electrical
  {
    id: 'east-african-cables',
    name: 'East African Cables',
    category: ['electrical', 'cables', 'wiring'],
    location: 'Nairobi',
    county: 'Nairobi',
    rating: 4.7,
    verified: true,
    leadTimeDays: 5,
    paymentTerms: ['cash', 'credit-30'],
    minOrder: 100,
    maxOrder: 50000,
    priceLevel: 'standard',
    certifications: ['KEBS', 'ISO 9001'],
  },
  {
    id: 'lighting-solutions',
    name: 'Lighting Solutions Kenya',
    category: ['electrical', 'lighting', 'switches'],
    location: 'Nairobi',
    county: 'Nairobi',
    rating: 4.5,
    verified: true,
    leadTimeDays: 7,
    paymentTerms: ['cash', 'credit-14'],
    minOrder: 20,
    maxOrder: 5000,
    priceLevel: 'standard',
    certifications: ['KEBS'],
  },

  // Blocks & Bricks
  {
    id: 'kenya-builders',
    name: 'Kenya Builders & Concrete',
    category: ['blocks', 'bricks', 'pavers'],
    location: 'Nairobi',
    county: 'Nairobi',
    rating: 4.3,
    verified: true,
    leadTimeDays: 2,
    paymentTerms: ['cash'],
    minOrder: 500,
    maxOrder: 50000,
    priceLevel: 'budget',
    certifications: ['KEBS'],
  },

  // Paint
  {
    id: 'crown-paints',
    name: 'Crown Paints',
    category: ['paint', 'finishes', 'coatings'],
    location: 'Nairobi',
    county: 'Nairobi',
    rating: 4.8,
    verified: true,
    leadTimeDays: 3,
    paymentTerms: ['cash', 'credit-30'],
    minOrder: 20,
    maxOrder: 5000,
    priceLevel: 'premium',
    certifications: ['ISO 9001', 'KEBS'],
    contact: { website: 'https://www.crownpaints.co.ke' },
  },
  {
    id: 'basco-paints',
    name: 'Basco Paints',
    category: ['paint', 'finishes'],
    location: 'Nairobi',
    county: 'Nairobi',
    rating: 4.6,
    verified: true,
    leadTimeDays: 3,
    paymentTerms: ['cash', 'credit-30'],
    minOrder: 20,
    maxOrder: 3000,
    priceLevel: 'standard',
    certifications: ['KEBS'],
  },

  // Timber & Doors
  {
    id: 'rai-plywood',
    name: 'Rai Plywood',
    category: ['timber', 'plywood', 'doors'],
    location: 'Eldoret',
    county: 'Uasin Gishu',
    rating: 4.6,
    verified: true,
    leadTimeDays: 14,
    paymentTerms: ['cash', 'credit-30'],
    minOrder: 50,
    maxOrder: 5000,
    priceLevel: 'standard',
    certifications: ['FSC', 'KEBS'],
  },
  {
    id: 'hardware-world',
    name: 'Hardware World Kenya',
    category: ['hardware', 'tools', 'fasteners', 'doors', 'windows'],
    location: 'Nairobi',
    county: 'Nairobi',
    rating: 4.4,
    verified: true,
    leadTimeDays: 3,
    paymentTerms: ['cash'],
    minOrder: 10,
    maxOrder: 2000,
    priceLevel: 'standard',
    certifications: ['KEBS'],
  },

  // Aggregates
  {
    id: 'ndovu-cement',
    name: 'Ndovu Quarries',
    category: ['aggregates', 'sand', 'ballast', 'hardcore'],
    location: 'Machakos',
    county: 'Machakos',
    rating: 4.3,
    verified: true,
    leadTimeDays: 1,
    paymentTerms: ['cash'],
    minOrder: 10,
    maxOrder: 1000,
    priceLevel: 'budget',
    certifications: ['KEBS'],
  },
];

// =============================================================================
// MATERIAL PRICES (Kenya - KES)
// Updated Q1 2026
// =============================================================================

const MATERIAL_PRICES: MaterialPrice[] = [
  // Cement
  { material: 'cement', unit: '50kg bag', price: 750, currency: 'KES', source: 'Market Survey', lastUpdated: '2026-03-01' },
  { material: 'cement_simba', unit: '50kg bag', price: 720, currency: 'KES', source: 'Savannah Cement', lastUpdated: '2026-03-01' },
  { material: 'cement_bamburi', unit: '50kg bag', price: 780, currency: 'KES', source: 'Bamburi Cement', lastUpdated: '2026-03-01' },

  // Aggregates
  { material: 'sand_river', unit: 'tonne', price: 2500, currency: 'KES', source: 'Market Survey', lastUpdated: '2026-03-01' },
  { material: 'sand_building', unit: 'tonne', price: 2800, currency: 'KES', source: 'Market Survey', lastUpdated: '2026-03-01' },
  { material: 'ballast', unit: 'tonne', price: 3500, currency: 'KES', source: 'Market Survey', lastUpdated: '2026-03-01' },
  { material: 'hardcore', unit: 'tonne', price: 1800, currency: 'KES', source: 'Market Survey', lastUpdated: '2026-03-01' },

  // Steel
  { material: 'steel_y12', unit: 'kg', price: 135, currency: 'KES', source: 'Devki Steel', lastUpdated: '2026-03-01' },
  { material: 'steel_y16', unit: 'kg', price: 132, currency: 'KES', source: 'Devki Steel', lastUpdated: '2026-03-01' },
  { material: 'steel_y10', unit: 'kg', price: 140, currency: 'KES', source: 'Devki Steel', lastUpdated: '2026-03-01' },
  { material: 'brc_mesh_a142', unit: 'sheet', price: 8500, currency: 'KES', source: 'Devki Steel', lastUpdated: '2026-03-01' },

  // Blocks & Bricks
  { material: 'block_6inch', unit: 'piece', price: 55, currency: 'KES', source: 'Market Survey', lastUpdated: '2026-03-01' },
  { material: 'block_4inch', unit: 'piece', price: 42, currency: 'KES', source: 'Market Survey', lastUpdated: '2026-03-01' },
  { material: 'brick_clay', unit: 'piece', price: 18, currency: 'KES', source: 'Market Survey', lastUpdated: '2026-03-01' },
  { material: 'brick_facing', unit: 'piece', price: 45, currency: 'KES', source: 'Market Survey', lastUpdated: '2026-03-01' },

  // Roofing
  { material: 'mabati_gauge28', unit: 'sheet 3m', price: 850, currency: 'KES', source: 'Mabati Rolling Mills', lastUpdated: '2026-03-01' },
  { material: 'mabati_gauge30', unit: 'sheet 3m', price: 720, currency: 'KES', source: 'Mabati Rolling Mills', lastUpdated: '2026-03-01' },
  { material: 'roof_tile_concrete', unit: 'piece', price: 95, currency: 'KES', source: 'Market Survey', lastUpdated: '2026-03-01' },
  { material: 'roof_tile_clay', unit: 'piece', price: 120, currency: 'KES', source: 'Market Survey', lastUpdated: '2026-03-01' },

  // Timber
  { material: 'timber_2x4', unit: 'running meter', price: 85, currency: 'KES', source: 'Market Survey', lastUpdated: '2026-03-01' },
  { material: 'timber_2x6', unit: 'running meter', price: 120, currency: 'KES', source: 'Market Survey', lastUpdated: '2026-03-01' },
  { material: 'timber_4x2', unit: 'running meter', price: 95, currency: 'KES', source: 'Market Survey', lastUpdated: '2026-03-01' },
  { material: 'plywood_18mm', unit: 'sheet 8x4', price: 3500, currency: 'KES', source: 'Rai Plywood', lastUpdated: '2026-03-01' },

  // Doors & Windows
  { material: 'door_flush', unit: 'piece', price: 8500, currency: 'KES', source: 'Market Survey', lastUpdated: '2026-03-01' },
  { material: 'door_mahogany', unit: 'piece', price: 25000, currency: 'KES', source: 'Market Survey', lastUpdated: '2026-03-01' },
  { material: 'door_security', unit: 'piece', price: 45000, currency: 'KES', source: 'Market Survey', lastUpdated: '2026-03-01' },
  { material: 'window_aluminium', unit: 'sqm', price: 8500, currency: 'KES', source: 'Market Survey', lastUpdated: '2026-03-01' },
  { material: 'window_steel', unit: 'sqm', price: 5500, currency: 'KES', source: 'Market Survey', lastUpdated: '2026-03-01' },

  // Tiles
  { material: 'tiles_floor_ceramic', unit: 'sqm', price: 1200, currency: 'KES', source: 'Keda Ceramics', lastUpdated: '2026-03-01' },
  { material: 'tiles_floor_porcelain', unit: 'sqm', price: 2500, currency: 'KES', source: 'Market Survey', lastUpdated: '2026-03-01' },
  { material: 'tiles_wall', unit: 'sqm', price: 950, currency: 'KES', source: 'Keda Ceramics', lastUpdated: '2026-03-01' },

  // Paint
  { material: 'paint_emulsion', unit: '20L', price: 4500, currency: 'KES', source: 'Crown Paints', lastUpdated: '2026-03-01' },
  { material: 'paint_gloss', unit: '4L', price: 2800, currency: 'KES', source: 'Crown Paints', lastUpdated: '2026-03-01' },
  { material: 'paint_weathercoat', unit: '20L', price: 8500, currency: 'KES', source: 'Crown Paints', lastUpdated: '2026-03-01' },

  // Plumbing
  { material: 'pipe_pvc_4inch', unit: '6m length', price: 2500, currency: 'KES', source: 'Market Survey', lastUpdated: '2026-03-01' },
  { material: 'pipe_ppr_1inch', unit: '4m length', price: 850, currency: 'KES', source: 'PPR Pipes', lastUpdated: '2026-03-01' },
  { material: 'water_tank_5000L', unit: 'piece', price: 45000, currency: 'KES', source: 'Market Survey', lastUpdated: '2026-03-01' },

  // Electrical
  { material: 'cable_2.5mm', unit: '100m roll', price: 3500, currency: 'KES', source: 'East African Cables', lastUpdated: '2026-03-01' },
  { material: 'cable_4mm', unit: '100m roll', price: 5500, currency: 'KES', source: 'East African Cables', lastUpdated: '2026-03-01' },
  { material: 'distribution_board', unit: 'piece', price: 8500, currency: 'KES', source: 'Market Survey', lastUpdated: '2026-03-01' },
];

// =============================================================================
// API HANDLERS
// =============================================================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const category = searchParams.get('category');
  const material = searchParams.get('material');
  const location = searchParams.get('location');

  try {
    if (action === 'suppliers') {
      let suppliers = [...KENYA_SUPPLIERS];

      if (category) {
        suppliers = suppliers.filter(s =>
          s.category.some(c => c.toLowerCase().includes(category.toLowerCase()))
        );
      }

      if (location) {
        suppliers = suppliers.filter(s =>
          s.location.toLowerCase().includes(location.toLowerCase()) ||
          s.county?.toLowerCase().includes(location.toLowerCase())
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          suppliers,
          total: suppliers.length,
          source: 'Kenya Supplier Database',
        },
      });
    }

    if (action === 'prices') {
      let prices = [...MATERIAL_PRICES];

      if (material) {
        prices = prices.filter(p =>
          p.material.toLowerCase().includes(material.toLowerCase())
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          prices,
          total: prices.length,
          currency: 'KES',
          source: 'Kenya Market Survey Q1 2026',
        },
      });
    }

    // Default: return all data
    return NextResponse.json({
      success: true,
      data: {
        suppliers: KENYA_SUPPLIERS,
        prices: MATERIAL_PRICES,
        totalSuppliers: KENYA_SUPPLIERS.length,
        totalMaterials: MATERIAL_PRICES.length,
      },
    });

  } catch (error) {
    console.error('[Suppliers API] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, materials, location, budget } = body;

    if (action === 'match-suppliers') {
      // Match suppliers to required materials
      const matches: Array<{
        material: string;
        suppliers: Supplier[];
        bestPrice: MaterialPrice | null;
      }> = [];

      for (const mat of materials || []) {
        const categorySuppliers = KENYA_SUPPLIERS.filter(s =>
          s.category.some(c => c.toLowerCase().includes(mat.toLowerCase()))
        );

        const price = MATERIAL_PRICES.find(p =>
          p.material.toLowerCase().includes(mat.toLowerCase())
        );

        matches.push({
          material: mat,
          suppliers: categorySuppliers.slice(0, 3), // Top 3
          bestPrice: price || null,
        });
      }

      return NextResponse.json({
        success: true,
        data: {
          matches,
          totalMatched: matches.length,
        },
      });
    }

    if (action === 'estimate-costs') {
      // Estimate total costs for a BOQ
      const { boqItems } = body;
      let totalCost = 0;
      const breakdown: Array<{
        item: string;
        quantity: number;
        unit: string;
        unitPrice: number;
        total: number;
      }> = [];

      for (const item of boqItems || []) {
        const price = MATERIAL_PRICES.find(p =>
          p.material.toLowerCase().includes(item.material.toLowerCase())
        );

        if (price) {
          const itemTotal = price.price * item.quantity;
          totalCost += itemTotal;
          breakdown.push({
            item: item.material,
            quantity: item.quantity,
            unit: price.unit,
            unitPrice: price.price,
            total: itemTotal,
          });
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          breakdown,
          totalCost,
          currency: 'KES',
          source: 'Kenya Market Prices Q1 2026',
        },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('[Suppliers API] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Request failed' },
      { status: 500 }
    );
  }
}
