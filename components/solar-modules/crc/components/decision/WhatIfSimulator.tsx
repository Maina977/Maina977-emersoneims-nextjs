import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { Card } from '../../mobile/ReactNativeApp/components/Card';
import { Button } from '../../mobile/ReactNativeApp/components/Button';
import Slider from '@react-native-community/slider';

interface WhatIfSimulatorProps {
  baseSystemSize: number;
  baseBatterySize: number;
  baseTariff: number;
  onSimulate: (params: any) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  baseSystemSize,
  baseBatterySize,
  baseTariff,
  onSimulate
}) => {
  const [systemSize, setSystemSize] = useState(baseSystemSize);
  const [batterySize, setBatterySize] = useState(baseBatterySize);
  const [tariff, setTariff] = useState(baseTariff);
  const [interestRate, setInterestRate] = useState(12);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runSimulation = () => {
    const newResults = {
      systemSize,
      batterySize,
      totalCost: systemSize * 95000 + batterySize * 36000,
      monthlySaving: systemSize * 5.2 * 30 * 0.85 * tariff / 1000,
      payback: (systemSize * 95000 + batterySize * 36000) / (systemSize * 5.2 * 30 * 0.85 * tariff / 1000 * 12),
      roi10Year: ((systemSize * 5.2 * 30 * 0.85 * tariff / 1000 * 12 * 10 - (systemSize * 95000 + batterySize * 36000)) / (systemSize * 95000 + batterySize * 36000)) * 100
    };
    setResults(newResults);
    setShowResults(true);
    onSimulate(newResults);
  };

  const resetToBase = () => {
    setSystemSize(baseSystemSize);
    setBatterySize(baseBatterySize);
    setTariff(baseTariff);
    setInterestRate(12);
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>What-If Simulator</Text>
      <Text style={styles.subtitle}>Adjust parameters to see impact on your investment</Text>

      {/* System Size Slider */}
      <View style={styles.controlGroup}>
        <View style={styles.controlHeader}>
          <Text style={styles.controlLabel}>System Size (kWp)</Text>
          <Text style={styles.controlValue}>{systemSize.toFixed(1)} kW</Text>
        </View>
        <Slider
          value={systemSize}
          onValueChange={setSystemSize}
          minimumValue={1}
          maximumValue={20}
          step={0.5}
          minimumTrackTintColor="#FFC107"
          maximumTrackTintColor="#1f253f"
          thumbTintColor="#FFC107"
        />
        <View style={styles.rangeLabels}>
          <Text style={styles.rangeLabel}>1 kW</Text>
          <Text style={styles.rangeLabel}>20 kW</Text>
        </View>
      </View>

      {/* Battery Size Slider */}
      <View style={styles.controlGroup}>
        <View style={styles.controlHeader}>
          <Text style={styles.controlLabel}>Battery Capacity (kWh)</Text>
          <Text style={styles.controlValue}>{batterySize.toFixed(1)} kWh</Text>
        </View>
        <Slider
          value={batterySize}
          onValueChange={setBatterySize}
          minimumValue={0}
          maximumValue={30}
          step={1}
          minimumTrackTintColor="#FFC107"
          maximumTrackTintColor="#1f253f"
          thumbTintColor="#FFC107"
        />
        <View style={styles.rangeLabels}>
          <Text style={styles.rangeLabel}>0 kWh</Text>
          <Text style={styles.rangeLabel}>30 kWh</Text>
        </View>
      </View>

      {/* Tariff Slider */}
      <View style={styles.controlGroup}>
        <View style={styles.controlHeader}>
          <Text style={styles.controlLabel}>Electricity Tariff (KSh/kWh)</Text>
          <Text style={styles.controlValue}>KSh {tariff.toFixed(2)}</Text>
        </View>
        <Slider
          value={tariff}
          onValueChange={setTariff}
          minimumValue={15}
          maximumValue={40}
          step={0.5}
          minimumTrackTintColor="#FFC107"
          maximumTrackTintColor="#1f253f"
          thumbTintColor="#FFC107"
        />
        <View style={styles.rangeLabels}>
          <Text style={styles.rangeLabel}>KSh 15</Text>
          <Text style={styles.rangeLabel}>KSh 40</Text>
        </View>
      </View>

      {/* Interest Rate Slider */}
      <View style={styles.controlGroup}>
        <View style={styles.controlHeader}>
          <Text style={styles.controlLabel}>Interest Rate (%)</Text>
          <Text style={styles.controlValue}>{interestRate}%</Text>
        </View>
        <Slider
          value={interestRate}
          onValueChange={setInterestRate}
          minimumValue={5}
          maximumValue={25}
          step={0.5}
          minimumTrackTintColor="#FFC107"
          maximumTrackTintColor="#1f253f"
          thumbTintColor="#FFC107"
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <Button
          title="Run Simulation"
          onPress={runSimulation}
          variant="primary"
          style={styles.simulateButton}
        />
        <Button
          title="Reset"
          onPress={resetToBase}
          variant="secondary"
          style={styles.resetButton}
        />
      </View>

      {/* Results */}
      {showResults && results && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Simulation Results</Text>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Total Investment:</Text>
            <Text style={styles.resultValue}>KSh {results.totalCost.toLocaleString()}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Monthly Savings:</Text>
            <Text style={[styles.resultValue, styles.savings]}>KSh {results.monthlySaving.toLocaleString()}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Payback Period:</Text>
            <Text style={styles.resultValue}>{results.payback.toFixed(1)} years</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>10-Year ROI:</Text>
            <Text style={[styles.resultValue, styles.savings]}>{results.roi10Year.toFixed(0)}%</Text>
          </View>

          <View style={styles.comparisonNote}>
            <Text style={styles.comparisonText}>
              vs Base: {((results.monthlySaving - (baseSystemSize * 5.2 * 30 * 0.85 * baseTariff / 1000)) / (baseSystemSize * 5.2 * 30 * 0.85 * baseTariff / 1000) * 100).toFixed(0)}% change in savings
            </Text>
          </View>
        </View>
      )}
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
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20
  },
  controlGroup: {
    marginBottom: 20
  },
  controlHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  controlLabel: {
    fontSize: 14,
    color: '#fff'
  },
  controlValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFC107'
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4
  },
  rangeLabel: {
    fontSize: 10,
    color: '#666'
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10
  },
  simulateButton: {
    flex: 2
  },
  resetButton: {
    flex: 1
  },
  resultsContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1f253f'
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFC107',
    marginBottom: 12
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1f253f'
  },
  resultLabel: {
    fontSize: 13,
    color: '#888'
  },
  resultValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff'
  },
  savings: {
    color: '#28a745'
  },
  comparisonNote: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#1a1f35',
    borderRadius: 8
  },
  comparisonText: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center'
  }
});