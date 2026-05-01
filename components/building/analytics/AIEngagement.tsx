'use client';

/**
 * AI-POWERED ENGAGEMENT SYSTEM
 * Intelligent visitor engagement, follow-up, and conversion optimization
 * Better than Rybbit AppSumo - Advanced AI capabilities
 */

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

type EngagementContextData = Record<string, unknown> & {
  interests?: string[];
  engagementScore?: number;
};

type ExitIntentDetail = { visitorData?: unknown };
type HighEngagementDetail = { engagementScore?: number } & Record<string, unknown>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

interface AIConversation {
  id: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
  }>;
  context: {
    visitorId: string;
    page: string;
    interests: string[];
    engagementScore: number;
  };
}

interface EngagementOffer {
  type: 'chat' | 'discount' | 'consultation' | 'download' | 'newsletter';
  title: string;
  message: string;
  cta: string;
  priority: 'low' | 'medium' | 'high';
}

export default function AIEngagement() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [conversation, setConversation] = useState<AIConversation | null>(null);
  const [currentOffer, setCurrentOffer] = useState<EngagementOffer | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const visitorIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Get visitor ID
    try {
      visitorIdRef.current = localStorage.getItem('visitor_id');
    } catch {
      visitorIdRef.current = null;
    }

    // Listen for exit intent
    const handleExitIntent = (event: Event) => {
      const customEvent = event as CustomEvent<ExitIntentDetail>;
      const visitorData = customEvent.detail?.visitorData;
      if (isRecord(visitorData)) {
        triggerEngagement('exit_intent', visitorData);
      }
    };

    // Listen for high engagement
    const handleHighEngagement = (event: Event) => {
      const customEvent = event as CustomEvent<HighEngagementDetail>;
      if ((customEvent.detail?.engagementScore ?? 0) > 70) {
        triggerEngagement('high_engagement', customEvent.detail);
      }
    };

    // Listen for form abandonment
    const handleFormAbandonment = (event: Event) => {
      const customEvent = event as CustomEvent<Record<string, unknown>>;
      triggerEngagement('form_abandonment', customEvent.detail ?? {});
    };

    window.addEventListener('exit-intent-detected', handleExitIntent);
    window.addEventListener('high-engagement', handleHighEngagement);
    window.addEventListener('form-abandonment', handleFormAbandonment);

    // Auto-trigger after 30 seconds on page
    const autoTriggerTimer = setTimeout(() => {
      let engagementScoreRaw = '0';
      try {
        engagementScoreRaw = sessionStorage.getItem('engagement_score') || '0';
      } catch {
        // Ignore storage read failures
      }

      const engagementScore = parseInt(engagementScoreRaw, 10);
      if (engagementScore > 30 && !isVisible) {
        triggerEngagement('auto_trigger', { engagementScore });
      }
    }, 30000);

    return () => {
      window.removeEventListener('exit-intent-detected', handleExitIntent);
      window.removeEventListener('high-engagement', handleHighEngagement);
      window.removeEventListener('form-abandonment', handleFormAbandonment);
      clearTimeout(autoTriggerTimer);
    };
  }, [isVisible]);

  const triggerEngagement = async (
    trigger: string,
    data: Record<string, unknown>
  ) => {
    // Generate AI-powered offer based on context
    const offer = await generateEngagementOffer(trigger, data);
    
    if (offer) {
      setCurrentOffer(offer);
      setIsVisible(true);
      
      // Start AI conversation if chat type
      if (offer.type === 'chat') {
        startAIConversation(data);
      }
    }
  };

  const generateEngagementOffer = async (
    trigger: string,
    data: Record<string, unknown>
  ): Promise<EngagementOffer | null> => {
    try {
      const response = await fetch('/api/ai/engagement-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trigger,
          data: {
            visitorId: visitorIdRef.current,
            page: pathname,
            ...data,
          },
        }),
      });

      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        return await response.json();
      }
    } catch (error) {
      console.warn('AI offer generation failed:', error);
    }

    // Fallback offers based on trigger
    return getFallbackOffer(trigger);
  };

  const getFallbackOffer = (trigger: string): EngagementOffer => {
    const offers: Record<string, EngagementOffer> = {
      exit_intent: {
        type: 'discount',
        title: 'Wait! Get 10% Off Your First Service',
        message: 'We noticed you\'re leaving. Get an exclusive 10% discount on your first service with us!',
        cta: 'Claim Discount',
        priority: 'high',
      },
      high_engagement: {
        type: 'consultation',
        title: 'Free Energy Consultation',
        message: 'You seem interested! Book a free consultation with our energy experts.',
        cta: 'Book Free Consultation',
        priority: 'high',
      },
      form_abandonment: {
        type: 'chat',
        title: 'Need Help?',
        message: 'Our AI assistant can help you complete your request.',
        cta: 'Chat Now',
        priority: 'medium',
      },
      auto_trigger: {
        type: 'newsletter',
        title: 'Stay Updated',
        message: 'Get the latest energy solutions and tips delivered to your inbox.',
        cta: 'Subscribe',
        priority: 'low',
      },
    };

    return offers[trigger] || offers.auto_trigger;
  };

  const startAIConversation = async (context: EngagementContextData) => {
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newConversation: AIConversation = {
      id: conversationId,
      messages: [
        {
          role: 'system',
          content: `You are a helpful AI assistant for Emerson EIMS, an energy infrastructure management company. Help visitors with questions about generators, solar systems, UPS, diagnostics, and energy solutions. Be friendly, professional, and conversion-focused.`,
          timestamp: Date.now(),
        },
        {
          role: 'assistant',
          content: 'Hello! I\'m here to help you with your energy infrastructure needs. How can I assist you today?',
          timestamp: Date.now(),
        },
      ],
      context: {
        visitorId: visitorIdRef.current || 'unknown',
        page: pathname,
        interests: context.interests ?? [],
        engagementScore: context.engagementScore ?? 0,
      },
    };

    setConversation(newConversation);
  };

  const sendAIMessage = async (message: string) => {
    if (!conversation) return;

    setIsTyping(true);

    // Add user message
    const userMessage = {
      role: 'user' as const,
      content: message,
      timestamp: Date.now(),
    };

    setConversation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, userMessage],
    } : null);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: conversation.id,
          message,
          context: conversation.context,
          history: conversation.messages,
        }),
      });

      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
        const aiMessage = {
          role: 'assistant' as const,
          content: data.response,
          timestamp: Date.now(),
        };

        setConversation(prev => prev ? {
          ...prev,
          messages: [...prev.messages, aiMessage],
        } : null);

        // Track AI interaction
        await fetch('/api/analytics/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'ai_chat_message',
            data: { conversationId: conversation.id, message },
          }),
        }).catch(() => {}); // Ignore tracking errors
      }
    } catch (error) {
      console.warn('AI chat failed:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleOfferCTA = async () => {
    if (!currentOffer) return;

    // Track conversion
    await fetch('/api/analytics/conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: `offer_${currentOffer.type}`,
        data: { offer: currentOffer },
      }),
    });

    // Handle based on offer type
    switch (currentOffer.type) {
      case 'chat':
        setIsVisible(true);
        if (!conversation) {
          startAIConversation({});
        }
        break;
      case 'discount':
        window.location.href = '/contact?discount=10';
        break;
      case 'consultation':
        window.location.href = '/contact?consultation=free';
        break;
      case 'newsletter':
        // Open newsletter signup
        document.getElementById('newsletter-signup')?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        window.location.href = '/contact';
    }
  };

  if (!isVisible && !currentOffer) return null;

  return (
    <>
      {/* Floating Chat Widget */}
      {currentOffer?.type === 'chat' && (
        <div className="ai-chat-widget" ref={chatRef}>
          <div className="chat-header">
            <div className="chat-avatar">
              <span>AI</span>
            </div>
            <div className="chat-info">
              <h4>AI Assistant</h4>
              <span className="chat-status">Online</span>
            </div>
            <button 
              className="chat-close"
              onClick={() => setIsVisible(false)}
            >
              ×
            </button>
          </div>
          
          {conversation && (
            <div className="chat-messages">
              {conversation.messages
                .filter(m => m.role !== 'system')
                .map((msg, idx) => (
                  <div key={idx} className={`chat-message ${msg.role}`}>
                    <p>{msg.content}</p>
                  </div>
                ))}
              {isTyping && (
                <div className="chat-message assistant typing">
                  <span className="typing-indicator">...</span>
                </div>
              )}
            </div>
          )}
          
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  sendAIMessage(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <button onClick={() => {
              const input = document.querySelector('.chat-input input') as HTMLInputElement;
              if (input?.value) {
                sendAIMessage(input.value);
                input.value = '';
              }
            }}>
              Send
            </button>
          </div>
        </div>
      )}

      {/* Engagement Offer Modal */}
      {currentOffer && currentOffer.type !== 'chat' && (
        <div className="engagement-modal-overlay" onClick={() => setIsVisible(false)}>
          <div className="engagement-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsVisible(false)}>×</button>
            <h3>{currentOffer.title}</h3>
            <p>{currentOffer.message}</p>
            <button className="offer-cta" onClick={handleOfferCTA}>
              {currentOffer.cta}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

