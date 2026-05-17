// src/screen/Feature/BookingTrackScreen.tsx
// Premium real-time provider tracking screen.
// Uses trackingEngine for smooth movement + trackingNotifications for background pings.

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  ScrollView,
  Animated,
  StatusBar,
  AppState,
  AppStateStatus,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import {
  getBooking,
  updateStatus,
  completeJob,
  Booking,
  BookingStatus,
  LatLng,
} from '../../services/api';
import {
  startTracking,
  stopTracking,
  onLocationUpdate,
  onMilestone,
  TrackingLocationUpdate,
  TrackingMilestone,
} from '../../services/trackingEngine';
import {
  initTrackingNotifications,
  notifyStatusChange,
  notifyMilestone,
  startBackgroundEtaPings,
  stopBackgroundEtaPings,
  updateEtaCache,
} from '../../services/trackingNotifications';
import LiveTrackingMap from '../bookingflow/LiveTrackingMap';
import ScreenNameEnum from '../../routes/screenName.enum';
import SpeakerButton from '../../component/SpeakerButton';

// ─── Constants ────────────────────────────────────────────────────────────────

const C = {
  grad: ['#6E39F7', '#8E57FF', '#B78CFF'] as string[],
  purple: '#6E39F7',
  purpleL: '#f3eeff',
  green: '#13B36B',
  greenGrad: ['#13B36B', '#0EA65A'] as string[],
  orange: '#F59E0B',
  nearbyColor: '#FF6B2B',
  text: '#1a1a2e',
  sub: '#888',
  bg: '#F4F3FB',
  card: '#fff',
  border: '#efefef',
  red: '#EF4444',
};

const HAPTIC_OPTIONS = { enableVibrateFallback: true, ignoreAndroidSystemSettings: false };

const TIMELINE = [
  { key: 'ASSIGNED',    label: 'Partner Assigned',  subLabel: 'Partner ने accept किया',       icon: 'checkmark-circle' },
  { key: 'EN_ROUTE',    label: 'On the Way',         subLabel: 'आपकी तरफ आ रहा है',           icon: 'navigate'         },
  { key: 'NEARBY',      label: 'Partner Nearby',     subLabel: '300 मीटर के पास है',          icon: 'radio-button-on'  },
  { key: 'ARRIVED',     label: 'Partner Arrived',    subLabel: 'आपके घर पर पहुँचा',           icon: 'location'         },
  { key: 'OTP_VERIFIED',label: 'Service Started',    subLabel: 'OTP verify हुआ',              icon: 'key'              },
  { key: 'IN_PROGRESS', label: 'In Progress',        subLabel: 'Service चल रही है',           icon: 'construct'        },
  { key: 'COMPLETED',   label: 'Completed',          subLabel: 'Service पूरी हो गई 🎉',       icon: 'star'             },
];

// NEARBY is a display-only milestone (not a BookingStatus)
type DisplayStatus = BookingStatus | 'NEARBY';

const STATUS_ORDER: DisplayStatus[] = [
  'SEARCHING', 'ASSIGNED', 'EN_ROUTE', 'NEARBY', 'ARRIVED',
  'OTP_VERIFIED', 'IN_PROGRESS', 'COMPLETED',
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function PulseDot({ color }: { color: string }) {
  const anim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1.9, duration: 700, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1,   duration: 700, useNativeDriver: true }),
      ]),
    ).start();
  }, []);
  return (
    <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          position: 'absolute',
          width: 20, height: 20, borderRadius: 10,
          backgroundColor: color + '44',
          transform: [{ scale: anim }],
        }}
      />
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color }} />
    </View>
  );
}

// Speed badge shown on the map
function SpeedBadge({ speedKmh }: { speedKmh: number }) {
  return (
    <View style={s.speedBadge}>
      <Text style={s.speedVal}>{speedKmh}</Text>
      <Text style={s.speedUnit}>km/h</Text>
    </View>
  );
}

