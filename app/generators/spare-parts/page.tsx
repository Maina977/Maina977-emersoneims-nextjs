// Generator Spare Parts - World's Most Comprehensive Inventory
// SEO-OPTIMIZED: ERP-Style Parts Catalog for Total Market Dominance
'use client';
import { useState } from 'react';

// Metadata moved to layout.tsx for client components

// Comprehensive Parts Categories
const partsCategories = [
  {
    name: 'Filters',
    icon: '🔧',
    description: 'Complete range of filtration solutions',
    subcategories: [
      {
        name: 'Oil Filters',
        items: [
          { partNo: 'LF9009', description: 'Cummins Oil Filter - QSK Series', brand: 'Fleetguard', compatibility: 'Cummins QSK19, QSK23, QSK45', stock: 'In Stock' },
          { partNo: 'LF3000', description: 'Cummins Oil Filter - 6BT/6CT', brand: 'Fleetguard', compatibility: 'Cummins 6BT5.9, 6CT8.3', stock: 'In Stock' },
          { partNo: 'LF670', description: 'Cummins Oil Filter - ISX/QSX', brand: 'Fleetguard', compatibility: 'Cummins ISX15, QSX15', stock: 'In Stock' },
          { partNo: '1R-0716', description: 'Caterpillar Oil Filter', brand: 'CAT', compatibility: 'CAT C15, C18, 3406', stock: 'In Stock' },
          { partNo: '1R-1808', description: 'Caterpillar Oil Filter', brand: 'CAT', compatibility: 'CAT C7, C9, C13', stock: 'In Stock' },
          { partNo: '2654407', description: 'Perkins Oil Filter', brand: 'Perkins', compatibility: 'Perkins 1000 Series', stock: 'In Stock' },
          { partNo: '2654408', description: 'Perkins Oil Filter', brand: 'Perkins', compatibility: 'Perkins 1100 Series', stock: 'In Stock' },
          { partNo: '996-453', description: 'FG Wilson Oil Filter', brand: 'FG Wilson', compatibility: 'FG Wilson P Series', stock: 'In Stock' },
          { partNo: 'ED0021752880-S', description: 'Kohler Oil Filter', brand: 'Kohler', compatibility: 'Kohler KD Series', stock: 'In Stock' },
          { partNo: 'X57508300003', description: 'MTU Oil Filter', brand: 'MTU', compatibility: 'MTU 2000/4000 Series', stock: 'In Stock' },
        ]
      },
      {
        name: 'Fuel Filters',
        items: [
          { partNo: 'FS1000', description: 'Cummins Fuel/Water Separator', brand: 'Fleetguard', compatibility: 'Cummins All Series', stock: 'In Stock' },
          { partNo: 'FF5052', description: 'Cummins Fuel Filter', brand: 'Fleetguard', compatibility: 'Cummins 4BT, 6BT', stock: 'In Stock' },
          { partNo: 'FF5488', description: 'Cummins Fuel Filter - ISB', brand: 'Fleetguard', compatibility: 'Cummins ISB, QSB', stock: 'In Stock' },
          { partNo: '1R-0751', description: 'Caterpillar Fuel Filter', brand: 'CAT', compatibility: 'CAT 3306, 3406, C15', stock: 'In Stock' },
          { partNo: '1R-0756', description: 'Caterpillar Fuel Filter', brand: 'CAT', compatibility: 'CAT C7, C9, C13', stock: 'In Stock' },
          { partNo: '26561117', description: 'Perkins Fuel Filter', brand: 'Perkins', compatibility: 'Perkins 400 Series', stock: 'In Stock' },
          { partNo: '26560145', description: 'Perkins Fuel Filter', brand: 'Perkins', compatibility: 'Perkins 1000 Series', stock: 'In Stock' },
          { partNo: '996-452', description: 'FG Wilson Fuel Filter', brand: 'FG Wilson', compatibility: 'FG Wilson P Series', stock: 'In Stock' },
          { partNo: 'ED0021753010-S', description: 'Kohler Fuel Filter', brand: 'Kohler', compatibility: 'Kohler KD Series', stock: 'In Stock' },
          { partNo: 'X57508300020', description: 'MTU Fuel Filter', brand: 'MTU', compatibility: 'MTU 2000 Series', stock: 'In Stock' },
        ]
      },
      {
        name: 'Air Filters',
        items: [
          { partNo: 'AF25139M', description: 'Cummins Primary Air Filter', brand: 'Fleetguard', compatibility: 'Cummins QSK Series', stock: 'In Stock' },
          { partNo: 'AF872', description: 'Cummins Air Filter', brand: 'Fleetguard', compatibility: 'Cummins 6BT, 6CT', stock: 'In Stock' },
          { partNo: 'AF25550', description: 'Cummins Air Filter - ISX', brand: 'Fleetguard', compatibility: 'Cummins ISX, QSX', stock: 'In Stock' },
          { partNo: '6I-2503', description: 'Caterpillar Air Filter', brand: 'CAT', compatibility: 'CAT C15, C18', stock: 'In Stock' },
          { partNo: '7W-5313', description: 'Caterpillar Air Filter', brand: 'CAT', compatibility: 'CAT 3406, 3408', stock: 'In Stock' },
          { partNo: '26510214', description: 'Perkins Air Filter', brand: 'Perkins', compatibility: 'Perkins 1000 Series', stock: 'In Stock' },
          { partNo: '26510337', description: 'Perkins Air Filter', brand: 'Perkins', compatibility: 'Perkins 2000 Series', stock: 'In Stock' },
          { partNo: '996-454', description: 'FG Wilson Air Filter', brand: 'FG Wilson', compatibility: 'FG Wilson P Series', stock: 'In Stock' },
          { partNo: 'ED0021751640-S', description: 'Kohler Air Filter', brand: 'Kohler', compatibility: 'Kohler KD Series', stock: 'In Stock' },
          { partNo: 'X57508300015', description: 'MTU Air Filter', brand: 'MTU', compatibility: 'MTU 4000 Series', stock: 'In Stock' },
        ]
      },
      {
        name: 'Coolant Filters',
        items: [
          { partNo: 'WF2076', description: 'Cummins Coolant Filter', brand: 'Fleetguard', compatibility: 'Cummins All Series', stock: 'In Stock' },
          { partNo: 'WF2075', description: 'Cummins Coolant Filter DCA', brand: 'Fleetguard', compatibility: 'Cummins Heavy Duty', stock: 'In Stock' },
          { partNo: '9N-3717', description: 'Caterpillar Coolant Filter', brand: 'CAT', compatibility: 'CAT All Series', stock: 'In Stock' },
        ]
      },
    ]
  },
  {
    name: 'Engine Parts',
    icon: '⚙️',
    description: 'Complete engine components for all brands',
    subcategories: [
      {
        name: 'Pistons & Rings',
        items: [
          { partNo: '4089963', description: 'Cummins Piston Kit - 6BT', brand: 'Cummins', compatibility: 'Cummins 6BT5.9', stock: 'In Stock' },
          { partNo: '4955190', description: 'Cummins Piston Kit - ISX', brand: 'Cummins', compatibility: 'Cummins ISX15', stock: 'In Stock' },
          { partNo: '3176532', description: 'Cummins Piston Kit - QSK', brand: 'Cummins', compatibility: 'Cummins QSK19', stock: 'In Stock' },
          { partNo: '197-9297', description: 'Caterpillar Piston Kit', brand: 'CAT', compatibility: 'CAT C15', stock: 'In Stock' },
          { partNo: '238-2720', description: 'Caterpillar Piston Kit', brand: 'CAT', compatibility: 'CAT C9', stock: 'In Stock' },
          { partNo: 'U5LP0051', description: 'Perkins Piston Kit', brand: 'Perkins', compatibility: 'Perkins 1000 Series', stock: 'In Stock' },
          { partNo: 'U5LP0009', description: 'Perkins Piston Kit', brand: 'Perkins', compatibility: 'Perkins 1100 Series', stock: 'In Stock' },
        ]
      },
      {
        name: 'Cylinder Liners',
        items: [
          { partNo: '3904166', description: 'Cummins Cylinder Liner - 6BT', brand: 'Cummins', compatibility: 'Cummins 6BT5.9', stock: 'In Stock' },
          { partNo: '3800328', description: 'Cummins Cylinder Liner - ISX', brand: 'Cummins', compatibility: 'Cummins ISX15', stock: 'In Stock' },
          { partNo: '211-7826', description: 'Caterpillar Cylinder Liner', brand: 'CAT', compatibility: 'CAT C15, C18', stock: 'In Stock' },
          { partNo: 'U5LF0005', description: 'Perkins Cylinder Liner', brand: 'Perkins', compatibility: 'Perkins 1000 Series', stock: 'In Stock' },
        ]
      },
      {
        name: 'Bearings',
        items: [
          { partNo: '3801260', description: 'Cummins Main Bearing Set', brand: 'Cummins', compatibility: 'Cummins 6BT', stock: 'In Stock' },
          { partNo: '3016760', description: 'Cummins Con Rod Bearing', brand: 'Cummins', compatibility: 'Cummins 6CT', stock: 'In Stock' },
          { partNo: '235-7850', description: 'Caterpillar Main Bearing', brand: 'CAT', compatibility: 'CAT C15', stock: 'In Stock' },
          { partNo: 'U5MB0034', description: 'Perkins Main Bearing Set', brand: 'Perkins', compatibility: 'Perkins 1000 Series', stock: 'In Stock' },
        ]
      },
      {
        name: 'Gasket Sets',
        items: [
          { partNo: '4089649', description: 'Cummins Full Gasket Set', brand: 'Cummins', compatibility: 'Cummins 6BT', stock: 'In Stock' },
          { partNo: '4955229', description: 'Cummins Upper Gasket Set', brand: 'Cummins', compatibility: 'Cummins ISX', stock: 'In Stock' },
          { partNo: '197-9340', description: 'Caterpillar Head Gasket', brand: 'CAT', compatibility: 'CAT C15', stock: 'In Stock' },
          { partNo: 'U5LT0357', description: 'Perkins Full Gasket Set', brand: 'Perkins', compatibility: 'Perkins 1000 Series', stock: 'In Stock' },
        ]
      },
      {
        name: 'Turbochargers',
        items: [
          { partNo: '3592015', description: 'Cummins Turbocharger HX40', brand: 'Holset', compatibility: 'Cummins 6CT', stock: 'In Stock' },
          { partNo: '4046127', description: 'Cummins Turbocharger HX55', brand: 'Holset', compatibility: 'Cummins ISX', stock: 'In Stock' },
          { partNo: '3594634', description: 'Cummins Turbocharger HX35', brand: 'Holset', compatibility: 'Cummins 6BT', stock: 'In Stock' },
          { partNo: '10R-2858', description: 'Caterpillar Turbocharger', brand: 'CAT', compatibility: 'CAT C15', stock: 'In Stock' },
          { partNo: '2674A256', description: 'Perkins Turbocharger', brand: 'Perkins', compatibility: 'Perkins 1100 Series', stock: 'In Stock' },
        ]
      },
      {
        name: 'Fuel Injectors',
        items: [
          { partNo: '3411756', description: 'Cummins Injector - PT', brand: 'Cummins', compatibility: 'Cummins NT855', stock: 'In Stock' },
          { partNo: '4026222', description: 'Cummins Injector - ISX', brand: 'Cummins', compatibility: 'Cummins ISX15', stock: 'In Stock' },
          { partNo: '3609962', description: 'Cummins Injector - 6BT', brand: 'Cummins', compatibility: 'Cummins 6BT5.9', stock: 'In Stock' },
          { partNo: '10R-7222', description: 'Caterpillar Injector', brand: 'CAT', compatibility: 'CAT C15', stock: 'In Stock' },
          { partNo: '2645A753', description: 'Perkins Injector', brand: 'Perkins', compatibility: 'Perkins 1100 Series', stock: 'In Stock' },
        ]
      },
      {
        name: 'Fuel Pumps',
        items: [
          { partNo: '3973228', description: 'Cummins Fuel Injection Pump', brand: 'Bosch', compatibility: 'Cummins 6BT', stock: 'In Stock' },
          { partNo: '4954876', description: 'Cummins Fuel Pump - ISX', brand: 'Cummins', compatibility: 'Cummins ISX', stock: 'In Stock' },
          { partNo: '10R-7659', description: 'Caterpillar Fuel Pump', brand: 'CAT', compatibility: 'CAT C15 ACERT', stock: 'In Stock' },
          { partNo: '2644H032', description: 'Perkins Fuel Pump', brand: 'Delphi', compatibility: 'Perkins 1000 Series', stock: 'In Stock' },
        ]
      },
      {
        name: 'Water Pumps',
        items: [
          { partNo: '3802081', description: 'Cummins Water Pump - 6BT', brand: 'Cummins', compatibility: 'Cummins 6BT5.9', stock: 'In Stock' },
          { partNo: '4089909', description: 'Cummins Water Pump - ISX', brand: 'Cummins', compatibility: 'Cummins ISX15', stock: 'In Stock' },
          { partNo: '352-2149', description: 'Caterpillar Water Pump', brand: 'CAT', compatibility: 'CAT C15', stock: 'In Stock' },
          { partNo: 'U5MW0173', description: 'Perkins Water Pump', brand: 'Perkins', compatibility: 'Perkins 1000 Series', stock: 'In Stock' },
        ]
      },
    ]
  },
  {
    name: 'Electrical Parts',
    icon: '⚡',
    description: 'Complete electrical system components',
    subcategories: [
      {
        name: 'AVR (Automatic Voltage Regulators)',
        items: [
          { partNo: 'SX460', description: 'Stamford AVR - SX460', brand: 'Stamford', compatibility: 'Stamford Alternators', stock: 'In Stock' },
          { partNo: 'SX440', description: 'Stamford AVR - SX440', brand: 'Stamford', compatibility: 'Stamford Alternators', stock: 'In Stock' },
          { partNo: 'AS440', description: 'Stamford AVR - AS440', brand: 'Stamford', compatibility: 'Stamford HC/HCI', stock: 'In Stock' },
          { partNo: 'MX321', description: 'Stamford AVR - MX321', brand: 'Stamford', compatibility: 'Stamford PMGC', stock: 'In Stock' },
          { partNo: 'R250', description: 'Leroy Somer AVR - R250', brand: 'Leroy Somer', compatibility: 'Leroy Somer Alternators', stock: 'In Stock' },
          { partNo: 'R450', description: 'Leroy Somer AVR - R450', brand: 'Leroy Somer', compatibility: 'Leroy Somer Large Frame', stock: 'In Stock' },
          { partNo: 'GAVR-8A', description: 'Universal AVR - GAVR-8A', brand: 'Generic', compatibility: 'Universal 8A', stock: 'In Stock' },
          { partNo: 'GAVR-15A', description: 'Universal AVR - GAVR-15A', brand: 'Generic', compatibility: 'Universal 15A', stock: 'In Stock' },
        ]
      },
      {
        name: 'Generator Controllers',
        items: [
          { partNo: 'DSE7320', description: 'DSE Controller - Auto Start', brand: 'Deep Sea', compatibility: 'Universal', stock: 'In Stock' },
          { partNo: 'DSE6120', description: 'DSE Controller - AMF', brand: 'Deep Sea', compatibility: 'Universal', stock: 'In Stock' },
          { partNo: 'DSE4520', description: 'DSE Controller - Manual', brand: 'Deep Sea', compatibility: 'Universal', stock: 'In Stock' },
          { partNo: 'DSE8610', description: 'DSE Sync & Load Share', brand: 'Deep Sea', compatibility: 'Multi-Gen Sync', stock: 'In Stock' },
          { partNo: 'IL-NT', description: 'ComAp InteliLite NT', brand: 'ComAp', compatibility: 'Universal', stock: 'In Stock' },
          { partNo: 'IG-NTC', description: 'ComAp InteliGen NTC', brand: 'ComAp', compatibility: 'Paralleling', stock: 'In Stock' },
          { partNo: 'HGM6120', description: 'Smartgen Controller', brand: 'Smartgen', compatibility: 'Universal', stock: 'In Stock' },
          { partNo: 'HGM9320', description: 'Smartgen Paralleling', brand: 'Smartgen', compatibility: 'Multi-Gen', stock: 'In Stock' },
        ]
      },
      {
        name: 'Starter Motors',
        items: [
          { partNo: '3102767', description: 'Cummins Starter Motor 24V', brand: 'Delco Remy', compatibility: 'Cummins 6BT, 6CT', stock: 'In Stock' },
          { partNo: '3957593', description: 'Cummins Starter Motor - ISX', brand: 'Delco Remy', compatibility: 'Cummins ISX', stock: 'In Stock' },
          { partNo: '225-3146', description: 'Caterpillar Starter Motor', brand: 'CAT', compatibility: 'CAT C15, C18', stock: 'In Stock' },
          { partNo: '2873K405', description: 'Perkins Starter Motor', brand: 'Perkins', compatibility: 'Perkins 1100 Series', stock: 'In Stock' },
        ]
      },
      {
        name: 'Alternators & Charging',
        items: [
          { partNo: '3016627', description: 'Cummins Charging Alternator', brand: 'Delco Remy', compatibility: 'Cummins All', stock: 'In Stock' },
          { partNo: '4936879', description: 'Cummins Alternator 70A', brand: 'Bosch', compatibility: 'Cummins 6BT, 6CT', stock: 'In Stock' },
          { partNo: '235-7133', description: 'Caterpillar Alternator', brand: 'CAT', compatibility: 'CAT C15', stock: 'In Stock' },
          { partNo: '2871A306', description: 'Perkins Alternator', brand: 'Perkins', compatibility: 'Perkins 1000 Series', stock: 'In Stock' },
        ]
      },
      {
        name: 'Sensors & Switches',
        items: [
          { partNo: '3408607', description: 'Cummins Oil Pressure Sensor', brand: 'Cummins', compatibility: 'Cummins All', stock: 'In Stock' },
          { partNo: '3865312', description: 'Cummins Temp Sensor', brand: 'Cummins', compatibility: 'Cummins All', stock: 'In Stock' },
          { partNo: '4921477', description: 'Cummins Speed Sensor', brand: 'Cummins', compatibility: 'Cummins ISX', stock: 'In Stock' },
          { partNo: '274-6718', description: 'Caterpillar Pressure Sensor', brand: 'CAT', compatibility: 'CAT C15', stock: 'In Stock' },
          { partNo: '2848A100', description: 'Perkins Speed Sensor', brand: 'Perkins', compatibility: 'Perkins 1000 Series', stock: 'In Stock' },
        ]
      },
      {
        name: 'Glow Plugs',
        items: [
          { partNo: '3967159', description: 'Cummins Glow Plug', brand: 'Cummins', compatibility: 'Cummins 4BT, 6BT', stock: 'In Stock' },
          { partNo: '185-3687', description: 'Caterpillar Glow Plug', brand: 'CAT', compatibility: 'CAT C4.4, C6.6', stock: 'In Stock' },
          { partNo: '2666A016', description: 'Perkins Glow Plug', brand: 'Perkins', compatibility: 'Perkins 400/1000', stock: 'In Stock' },
        ]
      },
      {
        name: 'Battery Chargers',
        items: [
          { partNo: 'CH2408', description: '24V Battery Charger 8A', brand: 'SmartGen', compatibility: 'Universal 24V', stock: 'In Stock' },
          { partNo: 'CH2415', description: '24V Battery Charger 15A', brand: 'SmartGen', compatibility: 'Universal 24V', stock: 'In Stock' },
          { partNo: 'BAC06A', description: 'Float Charger 6A', brand: 'Deep Sea', compatibility: 'Universal', stock: 'In Stock' },
          { partNo: 'BAC10A', description: 'Float Charger 10A', brand: 'Deep Sea', compatibility: 'Universal', stock: 'In Stock' },
        ]
      },
    ]
  },
  {
    name: 'Cooling System',
    icon: '❄️',
    description: 'Radiators, thermostats, hoses and cooling components',
    subcategories: [
      {
        name: 'Thermostats',
        items: [
          { partNo: '3076489', description: 'Cummins Thermostat 82°C', brand: 'Cummins', compatibility: 'Cummins All', stock: 'In Stock' },
          { partNo: '3865312', description: 'Cummins Thermostat 71°C', brand: 'Cummins', compatibility: 'Cummins Marine', stock: 'In Stock' },
          { partNo: '247-7133', description: 'Caterpillar Thermostat', brand: 'CAT', compatibility: 'CAT C15', stock: 'In Stock' },
          { partNo: '2485C016', description: 'Perkins Thermostat', brand: 'Perkins', compatibility: 'Perkins 1000', stock: 'In Stock' },
        ]
      },
      {
        name: 'Radiator Hoses',
        items: [
          { partNo: '3918650', description: 'Cummins Upper Radiator Hose', brand: 'Cummins', compatibility: 'Cummins 6BT', stock: 'In Stock' },
          { partNo: '3918651', description: 'Cummins Lower Radiator Hose', brand: 'Cummins', compatibility: 'Cummins 6BT', stock: 'In Stock' },
        ]
      },
      {
        name: 'Fan Belts',
        items: [
          { partNo: '3911587', description: 'Cummins V-Belt', brand: 'Gates', compatibility: 'Cummins 6BT', stock: 'In Stock' },
          { partNo: '3288789', description: 'Cummins Poly-V Belt', brand: 'Dayco', compatibility: 'Cummins ISX', stock: 'In Stock' },
          { partNo: '9L-6645', description: 'Caterpillar V-Belt', brand: 'CAT', compatibility: 'CAT 3406', stock: 'In Stock' },
        ]
      },
    ]
  },
  {
    name: 'Exhaust System',
    icon: '💨',
    description: 'Mufflers, exhaust manifolds and emission components',
    subcategories: [
      {
        name: 'Exhaust Manifolds',
        items: [
          { partNo: '3929779', description: 'Cummins Exhaust Manifold', brand: 'Cummins', compatibility: 'Cummins 6BT', stock: 'In Stock' },
          { partNo: '4063194', description: 'Cummins Exhaust Manifold', brand: 'Cummins', compatibility: 'Cummins ISX', stock: 'In Stock' },
        ]
      },
      {
        name: 'Mufflers',
        items: [
          { partNo: 'MUF-6BT-R', description: 'Residential Muffler 6BT', brand: 'Maxim', compatibility: 'Cummins 6BT', stock: 'In Stock' },
          { partNo: 'MUF-6BT-I', description: 'Industrial Muffler 6BT', brand: 'Maxim', compatibility: 'Cummins 6BT', stock: 'In Stock' },
          { partNo: 'MUF-6BT-C', description: 'Critical Muffler 6BT', brand: 'Maxim', compatibility: 'Cummins 6BT', stock: 'In Stock' },
        ]
      },
    ]
  },
];

