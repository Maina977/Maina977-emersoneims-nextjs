/**
 * AI CHAT STREAMING API
 * Real-time streaming responses using Claude Opus 4.5
 *
 * Features:
 * - Server-Sent Events (SSE) streaming
 * - Real-time character-by-character responses
 * - Enhanced user experience
 * - Graceful fallback to non-streaming
 *
 * @copyright 2026 EmersonEIMS
 */

import { NextRequest } from 'next/server';
import { isClaudeAPIEnabled, streamMessage } from '@/lib/ai/claudeService';

type StreamRequestBody = {
  message: string;
  context?: {
    page?: string;
    interests?: string[];
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as StreamRequestBody;
    const { message, context } = body;

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid message' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if Claude API is enabled
    if (!isClaudeAPIEnabled()) {
      return new Response(
        JSON.stringify({
          error: 'Streaming requires Claude API to be enabled',
          message: 'Please configure ANTHROPIC_API_KEY and set USE_CLAUDE_API=true'
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Build system prompt based on context
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

    // Build prompt with context
    let prompt = message;
    if (context?.page) {
      prompt = `[User is on page: ${context.page}]\n\n${message}`;
    }

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamMessage(prompt, systemPrompt)) {
            // Send chunk as SSE format
            const data = `data: ${JSON.stringify({ content: chunk })}\n\n`;
            controller.enqueue(encoder.encode(data));
          }

          // Send completion signal
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          const errorData = `data: ${JSON.stringify({
            error: 'Stream failed',
            message: error instanceof Error ? error.message : 'Unknown error'
          })}\n\n`;
          controller.enqueue(encoder.encode(errorData));
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
  } catch (error) {
    console.error('Stream API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to start stream',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
