import type { Metadata } from "next";
import { buildGeneratorSolutionsJsonLd } from "@/lib/solutions/generatorsSchema";

export const metadata: Metadata = {
  title: "Generator Solutions Kenya",
  description: "Complete generator solutions in Kenya. Expert installation, maintenance schedules, fault diagnosis, and 24/7 emergency repairs. Cummins, Perkins, CAT specialists. Serving Nairobi, Mombasa, Kisumu & all 47 counties. Call +254 768 860 665.",
  keywords: "generator installation Kenya, generator repair Kenya, generator maintenance Kenya, generator service Nairobi, Cummins generator Kenya, Perkins generator Kenya, CAT generator Kenya, diesel generator Kenya, standby generator Kenya, generator fault codes, generator troubleshooting, AMF panel Kenya, ATS installation Kenya, generator parts Kenya",
  openGraph: {
    title: "Generator Solutions Hub | Expert Installation & Repairs",
    description: "A detailed generator resource. Installation guides, maintenance schedules and fault diagnosis by our engineers. 24/7 emergency service.",
    url: "https://www.emersoneims.com/solutions/generators",
    siteName: "EmersonEIMS",
    locale: "en_KE",
    type: "website",
    images: [{ url: "https://www.emersoneims.com/og/generator-solutions.jpg", width: 1200, height: 630, alt: "Generator Solutions Kenya" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Generator Solutions Kenya",
    description: "Complete generator installation, maintenance & repair solutions. Expert technicians, 24/7 service.",
  },
  alternates: {
    canonical: "https://www.emersoneims.com/solutions/generators",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function GeneratorSolutionsLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = buildGeneratorSolutionsJsonLd();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
