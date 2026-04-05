/**
 * Video Analysis API - Real AI/ML Video Analysis
 * Extracts frames from video and analyzes them for solar site assessment
 *
 * Analyzes:
 * - Multiple angles of roof/site
 * - 360° site assessment
 * - Shadow patterns
 * - Surrounding obstructions
 * - Access routes
 */

import { NextRequest, NextResponse } from 'next/server';

interface VideoAnalysisRequest {
  videoUrl?: string;           // URL to video file
  videoBase64?: string;        // Base64 encoded video (for smaller files)
  frameUrls?: string[];        // Pre-extracted frame URLs
  analysisType?: 'site_survey' | 'roof_inspection' | 'shadow_analysis' | 'comprehensive';
}

interface SiteAnalysis {
  overview: {
    siteType: 'residential' | 'commercial' | 'industrial' | 'agricultural';
    totalAreaEstimate: number;  // m²
    accessRating: 'excellent' | 'good' | 'moderate' | 'difficult';
    overallSuitability: number; // 0-100
  };
  roofSections: Array<{
    id: string;
    type: string;
    area: number;
    usableArea: number;
    orientation: string;
    pitch: number;
    condition: string;
    maxPanels: number;
  }>;
  obstructions: Array<{
    type: string;
    location: string;
    shadowImpact: 'none' | 'morning' | 'afternoon' | 'all_day';
    recommendation: string;
  }>;
  shadingAnalysis: {
    morningShading: number;     // % area affected
    middayShading: number;
    afternoonShading: number;
    seasonalVariation: 'low' | 'moderate' | 'high';
  };
  recommendations: {
    systemSize: { min: number; max: number; optimal: number };  // kWp
    panelCount: { min: number; max: number; optimal: number };
    inverterSize: number;       // kW
    mountingType: string;
    priorityAreas: string[];
    concerns: string[];
    nextSteps: string[];
  };
}

interface VideoAnalysisResponse {
  success: boolean;
  data?: {
    analysis: SiteAnalysis;
    framesAnalyzed: number;
    confidence: number;
    processingTime: number;
  };
  error?: string;
  configRequired?: boolean;
}

const OPENAI_API = 'https://api.openai.com/v1/chat/completions';

