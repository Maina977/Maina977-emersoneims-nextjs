import Link from 'next/link';
import type { RepairArticle } from '@/lib/repair-centre/types';
import { CONTACT, getWhatsAppUrl, getTelUrl } from '@/lib/constants/contact';

/**
 * Server component. Every section renders into the initial HTML so the whole
 * article is readable without JavaScript and fully crawlable. Nothing is hidden
 * behind tabs.
 */

function Section({ id, n, title, children }: { id: string; n: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-baseline gap-3">
        <span className="text-cyan-500 text-base font-mono shrink-0">{n}</span>
        <span>{title}</span>
      </h2>
      {children}
    </section>
  );
}

function Bullets({ items, tone = 'slate' }: { items: string[]; tone?: 'slate' | 'amber' | 'red' }) {
  if (!items?.length) return null;
  const mark = tone === 'red' ? 'text-red-400' : tone === 'amber' ? 'text-amber-400' : 'text-cyan-400';
  return (
    <ul className="space-y-2 text-slate-300">
      {items.map((t, i) => (
        <li key={i} className="flex gap-3">
          <span className={`${mark} mt-1.5 shrink-0`} aria-hidden="true">▪</span>
          <span className="leading-relaxed">{t}</span>
        </li>
      ))}
    </ul>
  );
}

function CauseBlock({ label, items, weight }: { label: string; items: string[]; weight: string }) {
  if (!items?.length) return null;
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-lg font-bold text-white">{label}</h3>
        <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-slate-600 text-slate-400">{weight}</span>
      </div>
      <Bullets items={items} />
    </div>
  );
}

