import Image from 'next/image';
import Link from 'next/link';
import { RECENT_PROJECTS } from '@/lib/projects/recentWork';

/**
 * Recent work — photographed proof of jobs actually done.
 *
 * WHY IT IS HERE
 * The homepage asserted capability in a dozen places and evidenced it nowhere.
 * A buyer weighing a KES 2,000,000 machine discounts adjectives; a photograph
 * of a changeover panel wired at U/V/W/N, or a burnt interface board on a
 * bench, is the thing that reads as real. This sits directly after the
 * testimonials so a claim and its evidence appear together.
 *
 * SERVER-RENDERED on purpose. Proof a crawler cannot see is proof that never
 * reaches anyone searching.
 *
 * The design deliberately borrows the page's existing language — dark ground,
 * white/10 hairlines, amber accent, eims-card — rather than introducing a new
 * one. This is an addition to the homepage, not a redesign of it.
 */
export default function RecentWorkSection() {
  return (
    <section
      aria-labelledby="recent-work-heading"
      className="relative bg-black py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <p className="text-xs uppercase tracking-[0.24em] text-white/50">
          Recent work · August 2026
        </p>
        <h2
          id="recent-work-heading"
          className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white lg:text-4xl"
        >
          Two jobs from this month
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60">
          Photographs from our own sites and bench. Not stock images, not
          renders &mdash; the machines, panels and boards we actually worked on.
        </p>

        <div className="mt-14 space-y-20">
          {RECENT_PROJECTS.map((project, index) => (
            <article key={project.slug}>
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
                {/* The story */}
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <p className="text-xs uppercase tracking-[0.18em] text-amber-400/80">
                    {project.location} &middot; {project.period}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold leading-snug text-white lg:text-2xl">
                    {project.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/65">
                    {project.summary}
                  </p>

                  <ul className="mt-6 space-y-3">
                    {project.work.map((step) => (
                      <li key={step} className="flex gap-3 text-sm leading-relaxed text-white/60">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400"
                        />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={project.serviceHref}
                    className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-amber-400 transition hover:text-amber-300"
                  >
                    {project.service}
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>

                {/* The evidence */}
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {project.photos.map((photo, i) => (
                      <figure
                        key={photo.src}
                        className={`eims-card overflow-hidden ${i === 0 ? 'sm:col-span-2' : ''}`}
                      >
                        <div
                          className={`relative bg-black/40 ${i === 0 ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}
                        >
                          <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                        <figcaption className="px-4 py-3 text-xs leading-relaxed text-white/55">
                          {photo.caption}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap gap-3 border-t border-white/10 pt-10">
          <Link
            href="/contact"
            className="rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-400"
          >
            Tell us about your site
          </Link>
          <Link
            href="/case-studies"
            className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-amber-400/40 hover:text-white"
          >
            More projects
          </Link>
        </div>
      </div>
    </section>
  );
}
