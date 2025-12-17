'use client';

/**
 * INTERACTIVE GRAVITY-DEFYING BLOBS
 * Unique morphing blobs with mouse interaction and physics simulation
 * Premium WebGL experience
 */

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Mesh, Vector3, Color, ShaderMaterial } from 'three';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface BlobProps {
  position: [number, number, number];
  color: string;
  size: number;
  mousePosition: Vector3;
}

function Blob({ position, color, size, mousePosition }: BlobProps) {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const velocity = useRef(new Vector3(
    (Math.random() - 0.5) * 0.01,
    (Math.random() - 0.5) * 0.01,
    (Math.random() - 0.5) * 0.01
  ));
  const targetPosition = useRef(new Vector3(...position));
  const timeOffset = useRef(Math.random() * Math.PI * 2);
  const [hovered, setHovered] = useState(false);

  // Custom shader for morphing blob effect
  const shaderMaterial = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(color) },
        uMouse: { value: new Vector3() },
        uHover: { value: 0 },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec3 uMouse;
        uniform float uHover;
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vPosition = position;
          vNormal = normal;
          
          vec3 pos = position;
          
          // Morphing effect based on noise
          float noise = sin(pos.x * 2.0 + uTime) * 
                       cos(pos.y * 3.0 + uTime * 0.7) * 
                       sin(pos.z * 2.5 + uTime * 0.5) * 0.1;
          
          // Mouse interaction
          float dist = distance(pos, uMouse);
          float mouseInfluence = 1.0 / (1.0 + dist * 2.0);
          pos += normal * noise * (1.0 + mouseInfluence * uHover * 0.5);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uTime;
        uniform float uHover;
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vec3 color = uColor;
          
          // Animated color shift
          color.r += sin(uTime * 0.5) * 0.1;
          color.g += cos(uTime * 0.7) * 0.1;
          color.b += sin(uTime * 0.6) * 0.1;
          
          // Fresnel effect
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          color += fresnel * 0.3;
          
          // Hover glow
          color += uHover * 0.2;
          
          gl_FragColor = vec4(color, 0.7 + uHover * 0.3);
        }
      `,
      transparent: true,
      side: 2, // DoubleSide
    });
  }, [color]);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // Update shader uniforms
    materialRef.current.uniforms.uTime.value = time + timeOffset.current;
    materialRef.current.uniforms.uMouse.value.copy(mousePosition);
    materialRef.current.uniforms.uHover.value = hovered ? 1 : 0;
    
    // Gravity-defying movement
    const noiseX = Math.sin(time * 0.5 + timeOffset.current) * Math.cos(time * 0.3);
    const noiseY = Math.cos(time * 0.7 + timeOffset.current) * Math.sin(time * 0.4);
    const noiseZ = Math.sin(time * 0.6 + timeOffset.current) * Math.cos(time * 0.5);
    
    targetPosition.current.x = position[0] + noiseX * 3;
    targetPosition.current.y = position[1] + noiseY * 3 + Math.sin(time) * 2;
    targetPosition.current.z = position[2] + noiseZ * 3;
    
    // Smooth interpolation
    meshRef.current.position.lerp(targetPosition.current, 0.03);
    
    // Mouse repulsion
    const mouseDistance = meshRef.current.position.distanceTo(mousePosition);
    if (mouseDistance < 3) {
      const direction = meshRef.current.position.clone().sub(mousePosition).normalize();
      meshRef.current.position.add(direction.multiplyScalar(0.1));
    }
    
    // Morphing scale
    const scaleX = 1 + Math.sin(time * 0.8 + timeOffset.current) * 0.4;
    const scaleY = 1 + Math.cos(time * 0.6 + timeOffset.current) * 0.4;
    const scaleZ = 1 + Math.sin(time * 0.7 + timeOffset.current) * 0.4;
    
    meshRef.current.scale.set(scaleX, scaleY, scaleZ);
    
    // Slow rotation
    meshRef.current.rotation.x += 0.003;
    meshRef.current.rotation.y += 0.005;
    meshRef.current.rotation.z += 0.002;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      material={materialRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <icosahedronGeometry args={[size, 3]} />
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  );
}

function SceneContent({ mousePosition }: { mousePosition: Vector3 }) {
  const prefersReducedMotion = useReducedMotion();
  
  const blobs = useMemo(() => {
    if (prefersReducedMotion) return [];
    
    return Array.from({ length: 12 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 15,
        Math.random() * 8 + 2,
        (Math.random() - 0.5) * 15,
      ] as [number, number, number],
      color: `hsl(${240 + i * 15}, 85%, ${60 + (i % 3) * 10}%)`,
      size: 0.4 + Math.random() * 0.5,
    }));
  }, [prefersReducedMotion]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#4a90e2" />
      <pointLight position={[0, 10, -10]} intensity={0.6} color="#ff6b9d" />
      
      {blobs.map((blob, i) => (
        <Blob key={`blob-${i}`} {...blob} mousePosition={mousePosition} />
      ))}
    </>
  );
}

interface InteractiveBlobsProps {
  className?: string;
}

export default function InteractiveBlobs({ className = '' }: InteractiveBlobsProps) {
  const [mousePosition, setMousePosition] = useState(new Vector3(0, 0, 0));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((rect.bottom - e.clientY) / rect.height - 0.5) * 20;
      const z = 5;
      
      setMousePosition(new Vector3(x, y, z));
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
      return () => {
        containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 8, 15], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
      >
        <PerspectiveCamera makeDefault position={[0, 8, 15]} fov={60} />
        <SceneContent mousePosition={mousePosition} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
      </Canvas>
    </div>
  );
}




