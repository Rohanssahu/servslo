import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { color } from '../../constant';
import { hp } from '../../component/utils/Constant';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import LinearGradient from 'react-native-linear-gradient';
const invoiceData = {
  invoice_id: 'INV-2025-00034',
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
  payment_status: 'Paid',
  payment_method: 'UPI',
  job_duration: '1 hr 45 min',
  started_at: '10:00 AM',
  completed_at: '11:45 AM',
  provider_notes: 'Customer requested additional deep clean. Took 45 mins extra.'
};

const JobInvoiceScreen = ({navigation}) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
     <LinearGradient
            colors={['#6E39F7', '#8E57FF', '#B78CFF']}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 1, y: 1 }}  style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerText}>Invoice</Text>
              <View style={{ width: 24 }} />
            </LinearGradient>
      <View style={styles.card}>
      
        <View style={[styles.iconTitle,{  alignSelf:'center'}]}>
          <MaterialCommunityIcons name="file-document-outline" size={22} color="#333" />
          <Text style={styles.title}>Job Invoice</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.rowBetween}>
          <Text style={styles.labelBold}>
            Booking ID: <Text style={styles.value}>{invoiceData.booking_id}</Text>
          </Text>
          <Text style={styles.value}>{invoiceData.date}</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.section}>
          <View style={styles.iconTitle}>
            <FontAwesome name="user" size={16} color="#333" />
            <Text style={styles.sectionTitle}>Customer:</Text>
          </View>
          <Text style={styles.value}>{invoiceData.customer_name}</Text>
          <Text style={styles.value}>{invoiceData.customer_address}</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.section}>
          <View style={styles.iconTitle}>
            <MaterialCommunityIcons name="broom" size={16} color="#333" />
            <Text style={styles.sectionTitle}>Service:</Text>
          </View>
          <Text style={styles.value}>{invoiceData.service_type}</Text>
          <Text style={styles.value}>
            Time: {invoiceData.started_at} - {invoiceData.completed_at}
          </Text>
        </View>
        <View style={styles.line} />
        <View style={styles.section}>
          <View style={styles.iconTitle}>
            <FontAwesome name="inr" size={16} color="#333" />
            <Text style={styles.sectionTitle}>Charges:</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.value}>Base Service</Text>
            <Text style={styles.value}>₹{invoiceData.base_price}</Text>
          </View>
          {invoiceData.extra_work.map((item, index) => (
            <View key={index} style={styles.rowBetween}>
              <Text style={styles.value}>{item.description}</Text>
              <Text style={styles.value}>₹{item.amount}</Text>
            </View>
          ))}

          <View style={styles.line} />
          <View style={styles.rowBetween}>
            <Text style={styles.valueBold}>Subtotal:</Text>
            <Text style={styles.valueBold}>₹{invoiceData.total_before_tax}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.value}>GST (18%):</Text>
            <Text style={styles.value}>₹{invoiceData.tax['GST (18%)']}</Text>
          </View>
        </View>

        <View style={styles.line} />

        <View style={styles.rowBetween}>
          <View style={styles.iconTitle}>
            <Foundation name="clipboard-notes" size={20} color="#000" />
            <Text style={[styles.total]}>Total :</Text>
          </View>
          <View>
        <Text style={styles.total}>Paid ₹{invoiceData.total_amount}</Text>
        <Text style={styles.value}>(Paid via {invoiceData.payment_method})</Text>
        </View>
        </View>

      </View>
            <TouchableOpacity style={styles.item} onPress={() => {}}>
              <Icon name="help-circle-outline" size={22} color={color.purple} />
              <Text style={styles.label}>सहायता और समर्थन</Text>
            </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    alignSelf:'center',
    marginTop:20
  },
  label: {
    marginLeft: 12,
    fontSize: 16,
    color: color.purple,
  },
  container: {
    backgroundColor: '#fff',
 
   
    flex: 1
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 4,
    width: '100%',
    maxWidth: 400,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color:'#000'
  },
    
    header: {
      backgroundColor: color.purple,
      flexDirection: 'row',
      alignItems: 'center',
      height:hp(10),
      padding: 12,
      borderRadius: 10,
      justifyContent: 'space-between',
      paddingTop: 20,
    },
    headerText: { color: '#fff', 
      fontSize: 20, fontWeight: '600' },
  iconTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 6,
      color:'#000'
  },
  section: {
    marginVertical: 10
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 16,
      color:'#000'
  },
  value: {
    fontSize: 15,
      color:'#000',
    marginBottom: 2
  },
  valueBold: {
    fontSize: 15,
    fontWeight: '600',
      color:'#000'
  },
  labelBold: {
    fontSize: 15,
    fontWeight: '600',
      color:'#000'
  },
  total: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000'
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  line: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10
  }
});

export default JobInvoiceScreen;
