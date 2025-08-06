import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { hp } from '../../component/utils/Constant';
import { color } from '../../constant';
import ApprovalWaitingModal from '../modal/ApprovalWaitingModal';

const JobDetailsScreen = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState(1); // 1: Details, 2: Arrived, 3: OTP, 4: Done
  const [otp, setOtp] = useState(['', '', '', '']);
  const [doneOtp, setDoneOtp] = useState(['', '', '', '']);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isWaitingForApproval, setisWaitingForApproval] = useState(false);

  const [subStep, setSubStep] = useState(null); // null | 'start' | 'extra'
  
  const handleArrive = () => setStep(2);
  const handleProceedToOtp = () => setStep(3);
  const handleSubmitOtp = () => setStep(4);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            {/* Step 1: Job Details */}
            <View style={styles.row}>
                <TouchableOpacity style={{
                    height:50,width:50,borderRadius:25,backgroundColor:color.purple,alignItems:'center',justifyContent:'center'
                }}>

              <Icon name="volume-high" size={30} 
              
              color="#fff" />
                </TouchableOpacity>
              <Text style={styles.voiceText}>काप स्वीकार है</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.name}>Pooja Sharma</Text>
              <Text style={styles.address}>246 Balram Ngr, Aligarh</Text>
              <Text style={styles.time}>Today at 11:30 AM</Text>
            </View>

            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 27.8974,
                longitude: 78.088,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}>
              <Marker coordinate={{ latitude: 27.8974, longitude: 78.088 }} />
            </MapView>

            <TouchableOpacity style={styles.button} onPress={handleArrive}>
              <Text style={styles.buttonText}>Arrive</Text>
            </TouchableOpacity>
          </>
        );

      case 2:
        return (
          <>
              <View style={styles.row}>
                <TouchableOpacity style={{
                    height:50,width:50,borderRadius:25,backgroundColor:color.purple,alignItems:'center',justifyContent:'center'
                }}>

              <Icon name="volume-high" size={30} 
              
              color="#fff" />
                </TouchableOpacity>
              <Text style={styles.voiceText}>परिदेक्ष मकान तक पहुंचें</Text>
            </View>
           
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 27.8974,
                longitude: 78.088,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}>
              <Marker coordinate={{ latitude: 27.8974, longitude: 78.088 }} />
            </MapView>
            <Text style={styles.reachTime}>11:13 AM</Text>

            <TouchableOpacity style={styles.button} onPress={handleProceedToOtp}>
              <Text style={styles.buttonText}>पहुंचें</Text>
            </TouchableOpacity>
          </>
        );

      case 3:
        return (
          <>
      
           
            <View style={styles.row}>
                <TouchableOpacity style={{
                    height:50,width:50,borderRadius:25,backgroundColor:color.purple,alignItems:'center',justifyContent:'center'
                }}>

              <Icon name="volume-high" size={30} 
              
              color="#fff" />
                </TouchableOpacity>
              <Text style={styles.voiceText}>निष्पादन पूरा करने के लिए OTP दर्ज करें</Text>
            </View>
            <View style={styles.otpRow}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(text) => {
                    const newOtp = [...otp];
                    newOtp[index] = text;
                    setOtp(newOtp);
                  }}
                  maxLength={1}
                  keyboardType="number-pad"
                />
              ))}
            </View>
            <TouchableOpacity>
              <Text style={styles.resend}>OTP पुनः भेजें</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleSubmitOtp}>
              <Text style={styles.buttonText}>सबमिट करें</Text>
            </TouchableOpacity>
          </>
        );
        case 4:
         
            return (
              <>
                <View style={styles.row}>
                  <TouchableOpacity style={styles.speakerBtn}>
                    <Icon name="volume-high" size={30} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.voiceText}>क्या आप कार्य शुरू करना चाहते हैं या अतिरिक्त कार्य जोड़ना है?</Text>
                </View>
                <MapView
              style={[styles.map,{height:350}]}
              initialRegion={{
                latitude: 27.8974,
                longitude: 78.088,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}>
              <Marker coordinate={{ latitude: 27.8974, longitude: 78.088 }} />
            </MapView>
            <Text style={styles.reachTime}>11:13 AM</Text>
                <View style={{ marginTop: 80, alignItems: 'center' }}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      setSubStep('start');
                      setStep(6); // Directly move to Done
                    }}>
                    <Text style={styles.buttonText}>काम शुरू करें</Text>
                  </TouchableOpacity>
        
                
                  <TouchableOpacity style={[styles.button,{bottom:-20}]} onPress={()=>{
setStep(5)
                  }}>
              <Text style={styles.buttonText}>अतिरिक्त कार्य जोड़ें</Text>
            </TouchableOpacity>

      
                </View>

                
              </>
            );
          
        
          case 5:
            return (
              <>
                <View style={styles.row}>
                  <TouchableOpacity style={styles.speakerBtn}>
                    <Icon name="volume-high" size={30} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.voiceText}>अतिरिक्त कार्य विवरण दर्ज करें</Text>
                </View>
        
                <View style={{ paddingHorizontal: 20 }}>
                  <Text style={styles.bigText}>Estimated Extra Cost (₹)</Text>
                  <TextInput
                    placeholder="e.g. 350"
                    keyboardType="numeric"
                    style={[styles.otpInput, { width: '100%', height: 50 }]}
                    placeholderTextColor={color.purple}
                  />
        
                  <Text style={[styles.bigText, { marginTop: 20 }]}>काम की तस्वीरें जोड़ें</Text>
                  <TouchableOpacity style={{
                    borderWidth: 1, borderColor: '#888',
                    borderRadius: 10, padding: 12, alignItems: 'center', marginVertical: 10
                  }}>
                    <Text style={{ fontSize: 16,color:color.purple }}>📷 Upload Photo</Text>
                  </TouchableOpacity>
                </View>
        
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    // send estimate to backend → customer gets prompt
                 setisWaitingForApproval(true)
                  }}
                >
                  <Text style={styles.buttonText}>अनुमोदन माँगे</Text>
                </TouchableOpacity>
                <ApprovalWaitingModal visible={isWaitingForApproval}   setStep={()=>{
                  setisWaitingForApproval(false);
                  setStep(6)
                }}/>


              </>
            );
          

            case 6:
              return (
                <View style={styles.section}>
                  <Text style={styles.heading}>काम चालू है</Text>
                  <Text style={styles.subText}>
                    सेवा प्रदाता ने कार्य शुरू कर दिया है। कृपया कार्य पूर्ण होने पर नीचे दिए गए बटन को दबाएं।
                  </Text>
            
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setStep(7)} // OTP वाले स्टेप पर जाए
                  >
                    <Text style={styles.buttonText}>कार्य पूरा हुआ</Text>
                  </TouchableOpacity>
                </View>
              );
            

          case 7: return (
            <>
            
      
           
      <View style={styles.row}>
          <TouchableOpacity style={{
              height:50,width:50,borderRadius:25,backgroundColor:color.purple,alignItems:'center',justifyContent:'center'
          }}>

        <Icon name="volume-high" size={30} 
        
        color="#fff" />
          </TouchableOpacity>
        <Text style={styles.voiceText}>काम पूरा करने के लिए OTP दर्ज करें</Text>
      </View>
      <View style={styles.otpRow}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            value={digit}
            onChangeText={(text) => {
              const newOtp = [...otp];
              newOtp[index] = text;
              setOtp(newOtp);
            }}
            maxLength={1}
            keyboardType="number-pad"
          />
        ))}
      </View>
      <Text style={styles.subText}>
                  ग्राहक से प्राप्त OTP दर्ज करें ताकि कार्य को पूर्ण माना जा सके।
                </Text>
      <TouchableOpacity>
        <Text style={styles.resend}>OTP पुनः भेजें</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={()=>{
        setStep(8)
      }}>
        <Text style={styles.buttonText}>सबमिट करें</Text>
      </TouchableOpacity>
    </>
       
          );
          
              
      case 8:
        return (
            <>
            <View style={styles.row}>
              <TouchableOpacity
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 25,
                  backgroundColor: color.purple,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="volume-high" size={30} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.voiceText}>नौकरी पूरी हो गई</Text>
            </View>
          
            <View style={styles.ratingBox}>
              <Text style={styles.ratingText}>Vijay Patel{'\n'}Fan Repair</Text>
              <Text style={styles.address}>246 Balram Ngr, Aligarh</Text>
              <Text style={styles.time}>आज, सुबह 11:30 बजे</Text>
            </View>
          
            {/* 5 Feedback Questions */}
            <View style={{paddingHorizontal:25}}>
            {[
              'आपको सेवा की गुणवत्ता कैसी लगी?',
              
              'सेवा प्रदाता का व्यवहार कैसा रहा?',
              'क्या कार्यस्थल की साफ़-सफ़ाई का ध्यान रखा गया?',
              'क्या आप भविष्य में इस सेवा को दोबारा लेना चाहेंगे?',
            ].map((question, index) => (
              <View key={index} style={styles.questionBlock}>
                <Text style={styles.questionText}>{question}</Text>
                <View style={styles.starRow}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon
                      key={i}
                      name="star"
                      size={30}
                      color={i < 4 ? color.purple : '#ccc'} // optional: controlled via state
                    />
                  ))}
                </View>
              </View>
            ))}
            </View>
          
            <TouchableOpacity style={styles.button}   onPress={() => {
    setShowCompletionModal(true); // show success modal
  }}>

              
            
              <Text style={styles.buttonText}>सबमिट करें</Text>
            </TouchableOpacity>
          </>
          
        );

      default:
        return null;
    }
  };

  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Job Details</Text>
        <View style={{ width: 24 }} />
      </View>

      {renderStep()}
      {showCompletionModal && (
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>
      <Image
        source={require('../../assets/icons/checked.png')} // ✅ image path
        style={{ width: 120, height: 120, marginBottom: 30 }}
      />
      <Text style={styles.modalText}>काम सफलतापूर्वक पूरा हो गया</Text>
      <Text style={[styles.modalText, { fontSize: 18, marginTop: 6 }]}>
        बुकिंग स्थिति: सम्पन्न
      </Text>
      <TouchableOpacity
        style={[styles.button, { marginTop: 20 }]}
        onPress={() => {
          setShowCompletionModal(false);
          navigation.goBack();
        }}>
        <Text style={styles.buttonText}>होम जाएं</Text>
      </TouchableOpacity>
    </View>
  </View>
)}

    </View>
  );
};

