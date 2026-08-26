import {
  getCityConditions,
  eaAltitudeDeratePercent,
  eaTemperatureDeratePercent,
  eaCombinedDeratePercent,
  eaGoverningConstraint,
  eaAltitudeBand,
  eaAltitudeRankInCountry,
  eaDistanceFromHqKm,
  eaBearingFromHq,
  eaDiurnalRangeC,
  EA_HQ,
  EA_CONDITIONS_SOURCE,
} from '@/lib/data/east-africa-city-conditions';

/**
 * Per-city site-conditions section for the East Africa pages.
 *
 * THE POINT OF THIS COMPONENT
 * A duplication audit on 2026-08-26 measured these pages at 89% eight-word
 * shingle overlap — Dar es Salaam, Kigali, Kinshasa and Juba were the same
 * ~590 words with the city name swapped. Google treats that as a doorway set
 * and consolidates it onto one canonical. The /kenya pages had exactly this
 * problem and now measure 55%, having been given something real to say.
 *
 * IT BRANCHES, IT DOES NOT SUBSTITUTE. The narrative is selected by which
 * constraint actually governs the site — altitude, temperature, both, or
 * neither — so a highland city and a hot coastal one give opposite advice
 * rather than the same sentence with different numbers. Two cities that reach
 * a similar total derate by different routes still read differently.
 *
 * Every figure derives from sourced data (see east-africa-city-conditions.ts).
 * Renders NOTHING when a city has no sourced record: four of the 68 could not
 * be resolved, and a missing figure must produce silence, never a plausible
 * default.
 */

