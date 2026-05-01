'use client';

import React, { useState } from 'react';
import { SiteSelector } from './SiteSelector';
import { ComparisonTable } from './ComparisonTable';
import { ComparisonChart } from './ComparisonChart';
import { WinnerHighlight } from './WinnerHighlight';

const DEMO_SITES = [
  { id: '1', name: 'Nairobi Central', location: 'Nairobi, Kenya', probability: 0.78, depth: 45, yield: 12.5, soilType: 'Alluvial', waterQuality: 88, risk: 15, cost: 280000 },
  { id: '2', name: 'Kisumu Waterfront', location: 'Kisumu, Kenya', probability: 0.65, depth: 38, yield: 9.8, soilType: 'Lacustrine', waterQuality: 76, risk: 25, cost: 220000 },
  { id: '3', name: 'Mombasa Coast', location: 'Mombasa, Kenya', probability: 0.82, depth: 52, yield: 14.2, soilType: 'Coastal Sand', waterQuality: 91, risk: 18, cost: 310000 },
  { id: '4', name: 'Nakuru Valley', location: 'Nakuru, Kenya', probability: 0.71, depth: 41, yield: 11.0, soilType: 'Volcanic', waterQuality: 82, risk: 20, cost: 260000 },
  { id: '5', name: 'Eldoret Highland', location: 'Eldoret, Kenya', probability: 0.69, depth: 48, yield: 10.5, soilType: 'Red Clay', waterQuality: 79, risk: 22, cost: 245000 },
];

export default function CompareHub() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const selectedSites = DEMO_SITES.filter(s => selectedIds.includes(s.id));

  const winner = selectedSites.length > 0
    ? selectedSites.reduce((best, s) => (s.probability > best.probability ? s : best), selectedSites[0])
    : null;

  const winnerMetrics = winner ? {
    probability: winner.probability === Math.max(...selectedSites.map(s => s.probability)),
    yield: winner.yield === Math.max(...selectedSites.map(s => s.yield)),
    waterQuality: winner.waterQuality === Math.max(...selectedSites.map(s => s.waterQuality)),
    risk: winner.risk === Math.min(...selectedSites.map(s => s.risk)),
    cost: winner.cost === Math.min(...selectedSites.map(s => s.cost)),
  } : { probability: false, yield: false, waterQuality: false, risk: false, cost: false };

  const chartSites = selectedSites.map(s => ({
    ...s,
    costEfficiency: Math.round((s.yield / (s.cost / 100000)) * 10) / 10,
  }));

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', padding: '1.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 0.25rem', fontSize: 'clamp(1.25rem,4vw,1.75rem)', fontWeight: 700, color: '#1e293b' }}>
          💧 Site Comparison Tool
        </h1>
        <p style={{ margin: '0 0 1.5rem', color: '#64748b', fontSize: '0.875rem' }}>
          Select up to 3 sites to compare borehole viability, yield, water quality and cost.
        </p>

        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '1.5rem', overflow: 'hidden' }}>
          <SiteSelector sites={DEMO_SITES} onSelect={setSelectedIds} maxSelections={3} />
        </div>

        {selectedSites.length >= 2 ? (
          <>
            {winner && (
              <div style={{ marginBottom: '1.5rem' }}>
                <WinnerHighlight winner={winner} metrics={winnerMetrics} />
              </div>
            )}
            <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '1.5rem', overflow: 'hidden' }}>
              <ComparisonTable sites={selectedSites} />
            </div>
            <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <ComparisonChart sites={chartSites} />
            </div>
          </>
        ) : (
          <div style={{ background: 'white', borderRadius: 12, padding: '3rem', textAlign: 'center', color: '#94a3b8', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
            <p style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.5rem' }}>Select at least 2 sites to compare</p>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>Choose sites from the selector above to see a full comparison.</p>
          </div>
        )}
      </div>
    </div>
  );
}
