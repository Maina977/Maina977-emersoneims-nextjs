// ============================================================================
// BuildMaster Pro™ - AI ARCHITECT ENGINE
// Complete 3D House Design, Drawings, Floor Plans, Elevations, Sections
// ============================================================================

// ============================================================================
// ARCHITECTURAL STYLES DATABASE
// ============================================================================

export const ARCHITECTURAL_STYLES = {
  modern: {
    name: 'Modern Minimalist',
    features: ['Flat roofs', 'Large windows', 'Open floor plans', 'Clean lines', 'Neutral colors'],
    roofTypes: ['Flat', 'Butterfly', 'Skillion'],
    materials: ['Concrete', 'Glass', 'Steel', 'Wood accents'],
    windowStyle: 'Floor-to-ceiling',
    exteriorFinish: 'Smooth plaster / Exposed concrete'
  },
  contemporary: {
    name: 'Contemporary',
    features: ['Mixed materials', 'Asymmetrical designs', 'Natural light', 'Indoor-outdoor flow'],
    roofTypes: ['Mixed pitch', 'Green roof', 'Flat sections'],
    materials: ['Stone', 'Glass', 'Wood', 'Metal'],
    windowStyle: 'Large picture windows',
    exteriorFinish: 'Mixed textures'
  },
  colonial: {
    name: 'Colonial',
    features: ['Symmetrical facade', 'Columns', 'Pitched roof', 'Formal layout'],
    roofTypes: ['Gable', 'Hip'],
    materials: ['Brick', 'Wood siding', 'Stone'],
    windowStyle: 'Double-hung with shutters',
    exteriorFinish: 'Painted wood / Brick'
  },
  mediterranean: {
    name: 'Mediterranean',
    features: ['Arched openings', 'Tile roofs', 'Courtyards', 'Balconies'],
    roofTypes: ['Clay tile', 'Low-pitch hip'],
    materials: ['Stucco', 'Terracotta', 'Wrought iron'],
    windowStyle: 'Arched top windows',
    exteriorFinish: 'Textured stucco'
  },
  tropical: {
    name: 'Tropical Modern',
    features: ['Cross ventilation', 'Verandas', 'High ceilings', 'Indoor gardens'],
    roofTypes: ['Wide overhangs', 'Pitched', 'Vented'],
    materials: ['Timber', 'Stone', 'Thatch accents'],
    windowStyle: 'Louvers / Jalousie',
    exteriorFinish: 'Natural stone / Wood'
  },
  african: {
    name: 'African Contemporary',
    features: ['Earth tones', 'Geometric patterns', 'Natural materials', 'Courtyards'],
    roofTypes: ['Flat with parapet', 'Mono-pitch'],
    materials: ['Local stone', 'Rammed earth', 'Timber'],
    windowStyle: 'Screened openings',
    exteriorFinish: 'Textured render / Stone'
  }
};

// ============================================================================
// ROOM TEMPLATES
// ============================================================================

export const ROOM_TEMPLATES = {
  residential: {
    living: { minArea: 15, maxArea: 50, minWidth: 3.5, aspectRatio: 1.5, windows: 2, doors: 2 },
    dining: { minArea: 10, maxArea: 25, minWidth: 3, aspectRatio: 1.3, windows: 1, doors: 1 },
    kitchen: { minArea: 8, maxArea: 25, minWidth: 2.5, aspectRatio: 1.2, windows: 1, doors: 2 },
    masterBedroom: { minArea: 14, maxArea: 35, minWidth: 3.5, aspectRatio: 1.4, windows: 2, doors: 2 },
    bedroom: { minArea: 10, maxArea: 20, minWidth: 3, aspectRatio: 1.3, windows: 1, doors: 1 },
    bathroom: { minArea: 4, maxArea: 12, minWidth: 2, aspectRatio: 1.2, windows: 1, doors: 1 },
    ensuite: { minArea: 5, maxArea: 15, minWidth: 2.2, aspectRatio: 1.3, windows: 1, doors: 1 },
    guestToilet: { minArea: 2, maxArea: 4, minWidth: 1.2, aspectRatio: 1.5, windows: 0, doors: 1 },
    garage: { minArea: 18, maxArea: 60, minWidth: 5.5, aspectRatio: 2, windows: 0, doors: 2 },
    laundry: { minArea: 4, maxArea: 10, minWidth: 2, aspectRatio: 1.2, windows: 1, doors: 1 },
    store: { minArea: 3, maxArea: 10, minWidth: 1.5, aspectRatio: 1, windows: 0, doors: 1 },
    study: { minArea: 8, maxArea: 15, minWidth: 2.5, aspectRatio: 1.3, windows: 1, doors: 1 },
    balcony: { minArea: 4, maxArea: 20, minWidth: 1.5, aspectRatio: 2, windows: 0, doors: 1 },
    patio: { minArea: 10, maxArea: 50, minWidth: 3, aspectRatio: 1.5, windows: 0, doors: 1 }
  },
  commercial: {
    office: { minArea: 12, maxArea: 100, minWidth: 3, aspectRatio: 1.5, windows: 2, doors: 1 },
    reception: { minArea: 15, maxArea: 50, minWidth: 4, aspectRatio: 1.3, windows: 1, doors: 2 },
    meetingRoom: { minArea: 15, maxArea: 40, minWidth: 4, aspectRatio: 1.4, windows: 1, doors: 1 },
    breakRoom: { minArea: 10, maxArea: 30, minWidth: 3, aspectRatio: 1.3, windows: 1, doors: 1 }
  }
};

