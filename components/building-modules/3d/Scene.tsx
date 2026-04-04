'use client';

// @ts-nocheck - External module, skip type checking
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Html } from '@react-three/drei';
import { Suspense } from 'react';
import { HouseModel } from './HouseModel';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { cn } from '@/lib/utils/helpers';

interface SceneProps {
  designData?: any;
  showControls?: boolean;
  interactive?: boolean;
  className?: string;
}

export function Scene({ designData, showControls = true, interactive = true, className }: SceneProps) {
  return (
    <div className={cn('w-full h-full min-h-[400px] rounded-lg overflow-hidden', className)}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[10, 8, 12]} fov={45} />
        
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, 5, 5]} intensity={0.5} />
        
        <Suspense fallback={<Html center><LoadingSpinner size="lg" /></Html>}>
          <HouseModel designData={designData} />
          <Environment preset="city" />
        </Suspense>
        
        {showControls && (
          <OrbitControls
            enableZoom={interactive}
            enablePan={interactive}
            enableRotate={interactive}
            zoomSpeed={1}
            panSpeed={0.5}
            rotateSpeed={0.5}
          />
        )}
      </Canvas>
    </div>
  );
}