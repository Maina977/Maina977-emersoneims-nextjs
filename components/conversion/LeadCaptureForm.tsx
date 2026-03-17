'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COUNTIES } from '@/lib/seo/kenyaLocations';

/**
 * LeadCaptureForm - High-Converting Lead Capture Form
 *
 * Features:
 * - Multi-step form for better completion rates
 * - Kenya counties dropdown
 * - Service selection
 * - Urgency level
 * - WhatsApp submission + local storage
 *
 * Phone: +254768860665
 */

const PHONE_NUMBER = '+254768860665';
const WHATSAPP_NUMBER = '254768860665';

const services = [
  { value: 'generators', label: 'Generators - Sales, Installation & Repair' },
  { value: 'solar', label: 'Solar Power Systems' },
  { value: 'ups', label: 'UPS & Power Backup' },
  { value: 'electrical', label: 'Electrical Services' },
  { value: 'motors', label: 'Motor Rewinding & Repair' },
  { value: 'borehole', label: 'Borehole & Water Pumps' },
  { value: 'ac', label: 'Air Conditioning & HVAC' },
  { value: 'spare-parts', label: 'Spare Parts Supply' },
  { value: 'emergency', label: 'Emergency Power Service' },
];

const urgencyLevels = [
  { value: 'urgent', label: 'Urgent - Need it NOW (24-48 hours)', color: 'text-red-500' },
  { value: 'soon', label: 'Soon - Within 1 week', color: 'text-orange-500' },
  { value: 'planning', label: 'Planning - Within 1 month', color: 'text-yellow-500' },
  { value: 'quote', label: 'Just need a quote', color: 'text-blue-500' },
];

interface FormData {
  name: string;
  phone: string;
  email: string;
  county: string;
  service: string;
  urgency: string;
  message: string;
}

interface LeadCaptureFormProps {
  title?: string;
  subtitle?: string;
  service?: string;
  location?: string;
  className?: string;
  onSubmit?: (data: FormData) => void;
}

