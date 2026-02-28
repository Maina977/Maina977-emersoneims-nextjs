/**
 * GENERATOR ORACLE - NOTIFICATION SETTINGS
 * Push notification preferences and management
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  BellOff,
  AlertTriangle,
  RefreshCw,
  Settings,
  Clock,
  Check,
  X,
  Loader2,
  Info,
} from 'lucide-react';
import {
  isPushSupported,
  getNotificationPermission,
  isSubscribed,
  subscribeToPush,
  unsubscribeFromPush,
  registerServiceWorker,
  getNotificationPreferences,
  saveNotificationPreferences,
  showLocalNotification,
  DEFAULT_PREFERENCES,
  type NotificationPreferences,
} from '@/lib/generator-oracle/pushNotificationService';

export default function NotificationSettings() {
  const [isSupported, setIsSupported] = useState(true);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Initialize
  useEffect(() => {
    async function init() {
      const supported = isPushSupported();
      setIsSupported(supported);

      if (!supported) {
        setIsLoading(false);
        return;
      }

      // Register service worker
      await registerServiceWorker();

      // Check permission and subscription
      setPermission(getNotificationPermission());
      setSubscribed(await isSubscribed());
      setPreferences(getNotificationPreferences());
      setIsLoading(false);
    }

    init();
  }, []);

  // Toggle notifications
  const toggleNotifications = useCallback(async () => {
    setIsToggling(true);

    try {
      if (subscribed) {
        await unsubscribeFromPush();
        setSubscribed(false);
        saveNotificationPreferences({ enabled: false });
        setPreferences(prev => ({ ...prev, enabled: false }));
      } else {
        const subscription = await subscribeToPush();
        if (subscription) {
          setSubscribed(true);
          saveNotificationPreferences({ enabled: true });
          setPreferences(prev => ({ ...prev, enabled: true }));
          setPermission('granted');

          // Show test notification
          await showLocalNotification('Notifications Enabled', {
            body: 'You will now receive Generator Oracle alerts',
            tag: 'test-notification',
          });
        } else {
          setPermission(getNotificationPermission());
        }
      }
    } catch (error) {
      console.error('Toggle notifications error:', error);
    }

    setIsToggling(false);
  }, [subscribed]);

  // Update preference
  const updatePreference = useCallback((key: keyof NotificationPreferences, value: boolean | string) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    saveNotificationPreferences({ [key]: value });
  }, [preferences]);

  // Send test notification
  const sendTestNotification = useCallback(async () => {
    await showLocalNotification('Test Notification', {
      body: 'This is a test notification from Generator Oracle',
      tag: 'test',
      requireInteraction: false,
    });
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-white">Notifications</h3>
        </div>
        {subscribed && (
          <span className="flex items-center gap-1 text-xs text-green-500">
            <Check className="w-3 h-3" />
            Active
          </span>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Not supported warning */}
        {!isSupported && (
          <div className="flex items-start gap-3 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-medium">Not Supported</p>
              <p className="text-sm text-yellow-400/70">
                Push notifications are not supported in this browser.
              </p>
            </div>
          </div>
        )}

        {/* Permission denied warning */}
        {isSupported && permission === 'denied' && (
          <div className="flex items-start gap-3 p-3 bg-red-900/30 border border-red-700 rounded-lg">
            <BellOff className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-medium">Notifications Blocked</p>
              <p className="text-sm text-red-400/70">
                You've blocked notifications. Please enable them in your browser settings.
              </p>
            </div>
          </div>
        )}

        {/* Main toggle */}
        {isSupported && permission !== 'denied' && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Push Notifications</p>
              <p className="text-sm text-gray-400">
                Receive alerts for faults, sync updates, and more
              </p>
            </div>
            <button
              onClick={toggleNotifications}
              disabled={isToggling}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                subscribed ? 'bg-green-600' : 'bg-gray-600'
              }`}
            >
              {isToggling ? (
                <Loader2 className="w-4 h-4 text-white animate-spin mx-auto" />
              ) : (
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    subscribed ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              )}
            </button>
          </div>
        )}

        {/* Notification types */}
        {subscribed && (
          <>
            <hr className="border-gray-700" />

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-300">Notification Types</p>

              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Fault Alerts</span>
                <input
                  type="checkbox"
                  checked={preferences.faultAlerts}
                  onChange={e => updatePreference('faultAlerts', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500"
                />
              </label>

              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Sync Notifications</span>
                <input
                  type="checkbox"
                  checked={preferences.syncNotifications}
                  onChange={e => updatePreference('syncNotifications', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500"
                />
              </label>

              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Maintenance Reminders</span>
                <input
                  type="checkbox"
                  checked={preferences.maintenanceReminders}
                  onChange={e => updatePreference('maintenanceReminders', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500"
                />
              </label>

              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Parts Updates</span>
                <input
                  type="checkbox"
                  checked={preferences.partsUpdates}
                  onChange={e => updatePreference('partsUpdates', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500"
                />
              </label>
            </div>

            {/* Advanced settings */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
            >
              <Settings className="w-4 h-4" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
            </button>

            {showAdvanced && (
              <div className="space-y-3 p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-300">Quiet Hours</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Start</label>
                    <input
                      type="time"
                      value={preferences.quietHoursStart || '22:00'}
                      onChange={e => updatePreference('quietHoursStart', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">End</label>
                    <input
                      type="time"
                      value={preferences.quietHoursEnd || '07:00'}
                      onChange={e => updatePreference('quietHoursEnd', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  Non-critical notifications will be silenced during quiet hours
                </p>
              </div>
            )}

            {/* Test notification */}
            <button
              onClick={sendTestNotification}
              className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg text-white text-sm hover:bg-gray-600 w-full justify-center"
            >
              <Bell className="w-4 h-4" />
              Send Test Notification
            </button>
          </>
        )}

        {/* Info */}
        <div className="flex items-start gap-2 text-xs text-gray-500 mt-4">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            Notifications help you stay informed about generator faults, database updates,
            and maintenance reminders even when the app is closed.
          </p>
        </div>
      </div>
    </div>
  );
}
