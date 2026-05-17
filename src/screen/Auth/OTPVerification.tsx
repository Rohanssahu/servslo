import React, {useState, useRef, useEffect} from 'react';
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
import {useLanguage} from '../../language/LanguageContext';
import languageStrings from '../../language/languageStrings';
import ScreenNameEnum from '../../routes/screenName.enum';

const {width} = Dimensions.get('window');
const OTP_LENGTH = 6;
const BOX_SIZE = Math.floor((width * 0.92 - 48 - 40) / OTP_LENGTH);

const OTPVerification: React.FC<{navigation: any}> = ({navigation}) => {
  const {lang: language} = useLanguage();
  const strings = languageStrings[language];
  const [otpDigits, setOtpDigits] = useState<string[]>(
    Array(OTP_LENGTH).fill(''),
  );
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 300);
  }, []);

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otpDigits];
    newOtp[index] = digit;
    setOtpDigits(newOtp);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (otpDigits[index]) {
        const newOtp = [...otpDigits];
        newOtp[index] = '';
        setOtpDigits(newOtp);
      } else if (index > 0) {
        const newOtp = [...otpDigits];
        newOtp[index - 1] = '';
        setOtpDigits(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(60);
    setCanResend(false);
    setOtpDigits(Array(OTP_LENGTH).fill(''));
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
    Tts.speak(strings.otpResent);
  };

  const isComplete = otpDigits.every(d => d !== '');

  const activeIndex = otpDigits.findIndex(d => d === '');

  const speakInstruction = () => {
    Tts.setDefaultLanguage(language === 'hi' ? 'hi-IN' : 'en-US');
    Tts.speak(strings.otpTts);
  };

  return (
    <LinearGradient
      colors={['#6E39F7', '#8E57FF', '#B78CFF']}
      start={{x: 0.1, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.speakerIcon} onPress={speakInstruction}>
        <Icon source={icon.speaker} size={24} style={{tintColor: color.purple}} />
      </TouchableOpacity>

      {/* Top area */}
      <View style={styles.topArea}>
        <View style={styles.iconBg}>
          <Text style={styles.lockEmoji}>🔐</Text>
        </View>
        <Text style={styles.topTitle}>{strings.otpVerify}</Text>
        <Text style={styles.topSubtitle}>
          {language === 'hi'
            ? 'OTP आपके मोबाइल नंबर पर भेजा गया है'
            : 'OTP has been sent to your mobile number'}
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {language === 'hi' ? 'OTP दर्ज करें' : 'Enter OTP'}
          </Text>

          {/* 6 Individual OTP Boxes */}
          <View style={styles.otpRow}>
            {otpDigits.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => {
                  inputRefs.current[index] = ref;
                }}
                style={[
                  styles.otpBox,
                  digit ? styles.otpBoxFilled : null,
                  !isComplete && index === (activeIndex === -1 ? OTP_LENGTH - 1 : activeIndex)
                    ? styles.otpBoxActive
                    : null,
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={text => handleChange(text, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                caretHidden
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Timer / Resend */}
          <View style={styles.timerRow}>
            {!canResend ? (
              <Text style={styles.timerText}>
                {language === 'hi'
                  ? `OTP फिर से भेजें (${timer}s)`
                  : `Resend OTP in ${timer}s`}
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendActive}>
                  {language === 'hi' ? '🔄 OTP फिर से भेजें' : '🔄 Resend OTP'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.button, !isComplete && styles.buttonDisabled]}
            onPress={() =>
              isComplete &&
              navigation.navigate(ScreenNameEnum.UserInfoForm, {
                profile: false,
              })
            }
            activeOpacity={isComplete ? 0.8 : 1}>
            <LinearGradient
              colors={isComplete ? ['#6E39F7', '#4d2b98'] : ['#ccc', '#bbb']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.buttonGradient}>
              <Text style={styles.buttonText}>{strings.verifyOtp}</Text>
              <Text style={styles.buttonArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.noteText}>
            {language === 'hi'
              ? 'OTP प्राप्त नहीं हुआ? अपना SMS इनबॉक्स जांचें'
              : "Didn't receive OTP? Check your SMS inbox"}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default OTPVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.22)',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
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
  topArea: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 110,
  },
  iconBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  lockEmoji: {
    fontSize: 40,
  },
  topTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
  },
  topSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.82)',
    marginTop: 8,
    textAlign: 'center',
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 24,
    textAlign: 'center',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpBox: {
    width: BOX_SIZE,
    height: BOX_SIZE + 8,
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: color.purple,
    backgroundColor: '#f7f7f7',
  },
  otpBoxFilled: {
    borderColor: color.purple,
    backgroundColor: '#f0ebff',
  },
  otpBoxActive: {
    borderColor: '#6E39F7',
    borderWidth: 2,
    backgroundColor: '#fff',
  },
  timerRow: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 13,
    color: '#999',
  },
  resendActive: {
    fontSize: 15,
    color: color.purple,
    fontWeight: '700',
  },
  button: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
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
  noteText: {
    fontSize: 12,
    color: '#bbb',
    textAlign: 'center',
  },
});
