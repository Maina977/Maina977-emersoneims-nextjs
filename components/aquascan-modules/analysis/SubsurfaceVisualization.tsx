'use client';

import React, { useRef, useEffect } from 'react';

interface SubsurfaceVisualizationProps {
  soilLayers: Array<{ depth: number; type: string; resistivity: number }>;
  waterTableDepth: number;
  recommendedDepth: number;
}

export const SubsurfaceVisualization: React.FC<SubsurfaceVisualizationProps> = ({
  soilLayers,
  waterTableDepth,
  recommendedDepth
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const maxDepth = Math.max(...soilLayers.map(l => l.depth), recommendedDepth) + 20;

    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);

    // Draw soil layers
    let currentY = 0;
    for (const layer of soilLayers) {
      const layerHeight = (layer.depth / maxDepth) * height;
      
      // Color based on soil type
      const colors: Record<string, string> = {
        sandy: '#F4A460',
        clay: '#CD853F',
        loamy: '#D2B48C',
        rocky: '#808080',
        laterite: '#A0522D'
      };
      
      ctx.fillStyle = colors[layer.type] || '#D2B48C';
      ctx.fillRect(0, currentY, width, layerHeight);
      
      // Add texture/pattern
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      for (let i = 0; i < 50; i++) {
        ctx.fillRect(Math.random() * width, currentY + Math.random() * layerHeight, 2, 2);
      }
      
      // Label
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.shadowBlur = 2;
      ctx.shadowColor = 'black';
      ctx.fillText(`${layer.type} (${layer.resistivity} Ωm)`, 10, currentY + 20);
      ctx.shadowBlur = 0;
      
      currentY += layerHeight;
    }

    // Draw water table
    const waterY = (waterTableDepth / maxDepth) * height;
    ctx.beginPath();
    ctx.moveTo(0, waterY);
    ctx.lineTo(width, waterY);
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#2196F3';
    ctx.font = '12px Arial';
    ctx.fillText(`Water Table (${waterTableDepth}m)`, 10, waterY - 5);

    // Draw recommended depth line
    const drillY = (recommendedDepth / maxDepth) * height;
    ctx.beginPath();
    ctx.moveTo(0, drillY);
    ctx.lineTo(width, drillY);
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#4CAF50';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(`Recommended Depth (${recommendedDepth}m)`, 10, drillY - 8);

    // Draw drill rig icon
    const drillX = width - 40;
    ctx.fillStyle = '#333';
    ctx.fillRect(drillX - 5, 0, 10, drillY);
    ctx.fillStyle = '#666';
    ctx.beginPath();
    ctx.moveTo(drillX - 10, drillY);
    ctx.lineTo(drillX, drillY + 10);
    ctx.lineTo(drillX + 10, drillY);
    ctx.fill();

    // Depth labels on Y-axis
    ctx.fillStyle = '#333';
    ctx.font = '10px Arial';
    for (let depth = 0; depth <= maxDepth; depth += 10) {
      const y = (depth / maxDepth) * height;
      ctx.fillText(`${depth}m`, width - 25, y);
    }

  }, [soilLayers, waterTableDepth, recommendedDepth]);

  return (
    <div style={{ padding: '20px' }}>
      <h3>Subsurface Visualization</h3>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        style={{
          width: '100%',
          height: 'auto',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}
      />
      <div style={{ fontSize: '12px', color: '#666', marginTop: '8px', textAlign: 'center' }}>
        Soil layer profile with water table and recommended drilling depth
      </div>
    </div>
  );
};