'use client';

import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamicImport from 'next/dynamic';  // ← FIXED: renamed import
import '@/app/styles/diagnostics.css';
import HolographicLaser from '@/components/effects/HolographicLaser';
import { HeroHeading, SectionHeading } from '@/components/typography/CinematicHeadingVariants';

const SimpleThreeScene = lazy(() => import('@/components/webgl/SimpleThreeScene'));

const UniversalDiagnosticMachine = dynamicImport(
  () => import('@/components/diagnostics').then(mod => ({ default: mod.UniversalDiagnosticMachine })),
  { ssr: false }
);

const NineInOneCalculator = dynamicImport(
  () => import('@/components/diagnostics').then(mod => ({ default: mod.NineInOneCalculator })),
  { ssr: false }
);

const ServiceAnalytics = dynamicImport(
  () => import('@/components/diagnostics').then(mod => ({ default: mod.ServiceAnalytics })),
  { ssr: false }
);

const ExportPanel = ({ data }: { data: any }) => {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');

  const handleExport = () => {
    if (exportFormat === 'pdf') {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>EmersonEIMS Diagnostic Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              h1 { color: #f59e0b; }
              pre { background: #f5f5f5; padding: 20px; }
            </style>
            </head>
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
      const csv = Object.entries(data).map(([key, value]) => `${key},${value}`).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emerson-diagnostic-${Date.now()}.csv`;
      a.click();
    } else {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emerson-diagnostic-${Date.now()}.json`;
      a.click();
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900/90 to-black rounded-2xl border border-amber-500/20 p-6 mb-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h3 className="text-xl font-bold text-white mb-4">📊 Export Diagnostic Report</h3>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value as 'pdf' | 'csv' | 'json')}
          className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white backdrop-blur-sm w-full sm:w-auto"
        >
          <option value="pdf">PDF Report</option>
          <option value="csv">CSV Data</option>
          <option value="json">JSON Export</option>
        </select>
        <button
          onClick={handleExport}
          className="px-6 py-2 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-500 hover:to-amber-700 transition-all active:scale-95 w-full sm:w-auto"
        >
          Export Report
        </button>
      </div>
    </motion.div>
  );
};

const RealTimeMonitor = () => {
  const [metrics, setMetrics] = useState({
    activeSystems: 1247,
    avgUptime: 98.7,
    totalPower: 125000,
    alerts: 3,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now();
      setMetrics(prev => ({
        activeSystems: prev.activeSystems + Math.floor((time % 1000) / 500 - 1),
        avgUptime: Math.max(97.5, Math.min(99.9, prev.avgUptime + ((time % 200) / 1000 - 0.1))),
        totalPower: prev.totalPower + Math.floor(time % 2000 - 1000),
        alerts: Math.max(0, Math.min(8, prev.alerts + Math.floor((time % 300) / 150 - 1))),
      }));
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {[
        { label: 'Active Systems', value: metrics.activeSystems.toLocaleString(), icon: '⚡', color: 'from-blue-400 to-cyan-400' },
        { label: 'Avg Uptime', value: `${metrics.avgUptime.toFixed(1)}%`, icon: '📊', color: 'from-emerald-400 to-green-400' },
        { label: 'Total Power', value: `${(metrics.totalPower / 1000).toFixed(0)} kW`, icon: '🔋', color: 'from-amber-400 to-yellow-400' },
        { label: 'Active Alerts', value: metrics.alerts, icon: '⚠️', color: 'from-rose-400 to-red-400' },
      ].map((metric, index) => (
        <motion.div
          key={metric.label}
          className="bg-gradient-to-br from-gray-900/80 to-black rounded-xl border border-gray-800/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3 }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">{metric.icon}</span>
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${metric.color} animate-pulse`} />
          </div>
          <div className={`text-2xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent mb-1`}>
            {metric.value}
          </div>
          <div className="text-gray-300 text-sm font-medium">{metric.label}</div>
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current) return;

    const sections = containerRef.current.querySelectorAll('section');
    
    sections.forEach((section, i) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
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
    { service: 'Solar Systems', count: 120, trend: 'up' as const, avgResolutionTime: 2.1, satisfaction: 4.8, revenue: 24000 },
    { service: 'Diesel Generators', count: 95, trend: 'stable' as const, avgResolutionTime: 3.2, satisfaction: 4.6, revenue: 19000 },
    { service: 'Controls', count: 80, trend: 'up' as const, avgResolutionTime: 1.8, satisfaction: 4.7, revenue: 16000 },
    { service: 'AC & UPS', count: 60, trend: 'down' as const, avgResolutionTime: 2.5, satisfaction: 4.4, revenue: 12000 },
    { service: 'Automation', count: 70, trend: 'up' as const, avgResolutionTime: 2.9, satisfaction: 4.5, revenue: 14000 },
    { service: 'Pumps', count: 50, trend: 'stable' as const, avgResolutionTime: 3.5, satisfaction: 4.3, revenue: 10000 },
    { service: 'Incinerators', count: 40, trend: 'up' as const, avgResolutionTime: 4.1, satisfaction: 4.2, revenue: 8000 },
    { service: 'Motors/Rewinding', count: 55, trend: 'stable' as const, avgResolutionTime: 2.7, satisfaction: 4.6, revenue: 11000 },
    { service: 'Diagnostics Hub', count: 200, trend: 'up' as const, avgResolutionTime: 1.2, satisfaction: 4.9, revenue: 40000 },
  ];

  const handleSeverityUpdate = (service: string, severity: string) => {
    setDiagnosticData((prev: any) => ({
      ...prev,
      [service]: severity,
      timestamp: new Date().toISOString(),
    }));
  };

  return (
    <main ref={containerRef} className="bg-black text-white min-h-screen relative overflow-hidden">
      <HolographicLaser intensity="medium" color="#fbbf24" />
      
      <Suspense fallback={null}>
        <div className="fixed inset-0 -z-10 opacity-[0.12]">
          <SimpleThreeScene />
        </div>
      </Suspense>

      <motion.section
        className="px-4 py-24 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ opacity: heroOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-black to-amber-900/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(251,191,36,0.08),transparent_60%)]" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <HeroHeading>DIAGNOSTICS COCKPIT</HeroHeading>
          </motion.div>
          
          <motion.p
            className="text-xl md:text-2xl text-gray-300 mt-6 mb-3 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            A real-time command environment for industrial intelligence.
          </motion.p>
          
          <motion.p
            className="text-lg text-amber-400/80 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Monitor • Diagnose • Predict • Export
          </motion.p>
        </div>
      </motion.section>

      <section className="px-4 mt-4">
        <div className="max-w-7xl mx-auto">
          <RealTimeMonitor />
        </div>
      </section>

      <section className="px-4">
        <div className="max-w-7xl mx-auto">
          <ExportPanel data={diagnosticData} />
        </div>
      </section>

      <section className="px-4 mt-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <SectionHeading align="center">Universal Diagnostic Machine</SectionHeading>
            <p className="text-gray-400 text-center mt-3 max-w-3xl mx-auto">
              Comprehensive diagnostics across all industrial services with severity detection and automated reporting.
            </p>
          </motion.div>
          
          <Suspense fallback={
            <div className="flex items-center justify-center p-16 bg-gray-900/30 rounded-2xl border border-gray-800/50 backdrop-blur-sm">
              <div className="text-center">
                <div className="w-12 h-12 border-3 border-cyan-400/70 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-300">Loading diagnostic engine...</p>
              </div>
            </div>
          }>
            <UniversalDiagnosticMachine onSeverityUpdate={handleSeverityUpdate} />
          </Suspense>
        </div>
      </section>

      <section className="px-4 mt-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Suspense fallback={
              <div className="flex items-center justify-center p-16 bg-gray-900/30 rounded-2xl border border-gray-800/50 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-12 h-12 border-3 border-amber-400/70 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-300">Loading engineering tools...</p>
                </div>
              </div>
            }>
              <NineInOneCalculator />
            </Suspense>
          </motion.div>
        </div>
      </section>

      <section className="px-4 mt-16 mb-28">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <SectionHeading align="center">System Intelligence</SectionHeading>
            <p className="text-gray-400 text-center mt-3 max-w-3xl mx-auto">
              Performance analytics and trend visualization for data-driven decision making.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Suspense fallback={
              <div className="flex items-center justify-center p-16 bg-gray-900/30 rounded-2xl border border-gray-800/50 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-12 h-12 border-3 border-purple-400/70 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-300">Loading analytics dashboard...</p>
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