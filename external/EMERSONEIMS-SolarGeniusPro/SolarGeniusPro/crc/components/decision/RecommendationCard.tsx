import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Card } from '../../mobile/ReactNativeApp/components/Card';

interface Recommendation {
  type: string;
  systemSize: number;
  confidence: number;
  savings: number;
  payback: number;
  pros: string[];
  cons: string[];
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  onSelect: () => void;
  isSelected?: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onSelect,
  isSelected = false
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'solar_only': return '☀️';
      case 'solar_battery': return '🔋';
      case 'hybrid': return '⚡';
      case 'offgrid': return '🏝️';
      default: return '☀️';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'solar_only': return 'Solar Only';
      case 'solar_battery': return 'Solar + Battery';
      case 'hybrid': return 'Hybrid (Solar + Gen)';
      case 'offgrid': return 'Off-Grid System';
      default: return type;
    }
  };

  return (
    <Card style={[styles.card, isSelected && styles.selectedCard]}>
      <TouchableOpacity onPress={onSelect} style={styles.cardContent}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.icon}>{getTypeIcon(recommendation.type)}</Text>
            <Text style={styles.title}>{getTypeName(recommendation.type)}</Text>
          </View>
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceText}>{recommendation.confidence}%</Text>
          </View>
        </View>

        <Text style={styles.systemSize}>
          {recommendation.systemSize} kWp System
        </Text>

        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>KSh {recommendation.savings.toLocaleString()}</Text>
            <Text style={styles.metricLabel}>Monthly Savings</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{recommendation.payback} years</Text>
            <Text style={styles.metricLabel}>Payback Period</Text>
          </View>
        </View>

        <View style={styles.prosCons}>
          <View style={styles.pros}>
            <Text style={styles.sectionTitle}>✓ Pros</Text>
            {recommendation.pros.slice(0, 2).map((pro, i) => (
              <Text key={i} style={styles.prosText}>• {pro}</Text>
            ))}
          </View>
          <View style={styles.cons}>
            <Text style={styles.sectionTitle}>✗ Cons</Text>
            {recommendation.cons.slice(0, 2).map((con, i) => (
              <Text key={i} style={styles.consText}>• {con}</Text>
            ))}
          </View>
        </View>

        {isSelected && (
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedText}>✓ Recommended</Text>
          </View>
        )}
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#1f253f'
  },
  selectedCard: {
    borderColor: '#FFC107',
    backgroundColor: '#1a1f35'
  },
  cardContent: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  icon: {
    fontSize: 24
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  confidenceBadge: {
    backgroundColor: '#1f253f',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  confidenceText: {
    color: '#FFC107',
    fontSize: 12,
    fontWeight: '600'
  },
  systemSize: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#1f253f',
    marginBottom: 12
  },
  metric: {
    alignItems: 'center',
    flex: 1
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFC107',
    marginBottom: 4
  },
  metricLabel: {
    fontSize: 10,
    color: '#888'
  },
  metricDivider: {
    width: 1,
    backgroundColor: '#1f253f'
  },
  prosCons: {
    flexDirection: 'row',
    gap: 16
  },
  pros: {
    flex: 1
  },
  cons: {
    flex: 1
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6
  },
  prosText: {
    fontSize: 11,
    color: '#28a745',
    marginBottom: 4
  },
  consText: {
    fontSize: 11,
    color: '#dc3545',
    marginBottom: 4
  },
  selectedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFC107',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  selectedText: {
    color: '#0a0e1c',
    fontSize: 10,
    fontWeight: 'bold'
  }
});