import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {color} from '../../constant';
import {hp} from '../../component/utils/Constant';
const helpItems = [
  {
    title: 'बुकिंग रद्द हो गई लेकिन राशि नहीं मिली',
    description:
      'यदि आपने सेवा रद्द की और अभी तक भुगतान नहीं मिला है, कृपया अपनी बैंक डिटेल्स और बुकिंग आईडी के साथ सपोर्ट टीम से संपर्क करें।',
  },
  {
    title: 'रिफंड नहीं आया',
    description:
      'रिफंड प्रोसेस में 5-7 कार्य दिवस लग सकते हैं। फिर भी कोई समस्या हो तो हमें जानकारी दें।',
  },
  {
    title: 'कस्टमर ने गलत जानकारी दी',
    description:
      'इस स्थिति में बुकिंग का विवरण और सबूत साझा करें ताकि हम उचित कार्रवाई कर सकें।',
  },
  {
    title: 'सेवा में समस्या आई',
    description:
      'यदि सेवा के दौरान कोई तकनीकी या अन्य समस्या आई हो, तो आप हमारी टीम से तुरंत सहायता ले सकते हैं।',
  },
  {
    title: 'अन्य समस्याएं',
    description:
      'यदि आपको किसी अन्य प्रकार की समस्या है, तो कृपया पूरा विवरण हमें भेजें। हम आपकी मदद करेंगे।',
  },
];

const HelpSupportScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>सहायता और समर्थन</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView style={{}}>
        {helpItems.map((item, index) => (
          <View key={index} style={styles.card}>
              <Ionicons name="help-circle-outline" size={30} color={color.purple}/>
            <View style={styles.row}>
              <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.button}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color={color.purple} />
          <Text style={styles.buttonText}>चैट सपोर्ट से संपर्क करें</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default HelpSupportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: color.purple,
    flexDirection: 'row',
    alignItems: 'center',
    height: hp(10),
    padding: 12,
    borderRadius: 10,
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  headerText: {color: '#fff', fontSize: 20, fontWeight: '600'},
  iconTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    flexDirection:'row'
  },
  row: {
width:'90%',
  marginLeft:10,
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
 
    color: color.purple,
    
  },
  description: {
    fontSize: 14,
    color: color.purple,
   
  },
  button: {
    marginTop: 24,
    flexDirection: 'row',
    padding: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  buttonText: {
    color: color.purple,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
});
