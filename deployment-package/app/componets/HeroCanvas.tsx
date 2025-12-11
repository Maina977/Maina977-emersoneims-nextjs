// components/hero/HeroCanvas.tsx - WebGL Intelligent Core
'use client';

// Type declarations for React Three Fiber elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      directionalLight: any;
      spotLight: any;
      group: any;
      mesh: any;
      meshBasicMaterial: any;
      meshStandardMaterial: any;
      meshNormalMaterial: any;
      meshPhongMaterial: any;
      meshLambertMaterial: any;
      points: any;
      pointsMaterial: any;
      bufferGeometry: any;
      bufferAttribute: any;
      torusGeometry: any;
      sphere: any;
      boxGeometry: any;
      planeGeometry: any;
      cylinderGeometry: any;
      color: any;
      fog: any;
    }
  }
}

export {};

import { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Float, Text3D, MeshDistortMaterial, 
  Environment, Sphere 
} from '@react-three/drei';
import * as THREE from 'three';

// ============================================================================
// Types & Interfaces
// ============================================================================

interface PerformanceConfig {
  dpr: number;
  particles: number;
}

interface ProgressTracker {
  get: () => number;
}

interface IntelligentCoreProps {
  progress: ProgressTracker;
  config: PerformanceConfig;
}

interface RingProps {
  radius: number;
  thickness: number;
  speed: number;
  color: string;
}

interface HeroCanvasProps {
  config: PerformanceConfig;
  prefersReducedMotion: boolean;
  progress: ProgressTracker;
}

// ============================================================================
// Constants
// ============================================================================

const COLORS = {
  PRIMARY: '#ffb703',
  SECONDARY: '#00ffff',
  BACKGROUND: '#08080c',
} as const;

const ANIMATION = {
  MAIN_SPHERE_ROTATION_X: 0.05,
  MAIN_SPHERE_ROTATION_Y: 0.1,
  MAIN_SPHERE_SCALE_PULSE: 0.5,
  MAIN_SPHERE_SCALE_AMPLITUDE: 0.05,
  INNER_CORE_ROTATION: 0.2,
  PARTICLES_ROTATION: 0.02,
  PARTICLES_PULSE: 2,
  PARTICLES_OPACITY_MIN: 0.3,
  PARTICLES_OPACITY_RANGE: 0.2,
} as const;

const GEOMETRY = {
  MAIN_SPHERE_RADIUS: 2,
  MAIN_SPHERE_SEGMENTS: 64,
  INNER_CORE_RADIUS: 0.8,
  INNER_CORE_SEGMENTS: 32,
  PARTICLE_SIZE: 0.05,
  PARTICLE_OPACITY: 0.5,
  RING_1_RADIUS: 3,
  RING_1_THICKNESS: 0.02,
  RING_1_SPEED: 0.5,
  RING_2_RADIUS: 4,
  RING_2_THICKNESS: 0.015,
  RING_2_SPEED: 0.3,
  RING_SEGMENTS: 16,
  RING_TUBULAR_SEGMENTS: 100,
} as const;

const LIGHTING = {
  AMBIENT_INTENSITY: 0.2,
  POINT_LIGHT_1_INTENSITY: 1.5,
  POINT_LIGHT_2_INTENSITY: 0.5,
  POINT_LIGHT_1_POSITION: [10, 10, 10] as [number, number, number],
  POINT_LIGHT_2_POSITION: [-10, -10, -10] as [number, number, number],
} as const;

const CAMERA = {
  INITIAL_POSITION: [0, 0, 10] as [number, number, number],
  FOV: 50,
  LERP_SPEED: 0.05,
  SCROLL_MULTIPLIER: 2,
} as const;

const TEXT3D = {
  FONT_PATH: '/fonts/Inter_Bold.json',
  SIZE: 0.4,
  HEIGHT: 0.1,
  POSITION: [0, -3, 0] as [number, number, number],
  TEXT: 'INTELLIGENT CORE',
} as const;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Creates a spherical particle distribution
 */
function createParticleSystem(particleCount: number) {
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    // Spherical distribution
    const radius = 3 + Math.random() * 4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    
    // Energy color gradient (orange/yellow)
    colors[i * 3] = 1.0;     // R
    colors[i * 3 + 1] = 0.7; // G
    colors[i * 3 + 2] = 0.1; // B
  }
  
  return { positions, colors };
}

// ============================================================================
// Scene Components
// ============================================================================

/**
 * Sets up the scene background and fog
 */
function SceneSetup() {
  const { scene } = useThree();
  
  useEffect(() => {
    scene.background = new THREE.Color(COLORS.BACKGROUND);
    scene.fog = new THREE.Fog(COLORS.BACKGROUND, 5, 15);
    
    return () => {
      scene.fog = null;
    };
  }, [scene]);
  
  return null;
}

/**
 * Animated ring component for visual effects
 */
function Ring({ radius, thickness, speed, color }: RingProps) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.getElapsedTime() * speed;
    }
  });
  
  // @ts-ignore - R3F mesh element (types declared globally, TS server cache issue)
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      {/* @ts-ignore - R3F torusGeometry element */}
      <torusGeometry 
        args={[radius, thickness, GEOMETRY.RING_SEGMENTS, GEOMETRY.RING_TUBULAR_SEGMENTS]} 
      />
      {/* @ts-ignore - R3F meshBasicMaterial element */}
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

/**
 * Camera controller that responds to scroll progress
 */
