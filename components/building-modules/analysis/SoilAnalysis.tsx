'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/helpers';

interface SoilAnalysisProps {
  data: {
    type: string;
    texture: string;
    bearingCapacityKpa: number;
    shrinkSwellRisk: string;
    excavationDifficulty: string;
    recommendedFoundation: string;
    ph?: number;
    organicMatter?: number;
    sand?: number;
    silt?: number;
    clay?: number;
  };
}

export function SoilAnalysis({ data }: SoilAnalysisProps) {
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getExcavationColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'hard': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Soil Type" value={data.type} />
        <StatCard label="Texture" value={data.texture} />
        <StatCard 
          label="Bearing Capacity" 
          value={`${data.bearingCapacityKpa} kPa`}
          subtext={data.bearingCapacityKpa < 100 ? 'Low - requires reinforcement' : data.bearingCapacityKpa > 150 ? 'Good' : 'Adequate'}
        />
        <StatCard 
          label="Shrink-Swell Risk" 
          value={data.shrinkSwellRisk}
          badge={getRiskColor(data.shrinkSwellRisk)}
        />
        <StatCard 
          label="Excavation Difficulty" 
          value={data.excavationDifficulty}
          badge={getExcavationColor(data.excavationDifficulty)}
        />
        <StatCard label="Recommended Foundation" value={data.recommendedFoundation} />
      </div>

      {/* Soil Composition Chart */}
      {(data.sand !== undefined || data.silt !== undefined || data.clay !== undefined) && (
        <Card className="p-4">
          <h3 className="font-semibold text-dark-500 mb-3">Soil Composition</h3>
          <div className="flex h-8 rounded-lg overflow-hidden">
            {data.sand !== undefined && (
              <div 
                className="bg-yellow-500 flex items-center justify-center text-xs text-white"
                style={{ width: `${data.sand}%` }}
              >
                {data.sand > 10 && `${Math.round(data.sand)}% Sand`}
              </div>
            )}
            {data.silt !== undefined && (
              <div 
                className="bg-orange-500 flex items-center justify-center text-xs text-white"
                style={{ width: `${data.silt}%` }}
              >
                {data.silt > 10 && `${Math.round(data.silt)}% Silt`}
              </div>
            )}
            {data.clay !== undefined && (
              <div 
                className="bg-brown-500 flex items-center justify-center text-xs text-white"
                style={{ width: `${data.clay}%` }}
              >
                {data.clay > 10 && `${Math.round(data.clay)}% Clay`}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Chemical Properties */}
      {(data.ph !== undefined || data.organicMatter !== undefined) && (
        <Card className="p-4">
          <h3 className="font-semibold text-dark-500 mb-3">Chemical Properties</h3>
          <div className="grid grid-cols-2 gap-4">
            {data.ph !== undefined && (
              <div>
                <p className="text-sm text-gray-500">pH Level</p>
                <p className="font-medium">{data.ph}</p>
                <p className="text-xs text-gray-400">
                  {data.ph < 6 ? 'Acidic - may require lime treatment' : data.ph > 7.5 ? 'Alkaline' : 'Neutral - ideal'}
                </p>
              </div>
            )}
            {data.organicMatter !== undefined && (
              <div>
                <p className="text-sm text-gray-500">Organic Matter</p>
                <p className="font-medium">{data.organicMatter}%</p>
                <p className="text-xs text-gray-400">
                  {data.organicMatter > 5 ? 'High - may cause settlement' : 'Normal'}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Foundation Recommendation Detail */}
      <Card className="p-4 bg-primary-50">
        <h3 className="font-semibold text-dark-500 mb-2">Foundation Recommendation</h3>
        <p className="text-sm text-gray-700">
          Based on soil analysis, a <strong>{data.recommendedFoundation}</strong> foundation is recommended.
        </p>
        <div className="mt-3 p-3 bg-white rounded-lg text-sm">
          <p className="font-medium">Key Considerations:</p>
          <ul className="list-disc list-inside mt-1 text-gray-600">
            <li>Ensure proper drainage away from foundation</li>
            <li>Compaction testing required during backfill</li>
            <li>Consider waterproofing for expansive soils</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}

function StatCard({ label, value, subtext, badge }: { 
  label: string; 
  value: string; 
  subtext?: string; 
  badge?: string;
}) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <p className="text-xs text-gray-500">{label}</p>
      {badge ? (
        <Badge variant="outline" className={cn('mt-1', badge)}>{value}</Badge>
      ) : (
        <p className="font-medium text-dark-500">{value}</p>
      )}
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
}