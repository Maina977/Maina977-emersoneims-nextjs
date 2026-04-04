// @ts-nocheck
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Sun, Battery, Zap, TrendingUp, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/helpers';
import { cn } from '@/lib/utils/helpers';

interface SolarPotentialProps {
  data: {
    sunHoursDay: number;
    solarIrradiance: number;
    roofAreaSqm: number;
    estimatedGenerationKwhYear: number;
    recommendedSystemKw: number;
    estimatedSavingsMonth: number;
    paybackYears: number;
  };
  onConfigure?: (systemKw: number, batteryKwh: number) => void;
}

export function SolarPotential({ data, onConfigure }: SolarPotentialProps) {
  const [systemSize, setSystemSize] = useState(data.recommendedSystemKw);
  const [batterySize, setBatterySize] = useState(10);
  const [showConfigurator, setShowConfigurator] = useState(false);

  const systemCost = systemSize * 170000; // Approx KES 170k per kW
  const batteryCost = batterySize * 25000; // Approx KES 25k per kWh
  const totalCost = systemCost + batteryCost;
  const annualSavings = systemSize * 1800 * 12; // Approx savings
  const paybackYears = totalCost / annualSavings;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Sun className="h-5 w-5 text-yellow-500" />}
          label="Sun Hours/Day"
          value={`${data.sunHoursDay} hrs`}
        />
        <StatCard
          icon={<Zap className="h-5 w-5 text-blue-500" />}
          label="Solar Irradiance"
          value={`${data.solarIrradiance} kWh/m²/day`}
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-green-500" />}
          label="Annual Generation"
          value={`${Math.round(data.estimatedGenerationKwhYear / 1000)} MWh`}
        />
        <StatCard
          icon={<DollarSign className="h-5 w-5 text-primary-500" />}
          label="Monthly Savings"
          value={formatCurrency(data.estimatedSavingsMonth)}
        />
      </div>

      {/* Recommended System */}
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="font-semibold text-green-800">Recommended Solar System</p>
            <p className="text-2xl font-bold text-green-700">{data.recommendedSystemKw} kW</p>
            <p className="text-sm text-green-600 mt-1">
              Estimated payback: {data.paybackYears} years
            </p>
          </div>
          <Button onClick={() => setShowConfigurator(!showConfigurator)} variant="outline">
            {showConfigurator ? 'Hide Configurator' : 'Customize System'}
          </Button>
        </div>
      </Card>

      {/* Solar Configurator */}
      {showConfigurator && (
        <Card className="p-4">
          <h3 className="font-semibold text-dark-500 mb-4">Solar System Configurator</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                System Size: {systemSize} kW
              </label>
              <Slider
                min={1}
                max={20}
                step={0.5}
                value={systemSize}
                onChange={(e) => setSystemSize(parseFloat(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Battery Storage: {batterySize} kWh
              </label>
              <Slider
                min={0}
                max={30}
                step={2}
                value={batterySize}
                onChange={(e) => setBatterySize(parseFloat(e.target.value))}
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>System Cost:</span>
                <span className="font-medium">{formatCurrency(systemCost)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Battery Cost:</span>
                <span className="font-medium">{formatCurrency(batteryCost)}</span>
              </div>
              <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                <span>Total Investment:</span>
                <span className="text-primary-600">{formatCurrency(totalCost)}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span>Annual Savings:</span>
                <span className="text-green-600">{formatCurrency(annualSavings)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Payback Period:</span>
                <span className="font-medium">{paybackYears.toFixed(1)} years</span>
              </div>
            </div>

            <Button 
              fullWidth 
              onClick={() => onConfigure?.(systemSize, batterySize)}
            >
              Apply This Configuration
            </Button>
          </div>
        </Card>
      )}

      {/* Roof Suitability */}
      <Card className="p-4">
        <h3 className="font-semibold text-dark-500 mb-3">Roof Suitability</h3>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm">Available roof area: {data.roofAreaSqm} m²</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm">Orientation: South-facing (optimal)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm">Shading: Minimal</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-semibold text-dark-500">{value}</p>
      </div>
    </div>
  );
}