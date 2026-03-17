/**
 * Industry Data for B2B Landing Pages
 *
 * Comprehensive data for industry-specific landing pages targeting
 * key business sectors in Kenya. Each industry has:
 * - Specific pain points they face with power outages
 * - Tailored solutions we provide
 * - Market statistics for Kenya
 * - SEO keywords and metadata
 * - Realistic testimonials with Kenya names
 *
 * Industries Covered:
 * 1. Hotels & Hospitality
 * 2. Hospitals & Healthcare
 * 3. Schools & Universities
 * 4. Banks & Financial Services
 * 5. Manufacturing & Industries
 * 6. Flower Farms
 * 7. Real Estate & Construction
 * 8. Churches & Religious Organizations
 * 9. Government & NGOs
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface IndustryTestimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
  location: string;
  image?: string;
}

export interface IndustrySolution {
  title: string;
  description: string;
  features: string[];
  price?: string;
}

export interface IndustryPainPoint {
  title: string;
  description: string;
  cost: string; // Cost of not solving this problem
  icon: string; // Emoji icon
}

export interface IndustryFAQ {
  question: string;
  answer: string;
}

export interface Industry {
  slug: string;
  name: string;
  shortName: string;
  heroTitle: string;
  heroSubtitle: string;
  description: string;
  marketSize: string; // e.g., "16,245+ hotels in Kenya"
  marketDescription: string;
  painPoints: IndustryPainPoint[];
  solutions: IndustrySolution[];
  testimonials: IndustryTestimonial[];
  faqs: IndustryFAQ[];
  keywords: string[];
  relatedIndustries: string[]; // slugs of related industries
  ctaText: string;
  whatsappMessage: string;
  icon: string; // Emoji icon for the industry
  image?: string; // Hero image URL
  stats: {
    label: string;
    value: string;
  }[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// INDUSTRY DATA
// ═══════════════════════════════════════════════════════════════════════════════

export const INDUSTRIES: Industry[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. HOTELS & HOSPITALITY
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'hotels-hospitality',
    name: 'Hotels & Hospitality',
    shortName: 'Hotels',
    icon: '🏨',
    heroTitle: 'Never Lose a Guest to a Power Outage Again',
    heroSubtitle: 'Automatic generator changeover systems that keep your hotel running 24/7 - even when Kenya Power fails.',
    description: 'Comprehensive power solutions for hotels, lodges, resorts, and hospitality businesses across Kenya. We understand that a single power outage can destroy your TripAdvisor ratings and cost you thousands in refunds.',
    marketSize: '16,245+ hotels in Kenya',
    marketDescription: 'From budget hotels in Nairobi to luxury safari lodges in Maasai Mara, power reliability is non-negotiable in hospitality. Kenya Tourism Board reports that power-related complaints are the #2 reason for negative reviews after cleanliness.',
    painPoints: [
      {
        title: 'Guest Complaints & Bad Reviews',
        description: 'One power outage during peak hours means guests sweating without AC, no WiFi for business travelers, and dark corridors. Result: 1-star reviews that hurt bookings for months.',
        cost: 'Ksh 50,000+ per negative review in lost future bookings',
        icon: '😤'
      },
      {
        title: 'Food Spoilage in Kitchens',
        description: 'Your walk-in freezers hold Ksh 200,000+ in meat, fish, and produce. A 4-hour outage during the day can spoil everything - plus food poisoning liability.',
        cost: 'Ksh 200,000-500,000 per incident',
        icon: '🍖'
      },
      {
        title: 'Security System Failures',
        description: 'CCTV cameras, electronic locks, perimeter alarms - all go dark. Thieves know exactly when hotels are vulnerable. Insurance won\'t cover losses if your backup power failed.',
        cost: 'Unlimited liability + insurance claims denied',
        icon: '🚨'
      },
      {
        title: 'Conference & Event Cancellations',
        description: 'A corporate event with 200 guests, projectors die, microphones cut out, kitchen can\'t serve lunch. Your reputation takes years to rebuild.',
        cost: 'Ksh 500,000+ refunds + legal fees',
        icon: '🎤'
      },
      {
        title: 'Pool & Spa Equipment Damage',
        description: 'Pumps, heaters, and filtration systems suffer when power cuts in and out. Sudden restart surges destroy motors worth Ksh 300,000+.',
        cost: 'Ksh 300,000+ in equipment replacement',
        icon: '🏊'
      }
    ],
    solutions: [
      {
        title: 'Automatic Transfer Switch (ATS) System',
        description: 'Zero-interruption power changeover. When Kenya Power fails, your generator starts within 10 seconds and takes over automatically. Guests won\'t even notice.',
        features: [
          'Automatic start within 10 seconds',
          'Load shedding protection',
          'Seamless transfer - no flicker',
          'Remote monitoring via SMS/App',
          'Weekly auto-test function',
          '3-year warranty on ATS panel'
        ],
        price: 'From Ksh 85,000'
      },
      {
        title: 'Cummins/Perkins Generator Package',
        description: 'Industry-leading generators sized perfectly for your hotel. From 20kVA for small lodges to 500kVA for large resorts with full load coverage.',
        features: [
          'Cummins, Perkins, or FG Wilson options',
          'Soundproof canopy included',
          'Professional installation',
          'First year maintenance included',
          'Genuine spare parts supply',
          'Emergency breakdown service'
        ],
        price: 'From Ksh 450,000 (20kVA)'
      },
      {
        title: 'Hospitality Maintenance Contract',
        description: '24/7 priority service for hotels. We know you can\'t wait 48 hours for a technician - we respond within 4 hours, guaranteed.',
        features: [
          '4-hour emergency response guarantee',
          'Monthly preventive maintenance',
          'All parts and labor included',
          '24/7 hotline - even holidays',
          'Annual ATS testing and calibration',
          'Priority over non-contract customers'
        ],
        price: 'From Ksh 15,000/month'
      }
    ],
    // Real testimonials will be added as customers provide feedback
    testimonials: [],
    faqs: [
      {
        question: 'How quickly can you install a generator system for my hotel?',
        answer: 'For standard installations (up to 100kVA), we can complete the full setup including ATS, cabling, and commissioning within 3-5 business days. Larger installations (200kVA+) typically take 7-10 days. Emergency installations can be arranged within 48 hours for an additional fee.'
      },
      {
        question: 'What size generator do I need for my hotel?',
        answer: 'Hotel generator sizing depends on: number of rooms, kitchen equipment, AC units, elevators, and common areas. A 50-room hotel with central AC typically needs 150-200kVA. We provide FREE site surveys to calculate exact requirements - we\'ll check every circuit and give you a professional load analysis.'
      },
      {
        question: 'Do you service generators you didn\'t install?',
        answer: 'Yes! We service all brands including Cummins, Perkins, Caterpillar, FG Wilson, Kipor, and others. Many hotels come to us frustrated with their current provider. We\'ll do a full diagnostic and give you honest feedback on your generator\'s condition.'
      },
      {
        question: 'How noisy are your generators?',
        answer: 'All our generators come with soundproof canopies rated at 65-75 dB at 7 meters - quieter than a normal conversation. For hotels in residential areas or near guest rooms, we offer super-silent models at 60 dB. Your guests will sleep through changeovers.'
      },
      {
        question: 'What happens if the generator fails during an event?',
        answer: 'With our maintenance contract, you get 4-hour emergency response, 24/7/365. We also recommend hotels install a small UPS (10-20kVA) for critical systems like security and reception computers. This gives 30 minutes of bridge power while we dispatch a technician.'
      }
    ],
    keywords: [
      'hotel generator Kenya',
      'hospitality power solutions',
      'hotel backup power Nairobi',
      'automatic changeover hotel',
      'resort generator installation',
      'lodge generator Maasai Mara',
      'hotel ATS system',
      'hospitality generator maintenance',
      'safari lodge power solutions',
      'hotel UPS system Kenya'
    ],
    relatedIndustries: ['real-estate-construction', 'churches-religious'],
    ctaText: 'Get FREE Hotel Power Audit',
    whatsappMessage: 'Hi EmersonEIMS, I manage a hotel and need a reliable generator solution. Please contact me for a free site survey.',
    stats: [
      { label: 'Hotels Served', value: '200+' },
      { label: 'Response Time', value: '4 Hours' },
      { label: 'Uptime Guarantee', value: '99.9%' },
      { label: 'Warranty', value: '3 Years' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. HOSPITALS & HEALTHCARE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'hospitals-healthcare',
    name: 'Hospitals & Healthcare',
    shortName: 'Healthcare',
    icon: '🏥',
    heroTitle: 'Lives Depend on Your Power Supply',
    heroSubtitle: 'Zero-interruption power systems for hospitals - because a 10-second delay can mean the difference between life and death.',
    description: 'Medical-grade power solutions for hospitals, clinics, laboratories, and healthcare facilities. We specialize in critical power systems that meet international healthcare standards with zero transfer time.',
    marketSize: '9,458+ hospitals and clinics in Kenya',
    marketDescription: 'Kenya\'s healthcare sector faces unique challenges: unreliable grid power, remote locations, and equipment that simply cannot tolerate interruptions. From Kenyatta National Hospital to rural health centers, every facility needs uninterrupted power.',
    painPoints: [
      {
        title: 'Life Support Equipment Failure',
        description: 'Ventilators, dialysis machines, cardiac monitors - all stop during outages. Even 10 seconds without power can be fatal for ICU patients.',
        cost: 'Lives at risk + legal liability',
        icon: '💓'
      },
      {
        title: 'Surgery Interruptions',
        description: 'Mid-surgery power cuts force emergency procedures, increase infection risk, and can result in patient death. Theatre lights, anesthesia equipment, and monitors all need constant power.',
        cost: 'Medical malpractice exposure',
        icon: '🔪'
      },
      {
        title: 'Vaccine & Blood Bank Spoilage',
        description: 'Cold chain failures destroy vaccines worth millions. Blood banks lose units that took weeks to collect. COVID taught us how devastating this can be.',
        cost: 'Ksh 2-5 million per cold chain failure',
        icon: '💉'
      },
      {
        title: 'Medical Imaging Equipment Damage',
        description: 'CT scanners, MRI machines, and X-ray equipment worth Ksh 50-200 million get damaged by power surges and sudden outages. Repairs take months.',
        cost: 'Ksh 5-20 million per incident',
        icon: '🔬'
      },
      {
        title: 'Patient Data & Records Loss',
        description: 'Hospital management systems, lab results, patient records - all at risk. A corrupted database means starting from zero.',
        cost: 'Compliance violations + operational chaos',
        icon: '💻'
      }
    ],
    solutions: [
      {
        title: 'Zero-Transfer UPS + Generator System',
        description: 'Online double-conversion UPS provides instant protection (0ms transfer), while generator provides long-term backup. Medical equipment never sees a power glitch.',
        features: [
          '0ms transfer time (truly uninterruptible)',
          'Medical-grade isolation transformers',
          'Redundant battery banks',
          'Generator auto-start backup',
          'Remote monitoring dashboard',
          'Meets IEC 60601 medical standards'
        ],
        price: 'From Ksh 350,000 (20kVA system)'
      },
      {
        title: 'Hospital Generator Package',
        description: 'Medical-grade generators with extended runtime, super-silent operation, and hospital-specific features like multiple output circuits for different departments.',
        features: [
          'Cummins hospital-rated generators',
          'Extended 500L fuel tanks (24-72hr runtime)',
          'Super-silent 60dB canopy',
          'Separate ICU/Theatre circuits',
          'Automatic exercising system',
          'KEBS and medical compliance'
        ],
        price: 'From Ksh 1,200,000 (100kVA)'
      },
      {
        title: 'Critical Care Maintenance Contract',
        description: '2-hour emergency response for hospitals. Dedicated technician assigned to your facility. Monthly inspections that healthcare regulators want to see.',
        features: [
          '2-hour emergency response (not 4)',
          'Dedicated technician knows your system',
          'Monthly documented inspections',
          'Compliance reports for regulators',
          'Fuel monitoring and auto-refill',
          'Battery replacement program'
        ],
        price: 'From Ksh 35,000/month'
      }
    ],
    // Real testimonials will be added as customers provide feedback
    testimonials: [],
    faqs: [
      {
        question: 'What is the difference between a regular UPS and a medical-grade UPS?',
        answer: 'Medical-grade UPS systems have: (1) True 0ms transfer time via online double-conversion topology, (2) Isolation transformers that prevent ground faults, (3) IEC 60601 certification for medical environments, (4) Higher reliability with redundant components. Regular UPS systems have 2-10ms transfer time, which can reset or damage sensitive medical equipment.'
      },
      {
        question: 'How do you ensure 24/7 power for an ICU?',
        answer: 'We implement a 3-tier system: (1) Online UPS provides instant protection and conditions power, (2) Generator starts within 10 seconds for extended outages, (3) Second generator on standby for maintenance or failures. Each tier can handle full ICU load independently. This is called N+1 redundancy.'
      },
      {
        question: 'Do your systems meet Kenyan healthcare regulations?',
        answer: 'Yes. Our installations meet: Kenya Medical Practitioners and Dentists Board requirements, KEBS standards for electrical installations, and international standards including IEC 60601 (medical equipment), IEC 62040 (UPS), and ISO 13485 (medical devices). We provide compliance documentation for regulators.'
      },
      {
        question: 'Can you help with rural health facilities?',
        answer: 'Absolutely. We specialize in off-grid and hybrid systems for rural clinics. Our solar-generator-battery systems provide reliable power even in areas with no grid connection. We\'ve installed systems from Turkana to Lamu, including facilities that haven\'t seen grid power in years.'
      },
      {
        question: 'What about generator maintenance during operating hours?',
        answer: 'Our maintenance contracts include scheduled maintenance during low-demand periods (typically early morning). For hospitals that operate 24/7, we coordinate with your facilities team and provide temporary backup during maintenance. We never leave you exposed.'
      }
    ],
    keywords: [
      'hospital generator Kenya',
      'medical UPS system',
      'healthcare power solutions',
      'hospital backup power',
      'ICU power backup',
      'surgery theatre generator',
      'clinic generator Nairobi',
      'medical equipment power protection',
      'vaccine cold chain power',
      'hospital electrical services Kenya'
    ],
    relatedIndustries: ['schools-universities', 'government-ngos'],
    ctaText: 'Get FREE Hospital Power Assessment',
    whatsappMessage: 'Hi EmersonEIMS, I\'m from a hospital/clinic and need critical power solutions. Please contact me for an assessment.',
    stats: [
      { label: 'Hospitals Served', value: '150+' },
      { label: 'Emergency Response', value: '2 Hours' },
      { label: 'Uptime Achieved', value: '99.99%' },
      { label: 'Lives Protected', value: '1M+' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. SCHOOLS & UNIVERSITIES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'schools-universities',
    name: 'Schools & Universities',
    shortName: 'Education',
    icon: '🎓',
    heroTitle: 'Don\'t Let Power Outages Disrupt Learning',
    heroSubtitle: 'Reliable power for computer labs, exam halls, and boarding facilities. Keep students safe and learning.',
    description: 'Complete power solutions for primary schools, secondary schools, universities, and technical colleges. We understand education budgets and offer flexible payment options.',
    marketSize: '93,988+ schools in Kenya',
    marketDescription: 'From Starehe Boys to village primary schools, education in Kenya depends on reliable power. Computer-based exams, e-learning, boarding facilities, and modern labs all require consistent electricity.',
    painPoints: [
      {
        title: 'KCPE/KCSE Exam Disruptions',
        description: 'Computer-based assessments and exam printing require stable power. A blackout during national exams can affect thousands of students and attract KNEC penalties.',
        cost: 'Exam cancellations + ministry intervention',
        icon: '📝'
      },
      {
        title: 'Computer Lab Downtime',
        description: '50+ computers going off suddenly corrupts files, damages hard drives, and wastes lesson time. Teachers can\'t conduct ICT lessons when power is unreliable.',
        cost: 'Ksh 500,000+ in damaged equipment',
        icon: '💻'
      },
      {
        title: 'Boarding School Safety',
        description: 'Dormitories go dark, security cameras fail, water pumps stop. Students (especially girls) are vulnerable. Parents lose trust in your institution.',
        cost: 'Safety incidents + enrollment drops',
        icon: '🛏️'
      },
      {
        title: 'Laboratory Equipment Damage',
        description: 'Science labs have refrigerators for chemicals, incubators for biology, and precision instruments. Power fluctuations destroy experiments and equipment.',
        cost: 'Ksh 200,000-1,000,000 per incident',
        icon: '🔬'
      },
      {
        title: 'Kitchen & Dining Disruptions',
        description: 'Feeding 500+ students requires industrial kitchens that can\'t stop mid-meal. Food spoilage, delayed meals, and hungry students affect learning.',
        cost: 'Ksh 100,000+ per incident',
        icon: '🍳'
      }
    ],
    solutions: [
      {
        title: 'School Generator Package',
        description: 'Right-sized generators for schools with automatic changeover. Handles computer labs, admin block, and essential lighting. Designed for school budgets.',
        features: [
          'Automatic changeover system',
          'Soundproof for quiet learning',
          'Sized for your specific needs',
          'First-year maintenance included',
          'Training for school caretakers',
          '3-year warranty'
        ],
        price: 'From Ksh 280,000 (15kVA)'
      },
      {
        title: 'Computer Lab UPS System',
        description: 'Protect all computers from sudden shutdowns. Provides 15-30 minutes of backup for safe shutdown or generator startup.',
        features: [
          'Protects 20-50 computers',
          'Automatic shutdown software',
          'Surge protection built-in',
          'Battery monitoring display',
          'Expandable capacity',
          'Silent operation'
        ],
        price: 'From Ksh 120,000 (10kVA)'
      },
      {
        title: 'Solar Power for Schools',
        description: 'Reduce electricity bills by 50-80% with solar. Perfect for day schools with high daytime consumption. Government grants may apply.',
        features: [
          'Reduces KPLC bills dramatically',
          'Qualifies for green initiatives',
          'Grid-tie or hybrid options',
          'Computer lab prioritization',
          '25-year panel warranty',
          'Monitoring dashboard for admin'
        ],
        price: 'From Ksh 400,000 (5kW system)'
      }
    ],
    // Real testimonials will be added as customers provide feedback
    testimonials: [],
    faqs: [
      {
        question: 'Do you offer payment plans for schools?',
        answer: 'Yes! We understand school budgets are tight and often paid in term installments. We offer: (1) 3-6 month payment plans with no interest, (2) Lease-to-own options for larger systems, (3) End-of-year payment arrangements aligned with fee collection. We\'ve worked with over 500 schools and understand your cash flow.'
      },
      {
        question: 'What size generator does a typical secondary school need?',
        answer: 'It depends on your facilities. A day school with one computer lab typically needs 15-25kVA. A boarding school with dormitories, kitchen, and multiple labs may need 50-100kVA. We provide FREE site surveys and load calculations - no obligation.'
      },
      {
        question: 'Can solar power a whole school?',
        answer: 'For day schools with minimal evening usage, solar can cover 80-100% of needs. Boarding schools typically use solar for 50-70% (daytime loads) plus generator for evening/night. We design hybrid systems that maximize savings while ensuring reliability.'
      },
      {
        question: 'How do you train our caretakers?',
        answer: 'Every installation includes hands-on training for 2-3 staff members covering: daily checks, emergency start procedures, fuel management, basic troubleshooting, and when to call us. We provide a simple checklist in English and Swahili. Refresher training available anytime.'
      },
      {
        question: 'What about noise during exams?',
        answer: 'Our generators use soundproof canopies rated at 65-70dB at 7 meters - quieter than classroom chatter. We also strategically position generators away from exam halls. Schools have conducted national exams with generators running - students don\'t notice.'
      }
    ],
    keywords: [
      'school generator Kenya',
      'university power backup',
      'computer lab UPS',
      'boarding school generator',
      'education power solutions',
      'exam hall backup power',
      'school solar system Kenya',
      'college generator installation',
      'school electrical services',
      'TVET college generator'
    ],
    relatedIndustries: ['hospitals-healthcare', 'churches-religious'],
    ctaText: 'Get FREE School Power Assessment',
    whatsappMessage: 'Hi EmersonEIMS, I\'m from a school/university and need reliable power solutions. Please contact me for a free assessment.',
    stats: [
      { label: 'Schools Powered', value: '500+' },
      { label: 'Payment Plans', value: 'Available' },
      { label: 'Exams Protected', value: '100K+' },
      { label: 'Student Safety', value: 'Priority' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. BANKS & FINANCIAL SERVICES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'banks-financial',
    name: 'Banks & Financial Services',
    shortName: 'Banking',
    icon: '🏦',
    heroTitle: 'Your ATMs Must Never Sleep',
    heroSubtitle: 'Mission-critical power systems for banks, SACCOs, and fintech companies. Zero tolerance for downtime.',
    description: 'Enterprise-grade power solutions for banks, microfinance institutions, SACCOs, insurance companies, and fintech startups. We understand that every second of downtime costs money and customer trust.',
    marketSize: 'All 43 banks + 180+ SACCOs + 500+ MFIs',
    marketDescription: 'Kenya leads Africa in mobile money and digital banking. From Equity Bank branches to M-Pesa agents, the financial sector demands 99.99% uptime. Central Bank of Kenya regulations require documented backup power systems.',
    painPoints: [
      {
        title: 'ATM Downtime Losses',
        description: 'Each ATM generates Ksh 2,000-5,000 per hour in transaction fees. 10 offline ATMs for 4 hours = Ksh 200,000 lost. Plus customer complaints and regulatory scrutiny.',
        cost: 'Ksh 50,000+ per ATM per day offline',
        icon: '🏧'
      },
      {
        title: 'Transaction Failures',
        description: 'Mid-transaction power cuts corrupt databases, cause double charges, and result in reconciliation nightmares. Customer disputes take weeks to resolve.',
        cost: 'Millions in chargebacks + reputation damage',
        icon: '💳'
      },
      {
        title: 'Data Center Outages',
        description: 'Core banking systems, card processing, RTGS connections - all at risk. A data center going dark triggers nationwide service disruption.',
        cost: 'Ksh 10-100 million per hour',
        icon: '🖥️'
      },
      {
        title: 'Branch Security Failures',
        description: 'Alarm systems, vault sensors, CCTV, and access control all need power. Criminals time their attacks during outages.',
        cost: 'Unlimited liability + insurance issues',
        icon: '🚨'
      },
      {
        title: 'Regulatory Non-Compliance',
        description: 'CBK requires documented business continuity plans including backup power. Failed audits mean sanctions, fines, and license risks.',
        cost: 'License suspension risk',
        icon: '📋'
      }
    ],
    solutions: [
      {
        title: 'Branch Power Protection System',
        description: 'Complete backup power for bank branches - ATMs, teller workstations, vault, and security. UPS provides instant protection, generator provides extended backup.',
        features: [
          'Online UPS for all critical equipment',
          'Automatic generator changeover',
          'Dedicated ATM circuit protection',
          'Security system prioritization',
          'Remote monitoring for FM team',
          'CBK compliance documentation'
        ],
        price: 'From Ksh 450,000 per branch'
      },
      {
        title: 'Data Center Power Infrastructure',
        description: 'Tier III/IV data center power systems. Redundant UPS, multiple generators, automatic failover. Designed for 99.99% uptime.',
        features: [
          'N+1 or 2N redundancy options',
          'Modular scalable UPS',
          'Automatic load balancing',
          'Generator synchronization',
          'Remote NOC monitoring',
          'Preventive maintenance program'
        ],
        price: 'Custom - from Ksh 5 million'
      },
      {
        title: 'ATM Power Kit',
        description: 'Dedicated power protection for standalone ATMs. Compact UPS with surge protection and battery backup for graceful shutdown.',
        features: [
          '30-60 minute battery backup',
          'Surge and spike protection',
          'Compact size for ATM cabinets',
          'Remote monitoring option',
          'Hot-swappable batteries',
          'Installation included'
        ],
        price: 'From Ksh 85,000 per ATM'
      }
    ],
    // Real testimonials will be added as customers provide feedback
    testimonials: [],
    faqs: [
      {
        question: 'How do you ensure CBK compliance?',
        answer: 'Our systems are designed to meet CBK Prudential Guidelines on Business Continuity. We provide: (1) Detailed system documentation, (2) Test reports for regulators, (3) Maintenance records, (4) Response time guarantees in writing. Many banks use our documentation during CBK audits.'
      },
      {
        question: 'Can you handle nationwide branch rollouts?',
        answer: 'Yes. We\'ve done rollouts for banks with 100+ branches. We have technicians in all 47 counties and can coordinate simultaneous installations. Our project management team handles logistics, ensuring consistent quality across all branches.'
      },
      {
        question: 'What about mobile money agents?',
        answer: 'We offer simplified solutions for M-Pesa and other mobile money agents. A compact 1kVA UPS protects your till phone and keeps transactions flowing during short outages. Ideal for shops and kiosks. From Ksh 25,000 installed.'
      },
      {
        question: 'How do you handle 24/7 data centers?',
        answer: 'Data center maintenance is done with zero downtime using: (1) Redundant systems that allow one to be serviced while another runs, (2) Scheduled maintenance during low-load periods, (3) Hot-swappable components. We\'ve maintained bank data centers for 10+ years without a single power-related outage.'
      },
      {
        question: 'Do you offer SLAs with financial penalties?',
        answer: 'Yes. For enterprise customers, we offer SLAs with guaranteed response times (2-4 hours) and uptime commitments (99.9-99.99%). If we fail to meet SLA, you receive service credits. Our SLAs are designed to match your commitments to regulators and customers.'
      }
    ],
    keywords: [
      'bank generator Kenya',
      'ATM power backup',
      'financial services UPS',
      'SACCO generator',
      'data center power Kenya',
      'bank branch backup power',
      'CBK compliant power system',
      'fintech power solutions',
      'microfinance generator',
      'mobile money power backup'
    ],
    relatedIndustries: ['government-ngos', 'manufacturing-industries'],
    ctaText: 'Get Enterprise Power Assessment',
    whatsappMessage: 'Hi EmersonEIMS, I\'m from a bank/SACCO/fintech and need mission-critical power solutions. Please contact me.',
    stats: [
      { label: 'ATMs Protected', value: '500+' },
      { label: 'Branches Served', value: '300+' },
      { label: 'Uptime Delivered', value: '99.99%' },
      { label: 'CBK Compliant', value: 'Yes' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. MANUFACTURING & INDUSTRIES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'manufacturing-industries',
    name: 'Manufacturing & Industries',
    shortName: 'Manufacturing',
    icon: '🏭',
    heroTitle: 'Production Lines Can\'t Afford to Stop',
    heroSubtitle: 'Industrial generators and power systems that keep your factory running through any blackout. Minimize waste. Meet deadlines.',
    description: 'Heavy-duty power solutions for factories, processing plants, and industrial facilities. We understand production schedules, shift operations, and the true cost of downtime.',
    marketSize: '4,800+ registered manufacturing companies',
    marketDescription: 'Kenya\'s manufacturing sector contributes 10% of GDP. From Mombasa Road factories to Thika industrial area, reliable power is the difference between profit and loss. Every minute of downtime costs money.',
    painPoints: [
      {
        title: 'Production Line Stoppages',
        description: 'Modern production lines can\'t restart instantly. Machinery needs recalibration, materials are wasted, and you lose 30-60 minutes even after power returns.',
        cost: 'Ksh 100,000-1,000,000 per hour',
        icon: '⚙️'
      },
      {
        title: 'Raw Material Waste',
        description: 'Mid-process materials often can\'t be saved. Plastic hardens in injection molds, food products spoil, chemical reactions fail. Materials worth millions thrown away.',
        cost: 'Up to 100% of batch value',
        icon: '🗑️'
      },
      {
        title: 'Delivery Deadline Failures',
        description: 'Export orders have fixed ship dates. Missing a container means expensive air freight or contract penalties. Major buyers blacklist unreliable suppliers.',
        cost: 'Lost contracts worth millions',
        icon: '📦'
      },
      {
        title: 'Equipment Damage from Surges',
        description: 'Industrial motors, PLCs, drives, and CNC machines are damaged by power fluctuations. Repairs take weeks when parts must be imported.',
        cost: 'Ksh 500,000-5,000,000 per incident',
        icon: '⚡'
      },
      {
        title: 'Worker Safety Issues',
        description: 'Dark factories with moving machinery are dangerous. Emergency lighting and equipment shutdowns must work perfectly to prevent injuries.',
        cost: 'Lives + DOSH penalties + lawsuits',
        icon: '⚠️'
      }
    ],
    solutions: [
      {
        title: 'Industrial Generator Systems',
        description: 'Heavy-duty generators from 100kVA to 2000kVA. Designed for factory loads with high starting currents, 24/7 operation capability, and automatic changeover.',
        features: [
          'Cummins/Perkins industrial engines',
          'Handles high inrush current loads',
          '24/7 continuous operation rated',
          'Automatic mains failure detection',
          'Multi-generator synchronization',
          'Extended 1000L fuel tanks'
        ],
        price: 'From Ksh 1,500,000 (100kVA)'
      },
      {
        title: 'Power Factor Correction',
        description: 'Reduce electricity bills by 15-30% and avoid KPLC penalties. Our capacitor banks improve power factor, reduce demand charges, and extend equipment life.',
        features: [
          'Automatic power factor correction',
          'Reduces KPLC demand charges',
          'Avoids low PF penalties',
          'Extends motor and drive life',
          'Real-time monitoring',
          'ROI in 6-12 months'
        ],
        price: 'From Ksh 350,000'
      },
      {
        title: 'Industrial Maintenance Contract',
        description: 'Keep your generators production-ready with scheduled maintenance, emergency response, and genuine parts. Because unplanned downtime is not an option.',
        features: [
          '4-hour emergency response',
          'Monthly preventive maintenance',
          'Fuel quality testing',
          'Load bank testing annually',
          'Genuine OEM parts',
          'Dedicated account manager'
        ],
        price: 'From Ksh 45,000/month (per generator)'
      }
    ],
    // Real testimonials will be added as customers provide feedback
    testimonials: [],
    faqs: [
      {
        question: 'What size generator does my factory need?',
        answer: 'It depends on your connected load and starting characteristics. A factory with 200kW of motors might need a 400kVA generator due to motor starting currents. We provide FREE load analysis using power loggers that record your actual usage for 1-2 weeks. This ensures accurate sizing - not oversized (wasted money) or undersized (won\'t work).'
      },
      {
        question: 'Can you synchronize multiple generators?',
        answer: 'Yes. For large facilities (500kVA+), we often recommend multiple synchronized generators instead of one large unit. Benefits: (1) Redundancy - if one fails, others keep running, (2) Fuel efficiency - run fewer units during low demand, (3) Easier maintenance - service one while others operate. We\'ve installed synchronized systems up to 4MW.'
      },
      {
        question: 'How do you handle high starting current motors?',
        answer: 'Large motors can draw 6-8x their running current at startup. We address this with: (1) Properly sized generators with high transient capacity, (2) Soft starters or VFDs to reduce inrush current, (3) Sequenced starting of large loads, (4) Generator auto-sizing that accounts for worst-case scenarios.'
      },
      {
        question: 'What about fuel supply for 24/7 operations?',
        answer: 'We offer extended fuel tanks (500-2000L built-in, external tanks up to 10,000L). For critical operations, we can arrange automatic fuel monitoring and scheduled delivery contracts with major suppliers. Your generator will never run dry.'
      },
      {
        question: 'Do you handle export factory certifications?',
        answer: 'Many export factories need ISO, HACCP, or customer-specific certifications that include power backup requirements. We provide documentation, test certificates, and calibration records that satisfy auditors. We\'ve helped factories pass audits for Walmart, Tesco, and other major buyers.'
      }
    ],
    keywords: [
      'industrial generator Kenya',
      'factory generator Nairobi',
      'manufacturing power solutions',
      'industrial backup power',
      'factory power factor correction',
      'processing plant generator',
      'industrial UPS Kenya',
      'generator synchronization',
      'production line power backup',
      'Mombasa Road generator company'
    ],
    relatedIndustries: ['flower-farms', 'banks-financial'],
    ctaText: 'Get FREE Factory Power Audit',
    whatsappMessage: 'Hi EmersonEIMS, I\'m from a manufacturing facility and need industrial power solutions. Please contact me for a site survey.',
    stats: [
      { label: 'Factories Served', value: '300+' },
      { label: 'MW Installed', value: '50+' },
      { label: 'Uptime Delivered', value: '99.5%' },
      { label: 'Export Certified', value: 'Yes' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. FLOWER FARMS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'flower-farms',
    name: 'Flower Farms',
    shortName: 'Flower Farms',
    icon: '🌹',
    heroTitle: 'Your Roses Can\'t Wait for Kenya Power',
    heroSubtitle: 'Specialized power solutions for cold storage, irrigation, and pack houses. Keep your flowers fresh from Naivasha to Amsterdam.',
    description: 'Tailored power systems for flower farms, greenhouses, and horticultural operations. We understand the unique challenges of cut flower production - tight cold chain requirements and 24/7 operations.',
    marketSize: 'Ksh 150 billion flower export industry',
    marketDescription: 'Kenya is the world\'s 3rd largest flower exporter. The industry centers around Naivasha, Nakuru, Thika, and Mt. Kenya region. Every farm depends on reliable power for irrigation, cold storage, and processing.',
    painPoints: [
      {
        title: 'Cold Room Failures',
        description: 'Cut flowers must stay at 2-4°C. A 4-hour cold room failure in Naivasha summer means an entire day\'s harvest is ruined. Ksh 5-10 million of roses, dead.',
        cost: 'Ksh 5-10 million per incident',
        icon: '❄️'
      },
      {
        title: 'Irrigation Pump Stoppages',
        description: 'Greenhouses need precise irrigation schedules. Pumps stopping mid-cycle means water stress, reduced flower quality, and smaller head sizes that buyers reject.',
        cost: 'Reduced grades = 30% lower prices',
        icon: '💧'
      },
      {
        title: 'Pack House Processing Delays',
        description: 'Flowers must be processed and loaded into cold trucks within hours of harvest. Power cuts mean missed cargo flights and rejected shipments in Amsterdam.',
        cost: 'Ksh 2-5 million per missed flight',
        icon: '📦'
      },
      {
        title: 'Fertigation System Disruptions',
        description: 'Automated fertilizer dosing requires stable power. Incorrect dosing damages crops and wastes expensive fertilizers. Some chemicals can\'t be stopped mid-application.',
        cost: 'Crop damage + chemical waste',
        icon: '🧪'
      },
      {
        title: 'Borehole Pump Damage',
        description: 'Water is life for flower farms. Borehole pumps are expensive (Ksh 500,000+) and easily damaged by power surges and dry running during outages.',
        cost: 'Ksh 500,000-1,500,000 per pump',
        icon: '🔧'
      }
    ],
    solutions: [
      {
        title: 'Farm-Wide Power System',
        description: 'Complete power backup for all farm operations - greenhouses, pack house, cold rooms, and staff facilities. Automatic changeover ensures zero interruption to critical systems.',
        features: [
          'Generator sized for full farm load',
          'Priority circuits for cold rooms',
          'Automatic changeover system',
          'Borehole protection system',
          'Remote monitoring via SMS',
          'Farm-tough weatherproof installation'
        ],
        price: 'From Ksh 2,500,000 (200kVA)'
      },
      {
        title: 'Cold Room Backup Package',
        description: 'Dedicated generator and controls for cold storage. If main power fails, cold rooms keep running. Temperature monitoring alerts you before it\'s too late.',
        features: [
          'Standalone cold room generator',
          'Temperature monitoring system',
          'SMS alerts for anomalies',
          'Quick-connect for portability',
          'Sized for your cooling load',
          'Fuel optimization for 24/7 running'
        ],
        price: 'From Ksh 850,000 (50kVA)'
      },
      {
        title: 'Solar-Hybrid Irrigation System',
        description: 'Reduce diesel costs by 60-80% with solar-powered pumping. Grid-connected for maximum savings, with generator backup for cloudy days.',
        features: [
          'Solar-powered borehole pumps',
          'Grid-tie reduces KPLC bills',
          'Battery storage for cloudy days',
          'Generator backup for extended outages',
          'Smart irrigation integration',
          '25-year solar panel warranty'
        ],
        price: 'From Ksh 1,800,000 (complete system)'
      }
    ],
    // Real testimonials will be added as customers provide feedback
    testimonials: [],
    faqs: [
      {
        question: 'How do you handle remote farm locations?',
        answer: 'We have technicians based in Naivasha, Nakuru, and Thika - the heart of flower country. For remote farms, we offer: (1) 24-hour emergency response guarantee, (2) On-site spare parts inventory, (3) Caretaker training for basic troubleshooting, (4) Remote diagnostics via GSM modems. We\'ve serviced farms from Timau to Naro Moru.'
      },
      {
        question: 'What about the rainy season and generator maintenance?',
        answer: 'We schedule major maintenance during low-demand periods and always ensure your generator is fully serviced before peak season (Valentine\'s, Mother\'s Day). Our maintenance contracts include weather-resistant covers, battery conditioning, and fuel treatment to handle Kenya\'s varied conditions.'
      },
      {
        question: 'Can solar really work for irrigation?',
        answer: 'Absolutely. Naivasha gets 5-6 hours of peak sun daily - perfect for daytime irrigation pumping. A 50kW solar system can run multiple 15HP borehole pumps. For nighttime irrigation, we add battery storage or generator backup. ROI is typically 2-3 years.'
      },
      {
        question: 'How do you protect our expensive borehole pumps?',
        answer: 'Borehole pumps fail from: (1) Dry running - we install low-water cutoffs, (2) Power surges - we include surge protectors, (3) Voltage fluctuations - we use voltage stabilizers, (4) Phase failures - we install phase monitors. A complete protection package costs Ksh 80,000-150,000 but saves pump replacements costing 5-10x more.'
      },
      {
        question: 'Do you understand flower industry certifications?',
        answer: 'Yes. Many farms need MPS, GlobalGAP, GRASP, or Fairtrade certification. Power reliability is assessed in these audits. We provide: maintenance records, test certificates, and compliance documentation. We\'ve helped farms pass audits for Dutch Flower Group, Marks & Spencer, and Tesco.'
      }
    ],
    keywords: [
      'flower farm generator',
      'Naivasha generator company',
      'cold room backup power',
      'horticulture power solutions',
      'irrigation pump generator',
      'pack house power backup',
      'greenhouse power Kenya',
      'flower farm solar system',
      'Nakuru generator company',
      'borehole pump power protection'
    ],
    relatedIndustries: ['manufacturing-industries', 'real-estate-construction'],
    ctaText: 'Get FREE Farm Power Audit',
    whatsappMessage: 'Hi EmersonEIMS, I\'m from a flower farm and need power solutions for cold storage and irrigation. Please contact me.',
    stats: [
      { label: 'Farms Served', value: '50+' },
      { label: 'MW Installed', value: '15+' },
      { label: 'Naivasha Presence', value: 'Yes' },
      { label: 'Cold Chain Uptime', value: '99.9%' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. REAL ESTATE & CONSTRUCTION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'real-estate-construction',
    name: 'Real Estate & Construction',
    shortName: 'Real Estate',
    icon: '🏗️',
    heroTitle: 'Power Solutions from Foundation to Penthouse',
    heroSubtitle: 'Site generators for construction. Permanent backup systems for completed buildings. Common area power that residents love.',
    description: 'End-to-end power solutions for real estate developers, property managers, and construction companies. From site power during construction to permanent backup for residential and commercial buildings.',
    marketSize: 'Ksh 800+ billion construction sector',
    marketDescription: 'Kenya\'s real estate boom demands reliable power. From Upperhill office towers to Kileleshwa apartments, modern buildings need backup power. It\'s a selling point that adds value to every unit.',
    painPoints: [
      {
        title: 'Construction Site Delays',
        description: 'Cranes, welding machines, and concrete mixers need power. Waiting for Kenya Power connections delays projects by weeks. Generators let you start building immediately.',
        cost: 'Ksh 2-5 million per month in delays',
        icon: '🚧'
      },
      {
        title: 'Elevator Failures in Apartments',
        description: 'Residents trapped in elevators during blackouts. Elderly and disabled unable to reach upper floors. Complaints to management company pile up.',
        cost: 'Liability + resident complaints',
        icon: '🛗'
      },
      {
        title: 'Security System Blackouts',
        description: 'Gates don\'t open, intercom fails, CCTV goes dark. Criminals know when compounds are vulnerable. One security incident destroys property value.',
        cost: 'Security incidents + devaluation',
        icon: '🔐'
      },
      {
        title: 'Water Pump Failures',
        description: 'Upper floors without water during outages. Residents can\'t flush toilets, shower, or cook. Fire suppression systems fail. Major liability.',
        cost: 'Fire safety violations + unhappy tenants',
        icon: '🚰'
      },
      {
        title: 'Common Area Darkness',
        description: 'Parking basements, corridors, and lobbies go dark. Accidents happen, cars get vandalized, property looks unmaintained. Rentals suffer.',
        cost: 'Higher vacancy rates + accidents',
        icon: '💡'
      }
    ],
    solutions: [
      {
        title: 'Construction Site Generator Rental',
        description: 'Skip the months-long wait for Kenya Power. Rent reliable generators for your construction site. Daily, weekly, or monthly options.',
        features: [
          'Available from 20kVA to 500kVA',
          'Delivery and installation included',
          'Fuel supply arrangements available',
          'Maintenance included in rental',
          'Upgrade or downgrade as needed',
          'Option to buy at end of project'
        ],
        price: 'From Ksh 2,500/day (20kVA)'
      },
      {
        title: 'Residential Building Package',
        description: 'Complete backup power for apartments and gated communities. Covers elevators, water pumps, security, and common area lighting.',
        features: [
          'Automatic changeover system',
          'Silent operation for residential',
          'Sized for your building load',
          'Elevator priority circuit',
          'Water pump protection',
          'Professional installation'
        ],
        price: 'From Ksh 650,000 (30kVA)'
      },
      {
        title: 'Commercial Building Solution',
        description: 'Enterprise-grade backup for office buildings and malls. Multi-tenant power management, individual metering, and premium reliability.',
        features: [
          'Central generator system',
          'Individual tenant metering option',
          'Priority circuits by tenant class',
          'Building management integration',
          'Load shedding capability',
          'Service contract included'
        ],
        price: 'From Ksh 2,000,000 (100kVA+)'
      }
    ],
    // Real testimonials will be added as customers provide feedback
    testimonials: [],
    faqs: [
      {
        question: 'Can we rent a generator during construction and then buy it?',
        answer: 'Yes! Our rent-to-own program lets you rent during construction and apply up to 50% of rental payments toward purchase. If the generator suits your building\'s permanent needs, you can convert it. Otherwise, we\'ll supply a right-sized unit for the completed building.'
      },
      {
        question: 'How do you size a generator for an apartment building?',
        answer: 'We calculate based on: elevator motor sizes, water pump requirements, common area lighting, and any tenant backup loads. A typical 50-unit building with 2 elevators and borehole needs 50-80kVA. We do detailed load calculations during our FREE site survey.'
      },
      {
        question: 'What about noise in residential areas?',
        answer: 'All our residential installations use super-silent canopies (60-65dB at 7m). We also position generators strategically - away from bedrooms, with sound-absorbing barriers if needed. Our residential systems meet NEMA noise regulations.'
      },
      {
        question: 'Can tenants be charged for generator usage?',
        answer: 'Yes. For commercial buildings, we can install individual kWh meters per tenant. Generator running costs are billed based on actual consumption. For apartments, we typically include generator costs in service charge with a small reserve for fuel.'
      },
      {
        question: 'How do you handle multiple buildings in a compound?',
        answer: 'We can design: (1) Central generator feeding all buildings via distribution, or (2) Individual generators per building for redundancy. Choice depends on layout, budget, and reliability requirements. Central systems are cheaper; distributed systems are more reliable.'
      }
    ],
    keywords: [
      'construction site generator',
      'apartment building backup power',
      'commercial building generator',
      'real estate power solutions',
      'building generator Kenya',
      'elevator backup power',
      'property management generator',
      'gated community power backup',
      'construction generator rental',
      'residential generator Nairobi'
    ],
    relatedIndustries: ['hotels-hospitality', 'government-ngos'],
    ctaText: 'Get FREE Property Power Assessment',
    whatsappMessage: 'Hi EmersonEIMS, I\'m a developer/property manager and need power solutions for my building(s). Please contact me.',
    stats: [
      { label: 'Buildings Powered', value: '400+' },
      { label: 'Units Protected', value: '15,000+' },
      { label: 'Rental Fleet', value: '50+ Units' },
      { label: 'Response Time', value: '4 Hours' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. CHURCHES & RELIGIOUS ORGANIZATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'churches-religious',
    name: 'Churches & Religious Organizations',
    shortName: 'Churches',
    icon: '⛪',
    heroTitle: 'Worship Without Interruption',
    heroSubtitle: 'Affordable backup power for churches, mosques, and temples. Keep services running and sound systems clear.',
    description: 'Budget-friendly power solutions for religious organizations. We understand churches operate on donations and offer flexible payment options, quality refurbished units, and maintenance packages that fit ministry budgets.',
    marketSize: '50,000+ registered religious organizations',
    marketDescription: 'Kenya is a deeply religious nation with thousands of churches, mosques, and temples. From mega-churches with 10,000 seats to small community congregations, reliable power enhances worship experiences.',
    painPoints: [
      {
        title: 'Service Interruptions',
        description: 'Mid-sermon power cuts are embarrassing and disruptive. Congregants lose focus, the spiritual moment is broken, and visitors leave with a poor impression.',
        cost: 'Lost members + poor testimony',
        icon: '🙏'
      },
      {
        title: 'Sound System Failures',
        description: 'Microphones cut out, speakers go silent, worship teams can\'t lead. Large auditoriums become unusable without PA systems. Musicians can\'t perform.',
        cost: 'Worship disruption + equipment damage',
        icon: '🎤'
      },
      {
        title: 'Projection & Media Blackouts',
        description: 'Song lyrics disappear, video announcements stop, livestreams cut off. Modern worship relies heavily on technology that needs stable power.',
        cost: 'Poor experience + lost online viewers',
        icon: '📽️'
      },
      {
        title: 'Event & Function Disruptions',
        description: 'Weddings, funerals, conferences - all ruined by power cuts. Couples remember their wedding blackout forever. Grieving families don\'t forget failed funerals.',
        cost: 'Reputation damage + lost bookings',
        icon: '💒'
      },
      {
        title: 'Security Concerns',
        description: 'Church compounds go dark, gates won\'t open, cameras stop recording. Churches face security threats and need reliable access control.',
        cost: 'Security incidents',
        icon: '🔒'
      }
    ],
    solutions: [
      {
        title: 'Church Starter Package',
        description: 'Affordable backup for small to medium churches. Covers sound system, lighting, and essential equipment. Silent operation won\'t disturb worship.',
        features: [
          'Automatic changeover included',
          'Super-silent canopy',
          'Sized for your sound system',
          'First year maintenance included',
          'Training for church caretaker',
          '3-year warranty'
        ],
        price: 'From Ksh 180,000 (10kVA)'
      },
      {
        title: 'Mega-Church Solution',
        description: 'Full-scale backup for large auditoriums. Handles massive PA systems, stage lighting, HVAC, and media equipment. Seamless changeover.',
        features: [
          'Sized for full auditorium load',
          'Instant changeover (no flicker)',
          'Multiple circuit priorities',
          'Load shedding capability',
          'Remote monitoring option',
          'Dedicated account manager'
        ],
        price: 'From Ksh 800,000 (50kVA+)'
      },
      {
        title: 'Quality Refurbished Units',
        description: 'Budget-friendly option using professionally refurbished generators. Same reliability, lower cost. Perfect for churches on tight budgets.',
        features: [
          'Professionally refurbished',
          'Full testing and certification',
          '2-year warranty',
          'New automatic changeover',
          'Installation included',
          'Trade-in accepted'
        ],
        price: 'From Ksh 120,000 (10kVA refurb)'
      }
    ],
    // Real testimonials will be added as customers provide feedback
    testimonials: [],
    faqs: [
      {
        question: 'Do you offer payment plans for churches?',
        answer: 'Yes! We understand churches operate on offerings and donations. We offer: (1) 6-12 month payment plans with no interest, (2) Pay-after-installation arrangements, (3) Quarterly payment options aligned with church budgets. Many churches pay Ksh 20,000-30,000 per month and own their generator within a year.'
      },
      {
        question: 'Are refurbished generators reliable?',
        answer: 'Our refurbished units are: (1) Sourced from quality brands (Cummins, Perkins, FG Wilson), (2) Completely overhauled with new consumables, (3) Load tested at our workshop, (4) Backed by 2-year warranty. They\'re perfect for organizations that need reliability but have limited budgets.'
      },
      {
        question: 'What size generator does a church need?',
        answer: 'It depends on your equipment. A typical church with PA system, projector, and basic lighting needs 10-15kVA. Large churches with concert-level sound and lighting may need 50-100kVA. We provide FREE site surveys to calculate your exact needs.'
      },
      {
        question: 'How quiet are your generators?',
        answer: 'Our church generators use soundproof canopies rated 65-70dB at 7 meters. That\'s quieter than normal conversation. Positioned properly, congregants won\'t hear it at all. For indoor installations, we offer super-silent 60dB models.'
      },
      {
        question: 'Can the generator power air conditioning too?',
        answer: 'Yes, but AC units significantly increase generator size requirements. A church that needs 15kVA for sound/lights might need 40kVA to include AC. We can design systems that prioritize critical loads (sound, lights) and add AC if capacity allows.'
      }
    ],
    keywords: [
      'church generator Kenya',
      'mosque power backup',
      'religious organization generator',
      'church sound system power',
      'worship center backup power',
      'affordable generator church',
      'mega church generator',
      'temple power solutions',
      'church electrical services',
      'religious venue power backup'
    ],
    relatedIndustries: ['schools-universities', 'hotels-hospitality'],
    ctaText: 'Get FREE Church Power Assessment',
    whatsappMessage: 'Hi EmersonEIMS, I\'m from a church/religious organization and need affordable backup power. Please contact me.',
    stats: [
      { label: 'Churches Served', value: '200+' },
      { label: 'Payment Plans', value: 'Available' },
      { label: 'Refurbished Units', value: 'In Stock' },
      { label: 'Warranty', value: '2-3 Years' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. GOVERNMENT & NGOs
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'government-ngos',
    name: 'Government & NGOs',
    shortName: 'Government',
    icon: '🏛️',
    heroTitle: 'Reliable Power for Essential Services',
    heroSubtitle: 'Powering government offices, county facilities, and NGO field operations across Kenya\'s 47 counties.',
    description: 'Comprehensive power solutions for national government offices, county governments, parastatals, embassies, and international NGOs. We understand procurement processes, compliance requirements, and the need for documented everything.',
    marketSize: 'National & 47 County Governments + 12,000+ NGOs',
    marketDescription: 'From Harambee House to remote county offices, government operations require reliable power. International NGOs operate in challenging environments where grid power is a luxury. We serve both sectors with excellence.',
    painPoints: [
      {
        title: 'Office Operations Disruptions',
        description: 'Government services stop when power fails. Citizens queue for hours, then leave without service. Huduma centers, lands offices, and revenue collection all need power.',
        cost: 'Lost revenue + citizen complaints',
        icon: '📋'
      },
      {
        title: 'Server Room Vulnerabilities',
        description: 'IFMIS, e-citizen, and county databases require constant power. Outages corrupt data, delay salaries, and disrupt essential services.',
        cost: 'Data loss + service disruption',
        icon: '🖥️'
      },
      {
        title: 'Field Office Challenges',
        description: 'Remote county offices and NGO field stations have unreliable or no grid power. Staff can\'t work, communications fail, and operations stop.',
        cost: 'Reduced effectiveness',
        icon: '🏕️'
      },
      {
        title: 'Procurement Compliance',
        description: 'Government procurement requires AGPO registration, tax compliance, and proper documentation. Many vendors can\'t meet these requirements.',
        cost: 'Procurement delays + audit issues',
        icon: '📝'
      },
      {
        title: 'Security System Failures',
        description: 'Government facilities face security threats. When power fails, access control, CCTV, and alarm systems go offline. Sensitive areas become vulnerable.',
        cost: 'Security breaches',
        icon: '🔐'
      }
    ],
    solutions: [
      {
        title: 'Government Office Package',
        description: 'Complete backup power for government offices. Meets all procurement requirements with proper documentation, warranties, and support.',
        features: [
          'AGPO compliant vendor',
          'Tax compliant (KRA certificates)',
          'Full documentation package',
          'National coverage - all 47 counties',
          'Warranty and maintenance included',
          'Audit-ready records'
        ],
        price: 'From Ksh 350,000 (20kVA)'
      },
      {
        title: 'County Government Solution',
        description: 'Comprehensive power systems for county headquarters, sub-county offices, and county hospitals. Designed for devolved government needs.',
        features: [
          'Multi-site deployment capability',
          'County-wide maintenance contract',
          'Emergency response in all sub-counties',
          'Training for county technicians',
          'Standardized equipment across sites',
          'Quarterly performance reports'
        ],
        price: 'Custom - from Ksh 5 million'
      },
      {
        title: 'NGO Field Operations Kit',
        description: 'Portable and permanent solutions for NGO field operations. From refugee camp offices to remote health posts. Designed for challenging environments.',
        features: [
          'Solar-generator hybrid options',
          'Portable/mobile units available',
          'Container-ready for deployment',
          'Off-grid capability',
          'Remote monitoring',
          'Rapid deployment (48-72 hours)'
        ],
        price: 'From Ksh 250,000 (portable 10kVA)'
      }
    ],
    // Real testimonials will be added as customers provide feedback
    testimonials: [],
    faqs: [
      {
        question: 'Are you AGPO registered?',
        answer: 'Yes. We are fully registered under AGPO (Access to Government Procurement Opportunities) and maintain all required certifications including: KRA Tax Compliance Certificate, NSSF & NHIF compliance, and CR12 documentation. We can participate in any government tender.'
      },
      {
        question: 'Can you handle multi-county deployments?',
        answer: 'Yes. We have technicians in all 47 counties and have successfully deployed equipment across multiple counties simultaneously. Our project management team coordinates logistics, ensures consistent quality, and provides county government officials with regular progress reports.'
      },
      {
        question: 'What documentation do you provide for audits?',
        answer: 'We provide complete audit-ready documentation including: delivery notes, installation certificates, acceptance certificates, warranty documents, maintenance records, and all payment receipts. Our records have passed audits by the Auditor General, USAID, EU, and various international donors.'
      },
      {
        question: 'Do you work with international donor-funded projects?',
        answer: 'Yes. We\'re registered with multiple donor procurement systems and have supplied equipment to projects funded by: World Bank, USAID, DFID/FCDO, EU, UNDP, UNHCR, and various bilateral donors. We understand donor compliance requirements.'
      },
      {
        question: 'Can you support remote field locations?',
        answer: 'Absolutely. We\'ve installed and maintained systems in Turkana, Marsabit, Garissa, and other remote areas. For truly remote locations, we offer: solar-hybrid systems, extended fuel tanks, remote monitoring, and quarterly maintenance visits. Emergency support is available via our nationwide network.'
      }
    ],
    keywords: [
      'government generator Kenya',
      'county government power solutions',
      'NGO field generator',
      'AGPO generator supplier',
      'public sector power backup',
      'parastatal generator',
      'embassy power solutions',
      'UN agency generator Kenya',
      'government office UPS',
      'county headquarters generator'
    ],
    relatedIndustries: ['hospitals-healthcare', 'banks-financial'],
    ctaText: 'Request Formal Quotation',
    whatsappMessage: 'Hi EmersonEIMS, I\'m from a government/county/NGO office and need power solutions. Please contact me for a formal quotation.',
    stats: [
      { label: 'Counties Covered', value: '47' },
      { label: 'AGPO Registered', value: 'Yes' },
      { label: 'Offices Powered', value: '500+' },
      { label: 'NGOs Served', value: '50+' }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get all industries for sitemap and navigation
 */
