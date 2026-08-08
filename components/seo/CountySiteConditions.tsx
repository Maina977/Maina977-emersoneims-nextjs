import type { ReactNode } from 'react';
import {
  getCountyConditions,
  altitudeBand,
  thermalBand,
  reachBand,
  scaleBand,
  altitudeDeratePercent,
  temperatureDeratePercent,
  combinedDeratePercent,
  governingConstraint,
  countyExposure,
  distanceFromHqKm,
  bearingFromHq,
  HQ_LOCATION,
  COUNTY_CONDITIONS_SOURCE,
} from '@/lib/data/kenya-county-conditions';

/**
 * Per-county site-conditions section.
 *
 * THE POINT OF THIS COMPONENT
 * The location pages were 98% textually identical — the template swapped a
 * place name and changed nothing else, so Google consolidated unrelated
 * counties onto one canonical. This section makes them genuinely different,
 * and the only honest way to do that is to say something that IS different:
 * a set sized for Lamu at 14 m and 32.8 C is not the machine you install at
 * Iten at 2,355 m and 23.4 C.
 *
 * IT BRANCHES, IT DOES NOT SUBSTITUTE. The narrative is chosen by which
 * constraint actually governs — altitude, temperature, both, or neither — so
 * a highland county and a hot lowland county give opposite advice rather than
 * the same sentence with different numbers. Two counties with a similar total
 * derate still read differently when they get there by different routes.
 *
 * Every figure derives from sourced data (see kenya-county-conditions.ts).
 * No claim is made about work performed in any county — that would be exactly
 * the unverifiable filler this component was written to replace.
 *
 * Renders nothing when a county has no sourced record: a missing figure must
 * produce silence, never a plausible-looking default.
 */

