import { Metadata } from 'next';
import Link from 'next/link';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';

type Props = {
  params: { country: string; city: string } | Promise<{ country: string; city: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const countrySlug = resolvedParams?.country ?? '';
  const citySlug = resolvedParams?.city ?? '';

  const country = countrySlug ? countrySlug.charAt(0).toUpperCase() + countrySlug.slice(1) : 'Region';
  const city = citySlug ? citySlug.charAt(0).toUpperCase() + citySlug.slice(1).replace('-', ' ') : 'City';
  
  return {
    title: `Energy Solutions in ${city}, ${country} | EmersonEIMS`,
    description: `Leading provider of generators, solar power, and energy infrastructure in ${city}, ${country}. Serving the East African region with premium power engineering.`,
    keywords: [`generators ${city}`, `solar power ${city}`, `energy solutions ${country}`, `EmersonEIMS ${country}`, `power backup ${city}`],
    openGraph: {
      title: `Power Engineering in ${city}, ${country} | EmersonEIMS`,
      description: `Premium energy solutions for ${city} and ${country}.`,
    }
  };
}

export default async function RegionalPage({ params }: Props) {
  const resolvedParams = await params;
  const countrySlug = resolvedParams?.country ?? '';
  const citySlug = resolvedParams?.city ?? '';

  const country = countrySlug ? countrySlug.charAt(0).toUpperCase() + countrySlug.slice(1) : 'Region';
  const city = citySlug ? citySlug.charAt(0).toUpperCase() + citySlug.slice(1).replace('-', ' ') : 'City';

  return (
    <div className="eims-section min-h-screen pt-24 pb-12">
      <LocalBusinessSchema
        name={`EmersonEIMS ${city}`}
        description={`Leading provider of generators, solar power, and energy infrastructure in ${city}, ${country}.`}
        url={`https://www.emersoneims.com/${countrySlug || 'region'}/${citySlug || 'city'}`}
        address={{
          addressLocality: city,
          addressCountry: country
        }}
      />
      <div className="eims-shell py-0">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 text-sm mb-4">
            Serving {country} Region
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            Energy Infrastructure in {city}
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            EmersonEIMS delivers premium power engineering solutions to {city}, {country}. We specialize in large-scale generator installations and commercial solar projects across East Africa.
          </p>
        </div>

        {/* Regional Services */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10">
            <h3 className="text-2xl font-bold mb-4">Industrial Power</h3>
            <p className="text-gray-400 mb-6">
              We supply and install heavy-duty generators for factories, hospitals, and data centers in {city}.
            </p>
            <ul className="space-y-2 text-gray-500 mb-6">
              <li>• Diesel Generators (10kVA - 2500kVA)</li>
              <li>• Gas Generators</li>
              <li>• Synchronization Panels</li>
            </ul>
            <Link href="/generators" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Explore Generators &rarr;
            </Link>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10">
            <h3 className="text-2xl font-bold mb-4">Renewable Energy</h3>
            <p className="text-gray-400 mb-6">
              Transition your business in {city} to sustainable power with our advanced solar and battery storage solutions.
            </p>
            <ul className="space-y-2 text-gray-500 mb-6">
              <li>• Commercial Solar PV</li>
              <li>• Hybrid Systems</li>
              <li>• Energy Storage</li>
            </ul>
            <Link href="/solar" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Explore Solar &rarr;
            </Link>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center border-t border-white/10 pt-16">
          <h2 className="text-3xl font-bold mb-6">Contact Our East Africa Team</h2>
          <p className="text-gray-400 mb-8">
            We have dedicated teams serving {city} and the wider {country} region.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-cyan-600 text-white px-8 py-4 rounded-full font-bold hover:bg-cyan-500 transition-colors"
          >
            Get a Quote for {city} Project
          </Link>
        </div>
      </div>
    </div>
  );
}
