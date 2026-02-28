/**
 * GENERATOR ORACLE AI DIAGNOSIS API
 * API endpoint for real AI-powered generator diagnostics
 *
 * @copyright 2026 Generator Oracle
 */

import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import {
  getAIDiagnosis,
  streamAIDiagnosis,
  isAIDiagnosticsEnabled,
  getServiceStatus,
  type AIDiagnosticRequest,
} from '@/lib/generator-oracle/aiDiagnosticService';
import type { GeneratorReadings } from '@/lib/generator-oracle/ai-diagnostic-engine';

// ═══════════════════════════════════════════════════════════════════════════════
// RATE LIMITING
// ═══════════════════════════════════════════════════════════════════════════════

// Rate limit: 10 requests per minute per IP
let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (ratelimit) return ratelimit;

  try {
    // Only create if KV is configured
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      ratelimit = new Ratelimit({
        redis: kv,
        limiter: Ratelimit.slidingWindow(10, '1 m'),
        analytics: true,
        prefix: 'oracle:ai-diagnose',
      });
    }
  } catch {
    console.warn('Rate limiting not configured');
  }

  return ratelimit;
}

// ═══════════════════════════════════════════════════════════════════════════════
// REQUEST VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

function validateReadings(readings: unknown): readings is GeneratorReadings {
  if (!readings || typeof readings !== 'object') return false;

  // Check that all provided values are numbers or undefined
  const validKeys = [
    'rpm', 'oilPressure', 'oilTemperature', 'coolantTemp', 'coolantPressure',
    'fuelPressure', 'fuelLevel', 'engineHours', 'intakeAirTemp', 'exhaustTemp',
    'turboBoostPressure', 'voltageL1N', 'voltageL2N', 'voltageL3N', 'voltageL1L2',
    'voltageL2L3', 'voltageL3L1', 'currentL1', 'currentL2', 'currentL3',
    'currentNeutral', 'frequency', 'powerFactor', 'activePowerKw', 'reactivePowerKvar',
    'apparentPowerKva', 'loadPercent', 'batteryVoltage', 'chargerCurrent',
    'generatorKva', 'generatorBrand', 'controllerType',
  ];

  const obj = readings as Record<string, unknown>;

  for (const key of Object.keys(obj)) {
    if (!validKeys.includes(key)) continue;

    const value = obj[key];
    if (value !== undefined && value !== null) {
      if (typeof value !== 'number' && typeof value !== 'string') {
        return false;
      }
    }
  }

  return true;
}

// ═══════════════════════════════════════════════════════════════════════════════
// API HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/generator-oracle/ai-diagnose
 * Perform AI diagnosis on generator readings
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const limiter = getRatelimit();
    if (limiter) {
      const ip = request.headers.get('x-forwarded-for') ||
                 request.headers.get('x-real-ip') ||
                 'anonymous';

      const { success, limit, remaining, reset } = await limiter.limit(ip);

      if (!success) {
        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: 'Too many requests. Please wait before trying again.',
            retryAfter: reset - Date.now(),
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            },
          }
        );
      }
    }

    // Parse request body
    const body = await request.json();

    // Validate readings
    if (!body.readings || !validateReadings(body.readings)) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          message: 'Invalid or missing readings object',
        },
        { status: 400 }
      );
    }

    // Build request
    const diagnosticRequest: AIDiagnosticRequest = {
      readings: body.readings,
      faultCodes: Array.isArray(body.faultCodes) ? body.faultCodes : undefined,
      symptoms: typeof body.symptoms === 'string' ? body.symptoms : undefined,
      controllerBrand: typeof body.controllerBrand === 'string' ? body.controllerBrand : undefined,
      generatorBrand: typeof body.generatorBrand === 'string' ? body.generatorBrand : undefined,
      engineBrand: typeof body.engineBrand === 'string' ? body.engineBrand : undefined,
      useAI: body.useAI !== false, // Default to true if not explicitly false
    };

    // Check if streaming is requested
    if (body.stream === true) {
      // Return streaming response
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const event of streamAIDiagnosis(diagnosticRequest)) {
              const data = JSON.stringify(event) + '\n';
              controller.enqueue(encoder.encode(`data: ${data}\n`));
            }
            controller.close();
          } catch (error) {
            const errorEvent = {
              type: 'error',
              error: error instanceof Error ? error.message : 'Streaming failed',
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorEvent)}\n`));
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Non-streaming response
    const response = await getAIDiagnosis(diagnosticRequest);

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'private, no-cache',
      },
    });
  } catch (error) {
    console.error('AI diagnosis API error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Diagnosis failed',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/generator-oracle/ai-diagnose
 * Get AI diagnosis service status
 */
export async function GET() {
  const status = getServiceStatus();

  return NextResponse.json({
    service: 'Generator Oracle AI Diagnostics',
    aiEnabled: isAIDiagnosticsEnabled(),
    ...status,
    endpoints: {
      diagnose: {
        method: 'POST',
        description: 'Perform AI diagnosis on generator readings',
        body: {
          readings: 'GeneratorReadings object (required)',
          faultCodes: 'Array of fault codes (optional)',
          symptoms: 'Text description of symptoms (optional)',
          controllerBrand: 'Controller brand name (optional)',
          generatorBrand: 'Generator brand name (optional)',
          engineBrand: 'Engine brand name (optional)',
          stream: 'Boolean - enable streaming response (optional)',
          useAI: 'Boolean - force AI or local analysis (optional)',
        },
      },
    },
    rateLimit: {
      requests: 10,
      window: '1 minute',
    },
  });
}
