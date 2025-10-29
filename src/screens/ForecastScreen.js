import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

export default function ForecastScreen({ route }) {
  const { city, apiKey } = route.params;
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}&lang=hr`
        );
        const data = await response.json();
        setForecast(data.list.slice(0, 5));
      } catch (error) {
        console.error('Greška prilikom dohvaćanja prognoze:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>5-dnevna prognoza za {city}</Text>
      <FlatList
        data={forecast}
        keyExtractor={(_item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.time}>{item.dt_txt}</Text>
              <Text style={styles.desc}>{item.weather[0].description}</Text>
            </View>
            <Text style={styles.temp}>{Math.round(item.main.temp)}°C</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0B0F14',
    },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B0F14',
    },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#E6EDF3',
    },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(94,225,255,0.12)'
  },
  time: {
    fontWeight: 'bold',
    color: '#E6EDF3',
  },
  desc: {
    color: '#B8C4CF',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  temp: {
    color: '#5EE1FF',
    fontWeight: '700',
    fontSize: 18,
  }
});