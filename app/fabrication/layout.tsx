import type { Metadata } from "next";
import ToolSeoContent from '@/components/seo/ToolSeoContent';

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/fabrication' },
  title: "Generator Fabrication Kenya",
  description: "Custom generator fabrication services in Kenya. Soundproof canopies, weatherproof enclosures, exhaust systems, fuel reserve tanks, automation systems. NEMA compliant. Generator canopy Kenya, generator housing Nairobi, fuel tank fabrication, stainless steel tanks.",
  keywords: "generator canopy Kenya, generator enclosure Kenya, fuel tank fabrication Kenya, generator housing Kenya, soundproof canopy Kenya, exhaust silencer Kenya, custom fuel tanks Kenya, stainless steel tanks Kenya, generator accessories Kenya, canopy fabrication Nairobi, weatherproof generator Kenya",
};

export default function FabricationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}
      <ToolSeoContent tool="fabrication" /></>;
}
