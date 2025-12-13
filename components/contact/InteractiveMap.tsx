'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface County {
  name: string;
  position: { top: string; left: string };
  projects: number;
  contact: string;
}

const counties: County[] = [
  { name: "Nairobi", position: { top: "35%", left: "50%" }, projects: 142, contact: "+254 768 860 655" },
  { name: "Mombasa", position: { top: "65%", left: "60%" }, projects: 89, contact: "+254 782 914 717" },
  { name: "Kisumu", position: { top: "45%", left: "40%" }, projects: 67, contact: "+254 768 860 655" },
  { name: "Nakuru", position: { top: "30%", left: "45%" }, projects: 112, contact: "+254 768 860 655" },
  { name: "Eldoret", position: { top: "25%", left: "48%" }, projects: 78, contact: "+254 768 860 655" },
];

export default function InteractiveMap() {
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Interactive County Map
        </motion.h2>
        <p className="text-xl text-gray-400 text-center mb-12 max-w-3xl mx-auto">
          Click on any county to see our coverage and contact information
        </p>

        <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 p-8 min-h-[600px]">
          {/* Simplified Kenya Map Background */}
          <div className="absolute inset-8 bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-xl border border-gray-700/50" />
          
          {/* County Markers */}
          {counties.map((county, index) => (
            <motion.button
              key={county.name}
              onClick={() => setSelectedCounty(county)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all ${
                selectedCounty?.name === county.name ? 'scale-125 z-20' : 'hover:scale-110'
              }`}
              style={{
                top: county.position.top,
                left: county.position.left,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative">
                <div
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedCounty?.name === county.name
                      ? 'border-amber-400 bg-amber-400 animate-pulse'
                      : 'border-white/50 bg-blue-500 hover:border-white'
                  }`}
                />
                {selectedCounty?.name === county.name && (
                  <motion.div
                    className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-amber-400/50 shadow-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="font-bold text-white">{county.name}</div>
                    <div className="text-sm text-amber-400">{county.projects} projects</div>
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}

          {/* County Details Panel */}
          {selectedCounty && (
            <motion.div
              className="absolute bottom-8 left-8 right-8 bg-black/90 backdrop-blur-xl rounded-xl border border-amber-500/50 p-6 z-30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedCounty.name} County</h3>
                  <p className="text-gray-400">Active projects: <span className="text-amber-400 font-semibold">{selectedCounty.projects}</span></p>
                </div>
                <button
                  onClick={() => setSelectedCounty(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close details"
                >
                  ✕
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 mb-1">Contact</p>
                  <a href={`tel:${selectedCounty.contact}`} className="text-amber-400 hover:text-amber-300 font-semibold">
                    {selectedCounty.contact}
                  </a>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Service Coverage</p>
                  <p className="text-white">Full coverage available</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <a
                  href="/contact"
                  className="inline-block px-6 py-2 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-500 hover:to-amber-700 transition-all"
                >
                  Request Service
                </a>
              </div>
            </motion.div>
          )}

          {/* Legend */}
          <div className="absolute top-8 right-8 bg-black/80 backdrop-blur-sm p-4 rounded-xl border border-gray-700 z-20">
            <div className="text-white font-bold mb-2">Coverage</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500" />
                <span className="text-gray-300">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-gray-300">Selected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}




