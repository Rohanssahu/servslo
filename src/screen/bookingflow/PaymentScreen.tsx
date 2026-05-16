import React, {useState, useRef} from 'react';
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
  const scale = useRef(new Animated.Value(0)).current;

  const amountToPay = payPlan === 'ARRIVAL_ONLY' ? arrivalCharge : amount;

  const payNow = () => {
    if (!mode) {
      Alert.alert('भुगतान मोड चुनें', 'कृपया Cash या UPI में से कोई एक चुनें');
      return;
    }
    if (mode === 'UPI' && !upiApp) {
      Alert.alert('UPI App चुनें', 'कृपया UPI app चुनें');
      return;
    }
    setShowModal(true);
    Animated.spring(scale, {toValue: 1, useNativeDriver: true}).start();
    setTimeout(() => {
      navigation.replace(ScreenNameEnum.BookingTrackScreen, {bookingId});
    }, 2200);
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

      {/* Success Modal */}
      <Modal transparent visible={showModal} animationType="fade">
        <View style={s.overlay}>
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
                : payPlan === 'ARRIVAL_ONLY'
                  ? 'Partner आपकी तरफ आ रहा है...'
                  : 'Partner ढूंढा जा रहा है...'}
            </Text>
          </Animated.View>
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

  overlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center'},
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
  successSub: {color: C.sub, fontSize: 14, textAlign: 'center'},
});
