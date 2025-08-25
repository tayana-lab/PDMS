export const Colors = {
  primary: '#FF6B35', // Saffron/Orange
  secondary: '#138808', // Green
  accent: '#FFD700', // Gold
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: {
    primary: '#1A1A1A',
    secondary: '#666666',
    light: '#999999',
    white: '#FFFFFF'
  },
  border: '#E0E0E0',
  error: '#DC3545',
  success: '#28A745',
  warning: '#FFC107',
  info: '#17A2B8'
};

export const Typography = {
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text.primary
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text.primary
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: Colors.text.primary
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.text.secondary
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: Colors.text.light
  }
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8
  }
};