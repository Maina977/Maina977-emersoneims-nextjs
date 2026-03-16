import { Metadata } from 'next';

// Problem metadata for SEO
const PROBLEM_SEO: Record<string, { title: string; description: string; keywords: string }> = {
  'wont-start': {
    title: "Generator Won't Start - Causes & Solutions",
    description: "Diagnose why your generator won't start. Common causes include flat battery, air in fuel system, starter motor failure, and control panel faults. Step-by-step troubleshooting guide.",
    keywords: "generator won't start, generator not starting, generator cranks but won't start, generator starting problems Kenya",
  },
  'overheating': {
    title: 'Generator Overheating - Causes & Solutions',
    description: 'Fix generator overheating problems. Learn about low coolant, blocked radiator, thermostat failure, water pump issues, and overloading. Expert troubleshooting guide.',
    keywords: 'generator overheating, generator high temperature, generator cooling problems, generator thermal shutdown Kenya',
  },
  'low-oil-pressure': {
    title: 'Generator Low Oil Pressure - Causes & Solutions',
    description: 'Troubleshoot low oil pressure warnings on your generator. Causes include low oil level, faulty sensors, worn oil pump, and wrong oil viscosity. Critical diagnostic guide.',
    keywords: 'generator low oil pressure, oil pressure warning, generator lubrication problems Kenya',
  },
  'voltage-frequency-unstable': {
    title: 'Generator Voltage & Frequency Problems - Causes & Solutions',
    description: 'Fix unstable voltage and frequency on your generator. Learn about AVR faults, governor issues, load imbalance, and fuel supply problems. Expert power quality guide.',
    keywords: 'generator voltage fluctuation, generator frequency unstable, generator AVR problems, generator governor Kenya',
  },
  'exhaust-smoke': {
    title: 'Generator Exhaust Smoke - Causes & Solutions',
    description: 'Diagnose generator exhaust smoke by color. Black smoke indicates fuel issues, white smoke means coolant problems, blue smoke indicates oil burning. Complete diagnosis guide.',
    keywords: 'generator black smoke, generator white smoke, generator blue smoke, generator exhaust problems Kenya',
  },
};

export async function generateMetadata({ params }: { params: { problem: string } }): Promise<Metadata> {
  const seo = PROBLEM_SEO[params.problem];

  if (!seo) {
    return {
      title: 'Generator Problem',
      description: 'Diagnose and fix common generator problems.',
    };
  }

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: 'article',
      images: ['/images/generator-diagnostics.webp'],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
  };
}

export default function ProblemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
