/**
 * FREE 3D Building Model API
 *
 * Generates Three.js-compatible 3D models from building plans
 * 100% FREE - No paid APIs
 */

import { NextRequest, NextResponse } from 'next/server';
import { floorPlanGenerator, type GenerationInput } from '@/lib/building/floorPlanGenerator';
import { building3DGenerator, type Building3DModel } from '@/lib/building/building3DGenerator';

// =============================================================================
// POST - Generate 3D Model
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      description,
      bedrooms = 3,
      bathrooms = 2,
      floors = 1,
      totalArea = 150,
      style = 'modern',
      plotWidth,
      plotDepth,
      format = 'threejs', // 'threejs', 'gltf'
    } = body as GenerationInput & { format?: string };

    // Validate
    if (!description || description.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please provide a building description' },
        { status: 400 }
      );
    }

    console.log('[3D Model API] Generating 3D model for:', description.substring(0, 50));

    // Step 1: Generate building plan
    const buildingPlan = await floorPlanGenerator.generateFromDescription({
      description,
      bedrooms,
      bathrooms,
      floors,
      totalArea,
      style,
      plotWidth,
      plotDepth,
    });

    // Step 2: Generate 3D model
    const model3D = building3DGenerator.generate(buildingPlan);

    // Step 3: Format output
    if (format === 'gltf') {
      const gltf = building3DGenerator.exportToGLTF(model3D);
      return NextResponse.json({
        success: true,
        format: 'gltf',
        data: gltf,
      });
    }

    // Default: Three.js format
    return NextResponse.json({
      success: true,
      format: 'threejs',
      data: {
        model: model3D,
        buildingInfo: {
          floors: buildingPlan.building.floors,
          totalArea: buildingPlan.building.totalArea,
          width: buildingPlan.building.width / 1000, // Convert to meters
          depth: buildingPlan.building.depth / 1000,
          style: buildingPlan.style,
        },
        camera: {
          position: {
            x: model3D.boundingBox.max.x * 2,
            y: model3D.boundingBox.max.y * 1.5,
            z: model3D.boundingBox.max.z * 2,
          },
          target: {
            x: (model3D.boundingBox.min.x + model3D.boundingBox.max.x) / 2,
            y: (model3D.boundingBox.min.y + model3D.boundingBox.max.y) / 2,
            z: (model3D.boundingBox.min.z + model3D.boundingBox.max.z) / 2,
          },
        },
        lights: [
          { type: 'ambient', color: '#ffffff', intensity: 0.5 },
          { type: 'directional', color: '#ffffff', intensity: 0.8, position: { x: 10, y: 20, z: 10 } },
          { type: 'directional', color: '#ffffff', intensity: 0.4, position: { x: -10, y: 15, z: -10 } },
        ],
      },
      dataSource: 'FREE AI - Custom 3D Generator',
    });

  } catch (error) {
    console.error('[3D Model API] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to generate 3D model' },
      { status: 500 }
    );
  }
}

// =============================================================================
// GET - API Info
// =============================================================================

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      name: 'FREE 3D Building Model Generator',
      version: '1.0.0',
      capabilities: [
        'Text-to-3D building generation',
        'Wall mesh generation',
        'Floor slab generation',
        'Roof generation (flat and pitched)',
        'Window and door placement',
        'Stairs generation',
        'Foundation modeling',
        'Column placement',
        'Three.js compatible output',
        'GLTF export',
      ],
      outputFormats: ['threejs', 'gltf'],
      dataSource: 'FREE - No paid APIs required',
    },
  });
}
