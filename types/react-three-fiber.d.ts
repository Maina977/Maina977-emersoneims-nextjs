/// <reference types="@react-three/fiber" />

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
      points: any;
      pointsMaterial: any;
      bufferGeometry: any;
      bufferAttribute: any;
      torusGeometry: any;
      sphere: any;
      color: any;
      fog: any;
    }
  }
}

export {};

