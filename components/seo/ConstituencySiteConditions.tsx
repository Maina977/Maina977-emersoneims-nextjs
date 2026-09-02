import {
  getConstituencyConditions,
  altitudeRankInCounty,
  countyConstituencyRecords,
} from '@/lib/data/kenya-constituency-conditions';
import {
  getCountyConditions,
  altitudeDeratePercent,
  temperatureDeratePercent,
  distanceFromHqKm,
  bearingFromHq,
  HQ_LOCATION,
  COUNTY_CONDITIONS_SOURCE,
} from '@/lib/data/kenya-county-conditions';

/**
 * Per-CONSTITUENCY site conditions.
 *
 * These pages carried the original template — measured at 75% identical
 * 8-word sequences between two different counties — and a canonical pointing
 * away, so they could never rank. This section gives the confirmed ones
 * something true and unrepeatable to say, which is what earns a page the right
 * to be indexed on its own.
 *
 * THE UNIQUE FACT IS THE RANKING. "The highest of the seven confirmed
 * constituencies in Nakuru, 512 m above the lowest" is true of exactly one
 * page in the county and cannot be said by its siblings. It is computed from
 * sourced altitudes, so it costs nothing to stand behind. The comparison
 * against the county headquarters does the same job against the parent page.
 *
 * Renders nothing when the constituency has no verified record — 44 of 87 in
 * the priority counties could not be confirmed, mostly directional divisions
 * ("Kajiado North") that are not settlements. Those keep consolidating to
 * their county+service page instead of inventing a figure.
 */