// ============================================================================
// DRAWING TYPES
// ============================================================================

export interface ArchitecturalDrawing {
  id: string;
  type: 'floor_plan' | 'elevation' | 'section' | 'roof_plan' | 'site_plan' | 'detail' | '3d_view';
  title: string;
  scale: string;
  floor?: number;
  direction?: string;
  description: string;
  elements: DrawingElement[];
  dimensions: Dimension[];
  annotations: Annotation[];
  gridLines: GridLine[];
}

export interface DrawingElement {
  type: 'wall' | 'door' | 'window' | 'column' | 'beam' | 'stair' | 'furniture' | 'fixture';
  id: string;
  coordinates: { x: number; y: number; width: number; height: number; rotation?: number };
  properties: Record<string, any>;
}

export interface Dimension {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  value: string;
  type: 'linear' | 'angular' | 'radial';
}

export interface Annotation {
  id: string;
  position: { x: number; y: number };
  text: string;
  type: 'room_name' | 'area' | 'note' | 'level' | 'grid_ref';
}

export interface GridLine {
  id: string;
  label: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  type: 'horizontal' | 'vertical';
}

// ============================================================================
// FLOOR PLAN DESIGN
// ============================================================================

export interface FloorPlan {
  id: string;
  floor: number;
  name: string;
  area: number;
  rooms: RoomDesign[];
  walls: Wall[];
  doors: Door[];
  windows: Window[];
  stairs?: Stair;
  dimensions: { length: number; width: number };
}

export interface RoomDesign {
  id: string;
  name: string;
  type: string;
  floor: number;
  area: number;
  dimensions: { length: number; width: number; height: number };
  position: { x: number; y: number };
  features: string[];
  finishes: {
    floor: string;
    walls: string;
    ceiling: string;
  };
  electrical: {
    sockets: number;
    lights: number;
    switches: number;
    fanPoints: number;
    acPoints: number;
  };
  plumbing?: {
    coldWater: number;
    hotWater: number;
    drainage: number;
  };
}

export interface Wall {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  thickness: number;
  height: number;
  type: 'external' | 'internal' | 'partition';
  material: string;
}

export interface Door {
  id: string;
  wallId: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  type: 'single' | 'double' | 'sliding' | 'folding' | 'pivot' | 'french';
  material: string;
  swing: 'left' | 'right' | 'both';
  opens: 'in' | 'out';
}

export interface Window {
  id: string;
  wallId: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  sillHeight: number;
  type: 'fixed' | 'casement' | 'sliding' | 'awning' | 'louver';
  material: string;
  glazing: 'single' | 'double' | 'triple';
}

export interface Stair {
  id: string;
  type: 'straight' | 'l-shaped' | 'u-shaped' | 'spiral' | 'curved';
  position: { x: number; y: number };
  width: number;
  totalRise: number;
  risers: number;
  riserHeight: number;
  treadDepth: number;
  material: string;
}

// ============================================================================
// 3D MODEL DATA
// ============================================================================

export interface Model3D {
  id: string;
  name: string;
  format: 'IFC' | 'OBJ' | 'GLTF' | 'FBX';
  vertices: number;
  faces: number;
  materials: Material3D[];
  objects: Object3D[];
  cameras: Camera3D[];
  lights: Light3D[];
}

export interface Material3D {
  id: string;
  name: string;
  type: string;
  color: string;
  texture?: string;
  roughness: number;
  metalness: number;
}

export interface Object3D {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  materialId: string;
}

export interface Camera3D {
  id: string;
  name: string;
  type: 'perspective' | 'orthographic';
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  fov: number;
}

export interface Light3D {
  id: string;
  type: 'ambient' | 'directional' | 'point' | 'spot';
  position: { x: number; y: number; z: number };
  color: string;
  intensity: number;
}

// ============================================================================
// AI ARCHITECT CLASS
// ============================================================================

export class AIArchitect {
  private designCounter = 0;

