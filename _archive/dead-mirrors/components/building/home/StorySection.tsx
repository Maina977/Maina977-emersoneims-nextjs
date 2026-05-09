import Link from 'next/link';

export default function StorySection() {
  return (
    <section className="eims-section">
      <div className="eims-shell">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            <p className="eims-kicker">
              Built for mission-critical uptime
            </p>
            <h2 className="mt-5 text-balance text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
              Power that feels invisible—because it never fails.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/75 max-w-2xl">
              Emerson EiMS designs, installs, and maintains power systems for sites that can’t go down.
              Generators, solar hybrid systems, and diagnostics—engineered to perform under real-world conditions.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="eims-card eims-card-hover p-6 lg:p-7">
              <h3 className="text-sm font-medium text-white">Fast, decisive next steps</h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                No long forms. No clutter. Two ways to move.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href="/contact#assessment"
                  className="inline-flex items-center justify-center rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold tracking-wide hover:bg-white/90 transition"
                >
                  Request Site Assessment
                </Link>
                <Link
                  href="/contact#technical"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-transparent text-white px-5 py-3 text-sm font-semibold tracking-wide hover:bg-white/10 transition"
                >
                  Speak to Technical Team
                </Link>
              </div>
              <p className="mt-5 text-xs text-white/50">
                Typical response time: same business day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
