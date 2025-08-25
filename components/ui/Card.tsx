import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAppSettings } from '@/hooks/useAppSettings';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof Spacing;
  shadow?: boolean;
}

export default function Card({ children, style, padding = 'md', shadow = true }: CardProps) {
  const { colors } = useAppSettings();
  
  return (
    <View style={[
      styles.card,
      {
        padding: Spacing[padding],
        backgroundColor: colors.surface,
        borderColor: colors.border
      },
      shadow && Shadows.medium,
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1
  }
});