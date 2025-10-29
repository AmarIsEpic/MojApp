import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text } from 'react-native';
import { iconForCondition } from '../theme/cozyTheme';

export default function CurrentWeatherCard({ temp, condition, isDark, units = 'metric' }) {
  const scale = useRef(new Animated.Value(0.95)).current;
  useEffect(() => {
    Animated.timing(scale, { toValue: 1, duration: 450, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, [temp]);

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }, isDark && styles.cardDark]}>
      <MaterialCommunityIcons name={iconForCondition(condition)} size={56} color={isDark ? '#FFB070' : '#1F2937'} />
      <Text style={[styles.temp, isDark && { color: '#E8E6E3' }]}>{Math.round(temp)}°{units==='imperial' ? 'F' : 'C'}</Text>
      <Text style={[styles.cond, isDark && { color: '#B8C0CC' }]}>{condition}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
  },
  cardDark: { backgroundColor: '#151B2D' },
  temp: { 
    fontSize: 72, 
    color: '#2B3A55', 
    marginTop: 8, 
    fontFamily: 'Quicksand_600SemiBold' 
  },
  cond: { 
    marginTop: 4, 
    color: '#6B7280', 
    textTransform: 'capitalize', 
    fontFamily: 'Nunito_400Regular' 
  },
});


