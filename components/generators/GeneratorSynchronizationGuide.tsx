// ═══════════════════════════════════════════════════════════════════════════════
// GeneratorSynchronizationGuide — a complete, server-rendered teaching reference on
// paralleling/synchronising generator sets. 50+ paragraphs covering theory, the four
// conditions, the full procedure, load sharing, sizing, cabling, switchgear, every
// major controller family, and detailed troubleshooting — with SVG diagrams and an
// animated synchroscope as a built-in visual teaching aid ("video"). Reference-grade,
// for engineers and engineering/electrical colleges. Unique to this page.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DeepDiveSection,
  DeepDiveBlock,
  FormulaBlock,
  SpecTable,
  Callout,
} from '@/components/content/EngineeringDeepDive';

// ── Animated synchroscope (the visual "video" teaching aid) ─────────────────────
function Synchroscope() {
  return (
    <figure className="rounded-2xl border border-amber-500/25 bg-white/[0.03] p-6 flex flex-col items-center">
      <figcaption className="text-sm font-semibold text-amber-300/80 mb-4 self-start">
        Animated synchroscope — the needle turns at the slip frequency (incoming vs running set).
        Close the breaker only at the 12&nbsp;o&apos;clock &quot;in-phase&quot; zone, turning slowly clockwise (slightly fast).
      </figcaption>
      <svg viewBox="0 0 240 240" className="w-56 h-56" role="img" aria-label="Animated synchroscope dial">
        <circle cx="120" cy="120" r="110" fill="#0a0a0a" stroke="#3f3f46" strokeWidth="2" />
        <circle cx="120" cy="120" r="110" fill="none" stroke="#22c55e" strokeWidth="6" strokeDasharray="20 671" strokeDashoffset="-336" opacity="0.9" />
        {/* 12 o'clock SYNC marker */}
        <text x="120" y="26" textAnchor="middle" fontSize="11" fill="#22c55e" fontWeight="bold">SYNC</text>
        <text x="206" y="124" textAnchor="middle" fontSize="10" fill="#9ca3af">FAST →</text>
        <text x="34" y="124" textAnchor="middle" fontSize="10" fill="#9ca3af">← SLOW</text>
        {/* tick marks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const x1 = 120 + Math.sin(a) * 100, y1 = 120 - Math.cos(a) * 100;
          const x2 = 120 + Math.sin(a) * 90, y2 = 120 - Math.cos(a) * 90;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#52525b" strokeWidth="2" />;
        })}
        {/* rotating needle */}
        <g className="synchro-needle" style={{ transformOrigin: '120px 120px' }}>
          <line x1="120" y1="120" x2="120" y2="28" stroke="#fbbf24" strokeWidth="3" />
          <polygon points="120,22 114,40 126,40" fill="#fbbf24" />
        </g>
        <circle cx="120" cy="120" r="8" fill="#fbbf24" />
      </svg>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .synchro-needle { animation: synchroSpin 7s linear infinite; }
        }
        @keyframes synchroSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </figure>
  );
}

// ── Two-waveform "coming into phase" diagram ───────────────────────────────────
function WaveformDiagram() {
  const w = 560, h = 170, mid = h / 2, amp = 52;
  const wave = (phase: number, freq: number) => {
    let d = '';
    for (let x = 0; x <= w; x += 4) {
      const y = mid - Math.sin((x / w) * Math.PI * 2 * freq + phase) * amp;
      d += (x === 0 ? 'M' : 'L') + x + ' ' + y.toFixed(1) + ' ';
    }
    return d;
  };
  return (
    <figure className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <figcaption className="text-sm font-semibold text-amber-300/80 mb-3">
        Incoming set (amber) vs running bus (cyan): match the amplitude (voltage), the wavelength (frequency)
        and the start point (phase angle) before closing.
      </figcaption>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label="Two AC waveforms being matched for synchronisation">
        <line x1="0" y1={mid} x2={w} y2={mid} stroke="#3f3f46" strokeWidth="1" />
        <path d={wave(0, 3)} fill="none" stroke="#22d3ee" strokeWidth="2.5" />
        <path d={wave(0.55, 3.08)} fill="none" stroke="#fbbf24" strokeWidth="2.5" />
        <text x="8" y="16" fontSize="11" fill="#22d3ee">Running bus</text>
        <text x="8" y={h - 8} fontSize="11" fill="#fbbf24">Incoming set (small slip + phase offset)</text>
      </svg>
    </figure>
  );
}

