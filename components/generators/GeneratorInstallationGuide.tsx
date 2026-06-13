// ═══════════════════════════════════════════════════════════════════════════════
// GeneratorInstallationGuide — server-rendered (crawlable) reference content that
// accompanies the AutoSmart sizer on /generators/installation. Explains the sizing
// principles, the complete changeover materials list, power factor, external fuel
// tank, exhaust, and the cage + plinth — with an installation one-line diagram.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DeepDiveSection,
  DeepDiveBlock,
  FormulaBlock,
  SpecTable,
  Callout,
} from '@/components/content/EngineeringDeepDive';

function InstallOneLine() {
  return (
    <figure className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <figcaption className="text-sm font-semibold text-emerald-300/80 mb-3">
        Standby installation one-line: utility + generator into an automatic transfer switch, then the main board to the load.
      </figcaption>
      <svg viewBox="0 0 600 240" className="w-full h-auto" role="img" aria-label="Generator standby installation one-line diagram">
        {/* utility */}
        <text x="70" y="30" textAnchor="middle" fontSize="12" fill="#22d3ee">KPLC Grid</text>
        <line x1="70" y1="38" x2="70" y2="90" stroke="#22d3ee" strokeWidth="2" />
        {/* generator */}
        <circle cx="300" cy="40" r="26" fill="#0a0a0a" stroke="#34d399" strokeWidth="2" />
        <text x="300" y="45" textAnchor="middle" fontSize="13" fill="#34d399" fontWeight="bold">GEN</text>
        <line x1="300" y1="66" x2="300" y2="90" stroke="#34d399" strokeWidth="2" />
        {/* ATS */}
        <rect x="40" y="90" width="320" height="40" fill="none" stroke="#fbbf24" strokeWidth="2" rx="6" />
        <text x="200" y="115" textAnchor="middle" fontSize="13" fill="#fbbf24" fontWeight="bold">AUTOMATIC TRANSFER SWITCH (ATS)</text>
        {/* main board */}
        <line x1="200" y1="130" x2="200" y2="160" stroke="#9ca3af" strokeWidth="2" />
        <rect x="150" y="160" width="100" height="34" fill="none" stroke="#9ca3af" strokeWidth="2" rx="4" />
        <text x="200" y="182" textAnchor="middle" fontSize="12" fill="#e5e7eb">MAIN DB</text>
        <line x1="200" y1="194" x2="200" y2="216" stroke="#9ca3af" strokeWidth="2" />
        <text x="200" y="232" textAnchor="middle" fontSize="12" fill="#e5e7eb">LOADS</text>
        {/* earth */}
        <line x1="470" y1="90" x2="470" y2="150" stroke="#a3e635" strokeWidth="2" />
        <text x="470" y="80" textAnchor="middle" fontSize="11" fill="#a3e635">Earth electrode</text>
        <line x1="455" y1="150" x2="485" y2="150" stroke="#a3e635" strokeWidth="2" />
        <line x1="459" y1="156" x2="481" y2="156" stroke="#a3e635" strokeWidth="2" />
        <line x1="463" y1="162" x2="477" y2="162" stroke="#a3e635" strokeWidth="2" />
      </svg>
    </figure>
  );
}

