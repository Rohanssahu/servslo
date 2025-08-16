import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  BackHandler,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { color } from '../../constant';

type Props = {
  visible: boolean;
  onFinished: () => void;          // navigate to Home or whatever
  durationMs?: number;             // default 3000 (3s)
  title?: string;                  // optional custom title
};

const BookingConfirmationModal: React.FC<Props> = ({
  visible,
  onFinished,
  durationMs = 3000,
  title = 'Processing your booking…',
}) => {
  const progress = useRef(new Animated.Value(0)).current; // 0 → 1
  const scaleOK = useRef(new Animated.Value(0)).current;
  const [confirmed, setConfirmed] = useState(false);
  const [countdown, setCountdown] = useState(Math.ceil(durationMs / 1000));

  // Disable HW back press while visible
  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, [visible]);

  // Drive progress + countdown
  useEffect(() => {
    if (!visible) return;
    setConfirmed(false);
    setCountdown(Math.ceil(durationMs / 1000));
    progress.setValue(0);
    scaleOK.setValue(0);

    // progress anim
    Animated.timing(progress, {
      toValue: 1,
      duration: durationMs,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (!finished) return;
      setConfirmed(true);
      // pop-in check animation
      Animated.spring(scaleOK, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }).start();

      // small delay to let user see confirmation
      const t = setTimeout(onFinished, 900);
      return () => clearTimeout(t);
    });

    // countdown timer
    const tick = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(tick);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => {
      clearInterval(tick);
      progress.stopAnimation();
    };
  }, [visible, durationMs, onFinished]);

  // Interpolations
  const ringBorder = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['#6E39F7', '#13B36B'], // purple → green
  });

  const fillBg = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(19,179,107,0.0)', 'rgba(19,179,107,0.15)'], // subtle fill
  });

  // A faux circular progress using stroke “gap” trick:
  // we animate a gradient bar overlay width to simulate a sweep.
  const sweepWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const showCountdown = !confirmed && countdown > 0;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Header */}
          <Text style={styles.title}>
            {confirmed ? 'Booking confirmed' : title}
          </Text>

          {/* Loader / Result */}
          <View style={styles.loaderWrap}>
            {/* Outer ring */}
            <Animated.View style={[styles.ring, { borderColor: ringBorder, backgroundColor: fillBg }]}>
              {/* Gradient sweep overlay */}
              {!confirmed && (
                <View style={styles.sweepClip}>
                  <Animated.View style={[styles.sweepProgress, { width: sweepWidth }]}>
                    <LinearGradient
                      colors={['#6E39F7', '#8E57FF', '#B78CFF']}
                      start={{ x: 0.1, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />
                  </Animated.View>
                </View>
              )}

              {/* Center content */}
              {confirmed ? (
                <Animated.View style={{ transform: [{ scale: scaleOK }] }}>
                  <Ionicons name="checkmark-circle" size={72} color="#13B36B" />
                </Animated.View>
              ) : (
                <View style={styles.centerStack}>
                  <LinearGradient
                    colors={['#6E39F7', '#8E57FF', '#B78CFF']}
                    start={{ x: 0.1, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.dot}
                  />
                </View>
              )}
            </Animated.View>

            {/* Countdown text */}
            {showCountdown && (
              <Text style={styles.countText}>{countdown}s</Text>
            )}
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            {confirmed ? 'Your service is placed successfully.' : 'Please wait while we confirm your booking'}
          </Text>

          {/* Optional Manual Close when confirmed (hidden until confirmed) */}
          {confirmed && (
            <TouchableOpacity onPress={onFinished} style={styles.cta}>
              <LinearGradient
                colors={['#6E39F7', '#8E57FF', '#B78CFF']}
                start={{ x: 0.1, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaBg}
              >
                <Text style={styles.ctaText}>Go to Home</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default BookingConfirmationModal;

const CARD_SIZE = 180;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(4, 7, 20, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sheet: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: color.purple,
    marginBottom: 12,
  },
  loaderWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  ring: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: CARD_SIZE / 2,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  sweepClip: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0,
    width: '100%',
    overflow: 'hidden',
    borderRadius: CARD_SIZE / 2,
  },
  sweepProgress: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0,
  },
  centerStack: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  countText: {
    marginTop: 10,
    fontSize: 22,
    color: color.purple,
    fontWeight: '600',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 18,
    color: '#6b6b6b',
    textAlign: 'center',
  },
  cta: { width: '100%', marginTop: 16 },
  ctaBg: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
