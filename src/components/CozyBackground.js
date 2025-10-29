import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function CozyBackground({ colors = ['#EDEAE3', '#E2E8F0'] }) {
  const cloud1 = useRef(new Animated.Value(0)).current;
  const cloud2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const useDriver = Platform.OS !== 'web';
    Animated.loop(Animated.timing(cloud1, { toValue: 1, duration: 18000, easing: Easing.linear, useNativeDriver: useDriver })).start();
    Animated.loop(Animated.timing(cloud2, { toValue: 1, duration: 24000, easing: Easing.linear, useNativeDriver: useDriver })).start();
  }, [cloud1, cloud2]);

  const t1 = cloud1.interpolate({ inputRange: [0,1], outputRange: [-60, width] });
  const t2 = cloud2.interpolate({ inputRange: [0,1], outputRange: [width, -60] });

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors[0] }]} />
      <Animated.View style={[styles.cloud, { transform: [{ translateX: t1 }], top: height*0.15, backgroundColor: colors[1]+'66' }]} />
      <Animated.View style={[styles.cloud, { transform: [{ translateX: t2 }], top: height*0.35, backgroundColor: colors[1]+'55' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  cloud: {
    position: 'absolute',
    width: 160,
    height: 90,
    borderRadius: 60,
    opacity: 0.6,
  },
});


