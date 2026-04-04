'use client';

import React, { useState } from 'react';

interface Site {
  id: string;
  name: string;
  location: string;
  probability: number;
  depth: number;
  yield: number;
}

interface SiteSelectorProps {
  sites: Site[];
  onSelect: (selectedIds: string[]) => void;
  maxSelections?: number;
}

export const SiteSelector: React.FC<SiteSelectorProps> = ({ sites, onSelect, maxSelections = 3 }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSite = (id: string) => {
    let newSelected: string[];
    if (selectedIds.includes(id)) {
      newSelected = selectedIds.filter(sid => sid !== id);
    } else {
      if (selectedIds.length >= maxSelections) {
        alert(`You can only compare up to ${maxSelections} sites`);
        return;
      }
      newSelected = [...selectedIds, id];
    }
    setSelectedIds(newSelected);
    onSelect(newSelected);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Select Sites to Compare</h3>
      <div style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
        Selected: {selectedIds.length} / {maxSelections}
      </div>
      
      <div style={{ display: 'grid', gap: '12px' }}>
        {sites.map(site => (
          <div
            key={site.id}
            onClick={() => toggleSite(site.id)}
            style={{
              padding: '16px',
              border: selectedIds.includes(site.id) ? '2px solid #4CAF50' : '1px solid #e0e0e0',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: selectedIds.includes(site.id) ? '#e8f5e9' : 'white',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>{site.name}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{site.location}</div>
              </div>
              {selectedIds.includes(site.id) && (
                <div style={{ color: '#4CAF50', fontSize: '20px' }}>✓</div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '12px' }}>
              <div>Success: {(site.probability * 100).toFixed(0)}%</div>
              <div>Depth: {site.depth}m</div>
              <div>Yield: {site.yield} m³/h</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};