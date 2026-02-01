'use client';

import { motion } from 'framer-motion';
import { PredictionResult, urgencyColors, urgencyLabels } from '@/lib/maintenance-companion/predictiveEngine';

interface PredictionCardProps {
  prediction: PredictionResult;
  onViewGuide?: (guideId: string) => void;
  onViewPart?: (partId: string) => void;
}

export default function PredictionCard({ prediction, onViewGuide, onViewPart }: PredictionCardProps) {
  const urgencyColor = urgencyColors[prediction.urgency];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden"
      style={{
        borderLeftWidth: 4,
        borderLeftColor: urgencyColor
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {/* Risk Score Badge */}
              <div
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: `${urgencyColor}20`,
                  color: urgencyColor
                }}
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: urgencyColor }} />
                {urgencyLabels[prediction.urgency]}
              </div>
              {/* Probability */}
              <span className="text-slate-500 text-xs">
                {prediction.probability}% probability
              </span>
            </div>
            <p className="text-white font-medium">{prediction.prediction}</p>
          </div>

          {/* Risk Score Gauge */}
          <div className="flex-shrink-0">
            <div className="relative w-14 h-14">
              <svg className="transform -rotate-90" width="56" height="56">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-slate-700"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke={urgencyColor}
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 24}
                  strokeDashoffset={2 * Math.PI * 24 * (1 - prediction.riskScore / 100)}
                  style={{
                    filter: `drop-shadow(0 0 4px ${urgencyColor}40)`
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{Math.round(prediction.riskScore)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consequence */}
      <div className="p-4 bg-red-500/5 border-b border-slate-700/50">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <span className="text-red-400 text-xs font-medium uppercase block mb-1">If Ignored</span>
            <p className="text-slate-300 text-sm">{prediction.consequence}</p>
          </div>
        </div>
      </div>

      {/* Recommended Action */}
      <div className="p-4 bg-emerald-500/5 border-b border-slate-700/50">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <span className="text-emerald-400 text-xs font-medium uppercase block mb-1">Recommended Action</span>
            <p className="text-slate-300 text-sm">{prediction.preventiveAction}</p>
          </div>
        </div>
      </div>

      {/* Cost Analysis */}
      <div className="p-4 grid grid-cols-3 gap-4 border-b border-slate-700/50">
        <div className="text-center">
          <span className="text-slate-500 text-xs block mb-1">Repair Cost</span>
          <span className="text-amber-400 font-mono text-sm">
            KES {prediction.estimatedRepairCost.min.toLocaleString()} - {prediction.estimatedRepairCost.max.toLocaleString()}
          </span>
        </div>
        <div className="text-center border-x border-slate-700/50">
          <span className="text-slate-500 text-xs block mb-1">Downtime Cost</span>
          <span className="text-red-400 font-mono text-sm">
            KES {prediction.estimatedDowntimeCost.toLocaleString()}
          </span>
        </div>
        <div className="text-center">
          <span className="text-slate-500 text-xs block mb-1">Save if Fixed Now</span>
          <span className="text-emerald-400 font-mono text-sm">
            KES {prediction.savingsIfFixedNow.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Linked Resources */}
      <div className="p-4">
        {/* Fault Codes */}
        {prediction.linkedFaultCodes.length > 0 && (
          <div className="mb-3">
            <span className="text-slate-500 text-xs block mb-1.5">Related Fault Codes</span>
            <div className="flex flex-wrap gap-1.5">
              {prediction.linkedFaultCodes.map((code) => (
                <span
                  key={code}
                  className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded text-xs font-mono"
                >
                  {code}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {prediction.linkedGuides.length > 0 && onViewGuide && (
            <button
              onClick={() => onViewGuide(prediction.linkedGuides[0])}
              className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              View Repair Guide
            </button>
          )}
          {prediction.linkedParts.length > 0 && onViewPart && (
            <button
              onClick={() => onViewPart(prediction.linkedParts[0])}
              className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              View Required Parts
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
