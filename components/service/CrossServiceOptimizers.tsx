'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

type CrossServiceOptimizersProps = {
  performanceTier?: string;
};

const serviceGallery = [
  {
    image: '/images/tnpl-diesal-generator-1000x1000-1920x1080.webp',
    title: 'Industrial Generator Installation',
    description: 'Complete 500 kVA Cummins generator setup with ATS integration for a manufacturing facility in Nairobi Industrial Area.',
    category: 'Generators',
    stats: { power: '500 kVA', duration: '3 Days', warranty: '2 Years' },
  },
  {
    image: '/images/solar power farms.png',
    title: 'Solar Farm Project',
    description: '250 kW grid-tied solar installation for agricultural export company in Naivasha, reducing energy costs by 65%.',
    category: 'Solar',
    stats: { power: '250 kW', duration: '14 Days', warranty: '25 Years' },
  },
  {
    image: '/images/GEN 2-1920x1080.png',
    title: 'Generator Control Panel Upgrade',
    description: 'Modern ComAp controller installation with remote monitoring capability for hotel chain backup power systems.',
    category: 'Control Systems',
    stats: { power: 'Multi-Site', duration: '5 Days', warranty: '3 Years' },
  },
  {
    image: '/images/solar hotel heaters.png',
    title: 'Solar Water Heating System',
    description: '5,000-liter solar thermal system for 200-room hotel in Mombasa, achieving 80% reduction in water heating costs.',
    category: 'Solar Thermal',
    stats: { capacity: '5,000 L', duration: '7 Days', warranty: '10 Years' },
  },
  {
    image: '/images/Multimeter.png',
    title: 'Electrical Testing & Diagnostics',
    description: 'Comprehensive power quality analysis and preventive maintenance diagnostics using advanced testing equipment.',
    category: 'Diagnostics',
    stats: { type: 'Full Audit', duration: '1 Day', report: 'Detailed' },
  },
  {
    image: '/images/ENGINE PARTS.png',
    title: 'Genuine Spare Parts Supply',
    description: 'OEM parts inventory for Cummins, Caterpillar, and FG Wilson generators. Same-day delivery across Kenya.',
    category: 'Parts Supply',
    stats: { brands: '10+', stock: '5,000+', delivery: 'Same Day' },
  },
  {
    image: '/images/solar for flower farms.png',
    title: 'Agricultural Solar Installation',
    description: '150 kW solar system with battery backup for flower farm cold storage and irrigation pumping in Nakuru.',
    category: 'Solar',
    stats: { power: '150 kW', duration: '10 Days', warranty: '25 Years' },
  },
  {
    image: '/images/solar changeover control.png',
    title: 'Hybrid Power System',
    description: 'Intelligent solar-generator-grid integration with automatic changeover for seamless power continuity.',
    category: 'Integration',
    stats: { type: 'Hybrid', sources: '3', automation: 'Full' },
  },
  {
    image: '/images/7320-1920x1080.png',
    title: 'Industrial Motor Rewinding',
    description: '200 HP motor complete rewind with Class H insulation and dynamic balancing for cement factory.',
    category: 'Motor Services',
    stats: { power: '200 HP', duration: '4 Days', warranty: '12 Months' },
  },
  {
    image: '/images/solar power for farms.png',
    title: 'Commercial Solar Rooftop',
    description: '100 kW rooftop solar for shopping mall with net-metering, generating revenue from excess power.',
    category: 'Solar',
    stats: { power: '100 kW', roi: '4 Years', savings: '70%' },
  },
  // Additional 20 project images
  {
    image: '/images/901.png',
    title: 'Generator Commissioning',
    description: 'Full commissioning and load testing of 350 kVA standby generator for commercial complex in Westlands.',
    category: 'Generators',
    stats: { power: '350 kVA', duration: '2 Days', warranty: '2 Years' },
  },
  {
    image: '/images/902.png',
    title: 'Electrical Panel Installation',
    description: 'Main distribution board upgrade with smart metering for industrial warehouse in Athi River.',
    category: 'Electrical',
    stats: { capacity: '800A', duration: '4 Days', warranty: '3 Years' },
  },
  {
    image: '/images/903.png',
    title: 'Generator Maintenance Service',
    description: 'Comprehensive preventive maintenance program for fleet of 12 generators at data center facility.',
    category: 'Maintenance',
    stats: { units: '12', frequency: 'Monthly', uptime: '99.9%' },
  },
  {
    image: '/images/904.png',
    title: 'Power Infrastructure Upgrade',
    description: 'Complete electrical infrastructure modernization for textile manufacturing plant in Ruiru.',
    category: 'Infrastructure',
    stats: { scope: 'Full Plant', duration: '21 Days', warranty: '5 Years' },
  },
  {
    image: '/images/909.png',
    title: 'Emergency Generator Repair',
    description: '24-hour emergency repair service restoring critical power to hospital backup systems.',
    category: 'Emergency',
    stats: { response: '2 Hours', repair: 'Same Day', critical: 'Yes' },
  },
  {
    image: '/images/910.png',
    title: 'Industrial Wiring Project',
    description: 'Heavy-duty industrial wiring installation for new production line at beverage factory.',
    category: 'Electrical',
    stats: { load: '500 kW', duration: '10 Days', standard: 'IEC' },
  },
  {
    image: '/images/911.png',
    title: 'ATS Installation',
    description: 'Automatic Transfer Switch installation ensuring seamless power switching for office tower.',
    category: 'Control Systems',
    stats: { rating: '1000A', transfer: '<10ms', warranty: '3 Years' },
  },
  {
    image: '/images/912.png',
    title: 'Generator Overhauling',
    description: 'Complete engine overhaul and alternator refurbishment for aging 750 kVA generator.',
    category: 'Overhaul',
    stats: { power: '750 kVA', duration: '14 Days', warranty: '18 Months' },
  },
  {
    image: '/images/913.png',
    title: 'Substation Installation',
    description: '11kV/415V substation construction and commissioning for industrial park development.',
    category: 'High Voltage',
    stats: { voltage: '11kV', capacity: '2 MVA', warranty: '5 Years' },
  },
  {
    image: '/images/914.png',
    title: 'Generator Synchronization',
    description: 'Parallel synchronization setup for three 500 kVA generators at mining operation.',
    category: 'Control Systems',
    stats: { units: '3', total: '1.5 MVA', sync: 'Auto' },
  },
  {
    image: '/images/915.png',
    title: 'Fuel System Installation',
    description: 'Bulk fuel storage and automated fuel management system for generator farm.',
    category: 'Fuel Systems',
    stats: { capacity: '20,000 L', automation: 'Full', monitoring: '24/7' },
  },
  {
    image: '/images/916.png',
    title: 'Cable Laying Project',
    description: 'Underground power cable installation connecting new warehouse to main grid.',
    category: 'Infrastructure',
    stats: { length: '500m', voltage: '11kV', duration: '7 Days' },
  },
  {
    image: '/images/917.png',
    title: 'Generator Canopy Fabrication',
    description: 'Custom weather-proof acoustic canopy for outdoor generator installation.',
    category: 'Fabrication',
    stats: { noise: '-25 dB', material: 'Steel', warranty: '10 Years' },
  },
  {
    image: '/images/918.png',
    title: 'Power Quality Analysis',
    description: 'Detailed power quality study and harmonic analysis for sensitive electronics facility.',
    category: 'Diagnostics',
    stats: { type: 'Full Study', duration: '3 Days', report: 'IEEE Compliant' },
  },
  {
    image: '/images/919.png',
    title: 'Generator Rental Service',
    description: 'Temporary power solution with 200 kVA generator for construction site project.',
    category: 'Rental',
    stats: { power: '200 kVA', period: '6 Months', support: '24/7' },
  },
  {
    image: '/images/920.png',
    title: 'Transformer Installation',
    description: '1000 kVA oil-filled transformer installation for new shopping mall development.',
    category: 'High Voltage',
    stats: { rating: '1000 kVA', type: 'Oil-Filled', warranty: '5 Years' },
  },
  {
    image: '/images/921.png',
    title: 'UPS System Upgrade',
    description: 'Modular UPS upgrade providing N+1 redundancy for tier-3 data center.',
    category: 'UPS',
    stats: { capacity: '400 kVA', redundancy: 'N+1', runtime: '30 min' },
  },
  {
    image: '/images/922.png',
    title: 'Generator Parts Replacement',
    description: 'Major component replacement including injectors and turbocharger for 600 kVA unit.',
    category: 'Parts',
    stats: { power: '600 kVA', parts: 'OEM', warranty: '12 Months' },
  },
  {
    image: '/images/923.png',
    title: 'Load Bank Testing',
    description: 'Full load bank testing and performance verification for newly installed generators.',
    category: 'Testing',
    stats: { capacity: '2 MW', duration: '8 Hours', report: 'Certified' },
  },
  {
    image: '/images/924.png',
    title: 'Remote Monitoring Setup',
    description: 'Cloud-based remote monitoring system installation for multi-site generator fleet.',
    category: 'Monitoring',
    stats: { sites: '15', alerts: 'Real-time', access: 'Mobile App' },
  },
];

