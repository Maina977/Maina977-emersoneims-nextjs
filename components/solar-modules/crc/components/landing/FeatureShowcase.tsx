import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Card } from '../../mobile/ReactNativeApp/components/Card';

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

export const FeatureShowcase = () => {
  const features: Feature[] = [
    {
      id: '1',
      icon: '🎨',
      title: '3D Design Studio',
      description: 'Interactive 3D roof modeling with real-time shading analysis',
      color: '#FFC107'
    },
    {
      id: '2',
      icon: '🤖',
      title: 'AI Quoting',
      description: 'Instant quotes from BOQ, images, or video uploads',
      color: '#17a2b8'
    },
    {
      id: '3',
      icon: '🎓',
      title: 'Solar School',
      description: 'University-level curriculum with certificates',
      color: '#28a745'
    },
    {
      id: '4',
      icon: '🔧',
      title: 'Repair Database',
      description: '1,200+ fault codes with solutions',
      color: '#dc3545'
    },
    {
      id: '5',
      icon: '📊',
      title: 'Bankable Reports',
      description: 'P50/P75/P90 financial analysis',
      color: '#FFC107'
    },
    {
      id: '6',
      icon: '🚗',
      title: 'Carport Design',
      description: 'Native support for parking lot solar',
      color: '#17a2b8'
    },
    {
      id: '7',
      icon: '🏦',
      title: 'Multi-Tenancy',
      description: 'SaaS-ready with organization isolation',
      color: '#28a745'
    },
    {
      id: '8',
      icon: '📡',
      title: 'Offline Mode',
      description: 'Work anywhere with offline sync',
      color: '#FFC107'
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Powerful Features</Text>
        <Text style={styles.subtitle}>
          Everything you need to design, quote, and manage solar systems
        </Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {features.map(feature => (
          <Card key={feature.id} style={[styles.featureCard, { borderTopColor: feature.color }]}>
            <Text style={styles.featureIcon}>{feature.icon}</Text>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
            <TouchableOpacity style={styles.learnMore}>
              <Text style={[styles.learnMoreText, { color: feature.color }]}>Learn More →</Text>
            </TouchableOpacity>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0a0f1e',
    paddingVertical: 40
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20
  },
  scrollContent: {
    paddingHorizontal: 15,
    gap: 15
  },
  featureCard: {
    width: 280,
    padding: 20,
    borderTopWidth: 4,
    marginRight: 15
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 15
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8
  },
  featureDescription: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
    marginBottom: 15
  },
  learnMore: {
    alignSelf: 'flex-start'
  },
  learnMoreText: {
    fontSize: 12,
    fontWeight: '600'
  }
});