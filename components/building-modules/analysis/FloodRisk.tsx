'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle, Droplet, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils/helpers';

interface FloodRiskProps {
  data: {
    riskLevel: 'low' | 'moderate' | 'high' | 'extreme';
    floodZone: string;
    distanceToRiverM: number;
    historicalFloods: boolean;
    floodDepthPotential?: number;
    mitigationRecommendations?: string[];
  };
}

export function FloodRisk({ data }: FloodRiskProps) {
  const getRiskConfig = () => {
    switch (data.riskLevel) {
      case 'extreme':
        return { color: 'bg-red-700', text: 'Extreme Risk', icon: AlertTriangle, bg: 'bg-red-50', border: 'border-red-200' };
      case 'high':
        return { color: 'bg-red-500', text: 'High Risk', icon: AlertTriangle, bg: 'bg-red-50', border: 'border-red-200' };
      case 'moderate':
        return { color: 'bg-yellow-500', text: 'Moderate Risk', icon: Droplet, bg: 'bg-yellow-50', border: 'border-yellow-200' };
      default:
        return { color: 'bg-green-500', text: 'Low Risk', icon: Droplet, bg: 'bg-green-50', border: 'border-green-200' };
    }
  };

  const riskConfig = getRiskConfig();
  const Icon = riskConfig.icon;

  const defaultMitigations = [
    'Elevate building floor level above base flood elevation',
    'Install flood vents in foundation walls',
    'Use flood-resistant materials for lower levels',
    'Ensure proper drainage and grading away from building',
  ];

  const mitigations = data.mitigationRecommendations || defaultMitigations;

  return (
    <div className="space-y-4">
      {/* Risk Level Banner */}
      <div className={cn('p-4 rounded-lg border', riskConfig.bg, riskConfig.border)}>
        <div className="flex items-center gap-3">
          <Icon className={cn('h-6 w-6', riskConfig.color === 'bg-red-500' ? 'text-red-600' : 'text-yellow-600')} />
          <div>
            <p className="font-semibold">Flood Risk Assessment</p>
            <Badge variant="outline" className={cn('mt-1', riskConfig.bg)}>
              {riskConfig.text}
            </Badge>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="FEMA Flood Zone" value={data.floodZone} />
        <StatCard label="Distance to Water Body" value={`${data.distanceToRiverM} m`} />
        <StatCard 
          label="Historical Flooding" 
          value={data.historicalFloods ? 'Yes' : 'No'} 
          status={data.historicalFloods ? 'danger' : 'success'}
        />
        {data.floodDepthPotential && (
          <StatCard label="Potential Flood Depth" value={`${data.floodDepthPotential} m`} />
        )}
      </div>

      {/* Flood Map Placeholder */}
      <Card className="p-4">
        <h3 className="font-semibold text-dark-500 mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Flood Risk Map
        </h3>
        <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center">
          <p className="text-gray-400 text-sm">Flood map visualization would appear here</p>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          * Based on FEMA/Global Flood Database data
        </p>
      </Card>

      {/* Mitigation Measures */}
      <Card className="p-4">
        <h3 className="font-semibold text-dark-500 mb-3">Recommended Mitigation Measures</h3>
        <ul className="space-y-2">
          {mitigations.map((measure, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 text-xs font-bold">{idx + 1}</span>
              </div>
              <span className="text-gray-700">{measure}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Warning for High Risk */}
      {(data.riskLevel === 'high' || data.riskLevel === 'extreme') && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">High Flood Risk Area</p>
              <p className="text-sm text-red-700 mt-1">
                This property is located in a high flood risk zone. Flood insurance is strongly recommended.
                Consider alternative site or significant elevation measures.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, status }: { label: string; value: string; status?: 'success' | 'danger' }) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={cn('font-medium', status === 'danger' ? 'text-red-600' : status === 'success' ? 'text-green-600' : 'text-dark-500')}>
        {value}
      </p>
    </div>
  );
}