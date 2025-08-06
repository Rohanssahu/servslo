import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
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
import {height, hp} from '../../component/utils/Constant';
import {array} from 'prop-types';
import ScreenNameEnum from '../../routes/screenName.enum';
import {useRoute} from '@react-navigation/native';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import TermsAndConditionsModal from './TermsAndConditionsModal';
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
  const route = useRoute();
  const [showModal, setShowModal] = useState(false);
  const { profile } = route.params
  const ttsSpeak = (text: string) => {
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
    const timer = setTimeout(() => setShowModal(true),2000); // 3 second delay
    return () => clearTimeout(timer);
  }, []);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Language Switch and Speaker Icon */}
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

        <TouchableOpacity
          style={{
            backgroundColor: color.purple,
            height: 80,
            width: 80,
            borderRadius: 40,
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 15,
          }}
          onPress={() => {
            openCamera();
            ttsSpeak(strings.livePhoto);
          }}>
          <Icon
            source={icon.addphoto}
            size={30}
            style={{
              marginTop: -0,
              marginRight: -5,
              tintColor: '#fff',
            }}
          />
          <Text style={{color: '#fff', fontWeight: '500', fontSize: 14}}>
            {strings.livePhoto}
          </Text>
        </TouchableOpacity>

        <TextInput
          placeholder={strings.name}
          value={name}
          onChangeText={setName}
          style={styles.input}
          onFocus={() => ttsSpeak(strings.name)}
          placeholderTextColor="#888"
        />
        <TextInput
          placeholder={strings.experience}
          value={experience}
          onChangeText={setExperience}
          style={styles.input}
          keyboardType="numeric"
          onFocus={() => ttsSpeak(strings.experience)}
          placeholderTextColor="#888"
        />
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.genderBtn, gender === 'male' && styles.selected]}
            onPress={() => {
              setGender('male');
              ttsSpeak(strings.male);
            }}>
            <Text
              style={[styles.gendertxt, gender === 'male' && styles.selecttxt]}>
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

        <TouchableOpacity
          style={[
            styles.input,
            {
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            },
          ]}
          onPress={() => {
            navigation.navigate(ScreenNameEnum.PartnerDocumentsScreen);
          }}>
          <Icon source={icon.idcard} style={{tintColor: color.purple}} />
          <Text
            style={[styles.buttonText, {color: color.purple, marginLeft: 10}]}>
            {'दस्तावेज़ अपलोड करें'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.input,
            {
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            },
          ]}
          onPress={() => {
            navigation.navigate(ScreenNameEnum.PartnerServiceSelectionScreen);
          }}>
          <Icon source={icon.provider} style={{tintColor: color.purple}} />
          <Text
            style={[styles.buttonText, {color: color.purple, marginLeft: 10}]}>
            {strings.work}
          </Text>
        </TouchableOpacity>
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
    // Aapka registration step yahan continue hoga
  }}
/>
    </ScrollView>
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
    backgroundColor: color.purple,
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
  photoBtn: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 50,
    marginVertical: 12,
    alignItems: 'center',
    width: '60%',
  },
  preview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
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
