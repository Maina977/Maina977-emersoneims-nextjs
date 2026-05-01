import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Modal } from 'react-native';

interface LoadingSpinnerProps {
  visible?: boolean;
  fullScreen?: boolean;
  message?: string;
  size?: 'small' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  visible = true,
  fullScreen = false,
  message = 'Loading...',
  size = 'large'
}) => {
  const SpinnerContent = (
    <View style={styles.container}>
      <ActivityIndicator size={size} color="#FFC107" />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );

  if (fullScreen) {
    return (
      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#FFC107" />
            <Text style={styles.modalMessage}>{message}</Text>
          </View>
        </View>
      </Modal>
    );
  }

  if (!visible) return null;

  return SpinnerContent;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: '#888',
    textAlign: 'center'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#0f1425',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    minWidth: 150
  },
  modalMessage: {
    marginTop: 16,
    fontSize: 14,
    color: '#fff'
  }
});