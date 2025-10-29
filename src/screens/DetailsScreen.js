import { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';

export default function DetailsScreen({ route }) {
  const { weather } = route.params;
  const { isDark, units } = useContext(ThemeContext);

  const DetailCard = ({ label, value }) => (
    <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
      <Text style={[styles.label, isDark ? styles.labelDark : styles.labelLight]}>{label}</Text>
      <Text style={[styles.value, isDark ? styles.valueDark : styles.valueLight]}>{value}</Text>
    </View>
  );

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <Text style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}>Detalji za {weather.name}</Text>
      <View style={styles.grid}>
        <DetailCard 
          label="Temp" 
          value={`${Math.round(weather.main.temp)}°${units === 'imperial' ? 'F' : 'C'}`} 
        />
        <DetailCard 
          label="Osjećaj" 
          value={`${Math.round(weather.main.feels_like)}°${units === 'imperial' ? 'F' : 'C'}`} 
        />
        <DetailCard label="Vlažnost" value={`${weather.main.humidity}%`} />
        <DetailCard label="Pritisak" value={`${weather.main.pressure} hPa`} />
        <DetailCard label="Vjetar" value={`${weather.wind.speed} m/s`} />
        <DetailCard 
          label="Min/Max" 
          value={`${Math.round(weather.main.temp_min)}° / ${Math.round(weather.main.temp_max)}°`} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: 20,
  },
  containerDark: {
    backgroundColor: '#0B0F14',
  },
  containerLight: {
    backgroundColor: '#F7F9FC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Nunito_800ExtraBold',
  },
  titleDark: {
    color: '#E6EDF3',
  },
  titleLight: {
    color: '#0B0F14',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  cardDark: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(125,92,255,0.15)',
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(94,225,255,0.3)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  label: {
    marginBottom: 6,
    fontFamily: 'Nunito_400Regular',
  },
  labelDark: {
    color: '#B8C4CF',
  },
  labelLight: {
    color: '#6B7280',
  },
  value: {
    fontWeight: '700',
    fontSize: 18,
    fontFamily: 'Quicksand_600SemiBold',
  },
  valueDark: {
    color: '#5EE1FF',
  },
  valueLight: {
    color: '#0B0F14',
  },
});
