import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {color} from '../../constant';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {hp} from '../../component/utils/Constant';
const videoData = [
  {
    id: 1,
    title: '1. अकाउंट कैसे बनाएं',
    description: 'जानिए कैसे एक partner अकाउंट बनता है और प्रोफाइल पूरी करें।',
    videoUrl: 'https://www.youtube.com/watch?v=VIDEO1',
    thumbnail: require('./download.jpeg'),
  },
  {
    id: 2,
    title: '2. सर्विस कैसे स्वीकारें',
    description: 'बुकिंग आने पर उसे accept करना और जानकारी देखना।',
    videoUrl: 'https://www.youtube.com/watch?v=VIDEO2',
    thumbnail: require('./download.jpeg'),
  },
  {
    id: 3,
    title: '3. काम कैसे शुरू और पूरा करें',
    description: 'काम शुरू करने, लाइव ट्रैकिंग और पूरा करने का तरीका।',
    videoUrl: 'https://www.youtube.com/watch?v=VIDEO3',
    thumbnail: require('./download.jpeg'),
  },
  {
    id: 4,
    title: '4. पेमेंट और रेटिंग कैसे मिलेगी',
    description: 'कमाई और रिव्यू/रेटिंग पाने की जानकारी।',
    videoUrl: 'https://www.youtube.com/watch?v=VIDEO4',
    thumbnail: require('./download.jpeg'),
  },
];

const HowToUseScreen = () => {
  const navigation = useNavigation();

  const handleVideoPress = url => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>ऐसे करें ऐप का उपयोग</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView style={{}}>
        {videoData.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => handleVideoPress(item.videoUrl)}>
           
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
              <View style={styles.watchBtn}>
                <Ionicons name="play-circle" size={24} color={color.purple} />
                <Text style={styles.watchText}>वीडियो देखें</Text>
              </View>
              <Image source={item.thumbnail} style={styles.thumbnail} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: color.black,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
   
  },
  thumbnail: {
    width: '100%',
    height: 180,
  
  },
  cardContent: {
    padding: 15,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  cardDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  watchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  watchText: {
    color: color.purple,
    marginLeft: 8,
    fontWeight: '600',
  },
});

export default HowToUseScreen;
