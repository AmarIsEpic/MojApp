import React, { useContext, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';

export default function AnimatedBackground({ accent = '#5EE1FF' }) {
  const { backgroundAnimation } = useContext(ThemeContext);
  const a1 = useRef(new Animated.Value(0)).current;
  const a2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!backgroundAnimation) return;
    
    const loop = () => {
      Animated.loop(
        Animated.parallel([
          Animated.timing(a1, { toValue: 1, duration: 8000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(a2, { toValue: 1, duration: 10000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ])
      ).start();
    };
    loop();
  }, [a1, a2, backgroundAnimation]);

  const t1 = a1.interpolate({ inputRange: [0, 1], outputRange: [-30, 30] });
  const t2 = a2.interpolate({ inputRange: [0, 1], outputRange: [30, -30] });

  if (!backgroundAnimation) {
    return null;
  }

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.blob, { backgroundColor: accent + '22', transform: [{ translateX: t1 }, { translateY: t2 }] }]} />
      <Animated.View style={[styles.blob, { backgroundColor: accent + '18', transform: [{ translateX: t2 }, { translateY: t1 }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 300,
    top: -60,
    right: -60,
  },
});


