'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import UnifiedCTA from '@/components/cta/UnifiedCTA'
import {
  Zap,
  Shield,
  Settings,
  AlertTriangle,
  CheckCircle,
  Phone,
  Clock,
  Wrench,
  Gauge,
  ChevronDown,
  ChevronRight,
  FileText,
  DollarSign,
  Award,
  Users,
  Building,
  Truck,
  Calendar,
  MapPin,
  ArrowRight,
  ThermometerSun,
  Power,
  Activity,
  Lock,
  Server,
  Cpu,
  Cable,
  CircuitBoard
} from 'lucide-react'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface EquipmentType {
  name: string
  voltageRange: string
  applications: string[]
  features: string[]
  specifications: Record<string, string>
}

interface Component {
  name: string
  function: string
  types: string[]
  maintenance: string
  asciiDiagram?: string
}

interface Fault {
  code: string
  name: string
  symptoms: string[]
  causes: string[]
  solutions: string[]
  severity: 'critical' | 'high' | 'medium' | 'low'
}

interface PricingItem {
  item: string
  specification: string
  priceRange: string
  leadTime: string
}

// ============================================================================
// DATA CONSTANTS
// ============================================================================

const EQUIPMENT_TYPES: EquipmentType[] = [
  {
    name: "Distribution Transformers",
    voltageRange: "11kV/415V, 33kV/11kV",
    applications: [
      "Commercial buildings",
      "Industrial facilities",
      "Residential estates",
      "Shopping malls",
      "Office complexes"
    ],
    features: [
      "Oil-cooled or dry-type",
      "Hermetically sealed tank",
      "Tap changer for voltage regulation",
      "Low losses and high efficiency",
      "Compact design for space constraints"
    ],
    specifications: {
      "Capacity Range": "50kVA - 2500kVA",
      "Primary Voltage": "11kV, 33kV",
      "Secondary Voltage": "415V, 11kV",
      "Cooling": "ONAN, ONAF",
      "Efficiency": "98.5% - 99.2%",
      "Impedance": "4% - 6%"
    }
  },
  {
    name: "Power Transformers",
    voltageRange: "33kV - 220kV",
    applications: [
      "Substations",
      "Power plants",
      "Grid interconnections",
      "Heavy industries",
      "Mining operations"
    ],
    features: [
      "On-load tap changer (OLTC)",
      "Forced oil cooling",
      "Buchholz relay protection",
      "Conservator tank",
      "Multiple windings capability"
    ],
    specifications: {
      "Capacity Range": "5MVA - 100MVA",
      "Primary Voltage": "66kV, 132kV, 220kV",
      "Secondary Voltage": "11kV, 33kV, 66kV",
      "Cooling": "ONAN, ONAF, OFAF, OFWF",
      "Efficiency": "99.0% - 99.5%",
      "Vector Group": "Dyn11, YNd11"
    }
  },
  {
    name: "Ring Main Units (RMU)",
    voltageRange: "11kV - 33kV",
    applications: [
      "Urban distribution networks",
      "Industrial parks",
      "Commercial complexes",
      "Underground networks",
      "Wind/solar farms"
    ],
    features: [
      "SF6 or vacuum insulated",
      "Compact modular design",
      "Load break switches",
      "Fuse protection",
      "Extensible configurations"
    ],
    specifications: {
      "Rated Voltage": "12kV, 24kV, 36kV",
      "Rated Current": "630A, 1250A",
      "Breaking Capacity": "16kA, 20kA, 25kA",
      "Configuration": "2-way, 3-way, 4-way",
      "Insulation": "SF6, Solid (RMUS)",
      "IP Rating": "IP65, IP67"
    }
  },
  {
    name: "Medium Voltage Switchgear",
    voltageRange: "3.3kV - 36kV",
    applications: [
      "Industrial plants",
      "Power stations",
      "Substations",
      "Commercial buildings",
      "Data centers"
    ],
    features: [
      "Vacuum or SF6 circuit breakers",
      "Draw-out design",
      "Numerical protection relays",
      "Interlocking mechanisms",
      "Arc-resistant construction"
    ],
    specifications: {
      "Rated Voltage": "3.3kV, 6.6kV, 11kV, 33kV",
      "Rated Current": "630A - 4000A",
      "Breaking Capacity": "25kA - 50kA",
      "Making Capacity": "63kA - 125kA",
      "Short-time Rating": "1s, 3s",
      "Standards": "IEC 62271-200"
    }
  },
  {
    name: "High Voltage Circuit Breakers",
    voltageRange: "66kV - 400kV",
    applications: [
      "Transmission substations",
      "Power plants",
      "Grid interconnections",
      "HVDC terminals",
      "Large industrial facilities"
    ],
    features: [
      "SF6 or vacuum interruption",
      "Spring/hydraulic mechanism",
      "Auto-reclosing capability",
      "Condition monitoring",
      "Seismic resistant design"
    ],
    specifications: {
      "Rated Voltage": "66kV, 132kV, 220kV, 400kV",
      "Rated Current": "2000A - 5000A",
      "Breaking Capacity": "40kA - 63kA",
      "Operating Mechanism": "Spring, Hydraulic",
      "Interrupting Time": "2-3 cycles",
      "Standards": "IEC 62271-100"
    }
  },
  {
    name: "Outdoor Substations",
    voltageRange: "33kV - 220kV",
    applications: [
      "Utility substations",
      "Industrial complexes",
      "Mining operations",
      "Cement factories",
      "Steel plants"
    ],
    features: [
      "Air-insulated switchgear (AIS)",
      "Galvanized steel structures",
      "Outdoor transformers",
      "Lightning arresters",
      "Control building integration"
    ],
    specifications: {
      "Voltage Levels": "33kV, 66kV, 132kV, 220kV",
      "Bus Configuration": "Single, Double, Ring",
      "Protection Class": "Zone 1, Zone 2, Zone 3",
      "Automation Level": "IEC 61850",
      "Grounding": "Mesh type",
      "Clearances": "Per IEC 60071"
    }
  }
]

