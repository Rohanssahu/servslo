// components/NotificationList.tsx
import React from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { hp } from '../../component/utils/Constant';
import { useLanguage } from '../../language/LanguageContext';
import languageStrings from '../../language/languageStrings';
import { color } from '../../constant';
import ScreenNameEnum from '../../routes/screenName.enum';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from '../../component/Icon';
import { icon } from '../../component/Image';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
const notifications = [
  {
    id: '1',
    title: 'Booking Accepted',
    message: 'Your service provider has accepted your booking.',
    time: '2 mins ago',
    icon: 'check-circle-outline',
    type: 'booking',
  },
  {
    id: '2',
    title: 'Partner Arrived',
    message: 'Your provider has arrived at your location.',
    time: '5 mins ago',
    icon: 'map-marker-check-outline',
    type: 'booking',
  },
  {
    id: '3',
    title: 'Work Started',
    message: 'The service has now started. Sit back and relax!',
    time: '10 mins ago',
    icon: 'play-circle-outline',
    type: 'booking',
  },
  {
    id: '4',
    title: 'Booking Completed',
    message: 'Your service has been completed. Please rate your experience.',
    time: '30 mins ago',
    icon: 'check-bold',
    type: 'booking',
  },
  {
    id: '5',
    title: '🔥 Special Offer Just for You!',
    message: 'Get ₹50 off your next booking. Use code: WELCOME50',
    time: '1 hour ago',
    icon: 'sale',
    type: 'offer',
  },
];

const NotificationList = ({navigation}) => {
    const {language, setLanguage} = useLanguage();
    const strings = languageStrings[language];
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.notificationCard}>
      <MaterialCommunityIcons name={item.icon} size={36} color={color.purple} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
               {/* Top Header Bar */}
               <View style={styles.header}>


      <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon2 name="arrow-left" size={24} color="#fff" />
              </TouchableOpacity>

  <Text style={styles.headerTitle}>Notification</Text>

  <TouchableOpacity
    style={styles.headerButtonRight}
    onPress={() => {
      navigation.navigate(ScreenNameEnum.NotificationList);
    }}>
    <Icon source={icon.speaker} size={20} />
  </TouchableOpacity>
</View>

<View style={{
  flex:1,padding:16
}}>


      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      </View>
    </View>
  );
};

export default NotificationList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
  languageToggle: {
    position: 'absolute',
    top: 50,
    left: 30,
    zIndex: 10,
  },
  speakerIcon: {
    position: 'absolute',
    top: 40,
    right: 15,
    zIndex: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    elevation: 2,
    borderWidth:1,
    borderColor:color.purple
  },
  icon: {
    marginRight: 12,
    marginTop: 4,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
  },
  message: {
    color: '#555',
    fontSize: 14,
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.purple,
    height: hp(10),
    paddingHorizontal: 16,
    paddingTop: 40, // For status bar height
  },
  
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  
  headerButton: {
    padding: 8,
  },
  
  headerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  headerButtonRight: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 10,
  }
  
});
