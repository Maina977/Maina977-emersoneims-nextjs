/**
 * FREE AI Floor Plan Generator
 * Uses open-source tools only - NO PAID APIs
 *
 * Tools used:
 * - Groq (Llama 3) - FREE AI for understanding descriptions
 * - Custom algorithms for floor plan generation
 * - Three.js for 3D visualization
 * - SVG for 2D floor plans
 */

// =============================================================================
// TYPES
// =============================================================================

export interface RoomSpec {
  id: string;
  type: string;
  name: string;
  minArea: number;  // sqm
  maxArea: number;
  aspectRatio: { min: number; max: number };
  mustHave: string[];  // features like 'window', 'door_external'
  preferNear: string[];  // other room types
  preferAway: string[];
  plumbing: boolean;
  electrical: string[];  // 'lights', 'outlets', 'heavy_appliance'
}

export interface WallSpec {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  thickness: number;  // mm
  type: 'external' | 'internal' | 'partition';
  material: string;
  height: number;  // mm
  openings: Opening[];
}

export interface Opening {
  id: string;
  type: 'door' | 'window' | 'arch';
  position: number;  // distance from wall start
  width: number;
  height: number;
  sillHeight?: number;  // for windows
  material: string;
  swing?: 'left' | 'right' | 'double' | 'sliding';
}

export interface Room {
  id: string;
  type: string;
  name: string;
  polygon: { x: number; y: number }[];
  area: number;
  perimeter: number;
  walls: string[];  // wall IDs
  doors: string[];
  windows: string[];
  floor: {
    level: number;
    material: string;
    finish: string;
  };
  ceiling: {
    height: number;
    type: string;
    finish: string;
  };
  electrical: {
    outlets: { x: number; y: number; type: string }[];
    switches: { x: number; y: number; controls: string[] }[];
    lights: { x: number; y: number; type: string; watts: number }[];
  };
  plumbing?: {
    fixtures: { type: string; x: number; y: number }[];
    drains: { x: number; y: number; size: number }[];
    supply: { hot: boolean; cold: boolean };
  };
}

export interface FloorPlan {
  id: string;
  name: string;
  description: string;
  level: number;
  dimensions: {
    width: number;   // mm
    depth: number;   // mm
    height: number;  // floor to ceiling mm
  };
  rooms: Room[];
  walls: WallSpec[];
  stairs?: {
    id: string;
    type: 'straight' | 'l-shaped' | 'u-shaped' | 'spiral';
    width: number;
    riserHeight: number;
    treadDepth: number;
    steps: number;
    position: { x: number; y: number };
    direction: number;
  };
  columns: {
    id: string;
    x: number;
    y: number;
    width: number;
    depth: number;
    material: string;
  }[];
}

export interface BuildingPlan {
  id: string;
  projectName: string;
  client: string;
  generatedAt: Date;

  // Site
  site: {
    plotWidth: number;
    plotDepth: number;
    setbacks: { front: number; rear: number; left: number; right: number };
    orientation: number;  // degrees from north
  };

  // Building envelope
  building: {
    width: number;
    depth: number;
    floors: number;
    totalArea: number;
    builtUpArea: number;
    coverageRatio: number;
    farRatio: number;
  };

  // Floor plans
  floorPlans: FloorPlan[];

  // Roof
  roof: {
    type: string;
    pitch: number;
    material: string;
    overhang: number;
    gutters: boolean;
  };

  // Foundation
  foundation: {
    type: string;
    depth: number;
    material: string;
    reinforcement: string;
  };

  // Systems
  electrical: {
    mainPanel: { amps: number; phases: number };
    circuits: { name: string; amps: number; breaker: string }[];
    totalLoad: number;
  };

  plumbing: {
    waterSupply: string;
    sewerConnection: string;
    hotWater: string;
    fixtures: { type: string; count: number }[];
  };

  // BOQ Summary
  boqSummary: {
    concrete: number;  // m3
    steel: number;     // kg
    blocks: number;    // pieces
    cement: number;    // bags
    sand: number;      // tonnes
    aggregate: number; // tonnes
    bricks: number;
    tiles: number;     // sqm
    paint: number;     // liters
    electrical: { item: string; quantity: number; unit: string }[];
    plumbing: { item: string; quantity: number; unit: string }[];
  };

  // Metadata
  style: string;
  estimatedCost: number;
  currency: string;
  confidence: number;
}

export interface GenerationInput {
  description: string;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  totalArea: number;
  style: string;
  plotWidth?: number;
  plotDepth?: number;
  budget?: number;
  currency?: string;
  features?: string[];
  constraints?: string[];
}

// =============================================================================
// ROOM TEMPLATES - Based on architectural standards
// =============================================================================

