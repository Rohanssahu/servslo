import React, {useState} from 'react';
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
import {icon} from '../../component/Image';
import {color} from '../../constant';
import {useLanguage} from '../../language/LanguageContext';
import languageStrings from '../../language/languageStrings';
import {hp} from '../../component/utils/Constant';
import ScreenNameEnum from '../../routes/screenName.enum';

const {width} = Dimensions.get('window');

const PhoneLogin: React.FC = ({navigation}) => {
  const {language, setLanguage} = useLanguage();
  const [phone, setPhone] = useState('');

  const strings = languageStrings[language];

  const speakInstruction = () => {
    Tts.setDefaultLanguage(language === 'hi' ? 'hi-IN' : 'en-US');
    Tts.speak(strings.tts);
  };

  return (
    <View style={styles.container}>
      {/* Language Switch */}
      <TouchableOpacity
        style={styles.languageToggle}
        onPress={() => setLanguage(language === 'hi' ? 'en' : 'hi')}>
        <Text style={{color: '#fff', fontWeight: 'bold'}}>
          {strings.switchLang}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.speakerIcon} onPress={speakInstruction}>
        <Icon source={icon.speaker} size={28} style={{ tintColor: color.purple }} />
      </TouchableOpacity>


      <View style={styles.card}>
        <Text style={styles.title}>{strings.phoneLogin}</Text>

        <View style={styles.labelRow}>
         
          <Text style={styles.labelText}>{strings.enterPhone}</Text>
        </View>
        <View style={styles.phoneInputWrapper}>
          <View style={styles.countryCodeBox}>
            <Text style={styles.countryCodeText}>+91</Text>
          </View>
          <TextInput
            style={styles.phoneInput}
            keyboardType="phone-pad"
            placeholder={strings.placeholder}
            placeholderTextColor="#888"
            value={phone}
            onChangeText={setPhone}
            maxLength={10} // only 10 digits allowed
          />
        </View>

        <View style={{marginBottom:50,marginTop:30}}>
          <Icon
            source={icon.touch}
            style={{tintColor: color.purple}}
            size={150}
          />
        </View>

        <TouchableOpacity 
        onPress={()=>{
            navigation.navigate(ScreenNameEnum.OTPVerification)
        }}
        style={styles.button}>
          <Text style={styles.buttonText}>{strings.continue}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
        onPress={()=>{
            navigation.navigate(ScreenNameEnum.TabNavigator)
        }}
        style={{marginTop:20}}>
          <Text style={[styles.buttonText,{color:color.purple,fontWeight:'600'}]}>{'Skip'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PhoneLogin;

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
    shadowOffset: {width: 0, height: 4},
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: color.purple,
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
  },
  labelText: {
    fontSize: 22,
    color: color.purple,
    fontWeight: '600',
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
    marginBottom: 20,
    height:55
  },
  countryCodeBox: {
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  countryCodeText: {
    fontSize: 16,
    color: '#000',
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
  },

  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    color: '#000',
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
