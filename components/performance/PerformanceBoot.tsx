"use client";
import dynamic from "next/dynamic";

const FontOptimizer = dynamic(() => import("../building/performance/FontOptimizer"), { ssr: false });
const ResourcePreloader = dynamic(() => import("../building/performance/ResourcePreloader"), { ssr: false });
const AdvancedPreloader = dynamic(() => import("../building/performance/AdvancedPreloader"), { ssr: false });

export default function PerformanceBoot() {
  return (
    <>
      <FontOptimizer />
      <ResourcePreloader />
      <AdvancedPreloader />
    </>
  );
}
