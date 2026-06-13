// ═══════════════════════════════════════════════════════════════════════════════
// ControlsEngineeringDeepDive — additive, server-rendered reference content for
// /solutions/controls. UNIQUE angle: generator control & automation — AMF sequence,
// ATS transfer logic, synchronisation/load-sharing, controller families and telemetry.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DeepDiveSection,
  DeepDiveBlock,
  FormulaBlock,
  SpecTable,
  Callout,
} from '@/components/content/EngineeringDeepDive';

export default function ControlsEngineeringDeepDive() {
  return (
    <DeepDiveSection
      id="controls-engineering"
      eyebrow="Engineering reference"
      title="Generator Control & Automation: AMF, Transfer, Synchronisation"
      accent="violet"
      intro="A generator is only as good as the controller that decides when it runs, how it takes the load and when it hands back. Get the automation right and an outage is a flicker; get it wrong and the set either never starts or fights the grid. This is the logic inside modern generator control."
      sources={[
        'DeepSea Electronics (DSE), ComAp and Woodward/PowerWizard controller application notes.',
        'ISO 8528-1 — generating-set control and parallel operation.',
        'IEC 60947-6-1 — automatic transfer switching equipment (ATSE).',
        'IEEE 1547 / utility interconnection practice for paralleling and anti-islanding.',
        'Manufacturer synchronising and load-sharing (kW/kVAr) control practice.',
      ]}
    >
      <DeepDiveBlock heading="1. Auto Mains Failure (AMF): the start sequence" accent="violet">
        <p>
          The core job of a standby controller is <strong>Auto Mains Failure (AMF)</strong>: detect that the grid has failed,
          start the generator, prove it is healthy, transfer the load, and then reverse all of that cleanly when the grid
          returns. The sequence is deliberately timed — a short <strong>start delay</strong> ignores momentary dips so the set
          does not crank for a one-second flicker; a <strong>warm-up</strong> lets oil pressure and frequency stabilise before
          the load is applied; and on return, a <strong>return delay</strong> confirms the grid is genuinely back before
          transferring, followed by a <strong>cool-down</strong> run so the engine sheds heat before stopping.
        </p>
        <p>
          Each of those timers exists for a reason, and badly set ones cause real problems: too short a start delay wears the
          starter on every flicker; no cool-down cooks the turbocharger. We commission these settings to the engine and the
          site, not to factory defaults, because the controller&apos;s timing is the difference between a set that lasts and one
          that is quietly abused on every outage.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="Typical AMF timing (set to engine/site, not defaults)"
        accent="violet"
        highlightCol={0}
        headers={['Timer', 'Purpose', 'Typical range']}
        rows={[
          ['Start delay', 'Ignore momentary mains dips', '1–5 s'],
          ['Warm-up', 'Stabilise before loading', '5–30 s'],
          ['Transfer (break)', 'Open-transition changeover gap', '0.5–2 s'],
          ['Return delay', 'Confirm mains is stable', '10–60 s'],
          ['Cool-down', 'Shed engine heat before stop', '60–300 s'],
        ]}
      />

      <DeepDiveBlock heading="2. The transfer switch: open vs closed transition" accent="violet">
        <p>
          The <strong>automatic transfer switch (ATS)</strong> physically moves the load between the grid and the generator, and
          it must be <strong>break-before-make</strong> on a standby system — never connecting the two sources together unless
          the controller is deliberately synchronising. A standard <strong>open-transition</strong> transfer accepts a brief
          dead gap (covered by a UPS on critical loads). A <strong>closed-transition</strong> transfer momentarily parallels a
          synchronised generator with the grid for a bumpless changeover — useful for sensitive process loads, but it requires
          the utility&apos;s agreement and proper protection because it ties into the grid.
        </p>
        <p>
          A subtle but critical point: a redundant UPS behind a single, unproven transfer switch is not redundant — the ATS
          becomes the single point of failure. We design the transfer scheme, its interlocks and its maintenance bypass as part
          of the whole power system, so the changeover is something you can rely on and service safely while live.
        </p>
      </DeepDiveBlock>

      <DeepDiveBlock heading="3. Synchronisation and load sharing" accent="violet">
        <p>
          When one generator is not enough — or when you want N+1 redundancy in the generation itself — multiple sets run in
          parallel, and that demands <strong>synchronisation</strong>: matching voltage, frequency and phase angle before the
          breaker closes. Close out of sync and the resulting current surge can damage alternators and trip breakers; modern
          controllers do this automatically in a fraction of a second. Once paralleled, the controllers share the work,
          balancing real power (kW) by trimming each engine&apos;s fuelling and reactive power (kVAr) by trimming each
          alternator&apos;s excitation.
        </p>
        <p>
          Paralleling also enables smart operation: bringing sets on and off line as the load rises and falls so each running
          set stays in its efficient, wet-stacking-safe band rather than idling. For growing sites this is how capacity scales
          without throwing away the original investment — add a set and parallel it, rather than replacing the lot.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="The synchronising conditions (all must match before closing)"
        expression="V_gen ≈ V_bus    f_gen ≈ f_bus    phase angle ≈ 0°    same phase rotation"
        where={[
          ['V', 'voltage magnitude'],
          ['f', 'frequency'],
          ['phase angle', 'difference between the two waveforms'],
        ]}
        example={<>Closing a breaker with even a small phase mismatch produces a violent current transient — which is why synchronising is automated and protected, never done by eye.</>}
        accent="violet"
      />

      <DeepDiveBlock heading="4. The controllers: DSE, ComAp, PowerWizard" accent="violet">
        <p>
          The brains come from a few well-proven families. <strong>DeepSea Electronics (DSE)</strong> modules are the workhorse
          across much of Kenya for AMF and paralleling; <strong>ComAp</strong> controllers are common on larger and more complex
          multi-set installations; <strong>Woodward/PowerWizard</strong> ships on many engine-OEM sets. They all do the same
          fundamental jobs — engine control, protection, metering, AMF and (on the right models) synchronising — but their
          configuration, fault codes and communication differ, which is why controller-specific expertise matters when a set
          will not start or a transfer misbehaves.
        </p>
        <p>
          Beyond running the engine, these controllers are also the <strong>protection</strong> layer: over/under-voltage and
          frequency, over-current, oil-pressure and temperature shutdowns, over-speed, and battery monitoring. A correctly
          configured controller protects the asset and tells you exactly why it tripped — an incorrectly configured one either
          nuisance-trips or, worse, fails to protect.
        </p>
      </DeepDiveBlock>

      <DeepDiveBlock heading="5. Remote monitoring and predictive maintenance" accent="violet">
        <p>
          Modern controllers expose their data — engine hours, fuel level, battery health, fault history, load — over cellular
          or network links, so a fleet of sets across many sites can be watched from one screen. That turns maintenance from
          reactive to <strong>predictive</strong>: a falling battery voltage, a creeping coolant temperature or a fuel level
          dropping faster than expected raises a flag before it becomes a failed start on the day of an outage.
        </p>
        <p>
          For multi-site organisations this is transformative — instead of discovering a flat starting battery during a
          blackout, the system flags it days earlier on a routine alert. We integrate remote monitoring into the SLA so the
          generator that matters most is the one we already know is healthy, not the one we hope is.
        </p>
      </DeepDiveBlock>

      <Callout title="Get your automation commissioned properly" accent="violet">
        Whether it is an AMF panel that will not transfer cleanly, a controller that needs configuring (DSE, ComAp, PowerWizard),
        paralleling multiple sets, or adding remote monitoring to a fleet, we design, programme and commission the control. Call
        <strong> +254&nbsp;768&nbsp;860&nbsp;665</strong> or <strong>+254&nbsp;782&nbsp;914&nbsp;717</strong>.
      </Callout>
    </DeepDiveSection>
  );
}
