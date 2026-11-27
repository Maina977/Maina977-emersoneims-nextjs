// @vitest-environment jsdom
/**
 * Privacy correction 2026-11-27.
 *
 * Production 235e0e37 made 11 requests to Google in the first 8 s of a visit
 * with no consent choice (gtag/js, /g/collect gcs=G100, /a, ccm/collect),
 * because GoogleTags.tsx requested the library at 2.5 s whatever the visitor
 * chose. Management: optional Google scripts load only after consent; every
 * choice states all four consent types; withdrawal stops further sends in the
 * same page and deletes the Google cookies; the notice must not claim data is
 * "never shared with third parties".
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { act, fireEvent, render, screen } from '@testing-library/react';
import CookieConsent from '@/components/compliance/CookieConsent';
import CookieSettingsButton from '@/components/compliance/CookieSettingsButton';
import GoogleTagsRouteChange from '@/components/analytics/GoogleTagsRouteChange';
import {
  ALL_DENIED,
  ALL_GRANTED,
  deleteGoogleCookies,
  haltGoogleTransmission,
  isGoogleTagUrl,
} from '@/lib/compliance/googleConsent';
import { COOKIE_NOTICE_FULL, COOKIE_NOTICE_SHORT } from '@/lib/compliance/cookieNoticeText';
import { GA4_IDS, GOOGLE_ADS_ID } from '@/lib/analytics/ids';

let pathname = '/';
vi.mock('next/navigation', () => ({ usePathname: () => pathname, useSearchParams: () => new URLSearchParams() }));

type W = Window & Record<string, unknown> & { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };
const w = window as unknown as W;

const GOOGLE_SRC = /googletagmanager\.com|google-analytics\.com|googlesyndication\.com|doubleclick\.net|googleadservices\.com/;
const googleScripts = () => Array.from(document.querySelectorAll('script[src]')).filter((s) => GOOGLE_SRC.test(s.getAttribute('src') || ''));

async function initScript(): Promise<string> {
  const { default: GoogleTags } = await import('@/components/analytics/GoogleTags');
  const html = renderToStaticMarkup(<GoogleTags />);
  const m = html.match(/<script id="gtag-init">([\s\S]*?)<\/script>/);
  if (!m) throw new Error('gtag-init script not rendered');
  return m[1].replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

/** Every gtag('consent', ...) call queued so far, as [kind, states]. */
function consentCalls(): Array<[string, Record<string, string>]> {
  return (w.dataLayer || [])
    .map((a) => Array.from(a as ArrayLike<unknown>))
    .filter((a) => a[0] === 'consent')
    .map((a) => [a[1] as string, a[2] as Record<string, string>]);
}
const FOUR = ['analytics_storage', 'ad_storage', 'ad_user_data', 'ad_personalization'];

