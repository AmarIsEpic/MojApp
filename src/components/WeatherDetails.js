import { StyleSheet, Text, View } from 'react-native';

export default function WeatherDetails({ feelsLike, humidity, wind, isDark, units = 'metric' }) {
  const Item = ({ label, value }) => (
    <View style={[styles.item, isDark && styles.itemDark]}>
      <Text style={[styles.label, isDark && styles.darkText]}>{label}</Text>
      <Text style={[styles.value, isDark && styles.valueDark]}>{value}</Text>
    </View>
  );
  return (
    <View style={styles.row}>
      <Item label="Osjećaj" value={`${Math.round(feelsLike)}°${units === 'imperial' ? 'F' : 'C'}`} />
      <Item label="Vlažnost" value={`${humidity}%`} />
      <Item label="Vjetar" value={`${wind} m/s`} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, marginTop: 14 },
  item: { 
    flex: 1, 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(94,225,255,0.2)',
  },
  itemDark: { 
    backgroundColor: '#151B2D',
    borderColor: 'rgba(94,225,255,0.15)',
  },
  label: { 
    color: '#6B7280', 
    marginBottom: 4, 
    fontFamily: 'Nunito_400Regular' 
  },
  darkText: { 
    color: '#B8C0CC' 
  },
  value: {
    color: '#2B3A55', 
    fontFamily: 'Nunito_700Bold' 
  },
  valueDark: { 
    color: '#E8E6E3', 
    fontFamily: 'Nunito_700Bold' 
  },
});


