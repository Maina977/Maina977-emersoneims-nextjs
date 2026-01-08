'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Comprehensive Installation Knowledge Database
const installationPhases = [
  {
    id: 'site-assessment',
    phase: 'Phase 1: Site Assessment',
    icon: '📐',
    duration: '1-3 days',
    overview: 'Complete evaluation of your site to ensure optimal generator placement and performance.',
    steps: [
      'Load analysis and power requirement calculation',
      'Site visit and location survey',
      'Electrical infrastructure assessment',
      'Fuel supply accessibility review',
      'Environmental and acoustic evaluation',
      'Safety and compliance pre-check',
    ],
    learnMore: {
      whatWeAssess: [
        'Total connected load vs running load vs starting load',
        'Peak demand periods and load diversity factor',
        'Future expansion requirements (10-20 year projection)',
        'Critical load identification (life safety, essential, non-essential)',
        'Existing electrical system capacity and condition',
        'Transfer switch requirements and location',
        'Utility interconnection requirements',
      ],
      siteConsiderations: [
        'Foundation requirements (concrete pad specifications)',
        'Clearances: minimum 1.5m front, 1m sides, 0.6m rear',
        'Ventilation: adequate airflow for cooling (40°C ambient)',
        'Noise: distance to neighbors, acoustic barriers needed',
        'Fuel storage: day tank vs bulk storage requirements',
        'Exhaust routing: height, direction, discharge location',
        'Access for maintenance: crane access, door widths',
      ],
      documentsProvided: [
        'Detailed site survey report with photos',
        'Load analysis spreadsheet',
        'Generator sizing recommendation',
        'Foundation drawing specifications',
        'Preliminary installation layout',
        'Budget estimate breakdown',
      ],
    },
  },
  {
    id: 'engineering-design',
    phase: 'Phase 2: Engineering & Design',
    icon: '📋',
    duration: '3-7 days',
    overview: 'Professional engineering drawings and specifications tailored to your specific requirements.',
    steps: [
      'Detailed engineering calculations',
      'Electrical single-line diagram preparation',
      'Mechanical layout and foundation design',
      'Fuel system design',
      'Control system specification',
      'Compliance documentation',
    ],
    learnMore: {
      engineeringScope: [
        'Short circuit analysis and coordination study',
        'Voltage drop calculations for cable sizing',
        'Grounding and earthing system design',
        'Lightning protection assessment',
        'Load shedding and load management schemes',
        'Paralleling system design (if multiple units)',
        'Synchronization requirements',
      ],
      drawingsProvided: [
        'Site layout plan (1:100 scale)',
        'Foundation detail drawings',
        'Electrical single-line diagram',
        'Wiring diagrams and schedules',
        'Control panel schematic',
        'Fuel system layout',
        'Exhaust and ventilation drawings',
      ],
      complianceStandards: [
        'KEBS standards for electrical installations',
        'IEC 60364 for wiring regulations',
        'ISO 8528 for generating sets',
        'Local county building codes',
        'NEMA requirements for outdoor equipment',
        'Environmental impact guidelines',
        'Fire safety regulations',
      ],
    },
  },
  {
    id: 'equipment-procurement',
    phase: 'Phase 3: Equipment Procurement',
    icon: '📦',
    duration: '2-8 weeks',
    overview: 'Sourcing and delivery of all installation materials and the generator unit.',
    steps: [
      'Generator unit ordering',
      'Transfer switch procurement',
      'Cabling and accessories sourcing',
      'Fuel tank and piping materials',
      'Foundation materials',
      'Acoustic enclosure (if required)',
    ],
    learnMore: {
      generatorSelection: [
        'Brand options: Cummins, Caterpillar, Perkins, FG Wilson, Kohler',
        'Duty rating: Standby, Prime, Continuous',
        'Fuel type: Diesel (most common), Natural gas, Bi-fuel',
        'Voltage: 415V (3-phase), 240V (single-phase)',
        'Enclosure: Open, Soundproof (65-75dB at 1m)',
        'Control panel: Manual, Auto start, Remote monitoring',
        'Warranty: Standard 1-2 years, extended up to 5 years',
      ],
      transferSwitchOptions: [
        'Manual transfer switch (MTS) - Budget option',
        'Automatic transfer switch (ATS) - Standard',
        'Bypass isolation transfer switch (BITS) - Premium',
        'Closed transition (make-before-break) for sensitive loads',
        'Open transition with programmable delay',
        'Soft transfer for paralleling applications',
      ],
      deliveryConsiderations: [
        'Lead time varies: 2 weeks (local stock) to 8 weeks (factory order)',
        'Shipping method: Road transport, containerized',
        'Crane/forklift requirements for offloading',
        'Site access assessment for delivery vehicle',
        'Storage requirements if site not ready',
        'Insurance coverage during transit',
      ],
    },
  },
  {
    id: 'civil-works',
    phase: 'Phase 4: Civil Works',
    icon: '🏗️',
    duration: '3-7 days',
    overview: 'Foundation preparation and structural works for permanent installation.',
    steps: [
      'Site excavation and leveling',
      'Anti-vibration foundation construction',
      'Concrete curing period',
      'Cable trench excavation',
      'Fuel tank base preparation',
      'Drainage system installation',
    ],
    learnMore: {
      foundationTypes: [
        'Concrete pad: Standard for most installations (300mm thick)',
        'Raised plinth: For flood-prone areas (450-600mm height)',
        'Steel frame: For rooftop installations',
        'Anti-vibration mounts: For sensitive locations',
        'Inertia base: For critical applications (hospital, data center)',
        'Spring isolators: Maximum vibration reduction',
      ],
      foundationSpecifications: [
        'Concrete grade: Minimum C25/30 (25 N/mm²)',
        'Reinforcement: Y12 bars at 200mm centers',
        'Curing time: Minimum 7 days before loading',
        'Anchor bolts: M20 grade 8.8, 300mm embedment',
        'Levelness tolerance: ±3mm across pad',
        'Drainage slope: 1:100 away from generator',
      ],
      sitePreparation: [
        'Clear vegetation and topsoil',
        'Compact subgrade to 95% Standard Proctor',
        'Install formwork with correct dimensions',
        'Place waterproof membrane if required',
        'Install anchor bolt template',
        'Pour and vibrate concrete',
        'Cure and protect from rain',
      ],
    },
  },
  {
    id: 'mechanical-installation',
    phase: 'Phase 5: Mechanical Installation',
    icon: '🔧',
    duration: '2-4 days',
    overview: 'Physical placement and connection of all mechanical systems.',
    steps: [
      'Generator positioning using crane/forklift',
      'Leveling and anchor bolt securing',
      'Exhaust system installation',
      'Fuel piping and tank connection',
      'Coolant system setup',
      'Ventilation louver installation',
    ],
    learnMore: {
      riggingRequirements: [
        'Crane capacity: Generator weight + 25% safety factor',
        'Lifting points: Use designated lifting eyes only',
        'Spreader bar: Required for units over 2 tons',
        'Ground conditions: Verify crane outrigger placement',
        'Clearances: Overhead power lines, structures',
        'Personnel: Certified rigger and signal person',
      ],
      exhaustSystemDesign: [
        'Pipe diameter: Match engine outlet size',
        'Material: Black steel schedule 40 (indoor), stainless (outdoor)',
        'Flexible coupling: 300-600mm from turbo outlet',
        'Insulation: Ceramic fiber blanket, aluminum jacket',
        'Rain cap: Butterfly or mushroom type',
        'Silencer: Residential (25dB), industrial (15dB)',
        'Stack height: Minimum 1m above roof line',
      ],
      fuelSystemComponents: [
        'Day tank: 8-24 hour capacity (integrated or separate)',
        'Bulk tank: 3-7 day capacity (above ground or underground)',
        'Transfer pump: Electric or pneumatic',
        'Fuel lines: Black steel schedule 40 or copper',
        'Fuel filter: Primary and secondary',
        'Leak detection: Electronic sensor and containment',
        'Fill and vent provisions',
      ],
    },
  },
  {
    id: 'electrical-installation',
    phase: 'Phase 6: Electrical Installation',
    icon: '⚡',
    duration: '3-5 days',
    overview: 'Complete electrical wiring and integration with your power system.',
    steps: [
      'Main power cable installation',
      'Transfer switch wiring',
      'Control cable connections',
      'Earthing/grounding system',
      'Battery charger connection',
      'Remote monitoring setup',
    ],
    learnMore: {
      cableInstallation: [
        'Cable type: XLPE insulated, armored (underground)',
        'Sizing: Based on full load current + 25% derating',
        'Route: Shortest path, avoiding heat sources',
        'Burial depth: Minimum 600mm, protective tiles above',
        'Termination: Proper lugs, heat shrink insulation',
        'Marking: Phase colors, circuit identification',
        'Testing: Insulation resistance, continuity',
      ],
      earthingSystem: [
        'Earth electrode: Copper-clad steel rod, 3m x 16mm',
        'Minimum: 2 electrodes, 3m apart',
        'Target resistance: <5 ohms (generator), <1 ohm (high voltage)',
        'Earth bar: Copper, 50x6mm minimum',
        'Bonding: Generator frame, tank, fence, ATS',
        'Lightning: Separate earth if required',
        'Testing: Fall-of-potential method',
      ],
      controlWiring: [
        'Control voltage: 12V DC (starting), 240V AC (auxiliary)',
        'Remote start: 2-wire (momentary) or 3-wire (maintained)',
        'Modbus RS485: For BMS integration',
        'Analog signals: 4-20mA for load, fuel level',
        'Digital signals: Run status, fault, low fuel',
        'Shielded cable: For all control wiring',
        'Segregation: Power and control in separate trays',
      ],
    },
  },
  {
    id: 'testing-commissioning',
    phase: 'Phase 7: Testing & Commissioning',
    icon: '✅',
    duration: '1-2 days',
    overview: 'Comprehensive testing to ensure safe and reliable operation.',
    steps: [
      'Pre-start inspections and checks',
      'Engine start and idle testing',
      'Load bank testing',
      'Transfer switch operation test',
      'Protection relay calibration',
      'Full load acceptance test',
    ],
    learnMore: {
      preStartChecks: [
        'Oil level: Between min and max on dipstick',
        'Coolant level: At proper level in expansion tank',
        'Fuel level: Minimum 50% for testing',
        'Battery: 12.6V (no load), correct polarity',
        'Air filter: Clean, properly seated',
        'Belts: Correct tension (10mm deflection)',
        'All guards and covers in place',
      ],
      loadBankTesting: [
        'Purpose: Verify rated output capacity',
        'Duration: 2 hours at various loads',
        'Load steps: 25%, 50%, 75%, 100%, 110%',
        'Measurements: Voltage, current, frequency, kW',
        'Temperature monitoring: Coolant, oil, exhaust',
        'Fuel consumption: Verify against specifications',
        'Results: Documented test report',
      ],
      acceptanceCriteria: [
        'Voltage: ±2.5% of nominal (e.g., 415V ±10V)',
        'Frequency: ±0.5% of 50Hz (49.75-50.25Hz)',
        'Voltage transient: ±15% for step load, recover in 3s',
        'Frequency transient: ±10% for step load, recover in 5s',
        'Transfer time: <10 seconds (ATS)',
        'Engine start: Within 10 seconds of signal',
        'No oil or fuel leaks',
      ],
    },
  },
  {
    id: 'handover-training',
    phase: 'Phase 8: Handover & Training',
    icon: '🎓',
    duration: '1 day',
    overview: 'Complete documentation and operator training for your team.',
    steps: [
      'As-built documentation package',
      'Operation manual provision',
      'Operator training session',
      'Maintenance schedule handover',
      'Emergency procedure briefing',
      'Warranty registration',
    ],
    learnMore: {
      documentationPackage: [
        'Installation certificate (signed by engineer)',
        'Test and commissioning reports',
        'As-built drawings (PDF and AutoCAD)',
        'Equipment manuals (generator, ATS, controls)',
        'Warranty certificates and registration',
        'Spare parts list and pricing',
        'Maintenance schedule and checklist',
      ],
      trainingTopics: [
        'Generator start and stop procedures',
        'ATS operation and manual bypass',
        'Control panel navigation and indicators',
        'Daily, weekly, monthly checks',
        'Fuel management and refilling',
        'Common fault codes and reset procedures',
        'Emergency shutdown procedures',
      ],
      warrantyTerms: [
        'Standard: 12-24 months parts and labor',
        'Extended: Up to 5 years available',
        'Coverage: Manufacturing defects',
        'Exclusions: Consumables, abuse, improper fuel',
        'Conditions: Regular servicing by authorized dealer',
        'Claims: Contact within 7 days of fault',
        'Registration: Required for warranty activation',
      ],
    },
  },
];

