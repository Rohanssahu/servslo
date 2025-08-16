// src/screens/PaymentScreen.tsx
import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenNameEnum from '../../routes/screenName.enum';

const BRAND = {
  grad: ['#6E39F7', '#8E57FF', '#B78CFF'],
  purple: '#6E39F7',
  text: '#222',
  sub: '#666',
  bg: '#F7F7FB',
  card: '#fff',
  green: '#13B36B',
};

export default function PaymentScreen({route, navigation}) {
  const {amount, bookingId} = route.params;
  const [mode, setMode] = useState<'CASH' | 'UPI' | null>(null);
  const [showModal, setShowModal] = useState(false);

  const scale = useRef(new Animated.Value(0)).current;

  const payNow = () => {
    if (!mode) return Alert.alert('कृपया भुगतान मोड चुनें');
    setShowModal(true);

    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    // Move after modal
    setTimeout(() => {
      navigation.replace(ScreenNameEnum.Feedback, {bookingId});
    }, 2200);
  };

  return (
    <View style={s.container}>
      {/* Header */}

      <LinearGradient colors={BRAND.grad} style={s.header}>
        <View style={{width: 24}} />
        <Text style={s.headerTitle}>Complete Your Payment</Text>
        <View style={{width: 24}} />
      </LinearGradient>

      {/* Progress Steps */}
      <View style={s.stepsRow}>
        <View style={s.stepItem}>
          <Icon name="wallet" size={28} color={BRAND.purple} />
          <Text style={s.stepText}>Payment</Text>
        </View>
        <View style={s.stepLine} />
        <View style={s.stepItem}>
          <Icon name="chatbubbles" size={28} color="#999" />
          <Text style={s.stepText}>Feedback</Text>
        </View>
        <View style={s.stepLine} />
        <View style={s.stepItem}>
          <Icon name="checkmark-done-circle" size={28} color="#999" />
          <Text style={s.stepText}>Complete</Text>
        </View>
      </View>

      {/* Card */}
      <View style={s.card}>
        <Text style={s.title}>Payable Amount</Text>
        <Text style={s.amount}>₹{amount}</Text>
        <Text style={[s.sub, {marginTop: 12}]}>Select payment mode</Text>

        <TouchableOpacity
          onPress={() => setMode('CASH')}
          style={[s.mode, mode === 'CASH' && s.modeActive]}>
          <Icon name="cash-outline" size={20} color={BRAND.text} />
          <Text style={s.modeText}>Cash</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMode('UPI')}
          style={[s.mode, mode === 'UPI' && s.modeActive]}>
          <Icon name="phone-portrait-outline" size={20} color={BRAND.text} />
          <Text style={s.modeText}>UPI</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={payNow} activeOpacity={0.9}>
        <LinearGradient colors={BRAND.grad} style={s.cta}>
          <Icon name="lock-closed-outline" size={18} color="#fff" />
          <Text style={s.ctaText}>Pay Securely</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Payment Success Modal */}
      <Modal transparent visible={showModal} animationType="fade">
        <View style={s.overlay}>
          <Animated.View style={[s.modalBox, {transform: [{scale}]}]}>
            <View style={s.iconWrap}>
              <Icon name="checkmark-done" size={46} color="#fff" />
            </View>
            <Text style={s.success}>Payment Successful 🎉</Text>
            <Text style={s.subModal}>
              Redirecting to feedback & booking completion...
            </Text>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: BRAND.bg},
  header: {
    backgroundColor: BRAND.purple,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerTitle: {color: '#fff', fontWeight: '700', fontSize: 18},
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  stepItem: {alignItems: 'center'},
  stepText: {fontSize: 12, marginTop: 4, color: BRAND.sub},
  stepLine: {
    width: 80,
    height: 2,
    backgroundColor: '#ccc',
    marginHorizontal: 8,
  },
  card: {
    backgroundColor: BRAND.card,
    borderRadius: 14,
    padding: 16,
    elevation: 3,
    marginHorizontal: 16,
  },
  title: {fontSize:20, fontWeight: '800', color: BRAND.text,alignSelf:'center'},
  amount: {fontSize: 28, fontWeight: '900', color: BRAND.text, alignSelf:'center',marginVertical:20},
  sub: {color: BRAND.sub, textAlign: 'center',fontSize:16},
  mode: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modeActive: {borderColor: BRAND.purple, backgroundColor: '#F5F1FF'},
  modeText: {color: BRAND.text, fontWeight: '700'},
  cta: {
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 14,
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  ctaText: {color: '#fff', fontWeight: '900', fontSize: 16},
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
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
    height: 80,
    width: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  success: {
    fontSize: 20,
    fontWeight: '800',
    color: BRAND.green,
    marginBottom: 8,
  },
  subModal: {color: BRAND.sub, fontSize: 14, textAlign: 'center'},
});
