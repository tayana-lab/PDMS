import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import createContextHook from '@nkzw/create-context-hook';
import { useAppSettings } from '@/hooks/useAppSettings';
import { Check, AlertTriangle, X } from 'lucide-react-native';

export type ConfirmOptions = {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
};

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  __state: {
    visible: boolean;
    options: ConfirmOptions | null;
  };
  __close: (result: boolean) => void;
}

export const [ConfirmProvider, useConfirm] = createContextHook<ConfirmContextType>(() => {
  const { colors } = useAppSettings();
  const [visible, setVisible] = useState<boolean>(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions) => {
    console.log('[Confirm] open', opts?.title);
    setOptions(opts);
    setVisible(true);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const close = useCallback((result: boolean) => {
    console.log('[Confirm] close result=', result);
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
    setVisible(false);
    setOptions(null);
  }, []);

  useEffect(() => {
    return () => {
      resolverRef.current = null;
    };
  }, []);

  useMemo(() => createStyles(colors), [colors]);

  return {
    confirm,
    __state: { visible, options },
    __close: close,
  };
}, undefined);

function ConfirmModal({
  visible,
  options,
  onClose,
}: {
  visible: boolean;
  options: ConfirmOptions | null;
  onClose: (result: boolean) => void;
}) {
  const { colors } = useAppSettings();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const variant = options?.variant ?? 'default';
  const confirmText = options?.confirmText ?? (variant === 'danger' ? 'Delete' : 'Confirm');
  const cancelText = options?.cancelText ?? 'Cancel';

  return (
    <Modal
      animationType={Platform.OS === 'web' ? 'fade' : 'slide'}
      transparent
      visible={visible}
      onRequestClose={() => onClose(false)}
    >
      <View style={styles.backdrop} testID="confirm-backdrop">
        <View style={styles.container} testID="confirm-modal">
          <View style={styles.headerRow}>
            {variant === 'danger' ? (
              <AlertTriangle size={22} color={colors.error} />
            ) : (
              <Check size={22} color={colors.primary} />
            )}
            <Text style={[styles.title, { color: colors.text.primary }]} numberOfLines={2}>
              {options?.title ?? ''}
            </Text>
            <TouchableOpacity
              onPress={() => onClose(false)}
              style={styles.closeBtn}
              accessibilityLabel="Close"
              testID="confirm-close"
            >
              <X size={18} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {options?.message ? (
            <Text style={[styles.message, { color: colors.text.secondary }]}>{options.message}</Text>
          ) : null}

          <View style={styles.actions}>
            {cancelText ? (
              <TouchableOpacity
                onPress={() => onClose(false)}
                style={[styles.btn, styles.btnSecondary]}
                testID="confirm-cancel"
              >
                <Text style={[styles.btnText, { color: colors.text.primary }]}>{cancelText}</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              onPress={() => onClose(true)}
              style={[styles.btn, variant === 'danger' ? styles.btnDanger : styles.btnPrimary]}
              testID="confirm-accept"
            >
              <Text style={[styles.btnText, { color: colors.text.white }]}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(colors: any) {
  const fontWeight600 = '600' as const;
  const fontWeight500 = '500' as const;
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    container: {
      width: '100%',
      maxWidth: 420,
      borderRadius: 16,
      backgroundColor: colors.surface,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    closeBtn: {
      marginLeft: 'auto',
      padding: 6,
      borderRadius: 999,
    },
    title: {
      flexShrink: 1,
      fontSize: 18,
      fontWeight: fontWeight600,
      marginLeft: 8,
    },
    message: {
      marginTop: 12,
      fontSize: 14,
      lineHeight: 20,
      color: colors.text.secondary,
    },
    actions: {
      marginTop: 16,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
    },
    btn: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 10,
      minWidth: 96,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnPrimary: {
      backgroundColor: colors.primary,
    },
    btnDanger: {
      backgroundColor: colors.error ?? '#FF3B30',
    },
    btnSecondary: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    btnText: {
      fontSize: 14,
      fontWeight: fontWeight500,
    },
  });
}

export function ConfirmContainer() {
  const ctx = useConfirm();
  const visible = ctx.__state.visible;
  const options = ctx.__state.options;
  const onClose = ctx.__close;
  return (
    <ConfirmModal visible={visible} options={options} onClose={onClose} />
  );
}
