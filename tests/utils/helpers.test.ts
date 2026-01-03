/**
 * EMERSONEIMS - Unit Tests for Utilities
 * Tests helper functions and utility modules
 */

import { describe, it, expect, vi } from 'vitest';

// Price formatting utility
const formatPrice = (amount: number, currency: string = 'KES'): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Phone number validation
const isValidKenyanPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  // Kenyan numbers: 07XXXXXXXX or 01XXXXXXXX or 254XXXXXXXX
  return /^(07|01|254)\d{8,9}$/.test(cleaned);
};

// Slug generation
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Email validation
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Generator power calculation
const calculateGeneratorSize = (
  totalWatts: number,
  safetyFactor: number = 1.25
): number => {
  return Math.ceil(totalWatts * safetyFactor);
};

// Solar panel calculation
const calculateSolarPanels = (
  dailyKwh: number,
  panelWatts: number = 550,
  sunHours: number = 5
): number => {
  const dailyWh = dailyKwh * 1000;
  const panelDailyOutput = panelWatts * sunHours;
  return Math.ceil(dailyWh / panelDailyOutput);
};

describe('Price Formatting', () => {
  it('formats KES currency correctly', () => {
    const formatted = formatPrice(150000);
    expect(formatted).toContain('150,000');
    // Format can be KES or Ksh depending on locale
    expect(formatted.toLowerCase()).toMatch(/kes|ksh/);
  });

  it('handles decimal amounts', () => {
    const formatted = formatPrice(99999.99);
    expect(formatted).toBeDefined();
  });

  it('formats zero correctly', () => {
    const formatted = formatPrice(0);
    expect(formatted).toContain('0');
  });
});

describe('Phone Validation', () => {
  it('validates correct Kenyan mobile numbers', () => {
    expect(isValidKenyanPhone('0768860655')).toBe(true);
    expect(isValidKenyanPhone('0782914717')).toBe(true);
  });

  it('validates numbers with country code', () => {
    expect(isValidKenyanPhone('254768860655')).toBe(true);
  });

  it('rejects invalid numbers', () => {
    expect(isValidKenyanPhone('123456')).toBe(false);
    expect(isValidKenyanPhone('0868860655')).toBe(false);
  });

  it('handles formatted numbers', () => {
    expect(isValidKenyanPhone('076-886-0655')).toBe(true);
    expect(isValidKenyanPhone('+254 768 860655')).toBe(true);
  });
});

describe('Slug Generation', () => {
  it('converts text to lowercase slug', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(generateSlug('Generator @ 50kVA!')).toBe('generator-50kva');
  });

  it('handles multiple spaces', () => {
    expect(generateSlug('Solar   Power   System')).toBe('solar-power-system');
  });

  it('preserves hyphens', () => {
    expect(generateSlug('E-commerce solution')).toBe('e-commerce-solution');
  });
});

describe('Email Validation', () => {
  it('validates correct emails', () => {
    expect(isValidEmail('info@emersoneims.com')).toBe(true);
    expect(isValidEmail('support@company.co.ke')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('no@domain')).toBe(false);
    expect(isValidEmail('@nodomain.com')).toBe(false);
  });
});

describe('Generator Sizing Calculator', () => {
  it('calculates with default safety factor', () => {
    // 10kW load with 25% safety = 12.5kW -> 13kW
    expect(calculateGeneratorSize(10000)).toBe(12500);
  });

  it('calculates with custom safety factor', () => {
    // 10kW load with 30% safety = 13kW
    expect(calculateGeneratorSize(10000, 1.30)).toBe(13000);
  });

  it('handles small loads', () => {
    expect(calculateGeneratorSize(1000)).toBe(1250);
  });
});

describe('Solar Panel Calculator', () => {
  it('calculates panels needed for daily usage', () => {
    // 20 kWh daily, 550W panels, 5 sun hours
    // 20000 Wh / (550 * 5) = 20000 / 2750 = 7.27 -> 8 panels
    expect(calculateSolarPanels(20)).toBe(8);
  });

  it('calculates with custom panel wattage', () => {
    // 10 kWh daily, 400W panels, 5 sun hours
    // 10000 / (400 * 5) = 10000 / 2000 = 5 panels
    expect(calculateSolarPanels(10, 400)).toBe(5);
  });

  it('calculates with custom sun hours', () => {
    // 15 kWh daily, 550W panels, 4 sun hours
    // 15000 / (550 * 4) = 15000 / 2200 = 6.82 -> 7 panels
    expect(calculateSolarPanels(15, 550, 4)).toBe(7);
  });
});
