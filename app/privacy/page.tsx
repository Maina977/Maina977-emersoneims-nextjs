import CookieSettingsButton from '@/components/compliance/CookieSettingsButton';

export const metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/privacy' },
  title: 'Privacy Policy',
  description: 'Learn how EmersonEIMS collects, uses, and protects your personal information. GDPR, CCPA, and Kenya Data Protection Act compliant privacy policy.',
  robots: 'index, follow',
};

export default function PrivacyPage() {
  return (
    <div className="eims-section min-h-screen">
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

          {/* PENDING management/legal approval (privacy correction 2026-11-27).
              The cookie notice links here for details and withdrawal, and this page
              said nothing about cookies or Google. Exact text and reasons:
              EmersonEIMS-proposals/privacy-consent-2026-11-27/PROPOSED-NOTICE-WORDING.md */}
          <section id="cookies">
            <h2 className="text-xl font-semibold text-white">Cookies, analytics and advertising</h2>
            <p className="mt-3">
              Essential cookies and similar storage keep the site working and remember your cookie choice. They are always on.
            </p>
            <p className="mt-3">
              Only if you choose &ldquo;Accept All&rdquo;, we also use Google Analytics, to measure how the site is used, and
              Google Ads, to measure our advertising and the enquiries it produces. Google then receives data such as your IP
              address, device and browser information, the pages you visit and how you arrived, and may process it outside Kenya
              under its own terms. Before you choose, and if you choose &ldquo;Essential Only&rdquo; or &ldquo;Reject All&rdquo;,
              these Google services are not loaded and nothing is sent to Google.
            </p>
            <p className="mt-3">
              You can change or withdraw your choice at any time with &ldquo;Cookie settings&rdquo; at the foot of every page
              {' '}(or here:{' '}
              <CookieSettingsButton className="text-white underline underline-offset-4" />
              ). Withdrawing stops future collection straight away and deletes the Google cookies on this site. It does not
              delete data already sent to Google, which Google handles under its own terms; to ask about it, contact us at the
              address below or use Google&rsquo;s own privacy tools.
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
    </div>
  );
}
