import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Platform
} from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevation?: 'none' | 'small' | 'medium' | 'large';
  variant?: 'default' | 'outline' | 'filled';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  elevation = 'small',
  variant = 'default'
}) => {
  const getElevationStyle = () => {
    switch (elevation) {
      case 'none':
        return Platform.select({
          ios: { shadowOpacity: 0 },
          android: { elevation: 0 }
        });
      case 'small':
        return Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4
          },
          android: { elevation: 2 }
        });
      case 'medium':
        return Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8
          },
          android: { elevation: 4 }
        });
      case 'large':
        return Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.2,
            shadowRadius: 12
          },
          android: { elevation: 8 }
        });
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: '#1f253f'
        };
      case 'filled':
        return { backgroundColor: '#1a1f35' };
      default:
        return { backgroundColor: '#0f1425' };
    }
  };

  const CardContent = (
    <View style={[styles.card, getVariantStyle(), getElevationStyle(), style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden'
  }
});