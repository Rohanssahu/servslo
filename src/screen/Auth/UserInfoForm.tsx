import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  StatusBar,
  Modal,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Tts from 'react-native-tts';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import {useLanguage} from '../../language/LanguageContext';
import languageStrings from '../../language/languageStrings';
import Icon from '../../component/Icon';
import {icon} from '../../component/Image';
import {color} from '../../constant';
import ScreenNameEnum from '../../routes/screenName.enum';
import {useRoute} from '@react-navigation/native';
import TermsAndConditionsModal from './TermsAndConditionsModal';
import {useDispatch, useSelector} from 'react-redux';
import {loginSuccess, setUser} from '../../redux/feature/authSlice';
import {completeProfile} from '../../api/authApi';
import {updateProfile as patchProfile} from '../../api/userApi';
import {store} from '../../redux/Store';

const {width} = Dimensions.get('window');

const UserInfoForm = ({navigation}: {navigation: any}) => {
  const {lang, toggleLang} = useLanguage();
  const language = lang;
  const strings = languageStrings[language];
  const route = useRoute();
  const {profile} = (route.params as any) || {};
  const dispatch = useDispatch();
  const existingUser = useSelector((s: any) => s.auth?.userData);

  const [name, setName] = useState(profile && existingUser?.name ? existingUser.name : '');
  const [gender, setGender] = useState(profile && existingUser?.gender ? existingUser.gender : '');
  const [photo, setPhoto] = useState<string | null>(profile && existingUser?.photo_url ? existingUser.photo_url : null);
  const [showModal, setShowModal] = useState(false);
  const [showPhotoSheet, setShowPhotoSheet] = useState(false);
  const [loading, setLoading] = useState(false);

  const ttsSpeak = (text: string) => {
    Tts.stop();
    Tts.setDefaultLanguage(language === 'hi' ? 'hi-IN' : 'en-US');
    Tts.speak(text);
  };

  const openCamera = async () => {
    setShowPhotoSheet(false);
    const result = await launchCamera({mediaType: 'photo', saveToPhotos: false});
    if (!result.didCancel && result.assets?.length) {
      setPhoto(result.assets[0].uri ?? null);
    }
  };

  const openGallery = async () => {
    setShowPhotoSheet(false);
    const result = await launchImageLibrary({mediaType: 'photo', selectionLimit: 1});
    if (!result.didCancel && result.assets?.length) {
      setPhoto(result.assets[0].uri ?? null);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowModal(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const isFormValid = name.trim().length > 0 && gender !== '';

  const genderOptions = [
    {key: 'male', label: strings.male, emoji: '👨'},
    {key: 'female', label: strings.female, emoji: '👩'},
  ];

  return (
    <LinearGradient
      colors={['#6E39F7', '#8E57FF', '#B78CFF']}
      start={{x: 0.1, y: 0}}
      end={{x: 1, y: 1}}
      style={{flex: 1}}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Back / Language Toggle */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => {
          if (profile) {
            navigation.goBack();
          } else {
            toggleLang()
          }
        }}>
        {profile ? (
          <Icon2 name="arrow-left" size={22} color="#fff" />
        ) : (
          <Text style={styles.langText}>{strings.switchLang}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.speakerIcon}
        onPress={() => ttsSpeak(strings.title)}>
        <Icon source={icon.speaker} size={24} style={{tintColor: color.purple}} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* Top heading */}
        <View style={styles.topArea}>
          <Text style={styles.topTitle}>
            {language === 'hi' ? 'लगभग हो गया! 🎉' : 'Almost There! 🎉'}
          </Text>
          <Text style={styles.topSubtitle}>
            {language === 'hi'
              ? 'अपना नाम और फ़ोटो जोड़ें'
              : 'Add your name and photo to get started'}
          </Text>
        </View>

        <View style={styles.card}>

          {/* Photo Upload */}
          <Text style={styles.sectionLabel}>
            {language === 'hi' ? 'प्रोफ़ाइल फ़ोटो' : 'Profile Photo'}
          </Text>

          <TouchableOpacity
            style={styles.photoWrapper}
            onPress={() => setShowPhotoSheet(true)}
            activeOpacity={0.85}>
            {photo ? (
              <Image source={{uri: photo}} style={styles.photoPreview} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Icon2 name="camera-plus-outline" size={40} color="#fff" />
                <Text style={styles.photoPlaceholderText}>
                  {language === 'hi' ? 'फ़ोटो लें' : 'Add Photo'}
                </Text>
              </View>
            )}
            <View style={styles.cameraBadge}>
              <Icon2 name="camera" size={14} color="#fff" />
            </View>
          </TouchableOpacity>

          {/* Full Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              {language === 'hi' ? 'पूरा नाम' : 'Full Name'}{' '}
              <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              placeholder={strings.name}
              value={name}
              onChangeText={setName}
              style={[styles.input, name.trim().length > 0 && styles.inputValid]}
              onFocus={() => ttsSpeak(strings.name)}
              placeholderTextColor="#bbb"
              autoCapitalize="words"
            />
          </View>

          {/* Gender */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              {language === 'hi' ? 'लिंग' : 'Gender'}{' '}
              <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.genderRow}>
              {genderOptions.map(item => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.genderBtn,
                    gender === item.key && styles.genderSelected,
                  ]}
                  onPress={() => {
                    setGender(item.key);
                    ttsSpeak(item.label);
                  }}
                  activeOpacity={0.8}>
                  <Text style={styles.genderEmoji}>{item.emoji}</Text>
                  <Text
                    style={[
                      styles.genderText,
                      gender === item.key && styles.genderTextSelected,
                    ]}>
                    {item.label}
                  </Text>
                  {gender === item.key && (
                    <View style={styles.genderCheckBadge}>
                      <Icon2 name="check" size={12} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, (!isFormValid || loading) && styles.buttonDisabled]}
            onPress={async () => {
              if (!isFormValid || loading) return;
              setLoading(true);
              try {
                const form = new FormData();
                form.append('name', name.trim());
                form.append('gender', gender);
                form.append('language', language);
                const isLocalPhoto = photo && !photo.startsWith('http');
                if (isLocalPhoto) {
                  form.append('photo', {uri: photo, type: 'image/jpeg', name: 'photo.jpg'} as any);
                }
                if (profile) {
                  // Edit existing profile
                  const res = await patchProfile(form);
                  dispatch(setUser(res.user));
                  navigation.goBack();
                } else {
                  // New user registration
                  const tempToken = (store.getState() as any).auth?.tempToken ?? '';
                  const res = await completeProfile(form, tempToken);
                  dispatch(loginSuccess({user: res.user, accessToken: res.access_token, refreshToken: res.refresh_token}));
                  navigation.navigate(ScreenNameEnum.TabNavigator);
                }
              } catch {
                Alert.alert(
                  language === 'hi' ? 'समस्या हुई' : 'Error',
                  language === 'hi' ? 'प्रोफाइल सेव नहीं हो सकी। पुनः प्रयास करें।' : 'Could not save profile. Please try again.',
                );
              } finally {
                setLoading(false);
              }
            }}
            activeOpacity={isFormValid ? 0.8 : 1}>
            <LinearGradient
              colors={isFormValid ? ['#6E39F7', '#4d2b98'] : ['#ccc', '#bbb']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.buttonGradient}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.buttonText}>{strings.next}</Text>
                  <Text style={styles.buttonArrow}>→</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.requiredNote}>
            <Text style={styles.required}>*</Text>{' '}
            {language === 'hi' ? 'आवश्यक फ़ील्ड' : 'Required fields'}
          </Text>
        </View>
      </ScrollView>

      <TermsAndConditionsModal
        visible={showModal}
        onAgree={() => setShowModal(false)}
      />

      {/* Photo Source Picker Bottom Sheet */}
      <Modal
        visible={showPhotoSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPhotoSheet(false)}>
        <Pressable style={styles.sheetOverlay} onPress={() => setShowPhotoSheet(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>
              {language === 'hi' ? 'फ़ोटो चुनें' : 'Choose Photo'}
            </Text>

            <TouchableOpacity style={styles.sheetOption} onPress={openCamera} activeOpacity={0.75}>
              <View style={[styles.sheetIconCircle, {backgroundColor: '#f0ebff'}]}>
                <Icon2 name="camera-outline" size={26} color={color.purple} />
              </View>
              <View style={styles.sheetOptionText}>
                <Text style={styles.sheetOptionTitle}>
                  {language === 'hi' ? 'कैमरा खोलें' : 'Take Photo'}
                </Text>
                <Text style={styles.sheetOptionSub}>
                  {language === 'hi' ? 'अभी फ़ोटो लें' : 'Use your camera'}
                </Text>
              </View>
              <Icon2 name="chevron-right" size={22} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetOption} onPress={openGallery} activeOpacity={0.75}>
              <View style={[styles.sheetIconCircle, {backgroundColor: '#fff3e0'}]}>
                <Icon2 name="image-outline" size={26} color="#f97316" />
              </View>
              <View style={styles.sheetOptionText}>
                <Text style={styles.sheetOptionTitle}>
                  {language === 'hi' ? 'गैलरी से चुनें' : 'Choose from Gallery'}
                </Text>
                <Text style={styles.sheetOptionSub}>
                  {language === 'hi' ? 'अपनी फ़ोटो लाइब्रेरी' : 'Browse your photos'}
                </Text>
              </View>
              <Icon2 name="chevron-right" size={22} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetCancel}
              onPress={() => setShowPhotoSheet(false)}
              activeOpacity={0.75}>
              <Text style={styles.sheetCancelText}>
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
};

export default UserInfoForm;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 55,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
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
  topArea: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  topTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  topSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 20,
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
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  photoWrapper: {
    position: 'relative',
    marginBottom: 32,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: color.purple,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#e8e0ff',
  },
  photoPlaceholderText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: color.purple,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: color.purple,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  fieldGroup: {
    width: '100%',
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
  },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fafafa',
  },
  inputValid: {
    borderColor: color.purple,
    backgroundColor: '#fff',
  },
  genderRow: {
    flexDirection: 'row',
    width: '100%',
  },
  genderBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#fafafa',
    marginRight: 10,
    position: 'relative',
  },
  genderSelected: {
    backgroundColor: '#f0ebff',
    borderColor: color.purple,
  },
  genderEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  genderText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#777',
  },
  genderTextSelected: {
    color: color.purple,
  },
  genderCheckBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: color.purple,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  button: {
    borderRadius: 14,
    overflow: 'hidden',
    width: '100%',
    marginTop: 8,
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
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
  requiredNote: {
    fontSize: 12,
    color: '#bbb',
    alignSelf: 'flex-start',
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 18,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 18,
    textAlign: 'center',
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sheetIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  sheetOptionText: {
    flex: 1,
  },
  sheetOptionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  sheetOptionSub: {
    fontSize: 12,
    color: '#999',
  },
  sheetCancel: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  sheetCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
  },
});
