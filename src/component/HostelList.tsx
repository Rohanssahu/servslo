import React, { useState } from 'react';
import { View, FlatList, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { image_url } from '../redux/Api';
import images, { icon } from './Image';
import Icon from './Icon';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../routes/screenName.enum';

// Define the data type for each garage item
interface GarageItem {
  id: string;
  shopName: string;
  address: string;
  latitude: string;
  longitude: string;
  shopImages: any;
}

// Define props for the component
interface HostelListProps {
  data: GarageItem[];
  horizontal:boolean
}

const SCREEN_WIDTH = Dimensions.get('window').width;

const HostelList: React.FC<HostelListProps> = ({ data,horizontal=true }) => {

  const [Favrate ,setFavrate] = useState(false)
  const navigation = useNavigation()
  return (
    <FlatList
      data={data}
      horizontal={horizontal}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item,index }) => (
        <TouchableOpacity 
        onPress={()=>{
          navigation.navigate(ScreenNameEnum.HostelDetailsScreen)
        }}
        style={styles.card}>
          <Image
            source={index > 1?images.bannerimg:images.Image2}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.textContainer}>
            <View style={{
              flexDirection:'row',
              justifyContent:'space-between',
              alignItems:'center'
            }}>
            
            <View style={styles.row}>
              <Text style={styles.title}>Golden Leaf Hostel</Text>
              <Text style={styles.address}>Upper indira nagar , NT 0870, Bibwewadi</Text>
            </View>
            <View style={{
              flexDirection:'row',
              justifyContent:'space-between',
              alignItems:'center'
            }}>
<Icon size={20}  source={icon.star}  />
            <Text style={styles.rating}>4.5</Text>
            </View>
            </View>
            <Text style={styles.rent}>RENT - 4.5K /MONTH</Text>


          </View>

          <TouchableOpacity 
          onPress={()=>{
            setFavrate(Favrate=>!Favrate)
          }}
          style={{
            position:'absolute',
            top:20,right:20
          }}>
            <Icon source={Favrate?icon.favactiove: icon.fav}  size={40}/>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 230,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  textContainer: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  row: {
    
    
    marginTop: 4,
  },
  address: {
    fontSize: 12,
    color: '#6B6B6B',
    flex: 1,
  },
  rating: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    marginLeft:10
  },
  rent: {
    color: '#5B3CFD',
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default HostelList;
