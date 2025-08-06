import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Icon from './Icon';
import { icon } from './Image';
import { color } from '../constant';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onFilterpress: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Search', value,onFilterpress, onChangeText }) => {
  return (
    <View style={styles.container}>
      <Icon  size={20}  source={icon.search} style={{tintColor:'#000'}} />
      <TextInput
  style={styles.input}
  placeholder={placeholder}
  placeholderTextColor="#A0A3BD"
  value={value}
  editable={false} // <- disable direct input
  pointerEvents="none" // <- allow parent touch to trigger
/>

      <TouchableOpacity
      onPress={onFilterpress}
      style={{
      backgroundColor:color.buttonColor,marginRight:-8,
      height:30,width:30,borderRadius:5,alignItems:'center',justifyContent:'center'
      }}
      >
      <Icon  
      source={icon.filter1}  size={20} style={{tintColor:'#fff'}}
      />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
   
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    width: '100%',
    backgroundColor: '#f5f5f5',
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4,
elevation: 3,

  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft:5
  },
});

export default SearchBar;
