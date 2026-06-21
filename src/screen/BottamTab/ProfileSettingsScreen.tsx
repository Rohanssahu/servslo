
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { color } from '../../constant';
import { useLanguage } from '../../language/LanguageContext';
import languageStrings from '../../language/languageStrings';
import ScreenNameEnum from '../../routes/screenName.enum';
import HeaderComponent from '../Feature/HeaderComponent';
import {useDispatch, useSelector} from 'react-redux';
import {logout, setUser} from '../../redux/feature/authSlice';
import {getProfile} from '../../api/userApi';
import {logoutApi, deleteAccountApi} from '../../api/authApi';

export default function ProfileSettingsScreen({ navigation }) {
  const {lang, toggleLang} = useLanguage();
  const t = languageStrings[lang];
  const dispatch = useDispatch();
  const userData = useSelector((s: any) => s.auth?.userData);
  const [location, setLocation] = useState('Mumbai');

  useEffect(() => {
    getProfile()
      .then(user => dispatch(setUser(user)))
      .catch(() => {}); // graceful — show cached Redux data on failure
  }, []);

  const handleLogout = () => {
    Alert.alert(t.logoutTitle, t.logoutConfirm, [
      {text: t.no},
      {
        text: t.yes,
        onPress: async () => {
          try {
            await logoutApi();
          } catch {}
          dispatch(logout());
          navigation.navigate(ScreenNameEnum.PhoneLogin);
        },
      },
    ]);
  };

  const handleDeleteData = () => {
    Alert.alert(t.deleteDataTitle, t.deleteDataConfirm, [
      {text: t.no},
      {
        text: t.yes,
        onPress: async () => {
          try {
            await deleteAccountApi();
          } catch {}
          dispatch(logout());
          navigation.navigate(ScreenNameEnum.PhoneLogin);
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      {/* Header */}
      <HeaderComponent
        language={lang}
        setLanguage={toggleLang}
        location={userData?.phone ? `+91 ${userData.phone}` : 'Mumbai'}
        notificationCount={0}
        onNotificationPress={() => navigation.navigate(ScreenNameEnum.NotificationList)}
      />

      {/* Referral Banner */}
      <TouchableOpacity
        style={styles.referralCard}
        onPress={() => navigation.navigate(ScreenNameEnum.ReferToEarnScreen)}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="gift" size={22} color="#E91E63" />
          <Text style={styles.referralText}> {t.earnReferral}</Text>
        </View>
        <Text style={styles.referralBtn}>{t.referNow}</Text>
      </TouchableOpacity>

      {/* Menu List */}
      <View style={styles.settingsBox}>
        <SettingsItem
          icon="person-outline"
          label={t.profileMenu}
          subLabel={t.profileSub}
          onPress={() => navigation.navigate(ScreenNameEnum.UserInfoForm, {profile: true})}
        />
        <SettingsItem
          icon="home-outline"
          label={t.addressesMenu}
          subLabel={t.addressesSub}
          onPress={() => navigation.navigate(ScreenNameEnum.AddressesScreen)}
        />
        <SettingsItem
          icon="play-circle-outline"
          label={t.howToUseMenu}
          subLabel={t.howToUseSub}
          onPress={() => navigation.navigate(ScreenNameEnum.HowToUseScreen)}
        />
        <SettingsItem
          icon="document-text-outline"
          label={t.policiesMenu}
          subLabel={t.policiesSub}
          onPress={() => navigation.navigate(ScreenNameEnum.PoliciesScreen)}
        />
        <SettingsItem
          icon="chatbubble-ellipses-outline"
          label={t.helpMenu}
          subLabel={t.helpSub}
          onPress={() => navigation.navigate(ScreenNameEnum.HelpSupportScreen)}
        />
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>{t.logout}</Text>
      </TouchableOpacity>

      {/* Delete Data */}
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteData}>
        <Text style={styles.deleteText}>{t.deleteData}</Text>
      </TouchableOpacity>

      {/* Version */}
      <Text style={styles.versionText}>{t.version} 1.0.43</Text>
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
