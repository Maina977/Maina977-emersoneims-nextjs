'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

/**
 * UnifiedCTA - Premium Call-to-Action Component
 * Consistent styling and links across the entire site
 * Apple-inspired clean design with EmersonEIMS sci-fi aesthetic
 */

export type CTAVariant = 
  | 'primary'      // Gold gradient - main action
  | 'secondary'    // Outlined - secondary action
  | 'ghost'        // Minimal - tertiary action
  | 'emergency';   // Red urgent - emergency service

export type CTASize = 'sm' | 'md' | 'lg' | 'xl';

export type CTAAction = 
  | 'learn-more'
  | 'get-quote'
  | 'site-survey'
  | 'contact'
  | 'consultation'
  | 'download'
  | 'diagnostic'
  | 'emergency'
  | 'custom';

interface UnifiedCTAProps {
  action: CTAAction;
  variant?: CTAVariant;
  size?: CTASize;
  href?: string;           // Custom href (overrides action default)
  label?: string;          // Custom label (overrides action default)
  icon?: boolean;          // Show icon
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
  service?: string;        // For quote/survey tracking
  location?: string;       // County tracking
  animated?: boolean;
}

// Default configurations for each action type
const ACTION_CONFIG: Record<CTAAction, { href: string; label: string; icon: string }> = {
  'learn-more': { 
    href: '/solutions', 
    label: 'Learn More', 
    icon: '→' 
  },
  'get-quote': { 
    href: '/contact?type=quote', 
    label: 'Get a Quote', 
    icon: '📋' 
  },
  'site-survey': { 
    href: '/contact?type=site-survey', 
    label: 'Request Site Survey', 
    icon: '🔍' 
  },
  'contact': { 
    href: '/contact', 
    label: 'Contact Us', 
    icon: '💬' 
  },
  'consultation': { 
    href: '/contact?type=consultation', 
    label: 'Free Consultation', 
    icon: '👨‍💼' 
  },
  'download': { 
    href: '/resources', 
    label: 'Download Brochure', 
    icon: '📥' 
  },
  'diagnostic': { 
    href: '/diagnostic-cockpit', 
    label: 'Try Diagnostic Suite', 
    icon: '🎯' 
  },
  'emergency': { 
    href: '/contact?type=emergency', 
    label: 'Emergency Service', 
    icon: '🚨' 
  },
  'custom': { 
    href: '#', 
    label: 'Click Here', 
    icon: '→' 
  },
};

// Size configurations
const SIZE_STYLES: Record<CTASize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-12 py-5 text-xl',
};

// Variant configurations
const VARIANT_STYLES: Record<CTAVariant, string> = {
  primary: 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-black font-bold hover:shadow-[0_0_40px_rgba(251,191,36,0.4)] hover:scale-105',
  secondary: 'border-2 border-amber-400/60 text-amber-400 font-semibold hover:border-amber-400 hover:bg-amber-400/10 hover:shadow-[0_0_30px_rgba(251,191,36,0.2)]',
  ghost: 'text-amber-400 hover:text-amber-300 font-medium underline-offset-4 hover:underline',
  emergency: 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white font-bold hover:shadow-[0_0_40px_rgba(239,68,68,0.5)] hover:scale-105 animate-pulse',
};