export default function LeadCaptureForm({
  title = 'Get Your FREE Quote in 60 Seconds',
  subtitle = 'Fill out the form below and we\'ll call you back within 5 minutes!',
  service: defaultService = '',
  location: defaultLocation = '',
  className = '',
  onSubmit,
}: LeadCaptureFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    county: defaultLocation || '',
    service: defaultService || '',
    urgency: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateStep1 = () => {
    return formData.name.length >= 2 && formData.phone.length >= 9;
  };

  const validateStep2 = () => {
    return formData.county && formData.service;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Store lead locally
    const leads = JSON.parse(localStorage.getItem('emerson_leads') || '[]');
    const newLead = {
      ...formData,
      timestamp: new Date().toISOString(),
      source: window.location.href,
    };
    leads.push(newLead);
    localStorage.setItem('emerson_leads', JSON.stringify(leads));

    // Create WhatsApp message
    const urgencyLabel = urgencyLevels.find(u => u.value === formData.urgency)?.label || formData.urgency;
    const serviceLabel = services.find(s => s.value === formData.service)?.label || formData.service;

    const whatsappMessage = encodeURIComponent(
      `NEW LEAD FROM WEBSITE\n\n` +
      `Name: ${formData.name}\n` +
      `Phone: ${formData.phone}\n` +
      `Email: ${formData.email || 'Not provided'}\n` +
      `Location: ${formData.county}\n` +
      `Service: ${serviceLabel}\n` +
      `Urgency: ${urgencyLabel}\n` +
      `Message: ${formData.message || 'No additional message'}\n\n` +
      `Source: ${window.location.href}`
    );

    // Custom callback if provided
    if (onSubmit) {
      onSubmit(formData);
    }

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Open WhatsApp in new tab
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`, '_blank');
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-2xl p-8 text-center border border-green-500/30 ${className}`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-2">Thank You, {formData.name}!</h3>
        <p className="text-green-300 mb-6">
          Your request has been received. We'll call you within 5 minutes!
        </p>
        <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
          <p className="text-slate-300 text-sm">Can't wait? Call us directly:</p>
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="text-2xl font-bold text-amber-400 hover:text-amber-300"
          >
            {PHONE_NUMBER}
          </a>
        </div>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setStep(1);
            setFormData({
              name: '',
              phone: '',
              email: '',
              county: defaultLocation || '',
              service: defaultService || '',
              urgency: '',
              message: '',
            });
          }}
          className="text-slate-400 hover:text-white underline"
        >
          Submit another request
        </button>
      </motion.div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 border border-slate-700/50 ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h2>
        <p className="text-slate-400">{subtitle}</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 h-2 rounded-full overflow-hidden bg-slate-700">
            <motion.div
              className={`h-full ${s <= step ? 'bg-gradient-to-r from-amber-500 to-orange-500' : ''}`}
              initial={{ width: '0%' }}
              animate={{ width: s <= step ? '100%' : '0%' }}
              transition={{ duration: 0.3 }}
            />
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {/* Step 1: Contact Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Step 1: Your Contact Details</h3>

              <div>
                <label className="block text-slate-300 text-sm mb-1">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Kamau"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0712 345 678"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-1">Email (Optional)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@company.co.ke"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <motion.button
                type="button"
                onClick={() => validateStep1() && setStep(2)}
                disabled={!validateStep1()}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-amber-400 hover:to-orange-400 transition-all"
                whileHover={{ scale: validateStep1() ? 1.02 : 1 }}
                whileTap={{ scale: validateStep1() ? 0.98 : 1 }}
              >
                Continue
              </motion.button>
            </motion.div>
          )}

          {/* Step 2: Service Selection */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Step 2: Service & Location</h3>

              <div>
                <label className="block text-slate-300 text-sm mb-1">Your County *</label>
                <select
                  name="county"
                  value={formData.county}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  required
                >
                  <option value="">Select your county...</option>
                  {COUNTIES.map(county => (
                    <option key={county.slug} value={county.name}>
                      {county.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-1">Service Needed *</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  required
                >
                  <option value="">Select a service...</option>
                  {services.map(service => (
                    <option key={service.value} value={service.value}>
                      {service.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Back
                </button>
                <motion.button
                  type="button"
                  onClick={() => validateStep2() && setStep(3)}
                  disabled={!validateStep2()}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-amber-400 hover:to-orange-400 transition-all"
                  whileHover={{ scale: validateStep2() ? 1.02 : 1 }}
                  whileTap={{ scale: validateStep2() ? 0.98 : 1 }}
                >
                  Continue
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Urgency & Submit */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Step 3: How Urgent?</h3>

              <div className="grid grid-cols-1 gap-3">
                {urgencyLevels.map(level => (
                  <label
                    key={level.value}
                    className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer border-2 transition-all ${
                      formData.urgency === level.value
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-slate-600 hover:border-slate-500 bg-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={level.value}
                      checked={formData.urgency === level.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.urgency === level.value ? 'border-amber-500' : 'border-slate-500'
                    }`}>
                      {formData.urgency === level.value && (
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                      )}
                    </div>
                    <span className={`font-medium ${formData.urgency === level.value ? 'text-white' : 'text-slate-300'}`}>
                      {level.label}
                    </span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-1">Additional Details (Optional)</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your needs..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Back
                </button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !formData.urgency}
                  className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-400 hover:to-emerald-400 transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: !isSubmitting && formData.urgency ? 1.02 : 1 }}
                  whileTap={{ scale: !isSubmitting && formData.urgency ? 0.98 : 1 }}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Get My FREE Quote
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Quick Contact Alternative */}
      <div className="mt-6 pt-6 border-t border-slate-700 text-center">
        <p className="text-slate-400 text-sm mb-2">Prefer to talk? Call us now:</p>
        <a
          href={`tel:${PHONE_NUMBER}`}
          className="text-xl font-bold text-amber-400 hover:text-amber-300 transition-colors"
        >
          {PHONE_NUMBER}
        </a>
        <p className="text-slate-500 text-xs mt-1">Available 24/7 for emergencies</p>
      </div>
    </div>
  );
}
