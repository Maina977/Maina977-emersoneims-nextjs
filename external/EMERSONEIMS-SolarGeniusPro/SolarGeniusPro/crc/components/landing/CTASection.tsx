import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Button } from '../../mobile/ReactNativeApp/components/Button';

interface CTASectionProps {
  onGetStarted: () => void;
  onContactSales: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({
  onGetStarted,
  onContactSales
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Ready to Transform Your Solar Business?</Text>
        <Text style={styles.subtitle}>
          Join thousands of engineers and contractors using SolarGenius Pro
        </Text>
        
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>1,200+</Text>
            <Text style={styles.statLabel}>Fault Codes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>Components</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>40+</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <Button
            title="Get Started Free →"
            onPress={onGetStarted}
            variant="primary"
            size="large"
            style={styles.getStartedButton}
          />
          <Button
            title="Contact Sales"
            onPress={onContactSales}
            variant="secondary"
            size="large"
            style={styles.contactButton}
          />
        </View>

        <Text style={styles.note}>
          No credit card required • Free 14-day trial • Cancel anytime
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'linear-gradient(135deg, #0f1425, #0a0f1e)',
    paddingVertical: 60,
    paddingHorizontal: 20
  },
  content: {
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    gap: 20
  },
  stat: {
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC107'
  },
  statLabel: {
    fontSize: 12,
    color: '#888'
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#1f253f'
  },
  buttons: {
    width: '100%',
    maxWidth: 400,
    gap: 12,
    marginBottom: 20
  },
  getStartedButton: {
    width: '100%'
  },
  contactButton: {
    width: '100%'
  },
  note: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  }
});