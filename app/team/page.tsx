import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team | Expert Engineers & Technicians | Kenya',
  description: 'Meet the team behind EmersonEIMS. 11+ years of expertise. Certified technicians across Kenya. Real credentials, real experience.',
  alternates: {
    canonical: 'https://www.emersoneims.com/team',
  },
};

export default function TeamPage() {
  const teamMembers = [
    {
      name: 'Engineering Team',
      role: 'Power Systems & Design',
      experience: '11+ years average',
      specialties: [
        'Backup power system design',
        'Load calculation & sizing',
        'UPS integration',
        'Solar system optimization',
        'Control system configuration',
      ],
      certifications: [
        'Professional Engineer (Kenya)',
        'Cummins Generator Certified',
        'Perkins Engine Certified',
        'DeepSea & PowerWizard Specialist',
      ],
      availability: 'Design consultations: Monday-Friday, 8am-5pm',
    },
    {
      name: 'Installation Team',
      role: 'Site Installation & Commissioning',
      experience: '8+ years average',
      specialties: [
        'Generator installation (10-500 kVA)',
        'Solar panel installation',
        'UPS system setup',
        'Control panel wiring',
        'System testing & commissioning',
      ],
      certifications: [
        'Electrical installation certification',
        'Safety compliance training',
        'High-voltage work qualified',
        'Equipment-specific training',
      ],
      availability: 'Installation: Monday-Saturday, 7am-6pm. Emergency: 24/7',
    },
    {
      name: 'Maintenance & Support Team',
      role: 'Service & Troubleshooting',
      experience: '7+ years average',
      specialties: [
        'Generator troubleshooting',
        'Preventive maintenance',
        'Fault diagnosis & repair',
        'Performance optimization',
        'Emergency response',
      ],
      certifications: [
        'Generator mechanics certification',
        'Diesel engine specialist',
        'Electrical systems troubleshooting',
        'First aid & safety certified',
      ],
      availability: 'Maintenance: Scheduled service. Emergency: 24/7 response',
    },
    {
      name: 'Solar & Renewables Team',
      role: 'Solar & Alternative Energy',
      experience: '6+ years average',
      specialties: [
        'Solar system design & sizing',
        'Panel diagnostics & repair',
        'Battery system management',
        'Inverter configuration',
        'Weather optimization',
      ],
      certifications: [
        'Solar installer certification',
        'Renewable energy specialist',
        'Battery system technician',
        'Solar Genius Pro certified',
      ],
      availability: 'Solar assessments: Monday-Friday, 8am-4pm',
    },
    {
      name: 'Water Systems Team',
      role: 'Borehole & Water Solutions',
      experience: '5+ years average',
      specialties: [
        'Pump installation & repair',
        'Water system diagnostics',
        'Predictive maintenance',
        'Flow optimization',
        'Water quality analysis',
      ],
      certifications: [
        'Pump technician certification',
        'Water systems specialist',
        'AquaScan Pro certified',
        'Electrical submersible pump qualified',
      ],
      availability: 'Water assessments: Monday-Friday, 8am-4pm',
    },
    {
      name: 'AC & Climate Control Team',
      role: 'HVAC Systems',
      experience: '6+ years average',
      specialties: [
        'AC installation & repair',
        'Refrigeration systems',
        'Ductwork design',
        'Energy efficiency optimization',
        'Emergency climate control',
      ],
      certifications: [
        'AC technician certification',
        'EPA refrigeration certified',
        'HVAC systems specialist',
        'Energy audit qualified',
      ],
      availability: 'AC service: Monday-Saturday, 7am-6pm',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Meet the</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
              EmersonEIMS Team
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            11+ years of expertise across power systems, solar, water, AC, and industrial solutions. Real qualifications. Real experience. Real accountability.
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { number: '50+', label: 'Certified Technicians' },
              { number: '11+', label: 'Years Experience' },
              { number: '500+', label: 'Active Projects' },
              { number: '47', label: 'County Coverage' },
            ].map((stat, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Departments */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Specialized Teams</h2>

          <div className="space-y-8">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg p-8">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Left: Basic Info */}
                  <div>
                    <h3 className="text-2xl font-bold text-amber-400 mb-3">{member.name}</h3>
                    <p className="text-lg text-gray-300 mb-4">{member.role}</p>
                    <div className="space-y-2">
                      <p className="text-gray-400">
                        <strong>Average Experience:</strong> {member.experience}
                      </p>
                      <p className="text-gray-400">
                        <strong>Availability:</strong> {member.availability}
                      </p>
                    </div>
                  </div>

                  {/* Middle: Specialties */}
                  <div>
                    <h4 className="text-amber-400 font-bold mb-4">Specialties</h4>
                    <ul className="space-y-2">
                      {member.specialties.map((spec, specIdx) => (
                        <li key={specIdx} className="text-gray-300 flex gap-2">
                          <span className="text-amber-400">•</span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Certifications */}
                  <div>
                    <h4 className="text-amber-400 font-bold mb-4">Certifications</h4>
                    <ul className="space-y-2">
                      {member.certifications.map((cert, certIdx) => (
                        <li key={certIdx} className="text-gray-300 flex gap-2">
                          <span className="text-emerald-400">✓</span>
                          <span>{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Principles */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">How We Work</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🎯',
                title: 'Honesty First',
                description: 'We tell you what needs fixing and what doesn\'t. You get transparent recommendations, not upsells.',
              },
              {
                icon: '📋',
                title: 'Documentation',
                description: 'Every installation and repair is documented with photos, timelines, and performance metrics.',
              },
              {
                icon: '🏆',
                title: 'Accountability',
                description: 'We guarantee our work with money-back guarantees. Our reputation is on the line every day.',
              },
              {
                icon: '📞',
                title: '24/7 Availability',
                description: 'Real people, real response. Emergency calls go to our team, not a call center.',
              },
              {
                icon: '🔧',
                title: 'Continuous Learning',
                description: 'Our technicians are always trained on new equipment, systems, and best practices.',
              },
              {
                icon: '🤝',
                title: 'Client Relationships',
                description: 'We treat every facility as if it\'s our own. Long-term partnerships, not one-off transactions.',
              },
            ].map((principle, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
                <div className="text-4xl mb-4">{principle.icon}</div>
                <h3 className="text-xl font-bold text-amber-400 mb-3">{principle.title}</h3>
                <p className="text-gray-300 text-sm">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Standards */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Industry Standards & Certifications</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-amber-400 mb-6">Equipment Certifications</h3>
              <ul className="space-y-3">
                {[
                  'Cummins Generator Authorized Service',
                  'Perkins Engine Certified',
                  'Caterpillar Equipment Knowledge',
                  'DeepSea Electronic Controllers',
                  'PowerWizard Control Systems',
                  'Grundfos Pump Systems',
                  'Siemens Electrical Products',
                  'Schneider Electric Systems',
                ].map((cert, idx) => (
                  <li key={idx} className="text-gray-300 flex gap-3">
                    <span className="text-amber-400">✓</span>
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-amber-400 mb-6">Professional Standards</h3>
              <ul className="space-y-3">
                {[
                  'Licensed Electrical Installers',
                  'High-Voltage Work Qualified',
                  'Safety & OSHA Compliance',
                  'ISO 9001 Quality Management',
                  'Professional Engineers Registered',
                  'First Aid & Emergency Response',
                  'Environmental Protection Standards',
                  'Kenya Bureau of Standards (KEBS)',
                ].map((cert, idx) => (
                  <li key={idx} className="text-gray-300 flex gap-3">
                    <span className="text-amber-400">✓</span>
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Who Will Work On Your Project */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Who Will Work On Your Project?</h2>

          <div className="space-y-6">
            {[
              {
                question: 'How do I know who will install/repair my equipment?',
                answer:
                  'When we quote your project, we assign a specific team lead and provide their credentials, experience level, and certifications. You know exactly who will be working on your facility.',
              },
              {
                question: 'Can I request a specific technician?',
                answer:
                  'Yes. If you\'ve worked with someone before and want the same person, let us know. We\'ll honor that request when possible.',
              },
              {
                question: 'Are your teams supervised?',
                answer:
                  'Every installation is supervised by a senior technician or engineer. Quality checks are performed before handover.',
              },
              {
                question: 'What if I\'m not happy with the work?',
                answer:
                  'Money-back guarantee. If you\'re not satisfied, we\'ll redo the work or refund your payment. Your satisfaction is non-negotiable.',
              },
              {
                question: 'Can I meet the team before they start work?',
                answer:
                  'Absolutely. We can arrange a pre-visit so you meet the team, discuss your concerns, and confirm scope before work begins.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
                <h3 className="text-lg font-bold text-amber-400 mb-3">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-amber-900/30 to-orange-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Work With Our Team?</h2>
          <p className="text-lg text-gray-300 mb-10">
            Get a consultation and meet the team that will handle your project.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+254768860665"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all"
            >
              Call: +254 768 860 665
            </a>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-amber-500 text-amber-400 font-bold rounded-lg hover:bg-amber-500/10 transition-all"
            >
              Request Team Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
