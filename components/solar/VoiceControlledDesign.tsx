'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Web Speech API types - using any for browser compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognitionType = any;

// ==================== VOICE COMMAND INTERFACE ====================

interface VoiceCommand {
  pattern: RegExp;
  action: string;
  handler: (matches: RegExpMatchArray) => CommandResult;
}

interface CommandResult {
  success: boolean;
  message: string;
  action?: string;
  data?: Record<string, unknown>;
}

interface DesignState {
  panels: number;
  systemSize: number;
  roofType: string;
  location: string;
  batteryBackup: number;
  inverterType: string;
  orientation: string;
  tilt: number;
}

// ==================== VOICE COMMANDS DATABASE ====================

const createVoiceCommands = (
  state: DesignState,
  setState: React.Dispatch<React.SetStateAction<DesignState>>
): VoiceCommand[] => [
  // Panel commands
  {
    pattern: /add (\d+) panels?/i,
    action: 'add_panels',
    handler: (matches) => {
      const count = parseInt(matches[1]);
      setState(prev => ({ ...prev, panels: prev.panels + count, systemSize: (prev.panels + count) * 0.545 }));
      return { success: true, message: `Added ${count} panels. Total: ${state.panels + count} panels`, action: 'panels_added', data: { count } };
    }
  },
  {
    pattern: /remove (\d+) panels?/i,
    action: 'remove_panels',
    handler: (matches) => {
      const count = parseInt(matches[1]);
      const newCount = Math.max(0, state.panels - count);
      setState(prev => ({ ...prev, panels: newCount, systemSize: newCount * 0.545 }));
      return { success: true, message: `Removed ${count} panels. Total: ${newCount} panels`, action: 'panels_removed' };
    }
  },
  {
    pattern: /set (\d+) panels?/i,
    action: 'set_panels',
    handler: (matches) => {
      const count = parseInt(matches[1]);
      setState(prev => ({ ...prev, panels: count, systemSize: count * 0.545 }));
      return { success: true, message: `Set to ${count} panels (${(count * 0.545).toFixed(1)} kW)`, action: 'panels_set' };
    }
  },
  // System size commands
  {
    pattern: /(?:design|create|make|build) (?:a )?(\d+)\s*(?:kw|kilowatt)/i,
    action: 'set_system_size',
    handler: (matches) => {
      const kw = parseInt(matches[1]);
      const panels = Math.ceil(kw / 0.545);
      setState(prev => ({ ...prev, panels, systemSize: kw }));
      return { success: true, message: `Designing ${kw}kW system with ${panels} panels`, action: 'system_designed' };
    }
  },
  // Location commands
  {
    pattern: /(?:set |change )?location (?:to )?(\w+)/i,
    action: 'set_location',
    handler: (matches) => {
      const location = matches[1].toLowerCase();
      setState(prev => ({ ...prev, location }));
      return { success: true, message: `Location set to ${location}`, action: 'location_set' };
    }
  },
  {
    pattern: /(?:i am |i'm |we are |we're )?in (\w+)/i,
    action: 'set_location',
    handler: (matches) => {
      const location = matches[1].toLowerCase();
      setState(prev => ({ ...prev, location }));
      return { success: true, message: `Location set to ${location}`, action: 'location_set' };
    }
  },
  // Roof type commands
  {
    pattern: /(?:set |change )?roof (?:type )?(?:to )?(flat|pitched|gable|hip|metal|mabati|tiles?)/i,
    action: 'set_roof',
    handler: (matches) => {
      let roofType = matches[1].toLowerCase();
      if (roofType === 'mabati') roofType = 'metal-sheet';
      if (roofType === 'tile') roofType = 'tiles';
      setState(prev => ({ ...prev, roofType }));
      return { success: true, message: `Roof type set to ${roofType}`, action: 'roof_set' };
    }
  },
  // Battery commands
  {
    pattern: /add (\d+) hours? (?:of )?(?:battery )?backup/i,
    action: 'set_backup',
    handler: (matches) => {
      const hours = parseInt(matches[1]);
      setState(prev => ({ ...prev, batteryBackup: hours }));
      return { success: true, message: `Battery backup set to ${hours} hours`, action: 'backup_set' };
    }
  },
  {
    pattern: /(?:no|remove|disable) batter(?:y|ies)/i,
    action: 'remove_battery',
    handler: () => {
      setState(prev => ({ ...prev, batteryBackup: 0 }));
      return { success: true, message: 'Battery backup removed (grid-tied only)', action: 'backup_removed' };
    }
  },
  // Inverter commands
  {
    pattern: /(?:use |set )?(?:a )?(hybrid|off-?grid|grid-?tied|string) inverter/i,
    action: 'set_inverter',
    handler: (matches) => {
      const inverterType = matches[1].toLowerCase().replace('-', '');
      setState(prev => ({ ...prev, inverterType }));
      return { success: true, message: `Inverter type set to ${inverterType}`, action: 'inverter_set' };
    }
  },
  // Orientation commands
  {
    pattern: /(?:face |orient |point )?(north|south|east|west)/i,
    action: 'set_orientation',
    handler: (matches) => {
      const orientation = matches[1].toLowerCase();
      setState(prev => ({ ...prev, orientation }));
      return { success: true, message: `Panels oriented ${orientation}`, action: 'orientation_set' };
    }
  },
  // Tilt commands
  {
    pattern: /(?:set |change )?tilt (?:to )?(\d+)\s*(?:degrees?|°)?/i,
    action: 'set_tilt',
    handler: (matches) => {
      const tilt = parseInt(matches[1]);
      setState(prev => ({ ...prev, tilt }));
      return { success: true, message: `Panel tilt set to ${tilt}°`, action: 'tilt_set' };
    }
  },
  // Reset command
  {
    pattern: /(?:reset|clear|start over|new design)/i,
    action: 'reset',
    handler: () => {
      setState({
        panels: 0,
        systemSize: 0,
        roofType: 'flat',
        location: 'nairobi',
        batteryBackup: 8,
        inverterType: 'hybrid',
        orientation: 'north',
        tilt: 15
      });
      return { success: true, message: 'Design reset. Ready for new design.', action: 'reset' };
    }
  },
  // Calculate/Summary commands
  {
    pattern: /(?:calculate|show|what is|tell me) (?:the )?(?:cost|price|total)/i,
    action: 'calculate_cost',
    handler: () => {
      const cost = state.panels * 25000 + (state.batteryBackup > 0 ? state.batteryBackup * 15000 : 0);
      return { success: true, message: `Estimated cost: KES ${cost.toLocaleString()}`, action: 'cost_calculated', data: { cost } };
    }
  },
  {
    pattern: /(?:calculate|show|what is) (?:the )?(?:production|output|energy)/i,
    action: 'calculate_production',
    handler: () => {
      const annual = Math.round(state.systemSize * 5.5 * 365 * 0.85);
      return { success: true, message: `Annual production: ${annual.toLocaleString()} kWh`, action: 'production_calculated', data: { annual } };
    }
  },
  {
    pattern: /(?:summary|summarize|overview|status)/i,
    action: 'summary',
    handler: () => {
      return {
        success: true,
        message: `System: ${state.panels} panels, ${state.systemSize.toFixed(1)}kW, ${state.location}, ${state.roofType} roof, ${state.batteryBackup}h backup`,
        action: 'summary'
      };
    }
  },
  // Help command
  {
    pattern: /(?:help|commands|what can you do)/i,
    action: 'help',
    handler: () => {
      return {
        success: true,
        message: 'Try: "Add 10 panels", "Design 5kW system", "Set location Mombasa", "Add 8 hours backup", "Calculate cost"',
        action: 'help'
      };
    }
  },
  // Generate quotation
  {
    pattern: /(?:generate|create|make) (?:a )?quotation/i,
    action: 'generate_quotation',
    handler: () => {
      return { success: true, message: 'Generating quotation... Redirecting to AI Quotation system.', action: 'quotation' };
    }
  },
];

