// ═══════════════════════════════════════════════════════════════════════════════
// GeneratorTroubleshootingDeepDive — additive, server-rendered reference content for
// /solutions/generators. UNIQUE angle: diagnosing generator faults (no-start fault
// tree, controller codes, common field failures) — distinct from the /generators
// sizing/derating deep-dive.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DeepDiveSection,
  DeepDiveBlock,
  SpecTable,
  Callout,
} from '@/components/content/EngineeringDeepDive';

export default function GeneratorTroubleshootingDeepDive() {
  return (
    <DeepDiveSection
      id="generator-troubleshooting-engineering"
      eyebrow="Engineering reference"
      title="Diagnosing Generator Faults: The Field Troubleshooting Method"
      accent="amber"
      intro="When a standby set fails to start, panic and parts-swapping are expensive. A diesel generator follows logic, and so should the diagnosis. This is the structured fault-finding we use in the field — start from the symptom, follow the tree, and fix the cause, not just the symptom."
      sources={[
        'Engine OEM service manuals (Cummins, Perkins, FG Wilson) fault trees.',
        'DSE / ComAp / PowerWizard controller fault-code references.',
        'NFPA 110 — testing regimes that surface latent faults before an outage.',
        'Field reliability data: starting-battery and fuel issues dominate no-start calls.',
      ]}
    >
      <DeepDiveBlock heading="1. The no-start: start with the boring causes" accent="amber">
        <p>
          The cruel truth of standby power is that most &quot;the generator won&apos;t start&quot; calls are not engine faults
          at all. The overwhelming leaders are a <strong>flat or sulphated starting battery</strong>, a <strong>disabled or
          discharged charger</strong>, the <strong>control switch left in STOP/OFF</strong>, an <strong>active shutdown alarm
          not reset</strong>, or <strong>stale/contaminated fuel</strong>. Before anyone reaches for a spanner, these are checked
          first, because they explain the large majority of failures and cost nothing to rule out.
        </p>
        <p>
          This is why the controller is the first thing we read, not the engine. A DSE, ComAp or PowerWizard panel will almost
          always tell you why it shut down — low oil pressure, high coolant temperature, over-speed, fail-to-start, low battery —
          and that code points straight to the branch of the fault tree to follow. Diagnosing a generator without reading its
          controller is working blind.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="No-start fault tree (check in this order)"
        accent="amber"
        highlightCol={0}
        headers={['Symptom', 'Most likely cause', 'Check / action']}
        rows={[
          ['Nothing happens (dead panel)', 'Battery flat / isolator off', 'Battery voltage, isolator, charger'],
          ['Cranks but won’t fire', 'Fuel: empty, air-locked, stale, filter', 'Fuel level, bleed, filter, solenoid'],
          ['Cranks slowly', 'Weak battery / bad connections', 'Load-test battery, clean terminals'],
          ['Starts then stops', 'Shutdown alarm (oil/temp/speed)', 'Read controller code, address root'],
          ['Won’t crank, panel live', 'Mode in STOP / latched alarm', 'Reset alarm, set to AUTO'],
        ]}
      />

      <DeepDiveBlock heading="2. Runs but won't take load, or trips under load" accent="amber">
        <p>
          A set that starts happily but collapses when the load is applied is telling you something specific. A <strong>voltage
          that sags and recovers slowly</strong> points to the AVR or excitation; a <strong>frequency/RPM that droops</strong>
          points to the governor or a fuel-delivery restriction; an <strong>immediate overload trip</strong> points to
          undersizing for the step load (often a big motor start) or to a genuine fault on the load side. Reading voltage and
          frequency during the event separates an alternator/AVR problem from an engine/fuel problem.
        </p>
        <p>
          Nuisance trips that only appear under real load are also why a <strong>load-bank test</strong> matters: a set that
          passes a no-load run can still fail at 80% load. Commissioning and periodic load testing (per NFPA 110) surface these
          latent faults on the test bench instead of during the outage that finally calls on the set.
        </p>
      </DeepDiveBlock>

      <DeepDiveBlock heading="3. Overheating, smoke and the wet-stacking trap" accent="amber">
        <p>
          <strong>Overheating</strong> follows a short list: low coolant, a blocked or dirty radiator, a failed thermostat or
          water pump, a slipping belt, or — common in canopied sets — restricted cooling airflow. <strong>Exhaust smoke</strong>
          is diagnostic by colour: black is over-fuelling or air starvation (clogged air filter, overload), blue is oil burning,
          white is unburnt fuel or coolant ingress. Each points to a different system.
        </p>
        <p>
          The most misunderstood symptom is the oily black weep at the exhaust of a lightly-loaded set: <strong>wet
          stacking</strong>, caused by running a diesel below ~30% load so combustion never gets hot enough to burn the fuel
          completely. The fix is not a repair but a change of operation — load the set properly or run an annual load-bank burn —
          which is why diagnosis must consider how the set is used, not just its mechanical condition.
        </p>
      </DeepDiveBlock>

      <DeepDiveBlock heading="4. Fix the cause, not the symptom" accent="amber">
        <p>
          The discipline that separates a repair that lasts from one that recurs is asking <em>why</em> a part failed. A burnt
          alternator winding that shows a single-phasing pattern points to a protection or supply fault that will kill the new
          winding too; a repeatedly flat battery points to a charger or parasitic-load fault, not just a tired battery; a
          recurring overheat points to airflow or load, not just a thermostat. We log the as-found condition and chase the root
          cause, because the cheapest fault is the one that does not come back.
        </p>
        <p>
          This is also where a maintenance SLA earns its keep: a set that is exercised under load, has its battery load-tested,
          its fuel kept fresh and its alarms reviewed will rarely spring the no-start surprise in the first place. Diagnosis is
          cheaper as prevention than as emergency.
        </p>
      </DeepDiveBlock>

      <Callout title="Set won’t start or keeps tripping?" accent="amber">
        Tell us the brand, the controller and exactly what it does (or the fault code on the panel) and our engineers will
        diagnose it — usually remotely first, then on site with the right parts. Call <strong>+254&nbsp;768&nbsp;860&nbsp;665</strong>
        or <strong>+254&nbsp;782&nbsp;914&nbsp;717</strong>.
      </Callout>
    </DeepDiveSection>
  );
}
