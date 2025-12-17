'use client';

import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import '@/app/styles/diagnostics.css';
import HolographicLaser from '@/components/effects/HolographicLaser';
import { HeroHeading, SectionHeading } from '@/components/typography/CinematicHeadingVariants';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SimpleThreeScene = lazy(() => import('@/components/webgl/SimpleThreeScene'));

const UniversalDiagnosticMachine = dynamic(
  () => import('@/components/diagnostics').then(mod => ({ default: mod.UniversalDiagnosticMachine })),
  { ssr: false }
);
const NineInOneCalculator = dynamic(
  () => import('@/components/diagnostics').then(mod => ({ default: mod.NineInOneCalculator })),
  { ssr: false }
);
const ServiceAnalytics = dynamic(
  () => import('@/components/diagnostics').then(mod => ({ default: mod.ServiceAnalytics })),
  { ssr: false }
);

// Export Functionality Component
const ExportPanel = ({ data }: { data: any }) => {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');

  const handleExport = () => {
    if (exportFormat === 'pdf') {
      // Generate PDF
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>Diagnostic Report</title></head>
            <body>
              <h1>EmersonEIMS Diagnostic Report</h1>
              <p>Generated: ${new Date().toLocaleString()}</p>
              <pre>${JSON.stringify(data, null, 2)}</pre>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    } else if (exportFormat === 'csv') {
      // Generate CSV
      const csv = Object.entries(data).map(([key, value]) => `${key},${value}`).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `diagnostic-report-${Date.now()}.csv`;
      a.click();
    } else {
      // Generate JSON
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `diagnostic-report-${Date.now()}.json`;
      a.click();
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-amber-500/30 p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-xl font-bold text-white mb-4">Export Diagnostic Report</h3>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value as 'pdf' | 'csv' | 'json')}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
        >
          <option value="pdf">PDF Report</option>
          <option value="csv">CSV Data</option>
          <option value="json">JSON Export</option>
        </select>
        <button
          onClick={handleExport}
          className="px-6 py-2 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-500 hover:to-amber-700 transition-all"
        >
          📥 Export Report
        </button>
      </div>
    </motion.div>
  );
};

// Real-time Data Monitor Component
const RealTimeMonitor = () => {
  const [metrics, setMetrics] = useState({
    activeSystems: 1247,
    avgUptime: 98.7,
    totalPower: 125000,
    alerts: 3,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        activeSystems: prev.activeSystems + Math.floor(Math.random() * 3 - 1),
        avgUptime: Math.max(95, Math.min(100, prev.avgUptime + (Math.random() * 0.2 - 0.1))),
        totalPower: prev.totalPower + Math.floor(Math.random() * 1000 - 500),
        alerts: Math.max(0, Math.min(10, prev.alerts + Math.floor(Math.random() * 3 - 1))),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {[
        { label: 'Active Systems', value: metrics.activeSystems.toLocaleString(), icon: '⚡', color: 'from-blue-500 to-blue-600' },
        { label: 'Avg Uptime', value: `${metrics.avgUptime.toFixed(1)}%`, icon: '📊', color: 'from-green-500 to-green-600' },
        { label: 'Total Power', value: `${(metrics.totalPower / 1000).toFixed(0)}kW`, icon: '🔋', color: 'from-yellow-500 to-yellow-600' },
        { label: 'Active Alerts', value: metrics.alerts, icon: '⚠️', color: 'from-red-500 to-red-600' },
      ].map((metric, index) => (
        <motion.div
          key={metric.label}
          className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 p-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{metric.icon}</span>
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${metric.color} animate-pulse`} />
          </div>
          <div className={`text-2xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent mb-1`}>
            {metric.value}
          </div>
          <div className="text-gray-400 text-sm">{metric.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default function DiagnosticsPage() {
  const [diagnosticData, setDiagnosticData] = useState<any>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // GSAP ScrollTrigger animations
  useEffect(() => {
    if (!containerRef.current) return;

    const sections = containerRef.current.querySelectorAll('section');
    
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const questionsData = [
    { service: 'Solar Systems', count: 120 },
    { service: 'Diesel Generators', count: 95 },
    { service: 'Controls', count: 80 },
    { service: 'AC & UPS', count: 60 },
    { service: 'Automation', count: 70 },
    { service: 'Pumps', count: 50 },
    { service: 'Incinerators', count: 40 },
    { service: 'Motors/Rewinding', count: 55 },
    { service: 'Diagnostics Hub', count: 200 },
  ];

  const handleSeverityUpdate = (service: string, severity: string) => {
    setDiagnosticData((prev: any) => ({
      ...prev,
      [service]: severity,
      timestamp: new Date().toISOString(),
    }));
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Diagnostics] ${service}: ${severity} severity detected`);
    }
  };

  return (
    <main ref={containerRef} className="bg-black text-white min-h-screen relative">
      {/* Holographic Laser Overlay */}
      <HolographicLaser intensity="high" color="#fbbf24" />
      
      {/* 3D Background Scene */}
      <Suspense fallback={null}>
        <div className="fixed inset-0 -z-10 opacity-15">
          <SimpleThreeScene />
        </div>
      </Suspense>

      {/* Enhanced Hero Section */}
      <motion.section
        className="hero-diagnostics px-4 py-20 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ opacity: heroOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-black to-amber-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_50%)]" />
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="mb-4">
            <HeroHeading>DIAGNOSTICS COCKPIT</HeroHeading>
          </div>
          <motion.p
            className="text-xl md:text-2xl text-gray-400 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Awwwards Winning Interface - Universal Diagnostic Machine (All 9 Services)
          </motion.p>
          <motion.p
            className="text-lg text-amber-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Real-time Monitoring • Export Reports • Advanced Analytics
          </motion.p>
        </div>
      </motion.section>

      {/* Real-time Monitor */}
      <section className="px-4 mt-10">
        <div className="max-w-7xl mx-auto">
          <RealTimeMonitor />
        </div>
      </section>

      {/* Export Panel */}
      <section className="px-4 mt-6">
        <div className="max-w-7xl mx-auto">
          <ExportPanel data={diagnosticData} />
        </div>
      </section>

      {/* Tool 1: Universal Diagnostic Machine - All 9 Services */}
      <section className="px-4 mt-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-2">
              <SectionHeading align="center">Universal Diagnostic Machine</SectionHeading>
            </div>
            <p className="text-gray-400">
              Comprehensive diagnostics for all 9 services: Solar, Generators, Controls, AC/UPS, Automation, Pumps, Incinerators, Motors, and Diagnostics Hub
            </p>
            <p className="text-sm text-amber-400 mt-2">
              For generator-specific diagnostics (DeepSea, PowerWizard), visit <a href="/diagnostic-suite" className="underline hover:text-amber-300">Generator Control Diagnostic Hub</a>
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Suspense fallback={
              <div className="flex items-center justify-center p-20 bg-gray-900 rounded-xl border border-gray-800">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-white">Loading Universal Diagnostic Machine...</p>
                </div>
              </div>
            }>
              <UniversalDiagnosticMachine onSeverityUpdate={handleSeverityUpdate} />
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* Tool 2: Universal Engineering Calculator */}
      <section className="px-4 mt-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Suspense fallback={
              <div className="flex items-center justify-center p-20 bg-gray-900 rounded-xl border border-gray-800">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-white">Loading 9-in-1 Engineering Calculator...</p>
                </div>
              </div>
            }>
              <NineInOneCalculator />
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* Tool 3: Gauges + Graphs + Charts */}
      <section className="px-4 mt-10 mb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Suspense fallback={
              <div className="flex items-center justify-center p-20 bg-gray-900 rounded-xl border border-gray-800">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-white">Loading Service Analytics Dashboard...</p>
                </div>
              </div>
            }>
              <ServiceAnalytics questionsData={questionsData} />
            </Suspense>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