// ==================== MAIN COMPONENT ====================

export default function VoiceControlledDesign() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<{ type: 'user' | 'ai'; text: string; time: Date }[]>([
    { type: 'ai', text: 'Hello! I\'m your AI Solar Design Assistant. Say "Help" to see what I can do, or start designing with commands like "Design a 10kW system"', time: new Date() }
  ]);
  const [designState, setDesignState] = useState<DesignState>({
    panels: 0,
    systemSize: 0,
    roofType: 'flat',
    location: 'nairobi',
    batteryBackup: 8,
    inverterType: 'hybrid',
    orientation: 'north',
    tilt: 15
  });
  const [isSupported, setIsSupported] = useState(true);
  const [manualInput, setManualInput] = useState('');

  const recognitionRef = useRef<SpeechRecognitionType>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check browser support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
      }
    }
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Process command
  const processCommand = useCallback((text: string) => {
    const commands = createVoiceCommands(designState, setDesignState);

    // Add user message
    setMessages(prev => [...prev, { type: 'user', text, time: new Date() }]);

    // Find matching command
    for (const command of commands) {
      const matches = text.match(command.pattern);
      if (matches) {
        const result = command.handler(matches);

        // Add AI response
        setTimeout(() => {
          setMessages(prev => [...prev, { type: 'ai', text: result.message, time: new Date() }]);

          // Speak response
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(result.message);
            utterance.rate = 1.1;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
          }
        }, 300);

        return;
      }
    }

    // No match found
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'ai',
        text: `I didn't understand "${text}". Try saying "Help" for available commands.`,
        time: new Date()
      }]);
    }, 300);
  }, [designState]);

  // Start listening
  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const text = result[0].transcript;

      setTranscript(text);

      if (result.isFinal) {
        processCommand(text);
        setTranscript('');
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [processCommand]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  // Handle manual input
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      processCommand(manualInput.trim());
      setManualInput('');
    }
  };

  // Calculate estimates
  const estimates = {
    cost: designState.panels * 25000 + (designState.batteryBackup > 0 ? designState.batteryBackup * 15000 : 0) + 50000,
    annual: Math.round(designState.systemSize * 5.5 * 365 * 0.85),
    monthly: Math.round(designState.systemSize * 5.5 * 30 * 0.85),
    savings: Math.round(designState.systemSize * 5.5 * 365 * 0.85 * 22),
    payback: designState.systemSize > 0 ? ((designState.panels * 25000 + 50000) / (designState.systemSize * 5.5 * 365 * 0.85 * 22)).toFixed(1) : '0',
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-3xl border border-purple-500/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <span className="text-4xl">🎙️</span> Voice-Controlled Solar Design
            </h2>
            <p className="text-purple-100">
              Speak to design your solar system - AI understands natural language
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">
              AI Voice v1.0
            </span>
            {isListening && (
              <span className="px-3 py-1 bg-red-500 rounded-full text-white text-sm animate-pulse">
                LISTENING...
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Voice Interface */}
          <div className="space-y-4">
            {/* Microphone Button */}
            <div className="flex justify-center">
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={!isSupported}
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50'
                    : isSupported
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-lg shadow-purple-500/30'
                      : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                <span className="text-5xl">{isListening ? '🔴' : '🎤'}</span>
              </button>
            </div>

            {!isSupported && (
              <p className="text-center text-red-400 text-sm">
                Voice not supported in this browser. Use text input below.
              </p>
            )}

            {/* Live Transcript */}
            {transcript && (
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 text-center">
                <p className="text-purple-300 text-sm mb-1">Hearing:</p>
                <p className="text-white text-lg font-medium">{transcript}</p>
              </div>
            )}

            {/* Chat Messages */}
            <div className="bg-slate-800/50 rounded-xl p-4 h-64 overflow-y-auto">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`mb-3 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.type === 'user'
                        ? 'bg-purple-500 text-white'
                        : 'bg-slate-700 text-gray-200'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs opacity-50 mt-1">
                      {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Manual Input */}
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Or type a command..."
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-400 transition-all"
              >
                Send
              </button>
            </form>

            {/* Quick Commands */}
            <div className="flex flex-wrap gap-2">
              {[
                'Add 10 panels',
                'Design 5kW system',
                'Add 8 hours backup',
                'Calculate cost',
                'Summary'
              ].map(cmd => (
                <button
                  key={cmd}
                  onClick={() => processCommand(cmd)}
                  className="px-3 py-1 bg-slate-700 text-gray-300 rounded-full text-sm hover:bg-slate-600 transition-all"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>

          {/* Design Preview */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Current Design</h3>

            {/* Visual Preview */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Roof with panels visualization */}
                <div className="col-span-3 bg-slate-900 rounded-xl p-4 h-40 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    {Array.from({ length: Math.min(designState.panels, 30) }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-8 h-12 bg-blue-500 border border-blue-400 rounded"
                        style={{
                          left: `${(i % 10) * 10 + 5}%`,
                          top: `${Math.floor(i / 10) * 35 + 10}%`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="text-center z-10">
                    <p className="text-6xl font-bold text-amber-400">{designState.panels}</p>
                    <p className="text-gray-400">Solar Panels</p>
                  </div>
                </div>
              </div>

              {/* Design Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs">System Size</p>
                  <p className="text-white font-bold">{designState.systemSize.toFixed(1)} kW</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs">Location</p>
                  <p className="text-white font-bold capitalize">{designState.location}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs">Roof Type</p>
                  <p className="text-white font-bold capitalize">{designState.roofType}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs">Battery Backup</p>
                  <p className="text-white font-bold">{designState.batteryBackup}h</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs">Inverter</p>
                  <p className="text-white font-bold capitalize">{designState.inverterType}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs">Orientation</p>
                  <p className="text-white font-bold capitalize">{designState.orientation} @ {designState.tilt}°</p>
                </div>
              </div>
            </div>

            {/* Estimates */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4">
              <h4 className="text-green-400 font-bold mb-3">AI Estimates</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-500 text-xs">System Cost</p>
                  <p className="text-white font-bold">KES {estimates.cost.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Annual Production</p>
                  <p className="text-white font-bold">{estimates.annual.toLocaleString()} kWh</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Annual Savings</p>
                  <p className="text-green-400 font-bold">KES {estimates.savings.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Payback Period</p>
                  <p className="text-amber-400 font-bold">{estimates.payback} years</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => processCommand('generate quotation')}
                className="py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-xl hover:opacity-90 transition-all"
              >
                Generate Quotation
              </button>
              <a
                href={`https://wa.me/254768860665?text=${encodeURIComponent(
                  `Voice Design: ${designState.panels} panels, ${designState.systemSize.toFixed(1)}kW, ${designState.location}, ${designState.batteryBackup}h backup. Est: KES ${estimates.cost.toLocaleString()}`
                )}`}
                className="py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition-all text-center"
              >
                WhatsApp Order
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900/50 border-t border-slate-700 p-4 text-center">
        <p className="text-gray-500 text-sm">
          EmersonEIMS Voice AI v1.0 | Speak naturally - AI understands context
        </p>
      </div>
    </div>
  );
}
