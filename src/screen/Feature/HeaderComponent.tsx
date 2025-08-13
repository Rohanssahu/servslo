import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { color } from '../../constant';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../../routes/screenName.enum';
import LinearGradient from 'react-native-linear-gradient';

const HeaderComponent = ({ 
  language, 
  setLanguage, 
  location = 'Indore, MP', 
  notificationCount = 0, 
  onNotificationPress 
}) => {

  const navigation = useNavigation()
  return (
    <LinearGradient
            colors={['#6E39F7', '#8E57FF', '#B78CFF']}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 1, y: 1 }} style={styles.headerContainer}>
      
      {/* Left Side: Language Toggle + Location */}
      <View style={styles.leftWrapper}>
        {/* Language Switch */}
        <TouchableOpacity onPress={() => setLanguage(language === 'hi' ? 'en' : 'hi')} style={styles.languageWrapper}>
          <MaterialIcons name="translate" size={18} color="#fff" />
          <Text style={styles.langText}>{language === 'hi' ? 'ENGLISH' : 'HINDI'}</Text>
        </TouchableOpacity>

        {/* Location */}
        <View style={styles.locationWrapper}>
          <Icon name="location-outline" size={18} color="#fff" />
          <Text style={styles.locationText}>{location}</Text>
        </View>
      </View>

      {/* Notification Bell with Badge */}
      <TouchableOpacity style={styles.bellContainer} onPress={()=>{
        navigation.navigate(ScreenNameEnum.NotificationList)
      }}>
        <Icon name="notifications-outline" size={26} color={color.purple} />
        {notificationCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notificationCount}</Text>
          </View>
        )}
      </TouchableOpacity>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 25 : 50,
    paddingBottom: 12,
    backgroundColor: color.purple,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  leftWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  languageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  langText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 5,
  },
  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#fff',
  },
  bellContainer: {
    position: 'relative',
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 12,
  },
  badge: {
    position: 'absolute',
    right: -4,
    top: -4,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default HeaderComponent;