  // Generate complete house design
  generateHouseDesign(requirements: {
    buildingType: string;
    totalArea: number;
    floors: number;
    bedrooms: number;
    bathrooms: number;
    style: string;
    plotDimensions: { length: number; width: number };
    setbacks: { front: number; rear: number; sides: number };
    features: string[];
  }): {
    design: HouseDesign;
    floorPlans: FloorPlan[];
    drawings: ArchitecturalDrawing[];
    model3D: Model3D;
    specifications: BuildingSpecifications;
  } {
    this.designCounter++;
    const designId = `ARCH-${Date.now()}-${this.designCounter}`;

    // Calculate buildable area
    const buildableLength = requirements.plotDimensions.length - requirements.setbacks.front - requirements.setbacks.rear;
    const buildableWidth = requirements.plotDimensions.width - requirements.setbacks.sides * 2;
    const maxFootprint = buildableLength * buildableWidth;
    const footprint = Math.min(requirements.totalArea / requirements.floors, maxFootprint * 0.5);

    // Generate floor plans
    const floorPlans = this.generateFloorPlans(requirements, footprint);

    // Generate all drawings
    const drawings = this.generateDrawingSet(floorPlans, requirements);

    // Generate 3D model
    const model3D = this.generate3DModel(floorPlans, requirements.style);

    // Generate specifications
    const specifications = this.generateSpecifications(requirements, floorPlans);

    const design: HouseDesign = {
      id: designId,
      name: `${requirements.style} ${requirements.buildingType} - ${requirements.bedrooms}BR`,
      style: requirements.style,
      buildingType: requirements.buildingType,
      floors: requirements.floors,
      totalArea: requirements.totalArea,
      footprint,
      bedrooms: requirements.bedrooms,
      bathrooms: requirements.bathrooms,
      features: requirements.features,
      dimensions: {
        length: Math.sqrt(footprint * 1.3),
        width: Math.sqrt(footprint / 1.3),
        height: requirements.floors * 3.2 + 1.5
      },
      sustainability: {
        energyRating: 'A',
        solarReady: true,
        rainwaterHarvesting: true,
        naturalVentilation: true,
        daylightFactor: 85
      },
      estimatedCost: Math.round(requirements.totalArea * 45000),
      constructionDays: Math.round(requirements.totalArea / 1.5 + 60)
    };

    return { design, floorPlans, drawings, model3D, specifications };
  }

  // Generate floor plans
  private generateFloorPlans(requirements: any, footprint: number): FloorPlan[] {
    const floorPlans: FloorPlan[] = [];
    const floorLength = Math.sqrt(footprint * 1.3);
    const floorWidth = Math.sqrt(footprint / 1.3);

    for (let floor = 0; floor < requirements.floors; floor++) {
      const rooms: RoomDesign[] = [];
      let roomId = 1;

      if (floor === 0) {
        // Ground floor - public spaces
        rooms.push(this.createRoom(`R${String(roomId++).padStart(3, '0')}`, 'Living Room', 'living', floor, footprint * 0.2, { x: 0, y: 0 }));
        rooms.push(this.createRoom(`R${String(roomId++).padStart(3, '0')}`, 'Dining Room', 'dining', floor, footprint * 0.1, { x: footprint * 0.2, y: 0 }));
        rooms.push(this.createRoom(`R${String(roomId++).padStart(3, '0')}`, 'Kitchen', 'kitchen', floor, footprint * 0.1, { x: footprint * 0.3, y: 0 }));
        rooms.push(this.createRoom(`R${String(roomId++).padStart(3, '0')}`, 'Guest Toilet', 'guestToilet', floor, 3, { x: footprint * 0.4, y: 0 }));

        if (requirements.floors === 1) {
          // All bedrooms on ground floor for bungalow
          for (let i = 0; i < requirements.bedrooms; i++) {
            const isMaster = i === 0;
            rooms.push(this.createRoom(
              `R${String(roomId++).padStart(3, '0')}`,
              isMaster ? 'Master Bedroom' : `Bedroom ${i + 1}`,
              isMaster ? 'masterBedroom' : 'bedroom',
              floor,
              isMaster ? footprint * 0.15 : footprint * 0.1,
              { x: 0, y: footprint * 0.4 + i * 0.15 }
            ));
            if (isMaster) {
              rooms.push(this.createRoom(`R${String(roomId++).padStart(3, '0')}`, 'En-suite', 'ensuite', floor, 8, { x: footprint * 0.15, y: footprint * 0.4 }));
            }
          }
        }

        rooms.push(this.createRoom(`R${String(roomId++).padStart(3, '0')}`, 'Garage', 'garage', floor, 36, { x: floorLength - 6, y: 0 }));
        rooms.push(this.createRoom(`R${String(roomId++).padStart(3, '0')}`, 'Laundry', 'laundry', floor, 6, { x: floorLength - 6, y: 6 }));

      } else if (floor === 1) {
        // First floor - bedrooms
        for (let i = 0; i < requirements.bedrooms; i++) {
          const isMaster = i === 0;
          rooms.push(this.createRoom(
            `R${String(roomId++).padStart(3, '0')}`,
            isMaster ? 'Master Bedroom' : `Bedroom ${i + 1}`,
            isMaster ? 'masterBedroom' : 'bedroom',
            floor,
            isMaster ? footprint * 0.18 : footprint * 0.12,
            { x: i * (floorWidth / requirements.bedrooms), y: 0 }
          ));
          if (isMaster) {
            rooms.push(this.createRoom(`R${String(roomId++).padStart(3, '0')}`, 'En-suite', 'ensuite', floor, 10, { x: footprint * 0.18, y: 0 }));
            rooms.push(this.createRoom(`R${String(roomId++).padStart(3, '0')}`, 'Walk-in Closet', 'store', floor, 6, { x: footprint * 0.28, y: 0 }));
          }
        }

        rooms.push(this.createRoom(`R${String(roomId++).padStart(3, '0')}`, 'Family Bathroom', 'bathroom', floor, 8, { x: floorLength - 4, y: 0 }));
        rooms.push(this.createRoom(`R${String(roomId++).padStart(3, '0')}`, 'Study', 'study', floor, 10, { x: floorLength - 4, y: 4 }));
      }

      // Generate walls
      const walls = this.generateWalls(rooms, floorLength, floorWidth);

      // Generate doors
      const doors = this.generateDoors(rooms, walls);

      // Generate windows
      const windows = this.generateWindows(rooms, walls);

      floorPlans.push({
        id: `FP-${floor}`,
        floor,
        name: floor === 0 ? 'Ground Floor' : floor === 1 ? 'First Floor' : `Floor ${floor}`,
        area: footprint,
        rooms,
        walls,
        doors,
        windows,
        stairs: requirements.floors > 1 ? this.generateStair(floor) : undefined,
        dimensions: { length: Math.round(floorLength * 10) / 10, width: Math.round(floorWidth * 10) / 10 }
      });
    }

    return floorPlans;
  }

