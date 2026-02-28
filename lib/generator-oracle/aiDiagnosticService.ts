/**
 * GENERATOR ORACLE AI DIAGNOSTIC SERVICE
 * Real Claude AI integration for advanced generator diagnostics
 *
 * @copyright 2026 Generator Oracle
 */

import Anthropic from '@anthropic-ai/sdk';
import {
  DIAGNOSTIC_SYSTEM_PROMPT,
  FAULT_CODE_SYSTEM_PROMPT,
  generateDiagnosisPrompt,
  generateFaultCodePrompt,
  generateSymptomPrompt,
  validateAIResponse,
} from './aiPrompts';
import {
  performAIDiagnosis as performLocalDiagnosis,
  type GeneratorReadings,
  type AIAnalysisResult,
} from './ai-diagnostic-engine';

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-5-20250929';
const USE_AI_DIAGNOSTICS = process.env.USE_AI_DIAGNOSTICS === 'true';
const MAX_TOKENS = 8192;

// Lazy-initialized client
let anthropicClient: Anthropic | null = null;

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface AIDiagnosticRequest {
  readings: GeneratorReadings;
  faultCodes?: string[];
  symptoms?: string;
  controllerBrand?: string;
  generatorBrand?: string;
  engineBrand?: string;
  useAI?: boolean; // Override USE_AI_DIAGNOSTICS env var
}

export interface AIDiagnosticResponse {
  success: boolean;
  result?: AIAnalysisResult;
  error?: string;
  source: 'ai' | 'local';
  usage?: {
    inputTokens: number;
    outputTokens: number;
    estimatedCostUSD: number;
  };
  processingTimeMs: number;
}

export interface StreamingDiagnosticEvent {
  type: 'start' | 'delta' | 'complete' | 'error';
  content?: string;
  result?: AIAnalysisResult;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLIENT MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if AI diagnostics are enabled
 */
export function isAIDiagnosticsEnabled(): boolean {
  return USE_AI_DIAGNOSTICS && !!ANTHROPIC_API_KEY;
}

/**
 * Get or initialize Anthropic client
 */
function getClient(): Anthropic {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    });
  }

  return anthropicClient;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DIAGNOSTIC FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Perform AI-powered diagnosis with automatic fallback to local engine
 */
export async function getAIDiagnosis(
  request: AIDiagnosticRequest
): Promise<AIDiagnosticResponse> {
  const startTime = Date.now();
  const shouldUseAI = request.useAI ?? isAIDiagnosticsEnabled();

  // If AI is disabled, use local diagnosis
  if (!shouldUseAI) {
    const result = performLocalDiagnosis(request.readings);
    return {
      success: true,
      result,
      source: 'local',
      processingTimeMs: Date.now() - startTime,
    };
  }

  try {
    const client = getClient();

    // Generate prompt
    const prompt = generateDiagnosisPrompt({
      readings: request.readings,
      faultCodes: request.faultCodes,
      symptoms: request.symptoms,
      controllerBrand: request.controllerBrand,
      generatorBrand: request.generatorBrand,
      engineBrand: request.engineBrand,
      engineHours: request.readings.engineHours,
    });

    // Call Claude API
    const message = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: MAX_TOKENS,
      system: DIAGNOSTIC_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract response text
    const textContent = message.content.find(block => block.type === 'text');
    const responseText = textContent?.type === 'text' ? textContent.text : '';

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in AI response');
    }

    const parsedResult = JSON.parse(jsonMatch[0]) as AIAnalysisResult;

    // Validate response structure
    if (!validateAIResponse(parsedResult)) {
      throw new Error('AI response missing required fields');
    }

    // Add timestamp if missing
    if (!parsedResult.timestamp) {
      parsedResult.timestamp = new Date().toISOString();
    }

    // Calculate counts if missing
    if (parsedResult.issues) {
      parsedResult.criticalCount = parsedResult.issues.filter(
        i => i.status === 'critical' || i.status === 'emergency'
      ).length;
      parsedResult.warningCount = parsedResult.issues.filter(
        i => i.status === 'warning'
      ).length;
      parsedResult.normalCount = parsedResult.issues.filter(
        i => i.status === 'normal'
      ).length;
    }

    // Calculate cost
    const inputCost = (message.usage.input_tokens / 1_000_000) * 3; // Sonnet input
    const outputCost = (message.usage.output_tokens / 1_000_000) * 15; // Sonnet output

    return {
      success: true,
      result: parsedResult,
      source: 'ai',
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
        estimatedCostUSD: inputCost + outputCost,
      },
      processingTimeMs: Date.now() - startTime,
    };
  } catch (error) {
    console.error('AI diagnosis error, falling back to local:', error);

    // Fallback to local diagnosis
    const result = performLocalDiagnosis(request.readings);
    return {
      success: true,
      result,
      source: 'local',
      error: `AI unavailable: ${error instanceof Error ? error.message : 'Unknown error'}. Using local analysis.`,
      processingTimeMs: Date.now() - startTime,
    };
  }
}

