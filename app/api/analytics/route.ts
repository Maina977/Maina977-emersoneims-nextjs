// Real-time Analytics API
// Tracks actual visitors, page views, and active sessions
import { NextRequest, NextResponse } from 'next/server';

// In-memory store (for Vercel, use Vercel KV for persistence across deployments)
// This resets on cold starts but provides real tracking during active sessions
declare global {
  var analyticsStore: {
    totalVisits: number;
    uniqueVisitors: Set<string>;
    activeUsers: Map<string, { lastSeen: number; page: string; country?: string }>;
    pageViews: Map<string, number>;
    dailyVisits: Map<string, number>;
    hourlyVisits: Map<string, number>;
    referrers: Map<string, number>;
    devices: { desktop: number; mobile: number; tablet: number };
    countries: Map<string, number>;
    ctaClicks: Map<string, number>;
    ctaTotal: number;
  };
}

// Initialize store
if (!global.analyticsStore) {
  global.analyticsStore = {
    totalVisits: 0,
    uniqueVisitors: new Set(),
    activeUsers: new Map(),
    pageViews: new Map(),
    dailyVisits: new Map(),
    hourlyVisits: new Map(),
    referrers: new Map(),
    devices: { desktop: 0, mobile: 0, tablet: 0 },
    countries: new Map(),
    ctaClicks: new Map(),
    ctaTotal: 0,
  };
}

const store = global.analyticsStore;

// Clean up inactive users (older than 2 minutes)
function cleanupInactiveUsers() {
  const now = Date.now();
  const timeout = 2 * 60 * 1000; // 2 minutes
  
  for (const [id, data] of store.activeUsers.entries()) {
    if (now - data.lastSeen > timeout) {
      store.activeUsers.delete(id);
    }
  }
}

// Hard caps on the in-memory Maps so a malicious client cannot exhaust
// process memory by spamming POSTs with random page/referrer values.
const MAX_PAGES = 5000;
const MAX_REFERRERS = 2000;
const MAX_COUNTRIES = 500;
const MAX_UNIQUE_VISITORS = 50000;
const MAX_HOURLY_BUCKETS = 24 * 14; // ~2 weeks
const MAX_DAILY_BUCKETS = 365;
function capMap<K, V>(map: Map<K, V>, max: number) {
  if (map.size <= max) return;
  const overflow = map.size - max;
  let i = 0;
  for (const k of map.keys()) {
    if (i++ >= overflow) break;
    map.delete(k);
  }
}
function capSet<T>(set: Set<T>, max: number) {
  if (set.size <= max) return;
  const overflow = set.size - max;
  let i = 0;
  for (const v of set) {
    if (i++ >= overflow) break;
    set.delete(v);
  }
}