const COMPONENTS: Component[] = [
  {
    name: "Power Transformer",
    function: "Steps up or down voltage levels for efficient power transmission and distribution",
    types: [
      "Core-type transformer",
      "Shell-type transformer",
      "Auto-transformer",
      "Instrument transformer"
    ],
    maintenance: "Oil testing every 6 months, thermographic survey annually, winding resistance test every 2 years",
    asciiDiagram: `
    ┌─────────────────────────────────────────────────────────────┐
    │                    POWER TRANSFORMER                        │
    │  ┌─────────────────────────────────────────────────────┐   │
    │  │   ┌─────┐     CONSERVATOR TANK    ┌─────┐          │   │
    │  │   │ OIL │═════════════════════════│BUCH │          │   │
    │  │   │LEVEL│                         │HOLZ │          │   │
    │  │   └─────┘                         └─────┘          │   │
    │  └─────────────────────────────────────────────────────┘   │
    │       │                                    │               │
    │  ┌────┴────────────────────────────────────┴────┐         │
    │  │              MAIN TANK                        │         │
    │  │   ┌─────────┐          ┌─────────┐           │         │
    │  │   │ PRIMARY │   CORE   │SECONDARY│           │         │
    │  │   │ WINDING │  ╔═══╗   │ WINDING │           │         │
    │  │   │  ~~~~   │  ║ F ║   │  ~~~~   │           │         │
    │  │   │  ~~~~   │  ║ E ║   │  ~~~~   │           │ OLTC    │
    │  │   │  ~~~~   │  ║ R ║   │  ~~~~   │           │ ┌───┐   │
    │  │   │  ~~~~   │  ║ R ║   │  ~~~~   │           │ │TAP│   │
    │  │   │  ~~~~   │  ║ O ║   │  ~~~~   │           │ │CHG│   │
    │  │   └────┬────┘  ╚═══╝   └────┬────┘           │ └───┘   │
    │  │        │                    │                │         │
    │  └────────┼────────────────────┼────────────────┘         │
    │  ═════════╪════════════════════╪═════════════════         │
    │      HV BUSHINGS          LV BUSHINGS                     │
    │     (11kV/33kV)           (415V/11kV)                     │
    │  ┌─────────────────────────────────────────────┐          │
    │  │              RADIATOR BANK                   │          │
    │  │    ═══   ═══   ═══   ═══   ═══   ═══        │          │
    │  │    │││   │││   │││   │││   │││   │││        │          │
    │  │    ═══   ═══   ═══   ═══   ═══   ═══        │          │
    │  └─────────────────────────────────────────────┘          │
    │              OIL COOLING FINS                              │
    └─────────────────────────────────────────────────────────────┘
    `
  },
  {
    name: "Circuit Breaker",
    function: "Interrupts fault currents and provides switching operations for power circuits",
    types: [
      "Vacuum circuit breaker (VCB)",
      "SF6 circuit breaker",
      "Oil circuit breaker (OCB)",
      "Air blast circuit breaker"
    ],
    maintenance: "Contact inspection every 2000 operations, mechanism lubrication annually, SF6 gas test every 3 years",
    asciiDiagram: `
    ┌─────────────────────────────────────────────────────────────┐
    │               VACUUM CIRCUIT BREAKER (VCB)                  │
    │  ┌─────────────────────────────────────────────────────┐   │
    │  │   LINE TERMINAL                                      │   │
    │  │        ║                                             │   │
    │  │   ┌────╨────┐                                        │   │
    │  │   │ UPPER   │←── Fixed Contact                       │   │
    │  │   │ CONTACT │                                        │   │
    │  │   └────┬────┘                                        │   │
    │  │        │      ┌──────────────────┐                   │   │
    │  │   ╔════╧════╗ │  VACUUM BOTTLE   │                   │   │
    │  │   ║ VACUUM  ║ │  • 10⁻⁶ mbar    │                   │   │
    │  │   ║ CHAMBER ║ │  • Arc quenching │                   │   │
    │  │   ║         ║ │  • No maintenance│                   │   │
    │  │   ╚════╤════╝ └──────────────────┘                   │   │
    │  │   ┌────┴────┐                                        │   │
    │  │   │ MOVING  │←── Moving Contact                      │   │
    │  │   │ CONTACT │                                        │   │
    │  │   └────┬────┘                                        │   │
    │  │        │                                             │   │
    │  │   ┌────┴────┐  ┌────────────────────────────┐       │   │
    │  │   │BELLOWS  │  │  OPERATING MECHANISM       │       │   │
    │  │   │ SEAL    │  │  ┌────┐  ┌────┐  ┌────┐   │       │   │
    │  │   └────┬────┘  │  │SPRING│ │CAM │ │LATCH│  │       │   │
    │  │        ║       │  └────┘  └────┘  └────┘   │       │   │
    │  │   LOAD TERMINAL│  └── Stored Energy        │       │   │
    │  │                │      Mechanism             │       │   │
    │  └────────────────┴────────────────────────────┴───────┘   │
    └─────────────────────────────────────────────────────────────┘
    `
  },
  {
    name: "Current Transformer (CT)",
    function: "Steps down high currents to measurable levels for protection and metering",
    types: [
      "Wound primary CT",
      "Bar primary CT",
      "Bushing CT",
      "Optical CT"
    ],
    maintenance: "Secondary winding test annually, insulation resistance test, burden verification",
    asciiDiagram: `
    ┌─────────────────────────────────────────────────────────────┐
    │              CURRENT TRANSFORMER (CT)                       │
    │                                                             │
    │      PRIMARY CONDUCTOR (HIGH CURRENT)                       │
    │           ════════════════════════                          │
    │                    │                                        │
    │           ┌────────┼────────┐                               │
    │           │   ╔════╪════╗   │                               │
    │           │   ║    │    ║   │ ←── IRON CORE                │
    │           │   ║ ┌──┴──┐ ║   │     (Laminated Silicon Steel)│
    │           │   ║ │     │ ║   │                               │
    │           │   ║ │  P  │ ║   │  P = Primary (1 Turn)        │
    │           │   ║ │     │ ║   │  S = Secondary (Many Turns)  │
    │           │   ║ └──┬──┘ ║   │                               │
    │           │   ║    │    ║   │                               │
    │           │   ╚════╪════╝   │                               │
    │           │  ~~~~~~│~~~~~~  │ ←── SECONDARY WINDING        │
    │           │  ~ S S S S S ~  │     (Low Current Output)     │
    │           │  ~~~~~~│~~~~~~  │                               │
    │           └────────┼────────┘                               │
    │                    │                                        │
    │               ┌────┴────┐                                   │
    │               │ S1   S2 │←── Secondary Terminals           │
    │               │  1A/5A  │    (To Relay/Meter)              │
    │               └─────────┘                                   │
    │                                                             │
    │   RATIO: 100/5A, 200/5A, 400/5A, 600/5A, 1000/5A, 2000/5A  │
    │   CLASS: 0.5, 0.5S (Metering) | 5P10, 5P20 (Protection)    │
    └─────────────────────────────────────────────────────────────┘
    `
  },
  {
    name: "Potential Transformer (PT/VT)",
    function: "Steps down high voltage to safe measurable levels for metering and protection",
    types: [
      "Electromagnetic PT",
      "Capacitor voltage transformer (CVT)",
      "Optical voltage transformer"
    ],
    maintenance: "Ratio test annually, insulation resistance measurement, fuse inspection",
    asciiDiagram: `
    ┌─────────────────────────────────────────────────────────────┐
    │            POTENTIAL TRANSFORMER (PT/VT)                    │
    │                                                             │
    │         HV LINE (11kV/33kV)                                 │
    │              ║                                              │
    │         ┌────╨────┐                                         │
    │         │HV FUSE  │←── HV Protection Fuse                  │
    │         └────┬────┘                                         │
    │              │                                              │
    │    ┌─────────┴─────────┐                                    │
    │    │   ╔═══════════╗   │                                    │
    │    │   ║  PRIMARY  ║   │                                    │
    │    │   ║  WINDING  ║   │ ←── Many Turns (HV Side)          │
    │    │   ║  ~~~~~~~~ ║   │                                    │
    │    │   ║  ~~~~~~~~ ║   │                                    │
    │    │   ╠═══════════╣   │ ←── LAMINATED CORE                │
    │    │   ║SECONDARY  ║   │                                    │
    │    │   ║ WINDING   ║   │ ←── Few Turns (LV Side)           │
    │    │   ║   ~~~~    ║   │                                    │
    │    │   ╚═════╤═════╝   │                                    │
    │    └─────────┼─────────┘                                    │
    │         ┌────┴────┐                                         │
    │         │ a    n  │←── Secondary: 110V/√3 or 110V          │
    │         │(63.5V)  │    (To Relay/Meter)                    │
    │         └─────────┘                                         │
    │                                                             │
    │   RATIO: 11000/110V, 33000/110V                            │
    │   CLASS: 0.5, 0.2 (Metering) | 3P (Protection)             │
    │   BURDEN: 25VA, 50VA, 100VA                                │
    └─────────────────────────────────────────────────────────────┘
    `
  },
  {
    name: "Lightning Arrester",
    function: "Protects equipment from voltage surges caused by lightning or switching operations",
    types: [
      "Gapped silicon carbide",
      "Metal oxide (MOV) gapless",
      "Polymer housed",
      "Porcelain housed"
    ],
    maintenance: "Leakage current measurement annually, visual inspection, grounding verification",
    asciiDiagram: `
    ┌─────────────────────────────────────────────────────────────┐
    │              METAL OXIDE SURGE ARRESTER                     │
    │                                                             │
    │              LINE TERMINAL                                  │
    │                   ║                                         │
    │              ┌────╨────┐                                    │
    │              │  CAP    │←── Weather Shield                 │
    │              └────┬────┘                                    │
    │    ┌──────────────┼──────────────┐                         │
    │    │         ┌────┴────┐         │                         │
    │    │         │  MOV    │←── Metal Oxide Varistor          │
    │    │         │ BLOCK 1 │    (ZnO - Zinc Oxide)            │
    │    │         └────┬────┘                                   │
    │    │         ┌────┴────┐                                   │
    │    │         │  MOV    │                                   │
    │    │  SILICONE│ BLOCK 2 │                                   │
    │    │  HOUSING │────┬────┘                                   │
    │    │         ┌────┴────┐                                   │
    │    │         │  MOV    │                                   │
    │    │         │ BLOCK 3 │                                   │
    │    │         └────┬────┘                                   │
    │    │         ┌────┴────┐                                   │
    │    │         │  MOV    │                                   │
    │    │         │ BLOCK 4 │                                   │
    │    │         └────┬────┘                                   │
    │    └──────────────┼──────────────┘                         │
    │              ┌────┴────┐                                    │
    │              │ FLANGE  │                                    │
    │              └────┬────┘                                    │
    │                   ║                                         │
    │              GROUND ⏚                                       │
    │                                                             │
    │   RATINGS: 10kA, 20kA (Discharge Current)                  │
    │   MCOV: 8.4kV (11kV), 24kV (33kV)                          │
    └─────────────────────────────────────────────────────────────┘
    `
  },
  {
    name: "Isolator/Disconnector",
    function: "Provides visible isolation for maintenance and creates air gap for safety",
    types: [
      "Horizontal break",
      "Vertical break",
      "Pantograph type",
      "Double break"
    ],
    maintenance: "Contact cleaning annually, mechanism lubrication, interlock verification",
    asciiDiagram: `
    ┌─────────────────────────────────────────────────────────────┐
    │              HORIZONTAL BREAK ISOLATOR                      │
    │                                                             │
    │   ┌─────────────────────────────────────────────────────┐  │
    │   │                    CLOSED POSITION                   │  │
    │   │                                                      │  │
    │   │     POST          BLADE           POST               │  │
    │   │    INSULATOR  ═══════════════   INSULATOR           │  │
    │   │       │      ↑              ↑      │                 │  │
    │   │       │    HINGE          JAW      │                 │  │
    │   │      ███      │              │    ███                │  │
    │   │      ███    ══╪══════════════╪══  ███                │  │
    │   │      ███      │              │    ███                │  │
    │   │       │       │              │     │                 │  │
    │   │     BASE    PIVOT        CONTACT  BASE               │  │
    │   └─────────────────────────────────────────────────────┘  │
    │                                                             │
    │   ┌─────────────────────────────────────────────────────┐  │
    │   │                     OPEN POSITION                    │  │
    │   │                                                      │  │
    │   │     POST                          POST               │  │
    │   │    INSULATOR    ╱ BLADE          INSULATOR          │  │
    │   │       │       ╱ (ROTATED)          │                │  │
    │   │      ███    ╱                     ███                │  │
    │   │      ███  ═╱═         ═══════════ ███                │  │
    │   │      ███ ↙           AIR GAP      ███                │  │
    │   │       │   (VISIBLE ISOLATION)      │                │  │
    │   │     BASE                          BASE               │  │
    │   └─────────────────────────────────────────────────────┘  │
    │                                                             │
    │   RATINGS: 630A, 1250A, 2500A | MAKING CAPACITY: 40kA     │
    └─────────────────────────────────────────────────────────────┘
    `
  }
]

