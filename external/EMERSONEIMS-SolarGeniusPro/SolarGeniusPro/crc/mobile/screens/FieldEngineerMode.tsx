import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal
} from 'react-native';
import { useCamera } from '../hooks/useCamera';
import { useLocation } from '../hooks/useLocation';
import { useOffline } from '../hooks/useOffline';
import { Card } from '../components/Card';

export const FieldEngineerMode = ({ navigation }: any) => {
  const { takePhoto, photos, clearPhotos } = useCamera();
  const { location, getLocation, startTracking, stopTracking } = useLocation();
  const { isOffline, queueOperation, getPendingOperations } = useOffline();
  const [activeSite, setActiveSite] = useState(null);
  const [notes, setNotes] = useState('');
  const [checklist, setChecklist] = useState({
    safetyGear: false,
    ppeWorn: false,
    permitsObtained: false,
    photosTaken: false,
    measurementsDone: false
  });

  const sites = [
    { id: '1', name: 'Nairobi CBD Commercial', address: 'Moi Avenue, Nairobi', status: 'pending' },
    { id: '2', name: 'Karen Residential', address: 'Karen Road, Nairobi', status: 'in_progress' },
    { id: '3', name: 'Industrial Area Factory', address: 'Enterprise Road, Nairobi', status: 'completed' }
  ];

  const toggleChecklist = (item: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const startSiteVisit = (site: any) => {
    setActiveSite(site);
    startTracking();
    getLocation();
  };

  const completeSiteVisit = async () => {
    const allChecked = Object.values(checklist).every(v => v === true);
    if (!allChecked) {
      Alert.alert('Incomplete', 'Please complete all checklist items before finishing');
      return;
    }

    const visitData = {
      siteId: activeSite?.id,
      timestamp: new Date(),
      checklist,
      notes,
      photos: photos.length,
      location
    };

    if (isOffline) {
      await queueOperation('site_visit', visitData);
      Alert.alert('Saved Offline', 'Site visit data will sync when online');
    } else {
      // Submit to server
      Alert.alert('Success', 'Site visit completed successfully');
    }

    setActiveSite(null);
    setNotes('');
    clearPhotos();
    setChecklist({
      safetyGear: false,
      ppeWorn: false,
      permitsObtained: false,
      photosTaken: false,
      measurementsDone: false
    });
    stopTracking();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔧 Field Engineer Mode</Text>
        <Text style={styles.headerSubtitle}>Offline-capable • GPS Tracking • Photo Capture</Text>
      </View>

      {/* Location Status */}
      <Card style={styles.locationCard}>
        <Text style={styles.cardTitle}>📍 Current Location</Text>
        {location ? (
          <>
            <Text style={styles.locationText}>Lat: {location.latitude?.toFixed(6)}</Text>
            <Text style={styles.locationText}>Lng: {location.longitude?.toFixed(6)}</Text>
            <Text style={styles.locationAccuracy}>Accuracy: ±{location.accuracy?.toFixed(0)}m</Text>
          </>
        ) : (
          <Text style={styles.locationText}>Getting location...</Text>
        )}
      </Card>

      {/* Active Site Section */}
      {activeSite ? (
        <Card style={styles.activeSiteCard}>
          <Text style={styles.cardTitle}>📋 Active Site: {activeSite.name}</Text>
          <Text style={styles.siteAddress}>{activeSite.address}</Text>

          <Text style={styles.checklistTitle}>Site Checklist</Text>
          {Object.entries(checklist).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={styles.checklistItem}
              onPress={() => toggleChecklist(key as keyof typeof checklist)}
            >
              <View style={[styles.checkbox, value && styles.checked]} />
              <Text style={styles.checklistText}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.notesLabel}>Site Notes</Text>
          <TextInput
            style={styles.notesInput}
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            placeholder="Enter observations, measurements, issues..."
            placeholderTextColor="#666"
          />

          <View style={styles.photoSection}>
            <Text style={styles.photoLabel}>Photos Taken: {photos.length}</Text>
            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
              <Text style={styles.photoButtonText}>📸 Take Photo</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.completeButton} onPress={completeSiteVisit}>
            <Text style={styles.completeButtonText}>Complete Site Visit</Text>
          </TouchableOpacity>
        </Card>
      ) : (
        // Sites List
        <View style={styles.sitesSection}>
          <Text style={styles.sectionTitle}>Assigned Sites</Text>
          {sites.map(site => (
            <Card key={site.id} style={styles.siteCard}>
              <Text style={styles.siteName}>{site.name}</Text>
              <Text style={styles.siteAddress}>{site.address}</Text>
              <View style={styles.siteStatus}>
                <View style={[styles.statusBadge, getStatusStyle(site.status)]} />
                <Text style={styles.statusText}>{site.status.replace('_', ' ').toUpperCase()}</Text>
              </View>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => startSiteVisit(site)}
              >
                <Text style={styles.startButtonText}>Start Visit →</Text>
              </TouchableOpacity>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'pending': return { backgroundColor: '#FFC107' };
    case 'in_progress': return { backgroundColor: '#17a2b8' };
    case 'completed': return { backgroundColor: '#28a745' };
    default: return { backgroundColor: '#888' };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1e'
  },
  header: {
    padding: 20,
    backgroundColor: '#0f1425',
    borderBottomWidth: 1,
    borderBottomColor: '#1f253f'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC107'
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 5
  },
  locationCard: {
    margin: 15,
    padding: 15
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10
  },
  locationText: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 5
  },
  locationAccuracy: {
    fontSize: 12,
    color: '#888',
    marginTop: 5
  },
  activeSiteCard: {
    margin: 15,
    padding: 15
  },
  siteAddress: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    marginBottom: 15
  },
  checklistTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFC107',
    marginBottom: 10
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#FFC107',
    borderRadius: 4,
    marginRight: 10
  },
  checked: {
    backgroundColor: '#FFC107'
  },
  checklistText: {
    fontSize: 14,
    color: '#fff'
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    marginTop: 15,
    marginBottom: 8
  },
  notesInput: {
    backgroundColor: '#1a1f35',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    minHeight: 100,
    textAlignVertical: 'top'
  },
  photoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15
  },
  photoLabel: {
    fontSize: 14,
    color: '#fff'
  },
  photoButton: {
    backgroundColor: '#1f253f',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8
  },
  photoButtonText: {
    color: '#fff'
  },
  completeButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  completeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  sitesSection: {
    padding: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15
  },
  siteCard: {
    padding: 15,
    marginBottom: 10
  },
  siteName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  },
  siteStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  statusBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8
  },
  statusText: {
    fontSize: 12,
    color: '#888'
  },
  startButton: {
    marginTop: 12,
    alignSelf: 'flex-start'
  },
  startButtonText: {
    color: '#FFC107',
    fontSize: 14,
    fontWeight: '500'
  }
});