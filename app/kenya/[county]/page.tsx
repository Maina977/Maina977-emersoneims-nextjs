import { Metadata } from 'next';
import Link from 'next/link';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';

type Props = {
  params: { county: string } | Promise<{ county: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const countySlug = resolvedParams?.county ?? '';
  const county = countySlug
    ? countySlug.charAt(0).toUpperCase() + countySlug.slice(1).replace('-', ' ')
    : 'Kenya';
  
  return {
    title: `Generator & Solar Power Solutions in ${county} | EmersonEIMS`,
    description: `Premium generator installation, solar power systems, and energy diagnostics in ${county}, Kenya. 24/7 support and maintenance for businesses in ${county}.`,
    keywords: [`generators ${county}`, `solar power ${county}`, `power backup ${county}`, `EmersonEIMS ${county}`, `energy solutions ${county}`],
    openGraph: {
      title: `Reliable Power Solutions in ${county} | EmersonEIMS`,
      description: `Leading provider of industrial generators and solar energy systems in ${county}.`,
    }
  };
}

export default async function KenyaCountyPage({ params }: Props) {
  const resolvedParams = await params;
  const countySlug = resolvedParams?.county ?? '';
  const county = countySlug
    ? countySlug.charAt(0).toUpperCase() + countySlug.slice(1).replace('-', ' ')
    : 'Kenya';

  return (
    <div className="eims-section min-h-screen pt-24 pb-12">
      <LocalBusinessSchema
        name={`EmersonEIMS ${county}`}
        description={`Premium generator installation, solar power systems, and energy diagnostics in ${county}, Kenya.`}
        url={`https://www.emersoneims.com/kenya/${countySlug || 'kenya'}`}
        address={{
          addressLocality: county,
          addressCountry: "KE"
        }}
      />
      <div className="eims-shell py-0">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Power Solutions in {county}
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            EmersonEIMS brings world-class energy infrastructure to {county}. From industrial generators to advanced solar systems, we power {county}'s growth.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 transition-colors">
            <h3 className="text-2xl font-bold mb-4 text-amber-400">Generators in {county}</h3>
            <p className="text-gray-400 mb-6">
              Reliable diesel and gas generators for businesses in {county}. Installation, maintenance, and 24/7 support.
            </p>
            <Link href="/generators" className="text-white underline decoration-amber-400 underline-offset-4">
              View Generators &rarr;
            </Link>
          </div>

          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-colors">
            <h3 className="text-2xl font-bold mb-4 text-cyan-400">Solar Power {county}</h3>
            <p className="text-gray-400 mb-6">
              Commercial and residential solar installations. Reduce energy costs in {county} with our high-efficiency systems.
            </p>
            <Link href="/solar" className="text-white underline decoration-cyan-400 underline-offset-4">
              View Solar Solutions &rarr;
            </Link>
          </div>

          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/50 transition-colors">
            <h3 className="text-2xl font-bold mb-4 text-purple-400">Diagnostics</h3>
            <p className="text-gray-400 mb-6">
              Power quality analysis and energy audits for facilities in {county}. Optimize your power usage today.
            </p>
            <Link href="/diagnostic-suite" className="text-white underline decoration-purple-400 underline-offset-4">
              Diagnostic Suite &rarr;
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-amber-500/10 to-cyan-500/10 p-12 rounded-3xl border border-white/10">
          <h2 className="text-3xl font-bold mb-4">Ready to Power Your Project in {county}?</h2>
          <p className="text-gray-400 mb-8">Our engineering team is ready to deploy to {county}.</p>
          <Link 
            href="/contact" 
            className="inline-block bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors"
          >
            Contact Our {county} Team
          </Link>
        </div>
      </div>
    </div>
  );
}
