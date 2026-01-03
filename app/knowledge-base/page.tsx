'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Knowledge base articles/guides
const KNOWLEDGE_BASE = {
  categories: [
    {
      id: 'generators',
      name: 'Generators',
      icon: '⚡',
      description: 'Operation, maintenance, and troubleshooting guides'
    },
    {
      id: 'solar',
      name: 'Solar Systems',
      icon: '☀️',
      description: 'Installation, sizing, and maintenance'
    },
    {
      id: 'ups',
      name: 'UPS Systems',
      icon: '🔋',
      description: 'Setup, battery care, and troubleshooting'
    },
    {
      id: 'electrical',
      name: 'Electrical',
      icon: '🔌',
      description: 'High voltage, ATS, and control systems'
    },
    {
      id: 'maintenance',
      name: 'Maintenance',
      icon: '🔧',
      description: 'Schedules, checklists, and best practices'
    },
    {
      id: 'safety',
      name: 'Safety',
      icon: '⚠️',
      description: 'Safety procedures and compliance'
    }
  ],
  articles: [
    // Generator Articles
    {
      id: 'gen-sizing-guide',
      category: 'generators',
      title: 'Complete Generator Sizing Guide',
      description: 'How to calculate the right generator size for your home or business',
      difficulty: 'beginner',
      readTime: '10 min',
      content: `
## Generator Sizing Guide

Choosing the right generator size is crucial for reliable backup power. This guide walks you through the process.

### Step 1: List Your Loads

Make a list of all electrical equipment you want to power:
- Lights
- Refrigerator/Freezer
- AC units
- Computers
- Pumps
- Industrial equipment

### Step 2: Calculate Running Watts

Add up the running (continuous) wattage of all items. Check nameplates or use these estimates:
| Equipment | Running Watts |
|-----------|---------------|
| LED Bulb | 10W |
| Refrigerator | 150-400W |
| AC 1.5HP | 1,200W |
| Computer | 200-400W |
| Borehole Pump 1HP | 750W |

### Step 3: Account for Starting Current

Motors and compressors need 2-6x their running power to start:
- AC units: 3x starting multiplier
- Pumps: 3x starting multiplier
- Refrigerators: 2x starting multiplier

### Step 4: Add Safety Margin

Add 25% to your calculated load for:
- Future expansion
- Measurement inaccuracies
- Generator longevity

### Formula

**Recommended kVA = (Total Running kW × 1.25) ÷ 0.8**

### Example

Home with:
- 10 LED lights = 100W
- 2 AC 1.5HP = 2,400W
- Refrigerator = 300W
- TV + Electronics = 500W

Total Running = 3,300W = 3.3kW
With 25% margin = 4.1kW
Generator Size = 4.1 ÷ 0.8 = **5.1 kVA minimum**

**Recommendation: 7.5 - 10 kVA generator**

### Pro Tips

1. Always round up to the next standard size
2. Consider standby vs prime rating
3. Plan for future growth
4. Consult a professional for commercial loads
      `,
      tags: ['sizing', 'kva', 'calculation', 'beginner']
    },
    {
      id: 'gen-maintenance-schedule',
      category: 'generators',
      title: 'Generator Maintenance Schedule',
      description: 'Complete maintenance schedule to maximize generator lifespan',
      difficulty: 'intermediate',
      readTime: '8 min',
      content: `
## Generator Maintenance Schedule

Regular maintenance extends generator life from 15,000 to 25,000+ hours.

### Daily Checks (Before Each Use)
- [ ] Check oil level on dipstick
- [ ] Check coolant level (when cold)
- [ ] Check fuel level
- [ ] Visual inspection for leaks
- [ ] Check battery connections
- [ ] Clear area around generator

### Weekly Checks
- [ ] Run generator for 30 minutes under load
- [ ] Check air filter condition
- [ ] Inspect belts for wear/tension
- [ ] Check for unusual noises or vibrations
- [ ] Verify all gauges working

### 250 Hours / 6 Months
- [ ] Change engine oil and filter
- [ ] Replace fuel filter
- [ ] Check/clean air filter
- [ ] Test battery voltage and connections
- [ ] Inspect coolant hoses
- [ ] Check governor operation

### 500 Hours / Annually
- [ ] All 250-hour items plus:
- [ ] Replace air filter
- [ ] Replace spark plugs (petrol) / check injectors (diesel)
- [ ] Flush cooling system
- [ ] Test thermostat
- [ ] Inspect alternator brushes
- [ ] Load bank test
- [ ] Check AVR settings

### 1000 Hours / 2 Years
- [ ] All previous items plus:
- [ ] Replace coolant
- [ ] Replace belts
- [ ] Valve clearance adjustment
- [ ] Injector testing/cleaning (diesel)
- [ ] Full electrical system check

### 2000+ Hours
- [ ] Major overhaul assessment
- [ ] Turbo inspection (if equipped)
- [ ] Bearing inspection
- [ ] Cylinder compression test

### Maintenance Log Template

| Date | Hours | Service Performed | Parts Used | Technician |
|------|-------|-------------------|------------|------------|
|      |       |                   |            |            |

### Pro Tips

1. Keep a detailed maintenance log
2. Use genuine or OEM-equivalent parts
3. Never skip oil changes
4. Run generator monthly even if not needed
5. Consider an AMC for professional care
      `,
      tags: ['maintenance', 'schedule', 'oil change', 'checklist']
    },
    {
      id: 'gen-fuel-management',
      category: 'generators',
      title: 'Diesel Fuel Management Best Practices',
      description: 'How to store, maintain, and manage diesel fuel for generators',
      difficulty: 'intermediate',
      readTime: '7 min',
      content: `
## Diesel Fuel Management

Poor fuel quality is the #1 cause of generator failures. Follow these practices.

### Fuel Storage

**Tank Sizing:**
- Calculate: Generator kVA × 0.25 L/hr × desired runtime hours
- Example: 100kVA × 0.25 × 24 hours = 600 liters minimum

**Tank Requirements:**
- Double-walled or bunded for spill containment
- Vented with water-excluding breather
- Fitted with water drain valve
- Lockable fill cap
- Level indicator

### Fuel Quality

**Good Diesel Should Be:**
- Clear, bright appearance
- No visible water or sediment
- Specific gravity: 0.82-0.86
- Sulphur content: <500ppm (KEBS standard)

**Warning Signs:**
- Cloudy or hazy appearance
- Dark color or particles
- Foul smell
- Water droplets

### Preventing Contamination

1. **Water:** Install water separator, drain tank regularly
2. **Dirt:** Use filtered fill system, keep caps clean
3. **Bacteria:** Use biocide treatment quarterly
4. **Oxidation:** Turn over fuel within 6 months

### Fuel Treatment Products

| Product | Purpose | Frequency |
|---------|---------|-----------|
| Biocide | Kill bacteria/algae | Every 6 months |
| Stabilizer | Prevent oxidation | When stored >3 months |
| Water remover | Absorb moisture | Monthly |
| Injector cleaner | Clean fuel system | Every 500 hours |

### Fuel Consumption Estimates

| Generator Size | Consumption at 75% Load |
|----------------|-------------------------|
| 20 kVA | 4-5 L/hr |
| 50 kVA | 10-12 L/hr |
| 100 kVA | 20-25 L/hr |
| 200 kVA | 40-50 L/hr |
| 500 kVA | 100-120 L/hr |

### Emergency Fuel Procedures

1. Never run tank completely empty (damages fuel pump)
2. Keep minimum 20% fuel at all times
3. Have emergency fuel supplier contact ready
4. Document fuel deliveries and consumption
      `,
      tags: ['fuel', 'diesel', 'storage', 'contamination']
    },

    // Solar Articles
    {
      id: 'solar-basics',
      category: 'solar',
      title: 'Solar Power System Basics',
      description: 'Understanding solar panels, inverters, and system types',
      difficulty: 'beginner',
      readTime: '12 min',
      content: `
## Solar Power System Basics

Learn how solar systems work and which type is right for you.

### How Solar Works

1. **Solar Panels** convert sunlight to DC electricity
2. **Inverter** converts DC to AC (usable power)
3. **Grid/Battery** stores or exports excess power

### System Types

#### 1. On-Grid (Grid-Tied)
- Connected to KPLC
- No batteries needed
- Export excess to grid (net metering)
- Stops during blackouts
- **Best for:** Lowest cost, grid-reliable areas

#### 2. Off-Grid
- Completely independent
- Battery storage required
- Works during blackouts
- Higher cost
- **Best for:** Remote areas, unreliable grid

#### 3. Hybrid
- Grid connected + batteries
- Works during blackouts
- Best of both worlds
- Highest flexibility
- **Best for:** Areas with frequent outages

### Key Components

**Solar Panels:**
- Monocrystalline: 19-22% efficiency, premium
- Polycrystalline: 15-17% efficiency, budget
- Lifespan: 25-30 years

**Inverters:**
- String inverter: Economical, single point of failure
- Microinverters: Per-panel optimization, higher cost
- Hybrid inverter: Includes charge controller

**Batteries:**
- Lithium (LiFePO4): 10-15 year life, 80% DOD
- Lead-acid: 3-5 year life, 50% DOD, lower cost

### Kenya Solar Potential

Kenya receives excellent solar radiation:
- **5.5-5.9 kWh/m²/day** average
- 300+ sunny days per year
- Optimal for solar investment

### ROI Expectations

| System Size | Cost (KES) | Monthly Savings | ROI Period |
|-------------|------------|-----------------|------------|
| 3 kW | 400K | 8K-12K | 3-4 years |
| 5 kW | 600K | 15K-20K | 3-4 years |
| 10 kW | 1.2M | 30K-40K | 3-4 years |

### Getting Started

1. Calculate your monthly consumption (kWh)
2. Determine system type needed
3. Get professional site assessment
4. Compare quotes from installers
5. Apply for KPLC net metering (if applicable)
      `,
      tags: ['solar', 'basics', 'panels', 'inverter', 'beginner']
    },
    {
      id: 'solar-net-metering',
      category: 'solar',
      title: 'KPLC Net Metering Guide',
      description: 'How to apply for and benefit from net metering in Kenya',
      difficulty: 'intermediate',
      readTime: '8 min',
      content: `
## KPLC Net Metering Guide

Export excess solar power to the grid and reduce your electricity bill.

### What is Net Metering?

Net metering allows you to:
- Export excess solar power to KPLC grid
- Receive credit on your electricity bill
- Use grid power when solar is insufficient
- Only pay for "net" consumption

### Eligibility

- System size: 1 kW to 1 MW
- Must be connected to KPLC grid
- Professional installation required
- System must meet KPLC technical standards

### Application Process

**Step 1: Pre-Application**
- Get system designed by licensed installer
- Ensure roof/space suitability
- Obtain quotes

**Step 2: Submit Application**
Documents needed:
- Application form (from KPLC)
- Copy of ID/Registration certificate
- Copy of recent KPLC bill
- System design documents
- Installer license copy

**Step 3: KPLC Assessment**
- KPLC inspects your connection point
- Verifies grid compatibility
- Approves or requests modifications

**Step 4: Installation**
- Install solar system
- Install bi-directional meter
- KPLC final inspection

**Step 5: Commissioning**
- KPLC activates net metering
- Start generating credits!

### Timeline

| Step | Duration |
|------|----------|
| Application review | 14 days |
| Site assessment | 7 days |
| Approval | 14 days |
| Installation | 3-7 days |
| Final inspection | 7 days |
| **Total** | **6-8 weeks** |

### Billing Example

**Without Net Metering:**
- Consumption: 500 kWh
- Bill: 500 × KES 22 = KES 11,000

**With Net Metering:**
- Consumption: 500 kWh
- Solar generation: 400 kWh
- Export to grid: 150 kWh
- Import from grid: 250 kWh
- Net consumption: 100 kWh
- Bill: 100 × KES 22 = KES 2,200

**Savings: KES 8,800/month**

### Tips

1. Size system to match consumption, not exceed
2. Use major appliances during daylight hours
3. Monitor system performance monthly
4. Keep documentation for warranty claims
      `,
      tags: ['solar', 'kplc', 'net metering', 'grid', 'export']
    },

    // UPS Articles
    {
      id: 'ups-sizing',
      category: 'ups',
      title: 'UPS Sizing Guide',
      description: 'Calculate the right UPS size for your equipment',
      difficulty: 'beginner',
      readTime: '6 min',
      content: `
## UPS Sizing Guide

Protect your equipment with the right UPS size.

### Understanding UPS Ratings

- **VA (Volt-Amperes):** Apparent power capacity
- **Watts:** Real power (VA × Power Factor)
- **Runtime:** Backup time at given load

**Typical Power Factor: 0.6-0.8**

### Step-by-Step Sizing

**Step 1: List Critical Equipment**
| Equipment | Watts |
|-----------|-------|
| Desktop PC | 200-400W |
| Monitor | 30-60W |
| Router | 10-20W |
| Server | 300-800W |
| Printer (laser) | 400-600W |

**Step 2: Add Total Watts**
Example: PC (300W) + Monitor (50W) + Router (15W) = 365W

**Step 3: Calculate VA Required**
VA = Watts ÷ Power Factor
VA = 365 ÷ 0.8 = **456 VA minimum**

**Step 4: Add 30% Headroom**
456 × 1.3 = **593 VA**

**Recommendation: 600-750 VA UPS**

### Runtime Estimation

Runtime depends on:
- UPS battery capacity (Ah)
- Connected load (Watts)

**Rough Estimates for Standard UPS:**

| UPS Size | 50% Load | 75% Load | 100% Load |
|----------|----------|----------|-----------|
| 600 VA | 15 min | 8 min | 4 min |
| 1000 VA | 20 min | 12 min | 6 min |
| 1500 VA | 25 min | 15 min | 8 min |
| 3000 VA | 30 min | 18 min | 10 min |

### UPS Types

1. **Standby/Offline:** Basic protection, 5-12ms switchover
2. **Line-Interactive:** AVR included, 2-4ms switchover
3. **Online/Double-Conversion:** Zero switchover, best protection

### Application Recommendations

| Use Case | UPS Type | Size |
|----------|----------|------|
| Home PC | Standby | 600-1000 VA |
| Home Office | Line-Interactive | 1000-1500 VA |
| Small Server | Line-Interactive | 1500-3000 VA |
| Server Room | Online | 3000-10000 VA |
| Data Center | Online | 10-800 kVA |
      `,
      tags: ['ups', 'sizing', 'backup', 'battery', 'runtime']
    },

    // Maintenance Articles
    {
      id: 'preventive-maintenance',
      category: 'maintenance',
      title: 'Preventive Maintenance Benefits',
      description: 'Why preventive maintenance saves money and prevents failures',
      difficulty: 'beginner',
      readTime: '5 min',
      content: `
## Preventive Maintenance Benefits

Regular maintenance prevents costly breakdowns and extends equipment life.

### Cost Comparison

| Approach | Annual Cost | Downtime Risk |
|----------|-------------|---------------|
| Reactive (fix when broken) | KES 300K+ | High (24-72 hrs) |
| Preventive (scheduled) | KES 80-120K | Low (planned) |
| Predictive (condition-based) | KES 100-150K | Very Low |

### Key Benefits

1. **Reliability:** 98%+ uptime vs 80% for reactive
2. **Cost Savings:** 25-30% lower total cost
3. **Equipment Life:** 2x longer lifespan
4. **Safety:** Prevent hazardous failures
5. **Planning:** Scheduled downtime, not emergencies

### What Gets Checked

**Engine:**
- Oil level and quality
- Coolant level and condition
- Belt tension and wear
- Filter conditions
- Fuel system integrity

**Electrical:**
- Battery condition
- Terminal connections
- Output voltage/frequency
- AVR operation
- Control panel functions

**Cooling:**
- Radiator cleanliness
- Hose conditions
- Thermostat operation
- Fan belt tension

### AMC (Annual Maintenance Contract)

**Includes:**
- 2-4 scheduled visits per year
- All routine maintenance
- Priority emergency response
- Discounted parts
- Detailed service reports

**Cost:** Typically 3-5% of equipment value annually

### ROI of Preventive Maintenance

**Example: 100kVA Generator**
- Equipment value: KES 2,500,000
- AMC cost: KES 100,000/year
- Emergency repair prevented: KES 250,000
- Downtime cost prevented: KES 150,000/day

**ROI: 300-400%**
      `,
      tags: ['maintenance', 'preventive', 'amc', 'cost savings']
    },

    // Safety Articles
    {
      id: 'generator-safety',
      category: 'safety',
      title: 'Generator Safety Guidelines',
      description: 'Essential safety practices when operating generators',
      difficulty: 'beginner',
      readTime: '7 min',
      content: `
## Generator Safety Guidelines

Follow these guidelines to operate generators safely.

### ⚠️ Critical Safety Rules

1. **NEVER run indoors or enclosed spaces** (carbon monoxide kills)
2. **NEVER refuel while running or hot**
3. **NEVER backfeed into house wiring without transfer switch**
4. **ALWAYS ground the generator properly**
5. **ALWAYS keep fire extinguisher nearby**

### Carbon Monoxide (CO) Danger

**Symptoms of CO poisoning:**
- Headache
- Dizziness
- Nausea
- Confusion
- Unconsciousness
- Death

**Prevention:**
- Operate outdoors only
- Position exhaust away from windows
- Install CO detectors in nearby buildings
- Never use in garage, even with door open

### Electrical Safety

**Before Starting:**
- Inspect cords for damage
- Use heavy-duty extension cords
- Keep connections dry
- Don't overload circuits

**Transfer Switch:**
- Required for home connections
- Prevents backfeed into grid
- Protects utility workers
- KPLC requirement

### Fuel Safety

**Storage:**
- Use approved containers
- Store away from generator
- Keep away from heat/flames
- Maximum 25 liters in residence

**Refueling:**
- Turn off and cool down first
- Refuel outdoors
- Clean up spills immediately
- No smoking within 5 meters

### Hot Surface Warnings

**Generator parts that get HOT:**
- Engine block
- Exhaust system (500°C+)
- Alternator
- Cooling system

**Allow 30+ minutes cooling before:**
- Checking coolant
- Performing maintenance
- Covering generator

### Emergency Procedures

**Fire:**
1. Shut off fuel supply if safe
2. Use CO2 or dry powder extinguisher
3. Never use water on fuel fire
4. Evacuate and call fire services

**Electrical Shock:**
1. Don't touch victim
2. Disconnect power source
3. Call emergency services
4. Begin CPR if trained

### Personal Protective Equipment (PPE)

- Safety glasses
- Hearing protection (>85dB)
- Gloves (oil-resistant)
- Safety boots
- High-visibility vest (commercial sites)
      `,
      tags: ['safety', 'generator', 'carbon monoxide', 'electrical', 'fire']
    }
  ]
};

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<typeof KNOWLEDGE_BASE.articles[0] | null>(null);

  const filteredArticles = useMemo(() => {
    return KNOWLEDGE_BASE.articles.filter(article => {
      const matchesCategory = !selectedCategory || article.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (selectedArticle) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        {/* Article View */}
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <button
            onClick={() => setSelectedArticle(null)}
            className="mb-6 px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors"
          >
            ← Back to Knowledge Base
          </button>

          <article className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                  {KNOWLEDGE_BASE.categories.find(c => c.id === selectedArticle.category)?.name}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm capitalize ${getDifficultyColor(selectedArticle.difficulty)}`}>
                  {selectedArticle.difficulty}
                </span>
                <span className="px-3 py-1 bg-white/10 text-gray-400 rounded-full text-sm">
                  ⏱️ {selectedArticle.readTime}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{selectedArticle.title}</h1>
              <p className="text-gray-400">{selectedArticle.description}</p>
            </div>

            <div className="prose prose-invert max-w-none">
              <div 
                className="text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: selectedArticle.content
                    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-white mt-8 mb-4">$1</h2>')
                    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-white mt-6 mb-3">$1</h3>')
                    .replace(/^#### (.*$)/gm, '<h4 class="text-lg font-medium text-white mt-4 mb-2">$1</h4>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                    .replace(/^\| (.*) \|$/gm, (match, content) => {
                      const cells = content.split(' | ').map((cell: string) => `<td class="border border-white/20 px-4 py-2">${cell}</td>`).join('');
                      return `<tr>${cells}</tr>`;
                    })
                    .replace(/^- \[ \] (.*)$/gm, '<div class="flex items-center gap-2 my-1"><input type="checkbox" disabled class="rounded"> <span>$1</span></div>')
                    .replace(/^- (.*)$/gm, '<li class="ml-4">$1</li>')
                    .replace(/^\d\. (.*)$/gm, '<li class="ml-4 list-decimal">$1</li>')
                    .replace(/\n\n/g, '</p><p class="my-4">')
                }}
              />
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <h4 className="text-sm text-gray-500 mb-3">Related Topics:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedArticle.tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => { setSelectedArticle(null); setSearchQuery(tag); }}
                    className="px-3 py-1 bg-white/10 text-gray-400 rounded-full text-sm hover:bg-white/20 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </article>

          {/* CTA */}
          <div className="mt-8 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Need Professional Help?</h3>
            <p className="text-gray-400 mb-4">Our experts are ready to assist with your power needs</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/booking" className="px-6 py-3 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 transition-colors">
                📅 Book Service
              </Link>
              <a href="https://wa.me/254768860655" className="px-6 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-colors">
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              📚 Knowledge Base
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Technical guides, tutorials, and best practices for power systems
            </p>

            {/* Search */}
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search guides... (e.g., 'generator sizing', 'solar', 'maintenance')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-14 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                !selectedCategory
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              All
            </button>
            {KNOWLEDGE_BASE.categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-6 text-gray-400">
            Showing {filteredArticles.length} of {KNOWLEDGE_BASE.articles.length} guides
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredArticles.map((article, index) => (
                <motion.button
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedArticle(article)}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 text-left hover:border-purple-500/50 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">
                      {KNOWLEDGE_BASE.categories.find(c => c.id === article.category)?.icon}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs capitalize ${getDifficultyColor(article.difficulty)}`}>
                      {article.difficulty}
                    </span>
                    <span className="text-xs text-gray-500 ml-auto">
                      ⏱️ {article.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {article.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-4">
                    {article.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-white/10 text-gray-500 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-xl font-semibold text-white mb-2">No guides found</h3>
              <p className="text-gray-400 mb-6">Try a different search term or category</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                className="px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Can't find what you're looking for?</h2>
          <p className="text-gray-400 mb-6">Our technical team is here to help</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/faq" className="px-6 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors">
              Browse FAQs
            </Link>
            <Link href="/diagnostic-suite" className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors">
              🔧 Diagnostic Suite
            </Link>
            <Link href="/contact" className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