function fmt(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

interface Props {
  countySlug: string;
  countyName: string;
  constituencySlug: string;
  constituencyName: string;
  serviceName?: string;
}

export default function ConstituencySiteConditions({
  countySlug,
  countyName,
  constituencySlug,
  constituencyName,
  serviceName,
}: Props) {
  const c = getConstituencyConditions(countySlug, constituencySlug);
  if (!c) return null;

  const county = getCountyConditions(countySlug);
  const rank = altitudeRankInCounty(countySlug, constituencySlug);
  const siblings = countyConstituencyRecords(countySlug).filter((r) => r.slug !== constituencySlug);

  const altDerate = altitudeDeratePercent(c.elevationM);
  const tempDerate = temperatureDeratePercent(c.p95MaxC);
  const total = Math.round((altDerate + tempDerate) * 10) / 10;
  const needed = total > 0 ? 100 / (1 - total / 100) : 100;

  // Difference from the county headquarters — the parent page's figures.
  const dAlt = county ? c.elevationM - county.elevationM : 0;
  const dTemp = county ? Math.round((c.p95MaxC - county.p95MaxC) * 10) / 10 : 0;

  const km = distanceFromHqKm(c);
  const bearing = bearingFromHq(c);

  return (
    <section className="mb-16" aria-labelledby="constituency-conditions-heading">
      <h2 id="constituency-conditions-heading" className="text-2xl md:text-3xl font-bold mb-4">
        {serviceName
          ? `${serviceName} in ${constituencyName}: the local numbers`
          : `Site conditions in ${constituencyName}`}
      </h2>
      <p className="text-gray-400 max-w-4xl mb-8">
        Figures below are measured at {c.place}, not at the {countyName} County
        headquarters — because within a single county the difference is often
        large enough to change the machine you should buy.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-lg border border-amber-500/20 bg-white/5 p-5">
          <div className="text-sm text-gray-400 mb-1">Altitude</div>
          <div className="text-3xl font-bold text-amber-300">{fmt(c.elevationM)}&nbsp;m</div>
          <div className="text-sm text-gray-500 mt-1">at {c.place}</div>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-white/5 p-5">
          <div className="text-sm text-gray-400 mb-1">Design ambient</div>
          <div className="text-3xl font-bold text-amber-300">{c.p95MaxC}&nbsp;°C</div>
          <div className="text-sm text-gray-500 mt-1">peaked at {c.absMaxC}&nbsp;°C in 2025</div>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-white/5 p-5">
          <div className="text-sm text-gray-400 mb-1">Indicative derate</div>
          <div className="text-3xl font-bold text-amber-300">
            {total > 0 ? `≈ ${total}%` : 'negligible'}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {altDerate}% altitude + {tempDerate}% heat
          </div>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-white/5 p-5">
          <div className="text-sm text-gray-400 mb-1">For 100&nbsp;kVA on site</div>
          <div className="text-3xl font-bold text-amber-300">≈ {fmt(needed)}&nbsp;kVA</div>
          <div className="text-sm text-gray-500 mt-1">
            {total > 0 ? 'nameplate required' : 'no uplift needed'}
          </div>
        </div>
      </div>

      <div className="space-y-5 text-gray-300 max-w-4xl">
        {rank && (
          <p>
            <strong>Where {constituencyName} sits in {countyName}.</strong> Of the{' '}
            {rank.total} constituencies in this county we hold confirmed
            elevation data for, {constituencyName} is the{' '}
            {rank.rank === 1
              ? 'highest'
              : rank.rank === rank.total
                ? 'lowest'
                : `${rank.rank}${rank.rank === 2 ? 'nd' : rank.rank === 3 ? 'rd' : 'th'} highest`}
            {rank.spreadM >= 100 ? (
              <>
                {' '}— and those constituencies span {fmt(rank.spreadM)}&nbsp;m
                between highest and lowest. That spread is the reason a
                county-level figure is not good enough to size against: two
                sites in {countyName} can need different machines for the same
                load.
              </>
            ) : (
              <>
                . The county is unusually flat — {fmt(rank.spreadM)}&nbsp;m
                separates its highest and lowest confirmed constituencies — so
                here the county figure and the local one agree, and altitude is
                not what will distinguish one site from another.
              </>
            )}
          </p>
        )}

        {county && (Math.abs(dAlt) >= 50 || Math.abs(dTemp) >= 0.5) && (
          <p>
            <strong>Against the county headquarters.</strong> {c.place} sits{' '}
            {Math.abs(dAlt) >= 50 ? (
              <>
                {fmt(Math.abs(dAlt))}&nbsp;m {dAlt > 0 ? 'above' : 'below'}{' '}
                {county.hq}
              </>
            ) : (
              <>at much the same height as {county.hq}</>
            )}
            {Math.abs(dTemp) >= 0.5 && (
              <>
                {' '}and runs {Math.abs(dTemp)}&nbsp;°C{' '}
                {dTemp > 0 ? 'hotter' : 'cooler'} on a design day
              </>
            )}
            . {Math.abs(dAlt) >= 200 || Math.abs(dTemp) >= 2
              ? 'That is a large enough difference that specifying from the county figure would put you in the wrong place — worth quoting against the local numbers instead.'
              : 'The difference is modest, but it is real, and it moves in the direction you would expect from the terrain.'}
          </p>
        )}

        {siblings.length > 0 && (
          <p>
            <strong>Nearby, for comparison.</strong>{' '}
            {siblings
              .slice(0, 4)
              .map((s) => `${s.name} at ${fmt(s.elevationM)} m`)
              .join(', ')}
            . Sites within a few kilometres of each other can still differ
            enough to matter, which is why we size against a measured site
            altitude rather than a district average.
          </p>
        )}

        <p>
          <strong>Getting there.</strong> {c.place} is roughly {fmt(km)}&nbsp;km{' '}
          {bearing} of our {HQ_LOCATION.name} workshop in a straight line. Our
          mobile workshop covers all 47 counties, so attendance here is routine
          rather than exceptional.
        </p>

        <p className="text-sm text-gray-500 border-t border-white/10 pt-5">
          <strong className="text-gray-400">How to read these figures.</strong>{' '}
          They describe {c.place}, the settlement these measurements were taken
          at, which is not necessarily the centre of {constituencyName} — treat
          them as a local reference point, not your site value. Derates are
          planning indications (about 1% per 100&nbsp;m above 300&nbsp;m, about
          2% per 5&nbsp;°C above 25&nbsp;°C); the engine&apos;s own derate table
          governs. Elevation: {COUNTY_CONDITIONS_SOURCE.elevation}. Temperature:{' '}
          {COUNTY_CONDITIONS_SOURCE.climate}. Both{' '}
          {COUNTY_CONDITIONS_SOURCE.licence}, retrieved{' '}
          {COUNTY_CONDITIONS_SOURCE.retrieved}.
        </p>
      </div>
    </section>
  );
}
