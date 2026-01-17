'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

/**
 * EMMA - AI CHAT ASSISTANT FOR EMERSONEIMS
 *
 * A comprehensive AI assistant with detailed knowledge of all EmersonEIMS services.
 * Provides accurate, helpful information about:
 * - 9 Core Services
 * - 13,500+ Error Codes Database
 * - 1,247 Spare Parts Catalog
 * - Pricing Guidance
 * - Technical Support
 *
 * Features:
 * - Personalized conversations
 * - Comprehensive service knowledge
 * - AI-powered responses via Claude API
 * - Lead capture
 * - Quick WhatsApp/Call actions
 */

interface Message {
  id: string;
  text: string;
  sender: 'emma' | 'user';
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

// COMPREHENSIVE SERVICE KNOWLEDGE BASE
const SERVICE_KNOWLEDGE = {
  generators: {
    name: 'Generator Services',
    description: 'Complete generator solutions - sales, installation, repairs, and maintenance for industrial, commercial, and residential power systems.',
    brands: ['Cummins', 'Caterpillar', 'Perkins', 'FG Wilson', 'Kohler', 'SDMO', 'Volvo Penta', 'MTU', 'Deutz', 'John Deere', 'Generac', 'Doosan'],
    services: [
      'New generator sales (5kVA - 3000kVA)',
      'Generator installation & commissioning',
      'Preventive maintenance programs',
      'Emergency repair services (24/7)',
      'Load bank testing',
      'Transfer switch installation',
      'Control panel upgrades',
      'Generator rentals (short & long term)',
    ],
    errorCodes: '13,500+ error codes in our diagnostic database',
    responseTime: 'Within 2 hours in Nairobi, same-day across Kenya',
    warranty: '12-month warranty on all repairs',
  },
  solar: {
    name: 'Solar Power Systems',
    description: 'Professional solar installations for homes, businesses, and industries. From design to installation and maintenance.',
    services: [
      'Site assessment & system design',
      'Grid-tied solar systems',
      'Off-grid solar solutions',
      'Hybrid systems (solar + generator)',
      'Battery storage systems (LFP, NMC)',
      'Solar water pumping',
      'Solar street lighting',
      'Commercial & industrial solar',
    ],
    brands: ['Jinko Solar', 'Longi', 'Canadian Solar', 'Trina Solar', 'JA Solar'],
    inverterBrands: ['SMA', 'Fronius', 'Growatt', 'Victron', 'Deye'],
    warranty: '25-year panel performance warranty',
    financing: 'Flexible payment plans available',
  },
  'motor-rewinding': {
    name: 'Motor Rewinding',
    description: 'Expert motor rewinding and repair services for industrial motors, pumps, and electrical machines.',
    services: [
      'AC & DC motor rewinding',
      'Pump motor repairs',
      'Alternator rewinding',
      'Transformer repairs',
      'Bearing replacements',
      'Dynamic balancing',
      'Insulation testing',
      'VFD compatibility upgrades',
    ],
    capacity: 'Motors from 0.5HP to 500HP',
    turnaround: '24-72 hours for standard jobs',
    warranty: '12-month warranty on rewound motors',
  },
  'spare-parts': {
    name: 'Genuine Spare Parts',
    description: 'Comprehensive inventory of genuine and OEM-quality spare parts for all major generator brands.',
    partsCount: '1,247+ parts in our catalog',
    categories: [
      'Filters (oil, fuel, air)',
      'Belts & hoses',
      'Batteries & charging systems',
      'Fuel system components',
      'Cooling system parts',
      'Electrical components',
      'Engine parts',
      'Control panels & modules',
    ],
    delivery: 'Same-day delivery in Nairobi, next-day across Kenya',
    warranty: 'Genuine OEM parts with manufacturer warranty',
  },
  ups: {
    name: 'UPS Systems',
    description: 'Uninterruptible power supply solutions for critical equipment and data centers.',
    services: [
      'UPS sales & installation',
      'Battery replacements',
      'Preventive maintenance',
      'Load capacity upgrades',
      'Bypass systems',
      '24/7 monitoring solutions',
    ],
    brands: ['APC', 'Eaton', 'Vertiv', 'Riello', 'CyberPower'],
    capacity: 'From 1kVA desktop to 500kVA data center systems',
  },
  hvac: {
    name: 'HVAC & Air Conditioning',
    description: 'Heating, ventilation, and air conditioning solutions for commercial and industrial facilities.',
    services: [
      'AC system design & installation',
      'Chiller maintenance',
      'VRF/VRV systems',
      'Ducting installation',
      'Air quality solutions',
      'Refrigeration systems',
    ],
    brands: ['Daikin', 'Carrier', 'LG', 'Samsung', 'Mitsubishi Electric'],
  },
  borehole: {
    name: 'Borehole & Water Pumping',
    description: 'Complete water pumping solutions - borehole drilling, pump installation, and solar water pumping.',
    services: [
      'Borehole drilling',
      'Submersible pump installation',
      'Solar water pumping systems',
      'Water treatment systems',
      'Tank installation',
      'Pump repairs & maintenance',
    ],
    depth: 'Drilling up to 500m depth',
    pumpBrands: ['Grundfos', 'Pedrollo', 'Dayliff', 'Lorentz'],
  },
  incinerators: {
    name: 'Waste Incinerators',
    description: 'Medical, industrial, and municipal waste incineration solutions compliant with NEMA regulations.',
    services: [
      'Medical waste incinerators',
      'Industrial incinerators',
      'Cremation systems',
      'Emission control systems',
      'Ash handling systems',
    ],
    compliance: 'NEMA & WHO compliant systems',
    capacity: 'From 50kg/hr to 1000kg/hr',
  },
  fabrication: {
    name: 'Steel Fabrication',
    description: 'Custom steel fabrication for generator canopies, control panels, fuel tanks, and industrial structures.',
    services: [
      'Generator canopies & enclosures',
      'Control panel boxes',
      'Fuel tanks (diesel, petrol)',
      'Structural steelwork',
      'Platform & walkways',
      'Industrial equipment mounting',
    ],
    materials: 'Mild steel, stainless steel, aluminum',
    finishes: 'Powder coating, galvanizing, painting',
  },
};

const SERVICES_LIST = [
  { label: 'Generators', value: 'generators', icon: '⚡' },
  { label: 'Solar Systems', value: 'solar', icon: '☀️' },
  { label: 'Motor Rewinding', value: 'motor-rewinding', icon: '🔄' },
  { label: 'Spare Parts', value: 'spare-parts', icon: '🔩' },
  { label: 'UPS Systems', value: 'ups', icon: '🔋' },
  { label: 'HVAC/AC', value: 'hvac', icon: '❄️' },
  { label: 'Borehole/Pumping', value: 'borehole', icon: '💧' },
  { label: 'Incinerators', value: 'incinerators', icon: '🔥' },
  { label: 'Fabrication', value: 'fabrication', icon: '🏭' },
];

const LOCATIONS = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Machakos', 'Nyeri', 'Meru', 'Other'
];

