export type LanguageType = 'en' | 'kn' | 'ta' | 'ml' | 'hi';

export interface Language {
  code: LanguageType;
  name: string;
  nativeName: string;
}

export const Languages: Record<LanguageType, Language> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English'
  },
  kn: {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ'
  },
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்'
  },
  ml: {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം'
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी'
  }
};

export const Translations: Record<LanguageType, Record<string, string>> = {
  en: {
    profile: 'Profile',
    settings: 'Settings',
    notifications: 'Notifications',
    security: 'Security',
    theme: 'Theme',
    language: 'Language',
    logout: 'Logout',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    blueTheme: 'Blue',
    greenTheme: 'Green',
    selectTheme: 'Select Theme',
    selectLanguage: 'Select Language'
  },
  kn: {
    profile: 'ಪ್ರೊಫೈಲ್',
    settings: 'ಸೆಟ್ಟಿಂಗ್ಸ್',
    notifications: 'ಅಧಿಸೂಚನೆಗಳು',
    security: 'ಭದ್ರತೆ',
    theme: 'ಥೀಮ್',
    language: 'ಭಾಷೆ',
    logout: 'ಲಾಗ್ ಔಟ್',
    lightTheme: 'ಬೆಳಕು',
    darkTheme: 'ಕತ್ತಲೆ',
    blueTheme: 'ನೀಲಿ',
    greenTheme: 'ಹಸಿರು',
    selectTheme: 'ಥೀಮ್ ಆಯ್ಕೆಮಾಡಿ',
    selectLanguage: 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ'
  },
  ta: {
    profile: 'சுயவிவரம்',
    settings: 'அமைப்புகள்',
    notifications: 'அறிவிப்புகள்',
    security: 'பாதுகாப்பு',
    theme: 'தீம்',
    language: 'மொழி',
    logout: 'வெளியேறு',
    lightTheme: 'வெளிச்சம்',
    darkTheme: 'இருள்',
    blueTheme: 'நீலம்',
    greenTheme: 'பச்சை',
    selectTheme: 'தீம் தேர்ந்தெடுக்கவும்',
    selectLanguage: 'மொழி தேர்ந்தெடுக்கவும்'
  },
  ml: {
    profile: 'പ്രൊഫൈൽ',
    settings: 'ക്രമീകരണങ്ങൾ',
    notifications: 'അറിയിപ്പുകൾ',
    security: 'സുരക്ഷ',
    theme: 'തീം',
    language: 'ഭാഷ',
    logout: 'ലോഗൗട്ട്',
    lightTheme: 'വെളിച്ചം',
    darkTheme: 'ഇരുട്ട്',
    blueTheme: 'നീല',
    greenTheme: 'പച്ച',
    selectTheme: 'തീം തിരഞ്ഞെടുക്കുക',
    selectLanguage: 'ഭാഷ തിരഞ്ഞെടുക്കുക'
  },
  hi: {
    profile: 'प्रोफ़ाइल',
    settings: 'सेटिंग्स',
    notifications: 'सूचनाएं',
    security: 'सुरक्षा',
    theme: 'थीम',
    language: 'भाषा',
    logout: 'लॉग आउट',
    lightTheme: 'हल्का',
    darkTheme: 'गहरा',
    blueTheme: 'नीला',
    greenTheme: 'हरा',
    selectTheme: 'थीम चुनें',
    selectLanguage: 'भाषा चुनें'
  }
};