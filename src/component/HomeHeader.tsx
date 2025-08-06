import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { icon } from './Image';
import { color } from '../constant';
import Icon from './Icon';


interface HomeHeaderProps {
    navigation: StackNavigationProp<any, any>;
    location: string;
    hasNotifications?: boolean;
    onLocationPress?: () => void;
    onNotificationPress?: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ 
    navigation, 
    location, 
    hasNotifications = false, 
    onLocationPress, 
    onNotificationPress 
}) => {
    return (
        <View style={styles.container}>
            {/* Location Section */}
            <View>

            <Text style={{fontWeight:'600',fontSize:20,color:'#fff',marginLeft:5,marginVertical:5}}>{'Home'}</Text>
            <TouchableOpacity onPress={onLocationPress} style={styles.locationContainer}>
                <Image source={icon.pin} style={styles.locationIcon} />
                <Text style={styles.locationText}>{location}</Text>
                <Icon source={icon.downwhite} style={{height:20,width:20}} />
            </TouchableOpacity>
            </View>
            {/* Divider */}
            <View style={{flexDirection:'row',alignItems:'center'}}>
            <View style={styles.divider} />

            {/* Notification Icon */}
            <TouchableOpacity onPress={onNotificationPress} style={styles.notificationContainer}>
                <Image source={icon.notification} style={styles.notificationIcon} />
                {hasNotifications && <View style={styles.badge} />}
            </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingBottom: 15,
        backgroundColor: '#eb2c3c',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems:'center',
        maxWidth:'70%',
    
        
       
        
    },
    locationIcon: {
        width: 20,
        height: 20,
        tintColor: '#fff',
        marginTop:2
    },
    locationText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '500',
        marginHorizontal:10
    },
    divider: {
        height: 15,
        width: 15,
      borderRadius:7.5,
        borderWidth:1,borderColor:color.borderColor,
        marginHorizontal: 15,
    },
    notificationContainer: {
        position: 'relative',
    },
    notificationIcon: {
        width: 30,
        height: 30,
        tintColor: '#fff',
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 8,
        height: 8,
        backgroundColor: 'red',
        borderRadius: 4,
    },
});

export default HomeHeader;