function ScrollCamera({ progress }: { progress: ProgressTracker }) {
  const { camera } = useThree();
  
  useFrame(() => {
    const targetZ = CAMERA.INITIAL_POSITION[2] + progress.get() * CAMERA.SCROLL_MULTIPLIER;
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z, 
      targetZ, 
      CAMERA.LERP_SPEED
    );
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

/**
 * Main intelligent core visualization component
 */
function IntelligentCore({ progress, config }: IntelligentCoreProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  // Create particle system
  const particles = useMemo(
    () => createParticleSystem(config.particles),
    [config.particles]
  );
  
  // Animation frame
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Animate main sphere
    if (meshRef.current) {
      meshRef.current.rotation.x = time * ANIMATION.MAIN_SPHERE_ROTATION_X;
      meshRef.current.rotation.y = time * ANIMATION.MAIN_SPHERE_ROTATION_Y;
      const scale = 1 + Math.sin(time * ANIMATION.MAIN_SPHERE_SCALE_PULSE) * ANIMATION.MAIN_SPHERE_SCALE_AMPLITUDE;
      meshRef.current.scale.setScalar(scale);
    }
    
    // Animate inner core
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.z = time * ANIMATION.INNER_CORE_ROTATION;
    }
    
    // Animate particles
    if (particlesRef.current?.material) {
      const material = particlesRef.current.material as THREE.PointsMaterial;
      particlesRef.current.rotation.y = time * ANIMATION.PARTICLES_ROTATION;
      const pulse = Math.sin(time * ANIMATION.PARTICLES_PULSE) * 0.5 + 0.5;
      material.opacity = ANIMATION.PARTICLES_OPACITY_MIN + pulse * ANIMATION.PARTICLES_OPACITY_RANGE;
    }
  });
  
  // @ts-ignore - R3F JSX elements (types declared globally, TS server cache issue)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  return (
    // @ts-ignore
    <group>
      {/* Main energy sphere */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere 
          ref={meshRef} 
          args={[GEOMETRY.MAIN_SPHERE_RADIUS, GEOMETRY.MAIN_SPHERE_SEGMENTS, GEOMETRY.MAIN_SPHERE_SEGMENTS]}
        >
          <MeshDistortMaterial
            color={COLORS.PRIMARY}
            emissive={COLORS.PRIMARY}
            emissiveIntensity={0.3}
            roughness={0.1}
            metalness={0.9}
            distort={0.4}
            speed={2}
          />
        </Sphere>
      </Float>
      
      {/* Inner core */}
      <Sphere 
        ref={innerCoreRef} 
        args={[GEOMETRY.INNER_CORE_RADIUS, GEOMETRY.INNER_CORE_SEGMENTS, GEOMETRY.INNER_CORE_SEGMENTS]} 
        position={[0, 0, 0]}
      >
        {/* @ts-ignore - R3F meshBasicMaterial element */}
        <meshBasicMaterial color={COLORS.SECONDARY} toneMapped={false} />
      </Sphere>
      
      {/* Particle field */}
      {/* @ts-ignore - R3F points element */}
      <points ref={particlesRef}>
        {/* @ts-ignore - R3F bufferGeometry element */}
        <bufferGeometry>
          {/* @ts-ignore - R3F bufferAttribute element */}
          <bufferAttribute
            attach="attributes-position"
            count={config.particles}
            array={particles.positions}
            itemSize={3}
          />
          {/* @ts-ignore - R3F bufferAttribute element */}
          <bufferAttribute
            attach="attributes-color"
            count={config.particles}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        {/* @ts-ignore - R3F pointsMaterial element */}
        <pointsMaterial
          size={GEOMETRY.PARTICLE_SIZE}
          vertexColors
          transparent
          opacity={GEOMETRY.PARTICLE_OPACITY}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Animated rings */}
      <Ring 
        radius={GEOMETRY.RING_1_RADIUS} 
        thickness={GEOMETRY.RING_1_THICKNESS} 
        speed={GEOMETRY.RING_1_SPEED} 
        color={COLORS.PRIMARY} 
      />
      <Ring 
        radius={GEOMETRY.RING_2_RADIUS} 
        thickness={GEOMETRY.RING_2_THICKNESS} 
        speed={GEOMETRY.RING_2_SPEED} 
        color={COLORS.SECONDARY} 
      />
      
      {/* 3D Text */}
      <Text3D
        font={TEXT3D.FONT_PATH}
        size={TEXT3D.SIZE}
        height={TEXT3D.HEIGHT}
        position={TEXT3D.POSITION}
        rotation={[0, 0, 0]}
      >
        {TEXT3D.TEXT}
        {/* @ts-ignore - R3F meshNormalMaterial element */}
        <meshNormalMaterial />
      </Text3D>
    </group>
  );
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * Hero Canvas - WebGL 3D visualization component
 * Displays an animated intelligent core with particles, rings, and 3D text
 */
export default function HeroCanvas({ 
  config, 
  prefersReducedMotion, 
  progress 
}: HeroCanvasProps) {
  return (
    <div className="webgl-container">
      <Canvas
        dpr={config.dpr}
        camera={{ 
          position: CAMERA.INITIAL_POSITION, 
          fov: CAMERA.FOV 
        }}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <SceneSetup />
          
          {/* Lighting */}
          {/* @ts-ignore - R3F ambientLight element */}
          <ambientLight intensity={LIGHTING.AMBIENT_INTENSITY} />
          {/* @ts-ignore - R3F pointLight element */}
          <pointLight 
            position={LIGHTING.POINT_LIGHT_1_POSITION} 
            intensity={LIGHTING.POINT_LIGHT_1_INTENSITY} 
            color={COLORS.PRIMARY} 
          />
          {/* @ts-ignore - R3F pointLight element */}
          <pointLight 
            position={LIGHTING.POINT_LIGHT_2_POSITION} 
            intensity={LIGHTING.POINT_LIGHT_2_INTENSITY} 
            color={COLORS.SECONDARY} 
          />
          
          {/* Main visualization */}
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

// Ensure this file is treated as a module for global type augmentation
export {};
