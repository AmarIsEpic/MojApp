import { StyleSheet, Text, View } from 'react-native';

export default function WeatherHeader({ city, isDark = false }) {
  const date = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  return (
    <View style={styles.container}>
      <Text style={[styles.city, isDark ? styles.cityDark : styles.cityLight]} numberOfLines={1}>{city}</Text>
      <Text style={[styles.date, isDark ? styles.dateDark : styles.dateLight]}>{date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    width: '100%', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  city: { 
    fontSize: 28, 
    fontFamily: 'Nunito_800ExtraBold' 
  },
  cityLight: { 
    color: '#2B3A55' 
  },
  cityDark: { 
    color: '#E6EDF3' 
  },
  date: { 
    
    marginTop: 4, 
    fontFamily: 'Nunito_400Regular' 
  },
  dateLight: { 
    color: '#6B7280' 
  },
  dateDark: { 
    color: '#B8C4CF'
   },
});


