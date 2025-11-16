// src/themes/theme.ts
import { AppTheme } from '../types';
import { scale, verticalScale } from 'react-native-size-matters';

export const lightTheme: AppTheme = {
  colors: {
    primary: '#6366F1', // Indigo
    secondary: '#EC4899', // Pink
    accent: '#10B981', // Emerald
    background: '#FFFFFF',
    surface: '#F8FAFC',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    placeholder: '#9CA3AF',
  },
  spacing: {
    xs: scale(4),
    sm: scale(8),
    md: scale(16),
    lg: scale(24),
    xl: scale(32),
  },
  typography: {
    h1: {
      fontSize: scale(24),
      fontWeight: 'bold',
      lineHeight: scale(32),
    },
    h2: {
      fontSize: scale(20),
      fontWeight: '600',
      lineHeight: scale(28),
    },
    h3: {
      fontSize: scale(16),
      fontWeight: '600',
      lineHeight: scale(24),
    },
    body: {
      fontSize: scale(14),
      lineHeight: scale(20),
    },
    caption: {
      fontSize: scale(12),
      lineHeight: scale(16),
    },
    button: {
      fontSize: scale(16),
      fontWeight: '600',
    },
  },
  borderRadius: {
    sm: scale(4),
    md: scale(8),
    lg: scale(12),
  },
  headerHeight: verticalScale(56),
};