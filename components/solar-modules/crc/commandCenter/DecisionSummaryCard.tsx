import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Card } from '../../mobile/ReactNativeApp/components/Card';

interface DecisionSummary {
  id: string;
  title: string;
  description: string;
  type: 'recommendation' | 'alert' | 'insight' | 'action_required';
  priority: 'low' | 'medium' | 'high' | 'critical';
  impact: {
    financial: number;
    timeline: number;
    risk: number;
  };
  reasoning: string[];
  recommendations: string[];
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
}

interface DecisionSummaryCardProps {
  decision: DecisionSummary;
  onReview: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const DecisionSummaryCard: React.FC<DecisionSummaryCardProps> = ({
  decision,
  onReview,
  onApprove,
  onReject
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#FFC107';
      default: return '#17a2b8';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return '💡';
      case 'alert': return '⚠️';
      case 'insight': return '📊';
      case 'action_required': return '⚡';
      default: return '📋';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return { text: '✓ Approved', color: '#28a745' };
      case 'rejected': return { text: '✗ Rejected', color: '#dc3545' };
      case 'reviewed': return { text: '👁️ Reviewed', color: '#FFC107' };
      default: return { text: '⏳ Pending', color: '#17a2b8' };
    }
  };

  const status = getStatusBadge(decision.status);
  const impactTotal = decision.impact.financial + decision.impact.timeline + decision.impact.risk;

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.typeIcon}>{getTypeIcon(decision.type)}</Text>
          <Text style={styles.title}>{decision.title}</Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(decision.priority) }]}>
          <Text style={styles.priorityText}>{decision.priority.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.description}>{decision.description}</Text>

      {/* Impact Meter */}
      <View style={styles.impactSection}>
        <Text style={styles.impactTitle}>Impact Analysis</Text>
        <View style={styles.impactBar}>
          <View style={[styles.impactFill, { width: `${impactTotal / 3}%`, backgroundColor: getPriorityColor(decision.priority) }]} />
        </View>
        <View style={styles.impactMetrics}>
          <View style={styles.impactMetric}>
            <Text style={styles.impactLabel}>Financial</Text>
            <Text style={styles.impactValue}>KSh {decision.impact.financial.toLocaleString()}</Text>
          </View>
          <View style={styles.impactMetric}>
            <Text style={styles.impactLabel}>Timeline</Text>
            <Text style={styles.impactValue}>{decision.impact.timeline} days</Text>
          </View>
          <View style={styles.impactMetric}>
            <Text style={styles.impactLabel}>Risk</Text>
            <Text style={styles.impactValue}>{decision.impact.risk}%</Text>
          </View>
        </View>
      </View>

      {/* Reasoning */}
      <View style={styles.reasoningSection}>
        <Text style={styles.sectionTitle}>AI Reasoning</Text>
        {decision.reasoning.map((reason, index) => (
          <Text key={index} style={styles.reasoningText}>• {reason}</Text>
        ))}
      </View>

      {/* Recommendations */}
      <View style={styles.recommendationsSection}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        {decision.recommendations.map((rec, index) => (
          <Text key={index} style={styles.recommendationText}>→ {rec}</Text>
        ))}
      </View>

      {/* Status & Actions */}
      <View style={styles.footer}>
        <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
          <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
        </View>
        
        {decision.status === 'pending' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.reviewButton} onPress={() => onReview(decision.id)}>
              <Text style={styles.reviewButtonText}>Review</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.approveButton} onPress={() => onApprove(decision.id)}>
              <Text style={styles.approveButtonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectButton} onPress={() => onReject(decision.id)}>
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 15,
    padding: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  typeIcon: {
    fontSize: 20
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  priorityText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold'
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 15,
    lineHeight: 20
  },
  impactSection: {
    marginBottom: 15
  },
  impactTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFC107',
    marginBottom: 8
  },
  impactBar: {
    height: 6,
    backgroundColor: '#1f253f',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10
  },
  impactFill: {
    height: '100%',
    borderRadius: 3
  },
  impactMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  impactMetric: {
    alignItems: 'center',
    flex: 1
  },
  impactLabel: {
    fontSize: 10,
    color: '#888',
    marginBottom: 4
  },
  impactValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff'
  },
  reasoningSection: {
    marginBottom: 12
  },
  recommendationsSection: {
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6
  },
  reasoningText: {
    fontSize: 11,
    color: '#888',
    marginBottom: 4,
    lineHeight: 16
  },
  recommendationText: {
    fontSize: 11,
    color: '#FFC107',
    marginBottom: 4,
    lineHeight: 16
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1f253f'
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600'
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8
  },
  reviewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1f253f',
    borderRadius: 6
  },
  reviewButtonText: {
    color: '#FFC107',
    fontSize: 11
  },
  approveButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#28a745',
    borderRadius: 6
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600'
  },
  rejectButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#dc3545',
    borderRadius: 6
  },
  rejectButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600'
  }
});