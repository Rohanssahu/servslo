import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
  ScrollView,
  Animated,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  getBooking,
  updateStatus,
  completeJob,
  Booking,
  BookingStatus,
  LatLng,
} from '../../services/api';
import {onLocation, startFakeLocation, stopFakeLocation} from '../../services/socket';
import LiveTrackingMap from '../bookingflow/LiveTrackingMap';
import ScreenNameEnum from '../../routes/screenName.enum';
import SpeakerButton from '../../component/SpeakerButton';

const C = {
  grad: ['#6E39F7', '#8E57FF', '#B78CFF'] as string[],
  purple: '#6E39F7',
  purpleL: '#f3eeff',
  green: '#13B36B',
  greenGrad: ['#13B36B', '#0EA65A'] as string[],
  orange: '#F59E0B',
  text: '#1a1a2e',
  sub: '#888',
  bg: '#F4F3FB',
  card: '#fff',
  border: '#efefef',
  red: '#EF4444',
};

const TIMELINE = [
  {key: 'ASSIGNED', label: 'Partner Assigned', subLabel: 'Partner ने accept किया', icon: 'checkmark-circle'},
  {key: 'EN_ROUTE', label: 'On the Way', subLabel: 'आपकी तरफ आ रहा है', icon: 'navigate'},
  {key: 'ARRIVED', label: 'Partner Arrived', subLabel: 'आपके घर पर पहुँचा', icon: 'location'},
  {key: 'OTP_VERIFIED', label: 'Service Started', subLabel: 'OTP verify हुआ', icon: 'key'},
  {key: 'IN_PROGRESS', label: 'In Progress', subLabel: 'Service चल रही है', icon: 'construct'},
  {key: 'COMPLETED', label: 'Completed', subLabel: 'Service पूरी हो गई 🎉', icon: 'star'},
];

const STATUS_ORDER: BookingStatus[] = [
  'SEARCHING', 'ASSIGNED', 'EN_ROUTE', 'ARRIVED', 'OTP_VERIFIED', 'IN_PROGRESS', 'COMPLETED',
];

const km = (a: LatLng, b: LatLng) => {
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};
const eta = (d: number) => Math.max(1, Math.round((d / 22) * 60));

function PulseDot() {
  const anim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {toValue: 1.8, duration: 700, useNativeDriver: true}),
        Animated.timing(anim, {toValue: 1, duration: 700, useNativeDriver: true}),
      ]),
    ).start();
  }, []);
  return (
    <View style={{width: 22, height: 22, alignItems: 'center', justifyContent: 'center'}}>
      <Animated.View
        style={{
          position: 'absolute',
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: C.orange + '55',
          transform: [{scale: anim}],
        }}
      />
      <View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: C.orange}} />
    </View>
  );
}

