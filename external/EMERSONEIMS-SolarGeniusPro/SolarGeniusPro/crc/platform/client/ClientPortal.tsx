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

interface ClientProject {
  id: string;
  name: string;
  status: 'planning' | 'installing' | 'operational' | 'completed';
  systemSize: number;
  dailyProduction: number;
  monthlySavings: number;
  co2Offset: number;
  lastUpdated: Date;
}

export const ClientPortal = ({ clientId }: { clientId: string }) => {
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const mockProjects: ClientProject[] = [
      {
        id: 'P-1001',
        name: 'Nairobi CBD Commercial',
        status: 'operational',
        systemSize: 6.96,
        dailyProduction: 28.5,
        monthlySavings: 11250,
        co2Offset: 125,
        lastUpdated: new Date()
      },
      {
        id: 'P-1002',
        name: 'Karen Residential',
        status: 'installing',
        systemSize: 4.85,
        dailyProduction: 0,
        monthlySavings: 0,
        co2Offset: 0,
        lastUpdated: new Date()
      }
    ];
    setProjects(mockProjects);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProjects();
    setRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return '✅';
      case 'installing': return '🔧';
      case 'planning': return '📋';
      case 'completed': return '🎉';
      default: return '🔄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return '#28a745';
      case 'installing': return '#FFC107';
      case 'planning': return '#17a2b8';
      default: return '#888';
    }
  };

  const totalSavings = projects.reduce((sum, p) => sum + p.monthlySavings, 0);
  const totalCO2 = projects.reduce((sum, p) => sum + p.co2Offset, 0);

  if (selectedProject) {
    return (
      <ScrollView style={styles.container}>
        {/* Project Header */}
        <Card style={styles.projectHeader}>
          <TouchableOpacity onPress={() => setSelectedProject(null)} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.projectName}>{selectedProject.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedProject.status) }]}>
            <Text style={styles.statusText}>
              {getStatusIcon(selectedProject.status)} {selectedProject.status.toUpperCase()}
            </Text>
          </View>
        </Card>

        {/* Performance Metrics */}
        <Card style={styles.metricsCard}>
          <Text style={styles.cardTitle}>⚡ Performance</Text>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>System Size</Text>
            <Text style={styles.metricValue}>{selectedProject.systemSize} kWp</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Daily Production</Text>
            <Text style={styles.metricValue}>{selectedProject.dailyProduction} kWh</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Monthly Savings</Text>
            <Text style={[styles.metricValue, styles.savings]}>KSh {selectedProject.monthlySavings.toLocaleString()}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>CO₂ Offset</Text>
            <Text style={styles.metricValue}>{selectedProject.co2Offset} kg/month</Text>
          </View>
        </Card>

        {/* Live Production Chart Placeholder */}
        <Card style={styles.chartCard}>
          <Text style={styles.cardTitle}>📊 Today's Production</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartPlaceholderText}>Production Chart</Text>
            <Text style={styles.chartSubtext}>Peak: 4.2 kW at 12:30 PM</Text>
          </View>
        </Card>

        {/* Alerts */}
        <Card style={styles.alertsCard}>
          <Text style={styles.cardTitle}>🔔 Recent Alerts</Text>
          <View style={styles.alertItem}>
            <Text style={styles.alertIcon}>✅</Text>
            <View>
              <Text style={styles.alertMessage}>System operating normally</Text>
              <Text style={styles.alertTime}>2 hours ago</Text>
            </View>
          </View>
          <View style={styles.alertItem}>
            <Text style={styles.alertIcon}>ℹ️</Text>
            <View>
              <Text style={styles.alertMessage}>Scheduled maintenance in 30 days</Text>
              <Text style={styles.alertTime}>Yesterday</Text>
            </View>
          </View>
        </Card>

        {/* Documents */}
        <Card style={styles.documentsCard}>
          <Text style={styles.cardTitle}>📄 Documents</Text>
          <TouchableOpacity style={styles.docItem}>
            <Text style={styles.docIcon}>📘</Text>
            <Text style={styles.docName}>Engineering Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.docItem}>
            <Text style={styles.docIcon}>⚡</Text>
            <Text style={styles.docName}>Electrical Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.docItem}>
            <Text style={styles.docIcon}>💰</Text>
            <Text style={styles.docName}>Financial Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.docItem}>
            <Text style={styles.docIcon}>📐</Text>
            <Text style={styles.docName}>3D Drawings</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏠 Client Portal</Text>
        <Text style={styles.headerSubtitle}>Welcome back! Here's your solar overview</Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryGrid}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{projects.length}</Text>
          <Text style={styles.summaryLabel}>Active Systems</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryValue}>KSh {totalSavings.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>Monthly Savings</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{totalCO2} kg</Text>
          <Text style={styles.summaryLabel}>CO₂ Saved</Text>
        </Card>
      </View>

      {/* Projects List */}
      <Text style={styles.sectionTitle}>Your Solar Systems</Text>
      {projects.map(project => (
        <Card key={project.id} style={styles.projectCard}>
          <TouchableOpacity onPress={() => setSelectedProject(project)}>
            <View style={styles.projectHeader}>
              <Text style={styles.projectTitle}>{project.name}</Text>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(project.status) }]} />
            </View>
            <Text style={styles.projectSize}>⚡ {project.systemSize} kWp System</Text>
            {project.status === 'operational' && (
              <>
                <Text style={styles.projectProduction}>📈 {project.dailyProduction} kWh/day</Text>
                <Text style={styles.projectSavings}>💰 Saving KSh {project.monthlySavings.toLocaleString()}/month</Text>
              </>
            )}
            <Text style={styles.projectUpdated}>Updated: {project.lastUpdated.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </Card>
      ))}

      {/* Support Section */}
      <Card style={styles.supportCard}>
        <Text style={styles.cardTitle}>🛠️ Need Help?</Text>
        <Text style={styles.supportText}>
          Our support team is available 24/7 to assist you.
        </Text>
        <View style={styles.supportButtons}>
          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportButtonText}>📞 Call Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportButtonText}>💬 Live Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportButtonText}>📧 Email</Text>
          </TouchableOpacity>
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
  summaryGrid: {
    flexDirection: 'row',
    padding: 15,
    gap: 10
  },
  summaryCard: {
    flex: 1,
    padding: 15,
    alignItems: 'center'
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFC107',
    marginBottom: 5
  },
  summaryLabel: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    paddingHorizontal: 15,
    marginBottom: 10
  },
  projectCard: {
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 15
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  projectSize: {
    fontSize: 14,
    color: '#FFC107',
    marginBottom: 4
  },
  projectProduction: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 2
  },
  projectSavings: {
    fontSize: 12,
    color: '#28a745',
    marginBottom: 4
  },
  projectUpdated: {
    fontSize: 10,
    color: '#666',
    marginTop: 8
  },
  supportCard: {
    margin: 15,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10
  },
  supportText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 15
  },
  supportButtons: {
    flexDirection: 'row',
    gap: 10
  },
  supportButton: {
    backgroundColor: '#1f253f',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8
  },
  supportButtonText: {
    color: '#FFC107',
    fontSize: 12
  },
  backButton: {
    marginBottom: 10
  },
  backText: {
    color: '#FFC107',
    fontSize: 14
  },
  projectName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    color: '#0a0e1c',
    fontSize: 12,
    fontWeight: '600'
  },
  metricsCard: {
    margin: 15,
    padding: 15
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1f253f'
  },
  metricLabel: {
    fontSize: 14,
    color: '#888'
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff'
  },
  savings: {
    color: '#28a745'
  },
  chartCard: {
    margin: 15,
    padding: 15
  },
  chartPlaceholder: {
    height: 150,
    backgroundColor: '#1a1f35',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  chartPlaceholderText: {
    color: '#888',
    fontSize: 14
  },
  chartSubtext: {
    color: '#666',
    fontSize: 10,
    marginTop: 5
  },
  alertsCard: {
    margin: 15,
    padding: 15
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1f253f'
  },
  alertIcon: {
    fontSize: 16
  },
  alertMessage: {
    fontSize: 12,
    color: '#ccc'
  },
  alertTime: {
    fontSize: 10,
    color: '#666'
  },
  documentsCard: {
    margin: 15,
    padding: 15,
    marginBottom: 30
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1f253f'
  },
  docIcon: {
    fontSize: 20
  },
  docName: {
    fontSize: 14,
    color: '#fff'
  }
});