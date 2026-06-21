import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Tts from 'react-native-tts';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import {useLanguage} from '../../language/LanguageContext';
import languageStrings from '../../language/languageStrings';
import ScreenNameEnum from '../../routes/screenName.enum';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch} from 'react-redux';
import {loginSuccess, setTempToken} from '../../redux/feature/authSlice';
import {sendOtp, verifyOtp} from '../../api/authApi';

const {width} = Dimensions.get('window');

const COLORS = {
  primaryDark: '#1E0B5E',
  primary: '#4D2B98',
  primaryLight: '#7B4AD5',
  primaryBg: '#EDE7FF',
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

const OTP_LENGTH = 4;
const RESEND_TIMEOUT = 60;

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

const OTPCell = ({
  value,
  isFocused,
  hasError,
}: {
  value: string;
  isFocused: boolean;
  hasError: boolean;
}) => (
  <View
    style={[
      otpStyles.cell,
      isFocused && otpStyles.cellFocused,
      !!value && otpStyles.cellFilled,
      hasError && otpStyles.cellError,
    ]}>
    {value ? (
      <Text style={otpStyles.cellText}>{value}</Text>
    ) : isFocused ? (
      <View style={otpStyles.cursor} />
    ) : null}
  </View>
);

const otpStyles = StyleSheet.create({
  cell: {
    width: (width - 48 - 3 * 12) / 4,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellFocused: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0EBFF',
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
  },
  cellFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryBg,
  },
  cellError: {
    borderColor: COLORS.error,
    backgroundColor: '#FFF5F5',
  },
  cellText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
  },
  cursor: {
    width: 2,
    height: 24,
    backgroundColor: COLORS.primary,
  },
});

