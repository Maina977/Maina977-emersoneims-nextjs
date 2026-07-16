import type { Metadata } from 'next';
import Link from 'next/link';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';
const URL = `${SITE}/aquascan-pro-v3/methodology`;

export const revalidate = 600;

export const metadata: Metadata = {
  title: 'AquaScan Pro Methodology & Validation — How Every Report Is Built and Verified | EmersonEIMS',
  description:
    'Full transparency on AquaScan Pro: the data sources, hydrogeological physics, 19-check consistency validator, three-score readiness architecture, scientific references, known limitations and the public validation ledger. No invented data — ever.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'AquaScan Pro — Methodology, Data Sources & Validation',
    description:
      'How AquaScan Pro builds a borehole pre-feasibility report: real registries, satellite physics, audit gates and honest limitations — published for anyone to inspect.',
    url: URL,
    type: 'article',
    siteName: 'EmersonEIMS',
  },
  robots: { index: true, follow: true },
};

const DATA_SOURCES: { family: string; sources: string; role: string }[] = [
  { family: 'Water-point registries', sources: 'WPDx (Water Point Data Exchange), OpenStreetMap, UNESCO IHP-WINS, USGS NWIS, owner-supplied WRA/county records', role: 'Real named water points (springs, wells, boreholes) within 50 km — the strongest desktop evidence in weathered basement terrain. No water point is ever invented.' },
  { family: 'Regional drilling statistics', sources: 'Compiled county drilling records (all 47 Kenya counties) + national statistics (RWSN, UNICEF WASH, BGS)', role: 'Drilled-depth bands, tested-yield ranges and success rates that anchor and bound every depth/yield estimate.' },
  { family: 'Climate & recharge', sources: 'NASA POWER, ERA5-Land, GLDAS, multi-year precipitation series', role: 'Water-balance (banded Budyko) recharge model with quickflow separation — sustainable abstraction is capped by recharge.' },
  { family: 'Terrain & structure', sources: 'SRTM 30 m DEM (slope, aspect, TWI, drainage density), DEM lineament analysis', role: 'Topographic wetness and structural screening. Desktop lineaments are weighted LOW by design — published inter-analyst reproducibility is poor.' },
  { family: 'Satellite remote sensing', sources: 'MODIS NDVI (MOD13A2), Landsat multispectral, Sentinel-1 (proxy), GRACE-FO, SMAP/MERRA-2, thermal IR', role: '10-method fusion (Saaty AHP weights). Proxy-grade methods are LABELLED proxy and barred from making site-specific claims.' },
  { family: 'Soil & geology', sources: 'ISRIC SoilGrids v2.0, rock classification, Kenya hydrogeological province priors (5 provinces, literature-banded)', role: 'Infiltration, aquifer setting and the province prior that keeps every estimate inside published literature ranges.' },
  { family: 'Water-quality screening', sources: 'Regional hydrogeochemistry + WHO 2011 guideline comparison', role: 'MODELLED screening only — every report states that an ISO 17025 laboratory analysis is the only proof.' },
];

const REFERENCES: string[] = [
  'MacDonald A.M., Bonsor H.C., Dochartaigh B.É.Ó., Taylor R.G. (2012). Quantitative maps of groundwater resources in Africa. Environmental Research Letters 7(2).',
  'MacDonald A.M., Davies J., Calow R.C., Chilton P.J. (2005). Developing Groundwater: A Guide for Rural Water Supply. ITDG Publishing.',
  'Driscoll F.G. (1986). Groundwater and Wells, 2nd ed. Johnson Filtration Systems. (Usable drawdown ≤ ⅔ of saturated thickness in unconfined aquifers.)',
  'Theis C.V. (1935). The relation between the lowering of the piezometric surface and the rate and duration of discharge of a well using ground-water storage. Trans. AGU 16.',
  'Cooper H.H., Jacob C.E. (1946). A generalized graphical method for evaluating formation constants. Trans. AGU 27.',
  'Budyko M.I. (1974). Climate and Life. Academic Press. (Water-balance recharge banding, Fu-parameterised.)',
  'WHO (2011, 4th ed. + addenda). Guidelines for Drinking-water Quality.',
  'Saaty T.L. (1980). The Analytic Hierarchy Process. (Multi-sensor weighted-overlay fusion weights.)',
  'RWSN / UNICEF (2016+). Guidance on professional borehole siting and supervision.',
  'Kenya Water Resources Regulations (2021) — statutory hydrogeological survey and WRA authorisation requirements.',
];

