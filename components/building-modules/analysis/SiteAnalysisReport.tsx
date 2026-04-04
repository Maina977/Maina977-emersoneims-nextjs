// @ts-nocheck
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/helpers';

interface SiteAnalysisReportProps {
  data: {
    terrain: any;
    soil: any;
    floodRisk: any;
    waterTable: any;
    climate: any;
    utilities: any;
    suitabilityScore: number;
    recommendations: string[];
    warnings: string[];
  };
  onRegenerate?: () => void;
}

export function SiteAnalysisReport({ data, onRegenerate }: SiteAnalysisReportProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    terrain: true,
    soil: true,
    flood: true,
    utilities: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-4">
      {/* Header with Score */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-dark-500">Site Analysis Report</h2>
          <p className="text-sm text-gray-500">Comprehensive land assessment for construction</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={cn('px-4 py-2 rounded-full text-center', getScoreBg(data.suitabilityScore))}>
            <p className="text-sm text-gray-600">Suitability Score</p>
            <p className={cn('text-2xl font-bold', getScoreColor(data.suitabilityScore))}>
              {data.suitabilityScore}/100
            </p>
          </div>
          {onRegenerate && (
            <Button variant="outline" size="sm" onClick={onRegenerate}>
              Re-analyze
            </Button>
          )}
        </div>
      </div>

      {/* Warnings */}
      {data.warnings && data.warnings.length > 0 && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-800">Warnings</p>
              <ul className="list-disc list-inside text-sm text-yellow-700 mt-1">
                {data.warnings.map((warning, idx) => (
                  <li key={idx}>{warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Terrain Section */}
      <Section
        title="Terrain Analysis"
        isExpanded={expandedSections.terrain}
        onToggle={() => toggleSection('terrain')}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatItem label="Elevation" value={`${data.terrain?.elevationM || 0} m`} />
          <StatItem label="Slope" value={`${data.terrain?.slopePercent || 0}%`} />
          <StatItem label="Slope Category" value={data.terrain?.slopeCategory || 'Unknown'} />
          <StatItem label="Landform" value={data.terrain?.landform || 'Unknown'} />
        </div>
      </Section>

      {/* Soil Section */}
      <Section
        title="Soil Analysis"
        isExpanded={expandedSections.soil}
        onToggle={() => toggleSection('soil')}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <StatItem label="Soil Type" value={data.soil?.type || 'Unknown'} />
          <StatItem label="Bearing Capacity" value={`${data.soil?.bearingCapacityKpa || 0} kPa`} />
          <StatItem label="Shrink-Swell Risk" value={data.soil?.shrinkSwellRisk || 'Unknown'} />
          <StatItem label="Excavation" value={data.soil?.excavationDifficulty || 'Unknown'} />
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-dark-500">Recommended Foundation</p>
          <p className="text-sm text-gray-600">{data.soil?.recommendedFoundation || 'Standard strip footing'}</p>
        </div>
      </Section>

      {/* Flood Risk Section */}
      <Section
        title="Flood Risk Assessment"
        isExpanded={expandedSections.flood}
        onToggle={() => toggleSection('flood')}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatItem 
            label="Risk Level" 
            value={data.floodRisk?.riskLevel || 'Low'} 
            status={data.floodRisk?.riskLevel === 'High' ? 'danger' : data.floodRisk?.riskLevel === 'Moderate' ? 'warning' : 'success'}
          />
          <StatItem label="Flood Zone" value={data.floodRisk?.floodZone || 'Zone X'} />
          <StatItem label="Distance to River" value={`${data.floodRisk?.distanceToRiverM || 0} m`} />
        </div>
        {data.floodRisk?.riskLevel !== 'Low' && (
          <div className="mt-3 p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-red-700">
              ⚠️ Flood mitigation measures recommended: elevate building, install drainage, use flood-resistant materials.
            </p>
          </div>
        )}
      </Section>

      {/* Climate Section */}
      <Section
        title="Climate Data"
        isExpanded={false}
        onToggle={() => toggleSection('climate')}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatItem label="Rainfall" value={`${data.climate?.rainfallMmYear || 0} mm/year`} />
          <StatItem label="Avg Temperature" value={`${data.climate?.avgTemperatureC || 0}°C`} />
          <StatItem label="Sun Hours" value={`${data.climate?.sunHoursDay || 0} hrs/day`} />
          <StatItem label="Wind Speed" value={`${data.climate?.windSpeedMs || 0} m/s`} />
        </div>
      </Section>

      {/* Utilities Section */}
      <Section
        title="Utilities Access"
        isExpanded={expandedSections.utilities}
        onToggle={() => toggleSection('utilities')}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatItem label="Grid Distance" value={`${data.utilities?.gridDistanceM || 0} m`} />
          <StatItem label="Water Distance" value={`${data.utilities?.waterDistanceM || 0} m`} />
          <StatItem label="Road Access" value={data.utilities?.roadType || 'Unknown'} />
          <StatItem label="Sewer Available" value={data.utilities?.sewerAvailable ? 'Yes' : 'No'} />
        </div>
      </Section>

      {/* Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-semibold text-green-800">Recommendations</p>
              <ul className="list-disc list-inside text-sm text-green-700 mt-1">
                {data.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function Section({ title, children, isExpanded, onToggle }: { 
  title: string; 
  children: React.ReactNode; 
  isExpanded: boolean; 
  onToggle: () => void;
}) {
  return (
    <Card className="overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
      >
        <h3 className="font-semibold text-dark-500">{title}</h3>
        {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>
      {isExpanded && <div className="p-4 pt-0 border-t">{children}</div>}
    </Card>
  );
}

function StatItem({ label, value, status }: { label: string; value: string; status?: 'success' | 'warning' | 'danger' }) {
  const statusColors = {
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
  };
  
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={cn('font-medium', status ? statusColors[status] : 'text-dark-500')}>{value}</p>
    </div>
  );
}