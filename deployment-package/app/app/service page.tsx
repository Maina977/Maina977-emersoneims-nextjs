// ServicePage.jsx
import React, { Suspense, useState, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";

const SEOHead = lazy(() => import("../components/common/SEOHead"));
const ErrorBoundary = lazy(() => import("../components/common/ErrorBoundary"));
const AdaptivePerformanceMonitor = lazy(() => import("../components/common/AdaptivePerformanceMonitor"));
const DieselGenerators = lazy(() => import("../components/service/DieselGenerators"));
const SolarEnergy = lazy(() => import("../components/service/SolarEnergy"));
const HighVoltage = lazy(() => import("../components/service/HighVoltage"));
const UPSSystems = lazy(() => import("../components/service/UPSSystems"));
const MotorRewinding = lazy(() => import("../components/service/MotorRewinding"));
const Fabrication = lazy(() => import("../components/service/Fabrication"));
const WaterSystems = lazy(() => import("../components/service/WaterSystems"));
const HVACSystems = lazy(() => import("../components/service/HVACSystems"));
const Incinerators = lazy(() => import("../components/service/Incinerators"));
const CrossServiceOptimizers = lazy(() => import("../components/service/CrossServiceOptimizers"));

export default function ServicePage() {
  const [performanceTier, setPerformanceTier] = useState("high");

  return (
    <HelmetProvider>
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
    </HelmetProvider>
  );
}
