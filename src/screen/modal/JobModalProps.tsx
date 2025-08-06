import React from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {hp} from '../../component/utils/Constant';
import {color} from '../../constant';
interface JobModalProps {
  visible: boolean;
  onAccept: () => void;
  onReject: () => void;
}

const JobRequestModal: React.FC<JobModalProps> = ({
  visible,
  onAccept,
  onReject,
}) => {
  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View
            style={{
              width: '100%',
              borderBottomWidth:1,
              borderColor:'#ccc',
              paddingVertical:30
              
            }}>
            <Text style={styles.timerLabel}>पकरीकरण भरने के लिए समय रहो:</Text>
            <Text style={styles.timer}> 00:12</Text>
          </View>
          <View
            style={{
              width: '100%',
              borderBottomWidth:1,
              borderColor:'#ccc',
              paddingVertical:30
              
            }}>
          <Text style={styles.title}>वर्किंग अनुरोध</Text>

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={25} color={color.purple} />
            <Text style={styles.locationText}>हबी मंतील, अवप नर, भौतीनर</Text>
          </View>

          <Text style={styles.time}>
            आज <Text style={{color: '#1E88E5'}}>11:00 AM</Text>
          </Text>
</View>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Expected Earning</Text>
            <Text style={styles.amount}>₹300</Text>
          </View>

          <Text style={styles.performanceTitle}>मासिक प्रदर्शन</Text>

          <View style={styles.ratingRow}>
            <Text style={styles.star}>⭐</Text>
            <Text style={styles.rating}>4.5</Text>
            <Text style={styles.source}>Jornlan Jobs</Text>
          </View>
          <Text style={styles.jobsCount}>12 कॉमर्सिनी जॉब्स</Text>

          <TouchableOpacity style={styles.acceptBtn} onPress={onAccept}>
            <Text style={styles.acceptText}>स्वीकार करें</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectBtn} onPress={onReject}>
            <Text style={styles.rejectText}>अस्वीकार करें</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default JobRequestModal;
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 5,
    height: hp(90),
    paddingVertical:30
  },
  timerLabel: {
    color: color.purple,
    fontSize: 24,

    fontWeight: '700',
  },
  timer: {
    fontSize: 28,
    fontWeight: 'bold',
    color: color.purple,

    marginVertical: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
    color: color.purple,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 20,
    color: color.purple,
  },
  time: {
    marginBottom: 10,
    fontSize: 20,
    color: color.purple,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth:1,
    borderColor:'#ccc',
    paddingVertical:20
  },
  label: {
    fontSize: 24,
    color: color.purple,
  },
  amount: {
    fontSize: 24,
    fontWeight: '600',
    color: color.purple,
  },
  performanceTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 8,
    color: color.purple,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 25,
    color: '#FFD700',
    marginRight: 4,
  },
  rating: {
    fontSize: 25,
    fontWeight: '500',
    marginRight: 4,
  },
  source: {
    fontSize: 25,
    color: '#666',
  },
  jobsCount: {
    fontSize: 20,
    color: color.purple,
    marginVertical: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptBtn: {
    height: 60,
    backgroundColor: '#108c5a',
    padding: 12,
    borderRadius: 6,
    marginRight: 8,
    marginTop:20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize:20
  },
  rejectBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    marginTop: 20,
    backgroundColor: '#d1453e',
    padding: 12,
    borderRadius: 6,
  },
  rejectText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize:20
  },
});
