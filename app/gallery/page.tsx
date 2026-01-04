'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Project gallery categories and images - REAL EMERSON EIMS PROJECTS
const GALLERY_DATA = {
  categories: [
    { id: 'all', name: 'All Projects', icon: '📁' },
    { id: 'generators', name: 'Generator Installations', icon: '⚡' },
    { id: 'solar', name: 'Solar Projects', icon: '☀️' },
    { id: 'ups', name: 'UPS Systems', icon: '🔋' },
    { id: 'electrical', name: 'Electrical Works', icon: '🔌' },
    { id: 'maintenance', name: 'Maintenance & Repairs', icon: '🔧' },
    { id: 'fabrication', name: 'Fabrication', icon: '🏭' },
    { id: 'hvac', name: 'HVAC Systems', icon: '❄️' },
    { id: 'water', name: 'Water & Pumps', icon: '💧' }
  ],
  projects: [
    // ========== GENERATOR INSTALLATIONS ==========
    {
      id: 1,
      category: 'generators',
      title: 'St. Austin Academy - 50kVA Perkins',
      location: 'Nairobi, Kenya',
      description: 'Complete installation of 50kVA Massey Ferguson generator with Perkins engine, DeepSea controller and automatic transfer switch.',
      image: '/images/ST-AUSTIN-4K-CINEMATIC.jpg',
      year: 2024,
      highlights: ['50kVA Perkins', 'DeepSea Controller', 'ATS Integration', '5-Year Contract']
    },
    {
      id: 2,
      category: 'generators',
      title: 'Kivukoni School - 60kVA Cummins',
      location: 'Nairobi, Kenya',
      description: 'Installation of 60kVA Cummins generator with hybrid solar-diesel capability for boarding school operations.',
      image: '/images/KIVUKONI-4K-CINEMATIC.jpg',
      year: 2024,
      highlights: ['60kVA Cummins', 'Hybrid Solar-Diesel', '24/7 Monitoring', '100% Reliability']
    },
    {
      id: 3,
      category: 'generators',
      title: 'Bigot Flowers - 300kVA Caterpillar',
      location: 'Naivasha, Kenya',
      description: 'Primary 300kVA Caterpillar generator with redundant backup system and automated failover for flower farm cold storage.',
      image: '/images/BIGOT-FLOWERS-4K-CINEMATIC.jpg',
      year: 2024,
      highlights: ['300kVA CAT', 'Automated Failover', 'Cold Storage Power', 'Remote Monitoring']
    },
    {
      id: 4,
      category: 'generators',
      title: 'Greenheart Kilifi - 44kVA Cummins Voltka',
      location: 'Kilifi, Kenya',
      description: 'Resort generator installation with 44kVA Cummins Voltka, load management and resort systems integration.',
      image: '/images/GREENHEART-KILIFI-4K-CINEMATIC.jpg',
      year: 2024,
      highlights: ['44kVA Cummins Voltka', 'Load Management', 'Resort Integration', '30% Cost Reduction']
    },
    {
      id: 5,
      category: 'generators',
      title: 'NTSA Headquarters - 300kVA Atlas Copco',
      location: 'Nairobi, Kenya',
      description: 'Government critical operations power with 300kVA Atlas Copco generator, redundant system and real-time monitoring.',
      image: '/images/NTSA-4K-CINEMATIC.jpg',
      year: 2024,
      highlights: ['300kVA Atlas Copco', 'Government Compliance', 'Real-time Dashboard', 'Predictive Maintenance']
    },
    {
      id: 6,
      category: 'generators',
      title: 'Sanergy Limited - 250kVA FG Wilson',
      location: 'Nairobi, Kenya',
      description: '250kVA FG Wilson generator with Perkins engine for waste processing facility continuous operations.',
      image: '/images/SANERGY-FG-WILSON-4K-CINEMATIC.jpg',
      year: 2024,
      highlights: ['250kVA FG Wilson', 'Perkins Engine', '95% Downtime Reduction', 'KSh 1.8M Annual Savings']
    },
    {
      id: 7,
      category: 'generators',
      title: 'Industrial Generator Setup',
      location: 'Industrial Area, Nairobi',
      description: 'Heavy-duty diesel generator installation for manufacturing facility with automatic changeover.',
      image: '/images/tnpl-diesal-generator-1000x1000-1920x1080.webp',
      year: 2024,
      highlights: ['Heavy Duty', 'Auto Changeover', 'Industrial Grade', 'Remote Monitoring']
    },
    {
      id: 8,
      category: 'generators',
      title: 'Commercial Generator Installation',
      location: 'Westlands, Nairobi',
      description: 'Commercial backup power solution with sound-attenuated enclosure and automatic transfer switch.',
      image: '/images/GEN 2-1920x1080.png',
      year: 2024,
      highlights: ['Sound Attenuated', 'ATS Integration', 'Commercial Grade', 'Warranty Included']
    },
    {
      id: 9,
      category: 'generators',
      title: 'Generator Canopy Fabrication',
      location: 'Various Locations',
      description: 'Custom weatherproof canopy fabrication and installation for outdoor generator protection.',
      image: '/images/generator-canopy-fabrication.png',
      year: 2024,
      highlights: ['Weatherproof', 'Custom Design', 'Steel Construction', 'Powder Coated']
    },
    // ========== SOLAR PROJECTS ==========
    {
      id: 10,
      category: 'solar',
      title: 'Solar Power for Flower Farms',
      location: 'Naivasha, Kenya',
      description: 'Large-scale solar installation for flower farm irrigation and cold storage, reducing electricity bills by 70%.',
      image: '/images/solar for flower farms.png',
      year: 2024,
      highlights: ['Agricultural Solar', '70% Bill Reduction', 'Irrigation Power', 'Net Metering']
    },
    {
      id: 11,
      category: 'solar',
      title: 'Solar Hotel Water Heaters',
      location: 'Multiple Locations',
      description: 'Commercial solar water heating systems for hotels and resorts across Kenya.',
      image: '/images/solar hotel heaters.png',
      year: 2024,
      highlights: ['Hot Water System', 'Hotel Grade', '80% Energy Savings', '10-Year Warranty']
    },
    {
      id: 12,
      category: 'solar',
      title: 'Solar Power Farm Installation',
      location: 'Turkana, Kenya',
      description: 'Off-grid solar farm powering agricultural operations and community facilities.',
      image: '/images/solar power farms.png',
      year: 2024,
      highlights: ['Off-Grid System', 'Battery Storage', 'Community Power', 'Sustainable']
    },
    {
      id: 13,
      category: 'solar',
      title: 'Farm Solar Power Systems',
      location: 'Various Counties',
      description: 'Solar installations for dairy farms, poultry farms, and greenhouse operations.',
      image: '/images/solar power for farms.png',
      year: 2024,
      highlights: ['Farm Operations', 'Dairy Cooling', 'Greenhouse Power', 'Cost Effective']
    },
    {
      id: 14,
      category: 'solar',
      title: 'Solar Changeover Control',
      location: 'Nairobi, Kenya',
      description: 'Intelligent solar-grid changeover systems with automatic switching and monitoring.',
      image: '/images/solar changeover control.png',
      year: 2024,
      highlights: ['Auto Changeover', 'Smart Control', 'Grid Integration', 'LCD Display']
    },
    {
      id: 15,
      category: 'solar',
      title: 'Solar Water Pumping System',
      location: 'Machakos, Kenya',
      description: 'Solar-powered borehole pumping systems for agricultural and residential water supply.',
      image: '/images/solar-water-pumping.png',
      year: 2024,
      highlights: ['Borehole Pump', 'No Fuel Costs', '25-Year Lifespan', 'Remote Areas']
    },
    // ========== UPS SYSTEMS ==========
    {
      id: 16,
      category: 'ups',
      title: 'UPS Power Protection System',
      location: 'CBD, Nairobi',
      description: 'Enterprise-grade UPS installation for data center with N+1 redundancy.',
      image: '/images/ups-power-protection-system.png',
      year: 2024,
      highlights: ['Enterprise Grade', 'N+1 Redundancy', '30 Min Runtime', 'Hot-Swappable']
    },
    {
      id: 17,
      category: 'ups',
      title: 'UPS Battery Bank Installation',
      location: 'Upper Hill, Nairobi',
      description: 'Large-scale battery bank installation for extended UPS runtime in commercial building.',
      image: '/images/ups-battery-bank.png',
      year: 2024,
      highlights: ['Extended Runtime', 'Lithium Batteries', 'Smart BMS', 'Scalable']
    },
    {
      id: 18,
      category: 'ups',
      title: 'UPS Control Panel',
      location: 'Industrial Area',
      description: 'Custom UPS control panel with monitoring, automatic bypass, and maintenance features.',
      image: '/images/ups-control-panel.png',
      year: 2024,
      highlights: ['Touch Display', 'Auto Bypass', 'Remote Access', 'SNMP Enabled']
    },
    {
      id: 19,
      category: 'ups',
      title: 'Rack Mount UPS Systems',
      location: 'Multiple Data Centers',
      description: 'Rack-mounted UPS deployment for server rooms and network equipment protection.',
      image: '/images/ups-rack-mount.png',
      year: 2024,
      highlights: ['Rack Mount', 'Server Protection', 'Network Grade', 'Compact Design']
    },
    // ========== ELECTRICAL WORKS ==========
    {
      id: 20,
      category: 'electrical',
      title: 'Power Distribution Board',
      location: 'Mombasa, Kenya',
      description: 'Industrial power distribution board installation with circuit protection and metering.',
      image: '/images/power-distribution-board.png',
      year: 2024,
      highlights: ['Industrial Grade', 'Circuit Protection', 'Digital Metering', 'IP65 Rated']
    },
    {
      id: 21,
      category: 'electrical',
      title: 'Switchgear Panel Installation',
      location: 'Athi River',
      description: 'Medium voltage switchgear panel for manufacturing plant power distribution.',
      image: '/images/switchgear-panel.png',
      year: 2024,
      highlights: ['Medium Voltage', 'Factory Power', 'Safety Interlocks', 'Arc Flash Protection']
    },
    {
      id: 22,
      category: 'electrical',
      title: 'High Voltage Transformer',
      location: 'Industrial Area, Nairobi',
      description: 'High voltage transformer installation and commissioning for industrial facility.',
      image: '/images/high-voltage-transformer.png',
      year: 2024,
      highlights: ['11kV/415V', 'KPLC Approved', 'Oil Cooled', 'Surge Protection']
    },
    {
      id: 23,
      category: 'electrical',
      title: 'Custom Control Panel',
      location: 'Various Locations',
      description: 'Custom electrical control panels for industrial automation and process control.',
      image: '/images/custom-control-panel.png',
      year: 2024,
      highlights: ['PLC Controlled', 'HMI Interface', 'VFD Integration', 'SCADA Ready']
    },
    // ========== MAINTENANCE & REPAIRS ==========
    {
      id: 24,
      category: 'maintenance',
      title: 'Generator Parts Supply',
      location: 'Nationwide Kenya',
      description: 'Genuine Perkins, Cummins, and CAT engine parts for generator maintenance and repair.',
      image: '/images/PERKINS-ENGINE-PARTS.jpg',
      year: 2024,
      highlights: ['Genuine Parts', 'All Brands', 'Same-Day Delivery', 'Warranty Included']
    },
    {
      id: 25,
      category: 'maintenance',
      title: 'Perkins Filter Service',
      location: 'Various Locations',
      description: 'Scheduled filter replacement and maintenance service for Perkins engines.',
      image: '/images/PERKINS FILTER 2 (1).webp',
      year: 2024,
      highlights: ['OEM Filters', 'Scheduled Service', '500-Hour Intervals', 'Engine Protection']
    },
    {
      id: 26,
      category: 'maintenance',
      title: 'Engine Parts Overhaul',
      location: 'Workshop, Nairobi',
      description: 'Complete engine overhaul services with genuine parts and factory specifications.',
      image: '/images/ENGINE PARTS.png',
      year: 2024,
      highlights: ['Complete Overhaul', 'Factory Specs', 'Quality Guarantee', 'Extended Life']
    },
    {
      id: 27,
      category: 'maintenance',
      title: 'Electric Motor Repair',
      location: 'Nairobi Workshop',
      description: 'Professional electric motor rewinding, bearing replacement, and diagnostics.',
      image: '/images/electric-motor-repair.png',
      year: 2024,
      highlights: ['Motor Rewinding', 'Bearing Service', 'Balancing', 'Testing']
    },
    {
      id: 28,
      category: 'maintenance',
      title: 'Motor Diagnostics Testing',
      location: 'Various Sites',
      description: 'Comprehensive motor testing and diagnostics using advanced equipment.',
      image: '/images/motor-diagnostics-testing.png',
      year: 2024,
      highlights: ['Megger Testing', 'Vibration Analysis', 'Thermal Imaging', 'Reports']
    },
    {
      id: 29,
      category: 'maintenance',
      title: 'Motor Rewinding Workshop',
      location: 'Industrial Area',
      description: 'Specialized motor rewinding facility with copper wire and modern equipment.',
      image: '/images/motor-rewinding-workshop.png',
      year: 2024,
      highlights: ['All Sizes', 'Copper Wire', 'Varnish Treatment', 'Load Testing']
    },
    // ========== FABRICATION ==========
    {
      id: 30,
      category: 'fabrication',
      title: 'Steel Fabrication Workshop',
      location: 'Nairobi, Kenya',
      description: 'Heavy steel fabrication for generator enclosures, frames, and industrial structures.',
      image: '/images/steel-fabrication-workshop.png',
      year: 2024,
      highlights: ['Heavy Steel', 'Custom Design', 'Welding Certified', 'Powder Coating']
    },
    {
      id: 31,
      category: 'fabrication',
      title: 'Structural Steel Work',
      location: 'Various Projects',
      description: 'Structural steel fabrication for industrial canopies, platforms, and supports.',
      image: '/images/structural-steel-work.png',
      year: 2024,
      highlights: ['Structural Grade', 'Engineering Certified', 'Installation', 'Galvanized']
    },
    {
      id: 32,
      category: 'fabrication',
      title: 'Industrial Incinerator',
      location: 'Nairobi, Kenya',
      description: 'Custom industrial incinerator fabrication for waste management facilities.',
      image: '/images/industrial-incinerator.png',
      year: 2024,
      highlights: ['NEMA Compliant', 'Emission Control', 'High Temperature', 'Refractory Lined']
    },
    {
      id: 33,
      category: 'fabrication',
      title: 'Medical Waste Incinerator',
      location: 'Hospital, Nairobi',
      description: 'Medical-grade incinerator for safe disposal of hospital and clinical waste.',
      image: '/images/medical-waste-incinerator.png',
      year: 2024,
      highlights: ['Hospital Grade', 'Pathological Waste', 'Sharps Disposal', 'EPA Compliant']
    },
    {
      id: 34,
      category: 'fabrication',
      title: 'Incinerator Emission Control',
      location: 'Industrial Facility',
      description: 'Emission control systems for incinerators meeting environmental standards.',
      image: '/images/incinerator-emission-control.png',
      year: 2024,
      highlights: ['Scrubber System', 'Particulate Filter', 'NEMA Standards', 'Monitoring']
    },
    // ========== HVAC SYSTEMS ==========
    {
      id: 35,
      category: 'hvac',
      title: 'Commercial HVAC System',
      location: 'Office Complex, Nairobi',
      description: 'Commercial air conditioning installation for multi-story office building.',
      image: '/images/hvac-commercial-system.png',
      year: 2024,
      highlights: ['Central AC', 'Ducted System', 'Energy Efficient', 'Zone Control']
    },
    {
      id: 36,
      category: 'hvac',
      title: 'Industrial Cooling System',
      location: 'Manufacturing Plant',
      description: 'Industrial cooling and ventilation for manufacturing facility.',
      image: '/images/hvac-industrial-cooling.png',
      year: 2024,
      highlights: ['Industrial Grade', 'Process Cooling', 'Ventilation', 'Temperature Control']
    },
    {
      id: 37,
      category: 'hvac',
      title: 'VRF System Installation',
      location: 'Hotel, Mombasa',
      description: 'Variable Refrigerant Flow (VRF) system for hotel individual room control.',
      image: '/images/hvac-vrf-system.png',
      year: 2024,
      highlights: ['VRF Technology', 'Room Control', 'Energy Savings', 'Quiet Operation']
    },
    {
      id: 38,
      category: 'hvac',
      title: 'Air Conditioning Unit',
      location: 'Various Locations',
      description: 'Split and package AC unit installation for commercial and residential clients.',
      image: '/images/hvac-air-conditioning-unit.png',
      year: 2024,
      highlights: ['Split Units', 'Package Units', 'Installation', 'Maintenance']
    },
    // ========== WATER & PUMPS ==========
    {
      id: 39,
      category: 'water',
      title: 'Borehole Pump Installation',
      location: 'Various Counties',
      description: 'Submersible borehole pump installation for agricultural and residential water supply.',
      image: '/images/borehole-pump-installation.png',
      year: 2024,
      highlights: ['Submersible Pumps', 'Deep Wells', 'Solar Compatible', 'Stainless Steel']
    },
    {
      id: 40,
      category: 'water',
      title: 'Water Pump System',
      location: 'Machakos, Kenya',
      description: 'Complete water pumping and distribution system for community water project.',
      image: '/images/water-pump-system.png',
      year: 2024,
      highlights: ['Booster Pumps', 'Pressure Tanks', 'Auto Control', 'Distribution']
    },
    {
      id: 41,
      category: 'water',
      title: 'Water Treatment Plant',
      location: 'Industrial Facility',
      description: 'Industrial water treatment plant installation for manufacturing process water.',
      image: '/images/water-treatment-plant.png',
      year: 2024,
      highlights: ['RO System', 'Softening', 'Filtration', 'Process Water']
    },
    {
      id: 42,
      category: 'water',
      title: 'Waste Management System',
      location: 'Nairobi, Kenya',
      description: 'Wastewater treatment and management system for commercial facility.',
      image: '/images/waste-management-system.png',
      year: 2024,
      highlights: ['Wastewater Treatment', 'NEMA Compliant', 'Recycling', 'Monitoring']
    },
    // ========== MORE GENERATOR PROJECTS FROM IMG FILES ==========
    {
      id: 43,
      category: 'generators',
      title: 'Commercial Generator Project',
      location: 'Nairobi, Kenya',
      description: 'Commercial generator installation and commissioning for business premises.',
      image: '/images/IMG_20221222_153914_840.jpg',
      year: 2022,
      highlights: ['Commercial Grade', 'Full Installation', 'Commissioning', 'Training']
    },
    {
      id: 44,
      category: 'maintenance',
      title: 'On-Site Generator Service',
      location: 'Client Location',
      description: 'Preventive maintenance and service visit for commercial generator.',
      image: '/images/IMG_20240620_152044_448 (1).jpg',
      year: 2024,
      highlights: ['Preventive Service', 'On-Site', 'Oil Change', 'Filter Service']
    },
    {
      id: 45,
      category: 'generators',
      title: 'Generator Installation 2024',
      location: 'Nairobi, Kenya',
      description: 'Recent generator installation project with full commissioning.',
      image: '/images/IMG_20251115_101219.jpg',
      year: 2024,
      highlights: ['New Installation', '2024 Project', 'Full Service', 'Warranty']
    },
    {
      id: 46,
      category: 'maintenance',
      title: 'Generator Diagnostic Service',
      location: 'Various Locations',
      description: 'Professional diagnostic testing using advanced multimeter equipment.',
      image: '/images/Multimeter.png',
      year: 2024,
      highlights: ['Diagnostics', 'Electrical Testing', 'Fault Finding', 'Reports']
    }
  ]
};

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<typeof GALLERY_DATA.projects[0] | null>(null);

  const filteredProjects = GALLERY_DATA.projects.filter(
    p => selectedCategory === 'all' || p.category === selectedCategory
  );

  const openLightbox = (project: typeof GALLERY_DATA.projects[0]) => {
    setCurrentImage(project);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentImage(null);
    document.body.style.overflow = '';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!currentImage) return;
    const currentIndex = filteredProjects.findIndex(p => p.id === currentImage.id);
    let newIndex: number;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredProjects.length;
    } else {
      newIndex = currentIndex === 0 ? filteredProjects.length - 1 : currentIndex - 1;
    }
    
    setCurrentImage(filteredProjects[newIndex]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 bg-clip-text text-transparent">
              🖼️ Project Gallery
            </h1>
            <p className="text-xl text-gray-300">
              Explore our completed projects across Kenya
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 border-y border-white/10 sticky top-0 bg-gray-900/95 backdrop-blur-lg z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {GALLERY_DATA.categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-6 text-gray-400">
            Showing {filteredProjects.length} projects
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.03 }}
                  layout
                  className="group cursor-pointer"
                  onClick={() => openLightbox(project)}
                >
                  <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden
                    border border-gray-800
                    shadow-[0_10px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(34,197,94,0.1)]
                    hover:shadow-[0_20px_60px_rgba(34,197,94,0.3),0_0_0_2px_rgba(34,197,94,0.5)]
                    hover:border-green-500/60 hover:-translate-y-3 hover:scale-[1.02]
                    transition-all duration-500 ease-out">
                    {/* UNIFORM IMAGE - Fixed 4:3 aspect ratio */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {/* Cinematic gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500" />
                      {/* Hover glow */}
                      <div className="absolute inset-0 bg-gradient-to-b from-green-500/0 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-green-500/90 backdrop-blur-md text-white text-xs font-bold rounded-lg shadow-lg shadow-green-500/30">
                          {GALLERY_DATA.categories.find(c => c.id === project.category)?.icon} {GALLERY_DATA.categories.find(c => c.id === project.category)?.name.split(' ')[0]}
                        </span>
                      </div>
                      
                      {/* Year Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md text-white text-xs font-medium rounded-lg">
                          {project.year}
                        </span>
                      </div>

                      {/* View overlay on hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="px-4 py-2 bg-green-500/90 backdrop-blur-sm text-white font-semibold rounded-full flex items-center gap-2 shadow-lg">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </span>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="p-4">
                      <h3 className="text-base font-bold text-white mb-1 group-hover:text-green-400 transition-colors line-clamp-1 drop-shadow-sm">
                        {project.title}
                      </h3>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                        <span>📍</span> {project.location}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {project.highlights.slice(0, 2).map((h, i) => (
                          <span key={i} className="px-2 py-0.5 bg-green-500/10 text-green-400 rounded text-xs">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-xl font-semibold text-white mb-2">No projects in this category</h3>
              <button
                onClick={() => setSelectedCategory('all')}
                className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
              >
                View All Projects
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">500+</div>
              <div className="text-gray-400">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">47</div>
              <div className="text-gray-400">Counties Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">98%</div>
              <div className="text-gray-400">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">15+</div>
              <div className="text-gray-400">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Want Your Project Featured Here?</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            From residential solar installations to industrial generator setups, we deliver excellence in every project.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/booking" className="px-8 py-4 bg-green-500 text-white font-bold rounded-full hover:bg-green-600 transition-colors">
              📅 Book a Consultation
            </Link>
            <a href="https://wa.me/254768860655" className="px-8 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-colors">
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-3 text-white/70 hover:text-white transition-colors z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-6xl w-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2">
                {/* Image - REAL IMAGE */}
                <div className="relative aspect-[4/3] md:aspect-auto md:h-full min-h-[300px]">
                  <Image
                    src={currentImage.image}
                    alt={currentImage.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30 md:block hidden" />
                </div>

                {/* Info */}
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                      {currentImage.year}
                    </span>
                    <span className="px-3 py-1 bg-white/10 text-gray-400 text-sm rounded-full">
                      {GALLERY_DATA.categories.find(c => c.id === currentImage.category)?.name}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2">
                    {currentImage.title}
                  </h2>
                  <p className="text-gray-400 mb-2">📍 {currentImage.location}</p>
                  <p className="text-gray-300 mb-6">
                    {currentImage.description}
                  </p>

                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Project Highlights</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {currentImage.highlights.map((h, i) => (
                      <span key={i} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                        ✓ {h}
                      </span>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <p className="text-sm text-gray-500 mb-4">Interested in a similar project?</p>
                    <div className="flex gap-3">
                      <Link 
                        href="/booking"
                        className="flex-1 px-4 py-3 bg-green-500 text-white font-medium rounded-lg text-center hover:bg-green-600 transition-colors"
                      >
                        Get Quote
                      </Link>
                      <a 
                        href="https://wa.me/254768860655"
                        className="flex-1 px-4 py-3 bg-white/10 text-white font-medium rounded-lg text-center hover:bg-white/20 transition-colors"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 rounded-full text-white text-sm">
              {filteredProjects.findIndex(p => p.id === currentImage.id) + 1} / {filteredProjects.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
