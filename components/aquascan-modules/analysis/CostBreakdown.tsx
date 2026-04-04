'use client';

import React from 'react';

interface CostBreakdownProps {
  depth: number;
  soilType: string;
  contaminationRisk: number;
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({ depth, soilType, contaminationRisk }) => {
  const calculateCosts = () => {
    // Cost factors
    const drillingCostPerMeter = 50;
    const casingCostPerMeter = 30;
    const screenCostPerMeter = 25;
    const pumpCost = 500;
    const mobilizationCost = 1000;
    
    // Soil type multiplier
    const soilMultipliers: Record<string, number> = {
      sandy: 1.0,
      loamy: 1.2,
      clay: 1.5,
      rocky: 2.0,
      laterite: 1.3
    };
    
    const soilMultiplier = soilMultipliers[soilType] || 1.2;
    const contaminationMultiplier = 1 + contaminationRisk * 0.5;
    
    const drilling = depth * drillingCostPerMeter * soilMultiplier;
    const casing = depth * casingCostPerMeter * soilMultiplier;
    const screen = depth * screenCostPerMeter;
    const pump = pumpCost;
    const mobilization = mobilizationCost;
    
    let contingency = (drilling + casing + screen + pump + mobilization) * 0.15;
    let total = drilling + casing + screen + pump + mobilization + contingency;
    
    // Apply contamination multiplier
    total *= contaminationMultiplier;
    contingency *= contaminationMultiplier;
    
    return {
      drilling,
      casing,
      screen,
      pump,
      mobilization,
      contingency,
      total
    };
  };
  
  const costs = calculateCosts();
  
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
  };
  
  const costItems = [
    { label: 'Drilling', amount: costs.drilling, icon: '🔨' },
    { label: 'Casing', amount: costs.casing, icon: '📦' },
    { label: 'Screen', amount: costs.screen, icon: '🔧' },
    { label: 'Pump Installation', amount: costs.pump, icon: '💧' },
    { label: 'Mobilization', amount: costs.mobilization, icon: '🚚' },
    { label: 'Contingency (15%)', amount: costs.contingency, icon: '⚠️' }
  ];
  
  return (
    <div className="cost-breakdown">
      <h3>Cost Estimation</h3>
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px', 
        padding: '20px',
        marginBottom: '20px'
      }}>
        {costItems.map((item, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '10px 0',
            borderBottom: index < costItems.length - 1 ? '1px solid #e0e0e0' : 'none'
          }}>
            <div>
              <span style={{ marginRight: '10px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
            <div style={{ fontWeight: 'bold' }}>{formatMoney(item.amount)}</div>
          </div>
        ))}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          padding: '15px 0 5px',
          borderTop: '2px solid #ccc',
          marginTop: '5px',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          <div>Total Estimated Cost</div>
          <div style={{ color: '#4CAF50' }}>{formatMoney(costs.total)}</div>
        </div>
      </div>
      <div style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
        * Estimates based on current market rates. Actual costs may vary.
      </div>
    </div>
  );
};