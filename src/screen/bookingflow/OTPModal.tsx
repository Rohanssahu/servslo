// src/components/OTPModal.tsx
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const BRAND = {
  grad: ['#6E39F7', '#8E57FF', '#B78CFF'],
  purple: '#6E39F7',
  text: '#222',
  sub: '#666',
  card: '#fff',
  bg: 'rgba(0,0,0,0.45)',
};

type Props = {
  visible: boolean;
  expectedOtp: string;
  otpInput: string;
  onChangeOtp: (v: string) => void;
  onVerify: () => void;
  onClose?: () => void;
  partnerName?: string;
};

const OTPModal: React.FC<Props> = ({ visible, expectedOtp, otpInput, onChangeOtp, onVerify, partnerName, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={s.backdrop}>
        <View style={s.card}>
          <Text style={s.title}>Verify OTP to start</Text>
          <Text style={s.sub}>Share this OTP with <Text style={{ fontWeight: '800' }}>{partnerName || 'partner'}</Text></Text>

          <View style={s.badge}>
            <Text style={s.otp}>{expectedOtp}</Text>
          </View>

          <Text style={[s.sub, { marginTop: 10 }]}>Or enter it manually</Text>
          <TextInput
            placeholder="Enter 4-digit OTP"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={4}
            value={otpInput}
            onChangeText={onChangeOtp}
            style={s.input}
          />

          <TouchableOpacity onPress={onVerify}>
            <LinearGradient colors={BRAND.grad} start={{ x: 0.1, y: 0 }} end={{ x: 1, y: 1 }} style={s.cta}>
              <Text style={s.ctaText}>Verify</Text>
            </LinearGradient>
          </TouchableOpacity>

          {!!onClose && (
            <TouchableOpacity onPress={onClose} style={{ marginTop: 8 }}>
              <Text style={{ color: BRAND.purple, fontWeight: '700' }}>Close</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default OTPModal;

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: BRAND.bg, alignItems: 'center', justifyContent: 'center', padding: 18 },
  card: { width: '100%', maxWidth: 420, backgroundColor: BRAND.card, borderRadius: 16, padding: 16, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '900', color: BRAND.text },
  sub: { color: BRAND.sub, marginTop: 6 },
  badge: { marginTop: 10, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#E5DEFF', backgroundColor: '#F7F3FF' },
  otp: { color: BRAND.purple, fontSize: 24, fontWeight: '900', letterSpacing: 3 },
  input: { marginTop: 8, borderWidth: 1, borderColor: '#E5DEFF', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, width: '100%', textAlign: 'center' },
  cta: { borderRadius: 12, alignItems: 'center', paddingVertical: 12, paddingHorizontal: 18, marginTop: 12, width: 160 },
  ctaText: { color: '#fff', fontWeight: '800' },
});
