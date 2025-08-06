import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { color } from '../constant';


interface CategoryHeaderProps {
    title: string;
    onSeeAllPress?: () => void;
    styleContainer:any
    styleSeeall:any
    styleTitle:any
}

const SeeallHeader: React.FC<CategoryHeaderProps> = ({styleSeeall, styleTitle,title, onSeeAllPress,styleContainer }) => {
    return (
        <View style={[styles.container,styleContainer]}>
            {/* Category Title */}
            <Text style={[styles.title,styleTitle]}>{title}</Text>

            {/* See All Button */}
            {onSeeAllPress && (
                <TouchableOpacity onPress={onSeeAllPress}>
                    <Text style={[styles.seeAllText,styleSeeall]}>See all</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
       
        backgroundColor:'#fff',
        marginTop:20
 
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    seeAllText: {
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
    },
});

export default SeeallHeader;
