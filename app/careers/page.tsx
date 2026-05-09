export const metadata = {
  title: 'Careers | Emerson EiMS',
  description: 'Careers at Emerson EiMS — engineering excellence for critical infrastructure.',
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