// ── Paralleling one-line diagram ────────────────────────────────────────────────
function OneLineDiagram() {
  return (
    <figure className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <figcaption className="text-sm font-semibold text-amber-300/80 mb-3">
        Two-set paralleling one-line: each set has its own breaker with a 25 sync-check relay; both feed a common bus to the load.
      </figcaption>
      <svg viewBox="0 0 560 230" className="w-full h-auto" role="img" aria-label="Two generator paralleling one-line diagram">
        {/* gensets */}
        {[120, 440].map((cx, i) => (
          <g key={i}>
            <circle cx={cx} cy="40" r="26" fill="#0a0a0a" stroke="#fbbf24" strokeWidth="2" />
            <text x={cx} y="45" textAnchor="middle" fontSize="14" fill="#fbbf24" fontWeight="bold">G{i + 1}</text>
            <line x1={cx} y1="66" x2={cx} y2="100" stroke="#9ca3af" strokeWidth="2" />
            {/* breaker */}
            <rect x={cx - 16} y="100" width="32" height="22" fill="none" stroke="#22c55e" strokeWidth="2" rx="3" />
            <text x={cx} y="116" textAnchor="middle" fontSize="10" fill="#22c55e">CB{i + 1}</text>
            <text x={cx + 24} y="114" fontSize="9" fill="#9ca3af">25</text>
            <line x1={cx} y1="122" x2={cx} y2="150" stroke="#9ca3af" strokeWidth="2" />
          </g>
        ))}
        {/* bus */}
        <line x1="80" y1="150" x2="480" y2="150" stroke="#22d3ee" strokeWidth="4" />
        <text x="280" y="142" textAnchor="middle" fontSize="11" fill="#22d3ee">Common bus (paralleled)</text>
        {/* load */}
        <line x1="280" y1="150" x2="280" y2="185" stroke="#9ca3af" strokeWidth="2" />
        <rect x="244" y="185" width="72" height="30" fill="none" stroke="#9ca3af" strokeWidth="2" rx="4" />
        <text x="280" y="205" textAnchor="middle" fontSize="12" fill="#e5e7eb">LOAD</text>
      </svg>
    </figure>
  );
}