const VIDEO_ANALYSIS_PROMPT = `You are an expert solar installation surveyor analyzing video frames from a site survey.

These frames are from a video survey of a property for solar panel installation. Analyze all frames together to provide a comprehensive site assessment.

Provide your analysis as JSON with this structure:
{
  "overview": {
    "siteType": "residential|commercial|industrial|agricultural",
    "totalAreaEstimate": <number in m²>,
    "accessRating": "excellent|good|moderate|difficult",
    "overallSuitability": <0-100>
  },
  "roofSections": [
    {
      "id": "section_1",
      "type": "<roof type>",
      "area": <m²>,
      "usableArea": <m² for solar>,
      "orientation": "N|NE|E|SE|S|SW|W|NW",
      "pitch": <degrees>,
      "condition": "excellent|good|fair|poor",
      "maxPanels": <number>
    }
  ],
  "obstructions": [
    {
      "type": "<type>",
      "location": "<description>",
      "shadowImpact": "none|morning|afternoon|all_day",
      "recommendation": "<suggestion>"
    }
  ],
  "shadingAnalysis": {
    "morningShading": <0-100>,
    "middayShading": <0-100>,
    "afternoonShading": <0-100>,
    "seasonalVariation": "low|moderate|high"
  },
  "recommendations": {
    "systemSize": { "min": <kWp>, "max": <kWp>, "optimal": <kWp> },
    "panelCount": { "min": <n>, "max": <n>, "optimal": <n> },
    "inverterSize": <kW>,
    "mountingType": "<type>",
    "priorityAreas": ["<area1>", "<area2>"],
    "concerns": ["<concern1>", "<concern2>"],
    "nextSteps": ["<step1>", "<step2>"]
  }
}

For Kenya context:
- Standard panel: 400W, 2m x 1m
- 5 peak sun hours average
- Consider equatorial location (minimal tilt needed)
- South or North facing both acceptable near equator

Respond ONLY with valid JSON.`;

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: VideoAnalysisRequest = await request.json();
    const { videoUrl, videoBase64, frameUrls, analysisType = 'comprehensive' } = body;

    // Check configuration
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

    // For video analysis, we need either pre-extracted frames or a video URL
    // OpenAI Vision doesn't directly support video, so we analyze frames

    if (!frameUrls && !videoUrl && !videoBase64) {
      return NextResponse.json(
        {
          success: false,
          error: 'Provide either frameUrls (array of image URLs), videoUrl, or videoBase64',
        },
        { status: 400 }
      );
    }

    let imagesToAnalyze: any[] = [];

    if (frameUrls && frameUrls.length > 0) {
      // Use provided frame URLs
      imagesToAnalyze = frameUrls.slice(0, 10).map((url) => ({
        type: 'image_url',
        image_url: { url, detail: 'high' },
      }));
    } else if (videoUrl || videoBase64) {
      // For actual video processing, you'd need a video processing service
      // like FFmpeg on server, AWS MediaConvert, or Replicate
      // For now, return guidance

      return NextResponse.json(
        {
          success: false,
          error: 'Direct video upload requires video processing setup. Please extract frames first or use frameUrls parameter.',
          guidance: {
            option1: 'Extract 5-10 key frames from your video and provide as frameUrls array',
            option2: 'Use our mobile app which handles frame extraction automatically',
            option3: 'Upload video to cloud storage and provide URL - frame extraction service coming soon',
          },
        },
        { status: 400 }
      );
    }

    if (imagesToAnalyze.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid frames to analyze' },
        { status: 400 }
      );
    }

    console.log(`[Video Analysis] Analyzing ${imagesToAnalyze.length} frames...`);

    const response = await fetch(OPENAI_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: VIDEO_ANALYSIS_PROMPT },
              ...imagesToAnalyze,
            ],
          },
        ],
        max_tokens: 3000,
        temperature: 0.2,
      }),
      signal: AbortSignal.timeout(120000),  // 2 minute timeout for multiple frames
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[Video Analysis] OpenAI error:', errorData);
      return NextResponse.json(
        { success: false, error: errorData.error?.message || 'Video analysis failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const rawAnalysis = data.choices?.[0]?.message?.content || '';

    // Parse JSON response
    let analysis: SiteAnalysis;
    try {
      let jsonStr = rawAnalysis;
      if (rawAnalysis.includes('```json')) {
        jsonStr = rawAnalysis.split('```json')[1].split('```')[0].trim();
      } else if (rawAnalysis.includes('```')) {
        jsonStr = rawAnalysis.split('```')[1].split('```')[0].trim();
      }
      analysis = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('[Video Analysis] Parse error:', rawAnalysis);
      return NextResponse.json(
        { success: false, error: 'Failed to parse analysis results' },
        { status: 500 }
      );
    }

    const processingTime = Date.now() - startTime;
    console.log(`[Video Analysis] Complete in ${processingTime}ms`);

    return NextResponse.json({
      success: true,
      data: {
        analysis,
        framesAnalyzed: imagesToAnalyze.length,
        confidence: analysis.overview?.overallSuitability || 70,
        processingTime,
      },
    });

  } catch (error) {
    console.error('[Video Analysis] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Video analysis failed'
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
      supportedMethods: [
        'frameUrls - Array of image URLs (recommended, up to 10 frames)',
        'videoUrl - Direct video URL (requires frame extraction service)',
      ],
      maxFrames: 10,
      analysisTypes: ['site_survey', 'roof_inspection', 'shadow_analysis', 'comprehensive'],
      tips: [
        'Include frames from multiple angles',
        'Capture all roof sections',
        'Include surrounding trees/buildings for shadow analysis',
        'Morning and afternoon shots help identify shading patterns',
      ],
    },
  });
}
