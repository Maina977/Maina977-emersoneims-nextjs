// Extended React Three Fiber type declarations
import '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Lights
      ambientLight: Record<string, unknown>;
      pointLight: Record<string, unknown>;
      directionalLight: Record<string, unknown>;
      spotLight: Record<string, unknown>;
      
      // Geometry & Materials
      group: Record<string, unknown>;
      mesh: Record<string, unknown>;
      meshBasicMaterial: Record<string, unknown>;
      meshStandardMaterial: Record<string, unknown>;
      meshNormalMaterial: Record<string, unknown>;
      meshPhongMaterial: Record<string, unknown>;
      meshLambertMaterial: Record<string, unknown>;
      
      // Particles
      points: Record<string, unknown>;
      pointsMaterial: Record<string, unknown>;
      
      // Buffer Geometry
      bufferGeometry: Record<string, unknown>;
      bufferAttribute: Record<string, unknown>;
      
      // Primitive Geometries
      torusGeometry: Record<string, unknown>;
      sphere: Record<string, unknown>;
      boxGeometry: Record<string, unknown>;
      planeGeometry: Record<string, unknown>;
      cylinderGeometry: Record<string, unknown>;
      
      // Scene
      color: Record<string, unknown>;
      fog: Record<string, unknown>;
    }
  }
}

export {};