export default function RepairArticleView({ article }: { article: RepairArticle }) {
  const h = article.header;
  const wa = getWhatsAppUrl(CONTACT.PRIMARY_WHATSAPP, `Fault diagnosis enquiry — ${h.title}`);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-slate-400 mb-6">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-cyan-400">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/repair-centre" className="hover:text-cyan-400">Repair Centre</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href={`/repair-centre/${article.hub}`} className="hover:text-cyan-400 capitalize">{article.hub}</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-slate-300" aria-current="page">{h.title}</li>
        </ol>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-semibold mb-2">{h.equipmentCategory}</p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">{h.title}</h1>

        <dl className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm">
          {[
            ['Applies to', h.appliesTo],
            ['Difficulty', h.difficulty],
            ['Competence required', h.competence.replace(/-/g, ' ')],
            ['Diagnosis complexity', h.diagnosisComplexity],
            ['Electrical system', h.electricalSystem],
            ['Safety classification', h.safetyClass.replace(/-/g, ' ')],
            ['Author', h.author],
            ['Technical reviewer', h.technicalReviewer],
            ['Last reviewed', h.lastReviewed],
          ].map(([k, v]) => (
            <div key={k as string}>
              <dt className="text-slate-500">{k}</dt>
              <dd className="text-slate-300">{v}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* Direct technical answer */}
      <div className="rounded-2xl border border-cyan-500/40 bg-cyan-500/5 p-6 mb-12">
        <h2 className="text-lg font-bold text-cyan-300 mb-3">Direct technical answer</h2>
        <p className="text-slate-200 leading-relaxed">{article.directAnswer}</p>
      </div>

      <Section id="symptoms" n="01" title="Symptom description">
        <div className="grid sm:grid-cols-2 gap-5">
          {([
            ['Controller / display', article.symptoms.display],
            ['Indicators', article.symptoms.indicators],
            ['Sounds', article.symptoms.sounds],
            ['Smells', article.symptoms.smells],
            ['Behaviour', article.symptoms.behaviour],
            ['Visible', article.symptoms.visible],
          ] as [string, string[]][]).filter(([, v]) => v?.length).map(([label, items]) => (
            <div key={label} className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
              <h3 className="text-base font-bold text-white mb-3">{label}</h3>
              <Bullets items={items} />
            </div>
          ))}
        </div>
      </Section>

      <Section id="meaning" n="02" title="What the fault means">
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
            <h3 className="text-base font-bold text-white mb-2">In plain language</h3>
            <p className="text-slate-300 leading-relaxed">{article.whatItMeans.plain}</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
            <h3 className="text-base font-bold text-white mb-2">Technical explanation</h3>
            <p className="text-slate-300 leading-relaxed">{article.whatItMeans.technical}</p>
          </div>
        </div>
      </Section>

      <Section id="causes" n="03" title="Common causes, ranked">
        <p className="text-slate-400 mb-5">
          These are ordered by likelihood. Presenting every possible cause as equally probable is a failure of diagnosis, not thoroughness.
        </p>
        <div className="space-y-4">
          <CauseBlock label="Most likely" items={article.causes.mostLikely} weight="start here" />
          <CauseBlock label="Possible" items={article.causes.possible} weight="check next" />
          <CauseBlock label="Less common" items={article.causes.lessCommon} weight="after the above" />
          <CauseBlock label="Model specific" items={article.causes.modelSpecific} weight="verify per unit" />
          <CauseBlock label="Environmental" items={article.causes.environmental} weight="site conditions" />
          <CauseBlock label="Installation related" items={article.causes.installation} weight="built in" />
          <CauseBlock label="Maintenance related" items={article.causes.maintenance} weight="deferred work" />
          <CauseBlock label="Component level" items={article.causes.componentLevel} weight="electronics" />
        </div>
      </Section>

      <Section id="safety" n="04" title="Safety requirements">
        <div className="rounded-2xl border border-red-500/40 bg-red-500/5 p-6 space-y-5">
          {([
            ['Isolation', article.safety.isolation],
            ['Lockout and tagout', article.safety.lockoutTagout],
            ['PPE', article.safety.ppe],
            ['Stored energy', article.safety.storedEnergy],
            ['Specific hazards', article.safety.specificHazards],
          ] as [string, string[]][]).filter(([, v]) => v?.length).map(([label, items]) => (
            <div key={label}>
              <h3 className="text-base font-bold text-red-300 mb-2">{label}</h3>
              <Bullets items={items} tone="red" />
            </div>
          ))}
          <div className="pt-4 border-t border-red-500/30">
            <h3 className="text-base font-bold text-red-300 mb-2">Stop and call a qualified professional if</h3>
            <Bullets items={article.safety.stopAndCallProfessional} tone="red" />
          </div>
        </div>
      </Section>

      <Section id="tools" n="05" title="Tools required">
        <div className="overflow-x-auto rounded-xl border border-slate-700">
          <table className="w-full text-sm">
            <caption className="sr-only">Tools required and the reason each is needed</caption>
            <thead className="bg-slate-900 text-slate-400 text-left">
              <tr><th scope="col" className="px-4 py-3">Tool</th><th scope="col" className="px-4 py-3">Why it is needed</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {article.tools.map((t, i) => (
                <tr key={i} className="bg-slate-900/40 align-top">
                  <td className="px-4 py-3 text-slate-200 font-medium whitespace-nowrap">{t.tool}</td>
                  <td className="px-4 py-3 text-slate-400">{t.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="decision-tree" n="06" title="Diagnostic decision tree">
        <ol className="space-y-3">
          {article.decisionTree.map((d, i) => (
            <li key={i} className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
              <p className="text-white font-semibold mb-3">{i + 1}. {d.question}</p>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <p className="text-emerald-300"><span className="font-bold">Yes →</span> {d.yes}</p>
                <p className="text-amber-300"><span className="font-bold">No →</span> {d.no}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="diagnosis" n="07" title="Step-by-step diagnosis">
        <div className="space-y-5">
          {article.diagnosis.map(s => (
            <div key={s.step} className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
              <h3 className="text-lg font-bold text-white mb-4">
                <span className="text-cyan-400 font-mono mr-2">Step {s.step}</span>{s.title}
              </h3>
              <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div><dt className="text-slate-500">Inspect</dt><dd className="text-slate-300">{s.inspect}</dd></div>
                <div><dt className="text-slate-500">Where</dt><dd className="text-slate-300">{s.where}</dd></div>
                <div><dt className="text-slate-500">Instrument</dt><dd className="text-slate-300">{s.instrument}</dd></div>
                <div><dt className="text-slate-500">Expected result</dt><dd className="text-emerald-300">{s.expected}</dd></div>
                <div className="sm:col-span-2"><dt className="text-slate-500">If the result is abnormal</dt><dd className="text-slate-300">{s.ifAbnormal}</dd></div>
                <div className="sm:col-span-2"><dt className="text-slate-500">Next</dt><dd className="text-cyan-300">{s.next}</dd></div>
              </dl>
              {s.verify && (
                <p className="mt-4 text-sm rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 text-amber-200">
                  <span className="font-bold">Verify for your unit: </span>{s.verify}
                </p>
              )}
              {s.warning && (
                <p className="mt-3 text-sm rounded-lg border border-red-500/40 bg-red-500/5 p-3 text-red-200">
                  <span className="font-bold">Safety: </span>{s.warning}
                </p>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section id="repair" n="08" title="Repair procedure">
        <div className="space-y-4">
          {article.repair.map((r, i) => (
            <div key={i} className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-lg font-bold text-white">{r.title}</h3>
                <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-slate-600 text-slate-400">
                  {r.level.replace(/-/g, ' ')}
                </span>
              </div>
              <Bullets items={r.steps} />
              {r.note && <p className="mt-3 text-sm text-slate-400 italic">{r.note}</p>}
            </div>
          ))}
        </div>
      </Section>

      <Section id="validation" n="09" title="Post-repair validation">
        <Bullets items={article.validation} tone="amber" />
      </Section>

      <Section id="when-not-to-repair" n="10" title="When not to repair">
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5">
          <Bullets items={article.whenNotToRepair} tone="amber" />
        </div>
      </Section>

      <Section id="prevention" n="11" title="Prevention">
        <Bullets items={article.prevention} />
      </Section>

      {article.faq?.length > 0 && (
        <Section id="faq" n="12" title="Questions engineers actually ask">
          <div className="space-y-4">
            {article.faq.map((f, i) => (
              <div key={i} className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
                <h3 className="text-base font-bold text-white mb-2">{f.q}</h3>
                <p className="text-slate-300 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      <section id="references" className="mb-12">
        <h2 className="text-xl font-bold text-white mb-3">Standards and references</h2>
        <Bullets items={article.references} />
        <p className="mt-4 text-sm text-slate-500">
          This guidance is written from engineering principle and is not a substitute for the manufacturer&apos;s
          model-specific documentation. Where a figure is model-specific, confirm it against the service data for your
          unit before acting on it.
        </p>
      </section>

      {/* Professional assistance */}
      <section id="professional-help" className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-white mb-3">Need this diagnosed properly?</h2>
        <p className="text-slate-300 mb-6">
          Send us the make, model and any fault codes shown, and photographs of the controller display if you have them.
          Our mobile workshop covers all 47 counties.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href={getTelUrl(CONTACT.PRIMARY_PHONE_INTL)} className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-center">
            Call {CONTACT.PRIMARY_PHONE}
          </a>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-center">
            WhatsApp the fault details
          </a>
          <Link href="/contact" className="px-6 py-3 rounded-lg border border-slate-600 text-slate-200 font-semibold text-center hover:border-cyan-500">
            Request a site inspection
          </Link>
        </div>
      </section>

      {article.relatedSlugs?.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-white mb-4">Related diagnosis guides</h2>
          <ul className="space-y-2">
            {article.relatedSlugs.map(s => (
              <li key={s}>
                <Link href={`/repair-centre/${article.hub}/${s}`} className="text-cyan-400 hover:text-cyan-300 underline-offset-4 hover:underline">
                  {s.replace(/-/g, ' ')}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
