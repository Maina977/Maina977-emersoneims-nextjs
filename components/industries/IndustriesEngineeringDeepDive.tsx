// ═══════════════════════════════════════════════════════════════════════════════
// IndustriesEngineeringDeepDive — additive, server-rendered reference content for
// the /industries hub. UNIQUE angle: the *power-reliability requirement by sector*
// (uptime targets, standards, the cost of an outage) — distinct from the per-service
// engineering pages. Helps procurement teams justify the right spec to their boards.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DeepDiveSection,
  DeepDiveBlock,
  FormulaBlock,
  SpecTable,
  Callout,
} from '@/components/content/EngineeringDeepDive';

export default function IndustriesEngineeringDeepDive() {
  return (
    <DeepDiveSection
      id="industries-engineering"
      eyebrow="Engineering reference"
      title="Power Reliability by Sector: What Each Industry Actually Requires"
      accent="cyan"
      intro="Every sector calls it 'backup power', but a hospital, a flower farm and a data centre are buying completely different things. This is how the reliability requirement changes by industry — the uptime targets, the standards behind them, and the real cost of getting it wrong — so the right people can justify the right specification."
      sources={[
        'Uptime Institute Tier Classification — data-centre redundancy (Tier I–IV) and availability targets.',
        'WHO / HTM 06-01 — electrical services for healthcare premises and essential/critical branch loads.',
        'Kenya Public Health and food-safety cold-chain requirements (vaccines, perishables).',
        'EPRA / KPLC supply-reliability statistics and commercial tariff bands.',
        'IEC 60364 / KS standards for electrical installations in commercial and industrial premises.',
      ]}
    >
      {/* 1 ── The cost of downtime */}
      <DeepDiveBlock heading="1. Start from the cost of an outage, not the price of a generator" accent="cyan">
        <p>
          The single most useful number in any power-resilience decision is rarely on the quotation: the <strong>cost of one
          hour of downtime</strong> for the business. For a textile mill it is spoilt batches and idle shifts; for a bank it is
          stalled transactions and regulatory exposure; for a hospital it is patient safety; for a cold store it is the entire
          contents. Until that figure is on the table, every power discussion is an argument about price. Once it is, the
          conversation becomes an investment case, and the right level of redundancy becomes obvious.
        </p>
        <p>
          Kenya&apos;s grid, for all its improvement, still delivers outages and voltage events that most businesses absorb as
          &quot;just how it is&quot; — quietly paying in lost output, damaged equipment and overtime. Quantifying that loss is
          the first thing we help a client do, because it reframes resilience from a grudge purchase into one of the better
          returns on capital a Kenyan business can make.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Annual cost of unreliable power"
        expression="C_outage = Outage_hours/yr × Cost_per_hour"
        where={[
          ['Outage_hours/yr', 'grid downtime + voltage events affecting operations'],
          ['Cost_per_hour', 'lost output + spoilage + idle labour + damage'],
        ]}
        example={<>A processor losing KSh&nbsp;180,000/hour over 60 outage hours a year carries a <strong>KSh&nbsp;10.8M</strong> annual exposure — against which a properly engineered standby system is trivially justified.</>}
        accent="cyan"
      />

      {/* 2 ── Availability tiers */}
      <DeepDiveBlock heading="2. The language of uptime: what 'three nines' really costs" accent="cyan">
        <p>
          Reliability is measured in <strong>availability</strong> — the percentage of time power is there when needed — and the
          jump between levels is steeper than it looks. 99% availability sounds excellent until you realise it permits more than
          three and a half days of downtime a year; 99.99% (&quot;four nines&quot;) allows under an hour. Each extra nine
          typically means another layer of redundancy — a second generator, an N+1 UPS, dual feeds — and a real step up in cost.
          The art is matching the nines to the sector&apos;s genuine need, not over-buying for prestige or under-buying for price.
        </p>
        <p>
          A SACCO branch does not need a data-centre&apos;s 2N architecture, and a referral hospital&apos;s theatre block must
          never sit on a single point of failure. We size the resilience to the consequence, document the availability the design
          delivers, and let the client see exactly what each nine is buying them.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="Availability targets and what they permit"
        accent="cyan"
        highlightCol={1}
        headers={['Availability', 'Downtime / year', 'Typical sector fit']}
        rows={[
          ['99% (two nines)', '~3.65 days', 'Small office, retail'],
          ['99.9% (three nines)', '~8.8 hours', 'Hotels, schools, general commercial'],
          ['99.99% (four nines)', '~53 minutes', 'Hospitals, banks, telecom'],
          ['99.999% (five nines)', '~5 minutes', 'Tier III/IV data centres, core network'],
        ]}
      />

      {/* 3 ── Sector requirements */}
      <DeepDiveBlock heading="3. The same outage, four different problems" accent="cyan">
        <p>
          In <strong>healthcare</strong>, the standard (HTM 06-01 and its equivalents) splits the load into essential and
          critical branches, and the critical branch — theatres, ICU, life support — demands a transfer measured in
          milliseconds, which only an online UPS bridging to a generator can give. In <strong>manufacturing</strong>, the
          challenge is the brutal motor-starting and process loads that dictate generator and alternator sizing, plus power
          quality clean enough not to trip the PLCs. In <strong>cold chain and agribusiness</strong> — flower farms, dairies,
          vaccine stores — the enemy is spoilage, so the design priority is fast, automatic restoration of refrigeration and
          irrigation, often with solar to cut the daytime energy cost.
        </p>
        <p>
          In <strong>banking, telecom and data</strong>, it is continuity and clean power above all: dual-corded equipment, N+1
          or 2N UPS, and generators that synchronise and carry the load indefinitely. In <strong>hospitality</strong>, the guest
          must never know — silent, attenuated sets and seamless changeover. A supplier who offers all of these the same box has
          understood none of them. We start every sector engagement from its specific failure mode, because that is what the
          engineering has to defeat.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="Primary power requirement by sector"
        accent="cyan"
        highlightCol={0}
        headers={['Sector', 'Critical requirement', 'Typical solution stack']}
        rows={[
          ['Hospitals / healthcare', 'Millisecond transfer to critical branch', 'Online UPS + auto-start genset + ATS'],
          ['Manufacturing', 'Motor-start capacity + clean power', 'Sized genset + PFC + harmonic mitigation'],
          ['Cold chain / agri', 'Fast restore, low running cost', 'Genset + solar hybrid + auto restart'],
          ['Banking / telecom / data', 'Continuity, redundancy', 'N+1/2N UPS + synchronised gensets'],
          ['Hotels / hospitality', 'Silent, seamless changeover', 'Attenuated genset + ATS + load mgmt'],
          ['Real estate / construction', 'Site rental + permanent backup', 'Rental fleet → installed standby'],
        ]}
      />

      {/* 4 ── Compliance & documentation */}
      <DeepDiveBlock heading="4. Compliance is part of the product, not paperwork after it" accent="cyan">
        <p>
          For regulated sectors the installation is only complete when the documentation is. Banks need CBK-aligned reliability
          evidence; hospitals need installations and emissions (for incinerators) that satisfy the Ministry of Health and NEMA;
          government and donor-funded work needs AGPO-compliant vendors and an audit trail. A system that works but cannot be
          evidenced fails the audit that matters, and retro-fitting documentation onto an undocumented install is painful and
          expensive.
        </p>
        <p>
          We build the compliance in from the design stage — single-line diagrams, load schedules, test certificates, SLA logs
          and emissions records — so the client can answer any auditor, regulator or board with a folder rather than a scramble.
          For multi-site organisations we standardise this across every site under one contract, which is its own quiet form of
          resilience.
        </p>
      </DeepDiveBlock>

      <Callout title="Build the case for your sector" accent="cyan">
        Tell us your sector, your sites and your worst outage story, and we&apos;ll quantify your downtime exposure, recommend an
        availability target with the architecture to meet it, and provide the compliance documentation your auditors expect.
        Call <strong>+254&nbsp;768&nbsp;860&nbsp;665</strong> or <strong>+254&nbsp;782&nbsp;914&nbsp;717</strong>, or use the
        enquiry form.
      </Callout>
    </DeepDiveSection>
  );
}