  // Create room
  private createRoom(id: string, name: string, type: string, floor: number, area: number, position: { x: number; y: number }): RoomDesign {
    const length = Math.sqrt(area * 1.3);
    const width = area / length;

    const finishes = this.getRoomFinishes(type);
    const electrical = this.getRoomElectrical(type, area);
    const plumbing = this.getRoomPlumbing(type);

    return {
      id,
      name,
      type,
      floor,
      area: Math.round(area * 10) / 10,
      dimensions: {
        length: Math.round(length * 10) / 10,
        width: Math.round(width * 10) / 10,
        height: 3.0
      },
      position,
      features: this.getRoomFeatures(type),
      finishes,
      electrical,
      plumbing
    };
  }

  // Get room finishes
  private getRoomFinishes(type: string): { floor: string; walls: string; ceiling: string } {
    const finishes: Record<string, { floor: string; walls: string; ceiling: string }> = {
      living: { floor: 'Porcelain Tiles 60x60', walls: 'Emulsion Paint', ceiling: 'Gypsum Board + Paint' },
      dining: { floor: 'Porcelain Tiles 60x60', walls: 'Emulsion Paint', ceiling: 'Gypsum Board + Paint' },
      kitchen: { floor: 'Ceramic Tiles Anti-slip', walls: 'Ceramic Tiles (splash) + Paint', ceiling: 'PVC Ceiling' },
      masterBedroom: { floor: 'Hardwood / Laminate', walls: 'Emulsion Paint', ceiling: 'Gypsum Board + Paint' },
      bedroom: { floor: 'Laminate Flooring', walls: 'Emulsion Paint', ceiling: 'Gypsum Board + Paint' },
      bathroom: { floor: 'Ceramic Tiles Anti-slip', walls: 'Ceramic Wall Tiles', ceiling: 'PVC Ceiling' },
      ensuite: { floor: 'Porcelain Tiles Anti-slip', walls: 'Porcelain Wall Tiles', ceiling: 'PVC Ceiling' },
      guestToilet: { floor: 'Ceramic Tiles', walls: 'Ceramic Tiles', ceiling: 'PVC Ceiling' },
      garage: { floor: 'Power Float Concrete', walls: 'Cement Render + Paint', ceiling: 'Exposed / Painted' },
      laundry: { floor: 'Ceramic Tiles Anti-slip', walls: 'Ceramic Tiles (splash) + Paint', ceiling: 'PVC Ceiling' },
      store: { floor: 'Cement Screed', walls: 'Emulsion Paint', ceiling: 'Exposed / Painted' },
      study: { floor: 'Laminate Flooring', walls: 'Emulsion Paint', ceiling: 'Gypsum Board + Paint' }
    };
    return finishes[type] || finishes.living;
  }

