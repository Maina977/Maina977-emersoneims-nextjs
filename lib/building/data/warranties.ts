/**
 * 🛡️ WARRANTY DATABASE
 *
 * Centralized warranty information for all EmersonEIMS products and services
 * Ensures consistent, clear warranty communication across the entire website
 */

export interface Warranty {
  duration: string;
  coverage: string[];
  type: 'product' | 'service' | 'parts';
  highlight?: boolean;
  details?: string;
  claimProcess?: string[];
}

/**
 * GENERATOR WARRANTIES
 */
export const GENERATOR_WARRANTIES: {
  new: Warranty[];
  used: Warranty[];
  rental: Warranty;
} = {
  new: [
    {
      duration: "2 Years",
      coverage: [
        "Cummins engine components and factory defects",
        "Alternator and starter motor coverage",
        "Control panel and electrical wiring",
        "Free maintenance for first 6 months",
        "24/7 emergency breakdown support"
      ],
      type: "product",
      highlight: true,
      details: "Comprehensive 2-year warranty on all new generators with Cummins engines",
      claimProcess: [
        "Call 0768 860 665 or 0782 914 717",
        "Provide serial number and issue description",
        "Technician dispatch within 4 hours (Nairobi) or 24 hours (other counties)",
        "Parts covered under warranty at no cost"
      ]
    },
    {
      duration: "6 Months",
      coverage: [
        "Free preventive maintenance visits",
        "Oil and filter changes included",
        "Performance optimization checks",
        "Load bank testing"
      ],
      type: "service",
      details: "Complimentary maintenance service for the first 6 months"
    }
  ],
  used: [
    {
      duration: "1 Year",
      coverage: [
        "Major engine components (block, head, pistons)",
        "Alternator and control system",
        "Fully load-tested before delivery",
        "3-month free maintenance"
      ],
      type: "product",
      details: "All used generators undergo rigorous testing and come with 1-year warranty"
    }
  ],
  rental: {
    duration: "Rental Period",
    coverage: [
      "All breakdowns covered at no cost",
      "Free replacement if unit fails",
      "24/7 technical support",
      "Preventive maintenance included"
    ],
    type: "service",
    details: "Complete coverage for the entire rental duration"
  }
};

/**
 * SOLAR SYSTEM WARRANTIES
 */
export const SOLAR_WARRANTIES: Warranty[] = [
  {
    duration: "25 Years",
    coverage: [
      "Solar panel performance guarantee",
      "80% efficiency after 25 years",
      "Minimum 90% efficiency after 10 years",
      "Manufacturer defects coverage"
    ],
    type: "product",
    highlight: true,
    details: "Industry-leading 25-year performance warranty on all solar panels"
  },
  {
    duration: "10 Years",
    coverage: [
      "Inverter replacement if defective",
      "System monitoring equipment",
      "MPPT charge controller coverage",
      "Junction boxes and connectors"
    ],
    type: "product",
    details: "Comprehensive coverage for all solar system electronics"
  },
  {
    duration: "5 Years",
    coverage: [
      "Battery capacity guarantee (lithium-ion)",
      "Installation workmanship",
      "Mounting structure integrity",
      "Cable and wiring coverage"
    ],
    type: "service",
    details: "Installation and battery warranty for peace of mind"
  }
];

/**
 * MOTOR REWINDING WARRANTY
 */
export const MOTOR_REWINDING_WARRANTY: Warranty = {
  duration: "12 Months",
  coverage: [
    "Rewinding workmanship guarantee",
    "Insulation breakdown protection",
    "Performance guarantee (efficiency & torque)",
    "Free re-rewinding if defective within warranty period"
  ],
  type: "service",
  details: "Comprehensive warranty on all motor rewinding services"
};

/**
 * SWITCHGEAR & CONTROLS WARRANTY
 */
