'use client';

/**
 * FLOATING UFOS - UNEXPECTED FLOATING OBJECTS
 * Unique gravity-defying WebGL elements with physics-based movement
 * Premium Awwwards-level interactive experience
 */

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh, Vector3, Color } from 'three';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface UFOProps {
  position: [number, number, number];
  speed: number;
  color: string;
  size: number;
}

function UFO({ position, speed, color, size }: UFOProps) {
  const meshRef = useRef<Mesh>(null);
  const rotationRef = useRef({ x: 0, y: 0, z: 0 });
  const floatOffset = useRef(Math.random() * Math.PI * 2);
  const hoverSpeed = useRef(0.3 + Math.random() * 0.4);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // Gravity-defying floating motion
    const floatY = Math.sin(time * hoverSpeed.current + floatOffset.current) * 0.5;
    const floatX = Math.cos(time * hoverSpeed.current * 0.7 + floatOffset.current) * 0.3;
    const floatZ = Math.sin(time * hoverSpeed.current * 0.5 + floatOffset.current) * 0.2;
    
    meshRef.current.position.y = position[1] + floatY;
    meshRef.current.position.x = position[0] + floatX;
    meshRef.current.position.z = position[2] + floatZ;

    // Slow rotation
    rotationRef.current.y += speed * 0.01;
    rotationRef.current.x = Math.sin(time * 0.5) * 0.1;
    
    meshRef.current.rotation.x = rotationRef.current.x;
    meshRef.current.rotation.y = rotationRef.current.y;
    meshRef.current.rotation.z = Math.sin(time * 0.3) * 0.05;
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Main UFO body - unique saucer shape */}
      <mesh>
        <torusGeometry args={[size, size * 0.3, 16, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Top dome */}
      <mesh position={[0, size * 0.3, 0]}>
        <sphereGeometry args={[size * 0.6, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Bottom glow */}
      <mesh position={[0, -size * 0.2, 0]}>
        <cylinderGeometry args={[size * 0.8, size * 0.4, size * 0.1, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Energy rings */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, -size * 0.4 - i * 0.1, 0]}>
          <torusGeometry args={[size * 0.9 + i * 0.1, 0.02, 8, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2 - i * 0.5}
            transparent
            opacity={0.8 - i * 0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

interface DriftingBlobProps {
  position: [number, number, number];
  color: string;
  size: number;
}

function DriftingBlob({ position, color, size }: DriftingBlobProps) {
  const meshRef = useRef<Mesh>(null);
  const velocity = useRef(new Vector3(
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02
  ));
  const morphTarget = useRef(new Vector3(...position));
  const timeOffset = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // Gravity-defying blob movement - unpredictable floating
    const noiseX = Math.sin(time * 0.5 + timeOffset.current) * Math.cos(time * 0.3);
    const noiseY = Math.cos(time * 0.7 + timeOffset.current) * Math.sin(time * 0.4);
    const noiseZ = Math.sin(time * 0.6 + timeOffset.current) * Math.cos(time * 0.5);
    
    morphTarget.current.x = position[0] + noiseX * 2;
    morphTarget.current.y = position[1] + noiseY * 2 + Math.sin(time) * 1.5;
    morphTarget.current.z = position[2] + noiseZ * 2;
    
    // Smooth interpolation
    meshRef.current.position.lerp(morphTarget.current, 0.05);
    
    // Morphing blob shape
    const scaleX = 1 + Math.sin(time * 0.8 + timeOffset.current) * 0.3;
    const scaleY = 1 + Math.cos(time * 0.6 + timeOffset.current) * 0.3;
    const scaleZ = 1 + Math.sin(time * 0.7 + timeOffset.current) * 0.3;
    
    meshRef.current.scale.set(scaleX, scaleY, scaleZ);
    
    // Slow rotation
    meshRef.current.rotation.x += 0.005;
    meshRef.current.rotation.y += 0.008;
    meshRef.current.rotation.z += 0.003;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[size, 2]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        metalness={0.3}
        roughness={0.7}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

interface AbstractShapeProps {
  position: [number, number, number];
  color: string;
  shape: 'octahedron' | 'tetrahedron' | 'dodecahedron';
}

function AbstractShape({ position, color, shape }: AbstractShapeProps) {
  const meshRef = useRef<Mesh>(null);
  const rotationSpeed = useRef({
    x: (Math.random() - 0.5) * 0.02,
    y: (Math.random() - 0.5) * 0.02,
    z: (Math.random() - 0.5) * 0.02,
  });
  const floatOffset = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // Gravity-defying float
    const floatY = Math.sin(time * 0.4 + floatOffset.current) * 1.5;
    meshRef.current.position.y = position[1] + floatY;
    
    // Complex rotation
    meshRef.current.rotation.x += rotationSpeed.current.x;
    meshRef.current.rotation.y += rotationSpeed.current.y;
    meshRef.current.rotation.z += rotationSpeed.current.z;
    
    // Pulsing scale
    const pulse = 1 + Math.sin(time * 0.8) * 0.1;
    meshRef.current.scale.setScalar(pulse);
  });

  const geometry = useMemo(() => {
    switch (shape) {
      case 'octahedron':
        return <octahedronGeometry args={[1, 0]} />;
      case 'tetrahedron':
        return <tetrahedronGeometry args={[1, 0]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={[1, 0]} />;
    }
  }, [shape]);

  return (
    <mesh ref={meshRef} position={position}>
      {geometry}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        metalness={0.7}
        roughness={0.3}
        wireframe
      />
    </mesh>
  );
}

function SceneContent() {
  const prefersReducedMotion = useReducedMotion();
  
  const ufos = useMemo(() => {
    if (prefersReducedMotion) return [];
    
    return Array.from({ length: 5 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        Math.random() * 5 + 2,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      speed: 0.5 + Math.random() * 0.5,
      color: `hsl(${200 + i * 30}, 70%, 60%)`,
      size: 0.3 + Math.random() * 0.3,
    }));
  }, [prefersReducedMotion]);

  const blobs = useMemo(() => {
    if (prefersReducedMotion) return [];
    
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 12,
        Math.random() * 6 + 1,
        (Math.random() - 0.5) * 12,
      ] as [number, number, number],
      color: `hsl(${280 + i * 20}, 80%, 65%)`,
      size: 0.2 + Math.random() * 0.3,
    }));
  }, [prefersReducedMotion]);

  const shapes = useMemo(() => {
    if (prefersReducedMotion) return [];
    
    const shapeTypes: Array<'octahedron' | 'tetrahedron' | 'dodecahedron'> = [
      'octahedron',
      'tetrahedron',
      'dodecahedron',
    ];
    
    return Array.from({ length: 6 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 8,
        Math.random() * 4 + 3,
        (Math.random() - 0.5) * 8,
      ] as [number, number, number],
      color: `hsl(${150 + i * 25}, 75%, 55%)`,
      shape: shapeTypes[i % shapeTypes.length] as 'octahedron' | 'tetrahedron' | 'dodecahedron',
    }));
  }, [prefersReducedMotion]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4a90e2" />
      
      {ufos.map((ufo, i) => (
        <UFO key={`ufo-${i}`} {...ufo} />
      ))}
      
      {blobs.map((blob, i) => (
        <DriftingBlob key={`blob-${i}`} {...blob} />
      ))}
      
      {shapes.map((shape, i) => (
        <AbstractShape key={`shape-${i}`} {...shape} />
      ))}
    </>
  );
}

interface FloatingUFOsProps {
  className?: string;
  interactive?: boolean;
}

export default function FloatingUFOs({ className = '', interactive = true }: FloatingUFOsProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 5, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
      >
        <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={60} />
        <SceneContent />
        {interactive && <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />}
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}