// Generator Brands for filtering
const brands = ['All Brands', 'Cummins', 'Caterpillar', 'Perkins', 'FG Wilson', 'Kohler', 'MTU', 'Deutz', 'Volvo Penta', 'John Deere', 'Mitsubishi', 'Sdmo', 'Aksa', 'Kipor', 'Himoinsa'];

// Detailed Parts Knowledge for SEO and Customer Education
const partsKnowledge = [
  {
    name: 'Oil Filters',
    icon: '🛢️',
    function: 'Oil filters remove contaminants, metal particles, carbon deposits, and sludge from engine oil, ensuring clean lubrication reaches all engine components.',
    failureSymptoms: ['Low oil pressure warning', 'Engine overheating', 'Knocking or ticking sounds', 'Dirty exhaust smoke', 'Reduced engine performance', 'Metal shavings in oil'],
    changeInterval: 'Every 250-500 running hours or as specified by manufacturer',
    consequences: 'Blocked oil filter causes oil bypass, allowing contaminated oil to circulate. This leads to accelerated bearing wear, scoring of cylinder walls, camshaft damage, and eventual engine seizure.',
    relatedParts: ['Engine oil', 'Oil pump', 'Oil cooler', 'Oil pressure sensor'],
    topBrands: ['Fleetguard', 'Donaldson', 'Baldwin', 'Mann', 'CAT', 'Perkins OEM'],
  },
  {
    name: 'Fuel Filters',
    icon: '⛽',
    function: 'Fuel filters remove water, dirt, rust particles, and microbial contamination from diesel fuel before it reaches the injection system.',
    failureSymptoms: ['Hard starting', 'Power loss under load', 'Engine surging', 'Stalling', 'Black smoke', 'Fuel system warning lights', 'Rough idle'],
    changeInterval: 'Every 250-500 running hours, more frequently with poor fuel quality',
    consequences: 'Contaminated fuel destroys precision injector nozzles (tolerances of 2 microns), damages injection pump internals, causes poor combustion, and can lead to complete injection system failure costing hundreds of thousands.',
    relatedParts: ['Water separator', 'Fuel injection pump', 'Injectors', 'Fuel lines', 'Fuel tank'],
    topBrands: ['Fleetguard', 'Donaldson', 'Racor', 'CAT', 'Bosch', 'Delphi'],
  },
  {
    name: 'Air Filters',
    icon: '💨',
    function: 'Air filters prevent dust, sand, pollen, and debris from entering the engine, protecting precision internal components from abrasive wear.',
    failureSymptoms: ['Reduced power output', 'Black smoke emission', 'Increased fuel consumption', 'Turbocharger whine', 'Engine running rich', 'Restricted airflow warning'],
    changeInterval: 'Every 500-1000 hours or when restriction indicator shows. More often in dusty environments.',
    consequences: 'Dirty air filter reduces airflow causing rich running, increased fuel consumption, and carbon buildup. Bypassed or torn filter allows abrasive particles to destroy piston rings, cylinder walls, valves, and turbocharger - turning a KES 3,000 filter into a KES 500,000 engine overhaul.',
    relatedParts: ['Pre-cleaner', 'Turbocharger', 'Intake manifold', 'Air restriction indicator'],
    topBrands: ['Fleetguard', 'Donaldson', 'Mann', 'Baldwin', 'CAT', 'Perkins OEM'],
  },
  {
    name: 'Coolant Filters',
    icon: '🧊',
    function: 'Coolant filters remove scale, rust, and debris from cooling system while adding supplemental coolant additives (SCA/DCA) to protect against liner pitting and corrosion.',
    failureSymptoms: ['Coolant discoloration', 'Overheating', 'Scale buildup in radiator', 'Liner pitting', 'Water pump seal leaks', 'Blocked heater core'],
    changeInterval: 'Every 250-500 hours, always when changing coolant',
    consequences: 'Without proper coolant filtration and additives, cylinder liner pitting occurs within 2000 hours, water pump fails prematurely, radiator passages block, and cavitation erosion destroys wet liners.',
    relatedParts: ['Coolant', 'Water pump', 'Thermostat', 'Radiator', 'Heater core'],
    topBrands: ['Fleetguard', 'Penray', 'CAT', 'Baldwin'],
  },
  {
    name: 'Pistons & Rings',
    icon: '🔩',
    function: 'Pistons convert combustion energy to mechanical motion. Rings seal combustion gases, control oil consumption, and transfer heat to cylinder walls.',
    failureSymptoms: ['Blue smoke (oil burning)', 'Loss of compression', 'Excessive oil consumption', 'Power loss', 'Blow-by gases', 'Knocking sound'],
    changeInterval: 'At major overhaul (8,000-15,000 hours depending on application)',
    consequences: 'Worn pistons and rings cause compression loss reducing power output, allow oil into combustion chamber causing blue smoke and oil consumption, and permit combustion gases into crankcase contaminating oil and accelerating all engine wear.',
    relatedParts: ['Cylinder liners', 'Piston pins', 'Connecting rods', 'Gaskets'],
    topBrands: ['Mahle', 'Federal Mogul', 'NPR', 'Cummins OEM', 'CAT OEM', 'Perkins OEM'],
  },
  {
    name: 'Cylinder Liners',
    icon: '🔧',
    function: 'Cylinder liners provide the wear surface for piston rings, transfer combustion heat to coolant, and are designed for replacement during overhaul.',
    failureSymptoms: ['Coolant in oil (milky oil)', 'Oil in coolant', 'Compression loss', 'Excessive oil consumption', 'Scoring marks on liner', 'Cavitation pitting'],
    changeInterval: 'At major overhaul when wear exceeds manufacturer limits (typically 0.1-0.2mm)',
    consequences: 'Worn liners cause ring blow-by, oil consumption, and power loss. Cracked or pitted liners allow coolant into oil destroying bearings within hours of operation. Severe liner wear requires block replacement.',
    relatedParts: ['Pistons', 'Piston rings', 'O-rings', 'Coolant filters', 'Head gasket'],
    topBrands: ['Mahle', 'Goetze', 'Cummins OEM', 'CAT OEM', 'Perkins OEM'],
  },
  {
    name: 'Turbochargers',
    icon: '🌀',
    function: 'Turbochargers compress intake air using exhaust energy, increasing power output by 30-50% while improving fuel efficiency at altitude.',
    failureSymptoms: ['Black smoke', 'Loss of power', 'Whining or grinding noise', 'Oil in intake system', 'Excessive oil consumption', 'Check engine light', 'Slow boost buildup'],
    changeInterval: 'Rebuild at 8,000-12,000 hours or when shaft play exceeds limits',
    consequences: 'Failed turbo seals cause massive oil consumption and smoke. Bearing failure sends metal fragments into engine destroying cylinders. Complete turbo failure leaves generator severely underpowered, unable to handle rated load.',
    relatedParts: ['Oil supply lines', 'Oil return lines', 'Intake manifold', 'Exhaust manifold', 'Intercooler'],
    topBrands: ['Holset', 'Garrett', 'BorgWarner', 'Schwitzer', 'Mitsubishi', 'IHI'],
  },
  {
    name: 'Fuel Injectors',
    icon: '💉',
    function: 'Injectors atomize fuel at extreme pressure (up to 2,000+ bar in common rail) into microscopic droplets for complete combustion.',
    failureSymptoms: ['Rough idle', 'Misfiring', 'Black smoke', 'Power loss', 'Increased fuel consumption', 'Knocking', 'Hard starting', 'Diesel knock'],
    changeInterval: 'Clean/test every 4,000 hours, replace when flow deviation exceeds 5%',
    consequences: 'Leaking injectors wash oil from cylinder walls causing rapid wear and potential seizure. Stuck injectors cause misfiring, unburned fuel in exhaust (fire risk), and turbo damage. Poor atomization wastes fuel and creates carbon deposits.',
    relatedParts: ['Injector pump', 'Fuel filters', 'Injector sleeves', 'Return lines', 'Nozzles'],
    topBrands: ['Bosch', 'Delphi', 'Denso', 'Cummins', 'CAT', 'Stanadyne'],
  },
  {
    name: 'AVR (Voltage Regulator)',
    icon: '⚡',
    function: 'The Automatic Voltage Regulator controls alternator excitation to maintain stable output voltage regardless of load changes.',
    failureSymptoms: ['Voltage fluctuations', 'Over-voltage damaging equipment', 'Under-voltage causing motor burnout', 'No voltage output', 'Hunting voltage', 'Flickering lights'],
    changeInterval: 'Replace when faulty, typically 10,000+ hours lifespan with proper protection',
    consequences: 'Failed AVR causes immediate voltage problems - over-voltage destroys connected equipment (computers, motors, electronics), under-voltage causes motor overheating and burnout. Complete AVR failure means zero output despite engine running.',
    relatedParts: ['Exciter windings', 'Sensing circuits', 'Surge protector', 'Voltage meter'],
    topBrands: ['Stamford', 'Leroy Somer', 'Marelli', 'Marathon', 'Mecc Alte'],
  },
  {
    name: 'Generator Controllers',
    icon: '🎛️',
    function: 'Controllers monitor all generator parameters, provide automatic start/stop, load management, protection functions, and fault diagnostics.',
    failureSymptoms: ['Display errors', 'False alarms', 'Failure to start', 'No protection functions', 'Communication errors', 'Erratic behavior', 'No remote monitoring'],
    changeInterval: 'Replace when faulty or for feature upgrades. Typical lifespan 15+ years.',
    consequences: 'Failed controller leaves generator without protection - no over-temperature, over-speed, low oil, or overcurrent protection. Generator can destroy itself without operator awareness. No automatic operation possible.',
    relatedParts: ['Sensors', 'Wiring harness', 'Display', 'Remote monitoring', 'ATS interface'],
    topBrands: ['Deep Sea Electronics', 'ComAp', 'Smartgen', 'Datakom', 'Woodward'],
  },
  {
    name: 'Starter Motors',
    icon: '🔑',
    function: 'Starter motors crank the engine at 150-300 RPM to initiate combustion, typically drawing 500-2000 amps during cranking.',
    failureSymptoms: ['Slow cranking', 'Clicking sound only', 'Grinding noise', 'Intermittent starting', 'Smoke from starter', 'No response when starting'],
    changeInterval: 'Replace when faulty, rebuild at major overhaul. Typical 10,000+ starts lifespan.',
    consequences: 'Failed starter means complete inability to start generator electrically. Grinding starter damages flywheel ring gear (expensive repair). Seized starter can drain battery completely and damage wiring.',
    relatedParts: ['Battery', 'Battery cables', 'Solenoid', 'Ring gear', 'Ignition switch'],
    topBrands: ['Delco Remy', 'Bosch', 'Denso', 'Prestolite', 'Nikko'],
  },
  {
    name: 'Bearings',
    icon: '⭕',
    function: 'Main and connecting rod bearings support the crankshaft and connecting rods, providing low-friction surfaces with oil film separation.',
    failureSymptoms: ['Knocking noise', 'Low oil pressure', 'Metal in oil filter', 'Vibration', 'Overheating', 'Seizure warning'],
    changeInterval: 'At major overhaul when clearances exceed limits or surface damage visible',
    consequences: 'Bearing failure is catastrophic - bearing material breaks up contaminating entire engine, crankshaft journals score requiring grinding or replacement, connecting rod can break through block destroying engine completely.',
    relatedParts: ['Crankshaft', 'Connecting rods', 'Oil pump', 'Oil filter', 'Thrust washers'],
    topBrands: ['Glyco', 'King', 'ACL', 'Federal Mogul', 'Cummins OEM', 'CAT OEM'],
  },
];