const FAULTS: Fault[] = [
  {
    code: "HV-001",
    name: "Transformer Overheating",
    symptoms: [
      "Oil temperature above 95°C",
      "Winding temperature alarm",
      "Oil level dropping",
      "Unusual smell/smoke"
    ],
    causes: [
      "Overloading beyond rated capacity",
      "Blocked cooling radiators",
      "Failed cooling fans",
      "Internal short circuit developing",
      "Poor ventilation in transformer room"
    ],
    solutions: [
      "Reduce load immediately",
      "Check and clean radiator fins",
      "Verify cooling fan operation",
      "Check oil level and top up if needed",
      "Perform dissolved gas analysis (DGA)",
      "Schedule thermographic survey"
    ],
    severity: "high"
  },
  {
    code: "HV-002",
    name: "Buchholz Relay Alarm",
    symptoms: [
      "Gas accumulation alarm",
      "Oil surge trip",
      "Float operation"
    ],
    causes: [
      "Minor internal arcing",
      "Core/winding insulation breakdown",
      "Air ingress through seals",
      "Oil decomposition",
      "Tap changer problems"
    ],
    solutions: [
      "Collect gas sample for analysis",
      "Check dissolved gas in oil",
      "Inspect conservator breather",
      "Test oil dielectric strength",
      "If combustible gases found, take transformer offline"
    ],
    severity: "critical"
  },
  {
    code: "HV-003",
    name: "Circuit Breaker Failure to Trip",
    symptoms: [
      "Breaker remains closed on fault",
      "Backup protection operates",
      "Trip coil failure alarm"
    ],
    causes: [
      "Trip coil burnt out",
      "DC supply failure",
      "Mechanism binding/jam",
      "Protection relay failure",
      "Auxiliary contact problems"
    ],
    solutions: [
      "Check DC control supply voltage",
      "Test trip coil continuity",
      "Inspect mechanism linkages",
      "Verify protection relay operation",
      "Perform timing test after repair"
    ],
    severity: "critical"
  },
  {
    code: "HV-004",
    name: "SF6 Gas Low Pressure",
    symptoms: [
      "Low gas pressure alarm",
      "Breaker lockout",
      "Density monitor warning"
    ],
    causes: [
      "Gas leak from seals",
      "Bushing seal failure",
      "Operating mechanism seal deterioration",
      "Temperature compensation failure"
    ],
    solutions: [
      "Check ambient temperature compensation",
      "Perform leak detection test",
      "Top up SF6 gas to rated pressure",
      "Replace faulty seals",
      "Log gas history for trend analysis"
    ],
    severity: "high"
  },
  {
    code: "HV-005",
    name: "Voltage Transformer Fuse Blown",
    symptoms: [
      "Loss of voltage indication",
      "Metering showing zero",
      "Protection mal-operation"
    ],
    causes: [
      "Internal PT fault",
      "Secondary wiring short circuit",
      "Overburden on PT",
      "Ferroresonance",
      "Lightning surge"
    ],
    solutions: [
      "Check for short circuit in secondary",
      "Test PT insulation resistance",
      "Verify burden is within rating",
      "Replace HV fuse with correct rating",
      "Check for ferroresonance damping"
    ],
    severity: "medium"
  },
  {
    code: "HV-006",
    name: "Earth Fault in Cable",
    symptoms: [
      "Earth fault protection trip",
      "Zero sequence current alarm",
      "Insulation resistance low"
    ],
    causes: [
      "Cable insulation damage",
      "Water ingress in cable joint",
      "Termination failure",
      "Mechanical damage during excavation",
      "Thermal breakdown"
    ],
    solutions: [
      "Perform cable fault location test",
      "Megger test to identify faulty phase",
      "TDR test for fault distance",
      "Excavate and repair/replace cable section",
      "Install proper cable protection"
    ],
    severity: "high"
  },
  {
    code: "HV-007",
    name: "Overcurrent Relay Trip",
    symptoms: [
      "Instantaneous or time-delayed trip",
      "Phase current above pickup",
      "Motor starting problems"
    ],
    causes: [
      "Overload condition",
      "Phase-to-phase fault",
      "Motor locked rotor",
      "Incorrect relay settings",
      "CT saturation"
    ],
    solutions: [
      "Check load current vs relay settings",
      "Verify motor starting current",
      "Test CT ratio and saturation",
      "Review protection coordination",
      "Adjust relay settings if needed"
    ],
    severity: "medium"
  },
  {
    code: "HV-008",
    name: "Busbar Differential Trip",
    symptoms: [
      "All breakers on busbar tripped",
      "Differential current detected",
      "Major plant outage"
    ],
    causes: [
      "Busbar insulation failure",
      "Loose connections arcing",
      "Animal/foreign object contact",
      "CT circuit open/short",
      "Wrong CT polarity"
    ],
    solutions: [
      "Inspect busbar for visual damage",
      "Check all CT secondary circuits",
      "Thermal scan for hot joints",
      "Test differential relay settings",
      "Perform CT polarity test"
    ],
    severity: "critical"
  },
  {
    code: "HV-009",
    name: "Transformer Oil Leakage",
    symptoms: [
      "Oil stains on transformer",
      "Low oil level alarm",
      "Oil in transformer pit"
    ],
    causes: [
      "Gasket deterioration",
      "Radiator valve leak",
      "Drain valve not sealed",
      "Welding crack",
      "Bushing seal failure"
    ],
    solutions: [
      "Identify leak source",
      "Tighten flanges/valves",
      "Replace gaskets",
      "Apply leak sealant for minor leaks",
      "Schedule oil-free period for major repair"
    ],
    severity: "medium"
  },
  {
    code: "HV-010",
    name: "Protection Relay Communication Failure",
    symptoms: [
      "SCADA communication loss",
      "IEC 61850 GOOSE failure",
      "Remote monitoring unavailable"
    ],
    causes: [
      "Fiber optic cable damage",
      "Switch/router failure",
      "Relay ethernet port fault",
      "Configuration mismatch",
      "Power supply to communication equipment"
    ],
    solutions: [
      "Check fiber continuity",
      "Verify network switch status",
      "Restart relay communication module",
      "Review IP addressing and VLAN settings",
      "Replace faulty communication hardware"
    ],
    severity: "low"
  }
]

