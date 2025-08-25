import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAppSettings } from '@/hooks/useAppSettings';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: any;
  inputContainerStyle?: any;
}

export default function Input({ label, error, leftIcon, rightIcon, containerStyle, inputContainerStyle, style, secureTextEntry, ...props }: InputProps) {
  const { colors } = useAppSettings();
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [showPassword, setShowPassword] = useState(false);
  const styles = createStyles(colors);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setIsSecure(!isSecure);
  };
  
  const shouldShowToggle = secureTextEntry && props.keyboardType === 'numeric';
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, inputContainerStyle]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || shouldShowToggle) && styles.inputWithRightIcon,
            error && styles.inputError,
            style
          ]}
          placeholderTextColor={colors.text.light}
          secureTextEntry={isSecure}
          {...props}
        />
        {shouldShowToggle && (
          <TouchableOpacity style={styles.rightIcon} onPress={togglePasswordVisibility}>
            {showPassword ? (
              <Eye size={20} color={colors.text.light} />
            ) : (
              <EyeOff size={20} color={colors.text.light} />
            )}
          </TouchableOpacity>
        )}
        {rightIcon && !shouldShowToggle && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    marginBottom: Spacing.md
  },
  label: {
    ...Typography.caption,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    color: colors.text.primary
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...Shadows.small,
  },
  input: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: 'transparent',
    borderWidth: 0,
    minHeight: 48
  },
  inputWithLeftIcon: {
    paddingLeft: 40
  },
  inputWithRightIcon: {
    paddingRight: 40
  },
  leftIcon: {
    position: 'absolute',
    left: Spacing.md,
    zIndex: 1
  },
  rightIcon: {
    position: 'absolute',
    right: Spacing.md,
    zIndex: 1
  },
  inputError: {
    borderColor: colors.error
  },
  error: {
    ...Typography.small,
    color: colors.error,
    marginTop: Spacing.xs
  }
});