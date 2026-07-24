'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';

interface QuickInquiryFormProps {
  service?: string;
  ctaLabel?: string;
  onSuccess?: () => void;
}

export default function QuickInquiryForm({
  service = '',
  ctaLabel = 'Send Inquiry',
  onSuccess
}: QuickInquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    location: '',
    service: service || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Submit to contact API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: 'inquiry@emersoneims.com', // Backend gets real email
          company: formData.company,
          phone: formData.phone,
          location: formData.location,
          service: formData.service,
          message: `Quick inquiry: ${formData.service} in ${formData.location}`,
          source: 'quick-form'
        }),
      });

      if (!response.ok) throw new Error('Failed to submit');

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        setFormData({ name: '', company: '', phone: '', location: '', service });
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError('Failed to send. Please try calling +254 768 860 665');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-lg font-bold text-green-400 mb-2">Inquiry Received!</h3>
        <p className="text-gray-300 text-sm">We'll contact you within 2 hours (business hours)</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <input
          type="text"
          placeholder="Your name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none transition"
          required
        />
      </div>

      {/* Company */}
      <div>
        <input
          type="text"
          placeholder="Company / Organization"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none transition"
          required
        />
      </div>

      {/* Phone */}
      <div>
        <input
          type="tel"
          placeholder="+254 7XX XXX XXX"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none transition"
          required
        />
      </div>

      {/* Location */}
      <div>
        <input
          type="text"
          placeholder="County / City"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none transition"
          required
        />
      </div>

      {/* Service */}
      {!service && (
        <div>
          <input
            type="text"
            placeholder="Generator size or service type"
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none transition"
            required
          />
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-lg hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending...' : ctaLabel}
      </motion.button>
    </form>
  );
}
