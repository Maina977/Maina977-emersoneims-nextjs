import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { Card } from '../../mobile/ReactNativeApp/components/Card';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

interface ProductionData {
  timestamp: Date;
  power: number;
  energy: number;
  voltage: number;
  current: number;
}

interface DailyStats {
  totalEnergy: number;
  peakPower: number;
  averagePower: number;
  peakTime: string;
  efficiency: number;
}

export const ProductionMonitoring = ({ systemId }: { systemId: string }) => {
  const [liveData, setLiveData] = useState<ProductionData | null>(null);
  const [historicalData, setHistoricalData] = useState<ProductionData[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    loadHistoricalData();
    if (isLive) {
      startLiveUpdates();
    }
    return () => stopLiveUpdates();
  }, [timeRange, isLive]);

  const loadHistoricalData = () => {
    // Simulate historical production data
    const data: ProductionData[] = [];
    const now = new Date();
    const hours = timeRange === 'day' ? 24 : timeRange === 'week' ? 168 : 720;
    
    for (let i = hours; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 3600000);
      const hour = timestamp.getHours();
      let power = 0;
      if (hour >= 6 && hour <= 18) {
        power = 4.5 * Math.sin((hour - 6) / 12 * Math.PI);
        power += (Math.random() - 0.5) * 0.5;
      }
      data.push({
        timestamp,
        power: Math.max(0, power),
        energy: power,
        voltage: 230 + (Math.random() - 0.5) * 5,
        current: power * 1000 / 230
      });
    }
    setHistoricalData(data);
    
    // Calculate daily stats
    const todayData = data.slice(-24);
    const totalEnergy = todayData.reduce((sum, d) => sum + d.energy, 0);
    const peakPower = Math.max(...todayData.map(d => d.power));
    const peakHour = todayData.findIndex(d => d.power === peakPower);
    const averagePower = totalEnergy / 24;
    
    setDailyStats({
      totalEnergy: Math.round(totalEnergy * 10) / 10,
      peakPower: Math.round(peakPower * 100) / 100,
      averagePower: Math.round(averagePower * 100) / 100,
      peakTime: `${peakHour}:00`,
      efficiency: Math.round((totalEnergy / (6.96 * 4.8)) * 100)
    });
  };

  const startLiveUpdates = () => {
    const interval = setInterval(() => {
      const now = new Date();
      const hour = now.getHours();
      let power = 0;
      if (hour >= 6 && hour <= 18) {
        power = 4.5 * Math.sin((hour - 6) / 12 * Math.PI);
        power += (Math.random() - 0.5) * 0.3;
      }
      setLiveData({
        timestamp: now,
        power: Math.max(0, power),
        energy: power,
        voltage: 230 + (Math.random() - 0.5) * 3,
        current: power * 1000 / 230
      });
    }, 2000);
    
    return () => clearInterval(interval);
  };

  const stopLiveUpdates = () => {
    // Cleanup would happen in useEffect return
  };

  const chartData = {
    labels: historicalData.filter((_, i) => i % (timeRange === 'day' ? 4 : 24) === 0).map(d => 
      timeRange === 'day' ? `${d.timestamp.getHours()}:00` : 
      timeRange === 'week' ? `${d.timestamp.getDate()}/${d.timestamp.getMonth() + 1}` :
      `${d.timestamp.getDate()}/${d.timestamp.getMonth() + 1}`
    ).slice(0, 12),
    datasets: [
      {
        data: historicalData.filter((_, i) => i % (timeRange === 'day' ? 4 : 24) === 0).map(d => d.power),
        color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };

  return (
    <ScrollView style={styles.container}>
      {/* Live Status Header */}
      <Card style={styles.liveCard}>
        <View style={styles.liveHeader}>
          <Text style={styles.liveTitle}>Live Production</Text>
          <View style={[styles.liveDot, isLive && styles.liveActive]} />
          <Text style={styles.liveStatus}>{isLive ? 'LIVE' : 'OFFLINE'}</Text>
        </View>
        {liveData && (
          <View style={styles.liveMetrics}>
            <View style={styles.liveMetric}>
              <Text style={styles.liveMetricValue}>{liveData.power.toFixed(2)} kW</Text>
              <Text style={styles.liveMetricLabel}>Current Power</Text>
            </View>
            <View style={styles.liveMetric}>
              <Text style={styles.liveMetricValue}>{liveData.voltage.toFixed(0)} V</Text>
              <Text style={styles.liveMetricLabel}>Voltage</Text>
            </View>
            <View style={styles.liveMetric}>
              <Text style={styles.liveMetricValue}>{liveData.current.toFixed(1)} A</Text>
              <Text style={styles.liveMetricLabel}>Current</Text>
            </View>
          </View>
        )}
        <TouchableOpacity 
          style={[styles.liveToggle, isLive && styles.liveToggleActive]}
          onPress={() => setIsLive(!isLive)}
        >
          <Text style={styles.liveToggleText}>{isLive ? 'Stop Live' : 'Start Live'}</Text>
        </TouchableOpacity>
      </Card>

      {/* Daily Stats */}
      {dailyStats && (
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{dailyStats.totalEnergy} kWh</Text>
            <Text style={styles.statLabel}>Today's Production</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{dailyStats.peakPower} kW</Text>
            <Text style={styles.statLabel}>Peak Power</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{dailyStats.peakTime}</Text>
            <Text style={styles.statLabel}>Peak Time</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, styles.efficiency]}>
              {dailyStats.efficiency}%
            </Text>
            <Text style={styles.statLabel}>Efficiency</Text>
          </Card>
        </View>
      )}

      {/* Time Range Selector */}
      <View style={styles.rangeSelector}>
        <TouchableOpacity
          style={[styles.rangeButton, timeRange === 'day' && styles.rangeActive]}
          onPress={() => setTimeRange('day')}
        >
          <Text style={[styles.rangeText, timeRange === 'day' && styles.rangeTextActive]}>Day</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.rangeButton, timeRange === 'week' && styles.rangeActive]}
          onPress={() => setTimeRange('week')}
        >
          <Text style={[styles.rangeText, timeRange === 'week' && styles.rangeTextActive]}>Week</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.rangeButton, timeRange === 'month' && styles.rangeActive]}
          onPress={() => setTimeRange('month')}
        >
          <Text style={[styles.rangeText, timeRange === 'month' && styles.rangeTextActive]}>Month</Text>
        </TouchableOpacity>
      </View>

      {/* Production Chart */}
      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>Production History</Text>
        <LineChart
          data={chartData}
          width={width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#0f1425',
            backgroundGradientFrom: '#0f1425',
            backgroundGradientTo: '#0f1425',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 }
          }}
          bezier
          style={styles.chart}
          formatYLabel={(value) => `${value}kW`}
        />
      </Card>

      {/* Energy Summary */}
      <Card style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Energy Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Energy (Year to Date)</Text>
          <Text style={styles.summaryValue}>3,245 kWh</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Estimated Annual Savings</Text>
          <Text style={[styles.summaryValue, styles.savings]}>KSh 135,000</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>CO₂ Offset</Text>
          <Text style={styles.summaryValue}>1,363 kg</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Trees Equivalent</Text>
          <Text style={styles.summaryValue}>61 trees</Text>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1e'
  },
  liveCard: {
    margin: 15,
    padding: 15
  },
  liveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  liveTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginRight: 8
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#dc3545',
    marginRight: 6
  },
  liveActive: {
    backgroundColor: '#28a745'
  },
  liveStatus: {
    fontSize: 10,
    color: '#888'
  },
  liveMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15
  },
  liveMetric: {
    alignItems: 'center'
  },
  liveMetricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFC107'
  },
  liveMetricLabel: {
    fontSize: 10,
    color: '#888',
    marginTop: 4
  },
  liveToggle: {
    backgroundColor: '#1f253f',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center'
  },
  liveToggleActive: {
    backgroundColor: '#dc3545'
  },
  liveToggleText: {
    color: '#fff',
    fontSize: 12
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    gap: 10
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    alignItems: 'center'
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFC107',
    marginBottom: 4
  },
  efficiency: {
    color: '#28a745'
  },
  statLabel: {
    fontSize: 10,
    color: '#888'
  },
  rangeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginVertical: 10,
    gap: 10
  },
  rangeButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1f253f'
  },
  rangeActive: {
    backgroundColor: '#FFC107'
  },
  rangeText: {
    color: '#fff',
    fontSize: 12
  },
  rangeTextActive: {
    color: '#0a0e1c',
    fontWeight: '600'
  },
  chartCard: {
    margin: 15,
    padding: 15,
    alignItems: 'center'
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15
  },
  chart: {
    borderRadius: 16
  },
  summaryCard: {
    margin: 15,
    padding: 15,
    marginBottom: 30
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1f253f'
  },
  summaryLabel: {
    fontSize: 12,
    color: '#888'
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff'
  },
  savings: {
    color: '#28a745'
  }
});