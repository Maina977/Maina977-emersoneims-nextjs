import type { Metadata } from "next";

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/generator-services' },
  title: "Generator Services Kenya",
  description: "Complete generator services in Kenya - Installation, repairs, maintenance, overhauls, lease/rental, 24/7 emergency support. All brands serviced: Cummins, Perkins, CAT, Volvo. Serving all 47 counties. Generator installation Nairobi, generator repair Mombasa, generator maintenance Kisumu.",
  keywords: "generator services Kenya, generator installation Kenya, generator repair Kenya, generator maintenance Kenya, generator servicing Kenya, generator overhaul Kenya, generator lease Kenya, generator rental Kenya, 24 hour generator repair Kenya, emergency generator service Kenya, generator installation Nairobi, generator mechanic Kenya",
};

export default function GeneratorServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
