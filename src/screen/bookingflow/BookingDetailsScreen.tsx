import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  SafeAreaView,
  Platform,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenNameEnum from '../../routes/screenName.enum';

const C = {
  grad: ['#6E39F7', '#8E57FF', '#B78CFF'] as string[],
  purple: '#6E39F7',
  purpleL: '#f3eeff',
  text: '#1a1a2e',
  sub: '#888',
  card: '#fff',
  bg: '#F4F3FB',
  green: '#13B36B',
  orange: '#F59E0B',
  red: '#EF4444',
  border: '#efefef',
};

const STATUS_STEPS = [
  {key: 'ASSIGNED', label: 'Confirmed', icon: 'checkmark-circle'},
  {key: 'EN_ROUTE', label: 'On the Way', icon: 'navigate'},
  {key: 'ARRIVED', label: 'Arrived', icon: 'location'},
  {key: 'IN_PROGRESS', label: 'In Progress', icon: 'construct'},
  {key: 'COMPLETED', label: 'Done', icon: 'star'},
];

const STATUS_ORDER = ['ASSIGNED', 'EN_ROUTE', 'ARRIVED', 'OTP_VERIFIED', 'IN_PROGRESS', 'COMPLETED'];

function getStepIndex(status: string) {
  return STATUS_ORDER.indexOf(status);
}

type BookingParam = {
  id: string;
  service: string;
  emoji: string;
  address: string;
  datetime: string;
  amount: number;
  status: string;
  step: string;
  partner: string | null;
  partnerRating: string | null;
  eta: string | null;
};

type Props = {
  navigation: any;
  route?: {params?: {booking?: BookingParam}};
};

