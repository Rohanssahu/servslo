import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { color } from '../../constant';
import ScreenNameEnum from '../../routes/screenName.enum';

const ReviewBookingScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Booking</Text>
        <Text style={styles.headerRight}>Arriving in 15 Min</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Address */}
        <TouchableOpacity
        onPress={()=>{
            navigation.navigate(ScreenNameEnum.AddressesScreen)
        }}
        
        style={styles.addressRow}>
          <Ionicons name="home-outline" size={20} color="#333" />
          <Text style={styles.addressText}>Address | 404 Applications Numbf</Text>
        </TouchableOpacity>

        {/* Expert Service Card */}
        <View style={styles.card}>
          <View style={styles.cardLeft}>
            <Image
              source={{ uri: 'https://via.placeholder.com/50' }}
              style={styles.avatar}
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.cardTitle}>Expert Service</Text>
              <Text style={styles.cardSubtitle}>Duration: 60 min</Text>
            </View>
          </View>
          <Text style={styles.cardPrice}>₹149</Text>
        </View>

        {/* Starter Pack Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Save more with STARTER PACK{"\n"}3 bookings for just ₹149
          </Text>
          <TouchableOpacity style={styles.bannerBtn}>
            <Text style={styles.bannerBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Coupons */}
        <TouchableOpacity style={styles.optionRow}>
          <Ionicons name="pricetag-outline" size={20} color="#2E7D32" />
          <Text style={styles.optionText}>Apply coupons or offers</Text>
          <Ionicons name="chevron-forward" size={20} color="#555" />
        </TouchableOpacity>

        {/* Wallet */}
        <View style={styles.optionRow}>
          <Ionicons name="wallet-outline" size={20} color="#555" />
          <View>
            <Text style={styles.optionText}>Redeem using wallet</Text>
            <Text style={styles.optionSubText}>Credit Balance: ₹0.0</Text>
          </View>
        </View>

        {/* Payment Details */}
        <View style={styles.paymentDetails}>
          <Text style={styles.paymentTitle}>Payment details</Text>
          <View style={styles.detailRow}>
            <Text>Service Charge</Text>
            <Text>₹149.00</Text>
          </View>
          <View style={styles.detailRow}>
            <Text>GST</Text>
            <Text>₹11.32</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Total Payable</Text>
            <Text style={styles.totalAmount}>₹160.32</Text>
          </View>
        </View>

        {/* Payment Method */}
        <TouchableOpacity style={styles.optionRow}>
          <Ionicons name="card-outline" size={20} color="#555" />
          <Text style={styles.optionText}>Payment method</Text>
          <Text style={styles.paymentMethod}>Online</Text>
          <Ionicons name="chevron-forward" size={20} color="#555" />
        </TouchableOpacity>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <TouchableOpacity style={styles.payButton}>
        <Text style={styles.payButtonText}>Proceed to pay ₹160</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReviewBookingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    marginTop:30
  },
  headerTitle: { fontSize: 18, fontWeight: '600', flex: 1, marginLeft: 12 },
  headerRight: { color: '#FF007F', fontSize: 14 },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  addressText: { marginLeft: 8, fontSize: 14, color: '#333' },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#DDD' },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardSubtitle: { fontSize: 12, color: '#888' },
  cardPrice: { fontSize: 16, fontWeight: '600' },
  banner: {
    flexDirection: 'row',
    backgroundColor: '#3B57FF',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerText: { color: '#fff', fontSize: 14, flex: 1 },
  bannerBtn: { backgroundColor: '#000', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  bannerBtnText: { color: '#fff', fontWeight: '600' },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
    borderRadius: 8,
    marginHorizontal: 16,
    justifyContent: 'space-between',
  },
  optionText: { fontSize: 14, flex: 1, marginLeft: 8 },
  optionSubText: { fontSize: 12, color: '#888' },
  paymentDetails: {
    backgroundColor: '#fff',
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 16,
  },
  paymentTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  totalAmount: { fontWeight: '700' },
  paymentMethod: { marginRight: 8, color: '#555' },
  payButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: color.purple,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
