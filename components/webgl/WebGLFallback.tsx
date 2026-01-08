'use client';

import { motion } from 'framer-motion';

interface WebGLFallbackProps {
  message?: string;
  type?: 'generator' | 'scene' | 'map' | 'default';
}

/**
 * Fallback component for WebGL/Three.js components
 * Shows when WebGL is not supported or component fails to load
 */
export default function WebGLFallback({
  message = "3D visualization unavailable",
  type = 'default'
}: WebGLFallbackProps) {
  const gradients = {
    generator: 'from-amber-500/20 via-orange-500/10 to-amber-500/20',
    scene: 'from-cyan-500/20 via-blue-500/10 to-cyan-500/20',
    map: 'from-green-500/20 via-emerald-500/10 to-green-500/20',
    default: 'from-gray-500/20 via-gray-400/10 to-gray-500/20',
  };

  return (
    <motion.div
      className={`w-full h-full min-h-[400px] bg-gradient-to-br ${gradients[type]}
                  flex items-center justify-center rounded-lg border border-white/10`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center p-8 max-w-md">
        <div className="text-6xl mb-4">🎨</div>
        <h3 className="text-xl font-semibold text-white/90 mb-2">{message}</h3>
        <p className="text-sm text-white/60">
          Your browser may not support WebGL or 3D graphics.
          Try updating your browser for the best experience.
        </p>
      </div>
    </motion.div>
  );
}
