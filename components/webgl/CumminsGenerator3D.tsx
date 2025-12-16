'use client';

import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  PerspectiveCamera,
  MeshDistortMaterial,
  Text3D,
  Center,
  Float,
  Sparkles,
  ContactShadows
} from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Cummins Generator Base Structure
function GeneratorBase() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group>
      {/* Main Generator Body */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[3, 2, 1.5]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
          emissive="#fbbf24"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Cummins Logo Panel */}
      <mesh position={[0, 0.5, 0.76]}>
        <planeGeometry args={[1.5, 0.5]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Engine Block Details */}
      <mesh position={[-1.2, 0, 0]}>
        <boxGeometry args={[0.3, 1.5, 1.5]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>

      {/* Cooling Fins */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[1.2, -0.8 + i * 0.2, 0]}>
          <boxGeometry args={[0.1, 0.15, 1.5]} />
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Control Panel */}
      <mesh position={[0, 1.1, 0.5]}>
        <boxGeometry args={[1, 0.3, 0.1]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#00ffff"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Digital Display */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={i} position={[-0.6 + i * 0.4, 1.15, 0.56]}>
          <planeGeometry args={[0.2, 0.15]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={1}
          />
        </mesh>
      ))}

      {/* Exhaust Pipes */}
      {[-0.5, 0.5].map((x, i) => (
        <group key={i} position={[x, -1, 0.8]}>
          <mesh>
            <cylinderGeometry args={[0.15, 0.15, 0.5, 16]} />
            <meshStandardMaterial
              color="#1a1a1a"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          {/* Exhaust Glow */}
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.2, 16]} />
            <meshStandardMaterial
              color="#f59e0b"
              emissive="#f59e0b"
              emissiveIntensity={0.8}
              transparent
              opacity={0.6}
            />
          </mesh>
        </group>
      ))}

      {/* Power Cables */}
      {[-0.8, 0, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 0.5, -0.8]}>
          <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Energy Particles */}
      <Sparkles
        count={100}
        scale={[6, 6, 6]}
        size={2}
        speed={0.4}
        color="#fbbf24"
        opacity={0.6}
      />
    </group>
  );
}

// Holographic Data Display
function HolographicDisplay() {
  const displayRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (displayRef.current) {
      displayRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={displayRef} position={[4, 2, 0]}>
        {/* Holographic Panel */}
        <mesh>
          <planeGeometry args={[2, 1.5]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={0.3}
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Data Lines */}
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} position={[-0.8, 0.5 - i * 0.2, 0.01]}>
            <planeGeometry args={[1.6, 0.05]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={1}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// Energy Flow Visualization
function EnergyFlow() {
  const flowRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (flowRef.current) {
      const time = state.clock.elapsedTime;
      flowRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          child.position.y = Math.sin(time * 2 + i) * 0.5;
          child.material.opacity = 0.3 + Math.sin(time * 2 + i) * 0.3;
        }
      });
    }
  });

  return (
    <group ref={flowRef}>
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin((i / 20) * Math.PI * 2) * 2,
            (i / 20) * 4 - 2,
            Math.cos((i / 20) * Math.PI * 2) * 2,
          ]}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={1}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

interface CumminsGenerator3DProps {
  className?: string;
  prefersReducedMotion?: boolean;
  autoRotate?: boolean;
}

export default function CumminsGenerator3D({
  className = '',
  prefersReducedMotion = false,
  autoRotate = true,
}: CumminsGenerator3DProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  if (prefersReducedMotion) {
    return (
      <div className={`w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 rounded-lg bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-400/30" />
          <p className="text-text-secondary text-sm">Cummins Generator</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={canvasRef} className={`w-full h-full relative ${className}`}>
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={() => setIsLoaded(true)}
      >
        {/* Lighting Setup */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#fbbf24" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#00ffff" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          color="#ffffff"
        />

        {/* Environment */}
        <Environment preset="night" />

        {/* Main Generator */}
        <Center>
          <GeneratorBase />
        </Center>

        {/* Holographic Display */}
        <HolographicDisplay />

        {/* Energy Flow */}
        <EnergyFlow />

        {/* Contact Shadows */}
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4.5}
        />

        {/* Camera Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          minDistance={5}
          maxDistance={15}
          enableDamping
          dampingFactor={0.05}
        />

        {/* Camera */}
        <PerspectiveCamera makeDefault position={[0, 2, 8]} />
      </Canvas>

      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
            <p className="text-text-secondary text-sm">Loading Generator...</p>
          </div>
        </div>
      )}

      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner Brackets */}
        <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-cyan-400 opacity-50" />
        <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-cyan-400 opacity-50" />
        <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-cyan-400 opacity-50" />
        <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-cyan-400 opacity-50" />

        {/* Status Indicators */}
        <div className="absolute top-8 left-24 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-cyan-400 font-mono">SYSTEM ONLINE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-xs text-cyan-400 font-mono">POWER: 98.7%</span>
          </div>
        </div>
      </div>
    </div>
  );
}









