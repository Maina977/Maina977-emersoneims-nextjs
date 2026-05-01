import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { Card } from '../../mobile/ReactNativeApp/components/Card';

interface GuideStep {
  id: string;
  title: string;
  description: string;
  image?: string;
  tips: string[];
  warnings?: string[];
  duration: number;
}

export const InstallationGuide = ({ systemType = 'solar' }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const steps: GuideStep[] = [
    {
      id: '1',
      title: 'Safety First',
      description: 'Ensure all safety protocols are followed before starting installation.',
      tips: ['Wear PPE at all times', 'Lock out/tag out electrical panels', 'Use insulated tools'],
      warnings: ['Risk of electric shock', 'Working at heights hazard'],
      duration: 15
    },
    {
      id: '2',
      title: 'Site Preparation',
      description: 'Prepare the installation site and gather all necessary tools and materials.',
      tips: ['Clear work area', 'Check roof condition', 'Verify mounting points'],
      warnings: ['Check for hidden utilities', 'Be aware of weather conditions'],
      duration: 30
    },
    {
      id: '3',
      title: 'Mounting Structure Installation',
      description: 'Install roof mounting rails and hardware.',
      tips: ['Use proper flashing', 'Maintain correct spacing', 'Level all rails'],
      duration: 60
    },
    {
      id: '4',
      title: 'Panel Installation',
      description: 'Mount solar panels onto the prepared structure.',
      tips: ['Handle panels carefully', 'Use proper clamps', 'Maintain gap for expansion'],
      warnings: ['Do not walk on panels', 'Avoid dropping tools on glass'],
      duration: 90
    },
    {
      id: '5',
      title: 'Inverter Installation',
      description: 'Install and connect the inverter.',
      tips: ['Mount in shaded area', 'Ensure proper ventilation', 'Follow manufacturer specs'],
      warnings: ['DC voltage hazard', 'Heavy equipment - use team lift'],
      duration: 45
    },
    {
      id: '6',
      title: 'Electrical Wiring',
      description: 'Complete all DC and AC wiring connections.',
      tips: ['Use proper cable glands', 'Label all wires', 'Check polarity'],
      warnings: ['Double-check connections before energizing', 'Use torque wrench'],
      duration: 60
    },
    {
      id: '7',
      title: 'System Commissioning',
      description: 'Test and commission the complete system.',
      tips: ['Check string voltages', 'Verify monitoring connection', 'Test grid connection'],
      warnings: ['Energize in correct sequence', 'Have fire extinguisher ready'],
      duration: 45
    }
  ];

  const toggleStepComplete = (stepId: string) => {
    if (completedSteps.includes(stepId)) {
      setCompletedSteps(completedSteps.filter(id => id !== stepId));
    } else {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const isStepComplete = (stepId: string) => completedSteps.includes(stepId);

  const totalDuration = steps.reduce((sum, s) => sum + s.duration, 0);
  const completedCount = completedSteps.length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <ScrollView style={styles.container}>
      {/* Progress Header */}
      <Card style={styles.progressCard}>
        <Text style={styles.progressTitle}>Installation Progress</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {completedCount} of {steps.length} steps completed
        </Text>
        <Text style={styles.durationText}>
          Estimated total time: {totalDuration} minutes
        </Text>
      </Card>

      {/* Steps List */}
      {steps.map((step, index) => (
        <Card
          key={step.id}
          style={[
            styles.stepCard,
            currentStep === index && styles.activeStep,
            isStepComplete(step.id) && styles.completedStep
          ]}
        >
          <TouchableOpacity
            onPress={() => setCurrentStep(index)}
            style={styles.stepHeader}
          >
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDuration}>⏱️ {step.duration} min</Text>
            </View>
            <Text style={styles.stepIcon}>
              {currentStep === index ? '▼' : '▶'}
            </Text>
          </TouchableOpacity>

          {currentStep === index && (
            <View style={styles.stepContent}>
              <Text style={styles.stepDescription}>{step.description}</Text>
              
              {step.tips.length > 0 && (
                <View style={styles.tipsSection}>
                  <Text style={styles.sectionTitle}>💡 Tips</Text>
                  {step.tips.map((tip, i) => (
                    <Text key={i} style={styles.tipText}>• {tip}</Text>
                  ))}
                </View>
              )}

              {step.warnings && step.warnings.length > 0 && (
                <View style={styles.warningsSection}>
                  <Text style={styles.sectionTitle}>⚠️ Warnings</Text>
                  {step.warnings.map((warning, i) => (
                    <Text key={i} style={styles.warningText}>• {warning}</Text>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.completeButton,
                  isStepComplete(step.id) && styles.completedButton
                ]}
                onPress={() => toggleStepComplete(step.id)}
              >
                <Text style={styles.completeButtonText}>
                  {isStepComplete(step.id) ? '✓ Mark Incomplete' : '✓ Mark Complete'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Card>
      ))}

      {/* Completion Card */}
      {completedCount === steps.length && (
        <Card style={styles.completionCard}>
          <Text style={styles.completionIcon}>🎉</Text>
          <Text style={styles.completionTitle}>Installation Complete!</Text>
          <Text style={styles.completionText}>
            Congratulations! The system has been successfully installed.
            Next step: Schedule final inspection and grid connection.
          </Text>
          <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Proceed to Commissioning →</Text>
          </TouchableOpacity>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1e'
  },
  progressCard: {
    margin: 15,
    padding: 20,
    alignItems: 'center'
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#1f253f',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFC107',
    borderRadius: 4
  },
  progressText: {
    fontSize: 14,
    color: '#FFC107',
    marginBottom: 5
  },
  durationText: {
    fontSize: 12,
    color: '#888'
  },
  stepCard: {
    marginHorizontal: 15,
    marginBottom: 10,
    overflow: 'hidden'
  },
  activeStep: {
    borderWidth: 1,
    borderColor: '#FFC107'
  },
  completedStep: {
    backgroundColor: '#1a1f35'
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 12
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1f253f',
    justifyContent: 'center',
    alignItems: 'center'
  },
  stepNumberText: {
    color: '#FFC107',
    fontWeight: 'bold',
    fontSize: 14
  },
  stepInfo: {
    flex: 1
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4
  },
  stepDuration: {
    fontSize: 11,
    color: '#888'
  },
  stepIcon: {
    fontSize: 12,
    color: '#888'
  },
  stepContent: {
    padding: 15,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#1f253f'
  },
  stepDescription: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 15,
    lineHeight: 20
  },
  tipsSection: {
    marginBottom: 15
  },
  warningsSection: {
    marginBottom: 15,
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    padding: 12,
    borderRadius: 8
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFC107',
    marginBottom: 8
  },
  tipText: {
    fontSize: 13,
    color: '#ccc',
    marginBottom: 4
  },
  warningText: {
    fontSize: 13,
    color: '#dc3545',
    marginBottom: 4
  },
  completeButton: {
    backgroundColor: '#FFC107',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5
  },
  completedButton: {
    backgroundColor: '#28a745'
  },
  completeButtonText: {
    color: '#0a0e1c',
    fontWeight: '600',
    fontSize: 14
  },
  completionCard: {
    margin: 15,
    padding: 25,
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#1a1f35'
  },
  completionIcon: {
    fontSize: 48,
    marginBottom: 15
  },
  completionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 10
  },
  completionText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20
  },
  nextButton: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8
  },
  nextButtonText: {
    color: '#0a0e1c',
    fontWeight: '600'
  }
});