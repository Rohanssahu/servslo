// PartnerServiceSelectionScreen.tsx

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';
import {useNavigation} from '@react-navigation/native';
import {color} from '../../constant';
import Icon from '../../component/Icon';
import {icon} from '../../component/Image';
import {useLanguage} from '../../language/LanguageContext';
import languageStrings from '../../language/languageStrings';
import {hp} from '../../component/utils/Constant';

const allServices = [
  'Electrician', 'Plumber', 'Painter', 'House Cleaning', 'AC Repair',
  'Carpenter', 'Gardener', 'Pest Control', 'Driver', 'Cook',
  
];

export default function PartnerServiceSelectionScreen() {
  const navigation = useNavigation();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<string[]>(allServices);
  const {language, setLanguage} = useLanguage();
  const strings = languageStrings[language];

  const ttsSpeak = (text: string) => {
    Tts.stop();
    Tts.setDefaultLanguage(language === 'hi' ? 'hi-IN' : 'en-US');
    Tts.speak(text);
  };

  const onSpeechResults = (e: any) => {
    const spoken = e.value[0]?.toLowerCase() || '';
    const matches = allServices.filter(
      service =>
        spoken.includes(service.toLowerCase()) ||
        spoken.includes(service.toLowerCase().replace(' ', ''))
    );
    if (matches.length > 0) {
      setSelectedServices(prev => Array.from(new Set([...prev, ...matches])));
    }
  };

  const handleVoiceStart = async () => {
    try {
      Voice.onSpeechResults = onSpeechResults;
      await Voice.start(language === 'hi' ? 'hi-IN' : 'en-US');
    } catch (e) {
      console.error('Voice error:', e);
    }
  };

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(item => item !== service)
        : [...prev, service],
    );
  };

  const removeService = (service: string) => {
    setSelectedServices(prev => prev.filter(item => item !== service));
  };

  const handleSave = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (search === '') {
      setFiltered(allServices);
    } else {
      const lower = search.toLowerCase();
      setFiltered(
        allServices.filter(item => item.toLowerCase().includes(lower)),
      );
    }
  }, [search]);

  return (
    <View style={styles.container}>
      {/* Language & TTS Buttons */}
      <TouchableOpacity
        style={styles.languageToggle}
        onPress={() => setLanguage(language === 'hi' ? 'en' : 'hi')}>
        <Text style={{color: '#fff', fontWeight: 'bold'}}>
          {strings.switchLang}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.speakerIcon}
        onPress={() =>  ttsSpeak(
          'कृपया बताएं आप कौन-कौन से काम करते हैं। आप बोलकर या सर्च करके एक से अधिक काम चुन सकते हैं।'
        )}>
        <Icon
          source={icon.speaker}
          size={28}
          style={{tintColor: color.purple}}
        />
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.heading}>आप कौन-कौन से काम करते हैं?</Text>
        <Text style={styles.heading}>बोलें या सर्च करें</Text>
       
        {/* Search Input */}
        <TextInput
          placeholder="Search services..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />

        {/* Voice Input */}
        <TouchableOpacity onPress={handleVoiceStart} style={styles.voiceBtn}>
          <Icon source={icon.mic} size={20} style={{tintColor: '#fff'}} />
        </TouchableOpacity>

        {/* Selected Services with Remove Option */}
        {selectedServices.length > 0 && (
          <>
           <Text style={styles.label}>चुना गया काम:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.selectedScroll}>
              {selectedServices.map(service => (
                <View key={service} style={styles.selectedBadge}>
                  <Text style={styles.selectedText}>{service}</Text>
                  <TouchableOpacity
                    onPress={() => removeService(service)}
                    style={styles.removeIcon}>
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </>
        )}

<Text style={styles.label}>कृपया काम चुनें — आप एक से अधिक काम चुन सकते हैं।</Text>

        <FlatList
          data={filtered}
          keyExtractor={item => item}
          numColumns={3}
          contentContainerStyle={{paddingBottom: 100}}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.serviceItem,
                selectedServices.includes(item) && styles.serviceItemSelected,
              ]}
              onPress={() => toggleService(item)}>
              <Text
                style={{
                  color: selectedServices.includes(item) ? '#fff' : '#000',
                  fontSize: 14,
                  fontWeight: '500',
                }}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyboardShouldPersistTaps="handled"
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {padding: 16, flex: 1, backgroundColor: color.purple},
  card: {
    marginTop: hp(10),
    height:hp(70),
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: '100%',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: color.purple,
    textAlign: 'center',
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
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  voiceBtn: {
    alignSelf: 'center',
    backgroundColor: color.purple,
    height: 60,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
    color: color.purple,
  },
  selectedScroll: {
    flexDirection: 'row',
    marginBottom: 10,
    height:70
  },
  selectedBadge: {
    backgroundColor: color.purple,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedText: {color: '#fff', marginRight: 6},
  removeIcon: {
    backgroundColor: '#d32f2f',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  serviceItem: {
    padding: 12,
    height: 60,
    width: '30%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceItemSelected: {
    backgroundColor: color.purple,
  },
  button: {
    backgroundColor:'#fff',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
  },
  buttonText: {
    color: color.purple,
    fontSize: 18,
    fontWeight: '600',
  },
});
