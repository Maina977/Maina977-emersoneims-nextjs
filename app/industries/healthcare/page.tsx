import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Healthcare Power Solutions | Hospitals & Clinics | EmersonEIMS Kenya',
  description: 'Reliable power for hospitals, clinics, and medical facilities across Kenya. Emergency backup generators, UPS systems, solar integration, 24/7 support. Zero downtime, NEMA compliance.',
  alternates: {
    canonical: 'https://www.emersoneims.com/industries/healthcare',
  },
};

export default function HealthcareIndustriesPage() {
  const solutions = [
    {
      icon: '🏥',
      title: 'Hospital Main Campus',
      description: 'Integrated power infrastructure for large hospital networks',
      power: '300-500 kVA',
      features: [
        '3-phase generator + ATS changeover',
        'UPS for critical operating theatres',
        'Solar + battery storage for sustainability',
        'Load shedding for non-critical areas',
        'Remote monitoring + predictive maintenance',
        'Automated failover ({'<'} 200ms)',
      ],
      applications: 'Operating theatres, ICU, emergency wards, imaging labs, blood bank refrigeration',
      reliability: '99.8% uptime SLA',
      cost: 'KES 2.5M - 5M (installed)',
      timeline: '4-6 weeks',
    },
    {
      icon: '🏨',
      title: 'Clinic / Private Healthcare',
      description: 'Compact, reliable backup for small-medium healthcare facilities',
      power: '50-150 kVA',
      features: [
        '2-phase silent generator',
        'UPS for critical patient monitoring',
        'Quick-start automatic switching',
        'Fuel efficiency (low operating cost)',
        'Compact footprint (clinic space constraints)',
        '24/7 emergency support',
      ],
      applications: 'Outpatient departments, consultation rooms, X-ray labs, laboratory equipment',
      reliability: '99.5% uptime SLA',
      cost: 'KES 350K - 800K (installed)',
      timeline: '1-2 weeks',
    },
    {
      icon: '🩺',
      title: 'Diagnostic Center / Lab',
      description: 'Precision power for sensitive medical imaging and laboratory equipment',
      power: '30-100 kVA',
      features: [
        'Voltage regulation (±2% for sensitive equipment)',
        'Harmonic filtering (for medical imaging)',
        'UPS for data preservation',
        'Solar option for cost reduction',
        'Noise suppression (hospital environment)',
      ],
      applications: 'CT/MRI scanners, ultrasound, pathology labs, blood analysis equipment',
      reliability: '99.9% uptime SLA',
      cost: 'KES 200K - 500K (installed)',
      timeline: '1-2 weeks',
    },
    {
      icon: '🔬',
      title: 'Medical Refrigeration',
      description: 'Specialized backup for vaccine storage, blood bank, laboratory samples',
      power: '15-50 kVA',
      features: [
        'Uninterrupted cooling (vaccine viability)',
        'Temperature monitoring + alerts',
        'Dedicated UPS for backup',
        'Remote alerts (WhatsApp/SMS)',
        'Weekly cold-chain verification',
      ],
      applications: 'Vaccine cold-chain, blood storage, laboratory sample preservation',
      reliability: '99.95% uptime SLA',
      cost: 'KES 150K - 350K (installed)',
      timeline: '1 week',
    },
  ];

  const caseStudies = [
    {
      facility: 'Kenyatta National Hospital (KNH)',
      issue: 'Generator failure during critical surgery caused 2-hour emergency evacuation',
      solution: 'Installed dual-redundant 300kVA + 200kVA generators with automatic failover',
      result: '2-hour emergency response, 99.8% uptime, zero patient incidents in 2 years',
      location: 'Nairobi',
      investment: 'KES 2.8M',
    },
    {
      facility: 'Mombasa Specialist Hospital',
      issue: 'Power cuts causing lab equipment damage (KES 150K per incident), 5-6 cuts/month',
      solution: 'Solar + battery storage + generator hybrid system with voltage regulation',
      result: '99.9% uptime, KES 3M annual savings in equipment damage prevention',
      location: 'Mombasa',
      investment: 'KES 1.2M',
    },
    {
      facility: 'Nairobi Children\'s Hospital',
      issue: 'Pediatric ICU power fluctuations causing equipment alarms, patient stress',
      solution: 'Pure UPS + regulated generator backup + solar integration',
      result: '99.95% uptime, zero false alarms, child patients more stable',
      location: 'Nairobi',
      investment: 'KES 800K',
    },
  ];

  const compliance = [
    { standard: 'IEC 61000', description: 'Electromagnetic compatibility for medical devices' },
    { standard: 'ISO 13485', description: 'Medical device quality management' },
    { standard: 'NEMA 1 / 3R', description: 'Enclosure standards for indoor/outdoor installation' },
    { standard: 'EN 50082', description: 'Immunity standards for hospital equipment' },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-white">Healthcare Power Solutions</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500">
              99.8% Uptime Guarantee
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Hospitals, clinics, diagnostic centers, and medical labs across Kenya trust EmersonEIMS for zero-downtime power.
            When patient lives are on the line, you need engineers who understand critical infrastructure.
          </p>
        </div>
      </section>

      {/* Why Healthcare Facilities Choose Us */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-12 text-center">Why Healthcare Chooses EmersonEIMS</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-slate-900/50 border border-red-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-red-400 mb-4">⚡ 99.8% Uptime SLA</h3>
              <p className="text-gray-300 mb-4">
                Contractual guarantee. Automatic failover in {'<'} 200ms. Redundant systems. Daily monitoring.
              </p>
              <p className="text-sm text-gray-400">
                Other providers claim reliability. We guarantee it in writing and back it with 24/7 technical support.
              </p>
            </div>

            <div className="p-8 bg-slate-900/50 border border-red-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-red-400 mb-4">🏥 Healthcare-Specific Engineering</h3>
              <p className="text-gray-300 mb-4">
                Not generic power. We understand medical equipment, voltage regulation, harmonic filtering, and cold-chain requirements.
              </p>
              <p className="text-sm text-gray-400">
                Our engineers have installed systems in 50+ healthcare facilities across Kenya and East Africa.
              </p>
            </div>

            <div className="p-8 bg-slate-900/50 border border-red-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-red-400 mb-4">📞 24/7 Emergency Response</h3>
              <p className="text-gray-300 mb-4">
                When power fails at midnight during surgery, you need someone who answers. We do.
              </p>
              <p className="text-sm text-gray-400">
                +254 768 860 665 - 24/7/365. Mobile workshop can reach any hospital in Kenya.
              </p>
            </div>

            <div className="p-8 bg-slate-900/50 border border-red-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-red-400 mb-4">📋 Compliance & Certification</h3>
              <p className="text-gray-300 mb-4">
                IEC 61000, ISO 13485, NEMA 1/3R, EN 50082. We build to standards, not wishes.
              </p>
              <p className="text-sm text-gray-400">
                Equipment certified. Installation inspected. Documentation complete for audits and accreditation reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions by Facility Type */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Power Solutions by Facility Type</h2>
          <div className="space-y-8">
            {solutions.map((solution, idx) => (
              <div key={idx} className="p-8 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-red-500/20 rounded-lg">
                <div className="flex items-start gap-6 mb-6">
                  <span className="text-4xl">{solution.icon}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{solution.title}</h3>
                    <p className="text-gray-300">{solution.description}</p>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <div className="text-sm text-gray-400">Typical Power</div>
                    <div className="text-lg font-bold text-red-400">{solution.power}</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm font-bold text-red-400 mb-2">FEATURES</p>
                    <ul className="space-y-1">
                      {solution.features.map((feature, i) => (
                        <li key={i} className="text-sm text-gray-300 flex gap-2">
                          <span>✓</span> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="bg-black/40 rounded p-4 space-y-3">
                      <div>
                        <p className="text-xs text-gray-400">Applications</p>
                        <p className="text-sm text-gray-300">{solution.applications}</p>
                      </div>
                      <div className="border-t border-white/10 pt-3">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Uptime SLA:</span>
                          <span className="font-bold text-red-400">{solution.reliability}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Typical Cost:</span>
                          <span className="font-bold text-red-400">{solution.cost}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Timeline:</span>
                          <span className="font-bold text-red-400">{solution.timeline}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Healthcare Facilities We Serve</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {caseStudies.map((study, idx) => (
              <div key={idx} className="p-8 bg-slate-900/50 border border-red-500/20 rounded-lg">
                <h3 className="text-xl font-bold text-red-400 mb-2">{study.facility}</h3>
                <p className="text-xs text-gray-400 mb-6">{study.location}</p>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 mb-1">THE ISSUE</p>
                    <p className="text-sm text-gray-300">{study.issue}</p>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-400 mb-1">OUR SOLUTION</p>
                    <p className="text-sm text-gray-300">{study.solution}</p>
                  </div>

                  <div className="bg-green-900/20 border border-green-500/30 rounded p-4">
                    <p className="text-xs font-bold text-green-400 mb-1">RESULT</p>
                    <p className="text-sm text-green-300">{study.result}</p>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <p className="text-xs text-gray-400">Investment</p>
                    <p className="text-lg font-bold text-red-400">{study.investment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Standards & Compliance</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {compliance.map((cert, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-red-500/20 rounded-lg">
                <h3 className="text-lg font-bold text-red-400 mb-2">{cert.standard}</h3>
                <p className="text-gray-300">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Protect Your Hospital's Power
          </h2>
          <p className="text-lg text-gray-300 mb-10">
            When patient lives depend on power, trust the engineers who understand healthcare infrastructure.
            Schedule a consultation to design your facility's power resilience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact?type=healthcare"
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-lg hover:scale-105 transition-all"
            >
              Get Healthcare Power Assessment
            </Link>
            <a
              href="tel:+254768860665"
              className="px-8 py-4 border-2 border-red-500 text-red-400 font-bold rounded-lg hover:bg-red-500/10 transition-all"
            >
              Call: +254 768 860 665 (24/7)
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
