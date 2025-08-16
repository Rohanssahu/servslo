
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { color } from '../../constant';
import { useLanguage } from '../../language/LanguageContext';
import languageStrings from '../../language/languageStrings';
import ScreenNameEnum from '../../routes/screenName.enum';
import HeaderComponent from '../Feature/HeaderComponent';

export default function ProfileSettingsScreen({ navigation }) {
  const { language, setLanguage } = useLanguage();
  const strings = languageStrings[language];

  const handleLogout = () => {
    Alert.alert('लॉग आउट', 'क्या आप वाकई लॉग आउट करना चाहते हैं?', [
      { text: 'नहीं' },
      { text: 'हाँ', onPress: () => { navigation.navigate(ScreenNameEnum.PhoneLogin) } },
    ]);
  };

  const handleDeleteData = () => {
    Alert.alert('डेटा डिलीट करें', 'क्या आप वाकई अपना डेटा डिलीट करना चाहते हैं?', [
      { text: 'नहीं' },
      { text: 'हाँ', onPress: () => console.log('Data Deleted') },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <HeaderComponent
        language={language}
        setLanguage={setLanguage}
        location="Indore, MP"
        notificationCount={5}
        onNotificationPress={() => console.log('Notification clicked')}
      />

      {/* Referral Banner */}
      <TouchableOpacity
        style={styles.referralCard}
        onPress={() => navigation.navigate(ScreenNameEnum.ReferToEarnScreen)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="gift" size={22} color="#E91E63" />
          <Text style={styles.referralText}> Earn ₹50 for every referral</Text>
        </View>
        <Text style={styles.referralBtn}>Refer now</Text>
      </TouchableOpacity>

      {/* Menu List */}
      <View style={styles.settingsBox}>
        <SettingsItem
          icon="person-outline"
          label="Profile"
          subLabel="Update personal information"
          onPress={() => navigation.navigate(ScreenNameEnum.PartnerInfoForm, { profile: true })}
        />
  
        <SettingsItem
          icon="home-outline"
          label="Addresses"
          subLabel="Manage saved addresses"
          onPress={() => navigation.navigate(ScreenNameEnum.AddressesScreen)}
        />
               <SettingsItem
          icon="play-circle-outline"
          label="ऐप का उपयोग कैसे करें (वीडियो)"
          subLabel="How to use app"
          onPress={() => navigation.navigate(ScreenNameEnum.HowToUseScreen)}
        />
        <SettingsItem
          icon="document-text-outline"
          label="Policies"
          subLabel="Terms of use, Privacy policy and others"
          onPress={() => console.log('Policies')}
        />
        <SettingsItem
          icon="chatbubble-ellipses-outline"
          label="Help & support"
          subLabel="Reach out to us in case you have a question"
          onPress={() => console.log('Help')}
        />
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>

      {/* Delete Data */}
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteData}>
        <Text style={styles.deleteText}>Delete my data</Text>
      </TouchableOpacity>

      {/* Version */}
      <Text style={styles.versionText}>App version 1.0.43</Text>
    </ScrollView>
  );
}

const SettingsItem = ({ icon, label, subLabel, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Icon name={icon} size={22} color={color.purple} />
    <View style={{ marginLeft: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.subLabel}>{subLabel}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  referralCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FFD6D6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  referralText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#E91E63',
  },
  referralBtn: {
    fontSize: 14,
    color: '#6A1B9A',
    fontWeight: '600',
  },
  settingsBox: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    paddingHorizontal:20,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  subLabel: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFB2B2',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D32F2F',
  },
  deleteBtn: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFB2B2',
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D32F2F',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#888',
    fontSize: 13,
    marginBottom: 20,
  },
});
