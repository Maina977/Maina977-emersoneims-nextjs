'use client';

/**
 * ABSTRACT FLOATING SHAPES
 * Unique geometric shapes with gravity-defying physics
 * Interactive and mesmerizing WebGL experience
 */

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh, Vector3, Color } from 'three';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface FloatingShapeProps {
  position: [number, number, number];
  color: string;
  shape: 'torus' | 'octahedron' | 'tetrahedron' | 'dodecahedron' | 'icosahedron';
  size: number;
  speed: number;
}

function FloatingShape({ position, color, size, speed, shape }: FloatingShapeProps) {
  const meshRef = useRef<Mesh>(null);
  const rotationRef = useRef({
    x: Math.random() * Math.PI,
    y: Math.random() * Math.PI,
    z: Math.random() * Math.PI,
  });
  const floatOffset = useRef(Math.random() * Math.PI * 2);
  const orbitRadius = useRef(2 + Math.random() * 3);
  const orbitSpeed = useRef(0.2 + Math.random() * 0.3);
  const orbitAngle = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // Gravity-defying orbital motion
    orbitAngle.current += orbitSpeed.current * 0.01;
    const orbitX = Math.cos(orbitAngle.current) * orbitRadius.current;
    const orbitZ = Math.sin(orbitAngle.current) * orbitRadius.current;
    const orbitY = Math.sin(time * 0.5 + floatOffset.current) * 2;
    
    meshRef.current.position.x = position[0] + orbitX;
    meshRef.current.position.y = position[1] + orbitY;
    meshRef.current.position.z = position[2] + orbitZ;
    
    // Complex rotation
    rotationRef.current.x += speed * 0.01;
    rotationRef.current.y += speed * 0.015;
    rotationRef.current.z += speed * 0.008;
    
    meshRef.current.rotation.x = rotationRef.current.x;
    meshRef.current.rotation.y = rotationRef.current.y;
    meshRef.current.rotation.z = rotationRef.current.z;
    
    // Pulsing scale
    const pulse = 1 + Math.sin(time * 0.8 + floatOffset.current) * 0.2;
    meshRef.current.scale.setScalar(pulse * size);
  });

  const geometry = useMemo(() => {
    switch (shape) {
      case 'torus':
        return <torusGeometry args={[1, 0.3, 16, 32]} />;
      case 'octahedron':
        return <octahedronGeometry args={[1, 0]} />;
      case 'tetrahedron':
        return <tetrahedronGeometry args={[1, 0]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={[1, 0]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[1, 0]} />;
    }
  }, [shape]);

  return (
    <mesh ref={meshRef} position={position}>
      {geometry}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

interface WireframeShapeProps {
  position: [number, number, number];
  color: string;
  shape: 'octahedron' | 'tetrahedron' | 'dodecahedron';
  size: number;
}

function WireframeShape({ position, color, shape, size }: WireframeShapeProps) {
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
    
    // Gravity-defying float with spiral motion
    const spiralRadius = 1.5 + Math.sin(time * 0.3) * 0.5;
    const spiralAngle = time * 0.4 + floatOffset.current;
    const floatY = Math.sin(time * 0.5 + floatOffset.current) * 2;
    
    meshRef.current.position.x = position[0] + Math.cos(spiralAngle) * spiralRadius;
    meshRef.current.position.y = position[1] + floatY;
    meshRef.current.position.z = position[2] + Math.sin(spiralAngle) * spiralRadius;
    
    // Rotation
    meshRef.current.rotation.x += rotationSpeed.current.x;
    meshRef.current.rotation.y += rotationSpeed.current.y;
    meshRef.current.rotation.z += rotationSpeed.current.z;
    
    // Pulsing
    const pulse = 1 + Math.sin(time * 0.6) * 0.15;
    meshRef.current.scale.setScalar(pulse * size);
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
        emissiveIntensity={0.8}
        wireframe
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

interface ParticleFieldProps {
  count: number;
}

function ParticleField({ count }: ParticleFieldProps) {
  const particles = useRef<Mesh[]>([]);
  
  const positions = useMemo(() => {
    return Array.from({ length: count }, () => [
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
    ] as [number, number, number]);
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    particles.current.forEach((particle, i) => {
      if (!particle) return;
      
      const offset = i * 0.1;
      const floatY = Math.sin(time * 0.5 + offset) * 0.5;
      particle.position.y += floatY * 0.01;
      
      // Slow drift
      particle.rotation.x += 0.001;
      particle.rotation.y += 0.0015;
    });
  });

  return (
    <>
      {positions.map((pos, i) => (
        <mesh
          key={i}
          ref={(el: Mesh | null) => {
            if (el) particles.current[i] = el;
          }}
          position={pos}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#4a90e2"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </>
  );
}

function SceneContent() {
  const prefersReducedMotion = useReducedMotion();
  
  const shapes = useMemo(() => {
    if (prefersReducedMotion) return [];
    
    const shapeTypes: Array<'torus' | 'octahedron' | 'tetrahedron' | 'dodecahedron' | 'icosahedron'> = [
      'torus',
      'octahedron',
      'tetrahedron',
      'dodecahedron',
      'icosahedron',
    ];
    
    return Array.from({ length: 10 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 12,
        Math.random() * 6 + 2,
        (Math.random() - 0.5) * 12,
      ] as [number, number, number],
      color: `hsl(${180 + i * 20}, 75%, ${55 + (i % 3) * 10}%)`,
      shape: shapeTypes[i % shapeTypes.length],
      size: 0.5 + Math.random() * 0.5,
      speed: 0.5 + Math.random() * 1,
    }));
  }, [prefersReducedMotion]);

  const wireframes = useMemo(() => {
    if (prefersReducedMotion) return [];
    
    const wireframeTypes: Array<'octahedron' | 'tetrahedron' | 'dodecahedron'> = [
      'octahedron',
      'tetrahedron',
      'dodecahedron',
    ];
    
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        Math.random() * 5 + 3,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      color: `hsl(${300 + i * 15}, 80%, 60%)`,
      shape: wireframeTypes[i % wireframeTypes.length],
      size: 0.6 + Math.random() * 0.4,
    }));
  }, [prefersReducedMotion]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.6} color="#4a90e2" />
      <pointLight position={[0, 10, -10]} intensity={0.5} color="#ff6b9d" />
      
      {shapes.map((shape, i) => (
        <FloatingShape key={`shape-${i}`} {...shape} />
      ))}
      
      {wireframes.map((shape, i) => (
        <WireframeShape key={`wireframe-${i}`} {...shape} />
      ))}
      
      {!prefersReducedMotion && <ParticleField count={50} />}
    </>
  );
}

interface AbstractFloatingShapesProps {
  className?: string;
  interactive?: boolean;
}

export default function AbstractFloatingShapes({ 
  className = '', 
  interactive = true 
}: AbstractFloatingShapesProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 6, 12], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
      >
        <PerspectiveCamera makeDefault position={[0, 6, 12]} fov={60} />
        <SceneContent />
        {interactive && (
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.4} 
          />
        )}
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}

