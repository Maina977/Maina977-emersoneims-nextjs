import Image from 'next/image';
import Link from 'next/link';
import styles from './BlackNovemberAd.module.css';
import {
  CAMPAIGN, CAMPAIGN_BENEFITS, CAMPAIGN_SCENES, CAMPAIGN_END_LABEL, type CampaignBenefit,
} from '@/lib/campaign/blackNovember';

/**
 * Black November 2026 homepage ad (owner request, 7 Nov 2026).
 *
 * A new section placed under the homepage hero. It does not touch, move or
 * re-time any existing homepage media. Server-rendered, CSS-only animation
 * (no JavaScript, no WebGL, no video), so it cannot hold up the hero or break
 * hydration. All wording and terms come from lib/campaign/blackNovember.ts.
 */
const WHATSAPP = '254768860665';

function BenefitIcon({ name }: { name: CampaignBenefit['icon'] }) {
  const p = { className: styles.icon, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
  switch (name) {
    case 'ats':
      return (<svg {...p}><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M13 7l-3 5h4l-3 5" /></svg>);
    case 'service':
      return (<svg {...p}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" /></svg>);
    case 'warranty':
      return (<svg {...p}><path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></svg>);
    case 'delivery':
      return (<svg {...p}><path d="M2 7h11v9H2zM13 10h4l3 3v3h-7" /><circle cx="6" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></svg>);
    case 'install':
      return (<svg {...p}><circle cx="12" cy="12" r="3.2" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></svg>);
    case 'sync':
      return (<svg {...p}><rect x="9" y="2.5" width="6" height="5" rx="1" /><rect x="2.5" y="16.5" width="6" height="5" rx="1" /><rect x="15.5" y="16.5" width="6" height="5" rx="1" /><path d="M12 7.5v4.5M5.5 16.5V12h13v4.5" /></svg>);
  }
}

export default function BlackNovemberAd() {
  const waHref = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(CAMPAIGN.whatsappText)}`;
  return (
    <section className={`${styles.ad} ${styles.letterbox}`} aria-labelledby="black-november-heading" data-campaign="black-november-2026">
      <div className={styles.stage}>
        {CAMPAIGN_SCENES.map((s, i) => (
          <div key={s.src} className={styles.scene}>
            <Image src={s.src} alt={s.alt} fill sizes="100vw" quality={78} className={styles.sceneImg} loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </div>
      <div className={styles.gradeShadow} />
      <div className={styles.gradeKey} />
      <div className={styles.vignette} />
      <div className={styles.grain} />
      <div className={styles.flare} />

      <div className={styles.captions} aria-hidden="true">
        {CAMPAIGN_SCENES.map((s) => (<span key={s.caption} className={styles.caption}>{s.caption}</span>))}
        <div className={styles.progress}>
          {CAMPAIGN_SCENES.map((s) => (<span key={s.src} className={styles.bar}><span /></span>))}
        </div>
      </div>

      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.logoCard}>
            <Image src="/images/logo-tagline.png" alt="Emerson EIMS: Reliable Power. Without Limits." width={360} height={240} className={styles.logoImg} />
          </span>

          <div className={styles.eyebrowRow}>
            <span className={styles.eyebrow}>{CAMPAIGN.eyebrow}</span>
            <span className={styles.runs}>Offer runs to {CAMPAIGN_END_LABEL}</span>
          </div>

          <h2 id="black-november-heading" className={styles.headline}>
            <span className={styles.hTop}>{CAMPAIGN.headlineTop}</span>
            <span className={styles.hBottom}>{CAMPAIGN.headlineBottom}</span>
          </h2>

          <p className={styles.lead}>{CAMPAIGN.lead}</p>

          <ul className={styles.benefits}>
            {CAMPAIGN_BENEFITS.map((b) => (
              <li key={b.title} className={styles.benefit}>
                <span className={`${styles.tag} ${b.free ? '' : styles.tagAlso}`}>{b.free ? 'FREE' : 'WE ALSO DO'}</span>
                <BenefitIcon name={b.icon} />
                <span>
                  <span className={styles.bTitle}>{b.title}</span>
                  <span className={styles.bDetail}>{b.detail}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className={styles.ctas}>
            <Link href={CAMPAIGN.quoteHref} className={styles.primary} data-cta="black-november-quote">
              {CAMPAIGN.ctaQuote} <span aria-hidden="true">→</span>
            </Link>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className={styles.secondary} data-cta="black-november-whatsapp">
              WhatsApp us
            </a>
            <a href="tel:+254768860665" className={styles.call} data-cta="black-november-call">+254 768 860 665</a>
          </div>

          <p className={styles.fine}>
            Qualifying new generators powered by Cummins engines, 40 to 1,500 kVA, until {CAMPAIGN_END_LABEL}. The ATS rating, service visits,
            delivery point and installation scope are written in your quotation. <Link href={CAMPAIGN.termsHref}>Full offer terms</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
