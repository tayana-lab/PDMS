import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Typography, Spacing } from '@/constants/theme';
import { useAppSettings } from '@/hooks/useAppSettings';

interface LoaderProps {
  text?: string;
  size?: 'small' | 'large';
}

export default function Loader({ text = 'Loading...', size = 'large' }: LoaderProps) {
  const { colors } = useAppSettings();
  
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={colors.primary} />
      {text && (
        <Text style={[styles.text, { color: colors.text.secondary }]}>
          {text}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl
  },
  text: {
    ...Typography.body,
    marginTop: Spacing.md,
    textAlign: 'center'
  }
});