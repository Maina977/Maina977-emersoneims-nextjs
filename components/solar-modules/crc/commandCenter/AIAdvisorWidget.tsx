import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Card } from '../../mobile/ReactNativeApp/components/Card';
import { Button } from '../../mobile/ReactNativeApp/components/Button';

interface AdvisorMessage {
  id: string;
  type: 'recommendation' | 'insight' | 'alert' | 'tip';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  action?: {
    label: string;
    handler: () => void;
  };
}

export const AIAdvisorWidget = () => {
  const [messages, setMessages] = useState<AdvisorMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    loadAdvisorMessages();
  }, []);

  const loadAdvisorMessages = () => {
    // Simulate AI advisor messages
    const mockMessages: AdvisorMessage[] = [
      {
        id: '1',
        type: 'recommendation',
        title: 'Battery Upgrade Recommended',
        message: 'Based on your usage patterns, adding a 5kWh battery could increase energy independence by 40% and save an additional KSh 25,000/year.',
        priority: 'high',
        actionable: true,
        action: {
          label: 'View Battery Options',
          handler: () => console.log('View battery options')
        }
      },
      {
        id: '2',
        type: 'insight',
        title: 'Peak Usage Detected',
        message: 'Your highest energy usage is between 6 PM and 9 PM. Consider shifting some loads to daytime for better solar utilization.',
        priority: 'medium',
        actionable: false
      },
      {
        id: '3',
        type: 'alert',
        title: 'Maintenance Due',
        message: 'Panel cleaning is recommended. Dirty panels can reduce production by up to 15%.',
        priority: 'high',
        actionable: true,
        action: {
          label: 'Schedule Cleaning',
          handler: () => console.log('Schedule cleaning')
        }
      },
      {
        id: '4',
        type: 'tip',
        title: 'Maximize Savings',
        message: 'Running your dishwasher and washing machine during peak sun hours (10 AM - 2 PM) can increase solar self-consumption.',
        priority: 'low',
        actionable: false
      }
    ];
    setMessages(mockMessages);
    setLoading(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#FFC107';
      default: return '#17a2b8';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return '💡';
      case 'insight': return '📊';
      case 'alert': return '⚠️';
      case 'tip': return '💪';
      default: return '🤖';
    }
  };

  const highPriorityCount = messages.filter(m => m.priority === 'high').length;

  return (
    <Card style={styles.container}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>🤖</Text>
          <Text style={styles.headerTitle}>AI Energy Advisor</Text>
          {highPriorityCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{highPriorityCount}</Text>
            </View>
          )}
        </View>
        <Text style={styles.expandIcon}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {expanded && (
        <ScrollView style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color="#FFC107" style={styles.loader} />
          ) : (
            messages.map(message => (
              <View key={message.id} style={[styles.messageCard, { borderLeftColor: getPriorityColor(message.priority) }]}>
                <View style={styles.messageHeader}>
                  <Text style={styles.messageIcon}>{getTypeIcon(message.type)}</Text>
                  <Text style={styles.messageTitle}>{message.title}</Text>
                </View>
                <Text style={styles.messageText}>{message.message}</Text>
                {message.actionable && message.action && (
                  <Button
                    title={message.action.label}
                    onPress={message.action.handler}
                    variant="secondary"
                    size="small"
                    style={styles.actionButton}
                  />
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 15,
    overflow: 'hidden'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  headerIcon: {
    fontSize: 24
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFC107'
  },
  badge: {
    backgroundColor: '#dc3545',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold'
  },
  expandIcon: {
    fontSize: 12,
    color: '#888'
  },
  content: {
    maxHeight: 400,
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#1f253f'
  },
  loader: {
    padding: 20
  },
  messageCard: {
    backgroundColor: '#1a1f35',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  messageIcon: {
    fontSize: 16
  },
  messageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff'
  },
  messageText: {
    fontSize: 12,
    color: '#ccc',
    lineHeight: 18,
    marginBottom: 10
  },
  actionButton: {
    alignSelf: 'flex-start'
  }
});