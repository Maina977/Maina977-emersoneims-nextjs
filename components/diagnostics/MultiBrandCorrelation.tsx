// components/diagnostics/MultiBrandCorrelation.tsx
// PROPRIETARY: Multi-Brand Correlation Engine™
// Patent Pending KE/P/2025/XXXXX
'use client';

import { motion } from 'framer-motion';
import { getCorrelatedCodes } from '@/app/data/diagnostic/emersonMethodology';

interface MultiBrandCorrelationProps {
  currentCode: string;
  currentBrand: string;
}

export default function MultiBrandCorrelation({
  currentCode,
  currentBrand
}: MultiBrandCorrelationProps) {
  const correlations = getCorrelatedCodes(currentCode);

  if (correlations.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/30"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">
            Multi-Brand Correlation Engine™
          </h3>
          <p className="text-sm text-gray-400">
            Cross-reference with {correlations.length} similar faults across brands
          </p>
        </div>
        <div className="bg-cyan-500/20 px-4 py-2 rounded-full">
          <span className="text-xs font-semibold text-cyan-300">UNIQUE TO EmersonEIMS</span>
        </div>
      </div>

      {/* Current Code */}
      <div className="mb-6 bg-white/5 rounded-xl p-4 border-l-4 border-amber-500">
        <div className="text-sm text-gray-400 mb-1">Currently Viewing</div>
        <div className="font-mono text-lg font-bold text-amber-400">
          {currentBrand} {currentCode}
        </div>
      </div>

      {/* Correlated Codes */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">
          Related Faults in Other Control Systems:
        </h4>
        {correlations.map((corr, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-cyan-500/50 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-lg font-bold text-cyan-400">
                    {corr.brand} {corr.code}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    corr.similarity >= 90 ? 'bg-green-500/20 text-green-300' :
                    corr.similarity >= 80 ? 'bg-cyan-500/20 text-cyan-300' :
                    corr.similarity >= 70 ? 'bg-amber-500/20 text-amber-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {corr.similarity}% match
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-2">{corr.description}</p>
                
                {/* Common Symptoms */}
                {corr.commonSymptoms && corr.commonSymptoms.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs text-gray-400 mb-1">Common Symptoms:</div>
                    <div className="flex flex-wrap gap-2">
                      {corr.commonSymptoms.map((symptom, i) => (
                        <span 
                          key={i}
                          className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shared Solutions */}
                {corr.sharedSolutions && corr.sharedSolutions.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs text-gray-400 mb-1">Shared Solutions:</div>
                    <ul className="space-y-1">
                      {corr.sharedSolutions.map((solution, i) => (
                        <li key={i} className="text-xs text-gray-300 flex items-start">
                          <span className="text-cyan-500 mr-2">▸</span>
                          <span>{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* View Button */}
              <button className="ml-4 px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg text-sm font-semibold hover:bg-cyan-500/30 transition opacity-0 group-hover:opacity-100">
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Why This Matters */}
      <div className="mt-6 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl p-4 border border-purple-500/20">
        <h4 className="text-sm font-bold text-purple-300 mb-2">
          🌟 Why Multi-Brand Correlation Matters
        </h4>
        <p className="text-xs text-gray-300 leading-relaxed">
          EmersonEIMS is the <span className="text-amber-400 font-semibold">only diagnostic platform in Kenya</span> that 
          cross-references faults across DeepSea, PowerCommand, Cummins, Perkins, and Caterpillar control systems. 
          Our 15 years of field data enables faster diagnosis and repair, saving you hours of troubleshooting time.
        </p>
      </div>

      {/* Patent Notice */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-[10px] text-gray-500 text-center">
          Multi-Brand Correlation Engine™ • Patent Pending KE/P/2025/XXXXX<br/>
          © 2025 EmersonEIMS Engineering Services Ltd. • Proprietary Algorithm
        </p>
      </div>
    </motion.div>
  );
}
