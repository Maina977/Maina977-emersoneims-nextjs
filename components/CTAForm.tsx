'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CTAForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    service: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        service: 'general'
      });
      
      // Reset success state after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Input styling
  const inputStyles = "w-full px-5 py-4 bg-black/60 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 focus:bg-black/80 focus:shadow-[0_0_20px_rgba(251,191,36,0.1)] transition-all duration-300";

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 px-8 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-black/40 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center"
        >
          <span className="text-4xl">✓</span>
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-3">Thank You!</h3>
        <p className="text-gray-400">We&apos;ll get back to you within 2 hours.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-black/80 via-gray-900/40 to-black/80 backdrop-blur-sm overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute -inset-10 bg-gradient-to-br from-amber-500/5 to-cyan-500/5 blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white mb-2">Get Expert Consultation</h3>
        <p className="text-gray-400 mb-8">Fill in your details and our team will contact you within 2 hours.</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          className={inputStyles}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="john@company.com"
            value={formData.email}
            onChange={handleChange}
            className={inputStyles}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-2">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="+254 XXX XXX XXX"
            value={formData.phone}
            onChange={handleChange}
            className={inputStyles}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-white/80 mb-2">
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            placeholder="Your Company"
            value={formData.company}
            onChange={handleChange}
            className={inputStyles}
          />
        </div>

        <div>
          <label htmlFor="service" className="block text-sm font-medium text-white/80 mb-2">
            Service Interest
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className={inputStyles}
          >
            <option value="general">General Inquiry</option>
            <option value="generators">Generators</option>
            <option value="solar">Solar Energy</option>
            <option value="ups">UPS Systems</option>
            <option value="automation">Automation</option>
            <option value="pumps">Pumps</option>
            <option value="incinerators">Incinerators</option>
            <option value="motors">Motors</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="Tell us about your project requirements..."
          value={formData.message}
          onChange={handleChange}
          className={`${inputStyles} resize-none`}
        />
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending...
            </>
          ) : (
            <>
              <span>Send Message</span>
              <span>→</span>
            </>
          )}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </motion.button>
      
      <p className="text-center text-sm text-gray-500">
        We respond within 2 hours during business hours
      </p>
        </form>
      </div>
    </motion.div>
  );
}