export default function BookingTrackScreen({route, navigation}: any) {
  const {bookingId} = route.params;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [status, setStatus] = useState<BookingStatus>('ASSIGNED');
  const [partnerLoc, setPartnerLoc] = useState<LatLng | null>(null);
  const sheetAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(sheetAnim, {toValue: 1, duration: 400, useNativeDriver: true}).start();
  }, []);

  useEffect(() => {
    let unsub: (() => void) | null = null;
    (async () => {
      const b = await getBooking(bookingId);
      setBooking(b);
      setStatus(b.status === 'SEARCHING' ? 'ASSIGNED' : b.status);
      setPartnerLoc(b.pickup);
      startFakeLocation(b.pickup, b.drop);
      unsub = onLocation(loc => setPartnerLoc(loc));
    })();
    return () => {
      stopFakeLocation();
      unsub?.();
    };
  }, [bookingId]);

  useEffect(() => {
    if (!booking || !partnerLoc) return;
    if (status === 'ASSIGNED' || status === 'EN_ROUTE') {
      updateStatus('EN_ROUTE').then(() => setStatus('EN_ROUTE'));
    }
    const d = km(partnerLoc, booking.drop);
    if (d < 0.08 && !['ARRIVED', 'OTP_VERIFIED', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
      updateStatus('ARRIVED').then(() => setStatus('ARRIVED'));
    }
  }, [partnerLoc, booking, status]);

  useEffect(() => {
    if (status !== 'ARRIVED') return;
    const t = setTimeout(() => {
      setStatus('OTP_VERIFIED');
      setTimeout(async () => {
        await updateStatus('IN_PROGRESS');
        setStatus('IN_PROGRESS');
      }, 5000);
      setTimeout(async () => {
        await completeJob();
        setStatus('COMPLETED');
      }, 10000);
    }, 7000);
    return () => clearTimeout(t);
  }, [status]);

  useEffect(() => {
    if (status === 'COMPLETED') {
      setTimeout(() => {
        navigation.replace(ScreenNameEnum.Feedback, {bookingId});
      }, 2500);
    }
  }, [status]);

  const distKm = useMemo(
    () => (partnerLoc && booking ? km(partnerLoc, booking.drop) : 0),
    [partnerLoc, booking],
  );
  const etaMin = useMemo(() => eta(distKm), [distKm]);

  const callPartner = () => {
    if (booking?.partner?.phone) Linking.openURL(`tel:${booking.partner.phone}`);
  };
  const openMaps = () => {
    if (!booking) return;
    const {latitude, longitude} = booking.drop;
    const url =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`
        : `google.navigation:q=${latitude},${longitude}`;
    Linking.openURL(url).catch(() => {});
  };

  const currentIdx = STATUS_ORDER.indexOf(status);

  const trackScriptHi = useMemo(() => {
    switch (status) {
      case 'ASSIGNED':
        return `आपकी booking confirm हो गई है! एक expert partner आपकी service के लिए assign हो गया है। थोड़ी देर में वो आपकी तरफ निकलेगा। OTP तैयार रखें।`;
      case 'EN_ROUTE':
        return `आपका partner आपकी तरफ आ रहा है। लगभग ${etaMin} मिनट में पहुँचेगा। घर पर रहें और दरवाज़ा खुला रखें।`;
      case 'ARRIVED':
        return `आपका partner आपके घर पहुँच गया है! अपना OTP उन्हें बताएं ताकि service शुरू हो सके।`;
      case 'OTP_VERIFIED':
        return `OTP verify हो गया। Service अभी शुरू होने वाली है। Professional काम शुरू करेंगे।`;
      case 'IN_PROGRESS':
        return `Service चल रही है। Professional अपना काम कर रहे हैं। कृपया आसपास रहें और ज़रूरत पड़ने पर मदद करें।`;
      case 'COMPLETED':
        return `बहुत बढ़िया! Service पूरी हो गई। हम आशा करते हैं कि आपको service अच्छी लगी। अब feedback दें और हमें बताएं कैसा अनुभव रहा।`;
      default:
        return `Partner ढूंढा जा रहा है। कृपया थोड़ी प्रतीक्षा करें।`;
    }
  }, [status, etaMin]);

  const trackScriptEn = useMemo(() => {
    switch (status) {
      case 'ASSIGNED':
        return `Your booking is confirmed! An expert partner has been assigned for your service. They will head towards you shortly. Please keep your OTP ready.`;
      case 'EN_ROUTE':
        return `Your partner is on the way and will arrive in approximately ${etaMin} minutes. Please stay home and keep the door accessible.`;
      case 'ARRIVED':
        return `Your partner has arrived at your home! Please share your OTP with them to start the service.`;
      case 'OTP_VERIFIED':
        return `OTP verified successfully. The service is about to begin. Your professional will start working now.`;
      case 'IN_PROGRESS':
        return `Your service is currently in progress. The professional is working. Please stay nearby in case they need assistance.`;
      case 'COMPLETED':
        return `Service completed successfully! We hope you enjoyed the experience. Please share your feedback so we can serve you better.`;
      default:
        return `Searching for a nearby partner. Please wait a moment.`;
    }
  }, [status, etaMin]);

  const statusLabel = useMemo(() => {
    switch (status) {
      case 'ASSIGNED': return '✓ Partner Assigned';
      case 'EN_ROUTE': return `🚗 ${etaMin} min में पहुँचेगा`;
      case 'ARRIVED': return '📍 Partner आपके घर पर है!';
      case 'OTP_VERIFIED': return '🔑 OTP Verified';
      case 'IN_PROGRESS': return '🔧 Service चल रही है';
      case 'COMPLETED': return '✅ Service पूरी हो गई!';
      default: return 'Searching...';
    }
  }, [status, etaMin]);

  if (!booking || !partnerLoc) {
    return (
      <View style={s.loadingBox}>
        <Ionicons name="map" size={48} color={C.purple} />
        <Text style={s.loadingText}>Map load हो रहा है...</Text>
      </View>
    );
  }

  const showMap = ['ASSIGNED', 'EN_ROUTE', 'ARRIVED'].includes(status);

  return (
    <View style={s.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Map / Status visual */}
      {showMap ? (
        <LiveTrackingMap
          partnerLoc={partnerLoc}
          drop={booking.drop}
          onMapRef={() => {}}
          style={s.map}
        />
      ) : (
        <LinearGradient colors={C.grad} style={s.statusScreen}>
          <View style={s.statusIconWrap}>
            {status === 'IN_PROGRESS' || status === 'OTP_VERIFIED' ? (
              <Ionicons name="construct" size={60} color="#fff" />
            ) : (
              <Ionicons name="checkmark-circle" size={70} color="#fff" />
            )}
          </View>
          <Text style={s.statusScreenText}>{statusLabel}</Text>
          {status === 'IN_PROGRESS' && (
            <Text style={s.statusScreenSub}>Professional आपकी service कर रहा है</Text>
          )}
        </LinearGradient>
      )}

      {/* ETA Overlay on Map */}
      {showMap && (
        <View style={s.etaOverlay}>
          <View style={s.etaPill}>
            <Ionicons name="time" size={14} color={C.purple} />
            <Text style={s.etaText}>
              {etaMin} min • {distKm.toFixed(1)} km
            </Text>
          </View>
          <View style={[s.statusPill, {backgroundColor: status === 'ARRIVED' ? C.green : C.orange}]}>
            {status === 'EN_ROUTE' && <PulseDot />}
            <Text style={s.statusPillText}>{statusLabel}</Text>
          </View>
        </View>
      )}

      {/* Back button overlay */}
      <TouchableOpacity
        style={s.backBtn}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}>
        <Ionicons name="arrow-back" size={20} color={C.text} />
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          s.sheet,
          {
            transform: [
              {
                translateY: sheetAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [200, 0],
                }),
              },
            ],
          },
        ]}>
        {/* Handle */}
        <View style={s.handle} />

        {/* OTP Card */}
        {status === 'ARRIVED' && (
          <View style={s.otpCard}>
            <View style={s.otpLeft}>
              <Text style={s.otpTitle}>Partner पहुँच गया!</Text>
              <Text style={s.otpSub}>यह OTP share करें service शुरू करने के लिए</Text>
            </View>
            <View style={s.otpBox}>
              <Text style={s.otpCode}>4892</Text>
              <Text style={s.otpLabel}>OTP</Text>
            </View>
          </View>
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.sheetScroll}>
          {/* Service title + booking id */}
          <View style={s.sheetHeader}>
            <View>
              <Text style={s.sheetTitle}>{booking.serviceName}</Text>
              <Text style={s.sheetId}>#{bookingId}</Text>
            </View>
            <View style={s.sheetHeaderRight}>
              <View style={s.liveBadge}>
                <View style={s.liveDot} />
                <Text style={s.liveText}>LIVE</Text>
              </View>
              <SpeakerButton scriptHi={trackScriptHi} scriptEn={trackScriptEn} />
            </View>
          </View>

          <View style={s.addrRow}>
            <Ionicons name="location-outline" size={13} color={C.sub} />
            <Text style={s.addrText} numberOfLines={1}>
              {booking.address}
            </Text>
          </View>

          {/* Partner Card */}
          {booking.partner && (
            <View style={s.partnerCard}>
              <LinearGradient colors={C.grad} style={s.avatar}>
                <Text style={s.avatarText}>{booking.partner.name.charAt(0)}</Text>
              </LinearGradient>
              <View style={s.partnerInfo}>
                <Text style={s.partnerName}>{booking.partner.name}</Text>
                <Text style={s.partnerMeta}>
                  ⭐ {booking.partner.rating.toFixed(1)} • {booking.partner.vehicle}
                </Text>
              </View>
              <View style={s.partnerActions}>
                <TouchableOpacity style={s.iconBtn} onPress={callPartner} activeOpacity={0.8}>
                  <Ionicons name="call" size={17} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={s.iconBtnOutline} onPress={openMaps} activeOpacity={0.8}>
                  <Ionicons name="navigate-outline" size={17} color={C.purple} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Vertical Timeline */}
          <View style={s.timeline}>
            {TIMELINE.map((item, i) => {
              const itemIdx = STATUS_ORDER.indexOf(item.key as BookingStatus);
              const done = itemIdx <= currentIdx;
              const isCurrent = itemIdx === currentIdx;
              const isLast = i === TIMELINE.length - 1;
              return (
                <View key={item.key} style={s.timelineRow}>
                  {/* Left: dot + line */}
                  <View style={s.timelineLeft}>
                    <View
                      style={[
                        s.tlDot,
                        done && s.tlDotDone,
                        isCurrent && s.tlDotCurrent,
                      ]}>
                      <Ionicons
                        name={item.icon as any}
                        size={12}
                        color={done ? '#fff' : '#ccc'}
                      />
                    </View>
                    {!isLast && (
                      <View style={[s.tlLine, done && !isCurrent && s.tlLineDone]} />
                    )}
                  </View>
                  {/* Right: text */}
                  <View style={s.timelineContent}>
                    <Text
                      style={[
                        s.tlLabel,
                        done && s.tlLabelDone,
                        isCurrent && s.tlLabelCurrent,
                      ]}>
                      {item.label}
                    </Text>
                    {isCurrent && (
                      <Text style={s.tlSubLabel}>{item.subLabel}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const SHEET_RADIUS = 22;

const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: C.bg},
  loadingBox: {flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16},
  loadingText: {fontSize: 16, color: C.sub, fontWeight: '600'},

  map: {flex: 1},
  statusScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  statusIconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  statusScreenText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  statusScreenSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
  },

  etaOverlay: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 56 : 70,
    left: 14,
    right: 14,
    gap: 8,
  },
  etaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: C.card,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
  },
  etaText: {fontSize: 13, fontWeight: '800', color: C.purple},
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    alignSelf: 'flex-start',
    elevation: 5,
  },
  statusPillText: {fontSize: 12, fontWeight: '800', color: '#fff'},

  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 12 : 16,
    left: 14,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.card,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
  },

  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: C.card,
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    maxHeight: '58%',
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: -4},
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#D0D0D8',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },

  otpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 14,
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: C.green + '44',
    gap: 12,
  },
  otpLeft: {flex: 1},
  otpTitle: {fontSize: 14, fontWeight: '800', color: C.green, marginBottom: 3},
  otpSub: {fontSize: 11, color: C.sub, lineHeight: 15},
  otpBox: {
    backgroundColor: C.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: C.green,
  },
  otpCode: {
    fontSize: 26,
    fontWeight: '900',
    color: C.purple,
    letterSpacing: 4,
  },
  otpLabel: {fontSize: 10, color: C.sub, fontWeight: '600', marginTop: 2},

  sheetScroll: {paddingHorizontal: 14, paddingTop: 12, paddingBottom: 24},
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  sheetHeaderRight: {alignItems: 'flex-end', gap: 8},
  sheetTitle: {fontSize: 18, fontWeight: '900', color: C.text},
  sheetId: {fontSize: 11, color: C.sub, marginTop: 2},
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  liveDot: {width: 7, height: 7, borderRadius: 3.5, backgroundColor: C.red},
  liveText: {fontSize: 11, color: C.red, fontWeight: '800'},

  addrRow: {flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 14},
  addrText: {flex: 1, fontSize: 12, color: C.sub},

  partnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.purpleL,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {fontSize: 20, fontWeight: '900', color: '#fff'},
  partnerInfo: {flex: 1},
  partnerName: {fontSize: 14, fontWeight: '800', color: C.text},
  partnerMeta: {fontSize: 12, color: C.sub, marginTop: 2},
  partnerActions: {flexDirection: 'row', gap: 8},
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnOutline: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: C.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },

  timeline: {paddingLeft: 4},
  timelineRow: {flexDirection: 'row', alignItems: 'flex-start'},
  timelineLeft: {alignItems: 'center', marginRight: 12, width: 24},
  tlDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tlDotDone: {backgroundColor: C.green},
  tlDotCurrent: {backgroundColor: C.orange},
  tlLine: {width: 2, flex: 1, minHeight: 24, backgroundColor: '#E8E8F0', marginVertical: 2},
  tlLineDone: {backgroundColor: C.green},
  timelineContent: {flex: 1, paddingBottom: 16, paddingTop: 2},
  tlLabel: {fontSize: 13, color: '#AAA', fontWeight: '600'},
  tlLabelDone: {color: C.text, fontWeight: '700'},
  tlLabelCurrent: {color: C.orange, fontWeight: '800'},
  tlSubLabel: {fontSize: 11, color: C.sub, marginTop: 2},
});
