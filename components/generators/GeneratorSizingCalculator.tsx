'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator, Zap, Home, Building2, Factory, Hotel,
  Hospital, GraduationCap, Church, Warehouse, Phone,
  MessageCircle, CheckCircle, ArrowRight, Lightbulb,
  AirVent, Refrigerator, Tv, Computer, Droplets
} from 'lucide-react';

/**
 * GENERATOR SIZING CALCULATOR - LEAD MAGNET
 *
 * People searching "what size generator do I need" = BUYERS
 * This calculator:
 * 1. Helps them find the right size
 * 2. Captures their contact info
 * 3. Triggers immediate sales follow-up
 */

interface Appliance {
  id: string;
  name: string;
  watts: number;
  startupMultiplier: number;
  icon: React.ReactNode;
  category: string;
}

const COMMON_APPLIANCES: Appliance[] = [
  // Lighting
  { id: 'bulbs', name: 'LED Bulbs (10)', watts: 100, startupMultiplier: 1, icon: <Lightbulb className="w-4 h-4" />, category: 'Lighting' },
  { id: 'floodlights', name: 'Flood Lights (4)', watts: 400, startupMultiplier: 1, icon: <Lightbulb className="w-4 h-4" />, category: 'Lighting' },

  // Cooling
  { id: 'ac1', name: 'AC Unit (1HP)', watts: 1000, startupMultiplier: 3, icon: <AirVent className="w-4 h-4" />, category: 'Cooling' },
  { id: 'ac2', name: 'AC Unit (2HP)', watts: 2000, startupMultiplier: 3, icon: <AirVent className="w-4 h-4" />, category: 'Cooling' },
  { id: 'fans', name: 'Ceiling Fans (5)', watts: 350, startupMultiplier: 1.5, icon: <AirVent className="w-4 h-4" />, category: 'Cooling' },

  // Kitchen
  { id: 'fridge', name: 'Refrigerator', watts: 200, startupMultiplier: 3, icon: <Refrigerator className="w-4 h-4" />, category: 'Kitchen' },
  { id: 'freezer', name: 'Deep Freezer', watts: 300, startupMultiplier: 3, icon: <Refrigerator className="w-4 h-4" />, category: 'Kitchen' },
  { id: 'microwave', name: 'Microwave', watts: 1200, startupMultiplier: 1, icon: <Refrigerator className="w-4 h-4" />, category: 'Kitchen' },

  // Electronics
  { id: 'tv', name: 'TV (55")', watts: 150, startupMultiplier: 1, icon: <Tv className="w-4 h-4" />, category: 'Electronics' },
  { id: 'computer', name: 'Desktop Computer', watts: 300, startupMultiplier: 1, icon: <Computer className="w-4 h-4" />, category: 'Electronics' },
  { id: 'laptop', name: 'Laptops (5)', watts: 250, startupMultiplier: 1, icon: <Computer className="w-4 h-4" />, category: 'Electronics' },

  // Water
  { id: 'pump1', name: 'Water Pump (1HP)', watts: 750, startupMultiplier: 3, icon: <Droplets className="w-4 h-4" />, category: 'Water' },
  { id: 'pump2', name: 'Borehole Pump (3HP)', watts: 2200, startupMultiplier: 3, icon: <Droplets className="w-4 h-4" />, category: 'Water' },
  { id: 'heater', name: 'Water Heater', watts: 3000, startupMultiplier: 1, icon: <Droplets className="w-4 h-4" />, category: 'Water' },

  // Industrial
  { id: 'welder', name: 'Welding Machine', watts: 5000, startupMultiplier: 2, icon: <Zap className="w-4 h-4" />, category: 'Industrial' },
  { id: 'compressor', name: 'Air Compressor', watts: 3000, startupMultiplier: 3, icon: <Zap className="w-4 h-4" />, category: 'Industrial' },
];

const PROPERTY_TYPES = [
  { id: 'home', name: 'Home', icon: <Home className="w-6 h-6" />, baseKVA: 10 },
  { id: 'apartment', name: 'Apartment', icon: <Building2 className="w-6 h-6" />, baseKVA: 15 },
  { id: 'office', name: 'Office', icon: <Building2 className="w-6 h-6" />, baseKVA: 30 },
  { id: 'hotel', name: 'Hotel', icon: <Hotel className="w-6 h-6" />, baseKVA: 100 },
  { id: 'hospital', name: 'Hospital', icon: <Hospital className="w-6 h-6" />, baseKVA: 200 },
  { id: 'school', name: 'School', icon: <GraduationCap className="w-6 h-6" />, baseKVA: 60 },
  { id: 'church', name: 'Church', icon: <Church className="w-6 h-6" />, baseKVA: 40 },
  { id: 'factory', name: 'Factory', icon: <Factory className="w-6 h-6" />, baseKVA: 150 },
  { id: 'warehouse', name: 'Warehouse', icon: <Warehouse className="w-6 h-6" />, baseKVA: 80 },
];