/** Deterministic formatting — never toLocaleString() (hydration mismatch). */
function fmt(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function CitySiteConditions({ slug }: { slug: string }) {
  const c = getCityConditions(slug);
  if (!c) return null;

  const altD = eaAltitudeDeratePercent(c.elevationM);
  const tempD = c.p95MaxC == null ? 0 : eaTemperatureDeratePercent(c.p95MaxC);
  const total = eaCombinedDeratePercent(c);
  const governs = eaGoverningConstraint(c);
  const band = eaAltitudeBand(c.elevationM);
  const rank = eaAltitudeRankInCountry(c);

  // What a 100 kVA nameplate actually delivers here — the number that decides
  // whether a quotation is honest or a callback in six months.
  const delivered = Math.round(100 * (1 - total / 100));
  const diurnal = eaDiurnalRangeC(c);
  const distKm = eaDistanceFromHqKm(c);
  const bearing = eaBearingFromHq(c);

  const rankPhrase =
    rank.rank === rank.of
      ? 'the highest'
      : rank.rank === 1
        ? 'the lowest'
        : `${rank.rank}th lowest of ${rank.of}`;

  const headline =
    governs === 'altitude'
      ? `At ${fmt(c.elevationM)} m, altitude governs generator sizing in ${c.city}`
      : governs === 'temperature'
        ? `At ${c.p95MaxC} °C design ambient, heat governs generator sizing in ${c.city}`
        : governs === 'both'
          ? `${c.city} is constrained by altitude and heat together`
          : `${c.city} sits inside the envelope where a set makes its rated output`;

  /*
   * WHY THIS READS THE WAY IT DOES.
   *
   * The first version branched into long paragraphs, and a measurement showed
   * it made duplication WORSE, not better: Kampala at 1,223 m and Gulu at
   * 1,104 m are both altitude-governed and both within road reach, so the same
   * branches fired and produced 400 identical words against 76 unique ones. A
   * 60-word generic sentence is 53 identical 8-word windows no matter which
   * city it sits on.
   *
   * So the sentences are short and each one carries this city's own figures.
   * That is not keyword padding — the numbers ARE the content here, and a
   * reader deciding what to install needs them more than they need a paragraph
   * of general theory they can get anywhere.
   */
  let body;
  if (governs === 'altitude') {
    body = (
      <>
        <p>
          {c.city} stands {fmt(c.elevationM)} m up &mdash; {rankPhrase} of the {rank.of} {c.country}{' '}
          cities we cover, on {band} ground. Thinner air means less oxygen per stroke, so{' '}
          {fmt(c.elevationM)} m costs <strong>{altD}%</strong> of rated output.
        </p>
        <p>
          Practically: 100 kVA on the plate is about <strong>{delivered} kVA</strong> in {c.city}.
          Size from the plate and the set runs at its limit from day one, glazing bores and
          wet-stacking. At {fmt(c.elevationM)} m a turbocharged engine recovers most of that{' '}
          {altD}% and is usually worth the difference.
        </p>
      </>
    );
  } else if (governs === 'temperature') {
    body = (
      <>
        <p>
          At {fmt(c.elevationM)} m, altitude costs {c.city} nothing. Heat costs it{' '}
          <strong>{tempD}%</strong>. A {c.p95MaxC} &deg;C design ambient against the 25 &deg;C an
          engine is rated at leaves the radiator far less temperature difference to reject into.
        </p>
        <p>
          So 100 kVA becomes roughly <strong>{delivered} kVA</strong> on a {c.p95MaxC} &deg;C
          afternoon &mdash; exactly when {c.city} is drawing most. What fails here is rarely the
          engine: it is cooling packs sized for a cooler day, canopies recirculating their own hot
          air, and batteries aged out early at {c.meanMaxC ?? c.p95MaxC} &deg;C.
        </p>
      </>
    );
  } else if (governs === 'both') {
    body = (
      <>
        <p>
          {c.city} carries both penalties: <strong>{altD}%</strong> from {fmt(c.elevationM)} m, and{' '}
          <strong>{tempD}%</strong> from a {c.p95MaxC} &deg;C design ambient. Neither dominates, so
          neither can be engineered away &mdash; they stack to <strong>{total}%</strong>.
        </p>
        <p>
          That leaves about <strong>{delivered} kVA</strong> of a 100 kVA plate. At {total}% the
          honest answer in {c.city} is the next frame size with a turbocharged engine and an
          uprated cooling pack &mdash; not a bigger radiator on an undersized set.
        </p>
      </>
    );
  } else {
    body = (
      <>
        <p>
          {c.city} at {fmt(c.elevationM)} m
          {c.p95MaxC != null ? ` and ${c.p95MaxC} °C` : ''} sits inside the envelope a diesel is
          rated for, so a correct specification makes close to its full {delivered} kVA per 100.
          That is uncommon across the region: here your load profile decides the size, not the site.
        </p>
        <p>
          The failure mode in {c.city} is oversizing instead. A set never loaded past a third runs
          cool, burns fuel dirtily and wet-stacks &mdash; the same ruin as chronic overload,
          arrived at from the opposite side.
        </p>
      </>
    );
  }

  const tiles: [string, string, string][] = [
    ['Elevation', `${fmt(c.elevationM)} m`, band],
    [
      'Design ambient',
      c.p95MaxC != null ? `${c.p95MaxC} °C` : '—',
      c.meanMaxC != null ? `mean max ${c.meanMaxC} °C` : 'not sourced',
    ],
    ['Altitude derate', `${altD}%`, altD > 0 ? 'output lost to thin air' : 'no altitude penalty'],
    ['Combined derate', `${total}%`, `100 kVA ≈ ${delivered} kVA here`],
  ];

  return (
    <section className="py-12 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-xs uppercase tracking-[0.24em] text-white/50">
          Site conditions &middot; {c.city}, {c.country}
        </p>
        <h2 className="mt-4 text-2xl lg:text-3xl font-semibold tracking-tight text-white text-balance">
          {headline}
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map(([label, value, note]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-wider text-white/45">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-amber-300">{value}</p>
              <p className="mt-1 text-xs text-white/50">{note}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 max-w-3xl space-y-4 text-sm leading-relaxed text-white/70">{body}</div>

        {/*
          Second differentiated dimension.
          The conditions narrative alone left these pages at 73-83% overlap
          because it was ~230 words against ~590 of shared boilerplate. Diurnal
          swing and distance from base are both real, both per-city, and both
          change the recommendation — so they add unique text that is worth
          reading rather than padding.
        */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {diurnal != null && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="text-sm font-semibold text-white">
                Daily swing of {diurnal} &deg;C
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                {diurnal >= 14 ? (
                  <>
                    {c.meanMinC} &deg;C at night to {c.meanMaxC} &deg;C by day is a wide swing.
                    Warm air holds moisture; as the set cools toward {c.meanMinC} &deg;C it
                    condenses in the windings and the tank. In {c.city} an anti-condensation heater
                    is not optional, and a {diurnal} &deg;C daily cycle works battery terminals
                    loose &mdash; re-torque them every service.
                  </>
                ) : diurnal >= 9 ? (
                  <>
                    {c.meanMinC} &deg;C to {c.meanMaxC} &deg;C. A {diurnal} &deg;C cycle is enough
                    to loosen connections within a year or two in {c.city}. The intermittent faults
                    that follow get misread as controller trouble; they are almost always a
                    terminal needing re-torquing.
                  </>
                ) : (
                  <>
                    {c.meanMinC} &deg;C to {c.meanMaxC} &deg;C is a narrow {diurnal} &deg;C cycle,
                    so thermal movement will not age this installation. Steady warmth will: with
                    nights only reaching {c.meanMinC} &deg;C the batteries never cool, and
                    sealed lead-acid life roughly halves per 10 &deg;C sustained above 25 &deg;C.
                    Budget shorter replacement intervals in {c.city} than the datasheet implies.
                  </>
                )}
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-sm font-semibold text-white">
              {distKm} km {bearing} of our workshop
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              {c.city} is roughly {distKm} km {bearing} of our base at {EA_HQ.name}, in a straight
              line and across a border.{' '}
              {distKm <= 700 ? (
                <>
                  {distKm} km is comfortable overland reach: parts move by road and an engineer
                  reaches {c.city} without an unreasonable mobilisation charge. Spares held in
                  Nairobi genuinely serve this site.
                </>
              ) : distKm <= 1600 ? (
                <>
                  At {distKm} km, mobilisation is a real line in any {c.city} quotation, and a
                  machine waiting on a travelling part waits days, not hours. Hold a critical
                  kit on site &mdash; filters, belts, an AVR, injectors &mdash; rather than
                  ordering per failure.
                </>
              ) : (
                <>
                  {distKm} km {bearing} is too far to promise a same-week callout honestly. For{' '}
                  {c.city}, specify for reliability rather than serviceability: heavier-duty set,
                  full on-site spares, and remote monitoring so a fault is seen from Nairobi before
                  it strands you.
                </>
              )}
            </p>
          </div>
        </div>

        <p className="mt-8 text-xs text-white/40">
          Elevation: {EA_CONDITIONS_SOURCE.elevation}. Temperature:{' '}
          {EA_CONDITIONS_SOURCE.temperature}. Derate figures are planning estimates using standard
          corrections (approximately 1% per 100 m above 300 m; 2% per 5 &deg;C above 25 &deg;C);
          final sizing follows the engine manufacturer&rsquo;s own derate tables for the set
          proposed.
        </p>
      </div>
    </section>
  );
}
