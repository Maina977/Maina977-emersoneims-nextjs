import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Team | EmersonEIMS Engineers & Technicians',
  description: 'Meet the engineers and technicians behind EmersonEIMS — specialists in Cummins, Perkins and multi-brand generators.',
  alternates: {
    canonical: 'https://www.emersoneims.com/about-us/team',
  },
};

export default function TeamPage() {
  const engineers = [
    {
      name: 'Eng. Samuel Kipchoge',
      role: 'Head of Engineering',
      certifications: ['Cummins Factory Certification', 'ISO 9001 Lead Auditor', 'Diesel Engine Specialist'],
      experience: '18 years industry',
      specialization: 'Generator design, load calculations, grid integration systems',
      bio: 'Samuel leads technical strategy and oversees all commercial generator projects. Brings 18 years of power industry experience including thermal generation at Kengen.',
    },
    {
      name: 'Eng. Margaret Mwangi',
      role: 'Solar Systems Engineer',
      certifications: ['Solar PV Design (MNRE)', 'Battery Storage Specialist', 'Electrical Safety'],
      experience: '12 years industry',
      specialization: 'Hybrid solar-diesel systems, battery sizing, control architecture',
      bio: 'Margaret designs solar installations across Kenya\'s diverse climates. Brings 12 years of renewable energy expertise in off-grid and hybrid-mode optimization.',
    },
    {
      name: 'Eng. David Ochieng',
      role: 'Maintenance & Service Director',
      certifications: ['Perkins Service Certificate', 'Caterpillar Training', 'Predictive Maintenance'],
      experience: '15 years industry',
      specialization: 'Generator maintenance, vibration analysis, condition monitoring',
      bio: 'David manages all maintenance contracts and emergency response. Brings 15 years of generator service expertise and has pioneered predictive maintenance protocols at EmersonEIMS.',
    },
    {
      name: 'Eng. Patricia Nyambura',
      role: 'UPS & Electrical Systems Engineer',
      certifications: ['UPS Systems Design', 'Medium Voltage Switchgear', 'Smart Grid Technology'],
      experience: '10 years',
      specialization: 'Power quality, UPS integration, electrical safety design',
      bio: 'Patricia specializes in complex electrical installations for healthcare and data centers. Ensures all systems meet NEMA standards.',
    },
    {
      name: 'Eng. Peter Kamau',
      role: 'Field Operations Manager',
      certifications: ['Cummins Field Service', 'Installation Supervision', 'Quality Assurance'],
      experience: '14 years',
      specialization: 'Installation oversight, on-site commissioning, customer training',
      bio: 'Peter ensures every installation meets EmersonEIMS standards. Has personally supervised 500+ generator installations across Kenya.',
    },
    {
      name: 'Eng. Grace Kiplagat',
      role: 'Digital Solutions Engineer',
      certifications: ['IoT & Remote Monitoring', 'SCADA Systems', 'Data Analytics'],
      experience: '8 years',
      specialization: 'Remote monitoring systems, predictive analytics, smart controls',
      bio: 'Grace implements monitoring solutions enabling real-time performance tracking and predictive maintenance.',
    },
  ];

  const technicians = [
    {
      name: 'Jacob Mureithi',
      role: 'Senior Technician',
      cert: 'Cummins ISBe/ISLe Certified',
      experience: '12 years',
    },
    {
      name: 'James Kipkemboi',
      role: 'Field Technician',
      cert: 'Multi-brand Generator Service',
      experience: '8 years',
    },
    {
      name: 'Moses Kariuki',
      role: 'Installation Technician',
      cert: 'Electrical & Mechanical Installation',
      experience: '10 years',
    },
    {
      name: 'Lawrence Kipchoge',
      role: 'Maintenance Specialist',
      cert: 'Predictive Maintenance Technician',
      experience: '7 years',
    },
    {
      name: 'Elizabeth Wanjiru',
      role: 'Electrical Technician',
      cert: 'ATS/Switchgear Installation',
      experience: '9 years',
    },
    {
      name: 'Victor Mbugua',
      role: 'Service Technician',
      cert: 'Emergency Response Specialist',
      experience: '6 years',
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Our Expert
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Team
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Engineers and technicians delivering solutions across Kenya, specialising in Cummins, Perkins, Caterpillar and emerging power technologies.
          </p>
        </div>
      </section>

      {/* Engineers Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Our Engineering Team</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {engineers.map((eng, idx) => (
              <div key={idx} className="p-8 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-cyan-500 transition">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-cyan-400">{eng.name}</h3>
                  <p className="text-lg text-blue-400 font-semibold">{eng.role}</p>
                  <p className="text-sm text-gray-400 mt-1">{eng.experience} experience</p>
                </div>

                <div className="mb-4">
                  <p className="text-gray-300 mb-3">{eng.bio}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-bold text-gray-400 mb-2">SPECIALIZATION:</p>
                  <p className="text-gray-300 text-sm">{eng.specialization}</p>
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-400 mb-2">CERTIFICATIONS:</p>
                  <ul className="space-y-1">
                    {eng.certifications.map((cert, i) => (
                      <li key={i} className="text-sm text-cyan-300 flex items-center gap-2">
                        <span>✓</span> {cert}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technicians Section */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Field Technicians</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {technicians.map((tech, idx) => (
              <div key={idx} className="p-6 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500 transition">
                <h3 className="text-lg font-bold text-cyan-400 mb-2">{tech.name}</h3>
                <p className="text-blue-400 font-semibold mb-3">{tech.role}</p>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">Certification:</span> <span className="text-gray-300">{tech.cert}</span></p>
                  <p><span className="text-gray-400">Experience:</span> <span className="text-gray-300">{tech.experience}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Our Commitment to Excellence</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="text-4xl font-bold text-cyan-400 mb-3">100%</div>
              <p className="text-gray-300">Experienced on every brand we service</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-cyan-400 mb-3">24/7</div>
              <p className="text-gray-300">Emergency response team available nationwide</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-cyan-400 mb-3">500+</div>
              <p className="text-gray-300">Successful installations supervised annually</p>
            </div>
          </div>
        </div>
      </section>

      {/* Training & Certification */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Continuous Training & Certification</h2>

          <p className="text-lg text-gray-300 mb-8 max-w-2xl">
            Every EmersonEIMS engineer and technician maintains current certifications through ongoing factory training, safety courses, and technical seminars.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 border border-slate-700 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Training Programs</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Cummins Factory Certification (annual)</li>
                <li>• Perkins Service & Maintenance (biennial)</li>
                <li>• Advanced Diagnostics & Troubleshooting</li>
                <li>• High-Voltage Electrical Safety</li>
                <li>• ISO 9001 & Quality Management</li>
              </ul>
            </div>

            <div className="p-6 border border-slate-700 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Certifying Bodies</h3>
              <ul className="space-y-3 text-gray-300">
                <li>✓ Cummins Global Technical Training</li>
                <li>✓ Perkins Service Academy</li>
                <li>✓ Energy & Petroleum Regulatory Authority (EPRA)</li>
                <li>✓ International Electrotechnical Commission (IEC)</li>
                <li>✓ Manufacturers Association of Kenya (MAK)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-900 to-blue-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Talk to Our Experts?</h2>
          <p className="text-lg text-gray-200 mb-10">
            Our team is standing by to help you find the perfect power solution for your needs.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-white text-cyan-900 font-bold rounded-lg hover:bg-gray-200 transition text-lg"
          >
            Contact Our Team
          </Link>
        </div>
      </section>
    </main>
  );
}
