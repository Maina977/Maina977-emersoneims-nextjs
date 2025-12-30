'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  PerspectiveCamera,
  Float,
  Sparkles,
  Lightformer,
  ContactShadows,
  Center,
  MeshTransmissionMaterial,
  AccumulativeShadows,
  RandomizedLight
} from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Advanced Particle System - Optimized for Performance
function AdvancedParticles({ count = 500 }) {
  const mesh = useRef<THREE.Points>(null);
  const particles = useRef<Float32Array>(new Float32Array(count * 3));

  useEffect(() => {
    for (let i = 0; i < count * 3; i += 3) {
      particles.current[i] = (Math.random() - 0.5) * 20;
      particles.current[i + 1] = (Math.random() - 0.5) * 20;
      particles.current[i + 2] = (Math.random() - 0.5) * 20;
    }
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.001;
      const positions = mesh.current.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < count * 3; i += 3) {
        positions[i] += Math.sin(state.clock.elapsedTime + i) * 0.01;
      }
      mesh.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#fbbf24"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Holographic Data Streams
function HolographicStreams() {
  const streams = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (streams.current) {
      streams.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          child.position.y = (state.clock.elapsedTime * 0.5 + i) % 4 - 2;
          child.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.3;
        }
      });
    }
  });

  return (
    <group ref={streams}>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin((i / 12) * Math.PI * 2) * 4,
            0,
            Math.cos((i / 12) * Math.PI * 2) * 4,
          ]}
        >
          <boxGeometry args={[0.1, 2, 0.1]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={1}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

// Energy Wave Visualization
function EnergyWaves() {
  const waveRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (waveRef.current) {
      const time = state.clock.elapsedTime;
      const positions = waveRef.current.geometry.attributes.position.array as Float32Array;
      const count = waveRef.current.geometry.attributes.position.count;
      
      for (let i = 0; i < count; i++) {
        const x = positions[i * 3];
        const z = positions[i * 3 + 2];
        positions[i * 3 + 1] = Math.sin(x * 0.5 + time * 2) * 0.3 + Math.cos(z * 0.5 + time * 2) * 0.3;
      }
      waveRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <mesh ref={waveRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
      <planeGeometry args={[10, 10, 50, 50]} />
      <meshStandardMaterial
        color="#fbbf24"
        emissive="#fbbf24"
        emissiveIntensity={0.5}
        wireframe
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

// Enhanced Generator with More Details
function EnhancedGenerator() {
  const generatorRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (generatorRef.current) {
      generatorRef.current.rotation.y += hovered ? 0.01 : 0.005;
    }
  });

  return (
    <group
      ref={generatorRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main Body with Advanced Materials */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 2, 1.5]} />
        <MeshTransmissionMaterial
          backside
          samples={10}
          resolution={512}
          transmission={0.8}
          thickness={0.5}
          roughness={0.2}
          chromaticAberration={0.02}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.5}
          temporalDistortion={0.1}
          color="#fbbf24"
        />
      </mesh>

      {/* Inner Core Glow */}
      <mesh position={[0, 0, 0]}>
        <primitive object={new THREE.SphereGeometry(0.8, 32, 32)} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={hovered ? 2 : 1}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Cummins Logo with Holographic Effect */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, 0.5, 0.76]}>
          <planeGeometry args={[1.5, 0.5]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={hovered ? 1 : 0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </Float>

      {/* Advanced Control Panel */}
      <group position={[0, 1.1, 0.5]}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[-0.7 + (i * 0.2), 0, 0.06]}>
            <boxGeometry args={[0.15, 0.2, 0.05]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#00ffff' : '#fbbf24'}
              emissive={i % 2 === 0 ? '#00ffff' : '#fbbf24'}
              emissiveIntensity={hovered ? 1.5 : 0.8}
            />
          </mesh>
        ))}
      </group>

      {/* Rotating Cooling Fans */}
      {[-1.2, 1.2].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh rotation={[0, 0, 0]}>
            {(function() {
              const fanRef = useRef<THREE.Mesh>(null);
              useFrame(() => {
                if (fanRef.current) {
                  fanRef.current.rotation.z += 0.1;
                }
              });
              return (
                <mesh ref={fanRef}>
                  <cylinderGeometry args={[0.8, 0.8, 0.1, 8]} />
                  <meshStandardMaterial
                    color="#2a2a2a"
                    metalness={0.9}
                    roughness={0.2}
                  />
                </mesh>
              );
            })()}
          </mesh>
        </group>
      ))}

      {/* Power Output Indicators */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            -1 + (i % 3) * 1,
            -1.2,
            0.8 - Math.floor(i / 3) * 1.6,
          ]}
        >
          <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={hovered ? 1 : 0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

interface AdvancedGeneratorSceneProps {
  className?: string;
  prefersReducedMotion?: boolean;
  autoRotate?: boolean;
}

export default function AdvancedGeneratorScene({
  className = '',
  prefersReducedMotion = false,
  autoRotate = true,
}: AdvancedGeneratorSceneProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        onCreated={() => setIsLoaded(true)}
        dpr={[1, 2]}
      >
        {/* Advanced Lighting Setup */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#fbbf24" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#00ffff" />
        <pointLight position={[0, 10, -10]} intensity={0.8} color="#ffffff" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1.5}
          color="#ffffff"
          castShadow
        />

        {/* Environment */}
        <Environment resolution={64}>
          <Lightformer intensity={1.2} position={[0, 5, -10]} scale={[20, 20, 1]} color="#fbbf24" />
          <Lightformer intensity={1.0} position={[0, -5, -10]} scale={[20, 20, 1]} color="#00ffff" />
        </Environment>

        {/* Main Generator */}
        <Center>
          <EnhancedGenerator />
        </Center>

        {/* Advanced Effects - Optimized Particle Count */}
        <AdvancedParticles count={isMobile ? 150 : 600} />
        <HolographicStreams />
        <EnergyWaves />

        {/* Enhanced Sparkles - Optimized */}
        <Sparkles
          count={isMobile ? 30 : 100}
          scale={[8, 8, 8]}
          size={2.5}
          speed={0.4}
          color="#fbbf24"
          opacity={0.6}
        />

        {/* Shadows */}
        {!isMobile && (
          <AccumulativeShadows
            frames={40}
            temporal
            alphaTest={0.85}
            scale={10}
            position={[0, -1.5, 0]}
          >
            <RandomizedLight
              amount={8}
              radius={5}
              position={[5, 5, -5]}
            />
          </AccumulativeShadows>
        )}

        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.6}
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
          minDistance={4}
          maxDistance={20}
          enableDamping
          dampingFactor={0.05}
        />

        <PerspectiveCamera makeDefault position={[0, 2, 8]} />
      </Canvas>

      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
            <p className="text-text-secondary text-sm">Initializing Advanced Generator...</p>
          </div>
        </div>
      )}

        {/* Advanced HUD Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Corner Brackets */}
          <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-cyan-400 opacity-50" />
          <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-cyan-400 opacity-50" />
          <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-cyan-400 opacity-50" />
          <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-cyan-400 opacity-50" />

        {/* Real-time Status Indicators */}
        <div className="absolute top-8 left-24 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-cyan-400 font-mono">SYSTEM: ONLINE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-xs text-cyan-400 font-mono">POWER: 98.7%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-xs text-cyan-400 font-mono">EFFICIENCY: MAX</span>
          </div>
        </div>

        {/* Data Stream Visualization */}
        <div className="absolute bottom-8 right-8 w-48">
          <div className="space-y-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-1 bg-gradient-to-r from-cyan-400 to-transparent"
                style={{ width: `${(i + 1) * 12.5}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

