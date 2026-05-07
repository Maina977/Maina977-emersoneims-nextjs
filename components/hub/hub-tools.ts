/**
 * Hub tool registry — shared between server pages and the client shell.
 * Kept in a non-client module so server components can iterate over it
 * (e.g. `/hub/page.tsx` builds its tool grid at render time).
 */

export interface HubTool {
  href: string;
  label: string;
  short: string;
}

export const HUB_TOOLS: readonly HubTool[] = [
  { href: '/hub',                       label: 'Hub',                    short: 'Overview'   },
  { href: '/hub/verifier',              label: 'Combination Verifier',   short: 'Verifier'   },
  { href: '/hub/simulator',             label: 'Smart Sizing',           short: 'Simulator'  },
  { href: '/hub/ups-lab',               label: 'UPS Live Lab',           short: 'UPS Lab'    },
  { href: '/hub/quote-audit',           label: 'Quotation Audit',        short: 'Audit'      },
  { href: '/hub/product-intelligence',  label: 'Product Intelligence',   short: 'Catalogue'  },
  { href: '/hub/installation',          label: 'Installation Visualizer',short: 'Install'    },
  { href: '/hub/authenticity',          label: 'Authenticity Check',     short: 'Authentic'  },
  { href: '/hub/maintenance',           label: 'Maintenance Planner',    short: 'Maintain'   },
  { href: '/hub/safety',                label: 'Safety & Fire',          short: 'Safety'     },
  { href: '/hub/abuse',                 label: 'Abuse Predictor',        short: 'Abuse'      },
  { href: '/hub/power-quality',         label: 'Power Quality',          short: 'PQ'         },
  { href: '/hub/lifecycle',             label: 'Lifecycle Cost',         short: 'Lifecycle'  },
  { href: '/hub/doc-pack',              label: 'Documentation Pack',     short: 'Docs Pack'  },
  { href: '/hub/learn',                 label: 'Learning Mode',          short: 'Learn'      },
  { href: '/hub/diagnostics',           label: 'Diagnostics',            short: 'Diagnostics'},
  { href: '/hub/solar-ups',             label: 'Solar & UPS',            short: 'Solar/UPS'  },
  { href: '/hub/library',               label: 'Library',                short: 'Library'    },
] as const;
