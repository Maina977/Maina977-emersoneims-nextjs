import Image from 'next/image';
import Link from 'next/link';
import { RECENT_PROJECTS } from '@/lib/projects/recentWork';

/**
 * Recent work — photographed proof of jobs actually done.
 *
 * WHY IT IS HERE
 * The homepage asserted capability in a dozen places and evidenced it nowhere.
 * A buyer weighing a KES 2,000,000 machine discounts adjectives; a changeover
 * panel wired at U/V/W/N, or a burnt interface board on a bench, reads as real.
 * This sits directly after the testimonials so a claim and its evidence appear
 * together.
 *
 * IMAGE-LED, NOT TEXT-LED (rebuilt 2026-08-26 on the owner's brief for large,
 * cinematic presentation). Each project opens on a full-width frame at 21:9,
 * with the client and title set over a gradient, then the detail shots below at
 * a size where a PCB is actually readable. The earlier version filed the
 * photographs into a sidebar grid, which wasted the only genuine proof on the
 * page.
 *
 * `sizes` is declared honestly per slot — the hero really does occupy the full
 * viewport width, so telling Next otherwise would have it serve an image too
 * small and soft on a large screen. The Kilifi sources are 2313x3072, so there
 * is real resolution to draw on; the Migori sources arrived via WhatsApp at
 * 1.5MP and cannot go larger, which is why they take the wider crops where
 * softness is least visible.
 *
 * SERVER-RENDERED: proof a crawler cannot see never reaches anyone searching.
 */
export default function RecentWorkSection() {
  return (
    <section
      aria-labelledby="recent-work-heading"
      className="relative bg-black py-20 lg:py-32"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        <p className="text-xs uppercase tracking-[0.24em] text-white/50">
          Recent work · August 2026
        </p>
        <h2
          id="recent-work-heading"
          className="mt-4 text-balance text-4xl font-semibold tracking-tight text-white lg:text-6xl"
        >
          Two jobs from this month
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
          Photographs from our own sites and bench &mdash; the machines, panels and
          boards we actually worked on, for clients who agreed to be named.
        </p>
      </div>

      <div className="mt-16 space-y-24 lg:mt-24 lg:space-y-36">
        {RECENT_PROJECTS.map((project) => {
          const [hero, ...rest] = project.photos;
          return (
            <article key={project.slug}>
              {/* Full-width hero frame */}
              <div className="relative w-full overflow-hidden">
                <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
                  <Image
                    src={hero.src}
                    alt={hero.alt}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={false}
                  />
                  {/* Gradient so the type stays legible over any frame */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0">
                    <div className="mx-auto max-w-[1600px] px-6 pb-8 lg:px-12 lg:pb-14">
                      <p className="text-xs uppercase tracking-[0.2em] text-amber-400">
                        {project.location} &middot; {project.period}
                      </p>
                      <h3 className="mt-3 max-w-4xl text-balance text-2xl font-semibold leading-tight text-white lg:text-5xl">
                        {project.title}
                      </h3>
                      {project.client && (
                        <p className="mt-4 text-base text-white/80 lg:text-lg">
                          Client:{' '}
                          <span className="font-semibold text-white">{project.client}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <p className="mx-auto max-w-[1600px] px-6 pt-3 text-xs text-white/45 lg:px-12">
                  {hero.caption}
                </p>
              </div>

              <div className="mx-auto mt-12 max-w-[1600px] px-6 lg:mt-16 lg:px-12">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
                  {/* What was done */}
                  <div>
                    <p className="text-lg leading-relaxed text-white/70">{project.summary}</p>
                    <ul className="mt-8 space-y-4">
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
                      className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-amber-400 transition hover:text-amber-300"
                    >
                      {project.service}
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>

                  {/* Detail frames, large enough to read a board */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    {rest.map((photo, i) => (
                      <figure
                        key={photo.src}
                        className={`overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] ${
                          i === 0 ? 'sm:col-span-2' : ''
                        }`}
                      >
                        <div className={`relative bg-black/40 ${i === 0 ? 'aspect-[16/10]' : 'aspect-[3/4]'}`}>
                          <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            sizes={
                              i === 0
                                ? '(max-width: 1024px) 100vw, 55vw'
                                : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 28vw'
                            }
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
          );
        })}
      </div>

      <div className="mx-auto mt-20 max-w-[1600px] px-6 lg:px-12">
        <div className="flex flex-wrap gap-3 border-t border-white/10 pt-10">
          <Link
            href="/contact"
            className="rounded-full bg-amber-500 px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-amber-400"
          >
            Tell us about your site
          </Link>
          <Link
            href="/case-studies"
            className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white/80 transition hover:border-amber-400/40 hover:text-white"
          >
            More projects
          </Link>
        </div>
      </div>
    </section>
  );
}
