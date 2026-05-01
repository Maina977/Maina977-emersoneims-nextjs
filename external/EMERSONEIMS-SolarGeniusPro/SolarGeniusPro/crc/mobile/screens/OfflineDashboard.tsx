import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useOffline } from '../hooks/useOffline';
import { Card } from '../components/Card';

export const OfflineDashboard = ({ navigation }: any) => {
  const {
    isOffline,
    syncStatus,
    pendingOperations,
    syncNow,
    getCachedData,
    clearCache
  } = useOffline();

  const [cacheSize, setCacheSize] = useState(0);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    loadCacheInfo();
    const interval = setInterval(loadCacheInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadCacheInfo = async () => {
    const size = await getCachedData('cache_size');
    setCacheSize(size || 0);
    setLastSync(syncStatus.lastSync);
  };

  const handleSync = async () => {
    Alert.alert(
      'Sync Data',
      `Sync ${pendingOperations} pending operations?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sync',
          onPress: async () => {
            await syncNow();
            Alert.alert('Success', 'Data synchronized successfully');
            loadCacheInfo();
          }
        }
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will remove all offline data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: async () => {
            await clearCache();
            loadCacheInfo();
            Alert.alert('Success', 'Cache cleared');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📡 Offline Dashboard</Text>
        <Text style={styles.headerSubtitle}>Manage offline data and sync</Text>
      </View>

      {/* Connection Status */}
      <Card style={styles.statusCard}>
        <Text style={styles.cardTitle}>Connection Status</Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, isOffline ? styles.offline : styles.online]} />
          <Text style={styles.statusText}>
            {isOffline ? 'Offline Mode' : 'Online Mode'}
          </Text>
        </View>
        {lastSync && (
          <Text style={styles.lastSyncText}>
            Last sync: {lastSync.toLocaleTimeString()}
          </Text>
        )}
      </Card>

      {/* Sync Stats */}
      <Card style={styles.statsCard}>
        <Text style={styles.cardTitle}>Sync Statistics</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Pending Operations:</Text>
          <Text style={styles.statValue}>{pendingOperations}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Cache Size:</Text>
          <Text style={styles.statValue}>{(cacheSize / 1024 / 1024).toFixed(2)} MB</Text>
        </View>
      </Card>

      {/* Pending Operations */}
      {pendingOperations > 0 && (
        <Card style={styles.pendingCard}>
          <Text style={styles.cardTitle}>⏳ Pending Operations</Text>
          <Text style={styles.pendingText}>
            {pendingOperations} items waiting to sync
          </Text>
          <TouchableOpacity style={styles.syncButton} onPress={handleSync}>
            <Text style={styles.syncButtonText}>Sync Now</Text>
          </TouchableOpacity>
        </Card>
      )}

      {/* Cached Data */}
      <Card style={styles.cacheCard}>
        <Text style={styles.cardTitle}>💾 Cached Data</Text>
        <Text style={styles.cacheText}>
          Designs, quotes, and site data are stored locally for offline access
        </Text>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearCache}>
          <Text style={styles.clearButtonText}>Clear Cache</Text>
        </TouchableOpacity>
      </Card>

      {/* Offline Features */}
      <Card style={styles.featuresCard}>
        <Text style={styles.cardTitle}>✨ Offline Features Available</Text>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✓</Text>
          <Text style={styles.featureText}>Create and edit designs</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✓</Text>
          <Text style={styles.featureText}>Generate quotes</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✓</Text>
          <Text style={styles.featureText}>Access fault code database</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✓</Text>
          <Text style={styles.featureText}>Field engineer checklists</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✓</Text>
          <Text style={styles.featureText}>Photo capture and storage</Text>
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
  header: {
    padding: 20,
    backgroundColor: '#0f1425',
    borderBottomWidth: 1,
    borderBottomColor: '#1f253f'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC107'
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 5
  },
  statusCard: {
    margin: 15,
    padding: 15
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10
  },
  online: {
    backgroundColor: '#28a745'
  },
  offline: {
    backgroundColor: '#dc3545'
  },
  statusText: {
    fontSize: 14,
    color: '#fff'
  },
  lastSyncText: {
    fontSize: 12,
    color: '#888',
    marginTop: 8
  },
  statsCard: {
    margin: 15,
    padding: 15
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  statLabel: {
    fontSize: 14,
    color: '#888'
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFC107'
  },
  pendingCard: {
    margin: 15,
    padding: 15,
    backgroundColor: '#1a1f35',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107'
  },
  pendingText: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 15
  },
  syncButton: {
    backgroundColor: '#FFC107',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  syncButtonText: {
    color: '#0a0e1c',
    fontWeight: 'bold',
    fontSize: 14
  },
  cacheCard: {
    margin: 15,
    padding: 15
  },
  cacheText: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 15
  },
  clearButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
  },
  featuresCard: {
    margin: 15,
    padding: 15,
    marginBottom: 30
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6
  },
  featureIcon: {
    fontSize: 16,
    color: '#28a745',
    marginRight: 10,
    width: 20
  },
  featureText: {
    fontSize: 14,
    color: '#ccc'
  }
});