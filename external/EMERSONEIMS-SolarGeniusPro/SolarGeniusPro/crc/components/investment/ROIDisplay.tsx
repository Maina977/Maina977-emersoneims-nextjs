import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';
import { Card } from '../../mobile/ReactNativeApp/components/Card';
import { ProgressChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

interface ROIDisplayProps {
  totalInvestment: number;
  annualSavings: number;
  paybackYears: number;
  roiPercentage: number;
  npv: number;
  irr: number;
}

export const ROIDisplay: React.FC<ROIDisplayProps> = ({
  totalInvestment,
  annualSavings,
  paybackYears,
  roiPercentage,
  npv,
  irr
}) => {
  const chartData = {
    labels: ['ROI', 'NPV', 'IRR'],
    data: [
      Math.min(roiPercentage / 100, 1),
      Math.min(npv / totalInvestment / 2, 1),
      Math.min(irr / 30, 1)
    ]
  };

  const getROIColor = (roi: number) => {
    if (roi >= 20) return '#28a745';
    if (roi >= 10) return '#FFC107';
    return '#dc3545';
  };

  const getPaybackColor = (years: number) => {
    if (years <= 5) return '#28a745';
    if (years <= 8) return '#FFC107';
    return '#dc3545';
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Return on Investment</Text>
      
      {/* Key Metrics Grid */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Total Investment</Text>
          <Text style={styles.metricValue}>KSh {totalInvestment.toLocaleString()}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Annual Savings</Text>
          <Text style={[styles.metricValue, styles.savings]}>KSh {annualSavings.toLocaleString()}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Payback Period</Text>
          <Text style={[styles.metricValue, { color: getPaybackColor(paybackYears) }]}>
            {paybackYears} years
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>ROI</Text>
          <Text style={[styles.metricValue, { color: getROIColor(roiPercentage) }]}>
            {roiPercentage}%
          </Text>
        </View>
      </View>

      {/* Gauge Chart */}
      <View style={styles.chartContainer}>
        <ProgressChart
          data={chartData}
          width={width - 60}
          height={180}
          strokeWidth={16}
          radius={42}
          chartConfig={{
            backgroundColor: '#0f1425',
            backgroundGradientFrom: '#0f1425',
            backgroundGradientTo: '#0f1425',
            decimalPlaces: 0,
            color: (opacity = 1, index) => {
              const colors = ['#28a745', '#FFC107', '#17a2b8'];
              return colors[index % colors.length];
            },
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 }
          }}
          hideLegend={false}
        />
      </View>

      {/* Interpretation */}
      <View style={styles.interpretation}>
        <Text style={styles.interpretationTitle}>What This Means</Text>
        <Text style={styles.interpretationText}>
          {roiPercentage >= 20 
            ? "Excellent investment! Your solar system will generate significant returns."
            : roiPercentage >= 10
            ? "Good investment. The system will pay for itself within a reasonable timeframe."
            : "Moderate returns. Consider financing options to improve ROI."}
        </Text>
      </View>

      {/* Comparison Benchmarks */}
      <View style={styles.benchmarks}>
        <Text style={styles.benchmarksTitle}>Industry Benchmarks</Text>
        <View style={styles.benchmarkRow}>
          <Text style={styles.benchmarkLabel}>Your ROI:</Text>
          <Text style={[styles.benchmarkValue, { color: getROIColor(roiPercentage) }]}>
            {roiPercentage}%
          </Text>
        </View>
        <View style={styles.benchmarkRow}>
          <Text style={styles.benchmarkLabel}>Industry Average:</Text>
          <Text style={styles.benchmarkValue}>15%</Text>
        </View>
        <View style={styles.benchmarkRow}>
          <Text style={styles.benchmarkLabel}>Top Performers:</Text>
          <Text style={styles.benchmarkValue}>20-25%</Text>
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
    marginBottom: 20
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1a1f35',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  metricLabel: {
    fontSize: 10,
    color: '#888',
    marginBottom: 4
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff'
  },
  savings: {
    color: '#28a745'
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  interpretation: {
    backgroundColor: '#1a1f35',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20
  },
  interpretationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFC107',
    marginBottom: 8
  },
  interpretationText: {
    fontSize: 13,
    color: '#ccc',
    lineHeight: 20
  },
  benchmarks: {
    borderTopWidth: 1,
    borderTopColor: '#1f253f',
    paddingTop: 15
  },
  benchmarksTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10
  },
  benchmarkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6
  },
  benchmarkLabel: {
    fontSize: 12,
    color: '#888'
  },
  benchmarkValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff'
  }
});