/**
 * Stream AI diagnosis response for real-time UX
 */
export async function* streamAIDiagnosis(
  request: AIDiagnosticRequest
): AsyncGenerator<StreamingDiagnosticEvent, void, unknown> {
  const shouldUseAI = request.useAI ?? isAIDiagnosticsEnabled();

  // If AI is disabled, return local result immediately
  if (!shouldUseAI) {
    yield { type: 'start' };
    const result = performLocalDiagnosis(request.readings);
    yield { type: 'complete', result };
    return;
  }

  try {
    const client = getClient();

    const prompt = generateDiagnosisPrompt({
      readings: request.readings,
      faultCodes: request.faultCodes,
      symptoms: request.symptoms,
      controllerBrand: request.controllerBrand,
      generatorBrand: request.generatorBrand,
      engineBrand: request.engineBrand,
      engineHours: request.readings.engineHours,
    });

    yield { type: 'start' };

    const stream = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: MAX_TOKENS,
      system: DIAGNOSTIC_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });

    let fullResponse = '';

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        fullResponse += event.delta.text;
        yield { type: 'delta', content: event.delta.text };
      }
    }

    // Parse final result
    const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedResult = JSON.parse(jsonMatch[0]) as AIAnalysisResult;
      parsedResult.timestamp = parsedResult.timestamp || new Date().toISOString();
      yield { type: 'complete', result: parsedResult };
    } else {
      throw new Error('No valid JSON in stream');
    }
  } catch (error) {
    console.error('Streaming AI diagnosis error:', error);
    yield {
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown streaming error',
    };

    // Fallback
    const result = performLocalDiagnosis(request.readings);
    yield { type: 'complete', result };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPECIALIZED DIAGNOSTIC FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Look up a specific fault code
 */
export async function lookupFaultCode(
  faultCode: string,
  controllerBrand?: string
): Promise<{
  success: boolean;
  analysis?: string;
  error?: string;
}> {
  if (!isAIDiagnosticsEnabled()) {
    return {
      success: false,
      error: 'AI diagnostics not enabled. Use local fault code database.',
    };
  }

  try {
    const client = getClient();

    const prompt = generateFaultCodePrompt(faultCode, controllerBrand);

    const message = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      system: FAULT_CODE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const textContent = message.content.find(block => block.type === 'text');
    const responseText = textContent?.type === 'text' ? textContent.text : '';

    return {
      success: true,
      analysis: responseText,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Fault code lookup failed',
    };
  }
}

/**
 * Quick symptom-based diagnosis
 */
export async function diagnoseSymptom(symptom: string): Promise<{
  success: boolean;
  analysis?: string;
  error?: string;
}> {
  if (!isAIDiagnosticsEnabled()) {
    return {
      success: false,
      error: 'AI diagnostics not enabled',
    };
  }

  try {
    const client = getClient();

    const prompt = generateSymptomPrompt(symptom);

    const message = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2048,
      system: DIAGNOSTIC_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const textContent = message.content.find(block => block.type === 'text');
    const responseText = textContent?.type === 'text' ? textContent.text : '';

    return {
      success: true,
      analysis: responseText,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Symptom diagnosis failed',
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get service status and configuration
 */
export function getServiceStatus(): {
  enabled: boolean;
  hasApiKey: boolean;
  model: string;
} {
  return {
    enabled: USE_AI_DIAGNOSTICS,
    hasApiKey: !!ANTHROPIC_API_KEY,
    model: CLAUDE_MODEL,
  };
}

/**
 * Estimate cost for a diagnosis request
 */
export function estimateDiagnosisCost(readings: GeneratorReadings): {
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  estimatedCostUSD: number;
} {
  // Rough estimates based on typical request/response sizes
  const paramCount = Object.keys(readings).filter(
    k => readings[k as keyof GeneratorReadings] !== undefined
  ).length;

  const estimatedInputTokens = 1000 + paramCount * 50;
  const estimatedOutputTokens = 4000 + paramCount * 200;

  // Sonnet pricing
  const inputCost = (estimatedInputTokens / 1_000_000) * 3;
  const outputCost = (estimatedOutputTokens / 1_000_000) * 15;

  return {
    estimatedInputTokens,
    estimatedOutputTokens,
    estimatedCostUSD: inputCost + outputCost,
  };
}