// Get visitor ID from request
function getVisitorId(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  // Create a simple hash
  const str = `${ip}-${userAgent.slice(0, 50)}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Detect device type
function getDeviceType(userAgent: string): 'desktop' | 'mobile' | 'tablet' {
  const ua = userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
}

// Get date keys
function getDateKey(): string {
  return new Date().toISOString().split('T')[0];
}

function getHourKey(): string {
  const now = new Date();
  return `${now.toISOString().split('T')[0]}-${now.getHours()}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, page, referrer } = body;

    // Cap input string sizes so attackers can't push huge keys into the
    // Maps below (memory growth + JSON response bloat).
    const safePage = typeof page === 'string' ? page.slice(0, 200) : '/';
    const safeReferrer = typeof referrer === 'string' ? referrer.slice(0, 500) : '';

    const visitorId = getVisitorId(req);
    const userAgent = req.headers.get('user-agent') || '';
    const deviceType = getDeviceType(userAgent);
    const country = req.headers.get('x-vercel-ip-country') || 'Unknown';
    
    cleanupInactiveUsers();
    
    if (action === 'pageview') {
      // Track total visits
      store.totalVisits++;
      
      // Track unique visitors
      const isNewVisitor = !store.uniqueVisitors.has(visitorId);
      store.uniqueVisitors.add(visitorId);
      
      // Track active users
      store.activeUsers.set(visitorId, {
        lastSeen: Date.now(),
        page: safePage,
        country,
      });
      
      // Track page views
      const currentViews = store.pageViews.get(safePage) || 0;
      store.pageViews.set(safePage, currentViews + 1);
      
      // Track daily visits
      const dateKey = getDateKey();
      const dailyCount = store.dailyVisits.get(dateKey) || 0;
      store.dailyVisits.set(dateKey, dailyCount + 1);
      
      // Track hourly visits
      const hourKey = getHourKey();
      const hourlyCount = store.hourlyVisits.get(hourKey) || 0;
      store.hourlyVisits.set(hourKey, hourlyCount + 1);
      
      // Track referrers
      if (safeReferrer && !safeReferrer.includes('emersoneims.com')) {
        const refCount = store.referrers.get(safeReferrer) || 0;
        store.referrers.set(safeReferrer, refCount + 1);
      }
      
      // Track devices (only for new visitors)
      if (isNewVisitor) {
        store.devices[deviceType]++;
      }
      
      // Track countries
      if (country) {
        const countryCount = store.countries.get(country) || 0;
        store.countries.set(country, countryCount + 1);
      }

      // Enforce caps to keep memory bounded under abuse.
      capSet(store.uniqueVisitors, MAX_UNIQUE_VISITORS);
      capMap(store.pageViews, MAX_PAGES);
      capMap(store.referrers, MAX_REFERRERS);
      capMap(store.countries, MAX_COUNTRIES);
      capMap(store.hourlyVisits, MAX_HOURLY_BUCKETS);
      capMap(store.dailyVisits, MAX_DAILY_BUCKETS);

      return NextResponse.json({ success: true, visitorId });
    }
    
    if (action === 'heartbeat') {
      // Update last seen time
      if (store.activeUsers.has(visitorId)) {
        const userData = store.activeUsers.get(visitorId)!;
        userData.lastSeen = Date.now();
        if (safePage) userData.page = safePage;
      }
      return NextResponse.json({ success: true });
    }

    if (action === 'cta_click') {
      const kindRaw = typeof body.kind === 'string' ? body.kind.slice(0, 32) : 'unknown';
      const targetRaw = typeof body.target === 'string' ? body.target.slice(0, 200) : '';
      // Backfill the ctaClicks map if a previously-warm worker did not have it.
      if (!store.ctaClicks) store.ctaClicks = new Map();
      const key = `${kindRaw}│${safePage}`;
      store.ctaClicks.set(key, (store.ctaClicks.get(key) || 0) + 1);
      store.ctaTotal = (store.ctaTotal || 0) + 1;
      capMap(store.ctaClicks, 5000);
      void targetRaw; // currently logged via beacon body only
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  cleanupInactiveUsers();
  
  // Get top pages
  const topPages = Array.from(store.pageViews.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([page, views]) => ({ page, views }));
  
  // Get top referrers
  const topReferrers = Array.from(store.referrers.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([referrer, count]) => ({ referrer, count }));
  
  // Get top countries
  const topCountries = Array.from(store.countries.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([country, count]) => ({ country, count }));
  
  // Get hourly data for chart (last 24 hours)
  const hourlyData: { hour: string; visits: number }[] = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 60 * 60 * 1000);
    const key = `${d.toISOString().split('T')[0]}-${d.getHours()}`;
    hourlyData.push({
      hour: `${d.getHours()}:00`,
      visits: store.hourlyVisits.get(key) || 0,
    });
  }
  
  // Get active users list
  const activeUsersList = Array.from(store.activeUsers.entries()).map(([id, data]) => ({
    id: id.slice(0, 6),
    page: data.page,
    country: data.country,
    duration: Math.round((Date.now() - data.lastSeen) / 1000),
  }));
  
  return NextResponse.json({
    realtime: {
      activeUsers: store.activeUsers.size,
      activeUsersList,
    },
    today: {
      visits: store.dailyVisits.get(getDateKey()) || 0,
      uniqueVisitors: store.uniqueVisitors.size,
    },
    total: {
      pageViews: store.totalVisits,
      uniqueVisitors: store.uniqueVisitors.size,
    },
    topPages,
    topReferrers,
    topCountries,
    devices: store.devices,
    hourlyData,
    lastUpdated: new Date().toISOString(),
  });
}
