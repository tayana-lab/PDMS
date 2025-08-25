import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, BorderRadius } from '@/constants/theme';

interface BadgeProps {
  count: number;
  size?: number;
}

export default function Badge({ count, size = 18 }: BadgeProps) {
  if (count <= 0) return null;

  return (
    <View style={[styles.badge, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.text, { fontSize: size * 0.6 }]}>
        {count > 99 ? '99+' : count.toString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 18
  },
  text: {
    color: Colors.text.white,
    fontWeight: '600',
    fontSize: 10
  }
});