const PRICING: PricingItem[] = [
  {
    item: "11kV/415V Distribution Transformer",
    specification: "100kVA, ONAN Cooling, Dyn11",
    priceRange: "KES 450,000 - 600,000",
    leadTime: "3-4 weeks"
  },
  {
    item: "11kV/415V Distribution Transformer",
    specification: "315kVA, ONAN Cooling, Dyn11",
    priceRange: "KES 850,000 - 1,100,000",
    leadTime: "4-5 weeks"
  },
  {
    item: "11kV/415V Distribution Transformer",
    specification: "500kVA, ONAN Cooling, Dyn11",
    priceRange: "KES 1,200,000 - 1,500,000",
    leadTime: "4-6 weeks"
  },
  {
    item: "11kV/415V Distribution Transformer",
    specification: "1000kVA, ONAN Cooling, Dyn11",
    priceRange: "KES 2,000,000 - 2,500,000",
    leadTime: "6-8 weeks"
  },
  {
    item: "33kV/11kV Power Transformer",
    specification: "2.5MVA, ONAN/ONAF, with OLTC",
    priceRange: "KES 8,000,000 - 12,000,000",
    leadTime: "10-12 weeks"
  },
  {
    item: "33kV/11kV Power Transformer",
    specification: "5MVA, ONAN/ONAF, with OLTC",
    priceRange: "KES 15,000,000 - 20,000,000",
    leadTime: "12-16 weeks"
  },
  {
    item: "11kV Vacuum Circuit Breaker",
    specification: "630A, 25kA, Draw-out type",
    priceRange: "KES 350,000 - 500,000",
    leadTime: "4-6 weeks"
  },
  {
    item: "11kV Ring Main Unit",
    specification: "3-way, 630A, SF6 insulated",
    priceRange: "KES 800,000 - 1,200,000",
    leadTime: "6-8 weeks"
  },
  {
    item: "33kV SF6 Circuit Breaker",
    specification: "1250A, 25kA, Outdoor",
    priceRange: "KES 1,500,000 - 2,000,000",
    leadTime: "8-10 weeks"
  },
  {
    item: "11kV Switchgear Panel",
    specification: "4-panel lineup, VCB type",
    priceRange: "KES 4,000,000 - 6,000,000",
    leadTime: "10-12 weeks"
  },
  {
    item: "33kV Outdoor Isolator",
    specification: "1250A, Double break, with earth switch",
    priceRange: "KES 300,000 - 450,000",
    leadTime: "4-6 weeks"
  },
  {
    item: "11kV Current Transformer",
    specification: "400/5A, 5P20, Epoxy cast",
    priceRange: "KES 25,000 - 40,000",
    leadTime: "1-2 weeks"
  },
  {
    item: "11kV Potential Transformer",
    specification: "11kV/110V, 0.5 class",
    priceRange: "KES 45,000 - 70,000",
    leadTime: "1-2 weeks"
  },
  {
    item: "11kV Lightning Arrester",
    specification: "10kA, Polymer housed",
    priceRange: "KES 15,000 - 25,000",
    leadTime: "1 week"
  },
  {
    item: "33kV Lightning Arrester",
    specification: "10kA, Polymer housed",
    priceRange: "KES 35,000 - 50,000",
    leadTime: "1-2 weeks"
  },
  {
    item: "Protection Relay - Overcurrent",
    specification: "Numerical, 50/51, IEC 61850",
    priceRange: "KES 150,000 - 250,000",
    leadTime: "2-4 weeks"
  },
  {
    item: "Protection Relay - Differential",
    specification: "Transformer differential, 87T",
    priceRange: "KES 350,000 - 500,000",
    leadTime: "3-4 weeks"
  },
  {
    item: "11kV XLPE Cable",
    specification: "3x95mm², armoured, per meter",
    priceRange: "KES 2,500 - 3,500/m",
    leadTime: "1-2 weeks"
  },
  {
    item: "33kV XLPE Cable",
    specification: "3x150mm², armoured, per meter",
    priceRange: "KES 5,000 - 7,000/m",
    leadTime: "2-3 weeks"
  },
  {
    item: "Complete 11kV Substation",
    specification: "500kVA, RMU + Transformer + LV Panel",
    priceRange: "KES 4,500,000 - 6,500,000",
    leadTime: "8-12 weeks"
  },
  {
    item: "Complete 33kV/11kV Substation",
    specification: "5MVA, Full protection & control",
    priceRange: "KES 35,000,000 - 50,000,000",
    leadTime: "16-24 weeks"
  },
  {
    item: "Substation Civil Works",
    specification: "Control room, transformer plinth, fencing",
    priceRange: "KES 2,000,000 - 5,000,000",
    leadTime: "6-8 weeks"
  },
  {
    item: "Transformer Oil Testing",
    specification: "DGA, moisture, BDV, acidity",
    priceRange: "KES 25,000 - 40,000",
    leadTime: "3-5 days"
  },
  {
    item: "Transformer Oil Regeneration",
    specification: "Per 1000 liters, on-site",
    priceRange: "KES 150,000 - 250,000",
    leadTime: "1-2 days"
  },
  {
    item: "HV Cable Fault Location",
    specification: "TDR and thumper method",
    priceRange: "KES 50,000 - 100,000",
    leadTime: "1-2 days"
  }
]