export const SWITCHGEAR_WARRANTY: Warranty = {
  duration: "2 Years",
  coverage: [
    "Circuit breakers and contactors",
    "Relays and timers",
    "Distribution boards",
    "Installation workmanship"
  ],
  type: "product",
  details: "Full coverage on all switchgear installations"
};

/**
 * UPS SYSTEMS WARRANTY
 */
export const UPS_WARRANTY: Warranty[] = [
  {
    duration: "2 Years",
    coverage: [
      "UPS unit electronics and inverter",
      "Charging system",
      "Transfer switch",
      "Display and monitoring systems"
    ],
    type: "product",
    highlight: true
  },
  {
    duration: "1 Year",
    coverage: [
      "Battery replacement (if defective)",
      "Capacity guarantee",
      "Installation workmanship"
    ],
    type: "parts"
  }
];

/**
 * HVAC SYSTEMS WARRANTY
 */
export const HVAC_WARRANTY: Warranty = {
  duration: "18 Months",
  coverage: [
    "Compressor and refrigerant system",
    "Electrical components",
    "Installation workmanship",
    "First 3 services included"
  ],
  type: "product",
  details: "Comprehensive coverage for all HVAC installations"
};

/**
 * WATER TREATMENT WARRANTY
 */
export const WATER_TREATMENT_WARRANTY: Warranty = {
  duration: "1 Year",
  coverage: [
    "Pump and motor components",
    "Control systems",
    "Filtration equipment",
    "Installation workmanship"
  ],
  type: "product",
  details: "Full warranty on water treatment and borehole systems"
};

/**
 * FABRICATION WARRANTY
 */
export const FABRICATION_WARRANTY: Warranty = {
  duration: "2 Years",
  coverage: [
    "Structural integrity guarantee",
    "Welding workmanship",
    "Material defects",
    "Corrosion protection (for treated steel)"
  ],
  type: "service",
  details: "Quality guarantee on all steel fabrication work"
};

/**
 * SPARE PARTS WARRANTY
 */
export const SPARE_PARTS_WARRANTY: Warranty = {
  duration: "12 Months",
  coverage: [
    "Genuine OEM parts authenticity guarantee",
    "Manufacturing defects",
    "Performance guarantee",
    "Free replacement if defective"
  ],
  type: "parts",
  details: "All genuine spare parts come with manufacturer's warranty"
};

/**
 * HELPER FUNCTIONS
 */

export function getGeneratorWarranty(type: 'new' | 'used' | 'rental'): Warranty | Warranty[] {
  return GENERATOR_WARRANTIES[type];
}

export function getSolarWarranties(): Warranty[] {
  return SOLAR_WARRANTIES;
}

export function getServiceWarranty(service: string): Warranty | null {
  const warranties: Record<string, Warranty> = {
    'motor-rewinding': MOTOR_REWINDING_WARRANTY,
    'switchgear': SWITCHGEAR_WARRANTY,
    'hvac': HVAC_WARRANTY,
    'water-treatment': WATER_TREATMENT_WARRANTY,
    'fabrication': FABRICATION_WARRANTY,
    'spare-parts': SPARE_PARTS_WARRANTY
  };

  return warranties[service] || null;
}

/**
 * WARRANTY TERMS & CONDITIONS (SUMMARY)
 */
export const WARRANTY_TERMS = {
  general: [
    "Warranty valid from date of installation or purchase",
    "Requires proper installation by EmersonEIMS certified technicians",
    "Regular maintenance as per schedule required to maintain warranty",
    "Excludes damage from improper use, accidents, or natural disasters",
    "Parts and labor covered during warranty period"
  ],
  claims: [
    "Contact EmersonEIMS within 48 hours of issue discovery",
    "Provide serial number, purchase/installation date, and issue description",
    "Do not attempt repairs without authorization (voids warranty)",
    "EmersonEIMS reserves right to repair or replace defective items"
  ],
  support: {
    phone1: "0768 860 665",
    phone2: "0782 914 717",
    email: "info@emersoneims.com",
    hours: "24/7 Emergency Support Available"
  }
};
