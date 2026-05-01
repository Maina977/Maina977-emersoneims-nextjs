import { Platform, Alert, Vibration } from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  data?: any;
  timestamp: Date;
  read: boolean;
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: Array<(notifications: Notification[]) => void> = [];

  constructor() {
    this.configurePushNotifications();
  }

  private configurePushNotifications() {
    PushNotification.configure({
      onRegister: (token) => {
        console.log('Push notification token:', token);
      },
      onNotification: (notification) => {
        console.log('Notification received:', notification);
        
        if (notification.userInteraction) {
          this.handleNotificationTap(notification);
        }
        
        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  showLocalNotification(title: string, message: string, data?: any) {
    PushNotification.localNotification({
      title,
      message,
      data,
      soundName: 'default',
      vibrate: true,
      vibration: 300,
      playSound: true,
      priority: 'high',
      importance: 'high',
    });

    this.addToHistory({
      id: Date.now().toString(),
      title,
      message,
      type: 'info',
      data,
      timestamp: new Date(),
      read: false
    });
  }

  showSuccess(title: string, message: string) {
    this.showLocalNotification(title, message);
    if (Platform.OS === 'android') {
      Vibration.vibrate(200);
    }
  }

  showError(title: string, message: string) {
    this.showLocalNotification(title, message);
    if (Platform.OS === 'android') {
      Vibration.vibrate([500, 200, 500]);
    }
  }

  showWarning(title: string, message: string) {
    this.showLocalNotification(title, message);
  }

  private addToHistory(notification: Notification) {
    this.notifications.unshift(notification);
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }
    this.notifyListeners();
  }

  getNotifications(): Notification[] {
    return this.notifications;
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
  }

  clearAll() {
    this.notifications = [];
    this.notifyListeners();
  }

  private handleNotificationTap(notification: any) {
    const data = notification.data;
    if (data?.screen) {
      // Navigate to screen
      console.log('Navigate to:', data.screen);
    }
  }

  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index !== -1) this.listeners.splice(index, 1);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  scheduleReminder(title: string, message: string, date: Date) {
    PushNotification.localNotificationSchedule({
      title,
      message,
      date,
      allowWhileIdle: true,
    });
  }

  cancelAllReminders() {
    PushNotification.cancelAllLocalNotifications();
  }
}

export const notification = new NotificationService();