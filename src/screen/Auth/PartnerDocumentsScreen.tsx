import React, {useState} from 'react';
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
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
const {width} = Dimensions.get('window');

const PartnerDocumentsScreen = ({navigation}) => {
  const {language, setLanguage} = useLanguage();
  const strings = languageStrings[language];
  const [aadhaar, setAadhaar] = useState(null);
  const [pan, setPan] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [criminalConsent, setCriminalConsent] = useState(false);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [photo, setPhoto] = useState(null);
  const [experience, setExperience] = useState('');
  const [workType, setWorkType] = useState('');

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

  return (

    <View style={{flex:1,    backgroundColor: color.purple,}}>
         <View style={styles.header}>
               <TouchableOpacity onPress={() => navigation.goBack()}>
                 <Icon2 name="arrow-left" size={24} color="#fff" />
               </TouchableOpacity>
               <Text style={styles.headerText}>Refer & Earn</Text>
               <View style={{ width: 24 }} />
             </View>

    <ScrollView contentContainerStyle={styles.container}>
   
     
 
      <View style={styles.card}>
        <Text style={styles.title}>{strings.title}</Text>

      

        <TextInput
          placeholder={'बैंक खाता संख्या'}
          value={name}
          onChangeText={setName}
          style={styles.input}
          onFocus={() => ttsSpeak('बैंक खाता संख्या')}
          placeholderTextColor="#888"
        />
      <TextInput
          placeholder={'IFSC कोड'}
          value={experience}
          onChangeText={setExperience}
          style={styles.input}
          keyboardType="numeric"
          onFocus={() => ttsSpeak('IFSC कोड')}
          placeholderTextColor="#888"
        />
           <TouchableOpacity
          style={[
            styles.input,
            {
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
             
           flexDirection:'row'
            },
          ]}
          onPress={() => ttsSpeak(strings.aadhaarFront)}>
          <Icon source={icon.idcard} style={{tintColor: color.purple,}} />
          <Text style={[styles.buttonText, {textAlign:'center',
            color: color.purple,}]}>  {'बैंक खाता फोटो अपलोड करें'}
          </Text>
        </TouchableOpacity>
           <TouchableOpacity
          style={[
            styles.input,
            {
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
             
           flexDirection:'row'
            },
          ]}
          onPress={() => ttsSpeak(strings.aadhaarFront)}>
          <Icon source={icon.idcard} style={{tintColor: color.purple,}} />
          <Text style={[styles.buttonText, {textAlign:'center',
            color: color.purple,}]}>  {'पैन फोटो अपलोड करें'}
          </Text>
        </TouchableOpacity>

        <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.input,
            {
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
             
              width:'48%'
            },
          ]}
          onPress={() => ttsSpeak(strings.aadhaarFront)}>
          <Icon source={icon.idcard} style={{tintColor: color.purple,}} />
          <Text style={[styles.buttonText, {textAlign:'center',
            color: color.purple,}]}>
            {strings.aadhaarFront}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.input,
            {
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
          
                width:'48%'
            },
          ]}
          onPress={() => ttsSpeak(strings.aadhaarBack)}>
          <Icon source={icon.idcard} style={{tintColor: color.purple,}} />
          <Text style={[styles.buttonText, {color: color.purple,
       
textAlign:'center'

          }]}>
            {strings.aadhaarBack}
          </Text>
        </TouchableOpacity>

        </View>

  

      {/* Criminal Consent */}
      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setCriminalConsent(!criminalConsent)}>
        <View style={styles.checkbox}>
          {criminalConsent ? <View style={styles.checked} /> : null}
        </View>
        <Text style={{ marginLeft: 10,color:color.purple,fontWeight:'600',fontSize:16 }}>मैं आपराधिक रिकॉर्ड जांच की सहमति देता हूँ</Text>
      </TouchableOpacity>   
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
           navigation.goBack()
          }}>
          <Text style={styles.buttonText}>{strings.next}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </View>
  );
};

export default PartnerDocumentsScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: color.purple,
    flexDirection: 'row',
    alignItems: 'center',
    height:hp(10),
    padding: 12,
    
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  headerText: { color: '#fff', 
    fontSize: 20, fontWeight: '600' },
iconTitle: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  marginBottom: 8,
},
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
    marginTop:20
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  checkbox: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    height: 12,
    width: 12,
    backgroundColor: color.purple
  },
});
