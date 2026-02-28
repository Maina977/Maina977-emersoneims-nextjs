/**
 * GENERATOR ORACLE - PUSH NOTIFICATION SERVICE
 * Web Push API integration for notifications
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, unknown>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
}

export type NotificationType =
  | 'fault_alert'
  | 'sync_complete'
  | 'maintenance_reminder'
  | 'parts_update'
  | 'system';

export interface NotificationPreferences {
  enabled: boolean;
  faultAlerts: boolean;
  syncNotifications: boolean;
  maintenanceReminders: boolean;
  partsUpdates: boolean;
  quietHoursStart?: string; // "22:00"
  quietHoursEnd?: string; // "07:00"
}

// ═══════════════════════════════════════════════════════════════════════════════
// AVAILABILITY CHECKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if push notifications are supported
 */
export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

/**
 * Check if notifications are currently allowed
 */
export function areNotificationsAllowed(): boolean {
  return getNotificationPermission() === 'granted';
}

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICE WORKER REGISTRATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Register the service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isPushSupported()) {
    console.warn('Push notifications not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw-oracle.js', {
      scope: '/',
    });

    console.log('Service Worker registered:', registration.scope);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Get existing service worker registration
 */
export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!isPushSupported()) return null;

  try {
    return await navigator.serviceWorker.ready;
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUSH SUBSCRIPTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }

  return await Notification.requestPermission();
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPush(): Promise<PushSubscription | null> {
  const permission = await requestNotificationPermission();

  if (permission !== 'granted') {
    console.warn('Notification permission not granted');
    return null;
  }

  const registration = await getServiceWorkerRegistration();
  if (!registration) {
    console.error('No service worker registration');
    return null;
  }

  try {
    // Get VAPID public key from server
    const response = await fetch('/api/generator-oracle/notifications/vapid-key');
    const { publicKey } = await response.json();

    if (!publicKey) {
      console.error('No VAPID public key available');
      return null;
    }

    // Convert VAPID key to Uint8Array
    const applicationServerKey = urlBase64ToUint8Array(publicKey);

    // Subscribe
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey as BufferSource,
    });

    // Send subscription to server
    await saveSubscription(subscription);

    return subscription;
  } catch (error) {
    console.error('Push subscription failed:', error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  const registration = await getServiceWorkerRegistration();
  if (!registration) return false;

  try {
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return true;

    // Remove from server
    await removeSubscription(subscription.endpoint);

    // Unsubscribe locally
    await subscription.unsubscribe();

    return true;
  } catch (error) {
    console.error('Unsubscribe failed:', error);
    return false;
  }
}

/**
 * Get current push subscription
 */
export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  const registration = await getServiceWorkerRegistration();
  if (!registration) return null;

  try {
    return await registration.pushManager.getSubscription();
  } catch {
    return null;
  }
}

/**
 * Check if currently subscribed
 */
export async function isSubscribed(): Promise<boolean> {
  const subscription = await getCurrentSubscription();
  return subscription !== null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SERVER COMMUNICATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Save subscription to server
 */
async function saveSubscription(subscription: PushSubscription): Promise<boolean> {
  try {
    const response = await fetch('/api/generator-oracle/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Remove subscription from server
 */
async function removeSubscription(endpoint: string): Promise<boolean> {
  try {
    const response = await fetch('/api/generator-oracle/notifications/subscribe', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOCAL NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Show local notification (without push)
 */
export async function showLocalNotification(
  title: string,
  options?: NotificationOptions
): Promise<Notification | null> {
  if (!areNotificationsAllowed()) {
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') return null;
  }

  const registration = await getServiceWorkerRegistration();

  if (registration) {
    // Use service worker notification (works in background)
    await registration.showNotification(title, {
      icon: '/images/oracle-icon-192.png',
      badge: '/images/oracle-badge.png',
      ...options,
    });
    return null;
  } else {
    // Fallback to standard notification
    return new Notification(title, {
      icon: '/images/oracle-icon-192.png',
      ...options,
    });
  }
}

/**
 * Show fault alert notification
 */
export async function showFaultAlert(
  faultCode: string,
  description: string,
  severity: 'low' | 'medium' | 'high' | 'critical'
): Promise<void> {
  const severityEmoji = {
    low: 'ℹ️',
    medium: '⚠️',
    high: '🔶',
    critical: '🔴',
  };

  await showLocalNotification(`${severityEmoji[severity]} Fault: ${faultCode}`, {
    body: description,
    tag: `fault-${faultCode}`,
    requireInteraction: severity === 'critical',
    data: { type: 'fault_alert', faultCode, severity },
  });
}

/**
 * Show sync notification
 */
export async function showSyncNotification(
  version: string,
  faultCount: number
): Promise<void> {
  await showLocalNotification('Database Updated', {
    body: `Synced to v${version} with ${faultCount} fault codes`,
    tag: 'sync-complete',
    data: { type: 'sync_complete', version },
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// PREFERENCES
// ═══════════════════════════════════════════════════════════════════════════════

const PREFS_KEY = 'oracle_notification_prefs';

export const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  faultAlerts: true,
  syncNotifications: true,
  maintenanceReminders: true,
  partsUpdates: false,
};

/**
 * Get notification preferences
 */
export function getNotificationPreferences(): NotificationPreferences {
  if (typeof localStorage === 'undefined') return DEFAULT_PREFERENCES;

  try {
    const data = localStorage.getItem(PREFS_KEY);
    return data ? { ...DEFAULT_PREFERENCES, ...JSON.parse(data) } : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Save notification preferences
 */
export function saveNotificationPreferences(prefs: Partial<NotificationPreferences>): void {
  if (typeof localStorage === 'undefined') return;

  const current = getNotificationPreferences();
  const updated = { ...current, ...prefs };
  localStorage.setItem(PREFS_KEY, JSON.stringify(updated));
}

/**
 * Check if in quiet hours
 */
export function isInQuietHours(): boolean {
  const prefs = getNotificationPreferences();

  if (!prefs.quietHoursStart || !prefs.quietHoursEnd) return false;

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  const [startHour, startMinute] = prefs.quietHoursStart.split(':').map(Number);
  const [endHour, endMinute] = prefs.quietHoursEnd.split(':').map(Number);

  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;

  if (startTime <= endTime) {
    return currentTime >= startTime && currentTime < endTime;
  } else {
    // Quiet hours span midnight
    return currentTime >= startTime || currentTime < endTime;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Convert VAPID public key to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
