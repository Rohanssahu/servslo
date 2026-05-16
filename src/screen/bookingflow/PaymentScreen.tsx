import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Animated,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenNameEnum from '../../routes/screenName.enum';
import SpeakerButton from '../../component/SpeakerButton';

const C = {
  grad: ['#6E39F7', '#8E57FF', '#B78CFF'] as string[],
  purple: '#6E39F7',
  purpleL: '#f3eeff',
  text: '#1a1a2e',
  sub: '#666',
  bg: '#F7F7FB',
  card: '#fff',
  green: '#13B36B',
  greenGrad: ['#13B36B', '#0EA65A'] as string[],
  orange: '#F59E0B',
  red: '#EF4444',
  border: '#efefef',
};

const UPI_APPS = [
  {id: 'gpay', label: 'Google Pay', icon: 'logo-google'},
  {id: 'phonepe', label: 'PhonePe', icon: 'phone-portrait'},
  {id: 'paytm', label: 'Paytm', icon: 'wallet'},
  {id: 'other', label: 'Other UPI', icon: 'qr-code'},
];

type PreSelectedProvider = {
  name: string;
  initial: string;
  rating: string;
  jobs: number;
  eta: number;
  dist: number;
  phone?: string;
  status?: string;
};

type Props = {
  navigation: any;
  route: {
    params: {
      amount: number;
      serviceCharge?: number;
      arrivalCharge?: number;
      serviceName?: string;
      scheduledTime?: string;
      bookingId: string;
      isArrivalOnly?: boolean;
      preSelectedProvider?: PreSelectedProvider;
    };
  };
};

