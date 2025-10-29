import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext, useEffect, useState, useRef } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View, Animated, Easing } from 'react-native';
import { getWeather } from '../api/weatherApi';
import { FavoritesContext } from '../context/FavoritesContext';
import { ThemeContext } from '../theme/ThemeContext';
import { iconForCondition } from '../theme/cozyTheme';

const FavoriteCityCard = ({ cityName, weather, onPress, onRemove, isDark, units }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.95);
    Animated.parallel([
      Animated.timing(fadeAnim, { 
        toValue: 1, 
        duration: 400, 
        easing: Easing.out(Easing.quad), 
        useNativeDriver: true 
      }),
      Animated.timing(scaleAnim, { 
        toValue: 1, 
        duration: 400, 
        easing: Easing.out(Easing.quad), 
        useNativeDriver: true 
      }),
    ]).start();
  }, [weather?.dt]);

  if (!weather || !weather.main) {
    return (
      <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight, styles.errorCard]}>
        <Text style={[styles.errorText, isDark ? styles.textSecondaryDark : styles.textSecondaryLight]}>
          Nema podataka za {cityName}
        </Text>
      </View>
    );
  }

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }], marginBottom: 16 }}>
      <Pressable
        style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}
        onPress={onPress}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.cityName, isDark ? styles.textDark : styles.textLight]} numberOfLines={1}>
            {cityName}
          </Text>
          <Pressable 
            onPress={(e) => { 
              e.stopPropagation(); 
              onRemove(cityName); 
            }} 
            style={styles.heartBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="heart" size={22} color="#FF7D7D" />
          </Pressable>
        </View>
        <View style={styles.weatherContent}>
          <View style={styles.iconTempRow}>
            <MaterialCommunityIcons 
              name={iconForCondition(weather.weather?.[0]?.description || '')} 
              size={48} 
              color={isDark ? '#FFB070' : '#374151'} 
            />
            <View style={styles.tempWrap}>
              <Text style={[styles.temp, isDark ? styles.tempDark : styles.tempLight]}>
                {Math.round(weather.main.temp)}
              </Text>
              <Text style={[styles.unit, isDark ? styles.unitDark : styles.unitLight]}>
                °{units === 'imperial' ? 'F' : 'C'}
              </Text>
            </View>
          </View>
          <Text 
            style={[styles.description, isDark ? styles.descDark : styles.descLight]} 
            numberOfLines={1}
          >
            {weather.weather?.[0]?.description || 'N/A'}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default function FavoritesScreen({ navigation }) {
  const { favorites, removeFavorite } = useContext(FavoritesContext);
  const { isDark, units } = useContext(ThemeContext);
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFavoriteWeather = async () => {
    if (favorites.length === 0) {
      setWeatherData([]);
      return;
    }
    setLoading(true);
    try {
      const data = await Promise.all(
        favorites.map(async (city) => {
          try {
            const weather = await getWeather(city, units);
            if (weather && Number(weather.cod) === 200) {
              return { city, weather };
            }
          } catch {}
          return null;
        })
      );
      setWeatherData(data.filter(item => item !== null));
    } catch (error) {
      console.error('Error fetching favorite weather:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteWeather();
  }, [favorites, units]);

  const handleCardPress = (item) => {
    if (item.weather) {
      navigation.navigate('detalji', { weather: item.weather });
    }
  };

  if (loading && weatherData.length === 0) {
    return (
      <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight, styles.center]}>
        <ActivityIndicator size="large" color="#5EE1FF" />
        <Text style={[styles.loadingText, isDark ? styles.textDark : styles.textLight]}>Učitavanje...</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight, styles.center]}>
        <Ionicons name="heart-outline" size={64} color={isDark ? '#5EE1FF' : '#8AB4F8'} />
        <Text style={[styles.emptyText, isDark ? styles.textDark : styles.textLight]}>Nema omiljenih gradova</Text>
        <Text style={[styles.emptySubtext, isDark ? styles.textSecondaryDark : styles.textSecondaryLight]}>
          Dodaj gradove iz početne stranice
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <FlatList
        data={weatherData}
        keyExtractor={(item) => item.city}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <FavoriteCityCard
            cityName={item.city}
            weather={item.weather}
            onPress={() => handleCardPress(item)}
            onRemove={removeFavorite}
            isDark={isDark}
            units={units}
          />
        )}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={[styles.title, isDark ? styles.textDark : styles.textLight]}>Omiljeni gradovi</Text>
            <Text style={[styles.subtitle, isDark ? styles.textSecondaryDark : styles.textSecondaryLight]}>
              {favorites.length} {favorites.length === 1 ? 'grad' : 'gradova'}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerDark: {
    backgroundColor: '#0B0F14',
  },
  containerLight: {
    backgroundColor: '#F7F9FC',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Nunito_800ExtraBold',
  },
  textDark: {
    color: '#E6EDF3',
  },
  textLight: {
    color: '#0B0F14',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  textSecondaryDark: {
    color: '#B8C4CF',
  },
  textSecondaryLight: {
    color: '#6B7280',
  },
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    width: '100%',
    minHeight: 140,
  },
  cardDark: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(94,225,255,0.2)',
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  errorCard: {
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cityName: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
    flex: 1,
    marginRight: 8,
  },
  heartBtn: {
    padding: 6,
    borderRadius: 20,
  },
  weatherContent: {
    alignItems: 'center',
  },
  iconTempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  tempWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 16,
  },
  temp: {
    fontSize: 42,
    fontWeight: 'bold',
    fontFamily: 'Quicksand_600SemiBold',
    lineHeight: 48,
  },
  tempDark: {
    color: '#5EE1FF',
  },
  tempLight: {
    color: '#0B0F14',
  },
  unit: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 6,
    fontFamily: 'Quicksand_600SemiBold',
  },
  unitDark: {
    color: '#5EE1FF',
  },
  unitLight: {
    color: '#0B0F14',
  },
  description: {
    fontSize: 15,
    textTransform: 'capitalize',
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
  },
  descDark: {
    color: '#B8C4CF',
  },
  descLight: {
    color: '#6B7280',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    fontFamily: 'Nunito_700Bold',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    fontFamily: 'Nunito_400Regular',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
});