const ROOM_TEMPLATES: Record<string, RoomSpec> = {
  living_room: {
    id: 'living_room',
    type: 'living',
    name: 'Living Room',
    minArea: 15,
    maxArea: 50,
    aspectRatio: { min: 0.6, max: 1.5 },
    mustHave: ['window', 'door_internal'],
    preferNear: ['dining', 'entrance'],
    preferAway: ['bathroom', 'kitchen'],
    plumbing: false,
    electrical: ['lights', 'outlets', 'tv_outlet', 'ac_outlet'],
  },
  dining: {
    id: 'dining',
    type: 'dining',
    name: 'Dining Room',
    minArea: 10,
    maxArea: 25,
    aspectRatio: { min: 0.7, max: 1.4 },
    mustHave: ['window'],
    preferNear: ['kitchen', 'living_room'],
    preferAway: ['bathroom'],
    plumbing: false,
    electrical: ['lights', 'outlets'],
  },
  kitchen: {
    id: 'kitchen',
    type: 'kitchen',
    name: 'Kitchen',
    minArea: 8,
    maxArea: 25,
    aspectRatio: { min: 0.5, max: 2.0 },
    mustHave: ['window', 'door_internal'],
    preferNear: ['dining', 'utility'],
    preferAway: ['bedroom'],
    plumbing: true,
    electrical: ['lights', 'outlets', 'heavy_appliance', 'exhaust'],
  },
  master_bedroom: {
    id: 'master_bedroom',
    type: 'bedroom',
    name: 'Master Bedroom',
    minArea: 14,
    maxArea: 35,
    aspectRatio: { min: 0.6, max: 1.5 },
    mustHave: ['window', 'door_internal'],
    preferNear: ['master_bathroom', 'walk_in_closet'],
    preferAway: ['kitchen', 'living_room'],
    plumbing: false,
    electrical: ['lights', 'outlets', 'ac_outlet'],
  },
  bedroom: {
    id: 'bedroom',
    type: 'bedroom',
    name: 'Bedroom',
    minArea: 9,
    maxArea: 20,
    aspectRatio: { min: 0.6, max: 1.5 },
    mustHave: ['window', 'door_internal'],
    preferNear: ['bathroom'],
    preferAway: ['kitchen'],
    plumbing: false,
    electrical: ['lights', 'outlets', 'ac_outlet'],
  },
  bathroom: {
    id: 'bathroom',
    type: 'bathroom',
    name: 'Bathroom',
    minArea: 3,
    maxArea: 8,
    aspectRatio: { min: 0.5, max: 2.0 },
    mustHave: ['window', 'door_internal'],
    preferNear: ['bedroom'],
    preferAway: ['kitchen', 'living_room'],
    plumbing: true,
    electrical: ['lights', 'exhaust', 'water_heater'],
  },
  master_bathroom: {
    id: 'master_bathroom',
    type: 'bathroom',
    name: 'Master Bathroom',
    minArea: 6,
    maxArea: 15,
    aspectRatio: { min: 0.5, max: 2.0 },
    mustHave: ['window'],
    preferNear: ['master_bedroom'],
    preferAway: ['kitchen', 'living_room'],
    plumbing: true,
    electrical: ['lights', 'exhaust', 'water_heater', 'outlets'],
  },
  entrance: {
    id: 'entrance',
    type: 'circulation',
    name: 'Entrance/Foyer',
    minArea: 3,
    maxArea: 12,
    aspectRatio: { min: 0.5, max: 2.0 },
    mustHave: ['door_external'],
    preferNear: ['living_room'],
    preferAway: ['bedroom', 'bathroom'],
    plumbing: false,
    electrical: ['lights', 'outlets'],
  },
  corridor: {
    id: 'corridor',
    type: 'circulation',
    name: 'Corridor',
    minArea: 2,
    maxArea: 10,
    aspectRatio: { min: 0.2, max: 0.5 },
    mustHave: [],
    preferNear: [],
    preferAway: [],
    plumbing: false,
    electrical: ['lights'],
  },
  garage: {
    id: 'garage',
    type: 'parking',
    name: 'Garage',
    minArea: 15,
    maxArea: 50,
    aspectRatio: { min: 0.5, max: 2.0 },
    mustHave: ['door_garage'],
    preferNear: ['entrance'],
    preferAway: ['bedroom'],
    plumbing: false,
    electrical: ['lights', 'outlets', 'heavy_appliance'],
  },
  utility: {
    id: 'utility',
    type: 'service',
    name: 'Utility Room',
    minArea: 3,
    maxArea: 10,
    aspectRatio: { min: 0.5, max: 2.0 },
    mustHave: [],
    preferNear: ['kitchen', 'garage'],
    preferAway: ['living_room', 'bedroom'],
    plumbing: true,
    electrical: ['lights', 'outlets', 'heavy_appliance'],
  },
  study: {
    id: 'study',
    type: 'office',
    name: 'Study/Home Office',
    minArea: 6,
    maxArea: 15,
    aspectRatio: { min: 0.6, max: 1.5 },
    mustHave: ['window'],
    preferNear: ['living_room'],
    preferAway: ['kitchen'],
    plumbing: false,
    electrical: ['lights', 'outlets', 'data_outlet'],
  },
  balcony: {
    id: 'balcony',
    type: 'outdoor',
    name: 'Balcony',
    minArea: 3,
    maxArea: 15,
    aspectRatio: { min: 0.3, max: 3.0 },
    mustHave: ['door_balcony'],
    preferNear: ['bedroom', 'living_room'],
    preferAway: [],
    plumbing: false,
    electrical: ['lights', 'outlets'],
  },
  terrace: {
    id: 'terrace',
    type: 'outdoor',
    name: 'Terrace',
    minArea: 10,
    maxArea: 50,
    aspectRatio: { min: 0.5, max: 2.0 },
    mustHave: [],
    preferNear: [],
    preferAway: [],
    plumbing: false,
    electrical: ['lights', 'outlets'],
  },
};

// =============================================================================
// AI FLOOR PLAN GENERATOR CLASS
// =============================================================================

export class AIFloorPlanGenerator {
  private groqApiKey: string | null;

  constructor() {
    this.groqApiKey = process.env.GROQ_API_KEY || null;
  }

