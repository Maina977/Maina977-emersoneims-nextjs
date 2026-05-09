'use client';

import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';

// Use Advanced Mapbox Map
const AdvancedMapboxMap = lazy(() => import('@/components/maps/AdvancedMapboxMap'));

export default function InteractiveMap() {
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
          Explore our coverage across Kenya with interactive 3D map visualization
        </p>

        <Suspense
          fallback={
            <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-cyan-500/20 bg-black/80 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-cyan-300 font-mono">LOADING MAP...</p>
              </div>
            </div>
          }
        >
          <AdvancedMapboxMap />
        </Suspense>
      </div>
    </section>
  );
}







