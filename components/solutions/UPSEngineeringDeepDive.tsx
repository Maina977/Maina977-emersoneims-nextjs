// ═══════════════════════════════════════════════════════════════════════════════
// UPSEngineeringDeepDive — additive, server-rendered reference content for the UPS
// solutions page. UNIQUE topics: topology, VA vs W & crest factor, battery runtime
// (Peukert), autonomy sizing, efficiency/eco-mode, and N+1 redundancy.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DeepDiveSection,
  DeepDiveBlock,
  FormulaBlock,
  SpecTable,
  Callout,
} from '@/components/content/EngineeringDeepDive';

export default function UPSEngineeringDeepDive() {
  return (
    <DeepDiveSection
      id="ups-engineering"
      eyebrow="Engineering reference"
      title="UPS Engineering: Topology, Runtime & Redundancy for Critical Loads"
      accent="sky"
      intro="An uninterruptible power supply is the last line between a clean grid event and a crashed server, a spoilt vaccine batch or a stalled production line. Specifying one well means understanding topology, the difference between VA and watts, and how batteries really behave when you draw them hard."
      sources={[
        'IEC 62040-3 — UPS performance and test methods (classification VFI/VI/VFD).',
        'IEEE Std 446 (Orange Book) — emergency and standby power for industrial/commercial applications.',
        'Peukert’s law — capacity vs discharge rate for lead-acid batteries.',
        'IEC 62040-2 — UPS electromagnetic compatibility and input current distortion.',
        'Uptime Institute Tier standards — redundancy (N, N+1, 2N) for critical facilities.',
      ]}
    >
      {/* 1 ── Topology */}
      <DeepDiveBlock heading="1. The three topologies — and why the cheapest is rarely the right one" accent="sky">
        <p>
          UPS units are classified by IEC&nbsp;62040-3 by how they treat the incoming supply. An <strong>offline / standby
          (VFD)</strong> unit runs the load straight off the mains and only switches to inverter when the mains fails — cheap,
          with a few milliseconds of transfer gap, fine for a single PC, wrong for a server. A <strong>line-interactive
          (VI)</strong> unit adds an automatic voltage regulator (AVR) that bucks and boosts sags and surges without dipping
          into the battery — the sweet spot for small networks, routers and point-of-sale. An <strong>online
          double-conversion (VFI)</strong> unit continuously rectifies the mains to DC and re-inverts it to a clean sine wave,
          so the load never sees a transfer at all and is fully isolated from frequency and voltage disturbance.
        </p>
        <p>
          For data rooms, medical equipment, lab freezers and PLC-controlled production, the answer is almost always online
          double-conversion. The grid in much of Kenya is not just outage-prone but <em>dirty</em> — sags, spikes, brown-outs and
          frequency wander that quietly age sensitive electronics. A line-interactive unit rides the sags but still passes the
          waveform through; only the online topology gives a genuinely conditioned output.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="UPS topology selection (IEC 62040-3 class in brackets)"
        accent="sky"
        highlightCol={0}
        headers={['Topology', 'Transfer time', 'Conditioning', 'Use for']}
        rows={[
          ['Offline / standby (VFD)', '2–10 ms', 'Minimal', 'Single PC, till point'],
          ['Line-interactive (VI)', '2–6 ms', 'AVR (sag/surge)', 'Networks, CCTV, POS'],
          ['Online double-conversion (VFI)', '0 ms', 'Full (V + f)', 'Servers, medical, PLC, lab'],
        ]}
      />

      {/* 2 ── VA vs W */}
      <DeepDiveBlock heading="2. VA, watts and the power factor trap" accent="sky">
        <p>
          A UPS is rated in two numbers — <strong>VA (apparent power)</strong> and <strong>W (real power)</strong> — and
          undersizing happens when buyers read only the bigger VA figure. The ratio between them is the UPS&apos;s output power
          factor. Older units quoted 0.6–0.7, so a &quot;1,000&nbsp;VA&quot; unit could only deliver 600&nbsp;W. Modern IT loads
          (servers with power-factor-corrected supplies) draw at a power factor near 0.9–1.0, so a UPS must be matched to both
          the VA <em>and</em> the watt demand, whichever you hit first.
        </p>
        <p>
          Then there is <strong>crest factor</strong> — the ratio of peak to RMS current that switch-mode power supplies pull in
          sharp spikes. A UPS that can&apos;t supply the crest current will distort or trip even when the average load looks well
          within rating. We size against measured load, add headroom for the inrush of any large supplies, and never load a UPS
          past ~80% of either rating so there is room for growth and for battery-charging current.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="UPS rating check"
        expression="Required VA = ΣW ÷ PF_load     and verify W ≤ UPS_W rating"
        where={[
          ['ΣW', 'sum of connected real power (watts)'],
          ['PF_load', 'load power factor (≈0.9 modern IT)'],
          ['UPS_W', 'the UPS real-power (watt) rating'],
        ]}
        example={<>A 4,000&nbsp;W server load at PF&nbsp;0.9 → 4,444&nbsp;VA needed; choose a 6&nbsp;kVA/6&nbsp;kW unit so neither rating is loaded past ~75%.</>}
        accent="sky"
      />

      {/* 3 ── Runtime / Peukert */}
      <DeepDiveBlock heading="3. Runtime is not linear — Peukert and the battery reality" accent="sky">
        <p>
          The single biggest surprise in UPS ownership is how runtime collapses as load rises. Battery capacity is quoted at a
          gentle discharge; pull it hard and you get proportionally less out — the essence of <strong>Peukert&apos;s law</strong>.
          Double the discharge current and you may keep far less than half the runtime. So a UPS that backs a 50% load for
          20&nbsp;minutes will not back a 100% load for 10 — it will manage rather less.
        </p>
        <p>
          Heat compounds it. Battery life roughly <strong>halves for every 8–10&nbsp;°C above 20–25&nbsp;°C</strong>, and Kenyan
          comms rooms are often warm. This is why we specify the autonomy at the real load, site the batteries in the coolest
          practical spot, and schedule capacity tests — a UPS that has never been load-tested is a UPS whose runtime is a guess.
          When the autonomy needed runs to hours rather than minutes, the honest answer is a generator with a short-runtime UPS
          to bridge the start, not a battery room sized for the impossible.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Approximate battery runtime"
        expression="t ≈ (Wh_usable × η_inv) ÷ P_load"
        where={[
          ['Wh_usable', 'usable battery energy (V × Ah × DoD)'],
          ['η_inv', 'inverter efficiency (≈0.9)'],
          ['P_load', 'real load drawn (W)'],
        ]}
        example={<>A 192&nbsp;V / 9&nbsp;Ah string at 80% DoD ≈ 1,382&nbsp;Wh usable; backing a 2,000&nbsp;W load → 1,382 × 0.9 ÷ 2,000 ≈ <strong>0.62&nbsp;h ≈ 37&nbsp;min</strong> (less under Peukert at high current).</>}
        accent="sky"
      />

      {/* 4 ── Efficiency & eco-mode */}
      <DeepDiveBlock heading="4. Efficiency, eco-mode and the cost of conditioning" accent="sky">
        <p>
          Double-conversion isolation is not free — the rectifier/inverter chain dissipates energy as heat, so an online UPS
          running at 92–96% efficiency wastes a few percent of throughput continuously, and that heat then loads the room&apos;s
          cooling. Over a year on a large UPS that is real money. <strong>Eco-mode</strong> (and the newer multi-mode designs)
          bypass the conversion when the mains is healthy, lifting efficiency above 98%, then snap back to full conversion the
          instant the supply degrades — recovering most of the loss while keeping the protection.
        </p>
        <p>
          For a facility manager the figure that matters is total efficiency including cooling: every watt the UPS wastes is a
          watt the air-conditioning must also remove. We weigh eco-mode against the sensitivity of the load — for a hospital
          theatre we keep full double-conversion; for a general office IT room, multi-mode is the sensible economy.
        </p>
      </DeepDiveBlock>

      {/* 5 ── Redundancy */}
      <DeepDiveBlock heading="5. Redundancy: N, N+1 and what uptime actually requires" accent="sky">
        <p>
          A single UPS is a single point of failure — and the day it fails or goes into maintenance bypass is the day you needed
          it. Critical facilities therefore design in <strong>redundancy</strong>. &quot;N&quot; is exactly enough capacity for
          the load; <strong>N+1</strong> adds one spare module so any one can fail or be serviced with no loss; <strong>2N</strong>
          duplicates the entire system on independent feeds for the highest tiers. The right level follows the cost of downtime,
          not the cost of the UPS.
        </p>
        <p>
          Redundancy only delivers if the rest of the chain respects it: dual feeds into dual-corded equipment, a maintenance
          bypass so the UPS can be serviced live, and a generator behind it for outages longer than the batteries. We design the
          UPS, the bypass and the genset transfer as one system — because a redundant UPS fed from a single failed changeover is
          not redundant at all.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="System availability with N+1"
        expression="A = 1 − (1 − A_module)^(N+1)"
        where={[
          ['A', 'availability of the redundant set'],
          ['A_module', 'availability of one UPS module'],
          ['N+1', 'modules required plus one spare'],
        ]}
        example={<>Two modules each 99% available in an N+1 (N=1) set → 1 − (0.01)² = <strong>99.99%</strong>, roughly an hour of risk per year instead of three and a half days.</>}
        accent="sky"
      />

      <SpecTable
        caption="Redundancy levels vs facility criticality"
        accent="sky"
        headers={['Level', 'Meaning', 'Typical facility']}
        rows={[
          ['N', 'Exactly enough capacity', 'Small office, non-critical'],
          ['N+1', 'One redundant module', 'Clinics, SME data rooms, ISPs'],
          ['2N', 'Fully duplicated systems', 'Hospitals, banks, Tier III+ data centres'],
        ]}
      />

      <Callout title="Specify your UPS with an engineer" accent="sky">
        Tell us the critical load (kW and VA), the autonomy you need and how much an hour of downtime costs you, and we&apos;ll
        return a topology, sizing, battery-runtime calculation and a redundancy recommendation — with the generator interface
        designed in. Call <strong>+254&nbsp;768&nbsp;860&nbsp;665</strong> or use the enquiry form.
      </Callout>
    </DeepDiveSection>
  );
}
