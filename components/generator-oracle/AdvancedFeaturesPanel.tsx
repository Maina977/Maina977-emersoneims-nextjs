'use client';

/**
 * Advanced Features Panel
 * Showcases Oracle's UNIQUE features that no competitor has
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Feature categories with unique Oracle capabilities
const UNIQUE_FEATURES = [
  {
    id: 'predictive',
    icon: '🧠',
    name: 'AI Predictive Analysis',
    tagline: 'Know failures BEFORE they happen',
    description: 'Machine learning analyzes sensor patterns to predict component failures days or weeks in advance.',
    competitorComparison: 'CAT ET, INSITE, VODIA only show CURRENT faults - Oracle PREDICTS future failures',
    benefits: ['Prevent costly downtime', 'Schedule maintenance proactively', 'Reduce emergency repairs by 80%'],
    demo: {
      type: 'health-bars',
      data: [
        { component: 'Turbocharger', health: 92, trend: 'stable', daysToFailure: null },
        { component: 'Fuel Injectors', health: 67, trend: 'degrading', daysToFailure: 45 },
        { component: 'Water Pump', health: 43, trend: 'declining', daysToFailure: 12 },
        { component: 'Alternator', health: 88, trend: 'stable', daysToFailure: null }
      ]
    }
  },
  {
    id: 'crossbrand',
    icon: '🔄',
    name: 'Cross-Brand Translation',
    tagline: 'One fault code, ALL manufacturers',
    description: 'See the equivalent fault codes across Caterpillar, Cummins, Volvo, Perkins, and ALL other brands.',
    competitorComparison: 'CAT ET only shows CAT codes - Oracle shows you the same fault in every brand',
    benefits: ['Work on ANY brand with same knowledge', 'Train once, work everywhere', 'Universal understanding'],
    demo: {
      type: 'translation',
      data: {
        original: { brand: 'Cummins', code: 'SPN 100 FMI 1', desc: 'Low Oil Pressure' },
        translations: [
          { brand: 'Caterpillar', code: '110-1', desc: 'Oil Pressure Low' },
          { brand: 'Volvo Penta', code: 'MID 128 PID 100', desc: 'Oil Pressure Sensor Low' },
          { brand: 'Perkins', code: '111-01', desc: 'Low Engine Oil Pressure' },
          { brand: 'John Deere', code: 'SPN100 FMI1', desc: 'Engine Oil Pressure Low' }
        ]
      }
    }
  },
  {
    id: 'ar',
    icon: '📱',
    name: 'AR Wiring Overlay',
    tagline: 'See through your generator',
    description: 'Point your phone camera at the generator to see wire routes, sensor locations, and component highlights.',
    competitorComparison: 'No competitor offers augmented reality - this is exclusive to Oracle',
    benefits: ['Find wires instantly', 'Visual troubleshooting', 'Training made easy'],
    demo: {
      type: 'ar-preview',
      data: { preview: '/ar-demo.png', features: ['Wire tracing', '3D pinouts', 'Component ID'] }
    }
  },
  {
    id: 'voice',
    icon: '🎤',
    name: 'Voice Commands',
    tagline: '"Hey Oracle, read fault codes"',
    description: 'Hands-free diagnostics while you work. Just speak naturally and Oracle responds.',
    competitorComparison: 'No competitor has voice control - Oracle is the only hands-free diagnostic tool',
    benefits: ['Work safely with hands busy', 'Faster operation', 'Natural interaction'],
    demo: {
      type: 'voice-commands',
      data: [
        'Hey Oracle, read fault codes',
        'Hey Oracle, what is the coolant temperature?',
        'Hey Oracle, predict failures',
        'Hey Oracle, generate report'
      ]
    }
  },
  {
    id: 'blockchain',
    icon: '🔗',
    name: 'Blockchain History',
    tagline: 'Tamper-proof service records',
    description: 'Every service record is cryptographically secured. Prove your maintenance history to buyers.',
    competitorComparison: 'No competitor uses blockchain - paper records can be lost or faked',
    benefits: ['Increase resale value', 'Verify authenticity', 'Complete audit trail'],
    demo: {
      type: 'blockchain-chain',
      data: [
        { date: '2024-01-15', type: 'Oil Change', tech: 'John D.', verified: true },
        { date: '2024-02-20', type: 'Filter Service', tech: 'Mike R.', verified: true },
        { date: '2024-03-08', type: 'Firmware Update', tech: 'Oracle AI', verified: true }
      ]
    }
  },
  {
    id: 'fleet',
    icon: '🌐',
    name: 'Fleet Telematics',
    tagline: 'Monitor all generators anywhere',
    description: 'Cloud dashboard shows real-time status of your entire fleet. Instant alerts to your phone.',
    competitorComparison: 'OEM tools work one unit at a time - Oracle manages your entire fleet',
    benefits: ['Real-time monitoring', 'Instant alerts', 'Remote commands'],
    demo: {
      type: 'fleet-map',
      data: [
        { id: 'GEN-001', name: 'Site A', status: 'running', load: 75 },
        { id: 'GEN-002', name: 'Site B', status: 'standby', load: 0 },
        { id: 'GEN-003', name: 'Site C', status: 'fault', load: 0 }
      ]
    }
  },
  {
    id: 'offline',
    icon: '📴',
    name: 'Offline AI Expert',
    tagline: 'Full diagnostics without internet',
    description: 'Complete AI diagnostic capabilities work offline. Perfect for remote sites.',
    competitorComparison: 'Most modern tools require internet - Oracle works anywhere',
    benefits: ['Remote locations', 'No connectivity needed', 'Always available'],
    demo: {
      type: 'offline-badge',
      data: { status: 'offline', capabilities: ['Fault diagnosis', 'Repair guides', 'Parts lookup'] }
    }
  },
  {
    id: 'parts',
    icon: '🔧',
    name: 'Smart Parts ID',
    tagline: 'Find parts, compare prices instantly',
    description: 'Auto-identify needed parts from fault codes. Compare prices from multiple suppliers.',
    competitorComparison: 'No competitor has integrated parts sourcing - Oracle does it all',
    benefits: ['Save money', 'Instant availability', 'Multiple suppliers'],
    demo: {
      type: 'parts-comparison',
      data: [
        { supplier: 'OEM Direct', price: 450, stock: true, days: 3 },
        { supplier: 'Parts Plus', price: 320, stock: true, days: 1 },
        { supplier: 'Global Parts', price: 285, stock: false, days: 7 }
      ]
    }
  },
  {
    id: 'training',
    icon: '🎓',
    name: 'Built-in Training',
    tagline: 'Learn and get certified',
    description: 'Complete training modules with simulated faults. Earn certifications.',
    competitorComparison: 'Training is separate/extra with competitors - Oracle includes it free',
    benefits: ['Train new techs fast', 'Certifications included', 'Simulated practice'],
    demo: {
      type: 'certifications',
      data: [
        { name: 'Fundamentals', progress: 100, certified: true },
        { name: 'Electrical Systems', progress: 75, certified: false },
        { name: 'Master Technician', progress: 30, certified: false }
      ]
    }
  },
  {
    id: 'compare',
    icon: '📊',
    name: 'Fleet Comparison',
    tagline: 'Benchmark your fleet',
    description: 'Compare performance, efficiency, and costs across all your generators and industry averages.',
    competitorComparison: 'No competitor offers cross-unit comparison - Oracle shows the full picture',
    benefits: ['Identify underperformers', 'Optimize efficiency', 'Reduce costs'],
    demo: {
      type: 'comparison-chart',
      data: [
        { gen: 'GEN-001', efficiency: 92, cost: 12.5, hours: 4500 },
        { gen: 'GEN-002', efficiency: 78, cost: 18.2, hours: 6200 },
        { gen: 'GEN-003', efficiency: 85, cost: 15.0, hours: 3100 }
      ]
    }
  }
];

export function AdvancedFeaturesPanel() {
  const [selectedFeature, setSelectedFeature] = useState(UNIQUE_FEATURES[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-2xl border border-purple-500/30 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-xl">
              <span className="text-3xl">⚡</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Oracle Exclusive Features</h2>
              <p className="text-purple-300 text-sm">Capabilities NO OTHER tool offers</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full border border-green-500/30">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-green-400 text-sm font-medium">10 Unique Features</span>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="p-4">
        <div className="grid grid-cols-5 gap-2 mb-4">
          {UNIQUE_FEATURES.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setSelectedFeature(feature)}
              className={`p-3 rounded-xl transition-all text-center ${
                selectedFeature.id === feature.id
                  ? 'bg-gradient-to-br from-purple-500/40 to-cyan-500/40 border-2 border-purple-400 shadow-lg shadow-purple-500/20'
                  : 'bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/30 hover:bg-slate-800'
              }`}
            >
              <span className="text-2xl block mb-1">{feature.icon}</span>
              <span className={`text-xs font-medium ${selectedFeature.id === feature.id ? 'text-white' : 'text-slate-400'}`}>
                {feature.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Feature Detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedFeature.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-xl">
                <span className="text-4xl">{selectedFeature.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">{selectedFeature.name}</h3>
                <p className="text-cyan-400 font-medium mb-2">{selectedFeature.tagline}</p>
                <p className="text-slate-400 text-sm">{selectedFeature.description}</p>
              </div>
            </div>

            {/* Competitor Comparison */}
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-red-400">⚔️</span>
                <span className="text-red-400 font-semibold text-sm">vs Competition</span>
              </div>
              <p className="text-red-200 text-sm">{selectedFeature.competitorComparison}</p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {selectedFeature.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                  <span className="text-green-400">✓</span>
                  <span className="text-green-300 text-sm">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Feature Demo */}
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 text-xs uppercase tracking-wider mb-3 block">Live Preview</span>
              <FeatureDemo feature={selectedFeature} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="p-4 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-purple-500/10 border-t border-purple-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">Ready to experience the future of diagnostics?</p>
            <p className="text-slate-400 text-sm">All 10 exclusive features included with Oracle</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/25">
            Activate All Features
          </button>
        </div>
      </div>
    </div>
  );
}

