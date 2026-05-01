import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated
} from 'react-native';
import { Card } from '../../mobile/ReactNativeApp/components/Card';

interface VoiceCommandBarProps {
  onCommand: (command: string) => void;
  isListening?: boolean;
}

export const VoiceCommandBar: React.FC<VoiceCommandBarProps> = ({
  onCommand,
  isListening: externalListening
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (isListening) {
      startPulseAnimation();
    } else {
      stopPulseAnimation();
    }
  }, [isListening]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        })
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const startListening = () => {
    setIsListening(true);
    setShowModal(true);
    // In production, integrate with speech recognition
    setTimeout(() => {
      setTranscript("Create a 6kW solar design for Nairobi");
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
    if (transcript) {
      onCommand(transcript);
    }
    setTimeout(() => {
      setShowModal(false);
      setTranscript('');
    }, 500);
  };

  const commands = [
    { phrase: "New design", action: "create_design", icon: "🎨" },
    { phrase: "Show savings", action: "show_savings", icon: "💰" },
    { phrase: "Check weather", action: "check_weather", icon: "🌤️" },
    { phrase: "Find error", action: "find_error", icon: "🔧" },
    { phrase: "Generate report", action: "generate_report", icon: "📄" }
  ];

  return (
    <>
      <Card style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.label}>Voice Assistant</Text>
          <Text style={styles.description}>
            "Hey Solar, create a new design"
          </Text>
          
          <View style={styles.commandGrid}>
            {commands.map((cmd, index) => (
              <TouchableOpacity
                key={index}
                style={styles.commandChip}
                onPress={() => onCommand(cmd.phrase)}
              >
                <Text style={styles.commandIcon}>{cmd.icon}</Text>
                <Text style={styles.commandText}>{cmd.phrase}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.micButton, isListening && styles.micButtonActive]}
            onPress={isListening ? stopListening : startListening}
          >
            <Text style={styles.micIcon}>🎤</Text>
            <Text style={styles.micText}>
              {isListening ? 'Listening...' : 'Click to Speak'}
            </Text>
          </TouchableOpacity>
        </View>
      </Card>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.micCircle}>
                <Text style={styles.micLargeIcon}>🎤</Text>
              </View>
            </Animated.View>
            <Text style={styles.listeningText}>Listening...</Text>
            {transcript ? (
              <Text style={styles.transcriptText}>"{transcript}"</Text>
            ) : (
              <Text style={styles.hintText}>Say a command like "new design"</Text>
            )}
            <TouchableOpacity style={styles.cancelButton} onPress={stopListening}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 15,
    padding: 15
  },
  content: {
    alignItems: 'center'
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4
  },
  description: {
    fontSize: 12,
    color: '#FFC107',
    marginBottom: 15
  },
  commandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20
  },
  commandChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f253f',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6
  },
  commandIcon: {
    fontSize: 12
  },
  commandText: {
    color: '#fff',
    fontSize: 12
  },
  micButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f253f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    gap: 10
  },
  micButtonActive: {
    backgroundColor: '#dc3545'
  },
  micIcon: {
    fontSize: 18
  },
  micText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    alignItems: 'center'
  },
  pulseRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  micCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center'
  },
  micLargeIcon: {
    fontSize: 40
  },
  listeningText: {
    color: '#FFC107',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10
  },
  transcriptText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20
  },
  hintText: {
    color: '#888',
    fontSize: 12,
    marginBottom: 20
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#1f253f',
    borderRadius: 20
  },
  cancelText: {
    color: '#fff',
    fontSize: 14
  }
});