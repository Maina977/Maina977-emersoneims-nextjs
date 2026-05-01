import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';
import { Card } from '../../mobile/ReactNativeApp/components/Card';

interface HealthMetric {
  name: string;
  value: number;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

export const SystemHealth = ({ systemId }: { systemId: string }) => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [overallHealth, setOverallHealth] = useState(92);

  useEffect(() => {
    loadHealthMetrics();
  }, [systemId]);

  const loadHealthMetrics = () => {
    setMetrics([
      { name: 'Inverter', value: 94, status: 'good', description: 'Operating normally' },
      { name: 'Battery', value: 88, status: 'good', description: 'Moderate degradation' },
      { name: 'Panels', value: 96, status: 'good', description: 'Optimal performance' },
      { name: 'Wiring', value: 98, status: 'good', description: 'No issues detected' },
      { name: 'Grid Connection', value: 85, status: 'warning', description: 'Minor fluctuations' },
      { name: 'Cooling System', value: 92, status: 'good', description: 'Fan speed normal' }
    ]);
    setOverallHealth(92);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return '#28a745';
      case 'warning': return '#FFC107';
      case 'critical': return '#dc3545';
      default: return '#888';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return '✅';
      case 'warning': return '⚠️';
      case 'critical': return '❌';
      default: return 'ℹ️';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Overall Health Gauge */}
      <Card style={styles.gaugeCard}>
        <Text style={styles.gaugeTitle}>Overall System Health</Text>
        <View style={styles.gaugeContainer}>
          <View style={[styles.gaugeRing, { borderColor: getStatusColor('good') }]}>
            <Text style={styles.gaugeValue}>{overallHealth}%</Text>
          </View>
        </View>
        <Text style={styles.gaugeStatus}>System Operating Normally</Text>
      </Card>

      {/* Component Health Metrics */}
      <Text style={styles.sectionTitle}>Component Health</Text>
      {metrics.map(metric => (
        <Card key={metric.name} style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricName}>{metric.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(metric.status) }]}>
              <Text style={styles.statusIcon}>{getStatusIcon(metric.status)}</Text>
              <Text style={styles.statusText}>{metric.status.toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.metricBar}>
            <View style={[styles.metricFill, { width: `${metric.value}%`, backgroundColor: getStatusColor(metric.status) }]} />
          </View>
          <Text style={styles.metricValue}>{metric.value}%</Text>
          <Text style={styles.metricDescription}>{metric.description}</Text>
        </Card>
      ))}

      {/* Alerts Section */}
      <Card style={styles.alertsCard}>
        <Text style={styles.alertsTitle}>Recent Alerts</Text>
        <View style={styles.alertItem}>
          <Text style={styles.alertIcon}>⚠️</Text>
          <View style={styles.alertContent}>
            <Text style={styles.alertMessage}>Grid voltage fluctuation detected</Text>
            <Text style={styles.alertTime}>2 hours ago</Text>
          </View>
        </View>
        <View style={styles.alertItem}>
          <Text style={styles.alertIcon}>✅</Text>
          <View style={styles.alertContent}>
            <Text style={styles.alertMessage}>System self-test completed</Text>
            <Text style={styles.alertTime}>Yesterday</Text>
          </View>
        </View>
        <View style={styles.alertItem}>
          <Text style={styles.alertIcon}>ℹ️</Text>
          <View style={styles.alertContent}>
            <Text style={styles.alertMessage}>Scheduled maintenance in 30 days</Text>
            <Text style={styles.alertTime}>3 days ago</Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1e'
  },
  gaugeCard: {
    margin: 15,
    padding: 20,
    alignItems: 'center'
  },
  gaugeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20
  },
  gaugeContainer: {
    alignItems: 'center',
    marginBottom: 15
  },
  gaugeRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  gaugeValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff'
  },
  gaugeStatus: {
    fontSize: 14,
    color: '#28a745'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    paddingHorizontal: 15,
    marginBottom: 10
  },
  metricCard: {
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 15
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  metricName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4
  },
  statusIcon: {
    fontSize: 10
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600'
  },
  metricBar: {
    height: 8,
    backgroundColor: '#1f253f',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8
  },
  metricFill: {
    height: '100%',
    borderRadius: 4
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFC107',
    marginBottom: 8
  },
  metricDescription: {
    fontSize: 12,
    color: '#888'
  },
  alertsCard: {
    margin: 15,
    padding: 15,
    marginBottom: 30
  },
  alertsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1f253f'
  },
  alertIcon: {
    fontSize: 18,
    marginRight: 12
  },
  alertContent: {
    flex: 1
  },
  alertMessage: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4
  },
  alertTime: {
    fontSize: 10,
    color: '#666'
  }
});