'use client';

import React from 'react';

interface RiskMatrixProps {
  risks: {
    geological: number;
    contamination: number;
    depth: number;
    financial: number;
    technical: number;
  };
}

export const RiskMatrix: React.FC<RiskMatrixProps> = ({ risks }) => {
  const getRiskLevel = (score: number) => {
    if (score < 0.3) return { text: 'Low', color: '#4CAF50' };
    if (score < 0.6) return { text: 'Medium', color: '#FFC107' };
    if (score < 0.8) return { text: 'High', color: '#FF9800' };
    return { text: 'Critical', color: '#F44336' };
  };
  
  const riskCategories = [
    { key: 'geological', label: 'Geological Risk', icon: '🌍' },
    { key: 'contamination', label: 'Contamination Risk', icon: '⚠️' },
    { key: 'depth', label: 'Depth Risk', icon: '📏' },
    { key: 'financial', label: 'Financial Risk', icon: '💰' },
    { key: 'technical', label: 'Technical Risk', icon: '🔧' }
  ];
  
  return (
    <div className="risk-matrix">
      <h3>Risk Assessment Matrix</h3>
      <div style={{ display: 'grid', gap: '15px' }}>
        {riskCategories.map(cat => {
          const score = risks[cat.key as keyof typeof risks];
          const level = getRiskLevel(score);
          return (
            <div key={cat.key} style={{ 
              backgroundColor: '#f9f9f9', 
              borderRadius: '8px', 
              padding: '15px',
              borderLeft: `4px solid ${level.color}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '24px', marginRight: '10px' }}>{cat.icon}</span>
                  <strong>{cat.label}</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: level.color }}>
                    {(score * 100).toFixed(0)}%
                  </div>
                  <div style={{ fontSize: '12px', color: level.color }}>{level.text}</div>
                </div>
              </div>
              <div style={{ 
                marginTop: '10px', 
                backgroundColor: '#e0e0e0', 
                borderRadius: '5px',
                height: '8px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: `${score * 100}%`, 
                  backgroundColor: level.color, 
                  height: '100%',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};