const complianceRequirements = [
  {
    category: 'Electrical Compliance',
    icon: '⚡',
    requirements: [
      'KEBS electrical installation certification',
      'Inspection by licensed electrical contractor',
      'Installation certificate (Form D)',
      'Earth resistance test certificate',
      'Insulation resistance test results',
    ],
  },
  {
    category: 'Environmental Compliance',
    icon: '🌍',
    requirements: [
      'NEMA environmental permit (for large installations)',
      'Noise level compliance (<75dB at property boundary)',
      'Fuel storage permit (for bulk tanks >1000L)',
      'Spill containment certification',
      'Exhaust emission compliance',
    ],
  },
  {
    category: 'Building & Safety',
    icon: '🏢',
    requirements: [
      'County building permit (if structural work)',
      'Fire safety approval (for indoor installations)',
      'Access road and fire lane clearances',
      'Emergency shutoff accessibility',
      'Signage and safety labeling',
    ],
  },
  {
    category: 'Utility Requirements',
    icon: '🔌',
    requirements: [
      'Kenya Power notification',
      'Anti-islanding protection (for paralleling)',
      'Metering provisions if required',
      'Interconnection agreement',
      'Transfer switch certification',
    ],
  },
];

const installationTypes = [
  {
    type: 'Indoor Installation',
    icon: '🏭',
    suitable: 'Factories, warehouses, data centers, hospitals',
    advantages: [
      'Weather protection - no corrosion',
      'Security - reduced theft risk',
      'Acoustic control easier',
      'Longer equipment life',
    ],
    requirements: [
      'Adequate room size (3x generator footprint)',
      'Fire-rated construction (2-hour minimum)',
      'Ventilation system with louvers',
      'Fire suppression system',
      'Exhaust extraction system',
    ],
    considerations: [
      'Higher construction cost',
      'Ventilation system maintenance',
      'Fire safety requirements',
      'Future expansion limitations',
    ],
  },
  {
    type: 'Outdoor Installation',
    icon: '☀️',
    suitable: 'Commercial buildings, hotels, residential compounds',
    advantages: [
      'Lower installation cost',
      'Natural ventilation',
      'Easier maintenance access',
      'Flexible positioning',
    ],
    requirements: [
      'Weatherproof enclosure or canopy',
      'Proper drainage system',
      'Security fencing or barriers',
      'Corrosion protection',
      'UV-resistant cabling',
    ],
    considerations: [
      'Weather exposure effects',
      'Security measures needed',
      'Noise impact on neighbors',
      'Aesthetic integration',
    ],
  },
  {
    type: 'Rooftop Installation',
    icon: '🏗️',
    suitable: 'High-rise buildings, space-constrained sites',
    advantages: [
      'Saves ground space',
      'Better security',
      'Exhaust disperses quickly',
      'Reduced noise at ground level',
    ],
    requirements: [
      'Structural assessment (load bearing)',
      'Crane or helicopter access',
      'Vibration isolation critical',
      'Fuel transfer system',
      'Fall protection systems',
    ],
    considerations: [
      'Higher installation cost',
      'Difficult maintenance access',
      'Fuel transport challenges',
      'Structural modifications may be needed',
    ],
  },
  {
    type: 'Container/Trailer Mounted',
    icon: '📦',
    suitable: 'Events, construction sites, temporary power',
    advantages: [
      'Plug and play installation',
      'Relocatable asset',
      'Pre-tested at factory',
      'Quick deployment',
    ],
    requirements: [
      'Level, compacted surface',
      'Temporary fuel supply',
      'Electrical distribution',
      'Security measures',
      'Environmental protection',
    ],
    considerations: [
      'Higher equipment cost',
      'Transport logistics',
      'May need permits for long-term use',
      'Limited customization',
    ],
  },
];

