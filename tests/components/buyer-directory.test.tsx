/**
 * Homepage purchasing directory (external audit, Nov 2026, §3).
 * Every link must point at a route the site actually serves.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import BuyerDirectory, { BUY_LINKS, SERVICE_LINKS } from '@/components/home/BuyerDirectory';
import { getAllServiceSlugs } from '@/lib/services/allServices';

const root = join(__dirname, '..', '..');

function routeExists(href: string): boolean {
  const path = href.split('#')[0];
  // A static folder (e.g. app/services/solar-inverters) or a slug served by
  // app/services/[service].
  if (existsSync(join(root, 'app', ...path.split('/').filter(Boolean), 'page.tsx'))) return true;
  return path.startsWith('/services/') && getAllServiceSlugs().includes(path.slice('/services/'.length));
}

describe('BuyerDirectory', () => {
  it('links only to routes that exist', () => {
    for (const l of [...BUY_LINKS, ...SERVICE_LINKS]) expect(routeExists(l.href), l.href).toBe(true);
  });

  it('renders a labelled section with both groups and the contact actions', () => {
    render(<BuyerDirectory />);
    expect(screen.getByRole('heading', { level: 2, name: 'What are you looking for?' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Buy equipment' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Get a service' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Request a quote/ }).getAttribute('href')).toBe('/contact');
    expect(screen.getByRole('link', { name: /Talk to an engineer/ }).getAttribute('href')).toBe('tel:+254768860665');
    expect(screen.getAllByRole('link').length).toBe(BUY_LINKS.length + SERVICE_LINKS.length + 2);
  });

  it('makes no price, stock or response-time claims', () => {
    const text = [...BUY_LINKS, ...SERVICE_LINKS].map((l) => `${l.label} ${l.note}`).join(' ');
    expect(text).not.toMatch(/in stock|KES|hours?|same day|guarantee/i);
  });
});
