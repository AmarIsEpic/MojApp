import { FlatList, Image, StyleSheet, Text, View } from 'react-native';

export default function HourlyForecast({ list = [], isDark, units = 'metric' }) {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={[styles.title, isDark && { color: '#E8E6E3' }]}>Po satima</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={list.slice(0, 12)}
        keyExtractor={(item) => String(item.dt)}
        renderItem={({ item }) => {
          const time = item.dt_txt.split(' ')[1].slice(0, 5);
          const icon = `https://openweathermap.org/img/wn/${item.weather?.[0]?.icon}.png`;
          return (
            <View style={[styles.card, isDark && styles.cardDark]}>
              <Text style={[styles.time, isDark && { color: '#B8C0CC' }]}>{time}</Text>
              <Image source={{ uri: icon }} style={{ width: 36, height: 36 }} />
              <Text style={[styles.temp, isDark && { color: '#E8E6E3' }]}>{Math.round(item.main.temp)}°{units==='imperial' ? 'F' : ''}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { 
    color: '#2B3A55',
    marginBottom: 8, 
    fontFamily: 'Nunito_700Bold' 
  },
  card: {
    backgroundColor: '#FFF', 
    padding: 10, 
    borderRadius: 14, 
    marginRight: 10, 
    alignItems: 'center', 
    width: 80 
  },
  cardDark: {
    backgroundColor: '#151B2D' 
  },
  time: {
    color: '#6B7280',
    marginBottom: 6,
    fontFamily: 'Nunito_400Regular' 
  },
  temp: { 
    color: '#2B3A55',
    marginTop: 6,
    fontFamily: 'Nunito_700Bold' 
  },
});


