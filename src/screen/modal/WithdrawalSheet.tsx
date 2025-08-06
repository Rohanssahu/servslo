import React, { useMemo } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // ✅ Vector icon import
import { color } from '../../constant';

const WithdrawalSheet = ({ bottomSheetRef, onOptionSelect }) => {
  const snapPoints = useMemo(() => ['35%'], []); // 👈 Slightly higher snap point for spacing

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={styles.sheetBackground}
    >
      <View style={styles.container}>
        <Text style={styles.title}>भुगतान का तरीका चुनें</Text>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => onOptionSelect('online')}
        >
          <Icon name="qrcode-scan" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.optionText}>ऑनलाइन ट्रांसफर (UPI / QR)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => onOptionSelect('cash')}
        >
          <Icon name="bank-transfer" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.optionText}>बैंक में ट्रांसफर करें</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  sheetBackground: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  optionButton: {
    backgroundColor: color.purple,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default WithdrawalSheet;
