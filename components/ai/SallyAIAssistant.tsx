'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

/**
 * 🤖 SALLY - AI CHAT ASSISTANT
 *
 * Revolutionary personalized AI that greets users by name
 * GAME-CHANGER: First generator company in Kenya with personal AI chat
 *
 * Features:
 * - Friendly name capture (not creepy detection)
 * - Personalized conversations
 * - Service recommendations
 * - Lead capture
 * - WhatsApp/Call quick actions
 * - GDPR compliant
 */

interface Message {
  id: string;
  text: string;
  sender: 'sally' | 'user';
  timestamp: Date;
  options?: {
    label: string;
    action: string;
  }[];
}

interface UserProfile {
  name?: string;
  company?: string;
  interest?: string;
  location?: string;
}

const SERVICES = [
  { label: '⚡ Emergency Generator', value: 'emergency' },
  { label: '🔧 Generator Repair', value: 'repair' },
  { label: '☀️ Solar Installation', value: 'solar' },
  { label: '🔩 Spare Parts', value: 'parts' },
  { label: '🔄 Motor Rewinding', value: 'motor' },
  { label: '📦 Other Services', value: 'other' },
];

const LOCATIONS = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Other'
];

export default function SallyAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [conversationStep, setConversationStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-open after 3 seconds on first visit
  useEffect(() => {
    const hasSeenEmma = localStorage.getItem('sally_seen');
    if (!hasSeenEmma) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sendSallyMessage(
          "👋 Hi there! I'm Sally, your AI assistant at EmersonEIMS. What's your name?",
          []
        );
        localStorage.setItem('sally_seen', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      // Load previous profile if exists
      const savedProfile = localStorage.getItem('sally_profile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
      }
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendSallyMessage = (text: string, options?: { label: string; action: string }[], delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      const message: Message = {
        id: Date.now().toString(),
        text,
        sender: 'sally',
        timestamp: new Date(),
        options,
      };
      setMessages(prev => [...prev, message]);
      setIsTyping(false);
    }, delay);
  };

  const sendUserMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, message]);
  };

  const handleNameSubmit = (name: string) => {
    if (!name.trim()) return;

    sendUserMessage(name);
    const updatedProfile = { ...userProfile, name: name.trim() };
    setUserProfile(updatedProfile);
    localStorage.setItem('sally_profile', JSON.stringify(updatedProfile));

    sendSallyMessage(
      `Great to meet you, ${name}! 🎉\n\nI'm here to help with generators, solar solutions, motor rewinding, and more.\n\nWhat brings you to EmersonEIMS today?`,
      SERVICES.map(s => ({ label: s.label, action: `interest:${s.value}` })),
      1500
    );
    setConversationStep(1);
  };

  const handleServiceSelect = (service: string) => {
    const selectedService = SERVICES.find(s => s.value === service);
    if (!selectedService) return;

    sendUserMessage(selectedService.label);
    const updatedProfile = { ...userProfile, interest: service };
    setUserProfile(updatedProfile);
    localStorage.setItem('sally_profile', JSON.stringify(updatedProfile));

    let response = '';
    const name = userProfile.name || 'there';

    switch (service) {
      case 'emergency':
        response = `${name}, for emergency power, we offer 48-hour installation with our Cummins generators. ⚡\n\nWhere are you located?`;
        break;
      case 'repair':
        response = `${name}, our technicians can diagnose and repair any generator issue. We cover 5,930+ error codes! 🔧\n\nWhere is your generator located?`;
        break;
      case 'solar':
        response = `${name}, we provide complete solar installations for homes and businesses. ☀️\n\nWhich county are you in?`;
        break;
      case 'parts':
        response = `${name}, we stock genuine spare parts for all major brands - Cummins, Caterpillar, Perkins, and more! 🔩\n\nWhat's your location?`;
        break;
      case 'motor':
        response = `${name}, our motor rewinding service brings old motors back to life! 🔄\n\nWhere are you based?`;
        break;
      default:
        response = `${name}, we'd love to help! Tell me more about what you need, and where you're located.`;
    }

    sendSallyMessage(
      response,
      LOCATIONS.map(loc => ({ label: loc, action: `location:${loc}` })),
      1000
    );
    setConversationStep(2);
  };

  const handleLocationSelect = (location: string) => {
    sendUserMessage(location);
    const updatedProfile = { ...userProfile, location };
    setUserProfile(updatedProfile);
    localStorage.setItem('sally_profile', JSON.stringify(updatedProfile));

    const name = userProfile.name || 'there';
    const response = `Perfect, ${name}! We serve ${location} with 24/7 support. 🚀\n\nHow would you like to proceed?`;

    sendSallyMessage(
      response,
      [
        { label: '📞 Call Us Now', action: 'call' },
        { label: '💬 WhatsApp Chat', action: 'whatsapp' },
        { label: '📧 Get Free Quote', action: 'quote' },
        { label: '🔍 Explore Services', action: 'explore' },
      ],
      1000
    );
    setConversationStep(3);
  };

  const handleAction = (action: string) => {
    if (action.startsWith('interest:')) {
      handleServiceSelect(action.replace('interest:', ''));
    } else if (action.startsWith('location:')) {
      handleLocationSelect(action.replace('location:', ''));
    } else {
      switch (action) {
        case 'call':
          sendUserMessage('📞 Call');
          window.location.href = 'tel:+254768860665';
          break;
        case 'whatsapp':
          sendUserMessage('💬 WhatsApp');
          const name = userProfile.name || '';
          const interest = userProfile.interest || '';
          const location = userProfile.location || '';
          const message = `Hi EmersonEIMS! I'm ${name} from ${location}. I'm interested in ${interest}. Can you help?`;
          window.open(`https://wa.me/254768860665?text=${encodeURIComponent(message)}`, '_blank');
          break;
        case 'quote':
          sendUserMessage('📧 Get Quote');
          window.location.href = '/contact';
          break;
        case 'explore':
          sendUserMessage('🔍 Explore');
          window.location.href = '/services';
          break;
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    if (conversationStep === 0) {
      handleNameSubmit(userInput);
    } else {
      sendUserMessage(userInput);
      const name = userProfile.name || 'there';
      sendSallyMessage(
        `Thanks ${name}! Let me connect you with our team who can help with that specifically. 📞 Call +254-768-860665 or WhatsApp us!`,
        [
          { label: '📞 Call Now', action: 'call' },
          { label: '💬 WhatsApp', action: 'whatsapp' },
        ]
      );
    }

    setUserInput('');
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => {
              setIsOpen(true);
              if (messages.length === 0) {
                const savedProfile = localStorage.getItem('sally_profile');
                if (savedProfile) {
                  const profile = JSON.parse(savedProfile);
                  sendSallyMessage(
                    `Welcome back, ${profile.name}! 👋\n\nHow can I help you today?`,
                    SERVICES.map(s => ({ label: s.label, action: `interest:${s.value}` }))
                  );
                  setConversationStep(1);
                } else {
                  sendSallyMessage(
                    "👋 Hi there! I'm Sally, your AI assistant at EmersonEIMS. What's your name?",
                    []
                  );
                }
              }
            }}
            className="fixed bottom-32 right-6 z-[9998] w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center group hover:scale-110 transition-transform"
            whileHover={{ rotate: 10 }}
            aria-label="Chat with Emma - AI Assistant"
          >
            {/* Emma Avatar */}
            <div className="relative">
              <span className="text-2xl">🤖</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </div>

            {/* Tooltip */}
            <div className="absolute right-full mr-3 bg-black text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Chat with Emma 👋
            </div>

            {/* Notification Badge */}
            {messages.length === 0 && (
              <motion.span
                className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                1
              </motion.span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? 'auto' : '600px'
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-[9998] w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="text-3xl">🤖</span>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Emma</h3>
                  <p className="text-xs text-purple-100">AI Assistant • Online 24/7</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Minimize"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.sender === 'user'
                            ? 'bg-purple-600 text-white rounded-br-none'
                            : 'bg-white text-gray-800 shadow-sm rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.text}</p>

                        {/* Options */}
                        {message.options && message.options.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.options.map((option, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleAction(option.action)}
                                className="w-full text-left px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-sm font-medium rounded-lg transition-colors"
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white text-gray-800 shadow-sm rounded-2xl rounded-bl-none px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder={
                        conversationStep === 0
                          ? "Type your name..."
                          : "Type your message..."
                      }
                      className="flex-1 px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!userInput.trim()}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-3 flex gap-2">
                    <Link
                      href="tel:+254768860665"
                      className="flex-1 text-center px-3 py-2 bg-green-100 text-green-700 text-xs font-medium rounded-lg hover:bg-green-200 transition-colors"
                    >
                      📞 Call
                    </Link>
                    <Link
                      href="https://wa.me/254768860665"
                      target="_blank"
                      className="flex-1 text-center px-3 py-2 bg-green-100 text-green-700 text-xs font-medium rounded-lg hover:bg-green-200 transition-colors"
                    >
                      💬 WhatsApp
                    </Link>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
