import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppSettings } from '@/hooks/useAppSettings';

interface BadgeProps {
  count: number;
  size?: number;
}

export default function Badge({ count, size = 18 }: BadgeProps) {
  const { colors } = useAppSettings();
  
  if (count <= 0) return null;

  return (
    <View style={[
      styles.badge, 
      { 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        backgroundColor: colors.error
      }
    ]}>
      <Text style={[
        styles.text, 
        { 
          fontSize: size * 0.6,
          color: colors.text.white
        }
      ]}>
        {count > 99 ? '99+' : count.toString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 18
  },
  text: {
    fontWeight: '600',
    fontSize: 10
  }
});