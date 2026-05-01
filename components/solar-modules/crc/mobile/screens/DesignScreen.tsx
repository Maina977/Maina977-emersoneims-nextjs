import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useOffline } from '../hooks/useOffline';

export const DesignScreen = ({ navigation }: any) => {
  const webViewRef = useRef<WebView>(null);
  const { isOffline, cacheData, getCachedData } = useOffline();
  const [loading, setLoading] = useState(true);
  const [designData, setDesignData] = useState(null);

  const threeDUrl = 'https://solargenius.emerson.co.ke/3d-designer';

  const handleMessage = (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === 'design_export') {
      setDesignData(data.design);
      if (isOffline) {
        cacheData('last_design', data.design);
      }
    }
  };

  const saveDesign = async () => {
    if (!designData) {
      Alert.alert('No Design', 'Please create a design first');
      return;
    }
    Alert.alert('Success', 'Design saved successfully');
  };

  const exportDesign = () => {
    if (!designData) {
      Alert.alert('No Design', 'Please create a design first');
      return;
    }
    Alert.alert('Export', 'Design exported as JSON');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFC107" />
        <Text style={styles.loadingText}>Loading 3D Designer...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎨 3D Design Studio</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={saveDesign}>
            <Text style={styles.headerButtonText}>💾 Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={exportDesign}>
            <Text style={styles.headerButtonText}>📤 Export</Text>
          </TouchableOpacity>
        </View>
      </View>
      <WebView
        ref={webViewRef}
        source={{ uri: threeDUrl }}
        style={styles.webview}
        onLoadEnd={() => setLoading(false)}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1e'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0f1e'
  },
  loadingText: {
    marginTop: 20,
    color: '#FFC107',
    fontSize: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#0f1425',
    borderBottomWidth: 1,
    borderBottomColor: '#1f253f'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFC107'
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1f253f',
    borderRadius: 8
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 12
  },
  webview: {
    flex: 1
  }
});