  /**
   * Generate a complete building plan from a text description
   */
  async generateFromDescription(input: GenerationInput): Promise<BuildingPlan> {
    // Step 1: Parse the description to extract requirements
    const requirements = await this.parseDescription(input);

    // Step 2: Generate room program
    const roomProgram = this.generateRoomProgram(requirements);

    // Step 3: Generate floor plans
    const floorPlans = this.generateFloorPlans(roomProgram, input);

    // Step 4: Calculate BOQ
    const boqSummary = this.calculateBOQ(floorPlans, input);

    // Step 5: Generate electrical layout
    const electrical = this.generateElectricalPlan(floorPlans);

    // Step 6: Generate plumbing layout
    const plumbing = this.generatePlumbingPlan(floorPlans);

    // Step 7: Assemble complete plan
    const buildingPlan: BuildingPlan = {
      id: `BP-${Date.now()}`,
      projectName: input.description.substring(0, 50),
      client: 'Client',
      generatedAt: new Date(),
      site: {
        plotWidth: input.plotWidth || Math.sqrt(input.totalArea * 2) * 1000,
        plotDepth: input.plotDepth || Math.sqrt(input.totalArea * 2) * 1000,
        setbacks: { front: 3000, rear: 3000, left: 1500, right: 1500 },
        orientation: 0,
      },
      building: {
        width: floorPlans[0]?.dimensions.width || 10000,
        depth: floorPlans[0]?.dimensions.depth || 12000,
        floors: input.floors,
        totalArea: input.totalArea,
        builtUpArea: floorPlans.reduce((sum, fp) => sum + (fp.dimensions.width * fp.dimensions.depth) / 1000000, 0),
        coverageRatio: 0.4,
        farRatio: input.floors * 0.4,
      },
      floorPlans,
      roof: this.generateRoofPlan(input, floorPlans[floorPlans.length - 1]),
      foundation: this.generateFoundationPlan(floorPlans[0], input),
      electrical,
      plumbing,
      boqSummary,
      style: input.style,
      estimatedCost: this.estimateCost(boqSummary, input.currency || 'KES'),
      currency: input.currency || 'KES',
      confidence: 0.85,
    };

    return buildingPlan;
  }

