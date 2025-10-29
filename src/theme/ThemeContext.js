import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

export const ThemeContext = createContext({
  mode: 'system', // 'system' | 'light' | 'dark'
  isDark: true,
  accent: '#5EE1FF',
  units: 'metric', // 'metric' | 'imperial'
  backgroundAnimation: true,
  setMode: (_m) => {},
  toggleDark: () => {},
  setAccent: (_c) => {},
  setAccentFromWeather: (_cond) => {},
  setUnits: (_u) => {},
  toggleUnits: () => {},
  toggleBackgroundAnimation: () => {},
});

function pickAccentFromCondition(condition) {
  const key = String(condition || '').toLowerCase();
  if (key.includes('clear')) return '#FFD369';
  if (key.includes('cloud')) return '#8AB4F8';
  if (key.includes('rain') || key.includes('drizzle')) return '#5EE1FF';
  if (key.includes('thunder')) return '#7D5CFF';
  if (key.includes('snow')) return '#B3F0FF';
  if (key.includes('mist') || key.includes('fog')) return '#A3B1C6';
  return '#5EE1FF';
}

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState('system');
  const [accent, setAccent] = useState('#5EE1FF');
  const [units, setUnits] = useState('metric');
  const [backgroundAnimation, setBackgroundAnimation] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedMode = await AsyncStorage.getItem('theme_mode');
        const savedUnits = await AsyncStorage.getItem('temperature_units');
        const savedBackgroundAnimation = await AsyncStorage.getItem('background_animation');
        
        if (savedMode) setMode(savedMode);
        if (savedUnits) setUnits(savedUnits);
        if (savedBackgroundAnimation !== null) {
          setBackgroundAnimation(savedBackgroundAnimation === 'true');
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    
    loadSettings();
  }, []);

  // Save settings to AsyncStorage when they change
  useEffect(() => {
    if (!isLoaded) return;
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem('theme_mode', mode);
      } catch (error) {
        console.error('Error saving theme mode:', error);
      }
    };
    saveSettings();
  }, [mode, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem('temperature_units', units);
      } catch (error) {
        console.error('Error saving temperature units:', error);
      }
    };
    saveSettings();
  }, [units, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem('background_animation', String(backgroundAnimation));
      } catch (error) {
        console.error('Error saving background animation:', error);
      }
    };
    saveSettings();
  }, [backgroundAnimation, isLoaded]);

  const toggleDark = useCallback(() => {
    // When user toggles dark manually, exit system mode
    if (mode === 'system') {
      setMode('dark');
    } else {
      setMode((m) => (m === 'dark' ? 'light' : 'dark'));
    }
  }, [mode]);
  
  const setAccentFromWeather = useCallback((condition) => {
    setAccent(pickAccentFromCondition(condition));
  }, []);

  const toggleUnits = useCallback(() => {
    setUnits((u) => (u === 'metric' ? 'imperial' : 'metric'));
  }, []);

  const toggleBackgroundAnimation = useCallback(() => {
    setBackgroundAnimation((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({ 
      mode, setMode, isDark, accent, units, setUnits, toggleUnits, 
      toggleDark, setAccent, setAccentFromWeather, backgroundAnimation, toggleBackgroundAnimation
    }),
    [mode, setMode, isDark, accent, units, setUnits, toggleUnits, toggleDark, setAccentFromWeather, backgroundAnimation, toggleBackgroundAnimation]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}