export default function PaymentScreen({route, navigation}: Props) {
  const {
    amount,
    serviceCharge = 0,
    arrivalCharge = 0,
    serviceName = 'Service',
    scheduledTime,
    bookingId,
    isArrivalOnly = false,
    preSelectedProvider,
  } = route.params;

  const scriptHi = isArrivalOnly
    ? `सिर्फ ₹${arrivalCharge} arrival charge देना है। Professional आपके घर आया था इसलिए यह charge देय है। Cash या UPI से payment करें।`
    : `Payment का समय है! आप सिर्फ ₹${arrivalCharge} arrival charge अभी देकर professional को बुला सकते हैं। ` +
      `बाकी ₹${serviceCharge} service पूरी होने पर देना होगा। ` +
      `या फिर पूरे ₹${amount} अभी एक साथ pay करें। Cash या UPI दोनों से payment करें।`;

  const scriptEn = isArrivalOnly
    ? `You need to pay rupees ${arrivalCharge} arrival charge only. This charge applies because the professional visited your home. Pay by cash or UPI.`
    : `Time to pay! You can call the professional by paying just rupees ${arrivalCharge} arrival charge now. ` +
      `The remaining rupees ${serviceCharge} is due after service completion. ` +
      `Or pay the full rupees ${amount} at once. Choose cash or UPI to proceed.`;

  const [payPlan, setPayPlan] = useState<'FULL' | 'ARRIVAL_ONLY'>('FULL');
  const [mode, setMode] = useState<'CASH' | 'UPI' | null>(null);
  const [upiApp, setUpiApp] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [payPhase, setPayPhase] = useState<0 | 1 | 2>(0);
  const scale = useRef(new Animated.Value(0)).current;
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const pulse3 = useRef(new Animated.Value(0)).current;
  const pc1 = useRef(new Animated.Value(0)).current;
  const pc2 = useRef(new Animated.Value(0)).current;
  const pc3 = useRef(new Animated.Value(0)).current;
  const provSlide = useRef(new Animated.Value(55)).current;
  const provFade = useRef(new Animated.Value(0)).current;

  const amountToPay = payPlan === 'ARRIVAL_ONLY' ? arrivalCharge : amount;

  useEffect(() => {
    if (payPhase !== 1) return;
    const mkPulse = (a: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(a, {toValue: 1, duration: 1400, useNativeDriver: true}),
          Animated.timing(a, {toValue: 0, duration: 0, useNativeDriver: true}),
        ]),
      );
    const a1 = mkPulse(pulse1, 0);
    const a2 = mkPulse(pulse2, 470);
    const a3 = mkPulse(pulse3, 940);
    a1.start(); a2.start(); a3.start();
    const t = setTimeout(() => {
      Animated.stagger(550, [
        Animated.timing(pc1, {toValue: 1, duration: 400, useNativeDriver: true}),
        Animated.timing(pc2, {toValue: 1, duration: 400, useNativeDriver: true}),
        Animated.timing(pc3, {toValue: 1, duration: 400, useNativeDriver: true}),
      ]).start();
    }, 500);
    return () => {
      clearTimeout(t);
      pulse1.setValue(0); pulse2.setValue(0); pulse3.setValue(0);
    };
  }, [payPhase]);

  useEffect(() => {
    if (payPhase !== 2) return;
    Animated.parallel([
      Animated.timing(provSlide, {toValue: 0, duration: 500, useNativeDriver: true}),
      Animated.timing(provFade, {toValue: 1, duration: 500, useNativeDriver: true}),
    ]).start();
  }, [payPhase]);

  const payNow = () => {
    if (!mode) {
      Alert.alert('भुगतान मोड चुनें', 'कृपया Cash या UPI में से कोई एक चुनें');
      return;
    }
    if (mode === 'UPI' && !upiApp) {
      Alert.alert('UPI App चुनें', 'कृपया UPI app चुनें');
      return;
    }
    setPayPhase(0);
    [pulse1, pulse2, pulse3, pc1, pc2, pc3, provFade].forEach(a => a.setValue(0));
    provSlide.setValue(55);
    setShowModal(true);
    Animated.spring(scale, {toValue: 1, useNativeDriver: true}).start();
    if (isArrivalOnly) {
      setTimeout(() => navigation.goBack(), 2800);
      return;
    }
    if (preSelectedProvider) {
      // Provider already chosen — skip searching, go straight to assigned
      setTimeout(() => setPayPhase(2), 1400);
      setTimeout(() => {
        navigation.replace(ScreenNameEnum.BookingTrackScreen, {bookingId});
      }, 4800);
    } else {
      // Normal flow — search for a provider
      setTimeout(() => setPayPhase(1), 1200);
      setTimeout(() => setPayPhase(2), 5000);
      setTimeout(() => {
        navigation.replace(ScreenNameEnum.BookingTrackScreen, {bookingId});
      }, 7500);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <LinearGradient colors={C.grad} style={s.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={s.backBtn}
          activeOpacity={0.8}>
          <Icon name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>
          {isArrivalOnly ? 'Arrival Charge Pay करें' : 'Payment'}
        </Text>
        <SpeakerButton scriptHi={scriptHi} scriptEn={scriptEn} light />
      </LinearGradient>

      {/* Progress */}
      <View style={s.stepsRow}>
        <View style={s.stepItem}>
          <View style={[s.stepDot, {backgroundColor: C.purple}]}>
            <Icon name="wallet" size={14} color="#fff" />
          </View>
          <Text style={[s.stepText, {color: C.purple}]}>Payment</Text>
        </View>
        <View style={s.stepLine} />
        <View style={s.stepItem}>
          <View style={s.stepDotGray}>
            <Icon name="navigate" size={14} color="#999" />
          </View>
          <Text style={s.stepText}>Tracking</Text>
        </View>
        <View style={s.stepLine} />
        <View style={s.stepItem}>
          <View style={s.stepDotGray}>
            <Icon name="chatbubbles" size={14} color="#999" />
          </View>
          <Text style={s.stepText}>Feedback</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Arrival Only Banner */}
        {isArrivalOnly && (
          <View style={s.arrivalBanner}>
            <Icon name="information-circle" size={18} color={C.orange} />
            <Text style={s.arrivalBannerText}>
              Booking cancel की गई। सिर्फ ₹{arrivalCharge} arrival charge देय है।
            </Text>
          </View>
        )}

        {/* Amount Card */}
        <View style={s.amountCard}>
          <Text style={s.amountLabel}>देय राशि</Text>
          <Text style={s.amountVal}>₹{amountToPay}</Text>
          <Text style={s.serviceName}>{serviceName}</Text>
          {scheduledTime && (
            <View style={s.scheduleRow}>
              <Icon name="calendar-outline" size={14} color={C.sub} />
              <Text style={s.scheduleText}>{scheduledTime}</Text>
            </View>
          )}
        </View>

        {/* Price Breakdown */}
        {(serviceCharge > 0 || arrivalCharge > 0) && (
          <View style={s.breakdownCard}>
            <Text style={s.breakdownTitle}>Breakdown</Text>
            {serviceCharge > 0 && (
              <View style={s.breakRow}>
                <Text style={s.breakLabel}>Service Charge</Text>
                <Text style={s.breakVal}>₹{serviceCharge}</Text>
              </View>
            )}
            {arrivalCharge > 0 && (
              <View style={s.breakRow}>
                <View style={s.breakLabelRow}>
                  <Text style={s.breakLabel}>Arrival Charge</Text>
                  <Icon name="location" size={12} color={C.orange} />
                </View>
                <Text style={[s.breakVal, {color: C.orange}]}>₹{arrivalCharge}</Text>
              </View>
            )}
            <View style={s.breakDivider} />
            <View style={s.breakRow}>
              <Text style={[s.breakLabel, {fontWeight: '800', color: C.text}]}>Total</Text>
              <Text style={[s.breakVal, {fontSize: 16, fontWeight: '900', color: C.purple}]}>
                ₹{amount}
              </Text>
            </View>
          </View>
        )}

        {/* Payment Plan */}
        {serviceCharge > 0 && arrivalCharge > 0 && !isArrivalOnly && (
          <View style={s.planSection}>
            <Text style={s.modeTitle}>💡 Payment Plan चुनें</Text>

            <TouchableOpacity
              style={[s.planCard, payPlan === 'ARRIVAL_ONLY' && s.planCardActive]}
              onPress={() => setPayPlan('ARRIVAL_ONLY')}
              activeOpacity={0.85}>
              <View style={s.planLeft}>
                <Text style={[s.planTitle, payPlan === 'ARRIVAL_ONLY' && s.planTitleActive]}>
                  🚗 सिर्फ Arrival Charge अभी
                </Text>
                <Text style={s.planSub}>
                  ₹{serviceCharge} service charge — service पूरी होने पर देंगे
                </Text>
              </View>
              <View style={{alignItems: 'flex-end', gap: 4}}>
                <Text style={[s.planAmt, payPlan === 'ARRIVAL_ONLY' && s.planAmtActive]}>
                  ₹{arrivalCharge}
                </Text>
                <View style={[s.radioOuter, payPlan === 'ARRIVAL_ONLY' && s.radioOuterActive]}>
                  {payPlan === 'ARRIVAL_ONLY' && <View style={s.radioInner} />}
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.planCard, payPlan === 'FULL' && s.planCardActive]}
              onPress={() => setPayPlan('FULL')}
              activeOpacity={0.85}>
              <View style={s.planLeft}>
                <Text style={[s.planTitle, payPlan === 'FULL' && s.planTitleActive]}>
                  ✅ पूरा अभी Pay करें
                </Text>
                <Text style={s.planSub}>Arrival + Service charge एक साथ</Text>
              </View>
              <View style={{alignItems: 'flex-end', gap: 4}}>
                <Text style={[s.planAmt, payPlan === 'FULL' && s.planAmtActive]}>₹{amount}</Text>
                <View style={[s.radioOuter, payPlan === 'FULL' && s.radioOuterActive]}>
                  {payPlan === 'FULL' && <View style={s.radioInner} />}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Payment Mode */}
        <View style={s.modeSection}>
          <Text style={s.modeTitle}>भुगतान का तरीका चुनें</Text>

          {/* Cash Option */}
          <TouchableOpacity
            onPress={() => {setMode('CASH'); setUpiApp(null);}}
            style={[s.modeCard, mode === 'CASH' && s.modeCardActive]}
            activeOpacity={0.85}>
            <View style={[s.modeIcon, mode === 'CASH' && s.modeIconActive]}>
              <Icon name="cash-outline" size={22} color={mode === 'CASH' ? '#fff' : C.sub} />
            </View>
            <View style={s.modeInfo}>
              <Text style={[s.modeLabel, mode === 'CASH' && s.modeLabelActive]}>Cash</Text>
              <Text style={s.modeSub}>Professional को cash दें</Text>
            </View>
            <View style={[s.radioOuter, mode === 'CASH' && s.radioOuterActive]}>
              {mode === 'CASH' && <View style={s.radioInner} />}
            </View>
          </TouchableOpacity>

          {/* UPI Option */}
          <TouchableOpacity
            onPress={() => setMode('UPI')}
            style={[s.modeCard, mode === 'UPI' && s.modeCardActive]}
            activeOpacity={0.85}>
            <View style={[s.modeIcon, mode === 'UPI' && s.modeIconActive]}>
              <Icon name="phone-portrait-outline" size={22} color={mode === 'UPI' ? '#fff' : C.sub} />
            </View>
            <View style={s.modeInfo}>
              <Text style={[s.modeLabel, mode === 'UPI' && s.modeLabelActive]}>UPI</Text>
              <Text style={s.modeSub}>Google Pay, PhonePe, Paytm</Text>
            </View>
            <View style={[s.radioOuter, mode === 'UPI' && s.radioOuterActive]}>
              {mode === 'UPI' && <View style={s.radioInner} />}
            </View>
          </TouchableOpacity>

          {/* UPI App Selector */}
          {mode === 'UPI' && (
            <View style={s.upiApps}>
              {UPI_APPS.map(app => (
                <TouchableOpacity
                  key={app.id}
                  style={[s.upiChip, upiApp === app.id && s.upiChipActive]}
                  onPress={() => setUpiApp(app.id)}
                  activeOpacity={0.8}>
                  <Icon
                    name={app.icon as any}
                    size={18}
                    color={upiApp === app.id ? C.purple : C.sub}
                  />
                  <Text style={[s.upiLabel, upiApp === app.id && s.upiLabelActive]}>
                    {app.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={{height: 100}} />
      </ScrollView>

      {/* Pay CTA */}
      <View style={s.bottomBar}>
        <TouchableOpacity onPress={payNow} activeOpacity={0.9} style={{flex: 1}}>
          <LinearGradient colors={isArrivalOnly ? [C.orange, '#D97706'] : C.grad} style={s.payBtn}>
            <Icon name="lock-closed-outline" size={18} color="#fff" />
            <Text style={s.payBtnText}>
              {isArrivalOnly ? `₹${amountToPay} Pay करें` : `Securely Pay ₹${amountToPay}`}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Success Modal — multi-phase */}
      <Modal transparent visible={showModal} animationType="fade" statusBarTranslucent>
        <View style={s.overlay}>

          {/* Phase 0: Booking Confirmed */}
          {payPhase === 0 && (
            <Animated.View style={[s.modalBox, {transform: [{scale}]}]}>
              <LinearGradient colors={C.greenGrad} style={s.successIcon}>
                <Icon name="checkmark-done" size={46} color="#fff" />
              </LinearGradient>
              <Text style={s.successTitle}>
                {isArrivalOnly ? 'Arrival Charge Paid!' : 'Booking Confirmed! 🎉'}
              </Text>
              <Text style={s.successSub}>
                {isArrivalOnly
                  ? 'Booking cancel हो गई। धन्यवाद!'
                  : preSelectedProvider
                  ? `${preSelectedProvider.name.split(' ')[0]} को assign किया जा रहा है...`
                  : 'Professionals को notify किया जा रहा है...'}
              </Text>
              {!isArrivalOnly && (
                <View style={s.phase0Badges}>
                  {['✅ Verified', '⭐ 4.8+', '🏅 Insured'].map((b, i) => (
                    <View key={i} style={s.phase0Badge}>
                      <Text style={s.phase0BadgeTxt}>{b}</Text>
                    </View>
                  ))}
                </View>
              )}
            </Animated.View>
          )}

          {/* Phase 1: Searching */}
          {payPhase === 1 && (
            <View style={s.searchingCard}>
              <Text style={s.searchTitle}>Nearby Experts ढूंढे जा रहे हैं...</Text>

              {/* Radar animation */}
              <View style={s.radarWrap}>
                {[pulse1, pulse2, pulse3].map((p, i) => (
                  <Animated.View key={i} style={[s.radarRing, {
                    opacity: p.interpolate({inputRange: [0, 0.6, 1], outputRange: [0.55, 0.18, 0]}),
                    transform: [{scale: p.interpolate({inputRange: [0, 1], outputRange: [0.12, 1.85]})}],
                  }]} />
                ))}
                <LinearGradient colors={C.grad} style={s.radarCore}>
                  <Text style={{fontSize: 20}}>📍</Text>
                </LinearGradient>
              </View>

              {/* Provider previews */}
              <View style={s.pcList}>
                {[
                  {a: pc1, init: 'R', name: 'Ravi Kumar', dist: '1.2 km'},
                  {a: pc2, init: 'A', name: 'Amit Sharma', dist: '2.0 km'},
                  {a: pc3, init: 'S', name: 'Suresh Patel', dist: '2.8 km'},
                ].map((pv, i) => (
                  <Animated.View key={i} style={[s.pcRow, {
                    opacity: pv.a,
                    transform: [{translateX: pv.a.interpolate({inputRange: [0, 1], outputRange: [-18, 0]})}],
                  }]}>
                    <LinearGradient colors={C.grad} style={s.pcAvatar}>
                      <Text style={s.pcInitial}>{pv.init}</Text>
                    </LinearGradient>
                    <View style={{flex: 1}}>
                      <Text style={s.pcName}>{pv.name}</Text>
                      <Text style={s.pcDist}>📍 {pv.dist}</Text>
                    </View>
                    <Animated.View style={[s.searchDot, {
                      transform: [{scale: pulse1.interpolate({inputRange: [0, 0.5, 1], outputRange: [1, 1.5, 1]})}],
                    }]} />
                  </Animated.View>
                ))}
              </View>

              <View style={s.trustRow}>
                {['⭐ 4.8 avg', '✅ Verified', '🕐 <10 min'].map((b, i) => (
                  <View key={i} style={s.trustBadge}>
                    <Text style={s.trustBadgeTxt}>{b}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Phase 2: Provider Assigned */}
          {payPhase === 2 && (() => {
            const prov = preSelectedProvider ?? {
              name: 'Ravi Kumar',
              initial: 'R',
              rating: '4.8',
              jobs: 312,
              eta: 8,
              dist: 1.2,
            };
            return (
              <Animated.View style={[s.provFoundCard, {opacity: provFade, transform: [{translateY: provSlide}]}]}>
                {preSelectedProvider ? (
                  <View style={s.assignedBanner}>
                    <Icon name="checkmark-circle" size={20} color={C.purple} />
                    <Text style={s.assignedBannerTxt}>
                      {prov.name.split(' ')[0]} assigned to you!
                    </Text>
                  </View>
                ) : (
                  <View style={s.foundBanner}>
                    <Icon name="checkmark-circle" size={20} color={C.green} />
                    <Text style={s.foundBannerTxt}>Expert मिल गया!</Text>
                  </View>
                )}
                <LinearGradient colors={C.grad} style={s.bigAvatar}>
                  <Text style={s.bigAvatarTxt}>{prov.initial}</Text>
                </LinearGradient>
                <Text style={s.provNameBig}>{prov.name}</Text>
                <Text style={s.provMeta}>⭐ {prov.rating}  ·  {prov.jobs} jobs done</Text>
                <View style={s.etaDistRow}>
                  <View style={s.etaPill}>
                    <Icon name="time-outline" size={13} color={C.purple} />
                    <Text style={s.etaTxt}>{prov.eta} min ETA</Text>
                  </View>
                  <View style={s.distPill}>
                    <Icon name="location-outline" size={13} color={C.orange} />
                    <Text style={s.distTxt}>{prov.dist} km</Text>
                  </View>
                </View>
                <Text style={s.onWayTxt}>आपकी तरफ आ रहे हैं 🚗</Text>
              </Animated.View>
            );
          })()}

        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {flex: 1, backgroundColor: C.bg},

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 12 : 12,
    paddingBottom: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {flex: 1, textAlign: 'center', color: '#fff', fontWeight: '800', fontSize: 18},

  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: C.card,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  stepItem: {alignItems: 'center'},
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepDotGray: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepText: {fontSize: 11, color: C.sub, fontWeight: '600'},
  stepLine: {width: 60, height: 2, backgroundColor: C.border, marginHorizontal: 8, marginBottom: 18},

  scroll: {paddingHorizontal: 16, paddingTop: 16},

  arrivalBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  arrivalBannerText: {flex: 1, fontSize: 13, color: '#92400E', lineHeight: 18},

  amountCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
  },
  amountLabel: {fontSize: 14, color: C.sub, marginBottom: 6},
  amountVal: {fontSize: 40, fontWeight: '900', color: C.text, marginBottom: 4},
  serviceName: {fontSize: 14, color: C.sub, marginBottom: 8},
  scheduleRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  scheduleText: {fontSize: 12, color: C.sub},

  breakdownCard: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  breakdownTitle: {fontSize: 14, fontWeight: '800', color: C.text, marginBottom: 10},
  breakRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5},
  breakLabelRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  breakLabel: {fontSize: 13, color: C.sub},
  breakVal: {fontSize: 13, fontWeight: '700', color: C.text},
  breakDivider: {height: 1, backgroundColor: C.border, marginVertical: 4},

  planSection: {marginBottom: 14},
  planCard: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 1,
  },
  planCardActive: {borderColor: C.purple, backgroundColor: C.purpleL},
  planLeft: {flex: 1, marginRight: 12},
  planTitle: {fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 3},
  planTitleActive: {color: C.purple},
  planSub: {fontSize: 12, color: C.sub, lineHeight: 17},
  planAmt: {fontSize: 16, fontWeight: '900', color: C.text},
  planAmtActive: {color: C.purple},

  modeSection: {marginBottom: 12},
  modeTitle: {fontSize: 15, fontWeight: '800', color: C.text, marginBottom: 10},
  modeCard: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 1,
  },
  modeCardActive: {borderColor: C.purple, backgroundColor: C.purpleL},
  modeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeIconActive: {backgroundColor: C.purple},
  modeInfo: {flex: 1},
  modeLabel: {fontSize: 15, fontWeight: '700', color: C.text},
  modeLabelActive: {color: C.purple},
  modeSub: {fontSize: 12, color: C.sub, marginTop: 2},
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: C.sub,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {borderColor: C.purple},
  radioInner: {width: 10, height: 10, borderRadius: 5, backgroundColor: C.purple},

  upiApps: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingLeft: 4, marginBottom: 4},
  upiChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: C.card,
    borderWidth: 1.5,
    borderColor: C.border,
    elevation: 1,
  },
  upiChipActive: {borderColor: C.purple, backgroundColor: C.purpleL},
  upiLabel: {fontSize: 12, fontWeight: '600', color: C.sub},
  upiLabelActive: {color: C.purple},

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: -4},
  },
  payBtn: {
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  payBtnText: {color: '#fff', fontWeight: '900', fontSize: 16},

  overlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.68)', justifyContent: 'center', alignItems: 'center'},
  modalBox: {
    width: 300,
    backgroundColor: C.card,
    padding: 28,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 10,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {fontSize: 20, fontWeight: '900', color: C.green, marginBottom: 8},
  successSub: {color: C.sub, fontSize: 14, textAlign: 'center', marginBottom: 14},
  phase0Badges: {flexDirection: 'row', gap: 8},
  phase0Badge: {backgroundColor: C.purpleL, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20},
  phase0BadgeTxt: {fontSize: 11, fontWeight: '700', color: C.purple},

  // Searching card
  searchingCard: {
    width: 320,
    backgroundColor: C.card,
    borderRadius: 24,
    padding: 26,
    alignItems: 'center',
    elevation: 16,
  },
  searchTitle: {fontSize: 16, fontWeight: '800', color: C.text, textAlign: 'center', marginBottom: 20},
  radarWrap: {width: 144, height: 144, alignItems: 'center', justifyContent: 'center', marginBottom: 18},
  radarRing: {
    position: 'absolute',
    width: 144,
    height: 144,
    borderRadius: 72,
    borderWidth: 2,
    borderColor: C.purple,
  },
  radarCore: {width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center'},
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
  pcAvatar: {width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center'},
  pcInitial: {fontSize: 14, fontWeight: '900', color: '#fff'},
  pcName: {fontSize: 13, fontWeight: '700', color: C.text},
  pcDist: {fontSize: 11, color: C.sub},
  searchDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: C.green},
  trustRow: {flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center'},
  trustBadge: {backgroundColor: C.purpleL, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20},
  trustBadgeTxt: {fontSize: 12, fontWeight: '700', color: C.purple},

  // Provider found card
  provFoundCard: {
    width: 320,
    backgroundColor: C.card,
    borderRadius: 24,
    padding: 26,
    alignItems: 'center',
    elevation: 16,
  },
  foundBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#e8fbf0',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 18,
  },
  foundBannerTxt: {fontSize: 14, fontWeight: '800', color: C.green},
  assignedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: C.purpleL,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 18,
  },
  assignedBannerTxt: {fontSize: 14, fontWeight: '800', color: C.purple},
  bigAvatar: {width: 82, height: 82, borderRadius: 41, alignItems: 'center', justifyContent: 'center', marginBottom: 12},
  bigAvatarTxt: {fontSize: 36, fontWeight: '900', color: '#fff'},
  provNameBig: {fontSize: 21, fontWeight: '900', color: C.text, marginBottom: 4},
  provMeta: {fontSize: 13, color: C.sub, marginBottom: 14},
  etaDistRow: {flexDirection: 'row', gap: 10, marginBottom: 10},
  etaPill: {flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.purpleL, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20},
  etaTxt: {fontSize: 13, fontWeight: '700', color: C.purple},
  distPill: {flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#fff3e0', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20},
  distTxt: {fontSize: 13, fontWeight: '700', color: C.orange},
  onWayTxt: {fontSize: 13, color: C.sub},
});
