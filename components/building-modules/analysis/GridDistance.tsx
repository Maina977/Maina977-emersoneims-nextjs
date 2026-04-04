'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Zap, AlertCircle, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/helpers';
import { cn } from '@/lib/utils/helpers';

interface GridDistanceProps {
  data: {
    distanceM: number;
    transformerCapacity: string;
    provider: string;
    estimatedCost: number;
    timelineDays: number;
  };
  onProceed?: (connect: boolean) => void;
}

export function GridDistance({ data, onProceed }: GridDistanceProps) {
  const [connectToGrid, setConnectToGrid] = useState(true);

  const solarAlternativeCost = 850000; // 5kW system
  const gridCost = data.estimatedCost;
  const savingsByGoingSolar = gridCost - solarAlternativeCost;
  const isSolarCheaper = solarAlternativeCost < gridCost;

  return (
    <div className="space-y-4">
      {/* Distance Display */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center gap-3">
          <Zap className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-sm text-blue-700">Distance to Nearest Grid Connection</p>
            <p className="text-2xl font-bold text-blue-800">{data.distanceM} meters</p>
            <p className="text-xs text-blue-600 mt-1">Provider: {data.provider}</p>
          </div>
        </div>
      </Card>

      {/* Cost Breakdown */}
      <Card className="p-4">
        <h3 className="font-semibold text-dark-500 mb-3">Connection Cost Breakdown</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Base Connection Fee</span>
            <span>{formatCurrency(25000)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Trenching ({data.distanceM}m @ KES 150/m)</span>
            <span>{formatCurrency(data.distanceM * 150)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Cabling ({data.distanceM}m @ KES 80/m)</span>
            <span>{formatCurrency(data.distanceM * 80)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Meter Installation</span>
            <span>{formatCurrency(15000)}</span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between font-bold">
            <span>Total Estimated Cost</span>
            <span className="text-primary-600">{formatCurrency(data.estimatedCost)}</span>
          </div>
        </div>
      </Card>

      {/* Alternative Comparison */}
      <Card className="p-4">
        <h3 className="font-semibold text-dark-500 mb-3">Compare with Solar Alternative</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className={cn('p-3 rounded-lg', connectToGrid ? 'bg-primary-50 border border-primary-200' : 'bg-gray-50')}>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-primary-500" />
              <span className="font-medium">Grid Connection</span>
            </div>
            <p className="text-lg font-bold">{formatCurrency(data.estimatedCost)}</p>
            <p className="text-xs text-gray-500">One-time cost</p>
          </div>
          <div className={cn('p-3 rounded-lg', !connectToGrid ? 'bg-primary-50 border border-primary-200' : 'bg-gray-50')}>
            <div className="flex items-center gap-2 mb-2">
              <Sun className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">Solar System (5kW)</span>
            </div>
            <p className="text-lg font-bold">{formatCurrency(solarAlternativeCost)}</p>
            <p className="text-xs text-gray-500">Includes battery backup</p>
          </div>
        </div>

        {isSolarCheaper && (
          <div className="mt-3 p-3 bg-green-50 rounded-lg flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-green-600" />
            <p className="text-sm text-green-700">
              Solar is {formatCurrency(Math.abs(savingsByGoingSolar))} cheaper than grid connection!
            </p>
          </div>
        )}

        <div className="mt-3">
          <Checkbox
            label="I want to connect to the national grid"
            checked={connectToGrid}
            onChange={(e) => setConnectToGrid(e.target.checked)}
          />
        </div>

        <Button 
          fullWidth 
          className="mt-4" 
          onClick={() => onProceed?.(connectToGrid)}
        >
          {connectToGrid ? 'Proceed with Grid Connection' : 'Consider Solar Alternative'}
        </Button>
      </Card>

      {/* Timeline Warning */}
      {connectToGrid && (
        <div className="p-3 bg-yellow-50 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-800 font-medium">Processing Timeline</p>
            <p className="text-xs text-yellow-700">
              Estimated {data.timelineDays} days for approval and installation.
              Apply early to avoid construction delays.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}