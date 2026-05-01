import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Card } from '../../mobile/ReactNativeApp/components/Card';

interface ProjectStage {
  id: string;
  name: string;
  status: 'completed' | 'in_progress' | 'pending' | 'blocked';
  progress: number;
  tasks: Task[];
}

interface Task {
  id: string;
  name: string;
  completed: boolean;
  dueDate?: Date;
  assignee?: string;
}

export const ProjectTracker = ({ projectId }: { projectId: string }) => {
  const [stages, setStages] = useState<ProjectStage[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    loadProjectStages();
  }, [projectId]);

  const loadProjectStages = () => {
    const mockStages: ProjectStage[] = [
      {
        id: '1',
        name: 'Site Assessment',
        status: 'completed',
        progress: 100,
        tasks: [
          { id: '1a', name: 'Initial site visit', completed: true },
          { id: '1b', name: 'Roof measurement', completed: true },
          { id: '1c', name: 'Shading analysis', completed: true }
        ]
      },
      {
        id: '2',
        name: 'System Design',
        status: 'completed',
        progress: 100,
        tasks: [
          { id: '2a', name: '3D design', completed: true },
          { id: '2b', name: 'Electrical diagram', completed: true },
          { id: '2c', name: 'Permit application', completed: true }
        ]
      },
      {
        id: '3',
        name: 'Procurement',
        status: 'in_progress',
        progress: 60,
        tasks: [
          { id: '3a', name: 'Order panels', completed: true },
          { id: '3b', name: 'Order inverter', completed: true },
          { id: '3c', name: 'Order battery', completed: false },
          { id: '3d', name: 'Order mounting', completed: false }
        ]
      },
      {
        id: '4',
        name: 'Installation',
        status: 'pending',
        progress: 0,
        tasks: [
          { id: '4a', name: 'Site preparation', completed: false },
          { id: '4b', name: 'Panel mounting', completed: false },
          { id: '4c', name: 'Electrical wiring', completed: false },
          { id: '4d', name: 'Inverter connection', completed: false }
        ]
      },
      {
        id: '5',
        name: 'Commissioning',
        status: 'pending',
        progress: 0,
        tasks: [
          { id: '5a', name: 'System testing', completed: false },
          { id: '5b', name: 'Grid connection', completed: false },
          { id: '5c', name: 'Customer handover', completed: false }
        ]
      }
    ];
    setStages(mockStages);
    
    const totalProgress = mockStages.reduce((sum, s) => sum + s.progress, 0) / mockStages.length;
    setOverallProgress(Math.round(totalProgress));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in_progress': return '🔄';
      case 'blocked': return '🚫';
      default: return '⏳';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'in_progress': return '#FFC107';
      case 'blocked': return '#dc3545';
      default: return '#888';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Overall Progress */}
      <Card style={styles.progressCard}>
        <Text style={styles.progressTitle}>Overall Project Progress</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${overallProgress}%` }]} />
        </View>
        <Text style={styles.progressPercentage}>{overallProgress}% Complete</Text>
      </Card>

      {/* Timeline */}
      <View style={styles.timeline}>
        {stages.map((stage, index) => (
          <View key={stage.id} style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View style={[styles.timelineDot, { backgroundColor: getStatusColor(stage.status) }]} />
              {index < stages.length - 1 && <View style={styles.timelineLine} />}
            </View>
            <Card style={styles.stageCard}>
              <View style={styles.stageHeader}>
                <Text style={styles.stageName}>{stage.name}</Text>
                <Text style={styles.stageStatus}>
                  {getStatusIcon(stage.status)} {stage.status.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
              
              <View style={styles.stageProgress}>
                <View style={styles.stageProgressBar}>
                  <View style={[styles.stageProgressFill, { width: `${stage.progress}%` }]} />
                </View>
                <Text style={styles.stageProgressText}>{stage.progress}%</Text>
              </View>

              <View style={styles.taskList}>
                {stage.tasks.map(task => (
                  <View key={task.id} style={styles.taskItem}>
                    <Text style={[styles.taskCheckbox, task.completed && styles.taskChecked]}>
                      {task.completed ? '☑' : '☐'}
                    </Text>
                    <Text style={[styles.taskName, task.completed && styles.taskCompleted]}>
                      {task.name}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          </View>
        ))}
      </View>

      {/* Key Dates */}
      <Card style={styles.datesCard}>
        <Text style={styles.datesTitle}>Key Dates</Text>
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>Project Start</Text>
          <Text style={styles.dateValue}>March 15, 2024</Text>
        </View>
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>Estimated Completion</Text>
          <Text style={styles.dateValue}>May 30, 2024</Text>
        </View>
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>Days Remaining</Text>
          <Text style={styles.dateValue}>32 days</Text>
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
  progressBarContainer: {
    width: '100%',
    height: 12,
    backgroundColor: '#1f253f',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFC107',
    borderRadius: 6
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC107'
  },
  timeline: {
    paddingHorizontal: 15
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 15
  },
  timelineLeft: {
    width: 30,
    alignItems: 'center',
    position: 'relative'
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 15
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#1f253f',
    marginTop: 5,
    marginBottom: 5
  },
  stageCard: {
    flex: 1,
    padding: 15,
    marginBottom: 5
  },
  stageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  stageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  },
  stageStatus: {
    fontSize: 12,
    color: '#888'
  },
  stageProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12
  },
  stageProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#1f253f',
    borderRadius: 3,
    overflow: 'hidden'
  },
  stageProgressFill: {
    height: '100%',
    backgroundColor: '#FFC107',
    borderRadius: 3
  },
  stageProgressText: {
    fontSize: 12,
    color: '#FFC107',
    width: 35
  },
  taskList: {
    gap: 8
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  taskCheckbox: {
    fontSize: 16,
    color: '#FFC107'
  },
  taskChecked: {
    color: '#28a745'
  },
  taskName: {
    fontSize: 13,
    color: '#ccc'
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#666'
  },
  datesCard: {
    margin: 15,
    padding: 15,
    marginBottom: 30
  },
  datesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15
  },
  dateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1f253f'
  },
  dateLabel: {
    fontSize: 14,
    color: '#888'
  },
  dateValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500'
  }
});