import Link from 'next/link';
import { CLIENT_TESTIMONIALS } from '@/lib/testimonials/clientTestimonials';

/**
 * CLIENT TESTIMONIALS — server-rendered, so they are actually crawlable.
 *
 * WHY THIS EXISTS
 * The site already held eight genuine, named client testimonials in
 * components/sections/TestimonialsSection.tsx — real people at real
 * institutions, several of which this site also documents photographically
 * (St Austins Academy 50kVA, Kivukoni School 60kVA, Bigot Flowers 300kVA all
 * appear in the homepage gallery). They were reaching nobody who mattered:
 *
 *   1. That component is a 'use client' carousel wrapped in LazyOnVisible, so
 *      it only mounts after a scroll event fires in a real browser. Checked
 *      against the live homepage as Googlebot: not one of the eight names
 *      appeared in the HTML.
 *   2. Even mounted, the carousel renders ONE testimonial at a time behind
 *      AnimatePresence, so seven of the eight would still never be in the DOM.
 *
 * The strongest trust signal the business owns was invisible to Google and to
 * the AI assistants that increasingly answer "who should I buy a generator
 * from in Kenya". This block puts all eight in the server HTML as plain
 * semantic markup — <blockquote> and <cite>, which is what the content
 * actually is — while the carousel above keeps doing the visual job.
 *
 * NOTHING HERE IS INVENTED. Every quote, name, company and project is copied
 * unchanged from the existing data, now lifted into
 * lib/testimonials/clientTestimonials.ts so the carousel and this block read
 * one source and cannot drift apart. No ratings are emitted as structured
 * data: schema.org review markup requires a verified corpus, and fabricated
 * review schema was removed from three files in this project for that reason.
 */
export default function ClientTestimonials() {
  return (
    <section
      aria-labelledby="client-testimonials-heading"
      className="border-t border-white/10 bg-black py-20 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        <p className="text-xs uppercase tracking-[0.24em] text-white/50">
          In their words
        </p>
        <h2
          id="client-testimonials-heading"
          className="mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-white lg:text-5xl"
        >
          What our clients say
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
          Schools, hospitals, farms and manufacturers across Kenya &mdash; named,
          with the job they hired us for.
        </p>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CLIENT_TESTIMONIALS.map((t) => (
            <li
              key={t.id}
              className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-7"
            >
              <blockquote className="flex-1 text-sm leading-relaxed text-white/75">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <footer className="mt-6 border-t border-white/10 pt-5">
                <cite className="not-italic">
                  <span className="block text-sm font-semibold text-white">{t.name}</span>
                  <span className="block text-xs text-white/55">
                    {t.role}, {t.company}
                  </span>
                </cite>
                <span className="mt-3 block text-xs font-medium uppercase tracking-wider text-amber-400">
                  {t.project}
                </span>
              </footer>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap gap-3 border-t border-white/10 pt-10">
          <Link
            href="/contact"
            className="rounded-full bg-amber-500 px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-amber-400"
          >
            Talk to us about your site
          </Link>
          <Link
            href="/case-studies"
            className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white/80 transition hover:border-amber-400/40 hover:text-white"
          >
            See the projects
          </Link>
        </div>
      </div>
    </section>
  );
}
