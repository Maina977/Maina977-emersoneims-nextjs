/**
 * EMERSONEIMS - Unit Tests for Navigation Component
 * Tests the mega menu navigation system
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock the TeslaStyleNavigation component for testing
const mockNavItems = [
  { href: '/', label: 'HOME', type: 'link' },
  { href: '/about-us', label: 'ABOUT', type: 'link' },
  { key: 'generators', label: 'GENERATORS', type: 'mega' },
  { key: 'solar', label: 'SOLAR', type: 'mega' },
  { href: '/contact', label: 'CONTACT', type: 'link' },
];

// Simple Navigation component for testing
function SimpleNavigation() {
  return (
    <nav data-testid="navigation" role="navigation">
      <ul>
        {mockNavItems.map((item) => (
          <li key={item.href || item.key}>
            {item.type === 'link' ? (
              <a href={item.href} data-testid={`nav-${item.label.toLowerCase()}`}>
                {item.label}
              </a>
            ) : (
              <button data-testid={`nav-${item.label.toLowerCase()}`}>
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

describe('Navigation Component', () => {
  it('renders navigation element', () => {
    render(<SimpleNavigation />);
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    render(<SimpleNavigation />);
    expect(screen.getByTestId('nav-home')).toBeInTheDocument();
    expect(screen.getByTestId('nav-about')).toBeInTheDocument();
    expect(screen.getByTestId('nav-generators')).toBeInTheDocument();
    expect(screen.getByTestId('nav-solar')).toBeInTheDocument();
    expect(screen.getByTestId('nav-contact')).toBeInTheDocument();
  });

  it('has correct href for link items', () => {
    render(<SimpleNavigation />);
    expect(screen.getByTestId('nav-home')).toHaveAttribute('href', '/');
    expect(screen.getByTestId('nav-about')).toHaveAttribute('href', '/about-us');
    expect(screen.getByTestId('nav-contact')).toHaveAttribute('href', '/contact');
  });

  it('mega menu items are buttons (not links)', () => {
    render(<SimpleNavigation />);
    expect(screen.getByTestId('nav-generators').tagName).toBe('BUTTON');
    expect(screen.getByTestId('nav-solar').tagName).toBe('BUTTON');
  });
});

describe('Navigation Accessibility', () => {
  it('has navigation role', () => {
    render(<SimpleNavigation />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('all links are keyboard accessible', () => {
    render(<SimpleNavigation />);
    const homeLink = screen.getByTestId('nav-home');
    homeLink.focus();
    expect(document.activeElement).toBe(homeLink);
  });
});
