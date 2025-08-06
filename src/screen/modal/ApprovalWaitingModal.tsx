import React, { useEffect } from 'react';
import { Modal, View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const ApprovalWaitingModal = ({ visible ,setStep}) => {

    useEffect(() => {
        if (visible) {
          const timer = setTimeout(() => {
            setStep(); // Go to feedback screen
          }, 5000); // 5 seconds
      
          return () => clearTimeout(timer); // cleanup on unmount or modal hide
        }
      }, [visible]);
      
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>अनुमोदन माँगा गया</Text>
          <ActivityIndicator size="large" color="#007bff" style={{ marginVertical: 20 }} />
          <Text style={styles.infoText}>
            कृपया प्रतीक्षा करें, ग्राहक की स्वीकृति लंबित है।
          </Text>
          <Text style={styles.subInfo}>
            अतिरिक्त कार्य का अनुमान ग्राहक को भेज दिया गया है।
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
  },
  subInfo: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ApprovalWaitingModal;