  /**
   * Parse natural language description using Llama 3 (FREE via Groq)
   */
  private async parseDescription(input: GenerationInput): Promise<{
    bedrooms: number;
    bathrooms: number;
    additionalRooms: string[];
    style: string;
    features: string[];
  }> {
    // If Groq API is available, use Llama 3
    if (this.groqApiKey) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.groqApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama3-70b-8192',
            messages: [
              {
                role: 'system',
                content: `You are an architectural AI. Parse the user's building description and extract:
                - Number of bedrooms
                - Number of bathrooms
                - Additional rooms (study, gym, cinema, etc.)
                - Architectural style
                - Special features

                Respond ONLY with valid JSON in this format:
                {
                  "bedrooms": number,
                  "bathrooms": number,
                  "additionalRooms": ["room1", "room2"],
                  "style": "modern/traditional/contemporary/minimalist",
                  "features": ["feature1", "feature2"]
                }`
              },
              {
                role: 'user',
                content: input.description
              }
            ],
            temperature: 0.3,
            max_tokens: 500,
          }),
        });

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          return {
            bedrooms: parsed.bedrooms || input.bedrooms,
            bathrooms: parsed.bathrooms || input.bathrooms,
            additionalRooms: parsed.additionalRooms || [],
            style: parsed.style || input.style,
            features: parsed.features || input.features || [],
          };
        }
      } catch (error) {
        console.warn('[FloorPlanGenerator] Groq API failed, using local parsing:', error);
      }
    }

    // Fallback: Local keyword parsing
    return this.localParseDescription(input);
  }

  /**
   * Local description parsing (no API needed)
   */
  private localParseDescription(input: GenerationInput): {
    bedrooms: number;
    bathrooms: number;
    additionalRooms: string[];
    style: string;
    features: string[];
  } {
    const desc = input.description.toLowerCase();
    const additionalRooms: string[] = [];
    const features: string[] = [];

    // Detect additional rooms
    if (desc.includes('study') || desc.includes('office') || desc.includes('home office')) {
      additionalRooms.push('study');
    }
    if (desc.includes('gym') || desc.includes('fitness')) {
      additionalRooms.push('gym');
    }
    if (desc.includes('cinema') || desc.includes('theater') || desc.includes('movie')) {
      additionalRooms.push('home_theater');
    }
    if (desc.includes('pool')) {
      features.push('swimming_pool');
    }
    if (desc.includes('garage')) {
      additionalRooms.push('garage');
    }
    if (desc.includes('guest') || desc.includes('dsq') || desc.includes("servant")) {
      additionalRooms.push('guest_quarters');
    }
    if (desc.includes('balcon')) {
      features.push('balcony');
    }
    if (desc.includes('terrace')) {
      features.push('terrace');
    }
    if (desc.includes('garden')) {
      features.push('garden');
    }

    // Detect style
    let style = input.style || 'modern';
    if (desc.includes('traditional')) style = 'traditional';
    if (desc.includes('colonial')) style = 'colonial';
    if (desc.includes('minimalist')) style = 'minimalist';
    if (desc.includes('contemporary')) style = 'contemporary';
    if (desc.includes('luxury') || desc.includes('luxurious')) style = 'luxury';

    return {
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      additionalRooms,
      style,
      features: [...features, ...(input.features || [])],
    };
  }

  /**
   * Generate room program from requirements
   */
  private generateRoomProgram(requirements: {
    bedrooms: number;
    bathrooms: number;
    additionalRooms: string[];
    style: string;
    features: string[];
  }): RoomSpec[] {
    const program: RoomSpec[] = [];

    // Always include core rooms
    program.push({ ...ROOM_TEMPLATES.entrance });
    program.push({ ...ROOM_TEMPLATES.living_room });
    program.push({ ...ROOM_TEMPLATES.dining });
    program.push({ ...ROOM_TEMPLATES.kitchen });

    // Add master bedroom with ensuite
    program.push({ ...ROOM_TEMPLATES.master_bedroom });
    program.push({ ...ROOM_TEMPLATES.master_bathroom });

    // Add additional bedrooms
    for (let i = 1; i < requirements.bedrooms; i++) {
      program.push({
        ...ROOM_TEMPLATES.bedroom,
        id: `bedroom_${i + 1}`,
        name: `Bedroom ${i + 1}`,
      });
    }

    // Add bathrooms (subtract master bathroom)
    const additionalBathrooms = Math.max(0, requirements.bathrooms - 1);
    for (let i = 0; i < additionalBathrooms; i++) {
      program.push({
        ...ROOM_TEMPLATES.bathroom,
        id: `bathroom_${i + 1}`,
        name: i === 0 ? 'Guest Bathroom' : `Bathroom ${i + 1}`,
      });
    }

    // Add additional rooms
    for (const room of requirements.additionalRooms) {
      if (ROOM_TEMPLATES[room]) {
        program.push({ ...ROOM_TEMPLATES[room] });
      }
    }

    // Add corridor for circulation
    program.push({ ...ROOM_TEMPLATES.corridor });

    return program;
  }

  /**
   * Generate floor plans using space allocation algorithm
   */
  private generateFloorPlans(roomProgram: RoomSpec[], input: GenerationInput): FloorPlan[] {
    const floorPlans: FloorPlan[] = [];
    const areaPerFloor = input.totalArea / input.floors;

    // Calculate building footprint
    const aspectRatio = 1.2; // width:depth
    const footprintArea = areaPerFloor * 1.15; // Add 15% for walls and circulation
    const buildingDepth = Math.sqrt(footprintArea / aspectRatio);
    const buildingWidth = buildingDepth * aspectRatio;

    // Distribute rooms across floors
    const roomsByFloor = this.distributeRoomsToFloors(roomProgram, input.floors);

    for (let level = 0; level < input.floors; level++) {
      const floorRooms = roomsByFloor[level] || [];
      const floorPlan = this.generateSingleFloorPlan(
        floorRooms,
        level,
        buildingWidth * 1000,
        buildingDepth * 1000,
        input.style
      );
      floorPlans.push(floorPlan);
    }

    return floorPlans;
  }

  /**
   * Distribute rooms to floors intelligently
   */
  private distributeRoomsToFloors(roomProgram: RoomSpec[], floors: number): RoomSpec[][] {
    const distribution: RoomSpec[][] = Array.from({ length: floors }, () => []);

    // Ground floor: public rooms
    const publicRooms = ['entrance', 'living_room', 'dining', 'kitchen', 'utility', 'garage', 'guest_quarters'];
    const privateRooms = ['master_bedroom', 'bedroom', 'master_bathroom'];

    for (const room of roomProgram) {
      if (floors === 1) {
        // Single floor - everything goes to ground
        distribution[0].push(room);
      } else {
        // Multi-floor logic
        if (publicRooms.includes(room.type) || publicRooms.includes(room.id)) {
          distribution[0].push(room);
        } else if (privateRooms.includes(room.type)) {
          // Bedrooms go to upper floors
          const targetFloor = Math.min(1, floors - 1);
          distribution[targetFloor].push(room);
        } else if (room.type === 'bathroom') {
          // Bathrooms distributed based on associated bedrooms
          const bedroomFloor = distribution.findIndex(f => f.some(r => r.type === 'bedroom'));
          distribution[bedroomFloor >= 0 ? bedroomFloor : 0].push(room);
        } else if (room.type === 'circulation') {
          // Corridors on each floor
          for (let i = 0; i < floors; i++) {
            if (i > 0) {
              distribution[i].push({ ...room, id: `${room.id}_${i}` });
            }
          }
          distribution[0].push(room);
        } else {
          distribution[0].push(room);
        }
      }
    }

    return distribution;
  }

  /**
   * Generate a single floor plan using space allocation
   */
  private generateSingleFloorPlan(
    rooms: RoomSpec[],
    level: number,
    width: number,
    depth: number,
    style: string
  ): FloorPlan {
    const floorPlan: FloorPlan = {
      id: `FP-L${level}`,
      name: level === 0 ? 'Ground Floor' : `Floor ${level}`,
      description: '',
      level,
      dimensions: { width, depth, height: 3000 },
      rooms: [],
      walls: [],
      columns: [],
    };

    // Calculate total room area
    const totalRoomArea = rooms.reduce((sum, r) => sum + (r.minArea + r.maxArea) / 2, 0);
    const availableArea = (width * depth) / 1000000; // sqm
    const scaleFactor = availableArea / totalRoomArea;

    // Place rooms using grid-based allocation
    const gridSize = 500; // 500mm grid
    const grid: boolean[][] = Array.from({ length: Math.ceil(depth / gridSize) }, () =>
      Array(Math.ceil(width / gridSize)).fill(false)
    );

    let currentX = 200; // Start with setback
    let currentY = 200;
    let rowHeight = 0;

    for (const roomSpec of rooms) {
      const targetArea = ((roomSpec.minArea + roomSpec.maxArea) / 2) * scaleFactor;
      const roomWidth = Math.sqrt(targetArea * 1000000 * roomSpec.aspectRatio.max);
      const roomDepth = targetArea * 1000000 / roomWidth;

      // Check if room fits in current row
      if (currentX + roomWidth > width - 200) {
        currentX = 200;
        currentY += rowHeight + 200; // Wall thickness
        rowHeight = 0;
      }

      // Create room
      const room: Room = {
        id: roomSpec.id,
        type: roomSpec.type,
        name: roomSpec.name,
        polygon: [
          { x: currentX, y: currentY },
          { x: currentX + roomWidth, y: currentY },
          { x: currentX + roomWidth, y: currentY + roomDepth },
          { x: currentX, y: currentY + roomDepth },
        ],
        area: targetArea,
        perimeter: 2 * (roomWidth + roomDepth) / 1000,
        walls: [],
        doors: [],
        windows: [],
        floor: {
          level,
          material: this.getFloorMaterial(roomSpec.type, style),
          finish: 'polished',
        },
        ceiling: {
          height: 3000,
          type: 'flat',
          finish: 'paint',
        },
        electrical: this.generateRoomElectrical(roomSpec, roomWidth, roomDepth),
      };

      // Add plumbing if needed
      if (roomSpec.plumbing) {
        room.plumbing = this.generateRoomPlumbing(roomSpec, roomWidth, roomDepth);
      }

      floorPlan.rooms.push(room);

      // Generate walls for this room
      const roomWalls = this.generateRoomWalls(room, floorPlan.rooms.length === 1);
      floorPlan.walls.push(...roomWalls);
      room.walls = roomWalls.map(w => w.id);

      // Update position
      currentX += roomWidth + 200;
      rowHeight = Math.max(rowHeight, roomDepth);
    }

    // Add stairs if multi-floor
    if (level < 1) {
      floorPlan.stairs = {
        id: 'stairs_main',
        type: 'l-shaped',
        width: 1000,
        riserHeight: 175,
        treadDepth: 280,
        steps: 17,
        position: { x: width - 2000, y: depth / 2 },
        direction: 90,
      };
    }

    return floorPlan;
  }

  /**
   * Generate walls for a room
   */
  private generateRoomWalls(room: Room, isExternalWall: boolean): WallSpec[] {
    const walls: WallSpec[] = [];
    const polygon = room.polygon;

    for (let i = 0; i < polygon.length; i++) {
      const start = polygon[i];
      const end = polygon[(i + 1) % polygon.length];

      const wall: WallSpec = {
        id: `wall_${room.id}_${i}`,
        start,
        end,
        thickness: isExternalWall ? 230 : 150,
        type: isExternalWall ? 'external' : 'internal',
        material: isExternalWall ? 'concrete_block' : 'brick',
        height: 3000,
        openings: [],
      };

      // Add openings based on room type and wall position
      const wallLength = Math.sqrt(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
      );

      // Add door
      if (i === 0 && room.type !== 'bathroom') {
        wall.openings.push({
          id: `door_${room.id}`,
          type: 'door',
          position: wallLength / 4,
          width: 900,
          height: 2100,
          material: 'hardwood',
          swing: 'right',
        });
      }

      // Add window on external walls
      if (isExternalWall && i === 2 && wallLength > 1500) {
        wall.openings.push({
          id: `window_${room.id}`,
          type: 'window',
          position: wallLength / 2 - 600,
          width: 1200,
          height: 1200,
          sillHeight: 900,
          material: 'aluminum',
        });
      }

      walls.push(wall);
    }

    return walls;
  }

  /**
   * Generate electrical layout for a room
   */
  private generateRoomElectrical(
    roomSpec: RoomSpec,
    width: number,
    depth: number
  ): Room['electrical'] {
    const outlets: Room['electrical']['outlets'] = [];
    const switches: Room['electrical']['switches'] = [];
    const lights: Room['electrical']['lights'] = [];

    // Calculate outlet positions (every 3m on walls)
    const perimeter = 2 * (width + depth);
    const outletCount = Math.max(2, Math.floor(perimeter / 3000));

    for (let i = 0; i < outletCount; i++) {
      outlets.push({
        x: (width / outletCount) * i + width / (outletCount * 2),
        y: 150, // Near wall
        type: roomSpec.electrical.includes('heavy_appliance') && i === 0 ? '30A' : '15A',
      });
    }

    // Add switch at door location
    switches.push({
      x: 150,
      y: depth / 2,
      controls: ['main_light'],
    });

    // Add ceiling light
    lights.push({
      x: width / 2,
      y: depth / 2,
      type: roomSpec.type === 'bathroom' ? 'led_panel_ip65' : 'led_panel',
      watts: Math.ceil((width * depth) / 1000000 * 10), // 10W per sqm
    });

    return { outlets, switches, lights };
  }

  /**
   * Generate plumbing layout for a room
   */
  private generateRoomPlumbing(
    roomSpec: RoomSpec,
    width: number,
    depth: number
  ): NonNullable<Room['plumbing']> {
    const fixtures: { type: string; x: number; y: number }[] = [];
    const drains: { x: number; y: number; size: number }[] = [];

    if (roomSpec.type === 'bathroom' || roomSpec.id.includes('bathroom')) {
      fixtures.push(
        { type: 'toilet', x: width - 400, y: 400 },
        { type: 'sink', x: 400, y: 400 },
        { type: 'shower', x: width - 1000, y: depth - 1000 }
      );
      drains.push(
        { x: width - 400, y: 400, size: 100 },
        { x: 400, y: 400, size: 50 },
        { x: width - 1000, y: depth - 1000, size: 75 }
      );
    } else if (roomSpec.type === 'kitchen') {
      fixtures.push(
        { type: 'sink', x: width / 2, y: 400 },
        { type: 'dishwasher', x: width / 2 + 600, y: 400 }
      );
      drains.push(
        { x: width / 2, y: 400, size: 50 },
        { x: width / 2 + 600, y: 400, size: 50 }
      );
    }

    return {
      fixtures,
      drains,
      supply: { hot: true, cold: true },
    };
  }

  /**
   * Get floor material based on room type and style
   */
  private getFloorMaterial(roomType: string, style: string): string {
    const materials: Record<string, Record<string, string>> = {
      modern: {
        living: 'porcelain_tiles',
        bedroom: 'engineered_wood',
        bathroom: 'ceramic_tiles',
        kitchen: 'porcelain_tiles',
        circulation: 'porcelain_tiles',
        default: 'porcelain_tiles',
      },
      traditional: {
        living: 'hardwood',
        bedroom: 'hardwood',
        bathroom: 'ceramic_tiles',
        kitchen: 'ceramic_tiles',
        circulation: 'ceramic_tiles',
        default: 'ceramic_tiles',
      },
      luxury: {
        living: 'marble',
        bedroom: 'hardwood',
        bathroom: 'marble',
        kitchen: 'granite',
        circulation: 'marble',
        default: 'marble',
      },
    };

    const styleMap = materials[style] || materials.modern;
    return styleMap[roomType] || styleMap.default;
  }

  /**
   * Generate roof plan
   */
  private generateRoofPlan(input: GenerationInput, topFloor: FloorPlan): BuildingPlan['roof'] {
    const roofTypes: Record<string, { type: string; pitch: number }> = {
      modern: { type: 'flat', pitch: 2 },
      contemporary: { type: 'flat', pitch: 3 },
      traditional: { type: 'hip', pitch: 25 },
      colonial: { type: 'gable', pitch: 30 },
      luxury: { type: 'hip', pitch: 22 },
    };

    const roof = roofTypes[input.style] || roofTypes.modern;

    return {
      type: roof.type,
      pitch: roof.pitch,
      material: input.style === 'luxury' ? 'clay_tiles' : 'concrete_tiles',
      overhang: 600,
      gutters: true,
    };
  }

  /**
   * Generate foundation plan
   */
  private generateFoundationPlan(groundFloor: FloorPlan, input: GenerationInput): BuildingPlan['foundation'] {
    const foundationTypes: Record<number, string> = {
      1: 'strip',
      2: 'strip',
      3: 'raft',
      4: 'raft',
      5: 'pile',
    };

    return {
      type: foundationTypes[input.floors] || 'strip',
      depth: input.floors > 2 ? 1500 : 1000,
      material: 'reinforced_concrete',
      reinforcement: input.floors > 2 ? 'Y16@150' : 'Y12@200',
    };
  }

  /**
   * Generate electrical plan for entire building
   */
  private generateElectricalPlan(floorPlans: FloorPlan[]): BuildingPlan['electrical'] {
    let totalLoad = 0;
    const circuits: BuildingPlan['electrical']['circuits'] = [];

    for (const floor of floorPlans) {
      for (const room of floor.rooms) {
        const roomLoad = room.electrical.lights.reduce((sum, l) => sum + l.watts, 0) +
          room.electrical.outlets.length * 200; // Assume 200W per outlet
        totalLoad += roomLoad;

        circuits.push({
          name: `${room.name} Lights`,
          amps: 15,
          breaker: 'MCB 15A',
        });
        circuits.push({
          name: `${room.name} Sockets`,
          amps: 20,
          breaker: 'MCB 20A',
        });
      }
    }

    // Add heavy load circuits
    circuits.push({ name: 'AC Circuit', amps: 30, breaker: 'MCB 30A' });
    circuits.push({ name: 'Water Heater', amps: 25, breaker: 'MCB 25A' });
    circuits.push({ name: 'Kitchen Appliances', amps: 30, breaker: 'MCB 30A' });

    return {
      mainPanel: {
        amps: totalLoad > 10000 ? 100 : 63,
        phases: totalLoad > 15000 ? 3 : 1,
      },
      circuits,
      totalLoad,
    };
  }

  /**
   * Generate plumbing plan for entire building
   */
  private generatePlumbingPlan(floorPlans: FloorPlan[]): BuildingPlan['plumbing'] {
    const fixtures: { type: string; count: number }[] = [];
    const fixtureCount: Record<string, number> = {};

    for (const floor of floorPlans) {
      for (const room of floor.rooms) {
        if (room.plumbing) {
          for (const fixture of room.plumbing.fixtures) {
            fixtureCount[fixture.type] = (fixtureCount[fixture.type] || 0) + 1;
          }
        }
      }
    }

    for (const [type, count] of Object.entries(fixtureCount)) {
      fixtures.push({ type, count });
    }

    return {
      waterSupply: 'municipal',
      sewerConnection: 'municipal',
      hotWater: fixtures.length > 5 ? 'solar_assisted' : 'electric',
      fixtures,
    };
  }

  /**
   * Calculate Bill of Quantities
   */
  private calculateBOQ(floorPlans: FloorPlan[], input: GenerationInput): BuildingPlan['boqSummary'] {
    let totalWallLength = 0;
    let totalWallArea = 0;
    let totalFloorArea = 0;
    let externalWallLength = 0;

    for (const floor of floorPlans) {
      for (const wall of floor.walls) {
        const length = Math.sqrt(
          Math.pow(wall.end.x - wall.start.x, 2) +
          Math.pow(wall.end.y - wall.start.y, 2)
        ) / 1000; // Convert to meters
        totalWallLength += length;
        totalWallArea += length * (wall.height / 1000);
        if (wall.type === 'external') {
          externalWallLength += length;
        }
      }

      for (const room of floor.rooms) {
        totalFloorArea += room.area;
      }
    }

    // Calculate materials
    const concreteVolume = (input.totalArea * 0.15) + // Slabs
      (totalWallLength * 0.3 * 0.5); // Beams
    const steelWeight = concreteVolume * 100; // 100kg/m3
    const blocks = Math.ceil(totalWallArea * 12.5); // 12.5 blocks per sqm
    const cementBags = Math.ceil((concreteVolume * 7) + (blocks * 0.02)); // 7 bags/m3 concrete + mortar
    const sand = concreteVolume * 0.5 + (blocks * 0.001);
    const aggregate = concreteVolume * 0.8;

    return {
      concrete: Math.round(concreteVolume * 10) / 10,
      steel: Math.round(steelWeight),
      blocks: blocks,
      cement: cementBags,
      sand: Math.round(sand * 10) / 10,
      aggregate: Math.round(aggregate * 10) / 10,
      bricks: Math.round(totalWallArea * 50), // For internal partitions
      tiles: Math.round(totalFloorArea),
      paint: Math.round(totalWallArea * 0.3), // 0.3L per sqm
      electrical: [
        { item: 'Electrical Cable 2.5mm', quantity: Math.round(totalFloorArea * 5), unit: 'm' },
        { item: 'Electrical Cable 4mm', quantity: Math.round(totalFloorArea * 2), unit: 'm' },
        { item: 'Outlets', quantity: floorPlans.reduce((sum, f) => sum + f.rooms.reduce((s, r) => s + r.electrical.outlets.length, 0), 0), unit: 'pcs' },
        { item: 'Switches', quantity: floorPlans.reduce((sum, f) => sum + f.rooms.reduce((s, r) => s + r.electrical.switches.length, 0), 0), unit: 'pcs' },
        { item: 'Light Fixtures', quantity: floorPlans.reduce((sum, f) => sum + f.rooms.reduce((s, r) => s + r.electrical.lights.length, 0), 0), unit: 'pcs' },
        { item: 'Distribution Board', quantity: floorPlans.length, unit: 'pcs' },
      ],
      plumbing: [
        { item: 'PVC Pipe 110mm', quantity: Math.round(totalFloorArea * 0.5), unit: 'm' },
        { item: 'PVC Pipe 50mm', quantity: Math.round(totalFloorArea * 1), unit: 'm' },
        { item: 'PPR Pipe 20mm', quantity: Math.round(totalFloorArea * 2), unit: 'm' },
        { item: 'Toilets', quantity: floorPlans.reduce((sum, f) => sum + f.rooms.filter(r => r.plumbing?.fixtures.some(fix => fix.type === 'toilet')).length, 0), unit: 'pcs' },
        { item: 'Sinks', quantity: floorPlans.reduce((sum, f) => sum + f.rooms.filter(r => r.plumbing?.fixtures.some(fix => fix.type === 'sink')).length, 0), unit: 'pcs' },
        { item: 'Showers', quantity: floorPlans.reduce((sum, f) => sum + f.rooms.filter(r => r.plumbing?.fixtures.some(fix => fix.type === 'shower')).length, 0), unit: 'pcs' },
      ],
    };
  }

  /**
   * Estimate total cost
   */
  private estimateCost(boq: BuildingPlan['boqSummary'], currency: string): number {
    // Kenya market prices (KES)
    const prices: Record<string, number> = {
      concrete: 18000, // per m3
      steel: 150, // per kg
      blocks: 65, // per piece
      cement: 750, // per bag
      sand: 2500, // per tonne
      aggregate: 3500, // per tonne
      bricks: 15, // per piece
      tiles: 1500, // per sqm
      paint: 500, // per liter
    };

    let total = 0;
    total += boq.concrete * prices.concrete;
    total += boq.steel * prices.steel;
    total += boq.blocks * prices.blocks;
    total += boq.cement * prices.cement;
    total += boq.sand * prices.sand;
    total += boq.aggregate * prices.aggregate;
    total += boq.bricks * prices.bricks;
    total += boq.tiles * prices.tiles;
    total += boq.paint * prices.paint;

    // Add 40% for labor and other materials
    total *= 1.4;

    // Add 15% for contingency
    total *= 1.15;

    return Math.round(total);
  }
}

