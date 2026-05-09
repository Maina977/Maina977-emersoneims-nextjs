import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image
} from 'react-native';
import { Button } from '../../mobile/ReactNativeApp/components/Button';
import { Card } from '../../mobile/ReactNativeApp/components/Card';

interface HeroSectionProps {
  onStartAnalysis: () => void;
  onUpload: () => void;
  onLocationSelect: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartAnalysis,
  onUpload,
  onLocationSelect
}) => {
  const [activeTab, setActiveTab] = useState<'location' | 'upload' | 'project'>('location');
  const [address, setAddress] = useState('');

  return (
    <ScrollView style={styles.container}>
      {/* Hero Content */}
      <View style={styles.heroContent}>
        <Text style={styles.heroTitle}>
          Analyze <Text style={styles.gradient}>Before</Text> You Build
        </Text>
        <Text style={styles.heroSubtitle}>
          AI-powered infrastructure intelligence for solar, borehole, and generator systems
        </Text>
      </View>

      {/* Input Tabs */}
      <Card style={styles.inputCard}>
        <View style={styles.tabButtons}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'location' && styles.tabActive]}
            onPress={() => setActiveTab('location')}
          >
            <Text style={[styles.tabText, activeTab === 'location' && styles.tabTextActive]}>
              📍 Location
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'upload' && styles.tabActive]}
            onPress={() => setActiveTab('upload')}
          >
            <Text style={[styles.tabText, activeTab === 'upload' && styles.tabTextActive]}>
              📸 Upload
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'project' && styles.tabActive]}
            onPress={() => setActiveTab('project')}
          >
            <Text style={[styles.tabText, activeTab === 'project' && styles.tabTextActive]}>
              ⚙️ Project Type
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContent}>
          {activeTab === 'location' && (
            <View>
              <TextInput
                style={styles.locationInput}
                placeholder="Enter address or drop a pin on map"
                placeholderTextColor="#666"
                value={address}
                onChangeText={setAddress}
              />
              <Button
                title="📍 Use My Location"
                onPress={onLocationSelect}
                variant="secondary"
                style={styles.locationButton}
              />
              <View style={styles.mapPreview}>
                <Text style={styles.mapPlaceholder}>🗺️ Interactive Map - Click to select roof</Text>
              </View>
            </View>
          )}

          {activeTab === 'upload' && (
            <View>
              <TouchableOpacity style={styles.uploadZone} onPress={onUpload}>
                <Text style={styles.uploadIcon}>📁</Text>
                <Text style={styles.uploadText}>Drop BOQ, images, or video here</Text>
                <Text style={styles.uploadSubtext}>Supports: PDF, DOCX, XLSX, JPG, PNG, MP4</Text>
                <Button title="Select Files" onPress={onUpload} variant="primary" size="small" />
              </TouchableOpacity>
              <View style={styles.uploadExamples}>
                <Text style={styles.exampleLabel}>Example:</Text>
                <TouchableOpacity style={styles.exampleButton}>
                  <Text style={styles.exampleText}>📄 Upload BOQ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exampleButton}>
                  <Text style={styles.exampleText}>📸 Upload Roof Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exampleButton}>
                  <Text style={styles.exampleText}>🎥 Upload Walkaround Video</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {activeTab === 'project' && (
            <View style={styles.projectTypes}>
              <TouchableOpacity style={styles.projectTypeCard}>
                <Text style={styles.projectTypeIcon}>☀️</Text>
                <Text style={styles.projectTypeText}>Solar Only</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.projectTypeCard}>
                <Text style={styles.projectTypeIcon}>💧</Text>
                <Text style={styles.projectTypeText}>Solar + Borehole</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.projectTypeCard}>
                <Text style={styles.projectTypeIcon}>⚡</Text>
                <Text style={styles.projectTypeText}>Solar + Generator</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.projectTypeCard}>
                <Text style={styles.projectTypeIcon}>🏢</Text>
                <Text style={styles.projectTypeText}>Complete Infrastructure</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Card>

      {/* CTA Buttons */}
      <View style={styles.ctaButtons}>
        <Button
          title="Start Analysis →"
          onPress={onStartAnalysis}
          variant="primary"
          size="large"
          style={styles.ctaButton}
        />
      </View>

      {/* Trust Indicators */}
      <View style={styles.trustSection}>
        <Text style={styles.trustTitle}>Trusted by Industry Leaders</Text>
        <View style={styles.trustLogos}>
          <Text style={styles.trustLogo}>🏢 EmersonEIMS</Text>
          <Text style={styles.trustLogo}>⚡ Kenya Power</Text>
          <Text style={styles.trustLogo}>🌍 UNEP</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1.6M+</Text>
            <Text style={styles.statLabel}>AI Training Runs</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>99.7%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15s</Text>
            <Text style={styles.statLabel}>3D Generation</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1e'
  },
  heroContent: {
    padding: 30,
    alignItems: 'center'
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12
  },
  gradient: {
    color: '#FFC107'
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24
  },
  inputCard: {
    margin: 15,
    padding: 0,
    overflow: 'hidden'
  },
  tabButtons: {
    flexDirection: 'row',
    backgroundColor: '#1a1f35'
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center'
  },
  tabActive: {
    backgroundColor: '#0f1425',
    borderBottomWidth: 2,
    borderBottomColor: '#FFC107'
  },
  tabText: {
    fontSize: 12,
    color: '#888'
  },
  tabTextActive: {
    color: '#FFC107',
    fontWeight: '600'
  },
  tabContent: {
    padding: 20
  },
  locationInput: {
    backgroundColor: '#1a1f35',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 12
  },
  locationButton: {
    marginBottom: 12
  },
  mapPreview: {
    height: 200,
    backgroundColor: '#1a1f35',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mapPlaceholder: {
    color: '#888',
    fontSize: 14
  },
  uploadZone: {
    borderWidth: 2,
    borderColor: '#1f253f',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    marginBottom: 15
  },
  uploadIcon: {
    fontSize: 40,
    marginBottom: 10
  },
  uploadText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5
  },
  uploadSubtext: {
    color: '#888',
    fontSize: 10,
    marginBottom: 15
  },
  uploadExamples: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10
  },
  exampleLabel: {
    color: '#888',
    fontSize: 12,
    marginRight: 8
  },
  exampleButton: {
    backgroundColor: '#1f253f',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  exampleText: {
    color: '#FFC107',
    fontSize: 11
  },
  projectTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  projectTypeCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1a1f35',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center'
  },
  projectTypeIcon: {
    fontSize: 28,
    marginBottom: 8
  },
  projectTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500'
  },
  ctaButtons: {
    paddingHorizontal: 15,
    marginBottom: 30
  },
  ctaButton: {
    width: '100%'
  },
  trustSection: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1f253f'
  },
  trustTitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15
  },
  trustLogos: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20
  },
  trustLogo: {
    color: '#666',
    fontSize: 12
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
  },
  statItem: {
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFC107'
  },
  statLabel: {
    fontSize: 10,
    color: '#888'
  }
});