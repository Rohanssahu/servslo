import React from 'react';
import {View, Text, StyleSheet, StatusBar, TouchableOpacity, Share, Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { color } from '../../constant';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { hp } from '../../component/utils/Constant';
import {useLanguage} from '../../language/LanguageContext';
import languageStrings from '../../language/languageStrings';
const ReferToEarnScreen = ({navigation}) => {
  const referralCode = 'ROHAN1234';
  const {lang} = useLanguage();
  const t = languageStrings[lang];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${t.shareMsg} ${referralCode} ${t.shareMsg2} 🚀`,
      });
    } catch (error) {
      alert(t.sharingFailed);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
           <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerText}>{t.referAndEarn}</Text>
              <View style={{ width: 24 }} />
            </View>
            <View style={{flex: 1, padding: 16, alignItems: 'center', marginTop: 0, backgroundColor: '#f4f3fb'}}>
      <View style={styles.card}>
        <Ionicons name="gift-outline" size={40} color={color.purple} />
        <Text style={styles.benefitText}>{t.referFriendsEarn}</Text>
        <Text style={styles.description}>{t.referDesc}</Text>

        <View style={styles.codeBox}>
          <Text style={styles.codeText}>{referralCode}</Text>
        </View>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={20} color="#fff" />
          <Text style={styles.shareText}>{t.shareCode}</Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
};

export default ReferToEarnScreen;

const styles = StyleSheet.create({
        
        header: {
          backgroundColor: color.purple,
          flexDirection: 'row',
          alignItems: 'center',
          height: hp(10),
          padding: 12,
          justifyContent: 'space-between',
          paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 8 : 44,
        },
        headerText: { color: '#fff', 
          fontSize: 20, fontWeight: '600' },
      iconTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
      },
  container: {
    flex: 1,
    backgroundColor: color.purple,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  benefitText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    color: '#333',
  },
  description: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginVertical: 10,
  },
  codeBox: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 15,
  },
  codeText: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#333',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.purple,
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  shareText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
});
