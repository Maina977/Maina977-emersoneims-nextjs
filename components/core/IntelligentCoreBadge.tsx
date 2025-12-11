'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';

interface IntelligentCoreBadgeProps {
  progress: MotionValue<number>;
  isVisible?: boolean;
}

export default function IntelligentCoreBadge({ progress, isVisible = true }: IntelligentCoreBadgeProps) {
  const opacity = useTransform(progress, [0, 0.5], [1, 0]);
  const scale = useTransform(progress, [0, 0.5], [1, 0.8]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-8 right-8 z-30"
      style={{ opacity, scale }}
    >
      <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-amber-500/50 rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
          <div>
            <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">
              Intelligent Core
            </div>
            <div className="text-sm text-amber-400 font-bold">
              ACTIVE
            </div>
          </div>
        </div>
        
        {/* Telemetry data */}
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="text-xs text-gray-500 font-mono space-y-1">
            <div className="flex justify-between">
              <span>Power:</span>
              <span className="text-amber-400">100%</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-green-400">OPTIMAL</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}




