// components/hero/HeroCanvas.tsx - WebGL Intelligent Core
/// <reference types="@react-three/fiber" />
'use client';

import { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Float, Text3D, MeshDistortMaterial, 
  Environment, Sphere, GradientTexture 
} from '@react-three/drei';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';

interface PerformanceConfig {
  dpr?: number;
  shadows?: boolean;
  particles?: number;
  quality?: 'low' | 'medium' | 'high';
}

interface HeroCanvasProps {
  config: PerformanceConfig;
  prefersReducedMotion?: boolean;
  progress: MotionValue<number>;
}

function IntelligentCore({ progress, config }: { progress: MotionValue<number>; config: PerformanceConfig }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  // Create particle system
  const particles = useMemo(() => {
    const count = config.particles || 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const radius = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Energy color gradient
      colors[i * 3] = 1.0;     // R
      colors[i * 3 + 1] = 0.7; // G
      colors[i * 3 + 2] = 0.1; // B
    }
    
    return { positions, colors };
  }, [config.particles]);
  
  // Animation frame
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.05;
      meshRef.current.rotation.y = time * 0.1;
      meshRef.current.scale.setScalar(1 + Math.sin(time * 0.5) * 0.05);
    }
    
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.z = time * 0.2;
    }
    
    // Animate particles based on scroll progress
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.02;
      const pulse = Math.sin(time * 2) * 0.5 + 0.5;
      if (particlesRef.current.material instanceof THREE.PointsMaterial) {
        particlesRef.current.material.opacity = 0.3 + pulse * 0.2;
      }
    }
  });
  
  return (
    <group>
      {/* Main energy sphere */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere ref={meshRef} args={[2, 64, 64]}>
          <MeshDistortMaterial
            color="#ffb703"
            emissive="#ffb703"
            emissiveIntensity={0.3}
            roughness={0.1}
            metalness={0.9}
            distort={0.4}
            speed={2}
          />
        </Sphere>
      </Float>
      
      {/* Inner core */}
      <Sphere ref={innerCoreRef} args={[0.8, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#00ffff" toneMapped={false} />
      </Sphere>
      
      {/* Particle field */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={config.particles || 2000}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={config.particles || 2000}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Animated rings */}
      <Ring radius={3} thickness={0.02} speed={0.5} color="#ffb703" />
      <Ring radius={4} thickness={0.015} speed={0.3} color="#00ffff" />
    </group>
  );
}

function Ring({ radius, thickness, speed, color }: { radius: number; thickness: number; speed: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.getElapsedTime() * speed;
    }
  });
  
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, thickness, 16, 100]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

function SceneSetup() {
  const { scene } = useThree();
  
  useEffect(() => {
    scene.background = new THREE.Color('#08080c');
    scene.fog = new THREE.Fog('#08080c', 5, 15);
    
    return () => {
      scene.fog = null;
    };
  }, [scene]);
  
  return null;
}

function ScrollCamera({ progress }: { progress: MotionValue<number> }) {
  const { camera } = useThree();
  
  useFrame(() => {
    // Smooth camera movement based on scroll
    const z = 10 + progress.get() * 2;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, z, 0.05);
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

export default function HeroCanvas({ config, prefersReducedMotion = false, progress }: HeroCanvasProps) {
  return (
    <div className="webgl-container">
      <Canvas
        dpr={config.dpr}
        camera={{ position: [0, 0, 10], fov: 50 }}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <SceneSetup />
          
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffb703" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />
          
          {!prefersReducedMotion && (
            <IntelligentCore progress={progress} config={config} />
          )}
          
          <Environment preset="studio" />
          
          {/* Camera movement based on scroll */}
          <ScrollCamera progress={progress} />
        </Suspense>
      </Canvas>
    </div>
  );
}

