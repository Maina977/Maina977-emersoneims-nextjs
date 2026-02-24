'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import UnifiedCTA from '@/components/cta/UnifiedCTA'
import {
  Hammer,
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
  Ruler,
  Box,
  Layers,
  Scissors,
  Flame,
  Factory,
  Cog,
  CircleDot,
  SquareStack
} from 'lucide-react'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface FabricationType {
  name: string
  description: string
  applications: string[]
  materials: string[]
  capabilities: Record<string, string>
}

interface Process {
  name: string
  description: string
  steps: string[]
  equipment: string[]
  asciiDiagram?: string
}

interface MaterialSpec {
  name: string
  grades: string[]
  thicknesses: string
  applications: string[]
}

interface QualityStandard {
  name: string
  code: string
  description: string
  requirements: string[]
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

const FABRICATION_TYPES: FabricationType[] = [
  {
    name: "Structural Steel Fabrication",
    description: "Heavy structural steelwork for buildings, bridges, and industrial structures",
    applications: [
      "Industrial buildings",
      "Warehouse structures",
      "Mezzanine floors",
      "Bridge components",
      "Crane gantries"
    ],
    materials: [
      "Hot rolled sections (I-beam, H-beam, channels)",
      "Hollow sections (SHS, RHS, CHS)",
      "Steel plates",
      "Angles and flats"
    ],
    capabilities: {
      "Maximum Length": "12 meters",
      "Maximum Weight": "20 tons single piece",
      "Section Sizes": "Up to 600mm depth",
      "Plate Thickness": "Up to 50mm",
      "Annual Capacity": "3,000 tons",
      "Surface Treatment": "Blast cleaning SA 2.5"
    }
  },
  {
    name: "Pressure Vessels & Tanks",
    description: "ASME and API certified pressure vessels, storage tanks, and process equipment",
    applications: [
      "Oil & gas storage",
      "Chemical processing",
      "Water treatment",
      "Food & beverage",
      "Pharmaceutical"
    ],
    materials: [
      "Carbon steel (A516, A285)",
      "Stainless steel (304, 316, 321)",
      "Duplex stainless steel",
      "Aluminum alloys"
    ],
    capabilities: {
      "Diameter Range": "0.5m - 6m",
      "Length": "Up to 25m",
      "Wall Thickness": "3mm - 60mm",
      "Design Pressure": "Up to 100 bar",
      "Temperature Range": "-40°C to +400°C",
      "Certification": "ASME U-Stamp, API 650"
    }
  },
  {
    name: "Piping & Pipeline Fabrication",
    description: "Process piping systems and pipeline spools for industrial applications",
    applications: [
      "Oil refineries",
      "Power plants",
      "Chemical plants",
      "Water treatment",
      "HVAC systems"
    ],
    materials: [
      "Carbon steel pipes",
      "Stainless steel pipes",
      "Chrome-moly pipes",
      "GRP/GRE pipes"
    ],
    capabilities: {
      "Pipe Sizes": "DN15 - DN1200",
      "Wall Schedule": "SCH 10 - SCH 160",
      "Pressure Classes": "150# - 2500#",
      "Welding": "TIG, MIG, SMAW, SAW",
      "NDE": "RT, UT, MT, PT",
      "Certification": "ASME B31.3"
    }
  },
  {
    name: "Sheet Metal Fabrication",
    description: "Precision sheet metal work for enclosures, panels, and architectural elements",
    applications: [
      "Electrical enclosures",
      "Control panels",
      "HVAC ductwork",
      "Architectural cladding",
      "Machine guards"
    ],
    materials: [
      "Mild steel sheets",
      "Galvanized steel",
      "Stainless steel",
      "Aluminum sheets"
    ],
    capabilities: {
      "Sheet Thickness": "0.5mm - 12mm",
      "Maximum Size": "3000mm x 1500mm",
      "Bending Length": "Up to 4m",
      "Bending Force": "220 tons",
      "Laser Cutting": "20mm mild steel",
      "Accuracy": "±0.1mm"
    }
  },
  {
    name: "Heavy Plate Fabrication",
    description: "Heavy gauge plate work for mining, construction, and industrial equipment",
    applications: [
      "Mining equipment",
      "Earthmoving buckets",
      "Crusher components",
      "Conveyor structures",
      "Hoppers and chutes"
    ],
    materials: [
      "Mild steel plates",
      "High strength steel (Hardox, Domex)",
      "Wear resistant plates",
      "AR400/AR500 steel"
    ],
    capabilities: {
      "Plate Thickness": "10mm - 150mm",
      "Cutting Width": "Up to 4m",
      "Plasma Cutting": "50mm capacity",
      "Oxy-fuel Cutting": "200mm capacity",
      "Rolling": "Up to 3m width",
      "Heat Treatment": "Stress relieving available"
    }
  },
  {
    name: "Aluminum Fabrication",
    description: "Specialized aluminum fabrication for marine, transport, and architectural applications",
    applications: [
      "Marine structures",
      "Transport bodies",
      "Architectural features",
      "Food processing equipment",
      "Heat exchangers"
    ],
    materials: [
      "6061-T6 aluminum",
      "5083-H321 marine grade",
      "6082-T6 structural",
      "3003 sheet aluminum"
    ],
    capabilities: {
      "Plate Thickness": "1mm - 100mm",
      "Welding": "TIG, MIG (certified)",
      "Forming": "Press brake, rolling",
      "Finish": "Anodizing, powder coating",
      "Certification": "AWS D1.2",
      "Testing": "Weld procedure qualified"
    }
  }
]

const PROCESSES: Process[] = [
  {
    name: "CNC Cutting",
    description: "Computer-controlled cutting for precision shapes and profiles",
    steps: [
      "CAD/CAM programming from drawings",
      "Nesting optimization for material efficiency",
      "CNC machine setup and calibration",
      "Cutting operation with quality checks",
      "Deburring and edge finishing"
    ],
    equipment: [
      "CNC plasma cutter (50mm capacity)",
      "CNC oxy-fuel cutter (200mm capacity)",
      "Fiber laser cutter (20mm stainless)",
      "Waterjet cutter (150mm any material)"
    ],
    asciiDiagram: `
    ┌─────────────────────────────────────────────────────────────┐
    │                    CNC PLASMA CUTTING                       │
    │                                                             │
    │   ┌─────────────────────────────────────────────────────┐  │
    │   │              CNC CONTROLLER                          │  │
    │   │    ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐      │  │
    │   │    │PROGRAM│  │  X,Y  │  │HEIGHT │  │PLASMA │      │  │
    │   │    │ INPUT │→ │CONTROL│→ │CONTROL│→ │CONTROL│      │  │
    │   │    └───────┘  └───────┘  └───────┘  └───────┘      │  │
    │   └─────────────────────────────────────────────────────┘  │
    │                          │                                  │
    │                          ▼                                  │
    │   ┌─────────────────────────────────────────────────────┐  │
    │   │                 GANTRY SYSTEM                        │  │
    │   │                                                      │  │
    │   │   ←──────────── X AXIS ──────────────→              │  │
    │   │                                                      │  │
    │   │   ╔═══════════════════════════════════╗  ↑          │  │
    │   │   ║           TORCH CARRIAGE          ║  │          │  │
    │   │   ║  ┌─────┐                          ║  Y          │  │
    │   │   ║  │TORCH│ ↓ PLASMA ARC             ║  │          │  │
    │   │   ║  │ ⚡  │ │                        ║  AXIS       │  │
    │   │   ║  └─────┘ ↓                        ║  │          │  │
    │   │   ╚═══════════════════════════════════╝  ↓          │  │
    │   │                                                      │  │
    │   │   ═══════════════════════════════════════════════   │  │
    │   │   │     │     │     │     │     │     │     │       │  │
    │   │   │STEEL│PLATE│BEING│ CUT │     │     │     │       │  │
    │   │   │     │     │     │     │     │     │     │       │  │
    │   │   ═══════════════════════════════════════════════   │  │
    │   │                 CUTTING TABLE                        │  │
    │   └─────────────────────────────────────────────────────┘  │
    │                                                             │
    │   PARAMETERS: 400A, 30mm/min, 4mm kerf, ±0.5mm accuracy   │
    └─────────────────────────────────────────────────────────────┘
    `
  },
  {
    name: "Welding Processes",
    description: "Multiple welding processes for different materials and applications",
    steps: [
      "Joint preparation and fit-up",
      "Welding procedure specification (WPS)",
      "Preheating if required",
      "Welding with qualified welders",
      "Post-weld heat treatment if needed",
      "Visual and NDE inspection"
    ],
    equipment: [
      "MIG/MAG welding machines (500A)",
      "TIG welding machines (400A)",
      "SMAW machines (various amperage)",
      "SAW machines (for heavy plate)"
    ],
    asciiDiagram: `
    ┌─────────────────────────────────────────────────────────────┐
    │                    WELDING PROCESSES                        │
    │                                                             │
    │   ┌─────────────────┐  ┌─────────────────┐                 │
    │   │   MIG WELDING   │  │   TIG WELDING   │                 │
    │   │                 │  │                 │                 │
    │   │     WIRE        │  │   TUNGSTEN      │                 │
    │   │    FEED ↓       │  │   ELECTRODE     │                 │
    │   │   ┌─────┐       │  │   ┌─────┐       │                 │
    │   │   │NOZZLE       │  │   │ TIG │       │                 │
    │   │   │  │          │  │   │ CUP │       │                 │
    │   │   │  │ GAS      │  │   │  │  │FILLER │                 │
    │   │   │  ▼ SHIELD   │  │   │  ▼  │ ROD   │                 │
    │   │   │ ~~~ ARC     │  │   │ ~~~ │  ╲    │                 │
    │   │   │═════════    │  │   │═════════    │                 │
    │   │   │  WELD       │  │   │  WELD       │                 │
    │   │   └─────────────┘  └─────────────────┘                 │
    │                                                             │
    │   ┌─────────────────┐  ┌─────────────────┐                 │
    │   │  SMAW (STICK)   │  │  SAW (SUBMERGED)│                 │
    │   │                 │  │                 │                 │
    │   │   ELECTRODE     │  │   WIRE + FLUX   │                 │
    │   │   HOLDER        │  │   HOPPER        │                 │
    │   │   ┌─────┐       │  │   ┌─────┐       │                 │
    │   │   │     │       │  │   │FLUX │↓      │                 │
    │   │   │  ╲  │       │  │   │     │       │                 │
    │   │   │   ╲ │ FLUX  │  │   │  ═══│═══    │                 │
    │   │   │    ▼ COATING│  │   │  ARC│BELOW  │                 │
    │   │   │═════════    │  │   │═════│═════  │                 │
    │   │   │  WELD       │  │   │FLUX │LAYER  │                 │
    │   │   └─────────────┘  └─────────────────┘                 │
    │                                                             │
    │   ALL WELDERS: AWS/ASME CERTIFIED | WPS QUALIFIED          │
    └─────────────────────────────────────────────────────────────┘
    `
  },
  {
    name: "Forming & Bending",
    description: "Metal forming operations for shapes, curves, and profiles",
    steps: [
      "Calculate bend allowance and deduction",
      "Select appropriate tooling (dies)",
      "Set up press brake with correct parameters",
      "Trial bend on sample material",
      "Production bending with quality checks",
      "Verify dimensions against drawing"
    ],
    equipment: [
      "CNC press brake (220 tons x 4m)",
      "Plate rolling machine (25mm x 3m)",
      "Section bending machine",
      "Angle rolling machine"
    ],
    asciiDiagram: `
    ┌─────────────────────────────────────────────────────────────┐
    │                     PRESS BRAKE BENDING                     │
    │                                                             │
    │   ┌─────────────────────────────────────────────────────┐  │
    │   │                    CNC CONTROLLER                    │  │
    │   │   ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐   │  │
    │   │   │ ANGLE  │  │ DEPTH  │  │BACKGAUGE│ │PRESSURE│   │  │
    │   │   │ SETUP  │  │CONTROL │  │POSITION │  │CONTROL │   │  │
    │   │   └────────┘  └────────┘  └────────┘  └────────┘   │  │
    │   └─────────────────────────────────────────────────────┘  │
    │                                                             │
    │              ↓ HYDRAULIC FORCE (220 TONS)                  │
    │   ╔═════════════════════════════════════════════════════╗  │
    │   ║                    RAM                               ║  │
    │   ║         ┌──────────────────────┐                    ║  │
    │   ║         │    PUNCH (V-DIE)     │                    ║  │
    │   ║         │       ╲    ╱         │                    ║  │
    │   ║         │        ╲  ╱          │ ← UPPER TOOL       ║  │
    │   ║         │         ╲╱           │                    ║  │
    │   ╚═════════╧══════════════════════╧════════════════════╝  │
    │                                                             │
    │   ═══════════╱══════════════════════╲═══════════════════   │
    │              ╲     SHEET METAL      ╱                       │
    │               ╲═══════════════════╱                         │
    │                ╲                 ╱ ← BENT PROFILE           │
    │                 ╲               ╱                           │
    │   ════════════════╲═══════════╱═════════════════════════   │
    │   │               │    V     │               │              │
    │   │               │   DIE    │               │ ← LOWER TOOL │
    │   │               │   ╱ ╲    │               │              │
    │   ═══════════════════════════════════════════════════════   │
    │                    BED (FIXED)                              │
    │                                                             │
    │   CAPACITY: 4m length | 12mm mild steel | ±0.1° accuracy   │
    └─────────────────────────────────────────────────────────────┘
    `
  },
  {
    name: "Machining",
    description: "Precision machining for fabricated components",
    steps: [
      "Review drawing requirements",
      "Select machining strategy",
      "Set up workpiece on machine",
      "Execute machining operations",
      "In-process inspection",
      "Final dimensional verification"
    ],
    equipment: [
      "CNC boring mill (3m x 2m table)",
      "CNC lathe (800mm swing)",
      "Radial arm drill (75mm capacity)",
      "Milling machine (universal)"
    ],
    asciiDiagram: `
    ┌─────────────────────────────────────────────────────────────┐
    │                    CNC BORING MILL                          │
    │                                                             │
    │   ┌─────────────────────────────────────────────────────┐  │
    │   │              SPINDLE HEAD                            │  │
    │   │         ┌─────────────────┐                          │  │
    │   │         │   ┌───────┐     │                          │  │
    │   │         │   │SPINDLE│     │ ← ROTARY MOTION          │  │
    │   │         │   │  ⟳    │     │                          │  │
    │   │         │   └───┬───┘     │                          │  │
    │   │         │       │         │                          │  │
    │   │         │   ┌───┴───┐     │                          │  │
    │   │         │   │BORING │     │                          │  │
    │   │         │   │ HEAD  │     │ ← TOOL HOLDER            │  │
    │   │         │   └───┬───┘     │                          │  │
    │   │         │       │         │                          │  │
    │   │         │    ───┼───      │ ← CUTTING TOOL           │  │
    │   │         └───────┼─────────┘                          │  │
    │   │                 │                                    │  │
    │   │                 ▼                                    │  │
    │   │   ╔═════════════════════════════════════════════╗   │  │
    │   │   ║                                             ║   │  │
    │   │   ║        WORKPIECE (FABRICATED PART)         ║   │  │
    │   │   ║              ┌─────────┐                   ║   │  │
    │   │   ║              │  HOLE   │ ← BEING BORED     ║   │  │
    │   │   ║              │   ○     │                   ║   │  │
    │   │   ║              └─────────┘                   ║   │  │
    │   │   ║                                             ║   │  │
    │   │   ╚═════════════════════════════════════════════╝   │  │
    │   │               ROTARY TABLE                           │  │
    │   │          (CNC CONTROLLED X, Y, Z, W)                │  │
    │   └─────────────────────────────────────────────────────┘  │
    │                                                             │
    │   CAPACITY: 3m x 2m table | 15 ton load | 0.01mm accuracy  │
    └─────────────────────────────────────────────────────────────┘
    `
  },
  {
    name: "Surface Treatment",
    description: "Surface preparation and protective coatings",
    steps: [
      "Surface preparation (blasting)",
      "Profile measurement",
      "Primer application",
      "Intermediate coat",
      "Topcoat application",
      "DFT measurement and inspection"
    ],
    equipment: [
      "Shot blast chamber (8m x 4m x 4m)",
      "Airless spray equipment",
      "Hot zinc spray (metallizing)",
      "Powder coating booth"
    ],
    asciiDiagram: `
    ┌─────────────────────────────────────────────────────────────┐
    │                   SHOT BLAST CHAMBER                        │
    │                                                             │
    │   ┌─────────────────────────────────────────────────────┐  │
    │   │                 BLAST CHAMBER                        │  │
    │   │   ┌─────────────────────────────────────────────┐   │  │
    │   │   │                                             │   │  │
    │   │   │     BLAST        FABRICATED                 │   │  │
    │   │   │     NOZZLE         STEEL                    │   │  │
    │   │   │       ╲            STRUCTURE                │   │  │
    │   │   │        ╲         ╔═══════════╗              │   │  │
    │   │   │   ●●●●●●╲        ║           ║              │   │  │
    │   │   │   ABRASIVE ────→ ║  BEING    ║              │   │  │
    │   │   │   STREAM         ║  BLASTED  ║              │   │  │
    │   │   │        ╱         ║           ║              │   │  │
    │   │   │       ╱          ╚═══════════╝              │   │  │
    │   │   │     ●●                                      │   │  │
    │   │   │   ●●●●                                      │   │  │
    │   │   │  SPENT ABRASIVE                             │   │  │
    │   │   └─────────────────────────────────────────────┘   │  │
    │   │          │                                │          │  │
    │   │          ▼                                ▼          │  │
    │   │   ┌──────────────┐              ┌──────────────┐    │  │
    │   │   │  SEPARATOR   │              │   DUST       │    │  │
    │   │   │  (RECLAIM)   │              │ COLLECTOR    │    │  │
    │   │   └──────────────┘              └──────────────┘    │  │
    │   └─────────────────────────────────────────────────────┘  │
    │                                                             │
    │   STANDARD: SA 2.5 (Near White) | PROFILE: 50-75 microns   │
    │   COATING: Epoxy/Polyurethane 200-350 DFT                  │
    └─────────────────────────────────────────────────────────────┘
    `
  },
  {
    name: "Assembly & Testing",
    description: "Final assembly, fit-up, and testing of fabricated structures",
    steps: [
      "Trial assembly (dry fit)",
      "Dimensional verification",
      "Match marking for site assembly",
      "Disassembly and dispatch preparation",
      "Load testing if required",
      "Final inspection and documentation"
    ],
    equipment: [
      "Overhead cranes (25 ton capacity)",
      "Assembly floor (50m x 30m)",
      "Coordinate measuring equipment",
      "Load testing frames"
    ],
    asciiDiagram: `
    ┌─────────────────────────────────────────────────────────────┐
    │                   ASSEMBLY BAY                              │
    │                                                             │
    │   ═══════════════════════════════════════════════════════  │
    │   │           OVERHEAD CRANE (25 TON)              │        │
    │   │    ←──────────────────────────────────────────→│        │
    │   ═══════════════════════════════════════════════════════  │
    │               │                                             │
    │               │ CRANE HOOK                                  │
    │               ▼                                             │
    │         ┌─────────┐                                         │
    │         │ LIFTING │                                         │
    │         │  BEAM   │                                         │
    │         └────┬────┘                                         │
    │              │                                              │
    │   ╔══════════╧══════════╗                                  │
    │   ║                     ║                                  │
    │   ║   FABRICATED       ║                                  │
    │   ║   STRUCTURE        ║                                  │
    │   ║   (ASSEMBLY        ║       ┌──────────────┐           │
    │   ║    IN PROGRESS)    ║       │   WELDING    │           │
    │   ║                    ║       │   STATION    │           │
    │   ║   ┌────┐  ┌────┐  ║       └──────────────┘           │
    │   ║   │BEAM│──│BEAM│  ║                                   │
    │   ║   └────┘  └────┘  ║       ┌──────────────┐           │
    │   ║      │      │     ║       │  INSPECTION  │           │
    │   ║   ┌──┴──────┴──┐  ║       │   STATION    │           │
    │   ║   │  COLUMNS   │  ║       └──────────────┘           │
    │   ╚═══╧════════════╧══╝                                   │
    │   ═══════════════════════════════════════════════════════  │
    │                    ASSEMBLY FLOOR                           │
    │                    (50m x 30m)                              │
    └─────────────────────────────────────────────────────────────┘
    `
  }
]

const MATERIALS: MaterialSpec[] = [
  {
    name: "Structural Steel",
    grades: ["S275JR", "S355JR", "S355J2", "S460"],
    thicknesses: "3mm - 100mm",
    applications: ["Buildings", "Bridges", "Industrial structures"]
  },
  {
    name: "Stainless Steel",
    grades: ["304/304L", "316/316L", "321", "Duplex 2205"],
    thicknesses: "1mm - 50mm",
    applications: ["Food processing", "Chemical plants", "Marine"]
  },
  {
    name: "Carbon Steel (Pressure)",
    grades: ["A516 Gr.60/70", "A285 Gr.C", "A106 Gr.B"],
    thicknesses: "6mm - 150mm",
    applications: ["Pressure vessels", "Tanks", "Piping"]
  },
  {
    name: "High Strength Steel",
    grades: ["Hardox 400/450/500", "Domex 700", "AR400/AR500"],
    thicknesses: "6mm - 80mm",
    applications: ["Mining equipment", "Wear components", "Buckets"]
  },
  {
    name: "Aluminum",
    grades: ["6061-T6", "5083-H321", "6082-T6", "5052"],
    thicknesses: "1mm - 100mm",
    applications: ["Marine", "Transport", "Architectural"]
  },
  {
    name: "Chrome-Moly Steel",
    grades: ["A387 Gr.11/22", "P11/P22", "F11/F22"],
    thicknesses: "6mm - 100mm",
    applications: ["High temperature service", "Refinery equipment"]
  }
]

const QUALITY_STANDARDS: QualityStandard[] = [
  {
    name: "Structural Steel",
    code: "AWS D1.1 / EN 1090",
    description: "Structural welding and fabrication",
    requirements: [
      "Qualified welding procedures (WPS/PQR)",
      "Certified welders (6G/EN 287)",
      "Visual inspection per AWS D1.1",
      "NDT as per design requirements",
      "Dimensional tolerance per EN 1090-2"
    ]
  },
  {
    name: "Pressure Vessels",
    code: "ASME Section VIII",
    description: "Unfired pressure vessel fabrication",
    requirements: [
      "ASME U-Stamp authorization",
      "Material certification (MTR)",
      "Full radiography (RT) for welds",
      "Hydrostatic test to 1.5x design pressure",
      "ASME Data Report (U-1)"
    ]
  },
  {
    name: "Process Piping",
    code: "ASME B31.3",
    description: "Process piping systems",
    requirements: [
      "Qualified procedures per ASME IX",
      "Welder qualification (6G position)",
      "RT/UT of welds per P&ID requirements",
      "Pneumatic/hydrostatic test",
      "Isometric verification"
    ]
  },
  {
    name: "Storage Tanks",
    code: "API 650 / API 620",
    description: "Welded storage tanks",
    requirements: [
      "API certified procedures",
      "Shell plate inspection",
      "Floor and roof weld examination",
      "Vacuum box test for floor",
      "Settlement monitoring"
    ]
  },
  {
    name: "Stainless Steel",
    code: "AWS D1.6",
    description: "Stainless steel fabrication",
    requirements: [
      "Contamination prevention",
      "Proper filler material selection",
      "Ferrite content control",
      "Passivation treatment",
      "Chloride-free cleaning"
    ]
  },
  {
    name: "Aluminum",
    code: "AWS D1.2",
    description: "Aluminum structural welding",
    requirements: [
      "Qualified aluminum welders",
      "Proper gas shielding (Argon)",
      "Cleanliness requirements",
      "Heat input control",
      "Post-weld aging if required"
    ]
  }
]

const PRICING: PricingItem[] = [
  {
    item: "Structural Steel Fabrication",
    specification: "Standard complexity, painted",
    priceRange: "KES 250 - 350 per kg",
    leadTime: "2-4 weeks"
  },
  {
    item: "Structural Steel Fabrication",
    specification: "Complex, hot-dip galvanized",
    priceRange: "KES 400 - 550 per kg",
    leadTime: "3-5 weeks"
  },
  {
    item: "Pressure Vessel (Carbon Steel)",
    specification: "ASME U-Stamp, up to 10 bar",
    priceRange: "KES 450 - 600 per kg",
    leadTime: "4-8 weeks"
  },
  {
    item: "Pressure Vessel (Stainless)",
    specification: "304/316SS, polished finish",
    priceRange: "KES 1,200 - 1,800 per kg",
    leadTime: "6-10 weeks"
  },
  {
    item: "Storage Tank (Mild Steel)",
    specification: "API 650, up to 500m³",
    priceRange: "KES 200 - 300 per kg",
    leadTime: "4-8 weeks"
  },
  {
    item: "Storage Tank (Stainless)",
    specification: "304SS, food grade finish",
    priceRange: "KES 900 - 1,400 per kg",
    leadTime: "6-10 weeks"
  },
  {
    item: "Pipe Spool Fabrication",
    specification: "Carbon steel, painted",
    priceRange: "KES 300 - 450 per kg",
    leadTime: "2-4 weeks"
  },
  {
    item: "Pipe Spool Fabrication",
    specification: "Stainless steel, pickled",
    priceRange: "KES 900 - 1,300 per kg",
    leadTime: "3-5 weeks"
  },
  {
    item: "Sheet Metal Enclosure",
    specification: "Mild steel, powder coated",
    priceRange: "KES 400 - 600 per kg",
    leadTime: "1-2 weeks"
  },
  {
    item: "Sheet Metal Enclosure",
    specification: "Stainless steel 304, #4 finish",
    priceRange: "KES 1,100 - 1,600 per kg",
    leadTime: "2-3 weeks"
  },
  {
    item: "Heavy Plate Work",
    specification: "Mining/earthmoving components",
    priceRange: "KES 280 - 400 per kg",
    leadTime: "2-4 weeks"
  },
  {
    item: "Aluminum Fabrication",
    specification: "Marine grade, anodized",
    priceRange: "KES 1,500 - 2,200 per kg",
    leadTime: "3-5 weeks"
  },
  {
    item: "CNC Plasma Cutting",
    specification: "Up to 25mm mild steel",
    priceRange: "KES 150 - 250 per meter",
    leadTime: "1-3 days"
  },
  {
    item: "CNC Laser Cutting",
    specification: "Up to 12mm mild steel",
    priceRange: "KES 200 - 350 per meter",
    leadTime: "1-3 days"
  },
  {
    item: "Shot Blasting",
    specification: "SA 2.5 finish",
    priceRange: "KES 80 - 150 per m²",
    leadTime: "1-2 days"
  },
  {
    item: "Painting (Industrial)",
    specification: "200-250 microns DFT",
    priceRange: "KES 150 - 300 per m²",
    leadTime: "2-4 days"
  },
  {
    item: "Hot Dip Galvanizing",
    specification: "ISO 1461 standard",
    priceRange: "KES 180 - 280 per kg",
    leadTime: "3-5 days"
  },
  {
    item: "Engineering/Drawings",
    specification: "Shop drawings, per sheet",
    priceRange: "KES 15,000 - 35,000",
    leadTime: "3-7 days"
  },
  {
    item: "Site Installation",
    specification: "Structural steel erection",
    priceRange: "KES 80 - 150 per kg",
    leadTime: "As per schedule"
  },
  {
    item: "Transport (Nairobi)",
    specification: "Per trip, standard truck",
    priceRange: "KES 25,000 - 45,000",
    leadTime: "1-2 days"
  }
]

const CERTIFICATIONS = [
  {
    name: "ISO 9001:2015",
    description: "Quality Management System",
    scope: "Design, fabrication, and installation of steel structures"
  },
  {
    name: "ISO 3834-2",
    description: "Welding Quality Requirements",
    scope: "Comprehensive quality requirements for fusion welding"
  },
  {
    name: "ASME U-Stamp",
    description: "Pressure Vessel Authorization",
    scope: "Fabrication of unfired pressure vessels per ASME VIII"
  },
  {
    name: "API 650/620",
    description: "Storage Tank Certification",
    scope: "Welded tanks for oil storage"
  },
  {
    name: "EN 1090-2 EXC3",
    description: "Execution Class 3",
    scope: "Structural steel and aluminum structures"
  },
  {
    name: "AWS D1.1 Certified",
    description: "Structural Welding",
    scope: "Welding procedure and personnel certification"
  }
]

// ============================================================================
// COMPONENT
// ============================================================================

const FabricationPage = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedProcess, setExpandedProcess] = useState<string | null>(null)
  const [expandedStandard, setExpandedStandard] = useState<string | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'services', label: 'Services', icon: Factory },
    { id: 'processes', label: 'Processes', icon: Cog },
    { id: 'materials', label: 'Materials', icon: Layers },
    { id: 'quality', label: 'Quality', icon: Award },
    { id: 'equipment', label: 'Equipment', icon: Settings },
    { id: 'projects', label: 'Projects', icon: Building },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'shipping', label: 'Delivery', icon: Truck },
    { id: 'warranty', label: 'Warranty', icon: Shield }
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[70vh] min-h-[600px] overflow-hidden">
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0"
        >
          <Image
            src="/images/fabrication-hero.jpg"
            alt="Metal Fabrication Workshop"
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
                <div className="p-3 bg-orange-500/20 rounded-xl backdrop-blur-sm">
                  <Hammer className="w-8 h-8 text-orange-400" />
                </div>
                <span className="text-orange-400 font-semibold tracking-wider uppercase">
                  Industrial Fabrication
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Metal Fabrication
                <span className="block text-orange-400">& Steel Works</span>
              </h1>

              <p className="text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
                Complete metal fabrication solutions from structural steel to pressure vessels.
                ASME certified, ISO quality systems, and over 30 years of experience serving
                East Africa's industrial sector.
              </p>

              <div className="flex flex-wrap gap-4">
                <UnifiedCTA
                  action="custom"
                  href="https://wa.me/254722274914?text=Fabrication%20Project%20Inquiry"
                  label="WhatsApp Quote"
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
                { value: "3,000", label: "Tons Annual Capacity" },
                { value: "50+", label: "Certified Welders" },
                { value: "ASME", label: "U-Stamp Certified" },
                { value: "30+", label: "Years Experience" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold text-orange-400">{stat.value}</div>
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
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-600 hover:text-orange-600'
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
                      Industrial Metal Fabrication Excellence
                    </h2>

                    <div className="prose prose-lg max-w-none text-gray-600">
                      <p>
                        Metal fabrication is the cornerstone of industrial infrastructure, transforming
                        raw steel and other metals into the structures, vessels, and equipment that
                        power modern industry. Our comprehensive fabrication facility combines
                        traditional craftsmanship with cutting-edge CNC technology.
                      </p>

                      <p>
                        With over 30 years of experience serving East Africa's industrial sector, we
                        have built a reputation for quality, reliability, and on-time delivery. Our
                        ISO 9001:2015 certified quality management system ensures consistent standards
                        across all projects.
                      </p>

                      <p>
                        Structural steel fabrication forms the foundation of our capabilities. From
                        industrial buildings and warehouses to complex structures like bridges and
                        crane gantries, our team handles projects of all scales. We work with standard
                        and high-strength steels, delivering painted or galvanized finishes.
                      </p>

                      <p>
                        Our ASME U-Stamp certification demonstrates our capability to fabricate
                        pressure vessels meeting the most stringent international standards. Whether
                        it's process vessels, heat exchangers, or storage tanks, we deliver equipment
                        that meets design specifications and safety requirements.
                      </p>

                      <p>
                        Process piping fabrication requires precision and expertise. Our qualified
                        welders and rigorous quality control ensure that every spool, from carbon
                        steel to exotic alloys, meets the demanding requirements of refineries,
                        chemical plants, and power stations.
                      </p>

                      <p>
                        Sheet metal work encompasses everything from simple enclosures to complex
                        architectural features. Our CNC laser cutters and press brakes enable
                        precision fabrication of panels, housings, and ductwork in various materials
                        and finishes.
                      </p>

                      <p>
                        Heavy plate fabrication serves the mining and construction industries with
                        wear-resistant components, buckets, hoppers, and structural elements. We
                        work with Hardox, AR400, and other specialized steels to deliver components
                        that withstand the harshest operating conditions.
                      </p>

                      <p>
                        Surface treatment is critical to the longevity of fabricated structures. Our
                        blast chamber and paint facilities deliver finishes meeting international
                        specifications, while hot-dip galvanizing provides superior corrosion
                        protection for outdoor structures.
                      </p>

                      <p>
                        Beyond fabrication, we offer complete solutions including engineering design,
                        shop drawings, site installation, and after-sales support. Our project
                        management team ensures seamless coordination from concept to commissioning.
                      </p>

                      <p>
                        Quality is embedded in every process. From material certification to final
                        inspection, each stage is documented and verified. Our welders are certified
                        to AWS and ASME standards, and our QC inspectors are NDT qualified level II.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Capabilities</h3>
                      <ul className="space-y-3">
                        {[
                          "Structural steel fabrication",
                          "Pressure vessels (ASME)",
                          "Storage tanks (API 650)",
                          "Process piping systems",
                          "Sheet metal work",
                          "Heavy plate fabrication",
                          "Aluminum fabrication",
                          "CNC cutting & machining"
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gray-900 rounded-xl p-6 text-white">
                      <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                      <ul className="space-y-2 text-gray-300">
                        {CERTIFICATIONS.map((cert, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Award className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium text-white">{cert.name}</span>
                              <p className="text-sm text-gray-400">{cert.description}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Contact</h3>
                      <div className="space-y-3">
                        <a href="tel:+254722274914" className="flex items-center gap-2 text-gray-700 hover:text-orange-600">
                          <Phone className="w-5 h-5" />
                          <span>+254 722 274 914</span>
                        </a>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-5 h-5" />
                          <span>Mon-Sat: 7:00 AM - 6:00 PM</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-5 h-5" />
                          <span>Industrial Area, Nairobi</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <motion.div
                key="services"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Fabrication Services</h2>

                <div className="grid gap-8">
                  {FABRICATION_TYPES.map((service, index) => (
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
                            <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                            <p className="text-gray-600">{service.description}</p>
                          </div>
                          <div className="p-3 bg-orange-100 rounded-lg">
                            <Factory className="w-6 h-6 text-orange-600" />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Applications</h4>
                            <ul className="space-y-1">
                              {service.applications.map((app, idx) => (
                                <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                                  <ChevronRight className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                  {app}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Materials</h4>
                            <ul className="space-y-1">
                              {service.materials.map((material, idx) => (
                                <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                                  <Layers className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                  {material}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Capabilities</h4>
                            <div className="space-y-1">
                              {Object.entries(service.capabilities).map(([key, value], idx) => (
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

            {/* Processes Tab */}
            {activeTab === 'processes' && (
              <motion.div
                key="processes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Fabrication Processes</h2>

                <div className="space-y-4">
                  {PROCESSES.map((process, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedProcess(
                          expandedProcess === process.name ? null : process.name
                        )}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Cog className="w-5 h-5 text-orange-600" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-gray-900">{process.name}</h3>
                            <p className="text-sm text-gray-500">{process.description}</p>
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            expandedProcess === process.name ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {expandedProcess === process.name && (
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
                                  <h4 className="font-medium text-gray-900 mb-3">Process Steps</h4>
                                  <ol className="space-y-2">
                                    {process.steps.map((step, idx) => (
                                      <li key={idx} className="flex items-start gap-3 text-gray-600">
                                        <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                                          {idx + 1}
                                        </span>
                                        {step}
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-3">Equipment</h4>
                                  <ul className="space-y-2">
                                    {process.equipment.map((item, idx) => (
                                      <li key={idx} className="flex items-center gap-2 text-gray-600">
                                        <Settings className="w-4 h-4 text-orange-500" />
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              {process.asciiDiagram && (
                                <div className="mt-6">
                                  <h4 className="font-medium text-gray-900 mb-3">Process Diagram</h4>
                                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                    <pre className="text-green-400 text-xs md:text-sm font-mono whitespace-pre">
                                      {process.asciiDiagram}
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

            {/* Materials Tab */}
            {activeTab === 'materials' && (
              <motion.div
                key="materials"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Materials & Grades</h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {MATERIALS.map((material, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Layers className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">{material.name}</h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Grades</h4>
                          <div className="flex flex-wrap gap-1">
                            {material.grades.map((grade, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {grade}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Thicknesses</h4>
                          <p className="text-gray-900">{material.thicknesses}</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Applications</h4>
                          <ul className="space-y-1">
                            {material.applications.map((app, idx) => (
                              <li key={idx} className="text-gray-600 text-sm flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                {app}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 bg-orange-50 rounded-xl p-6 border border-orange-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Material Sourcing</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Local Stock</h4>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Mild steel plates & sections</li>
                        <li>• Galvanized steel</li>
                        <li>• Standard stainless grades</li>
                        <li>• Common pipe sizes</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Import (2-4 weeks)</h4>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Specialty steel grades</li>
                        <li>• Exotic alloys</li>
                        <li>• Large diameter pipes</li>
                        <li>• Heavy plates</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Certification</h4>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Mill test certificates (MTR)</li>
                        <li>• EN 10204 3.1 certificates</li>
                        <li>• Material traceability</li>
                        <li>• PMI verification available</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quality Tab */}
            {activeTab === 'quality' && (
              <motion.div
                key="quality"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Quality Standards</h2>

                <div className="space-y-4 mb-8">
                  {QUALITY_STANDARDS.map((standard, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedStandard(
                          expandedStandard === standard.code ? null : standard.code
                        )}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Award className="w-5 h-5 text-orange-600" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-gray-900">{standard.name}</h3>
                            <p className="text-sm text-orange-600 font-medium">{standard.code}</p>
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            expandedStandard === standard.code ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {expandedStandard === standard.code && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                              <p className="text-gray-600 mb-4">{standard.description}</p>
                              <h4 className="font-medium text-gray-900 mb-2">Key Requirements</h4>
                              <ul className="space-y-2">
                                {standard.requirements.map((req, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-gray-600">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    {req}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-900 rounded-xl p-6 text-white">
                    <h3 className="text-xl font-semibold mb-4">NDT Capabilities</h3>
                    <ul className="space-y-3">
                      {[
                        { method: "Radiographic Testing (RT)", scope: "Film & digital radiography" },
                        { method: "Ultrasonic Testing (UT)", scope: "Thickness & flaw detection" },
                        { method: "Magnetic Particle (MT)", scope: "Surface crack detection" },
                        { method: "Dye Penetrant (PT)", scope: "Surface defect inspection" },
                        { method: "Visual Inspection (VT)", scope: "AWS/ASME certified inspectors" },
                        { method: "PMI Testing", scope: "Positive material identification" }
                      ].map((ndt, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span className="text-orange-400">{ndt.method}</span>
                          <span className="text-gray-400">{ndt.scope}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality Documentation</h3>
                    <ul className="space-y-3">
                      {[
                        "Material test reports (MTR)",
                        "Welding procedure specifications (WPS)",
                        "Procedure qualification records (PQR)",
                        "Welder qualification records (WQR)",
                        "NDT reports and film",
                        "Dimensional inspection reports",
                        "Hydro/pneumatic test certificates",
                        "Final inspection and release documentation"
                      ].map((doc, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-700">
                          <FileText className="w-5 h-5 text-orange-500" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Equipment Tab */}
            {activeTab === 'equipment' && (
              <motion.div
                key="equipment"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Workshop Equipment</h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      category: "Cutting",
                      items: [
                        "CNC Plasma Cutter - 50mm capacity, 6m x 2.5m table",
                        "CNC Oxy-fuel - 200mm capacity",
                        "Fiber Laser Cutter - 20mm SS/MS",
                        "Band Saws - up to 500mm diameter",
                        "Shearing Machine - 6mm x 3m"
                      ]
                    },
                    {
                      category: "Forming",
                      items: [
                        "CNC Press Brake - 220T x 4m",
                        "Plate Rolling - 25mm x 3m",
                        "Section Bending Machine",
                        "Hydraulic Press - 150T",
                        "Flanging Machine"
                      ]
                    },
                    {
                      category: "Welding",
                      items: [
                        "MIG/MAG Machines - 500A (20 units)",
                        "TIG Welding - 400A (15 units)",
                        "SAW Machine - longitudinal & circumferential",
                        "Spot Welding Machine",
                        "Stud Welding Equipment"
                      ]
                    },
                    {
                      category: "Machining",
                      items: [
                        "CNC Boring Mill - 3m x 2m table",
                        "CNC Lathe - 800mm swing",
                        "Radial Arm Drill - 75mm",
                        "Universal Milling Machine",
                        "Surface Grinding Machine"
                      ]
                    },
                    {
                      category: "Material Handling",
                      items: [
                        "Overhead Cranes - 25T, 10T, 5T",
                        "Gantry Crane - 15T",
                        "Forklift - 5T, 3T",
                        "Welding Manipulators",
                        "Rotary Positioners - up to 20T"
                      ]
                    },
                    {
                      category: "Surface Treatment",
                      items: [
                        "Shot Blast Chamber - 8m x 4m x 4m",
                        "Abrasive Blast Pot - portable",
                        "Airless Spray Equipment",
                        "Paint Mixing Room",
                        "Drying Oven - for small parts"
                      ]
                    }
                  ].map((category, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Settings className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">{category.category}</h3>
                      </div>
                      <ul className="space-y-2">
                        {category.items.map((item, idx) => (
                          <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 bg-gray-900 rounded-xl p-6 text-white">
                  <h3 className="text-xl font-semibold mb-4">Facility Overview</h3>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-400">10,000</div>
                      <div className="text-gray-400">m² Covered Workshop</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-400">5,000</div>
                      <div className="text-gray-400">m² Open Yard</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-400">200+</div>
                      <div className="text-gray-400">Skilled Workers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-400">24/7</div>
                      <div className="text-gray-400">Production Capability</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Project Portfolio</h2>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {[
                    {
                      title: "Cement Factory Expansion",
                      client: "Major Cement Manufacturer",
                      scope: "500 tons structural steel, conveyors, hoppers",
                      duration: "8 months",
                      value: "KES 180M"
                    },
                    {
                      title: "Oil Terminal Storage Tanks",
                      client: "Oil Marketing Company",
                      scope: "4 x 5000m³ API 650 storage tanks",
                      duration: "12 months",
                      value: "KES 320M"
                    },
                    {
                      title: "Geothermal Power Plant",
                      client: "Power Generation Company",
                      scope: "Pipe spools, pressure vessels, structural steel",
                      duration: "18 months",
                      value: "KES 450M"
                    },
                    {
                      title: "Beverage Processing Plant",
                      client: "International Beverage Company",
                      scope: "Stainless steel tanks, piping, platforms",
                      duration: "10 months",
                      value: "KES 220M"
                    },
                    {
                      title: "Mining Crushing Plant",
                      client: "Mining Company",
                      scope: "Structural steel, hoppers, chutes, wear plates",
                      duration: "6 months",
                      value: "KES 95M"
                    },
                    {
                      title: "Airport Terminal Expansion",
                      client: "Airport Authority",
                      scope: "Architectural steelwork, canopies, facades",
                      duration: "14 months",
                      value: "KES 280M"
                    }
                  ].map((project, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                      <p className="text-orange-600 font-medium mb-4">{project.client}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Scope:</span>
                          <span className="text-gray-900 text-right max-w-[60%]">{project.scope}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Duration:</span>
                          <span className="text-gray-900">{project.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Value:</span>
                          <span className="text-orange-600 font-medium">{project.value}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Industries Served</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      "Oil & Gas",
                      "Power Generation",
                      "Mining & Quarrying",
                      "Cement & Building Materials",
                      "Food & Beverage",
                      "Pharmaceutical",
                      "Water & Wastewater",
                      "Pulp & Paper",
                      "Steel & Metals",
                      "Transport Infrastructure",
                      "Commercial Buildings",
                      "Telecommunications"
                    ].map((industry, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-700">
                        <Building className="w-4 h-4 text-orange-500" />
                        {industry}
                      </div>
                    ))}
                  </div>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Fabrication Pricing</h2>
                <p className="text-gray-600 mb-8">
                  Indicative pricing for fabrication services. Final quotations depend on specific requirements.
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
                            <td className="py-4 px-6 text-orange-600 font-medium">{item.priceRange}</td>
                            <td className="py-4 px-6 text-gray-600">{item.leadTime}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-8 grid md:grid-cols-2 gap-6">
                  <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Factors</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-5 h-5 text-orange-500 flex-shrink-0" />
                        Material grade and thickness
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-5 h-5 text-orange-500 flex-shrink-0" />
                        Complexity of design and welding
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-5 h-5 text-orange-500 flex-shrink-0" />
                        Quantity and repetitive work
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-5 h-5 text-orange-500 flex-shrink-0" />
                        NDT and testing requirements
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-5 h-5 text-orange-500 flex-shrink-0" />
                        Surface treatment specification
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-5 h-5 text-orange-500 flex-shrink-0" />
                        Delivery timeline requirements
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-900 rounded-xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-4">Request a Quote</h3>
                    <p className="text-gray-300 mb-6">
                      Send us your drawings or specifications for a detailed quotation.
                      We respond within 24-48 hours.
                    </p>
                    <div className="space-y-3">
                      <UnifiedCTA
                        action="custom"
                        href="https://wa.me/254722274914?text=Fabrication%20Quote%20Request"
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

            {/* Shipping/Delivery Tab */}
            {activeTab === 'shipping' && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Delivery & Installation</h2>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Truck className="w-5 h-5 text-orange-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Transport Options</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="border-b border-gray-100 pb-4">
                        <h4 className="font-medium text-gray-900">Standard Truck</h4>
                        <p className="text-gray-600 text-sm">Up to 25 tons, 12m length</p>
                        <p className="text-orange-600 font-medium">KES 25,000 - 45,000 (Nairobi)</p>
                      </div>
                      <div className="border-b border-gray-100 pb-4">
                        <h4 className="font-medium text-gray-900">Low-bed Trailer</h4>
                        <p className="text-gray-600 text-sm">Up to 50 tons, oversized loads</p>
                        <p className="text-orange-600 font-medium">KES 80,000 - 150,000</p>
                      </div>
                      <div className="border-b border-gray-100 pb-4">
                        <h4 className="font-medium text-gray-900">Abnormal Load</h4>
                        <p className="text-gray-600 text-sm">Over-width/height, police escort</p>
                        <p className="text-orange-600 font-medium">Quote on request</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Container Export</h4>
                        <p className="text-gray-600 text-sm">20ft/40ft container, CIF available</p>
                        <p className="text-orange-600 font-medium">Quote on request</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Wrench className="w-5 h-5 text-orange-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Site Installation</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Installation Services</h4>
                        <ul className="text-gray-600 text-sm space-y-1">
                          <li>• Steel structure erection</li>
                          <li>• Tank erection (field welded)</li>
                          <li>• Pipe spool installation</li>
                          <li>• Equipment setting</li>
                          <li>• Touch-up painting</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Site Requirements</h4>
                        <ul className="text-gray-600 text-sm space-y-1">
                          <li>• Crane access and pad area</li>
                          <li>• Foundation readiness</li>
                          <li>• Power and water connection</li>
                          <li>• Storage area for materials</li>
                          <li>• Safety induction arrangements</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Coverage</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Kenya</h4>
                      <p className="text-gray-600 text-sm mb-2">
                        All 47 counties with our own fleet and partner transporters.
                      </p>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Nairobi - Same day/next day</li>
                        <li>• Mombasa - 2-3 days</li>
                        <li>• Western Kenya - 2-3 days</li>
                        <li>• Northern Kenya - 3-5 days</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">East Africa</h4>
                      <p className="text-gray-600 text-sm mb-2">
                        Export to all neighboring countries.
                      </p>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Uganda - 3-5 days</li>
                        <li>• Tanzania - 4-6 days</li>
                        <li>• Rwanda - 5-7 days</li>
                        <li>• Ethiopia - 7-10 days</li>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Warranty & Guarantees</h2>

                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                  {[
                    {
                      title: "Workmanship Warranty",
                      duration: "12 Months",
                      icon: Wrench,
                      coverage: [
                        "Welding defects",
                        "Fabrication errors",
                        "Dimensional accuracy",
                        "Assembly issues",
                        "Re-work at no cost"
                      ]
                    },
                    {
                      title: "Material Guarantee",
                      duration: "Per MTR",
                      icon: Layers,
                      coverage: [
                        "Mill test certification",
                        "Chemical composition",
                        "Mechanical properties",
                        "Traceability",
                        "Replacement if defective"
                      ]
                    },
                    {
                      title: "Coating Warranty",
                      duration: "2-5 Years",
                      icon: Shield,
                      coverage: [
                        "Surface preparation",
                        "DFT compliance",
                        "Adhesion guarantee",
                        "No peeling/flaking",
                        "Touch-up service"
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
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <warranty.icon className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{warranty.title}</h3>
                          <p className="text-orange-600 font-medium">{warranty.duration}</p>
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
                        <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                        Damage from misuse or overloading
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                        Unauthorized modifications
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                        Normal wear and corrosion
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                        Improper installation (by others)
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                        Acts of God (earthquake, flood)
                      </li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">After-Sales Support</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-white rounded-lg">
                          <Phone className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Technical Hotline</h4>
                          <a href="tel:+254722274914" className="text-orange-600 hover:text-orange-700">
                            +254 722 274 914
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-white rounded-lg">
                          <Wrench className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Repair Services</h4>
                          <p className="text-gray-600">On-site repair and modification services</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-white rounded-lg">
                          <FileText className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Documentation</h4>
                          <p className="text-gray-600">Replacement documentation and drawings</p>
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
            Ready to Start Your Fabrication Project?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            From concept to installation, we deliver quality fabrication solutions.
            Send us your drawings for a competitive quotation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <UnifiedCTA
              action="custom"
              href="https://wa.me/254722274914?text=Fabrication%20Project%20Inquiry"
              label="WhatsApp Quote Request"
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

export default FabricationPage
