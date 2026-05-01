import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';
import { Card } from '../../mobile/ReactNativeApp/components/Card';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

interface PaybackChartProps {
  investment: number;
  cumulativeCashFlow: number[];
  breakEvenYear: number;
  years: number[];
}

export const PaybackChart: React.FC<PaybackChartProps> = ({
  investment,
  cumulativeCashFlow,
  breakEvenYear,
  years
}) => {
  const chartData = {
    labels: years.map(y => `Y${y}`),
    datasets: [
      {
        data: cumulativeCashFlow,
        color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
        strokeWidth: 2
      },
      {
        data: years.map(() => investment),
        color: (opacity = 1) => `rgba(220, 53, 69, ${opacity})`,
        strokeWidth: 1.5,
        withDots: false
      }
    ],
    legend: ['Cumulative Cash Flow', 'Investment']
  };

  const getBreakEvenStatus = () => {
    if (breakEvenYear <= 5) return 'Excellent';
    if (breakEvenYear <= 8) return 'Good';
    if (breakEvenYear <= 12) return 'Average';
    return 'Poor';
  };

  const getBreakEvenColor = () => {
    if (breakEvenYear <= 5) return '#28a745';
    if (breakEvenYear <= 8) return '#FFC107';
    if (breakEvenYear <= 12) return '#fd7e14';
    return '#dc3545';
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Payback Analysis</Text>

      {/* Break-even Summary */}
      <View style={styles.breakEvenCard}>
        <Text style={styles.breakEvenLabel}>Break-even Point</Text>
        <Text style={[styles.breakEvenValue, { color: getBreakEvenColor() }]}>
          Year {breakEvenYear}
        </Text>
        <Text style={[styles.breakEvenStatus, { color: getBreakEvenColor() }]}>
          {getBreakEvenStatus()}
        </Text>
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#0f1425',
            backgroundGradientFrom: '#0f1425',
            backgroundGradientTo: '#0f1425',
            decimalPlaces: 0,
            color: (opacity = 1, index) => {
              const colors = ['#FFC107', '#dc3545'];
              return colors[index % colors.length];
            },
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 },
            formatYLabel: (value) => `KSh ${parseInt(value) / 1000}k`
          }}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Key Insights */}
      <View style={styles.insights}>
        <Text style={styles.insightsTitle}>Key Insights</Text>
        
        <View style={styles.insightRow}>
          <Text style={styles.insightIcon}>📈</Text>
          <View style={styles.insightContent}>
            <Text style={styles.insightLabel}>Payback Period</Text>
            <Text style={styles.insightValue}>{breakEvenYear} years</Text>
          </View>
        </View>

        <View style={styles.insightRow}>
          <Text style={styles.insightIcon}>💰</Text>
          <View style={styles.insightContent}>
            <Text style={styles.insightLabel}>Post-Payback Profit</Text>
            <Text style={styles.insightValue}>
              KSh {cumulativeCashFlow[cumulativeCashFlow.length - 1].toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.insightRow}>
          <Text style={styles.insightIcon}>⏱️</Text>
          <View style={styles.insightContent}>
            <Text style={styles.insightLabel}>Years of Free Energy</Text>
            <Text style={styles.insightValue}>{25 - breakEvenYear} years</Text>
          </View>
        </View>
      </View>

      {/* Recommendation */}
      <View style={styles.recommendation}>
        <Text style={styles.recommendationText}>
          {breakEvenYear <= 8 
            ? "✅ Excellent payback period. The system will generate free electricity for " + (25 - breakEvenYear) + " years."
            : breakEvenYear <= 12
            ? "⚠️ Acceptable payback period. Consider financing options to improve cash flow."
            : "❌ Long payback period. Review system sizing or consider alternative configurations."}
        </Text>
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
    marginBottom: 20
  },
  breakEvenCard: {
    backgroundColor: '#1a1f35',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20
  },
  breakEvenLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8
  },
  breakEvenValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4
  },
  breakEvenStatus: {
    fontSize: 14,
    fontWeight: '600'
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  chart: {
    borderRadius: 16
  },
  insights: {
    marginBottom: 16
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1f253f',
    gap: 12
  },
  insightIcon: {
    fontSize: 20,
    width: 40
  },
  insightContent: {
    flex: 1
  },
  insightLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2
  },
  insightValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff'
  },
  recommendation: {
    backgroundColor: '#1a1f35',
    padding: 15,
    borderRadius: 10
  },
  recommendationText: {
    fontSize: 13,
    color: '#ccc',
    lineHeight: 20
  }
});