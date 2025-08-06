import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {useLanguage} from '../../language/LanguageContext';
import languageStrings from '../../language/languageStrings';
import Tts from 'react-native-tts';
import {color} from '../../constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {hp} from '../../component/utils/Constant';
import JobRequestModal from '../modal/JobModalProps';
import ScreenNameEnum from '../../routes/screenName.enum';
import NotificationBell from '../Feature/NotificationBell';
import HeaderComponent from '../Feature/HeaderComponent';

export default function HomeScreen({navigation}) {
  const {language, setLanguage} = useLanguage();
  const strings = languageStrings[language];
  const [isOnline, setIsOnline] = useState(true);
  const [isorder, setisorder] = useState(false);
  const [jobAvailable, setJobAvailable] = useState(true);

  const ttsSpeak = (text: string) => {
    Tts.stop();
    Tts.setDefaultLanguage(language === 'hi' ? 'hi-IN' : 'en-US');
    Tts.speak(text, {rate: 0.5});
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <HeaderComponent 
  language={language}
  setLanguage={setLanguage}
  location="Indore, MP"
  notificationCount={5}
  onNotificationPress={() => console.log('Notification clicked')}
/>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.greeting}>नमस्ते, राहूल</Text>
              <Text style={[styles.statusText,{color:isOnline ? 'green' : 'red'}]}>
                {isOnline ? 'आप ऑनलाइन हैं' : 'आप ऑफलाइन हैं'}
              </Text>
            </View>
            <Switch
              value={isOnline}
              onValueChange={value => setIsOnline(value)}
              thumbColor={isOnline ? 'green' : 'red'}
              trackColor={{false: '#ff8a7a', true: '#2ecc71'}}

              style={{
                transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
              }}
            />
          </View>

          {jobAvailable && (
            <TouchableOpacity
              onPress={() => setisorder(true)}
              style={[styles.newJobCard, styles.warningCard]}>
              <Text style={[styles.jobTitle, {color: 'red'}]}>
                📣 महत्वपूर्ण सूचना:
              </Text>
              <Text style={[styles.jobDesc, {color: 'red'}]}>
                डॉक्युमेंट अपडेट करें वरना अकाउंट ब्लॉक हो सकता है
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.sectionHeader}>
            <Text style={styles.jobTitle}>आज की बुकिंग</Text>
            <Text style={styles.viewAll}>➤ सभी देखें</Text>
          </View>

          {jobAvailable && (
            <TouchableOpacity
              onPress={() => setisorder(true)}
              style={styles.newJobCard}>
              <Text style={styles.jobTitle}>📢 नया काम उपलब्ध</Text>
              <Text style={styles.jobDesc}>
                1 BHK इलेक्ट्रिशियन की ज़रूरत है
              </Text>
              <Text style={styles.jobTime}>📍 नई सड़क, आज दोपहर</Text>
            </TouchableOpacity>
          )}

          {/* Grid Summary */}
          <View style={styles.gridContainer}>
            <TouchableOpacity
               onPress={()=>{
                navigation.navigate(ScreenNameEnum.JobDetailsScreen)
              }}
              style={[styles.gridCard, {backgroundColor: color.purple}]}>
              <Text style={[styles.gridCardTitle, {color: '#fff'}]}>
                ताज़ा बुकिंग
              </Text>
              <Text style={[styles.gridCardSubtext, {color: '#eee'}]}>
                5वे चौथी अगा नार, कोल्हापुर
              </Text>
              <Text style={[styles.gridCardSubtext, {color: '#eee'}]}>
                आज 11:00 AM
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridCard}>
              <Text style={styles.gridCardTitle}>आज की कमाई: ₹750</Text>
              <Text style={[styles.gridCardSubtext, {color: 'green'}]}>
                इस हफ्ते: ₹4120
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridCard}>
              <Text style={styles.gridCardTitle}>मार्केट प्रदर्शन</Text>
              <Text style={styles.gridCardSubtext}>⭐ रेटिंग: 4.7 / 5</Text>
              <Text style={styles.gridCardSubtext}>🎖️ टॉप 10% प्रोफेशनल्स</Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=>{
              navigation.navigate(ScreenNameEnum.HowToUseScreen)
            }}
            style={styles.gridCard}>
  <Text style={styles.gridCardTitle}>📘 ऐप का उपयोग कैसे करें</Text>
  <Text style={styles.gridCardSubtext}>स्टेप-बाय-स्टेप गाइड पढ़ें</Text>
</TouchableOpacity>

          </View>

        </View>

        {/* Modal */}
        {isorder && (
          <JobRequestModal
            visible={true}
            onAccept={() => setisorder(false)}
            onReject={() => setisorder(false)}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},




  content: {
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: color.purple,
  },
  statusText: {
    fontSize: 22,
    color: '#2ecc71',
    fontWeight:'600'
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  newJobCard: {
    backgroundColor: '#f0eaff',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: color.purple,
  },
  warningCard: {
    backgroundColor: '#ffecea',
    borderLeftColor: 'red',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: color.purple,
  },
  jobDesc: {
    fontSize: 16,
    marginTop: 4,
    color: '#444',
  },
  jobTime: {
    fontSize: 14,
    marginTop: 2,
    color: '#666',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    alignItems: 'center',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
  },
  gridCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color.purple,
    marginBottom: 6,
  },
  gridCardSubtext: {
    fontSize: 14,
    color: '#555',
  },
});