// =============================================================================
// SVG FLOOR PLAN RENDERER
// =============================================================================

export class FloorPlanSVGRenderer {
  private scale: number = 0.05; // 1mm = 0.05 pixels

  /**
   * Render floor plan to SVG string
   */
  render(floorPlan: FloorPlan): string {
    const width = floorPlan.dimensions.width * this.scale + 100;
    const height = floorPlan.dimensions.depth * this.scale + 100;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`;

    // Background
    svg += `<rect width="100%" height="100%" fill="#f8f9fa"/>`;

    // Grid
    svg += this.renderGrid(width, height);

    // Title
    svg += `<text x="10" y="25" font-family="Arial" font-size="16" font-weight="bold">${floorPlan.name}</text>`;

    // Transform group for floor plan
    svg += `<g transform="translate(50, 50)">`;

    // Render rooms
    for (const room of floorPlan.rooms) {
      svg += this.renderRoom(room);
    }

    // Render walls
    for (const wall of floorPlan.walls) {
      svg += this.renderWall(wall);
    }

    // Render stairs
    if (floorPlan.stairs) {
      svg += this.renderStairs(floorPlan.stairs);
    }

    // Render dimensions
    svg += this.renderDimensions(floorPlan);

    svg += `</g></svg>`;

    return svg;
  }

  private renderGrid(width: number, height: number): string {
    let grid = `<defs><pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">`;
    grid += `<path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e0e0e0" stroke-width="0.5"/>`;
    grid += `</pattern></defs>`;
    grid += `<rect width="100%" height="100%" fill="url(#grid)"/>`;
    return grid;
  }