export default function UnifiedCTA({
  action,
  variant = 'primary',
  size = 'md',
  href,
  label,
  icon = true,
  fullWidth = false,
  className = '',
  onClick,
  service,
  location,
  animated = true,
}: UnifiedCTAProps) {
  const config = ACTION_CONFIG[action];
  
  // Build final href with tracking params
  let finalHref = href || config.href;
  if (service || location) {
    const url = new URL(finalHref, 'https://emersoneims.com');
    if (service) url.searchParams.set('service', service);
    if (location) url.searchParams.set('location', location);
    finalHref = url.pathname + url.search;
  }
  
  const finalLabel = label || config.label;
  const finalIcon = icon ? config.icon : null;
  
  const baseStyles = `
    inline-flex items-center justify-center gap-2 
    rounded-full 
    transition-all duration-300 
    relative overflow-hidden
    ${SIZE_STYLES[size]}
    ${VARIANT_STYLES[variant]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2">
        {finalIcon && <span>{finalIcon}</span>}
        <span>{finalLabel}</span>
        {action === 'learn-more' && (
          <motion.span
            animate={animated ? { x: [0, 5, 0] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.span>
        )}
      </span>
      
      {/* Shine effect for primary buttons */}
      {variant === 'primary' && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      )}
    </>
  );

  if (onClick) {
    return (
      <motion.button
        onClick={onClick}
        className={baseStyles}
        whileHover={animated ? { scale: variant === 'ghost' ? 1 : 1.02 } : {}}
        whileTap={animated ? { scale: 0.98 } : {}}
      >
        {content}
      </motion.button>
    );
  }

  return (
    <motion.div
      whileHover={animated ? { scale: variant === 'ghost' ? 1 : 1.02 } : {}}
      whileTap={animated ? { scale: 0.98 } : {}}
    >
      <Link href={finalHref} className={baseStyles}>
        {content}
      </Link>
    </motion.div>
  );
}

// Pre-configured CTA components for common use cases
export const LearnMoreCTA = (props: Partial<UnifiedCTAProps>) => (
  <UnifiedCTA action="learn-more" variant="ghost" {...props} />
);

export const GetQuoteCTA = (props: Partial<UnifiedCTAProps>) => (
  <UnifiedCTA action="get-quote" variant="primary" {...props} />
);

export const SiteSurveyCTA = (props: Partial<UnifiedCTAProps>) => (
  <UnifiedCTA action="site-survey" variant="secondary" {...props} />
);

export const ContactCTA = (props: Partial<UnifiedCTAProps>) => (
  <UnifiedCTA action="contact" variant="primary" {...props} />
);

export const DiagnosticCTA = (props: Partial<UnifiedCTAProps>) => (
  <UnifiedCTA action="diagnostic" variant="secondary" {...props} />
);

export const EmergencyCTA = (props: Partial<UnifiedCTAProps>) => (
  <UnifiedCTA action="emergency" variant="emergency" {...props} />
);

export const ConsultationCTA = (props: Partial<UnifiedCTAProps>) => (
  <UnifiedCTA action="consultation" variant="primary" {...props} />
);

// CTA Section - Complete call-to-action block with multiple options
interface CTASectionProps {
  title?: string;
  subtitle?: string;
  primaryAction?: CTAAction;
  secondaryAction?: CTAAction;
  showEmergency?: boolean;
  className?: string;
}

export function CTASection({
  title = "Ready to Get Started?",
  subtitle = "Get a free consultation with our engineering team. No obligations, just expert advice.",
  primaryAction = 'consultation',
  secondaryAction = 'diagnostic',
  showEmergency = false,
  className = '',
}: CTASectionProps) {
  return (
    <section className={`py-24 relative overflow-hidden ${className}`}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-amber-950/10 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(251,191,36,0.15),transparent_70%)]" />
      
      <div className="max-w-4xl mx-auto px-6 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm tracking-wider uppercase mb-6">
            Let&apos;s Talk
          </span>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            {title}
          </h2>
          
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <UnifiedCTA action={primaryAction} size="lg" />
          <UnifiedCTA action={secondaryAction} variant="secondary" size="lg" />
        </motion.div>
        
        {showEmergency && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <EmergencyCTA size="md" />
          </motion.div>
        )}
        
        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <p className="text-sm text-gray-500 mb-4">Why choose EmersonEIMS?</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <span className="text-amber-500">✓</span> 15+ Years Experience
            </span>
            <span className="flex items-center gap-2">
              <span className="text-amber-500">✓</span> 47 Counties Coverage
            </span>
            <span className="flex items-center gap-2">
              <span className="text-amber-500">✓</span> 24/7 Support
            </span>
            <span className="flex items-center gap-2">
              <span className="text-amber-500">✓</span> 98.7% Uptime
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