export default function GeneratorSynchronizationGuide() {
  return (
    <DeepDiveSection
      id="generator-synchronization"
      eyebrow="Engineering teaching reference"
      title="Generator Synchronization & Paralleling: The Complete Guide"
      accent="amber"
      intro="When one set is not enough — or when you need N+1 redundancy in the generation itself — generators are run in parallel. Doing it safely means matching two live alternators almost perfectly before tying them together, then sharing the load fairly. This is the full method, the maths, the switchgear, every major controller and the troubleshooting — written so a working engineer and an electrical-engineering student can both use it."
      sources={[
        'ISO 8528-1 — generating sets: parallel operation and performance classes.',
        'IEEE 1547 / utility interconnection practice for paralleling and anti-islanding.',
        'IEEE C37.2 — standard device function numbers (25, 32, 46, 87, etc.).',
        'Woodward, DeepSea (DSE), ComAp and engine-OEM paralleling application notes.',
        'IEC 60364 / IEC 60909 — installation design and short-circuit calculation for the paralleling bus.',
      ]}
    >
      {/* 1 — Why parallel */}
      <DeepDiveBlock heading="1. Why synchronize generators at all?" accent="amber">
        <p>
          A single generator sized for the whole site is simple, but it has three weaknesses: it is a single point of failure, it
          is forced to run even when the load is small (wasting fuel and wet-stacking), and it cannot grow with the business
          without being replaced. <strong>Paralleling</strong> — running two or more sets connected to a common bus — solves all
          three. You gain redundancy (lose one set, the others carry on), efficiency (bring sets on and off line so each running
          set stays in its economical band), and scalability (add a set and synchronize it rather than scrapping the lot).
        </p>
        <p>
          The catch is that you cannot simply close a breaker and connect two live alternators. Each is an independent AC source
          with its own voltage, frequency and instantaneous phase. Tie them together when those do not match and the result is a
          violent equalising current — effectively a short circuit between two stiff sources — that can trip breakers, shear
          couplings, distort shafts and destroy windings. <strong>Synchronization</strong> is the disciplined process of making
          the two sources close enough to identical that they merge smoothly.
        </p>
        <p>
          Synchronization also applies when connecting a set to the utility grid (closed-transition transfer, peak-shaving, grid
          support) — there the generator must match the grid, which is an effectively infinite bus. The principles are the same;
          only the protection and the utility&apos;s interconnection rules become stricter.
        </p>
      </DeepDiveBlock>

      {/* 2 — The four conditions */}
      <DeepDiveBlock heading="2. The four conditions that must be met before closing" accent="amber">
        <p>
          Before a paralleling breaker may close, four conditions must all be satisfied between the incoming set and the live
          bus. Miss any one and the closure is unsafe.
        </p>
        <p>
          <strong>(1) Voltage magnitude</strong> must match — typically within a few percent. A voltage difference drives a
          circulating reactive (kVAr) current the instant the breaker closes. <strong>(2) Frequency</strong> must match very
          closely; in practice the incoming set is run a touch <em>fast</em> (a small positive slip, e.g. +0.1–0.2&nbsp;Hz) so
          that on closing it immediately takes a little load rather than being motored. <strong>(3) Phase sequence (rotation)</strong>
          — A-B-C — must be identical; a reversed rotation is catastrophic and is checked once at installation, not on every
          start. <strong>(4) Phase angle</strong> — the two waveforms must cross zero at the same instant (angle difference near
          0°) at the moment of closing.
        </p>
        <p>
          The diagram below shows the incoming set (amber) with a small slip and phase offset against the running bus (cyan).
          Synchronization is the act of nudging the amber wave until its amplitude, wavelength and start point all line up with
          the cyan one — then closing in the brief window when they coincide.
        </p>
      </DeepDiveBlock>

      <WaveformDiagram />

      <FormulaBlock
        label="The synchronising conditions (all must hold at the instant of closing)"
        expression="|V_inc − V_bus| ≈ 0    |f_inc − f_bus| ≈ 0 (slightly +)    phase angle ≈ 0°    same A-B-C rotation"
        where={[
          ['V', 'voltage magnitude'],
          ['f', 'frequency (incoming run slightly fast)'],
          ['phase angle', 'instantaneous difference between the two waveforms'],
          ['rotation', 'phase sequence — fixed at installation'],
        ]}
        accent="amber"
      />

      {/* 3 — Synchroscope */}
      <DeepDiveBlock heading="3. Reading the synchroscope and the check-sync relay" accent="amber">
        <p>
          The classic instrument that shows all of this at a glance is the <strong>synchroscope</strong>. Its needle rotates at
          the <em>slip frequency</em> — the difference between the incoming and bus frequencies. If the incoming set is fast the
          needle turns clockwise (toward &quot;FAST&quot;); if slow, anticlockwise. Twelve o&apos;clock is the in-phase point.
          The operator trims the incoming governor until the needle is turning <strong>slowly clockwise</strong> (set slightly
          fast) and closes the breaker just <em>before</em> it reaches 12 o&apos;clock, so the contacts make exactly at zero
          phase difference. A needle spinning fast means the frequencies are far apart — never close on a fast-spinning scope.
        </p>
        <p>
          On modern installations a <strong>check-synchronising (25) relay</strong> — or the synchronising function inside the
          genset controller — supervises all four conditions automatically and only permits (or commands) the close when they
          are within set windows. It is the electronic guardian that prevents an out-of-sync closure even if a human gets it
          wrong. The animated synchroscope here shows the idea: only close in the green &quot;SYNC&quot; zone at the top.
        </p>
      </DeepDiveBlock>

      <Synchroscope />

      {/* 4 — Methods */}
      <DeepDiveBlock heading="4. Manual, semi-automatic and automatic synchronizing" accent="amber">
        <p>
          There are three levels of automation. <strong>Manual</strong> synchronizing uses a synchroscope (or the lamp methods
          below) and a human closing the breaker — instructive, still used on small or legacy plant, but slow and error-prone.
          <strong> Semi-automatic</strong> uses a check-sync relay to supervise a manual close: the operator lines things up but
          the relay blocks an unsafe closure. <strong>Automatic</strong> synchronizing — standard on modern paralleling
          controllers — has the controller adjust the incoming set&apos;s governor and AVR to match frequency, phase and voltage,
          then issue the close command itself, all in a second or two.
        </p>
        <p>
          The traditional teaching methods deserve a mention because colleges still use them. In the <strong>three-dark-lamp</strong>
          method, lamps connected across the open breaker poles go dark when the sources are in phase (close at darkness). In the
          <strong> two-bright-one-dark</strong> method, the rotation of brightness shows whether the incoming set is fast or slow
          and indicates the in-phase instant. These lamp methods illustrate the physics beautifully but are not used on serious
          modern switchgear, where relays and controllers do the job precisely.
        </p>
      </DeepDiveBlock>

      {/* 5 — Step-by-step procedure */}
      <DeepDiveBlock heading="5. The step-by-step synchronizing procedure" accent="amber">
        <p>
          The following is the disciplined sequence we follow to bring an incoming set onto a live bus. Each step exists to
          protect the machines and the people near them.
        </p>
        <p><strong>Step 1 — Confirm the bus is live and healthy.</strong> Verify the running set(s) are stable, voltage and frequency nominal, and the bus is energised. Know which set is the &quot;lead&quot; holding the bus.</p>
        <p><strong>Step 2 — Start and warm the incoming set.</strong> Start it off-load, let oil pressure and temperature stabilise, and let it reach nominal voltage and frequency before attempting anything.</p>
        <p><strong>Step 3 — Confirm phase rotation.</strong> On a new or re-wired set, verify A-B-C rotation matches the bus (once, at commissioning). A reversed rotation must be corrected before any close is attempted.</p>
        <p><strong>Step 4 — Match the voltage.</strong> Trim the incoming set&apos;s AVR until its voltage equals the bus within the permitted window (a few percent). A voltage mismatch becomes circulating reactive current on close.</p>
        <p><strong>Step 5 — Match the frequency, slightly fast.</strong> Trim the governor so the incoming set runs a fraction above bus frequency (small positive slip). This ensures it picks up a little load on closing instead of being motored.</p>
        <p><strong>Step 6 — Watch the synchroscope / sync indication.</strong> The needle should turn slowly clockwise. If it spins quickly, the frequencies are too far apart — adjust the governor until the rotation is slow.</p>
        <p><strong>Step 7 — Close at the in-phase instant.</strong> Issue the close just before the needle reaches 12 o&apos;clock (or let the check-sync/auto-sync function close). The breaker contacts should make at near-zero phase difference.</p>
        <p><strong>Step 8 — Confirm the set is paralleled and stable.</strong> After closing, the set should immediately settle and begin sharing — watch for any oscillation (hunting) between sets.</p>
        <p><strong>Step 9 — Transfer / share load deliberately.</strong> Ramp the incoming set&apos;s governor up to take its share of real power (kW) and trim its AVR to take its share of reactive power (kVAr), so the load divides in proportion to set ratings.</p>
        <p><strong>Step 10 — Document and monitor.</strong> Log the parallel operation, watch reverse-power and load-sharing, and define the sequence for de-loading and opening a set cleanly when demand falls.</p>
      </DeepDiveBlock>

      <OneLineDiagram />

      {/* 6 — Load sharing */}
      <DeepDiveBlock heading="6. Load sharing after the breaker closes: kW and kVAr" accent="amber">
        <p>
          Closing the breaker is only half the job. Once paralleled, the sets must <strong>share the load fairly</strong>, and
          real power (kW) and reactive power (kVAr) are shared by two different controls. <strong>Real power (kW)</strong> is set
          by the engine governors — more fuel to an engine makes it try to speed up, and on a stiff parallel bus that extra
          torque becomes extra kW rather than extra rpm. <strong>Reactive power (kVAr)</strong> is set by the alternator
          excitation/AVRs — more excitation raises that machine&apos;s voltage tendency, which on the common bus becomes more
          kVAr from that set.
        </p>
        <p>
          Governors share kW in one of two modes. <strong>Droop</strong> lets frequency sag slightly with load (e.g. 3–4% from
          no-load to full-load); sets in droop share load by their droop settings, but bus frequency falls as load rises.
          <strong> Isochronous</strong> holds frequency dead constant; with multiple isochronous sets, a load-sharing line (or
          the controllers&apos; data link) tells each engine its fair share so they do not fight. Most modern multi-set plants
          run isochronous load sharing over the controller network, giving constant frequency and clean proportional sharing.
        </p>
        <p>
          Mismatched sharing is a classic fault: if one set hogs the kW (governor set high) while another is light, or one set
          carries all the kVAr (excitation high) while others run at unity, the plant is unbalanced and a lightly-loaded set can
          even be driven into <strong>reverse power</strong> — motored by the bus — which the 32 relay must trip to protect it.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Droop and proportional load sharing"
        expression="Droop % = (f_noload − f_fullload) ÷ f_fullload × 100"
        where={[
          ['f_noload', 'frequency at no load'],
          ['f_fullload', 'frequency at full load'],
          ['kW share', 'inversely follows each set’s droop setting'],
        ]}
        example={<>Two equally-rated sets each set to 4% droop share load 50/50; set one to 2% and it greedily takes more load for the same frequency change. Isochronous sharing removes this by commanding each engine its exact proportional share.</>}
        accent="amber"
      />

      {/* 7 — Sizing */}
      <DeepDiveBlock heading="7. Sizing a synchronized (paralleled) system" accent="amber">
        <p>
          Sizing a multi-set plant starts, like any generator job, from a measured load study and the worst-case motor start —
          but adds the question of <strong>how many sets and of what size</strong>. The total installed capacity must cover the
          peak demand with the chosen redundancy: for <strong>N+1</strong>, install one more set than the peak needs, so any one
          can fail or be serviced with the rest still carrying the load. Equal-sized sets are easiest to share load and stock
          spares for; mixed sizes are possible but complicate sharing.
        </p>
        <p>
          The art is choosing set size so that across the daily load curve, the running sets stay in their efficient,
          wet-stacking-safe band (above ~30% each). Several smaller sets that stage on and off as load varies beat one big set
          that idles — this is the efficiency win of paralleling. The controller&apos;s <strong>load-dependent start/stop</strong>
          brings sets online as load rises past thresholds and sheds them as it falls, keeping the running fleet well-loaded.
        </p>
        <p>
          The common bus, busbar and the incomer to the load must be rated for the <strong>sum</strong> of the paralleled sets,
          and — critically — the switchgear must withstand the combined <strong>prospective short-circuit current</strong> of all
          sets feeding a fault together (calculated per IEC&nbsp;60909). Paralleling multiplies fault current, so breaker breaking
          capacity and busbar bracing are sized for the worst case of every set contributing at once.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Capacity with N+1 redundancy"
        expression="Installed sets capacity ≥ Peak demand + one set;   Bus rating ≥ Σ set ratings"
        where={[
          ['Peak demand', 'measured maximum load (kVA)'],
          ['+ one set', 'the redundant unit for N+1'],
          ['Bus rating', 'sized for all sets paralleled'],
        ]}
        example={<>Peak 800&nbsp;kVA with three sets: 3 × 400&nbsp;kVA gives 1,200&nbsp;kVA installed — any one set can drop and the remaining 800&nbsp;kVA still covers peak (N+1).</>}
        accent="amber"
      />

      {/* 8 — Cabling & earthing */}
      <DeepDiveBlock heading="8. Cabling, busbar and the neutral/earthing trap" accent="amber">
        <p>
          Each set&apos;s cables to the paralleling breaker carry that set&apos;s full current, sized for current-carrying
          capacity, volt-drop and fault withstand to IEC&nbsp;60364 — the same rules as any feeder, but with fault levels raised
          by paralleling. The common busbar is sized for the total paralleled current and braced for the combined fault current.
          Conductor runs between sets should be kept balanced in length where practical so impedances (and therefore current
          sharing at the physical level) are even.
        </p>
        <p>
          The subtle, dangerous detail in paralleled systems is the <strong>neutral and earthing arrangement</strong>. If every
          set&apos;s neutral is solidly earthed and all neutrals are also bonded to a common point, <strong>triplen (3rd, 9th…)
          harmonic currents circulate</strong> between the machines through the neutral, overheating windings and nuisance-tripping
          earth-fault protection. The accepted solutions are to earth only one point of the system (a single bonded neutral for
          the paralleled bus) or to switch neutrals so only one set&apos;s neutral is connected at a time. Getting this wrong is a
          common cause of mysterious overheating and earth-fault trips on multi-set installations.
        </p>
        <p>
          Earthing must also satisfy protection and safety: a low-impedance earth so earth-fault relays see and clear faults, and
          step/touch-potential safety at the plant. On a paralleled system the earthing scheme is designed as a whole, not set by
          set, precisely because of the circulating-current issue.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="Cabling & busbar checklist for a paralleled plant"
        accent="amber"
        highlightCol={0}
        headers={['Element', 'Sized for', 'Watch out for']}
        rows={[
          ['Set-to-breaker cable', 'Set full-load current + volt-drop', 'Balance run lengths between sets'],
          ['Common busbar', 'Σ of all paralleled sets', 'Fault-current bracing (IEC 60909)'],
          ['Breaker breaking capacity', 'Combined prospective fault current', 'All sets feeding a fault together'],
          ['Neutral / earthing', 'Single-point earth or switched neutral', 'Circulating triplen-harmonic currents'],
        ]}
      />

      {/* 9 — Switchgear & protection */}
      <DeepDiveBlock heading="9. The switchgear and protection you actually need" accent="amber">
        <p>
          Paralleling switchgear is more than breakers. Each set needs a <strong>circuit breaker capable of synchronised
          closing</strong> (motorised, with the controller commanding the close at the in-phase instant), and a suite of
          <strong> protection relays</strong> identified by their IEEE&nbsp;C37.2 device numbers. The non-negotiables are the
          <strong> 25 sync-check</strong> (permits closing only in sync), <strong>32 reverse-power</strong> (trips a set being
          motored by the bus), <strong>46 negative-sequence</strong> (unbalance), <strong>40 loss-of-excitation</strong>,
          <strong> 27/59 under/over-voltage</strong>, <strong>81 under/over-frequency</strong>, and on larger machines
          <strong> 87 differential</strong> protection.
        </p>
        <p>
          These functions live either as discrete relays or — on modern plant — inside the genset paralleling controller, which
          integrates synchronising, load sharing, protection and metering in one device. The switchgear also provides the
          load-sharing interconnection (hard-wired lines or a controller data bus), the bus metering, and the
          maintenance-isolation and bus-tie arrangements that let a set be worked on safely while the others run.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="Key protection device functions (IEEE C37.2) for paralleling"
        accent="amber"
        highlightCol={0}
        headers={['Device', 'Function', 'Protects against']}
        rows={[
          ['25', 'Sync-check', 'Out-of-phase breaker closure'],
          ['32', 'Reverse power', 'A set being motored by the bus'],
          ['27 / 59', 'Under / over-voltage', 'AVR / excitation faults, bus collapse'],
          ['81', 'Under / over-frequency', 'Governor faults, overload'],
          ['46', 'Negative-sequence', 'Unbalanced loading'],
          ['40', 'Loss of excitation', 'Failed AVR / field'],
          ['87', 'Differential', 'Internal alternator faults'],
        ]}
      />

      {/* 10 — Controllers */}
      <DeepDiveBlock heading="10. The controllers: DeepSea, PowerWizard and 20+ makes" accent="amber">
        <p>
          The brain that synchronises and load-shares is the genset controller, and Kenya&apos;s installed base spans many
          families. <strong>DeepSea Electronics (DSE)</strong> is the regional workhorse: the DSE73xx/74xx (single-set AMF), and
          the paralleling DSE8610&nbsp;MkII, DSE8660 (bus-tie/mains), DSE7560 and DSE8620 handle synchronising and isochronous
          load sharing over the DSENet/MSC link. <strong>Woodward easYgen</strong> (3100/3200/3400/3500) and
          <strong> PowerWizard</strong> (1.0/2.0, on many engine-OEM sets) are equally common, as is <strong>ComAp</strong>
          (InteliGen, InteliSys, IG/IS-NT, InteliMains for bus-tie).
        </p>
        <p>
          Beyond those, the same job is done by Caterpillar <strong>EMCP</strong>, Cummins <strong>PowerCommand (PCC)</strong>,
          <strong> SmartGen</strong> (HGM/HMC paralleling), <strong>Datakom</strong>, <strong>Lovato</strong> (RGK series),
          <strong> Basler</strong> (DGC-2020), <strong>Mecc&nbsp;Alte</strong> (DST4602 Evo), <strong>Sices</strong> (GC600/DST),
          <strong> Kutai</strong>, <strong>Emko</strong>, <strong>Crompton/Selco</strong> sync relays, <strong>Be1/Beckwith</strong>,
          <strong> Thomson</strong>, <strong>ASCO</strong> paralleling switchgear, <strong>Deif</strong> (AGC-4/AGC-150) and
          <strong> Maru/Mebay</strong> controllers. They differ in configuration, fault codes and communications, which is exactly
          why controller-specific expertise matters when a plant will not synchronise.
        </p>
        <p>
          Whatever the brand, the controller does the same fundamental things: it measures bus and set voltage/frequency/phase,
          adjusts the governor (speed bias) and AVR (voltage bias), commands the synchronised breaker close, then runs isochronous
          kW and kVAr sharing — while applying the protection functions above. We configure, commission and troubleshoot across
          all of these families.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="Major paralleling-capable controller families (indicative models)"
        accent="amber"
        highlightCol={0}
        headers={['Make', 'Paralleling models', 'Notes']}
        rows={[
          ['DeepSea (DSE)', '8610 MkII, 8660, 7560, 8620', 'DSENet/MSC load share — regional default'],
          ['Woodward', 'easYgen 3100/3200/3400/3500', 'Also PowerWizard 1.0/2.0 on OEM sets'],
          ['ComAp', 'InteliGen, InteliSys, IG/IS-NT, InteliMains', 'Strong on complex multi-set/bus-tie'],
          ['Caterpillar', 'EMCP 4.x (paralleling)', 'OEM CAT sets'],
          ['Cummins', 'PowerCommand PCC (2300/3300)', 'OEM Cummins sets'],
          ['Deif', 'AGC-4, AGC-150', 'Advanced paralleling & power management'],
          ['SmartGen', 'HGM9500/9600, HMC series', 'Cost-effective paralleling'],
          ['Others', 'Basler DGC-2020, Mecc Alte DST4602, Sices, Datakom, Lovato RGK, Kutai, Emko, Mebay', '20+ makes serviced'],
        ]}
      />

      {/* 11 — Troubleshooting */}
      <DeepDiveBlock heading="11. Troubleshooting synchronization — in detail" accent="amber">
        <p>
          When a plant will not parallel or will not share, the symptom points to the cause. The most common is the set
          <strong> won&apos;t come into sync</strong>: the synchroscope spins fast and never settles. That is a frequency mismatch
          the governor cannot close — check the speed-bias output from the controller to the governor/actuator, the governor
          mode (it must be in the controllable mode, not fixed droop), and that the controller is actually commanding speed bias.
        </p>
        <p>
          The <strong>breaker trips immediately on closing</strong> (or there is a heavy thump) almost always means it closed
          out of phase — verify the 25 sync-check windows are not set too wide, that the close relay timing/breaker closing time
          is compensated in the controller (advance the close command by the breaker&apos;s closing time), and that the PT/VT
          sensing for bus and set is correct and in phase (a swapped or mis-wired sensing transformer is a classic culprit).
        </p>
        <p>
          A set <strong>trips on reverse power (32)</strong> shortly after paralleling means it is being motored — its governor is
          set too low so the bus drives it. Raise its speed bias / kW set-point so it takes load. The opposite, <strong>one set
          hogging all the kW</strong>, means its governor/load-share is set high relative to the others — check the load-share
          line continuity (a broken MSC/load-share link makes sets fight) and that all controllers are in isochronous load-share,
          not a mix of droop and isochronous.
        </p>
        <p>
          <strong>kVAr not sharing</strong> (one set carries all the reactive load, runs hot, or trips on over-excitation) points
          to the AVR cross-current/quadrature-droop compensation: the AVRs&apos; reactive-droop or cross-current compensation must
          be set and wired so excitation is shared. <strong>Hunting / oscillation</strong> between sets — power swinging back and
          forth — is a governor or AVR stability problem: detune the gains, check for a sticking actuator, and confirm the
          load-share signal is clean (noise on the line makes sets chase each other).
        </p>
        <p>
          <strong>Sync-check relay blocks every close</strong> even when the scope looks fine: check the relay&apos;s voltage,
          slip and angle windows and its sensing inputs — often the bus and incoming sensing are swapped or one phase is missing.
          <strong> Voltage won&apos;t match</strong>: AVR fault, wrong AVR mode, or sensing error. <strong>Earth-fault or
          overheating with no obvious load fault</strong> on a multi-set plant is the circulating-neutral problem from section 8 —
          revisit the neutral earthing (single-point or switched neutral). Methodically, every paralleling fault traces to one of:
          sensing (PT/VT wiring), bias outputs (governor/AVR), settings (windows, droop mode, share gains), or the neutral/earth
          scheme.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="Synchronization troubleshooting quick-reference"
        accent="amber"
        highlightCol={0}
        headers={['Symptom', 'Likely cause', 'First checks']}
        rows={[
          ['Synchroscope spins fast, never settles', 'Frequency mismatch, no speed bias', 'Governor mode, controller speed-bias output'],
          ['Breaker trips/thumps on close', 'Closed out of phase', '25 windows, breaker close-time advance, PT/VT wiring'],
          ['Set trips on reverse power (32)', 'Governor set too low → motored', 'Raise kW set-point / speed bias'],
          ['One set hogs kW', 'Load-share link / mode mismatch', 'MSC link continuity, isochronous on all'],
          ['kVAr not shared, one set hot', 'AVR reactive-droop/cross-current', 'AVR compensation set & wired'],
          ['Hunting / oscillation', 'Governor/AVR instability', 'Detune gains, actuator, clean share signal'],
          ['Sync-check blocks all closes', 'Sensing swapped / window too tight', 'Bus vs set sensing, relay windows'],
          ['Unexplained earth-fault / overheating', 'Circulating neutral current', 'Single-point earth / switched neutral'],
        ]}
      />

      {/* 12 — Safety & commissioning */}
      <DeepDiveBlock heading="12. Safety, commissioning and standards" accent="amber">
        <p>
          Paralleling is live, high-energy work: a mis-close releases enormous fault energy, so it is done by competent persons,
          behind proper protection, with the switchgear and relays commissioned and tested before the plant carries real load.
          Commissioning includes verifying phase rotation, proving the 25 sync-check windows and the breaker close-time
          compensation, testing the 32 reverse-power and other protections by injection, and a load-bank exercise that proves the
          sets synchronise, share and shed load correctly across the range.
        </p>
        <p>
          The work is governed by ISO&nbsp;8528 (set ratings and parallel operation), IEEE practice for device functions and
          interconnection, and IEC&nbsp;60364/60909 for the installation and fault levels. Documentation — settings, test
          certificates, the one-line diagram and the operating sequence — is handed over so the plant can be operated and
          maintained safely for its life. A paralleled plant that is undocumented is a plant nobody can safely modify later.
        </p>
      </DeepDiveBlock>

      {/* 13 — Teaching summary */}
      <DeepDiveBlock heading="13. Summary for engineers and students" accent="amber">
        <p>
          Reduced to its essence: synchronizing means matching <strong>voltage, frequency, phase angle and rotation</strong>,
          closing in the brief in-phase window (slightly fast), then sharing <strong>kW with the governors and kVAr with the
          AVRs</strong>, all supervised by protection (25, 32, 27/59, 81, 46, 40, 87) and orchestrated by a controller (DSE,
          Woodward/PowerWizard, ComAp, Deif and 20+ others). Size the plant for peak-plus-redundancy, rate the bus and breakers
          for the combined fault current, and earth the neutral at a single point to avoid circulating currents.
        </p>
        <p>
          Master those ideas and the diagrams above and you can read any paralleling switchboard in the country. This material is
          free to use for teaching in engineering and technical colleges — and when the theory meets a real plant that will not
          synchronise, our engineers commission and troubleshoot every controller family on this page.
        </p>
      </DeepDiveBlock>

      <Callout title="Need a paralleled plant designed, commissioned or fixed?" accent="amber">
        Whether it is two sets in N+1 for a hospital, a load-shared fleet for a factory, or a plant that trips every time it tries
        to synchronise, we design the switchgear, configure the controllers (DSE, Woodward, ComAp, Deif and more), and commission
        it under load. Call <strong>+254&nbsp;768&nbsp;860&nbsp;665</strong> or <strong>+254&nbsp;782&nbsp;914&nbsp;717</strong>.
      </Callout>
    </DeepDiveSection>
  );
}
