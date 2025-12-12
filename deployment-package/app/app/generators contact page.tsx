"use client";

import SectionLead from "../components/generators/SectionLead";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    location: "",
    generatorNeeds: "",
    message: "",
    serviceType: "sales"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    alert("Thank you! We'll contact you within 24 hours.");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionLead
          title="Get Your Cummins Generator Today"
          subtitle="Nationwide coverage across all 47 counties in Kenya. Fill out the form below to get started."
          centered
        />

        <div className="mt-12 grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="p-8 rounded-2xl border border-gray-800 bg-black/50">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Request Form</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-black/50 border border-gray-700 text-white placeholder-gray-500 focus:border-brand-gold focus:outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-black/50 border border-gray-700 text-white placeholder-gray-500 focus:border-brand-gold focus:outline-none transition-colors"
                      placeholder="john@company.co.ke"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-black/50 border border-gray-700 text-white placeholder-gray-500 focus:border-brand-gold focus:outline-none transition-colors"
                      placeholder="+254 7XX XXX XXX"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 mb-2">Company/Organization</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-black/50 border border-gray-700 text-white placeholder-gray-500 focus:border-brand-gold focus:outline-none transition-colors"
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 mb-2">Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-black/50 border border-gray-700 text-white placeholder-gray-500 focus:border-brand-gold focus:outline-none transition-colors"
                      placeholder="City/County"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 mb-2">Service Needed *</label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-black/50 border border-gray-700 text-white focus:border-brand-gold focus:outline-none transition-colors"
                    >
                      <option value="sales">Generator Sales</option>
                      <option value="rental">Generator Rental</option>
                      <option value="maintenance">Maintenance Services</option>
                      <option value="installation">Installation</option>
                      <option value="repair">Repair Services</option>
                      <option value="consultation">Consultation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Generator Requirements</label>
                  <input
                    type="text"
                    name="generatorNeeds"
                    value={formData.generatorNeeds}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-black/50 border border-gray-700 text-white placeholder-gray-500 focus:border-brand-gold focus:outline-none transition-colors"
                    placeholder="e.g., 200kVA, three-phase, silent canopy"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Additional Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-black/50 border border-gray-700 text-white placeholder-gray-500 focus:border-brand-gold focus:outline-none transition-colors resize-none"
                    placeholder="Tell us more about your power needs..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="consent"
                    required
                    className="w-4 h-4 rounded border-gray-700 bg-black/50 text-brand-gold focus:ring-brand-gold focus:ring-2"
                  />
                  <label htmlFor="consent" className="ml-2 text-white/70 text-sm">
                    I consent to EmersonEIMS contacting me regarding my inquiry.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full sci-fi-button py-4 text-lg font-bold"
                >
                  Submit Request
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="p-8 rounded-2xl border border-gray-800 bg-black/50">
              <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Phone Numbers</h4>
                    <a href="tel:+254768860655" className="block text-brand-gold hover:text-yellow-400 mt-1">
                      +254 768 860 655
                    </a>
                    <a href="tel:+254723456789" className="block text-brand-gold hover:text-yellow-400">
                      +254 782 914 717
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Email</h4>
                    <a href="mailto:info@emersoneims.com" className="block text-brand-gold hover:text-yellow-400 mt-1">
                      info@emersoneims.com
                    </a>
                    <a href="mailto:sales@emersoneims.com" className="block text-brand-gold hover:text-yellow-400">
                      sales@emersoneims.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Office Location</h4>
                    <p className="text-white/70 mt-1">
                      Nairobi, Kenya<br />
                      Industrial Area
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="p-8 rounded-2xl border border-gray-800 bg-gradient-to-br from-blue-900/30 to-purple-900/30">
              <h3 className="text-xl font-bold text-white mb-4">Response Time</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Phone Calls:</span>
                  <span className="text-green-400 font-semibold">Immediate</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Emails:</span>
                  <span className="text-green-400 font-semibold">Within 2 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Site Visits:</span>
                  <span className="text-green-400 font-semibold">Within 24 hours</span>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="p-8 rounded-2xl border border-gray-800 bg-black/50">
              <h3 className="text-xl font-bold text-white mb-4">Working Hours</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Monday - Friday</span>
                  <span className="text-white">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Saturday</span>
                  <span className="text-white">9:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Emergency Support</span>
                  <span className="text-brand-gold font-semibold">24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coverage Map */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Nationwide Coverage</h2>
          <div className="bg-black/50 p-8 rounded-2xl border border-gray-800">
            <p className="text-white/70 text-center mb-8 max-w-3xl mx-auto">
              EmersonEIMS serves all 47 counties of Kenya with Cummins generator sales, installation, and 24/7 support.
            </p>
            <div className="relative h-96 bg-gray-900 rounded-xl overflow-hidden">
              {/* Map placeholder - you would embed an actual map here */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-brand-gold/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-white/60">Interactive Kenya Coverage Map</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-brand-gold/10 to-yellow-500/10 p-12 rounded-2xl border border-brand-gold/30">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Power Your World?</h2>
            <p className="text-white/70 max-w-2xl mx-auto mb-8">
              contact today and join thousands of satisfied clients across Kenya enjoying reliable power.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a href="tel:+254768860655" className="sci-fi-button px-10 py-4">
                Call Us Now
              </a>
              <a href="https://wa.me/254768860655" className="sci-fi-outline px-10 py-4">
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
