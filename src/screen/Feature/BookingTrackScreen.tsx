// src/screens/BookingTrackScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform, Alert, ScrollView, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { getBooking, updateStatus, verifyOTP, completeJob, Booking, BookingStatus, LatLng } from '../../services/api';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { onLocation, startFakeLocation, stopFakeLocation } from '../../services/socket';
import LiveTrackingMap from '../bookingflow/LiveTrackingMap';
import OTPModal from '../bookingflow/OTPModal';
import ScreenNameEnum from '../../routes/screenName.enum';


const BRAND = {
  grad: ['#6E39F7', '#8E57FF', '#B78CFF'],
  purple: '#6E39F7',
  green: '#13B36B',
  text: '#222',
  sub: '#666',
  bg: '#F7F7FB',
  card: '#fff',
};


const kmDistance = (a: LatLng, b: LatLng) => {
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
};
const minutesETA = (km: number, avgSpeedKmph = 22) => Math.max(1, Math.round((km / avgSpeedKmph) * 60));

export default function BookingTrackScreen({ route, navigation }) {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [status, setStatus] = useState<BookingStatus>('ASSIGNED');
  const [partnerLoc, setPartnerLoc] = useState<LatLng | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const mapRef = useRef(null);

  // Load booking and start mock realtime
  useEffect(() => {
    let unsub: (() => void) | null = null;
    (async () => {
      const b = await getBooking(bookingId);
      setBooking(b);
      setStatus(b.status === 'SEARCHING' ? 'ASSIGNED' : b.status); // demo: assume already assigned
      setPartnerLoc(b.pickup);
      startFakeLocation(b.pickup, b.drop);
      unsub = onLocation((loc) => setPartnerLoc(loc));
    })();
    return () => {
      stopFakeLocation();
      unsub?.();
    };
  }, [bookingId]);

  // Status changes based on distance (auto ARRIVED)
  useEffect(() => {
    if (!booking || !partnerLoc) return;
    if ((status === 'ASSIGNED' || status === 'EN_ROUTE') && booking.partner) updateStatus('EN_ROUTE').then(() => setStatus('EN_ROUTE'));

    const d = kmDistance(partnerLoc, booking.drop);
    if (d < 0.08 && !['ARRIVED', 'OTP_VERIFIED', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
      updateStatus('ARRIVED').then(() => setStatus('ARRIVED'));
    }
  }, [partnerLoc, booking, status]);

  const distanceKm = useMemo(() => (partnerLoc && booking ? kmDistance(partnerLoc, booking.drop) : 0), [partnerLoc, booking]);
  const etaMin = useMemo(() => minutesETA(distanceKm), [distanceKm]);

  const callPartner = () => {
    if (!booking?.partner?.phone) return;
    Linking.openURL(`tel:${booking.partner.phone.replace(/\s/g, '')}`);
  };

  const openInMaps = () => {
    if (!booking) return;
    const { latitude, longitude } = booking.drop;
    const label = encodeURIComponent('Customer Location');
    const url = Platform.select({
      ios: `http://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`,
      android: `google.navigation:q=${latitude},${longitude}`,
    }) || '';
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving&dir_action=navigate&destination_place_id=${label}`);
    });
  };

  const verifyOtpAction = async () => {
    if (!booking) return;
    const ok = true
    if (ok) {
      setStatus('OTP_VERIFIED');
      setTimeout(async () => {
        await updateStatus('IN_PROGRESS');
        setStatus('IN_PROGRESS');
      }, 5000);
      // demo auto complete
      setTimeout(async () => {
        await completeJob();
        setStatus('COMPLETED');
      }, 10000);
    } else {
      Alert.alert('गलत OTP', 'कृपया सही 4-अंकों का OTP दर्ज करें।');
    }
  };
  
  useEffect(() => {
    let timer: any;

    if (status === "ARRIVED") {
      timer = setTimeout(() => {
        verifyOtpAction();
      }, 7000); // 7000 ms = 7 sec
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [status]);


  // Navigate to Payment after completed
  useEffect(() => {
    if (status === 'COMPLETED' && booking) {
      const amount = booking.baseFare + booking.taxes - booking.discount;
      navigation.replace(ScreenNameEnum.PaymentScreen, { bookingId, amount });
    }
  }, [status, booking, bookingId, navigation]);

  const statusLabel = useMemo(() => {
    switch (status) {
      case 'ASSIGNED': return 'Partner assigned';
      case 'EN_ROUTE': return 'On the way';
      case 'ARRIVED': return 'Arrived at your location';
      case 'OTP_VERIFIED': return 'OTP verified';
      case 'IN_PROGRESS': return 'Service in progress';
      case 'COMPLETED': return 'Job completed';
      default: return 'Searching';
    }
  }, [status]);

  if (!booking || !partnerLoc) return null;


  
  return (
    <View style={styles.container}>
    {(status === 'ASSIGNED' || status === 'EN_ROUTE' || status === 'ARRIVED') && (
  <LiveTrackingMap partnerLoc={partnerLoc} drop={booking.drop} onMapRef={(r) => (r ? r : null)} style={styles.map} />
)}

{status === 'OTP_VERIFIED' && (
  <View style={styles.centerBox}>
    <Ionicons name="hourglass" size={50} color={BRAND.purple} />
    <Text style={styles.bigText}>Waiting for partner to start job...</Text>
  </View>
)}

{status === 'IN_PROGRESS' && (
  <View style={styles.centerBox}>
    <Ionicons name="construct" size={60} color={BRAND.green} style={{ transform: [{ rotate: '30deg' }] }} />
    <Text style={styles.bigText}>Partner is working...</Text>
  </View>
)}

{status === 'COMPLETED' && (
  <View style={styles.centerBox}>
    <Ionicons name="checkmark-circle" size={60} color="green" />
    <Text style={styles.bigText}>Job Completed 🎉</Text>
  </View>
)}

      {/* Banner */}
      <LinearGradient colors={BRAND.grad} start={{ x: 0.1, y: 0 }} end={{ x: 1, y: 1 }} style={styles.banner}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="time" size={18} color="#fff" />
          <Text style={styles.bannerEta}>  {etaMin} min • {distanceKm.toFixed(1)} km</Text>
        </View>
        <Text style={styles.bannerStatus}>{statusLabel}</Text>
        {status === 'ARRIVED' &&
        <>
        <Text style={[styles.bannerEta,{fontSize:16}]}>Share Otp With Service Partner</Text>
        <View style={styles.badge}>
                          <Text style={styles.otp}>{4892}</Text>
                        </View>
                        </>
                        }

      </LinearGradient>

      {/* Bottom Sheet */}
      <View style={styles.sheet}>
        
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>

            
                        
          <View style={styles.rowBetween}>
            <Text style={styles.title}>{booking.serviceName}</Text>
            <View style={styles.badgeNow}><Text style={styles.badgeNowText}>NOW</Text></View>
          </View>
          <Text style={styles.addr}>{booking.address}</Text>

          {booking.partner && (
            <View style={styles.partnerCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={22} color="#fff" />
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.partnerName}>{booking.partner.name}</Text>
                  <Text style={styles.partnerMeta}>
                    ⭐ {booking.partner.rating.toFixed(2)}  •  {booking.partner.vehicle}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity style={styles.iconBtn} onPress={callPartner}>
                  <Ionicons name="call" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn} onPress={openInMaps}>
                  <Ionicons name="navigate" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
             
            </View>
          )}

          {/* Timeline */}
          <View style={styles.timeline}>
            {[
              { key: 'ASSIGNED', label: 'Partner Accepted' },
              { key: 'EN_ROUTE', label: 'On the Way' },
              { key: 'ARRIVED', label: 'Arrived' },
              { key: 'OTP_VERIFIED', label: 'Started Job' },
              { key: 'IN_PROGRESS', label: 'In Progress' },
              { key: 'COMPLETED', label: 'Job Completed' },
            ].map((it) => {
              const active = activeFrom(status, it.key as BookingStatus);
              return (
                <View key={it.key} style={styles.timelineRow}>
                  <View style={[styles.dot, active && styles.dotActive]} />
                  <Text style={[styles.timelineText, active && styles.timelineTextActive]}>{it.label}</Text>
                </View>
              );
            })}
          </View>

   <View  style={{ height:30}}/>
        </ScrollView>

        {/* Status CTA */}
    
      </View>

    </View>
  );
}



function activeFrom(current: BookingStatus, item: BookingStatus) {
  const order: BookingStatus[] = ['SEARCHING', 'ASSIGNED', 'EN_ROUTE', 'ARRIVED', 'OTP_VERIFIED', 'IN_PROGRESS', 'COMPLETED'];
  return order.indexOf(current) >= order.indexOf(item);
}

const SHEET_RADIUS = 18;

const styles = StyleSheet.create({
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '700',
    color: BRAND.text,
  },
  
  badge: { marginTop: 10, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, alignItems:'center',justifyContent:'center',
    borderWidth: 1, borderColor: '#E5DEFF', backgroundColor: '#F7F3FF' },
  otp: { color: BRAND.purple, fontSize: 24, fontWeight: '900', letterSpacing: 3 },
  container: { flex: 1, backgroundColor: BRAND.bg },
  map: { flex: 1 },
  banner: {
    position: 'absolute',
    top:50, left: 14, right: 14,
    borderRadius: 14, padding: 12,
    elevation: 5, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  bannerEta: { color: '#fff', fontWeight: '700' },
  bannerStatus: { color: '#fff', marginTop: 4, fontSize: 15 },
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: SHEET_RADIUS, borderTopRightRadius: SHEET_RADIUS,
    maxHeight: '60%', paddingHorizontal: 14, paddingTop: 10,
    elevation: 20, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 14, shadowOffset: { width: 0, height: -2 },
  },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 18, fontWeight: '800', color: BRAND.text },
  addr: { color: BRAND.sub, marginTop: 4 },
  badgeNow: { backgroundColor: '#FFE5F2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeNowText: { color: '#E91E63', fontWeight: '700', fontSize: 12 },

  partnerCard: {
    marginTop: 14, backgroundColor: BRAND.card, borderRadius: 14, padding: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: '#EFEFF5',
  },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: BRAND.purple, alignItems: 'center', justifyContent: 'center' },
  partnerName: { fontWeight: '800', color: BRAND.text, fontSize: 15 },
  partnerMeta: { color: BRAND.sub, marginTop: 2 },
  iconBtn: { backgroundColor: BRAND.purple, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },

  timeline: { marginTop: 14, paddingVertical: 8 },
  timelineRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#D6D6E2', marginRight: 8 },
  dotActive: { backgroundColor: BRAND.green },
  timelineText: { color: '#9BA0B3' },
  timelineTextActive: { color: BRAND.text, fontWeight: '600' },

  billCard: { marginTop: 14, backgroundColor: '#fff', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#EFEFF5' },
  billTitle: { fontWeight: '800', color: BRAND.text, marginBottom: 8 },
  line: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 },
  lineLabel: { color: BRAND.sub },
  lineValue: { color: BRAND.text, fontWeight: '600' },
  sep: { height: 1, backgroundColor: '#EEE', marginVertical: 6 },

  bottomCta: { position: 'absolute', left: 14, right: 14, bottom: 14 },
  bottomCtaBg: { borderRadius: 14, alignItems: 'center', paddingVertical: 14 },
  bottomCtaText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