export default function GeneratorSizingCalculator() {
  const [step, setStep] = useState(1);
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([]);
  const [customWatts, setCustomWatts] = useState(0);
  const [result, setResult] = useState<{ kva: number; recommendation: string } | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const COMPANY_PHONE = '+254768860665';
  const COMPANY_WHATSAPP = '254768860665';

  const calculateSize = useCallback(() => {
    // Calculate total watts from selected appliances
    let totalRunning = 0;
    let maxStartup = 0;

    selectedAppliances.forEach(id => {
      const appliance = COMMON_APPLIANCES.find(a => a.id === id);
      if (appliance) {
        totalRunning += appliance.watts;
        const startupWatts = appliance.watts * appliance.startupMultiplier;
        if (startupWatts > maxStartup) maxStartup = startupWatts;
      }
    });

    totalRunning += customWatts;

    // Add 25% safety margin
    const totalWithMargin = (totalRunning + maxStartup) * 1.25;

    // Convert to KVA (assuming 0.8 power factor)
    let kva = Math.ceil(totalWithMargin / 800);

    // Round up to nearest standard size
    const standardSizes = [5, 10, 15, 20, 25, 30, 40, 50, 60, 80, 100, 125, 150, 200, 250, 300, 400, 500];
    kva = standardSizes.find(size => size >= kva) || 500;

    let recommendation = '';
    if (kva <= 15) recommendation = 'Perfect for home backup or small office';
    else if (kva <= 30) recommendation = 'Ideal for medium office or apartment building';
    else if (kva <= 60) recommendation = 'Great for schools, churches, or small hotels';
    else if (kva <= 100) recommendation = 'Suitable for hotels, hospitals, or medium factories';
    else recommendation = 'Industrial grade for large facilities';

    setResult({ kva, recommendation });
    setStep(3);
  }, [selectedAppliances, customWatts]);

  const handleSubmitLead = async () => {
    if (!phone) return;

    setIsSubmitting(true);

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || 'Generator Calculator Lead',
          email: 'calculator@lead.local',
          phone,
          message: `Generator sizing inquiry: ${result?.kva}KVA recommended for ${propertyType}. Appliances: ${selectedAppliances.join(', ')}. Additional load: ${customWatts}W`,
          service: 'generators',
          source: 'generator_calculator',
        }),
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAppliance = (id: string) => {
    setSelectedAppliances(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-cyan-500/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Generator Size Calculator</h3>
            <p className="text-cyan-100 text-sm">Find the perfect generator for your needs</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mt-4">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-white' : 'bg-white/30'}`}
            />
          ))}
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Property Type */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">What type of property?</h4>
              <div className="grid grid-cols-3 gap-3">
                {PROPERTY_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setPropertyType(type.id);
                      setStep(2);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      propertyType === type.id
                        ? 'border-cyan-500 bg-cyan-500/20'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-cyan-500 mb-2 flex justify-center">{type.icon}</div>
                    <span className="text-sm text-white">{type.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Appliances */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">Select your appliances</h4>

              <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
                {COMMON_APPLIANCES.map(appliance => (
                  <button
                    key={appliance.id}
                    onClick={() => toggleAppliance(appliance.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      selectedAppliances.includes(appliance.id)
                        ? 'border-cyan-500 bg-cyan-500/20'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className={`${selectedAppliances.includes(appliance.id) ? 'text-cyan-500' : 'text-gray-400'}`}>
                      {appliance.icon}
                    </div>
                    <span className="text-white text-sm flex-1 text-left">{appliance.name}</span>
                    <span className="text-gray-400 text-xs">{appliance.watts}W</span>
                    {selectedAppliances.includes(appliance.id) && (
                      <CheckCircle className="w-4 h-4 text-cyan-500" />
                    )}
                  </button>
                ))}
              </div>

              {/* Additional Load */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Additional load (watts)</label>
                <input
                  type="number"
                  value={customWatts || ''}
                  onChange={(e) => setCustomWatts(Number(e.target.value) || 0)}
                  placeholder="e.g., 5000"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-3 text-gray-400 hover:text-white"
                >
                  Back
                </button>
                <button
                  onClick={calculateSize}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-cyan-600 text-white font-semibold rounded-xl hover:bg-cyan-500"
                >
                  Calculate Size
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Results */}
          {step === 3 && result && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Zap className="w-10 h-10 text-cyan-500" />
              </div>

              <h4 className="text-lg text-gray-400 mb-2">You need a</h4>
              <div className="text-5xl font-bold text-white mb-2">
                {result.kva} <span className="text-cyan-500">KVA</span>
              </div>
              <p className="text-gray-400 mb-6">{result.recommendation}</p>

              {!showLeadForm && !submitted ? (
                <>
                  {/* CTA Buttons */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <a
                      href={`tel:${COMPANY_PHONE}`}
                      className="flex items-center justify-center gap-2 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500"
                    >
                      <Phone className="w-5 h-5" />
                      Call for Price
                    </a>
                    <a
                      href={`https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(`Hi! I used your calculator and need a ${result.kva}KVA generator for my ${propertyType}. What's the price?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#22c55e]"
                    >
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp
                    </a>
                  </div>

                  <button
                    onClick={() => setShowLeadForm(true)}
                    className="text-cyan-500 text-sm hover:underline"
                  >
                    Or request a callback
                  </button>
                </>
              ) : submitted ? (
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-green-400 font-medium">We'll call you shortly!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your phone number"
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                  <button
                    onClick={handleSubmitLead}
                    disabled={isSubmitting || !phone}
                    className="w-full py-3 bg-cyan-600 text-white font-semibold rounded-xl hover:bg-cyan-500 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Get Quote & Callback'}
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  setStep(1);
                  setResult(null);
                  setSelectedAppliances([]);
                  setShowLeadForm(false);
                  setSubmitted(false);
                }}
                className="mt-4 text-gray-500 text-sm hover:text-gray-400"
              >
                Calculate again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
