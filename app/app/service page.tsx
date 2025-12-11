'use client';

// ServicePage.jsx
import React, { Suspense, useState, lazy } from "react";
// import { HelmetProvider } from "react-helmet-async"; // Removed - not needed in Next.js

const SEOHead = lazy(() => import("../componets/common/SEOHead"));
const ErrorBoundary = lazy(() => import("../componets/common/ErrorBoundary"));
const AdaptivePerformanceMonitor = lazy(() => import("../componets/common/AdaptivePerformanceMonitor"));
const DieselGenerators = lazy(() => import("../componets/service/DieselGenerators"));
const SolarEnergy = lazy(() => import("../componets/service/SolarEnergy"));
const HighVoltage = lazy(() => import("../componets/service/HighVoltage"));
const UPSSystems = lazy(() => import("../componets/service/UPSSystems"));
const MotorRewinding = lazy(() => import("../componets/service/MotorRewinding"));
const Fabrication = lazy(() => import("../componets/service/Fabrication"));
const WaterSystems = lazy(() => import("../componets/service/WaterSystems"));
const HVACSystems = lazy(() => import("../componets/service/HVACSystems"));
const Incinerators = lazy(() => import("../componets/service/Incinerators"));
const CrossServiceOptimizers = lazy(() => import("../componets/service/CrossServiceOptimizers"));

export default function ServicePage() {
  const [performanceTier, setPerformanceTier] = useState("high");

  return (
    <>
      <Suspense fallback={<div className="loading-spinner" aria-label="Loading"><div className="spinner"></div><span>Loading services...</span></div>}>
        <SEOHead
          title="EmersonEIMS Services | Generator Intelligence, Solar, UPS, HV Infrastructure & More"
          description="Ten premium service chapters. Calculators, charts, adaptive performance, and cinematic design that sells — built for Kenya and beyond."
        />
      </Suspense>
      <main role="main">
        <ErrorBoundary>
          <Suspense fallback={<div className="loading-spinner" aria-label="Loading"><div className="spinner"></div><span>Loading content...</span></div>}>
            <DieselGenerators key="diesel" performanceTier={performanceTier} />
            <SolarEnergy key="solar" performanceTier={performanceTier} />
            <HighVoltage key="hv" performanceTier={performanceTier} />
            <UPSSystems key="ups" performanceTier={performanceTier} />
            <MotorRewinding key="motor" performanceTier={performanceTier} />
            <Fabrication key="fab" performanceTier={performanceTier} />
            <WaterSystems key="water" performanceTier={performanceTier} />
            <HVACSystems key="hvac" performanceTier={performanceTier} />
            <Incinerators key="incin" performanceTier={performanceTier} />
            <CrossServiceOptimizers key="opt" performanceTier={performanceTier} />
            <AdaptivePerformanceMonitor onPerformanceChange={setPerformanceTier} />
          </Suspense>
        </ErrorBoundary>
      </main>
    </>
  );
}