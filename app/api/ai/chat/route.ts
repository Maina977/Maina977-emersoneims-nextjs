/**
 * AI CHAT API
 * Handles AI-powered chat conversations
 */

import { NextRequest, NextResponse } from 'next/server';

type ChatContext = {
  page?: string;
  interests?: string[];
};

type ChatRequestBody = {
  conversationId?: string;
  message?: string;
  context?: ChatContext;
  history?: unknown[];
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const conversationId = body.conversationId;
    const message = body.message;
    const context = body.context;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid message' },
        { status: 400 }
      );
    }

    // TODO: Integrate with OpenAI API for intelligent responses
    // For now, we'll use rule-based responses with AI-like behavior

    const response = await generateAIResponse(
      message,
      context ?? {}
    );

    return NextResponse.json({
      conversationId,
      response,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

async function generateAIResponse(
  message: string,
  context: ChatContext
): Promise<string> {
  const lowerMessage = message.toLowerCase();
  const page = context.page || '';

  // Rule-based responses (replace with OpenAI API in production)
  if (lowerMessage.includes('solar') || page.includes('solar')) {
    return `Great question about solar energy! At Emerson EIMS, we offer comprehensive solar solutions including installation, maintenance, and battery storage systems. What specific aspect of solar energy are you interested in?`;
  }

  if (lowerMessage.includes('generator') || page.includes('generator')) {
    return `I'd be happy to help with generators! We provide diesel generators, maintenance services, and parts. Are you looking for a new installation or need service for an existing generator?`;
  }

  if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return `Pricing depends on your specific needs. I'd recommend booking a free consultation so our experts can provide you with a customized quote. Would you like me to help you schedule that?`;
  }

  if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
    return `You can reach us at info@emersoneims.com or call us directly. Would you like me to help you get in touch with our team right now?`;
  }

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return `Hello! I'm here to help you with your energy infrastructure needs. How can I assist you today?`;
  }

  // Default response
  return `Thank you for your question! I'm here to help you with generators, solar systems, UPS, diagnostics, and all your energy infrastructure needs. Could you tell me more about what you're looking for?`;
}