  private renderRoom(room: Room): string {
    const points = room.polygon.map(p => `${p.x * this.scale},${p.y * this.scale}`).join(' ');

    let svg = `<polygon points="${points}" fill="#fff" stroke="#333" stroke-width="1"/>`;

    // Room label
    const centerX = room.polygon.reduce((sum, p) => sum + p.x, 0) / room.polygon.length * this.scale;
    const centerY = room.polygon.reduce((sum, p) => sum + p.y, 0) / room.polygon.length * this.scale;

    svg += `<text x="${centerX}" y="${centerY - 5}" text-anchor="middle" font-family="Arial" font-size="10" font-weight="bold">${room.name}</text>`;
    svg += `<text x="${centerX}" y="${centerY + 10}" text-anchor="middle" font-family="Arial" font-size="8" fill="#666">${room.area.toFixed(1)} m²</text>`;

    // Render electrical
    for (const outlet of room.electrical.outlets) {
      svg += `<circle cx="${outlet.x * this.scale}" cy="${outlet.y * this.scale}" r="3" fill="#f59e0b"/>`;
    }

    for (const light of room.electrical.lights) {
      svg += `<circle cx="${light.x * this.scale}" cy="${light.y * this.scale}" r="4" fill="none" stroke="#fbbf24" stroke-width="1.5"/>`;
      svg += `<line x1="${light.x * this.scale - 3}" y1="${light.y * this.scale}" x2="${light.x * this.scale + 3}" y2="${light.y * this.scale}" stroke="#fbbf24" stroke-width="1"/>`;
      svg += `<line x1="${light.x * this.scale}" y1="${light.y * this.scale - 3}" x2="${light.x * this.scale}" y2="${light.y * this.scale + 3}" stroke="#fbbf24" stroke-width="1"/>`;
    }

    // Render plumbing fixtures
    if (room.plumbing) {
      for (const fixture of room.plumbing.fixtures) {
        if (fixture.type === 'toilet') {
          svg += `<ellipse cx="${fixture.x * this.scale}" cy="${fixture.y * this.scale}" rx="6" ry="8" fill="#e0f2fe" stroke="#0ea5e9"/>`;
        } else if (fixture.type === 'sink') {
          svg += `<rect x="${fixture.x * this.scale - 5}" y="${fixture.y * this.scale - 3}" width="10" height="6" fill="#e0f2fe" stroke="#0ea5e9"/>`;
        } else if (fixture.type === 'shower') {
          svg += `<rect x="${fixture.x * this.scale - 15}" y="${fixture.y * this.scale - 15}" width="30" height="30" fill="#e0f2fe" stroke="#0ea5e9" stroke-dasharray="3,2"/>`;
        }
      }
    }

    return svg;
  }

