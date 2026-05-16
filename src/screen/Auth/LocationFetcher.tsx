import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import locationPinAnimation from './locationpin.json';
import LocationAnimation from './LocationAnimation.json';
import {hp, wp} from '../../component/utils/Constant';
import ScreenNameEnum from '../../routes/screenName.enum';
import {api_key} from '../../../config';

const {width: W} = Dimensions.get('window');
const PROGRESS_TRACK_W = W - 80;
const NAV_DELAY = 3000;

export default function LocationFetcher({navigation}: any) {
  const [locationFetched, setLocationFetched] = useState(false);
  const [addressMain, setAddressMain] = useState('');
  const [addressDesc, setAddressDesc] = useState('');
  const [showLocationUI, setShowLocationUI] = useState(false);

  const lottieLoadingRef = useRef(null);
  const lottieLocationRef = useRef(null);

  // Loading state animations
  const loadingOpacity = useRef(new Animated.Value(0)).current;
  const pulse1Scale = useRef(new Animated.Value(1)).current;
  const pulse1Opacity = useRef(new Animated.Value(0.45)).current;
  const pulse2Scale = useRef(new Animated.Value(1)).current;
  const pulse2Opacity = useRef(new Animated.Value(0.28)).current;

  // Location-found card animations
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardY = useRef(new Animated.Value(36)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0.5)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  const apiKey = api_key;

  async function getAddressFromCoordinates(lat: number, lng: number) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const fullAddress = data.results[0].formatted_address;
        const [main, ...rest] = fullAddress.split(',');
        return {main: main.trim(), desc: rest.join(',').trim()};
      }
      return {main: 'Address not found', desc: ''};
    } catch (error) {
      console.error(error);
      return {main: 'Failed to fetch address', desc: ''};
    }
  }

  // Loading entrance animation
  useEffect(() => {
    Animated.timing(loadingOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const createPulse = (
      scale: Animated.Value,
      opacity: Animated.Value,
      delay: number,
    ) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 1.6,
              duration: 1100,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 1100,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scale, {toValue: 1, duration: 0, useNativeDriver: true}),
            Animated.timing(opacity, {
              toValue: delay === 0 ? 0.45 : 0.28,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
          Animated.delay(300),
        ]),
      );

    const p1 = createPulse(pulse1Scale, pulse1Opacity, 0);
    const p2 = createPulse(pulse2Scale, pulse2Opacity, 550);
    p1.start();
    p2.start();

    return () => {
      p1.stop();
      p2.stop();
    };
  }, []);

  // Location-found animation sequence
  useEffect(() => {
    if (!showLocationUI) {
      return;
    }
    Animated.sequence([
      Animated.parallel([
        Animated.spring(checkScale, {
          toValue: 1,
          tension: 65,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(checkOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(120),
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.spring(cardY, {
          toValue: 0,
          tension: 65,
          friction: 10,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(progressWidth, {
        toValue: PROGRESS_TRACK_W,
        duration: NAV_DELAY - 400,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start();
  }, [showLocationUI]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    async function requestPermissionAndGetLocation() {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert('Permission Denied', 'Location permission is required.');
            return;
          }
        } catch (err) {
          console.warn(err);
          return;
        }
      }

      Geolocation.getCurrentPosition(
        async position => {
          const {main, desc} = await getAddressFromCoordinates(
            position.coords.latitude,
            position.coords.longitude,
          );
          setAddressMain(main);
          setAddressDesc(desc);
          setLocationFetched(true);
          setShowLocationUI(true);

          timeoutId = setTimeout(() => {
            navigation.replace(ScreenNameEnum.PhoneLogin);
          }, NAV_DELAY);
        },
        error => {
          Alert.alert('Error', error.message);
          timeoutId = setTimeout(() => {
            navigation.replace(ScreenNameEnum.PhoneLogin);
          }, NAV_DELAY);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }

    requestPermissionAndGetLocation();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#9B6FFF', '#623bea', '#3B1FAB']}
      start={{x: 0.15, y: 0}}
      end={{x: 0.85, y: 1}}
      style={styles.container}>
      {!showLocationUI ? (
        /* ── Fetching state ── */
        <Animated.View style={[styles.loadingSection, {opacity: loadingOpacity}]}>
          {/* Pulsing rings behind the Lottie */}
          <View style={styles.lottiePulseWrap}>
            <Animated.View
              style={[
                styles.pulseRing,
                {opacity: pulse1Opacity, transform: [{scale: pulse1Scale}]},
              ]}
            />
            <Animated.View
              style={[
                styles.pulseRing,
                styles.pulseRing2,
                {opacity: pulse2Opacity, transform: [{scale: pulse2Scale}]},
              ]}
            />
            <LottieView
              ref={lottieLoadingRef}
              source={locationPinAnimation}
              autoPlay
              loop
              style={styles.lottieLoading}
            />
          </View>
          <Text style={styles.fetchingTitle}>Finding your location</Text>
          <Text style={styles.fetchingSubtitle}>
            Please allow location access when prompted
          </Text>
        </Animated.View>
      ) : (
        /* ── Location found state ── */
        <View style={styles.foundSection}>
          {/* Success checkmark + lottie */}
          <Animated.View
            style={[
              styles.successBadge,
              {opacity: checkOpacity, transform: [{scale: checkScale}]},
            ]}>
            <LottieView
              ref={lottieLocationRef}
              source={LocationAnimation}
              autoPlay
              loop={false}
              style={styles.lottieSuccess}
            />
          </Animated.View>

          {locationFetched && (
            <Animated.View
              style={[
                styles.addressCard,
                {opacity: cardOpacity, transform: [{translateY: cardY}]},
              ]}>
              <LinearGradient
                colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.06)']}
                style={styles.cardGradient}>
                <Text style={styles.deliveringLabel}>
                  📍  Delivering service at
                </Text>
                <Text style={styles.addressMain} numberOfLines={2}>
                  {addressMain}
                </Text>
                {addressDesc.length > 0 && (
                  <Text style={styles.addressDesc} numberOfLines={2}>
                    {addressDesc}
                  </Text>
                )}
              </LinearGradient>
            </Animated.View>
          )}

          {/* Progress bar — fills over nav delay */}
          <View style={styles.progressTrack}>
            <Animated.View
              style={[styles.progressFill, {width: progressWidth}]}
            />
          </View>
          <Text style={styles.progressLabel}>Starting app…</Text>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  /* Loading state */
  loadingSection: {
    alignItems: 'center',
  },
  lottiePulseWrap: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  pulseRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  pulseRing2: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  lottieLoading: {
    width: wp(55),
    height: hp(28),
  },
  fetchingTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  fetchingSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20,
  },

  /* Found state */
  foundSection: {
    alignItems: 'center',
    width: '100%',
  },
  successBadge: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  lottieSuccess: {
    width: 100,
    height: 100,
  },
  addressCard: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    marginBottom: 40,
  },
  cardGradient: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  deliveringLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
    letterSpacing: 0.4,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  addressMain: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  addressDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 6,
    lineHeight: 20,
  },

  /* Progress */
  progressTrack: {
    width: PROGRESS_TRACK_W,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 2,
  },
  progressLabel: {
    marginTop: 12,
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.3,
  },
});
