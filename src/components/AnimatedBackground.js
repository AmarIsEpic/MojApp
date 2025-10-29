import React, { useContext, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, Platform } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';

export default function AnimatedBackground({ accent = '#5EE1FF' }) {
  const { backgroundAnimation } = useContext(ThemeContext);
  const a1 = useRef(new Animated.Value(0)).current;
  const a2 = useRef(new Animated.Value(0)).current;
  const s1 = useRef(new Animated.Value(0)).current;
  const s2 = useRef(new Animated.Value(0)).current;
  const a3 = useRef(new Animated.Value(0)).current;
  const s3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!backgroundAnimation) return;

    const useDriver = Platform.OS !== 'web';

    a1.setValue(0); a2.setValue(0); a3.setValue(0);
    s1.setValue(0); s2.setValue(0); s3.setValue(0);

    const loop = () => {
      Animated.loop(
        Animated.parallel([
          Animated.timing(a1, { toValue: 1, duration: 14000, easing: Easing.inOut(Easing.quad), useNativeDriver: useDriver }),
          Animated.timing(a2, { toValue: 1, duration: 16000, easing: Easing.inOut(Easing.quad), useNativeDriver: useDriver }),
          Animated.timing(a3, { toValue: 1, duration: 18000, easing: Easing.inOut(Easing.quad), useNativeDriver: useDriver }),
          Animated.sequence([
            Animated.timing(s1, { toValue: 1, duration: 7000, easing: Easing.inOut(Easing.quad), useNativeDriver: useDriver }),
            Animated.timing(s1, { toValue: 0, duration: 7000, easing: Easing.inOut(Easing.quad), useNativeDriver: useDriver }),
          ]),
          Animated.sequence([
            Animated.timing(s2, { toValue: 1, duration: 8000, easing: Easing.inOut(Easing.quad), useNativeDriver: useDriver }),
            Animated.timing(s2, { toValue: 0, duration: 8000, easing: Easing.inOut(Easing.quad), useNativeDriver: useDriver }),
          ]),
          Animated.sequence([
            Animated.timing(s3, { toValue: 1, duration: 9000, easing: Easing.inOut(Easing.quad), useNativeDriver: useDriver }),
            Animated.timing(s3, { toValue: 0, duration: 9000, easing: Easing.inOut(Easing.quad), useNativeDriver: useDriver }),
          ]),
        ])
      ).start();
    };
    loop();
  }, [a1, a2, a3, s1, s2, s3, backgroundAnimation]);

  const t1 = a1.interpolate({ inputRange: [0, 1], outputRange: [-40, 40] });
  const t2 = a2.interpolate({ inputRange: [0, 1], outputRange: [40, -40] });
  const t3 = a3.interpolate({ inputRange: [0, 1], outputRange: [0, 20] });

  const scale1 = s1.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const scale2 = s2.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });
  const scale3 = s3.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] });

  if (!backgroundAnimation) {
    return null;
  }

  const { isDark } = useContext(ThemeContext);
  const lightTone1 = 'rgba(255, 247, 214, 0.55)';
  const lightTone2 = 'rgba(255, 236, 179, 0.45)';
  const darkTone1 = accent + '33';
  const darkTone2 = accent + '22';

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.blobLarge, { backgroundColor: isDark ? darkTone1 : lightTone1, transform: [{ translateX: t1 }, { translateY: t2 }, { scale: scale1 }] }]} />
      <Animated.View style={[styles.blob, { backgroundColor: isDark ? darkTone2 : lightTone2, transform: [{ translateX: t2 }, { translateY: t3 }, { scale: scale2 }] }]} />
      <Animated.View style={[styles.blobSm, { backgroundColor: isDark ? darkTone2 : lightTone2, transform: [{ translateX: t3 }, { translateY: t1 }, { scale: scale3 }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  blobLarge: {
    position: 'absolute',
    width: 520,
    height: 520,
    borderRadius: 520,
    top: -120,
    right: -120,
    filter: 'blur(24px)',
  },
  blob: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 360,
    top: -80,
    right: -20,
    filter: 'blur(18px)'
  },
  blobSm: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 220,
    top: 60,
    right: -40,
    filter: 'blur(14px)'
  },
});