  private renderWall(wall: WallSpec): string {
    let svg = '';

    // Wall line
    const x1 = wall.start.x * this.scale;
    const y1 = wall.start.y * this.scale;
    const x2 = wall.end.x * this.scale;
    const y2 = wall.end.y * this.scale;

    const strokeWidth = wall.type === 'external' ? 4 : 2;
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#1f2937" stroke-width="${strokeWidth}"/>`;

    // Render openings
    for (const opening of wall.openings) {
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const openingX = x1 + Math.cos(angle) * opening.position * this.scale;
      const openingY = y1 + Math.sin(angle) * opening.position * this.scale;
      const openingWidth = opening.width * this.scale;

      if (opening.type === 'door') {
        // Door arc
        svg += `<path d="M ${openingX} ${openingY} A ${openingWidth} ${openingWidth} 0 0 1 ${openingX + openingWidth} ${openingY}" fill="none" stroke="#6b7280" stroke-width="1"/>`;
        svg += `<line x1="${openingX}" y1="${openingY}" x2="${openingX + openingWidth}" y2="${openingY}" stroke="#fff" stroke-width="${strokeWidth + 2}"/>`;
      } else if (opening.type === 'window') {
        svg += `<line x1="${openingX}" y1="${openingY}" x2="${openingX + openingWidth}" y2="${openingY}" stroke="#60a5fa" stroke-width="${strokeWidth}"/>`;
      }
    }

    return svg;
  }

