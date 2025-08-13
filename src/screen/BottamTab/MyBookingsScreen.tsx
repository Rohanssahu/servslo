import React from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {color} from '../../constant';
import MaterialIcons from 'react-native-vector-icons/FontAwesome6';
import Icon from '../../component/Icon';
import {icon} from '../../component/Image';
import Tts from 'react-native-tts';
import {hp} from '../../component/utils/Constant';
import {useLanguage} from '../../language/LanguageContext';
import languageStrings from '../../language/languageStrings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenNameEnum from '../../routes/screenName.enum';
import HeaderComponent from '../Feature/HeaderComponent';
import LinearGradient from 'react-native-linear-gradient';
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

    // स्थिति का अनुवाद (optional: आप strings से भी ले सकते हैं)
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
      default:
        statusHindi = 'स्थिति उपलब्ध नहीं है';
    }

    const speech = `${service} सेवा की बुकिंग की है। 
    स्थान: ${address}।
    समय: ${datetime}।
    कमाई: ₹${earning} रुपये।
    स्थिति: ${statusHindi}।`;

    Tts.speak(speech);
  };

  const renderBooking = ({item}: {item: (typeof bookings)[0]}) => (
    <TouchableOpacity 
    onPress={()=>{
      navigation.navigate(ScreenNameEnum.JobInvoiceScreen)
    }}
>
       <LinearGradient
                colors={['#6E39F7', '#8E57FF', '#B78CFF']}
                start={{ x: 0.1, y: 0 }}
                end={{ x: 1, y: 1 }} 
    style={styles.bookingCard}>
      <TouchableOpacity
        style={styles.speakerIcon}
        onPress={() => {
          speakInstruction(item);
        }}>
        <Icon
          source={icon.speaker}
          size={20}
          style={{tintColor: color.purple}}
        />
      </TouchableOpacity>
      <View>
        <Text style={styles.bookingTitle}>{item.service} बुकिंग</Text>
        <Text style={styles.bookingDetails}>{item.address}</Text>
        <View style={styles.earningCard}>
          <Text style={styles.earningLabel}>कमाई</Text>
          <Text style={styles.earningAmount}>₹ {item.earning}</Text>
        </View>
        <Text
          style={[
            styles.bookingTime,
            item.status === 'पूर्ण'
              ? styles.green
              : item.status === 'रद्द'
              ? styles.red
              : styles.orange,
          ]}>
          {item.status} | {item.datetime}
        </Text>
      </View>

      <View style={{alignSelf: 'flex-end'}}>
        <MaterialIcons name="arrow-right" size={25} color="white" />
      </View>
      </LinearGradient>
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

      <View
        style={{
          padding: 16,
          flex: 1,
        }}>
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
  bookingCard: {
    backgroundColor: color.purple,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 16,
  },
  bookingTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  bookingDetails: {
    color: '#e3e3e3',
    fontSize: 18,
  },
  bookingTime: {
    color: '#ffffff',
    fontSize: 18,
    marginTop: 10,
  },
  container: {
    flex: 1,

    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 12,
    color: color.purple,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  service: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
  status: {
    marginTop: 6,
    fontWeight: '700',
  },
  green: {
    color: '#57de26',
    fontWeight: '700',
  },
  red: {
    color: '#ff8f8f',
    fontWeight: '700',
  },
  orange: {
    color: '#ffe047',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#1E90FF',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  earningCard: {
    flexDirection: 'row',
    backgroundColor: '#F3E5F5',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  earningLabel: {
    color: '#6A1B9A',
    fontWeight: '600',
    fontSize: 18,
    marginRight: 6,
  },
  earningAmount: {
    color: '#4A148C',
    fontWeight: 'bold',
    fontSize: 18,
  },
  speakerIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 30,
  },
});
