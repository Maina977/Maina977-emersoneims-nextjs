/**
 * HUB-03 (2026-11-27): layout shift and LCP on the Solar & UPS Hub.
 *
 * 1. The marketing nav above the B2B strip was hidden by a client effect
 *    after hydration, so the strip and the whole Hub jumped up 64-72 px
 *    (CLS 0.105-0.152). The hiding is now decided by a marker in the server
 *    HTML plus html:has(...) CSS, so it applies from the first paint.
 * 2. The cookie notice was painted last (after an extra 2 s timer) and, as
 *    one large text block, became the desktop LCP element. It now shows as
 *    soon as it mounts, as short text blocks; consent behaviour is unchanged.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'fs';
import path from 'path';
import HubLayout from '@/app/hub/layout';
import CookieConsent from '@/components/compliance/CookieConsent';
import GoogleTags from '@/components/analytics/GoogleTags';

const read = (p: string) => readFileSync(path.resolve(__dirname, '../..', p), 'utf8');

describe('Hub chrome is decided in the server HTML (no post-hydration shift)', () => {
  it('the Hub layout renders the marker in its server markup', () => {
    const html = renderToStaticMarkup(<HubLayout><p>child</p></HubLayout>);
    expect(html).toMatch(/<span data-hub-route-marker="" hidden="">/);
    expect(html).toContain('<p>child</p>');
  });

  it('hub.css hides the marketing nav and footer from the marker, not only from the client attribute', () => {
    const css = read('app/hub/hub.css');
    expect(css).toMatch(/html:has\(\[data-hub-route-marker\]\) #main-navigation,\s*html:has\(\[data-hub-route-marker\]\) #contact-section\s*\{\s*display: none !important;/);
    expect(css).toMatch(/html:has\(\[data-hub-route-marker\]\) main#main-content\s*\{\s*padding-top: 0 !important;/);
    // The client attribute remains as the fallback for browsers without :has().
    expect(css).toMatch(/html\[data-hub-route="true"\] #main-navigation/);
  });

  it('the B2B strip itself is never hidden on the Hub and stays mounted site-wide', () => {
    const css = read('app/hub/hub.css') + read('app/globals.css');
    // No Hub rule targets the strip (its intended behaviour: visible on the Hub too).
    expect(css).not.toMatch(/^html[^{}\n]*hub-route[^{}\n]*(bg-slate-950|B2B|b2b|commercial positioning)/m);
    const layout = read('app/layout.tsx');
    expect(layout).toMatch(/<B2BSiteStrip\s*\/?>/);
    // Still a server component: no client-side condition can remove it after load.
    expect(read('components/b2b/B2BSiteStrip.tsx')).not.toMatch(/['"]use client['"]/);
  });
});

describe('cookie notice: consent behaviour after the LCP change', () => {
  const gtag = vi.fn();

  beforeEach(() => {
    window.localStorage.clear();
    gtag.mockReset();
    (window as unknown as { gtag: typeof gtag }).gtag = gtag;
  });
  afterEach(() => {
    delete (window as unknown as { gtag?: typeof gtag }).gtag;
    vi.useRealTimers();
  });

  it('is requested on the first render of a first visit, with no timer', () => {
    vi.useFakeTimers();
    render(<CookieConsent />);
    // No timers advanced at all.
    expect(screen.getByRole('dialog', { name: /cookie & privacy notice/i })).toBeInTheDocument();
  });

  it('keeps all three choices, the privacy link and the full description', () => {
    render(<CookieConsent />);
    const dialog = screen.getByRole('dialog', { name: /cookie & privacy notice/i });
    expect(screen.getByRole('button', { name: /accept all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /essential only/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reject all/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /privacy policy/i })).toHaveAttribute('href', '/privacy');
    const desc = document.getElementById(dialog.getAttribute('aria-describedby') || '');
    expect(desc).not.toBeNull();
    expect(desc!.textContent).toContain('We use essential cookies');
    expect(desc!.textContent).toContain('never shared with third parties');
  });

  it('sets the desktop text as short flex-item phrases so no block outweighs the page (LCP)', () => {
    render(<CookieConsent />);
    const p = document.getElementById('cookie-notice-text')!;
    // At xl: a wrapping flex row, so every phrase is its own block box.
    // (Inline-block phrases were measured and still summed into the <p>.)
    expect(p.className).toMatch(/\bxl:flex\b/);
    expect(p.className).toMatch(/\bxl:flex-wrap\b/);
    const phrases = Array.from(p.querySelectorAll('[data-notice-phrase]'));
    expect(phrases.length).toBeGreaterThanOrEqual(6);
    for (const ph of phrases) {
      // A flex item: a direct child of the <p>, or of a display:contents wrapper.
      const parent = ph.parentElement!;
      expect(parent === p || /\bxl:contents\b/.test(parent.className)).toBe(true);
      // About 40 characters at most: measured 5,100 px² or less at 1280-1920 px.
      expect((ph.textContent || '').trim().length).toBeLessThanOrEqual(42);
    }
    // Every word of the long notice is still there, in order.
    const text = (document.getElementById('cookie-notice-text')!.textContent || '').replace(/\s+/g, ' ');
    expect(text).toContain('We use essential cookies to ensure our website works properly and analytics cookies to understand how you interact with it. Your data is processed securely and never shared with third parties.');
    // Not hidden from users by opacity or visibility tricks.
    const dialog = screen.getByRole('dialog');
    for (const el of [dialog, ...Array.from(dialog.querySelectorAll('*'))]) {
      const cls = typeof el.className === 'string' ? el.className : '';
      expect(cls).not.toMatch(/\bopacity-0\b|\binvisible\b|content-visibility|\bsr-only\b/);
    }
  });

  it('grants nothing before a choice, and only Accept grants storage', () => {
    render(<CookieConsent />);
    expect(gtag).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /accept all/i }));
    expect(gtag).toHaveBeenCalledWith('consent', 'update', expect.objectContaining({ analytics_storage: 'granted', ad_storage: 'granted' }));
    expect(window.localStorage.getItem('cookie-consent')).toBe('accepted');
  });

  it.each([
    [/essential only/i, 'essential'],
    [/reject all/i, 'rejected'],
  ])('%s stores its value and keeps analytics and ads denied', (name, value) => {
    render(<CookieConsent />);
    fireEvent.click(screen.getByRole('button', { name }));
    expect(window.localStorage.getItem('cookie-consent')).toBe(value);
    for (const call of gtag.mock.calls) {
      expect(JSON.stringify(call)).not.toContain('granted');
    }
    expect(gtag).toHaveBeenCalledWith('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied' });
  });

  it('does not show once a choice is stored', () => {
    window.localStorage.setItem('cookie-consent', 'essential');
    render(<CookieConsent />);
    act(() => {});
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('Google tags: consent defaults are denied before anything is configured or loaded', () => {
  it('queues denied defaults, then config, and only then requests the library', () => {
    const html = renderToStaticMarkup(<GoogleTags />);
    const iDefault = html.indexOf("gtag('consent','default',{");
    const iConfig = html.indexOf("gtag('config',");
    const iLib = html.indexOf('googletagmanager.com/gtag/js');
    expect(iDefault).toBeGreaterThan(-1);
    expect(html).toMatch(/analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'/);
    expect(iConfig).toBeGreaterThan(iDefault);
    expect(iLib).toBeGreaterThan(iConfig);
    expect(html).not.toMatch(/'granted'/);
  });
});
