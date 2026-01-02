'use client';

// ServicePage.tsx - Premium Services Page
import React, { useState } from "react";
import { HelmetProvider } from "react-helmet-async";

import SEOHead from "../components/common/SEOHead";
import ErrorBoundary from "../components/common/ErrorBoundary";
import AdaptivePerformanceMonitor from "../components/common/AdaptivePerformanceMonitor";
import DieselGenerators from "../components/service/DieselGenerators";
import SolarEnergy from "../components/service/SolarEnergy";
import HighVoltage from "../components/service/HighVoltage";
import UPSSystems from "../components/service/UPSSystems";
import MotorRewinding from "../components/service/MotorRewinding";
import Fabrication from "../components/service/Fabrication";
import WaterSystems from "../components/service/WaterSystems";
import HVACSystems from "../components/service/HVACSystems";
import Incinerators from "../components/service/Incinerators";
import CrossServiceOptimizers from "../components/service/CrossServiceOptimizers";

export default function ServicePage() {
  const [performanceTier, setPerformanceTier] = useState("high");

  return (
    <HelmetProvider>
      <SEOHead
        title="EmersonEIMS Services | Generator Intelligence, Solar, UPS, HV Infrastructure & More"
        description="Ten premium service chapters. Calculators, charts, adaptive performance, and cinematic design that sells — built for Kenya and beyond."
      />
      <main role="main" className="bg-slate-900">
        <ErrorBoundary>
          <DieselGenerators key="diesel" />
          <SolarEnergy key="solar" />
          <HighVoltage key="hv" />
          <UPSSystems key="ups" />
          <MotorRewinding key="motor" />
          <Fabrication key="fab" />
          <WaterSystems key="water" />
          <HVACSystems key="hvac" />
          <Incinerators key="incin" />
          <CrossServiceOptimizers key="opt" />
          <AdaptivePerformanceMonitor onPerformanceChange={setPerformanceTier} />
        </ErrorBoundary>
      </main>
    </HelmetProvider>
  );
}