const OTPVerification: React.FC<{navigation: any; route: any}> = ({navigation, route}) => {
  const {lang, toggleLang} = useLanguage();
  const strings = languageStrings[lang];
  const phone: string = route?.params?.phone || '';
  const dispatch = useDispatch();

  const [otp, setOtp] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [resendTimer, setResendTimer] = useState(RESEND_TIMEOUT);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    setResendTimer(RESEND_TIMEOUT);
    setCanResend(false);
    timerRef.current = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const speakInstruction = () => {
    Tts.setDefaultLanguage(lang === 'hi' ? 'hi-IN' : 'en-US');
    Tts.speak(strings.otpTts);
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setOtp('');
    setError('');
    try {
      await sendOtp({phone, country_code: '+91'});
      Tts.speak(strings.otpResent);
      startTimer();
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch {
      setError(
        lang === 'hi'
          ? 'OTP फिर से भेजने में समस्या हुई'
          : 'Could not resend OTP. Try again.',
      );
    }
  };

  const handleOtpChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH);
    setOtp(cleaned);
    setError('');
    setFocusedIndex(Math.min(cleaned.length, OTP_LENGTH - 1));
  };

  const handleVerify = async () => {
    if (otp.length !== OTP_LENGTH) {
      setError(
        lang === 'hi'
          ? 'कृपया 4 अंकों का OTP दर्ज करें'
          : 'Please enter the complete 4-digit OTP',
      );
      return;
    }
    setIsVerifying(true);
    try {
      const res = await verifyOtp({phone, country_code: '+91', otp});
      if (res.is_new_user) {
        dispatch(setTempToken(res.temp_token));
        navigation.navigate(ScreenNameEnum.UserInfoForm, {profile: false});
      } else {
        dispatch(
          loginSuccess({
            user: res.user,
            accessToken: res.access_token,
            refreshToken: res.refresh_token,
          }),
        );
        navigation.navigate(ScreenNameEnum.TabNavigator);
      }
    } catch (err: any) {
      const code = err?.response?.data?.error;
      const remaining = err?.response?.data?.attempts_remaining;
      if (code === 'INVALID_OTP') {
        setError(
          lang === 'hi'
            ? `गलत OTP${remaining != null ? ` — ${remaining} कोशिश बची` : ''}`
            : `Invalid OTP${remaining != null ? ` — ${remaining} attempt(s) left` : ''}`,
        );
      } else {
        setError(
          lang === 'hi'
            ? 'OTP सत्यापन में समस्या हुई। पुनः प्रयास करें।'
            : 'Verification failed. Please try again.',
        );
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const maskedPhone = phone
    ? `${phone.slice(0, 2)}${'*'.repeat(6)}${phone.slice(-2)}`
    : '**********';

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
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Icon2 name="arrow-left" size={20} color={COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.langToggleBtn} onPress={toggleLang}>
              <Icon2 name="translate" size={15} color={COLORS.primary} />
              <Text style={styles.langToggleText}>{strings.switchLang}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.speakerBtn} onPress={speakInstruction}>
              <Icon2 name="volume-high" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <StepIndicator current={1} total={3} />

          <Text style={styles.topTitle}>{strings.otpVerify}</Text>
          <Text style={styles.topSubtitle}>
            {strings.otpSentTo}{' '}
            <Text style={styles.phoneHighlight}>+91 {maskedPhone}</Text>
          </Text>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.inputLabel}>{strings.enterOtp}</Text>

          {/* Hidden single TextInput drives the keyboard */}
          <TextInput
            ref={inputRef}
            value={otp}
            onChangeText={handleOtpChange}
            keyboardType="number-pad"
            maxLength={OTP_LENGTH}
            style={styles.hiddenInput}
            caretHidden
            onFocus={() => setFocusedIndex(Math.min(otp.length, OTP_LENGTH - 1))}
            onBlur={() => setFocusedIndex(-1)}
          />

          {/* Visual OTP cells */}
          <TouchableOpacity
            style={styles.otpRow}
            onPress={() => inputRef.current?.focus()}
            activeOpacity={1}>
            {Array.from({length: OTP_LENGTH}).map((_, index) => (
              <OTPCell
                key={index}
                value={otp[index] || ''}
                isFocused={focusedIndex === index}
                hasError={!!error}
              />
            ))}
          </TouchableOpacity>

          {error ? (
            <View style={styles.errorRow}>
              <Icon2 name="alert-circle-outline" size={14} color={COLORS.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.resendRow}>
            <Text style={styles.resendLabel}>{strings.didntReceive} </Text>
            {canResend ? (
              <TouchableOpacity onPress={handleResendOtp}>
                <Text style={styles.resendLink}>{strings.resendOtp}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.resendTimer}>
                {strings.resendIn} {resendTimer}{strings.seconds}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.ctaBtn, otp.length !== OTP_LENGTH && styles.ctaBtnDisabled]}
            onPress={handleVerify}
            activeOpacity={0.85}
            disabled={isVerifying}>
            <LinearGradient
              colors={
                otp.length === OTP_LENGTH
                  ? [COLORS.primary, COLORS.primaryLight]
                  : ['#C4BAE0', '#C4BAE0']
              }
              style={styles.ctaBtnGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              {isVerifying ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Text style={styles.ctaBtnText}>{strings.verifyOtp}</Text>
                  <Icon2 name="arrow-right" size={20} color={COLORS.white} style={styles.ctaArrow} />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.stepLabel}>
            {strings.step} 2 {strings.of} 3 — {strings.stepOTP}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default OTPVerification;

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
  backBtn: {
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
  langToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
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
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.white,
    marginTop: 4,
  },
  topSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 6,
  },
  phoneHighlight: {
    color: COLORS.accent,
    fontWeight: '700',
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
    marginBottom: 20,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginLeft: 5,
    flex: 1,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  resendLabel: {
    fontSize: 13,
    color: COLORS.subtext,
  },
  resendLink: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  resendTimer: {
    fontSize: 13,
    color: COLORS.subtext,
    fontWeight: '600',
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
