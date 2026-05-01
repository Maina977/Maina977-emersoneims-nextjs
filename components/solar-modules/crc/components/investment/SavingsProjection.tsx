import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';
import { Card } from '../../mobile/ReactNativeApp/components/Card';

interface SavingsProjectionProps {
  annualSavings: number;
  escalationRate: number;
  degradationRate: number;
  years: number;
}

export const SavingsProjection: React.FC<SavingsProjectionProps> = ({
  annualSavings,
  escalationRate,
  degradationRate,
  years
}) => {
  const generateProjection = () => {
    const projection = [];
    let cumulative = 0;
    
    for (let year = 1; year <= years; year++) {
      const degradation = Math.pow(1 - degradationRate, year - 1);
      const tariffEscalation = Math.pow(1 + escalationRate, year - 1);
      const yearSavings = annualSavings * degradation * tariffEscalation;
      cumulative += yearSavings;
      
      projection.push({
        year,
        savings: yearSavings,
        cumulative
      });
    }
    
    return projection;
  };

  const projection = generateProjection();
  const totalSavings = projection[projection.length - 1].cumulative;

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Savings Projection</Text>
      <Text style={styles.subtitle}>25-Year Forecast with Escalation & Degradation</Text>

      {/* Summary Cards */}
      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Year 1 Savings</Text>
          <Text style={styles.summaryValue}>KSh {annualSavings.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Year 10 Savings</Text>
          <Text style={styles.summaryValue}>
            KSh {projection[9].savings.toLocaleString()}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Year 25 Savings</Text>
          <Text style={styles.summaryValue}>
            KSh {projection[24].savings.toLocaleString()}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Lifetime Savings</Text>
          <Text style={[styles.summaryValue, styles.total]}>
            KSh {totalSavings.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Assumptions */}
      <View style={styles.assumptions}>
        <Text style={styles.assumptionsTitle}>Assumptions</Text>
        <View style={styles.assumptionRow}>
          <Text style={styles.assumptionLabel}>Tariff Escalation Rate:</Text>
          <Text style={styles.assumptionValue}>{escalationRate * 100}% per year</Text>
        </View>
        <View style={styles.assumptionRow}>
          <Text style={styles.assumptionLabel}>Panel Degradation:</Text>
          <Text style={styles.assumptionValue}>{degradationRate * 100}% per year</Text>
        </View>
      </View>

      {/* Projection Table */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.tableHeaderCell]}>Year</Text>
            <Text style={[styles.tableCell, styles.tableHeaderCell]}>Annual Savings (KSh)</Text>
            <Text style={[styles.tableCell, styles.tableHeaderCell]}>Cumulative (KSh)</Text>
          </View>
          
          {projection.filter((_, i) => i % 5 === 0 || i === 24).map(item => (
            <View key={item.year} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.year}</Text>
              <Text style={styles.tableCell}>{Math.round(item.savings).toLocaleString()}</Text>
              <Text style={[styles.tableCell, styles.cumulative]}>
                {Math.round(item.cumulative).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Visual Trend Indicator */}
      <View style={styles.trendIndicator}>
        <Text style={styles.trendLabel}>Savings Trend</Text>
        <View style={styles.trendBars}>
          {projection.filter((_, i) => i % 3 === 0).slice(0, 9).map((item, index) => (
            <View key={index} style={styles.trendBarContainer}>
              <View 
                style={[
                  styles.trendBar, 
                  { height: `${(item.savings / projection[0].savings) * 50}px` }
                ]} 
              />
              <Text style={styles.trendYear}>Y{item.year}</Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 15,
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1a1f35',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  summaryLabel: {
    fontSize: 10,
    color: '#888',
    marginBottom: 4
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff'
  },
  total: {
    color: '#28a745',
    fontSize: 16
  },
  assumptions: {
    backgroundColor: '#1a1f35',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20
  },
  assumptionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFC107',
    marginBottom: 8
  },
  assumptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  assumptionLabel: {
    fontSize: 11,
    color: '#888'
  },
  assumptionValue: {
    fontSize: 11,
    color: '#fff'
  },
  table: {
    marginBottom: 20
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1f253f',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1f253f'
  },
  tableCell: {
    width: 100,
    fontSize: 11,
    color: '#ccc',
    textAlign: 'right'
  },
  tableHeaderCell: {
    color: '#FFC107',
    fontWeight: '600'
  },
  cumulative: {
    color: '#28a745'
  },
  trendIndicator: {
    alignItems: 'center'
  },
  trendLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12
  },
  trendBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12
  },
  trendBarContainer: {
    alignItems: 'center'
  },
  trendBar: {
    width: 20,
    backgroundColor: '#FFC107',
    borderRadius: 4,
    marginBottom: 6
  },
  trendYear: {
    fontSize: 10,
    color: '#666'
  }
});