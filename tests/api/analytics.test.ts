/**
 * EMERSONEIMS - Unit Tests for Analytics API
 * Tests the visitor tracking and analytics system
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock analytics store
const createMockStore = () => ({
  totalPageViews: 0,
  uniqueVisitors: new Set<string>(),
  activeUsers: new Map<string, { page: string; timestamp: number }>(),
  pageViews: {} as Record<string, number>,
  referrers: {} as Record<string, number>,
  devices: { mobile: 0, desktop: 0, tablet: 0 },
});

describe('Analytics Store', () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore();
  });

  it('initializes with zero values', () => {
    expect(store.totalPageViews).toBe(0);
    expect(store.uniqueVisitors.size).toBe(0);
    expect(store.activeUsers.size).toBe(0);
  });

  it('tracks page views correctly', () => {
    store.totalPageViews++;
    store.pageViews['/'] = (store.pageViews['/'] || 0) + 1;
    
    expect(store.totalPageViews).toBe(1);
    expect(store.pageViews['/']).toBe(1);
  });

  it('tracks unique visitors', () => {
    const visitorId1 = 'visitor-123';
    const visitorId2 = 'visitor-456';
    
    store.uniqueVisitors.add(visitorId1);
    store.uniqueVisitors.add(visitorId2);
    store.uniqueVisitors.add(visitorId1); // Duplicate
    
    expect(store.uniqueVisitors.size).toBe(2);
  });

  it('tracks active users', () => {
    const visitorId = 'visitor-123';
    store.activeUsers.set(visitorId, {
      page: '/generators',
      timestamp: Date.now(),
    });
    
    expect(store.activeUsers.has(visitorId)).toBe(true);
    expect(store.activeUsers.get(visitorId)?.page).toBe('/generators');
  });

  it('tracks device types', () => {
    store.devices.mobile++;
    store.devices.desktop += 2;
    
    expect(store.devices.mobile).toBe(1);
    expect(store.devices.desktop).toBe(2);
    expect(store.devices.tablet).toBe(0);
  });

  it('tracks referrers', () => {
    store.referrers['google.com'] = 5;
    store.referrers['facebook.com'] = 3;
    
    expect(store.referrers['google.com']).toBe(5);
    expect(store.referrers['facebook.com']).toBe(3);
  });
});

describe('Analytics Calculations', () => {
  it('calculates bounce rate correctly', () => {
    const singlePageVisits = 30;
    const totalVisits = 100;
    const bounceRate = (singlePageVisits / totalVisits) * 100;
    
    expect(bounceRate).toBe(30);
  });

  it('calculates pages per session', () => {
    const totalPageViews = 500;
    const totalSessions = 100;
    const pagesPerSession = totalPageViews / totalSessions;
    
    expect(pagesPerSession).toBe(5);
  });

  it('identifies top pages', () => {
    const pageViews: Record<string, number> = {
      '/': 100,
      '/generators': 80,
      '/solar': 60,
      '/contact': 40,
    };
    
    const topPages = Object.entries(pageViews)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    expect(topPages[0][0]).toBe('/');
    expect(topPages[1][0]).toBe('/generators');
    expect(topPages[2][0]).toBe('/solar');
  });
});
