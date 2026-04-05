/**
 * Database Seed Script
 * Run with: npx prisma db seed
 *
 * Seeds initial data for Pro Building Suite
 */

import { PrismaClient, PriceLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ==========================================================================
  // SEED SUPPLIERS
  // ==========================================================================

  console.log('📦 Seeding suppliers...');

  const suppliers = [
    {
      name: 'Bamburi Cement',
      category: ['cement', 'concrete', 'ready-mix'],
      location: 'Mombasa',
      county: 'Mombasa',
      country: 'KE',
      email: 'sales@lafargeholcim.co.ke',
      website: 'https://www.lafargeholcim.co.ke',
      rating: 4.8,
      verified: true,
      leadTimeDays: 3,
      paymentTerms: ['cash', 'credit-30'],
      minOrder: 100,
      maxOrder: 50000,
      priceLevel: PriceLevel.STANDARD,
      certifications: ['ISO 9001', 'ISO 14001', 'KEBS'],
    },
    {
      name: 'Savannah Cement',
      category: ['cement', 'concrete'],
      location: 'Athi River',
      county: 'Machakos',
      country: 'KE',
      website: 'https://www.savannahcement.com',
      rating: 4.6,
      verified: true,
      leadTimeDays: 2,
      paymentTerms: ['cash', 'credit-14', 'credit-30'],
      minOrder: 50,
      maxOrder: 30000,
      priceLevel: PriceLevel.BUDGET,
      certifications: ['KEBS', 'ISO 9001'],
    },
    {
      name: 'Devki Steel Mills',
      category: ['steel', 'reinforcement', 'roofing'],
      location: 'Ruiru',
      county: 'Kiambu',
      country: 'KE',
      website: 'https://www.devkisteel.com',
      rating: 4.7,
      verified: true,
      leadTimeDays: 5,
      paymentTerms: ['cash', 'credit-30', 'credit-60'],
      minOrder: 500,
      maxOrder: 100000,
      priceLevel: PriceLevel.STANDARD,
      certifications: ['ISO 9001', 'KEBS'],
    },
    {
      name: 'Mabati Rolling Mills',
      category: ['roofing', 'steel', 'gutters'],
      location: 'Nairobi',
      county: 'Nairobi',
      country: 'KE',
      website: 'https://www.mabati.com',
      rating: 4.9,
      verified: true,
      leadTimeDays: 7,
      paymentTerms: ['cash', 'credit-30'],
      minOrder: 50,
      maxOrder: 20000,
      priceLevel: PriceLevel.PREMIUM,
      certifications: ['ISO 9001', 'KEBS', 'ISO 14001'],
    },
    {
      name: 'Davis & Shirtliff',
      category: ['plumbing', 'pumps', 'water-treatment', 'solar'],
      location: 'Nairobi',
      county: 'Nairobi',
      country: 'KE',
      website: 'https://www.davisandshirtliff.com',
      rating: 4.8,
      verified: true,
      leadTimeDays: 5,
      paymentTerms: ['cash', 'credit-30', 'credit-60'],
      minOrder: 10,
      maxOrder: 5000,
      priceLevel: PriceLevel.PREMIUM,
      certifications: ['ISO 9001', 'ISO 14001'],
    },
    {
      name: 'Crown Paints',
      category: ['paint', 'finishes', 'coatings'],
      location: 'Nairobi',
      county: 'Nairobi',
      country: 'KE',
      website: 'https://www.crownpaints.co.ke',
      rating: 4.8,
      verified: true,
      leadTimeDays: 3,
      paymentTerms: ['cash', 'credit-30'],
      minOrder: 20,
      maxOrder: 5000,
      priceLevel: PriceLevel.PREMIUM,
      certifications: ['ISO 9001', 'KEBS'],
    },
    {
      name: 'Keda Kenya Ceramics',
      category: ['tiles', 'ceramics', 'sanitary'],
      location: 'Kajiado',
      county: 'Kajiado',
      country: 'KE',
      rating: 4.5,
      verified: true,
      leadTimeDays: 10,
      paymentTerms: ['cash', 'credit-30'],
      minOrder: 100,
      maxOrder: 10000,
      priceLevel: PriceLevel.BUDGET,
      certifications: ['KEBS'],
    },
    {
      name: 'East African Cables',
      category: ['electrical', 'cables', 'wiring'],
      location: 'Nairobi',
      county: 'Nairobi',
      country: 'KE',
      rating: 4.7,
      verified: true,
      leadTimeDays: 5,
      paymentTerms: ['cash', 'credit-30'],
      minOrder: 100,
      maxOrder: 50000,
      priceLevel: PriceLevel.STANDARD,
      certifications: ['KEBS', 'ISO 9001'],
    },
  ];

  for (const supplier of suppliers) {
    // Use findFirst + create/update pattern for compatibility
    const existing = await prisma.supplier.findFirst({
      where: { name: supplier.name },
    });

    if (existing) {
      await prisma.supplier.update({
        where: { id: existing.id },
        data: supplier,
      });
    } else {
      await prisma.supplier.create({
        data: supplier,
      });
    }
  }

  console.log(`✅ Seeded ${suppliers.length} suppliers`);

  // ==========================================================================
  // SEED MATERIAL PRICES
  // ==========================================================================

  console.log('💰 Seeding material prices...');

  const materialPrices = [
    // Cement
    { material: 'cement_50kg', country: 'KE', price: 750, unit: 'bag', currency: 'KES', source: 'Market Survey' },
    { material: 'cement_simba', country: 'KE', price: 720, unit: 'bag', currency: 'KES', source: 'Savannah Cement' },
    { material: 'cement_bamburi', country: 'KE', price: 780, unit: 'bag', currency: 'KES', source: 'Bamburi Cement' },

    // Aggregates
    { material: 'sand_river', country: 'KE', price: 2500, unit: 'tonne', currency: 'KES', source: 'Market Survey' },
    { material: 'sand_building', country: 'KE', price: 2800, unit: 'tonne', currency: 'KES', source: 'Market Survey' },
    { material: 'ballast_20mm', country: 'KE', price: 3500, unit: 'tonne', currency: 'KES', source: 'Market Survey' },
    { material: 'hardcore', country: 'KE', price: 1800, unit: 'tonne', currency: 'KES', source: 'Market Survey' },

    // Steel
    { material: 'steel_y12', country: 'KE', price: 135, unit: 'kg', currency: 'KES', source: 'Devki Steel' },
    { material: 'steel_y16', country: 'KE', price: 132, unit: 'kg', currency: 'KES', source: 'Devki Steel' },
    { material: 'steel_y10', country: 'KE', price: 140, unit: 'kg', currency: 'KES', source: 'Devki Steel' },
    { material: 'brc_mesh_a142', country: 'KE', price: 8500, unit: 'sheet', currency: 'KES', source: 'Devki Steel' },

    // Blocks
    { material: 'block_6inch', country: 'KE', price: 55, unit: 'piece', currency: 'KES', source: 'Market Survey' },
    { material: 'block_4inch', country: 'KE', price: 42, unit: 'piece', currency: 'KES', source: 'Market Survey' },
    { material: 'brick_clay', country: 'KE', price: 18, unit: 'piece', currency: 'KES', source: 'Market Survey' },

    // Roofing
    { material: 'mabati_gauge28', country: 'KE', price: 850, unit: 'sheet', currency: 'KES', source: 'Mabati Rolling Mills' },
    { material: 'mabati_gauge30', country: 'KE', price: 720, unit: 'sheet', currency: 'KES', source: 'Mabati Rolling Mills' },

    // Paint
    { material: 'paint_emulsion_20l', country: 'KE', price: 4500, unit: 'tin', currency: 'KES', source: 'Crown Paints' },
    { material: 'paint_weathercoat_20l', country: 'KE', price: 8500, unit: 'tin', currency: 'KES', source: 'Crown Paints' },

    // Tiles
    { material: 'tiles_ceramic_floor', country: 'KE', price: 1200, unit: 'sqm', currency: 'KES', source: 'Keda Ceramics' },
    { material: 'tiles_porcelain_floor', country: 'KE', price: 2500, unit: 'sqm', currency: 'KES', source: 'Market Survey' },

    // Electrical
    { material: 'cable_2.5mm_100m', country: 'KE', price: 3500, unit: 'roll', currency: 'KES', source: 'East African Cables' },
    { material: 'cable_4mm_100m', country: 'KE', price: 5500, unit: 'roll', currency: 'KES', source: 'East African Cables' },

    // Plumbing
    { material: 'pipe_pvc_4inch', country: 'KE', price: 2500, unit: 'length', currency: 'KES', source: 'Market Survey' },
    { material: 'water_tank_5000l', country: 'KE', price: 45000, unit: 'piece', currency: 'KES', source: 'Market Survey' },
  ];

  for (const price of materialPrices) {
    await prisma.materialPrice.upsert({
      where: {
        id: `${price.material}_${price.country}`,
      },
      update: {
        price: price.price,
        source: price.source,
      },
      create: {
        id: `${price.material}_${price.country}`,
        material: price.material,
        country: price.country,
        price: price.price,
        unit: price.unit,
        currency: price.currency,
        source: price.source,
        confidence: 0.9,
      },
    });
  }

  console.log(`✅ Seeded ${materialPrices.length} material prices`);

  // ==========================================================================
  // SEED ADMIN USER
  // ==========================================================================

  console.log('👤 Seeding admin user...');

  await prisma.user.upsert({
    where: { email: 'admin@emersoneims.co.ke' },
    update: {},
    create: {
      email: 'admin@emersoneims.co.ke',
      name: 'EmersonEIMS Admin',
      role: 'ADMIN',
      company: 'EmersonEIMS',
    },
  });

  console.log('✅ Seeded admin user');

  console.log('');
  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
