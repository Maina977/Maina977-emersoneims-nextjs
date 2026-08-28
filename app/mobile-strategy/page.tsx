import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mobile Strategy | Field Operations',
  description: 'Mobile-first backup power solutions and field service platform. Real-time monitoring, emergency dispatch, and technician coordination across 47 counties.',
};

export default function MobileStrategyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Mobile-First Field Operations</h1>
          <p className="text-xl text-gray-300">Real-time visibility into backup power systems. From field technicians to operations centers across all 47 counties.</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Native Mobile Apps (In Development)</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-2xl font-bold text-blue-400 mb-4">Technician Mobile App</h3>
              <p className="text-gray-300 mb-6">Native iOS/Android app for field technicians. Job dispatch, real-time GPS tracking, equipment diagnostics, and customer communication.</p>
              <ul className="space-y-3 text-gray-300 mb-8">
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>Real-time job dispatch and routing</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>GPS tracking for field teams</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>Generator Oracle integration for diagnostics</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>Photo/video documentation of work</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>Offline mode for areas with no signal</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>Direct customer communication (SMS + chat)</span>
                </li>
              </ul>
              <p className="text-sm text-gray-400">
                <strong>Status:</strong> Design phase. Target launch Q4 2026.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-green-500/20 rounded-lg">
              <div className="text-4xl mb-4">🏗️</div>
              <h3 className="text-2xl font-bold text-green-400 mb-4">Operations Center Dashboard</h3>
              <p className="text-gray-300 mb-6">Real-time operations dashboard for dispatchers and field managers. Live visibility into all jobs, team locations, and system status across Kenya.</p>
              <ul className="space-y-3 text-gray-300 mb-8">
                <li className="flex gap-3">
                  <span className="text-green-400 font-bold">✓</span>
                  <span>Live map of all field technicians</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-400 font-bold">✓</span>
                  <span>Real-time job tracking and SLA alerts</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-400 font-bold">✓</span>
                  <span>Automated intelligent dispatch routing</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-400 font-bold">✓</span>
                  <span>Customer communication interface</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-400 font-bold">✓</span>
                  <span>Performance metrics and analytics</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-400 font-bold">✓</span>
                  <span>Emergency response coordination</span>
                </li>
              </ul>
              <p className="text-sm text-gray-400">
                <strong>Status:</strong> Architecture phase. Target launch Q4 2026.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Customer-Facing Mobile Capabilities</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-purple-400 mb-6">Progressive Web App (PWA)</h3>
              <p className="text-gray-300 mb-6">Installation-free mobile experience. Works on any smartphone. Syncs with the web platform automatically.</p>
              <div className="space-y-3 text-gray-300 mb-8">
                <p className="text-sm">
                  <strong>Current Status:</strong> Service worker enabled on website. Full offline support for key pages.
                </p>
                <p className="text-sm">
                  <strong>User Experience:</strong> "Add to Home Screen" allows app-like experience without app store.
                </p>
              </div>
              <div className="p-4 bg-purple-900/20 border border-purple-500/20 rounded">
                <p className="text-purple-400 text-sm font-bold mb-2">Capabilities</p>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Access offline</li>
                  <li>• Syncs when reconnected</li>
                  <li>• Works on any phone</li>
                  <li>• No app store download</li>
                </ul>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-cyan-400 mb-6">System Monitoring Portal</h3>
              <p className="text-gray-300 mb-6">Customers monitor their backup power systems in real-time from any device. Live sensor data, maintenance alerts, performance history.</p>
              <div className="space-y-3 text-gray-300 mb-8">
                <p className="text-sm">
                  <strong>Features:</strong> Real-time status, fuel level tracking, runtime history, maintenance schedules, emergency alerts.
                </p>
                <p className="text-sm">
                  <strong>Access:</strong> Mobile-responsive web portal. Works on phones, tablets, desktops.
                </p>
              </div>
              <div className="p-4 bg-cyan-900/20 border border-cyan-500/20 rounded">
                <p className="text-cyan-400 text-sm font-bold mb-2">Coming Features</p>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Native iOS app integration</li>
                  <li>• Native Android app integration</li>
                  <li>• Push notifications</li>
                  <li>• Automated maintenance alerts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Technology Stack</h2>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-orange-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-orange-400 mb-4">Frontend (User-Facing)</h3>
              <p className="text-gray-300 mb-4">React Native for cross-platform native apps (iOS/Android). React for responsive web PWA.</p>
              <ul className="grid md:grid-cols-2 gap-4 text-gray-300 text-sm">
                <li>• React Native (iOS/Android)</li>
                <li>• Expo framework for rapid deployment</li>
                <li>• Offline-first architecture</li>
                <li>• Real-time GPS tracking integration</li>
                <li>• Camera and photo capture</li>
                <li>• Push notifications via Firebase</li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-blue-400 mb-4">Backend (APIs & Data)</h3>
              <p className="text-gray-300 mb-4">Next.js API routes with PostgreSQL database. Real-time updates via WebSockets.</p>
              <ul className="grid md:grid-cols-2 gap-4 text-gray-300 text-sm">
                <li>• Next.js API routes</li>
                <li>• PostgreSQL for persistent data</li>
                <li>• Redis for real-time updates</li>
                <li>• WebSocket for live tracking</li>
                <li>• Generator Oracle API integration</li>
                <li>• SMS/Push notification service</li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-green-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-green-400 mb-4">Infrastructure & Security</h3>
              <p className="text-gray-300 mb-4">Vercel for hosting. End-to-end encryption for sensitive data.</p>
              <ul className="grid md:grid-cols-2 gap-4 text-gray-300 text-sm">
                <li>• Vercel edge network</li>
                <li>• SSL/TLS encryption</li>
                <li>• OAuth 2.0 authentication</li>
                <li>• JWT for API tokens</li>
                <li>• Role-based access control</li>
                <li>• Audit logging for compliance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Implementation Roadmap</h2>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <div className="flex gap-6">
                <div className="text-4xl">📅</div>
                <div>
                  <h3 className="text-xl font-bold text-amber-400 mb-3">Phase 1: Foundation (Q3 2026)</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>✓ API architecture for mobile sync</li>
                    <li>✓ Customer monitoring portal (web)</li>
                    <li>✓ Authentication infrastructure</li>
                    <li>✓ Real-time notification system</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <div className="flex gap-6">
                <div className="text-4xl">🔧</div>
                <div>
                  <h3 className="text-xl font-bold text-blue-400 mb-3">Phase 2: Native Apps (Q4 2026)</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Technician mobile app (iOS/Android)</li>
                    <li>• GPS tracking and routing</li>
                    <li>• Job dispatch integration</li>
                    <li>• Offline-first architecture</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-green-500/20 rounded-lg">
              <div className="flex gap-6">
                <div className="text-4xl">🎯</div>
                <div>
                  <h3 className="text-xl font-bold text-green-400 mb-3">Phase 3: Operations Center (Q1 2027)</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Real-time operations dashboard</li>
                    <li>• Automated dispatch system</li>
                    <li>• SLA monitoring and alerts</li>
                    <li>• Performance analytics</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg">
              <div className="flex gap-6">
                <div className="text-4xl">🚀</div>
                <div>
                  <h3 className="text-xl font-bold text-purple-400 mb-3">Phase 4: AI Integration (Q2+ 2027)</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Predictive maintenance alerts</li>
                    <li>• Automated system diagnostics</li>
                    <li>• Smart scheduling and optimization</li>
                    <li>• Wearable integration</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Coverage Across 47 Counties</h2>

          <p className="text-lg text-gray-300 mb-8">
            Mobile-first operations support across all 47 Kenyan counties. Real-time field coordination for emergency response, maintenance scheduling, and customer communication.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-4">Urban Hubs (4-hour response)</h3>
              <p className="text-gray-300 text-sm mb-4">
                Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, and other major cities benefit from dense technician networks and real-time dispatch optimization.
              </p>
              <p className="text-gray-400 text-sm">
                <strong>Coverage:</strong> 12 cities with sub-4-hour emergency response via mobile coordination.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Regional Centers (8-14 hour response)</h3>
              <p className="text-gray-300 text-sm mb-4">
                Secondary towns and regional centers leverage mobile coordination for scheduled maintenance and emergency dispatch across larger distances.
              </p>
              <p className="text-gray-400 text-sm">
                <strong>Coverage:</strong> 35+ additional towns with reliable mobile dispatch and tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-blue-900/30 to-cyan-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Mobile-First Future</h2>
          <p className="text-lg text-gray-300 mb-8">
            Our mobile strategy ensures every technician, dispatcher, and customer has real-time visibility into backup power systems. From emergency response to preventive maintenance, mobile coordination makes service faster, more reliable, and more transparent.
          </p>
          <a href="/contact?type=mobile-strategy" className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all">
            Discuss Mobile Capabilities
          </a>
        </div>
      </section>
    </div>
  );
}
