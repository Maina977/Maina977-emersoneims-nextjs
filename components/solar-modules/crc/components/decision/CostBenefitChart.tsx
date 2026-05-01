import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

interface CostBenefitChartProps {
  investment: number;
  annualSavings: number;
  years: number[];
  cumulativeSavings: number[];
}

export const CostBenefitChart: React.FC<CostBenefitChartProps> = ({
  investment,
  annualSavings,
  years,
  cumulativeSavings
}) => {
  const chartData = {
    labels: years.map(y => `Y${y}`),
    datasets: [
      {
        data: cumulativeSavings,
        color: (opacity = 1) => `rgba(40, 167, 69, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };

  const breakEvenYear = years.find(y => cumulativeSavings[y - 1] >= investment);
  const totalReturn = cumulativeSavings[cumulativeSavings.length - 1];
  const netProfit = totalReturn - investment;
  const roi = (netProfit / investment) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cost-Benefit Analysis</Text>
      
      <View style={styles.summaryCards}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Initial Investment</Text>
          <Text style={styles.summaryValue}>KSh {investment.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>10-Year Return</Text>
          <Text style={[styles.summaryValue, styles.profit]}>KSh {totalReturn.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Net Profit</Text>
          <Text style={[styles.summaryValue, styles.profit]}>KSh {netProfit.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>ROI</Text>
          <Text style={[styles.summaryValue, styles.profit]}>{roi.toFixed(0)}%</Text>
        </View>
      </View>

      {breakEvenYear && (
        <View style={styles.breakEvenCard}>
          <Text style={styles.breakEvenIcon}>🎯</Text>
          <Text style={styles.breakEvenText}>
            Break-even achieved in Year {breakEvenYear}
          </Text>
        </View>
      )}

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Cumulative Savings Over Time</Text>
        <BarChart
          data={chartData}
          width={width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#0f1425',
            backgroundGradientFrom: '#0f1425',
            backgroundGradientTo: '#0f1425',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(40, 167, 69, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 }
          }}
          style={styles.chart}
          showValuesOnTopOfBars
          fromZero
        />
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#28a745' }]} />
          <Text style={styles.legendText}>Cumulative Savings</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#dc3545' }]} />
          <Text style={styles.legendText}>Investment Line</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f1425',
    borderRadius: 16,
    padding: 16,
    margin: 15,
    borderWidth: 1,
    borderColor: '#1f253f'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center'
  },
  summaryCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16
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
  profit: {
    color: '#28a745'
  },
  breakEvenCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1f35',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    gap: 10
  },
  breakEvenIcon: {
    fontSize: 20
  },
  breakEvenText: {
    fontSize: 14,
    color: '#FFC107',
    fontWeight: '600'
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16
  },
  chartTitle: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 12
  },
  chart: {
    borderRadius: 16
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6
  },
  legendText: {
    fontSize: 11,
    color: '#888'
  }
});