'use client';

import React from 'react';

interface Site {
  id: string;
  name: string;
  location: string;
  probability: number;
  depth: number;
  yield: number;
  soilType: string;
  waterQuality: number;
  risk: number;
  cost: number;
}

interface ComparisonTableProps {
  sites: Site[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ sites }) => {
  const getBest = (key: keyof Site, higherIsBetter: boolean = true) => {
    if (sites.length === 0) return null;
    let best = sites[0];
    for (const site of sites) {
      const value = site[key] as number;
      const bestValue = best[key] as number;
      if (higherIsBetter ? value > bestValue : value < bestValue) {
        best = site;
      }
    }
    return best.id;
  };

  const bestProbability = getBest('probability', true);
  const bestYield = getBest('yield', true);
  const bestWaterQuality = getBest('waterQuality', true);
  const lowestRisk = getBest('risk', false);
  const lowestCost = getBest('cost', false);

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#4CAF50', color: 'white' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Parameter</th>
            {sites.map(site => (
              <th key={site.id} style={{ padding: '12px', textAlign: 'left' }}>
                {site.name}
                <div style={{ fontSize: '10px', fontWeight: 'normal' }}>{site.location}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
            <td style={{ padding: '12px', fontWeight: 'bold' }}>Success Probability</td>
            {sites.map(site => (
              <td key={site.id} style={{ 
                padding: '12px',
                backgroundColor: bestProbability === site.id ? '#e8f5e9' : 'transparent',
                fontWeight: bestProbability === site.id ? 'bold' : 'normal'
              }}>
                {(site.probability * 100).toFixed(0)}%
                {bestProbability === site.id && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#4CAF50' }}>🏆 Best</span>}
              </td>
            ))}
          </tr>
          
          <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
            <td style={{ padding: '12px', fontWeight: 'bold' }}>Recommended Depth</td>
            {sites.map(site => (
              <td key={site.id} style={{ padding: '12px' }}>{site.depth}m</td>
            ))}
          </tr>
          
          <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
            <td style={{ padding: '12px', fontWeight: 'bold' }}>Estimated Yield</td>
            {sites.map(site => (
              <td key={site.id} style={{ 
                padding: '12px',
                backgroundColor: bestYield === site.id ? '#e8f5e9' : 'transparent',
                fontWeight: bestYield === site.id ? 'bold' : 'normal'
              }}>
                {site.yield} m³/h
                {bestYield === site.id && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#4CAF50' }}>🏆 Best</span>}
              </td>
            ))}
          </tr>
          
          <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
            <td style={{ padding: '12px', fontWeight: 'bold' }}>Soil Type</td>
            {sites.map(site => (
              <td key={site.id} style={{ padding: '12px', textTransform: 'uppercase' }}>{site.soilType}</td>
            ))}
          </tr>
          
          <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
            <td style={{ padding: '12px', fontWeight: 'bold' }}>Water Quality Score</td>
            {sites.map(site => (
              <td key={site.id} style={{ 
                padding: '12px',
                backgroundColor: bestWaterQuality === site.id ? '#e8f5e9' : 'transparent',
                fontWeight: bestWaterQuality === site.id ? 'bold' : 'normal'
              }}>
                {(site.waterQuality * 100).toFixed(0)}%
                {bestWaterQuality === site.id && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#4CAF50' }}>🏆 Best</span>}
              </td>
            ))}
          </tr>
          
          <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
            <td style={{ padding: '12px', fontWeight: 'bold' }}>Risk Score</td>
            {sites.map(site => (
              <td key={site.id} style={{ 
                padding: '12px',
                backgroundColor: lowestRisk === site.id ? '#e8f5e9' : 'transparent',
                fontWeight: lowestRisk === site.id ? 'bold' : 'normal',
                color: site.risk > 0.6 ? '#F44336' : site.risk > 0.3 ? '#FFC107' : '#4CAF50'
              }}>
                {(site.risk * 100).toFixed(0)}%
                {lowestRisk === site.id && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#4CAF50' }}>🏆 Lowest</span>}
              </td>
            ))}
          </tr>
          
          <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
            <td style={{ padding: '12px', fontWeight: 'bold' }}>Estimated Cost</td>
            {sites.map(site => (
              <td key={site.id} style={{ 
                padding: '12px',
                backgroundColor: lowestCost === site.id ? '#e8f5e9' : 'transparent',
                fontWeight: lowestCost === site.id ? 'bold' : 'normal'
              }}>
                ${site.cost.toLocaleString()}
                {lowestCost === site.id && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#4CAF50' }}>🏆 Lowest</span>}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};