'use client';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * THE SOLAR BIBLE - KENYA'S MOST COMPREHENSIVE SOLAR ENERGY GUIDE
 * World's Most Complete Solar Maintenance & Installation Hub
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Import fault codes and repair manuals
import {
  INVERTER_FAULT_CODES,
  BATTERY_FAULT_CODES,
  PANEL_FAULT_CODES,
  INVERTER_BRANDS,
  BATTERY_BRANDS,
  PANEL_BRANDS,
  FAULT_CODE_STATS,
  type InverterFaultCode,
  type BatteryFaultCode,
  type PanelFaultCode,
} from '@/lib/maintenance-hub/solar-fault-codes';

import {
  INVERTER_MANUALS,
  CABLE_SIZING_GUIDE,
  MANUAL_STATS,
  type InverterManual,
  type CableSizing,
} from '@/lib/maintenance-hub/solar-repair-manuals';

// ═══════════════════════════════════════════════════════════════════════════════
// KENYA COUNTIES DATA WITH SOLAR IRRADIANCE
// ═══════════════════════════════════════════════════════════════════════════════
const KENYA_COUNTIES = [
  // Central Region
  { name: 'Nairobi', region: 'Central', peakSunHours: 5.2, avgTemp: 24, irradiance: 5.5, lat: -1.2921, lon: 36.8219, towns: ['Westlands', 'Karen', 'Eastleigh', 'Kibera', 'Langata', 'Kasarani'] },
  { name: 'Kiambu', region: 'Central', peakSunHours: 5.0, avgTemp: 22, irradiance: 5.3, lat: -1.1714, lon: 36.8356, towns: ['Thika', 'Ruiru', 'Kiambu Town', 'Limuru', 'Kikuyu', 'Juja'] },
  { name: 'Muranga', region: 'Central', peakSunHours: 4.8, avgTemp: 21, irradiance: 5.1, lat: -0.7839, lon: 37.0400, towns: ['Muranga Town', 'Kangema', 'Maragua', 'Kandara', 'Gatanga'] },
  { name: 'Nyeri', region: 'Central', peakSunHours: 5.0, avgTemp: 18, irradiance: 5.2, lat: -0.4197, lon: 36.9553, towns: ['Nyeri Town', 'Karatina', 'Othaya', 'Mukurweini', 'Tetu'] },
  { name: 'Kirinyaga', region: 'Central', peakSunHours: 5.1, avgTemp: 20, irradiance: 5.3, lat: -0.5000, lon: 37.2833, towns: ['Kerugoya', 'Kutus', 'Sagana', 'Wanguru', 'Kagio'] },
  { name: 'Nyandarua', region: 'Central', peakSunHours: 4.5, avgTemp: 14, irradiance: 4.8, lat: -0.1833, lon: 36.5167, towns: ['Ol Kalou', 'Nyahururu', 'Engineer', 'Njabini', 'Ndaragwa'] },
  // Coast Region
  { name: 'Mombasa', region: 'Coast', peakSunHours: 5.8, avgTemp: 28, irradiance: 5.9, lat: -4.0435, lon: 39.6682, towns: ['Mombasa Island', 'Nyali', 'Likoni', 'Kisauni', 'Changamwe', 'Bamburi'] },
  { name: 'Kilifi', region: 'Coast', peakSunHours: 5.9, avgTemp: 27, irradiance: 6.0, lat: -3.6305, lon: 39.8499, towns: ['Kilifi Town', 'Malindi', 'Watamu', 'Mtwapa', 'Kaloleni'] },
  { name: 'Kwale', region: 'Coast', peakSunHours: 5.7, avgTemp: 27, irradiance: 5.8, lat: -4.1816, lon: 39.4600, towns: ['Kwale Town', 'Ukunda', 'Diani', 'Msambweni', 'Kinango'] },
  { name: 'Taita Taveta', region: 'Coast', peakSunHours: 5.5, avgTemp: 25, irradiance: 5.6, lat: -3.3163, lon: 38.4850, towns: ['Voi', 'Wundanyi', 'Taveta', 'Mwatate'] },
  { name: 'Tana River', region: 'Coast', peakSunHours: 6.2, avgTemp: 30, irradiance: 6.3, lat: -1.8000, lon: 40.0333, towns: ['Hola', 'Garsen', 'Bura', 'Madogo'] },
  { name: 'Lamu', region: 'Coast', peakSunHours: 6.0, avgTemp: 28, irradiance: 6.1, lat: -2.2686, lon: 40.9020, towns: ['Lamu Town', 'Mokowe', 'Mpeketoni', 'Witu'] },
  // Eastern Region
  { name: 'Machakos', region: 'Eastern', peakSunHours: 5.5, avgTemp: 23, irradiance: 5.6, lat: -1.5177, lon: 37.2634, towns: ['Machakos Town', 'Athi River', 'Kangundo', 'Matuu', 'Masii'] },
  { name: 'Makueni', region: 'Eastern', peakSunHours: 5.8, avgTemp: 25, irradiance: 5.9, lat: -2.2500, lon: 37.8333, towns: ['Wote', 'Makindu', 'Sultan Hamud', 'Mtito Andei', 'Emali'] },
  { name: 'Kitui', region: 'Eastern', peakSunHours: 6.0, avgTemp: 26, irradiance: 6.1, lat: -1.3667, lon: 38.0167, towns: ['Kitui Town', 'Mwingi', 'Mutomo', 'Kyuso', 'Migwani'] },
  { name: 'Embu', region: 'Eastern', peakSunHours: 5.0, avgTemp: 20, irradiance: 5.2, lat: -0.5333, lon: 37.4500, towns: ['Embu Town', 'Runyenjes', 'Siakago', 'Ishiara'] },
  { name: 'Tharaka Nithi', region: 'Eastern', peakSunHours: 5.2, avgTemp: 21, irradiance: 5.4, lat: -0.3000, lon: 37.8000, towns: ['Chuka', 'Chogoria', 'Marimanti', 'Kathwana'] },
  { name: 'Meru', region: 'Eastern', peakSunHours: 5.3, avgTemp: 19, irradiance: 5.5, lat: 0.0500, lon: 37.6500, towns: ['Meru Town', 'Nkubu', 'Maua', 'Timau', 'Mikinduri'] },
  { name: 'Isiolo', region: 'Eastern', peakSunHours: 6.3, avgTemp: 28, irradiance: 6.4, lat: 0.3500, lon: 37.5833, towns: ['Isiolo Town', 'Garbatulla', 'Merti', 'Kinna'] },
  // Nyanza Region
  { name: 'Kisumu', region: 'Nyanza', peakSunHours: 5.5, avgTemp: 26, irradiance: 5.6, lat: -0.1022, lon: 34.7617, towns: ['Kisumu City', 'Ahero', 'Maseno', 'Muhoroni', 'Kombewa'] },
  { name: 'Siaya', region: 'Nyanza', peakSunHours: 5.4, avgTemp: 25, irradiance: 5.5, lat: 0.0607, lon: 34.2881, towns: ['Siaya Town', 'Bondo', 'Ugunja', 'Usenge', 'Yala'] },
  { name: 'Homa Bay', region: 'Nyanza', peakSunHours: 5.6, avgTemp: 26, irradiance: 5.7, lat: -0.5273, lon: 34.4571, towns: ['Homa Bay Town', 'Kendu Bay', 'Oyugis', 'Mbita', 'Ndhiwa'] },
  { name: 'Kisii', region: 'Nyanza', peakSunHours: 4.8, avgTemp: 21, irradiance: 5.0, lat: -0.6817, lon: 34.7667, towns: ['Kisii Town', 'Keroka', 'Ogembo', 'Suneka', 'Nyamache'] },
  { name: 'Nyamira', region: 'Nyanza', peakSunHours: 4.7, avgTemp: 20, irradiance: 4.9, lat: -0.5667, lon: 34.9333, towns: ['Nyamira Town', 'Keroka', 'Nyansiongo', 'Ekerenyo'] },
  { name: 'Migori', region: 'Nyanza', peakSunHours: 5.5, avgTemp: 25, irradiance: 5.6, lat: -1.0634, lon: 34.4731, towns: ['Migori Town', 'Rongo', 'Awendo', 'Isebania', 'Kehancha'] },
  // Rift Valley Region
  { name: 'Nakuru', region: 'Rift Valley', peakSunHours: 5.3, avgTemp: 20, irradiance: 5.5, lat: -0.3031, lon: 36.0800, towns: ['Nakuru City', 'Naivasha', 'Gilgil', 'Molo', 'Njoro', 'Subukia'] },
  { name: 'Narok', region: 'Rift Valley', peakSunHours: 5.5, avgTemp: 22, irradiance: 5.7, lat: -1.0833, lon: 35.8667, towns: ['Narok Town', 'Kilgoris', 'Ntulele', 'Ololulung\'a'] },
  { name: 'Kajiado', region: 'Rift Valley', peakSunHours: 5.8, avgTemp: 24, irradiance: 5.9, lat: -1.8500, lon: 36.7833, towns: ['Kajiado Town', 'Ngong', 'Kitengela', 'Ongata Rongai', 'Namanga', 'Loitokitok'] },
  { name: 'Kericho', region: 'Rift Valley', peakSunHours: 4.5, avgTemp: 18, irradiance: 4.7, lat: -0.3692, lon: 35.2863, towns: ['Kericho Town', 'Litein', 'Londiani', 'Kipkelion'] },
  { name: 'Bomet', region: 'Rift Valley', peakSunHours: 4.6, avgTemp: 19, irradiance: 4.8, lat: -0.7833, lon: 35.3500, towns: ['Bomet Town', 'Sotik', 'Longisa', 'Mulot'] },
  { name: 'Uasin Gishu', region: 'Rift Valley', peakSunHours: 5.2, avgTemp: 17, irradiance: 5.4, lat: 0.5143, lon: 35.2698, towns: ['Eldoret', 'Burnt Forest', 'Turbo', 'Ziwa', 'Moiben'] },
  { name: 'Elgeyo Marakwet', region: 'Rift Valley', peakSunHours: 5.0, avgTemp: 18, irradiance: 5.2, lat: 0.6667, lon: 35.5000, towns: ['Iten', 'Kapsowar', 'Tambach', 'Kapcherop'] },
  { name: 'Nandi', region: 'Rift Valley', peakSunHours: 4.8, avgTemp: 19, irradiance: 5.0, lat: 0.1833, lon: 35.1667, towns: ['Kapsabet', 'Nandi Hills', 'Mosoriot', 'Kabiyet'] },
  { name: 'Baringo', region: 'Rift Valley', peakSunHours: 6.0, avgTemp: 28, irradiance: 6.2, lat: 0.4667, lon: 36.0000, towns: ['Kabarnet', 'Marigat', 'Eldama Ravine', 'Mogotio'] },
  { name: 'Laikipia', region: 'Rift Valley', peakSunHours: 5.8, avgTemp: 20, irradiance: 6.0, lat: 0.3000, lon: 36.7833, towns: ['Nanyuki', 'Nyahururu', 'Rumuruti', 'Dol Dol'] },
  { name: 'Samburu', region: 'Rift Valley', peakSunHours: 6.5, avgTemp: 28, irradiance: 6.6, lat: 1.2167, lon: 37.0000, towns: ['Maralal', 'Wamba', 'Archer\'s Post', 'Baragoi'] },
  { name: 'Trans Nzoia', region: 'Rift Valley', peakSunHours: 5.0, avgTemp: 19, irradiance: 5.2, lat: 1.0167, lon: 34.9500, towns: ['Kitale', 'Endebess', 'Kiminini', 'Saboti'] },
  { name: 'Turkana', region: 'Rift Valley', peakSunHours: 6.8, avgTemp: 32, irradiance: 7.0, lat: 3.1167, lon: 35.5833, towns: ['Lodwar', 'Kakuma', 'Lokichar', 'Lokichogio', 'Kalokol'] },
  { name: 'West Pokot', region: 'Rift Valley', peakSunHours: 5.5, avgTemp: 24, irradiance: 5.7, lat: 1.6167, lon: 35.1167, towns: ['Kapenguria', 'Makutano', 'Alale', 'Kacheliba'] },
  // Western Region
  { name: 'Kakamega', region: 'Western', peakSunHours: 4.8, avgTemp: 22, irradiance: 5.0, lat: 0.2833, lon: 34.7500, towns: ['Kakamega Town', 'Mumias', 'Malava', 'Butere', 'Khayega'] },
  { name: 'Bungoma', region: 'Western', peakSunHours: 5.0, avgTemp: 21, irradiance: 5.2, lat: 0.5635, lon: 34.5606, towns: ['Bungoma Town', 'Webuye', 'Kimilili', 'Chwele', 'Malakisi'] },
  { name: 'Busia', region: 'Western', peakSunHours: 5.2, avgTemp: 24, irradiance: 5.4, lat: 0.4608, lon: 34.1108, towns: ['Busia Town', 'Malaba', 'Port Victoria', 'Funyula', 'Nambale'] },
  { name: 'Vihiga', region: 'Western', peakSunHours: 4.6, avgTemp: 21, irradiance: 4.8, lat: 0.0833, lon: 34.7167, towns: ['Mbale', 'Luanda', 'Hamisi', 'Chavakali'] },
  // North Eastern Region
  { name: 'Garissa', region: 'North Eastern', peakSunHours: 6.5, avgTemp: 32, irradiance: 6.7, lat: -0.4536, lon: 39.6401, towns: ['Garissa Town', 'Dadaab', 'Balambala', 'Ijara', 'Hulugho'] },
  { name: 'Wajir', region: 'North Eastern', peakSunHours: 6.6, avgTemp: 33, irradiance: 6.8, lat: 1.7500, lon: 40.0667, towns: ['Wajir Town', 'Habaswein', 'Buna', 'Griftu', 'Tarbaj'] },
  { name: 'Mandera', region: 'North Eastern', peakSunHours: 6.7, avgTemp: 34, irradiance: 6.9, lat: 3.9167, lon: 41.8667, towns: ['Mandera Town', 'Elwak', 'Takaba', 'Rhamu', 'Banissa'] },
  { name: 'Marsabit', region: 'North Eastern', peakSunHours: 6.4, avgTemp: 26, irradiance: 6.5, lat: 2.3333, lon: 37.9833, towns: ['Marsabit Town', 'Moyale', 'Laisamis', 'North Horr', 'Loiyangalani'] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PROPERTY TYPES WITH SOLAR CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════════
const PROPERTY_TYPES = [
  {
    id: 'small-home',
    name: 'Small Home (1-2 BR)',
    icon: '🏠',
    dailyUsage: 5,
    peakLoad: 2,
    description: 'Basic lighting, TV, fridge, phone charging',
    systemSize: '2-3 kW',
    batterySize: '5-10 kWh',
    costRange: { min: 180000, max: 350000 },
    appliances: ['5 LED lights', '32" TV', 'Small fridge', '2 phone chargers', 'Laptop'],
    monthlyBill: 2500,
    payback: '3-4 years',
  },
  {
    id: 'medium-home',
    name: 'Medium Home (3-4 BR)',
    icon: '🏡',
    dailyUsage: 12,
    peakLoad: 5,
    description: 'Full home with AC, washing machine, water heater',
    systemSize: '5-8 kW',
    batterySize: '15-20 kWh',
    costRange: { min: 450000, max: 850000 },
    appliances: ['10 LED lights', '55" TV', 'Large fridge', 'Washing machine', 'Microwave', '1 AC unit', 'Water pump'],
    monthlyBill: 8000,
    payback: '4-5 years',
  },
  {
    id: 'large-home',
    name: 'Large Home (5+ BR)',
    icon: '🏰',
    dailyUsage: 25,
    peakLoad: 12,
    description: 'Luxury home with multiple ACs, pool pump, full automation',
    systemSize: '12-20 kW',
    batterySize: '30-50 kWh',
    costRange: { min: 1200000, max: 2500000 },
    appliances: ['20+ LED lights', 'Multiple TVs', '2 fridges', '3+ AC units', 'Pool pump', 'Electric oven', 'Full automation'],
    monthlyBill: 25000,
    payback: '4-6 years',
  },
  {
    id: 'apartment',
    name: 'Apartment/Flat',
    icon: '🏢',
    dailyUsage: 8,
    peakLoad: 3,
    description: 'City apartment with standard appliances',
    systemSize: '3-5 kW',
    batterySize: '10-15 kWh',
    costRange: { min: 280000, max: 550000 },
    appliances: ['8 LED lights', '43" TV', 'Fridge', 'Washing machine', 'Microwave', 'Laptops'],
    monthlyBill: 5000,
    payback: '4-5 years',
  },
  {
    id: 'school',
    name: 'School',
    icon: '🏫',
    dailyUsage: 50,
    peakLoad: 25,
    description: 'Classrooms, admin block, computer lab, water pump',
    systemSize: '25-50 kW',
    batterySize: '50-100 kWh',
    costRange: { min: 3000000, max: 7000000 },
    appliances: ['100+ lights', '20+ computers', 'Projectors', 'Water pump', 'Admin appliances', 'Security lights'],
    monthlyBill: 50000,
    payback: '5-7 years',
  },
  {
    id: 'hospital',
    name: 'Hospital/Clinic',
    icon: '🏥',
    dailyUsage: 100,
    peakLoad: 60,
    description: 'Critical medical equipment, 24/7 operation, cold storage',
    systemSize: '50-100 kW',
    batterySize: '100-200 kWh',
    costRange: { min: 8000000, max: 20000000 },
    appliances: ['200+ lights', 'Medical equipment', 'Vaccine fridges', 'X-ray machines', 'AC systems', 'Operating rooms'],
    monthlyBill: 150000,
    payback: '5-8 years',
  },
  {
    id: 'hotel',
    name: 'Hotel/Lodge',
    icon: '🏨',
    dailyUsage: 150,
    peakLoad: 80,
    description: 'Guest rooms, restaurant, laundry, pool, common areas',
    systemSize: '80-150 kW',
    batterySize: '150-300 kWh',
    costRange: { min: 12000000, max: 35000000 },
    appliances: ['Guest room ACs', 'Restaurant kitchen', 'Laundry machines', 'Pool pump', 'Lighting', 'Water heaters'],
    monthlyBill: 250000,
    payback: '6-8 years',
  },
  {
    id: 'bank',
    name: 'Bank/Office',
    icon: '🏦',
    dailyUsage: 80,
    peakLoad: 40,
    description: 'Servers, ATMs, AC, computers, security systems',
    systemSize: '40-80 kW',
    batterySize: '80-150 kWh',
    costRange: { min: 6000000, max: 15000000 },
    appliances: ['Server room', 'ATMs', 'AC systems', '50+ computers', 'Security systems', 'UPS backup'],
    monthlyBill: 120000,
    payback: '5-7 years',
  },
  {
    id: 'farm',
    name: 'Farm/Agriculture',
    icon: '🌾',
    dailyUsage: 60,
    peakLoad: 35,
    description: 'Irrigation pumps, cold storage, processing equipment',
    systemSize: '30-60 kW',
    batterySize: '60-120 kWh',
    costRange: { min: 4000000, max: 12000000 },
    appliances: ['Irrigation pumps', 'Cold storage', 'Processing machines', 'Farm house', 'Security lights', 'Workers quarters'],
    monthlyBill: 80000,
    payback: '4-6 years',
  },
  {
    id: 'factory',
    name: 'Factory/Warehouse',
    icon: '🏭',
    dailyUsage: 200,
    peakLoad: 120,
    description: 'Industrial machinery, high-bay lighting, offices',
    systemSize: '100-250 kW',
    batterySize: '200-500 kWh',
    costRange: { min: 15000000, max: 50000000 },
    appliances: ['Industrial machines', 'High-bay lighting', 'Office block', 'Cold storage', 'Compressors', 'HVAC'],
    monthlyBill: 400000,
    payback: '5-8 years',
  },
  {
    id: 'petrol-station',
    name: 'Petrol Station',
    icon: '⛽',
    dailyUsage: 40,
    peakLoad: 20,
    description: 'Fuel pumps, shop, canopy lights, car wash',
    systemSize: '20-40 kW',
    batterySize: '40-80 kWh',
    costRange: { min: 2500000, max: 6000000 },
    appliances: ['Fuel pumps', 'Shop refrigeration', 'Canopy lights', 'POS systems', 'Car wash', 'Security'],
    monthlyBill: 60000,
    payback: '4-6 years',
  },
  {
    id: 'church',
    name: 'Church/Mosque',
    icon: '⛪',
    dailyUsage: 30,
    peakLoad: 15,
    description: 'Sound system, lighting, fans/AC, offices',
    systemSize: '15-30 kW',
    batterySize: '30-60 kWh',
    costRange: { min: 2000000, max: 5000000 },
    appliances: ['Sound system', 'PA system', 'Projectors', 'Fans/AC', 'Office equipment', 'Security lights'],
    monthlyBill: 40000,
    payback: '4-6 years',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// INSTALLATION STEPS
// ═══════════════════════════════════════════════════════════════════════════════
const INSTALLATION_STEPS = [
  {
    phase: 1,
    title: 'Site Assessment & Design',
    duration: '1-3 days',
    icon: '📋',
    steps: [
      { step: 1, title: 'Initial Consultation', description: 'Meet with client to understand energy needs, budget, and goals. Review electricity bills and usage patterns.' },
      { step: 2, title: 'Site Survey', description: 'Visit site to assess roof condition, orientation, shading, and available space. Take measurements and photos.' },
      { step: 3, title: 'Electrical Assessment', description: 'Inspect existing electrical system, main panel capacity, grounding, and available breaker slots.' },
      { step: 4, title: 'Load Analysis', description: 'Document all electrical loads, calculate daily consumption (kWh), and identify peak demand.' },
      { step: 5, title: 'Shading Analysis', description: 'Evaluate shading from trees, buildings, and structures throughout the day using solar pathfinder or app.' },
      { step: 6, title: 'System Design', description: 'Design optimal system: panel layout, inverter sizing, battery bank, cable sizing, and protection devices.' },
      { step: 7, title: 'Proposal & Quotation', description: 'Prepare detailed proposal with system specifications, costs, ROI analysis, and warranty terms.' },
    ],
  },
  {
    phase: 2,
    title: 'Permits & Procurement',
    duration: '1-2 weeks',
    icon: '📄',
    steps: [
      { step: 1, title: 'County Permits', description: 'Apply for building permit if required (varies by county). Typically needed for systems >10kW.' },
      { step: 2, title: 'KPLC Application', description: 'For grid-tied systems, apply to KPLC for net metering agreement and connection approval.' },
      { step: 3, title: 'Equipment Procurement', description: 'Order panels, inverter, batteries, mounting, cables, and all balance of system components.' },
      { step: 4, title: 'Quality Verification', description: 'Verify all equipment meets Kenya Bureau of Standards (KEBS) and international certifications.' },
      { step: 5, title: 'Logistics Planning', description: 'Schedule delivery, arrange lifting equipment if needed, coordinate installation team.' },
    ],
  },
  {
    phase: 3,
    title: 'Structural & Mounting',
    duration: '1-2 days',
    icon: '🔧',
    steps: [
      { step: 1, title: 'Safety Setup', description: 'Install safety equipment: harnesses, roof anchors, barrier tape. Brief all workers on safety protocols.' },
      { step: 2, title: 'Layout Marking', description: 'Mark panel positions on roof ensuring proper spacing (100mm min). Mark rafter/truss locations.' },
      { step: 3, title: 'Rail Installation', description: 'Install aluminum mounting rails using appropriate roof attachments (tin, tile, or ground mount).' },
      { step: 4, title: 'Weatherproofing', description: 'Apply flashing and sealant to all roof penetrations. Ensure waterproof installation.' },
      { step: 5, title: 'Panel Mounting', description: 'Install panels on rails using mid and end clamps. Torque all fasteners to specification.' },
      { step: 6, title: 'Grounding', description: 'Install grounding lugs on all panels and rails. Run copper grounding conductor to earth electrode.' },
    ],
  },
  {
    phase: 4,
    title: 'Electrical Installation',
    duration: '1-2 days',
    icon: '⚡',
    steps: [
      { step: 1, title: 'String Wiring', description: 'Connect panels in series using MC4 connectors. Label all cables. Measure and record string Voc.' },
      { step: 2, title: 'DC Combiner/Isolator', description: 'Install DC combiner box with string fuses. Install DC isolator near inverter.' },
      { step: 3, title: 'Inverter Installation', description: 'Mount inverter in shaded, ventilated location. Ensure clearances for heat dissipation.' },
      { step: 4, title: 'DC Connection', description: 'Connect solar strings to inverter MPPT inputs. Verify correct polarity and tight connections.' },
      { step: 5, title: 'Battery Installation', description: 'Install batteries on rack/cabinet. Connect in series/parallel as designed. Install battery fuses and BMS.' },
      { step: 6, title: 'AC Connection', description: 'Connect inverter output to distribution board. Install AC isolator and surge protection.' },
      { step: 7, title: 'Monitoring Setup', description: 'Install energy meter and configure monitoring system (WiFi/4G dongle if needed).' },
    ],
  },
  {
    phase: 5,
    title: 'Commissioning & Handover',
    duration: '1 day',
    icon: '✅',
    steps: [
      { step: 1, title: 'Visual Inspection', description: 'Complete checklist verifying all connections, cable management, and installation quality.' },
      { step: 2, title: 'Electrical Testing', description: 'Test insulation resistance (>1MΩ), earth continuity, Voc/Isc of each string.' },
      { step: 3, title: 'Inverter Configuration', description: 'Configure grid parameters, battery settings, charge profiles, time-of-use schedules.' },
      { step: 4, title: 'System Startup', description: 'Close DC isolator, then AC isolator. Verify smooth startup and grid synchronization.' },
      { step: 5, title: 'Performance Verification', description: 'Monitor output for 1-2 hours. Verify production matches design calculations.' },
      { step: 6, title: 'Client Training', description: 'Train client on system operation, monitoring app, basic troubleshooting, and emergency procedures.' },
      { step: 7, title: 'Documentation Handover', description: 'Provide operation manual, warranty certificates, test reports, and maintenance schedule.' },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SOLAR FAQ DATABASE
// ═══════════════════════════════════════════════════════════════════════════════
const SOLAR_FAQ = [
  // General Questions
  { id: 1, category: 'General', question: 'How does solar energy work in Kenya?', answer: 'Solar panels convert sunlight into DC electricity using photovoltaic cells. Kenya receives excellent solar radiation (4.5-7.0 kWh/m²/day depending on location), making it ideal for solar. The DC power is converted to AC by an inverter for use in your home or business. Excess energy can be stored in batteries or exported to the grid.' },
  { id: 2, category: 'General', question: 'Is solar worth it in Kenya?', answer: 'Absolutely! With KPLC electricity at KES 22-27 per kWh and frequent power outages, solar provides both savings and reliability. Most systems pay for themselves in 3-6 years, then provide 20+ years of nearly free electricity. Add the value of backup power during outages, and solar is one of the best investments you can make.' },
  { id: 3, category: 'General', question: 'How long do solar panels last?', answer: 'Quality solar panels last 25-30+ years. They typically come with 25-year performance warranties guaranteeing at least 80% of original output. Tier 1 brands like JA Solar, Longi, Canadian Solar, and Jinko are most reliable. Panels degrade only about 0.5% per year, so a 10kW system will still produce ~8.75kW after 25 years.' },
  { id: 4, category: 'General', question: 'Do solar panels work during cloudy days or rainy season?', answer: 'Yes, solar panels work in cloudy conditions, though at reduced output (typically 25-50% of clear-day production). During Kenya\'s rainy seasons (March-May, October-December), expect 20-30% lower monthly production. This is factored into system design. Battery storage helps bridge these periods.' },
  // Sizing & Design
  { id: 5, category: 'Sizing', question: 'What size solar system do I need for my home?', answer: 'A typical Kenyan home uses 200-500 kWh per month. To calculate: divide your monthly bill amount by KES 22-25 to get kWh, then divide by 30 days to get daily usage. A 3-5kW system covers most homes. For example: KES 8,000 bill ÷ 22 = 364 kWh/month ÷ 30 = 12 kWh/day → needs ~3kW system.' },
  { id: 6, category: 'Sizing', question: 'How many solar panels do I need?', answer: 'Divide your required system size by panel wattage. For a 5kW system using 545W panels: 5000 ÷ 545 = 9.2 panels, round up to 10. Consider roof space: each 545W panel is about 2.2m². Also factor in future expansion—it\'s often cheaper to install extra capacity upfront.' },
  { id: 7, category: 'Sizing', question: 'What battery capacity do I need for backup?', answer: 'Calculate: (Daily usage × backup hours ÷ 24) ÷ DoD. For 12 kWh/day usage with 8-hour backup: (12 × 8 ÷ 24) ÷ 0.8 = 5 kWh usable ÷ 0.8 DoD = 6.25 kWh battery. For whole-night backup (12 hours), you\'d need 10+ kWh. LiFePO4 batteries are recommended for their 6000+ cycles and 10-year lifespan.' },
  { id: 8, category: 'Sizing', question: 'Should I get a hybrid, off-grid, or grid-tied system?', answer: 'Hybrid (grid + battery) is best for most Kenyans—provides backup during outages while reducing bills. Grid-tied (no battery) is cheapest but offers no backup. Off-grid is for remote areas without KPLC. Most urban installations are hybrid with 10-20 kWh batteries for essential loads backup.' },
  // Cost & Financing
  { id: 9, category: 'Cost', question: 'How much does solar installation cost in Kenya?', answer: 'Costs vary by system size and components. Budget ranges: Small home (2-3kW): KES 180,000-350,000 | Medium home (5-8kW): KES 450,000-850,000 | Large home (10-15kW): KES 900,000-1,800,000 | Commercial (20-100kW): KES 2-15 million. Quality matters—cheap systems often fail within 2-3 years.' },
  { id: 10, category: 'Cost', question: 'What affects solar installation cost?', answer: 'Key factors: 1) Panel quality/brand (Tier 1 vs budget), 2) Inverter type (string vs hybrid vs premium), 3) Battery chemistry (LiFePO4 vs lead-acid), 4) Installation complexity (roof type, cable runs), 5) Mounting system quality, 6) Installer expertise. Never compromise on inverter and batteries—they\'re the heart of the system.' },
  { id: 11, category: 'Cost', question: 'Are there solar financing options in Kenya?', answer: 'Yes! Options include: 1) Bank loans (KCB, Equity, Stanbic have green energy products), 2) Saccos with lower rates, 3) Pay-as-you-go (M-KOPA, Azuri, d.light), 4) Asset financing companies, 5) Some installers offer in-house financing. Interest rates range 12-18% p.a. Many systems pay for themselves within the loan period.' },
  { id: 12, category: 'Cost', question: 'What is the payback period for solar in Kenya?', answer: 'Typically 3-6 years depending on: electricity usage, KPLC rates, system cost, and financing terms. Example: KES 500,000 system saving KES 10,000/month = 50 months (4.2 years) payback. After payback, you enjoy essentially free electricity for 20+ more years. ROI of 300-500% over system lifetime.' },
  // Technical
  { id: 13, category: 'Technical', question: 'What is MPPT and why does it matter?', answer: 'MPPT (Maximum Power Point Tracking) is an algorithm that extracts maximum power from solar panels under varying conditions. MPPT inverters/charge controllers can increase harvest by 15-30% compared to basic PWM controllers. Look for inverters with multiple MPPT inputs for better performance with partial shading.' },
  { id: 14, category: 'Technical', question: 'What is the difference between monocrystalline and polycrystalline panels?', answer: 'Monocrystalline (mono) panels are more efficient (19-22%) and perform better in low light and high temperatures. Polycrystalline (poly) are slightly cheaper but less efficient (17-19%). Modern installations use mono almost exclusively. Half-cut cell technology further improves performance and shade tolerance.' },
  { id: 15, category: 'Technical', question: 'Can I add more panels later?', answer: 'Yes, if planned correctly! Ensure: 1) Inverter has capacity for expansion (MPPT inputs and power rating), 2) Roof space is available, 3) Battery can handle additional charge current, 4) Cable sizing allows for extra current. It\'s often 30% cheaper to install extra capacity upfront than to expand later.' },
  { id: 16, category: 'Technical', question: 'What maintenance do solar systems need?', answer: 'Minimal maintenance: 1) Clean panels quarterly (or when visibly dirty), 2) Check connections annually, 3) Monitor production daily via app, 4) Professional inspection every 2-3 years, 5) Battery maintenance per manufacturer specs. Total maintenance cost: KES 10,000-20,000 per year for residential systems.' },
  // Grid & Regulations
  { id: 17, category: 'Regulations', question: 'Can I sell excess solar power to KPLC?', answer: 'Yes! Kenya has net metering regulations allowing export of excess solar to the grid. You need: 1) System ≤1MW, 2) Grid-tied or hybrid inverter, 3) Bidirectional meter from KPLC, 4) Net metering agreement. You receive credit (not cash) for exported units, offset against your consumption. Apply through your local KPLC office.' },
  { id: 18, category: 'Regulations', question: 'Do I need permits for solar installation?', answer: 'Requirements vary by county and system size. Generally: <10kW residential usually doesn\'t need permits. >10kW or commercial may need county building permit. Grid-tied systems need KPLC approval. Always check with your local county government. Professional installers handle permits as part of their service.' },
  { id: 19, category: 'Regulations', question: 'What happens to solar during a grid outage?', answer: 'Grid-tied without battery: System shuts down for safety (anti-islanding). Hybrid with battery: Switches to battery backup within milliseconds—you won\'t even notice. Off-grid: Continues normal operation. For critical loads, hybrid systems with adequate battery are essential for Kenyan conditions with frequent outages.' },
  // Installation
  { id: 20, category: 'Installation', question: 'How long does solar installation take?', answer: 'Typical timelines: Residential (3-10kW): 2-4 days. Commercial (10-50kW): 1-2 weeks. Large commercial (>50kW): 2-4 weeks. This excludes permit processing which can add 1-4 weeks. A competent team of 3-4 technicians can install a 10kW residential system in 2-3 days.' },
  { id: 21, category: 'Installation', question: 'Can solar be installed on any roof type?', answer: 'Yes! Different mounting solutions exist for: 1) Mabati/Iron sheets: Use profiled mounting feet, 2) Tiles: Use tile hooks or replacement tiles, 3) Flat concrete: Use tilt frames or ballasted mounts, 4) Ground mount: For limited roof space or ground installations. Professional assessment determines the best approach.' },
  { id: 22, category: 'Installation', question: 'What direction should panels face in Kenya?', answer: 'In Kenya (near equator), panels can face either north or south with minimal difference. True north is slightly better (2-5% more annual production). More important is avoiding shading and optimizing tilt angle. Typical tilt: 0-15° for fixed installations. Flat mounting is acceptable and easier to clean.' },
  // Troubleshooting
  { id: 23, category: 'Troubleshooting', question: 'Why is my solar production lower than expected?', answer: 'Common causes: 1) Dirty panels (clean them!), 2) Shading from new construction or tree growth, 3) Inverter fault or setting issue, 4) Panel degradation or damage, 5) Loose connections, 6) Weather/season variation. Check monitoring data, clean panels, and call your installer if issues persist.' },
  { id: 24, category: 'Troubleshooting', question: 'What do inverter error codes mean?', answer: 'Common codes: F01/Grid fault = check KPLC supply, F04/Ground fault = check cable insulation, F05/Over-temp = improve ventilation, F06/PV overvoltage = too many panels per string, F09/Overload = reduce loads. Most errors can be resolved by addressing the cause and pressing reset. Check your inverter manual for specific codes.' },
  { id: 25, category: 'Troubleshooting', question: 'How do I know if my battery is healthy?', answer: 'Signs of healthy battery: 1) Charges fully within expected time, 2) Maintains voltage under load, 3) Provides expected runtime, 4) No excessive heat during operation, 5) BMS shows balanced cells. LiFePO4 batteries should last 10+ years with proper use. Lead-acid: 3-5 years. Check battery management system (BMS) data in your monitoring app.' },
  // Safety
  { id: 26, category: 'Safety', question: 'Is solar installation safe?', answer: 'Yes, when done professionally. Risks include: electrical shock (DC systems can reach 600V+), falls from height, and fire from poor wiring. Always use licensed, experienced installers. Ensure proper earthing, quality components with certifications, and proper safety equipment. Never DIY high-voltage electrical work.' },
  { id: 27, category: 'Safety', question: 'Can solar panels cause fire?', answer: 'Extremely rare with quality installation. Fires typically result from: 1) Poor quality connectors/cables, 2) Loose connections causing arcing, 3) Rodent damage to cables, 4) Undersized wiring. Prevention: Use quality components, proper installation, DC arc fault protection (AFCI), and regular inspections. Quality inverters have multiple safety features.' },
  { id: 28, category: 'Safety', question: 'Do solar panels attract lightning?', answer: 'Solar panels don\'t attract lightning more than any other structure, but they should be protected. Install: 1) Lightning arrestors on DC and AC sides, 2) Proper earthing system, 3) Surge protection devices (SPDs). This is especially important in Kenya\'s highlands and areas with frequent storms.' },
  // Environment
  { id: 29, category: 'Environment', question: 'What is the environmental impact of solar?', answer: 'Highly positive! A 5kW system prevents ~5 tonnes of CO2 emissions per year—equivalent to planting 250 trees. Solar panels are 90% recyclable. Energy payback time is 1-3 years (the system produces far more energy than was used to manufacture it). Solar is one of the cleanest energy sources available.' },
  { id: 30, category: 'Environment', question: 'What happens to old solar panels?', answer: 'Solar panels are highly recyclable (90%+ of materials). In Kenya, e-waste recyclers handle solar panels. The industry is developing dedicated recycling infrastructure. Panels contain valuable materials: silicon, aluminum, copper, silver. With 25+ year lifespans, recycling is still a future concern for most current installations.' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMMON APPLIANCES DATABASE
// ═══════════════════════════════════════════════════════════════════════════════
const APPLIANCES = [
  // Lighting
  { name: 'LED Bulb 9W', watts: 9, category: 'Lighting', defaultHours: 6 },
  { name: 'LED Bulb 15W', watts: 15, category: 'Lighting', defaultHours: 6 },
  { name: 'Fluorescent Tube 18W', watts: 18, category: 'Lighting', defaultHours: 5 },
  { name: 'Fluorescent Tube 36W', watts: 36, category: 'Lighting', defaultHours: 5 },
  { name: 'Security Flood Light', watts: 50, category: 'Lighting', defaultHours: 12 },
  // Entertainment
  { name: 'TV 32" LED', watts: 50, category: 'Entertainment', defaultHours: 5 },
  { name: 'TV 43" LED', watts: 80, category: 'Entertainment', defaultHours: 5 },
  { name: 'TV 55" LED', watts: 120, category: 'Entertainment', defaultHours: 4 },
  { name: 'Decoder/Set-top Box', watts: 25, category: 'Entertainment', defaultHours: 6 },
  { name: 'Sound System', watts: 100, category: 'Entertainment', defaultHours: 3 },
  { name: 'WiFi Router', watts: 15, category: 'Entertainment', defaultHours: 24 },
  // Kitchen
  { name: 'Refrigerator (Small)', watts: 80, category: 'Kitchen', defaultHours: 8 },
  { name: 'Refrigerator (Large)', watts: 150, category: 'Kitchen', defaultHours: 8 },
  { name: 'Freezer', watts: 200, category: 'Kitchen', defaultHours: 8 },
  { name: 'Microwave', watts: 1200, category: 'Kitchen', defaultHours: 0.5 },
  { name: 'Electric Kettle', watts: 2000, category: 'Kitchen', defaultHours: 0.3 },
  { name: 'Toaster', watts: 800, category: 'Kitchen', defaultHours: 0.2 },
  { name: 'Blender', watts: 500, category: 'Kitchen', defaultHours: 0.2 },
  // Cooling & Heating
  { name: 'Ceiling Fan', watts: 75, category: 'Cooling', defaultHours: 8 },
  { name: 'Standing Fan', watts: 60, category: 'Cooling', defaultHours: 8 },
  { name: 'AC Unit 1HP (9000 BTU)', watts: 900, category: 'Cooling', defaultHours: 8 },
  { name: 'AC Unit 1.5HP (12000 BTU)', watts: 1200, category: 'Cooling', defaultHours: 8 },
  { name: 'AC Unit 2HP (18000 BTU)', watts: 1800, category: 'Cooling', defaultHours: 8 },
  { name: 'Water Heater (Instant)', watts: 3500, category: 'Heating', defaultHours: 0.5 },
  { name: 'Water Heater (Storage)', watts: 2000, category: 'Heating', defaultHours: 2 },
  // Office
  { name: 'Laptop', watts: 65, category: 'Office', defaultHours: 8 },
  { name: 'Desktop Computer', watts: 200, category: 'Office', defaultHours: 8 },
  { name: 'Monitor', watts: 40, category: 'Office', defaultHours: 8 },
  { name: 'Printer', watts: 500, category: 'Office', defaultHours: 1 },
  { name: 'Phone Charger', watts: 10, category: 'Office', defaultHours: 3 },
  // Laundry
  { name: 'Washing Machine', watts: 500, category: 'Laundry', defaultHours: 1 },
  { name: 'Iron', watts: 1200, category: 'Laundry', defaultHours: 0.5 },
  // Pumps
  { name: 'Water Pump 0.5HP', watts: 400, category: 'Pumps', defaultHours: 2 },
  { name: 'Water Pump 1HP', watts: 750, category: 'Pumps', defaultHours: 2 },
  { name: 'Borehole Pump 2HP', watts: 1500, category: 'Pumps', defaultHours: 4 },
  // Security
  { name: 'CCTV System (4 cameras)', watts: 50, category: 'Security', defaultHours: 24 },
  { name: 'Electric Fence', watts: 20, category: 'Security', defaultHours: 24 },
  { name: 'Alarm System', watts: 30, category: 'Security', defaultHours: 24 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════
const SunCore = () => {
  return (
    <div className="absolute top-4 right-4 w-24 h-24 md:w-32 md:h-32">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, transparent 30%, rgba(251, 191, 36, ${0.15 - i * 0.04}) 70%, transparent 100%)`,
            transform: `scale(${1 + i * 0.5})`,
          }}
          animate={{ scale: [1 + i * 0.5, 1.3 + i * 0.5, 1 + i * 0.5], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <motion.div
        className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500"
        style={{ boxShadow: '0 0 40px rgba(251, 191, 36, 0.8)' }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl md:text-3xl">☀️</span>
        </div>
      </motion.div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function SolarBible() {
  const [activeSection, setActiveSection] = useState<'calculator' | 'counties' | 'installation' | 'costs' | 'faq' | 'faultcodes' | 'manuals' | 'cables'>('calculator');
  const [selectedCounty, setSelectedCounty] = useState<typeof KENYA_COUNTIES[0] | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<typeof PROPERTY_TYPES[0] | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [faqSearch, setFaqSearch] = useState('');
  const [faqCategory, setFaqCategory] = useState('All');

  // Fault codes state
  const [faultCodeType, setFaultCodeType] = useState<'inverter' | 'battery' | 'panel'>('inverter');
  const [faultCodeSearch, setFaultCodeSearch] = useState('');
  const [faultBrandFilter, setFaultBrandFilter] = useState('All');
  const [expandedFaultCode, setExpandedFaultCode] = useState<string | null>(null);

  // Repair manuals state
  const [selectedManual, setSelectedManual] = useState<InverterManual | null>(null);
  const [manualSection, setManualSection] = useState<'wiring' | 'repair' | 'maintenance' | 'parts'>('wiring');

  // Cable sizing state
  const [selectedCableApp, setSelectedCableApp] = useState<CableSizing | null>(null);

  // Calculator State
  const [calcAppliances, setCalcAppliances] = useState<Array<{ name: string; watts: number; hours: number; qty: number }>>([]);
  const [calcCounty, setCalcCounty] = useState('Nairobi');
  const [batteryBackupHours, setBatteryBackupHours] = useState(8);
  const [systemType, setSystemType] = useState<'hybrid' | 'offgrid' | 'gridtie'>('hybrid');

  // Calculator Results
  const calcResults = useMemo(() => {
    const dailyWh = calcAppliances.reduce((sum, a) => sum + (a.watts * a.hours * a.qty), 0);
    const dailyKwh = dailyWh / 1000;
    const peakLoad = calcAppliances.reduce((sum, a) => sum + (a.watts * a.qty), 0);
    const county = KENYA_COUNTIES.find(c => c.name === calcCounty);
    const sunHours = county?.peakSunHours || 5;

    const panelsKw = Math.ceil((dailyKwh / sunHours) * 1.25 * 10) / 10; // 25% buffer
    const panelCount = Math.ceil((panelsKw * 1000) / 545);
    const inverterKw = Math.ceil((peakLoad / 1000) * 1.3 * 10) / 10; // 30% surge margin
    const batteryKwh = systemType !== 'gridtie'
      ? Math.ceil((dailyKwh * batteryBackupHours / 24) / 0.8 * 10) / 10
      : 0;

    const panelCost = panelCount * 18000;
    const inverterCost = inverterKw * 25000;
    const batteryCost = batteryKwh * 20000;
    const installationCost = (panelCost + inverterCost + batteryCost) * 0.15;
    const totalCost = panelCost + inverterCost + batteryCost + installationCost;

    const monthlySavings = dailyKwh * 30 * 22;
    const paybackYears = totalCost / (monthlySavings * 12);
    const co2Savings = dailyKwh * 365 * 0.5;

    return {
      dailyKwh,
      peakLoad,
      panelsKw,
      panelCount,
      inverterKw,
      batteryKwh,
      panelCost,
      inverterCost,
      batteryCost,
      installationCost,
      totalCost,
      monthlySavings,
      paybackYears,
      co2Savings,
      sunHours,
    };
  }, [calcAppliances, calcCounty, batteryBackupHours, systemType]);

  const addAppliance = (appliance: typeof APPLIANCES[0]) => {
    setCalcAppliances(prev => [...prev, { ...appliance, hours: appliance.defaultHours, qty: 1 }]);
  };

  const removeAppliance = (index: number) => {
    setCalcAppliances(prev => prev.filter((_, i) => i !== index));
  };

  const updateAppliance = (index: number, field: 'hours' | 'qty', value: number) => {
    setCalcAppliances(prev => prev.map((a, i) => i === index ? { ...a, [field]: value } : a));
  };

  const filteredFaq = useMemo(() => {
    return SOLAR_FAQ.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
                           faq.answer.toLowerCase().includes(faqSearch.toLowerCase());
      const matchesCategory = faqCategory === 'All' || faq.category === faqCategory;
      return matchesSearch && matchesCategory;
    });
  }, [faqSearch, faqCategory]);

  const faqCategories = ['All', ...new Set(SOLAR_FAQ.map(f => f.category))];

  // Filtered fault codes
  const filteredFaultCodes = useMemo(() => {
    let codes: (InverterFaultCode | BatteryFaultCode | PanelFaultCode)[] = [];

    if (faultCodeType === 'inverter') {
      codes = INVERTER_FAULT_CODES;
    } else if (faultCodeType === 'battery') {
      codes = BATTERY_FAULT_CODES;
    } else {
      codes = PANEL_FAULT_CODES;
    }

    return codes.filter(code => {
      const searchMatch = faultCodeSearch === '' ||
        code.code.toLowerCase().includes(faultCodeSearch.toLowerCase()) ||
        code.title.toLowerCase().includes(faultCodeSearch.toLowerCase()) ||
        code.description.toLowerCase().includes(faultCodeSearch.toLowerCase());

      const brandMatch = faultBrandFilter === 'All' ||
        ('brand' in code && code.brand === faultBrandFilter) ||
        ('type' in code && !('brand' in code));

      return searchMatch && brandMatch;
    });
  }, [faultCodeType, faultCodeSearch, faultBrandFilter]);

  const currentBrands = useMemo(() => {
    if (faultCodeType === 'inverter') return INVERTER_BRANDS;
    if (faultCodeType === 'battery') return BATTERY_BRANDS;
    return PANEL_BRANDS;
  }, [faultCodeType]);

  const sections = [
    { id: 'calculator', label: 'Solar Calculator', icon: '🔢' },
    { id: 'counties', label: '47 Counties', icon: '🗺️' },
    { id: 'installation', label: 'Installation Guide', icon: '🔧' },
    { id: 'costs', label: 'Cost Estimator', icon: '💰' },
    { id: 'faq', label: 'Solar FAQ', icon: '❓' },
    { id: 'faultcodes', label: 'Fault Codes', icon: '⚠️' },
    { id: 'manuals', label: 'Repair Manuals', icon: '📘' },
    { id: 'cables', label: 'Cable Sizing', icon: '🔌' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `linear-gradient(rgba(251, 191, 36, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 191, 36, 0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }} />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80" />

      <SunCore />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/maintenance-hub" className="text-amber-400 hover:text-amber-300 text-sm mb-2 inline-flex items-center gap-2">
            ← Back to Maintenance Hub
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold mb-2"
          >
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
              THE SOLAR BIBLE
            </span>
          </motion.h1>
          <p className="text-slate-400">Kenya's Most Comprehensive Solar Energy Guide | All 47 Counties | Complete Calculator | Installation Guide</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          {[
            { value: '47', label: 'Counties', color: 'amber' },
            { value: '12+', label: 'Property Types', color: 'green' },
            { value: '30+', label: 'FAQ', color: 'cyan' },
            { value: String(FAULT_CODE_STATS.totalCodes), label: 'Fault Codes', color: 'red' },
            { value: String(MANUAL_STATS.inverterManuals), label: 'Manuals', color: 'purple' },
            { value: String(FAULT_CODE_STATS.inverterBrands), label: 'Inverter Brands', color: 'blue' },
            { value: String(FAULT_CODE_STATS.batteryBrands), label: 'Battery Brands', color: 'orange' },
            { value: String(MANUAL_STATS.cableSizingGuides), label: 'Cable Guides', color: 'pink' },
          ].map((stat, i) => (
            <div key={i} className={`bg-slate-900/80 border border-${stat.color}-500/30 rounded-xl p-3 text-center`}>
              <div className={`text-xl font-bold text-${stat.color}-400`}>{stat.value}</div>
              <div className="text-slate-400 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as typeof activeSection)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeSection === section.id
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              <span>{section.icon}</span>
              <span className="hidden sm:inline">{section.label}</span>
            </button>
          ))}
        </div>

        {/* Section Content */}
        <AnimatePresence mode="wait">
          {/* CALCULATOR SECTION */}
          {activeSection === 'calculator' && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-slate-900/80 rounded-xl p-6 border border-amber-500/30">
                <h2 className="text-2xl font-bold text-amber-400 mb-4">🔢 Advanced Solar Calculator</h2>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Left: Inputs */}
                  <div className="space-y-4">
                    {/* Location */}
                    <div>
                      <label className="text-slate-400 text-sm block mb-2">Your County</label>
                      <select
                        value={calcCounty}
                        onChange={(e) => setCalcCounty(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                      >
                        {KENYA_COUNTIES.map(c => (
                          <option key={c.name} value={c.name}>{c.name} ({c.peakSunHours}h sun)</option>
                        ))}
                      </select>
                    </div>

                    {/* System Type */}
                    <div>
                      <label className="text-slate-400 text-sm block mb-2">System Type</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'hybrid', label: 'Hybrid', desc: 'Grid + Battery' },
                          { id: 'offgrid', label: 'Off-Grid', desc: 'Battery Only' },
                          { id: 'gridtie', label: 'Grid-Tie', desc: 'No Battery' },
                        ].map(type => (
                          <button
                            key={type.id}
                            onClick={() => setSystemType(type.id as typeof systemType)}
                            className={`p-2 rounded-lg text-center text-sm transition-all ${
                              systemType === type.id
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            <div className="font-bold">{type.label}</div>
                            <div className="text-xs opacity-70">{type.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Backup Hours */}
                    {systemType !== 'gridtie' && (
                      <div>
                        <label className="text-slate-400 text-sm block mb-2">Battery Backup Hours: {batteryBackupHours}h</label>
                        <input
                          type="range"
                          min="2"
                          max="24"
                          value={batteryBackupHours}
                          onChange={(e) => setBatteryBackupHours(Number(e.target.value))}
                          className="w-full accent-amber-500"
                        />
                      </div>
                    )}

                    {/* Add Appliances */}
                    <div>
                      <label className="text-slate-400 text-sm block mb-2">Add Appliances</label>
                      <div className="max-h-48 overflow-y-auto space-y-1 bg-slate-800/50 rounded-lg p-2">
                        {Object.entries(
                          APPLIANCES.reduce((acc, app) => {
                            if (!acc[app.category]) acc[app.category] = [];
                            acc[app.category].push(app);
                            return acc;
                          }, {} as Record<string, typeof APPLIANCES>)
                        ).map(([category, apps]) => (
                          <div key={category}>
                            <div className="text-amber-400 text-xs font-bold py-1">{category}</div>
                            {apps.map(app => (
                              <button
                                key={app.name}
                                onClick={() => addAppliance(app)}
                                className="w-full text-left px-2 py-1 text-sm text-slate-300 hover:bg-slate-700/50 rounded flex justify-between"
                              >
                                <span>{app.name}</span>
                                <span className="text-slate-500">{app.watts}W</span>
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Selected Appliances */}
                    {calcAppliances.length > 0 && (
                      <div>
                        <label className="text-slate-400 text-sm block mb-2">Your Appliances ({calcAppliances.length})</label>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {calcAppliances.map((app, i) => (
                            <div key={i} className="bg-slate-800/50 rounded-lg p-2 flex items-center gap-2">
                              <div className="flex-1">
                                <div className="text-white text-sm">{app.name}</div>
                                <div className="text-slate-500 text-xs">{app.watts}W × {app.hours}h × {app.qty} = {(app.watts * app.hours * app.qty / 1000).toFixed(2)} kWh</div>
                              </div>
                              <input
                                type="number"
                                min="1"
                                max="24"
                                value={app.hours}
                                onChange={(e) => updateAppliance(i, 'hours', Number(e.target.value))}
                                className="w-14 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                                title="Hours"
                              />
                              <input
                                type="number"
                                min="1"
                                max="50"
                                value={app.qty}
                                onChange={(e) => updateAppliance(i, 'qty', Number(e.target.value))}
                                className="w-12 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                                title="Qty"
                              />
                              <button
                                onClick={() => removeAppliance(i)}
                                className="text-red-400 hover:text-red-300 px-2"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Results */}
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-amber-500/20">
                    <h3 className="text-lg font-bold text-amber-400 mb-4">📊 System Recommendation</h3>

                    {calcAppliances.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <div className="text-4xl mb-2">⚡</div>
                        <p>Add appliances to see your solar system recommendation</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Daily Usage */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-900/50 rounded-lg p-3">
                            <div className="text-slate-400 text-xs">Daily Usage</div>
                            <div className="text-2xl font-bold text-white">{calcResults.dailyKwh.toFixed(1)} kWh</div>
                          </div>
                          <div className="bg-slate-900/50 rounded-lg p-3">
                            <div className="text-slate-400 text-xs">Peak Load</div>
                            <div className="text-2xl font-bold text-white">{(calcResults.peakLoad / 1000).toFixed(1)} kW</div>
                          </div>
                        </div>

                        {/* System Specs */}
                        <div className="space-y-2">
                          <div className="flex justify-between py-2 border-b border-slate-700">
                            <span className="text-slate-400">☀️ Solar Panels</span>
                            <span className="text-white font-bold">{calcResults.panelCount} × 545W ({calcResults.panelsKw} kW)</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-slate-700">
                            <span className="text-slate-400">⚡ Inverter</span>
                            <span className="text-white font-bold">{calcResults.inverterKw} kW {systemType}</span>
                          </div>
                          {systemType !== 'gridtie' && (
                            <div className="flex justify-between py-2 border-b border-slate-700">
                              <span className="text-slate-400">🔋 Battery</span>
                              <span className="text-white font-bold">{calcResults.batteryKwh} kWh</span>
                            </div>
                          )}
                        </div>

                        {/* Costs */}
                        <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/30">
                          <div className="text-amber-400 text-sm font-bold mb-2">💰 Estimated Cost</div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Panels</span>
                              <span className="text-white">KES {calcResults.panelCost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Inverter</span>
                              <span className="text-white">KES {calcResults.inverterCost.toLocaleString()}</span>
                            </div>
                            {systemType !== 'gridtie' && (
                              <div className="flex justify-between">
                                <span className="text-slate-400">Batteries</span>
                                <span className="text-white">KES {calcResults.batteryCost.toLocaleString()}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-slate-400">Installation (15%)</span>
                              <span className="text-white">KES {calcResults.installationCost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-amber-500/30 font-bold">
                              <span className="text-amber-400">TOTAL</span>
                              <span className="text-amber-400">KES {calcResults.totalCost.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* ROI */}
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-green-500/10 rounded-lg p-2 border border-green-500/30">
                            <div className="text-green-400 text-lg font-bold">KES {Math.round(calcResults.monthlySavings).toLocaleString()}</div>
                            <div className="text-slate-400 text-xs">Monthly Savings</div>
                          </div>
                          <div className="bg-cyan-500/10 rounded-lg p-2 border border-cyan-500/30">
                            <div className="text-cyan-400 text-lg font-bold">{calcResults.paybackYears.toFixed(1)} yrs</div>
                            <div className="text-slate-400 text-xs">Payback Period</div>
                          </div>
                          <div className="bg-emerald-500/10 rounded-lg p-2 border border-emerald-500/30">
                            <div className="text-emerald-400 text-lg font-bold">{(calcResults.co2Savings / 1000).toFixed(1)} T</div>
                            <div className="text-slate-400 text-xs">CO₂/year Saved</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* COUNTIES SECTION */}
          {activeSection === 'counties' && (
            <motion.div
              key="counties"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-slate-900/80 rounded-xl p-6 border border-cyan-500/30">
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">🗺️ Solar Data for All 47 Kenya Counties</h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {KENYA_COUNTIES.map((county) => (
                    <motion.div
                      key={county.name}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedCounty(selectedCounty?.name === county.name ? null : county)}
                      className={`bg-slate-800/50 rounded-xl p-4 border cursor-pointer transition-all ${
                        selectedCounty?.name === county.name
                          ? 'border-cyan-500'
                          : 'border-slate-700/50 hover:border-cyan-500/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-white">{county.name}</h3>
                        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">{county.region}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-slate-400">☀️ Sun Hours:</span>
                          <span className="text-amber-400 ml-1 font-bold">{county.peakSunHours}h</span>
                        </div>
                        <div>
                          <span className="text-slate-400">🌡️ Avg Temp:</span>
                          <span className="text-cyan-400 ml-1 font-bold">{county.avgTemp}°C</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400">⚡ Irradiance:</span>
                          <span className="text-green-400 ml-1 font-bold">{county.irradiance} kWh/m²/day</span>
                        </div>
                      </div>

                      {selectedCounty?.name === county.name && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 pt-4 border-t border-slate-700"
                        >
                          <div className="text-slate-400 text-sm mb-2">Major Towns:</div>
                          <div className="flex flex-wrap gap-1">
                            {county.towns.map(town => (
                              <span key={town} className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-xs">
                                {town}
                              </span>
                            ))}
                          </div>
                          <div className="mt-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                            <div className="text-amber-400 text-sm font-bold mb-1">Recommended System:</div>
                            <div className="text-slate-300 text-xs">
                              With {county.peakSunHours}h peak sun, a 5kW system in {county.name} will produce approximately {(5 * county.peakSunHours * 0.85).toFixed(1)} kWh/day
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* INSTALLATION SECTION */}
          {activeSection === 'installation' && (
            <motion.div
              key="installation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-slate-900/80 rounded-xl p-6 border border-green-500/30">
                <h2 className="text-2xl font-bold text-green-400 mb-4">🔧 Complete Solar Installation Guide</h2>

                <div className="space-y-6">
                  {INSTALLATION_STEPS.map((phase) => (
                    <div key={phase.phase} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-2xl">
                          {phase.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Phase {phase.phase}: {phase.title}</h3>
                          <span className="text-green-400 text-sm">Duration: {phase.duration}</span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                        {phase.steps.map((step) => (
                          <div key={step.step} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 text-sm flex items-center justify-center font-bold">
                                {step.step}
                              </span>
                              <span className="text-white font-medium">{step.title}</span>
                            </div>
                            <p className="text-slate-400 text-sm ml-8">{step.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* COSTS SECTION */}
          {activeSection === 'costs' && (
            <motion.div
              key="costs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-slate-900/80 rounded-xl p-6 border border-purple-500/30">
                <h2 className="text-2xl font-bold text-purple-400 mb-4">💰 Solar Costs by Property Type</h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PROPERTY_TYPES.map((prop) => (
                    <motion.div
                      key={prop.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedProperty(selectedProperty?.id === prop.id ? null : prop)}
                      className={`bg-slate-800/50 rounded-xl p-4 border cursor-pointer transition-all ${
                        selectedProperty?.id === prop.id
                          ? 'border-purple-500'
                          : 'border-slate-700/50 hover:border-purple-500/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{prop.icon}</span>
                        <div>
                          <h3 className="font-bold text-white">{prop.name}</h3>
                          <p className="text-slate-400 text-xs">{prop.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-slate-400 text-xs">System Size</div>
                          <div className="text-amber-400 font-bold">{prop.systemSize}</div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <div className="text-slate-400 text-xs">Battery</div>
                          <div className="text-green-400 font-bold">{prop.batterySize}</div>
                        </div>
                      </div>

                      <div className="bg-purple-500/10 rounded-lg p-2 border border-purple-500/30 text-center">
                        <div className="text-purple-400 text-xs">Estimated Cost</div>
                        <div className="text-white font-bold">
                          KES {(prop.costRange.min / 1000).toFixed(0)}K - {(prop.costRange.max / 1000).toFixed(0)}K
                        </div>
                      </div>

                      {selectedProperty?.id === prop.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 pt-4 border-t border-slate-700 space-y-3"
                        >
                          <div>
                            <div className="text-slate-400 text-xs mb-1">Daily Usage</div>
                            <div className="text-white">{prop.dailyUsage} kWh/day ({prop.peakLoad} kW peak)</div>
                          </div>
                          <div>
                            <div className="text-slate-400 text-xs mb-1">Typical Appliances</div>
                            <div className="flex flex-wrap gap-1">
                              {prop.appliances.map(app => (
                                <span key={app} className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-xs">
                                  {app}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-slate-900/50 rounded p-2">
                              <div className="text-slate-400 text-xs">Current Bill</div>
                              <div className="text-red-400 font-bold">KES {prop.monthlyBill.toLocaleString()}/mo</div>
                            </div>
                            <div className="bg-slate-900/50 rounded p-2">
                              <div className="text-slate-400 text-xs">Payback Period</div>
                              <div className="text-green-400 font-bold">{prop.payback}</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* FAQ SECTION */}
          {activeSection === 'faq' && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-slate-900/80 rounded-xl p-6 border border-cyan-500/30">
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">❓ Solar FAQ - {filteredFaq.length} Questions Answered</h2>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search questions..."
                      value={faqSearch}
                      onChange={(e) => setFaqSearch(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 pl-10 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {faqCategories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setFaqCategory(cat)}
                        className={`px-3 py-1 rounded-lg text-sm transition-all ${
                          faqCategory === cat
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FAQ List */}
                <div className="space-y-3">
                  {filteredFaq.map((faq) => (
                    <div
                      key={faq.id}
                      className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                        className="w-full px-4 py-3 flex items-start justify-between text-left"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-cyan-400 mt-1">❓</span>
                          <div>
                            <span className="text-white font-medium">{faq.question}</span>
                            <span className="ml-2 text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded">{faq.category}</span>
                          </div>
                        </div>
                        <span className={`text-cyan-400 transition-transform ${expandedFaq === faq.id ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </button>

                      <AnimatePresence>
                        {expandedFaq === faq.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-0">
                              <div className="bg-slate-900/50 rounded-lg p-4 text-slate-300 leading-relaxed">
                                {faq.answer}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {filteredFaq.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <div className="text-4xl mb-2">🔍</div>
                    <p>No questions found matching your search</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* FAULT CODES SECTION */}
          {activeSection === 'faultcodes' && (
            <motion.div
              key="faultcodes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-slate-900/80 rounded-xl p-6 border border-red-500/30">
                <h2 className="text-2xl font-bold text-red-400 mb-4">⚠️ Comprehensive Fault Code Database - {FAULT_CODE_STATS.totalCodes}+ Codes</h2>

                {/* Fault Type Selector */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {[
                    { id: 'inverter', label: 'Inverter Faults', count: FAULT_CODE_STATS.inverterCodes, color: 'amber' },
                    { id: 'battery', label: 'Battery Faults', count: FAULT_CODE_STATS.batteryCodes, color: 'green' },
                    { id: 'panel', label: 'Panel Faults', count: FAULT_CODE_STATS.panelCodes, color: 'cyan' },
                  ].map(type => (
                    <button
                      key={type.id}
                      onClick={() => { setFaultCodeType(type.id as typeof faultCodeType); setFaultBrandFilter('All'); }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        faultCodeType === type.id
                          ? `bg-${type.color}-500/20 text-${type.color}-400 border border-${type.color}-500/50`
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {type.label} ({type.count})
                    </button>
                  ))}
                </div>

                {/* Search and Filter */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search fault codes, titles, descriptions..."
                      value={faultCodeSearch}
                      onChange={(e) => setFaultCodeSearch(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 pl-10 text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
                  </div>
                  {faultCodeType !== 'panel' && (
                    <select
                      value={faultBrandFilter}
                      onChange={(e) => setFaultBrandFilter(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                    >
                      <option value="All">All Brands ({currentBrands.length})</option>
                      {currentBrands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Fault Codes List */}
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredFaultCodes.map((fault) => (
                    <div
                      key={fault.code}
                      className={`bg-slate-800/50 rounded-xl border overflow-hidden ${
                        fault.severity === 'critical' ? 'border-red-500/50' :
                        fault.severity === 'error' ? 'border-orange-500/50' :
                        'border-yellow-500/50'
                      }`}
                    >
                      <button
                        onClick={() => setExpandedFaultCode(expandedFaultCode === fault.code ? null : fault.code)}
                        className="w-full px-4 py-3 flex items-start justify-between text-left"
                      >
                        <div className="flex items-start gap-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            fault.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                            fault.severity === 'error' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {fault.code}
                          </span>
                          <div>
                            <div className="text-white font-medium">{fault.title}</div>
                            <div className="text-slate-400 text-sm mt-1">{fault.description}</div>
                            {'brand' in fault && (
                              <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded mt-2 inline-block">
                                {fault.brand}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={`text-slate-400 transition-transform ${expandedFaultCode === fault.code ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </button>

                      <AnimatePresence>
                        {expandedFaultCode === fault.code && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-4">
                              {/* Causes */}
                              <div className="bg-slate-900/50 rounded-lg p-4">
                                <h4 className="text-amber-400 font-bold text-sm mb-2">🔍 Possible Causes</h4>
                                <ul className="space-y-1">
                                  {fault.causes.map((cause, i) => (
                                    <li key={i} className="text-slate-300 text-sm flex gap-2">
                                      <span className="text-amber-400">•</span> {cause}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Solutions */}
                              <div className="bg-slate-900/50 rounded-lg p-4">
                                <h4 className="text-green-400 font-bold text-sm mb-2">✅ Solutions</h4>
                                <ul className="space-y-1">
                                  {fault.solutions.map((solution, i) => (
                                    <li key={i} className="text-slate-300 text-sm flex gap-2">
                                      <span className="text-green-400">{i + 1}.</span> {solution}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Reset Procedure (for inverters) */}
                              {'resetProcedure' in fault && fault.resetProcedure && (
                                <div className="bg-slate-900/50 rounded-lg p-4">
                                  <h4 className="text-cyan-400 font-bold text-sm mb-2">🔄 Reset Procedure</h4>
                                  <ul className="space-y-1">
                                    {fault.resetProcedure.map((step, i) => (
                                      <li key={i} className="text-slate-300 text-sm flex gap-2">
                                        <span className="text-cyan-400">{i + 1}.</span> {step}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Safety Warnings (for batteries) */}
                              {'safetyWarnings' in fault && fault.safetyWarnings && (
                                <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                                  <h4 className="text-red-400 font-bold text-sm mb-2">⚠️ Safety Warnings</h4>
                                  <ul className="space-y-1">
                                    {fault.safetyWarnings.map((warning, i) => (
                                      <li key={i} className="text-red-300 text-sm flex gap-2">
                                        <span className="text-red-400">!</span> {warning}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Detection Methods (for panels) */}
                              {'detectionMethods' in fault && fault.detectionMethods && (
                                <div className="bg-slate-900/50 rounded-lg p-4">
                                  <h4 className="text-purple-400 font-bold text-sm mb-2">🔬 Detection Methods</h4>
                                  <ul className="space-y-1">
                                    {fault.detectionMethods.map((method, i) => (
                                      <li key={i} className="text-slate-300 text-sm flex gap-2">
                                        <span className="text-purple-400">•</span> {method}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Cost Estimate */}
                              {'estimatedCost' in fault && fault.estimatedCost && (
                                <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/30 text-center">
                                  <span className="text-amber-400 font-bold">💰 Estimated Repair Cost: {fault.estimatedCost}</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}

                  {filteredFaultCodes.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <div className="text-4xl mb-2">🔍</div>
                      <p>No fault codes found matching your search</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* REPAIR MANUALS SECTION */}
          {activeSection === 'manuals' && (
            <motion.div
              key="manuals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-slate-900/80 rounded-xl p-6 border border-purple-500/30">
                <h2 className="text-2xl font-bold text-purple-400 mb-4">📘 Inverter Repair Manuals & Wiring Diagrams</h2>

                {!selectedManual ? (
                  // Manual Selection Grid
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {INVERTER_MANUALS.map((manual) => (
                      <motion.div
                        key={manual.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedManual(manual)}
                        className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-purple-500/50 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">⚡</span>
                          <div>
                            <h3 className="font-bold text-white">{manual.brand}</h3>
                            <p className="text-slate-400 text-sm">{manual.model}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-slate-900/50 rounded p-2">
                            <div className="text-slate-400 text-xs">Power</div>
                            <div className="text-amber-400 font-bold">{manual.power}</div>
                          </div>
                          <div className="bg-slate-900/50 rounded p-2">
                            <div className="text-slate-400 text-xs">Type</div>
                            <div className="text-green-400 font-bold capitalize">{manual.type}</div>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1">
                          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">
                            {manual.repairProcedures.length} Repairs
                          </span>
                          <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded">
                            {manual.spareParts.length} Parts
                          </span>
                          <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                            Wiring Diagram
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  // Selected Manual Details
                  <div>
                    <button
                      onClick={() => setSelectedManual(null)}
                      className="text-purple-400 hover:text-purple-300 mb-4 flex items-center gap-2"
                    >
                      ← Back to Manual Selection
                    </button>

                    {/* Manual Header */}
                    <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-purple-500/30">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white">{selectedManual.brand} {selectedManual.model}</h3>
                          <p className="text-slate-400">{selectedManual.power} | {selectedManual.voltage}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-lg text-sm font-bold capitalize">
                            {selectedManual.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Manual Section Tabs */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {[
                        { id: 'wiring', label: 'Wiring Diagram', icon: '🔌' },
                        { id: 'repair', label: 'Repair Procedures', icon: '🔧' },
                        { id: 'maintenance', label: 'Maintenance', icon: '🔄' },
                        { id: 'parts', label: 'Spare Parts', icon: '📦' },
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setManualSection(tab.id as typeof manualSection)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                            manualSection === tab.id
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          <span>{tab.icon}</span> {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Wiring Diagram Section */}
                    {manualSection === 'wiring' && (
                      <div className="space-y-4">
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-cyan-500/30">
                          <h4 className="text-lg font-bold text-cyan-400 mb-4">🔌 Wiring Connections</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-slate-700">
                                  <th className="text-left py-2 px-3 text-slate-400">Terminal</th>
                                  <th className="text-left py-2 px-3 text-slate-400">Function</th>
                                  <th className="text-left py-2 px-3 text-slate-400">Wire Color</th>
                                  <th className="text-left py-2 px-3 text-slate-400">Size</th>
                                  <th className="text-left py-2 px-3 text-slate-400">Notes</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedManual.wiringDiagram.connections.map((conn, i) => (
                                  <tr key={i} className="border-b border-slate-700/50">
                                    <td className="py-2 px-3 text-amber-400 font-mono">{conn.terminal}</td>
                                    <td className="py-2 px-3 text-white">{conn.function}</td>
                                    <td className="py-2 px-3">
                                      <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                                        {conn.wireColor}
                                      </span>
                                    </td>
                                    <td className="py-2 px-3 text-cyan-400">{conn.wireSize}</td>
                                    <td className="py-2 px-3 text-slate-400">{conn.notes}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Wire Colors Legend */}
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-green-500/30">
                          <h4 className="text-lg font-bold text-green-400 mb-3">🎨 Wire Color Legend</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {Object.entries(selectedManual.wiringDiagram.wireColors).map(([key, color]) => (
                              <div key={key} className="bg-slate-900/50 rounded p-2">
                                <div className="text-slate-400 text-xs">{key}</div>
                                <div className="text-white font-medium">{color}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Important Notes */}
                        <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/30">
                          <h4 className="text-lg font-bold text-amber-400 mb-3">⚠️ Important Wiring Notes</h4>
                          <ul className="space-y-2">
                            {selectedManual.wiringDiagram.notes.map((note, i) => (
                              <li key={i} className="text-slate-300 flex gap-2">
                                <span className="text-amber-400">•</span> {note}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Terminal Pinout */}
                        {selectedManual.terminalPinout.length > 0 && (
                          <div className="bg-slate-800/50 rounded-xl p-4 border border-purple-500/30">
                            <h4 className="text-lg font-bold text-purple-400 mb-3">📍 Terminal Pinout</h4>
                            <div className="grid md:grid-cols-2 gap-3">
                              {selectedManual.terminalPinout.map((pin, i) => (
                                <div key={i} className="bg-slate-900/50 rounded p-3">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-amber-400 font-mono">{pin.connector}</span>
                                    <span className="text-cyan-400 text-sm">Pin {pin.pinNumber}</span>
                                  </div>
                                  <div className="text-white font-medium">{pin.function}</div>
                                  {pin.voltage && <div className="text-slate-400 text-sm">Voltage: {pin.voltage}</div>}
                                  {pin.notes && <div className="text-slate-500 text-xs mt-1">{pin.notes}</div>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Repair Procedures Section */}
                    {manualSection === 'repair' && (
                      <div className="space-y-4">
                        {selectedManual.repairProcedures.map((procedure, i) => (
                          <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-amber-500/30">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className="text-lg font-bold text-amber-400">{procedure.title}</h4>
                                <p className="text-slate-400 text-sm mt-1">Symptom: {procedure.symptom}</p>
                              </div>
                              <div className="flex gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                  procedure.difficultyLevel === 'beginner' ? 'bg-green-500/20 text-green-400' :
                                  procedure.difficultyLevel === 'intermediate' ? 'bg-amber-500/20 text-amber-400' :
                                  procedure.difficultyLevel === 'advanced' ? 'bg-orange-500/20 text-orange-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  {procedure.difficultyLevel.toUpperCase()}
                                </span>
                                <span className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded text-xs">
                                  {procedure.estimatedTime}
                                </span>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              {/* Diagnostic Steps */}
                              <div className="bg-slate-900/50 rounded-lg p-3">
                                <h5 className="text-cyan-400 font-bold text-sm mb-2">🔍 Diagnostic Steps</h5>
                                <ol className="space-y-1">
                                  {procedure.diagnosticSteps.map((step, j) => (
                                    <li key={j} className="text-slate-300 text-sm flex gap-2">
                                      <span className="text-cyan-400">{j + 1}.</span> {step}
                                    </li>
                                  ))}
                                </ol>
                              </div>

                              {/* Repair Steps */}
                              <div className="bg-slate-900/50 rounded-lg p-3">
                                <h5 className="text-green-400 font-bold text-sm mb-2">🔧 Repair Steps</h5>
                                <ol className="space-y-1">
                                  {procedure.repairSteps.map((step, j) => (
                                    <li key={j} className="text-slate-300 text-sm flex gap-2">
                                      <span className="text-green-400">{j + 1}.</span> {step}
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            </div>

                            {/* Test Procedure */}
                            <div className="bg-purple-500/10 rounded-lg p-3 mt-4 border border-purple-500/30">
                              <h5 className="text-purple-400 font-bold text-sm mb-2">✅ Test Procedure</h5>
                              <ol className="space-y-1">
                                {procedure.testProcedure.map((step, j) => (
                                  <li key={j} className="text-slate-300 text-sm flex gap-2">
                                    <span className="text-purple-400">{j + 1}.</span> {step}
                                  </li>
                                ))}
                              </ol>
                            </div>

                            {/* Parts and Tools */}
                            <div className="flex flex-wrap gap-2 mt-4">
                              {procedure.partsNeeded.map((part, j) => (
                                <span key={j} className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded text-xs">
                                  📦 {part}
                                </span>
                              ))}
                              {procedure.specialTools.map((tool, j) => (
                                <span key={j} className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">
                                  🔧 {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}

                        {/* Safety Warnings */}
                        <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
                          <h4 className="text-lg font-bold text-red-400 mb-3">⚠️ Safety Warnings</h4>
                          <ul className="space-y-2">
                            {selectedManual.safetyWarnings.map((warning, i) => (
                              <li key={i} className="text-red-300 flex gap-2">
                                <span className="text-red-400">⚠️</span> {warning}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Maintenance Section */}
                    {manualSection === 'maintenance' && (
                      <div className="space-y-4">
                        {selectedManual.maintenanceSchedule.map((item, i) => (
                          <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-green-500/30">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="text-lg font-bold text-green-400">{item.task}</h4>
                              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-sm font-bold">
                                {item.interval}
                              </span>
                            </div>
                            <ol className="space-y-2">
                              {item.procedure.map((step, j) => (
                                <li key={j} className="text-slate-300 flex gap-2">
                                  <span className="text-green-400 font-bold">{j + 1}.</span> {step}
                                </li>
                              ))}
                            </ol>
                            {item.parts && item.parts.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {item.parts.map((part, j) => (
                                  <span key={j} className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded text-xs">
                                    {part}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Tools Required */}
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-cyan-500/30">
                          <h4 className="text-lg font-bold text-cyan-400 mb-3">🧰 Tools Required</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedManual.toolsRequired.map((tool, i) => (
                              <span key={i} className="bg-slate-700 text-slate-300 px-3 py-1 rounded">
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Spare Parts Section */}
                    {manualSection === 'parts' && (
                      <div className="bg-slate-800/50 rounded-xl p-4 border border-amber-500/30">
                        <h4 className="text-lg font-bold text-amber-400 mb-4">📦 Spare Parts Catalog</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-slate-700">
                                <th className="text-left py-2 px-3 text-slate-400">Part Number</th>
                                <th className="text-left py-2 px-3 text-slate-400">Description</th>
                                <th className="text-left py-2 px-3 text-slate-400">Price</th>
                                <th className="text-left py-2 px-3 text-slate-400">Availability</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedManual.spareParts.map((part, i) => (
                                <tr key={i} className="border-b border-slate-700/50">
                                  <td className="py-2 px-3 text-cyan-400 font-mono">{part.partNumber}</td>
                                  <td className="py-2 px-3 text-white">{part.description}</td>
                                  <td className="py-2 px-3 text-amber-400 font-bold">{part.price}</td>
                                  <td className="py-2 px-3">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                      part.availability === 'in-stock' ? 'bg-green-500/20 text-green-400' :
                                      part.availability === 'order' ? 'bg-amber-500/20 text-amber-400' :
                                      'bg-red-500/20 text-red-400'
                                    }`}>
                                      {part.availability === 'in-stock' ? 'In Stock' :
                                       part.availability === 'order' ? 'Order' : 'Discontinued'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* CABLE SIZING SECTION */}
          {activeSection === 'cables' && (
            <motion.div
              key="cables"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-slate-900/80 rounded-xl p-6 border border-pink-500/30">
                <h2 className="text-2xl font-bold text-pink-400 mb-4">🔌 Professional Cable Sizing Guide</h2>

                {!selectedCableApp ? (
                  // Cable Application Selection
                  <div className="grid md:grid-cols-2 gap-4">
                    {CABLE_SIZING_GUIDE.map((guide, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedCableApp(guide)}
                        className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-pink-500/50 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">
                            {guide.application.includes('Solar') ? '☀️' :
                             guide.application.includes('Battery') ? '🔋' :
                             guide.application.includes('AC') ? '⚡' : '🔗'}
                          </span>
                          <div>
                            <h3 className="font-bold text-white">{guide.application}</h3>
                            <p className="text-slate-400 text-sm">{guide.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded">
                            {guide.parameters.length} Configurations
                          </span>
                          <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded">
                            {guide.recommendations.length} Recommendations
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  // Selected Cable Guide Details
                  <div>
                    <button
                      onClick={() => setSelectedCableApp(null)}
                      className="text-pink-400 hover:text-pink-300 mb-4 flex items-center gap-2"
                    >
                      ← Back to Cable Applications
                    </button>

                    <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-pink-500/30">
                      <h3 className="text-xl font-bold text-white mb-2">{selectedCableApp.application}</h3>
                      <p className="text-slate-400">{selectedCableApp.description}</p>
                    </div>

                    {/* Sizing Table */}
                    <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-cyan-500/30 overflow-x-auto">
                      <h4 className="text-lg font-bold text-cyan-400 mb-4">📊 Cable Sizing Chart</h4>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="text-left py-2 px-3 text-slate-400">Power</th>
                            <th className="text-left py-2 px-3 text-slate-400">Voltage</th>
                            <th className="text-left py-2 px-3 text-slate-400">Current</th>
                            <th className="text-left py-2 px-3 text-slate-400">Distance</th>
                            <th className="text-left py-2 px-3 text-slate-400">Cable Size</th>
                            <th className="text-left py-2 px-3 text-slate-400">V-Drop</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedCableApp.parameters.map((param, i) => (
                            <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                              <td className="py-2 px-3 text-amber-400 font-bold">{param.power}</td>
                              <td className="py-2 px-3 text-white">{param.voltage}</td>
                              <td className="py-2 px-3 text-cyan-400">{param.current}</td>
                              <td className="py-2 px-3 text-white">{param.distance}</td>
                              <td className="py-2 px-3 text-green-400 font-bold">{param.cableSize}</td>
                              <td className={`py-2 px-3 font-bold ${
                                parseFloat(param.voltageDropPercent) < 1 ? 'text-green-400' :
                                parseFloat(param.voltageDropPercent) < 2 ? 'text-amber-400' :
                                'text-red-400'
                              }`}>
                                {param.voltageDropPercent}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-4 mb-6">
                      {selectedCableApp.recommendations.map((rec, i) => (
                        <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-green-500/30">
                          <h4 className="text-lg font-bold text-green-400 mb-2">{rec.cableType}</h4>
                          <p className="text-slate-400 text-sm mb-3">{rec.application}</p>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-cyan-400 font-bold text-sm mb-2">Characteristics</h5>
                              <ul className="space-y-1">
                                {rec.characteristics.map((char, j) => (
                                  <li key={j} className="text-slate-300 text-sm flex gap-2">
                                    <span className="text-cyan-400">✓</span> {char}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-purple-400 font-bold text-sm mb-2">Recommended Brands</h5>
                              <div className="flex flex-wrap gap-2">
                                {rec.brands.map((brand, j) => (
                                  <span key={j} className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">
                                    {brand}
                                  </span>
                                ))}
                              </div>
                              <div className="mt-3">
                                <span className="text-amber-400 font-bold">💰 {rec.priceRange}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Notes */}
                    <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/30">
                      <h4 className="text-lg font-bold text-amber-400 mb-3">⚠️ Important Notes</h4>
                      <ul className="space-y-2">
                        {selectedCableApp.notes.map((note, i) => (
                          <li key={i} className="text-slate-300 flex gap-2">
                            <span className="text-amber-400">•</span> {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm">
            THE SOLAR BIBLE v2.0 | Kenya's Most Comprehensive Solar Energy Resource
          </p>
          <p className="text-amber-400/50 text-xs mt-2">
            47 Counties | {FAULT_CODE_STATS.totalCodes}+ Fault Codes | {MANUAL_STATS.inverterManuals} Repair Manuals | {CABLE_SIZING_GUIDE.length} Cable Guides | Complete Installation Guide
          </p>
        </div>
      </div>
    </div>
  );
}
