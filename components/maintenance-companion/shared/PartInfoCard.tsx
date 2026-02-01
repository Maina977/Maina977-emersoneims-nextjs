'use client';

import { motion } from 'framer-motion';
import { SchematicPart } from '@/lib/maintenance-companion/schematicData';

interface PartInfoCardProps {
  part: SchematicPart;
  onClose: () => void;
  onViewGuide?: (guideId: string) => void;
  onViewPart?: (partNumber: string) => void;
}

export default function PartInfoCard({ part, onClose, onViewGuide, onViewPart }: PartInfoCardProps) {
  const criticalColors = {
    low: '#10B981',
    medium: '#F59E0B',
    high: '#EF4444',
    critical: '#991B1B'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className="bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-xl max-w-sm w-full"
      style={{
        boxShadow: '0 0 30px rgba(0,0,0,0.5), 0 0 15px rgba(6,182,212,0.1)'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold text-lg">{part.name}</h3>
          <p className="text-cyan-400 font-mono text-sm">{part.partNumber}</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors p-1"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-sm mb-4">{part.description}</p>

      {/* Critical Level Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-slate-500 text-xs uppercase">Critical Level:</span>
        <span
          className="px-2 py-0.5 rounded text-xs font-medium uppercase"
          style={{
            backgroundColor: `${criticalColors[part.criticalLevel]}20`,
            color: criticalColors[part.criticalLevel]
          }}
        >
          {part.criticalLevel}
        </span>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-800/50 rounded-lg p-2">
          <span className="text-slate-500 text-xs block">Estimated Price</span>
          <span className="text-white font-mono text-sm">
            KES {part.estimatedPrice.min.toLocaleString()} - {part.estimatedPrice.max.toLocaleString()}
          </span>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-2">
          <span className="text-slate-500 text-xs block">Expected Lifespan</span>
          <span className="text-white text-sm">{part.lifespan}</span>
        </div>
      </div>

      {/* Failure Symptoms */}
      <div className="mb-4">
        <h4 className="text-slate-300 text-sm font-medium mb-2">Failure Symptoms</h4>
        <div className="flex flex-wrap gap-1.5">
          {part.failureSymptoms.map((symptom, index) => (
            <span
              key={index}
              className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded text-xs"
            >
              {symptom}
            </span>
          ))}
        </div>
      </div>

      {/* Linked Fault Codes */}
      {part.linkedFaultCodes.length > 0 && (
        <div className="mb-4">
          <h4 className="text-slate-300 text-sm font-medium mb-2">Related Fault Codes</h4>
          <div className="flex flex-wrap gap-1.5">
            {part.linkedFaultCodes.map((code, index) => (
              <span
                key={index}
                className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded text-xs font-mono"
              >
                {code}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2 border-t border-slate-700">
        {onViewGuide && part.replacementGuideId && (
          <button
            onClick={() => onViewGuide(part.replacementGuideId)}
            className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            View Repair Guide
          </button>
        )}
        {onViewPart && (
          <button
            onClick={() => onViewPart(part.partNumber)}
            className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Find Part
          </button>
        )}
      </div>
    </motion.div>
  );
}