// Parts Knowledge Component
function PartsKnowledgeSection() {
  const [expandedPart, setExpandedPart] = useState<string | null>(null);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-4">Understanding Generator Parts</h2>
        <p className="text-gray-400 text-center mb-12 max-w-3xl mx-auto">
          Click &quot;Learn More&quot; on any part to understand its function, failure symptoms, and why quality matters. Knowledge helps you make informed purchasing decisions.
        </p>
        <div className="space-y-4">
          {partsKnowledge.map((part, i) => (
            <div key={i} className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
              <div 
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-800/30 transition-colors"
                onClick={() => setExpandedPart(expandedPart === part.name ? null : part.name)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{part.icon}</span>
                  <div>
                    <h3 className="font-bold text-white text-lg">{part.name}</h3>
                    <p className="text-gray-400 text-sm">{part.function.substring(0, 80)}...</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-blue-400 text-sm font-medium hidden sm:block">Learn More</span>
                  <svg 
                    className={`w-5 h-5 text-blue-400 transition-transform ${expandedPart === part.name ? 'rotate-180' : ''}`} 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {expandedPart === part.name && (
                <div className="border-t border-gray-800 p-6 bg-black/30">
                  {/* Function */}
                  <div className="mb-6">
                    <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      What It Does
                    </h4>
                    <p className="text-gray-300">{part.function}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Failure Symptoms */}
                    <div className="bg-red-900/20 rounded-xl p-5 border border-red-500/30">
                      <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Failure Symptoms
                      </h4>
                      <ul className="space-y-1">
                        {part.failureSymptoms.map((symptom, j) => (
                          <li key={j} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-red-400">•</span> {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Change Interval & Top Brands */}
                    <div className="space-y-4">
                      <div className="bg-green-900/20 rounded-xl p-5 border border-green-500/30">
                        <h4 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Service Interval
                        </h4>
                        <p className="text-gray-300 text-sm">{part.changeInterval}</p>
                      </div>
                      <div className="bg-blue-900/20 rounded-xl p-5 border border-blue-500/30">
                        <h4 className="text-blue-400 font-bold mb-2">Top Brands We Stock</h4>
                        <div className="flex flex-wrap gap-2">
                          {part.topBrands.map((brand, j) => (
                            <span key={j} className="px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-300">{brand}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Consequences */}
                    <div className="bg-orange-900/20 rounded-xl p-5 border border-orange-500/30 md:col-span-2">
                      <h4 className="text-orange-400 font-bold mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        What Happens If Not Replaced
                      </h4>
                      <p className="text-gray-300 text-sm">{part.consequences}</p>
                    </div>

                    {/* Related Parts */}
                    <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 md:col-span-2">
                      <h4 className="text-gray-300 font-bold mb-2">Related Parts to Check</h4>
                      <div className="flex flex-wrap gap-2">
                        {part.relatedParts.map((related, j) => (
                          <span key={j} className="px-3 py-1 bg-gray-700 rounded-full text-xs text-gray-300">{related}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="tel:+254768860655" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Order {part.name}: 0768 860 655
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SparePartsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30 mb-6">
            <span className="text-blue-300 text-sm font-medium">🏭 Kenya&apos;s Largest Generator Parts Inventory</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-blue-500">Generator Spare Parts</span>
            <br />Complete Inventory
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mb-8">
            Genuine and OEM spare parts for all generator brands. Filters, engine components, electrical parts, and accessories. Same-day delivery in Nairobi, nationwide shipping available.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="tel:+254768860655" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Order: 0768 860 655
            </a>
            <a href="#parts-catalog" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg border border-white/20 transition-all">
              Browse Catalog
            </a>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { value: '10,000+', label: 'Parts in Stock' },
              { value: '20+', label: 'Brands Covered' },
              { value: '24hrs', label: 'Nairobi Delivery' },
              { value: '100%', label: 'Genuine Parts' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-3xl font-bold text-blue-500">{stat.value}</div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-12 bg-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-4">
            {partsCategories.map((cat, i) => (
              <a key={i} href={`#${cat.name.toLowerCase().replace(' ', '-')}`} className="p-6 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-blue-500/30 transition-all text-center group">
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{cat.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{cat.subcategories.length} categories</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Parts Catalog */}
      <section id="parts-catalog" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Brand Filter */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-4">Filter by Brand:</h3>
            <div className="flex flex-wrap gap-2">
              {brands.map((brand, i) => (
                <button key={i} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${i === 0 ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Categories and Parts */}
          {partsCategories.map((category, catIndex) => (
            <div key={catIndex} id={category.name.toLowerCase().replace(' ', '-')} className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl">{category.icon}</span>
                <div>
                  <h2 className="text-3xl font-bold text-white">{category.name}</h2>
                  <p className="text-gray-400">{category.description}</p>
                </div>
              </div>

              {category.subcategories.map((subcat, subIndex) => (
                <div key={subIndex} className="mb-10">
                  <h3 className="text-xl font-bold text-blue-400 mb-4 border-b border-gray-800 pb-2">{subcat.name}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
                          <th className="pb-3 pr-4">Part Number</th>
                          <th className="pb-3 pr-4">Description</th>
                          <th className="pb-3 pr-4">Brand</th>
                          <th className="pb-3 pr-4">Compatibility</th>
                          <th className="pb-3 pr-4">Stock</th>
                          <th className="pb-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subcat.items.map((item, itemIndex) => (
                          <tr key={itemIndex} className="border-b border-gray-800/50 hover:bg-gray-900/30">
                            <td className="py-4 pr-4">
                              <span className="font-mono text-sm bg-gray-800 px-2 py-1 rounded">{item.partNo}</span>
                            </td>
                            <td className="py-4 pr-4 text-white">{item.description}</td>
                            <td className="py-4 pr-4 text-gray-400">{item.brand}</td>
                            <td className="py-4 pr-4 text-gray-400 text-sm">{item.compatibility}</td>
                            <td className="py-4 pr-4">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${item.stock === 'In Stock' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                {item.stock}
                              </span>
                            </td>
                            <td className="py-4">
                              <a href="tel:+254768860655" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                                Order
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Parts Knowledge Section */}
      <PartsKnowledgeSection />

      {/* Why Buy From Us */}
      <section className="py-16 bg-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Buy Parts From EmersonEIMS?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '✓', title: '100% Genuine Parts', desc: 'Direct from manufacturers and authorized distributors' },
              { icon: '🚚', title: 'Fast Delivery', desc: 'Same-day in Nairobi, 24-48hrs nationwide' },
              { icon: '💰', title: 'Competitive Pricing', desc: 'Best prices guaranteed, bulk discounts available' },
              { icon: '🛡️', title: 'Warranty', desc: 'Full manufacturer warranty on all parts' },
              { icon: '📞', title: 'Expert Support', desc: 'Technical assistance to find the right part' },
              { icon: '📦', title: 'Large Inventory', desc: '10,000+ parts in stock, ready to ship' },
              { icon: '🔧', title: 'Installation', desc: 'Professional installation available' },
              { icon: '🔄', title: 'Returns', desc: '30-day return policy on unused parts' },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-gray-900/50 rounded-xl border border-gray-800">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Form */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Request Parts Quote</h2>
          <p className="text-gray-400 text-center mb-8">Can&apos;t find what you need? Send us your requirements.</p>
          <form className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Name *</label>
                <input type="text" className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone *</label>
                <input type="tel" className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Generator Brand</label>
                <select className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none text-white">
                  <option value="">Select Brand</option>
                  {brands.slice(1).map((b, i) => <option key={i} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Generator Model</label>
                <input type="text" className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none text-white" placeholder="e.g., C500D5" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Parts Required *</label>
              <textarea rows={4} className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none text-white" placeholder="List the parts you need with quantities..." />
            </div>
            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-lg">
              Request Quote
            </button>
          </form>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-blue-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Parts Urgently?</h2>
          <p className="text-xl text-blue-100 mb-8">Call our parts hotline for immediate assistance.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+254768860655" className="px-8 py-4 bg-white text-blue-700 font-bold rounded-lg text-lg hover:bg-gray-100 transition-colors">
              📞 0768 860 655
            </a>
            <a href="tel:+254782914717" className="px-8 py-4 bg-black/20 text-white font-bold rounded-lg text-lg hover:bg-black/30 transition-colors">
              📞 0782 914 717
            </a>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6">About EmersonEIMS Generator Spare Parts</h2>
          <div className="prose prose-invert prose-blue max-w-none text-gray-400 space-y-4">
            <p>
              EmersonEIMS maintains Kenya&apos;s most comprehensive inventory of generator spare parts, serving the needs of industrial, commercial, and residential generator owners across all 47 counties.
            </p>
            <p>
              Our extensive parts catalog includes genuine filters (oil, fuel, air, coolant), engine components (pistons, liners, bearings, gaskets, turbochargers, injectors, fuel pumps), electrical parts (AVRs, controllers, starter motors, sensors, glow plugs, battery chargers), cooling system components, and exhaust system parts.
            </p>
            <p>
              We stock parts for all major generator brands including Cummins, Caterpillar, Perkins, FG Wilson, Kohler, MTU, Deutz, Volvo Penta, John Deere, Mitsubishi, Sdmo, Aksa, Kipor, and Himoinsa generators ranging from 5kVA to 3,500kVA.
            </p>
          </div>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            "name": "EmersonEIMS Generator Spare Parts",
            "description": "Kenya's largest generator spare parts inventory",
            "telephone": "+254768860655",
            "address": { "@type": "PostalAddress", "addressLocality": "Nairobi", "addressCountry": "KE" },
            "openingHours": "Mo-Fr 08:00-18:00, Sa 08:00-14:00"
          })
        }}
      />
    </div>
  );
}
