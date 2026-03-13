/**
 * Dynamic Service + Location Page
 *
 * Generates hyper-local SEO pages for every service-location combination.
 * Example: /locations/westlands/generators, /locations/mombasa/solar
 *
 * This creates thousands of pages targeting searches like:
 * - "generator repair Westlands"
 * - "solar installation Mombasa"
 * - "UPS systems Kilimani"
 */

import { Metadata } from 'next';
import Link from 'next/link';
import {
  getAllServiceLocationPaths,
  getLocationBySlug,
  getCountyBySlug,
  generateLocationSEO,
  SERVICES,
  COUNTIES
} from '@/lib/seo/kenyaLocations';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ location: string; service: string }>;
}

// Generate static paths for all service-location combinations
export async function generateStaticParams() {
  const paths = getAllServiceLocationPaths();
  return paths.map(p => ({
    location: p.location,
    service: p.service
  }));
}

// Generate SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location: locationSlug, service: serviceSlug } = await params;
  const seo = generateLocationSEO(serviceSlug, locationSlug);

  if (!seo) return { title: 'Page Not Found' };

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: 'website',
    },
    alternates: {
      canonical: `https://www.emersoneims.com/locations/${locationSlug}/${serviceSlug}`,
    }
  };
}

export default async function ServiceLocationPage({ params }: Props) {
  const { location: locationSlug, service: serviceSlug } = await params;

  const location = getLocationBySlug(locationSlug);
  const service = SERVICES.find(s => s.slug === serviceSlug);
  const county = getCountyBySlug(locationSlug) || COUNTIES.find(c =>
    c.constituencies.includes(locationSlug) ||
    c.majorTowns.includes(locationSlug)
  );

  if (!location || !service) {
    notFound();
  }

  const locationName = location.name;
  const isCounty = location.type === 'county';

  // Service-specific content
  const serviceContent = getServiceContent(service.slug, locationName);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs - Important for SEO */}
          <nav className="mb-8 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-slate-400 flex-wrap">
              <li><Link href="/" className="hover:text-cyan-400">Home</Link></li>
              <li>/</li>
              <li><Link href={`/${service.slug}`} className="hover:text-cyan-400">{service.shortName}</Link></li>
              <li>/</li>
              <li><Link href="/locations" className="hover:text-cyan-400">Locations</Link></li>
              {!isCounty && county && (
                <>
                  <li>/</li>
                  <li><Link href={`/locations/${county.slug}`} className="hover:text-cyan-400">{county.name}</Link></li>
                </>
              )}
              <li>/</li>
              <li className="text-white">{locationName}</li>
            </ol>
          </nav>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {service.shortName} in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {locationName}
            </span>
          </h1>

          <p className="text-xl text-slate-300 max-w-3xl mb-8">
            {service.description} Professional {service.shortName.toLowerCase()} services in {locationName}
            {!isCounty && county ? `, ${county.name} County` : ''}, Kenya. 3-Year Warranty. 24/7 Emergency Support.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="tel:+254768860665"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              Call Now: +254 768 860 665
            </a>
            <a
              href="https://wa.me/254768860665"
              className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all"
            >
              WhatsApp for Quote
            </a>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-cyan-500 text-cyan-400 font-semibold rounded-lg hover:bg-cyan-500/10 transition-all"
            >
              Request Free Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Service Features */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">
            {service.shortName} Services We Offer in {locationName}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceContent.features.map((feature, idx) => (
              <div key={idx} className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us for This Service */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Why Choose EmersonEIMS for {service.shortName} in {locationName}?
              </h2>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 text-xl">✓</span>
                  <div>
                    <strong className="text-white">3-Year Warranty</strong>
                    <p className="text-slate-400 text-sm">Industry-leading warranty on all installations and services</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 text-xl">✓</span>
                  <div>
                    <strong className="text-white">Local {locationName} Team</strong>
                    <p className="text-slate-400 text-sm">Fast response times with technicians based in your area</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 text-xl">✓</span>
                  <div>
                    <strong className="text-white">24/7 Emergency Service</strong>
                    <p className="text-slate-400 text-sm">Round-the-clock support for urgent {service.shortName.toLowerCase()} needs</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 text-xl">✓</span>
                  <div>
                    <strong className="text-white">Certified Professionals</strong>
                    <p className="text-slate-400 text-sm">Trained and certified technicians with proven expertise</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 text-xl">✓</span>
                  <div>
                    <strong className="text-white">Competitive Pricing</strong>
                    <p className="text-slate-400 text-sm">Best value {service.shortName.toLowerCase()} solutions in {locationName}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Get a Free Quote</h3>
              <p className="text-slate-400 mb-6">
                Tell us about your {service.shortName.toLowerCase()} needs in {locationName} and we'll provide a free, no-obligation quote.
              </p>

              <div className="space-y-4">
                <a
                  href="tel:+254768860665"
                  className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-all"
                >
                  <span className="text-2xl">📞</span>
                  <div>
                    <div className="text-white font-semibold">Call Us</div>
                    <div className="text-cyan-400">+254 768 860 665</div>
                  </div>
                </a>

                <a
                  href="https://wa.me/254768860665"
                  className="flex items-center gap-3 p-4 bg-green-900/30 border border-green-700/50 rounded-lg hover:bg-green-900/50 transition-all"
                >
                  <span className="text-2xl">💬</span>
                  <div>
                    <div className="text-white font-semibold">WhatsApp</div>
                    <div className="text-green-400">Chat with us now</div>
                  </div>
                </a>

                <a
                  href="mailto:info@emersoneims.com"
                  className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-all"
                >
                  <span className="text-2xl">✉️</span>
                  <div>
                    <div className="text-white font-semibold">Email</div>
                    <div className="text-slate-400">info@emersoneims.com</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Services in This Location */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">
            Other Services in {locationName}
          </h2>

          <div className="flex flex-wrap gap-3">
            {SERVICES.filter(s => s.slug !== serviceSlug).map(s => (
              <Link
                key={s.slug}
                href={`/locations/${locationSlug}/${s.slug}`}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:border-cyan-500 hover:text-white transition-all"
              >
                {s.shortName}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto prose prose-invert">
          <h2>{service.shortName} Company in {locationName}, Kenya</h2>
          <p>
            Looking for professional {service.name.toLowerCase()} in {locationName}? EmersonEIMS is your trusted
            local partner for all {service.shortName.toLowerCase()} needs. We have been serving {locationName}
            {!isCounty && county ? ` and the greater ${county.name} County area` : ''} with reliable, high-quality
            power solutions backed by our industry-leading 3-Year Warranty.
          </p>

          {serviceContent.seoContent.map((section, idx) => (
            <div key={idx}>
              <h3>{section.heading.replace('{location}', locationName)}</h3>
              <p>{section.content.replace(/{location}/g, locationName)}</p>
            </div>
          ))}

          <h3>Contact Us for {service.shortName} in {locationName}</h3>
          <p>
            Ready to discuss your {service.shortName.toLowerCase()} requirements in {locationName}?
            Contact EmersonEIMS today for a free consultation and quote. Our team of experts is ready
            to help you find the perfect solution for your power needs.
          </p>
          <ul>
            <li><strong>Phone:</strong> +254 768 860 665</li>
            <li><strong>WhatsApp:</strong> +254 768 860 665</li>
            <li><strong>Email:</strong> info@emersoneims.com</li>
            <li><strong>Service Area:</strong> {locationName}{!isCounty && county ? `, ${county.name} County` : ''} and surrounding areas</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

// Service-specific content generator
function getServiceContent(serviceSlug: string, locationName: string) {
  const contentMap: Record<string, {
    features: { icon: string; title: string; description: string }[];
    seoContent: { heading: string; content: string }[];
  }> = {
    generators: {
      features: [
        { icon: '🔋', title: 'Generator Sales', description: 'New and used diesel generators from top brands - Cummins, Perkins, FG Wilson, Caterpillar.' },
        { icon: '🔧', title: 'Generator Installation', description: 'Professional installation with automatic transfer switches and fuel systems.' },
        { icon: '⚡', title: 'Generator Maintenance', description: 'Scheduled preventive maintenance to keep your generator running reliably.' },
        { icon: '🚨', title: 'Emergency Repairs', description: '24/7 emergency generator repair service with fast response times.' },
        { icon: '🛠️', title: 'Generator Overhaul', description: 'Complete engine overhaul and rebuild services for aging generators.' },
        { icon: '📋', title: 'Load Bank Testing', description: 'Comprehensive load testing to verify generator performance and reliability.' },
      ],
      seoContent: [
        { heading: 'Generator Sales in {location}', content: 'EmersonEIMS offers a wide range of diesel generators for sale in {location}. Whether you need a small 10kVA generator for your home or a large 2000kVA industrial generator for your factory, we have the perfect solution. We are authorized dealers for Cummins, Perkins, FG Wilson, and Caterpillar generators.' },
        { heading: 'Generator Repair Services in {location}', content: 'Is your generator not starting? Experiencing power fluctuations? Our expert technicians in {location} can diagnose and repair any generator problem. We carry genuine spare parts and offer fast turnaround times to minimize your downtime.' },
        { heading: 'Generator Maintenance in {location}', content: 'Regular maintenance is key to generator reliability. Our maintenance programs in {location} include oil and filter changes, cooling system service, fuel system cleaning, battery testing, and comprehensive inspections to catch problems before they cause failures.' },
      ]
    },
    solar: {
      features: [
        { icon: '☀️', title: 'Solar Panel Installation', description: 'Professional installation of high-efficiency solar panels for homes and businesses.' },
        { icon: '🔋', title: 'Battery Storage', description: 'Lithium and lead-acid battery systems for energy storage and backup power.' },
        { icon: '🏠', title: 'Residential Solar', description: 'Complete home solar systems to reduce electricity bills and gain energy independence.' },
        { icon: '🏢', title: 'Commercial Solar', description: 'Large-scale solar installations for businesses, factories, and institutions.' },
        { icon: '🌍', title: 'Off-Grid Systems', description: 'Complete off-grid solar solutions for remote locations without grid access.' },
        { icon: '⚡', title: 'Hybrid Systems', description: 'Solar-generator hybrid systems for reliable power with renewable energy priority.' },
      ],
      seoContent: [
        { heading: 'Solar Installation in {location}', content: 'Go solar in {location} with EmersonEIMS. We design and install complete solar power systems tailored to your energy needs. Our solar panels are sourced from top manufacturers and come with comprehensive warranties for peace of mind.' },
        { heading: 'Solar Panel Prices in {location}', content: 'Looking for affordable solar panels in {location}? We offer competitive pricing on all our solar solutions. Contact us for a free site assessment and customized quote based on your energy consumption and roof space.' },
        { heading: 'Benefits of Solar Power in {location}', content: 'Solar power in {location} makes excellent economic sense. With abundant sunshine year-round, you can significantly reduce or eliminate your electricity bills while contributing to a cleaner environment. Our solar systems typically pay for themselves within 3-5 years.' },
      ]
    },
    ups: {
      features: [
        { icon: '🔌', title: 'UPS Systems', description: 'Online, offline, and line-interactive UPS systems for critical power protection.' },
        { icon: '🖥️', title: 'Data Center UPS', description: 'High-capacity UPS solutions for data centers and server rooms.' },
        { icon: '🏥', title: 'Medical UPS', description: 'Specialized UPS systems for hospitals and medical equipment.' },
        { icon: '🔋', title: 'Battery Replacement', description: 'UPS battery replacement and disposal services.' },
        { icon: '📊', title: 'Power Monitoring', description: 'UPS monitoring and management systems for proactive maintenance.' },
        { icon: '🔧', title: 'UPS Maintenance', description: 'Regular UPS maintenance to ensure reliability when you need it.' },
      ],
      seoContent: [
        { heading: 'UPS Systems in {location}', content: 'Protect your critical equipment from power outages with UPS systems from EmersonEIMS in {location}. We supply and install APC, Eaton, and other leading UPS brands for offices, data centers, hospitals, and industrial applications.' },
        { heading: 'UPS Installation in {location}', content: 'Our UPS installation services in {location} include site assessment, proper sizing calculations, professional installation, and configuration. We ensure your UPS is correctly sized for your load and provides adequate backup time.' },
        { heading: 'UPS Maintenance in {location}', content: 'Regular UPS maintenance is essential for reliability. Our maintenance programs in {location} include battery testing, firmware updates, cleaning, and comprehensive system checks to ensure your UPS performs when needed.' },
      ]
    },
    electrical: {
      features: [
        { icon: '💡', title: 'Electrical Wiring', description: 'Complete electrical wiring for residential, commercial, and industrial buildings.' },
        { icon: '🔌', title: 'Panel Upgrades', description: 'Electrical panel upgrades and distribution board installations.' },
        { icon: '⚡', title: 'Power Factor Correction', description: 'Capacitor banks and power factor correction systems.' },
        { icon: '🏭', title: 'Industrial Electrical', description: 'Heavy industrial electrical installations and maintenance.' },
        { icon: '🔍', title: 'Electrical Inspection', description: 'Comprehensive electrical safety inspections and certifications.' },
        { icon: '🛠️', title: 'Fault Finding', description: 'Electrical fault diagnosis and repair services.' },
      ],
      seoContent: [
        { heading: 'Electrical Services in {location}', content: 'EmersonEIMS provides comprehensive electrical services in {location}. From new wiring installations to electrical repairs and upgrades, our certified electricians deliver safe, reliable electrical work that meets all regulatory standards.' },
        { heading: 'Commercial Electrical in {location}', content: 'Our commercial electrical services in {location} include office fit-outs, retail electrical, warehouse lighting, and industrial electrical installations. We understand the unique requirements of commercial properties and deliver efficient solutions.' },
        { heading: 'Electrical Repairs in {location}', content: 'Experiencing electrical problems in {location}? Our electricians can quickly diagnose and repair electrical faults, replace damaged wiring, fix circuit breaker issues, and restore your electrical system to safe operation.' },
      ]
    },
    motors: {
      features: [
        { icon: '⚙️', title: 'Motor Rewinding', description: 'Professional electric motor rewinding for all motor types and sizes.' },
        { icon: '🔧', title: 'Motor Repair', description: 'Complete motor repair including bearing replacement and balancing.' },
        { icon: '🔄', title: 'Pump Repair', description: 'Water pump and industrial pump motor repair services.' },
        { icon: '📊', title: 'Motor Testing', description: 'Motor testing and diagnostic services to assess motor health.' },
        { icon: '🏭', title: 'Industrial Motors', description: 'Large industrial motor rewinding and overhaul services.' },
        { icon: '⚡', title: 'Motor Installation', description: 'New motor supply and installation services.' },
      ],
      seoContent: [
        { heading: 'Motor Rewinding in {location}', content: 'EmersonEIMS offers professional motor rewinding services in {location}. We rewind single-phase and three-phase motors, submersible pump motors, compressor motors, and industrial motors of all sizes with high-quality materials.' },
        { heading: 'Electric Motor Repair in {location}', content: 'Is your electric motor making noise, overheating, or not starting? Our motor repair workshop in {location} can diagnose and fix motor problems including bearing failures, winding damage, and shaft issues.' },
        { heading: 'Pump Motor Services in {location}', content: 'We specialize in pump motor rewinding and repair in {location}. Whether its a borehole submersible pump, centrifugal pump, or industrial pump motor, our technicians have the expertise to get your pump running again.' },
      ]
    },
    borehole: {
      features: [
        { icon: '💧', title: 'Borehole Drilling', description: 'Professional borehole drilling for residential and commercial properties.' },
        { icon: '🔧', title: 'Pump Installation', description: 'Submersible pump installation and setup for new boreholes.' },
        { icon: '⚡', title: 'Pump Repair', description: 'Borehole pump repair and replacement services.' },
        { icon: '🌊', title: 'Water Testing', description: 'Water quality testing and treatment solutions.' },
        { icon: '🏗️', title: 'Borehole Rehabilitation', description: 'Reviving low-yield or blocked boreholes.' },
        { icon: '☀️', title: 'Solar Pumping', description: 'Solar-powered borehole pump systems.' },
      ],
      seoContent: [
        { heading: 'Borehole Services in {location}', content: 'EmersonEIMS provides complete borehole services in {location}. From drilling new boreholes to pump installation, repair, and maintenance, we are your one-stop solution for reliable water supply.' },
        { heading: 'Borehole Pump Installation in {location}', content: 'We install high-quality submersible pumps for boreholes in {location}. Our installations include pump, rising main, control panel, and water tank setup for a complete water supply system.' },
        { heading: 'Borehole Pump Repair in {location}', content: 'Is your borehole pump not working? Our technicians in {location} can diagnose and repair submersible pump problems, replace worn components, and get your water supply flowing again quickly.' },
      ]
    },
    ac: {
      features: [
        { icon: '❄️', title: 'AC Installation', description: 'Professional air conditioning installation for all AC types.' },
        { icon: '🔧', title: 'AC Repair', description: 'Air conditioner repair and fault diagnosis services.' },
        { icon: '🧹', title: 'AC Servicing', description: 'Regular AC maintenance and cleaning services.' },
        { icon: '🏢', title: 'Commercial HVAC', description: 'Central air conditioning for commercial buildings.' },
        { icon: '🏠', title: 'Residential AC', description: 'Split AC and window AC installation for homes.' },
        { icon: '🌡️', title: 'HVAC Systems', description: 'Complete HVAC system design and installation.' },
      ],
      seoContent: [
        { heading: 'AC Installation in {location}', content: 'Beat the heat with professional AC installation from EmersonEIMS in {location}. We install split ACs, cassette ACs, ducted systems, and central air conditioning for homes, offices, and commercial buildings.' },
        { heading: 'AC Repair in {location}', content: 'Is your AC not cooling, making noise, or leaking water? Our AC technicians in {location} can diagnose and repair all AC problems including refrigerant leaks, compressor issues, and electrical faults.' },
        { heading: 'AC Servicing in {location}', content: 'Regular AC servicing keeps your air conditioner efficient and reliable. Our AC service in {location} includes filter cleaning, coil cleaning, refrigerant check, and system inspection to prevent breakdowns.' },
      ]
    },
    'generator-diagnostics': {
      features: [
        { icon: '🔍', title: 'Fault Code Reading', description: 'Read and interpret generator controller fault codes and alarms.' },
        { icon: '📊', title: 'Performance Analysis', description: 'Comprehensive generator performance diagnostics and reporting.' },
        { icon: '💻', title: 'ECM Programming', description: 'Engine Control Module programming and parameter adjustment.' },
        { icon: '🔧', title: 'Troubleshooting', description: 'Expert troubleshooting for complex generator problems.' },
        { icon: '📱', title: 'Remote Diagnostics', description: 'Remote monitoring and diagnostic capabilities.' },
        { icon: '📋', title: 'Diagnostic Reports', description: 'Detailed diagnostic reports with recommendations.' },
      ],
      seoContent: [
        { heading: 'Generator Diagnostics in {location}', content: 'EmersonEIMS provides expert generator diagnostics in {location}. Our technicians use professional diagnostic tools to read fault codes, analyze performance data, and identify the root cause of generator problems.' },
        { heading: 'Generator Fault Code Reading in {location}', content: 'Understanding generator fault codes is crucial for proper repair. Our diagnostic services in {location} include reading and interpreting codes from DeepSea, ComAp, Cummins, Caterpillar, and other controller brands.' },
        { heading: 'Generator Troubleshooting in {location}', content: 'Generator not starting? Power fluctuations? Overheating? Our expert troubleshooting services in {location} quickly identify problems and provide solutions to get your generator running reliably.' },
      ]
    },
    'spare-parts': {
      features: [
        { icon: '🔩', title: 'Generator Parts', description: 'Genuine spare parts for all major generator brands.' },
        { icon: '☀️', title: 'Solar Parts', description: 'Solar panels, inverters, charge controllers, and batteries.' },
        { icon: '🔌', title: 'Electrical Parts', description: 'Circuit breakers, cables, switches, and electrical components.' },
        { icon: '⚙️', title: 'Engine Parts', description: 'Filters, belts, hoses, and engine components.' },
        { icon: '🔋', title: 'Batteries', description: 'Generator batteries and UPS batteries.' },
        { icon: '🚚', title: 'Fast Delivery', description: 'Quick delivery of parts across Kenya.' },
      ],
      seoContent: [
        { heading: 'Generator Spare Parts in {location}', content: 'EmersonEIMS supplies genuine spare parts for generators in {location}. We stock parts for Cummins, Perkins, Caterpillar, FG Wilson, and other brands. From filters and belts to major components, we have what you need.' },
        { heading: 'Solar Parts in {location}', content: 'Looking for solar equipment in {location}? We supply solar panels, inverters, charge controllers, batteries, and mounting hardware from quality manufacturers at competitive prices.' },
        { heading: 'Parts Delivery in {location}', content: 'We offer fast parts delivery to {location} and surrounding areas. Order your generator or solar parts today and get them delivered quickly to minimize your downtime.' },
      ]
    }
  };

  return contentMap[serviceSlug] || contentMap.generators;
}
