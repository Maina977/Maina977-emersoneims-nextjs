/**
 * Image Analysis API - Real AI/ML Analysis
 * Uses OpenAI Vision API (GPT-4 Vision) for roof/site analysis
 *
 * Analyzes:
 * - Roof type and material
 * - Roof area estimation
 * - Shading obstacles
 * - Optimal panel placement
 * - Structural considerations
 */

import { NextRequest, NextResponse } from 'next/server';

interface ImageAnalysisRequest {
  image: string;  // Base64 encoded image or URL
  analysisType?: 'roof' | 'site' | 'equipment' | 'general';
  includeAreaEstimate?: boolean;
}

interface RoofAnalysis {
  roofType: string;              // flat, pitched, hip, gable, etc.
  roofMaterial: string;          // tiles, metal, concrete, etc.
  estimatedArea: {
    total: number;               // m²
    usable: number;              // m² (for solar)
    confidence: number;          // 0-100%
  };
  orientation: {
    primary: string;             // N, NE, E, etc.
    optimalForSolar: boolean;
  };
  pitch: {
    estimated: number;           // degrees
    category: 'flat' | 'low' | 'medium' | 'steep';
  };
  obstacles: Array<{
    type: string;                // chimney, vent, skylight, tree, etc.
    impact: 'low' | 'medium' | 'high';
    recommendation: string;
  }>;
  condition: {
    rating: 'excellent' | 'good' | 'fair' | 'poor';
    notes: string[];
  };
  solarSuitability: {
    score: number;               // 0-100
    rating: 'excellent' | 'good' | 'moderate' | 'challenging';
    maxPanels: number;
    maxCapacity: number;         // kWp
    recommendations: string[];
  };
}

interface ImageAnalysisResponse {
  success: boolean;
  data?: {
    analysis: RoofAnalysis;
    rawAnalysis: string;
    confidence: number;
    processingTime: number;      // ms
  };
  error?: string;
  configRequired?: boolean;
}

const OPENAI_API = 'https://api.openai.com/v1/chat/completions';

const ANALYSIS_PROMPT = `You are an expert solar installation engineer analyzing a roof/site image for solar panel installation.

Analyze this image and provide a detailed JSON response with the following structure:
{
  "roofType": "flat|pitched|hip|gable|mansard|shed|butterfly|other",
  "roofMaterial": "concrete tiles|clay tiles|metal sheets|asphalt shingles|slate|thatched|other",
  "estimatedArea": {
    "total": <number in m²>,
    "usable": <number in m² suitable for solar>,
    "confidence": <0-100>
  },
  "orientation": {
    "primary": "N|NE|E|SE|S|SW|W|NW",
    "optimalForSolar": <boolean>
  },
  "pitch": {
    "estimated": <degrees>,
    "category": "flat|low|medium|steep"
  },
  "obstacles": [
    {
      "type": "<obstacle type>",
      "impact": "low|medium|high",
      "recommendation": "<suggestion>"
    }
  ],
  "condition": {
    "rating": "excellent|good|fair|poor",
    "notes": ["<observation1>", "<observation2>"]
  },
  "solarSuitability": {
    "score": <0-100>,
    "rating": "excellent|good|moderate|challenging",
    "maxPanels": <estimated number>,
    "maxCapacity": <kWp>,
    "recommendations": ["<rec1>", "<rec2>"]
  }
}

Be precise with measurements. For a typical residential roof in Kenya/East Africa:
- Standard panel size: 2m x 1m (400W)
- Consider local building styles
- Account for spacing between panels
- Leave 0.5m from edges
- Assume 5 peak sun hours for Kenya

Respond ONLY with valid JSON, no additional text.`;

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: ImageAnalysisRequest = await request.json();
    const { image, analysisType = 'roof' } = body;

    // Check OpenAI configuration
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'OpenAI API not configured. Add OPENAI_API_KEY to environment variables.',
          configRequired: true,
        },
        { status: 503 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Missing image data' },
        { status: 400 }
      );
    }

    // Prepare image for API
    let imageContent: any;

    if (image.startsWith('http://') || image.startsWith('https://')) {
      imageContent = {
        type: 'image_url',
        image_url: { url: image },
      };
    } else {
      // Assume base64
      const base64Data = image.includes('base64,')
        ? image.split('base64,')[1]
        : image;

      imageContent = {
        type: 'image_url',
        image_url: {
          url: `data:image/jpeg;base64,${base64Data}`,
        },
      };
    }

    console.log(`[Image Analysis] Starting ${analysisType} analysis...`);

    const response = await fetch(OPENAI_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',  // GPT-4 Vision
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: ANALYSIS_PROMPT },
              imageContent,
            ],
          },
        ],
        max_tokens: 2000,
        temperature: 0.2,  // Lower temperature for more consistent analysis
      }),
      signal: AbortSignal.timeout(60000),  // 60 second timeout for image analysis
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[Image Analysis] OpenAI error:', errorData);

      if (response.status === 401) {
        return NextResponse.json(
          { success: false, error: 'Invalid OpenAI API key' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { success: false, error: errorData.error?.message || 'Image analysis failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const rawAnalysis = data.choices?.[0]?.message?.content || '';

    // Parse JSON response
    let analysis: RoofAnalysis;
    try {
      // Extract JSON from response (handle markdown code blocks)
      let jsonStr = rawAnalysis;
      if (rawAnalysis.includes('```json')) {
        jsonStr = rawAnalysis.split('```json')[1].split('```')[0].trim();
      } else if (rawAnalysis.includes('```')) {
        jsonStr = rawAnalysis.split('```')[1].split('```')[0].trim();
      }

      analysis = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('[Image Analysis] Failed to parse response:', rawAnalysis);

      // Return raw analysis if parsing fails
      return NextResponse.json({
        success: true,
        data: {
          analysis: {
            roofType: 'unknown',
            roofMaterial: 'unknown',
            estimatedArea: { total: 0, usable: 0, confidence: 0 },
            orientation: { primary: 'unknown', optimalForSolar: false },
            pitch: { estimated: 0, category: 'flat' },
            obstacles: [],
            condition: { rating: 'fair', notes: ['Unable to fully analyze image'] },
            solarSuitability: {
              score: 50,
              rating: 'moderate',
              maxPanels: 0,
              maxCapacity: 0,
              recommendations: ['Please provide a clearer image for accurate analysis'],
            },
          },
          rawAnalysis,
          confidence: 30,
          processingTime: Date.now() - startTime,
        },
      });
    }

    const processingTime = Date.now() - startTime;
    console.log(`[Image Analysis] Complete in ${processingTime}ms`);

    return NextResponse.json({
      success: true,
      data: {
        analysis,
        rawAnalysis,
        confidence: analysis.estimatedArea?.confidence || 75,
        processingTime,
      },
    });

  } catch (error) {
    console.error('[Image Analysis] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Image analysis failed'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      configured: !!process.env.OPENAI_API_KEY,
      supportedFormats: ['JPEG', 'PNG', 'GIF', 'WebP'],
      maxFileSize: '20MB',
      analysisTypes: ['roof', 'site', 'equipment', 'general'],
    },
  });
}
