/**
 * FREE 3D Building Model Generator
 *
 * Generates Three.js-compatible 3D model data from floor plans
 * Uses NO paid APIs - generates geometry data for browser rendering
 */

import type { BuildingPlan, FloorPlan, WallSpec, Room } from './floorPlanGenerator';

// =============================================================================
// TYPES
// =============================================================================

export interface Vertex3D {
  x: number;
  y: number;
  z: number;
}

export interface Face3D {
  vertices: number[]; // indices into vertex array
  normal: Vertex3D;
  material: string;
}

export interface Mesh3D {
  id: string;
  name: string;
  type: string;
  vertices: Vertex3D[];
  faces: Face3D[];
  material: {
    color: string;
    opacity: number;
    metalness?: number;
    roughness?: number;
  };
  position: Vertex3D;
  rotation: Vertex3D;
  scale: Vertex3D;
}

export interface Building3DModel {
  id: string;
  name: string;
  meshes: Mesh3D[];
  boundingBox: {
    min: Vertex3D;
    max: Vertex3D;
  };
  metadata: {
    floors: number;
    totalArea: number;
    generatedAt: string;
  };
}

// =============================================================================
// MATERIAL DEFINITIONS
// =============================================================================

const MATERIALS = {
  external_wall: { color: '#e5e7eb', opacity: 1, metalness: 0, roughness: 0.8 },
  internal_wall: { color: '#f3f4f6', opacity: 1, metalness: 0, roughness: 0.9 },
  floor_concrete: { color: '#9ca3af', opacity: 1, metalness: 0.1, roughness: 0.7 },
  floor_tiles: { color: '#f5f5f4', opacity: 1, metalness: 0.3, roughness: 0.4 },
  floor_wood: { color: '#a16207', opacity: 1, metalness: 0, roughness: 0.6 },
  roof_tiles: { color: '#7c2d12', opacity: 1, metalness: 0.1, roughness: 0.6 },
  roof_flat: { color: '#6b7280', opacity: 1, metalness: 0.2, roughness: 0.5 },
  window_glass: { color: '#60a5fa', opacity: 0.3, metalness: 0.9, roughness: 0.1 },
  door_wood: { color: '#78350f', opacity: 1, metalness: 0, roughness: 0.7 },
  column: { color: '#d1d5db', opacity: 1, metalness: 0.1, roughness: 0.6 },
  beam: { color: '#9ca3af', opacity: 1, metalness: 0.1, roughness: 0.6 },
  foundation: { color: '#4b5563', opacity: 1, metalness: 0, roughness: 0.9 },
};

// =============================================================================
// 3D BUILDING GENERATOR CLASS
// =============================================================================

export class Building3DGenerator {
  private scale: number = 0.001; // Convert mm to meters for Three.js

