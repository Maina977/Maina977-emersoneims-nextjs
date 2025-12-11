'use client';

import SectionLead from "../componets/generators/SectionLead";
import Link from "next/link";

const SOLUTIONS_LINKS = [
  { href: "/solutions/generators", label: "Diesel generators" },
  { href: "/solutions/controls", label: "Controls (DeepSea & PowerWizard)" },
  { href: "/solutions/solar", label: "Solar technical issues" },
  { href: "/solutions/solar-sizing", label: "Solar sizing" },
  { href: "/solutions/power-interruptions", label: "Power interruptions" },
  { href: "/solutions/ac", label: "AC systems" },
  { href: "/solutions/ups", label: "UPS systems" },
  { href: "/solutions/diesel-automation", label: "Diesel automation" },
  { href: "/solutions/borehole-pumps", label: "Borehole pumps" },
  { href: "/solutions/incinerators", label: "Incinerators" },
  { href: "/solutions/motors", label: "Motors & rewinding" },
] as const;

export default function SolutionsHome() {
  return (
    <main>
      <SectionLead
        title="Solutions: your engineering bible"
        subtitle="Authoritative guides for diesel generators, controls, solar, power quality, AC, UPS, automation, pumps, incinerators, and motors."
      />

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SOLUTIONS_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              className="sci-fi-outline hover:bg-white/5 p-4 rounded-lg transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mt-10 flex gap-4">
          <Link
            href="/solutions/contact"
            prefetch
            className="sci-fi-button"
          >
            Talk to an expert
          </Link>
          <Link
            href="/calculator"
            prefetch
            className="sci-fi-outline"
          >
            Solar calculator
          </Link>
        </div>
      </section>
    </main>
  );
}