import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Card } from '../../mobile/ReactNativeApp/components/Card';
import { Button } from '../../mobile/ReactNativeApp/components/Button';

interface FinancingOption {
  id: string;
  name: string;
  type: 'cash' | 'loan' | 'lease' | 'ppa';
  downPayment?: number;
  monthlyPayment: number;
  termYears: number;
  interestRate?: number;
  totalCost: number;
  pros: string[];
  cons: string[];
}

interface FinancingOptionsProps {
  systemCost: number;
  onSelect: (option: FinancingOption) => void;
}

export const FinancingOptions: React.FC<FinancingOptionsProps> = ({
  systemCost,
  onSelect
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const options: FinancingOption[] = [
    {
      id: 'cash',
      name: 'Cash Purchase',
      type: 'cash',
      monthlyPayment: 0,
      termYears: 0,
      totalCost: systemCost,
      pros: ['No interest', 'Own system outright', 'Maximum ROI'],
      cons: ['Large upfront payment', 'Ties up capital']
    },
    {
      id: 'loan',
      name: 'Green Loan',
      type: 'loan',
      downPayment: systemCost * 0.2,
      monthlyPayment: Math.round((systemCost * 0.8 * 0.12 / 12) / (1 - Math.pow(1 + 0.12/12, -120))),
      termYears: 10,
      interestRate: 12,
      totalCost: systemCost * 0.2 + Math.round((systemCost * 0.8 * 0.12 / 12) / (1 - Math.pow(1 + 0.12/12, -120))) * 120,
      pros: ['Low upfront cost', 'Build credit', 'Own system after loan'],
      cons: ['Interest adds to cost', 'Monthly payments required']
    },
    {
      id: 'lease',
      name: 'Solar Lease',
      type: 'lease',
      monthlyPayment: Math.round(systemCost * 0.015),
      termYears: 20,
      totalCost: Math.round(systemCost * 0.015 * 12 * 20),
      pros: ['Zero upfront', 'Maintenance included', 'Fixed monthly payment'],
      cons: ["Don't own system", "Long-term commitment", "Lower savings"]
    },
    {
      id: 'ppa',
      name: 'Power Purchase Agreement',
      type: 'ppa',
      monthlyPayment: Math.round(systemCost * 0.008),
      termYears: 20,
      totalCost: Math.round(systemCost * 0.008 * 12 * 20),
      pros: ['Pay only for power produced', 'No maintenance', 'Performance guarantee'],
      cons: ["Don't own system", 'Variable payments based on production', 'Long-term contract']
    }
  ];

  const calculateSavings = (option: FinancingOption) => {
    const monthlyBill = 12500;
    const solarSaving = 11250;
    
    if (option.type === 'cash') {
      return {
        monthlyNet: solarSaving,
        annualNet: solarSaving * 12,
        tenYearNet: solarSaving * 12 * 10 - option.totalCost
      };
    } else {
      const monthlyNet = solarSaving - option.monthlyPayment;
      return {
        monthlyNet: Math.max(0, monthlyNet),
        annualNet: Math.max(0, monthlyNet * 12),
        tenYearNet: Math.max(0, monthlyNet * 12 * 10 - (option.downPayment || 0))
      };
    }
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Financing Options</Text>
      <Text style={styles.subtitle}>
        Choose the best way to fund your solar investment
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options.map(option => {
          const savings = calculateSavings(option);
          const isSelected = selectedOption === option.id;
          
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                isSelected && styles.optionCardSelected
              ]}
              onPress={() => setSelectedOption(option.id)}
            >
              <Text style={styles.optionName}>{option.name}</Text>
              
              {option.downPayment && (
                <Text style={styles.downPayment}>
                  Down: KSh {option.downPayment.toLocaleString()}
                </Text>
              )}
              
              <Text style={styles.monthlyPayment}>
                KSh {option.monthlyPayment.toLocaleString()}/month
              </Text>
              
              <Text style={styles.term}>{option.termYears} years</Text>
              
              {option.interestRate && (
                <Text style={styles.interestRate}>{option.interestRate}% APR</Text>
              )}
              
              <Text style={styles.totalCost}>
                Total: KSh {option.totalCost.toLocaleString()}
              </Text>

              <View style={styles.savingsPreview}>
                <Text style={styles.savingsLabel}>Monthly Net Savings</Text>
                <Text style={[styles.savingsValue, savings.monthlyNet > 0 && styles.positive]}>
                  KSh {savings.monthlyNet.toLocaleString()}
                </Text>
              </View>

              <View style={styles.prosCons}>
                {option.pros.slice(0, 2).map((pro, i) => (
                  <Text key={i} style={styles.prosText}>✓ {pro}</Text>
                ))}
                {option.cons.slice(0, 1).map((con, i) => (
                  <Text key={i} style={styles.consText}>✗ {con}</Text>
                ))}
              </View>

              {isSelected && (
                <Button
                  title="Select This Option"
                  onPress={() => onSelect(option)}
                  variant="primary"
                  size="small"
                  style={styles.selectButton}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Comparison Summary */}
      <View style={styles.comparison}>
        <Text style={styles.comparisonTitle}>Quick Comparison</Text>
        <View style={styles.comparisonRow}>
          <Text style={styles.comparisonLabel}>Best for upfront savings:</Text>
          <Text style={styles.comparisonValue}>Cash Purchase</Text>
        </View>
        <View style={styles.comparisonRow}>
          <Text style={styles.comparisonLabel}>Best for low upfront:</Text>
          <Text style={styles.comparisonValue}>Solar Lease / PPA</Text>
        </View>
        <View style={styles.comparisonRow}>
          <Text style={styles.comparisonLabel}>Best long-term value:</Text>
          <Text style={styles.comparisonValue}>Green Loan</Text>
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
  optionCard: {
    width: 280,
    backgroundColor: '#1a1f35',
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  optionCardSelected: {
    borderColor: '#FFC107',
    backgroundColor: '#1f253f'
  },
  optionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFC107',
    marginBottom: 8
  },
  downPayment: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4
  },
  monthlyPayment: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4
  },
  term: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4
  },
  interestRate: {
    fontSize: 12,
    color: '#FFC107',
    marginBottom: 8
  },
  totalCost: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12
  },
  savingsPreview: {
    backgroundColor: '#0f1425',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12
  },
  savingsLabel: {
    fontSize: 10,
    color: '#888',
    marginBottom: 4
  },
  savingsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  },
  positive: {
    color: '#28a745'
  },
  prosCons: {
    marginBottom: 15
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
  selectButton: {
    marginTop: 8
  },
  comparison: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#1f253f'
  },
  comparisonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6
  },
  comparisonLabel: {
    fontSize: 12,
    color: '#888'
  },
  comparisonValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFC107'
  }
});