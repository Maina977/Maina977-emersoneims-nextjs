'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Project gallery categories and images
// Using placeholder images - replace with real project photos
const GALLERY_DATA = {
  categories: [
    { id: 'all', name: 'All Projects', icon: '📁' },
    { id: 'generators', name: 'Generator Installations', icon: '⚡' },
    { id: 'solar', name: 'Solar Projects', icon: '☀️' },
    { id: 'ups', name: 'UPS Systems', icon: '🔋' },
    { id: 'electrical', name: 'Electrical Works', icon: '🔌' },
    { id: 'maintenance', name: 'Maintenance', icon: '🔧' }
  ],
  projects: [
    {
      id: 1,
      category: 'generators',
      title: '500kVA Generator Installation',
      location: 'Westlands, Nairobi',
      description: 'Complete installation of a 500kVA Perkins generator with automatic transfer switch for a commercial building.',
      image: '/images/gallery/generator-500kva.jpg',
      year: 2024,
      highlights: ['500kVA capacity', 'ATS integration', 'Sound-attenuated enclosure', '24/7 monitoring']
    },
    {
      id: 2,
      category: 'generators',
      title: '200kVA Backup Power System',
      location: 'Industrial Area, Nairobi',
      description: 'Industrial backup power solution with dual fuel capability and remote monitoring.',
      image: '/images/gallery/generator-200kva.jpg',
      year: 2024,
      highlights: ['Dual fuel system', 'Remote monitoring', 'ISO certified installation']
    },
    {
      id: 3,
      category: 'generators',
      title: 'Hospital Emergency Power',
      location: 'Karen, Nairobi',
      description: 'Critical power installation for a private hospital with redundant systems.',
      image: '/images/gallery/hospital-generator.jpg',
      year: 2023,
      highlights: ['Redundant systems', 'UPS backup', '<10 second transfer time']
    },
    {
      id: 4,
      category: 'solar',
      title: '50kW Commercial Solar System',
      location: 'Mombasa',
      description: 'Grid-tied solar installation for a manufacturing facility with net metering.',
      image: '/images/gallery/solar-commercial.jpg',
      year: 2024,
      highlights: ['50kW capacity', 'Net metering', '70% bill reduction']
    },
    {
      id: 5,
      category: 'solar',
      title: 'Off-Grid Solar Farm',
      location: 'Turkana',
      description: 'Complete off-grid solar solution for a remote agricultural project.',
      image: '/images/gallery/solar-offgrid.jpg',
      year: 2024,
      highlights: ['100kW system', 'Battery storage', 'Agricultural pumps']
    },
    {
      id: 6,
      category: 'solar',
      title: 'Residential Solar + Battery',
      location: 'Lavington, Nairobi',
      description: 'Hybrid solar system with lithium battery backup for a residential home.',
      image: '/images/gallery/solar-residential.jpg',
      year: 2024,
      highlights: ['10kW solar', '15kWh battery', 'Smart monitoring']
    },
    {
      id: 7,
      category: 'ups',
      title: 'Data Center UPS Upgrade',
      location: 'CBD, Nairobi',
      description: 'Modular UPS installation with N+1 redundancy for a tier 3 data center.',
      image: '/images/gallery/ups-datacenter.jpg',
      year: 2024,
      highlights: ['200kVA modular', 'N+1 redundancy', '30 min runtime']
    },
    {
      id: 8,
      category: 'ups',
      title: 'Bank Branch Protection',
      location: 'Multiple Locations',
      description: 'Standardized UPS deployment across 15 bank branches nationwide.',
      image: '/images/gallery/ups-bank.jpg',
      year: 2023,
      highlights: ['15 branches', '20kVA each', 'Remote monitoring']
    },
    {
      id: 9,
      category: 'electrical',
      title: 'Factory Power Distribution',
      location: 'Athi River',
      description: 'Complete electrical infrastructure for a new manufacturing plant.',
      image: '/images/gallery/electrical-factory.jpg',
      year: 2024,
      highlights: ['2MW capacity', 'PLC control', 'Safety systems']
    },
    {
      id: 10,
      category: 'electrical',
      title: 'Office Building Wiring',
      location: 'Upper Hill, Nairobi',
      description: 'Full electrical installation for a 10-story office complex.',
      image: '/images/gallery/electrical-office.jpg',
      year: 2024,
      highlights: ['10 floors', 'Smart lighting', 'EV charging']
    },
    {
      id: 11,
      category: 'maintenance',
      title: 'Annual Generator Service',
      location: 'Various Locations',
      description: 'Preventive maintenance program covering 50+ generators across Kenya.',
      image: '/images/gallery/maintenance-annual.jpg',
      year: 2024,
      highlights: ['50+ units', '98% uptime', '24/7 support']
    },
    {
      id: 12,
      category: 'maintenance',
      title: 'Emergency Repair Service',
      location: 'Naivasha',
      description: 'Emergency overhaul of a critical generator at a flower farm during peak season.',
      image: '/images/gallery/maintenance-emergency.jpg',
      year: 2024,
      highlights: ['4-hour response', 'On-site repair', 'Zero downtime']
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                  className="group cursor-pointer"
                  onClick={() => openLightbox(project)}
                >
                  <div className="relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-green-500/50 transition-all">
                    {/* Image Placeholder - Replace with real images */}
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl opacity-50">
                          {GALLERY_DATA.categories.find(c => c.id === project.category)?.icon}
                        </span>
                      </div>
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-lg font-medium flex items-center gap-2">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                          View Project
                        </span>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                          {project.year}
                        </span>
                        <span className="text-xs text-gray-500">{project.location}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {project.description}
                      </p>
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
              className="max-w-5xl w-full bg-gray-900 rounded-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2">
                {/* Image */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <span className="text-8xl opacity-50">
                    {GALLERY_DATA.categories.find(c => c.id === currentImage.category)?.icon}
                  </span>
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
