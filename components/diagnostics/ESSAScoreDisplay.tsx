// components/diagnostics/ESSAScoreDisplay.tsx
// PROPRIETARY: EmersonEIMS Severity Scoring Algorithm (ESSA™) Display
// Patent Pending KE/P/2025/XXXXX
'use client';

import { motion } from 'framer-motion';
import { calculateESSA } from '@/app/data/diagnostic/emersonMethodology';

interface ESSAScoreDisplayProps {
  errorCode: string;
  baseSeverity: number; // 1-10
  temperature?: number; // Celsius
  loadPercentage?: number; // 0-100
  maintenanceMonthsAgo?: number;
  occurrencesPerMonth?: number;
  equipmentAgeYears?: number;
  altitudeMeters?: number;
}

export default function ESSAScoreDisplay({
  errorCode,
  baseSeverity,
  temperature = 25,
  loadPercentage = 70,
  maintenanceMonthsAgo = 3,
  occurrencesPerMonth = 0,
  equipmentAgeYears = 2,
  altitudeMeters = 1800
}: ESSAScoreDisplayProps) {
  const essaResult = calculateESSA(
    baseSeverity,
    temperature,
    loadPercentage,
    maintenanceMonthsAgo,
    occurrencesPerMonth,
    equipmentAgeYears,
    altitudeMeters
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'from-red-600 to-red-700';
      case 'High': return 'from-orange-500 to-orange-600';
      case 'Medium': return 'from-amber-500 to-amber-600';
      case 'Low': return 'from-cyan-500 to-cyan-600';
      default: return 'from-green-500 to-green-600';
    }
  };

  const getSeverityBorder = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'border-red-500';
      case 'High': return 'border-orange-500';
      case 'Medium': return 'border-amber-500';
      case 'Low': return 'border-cyan-500';
      default: return 'border-green-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-white/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">ESSA™ Analysis</h3>
          <p className="text-xs text-gray-400">EmersonEIMS Severity Scoring</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Error Code</div>
          <div className="text-sm font-mono text-amber-400">{errorCode}</div>
        </div>
      </div>

      {/* Score Display */}
      <div className={`bg-gradient-to-r ${getSeverityColor(essaResult.severity)} rounded-xl p-6 mb-4`}>
        <div className="text-center">
          <div className="text-5xl font-bold text-white mb-2">
            {essaResult.adjustedSeverity.toFixed(1)}
          </div>
          <div className="text-lg font-semibold text-white/90">
            {essaResult.severity}
          </div>
          <div className="text-sm text-white/70">
            Base: {baseSeverity.toFixed(1)} → Adjusted: {essaResult.adjustedSeverity.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Factor Breakdown */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {essaResult.factors.temperature !== 1.0 && (
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs text-gray-400">Temperature Impact</div>
            <div className="text-lg font-bold text-amber-400">
              ×{essaResult.factors.temperature.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">{temperature}°C</div>
          </div>
        )}
        {essaResult.factors.load !== 1.0 && (
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs text-gray-400">Load Impact</div>
            <div className="text-lg font-bold text-orange-400">
              ×{essaResult.factors.load.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">{loadPercentage}% load</div>
          </div>
        )}
        {essaResult.factors.maintenance !== 1.0 && (
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs text-gray-400">Maintenance Factor</div>
            <div className="text-lg font-bold text-red-400">
              ×{essaResult.factors.maintenance.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">{maintenanceMonthsAgo} months ago</div>
          </div>
        )}
        {essaResult.factors.frequency !== 1.0 && (
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs text-gray-400">Frequency Factor</div>
            <div className="text-lg font-bold text-cyan-400">
              ×{essaResult.factors.frequency.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">{occurrencesPerMonth}/month</div>
          </div>
        )}
        {essaResult.factors.age !== 1.0 && (
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs text-gray-400">Age Factor</div>
            <div className="text-lg font-bold text-yellow-400">
              ×{essaResult.factors.age.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">{equipmentAgeYears} years</div>
          </div>
        )}
        {essaResult.factors.altitude !== 1.0 && (
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs text-gray-400">Altitude Factor</div>
            <div className="text-lg font-bold text-purple-400">
              ×{essaResult.factors.altitude.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">{altitudeMeters}m ASL</div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className={`border-l-4 ${getSeverityBorder(essaResult.severity)} bg-white/5 rounded-r-lg p-4`}>
        <h4 className="text-sm font-bold text-white mb-2">Recommendations</h4>
        <ul className="space-y-1">
          {essaResult.recommendations.map((rec, i) => (
            <li key={i} className="text-xs text-gray-300 flex items-start">
              <span className="text-amber-500 mr-2">▸</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Patent Notice */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-[10px] text-gray-500 text-center">
          ESSA™ Algorithm • Patent Pending KE/P/2025/XXXXX<br/>
          © 2025 EmersonEIMS Engineering Services Ltd. • Proprietary & Confidential
        </p>
      </div>
    </motion.div>
  );
}
