'use client';

import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function RotatingCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const orbitRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.005;
      coreRef.current.rotation.x += 0.002;
    }
    
    // Orbit elements
    orbitRefs.current.forEach((orbit, index) => {
      if (orbit) {
        const time = state.clock.getElapsedTime();
        const radius = 2 + index * 0.5;
        const speed = 0.5 + index * 0.2;
        orbit.position.x = Math.cos(time * speed) * radius;
        orbit.position.z = Math.sin(time * speed) * radius;
        orbit.position.y = Math.sin(time * speed * 1.5) * 0.5;
        orbit.rotation.y += 0.01;
      }
    });
  });

  return (
    <>
      {/* Main Core */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <primitive object={new THREE.IcosahedronGeometry(1, 2)} />
        <MeshDistortMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.5}
          distort={0.3}
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Orbiting Elements */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          ref={(el: THREE.Mesh | null) => {
            if (el) orbitRefs.current[i] = el;
          }}
        >
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* Energy Particles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
          ]}
        >
          <primitive object={new THREE.SphereGeometry(0.02, 8, 8)} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={1}
          />
        </mesh>
      ))}

      {/* Ambient Light */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#fbbf24" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />
    </>
  );
}

interface GeneratorCoreProps {
  className?: string;
  prefersReducedMotion?: boolean;
}

export default function GeneratorCore({
  className = '',
  prefersReducedMotion = false,
}: GeneratorCoreProps) {
  if (prefersReducedMotion) {
    return (
      <div className={`w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 opacity-50" />
          <p className="text-text-secondary text-sm">Generator Core</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <RotatingCore />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.5}
          minDistance={3}
          maxDistance={8}
        />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}

