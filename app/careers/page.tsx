export const metadata = {
  title: 'Careers | EmersonEIMS — Power & Engineering Jobs in Kenya',
  description: 'Build your engineering career at EmersonEIMS: generators, solar, UPS, high-voltage, motors, HVAC and fabrication across Kenya. Field technicians, electrical engineers, solar specialists and operations roles. Apply today.',
  alternates: { canonical: 'https://www.emersoneims.com/careers' },
};

export default function CareersPage() {
  return (
    <main className="eims-section min-h-screen">
      <div className="eims-shell py-24">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Careers</h1>
        <p className="mt-6 text-white/70 max-w-2xl">
          We build and maintain mission-critical energy systems across East Africa. If you care about precision,
          reliability, and craft — we’d like to hear from you.
        </p>

        {/* Why work here */}
        <section className="mt-12 max-w-3xl space-y-4 text-white/75 leading-relaxed">
          <h2 className="text-2xl font-semibold text-white">Why build your career here</h2>
          <p>
            EmersonEIMS is a B2B power-engineering firm working on the systems that keep Kenyan industry, hospitals, telecom
            and commercial property running — diesel generators, solar PV, UPS, high-voltage distribution, motors, HVAC,
            boreholes, incineration and steel fabrication. That breadth means an engineer or technician here is exposed to far
            more than a single product line: in one month you might commission a hospital changeover, load-bank a 300&nbsp;kVA
            set, design a solar-hybrid for a flower farm and trace a fault on an 11&nbsp;kV intake.
          </p>
          <p>
            We work to recognised standards (IEC, ISO&nbsp;8528, IEEE, NFPA) and we document what we do, because our customers
            include auditors, regulators and risk committees. If you take pride in work that is engineered and provable rather
            than improvised, you will be at home here — and you will get better at your craft faster than almost anywhere else
            in the region, because the variety and the standards push you.
          </p>

          <h2 className="text-2xl font-semibold text-white pt-4">What we look for</h2>
          <p>
            Above formal qualifications, we look for people who are curious about <em>why</em> things fail, honest when they
            don&apos;t know, safe by instinct (this is high-voltage, rotating-machine, fuel-handling work — safety is not
            negotiable), and respectful of customers whose operations depend on getting the power back. Relevant training —
            electrical engineering, mechatronics, refrigeration, welding, renewable energy — matters, but a demonstrated record
            of careful, reliable field work matters just as much.
          </p>
          <p>
            We invest in the people we hire: manufacturer and controller training (Cummins, DSE, ComAp), exposure across
            disciplines, and a path from technician to lead engineer for those who earn it. We hire for the long term, and we
            promote from within.
          </p>

          <h2 className="text-2xl font-semibold text-white pt-4">How we hire</h2>
          <p>
            Send your CV and a short, specific note about something you have actually built, fixed or commissioned — the more
            concrete, the better. Shortlisted candidates have a technical conversation (often with a practical or scenario
            element relevant to the role) and a discussion of how you work safely and with customers. We respond to every
            serious application. EmersonEIMS is an equal-opportunity employer; we hire on merit and we value a workforce that
            reflects the communities we serve across all 47 counties.
          </p>
        </section>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {[ 
            { title: 'Field Technicians', desc: 'Installation, commissioning, and service work on-site.' },
            { title: 'Electrical Engineers', desc: 'System design, protection, and project execution.' },
            { title: 'Solar Specialists', desc: 'PV + storage design and performance verification.' },
            { title: 'Support & Operations', desc: 'Customer support, logistics, and process excellence.' },
          ].map((role) => (
            <div key={role.title} className="eims-card p-8">
              <h2 className="text-xl font-semibold">{role.title}</h2>
              <p className="mt-3 text-white/70">{role.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 eims-card p-8">
          <h2 className="text-xl font-semibold">Apply</h2>
          <p className="mt-3 text-white/70">
            Email your CV and a short note about what you build to{' '}
            <a className="text-white underline underline-offset-4" href="mailto:info@emersoneims.com?subject=Careers%20-%20Application">
              info@emersoneims.com
            </a>
            .
          </p>
        </div>
        </div>
      </div>
    </main>
  );
}
