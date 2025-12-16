'use client';

import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileOptimizedProps {
  children: ReactNode;
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
}

/**
 * Apple-Level Mobile Optimization
 * Ensures perfect experience on all devices
 */
export default function MobileOptimized({
  children,
  className = '',
  mobileClassName = '',
  desktopClassName = '',
}: MobileOptimizedProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      className={`${className} ${isMobile ? mobileClassName : desktopClassName}`}
    >
      {children}
    </div>
  );
}





