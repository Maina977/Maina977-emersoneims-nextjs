'use client';

import { useState } from 'react';
import { Phone, MessageCircle, Mail, Clock, MapPin } from 'lucide-react';

interface QuickContactProps {
  location?: string;
  service?: string;
  showForm?: boolean;
}

export default function QuickContact({ location, service, showForm = false }: QuickContactProps) {
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Company contact details
  const COMPANY_PHONE = '+254720123456';
  const COMPANY_WHATSAPP = '254720123456';
  const COMPANY_EMAIL = 'info@emersoneims.com';

  // Pre-fill message for WhatsApp
  const getWhatsAppMessage = () => {
    let message = 'Hi EmersonEIMS, I need assistance';
    if (service) message += ` with ${service}`;
    if (location) message += ` in ${location}`;
    message += '. Please contact me.';
    return encodeURIComponent(message);
  };

  // Handle quick callback request
  const handleCallbackRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setIsSubmitting(true);

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Quick Callback Request',
          email: 'callback@request.local',
          phone,
          message: `Quick callback request${location ? ` from ${location}` : ''}${service ? ` for ${service}` : ''}`,
          service: service || 'general',
          source: 'quick_callback',
          location,
        }),
      });

      setSubmitted(true);
      setPhone('');
      setTimeout(() => {
        setSubmitted(false);
        setShowCallbackForm(false);
      }, 5000);
    } catch (error) {
      console.error('Callback request failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-amber-500/30 rounded-2xl p-6 shadow-lg">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-1">
          {location ? `Contact Us in ${location}` : 'Get Expert Help Now'}
        </h3>
        <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
          <Clock className="w-4 h-4" />
          Response within 2 hours
        </p>
      </div>

      {/* Direct Contact Buttons */}
      <div className="space-y-3 mb-4">
        {/* Call Button */}
        <a
          href={`tel:${COMPANY_PHONE}`}
          className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl hover:from-green-500 hover:to-green-400 transition-all duration-300 shadow-lg hover:shadow-green-500/30"
        >
          <Phone className="w-5 h-5" />
          Call Now: {COMPANY_PHONE}
        </a>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${COMPANY_WHATSAPP}?text=${getWhatsAppMessage()}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold rounded-xl hover:from-[#22c55e] hover:to-[#16a34a] transition-all duration-300 shadow-lg hover:shadow-green-500/30"
        >
          <MessageCircle className="w-5 h-5" />
          WhatsApp Us
        </a>

        {/* Email Button */}
        <a
          href={`mailto:${COMPANY_EMAIL}?subject=${encodeURIComponent(`Inquiry${service ? ` - ${service}` : ''}${location ? ` from ${location}` : ''}`)}`}
          className="flex items-center justify-center gap-3 w-full py-3 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-700 transition-all duration-300 border border-gray-700"
        >
          <Mail className="w-5 h-5" />
          Email Us
        </a>
      </div>

      {/* Quick Callback Form */}
      {showForm && (
        <div className="border-t border-gray-700 pt-4 mt-4">
          {!showCallbackForm ? (
            <button
              onClick={() => setShowCallbackForm(true)}
              className="w-full py-3 text-amber-500 font-medium hover:text-amber-400 transition-colors"
            >
              Or request a callback →
            </button>
          ) : submitted ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <p className="text-green-400 font-medium">We&apos;ll call you shortly!</p>
            </div>
          ) : (
            <form onSubmit={handleCallbackRequest} className="space-y-3">
              <p className="text-sm text-gray-400">Enter your number and we&apos;ll call you:</p>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+254 7XX XXX XXX"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Requesting...' : 'Request Callback'}
              </button>
              <button
                type="button"
                onClick={() => setShowCallbackForm(false)}
                className="w-full py-2 text-gray-500 text-sm hover:text-gray-400"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      )}

      {/* Location Badge */}
      {location && (
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-400">
          <MapPin className="w-4 h-4 text-amber-500" />
          Serving {location} and surrounding areas
        </div>
      )}
    </div>
  );
}
