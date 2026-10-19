import Link from 'next/link';

/**
 * What SolarGenius Pro does, in plain terms, with links to the real tools.
 *
 * Replaces the embedded SolarGeniusProHubV2 on /solutions/solar. That hub
 * opened the page with "56 AI engines", "195+ countries", "<3 minute
 * quotations", "the most advanced solar engineering platform on Earth" and an
 * accuracy percentage on every "engine" — none of it measured.
 * (2026-10-19 tool audit.) The calculator itself lives at /solar-genius-pro
 * and sizes with NASA POWER sun-hours (lib/solar/sizing.ts).
 */
const CARDS = [
  {
    title: 'What it uses',
    body: 'Your monthly kWh from the KPLC bill (or your appliance list), NASA POWER sun-hours for your town, and mid-2026 typical Kenyan installed prices.',
  },
  {
    title: 'What you get',
    body: 'Panel, inverter and battery sizes for grid-tied, hybrid or off-grid, an installed-cost range, the monthly saving and a simple payback, with every assumption shown.',
  },
  {
    title: 'What it cannot do',
    body: 'Replace a site visit or a quotation. Roof condition, shading, cable runs and the final equipment list are confirmed by our engineers on site.',
  },
];

export default function SolarGeniusProCard() {
  return (
    <section className="px-6 py-12 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">SolarGenius Pro — free solar sizing</h2>
        <p className="text-gray-300 max-w-3xl mx-auto">
          A first estimate of the solar system you need and what it typically costs in Kenya. It is an estimate to
          plan with, not a quotation.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {CARDS.map((card) => (
          <div key={card.title} className="bg-slate-800/60 rounded-xl p-5 border border-yellow-500/20">
            <h3 className="text-base font-bold text-yellow-400 mb-2">{card.title}</h3>
            <p className="text-sm text-gray-300">{card.body}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/solar-genius-pro"
          className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-400 transition-colors"
        >
          Open SolarGenius Pro <span aria-hidden="true">→</span>
        </Link>
        <Link
          href="/solar-design-studio"
          className="inline-flex items-center gap-2 px-8 py-4 border border-yellow-500/40 text-yellow-300 font-bold rounded-full hover:bg-yellow-500/10 transition-colors"
        >
          Solar Design Studio
        </Link>
      </div>
    </section>
  );
}
