'use client';

import Link from 'next/link';

export default function CountyCoverageMap() {
  const countyGroups = [
    {
      region: 'Central Kenya',
      icon: '🏔️',
      deliveryTime: '4-8 hours',
      responseTime: '6-8 hours',
      coverage: 'Excellent',
      counties: [
        { name: 'Nairobi', delivery: 'Same-day', response: '2 hours', status: 'headquarters' },
        { name: 'Kiambu', delivery: '2-4 hours', response: '2-4 hours', status: 'premium' },
        { name: 'Machakos', delivery: '4-6 hours', response: '4-6 hours', status: 'premium' },
        { name: 'Nyeri', delivery: '4-8 hours', response: '6-8 hours', status: 'standard' },
        { name: 'Murang\'a', delivery: '4-8 hours', response: '6-8 hours', status: 'standard' },
        { name: 'Kajiado', delivery: '3-5 hours', response: '4-6 hours', status: 'premium' },
      ],
    },
    {
      region: 'Coast & Northeast',
      icon: '🏖️',
      deliveryTime: '8-24 hours',
      responseTime: '8-12 hours',
      coverage: 'Good',
      counties: [
        { name: 'Mombasa', delivery: '8-12 hours', response: '8 hours', status: 'premium' },
        { name: 'Kilifi', delivery: '12-18 hours', response: '12 hours', status: 'standard' },
        { name: 'Lamu', delivery: '24-36 hours', response: '24 hours', status: 'emerging' },
        { name: 'Tana River', delivery: '18-24 hours', response: '18 hours', status: 'emerging' },
      ],
    },
    {
      region: 'Western Kenya',
      icon: '🌾',
      deliveryTime: '8-16 hours',
      responseTime: '8-12 hours',
      coverage: 'Good',
      counties: [
        { name: 'Kisumu', delivery: '8-12 hours', response: '8 hours', status: 'premium' },
        { name: 'Kakamega', delivery: '12-16 hours', response: '12 hours', status: 'standard' },
        { name: 'Kericho', delivery: '12-16 hours', response: '12 hours', status: 'standard' },
        { name: 'Nakuru', delivery: '4-6 hours', response: '4-6 hours', status: 'premium' },
      ],
    },
    {
      region: 'Rift Valley',
      icon: '⛰️',
      deliveryTime: '6-12 hours',
      responseTime: '6-10 hours',
      coverage: 'Excellent',
      counties: [
        { name: 'Nakuru', delivery: '4-6 hours', response: '4-6 hours', status: 'premium' },
        { name: 'Uasin Gishu', delivery: '8-12 hours', response: '8-10 hours', status: 'premium' },
        { name: 'Eldoret', delivery: '8-12 hours', response: '8-10 hours', status: 'premium' },
        { name: 'Narok', delivery: '6-10 hours', response: '6-8 hours', status: 'standard' },
      ],
    },
    {
      region: 'Eastern Kenya',
      icon: '🏜️',
      deliveryTime: '12-24 hours',
      responseTime: '12-18 hours',
      coverage: 'Developing',
      counties: [
        { name: 'Meru', delivery: '12-16 hours', response: '12-14 hours', status: 'standard' },
        { name: 'Embu', delivery: '10-14 hours', response: '10-12 hours', status: 'standard' },
        { name: 'Isiolo', delivery: '16-24 hours', response: '18-24 hours', status: 'emerging' },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'headquarters':
        return 'from-red-600 to-orange-600';
      case 'premium':
        return 'from-green-600 to-emerald-600';
      case 'standard':
        return 'from-blue-600 to-cyan-600';
      case 'emerging':
        return 'from-yellow-600 to-orange-600';
      default:
        return 'from-gray-600 to-slate-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'headquarters':
        return 'HQ';
      case 'premium':
        return '🟢 24/7 Support';
      case 'standard':
        return '🟡 Working Hours';
      case 'emerging':
        return '🟠 Scheduled';
      default:
        return 'Coverage';
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-900/30 to-black border-t border-white/10 content-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            Nationwide Coverage
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Serving All
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
              47 Kenya Counties
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Mobile workshop + field teams + emergency response network. Same-day delivery to Nairobi. 48-hour nationwide. 24/7 emergency support everywhere.
          </p>
        </div>

        {/* Coverage Regions */}
        <div className="space-y-8">
          {countyGroups.map((group, groupIdx) => (
            <div
              key={groupIdx}
             
             
             
             
              className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 border border-white/10 rounded-lg overflow-hidden"
            >
              {/* Region Header */}
              <div className="p-6 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border-b border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{group.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{group.region}</h3>
                      <p className="text-sm text-gray-400">Coverage: {group.coverage}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Avg. Delivery</div>
                    <div className="text-lg font-bold text-cyan-400">{group.deliveryTime}</div>
                  </div>
                </div>
              </div>

              {/* Counties Grid */}
              <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {group.counties.map((county, idx) => (
                  <Link key={idx} href={`/kenya/${county.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    {/* whileHover={{ scale: 1.05 }} replaced by Tailwind's
                        hover:scale-105 — identical effect, but CSS transforms
                        run on the compositor with no JavaScript, and this was
                        the last framer-motion node on the homepage. With it
                        gone the library leaves the homepage bundle entirely. */}
                    <div
                      className={`group p-4 transition-transform duration-200 hover:scale-105 bg-gradient-to-br ${getStatusColor(county.status)} rounded-lg cursor-pointer hover:shadow-lg hover:shadow-cyan-500/20 transition-all`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-white text-sm">{county.name}</h4>
                        <span className="text-xs bg-black/40 px-2 py-1 rounded text-white font-bold">
                          {getStatusLabel(county.status)}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-white/80">
                        <div className="flex justify-between">
                          <span>🚚 Delivery:</span>
                          <span className="font-semibold">{county.delivery}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>📞 Response:</span>
                          <span className="font-semibold">{county.response}</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/20 text-xs text-white/60 group-hover:text-white transition-colors">
                        → View services
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Coverage Promise */}
        <div
          className="mt-16 p-8 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-lg"
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-cyan-400 font-bold mb-2">🚨 Emergency Response</h4>
              <p className="text-sm text-gray-300">
                24/7 emergency hotline +254 768 860 665. Mobile workshop can reach any county. Spare parts stock in Nairobi, Mombasa, Kisumu.
              </p>
            </div>
            <div>
              <h4 className="text-cyan-400 font-bold mb-2">🏗️ Mobile Workshop</h4>
              <p className="text-sm text-gray-300">
                We don't wait for generators to be shipped to our workshop. We bring the workshop to you. On-site diagnostics, repairs, and commissioning.
              </p>
            </div>
            <div>
              <h4 className="text-cyan-400 font-bold mb-2">📞 Field Teams</h4>
              <p className="text-sm text-gray-300">
                Mobile field teams dispatched from our Embakasi workshop. Preventive maintenance visits on schedule, with parts carried to site.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
