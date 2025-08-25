import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Check } from 'lucide-react-native';
import { ThemeType, Themes, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAppSettings } from '@/hooks/useAppSettings';

interface ThemeSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export default function ThemeSelector({ visible, onClose }: ThemeSelectorProps) {
  const { currentTheme, setTheme, colors, t } = useAppSettings();

  const themeOptions: { key: ThemeType; name: string; preview: string }[] = [
    { key: 'light', name: t('lightTheme'), preview: '#FFFFFF' },
    { key: 'dark', name: t('darkTheme'), preview: '#121212' },
    { key: 'blue', name: t('blueTheme'), preview: '#2196F3' },
    { key: 'green', name: t('greenTheme'), preview: '#4CAF50' }
  ];

  const handleThemeSelect = async (theme: ThemeType) => {
    await setTheme(theme);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            {t('selectTheme')}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeText, { color: colors.primary }]}>Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {themeOptions.map((option) => {
            const isSelected = currentTheme === option.key;
            const themeColors = Themes[option.key];
            
            return (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.themeOption,
                  { 
                    backgroundColor: colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border
                  }
                ]}
                onPress={() => handleThemeSelect(option.key)}
                activeOpacity={0.8}
              >
                <View style={styles.themeInfo}>
                  <View 
                    style={[
                      styles.themePreview,
                      { backgroundColor: themeColors.background }
                    ]}
                  >
                    <View 
                      style={[
                        styles.previewAccent,
                        { backgroundColor: themeColors.primary }
                      ]}
                    />
                  </View>
                  <Text style={[styles.themeName, { color: colors.text.primary }]}>
                    {option.name}
                  </Text>
                </View>
                {isSelected && (
                  <Check size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1
  },
  title: {
    fontSize: 20,
    fontWeight: '600'
  },
  closeButton: {
    padding: Spacing.sm
  },
  closeText: {
    fontSize: 16,
    fontWeight: '600'
  },
  content: {
    flex: 1,
    padding: Spacing.lg
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    ...Shadows.small
  },
  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  themePreview: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  previewAccent: {
    width: 16,
    height: 16,
    borderRadius: 8
  },
  themeName: {
    fontSize: 16,
    fontWeight: '500'
  }
});