  // Get room electrical requirements
  private getRoomElectrical(type: string, area: number): { sockets: number; lights: number; switches: number; fanPoints: number; acPoints: number } {
    const base: Record<string, { sockets: number; lights: number; switches: number; fanPoints: number; acPoints: number }> = {
      living: { sockets: 6, lights: 2, switches: 3, fanPoints: 1, acPoints: 1 },
      dining: { sockets: 3, lights: 1, switches: 2, fanPoints: 1, acPoints: 0 },
      kitchen: { sockets: 8, lights: 2, switches: 3, fanPoints: 1, acPoints: 0 },
      masterBedroom: { sockets: 6, lights: 2, switches: 4, fanPoints: 1, acPoints: 1 },
      bedroom: { sockets: 4, lights: 1, switches: 2, fanPoints: 1, acPoints: 1 },
      bathroom: { sockets: 1, lights: 2, switches: 2, fanPoints: 1, acPoints: 0 },
      ensuite: { sockets: 1, lights: 2, switches: 2, fanPoints: 1, acPoints: 0 },
      guestToilet: { sockets: 0, lights: 1, switches: 1, fanPoints: 1, acPoints: 0 },
      garage: { sockets: 4, lights: 2, switches: 2, fanPoints: 0, acPoints: 0 },
      laundry: { sockets: 3, lights: 1, switches: 1, fanPoints: 0, acPoints: 0 },
      store: { sockets: 1, lights: 1, switches: 1, fanPoints: 0, acPoints: 0 },
      study: { sockets: 6, lights: 2, switches: 2, fanPoints: 1, acPoints: 1 }
    };
    return base[type] || base.living;
  }

  // Get room plumbing
  private getRoomPlumbing(type: string): { coldWater: number; hotWater: number; drainage: number } | undefined {
    const plumbing: Record<string, { coldWater: number; hotWater: number; drainage: number }> = {
      kitchen: { coldWater: 2, hotWater: 1, drainage: 2 },
      bathroom: { coldWater: 3, hotWater: 2, drainage: 3 },
      ensuite: { coldWater: 3, hotWater: 2, drainage: 3 },
      guestToilet: { coldWater: 1, hotWater: 0, drainage: 1 },
      laundry: { coldWater: 2, hotWater: 1, drainage: 1 }
    };
    return plumbing[type];
  }

  // Get room features
  private getRoomFeatures(type: string): string[] {
    const features: Record<string, string[]> = {
      living: ['Bay window', 'TV wall mount', 'Accent lighting'],
      dining: ['Chandelier point', 'Serving counter'],
      kitchen: ['Island counter', 'Pantry', 'Range hood', 'Under-cabinet lights'],
      masterBedroom: ['Walk-in closet', 'Balcony access', 'TV point', 'Reading lights'],
      bedroom: ['Built-in wardrobe', 'Study corner'],
      bathroom: ['Rain shower', 'Bathtub', 'Heated towel rail'],
      ensuite: ['Walk-in shower', 'Double vanity', 'Heated floor'],
      guestToilet: ['Wall-hung WC', 'Wash basin'],
      garage: ['Auto door', 'Workbench area', 'Storage shelves'],
      laundry: ['Plumbing for washer/dryer', 'Hanging rail', 'Utility sink'],
      store: ['Adjustable shelving'],
      study: ['Built-in desk', 'Bookshelf wall', 'Data points']
    };
    return features[type] || [];
  }

  // Generate walls
  private generateWalls(rooms: RoomDesign[], length: number, width: number): Wall[] {
    const walls: Wall[] = [];
    let wallId = 1;

    // External walls
    walls.push({ id: `W${wallId++}`, start: { x: 0, y: 0 }, end: { x: length, y: 0 }, thickness: 0.23, height: 3.0, type: 'external', material: 'Concrete Block 200mm' });
    walls.push({ id: `W${wallId++}`, start: { x: length, y: 0 }, end: { x: length, y: width }, thickness: 0.23, height: 3.0, type: 'external', material: 'Concrete Block 200mm' });
    walls.push({ id: `W${wallId++}`, start: { x: length, y: width }, end: { x: 0, y: width }, thickness: 0.23, height: 3.0, type: 'external', material: 'Concrete Block 200mm' });
    walls.push({ id: `W${wallId++}`, start: { x: 0, y: width }, end: { x: 0, y: 0 }, thickness: 0.23, height: 3.0, type: 'external', material: 'Concrete Block 200mm' });

    // Internal walls (simplified)
    rooms.forEach(room => {
      walls.push({
        id: `W${wallId++}`,
        start: { x: room.position.x, y: room.position.y },
        end: { x: room.position.x + room.dimensions.length, y: room.position.y },
        thickness: 0.15,
        height: 3.0,
        type: 'internal',
        material: 'Concrete Block 150mm'
      });
    });

    return walls;
  }

