import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { color } from '../../constant';
import { hp } from '../../component/utils/Constant';
import { useLanguage } from '../../language/LanguageContext';
import languageStrings from '../../language/languageStrings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenNameEnum from '../../routes/screenName.enum';
import { useRoute } from '@react-navigation/native';
import HeaderComponent from '../Feature/HeaderComponent';

export default function ProfileSettingsScreen({ navigation }) {
  const { language, setLanguage } = useLanguage();
  const strings = languageStrings[language];
  const route = useRoute();

  const handlePress = (label) => {
    console.log(`${label} pressed`);
  };

  const handleLogout = () => {
    Alert.alert('लॉग आउट', 'क्या आप वाकई लॉग आउट करना चाहते हैं?', [
      { text: 'नहीं' },
      { text: 'हाँ', onPress: () => {navigation.navigate(ScreenNameEnum.PhoneLogin)} },
    ]);
  };

  const checkAppUpdate = () => {
    Linking.openURL('https://play.google.com/store/apps/details?id=com.partnerapp'); // Replace with actual URL
  };

  const giveFeedback = () => {
    Linking.openURL('mailto:support@yourapp.com?subject=Feedback'); // Replace with actual email
  };

  return (
    <ScrollView style={styles.container}>
              <HeaderComponent 
  language={language}
  setLanguage={setLanguage}
  location="Indore, MP"
  notificationCount={5}
  onNotificationPress={() => console.log('Notification clicked')}
/>

      <View style={{ padding: 16, flex: 1 }}>
        <Text style={styles.title}>प्रोफ़ाइल और सेटिंग्स</Text>

        <TouchableOpacity style={styles.item} onPress={() => {
          navigation.navigate(ScreenNameEnum.PartnerInfoForm, { profile: true })
        }}>
          <Icon name="person-outline" size={22} color={color.purple} />
          <Text style={styles.label}>मेरी प्रोफ़ाइल</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => {
          navigation.navigate(ScreenNameEnum.ReferToEarnScreen)
        }}>
          <Icon name="gift-outline" size={22} color={color.purple} />
          <Text style={styles.label}>रेफ़र करें और कमाएँ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => {
          navigation.navigate(ScreenNameEnum.HowToUseScreen)
        }}>
          <Icon name="play-circle-outline" size={22} color={color.purple} />
          <Text style={styles.label}>ऐप का उपयोग कैसे करें (वीडियो)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => {
          navigation.navigate(ScreenNameEnum.HelpSupportScreen)
        }}>
          <Icon name="help-circle-outline" size={22} color={color.purple} />
          <Text style={styles.label}>सहायता और समर्थन (WhatsApp / कॉल)</Text>
        </TouchableOpacity>

        {/* ✅ नया सेक्शन */}

        <TouchableOpacity style={styles.item} onPress={giveFeedback}>
          <Icon name="chatbox-ellipses-outline" size={22} color={color.purple} />
          <Text style={styles.label}>फीडबैक / सुझाव दें</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={checkAppUpdate}>
          <Icon name="cloud-download-outline" size={22} color={color.purple} />
          <Text style={styles.label}>ऐप अपडेट करें / वर्जन देखें</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={handleLogout}>
          <Icon name="log-out-outline" size={22} color={color.purple} />
          <Text style={styles.label}>लॉग आउट करें</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
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
    backgroundColor: '#F8FAFF',
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
    marginBottom: 20,
    color: color.purple,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  label: {
    marginLeft: 12,
    fontSize: 16,
    color: color.purple,
  },
});