export default function GeneratorInstallationGuide() {
  return (
    <DeepDiveSection
      id="installation-engineering"
      eyebrow="Installation engineering"
      title="Sizing the Complete Installation: Cable, Changeover & Everything Around the Set"
      accent="emerald"
      intro="A generator is only as good as its installation. The set is the easy part — the cable, the changeover, the earthing, the fuel, the exhaust and the civil works are what make it safe, legal and reliable. This is how each is sized, and the complete materials list for a proper standby installation."
      sources={[
        'IEC 60364 — low-voltage installation design, protection and verification.',
        'IEC 60364-7-551 — low-voltage generating sets.',
        'ISO 8528-1 — generating-set ratings and full-load current.',
        'Manufacturer canopy/plinth, exhaust back-pressure and fuel-system guidance.',
      ]}
    >
      <DeepDiveBlock heading="From rating to current — the number everything follows" accent="emerald">
        <p>
          Every downstream size starts from the generator&apos;s <strong>full-load current (FLC)</strong>, derived from its kVA
          rating and the system voltage. The cable, the breaker, the changeover and the earth are all sized from this current,
          with margins for continuous operation (125%) and for the real installation conditions (heat, grouping, burial) that
          <em> derate</em> a cable&apos;s capacity. Our AutoSmart sizer above does this instantly; the formula below is what it
          applies.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Full-load current and cable sizing basis"
        expression="I_FL = kVA × 1000 ÷ (√3 × V)    Design current = I_FL × 1.25 ÷ derate"
        where={[
          ['I_FL', 'full-load current (A), 3-phase'],
          ['V', 'line voltage (415 V in Kenya)'],
          ['1.25', 'continuous-load factor'],
          ['derate', 'heat/grouping/burial factor (≤1.0)'],
        ]}
        example={<>A 100&nbsp;kVA set at 415&nbsp;V: I_FL ≈ 139&nbsp;A; design ≈ 174&nbsp;A → a ~70&nbsp;mm² copper cable and a 160&nbsp;A breaker, then volt-drop checked over the run.</>}
        accent="emerald"
      />

      <DeepDiveBlock heading="The changeover (ATS) and why volt-drop also decides the cable" accent="emerald">
        <p>
          The <strong>automatic transfer switch (ATS / changeover)</strong> is the heart of a standby installation: it switches
          the load between the grid and the generator, break-before-make, and it must be rated for the full load current with the
          right number of poles (3- or 4-pole, the 4th switching the neutral where the earthing scheme requires it). Sized too
          small, it overheats; chosen without the right transition type (open vs closed), it either drops the load briefly or
          requires utility agreement to parallel.
        </p>
        <p>
          The cable is sized by two tests, and the larger wins: it must <strong>carry</strong> the design current (ampacity after
          derating), and it must keep the <strong>volt-drop</strong> over the run within limits (typically ≤2.5% so the load sees
          good voltage). A long run between a remote generator and the building can force a larger cable purely on volt-drop —
          which is exactly why the sizer asks for the cable length, not just the rating.
        </p>
      </DeepDiveBlock>

      <InstallOneLine />

      <DeepDiveBlock heading="Power factor: size for kVA, bill for kW" accent="emerald">
        <p>
          A generator is rated in kVA but does real work in kW, linked by the power factor (typically 0.8 for the set). A site
          full of motors at a poor power factor draws more current than its kW suggests, so the installation — cable, ATS,
          breaker — is sized on the kVA/current, not the kW. Where the load&apos;s power factor is poor, <strong>power-factor
          correction</strong> at the main board reduces the current the whole installation must carry and can let a smaller set
          and smaller cables do the job.
        </p>
      </DeepDiveBlock>

      <DeepDiveBlock heading="External fuel tank, exhaust and the civil works" accent="emerald">
        <p>
          For any meaningful autonomy, the set needs an <strong>external (bulk or day) fuel tank</strong> sized to the run-time
          required — built bunded (a containment volume to catch a leak), vented and protected against theft. The sizer estimates
          the tank from the fuel burn and your target autonomy hours.
        </p>
        <p>
          The <strong>exhaust</strong> must be sized so back-pressure stays within the engine maker&apos;s limit (an undersized
          pipe chokes the engine and overheats it), fitted with a residential or industrial <strong>silencer</strong> to meet the
          site&apos;s noise target, and routed with proper supports, a condensate drain and safe termination away from intakes and
          people. The <strong>generator cage / canopy</strong> protects the set and attenuates noise, and it sits on a reinforced
          <strong> concrete plinth</strong> raised ~150&nbsp;mm above ground, sized to the set with <strong>anti-vibration
          mounts</strong> between machine and base. The sizer gives indicative canopy and plinth dimensions for your rating.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="Complete standby-installation materials checklist"
        accent="emerald"
        highlightCol={0}
        headers={['Item', 'Purpose', 'Sized / specified by']}
        rows={[
          ['Supply cable (Cu/Al)', 'Set → ATS → board', 'FLC ×1.25, derating, volt-drop'],
          ['Main breaker (MCCB)', 'Overload / fault protection', 'Next standard ≥ FLC ×1.25'],
          ['ATS / changeover', 'Grid ↔ generator switching', '≥ FLC, 3/4-pole, open/closed transition'],
          ['Earth (PE) + electrode', 'Safety, fault clearing', 'Phase size rule + soil resistivity'],
          ['Busbar / distribution', 'Load distribution', 'Total current, fault bracing'],
          ['External fuel tank + bund', 'Autonomy, spill containment', 'Fuel burn × autonomy + reserve'],
          ['Exhaust + silencer', 'Gas removal, noise', 'Back-pressure limit, noise target'],
          ['Cage / canopy', 'Protection, attenuation', 'Set size, noise spec'],
          ['Concrete plinth + AV mounts', 'Foundation, vibration', 'Set weight, footprint'],
          ['PFC, SPD, remote stop, signage', 'Efficiency, safety, code', 'Load PF, lightning risk, regulations'],
        ]}
      />

      <Callout title="From sizing to a turnkey installation" accent="emerald">
        Use the AutoSmart sizer above to plan, then send it to us — we deliver the complete installation: cable, changeover,
        earthing, fuel, exhaust, cage and plinth, commissioned and certified. Call <strong>+254&nbsp;768&nbsp;860&nbsp;665</strong>
        or <strong>+254&nbsp;782&nbsp;914&nbsp;717</strong>.
      </Callout>
    </DeepDiveSection>
  );
}