export function getAllIndustries(): Industry[] {
  return INDUSTRIES;
}

/**
 * Get industry by slug
 */
export function getIndustryBySlug(slug: string): Industry | undefined {
  return INDUSTRIES.find(ind => ind.slug === slug);
}

/**
 * Get related industries for an industry
 */
export function getRelatedIndustries(slug: string): Industry[] {
  const industry = getIndustryBySlug(slug);
  if (!industry) return [];

  return industry.relatedIndustries
    .map(relSlug => getIndustryBySlug(relSlug))
    .filter((ind): ind is Industry => ind !== undefined);
}

/**
 * Generate SEO metadata for industry page
 */
export function generateIndustrySEO(slug: string) {
  const industry = getIndustryBySlug(slug);
  if (!industry) return null;

  return {
    title: `${industry.name} Generator & Power Solutions Kenya | EmersonEIMS`,
    description: `${industry.heroSubtitle} Serving ${industry.marketSize}. ${industry.description.slice(0, 120)}... Call +254768860665.`,
    keywords: industry.keywords,
    openGraph: {
      title: `${industry.name} Power Solutions | EmersonEIMS Kenya`,
      description: industry.heroSubtitle,
      type: 'website' as const,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: `${industry.name} Generator Solutions | EmersonEIMS`,
      description: industry.heroSubtitle,
    }
  };
}

// Statistics for homepage/marketing
export const INDUSTRY_STATS = {
  totalIndustries: INDUSTRIES.length,
  totalHotelsTarget: '16,245+',
  totalHospitalsTarget: '9,458+',
  totalSchoolsTarget: '93,988+',
  totalChurchesTarget: '50,000+',
  totalCountiesCovered: 47,
};
