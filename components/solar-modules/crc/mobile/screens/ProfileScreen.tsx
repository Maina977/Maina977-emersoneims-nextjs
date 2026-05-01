import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useOffline } from '../hooks/useOffline';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export const ProfileScreen = ({ navigation }: any) => {
  const { user, logout, updateProfile } = useAuth();
  const { isOffline, syncNow, pendingOperations } = useOffline();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleSave = async () => {
    const success = await updateProfile({ name, email });
    if (success) {
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } else {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace('Auth');
          }
        }
      ]
    );
  };

  const handleSync = async () => {
    const result = await syncNow();
    if (result) {
      Alert.alert('Success', 'Data synchronized successfully');
    } else {
      Alert.alert('Error', 'Sync failed. Please check your connection.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userRole}>{user?.role?.toUpperCase()}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      {/* Profile Info */}
      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {!isEditing && (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {isEditing ? (
          <>
            <Input
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.buttonRow}>
              <Button
                title="Cancel"
                variant="secondary"
                onPress={() => {
                  setIsEditing(false);
                  setName(user?.name || '');
                  setEmail(user?.email || '');
                }}
                style={styles.cancelButton}
              />
              <Button
                title="Save"
                variant="primary"
                onPress={handleSave}
                style={styles.saveButton}
              />
            </View>
          </>
        ) : (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{user?.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Role</Text>
              <Text style={styles.infoValue}>{user?.role?.toUpperCase()}</Text>
            </View>
          </>
        )}
      </Card>

      {/* Preferences */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.preferenceRow}>
          <Text style={styles.preferenceLabel}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#1f253f', true: '#FFC107' }}
            thumbColor={darkMode ? '#FFC107' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.preferenceRow}>
          <Text style={styles.preferenceLabel}>Push Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#1f253f', true: '#FFC107' }}
            thumbColor={notifications ? '#FFC107' : '#f4f3f4'}
          />
        </View>
      </Card>

      {/* Sync Status */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Sync Status</Text>
        <View style={styles.syncRow}>
          <Text style={styles.syncLabel}>Pending Operations:</Text>
          <Text style={styles.syncValue}>{pendingOperations}</Text>
        </View>
        <View style={styles.syncRow}>
          <Text style={styles.syncLabel}>Offline Mode:</Text>
          <Text style={[styles.syncValue, isOffline && styles.offlineText]}>
            {isOffline ? 'Active' : 'Inactive'}
          </Text>
        </View>
        <Button
          title="Sync Now"
          variant="secondary"
          onPress={handleSync}
          disabled={pendingOperations === 0}
          style={styles.syncButton}
        />
      </Card>

      {/* App Info */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>3.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Build</Text>
          <Text style={styles.infoValue}>2024.04.02</Text>
        </View>
        <TouchableOpacity style={styles.termsLink}>
          <Text style={styles.termsText}>Terms of Service</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.termsLink}>
          <Text style={styles.termsText}>Privacy Policy</Text>
        </TouchableOpacity>
      </Card>

      {/* Logout Button */}
      <Button
        title="Logout"
        variant="danger"
        onPress={handleLogout}
        style={styles.logoutButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1e'
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#0f1425',
    borderBottomWidth: 1,
    borderBottomColor: '#1f253f'
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0a0e1c'
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5
  },
  userRole: {
    fontSize: 14,
    color: '#FFC107',
    marginBottom: 5
  },
  userEmail: {
    fontSize: 14,
    color: '#888'
  },
  section: {
    margin: 15,
    padding: 15
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15
  },
  editText: {
    color: '#FFC107',
    fontSize: 14
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1f253f'
  },
  infoLabel: {
    fontSize: 14,
    color: '#888'
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500'
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15
  },
  cancelButton: {
    flex: 1
  },
  saveButton: {
    flex: 1
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1f253f'
  },
  preferenceLabel: {
    fontSize: 16,
    color: '#fff'
  },
  syncRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  syncLabel: {
    fontSize: 14,
    color: '#888'
  },
  syncValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500'
  },
  offlineText: {
    color: '#FFC107'
  },
  syncButton: {
    marginTop: 15
  },
  termsLink: {
    paddingVertical: 10
  },
  termsText: {
    color: '#FFC107',
    fontSize: 14
  },
  logoutButton: {
    margin: 15,
    marginBottom: 30
  }
});