import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Dimensions
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useOffline } from '../hooks/useOffline';
import { Card } from '../components/Card';
import { LoadingSpinner } from '../components/LoadingSpinner';

const { width } = Dimensions.get('window');

export const HomeScreen = ({ navigation }: any) => {
  const { user, isAuthenticated } = useAuth();
  const { isOffline, syncStatus } = useOffline();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalSavings: 0,
    energyProduced: 0,
    co2Offset: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStats({
        activeProjects: 3,
        totalSavings: 12500,
        energyProduced: 2840,
        co2Offset: 1250
      });
      setLoading(false);
    }, 1000);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || 'Guest'}</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Image
            source={{ uri: 'https://via.placeholder.com/40' }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Offline Indicator */}
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>
            📡 Offline Mode - Changes will sync when online
          </Text>
        </View>
      )}

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stats.activeProjects}</Text>
          <Text style={styles.statLabel}>Active Projects</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>KSh {stats.totalSavings.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Savings</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stats.energyProduced} kWh</Text>
          <Text style={styles.statLabel}>Energy Produced</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stats.co2Offset} kg</Text>
          <Text style={styles.statLabel}>CO₂ Offset</Text>
        </Card>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Design')}
          >
            <Text style={styles.actionIcon}>🎨</Text>
            <Text style={styles.actionText}>New Design</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('FieldEngineerMode')}
          >
            <Text style={styles.actionIcon}>🔧</Text>
            <Text style={styles.actionText}>Field Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('OfflineDashboard')}
          >
            <Text style={styles.actionIcon}>📡</Text>
            <Text style={styles.actionText}>Offline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.actionIcon}>👤</Text>
            <Text style={styles.actionText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Projects */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Projects</Text>
        <Card style={styles.projectCard}>
          <Text style={styles.projectName}>Nairobi CBD Commercial</Text>
          <Text style={styles.projectDetails}>6.96 kWp | KSh 969,818</Text>
          <View style={styles.projectStatus}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>In Progress</Text>
          </View>
        </Card>
        <Card style={styles.projectCard}>
          <Text style={styles.projectName}>Karen Residential</Text>
          <Text style={styles.projectDetails}>4.85 kWp | KSh 650,000</Text>
          <View style={styles.projectStatus}>
            <View style={[styles.statusDot, styles.completed]} />
            <Text style={styles.statusText}>Completed</Text>
          </View>
        </Card>
      </View>

      {/* AI Insight */}
      <Card style={styles.insightCard}>
        <Text style={styles.insightTitle}>🤖 AI Insight</Text>
        <Text style={styles.insightText}>
          Based on your usage patterns, adding a 5kWh battery could increase
          your energy independence by 40% and save an additional KSh 25,000/year.
        </Text>
        <TouchableOpacity style={styles.insightButton}>
          <Text style={styles.insightButtonText}>View Recommendation →</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0f1425',
    borderBottomWidth: 1,
    borderBottomColor: '#1f253f'
  },
  welcomeText: {
    fontSize: 14,
    color: '#888'
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFC107'
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden'
  },
  avatar: {
    width: 40,
    height: 40
  },
  offlineBanner: {
    backgroundColor: '#dc3545',
    padding: 10,
    alignItems: 'center'
  },
  offlineText: {
    color: 'white',
    fontSize: 12
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10
  },
  statCard: {
    flex: 1,
    minWidth: (width - 40) / 2 - 10,
    padding: 15,
    alignItems: 'center'
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC107'
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 5
  },
  section: {
    padding: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  actionButton: {
    flex: 1,
    minWidth: (width - 60) / 2 - 10,
    backgroundColor: '#1a1f35',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f253f'
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8
  },
  actionText: {
    color: '#fff',
    fontSize: 12
  },
  projectCard: {
    marginBottom: 10,
    padding: 15
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  },
  projectDetails: {
    fontSize: 12,
    color: '#888',
    marginTop: 5
  },
  projectStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFC107',
    marginRight: 8
  },
  completed: {
    backgroundColor: '#28a745'
  },
  statusText: {
    fontSize: 12,
    color: '#888'
  },
  insightCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#1a1f35',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107'
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFC107',
    marginBottom: 10
  },
  insightText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
    marginBottom: 15
  },
  insightButton: {
    alignSelf: 'flex-start'
  },
  insightButtonText: {
    color: '#FFC107',
    fontSize: 14,
    fontWeight: '500'
  }
});