  // Generate doors
  private generateDoors(rooms: RoomDesign[], walls: Wall[]): Door[] {
    const doors: Door[] = [];
    let doorId = 1;

    // Main entrance
    doors.push({
      id: `D${String(doorId++).padStart(3, '0')}`,
      wallId: 'W1',
      position: { x: 2, y: 0 },
      width: 1.2,
      height: 2.4,
      type: 'double',
      material: 'Solid Mahogany',
      swing: 'both',
      opens: 'in'
    });

    // Room doors
    rooms.forEach(room => {
      const doorType = room.type === 'garage' ? 'sliding' : room.type === 'bathroom' || room.type === 'ensuite' ? 'single' : 'single';
      const doorWidth = room.type === 'garage' ? 2.4 : room.type === 'guestToilet' ? 0.7 : 0.9;

      doors.push({
        id: `D${String(doorId++).padStart(3, '0')}`,
        wallId: `W${doorId}`,
        position: { x: room.position.x, y: room.position.y },
        width: doorWidth,
        height: 2.1,
        type: doorType,
        material: room.type === 'bathroom' || room.type === 'ensuite' ? 'Flush Door Water-resistant' : 'Flush Door',
        swing: 'left',
        opens: 'in'
      });
    });

    return doors;
  }

  // Generate windows
  private generateWindows(rooms: RoomDesign[], walls: Wall[]): Window[] {
    const windows: Window[] = [];
    let windowId = 1;

    rooms.forEach(room => {
      if (room.type !== 'store' && room.type !== 'guestToilet') {
        const windowCount = room.type === 'living' || room.type === 'masterBedroom' ? 2 : 1;
        const windowWidth = room.type === 'living' ? 1.8 : room.type === 'bathroom' || room.type === 'ensuite' ? 0.6 : 1.2;
        const windowHeight = room.type === 'bathroom' || room.type === 'ensuite' ? 0.6 : 1.5;
        const sillHeight = room.type === 'bathroom' || room.type === 'ensuite' ? 1.8 : 0.9;

        for (let i = 0; i < windowCount; i++) {
          windows.push({
            id: `WIN${String(windowId++).padStart(3, '0')}`,
            wallId: `W${windowId}`,
            position: { x: room.position.x + (room.dimensions.length / (windowCount + 1)) * (i + 1), y: room.position.y },
            width: windowWidth,
            height: windowHeight,
            sillHeight,
            type: room.type === 'bathroom' || room.type === 'ensuite' ? 'awning' : 'casement',
            material: 'Aluminum Powder-coated',
            glazing: 'double'
          });
        }
      }
    });

    return windows;
  }

  // Generate stair
  private generateStair(floor: number): Stair {
    return {
      id: `STAIR-${floor}`,
      type: 'l-shaped',
      position: { x: 8, y: 4 },
      width: 1.0,
      totalRise: 3.0,
      risers: 17,
      riserHeight: 0.176,
      treadDepth: 0.28,
      material: 'Reinforced Concrete + Hardwood treads'
    };
  }

  // Generate drawing set
  private generateDrawingSet(floorPlans: FloorPlan[], requirements: any): ArchitecturalDrawing[] {
    const drawings: ArchitecturalDrawing[] = [];

    // Site Plan
    drawings.push({
      id: 'DWG-001',
      type: 'site_plan',
      title: 'SITE PLAN',
      scale: '1:200',
      description: 'Site layout showing building position, setbacks, access',
      elements: [],
      dimensions: [],
      annotations: [
        { id: 'A1', position: { x: 0, y: 0 }, text: 'PLOT BOUNDARY', type: 'note' },
        { id: 'A2', position: { x: 10, y: 10 }, text: 'BUILDING FOOTPRINT', type: 'note' }
      ],
      gridLines: []
    });

    // Floor Plans
    floorPlans.forEach((fp, index) => {
      drawings.push({
        id: `DWG-${String(index + 2).padStart(3, '0')}`,
        type: 'floor_plan',
        title: `${fp.name.toUpperCase()} PLAN`,
        scale: '1:100',
        floor: fp.floor,
        description: `Floor plan showing room layout, dimensions, doors, windows`,
        elements: [
          ...fp.walls.map(w => ({ type: 'wall' as const, id: w.id, coordinates: { x: w.start.x, y: w.start.y, width: w.thickness, height: Math.sqrt((w.end.x - w.start.x) ** 2 + (w.end.y - w.start.y) ** 2) }, properties: { material: w.material } })),
          ...fp.doors.map(d => ({ type: 'door' as const, id: d.id, coordinates: { x: d.position.x, y: d.position.y, width: d.width, height: d.height }, properties: { type: d.type, material: d.material } })),
          ...fp.windows.map(w => ({ type: 'window' as const, id: w.id, coordinates: { x: w.position.x, y: w.position.y, width: w.width, height: w.height }, properties: { type: w.type, glazing: w.glazing } }))
        ],
        dimensions: fp.rooms.map((r, i) => ({
          id: `DIM-${i}`,
          start: { x: r.position.x, y: r.position.y },
          end: { x: r.position.x + r.dimensions.length, y: r.position.y },
          value: `${r.dimensions.length}m`,
          type: 'linear' as const
        })),
        annotations: fp.rooms.map((r, i) => ({
          id: `ANN-${i}`,
          position: { x: r.position.x + r.dimensions.length / 2, y: r.position.y + r.dimensions.width / 2 },
          text: `${r.name}\n${r.area}m²`,
          type: 'room_name' as const
        })),
        gridLines: this.generateGridLines(fp)
      });
    });

    // Elevations
    ['North', 'South', 'East', 'West'].forEach((direction, index) => {
      drawings.push({
        id: `DWG-${String(floorPlans.length + index + 2).padStart(3, '0')}`,
        type: 'elevation',
        title: `${direction.toUpperCase()} ELEVATION`,
        scale: '1:100',
        direction,
        description: `${direction} elevation showing external facade, openings, materials`,
        elements: [],
        dimensions: [],
        annotations: [
          { id: 'A1', position: { x: 0, y: 0 }, text: `FFL 0.000`, type: 'level' },
          { id: 'A2', position: { x: 0, y: 3 }, text: `FFL +3.000`, type: 'level' }
        ],
        gridLines: []
      });
    });

    // Sections
    drawings.push({
      id: `DWG-${String(floorPlans.length + 6).padStart(3, '0')}`,
      type: 'section',
      title: 'SECTION A-A',
      scale: '1:100',
      description: 'Cross section showing internal arrangement, floor levels, roof structure',
      elements: [],
      dimensions: [],
      annotations: [],
      gridLines: []
    });

    drawings.push({
      id: `DWG-${String(floorPlans.length + 7).padStart(3, '0')}`,
      type: 'section',
      title: 'SECTION B-B',
      scale: '1:100',
      description: 'Longitudinal section showing internal arrangement',
      elements: [],
      dimensions: [],
      annotations: [],
      gridLines: []
    });

    // Roof Plan
    drawings.push({
      id: `DWG-${String(floorPlans.length + 8).padStart(3, '0')}`,
      type: 'roof_plan',
      title: 'ROOF PLAN',
      scale: '1:100',
      description: 'Roof layout showing slopes, gutters, solar panel positions',
      elements: [],
      dimensions: [],
      annotations: [],
      gridLines: []
    });

    return drawings;
  }

