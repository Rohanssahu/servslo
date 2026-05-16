import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenNameEnum from '../../routes/screenName.enum';

const C = {
  purple: '#6E39F7',
  grad: ['#6E39F7', '#8E57FF', '#B78CFF'] as string[],
  bg: '#f4f3fb',
  card: '#fff',
  text: '#1a1a2e',
  sub: '#888',
  green: '#13B36B',
  orange: '#F59E0B',
  red: '#EF4444',
  greenGrad: ['#13B36B', '#0EA65A'] as string[],
};

type Props = {
  navigation: any;
  route: {
    params: {
      bookingId: string;
      serviceName: string;
      partnerName: string;
      partnerRating: string;
      arrivalCharge: number;
      serviceCharge: number;
    };
  };
};

export default function ArrivalChargesScreen({navigation, route}: Props) {
  const {
    bookingId,
    serviceName,
    partnerName,
    partnerRating,
    arrivalCharge,
    serviceCharge,
  } = route.params;

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideUp = useRef(new Animated.Value(60)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const [timer, setTimer] = useState(120);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideUp, {toValue: 0, duration: 450, useNativeDriver: true}),
      Animated.timing(fadeIn, {toValue: 1, duration: 500, useNativeDriver: true}),
    ]).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {toValue: 1.15, duration: 800, useNativeDriver: true}),
        Animated.timing(pulseAnim, {toValue: 1, duration: 800, useNativeDriver: true}),
      ]),
    );
    pulse.start();

    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      pulse.stop();
      clearInterval(interval);
    };
  }, []);

  const handleStartService = () => {
    navigation.replace(ScreenNameEnum.PaymentScreen, {
      amount: serviceCharge + arrivalCharge,
      serviceCharge,
      arrivalCharge,
      serviceName,
      bookingId,
      isArrivalOnly: false,
    });
  };

  const handleCancel = () => {
    Alert.alert(
      'Booking Cancel करें?',
      `Cancel करने पर सिर्फ ₹${arrivalCharge} arrival charge कटेगा।\nService charge नहीं लगेगा।`,
      [
        {text: 'वापस जाएं', style: 'cancel'},
        {
          text: `₹${arrivalCharge} Pay करें & Cancel`,
          style: 'destructive',
          onPress: () =>
            navigation.replace(ScreenNameEnum.PaymentScreen, {
              amount: arrivalCharge,
              serviceCharge: 0,
              arrivalCharge,
              serviceName,
              bookingId,
              isArrivalOnly: true,
            }),
        },
      ],
    );
  };

  const mins = Math.floor(timer / 60);
  const secs = timer % 60;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <Animated.View style={[s.container, {opacity: fadeIn, transform: [{translateY: slideUp}]}]}>

        {/* Top Arrival Badge */}
        <View style={s.topSection}>
          <Animated.View style={[s.arrivedBadge, {transform: [{scale: pulseAnim}]}]}>
            <LinearGradient colors={C.greenGrad} style={s.arrivedCircle}>
              <Icon name="location" size={32} color="#fff" />
            </LinearGradient>
          </Animated.View>
          <Text style={s.arrivedTitle}>Professional पहुँच गया! 🎉</Text>
          <Text style={s.arrivedSub}>आपके घर पर पहुँच चुका है</Text>
        </View>

        {/* Partner Card */}
        <View style={s.partnerCard}>
          <LinearGradient colors={[C.purple + '22', C.purple + '11']} style={s.partnerAvatar}>
            <Text style={s.partnerEmoji}>👷</Text>
          </LinearGradient>
          <View style={s.partnerInfo}>
            <Text style={s.partnerName}>{partnerName}</Text>
            <Text style={s.partnerService}>{serviceName} Expert</Text>
            <View style={s.partnerMeta}>
              <Text style={s.partnerRating}>⭐ {partnerRating}</Text>
              <View style={s.dotSep} />
              <Icon name="location" size={12} color={C.green} />
              <Text style={s.partnerArrived}>आपके घर पर है</Text>
            </View>
          </View>
        </View>

        {/* Timer */}
        <View style={s.timerBox}>
          <Icon name="time-outline" size={16} color={C.orange} />
          <Text style={s.timerText}>
            Response करने का समय:{' '}
            <Text style={s.timerVal}>
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </Text>
          </Text>
        </View>

        {/* Arrival Charge Info Card */}
        <View style={s.chargeCard}>
          <View style={s.chargeHeader}>
            <Icon name="wallet" size={18} color={C.orange} />
            <Text style={s.chargeTitle}>Arrival Charge</Text>
            <Text style={s.chargeAmt}>₹{arrivalCharge}</Text>
          </View>
          <Text style={s.chargeInfo}>
            Professional आपके घर तक आया है, इसलिए ₹{arrivalCharge} arrival charge लागू होगा।
            यह charge इस बात की परवाह किए बिना लागू होगा कि आप service लेते हैं या cancel करते हैं।
          </Text>

          <View style={s.comparePrices}>
            <View style={s.compareItem}>
              <Text style={s.compareLabel}>Service लें तो</Text>
              <Text style={s.compareVal}>₹{serviceCharge + arrivalCharge}</Text>
              <Text style={s.compareSub}>सेवा + arrival</Text>
            </View>
            <View style={s.compareDivider} />
            <View style={s.compareItem}>
              <Text style={s.compareLabel}>Cancel करें तो</Text>
              <Text style={[s.compareVal, {color: C.red}]}>₹{arrivalCharge}</Text>
              <Text style={s.compareSub}>सिर्फ arrival charge</Text>
            </View>
          </View>
        </View>

        {/* CTAs */}
        <TouchableOpacity onPress={handleStartService} activeOpacity={0.9} style={s.startBtn}>
          <LinearGradient colors={C.greenGrad} style={s.startGrad}>
            <Icon name="play-circle" size={22} color="#fff" />
            <View>
              <Text style={s.startBtnText}>Service शुरू करें</Text>
              <Text style={s.startBtnSub}>Total: ₹{serviceCharge + arrivalCharge}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCancel} activeOpacity={0.85} style={s.cancelBtn}>
          <Icon name="close-circle-outline" size={18} color={C.red} />
          <View>
            <Text style={s.cancelBtnText}>Booking Cancel करें</Text>
            <Text style={s.cancelBtnSub}>सिर्फ ₹{arrivalCharge} arrival charge कटेगा</Text>
          </View>
        </TouchableOpacity>

      </Animated.View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {flex: 1, backgroundColor: C.bg},
  container: {flex: 1, paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 16 : 16},

  topSection: {alignItems: 'center', marginBottom: 20, marginTop: 12},
  arrivedBadge: {marginBottom: 14},
  arrivedCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrivedTitle: {fontSize: 22, fontWeight: '900', color: C.text, marginBottom: 4},
  arrivedSub: {fontSize: 14, color: C.sub},

  partnerCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
  },
  partnerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerEmoji: {fontSize: 28},
  partnerInfo: {flex: 1},
  partnerName: {fontSize: 16, fontWeight: '800', color: C.text, marginBottom: 2},
  partnerService: {fontSize: 12, color: C.sub, marginBottom: 4},
  partnerMeta: {flexDirection: 'row', alignItems: 'center', gap: 4},
  partnerRating: {fontSize: 12, fontWeight: '600', color: C.sub},
  dotSep: {width: 3, height: 3, borderRadius: 1.5, backgroundColor: C.sub},
  partnerArrived: {fontSize: 12, color: C.green, fontWeight: '600'},

  timerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF7ED',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  timerText: {fontSize: 13, color: C.text},
  timerVal: {fontSize: 14, fontWeight: '900', color: C.orange},

  chargeCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    borderTopWidth: 3,
    borderTopColor: C.orange,
  },
  chargeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  chargeTitle: {flex: 1, fontSize: 16, fontWeight: '800', color: C.text},
  chargeAmt: {fontSize: 20, fontWeight: '900', color: C.orange},
  chargeInfo: {fontSize: 13, color: C.sub, lineHeight: 19, marginBottom: 14},

  comparePrices: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    overflow: 'hidden',
  },
  compareItem: {flex: 1, alignItems: 'center', paddingVertical: 12},
  compareLabel: {fontSize: 11, color: C.sub, marginBottom: 4},
  compareVal: {fontSize: 20, fontWeight: '900', color: C.green},
  compareSub: {fontSize: 10, color: C.sub, marginTop: 2},
  compareDivider: {width: 1, backgroundColor: C.bg, marginVertical: 8},

  startBtn: {borderRadius: 16, overflow: 'hidden', marginBottom: 10},
  startGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 16,
  },
  startBtnText: {color: '#fff', fontWeight: '900', fontSize: 16},
  startBtnSub: {color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2},

  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: C.red + '44',
    backgroundColor: '#FFF1F2',
  },
  cancelBtnText: {color: C.red, fontWeight: '800', fontSize: 15},
  cancelBtnSub: {color: C.red + 'BB', fontSize: 12},
});
