import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';

interface LoaderProps {
  text?: string;
  size?: 'small' | 'large';
}

export default function Loader({ text = 'Loading...', size = 'large' }: LoaderProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={Colors.primary} />
      {text && <Text style={styles.text}>{text}</Text>}
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
    color: Colors.text.secondary,
    marginTop: Spacing.md,
    textAlign: 'center'
  }
});