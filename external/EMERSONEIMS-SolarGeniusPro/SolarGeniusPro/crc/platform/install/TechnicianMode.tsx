import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Switch
} from 'react-native';
import { Card } from '../../mobile/ReactNativeApp/components/Card';
import { Button } from '../../mobile/ReactNativeApp/components/Button';
import { useCamera } from '../../mobile/ReactNativeApp/hooks/useCamera';
import { useLocation } from '../../mobile/ReactNativeApp/hooks/useLocation';

interface WorkOrder {
  id: string;
  projectId: string;
  projectName: string;
  type: 'installation' | 'maintenance' | 'repair' | 'inspection';
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  scheduledDate: Date;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  tasks: WorkTask[];
  notes: string[];
}

interface WorkTask {
  id: string;
  description: string;
  completed: boolean;
  timeSpent: number;
  notes?: string;
}

export const TechnicianMode = ({ technicianId }: { technicianId: string }) => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [activeOrder, setActiveOrder] = useState<WorkOrder | null>(null);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [timeTracking, setTimeTracking] = useState({ active: false, startTime: null, elapsed: 0 });
  const [taskNotes, setTaskNotes] = useState('');
  
  const { takePhoto, photos } = useCamera();
  const { location, getCurrentLocation, startTracking, stopTracking } = useLocation();

  useEffect(() => {
    loadWorkOrders();
    startTracking();
    return () => stopTracking();
  }, []);

  const loadWorkOrders = () => {
    const mockOrders: WorkOrder[] = [
      {
        id: 'WO-001',
        projectId: 'P-1001',
        projectName: 'Nairobi CBD Commercial',
        type: 'installation',
        status: 'assigned',
        priority: 'high',
        scheduledDate: new Date(),
        location: {
          address: 'Moi Avenue, Nairobi',
          lat: -1.2864,
          lng: 36.8172
        },
        tasks: [
          { id: 'T1', description: 'Site safety inspection', completed: false, timeSpent: 0 },
          { id: 'T2', description: 'Mounting rail installation', completed: false, timeSpent: 0 },
          { id: 'T3', description: 'Panel mounting', completed: false, timeSpent: 0 },
          { id: 'T4', description: 'Inverter connection', completed: false, timeSpent: 0 },
          { id: 'T5', description: 'System testing', completed: false, timeSpent: 0 }
        ],
        notes: ['Customer requested expedited installation']
      },
      {
        id: 'WO-002',
        projectId: 'P-1002',
        projectName: 'Karen Residential',
        type: 'maintenance',
        status: 'assigned',
        priority: 'medium',
        scheduledDate: new Date(Date.now() + 86400000),
        location: {
          address: 'Karen Road, Nairobi',
          lat: -1.3157,
          lng: 36.7084
        },
        tasks: [
          { id: 'T1', description: 'Panel cleaning', completed: false, timeSpent: 0 },
          { id: 'T2', description: 'Inverter diagnostic', completed: false, timeSpent: 0 },
          { id: 'T3', description: 'Battery health check', completed: false, timeSpent: 0 }
        ],
        notes: []
      }
    ];
    setWorkOrders(mockOrders);
  };

  const startWorkOrder = (order: WorkOrder) => {
    setActiveOrder({ ...order, status: 'in_progress' });
    setShowCheckIn(true);
  };

  const checkIn = async () => {
    const currentLocation = await getCurrentLocation();
    if (currentLocation) {
      setShowCheckIn(false);
      startTimeTracking();
      Alert.alert('Checked In', 'You have successfully checked in to the site');
    } else {
      Alert.alert('Location Error', 'Unable to get your location. Please enable GPS.');
    }
  };

  const startTimeTracking = () => {
    setTimeTracking({
      active: true,
      startTime: Date.now(),
      elapsed: 0
    });
  };

  const stopTimeTracking = () => {
    if (timeTracking.active && timeTracking.startTime) {
      const elapsed = Math.floor((Date.now() - timeTracking.startTime) / 60000);
      setTimeTracking({
        active: false,
        startTime: null,
        elapsed: timeTracking.elapsed + elapsed
      });
    }
  };

  const toggleTask = (taskId: string) => {
    if (!activeOrder) return;
    
    setActiveOrder({
      ...activeOrder,
      tasks: activeOrder.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    });
  };

  const addTaskNote = (taskId: string) => {
    if (!activeOrder || !taskNotes) return;
    
    setActiveOrder({
      ...activeOrder,
      tasks: activeOrder.tasks.map(task =>
        task.id === taskId 
          ? { ...task, notes: task.notes ? `${task.notes}\n${taskNotes}` : taskNotes }
          : task
      )
    });
    setTaskNotes('');
  };

  const completeWorkOrder = () => {
    Alert.alert(
      'Complete Work Order',
      'Are you sure all tasks are completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Complete',
          onPress: () => {
            stopTimeTracking();
            Alert.alert('Success', 'Work order completed successfully');
            setActiveOrder(null);
            loadWorkOrders();
          }
        }
      ]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return '#dc3545';
      case 'high': return '#FFC107';
      case 'medium': return '#17a2b8';
      default: return '#888';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'installation': return '🔧';
      case 'maintenance': return '🛠️';
      case 'repair': return '🔨';
      case 'inspection': return '🔍';
      default: return '📋';
    }
  };

  if (activeOrder) {
    return (
      <ScrollView style={styles.container}>
        {/* Active Work Order Header */}
        <Card style={styles.activeHeader}>
          <View style={styles.headerRow}>
            <Text style={styles.orderId}>{activeOrder.id}</Text>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(activeOrder.priority) }]}>
              <Text style={styles.priorityText}>{activeOrder.priority.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.projectName}>{activeOrder.projectName}</Text>
          <Text style={styles.orderType}>{getTypeIcon(activeOrder.type)} {activeOrder.type.toUpperCase()}</Text>
          <Text style={styles.orderAddress}>📍 {activeOrder.location.address}</Text>
        </Card>

        {/* Time Tracking */}
        <Card style={styles.timeCard}>
          <Text style={styles.cardTitle}>⏱️ Time Tracking</Text>
          <Text style={styles.timeElapsed}>
            Total Time: {Math.floor(timeTracking.elapsed / 60)}h {timeTracking.elapsed % 60}m
          </Text>
          {timeTracking.active && (
            <View style={styles.timerActive}>
              <View style={styles.timerDot} />
              <Text style={styles.timerText}>Tracking in progress...</Text>
            </View>
          )}
          <Button
            title={timeTracking.active ? "Stop Tracking" : "Start Tracking"}
            onPress={timeTracking.active ? stopTimeTracking : startTimeTracking}
            variant={timeTracking.active ? "danger" : "success"}
            size="small"
          />
        </Card>

        {/* Tasks */}
        <Text style={styles.sectionTitle}>Tasks</Text>
        {activeOrder.tasks.map(task => (
          <Card key={task.id} style={styles.taskCard}>
            <TouchableOpacity
              style={styles.taskHeader}
              onPress={() => toggleTask(task.id)}
            >
              <View style={[styles.taskCheckbox, task.completed && styles.taskChecked]}>
                {task.completed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[styles.taskDescription, task.completed && styles.taskCompletedText]}>
                {task.description}
              </Text>
            </TouchableOpacity>
            
            {task.notes && (
              <Text style={styles.taskNotes}>{task.notes}</Text>
            )}
            
            <View style={styles.taskActions}>
              <TextInput
                style={styles.noteInput}
                placeholder="Add note..."
                placeholderTextColor="#666"
                value={taskNotes}
                onChangeText={setTaskNotes}
              />
              <TouchableOpacity 
                style={styles.addNoteButton}
                onPress={() => addTaskNote(task.id)}
              >
                <Text style={styles.addNoteText}>Add</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}

        {/* Photos Section */}
        <Card style={styles.photosCard}>
          <Text style={styles.cardTitle}>📸 Site Photos</Text>
          <View style={styles.photoGrid}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoItem}>
                <Text style={styles.photoIcon}>📷</Text>
                <Text style={styles.photoName}>Photo {index + 1}</Text>
              </View>
            ))}
          </View>
          <Button
            title="Take Photo"
            onPress={takePhoto}
            variant="secondary"
            size="small"
          />
        </Card>

        {/* Notes */}
        <Card style={styles.notesCard}>
          <Text style={styles.cardTitle}>📝 General Notes</Text>
          {activeOrder.notes.map((note, index) => (
            <Text key={index} style={styles.noteText}>• {note}</Text>
          ))}
          <TextInput
            style={styles.generalNotesInput}
            placeholder="Add general note..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={3}
          />
        </Card>

        {/* Complete Button */}
        <Button
          title="Complete Work Order"
          onPress={completeWorkOrder}
          variant="primary"
          style={styles.completeButton}
        />
      </ScrollView>
    );
  }

  // Work Orders List View
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔧 Technician Mode</Text>
        <Text style={styles.headerSubtitle}>Assigned Work Orders</Text>
      </View>

      {/* Check-in Modal */}
      <Modal visible={showCheckIn} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <Text style={styles.modalTitle}>Check In to Site</Text>
            <Text style={styles.modalText}>
              Please confirm your location before starting work.
            </Text>
            {location && (
              <Text style={styles.locationText}>
                📍 {location.latitude?.toFixed(6)}, {location.longitude?.toFixed(6)}
              </Text>
            )}
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setShowCheckIn(false)}
                variant="secondary"
              />
              <Button
                title="Check In"
                onPress={checkIn}
                variant="primary"
              />
            </View>
          </Card>
        </View>
      </Modal>

      {workOrders.map(order => (
        <Card key={order.id} style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>{order.id}</Text>
            <View style={[styles.statusBadge, { backgroundColor: order.status === 'assigned' ? '#FFC107' : '#28a745' }]}>
              <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.orderProject}>{order.projectName}</Text>
          <Text style={styles.orderType}>{getTypeIcon(order.type)} {order.type.toUpperCase()}</Text>
          <Text style={styles.orderAddress}>📍 {order.location.address}</Text>
          <Text style={styles.orderDate}>📅 {order.scheduledDate.toLocaleDateString()}</Text>
          <Text style={styles.taskCount}>📋 {order.tasks.length} tasks</Text>
          <Button
            title="Start Work"
            onPress={() => startWorkOrder(order)}
            variant="primary"
            style={styles.startButton}
          />
        </Card>
      ))}

      {workOrders.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>✅</Text>
          <Text style={styles.emptyText}>No Assigned Work Orders</Text>
          <Text style={styles.emptySubtext}>Check back later for new assignments</Text>
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
  activeHeader: {
    margin: 15,
    padding: 15
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  orderId: {
    fontSize: 14,
    color: '#FFC107',
    fontWeight: 'bold'
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
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5
  },
  orderType: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5
  },
  orderAddress: {
    fontSize: 12,
    color: '#888'
  },
  timeCard: {
    margin: 15,
    padding: 15,
    alignItems: 'center'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10
  },
  timeElapsed: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC107',
    marginBottom: 10
  },
  timerActive: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  timerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#28a745',
    marginRight: 8
  },
  timerText: {
    fontSize: 12,
    color: '#28a745'
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
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center'
  },
  taskChecked: {
    backgroundColor: '#FFC107'
  },
  checkmark: {
    color: '#0a0e1c',
    fontWeight: 'bold'
  },
  taskDescription: {
    flex: 1,
    fontSize: 14,
    color: '#fff'
  },
  taskCompletedText: {
    textDecorationLine: 'line-through',
    color: '#666'
  },
  taskNotes: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#1a1f35',
    borderRadius: 6
  },
  taskActions: {
    flexDirection: 'row',
    gap: 8
  },
  noteInput: {
    flex: 1,
    backgroundColor: '#1a1f35',
    borderRadius: 8,
    padding: 8,
    color: '#fff',
    fontSize: 12
  },
  addNoteButton: {
    backgroundColor: '#1f253f',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8
  },
  addNoteText: {
    color: '#FFC107',
    fontSize: 12
  },
  photosCard: {
    margin: 15,
    padding: 15
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10
  },
  photoItem: {
    alignItems: 'center',
    width: 60
  },
  photoIcon: {
    fontSize: 30,
    marginBottom: 4
  },
  photoName: {
    fontSize: 10,
    color: '#888'
  },
  notesCard: {
    margin: 15,
    padding: 15
  },
  noteText: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 5
  },
  generalNotesInput: {
    backgroundColor: '#1a1f35',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginTop: 10,
    textAlignVertical: 'top'
  },
  completeButton: {
    margin: 15,
    marginBottom: 30
  },
  orderCard: {
    margin: 15,
    padding: 15
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12
  },
  statusText: {
    fontSize: 10,
    color: '#0a0e1c',
    fontWeight: 'bold'
  },
  orderProject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4
  },
  orderDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 8
  },
  taskCount: {
    fontSize: 12,
    color: '#FFC107',
    marginTop: 4,
    marginBottom: 12
  },
  startButton: {
    marginTop: 8
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '80%',
    padding: 20,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFC107',
    marginBottom: 15
  },
  modalText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 15
  },
  locationText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 20
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15
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