export default JobDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', },
  
  header: {
    backgroundColor: color.purple,
    flexDirection: 'row',
    alignItems: 'center',
    height:hp(10),
    padding: 12,
    borderRadius: 10,
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  headerText: { color: '#fff', 
    fontSize: 20, fontWeight: '600' },
  row: { 
    marginTop:20,
    alignSelf:'center',
    flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  voiceText: { fontSize: 28, textAlign:'center',width:'60%',
    fontWeight: '600', color: color.purple, marginLeft: 8 },
  infoBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  name: { fontSize: 22, fontWeight: '700', color: '#000' },
  address: { fontSize: 20, color: '#444', marginTop: 2 },
  time: { fontSize: 20, color: '#666', marginTop: 4 },
  map: { height:hp(80), borderRadius: 12, marginBottom: 20 },
  button: {
    backgroundColor: color.purple,
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 20,
    width: '60%',
    alignItems: 'center',
    alignSelf:'center',

    position:'absolute',bottom:60
  },
  buttonText: { 
    color: '#fff', fontSize:20, fontWeight: '600' },
  bigText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: color.purple,
  },
  reachTime: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 12,
    color: color.purple,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 16,
    marginTop:hp(15),
    alignSelf:'center',width:'60%'
  },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 1,
    borderColor: '#888',
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 8,
  },
  speakerBtn: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: color.purple,
    alignItems: 'center',
    justifyContent: 'center',
  }
,    section: {
  padding: 24,
  backgroundColor: '#ffffff',
  flex: 1,
  justifyContent: 'center',
},
heading: {
  fontSize: 20,
  fontWeight: 'bold',
  color: color.purple,
  marginBottom: 12,
  textAlign: 'center',
},
subText: {
  fontSize: 16,
  color: color.purple,
  marginBottom: 20,
  textAlign: 'center',
},

  resend: {
    color: '#4B2AAD',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '700',
    fontSize:20
  },
  questionBlock: {
    marginVertical: 10,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: color.purple,
  },
  
  ratingBox: {
    backgroundColor: '#fff',
    padding: 25,
    marginVertical: 12,
    borderRadius: 10,

  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '90%',
    height:hp(45)
  },
  modalText: {
    fontSize: 20,
    fontWeight: '700',
    color: color.purple,
    textAlign: 'center',
  },
  
  ratingText: { fontSize: 25, 
    fontWeight: '600',  },
  ratingSub: { fontSize: 22, color: '#555', marginVertical: 6 },
  starRow: { flexDirection: 'row', marginTop: 8 },
});
