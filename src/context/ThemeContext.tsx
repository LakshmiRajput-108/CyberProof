import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode } from '../types/user';
import { StorageService } from '../services/storage';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = StorageService.getPreferences().theme;
    return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    return theme === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    let computedDark = false;

    computedDark = theme === 'dark';

    setIsDark(computedDark);
    root.classList.remove('dark', 'system');
    if (theme === 'system') {
      root.classList.add('system');
    } else if (computedDark) {
      root.classList.add('dark');
    }
  }, [theme]);


  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    StorageService.savePreferences({ theme: newTheme });
  };

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
