'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot'; time: string }>>([]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const userMessage = {
      text: inputValue,
      sender: 'user' as const,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        text: "Thank you for your message! Our team will respond shortly. For immediate assistance, call +254 768 860 655.",
        sender: 'bot' as const,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold shadow-2xl hover:from-amber-500 hover:to-amber-700 transition-all flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Open live chat"
      >
        {isOpen ? '✕' : '💬'}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-black/95 backdrop-blur-xl rounded-2xl border border-amber-500/50 shadow-2xl flex flex-col"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-amber-900/20 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold">Live Chat</h3>
                  <p className="text-xs text-gray-400">We're online now</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <p className="mb-2">👋 Hello! How can we help you today?</p>
                  <p className="text-sm">Ask us anything about our services</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-black'
                          : 'bg-gray-800 text-white'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-black/70' : 'text-gray-400'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleSend}
                  className="px-6 py-2 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-500 hover:to-amber-700 transition-all"
                >
                  Send
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Or call us: <a href="tel:0782914717" className="text-amber-400 hover:text-amber-300">0782914717</a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}














