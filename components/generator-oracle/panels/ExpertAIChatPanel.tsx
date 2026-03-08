'use client';

/**
 * EXPERT AI CHAT PANEL - THE CORE SELLING POINT
 *
 * This is the flagship feature of Generator Oracle. It provides:
 * - Conversational AI that diagnoses like a 30-year veteran technician
 * - NO EXTERNAL HARDWARE REQUIRED for diagnosis
 * - Handles 99% of generator issues through intelligent questioning
 * - Provides step-by-step repair procedures
 * - Covers ALL manufacturers: Cummins, Caterpillar, Volvo Penta, Perkins,
 *   John Deere, Deutz, MTU, MAN, Doosan, Yanmar, Kubota, Kohler, etc.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  metadata?: {
    diagnosisComplete?: boolean;
    repairSteps?: RepairStep[];
    partsNeeded?: Part[];
    estimatedCost?: { min: number; max: number };
    urgency?: 'low' | 'medium' | 'high' | 'critical';
    category?: string;
  };
}

interface RepairStep {
  step: number;
  action: string;
  details: string;
  safetyWarning?: string;
  toolsNeeded?: string[];
  timeEstimate?: string;
}

interface Part {
  name: string;
  partNumber?: string;
  quantity: number;
  estimatedCost: number;
  alternatives?: string[];
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  prompt: string;
  category: 'diagnosis' | 'repair' | 'maintenance' | 'technical';
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUICK ACTION PROMPTS
// ═══════════════════════════════════════════════════════════════════════════════

const QUICK_ACTIONS: QuickAction[] = [
  // Diagnosis
  { id: 'wont-start', label: "Generator won't start", icon: '🔑', prompt: "My generator won't start. Help me diagnose the problem.", category: 'diagnosis' },
  { id: 'overheating', label: 'Overheating issues', icon: '🌡️', prompt: "My generator is overheating. What should I check?", category: 'diagnosis' },
  { id: 'low-power', label: 'Low power output', icon: '⚡', prompt: "My generator is not producing enough power. Help me troubleshoot.", category: 'diagnosis' },
  { id: 'strange-noise', label: 'Strange noises', icon: '🔊', prompt: "My generator is making unusual noises. What could be wrong?", category: 'diagnosis' },
  { id: 'fault-code', label: 'Fault code help', icon: '⚠️', prompt: "I have a fault code on my generator controller. Can you help me understand it?", category: 'diagnosis' },
  { id: 'shutdown', label: 'Unexpected shutdown', icon: '🛑', prompt: "My generator shuts down unexpectedly. What's causing this?", category: 'diagnosis' },

  // Repair
  { id: 'injector-service', label: 'Injector service', icon: '💉', prompt: "How do I service the fuel injectors on my generator?", category: 'repair' },
  { id: 'oil-change', label: 'Oil change procedure', icon: '🛢️', prompt: "Guide me through a complete oil change procedure.", category: 'repair' },
  { id: 'coolant-flush', label: 'Coolant system flush', icon: '❄️', prompt: "How do I properly flush and refill the coolant system?", category: 'repair' },
  { id: 'avr-adjust', label: 'AVR adjustment', icon: '📊', prompt: "How do I adjust the AVR for proper voltage output?", category: 'repair' },

  // Maintenance
  { id: 'service-schedule', label: 'Service schedule', icon: '📅', prompt: "What is the recommended service schedule for my generator?", category: 'maintenance' },
  { id: 'load-test', label: 'Load bank testing', icon: '📈', prompt: "How do I perform a proper load bank test?", category: 'maintenance' },

  // Technical
  { id: 'ecm-reset', label: 'ECM reset procedure', icon: '🔄', prompt: "How do I reset the ECM on my generator?", category: 'technical' },
  { id: 'parameter-adjust', label: 'Parameter adjustment', icon: '⚙️', prompt: "How do I adjust engine parameters through the controller?", category: 'technical' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MANUFACTURER DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

const SUPPORTED_MANUFACTURERS = {
  engines: [
    'Cummins', 'Caterpillar', 'Volvo Penta', 'Perkins', 'John Deere', 'Deutz',
    'MTU', 'MAN', 'Doosan', 'Yanmar', 'Kubota', 'Kohler', 'Honda', 'Lister Petter',
    'Iveco/FPT', 'Weichai', 'SDEC', 'Mitsubishi', 'Isuzu', 'Hino', 'Scania',
    'Mercedes/MTU', 'Baudouin', 'Lovol', 'Ricardo', 'Stamford', 'Leroy Somer'
  ],
  controllers: [
    'Deep Sea Electronics (DSE)', 'ComAp', 'Woodward', 'SmartGen', 'Datakom',
    'Lovato', 'Bernini', 'DEIF', 'Comap', 'Sices', 'Emko', 'Harsen', 'Fortrust',
    'KeyPower', 'Original OEM Controllers'
  ],
  alternators: [
    'Stamford', 'Leroy Somer', 'Mecc Alte', 'Marathon', 'Linz Electric',
    'Marelli Motori', 'ABB', 'Siemens', 'WEG', 'Chinese Generic'
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// AI SYSTEM PROMPT
// ═══════════════════════════════════════════════════════════════════════════════

const AI_SYSTEM_PROMPT = `You are the Generator Oracle Expert AI - a world-class generator diagnostic specialist with 30+ years of experience. You have deep expertise in ALL generator manufacturers including ${SUPPORTED_MANUFACTURERS.engines.join(', ')}.

YOUR CORE CAPABILITIES:
1. DIAGNOSIS: Analyze symptoms and identify root causes through intelligent questioning
2. REPAIR GUIDANCE: Provide detailed step-by-step repair procedures
3. FAULT CODE INTERPRETATION: Explain any fault code from any controller
4. MAINTENANCE ADVICE: Recommend preventive maintenance schedules
5. PARTS IDENTIFICATION: Identify parts needed with alternatives
6. COST ESTIMATION: Provide realistic repair cost estimates

DIAGNOSTIC APPROACH:
- Ask clarifying questions to narrow down issues (max 3-4 questions before diagnosis)
- Consider multiple possible causes, ranked by probability
- Always ask for: Generator make/model, running hours, recent history
- Use your knowledge to make logical deductions

FOR EACH DIAGNOSIS, ALWAYS PROVIDE:
1. Most likely cause (with confidence %)
2. Step-by-step verification procedure
3. Required tools
4. Repair procedure if confirmed
5. Parts needed (with alternatives)
6. Estimated repair cost (in KES)
7. Safety warnings if applicable
8. Preventive measures for the future

ECM/ECU EXPERTISE:
- You know reset procedures for ALL manufacturers
- You can guide parameter adjustments
- You understand J1939/CANbus protocols
- You know diagnostic trouble code meanings

IMPORTANT RULES:
- Be conversational but efficient
- Use technical terms but explain them
- Provide actionable advice
- If safety is a concern, ALWAYS warn first
- Never recommend dangerous shortcuts
- Always consider the skill level of the technician

Remember: Your goal is to help ANY technician solve 99% of generator issues without needing external hardware. You ARE the expert they need.`;

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-cyan-500 rounded-full"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function UrgencyBadge({ urgency }: { urgency: 'low' | 'medium' | 'high' | 'critical' }) {
  const configs = {
    low: { bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-400', label: 'Low Priority' },
    medium: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400', label: 'Medium Priority' },
    high: { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400', label: 'High Priority' },
    critical: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', label: 'CRITICAL' },
  };
  const config = configs[urgency];

  return (
    <span className={`px-2 py-1 rounded text-xs font-bold ${config.bg} ${config.text} border ${config.border}`}>
      {config.label}
    </span>
  );
}

function RepairStepsCard({ steps }: { steps: RepairStep[] }) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <div className="mt-4 p-4 bg-slate-800/50 rounded-xl border border-cyan-500/30">
      <h4 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-2">
        <span>🔧</span> Repair Procedure
      </h4>
      <div className="space-y-2">
        {steps.map((step) => (
          <div key={step.step} className="bg-slate-900/50 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedStep(expandedStep === step.step ? null : step.step)}
              className="w-full p-3 flex items-center gap-3 hover:bg-slate-800/50 transition-colors"
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                {step.step}
              </span>
              <span className="flex-1 text-left text-white font-medium">{step.action}</span>
              <motion.span
                animate={{ rotate: expandedStep === step.step ? 180 : 0 }}
                className="text-slate-400"
              >
                ▼
              </motion.span>
            </button>
            <AnimatePresence>
              {expandedStep === step.step && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-3 pb-3"
                >
                  <p className="text-slate-300 text-sm mb-2 ml-11">{step.details}</p>
                  {step.safetyWarning && (
                    <div className="ml-11 p-2 bg-red-500/10 border border-red-500/30 rounded text-red-300 text-sm mb-2">
                      ⚠️ {step.safetyWarning}
                    </div>
                  )}
                  {step.toolsNeeded && step.toolsNeeded.length > 0 && (
                    <div className="ml-11 flex flex-wrap gap-1 mt-2">
                      <span className="text-xs text-slate-500">Tools:</span>
                      {step.toolsNeeded.map((tool, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                  {step.timeEstimate && (
                    <div className="ml-11 mt-2 text-xs text-slate-500">
                      Estimated time: {step.timeEstimate}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

function PartsListCard({ parts, totalCost }: { parts: Part[]; totalCost?: { min: number; max: number } }) {
  return (
    <div className="mt-4 p-4 bg-slate-800/50 rounded-xl border border-amber-500/30">
      <h4 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
        <span>📦</span> Parts Required
      </h4>
      <div className="space-y-2">
        {parts.map((part, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg">
            <div>
              <span className="text-white font-medium">{part.name}</span>
              {part.partNumber && (
                <span className="ml-2 text-xs text-slate-500">P/N: {part.partNumber}</span>
              )}
              <span className="ml-2 text-xs text-slate-400">x{part.quantity}</span>
            </div>
            <span className="text-amber-400 font-bold">
              KES {part.estimatedCost.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      {totalCost && (
        <div className="mt-3 pt-3 border-t border-slate-700 flex items-center justify-between">
          <span className="text-slate-400">Estimated Total Cost:</span>
          <span className="text-lg font-bold text-amber-400">
            KES {totalCost.min.toLocaleString()} - {totalCost.max.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Avatar */}
        {!isUser && (
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <span className="text-sm">🤖</span>
            </div>
            <span className="text-xs text-cyan-400 font-medium">Generator Oracle AI</span>
          </div>
        )}

        {/* Message content */}
        <div className={`rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
            : 'bg-slate-800/80 text-slate-100 border border-slate-700/50'
        }`}>
          {message.isTyping ? (
            <TypingIndicator />
          ) : (
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </div>
          )}
        </div>

        {/* Metadata cards */}
        {message.metadata?.urgency && (
          <div className="mt-2 flex items-center gap-2">
            <UrgencyBadge urgency={message.metadata.urgency} />
            {message.metadata.category && (
              <span className="text-xs text-slate-500">{message.metadata.category}</span>
            )}
          </div>
        )}

        {message.metadata?.repairSteps && message.metadata.repairSteps.length > 0 && (
          <RepairStepsCard steps={message.metadata.repairSteps} />
        )}

        {message.metadata?.partsNeeded && message.metadata.partsNeeded.length > 0 && (
          <PartsListCard
            parts={message.metadata.partsNeeded}
            totalCost={message.metadata.estimatedCost}
          />
        )}

        {/* Timestamp */}
        <div className={`text-[10px] text-slate-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ExpertAIChatPanel({ className = '' }: { className?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: `Welcome to Generator Oracle Expert AI! 🔧

I'm your 24/7 generator diagnostic specialist with expertise in ALL major manufacturers including Cummins, Caterpillar, Volvo Penta, Perkins, John Deere, Deutz, MTU, and many more.

**What I can help you with:**
• Diagnose any generator problem through intelligent questioning
• Provide step-by-step repair procedures
• Explain fault codes from any controller
• Recommend parts and estimate costs
• Guide ECM/ECU procedures

**No external hardware needed for diagnosis!**

Tell me about your generator problem, or choose a quick action below to get started.`,
        timestamp: new Date(),
      }]);
    }
  }, [messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message to AI
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    const typingMessage: Message = {
      id: `typing-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: true,
    };

    setMessages(prev => [...prev, userMessage, typingMessage]);
    setInput('');
    setIsLoading(true);
    setShowQuickActions(false);

    try {
      // Build conversation history for context
      const conversationHistory = messages
        .filter(m => m.role !== 'system' && !m.isTyping)
        .map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));

      // Add the new user message
      conversationHistory.push({
        role: 'user',
        content: content.trim(),
      });

      // Call the AI API
      const response = await fetch('/api/generator-oracle/expert-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationHistory,
          systemPrompt: AI_SYSTEM_PROMPT,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      // Remove typing indicator and add actual response
      setMessages(prev => [
        ...prev.filter(m => !m.isTyping),
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.content,
          timestamp: new Date(),
          metadata: data.metadata,
        },
      ]);
    } catch (error) {
      console.error('Chat error:', error);

      // Fallback response
      setMessages(prev => [
        ...prev.filter(m => !m.isTyping),
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: `I apologize, but I'm having trouble connecting to the AI service right now.

However, I can still help! Here are some general troubleshooting steps:

1. **For starting issues**: Check battery voltage, fuel supply, and air filter
2. **For overheating**: Verify coolant level, radiator condition, and thermostat
3. **For electrical issues**: Check AVR, breakers, and alternator connections
4. **For fault codes**: Note the exact code and controller model

Please try again, or use the other diagnostic panels in Generator Oracle for detailed guidance.`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  // Handle quick action click
  const handleQuickAction = useCallback((action: QuickAction) => {
    sendMessage(action.prompt);
  }, [sendMessage]);

  // Handle form submit
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  }, [input, sendMessage]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }, [input, sendMessage]);

  // Clear conversation
  const clearConversation = useCallback(() => {
    setMessages([{
      id: 'welcome-new',
      role: 'assistant',
      content: `Conversation cleared. How can I help you with your generator today?`,
      timestamp: new Date(),
    }]);
    setShowQuickActions(true);
  }, []);

  // Filter quick actions by category
  const filteredActions = selectedCategory
    ? QUICK_ACTIONS.filter(a => a.category === selectedCategory)
    : QUICK_ACTIONS;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center"
              animate={{
                boxShadow: ['0 0 20px rgba(6,182,212,0.5)', '0 0 40px rgba(6,182,212,0.3)', '0 0 20px rgba(6,182,212,0.5)'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-2xl">🤖</span>
            </motion.div>
            <div>
              <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Expert AI Assistant
              </h2>
              <p className="text-xs text-slate-400">30+ years of generator expertise at your fingertips</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">Online</span>
            </div>
            <button
              onClick={clearConversation}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              title="Clear conversation"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Capability badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          {['All Manufacturers', 'Fault Codes', 'Repair Guides', 'Cost Estimates', 'ECM/ECU', '24/7 Available'].map((cap) => (
            <span key={cap} className="px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded-full text-xs text-slate-400">
              {cap}
            </span>
          ))}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions */}
      <AnimatePresence>
        {showQuickActions && messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex-shrink-0 p-4 border-t border-slate-700/50 bg-slate-900/50"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-slate-400">Quick Actions:</span>
              <div className="flex gap-1">
                {['diagnosis', 'repair', 'maintenance', 'technical'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      selectedCategory === cat
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {filteredActions.slice(0, 8).map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  className="p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-cyan-500/30 rounded-xl text-left transition-all group"
                >
                  <span className="text-xl mb-1 block">{action.icon}</span>
                  <span className="text-sm text-slate-300 group-hover:text-white">{action.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="flex-shrink-0 p-4 border-t border-slate-700/50 bg-slate-900/80">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your generator problem..."
              rows={1}
              className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-none"
              style={{ minHeight: '48px', maxHeight: '120px' }}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`px-6 rounded-xl font-bold transition-all flex items-center gap-2 ${
              input.trim() && !isLoading
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <motion.div
                className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            ) : (
              <>
                <span>Send</span>
                <span>➤</span>
              </>
            )}
          </button>
        </form>
        <p className="text-xs text-slate-500 mt-2 text-center">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
