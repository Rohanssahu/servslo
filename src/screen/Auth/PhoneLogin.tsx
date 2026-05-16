import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Tts from 'react-native-tts';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '../../component/Icon';
import {icon} from '../../component/Image';
import {color} from '../../constant';

import ScreenNameEnum from '../../routes/screenName.enum';
import { useLanguage } from '../../language/LanguageContext';
import languageStrings from '../../language/languageStrings';

const {width} = Dimensions.get('window');

const SERVICE_ICONS = ['⚡', '🔧', '🚿', '🧹', '❄️'];

const PhoneLogin: React.FC<{navigation: any}> = ({navigation}) => {
 const {lang, toggleLang} = useLanguage();

const language = lang;
  console.log('language',language);
  
  const [phone, setPhone] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const strings = languageStrings[language];
  const isValid = phone.length === 10;

  const speakInstruction = () => {
    Tts.setDefaultLanguage(language === 'hi' ? 'hi-IN' : 'en-US');
    Tts.speak(strings.tts);
  };

  return (
    <LinearGradient
      colors={['#6E39F7', '#8E57FF', '#B78CFF']}
      start={{x: 0.1, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <TouchableOpacity
        style={styles.languageToggle}
        onPress={() => {toggleLang()}}>
        <Text style={styles.langText}>{strings?.switchLang}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.speakerIcon} onPress={speakInstruction}>
        <Icon source={icon.speaker} size={24} style={{tintColor: color.purple}} />
      </TouchableOpacity>

      {/* Brand area */}
      <View style={styles.brandArea}>
        <View style={styles.logoCircle}>
          <Icon source={icon.touch} size={44} style={{tintColor: '#fff'}} />
        </View>
        <Text style={styles.appName}>ServsLo</Text>
        <Text style={styles.tagline}>
          {language === 'hi'
            ? 'घर बैठे सेवाएं बुक करें'
            : 'Book Home Services Near You'}
        </Text>
        <View style={styles.serviceChips}>
          {SERVICE_ICONS.map((emoji, i) => (
            <View key={i} style={styles.chip}>
              <Text style={styles.chipEmoji}>{emoji}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom card */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.card}>
          <Text style={styles.title}>{strings?.phoneLogin}</Text>
          <Text style={styles.subtitle}>
            {language === 'hi'
              ? 'जारी रखने के लिए अपना मोबाइल नंबर दर्ज करें'
              : 'Enter your mobile number to continue'}
          </Text>

          <View
            style={[
              styles.phoneInputWrapper,
              isFocused && styles.inputFocused,
              isValid && styles.inputValid,
            ]}>
            <View style={styles.countryCodeBox}>
              <Text style={styles.flagText}>🇮🇳</Text>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <View style={styles.dividerLine} />
            <TextInput
              style={styles.phoneInput}
              keyboardType="phone-pad"
              placeholder="00000 00000"
              placeholderTextColor="#bbb"
              value={phone}
              onChangeText={text =>
                setPhone(text.replace(/[^0-9]/g, '').slice(0, 10))
              }
              maxLength={10}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {isValid && <Text style={styles.checkmark}>✓</Text>}
          </View>

          {phone.length > 0 && phone.length < 10 && (
            <Text style={styles.hintText}>
              {language === 'hi'
                ? `${10 - phone.length} अंक और चाहिए`
                : `${10 - phone.length} more digits needed`}
            </Text>
          )}

          <TouchableOpacity
            onPress={() =>
              isValid && navigation.navigate(ScreenNameEnum.OTPVerification)
            }
            style={[styles.button, !isValid && styles.buttonDisabled]}
            activeOpacity={isValid ? 0.8 : 1}>
            <LinearGradient
              colors={isValid ? ['#6E39F7', '#4d2b98'] : ['#ccc', '#bbb']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.buttonGradient}>
              <Text style={styles.buttonText}>{strings.continue}</Text>
              <Text style={styles.buttonArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>{language === 'hi' ? 'या' : 'OR'}</Text>
            <View style={styles.orLine} />
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate(ScreenNameEnum.TabNavigator)}
            style={styles.skipBtn}>
            <Text style={styles.skipText}>
              {language === 'hi' ? 'अभी नहीं, बाद में' : 'Skip for now'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            {language === 'hi'
              ? 'जारी रखकर आप हमारी गोपनीयता नीति से सहमत हैं'
              : 'By continuing, you agree to our Terms & Privacy Policy'}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default PhoneLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  languageToggle: {
    position: 'absolute',
    top: 55,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  langText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  speakerIcon: {
    position: 'absolute',
    top: 47,
    right: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 30,
  },
  brandArea: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 100,
  },
  logoCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  appName: {
    fontSize: 34,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 6,
    textAlign: 'center',
  },
  serviceChips: {
    flexDirection: 'row',
    marginTop: 18,
  },
  chip: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  chipEmoji: {
    fontSize: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 24,
    width: width * 0.92,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: -4},
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
    lineHeight: 20,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 14,
    height: 58,
    marginBottom: 8,
    overflow: 'hidden',
    backgroundColor: '#fafafa',
  },
  inputFocused: {
    borderColor: color.purple,
    backgroundColor: '#fff',
  },
  inputValid: {
    borderColor: '#22c55e',
  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  flagText: {
    fontSize: 20,
    marginRight: 4,
  },
  countryCodeText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  dividerLine: {
    width: 1,
    height: 30,
    backgroundColor: '#ddd',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 17,
    color: '#000',
    letterSpacing: 1,
  },
  checkmark: {
    color: '#22c55e',
    fontSize: 20,
    fontWeight: '700',
    paddingRight: 14,
  },
  hintText: {
    fontSize: 12,
    color: '#ef4444',
    marginBottom: 12,
    marginLeft: 4,
  },
  button: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  buttonArrow: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
  orText: {
    color: '#aaa',
    fontSize: 13,
    marginHorizontal: 12,
    fontWeight: '500',
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 14,
  },
  skipText: {
    color: color.purple,
    fontSize: 15,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 11,
    color: '#bbb',
    textAlign: 'center',
    lineHeight: 16,
  },
});