function FeatureDemo({ feature }: { feature: typeof UNIQUE_FEATURES[0] }) {
  switch (feature.demo.type) {
    case 'health-bars':
      return (
        <div className="space-y-3">
          {(feature.demo.data as any[]).map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-slate-400 text-sm w-28">{item.component}</span>
              <div className="flex-1 h-4 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    item.health > 80 ? 'bg-green-500' :
                    item.health > 50 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${item.health}%` }}
                />
              </div>
              <span className={`text-sm font-medium w-12 ${
                item.health > 80 ? 'text-green-400' :
                item.health > 50 ? 'text-yellow-400' :
                'text-red-400'
              }`}>{item.health}%</span>
              {item.daysToFailure && (
                <span className="text-xs text-red-400 px-2 py-1 bg-red-500/20 rounded">
                  ~{item.daysToFailure}d
                </span>
              )}
            </div>
          ))}
        </div>
      );

    case 'translation':
      const data = feature.demo.data as any;
      return (
        <div>
          <div className="p-3 bg-cyan-500/20 rounded-lg border border-cyan-500/30 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-cyan-400 font-bold">{data.original.brand}</span>
              <span className="text-slate-400">→</span>
              <code className="text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded">{data.original.code}</code>
            </div>
            <p className="text-white text-sm">{data.original.desc}</p>
          </div>
          <div className="text-center text-slate-500 text-xs mb-3">↓ Same fault in other brands ↓</div>
          <div className="grid grid-cols-2 gap-2">
            {data.translations.map((t: any, idx: number) => (
              <div key={idx} className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                <span className="text-slate-400 text-xs">{t.brand}</span>
                <code className="text-purple-300 text-xs block">{t.code}</code>
              </div>
            ))}
          </div>
        </div>
      );

    case 'voice-commands':
      return (
        <div className="space-y-2">
          {(feature.demo.data as string[]).map((cmd, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2 bg-slate-800 rounded-lg border border-slate-700">
              <span className="text-purple-400">🎤</span>
              <span className="text-white text-sm italic">"{cmd}"</span>
            </div>
          ))}
        </div>
      );

    case 'blockchain-chain':
      return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {(feature.demo.data as any[]).map((block, idx) => (
            <div key={idx} className="flex items-center">
              <div className="p-3 bg-slate-800 rounded-lg border border-green-500/30 min-w-[140px]">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-green-400 text-xs">✓</span>
                  <span className="text-slate-400 text-xs">{block.date}</span>
                </div>
                <p className="text-white text-sm font-medium">{block.type}</p>
                <p className="text-slate-500 text-xs">{block.tech}</p>
              </div>
              {idx < (feature.demo.data as any[]).length - 1 && (
                <div className="w-4 h-0.5 bg-green-500/50 mx-1" />
              )}
            </div>
          ))}
        </div>
      );

    case 'fleet-map':
      return (
        <div className="grid grid-cols-3 gap-3">
          {(feature.demo.data as any[]).map((gen, idx) => (
            <div key={idx} className={`p-3 rounded-lg border ${
              gen.status === 'running' ? 'bg-green-500/10 border-green-500/30' :
              gen.status === 'fault' ? 'bg-red-500/10 border-red-500/30' :
              'bg-slate-800 border-slate-700'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${
                  gen.status === 'running' ? 'bg-green-500 animate-pulse' :
                  gen.status === 'fault' ? 'bg-red-500 animate-pulse' :
                  'bg-slate-500'
                }`} />
                <span className="text-white text-sm font-medium">{gen.name}</span>
              </div>
              <p className="text-slate-400 text-xs">{gen.id}</p>
              <p className="text-slate-300 text-sm">Load: {gen.load}%</p>
            </div>
          ))}
        </div>
      );

    case 'parts-comparison':
      return (
        <div className="space-y-2">
          {(feature.demo.data as any[]).map((part, idx) => (
            <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border ${
              idx === 1 ? 'bg-green-500/10 border-green-500/30' : 'bg-slate-800 border-slate-700'
            }`}>
              <div>
                <p className="text-white font-medium">{part.supplier}</p>
                <p className="text-slate-400 text-xs">
                  {part.stock ? '✓ In Stock' : '✗ Order'} • {part.days} days
                </p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${idx === 1 ? 'text-green-400' : 'text-white'}`}>${part.price}</p>
                {idx === 1 && <span className="text-green-400 text-xs">Best Value</span>}
              </div>
            </div>
          ))}
        </div>
      );

    case 'certifications':
      return (
        <div className="space-y-3">
          {(feature.demo.data as any[]).map((cert, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className={`text-2xl ${cert.certified ? '' : 'grayscale opacity-50'}`}>🎓</span>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{cert.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-slate-700 rounded-full">
                    <div
                      className={`h-full rounded-full ${cert.certified ? 'bg-green-500' : 'bg-cyan-500'}`}
                      style={{ width: `${cert.progress}%` }}
                    />
                  </div>
                  <span className="text-slate-400 text-xs">{cert.progress}%</span>
                </div>
              </div>
              {cert.certified && (
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">Certified</span>
              )}
            </div>
          ))}
        </div>
      );

    default:
      return (
        <div className="text-center text-slate-400 py-8">
          Feature demo coming soon
        </div>
      );
  }
}

export default AdvancedFeaturesPanel;