export default function BookingDetailsScreen({navigation, route}: Props) {
  const passedBooking = route?.params?.booking;
  const [loading, setLoading] = useState(!passedBooking);
  const [booking, setBooking] = useState<any>(passedBooking ?? null);

  useEffect(() => {
    if (passedBooking) return;
    setTimeout(() => {
      setBooking({
        id: 'BK-102938',
        service: 'AC Repair',
        emoji: '❄️',
        address: 'Flat 203, Green Heights, Andheri East, Mumbai',
        datetime: 'आज, 03:00 PM',
        amount: 398,
        status: 'active',
        step: 'EN_ROUTE',
        partner: 'Ravi Kumar',
        partnerRating: '4.8',
        partnerVehicle: 'Maruti Eeco',
        distanceKm: 1.2,
        eta: '8 min',
        serviceCharge: 349,
        arrivalCharge: 49,
        gst: 0,
        phone: '+91 98765 43210',
      });
      setLoading(false);
    }, 800);
  }, []);

  const handleCancel = () => {
    const distanceKm = booking?.distanceKm ?? 0;
    if (distanceKm >= 2) {
      Alert.alert('Cancel नहीं हो सकता', 'Partner बहुत नजदीक है।');
      return;
    }
    const deduction = distanceKm > 0 ? (20 * distanceKm).toFixed(0) : 0;
    Alert.alert(
      'Booking Cancel करें?',
      deduction
        ? `Partner ${distanceKm.toFixed(1)} km दूर है। ₹${deduction} काटे जाएंगे।`
        : 'Free cancellation',
      [
        {text: 'वापस जाएं', style: 'cancel'},
        {
          text: 'Cancel करें',
          style: 'destructive',
          onPress: () => setBooking({...booking, status: 'cancelled', step: 'CANCELLED'}),
        },
      ],
    );
  };

  if (loading || !booking) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={C.purple} />
        <Text style={{marginTop: 10, color: C.sub}}>Loading…</Text>
      </View>
    );
  }

  const currentIdx = getStepIndex(booking.step);
  const isCancelled = booking.status === 'cancelled';
  const isCompleted = booking.step === 'COMPLETED';
  const canCancel = !isCancelled && !isCompleted && booking.step !== 'ARRIVED';

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={C.grad} style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>Booking Details</Text>
          <Text style={s.headerSub}>{booking.id}</Text>
        </View>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => navigation.navigate(ScreenNameEnum.NotificationList)}
          activeOpacity={0.8}>
          <Ionicons name="notifications-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Status Steps — Swiggy style horizontal */}
        {!isCancelled ? (
          <View style={s.stepsCard}>
            <Text style={s.stepsTitle}>
              {isCompleted ? '✅ Service पूरी हो गई!' : `⏱ ${booking.eta ? `${booking.eta} में पहुंचेगा` : 'Status Update'}`}
            </Text>
            <View style={s.stepsRow}>
              {STATUS_STEPS.map((step, i) => {
                const done = i <= currentIdx - (STATUS_ORDER.indexOf(step.key) === -1 ? 0 : 0);
                const stepDone = STATUS_ORDER.indexOf(step.key) <= currentIdx;
                const isCurrent =
                  STATUS_ORDER.indexOf(step.key) === currentIdx ||
                  (step.key === 'IN_PROGRESS' && booking.step === 'OTP_VERIFIED');
                return (
                  <React.Fragment key={step.key}>
                    <View style={s.stepItem}>
                      <View
                        style={[
                          s.stepDot,
                          stepDone && s.stepDotDone,
                          isCurrent && s.stepDotActive,
                        ]}>
                        <Ionicons
                          name={step.icon as any}
                          size={14}
                          color={stepDone ? '#fff' : C.sub}
                        />
                      </View>
                      <Text
                        style={[
                          s.stepLabel,
                          stepDone && s.stepLabelDone,
                          isCurrent && s.stepLabelActive,
                        ]}
                        numberOfLines={1}>
                        {step.label}
                      </Text>
                    </View>
                    {i < STATUS_STEPS.length - 1 && (
                      <View
                        style={[
                          s.stepLine,
                          STATUS_ORDER.indexOf(STATUS_STEPS[i + 1].key) <= currentIdx && s.stepLineDone,
                        ]}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </View>
          </View>
        ) : (
          <View style={s.cancelledBanner}>
            <Ionicons name="close-circle" size={22} color={C.red} />
            <Text style={s.cancelledText}>यह Booking रद्द कर दी गई है</Text>
          </View>
        )}

        {/* Service Card */}
        <View style={s.card}>
          <View style={s.serviceRow}>
            <LinearGradient colors={[C.purpleL, '#e6d5ff']} style={s.serviceEmoji}>
              <Text style={s.emojiText}>{booking.emoji}</Text>
            </LinearGradient>
            <View style={s.serviceInfo}>
              <Text style={s.serviceName}>{booking.service}</Text>
              <View style={s.addrRow}>
                <Ionicons name="location-outline" size={13} color={C.sub} />
                <Text style={s.addrText} numberOfLines={2}>
                  {booking.address}
                </Text>
              </View>
              <View style={s.dtRow}>
                <Ionicons name="calendar-outline" size={12} color={C.sub} />
                <Text style={s.dtText}>{booking.datetime}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Partner Card */}
        {booking.partner && !isCancelled && (
          <View style={s.card}>
            <Text style={s.cardSectionTitle}>
              <Ionicons name="person" size={14} color={C.purple} /> Partner Details
            </Text>
            <View style={s.partnerRow}>
              <LinearGradient colors={C.grad} style={s.avatar}>
                <Text style={s.avatarText}>
                  {booking.partner.charAt(0)}
                </Text>
              </LinearGradient>
              <View style={s.partnerInfo}>
                <Text style={s.partnerName}>{booking.partner}</Text>
                <Text style={s.partnerMeta}>
                  ⭐ {booking.partnerRating} • {booking.partnerVehicle ?? 'Professional'}
                </Text>
                {booking.distanceKm && (
                  <Text style={s.partnerDist}>
                    📍 {booking.distanceKm} km दूर • {booking.eta} ETA
                  </Text>
                )}
              </View>
              <View style={s.actionBtns}>
                <TouchableOpacity
                  style={s.iconBtn}
                  onPress={() =>
                    booking.phone && Linking.openURL(`tel:${booking.phone}`)
                  }
                  activeOpacity={0.8}>
                  <Ionicons name="call" size={17} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={s.iconBtnOutline} activeOpacity={0.8}>
                  <Ionicons name="chatbubble-ellipses-outline" size={17} color={C.purple} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Track CTA */}
            <TouchableOpacity
              style={s.trackBtn}
              onPress={() =>
                navigation.navigate(ScreenNameEnum.BookingTrackScreen, {
                  bookingId: booking.id,
                })
              }
              activeOpacity={0.9}>
              <LinearGradient colors={C.grad} style={s.trackGrad}>
                <Ionicons name="map" size={18} color="#fff" />
                <Text style={s.trackText}>Live Map पर Track करें</Text>
                <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.8)" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Bill Summary */}
        <View style={s.card}>
          <Text style={s.cardSectionTitle}>
            <Ionicons name="receipt" size={14} color={C.purple} /> Bill Summary
          </Text>
          <View style={s.billRow}>
            <Text style={s.billLabel}>Service Charge</Text>
            <Text style={s.billVal}>₹{booking.serviceCharge ?? booking.amount - 49}</Text>
          </View>
          <View style={s.billRow}>
            <View style={s.billLabelRow}>
              <Text style={s.billLabel}>Arrival Charge</Text>
              <Ionicons name="location" size={11} color={C.orange} />
            </View>
            <Text style={[s.billVal, {color: C.orange}]}>₹{booking.arrivalCharge ?? 49}</Text>
          </View>
          {(booking.gst ?? 0) > 0 && (
            <View style={s.billRow}>
              <Text style={s.billLabel}>GST (18%)</Text>
              <Text style={s.billVal}>₹{booking.gst}</Text>
            </View>
          )}
          <View style={s.billDivider} />
          <View style={s.billRow}>
            <Text style={s.billTotal}>Total</Text>
            <Text style={s.billTotalVal}>₹{booking.amount}</Text>
          </View>

          {!isCancelled && (
            <View style={s.payMethodRow}>
              <Ionicons name="phone-portrait-outline" size={14} color={C.sub} />
              <Text style={s.payMethodText}>UPI / Cash</Text>
            </View>
          )}
        </View>

        {/* Instructions */}
        {!isCancelled && (
          <View style={s.card}>
            <Text style={s.cardSectionTitle}>
              <Ionicons name="document-text-outline" size={14} color={C.purple} /> Partner को Instructions
            </Text>
            <Text style={s.instructionHint}>
              Partner के लिए कोई note add करें (जैसे "Flat 204 है", "Ladder लाएं")
            </Text>
            <TouchableOpacity style={s.addNoteBtn} activeOpacity={0.8}>
              <Ionicons name="add-circle-outline" size={18} color={C.purple} />
              <Text style={s.addNoteText}>Note Add करें</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Cancel */}
        {canCancel && (
          <TouchableOpacity style={s.cancelBtn} onPress={handleCancel} activeOpacity={0.85}>
            <Ionicons name="close-circle-outline" size={18} color={C.red} />
            <Text style={s.cancelText}>Booking Cancel करें</Text>
          </TouchableOpacity>
        )}

        {/* Invoice for completed */}
        {isCompleted && (
          <TouchableOpacity
            style={s.invoiceBtn}
            onPress={() =>
              navigation.navigate(ScreenNameEnum.InvoiceScreen, {bookingId: booking.id})
            }
            activeOpacity={0.85}>
            <Ionicons name="receipt-outline" size={18} color={C.green} />
            <Text style={s.invoiceText}>Invoice देखें / Download करें</Text>
          </TouchableOpacity>
        )}

        <View style={{height: 32}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {flex: 1, backgroundColor: C.bg},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},

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
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {flex: 1, alignItems: 'center'},
  headerTitle: {color: '#fff', fontSize: 17, fontWeight: '800'},
  headerSub: {color: 'rgba(255,255,255,0.75)', fontSize: 11, marginTop: 1},

  scroll: {paddingHorizontal: 14, paddingTop: 14},

  stepsCard: {
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
  },
  stepsTitle: {fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 14},
  stepsRow: {flexDirection: 'row', alignItems: 'center'},
  stepItem: {alignItems: 'center', flex: 1},
  stepDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  stepDotDone: {backgroundColor: C.green},
  stepDotActive: {backgroundColor: C.orange},
  stepLabel: {fontSize: 9, color: C.sub, textAlign: 'center', fontWeight: '500'},
  stepLabelDone: {color: C.green, fontWeight: '700'},
  stepLabelActive: {color: C.orange, fontWeight: '700'},
  stepLine: {flex: 1, height: 2.5, backgroundColor: '#e0e0e0', marginBottom: 22, marginHorizontal: -2},
  stepLineDone: {backgroundColor: C.green},

  cancelledBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF1F2',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.red + '33',
  },
  cancelledText: {fontSize: 14, color: C.red, fontWeight: '700'},

  card: {
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
  },
  cardSectionTitle: {fontSize: 14, fontWeight: '800', color: C.text, marginBottom: 12},

  serviceRow: {flexDirection: 'row', gap: 12, alignItems: 'flex-start'},
  serviceEmoji: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {fontSize: 26},
  serviceInfo: {flex: 1},
  serviceName: {fontSize: 16, fontWeight: '800', color: C.text, marginBottom: 5},
  addrRow: {flexDirection: 'row', alignItems: 'flex-start', gap: 4, marginBottom: 4},
  addrText: {flex: 1, fontSize: 12, color: C.sub, lineHeight: 17},
  dtRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  dtText: {fontSize: 12, color: C.sub},

  partnerRow: {flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14},
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {fontSize: 22, fontWeight: '900', color: '#fff'},
  partnerInfo: {flex: 1},
  partnerName: {fontSize: 15, fontWeight: '800', color: C.text, marginBottom: 2},
  partnerMeta: {fontSize: 12, color: C.sub, marginBottom: 2},
  partnerDist: {fontSize: 11, color: C.orange, fontWeight: '600'},
  actionBtns: {flexDirection: 'row', gap: 8},
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnOutline: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: C.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },

  trackBtn: {borderRadius: 14, overflow: 'hidden'},
  trackGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
  },
  trackText: {flex: 1, color: '#fff', fontWeight: '800', fontSize: 15, textAlign: 'center'},

  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  billLabelRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  billLabel: {fontSize: 13, color: C.sub},
  billVal: {fontSize: 13, fontWeight: '700', color: C.text},
  billDivider: {height: 1, backgroundColor: C.border, marginVertical: 6},
  billTotal: {fontSize: 15, fontWeight: '900', color: C.text},
  billTotalVal: {fontSize: 18, fontWeight: '900', color: C.purple},
  payMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  payMethodText: {fontSize: 12, color: C.sub},

  instructionHint: {fontSize: 12, color: C.sub, marginBottom: 10, lineHeight: 17},
  addNoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  addNoteText: {fontSize: 14, color: C.purple, fontWeight: '700'},

  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.red + '55',
    backgroundColor: '#FFF1F2',
    marginBottom: 12,
  },
  cancelText: {fontSize: 15, color: C.red, fontWeight: '800'},

  invoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.green + '55',
    backgroundColor: '#F0FDF4',
    marginBottom: 12,
  },
  invoiceText: {fontSize: 15, color: C.green, fontWeight: '800'},
});
