import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { ThemeType, Themes, ColorScheme } from '@/constants/theme';
import { LanguageType, Languages, Translations } from '@/constants/languages';

interface AppSettingsContextType {
  // Theme
  currentTheme: ThemeType;
  colors: ColorScheme;
  setTheme: (theme: ThemeType) => void;
  
  // Language
  currentLanguage: LanguageType;
  setLanguage: (language: LanguageType) => void;
  t: (key: string) => string;
  
  // Loading state
  isLoading: boolean;
}

const THEME_STORAGE_KEY = '@app_theme';
const LANGUAGE_STORAGE_KEY = '@app_language';

export const [AppSettingsProvider, useAppSettings] = createContextHook<AppSettingsContextType>(() => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('light');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageType>('en');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load saved settings on app start
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [savedTheme, savedLanguage] = await Promise.all([
        AsyncStorage.getItem(THEME_STORAGE_KEY),
        AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      ]);

      if (savedTheme && Object.keys(Themes).includes(savedTheme)) {
        setCurrentTheme(savedTheme as ThemeType);
      }

      if (savedLanguage && Object.keys(Languages).includes(savedLanguage)) {
        setCurrentLanguage(savedLanguage as LanguageType);
      }
    } catch (error) {
      console.error('Error loading app settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = useCallback(async (theme: ThemeType) => {
    try {
      setCurrentTheme(theme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
      console.log('Theme saved:', theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, []);

  const setLanguage = useCallback(async (language: LanguageType) => {
    try {
      setCurrentLanguage(language);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      console.log('Language saved:', language);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  }, []);

  const t = useCallback((key: string): string => {
    return Translations[currentLanguage]?.[key] || key;
  }, [currentLanguage]);

  return useMemo(() => ({
    currentTheme,
    colors: Themes[currentTheme],
    setTheme,
    currentLanguage,
    setLanguage,
    t,
    isLoading
  }), [currentTheme, currentLanguage, setTheme, setLanguage, t, isLoading]);
});