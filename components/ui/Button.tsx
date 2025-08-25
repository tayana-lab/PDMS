import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'default';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle
}: ButtonProps) {
  const actualVariant = variant === 'default' ? 'primary' : variant;
  
  const buttonStyle = [
    styles.base,
    styles[actualVariant],
    styles[size],
    disabled && styles.disabled,
    style
  ];

  const textStyles = [
    styles.text,
    styles[`${actualVariant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={actualVariant === 'primary' ? Colors.text.white : Colors.primary} />
      ) : (
        <>
          {icon}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small
  },
  primary: {
    backgroundColor: Colors.primary
  },
  secondary: {
    backgroundColor: Colors.secondary
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary
  },
  ghost: {
    backgroundColor: 'transparent'
  },
  small: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 36
  },
  medium: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 44
  },
  large: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    minHeight: 52
  },
  disabled: {
    opacity: 0.5
  },
  text: {
    ...Typography.body,
    fontWeight: '600'
  },
  primaryText: {
    color: Colors.text.white
  },
  secondaryText: {
    color: Colors.text.white
  },
  outlineText: {
    color: Colors.primary
  },
  ghostText: {
    color: Colors.primary
  },
  smallText: {
    fontSize: 14
  },
  mediumText: {
    fontSize: 16
  },
  largeText: {
    fontSize: 18
  },
  disabledText: {
    opacity: 0.7
  }
});