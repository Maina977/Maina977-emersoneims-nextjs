/**
 * AI ENGAGEMENT OFFER API
 * Generates AI-powered engagement offers based on visitor behavior
 */

import { NextRequest, NextResponse } from 'next/server';

type EngagementTrigger = 'exit_intent' | 'high_engagement' | 'form_abandonment' | string;

type EngagementData = {
  page?: string;
  engagementScore?: number;
  interests?: string[];
  timeOnPage?: number;
  [key: string]: unknown;
};

type EngagementOffer = {
  type: 'discount' | 'consultation' | 'chat' | 'newsletter';
  title: string;
  message: string;
  cta: string;
  priority: 'high' | 'medium' | 'low';
};

type EngagementOfferRequestBody = {
  trigger?: EngagementTrigger;
  data?: EngagementData;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as EngagementOfferRequestBody;
    const trigger = body.trigger;
    const data = body.data;

    if (!trigger || typeof trigger !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid trigger' },
        { status: 400 }
      );
    }

    // TODO: Integrate with OpenAI API for intelligent offer generation
    // For now, we'll use rule-based logic with AI-like personalization

    const offer = await generateIntelligentOffer(trigger, data ?? {});

    return NextResponse.json(offer);
  } catch (error) {
    console.error('AI offer generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate offer' },
      { status: 500 }
    );
  }
}

async function generateIntelligentOffer(
  trigger: EngagementTrigger,
  data: EngagementData
): Promise<EngagementOffer> {
  // Analyze visitor data
  const page = data.page || '';
  const engagementScore = data.engagementScore || 0;
  const interests = data.interests || [];

  // Determine best offer based on context
  if (trigger === 'exit_intent' && engagementScore > 50) {
    return {
      type: 'discount',
      title: 'Wait! Exclusive Offer Just For You',
      message: `We noticed you're interested in ${interests[0] || 'our services'}. Get 10% off your first service!`,
      cta: 'Claim Your Discount',
      priority: 'high',
    };
  }

  if (trigger === 'high_engagement' && page.includes('solar')) {
    return {
      type: 'consultation',
      title: 'Free Solar Energy Consultation',
      message: 'Get expert advice on the best solar solution for your needs. Book a free consultation today!',
      cta: 'Book Free Consultation',
      priority: 'high',
    };
  }

  if (trigger === 'form_abandonment') {
    return {
      type: 'chat',
      title: 'Need Help Completing Your Request?',
      message: 'Our AI assistant can help you right now. Chat with us!',
      cta: 'Chat Now',
      priority: 'medium',
    };
  }

  // Default offer
  return {
    type: 'newsletter',
    title: 'Stay Updated with Energy Solutions',
    message: 'Get the latest tips, solutions, and exclusive offers delivered to your inbox.',
    cta: 'Subscribe Now',
    priority: 'low',
  };
}

