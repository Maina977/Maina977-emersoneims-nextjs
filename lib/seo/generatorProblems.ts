/**
 * SEO copy for the five problems that /generator-problems/[problem] renders.
 *
 * This lives outside both files because the page needs the symptom names and
 * the layout needs the metadata, and they must not drift apart.
 *
 * TWO DEFECTS THIS FIXES, found live as Googlebot on 2026-09-02:
 *
 * 1. The layout's generateMetadata read `params.problem` synchronously. In this
 *    Next version `params` is a Promise, so the lookup was always undefined and
 *    every one of the five pages fell through to the "Generator Problem"
 *    fallback title. All five shipped ONE title. The descriptions and keywords
 *    below were written but never reached a crawler; they are preserved here
 *    word for word.
 * 2. There was no canonical, so the pages inherited the one hard-coded in
 *    app/generator-problems/layout.tsx and each asked Google to credit the
 *    index page instead of itself.
 *
 * TITLE BUDGET: the section layout appends " | Generator Troubleshooting -
 * EmersonEIMS" — 42 characters. Keep `title` at roughly 23 characters or the
 * rendered title passes the ~65 Google truncates at. The old titles ran to 58
 * ("Generator Voltage & Frequency Problems - Causes & Solutions"), which would
 * have rendered at 100 had they ever rendered at all. The symptom name alone
 * reads correctly against that template: "Low Oil Pressure | Generator
 * Troubleshooting - EmersonEIMS".
 */
export type ProblemSeo = {
  /** Short title. The section template supplies the category and the brand. */
  title: string;
  description: string;
  keywords: string;
};

export const PROBLEM_SEO = {
  'wont-start': {
    title: "Generator Won't Start",
    description:
      "Diagnose why your generator won't start. Common causes include flat battery, air in fuel system, starter motor failure, and control panel faults. Step-by-step troubleshooting guide.",
    keywords:
      "generator won't start, generator not starting, generator cranks but won't start, generator starting problems Kenya",
  },
  overheating: {
    title: 'Generator Overheating',
    description:
      'Fix generator overheating problems. Learn about low coolant, blocked radiator, thermostat failure, water pump issues, and overloading. Expert troubleshooting guide.',
    keywords:
      'generator overheating, generator high temperature, generator cooling problems, generator thermal shutdown Kenya',
  },
  'low-oil-pressure': {
    title: 'Low Oil Pressure',
    description:
      'Troubleshoot low oil pressure warnings on your generator. Causes include low oil level, faulty sensors, worn oil pump, and wrong oil viscosity. Critical diagnostic guide.',
    keywords:
      'generator low oil pressure, oil pressure warning, generator lubrication problems Kenya',
  },
  'voltage-frequency-unstable': {
    title: 'Voltage & Frequency',
    description:
      'Fix unstable voltage and frequency on your generator. Learn about AVR faults, governor issues, load imbalance, and fuel supply problems. Expert power quality guide.',
    keywords:
      'generator voltage fluctuation, generator frequency unstable, generator AVR problems, generator governor Kenya',
  },
  'exhaust-smoke': {
    title: 'Exhaust Smoke',
    description:
      'Diagnose generator exhaust smoke by color. Black smoke indicates fuel issues, white smoke means coolant problems, blue smoke indicates oil burning. Complete diagnosis guide.',
    keywords:
      'generator black smoke, generator white smoke, generator blue smoke, generator exhaust problems Kenya',
  },
} satisfies Record<string, ProblemSeo>;

/** The five slugs, as a type, so nothing below can fall out of step. */
export type ProblemSlug = keyof typeof PROBLEM_SEO;

/**
 * Symptom names as the page itself displays them. Typed against
 * PROBLEM_SEO: adding a problem to one map and not the other is a
 * compile error, which is the only thing that keeps two maps honest.
 */
export const PROBLEM_MAP: Record<ProblemSlug, string> = {
  'wont-start': "Generator Won't Start",
  overheating: 'Generator Overheating',
  'low-oil-pressure': 'Low Oil Pressure',
  'voltage-frequency-unstable': 'Unstable Voltage or Frequency',
  'exhaust-smoke': 'Excessive Exhaust Smoke',
};

export const PROBLEM_SLUGS = Object.keys(PROBLEM_MAP);

/*
 * Lookups take a plain string because that is what a URL segment is: the slug
 * arrives from params and is not known to be one of the five. These return
 * undefined for anything else, which is what both callers already handle —
 * indexing the maps directly with a string would not type-check.
 */
export function getProblemSeo(slug: string): ProblemSeo | undefined {
  return (PROBLEM_SEO as Record<string, ProblemSeo>)[slug];
}

export function getProblemName(slug: string): string | undefined {
  return (PROBLEM_MAP as Record<string, string>)[slug];
}
