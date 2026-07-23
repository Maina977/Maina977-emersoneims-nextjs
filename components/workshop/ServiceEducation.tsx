/**
 * ServiceEducation — renders the verified image gallery and the comprehensive
 * technical guide for one workshop service.
 *
 * The deep technical content sits inside a <details> element: it is fully in
 * the server-rendered DOM (so crawlers and AI assistants read every word, and
 * a lecturer or technician can expand it), while keeping the page scannable for
 * a client who only wants the summary. Content and images come from
 * lib/workshop/workshopEducation.ts, where every image was visually verified.
 */
import Image from 'next/image';
import { getEducation } from '@/lib/workshop/workshopEducation';

export default function ServiceEducation({ serviceId }: { serviceId: string }) {
  const edu = getEducation(serviceId);
  if (!edu) return null;

  return (
    <div className="mt-6">
      {/* Verified photo gallery */}
      {edu.images.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {edu.images.map((img, i) => (
            <figure
              key={img.src}
              className="overflow-hidden rounded-xl border border-slate-700/70 bg-slate-900/40"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={1200}
                height={800}
                quality={85}
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                className="h-48 w-full object-cover"
                // First image of the first few services can afford eager decode;
                // everything here is below the fold so lazy is correct.
                priority={false}
                {...(i === 0 ? {} : {})}
              />
            </figure>
          ))}
        </div>
      )}

      {/* What it is — always visible, short and plain */}
      <div className="mt-6 rounded-xl border border-slate-700/60 bg-slate-950/40 p-5">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
          Understanding it
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">{edu.whatItIs}</p>
      </div>

      {/* Full technical guide — expandable, fully in the DOM */}
      <details className="group mt-4 rounded-xl border border-slate-700/60 bg-slate-900/40">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 marker:hidden">
          <span className="font-semibold text-white">
            Full technical guide — causes, repair, parts &amp; prevention
          </span>
          <span
            aria-hidden="true"
            className="shrink-0 text-amber-400 transition-transform group-open:rotate-45"
          >
            +
          </span>
        </summary>

        <div className="space-y-6 border-t border-slate-800 p-5">
          {/* Causes */}
          <section>
            <h5 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
              Why it fails — common causes
            </h5>
            <dl className="mt-3 space-y-3">
              {edu.causes.map((c) => (
                <div key={c.title} className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
                  <dt className="text-sm font-semibold text-slate-200">{c.title}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-slate-400">{c.detail}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Repair steps */}
            <section>
              <h5 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                How we repair it
              </h5>
              <ol className="mt-3 space-y-2">
                {edu.repairSteps.map((step, i) => (
                  <li key={step} className="flex gap-3 text-sm leading-relaxed text-slate-300">
                    <span className="shrink-0 font-mono text-amber-400/80">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Testing */}
            <section>
              <h5 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                How we test it before handover
              </h5>
              <ul className="mt-3 space-y-2">
                {edu.testing.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm leading-relaxed text-slate-300">
                    <span aria-hidden="true" className="mt-1 text-emerald-400">✓</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Parts */}
            <section>
              <h5 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                Parts &amp; materials used
              </h5>
              <ul className="mt-3 flex flex-wrap gap-2">
                {edu.parts.map((p) => (
                  <li
                    key={p}
                    className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-1.5 text-sm text-slate-300"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </section>

            {/* Prevention */}
            <section>
              <h5 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                How to prevent it happening again
              </h5>
              <ul className="mt-3 space-y-2">
                {edu.prevention.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm leading-relaxed text-slate-300">
                    <span aria-hidden="true" className="mt-1 text-amber-400">→</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </details>
    </div>
  );
}