// Countdown ETA timer (counts down every second)
function EtaCountdown({ etaMin }: { etaMin: number }) {
  const [secs, setSecs] = useState(etaMin * 60);
  useEffect(() => {
    setSecs(etaMin * 60);
  }, [etaMin]);
  useEffect(() => {
    const t = setInterval(() => setSecs(prev => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(secs / 60);
  const s2 = secs % 60;
  return (
    <Text style={s.etaCountdown}>
      {m}:{String(s2).padStart(2, '0')}
    </Text>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function BookingTrackScreen({ route, navigation }: any) {
  const { bookingId } = route.params;

  const [booking, setBooking]           = useState<Booking | null>(null);
  const [status, setStatus]             = useState<DisplayStatus>('ASSIGNED');
  const [partnerLoc, setPartnerLoc]     = useState<LatLng | null>(null);
  const [bearing, setBearing]           = useState(0);
  const [speedKmh, setSpeedKmh]         = useState(0);
  const [distKm, setDistKm]             = useState(0);
  const [etaMin, setEtaMin]             = useState(0);
  const [routeRemaining, setRouteRemaining] = useState<LatLng[]>([]);
  const [isConnected, setIsConnected]   = useState(true);

  const sheetAnim = useRef(new Animated.Value(0)).current;
  const statusAnim = useRef(new Animated.Value(1)).current;
  const prevStatus = useRef<DisplayStatus>('ASSIGNED');

  // ─── Init sheet animation ───────────────────────────────────────────────

  useEffect(() => {
    Animated.spring(sheetAnim, {
      toValue: 1,
      tension: 60,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, []);

  // ─── Boot: load booking + start engine ─────────────────────────────────

  useEffect(() => {
    initTrackingNotifications();

    let unsubLoc: (() => void) | null = null;
    let unsubMilestone: (() => void) | null = null;

    (async () => {
      const b = await getBooking(bookingId);
      setBooking(b);

      const initStatus: DisplayStatus =
        b.status === 'SEARCHING' ? 'ASSIGNED' : (b.status as DisplayStatus);
      setStatus(initStatus);
      setPartnerLoc(b.pickup);

      // Start engine
      startTracking(b.pickup, b.drop);
      startBackgroundEtaPings(bookingId);

      // Send initial notification if just assigned
      if (initStatus === 'ASSIGNED' && b.partner?.name) {
        notifyStatusChange('ASSIGNED', bookingId, b.partner.name);
      }

      // Subscribe to location updates
      unsubLoc = onLocationUpdate((update: TrackingLocationUpdate) => {
        setPartnerLoc(update.location);
        setBearing(update.bearing);
        setSpeedKmh(update.speedKmh);
        setDistKm(update.distanceKm);
        setEtaMin(update.etaMin);
        setRouteRemaining(update.routeRemaining);
        updateEtaCache(update.distanceKm, update.etaMin);

        // Auto-transition to EN_ROUTE once moving
        setStatus(prev => {
          if (prev === 'ASSIGNED') return 'EN_ROUTE';
          return prev;
        });
      });

      // Subscribe to milestones
      unsubMilestone = onMilestone((milestone: TrackingMilestone) => {
        const partnerName = b.partner?.name ?? 'Partner';

        if (milestone === 'NEARBY') {
          _transitionStatus('NEARBY', partnerName);
          notifyMilestone('NEARBY', bookingId, partnerName);
        } else if (milestone === 'ARRIVED') {
          _handleArrived(b, partnerName);
        }
      });
    })();

    return () => {
      stopTracking();
      stopBackgroundEtaPings();
      unsubLoc?.();
      unsubMilestone?.();
    };
  }, [bookingId]);

  // ─── Status: EN_ROUTE notification ─────────────────────────────────────

  useEffect(() => {
    if (status === 'EN_ROUTE' && prevStatus.current === 'ASSIGNED' && booking?.partner?.name) {
      notifyStatusChange('EN_ROUTE', bookingId, booking.partner.name, etaMin);
      updateStatus('EN_ROUTE');
    }
    prevStatus.current = status;
  }, [status]);

  // ─── Status: COMPLETED → Feedback ──────────────────────────────────────

  useEffect(() => {
    if (status === 'COMPLETED') {
      stopBackgroundEtaPings();
      setTimeout(() => navigation.replace(ScreenNameEnum.Feedback, { bookingId }), 2500);
    }
  }, [status]);

  // ─── Helpers ────────────────────────────────────────────────────────────

  const _transitionStatus = useCallback(
    (newStatus: DisplayStatus, partnerName: string) => {
      ReactNativeHapticFeedback.trigger('impactMedium', HAPTIC_OPTIONS);
      Animated.sequence([
        Animated.timing(statusAnim, { toValue: 0.85, duration: 120, useNativeDriver: true }),
        Animated.spring(statusAnim, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
      ]).start();
      setStatus(newStatus);
    },
    [statusAnim],
  );

  const _handleArrived = useCallback(
    (b: Booking, partnerName: string) => {
      _transitionStatus('ARRIVED', partnerName);
      updateStatus('ARRIVED');
      notifyStatusChange('ARRIVED', bookingId, partnerName);
      notifyMilestone('ARRIVED', bookingId, partnerName);

      // Auto-complete flow (simulated — replace with real OTP verification)
      const t1 = setTimeout(() => {
        _transitionStatus('OTP_VERIFIED', partnerName);
        updateStatus('OTP_VERIFIED');
        notifyStatusChange('OTP_VERIFIED', bookingId, partnerName);
      }, 8000);

      const t2 = setTimeout(async () => {
        await updateStatus('IN_PROGRESS');
        _transitionStatus('IN_PROGRESS', partnerName);
        notifyStatusChange('IN_PROGRESS', bookingId, partnerName);
      }, 14000);

      const t3 = setTimeout(async () => {
        await completeJob();
        _transitionStatus('COMPLETED', partnerName);
        notifyStatusChange('COMPLETED', bookingId, partnerName);
      }, 24000);

      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    },
    [bookingId, _transitionStatus],
  );

  // ─── Actions ────────────────────────────────────────────────────────────

  const callPartner = useCallback(() => {
    if (booking?.partner?.phone) Linking.openURL(`tel:${booking.partner.phone}`);
  }, [booking]);

  const openMaps = useCallback(() => {
    if (!booking) return;
    const { latitude, longitude } = booking.drop;
    const url =
      Platform.OS === 'ios'
        ? `maps://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`
        : `google.navigation:q=${latitude},${longitude}`;
    Linking.openURL(url).catch(() => {});
  }, [booking]);

  // ─── Derived values ──────────────────────────────────────────────────────

  const currentIdx = STATUS_ORDER.indexOf(status);

  const showMap = ['ASSIGNED', 'EN_ROUTE', 'NEARBY', 'ARRIVED'].includes(status as string);

  const statusLabel = useMemo(() => {
    switch (status) {
      case 'ASSIGNED':    return '✓ Partner Assigned';
      case 'EN_ROUTE':    return `🚗 ${etaMin} min में पहुँचेगा`;
      case 'NEARBY':      return '📍 Partner 300m दूर!';
      case 'ARRIVED':     return '🔔 Partner आपके घर पर है!';
      case 'OTP_VERIFIED':return '🔑 OTP Verified';
      case 'IN_PROGRESS': return '🔧 Service चल रही है';
      case 'COMPLETED':   return '✅ Service पूरी हो गई!';
      default:            return 'Partner ढूंढा जा रहा है...';
    }
  }, [status, etaMin]);

  const statusPillColor = useMemo(() => {
    switch (status) {
      case 'ARRIVED':     return C.green;
      case 'NEARBY':      return C.nearbyColor;
      case 'COMPLETED':   return C.green;
      case 'IN_PROGRESS': return C.purple;
      default:            return C.orange;
    }
  }, [status]);

  // TTS scripts
  const trackScriptHi = useMemo(() => {
    switch (status) {
      case 'ASSIGNED':    return `आपकी booking confirm हो गई! एक expert partner assign हो गया है। OTP तैयार रखें।`;
      case 'EN_ROUTE':    return `आपका partner आपकी तरफ आ रहा है। लगभग ${etaMin} मिनट में पहुँचेगा।`;
      case 'NEARBY':      return `आपका partner बस 300 मीटर दूर है! दरवाज़ा खोल कर रखें।`;
      case 'ARRIVED':     return `आपका partner आपके घर पहुँच गया! OTP share करें service शुरू करने के लिए।`;
      case 'OTP_VERIFIED':return `OTP verify हो गया। Service अभी शुरू होने वाली है।`;
      case 'IN_PROGRESS': return `Service चल रही है। Professional काम कर रहे हैं।`;
      case 'COMPLETED':   return `बहुत बढ़िया! Service पूरी हो गई। Feedback ज़रूर दें।`;
      default:            return `Partner ढूंढा जा रहा है। कृपया प्रतीक्षा करें।`;
    }
  }, [status, etaMin]);

  const trackScriptEn = useMemo(() => {
    switch (status) {
      case 'ASSIGNED':    return `Your booking is confirmed! An expert partner has been assigned. Keep your OTP ready.`;
      case 'EN_ROUTE':    return `Your partner is on the way and will arrive in approximately ${etaMin} minutes.`;
      case 'NEARBY':      return `Your partner is just 300 meters away! Please open the door.`;
      case 'ARRIVED':     return `Your partner has arrived! Share your OTP to start the service.`;
      case 'OTP_VERIFIED':return `OTP verified. The service is about to begin.`;
      case 'IN_PROGRESS': return `Your service is in progress.`;
      case 'COMPLETED':   return `Service completed successfully! Please share your feedback.`;
      default:            return `Searching for a nearby partner. Please wait.`;
    }
  }, [status, etaMin]);

  // ─── Loading state ───────────────────────────────────────────────────────

  if (!booking || !partnerLoc) {
    return (
      <View style={s.loadingBox}>
        <Animated.View
          style={{
            transform: [{
              rotate: sheetAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            }],
          }}>
          <Ionicons name="map" size={48} color={C.purple} />
        </Animated.View>
        <Text style={s.loadingText}>Map load हो रहा है...</Text>
        <Text style={s.loadingSubText}>Connecting to provider...</Text>
      </View>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <View style={s.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* ── Map / Status visual ── */}
      {showMap ? (
        <LiveTrackingMap
          partnerLoc={partnerLoc}
          bearing={bearing}
          drop={booking.drop}
          routeRemaining={routeRemaining}
          status={status as string}
          onMapRef={() => {}}
          style={s.map}
        />
      ) : (
        <LinearGradient colors={C.grad} style={s.statusScreen}>
          <View style={s.statusIconWrap}>
            <Ionicons
              name={
                status === 'IN_PROGRESS' || status === 'OTP_VERIFIED'
                  ? 'construct'
                  : 'checkmark-circle'
              }
              size={64}
              color="#fff"
            />
          </View>
          <Animated.Text
            style={[s.statusScreenText, { transform: [{ scale: statusAnim }] }]}>
            {statusLabel}
          </Animated.Text>
          {status === 'IN_PROGRESS' && (
            <Text style={s.statusScreenSub}>Professional आपकी service कर रहा है</Text>
          )}
        </LinearGradient>
      )}

      {/* ── Map overlays ── */}
      {showMap && (
        <View style={s.mapOverlays}>
          {/* ETA pill */}
          <View style={s.etaPill}>
            <Ionicons name="time" size={13} color={C.purple} />
            <View>
              <EtaCountdown etaMin={etaMin} />
              <Text style={s.etaDistText}>{distKm.toFixed(2)} km दूर</Text>
            </View>
          </View>

          {/* Status pill */}
          <Animated.View
            style={[
              s.statusPill,
              { backgroundColor: statusPillColor, transform: [{ scale: statusAnim }] },
            ]}>
            {(status === 'EN_ROUTE' || status === 'NEARBY') && (
              <PulseDot color="#fff" />
            )}
            <Text style={s.statusPillText}>{statusLabel}</Text>
          </Animated.View>

          {/* Speed badge */}
          {speedKmh > 0 && <SpeedBadge speedKmh={speedKmh} />}
        </View>
      )}

      {/* NEARBY banner */}
      {status === 'NEARBY' && showMap && (
        <View style={s.nearbyBanner}>
          <Text style={s.nearbyBannerText}>
            📍 Partner 300m के पास है — दरवाज़ा खोलें!
          </Text>
        </View>
      )}

      {/* ── Back button ── */}
      <TouchableOpacity
        style={s.backBtn}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}>
        <Ionicons name="arrow-back" size={20} color={C.text} />
      </TouchableOpacity>

      {/* ── Bottom sheet ── */}
      <Animated.View
        style={[
          s.sheet,
          {
            transform: [{
              translateY: sheetAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [240, 0],
              }),
            }],
          },
        ]}>
        <View style={s.handle} />

        {/* OTP card (shown when arrived) */}
        {(status === 'ARRIVED' || status === 'NEARBY') && (
          <View style={s.otpCard}>
            <View style={s.otpLeft}>
              <Text style={s.otpTitle}>
                {status === 'ARRIVED' ? 'Partner पहुँच गया!' : 'Partner पास है!'}
              </Text>
              <Text style={s.otpSub}>यह OTP share करें service शुरू करने के लिए</Text>
            </View>
            <View style={s.otpBox}>
              <Text style={s.otpCode}>{booking.otp}</Text>
              <Text style={s.otpLabel}>OTP</Text>
            </View>
          </View>
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.sheetScroll}>

          {/* Service title + Live badge */}
          <View style={s.sheetHeader}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={s.sheetTitle} numberOfLines={1}>{booking.serviceName}</Text>
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

          {/* Address */}
          <View style={s.addrRow}>
            <Ionicons name="location-outline" size={13} color={C.sub} />
            <Text style={s.addrText} numberOfLines={1}>{booking.address}</Text>
          </View>

          {/* Partner card */}
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
                {showMap && (
                  <Text style={s.partnerDist}>
                    📍 {distKm > 0 ? `${distKm.toFixed(2)} km दूर` : 'Locating...'}
                    {speedKmh > 0 ? ` · ${speedKmh} km/h` : ''}
                  </Text>
                )}
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

          {/* Timeline */}
          <View style={s.timeline}>
            {TIMELINE.map((item, i) => {
              const itemIdx = STATUS_ORDER.indexOf(item.key as DisplayStatus);
              const done = itemIdx <= currentIdx;
              const isCurrent = itemIdx === currentIdx;
              const isLast = i === TIMELINE.length - 1;
              return (
                <View key={item.key} style={s.timelineRow}>
                  <View style={s.timelineLeft}>
                    <View style={[s.tlDot, done && s.tlDotDone, isCurrent && s.tlDotCurrent]}>
                      <Ionicons
                        name={item.icon as any}
                        size={11}
                        color={done ? '#fff' : '#ccc'}
                      />
                    </View>
                    {!isLast && (
                      <View style={[s.tlLine, done && !isCurrent && s.tlLineDone]} />
                    )}
                  </View>
                  <View style={s.timelineContent}>
                    <Text style={[s.tlLabel, done && s.tlLabelDone, isCurrent && s.tlLabelCurrent]}>
                      {item.label}
                    </Text>
                    {isCurrent && <Text style={s.tlSubLabel}>{item.subLabel}</Text>}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Fare summary (shown during service) */}
          {['OTP_VERIFIED', 'IN_PROGRESS'].includes(status as string) && (
            <View style={s.fareCard}>
              <Text style={s.fareTitle}>Estimated Bill</Text>
              <View style={s.fareRow}>
                <Text style={s.fareLabel}>Base fare</Text>
                <Text style={s.fareVal}>₹{booking.baseFare}</Text>
              </View>
              <View style={s.fareRow}>
                <Text style={s.fareLabel}>Taxes</Text>
                <Text style={s.fareVal}>₹{booking.taxes}</Text>
              </View>
              {booking.discount > 0 && (
                <View style={s.fareRow}>
                  <Text style={[s.fareLabel, { color: C.green }]}>Discount</Text>
                  <Text style={[s.fareVal, { color: C.green }]}>-₹{booking.discount}</Text>
                </View>
              )}
              <View style={[s.fareRow, s.fareTotalRow]}>
                <Text style={s.fareTotalLabel}>Total</Text>
                <Text style={s.fareTotalVal}>₹{booking.estimate}</Text>
              </View>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const SHEET_RADIUS = 22;

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 16, color: C.sub, fontWeight: '600' },
  loadingSubText: { fontSize: 12, color: C.sub + 'AA' },

  map: { flex: 1 },

  statusScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  statusIconWrap: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  statusScreenText: {
    color: '#fff', fontSize: 22, fontWeight: '900',
    textAlign: 'center', marginBottom: 8,
  },
  statusScreenSub: { color: 'rgba(255,255,255,0.8)', fontSize: 14, textAlign: 'center' },

  mapOverlays: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 56 : 72,
    left: 14,
    right: 14,
    gap: 8,
  },

  etaPill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: C.card,
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9,
    alignSelf: 'flex-start',
    elevation: 6,
    shadowColor: '#000', shadowOpacity: 0.13, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  etaCountdown: { fontSize: 16, fontWeight: '900', color: C.purple, letterSpacing: 1 },
  etaDistText: { fontSize: 10, color: C.sub, marginTop: 1 },

  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8,
    alignSelf: 'flex-start',
    elevation: 6,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 5, shadowOffset: { width: 0, height: 2 },
  },
  statusPillText: { fontSize: 12, fontWeight: '800', color: '#fff' },

  speedBadge: {
    backgroundColor: C.text,
    borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6,
    alignSelf: 'flex-start', alignItems: 'center',
  },
  speedVal: { fontSize: 15, fontWeight: '900', color: '#fff', lineHeight: 17 },
  speedUnit: { fontSize: 9, color: 'rgba(255,255,255,0.65)', fontWeight: '600' },

  nearbyBanner: {
    position: 'absolute',
    left: 14, right: 14,
    bottom: Platform.OS === 'android' ? '61%' : '60%',
    backgroundColor: C.nearbyColor,
    borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
    elevation: 10,
    shadowColor: C.nearbyColor, shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
  },
  nearbyBannerText: { color: '#fff', fontWeight: '800', fontSize: 13, textAlign: 'center' },

  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 12 : 16,
    left: 14,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: C.card,
    alignItems: 'center', justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },

  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: C.card,
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    maxHeight: '60%',
    elevation: 20,
    shadowColor: '#000', shadowOpacity: 0.22, shadowRadius: 18, shadowOffset: { width: 0, height: -5 },
  },
  handle: {
    width: 36, height: 4, backgroundColor: '#D0D0D8',
    borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 4,
  },

  otpCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 14, padding: 14,
    marginHorizontal: 14, marginTop: 8,
    borderWidth: 1.5, borderColor: C.green + '44',
    gap: 12,
  },
  otpLeft: { flex: 1 },
  otpTitle: { fontSize: 14, fontWeight: '800', color: C.green, marginBottom: 3 },
  otpSub: { fontSize: 11, color: C.sub, lineHeight: 15 },
  otpBox: {
    backgroundColor: C.card, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 8,
    alignItems: 'center', borderWidth: 2, borderColor: C.green,
  },
  otpCode: { fontSize: 26, fontWeight: '900', color: C.purple, letterSpacing: 4 },
  otpLabel: { fontSize: 10, color: C.sub, fontWeight: '600', marginTop: 2 },

  sheetScroll: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 24 },
  sheetHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 5,
  },
  sheetHeaderRight: { alignItems: 'flex-end', gap: 8 },
  sheetTitle: { fontSize: 18, fontWeight: '900', color: C.text },
  sheetId: { fontSize: 11, color: C.sub, marginTop: 2 },

  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  liveDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: C.red },
  liveText: { fontSize: 11, color: C.red, fontWeight: '800' },

  addrRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 14 },
  addrText: { flex: 1, fontSize: 12, color: C.sub },

  partnerCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.purpleL,
    borderRadius: 14, padding: 12, marginBottom: 16, gap: 10,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '900', color: '#fff' },
  partnerInfo: { flex: 1 },
  partnerName: { fontSize: 14, fontWeight: '800', color: C.text },
  partnerMeta: { fontSize: 12, color: C.sub, marginTop: 2 },
  partnerDist: { fontSize: 11, color: C.purple, fontWeight: '600', marginTop: 3 },
  partnerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: C.purple,
    alignItems: 'center', justifyContent: 'center',
  },
  iconBtnOutline: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 1.5, borderColor: C.purple,
    alignItems: 'center', justifyContent: 'center',
  },

  timeline: { paddingLeft: 4 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start' },
  timelineLeft: { alignItems: 'center', marginRight: 12, width: 24 },
  tlDot: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#E8E8F0',
    alignItems: 'center', justifyContent: 'center',
  },
  tlDotDone: { backgroundColor: C.green },
  tlDotCurrent: { backgroundColor: C.orange },
  tlLine: {
    width: 2, flex: 1, minHeight: 24,
    backgroundColor: '#E8E8F0', marginVertical: 2,
  },
  tlLineDone: { backgroundColor: C.green },
  timelineContent: { flex: 1, paddingBottom: 16, paddingTop: 2 },
  tlLabel: { fontSize: 13, color: '#AAA', fontWeight: '600' },
  tlLabelDone: { color: C.text, fontWeight: '700' },
  tlLabelCurrent: { color: C.orange, fontWeight: '800' },
  tlSubLabel: { fontSize: 11, color: C.sub, marginTop: 2 },

  fareCard: {
    backgroundColor: C.purpleL,
    borderRadius: 14, padding: 14, marginTop: 8,
  },
  fareTitle: { fontSize: 13, fontWeight: '800', color: C.text, marginBottom: 10 },
  fareRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  fareLabel: { fontSize: 13, color: C.sub },
  fareVal: { fontSize: 13, fontWeight: '600', color: C.text },
  fareTotalRow: {
    borderTopWidth: 1, borderTopColor: C.border,
    marginTop: 6, paddingTop: 8,
  },
  fareTotalLabel: { fontSize: 14, fontWeight: '800', color: C.text },
  fareTotalVal: { fontSize: 16, fontWeight: '900', color: C.purple },
});