  // Generate grid lines
  private generateGridLines(floorPlan: FloorPlan): GridLine[] {
    const gridLines: GridLine[] = [];
    const spacing = 3; // 3m grid

    // Vertical grids (A, B, C...)
    for (let i = 0; i <= Math.ceil(floorPlan.dimensions.length / spacing); i++) {
      gridLines.push({
        id: `G-V${i}`,
        label: String.fromCharCode(65 + i),
        start: { x: i * spacing, y: -1 },
        end: { x: i * spacing, y: floorPlan.dimensions.width + 1 },
        type: 'vertical'
      });
    }

    // Horizontal grids (1, 2, 3...)
    for (let i = 0; i <= Math.ceil(floorPlan.dimensions.width / spacing); i++) {
      gridLines.push({
        id: `G-H${i}`,
        label: String(i + 1),
        start: { x: -1, y: i * spacing },
        end: { x: floorPlan.dimensions.length + 1, y: i * spacing },
        type: 'horizontal'
      });
    }

    return gridLines;
  }

  // Generate 3D model
  private generate3DModel(floorPlans: FloorPlan[], style: string): Model3D {
    const objects: Object3D[] = [];
    const materials: Material3D[] = [
      { id: 'MAT-001', name: 'Wall Exterior', type: 'standard', color: '#E8E4DF', roughness: 0.8, metalness: 0 },
      { id: 'MAT-002', name: 'Wall Interior', type: 'standard', color: '#FFFFFF', roughness: 0.9, metalness: 0 },
      { id: 'MAT-003', name: 'Floor', type: 'standard', color: '#8B7355', roughness: 0.6, metalness: 0 },
      { id: 'MAT-004', name: 'Roof', type: 'standard', color: '#8B4513', roughness: 0.7, metalness: 0 },
      { id: 'MAT-005', name: 'Glass', type: 'glass', color: '#87CEEB', roughness: 0.1, metalness: 0.1 },
      { id: 'MAT-006', name: 'Wood', type: 'standard', color: '#DEB887', roughness: 0.7, metalness: 0 }
    ];

    let objId = 1;

    floorPlans.forEach((fp, floorIndex) => {
      // Floor slab
      objects.push({
        id: `OBJ-${objId++}`,
        name: `Floor_${floorIndex}`,
        type: 'mesh',
        position: { x: 0, y: floorIndex * 3, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: fp.dimensions.length, y: 0.15, z: fp.dimensions.width },
        materialId: 'MAT-003'
      });

      // Walls
      fp.walls.forEach(wall => {
        objects.push({
          id: `OBJ-${objId++}`,
          name: `Wall_${wall.id}`,
          type: 'mesh',
          position: { x: wall.start.x, y: floorIndex * 3, z: wall.start.y },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: wall.thickness, y: wall.height, z: Math.sqrt((wall.end.x - wall.start.x) ** 2 + (wall.end.y - wall.start.y) ** 2) },
          materialId: wall.type === 'external' ? 'MAT-001' : 'MAT-002'
        });
      });

      // Windows
      fp.windows.forEach(win => {
        objects.push({
          id: `OBJ-${objId++}`,
          name: `Window_${win.id}`,
          type: 'mesh',
          position: { x: win.position.x, y: floorIndex * 3 + win.sillHeight, z: win.position.y },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 0.05, y: win.height, z: win.width },
          materialId: 'MAT-005'
        });
      });
    });

    return {
      id: `MODEL-${Date.now()}`,
      name: 'House 3D Model',
      format: 'GLTF',
      vertices: objects.length * 8,
      faces: objects.length * 12,
      materials,
      objects,
      cameras: [
        { id: 'CAM-1', name: 'Perspective', type: 'perspective', position: { x: 20, y: 15, z: 20 }, target: { x: 0, y: 3, z: 0 }, fov: 60 },
        { id: 'CAM-2', name: 'Front', type: 'orthographic', position: { x: 0, y: 5, z: 30 }, target: { x: 0, y: 3, z: 0 }, fov: 60 },
        { id: 'CAM-3', name: 'Top', type: 'orthographic', position: { x: 0, y: 30, z: 0 }, target: { x: 0, y: 0, z: 0 }, fov: 60 }
      ],
      lights: [
        { id: 'LIGHT-1', type: 'ambient', position: { x: 0, y: 10, z: 0 }, color: '#FFFFFF', intensity: 0.4 },
        { id: 'LIGHT-2', type: 'directional', position: { x: 10, y: 20, z: 10 }, color: '#FFFFFF', intensity: 0.8 }
      ]
    };
  }

  // Generate specifications
  private generateSpecifications(requirements: any, floorPlans: FloorPlan[]): BuildingSpecifications {
    const totalRooms = floorPlans.reduce((sum, fp) => sum + fp.rooms.length, 0);
    const totalDoors = floorPlans.reduce((sum, fp) => sum + fp.doors.length, 0);
    const totalWindows = floorPlans.reduce((sum, fp) => sum + fp.windows.length, 0);

    return {
      general: {
        buildingType: requirements.buildingType,
        occupancy: 'Residential',
        constructionClass: 'Class A',
        fireRating: '2 Hours',
        designLife: 50
      },
      structural: {
        foundationType: 'Strip Foundation / Raft',
        wallSystem: 'Load-bearing Masonry',
        floorSystem: 'Reinforced Concrete Slab',
        roofSystem: 'Timber Truss + Concrete Tiles',
        seismicDesign: 'Zone II'
      },
      architectural: {
        externalWalls: 'Concrete Block 200mm + Plaster + Paint',
        internalWalls: 'Concrete Block 150mm + Plaster + Paint',
        roofCovering: 'Concrete Roof Tiles',
        ceilings: 'Gypsum Board / PVC',
        floors: 'Varies per room - See Schedule',
        doors: `${totalDoors} nos - See Door Schedule`,
        windows: `${totalWindows} nos - See Window Schedule`
      },
      mechanical: {
        hvac: 'Split AC Units',
        ventilation: 'Natural + Exhaust Fans',
        plumbing: 'PPR (hot) + PVC (cold)',
        drainage: 'PVC 4" + Cast Iron (external)',
        waterHeating: 'Solar + Electric Backup'
      },
      electrical: {
        supply: '3-Phase 415V',
        distribution: 'TPN Distribution Board',
        wiring: 'PVC Conduit + Twin Cable',
        lighting: 'LED Downlights + Decorative',
        sockets: 'Twin 13A Switched',
        earthing: 'Earth Mat + Earth Rods'
      }
    };
  }
}

