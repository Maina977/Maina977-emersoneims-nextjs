import Link from 'next/link';

/**
 * What AquaScan Pro is, in plain terms, with a link to the real tool.
 *
 * Replaces the older embedded "AI Borehole Analyzer" (components/borehole/
 * BoreholeAIAnalyzer.tsx) on the service and maintenance pages. That copy sat
 * under "World's #1", "26 AI engines", "195+ countries" and "AI-simulated
 * VES & ERT — no equipment needed", none of it measured, and when analysis
 * failed it analysed an empty image and still showed results. Telling a
 * landowner a desktop tool replaces the survey can cost them a dry hole.
 * (2026-10-19 tool audit.) The real tool lives at /aquascan-pro-v3.
 */
const CARDS = [
  {
    title: 'What it uses',
    body: 'NASA POWER and ERA5-Land climate data, ISRIC SoilGrids, SRTM terrain, mapped water points (WPDx, OpenStreetMap) and real drilled-borehole records (UNESCO IHP-WINS) where they exist.',
  },
  {
    title: 'What you get',
    body: 'Depth, yield and cost as ranges, each with its data source, plus recorded boreholes and springs near the site. A downloadable PDF summarises it.',
  },
  {
    title: 'What it cannot do',
    body: 'Pick the exact drilling point or guarantee water. A geophysical survey (ERT/VES), a licensed hydrogeologist and a Water Resources Authority permit come before any drilling.',
  },
];

export default function AquaScanPreScreenCard({ headingLevel = 'h2' }: { headingLevel?: 'h2' | 'h3' }) {
  const Heading = headingLevel;
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Heading className="text-3xl md:text-4xl font-bold text-white mb-4">
          AquaScan Pro — free borehole pre-screen
        </Heading>
        <p className="text-slate-300 max-w-3xl mx-auto">
          Before you pay for a survey, get a first look at a site: likely depth, yield and drilling-cost ranges from
          public climate, soil and water-point data, and the water-quality risks to test for. It screens a site{' '}
          <strong>before</strong> the hydrogeological survey — it does not replace it.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {CARDS.map((card) => (
          <div key={card.title} className="bg-slate-800/60 rounded-xl p-5 border border-cyan-500/20">
            <h3 className="text-base font-bold text-cyan-400 mb-2">{card.title}</h3>
            <p className="text-sm text-slate-300">{card.body}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/aquascan-pro-v3"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full hover:scale-105 transition-transform"
        >
          Open AquaScan Pro <span aria-hidden="true">→</span>
        </Link>
        <Link
          href="/aquascan-pro-v3/methodology"
          className="inline-flex items-center gap-2 px-8 py-4 border border-cyan-500/40 text-cyan-300 font-bold rounded-full hover:bg-cyan-500/10 transition-colors"
        >
          How it works and how it is tested
        </Link>
      </div>
    </div>
  );
}