  /**
   * Generate 3D model from building plan
   */
  generate(buildingPlan: BuildingPlan): Building3DModel {
    const meshes: Mesh3D[] = [];

    // Generate foundation
    meshes.push(this.generateFoundation(buildingPlan));

    // Generate each floor
    for (let i = 0; i < buildingPlan.floorPlans.length; i++) {
      const floorPlan = buildingPlan.floorPlans[i];
      const baseHeight = i * floorPlan.dimensions.height * this.scale;

      // Floor slab
      meshes.push(this.generateFloorSlab(floorPlan, baseHeight));

      // Walls
      for (const wall of floorPlan.walls) {
        meshes.push(this.generateWall(wall, baseHeight));

        // Windows and doors
        for (const opening of wall.openings) {
          if (opening.type === 'window') {
            meshes.push(this.generateWindow(wall, opening, baseHeight));
          } else if (opening.type === 'door') {
            meshes.push(this.generateDoor(wall, opening, baseHeight));
          }
        }
      }

      // Columns
      for (const column of floorPlan.columns) {
        meshes.push(this.generateColumn(column, baseHeight, floorPlan.dimensions.height));
      }

      // Stairs
      if (floorPlan.stairs && i < buildingPlan.floorPlans.length - 1) {
        meshes.push(this.generateStairs(floorPlan.stairs, baseHeight, floorPlan.dimensions.height));
      }
    }

    // Generate roof
    const topFloorHeight = buildingPlan.floorPlans.length * buildingPlan.floorPlans[0].dimensions.height * this.scale;
    meshes.push(this.generateRoof(buildingPlan, topFloorHeight));

    // Calculate bounding box
    const boundingBox = this.calculateBoundingBox(meshes);

    return {
      id: `3D-${buildingPlan.id}`,
      name: buildingPlan.projectName,
      meshes,
      boundingBox,
      metadata: {
        floors: buildingPlan.building.floors,
        totalArea: buildingPlan.building.totalArea,
        generatedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Generate foundation mesh
   */
  private generateFoundation(plan: BuildingPlan): Mesh3D {
    const width = plan.building.width * this.scale;
    const depth = plan.building.depth * this.scale;
    const height = plan.foundation.depth * this.scale;

    return this.createBox(
      `foundation`,
      'Foundation',
      'foundation',
      width + 0.2,
      height,
      depth + 0.2,
      { x: width / 2, y: -height / 2, z: depth / 2 },
      MATERIALS.foundation
    );
  }

  /**
   * Generate floor slab mesh
   */
  private generateFloorSlab(floorPlan: FloorPlan, baseHeight: number): Mesh3D {
    const width = floorPlan.dimensions.width * this.scale;
    const depth = floorPlan.dimensions.depth * this.scale;
    const slabThickness = 0.15; // 150mm slab

    return this.createBox(
      `slab_${floorPlan.level}`,
      `Floor Slab L${floorPlan.level}`,
      'slab',
      width,
      slabThickness,
      depth,
      { x: width / 2, y: baseHeight + slabThickness / 2, z: depth / 2 },
      MATERIALS.floor_concrete
    );
  }

  /**
   * Generate wall mesh
   */
  private generateWall(wall: WallSpec, baseHeight: number): Mesh3D {
    const startX = wall.start.x * this.scale;
    const startZ = wall.start.y * this.scale;
    const endX = wall.end.x * this.scale;
    const endZ = wall.end.y * this.scale;

    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endZ - startZ, 2));
    const angle = Math.atan2(endZ - startZ, endX - startX);
    const thickness = wall.thickness * this.scale;
    const height = wall.height * this.scale;

    const centerX = (startX + endX) / 2;
    const centerZ = (startZ + endZ) / 2;

    const material = wall.type === 'external' ? MATERIALS.external_wall : MATERIALS.internal_wall;

    return {
      id: wall.id,
      name: `Wall ${wall.id}`,
      type: 'wall',
      vertices: this.getBoxVertices(length, height, thickness),
      faces: this.getBoxFaces(),
      material,
      position: { x: centerX, y: baseHeight + height / 2 + 0.15, z: centerZ },
      rotation: { x: 0, y: -angle, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    };
  }

  /**
   * Generate window mesh
   */
  private generateWindow(wall: WallSpec, opening: any, baseHeight: number): Mesh3D {
    const wallAngle = Math.atan2(
      wall.end.y - wall.start.y,
      wall.end.x - wall.start.x
    );

    const openingX = wall.start.x * this.scale + Math.cos(wallAngle) * opening.position * this.scale;
    const openingZ = wall.start.y * this.scale + Math.sin(wallAngle) * opening.position * this.scale;
    const width = opening.width * this.scale;
    const height = opening.height * this.scale;
    const sillHeight = (opening.sillHeight || 900) * this.scale;

    return {
      id: opening.id,
      name: `Window ${opening.id}`,
      type: 'window',
      vertices: this.getBoxVertices(width, height, 0.05),
      faces: this.getBoxFaces(),
      material: MATERIALS.window_glass,
      position: { x: openingX, y: baseHeight + sillHeight + height / 2 + 0.15, z: openingZ },
      rotation: { x: 0, y: -wallAngle, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    };
  }

  /**
   * Generate door mesh
   */
  private generateDoor(wall: WallSpec, opening: any, baseHeight: number): Mesh3D {
    const wallAngle = Math.atan2(
      wall.end.y - wall.start.y,
      wall.end.x - wall.start.x
    );

    const openingX = wall.start.x * this.scale + Math.cos(wallAngle) * opening.position * this.scale;
    const openingZ = wall.start.y * this.scale + Math.sin(wallAngle) * opening.position * this.scale;
    const width = opening.width * this.scale;
    const height = opening.height * this.scale;

    return {
      id: opening.id,
      name: `Door ${opening.id}`,
      type: 'door',
      vertices: this.getBoxVertices(width, height, 0.05),
      faces: this.getBoxFaces(),
      material: MATERIALS.door_wood,
      position: { x: openingX, y: baseHeight + height / 2 + 0.15, z: openingZ },
      rotation: { x: 0, y: -wallAngle, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    };
  }

  /**
   * Generate column mesh
   */
  private generateColumn(column: any, baseHeight: number, floorHeight: number): Mesh3D {
    const width = column.width * this.scale;
    const depth = column.depth * this.scale;
    const height = floorHeight * this.scale;

    return this.createBox(
      column.id,
      `Column ${column.id}`,
      'column',
      width,
      height,
      depth,
      { x: column.x * this.scale, y: baseHeight + height / 2, z: column.y * this.scale },
      MATERIALS.column
    );
  }

  /**
   * Generate stairs mesh
   */
  private generateStairs(stairs: any, baseHeight: number, floorHeight: number): Mesh3D {
    const width = stairs.width * this.scale;
    const depth = stairs.steps * stairs.treadDepth * this.scale;
    const height = floorHeight * this.scale;

    return {
      id: stairs.id,
      name: 'Stairs',
      type: 'stairs',
      vertices: this.getStairsVertices(width, height, depth, stairs.steps),
      faces: this.getStairsFaces(stairs.steps),
      material: MATERIALS.floor_concrete,
      position: {
        x: stairs.position.x * this.scale,
        y: baseHeight,
        z: stairs.position.y * this.scale
      },
      rotation: { x: 0, y: stairs.direction * Math.PI / 180, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    };
  }

  /**
   * Generate roof mesh
   */
  private generateRoof(plan: BuildingPlan, baseHeight: number): Mesh3D {
    const width = plan.building.width * this.scale;
    const depth = plan.building.depth * this.scale;

    if (plan.roof.type === 'flat') {
      return this.createBox(
        'roof',
        'Roof',
        'roof',
        width + 0.4,
        0.2,
        depth + 0.4,
        { x: width / 2, y: baseHeight + 0.1, z: depth / 2 },
        MATERIALS.roof_flat
      );
    }

    // Pitched roof (simplified as a box for now)
    const roofHeight = Math.min(width, depth) * Math.tan(plan.roof.pitch * Math.PI / 180) / 2;

    return {
      id: 'roof',
      name: 'Roof',
      type: 'roof',
      vertices: this.getPitchedRoofVertices(width, depth, roofHeight),
      faces: this.getPitchedRoofFaces(),
      material: MATERIALS.roof_tiles,
      position: { x: width / 2, y: baseHeight, z: depth / 2 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    };
  }

  /**
   * Create a box mesh helper
   */
  private createBox(
    id: string,
    name: string,
    type: string,
    width: number,
    height: number,
    depth: number,
    position: Vertex3D,
    material: typeof MATERIALS.external_wall
  ): Mesh3D {
    return {
      id,
      name,
      type,
      vertices: this.getBoxVertices(width, height, depth),
      faces: this.getBoxFaces(),
      material,
      position,
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    };
  }

  /**
   * Get box vertices
   */
  private getBoxVertices(width: number, height: number, depth: number): Vertex3D[] {
    const hw = width / 2;
    const hh = height / 2;
    const hd = depth / 2;

    return [
      { x: -hw, y: -hh, z: -hd }, // 0
      { x: hw, y: -hh, z: -hd },  // 1
      { x: hw, y: hh, z: -hd },   // 2
      { x: -hw, y: hh, z: -hd },  // 3
      { x: -hw, y: -hh, z: hd },  // 4
      { x: hw, y: -hh, z: hd },   // 5
      { x: hw, y: hh, z: hd },    // 6
      { x: -hw, y: hh, z: hd },   // 7
    ];
  }

  /**
   * Get box faces
   */
  private getBoxFaces(): Face3D[] {
    return [
      { vertices: [0, 1, 2, 3], normal: { x: 0, y: 0, z: -1 }, material: 'front' },
      { vertices: [5, 4, 7, 6], normal: { x: 0, y: 0, z: 1 }, material: 'back' },
      { vertices: [4, 0, 3, 7], normal: { x: -1, y: 0, z: 0 }, material: 'left' },
      { vertices: [1, 5, 6, 2], normal: { x: 1, y: 0, z: 0 }, material: 'right' },
      { vertices: [3, 2, 6, 7], normal: { x: 0, y: 1, z: 0 }, material: 'top' },
      { vertices: [4, 5, 1, 0], normal: { x: 0, y: -1, z: 0 }, material: 'bottom' },
    ];
  }

  /**
   * Get stairs vertices
   */
  private getStairsVertices(width: number, height: number, depth: number, steps: number): Vertex3D[] {
    const vertices: Vertex3D[] = [];
    const stepHeight = height / steps;
    const stepDepth = depth / steps;

    for (let i = 0; i <= steps; i++) {
      const y = i * stepHeight;
      const z = i * stepDepth;

      vertices.push({ x: -width / 2, y, z });
      vertices.push({ x: width / 2, y, z });
    }

    return vertices;
  }

  /**
   * Get stairs faces
   */
  private getStairsFaces(steps: number): Face3D[] {
    const faces: Face3D[] = [];

    for (let i = 0; i < steps; i++) {
      const baseIdx = i * 2;

      // Tread (top of step)
      faces.push({
        vertices: [baseIdx, baseIdx + 1, baseIdx + 3, baseIdx + 2],
        normal: { x: 0, y: 1, z: 0 },
        material: 'tread',
      });

      // Riser (front of step)
      faces.push({
        vertices: [baseIdx + 2, baseIdx + 3, baseIdx + 1, baseIdx],
        normal: { x: 0, y: 0, z: -1 },
        material: 'riser',
      });
    }

    return faces;
  }

  /**
   * Get pitched roof vertices
   */
  private getPitchedRoofVertices(width: number, depth: number, roofHeight: number): Vertex3D[] {
    const hw = width / 2;
    const hd = depth / 2;

    return [
      { x: -hw, y: 0, z: -hd },   // 0 - front left
      { x: hw, y: 0, z: -hd },    // 1 - front right
      { x: hw, y: 0, z: hd },     // 2 - back right
      { x: -hw, y: 0, z: hd },    // 3 - back left
      { x: 0, y: roofHeight, z: -hd }, // 4 - front ridge
      { x: 0, y: roofHeight, z: hd },  // 5 - back ridge
    ];
  }

  /**
   * Get pitched roof faces
   */
  private getPitchedRoofFaces(): Face3D[] {
    return [
      { vertices: [0, 1, 4], normal: { x: 0, y: 0.7, z: -0.7 }, material: 'front' },
      { vertices: [2, 3, 5], normal: { x: 0, y: 0.7, z: 0.7 }, material: 'back' },
      { vertices: [3, 0, 4, 5], normal: { x: -0.7, y: 0.7, z: 0 }, material: 'left' },
      { vertices: [1, 2, 5, 4], normal: { x: 0.7, y: 0.7, z: 0 }, material: 'right' },
    ];
  }

  /**
   * Calculate bounding box
   */
  private calculateBoundingBox(meshes: Mesh3D[]): Building3DModel['boundingBox'] {
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

    for (const mesh of meshes) {
      for (const vertex of mesh.vertices) {
        const worldX = vertex.x + mesh.position.x;
        const worldY = vertex.y + mesh.position.y;
        const worldZ = vertex.z + mesh.position.z;

        minX = Math.min(minX, worldX);
        minY = Math.min(minY, worldY);
        minZ = Math.min(minZ, worldZ);
        maxX = Math.max(maxX, worldX);
        maxY = Math.max(maxY, worldY);
        maxZ = Math.max(maxZ, worldZ);
      }
    }

    return {
      min: { x: minX, y: minY, z: minZ },
      max: { x: maxX, y: maxY, z: maxZ },
    };
  }

  /**
   * Export to GLTF-compatible format
   */
  exportToGLTF(model: Building3DModel): object {
    return {
      asset: {
        version: '2.0',
        generator: 'EmersonEIMS Building3DGenerator',
      },
      scene: 0,
      scenes: [{ nodes: [0] }],
      nodes: model.meshes.map((mesh, index) => ({
        mesh: index,
        name: mesh.name,
        translation: [mesh.position.x, mesh.position.y, mesh.position.z],
        rotation: this.eulerToQuaternion(mesh.rotation),
        scale: [mesh.scale.x, mesh.scale.y, mesh.scale.z],
      })),
      meshes: model.meshes.map(mesh => ({
        primitives: [{
          attributes: {
            POSITION: 0,
            NORMAL: 1,
          },
          indices: 2,
        }],
        name: mesh.name,
      })),
      // Accessors, buffers, etc. would be populated for a complete GLTF
      extras: {
        buildingInfo: model.metadata,
      },
    };
  }

  /**
   * Convert Euler angles to quaternion
   */
  private eulerToQuaternion(euler: Vertex3D): number[] {
    const c1 = Math.cos(euler.x / 2);
    const c2 = Math.cos(euler.y / 2);
    const c3 = Math.cos(euler.z / 2);
    const s1 = Math.sin(euler.x / 2);
    const s2 = Math.sin(euler.y / 2);
    const s3 = Math.sin(euler.z / 2);

    return [
      s1 * c2 * c3 + c1 * s2 * s3,
      c1 * s2 * c3 - s1 * c2 * s3,
      c1 * c2 * s3 + s1 * s2 * c3,
      c1 * c2 * c3 - s1 * s2 * s3,
    ];
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const building3DGenerator = new Building3DGenerator();
