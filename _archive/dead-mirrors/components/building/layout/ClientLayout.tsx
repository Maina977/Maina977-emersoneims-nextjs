'use client';

import PerformanceProvider from "@/components/performance/PerformanceProvider";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <PerformanceProvider>
      {children}
    </PerformanceProvider>
  );
}