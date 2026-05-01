import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { Card } from '../../mobile/ReactNativeApp/components/Card';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  timestamp: Date;
  read: boolean;
  actionable: boolean;
}

export const AlertsPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = () => {
    // Simulate alerts
    const mockAlerts: Alert[] = [
      {
        id: '1',
        title: 'Production Drop Detected',
        message: 'Solar production is 15% below expected levels. Check for shading or panel issues.',
        severity: 'warning',
        timestamp: new Date(Date.now() - 2 * 3600000),
        read: false,
        actionable: true
      },
      {
        id: '2',
        title: 'Inverter Warning',
        message: 'Inverter temperature is above normal range. Ensure proper ventilation.',
        severity: 'critical',
        timestamp: new Date(Date.now() - 5 * 3600000),
        read: false,
        actionable: true
      },
      {
        id: '3',
        title: 'System Health Check',
        message: 'Weekly system health check completed. All systems operational.',
        severity: 'success',
        timestamp: new Date(Date.now() - 24 * 3600000),
        read: true,
        actionable: false
      },
      {
        id: '4',
        title: 'Battery Status Update',
        message: 'Battery at 85% health. Expected replacement in 2 years.',
        severity: 'info',
        timestamp: new Date(Date.now() - 2 * 24 * 3600000),
        read: true,
        actionable: false
      },
      {
        id: '5',
        title: 'Grid Outage Alert',
        message: 'Grid power outage detected. System running on battery backup.',
        severity: 'critical',
        timestamp: new Date(Date.now() - 3 * 24 * 3600000),
        read: true,
        actionable: true
      }
    ];
    setAlerts(mockAlerts);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAlerts();
    setRefreshing(false);
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🔴';
      case 'warning': return '🟡';
      case 'success': return '🟢';
      default: return '🔵';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc3545';
      case 'warning': return '#FFC107';
      case 'success': return '#28a745';
      default: return '#17a2b8';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unread') return !alert.read;
    if (filter === 'critical') return alert.severity === 'critical';
    return true;
  });

  const unreadCount = alerts.filter(a => !a.read).length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.read).length;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header Stats */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{alerts.length}</Text>
          <Text style={styles.statLabel}>Total Alerts</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statValue, styles.unreadValue]}>{unreadCount}</Text>
          <Text style={styles.statLabel}>Unread</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statValue, styles.criticalValue]}>{criticalCount}</Text>
          <Text style={styles.statLabel}>Critical</Text>
        </Card>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'unread' && styles.filterActive]}
          onPress={() => setFilter('unread')}
        >
          <Text style={[styles.filterText, filter === 'unread' && styles.filterTextActive]}>Unread</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'critical' && styles.filterActive]}
          onPress={() => setFilter('critical')}
        >
          <Text style={[styles.filterText, filter === 'critical' && styles.filterTextActive]}>Critical</Text>
        </TouchableOpacity>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Alerts List */}
      {filteredAlerts.map(alert => (
        <Card
          key={alert.id}
          style={[
            styles.alertCard,
            !alert.read && styles.unreadCard,
            { borderLeftColor: getSeverityColor(alert.severity) }
          ]}
        >
          <TouchableOpacity
            onPress={() => markAsRead(alert.id)}
            style={styles.alertContent}
          >
            <View style={styles.alertHeader}>
              <Text style={styles.alertIcon}>{getSeverityIcon(alert.severity)}</Text>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              {!alert.read && <View style={styles.unreadDot} />}
            </View>
            <Text style={styles.alertMessage}>{alert.message}</Text>
            <View style={styles.alertFooter}>
              <Text style={styles.alertTime}>
                {formatTimeAgo(alert.timestamp)}
              </Text>
              {alert.actionable && (
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionText}>View Details →</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </Card>
      ))}

      {filteredAlerts.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>✅</Text>
          <Text style={styles.emptyText}>No alerts</Text>
          <Text style={styles.emptySubtext}>All clear! No alerts to display.</Text>
        </View>
      )}
    </ScrollView>
  );
};

const formatTimeAgo = (date: Date) => {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1e'
  },
  statsRow: {
    flexDirection: 'row',
    padding: 15,
    gap: 10
  },
  statCard: {
    flex: 1,
    padding: 15,
    alignItems: 'center'
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC107'
  },
  unreadValue: {
    color: '#17a2b8'
  },
  criticalValue: {
    color: '#dc3545'
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 5
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
    gap: 10
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1f253f'
  },
  filterActive: {
    backgroundColor: '#FFC107'
  },
  filterText: {
    color: '#fff',
    fontSize: 12
  },
  filterTextActive: {
    color: '#0a0e1c',
    fontWeight: '600'
  },
  markAllText: {
    color: '#FFC107',
    fontSize: 12,
    marginLeft: 'auto'
  },
  alertCard: {
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 15,
    borderLeftWidth: 4
  },
  unreadCard: {
    backgroundColor: '#1a1f35'
  },
  alertContent: {
    flex: 1
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  alertIcon: {
    fontSize: 16,
    marginRight: 8
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    flex: 1
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFC107',
    marginLeft: 8
  },
  alertMessage: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 10,
    lineHeight: 20
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  alertTime: {
    fontSize: 10,
    color: '#666'
  },
  actionButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#1f253f',
    borderRadius: 6
  },
  actionText: {
    color: '#FFC107',
    fontSize: 10
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 50
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16
  },
  emptyText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center'
  }
});