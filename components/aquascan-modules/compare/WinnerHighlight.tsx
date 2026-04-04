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

interface WinnerHighlightProps {
  winner: Site;
  metrics: {
    probability: boolean;
    yield: boolean;
    waterQuality: boolean;
    risk: boolean;
    cost: boolean;
  };
}

export const WinnerHighlight: React.FC<WinnerHighlightProps> = ({ winner, metrics }) => {
  const winCount = Object.values(metrics).filter(Boolean).length;

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      padding: '24px',
      color: 'white',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
      <h2 style={{ margin: 0, marginBottom: '8px' }}>Recommended Site</h2>
      <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>{winner.name}</div>
      <div style={{ opacity: 0.9, marginBottom: '16px' }}>{winner.location}</div>
      
      <div style={{ 
        display: 'inline-block',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: '20px',
        padding: '8px 16px',
        marginBottom: '20px'
      }}>
        Wins {winCount} of 5 categories
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginTop: '20px' }}>
        {metrics.probability && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '8px' }}>
            <div>🎯 Success Rate</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{(winner.probability * 100).toFixed(0)}%</div>
          </div>
        )}
        {metrics.yield && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '8px' }}>
            <div>💧 Yield</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{winner.yield} m³/h</div>
          </div>
        )}
        {metrics.waterQuality && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '8px' }}>
            <div>💎 Water Quality</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{(winner.waterQuality * 100).toFixed(0)}%</div>
          </div>
        )}
        {metrics.risk && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '8px' }}>
            <div>⚠️ Risk Score</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{(winner.risk * 100).toFixed(0)}%</div>
          </div>
        )}
        {metrics.cost && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '8px' }}>
            <div>💰 Cost</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>${winner.cost.toLocaleString()}</div>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '24px' }}>
        <button
          onClick={() => window.location.href = `/analysis/${winner.id}`}
          style={{
            padding: '12px 24px',
            backgroundColor: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          View Full Analysis
        </button>
      </div>
    </div>
  );
};