  private renderStairs(stairs: FloorPlan['stairs']): string {
    if (!stairs) return '';

    const x = stairs.position.x * this.scale;
    const y = stairs.position.y * this.scale;
    const w = stairs.width * this.scale;
    const stepDepth = stairs.treadDepth * this.scale;

    let svg = `<g transform="translate(${x}, ${y})">`;

    // Draw steps
    for (let i = 0; i < Math.min(stairs.steps, 10); i++) {
      svg += `<rect x="0" y="${i * stepDepth}" width="${w}" height="${stepDepth}" fill="#f3f4f6" stroke="#9ca3af" stroke-width="0.5"/>`;
    }

    // Arrow indicating up direction
    svg += `<polygon points="${w / 2},${stepDepth} ${w / 2 - 5},${stepDepth + 10} ${w / 2 + 5},${stepDepth + 10}" fill="#6b7280"/>`;
    svg += `<text x="${w / 2}" y="${stepDepth * 6}" text-anchor="middle" font-family="Arial" font-size="8">UP</text>`;

    svg += `</g>`;
    return svg;
  }

  private renderDimensions(floorPlan: FloorPlan): string {
    let svg = '';

    // Overall dimensions
    const width = floorPlan.dimensions.width * this.scale;
    const depth = floorPlan.dimensions.depth * this.scale;

    // Top dimension
    svg += `<line x1="0" y1="-15" x2="${width}" y2="-15" stroke="#4b5563" stroke-width="0.5"/>`;
    svg += `<line x1="0" y1="-20" x2="0" y2="-10" stroke="#4b5563" stroke-width="0.5"/>`;
    svg += `<line x1="${width}" y1="-20" x2="${width}" y2="-10" stroke="#4b5563" stroke-width="0.5"/>`;
    svg += `<text x="${width / 2}" y="-20" text-anchor="middle" font-family="Arial" font-size="9">${(floorPlan.dimensions.width / 1000).toFixed(1)}m</text>`;

    // Left dimension
    svg += `<line x1="-15" y1="0" x2="-15" y2="${depth}" stroke="#4b5563" stroke-width="0.5"/>`;
    svg += `<line x1="-20" y1="0" x2="-10" y2="0" stroke="#4b5563" stroke-width="0.5"/>`;
    svg += `<line x1="-20" y1="${depth}" x2="-10" y2="${depth}" stroke="#4b5563" stroke-width="0.5"/>`;
    svg += `<text x="-25" y="${depth / 2}" text-anchor="middle" font-family="Arial" font-size="9" transform="rotate(-90, -25, ${depth / 2})">${(floorPlan.dimensions.depth / 1000).toFixed(1)}m</text>`;

    return svg;
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const floorPlanGenerator = new AIFloorPlanGenerator();
export const floorPlanRenderer = new FloorPlanSVGRenderer();
