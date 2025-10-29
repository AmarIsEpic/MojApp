import { useContext } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';

export default function ThemeSwitcher() {
  const { mode, setMode, isDark, units, toggleUnits } = useContext(ThemeContext);
  return (
    <View style={styles.row}>
      <View style={styles.col}><Text style={[styles.label, isDark && { color: '#E8E6E3' }]}>Prati sistem</Text><Switch value={mode==='system'} onValueChange={(v)=> setMode(v ? 'system' : (isDark ? 'dark':'light'))} /></View>
      <View style={styles.col}><Text style={[styles.label, isDark && { color: '#E8E6E3' }]}>Tamni režim</Text><Switch value={isDark} onValueChange={()=> setMode(isDark?'light':'dark')} disabled={mode==='system'} /></View>
      <View style={styles.col}><Text style={[styles.label, isDark && { color: '#E8E6E3' }]}>Fahrenheit</Text><Switch value={units==='imperial'} onValueChange={toggleUnits} /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
     marginTop: 16 
  },
  col: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 
  },
  label: {
     color: '#2B3A55' 
  },
});


