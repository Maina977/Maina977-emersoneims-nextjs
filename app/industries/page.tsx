/**
 * Industries Hub Page
 *
 * Apple-grade cinematic landing page listing all industries we serve.
 * Server component keeps metadata + SEO content; the scroll experience
 * (WebGL hero, GSAP ScrollTrigger parallax, horizontal services rail)
 * lives in the IndustriesExperience client component.
 */

import { Metadata } from 'next';
import { getAllIndustries, INDUSTRY_STATS } from '@/lib/seo/industryData';
import B2BCommercialBand from '@/components/b2b/B2BCommercialBand';
import IndustriesExperience from '@/components/industries/IndustriesExperience';

export const metadata: Metadata = {
  title: 'Industries We Serve | Generator & Power Solutions for Every Sector | EmersonEIMS',
  description: 'Specialized generator and power solutions for hotels, hospitals, schools, banks, factories, flower farms, real estate, churches, and government. Serving 16,245+ hotels, 9,458+ hospitals, 93,988+ schools across Kenya. Call +254768860665.',
  openGraph: {
    title: 'Industries We Serve | EmersonEIMS Kenya',
    description: 'Specialized power solutions for every industry in Kenya. Hotels, hospitals, schools, banks, manufacturing, and more.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.emersoneims.com/industries',
  }
};

export default function IndustriesPage() {
  const industries = getAllIndustries().map((industry) => ({
    slug: industry.slug,
    name: industry.name,
    icon: industry.icon,
    heroSubtitle: industry.heroSubtitle,
    marketSize: industry.marketSize,
  }));

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Cinematic experience: hero, industry cards, services rail, trust, CTA */}
      <IndustriesExperience
        industries={industries}
        stats={{
          totalHotelsTarget: INDUSTRY_STATS.totalHotelsTarget,
          totalHospitalsTarget: INDUSTRY_STATS.totalHospitalsTarget,
          totalSchoolsTarget: INDUSTRY_STATS.totalSchoolsTarget,
          totalCountiesCovered: INDUSTRY_STATS.totalCountiesCovered,
        }}
      />

      {/* B2B Commercial Band (preserved) */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <B2BCommercialBand profile={{
            eyebrow: 'Industry Solutions • B2B Power',
            headline: 'Specialized power solutions for every industry in Kenya.',
            subtitle: 'From hospitals and hotels to manufacturing, banks, and agribusiness — engineered, installed, and maintained for uptime, compliance, and ROI.',
            whoFor: [
              'Hospitals & clinics',
              'Hotels & hospitality',
              'Manufacturing',
              'Banks & financial',
              'Schools & universities',
              'Agribusiness',
              'Data centres',
              'Government & NGOs',
            ],
            pso: [
              { problem: 'Industry-specific risks: outages, compliance, downtime.', solution: 'Tailored engineering, installation, and SLA-backed service.', outcome: 'Documented uptime, audit-ready compliance, lower TCO.' },
              { problem: 'Generic solutions don’t fit your sector.', solution: 'Sector-specific sizing, controls, and reporting.', outcome: 'Right-fit systems, proven results, sector references.' },
              { problem: 'No single partner for all your sites.', solution: 'Nationwide coverage, one contract, one SLA.', outcome: 'Simplified management, predictable cost, 24/7 support.' },
            ],
            trust: [
              'Trusted by 16,000+ hotels, 9,000+ hospitals, 93,000+ schools',
              '3-year warranty, 24/7 support',
              'SLA-backed service, audit-ready records',
            ],
            ctas: [
              { label: 'Get Industry Proposal', href: '/contact?topic=industry-proposal', variant: 'primary' },
              { label: 'Book Free Site Survey', href: '/booking?service=industry-audit', variant: 'secondary' },
              { label: 'WhatsApp Industry Desk', href: 'https://wa.me/254768860665', variant: 'tertiary' },
            ],
            accent: 'cyan',
          }} />
        </div>
      </section>

      {/* SEO Content (preserved) */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto prose prose-invert">
          <h2>Industry-Specific Generator Solutions in Kenya</h2>
          <p>
            EmersonEIMS provides specialized power solutions for every major industry in Kenya.
            Unlike generic generator suppliers, we understand that each sector has unique requirements:
          </p>

          <ul>
            <li><strong>Hotels and hospitality</strong> need silent operation and seamless changeover to avoid disturbing guests</li>
            <li><strong>Hospitals</strong> require zero-transfer-time UPS systems for life-critical equipment</li>
            <li><strong>Schools</strong> need budget-friendly options with payment plans that match fee collection cycles</li>
            <li><strong>Banks</strong> demand enterprise-grade reliability with CBK compliance documentation</li>
            <li><strong>Factories</strong> require heavy-duty industrial generators that handle high starting currents</li>
            <li><strong>Flower farms</strong> need cold room protection and solar-hybrid irrigation systems</li>
            <li><strong>Real estate</strong> requires construction site rentals and permanent building backup systems</li>
            <li><strong>Churches</strong> benefit from affordable solutions and flexible payment options</li>
            <li><strong>Government offices</strong> need AGPO-compliant vendors with proper documentation</li>
          </ul>

          <h3>Why Choose EmersonEIMS for Your Industry?</h3>
          <p>
            With over 1,500 installations across Kenya's 47 counties, we've developed deep expertise
            in every major industry. Our technicians understand your specific challenges, our sales
            team speaks your language, and our support staff knows exactly how critical your power
            needs are.
          </p>

          <p>
            Call us today at <a href="tel:+254768860665">+254 768 860 665</a> for a free consultation
            tailored to your industry's unique requirements.
          </p>
        </div>
      </section>
    </div>
  );
}
