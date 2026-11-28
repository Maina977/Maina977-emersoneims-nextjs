import CookieSettingsButton from '@/components/compliance/CookieSettingsButton';

export const metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/privacy' },
  title: 'Privacy Policy',
  // PENDING management/legal approval (privacy correction 2026-11-27).
  // Management, 27 Nov 2026: the blanket "GDPR, CCPA, and Kenya Data
  // Protection Act compliant" claim was removed pending a documented legal
  // assessment. No compliance claim is made here or on the page.
  description: 'How EmersonEIMS handles personal data: what we collect, why, who receives it, cookies and your choices.',
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
              these Google services are not loaded and nothing is sent to Google. Closing the notice without choosing counts as
              no consent.
            </p>
            <p className="mt-3">
              Google Ads may also set cookies on Google&rsquo;s own domains (for example the IDE cookie on doubleclick.net).
              EmersonEIMS cannot delete cookies that belong to Google&rsquo;s domains; you can remove them in your browser
              settings or through Google&rsquo;s ad settings. Withdrawing your consent stops any further collection through
              this site.
            </p>
            <p className="mt-3">
              You can change or withdraw your choice at any time with &ldquo;Cookie settings&rdquo; at the foot of every page
              {' '}(or here:{' '}
              <CookieSettingsButton className="text-white underline underline-offset-4" />
              ). While you have accepted, the settings offer &ldquo;Withdraw consent&rdquo;; withdrawing, or choosing
              &ldquo;Essential Only&rdquo; or &ldquo;Reject All&rdquo;, stops future collection straight away and deletes the
              Google cookies on this site. It does not delete data already sent to Google, which Google handles under its own
              terms; to ask about it, contact us at the address below or use Google&rsquo;s own privacy tools.
            </p>
          </section>

          {/* PENDING management/legal approval (privacy correction 2026-11-27).
              Describes sendFormSubmitNotification in app/api/contact/route.ts as
              it is: called for every new enquiry, in parallel with the other
              delivery channels, from our server (not the visitor's browser). */}
          <section id="enquiries">
            <h2 className="text-xl font-semibold text-white">Enquiry forms and email delivery</h2>
            <p className="mt-3">
              When you send an enquiry or quote request, our server forwards it by email to our sales inbox. One of the
              delivery routes is FormSubmit (formsubmit.co), an email relay service: it receives your name, email address,
              phone number, company, the service and location you entered, the form you used, your message and our enquiry
              reference, and emails them to our sales inbox, with your email address set as the reply-to address. It is used
              for every new enquiry, alongside our other delivery routes, so that an enquiry still arrives if another route
              fails. (Processing arrangements and data location to be confirmed.)
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
