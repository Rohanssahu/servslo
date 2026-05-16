import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import ScreenNameEnum from '../../routes/screenName.enum';

const {width: W} = Dimensions.get('window');

function BounceDots() {
  const d1 = useRef(new Animated.Value(0)).current;
  const d2 = useRef(new Animated.Value(0)).current;
  const d3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -10,
            duration: 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.delay(Math.max(0, 600 - delay)),
        ]),
      ).start();
    };

    animateDot(d1, 0);
    animateDot(d2, 160);
    animateDot(d3, 320);
  }, [d1, d2, d3]);

  return (
    <View style={styles.dotsRow}>
      {([d1, d2, d3] as Animated.Value[]).map((d, i) => (
        <Animated.View key={i} style={[styles.dot, {transform: [{translateY: d}]}]} />
      ))}
    </View>
  );
}

export default function Splash() {
  const navigation = useNavigation<any>();

  const logoScale = useRef(new Animated.Value(0.35)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineY = useRef(new Animated.Value(22)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;
  const ring1Opacity = useRef(new Animated.Value(0)).current;
  const ring1Scale = useRef(new Animated.Value(0.55)).current;
  const ring2Opacity = useRef(new Animated.Value(0)).current;
  const ring2Scale = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // Decorative rings bloom behind the logo
    Animated.parallel([
      Animated.timing(ring1Scale, {toValue: 1, duration: 1200, useNativeDriver: true}),
      Animated.timing(ring1Opacity, {toValue: 1, duration: 900, useNativeDriver: true}),
      Animated.timing(ring2Scale, {toValue: 1, duration: 1600, useNativeDriver: true}),
      Animated.timing(ring2Opacity, {toValue: 1, duration: 1200, useNativeDriver: true}),
    ]).start();

    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 55,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 520,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(80),
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 440,
          useNativeDriver: true,
        }),
        Animated.spring(taglineY, {
          toValue: 0,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(80),
      Animated.timing(dotsOpacity, {
        toValue: 1,
        duration: 360,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => navigation.navigate(ScreenNameEnum.LocationFetcher), 900);
    });
  }, []);

  return (
    <LinearGradient
      colors={['#9B6FFF', '#623bea', '#3B1FAB']}
      start={{x: 0.15, y: 0}}
      end={{x: 0.85, y: 1}}
      style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Decorative translucent rings */}
      <Animated.View
        style={[
          styles.ring,
          styles.ring1,
          {opacity: ring1Opacity, transform: [{scale: ring1Scale}]},
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          styles.ring2,
          {opacity: ring2Opacity, transform: [{scale: ring2Scale}]},
        ]}
      />

      {/* Logo + brand name */}
      <Animated.View
        style={[
          styles.logoSection,
          {opacity: logoOpacity, transform: [{scale: logoScale}]},
        ]}>
        <View style={styles.logoCircle}>
          <LinearGradient
            colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0.07)']}
            style={StyleSheet.absoluteFill}
            borderRadius={60}
          />
          <Text style={styles.logoInitial}>S</Text>
        </View>
        <Text style={styles.logoText}>ServsLO</Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.Text
        style={[
          styles.tagline,
          {opacity: taglineOpacity, transform: [{translateY: taglineY}]},
        ]}>
        Home Services, Made Simple
      </Animated.Text>

      {/* Loading indicator */}
      <Animated.View style={[styles.dotsWrapper, {opacity: dotsOpacity}]}>
        <BounceDots />
      </Animated.View>

      {/* Bottom label */}
      <View style={styles.bottomLabel}>
        <Text style={styles.bottomText}>🇮🇳  Made for India</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderStyle: 'solid',
    alignSelf: 'center',
  },
  ring1: {
    width: W * 1.15,
    height: W * 1.15,
    borderRadius: W * 0.575,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.13)',
    top: -W * 0.28,
  },
  ring2: {
    width: W * 0.9,
    height: W * 0.9,
    borderRadius: W * 0.45,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    bottom: -W * 0.18,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 22,
  },
  logoCircle: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: 'rgba(255,255,255,0.17)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.28)',
    overflow: 'hidden',
  },
  logoInitial: {
    fontSize: 56,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -2,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 6,
  },
  logoText: {
    fontSize: 44,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1.8,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 8,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.78)',
    letterSpacing: 0.5,
    marginBottom: 52,
  },
  dotsWrapper: {
    marginTop: 4,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 9,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
  bottomLabel: {
    position: 'absolute',
    bottom: 42,
  },
  bottomText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.4,
  },
});
