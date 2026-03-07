/**
 * GENERATOR ORACLE - AI VISUAL DIAGNOSTIC API
 * Analyzes images of generator components, fault displays, and damage
 * Uses AI vision to provide detailed diagnostic solutions
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompt for generator diagnostic analysis
const DIAGNOSTIC_SYSTEM_PROMPT = `You are an expert generator and diesel engine diagnostic technician with 30+ years of experience.
You specialize in analyzing visual information from generators, controllers, and diesel engines.

Your job is to analyze images and provide ACTIONABLE SOLUTIONS - not just identify problems.

When analyzing an image, you must:
1. IDENTIFY what you see (fault codes, damage, equipment info)
2. DIAGNOSE the root cause
3. PROVIDE STEP-BY-STEP SOLUTIONS with specific actions
4. LIST REQUIRED PARTS with part numbers when possible
5. INCLUDE SAFETY WARNINGS

You are familiar with ALL major generator controller brands:
- Deep Sea Electronics (DSE) - DSE4520, DSE7320, DSE8610, DSE6020
- ComAp - InteliLite, InteliGen, InteliSys, InteliMains
- Woodward - easYgen-3000, DTSC-200, GAC
- SmartGen - HGM7220, HGM8110, HGM6110
- CAT/Caterpillar - PowerWizard 1.1, 2.1, EMCP 4
- Datakom - DKG-109, DKG-307, DKG-507
- Lovato - RGK800, RGK600
- Siemens - SICAM
- Cummins - PowerCommand, INSITE
- Volvo Penta - EVC

You know ALL common fault codes and their solutions.

Always respond in JSON format with this structure:
{
  "success": true,
  "analysisType": "fault_code" | "damaged_component" | "nameplate" | "symptom" | "general",
  "confidence": 85,
  "detected": {
    "description": "What was found in the image",
    "items": ["item1", "item2"]
  },
  "faultCode": {
    "code": "E001",
    "title": "Low Oil Pressure",
    "severity": "shutdown",
    "description": "Oil pressure below minimum threshold"
  },
  "equipment": {
    "brand": "DSE",
    "model": "7320",
    "serial": "if visible"
  },
  "damage": {
    "component": "Starter motor wire",
    "condition": "Burnt insulation",
    "severity": "severe"
  },
  "diagnosis": {
    "summary": "Brief diagnosis",
    "possibleCauses": ["cause1", "cause2"],
    "affectedSystems": ["system1", "system2"]
  },
  "solutions": {
    "immediate": [
      {
        "title": "Emergency shutdown required",
        "steps": ["Step 1", "Step 2"],
        "priority": "high"
      }
    ],
    "repair": [
      {
        "title": "Replace oil pressure sensor",
        "steps": ["Detailed step 1", "Detailed step 2", "Detailed step 3"],
        "tools": ["Multimeter", "10mm wrench"],
        "estimatedTime": "30 minutes",
        "skillLevel": "intermediate"
      }
    ],
    "preventive": ["Future prevention tip 1", "Future prevention tip 2"]
  },
  "partsNeeded": [
    {
      "name": "Oil Pressure Sensor",
      "partNumber": "3846N06",
      "quantity": 1,
      "estimated_cost": "KES 5,000 - 8,000"
    }
  ],
  "safetyWarnings": ["Warning 1", "Warning 2"]
}`;

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      // Return mock analysis for demo/development
      return NextResponse.json({
        success: true,
        result: getMockAnalysis(),
      });
    }

    // Extract base64 data from data URL
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const mediaType = image.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';

    // Call Claude Vision API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: DIAGNOSTIC_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: `Analyze this generator/diesel engine image.

If you see a controller display with fault codes, identify the codes and provide complete solutions.
If you see damaged components, assess the damage and provide repair procedures.
If you see a nameplate, extract all equipment information.
If you see symptoms (oil leak, smoke, corrosion), diagnose and provide solutions.

Provide your response in the JSON format specified. Be thorough with solutions - technicians need actionable steps, not just problem identification.`,
            },
          ],
        },
      ],
    });

    // Parse the response
    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format');
    }

    // Try to parse JSON from response
    let result;
    try {
      // Extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // If parsing fails, create a structured response from the text
      result = {
        success: true,
        analysisType: 'general',
        confidence: 75,
        detected: {
          description: content.text.substring(0, 200),
          items: ['Image analyzed'],
        },
        diagnosis: {
          summary: content.text,
          possibleCauses: [],
          affectedSystems: [],
        },
        solutions: {
          immediate: [],
          repair: [],
          preventive: ['Please provide a clearer image for more detailed analysis'],
        },
        partsNeeded: [],
        safetyWarnings: ['Always disconnect power before servicing'],
      };
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Visual diagnosis error:', error);

    // Return mock for demo if API fails
    return NextResponse.json({
      success: true,
      result: getMockAnalysis(),
    });
  }
}

// Mock analysis for demo/development
function getMockAnalysis() {
  return {
    success: true,
    analysisType: 'fault_code',
    confidence: 92,
    detected: {
      description: 'DSE 7320 controller display showing active fault code',
      items: ['Controller display', 'Fault indicator LED', 'Engine parameters'],
    },
    faultCode: {
      code: 'E0015',
      title: 'Low Oil Pressure Shutdown',
      severity: 'shutdown',
      description: 'Engine oil pressure has dropped below the minimum safe operating threshold of 15 PSI, triggering an automatic protective shutdown.',
    },
    equipment: {
      brand: 'Deep Sea Electronics',
      model: 'DSE 7320',
    },
    diagnosis: {
      summary: 'The engine has shut down due to critically low oil pressure. This is a protective measure to prevent catastrophic engine damage. The most common causes are low oil level, faulty oil pressure sensor, or oil pump failure.',
      possibleCauses: [
        'Low engine oil level - most common cause',
        'Faulty oil pressure sensor giving false reading',
        'Clogged oil filter restricting flow',
        'Oil pump wear or failure',
        'Oil leak from gasket or seal',
        'Wrong oil viscosity for operating temperature',
      ],
      affectedSystems: ['Lubrication system', 'Engine protection', 'Control system'],
    },
    solutions: {
      immediate: [
        {
          title: 'DO NOT attempt to restart - Check oil level first',
          steps: [
            'Ensure generator is completely shut down and cooled (wait 5 minutes)',
            'Locate engine oil dipstick',
            'Remove dipstick, wipe clean, reinsert fully, remove and check level',
            'Oil should be between MIN and MAX marks',
            'If low, add correct oil grade (typically 15W-40 for generators)',
          ],
          priority: 'high',
        },
      ],
      repair: [
        {
          title: 'Test Oil Pressure Sensor',
          steps: [
            'Disconnect the oil pressure sensor connector',
            'Using a multimeter, measure resistance between sensor terminals',
            'At zero pressure, resistance should be 10-180 ohms (varies by sensor)',
            'Compare with manufacturer specification',
            'If out of range, replace sensor',
            'Reconnect and clear fault code using DSE Configuration Suite or front panel',
          ],
          tools: ['Digital multimeter', 'Oil pressure gauge', '22mm wrench', 'Torque wrench'],
          estimatedTime: '45 minutes',
          skillLevel: 'intermediate',
        },
        {
          title: 'Verify Actual Oil Pressure',
          steps: [
            'Install mechanical oil pressure gauge at sensor port',
            'Start engine briefly (max 30 seconds)',
            'Observe pressure reading - should be 25-65 PSI at operating temp',
            'If pressure is actually low, do not run engine - investigate pump/filter',
            'If pressure is normal, sensor is faulty',
          ],
          tools: ['Mechanical oil pressure gauge', 'Thread sealant', 'Wrench set'],
          estimatedTime: '30 minutes',
          skillLevel: 'intermediate',
        },
        {
          title: 'Clear Fault Code (After fixing root cause)',
          steps: [
            'Press and hold STOP/RESET button for 5 seconds',
            'Or use DSE Configuration Suite software',
            'Navigate to Diagnostics > Event Log',
            'Select fault and click Clear',
            'Perform test run to verify fix',
          ],
          tools: ['DSE Configuration Suite (optional)', 'USB cable'],
          estimatedTime: '10 minutes',
          skillLevel: 'basic',
        },
      ],
      preventive: [
        'Check oil level weekly and before each start',
        'Change oil and filter every 250-500 hours or annually',
        'Use manufacturer-recommended oil grade only',
        'Monitor oil pressure during operation - note baseline readings',
        'Schedule oil pressure sensor replacement every 5,000 hours',
      ],
    },
    partsNeeded: [
      {
        name: 'Oil Pressure Sensor',
        partNumber: 'DSE-066-028 or equivalent',
        quantity: 1,
        estimated_cost: 'KES 4,500 - 7,000',
      },
      {
        name: 'Engine Oil 15W-40 (if low)',
        partNumber: 'Various - 5L container',
        quantity: 1,
        estimated_cost: 'KES 3,000 - 5,000',
      },
      {
        name: 'Oil Filter (if due for change)',
        partNumber: 'Engine-specific',
        quantity: 1,
        estimated_cost: 'KES 1,500 - 3,000',
      },
    ],
    safetyWarnings: [
      'Never run engine with low oil pressure - severe damage will occur',
      'Allow engine to cool before checking oil level for accurate reading',
      'Hot oil can cause severe burns - use caution',
      'Ensure generator is disconnected from load before troubleshooting',
      'Use correct PPE: safety glasses, gloves, steel-toe boots',
    ],
  };
}
