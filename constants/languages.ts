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
    // Navigation
    home: 'Home',
    voters: 'Voters',
    applications: 'Applications',
    reports: 'Reports',
    profile: 'Profile',
    
    // Profile & Settings
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
    selectLanguage: 'Select Language',
    
    // Login
    mobileNumber: 'Mobile Number',
    enterMobileNumber: 'Enter your mobile number',
    pin: 'PIN',
    enterPin: 'Enter 6-digit PIN',
    login: 'LOGIN',
    loggingIn: 'LOGGING IN...',
    forgotPin: 'Forgot Pin ?',
    dontHaveAccount: "Don't have an account?",
    register: 'Register!',
    
    // Voters
    votersTitle: 'Voters',
    votersSubtitle: 'Search and manage voter information',
    advancedVoterSearch: 'Advanced Voter Search',
    advancedSearchDescription: 'Search with detailed filters and edit voter information',
    quickSearch: 'Quick Search',
    searchPlaceholder: 'Enter name, voter ID, or phone number',
    search: 'Search',
    noVotersFound: 'No voters found',
    enterSearchCriteria: 'Enter search criteria to find voters',
    voterId: 'Voter ID',
    
    // Applications
    applicationsTitle: 'Applications',
    schemes: 'Schemes',
    myApplications: 'My Applications',
    searchSchemes: 'Search schemes...',
    availableSchemes: 'Available Schemes',
    noSchemesFound: 'No schemes found',
    apply: 'Apply',
    beneficiaries: 'Beneficiaries',
    enterVoterId: 'Enter Voter ID',
    applyingFor: 'Applying for',
    enterYourVoterId: 'Enter your Voter ID',
    cancel: 'Cancel',
    submit: 'Submit',
    applicationSubmitted: 'Application Submitted',
    noApplicationsFound: 'No applications found',
    viewDetails: 'View Details',
    mobile: 'Mobile',
    helpRequired: 'Help Required',
    submitted: 'Submitted',
    
    // Status
    pending: 'PENDING',
    approved: 'APPROVED',
    rejected: 'REJECTED',
    
    // HelpDesk
    helpDesk: 'HelpDesk',
    myRecentRequests: 'My Recent Requests',
    requestId: 'Request ID',
    noRequestsFound: 'No help desk requests found for this voter',
    viewAllRequests: 'View All Requests',
    applyForScheme: 'Apply for Scheme',
    voterDetails: 'Voter Details',
    name: 'Name',
    applicationWillBeProcessed: 'Application will be processed with the above voter details.',
    applicationSubmittedMessage: 'Your application has been submitted successfully and will be processed soon.',
    
    // Dashboard
    progressDashboard: 'Progress Dashboard',
    applicationsApproved: 'Applications Approved',
    activeKaryakartas: 'Active Karyakartas',
    registeredVoters: 'Registered Voters',
    loadingAnalytics: 'Loading analytics...',
    failedToLoadAnalytics: 'Failed to load analytics',
    quickActions: 'Quick Actions',
    
    // Common
    error: 'Error',
    ok: 'OK',
    back: 'Back',
    done: 'Done'
  },
  kn: {
    // Navigation
    home: 'ಮುಖ್ಯ',
    voters: 'ಮತದಾರರು',
    applications: 'ಅರ್ಜಿಗಳು',
    reports: 'ವರದಿಗಳು',
    profile: 'ಪ್ರೊಫೈಲ್',
    
    // Profile & Settings
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
    selectLanguage: 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ',
    
    // Login
    mobileNumber: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    enterMobileNumber: 'ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
    pin: 'ಪಿನ್',
    enterPin: '6-ಅಂಕಿಯ ಪಿನ್ ನಮೂದಿಸಿ',
    login: 'ಲಾಗಿನ್',
    loggingIn: 'ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ...',
    forgotPin: 'ಪಿನ್ ಮರೆತಿದ್ದೀರಾ?',
    dontHaveAccount: 'ಖಾತೆ ಇಲ್ಲವೇ?',
    register: 'ನೋಂದಣಿ ಮಾಡಿ!',
    
    // Voters
    votersTitle: 'ಮತದಾರರು',
    votersSubtitle: 'ಮತದಾರರ ಮಾಹಿತಿಯನ್ನು ಹುಡುಕಿ ಮತ್ತು ನಿರ್ವಹಿಸಿ',
    advancedVoterSearch: 'ಸುಧಾರಿತ ಮತದಾರ ಹುಡುಕಾಟ',
    advancedSearchDescription: 'ವಿವರವಾದ ಫಿಲ್ಟರ್‌ಗಳೊಂದಿಗೆ ಹುಡುಕಿ ಮತ್ತು ಮತದಾರರ ಮಾಹಿತಿಯನ್ನು ಸಂಪಾದಿಸಿ',
    quickSearch: 'ತ್ವರಿತ ಹುಡುಕಾಟ',
    searchPlaceholder: 'ಹೆಸರು, ಮತದಾರ ಐಡಿ, ಅಥವಾ ಫೋನ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ',
    search: 'ಹುಡುಕಿ',
    noVotersFound: 'ಯಾವುದೇ ಮತದಾರರು ಸಿಗಲಿಲ್ಲ',
    enterSearchCriteria: 'ಮತದಾರರನ್ನು ಹುಡುಕಲು ಹುಡುಕಾಟ ಮಾನದಂಡಗಳನ್ನು ನಮೂದಿಸಿ',
    voterId: 'ಮತದಾರ ಐಡಿ',
    
    // Applications
    applicationsTitle: 'ಅರ್ಜಿಗಳು',
    schemes: 'ಯೋಜನೆಗಳು',
    myApplications: 'ನನ್ನ ಅರ್ಜಿಗಳು',
    searchSchemes: 'ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ...',
    availableSchemes: 'ಲಭ್ಯವಿರುವ ಯೋಜನೆಗಳು',
    noSchemesFound: 'ಯಾವುದೇ ಯೋಜನೆಗಳು ಸಿಗಲಿಲ್ಲ',
    apply: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    beneficiaries: 'ಫಲಾನುಭವಿಗಳು',
    enterVoterId: 'ಮತದಾರ ಐಡಿ ನಮೂದಿಸಿ',
    applyingFor: 'ಇದಕ್ಕಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸುತ್ತಿದ್ದೀರಿ',
    enterYourVoterId: 'ನಿಮ್ಮ ಮತದಾರ ಐಡಿ ನಮೂದಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    submit: 'ಸಲ್ಲಿಸಿ',
    applicationSubmitted: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಲಾಗಿದೆ',
    noApplicationsFound: 'ಯಾವುದೇ ಅರ್ಜಿಗಳು ಸಿಗಲಿಲ್ಲ',
    viewDetails: 'ವಿವರಗಳನ್ನು ನೋಡಿ',
    mobile: 'ಮೊಬೈಲ್',
    helpRequired: 'ಅಗತ್ಯವಿರುವ ಸಹಾಯ',
    submitted: 'ಸಲ್ಲಿಸಲಾಗಿದೆ',
    
    // Status
    pending: 'ಬಾಕಿ',
    approved: 'ಅನುಮೋದಿತ',
    rejected: 'ತಿರಸ್ಕರಿಸಲಾಗಿದೆ',
    
    // HelpDesk
    helpDesk: 'ಸಹಾಯ ಮೇಜು',
    myRecentRequests: 'ನನ್ನ ಇತ್ತೀಚಿನ ವಿನಂತಿಗಳು',
    requestId: 'ವಿನಂತಿ ಐಡಿ',
    noRequestsFound: 'ಈ ಮತದಾರರಿಗೆ ಯಾವುದೇ ಸಹಾಯ ಮೇಜು ವಿನಂತಿಗಳು ಸಿಗಲಿಲ್ಲ',
    viewAllRequests: 'ಎಲ್ಲಾ ವಿನಂತಿಗಳನ್ನು ನೋಡಿ',
    applyForScheme: 'ಯೋಜನೆಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    voterDetails: 'ಮತದಾರರ ವಿವರಗಳು',
    name: 'ಹೆಸರು',
    applicationWillBeProcessed: 'ಮೇಲಿನ ಮತದಾರರ ವಿವರಗಳೊಂದಿಗೆ ಅರ್ಜಿಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುವುದು.',
    applicationSubmittedMessage: 'ನಿಮ್ಮ ಅರ್ಜಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ ಮತ್ತು ಶೀಘ್ರದಲ್ಲೇ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುವುದು.',
    
    // Dashboard
    progressDashboard: 'ಪ್ರಗತಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    applicationsApproved: 'ಅನುಮೋದಿತ ಅರ್ಜಿಗಳು',
    activeKaryakartas: 'ಸಕ್ರಿಯ ಕಾರ್ಯಕರ್ತರು',
    registeredVoters: 'ನೋಂದಾಯಿತ ಮತದಾರರು',
    loadingAnalytics: 'ವಿಶ್ಲೇಷಣೆ ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    failedToLoadAnalytics: 'ವಿಶ್ಲೇಷಣೆ ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ',
    quickActions: 'ತ್ವರಿತ ಕ್ರಿಯೆಗಳು',
    
    // Common
    error: 'ದೋಷ',
    ok: 'ಸರಿ',
    back: 'ಹಿಂದೆ',
    done: 'ಮುಗಿದಿದೆ'
  },
  ta: {
    // Navigation
    home: 'முகப்பு',
    voters: 'வாக்காளர்கள்',
    applications: 'விண்ணப்பங்கள்',
    reports: 'அறிக்கைகள்',
    profile: 'சுயவிவரம்',
    
    // Profile & Settings
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
    selectLanguage: 'மொழி தேர்ந்தெடுக்கவும்',
    
    // Login
    mobileNumber: 'மொபைல் எண்',
    enterMobileNumber: 'உங்கள் மொபைல் எண்ணை உள்ளிடவும்',
    pin: 'பின்',
    enterPin: '6-இலக்க பின் உள்ளிடவும்',
    login: 'உள்நுழைவு',
    loggingIn: 'உள்நுழைகிறது...',
    forgotPin: 'பின் மறந்துவிட்டதா?',
    dontHaveAccount: 'கணக்கு இல்லையா?',
    register: 'பதிவு செய்யுங்கள்!',
    
    // Voters
    votersTitle: 'வாக்காளர்கள்',
    votersSubtitle: 'வாக்காளர் தகவலைத் தேடி நிர்வகிக்கவும்',
    advancedVoterSearch: 'மேம்பட்ட வாக்காளர் தேடல்',
    advancedSearchDescription: 'விரிவான வடிப்பான்களுடன் தேடி வாக்காளர் தகவலைத் திருத்தவும்',
    quickSearch: 'விரைவு தேடல்',
    searchPlaceholder: 'பெயர், வாக்காளர் அடையாள அட்டை அல்லது தொலைபேசி எண்ணை உள்ளிடவும்',
    search: 'தேடு',
    noVotersFound: 'வாக்காளர்கள் எவரும் கிடைக்கவில்லை',
    enterSearchCriteria: 'வாக்காளர்களைக் கண்டறிய தேடல் அளவுகோல்களை உள்ளிடவும்',
    voterId: 'வாக்காளர் அடையாள அட்டை',
    
    // Applications
    applicationsTitle: 'விண்ணப்பங்கள்',
    schemes: 'திட்டங்கள்',
    myApplications: 'எனது விண்ணப்பங்கள்',
    searchSchemes: 'திட்டங்களைத் தேடுங்கள்...',
    availableSchemes: 'கிடைக்கும் திட்டங்கள்',
    noSchemesFound: 'திட்டங்கள் எதுவும் கிடைக்கவில்லை',
    apply: 'விண்ணப்பிக்கவும்',
    beneficiaries: 'பயனாளிகள்',
    enterVoterId: 'வாக்காளர் அடையாள அட்டையை உள்ளிடவும்',
    applyingFor: 'இதற்கு விண்ணப்பிக்கிறீர்கள்',
    enterYourVoterId: 'உங்கள் வாக்காளர் அடையாள அட்டையை உள்ளிடவும்',
    cancel: 'ரத்து செய்',
    submit: 'சமர்ப்பிக்கவும்',
    applicationSubmitted: 'விண்ணப்பம் சமர்ப்பிக்கப்பட்டது',
    noApplicationsFound: 'விண்ணப்பங்கள் எதுவும் கிடைக்கவில்லை',
    viewDetails: 'விவரங்களைப் பார்க்கவும்',
    mobile: 'மொபைல்',
    helpRequired: 'தேவையான உதவி',
    submitted: 'சமர்ப்பிக்கப்பட்டது',
    
    // Status
    pending: 'நிலுவையில்',
    approved: 'அங்கீகரிக்கப்பட்டது',
    rejected: 'நிராகரிக்கப்பட்டது',
    
    // HelpDesk
    helpDesk: 'உதவி மையம்',
    myRecentRequests: 'எனது சமீபத்திய கோரிக்கைகள்',
    requestId: 'கோரிக்கை ஐடி',
    noRequestsFound: 'இந்த வாக்காளருக்கு உதவி மையக் கோரிக்கைகள் எதுவும் கிடைக்கவில்லை',
    viewAllRequests: 'அனைத்து கோரிக்கைகளையும் பார்க்கவும்',
    applyForScheme: 'திட்டத்திற்கு விண்ணப்பிக்கவும்',
    voterDetails: 'வாக்காளர் விவரங்கள்',
    name: 'பெயர்',
    applicationWillBeProcessed: 'மேலே உள்ள வாக்காளர் விவரங்களுடன் விண்ணப்பம் செயலாக்கப்படும்.',
    applicationSubmittedMessage: 'உங்கள் விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டு விரைவில் செயலாக்கப்படும்.',
    
    // Dashboard
    progressDashboard: 'முன்னேற்ற டாஷ்போர்டு',
    applicationsApproved: 'அங்கீகரிக்கப்பட்ட விண்ணப்பங்கள்',
    activeKaryakartas: 'செயலில் உள்ள கார்யகர்த்தாக்கள்',
    registeredVoters: 'பதிவு செய்யப்பட்ட வாக்காளர்கள்',
    loadingAnalytics: 'பகுப்பாய்வு ஏற்றுகிறது...',
    failedToLoadAnalytics: 'பகுப்பாய்வு ஏற்றுவதில் தோல்வி',
    quickActions: 'விரைவு செயல்கள்',
    
    // Common
    error: 'பிழை',
    ok: 'சரி',
    back: 'பின்',
    done: 'முடிந்தது'
  },
  ml: {
    // Navigation
    home: 'ഹോം',
    voters: 'വോട്ടർമാർ',
    applications: 'അപേക്ഷകൾ',
    reports: 'റിപ്പോർട്ടുകൾ',
    profile: 'പ്രൊഫൈൽ',
    
    // Profile & Settings
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
    selectLanguage: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    
    // Login
    mobileNumber: 'മൊബൈൽ നമ്പർ',
    enterMobileNumber: 'നിങ്ങളുടെ മൊബൈൽ നമ്പർ നൽകുക',
    pin: 'പിൻ',
    enterPin: '6-അക്ക പിൻ നൽകുക',
    login: 'ലോഗിൻ',
    loggingIn: 'ലോഗിൻ ചെയ്യുന്നു...',
    forgotPin: 'പിൻ മറന്നോ?',
    dontHaveAccount: 'അക്കൗണ്ട് ഇല്ലേ?',
    register: 'രജിസ്റ്റർ ചെയ്യുക!',
    
    // Voters
    votersTitle: 'വോട്ടർമാർ',
    votersSubtitle: 'വോട്ടർ വിവരങ്ങൾ തിരയുകയും നിയന്ത്രിക്കുകയും ചെയ്യുക',
    advancedVoterSearch: 'വിപുലമായ വോട്ടർ തിരയൽ',
    advancedSearchDescription: 'വിശദമായ ഫിൽട്ടറുകൾ ഉപയോഗിച്ച് തിരയുകയും വോട്ടർ വിവരങ്ങൾ എഡിറ്റ് ചെയ്യുകയും ചെയ്യുക',
    quickSearch: 'പെട്ടെന്നുള്ള തിരയൽ',
    searchPlaceholder: 'പേര്, വോട്ടർ ഐഡി, അല്ലെങ്കിൽ ഫോൺ നമ്പർ നൽകുക',
    search: 'തിരയുക',
    noVotersFound: 'വോട്ടർമാരെ കണ്ടെത്തിയില്ല',
    enterSearchCriteria: 'വോട്ടർമാരെ കണ്ടെത്താൻ തിരയൽ മാനദണ്ഡങ്ങൾ നൽകുക',
    voterId: 'വോട്ടർ ഐഡി',
    
    // Applications
    applicationsTitle: 'അപേക്ഷകൾ',
    schemes: 'പദ്ധതികൾ',
    myApplications: 'എന്റെ അപേക്ഷകൾ',
    searchSchemes: 'പദ്ധതികൾ തിരയുക...',
    availableSchemes: 'ലഭ്യമായ പദ്ധതികൾ',
    noSchemesFound: 'പദ്ധതികൾ കണ്ടെത്തിയില്ല',
    apply: 'അപേക്ഷിക്കുക',
    beneficiaries: 'ഗുണഭോക്താക്കൾ',
    enterVoterId: 'വോട്ടർ ഐഡി നൽകുക',
    applyingFor: 'ഇതിനായി അപേക്ഷിക്കുന്നു',
    enterYourVoterId: 'നിങ്ങളുടെ വോട്ടർ ഐഡി നൽകുക',
    cancel: 'റദ്ദാക്കുക',
    submit: 'സമർപ്പിക്കുക',
    applicationSubmitted: 'അപേക്ഷ സമർപ്പിച്ചു',
    noApplicationsFound: 'അപേക്ഷകൾ കണ്ടെത്തിയില്ല',
    viewDetails: 'വിശദാംശങ്ങൾ കാണുക',
    mobile: 'മൊബൈൽ',
    helpRequired: 'ആവശ്യമായ സഹായം',
    submitted: 'സമർപ്പിച്ചു',
    
    // Status
    pending: 'തീർപ്പുകൽപ്പിക്കാത്ത',
    approved: 'അംഗീകരിച്ചു',
    rejected: 'നിരസിച്ചു',
    
    // HelpDesk
    helpDesk: 'സഹായ മേശ',
    myRecentRequests: 'എന്റെ സമീപകാല അഭ്യർത്ഥനകൾ',
    requestId: 'അഭ്യർത്ഥന ഐഡി',
    noRequestsFound: 'ഈ വോട്ടർക്ക് സഹായ മേശ അഭ്യർത്ഥനകൾ കണ്ടെത്തിയില്ല',
    viewAllRequests: 'എല്ലാ അഭ്യർത്ഥനകളും കാണുക',
    applyForScheme: 'പദ്ധതിക്ക് അപേക്ഷിക്കുക',
    voterDetails: 'വോട്ടർ വിശദാംശങ്ങൾ',
    name: 'പേര്',
    applicationWillBeProcessed: 'മേൽപ്പറഞ്ഞ വോട്ടർ വിശദാംശങ്ങൾ ഉപയോഗിച്ച് അപേക്ഷ പ്രോസസ്സ് ചെയ്യപ്പെടും.',
    applicationSubmittedMessage: 'നിങ്ങളുടെ അപേക്ഷ വിജയകരമായി സമർപ്പിച്ചു, ഉടൻ പ്രോസസ്സ് ചെയ്യപ്പെടും.',
    
    // Dashboard
    progressDashboard: 'പുരോഗതി ഡാഷ്ബോർഡ്',
    applicationsApproved: 'അംഗീകരിച്ച അപേക്ഷകൾ',
    activeKaryakartas: 'സജീവ കാര്യകർത്താക്കൾ',
    registeredVoters: 'രജിസ്റ്റർ ചെയ്ത വോട്ടർമാർ',
    loadingAnalytics: 'അനലിറ്റിക്സ് ലോഡ് ചെയ്യുന്നു...',
    failedToLoadAnalytics: 'അനലിറ്റിക്സ് ലോഡ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു',
    quickActions: 'പെട്ടെന്നുള്ള പ്രവർത്തനങ്ങൾ',
    
    // Common
    error: 'പിശക്',
    ok: 'ശരി',
    back: 'പിന്നോട്ട്',
    done: 'പൂർത്തിയായി',
    success: 'വിജയം',
    
    // Login & Registration
    sendOtp: 'OTP അയയ്ക്കുക',
    sendingOtp: 'OTP അയയ്ക്കുന്നു...',
    enterOtp: 'OTP നൽകുക',
    resendOtp: 'OTP വീണ്ടും അയയ്ക്കുക',
    resendOtpIn: 'OTP വീണ്ടും അയയ്ക്കുക',
    showOtp: 'OTP കാണിക്കുക',
    hideOtp: 'OTP മറയ്ക്കുക',
    newUserRegistration: 'പുതിയ ഉപയോക്താവ് രജിസ്ട്രേഷൻ',
    followSteps: 'ആരംഭിക്കാൻ ഈ ലളിതമായ ഘട്ടങ്ങൾ പിന്തുടരുക',
    startRegistration: 'രജിസ്ട്രേഷൻ ആരംഭിക്കുക',
    enterMobileNumberTitle: 'മൊബൈൽ നമ്പർ നൽകുക',
    verificationCodeSent: 'ഞങ്ങൾ നിങ്ങൾക്ക് ഒരു സ്ഥിരീകരണ കോഡ് അയയ്ക്കും',
    verifyOtpTitle: 'OTP സ്ഥിരീകരിക്കുക',
    enterCodeSent: 'നിങ്ങളുടെ മൊബൈലിലേക്ക് അയച്ച കോഡ് നൽകുക',
    setPinTitle: 'PIN സജ്ജമാക്കുക',
    createSecurePin: 'സുരക്ഷിത ആക്സസിനായി 4-അക്ക PIN സൃഷ്ടിക്കുക',
    createPin: 'PIN സൃഷ്ടിക്കുക',
    confirmPin: 'PIN സ്ഥിരീകരിക്കുക',
    reenterPin: 'PIN വീണ്ടും നൽകുക',
    createAccount: 'അക്കൗണ്ട് സൃഷ്ടിക്കുക',
    continue: 'തുടരുക',
    codeSentTo: 'കോഡ് അയച്ചത്',
    
    // Help Desk
    voterRequests: 'വോട്ടർ അഭ്യർത്ഥനകൾ',
    noRequestsFoundForVoter: 'ഈ വോട്ടർക്ക് അഭ്യർത്ഥനകൾ കണ്ടെത്തിയില്ല',
    submittedBy: 'സമർപ്പിച്ചത്',
    submissionDate: 'സമർപ്പണ തീയതി',
    unknown: 'അജ്ഞാതം',
    
    // Categories
    all: 'എല്ലാം',
    employment: 'തൊഴിൽ',
    agriculture: 'കൃഷി',
    health: 'ആരോഗ്യം',
    education: 'വിദ്യാഭ്യാസം',
    socialWelfare: 'സാമൂഹിക ക്ഷേമം',
    
    // Validation Messages
    pleaseEnterMobileNumber: 'ദയവായി മൊബൈൽ നമ്പർ നൽകുക',
    mobileNumberMust10Digits: 'മൊബൈൽ നമ്പർ 10 അക്കങ്ങൾ ആയിരിക്കണം',
    otpSentSuccessfully: 'OTP വിജയകരമായി അയച്ചു',
    failedToSendOtp: 'OTP അയയ്ക്കുന്നതിൽ പരാജയപ്പെട്ടു',
    pleaseEnterBothMobileAndOtp: 'ദയവായി മൊബൈൽ നമ്പറും OTP യും നൽകുക',
    otpMust6Digits: 'OTP 6 അക്കങ്ങൾ ആയിരിക്കണം',
    loginFailed: 'ലോഗിൻ പരാജയപ്പെട്ടു',
    welcome: 'സ്വാഗതം',
    
    // Profile & Settings additions
    help: 'സഹായം',
    areYouSureLogout: 'നിങ്ങൾക്ക് ലോഗൗട്ട് ചെയ്യണമെന്ന് ഉറപ്പാണോ?',
    
    // Additional common terms
    verificationCode: 'സ്ഥിരീകരണ കോഡ്',
    backToSteps: 'ഘട്ടങ്ങളിലേക്ക് തിരികെ',
    backToMobile: 'മൊബൈലിലേക്ക് തിരികെ',
    backToOtp: 'OTP യിലേക്ക് തിരികെ',
    completeRegistration: 'രജിസ്ട്രേഷൻ പൂർത്തിയാക്കുക'
  },
  hi: {
    // Navigation
    home: 'होम',
    voters: 'मतदाता',
    applications: 'आवेदन',
    reports: 'रिपोर्ट',
    profile: 'प्रोफ़ाइल',
    
    // Profile & Settings
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
    selectLanguage: 'भाषा चुनें',
    
    // Login
    mobileNumber: 'मोबाइल नंबर',
    enterMobileNumber: 'अपना मोबाइल नंबर दर्ज करें',
    pin: 'पिन',
    enterPin: '6-अंकीय पिन दर्ज करें',
    login: 'लॉगिन',
    loggingIn: 'लॉगिन हो रहा है...',
    forgotPin: 'पिन भूल गए?',
    dontHaveAccount: 'खाता नहीं है?',
    register: 'रजिस्टर करें!',
    
    // Voters
    votersTitle: 'मतदाता',
    votersSubtitle: 'मतदाता जानकारी खोजें और प्रबंधित करें',
    advancedVoterSearch: 'उन्नत मतदाता खोज',
    advancedSearchDescription: 'विस्तृत फिल्टर के साथ खोजें और मतदाता जानकारी संपादित करें',
    quickSearch: 'त्वरित खोज',
    searchPlaceholder: 'नाम, मतदाता आईडी, या फोन नंबर दर्ज करें',
    search: 'खोजें',
    noVotersFound: 'कोई मतदाता नहीं मिला',
    enterSearchCriteria: 'मतदाताओं को खोजने के लिए खोज मानदंड दर्ज करें',
    voterId: 'मतदाता आईडी',
    
    // Applications
    applicationsTitle: 'आवेदन',
    schemes: 'योजनाएं',
    myApplications: 'मेरे आवेदन',
    searchSchemes: 'योजनाएं खोजें...',
    availableSchemes: 'उपलब्ध योजनाएं',
    noSchemesFound: 'कोई योजना नहीं मिली',
    apply: 'आवेदन करें',
    beneficiaries: 'लाभार्थी',
    enterVoterId: 'मतदाता आईडी दर्ज करें',
    applyingFor: 'इसके लिए आवेदन कर रहे हैं',
    enterYourVoterId: 'अपना मतदाता आईडी दर्ज करें',
    cancel: 'रद्द करें',
    submit: 'जमा करें',
    applicationSubmitted: 'आवेदन जमा किया गया',
    noApplicationsFound: 'कोई आवेदन नहीं मिला',
    viewDetails: 'विवरण देखें',
    mobile: 'मोबाइल',
    helpRequired: 'आवश्यक सहायता',
    submitted: 'जमा किया गया',
    
    // Status
    pending: 'लंबित',
    approved: 'स्वीकृत',
    rejected: 'अस्वीकृत',
    
    // HelpDesk
    helpDesk: 'सहायता डेस्क',
    myRecentRequests: 'मेरे हाल के अनुरोध',
    requestId: 'अनुरोध आईडी',
    noRequestsFound: 'इस मतदाता के लिए कोई सहायता डेस्क अनुरोध नहीं मिला',
    viewAllRequests: 'सभी अनुरोध देखें',
    applyForScheme: 'योजना के लिए आवेदन करें',
    voterDetails: 'मतदाता विवरण',
    name: 'नाम',
    applicationWillBeProcessed: 'उपरोक्त मतदाता विवरण के साथ आवेदन संसाधित किया जाएगा।',
    applicationSubmittedMessage: 'आपका आवेदन सफलतापूर्वक जमा किया गया है और जल्द ही संसाधित किया जाएगा।',
    
    // Dashboard
    progressDashboard: 'प्रगति डैशबोर्ड',
    applicationsApproved: 'स्वीकृत आवेदन',
    activeKaryakartas: 'सक्रिय कार्यकर्ता',
    registeredVoters: 'पंजीकृत मतदाता',
    loadingAnalytics: 'विश्लेषण लोड हो रहा है...',
    failedToLoadAnalytics: 'विश्लेषण लोड करने में विफल',
    quickActions: 'त्वरित कार्य',
    
    // Common
    error: 'त्रुटि',
    ok: 'ठीक है',
    back: 'वापस',
    done: 'हो गया'
  }
};