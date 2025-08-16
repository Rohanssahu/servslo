import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Tts from 'react-native-tts';

import Icon from '../../component/Icon';
import { icon } from '../../component/Image';
import { color } from '../../constant';
import { useLanguage } from '../../language/LanguageContext';
import languageStrings from '../../language/languageStrings';
import { hp } from '../../component/utils/Constant';
import ScreenNameEnum from '../../routes/screenName.enum';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const OTPVerification: React.FC = ({navigation}) => {
  const { language, setLanguage } = useLanguage();
  const [otp, setOtp] = useState('');

  const strings = languageStrings[language];

  const speakInstruction = () => {
    Tts.setDefaultLanguage(language === 'hi' ? 'hi-IN' : 'en-US');
    Tts.speak(strings.otpTts);
  };

  const handleResendOtp = () => {
    // Call your resend OTP API here
    Tts.speak(strings.otpResent);
  };

  return (
    <LinearGradient
             colors={['#6E39F7', '#8E57FF', '#B78CFF']}
             start={{ x: 0.1, y: 0 }}
             end={{ x: 1, y: 1 }}  style={styles.container}>
      {/* Language Switch */}
      <TouchableOpacity
        style={styles.languageToggle}
        onPress={() => setLanguage(language === 'hi' ? 'en' : 'hi')}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          {strings.switchLang}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.speakerIcon} onPress={speakInstruction}>
        <Icon source={icon.speaker} size={28} style={{ tintColor: color.purple }} />
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>{strings.otpVerify}</Text>

        <Text style={styles.labelText}>{strings.enterOtp}</Text>

        <TextInput
          style={styles.otpInput}
          keyboardType="number-pad"
          placeholder={strings.otpPlaceholder}
          placeholderTextColor="#888"
          value={otp}
          onChangeText={setOtp}
          maxLength={6}
        />

        <TouchableOpacity onPress={handleResendOtp}>
          <Text style={styles.resendText}>{strings.resendOtp}</Text>
        </TouchableOpacity>

        <View style={{ marginVertical: 30 }}>
          <Icon
            source={icon.touch}
            style={{ tintColor: color.purple }}
            size={150}
          />
        </View>

        <TouchableOpacity 
        onPress={()=>{
          navigation.navigate(ScreenNameEnum.PartnerInfoForm,{profile:false})
        }}
        style={styles.button}>
          <Text style={styles.buttonText}>{strings.verifyOtp}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default OTPVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.purple,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
    right: 30,
    zIndex: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 30,
    width: width * 0.9,
    height: hp(65),
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: color.purple,
    marginBottom: 20,
  },
  labelText: {
    fontSize: 22,
    color: color.purple,
    fontWeight: '600',
    marginBottom: 10,
  },
  otpInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 18,
    textAlign: 'center',
    color: '#000',
    marginBottom: 10,
  },
  resendText: {
    fontSize: 14,
    color: color.purple,
    fontWeight: '500',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  button: {
    backgroundColor: color.purple,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
