'use client';

export default function FAQs() {
  const faqs = [
    { q: 'Do you offer Cummins generator sales and commissioning?', a: 'Yes. We supply, install, and commission Cummins sets with DeepSea/PowerWizard controls, ATS/DB integration, and telemetry.' },
    { q: 'Can you design hybrid solar‑diesel systems?', a: 'Absolutely. We model solar, diesel, and storage to minimize fuel, maintain uptime, and ensure seamless transitions.' },
    { q: 'Do you support UPS sizing and runtime calculations?', a: 'Yes. Our tools estimate runtime based on load, battery capacity, and efficiency, with tailored recommendations.' },
    { q: 'Do you fabricate canopies, DBs, and changeover enclosures?', a: 'We fabricate to spec with acoustic treatment, IP ratings, and compliant busbar systems for clean distribution.' },
    { q: 'Do you service pumps, incinerators, and automation?', a: 'We repair, automate, and integrate controls for borehole pumps, incinerators, and industrial equipment.' },
  ];
  return (
    <section aria-labelledby="faq-heading" className="py-20 px-4 bg-gradient-to-b from-gray-950 to-black">
      <div className="max-w-5xl mx-auto">
        <h2 id="faq-heading" className="text-3xl md:text-4xl font-black tracking-tight text-white mb-8">FAQs</h2>
        <div className="space-y-6">
          {faqs.map((f) => (
            <details key={f.q} className="group border border-gray-800 rounded-xl p-5 bg-gray-900/40">
              <summary className="cursor-pointer text-white font-semibold flex items-center justify-between">
                {f.q}
                <span className="ml-4 text-amber-400 group-open:rotate-90 transition-transform">›</span>
              </summary>
              <p className="mt-3 text-gray-300">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
