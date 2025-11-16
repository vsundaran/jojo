// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { AppTheme } from '../types';
import { lightTheme } from '../themes/theme';

const ThemeContext = createContext<AppTheme>(lightTheme);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ThemeContext.Provider value={lightTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): AppTheme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};