/**
 * FREE AI Floor Plan Generator API
 *
 * Generates complete building plans from text descriptions using:
 * - Groq (Llama 3) for AI understanding - FREE
 * - Custom algorithms for floor plan generation
 * - SVG rendering for 2D plans
 *
 * NO PAID APIs - 100% FREE
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  floorPlanGenerator,
  floorPlanRenderer,
  publicPlan,
  NOT_FROM_A_DESCRIPTION,
  type GenerationInput
} from '@/lib/building/building/floorPlanGenerator';

// =============================================================================
// POST - Generate Floor Plan from Description
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
      budget,
      currency = 'KES',
      features = [],
      constraints = [],
      outputFormat = 'full', // 'full', 'svg', 'json'
    } = body as GenerationInput & { outputFormat?: string };

    // Validate required fields
    if (!description || description.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please provide a building description (at least 10 characters)' },
        { status: 400 }
      );
    }

    console.log('[Floor Plan API] Generating plan for:', description.substring(0, 50));

    // Generate the building plan
    const buildingPlan = await floorPlanGenerator.generateFromDescription({
      description,
      bedrooms,
      bathrooms,
      floors,
      totalArea,
      style,
      plotWidth,
      plotDepth,
      budget,
      currency,
      features,
      constraints,
    });

    // Generate SVG for each floor
    const floorPlanSVGs: Record<string, string> = {};
    for (const floorPlan of buildingPlan.floorPlans) {
      floorPlanSVGs[floorPlan.name] = floorPlanRenderer.render(floorPlan);
    }

    // Prepare response based on output format
    if (outputFormat === 'svg') {
      // Return just the SVGs
      return NextResponse.json({
        success: true,
        data: {
          svgs: floorPlanSVGs,
          floors: buildingPlan.building.floors,
        },
      });
    }

    // Quantities, cost, foundation design and electrical sizing are never
    // returned from a description (audit 2026-11-26; see publicPlan).
    const plan = publicPlan(buildingPlan);

    if (outputFormat === 'json') {
      // Return just the JSON data without SVGs
      return NextResponse.json({
        success: true,
        data: plan,
      });
    }

    // Full response with both
    return NextResponse.json({
      success: true,
      data: {
        plan,
        svgs: floorPlanSVGs,
        summary: {
          projectName: plan.projectName,
          totalArea: plan.building.totalArea,
          floors: plan.building.floors,
          rooms: plan.floorPlans.reduce((sum, fp) => sum + fp.rooms.length, 0),
          estimatedCost: null,
          currency: plan.currency,
          style: plan.style,
        },
        boq: null,
        electrical: null,
        plumbing: plan.plumbing,
        foundation: null,
        roof: plan.roof,
        notAvailable: NOT_FROM_A_DESCRIPTION,
      },
      dataSource: 'FREE AI - Groq Llama 3 + Custom Algorithms',
    });

  } catch (error) {
    console.error('[Floor Plan API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate floor plan'
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// GET - Get generation options and capabilities
// =============================================================================

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      name: 'FREE AI Floor Plan Generator',
      version: '1.0.0',
      capabilities: [
        'Text-to-floor-plan generation',
        'Multi-floor building support',
        'Room layout optimization',
        'Wall and opening placement',
        'Electrical layout generation',
        'Plumbing layout generation',
        // 'BOQ calculation' and 'Cost estimation' are not offered from a description (audit 2026-11-26).
        'SVG floor plan rendering',
        '3D model data export',
      ],
      supportedStyles: [
        'modern',
        'contemporary',
        'traditional',
        'colonial',
        'minimalist',
        'luxury',
      ],
      roomTypes: [
        'living_room',
        'dining',
        'kitchen',
        'bedroom',
        'master_bedroom',
        'bathroom',
        'master_bathroom',
        'study',
        'garage',
        'utility',
        'balcony',
        'terrace',
        'entrance',
        'corridor',
      ],
      limits: {
        maxFloors: 10,
        maxBedrooms: 20,
        maxTotalArea: 5000, // sqm
      },
      dataSource: 'FREE - No paid APIs required',
      aiProvider: 'Groq (Llama 3) - FREE tier',
    },
  });
}
