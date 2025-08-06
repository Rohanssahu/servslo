import React, {useState} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from './Icon';
import images, {icon} from './Image';
import {wp} from './utils/Constant';
import ScreenNameEnum from '../routes/screenName.enum';
import {image_url} from '../redux/Api';
import {cancel_booking} from '../redux/Api/apiRequests';
import {successToast} from '../configs/customToast';
import StarRating from '../screen/Feature/StarRating';

// Define the data type for each booking item
interface BookingItem {
  _id: string;
  bookingId: string;
  status: string;
  create_date: string;
}

// Define props for the component
interface BookingListProps {
  data: BookingItem[];
  loading: boolean;
  onCallPress: any;
  cancelbooking: any;
  onViewBillPress: () => void;
  onCancelPress:() => void;
  navigation:any
}

const BookingList: React.FC<BookingListProps> = ({
  data,
  onCancelPress,
  onCallPress,
  loading,
  navigation
}) => {
  const formatDateTime = isoDate => {
    const date = new Date(isoDate);

    // Extract date components
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    // Extract time components
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    // Format final string
    return `${day}-${month}-${year} ${hours}:${minutes} ${amPm}`;
  };

  return (
    <FlatList
      data={data}
      keyExtractor={item => item._id}
      contentContainerStyle={styles.listContainer}
      renderItem={({item,index}) => (
        <TouchableOpacity 
        onPress={()=>{
          navigation.navigate(ScreenNameEnum.BookingDetails)
        }}
        style={[styles.card,{}]}>
          <View
            style={{
              backgroundColor:index == 1?'#489648': index ===2 ?'#f05e48': '#ffa500',
              minHeight: 160,
              width: '30%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon source={images.broom} size={45} style={{tintColor: '#fff'}} />

            <Text
              style={{
                fontWeight: '700',
                color: '#000',
                fontSize: 18,
                marginTop: 15,
              }}>
              ROOM
            </Text>
            <Text
              style={{
                fontWeight: '800',
                color: '#000',
                fontSize: 18,
              }}>
              105
            </Text>
          </View>
          <View style={{width: '70%', paddingHorizontal: 10}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{color: '#000', fontWeight: '700', fontSize: 17}}>
                BI-0001
              </Text>

              <Text style={{color: '#2e9300', fontWeight: '700', fontSize: 17}}>
                CONFIRMED
              </Text>
            </View>
            <Text
              style={{
                fontWeight: '700',
                color: '#000',
                fontSize: 18,
              }}>
              NEW SHARDA GIRLS HOSTEL
            </Text>
            <StarRating rating={4.5} />
            <View style={styles.locationRow}>
              <Icon
                source={icon.pin}
                size={16}
                style={{tintColor: '#4A3AFF'}}
              />
              <Text style={styles.locationText}>SUKHSAGAR NAGAR, KATRAJ</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
              
                alignItems: 'center',
              }}>
           <FontAwesome
              name="bed"
              size={20}
              color={'#28a745'}
              style={styles.bedIcon}
            />

              <Text style={{color: '#000', fontWeight: '700', fontSize: 17}}> :  1 SEAT
              </Text>
            </View>
           
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  bedIcon:{

  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  locationText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 13,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#f5f5f5',
    marginBottom: 15,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  value: {
    fontSize: 16,
    color: '#eb2c3c', // Light gray text
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  footer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  callButton: {
    padding: 10,
    borderRadius: 30,
    position: 'absolute',
    right: 0,
    bottom: 10,
  },
  billButton: {
    backgroundColor: '#eb2c3c',
    paddingVertical: 12,
    marginTop: 30,
    borderRadius: 8,
    width: wp(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  billText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default BookingList;
