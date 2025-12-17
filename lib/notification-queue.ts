/**
 * Notification Queue Utility
 * Handles queuing and sending notifications without blocking API responses
 * 
 * In production, use Redis, BullMQ, or a proper message queue service
 */

interface NotificationData {
  type?: string;
  visitorId?: string;
  conversionType?: string;
  sessionId?: string;
  data?: any;
  timestamp?: number | string;
}

/**
 * Add notification to queue and send asynchronously
 * This prevents blocking the API response
 */
export async function queueNotification(
  data: NotificationData,
  origin: string
): Promise<void> {
  // In production, use a proper queue system (Redis, BullMQ, etc.)
  // For now, send asynchronously without blocking
  
  // Use setImmediate or setTimeout to send in background
  setImmediate(async () => {
    try {
      // Only send if we have a valid origin
      if (!origin || origin === 'http://localhost:3000') {
        console.log('📧 Notification (local/dev - logged only):', data);
        return;
      }

      const notificationUrl = `${origin}/api/notifications/new-lead`;
      
      // Use fetch with timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      try {
        const response = await fetch(notificationUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Internal API call identifier
            'X-Internal-Request': 'true',
          },
          body: JSON.stringify(data),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          console.warn('⚠️ Notification service returned error:', response.status);
        }
      } catch (error) {
        clearTimeout(timeout);
        if (error instanceof Error && error.name !== 'AbortError') {
          console.warn('⚠️ Notification failed:', error.message);
        }
      }
    } catch (error) {
      console.warn('⚠️ Notification queue error:', error instanceof Error ? error.message : 'Unknown error');
    }
  });
}

/**
 * Future: Implement proper queue system
 * 
 * Example with Redis:
 * 
 * import Redis from 'ioredis';
 * const redis = new Redis(process.env.REDIS_URL);
 * 
 * export async function queueNotification(data: NotificationData) {
 *   await redis.lpush('notification_queue', JSON.stringify(data));
 * }
 * 
 * Example with BullMQ:
 * 
 * import { Queue } from 'bullmq';
 * const notificationQueue = new Queue('notifications', {
 *   connection: { host: process.env.REDIS_HOST }
 * });
 * 
 * export async function queueNotification(data: NotificationData) {
 *   await notificationQueue.add('send', data);
 * }
 */

