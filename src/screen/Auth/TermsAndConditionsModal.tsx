import React, { useState } from 'react';
import { Modal, View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { color } from '../../constant';

const TermsAndConditionsModal = ({ visible, onAgree }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Icon name="gavel" size={24} color="#333" />
            <Text style={styles.title}>नियम और शर्तें / प्राइवेसी पॉलिसी</Text>
          </View>

          <ScrollView style={styles.content}>
            <Text style={styles.sectionTitle}>आपके द्वारा दी जाने वाली जानकारी:</Text>
            <Text style={styles.text}>
              - पूरा नाम, अनुभव, जेंडर की जानकारी ली जाएगी।{'\n'}
              - आधार कार्ड, बैंक विवरण, और एक लाइव फोटो अपलोड करनी होगी।{'\n'}
              - पृष्ठभूमि सत्यापन (Background Check) किया जाएगा।{'\n'}
            </Text>

            <Text style={styles.sectionTitle}>हमारी सेवाओं का उपयोग:</Text>
            <Text style={styles.text}>
              - पार्टनर को केवल सत्य और सटीक जानकारी देनी होगी।{'\n'}
              - अगर जानकारी गलत पाई जाती है, तो अकाउंट ब्लॉक किया जा सकता है।{'\n'}
              - आपकी जानकारी हमारे सर्वर पर सुरक्षित रखी जाएगी और केवल सेवा उद्देश्यों के लिए उपयोग होगी।{'\n'}
            </Text>

            <Text style={styles.sectionTitle}>रिफंड / विवाद / पेमेंट संबंधी:</Text>
            <Text style={styles.text}>
              - किसी विवाद या बुकिंग रद्द करने की स्थिति में कंपनी का निर्णय अंतिम होगा।{'\n'}
              - भुगतान में देरी या समस्या के लिए सपोर्ट टीम से संपर्क करें।{'\n'}
            </Text>

            <Text style={styles.text}>
              इस ऐप का उपयोग करके, आप ऊपर दी गई सभी शर्तों और प्राइवेसी पॉलिसी से सहमत होते हैं।
            </Text>
          </ScrollView>

          <TouchableOpacity style={styles.button} onPress={onAgree}>
            <Icon name="check-circle" size={20} color="white" />
            <Text style={styles.buttonText}>मैं सहमत हूँ और आगे बढ़ें</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TermsAndConditionsModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: '#444',
  },
  content: {
    marginVertical: 10,
  },
  text: {
    fontSize: 14,
    color: '#555',
    marginTop: 6,
  },
  button: {
    backgroundColor: color.purple,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
