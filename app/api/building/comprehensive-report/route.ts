/**
 * COMPREHENSIVE BUILDING REPORT API
 * Generates ALL 10 outputs from a single description
 *
 * Outputs:
 * 1. Complete Floor Plans (all floors)
 * 2. Wall Schedule with dimensions
 * 3. Door & Window Schedule
 * 4. Complete BOQ with quantities
 * 5. Electrical Maps & Diagrams
 * 6. Plumbing Maps & Diagrams
 * 7. Structural Analysis & Strength
 * 8. Risk Analysis & Recommendations
 * 9. Region-based Material Recommendations
 * 10. Interactive 3D Model Data
 *
 * ALL REAL DATA - NO FAKE VALUES
 * 100% FREE - No paid APIs
 */

import { NextRequest, NextResponse } from 'next/server';
import { comprehensiveReportGenerator } from '@/lib/building/comprehensiveReportGenerator';
import { floorPlanRenderer } from '@/lib/building/floorPlanGenerator';

// Vercel timeout config
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      description,
      bedrooms = 4,
      bathrooms = 3,
      floors = 2,
      totalArea = 250,
      style = 'modern',
      location = 'Nairobi, Kenya',
      coordinates,
      clientName,
      currency = 'KES',
    } = body;

    // Validate
    if (!description || description.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please provide a detailed building description (min 10 characters)' },
        { status: 400 }
      );
    }

    console.log('[Comprehensive Report API] Generating report for:', description.substring(0, 50));

    // Generate the complete report
    const report = await comprehensiveReportGenerator.generateReport({
      description,
      bedrooms,
      bathrooms,
      floors,
      totalArea,
      style,
      location,
      coordinates,
      clientName,
      currency,
    });

    // Generate SVG floor plans
    const floorPlanSVGs: Record<string, string> = {};
    // Note: SVG generation would require the building plan - simplified here

    return NextResponse.json({
      success: true,
      data: {
        // Report metadata
        id: report.id,
        generatedAt: report.generatedAt,
        projectInfo: report.projectInfo,

        // Output 1: Floor Plans
        floorPlans: report.floorPlans,

        // Output 2: Wall Schedule
        wallSchedule: {
          items: report.wallSchedule,
          summary: report.wallSummary,
        },

        // Output 3: Door & Window Schedule
        openings: {
          doors: report.doorSchedule,
          windows: report.windowSchedule,
          summary: report.openingsSummary,
        },

        // Output 4: Complete BOQ
        boq: {
          sections: report.boq,
          summary: report.boqSummary,
        },

        // Output 5: Electrical Layout
        electrical: report.electrical,

        // Output 6: Plumbing Layout
        plumbing: report.plumbing,

        // Output 7: Structural Analysis
        structural: report.structural,

        // Output 8: Risk Analysis
        risk: report.risk,

        // Output 9: Material Recommendations
        materials: report.materials,

        // Output 10: 3D Model Data
        model3D: report.model3D,

        // Pricing
        pricing: {
          currency: report.currency,
          totalCost: report.boqSummary.totalCost,
          costPerSqm: report.boqSummary.costPerSqm,
          breakdown: {
            materials: report.boqSummary.materialsCost,
            labor: report.boqSummary.laborCost,
            equipment: report.boqSummary.equipmentCost,
            overhead: report.boqSummary.overheadCost,
            contingency: report.boqSummary.contingency,
          },
        },
      },
      dataSource: 'FREE AI - Groq Llama 3 + Custom Algorithms',
      apiVersion: '2.0',
    });

  } catch (error) {
    console.error('[Comprehensive Report API] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to generate report' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      name: 'Comprehensive Building Report Generator',
      version: '2.0.0',
      description: 'Generates complete building documentation from a text description',
      outputs: [
        { id: 1, name: 'Floor Plans', description: 'Complete floor plans for all levels with room layouts' },
        { id: 2, name: 'Wall Schedule', description: 'Detailed wall specifications with dimensions and materials' },
        { id: 3, name: 'Door & Window Schedule', description: 'Complete openings schedule with sizes and specifications' },
        { id: 4, name: 'Bill of Quantities', description: 'Itemized BOQ with quantities, rates, and amounts' },
        { id: 5, name: 'Electrical Layout', description: 'Lighting, power outlets, circuits, and cable schedules' },
        { id: 6, name: 'Plumbing Layout', description: 'Water supply, drainage, fixtures, and pipe schedules' },
        { id: 7, name: 'Structural Analysis', description: 'Load calculations, foundation, columns, beams, slabs' },
        { id: 8, name: 'Risk Analysis', description: 'Delay prediction, cost overrun, environmental risks' },
        { id: 9, name: 'Material Recommendations', description: 'Region-specific materials with suppliers' },
        { id: 10, name: '3D Model Data', description: 'Three.js/GLTF compatible 3D model' },
      ],
      pricing: 'FREE - No paid APIs required',
      aiProvider: 'Groq Llama 3 (FREE tier)',
      example: {
        request: {
          description: '6 bedroom luxury villa with pool, home theater, gym, and 3-car garage',
          bedrooms: 6,
          bathrooms: 7,
          floors: 3,
          totalArea: 600,
          style: 'luxury',
          location: 'Karen, Nairobi',
        },
      },
    },
  });
}
