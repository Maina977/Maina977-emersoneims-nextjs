'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Simple Three.js Scene for Background Effects
 * Lightweight 3D scene for page backgrounds
 */
function SimpleScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#fbbf24" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />
      
      {/* Simple geometric shapes */}
      <mesh position={[0, 0, -5]} rotation={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.2} />
      </mesh>
      
      <mesh position={[3, 2, -3]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <primitive object={new THREE.SphereGeometry(1, 32, 32)} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.2} />
      </mesh>

      <Sparkles count={50} scale={10} size={2} speed={0.4} color="#fbbf24" />
      
      <OrbitControls 
        autoRotate 
        autoRotateSpeed={0.5}
        enableZoom={false}
        enablePan={false}
      />
      <Environment preset="city" />
    </>
  );
}

export default function SimpleThreeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <SimpleScene />
      </Suspense>
    </Canvas>
  );
}








