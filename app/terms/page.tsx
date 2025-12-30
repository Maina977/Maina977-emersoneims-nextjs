export const metadata = {
  title: 'Terms of Service | Emerson EiMS',
  description: 'Terms of service for Emerson EiMS digital services.',
};

export default function TermsPage() {
  return (
    <main className="eims-section min-h-screen">
      <div className="eims-shell py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Terms of Service</h1>
        <p className="mt-6 text-white/70">
          By using this website, you agree to use it lawfully and not attempt to disrupt, scrape, or misuse our services.
        </p>

        <div className="mt-12 space-y-8 text-white/75">
          <section>
            <h2 className="text-xl font-semibold text-white">Information accuracy</h2>
            <p className="mt-3">
              Site content is provided for general information and may change. Final engineering specifications and pricing
              are confirmed via a formal quotation and site assessment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Intellectual property</h2>
            <p className="mt-3">
              Unless stated otherwise, content and branding belong to Emerson EiMS and may not be reused without permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Limitation of liability</h2>
            <p className="mt-3">
              We are not liable for indirect losses arising from use of the site. Project outcomes depend on site
              conditions, maintenance, and operational factors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Contact</h2>
            <p className="mt-3">
              Questions about these terms: {' '}
              <a className="text-white underline underline-offset-4" href="mailto:info@emersoneims.com">
                info@emersoneims.com
              </a>
              .
            </p>
          </section>
        </div>
        </div>
      </div>
    </main>
  );
}
