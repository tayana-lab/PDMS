import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, Platform, View } from 'react-native';
import { Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAppSettings } from '@/hooks/useAppSettings';

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
  const { colors } = useAppSettings();
  const actualVariant = variant === 'default' ? 'primary' : variant;
  const styles = createStyles(colors);
  
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

    {...(actualVariant === 'ghost' ? { android_ripple: undefined } : {})}
  >
    {loading ? (
      <ActivityIndicator
        color={actualVariant === 'primary' ? colors.text.white : colors.primary}
      />
    ) : (
      <View style={styles.content}>
        {icon}
        <Text style={textStyles}>{title}</Text>
      </View>
    )}
  </TouchableOpacity>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  base: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'ios' ? Shadows.small : { elevation: 2 })
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs
  },
  primary: {
    backgroundColor: colors.primary
  },
  secondary: {
    backgroundColor: colors.secondary
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0
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
    color: colors.text.white
  },
  secondaryText: {
    color: colors.text.white
  },
  outlineText: {
    color: colors.primary
  },
  ghostText: {
    color: colors.primary
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