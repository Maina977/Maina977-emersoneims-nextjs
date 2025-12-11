'use client';

import { useState } from 'react';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you for your inquiry! We will contact you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        service: 'general'
      });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-gold transition-colors"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-gold transition-colors"
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
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-gold transition-colors"
        />
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-white/80 mb-2">
          Company
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-gold transition-colors"
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
          className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-gold transition-colors"
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

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-gold transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 bg-brand-gold text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Send Message'}
      </button>
    </form>
  );
}




