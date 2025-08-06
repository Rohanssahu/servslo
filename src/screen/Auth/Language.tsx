import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Tts from 'react-native-tts';
import Icon from '../../component/Icon';
import { icon } from '../../component/Image';
import { color } from '../../constant';
import { hp } from '../../component/utils/Constant';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../language/LanguageContext';
import ScreenNameEnum from '../../routes/screenName.enum';

const { width } = Dimensions.get('window');

const Language: React.FC = () => {
  const navigation = useNavigation();
  const { setLanguage } = useLanguage();

  const speakInstruction = () => {
    Tts.setDefaultLanguage('hi-IN');
    Tts.speak(
      'कृपया अपनी भाषा चुनें। यदि आप हिंदी में जारी रखना चाहते हैं तो हिंदी चुनें, या अंग्रेज़ी में जारी रखने के लिए English चुनें।'
    );
  };



  const handleSelectLanguage = (lang: 'hi' | 'en') => {
    setLanguage(lang);
    navigation.navigate(ScreenNameEnum.PhoneLogin); // replace with your next screen
  };

  return (
    <View style={styles.container}>
      {/* Speaker Icon Top-Right */}
      <TouchableOpacity style={styles.speakerIcon} onPress={speakInstruction}>
        <Icon source={icon.speaker} size={28} style={{ tintColor: color.purple }} />
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.heading}>Select Language</Text>

        <View style={{ marginVertical: 50 }}>
          <Icon
            source={icon.languages}
            style={{ tintColor: color.purple }}
            size={150}
          />
        </View>

        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => handleSelectLanguage('hi')}
        >
          <Text style={styles.languageText}>हिन्दी</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => handleSelectLanguage('en')}
        >
          <Text style={styles.languageText}>English</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Language;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.purple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speakerIcon: {
    position: 'absolute',
    top: 60,
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
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: color.purple,
    marginBottom: 15,
  },
  languageButton: {
    backgroundColor: '#F5F3FF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  languageText: {
    fontSize: 22,
    fontWeight: '500',
    color: color.purple,
  },
});
