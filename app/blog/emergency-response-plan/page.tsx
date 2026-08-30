import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/blog/emergency-response-plan' },
  title: 'Emergency Response Plan: Before Power Fails',
  description: 'Power outage emergency plan. Procedures, communication, recovery steps. Minimize downtime and losses.',
};

export default function EmergencyPlanBlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <article className="max-w-3xl mx-auto px-4 py-20">
        <header className="mb-12">
          <Link href="/blog" className="text-red-400 hover:text-red-300 text-sm inline-block mb-4">
            ← Back to Blog
          </Link>
          <h1 className="text-5xl font-bold mb-4">Emergency Response Plan: Before Power Fails</h1>
          <p className="text-gray-400 text-sm">Published: July 24, 2026 | Read time: 6 minutes</p>
        </header>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <p className="text-lg leading-relaxed">
            Power dies at 2 PM. You're not prepared. Confusion. No communication. Customers frustrated. Some systems fail. Recovery is chaotic. That's a crisis.
          </p>

          <p>
            An emergency plan prevents chaos. When power dies, you execute the plan. Controlled, organized, minimal losses.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Components of a Good Plan</h2>

          <h3 className="text-xl font-bold text-red-400 mt-6 mb-3">1. Emergency Contacts (Always Updated)</h3>
          <ul className="list-disc list-inside space-y-2 mt-3 ml-2 text-sm">
            <li>Generator service provider (we provide 24/7)</li>
            <li>Kenya Power outage reporting line</li>
            <li>Building electrician</li>
            <li>Key personnel contact list</li>
            <li>Customer notification channels (email, SMS, phone)</li>
          </ul>

          <h3 className="text-xl font-bold text-red-400 mt-6 mb-3">2. Immediate Actions (First 30 Seconds)</h3>
          <div className="bg-slate-800/50 border border-red-500/20 rounded-lg p-4 my-4 text-sm space-y-2">
            <p>□ Announce to staff: "Grid power is down. Backup power activating."</p>
            <p>□ Check if generator is running (should auto-start)</p>
            <p>□ Alert manager/operations lead</p>
            <p>□ Begin customer communication (if applicable)</p>
          </div>

          <h3 className="text-xl font-bold text-red-400 mt-6 mb-3">3. Load Management (If Generator Is Undersized)</h3>
          <p>
            If your backup power can't handle full load:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3 ml-2 text-sm">
            <li>Shut down non-critical loads first (water heating, ice machines)</li>
            <li>Reduce HVAC to minimum (just maintain)</li>
            <li>Keep critical systems (servers, production, refrigeration)</li>
          </ul>

          <h3 className="text-xl font-bold text-red-400 mt-6 mb-3">4. Customer Communication</h3>
          <p>
            What to communicate (via email, SMS, social media):
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3 ml-2 text-sm">
            <li>"Power is out. We're operating on backup generator."</li>
            <li>"Services limited but operational."</li>
            <li>"Estimated restoration time: [realistic estimate]"</li>
            <li>Updates every 15-30 minutes</li>
          </ul>

          <h3 className="text-xl font-bold text-red-400 mt-6 mb-3">5. Safety Checks</h3>
          <ul className="list-disc list-inside space-y-2 mt-3 ml-2 text-sm">
            <li>Ensure ATS (automatic transfer switch) transferred power smoothly</li>
            <li>Verify generator is running normally (no alarms)</li>
            <li>Check fuel level (running long outage = monitor fuel)</li>
            <li>Ensure no one is near generator (noise/exhaust hazard)</li>
          </ul>

          <h3 className="text-xl font-bold text-red-400 mt-6 mb-3">6. Documentation</h3>
          <ul className="list-disc list-inside space-y-2 mt-3 ml-2 text-sm">
            <li>Record outage start time</li>
            <li>Note generator start time</li>
            <li>Track any issues or alarms</li>
            <li>Record when power returns</li>
          </ul>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Recovery Phase (Power Returns)</h2>

          <div className="bg-slate-800/50 border border-red-500/20 rounded-lg p-4 my-4 text-sm space-y-2">
            <p>1. Don't immediately turn everything back on (voltage surge risk)</p>
            <p>2. Wait 2-5 minutes for grid to stabilize</p>
            <p>3. ATS should automatically transfer back to grid</p>
            <p>4. Generator shuts down automatically (if properly configured)</p>
            <p>5. Gradually turn on non-critical systems (don't spike load)</p>
            <p>6. Run data integrity checks (if using systems)</p>
            <p>7. Notify customers: "Power restored. All systems normal."</p>
          </div>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Scenario Training</h2>

          <p>
            Annually, run a drill:
          </p>
          <ol className="list-decimal list-inside space-y-2 mt-3 ml-2 text-sm">
            <li>Turn off grid power (controlled test)</li>
            <li>Verify generator activates</li>
            <li>Run through communication steps</li>
            <li>Test load management (if needed)</li>
            <li>Verify recovery procedures</li>
            <li>Document any issues</li>
          </ol>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Post-Outage Review</h2>

          <p>
            After each outage:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3 ml-2 text-sm">
            <li>Review what worked</li>
            <li>Identify what didn't</li>
            <li>Update the plan</li>
            <li>Retrain staff if needed</li>
            <li>Check generator for issues</li>
          </ul>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Plan Template Checklist</h2>

          <div className="bg-slate-800/50 border border-red-500/20 rounded-lg p-6 my-6 text-sm space-y-2">
            <p>□ Emergency contacts list (printed + digital)</p>
            <p>□ Generator manual + startup guide</p>
            <p>□ ATS operation guide</p>
            <p>□ Load management procedures</p>
            <p>□ Customer communication templates (email, SMS, website)</p>
            <p>□ Safety procedures</p>
            <p>□ Recovery checklist</p>
            <p>□ Post-outage review form</p>
            <p>□ Staff training schedule</p>
            <p>□ Annual drill schedule</p>
          </div>

          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mt-8">
            <p className="text-red-300 mb-4">
              <strong>Need help creating an emergency plan?</strong> We develop custom procedures for your facility and train your team.
            </p>
            <Link href="/contact?type=emergency-planning" className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all">
              Develop Emergency Plan
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
