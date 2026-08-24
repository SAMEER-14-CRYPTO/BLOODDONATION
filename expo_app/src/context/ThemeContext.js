import React, { createContext, useState, useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

const ThemeContext = createContext();

export const LightTheme = {
  isDark: false,
  bg: '#F4F6FA',
  card: '#FFFFFF',
  border: '#E2E8F0',
  text: '#0F172A',
  textMuted: '#64748B',
  inputBg: '#F8FAFC',
  primary: '#E53935',
  primaryDark: '#C62828',
  primaryLight: '#EF5350',
  success: '#43A047',
  warning: '#FB8C00',
  info: '#1E88E5',
  cardShadow: 'rgba(0, 0, 0, 0.06)',
  bloodThemes: Colors.bloodThemes
};

export const DarkTheme = {
  isDark: true,
  bg: '#111422',
  card: '#191C2E',
  border: '#242942',
  text: '#FFFFFF',
  textMuted: '#8C90AA',
  inputBg: '#111422',
  primary: '#E53935',
  primaryDark: '#C62828',
  primaryLight: '#EF5350',
  success: '#43A047',
  warning: '#FB8C00',
  info: '#1E88E5',
  cardShadow: 'rgba(0, 0, 0, 0.4)',
  bloodThemes: Colors.bloodThemes
};

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true); // Default to sleek dark mode

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const theme = isDark ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return { isDark: true, theme: DarkTheme, toggleTheme: () => {} };
  }
  return context;
}

// ── Reusable Theme Toggle Button Component (Sun ☀️ / Moon 🌙) ──
export function ThemeToggleButton({ style }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <TouchableOpacity 
      style={[
        styles.toggleBtn, 
        isDark ? styles.toggleBtnDark : styles.toggleBtnLight,
        style
      ]}
      onPress={toggleTheme}
      activeOpacity={0.7}
      accessibilityLabel="Toggle Light / Dark Mode"
    >
      <Text style={styles.toggleIcon}>{isDark ? '🌙' : '☀️'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  toggleBtnDark: {
    backgroundColor: '#191C2E',
    borderColor: '#242942',
  },
  toggleBtnLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleIcon: {
    fontSize: 18,
  },
});