const optimizationServices = [
  {
    title: 'Energy Audit & Optimization',
    description: 'Comprehensive energy assessment to identify savings opportunities across all your systems',
    icon: '📊',
    benefits: ['Identify energy waste', 'Reduce operational costs', 'Improve system efficiency', 'ROI analysis'],
  },
  {
    title: 'Predictive Maintenance',
    description: 'IoT-enabled monitoring and AI-driven maintenance scheduling to prevent breakdowns',
    icon: '🔮',
    benefits: ['Reduce downtime', 'Extend equipment life', 'Lower maintenance costs', 'Real-time alerts'],
  },
  {
    title: 'System Integration',
    description: 'Seamless integration of generators, solar, UPS, and grid for optimal power management',
    icon: '🔗',
    benefits: ['Unified control', 'Automatic switching', 'Load balancing', 'Priority management'],
  },
  {
    title: 'Remote Monitoring',
    description: '24/7 cloud-based monitoring of all your power systems from anywhere in the world',
    icon: '📡',
    benefits: ['Real-time dashboards', 'Mobile access', 'Historical data', 'Performance analytics'],
  },
];

export default function CrossServiceOptimizers({ performanceTier }: CrossServiceOptimizersProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section className="relative py-20 bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-800" data-performance-tier={performanceTier}>
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(168,85,247,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.2),transparent_50%)]" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-sm font-medium mb-4">
            INTEGRATED SOLUTIONS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Cross-Service <span className="text-purple-400">Optimizers</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Integrated optimization services across multiple systems. One partner for all your 
            power and engineering needs — seamlessly connected, intelligently managed.
          </p>
        </motion.div>

        {/* Optimization Services Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {optimizationServices.map((service, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 group">
              <span className="text-4xl mb-4 block">{service.icon}</span>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{service.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{service.description}</p>
              <ul className="space-y-1">
                {service.benefits.map((benefit, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Gallery Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl font-bold text-white mb-4">Our Work in Action</h3>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Real projects, real results. Browse our portfolio of completed installations 
            and see the quality and expertise we bring to every project.
          </p>
        </motion.div>

        {/* Image Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {serviceGallery.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`relative rounded-xl overflow-hidden cursor-pointer group ${
                index === 0 || index === 5 ? 'col-span-2 row-span-2 h-80' : 'h-40'
              }`}
              onClick={() => setSelectedImage(selectedImage === index ? null : index)}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              
              {/* Category Badge */}
              <span className="absolute top-3 left-3 px-2 py-1 bg-purple-500/80 text-white text-xs font-medium rounded">
                {item.category}
              </span>
              
              {/* Title & Description */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="text-white font-bold text-sm md:text-base mb-1 line-clamp-1">{item.title}</h4>
                <p className="text-slate-300 text-xs line-clamp-2 hidden group-hover:block transition-all">
                  {item.description}
                </p>
              </div>

              {/* Expanded View */}
              {selectedImage === index && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-slate-900/95 p-4 flex flex-col justify-center"
                >
                  <h4 className="text-white font-bold mb-2">{item.title}</h4>
                  <p className="text-slate-300 text-sm mb-4">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(item.stats).map(([key, value]) => (
                      <span key={key} className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300">
                        <span className="text-slate-400">{key}:</span> {value}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {[
            { value: '1,000+', label: 'Projects Completed', icon: '✅' },
            { value: '500+', label: 'Happy Clients', icon: '😊' },
            { value: '15+', label: 'Years Experience', icon: '📅' },
            { value: '24/7', label: 'Support Available', icon: '🛠️' },
          ].map((stat, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 text-center">
              <span className="text-3xl mb-2 block">{stat.icon}</span>
              <div className="text-3xl font-bold text-purple-400 mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 border border-purple-500/30 rounded-2xl p-8 md:p-12 text-center"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Optimize Your Operations?
          </h3>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Let our team of experts analyze your power systems and create a customized 
            optimization plan that saves money and improves reliability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact?type=consultation" 
              className="inline-flex items-center justify-center px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-colors"
            >
              Schedule Free Consultation
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a 
              href="tel:+254700000000" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Us Now
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}