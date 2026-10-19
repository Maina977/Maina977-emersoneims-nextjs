/**
 * WHAT EACH ENGINEERING TOOL CAN — AND CANNOT — DO
 *
 * Rewritten 2026-10-18 (tool audit). The previous page showed "verified
 * accuracy percentages" of 97.8–99.8% per tool, an "average accuracy 99.2%",
 * "195+ countries", "4 #1 rankings" and certifications such as "NASA
 * Partnership", "Patent Pending", "ACCE Certified" and "UL 1741". None of
 * those was measured or held, and its own comments said so. A capability page
 * a customer can rely on lists what each tool does, what it does not do, the
 * data behind it, and where a person takes over. Keep every line true to the
 * tool as it ships; when a tool changes, change this page in the same commit.
 */
import Link from 'next/link';

interface ToolFacts {
  id: string;
  name: string;
  icon: string;
  link: string;
  oneLine: string;
  does: string[];
  doesNot: string[];
  data: string[];
  next: { label: string; href: string };
}

const TOOLS: ToolFacts[] = [
  {
    id: 'generator-oracle',
    name: 'Generator Oracle',
    icon: '🔮',
    link: '/generator-oracle',
    oneLine: 'Look up a generator alarm or engine fault code and see the likely causes and checks.',
    does: [
      'Explains controller alarms for DeepSea, ComAp, Woodward, SmartGen, CAT PowerWizard, Datakom, Lovato, Siemens and ENKO',
      'Decodes J1939 engine codes typed the way they appear (for example "SPN 100 FMI 1")',
      'Matches described symptoms to Repair Centre diagnostic guides and related alarms',
      'Gives reset steps per alarm, wiring references and training simulators',
      'Puts a WhatsApp or phone route to an engineer on every result',
    ],
    doesNot: [
      'Connect to or read your generator, controller or ECM — the simulators use simulated values',
      'Use generative AI — the guidance is rule-based and written by our engineers',
      'Replace the manufacturer\'s manual, which is the final word on your exact model',
      'Cover every possible code — older mechanical engines have no engine codes at all',
    ],
    data: [
      'Hand-written controller alarm descriptions (one entry per brand and code)',
      'SAE J1939 SPN and FMI definitions, combined into plain-English meanings',
      'EmersonEIMS Repair Centre articles, reviewed by our engineers',
    ],
    next: { label: 'Ask an engineer about a fault', href: '/contact?type=engineer' },
  },
  {
    id: 'solar-genius-pro',
    name: 'Solar Genius Pro',
    icon: '☀️',
    link: '/solar-genius-pro',
    oneLine: 'A first estimate of the solar system you need, from your own consumption.',
    does: [
      'Sizes panels, inverter and battery from your monthly kWh and the backup you want',
      'Uses NASA POWER sun-hours for your location',
      'Gives a first cost, yearly energy, saving and payback, using your tariff',
      'Inverter and battery fault-code library, with the manual each code comes from',
    ],
    doesNot: [
      'Produce a bankable or tender-ready design — a site survey does that',
      'Analyse your roof from satellite images',
      'Use generative AI',
      'Replace a quotation: prices are typical Kenyan ranges, not an offer',
    ],
    data: [
      'NASA POWER solar irradiance (sun-hours) for the chosen location',
      'Your consumption and tariff figures',
      'Typical Kenyan equipment prices, stated as ranges',
    ],
    next: { label: 'Book a solar site survey', href: '/booking?type=site-survey' },
  },
  {
    id: 'aquascan-pro',
    name: 'AquaScan Pro',
    icon: '💧',
    link: '/aquascan-pro-v3',
    oneLine: 'A desktop first look at a borehole site, before you pay for a field survey.',
    does: [
      'Pulls long-term rainfall, temperature and soil data for the site',
      'Shows mapped water points and Kenyan borehole records nearby',
      'Gives a rough depth range and a drilling-cost band, with every source named',
      'States plainly that it is a pre-screen and that a survey decides where to drill',
    ],
    doesNot: [
      'Tell you exactly where or how deep to drill — a geophysical survey and a licensed hydrogeologist do',
      'Measure water quality — it shows the risks to test for',
      'Use deep-learning models or generative AI',
      'Replace Water Resources Authority permits',
    ],
    data: [
      'NASA POWER climate data, ISRIC SoilGrids and SRTM terrain',
      'Water Point Data Exchange and OpenStreetMap water points',
      'Published Kenyan borehole records, where they exist for the area',
    ],
    next: { label: 'Book a site visit', href: '/booking?type=site-survey' },
  },
  {
    id: 'building-suite',
    name: 'Building Suite',
    icon: '🏗️',
    link: '/solutions/building',
    oneLine: 'Engineering reference calculators for building work, each checked by hand.',
    does: [
      'Wind pressure, steel bolt shear, reinforced-concrete beam bending and rational-method runoff',
      'Bearing capacity of a shallow footing, building U-values, daylight factor and room acoustics',
      'Uses every input you type, and tells you when an input is missing instead of assuming one',
    ],
    doesNot: [
      'Produce architectural drawings, BIM models or a bill of quantities',
      'Price a project or design electrical, plumbing or HVAC systems',
      'Replace a registered engineer\'s design and sign-off',
    ],
    data: [
      'Published engineering formulas (Eurocode and ASCE methods, named on each calculator)',
      'Your inputs only — no stored project data',
    ],
    next: { label: 'Talk to an engineer about your project', href: '/contact?type=engineer' },
  },
];

export default function ToolCapabilitiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white">
      <section className="px-4 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">
            What Each Tool Can <span className="text-amber-400">— and Cannot —</span> Do
          </h1>
          <p className="text-lg text-slate-300">
            Our four free engineering tools, described plainly: what each one does, what it does not do, the data
            behind it, and where one of our engineers takes over.
          </p>
        </div>
      </section>

      <nav aria-label="Tools on this page" className="px-4 pb-8">
        <ul className="max-w-4xl mx-auto flex flex-wrap justify-center gap-2">
          {TOOLS.map((t) => (
            <li key={t.id}>
              <a href={`#${t.id}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/50 text-sm">
                <span aria-hidden>{t.icon}</span> {t.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-4 pb-20 space-y-10 max-w-5xl mx-auto">
        {TOOLS.map((t) => (
          <section key={t.id} id={t.id} className="scroll-mt-24 rounded-2xl border border-white/10 bg-slate-900/60 p-5 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span aria-hidden>{t.icon}</span> {t.name}
                </h2>
                <p className="text-slate-300 mt-2">{t.oneLine}</p>
              </div>
              <Link href={t.link} className="px-5 py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400">
                Open {t.name} →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-3">What it does</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  {t.does.map((x) => (
                    <li key={x} className="flex gap-2"><span className="text-emerald-400" aria-hidden>✓</span><span>{x}</span></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-3">What it does not do</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  {t.doesNot.map((x) => (
                    <li key={x} className="flex gap-2"><span className="text-amber-400" aria-hidden>✕</span><span>{x}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 grid md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-3">Data behind it</h3>
                <ul className="space-y-1 text-sm text-slate-400 list-disc pl-5">
                  {t.data.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </div>
              <div className="flex md:justify-end items-end">
                <Link href={t.next.href} className="text-green-400 font-semibold hover:text-green-300">
                  {t.next.label} →
                </Link>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
