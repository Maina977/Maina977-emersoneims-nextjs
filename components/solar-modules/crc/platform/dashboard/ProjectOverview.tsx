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
import { Button } from '../../mobile/ReactNativeApp/components/Button';
import { api } from '../../mobile/ReactNativeApp/services/api';

interface Project {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  systemSize: number;
  location: string;
  createdAt: string;
}

export const ProjectOverview = ({ navigation }: any) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await api.get('/projects');
      if (response.success && response.data) {
        setProjects(response.data);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProjects();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#28a745';
      case 'completed': return '#17a2b8';
      case 'cancelled': return '#dc3545';
      default: return '#FFC107';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    totalCapacity: projects.reduce((sum, p) => sum + (p.systemSize || 0), 0)
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Projects</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stats.active}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalCapacity.toFixed(1)} kW</Text>
          <Text style={styles.statLabel}>Total Capacity</Text>
        </Card>
      </View>

      {/* Create Project Button */}
      <Button
        title="+ New Project"
        onPress={() => navigation.navigate('CreateProject')}
        variant="primary"
        style={styles.createButton}
      />

      {/* Projects List */}
      <Text style={styles.sectionTitle}>Recent Projects</Text>
      {projects.slice(0, 10).map(project => (
        <Card key={project.id} style={styles.projectCard}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ProjectDetails', { projectId: project.id })}
          >
            <View style={styles.projectHeader}>
              <Text style={styles.projectName}>{project.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
                <Text style={styles.statusText}>{getStatusText(project.status)}</Text>
              </View>
            </View>
            <Text style={styles.projectLocation}>📍 {project.location}</Text>
            <Text style={styles.projectSize}>⚡ {project.systemSize || 0} kWp</Text>
            <Text style={styles.projectDate}>
              Created: {new Date(project.createdAt).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </Card>
      ))}

      {projects.length === 0 && !loading && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📂</Text>
          <Text style={styles.emptyText}>No projects yet</Text>
          <Text style={styles.emptySubtext}>Create your first solar project to get started</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1e'
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 15,
    alignItems: 'center'
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFC107'
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 5
  },
  createButton: {
    margin: 15
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
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600'
  },
  projectLocation: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4
  },
  projectSize: {
    fontSize: 14,
    color: '#FFC107',
    fontWeight: '500',
    marginBottom: 4
  },
  projectDate: {
    fontSize: 10,
    color: '#666'
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40
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