'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';

interface Controls3DProps {
  onRotate: (angle: number) => void;
  onZoom: (level: number) => void;
  onReset: () => void;
  onToggleView: (view: 'exterior' | 'interior' | 'roof') => void;
}

export function Controls3D({ onRotate, onZoom, onReset, onToggleView }: Controls3DProps) {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);

  const handleRotate = (value: number) => {
    setRotation(value);
    onRotate(value);
  };

  const handleZoom = (value: number) => {
    setZoom(value);
    onZoom(value);
  };

  return (
    <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 space-y-3 min-w-[200px] z-10">
      <p className="text-xs font-medium text-gray-500">3D Controls</p>
      
      <div>
        <label className="text-xs text-gray-500 block mb-1">Rotate</label>
        <Slider
          min={0}
          max={360}
          value={rotation}
          onChange={(value) => handleRotate(value)}
        />
      </div>
      
      <div>
        <label className="text-xs text-gray-500 block mb-1">Zoom</label>
        <Slider
          min={0.5}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(value) => handleZoom(value)}
        />
      </div>
      
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={onReset}>
          Reset
        </Button>
        <Button size="sm" variant="outline" onClick={() => onToggleView('exterior')}>
          Exterior
        </Button>
        <Button size="sm" variant="outline" onClick={() => onToggleView('roof')}>
          Roof
        </Button>
      </div>
    </div>
  );
}