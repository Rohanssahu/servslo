import React from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {color} from '../../constant';
import ScreenNameEnum from '../../routes/screenName.enum';
import HeaderComponent from '../Feature/HeaderComponent';
import {useLanguage} from '../../language/LanguageContext';
import languageStrings from '../../language/languageStrings';
import Tts from 'react-native-tts';
import {icon} from '../../component/Image';
import Icon from '../../component/Icon';

const bookings = [
  {
    id: '1',
    service: 'एसी रिपेयर',
    address: '23, नेहरू नगर, इंदौर',
    datetime: '25 जुलाई, सुबह 11:00 बजे',
    earning: 450,
    status: 'पूर्ण',
  },
  {
    id: '2',
    service: 'इलेक्ट्रीशियन',
    address: 'राम नगर, इंदौर',
    datetime: '26 जुलाई, दोपहर 3:00 बजे',
    earning: 300,
    status: 'रद्द',
  },
  {
    id: '3',
    service: 'प्लंबर',
    address: 'एमजी रोड, इंदौर',
    datetime: '27 जुलाई, सुबह 10:30 बजे',
    earning: 600,
    status: 'चालू',
  },
];

export default function MyBookingsScreen({navigation}) {
  const {language, setLanguage} = useLanguage();
  const strings = languageStrings[language];

  const speakInstruction = booking => {
    const {service, address, datetime, earning, status} = booking;
    Tts.setDefaultLanguage('hi-IN');
    let statusHindi = '';
    switch (status) {
      case 'पूर्ण':
        statusHindi = 'बुकिंग पूरी हो चुकी है';
        break;
      case 'रद्द':
        statusHindi = 'बुकिंग रद्द कर दी गई है';
        break;
      case 'चालू':
        statusHindi = 'बुकिंग चालू है';
        break;
    }
    const speech = `${service} सेवा की बुकिंग की है। स्थान: ${address}। समय: ${datetime}। कमाई: ₹${earning} रुपये। स्थिति: ${statusHindi}।`;
    Tts.speak(speech);
  };

  const renderBooking = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate(ScreenNameEnum.BookingDetailsScreen)}>
      <View style={styles.card}>
        {/* Top Row */}
     
        

        <View style={styles.idContainer}>
        <Text style={styles.idLabel}>बुकिंग-ID</Text>
        <Text style={styles.idValue}>BK-{item.id}</Text>
      </View>

        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <Ionicons name="construct-outline" size={28} color={color.purple} />
            <Text style={styles.serviceTitle}>{item.service} बुकिंग</Text>
          </View>

          <TouchableOpacity
            style={styles.speakerBtn}
            onPress={() => speakInstruction(item)}>
            <Icon
              source={icon.speaker}
              size={18}
              style={{tintColor: color.purple}}
            />
          </TouchableOpacity>
        </View>


        {/* Address */}
        <Text style={styles.address}>{item.address}</Text>

        {/* Time & Status */}
        <View style={styles.rowBetween}>
          <Text style={styles.datetime}>{item.datetime}</Text>
          <View
            style={[
              styles.statusBadge,
              item.status === 'पूर्ण'
                ? styles.greenBadge
                : item.status === 'रद्द'
                ? styles.redBadge
                : styles.orangeBadge,
            ]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        {/* Earning & Arrow */}
        <View style={styles.rowBetween}>
          <View style={styles.earningBox}>
            <Text style={styles.earningLabel}>कमाई</Text>
            <Text style={styles.earningValue}>₹ {item.earning}</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={28} color="#777" />
        </View>
      </View>
      <View style={styles.line} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HeaderComponent
        language={language}
        setLanguage={setLanguage}
        location="Indore, MP"
        notificationCount={5}
        onNotificationPress={() => console.log('Notification clicked')}
      />

      <View style={{padding: 16, flex: 1}}>
        <Text style={styles.header}>मेरी बुकिंग्स</Text>
        <FlatList
          data={bookings}
          keyExtractor={item => item.id}
          renderItem={renderBooking}
          contentContainerStyle={{paddingBottom: 20}}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    color: color.purple,
  },
  card: {
  
padding:10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,

    marginHorizontal:5
  },
  row: {flexDirection: 'row', alignItems: 'center'},
  rowBetween: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  serviceTitle: {fontSize: 18, fontWeight: '700', marginLeft: 8, color: '#333'},
  address: {color: '#666', marginTop: 6, fontSize: 15},
  datetime: {color: '#444', fontSize: 14, marginTop: 8},
  earningBox: {
    marginTop: 12,
    backgroundColor: '#F3E5F5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  earningLabel: {color: '#6A1B9A', fontSize: 15, fontWeight: '600', marginRight: 6},
  earningValue: {color: '#4A148C', fontSize: 15, fontWeight: '700'},
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: 8,
  },
  statusText: {color: '#fff', fontWeight: '700', fontSize: 12},
  greenBadge: {backgroundColor: '#4CAF50'},
  redBadge: {backgroundColor: '#F44336'},
  orangeBadge: {backgroundColor: '#FF9800'},
  speakerBtn: {
    backgroundColor: '#f1f1f1',
    padding: 6,
    borderRadius: 20,
  },
  line: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f2e6ff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius:8,
    marginBottom: 8,
  },
  idLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: color.purple,
    marginRight: 5,
  },
  idValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: color.darkPurple,
  },
  
});
