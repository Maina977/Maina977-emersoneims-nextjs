import {
  getCountyConditions,
  altitudeDeratePercent,
  countyExposure,
  COUNTY_CONDITIONS_SOURCE,
} from '@/lib/data/kenya-county-conditions';

/**
 * Per-county site-conditions section for /kenya/[county].
 *
 * THE POINT OF THIS COMPONENT
 * The location pages were 98% textually identical — the template swapped a
 * place name and changed nothing else, so Google consolidated unrelated
 * counties onto one canonical. This section exists to make the pages
 * genuinely different, and the only honest way to do that is to say something
 * that is actually different: a generator sized for Lamu at 14 m is not the
 * machine you install at Iten at 2,355 m.
 *
 * Everything rendered here derives from a SOURCED elevation (GeoNames, see
 * kenya-county-conditions.ts) and the county's region. Nothing is invented,
 * and no claim is made about work performed in the county — that would be
 * the kind of unverifiable filler this component was written to replace.
 *
 * The narrative branches rather than just substituting a number: a sea-level
 * county is told plainly that altitude is NOT its constraint, which is the
 * opposite advice a highland county gets. Two counties at similar altitude
 * but different exposure still read differently.
 *
 * Renders nothing at all when a county has no sourced record — a missing
 * figure must produce silence, never a plausible-looking default.
 */

/** Deterministic integer formatting — never toLocaleString() (hydration). */
function fmt(n: number): string {
  const s = Math.round(n).toString();
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

interface Props {
  countySlug: string;
  countyName: string;
  region: string;
}

export default function CountySiteConditions({ countySlug, countyName, region }: Props) {
  const c = getCountyConditions(countySlug);
  if (!c) return null;

  const derate = altitudeDeratePercent(c.elevationM);
  const flags = countyExposure(countySlug, region, c.elevationM);
  const has = (f: string) => flags.includes(f as never);

  // Worked example: nameplate needed to still deliver 100 kVA on site.
  const needed = derate > 0 ? 100 / (1 - derate / 100) : 100;

  return (
    <section className="mb-16" aria-labelledby="site-conditions-heading">
      <h2
        id="site-conditions-heading"
        className="text-2xl md:text-3xl font-bold mb-4"
      >
        Sizing a generator for {countyName} County
      </h2>
      <p className="text-gray-400 max-w-4xl mb-8">
        Generator ratings are quoted at ISO 8528-1 reference conditions —
        roughly sea level, 25&nbsp;°C, 30% humidity. {countyName} County does not
        sit at those conditions, so the nameplate figure on a datasheet is not
        the power you will get on site. Here is what changes here, and why.
      </p>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-lg border border-amber-500/20 bg-white/5 p-5">
          <div className="text-sm text-gray-400 mb-1">Reference altitude</div>
          <div className="text-3xl font-bold text-amber-300">
            {fmt(c.elevationM)}&nbsp;m
          </div>
          <div className="text-sm text-gray-500 mt-1">
            at {c.hq}, the county headquarters
          </div>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-white/5 p-5">
          <div className="text-sm text-gray-400 mb-1">Indicative altitude derate</div>
          <div className="text-3xl font-bold text-amber-300">
            {derate > 0 ? `≈ ${derate}%` : 'negligible'}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {derate > 0 ? 'output lost to thinner air' : 'below the derating threshold'}
          </div>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-white/5 p-5">
          <div className="text-sm text-gray-400 mb-1">To deliver 100&nbsp;kVA here</div>
          <div className="text-3xl font-bold text-amber-300">
            ≈ {fmt(needed)}&nbsp;kVA
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {derate > 0 ? 'nameplate required' : 'no altitude uplift needed'}
          </div>
        </div>
      </div>

      <div className="space-y-5 text-gray-300 max-w-4xl">
        {derate > 0 ? (
          <p>
            An engine makes power by burning fuel, and it can only burn fuel in
            proportion to the air it can draw in. At {fmt(c.elevationM)}&nbsp;m the
            air around {c.hq} is measurably thinner than at the coast, so the same
            engine produces less. Specify a set on its sea-level rating and you
            will be commissioning a machine that runs closer to its limit than
            you intended, on every load step, for its whole service life — which
            shows up as heat, as soot, and as shortened time between overhauls
            rather than as an obvious failure on day one.
          </p>
        ) : (
          <p>
            At {fmt(c.elevationM)}&nbsp;m, altitude is <strong>not</strong> your
            constraint in {countyName} — this is one of the few parts of Kenya
            where a set performs close to its published rating without an
            altitude uplift. That makes it more important, not less, to get the
            other conditions right: at this elevation it is ambient temperature
            and air quality that erode output, and they are easier to overlook
            precisely because the altitude question answers itself.
          </p>
        )}

        {has('highland') && (
          <p>
            <strong>Highland siting.</strong> {countyName} is high enough that
            altitude governs the sizing decision outright. Naturally aspirated
            engines lose considerably more here than turbocharged ones, so
            aspiration is worth deciding before brand — two sets with the same
            nameplate can behave very differently at this elevation. Cold starts
            also matter at altitude: block heaters and correct oil grade are the
            difference between a set that carries load on the first crank and
            one that is still coming up to temperature when the load arrives.
          </p>
        )}

        {has('marine-air') && (
          <p>
            <strong>Marine air.</strong> On the low-lying coastal strip of{' '}
            {countyName}, salt-laden air attacks a generator continuously
            whether or not it is running. Standard enclosures corrode from the
            inside out, alternator windings and control-panel terminations
            suffer first, and the damage is usually well advanced before it is
            visible. Marine-grade or upgraded enclosure treatment, sealed
            terminations and a shortened inspection interval are not optional
            extras at this exposure — they are the difference between a set that
            reaches its design life and one that does not.
          </p>
        )}

        {has('arid-dust') && (
          <p>
            <strong>Airborne dust.</strong> {countyName} sits in Kenya&apos;s
            arid rangelands, where the governing maintenance variable is not
            running hours but air filtration. Manufacturer service intervals
            assume far cleaner intake air than this; dust ingestion scores
            liners and bores, and a filter that is still within its hour-based
            interval can already be choking the engine. Pre-cleaners, more
            frequent filter inspection judged on restriction rather than the
            calendar, and sealed intake ducting all pay for themselves here.
          </p>
        )}

        {has('high-ambient') && (
          <p>
            <strong>High ambient temperature.</strong> Below about 700&nbsp;m the
            air is dense but hot, and hot air carries away less heat. Radiator
            sizing, enclosure ventilation and the free area around the set
            matter more in {countyName} than the altitude figure suggests — a
            correctly sized generator in an undersized or poorly ventilated
            room will derate itself through high coolant temperature regardless
            of what its rating plate says.
          </p>
        )}

        <p className="text-sm text-gray-500 border-t border-white/10 pt-5">
          <strong className="text-gray-400">How to read these figures.</strong>{' '}
          The altitude shown is for {c.hq}, the {countyName} County
          headquarters — counties span wide altitude ranges, so this is a
          reference point for the county, not your site value. The derate
          percentage is a planning indication of the order used across the
          industry (about 1% per 100&nbsp;m above 300&nbsp;m); the governing
          figure is always the specific engine&apos;s derate table, which varies
          with aspiration and charge-air cooling. We size against that table and
          the measured site altitude, not against this page. Elevation data:{' '}
          {COUNTY_CONDITIONS_SOURCE.name} ({COUNTY_CONDITIONS_SOURCE.licence}),
          retrieved {COUNTY_CONDITIONS_SOURCE.retrieved}.
        </p>
      </div>
    </section>
  );
}
