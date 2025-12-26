import { extend } from '@react-three/fiber';
import * as THREE from 'three';

extend({
  sphereGeometry: THREE.SphereGeometry,
  octahedronGeometry: THREE.OctahedronGeometry,
  tetrahedronGeometry: THREE.TetrahedronGeometry,
  dodecahedronGeometry: THREE.DodecahedronGeometry,
  icosahedronGeometry: THREE.IcosahedronGeometry,
});

// This file ensures Three.js geometries are available as JSX elements
// in React Three Fiber components