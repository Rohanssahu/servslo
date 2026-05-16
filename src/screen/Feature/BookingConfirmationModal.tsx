import React, {useEffect, useRef, useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  BackHandler,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');
const CARD_W = Math.min(width * 0.9, 380);
const RADAR_SIZE = 148;

type Props = {
  visible: boolean;
  onFinished: () => void;
  durationMs?: number;
  title?: string;
};

const MOCK_PROVIDER = {
  initial: 'R',
  name: 'Ravi Kumar',
  rating: '4.8',
  jobs: '312',
  exp: '5+ yrs',
  eta: '8 min',
  dist: '1.2 km',
};

const SEARCHING_PROVIDERS = [
  {initial: 'R', name: 'Ravi Kumar', dist: '1.2 km'},
  {initial: 'A', name: 'Amit Sharma', dist: '2.0 km'},
  {initial: 'S', name: 'Suresh Patel', dist: '2.8 km'},
];

const BookingConfirmationModal: React.FC<Props> = ({
  visible,
  onFinished,
  durationMs = 8000,
  title = 'Booking Confirmed!',
}) => {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const [canTrack, setCanTrack] = useState(false);

  // Phase 0 anims
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;

  // Phase 1 radar anims
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const pulse3 = useRef(new Animated.Value(0)).current;
  const pc1 = useRef(new Animated.Value(0)).current;
  const pc2 = useRef(new Animated.Value(0)).current;
  const pc3 = useRef(new Animated.Value(0)).current;

  // Phase 2 anims
  const foundSlide = useRef(new Animated.Value(50)).current;
  const foundFade = useRef(new Animated.Value(0)).current;
  const starPop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      setPhase(0);
      setCanTrack(false);
      return;
    }

    setPhase(0);
    setCanTrack(false);
    [checkScale, checkOpacity, pulse1, pulse2, pulse3, pc1, pc2, pc3, foundFade, starPop].forEach(a => a.setValue(0));
    foundSlide.setValue(50);

    Animated.parallel([
      Animated.spring(checkScale, {toValue: 1, friction: 6, tension: 80, useNativeDriver: true}),
      Animated.timing(checkOpacity, {toValue: 1, duration: 400, useNativeDriver: true}),
    ]).start();

    const phase2Start = Math.max(durationMs - 2600, 3400);
    const t1 = setTimeout(() => setPhase(1), 1400);
    const t2 = setTimeout(() => {
      setPhase(2);
      setCanTrack(true);
    }, phase2Start);
    const t3 = setTimeout(onFinished, durationMs + 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [visible, durationMs]);

  useEffect(() => {
    if (phase !== 1) return;

    const makePulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {toValue: 1, duration: 1400, easing: Easing.out(Easing.quad), useNativeDriver: true}),
          Animated.timing(anim, {toValue: 0, duration: 0, useNativeDriver: true}),
        ]),
      );

    const a1 = makePulse(pulse1, 0);
    const a2 = makePulse(pulse2, 470);
    const a3 = makePulse(pulse3, 940);
    a1.start(); a2.start(); a3.start();

    const t = setTimeout(() => {
      Animated.stagger(550, [
        Animated.timing(pc1, {toValue: 1, duration: 400, useNativeDriver: true}),
        Animated.timing(pc2, {toValue: 1, duration: 400, useNativeDriver: true}),
        Animated.timing(pc3, {toValue: 1, duration: 400, useNativeDriver: true}),
      ]).start();
    }, 400);

    return () => {
      clearTimeout(t);
      pulse1.setValue(0); pulse2.setValue(0); pulse3.setValue(0);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 2) return;
    Animated.parallel([
      Animated.timing(foundSlide, {toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true}),
      Animated.timing(foundFade, {toValue: 1, duration: 500, useNativeDriver: true}),
      Animated.spring(starPop, {toValue: 1, friction: 5, tension: 90, useNativeDriver: true}),
    ]).start();
  }, [phase]);

  const radarStyle = (p: Animated.Value) => ({
    opacity: p.interpolate({inputRange: [0, 0.6, 1], outputRange: [0.55, 0.18, 0]}),
    transform: [{scale: p.interpolate({inputRange: [0, 1], outputRange: [0.12, 1.85]})}],
  });

  const pcStyle = (p: Animated.Value) => ({
    opacity: p,
    transform: [{translateX: p.interpolate({inputRange: [0, 1], outputRange: [-18, 0]})}],
  });

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
      <View style={st.backdrop}>

        {/* ── Phase 0: Booking Confirmed ──────────────────────────────── */}
        {phase === 0 && (
          <View style={st.card}>
            <Animated.View style={{transform: [{scale: checkScale}], opacity: checkOpacity, marginBottom: 18}}>
              <LinearGradient colors={['#13B36B', '#0EA65A']} style={st.checkCircle}>
                <Ionicons name="checkmark-done" size={46} color="#fff" />
              </LinearGradient>
            </Animated.View>
            <Text style={st.p0Title}>{title}</Text>
            <Text style={st.p0Sub}>
              Nearby professionals को notify किया जा रहा है...
            </Text>
            <View style={st.miniRow}>
              {['✅ Verified', '⭐ 4.8+', '🏅 Insured'].map((b, i) => (
                <View key={i} style={st.miniBadge}>
                  <Text style={st.miniBadgeTxt}>{b}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Phase 1: Searching ─────────────────────────────────────── */}
        {phase === 1 && (
          <View style={st.card}>
            <Text style={st.searchTitle}>Nearby Experts ढूंढे जा रहे हैं...</Text>

            {/* Radar */}
            <View style={st.radarWrap}>
              {[pulse1, pulse2, pulse3].map((p, i) => (
                <Animated.View key={i} style={[st.radarRing, radarStyle(p)]} />
              ))}
              <LinearGradient colors={['#6E39F7', '#8E57FF']} style={st.radarCore}>
                <Text style={{fontSize: 20}}>📍</Text>
              </LinearGradient>
            </View>

            {/* Provider preview cards */}
            <View style={st.pcList}>
              {SEARCHING_PROVIDERS.map((pv, i) => (
                <Animated.View key={i} style={[st.pcRow, pcStyle([pc1, pc2, pc3][i])]}>
                  <LinearGradient colors={['#6E39F7', '#B78CFF']} style={st.pcAvatar}>
                    <Text style={st.pcInitial}>{pv.initial}</Text>
                  </LinearGradient>
                  <View style={{flex: 1}}>
                    <Text style={st.pcName}>{pv.name}</Text>
                    <Text style={st.pcDist}>📍 {pv.dist}</Text>
                  </View>
                  <Animated.View style={[st.pulsingDot, {
                    transform: [{scale: pulse1.interpolate({inputRange: [0, 0.5, 1], outputRange: [1, 1.5, 1]})}],
                  }]} />
                </Animated.View>
              ))}
            </View>

            <View style={st.trustRow}>
              {['⭐ 4.8 avg', '✅ Verified', '🕐 <10 min'].map((b, i) => (
                <View key={i} style={st.trustBadge}>
                  <Text style={st.trustBadgeTxt}>{b}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Phase 2: Provider Assigned ─────────────────────────────── */}
        {phase === 2 && (
          <Animated.View style={[st.card, {opacity: foundFade, transform: [{translateY: foundSlide}]}]}>
            <View style={st.foundBanner}>
              <Animated.View style={{transform: [{scale: starPop}]}}>
                <Ionicons name="checkmark-circle" size={22} color="#13B36B" />
              </Animated.View>
              <Text style={st.foundBannerTxt}>Expert मिल गया!</Text>
            </View>

            <LinearGradient colors={['#6E39F7', '#8E57FF', '#B78CFF']} style={st.bigAvatar}>
              <Text style={st.bigAvatarTxt}>{MOCK_PROVIDER.initial}</Text>
            </LinearGradient>

            <Text style={st.providerName}>{MOCK_PROVIDER.name}</Text>
            <Text style={st.providerMeta}>
              ⭐ {MOCK_PROVIDER.rating}  ·  {MOCK_PROVIDER.jobs} jobs  ·  {MOCK_PROVIDER.exp}
            </Text>

            <View style={st.etaDistRow}>
              <View style={st.etaPill}>
                <Ionicons name="time-outline" size={13} color="#6E39F7" />
                <Text style={st.etaTxt}>{MOCK_PROVIDER.eta} ETA</Text>
              </View>
              <View style={st.distPill}>
                <Ionicons name="location-outline" size={13} color="#F59E0B" />
                <Text style={st.distTxt}>{MOCK_PROVIDER.dist}</Text>
              </View>
            </View>

            <Text style={st.onWayTxt}>आपकी तरफ आ रहे हैं 🚗</Text>

            {canTrack && (
              <TouchableOpacity onPress={onFinished} style={st.trackBtn} activeOpacity={0.9}>
                <LinearGradient colors={['#6E39F7', '#8E57FF', '#B78CFF']} style={st.trackGrad}>
                  <Ionicons name="map-outline" size={16} color="#fff" />
                  <Text style={st.trackTxt}>Live Track करें</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </Animated.View>
        )}

      </View>
    </Modal>
  );
};

export default BookingConfirmationModal;

const st = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(4, 7, 20, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: CARD_W,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 26,
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 8},
  },

  // Phase 0
  checkCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  p0Title: {fontSize: 22, fontWeight: '900', color: '#1a1a2e', marginBottom: 8, textAlign: 'center'},
  p0Sub: {fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 20, lineHeight: 20},
  miniRow: {flexDirection: 'row', gap: 8},
  miniBadge: {backgroundColor: '#f3eeff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20},
  miniBadgeTxt: {fontSize: 11, fontWeight: '700', color: '#4d2b98'},

  // Phase 1
  searchTitle: {fontSize: 17, fontWeight: '800', color: '#1a1a2e', marginBottom: 22, textAlign: 'center'},
  radarWrap: {
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  radarRing: {
    position: 'absolute',
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    borderRadius: RADAR_SIZE / 2,
    borderWidth: 2,
    borderColor: '#6E39F7',
  },
  radarCore: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pcList: {width: '100%', gap: 8, marginBottom: 16},
  pcRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f9f8ff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  pcAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pcInitial: {fontSize: 15, fontWeight: '900', color: '#fff'},
  pcName: {fontSize: 13, fontWeight: '700', color: '#1a1a2e'},
  pcDist: {fontSize: 11, color: '#888'},
  pulsingDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: '#13B36B'},
  trustRow: {flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center'},
  trustBadge: {backgroundColor: '#f3eeff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20},
  trustBadgeTxt: {fontSize: 12, fontWeight: '700', color: '#4d2b98'},

  // Phase 2
  foundBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#e8fbf0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 18,
  },
  foundBannerTxt: {fontSize: 15, fontWeight: '800', color: '#13B36B'},
  bigAvatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  bigAvatarTxt: {fontSize: 38, fontWeight: '900', color: '#fff'},
  providerName: {fontSize: 22, fontWeight: '900', color: '#1a1a2e', marginBottom: 4},
  providerMeta: {fontSize: 13, color: '#888', marginBottom: 16},
  etaDistRow: {flexDirection: 'row', gap: 10, marginBottom: 10},
  etaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f3eeff',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  etaTxt: {fontSize: 13, fontWeight: '700', color: '#6E39F7'},
  distPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fff3e0',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  distTxt: {fontSize: 13, fontWeight: '700', color: '#F59E0B'},
  onWayTxt: {fontSize: 13, color: '#888', marginBottom: 20},
  trackBtn: {width: '100%', borderRadius: 14, overflow: 'hidden'},
  trackGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  trackTxt: {color: '#fff', fontWeight: '800', fontSize: 15},
});
