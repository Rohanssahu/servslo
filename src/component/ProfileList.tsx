import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import Icon from './Icon';
import { icon } from './Image';
import LogoutModal from '../screen/modal/LogoutModal';
import ScreenNameEnum from '../routes/screenName.enum';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the data type for menu items
interface MenuItem {
  id: string;
  title: string;
  icon: any;
  screen: string;
}

// Define props for the component
interface ProfileMenuListProps {
  data: MenuItem[];
}

// Profile menu list component
const ProfileMenuList: React.FC<ProfileMenuListProps> = ({ data }) => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}

            onPress={async () => {

              
             if (item.title !== 'Logout' && item.title !== 'Send Feedback' && item.title !== 'Help') {

                navigation.navigate(item.screen)
              }
              else if (item.title === 'Send Feedback') {
                Linking.openURL('mailto:feedback@roomji.com?subject=Feedback&body=Hi RoomJi Team,');
              }
              else if (item.title === 'Help') {
                Linking.openURL('mailto:support@roomji.com?subject=Feedback&body=Hi RoomJi Team,');
              }
             
            }}

          >
            <Icon source={item.icon} size={25} style={{}} />
            <Text style={styles.text}>{item.title}</Text>
            <Icon size={24} source={icon.rightarrow}  style={styles.icon}/>
          </TouchableOpacity>
        )}
      />

      <LogoutModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={() => {
          setIsModalVisible(false);
          navigation.navigate(ScreenNameEnum.LOGIN_SCREEN)
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom:10,
  },
  
  icon: {
    marginRight:5,
    tintColor:'#000'
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical:12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  text: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 15,
  },
  
});

export default ProfileMenuList;