function resetWindow() {
  document.head.innerHTML = '';
  for (const k of ['dataLayer', 'gtag', '__eimsLoadGtag', '__eimsGtagBlocked', '__eimsOpenCookieSettings', '__eimsEngineeringBusy', 'eimsC', 'eimsOk']) delete w[k];
  if (w.__eimsGtagHalt) {
    // Undo any transport guard a previous test installed.
    (w.__eimsGtagHalt as { restore: Array<() => void> }).restore.reverse().forEach((u) => u());
    delete w.__eimsGtagHalt;
  }
  for (const id of [...GA4_IDS, GOOGLE_ADS_ID]) delete w[`ga-disable-${id}`];
  window.localStorage.clear();
  for (const c of document.cookie.split(';')) {
    const n = c.split('=')[0].trim();
    if (n) document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}

async function bootPage() {
  const src = await initScript();
  new Function(src)();
  render(<CookieConsent />);
  act(() => { vi.advanceTimersByTime(2000); });
}
const press = (name: RegExp) => fireEvent.click(screen.getByRole('button', { name }));

describe('privacy correction 2026-11-27: no Google request without consent', () => {
  beforeEach(() => { resetWindow(); vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); resetWindow(); });

  it('before any choice: no Google script, even after 30 s, interaction and idle; the denied default stays queued locally', async () => {
    await bootPage();
    window.dispatchEvent(new Event('pointerdown'));
    window.dispatchEvent(new Event('scroll'));
    act(() => { vi.advanceTimersByTime(30000); });
    expect(googleScripts()).toHaveLength(0);
    expect(consentCalls()[0]).toEqual(['default', expect.objectContaining({ ...ALL_DENIED })]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it.each([
    [/reject all/i, 'rejected'],
    [/essential only/i, 'essential'],
    [/close cookie notice/i, 'essential'],
  ])('after %s: no Google script, and all four states denied explicitly', async (name, stored) => {
    await bootPage();
    press(name);
    window.dispatchEvent(new Event('pointerdown'));
    act(() => { vi.advanceTimersByTime(30000); });
    expect(googleScripts()).toHaveLength(0);
    expect(window.localStorage.getItem('cookie-consent')).toBe(stored);
    const last = consentCalls().at(-1)!;
    expect(last[0]).toBe('update');
    expect(last[1]).toEqual({ ...ALL_DENIED });
    for (const k of FOUR) expect(last[1][k]).toBe('denied');
  });

  it('after Accept All: all four granted, then exactly one library script; config queued after the grant', async () => {
    await bootPage();
    expect(googleScripts()).toHaveLength(0);
    press(/accept all/i);
    const scripts = googleScripts();
    expect(scripts).toHaveLength(1);
    expect(scripts[0].getAttribute('src')).toMatch(/^https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=/);
    const last = consentCalls().at(-1)!;
    expect(last).toEqual(['update', { ...ALL_GRANTED }]);
    const items = (w.dataLayer || []).map((a) => Array.from(a as ArrayLike<unknown>));
    const grantAt = items.findIndex((a) => a[0] === 'consent' && a[1] === 'update');
    const firstConfig = items.findIndex((a) => a[0] === 'config');
    expect(firstConfig).toBeGreaterThan(grantAt);
    act(() => { vi.advanceTimersByTime(30000); });
    expect(googleScripts()).toHaveLength(1);
  });

  it('a returning accepted visitor: granted before config, library loads on the old schedule (2.5 s)', async () => {
    window.localStorage.setItem('cookie-consent', 'accepted');
    const src = await initScript();
    new Function(src)();
    const calls = consentCalls();
    expect(calls[0][0]).toBe('default');
    expect(calls[1]).toEqual(['update', { ...ALL_GRANTED }]);
    vi.advanceTimersByTime(2400);
    expect(googleScripts()).toHaveLength(0);
    vi.advanceTimersByTime(200);
    expect(googleScripts()).toHaveLength(1);
  });

  it.each(['rejected', 'essential'])('a returning visitor who chose %s: nothing loads', async (stored) => {
    window.localStorage.setItem('cookie-consent', stored);
    const src = await initScript();
    new Function(src)();
    window.dispatchEvent(new Event('pointerdown'));
    vi.advanceTimersByTime(30000);
    expect(googleScripts()).toHaveLength(0);
  });
});

describe('withdrawal', () => {
  beforeEach(() => { resetWindow(); vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); resetWindow(); });

  it('Cookie settings re-opens the notice; Reject then denies all four, deletes _ga/_ga_*/_gcl_* and stops further gtag calls', async () => {
    window.localStorage.setItem('cookie-consent', 'accepted');
    await bootPage();
    expect(screen.queryByRole('dialog')).toBeNull();
    document.cookie = '_ga=GA1.1.1.1; path=/';
    document.cookie = '_ga_1YQPD7PN51=GS1.1; path=/';
    document.cookie = '_gcl_au=1.1.1; path=/';
    document.cookie = 'keep_me=1; path=/';

    render(<CookieSettingsButton />);
    fireEvent.click(screen.getByRole('button', { name: 'Cookie settings' }));
    expect(screen.getByRole('dialog', { name: /cookie & privacy notice/i })).toBeInTheDocument();

    const realGtagCalls: unknown[][] = [];
    const real = w.gtag!;
    w.gtag = (...a: unknown[]) => { realGtagCalls.push(a); real(...a); };
    press(/reject all/i);

    expect(realGtagCalls.at(-1)).toEqual(['consent', 'update', { ...ALL_DENIED }]);
    expect(document.cookie).not.toMatch(/_ga=|_ga_1YQPD7PN51=|_gcl_au=/);
    expect(document.cookie).toContain('keep_me=1');
    for (const id of [...GA4_IDS, GOOGLE_ADS_ID]) expect(w[`ga-disable-${id}`]).toBe(true);

    const before = (w.dataLayer || []).length;
    w.gtag!('event', 'page_view');
    w.dataLayer!.push(['event', 'x']);
    expect((w.dataLayer || []).length).toBe(before);
  });

  it('after withdrawal, a pending deferred load never happens', async () => {
    window.localStorage.setItem('cookie-consent', 'accepted');
    const src = await initScript();
    new Function(src)();
    haltGoogleTransmission();
    vi.advanceTimersByTime(30000);
    expect(googleScripts()).toHaveLength(0);
  });

  it('after withdrawal, the transport guard refuses Google URLs only', async () => {
    const sent: string[] = [];
    const origFetch = window.fetch;
    window.fetch = ((u: RequestInfo | URL) => { sent.push(String(u)); return Promise.resolve(new Response('')); }) as typeof fetch;
    try {
      haltGoogleTransmission();
      await expect(window.fetch('https://www.google-analytics.com/g/collect?v=2')).rejects.toThrow(/withdrawn/);
      await window.fetch('/api/health');
      expect(sent).toEqual(['/api/health']);
      const img = document.createElement('img');
      img.src = 'https://pagead2.googlesyndication.com/ccm/collect';
      expect(img.getAttribute('src')).toBeNull();
      const s = document.createElement('script');
      s.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=x');
      expect(s.getAttribute('src')).toBeNull();
    } finally {
      resetWindow();
      window.fetch = origFetch;
    }
  });

  it('re-accepting in the same page restores gtag and loads', async () => {
    await bootPage();
    press(/reject all/i);
    render(<CookieSettingsButton />);
    fireEvent.click(screen.getByRole('button', { name: 'Cookie settings' }));
    press(/accept all/i);
    expect(googleScripts()).toHaveLength(1);
    expect(consentCalls().at(-1)).toEqual(['update', { ...ALL_GRANTED }]);
  });

  it('deleteGoogleCookies reports what it removed', () => {
    document.cookie = '_gcl_aw=x; path=/';
    document.cookie = '_ga=y; path=/';
    expect(deleteGoogleCookies().sort()).toEqual(['_ga', '_gcl_aw']);
    expect(document.cookie).not.toMatch(/_ga=|_gcl_aw=/);
  });
});

describe('route changes are sent only with consent', () => {
  beforeEach(() => { resetWindow(); pathname = '/'; });
  afterEach(() => resetWindow());

  function navigateTwice() {
    const calls: unknown[][] = [];
    w.gtag = (...a: unknown[]) => { calls.push(a); };
    const { rerender } = render(<GoogleTagsRouteChange />);
    pathname = '/generators'; rerender(<GoogleTagsRouteChange />);
    pathname = '/solar'; rerender(<GoogleTagsRouteChange />);
    return calls;
  }

  it('no consent: nothing', () => { expect(navigateTwice()).toHaveLength(0); });
  it('accepted: a page_view per navigation', () => {
    window.localStorage.setItem('cookie-consent', 'accepted');
    expect(navigateTwice()).toEqual([
      ['event', 'page_view', { page_path: '/generators' }],
      ['event', 'page_view', { page_path: '/solar' }],
    ]);
  });
});

describe('notice wording', () => {
  beforeEach(() => { resetWindow(); vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); resetWindow(); });

  it('no longer claims data is never shared, names Google, and says what withdrawal does not undo', async () => {
    await bootPage();
    const text = screen.getByRole('dialog').textContent || '';
    expect(text).not.toMatch(/never shared/i);
    expect(text).not.toMatch(/stays private/i);
    expect(COOKIE_NOTICE_FULL).toMatch(/Google Analytics/);
    expect(COOKIE_NOTICE_FULL).toMatch(/Google Ads/);
    expect(COOKIE_NOTICE_FULL).toMatch(/IP address/);
    expect(COOKIE_NOTICE_FULL).toMatch(/outside Kenya/);
    expect(COOKIE_NOTICE_FULL).toMatch(/stops future collection/);
    expect(COOKIE_NOTICE_FULL).toMatch(/already sent is handled under Google's terms/);
    expect(COOKIE_NOTICE_SHORT).toMatch(/Google/);
    expect(screen.getByRole('link', { name: /privacy policy/i })).toHaveAttribute('href', '/privacy');
  });

  it('isGoogleTagUrl matches tag endpoints and leaves fonts and the site alone', () => {
    for (const u of [
      'https://www.googletagmanager.com/gtag/js?id=G-1',
      'https://www.google-analytics.com/g/collect',
      'https://region1.google-analytics.com/g/collect',
      'https://pagead2.googlesyndication.com/ccm/collect',
      'https://td.doubleclick.net/td/rul/1',
      'https://www.googleadservices.com/pagead/conversion/1',
      'https://www.google.com/ccm/collect',
      'https://www.google.co.ke/pagead/1p-conversion/1',
    ]) expect(isGoogleTagUrl(u)).toBe(true);
    for (const u of ['https://fonts.googleapis.com/css2', 'https://fonts.gstatic.com/x.woff2', '/api/health', 'https://www.google.com/maps/embed']) {
      expect(isGoogleTagUrl(u)).toBe(false);
    }
  });
});
