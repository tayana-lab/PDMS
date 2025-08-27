import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Check } from 'lucide-react-native';
import { LanguageType, Languages } from '@/constants/languages';
import { useAppSettings } from '@/hooks/useAppSettings';
import { Spacing, BorderRadius, Shadows } from '@/constants/theme';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export default function LanguageSelector({ visible, onClose }: LanguageSelectorProps) {
  const { currentLanguage, setLanguage, colors, t } = useAppSettings();

  const languageOptions = Object.values(Languages);

  const handleLanguageSelect = async (language: LanguageType) => {
    await setLanguage(language);
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
            {t('selectLanguage')}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeText, { color: colors.primary }]}>{t('done')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {languageOptions.map((language) => {
            const isSelected = currentLanguage === language.code;
            
            return (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageOption,
                  { 
                    backgroundColor: colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border
                  }
                ]}
                onPress={() => handleLanguageSelect(language.code)}
                activeOpacity={0.8}
              >
                <View style={styles.languageInfo}>
                  <Text style={[styles.languageName, { color: colors.text.primary }]}>
                    {language.name}
                  </Text>
                  <Text style={[styles.nativeName, { color: colors.text.secondary }]}>
                    {language.nativeName}
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
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    ...Shadows.small
  },
  languageInfo: {
    flex: 1
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: Spacing.xs
  },
  nativeName: {
    fontSize: 14,
    fontWeight: '400'
  }
});