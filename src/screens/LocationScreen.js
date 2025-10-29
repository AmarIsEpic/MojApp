import * as Location from 'expo-location';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';

export default function LocationScreen() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiKey = 'ed0604f6922da175d2395178306397bd';
  const { setAccentFromWeather, units, isDark } = useContext(ThemeContext);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Greška', 'Dozvola za pristup lokaciji je odbijena.');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}&lang=hr`
        );
        const data = await response.json();
        setWeather(data);
        try {
          const condition = data?.weather?.[0]?.main || data?.weather?.[0]?.description;
          setAccentFromWeather(condition);
        } catch {}
      } catch (error) {
        console.error('Greška pri dohvaćanju vremena:', error);
        Alert.alert('Greška', 'Neuspješno dohvaćanje vremenskih podataka.');
      } finally {
        setLoading(false);
      }
    })();
  }, [units]);

  if (loading) {
    return (
      <View style={[styles.center, isDark ? styles.containerDark : styles.containerLight]}>
        <ActivityIndicator size="large" color="#5EE1FF" />
        <Text style={[styles.loadingText, isDark ? styles.textSecondaryDark : styles.textSecondaryLight]}>
          Dohvaćam lokaciju...
        </Text>
      </View>
    );
  }

  if (!weather || !weather.main) {
    return (
      <View style={[styles.center, isDark ? styles.containerDark : styles.containerLight]}>
        <Text style={[styles.errorText, isDark ? styles.errorTextDark : styles.errorTextLight]}>
          Neuspješno dohvaćanje podataka o vremenu.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <Text style={[styles.title, isDark ? styles.textDark : styles.textLight]}>
        Vrijeme na tvojoj lokaciji
      </Text>
      <Text style={[styles.city, isDark ? styles.textDark : styles.textLight]}>{weather.name}</Text>

      <View style={[styles.hero, isDark ? styles.heroDark : styles.heroLight]}>
        <Image
          source={{ uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png` }}
          style={{ width: 150, height: 150 }}
        />
        <Text style={[styles.temp, isDark ? styles.tempDark : styles.tempLight]}>
          {Math.round(weather.main.temp)}°{units === 'imperial' ? 'F' : 'C'}
        </Text>
        <Text style={[styles.desc, isDark ? styles.textSecondaryDark : styles.textSecondaryLight]}>
          {weather.weather[0].description}
        </Text>
      </View>

      <View style={[styles.infoBox, isDark ? styles.infoBoxDark : styles.infoBoxLight]}>
        <View style={styles.row}>
          <Text style={[styles.label, isDark ? styles.labelDark : styles.labelLight]}>Osjećaj</Text>
          <Text style={[styles.value, isDark ? styles.valueDark : styles.valueLight]}>
            {Math.round(weather.main.feels_like)}°{units === 'imperial' ? 'F' : 'C'}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, isDark ? styles.labelDark : styles.labelLight]}>Vlažnost</Text>
          <Text style={[styles.value, isDark ? styles.valueDark : styles.valueLight]}>
            {weather.main.humidity}%
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, isDark ? styles.labelDark : styles.labelLight]}>Pritisak</Text>
          <Text style={[styles.value, isDark ? styles.valueDark : styles.valueLight]}>
            {weather.main.pressure} hPa
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, isDark ? styles.labelDark : styles.labelLight]}>Vjetar</Text>
          <Text style={[styles.value, isDark ? styles.valueDark : styles.valueLight]}>
            {weather.wind.speed} m/s
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 10,
    fontFamily: 'Nunito_800ExtraBold',
  },
  textDark: {
    color: '#E6EDF3',
  },
  textLight: {
    color: '#0B0F14',
  },
  city: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Nunito_700Bold',
  },
  hero: {
    marginTop: 8,
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  heroDark: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(94,225,255,0.12)',
  },
  heroLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(94,225,255,0.3)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  temp: {
    fontSize: 56,
    fontWeight: 'bold',
    fontFamily: 'Quicksand_600SemiBold',
  },
  tempDark: {
    color: '#5EE1FF',
  },
  tempLight: {
    color: '#0B0F14',
  },
  desc: {
    fontSize: 18,
    marginBottom: 10,
    textTransform: 'capitalize',
    fontFamily: 'Nunito_400Regular',
  },
  textSecondaryDark: {
    color: '#B8C4CF',
  },
  textSecondaryLight: {
    color: '#6B7280',
  },
  infoBox: {
    width: '100%',
    marginTop: 16,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
  },
  infoBoxDark: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(125,92,255,0.15)',
  },
  infoBoxLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(94,225,255,0.3)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  label: {
    fontFamily: 'Nunito_400Regular',
  },
  labelDark: {
    color: '#B8C4CF',
  },
  labelLight: {
    color: '#6B7280',
  },
  value: {
    fontWeight: '600',
    fontFamily: 'Quicksand_600SemiBold',
  },
  valueDark: {
    color: '#E6EDF3',
  },
  valueLight: {
    color: '#0B0F14',
  },
  loadingText: {
    marginTop: 10,
    fontFamily: 'Nunito_400Regular',
  },
  errorText: {
    fontFamily: 'Nunito_700Bold',
  },
  errorTextDark: {
    color: '#FF7D7D',
  },
  errorTextLight: {
    color: '#E63946',
  },
});