/** Deterministic integer formatting — never toLocaleString() (hydration). */
function fmt(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Service-specific consequence of the SAME measured conditions.
 *
 * This is what makes the 423 county+service pages distinct from one another
 * and from their county parent: identical site data, but the thing it does to
 * a UPS battery is not the thing it does to a rewound motor. Every claim here
 * is standard engineering tied to a measured figure — nothing about work
 * performed, nothing unverifiable.
 *
 * Returns null for a service with no honest angle, rather than padding.
 */
function serviceAngle(
  slug: string | undefined,
  p95MaxC: number,
  elevationM: number,
  hq: string,
): ReactNode {
  if (!slug) return null;

  // VRLA/lead-acid service life roughly halves for every ~10 C above the 25 C
  // it is rated at. With a measured design ambient this becomes a real number.
  const overRated = Math.max(0, p95MaxC - 25);
  const lifeFactor = Math.pow(0.5, overRated / 10);
  const lifePct = Math.round(lifeFactor * 100);

  switch (slug) {
    case 'ups-systems':
      return overRated > 1 ? (
        <p>
          <strong>What this does to UPS batteries.</strong> Sealed lead-acid
          cells are rated for 25&nbsp;°C, and their service life roughly halves
          for every 10&nbsp;°C above it. At a design ambient of {p95MaxC}&nbsp;°C
          around {hq}, an unconditioned battery room is operating at roughly{' '}
          {lifePct}% of the life the datasheet promises — a four-year string
          retiring in about {Math.max(1, Math.round(4 * lifeFactor))} years. This
          is the single most expensive thing people get wrong about UPS here,
          and it is a room-cooling decision, not a battery-brand one.
        </p>
      ) : (
        <p>
          <strong>What this does to UPS batteries.</strong> A design ambient of{' '}
          {p95MaxC}&nbsp;°C around {hq} sits at or below the 25&nbsp;°C that
          sealed lead-acid cells are rated for, so batteries here can reach
          their full rated life — which makes ventilation and charge control,
          rather than cooling, the things worth spending on.
        </p>
      );

    case 'solar-installation':
    case 'solar-companies':
      return (
        <p>
          <strong>What this does to a solar array.</strong> PV modules lose
          output as they heat up — roughly 0.3–0.4% per&nbsp;°C above their
          25&nbsp;°C test condition, and a panel in still air runs well above
          ambient. With {p95MaxC}&nbsp;°C design ambient at {hq}, array sizing
          based on nameplate watts will overpromise on exactly the bright, hot
          afternoons you sized it for. Mounting height and rear ventilation are
          not cosmetic details here; they recover real yield. Inverters derate
          on their own heat too, which is why enclosure placement matters as
          much as inverter brand.
        </p>
      );

    case 'motor-rewinding':
      return (
        <p>
          <strong>What this does to windings.</strong> Insulation life is
          governed by temperature: the accepted rule is that every 10&nbsp;°C of
          sustained overtemperature halves it. A motor at {hq} starts from a{' '}
          {p95MaxC}&nbsp;°C ambient before it generates any heat of its own, so
          the insulation class and the cooling arrangement decide how long a
          rewind lasts far more than the winding wire does. Specifying a higher
          class than the minimum is usually the cheapest life extension
          available at this ambient.
        </p>
      );

    case 'generator-maintenance':
      return (
        <p>
          <strong>What this does to service intervals.</strong> Manufacturer
          intervals assume reference conditions. At {fmt(elevationM)}&nbsp;m and{' '}
          {p95MaxC}&nbsp;°C, oil oxidises faster and coolant works harder than
          the schedule assumes, so hour-based servicing drifts out of step with
          what the engine is actually experiencing. Oil analysis is worth more
          than the calendar here — it tells you what the interval should be for
          your site rather than for the test cell.
        </p>
      );

    case 'generator-repairs':
      return (
        <p>
          <strong>What actually fails here.</strong> Most call-outs at{' '}
          {fmt(elevationM)}&nbsp;m and {p95MaxC}&nbsp;°C are not sudden
          mechanical failures — they are cooling and fuelling problems that have
          been building. High coolant temperature, radiator fouling, and a set
          that was specified on its nameplate rating and has been running near
          its limit ever since. Diagnosing the derating question first often
          explains a fault that looks electrical.
        </p>
      );

    case 'generator-spare-parts':
      return (
        <p>
          <strong>What wears first here.</strong> Site conditions decide which
          parts move. At {p95MaxC}&nbsp;°C design ambient, cooling-system
          components, belts and hoses age faster than the hour meter suggests,
          and thermostats and radiator caps fail in ways that look like head
          problems. Stocking against the conditions rather than against a
          generic list is what keeps a set running near {hq}.
        </p>
      );

    default:
      return null;
  }
}

interface Props {
  countySlug: string;
  countyName: string;
  region: string;
  /** Optional service context, so county+service pages read differently again. */
  serviceName?: string;
  serviceSlug?: string;
  /** County population, already in kenya-locations.ts — drives the scale band. */
  population?: number;
}

export default function CountySiteConditions({
  countySlug,
  countyName,
  region,
  serviceName,
  serviceSlug,
  population,
}: Props) {
  const c = getCountyConditions(countySlug);
  if (!c) return null;

  const aBand = altitudeBand(c.elevationM);
  const tBand = thermalBand(c.p95MaxC);
  const sBand = population ? scaleBand(population) : undefined;

  const altDerate = altitudeDeratePercent(c.elevationM);
  const tempDerate = temperatureDeratePercent(c.p95MaxC);
  const total = combinedDeratePercent(c);
  const governs = governingConstraint(c);
  const flags = countyExposure(countySlug, region, c);
  const has = (f: string) => flags.includes(f as never);
  const km = distanceFromHqKm(c);
  const bearing = bearingFromHq(c);

  // Nameplate needed to still deliver 100 kVA on site.
  const needed = total > 0 ? 100 / (1 - total / 100) : 100;

  return (
    <section className="mb-16" aria-labelledby="site-conditions-heading">
      <h2 id="site-conditions-heading" className="text-2xl md:text-3xl font-bold mb-4">
        {serviceName
          ? `${serviceName} in ${countyName}: what the site conditions change`
          : `Sizing a generator for ${countyName} County`}
      </h2>
      <p className="text-gray-400 max-w-4xl mb-8">
        Generating sets are rated at ISO 8528-1 reference conditions — near sea
        level, 25&nbsp;°C. {countyName} County is not at those conditions, so the
        nameplate figure on a datasheet is not the power you get on site. Here
        is what changes here, measured rather than assumed.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-lg border border-amber-500/20 bg-white/5 p-5">
          <div className="text-sm text-gray-400 mb-1">Reference altitude</div>
          <div className="text-3xl font-bold text-amber-300">{fmt(c.elevationM)}&nbsp;m</div>
          <div className="text-sm text-gray-500 mt-1">at {c.hq}</div>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-white/5 p-5">
          <div className="text-sm text-gray-400 mb-1">Design ambient</div>
          <div className="text-3xl font-bold text-amber-300">{c.p95MaxC}&nbsp;°C</div>
          <div className="text-sm text-gray-500 mt-1">
            hotter than 95% of 2025 days
          </div>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-white/5 p-5">
          <div className="text-sm text-gray-400 mb-1">Indicative total derate</div>
          <div className="text-3xl font-bold text-amber-300">
            {total > 0 ? `≈ ${total}%` : 'negligible'}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {altDerate}% altitude + {tempDerate}% heat
          </div>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-white/5 p-5">
          <div className="text-sm text-gray-400 mb-1">To deliver 100&nbsp;kVA here</div>
          <div className="text-3xl font-bold text-amber-300">≈ {fmt(needed)}&nbsp;kVA</div>
          <div className="text-sm text-gray-500 mt-1">
            {total > 0 ? 'nameplate required' : 'no uplift needed'}
          </div>
        </div>
      </div>

      <div className="space-y-5 text-gray-300 max-w-4xl">
        {governs === 'altitude' && (
          <p>
            <strong>Altitude is what governs sizing in {countyName}.</strong> At{' '}
            {fmt(c.elevationM)}&nbsp;m the air around {c.hq} is measurably thinner
            than at the coast, and an engine can only burn fuel in proportion to
            the air it draws in. Heat is the smaller factor here — a design
            ambient of {c.p95MaxC}&nbsp;°C costs roughly {tempDerate}% against the
            ~{altDerate}% you lose to elevation. The practical consequence is
            that aspiration matters more than brand: naturally aspirated engines
            lose considerably more at this height than turbocharged ones, so two
            sets with identical nameplates behave differently on your site.
          </p>
        )}

        {governs === 'temperature' && (
          <p>
            <strong>Heat, not height, is the constraint in {countyName}.</strong>{' '}
            At {fmt(c.elevationM)}&nbsp;m elevation costs you only about{' '}
            {altDerate}%, but a design ambient of {c.p95MaxC}&nbsp;°C — with 2025
            peaking at {c.absMaxC}&nbsp;°C — costs roughly {tempDerate}%. Hot air
            is both thinner and worse at carrying heat away, so the same machine
            is making less power while working harder to cool itself. That makes
            radiator sizing, enclosure ventilation and free air space around the
            set the decisions that actually determine whether it holds rated
            output in the afternoon, when your load is usually highest.
          </p>
        )}

        {governs === 'both' && (
          <p>
            <strong>{countyName} penalises a set twice over.</strong> Elevation of{' '}
            {fmt(c.elevationM)}&nbsp;m costs about {altDerate}%, and a design
            ambient of {c.p95MaxC}&nbsp;°C costs about another {tempDerate}% — a
            combination that is easy to underestimate because each factor alone
            looks tolerable. Sized on the datasheet rating, a set here runs
            closer to its limit on every load step, for its whole service life.
            That shows up as heat, as soot and as shortened time between
            overhauls rather than as an obvious failure on day one.
          </p>
        )}

        {governs === 'neither' && (
          <p>
            <strong>{countyName} is close to textbook conditions.</strong> At{' '}
            {fmt(c.elevationM)}&nbsp;m and a design ambient of {c.p95MaxC}&nbsp;°C,
            this is one of the few places in Kenya where a set performs near its
            published rating without an uplift — so the honest answer is that
            derating is not your problem here. That makes the other decisions
            matter more, not less: load profile, step loading, fuel quality and
            ventilation are what will determine whether this installation is a
            good one.
          </p>
        )}

        {has('highland') && governs !== 'altitude' && (
          <p>
            <strong>Highland siting.</strong> Above 1,500&nbsp;m, cold starts
            deserve attention alongside derating: block heaters and the correct
            oil grade are the difference between a set that takes load on the
            first crank and one still warming up when the load arrives.
          </p>
        )}

        {has('marine-air') && (
          <p>
            <strong>Marine air.</strong> On the low-lying coastal strip of{' '}
            {countyName}, salt-laden air attacks a generator continuously whether
            or not it is running. Standard enclosures corrode from the inside
            out, alternator windings and control-panel terminations suffer first,
            and the damage is usually well advanced before it becomes visible.
            Marine-grade or upgraded enclosure treatment, sealed terminations and
            a shortened inspection interval are not optional extras at this
            exposure.
          </p>
        )}

        {has('arid-dust') && (
          <p>
            <strong>Airborne dust.</strong> {countyName} sits in Kenya&apos;s arid
            rangelands, where the governing maintenance variable is not running
            hours but air filtration. Manufacturer service intervals assume far
            cleaner intake air than this. Dust ingestion scores liners and bores,
            and a filter still inside its hour-based interval can already be
            choking the engine — which is why restriction, not the calendar,
            should trigger a change here. Pre-cleaners and sealed intake ducting
            pay for themselves.
          </p>
        )}

        {has('high-ambient') && governs !== 'temperature' && (
          <p>
            <strong>Hot-day margin.</strong> With 2025 reaching{' '}
            {c.absMaxC}&nbsp;°C at {c.hq}, the worst day matters more than the
            average one. A correctly sized set in an undersized or poorly
            ventilated room will derate itself through high coolant temperature
            regardless of what its rating plate says.
          </p>
        )}

        {/* Altitude-band advice: what you DO differs at 2,300 m and 1,550 m. */}
        {aBand === 'very-high' && (
          <p>
            <strong>Above 2,000&nbsp;m.</strong> This is the altitude at which
            frame size stops being a formality. The uplift needed here often
            pushes a specification into the next set size rather than being
            absorbed by margin, and a turbocharged engine with charge-air
            cooling stops being an upgrade and starts being the sensible
            default. Ask for the derated rating in writing before you compare
            prices — two quotes at the same nameplate are not the same machine
            at {fmt(c.elevationM)}&nbsp;m.
          </p>
        )}
        {aBand === 'mid' && (
          <p>
            <strong>The awkward middle.</strong> Between 1,000 and 1,500&nbsp;m
            the derate is real but small enough to be waved away, which is
            exactly why it gets missed. It rarely changes the frame size; it
            does quietly consume the margin you were relying on for future load
            growth. Worth confirming on paper rather than assuming.
          </p>
        )}

        {/* Thermal-band advice, banded on measured design ambient. */}
        {tBand === 'extreme' && (
          <p>
            <strong>Extreme heat.</strong> A design ambient above 36&nbsp;°C puts
            this among the hardest environments in Kenya to keep a set running
            at rating. Standard radiator packages are frequently inadequate;
            high-ambient cooling packs, generous enclosure free area and shaded
            intake are the difference between a machine that holds load and one
            that shuts down on high coolant temperature in the afternoon.
          </p>
        )}
        {tBand === 'temperate' && (
          <p>
            <strong>Cool running.</strong> A design ambient of {c.p95MaxC}&nbsp;°C
            is genuinely kind to machinery — thermal derating is not your
            problem, and standard cooling packages have real margin here. The
            trade-off is at the other end: cold starts and light-load running
            deserve the attention that heat would demand elsewhere.
          </p>
        )}

        {/* Service-specific consequence of the same measured conditions. */}
        {serviceAngle(serviceSlug, c.p95MaxC, c.elevationM, c.hq)}

        {/* Scale band — real county population, already in the repo. */}
        {sBand === 'major' && (
          <p>
            <strong>Load profile.</strong> {countyName} is one of Kenya&apos;s
            largest concentrations of demand, and the work here skews to
            commercial and institutional sites where the question is rarely a
            single set — it is synchronising, load-shedding priority and how
            gracefully the installation degrades when one machine is out for
            service.
          </p>
        )}
        {sBand === 'small' && (
          <p>
            <strong>Load profile.</strong> {countyName} is a smaller county, and
            the realistic constraint is usually parts and attendance rather than
            capacity. Standardising on a well-supported engine family matters
            more here than squeezing the last percent out of a sizing
            calculation — a set you can get filters and a fuel pump for is worth
            more than a marginally better one you cannot.
          </p>
        )}

        <p>
          <strong>Getting there.</strong> {c.hq} lies about {fmt(km)}&nbsp;km{' '}
          {bearing} of our {HQ_LOCATION.name} workshop in a straight line — road
          distance is longer. Our mobile workshop covers all 47 counties, so
          {reachBand(km) === 'metro'
            ? ' this is on our doorstep: same-day attendance is routine.'
            : reachBand(km) === 'near'
              ? ' this is comfortably within routine call-out range for service and breakdown attendance.'
              : reachBand(km) === 'regional'
                ? ' visits here are planned rather than improvised — we confirm the fault description in advance so the right parts travel with the engineer.'
                : ' work this far out is planned around parts availability: we carry the consumables and wear items for the visit rather than making a second trip for a filter.'}
        </p>

        <p className="text-sm text-gray-500 border-t border-white/10 pt-5">
          <strong className="text-gray-400">How to read these figures.</strong>{' '}
          Altitude and temperature are for {c.hq}, the {countyName} County
          headquarters — counties span wide ranges, so these are county reference
          points, not your site values. Derate percentages are planning
          indications of the order used across the industry (about 1% per
          100&nbsp;m above 300&nbsp;m, about 2% per 5&nbsp;°C above 25&nbsp;°C);
          the governing figure is always the specific engine&apos;s derate table,
          which varies with aspiration and charge-air cooling. We size against
          that table and your measured site conditions, not against this page.
          Elevation: {COUNTY_CONDITIONS_SOURCE.elevation}. Temperature:{' '}
          {COUNTY_CONDITIONS_SOURCE.climate}. Both{' '}
          {COUNTY_CONDITIONS_SOURCE.licence}, retrieved{' '}
          {COUNTY_CONDITIONS_SOURCE.retrieved}.
        </p>
      </div>
    </section>
  );
}