const SAFETY_GUIDELINES = [
  {
    title: "Work Permit System",
    description: "Always obtain Permit to Work (PTW) before any HV work",
    steps: [
      "Submit PTW request to control room",
      "Identify equipment and isolation points",
      "Verify switching schedule",
      "Obtain signed permit before work"
    ]
  },
  {
    title: "Isolation Procedure",
    description: "Follow LOTO (Lockout-Tagout) procedures strictly",
    steps: [
      "Open circuit breaker",
      "Rack out/withdraw breaker",
      "Open isolators both sides",
      "Apply earths/grounds",
      "Apply locks and tags",
      "Verify dead with voltage tester"
    ]
  },
  {
    title: "Personal Protective Equipment",
    description: "Mandatory PPE for HV work",
    steps: [
      "Arc flash rated clothing (Cal/cm²)",
      "Insulated gloves with leather protectors",
      "Safety helmet with face shield",
      "Safety boots (electrical rated)",
      "Arc flash hood for switching"
    ]
  },
  {
    title: "Minimum Approach Distance",
    description: "Maintain safe distances from live equipment",
    steps: [
      "11kV: 0.7 meters minimum",
      "33kV: 1.0 meters minimum",
      "66kV: 1.2 meters minimum",
      "132kV: 1.8 meters minimum",
      "Use barriers if closer work required"
    ]
  },
  {
    title: "Emergency Procedures",
    description: "Be prepared for emergencies",
    steps: [
      "Know emergency trip button locations",
      "Keep fire extinguishers accessible (CO2 for electrical)",
      "Know evacuation routes",
      "First aid trained personnel on site",
      "Emergency contact numbers posted"
    ]
  }
]

const TESTING_PROCEDURES = [
  {
    name: "Transformer Tests",
    tests: [
      "Winding resistance measurement",
      "Turns ratio test",
      "Insulation resistance (Megger)",
      "Tan delta / Power factor",
      "Dissolved gas analysis (DGA)",
      "Oil BDV (Breakdown voltage)",
      "Sweep frequency response analysis (SFRA)"
    ]
  },
  {
    name: "Circuit Breaker Tests",
    tests: [
      "Contact resistance test",
      "Timing test (close/open)",
      "Insulation resistance",
      "SF6 gas purity and moisture",
      "Operating mechanism test",
      "Trip/close coil resistance",
      "Vacuum bottle integrity test"
    ]
  },
  {
    name: "Protection Relay Tests",
    tests: [
      "Pickup value verification",
      "Operating time test",
      "CT/VT circuit continuity",
      "Trip circuit supervision",
      "Secondary injection test",
      "Primary injection test",
      "Communication/GOOSE test"
    ]
  },
  {
    name: "Cable Tests",
    tests: [
      "Insulation resistance (Megger)",
      "VLF/Tan delta test",
      "Partial discharge measurement",
      "Sheath continuity test",
      "TDR (Time domain reflectometry)",
      "High voltage withstand test"
    ]
  }
]

// ============================================================================
// COMPONENT
// ============================================================================

