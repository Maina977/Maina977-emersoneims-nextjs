import React from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

interface RiskIndicatorProps {
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  factors: string[];
  compact?: boolean;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  level,
  score,
  factors,
  compact = false
}) => {
  const getLevelColor = () => {
    switch (level) {
      case 'low': return '#28a745';
      case 'medium': return '#FFC107';
      case 'high': return '#fd7e14';
      case 'critical': return '#dc3545';
      default: return '#888';
    }
  };

  const getLevelIcon = () => {
    switch (level) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🟠';
      case 'critical': return '🔴';
      default: return '⚪';
    }
  };

  const getLevelText = () => {
    return level.toUpperCase();
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={[styles.compactIndicator, { backgroundColor: getLevelColor() }]}>
          <Text style={styles.compactIcon}>{getLevelIcon()}</Text>
          <Text style={styles.compactText}>{getLevelText()}</Text>
          <Text style={styles.compactScore}>{score}%</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Risk Assessment</Text>
        <View style={[styles.levelBadge, { backgroundColor: getLevelColor() }]}>
          <Text style={styles.levelIcon}>{getLevelIcon()}</Text>
          <Text style={styles.levelText}>{getLevelText()}</Text>
        </View>
      </View>

      <View style={styles.scoreSection}>
        <Text style={styles.scoreLabel}>Risk Score</Text>
        <Text style={[styles.scoreValue, { color: getLevelColor() }]}>{score}%</Text>
        <View style={styles.scoreBar}>
          <View style={[styles.scoreFill, { width: `${score}%`, backgroundColor: getLevelColor() }]} />
        </View>
      </View>

      <View style={styles.factorsSection}>
        <Text style={styles.factorsTitle}>Risk Factors</Text>
        {factors.map((factor, index) => (
          <View key={index} style={styles.factorItem}>
            <Text style={styles.factorBullet}>•</Text>
            <Text style={styles.factorText}>{factor}</Text>
          </View>
        ))}
      </View>

      <View style={styles.mitigationSection}>
        <Text style={styles.mitigationTitle}>Mitigation Strategies</Text>
        <Text style={styles.mitigationText}>
          {level === 'critical' && 'Immediate action required. Schedule professional assessment.'}
          {level === 'high' && 'High priority. Address within 30 days.'}
          {level === 'medium' && 'Monitor closely. Plan mitigation steps.'}
          {level === 'low' && 'Routine monitoring recommended.'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f1425',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1f253f'
  },
  compactContainer: {
    alignItems: 'center'
  },
  compactIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6
  },
  compactIcon: {
    fontSize: 12
  },
  compactText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff'
  },
  compactScore: {
    fontSize: 10,
    color: '#fff',
    marginLeft: 4
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6
  },
  levelIcon: {
    fontSize: 12
  },
  levelText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff'
  },
  scoreSection: {
    marginBottom: 16
  },
  scoreLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8
  },
  scoreBar: {
    height: 6,
    backgroundColor: '#1f253f',
    borderRadius: 3,
    overflow: 'hidden'
  },
  scoreFill: {
    height: '100%',
    borderRadius: 3
  },
  factorsSection: {
    marginBottom: 16
  },
  factorsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8
  },
  factorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  factorBullet: {
    color: '#FFC107',
    marginRight: 8,
    fontSize: 14
  },
  factorText: {
    fontSize: 12,
    color: '#ccc',
    flex: 1
  },
  mitigationSection: {
    backgroundColor: '#1a1f35',
    padding: 12,
    borderRadius: 8
  },
  mitigationTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFC107',
    marginBottom: 6
  },
  mitigationText: {
    fontSize: 12,
    color: '#ccc',
    lineHeight: 18
  }
});