// Color palette for the app
export const COLORS = {
  // Primary colors
  primary: '#007AFF',
  primaryDark: '#0051D5',
  primaryLight: '#4DA2FF',
  
  // Secondary colors
  secondary: '#5856D6',
  secondaryDark: '#3634A3',
  secondaryLight: '#7D7AEA',
  
  // Accent colors
  accent: '#FF9500',
  accentDark: '#CC7700',
  accentLight: '#FFB340',
  
  // Success, Warning, Error
  success: '#4CAF50',
  successDark: '#388E3C',
  successLight: '#81C784',
  
  warning: '#FF9800',
  warningDark: '#F57C00',
  warningLight: '#FFB74D',
  
  error: '#FF3B30',
  errorDark: '#CC2E24',
  errorLight: '#FF6259',
  
  // Neutral colors
  black: '#000000',
  white: '#FFFFFF',
  
  // Gray scale
  gray900: '#1a1a1a',
  gray800: '#333333',
  gray700: '#4d4d4d',
  gray600: '#666666',
  gray500: '#808080',
  gray400: '#999999',
  gray300: '#b3b3b3',
  gray200: '#cccccc',
  gray100: '#e6e6e6',
  gray50: '#f5f5f5',
  
  // Backgrounds
  background: '#FFFFFF',
  backgroundSecondary: '#f5f5f5',
  backgroundTertiary: '#f9f9f9',
  
  // Borders
  border: '#e6e6e6',
  borderDark: '#cccccc',
  
  // Text
  text: '#1a1a1a',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textDisabled: '#b3b3b3',
  textInverse: '#FFFFFF',
  
  // Special colors
  gold: '#FFD700',
  star: '#FFD700',
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',
  
  // Social media colors (if needed)
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  google: '#DB4437',
  instagram: '#E4405F',
  
  // Status colors
  online: '#4CAF50',
  offline: '#9E9E9E',
  away: '#FF9800',
  busy: '#F44336',
};

// Color themes (for potential dark mode support)
export const LIGHT_THEME = {
  ...COLORS,
  background: '#FFFFFF',
  text: '#1a1a1a',
};

export const DARK_THEME = {
  ...COLORS,
  background: '#1a1a1a',
  backgroundSecondary: '#2d2d2d',
  backgroundTertiary: '#3a3a3a',
  text: '#FFFFFF',
  textSecondary: '#b3b3b3',
  border: '#3a3a3a',
  card: '#2d2d2d',
};

export default COLORS;