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
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Tts from 'react-native-tts';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import {useLanguage} from '../../language/LanguageContext';
import languageStrings from '../../language/languageStrings';
import ScreenNameEnum from '../../routes/screenName.enum';
import LinearGradient from 'react-native-linear-gradient';
import {sendOtp} from '../../api/authApi';

const COLORS = {
  primaryDark: '#1E0B5E',
  primary: '#4D2B98',
  primaryLight: '#7B4AD5',
  accent: '#FFC107',
  white: '#FFFFFF',
  bg: '#F7F5FF',
  text: '#1A1535',
  subtext: '#6B618E',
  border: '#DDD6F5',
  borderFocus: '#7B4AD5',
  success: '#16A34A',
  error: '#DC2626',
};

const StepIndicator = ({current, total}: {current: number; total: number}) => (
  <View style={stepStyles.container}>
    {Array.from({length: total}).map((_, i) => (
      <React.Fragment key={i}>
        <View
          style={[
            stepStyles.circle,
            i < current && stepStyles.circleActive,
            i === current && stepStyles.circleCurrent,
          ]}>
          {i < current ? (
            <Icon2 name="check" size={11} color={COLORS.white} />
          ) : (
            <Text
              style={[
                stepStyles.circleText,
                i === current && stepStyles.circleTextActive,
              ]}>
              {i + 1}
            </Text>
          )}
        </View>
        {i < total - 1 && (
          <View style={[stepStyles.line, i < current && stepStyles.lineActive]} />
        )}
      </React.Fragment>
    ))}
  </View>
);

const stepStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  circleCurrent: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.white,
  },
  circleText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
  },
  circleTextActive: {
    color: COLORS.primary,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginHorizontal: 4,
    maxWidth: 40,
  },
  lineActive: {
    backgroundColor: COLORS.accent,
  },
});

const PhoneLogin: React.FC<{navigation: any}> = ({navigation}) => {
  const {lang, toggleLang} = useLanguage();
  const [phone, setPhone] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const strings = languageStrings[lang];

  const speakInstruction = () => {
    Tts.setDefaultLanguage(lang === 'hi' ? 'hi-IN' : 'en-US');
    Tts.speak(strings.tts);
  };

  const validateAndContinue = async () => {
    if (phone.length !== 10) {
      setError(
        lang === 'hi'
          ? 'कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें'
          : 'Please enter a valid 10-digit mobile number',
      );
      return;
    }
    setError('');
    setLoading(true);
    try {
      await sendOtp({phone, country_code: '+91'});
      navigation.navigate(ScreenNameEnum.OTPVerification, {phone});
    } catch (err: any) {
      const code = err?.response?.data?.error;
      if (code === 'TOO_MANY_REQUESTS') {
        setError(
          lang === 'hi'
            ? 'बहुत बार कोशिश की। कुछ देर बाद आज़माएं।'
            : 'Too many requests. Try again later.',
        );
      } else {
        setError(
          lang === 'hi'
            ? 'OTP भेजने में समस्या हुई। पुनः प्रयास करें।'
            : 'Could not send OTP. Please retry.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar backgroundColor={COLORS.primaryDark} barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        <LinearGradient
          colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]}
          style={styles.topSection}
          start={{x: 0.1, y: 0}}
          end={{x: 0.9, y: 1}}>
          <View style={styles.circleDecor} />

          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.langToggleBtn} onPress={toggleLang}>
              <Icon2 name="translate" size={16} color={COLORS.primary} />
              <Text style={styles.langToggleText}>{strings.switchLang}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.speakerBtn} onPress={speakInstruction}>
              <Icon2 name="volume-high" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <StepIndicator current={0} total={3} />

          <Text style={styles.topTitle}>{strings.welcomeTitle}</Text>
          <Text style={styles.topSubtitle}>{strings.loginSubtitle}</Text>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.inputLabel}>{strings.enterPhone}</Text>

          <View
            style={[
              styles.phoneWrapper,
              isFocused && styles.phoneWrapperFocused,
              !!error && styles.phoneWrapperError,
            ]}>
            <View style={styles.countryCode}>
              <Text style={styles.flagEmoji}>🇮🇳</Text>
              <Text style={styles.countryCodeText}>+91</Text>
              <View style={styles.codeDivider} />
            </View>

            <TextInput
              style={styles.phoneInput}
              keyboardType="phone-pad"
              placeholder={strings.placeholder}
              placeholderTextColor="#B0A8CC"
              value={phone}
              onChangeText={text => {
                setPhone(text.replace(/[^0-9]/g, '').slice(0, 10));
                if (error) setError('');
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={10}
              returnKeyType="done"
            />

            {phone.length === 10 && (
              <Icon2 name="check-circle" size={22} color={COLORS.success} style={styles.validIcon} />
            )}
          </View>

          {error ? (
            <View style={styles.errorRow}>
              <Icon2 name="alert-circle-outline" size={14} color={COLORS.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.secureRow}>
            <Icon2 name="shield-check" size={15} color={COLORS.success} />
            <Text style={styles.secureText}>{strings.secureNote}</Text>
          </View>

          <TouchableOpacity
            style={[styles.ctaBtn, (phone.length !== 10 || loading) && styles.ctaBtnDisabled]}
            onPress={validateAndContinue}
            activeOpacity={0.85}
            disabled={loading}>
            <LinearGradient
              colors={
                phone.length === 10 && !loading
                  ? [COLORS.primary, COLORS.primaryLight]
                  : ['#C4BAE0', '#C4BAE0']
              }
              style={styles.ctaBtnGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Text style={styles.ctaBtnText}>{strings.continue}</Text>
                  <Icon2 name="arrow-right" size={20} color={COLORS.white} style={styles.ctaArrow} />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.stepLabel}>
            {strings.step} 1 {strings.of} 3 — {strings.stepPhone}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PhoneLogin;

const styles = StyleSheet.create({
  flex: {flex: 1, backgroundColor: COLORS.white},
  scrollContent: {flexGrow: 1},
  topSection: {
    paddingTop: 50,
    paddingBottom: 40,
    paddingHorizontal: 24,
    overflow: 'hidden',
  },
  circleDecor: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -50,
    right: -60,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  langToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  langToggleText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
  },
  speakerBtn: {
    backgroundColor: COLORS.white,
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
  },
  topTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
    marginTop: 4,
  },
  topSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 6,
    lineHeight: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -24,
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 32,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: -4},
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 10,
  },
  phoneWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    backgroundColor: COLORS.bg,
    height: 58,
    overflow: 'hidden',
  },
  phoneWrapperFocused: {
    borderColor: COLORS.borderFocus,
    backgroundColor: '#F5F1FF',
  },
  phoneWrapperError: {
    borderColor: COLORS.error,
    backgroundColor: '#FFF5F5',
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: '100%',
  },
  flagEmoji: {
    fontSize: 20,
    marginRight: 6,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  codeDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
    marginLeft: 10,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 18,
    color: COLORS.text,
    fontWeight: '600',
    height: '100%',
  },
  validIcon: {
    marginRight: 14,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginLeft: 5,
    flex: 1,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 32,
  },
  secureText: {
    fontSize: 12,
    color: COLORS.success,
    marginLeft: 6,
    fontWeight: '500',
  },
  ctaBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
  },
  ctaBtnDisabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  ctaBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 17,
    paddingHorizontal: 24,
  },
  ctaBtnText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
  },
  ctaArrow: {
    marginLeft: 8,
  },
  stepLabel: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 12,
    color: COLORS.subtext,
  },
});
