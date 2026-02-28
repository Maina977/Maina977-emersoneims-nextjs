'use client';

/**
 * GENERATOR ORACLE SPEECH CONTROLLER
 * Professional text-to-speech system with analog radio-style volume control
 * Supports 7 languages with human-like voices
 * Accessibility-focused for hearing impaired users
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Language voice mappings for natural human-like speech
const VOICE_LANGUAGES = {
  en: { code: 'en-US', name: 'English', flag: '🇺🇸', preferredVoices: ['Google US English', 'Microsoft Zira', 'Samantha', 'Alex', 'Karen'] },
  sw: { code: 'sw-KE', name: 'Kiswahili', flag: '🇰🇪', preferredVoices: ['Google Swahili', 'Microsoft Swahili'] },
  fr: { code: 'fr-FR', name: 'Français', flag: '🇫🇷', preferredVoices: ['Google Français', 'Microsoft Hortense', 'Thomas', 'Amelie'] },
  es: { code: 'es-ES', name: 'Español', flag: '🇪🇸', preferredVoices: ['Google Español', 'Microsoft Helena', 'Monica', 'Jorge'] },
  ar: { code: 'ar-SA', name: 'العربية', flag: '🇸🇦', preferredVoices: ['Google Arabic', 'Microsoft Naayf', 'Hoda'] },
  hi: { code: 'hi-IN', name: 'हिन्दी', flag: '🇮🇳', preferredVoices: ['Google Hindi', 'Microsoft Hemant', 'Lekha'] },
  zh: { code: 'zh-CN', name: '中文', flag: '🇨🇳', preferredVoices: ['Google Chinese', 'Microsoft Huihui', 'Ting-Ting', 'Lili'] },
};

interface SpeechControllerProps {
  language: string;
  className?: string;
}

export default function SpeechController({ language, className = '' }: SpeechControllerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [currentText, setCurrentText] = useState('');
  const [showCaptions, setShowCaptions] = useState(true);
  const [spokenText, setSpokenText] = useState('');

  const knobRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startAngle = useRef(0);

  // Initialize voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis?.getVoices() || [];
      setAvailableVoices(voices);

      // Find best voice for current language
      const langConfig = VOICE_LANGUAGES[language as keyof typeof VOICE_LANGUAGES] || VOICE_LANGUAGES.en;
      const preferredVoice = voices.find(v =>
        langConfig.preferredVoices.some(pv => v.name.includes(pv)) ||
        v.lang.startsWith(langConfig.code.split('-')[0])
      );

      if (preferredVoice) {
        setSelectedVoice(preferredVoice);
      } else {
        // Fallback to any voice matching the language
        const fallbackVoice = voices.find(v => v.lang.startsWith(langConfig.code.split('-')[0]));
        setSelectedVoice(fallbackVoice || voices[0]);
      }
    };

    loadVoices();

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [language]);

  // Analog knob rotation handler
  const handleKnobInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!knobRef.current) return;

    const knobRect = knobRef.current.getBoundingClientRect();
    const centerX = knobRect.left + knobRect.width / 2;
    const centerY = knobRect.top + knobRect.height / 2;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const angle = Math.atan2(clientY - centerY, clientX - centerX);
    const degrees = (angle * 180) / Math.PI + 90;

    // Map -135 to 135 degrees to 0-1 volume
    const normalizedDegrees = ((degrees + 135) % 360);
    const newVolume = Math.max(0, Math.min(1, normalizedDegrees / 270));

    setVolume(newVolume);
  }, []);

  // Speak text function
  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis || !text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = volume;
    utterance.rate = rate;
    utterance.pitch = pitch;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setCurrentText(text);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentText('');
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    // Update captions word by word
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const word = text.substring(event.charIndex, event.charIndex + event.charLength);
        setSpokenText(prev => prev + ' ' + word);
      }
    };

    setSpokenText('');
    window.speechSynthesis.speak(utterance);
  }, [volume, rate, pitch, selectedVoice]);

  // Control functions
  const pause = () => {
    window.speechSynthesis?.pause();
    setIsPaused(true);
  };

  const resume = () => {
    window.speechSynthesis?.resume();
    setIsPaused(false);
  };

  const stop = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentText('');
    setSpokenText('');
  };

  // Read page content
  const readPageContent = () => {
    // Get readable content from the page
    const content = document.querySelector('[data-speakable]')?.textContent
      || document.querySelector('main')?.textContent
      || 'Welcome to Generator Oracle. Select content to read.';
    speak(content.slice(0, 5000)); // Limit to 5000 chars
  };

  // Welcome message in selected language
  const playWelcome = () => {
    const welcomeMessages: Record<string, string> = {
      en: 'Welcome to Generator Oracle. Your professional diagnostic assistant for generator maintenance and troubleshooting.',
      sw: 'Karibu Generator Oracle. Msaidizi wako wa kitaalamu wa uchunguzi wa matengenezo ya jenereta.',
      fr: 'Bienvenue sur Generator Oracle. Votre assistant de diagnostic professionnel pour la maintenance des générateurs.',
      es: 'Bienvenido a Generator Oracle. Su asistente de diagnóstico profesional para el mantenimiento de generadores.',
      ar: 'مرحباً بكم في Generator Oracle. مساعدك المهني للتشخيص وصيانة المولدات.',
      hi: 'Generator Oracle में आपका स्वागत है। जनरेटर रखरखाव के लिए आपका पेशेवर डायग्नोस्टिक सहायक।',
      zh: '欢迎使用 Generator Oracle。您的专业发电机维护诊断助手。',
    };
    speak(welcomeMessages[language] || welcomeMessages.en);
  };

  // Get volume rotation angle for knob
  const getKnobRotation = () => {
    return -135 + (volume * 270);
  };

  return (
    <>
      {/* Floating Speech Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-orange-500/30 flex items-center justify-center text-white hover:scale-110 transition-transform ${className}`}
        whileTap={{ scale: 0.95 }}
        title="Voice Assistant"
      >
        {isSpeaking ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            🔊
          </motion.div>
        ) : (
          <span className="text-2xl">🎙️</span>
        )}
      </motion.button>

      {/* Expanded Control Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-40 right-6 z-50 w-80 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-amber-500/30 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎙️</span>
                <div>
                  <h3 className="text-white font-bold text-sm">Voice Assistant</h3>
                  <p className="text-amber-100 text-xs">Human-like Speech</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Analog Volume Knob */}
              <div className="flex justify-center">
                <div className="relative">
                  {/* Knob Background with Markings */}
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 shadow-inner relative">
                    {/* Volume markings */}
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mark) => {
                      const angle = -135 + (mark * 27);
                      const radian = (angle * Math.PI) / 180;
                      const x = 50 + 45 * Math.cos(radian);
                      const y = 50 + 45 * Math.sin(radian);
                      return (
                        <div
                          key={mark}
                          className="absolute text-[8px] text-gray-400 font-bold"
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: 'translate(-50%, -50%)'
                          }}
                        >
                          {mark}
                        </div>
                      );
                    })}

                    {/* Main Knob */}
                    <div
                      ref={knobRef}
                      className="absolute inset-4 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 shadow-lg cursor-pointer"
                      style={{ transform: `rotate(${getKnobRotation()}deg)` }}
                      onMouseDown={(e) => {
                        isDragging.current = true;
                        handleKnobInteraction(e);
                      }}
                      onMouseMove={(e) => {
                        if (isDragging.current) {
                          handleKnobInteraction(e);
                        }
                      }}
                      onMouseUp={() => isDragging.current = false}
                      onMouseLeave={() => isDragging.current = false}
                      onTouchStart={(e) => {
                        isDragging.current = true;
                        handleKnobInteraction(e);
                      }}
                      onTouchMove={(e) => {
                        if (isDragging.current) {
                          handleKnobInteraction(e);
                        }
                      }}
                      onTouchEnd={() => isDragging.current = false}
                    >
                      {/* Knob indicator line */}
                      <div className="absolute top-2 left-1/2 w-1 h-4 bg-gray-900 rounded-full transform -translate-x-1/2" />

                      {/* Center decoration */}
                      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <span className="text-amber-400 font-bold text-lg">{Math.round(volume * 10)}</span>
                      </div>
                    </div>

                    {/* Volume Label */}
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-center">
                      <span className="text-amber-400 text-xs font-semibold">VOLUME</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={playWelcome}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  title="Play Welcome"
                >
                  ▶️
                </button>

                {isSpeaking && !isPaused ? (
                  <button
                    onClick={pause}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    title="Pause"
                  >
                    ⏸️
                  </button>
                ) : isPaused ? (
                  <button
                    onClick={resume}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    title="Resume"
                  >
                    ▶️
                  </button>
                ) : null}

                <button
                  onClick={stop}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  title="Stop"
                >
                  ⏹️
                </button>

                <button
                  onClick={readPageContent}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  title="Read Page"
                >
                  📖
                </button>
              </div>

              {/* Language/Voice Selection */}
              <div className="space-y-2">
                <label className="text-amber-400 text-xs font-semibold">Voice Language</label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(VOICE_LANGUAGES).map(([code, lang]) => (
                    <button
                      key={code}
                      onClick={() => {
                        const voice = availableVoices.find(v =>
                          v.lang.startsWith(lang.code.split('-')[0]) ||
                          lang.preferredVoices.some(pv => v.name.includes(pv))
                        );
                        if (voice) setSelectedVoice(voice);
                      }}
                      className={`p-2 rounded-lg text-center transition-all ${
                        selectedVoice?.lang.startsWith(lang.code.split('-')[0])
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      title={lang.name}
                    >
                      <span className="text-lg">{lang.flag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed Control */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-amber-400 text-xs font-semibold">Speed</label>
                  <span className="text-gray-400 text-xs">{rate.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>Slow</span>
                  <span>Normal</span>
                  <span>Fast</span>
                </div>
              </div>

              {/* Captions Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-amber-400 text-xs font-semibold">Live Captions (Accessibility)</span>
                <button
                  onClick={() => setShowCaptions(!showCaptions)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    showCaptions ? 'bg-amber-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      showCaptions ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Speaking Indicator */}
              {isSpeaking && (
                <div className="bg-gray-800 rounded-lg p-3 border border-amber-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div
                      className="w-3 h-3 bg-green-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                    <span className="text-green-400 text-xs font-semibold">Speaking...</span>
                  </div>
                  {showCaptions && spokenText && (
                    <p className="text-gray-300 text-sm leading-relaxed max-h-20 overflow-y-auto">
                      {spokenText}
                    </p>
                  )}
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    const greeting = {
                      en: 'Hello! How can I help you today?',
                      sw: 'Habari! Nawezaje kukusaidia leo?',
                      fr: 'Bonjour! Comment puis-je vous aider?',
                      es: '¡Hola! ¿Cómo puedo ayudarte hoy?',
                      ar: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
                      hi: 'नमस्ते! आज मैं आपकी कैसे मदद कर सकता हूं?',
                      zh: '您好！今天我能帮您什么？',
                    };
                    speak(greeting[language as keyof typeof greeting] || greeting.en);
                  }}
                  className="py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 text-xs font-medium transition-colors"
                >
                  👋 Greeting
                </button>
                <button
                  onClick={() => {
                    const instructions = {
                      en: 'To diagnose your generator, first check the oil pressure, then verify coolant temperature, and finally inspect the battery voltage.',
                      sw: 'Kuchunguza jenereta yako, kwanza angalia shinikizo la mafuta, kisha thibitisha joto la kipozezi, na hatimaye kagua voltage ya betri.',
                      fr: 'Pour diagnostiquer votre générateur, vérifiez d\'abord la pression d\'huile, puis la température du liquide de refroidissement, et enfin la tension de la batterie.',
                      es: 'Para diagnosticar su generador, primero verifique la presión del aceite, luego la temperatura del refrigerante, y finalmente el voltaje de la batería.',
                      ar: 'لتشخيص مولدك، تحقق أولاً من ضغط الزيت، ثم درجة حرارة سائل التبريد، وأخيراً جهد البطارية.',
                      hi: 'अपने जनरेटर की जांच के लिए, पहले तेल का दबाव जांचें, फिर शीतलक तापमान की पुष्टि करें, और अंत में बैटरी वोल्टेज की जांच करें।',
                      zh: '要诊断您的发电机，首先检查油压，然后验证冷却液温度，最后检查电池电压。',
                    };
                    speak(instructions[language as keyof typeof instructions] || instructions.en);
                  }}
                  className="py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 text-xs font-medium transition-colors"
                >
                  🔧 Quick Guide
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-900/50 px-4 py-2 border-t border-gray-700 flex items-center justify-between">
              <span className="text-gray-500 text-[10px]">Generator Oracle Voice</span>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-500' : 'bg-gray-600'}`} />
                <span className="text-gray-500 text-[10px]">{isSpeaking ? 'Active' : 'Ready'}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Captions (for accessibility) */}
      <AnimatePresence>
        {showCaptions && isSpeaking && spokenText && !isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-40 left-1/2 transform -translate-x-1/2 z-50 max-w-lg bg-black/90 rounded-lg px-6 py-3 border border-amber-500/30"
          >
            <p className="text-white text-center font-medium">{spokenText}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Export speak function for use by other components
export function useSpeech(language: string) {
  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const voices = window.speechSynthesis.getVoices();
    const langConfig = VOICE_LANGUAGES[language as keyof typeof VOICE_LANGUAGES] || VOICE_LANGUAGES.en;

    const voice = voices.find(v =>
      langConfig.preferredVoices.some(pv => v.name.includes(pv)) ||
      v.lang.startsWith(langConfig.code.split('-')[0])
    ) || voices[0];

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [language]);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
  }, []);

  return { speak, stop };
}
