/**
 * Generator Oracle - Technician Certification System
 *
 * Multi-level certification program for generator technicians:
 * - Bronze: Basic diagnostic competency
 * - Silver: Intermediate fault resolution
 * - Gold: Advanced ECM programming
 * - Platinum: Expert multi-brand specialization
 * - Master Oracle: Ultimate certification
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type CertificationLevel = 'bronze' | 'silver' | 'gold' | 'platinum' | 'master';

export interface CertificationQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
}

export interface CertificationExam {
  id: string;
  level: CertificationLevel;
  title: string;
  description: string;
  passingScore: number;
  timeLimit: number; // minutes
  questions: CertificationQuestion[];
  prerequisites: CertificationLevel[];
  benefits: string[];
}

export interface TechnicianCertification {
  id: string;
  technicianId: string;
  level: CertificationLevel;
  earnedDate: string;
  expiryDate: string;
  score: number;
  attempts: number;
  verificationCode: string;
}

export interface TechnicianProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location: string;
  certifications: TechnicianCertification[];
  specializations: string[];
  totalDiagnostics: number;
  successRate: number;
  reviews: TechnicianReview[];
  verified: boolean;
  profileImage?: string;
}

export interface TechnicianReview {
  id: string;
  customerId: string;
  rating: number;
  comment: string;
  date: string;
  jobType: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CERTIFICATION LEVELS
// ═══════════════════════════════════════════════════════════════════════════════

export const CERTIFICATION_LEVELS: Record<CertificationLevel, {
  name: string;
  color: string;
  icon: string;
  requirements: string[];
  benefits: string[];
  minimumScore: number;
}> = {
  bronze: {
    name: 'Bronze Technician',
    color: '#CD7F32',
    icon: '🥉',
    requirements: [
      'Complete basic safety training',
      'Pass Bronze certification exam (70%)',
      'Demonstrate understanding of generator components'
    ],
    benefits: [
      'Access to basic diagnostic guides',
      'Community forum participation',
      'Basic fault code lookup'
    ],
    minimumScore: 70
  },
  silver: {
    name: 'Silver Technician',
    color: '#C0C0C0',
    icon: '🥈',
    requirements: [
      'Hold Bronze certification',
      'Pass Silver certification exam (75%)',
      '10+ successful diagnostics logged'
    ],
    benefits: [
      'Advanced diagnostic features',
      'Controller programming guides',
      'Priority support access',
      'Technician directory listing'
    ],
    minimumScore: 75
  },
  gold: {
    name: 'Gold Technician',
    color: '#FFD700',
    icon: '🥇',
    requirements: [
      'Hold Silver certification',
      'Pass Gold certification exam (80%)',
      '50+ successful diagnostics logged',
      '4.5+ star rating'
    ],
    benefits: [
      'ECM programming access',
      'Fleet management tools',
      'Branded certification badge',
      'Premium customer referrals',
      'Technical webinar access'
    ],
    minimumScore: 80
  },
  platinum: {
    name: 'Platinum Expert',
    color: '#E5E4E2',
    icon: '💎',
    requirements: [
      'Hold Gold certification',
      'Pass Platinum certification exam (85%)',
      '200+ successful diagnostics',
      '4.8+ star rating',
      'Multi-brand expertise demonstrated'
    ],
    benefits: [
      'All Oracle features unlocked',
      'Beta feature access',
      'Contribute to fault database',
      'Training material creation',
      'Premium referral network'
    ],
    minimumScore: 85
  },
  master: {
    name: 'Master Oracle',
    color: '#4A0080',
    icon: '👑',
    requirements: [
      'Hold Platinum certification',
      'Pass Master certification exam (90%)',
      '500+ successful diagnostics',
      '4.9+ star rating',
      'Published technical content',
      'Mentor 5+ technicians'
    ],
    benefits: [
      'Master Oracle badge',
      'Revenue share program',
      'Advisory board membership',
      'Free annual conference',
      'Direct manufacturer contacts'
    ],
    minimumScore: 90
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXAM QUESTION DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

export const BRONZE_QUESTIONS: CertificationQuestion[] = [
  {
    id: 'B001',
    question: 'What should be the minimum battery voltage for a 12V starting system before cranking?',
    options: ['10.5V', '11.5V', '12.4V', '13.8V'],
    correctAnswer: 2,
    explanation: 'A fully charged 12V battery should read 12.4-12.7V at rest. Below 12.4V indicates the battery needs charging.',
    difficulty: 'easy',
    category: 'electrical',
    points: 10
  },
  {
    id: 'B002',
    question: 'What is the primary purpose of the AVR (Automatic Voltage Regulator)?',
    options: [
      'Control engine speed',
      'Regulate fuel flow',
      'Maintain stable output voltage',
      'Monitor oil pressure'
    ],
    correctAnswer: 2,
    explanation: 'The AVR maintains stable output voltage by controlling the excitation current to the alternator field windings.',
    difficulty: 'easy',
    category: 'electrical',
    points: 10
  },
  {
    id: 'B003',
    question: 'What color smoke typically indicates fuel system issues?',
    options: ['White smoke', 'Blue smoke', 'Black smoke', 'No smoke'],
    correctAnswer: 2,
    explanation: 'Black smoke indicates incomplete combustion, usually due to too much fuel (rich mixture) or insufficient air.',
    difficulty: 'easy',
    category: 'engine',
    points: 10
  },
  {
    id: 'B004',
    question: 'Before working on a generator, what is the first safety step?',
    options: [
      'Put on safety glasses',
      'Disconnect the battery and isolate the generator',
      'Check oil level',
      'Read the manual'
    ],
    correctAnswer: 1,
    explanation: 'Always disconnect power sources and isolate the generator before any maintenance to prevent accidental starting or electrical shock.',
    difficulty: 'easy',
    category: 'safety',
    points: 10
  },
  {
    id: 'B005',
    question: 'What does low oil pressure typically indicate?',
    options: [
      'Too much oil',
      'Oil level is low or oil pump failure',
      'Engine is cold',
      'Normal operation'
    ],
    correctAnswer: 1,
    explanation: 'Low oil pressure can indicate low oil level, worn bearings, faulty oil pump, or blocked oil filter.',
    difficulty: 'easy',
    category: 'engine',
    points: 10
  },
  {
    id: 'B006',
    question: 'What is the normal operating frequency for generators in Kenya?',
    options: ['50Hz', '60Hz', '100Hz', '120Hz'],
    correctAnswer: 0,
    explanation: 'Kenya uses 50Hz power frequency, matching the UK/European standard.',
    difficulty: 'easy',
    category: 'electrical',
    points: 10
  },
  {
    id: 'B007',
    question: 'What should you check first if a generator cranks but won\'t start?',
    options: [
      'The paint color',
      'Fuel supply and air in fuel lines',
      'The serial number',
      'The warranty card'
    ],
    correctAnswer: 1,
    explanation: 'Fuel delivery issues (empty tank, air in lines, blocked filter) are the most common cause of crank-no-start conditions.',
    difficulty: 'easy',
    category: 'troubleshooting',
    points: 10
  },
  {
    id: 'B008',
    question: 'How often should generator oil typically be changed under normal conditions?',
    options: [
      'Every 50 hours',
      'Every 250-500 hours',
      'Once a year regardless of hours',
      'Only when it looks dirty'
    ],
    correctAnswer: 1,
    explanation: 'Most manufacturers recommend oil changes every 250-500 hours, but always consult the specific manual.',
    difficulty: 'medium',
    category: 'maintenance',
    points: 15
  },
  {
    id: 'B009',
    question: 'What does the coolant temperature gauge measure?',
    options: [
      'Ambient air temperature',
      'Engine oil temperature',
      'Engine coolant temperature',
      'Exhaust temperature'
    ],
    correctAnswer: 2,
    explanation: 'The coolant temperature gauge monitors the engine coolant temperature to prevent overheating.',
    difficulty: 'easy',
    category: 'engine',
    points: 10
  },
  {
    id: 'B010',
    question: 'What PPE is essential when working with generator batteries?',
    options: [
      'Steel-toed boots only',
      'Safety glasses and acid-resistant gloves',
      'Hard hat only',
      'No PPE needed'
    ],
    correctAnswer: 1,
    explanation: 'Battery acid is corrosive and hydrogen gas is explosive. Eye protection and gloves are essential.',
    difficulty: 'easy',
    category: 'safety',
    points: 10
  }
];

export const SILVER_QUESTIONS: CertificationQuestion[] = [
  {
    id: 'S001',
    question: 'What is the typical resistance range for a healthy glow plug?',
    options: ['0.1-0.5 ohms', '0.5-2 ohms', '5-10 ohms', '50-100 ohms'],
    correctAnswer: 1,
    explanation: 'Healthy glow plugs typically measure 0.5-2 ohms. Higher resistance indicates a failing glow plug.',
    difficulty: 'medium',
    category: 'electrical',
    points: 15
  },
  {
    id: 'S002',
    question: 'In a DSE controller, what fault code typically indicates generator overload?',
    options: ['EMERGENCY STOP', 'FAIL TO START', 'OVER CURRENT', 'LOW BATTERY'],
    correctAnswer: 2,
    explanation: 'OVER CURRENT alarms indicate the generator load exceeds its capacity, requiring load shedding.',
    difficulty: 'medium',
    category: 'controllers',
    points: 15
  },
  {
    id: 'S003',
    question: 'What causes hunting (unstable frequency) in a diesel generator?',
    options: [
      'Oversized load',
      'Fuel system issues or governor malfunction',
      'New air filter',
      'Full fuel tank'
    ],
    correctAnswer: 1,
    explanation: 'Hunting is typically caused by air in fuel, dirty fuel, worn injectors, or governor problems.',
    difficulty: 'medium',
    category: 'troubleshooting',
    points: 15
  },
  {
    id: 'S004',
    question: 'What is the purpose of the excitation system in an alternator?',
    options: [
      'Cool the windings',
      'Create the magnetic field for power generation',
      'Filter the output',
      'Lubricate the bearings'
    ],
    correctAnswer: 1,
    explanation: 'The excitation system provides DC current to the rotor field windings to create the magnetic field.',
    difficulty: 'medium',
    category: 'electrical',
    points: 15
  },
  {
    id: 'S005',
    question: 'When parallel operating generators, what must be synchronized?',
    options: [
      'Oil pressure only',
      'Voltage, frequency, and phase',
      'Coolant temperature only',
      'Serial numbers'
    ],
    correctAnswer: 1,
    explanation: 'For parallel operation, voltage magnitude, frequency, and phase angle must match to prevent damage.',
    difficulty: 'hard',
    category: 'electrical',
    points: 20
  },
  {
    id: 'S006',
    question: 'What does blue exhaust smoke typically indicate?',
    options: [
      'Water in fuel',
      'Oil burning in combustion chamber',
      'Rich fuel mixture',
      'Normal operation'
    ],
    correctAnswer: 1,
    explanation: 'Blue smoke indicates oil is entering and burning in the combustion chamber, often from worn rings or valve seals.',
    difficulty: 'medium',
    category: 'engine',
    points: 15
  },
  {
    id: 'S007',
    question: 'What is the function of the speed sensing magnetic pickup (MPU)?',
    options: [
      'Measure oil temperature',
      'Detect engine RPM from flywheel teeth',
      'Control fuel flow',
      'Regulate voltage'
    ],
    correctAnswer: 1,
    explanation: 'The MPU generates pulses as flywheel teeth pass, allowing the controller to calculate engine RPM.',
    difficulty: 'medium',
    category: 'electrical',
    points: 15
  },
  {
    id: 'S008',
    question: 'What is the proper procedure for bleeding a diesel fuel system?',
    options: [
      'Run the engine until it clears',
      'Open bleed screws, operate priming pump until solid fuel flows, then tighten',
      'Replace all fuel lines',
      'Add fuel additive'
    ],
    correctAnswer: 1,
    explanation: 'Open bleed points from filter to injectors, pump until bubble-free fuel flows, then tighten in sequence.',
    difficulty: 'medium',
    category: 'maintenance',
    points: 15
  },
  {
    id: 'S009',
    question: 'What causes low alternator output voltage?',
    options: [
      'Fresh brushes',
      'Faulty AVR, worn brushes, or damaged windings',
      'New bearings',
      'Clean connections'
    ],
    correctAnswer: 1,
    explanation: 'Low voltage can result from AVR failure, worn carbon brushes, or damaged stator/rotor windings.',
    difficulty: 'medium',
    category: 'electrical',
    points: 15
  },
  {
    id: 'S010',
    question: 'What is the typical air gap for an MPU sensor?',
    options: ['0.1-0.2mm', '0.5-1.0mm', '2-3mm', '5-10mm'],
    correctAnswer: 1,
    explanation: 'MPU air gap is typically 0.5-1.0mm (0.020-0.040 inches) for reliable signal generation.',
    difficulty: 'hard',
    category: 'electrical',
    points: 20
  }
];

export const GOLD_QUESTIONS: CertificationQuestion[] = [
  {
    id: 'G001',
    question: 'In a ComAp controller, how do you reset protected parameters?',
    options: [
      'Press reset button',
      'Enter service password in InteliConfig',
      'Disconnect battery',
      'Parameters cannot be reset'
    ],
    correctAnswer: 1,
    explanation: 'ComAp protected parameters require service level access via InteliConfig software with appropriate password.',
    difficulty: 'hard',
    category: 'controllers',
    points: 20
  },
  {
    id: 'G002',
    question: 'What J1939 SPN indicates engine coolant temperature?',
    options: ['SPN 91', 'SPN 100', '1SPN 110', 'SPN 190'],
    correctAnswer: 2,
    explanation: 'SPN 110 is the standard J1939 parameter for Engine Coolant Temperature.',
    difficulty: 'hard',
    category: 'protocols',
    points: 20
  },
  {
    id: 'G003',
    question: 'What is the typical droop setting for generators in load sharing mode?',
    options: ['0%', '2-5%', '10-15%', '25-30%'],
    correctAnswer: 1,
    explanation: 'Droop of 2-5% allows proportional load sharing without excessive frequency variation.',
    difficulty: 'hard',
    category: 'electrical',
    points: 20
  },
  {
    id: 'G004',
    question: 'How do you verify proper excitation in a brushless alternator?',
    options: [
      'Check oil level',
      'Measure AC voltage at exciter stator, rectifier DC output, and main field',
      'Listen for noise',
      'Check coolant color'
    ],
    correctAnswer: 1,
    explanation: 'Test the excitation chain: PMG/AVR output → exciter stator → rotating rectifier → main field.',
    difficulty: 'hard',
    category: 'electrical',
    points: 20
  },
  {
    id: 'G005',
    question: 'What causes reverse power in a paralleled generator?',
    options: [
      'Too much load',
      'Generator is motoring - receiving power instead of supplying it',
      'High fuel quality',
      'New AVR'
    ],
    correctAnswer: 1,
    explanation: 'Reverse power occurs when a generator\'s engine output is less than losses, causing it to motor.',
    difficulty: 'hard',
    category: 'electrical',
    points: 20
  },
  {
    id: 'G006',
    question: 'In CAN bus diagnostics, what does a dominant bit represent?',
    options: ['Logic 1', 'Logic 0', 'Error state', 'Idle state'],
    correctAnswer: 1,
    explanation: 'In CAN bus, dominant (logic 0) overwrites recessive (logic 1) for arbitration.',
    difficulty: 'hard',
    category: 'protocols',
    points: 20
  },
  {
    id: 'G007',
    question: 'What is the purpose of a kW/kVAR transducer in paralleling applications?',
    options: [
      'Measure fuel consumption',
      'Provide real and reactive power feedback for load sharing',
      'Control engine speed',
      'Monitor coolant temperature'
    ],
    correctAnswer: 1,
    explanation: 'kW/kVAR transducers provide the power measurements needed for accurate load sharing control.',
    difficulty: 'hard',
    category: 'electrical',
    points: 20
  },
  {
    id: 'G008',
    question: 'What should be checked if a generator shows "Phase Rotation" fault?',
    options: [
      'Fuel filter',
      'CT/PT wiring and three-phase connection sequence',
      'Oil level',
      'Radiator cap'
    ],
    correctAnswer: 1,
    explanation: 'Phase rotation faults indicate incorrect phase sequence, often from miswired CTs or phase conductors.',
    difficulty: 'hard',
    category: 'troubleshooting',
    points: 20
  },
  {
    id: 'G009',
    question: 'What is the function of a synchroscope?',
    options: [
      'Measure oil pressure',
      'Display phase angle difference between sources for synchronization',
      'Control fuel flow',
      'Monitor battery voltage'
    ],
    correctAnswer: 1,
    explanation: 'A synchroscope shows the phase angle difference and relative frequency between two AC sources.',
    difficulty: 'hard',
    category: 'electrical',
    points: 20
  },
  {
    id: 'G010',
    question: 'How do you perform a diode test on rotating rectifier assembly?',
    options: [
      'Visual inspection only',
      'Measure forward/reverse resistance with multimeter on each diode',
      'Apply high voltage',
      'Cannot be tested'
    ],
    correctAnswer: 1,
    explanation: 'Test each diode for low forward resistance and high reverse resistance. Replace if shorted or open.',
    difficulty: 'hard',
    category: 'electrical',
    points: 20
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// CERTIFICATION EXAMS
// ═══════════════════════════════════════════════════════════════════════════════

export const CERTIFICATION_EXAMS: CertificationExam[] = [
  {
    id: 'EXAM_BRONZE',
    level: 'bronze',
    title: 'Bronze Technician Certification',
    description: 'Validate your foundational knowledge of generator systems, safety protocols, and basic troubleshooting.',
    passingScore: 70,
    timeLimit: 30,
    questions: BRONZE_QUESTIONS,
    prerequisites: [],
    benefits: [
      'Official Bronze certificate',
      'Community access',
      'Basic diagnostic tools',
      'Technician directory listing'
    ]
  },
  {
    id: 'EXAM_SILVER',
    level: 'silver',
    title: 'Silver Technician Certification',
    description: 'Demonstrate intermediate diagnostic skills, controller knowledge, and systematic troubleshooting ability.',
    passingScore: 75,
    timeLimit: 45,
    questions: SILVER_QUESTIONS,
    prerequisites: ['bronze'],
    benefits: [
      'Official Silver certificate',
      'Controller programming guides',
      'Priority support',
      'Customer referrals'
    ]
  },
  {
    id: 'EXAM_GOLD',
    level: 'gold',
    title: 'Gold Technician Certification',
    description: 'Prove advanced competency in ECM systems, parallel operations, and complex fault diagnosis.',
    passingScore: 80,
    timeLimit: 60,
    questions: GOLD_QUESTIONS,
    prerequisites: ['silver'],
    benefits: [
      'Official Gold certificate',
      'ECM programming access',
      'Fleet management tools',
      'Premium referral network'
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// CERTIFICATION SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

class CertificationService {
  private storageKey = 'generator_oracle_certifications';

  getProfile(): TechnicianProfile | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : null;
  }

  saveProfile(profile: TechnicianProfile): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(profile));
  }

  startExam(level: CertificationLevel): CertificationExam | null {
    return CERTIFICATION_EXAMS.find(e => e.level === level) || null;
  }

  submitExam(
    exam: CertificationExam,
    answers: Record<string, number>
  ): { passed: boolean; score: number; results: QuestionResult[] } {
    const results: QuestionResult[] = exam.questions.map(q => ({
      questionId: q.id,
      correct: answers[q.id] === q.correctAnswer,
      userAnswer: answers[q.id],
      correctAnswer: q.correctAnswer,
      points: answers[q.id] === q.correctAnswer ? q.points : 0
    }));

    const totalPoints = exam.questions.reduce((sum, q) => sum + q.points, 0);
    const earnedPoints = results.reduce((sum, r) => sum + r.points, 0);
    const score = Math.round((earnedPoints / totalPoints) * 100);
    const passed = score >= exam.passingScore;

    return { passed, score, results };
  }

  generateVerificationCode(level: CertificationLevel, date: Date): string {
    const prefix = level.toUpperCase().substring(0, 2);
    const year = date.getFullYear().toString().substring(2);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `GO-${prefix}-${year}-${random}`;
  }

  verifyCertification(code: string): TechnicianCertification | null {
    // In production, this would verify against a database
    // For now, return null (not found)
    return null;
  }

  getNextLevel(currentLevel: CertificationLevel | null): CertificationLevel | null {
    const levels: CertificationLevel[] = ['bronze', 'silver', 'gold', 'platinum', 'master'];
    if (!currentLevel) return 'bronze';
    const index = levels.indexOf(currentLevel);
    return index < levels.length - 1 ? levels[index + 1] : null;
  }

  getHighestCertification(profile: TechnicianProfile): CertificationLevel | null {
    const levels: CertificationLevel[] = ['master', 'platinum', 'gold', 'silver', 'bronze'];
    for (const level of levels) {
      if (profile.certifications.some(c => c.level === level)) {
        return level;
      }
    }
    return null;
  }
}

interface QuestionResult {
  questionId: string;
  correct: boolean;
  userAnswer: number;
  correctAnswer: number;
  points: number;
}

// Singleton instance
let certificationService: CertificationService | null = null;

export function getCertificationService(): CertificationService {
  if (!certificationService) {
    certificationService = new CertificationService();
  }
  return certificationService;
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function formatCertificationDate(date: string): string {
  return new Date(date).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function isCertificationExpired(certification: TechnicianCertification): boolean {
  return new Date(certification.expiryDate) < new Date();
}

export function getTimeRemaining(minutes: number, startTime: Date): { minutes: number; seconds: number } {
  const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
  const remaining = Math.max(0, minutes * 60 - elapsed);
  return {
    minutes: Math.floor(remaining / 60),
    seconds: remaining % 60
  };
}
