// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { BOOT_WATCHDOG_SCRIPT, BOOT_NOTICE_ID } from '@/lib/loading/bootWatchdog';

// Solar stress test (2026-11-22): when the framework's own scripts fail to
// download, React never starts and the page gave no sign. The inline watchdog
// must say so, offer Reload page, and stay silent on a page that boots.
type Doc = Document & Record<string, unknown>;
const notice = () => document.getElementById(BOOT_NOTICE_ID);
function failScript(src: string) {
  const s = document.createElement('script');
  s.src = src;
  document.head.appendChild(s);
  s.dispatchEvent(new Event('error')); // not bubbling: the watchdog listens in the capture phase
}
function markReactStarted() { (document as Doc)['__reactContainer$test'] = {}; }

describe('boot watchdog', () => {
  beforeEach(() => { vi.useFakeTimers(); document.body.innerHTML = '<main>server HTML</main>'; delete (document as Doc)['__reactContainer$test']; });
  afterEach(() => { vi.useRealTimers(); document.head.innerHTML = ''; });

  it('a failed framework script without React starting → "did not finish loading" + Reload page, within ~5 s', () => {
    new Function(BOOT_WATCHDOG_SCRIPT)();
    failScript('https://example.test/_next/static/chunks/turbopack-abc.js');
    vi.advanceTimersByTime(3000);
    expect(notice()).toBeNull();
    vi.advanceTimersByTime(2500);
    const n = notice();
    expect(n).not.toBeNull();
    expect(n!.getAttribute('role')).toBe('alert');
    expect(n!.textContent).toMatch(/did not finish loading/);
    expect(n!.textContent).toMatch(/Figures you typed in the tools are kept/);
    expect(n!.querySelector('button')!.textContent).toBe('Reload page');
  });

  it('stays silent when React starts, even after a script failure that a retry fixed', () => {
    new Function(BOOT_WATCHDOG_SCRIPT)();
    failScript('https://example.test/_next/static/chunks/a.js');
    markReactStarted();
    vi.advanceTimersByTime(60000);
    expect(notice()).toBeNull();
  });

  it('ignores failures of non-framework scripts (e.g. analytics)', () => {
    new Function(BOOT_WATCHDOG_SCRIPT)();
    failScript('https://www.googletagmanager.com/gtag/js?id=x');
    vi.advanceTimersByTime(10000);
    expect(notice()).toBeNull();
  });

  it('a stall (React not started after 20 s) → "still downloading" notice, removed once React starts', () => {
    new Function(BOOT_WATCHDOG_SCRIPT)();
    vi.advanceTimersByTime(19000);
    expect(notice()).toBeNull();
    vi.advanceTimersByTime(2000);
    expect(notice()!.textContent).toMatch(/still downloading/);
    markReactStarted();
    vi.advanceTimersByTime(1500);
    expect(notice()).toBeNull();
  });

  it('the root layout renders the watchdog first in <head>', async () => {
    const fs = await import('fs');
    const src = fs.readFileSync('app/layout.tsx', 'utf8');
    const head = src.indexOf('<head>');
    expect(src.indexOf('id="eims-boot-watchdog"')).toBeGreaterThan(head);
    expect(src.indexOf('id="eims-boot-watchdog"')).toBeLessThan(src.indexOf('application/ld+json', head));
  });
});
