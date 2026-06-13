// ═══════════════════════════════════════════════════════════════════════════════
// AboutCapabilityDeepDive — additive, server-rendered content for /about-us. UNIQUE
// angle: the operational backbone that makes the promises credible (workshop & field
// capability, nationwide coverage/logistics, quality & accountability). Complements
// the existing story/timeline; does not repeat the home or solutions content.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DeepDiveSection,
  DeepDiveBlock,
  SpecTable,
  Callout,
} from '@/components/content/EngineeringDeepDive';

export default function AboutCapabilityDeepDive() {
  return (
    <DeepDiveSection
      id="about-capability"
      eyebrow="Our capability"
      title="The Backbone Behind the Promise"
      accent="amber"
      intro="Reliability is not a slogan — it is workshops, test gear, vehicles, parts on the shelf and engineers who have done the job before. Here is the operational depth that lets us stand behind every system we install, anywhere in Kenya."
    >
      <DeepDiveBlock heading="Depth earned since 2013" accent="amber">
        <p>
          EmersonEIMS has spent over a decade doing the unglamorous work that builds real competence: hundreds of generator
          installations and repairs, solar and UPS deployments, motor rewinds, fabrication jobs and emergency call-outs across
          the country. That installed base is not a vanity statistic — it is the reason our engineers recognise a fault from the
          burn pattern, size a set right for the altitude the first time, and know which spare a given controller is about to
          need. Experience compounds, and a decade of it is the difference between a supplier who guesses and a partner who knows.
        </p>
        <p>
          Just as importantly, it is why our references span sectors that do not forgive failure — schools, manufacturers,
          agribusiness, government and commercial property. Each came with a different definition of &quot;reliable,&quot; and
          meeting all of them taught us to engineer for the specific risk in front of us rather than selling one answer to every
          question.
        </p>
      </DeepDiveBlock>

      <DeepDiveBlock heading="Workshop and field capability" accent="amber">
        <p>
          A great deal of power engineering cannot be done from a catalogue — it needs hands, tools and a bench. Our capability
          spans the full chain: a rewind and electrical workshop with the test gear to prove a motor (insulation resistance,
          surge comparison, core-loss and a vibration baseline); a fabrication bay for canopies, bases, tanks and structural
          steel; diagnostic instruments for generator controllers and power-quality analysis; and the load-bank capacity to
          commission and prove a set under genuine full load rather than hoping it performs on the day.
        </p>
        <p>
          In the field, a stocked vehicle fleet and trained technicians mean a breakdown is met with the right parts and the
          right person, not a promise to &quot;order it in.&quot; This is the practical machinery behind every SLA we sign — the
          reason a four-hour response time is a commitment we can actually keep, not a number on a brochure.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="What we operate so you don't have to"
        accent="amber"
        highlightCol={0}
        headers={['Capability', 'What it means for you']}
        rows={[
          ['Rewind & electrical workshop', 'Motors repaired and tested in-house, fast turnaround'],
          ['Fabrication bay', 'Canopies, bases, tanks, structural steel built to spec'],
          ['Load-bank & diagnostics', 'Systems proven under real load before handover'],
          ['Fast-moving parts inventory', 'Common spares held locally — repairs in hours, not weeks'],
          ['Equipped vehicle fleet', 'Technicians arrive ready to fix, not just to inspect'],
          ['Nationwide reach', 'One partner across all 47 counties under one SLA'],
        ]}
      />

      <DeepDiveBlock heading="Coverage and the logistics of being there" accent="amber">
        <p>
          Kenya is a big country, and resilience that only works in Nairobi is not resilience. We structure our coverage so that
          a flower farm in Naivasha, a hospital in Kisumu, a factory in Eldoret and a development in Kilifi all get the same
          engineered standard and the same response discipline. For multi-site organisations that means one contract, one point
          of accountability, and a consistent maintenance regime across every location — instead of a patchwork of local
          contractors with no shared record and no shared standard.
        </p>
        <p>
          Coverage is also about the boring details that decide outcomes: holding the right spares within reach of the sites that
          need them, planning service routes so preventive visits actually happen, and keeping documentation centralised so any
          engineer can pick up any site&apos;s history. Logistics, done quietly and well, is most of what &quot;24/7 support&quot;
          really means.
        </p>
      </DeepDiveBlock>

      <DeepDiveBlock heading="Quality, safety and accountability" accent="amber">
        <p>
          We would rather be judged on what we can prove than on what we claim. That is why our installations are designed to
          recognised standards, commissioned under test, and handed over with the documentation — single-line diagrams, test
          certificates, O&amp;M manuals and service logs — that lets a client, an insurer or a regulator verify the work. Safety
          is non-negotiable: HV work behind permits and competent persons, earthing tested, protection coordinated, and
          emissions (for incineration) designed to meet NEMA limits.
        </p>
        <p>
          Behind it sits a commitment we are comfortable putting in writing: a 3-year warranty, SLA-backed maintenance, and 24/7
          emergency response. Accountability is the whole point — when something matters enough to engineer properly, it matters
          enough to stand behind. That is the company we have built, and the one we intend to keep being.
        </p>
      </DeepDiveBlock>

      <Callout title="See the engineering for yourself" accent="amber">
        Visit our service pages for the technical detail behind the work — sizing maths, derating, formulas and field practice —
        or talk to us directly about your sites. Call <strong>+254&nbsp;768&nbsp;860&nbsp;665</strong> or
        <strong> +254&nbsp;782&nbsp;914&nbsp;717</strong>.
      </Callout>
    </DeepDiveSection>
  );
}
