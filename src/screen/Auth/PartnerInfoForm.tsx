import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import Tts from 'react-native-tts';
import {launchCamera} from 'react-native-image-picker';
import {useLanguage} from '../../language/LanguageContext';
import languageStrings from '../../language/languageStrings';
import Icon from '../../component/Icon';
import {icon} from '../../component/Image';
import {color} from '../../constant';
import {hp} from '../../component/utils/Constant';
import ScreenNameEnum from '../../routes/screenName.enum';
import {useRoute} from '@react-navigation/native';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import TermsAndConditionsModal from './TermsAndConditionsModal';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

const PartnerInfoForm = ({navigation}) => {
  const {language, setLanguage} = useLanguage();
  const strings = languageStrings[language];

  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [photo, setPhoto] = useState(null);
  const [aadhaar, setAadhaar] = useState('');
  const [experience, setExperience] = useState('');
  const [workType, setWorkType] = useState('');
  const [phone, setPhone] = useState('');
  const route = useRoute();
  const [showModal, setShowModal] = useState(false);
  const {profile} = route.params || {};

  const ttsSpeak = text => {
    Tts.stop();
    Tts.setDefaultLanguage(language === 'hi' ? 'hi-IN' : 'en-US');
    Tts.speak(text, {rate: 0.5});
  };

  const openCamera = async () => {
    const result = await launchCamera({mediaType: 'photo'});
    if (!result.didCancel && result.assets?.length) {
      setPhoto(result.assets[0].uri);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowModal(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#6E39F7', '#8E57FF', '#B78CFF']}
      start={{x: 0.1, y: 0}}
      end={{x: 1, y: 1}}
      style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Language Toggle */}
        <TouchableOpacity
          style={styles.languageToggle}
          onPress={() => {
            if (profile) {
              navigation.goBack();
            } else {
              setLanguage(language === 'hi' ? 'en' : 'hi');
            }
          }}>
          {profile ? (
            <Icon2 name="arrow-left" size={24} color="#fff" />
          ) : (
            <Text style={{color: '#fff', fontWeight: 'bold'}}>
              {strings.switchLang}
            </Text>
          )}
        </TouchableOpacity>

        {/* Speaker */}
        <TouchableOpacity
          style={styles.speakerIcon}
          onPress={() => ttsSpeak(strings.title)}>
          <Icon
            source={icon.speaker}
            size={28}
            style={{tintColor: color.purple}}
          />
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.title}>{strings.title}</Text>

          {/* Photo Button */}
          <TouchableOpacity
            style={styles.photoCircle}
            onPress={() => {
              openCamera();
              ttsSpeak(strings.livePhoto);
            }}>
            <Icon
              source={icon.addphoto}
              size={30}
              style={{tintColor: '#fff'}}
            />
            <Text style={styles.photoText}>{strings.livePhoto}</Text>
          </TouchableOpacity>

          {/* Name */}
          <TextInput
            placeholder={strings.name}
            value={name}
            onChangeText={setName}
            style={styles.input}
            onFocus={() => ttsSpeak(strings.name)}
            placeholderTextColor="#888"
          />

          {/* Phone Number */}
          <View style={styles.phoneContainer}>
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              placeholder={strings.phone || 'Phone Number'}
              value={phone}
              onChangeText={text => {
                const cleaned = text.replace(/[^0-9]/g, '').slice(0, 10);
                setPhone(cleaned);
              }}
              keyboardType="numeric"
              style={styles.phoneInput}
              onFocus={() => ttsSpeak(strings.phone || 'Phone Number')}
              placeholderTextColor="#888"
            />
          </View>

          {/* Experience */}
          <TextInput
            placeholder={strings.experience}
            value={experience}
            onChangeText={setExperience}
            style={styles.input}
            keyboardType="numeric"
            onFocus={() => ttsSpeak(strings.experience)}
            placeholderTextColor="#888"
          />

          {/* Gender */}
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.genderBtn, gender === 'male' && styles.selected]}
              onPress={() => {
                setGender('male');
                ttsSpeak(strings.male);
              }}>
              <Text
                style={[
                  styles.gendertxt,
                  gender === 'male' && styles.selecttxt,
                ]}>
                {strings.male}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderBtn, gender === 'female' && styles.selected]}
              onPress={() => {
                setGender('female');
                ttsSpeak(strings.female);
              }}>
              <Text
                style={[
                  styles.gendertxt,
                  gender === 'female' && styles.selecttxt,
                ]}>
                {strings.female}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate(ScreenNameEnum.TabNavigator);
            }}>
            <Text style={styles.buttonText}>{strings.next}</Text>
          </TouchableOpacity>
        </View>

        <TermsAndConditionsModal
          visible={showModal}
          onAgree={() => {
            setShowModal(false);
          }}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default PartnerInfoForm;

const styles = StyleSheet.create({
  gendertxt: {
    color: color.purple,
    fontWeight: '500',
    fontSize: 16,
  },
  selecttxt: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  card: {
    marginTop: hp(15),
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 30,
    width: width * 0.9,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
  },
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
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
  title: {
    fontSize: 24,
    color: color.purple,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 18,
    color: '#000',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 8,
  },
  genderBtn: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selected: {
    backgroundColor: color.purple,
    borderWidth: 1,
    borderColor: '#444',
  },
  photoCircle: {
    backgroundColor: color.purple,
    height: 80,
    width: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  photoText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  countryCode: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    color: '#000',
    paddingVertical: 12,
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
