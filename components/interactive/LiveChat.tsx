'use client';

/**
 * REAL-TIME LIVE CHAT
 * Human + AI support with real-time messaging
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'human';
  timestamp: Date;
}

interface LiveChatProps {
  apiKey?: string;
  supportEmail?: string;
}

export default function LiveChat({ 
  apiKey,
  supportEmail = 'support@emersoneims.com' 
}: LiveChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isHumanAvailable, setIsHumanAvailable] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(text),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const generateAIResponse = (userText: string): string => {
    const lowerText = userText.toLowerCase();
    
    if (lowerText.includes('generator') || lowerText.includes('power')) {
      return 'I can help you with generator selection! We offer Cummins generators from 20kVA to 2000kVA. Would you like to see our generator configurator?';
    }
    if (lowerText.includes('solar')) {
      return 'Great choice! Our solar solutions include installation, maintenance, and battery storage. Would you like a free consultation?';
    }
    if (lowerText.includes('price') || lowerText.includes('cost')) {
      return 'Pricing depends on your specific needs. I can connect you with our sales team for a customized quote. Would you like me to do that?';
    }
    if (lowerText.includes('human') || lowerText.includes('agent')) {
      return 'I\'ll connect you with a human agent right away!';
    }
    
    return 'Thank you for your question! I\'m here to help with generators, solar systems, UPS, and all your energy infrastructure needs. How can I assist you?';
  };

  const requestHumanAgent = () => {
    const humanMessage: Message = {
      id: Date.now().toString(),
      text: 'Connecting you with a human agent...',
      sender: 'human',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, humanMessage]);
    
    // In production, this would connect to a real chat service
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Hello! This is Sarah from Emerson EIMS. How can I help you today?',
        sender: 'human',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
    }, 2000);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-brand-gold text-black rounded-full shadow-2xl flex items-center justify-center z-50 hover:bg-yellow-400 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Open chat"
      >
        {isOpen ? '✕' : '💬'}
        {!isOpen && isHumanAvailable && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-96 h-[600px] bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 flex flex-col z-50"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-gold to-yellow-600 p-4 rounded-t-2xl flex items-center justify-between">
              <div>
                <h3 className="text-black font-bold">Live Chat</h3>
                <p className="text-black/80 text-sm">
                  {isHumanAvailable ? 'Online' : 'Away'}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-black hover:text-black/70"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-brand-gold text-black'
                        : message.sender === 'ai'
                        ? 'bg-gray-800 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {message.sender !== 'user' && (
                      <div className="text-xs opacity-70 mb-1">
                        {message.sender === 'ai' ? 'AI Assistant' : 'Human Agent'}
                      </div>
                    )}
                    <p>{message.text}</p>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 rounded-2xl px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Request Human Agent */}
            {messages.length > 2 && (
              <div className="px-4 pb-2">
                <button
                  onClick={requestHumanAgent}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-all"
                >
                  👤 Talk to Human Agent
                </button>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(inputText);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-brand-gold"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-gold text-black rounded-lg font-semibold hover:bg-yellow-400 transition-all"
                >
                  Send
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}




