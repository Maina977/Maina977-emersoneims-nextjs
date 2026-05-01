'use client';

/**
 * SOLAR INSTALLATION BOOKING
 * Book solar installation services with site assessment
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, MapPin, Phone, User, Home, Building2,
  Factory, Sun, Battery, Zap, CheckCircle, Clock,
  FileText, Camera, Wrench
} from 'lucide-react';

const INSTALLATION_TYPES = [
  { id: 'residential', name: 'Residential', icon: Home, description: '1-10 kW home systems', price: 'From KES 150,000' },
  { id: 'commercial', name: 'Commercial', icon: Building2, description: '10-100 kW business systems', price: 'From KES 1,500,000' },
  { id: 'industrial', name: 'Industrial', icon: Factory, description: '100+ kW large scale', price: 'Custom quote' },
];

const SERVICES = [
  { id: 'new-install', name: 'New Installation', description: 'Complete solar system installation' },
  { id: 'upgrade', name: 'System Upgrade', description: 'Add panels or batteries' },
  { id: 'repair', name: 'Repair & Service', description: 'Fix existing system issues' },
  { id: 'inspection', name: 'Site Assessment', description: 'Professional site survey' },
  { id: 'maintenance', name: 'Maintenance Plan', description: 'Regular maintenance service' },
];

const KENYA_COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi',
  'Kilifi', 'Machakos', 'Nyeri', 'Meru', 'Kakamega', 'Garissa', 'Kitale',
  'Naivasha', 'Nanyuki', 'Embu', 'Kericho', 'Bungoma', 'Other'
];

interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  location: string;
  county: string;
  installationType: string;
  service: string;
  systemSize: string;
  monthlyBill: string;
  roofType: string;
  preferredDate: string;
  additionalNotes: string;
}

export default function SolarInstallationBooking() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    phone: '',
    email: '',
    location: '',
    county: 'Nairobi',
    installationType: 'residential',
    service: 'new-install',
    systemSize: '',
    monthlyBill: '',
    roofType: '',
    preferredDate: '',
    additionalNotes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const updateForm = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Generate WhatsApp message
    const message = encodeURIComponent(
`*SOLAR INSTALLATION BOOKING*

*Customer Details:*
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}
Location: ${formData.location}, ${formData.county}

*Service Request:*
Type: ${INSTALLATION_TYPES.find(t => t.id === formData.installationType)?.name}
Service: ${SERVICES.find(s => s.id === formData.service)?.name}
System Size: ${formData.systemSize || 'To be determined'}
Monthly Bill: KES ${formData.monthlyBill || 'Not specified'}
Roof Type: ${formData.roofType || 'Not specified'}
Preferred Date: ${formData.preferredDate || 'Flexible'}

*Additional Notes:*
${formData.additionalNotes || 'None'}

Please schedule a site assessment.`
    );

    window.open(`https://wa.me/254768860665?text=${message}`, '_blank');
    setSubmitted(true);
  };

  const canProceed = () => {
    if (step === 1) return formData.name && formData.phone;
    if (step === 2) return formData.location && formData.county;
    if (step === 3) return formData.installationType && formData.service;
    return true;
  };

  if (submitted) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-green-500" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Booking Submitted!</h2>
        <p className="text-slate-400 mb-6">
          Our team will contact you within 24 hours to confirm your site assessment.
        </p>
        <div className="bg-slate-900 rounded-xl p-4 mb-6">
          <p className="text-slate-300 text-sm">
            <strong>What happens next:</strong>
          </p>
          <ul className="text-left text-slate-400 text-sm mt-2 space-y-1">
            <li>1. Our team reviews your request</li>
            <li>2. We contact you to confirm date & time</li>
            <li>3. Technician visits for site assessment</li>
            <li>4. You receive detailed quote within 48 hours</li>
          </ul>
        </div>
        <button
          onClick={() => {
            setSubmitted(false);
            setStep(1);
            setFormData({
              name: '', phone: '', email: '', location: '', county: 'Nairobi',
              installationType: 'residential', service: 'new-install', systemSize: '',
              monthlyBill: '', roofType: '', preferredDate: '', additionalNotes: '',
            });
          }}
          className="px-6 py-3 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors"
        >
          Book Another Service
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
        <Calendar className="w-7 h-7 text-amber-400" />
        Book Solar Installation
      </h2>
      <p className="text-slate-400 mb-6">Schedule a free site assessment with our certified technicians</p>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              s < step ? 'bg-green-500 text-white' :
              s === step ? 'bg-amber-500 text-white' :
              'bg-slate-700 text-slate-400'
            }`}>
              {s < step ? <CheckCircle className="w-5 h-5" /> : s}
            </div>
            {s < 4 && (
              <div className={`w-16 md:w-24 h-1 mx-2 ${
                s < step ? 'bg-green-500' : 'bg-slate-700'
              }`} />
            )}
          </div>
        ))}
      </div>

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
            <h3 className="text-lg font-semibold text-white mb-4">Your Contact Information</h3>

            <div>
              <label className="block text-slate-300 text-sm mb-2">Full Name *</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  placeholder="John Kamau"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-2">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  placeholder="0712 345 678"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-2">Email (Optional)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateForm('email', e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                placeholder="john@example.com"
              />
            </div>
          </motion.div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Installation Location</h3>

            <div>
              <label className="block text-slate-300 text-sm mb-2">County *</label>
              <select
                value={formData.county}
                onChange={(e) => updateForm('county', e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              >
                {KENYA_COUNTIES.map(county => (
                  <option key={county} value={county}>{county}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-2">Specific Location / Address *</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3 w-5 h-5 text-slate-500" />
                <textarea
                  value={formData.location}
                  onChange={(e) => updateForm('location', e.target.value)}
                  rows={3}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-amber-500 focus:outline-none resize-none"
                  placeholder="e.g., Westlands, Sarit Centre area, Building name..."
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Service Type */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Installation Type</h3>

            <div className="grid md:grid-cols-3 gap-3">
              {INSTALLATION_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => updateForm('installationType', type.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    formData.installationType === type.id
                      ? 'bg-amber-500/20 border-amber-500 text-white'
                      : 'bg-slate-900 border-slate-600 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <type.icon className={`w-8 h-8 mb-2 ${
                    formData.installationType === type.id ? 'text-amber-400' : 'text-slate-500'
                  }`} />
                  <p className="font-semibold">{type.name}</p>
                  <p className="text-sm text-slate-400">{type.description}</p>
                  <p className="text-sm text-amber-400 mt-1">{type.price}</p>
                </button>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-white mt-6 mb-4">Service Required</h3>

            <div className="grid md:grid-cols-2 gap-3">
              {SERVICES.map((service) => (
                <button
                  key={service.id}
                  onClick={() => updateForm('service', service.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    formData.service === service.id
                      ? 'bg-amber-500/20 border-amber-500 text-white'
                      : 'bg-slate-900 border-slate-600 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <p className="font-semibold">{service.name}</p>
                  <p className="text-sm text-slate-400">{service.description}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 4: Additional Details */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Additional Details</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-sm mb-2">Estimated System Size</label>
                <select
                  value={formData.systemSize}
                  onChange={(e) => updateForm('systemSize', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="">Not sure</option>
                  <option value="1-3 kW">1-3 kW (Small home)</option>
                  <option value="3-5 kW">3-5 kW (Medium home)</option>
                  <option value="5-10 kW">5-10 kW (Large home)</option>
                  <option value="10-30 kW">10-30 kW (Small business)</option>
                  <option value="30-100 kW">30-100 kW (Commercial)</option>
                  <option value="100+ kW">100+ kW (Industrial)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-2">Monthly Electricity Bill (KES)</label>
                <input
                  type="number"
                  value={formData.monthlyBill}
                  onChange={(e) => updateForm('monthlyBill', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  placeholder="e.g., 15000"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-2">Roof Type</label>
                <select
                  value={formData.roofType}
                  onChange={(e) => updateForm('roofType', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="">Select roof type</option>
                  <option value="Iron Sheet">Iron Sheet (Mabati)</option>
                  <option value="Tile">Concrete/Clay Tile</option>
                  <option value="Flat Concrete">Flat Concrete</option>
                  <option value="Ground Mount">Ground Mount</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-2">Preferred Assessment Date</label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => updateForm('preferredDate', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-2">Additional Notes</label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => updateForm('additionalNotes', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-amber-500 focus:outline-none resize-none"
                placeholder="Any specific requirements or questions..."
              />
            </div>

            {/* Summary */}
            <div className="bg-slate-900 rounded-xl p-4 mt-4">
              <h4 className="font-semibold text-white mb-3">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Name:</span>
                  <span className="text-white">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="text-white">{formData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-white">{formData.county}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Type:</span>
                  <span className="text-white">{INSTALLATION_TYPES.find(t => t.id === formData.installationType)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Service:</span>
                  <span className="text-white">{SERVICES.find(s => s.id === formData.service)?.name}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          className={`px-6 py-3 rounded-xl font-medium transition-colors ${
            step === 1
              ? 'text-slate-600 cursor-not-allowed'
              : 'bg-slate-700 text-white hover:bg-slate-600'
          }`}
          disabled={step === 1}
        >
          Back
        </button>

        {step < 4 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              canProceed()
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            Next Step
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors"
          >
            Submit Booking
          </button>
        )}
      </div>
    </div>
  );
}
