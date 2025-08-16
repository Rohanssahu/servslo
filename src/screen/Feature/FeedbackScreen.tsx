// src/screens/FeedbackScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../AppNavigator';
import ScreenNameEnum from '../../routes/screenName.enum';

const BRAND = {
  grad: ['#6E39F7', '#8E57FF', '#B78CFF'],
  purple: '#6E39F7',
  text: '#222',
  sub: '#666',
  green: '#13B36B',
  bg: '#F7F7FB',
};

type Props = NativeStackScreenProps<RootStackParamList, 'Feedback'>;

export default function FeedbackScreen({ route, navigation }: Props) {
  const { bookingId } = route.params;
  const [feedbackText, setFeedbackText] = useState('');
  const [ratings, setRatings] = useState<number[]>([0, 0, 0, 0]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const scale = new Animated.Value(0);

  const questions = [
    'आपको सेवा की गुणवत्ता कैसी लगी?',
    'सेवा प्रदाता का व्यवहार कैसा रहा?',
    'क्या कार्यस्थल की साफ़-सफ़ाई का ध्यान रखा गया?',
    'क्या आप भविष्य में इस सेवा को दोबारा लेना चाहेंगे?',
  ];

  const setRating = (qIndex: number, value: number) => {
    const newRatings = [...ratings];
    newRatings[qIndex] = value;
    setRatings(newRatings);
  };

  const handleSubmit = () => {
    setShowCompletionModal(true);
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

    setTimeout(() => {
      setShowCompletionModal(false);
      navigation.replace(ScreenNameEnum.TabNavigator);
    }, 3000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: BRAND.bg }}>
      {/* Header */}
      <LinearGradient colors={BRAND.grad} style={styles.header}>
    
        <Text style={styles.headerText}>फ़ीडबैक दें</Text>
      </LinearGradient>

      {/* Progress Steps */}
      <View style={styles.stepsRow}>
        <View style={styles.stepItem}>
          <Icon name="wallet" size={28} color="#999"  />
          <Text style={styles.stepText}>Payment</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={styles.stepItem}>
          <Icon name="chatbubbles" size={28} color={BRAND.purple} />
          <Text style={styles.stepText}>Feedback</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={styles.stepItem}>
          <Icon name="checkmark-done-circle" size={28} color="#999" />
          <Text style={styles.stepText}>Complete</Text>
        </View>
      </View>
      <View style={{ padding: 16 }}>
        {/* Partner Info Card */}
        <View style={styles.partnerCard}>
          <View style={styles.avatar}>
            <Icon name="person" size={28} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.partnerName}>Vijay Patel</Text>
            <Text style={styles.partnerService}>Fan Repair</Text>
            <Text style={styles.partnerDetail}>246 Balram Ngr, Aligarh</Text>
            <Text style={styles.partnerDetail}>आज, सुबह 11:30 बजे</Text>
          </View>
        </View>

        {/* Questions */}
        <View>
        {questions.map((q, qIndex) => (
          <View key={qIndex} style={styles.questionCard}>
            <Text style={styles.questionText}>{q}</Text>
            <View style={styles.starRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <TouchableOpacity key={i} onPress={() => setRating(qIndex, i + 1)}>
                  <Icon
                    name={i < ratings[qIndex] ? 'star' : 'star-outline'}
                    size={30}
                    color={i < ratings[qIndex] ? BRAND.purple : '#ccc'}
                  />
                </TouchableOpacity>
              ))}
            </View>
            
          </View>
        ))}
        </View>
        {/* Extra Feedback Input */}
        <View style={styles.feedbackBox}>
          <Text style={styles.feedbackLabel}>अपना सुझाव / टिप्पणी लिखें</Text>
          <TextInput
            style={styles.textArea}
            placeholder="कृपया यहाँ लिखें..."
            placeholderTextColor="#aaa"
            value={feedbackText}
            onChangeText={setFeedbackText}
            multiline
          />
        </View>
        {/* Submit Button */}
        <TouchableOpacity activeOpacity={0.9} onPress={handleSubmit}>
          <LinearGradient colors={BRAND.grad} style={styles.cta}>
            <Text style={styles.ctaText}>सबमिट करें</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal transparent visible={showCompletionModal} animationType="fade">
        <View style={styles.overlay}>
          <View style={[styles.modalBox, ]}>
            <View style={styles.iconWrap}>
              <Icon name="checkmark" size={40} color="#fff" />
            </View>
            <Text style={styles.success}>फ़ीडबैक सबमिट हुआ</Text>
            <Text style={styles.subText}>धन्यवाद! आपकी प्रतिक्रिया हमारे लिए महत्वपूर्ण है।</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  feedbackBox: { marginBottom: 16, padding: 10, },
  feedbackLabel: { fontSize: 14, fontWeight: '600', color: BRAND.text, marginBottom: 6 },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#000',
    minHeight: 90,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  header: {
  
    
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop:40,
    paddingBottom:20,
    justifyContent:'center'
  },
  backBtn: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerText: { color: '#fff', fontSize: 18, fontWeight: '700' },

  partnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: '#8E57FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  partnerName: { fontSize: 16, fontWeight: '700', color: BRAND.text },
  partnerService: { fontSize: 14, fontWeight: '600', color: BRAND.purple },
  partnerDetail: { fontSize: 12, color: BRAND.sub, marginTop: 2 },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  stepItem: { alignItems: 'center' },
  stepText: { fontSize: 12, marginTop: 4, color: BRAND.sub },
  stepLine: { width: 80, height: 2, backgroundColor: '#ccc', marginHorizontal: 8 },
  questionCard: {
 
    borderRadius: 12,
    padding: 10,

   
  },
  questionText: { fontSize: 15, fontWeight: '600', marginBottom: 8, color: BRAND.text },
  starRow: { flexDirection: 'row', gap: 6 ,},

  cta: {
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 10,
    shadowColor: '#6E39F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  ctaText: { color: '#fff', fontWeight: '900', fontSize: 16 },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: 280,
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 10,
  },
  iconWrap: {
    backgroundColor: BRAND.green,
    height: 70,
    width: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  success: { fontSize: 18, fontWeight: '800', color: BRAND.green, marginBottom: 6 },
  subText: { fontSize: 14, color: BRAND.sub, textAlign: 'center' },
});
