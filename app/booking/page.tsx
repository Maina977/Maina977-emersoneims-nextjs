'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Service types available for booking
const SERVICE_TYPES = [
  { id: 'consultation', label: 'Free Consultation', icon: '💼', duration: '30 min', description: 'Discuss your power needs with our experts' },
  { id: 'site-survey', label: 'Site Survey', icon: '📍', duration: '1-2 hours', description: 'On-site assessment for installation' },
  { id: 'generator-service', label: 'Generator Service', icon: '🔧', duration: '2-4 hours', description: 'Scheduled maintenance or repair' },
  { id: 'solar-assessment', label: 'Solar Assessment', icon: '☀️', duration: '1-2 hours', description: 'Evaluate your property for solar installation' },
  { id: 'emergency', label: 'Emergency Repair', icon: '🚨', duration: 'ASAP', description: '24/7 emergency callout service' },
  { id: 'ups-service', label: 'UPS Service', icon: '🔋', duration: '1-2 hours', description: 'UPS maintenance or battery replacement' },
];

// Available time slots
const TIME_SLOTS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

// Kenya counties for dropdown
const KENYA_COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Kiambu', 'Machakos', 
  'Kajiado', 'Nyeri', 'Meru', 'Kilifi', 'Kwale', 'Garissa', 'Kitui',
  'Kakamega', 'Bungoma', 'Uasin Gishu', 'Trans Nzoia', 'Narok', 'Laikipia',
  'Nyandarua', 'Murang\'a', 'Kirinyaga', 'Embu', 'Tharaka Nithi', 'Isiolo',
  'Marsabit', 'Wajir', 'Mandera', 'Turkana', 'West Pokot', 'Samburu',
  'Baringo', 'Elgeyo Marakwet', 'Nandi', 'Bomet', 'Kericho', 'Kisii',
  'Nyamira', 'Migori', 'Homa Bay', 'Siaya', 'Vihiga', 'Busia', 'Lamu',
  'Tana River', 'Taita Taveta'
].sort();

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceType: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    county: '',
    location: '',
    date: '',
    time: '',
    equipmentType: '',
    equipmentBrand: '',
    equipmentKVA: '',
    problemDescription: '',
    preferredContact: 'phone',
    urgency: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedService = SERVICE_TYPES.find(s => s.id === formData.serviceType);

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Get maximum date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In production, this would send to your backend/email service
    console.log('Booking submitted:', formData);
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.serviceType !== '';
      case 2: return formData.name && formData.phone && formData.county;
      case 3: return formData.date && formData.time;
      case 4: return true;
      default: return false;
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center"
        >
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-white mb-4">Booking Confirmed!</h1>
          <p className="text-gray-300 mb-6">
            Thank you, {formData.name}! We've received your booking request for{' '}
            <span className="text-orange-400 font-semibold">{selectedService?.label}</span>.
          </p>
          
          <div className="bg-white/10 rounded-xl p-6 mb-6 text-left">
            <h3 className="font-semibold text-white mb-4">Booking Details:</h3>
            <div className="space-y-2 text-gray-300">
              <p><span className="text-gray-500">Service:</span> {selectedService?.label}</p>
              <p><span className="text-gray-500">Date:</span> {formData.date}</p>
              <p><span className="text-gray-500">Time:</span> {formData.time}</p>
              <p><span className="text-gray-500">Location:</span> {formData.county}</p>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
            <p className="text-green-400 font-medium">
              📞 Our team will contact you within 2 hours to confirm your appointment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-colors"
            >
              Back to Home
            </Link>
            <a
              href={`https://wa.me/254768860655?text=Hi! I just submitted a booking for ${selectedService?.label} on ${formData.date} at ${formData.time}. My name is ${formData.name}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-colors"
            >
              💬 WhatsApp Confirmation
            </a>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              📅 Book a Service
            </h1>
            <p className="text-xl text-gray-300">
              Schedule your consultation, service, or site visit online
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-4">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex justify-between items-center">
            {[
              { num: 1, label: 'Service' },
              { num: 2, label: 'Details' },
              { num: 3, label: 'Schedule' },
              { num: 4, label: 'Confirm' }
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className={`flex flex-col items-center ${i < 3 ? 'flex-1' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= s.num 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white/10 text-gray-500'
                  }`}>
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span className={`text-xs mt-2 ${step >= s.num ? 'text-blue-400' : 'text-gray-500'}`}>
                    {s.label}
                  </span>
                </div>
                {i < 3 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${
                    step > s.num ? 'bg-blue-500' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Content */}
      <section className="py-8 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8"
          >
            {/* Step 1: Service Selection */}
            {step === 1 && (
              <>
                <h2 className="text-2xl font-bold text-white mb-6">What service do you need?</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {SERVICE_TYPES.map(service => (
                    <button
                      key={service.id}
                      onClick={() => updateForm('serviceType', service.id)}
                      className={`p-6 rounded-xl text-left transition-all border ${
                        formData.serviceType === service.id
                          ? 'bg-blue-500/20 border-blue-500'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="text-3xl mb-2">{service.icon}</div>
                      <div className="font-semibold text-white">{service.label}</div>
                      <div className="text-sm text-gray-400">{service.description}</div>
                      <div className="text-xs text-blue-400 mt-2">⏱️ {service.duration}</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Step 2: Contact Details */}
            {step === 2 && (
              <>
                <h2 className="text-2xl font-bold text-white mb-6">Your Contact Details</h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateForm('name', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateForm('phone', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0712 345 678"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateForm('email', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Company (Optional)</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => updateForm('company', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your company name"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">County *</label>
                      <select
                        value={formData.county}
                        onChange={(e) => updateForm('county', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="" className="bg-gray-800">Select county</option>
                        {KENYA_COUNTIES.map(county => (
                          <option key={county} value={county} className="bg-gray-800">{county}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Specific Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => updateForm('location', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Building, Street, Area"
                      />
                    </div>
                  </div>

                  {/* Equipment Details for service bookings */}
                  {['generator-service', 'emergency', 'ups-service'].includes(formData.serviceType) && (
                    <div className="border-t border-white/10 pt-4 mt-4">
                      <h3 className="text-lg font-semibold text-white mb-4">Equipment Details</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Equipment Type</label>
                          <select
                            value={formData.equipmentType}
                            onChange={(e) => updateForm('equipmentType', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="" className="bg-gray-800">Select type</option>
                            <option value="generator" className="bg-gray-800">Generator</option>
                            <option value="ups" className="bg-gray-800">UPS</option>
                            <option value="ats" className="bg-gray-800">ATS</option>
                            <option value="other" className="bg-gray-800">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Brand</label>
                          <input
                            type="text"
                            value={formData.equipmentBrand}
                            onChange={(e) => updateForm('equipmentBrand', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Cummins"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Size (kVA)</label>
                          <input
                            type="text"
                            value={formData.equipmentKVA}
                            onChange={(e) => updateForm('equipmentKVA', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 100"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Step 3: Schedule */}
            {step === 3 && (
              <>
                <h2 className="text-2xl font-bold text-white mb-6">Choose Date & Time</h2>
                
                {formData.serviceType === 'emergency' && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                    <p className="text-red-400 font-medium">
                      🚨 For emergencies, we recommend calling us directly at{' '}
                      <a href="tel:+254768860665" className="underline">+254768860665</a>{' '}
                      for fastest response.
                    </p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Preferred Date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => updateForm('date', e.target.value)}
                      min={minDate}
                      max={maxDateStr}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Preferred Time *</label>
                    <select
                      value={formData.time}
                      onChange={(e) => updateForm('time', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="" className="bg-gray-800">Select time</option>
                      {TIME_SLOTS.map(slot => (
                        <option key={slot} value={slot} className="bg-gray-800">{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm text-gray-400 mb-2">Urgency Level</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'normal', label: 'Normal', desc: 'Within a week' },
                      { id: 'soon', label: 'Soon', desc: 'Within 2-3 days' },
                      { id: 'urgent', label: 'Urgent', desc: 'ASAP' }
                    ].map(u => (
                      <button
                        key={u.id}
                        onClick={() => updateForm('urgency', u.id)}
                        className={`p-4 rounded-xl text-center transition-all border ${
                          formData.urgency === u.id
                            ? 'bg-blue-500/20 border-blue-500'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="font-semibold text-white">{u.label}</div>
                        <div className="text-xs text-gray-400">{u.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm text-gray-400 mb-2">Problem Description (Optional)</label>
                  <textarea
                    value={formData.problemDescription}
                    onChange={(e) => updateForm('problemDescription', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Describe the issue or what you need help with..."
                  />
                </div>
              </>
            )}

            {/* Step 4: Confirm */}
            {step === 4 && (
              <>
                <h2 className="text-2xl font-bold text-white mb-6">Confirm Your Booking</h2>
                
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-xl p-6">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="text-2xl">{selectedService?.icon}</span>
                      {selectedService?.label}
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span>
                        <span className="text-white ml-2">{formData.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <span className="text-white ml-2">{formData.phone}</span>
                      </div>
                      {formData.email && (
                        <div>
                          <span className="text-gray-500">Email:</span>
                          <span className="text-white ml-2">{formData.email}</span>
                        </div>
                      )}
                      {formData.company && (
                        <div>
                          <span className="text-gray-500">Company:</span>
                          <span className="text-white ml-2">{formData.company}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500">Location:</span>
                        <span className="text-white ml-2">{formData.county}{formData.location ? `, ${formData.location}` : ''}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Date:</span>
                        <span className="text-white ml-2">{formData.date}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Time:</span>
                        <span className="text-white ml-2">{formData.time}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Urgency:</span>
                        <span className="text-white ml-2 capitalize">{formData.urgency}</span>
                      </div>
                    </div>

                    {formData.problemDescription && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <span className="text-gray-500 text-sm">Description:</span>
                        <p className="text-white mt-1">{formData.problemDescription}</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <p className="text-blue-400 text-sm">
                      ✓ By submitting, you agree to be contacted by EmersonEIMS regarding this booking.
                      <br />
                      ✓ We will confirm your appointment within 2 business hours.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
              <button
                onClick={() => setStep(s => s - 1)}
                disabled={step === 1}
                className="px-6 py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Back
              </button>
              
              {step < 4 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={!canProceed()}
                  className="px-8 py-3 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-green-500 text-white font-bold rounded-full hover:bg-green-600 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      ✓ Confirm Booking
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>

          {/* Quick Contact */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 mb-4">Prefer to talk to someone directly?</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+254768860665"
                className="px-6 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
              >
                📞 +254768860665
              </a>
              <a
                href="https://wa.me/254768860655"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
