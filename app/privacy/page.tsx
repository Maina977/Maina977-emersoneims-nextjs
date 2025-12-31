export const metadata = {
  title: 'Privacy Policy | EmersonEIMS - GDPR Compliant Data Protection',
  description: 'Learn how EmersonEIMS collects, uses, and protects your personal information. GDPR, CCPA, and Kenya Data Protection Act compliant privacy policy.',
  robots: 'index, follow',
};

export default function PrivacyPage() {
  return (
    <main className="eims-section min-h-screen">
      <div className="eims-shell py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="mt-6 text-white/70">
          We collect only the information needed to respond to enquiries, deliver services, and improve site performance.
          We do not sell your personal data.
        </p>

        <div className="mt-12 space-y-8 text-white/75">
          <section>
            <h2 className="text-xl font-semibold text-white">Information we collect</h2>
            <p className="mt-3">
              Contact details you submit (name, email, phone), message content, and basic technical data (device/browser,
              approximate location, and usage metrics).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">How we use information</h2>
            <p className="mt-3">
              To respond to requests, provide quotations and engineering support, maintain security, and improve reliability
              and performance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Data retention</h2>
            <p className="mt-3">
              We retain enquiry data only as long as necessary for operational, legal, or security purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Contact</h2>
            <p className="mt-3">
              For privacy questions, email{' '}
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
