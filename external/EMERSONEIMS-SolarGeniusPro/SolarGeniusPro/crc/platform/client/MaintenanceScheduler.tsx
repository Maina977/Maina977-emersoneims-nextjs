import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Card } from '../../mobile/ReactNativeApp/components/Card';
import { Button } from '../../mobile/ReactNativeApp/components/Button';

interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  frequency: 'monthly' | 'quarterly' | 'annual';
  dueDate: Date;
  estimatedDuration: number;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

interface ServiceProvider {
  id: string;
  name: string;
  rating: number;
  specialties: string[];
  phone: string;
  email: string;
}

export const MaintenanceScheduler = ({ systemId }: { systemId: string }) => {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([
    {
      id: '1',
      title: 'Panel Cleaning',
      description: 'Clean solar panels to remove dust and debris',
      frequency: 'monthly',
      dueDate: new Date(Date.now() + 7 * 86400000),
      estimatedDuration: 120,
      priority: 'high',
      completed: false
    },
    {
      id: '2',
      title: 'Inverter Inspection',
      description: 'Check inverter for error codes and proper ventilation',
      frequency: 'quarterly',
      dueDate: new Date(Date.now() + 14 * 86400000),
      estimatedDuration: 45,
      priority: 'medium',
      completed: false
    },
    {
      id: '3',
      title: 'Battery Health Check',
      description: 'Test battery capacity and cell balance',
      frequency: 'quarterly',
      dueDate: new Date(Date.now() + 21 * 86400000),
      estimatedDuration: 60,
      priority: 'high',
      completed: false
    },
    {
      id: '4',
      title: 'Wiring Inspection',
      description: 'Inspect all electrical connections and cables',
      frequency: 'annual',
      dueDate: new Date(Date.now() + 60 * 86400000),
      estimatedDuration: 90,
      priority: 'medium',
      completed: false
    },
    {
      id: '5',
      title: 'System Performance Review',
      description: 'Analyze production data and optimize settings',
      frequency: 'annual',
      dueDate: new Date(Date.now() + 45 * 86400000),
      estimatedDuration: 120,
      priority: 'low',
      completed: false
    }
  ]);

  const [serviceProviders] = useState<ServiceProvider[]>([
    {
      id: 'sp1',
      name: 'SolarCare Kenya',
      rating: 4.8,
      specialties: ['Cleaning', 'Inspection', 'Repair'],
      phone: '0700-123-456',
      email: 'care@solarkenya.co.ke'
    },
    {
      id: 'sp2',
      name: 'EcoPower Solutions',
      rating: 4.6,
      specialties: ['Inverter Service', 'Battery Service'],
      phone: '0711-234-567',
      email: 'service@ecopower.co.ke'
    }
  ]);

  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const completeTask = (taskId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, completed: true } : task
    ));
    Alert.alert('Task Completed', 'Great job! Keep up with regular maintenance.');
  };

  const scheduleService = (provider: ServiceProvider, task: MaintenanceTask) => {
    Alert.alert(
      'Schedule Service',
      `Request service from ${provider.name} for "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Schedule',
          onPress: () => Alert.alert('Request Sent', `${provider.name} will contact you within 24 hours`)
        }
      ]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#FFC107';
      default: return '#17a2b8';
    }
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'monthly': return '📅';
      case 'quarterly': return '📆';
      case 'annual': return '🗓️';
      default: return '📌';
    }
  };

  const upcomingTasks = tasks.filter(t => !t.completed).length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progress = (completedTasks / tasks.length) * 100;

  return (
    <ScrollView style={styles.container}>
      {/* Progress Header */}
      <Card style={styles.progressCard}>
        <Text style={styles.progressTitle}>Maintenance Progress</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {completedTasks} of {tasks.length} tasks completed
        </Text>
        <Text style={styles.upcomingText}>
          📋 {upcomingTasks} upcoming maintenance tasks
        </Text>
      </Card>

      {/* Tasks Section */}
      <Text style={styles.sectionTitle}>Maintenance Tasks</Text>
      {tasks.map(task => (
        <Card key={task.id} style={[styles.taskCard, task.completed && styles.completedTask]}>
          <View style={styles.taskHeader}>
            <View style={styles.taskTitleRow}>
              <Text style={styles.taskIcon}>{getFrequencyIcon(task.frequency)}</Text>
              <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
                {task.title}
              </Text>
            </View>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
              <Text style={styles.priorityText}>{task.priority.toUpperCase()}</Text>
            </View>
          </View>
          
          <Text style={styles.taskDescription}>{task.description}</Text>
          
          <View style={styles.taskDetails}>
            <Text style={styles.taskDetail}>⏱️ {task.estimatedDuration} min</Text>
            <Text style={styles.taskDetail}>📅 Due: {task.dueDate.toLocaleDateString()}</Text>
          </View>

          {!task.completed ? (
            <View style={styles.taskActions}>
              <Button
                title="Mark Complete"
                onPress={() => completeTask(task.id)}
                variant="success"
                size="small"
                style={styles.actionButton}
              />
              <Button
                title="Schedule Service"
                onPress={() => {
                  setSelectedProvider(task.id);
                  Alert.alert(
                    'Select Service Provider',
                    'Choose a provider for this service',
                    serviceProviders.map(provider => ({
                      text: provider.name,
                      onPress: () => scheduleService(provider, task)
                    }))
                  );
                }}
                variant="secondary"
                size="small"
                style={styles.actionButton}
              />
            </View>
          ) : (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓ Completed</Text>
            </View>
          )}
        </Card>
      ))}

      {/* Service Providers */}
      <Text style={styles.sectionTitle}>Recommended Service Providers</Text>
      {serviceProviders.map(provider => (
        <Card key={provider.id} style={styles.providerCard}>
          <Text style={styles.providerName}>{provider.name}</Text>
          <Text style={styles.providerRating}>⭐ {provider.rating} / 5.0</Text>
          <Text style={styles.providerSpecialties}>
            Specialties: {provider.specialties.join(', ')}
          </Text>
          <View style={styles.providerContact}>
            <Text style={styles.contactText}>📞 {provider.phone}</Text>
            <Text style={styles.contactText}>✉️ {provider.email}</Text>
          </View>
          <Button
            title="Contact Provider"
            onPress={() => Alert.alert('Contact', `Call ${provider.phone} or email ${provider.email}`)}
            variant="primary"
            size="small"
            style={styles.contactButton}
          />
        </Card>
      ))}

      {/* Maintenance Tips */}
      <Card style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>💡 Maintenance Tips</Text>
        <Text style={styles.tipText}>• Clean panels every 2-3 months for optimal efficiency</Text>
        <Text style={styles.tipText}>• Monitor inverter display for error codes</Text>
        <Text style={styles.tipText}>• Keep area around inverter clear for ventilation</Text>
        <Text style={styles.tipText}>• Schedule professional inspection annually</Text>
        <Text style={styles.tipText}>• Track production to detect performance drops</Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1e'
  },
  progressCard: {
    margin: 15,
    padding: 20,
    alignItems: 'center'
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#1f253f',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFC107',
    borderRadius: 4
  },
  progressText: {
    fontSize: 14,
    color: '#FFC107',
    marginBottom: 5
  },
  upcomingText: {
    fontSize: 12,
    color: '#888'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    paddingHorizontal: 15,
    marginBottom: 10
  },
  taskCard: {
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 15
  },
  completedTask: {
    backgroundColor: '#1a1f35',
    opacity: 0.7
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  taskIcon: {
    fontSize: 16
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#666'
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12
  },
  priorityText: {
    fontSize: 10,
    color: '#0a0e1c',
    fontWeight: 'bold'
  },
  taskDescription: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 8
  },
  taskDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12
  },
  taskDetail: {
    fontSize: 11,
    color: '#888'
  },
  taskActions: {
    flexDirection: 'row',
    gap: 10
  },
  actionButton: {
    flex: 1
  },
  completedBadge: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center'
  },
  completedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600'
  },
  providerCard: {
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 15
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4
  },
  providerRating: {
    fontSize: 12,
    color: '#FFC107',
    marginBottom: 4
  },
  providerSpecialties: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8
  },
  providerContact: {
    marginBottom: 12
  },
  contactText: {
    fontSize: 11,
    color: '#888',
    marginBottom: 2
  },
  contactButton: {
    marginTop: 4
  },
  tipsCard: {
    margin: 15,
    padding: 15,
    marginBottom: 30,
    backgroundColor: '#1a1f35'
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFC107',
    marginBottom: 10
  },
  tipText: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 6,
    lineHeight: 18
  }
});