import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenNameEnum from '../../routes/screenName.enum';
import { hp } from '../../component/utils/Constant';

const BRAND = {
  grad: ['#6E39F7', '#8E57FF', '#B78CFF'],
  purple: '#6E39F7',
  text: '#222',
  sub: '#666',
  card: '#fff',
  bg: '#F7F7FB',
};

// Static invoice data (demo)
const invoiceData = {
  booking_id: 'BOOK12345',
  date: '30 July 2025',
  customer_name: 'Aman Verma',
  customer_address: 'Flat 203, Green Heights, Andheri East, Mumbai',
  service_type: 'Bathroom Cleaning',
  base_price: 200,
  extra_work: [
    { description: 'Extra Bathroom Cleaning', amount: 100 },
    { description: 'Heavy Stain Removal', amount: 50 }
  ],
  total_before_tax: 350,
  tax: { 'GST (18%)': 63 },
  total_amount: 413,
  payment_method: 'UPI',
  started_at: '10:00 AM',
  completed_at: '11:45 AM'
};

export default function BookingDetailsScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    setTimeout(() => {
      setBooking({
        bookingId: 'BK-102938',
        status: 'On the Way', // "Pending" / "On the Way" / "Partner Arrived"
        partner: {
          name: 'Ravi Kumar',
          rating: 4.8,
          vehicle: 'Maruti Eeco',
          distance_km: 1.2
        }
      });
      setLoading(false);
    }, 800);
  }, []);

  const handleCancelBooking = () => {
    const distance = booking.partner.distance_km;
    const perKmCharge = 20;

    if (distance >= 2) {
      Alert.alert('Cannot Cancel', 'Partner is too close to your location.');
      return;
    }

    if (distance > 0 && distance < 2) {
      const deduction = perKmCharge * distance;
      Alert.alert(
        'Cancel Booking',
        `Partner is ${distance.toFixed(1)} km away. ₹${deduction.toFixed(2)} will be deducted.`,
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes, Cancel',
            onPress: () => {
              setBooking({ ...booking, status: 'Cancelled' });
              Alert.alert('Booking Cancelled');
            }
          }
        ]
      );
    } else {
      setBooking({ ...booking, status: 'Cancelled' });
      Alert.alert('Booking Cancelled');
    }
  };

  if (loading || !booking) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={BRAND.purple} />
        <Text style={{ marginTop: 10, color: BRAND.sub }}>Loading booking…</Text>
      </View>
    );
  }

  const canCancel =
    booking.status !== 'Partner Arrived' &&
    booking.status !== 'Cancelled' &&
    booking.status !== 'Completed';

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={BRAND.grad} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Booking Details</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Booking Card */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.bookingId}>#{booking.bookingId}</Text>
            <Text style={styles.date}>{invoiceData.date}</Text>
          </View>

          {/* Status */}
          <View style={styles.statusBox}>
            <Ionicons name="bicycle-outline" size={18} color={BRAND.purple} />
            <Text style={styles.statusText}>
              {booking.partner ? booking.status : 'Finding a Partner'}
            </Text>
          </View>

          {/* Partner */}
          {booking.partner && (
            <View style={styles.partnerBox}>
              <Ionicons name="person-circle" size={50} color={BRAND.purple} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.partnerName}>{booking.partner.name}</Text>
                <Text style={styles.partnerMeta}>
                  ⭐ {booking.partner.rating} • {booking.partner.vehicle}
                </Text>
                <Text style={styles.partnerMeta}>📍 {booking.partner.distance_km} km away</Text>
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                             <TouchableOpacity style={styles.iconBtn} onPress={()=>{}}>
                               <Ionicons name="call" size={18} color="#fff" />
                             </TouchableOpacity>
                             <TouchableOpacity style={styles.iconBtn} onPress={()=>{}}>
                               <Ionicons name="chatbubble-ellipses-outline" size={18} color="#fff" />
                             </TouchableOpacity>
                           </View>
            </View>
          )}

      
        </View>
        <TouchableOpacity
          disabled={!booking.partner}
          onPress={() => navigation.navigate(ScreenNameEnum.BookingTrackScreen, { bookingId: booking.bookingId })}
          style={{  }}
        >
          <LinearGradient colors={BRAND.grad} style={styles.cta}>
            <Text style={styles.ctaText}>{booking.partner ? 'Track Partner' : 'Assigning Partner…'}</Text>
          </LinearGradient>
        </TouchableOpacity>
        {/* Instruction Box */}
        <View style={[styles.card,{marginBottom:0}]}>
          <View style={styles.sectionTitleRow}>
            <MaterialCommunityIcons name="message-text-outline" size={18} color={BRAND.purple} />
            <Text style={styles.sectionTitle}>Instructions for Partner</Text>
          </View>
          <Text style={styles.instructionHint}>
            Add any note for the cleaner before they arrive (e.g., "Please bring ladder", "Flat no. 204").
          </Text>
          <TouchableOpacity
            style={styles.addInstructionBtn}
            onPress={() => navigation.navigate(ScreenNameEnum.InstructionScreen, { bookingId: booking.bookingId })}
          >
            <Ionicons name="add-circle-outline" size={20} color={BRAND.purple} />
            <Text style={{ color: BRAND.purple, fontWeight: "600", marginLeft: 6 }}>Add/Edit Instruction</Text>
          </TouchableOpacity>
        </View>

        {/* Service Info */}
        <View style={[styles.card,]}>
          <View style={styles.sectionTitleRow}>
            <MaterialCommunityIcons name="broom" size={18} color={BRAND.purple} />
            <Text style={styles.sectionTitle}>Service Details</Text>
          </View>
          <Text style={styles.value}>{invoiceData.service_type}</Text>
          <Text style={styles.value}>
            {invoiceData.started_at} - {invoiceData.completed_at}
          </Text>
          <Text style={styles.value}>
            Address: - {invoiceData.customer_address}
          </Text>
        </View>

        {/* Charges */}
        <View style={styles.card}>
          <View style={styles.sectionTitleRow}>
            <Foundation name="clipboard-notes" size={18} color={BRAND.purple} />
            <Text style={styles.sectionTitle}>Bill Summary</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.value}>Service Charges</Text>
            <Text style={styles.value}>₹{invoiceData.total_before_tax}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.value}>GST (18%)</Text>
            <Text style={styles.value}>₹{invoiceData.tax['GST (18%)']}</Text>
          </View>
          <View style={styles.line} />
          <View style={styles.rowBetween}>
            <Text style={styles.total}>Total</Text>
            <Text style={styles.total}>₹{invoiceData.total_amount}</Text>
          </View>
        </View>

        <View style={styles.line} />
        {canCancel && (
          <TouchableOpacity style={{  marginVertical:10,alignItems:'center',justifyContent:'center'}} onPress={handleCancelBooking}>
       
              <Text style={[styles.ctaText,{color:'#FF4B2B',fontSize:18}]}>Cancel Booking</Text>
        
          </TouchableOpacity>
        )}
  <View style={styles.line} />
 
   
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', height: hp(10),
    padding: 14, justifyContent: 'space-between',
    borderBottomLeftRadius: 10, borderBottomRightRadius: 10
  },
  headerText: { color: '#fff', fontSize: 20, fontWeight: '600' },

  card: {
     borderRadius: 14, padding: 16, marginBottom: 16,
    
  },

  bookingId: { fontWeight: '700', fontSize: 16, color: BRAND.purple },
  date: { color: BRAND.sub, fontSize: 13 },

  statusBox: { marginTop: 8, borderRadius: 8, padding: 8, flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: '#F2E8FF' },
  statusText: { color: BRAND.purple, fontWeight: '700' },

  partnerBox: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  partnerName: { fontSize: 16, fontWeight: '700', color: BRAND.text },
  partnerMeta: { color: BRAND.sub, fontSize: 13, marginTop: 2 },

  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { marginLeft: 6, fontSize: 15, fontWeight: '700', color: BRAND.text },

  value: { fontSize: 14, color: BRAND.text },
  total: { fontSize: 16, fontWeight: 'bold', color: BRAND.text },

  line: { height: 1, backgroundColor: '#eee', marginVertical: 8 },

  cta: { borderRadius: 14, alignItems: 'center', paddingVertical: 14,height:55,paddingHorizontal:20 },
  ctaText: { color: '#fff', fontWeight: '900', fontSize: 16 },

  actionRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  smallBtn: { flexDirection: "row", alignItems: "center", padding: 10, borderRadius: 10, flex: 1, marginHorizontal: 4, justifyContent: "center" },
  smallBtnText: { color: "#fff", fontWeight: "600", marginLeft: 6 },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  instructionHint: { fontSize: 13, color: BRAND.sub, marginBottom: 8 },
  addInstructionBtn: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  iconBtn: { backgroundColor: BRAND.purple, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },

});
