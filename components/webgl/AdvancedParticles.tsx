'use client';

/**
 * ADVANCED PARTICLE SYSTEM
 * Confetti, energy particles, and advanced effects
 */

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh, Vector3, Color } from 'three';
import * as THREE from 'three';
import { PerspectiveCamera } from '@react-three/drei';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ParticleProps {
  position: [number, number, number];
  velocity: Vector3;
  color: string;
  size: number;
  life: number;
}

function Particle({ position, velocity, color, size, life }: ParticleProps) {
  const meshRef = useRef<Mesh>(null);
  const lifeRef = useRef(life);
  const positionRef = useRef(new Vector3(...position));

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Update position
    positionRef.current.add(velocity.clone().multiplyScalar(delta));
    
    // Apply gravity
    velocity.y -= 9.8 * delta * 0.5;
    
    // Update mesh position
    meshRef.current.position.copy(positionRef.current);
    
    // Fade out
    lifeRef.current -= delta;
    const opacity = Math.max(0, lifeRef.current / life);
    
    if (meshRef.current.material) {
      (meshRef.current.material as any).opacity = opacity;
    }
    
    // Rotate
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <primitive object={new THREE.SphereGeometry(size, 8, 8)} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        transparent
        opacity={1}
      />
    </mesh>
  );
}

interface AdvancedParticlesProps {
  type?: 'confetti' | 'energy' | 'sparkles';
  count?: number;
  color?: string;
}

export default function AdvancedParticles({
  type = 'energy',
  count = 100,
  color = '#fbbf24',
}: AdvancedParticlesProps) {
  const prefersReducedMotion = useReducedMotion();
  
  const particles = useMemo(() => {
    if (prefersReducedMotion) return [];
    
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const radius = 5 + Math.random() * 5;
      
      return {
        position: [
          Math.cos(angle) * radius,
          Math.random() * 10,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        velocity: new Vector3(
          (Math.random() - 0.5) * 2,
          Math.random() * 3 + 1,
          (Math.random() - 0.5) * 2
        ),
        color: type === 'confetti' 
          ? ['#fbbf24', '#4a90e2', '#ff6b9d', '#00ff88'][Math.floor(Math.random() * 4)]
          : color,
        size: type === 'confetti' ? 0.1 : 0.05 + Math.random() * 0.1,
        life: 2 + Math.random() * 3,
      };
    });
  }, [count, type, color, prefersReducedMotion]);

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
        <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={60} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {particles.map((particle, i) => (
          <Particle key={i} {...particle} />
        ))}
      </Canvas>
    </div>
  );
}

