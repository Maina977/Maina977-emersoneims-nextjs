'use client';

import React from 'react';

interface ResultsSummaryProps {
  results: {
    probability: number;
    recommendedDepth: number;
    estimatedYield: number;
    siteType: string;
    viability: string;
  };
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ results }) => {
  const getViabilityColor = (viability: string) => {
    switch(viability) {
      case 'high': return '#4CAF50';
      case 'medium': return '#FFC107';
      case 'low': return '#FF9800';
      default: return '#F44336';
    }
  };

  return (
    <div className="results-summary" style={{ padding: '20px' }}>
      <h3>Analysis Results</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <label>Success Probability</label>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
          {(results.probability * 100).toFixed(1)}%
        </div>
        <div style={{ backgroundColor: '#e0e0e0', borderRadius: '10px', height: '8px', marginTop: '8px' }}>
          <div style={{ width: `${results.probability * 100}%`, backgroundColor: '#4CAF50', height: '100%', borderRadius: '10px' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div>
          <label>Recommended Depth</label>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{results.recommendedDepth.toFixed(0)} m</div>
        </div>
        <div>
          <label>Estimated Yield</label>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{results.estimatedYield.toFixed(1)} m³/h</div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Site Type</label>
        <div style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase' }}>{results.siteType}</div>
      </div>

      <div>
        <label>Viability</label>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: getViabilityColor(results.viability) }}>
          {results.viability.toUpperCase()}
        </div>
      </div>
    </div>
  );
};