import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Card } from '../../mobile/ReactNativeApp/components/Card';

interface ChecklistItem {
  id: string;
  category: 'pre_install' | 'safety' | 'electrical' | 'mechanical' | 'post_install';
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

export const Checklist = ({ projectId }: { projectId: string }) => {
  const [items, setItems] = useState<ChecklistItem[]>([
    // Pre-installation
    { id: 'pre1', category: 'pre_install', title: 'Site Assessment Complete', description: 'Thorough site assessment performed', completed: true, required: true },
    { id: 'pre2', category: 'pre_install', title: 'Permits Obtained', description: 'All necessary permits secured', completed: true, required: true },
    { id: 'pre3', category: 'pre_install', title: 'Equipment Delivered', description: 'All components on site', completed: false, required: true },
    // Safety
    { id: 'saf1', category: 'safety', title: 'PPE Available', description: 'Proper protective equipment on site', completed: true, required: true },
    { id: 'saf2', category: 'safety', title: 'First Aid Kit', description: 'First aid kit accessible', completed: true, required: true },
    { id: 'saf3', category: 'safety', title: 'Fire Extinguisher', description: 'Fire extinguisher nearby', completed: false, required: true },
    { id: 'saf4', category: 'safety', title: 'Lockout/Tagout', description: 'Electrical lockout equipment ready', completed: false, required: true },
    // Electrical
    { id: 'elec1', category: 'electrical', title: 'Main Breaker Off', description: 'Main breaker locked out', completed: false, required: true },
    { id: 'elec2', category: 'electrical', title: 'Voltage Verified', description: 'Zero voltage confirmed', completed: false, required: true },
    { id: 'elec3', category: 'electrical', title: 'Wire Gauges Correct', description: 'Cable sizing verified', completed: false, required: true },
    // Mechanical
    { id: 'mech1', category: 'mechanical', title: 'Roof Condition Checked', description: 'Roof structure verified', completed: true, required: true },
    { id: 'mech2', category: 'mechanical', title: 'Mounting Points Marked', description: 'Mounting locations identified', completed: false, required: true },
    { id: 'mech3', category: 'mechanical', title: 'Tools Ready', description: 'All tools available', completed: true, required: false },
    // Post-installation
    { id: 'post1', category: 'post_install', title: 'System Tested', description: 'Complete system test performed', completed: false, required: true },
    { id: 'post2', category: 'post_install', title: 'Documentation Complete', description: 'All paperwork filled', completed: false, required: true },
    { id: 'post3', category: 'post_install', title: 'Customer Training', description: 'Customer briefed on operation', completed: false, required: true }
  ]);

  const [filter, setFilter] = useState<string>('all');

  const toggleItem = (itemId: string) => {
    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'pre_install': return 'Pre-Installation';
      case 'safety': return 'Safety';
      case 'electrical': return 'Electrical';
      case 'mechanical': return 'Mechanical';
      case 'post_install': return 'Post-Installation';
      default: return category;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pre_install': return '📋';
      case 'safety': return '🛡️';
      case 'electrical': return '⚡';
      case 'mechanical': return '🔧';
      case 'post_install': return '✅';
      default: return '📌';
    }
  };

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.category === filter);

  const completedCount = items.filter(i => i.completed).length;
  const requiredCount = items.filter(i => i.required).length;
  const requiredCompleted = items.filter(i => i.required && i.completed).length;
  const allRequiredComplete = requiredCompleted === requiredCount;

  return (
    <ScrollView style={styles.container}>
      {/* Progress Summary */}
      <Card style={styles.progressCard}>
        <Text style={styles.progressTitle}>Installation Checklist</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(completedCount / items.length) * 100}%` }]} />
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsText}>Overall: {completedCount}/{items.length}</Text>
          <Text style={styles.statsText}>Required: {requiredCompleted}/{requiredCount}</Text>
        </View>
        {allRequiredComplete && (
          <View style={styles.readyBadge}>
            <Text style={styles.readyText}>✓ Ready for Inspection</Text>
          </View>
        )}
      </Card>

      {/* Filter Buttons */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterChipText, filter === 'all' && styles.filterChipTextActive]}>All</Text>
        </TouchableOpacity>
        {['pre_install', 'safety', 'electrical', 'mechanical', 'post_install'].map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.filterChip, filter === cat && styles.filterChipActive]}
            onPress={() => setFilter(cat)}
          >
            <Text style={[styles.filterChipText, filter === cat && styles.filterChipTextActive]}>
              {getCategoryName(cat)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Checklist Items */}
      {filteredItems.map(item => (
        <Card key={item.id} style={styles.checklistCard}>
          <TouchableOpacity
            style={styles.checklistItem}
            onPress={() => toggleItem(item.id)}
          >
            <View style={[styles.checkbox, item.completed && styles.checked]}>
              {item.completed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.itemContent}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                {item.required && <Text style={styles.requiredBadge}>Required</Text>}
              </View>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        </Card>
      ))}

      {/* Export Button */}
      <TouchableOpacity style={styles.exportButton}>
        <Text style={styles.exportButtonText}>📄 Export Checklist (PDF)</Text>
      </TouchableOpacity>
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
    padding: 20
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15
  },
  progressBar: {
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  statsText: {
    fontSize: 12,
    color: '#888'
  },
  readyBadge: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5
  },
  readyText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 10
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1f253f',
    marginRight: 8
  },
  filterChipActive: {
    backgroundColor: '#FFC107'
  },
  filterChipText: {
    color: '#fff',
    fontSize: 12
  },
  filterChipTextActive: {
    color: '#0a0e1c',
    fontWeight: '600'
  },
  checklistCard: {
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 15
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2
  },
  checked: {
    backgroundColor: '#FFC107'
  },
  checkmark: {
    color: '#0a0e1c',
    fontWeight: 'bold',
    fontSize: 14
  },
  itemContent: {
    flex: 1
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  },
  requiredBadge: {
    fontSize: 10,
    color: '#dc3545',
    fontWeight: '600'
  },
  itemDescription: {
    fontSize: 12,
    color: '#888'
  },
  exportButton: {
    backgroundColor: '#1f253f',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30
  },
  exportButtonText: {
    color: '#FFC107',
    fontWeight: '600'
  }
});