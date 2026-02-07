'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const SERVICES = [
  {
    id: 'borehole',
    name: 'Borehole Pump Services',
    icon: '💧',
    description: 'Complete borehole pump installation, repair, and maintenance. Submersible and surface pumps for all depths.',
    services: ['Pump Installation', 'Pump Repair', 'Motor Rewinding', 'Pipe Replacement', 'Water Testing', 'Yield Testing'],
    price: 'From KES 8,000'
  },
  {
    id: 'motor',
    name: 'Motor Rewinding',
    icon: '⚙️',
    description: 'Professional electric motor rewinding for all sizes. Single phase, three phase, AC and DC motors.',
    services: ['Coil Rewinding', 'Bearing Replacement', 'Shaft Repair', 'Balancing', 'Insulation Testing', 'VPI Treatment'],
    price: 'From KES 3,500'
  },
  {
    id: 'ac',
    name: 'AC Installation & Repair',
    icon: '❄️',
    description: 'Air conditioning installation, maintenance, and repair. All brands including LG, Samsung, Carrier, Daikin.',
    services: ['AC Installation', 'Gas Refilling', 'Compressor Repair', 'PCB Repair', 'Duct Cleaning', 'Preventive Maintenance'],
    price: 'From KES 2,500'
  },
  {
    id: 'electrical',
    name: 'Electrical Services',
    icon: '🔌',
    description: 'Complete electrical installations and repairs. Industrial, commercial, and residential.',
    services: ['Wiring & Rewiring', 'Panel Installation', 'Fault Finding', 'Earthing Systems', 'Lightning Protection', 'Power Factor Correction'],
    price: 'From KES 2,000'
  },
  {
    id: 'welding',
    name: 'Welding & Fabrication',
    icon: '🔥',
    description: 'Professional welding services. Steel structures, gates, grills, tanks, and custom fabrication.',
    services: ['Arc Welding', 'MIG/TIG Welding', 'Steel Fabrication', 'Gate Installation', 'Tank Fabrication', 'Repairs'],
    price: 'From KES 1,500'
  },
  {
    id: 'plumbing',
    name: 'Plumbing Services',
    icon: '🚿',
    description: 'Complete plumbing solutions. Water supply, drainage, and sanitary installations.',
    services: ['Pipe Installation', 'Leak Repairs', 'Drain Cleaning', 'Water Heater Service', 'Pump Installation', 'Tank Installation'],
    price: 'From KES 1,500'
  }
];

const SERVICE_AREAS = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika',
  'Malindi', 'Kitale', 'Garissa', 'Nyeri', 'Machakos', 'Meru'
];

export default function GeneralServicesHub() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-900/80 border-b border-slate-700 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/maintenance-hub" className="text-amber-500 hover:text-amber-400">
                ← Maintenance Hub
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-3xl">🔧</span> General Services
                </h1>
                <p className="text-slate-400 text-sm">Professional maintenance services across Kenya</p>
              </div>
            </div>
            <a href="tel:+254782914717" className="hidden md:flex bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg font-medium">
              📞 0782 914 717
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">All Maintenance Services</h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            From borehole pumps to motor rewinding, AC repair to electrical work - we've got you covered.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-slate-800/50 border rounded-xl p-6 cursor-pointer transition-all ${
                selectedService === service.id ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-700 hover:border-amber-500/50'
              }`}
              onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
            >
              <div className="text-4xl mb-3">{service.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
              <p className="text-slate-400 text-sm mb-4">{service.description}</p>

              {selectedService === service.id && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-slate-700 pt-4 mt-4">
                  <p className="text-amber-400 font-bold mb-3">{service.price}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.services.map((s, j) => (
                      <span key={j} className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded">{s}</span>
                    ))}
                  </div>
                  <a
                    href={`https://wa.me/254782914717?text=Hi, I need ${service.name} service`}
                    className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded-lg font-medium"
                  >
                    💬 Book on WhatsApp
                  </a>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <section className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Service Areas</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {SERVICE_AREAS.map((area) => (
              <span key={area} className="bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-full">
                📍 {area}
              </span>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">24/7 Emergency Services Available</h3>
          <p className="text-white/90 mb-6">Our technicians are ready to help around the clock.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="tel:+254782914717" className="bg-white text-green-600 px-8 py-3 rounded-xl font-bold">
              📞 Call: 0782 914 717
            </a>
            <a href="https://wa.me/254782914717" className="bg-green-800 hover:bg-green-900 text-white px-8 py-3 rounded-xl font-bold">
              💬 WhatsApp
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">© 2026 Emerson Industrial Maintenance Services Limited.</p>
        </div>
      </footer>
    </div>
  );
}
