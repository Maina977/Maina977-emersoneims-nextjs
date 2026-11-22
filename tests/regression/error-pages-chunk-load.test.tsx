// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { isChunkLoadError } from '@/lib/loading/isChunkLoadError';

vi.mock('@/lib/monitoring/reportError', () => ({ reportError: vi.fn() }));
vi.mock('next/link', () => ({ default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a> }));

// Phase 2 network test (2026-11-22): a code download that failed during a
// dropped connection reached the global error page as "Something Went Wrong".
describe('error pages: a failed code download says so and offers a reload', () => {
  it('recognises chunk-load failures and nothing else', () => {
    const chunk = Object.assign(new Error('Loading chunk 3daashyjidwkw failed.'), { name: 'ChunkLoadError' });
    expect(isChunkLoadError(chunk)).toBe(true);
    expect(isChunkLoadError(new TypeError('Failed to fetch dynamically imported module: https://x/a.js'))).toBe(true);
    expect(isChunkLoadError(new Error('Failed to load chunk /_next/static/chunks/abc.js'))).toBe(true);
    expect(isChunkLoadError(new Error('Cannot read properties of undefined'))).toBe(false);
    expect(isChunkLoadError(null)).toBe(false);
  });
  it('global error page: chunk failure → "did not finish loading" + Reload page; other errors → Try Again, no unverified claim', async () => {
    const { default: GlobalError } = await import('@/app/global-error');
    const chunk = Object.assign(new Error('Loading chunk 1 failed.'), { name: 'ChunkLoadError' });
    const { unmount } = render(<GlobalError error={chunk} reset={() => {}} />);
    expect(screen.getByText('The page did not finish loading')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Reload page' })).toBeTruthy();
    unmount();
    render(<GlobalError error={new Error('boom')} reset={() => {}} />);
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/team has been notified/i);
  });
  it('page error boundary: chunk failure → Reload page', async () => {
    const { default: PageError } = await import('@/app/error');
    render(<PageError error={Object.assign(new Error('Loading chunk 2 failed.'), { name: 'ChunkLoadError' })} reset={() => {}} />);
    expect(screen.getByRole('button', { name: 'Reload page' })).toBeTruthy();
  });
});
