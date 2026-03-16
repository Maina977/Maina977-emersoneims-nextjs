'use client';

/**
 * Voice Command Panel
 * Hands-free control of Generator Oracle
 * Supports English and Swahili
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getVoiceService,
  VoiceRecognitionState,
  VoiceCommand,
  VOICE_COMMANDS,
  createCommandRouter,
  VoiceCommandHandlers,
} from '@/lib/generator-oracle/voiceCommands';

interface VoiceCommandPanelProps {
  onNavigate?: (destination: string) => void;
  onDiagnostic?: (action: string) => void;
  onSearch?: (query: string, type: 'fault' | 'symptom' | 'part') => void;
  isCompact?: boolean;
}

export default function VoiceCommandPanel({
  onNavigate,
  onDiagnostic,
  onSearch,
  isCompact = false,
}: VoiceCommandPanelProps) {
  const [state, setState] = useState<VoiceRecognitionState>({
    isListening: false,
    isSupported: false,
    language: 'en',
    lastTranscript: '',
    confidence: 0,
    error: null,
  });
  const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const voiceService = typeof window !== 'undefined' ? getVoiceService() : null;

  // Command handlers
  const handlers: VoiceCommandHandlers = {
    onNavigate: (destination) => {
      onNavigate?.(destination);
      voiceService?.speak('Navigating');
    },
    onDiagnostic: (action) => {
      onDiagnostic?.(action);
      voiceService?.speak('Starting diagnostic');
    },
    onSearch: (query, type) => {
      onSearch?.(query, type);
      voiceService?.speak(`Searching for ${query}`);
    },
    onControl: (action) => {
      if (action === 'SHOW_HELP') {
        setShowHelp(true);
        voiceService?.speak('Showing available commands');
      } else if (action === 'STOP_LISTENING') {
        voiceService?.stop();
      } else if (action === 'CHANGE_LANGUAGE') {
        const newLang = state.language === 'en' ? 'sw' : 'en';
        voiceService?.setLanguage(newLang);
        voiceService?.speak(newLang === 'en' ? 'Switched to English' : 'Nimebadilisha kwa Kiswahili');
      }
    },
    onReport: (action) => {
      // Handle report actions
      voiceService?.speak('Processing report action');
    },
  };

  const commandRouter = createCommandRouter(handlers);

  useEffect(() => {
    if (!voiceService) return;

    // Check support
    setState(prev => ({ ...prev, isSupported: voiceService.getIsSupported() }));

    // Set up callbacks
    voiceService.onStateChange((newState) => {
      setState(newState);
    });

    voiceService.onCommand((command, transcript) => {
      setLastCommand(command);
      commandRouter(command, transcript);

      // Clear last command after 3 seconds
      setTimeout(() => setLastCommand(null), 3000);
    });

    return () => {
      voiceService.stop();
    };
  }, []);

  const toggleListening = useCallback(() => {
    if (!voiceService) return;

    if (state.isListening) {
      voiceService.stop();
    } else {
      voiceService.start();
    }
  }, [state.isListening, voiceService]);

  const categories = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'navigation', label: 'Navigation', icon: '🧭' },
    { id: 'diagnostic', label: 'Diagnostic', icon: '🔍' },
    { id: 'search', label: 'Search', icon: '🔎' },
    { id: 'control', label: 'Control', icon: '⚙️' },
    { id: 'report', label: 'Report', icon: '📄' },
  ];

  const filteredCommands = selectedCategory === 'all'
    ? VOICE_COMMANDS
    : VOICE_COMMANDS.filter(c => c.category === selectedCategory);

  if (!state.isSupported) {
    return (
      <div className="bg-slate-900/50 border border-red-500/30 rounded-xl p-4 text-center">
        <p className="text-red-400">Voice commands not supported in this browser</p>
        <p className="text-slate-500 text-sm mt-2">Try Chrome, Edge, or Safari</p>
      </div>
    );
  }

  // Compact mode for floating button
  if (isCompact) {
    return (
      <>
        <motion.button
          onClick={toggleListening}
          className={`fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center ${
            state.isListening
              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {state.isListening ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <MicrophoneIcon className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <MicrophoneIcon className="w-6 h-6 text-white" />
          )}
        </motion.button>

        {/* Floating transcript */}
        <AnimatePresence>
          {state.isListening && state.lastTranscript && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-40 right-6 z-50 max-w-xs bg-slate-800 border border-cyan-500/50 rounded-lg p-3 shadow-lg"
            >
              <p className="text-white text-sm">"{state.lastTranscript}"</p>
              {lastCommand && (
                <p className="text-cyan-400 text-xs mt-1">→ {lastCommand.description}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Full panel mode
  return (
    <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            state.isListening ? 'bg-green-500/20' : 'bg-slate-800'
          }`}>
            <MicrophoneIcon className={`w-5 h-5 ${state.isListening ? 'text-green-400' : 'text-slate-400'}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Voice Commands</h3>
            <p className="text-sm text-slate-400">
              {state.isListening ? 'Listening...' : 'Say "Hey Oracle" to start'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={() => {
              const newLang = state.language === 'en' ? 'sw' : 'en';
              voiceService?.setLanguage(newLang);
            }}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:border-cyan-500/50"
          >
            {state.language === 'en' ? '🇬🇧 EN' : '🇰🇪 SW'}
          </button>

          {/* Main Toggle Button */}
          <motion.button
            onClick={toggleListening}
            className={`px-4 py-2 rounded-lg font-semibold text-sm ${
              state.isListening
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {state.isListening ? 'Stop' : 'Start Listening'}
          </motion.button>
        </div>
      </div>

      {/* Status Area */}
      <AnimatePresence>
        {state.isListening && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-slate-700 overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
              {/* Waveform Animation */}
              <div className="flex items-center justify-center gap-1 h-12 mb-3">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-green-500 rounded-full"
                    animate={{
                      height: state.lastTranscript ? [8, 24 + Math.random() * 16, 8] : 8,
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.5,
                      delay: i * 0.05,
                    }}
                  />
                ))}
              </div>

              {/* Transcript */}
              <div className="text-center">
                {state.lastTranscript ? (
                  <p className="text-white text-lg">"{state.lastTranscript}"</p>
                ) : (
                  <p className="text-slate-400">Waiting for command...</p>
                )}
                {state.confidence > 0 && (
                  <p className="text-slate-500 text-xs mt-1">
                    Confidence: {Math.round(state.confidence * 100)}%
                  </p>
                )}
              </div>

              {/* Last Command */}
              {lastCommand && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-center"
                >
                  <p className="text-cyan-400 text-sm">
                    Executing: {lastCommand.description}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {state.error && (
        <div className="p-3 bg-red-500/10 border-b border-red-500/30">
          <p className="text-red-400 text-sm">Error: {state.error}</p>
        </div>
      )}

      {/* Help Toggle */}
      <div className="p-4 border-b border-slate-700">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <svg className={`w-4 h-4 transition-transform ${showHelp ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <span className="text-sm font-medium">
            {showHelp ? 'Hide Commands' : 'Show Available Commands'}
          </span>
          <span className="text-xs text-slate-500">({VOICE_COMMANDS.length} commands)</span>
        </button>
      </div>

      {/* Commands List */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {/* Category Filter */}
            <div className="p-3 border-b border-slate-700 flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            {/* Commands Grid */}
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="grid gap-2">
                {filteredCommands.map(command => (
                  <div
                    key={command.id}
                    className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-white font-medium text-sm">{command.description}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <span className="text-xs text-cyan-400">EN:</span>
                          {command.phrases.en.slice(0, 2).map((phrase, i) => (
                            <span key={i} className="text-xs text-slate-400">
                              "{phrase}"{i < 1 ? ',' : ''}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs text-amber-400">SW:</span>
                          {command.phrases.sw.slice(0, 2).map((phrase, i) => (
                            <span key={i} className="text-xs text-slate-400">
                              "{phrase}"{i < 1 ? ',' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        command.category === 'navigation' ? 'bg-blue-500/20 text-blue-400' :
                        command.category === 'diagnostic' ? 'bg-green-500/20 text-green-400' :
                        command.category === 'search' ? 'bg-purple-500/20 text-purple-400' :
                        command.category === 'control' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {command.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Tips */}
      <div className="p-4 bg-slate-800/30 border-t border-slate-700">
        <p className="text-xs text-slate-500 text-center">
          💡 Tip: Say "Hey Oracle" followed by your command, or click Start Listening for always-on mode
        </p>
      </div>
    </div>
  );
}

// Microphone Icon Component
function MicrophoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
      />
    </svg>
  );
}