function InstallationPhaseCard({ phase, isExpanded, onToggle }: { phase: typeof installationPhases[0]; isExpanded: boolean; onToggle: () => void }) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 overflow-hidden">
      <button 
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-all duration-300"
      >
        <div className="flex items-center gap-4">
          <div className="text-4xl">{phase.icon}</div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-white">{phase.phase}</h3>
            <p className="text-green-400 text-sm font-medium">Duration: {phase.duration}</p>
          </div>
        </div>
        <div className={`text-2xl text-white/60 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/10"
          >
            <div className="p-6 space-y-6">
              <p className="text-white/80 text-lg">{phase.overview}</p>
              
              {/* Basic Steps */}
              <div>
                <h4 className="text-green-400 font-bold mb-3">Key Activities:</h4>
                <ul className="grid md:grid-cols-2 gap-2">
                  {phase.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-white/80">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Learn More Sections */}
              {Object.entries(phase.learnMore).map(([key, items]) => (
                <div key={key} className="bg-white/5 rounded-xl p-4">
                  <h4 className="text-yellow-300 font-bold mb-3 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </h4>
                  <ul className="space-y-2">
                    {(items as string[]).map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-white/70 text-sm">
                        <span className="text-yellow-400 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function GeneratorInstallationPage() {
  const [expandedPhase, setExpandedPhase] = useState<string | null>('site-assessment');
  const [expandedType, setExpandedType] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black to-blue-900/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-green-500/20 rounded-full text-green-400 text-sm font-medium">
              Professional Generator Installation Services
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-300 via-white to-green-300 bg-clip-text text-transparent">
              Complete Generator Installation
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              From site assessment to commissioning, we handle every aspect of your generator installation 
              with precision engineering and strict compliance to all Kenya standards.
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { value: '1,200+', label: 'Installations Completed', icon: '🏗️' },
              { value: '47', label: 'Counties Covered', icon: '📍' },
              { value: '24/7', label: 'Emergency Support', icon: '🔧' },
              { value: '100%', label: 'Compliance Rate', icon: '✅' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-green-400">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Process - 8 Phases */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our 8-Phase Installation Process
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Click on each phase to learn more about what's involved. Every step is documented 
              and executed by certified technicians.
            </p>
          </div>
          
          <div className="space-y-4">
            {installationPhases.map((phase) => (
              <InstallationPhaseCard
                key={phase.id}
                phase={phase}
                isExpanded={expandedPhase === phase.id}
                onToggle={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Installation Types */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Installation Types
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              We specialize in all types of generator installations. Choose the option that best suits your facility.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {installationTypes.map((type) => (
              <div
                key={type.type}
                className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedType(expandedType === type.type ? null : type.type)}
                  className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{type.icon}</div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-white">{type.type}</h3>
                      <p className="text-blue-400 text-sm">{type.suitable}</p>
                    </div>
                  </div>
                  <div className={`text-2xl text-white/60 transition-transform duration-300 ${expandedType === type.type ? 'rotate-180' : ''}`}>
                    ▼
                  </div>
                </button>
                
                <AnimatePresence>
                  {expandedType === type.type && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/10"
                    >
                      <div className="p-6 grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-green-400 font-bold mb-3">Advantages:</h4>
                          <ul className="space-y-2">
                            {type.advantages.map((adv, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-white/80 text-sm">
                                <span className="text-green-400">✓</span>
                                <span>{adv}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-yellow-400 font-bold mb-3">Requirements:</h4>
                          <ul className="space-y-2">
                            {type.requirements.map((req, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-white/80 text-sm">
                                <span className="text-yellow-400">•</span>
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="md:col-span-2 bg-white/5 rounded-lg p-4">
                          <h4 className="text-orange-400 font-bold mb-3">Key Considerations:</h4>
                          <ul className="grid md:grid-cols-2 gap-2">
                            {type.considerations.map((con, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-white/70 text-sm">
                                <span className="text-orange-400">⚠</span>
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Requirements */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Compliance & Certification
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              We ensure your installation meets all regulatory requirements in Kenya.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {complianceRequirements.map((comp, idx) => (
              <div key={idx} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="text-3xl mb-4">{comp.icon}</div>
                <h3 className="text-lg font-bold text-white mb-4">{comp.category}</h3>
                <ul className="space-y-2">
                  {comp.requirements.map((req, reqIdx) => (
                    <li key={reqIdx} className="flex items-start gap-2 text-white/70 text-sm">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-900/50 to-blue-900/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Install Your Generator?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Contact us for a free site assessment and detailed quotation. Our engineers are ready to design 
            the perfect installation for your facility.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0768860655"
              className="px-8 py-4 bg-gradient-to-r from-green-400 to-green-600 text-black font-bold rounded-xl hover:from-green-500 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg shadow-green-500/30"
            >
              📞 Call: 0768 860 655
            </a>
            <a
              href="tel:0782914717"
              className="px-8 py-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold rounded-xl hover:from-blue-500 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30"
            >
              📞 Call: 0782914717
            </a>
          </div>
          <div className="mt-8">
            <Link
              href="/generators/maintenance"
              className="text-green-400 hover:text-green-300 underline"
            >
              Already have a generator? View our maintenance services →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <section className="py-10 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/generators" className="text-white/60 hover:text-green-400 transition">Generators</Link>
            <Link href="/generators/maintenance" className="text-white/60 hover:text-green-400 transition">Maintenance</Link>
            <Link href="/generators/spare-parts" className="text-white/60 hover:text-green-400 transition">Spare Parts</Link>
            <Link href="/generators/rental" className="text-white/60 hover:text-green-400 transition">Rental</Link>
            <Link href="/generators/used" className="text-white/60 hover:text-green-400 transition">Used Generators</Link>
            <Link href="/solar" className="text-white/60 hover:text-green-400 transition">Solar Solutions</Link>
            <Link href="/contact" className="text-white/60 hover:text-green-400 transition">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
