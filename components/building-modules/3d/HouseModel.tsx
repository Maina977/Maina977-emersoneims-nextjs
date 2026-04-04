'use client';

// @ts-nocheck - External module, skip type checking
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface HouseModelProps {
  designData?: {
    width?: number;
    depth?: number;
    height?: number;
    roofHeight?: number;
    color?: string;
    roofColor?: string;
    chimney?: boolean;
    pool?: boolean;
    garage?: boolean;
  };
}

export function HouseModel({ designData }: HouseModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const defaultDesign = {
    width: 8,
    depth: 10,
    height: 3,
    roofHeight: 1.5,
    color: '#e8d5b5',
    roofColor: '#b85c1a',
    chimney: true,
    pool: false,
    garage: true,
  };
  
  const design = { ...defaultDesign, ...designData };
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.01;
    }
  });
  
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Ground Shadow */}
      <Box
        args={[design.width + 2, 0.05, design.depth + 2]}
        position={[0, -0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial color="#aaa" transparent opacity={0.3} />
      </Box>
      
      {/* Foundation */}
      <Box
        args={[design.width + 0.2, 0.2, design.depth + 0.2]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial color="#9aa0a6" roughness={0.7} metalness={0.1} />
      </Box>
      
      {/* Main House Body */}
      <Box
        args={[design.width, design.height, design.depth]}
        position={[0, design.height / 2, 0]}
      >
        <meshStandardMaterial color={design.color} roughness={0.4} metalness={0.05} />
      </Box>
      
      {/* Roof */}
      <group position={[0, design.height, 0]}>
        {design.roofHeight > 0 ? (
          <Cylinder
            args={[design.width * 0.7, design.width * 0.85, design.roofHeight, 4]}
            position={[0, design.roofHeight / 2, 0]}
            rotation={[0, Math.PI / 4, 0]}
          >
            <meshStandardMaterial color={design.roofColor} roughness={0.6} />
          </Cylinder>
        ) : (
          <Box
            args={[design.width + 0.1, 0.2, design.depth + 0.1]}
            position={[0, 0, 0]}
          >
            <meshStandardMaterial color="#8c8c8c" roughness={0.8} />
          </Box>
        )}
      </group>
      
      {/* Chimney */}
      {design.chimney && (
        <group position={[design.width / 3, design.height + 0.2, design.depth / 3]}>
          <Box args={[0.5, 1.2, 0.5]} position={[0, 0.6, 0]}>
            <meshStandardMaterial color="#B87333" roughness={0.3} metalness={0.4} />
          </Box>
          <Box args={[0.4, 0.3, 0.4]} position={[0, 1.2, 0]}>
            <meshStandardMaterial color="#8B4513" />
          </Box>
        </group>
      )}
      
      {/* Windows */}
      <Window position={[design.width / 2 + 0.05, 1.2, 2]} rotation={[0, Math.PI / 2, 0]} />
      <Window position={[-design.width / 2 - 0.05, 1.2, 2]} rotation={[0, -Math.PI / 2, 0]} />
      <Window position={[1.5, 1.2, design.depth / 2 + 0.05]} rotation={[0, 0, 0]} />
      <Window position={[-1.5, 1.2, design.depth / 2 + 0.05]} rotation={[0, 0, 0]} />
      
      {/* Door */}
      <Door position={[0, 0.9, design.depth / 2 + 0.05]} />
      
      {/* Garage (simplified) */}
      {design.garage && (
        <Box
          args={[3, 2.5, 3]}
          position={[design.width / 2 + 1.5, 1.25, design.depth / 2]}
        >
          <meshStandardMaterial color="#c0a080" />
        </Box>
      )}
    </group>
  );
}

function Window({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      <Box args={[1.2, 1.2, 0.05]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#87CEEB" emissive="#4682B4" emissiveIntensity={0.2} />
      </Box>
      <Box args={[1.3, 0.05, 0.1]} position={[0, 0, 0.05]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      <Box args={[0.05, 1.3, 0.1]} position={[0, 0, 0.05]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
    </group>
  );
}

function Door({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, 0, 0]}>
      <Box args={[0.9, 2, 0.08]} position={[0, 1, 0.02]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      <Sphere args={[0.03]} position={[0.35, 1, 0.08]}>
        <meshStandardMaterial color="#DAA520" metalness={0.8} />
      </Sphere>
    </group>
  );
}