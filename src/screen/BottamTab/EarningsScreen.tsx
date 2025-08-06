import React, { useRef } from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {color} from '../../constant';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLanguage } from '../../language/LanguageContext';
import languageStrings from '../../language/languageStrings';
import { hp } from '../../component/utils/Constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import WithdrawalSheet from '../modal/WithdrawalSheet';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import HeaderComponent from '../Feature/HeaderComponent';
const earningsData = [
    {
      id: '1',
      service: 'इलेक्ट्रीशियन',
      address: 'राम नगर, इंदौर',
      date: '22 जुलाई 2025',
      amount: 450,
      status: 'पूर्ण',
    },
    {
      id: '2',
      service: 'एसी रिपेयर',
      address: 'नेहरू नगर, इंदौर',
      date: '21 जुलाई 2025',
      amount: 600,
      status: 'पूर्ण',
    },
    {
      id: '3',
      service: 'प्लंबर',
      address: 'एमजी रोड, इंदौर',
      date: '20 जुलाई 2025',
      amount: 300,
      status: 'लंबित',
    },
  ];
  

export default function EarningsScreen() {
  const total = earningsData.reduce((sum, item) => sum + item.amount, 0);
  const {language, setLanguage} = useLanguage();
  const strings = languageStrings[language];

  const bottomSheetRef = useRef<BottomSheetModal>(null);

const handleWithdraw = () => {
  bottomSheetRef.current?.present();
};

const handleOptionSelect = (type: 'online' | 'cash') => {
  bottomSheetRef.current?.dismiss();
  if (type === 'online') {
    // Navigate or Show QR/UPI Payment
    Alert.alert('Online Transfer', 'Navigating to QR/UPI payment screen...');
    // navigation.navigate('UPIPayment');
  } else {
    // Start cash payment flow
    Alert.alert('Cash Selected', 'Cash payment flow started...');
    // navigation.navigate('CashPayment');
  }
};


  const renderItem = ({item}: {item: typeof earningsData[0]}) => (
    <View style={styles.card}>
      <Text style={styles.service}>{item.service}</Text>
      <Text style={styles.address}>{item.address}</Text>
      <Text style={styles.date}>{item.date}</Text>
      <View style={styles.row}>
        <Text style={styles.amount}>₹ {item.amount}</Text>
        <Text
          style={[
            styles.status,
            item.status === 'पूर्ण' ? styles.green : styles.orange,
          ]}>
          स्थिति: {item.status}
        </Text>
      </View>
    </View>
  );
  
  return (
    <BottomSheetModalProvider>
    <View style={styles.container}>
    <HeaderComponent 
  language={language}
  setLanguage={setLanguage}
  location="Indore, MP"
  notificationCount={5}
  onNotificationPress={() => console.log('Notification clicked')}
/>


              <View style={{
                    padding: 16,flex:1
              }}>
      <Text style={styles.header}>मेरी कमाई</Text>

      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>कुल कमाई</Text>
        <Text style={styles.totalAmount}>₹ {total}</Text>
      </View>

   
      <View style={styles.bonusBox}>
        <Text style={styles.bonusText}>🎉 बोनस: आपने 3 बार 5 ⭐ रेटिंग पाई!</Text>
        <Text style={styles.bonusText}>🎁 ₹ 150 का बोनस जोड़ा गया है</Text>
      </View>
      <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
        <Icon name="account-balance-wallet" size={22} color="#fff" />
        <Text style={styles.withdrawText}>बैंक में ट्रांसफर करें</Text>
      </TouchableOpacity>

    <View style={{
        flex:1,marginTop:20
    }}>

<Text style={styles.header}>लेन-देन का विवरण</Text>
      <FlatList
        data={earningsData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 20}}
      />
      </View>
    </View>
    <WithdrawalSheet
  bottomSheetRef={bottomSheetRef}
  onOptionSelect={handleOptionSelect}
/>
    </View>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
    languageToggle: {
        position: 'absolute',
        top: 50,
        left: 30,
        zIndex: 10,
      },
      bellIcon: {
        position: 'absolute',
        top: 40,
        right: 15,
        zIndex: 10,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
      },
  container: {
    flex: 1,

    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 12,
    color:color.purple
  },
  totalBox: {
    backgroundColor: color.purple,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: '#fff',
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: color.purple,
  },
  amount: {
    fontSize:20,
    color: color.purple,
    fontWeight: '700',
  },
  status: {
    marginTop: 4,
    fontWeight: '700',
    fontSize:18
  },
  green: {
    color: 'green',
  },
  orange: {
    color: 'orange',
  },
  withdrawButton: {
    marginTop: 20,
    backgroundColor: color.purple,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  withdrawText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  bonusBox: {
    backgroundColor: '#FFF9EC',
    padding: 12,
    borderRadius: 8,
    borderColor: 'green',
    borderWidth: 1,
  },
  bonusText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  service: {
    fontSize: 22,
    fontWeight: '700',
    color: color.purple,
  },
  address: {
    fontSize: 18,
    color: color.purple,
    marginBottom: 2,
  },
  
});
