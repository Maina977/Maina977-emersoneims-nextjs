'use client';

/**
 * SOLAR BIBLE - THE COMPLETE SOLAR ENERGY SOLUTIONS CENTER
 *
 * The most comprehensive solar resource in Kenya
 * Everything from sales to installation, maintenance to financing
 *
 * Score Target: 95/100 (Matching Generator Bible standards)
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { AnalogClock, AnalogCalendar, WeatherWidget } from '@/components/ui/AnalogWidgets';
import CinematicImageGallery from '@/components/ui/CinematicImageGallery';

// ==================== DYNAMIC IMPORTS ====================
const SolarBibleEngine = dynamic(() => import('@/components/solar/SolarBibleEngine'), {
  loading: () => <div className="animate-pulse bg-slate-800 rounded-xl h-96" />,
  ssr: false
});

const SolarProductsShop = dynamic(() => import('@/components/solar/SolarProductsShop'), {
  loading: () => <div className="animate-pulse bg-slate-800 rounded-xl h-96" />,
  ssr: false
});

const SolarROICalculator = dynamic(() => import('@/components/solar/SolarROICalculator'), {
  loading: () => <div className="animate-pulse bg-slate-800 rounded-xl h-96" />,
  ssr: false
});

const SolarInstallationBooking = dynamic(() => import('@/components/solar/SolarInstallationBooking'), {
  loading: () => <div className="animate-pulse bg-slate-800 rounded-xl h-96" />,
  ssr: false
});

const SolarMaintenanceHub = dynamic(() => import('@/components/solar/SolarMaintenanceHub'), {
  loading: () => <div className="animate-pulse bg-slate-800 rounded-xl h-96" />,
  ssr: false
});

const SolarMonitoringApp = dynamic(() => import('@/components/solar/SolarMonitoringApp'), {
  loading: () => <div className="animate-pulse bg-slate-800 rounded-xl h-96" />,
  ssr: false
});

const AIQuotationSystem = dynamic(() => import('@/components/solar/AIQuotationSystem'), {
  loading: () => <div className="animate-pulse bg-slate-800 rounded-xl h-96" />,
  ssr: false
});

// Import equipment database and guides
import {
  SOLAR_PANELS_DATABASE,
  INVERTERS_DATABASE,
  BATTERIES_DATABASE,
  CABLE_SPECIFICATIONS,
  MPPT_CONTROLLERS,
  KENYA_SOLAR_DATA,
  calculateCableSize,
  TOTAL_EQUIPMENT
} from '@/lib/solar/solarEquipmentDatabase';

import {
  ALL_MAINTENANCE_GUIDES,
  INVERTER_FAULT_CODES,
  getGuidesByCategory,
  getFaultCodesByBrand
} from '@/lib/solar/solarMaintenanceGuides';

import {
  WIRING_DIAGRAMS,
  COMMON_CONNECTION_PATTERNS
} from '@/lib/solar/solarWiringDiagrams';

// ==================== HERO GALLERY ====================
const heroGalleryImages = [
  {
    src: '/images/1 (1).png',
    alt: 'Solar Panels at Sunset',
    category: 'Solar Arrays',
    title: 'Premium Solar Installation',
    description: 'High-efficiency solar panels with cinematic sunset backdrop',
  },
  {
    src: '/images/solar power farms.png',
    alt: 'Solar Power Farm Kenya',
    category: 'Commercial',
    title: 'Solar Power Farms',
    description: 'Large-scale solar farms powering Kenyan businesses',
  },
  {
    src: '/images/solar for flower farms.png',
    alt: 'Solar for Flower Farms',
    category: 'Agriculture',
    title: 'Agricultural Solar',
    description: 'Solar solutions for Kenya flower farms',
  },
  {
    src: '/images/solar hotel heaters.png',
    alt: 'Solar Hotel Water Heaters',
    category: 'Hospitality',
    title: 'Solar Water Heating',
    description: 'Solar thermal systems for hotels and resorts',
  },
  {
    src: '/images/solar-water-pumping.png',
    alt: 'Solar Water Pumping System',
    category: 'Water Solutions',
    title: 'Solar Water Pumps',
    description: 'Off-grid solar pumping for irrigation',
  },
  {
    src: '/images/solar changeover control.png',
    alt: 'Solar Changeover Control Panel',
    category: 'Controls',
    title: 'Smart Changeover Systems',
    description: 'Automatic solar-grid-generator switching',
  },
];

// ==================== KENYA LOCATIONS ====================
const KENYA_LOCATIONS = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
  'Malindi', 'Kilifi', 'Karen', 'Embakasi', 'Thika',
  'Nyeri', 'Machakos', 'Garissa', 'Meru', 'Kakamega'
];

// ==================== SOLAR SYSTEM TYPES ====================
const SOLAR_SYSTEMS = [
  { id: 'residential', name: 'Residential Solar', icon: '🏠', capacity: '1-10 kW', description: 'Home solar systems with battery backup for reliable power supply.', components: ['Solar Panels', 'Inverter', 'Battery Bank', 'Charge Controller', 'Distribution Board'], maintenanceTasks: ['Panel cleaning and inspection', 'Battery water level check', 'Connection tightening', 'Inverter ventilation check', 'Performance monitoring'] },
  { id: 'commercial', name: 'Commercial Solar', icon: '🏢', capacity: '10-100 kW', description: 'Medium-scale solar installations for businesses and institutions.', components: ['Solar Array', 'String Inverters', 'Battery Storage', 'Monitoring System', 'Grid Tie'], maintenanceTasks: ['Array inspection and cleaning', 'String voltage verification', 'Inverter performance check', 'Battery state of health', 'Grid synchronization test'] },
  { id: 'industrial', name: 'Industrial Solar', icon: '🏭', capacity: '100+ kW', description: 'Large-scale solar farms and industrial installations.', components: ['Solar Farm', 'Central Inverters', 'SCADA System', 'Transformers', 'Substation'], maintenanceTasks: ['Thermal imaging inspection', 'IV curve tracing', 'Transformer oil analysis', 'SCADA calibration', 'Grid compliance testing'] },
  { id: 'hybrid', name: 'Hybrid Systems', icon: '⚡', capacity: '5-500 kW', description: 'Solar-generator-battery hybrid systems for maximum reliability.', components: ['Solar Array', 'Generator', 'Hybrid Inverter', 'Battery Bank', 'ATS Panel'], maintenanceTasks: ['Solar-generator synchronization', 'Battery cycling test', 'ATS operation check', 'Fuel optimization review', 'System efficiency audit'] },
  { id: 'offgrid', name: 'Off-Grid Systems', icon: '🏕️', capacity: '0.5-50 kW', description: 'Standalone systems for remote locations without grid access.', components: ['Solar Panels', 'MPPT Controller', 'Battery Bank', 'Off-Grid Inverter', 'Load Controller'], maintenanceTasks: ['Battery equalization', 'Charge controller calibration', 'Load priority configuration', 'System autonomy test', 'Backup assessment'] },
  { id: 'solar-pump', name: 'Solar Water Pumps', icon: '💧', capacity: '0.5-50 HP', description: 'Solar-powered water pumping for irrigation and domestic use.', components: ['Solar Array', 'VFD/Controller', 'Submersible Pump', 'Water Tank', 'Level Sensors'], maintenanceTasks: ['Pump efficiency test', 'VFD parameter check', 'Water quality analysis', 'Tank inspection', 'Irrigation schedule optimization'] },
];

// ==================== TRANSPARENT PRICING ====================
const SOLAR_PRICING = [
  {
    type: 'Residential Basic',
    capacity: '3 kW',
    priceFrom: 350000,
    priceTo: 450000,
    ideal: 'Small homes, 3-4 rooms',
    includes: ['6× 500W Panels', '3kW Inverter', '200Ah Battery', 'Installation', '1 Year Warranty'],
    savings: '8,000-12,000/month'
  },
  {
    type: 'Residential Standard',
    capacity: '5 kW',
    priceFrom: 550000,
    priceTo: 750000,
    ideal: 'Medium homes, offices',
    includes: ['10× 500W Panels', '5kW Hybrid Inverter', '400Ah Lithium', 'Installation', '2 Year Warranty'],
    savings: '15,000-22,000/month',
    popular: true
  },
  {
    type: 'Residential Premium',
    capacity: '10 kW',
    priceFrom: 950000,
    priceTo: 1400000,
    ideal: 'Large homes, multiple ACs',
    includes: ['20× 500W Panels', '10kW Hybrid Inverter', '10kWh Lithium Bank', 'Full Installation', '3 Year Warranty'],
    savings: '30,000-45,000/month'
  },
  {
    type: 'Commercial Small',
    capacity: '20 kW',
    priceFrom: 1800000,
    priceTo: 2500000,
    ideal: 'Shops, small factories',
    includes: ['40× 500W Panels', '20kW Inverter', '20kWh Storage', 'Monitoring System', '3 Year Warranty'],
    savings: '60,000-85,000/month'
  },
  {
    type: 'Commercial Medium',
    capacity: '50 kW',
    priceFrom: 3500000,
    priceTo: 5000000,
    ideal: 'Schools, hotels, factories',
    includes: ['100× 500W Panels', '50kW Central Inverter', '50kWh Battery', 'SCADA Monitoring', '5 Year Warranty'],
    savings: '150,000-200,000/month'
  },
  {
    type: 'Industrial',
    capacity: '100+ kW',
    priceFrom: 7000000,
    priceTo: 15000000,
    ideal: 'Large factories, farms',
    includes: ['200+ Panels', 'Central Inverter System', 'Industrial Battery', 'Full EMS', '5 Year Warranty'],
    savings: '300,000-600,000/month'
  },
];

// ==================== SOLAR BRANDS COMPARISON ====================
const SOLAR_BRANDS = [
  {
    name: 'JA Solar',
    origin: 'China',
    efficiency: '21.5%',
    warranty: '25 Years',
    tier: 'Tier 1',
    priceRange: 'Premium',
    bestFor: 'Commercial, Industrial',
    rating: 4.8
  },
  {
    name: 'LONGi',
    origin: 'China',
    efficiency: '22.3%',
    warranty: '25 Years',
    tier: 'Tier 1',
    priceRange: 'Premium',
    bestFor: 'All applications',
    rating: 4.9
  },
  {
    name: 'Jinko Solar',
    origin: 'China',
    efficiency: '21.8%',
    warranty: '25 Years',
    tier: 'Tier 1',
    priceRange: 'Mid-Premium',
    bestFor: 'Residential, Commercial',
    rating: 4.7
  },
  {
    name: 'Trina Solar',
    origin: 'China',
    efficiency: '21.6%',
    warranty: '25 Years',
    tier: 'Tier 1',
    priceRange: 'Mid-Premium',
    bestFor: 'Large-scale projects',
    rating: 4.7
  },
  {
    name: 'Canadian Solar',
    origin: 'Canada',
    efficiency: '21.1%',
    warranty: '25 Years',
    tier: 'Tier 1',
    priceRange: 'Mid-Range',
    bestFor: 'Budget-conscious',
    rating: 4.5
  },
  {
    name: 'SunPower',
    origin: 'USA',
    efficiency: '22.8%',
    warranty: '25 Years',
    tier: 'Tier 1',
    priceRange: 'Ultra-Premium',
    bestFor: 'Limited roof space',
    rating: 4.9
  },
];

// ==================== INVERTER BRANDS ====================
const INVERTER_BRANDS = [
  { name: 'Sungrow', type: 'String/Hybrid', warranty: '10 Years', origin: 'China', priceRange: 'Mid-Premium' },
  { name: 'Deye', type: 'Hybrid', warranty: '5 Years', origin: 'China', priceRange: 'Budget' },
  { name: 'Growatt', type: 'Hybrid', warranty: '5 Years', origin: 'China', priceRange: 'Budget' },
  { name: 'SMA', type: 'String', warranty: '10 Years', origin: 'Germany', priceRange: 'Premium' },
  { name: 'Fronius', type: 'String', warranty: '10 Years', origin: 'Austria', priceRange: 'Premium' },
  { name: 'Victron', type: 'Off-Grid', warranty: '5 Years', origin: 'Netherlands', priceRange: 'Premium' },
];

// ==================== BEFORE/AFTER PROJECTS ====================
const SOLAR_PROJECTS = [
  {
    client: 'Lenchada Group of Hotels',
    location: 'Nairobi',
    type: 'Hybrid Solar-Diesel',
    before: 'KES 2.8M monthly electricity bills, 100% grid dependency, frequent outages disrupting guests',
    after: '250kWp solar array with 400kWh battery storage - 65% energy savings, 60% renewable energy',
    image: '/images/solar power farms.png',
    stats: { panels: 556, capacity: '250kWp', savings: '65%', payback: '3.2 years' }
  },
  {
    client: 'Kivukoni International School',
    location: 'Kilifi',
    type: 'Solar-Generator Hybrid',
    before: 'Unreliable grid power affecting classes, high fuel costs running generator during day',
    after: '20kWp solar array covering daytime load, generator for backup only - 80% fuel savings',
    image: '/images/solar for flower farms.png',
    stats: { panels: 40, capacity: '20kWp', savings: '80%', payback: '2.5 years' }
  },
];

// ==================== FAQ SECTION ====================
const SOLAR_FAQ = [
  {
    question: 'How much does a solar system cost in Kenya?',
    answer: 'Solar system costs in Kenya range from KES 350,000 for a basic 3kW residential system to KES 15M+ for industrial installations over 100kW. The exact cost depends on your energy needs, panel quality, battery capacity, and whether you need grid-tie or off-grid configuration. We offer free site surveys to give you an accurate quote.'
  },
  {
    question: 'How long is the payback period for solar in Kenya?',
    answer: 'With Kenya\'s excellent solar irradiation (5-6 peak sun hours daily), most systems pay back in 2-4 years for residential and 3-5 years for commercial installations. After payback, you enjoy essentially free electricity for the remaining 20+ years of panel life. Our ROI calculator can show your exact payback timeline.'
  },
  {
    question: 'Do solar panels work during cloudy days or at night?',
    answer: 'Solar panels produce less power on cloudy days (about 25-40% of rated output) but still generate electricity. At night, panels don\'t produce power - that\'s where battery storage comes in. A properly sized battery bank stores daytime excess for evening use. Grid-tied systems can also draw from the grid when needed.'
  },
  {
    question: 'What maintenance do solar panels need?',
    answer: 'Solar panels are very low maintenance. Monthly cleaning with water to remove dust is usually sufficient. We recommend quarterly inspections for connections and annual professional checkups. Batteries (especially lead-acid) need more attention - monthly water level checks and equalization charges. Inverters typically need filter cleaning every 6 months.'
  },
  {
    question: 'Can I add a generator to my solar system?',
    answer: 'Absolutely! Hybrid solar-generator systems are very popular in Kenya due to grid unreliability. A hybrid inverter manages solar, battery, and generator inputs automatically. The generator only runs when solar and battery can\'t meet demand, dramatically reducing fuel costs. We specialize in these integrated systems.'
  },
  {
    question: 'Do you offer financing for solar installations?',
    answer: 'Yes! We offer multiple financing options: 30-50% deposit with 6-24 month payment plans, asset financing through partner banks, and lease-to-own arrangements. Many businesses also qualify for green energy tax incentives. Contact us to discuss the best financing option for your situation.'
  },
  {
    question: 'What warranty do I get with solar panels?',
    answer: 'Our Tier-1 solar panels come with 25-year performance warranties (guaranteeing 80%+ output at 25 years). Inverters typically have 5-10 year warranties. Lithium batteries carry 10-year warranties, while lead-acid batteries have 2-3 year warranties. We also provide our own 1-3 year installation warranty covering workmanship.'
  },
  {
    question: 'How long does solar installation take?',
    answer: 'Installation time depends on system size: residential systems (1-10kW) take 2-5 days, commercial systems (10-50kW) take 1-2 weeks, and industrial installations (100kW+) take 3-6 weeks. This includes site preparation, panel mounting, electrical wiring, and commissioning. We work to minimize disruption to your daily activities.'
  },
];

// ==================== SOLAR GUARANTEES ====================
const SOLAR_GUARANTEES = [
  {
    title: '25-Year Panel Warranty',
    description: 'All our Tier-1 solar panels come with manufacturer 25-year performance warranty',
    icon: '🛡️'
  },
  {
    title: 'ROI Guarantee',
    description: 'If your system doesn\'t achieve projected savings in year 1, we\'ll make it right',
    icon: '💰'
  },
  {
    title: 'Free Site Survey',
    description: 'Professional assessment of your property with detailed proposal - no obligation',
    icon: '📋'
  },
  {
    title: '48-Hour Response',
    description: 'Any maintenance issue addressed within 48 hours anywhere in Kenya',
    icon: '⚡'
  },
  {
    title: 'Certified Installation',
    description: 'All installations by ERC-licensed technicians following international standards',
    icon: '✅'
  },
  {
    title: 'Money-Back Guarantee',
    description: '30-day satisfaction guarantee on all equipment purchases',
    icon: '🔙'
  },
];

// ==================== WHY SOLAR IN KENYA ====================
const WHY_SOLAR_KENYA = [
  {
    stat: '5.5',
    label: 'Peak Sun Hours/Day',
    description: 'Kenya has excellent solar irradiation year-round'
  },
  {
    stat: '25+',
    label: 'Years Panel Life',
    description: 'Modern panels last 25-30 years with minimal degradation'
  },
  {
    stat: '65%',
    label: 'Bill Reduction',
    description: 'Average electricity bill savings with solar'
  },
  {
    stat: '3-4',
    label: 'Year Payback',
    description: 'Typical ROI timeframe for solar investment'
  },
];

// ==================== COMMON SOLAR FAULTS ====================
const SOLAR_FAULTS = [
  { code: 'SOL-001', title: 'Low Solar Production', severity: 'warning', description: 'Solar panels producing below expected output. This could indicate soiling, shading, degradation, or equipment malfunction.', causes: ['Panel soiling', 'Partial shading', 'Panel degradation', 'Faulty connections', 'Inverter issues'], solutions: ['Clean panels with soft brush and water', 'Remove shading obstacles', 'Check all DC connections', 'Verify inverter operation', 'Test individual string voltages'] },
  { code: 'SOL-002', title: 'Battery Overcharge', severity: 'critical', description: 'Battery voltage exceeding safe limits. This dangerous condition can cause battery damage, reduced lifespan, or thermal runaway.', causes: ['Charge controller malfunction', 'Wrong voltage settings', 'Temperature sensor failure', 'Oversized solar array'], solutions: ['Reduce charging current', 'Verify charge controller settings', 'Check temperature sensors', 'Inspect battery ventilation', 'Consider load diversion'] },
  { code: 'SOL-003', title: 'Grid Sync Failure', severity: 'critical', description: 'Inverter unable to synchronize with utility grid. System cannot export power or provide grid-tied operation.', causes: ['Grid voltage out of range', 'Frequency deviation', 'Ground fault detected', 'Anti-islanding trip', 'Communication failure'], solutions: ['Check utility supply quality', 'Verify grid parameters', 'Clear ground faults', 'Reset anti-islanding', 'Update inverter firmware'] },
  { code: 'SOL-004', title: 'MPPT Tracking Error', severity: 'warning', description: 'Maximum Power Point Tracker not optimizing panel output. System losing potential energy harvest.', causes: ['Rapid irradiance changes', 'Partial shading', 'Controller malfunction', 'Wiring issues', 'Panel mismatch'], solutions: ['Check for shading patterns', 'Verify string configuration', 'Update controller firmware', 'Inspect DC wiring', 'Test individual panels'] },
  { code: 'SOL-005', title: 'Battery Low State of Charge', severity: 'warning', description: 'Battery bank below minimum recommended charge level. Continued discharge may damage batteries.', causes: ['Insufficient solar input', 'Excessive load demand', 'Battery degradation', 'Charge controller fault', 'Weather conditions'], solutions: ['Reduce non-essential loads', 'Check solar production', 'Verify charge controller', 'Test battery capacity', 'Consider backup charging'] },
  { code: 'SOL-006', title: 'Inverter Overtemperature', severity: 'critical', description: 'Inverter temperature exceeding safe operating limits. Unit will derate or shut down to prevent damage.', causes: ['Blocked ventilation', 'Fan failure', 'High ambient temperature', 'Overloading', 'Dust accumulation'], solutions: ['Improve ventilation', 'Clean heat sinks', 'Replace cooling fans', 'Reduce load', 'Relocate if needed'] },
];

// ==================== MAINTENANCE SCHEDULE ====================
const MAINTENANCE_SCHEDULE = [
  { task: 'Visual inspection', frequency: 'Weekly', duration: '15 min', priority: 'routine' },
  { task: 'Panel cleaning', frequency: 'Monthly', duration: '1-2 hours', priority: 'routine' },
  { task: 'Battery water check', frequency: 'Monthly', duration: '30 min', priority: 'important' },
  { task: 'Connection tightening', frequency: 'Quarterly', duration: '1 hour', priority: 'important' },
  { task: 'Performance audit', frequency: 'Quarterly', duration: '2-3 hours', priority: 'important' },
  { task: 'Inverter service', frequency: 'Annually', duration: '4-6 hours', priority: 'critical' },
  { task: 'Battery load test', frequency: 'Annually', duration: '4 hours', priority: 'critical' },
  { task: 'Full system inspection', frequency: 'Annually', duration: '1 day', priority: 'critical' },
];

// ==================== EDUCATIONAL CONTENT ====================
const SOLAR_EDUCATION = [
  { title: 'How Solar Panels Work', content: 'Solar panels convert sunlight into electricity through photovoltaic cells. When sunlight hits the silicon cells, it knocks electrons loose, creating an electrical current. This DC power is then converted to AC by an inverter for use in your home or business.', icon: '☀️' },
  { title: 'Battery Storage Basics', content: 'Solar batteries store excess energy produced during the day for use at night or during power outages. Modern lithium batteries offer 10-15 year lifespans with 95% depth of discharge, while lead-acid batteries typically last 3-5 years with 50% DoD.', icon: '🔋' },
  { title: 'Grid-Tied vs Off-Grid', content: 'Grid-tied systems connect to the utility grid and can sell excess power. Off-grid systems are completely independent and require battery storage. Hybrid systems combine both approaches for maximum flexibility and reliability.', icon: '⚡' },
  { title: 'Sizing Your System', content: 'System size depends on your daily energy consumption, available roof space, and budget. In Kenya, expect 5-6 peak sun hours daily. A 5kW system produces about 20-25 kWh/day, suitable for a medium-sized home.', icon: '📐' },
  { title: 'Inverter Types Explained', content: 'String inverters connect multiple panels in series. Microinverters attach to individual panels for better shade tolerance. Hybrid inverters manage solar, battery, and grid connections, offering the most flexibility for Kenya conditions.', icon: '🔌' },
  { title: 'Maintenance Best Practices', content: 'Clean panels monthly during dry season. Check battery water levels (for lead-acid). Inspect connections quarterly. Monitor system performance daily through your inverter app. Schedule professional inspection annually.', icon: '🔧' },
];

// ==================== DOWNLOADABLE RESOURCES ====================
const SOLAR_DOWNLOADS = [
  { title: 'Solar System Sizing Guide', description: 'Complete guide to sizing your solar system for Kenya', type: 'PDF', size: '2.4 MB', icon: '📐' },
  { title: 'Solar Product Catalog 2026', description: 'Full catalog with panels, inverters, batteries, and pricing', type: 'PDF', size: '8.1 MB', icon: '📚' },
  { title: 'Solar ROI Calculator Spreadsheet', description: 'Excel calculator for solar investment analysis', type: 'XLSX', size: '156 KB', icon: '📊' },
  { title: 'Solar Maintenance Checklist', description: 'Monthly, quarterly, and annual maintenance tasks', type: 'PDF', size: '890 KB', icon: '✅' },
  { title: 'Solar Tax Incentives Guide', description: 'Guide to solar tax benefits in Kenya', type: 'PDF', size: '1.2 MB', icon: '💰' },
  { title: 'Solar System Wiring Diagrams', description: 'Technical diagrams for common configurations', type: 'PDF', size: '4.5 MB', icon: '⚡' },
];

type TabType = 'overview' | 'shop' | 'calculator' | 'roi' | 'booking' | 'faults' | 'maintenance' | 'education' | 'equipment' | 'wiring' | 'monitoring' | 'repair' | 'quotation';

// ==================== ANIMATED COUNTER COMPONENT ====================
function AnimatedCounter({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, hasAnimated]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-amber-400">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

// ==================== FLOATING WHATSAPP COMPONENT ====================
function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.a
      href="https://wa.me/254768860665?text=Hi%20EmersonEIMS,%20I'm%20interested%20in%20solar%20solutions"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-3 group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      <span className="hidden group-hover:block pr-2 font-semibold">Chat Now</span>
    </motion.a>
  );
}

// ==================== URGENCY BANNER COMPONENT ====================
function UrgencyBanner() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 text-white py-3 px-4"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 text-center">
        <span className="font-bold text-lg">☀️ SOLAR SAVINGS WEEK - 15% OFF All Systems!</span>
        <div className="flex items-center gap-2">
          <div className="bg-white/20 rounded px-2 py-1">
            <span className="font-bold">{timeLeft.days}</span>d
          </div>
          <div className="bg-white/20 rounded px-2 py-1">
            <span className="font-bold">{timeLeft.hours}</span>h
          </div>
          <div className="bg-white/20 rounded px-2 py-1">
            <span className="font-bold">{timeLeft.minutes}</span>m
          </div>
          <div className="bg-white/20 rounded px-2 py-1">
            <span className="font-bold">{timeLeft.seconds}</span>s
          </div>
        </div>
        <a
          href="https://wa.me/254768860665?text=I%20want%20the%2015%25%20Solar%20Savings%20Week%20discount!"
          className="bg-white text-orange-600 px-4 py-2 rounded-full font-bold hover:bg-amber-100 transition-all"
        >
          Claim Offer
        </a>
      </div>
    </motion.div>
  );
}

// ==================== FINANCING CALCULATOR ====================
function SolarFinancingCalculator() {
  const [systemCost, setSystemCost] = useState(750000);
  const [deposit, setDeposit] = useState(30);
  const [months, setMonths] = useState(12);

  const depositAmount = systemCost * (deposit / 100);
  const financeAmount = systemCost - depositAmount;
  const interestRate = months <= 6 ? 0 : months <= 12 ? 0.05 : 0.10;
  const totalWithInterest = financeAmount * (1 + interestRate);
  const monthlyPayment = totalWithInterest / months;

  return (
    <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-2xl p-8 border border-green-500/30">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        💳 Solar Financing Calculator
      </h3>

      <div className="space-y-6">
        <div>
          <label className="text-gray-300 mb-2 block">System Cost: KES {systemCost.toLocaleString()}</label>
          <input
            type="range"
            min="200000"
            max="5000000"
            step="50000"
            value={systemCost}
            onChange={(e) => setSystemCost(Number(e.target.value))}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>KES 200K</span>
            <span>KES 5M</span>
          </div>
        </div>

        <div>
          <label className="text-gray-300 mb-2 block">Deposit: {deposit}% (KES {depositAmount.toLocaleString()})</label>
          <input
            type="range"
            min="20"
            max="70"
            step="5"
            value={deposit}
            onChange={(e) => setDeposit(Number(e.target.value))}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>20%</span>
            <span>70%</span>
          </div>
        </div>

        <div>
          <label className="text-gray-300 mb-2 block">Payment Period: {months} months</label>
          <input
            type="range"
            min="3"
            max="24"
            step="3"
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>3 months</span>
            <span>24 months</span>
          </div>
        </div>

        <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/30">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Deposit Required</p>
              <p className="text-2xl font-bold text-green-400">KES {depositAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Monthly Payment</p>
              <p className="text-2xl font-bold text-amber-400">KES {Math.round(monthlyPayment).toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-green-500/20">
            <p className="text-gray-400 text-sm">
              {months <= 6 ? '0% Interest' : months <= 12 ? '5% Interest' : '10% Interest'} •
              Total: KES {Math.round(depositAmount + totalWithInterest).toLocaleString()}
            </p>
          </div>
        </div>

        <a
          href={`https://wa.me/254768860665?text=Solar%20Financing%20Inquiry:%20KES%20${systemCost.toLocaleString()}%20system,%20${deposit}%25%20deposit,%20${months}%20months`}
          className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center py-4 rounded-xl font-bold hover:from-green-400 hover:to-emerald-500 transition-all"
        >
          Apply for Financing →
        </a>
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function SolarBible() {
  const [selectedSystem, setSelectedSystem] = useState(SOLAR_SYSTEMS[0]);
  const [selectedLocation, setSelectedLocation] = useState('nairobi');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const tabs = [
    { id: 'quotation', label: 'AI Quotation', icon: '🤖', badge: 'NEW!' },
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'monitoring', label: 'Monitor App', icon: '📱', badge: 'AI' },
    { id: 'calculator', label: 'System Calculator', icon: '🧮' },
    { id: 'equipment', label: 'Equipment DB', icon: '🔌', badge: `${TOTAL_EQUIPMENT}+` },
    { id: 'wiring', label: 'Wiring Diagrams', icon: '⚡' },
    { id: 'repair', label: 'Repair Guides', icon: '🔧' },
    { id: 'faults', label: 'Fault Codes', icon: '⚠️' },
    { id: 'roi', label: 'ROI Calculator', icon: '💰' },
    { id: 'shop', label: 'Shop', icon: '🛒' },
    { id: 'booking', label: 'Book Installation', icon: '📅' },
    { id: 'maintenance', label: 'Maintenance', icon: '🗓️' },
    { id: 'education', label: 'Learn', icon: '📚' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black">
      {/* Urgency Banner */}
      <UrgencyBanner />

      {/* ==================== CINEMATIC HERO ==================== */}
      <motion.section
        style={{ opacity: heroOpacity }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-black to-orange-900/20" />
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-amber-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Sun rays effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-amber-500/20 via-transparent to-transparent rounded-full blur-3xl" />

        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-sm mb-8">
              ☀️ Kenya's Most Comprehensive Solar Resource
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
          >
            <span className="text-white">The </span>
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">Solar Bible</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto"
          >
            Your complete guide to solar energy in Kenya. From sizing calculators to installation,
            maintenance to financing — everything you need to harness the power of the sun.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <a
              href="#pricing"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-full hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg shadow-amber-500/25"
            >
              View Solar Pricing
            </a>
            <a
              href="https://wa.me/254768860665?text=I%20want%20a%20free%20solar%20site%20survey"
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold rounded-full hover:bg-white/20 transition-all"
            >
              Free Site Survey
            </a>
            <Link
              href="/solutions/solar-sizing"
              className="px-8 py-4 bg-green-500/20 border border-green-500/50 text-green-400 font-bold rounded-full hover:bg-green-500/30 transition-all"
            >
              Size Your System →
            </Link>
          </motion.div>

          {/* Hero Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <AnimatedCounter end={500} suffix="+" />
              <p className="text-gray-400 text-sm mt-1">Systems Installed</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <AnimatedCounter end={2} suffix="MW+" />
              <p className="text-gray-400 text-sm mt-1">Total Capacity</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <AnimatedCounter end={47} />
              <p className="text-gray-400 text-sm mt-1">Counties Served</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <AnimatedCounter end={98} suffix="%" />
              <p className="text-gray-400 text-sm mt-1">Client Satisfaction</p>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-8 h-12 rounded-full border-2 border-amber-400/50 flex items-start justify-center p-2">
            <motion.div
              className="w-2 h-2 bg-amber-400 rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* ==================== WHY SOLAR IN KENYA ==================== */}
      <section className="py-16 bg-gradient-to-b from-amber-900/10 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Why Solar Energy in <span className="text-amber-400">Kenya?</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Kenya's location on the equator makes it one of the best places in the world for solar energy
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {WHY_SOLAR_KENYA.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-2xl p-6 border border-amber-500/20 text-center"
              >
                <div className="text-5xl font-bold text-amber-400 mb-2">{item.stat}</div>
                <div className="text-lg font-semibold text-white mb-2">{item.label}</div>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TRANSPARENT PRICING ==================== */}
      <section id="pricing" className="py-20 bg-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm mb-6">
              💰 Transparent Pricing
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Solar System <span className="text-amber-400">Pricing</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Real prices. No hidden fees. Know exactly what you're paying before you commit.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOLAR_PRICING.map((pkg, index) => (
              <motion.div
                key={pkg.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl p-6 border transition-all hover:scale-[1.02] ${
                  pkg.popular
                    ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/10 border-amber-500'
                    : 'bg-slate-900/50 border-slate-700 hover:border-amber-500/50'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 text-black text-xs font-bold rounded-full">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{pkg.type}</h3>
                <div className="text-3xl font-bold text-amber-400 mb-1">{pkg.capacity}</div>
                <div className="text-lg text-gray-300 mb-4">
                  KES {pkg.priceFrom.toLocaleString()} - {pkg.priceTo.toLocaleString()}
                </div>
                <p className="text-sm text-gray-400 mb-4">{pkg.ideal}</p>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 uppercase mb-2">Includes:</p>
                  <ul className="space-y-1">
                    {pkg.includes.map(item => (
                      <li key={item} className="text-sm text-gray-300 flex items-center gap-2">
                        <span className="text-green-400">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-green-500/10 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-400">Estimated Monthly Savings:</p>
                  <p className="text-lg font-bold text-green-400">KES {pkg.savings}</p>
                </div>

                <a
                  href={`https://wa.me/254768860665?text=Quote%20Request:%20${pkg.type}%20(${pkg.capacity})`}
                  className="block w-full bg-amber-500 hover:bg-amber-400 text-black text-center py-3 rounded-xl font-bold transition-all"
                >
                  Get Quote
                </a>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            * Prices vary based on site conditions, battery configuration, and specific requirements.
            Contact us for a detailed quotation.
          </p>
        </div>
      </section>

      {/* ==================== BRAND COMPARISON ==================== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Solar Panel <span className="text-amber-400">Brand Comparison</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We only stock Tier-1 panels with proven performance and bankable warranties
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-gray-700 bg-slate-900/50">
                  <th className="text-left p-4 text-amber-400">Brand</th>
                  <th className="text-left p-4 text-gray-400">Origin</th>
                  <th className="text-left p-4 text-gray-400">Efficiency</th>
                  <th className="text-left p-4 text-gray-400">Warranty</th>
                  <th className="text-left p-4 text-gray-400">Tier</th>
                  <th className="text-left p-4 text-gray-400">Price Range</th>
                  <th className="text-left p-4 text-gray-400">Best For</th>
                  <th className="text-left p-4 text-gray-400">Rating</th>
                </tr>
              </thead>
              <tbody>
                {SOLAR_BRANDS.map((brand, index) => (
                  <motion.tr
                    key={brand.name}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-800 hover:bg-slate-900/50"
                  >
                    <td className="p-4 font-semibold text-white">{brand.name}</td>
                    <td className="p-4">{brand.origin}</td>
                    <td className="p-4 text-green-400 font-semibold">{brand.efficiency}</td>
                    <td className="p-4">{brand.warranty}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs">{brand.tier}</span>
                    </td>
                    <td className="p-4">{brand.priceRange}</td>
                    <td className="p-4 text-sm">{brand.bestFor}</td>
                    <td className="p-4">
                      <span className="text-amber-400">{'★'.repeat(Math.floor(brand.rating))}</span>
                      <span className="text-gray-600">{brand.rating}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ==================== BEFORE/AFTER GALLERY ==================== */}
      <section className="py-20 bg-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Real <span className="text-amber-400">Transformations</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              See the impact of solar energy on our clients' operations
            </p>
          </motion.div>

          <div className="space-y-8">
            {SOLAR_PROJECTS.map((project, index) => (
              <motion.div
                key={project.client}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-700"
              >
                <div className="p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/5">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <h3 className="text-2xl font-bold text-white">{project.client}</h3>
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm">
                      {project.type}
                    </span>
                    <span className="text-gray-400">{project.location}</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                      <h4 className="text-red-400 font-semibold mb-2">❌ Before</h4>
                      <p className="text-gray-300">{project.before}</p>
                    </div>
                    <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                      <h4 className="text-green-400 font-semibold mb-2">✓ After</h4>
                      <p className="text-gray-300">{project.after}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-400">{project.stats.panels}</p>
                      <p className="text-gray-500 text-xs">Solar Panels</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-400">{project.stats.capacity}</p>
                      <p className="text-gray-500 text-xs">System Capacity</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">{project.stats.savings}</p>
                      <p className="text-gray-500 text-xs">Energy Savings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-400">{project.stats.payback}</p>
                      <p className="text-gray-500 text-xs">Payback Period</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FINANCING SECTION ==================== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm mb-6">
                  💳 Flexible Financing
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Can't Pay <span className="text-green-400">Upfront?</span> We've Got You.
                </h2>
                <p className="text-gray-400 mb-6">
                  We understand that solar is an investment. That's why we offer flexible payment plans
                  to make clean energy accessible to everyone.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-gray-300">
                    <span className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">✓</span>
                    20-50% deposit, balance over 6-24 months
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <span className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">✓</span>
                    0% interest on 6-month payment plans
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <span className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">✓</span>
                    Asset financing through partner banks
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <span className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">✓</span>
                    Lease-to-own options available
                  </li>
                </ul>
              </motion.div>
            </div>
            <SolarFinancingCalculator />
          </div>
        </div>
      </section>

      {/* ==================== GUARANTEES ==================== */}
      <section className="py-20 bg-gradient-to-b from-green-900/10 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Our <span className="text-green-400">Guarantees</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We stand behind our work with ironclad guarantees
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOLAR_GUARANTEES.map((guarantee, index) => (
              <motion.div
                key={guarantee.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900/50 rounded-2xl p-6 border border-green-500/20 hover:border-green-500/50 transition-all"
              >
                <span className="text-4xl mb-4 block">{guarantee.icon}</span>
                <h3 className="text-xl font-bold text-white mb-2">{guarantee.title}</h3>
                <p className="text-gray-400 text-sm">{guarantee.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FAQ SECTION ==================== */}
      <section className="py-20 bg-black/50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Frequently Asked <span className="text-amber-400">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {SOLAR_FAQ.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-800/50 transition-all"
                >
                  <span className="text-white font-semibold pr-4">{faq.question}</span>
                  <span className={`text-amber-400 transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-gray-400">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== DOWNLOADS SECTION ==================== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-6">
              📥 Free Resources
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Download Our <span className="text-blue-400">Solar Guides</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOLAR_DOWNLOADS.map((download, index) => (
              <motion.div
                key={download.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all group"
              >
                <span className="text-4xl mb-4 block">{download.icon}</span>
                <h3 className="text-lg font-bold text-white mb-2">{download.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{download.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">{download.type} • {download.size}</span>
                  <a
                    href={`https://wa.me/254768860665?text=Please%20send%20me%20the%20${encodeURIComponent(download.title)}`}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium group-hover:underline"
                  >
                    Download →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== MAIN TABS SECTION ==================== */}
      <section className="py-12 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          {/* Location & Weather */}
          <div className="flex items-center gap-4 flex-wrap mb-6">
            <span className="text-slate-400 text-sm">Your Location:</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              {KENYA_LOCATIONS.map(loc => (
                <option key={loc} value={loc.toLowerCase().replace(/[^a-z]/g, '')}>{loc}</option>
              ))}
            </select>
            <div className="hidden lg:flex items-center gap-3">
              <WeatherWidget location={selectedLocation} />
            </div>
          </div>

          {/* System Type Selector */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {SOLAR_SYSTEMS.map(system => (
              <motion.button
                key={system.id}
                onClick={() => setSelectedSystem(system)}
                className={`p-4 rounded-xl border transition-all text-left ${
                  selectedSystem.id === system.id
                    ? 'bg-amber-500/20 border-amber-500 text-white'
                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-2xl mb-2">{system.icon}</div>
                <div className="font-medium text-sm">{system.name}</div>
                <div className="text-xs text-slate-500">{system.capacity}</div>
              </motion.button>
            ))}
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tab.icon} {tab.label}
                {tab.badge && (
                  <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">{tab.badge}</span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Selected System Details */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{selectedSystem.icon}</div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedSystem.name}</h2>
                      <p className="text-slate-400 mb-4">{selectedSystem.description}</p>
                      <div className="text-amber-400 font-medium">Typical Capacity: {selectedSystem.capacity}</div>
                    </div>
                  </div>
                </div>

                {/* Components & Tasks */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">📦 System Components</h3>
                    <ul className="space-y-2">
                      {selectedSystem.components.map((comp, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-300">
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                          {comp}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">🔧 Maintenance Tasks</h3>
                    <ul className="space-y-2">
                      {selectedSystem.maintenanceTasks.map((task, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-300">
                          <span className="text-green-400">✓</span>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Gallery */}
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    ☀️ Our Solar Installations
                  </h3>
                  <CinematicImageGallery
                    images={heroGalleryImages}
                    layout="carousel"
                    showCaptions={true}
                    enableLightbox={true}
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'shop' && (
              <motion.div
                key="shop"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <SolarProductsShop />
              </motion.div>
            )}

            {activeTab === 'calculator' && (
              <motion.div
                key="calculator"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <SolarBibleEngine />
              </motion.div>
            )}

            {activeTab === 'roi' && (
              <motion.div
                key="roi"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <SolarROICalculator />
              </motion.div>
            )}

            {activeTab === 'booking' && (
              <motion.div
                key="booking"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <SolarInstallationBooking />
              </motion.div>
            )}

            {activeTab === 'faults' && (
              <motion.div
                key="faults"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold text-white mb-4">⚠️ Common Solar System Faults</h2>
                {SOLAR_FAULTS.map(fault => (
                  <div key={fault.code} className={`bg-slate-800/50 border rounded-xl p-6 ${
                    fault.severity === 'critical' ? 'border-red-500/50' : 'border-yellow-500/50'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`px-3 py-1 rounded-lg text-sm font-mono ${
                        fault.severity === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {fault.code}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-2">{fault.title}</h3>
                        <p className="text-slate-400 mb-4">{fault.description}</p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-slate-300 mb-2">Possible Causes:</h4>
                            <ul className="space-y-1">
                              {fault.causes.map((cause, i) => (
                                <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                                  <span className="text-red-400">•</span> {cause}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-slate-300 mb-2">Solutions:</h4>
                            <ul className="space-y-1">
                              {fault.solutions.map((sol, i) => (
                                <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                                  <span className="text-green-400">✓</span> {sol}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'maintenance' && (
              <motion.div
                key="maintenance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <SolarMaintenanceHub />
              </motion.div>
            )}

            {activeTab === 'education' && (
              <motion.div
                key="education"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold text-white mb-4">📚 Solar Education Center</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {SOLAR_EDUCATION.map((topic, i) => (
                    <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 transition-all">
                      <div className="text-3xl mb-3">{topic.icon}</div>
                      <h3 className="text-lg font-bold text-white mb-2">{topic.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{topic.content}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ==================== SOLAR MONITORING APP TAB ==================== */}
            {activeTab === 'monitoring' && (
              <motion.div
                key="monitoring"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <SolarMonitoringApp />
              </motion.div>
            )}

            {/* ==================== EQUIPMENT DATABASE TAB ==================== */}
            {activeTab === 'equipment' && (
              <motion.div
                key="equipment"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">🔋 Solar Equipment Database</h2>
                  <p className="text-amber-400 text-lg">1000+ Products with Full Specifications & Pricing</p>
                  <p className="text-gray-500 text-sm mt-2">The most comprehensive solar equipment database in East Africa</p>
                </div>

                {/* Solar Panels Database */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-amber-400 mb-4">☀️ Solar Panels ({SOLAR_PANELS_DATABASE.length} Models)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700 text-left">
                          <th className="p-3 text-amber-400">Brand</th>
                          <th className="p-3 text-amber-400">Model</th>
                          <th className="p-3 text-amber-400">Wattage</th>
                          <th className="p-3 text-amber-400">Efficiency</th>
                          <th className="p-3 text-amber-400">Type</th>
                          <th className="p-3 text-amber-400">Vmp</th>
                          <th className="p-3 text-amber-400">Imp</th>
                          <th className="p-3 text-amber-400">Warranty</th>
                          <th className="p-3 text-amber-400">Price (KES)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SOLAR_PANELS_DATABASE.map((panel, i) => (
                          <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50">
                            <td className="p-3 text-white font-semibold">{panel.brand}</td>
                            <td className="p-3 text-gray-300">{panel.model}</td>
                            <td className="p-3 text-green-400 font-bold">{panel.wattage}W</td>
                            <td className="p-3 text-blue-400">{panel.efficiency}%</td>
                            <td className="p-3 text-purple-400">{panel.type}</td>
                            <td className="p-3 text-gray-400">{panel.vmp}V</td>
                            <td className="p-3 text-gray-400">{panel.imp}A</td>
                            <td className="p-3 text-gray-400">{panel.warranty.product}yr/{panel.warranty.performance}yr</td>
                            <td className="p-3 text-amber-400 font-bold">{panel.priceKES.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Inverters Database */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-blue-400 mb-4">⚡ Inverters ({INVERTERS_DATABASE.length} Models)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700 text-left">
                          <th className="p-3 text-blue-400">Brand</th>
                          <th className="p-3 text-blue-400">Model</th>
                          <th className="p-3 text-blue-400">Capacity</th>
                          <th className="p-3 text-blue-400">Type</th>
                          <th className="p-3 text-blue-400">MPPT</th>
                          <th className="p-3 text-blue-400">Max PV</th>
                          <th className="p-3 text-blue-400">Battery V</th>
                          <th className="p-3 text-blue-400">Efficiency</th>
                          <th className="p-3 text-blue-400">Price (KES)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {INVERTERS_DATABASE.map((inv, i) => (
                          <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50">
                            <td className="p-3 text-white font-semibold">{inv.brand}</td>
                            <td className="p-3 text-gray-300">{inv.model}</td>
                            <td className="p-3 text-green-400 font-bold">{(inv.ratedPower / 1000).toFixed(1)}kW</td>
                            <td className="p-3 text-purple-400">{inv.type}</td>
                            <td className="p-3 text-amber-400">{inv.mpptChannels}x MPPT</td>
                            <td className="p-3 text-gray-400">{(inv.maxDCPower / 1000).toFixed(1)}kW</td>
                            <td className="p-3 text-gray-400">{inv.batteryVoltage || 'N/A'}V</td>
                            <td className="p-3 text-blue-400">{inv.efficiency}%</td>
                            <td className="p-3 text-amber-400 font-bold">{inv.priceKES.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Batteries Database */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-green-400 mb-4">🔋 Batteries ({BATTERIES_DATABASE.length} Models)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700 text-left">
                          <th className="p-3 text-green-400">Brand</th>
                          <th className="p-3 text-green-400">Model</th>
                          <th className="p-3 text-green-400">Capacity</th>
                          <th className="p-3 text-green-400">Voltage</th>
                          <th className="p-3 text-green-400">Type</th>
                          <th className="p-3 text-green-400">DoD</th>
                          <th className="p-3 text-green-400">Cycles</th>
                          <th className="p-3 text-green-400">Warranty</th>
                          <th className="p-3 text-green-400">Price (KES)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {BATTERIES_DATABASE.map((bat, i) => (
                          <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50">
                            <td className="p-3 text-white font-semibold">{bat.brand}</td>
                            <td className="p-3 text-gray-300">{bat.model}</td>
                            <td className="p-3 text-green-400 font-bold">{bat.capacity}Ah</td>
                            <td className="p-3 text-amber-400">{bat.nominalVoltage}V</td>
                            <td className="p-3 text-purple-400">{bat.type}</td>
                            <td className="p-3 text-blue-400">{bat.maxDoD}%</td>
                            <td className="p-3 text-gray-400">{bat.cycleLife.toLocaleString()}</td>
                            <td className="p-3 text-gray-400">{bat.warranty}yr</td>
                            <td className="p-3 text-amber-400 font-bold">{bat.priceKES.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Cable Specifications */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-orange-400 mb-4">🔌 Cable Sizing Guide</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700 text-left">
                          <th className="p-3 text-orange-400">Size (mm²)</th>
                          <th className="p-3 text-orange-400">Max DC (A)</th>
                          <th className="p-3 text-orange-400">Max AC (A)</th>
                          <th className="p-3 text-orange-400">Resistance (Ω/km)</th>
                          <th className="p-3 text-orange-400">Voltage</th>
                          <th className="p-3 text-orange-400">Application</th>
                          <th className="p-3 text-orange-400">Price/m (KES)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {CABLE_SPECIFICATIONS.map((cable, i) => (
                          <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50">
                            <td className="p-3 text-white font-bold">{cable.crossSection} mm²</td>
                            <td className="p-3 text-green-400 font-bold">{cable.maxCurrentDC}A</td>
                            <td className="p-3 text-blue-400">{cable.maxCurrentAC}A</td>
                            <td className="p-3 text-gray-400">{cable.resistancePerKm}</td>
                            <td className="p-3 text-amber-400">{cable.voltageRating}V</td>
                            <td className="p-3 text-purple-400">{cable.application.join(', ')}</td>
                            <td className="p-3 text-amber-400">{cable.pricePerMeterKES}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ==================== WIRING DIAGRAMS TAB ==================== */}
            {activeTab === 'wiring' && (
              <motion.div
                key="wiring"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">📐 Solar Wiring Diagrams</h2>
                  <p className="text-amber-400 text-lg">Professional ASCII Diagrams with Cable Sizing</p>
                  <p className="text-gray-500 text-sm mt-2">Complete wiring reference for solar installations</p>
                </div>

                {/* System Wiring Diagrams */}
                {WIRING_DIAGRAMS.map((diagram, i) => (
                  <div key={i} className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">
                        {diagram.systemType === 'Off-Grid' ? '🏠' :
                         diagram.systemType === 'Grid-Tied' ? '⚡' :
                         diagram.systemType === 'Hybrid' ? '🔄' :
                         diagram.systemType === 'Solar Pump' ? '💧' : '🔌'}
                      </span>
                      <div>
                        <h3 className="text-xl font-bold text-amber-400">{diagram.title}</h3>
                        <p className="text-gray-500 text-sm">{diagram.description}</p>
                        <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded mt-1 inline-block">{diagram.systemSize}</span>
                      </div>
                    </div>

                    {/* ASCII Diagram */}
                    <div className="bg-black rounded-xl p-4 mb-4 overflow-x-auto">
                      <pre className="text-green-400 text-xs font-mono whitespace-pre">{diagram.diagram}</pre>
                    </div>

                    {/* Components */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-slate-800/50 rounded-xl p-4">
                        <h4 className="text-white font-bold mb-2">Components Used:</h4>
                        <ul className="space-y-1">
                          {diagram.components.map((comp, j) => (
                            <li key={j} className="text-gray-300 text-sm flex items-start gap-2">
                              <span className="text-green-400">•</span>
                              <span><strong>{comp.quantity}×</strong> {comp.name} - {comp.specifications}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-slate-800/50 rounded-xl p-4">
                        <h4 className="text-white font-bold mb-2">Protection Devices:</h4>
                        <ul className="space-y-1">
                          {diagram.protectionDevices.map((device, j) => (
                            <li key={j} className="text-gray-300 text-sm flex items-center gap-2">
                              <span className="text-amber-400">⚡</span> {device.device}: {device.rating} ({device.location})
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Cable Sizing Table */}
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <h4 className="text-white font-bold mb-2">Cable Sizing:</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-700 text-left">
                              <th className="p-2 text-amber-400">Segment</th>
                              <th className="p-2 text-amber-400">Cable Size</th>
                              <th className="p-2 text-amber-400">Length</th>
                              <th className="p-2 text-amber-400">Color</th>
                            </tr>
                          </thead>
                          <tbody>
                            {diagram.cableSizing.map((cable, j) => (
                              <tr key={j} className="border-b border-slate-800">
                                <td className="p-2 text-white">{cable.segment}</td>
                                <td className="p-2 text-green-400 font-bold">{cable.cableSize}</td>
                                <td className="p-2 text-gray-400">{cable.length}</td>
                                <td className="p-2 text-blue-400">{cable.color}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Common Connection Patterns */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-blue-400 mb-4">🔗 Common Connection Patterns</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-black rounded-xl p-4">
                      <h4 className="text-amber-400 font-bold mb-2">Series Connection</h4>
                      <pre className="text-green-400 text-xs font-mono whitespace-pre">{COMMON_CONNECTION_PATTERNS.seriesConnection}</pre>
                    </div>
                    <div className="bg-black rounded-xl p-4">
                      <h4 className="text-amber-400 font-bold mb-2">Parallel Connection</h4>
                      <pre className="text-green-400 text-xs font-mono whitespace-pre">{COMMON_CONNECTION_PATTERNS.parallelConnection}</pre>
                    </div>
                    <div className="bg-black rounded-xl p-4">
                      <h4 className="text-amber-400 font-bold mb-2">MC4 Connector Assembly</h4>
                      <pre className="text-green-400 text-xs font-mono whitespace-pre">{COMMON_CONNECTION_PATTERNS.mc4Connection}</pre>
                    </div>
                    <div className="bg-black rounded-xl p-4">
                      <h4 className="text-amber-400 font-bold mb-2">48V Battery Bank (4×12V)</h4>
                      <pre className="text-green-400 text-xs font-mono whitespace-pre">{COMMON_CONNECTION_PATTERNS.batteryBankWiring}</pre>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ==================== REPAIR GUIDES TAB ==================== */}
            {activeTab === 'repair' && (
              <motion.div
                key="repair"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">🔧 Step-by-Step Repair Guides</h2>
                  <p className="text-amber-400 text-lg">Professional Maintenance & Troubleshooting</p>
                  <p className="text-gray-500 text-sm mt-2">{ALL_MAINTENANCE_GUIDES.length} comprehensive guides for panels, inverters, batteries & wiring</p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {['All', 'panel', 'inverter', 'battery', 'wiring', 'system'].map((cat) => (
                    <button
                      key={cat}
                      className="px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-gray-300 hover:border-amber-500 hover:text-amber-400 transition-all text-sm capitalize"
                    >
                      {cat === 'All' ? `All (${ALL_MAINTENANCE_GUIDES.length})` : cat}
                    </button>
                  ))}
                </div>

                {/* Guides List */}
                <div className="space-y-4">
                  {ALL_MAINTENANCE_GUIDES.map((guide, i) => (
                    <details key={i} className="bg-slate-900/50 border border-slate-700 rounded-2xl overflow-hidden group">
                      <summary className="p-6 cursor-pointer hover:bg-slate-800/50 transition-all flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">
                            {guide.category === 'Panel' ? '☀️' :
                             guide.category === 'Inverter' ? '⚡' :
                             guide.category === 'Battery' ? '🔋' :
                             guide.category === 'Wiring' ? '🔌' :
                             guide.category === 'Controller' ? '🎛️' : '🔧'}
                          </span>
                          <div>
                            <h3 className="text-lg font-bold text-white">{guide.title}</h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                guide.difficulty === 'Basic' ? 'bg-green-500/20 text-green-400' :
                                guide.difficulty === 'Intermediate' ? 'bg-amber-500/20 text-amber-400' :
                                guide.difficulty === 'Advanced' ? 'bg-orange-500/20 text-orange-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {guide.difficulty}
                              </span>
                              <span className="text-gray-500 text-sm">⏱ {guide.estimatedTime}</span>
                              <span className="text-purple-400 text-xs px-2 py-0.5 bg-purple-500/20 rounded">{guide.category}</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-amber-400 group-open:rotate-180 transition-transform">▼</span>
                      </summary>

                      <div className="px-6 pb-6 space-y-4">
                        {/* Safety Warnings */}
                        {guide.safetyWarnings && guide.safetyWarnings.length > 0 && (
                          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                            <h4 className="text-red-400 font-bold mb-2">⚠️ Safety Warnings</h4>
                            <ul className="space-y-1">
                              {guide.safetyWarnings.map((warning, j) => (
                                <li key={j} className="text-red-300 text-sm flex items-start gap-2">
                                  <span>•</span> {warning}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Tools Required */}
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                          <h4 className="text-blue-400 font-bold mb-2">🔧 Tools Required</h4>
                          <div className="flex flex-wrap gap-2">
                            {guide.tools.map((tool, j) => (
                              <span key={j} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">{tool}</span>
                            ))}
                          </div>
                        </div>

                        {/* Step-by-Step Instructions */}
                        <div className="bg-slate-800/50 rounded-xl p-4">
                          <h4 className="text-amber-400 font-bold mb-4">📋 Step-by-Step Instructions</h4>
                          <div className="space-y-3">
                            {guide.steps.map((step, j) => (
                              <div key={j} className="flex gap-4 p-3 bg-black/30 rounded-lg">
                                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold shrink-0">
                                  {step.stepNumber}
                                </div>
                                <div className="flex-1">
                                  <p className="text-white font-semibold">{step.title}</p>
                                  <p className="text-gray-400 text-sm mt-1">{step.description}</p>
                                  {step.warnings && step.warnings.length > 0 && step.warnings.map((warning, k) => (
                                    <p key={k} className="text-red-400 text-sm mt-1">⚠️ {warning}</p>
                                  ))}
                                  {step.tips && step.tips.length > 0 && step.tips.map((tip, k) => (
                                    <p key={k} className="text-green-400 text-sm mt-1">💡 {tip}</p>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Troubleshooting */}
                        {guide.troubleshooting && guide.troubleshooting.length > 0 && (
                          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                            <h4 className="text-purple-400 font-bold mb-2">🔍 Troubleshooting</h4>
                            <div className="space-y-2">
                              {guide.troubleshooting.map((item, j) => (
                                <div key={j} className="bg-black/30 rounded-lg p-3">
                                  <p className="text-red-300 text-sm"><strong>Symptom:</strong> {item.symptom}</p>
                                  <p className="text-amber-300 text-sm mt-1"><strong>Causes:</strong> {item.causes.join(', ')}</p>
                                  <p className="text-green-300 text-sm mt-1"><strong>Solutions:</strong> {item.solutions.join('; ')}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </details>
                  ))}
                </div>

                {/* Inverter Fault Codes Reference */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 mt-8">
                  <h3 className="text-2xl font-bold text-red-400 mb-4">⚠️ Inverter Fault Code Reference</h3>
                  <p className="text-gray-400 mb-4">Quick reference for common inverter error codes across major brands</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700 text-left">
                          <th className="p-3 text-red-400">Brand</th>
                          <th className="p-3 text-red-400">Code</th>
                          <th className="p-3 text-red-400">Description</th>
                          <th className="p-3 text-red-400">Severity</th>
                          <th className="p-3 text-red-400">Solution</th>
                        </tr>
                      </thead>
                      <tbody>
                        {INVERTER_FAULT_CODES.slice(0, 20).map((fault, i) => (
                          <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50">
                            <td className="p-3 text-white font-semibold">{fault.brand}</td>
                            <td className="p-3 text-amber-400 font-mono">{fault.code}</td>
                            <td className="p-3 text-gray-300">{fault.description}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                fault.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                                fault.severity === 'Error' ? 'bg-orange-500/20 text-orange-400' :
                                fault.severity === 'Warning' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                                {fault.severity}
                              </span>
                            </td>
                            <td className="p-3 text-green-400 text-sm">{fault.solutions.join('; ')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ==================== AI QUOTATION SYSTEM TAB ==================== */}
            {activeTab === 'quotation' && (
              <motion.div
                key="quotation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AIQuotationSystem />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="py-20 bg-gradient-to-r from-amber-600 via-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Harness the Power of the Sun?
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            Join 500+ satisfied clients across Kenya. Get your free site survey today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/254768860665?text=I%20want%20a%20free%20solar%20site%20survey"
              className="px-8 py-4 bg-white text-orange-600 font-bold rounded-full hover:bg-amber-100 transition-all shadow-lg"
            >
              📞 Get Free Site Survey
            </a>
            <a
              href="tel:+254768860665"
              className="px-8 py-4 bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-full hover:bg-white/30 transition-all"
            >
              Call +254 768 860 665
            </a>
          </div>
          <p className="text-amber-200 text-sm mt-6">
            M-Pesa Payment: 0768860665 | Mon-Sat 8AM-6PM
          </p>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-black border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">Solar Solutions</h4>
              <ul className="space-y-2">
                <li><Link href="/solutions/solar" className="text-gray-400 hover:text-amber-400">Solar Installation</Link></li>
                <li><Link href="/solutions/solar-sizing" className="text-gray-400 hover:text-amber-400">System Sizing</Link></li>
                <li><Link href="/maintenance-hub/solar" className="text-gray-400 hover:text-amber-400">Solar Maintenance</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Generator Solutions</h4>
              <ul className="space-y-2">
                <li><Link href="/generators" className="text-gray-400 hover:text-amber-400">Generator Bible</Link></li>
                <li><Link href="/generator-oracle" className="text-gray-400 hover:text-amber-400">Generator Oracle</Link></li>
                <li><Link href="/generators/spare-parts" className="text-gray-400 hover:text-amber-400">Spare Parts</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/case-studies" className="text-gray-400 hover:text-amber-400">Case Studies</Link></li>
                <li><Link href="/calculators" className="text-gray-400 hover:text-amber-400">Calculators</Link></li>
                <li><Link href="/maintenance-hub" className="text-gray-400 hover:text-amber-400">Maintenance Hub</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">📞 +254 768 860 665</li>
                <li className="text-gray-400">📞 +254 793 573 208</li>
                <li className="text-gray-400">📧 info@emersoneims.com</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-500 text-sm">
              © 2026 Emerson Industrial Maintenance Services Limited. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <FloatingWhatsApp />
    </div>
  );
}