export default function AquaScanMethodologyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-4xl px-6 py-16">
        {/* ── HERO ── */}
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">AquaScan Pro — Transparency Charter</p>
        <h1 className="mt-3 text-4xl font-extrabold text-white">
          Methodology, Data Sources &amp; Validation
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-300">
          AquaScan Pro is a new class of tool, so we do not ask for blind trust — we publish exactly how every
          report is built, what it can and cannot claim, and how its predictions are being validated against real
          drilled boreholes. This page is the standing reference for customers, hydrogeologists, drillers and
          financiers who want to check our work.
        </p>

        {/* ── WHAT IT IS / IS NOT ── */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white">What AquaScan Pro is — and is not</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-emerald-800 bg-emerald-950/40 p-5">
              <h3 className="font-bold text-emerald-400">It IS</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                <li>A desktop pre-feasibility screening — the evidence-gathering stage a competent hydrogeologist performs before any site visit, automated and priced honestly.</li>
                <li>A fusion of real registries, satellite physics and published regional drilling statistics into one audited report.</li>
                <li>A filter that catches siting-stage errors (wrong geology, no offset evidence, dry-well clusters) before money is spent on fieldwork or drilling.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-rose-800 bg-rose-950/40 p-5">
              <h3 className="font-bold text-rose-400">It is NOT</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                <li>NOT a statutory hydrogeological survey, and never sold as one — Kenya law requires a licensed survey and WRA authorisation before drilling.</li>
                <li>NOT authority to mobilise a drilling rig. No AquaScan score, however high, releases the mobilisation gate without field ERT, a survey-grade peg, professional sign-off and WRA approval.</li>
                <li>NOT a measurement of your site — depths, yields and water quality are calibrated estimates until field validation, and every estimated figure is marked “(est.)”.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── THREE SCORES ── */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white">The three-score architecture</h2>
          <p className="mt-3 text-slate-300">
            Most siting reports blur “how good is this target” with “are you allowed to drill”. AquaScan separates
            them so each question gets an honest answer:
          </p>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <span className="font-bold text-cyan-400">DDTR — Desktop Pre-Feasibility Readiness (0–95).</span>{' '}
              <span className="text-sm text-slate-300">How complete and convergent the desktop evidence stack is. Hard-capped at 95: desktop evidence alone can never reach 100 — the final points belong to fieldwork.</span>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <span className="font-bold text-amber-400">FRR — Field &amp; Regulatory Readiness (0–100).</span>{' '}
              <span className="text-sm text-slate-300">Ten gates only a site visit can close: reconnaissance, survey-grade peg, field ERT/VES, hydrogeologist sign-off, WRA authorisation, pump test, laboratory analysis.</span>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <span className="font-bold text-rose-400">MAG — Mobilisation Authorisation Gate.</span>{' '}
              <span className="text-sm text-slate-300">BLOCKED → CONDITIONALLY RELEASED (field confirmation only) → RELEASED FOR DRILLING. A high desktop score never auto-releases this gate.</span>
            </div>
          </div>
        </section>

        {/* ── DATA SOURCES ── */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white">Every evidence family, and where it comes from</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-900 text-slate-100">
                <tr>
                  <th className="px-4 py-3 font-semibold">Evidence family</th>
                  <th className="px-4 py-3 font-semibold">Sources</th>
                  <th className="px-4 py-3 font-semibold">Role in the report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {DATA_SOURCES.map((d) => (
                  <tr key={d.family} className="bg-slate-950/60">
                    <td className="px-4 py-3 font-medium text-cyan-300">{d.family}</td>
                    <td className="px-4 py-3 text-slate-300">{d.sources}</td>
                    <td className="px-4 py-3 text-slate-400">{d.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-400">
            Every report carries a full data-provenance annex naming the source of each governing value. Where a
            source did not return data, the report says so — a gap is reported as a gap, never filled with an
            invented number.
          </p>
        </section>

        {/* ── INTEGRITY ARCHITECTURE ── */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white">The integrity architecture — why you can trust the numbers</h2>
          <ul className="mt-4 space-y-3 text-slate-300">
            <li className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm">
              <span className="font-bold text-white">One governing value.</span> Yield, depth and probability are reconciled once
              — through aquifer physics bounded by the region&apos;s published tested-yield band — and every page of the
              report is stamped from that single result. Sub-model outputs appear only in a labelled diagnostic annex.
            </li>
            <li className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm">
              <span className="font-bold text-white">A 19-check consistency validator that can block its own product.</span> Before
              export, every report passes 19 automated audits (range containment, cross-engine reconciliation,
              water-point arithmetic, grade gating). If a check fails, the report refuses to export — customers have
              seen this happen, because it is real.
            </li>
            <li className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm">
              <span className="font-bold text-white">No invented data — enforced in code.</span> No synthetic wells, no fabricated
              satellite scenes, no “ground is stable” claims from proxy data, no drilled-outcome credit for estimated
              records. Estimated values are marked “(est.)” wherever they appear.
            </li>
            <li className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm">
              <span className="font-bold text-white">149 automated verification assertions</span> run against the physics and
              scoring engines on every change — Theis drawdown limits (Driscoll ⅔ rule), Budyko recharge banding,
              consensus-tracks-governing, county-record lookup, score discrimination (a data-poor site scores &lt;40;
              no participation trophies).
            </li>
            <li className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm">
              <span className="font-bold text-white">An integrity fingerprint on every PDF.</span> Each report prints a fingerprint
              computed from its governing values and generation time. If a figure in a circulated copy has been
              altered, the fingerprint no longer matches — ask us to verify any AquaScan report you are shown.
            </li>
          </ul>
        </section>

        {/* ── VALIDATION LEDGER ── */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white">Validation ledger — our track record, published honestly</h2>
          <p className="mt-3 text-slate-300">
            AquaScan Pro is a new tool. Rather than pretend otherwise, we publish the state of its validation and
            update this ledger as drilled outcomes come in:
          </p>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-emerald-800 bg-emerald-950/30 p-4 text-sm text-slate-300">
              <span className="font-bold text-emerald-400">Measured benchmark (northern Kenya):</span> against real drilled
              boreholes in validated counties, the modelled depth fell within the drilled band ~40% of the time — and
              the reports say exactly that, including that yield could not be reliably predicted without a pump test.
              This benchmark is cited inside every report generated in its coverage area.
            </div>
            <div className="rounded-lg border border-amber-800 bg-amber-950/30 p-4 text-sm text-slate-300">
              <span className="font-bold text-amber-400">Prediction-vs-outcome register: collecting.</span> Every borehole drilled
              off an AquaScan report — with the owner&apos;s consent — will have its predicted vs actual depth, yield and
              outcome published here, successes and failures alike. No cherry-picking: the register is append-only.
            </div>
            <div className="rounded-lg border border-cyan-800 bg-cyan-950/30 p-4 text-sm text-slate-300">
              <span className="font-bold text-cyan-400">Founding pilot programme:</span> the first drilling clients who share their
              WRA completion records (drill log, pump test, lab certificate) receive priority engineering support from
              EmersonEIMS — and calibrate the tool for everyone who comes after them.{' '}
              <Link href="/contact" className="font-semibold text-cyan-300 underline">Join the pilot →</Link>
            </div>
          </div>
        </section>

        {/* ── LIMITATIONS ── */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white">Known limitations — stated plainly</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-slate-300">
            <li>No satellite can see individual fractures. In basement terrain the difference between a disappointing and an excellent borehole is often a single fracture zone that only field ERT/VES resolves — this is physics, not a software limit.</li>
            <li>Registry water points prove groundwater occurrence, but most registries do not publish true drilled depths. Depth/yield calibration is registry- and literature-based until WRA completion records are ingested.</li>
            <li>Modelled water quality is a screening, not a test. Only an ISO 17025 laboratory analysis proves potability.</li>
            <li>A strong desktop score is not a wet borehole. A 64% success probability means roughly one site in three still disappoints — the report states its uncertainty ranges for exactly this reason.</li>
          </ul>
        </section>

        {/* ── REFERENCES ── */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white">Scientific references</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm text-slate-400">
            {REFERENCES.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
        </section>

        {/* ── CTA ── */}
        <section className="mt-14 rounded-2xl border border-cyan-800 bg-cyan-950/30 p-8 text-center">
          <h2 className="text-2xl font-bold text-white">Check our work</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">
            Run a site, read the audit trail, challenge a number. If you are a licensed hydrogeologist, we invite you
            to review this methodology — credited reviewers are acknowledged here.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/aquascan-pro-v3" className="rounded-lg bg-cyan-500 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-400">
              Open AquaScan Pro
            </Link>
            <Link href="/contact" className="rounded-lg border border-cyan-500 px-6 py-3 font-bold text-cyan-300 hover:bg-cyan-950">
              Talk to an engineer
            </Link>
          </div>
        </section>

        <p className="mt-10 text-center text-xs text-slate-500">
          EmersonEIMS · AquaScan Pro Transparency Charter · This page is updated whenever the methodology changes.
        </p>
      </div>
    </main>
  );
}
