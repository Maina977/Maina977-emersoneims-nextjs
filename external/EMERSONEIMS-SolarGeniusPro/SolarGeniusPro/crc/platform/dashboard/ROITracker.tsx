import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';
import { Card } from '../../mobile/ReactNativeApp/components/Card';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

interface ROIData {
  year: number;
  savings: number;
  cumulative: number;
  roi: number;
}

export const ROITracker = ({ projectId }: { projectId: string }) => {
  const [data, setData] = useState<ROIData[]>([]);
  const [summary, setSummary] = useState({
    totalInvestment: 0,
    totalSavings: 0,
    netProfit: 0,
    paybackYears: 0,
    roiPercentage: 0
  });

  useEffect(() => {
    loadROIData();
  }, [projectId]);

  const loadROIData = () => {
    // Simulate ROI data
    const mockData: ROIData[] = [];
    let cumulative = -969818;
    
    for (let year = 1; year <= 10; year++) {
      const savings = 135000 * (1 - (year - 1) * 0.005);
      cumulative += savings;
      mockData.push({
        year,
        savings: Math.round(savings),
        cumulative: Math.round(cumulative),
        roi: Math.round((cumulative / 969818) * 100)
      });
    }
    
    setData(mockData);
    setSummary({
      totalInvestment: 969818,
      totalSavings: mockData.reduce((sum, d) => sum + d.savings, 0),
      netProfit: mockData[mockData.length - 1].cumulative,
      paybackYears: 7.2,
      roiPercentage: mockData[mockData.length - 1].roi
    });
  };

  const chartData = {
    labels: data.map(d => `Y${d.year}`),
    datasets: [
      {
        data: data.map(d => d.cumulative / 1000),
        color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };

  return (
    <ScrollView style={styles.container}>
      {/* Summary Cards */}
      <View style={styles.summaryGrid}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Investment</Text>
          <Text style={styles.summaryValue}>KSh {summary.totalInvestment.toLocaleString()}</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Savings (10yr)</Text>
          <Text style={styles.summaryValue}>KSh {summary.totalSavings.toLocaleString()}</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Net Profit</Text>
          <Text style={[styles.summaryValue, styles.profit]}>KSh {summary.netProfit.toLocaleString()}</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>ROI</Text>
          <Text style={[styles.summaryValue, styles.profit]}>{summary.roiPercentage}%</Text>
        </Card>
      </View>

      {/* Chart */}
      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>Cumulative Cash Flow (KSh '000)</Text>
        <LineChart
          data={chartData}
          width={width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#0f1425',
            backgroundGradientFrom: '#0f1425',
            backgroundGradientTo: '#0f1425',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 }
          }}
          bezier
          style={styles.chart}
        />
      </Card>

      {/* Yearly Breakdown */}
      <Text style={styles.sectionTitle}>Yearly Breakdown</Text>
      {data.map(item => (
        <Card key={item.year} style={styles.yearCard}>
          <View style={styles.yearHeader}>
            <Text style={styles.yearText}>Year {item.year}</Text>
            <Text style={[styles.yearCumulative, item.cumulative >= 0 && styles.positive]}>
              {item.cumulative >= 0 ? '+' : ''}KSh {item.cumulative.toLocaleString()}
            </Text>
          </View>
          <View style={styles.yearDetails}>
            <Text style={styles.yearDetail}>Annual Savings: KSh {item.savings.toLocaleString()}</Text>
            <Text style={styles.yearDetail}>ROI: {item.roi}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(100, item.roi)}%` }]} />
          </View>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1e'
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    padding: 15,
    alignItems: 'center'
  },
  summaryLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  profit: {
    color: '#28a745'
  },
  chartCard: {
    margin: 15,
    padding: 15,
    alignItems: 'center'
  },
  chartTitle: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 15
  },
  chart: {
    borderRadius: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    paddingHorizontal: 15,
    marginBottom: 10
  },
  yearCard: {
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 15
  },
  yearHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  yearText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  },
  yearCumulative: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFC107'
  },
  positive: {
    color: '#28a745'
  },
  yearDetails: {
    marginBottom: 10
  },
  yearDetail: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4
  },
  progressBar: {
    height: 6,
    backgroundColor: '#1f253f',
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFC107',
    borderRadius: 3
  }
});