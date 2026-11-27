// @vitest-environment jsdom
/**
 * Generator Oracle usability/reliability pass (2026-11-27), found in a real browser (Chrome,
 * 1366 px and 390 px, local production build):
 *  1. The "Before you start" notice is a modal, but keyboard focus stayed on the page behind it and
 *     Tab walked through hidden links. Focus now goes to its button and Tab stays inside it.
 *  2. Tools & Reports → Alerts spun forever when the notification service could not start
 *     (navigator.serviceWorker.ready never settles without a registration). It now says so.
 *  3. The back button on every screen said "Back to Fault Lookup" but opens the Fault Center
 *     (Guided Diagnosis first). It now says "Back to Fault Center".
 */
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.resetModules(); localStorage.clear(); });

describe('1. the notice keeps keyboard focus', () => {
  beforeEach(() => localStorage.clear());
  it('focus moves to "I understand, continue"; Tab and Shift+Tab stay inside the notice', async () => {
    const { DisclaimerAcknowledgment } = await import('@/components/generator-oracle/DisclaimerBanner');
    const outside = document.createElement('button'); outside.textContent = 'page behind'; document.body.appendChild(outside);
    render(<DisclaimerAcknowledgment onAccept={() => {}} />);
    const btn = await screen.findByRole('button', { name: 'I understand, continue' });
    expect(document.activeElement).toBe(btn);
    const dialog = screen.getByRole('dialog');
    const call = screen.getByRole('link', { name: /0768 860 665/ });
    fireEvent.keyDown(dialog, { key: 'Tab' }); // from the last item → the first
    expect(document.activeElement).toBe(call);
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true }); // from the first → the last
    expect(document.activeElement).toBe(btn);
    outside.focus(); // focus that escaped is brought back in
    fireEvent.keyDown(dialog, { key: 'Tab' });
    expect(dialog.contains(document.activeElement)).toBe(true);
    outside.remove();
  });
  it('accepted before: no notice, nothing takes focus', async () => {
    localStorage.setItem('oracle_disclaimer_accepted', 'true');
    const { DisclaimerAcknowledgment } = await import('@/components/generator-oracle/DisclaimerBanner');
    const onAccept = vi.fn();
    render(<DisclaimerAcknowledgment onAccept={onAccept} />);
    await act(async () => {});
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(onAccept).toHaveBeenCalled();
  });
});

describe('2. Alerts never spins forever', () => {
  it('when the notification service cannot start, the panel says so (no spinner)', async () => {
    vi.doMock('@/lib/generator-oracle/pushNotificationService', async (orig) => ({
      ...(await orig<typeof import('@/lib/generator-oracle/pushNotificationService')>()),
      isPushSupported: () => true,
      registerServiceWorker: async () => null,
    }));
    const { default: NotificationSettings } = await import('@/components/generator-oracle/NotificationSettings');
    const { container } = render(<NotificationSettings />);
    expect(await screen.findByText('Notifications unavailable here')).toBeTruthy();
    expect(screen.getByText(/could not start in this browser/)).toBeTruthy();
    expect(container.querySelector('.animate-spin')).toBeNull();
  });
  it('getServiceWorkerRegistration: no registration → null at once (never waits on serviceWorker.ready)', async () => {
    const never = new Promise(() => {});
    Object.defineProperty(window, 'PushManager', { value: function PushManager() {}, configurable: true });
    Object.defineProperty(window, 'Notification', { value: { permission: 'default' }, configurable: true });
    Object.defineProperty(navigator, 'serviceWorker', { value: { ready: never, getRegistration: async () => undefined, register: async () => { throw new Error('blocked'); } }, configurable: true });
    const svc = await import('@/lib/generator-oracle/pushNotificationService');
    expect(svc.isPushSupported()).toBe(true);
    await expect(svc.getServiceWorkerRegistration()).resolves.toBeNull();
    await expect(svc.isSubscribed()).resolves.toBe(false);
  });
});

describe('3. the back button says where it goes', () => {
  it('"Back to Fault Center" (the screen it opens), never "Back to Fault Lookup"', () => {
    const src = fs.readFileSync(path.resolve('components/generator-oracle/BackToCommand.tsx'), 'utf8');
    expect(src).toContain('Back to Fault Center');
    expect(src).not.toContain('Back to Fault Lookup');
    const mod = fs.readFileSync(path.resolve('components/generator-oracle/GeneratorOracleModule.tsx'), 'utf8');
    expect(mod).toMatch(/<BackToCommand onBack=\{\(\) => setActiveScreen\('faults'\)\}/);
  });
});
