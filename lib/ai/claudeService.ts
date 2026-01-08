/**
 * CLAUDE API SERVICE
 * Centralized service for Claude Opus 4.5 API integration
 *
 * Features:
 * - Type-safe API wrapper
 * - Error handling and fallback
 * - Token usage tracking
 * - Streaming and non-streaming support
 * - Diagnostic-specific prompts
 *
 * @copyright 2026 EmersonEIMS
 */

import Anthropic from '@anthropic-ai/sdk';

// Configuration
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-opus-4-5-20251101';
const USE_CLAUDE_API = process.env.USE_CLAUDE_API === 'true';
const MAX_TOKENS = parseInt(process.env.CLAUDE_MAX_TOKENS || '4096', 10);

// Initialize client (lazy initialization)
let anthropicClient: Anthropic | null = null;

/**
 * Check if Claude API is enabled and configured
 */
export function isClaudeAPIEnabled(): boolean {
  return USE_CLAUDE_API && !!ANTHROPIC_API_KEY;
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

/**
 * Send message to Claude and get response
 */
export async function sendMessage(
  prompt: string,
  systemPrompt?: string,
  model: string = CLAUDE_MODEL
): Promise<{
  response: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}> {
  try {
    const client = getClient();

    const message = await client.messages.create({
      model,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract text from response
    const textContent = message.content.find(block => block.type === 'text');
    const responseText = textContent?.type === 'text' ? textContent.text : '';

    return {
      response: responseText,
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
      },
    };
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error('Failed to get response from Claude API');
  }
}

/**
 * Specialized function for diagnostic analysis
 */
export async function analyzeDiagnostic(
  symptoms: string,
  brand?: string,
  detectedCodes?: string[]
): Promise<{
  analysis: string;
  confidence: number;
  recommendations: string[];
  usage: { inputTokens: number; outputTokens: number };
}> {
  const systemPrompt = `You are an expert diesel generator technician with 20+ years of experience in industrial power systems. Your specialty is diagnosing and repairing diesel generators from major brands including Cummins, Caterpillar, Perkins, Volvo Penta, and John Deere.

Your role is to:
1. Analyze symptoms described by users
2. Identify the most likely fault codes and issues
3. Provide clear, actionable troubleshooting steps
4. Explain technical concepts in accessible language
5. Always prioritize safety warnings

Format your response in a clear, structured way with:
- Brief summary of the issue
- Confidence level (0-100%)
- Most likely causes
- Step-by-step troubleshooting recommendations
- Safety considerations
- When to call a professional`;

  let prompt = `Analyze the following generator issue:\n\nSymptoms: ${symptoms}`;

  if (brand) {
    prompt += `\nBrand: ${brand}`;
  }

  if (detectedCodes && detectedCodes.length > 0) {
    prompt += `\nDetected fault codes: ${detectedCodes.join(', ')}`;
  }

  prompt += `\n\nProvide a detailed diagnostic analysis with confidence level and recommendations.`;

  try {
    const result = await sendMessage(prompt, systemPrompt);

    // Parse confidence from response (look for patterns like "Confidence: 85%" or "85% confident")
    const confidenceMatch = result.response.match(/(?:confidence|confident):\s*(\d+)%/i);
    const confidence = confidenceMatch ? parseInt(confidenceMatch[1], 10) : 75;

    // Extract recommendations (look for numbered lists or bullet points)
    const recommendations = extractRecommendations(result.response);

    return {
      analysis: result.response,
      confidence,
      recommendations,
      usage: result.usage,
    };
  } catch (error) {
    console.error('Diagnostic analysis error:', error);
    throw error;
  }
}

/**
 * General chat with context awareness
 */
export async function chatWithContext(
  message: string,
  context?: {
    page?: string;
    interests?: string[];
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  }
): Promise<{
  response: string;
  usage: { inputTokens: number; outputTokens: number };
}> {
  const systemPrompt = `You are the AI assistant for EmersonEIMS (Emerson Energy Infrastructure Management System), a leading provider of diesel generators, solar energy solutions, UPS systems, and industrial power equipment in Kenya.

Your role is to:
1. Help customers with product information and inquiries
2. Provide basic technical support and guidance
3. Direct complex diagnostic questions to the specialized diagnostic AI
4. Maintain a professional, friendly, and helpful tone
5. Always provide accurate information about EmersonEIMS services

Key services:
- Diesel Generator Sales, Installation, and Maintenance
- Solar Power Systems and Battery Storage
- UPS and Power Backup Solutions
- 24/7 Emergency Support
- Genuine Parts and Accessories

Contact: +254768860665 | info@emersoneims.com`;

  let prompt = message;

  if (context?.page) {
    prompt = `[User is on page: ${context.page}]\n\n${message}`;
  }

  if (context?.interests && context.interests.length > 0) {
    prompt = `[User interests: ${context.interests.join(', ')}]\n\n${prompt}`;
  }

  try {
    return await sendMessage(prompt, systemPrompt);
  } catch (error) {
    console.error('Chat context error:', error);
    throw error;
  }
}

/**
 * Stream message response (for real-time UX)
 */
export async function* streamMessage(
  prompt: string,
  systemPrompt?: string,
  model: string = CLAUDE_MODEL
): AsyncGenerator<string, void, unknown> {
  try {
    const client = getClient();

    const stream = await client.messages.create({
      model,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      stream: true,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text;
      }
    }
  } catch (error) {
    console.error('Claude streaming error:', error);
    throw new Error('Failed to stream response from Claude API');
  }
}

/**
 * Helper: Extract recommendations from Claude's response
 */
function extractRecommendations(text: string): string[] {
  const recommendations: string[] = [];

  // Look for numbered lists (1. 2. 3. etc.)
  const numberedMatches = text.match(/^\d+\.\s+(.+)$/gm);
  if (numberedMatches) {
    recommendations.push(...numberedMatches.map(m => m.replace(/^\d+\.\s+/, '').trim()));
  }

  // Look for bullet points (- or * or •)
  const bulletMatches = text.match(/^[-*•]\s+(.+)$/gm);
  if (bulletMatches && recommendations.length === 0) {
    recommendations.push(...bulletMatches.map(m => m.replace(/^[-*•]\s+/, '').trim()));
  }

  // If no structured recommendations found, return empty array
  return recommendations.slice(0, 10); // Limit to 10 recommendations
}

/**
 * Calculate estimated cost for a request
 */
export function estimateCost(inputTokens: number, outputTokens: number): {
  inputCost: number;
  outputCost: number;
  totalCost: number;
} {
  // Claude Opus 4.5 pricing: $5/$25 per million tokens
  const INPUT_COST_PER_TOKEN = 5 / 1_000_000;
  const OUTPUT_COST_PER_TOKEN = 25 / 1_000_000;

  const inputCost = inputTokens * INPUT_COST_PER_TOKEN;
  const outputCost = outputTokens * OUTPUT_COST_PER_TOKEN;

  return {
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
  };
}

/**
 * Get model information
 */
export function getModelInfo(): {
  model: string;
  enabled: boolean;
  hasApiKey: boolean;
} {
  return {
    model: CLAUDE_MODEL,
    enabled: USE_CLAUDE_API,
    hasApiKey: !!ANTHROPIC_API_KEY,
  };
}
