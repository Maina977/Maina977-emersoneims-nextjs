// React Three Fiber type declarations
/// <reference types="@react-three/fiber" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Lights
      ambientLight: any;
      pointLight: any;
      directionalLight: any;
      spotLight: any;
      
      // Geometry & Materials
      group: any;
      mesh: any;
      meshBasicMaterial: any;
      meshStandardMaterial: any;
      meshNormalMaterial: any;
      meshPhongMaterial: any;
      meshLambertMaterial: any;
      
      // Particles
      points: any;
      pointsMaterial: any;
      
      // Buffer Geometry
      bufferGeometry: any;
      bufferAttribute: any;
      
      // Primitive Geometries
      torusGeometry: any;
      sphere: any;
      boxGeometry: any;
      planeGeometry: any;
      cylinderGeometry: any;
      
      // Scene
      color: any;
      fog: any;
    }
  }
}

export {};
