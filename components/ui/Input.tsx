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
  
  const shouldShowToggle = secureTextEntry;
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, inputContainerStyle]}>
        {leftIcon && <View style={styles.inputIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            (rightIcon || shouldShowToggle) && styles.inputWithRightIcon,
            error && styles.inputError,
            style
          ]}
          placeholderTextColor={colors.text.light}
          secureTextEntry={isSecure}
          {...props}
        />
        {shouldShowToggle && (
          <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility}>
            {showPassword ? (
              <Eye size={20} color={colors.text.light} />
            ) : (
              <EyeOff size={20} color={colors.text.light} />
            )}
          </TouchableOpacity>
        )}
        {rightIcon && !shouldShowToggle && <View style={styles.eyeIcon}>{rightIcon}</View>}
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
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: Spacing.sm,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...Shadows.small,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    minHeight: 50,
    height: 50,
    textAlignVertical: 'center',
  },
  inputWithRightIcon: {
    paddingRight: 50
  },
  eyeIcon: {
    position: 'absolute',
    right: Spacing.md,
    padding: Spacing.xs,
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