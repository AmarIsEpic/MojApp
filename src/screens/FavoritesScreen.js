import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View, Animated, Easing } from 'react-native';
import { getWeather } from '../api/weatherApi';
import { FavoritesContext } from '../context/FavoritesContext';
import { ThemeContext } from '../theme/ThemeContext';

const FavoriteCard = ({ item, onPress, onRemove, isDark, units, styles }) => {
    const fade = useRef(new Animated.Value(0)).current;
    const lift = useRef(new Animated.Value(6)).current;
    useEffect(() => {
        fade.setValue(0);
        lift.setValue(6);
        Animated.parallel([
            Animated.timing(fade, { toValue: 1, duration: 350, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            Animated.timing(lift, { toValue: 0, duration: 350, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ]).start();
    }, [item?.city, item?.weather?.dt]);
    return (
    <Animated.View style={{ opacity: fade, transform: [{ translateY: lift }] }}>
      <Pressable
          style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}
          onPress={onPress}
      >
        <View style={styles.cardContent}>
          <View style={styles.leftSection}>
                <View style={styles.headerRow}>
                    <Text style={[styles.cityName, isDark ? styles.textDark : styles.textLight]}>
                        {item.city}
                    </Text>
                    <Pressable
                        style={styles.heartButton}
                        onPress={() => onRemove(item.city)}
                    >
                        <Ionicons name="heart" size={22} color="#FF7D7D" />
                    </Pressable>
                </View>
                
                {item.weather && item.weather.main && (
                    <View style={styles.weatherRow}>
                        <Text style={[styles.temp, isDark ? styles.tempDark : styles.tempLight]}>
                            {Math.round(item.weather.main.temp)}°
                        </Text>
                        <Text style={[styles.unitLabel, isDark ? styles.textSecondaryDark : styles.textSecondaryLight]}>
                            {units === 'imperial' ? 'F' : 'C'}
                        </Text>
                        {item.weather.weather && item.weather.weather[0] && (
                            <View style={styles.conditionRow}>
                                <Image
                                    source={{
                                        uri: `https://openweathermap.org/img/wn/${item.weather.weather[0].icon}@2x.png`,
                                    }}
                                    style={{ width: 40, height: 40 }}
                                />
                                <Text style={[styles.condition, isDark ? styles.textSecondaryDark : styles.textSecondaryLight]}>
                                    {item.weather.weather[0].description}
                                </Text>
                            </View>
                        )}
                    </View>
                )}
                
                {item.weather && item.weather.main && (
                    <View style={[styles.detailsRow, { borderTopColor: isDark ? 'rgba(138, 180, 248, 0.15)' : 'rgba(94, 225, 255, 0.2)' }]}>
                        <View style={styles.detailItem}>
                            <Ionicons name="water" size={16} color={isDark ? '#5EE1FF' : '#8AB4F8'} />
                            <Text style={[styles.detailText, isDark ? styles.textSecondaryDark : styles.textSecondaryLight]}>
                                {item.weather.main.humidity}%
                            </Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="speedometer" size={16} color={isDark ? '#5EE1FF' : '#8AB4F8'} />
                            <Text style={[styles.detailText, isDark ? styles.textSecondaryDark : styles.textSecondaryLight]}>
                                {item.weather.main.pressure} hPa
                            </Text>
                        </View>
                    </View>
                )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
    );
};

export default function FavoritesScreen({ navigation }) {
    const { favorites, removeFavorite, addFavorite, isFavorite } = useContext(FavoritesContext);
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
                    const weather = await getWeather(city, units);
                    return { city, weather };
                })
            );
            setWeatherData(data.filter((item) => item.weather && !item.weather.cod));
        } catch (error) {
            console.error('Error fetching favorite weather:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavoriteWeather();
    }, [favorites, units]);

    const handleRemoveFavorite = (city) => {
        removeFavorite(city);
    };

    const handleFavoritePress = (item) => {
        if (item.weather && item.weather.main) {
            navigation.navigate('detalji', { weather: item.weather });
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
                <ActivityIndicator size="large" color="#5EE1FF" />
                <Text style={[styles.loadingText, isDark ? styles.textDark : styles.textLight]}>
                    Učitavanje...
                </Text>
            </View>
        );
    }

    if (favorites.length === 0) {
        return (
            <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight, styles.center]}>
                <Ionicons name="heart-outline" size={64} color={isDark ? '#5EE1FF' : '#8AB4F8'} />
                <Text style={[styles.emptyText, isDark ? styles.textDark : styles.textLight]}>
                    Nema omiljenih gradova
                </Text>
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
                    <FavoriteCard
                        item={item}
                        onPress={() => handleFavoritePress(item)}
                        onRemove={handleRemoveFavorite}
                        isDark={isDark}
                        units={units}
                        styles={styles}
                    />
                )}
                ListHeaderComponent={() => (
                    <View style={styles.header}>
                        <Text style={[styles.title, isDark ? styles.textDark : styles.textLight]}>
                            Omiljeni gradovi
                        </Text>
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
        gap: 12,
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
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        transitionProperty: 'transform, box-shadow',
        transitionDuration: '160ms',
    },
    cardDark: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderColor: 'rgba(94,225,255,0.2)',
    },
    cardLight: {
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(0,0,0,0.08)',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },
    cardContent: {
        width: '100%',
    },
    leftSection: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cityName: {
        fontSize: 22,
        fontWeight: '700',
        fontFamily: 'Nunito_700Bold',
        flex: 1,
    },
    heartButton: {
        padding: 4,
        marginLeft: 8,
    },
    weatherRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    temp: {
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: 'Quicksand_600SemiBold',
    },
    tempDark: {
        color: '#5EE1FF',
    },
    tempLight: {
        color: '#0B0F14',
    },
    unitLabel: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 4,
        fontFamily: 'Quicksand_600SemiBold',
    },
    conditionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
    },
    condition: {
        fontSize: 14,
        textTransform: 'capitalize',
        marginLeft: 6,
        fontFamily: 'Nunito_400Regular',
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        gap: 20,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        fontSize: 13,
        fontFamily: 'Nunito_400Regular',
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
    },
});