export default function SallyAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [conversationStep, setConversationStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-open after 5 seconds on first visit
  useEffect(() => {
    const hasSeenEmma = localStorage.getItem('emma_seen');
    if (!hasSeenEmma) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sendEmmaMessage(
          "Hello! I'm Emma, your AI assistant at EmersonEIMS.\n\nI have detailed knowledge of all our 9 services, 13,500+ generator error codes, and 1,247 spare parts.\n\nWhat's your name?",
          []
        );
        localStorage.setItem('emma_seen', 'true');
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      const savedProfile = localStorage.getItem('emma_profile');
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

  const sendEmmaMessage = (text: string, options?: { label: string; action: string }[], delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      const message: Message = {
        id: Date.now().toString(),
        text,
        sender: 'emma',
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

  // Generate detailed service response
  const getServiceDetails = (serviceKey: string, userName: string): string => {
    const service = SERVICE_KNOWLEDGE[serviceKey as keyof typeof SERVICE_KNOWLEDGE];
    if (!service) {
      return `${userName}, I'd be happy to help with that! Let me connect you with our team for detailed information.`;
    }

    let response = `${userName}, here's detailed information about our ${service.name}:\n\n`;
    response += `${service.description}\n\n`;

    // Handle services array or categories array
    if ('services' in service && Array.isArray(service.services)) {
      response += `Our services include:\n`;
      service.services.forEach((s: string, i: number) => {
        response += `${i + 1}. ${s}\n`;
      });
    } else if ('categories' in service && Array.isArray(service.categories)) {
      response += `Available categories:\n`;
      service.categories.forEach((c: string, i: number) => {
        response += `${i + 1}. ${c}\n`;
      });
    }

    if ('brands' in service && Array.isArray(service.brands)) {
      response += `\nBrands we work with: ${service.brands.slice(0, 5).join(', ')}${service.brands.length > 5 ? ' and more' : ''}`;
    }

    if ('warranty' in service) {
      response += `\n\nWarranty: ${(service as { warranty: string }).warranty}`;
    }

    if ('errorCodes' in service) {
      response += `\n\nDiagnostic capability: ${(service as { errorCodes: string }).errorCodes}`;
    }

    if ('partsCount' in service) {
      response += `\n\nInventory: ${(service as { partsCount: string }).partsCount}`;
    }

    if ('delivery' in service) {
      response += `\n\nDelivery: ${(service as { delivery: string }).delivery}`;
    }

    return response;
  };

  const handleNameSubmit = (name: string) => {
    if (!name.trim()) return;

    sendUserMessage(name);
    const updatedProfile = { ...userProfile, name: name.trim() };
    setUserProfile(updatedProfile);
    localStorage.setItem('emma_profile', JSON.stringify(updatedProfile));

    sendEmmaMessage(
      `Great to meet you, ${name}!\n\nEmersonEIMS offers 9 comprehensive services:\n\n${SERVICES_LIST.map(s => `${s.icon} ${s.label}`).join('\n')}\n\nWhich service are you interested in?`,
      SERVICES_LIST.map(s => ({ label: `${s.icon} ${s.label}`, action: `interest:${s.value}` })),
      1500
    );
    setConversationStep(1);
  };

  const handleServiceSelect = (service: string) => {
    const selectedService = SERVICES_LIST.find(s => s.value === service);
    if (!selectedService) return;

    sendUserMessage(`${selectedService.icon} ${selectedService.label}`);
    const updatedProfile = { ...userProfile, interest: service };
    setUserProfile(updatedProfile);
    localStorage.setItem('emma_profile', JSON.stringify(updatedProfile));

    const name = userProfile.name || 'there';
    const detailedResponse = getServiceDetails(service, name);

    sendEmmaMessage(
      detailedResponse + '\n\nWhich county are you located in?',
      LOCATIONS.map(loc => ({ label: loc, action: `location:${loc}` })),
      1000
    );
    setConversationStep(2);
  };

  const handleLocationSelect = (location: string) => {
    sendUserMessage(location);
    const updatedProfile = { ...userProfile, location };
    setUserProfile(updatedProfile);
    localStorage.setItem('emma_profile', JSON.stringify(updatedProfile));

    const name = userProfile.name || 'there';
    const interest = userProfile.interest || '';

    let locationResponse = `Perfect, ${name}! We provide full service coverage in ${location}.\n\n`;

    if (location === 'Nairobi') {
      locationResponse += 'For Nairobi clients:\n- Emergency response within 2 hours\n- Same-day parts delivery\n- Free site assessments\n\n';
    } else {
      locationResponse += `For ${location} clients:\n- Same-day emergency response\n- Next-day parts delivery\n- Remote diagnostic support\n\n`;
    }

    locationResponse += 'How would you like to proceed?';

    sendEmmaMessage(
      locationResponse,
      [
        { label: '📞 Call Us Now', action: 'call' },
        { label: '💬 WhatsApp Chat', action: 'whatsapp' },
        { label: '📧 Request Free Quote', action: 'quote' },
        { label: '🔍 Learn More Services', action: 'explore' },
        { label: '🔧 Check Error Codes', action: 'diagnostic' },
      ],
      1000
    );
    setConversationStep(3);
  };

  // Handle AI-powered free-form questions
  const handleFreeFormQuestion = async (question: string) => {
    const name = userProfile.name || 'there';

    // Check for common questions and provide detailed answers
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('price') || lowerQuestion.includes('cost') || lowerQuestion.includes('how much')) {
      sendEmmaMessage(
        `${name}, pricing varies based on your specific requirements:\n\n` +
        `**Generator Services:**\n` +
        `- Service calls: From KSh 5,000\n` +
        `- Major repairs: Quote-based\n` +
        `- New generators: From KSh 150,000 (5kVA)\n\n` +
        `**Solar Systems:**\n` +
        `- 3kW residential: From KSh 350,000\n` +
        `- 10kW commercial: From KSh 1,200,000\n\n` +
        `For accurate pricing, I recommend getting a free quote. Our team will assess your needs and provide detailed pricing.`,
        [
          { label: '📧 Get Free Quote', action: 'quote' },
          { label: '📞 Call for Pricing', action: 'call' },
        ]
      );
    } else if (lowerQuestion.includes('emergency') || lowerQuestion.includes('urgent')) {
      sendEmmaMessage(
        `${name}, for EMERGENCIES, contact us immediately:\n\n` +
        `📞 Primary: +254-768-860-665\n` +
        `📞 Secondary: +254-782-914-717\n\n` +
        `**24/7 Emergency Services:**\n` +
        `- Generator breakdowns\n` +
        `- Power outages\n` +
        `- Urgent repairs\n\n` +
        `Response time: Within 2 hours in Nairobi, same-day across Kenya.`,
        [
          { label: '📞 Call Emergency Line', action: 'call' },
          { label: '💬 WhatsApp Urgent', action: 'whatsapp' },
        ]
      );
    } else if (lowerQuestion.includes('error') || lowerQuestion.includes('fault') || lowerQuestion.includes('code')) {
      sendEmmaMessage(
        `${name}, we have a comprehensive diagnostic database with 13,500+ error codes!\n\n` +
        `**Supported Brands:**\n` +
        `Cummins, Caterpillar, Perkins, DeepSea, PowerCommand, Volvo, MTU, Deutz, Kohler, Generac, and more.\n\n` +
        `**What you can do:**\n` +
        `1. Use our Fault Code Lookup tool\n` +
        `2. Get detailed solutions\n` +
        `3. Find required spare parts\n` +
        `4. See estimated repair costs\n\n` +
        `Would you like to look up an error code?`,
        [
          { label: '🔧 Fault Code Lookup', action: 'diagnostic' },
          { label: '📞 Speak to Technician', action: 'call' },
        ]
      );
    } else if (lowerQuestion.includes('parts') || lowerQuestion.includes('spare')) {
      sendEmmaMessage(
        `${name}, we stock 1,247+ genuine spare parts!\n\n` +
        `**Parts Categories:**\n` +
        `- Filters (oil, fuel, air, water)\n` +
        `- Belts, hoses & gaskets\n` +
        `- Electrical components\n` +
        `- Fuel system parts\n` +
        `- Cooling system parts\n` +
        `- Engine components\n` +
        `- Control modules\n\n` +
        `**Brands:** Cummins, Caterpillar, Perkins, Fleetguard, and more.\n\n` +
        `Delivery: Same-day in Nairobi, next-day across Kenya.`,
        [
          { label: '🔩 Browse Parts', action: 'parts' },
          { label: '📞 Order by Phone', action: 'call' },
        ]
      );
    } else {
      // Default detailed response
      sendEmmaMessage(
        `${name}, thanks for your question!\n\n` +
        `To give you the most accurate information, I recommend speaking with our technical team:\n\n` +
        `📞 Call: +254-768-860-665\n` +
        `💬 WhatsApp: +254-768-860-665\n` +
        `📧 Email: info@emersoneims.com\n\n` +
        `Or you can:\n` +
        `- Browse our services\n` +
        `- Check our diagnostic tools\n` +
        `- Request a free site assessment`,
        [
          { label: '📞 Call Now', action: 'call' },
          { label: '💬 WhatsApp', action: 'whatsapp' },
          { label: '🔍 Browse Services', action: 'explore' },
        ]
      );
    }
  };

  const handleAction = (action: string) => {
    if (action.startsWith('interest:')) {
      handleServiceSelect(action.replace('interest:', ''));
    } else if (action.startsWith('location:')) {
      handleLocationSelect(action.replace('location:', ''));
    } else {
      const name = userProfile.name || '';
      const interest = userProfile.interest || 'generator services';
      const location = userProfile.location || '';

      switch (action) {
        case 'call':
          sendUserMessage('📞 Call');
          window.location.href = 'tel:+254768860665';
          break;
        case 'whatsapp':
          sendUserMessage('💬 WhatsApp');
          const message = `Hi EmersonEIMS! I'm ${name} from ${location}. I'm interested in ${interest}. Can you help?`;
          window.open(`https://wa.me/254768860665?text=${encodeURIComponent(message)}`, '_blank');
          break;
        case 'quote':
          sendUserMessage('📧 Request Quote');
          window.location.href = '/contact';
          break;
        case 'explore':
          sendUserMessage('🔍 Explore Services');
          window.location.href = '/services';
          break;
        case 'diagnostic':
          sendUserMessage('🔧 Fault Code Lookup');
          window.location.href = '/fault-code-lookup';
          break;
        case 'parts':
          sendUserMessage('🔩 Spare Parts');
          window.location.href = '/spare-parts';
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
      handleFreeFormQuestion(userInput);
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
                const savedProfile = localStorage.getItem('emma_profile');
                if (savedProfile) {
                  const profile = JSON.parse(savedProfile);
                  sendEmmaMessage(
                    `Welcome back, ${profile.name}!\n\nI'm here to help with generators, solar, spare parts, and all our services.\n\nWhat can I assist you with today?`,
                    SERVICES_LIST.slice(0, 4).map(s => ({ label: `${s.icon} ${s.label}`, action: `interest:${s.value}` }))
                  );
                  setConversationStep(1);
                } else {
                  sendEmmaMessage(
                    "Hello! I'm Emma, your AI assistant at EmersonEIMS.\n\nI have detailed knowledge of all our 9 services, 13,500+ generator error codes, and 1,247 spare parts.\n\nWhat's your name?",
                    []
                  );
                }
              }
            }}
            className="fixed bottom-32 right-6 z-[9998] w-16 h-16 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white rounded-full shadow-2xl flex items-center justify-center group hover:scale-110 transition-transform"
            whileHover={{ rotate: 10 }}
            aria-label="Chat with Emma - AI Assistant"
          >
            {/* Emma Avatar */}
            <div className="relative">
              <span className="text-2xl">💬</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </div>

            {/* Tooltip */}
            <div className="absolute right-full mr-3 bg-black text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Chat with Emma
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
            <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xl">🤖</span>
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Emma</h3>
                  <p className="text-xs text-amber-100">EmersonEIMS AI Assistant</p>
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
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          message.sender === 'user'
                            ? 'bg-amber-600 text-white rounded-br-none'
                            : 'bg-white text-gray-800 shadow-sm rounded-bl-none border border-gray-100'
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
                                className="w-full text-left px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-medium rounded-lg transition-colors border border-amber-200"
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
                      <div className="bg-white text-gray-800 shadow-sm rounded-2xl rounded-bl-none px-4 py-3 border border-gray-100">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
                          : "Ask about services, pricing, parts..."
                      }
                      className="flex-1 px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm text-gray-800"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <Link
                      href="/fault-code-lookup"
                      className="flex-1 text-center px-3 py-2 bg-amber-100 text-amber-700 text-xs font-medium rounded-lg hover:bg-amber-200 transition-colors"
                    >
                      🔧 Diagnostics
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