// ============================================================================
// INTERFACES
// ============================================================================

export interface HouseDesign {
  id: string;
  name: string;
  style: string;
  buildingType: string;
  floors: number;
  totalArea: number;
  footprint: number;
  bedrooms: number;
  bathrooms: number;
  features: string[];
  dimensions: { length: number; width: number; height: number };
  sustainability: {
    energyRating: string;
    solarReady: boolean;
    rainwaterHarvesting: boolean;
    naturalVentilation: boolean;
    daylightFactor: number;
  };
  estimatedCost: number;
  constructionDays: number;
}

export interface BuildingSpecifications {
  general: {
    buildingType: string;
    occupancy: string;
    constructionClass: string;
    fireRating: string;
    designLife: number;
  };
  structural: {
    foundationType: string;
    wallSystem: string;
    floorSystem: string;
    roofSystem: string;
    seismicDesign: string;
  };
  architectural: {
    externalWalls: string;
    internalWalls: string;
    roofCovering: string;
    ceilings: string;
    floors: string;
    doors: string;
    windows: string;
  };
  mechanical: {
    hvac: string;
    ventilation: string;
    plumbing: string;
    drainage: string;
    waterHeating: string;
  };
  electrical: {
    supply: string;
    distribution: string;
    wiring: string;
    lighting: string;
    sockets: string;
    earthing: string;
  };
}

export default AIArchitect;
