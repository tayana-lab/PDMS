import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: any;
}

export default function Input({ label, error, leftIcon, rightIcon, containerStyle, style, ...props }: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            error && styles.inputError,
            style
          ]}
          placeholderTextColor={Colors.text.light}
          {...props}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md
  },
  label: {
    ...Typography.caption,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    color: Colors.text.primary
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: Colors.text.primary,
    backgroundColor: Colors.background,
    minHeight: 44
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
    borderColor: Colors.error
  },
  error: {
    ...Typography.small,
    color: Colors.error,
    marginTop: Spacing.xs
  }
});