const HighVoltagePage = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedFault, setExpandedFault] = useState<string | null>(null)
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'equipment', label: 'Equipment Types', icon: Server },
    { id: 'components', label: 'Components', icon: CircuitBoard },
    { id: 'safety', label: 'Safety', icon: Shield },
    { id: 'testing', label: 'Testing', icon: Activity },
    { id: 'installation', label: 'Installation', icon: Wrench },
    { id: 'maintenance', label: 'Maintenance', icon: Settings },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: AlertTriangle },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'warranty', label: 'Warranty', icon: Award }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[70vh] min-h-[600px] overflow-hidden">
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0"
        >
          <Image
            src="/images/high-voltage-hero.jpg"
            alt="High Voltage Infrastructure"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </motion.div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-yellow-500/20 rounded-xl backdrop-blur-sm">
                  <Zap className="w-8 h-8 text-yellow-400" />
                </div>
                <span className="text-yellow-400 font-semibold tracking-wider uppercase">
                  Power Infrastructure Solutions
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                High Voltage Infrastructure
                <span className="block text-yellow-400">& Power Systems</span>
              </h1>

              <p className="text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
                Complete solutions for high voltage electrical infrastructure including transformers,
                switchgear, substations, and power distribution systems across East Africa.
                Expert installation, maintenance, and 24/7 emergency support.
              </p>

              <div className="flex flex-wrap gap-4">
                <UnifiedCTA
                  action="custom"
                  href="https://wa.me/254722274914?text=High%20Voltage%20Infrastructure%20Inquiry"
                  label="WhatsApp Consultation"
                />
                <UnifiedCTA
                  action="custom"
                  href="tel:+254722274914"
                  variant="secondary"
                  label="Call: +254 722 274 914"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "220kV", label: "Maximum Voltage" },
                { value: "500+", label: "Substations Installed" },
                { value: "24/7", label: "Emergency Response" },
                { value: "35+", label: "Years Experience" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold text-yellow-400">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="sticky top-0 z-40 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-600 hover:text-yellow-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900">
                      High Voltage Infrastructure Solutions
                    </h2>

                    <div className="prose prose-lg max-w-none text-gray-600">
                      <p>
                        High voltage electrical infrastructure forms the backbone of modern power distribution,
                        enabling efficient transmission of electricity from generation sources to end consumers.
                        Our comprehensive solutions cover the entire spectrum from 3.3kV medium voltage systems
                        to 220kV extra high voltage transmission infrastructure.
                      </p>

                      <p>
                        With over 35 years of experience in the East African power sector, we have established
                        ourselves as the region's leading provider of high voltage equipment, installation,
                        testing, and maintenance services. Our team of certified engineers and technicians
                        brings expertise in handling complex power infrastructure projects.
                      </p>

                      <p>
                        Transformers are the heart of any electrical distribution system, stepping voltage
                        levels up for efficient long-distance transmission and down for safe utilization.
                        We supply, install, and maintain transformers ranging from 50kVA distribution units
                        to 100MVA power transformers for utility substations.
                      </p>

                      <p>
                        Switchgear provides essential switching and protection functions, isolating faulty
                        sections and enabling safe maintenance operations. Our portfolio includes vacuum
                        circuit breakers, SF6 switchgear, ring main units, and complete switchboard solutions
                        meeting IEC international standards.
                      </p>

                      <p>
                        Substations serve as the critical nodes in power networks, housing transformers,
                        switchgear, protection systems, and control equipment. We design, construct, and
                        commission complete substations from compact package units to large outdoor installations
                        handling multiple voltage levels.
                      </p>

                      <p>
                        Power cables provide the physical link between electrical equipment, carrying high
                        voltage power safely underground or through cable trays. We supply XLPE insulated
                        cables for medium and high voltage applications, along with professional jointing
                        and termination services.
                      </p>

                      <p>
                        Protection systems safeguard expensive equipment and ensure network stability by
                        detecting and clearing faults within milliseconds. Our solutions include numerical
                        protection relays, current and voltage transformers, and complete protection
                        coordination studies.
                      </p>

                      <p>
                        Proper grounding and lightning protection are essential for personnel safety and
                        equipment protection. We design and install earthing systems, lightning arresters,
                        and surge protection devices meeting IEEE and IEC standards.
                      </p>

                      <p>
                        Our services extend beyond equipment supply to include comprehensive testing,
                        commissioning, and preventive maintenance programs. Regular testing ensures equipment
                        reliability and identifies potential issues before they cause costly failures.
                      </p>

                      <p>
                        We maintain strategic partnerships with leading global manufacturers including ABB,
                        Siemens, Schneider Electric, and local manufacturers, ensuring access to quality
                        equipment with competitive pricing and reliable spare parts availability.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Capabilities</h3>
                      <ul className="space-y-3">
                        {[
                          "Transformer supply & installation",
                          "Switchgear & protection systems",
                          "Complete substation construction",
                          "HV cable laying & jointing",
                          "Power system studies",
                          "Testing & commissioning",
                          "Preventive maintenance",
                          "24/7 emergency response"
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gray-900 rounded-xl p-6 text-white">
                      <h3 className="text-lg font-semibold mb-4">Emergency Support</h3>
                      <p className="text-gray-300 mb-4">
                        Power failures can have severe consequences. Our emergency team is available
                        24/7 for critical situations.
                      </p>
                      <div className="space-y-3">
                        <a href="tel:+254722274914" className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300">
                          <Phone className="w-5 h-5" />
                          <span>+254 722 274 914</span>
                        </a>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Clock className="w-5 h-5" />
                          <span>Response within 2 hours</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• ERC Licensed Contractor</li>
                        <li>• ISO 9001:2015 Certified</li>
                        <li>• KEBS Approved Supplier</li>
                        <li>• KPLC Approved Partner</li>
                        <li>• NCA Registered (NCA 1)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Equipment Types Tab */}
            {activeTab === 'equipment' && (
              <motion.div
                key="equipment"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">High Voltage Equipment Types</h2>

                <div className="grid gap-8">
                  {EQUIPMENT_TYPES.map((equipment, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{equipment.name}</h3>
                            <p className="text-yellow-600 font-medium">{equipment.voltageRange}</p>
                          </div>
                          <div className="p-3 bg-yellow-100 rounded-lg">
                            <Zap className="w-6 h-6 text-yellow-600" />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Applications</h4>
                            <ul className="space-y-1">
                              {equipment.applications.map((app, idx) => (
                                <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                                  <ChevronRight className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                                  {app}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Features</h4>
                            <ul className="space-y-1">
                              {equipment.features.map((feature, idx) => (
                                <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Specifications</h4>
                            <div className="space-y-1">
                              {Object.entries(equipment.specifications).map(([key, value], idx) => (
                                <div key={idx} className="text-sm">
                                  <span className="text-gray-500">{key}:</span>
                                  <span className="text-gray-900 ml-2">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Components Tab */}
            {activeTab === 'components' && (
              <motion.div
                key="components"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">High Voltage System Components</h2>

                <div className="space-y-4">
                  {COMPONENTS.map((component, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedComponent(
                          expandedComponent === component.name ? null : component.name
                        )}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <CircuitBoard className="w-5 h-5 text-yellow-600" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-gray-900">{component.name}</h3>
                            <p className="text-sm text-gray-500">{component.function}</p>
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            expandedComponent === component.name ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {expandedComponent === component.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                              <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-3">Types</h4>
                                  <ul className="space-y-2">
                                    {component.types.map((type, idx) => (
                                      <li key={idx} className="flex items-center gap-2 text-gray-600">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                                        {type}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-3">Maintenance</h4>
                                  <p className="text-gray-600">{component.maintenance}</p>
                                </div>
                              </div>

                              {component.asciiDiagram && (
                                <div className="mt-6">
                                  <h4 className="font-medium text-gray-900 mb-3">Technical Diagram</h4>
                                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                    <pre className="text-green-400 text-xs md:text-sm font-mono whitespace-pre">
                                      {component.asciiDiagram}
                                    </pre>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Safety Tab */}
            {activeTab === 'safety' && (
              <motion.div
                key="safety"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">High Voltage Safety Guidelines</h2>
                <p className="text-gray-600 mb-8 max-w-3xl">
                  Working with high voltage equipment carries significant risks. These safety guidelines
                  are essential for protecting personnel and ensuring safe operations.
                </p>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-900 mb-2">Critical Warning</h3>
                      <p className="text-red-700">
                        High voltage electricity can cause fatal injuries, severe burns, and arc flash
                        incidents. Only qualified and authorized personnel should work on or near high
                        voltage equipment. Always assume equipment is live until proven dead and properly
                        isolated.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {SAFETY_GUIDELINES.map((guideline, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Shield className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{guideline.title}</h3>
                          <p className="text-sm text-gray-500">{guideline.description}</p>
                        </div>
                      </div>
                      <ol className="space-y-2 ml-12">
                        {guideline.steps.map((step, idx) => (
                          <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                            <span className="font-medium text-yellow-600">{idx + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 bg-gray-900 rounded-xl p-6 text-white">
                  <h3 className="text-xl font-semibold mb-4">Arc Flash Hazard Categories</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-4">Category</th>
                          <th className="text-left py-3 px-4">Cal/cm²</th>
                          <th className="text-left py-3 px-4">PPE Required</th>
                          <th className="text-left py-3 px-4">Typical Applications</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-300">
                        <tr className="border-b border-gray-800">
                          <td className="py-3 px-4 font-medium">Category 1</td>
                          <td className="py-3 px-4">4 cal/cm²</td>
                          <td className="py-3 px-4">Arc-rated shirt, pants, safety glasses</td>
                          <td className="py-3 px-4">415V switchboards, MCCs</td>
                        </tr>
                        <tr className="border-b border-gray-800">
                          <td className="py-3 px-4 font-medium">Category 2</td>
                          <td className="py-3 px-4">8 cal/cm²</td>
                          <td className="py-3 px-4">Arc-rated coverall, face shield, hard hat</td>
                          <td className="py-3 px-4">LV switchgear, transformer LV side</td>
                        </tr>
                        <tr className="border-b border-gray-800">
                          <td className="py-3 px-4 font-medium">Category 3</td>
                          <td className="py-3 px-4">25 cal/cm²</td>
                          <td className="py-3 px-4">Arc flash suit, hood, gloves</td>
                          <td className="py-3 px-4">11kV switchgear, RMUs</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium">Category 4</td>
                          <td className="py-3 px-4">40 cal/cm²</td>
                          <td className="py-3 px-4">Multi-layer arc flash suit, full hood</td>
                          <td className="py-3 px-4">33kV and above switchgear</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Testing Tab */}
            {activeTab === 'testing' && (
              <motion.div
                key="testing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Testing & Commissioning</h2>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {TESTING_PROCEDURES.map((procedure, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Activity className="w-5 h-5 text-yellow-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">{procedure.name}</h3>
                      </div>
                      <ul className="space-y-2">
                        {procedure.tests.map((test, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-gray-600 text-sm">
                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                            {test}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Testing Equipment Available</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Transformer Testing</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Megger 5kV/10kV insulation tester</li>
                        <li>• TTR (Turns ratio tester)</li>
                        <li>• Winding resistance meter</li>
                        <li>• Tan delta test set</li>
                        <li>• DGA oil sampling kit</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Switchgear Testing</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Circuit breaker analyzer</li>
                        <li>• Contact resistance tester</li>
                        <li>• SF6 gas analyzer</li>
                        <li>• Micro-ohmmeter</li>
                        <li>• Primary injection test set</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Cable & Protection</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• VLF test set</li>
                        <li>• TDR cable fault locator</li>
                        <li>• Relay test set (Omicron)</li>
                        <li>• CT/PT analyzer</li>
                        <li>• Earth resistance tester</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Installation Tab */}
            {activeTab === 'installation' && (
              <motion.div
                key="installation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Installation Services</h2>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Transformer Installation</h3>
                    <ol className="space-y-4">
                      {[
                        { step: "Site Preparation", desc: "Foundation, oil containment pit, cable trenches" },
                        { step: "Equipment Delivery", desc: "Heavy haulage, crane lifting, positioning" },
                        { step: "Oil Filling", desc: "Vacuum oil filling, settling period" },
                        { step: "Cable Termination", desc: "HV and LV cable terminations, buswork" },
                        { step: "Protection Setup", desc: "CT/PT connections, relay programming" },
                        { step: "Testing", desc: "Ratio, IR, winding resistance, oil tests" },
                        { step: "Energization", desc: "Pre-energization checks, phased energization" },
                        { step: "Commissioning", desc: "Load tests, protection verification, documentation" }
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center font-semibold text-sm">
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="font-medium text-gray-900">{item.step}</h4>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Switchgear Installation</h3>
                    <ol className="space-y-4">
                      {[
                        { step: "Room Preparation", desc: "Ventilation, lighting, fire suppression" },
                        { step: "Equipment Positioning", desc: "Leveling, alignment, anchor bolts" },
                        { step: "Busbar Assembly", desc: "Bus connections, torque to specification" },
                        { step: "Cable Termination", desc: "HV cable heads, control wiring" },
                        { step: "Earthing", desc: "Earth bar connections, continuity tests" },
                        { step: "Protection Wiring", desc: "CT/PT circuits, relay connections" },
                        { step: "Insulation Tests", desc: "Phase-to-phase, phase-to-ground" },
                        { step: "Functional Tests", desc: "Close/open operations, interlocks" }
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center font-semibold text-sm">
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="font-medium text-gray-900">{item.step}</h4>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-xl p-6 text-white">
                  <h3 className="text-xl font-semibold mb-4">Typical Installation Timeline</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-4">Project Type</th>
                          <th className="text-left py-3 px-4">Civil Works</th>
                          <th className="text-left py-3 px-4">Equipment</th>
                          <th className="text-left py-3 px-4">Testing</th>
                          <th className="text-left py-3 px-4">Total</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-300">
                        <tr className="border-b border-gray-800">
                          <td className="py-3 px-4">100-500kVA Substation</td>
                          <td className="py-3 px-4">2-3 weeks</td>
                          <td className="py-3 px-4">1-2 weeks</td>
                          <td className="py-3 px-4">3-5 days</td>
                          <td className="py-3 px-4 font-medium text-yellow-400">4-6 weeks</td>
                        </tr>
                        <tr className="border-b border-gray-800">
                          <td className="py-3 px-4">1-2MVA Substation</td>
                          <td className="py-3 px-4">4-6 weeks</td>
                          <td className="py-3 px-4">2-3 weeks</td>
                          <td className="py-3 px-4">1 week</td>
                          <td className="py-3 px-4 font-medium text-yellow-400">8-10 weeks</td>
                        </tr>
                        <tr className="border-b border-gray-800">
                          <td className="py-3 px-4">5MVA+ Substation</td>
                          <td className="py-3 px-4">8-12 weeks</td>
                          <td className="py-3 px-4">4-6 weeks</td>
                          <td className="py-3 px-4">2 weeks</td>
                          <td className="py-3 px-4 font-medium text-yellow-400">14-20 weeks</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4">33/11kV Grid Substation</td>
                          <td className="py-3 px-4">12-16 weeks</td>
                          <td className="py-3 px-4">8-12 weeks</td>
                          <td className="py-3 px-4">3-4 weeks</td>
                          <td className="py-3 px-4 font-medium text-yellow-400">24-32 weeks</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Maintenance Tab */}
            {activeTab === 'maintenance' && (
              <motion.div
                key="maintenance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Maintenance Programs</h2>

                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                  {[
                    {
                      title: "Basic Maintenance",
                      frequency: "Annual",
                      price: "From KES 150,000",
                      features: [
                        "Visual inspection",
                        "Insulation resistance tests",
                        "Oil level check",
                        "Thermographic survey",
                        "Connection tightness",
                        "Basic cleaning",
                        "Test report"
                      ]
                    },
                    {
                      title: "Comprehensive Maintenance",
                      frequency: "Annual",
                      price: "From KES 350,000",
                      features: [
                        "All Basic items",
                        "Oil sampling & testing",
                        "Breaker timing tests",
                        "CT/PT ratio verification",
                        "Protection relay tests",
                        "Earth resistance test",
                        "Detailed report & recommendations"
                      ],
                      popular: true
                    },
                    {
                      title: "Premium Maintenance",
                      frequency: "Bi-annual + Emergency",
                      price: "From KES 600,000/year",
                      features: [
                        "All Comprehensive items",
                        "Bi-annual inspections",
                        "Dissolved gas analysis",
                        "Partial discharge testing",
                        "Priority emergency response",
                        "Spare parts inventory",
                        "24/7 hotline access"
                      ]
                    }
                  ].map((plan, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`rounded-xl p-6 ${
                        plan.popular
                          ? 'bg-yellow-500 text-white ring-4 ring-yellow-200'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      {plan.popular && (
                        <span className="inline-block px-3 py-1 bg-white text-yellow-600 text-sm font-medium rounded-full mb-4">
                          Most Popular
                        </span>
                      )}
                      <h3 className={`text-xl font-semibold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                        {plan.title}
                      </h3>
                      <p className={`text-sm ${plan.popular ? 'text-yellow-100' : 'text-gray-500'}`}>
                        {plan.frequency}
                      </p>
                      <p className={`text-2xl font-bold mt-4 ${plan.popular ? 'text-white' : 'text-yellow-600'}`}>
                        {plan.price}
                      </p>
                      <ul className="mt-6 space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className={`w-5 h-5 flex-shrink-0 ${
                              plan.popular ? 'text-yellow-100' : 'text-green-500'
                            }`} />
                            <span className={plan.popular ? 'text-yellow-50' : 'text-gray-600'}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommended Maintenance Schedule</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Equipment</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Daily</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Monthly</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Annually</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">3-5 Years</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600">
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium">Transformer</td>
                          <td className="py-3 px-4">Visual, temp log</td>
                          <td className="py-3 px-4">Oil level, silica gel</td>
                          <td className="py-3 px-4">IR, oil test, thermography</td>
                          <td className="py-3 px-4">DGA, tan delta, SFRA</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium">Circuit Breaker</td>
                          <td className="py-3 px-4">Counter reading</td>
                          <td className="py-3 px-4">SF6 pressure</td>
                          <td className="py-3 px-4">Timing, contact check</td>
                          <td className="py-3 px-4">Major overhaul</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium">RMU</td>
                          <td className="py-3 px-4">-</td>
                          <td className="py-3 px-4">Visual inspection</td>
                          <td className="py-3 px-4">IR, operation test</td>
                          <td className="py-3 px-4">Contact service</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium">Protection Relay</td>
                          <td className="py-3 px-4">LED status</td>
                          <td className="py-3 px-4">Event log check</td>
                          <td className="py-3 px-4">Secondary injection</td>
                          <td className="py-3 px-4">Primary injection</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium">HV Cable</td>
                          <td className="py-3 px-4">-</td>
                          <td className="py-3 px-4">-</td>
                          <td className="py-3 px-4">IR test</td>
                          <td className="py-3 px-4">VLF/tan delta</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Troubleshooting Tab */}
            {activeTab === 'troubleshooting' && (
              <motion.div
                key="troubleshooting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Troubleshooting Guide</h2>

                <div className="space-y-4">
                  {FAULTS.map((fault, index) => (
                    <motion.div
                      key={fault.code}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFault(
                          expandedFault === fault.code ? null : fault.code
                        )}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(fault.severity)}`}>
                            {fault.code}
                          </span>
                          <div className="text-left">
                            <h3 className="font-semibold text-gray-900">{fault.name}</h3>
                            <p className="text-sm text-gray-500 capitalize">Severity: {fault.severity}</p>
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            expandedFault === fault.code ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {expandedFault === fault.code && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                              <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                                    Symptoms
                                  </h4>
                                  <ul className="space-y-1">
                                    {fault.symptoms.map((symptom, idx) => (
                                      <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2" />
                                        {symptom}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-blue-500" />
                                    Causes
                                  </h4>
                                  <ul className="space-y-1">
                                    {fault.causes.map((cause, idx) => (
                                      <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                                        {cause}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Solutions
                                  </h4>
                                  <ul className="space-y-1">
                                    {fault.solutions.map((solution, idx) => (
                                      <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                                        {solution}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <motion.div
                key="pricing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Equipment & Service Pricing</h2>
                <p className="text-gray-600 mb-8">
                  Indicative pricing for high voltage equipment and services. Contact us for detailed quotations.
                </p>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left py-4 px-6 font-semibold text-gray-900">Item</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-900">Specification</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-900">Price Range</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-900">Lead Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {PRICING.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="py-4 px-6 font-medium text-gray-900">{item.item}</td>
                            <td className="py-4 px-6 text-gray-600">{item.specification}</td>
                            <td className="py-4 px-6 text-yellow-600 font-medium">{item.priceRange}</td>
                            <td className="py-4 px-6 text-gray-600">{item.leadTime}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-8 grid md:grid-cols-2 gap-6">
                  <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Notes</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                        Prices are indicative and subject to change
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                        Installation costs are additional (10-15% of equipment)
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                        Lead times are ex-stock or ex-factory
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                        Volume discounts available for multiple units
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                        Payment terms: 50% advance, 50% on delivery
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-900 rounded-xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-4">Get a Custom Quote</h3>
                    <p className="text-gray-300 mb-6">
                      Every project is unique. Contact our team for a detailed quotation
                      tailored to your specific requirements.
                    </p>
                    <div className="space-y-3">
                      <UnifiedCTA
                        action="custom"
                        href="https://wa.me/254722274914?text=High%20Voltage%20Quote%20Request"
                        label="WhatsApp Quote"
                      />
                      <UnifiedCTA
                        action="custom"
                        href="tel:+254722274914"
                        variant="secondary"
                        label="Call for Quote"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Shipping Tab */}
            {activeTab === 'shipping' && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Delivery & Logistics</h2>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Truck className="w-5 h-5 text-yellow-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Delivery Options</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="border-b border-gray-100 pb-4">
                        <h4 className="font-medium text-gray-900">Standard Delivery</h4>
                        <p className="text-gray-600 text-sm">Ex-works collection or delivery within Nairobi</p>
                        <p className="text-yellow-600 font-medium">Included in price</p>
                      </div>
                      <div className="border-b border-gray-100 pb-4">
                        <h4 className="font-medium text-gray-900">Up-country Delivery (Kenya)</h4>
                        <p className="text-gray-600 text-sm">Mombasa, Kisumu, Nakuru, Eldoret, etc.</p>
                        <p className="text-yellow-600 font-medium">KES 15,000 - 50,000</p>
                      </div>
                      <div className="border-b border-gray-100 pb-4">
                        <h4 className="font-medium text-gray-900">Heavy Equipment</h4>
                        <p className="text-gray-600 text-sm">Transformers &gt;1MVA, requires special transport</p>
                        <p className="text-yellow-600 font-medium">Quote on request</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">East Africa Export</h4>
                        <p className="text-gray-600 text-sm">Uganda, Tanzania, Rwanda, Ethiopia</p>
                        <p className="text-yellow-600 font-medium">CIF pricing available</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <MapPin className="w-5 h-5 text-yellow-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Service Coverage</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Kenya (Full Coverage)</h4>
                        <p className="text-gray-600 text-sm">
                          All 47 counties including Nairobi, Mombasa, Kisumu, Nakuru, Eldoret,
                          Thika, Machakos, and remote areas.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">East Africa</h4>
                        <ul className="text-gray-600 text-sm space-y-1">
                          <li>• Uganda - Kampala, Jinja, Entebbe</li>
                          <li>• Tanzania - Dar es Salaam, Arusha, Mwanza</li>
                          <li>• Rwanda - Kigali</li>
                          <li>• Ethiopia - Addis Ababa</li>
                          <li>• South Sudan - Juba</li>
                          <li>• DRC - Goma, Lubumbashi</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Heavy Lift & Special Transport</h3>
                  <p className="text-gray-600 mb-4">
                    Power transformers and large switchgear require specialized transport equipment:
                  </p>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Transport Equipment</h4>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Low-bed trailers</li>
                        <li>• Multi-axle hydraulic trailers</li>
                        <li>• Crane trucks (25-100 ton)</li>
                        <li>• Police escort for abnormal loads</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Route Planning</h4>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Bridge load assessment</li>
                        <li>• Overhead clearance check</li>
                        <li>• Night movement permits</li>
                        <li>• Traffic management</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Site Delivery</h4>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Access road preparation</li>
                        <li>• Crane pad setup</li>
                        <li>• Offloading supervision</li>
                        <li>• Positioning to plinth</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Warranty Tab */}
            {activeTab === 'warranty' && (
              <motion.div
                key="warranty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Warranty & Support</h2>

                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                  {[
                    {
                      title: "Equipment Warranty",
                      duration: "12-24 Months",
                      icon: Award,
                      coverage: [
                        "Manufacturing defects",
                        "Material failure",
                        "Workmanship issues",
                        "Component replacement",
                        "Factory support"
                      ]
                    },
                    {
                      title: "Installation Warranty",
                      duration: "12 Months",
                      icon: Wrench,
                      coverage: [
                        "Installation defects",
                        "Wiring errors",
                        "Termination failures",
                        "Commissioning issues",
                        "Re-work at no cost"
                      ]
                    },
                    {
                      title: "Extended Warranty",
                      duration: "Up to 5 Years",
                      icon: Shield,
                      coverage: [
                        "Extended coverage period",
                        "Priority response",
                        "Annual inspections",
                        "Discounted spare parts",
                        "Remote monitoring"
                      ]
                    }
                  ].map((warranty, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <warranty.icon className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{warranty.title}</h3>
                          <p className="text-yellow-600 font-medium">{warranty.duration}</p>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {warranty.coverage.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-gray-900 rounded-xl p-6 text-white">
                    <h3 className="text-xl font-semibold mb-4">Warranty Exclusions</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        Damage from improper operation or overloading
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        Lightning strikes or power surges
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        Unauthorized modifications or repairs
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        Neglected maintenance requirements
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        Environmental damage (flooding, fire, etc.)
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        Consumables (oil, silica gel, fuses)
                      </li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Support Channels</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-white rounded-lg">
                          <Phone className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">24/7 Emergency Hotline</h4>
                          <a href="tel:+254722274914" className="text-yellow-600 hover:text-yellow-700">
                            +254 722 274 914
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-white rounded-lg">
                          <Clock className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Response Time</h4>
                          <p className="text-gray-600">Critical: 2 hours | Standard: 24 hours</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-white rounded-lg">
                          <Users className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Technical Support Team</h4>
                          <p className="text-gray-600">Qualified HV engineers available nationwide</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Power Your Infrastructure?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            From transformer supply to complete substation construction, we provide end-to-end
            high voltage solutions across East Africa. Contact us for expert consultation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <UnifiedCTA
              action="custom"
              href="https://wa.me/254722274914?text=High%20Voltage%20Project%20Inquiry"
              label="WhatsApp Consultation"
            />
            <UnifiedCTA
              action="custom"
              href="tel:+254722274914"
              variant="secondary"
              label="Call: +254 722 274 914"
            />
          </div>
        </div>
      </section>
    </main>
  )
}

export default HighVoltagePage
