/**
 * Cookie notice must not obscure tool results or actions (2026-11-21).
 *
 * While the fixed banner is visible it reserves its own height at the bottom of
 * the page (--consent-bar-h + data-consent-bar on <html>, consumed by
 * app/globals.css and the floating widgets); answering it gives the space back.
 * The consent choices, their storage values and their equal weight are legal
 * requirements and must not drift.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'fs';
import path from 'path';
import CookieConsent from '@/components/compliance/CookieConsent';
import {
  CONSENT_BAR_ATTR,
  CONSENT_BAR_VAR,
  consentBarLength,
  releaseConsentBarSpace,
  reserveConsentBarSpace,
  type ConsentBarRoot,
} from '@/lib/compliance/consentBarSpace';

function stubRoot() {
  const props = new Map<string, string>();
  const attrs = new Map<string, string>();
  const root: ConsentBarRoot = {
    style: {
      setProperty: (n, v) => { props.set(n, v); },
      removeProperty: (n) => { const v = props.get(n) ?? ''; props.delete(n); return v; },
    },
    setAttribute: (n, v) => { attrs.set(n, v); },
    removeAttribute: (n) => { attrs.delete(n); },
  };
  return { root, props, attrs };
}

describe('consentBarLength', () => {
  it('rounds up to whole pixels so sub-pixel heights never leave a sliver covered', () => {
    expect(consentBarLength(61.2)).toBe('62px');
    expect(consentBarLength(60)).toBe('60px');
  });
  it('never yields a negative or non-numeric length', () => {
    expect(consentBarLength(0)).toBe('0px');
    expect(consentBarLength(-5)).toBe('0px');
    expect(consentBarLength(Number.NaN)).toBe('0px');
    expect(consentBarLength(Number.POSITIVE_INFINITY)).toBe('0px');
  });
});

describe('reserve / release', () => {
  it('reserve sets the variable and the open marker; release removes both', () => {
    const { root, props, attrs } = stubRoot();
    expect(reserveConsentBarSpace(root, 97.4)).toBe('98px');
    expect(props.get(CONSENT_BAR_VAR)).toBe('98px');
    expect(attrs.get(CONSENT_BAR_ATTR)).toBe('open');
    releaseConsentBarSpace(root);
    expect(props.has(CONSENT_BAR_VAR)).toBe(false);
    expect(attrs.has(CONSENT_BAR_ATTR)).toBe(false);
  });
  it('keeps the variable name the homepage hero and floating widgets already read', () => {
    expect(CONSENT_BAR_VAR).toBe('--consent-bar-h');
  });
});

describe('globals.css consumes the reservation', () => {
  const css = readFileSync(path.resolve(__dirname, '../../app/globals.css'), 'utf8');
  it('pads the body and scroll-padding by the banner height only while it is open', () => {
    expect(css).toMatch(/html\[data-consent-bar="open"\]\s*body\s*\{\s*padding-bottom:\s*var\(--consent-bar-h,\s*0px\);/);
    expect(css).toMatch(/html\[data-consent-bar="open"\]\s*\{\s*scroll-padding-bottom:\s*var\(--consent-bar-h,\s*0px\);/);
  });
});

describe('CookieConsent banner', () => {
  const root = document.documentElement;

  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.clear();
    root.style.removeProperty(CONSENT_BAR_VAR);
    root.removeAttribute(CONSENT_BAR_ATTR);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  function showBanner() {
    render(<CookieConsent />);
    act(() => { vi.advanceTimersByTime(2000); });
    return screen.getByRole('dialog', { name: /cookie & privacy notice/i });
  }

  it('is a labelled, non-modal dialog that keeps every legal element', () => {
    const dialog = showBanner();
    expect(dialog).toHaveAttribute('aria-modal', 'false');
    expect(screen.getByRole('button', { name: /accept all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /essential only/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reject all/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /privacy policy/i })).toHaveAttribute('href', '/privacy');
    // Nothing pre-ticked: there are no checkboxes at all.
    expect(dialog.querySelectorAll('input[type="checkbox"]').length).toBe(0);
  });

  it('gives Accept, Essential Only and Reject identical 44px touch-target sizing', () => {
    showBanner();
    for (const name of [/accept all/i, /essential only/i, /reject all/i]) {
      const cls = screen.getByRole('button', { name }).className;
      expect(cls).toContain('min-h-[44px]');
      expect(cls).toContain('flex-1');
    }
  });

  it('reserves space while visible and releases it when answered', () => {
    showBanner();
    expect(root.getAttribute(CONSENT_BAR_ATTR)).toBe('open');
    expect(root.style.getPropertyValue(CONSENT_BAR_VAR)).toMatch(/^\d+px$/);
    fireEvent.click(screen.getByRole('button', { name: /reject all/i }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(root.hasAttribute(CONSENT_BAR_ATTR)).toBe(false);
    expect(root.style.getPropertyValue(CONSENT_BAR_VAR)).toBe('');
  });

  it('stores the unchanged consent values for each choice', () => {
    const cases: Array<[RegExp, string]> = [
      [/accept all/i, 'accepted'],
      [/essential only/i, 'essential'],
      [/reject all/i, 'rejected'],
    ];
    for (const [name, value] of cases) {
      window.localStorage.clear();
      const { unmount } = render(<CookieConsent />);
      act(() => { vi.advanceTimersByTime(2000); });
      fireEvent.click(screen.getByRole('button', { name }));
      expect(window.localStorage.getItem('cookie-consent')).toBe(value);
      expect(window.localStorage.getItem('cookie-consent-date')).not.toBeNull();
      unmount();
    }
  });

  it('does not show (or reserve space) once a choice is stored', () => {
    window.localStorage.setItem('cookie-consent', 'rejected');
    render(<CookieConsent />);
    act(() => { vi.advanceTimersByTime(3000); });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(root.hasAttribute(CONSENT_BAR_ATTR)).toBe(false);
  });
});
