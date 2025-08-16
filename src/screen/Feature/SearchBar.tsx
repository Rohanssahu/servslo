import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SearchBar = ({ searchText, setSearchText, onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const widthAnim = useRef(new Animated.Value(50)).current;

  const toggleSearch = () => {
    if (isOpen) {
      // Close search bar
      Animated.timing(widthAnim, {
        toValue: 50,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsOpen(false));
    } else {
      // Open search bar to full width
      setIsOpen(true);
      Animated.timing(widthAnim, {
        toValue: SCREEN_WIDTH - 24, // full width minus margins
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { width: widthAnim, borderWidth: isOpen ? 2 : 0 },
      ]}
    >
      <LinearGradient
        colors={['#6E39F7', '#8E57FF', '#B78CFF']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconWrapper}
      >
        <TouchableOpacity onPress={toggleSearch}>
          <Icon name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {isOpen && (
        <TextInput
          placeholder="Search service (e.g. plumber, cleaning)"
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.input}
          autoFocus
          onSubmitEditing={onSearch}
        />
      )}
    </Animated.View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
   
    paddingHorizontal: 6,
    borderColor: '#6E39F7',
    overflow: 'hidden',
    margin: 12,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    color: '#000',
    fontSize: 16,
    marginLeft: 8,
  },
});
